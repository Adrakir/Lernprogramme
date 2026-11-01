#!/usr/bin/env python3
"""Rebuild episode 4 from saved voices; never submits synthesis or buys credits.

python revoice_folge4.py --original /path/to/original-folge-4.mp4 --work /tmp/folge4
The original illustration is the blob at commit 44e8415f18d0b1426db61ba34396116eff8bbcbc,
filme/videos/folge-4.mp4. Its authored graphic scenes may change duration; speech
samples stay at their original speed and pitch. Requires Python, numpy, scipy, FFmpeg.
"""
import argparse
import difflib
import hashlib
import json
import math
import os
import re
import subprocess
from pathlib import Path

import numpy as np
from scipy.io import wavfile

SOURCE = Path(__file__).resolve().parent
VOICES = SOURCE / 'vertonung-1-bis-4'
OUTPUT = SOURCE.parent / 'videos'
FPS = 15
# Exact scene frame boundaries recovered from the original scene-aligned SRT.
BOUNDARIES = [0, 104, 195, 286, 410, 495, 622, 718, 785, 922, 1077, 1199]


def run(args):
    return subprocess.run(list(map(str, args)), check=True, capture_output=True, text=True)


def probe(path):
    return json.loads(run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', path]).stdout)


def tokens(text):
    text = text.lower().replace('hundertachtzig', '180')
    text = re.sub(r'\b(?:equator|ecuador)\b', 'äquator', text)
    text = re.sub(r'\b(?:equators|ecuadors)\b', 'äquators', text)
    text = re.sub(r'\bnull\s+meridian', 'nullmeridian', text)
    return re.findall(r'\w+', text)


def align(master, work):
    name = master['key']
    transcript = json.loads((VOICES / (name + '_transcript.json')).read_text())
    words = transcript['words']
    actual, word_indices = [], []
    i = 0
    while i < len(words):
        chunk = words[i][2]
        last = i
        if chunk.strip().lower() == 'null' and i + 1 < len(words) and words[i+1][2].strip().lower().startswith('meridian'):
            chunk += words[i+1][2]
            last = i + 1
        for token in tokens(chunk):
            actual.append(token)
            word_indices.append((i, last))
        i = last + 1
    expected, spans = [], []
    for line in master['lines']:
        begin = len(expected)
        expected.extend(tokens(line['text']))
        spans.append((begin, len(expected)))
    matcher = difflib.SequenceMatcher(None, expected, actual, autojunk=False)
    mapping = {a+k: b+k for a, b, length in matcher.get_matching_blocks() for k in range(length)}
    aligned = []
    for line, (begin, end) in zip(master['lines'], spans):
        matched = [mapping[k] for k in range(begin, end) if k in mapping]
        coverage = len(matched) / (end-begin)
        assert coverage >= .90, (name, line['scene'], coverage)
        first, last = word_indices[matched[0]][0], word_indices[matched[-1]][1]
        aligned.append(dict(line, speech_start=words[first][0], speech_end=words[last][1],
                            recognized=' '.join(w[2].strip() for w in words[first:last+1]), coverage=coverage))
    cuts = [0.] + [(a['speech_end']+b['speech_start'])/2 for a, b in zip(aligned, aligned[1:])] + [transcript['duration']]
    sr, data = wavfile.read(VOICES / (name + '.wav'))
    assert sr == 48000 and data.dtype == np.int16
    if data.ndim == 1:
        data = np.repeat(data[:, None], 2, axis=1)
    data = data.astype(np.float32) / 32768
    rms = float(np.sqrt(np.mean(data[data != 0] ** 2)))
    gain = min(3., .115/max(rms, 1e-6))
    for i, line in enumerate(aligned):
        cin = max(cuts[i], line['speech_start']-.13)
        cout = min(cuts[i+1], line['speech_end']+.15)
        assert cin < cout
        clip = data[round(cin*sr):round(cout*sr)].copy() * gain
        fade = min(round(sr*.003), len(clip)//4)
        clip[:fade] *= np.linspace(0, 1, fade)[:, None]
        clip[-fade:] *= np.linspace(1, 0, fade)[:, None]
        dest = work / f"voice_{line['scene']:02d}.wav"
        wavfile.write(dest, sr, np.int16(np.clip(clip, -.98, .98)*32767))
        line.update(source=name+'.wav', source_in=cin, source_out=cout, gain=gain,
                    duration=len(clip)/sr, clip=str(dest), speech_speed=1.0, speech_pitch=1.0)
    return aligned


def stamp(sec):
    seconds, ms = divmod(round(sec*1000), 1000)
    minutes, seconds = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    return f'{hours:02}:{minutes:02}:{seconds:02},{ms:03}'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--original', type=Path, required=True)
    parser.add_argument('--work', type=Path, required=True)
    args = parser.parse_args()
    work = args.work.resolve()
    work.mkdir(parents=True, exist_ok=True)
    original = args.original.resolve()
    assert original != (OUTPUT / 'folge-4.mp4').resolve(), 'Use an immutable original copy'
    assert hashlib.sha1(b'blob '+str(original.stat().st_size).encode()+b'\0'+original.read_bytes()).hexdigest() == '9e47e08d33efc9f186ea20eccff45e15b3bfcf4c', 'Wrong original illustration'
    masters = [m for m in json.loads((VOICES / 'masters.json').read_text()) if m['key'].startswith('4_')]
    lines = sorted((line for m in masters for line in align(m, work)), key=lambda line: line['scene'])
    assert [line['scene'] for line in lines] == list(range(11))
    pieces, tracks, timeline, srt = [], [], [], []
    cursor = 0.
    for i, line in enumerate(lines):
        lead = .38
        tail = 3.0 if i == 9 else max(.75, min(2., len(line['text'])/17-line['duration']-lead))
        frames = math.ceil(max(4.5, lead+line['duration']+tail)*FPS)
        duration = frames/FPS
        sr, voice = wavfile.read(line['clip'])
        track = np.zeros((round(duration*sr), 2), np.float32)
        onset = round(lead*sr)
        track[onset:onset+len(voice)] = voice.astype(np.float32)/32768
        tracks.append(track)
        piece = work / f'scene_{i:02d}.mp4'
        pending = work / f'scene_{i:02d}.rendering.mp4'
        source_frames = BOUNDARIES[i+1]-BOUNDARIES[i]
        ratio = (frames-1)/(source_frames-1)
        graph = f'trim=start_frame={BOUNDARIES[i]}:end_frame={BOUNDARIES[i+1]},setpts=(PTS-STARTPTS)*{ratio:.12f},fps={FPS},setsar=1,format=yuv420p'
        run(['ffmpeg', '-nostdin', '-v', 'error', '-xerror', '-y', '-i', original, '-vf', graph, '-an',
             '-frames:v', frames, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-movflags', '+faststart', pending])
        with pending.open('rb') as handle:
            os.fsync(handle.fileno())
        assert int(probe(pending)['streams'][0]['nb_frames']) == frames
        pending.replace(piece)
        pieces.append(piece)
        speech_on = cursor+lead+line['speech_start']-line['source_in']
        speech_off = cursor+lead+line['speech_end']-line['source_in']
        assert cursor <= speech_on < speech_off <= cursor+duration
        srt.extend([str(i+1), f'{stamp(speech_on)} --> {stamp(speech_off)}', line['role']+': '+line['text'], ''])
        entry = {k: v for k, v in line.items() if k != 'clip'}
        entry.update(sequence_start=cursor, sequence_end=cursor+duration, speech_on=speech_on,
                     speech_off=speech_off, graphic_source_in_frame=BOUNDARIES[i],
                     graphic_source_out_frame=BOUNDARIES[i+1], graphic_duration_ratio=ratio)
        timeline.append(entry)
        cursor += duration
        print('Rendered scene', i+1, '/ 11; total', round(cursor, 2), 'seconds', flush=True)
    concat = work/'episode.ffconcat'
    concat.write_text('ffconcat version 1.0\n'+''.join(f"file '{p.as_posix()}'\n" for p in pieces))
    picture = work/'picture.mp4'
    run(['ffmpeg', '-nostdin', '-v', 'error', '-xerror', '-y', '-safe', '0', '-f', 'concat', '-i', concat, '-c', 'copy', '-movflags', '+faststart', picture])
    picture_metadata = probe(picture)['streams'][0]
    assert int(picture_metadata['nb_frames']) == sum(round((e['sequence_end']-e['sequence_start'])*FPS) for e in timeline)
    assert abs(float(picture_metadata['duration'])-cursor) < 1/FPS
    mix = work/'mix.wav'
    wavfile.write(mix, 48000, np.int16(np.clip(np.concatenate(tracks), -.98, .98)*32767))
    measured = run(['ffmpeg', '-v', 'info', '-i', mix, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']).stderr
    loud = json.loads(measured[measured.rfind('{'):measured.rfind('}')+1])
    normalizer = 'loudnorm=I=-16:TP=-1.5:LRA=11:linear=true:'+':'.join(f'{a}={loud[b]}' for a, b in
        [('measured_I', 'input_i'), ('measured_TP', 'input_tp'), ('measured_LRA', 'input_lra'), ('measured_thresh', 'input_thresh'), ('offset', 'target_offset')])
    final = work/'folge-4-neu.mp4'
    run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', picture, '-i', mix, '-map', '0:v:0', '-map', '1:a:0',
         '-c:v', 'copy', '-af', normalizer, '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
         '-metadata', 'title=Erdkunde Folge 4 – neue Stimmen', '-movflags', '+faststart', final])
    metadata = probe(final)
    assert abs(float(metadata['format']['duration'])-cursor) < .10
    for stream in metadata['streams']:
        assert abs(float(stream['duration'])-cursor) < .10, (stream['codec_type'], stream['duration'], cursor)
    run(['ffmpeg', '-nostdin', '-v', 'error', '-xerror', '-i', final, '-f', 'null', '-'])
    (work/'Gustav_Globus_Folge4_Untertitel.srt').write_text('\n'.join(srt), encoding='utf-8')
    report = dict(duration_seconds=cursor, width=1280, height=720, fps=FPS, original_commit='44e8415f18d0b1426db61ba34396116eff8bbcbc',
                  measured_mix=loud, timeline=timeline, full_decode='passed', listening_review='not_performed',
                  transcript_review='All 11 lines aligned; phonetic ASR variants retained in recognized fields.')
    (VOICES/'folge4_timeline.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print('FINISHED', final, round(cursor, 3), flush=True)


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""Render episodes 1–3 from saved speech and textbook diagrams; no synthesis.

python revoice_folgen123.py --work /tmp/erdkunde123 [--preview]
Dependencies: numpy, scipy, Pillow, basemap, FFmpeg; see build_hd.py for map assets.
Speech remains at 1.0x. Source and sequence clocks are retained in each timeline.
"""
import argparse, difflib, functools, json, math, re, subprocess
from pathlib import Path
import numpy as np
from scipy.io import wavfile
from PIL import Image, ImageDraw, ImageFont
import build_hd as hd

ROOT=Path(__file__).resolve().parent
VOICES=ROOT/'vertonung-1-bis-4'
FPS=15
W,H=1280,720
BG='#f4f6ef'; INK='#142b43'; MUTED='#4c6273'
RED='#c93848'; GREEN='#087a70'; BLUE='#265ca5'; GOLD='#ffce40'
TITLES={1:'Unsere Erde und ihr Aufbau',2:'Äquator und Erdhalbkugeln',3:'Nullmeridian: Osten und Westen'}
POINTS={
 1:['Wie sieht die Erde aus?','Gustav erklärt es uns.','Fast eine Kugel','Nordpol – Erdachse – Südpol','Ein Blick ins Innere','Schalen der Erde','Der Erdaufbau im Modell','Wir leben auf der Erdkruste.','Als Nächstes: der Äquator'],
 2:['Zwei Hälften einer Erde','Eine gedachte Linie','Äquator: 0° Breite','Norden und Süden','Zwei gleich große Hälften','Wo liegt Deutschland?','Wo liegt Australien?','Merke: 0° Breite','Jetzt bist du dran!'],
 3:['Wie teilen wir Ost und West?','Der Nullmeridian','Greenwich bei London','Meridiane: von Pol zu Pol','0° und 180° gehören zusammen','Osthalbkugel und Westhalbkugel','Deutschland und New York','Und die vier Viertel?','Jetzt bist du dran!']}

def run(args):
 if args[0] not in ('ffmpeg','ffprobe'):raise ValueError('Only fixed media tools are allowed')
 return subprocess.run(list(map(str,args)),check=True,capture_output=True,text=True,shell=False)

@functools.lru_cache(maxsize=40)
def font(size,bold=False):
 return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans'+('-Bold' if bold else '')+'.ttf',size)

def text(im,words,xy,size=30,color=INK,bold=False,width=None,center=False):
 d=ImageDraw.Draw(im);rows=[];row=''
 for word in words.split():
  trial=(row+' '+word).strip()
  if width and d.textlength(trial,font=font(size,bold))>width and row:rows.append(row);row=word
  else:row=trial
 if row:rows.append(row)
 for j,line in enumerate(rows):
  x,y=xy
  if center:x-=d.textlength(line,font=font(size,bold))/2
  d.text((round(x),round(y+j*(size+8))),line,font=font(size,bold),fill=color)
 return len(rows)*(size+8)

def normalized(s):
 s=s.lower().replace('hundertachtzig','180').replace('nullmeridian','null meridian')
 s=re.sub(r'\bfier\b','vier',s).replace('fiertel','viertel')
 s=s.replace('fier-fiertel','vier viertel').replace('nullmaridian','null meridian').replace('glubus','globus').replace('who leaked','wo liegt').replace('estlisch','östlich').replace('westlisch','westlich')
 s=s.replace('außenflüssig','außen flüssig').replace('innenfest','innen fest').replace('gleichgroße','gleich große').replace('pole','pol').replace('meridianer','meridiane')
 s=re.sub(r'\b0\b','null',s).replace('180°','180 grad')
 s=re.sub(r'\b(?:equator|ecuador)\b','äquator',s)
 s=re.sub(r'\b(?:equators|ecuadors)\b','äquators',s)
 return re.findall(r'\w+',s)

def read_audio(path):
 if path.exists():
  sr,data=wavfile.read(path)
 else:
  path=path.with_suffix('.flac')
  data=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-f','s16le','-ac','2','-ar','48000','-']),dtype=np.int16).reshape(-1,2);sr=48000
 assert sr==48000 and data.dtype==np.int16
 if data.ndim==1:data=np.repeat(data[:,None],2,axis=1)
 return data.astype(np.float32)/32768

def align(master):
 name=master['key'];tr=json.loads((VOICES/(name+'_transcript.json')).read_text())
 words=tr['words'];actual=[];wordidx=[]
 for i,w in enumerate(words):
  for tok in normalized(w[2]):actual.append(tok);wordidx.append(i)
 expected=[];spans=[]
 for line in master['lines']:
  start=len(expected);expected.extend(normalized(line['text']));spans.append((start,len(expected)))
 matcher=difflib.SequenceMatcher(None,expected,actual,autojunk=False)
 mapping={a+k:b+k for a,b,length in matcher.get_matching_blocks() for k in range(length)}
 result=[]
 for line,(a,b) in zip(master['lines'],spans):
  matches=[mapping[k] for k in range(a,b) if k in mapping];coverage=len(matches)/(b-a)
  if coverage<.87:raise ValueError((name,line,coverage,tr['text']))
  first,last=wordidx[matches[0]],wordidx[matches[-1]]
  result.append(dict(line,speech_start=words[first][0],speech_end=words[last][1],coverage=coverage,recognized=' '.join(w[2].strip() for w in words[first:last+1]),word_start=first,word_end=last,token_start=a,token_end=b))
 cuts=[0.]+[(x['speech_end']+y['speech_start'])/2 for x,y in zip(result,result[1:])]+[tr['duration']]
 data=read_audio(VOICES/(name+'.wav'))
 rms=float(np.sqrt(np.mean(data[data!=0]**2)));peak=float(np.max(np.abs(data)))
 gain=min(3.,.115/max(rms,1e-6),.95/max(peak,1e-6))
 for i,line in enumerate(result):
  a,b=line['token_start'],line['token_end']
  begin=max(cuts[i],line['speech_start']-.14);end=min(cuts[i+1],line['speech_end']+.18)
  clip=data[round(begin*48000):round(end*48000)].copy()*gain
  f=min(144,len(clip)//4);clip[:f]*=np.linspace(0,1,f)[:,None];clip[-f:]*=np.linspace(1,0,f)[:,None]
  line.update(source=name,source_in=begin,source_out=end,gain=gain,duration=len(clip)/48000,speech_speed=1.,clip=clip)
  # Phrase cues use recognized word boundaries. Never divide words evenly in time.
  sentences=re.split(r'(?<=[.!?;])\s+',line['text'].strip());sizes=[];row=''
  for sentence in sentences:
   if row and len(row+' '+sentence)>78:sizes.append(row);row=''
   row=(row+' '+sentence).strip()
  if row:sizes.append(row)
  expanded=[]
  for phrase in sizes:
   if len(phrase)>100:
    comma=[m.end() for m in re.finditer(r'[,;:]\s*',phrase) if 35<=m.end()<=90]
    if comma:
     at=comma[-1];expanded.extend([phrase[:at].strip(),phrase[at:].strip()]);continue
   expanded.append(phrase)
  sizes=expanded
  cues=[];offset=a
  for phrase in sizes:
   count=len(normalized(phrase));matched=[mapping[k] for k in range(offset,offset+count) if k in mapping]
   if not matched:raise ValueError(('Caption without aligned speech',name,line['text'],phrase,a,b,offset,count))
   wi,wj=wordidx[matched[0]],wordidx[matched[-1]]
   cues.append(dict(text=phrase,start=words[wi][0]-begin,end=min(end,words[wj][1]+.16)-begin))
   offset+=count
  for prev,nxt in zip(cues,cues[1:]):prev['end']=min(prev['end'],nxt['start'])
  line['cues']=cues
 return result

def make_timeline(ep):
 masters=json.loads((VOICES/'masters.json').read_text());names={'123_Paul','123_Herr_Welt',str(ep)+'_Gustav',str(ep)+'_Gustav_szene4'}
 lines=[line for m in masters if m['key'] in names for line in align(m) if line['ep']==ep]
 plan=[p for p in json.loads((VOICES/'plan.json').read_text()) if p['ep']==ep]
 entries=[];all_cues=[];tracks=[];cursor=0.
 for scene in plan:
  parts=[];local=.35
  for j,p in enumerate(scene['parts']):
   matching=[x for x in lines if x['scene']==scene['scene'] and x['role']==p['role']]
   line=matching[-1].copy()
   if j:local+=3.0 if scene['quiz'] else .48
   line['local_start']=local
   for c in line['cues']:
    all_cues.append(dict(role=line['role'],text=c['text'],start=cursor+local+c['start'],end=cursor+local+c['end']))
   local+=line['duration'];parts.append(line)
  duration=math.ceil(max(3.3,local+.75)*FPS)/FPS
  track=np.zeros((round(duration*48000),2),np.float32)
  for part in parts:
   onset=round(part['local_start']*48000);clip=part['clip'];track[onset:onset+len(clip)]=clip
  entries.append(dict(ep=ep,scene=scene['scene'],start=cursor,end=cursor+duration,duration=duration,parts=parts,quiz=scene['quiz']))
  tracks.append(track);cursor+=duration
 return entries,all_cues,np.concatenate(tracks),cursor

@functools.lru_cache(maxsize=12)
def character(role):
 return hd.character(role,265)

def sphere(im,mode='',cx=700,cy=345,r=205,clat=15,clon=0,p=1):
 im.alpha_composite(hd.sphere_base(r,clat,clon,mode),(cx-r,cy-r))
 if mode in ('equator','north','south','meridians'):
  ls=np.linspace(-180,180,361);hd.geo_path(im,np.zeros_like(ls),ls,cx,cy,r,clat,clon,RED,5,p if mode=='equator' else 1)
 if mode=='meridians':
  las=np.linspace(90,-90,361)
  for lon in [0,180]:hd.geo_path(im,las,np.full_like(las,lon),cx,cy,r,clat,clon,GREEN,6,p)

def label(im,words,x,y,color=INK,size=29,width=290):text(im,words,(x,y),size,color,True,width)

def dot(im,lat,lon,labelword,cx=700,cy=345,r=205,clat=15,clon=0,dx=20,dy=-40):
 q=hd.marker(im,lat,lon,cx,cy,r,clat,clon,radius=8)
 if q:text(im,labelword,(q[0]+dx,q[1]+dy),25,INK,True,width=220)

def body(ep,i,t,entry):
 im=Image.new('RGBA',(W,H),BG);d=ImageDraw.Draw(im)
 text(im,TITLES[ep],(38,23),38,INK,True,width=1195)
 d.line((40,83,1240,83),fill='#c6d2c8',width=2)
 text(im,POINTS[ep][i],(40,112),30,INK,True,width=320)
 active=next((p for p in reversed(entry['parts']) if p['local_start']<=t),entry['parts'][0])
 tile=character(active['role']);im.alpha_composite(tile,(max(30,175-tile.width//2),245))
 text(im,active['role'],(175,530),25,MUTED,True,center=True)
 p=hd.ease((t-.35)/1.8)
 if ep==1:
  if i in (4,5,6,7):
   # A geological cross-section, explicitly schematic; crust exaggerated for visibility.
   cx,cy,r=700,345,205
   d.ellipse((cx-r,cy-r,cx+r,cy+r),fill='#846a4c')
   d.ellipse((cx-r+5,cy-r+5,cx+r-5,cy+r-5),fill='#edac5c')
   if i!=4 or p>.45:
    d.ellipse((cx-112,cy-112,cx+112,cy+112),fill='#d85b46')
    d.ellipse((cx-39,cy-39,cx+39,cy+39),fill='#ffde77')
   rows=[('Erdkruste',GREEN),('Erdmantel','#94601d'),('Äußerer Kern: flüssig','#b53d33'),('Innerer Kern: fest','#876417')]
   for j,(word,color) in enumerate(rows):
    visible=True
    if i==5:
     source=json.loads((VOICES/(active['source']+'_transcript.json')).read_text())['words']
     anchor=['außen','darunter','kern','innen'][j]
     found=[w[0]-active['source_in']+active['local_start'] for w in source[active['word_start']:active['word_end']+1] if anchor in w[2].lower()]
     visible=t>=(found[0] if found else active['local_start'])
    if visible and (i!=4 or j<2 or p>.45):
     label(im,word,960,160+j*92,color,26,280)
     targets=[(840,196),(820,265),(785,370),(721,360)]
     hd.arrow(im,(947,180+j*92),targets[j],color,3)
   text(im,'Schematische Darstellung · Erdkruste vergrößert',(700,570),20,MUTED,center=True)
   if i==7:
    hd.arrow(im,(970,140),(795,165),GREEN,4)
  else:
   sphere(im)
   if i in (2,3):
    label(im,'Nordpol',954,190,BLUE);label(im,'Südpol',954,450,BLUE)
    d.line((700,140,700,550),fill=GREEN,width=4)
    label(im,'Erdachse',954,315,GREEN)
   else:label(im,'Unsere Erde',954,285,BLUE,34)
 elif ep==2:
  sphere(im,'equator' if i in (0,1,2,7,8) else ('north' if i in (3,4,5) else 'south'),clat=0,p=p)
  if i in (2,7):label(im,'0° Breite',970,325,RED,35)
  elif i in (3,4):label(im,'Nordhalbkugel',930,185,BLUE,29);label(im,'Südhalbkugel',930,450,'#94601d',29)
  elif i==5:
   if active['role']=='Gustav':dot(im,51,10,'Deutschland',clat=0);label(im,'Nordhalbkugel',930,205,BLUE)
   else:label(im,'Überlege mit!',950,310,BLUE)
  elif i==6:
   # Australia is on the far side of a Europe-facing globe: rotate the map, never invent its position.
   im=body_australia(im)
  elif i==8:
   im=body_australia(im,answer=active['role']=='Gustav')
  else:label(im,'Äquator',970,325,RED,35)
 elif ep==3:
  if i==4:
   for cx,clon,word in [(575,0,'Nullmeridian · 0°'),(1005,180,'180°-Meridian')]:
    sphere(im,'meridians',cx=cx,cy=340,r=155,clat=10,clon=clon,p=p)
    text(im,word,(cx,530),26,GREEN,True,center=True)
  else:
   sphere(im,'meridians',clat=20,clon=-20,p=p)
   if i==2:
    dot(im,51.4779,0,'Greenwich',clat=20,clon=-20,dx=-40,dy=-55);label(im,'0° Länge',970,340,GREEN,34)
   elif i==3:
    label(im,'Nordpol',955,180,BLUE);label(im,'Südpol',955,460,BLUE);label(im,'von Pol zu Pol',955,320,GREEN,28)
   elif i==5:
    label(im,'Westen',435,555,'#7866ab',30);label(im,'Osten',810,555,GREEN,30)
    label(im,'jeweils bis 180°',950,325,INK,27)
   elif i in (6,8):
    dot(im,40.7128,-74.006,'New York',clat=20,clon=-20,dx=-15,dy=20)
    if i==6:dot(im,51,10,'Deutschland',clat=20,clon=-20,dx=15,dy=-35)
    if i==8:label(im,'Westlich!' if active['role']=='Gustav' else 'Östlich oder westlich?',950,300,GREEN,29)
   elif i==7:label(im,'Im nächsten Film: vier Erdviertel',950,260,INK,31)
   else:label(im,'Nullmeridian',950,290,GREEN,30);label(im,'0° Länge',950,350,GREEN,30)
 return im

def body_australia(im,answer=True):
 # Clear only the globe region, leaving the characters and title intact.
 ImageDraw.Draw(im).rectangle((430,115,1245,598),fill=BG)
 sphere(im,'equator',clat=-10,clon=135)
 dot(im,-25,134,'Australien',clat=-10,clon=135,dx=20,dy=5)
 label(im,'Südhalbkugel' if answer else 'Nördlich oder südlich?',950,260,'#94601d',29)
 return im

@functools.lru_cache(maxsize=256)
def caption_panel(role,words):
 im=Image.new('RGBA',(W,114),INK);d=ImageDraw.Draw(im)
 text(im,role.upper(),(30,14),18,'#80e1cf',True)
 text(im,words,(30,40),27,'white',False,width=1210)
 # Assert every caption fits two readable rows, before final encoding.
 rows=text(Image.new('RGBA',(W,114)),words,(30,40),27,'white',False,width=1210)
 assert rows<=70,(role,words)
 return im

def stamp(sec):
 whole,ms=divmod(round(sec*1000),1000);mins,s=divmod(whole,60);h,m=divmod(mins,60)
 return f'{h:02}:{m:02}:{s:02},{ms:03}'

def render(ep,work,preview=False):
 entries,cues,mix,duration=make_timeline(ep)
 for x,y in zip(cues,cues[1:]):assert x['end']<=y['start']+.001
 for cue in cues:assert 0<=cue['start']<cue['end']<=duration
 out=work/f'folge-{ep}';out.mkdir(parents=True,exist_ok=True)
 # Samples include actual captions and both hemispheres, not just opening artwork.
 for i in [0,2,5,8]:
  e=entries[i];t=min(1.4,e['duration']-.1);im=body(ep,i,t,e)
  c=next((c for c in cues if c['start']<=e['start']+t<c['end']),None)
  if c:im.alpha_composite(caption_panel(c['role'],c['text']),(0,606))
  im.convert('RGB').save(out/f'preview-{i}.jpg',quality=90)
 if preview:return
 wavfile.write(out/'mix.wav',48000,np.int16(np.clip(mix,-.98,.98)*32767))
 measured=run(['ffmpeg','-v','info','-i',out/'mix.wav','-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-']).stderr
 loud=json.loads(measured[measured.rfind('{'):measured.rfind('}')+1])
 norm='loudnorm=I=-16:TP=-1.5:LRA=11:linear=true:'+':'.join(f'{k}={loud[v]}' for k,v in [('measured_I','input_i'),('measured_TP','input_tp'),('measured_LRA','input_lra'),('measured_thresh','input_thresh'),('offset','target_offset')])
 final=out/f'folge-{ep}.mp4'
 command=['ffmpeg','-nostdin','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-i',str(out/'mix.wav'),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','veryfast','-crf','21','-pix_fmt','yuv420p','-af',norm,'-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',str(final)]
 proc=subprocess.Popen(command,stdin=subprocess.PIPE);idx=0
 try:
  for frame in range(round(duration*FPS)):
   sec=frame/FPS
   while idx<len(entries)-1 and sec>=entries[idx]['end']-1e-7:idx+=1
   e=entries[idx];im=body(ep,idx,sec-e['start'],e)
   cue=next((c for c in cues if c['start']<=sec<c['end']),None)
   if cue:im.alpha_composite(caption_panel(cue['role'],cue['text']),(0,606))
   proc.stdin.write(im.convert('RGB').tobytes())
   if frame%(FPS*15)==0:print('Episode',ep,round(sec,1),'/',round(duration,1),flush=True)
  proc.stdin.close();assert proc.wait()==0
 except BaseException:proc.kill();raise
 run(['ffmpeg','-nostdin','-v','error','-xerror','-i',final,'-f','null','-'])
 meta=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',final]).stdout)
 assert abs(float(meta['format']['duration'])-duration)<.1
 for stream in meta['streams']:assert abs(float(stream['duration'])-duration)<.1
 srt=[]
 for j,c in enumerate(cues):srt.extend([str(j+1),f"{stamp(c['start'])} --> {stamp(c['end'])}",c['role']+': '+c['text'],''])
 (out/f'Gustav_Globus_Folge{ep}_Untertitel.srt').write_text('\n'.join(srt),encoding='utf-8')
 report={'episode':ep,'duration_seconds':duration,'width':W,'height':H,'fps':FPS,'style':'Existing textbook palette and approved character artwork; exact geographic diagrams','map_geometry':'Basemap coastlines; orthographic projection from build_hd.py','speech_speed':1.,'listening_review':'not_performed','full_decode':'passed','measured_mix':loud,'cues':cues,'scenes':[]}
 for e in entries:
  entry={k:v for k,v in e.items() if k!='parts'}
  entry['parts']=[{k:v for k,v in part.items() if k!='clip'} for part in e['parts']];report['scenes'].append(entry)
 (VOICES/f'folge{ep}_timeline.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
 print('FINISHED',ep,duration,flush=True)

if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--work',required=True,type=Path);parser.add_argument('--episode',type=int,choices=[1,2,3]);parser.add_argument('--preview',action='store_true');args=parser.parse_args()
 for ep in ([args.episode] if args.episode else [1,2,3]):render(ep,args.work,args.preview)

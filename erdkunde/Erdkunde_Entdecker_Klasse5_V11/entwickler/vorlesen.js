/* Gemeinsame deutsche Sprachausgabe für Lernpfade, Comics und Atlas-Schulung. */
(function () {
  'use strict';
  const synth = window.speechSynthesis;
  const KEY = 'erdkunde-v11-vorlesen';
  const RECORDINGS = [{"text": "Drei Blickrichtungen vergleichen. Dasselbe Gebiet kann ganz unterschiedlich aussehen: in der Draufsicht von oben, in der Seitenansicht von der Seite und als vereinfachte Karte. Jede Darstellung hilft bei anderen Fragen. Merke: Frage immer zuerst: Von wo aus schaue ich auf den Ort?", "url": "audio/perspektive-1.mp3?v=20261101"}, {"text": "Seitenansicht. In der Seitenansicht erkennst du Höhe, Form und Gestalt besser, zum Beispiel ob ein Berg steil ist oder wie hoch ein Haus wirkt. Dafür siehst du die genaue Lage weniger gut. Merke: Seitenansicht hilft besonders bei Höhe, Form und Steilheit.", "url": "audio/perspektive-3.mp3?v=20261101"}, {"text": "Der Atlas hat mehrere Teile. Die Kartenübersicht und das Inhaltsverzeichnis führen zu Karten. Die Kartensammlung zeigt Regionen und Themen. Das alphabetische Register hilft bei der gezielten Suche nach Orten. Merke: Suchst du den Titicacasee? Im Register unter T nachsehen.", "url": "audio/atlanten-1.mp3?v=20261101"}, {"text": "So liest du eine Registerangabe. Beispiel „207.1, L11“: Auf der Atlas-Karte 207.1 suchst du im Planquadrat L11. Die Notation unterscheidet sich zwischen Atlanten. Merke: Die Seite und das Planquadrat gehören zusammen.", "url": "audio/atlanten-2.mp3?v=20261101"}, {"text": "Planquadrate. Buchstaben und Zahlen teilen eine Karte in leicht auffindbare Felder. Bei L11 wählst du Spalte L und Zeile 11. Merke: Ein Planquadrat gibt einen Bereich an, noch keine genaue geografische Koordinate.", "url": "audio/atlanten-3.mp3?v=20261101"}, {"text": "Informationen aus Signaturen. In einer Kartenlegende erkennst du, was Punkte, Farben, Linien und Symbole bedeuten. Suche vor dem Antworten immer die zur Karte gehörende Legende. Merke: Ein Symbol ist nicht automatisch weltweit einheitlich.", "url": "audio/atlanten-4.mp3?v=20261101"}, {"text": "Schnittpunkt finden. Ein Ort liegt dort, wo sich der gesuchte Breitengrad und der gesuchte Längengrad schneiden. In Übungsrastern helfen dir Zeile und Spalte beim Finden. Merke: Der gesuchte Ort ist der Schnittpunkt beider Linien.", "url": "audio/gradnetz-4.mp3?v=20261101"}];
  function recordingsFor(text) {
    let remaining = spokenText(text); const sequence = [];
    while (remaining) {
      const entry = RECORDINGS.find(r => remaining === spokenText(r.text) || remaining.startsWith(spokenText(r.text) + ' '));
      if (!entry) return [];
      sequence.push(entry); remaining = remaining.slice(spokenText(entry.text).length).trim();
    }
    return sequence;
  }
  function speakRecordings(sequence, options) {
    if (active?.owner === options.owner && options.owner) { stop(); return false; }
    stop();
    document.querySelectorAll('video, audio').forEach(media => { if (!media.paused) media.pause(); });
    const token = ++serial;
    active = {...options, token, label:options.button?.textContent};
    if (options.button) { options.button.textContent = 'Vorlesen stoppen'; options.button.setAttribute('aria-pressed', 'true'); }
    let index = 0;
    function next() {
      if (!active || active.token !== token) return;
      if (index === sequence.length) { finish(token, 'ended'); return; }
      const current = index++, item = sequence[current];
      const base = window.location?.protocol === 'file:' ? 'https://adrakir.github.io/Lernprogramme/erdkunde/Erdkunde_Entdecker_Klasse5_V11/' : '';
      const media = new window.Audio(base + item.url);
      active.media = media; media.playbackRate = rate() / .9; media.preservesPitch = true;
      media.onended = next;
      function failed() {
        if (!active || active.token !== token || active.media !== media) return;
        stop();
        speak(sequence.slice(current).map(r=>r.text).join(' '), {...options, systemOnly:true});
      }
      media.onerror = failed;
      try { const started = media.play(); if (started?.catch) started.catch(failed); } catch (_) { failed(); }
    }
    next(); return true;
  }
  let preferences = {}, active = null, serial = 0;
  try { preferences = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (_) {}
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function voices() {
    if (!synth) return [];
    const score = v => (/^de[-_]DE$/i.test(v.lang) ? 20 : 0) +
      (/natural|neural|premium|enhanced|online/i.test(v.name) ? 100 : 0) +
      (/anna|katja|conrad|stefan|petra|yannick/i.test(v.name) ? 10 : 0);
    return synth.getVoices().filter(v => /^de(?:[-_]|$)/i.test(v.lang))
      .sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name, 'de'));
  }
  function chooseVoice() {
    const list = voices();
    return list.find(v => v.voiceURI === preferences.voice) || list[0] || null;
  }
  function rate() { return [.75, .9, 1].includes(Number(preferences.rate)) ? Number(preferences.rate) : .9; }
  function spokenText(text) {
    const directions = {N:'Nord', S:'Süd', O:'Ost', W:'West',NO:'Nordost',SO:'Südost',SW:'Südwest',NW:'Nordwest'};
    return String(text)
      .replace(/(\d+)\s*°\s*(\d+)\s*[′']\s*(\d+)\s*[″"]/g, '$1 Grad $2 Minuten $3 Sekunden ')
      .replace(/(\d+)\s*°\s*(\d+)\s*[′']/g, '$1 Grad $2 Minuten ')
      .replace(/(\d+(?:[.,]\d+)?)\s*°\s*([NSOW])\b/g, (_, n, d) => n.replace('.', ',') + ' Grad ' + directions[d])
      .replace(/\b1\s*:\s*(\d[\d.]*)/g, (_, n) => 'eins zu ' + n.replace(/\./g, ''))
      .replace(/\b\d{1,3}(?:\.\d{3})+(?:,\d+)?\b/g, n => n.replace(/\./g, ''))
      .replace(/(?<![\p{L}\p{N}_])(NO|SO|SW|NW|N|S|O|W)(?![\p{L}\p{N}_])/gu, d => directions[d])
      .replace(/(^|[.!?]\s+)([1-9])\.\s+(?=[A-ZÄÖÜ])/g, '$1Schritt $2: ')
      .replace(/¼/g, ' ein Viertel ').replace(/½/g, ' ein Halb ').replace(/¾/g, ' drei Viertel ')
      .replace(/°/g, ' Grad ').replace(/=/g, ' bedeutet ').replace(/×/g, ' mal ').replace(/÷/g, ' geteilt durch ').replace(/%/g, ' Prozent ')
      .replace(/\s+/g, ' ').trim();
  }
  function chunks(text) {
    // Sinnabschnitte verhindern, dass Browser lange Erklärungen mitten im Satz beenden.
    // Keine Wort-für-Wort-Ausgabe und keine künstlichen Timer zwischen den Abschnitten.
    const sentences = spokenText(text).split(/(?<=[.!?])\s+/u);
    const result = []; let current = '';
    for (let sentence of sentences) {
      sentence = sentence.trim();
      if (current && current.length + sentence.length > 260) { result.push(current); current = ''; }
      while (sentence.length > 320) {
        let split = sentence.lastIndexOf(' ', 260);
        if (split < 1) split = 260;
        if (current) { result.push(current); current = ''; }
        result.push(sentence.slice(0, split)); sentence = sentence.slice(split).trim();
      }
      current += (current ? ' ' : '') + sentence;
    }
    if (current) result.push(current);
    return result;
  }
  function finish(token, reason) {
    if (!active || active.token !== token) return;
    const previous = active; active = null;
    if (previous.button) { previous.button.textContent = previous.label; previous.button.setAttribute('aria-pressed', 'false'); }
    if (reason === 'error' && previous.onError) previous.onError();
    if (previous.onFinish) previous.onFinish(reason);
  }
  function stop(owner) {
    if (owner && active?.owner !== owner) return;
    const previous = active; serial++;
    if (previous?.media) { previous.media.onended = null; previous.media.onerror = null; previous.media.pause(); previous.media.removeAttribute('src'); previous.media.load(); }
    if (previous) finish(previous.token, 'stopped');
    if (synth) synth.cancel();
  }
  function speak(text, options = {}) {
    if (!options.systemOnly && !preferences.voice && typeof window.Audio === 'function') {
      const sequence = recordingsFor(text);
      if (sequence.length) return speakRecordings(sequence, options);
    }
    if (!synth || typeof window.SpeechSynthesisUtterance !== 'function') {
      options.onError?.(); return false;
    }
    if (active?.owner === options.owner && options.owner) { stop(); return false; }
    stop();
    const parts = chunks(text); if (!parts.length) return false;
    document.querySelectorAll('video, audio').forEach(media => { if (!media.paused) media.pause(); });
    const token = ++serial;
    active = {...options, token, label:options.button?.textContent};
    if (options.button) { options.button.textContent = 'Vorlesen stoppen'; options.button.setAttribute('aria-pressed', 'true'); }
    let index = 0;
    function next() {
      if (!active || active.token !== token) return;
      if (index === parts.length) { finish(token, 'ended'); return; }
      const utterance = new window.SpeechSynthesisUtterance(parts[index++]);
      utterance.lang = 'de-DE'; utterance.rate = rate(); utterance.pitch = 1; utterance.volume = 1;
      const voice = chooseVoice(); if (voice) utterance.voice = voice;
      utterance.onend = next;
      utterance.onerror = () => finish(token, 'error');
      // Referenz behalten: vor allem Safari darf laufende Äußerungen nicht freigeben.
      active.utterance = utterance;
      try { synth.speak(utterance); } catch (_) { finish(token, 'error'); }
    }
    next(); return true;
  }
  function voiceOptions() {
    return '<option value="">Automatisch: Gustav-Aufnahme oder deutsche Gerätestimme</option>' + voices().map(v =>
      '<option value="' + escape(v.voiceURI) + '"' + (v.voiceURI === preferences.voice ? ' selected' : '') + '>' + escape(v.name) + ' (' + escape(v.lang) + ')</option>').join('');
  }
  function settingsHtml() {
    return '<fieldset class="field"><legend>Vorlesen</legend><label for="settingVoice">Deutsche Stimme</label>' +
      '<select id="settingVoice">' + voiceOptions() + '</select><label for="settingSpeechRate">Sprechtempo</label>' +
      '<select id="settingSpeechRate">' + [[.75,'Langsam'],[.9,'Ruhig'],[1,'Normal']].map(([v,t]) =>
        '<option value="' + v + '"' + (rate() === v ? ' selected' : '') + '>' + t + '</option>').join('') +
      '</select><button type="button" class="btn ghost small" data-speech-preview>Stimme anhören / stoppen</button>' +
      '<p class="mini" id="speechVoiceStatus" role="status">Automatisch verwendet geprüfte Gustav-Aufnahmen, wo verfügbar. Mit einer gewählten Gerätestimme werden alle Texte von dieser Stimme gelesen. Die Auswahl gilt auch für Comics und Atlas-Schritte.</p></fieldset>';
  }
  function readSettings() {
    const voice = document.getElementById('settingVoice'), speed = document.getElementById('settingSpeechRate');
    if (voice) preferences.voice = voice.value;
    if (speed && [.75,.9,1].includes(Number(speed.value))) preferences.rate = Number(speed.value);
  }
  function saveSettings() {
    readSettings();
    try { localStorage.setItem(KEY, JSON.stringify(preferences)); } catch (_) {}
  }
  synth?.addEventListener('voiceschanged', () => {
    const select = document.getElementById('settingVoice');
    if (select) { const chosen = select.value; select.innerHTML = voiceOptions(); select.value = chosen; }
  });
  document.addEventListener('click', event => {
    const target = event.target.closest('button, a, summary'); if (!target) return;
    if (target.hasAttribute('data-speech-preview')) {
      readSettings();
      speak('Hallo! Ich begleite dich durch Erdkunde. Wir lesen zuerst die Breite und danach die Länge.', {
        owner:'preview', button:target, onError() {
          const status = document.getElementById('speechVoiceStatus');
          if (status) status.textContent = 'Die Stimme konnte nicht abgespielt werden. Wähle eine andere deutsche Stimme.';
        }
      }); return;
    }
    const isRead = target.dataset.action?.startsWith('speak:') || target.dataset.g9 === 'speak' || target.dataset.at === 'speak';
    // Ein Wechsel darf keine alte Erklärung oder einen zweiten Sprecher weiterlaufen lassen.
    if (!isRead) stop();
  }, true);
  document.addEventListener('play', event => {
    if (event.target.matches('video, audio')) {
      stop(); document.querySelectorAll('video, audio').forEach(media => { if (media !== event.target && !media.paused) media.pause(); });
    }
  }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('pagehide', () => stop());
  window.ErdkundeSpeech = Object.freeze({speak, stop, settingsHtml, saveSettings, voices, chunks, spokenText});
})();

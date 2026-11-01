/* Gemeinsame deutsche Sprachausgabe für Lernpfade, Comics und Atlas-Schulung. */
(function () {
  'use strict';
  const synth = window.speechSynthesis;
  const KEY = 'erdkunde-v11-vorlesen';
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
    const directions = {N:'Nord', S:'Süd', O:'Ost', W:'West'};
    return String(text).replace(/(\d+(?:[.,]\d+)?)\s*°\s*([NSOW])\b/g, (_, n, d) => n.replace('.', ',') + ' Grad ' + directions[d])
      .replace(/°/g, ' Grad ').replace(/\s+/g, ' ').trim();
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
    if (previous) finish(previous.token, 'stopped');
    if (synth) synth.cancel();
  }
  function speak(text, options = {}) {
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
    return '<option value="">Automatisch: beste verfügbare deutsche Stimme</option>' + voices().map(v =>
      '<option value="' + escape(v.voiceURI) + '"' + (v.voiceURI === preferences.voice ? ' selected' : '') + '>' + escape(v.name) + ' (' + escape(v.lang) + ')</option>').join('');
  }
  function settingsHtml() {
    return '<fieldset class="field"><legend>Vorlesen</legend><label for="settingVoice">Deutsche Stimme</label>' +
      '<select id="settingVoice">' + voiceOptions() + '</select><label for="settingSpeechRate">Sprechtempo</label>' +
      '<select id="settingSpeechRate">' + [[.75,'Langsam'],[.9,'Ruhig'],[1,'Normal']].map(([v,t]) =>
        '<option value="' + v + '"' + (rate() === v ? ' selected' : '') + '>' + t + '</option>').join('') +
      '</select><button type="button" class="btn ghost small" data-speech-preview>Stimme anhören / stoppen</button>' +
      '<p class="mini" id="speechVoiceStatus" role="status">Die Auswahl gilt für Lernpfade, Comics und Atlas-Schritte. Natürlich klingende Stimmen werden bevorzugt. Die verfügbaren Stimmen hängen vom Gerät ab.</p></fieldset>';
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

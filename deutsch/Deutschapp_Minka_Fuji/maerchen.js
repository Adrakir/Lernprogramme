'use strict';
(() => {
  const root = document.getElementById('maerchen');
  const panels = [...root.querySelectorAll('[data-mf-panel]')];
  function openStep(step, focus) {
    panels.forEach(panel => panel.hidden = panel.dataset.mfPanel !== step);
    root.querySelectorAll('.mf-steps button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mfStep === step)));
    if (focus) {
      const heading = panels.find(panel => !panel.hidden).querySelector('h2');
      heading.tabIndex = -1;
      heading.focus();
    }
  }
  root.querySelectorAll('[data-mf-step]').forEach(button => button.onclick = () => openStep(button.dataset.mfStep, true));
  openStep('lesen', false);
  function openLink() { if (location.hash === '#maerchen') showPage('maerchen', false); }
  openLink();
  window.addEventListener('hashchange', openLink);

  const tasks = [
    ['Welche Stelle lässt offen, wann die Geschichte spielt?', ['„Eines Morgens schlug der Eimer auf Stein.“','„Es war einmal ein Dorf hinter sieben Hügeln.“','„Am nächsten Morgen buk der Müller sieben Brote“'], 1, '„Es war einmal“ führt in eine unbestimmte Vergangenheit.', 'Suche die Anfangsformel. Eine Tageszeit allein ist noch kein Märchenmerkmal.'],
    ['Welcher Beleg zeigt eine übernatürliche Fähigkeit?', ['Die Kröte erklärt den Freunden, warum das Wasser fehlt.','Der Müller hört das Wasser rauschen.','Die Maus scharrt im Staub.'], 0, 'Die Kröte spricht die Sprache der Freunde und kennt das Geheimnis des Tors.', 'Überlege, was ein gewöhnliches Tier im wirklichen Leben könnte.'],
    ['Was wiederholt sich dreimal und bringt die Handlung voran?', ['Die Freunde steigen in drei Brunnen hinab.','Die Kröte singt drei Lieder.','Für jede der drei Mulden wird ein Korn verschenkt.'], 2, 'Jede Gabe löst einen Riegel. Beim dritten Korn fällt das Teilen besonders schwer.', 'Verfolge das erste, das zweite und das letzte Korn bis zum Tor.'],
    ['Warum öffnet sich das Tor auch beim letzten Korn?', ['Fuji befiehlt dem Bergkönig, das Wasser freizulassen.','Beide Hälften werden verschenkt. Damit gilt die Zauberregel für das ganze Korn.','Das Tor öffnet sich jeden Morgen.'], 1, 'Minka teilt mit dem Müller. Er gibt eine Hälfte an die Kröte weiter. Die Entscheidung löst den Zauber aus.', 'Lies noch einmal den Satz der Kröte: „Was ihr verschenkt, wird zu Gold.“'],
    ['Welcher Schluss greift die Veränderung des Müllers auf?', ['Er verteilt sieben Brote im Dorf.','Er behält das letzte Korn für sich.','Er kehrt zum König zurück und fordert Gold.'], 0, 'Am Anfang behält er die Körner. Am Ende teilt er sein Brot. Seine Handlung zeigt, was er gelernt hat.', 'Vergleiche das frühere Versprechen des Müllers mit seinem Verhalten nach der Rettung.']
  ];
  const questions = root.querySelector('#mf-fragen');
  tasks.forEach(([question, answers, correct, why, hint], i) => {
    const field = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = question;
    field.append(legend);
    const feedback = document.createElement('p');
    feedback.setAttribute('role','status');
    answers.forEach((answer,index) => {
      const label = document.createElement('label');
      const radio = document.createElement('input');
      radio.type = 'radio'; radio.name = 'mf-frage-' + i;
      radio.onchange = () => feedback.textContent = index === correct ? 'Richtig. ' + why : hint;
      label.append(radio, ' ' + answer); field.append(label);
    });
    field.append(feedback); questions.append(field);
  });

  const key = 'minka-fuji.maerchen.entwurf.v1';
  const fields = [...root.querySelectorAll('[data-mf-save]')];
  const notice = root.querySelector('#mf-speicher');
  function snapshot() {
    return Object.fromEntries(fields.map(field => [field.dataset.mfSave, field.type === 'checkbox' ? field.checked : field.value]));
  }
  try {
    const draft = JSON.parse(localStorage.getItem(key)) || {};
    for (const field of fields) {
      const value = draft[field.dataset.mfSave];
      if (field.type === 'checkbox') field.checked = value === true;
      else if (typeof value === 'string') field.value = value;
    }
    notice.textContent = 'Dein Entwurf wird in diesem Browser gespeichert.';
  } catch { notice.textContent = 'Nutze den Textdownload, um deinen Entwurf zu sichern.'; }
  fields.forEach(field => field.addEventListener('input', () => {
    try { localStorage.setItem(key, JSON.stringify(snapshot())); notice.textContent = 'Entwurf auf diesem Gerät gespeichert.'; }
    catch { notice.textContent = 'Speichern im Browser ist gerade nicht möglich. Sichere deinen Text mit dem Download.'; }
  }));
  root.querySelector('#mf-export').onclick = () => {
    const s = snapshot();
    const text = [s.titel || 'Mein Märchen', s.text, 'Mein Plan', 'Figur und Wunsch: '+s.figur,'Hindernis: '+s.hindernis,'Zauberregel: '+s.regel,'Entscheidung und Folge: '+s.folge].join('\n\n');
    const url = URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a'); link.href=url; link.download='Mein-Maerchen.txt';
    root.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
  };
})();

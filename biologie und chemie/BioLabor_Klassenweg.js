(() => {
  'use strict';

  const pathways = {
    tiere: {
      title: 'Hund und Katze',
      steps: [
        ['Erklären', 'Vergleiche Zahnform und Aufgabe. Erkläre, warum Fangzähne und Reißzähne verschieden aussehen.',
          '#schulstoff/gebiss', 'Gebisse verstehen', [['#schulstoff/wolf', 'Auch Herkunft und Zucht ansehen']]],
        ['Üben', 'Beschrifte ein Gebiss selbst. Prüfe danach dein Wissen über Pfoten oder Körpersprache.',
          '#klassenarbeit/gebiss/hund', 'Gebiss beschriften', [
            ['#schulstoff/pfote', 'Pfoten und Zehengang üben'],
            ['#koerpersprache', 'Körpersprache deuten'],
            ['#schulstoff/katze', 'Körperbau der Katze üben'],
          ]],
      ],
    },
    bewegung: {
      title: 'Skelett und Bewegung',
      steps: [
        ['Erklären', 'Lies, wie Knochen, Gelenke, Sehnen und Muskeln bei einer Bewegung zusammenarbeiten.',
          '#schulstoff/bewegung', 'Bewegungssystem verstehen', [['#learn/spine', 'Wirbelsäule genauer ansehen']]],
        ['Üben', 'Finde die markierten Knochen und prüfe deine Antworten. Erkläre anschließend eine Bewegung mit eigenen Worten.',
          '#klassenarbeit/mensch', 'Skelett beschriften', [
            ['#practice/joints', 'Gelenke üben'],
            ['#schulstoff/bewegung/aufgabe-3', 'Knochen, Gelenke und Muskeln zuordnen'],
          ]],
      ],
    },
  };
  const finalStep = ['Probearbeit', 'Wähle eine der drei Arbeiten. Sie mischen Themen. Nutze danach die Auswertung, um gezielt weiterzuüben.',
    '#probetest', 'Probearbeit öffnen', [['#print', 'Probearbeit drucken']]];

  const known = id => Object.hasOwn(pathways, id);
  const stepsFor = id => [...pathways[id].steps, finalStep];
  const validStep = value => Number.isInteger(value) && value >= 0 && value < 3;
  const route = id => '#klassenweg/' + id;
  const labels = {open:'Noch offen', started:'Begonnen', done:'Erledigt'};

  function progressFor(current, track) {
    const progress = current?.progress?.[track];
    if (progress) return progress;
    // Alte Lernwege speicherten nur den zuletzt geöffneten Schritt.
    if (current?.track === track && validStep(current.step) && current.step < 2) {
      return {[current.step]:{status:'started'}};
    }
    return {};
  }

  function update(current, track, step, entry) {
    return {...current, progress:{...current?.progress,
      [track]:{...progressFor(current, track), [step]:entry}}};
  }

  function openStep(current, selection) {
    const previous = known(current?.track)
      ? {...current, progress:{...current.progress, [current.track]:progressFor(current, current.track)}} : current;
    const next = {...previous, ...selection};
    const {track,step} = selection;
    if (step === 2 || progressFor(previous, track)[step]) return next;
    return update(next, track, step, {status:'started'});
  }

  function stepStatus(current, track, step, exams) {
    if (step === 2) return exams?.[track] || 'open';
    const status = progressFor(current, track)[step]?.status;
    return status === 'done' || status === 'started' ? status : 'open';
  }

  function toggleStep(current, track, step) {
    if (!known(track) || !validStep(step) || step >= 2) return null;
    const entry = progressFor(current, track)[step];
    if (!entry || entry.practice) return null;
    return update(current, track, step, {status:entry.status === 'done' ? 'started' : 'done'});
  }

  function stepButton(current, track, step) {
    const entry = step < 2 ? progressFor(current, track)[step] : null;
    if (!entry || entry.practice) return '';
    return `<button type="button" class="btn small secondary" data-bl-finish-track="${track}"
      data-bl-finish-step="${step}">${entry.status === 'done' ? 'Erledigt zurücknehmen' : 'Schritt als erledigt markieren'}</button>`;
  }

  function practiceCompleted(current, topic, species, total, independent) {
    if (!known(current?.track) || current.step !== 1 || total < 1) return null;
    const matches = current.track === 'tiere' ? topic === 'teeth' && ['hund','katze'].includes(species)
      : topic === 'bones' && species === 'mensch';
    if (!matches) return null;
    return update(current, current.track, 1, {status:'done', practice:{
      total, independent, at:new Date().toISOString(),
    }});
  }

  function familyProgress(current, exams) {
    const track = current?.track;
    if (!known(track)) return null;
    const done = stepsFor(track).filter((_,step) => stepStatus(current, track, step, exams) === 'done').length;
    const practice = progressFor(current, track)[1]?.practice;
    return {track, title:pathways[track].title, done, practice};
  }

  function examTrack(current, to) {
    return current?.step === 2 && known(current.track) &&
      (to === 'probetest' || to.startsWith('probetest/')) ? current.track : undefined;
  }

  function stepLink(id, step, url, label, primary = false) {
    return `<a class="btn small${primary ? '' : ' secondary'}" href="${url}" data-bl-path="${id}" data-bl-path-step="${step}">${label}</a>`;
  }

  function render(id, current, exams) {
    const key = known(id) ? id : known(current?.track) ? current.track : 'tiere';
    const last = current?.track === key && validStep(current.step) ? current.step : -1;
    const done = stepsFor(key).filter((_,step) => stepStatus(current, key, step, exams) === 'done').length;
    return `<div class="bs-school bl-class-path">
      <header class="bs-heading"><h1>Ich schreibe bald eine Klassenarbeit</h1>
        <p>Wähle deinen Stoff. Beginne mit einer Erklärung, übe selbst und probiere dann eine Klassenarbeit.</p>
        <nav class="button-row" aria-label="Stoff für die Klassenarbeit">${Object.entries(pathways).map(([id, item]) =>
          `<a href="${route(id)}" class="btn small secondary"${id === key ? ' aria-current="page"' : ''}>${item.title}</a>`).join('')}</nav>
      </header>
      <p class="bl-path-total" role="status">${done} von 3 Schritten erledigt</p>
      <ol class="bl-path-steps">${stepsFor(key).map(([title, text, url, label, more], step) => {
        const status = stepStatus(current, key, step, exams);
        return `<li class="bs-panel" data-bl-path-card="${step}"${last === step ? ' aria-current="step"' : ''}><h2>${title}</h2>
          <p><span class="bl-step-state" data-state="${status}">${labels[status]}</span>
            ${last === step ? '<span class="smallnote"> · Zuletzt geöffnet</span>' : ''}</p>
          <p>${text}</p>
          ${step === 2 ? '<p class="smallnote">Die Online-Probearbeit zählt nach der Abgabe als erledigt.</p>' : ''}
          <div class="button-row">${stepLink(key, step, url, label, true)}${stepButton(current, key, step)}</div>
          <ul class="bl-path-more">${more.map(([href, caption]) =>
            `<li><a href="${href}" data-bl-path="${key}" data-bl-path-step="${step}">${caption}</a></li>`).join('')}</ul>
        </li>`;
      }).join('')}</ol>
    </div>`;
  }

  function selection(anchor) {
    const track = anchor?.dataset.blPath;
    const step = Number(anchor?.dataset.blPathStep);
    if (!known(track) || !validStep(step)) return null;
    const [, , url, , more] = stepsFor(track)[step];
    return [url, ...more.map(([href]) => href)].includes(anchor.getAttribute('href')) ? {track,step} : null;
  }

  function context(to, current) {
    if (!known(current?.track) || !validStep(current.step)) return '';
    const steps = stepsFor(current.track);
    const [, , href, , more] = steps[current.step];
    const matches = [href, ...more.map(([url]) => url)].some(url => {
      const path = url.slice(1);
      // Die Bildübung erlaubt den Wechsel von Thema und Tier in derselben Ansicht.
      return path.startsWith('klassenarbeit/') ? to === 'klassenarbeit' || to.startsWith('klassenarbeit/')
        : to === path || to.startsWith(path + '/');
    });
    if (!matches) return '';
    const upcoming = steps[current.step + 1];
    return `<nav class="bl-path-context no-print" aria-label="Lernweg zur Klassenarbeit">
      <span>Schritt ${current.step + 1} von 3 · ${steps[current.step][0]}</span>
      <a href="${route(current.track)}">Zurück zum Lernweg</a>
      ${upcoming ? stepLink(current.track, current.step + 1, upcoming[2],
        current.step === 0 ? 'Weiter zum Üben' : 'Weiter zur Probearbeit') : ''}
      ${stepButton(current, current.track, current.step)}
      ${current.step < 2 && stepStatus(current,current.track,current.step) === 'done'
        ? '<span class="bl-step-state" data-state="done" role="status">Erledigt</span>' : ''}
    </nav>`;
  }

  window.BioLaborKlassenweg = {render, selection, context, openStep, toggleStep,
    practiceCompleted, examTrack, familyProgress};
})();

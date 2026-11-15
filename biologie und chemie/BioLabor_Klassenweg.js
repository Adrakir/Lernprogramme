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

  function stepLink(id, step, url, label, primary = false) {
    return `<a class="btn small${primary ? '' : ' secondary'}" href="${url}" data-bl-path="${id}" data-bl-path-step="${step}">${label}</a>`;
  }

  function render(id, current) {
    const key = known(id) ? id : known(current?.track) ? current.track : 'tiere';
    const last = current?.track === key && validStep(current.step) ? current.step : -1;
    return `<div class="bs-school bl-class-path">
      <header class="bs-heading"><h1>Ich schreibe bald eine Klassenarbeit</h1>
        <p>Wähle deinen Stoff. Beginne mit einer Erklärung, übe selbst und probiere dann eine Klassenarbeit.</p>
        <nav class="button-row" aria-label="Stoff für die Klassenarbeit">${Object.entries(pathways).map(([id, item]) =>
          `<a href="${route(id)}" class="btn small secondary"${id === key ? ' aria-current="page"' : ''}>${item.title}</a>`).join('')}</nav>
      </header>
      <ol class="bl-path-steps">${stepsFor(key).map(([title, text, url, label, more], step) =>
        `<li class="bs-panel"${last === step ? ' aria-current="step"' : ''}><h2>${title}</h2>
          ${last === step ? '<p class="smallnote">Zuletzt geöffnet</p>' : ''}
          <p>${text}</p><div class="button-row">${stepLink(key, step, url, label, true)}</div>
          <ul class="bl-path-more">${more.map(([href, caption]) =>
            `<li><a href="${href}" data-bl-path="${key}" data-bl-path-step="${step}">${caption}</a></li>`).join('')}</ul>
        </li>`).join('')}</ol>
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
    </nav>`;
  }

  window.BioLaborKlassenweg = {render, selection, context};
})();

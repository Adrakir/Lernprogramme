(() => {
  'use strict';

  const source = 'https://commons.wikimedia.org/wiki/File:';
  const terms = {
    skull: ['Schädel', 'Suche ganz vorn am Kopf.', 'Der Schädel umgibt und schützt das Gehirn.'],
    clavicle: ['Schlüsselbein', 'Suche den schmalen Knochen oberhalb des Brustkorbs.', 'Das Schlüsselbein verbindet das Brustbein mit dem Schulterblatt.'],
    shoulder: ['Schulterblatt', 'Suche den flachen Knochen oberhalb des Vorderbeins.', 'Am Schulterblatt setzt der Oberarmknochen an.'],
    humerus: ['Oberarmknochen', 'Suche zwischen Schulter und Ellenbogen.', 'Der Oberarmknochen liegt bei Mensch, Katze und Hund zwischen Schulter und Ellenbogen.'],
    forearm: ['Unterarmknochen', 'Suche zwischen Ellenbogen und Handgelenk.', 'Die beiden Unterarmknochen heißen Elle und Speiche.'],
    hand: ['Handknochen', 'Suche unterhalb des Handgelenks.', 'Zur Hand gehören Handwurzel-, Mittelhand- und Fingerknochen.'],
    sternum: ['Brustbein', 'Suche den flachen Knochen mitten vorn am Brustkorb.', 'Viele Rippen sind über Knorpel mit dem Brustbein verbunden.'],
    ribs: ['Rippen', 'Suche die gebogenen Knochen am Rumpf.', 'Die Rippen bilden einen Teil des Brustkorbs. Er schützt Herz und Lunge.'],
    spine: ['Wirbelsäule', 'Suche die Kette aus Wirbeln am Rücken.', 'Die Wirbelsäule stützt den Rumpf und schützt das Rückenmark.'],
    pelvis: ['Becken', 'Suche dort, wo die Beine am Rumpf ansetzen.', 'Das Becken verbindet den Rumpf mit den Beinen beziehungsweise den Hinterbeinen.'],
    femur: ['Oberschenkelknochen', 'Suche zwischen Hüfte und Knie.', 'Der Oberschenkelknochen verbindet Hüftgelenk und Kniegelenk.'],
    kneecap: ['Kniescheibe', 'Suche den kleinen Knochen vorn am Knie.', 'Die Kniescheibe liegt vorn am Knie und erleichtert das Strecken des Beins.'],
    tibia: ['Schienbein', 'Suche den kräftigeren der beiden Knochen unterhalb des Knies.', 'Das Schienbein ist der dickere Knochen im Unterschenkel und trägt viel Körpergewicht.'],
    fibula: ['Wadenbein', 'Suche den dünneren Knochen außen am Unterschenkel.', 'Das Wadenbein liegt seitlich neben dem Schienbein.'],
    foot: ['Fußknochen', 'Suche unterhalb des Sprunggelenks.', 'Zum Fuß gehören Fußwurzel-, Mittelfuß- und Zehenknochen.'],
    frontPaw: ['Vorderpfote', 'Suche die Zehen am Ende eines Vorderbeins.', 'Katze und Hund setzen beim Gehen die Zehen und Ballen ihrer Vorderpfoten auf.'],
    hindPaw: ['Hinterpfote', 'Suche die Zehen am Ende eines Hinterbeins.', 'Katze und Hund setzen beim Gehen auch die Zehen und Ballen ihrer Hinterpfoten auf.'],
    tail: ['Schwanzwirbel', 'Verfolge den Rücken über das Becken hinaus.', 'Die Schwanzwirbel setzen die Wirbelsäule bei Katze und Hund nach hinten fort.'],
  };

  // Bildausschnitte und Zielpunkte entsprechen den Abbildungen des Arbeitsblatts.
  // Jeder Eintrag enthält Begriff, Zielpunkt und Position der Nummer.
  const species = {
    mensch: {
      name: 'Mensch', view: 'Vorderansicht', bounds: [-41, 0, 431, 700], image: [34, 9, 312, 679],
      credit: 'Mariana Ruiz Villarreal / Mikael Häggström',
      file: 'Human_skeleton_front_-_no_labels.svg',
      points: [
        ['skull', 164, 40, 8, 47], ['clavicle', 125, 123, 8, 116],
        ['humerus', 88, 183, 8, 190], ['sternum', 168, 153, 347, 138],
        ['ribs', 215, 206, 347, 212], ['spine', 169, 258, 347, 286],
        ['forearm', 61, 310, 8, 309], ['pelvis', 209, 290, 347, 366],
        ['hand', 65, 368, 8, 387], ['femur', 127, 397, 8, 470],
        ['kneecap', 187, 497, 347, 502], ['tibia', 148, 566, 8, 565],
        ['fibula', 200, 552, 347, 596], ['foot', 137, 657, 8, 656],
      ],
    },
    katze: {
      name: 'Katze', view: 'Seitenansicht', bounds: [0, -67, 708, 488], image: [18, 0, 682, 348],
      credit: 'Chauveau / Arloing, Anatomieatlas (1890)', file: 'SqueletteChatChauveau1990.jpg',
      points: [
        ['skull', 92, 83, 53, -20], ['shoulder', 239, 97, 202, -20],
        ['spine', 389, 16, 354, -20], ['pelvis', 510, 57, 500, -20],
        ['tail', 611, 178, 652, -20], ['humerus', 248, 168, 51, 373],
        ['frontPaw', 259, 316, 203, 373], ['ribs', 321, 111, 347, 373],
        ['femur', 467, 103, 496, 373], ['hindPaw', 535, 299, 652, 373],
      ],
    },
    hund: {
      name: 'Hund', view: 'Seitenansicht', bounds: [0, -67, 731, 614], image: [21, 0, 690, 472],
      credit: 'Chauveau / Arloing, Anatomieatlas (1890)', file: 'SqueletteChienChauveau1990.jpg',
      points: [
        ['skull', 99, 57, 54, -20], ['shoulder', 278, 118, 210, -20],
        ['spine', 472, 76, 365, -20], ['pelvis', 544, 108, 520, -20],
        ['tail', 661, 265, 673, -20], ['humerus', 278, 210, 54, 497],
        ['frontPaw', 321, 443, 210, 497], ['ribs', 392, 185, 365, 497],
        ['femur', 511, 179, 520, 497], ['hindPaw', 604, 435, 673, 497],
      ],
    },
  };
  const speciesIds = Object.keys(species);
  const comparison = [
    ['Welcher Teil des Skeletts schützt bei allen dreien das Gehirn?',
      'Der Schädel', 'Der Brustkorb', 'Das Becken', 'Die Kniescheibe',
      'Das Gehirn liegt im Kopf. Der Schädel umschließt und schützt es.'],
    ['Welche Knochen bilden einen Teil des Brustkorbs und schützen Herz und Lunge?',
      'Die Rippen', 'Die Schwanzwirbel', 'Die Oberschenkelknochen', 'Die Fußknochen',
      'Die Rippen umgeben zusammen mit Brustbein und Brustwirbelsäule die Brusthöhle.'],
    ['Was haben Katze und Hund am Ende der Wirbelsäule gemeinsam?',
      'Sie haben Schwanzwirbel.', 'Dort sitzt der Schädel.', 'Dort setzen die Rippen an.',
      'Dort liegen die Vorderpfoten.', 'Bei Katze und Hund setzt sich die Wirbelsäule im Schwanz fort.'],
    ['Wie bewegen sich Mensch, Katze und Hund normalerweise beim Gehen?',
      'Mensch: zwei Beine. Katze und Hund: vier Beine.',
      'Alle drei benutzen zwei Beine.', 'Alle drei benutzen vier Beine.',
      'Mensch und Katze: vier Beine. Hund: zwei Beine.',
      'Der Mensch geht aufrecht auf zwei Beinen. Katze und Hund benutzen Vorder- und Hinterbeine.'],
    ['Welche drei Teile findest du bei Mensch, Katze und Hund?',
      'Schädel, Rippen und Becken', 'Vorderpfoten, Schwanzwirbel und Rippen',
      'Hinterpfoten, Brustbein und Schädel', 'Vorderpfoten, Beckenknochen und Schwanzwirbel',
      'Der gemeinsame Bauplan umfasst unter anderem Schädel, Rippen und Becken. Pfoten haben hier nur Katze und Hund.'],
  ];
  const modes = {discover: 'Entdecken', practice: 'Beschriften', test: 'Probetest'};

  const shuffle = values => {
    const list = [...values];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  };

  function boneQuestion(id, point) {
    const key = point[0];
    const [correct, hint, explanation] = terms[key];
    const alternatives = species[id].points.map(([term]) => term).filter(term => term !== key);
    const options = shuffle([correct, ...shuffle(alternatives).slice(0, 3).map(term => terms[term][0])]);
    return {id, point, correct, hint, explanation, options, prompt: 'Wie heißt der markierte Knochenbereich?'};
  }

  function newRound(mode, id, retryPoints) {
    if (mode === 'practice') {
      return shuffle(retryPoints ?? species[id].points).map(point => boneQuestion(id, point));
    }
    const bones = speciesIds.flatMap(animal =>
      shuffle(species[animal].points).slice(0, 5).map(point => boneQuestion(animal, point)));
    const facts = shuffle(comparison).map(([prompt, correct, b, c, d, explanation]) => ({
      id: 'vergleich', prompt, correct, explanation, options: shuffle([correct, b, c, d]),
    }));
    return [...bones, ...facts];
  }

  function diagram(id, selected, revealNames) {
    const animal = species[id];
    const [left, top, width, height] = animal.bounds;
    const [x, y, w, h] = animal.image;
    const [key, targetX, targetY, markerX, markerY] = animal.points[selected];
    const lines = `<line x1="${markerX}" y1="${markerY}" x2="${targetX}" y2="${targetY}"/>
      <circle cx="${targetX}" cy="${targetY}" r="${id === 'mensch' ? 5 : 8}"/>
      ${key === 'forearm' ? '<line x1="33" y1="309" x2="72" y2="300"/><circle cx="72" cy="300" r="5"/>' : ''}`;
    const markers = revealNames ? animal.points.map(([key, , , mx, my], i) => `
      <button type="button" class="bk-marker" data-point="${i}" aria-pressed="${selected === i}"
        aria-label="${i + 1}. ${terms[key][0]}"
        style="--x:${100 * (mx - left) / width}%;--y:${100 * (my - top) / height}%">${i + 1}</button>`).join('') : '';
    return `<figure class="bk-figure bk-figure-${id}"><div class="bk-picture" style="aspect-ratio:${width}/${height}">
      <svg viewBox="${animal.bounds.join(' ')}" role="img" aria-label="${animal.name}, ${animal.view}${revealNames ? '' : ', ein Knochenbereich ist markiert'}">
        <image href="Skelettbilder/${id}.webp" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none"/>
        ${lines}
        ${revealNames ? '' : `<circle class="bk-start" cx="${markerX}" cy="${markerY}" r="${id === 'mensch' ? 10 : 16}"/>`}
      </svg>
      ${markers}
    </div><figcaption>${animal.name} · ${animal.view}
      <a href="${source}${animal.file}" target="_blank" rel="noopener" aria-label="Bildquelle ${animal.name}">Bildquelle</a>
    </figcaption></figure>`;
  }

  const animalExamSets = [
    [0, 2, 4, 7, 9],
    [1, 3, 5, 6, 8],
    [0, 1, 3, 7, 8],
  ];

  function examAnimal(id, indices, first, solved) {
    const animal = species[id];
    const [x, y, width, height] = animal.image;
    const points = indices.map((index, i) => ({point: animal.points[index], number: first + i}));
    return `<section class="bk-exam-animal" data-exam-animal="${id}">
      <h3>${animal.name}</h3>
      <div class="bk-exam-layout">
        <svg class="bk-exam-diagram" viewBox="${animal.bounds.join(' ')}" role="img"
          aria-label="Skelett ${id === 'katze' ? 'der Katze' : 'des Hundes'} in Seitenansicht, Markierungen ${first} bis ${first + indices.length - 1}">
          <image href="Skelettbilder/${id}.webp" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="none"/>
          ${points.map(({point: [, px, py, mx, my], number}) => `<g>
            <line x1="${mx}" y1="${my}" x2="${px}" y2="${py}"/>
            <circle class="bk-exam-dot" cx="${px}" cy="${py}" r="6"/>
            <circle class="bk-exam-number" cx="${mx}" cy="${my}" r="23"/>
            <text x="${mx}" y="${my + 8}">${number}</text>
          </g>`).join('')}
        </svg>
        <ol class="bk-exam-labels" start="${first}">${points.map(({point: [key]}) =>
          `<li>${solved ? wrapTerm(terms[key][0]) : '<span class="bk-exam-blank"></span>'}</li>`).join('')}</ol>
      </div>
    </section>`;
  }

  function examSkeletons(version, first, solved) {
    const cat = animalExamSets[version % animalExamSets.length];
    const dog = animalExamSets[(version + 1) % animalExamSets.length];
    return `<section class="panel printpage bk-exam-sheet ${solved ? 'solutions-sheet' : ''}">
      <div class="printlogo">BioLabor 5 · Biologie · Klasse 5</div>
      <h2>${solved ? 'Lösungen zur Übungsklassenarbeit' : 'Übungsklassenarbeit'} ${version + 1} · Teil B</h2>
      <p class="bk-exam-instructions">${solved ? 'So werden die markierten Stellen beschriftet.'
        : 'Beschrifte die markierten Knochen und Knochenbereiche. Schreibe zu jeder Nummer den passenden Fachbegriff. Jede richtige Beschriftung zählt 1 Punkt.'}</p>
      ${examAnimal('katze', cat, first, solved)}
      ${examAnimal('hund', dog, first + cat.length, solved)}
      ${solved ? '' : '<p class="bk-exam-points">Teil B: ______ / 10 Punkte</p>'}
      <p class="bk-exam-credit">Abbildungen: <a href="${source}${species.katze.file}">Katze</a> und
        <a href="${source}${species.hund.file}">Hund</a> aus dem Anatomieatlas von Chauveau und Arloing (1890, gemeinfrei).</p>
    </section>`;
  }

  const wrapTerm = text => text.replace(/^(Oberarm|Unterarm|Oberschenkel)(knochen)$/, '$1<wbr>$2');

  const button = (action, label, style = '') =>
    `<button class="btn ${style}" type="button" data-bk="${action}">${label}</button>`;

  function mount(root, {initialSpecies, getBest, saveBest}) {
    let id = speciesIds.includes(initialSpecies) ? initialSpecies : 'mensch';
    let mode = 'discover';
    let selected = 0;
    let indexOpen = matchMedia('(min-width: 901px)').matches;
    let round = [];
    let answers = [];
    let index = 0;
    let hintOpen = false;
    let hintUsed = false;
    let firstAnswer = '';
    let feedback = '';

    function start(nextMode, retryPoints) {
      mode = nextMode;
      if (mode !== 'discover') round = newRound(mode, id, retryPoints);
      answers = [];
      index = 0;
      hintOpen = false;
      hintUsed = false;
      firstAnswer = '';
      feedback = '';
    }

    function discover() {
      const animal = species[id];
      const [name, , explanation] = terms[animal.points[selected][0]];
      return `<div class="bk-work bk-discover">
        ${diagram(id, selected, true)}
        <div class="bk-controls">
          <div class="bk-feedback bk-fact" aria-live="polite">
            <span class="bk-fact-number" aria-hidden="true">${selected + 1}</span>
            <div><h3>${name}</h3><p>${explanation}</p></div>
          </div>
          <details class="bk-index"${indexOpen ? ' open' : ''}>
            <summary>Alle ${animal.points.length} Knochenbereiche</summary>
            <div class="bk-bone-list">${animal.points.map(([key], i) => `
              <button type="button" class="bk-word" data-point="${i}" aria-pressed="${selected === i}">
                <span class="bk-bone-number" aria-hidden="true">${i + 1}</span><span>${wrapTerm(terms[key][0])}</span></button>`).join('')}</div>
          </details>
          ${button('mode:practice', 'Jetzt selbst beschriften')}
        </div></div>`;
    }

    function task() {
      const q = round[index];
      const answer = answers[index];
      const hasDiagram = Boolean(q.point);
      const mark = hasDiagram ? species[q.id].points.indexOf(q.point) : -1;
      const practice = mode === 'practice';
      const category = hasDiagram ? species[q.id].name : 'Vergleich';
      return `<section class="bk-round">
        <div class="bk-progress">
          ${practice ? '' : `<strong>${category}</strong>`}
          <span>Aufgabe ${index + 1} von ${round.length}</span><progress value="${index + 1}" max="${round.length}" aria-label="Aufgabenfortschritt"></progress></div>
        <h3 data-bk-heading tabindex="-1">${q.prompt}</h3>
        <div class="bk-work ${hasDiagram ? '' : 'bk-text-task'}">
          ${hasDiagram ? diagram(q.id, mark, false) : ''}
          <div class="bk-controls">
            <div class="bk-options" aria-label="Antworten">${q.options.map((option, i) => {
              const wrong = practice && feedback === option && !answer;
              const correct = answer && option === q.correct;
              const status = wrong ? 'bk-wrong' : correct ? 'bk-correct' : '';
              return `<button type="button" class="bk-word ${status}" data-answer="${i}" aria-label="${option}"
                ${answer ? 'disabled' : ''}><span class="bk-answer-letter" aria-hidden="true">${correct ? '✓' : String.fromCharCode(65 + i)}</span><span>${wrapTerm(option)}</span></button>`;
            }).join('')}</div>
            ${practice && !answer ? `${button('hint', hintOpen ? 'Tipp ausblenden' : 'Tipp anzeigen', 'secondary')}
              ${hintOpen ? `<p class="bk-hint">${q.hint}</p>` : ''}` : ''}
            <div class="bk-response" aria-live="polite">${practice && feedback ? `<div class="bk-feedback ${answer ? '' : 'bk-feedback-retry'}">
              <strong>${answer ? 'Richtig zugeordnet' : 'Versuch es noch einmal.'}</strong>
              <p>${answer ? `${q.correct}. ${q.explanation}` : 'Schau genau, wo die Linie endet.'}</p></div>` : ''}</div>
            ${answer ? button('next', index + 1 === round.length ? 'Ergebnis ansehen' : 'Nächste Aufgabe') : ''}
          </div>
        </div>
      </section>`;
    }

    function result() {
      const correct = answers.filter(a => a.chosen === a.question.correct).length;
      const practice = mode === 'practice';
      const groups = practice ? [id] : [...speciesIds, 'vergleich'];
      const review = answers.filter(a => a.chosen !== a.question.correct || a.hint);
      const title = practice ? 'Deine Beschriftungsrunde' : 'Dein Ergebnis im Probetest';
      return `<section class="bk-result">
        <h3 data-bk-heading tabindex="-1">${title}</h3>
        <p class="bk-score"><strong>${correct} von ${round.length}</strong> ${practice ? 'beim ersten Versuch richtig' : 'richtig'}</p>
        <ul class="bk-scores">${groups.map(group => {
          const rows = answers.filter(a => a.question.id === group);
          const hits = rows.filter(a => a.chosen === a.question.correct).length;
          return `<li>${species[group]?.name ?? 'Vergleich'} <strong>${hits}/${rows.length}</strong></li>`;
        }).join('')}</ul>
        ${review.length ? `<h4>${practice ? 'Das kannst du wiederholen' : 'Schau dir diese Antworten noch einmal an'}</h4>
          <ol class="bk-review">${review.map(({question: q, chosen, hint}) => `<li>
            <strong>${species[q.id]?.name ?? 'Vergleich'} · ${q.point ? q.correct : q.prompt}</strong>
            ${q.point ? `<details><summary>Stelle am Skelett ansehen</summary>${diagram(q.id, species[q.id].points.indexOf(q.point), false)}</details>` : ''}
            <p>${chosen === q.correct ? 'Mit Tipp gelöst.' : `Deine ${practice ? 'erste Antwort' : 'Antwort'}: ${chosen}.`} ${hint && chosen !== q.correct ? 'Tipp benutzt.' : ''}</p>
            <p><b>Richtig ist</b> ${q.correct} · ${q.explanation}</p></li>`).join('')}</ol>` :
          '<p>Alle Antworten stimmen.</p>'}
        ${practice ? '' : `<details class="bk-answer-sheets">
          <summary>Beschriftete Skelette von Katze und Hund ansehen</summary>
          ${['katze', 'hund'].map(animal => examAnimal(animal, species[animal].points.map((_, i) => i), 1, true)).join('')}
        </details>`}
        <div class="button-row">${practice && review.length ? button('retry', 'Diese Stellen noch einmal üben') : ''}
          ${button('restart', practice ? 'Ganze Runde neu starten' : 'Neuen Probetest starten', 'secondary')}
          ${practice ? button('mode:test', 'Zum Probetest', 'secondary') : button('mode:practice', 'Weiter beschriften', 'secondary')}</div>
      </section>`;
    }

    function draw(focus) {
      indexOpen = root.querySelector('.bk-index')?.open ?? indexOpen;
      const best = getBest();
      root.innerHTML = `<div class="bk-modes" role="group" aria-label="Lernschritt wählen">
        ${Object.entries(modes).map(([key, label], i) => `<button type="button" class="bk-step"
          data-bk="mode:${key}" aria-pressed="${mode === key}"><span aria-hidden="true">${i + 1}</span>${label}</button>`).join('')}</div>
        <section class="panel bk-panel bk-panel-${mode}" aria-label="${modes[mode]}">
          ${mode !== 'test' ? `<div class="bk-tools"><div class="bk-species" role="group" aria-label="Skelett wählen">${speciesIds.map(animal => `
            <button type="button" class="bk-word" data-bk="species:${animal}" aria-pressed="${animal === id}">${species[animal].name}</button>`).join('')}</div>
            ${mode === 'discover' ? '<p>Tippe auf eine Nummer im Bild.</p>' : ''}</div>`
            : `<div class="bk-tools"><p>20 Aufgaben · Lösungen am Ende</p>
              ${Number.isInteger(best) ? `<small>Dein Bestwert auf diesem Gerät: ${best}/20</small>` : ''}</div>`}
          ${mode === 'discover' ? discover() : index === round.length ? result() : task()}
        </section>
        <details class="bk-credits"><summary>Bildquellen</summary><ul>
          ${speciesIds.map(animal => `<li>${species[animal].name}: <a href="${source}${species[animal].file}">${species[animal].credit}</a> (gemeinfrei)</li>`).join('')}
        </ul></details>`;
      if (focus) {
        const target = root.querySelector(focus);
        target?.focus({preventScroll: true});
        if (focus === '[data-bk-heading]' || focus === '[data-bk="next"]') {
          target?.scrollIntoView({block: 'nearest'});
        }
      }
    }

    root.addEventListener('click', event => {
      const target = event.target.closest('button');
      if (!target) return;
      if (target.dataset.point !== undefined) {
        selected = Number(target.dataset.point);
        draw(`.${target.classList.contains('bk-marker') ? 'bk-marker' : 'bk-word'}[data-point="${selected}"]`);
        return;
      }
      if (target.dataset.answer !== undefined) {
        const q = round[index];
        if (!q || answers[index]) return;
        const chosen = q.options[Number(target.dataset.answer)];
        if (mode === 'practice') {
          firstAnswer ||= chosen;
          feedback = chosen;
          if (chosen !== q.correct) {
            draw(`[data-answer="${target.dataset.answer}"]`);
            return;
          }
          answers.push({question: q, chosen: firstAnswer, hint: hintUsed});
          draw('[data-bk="next"]');
        } else {
          answers.push({question: q, chosen, hint: false});
          advance();
        }
        return;
      }

      const action = target.dataset.bk;
      if (!action) return;
      if (action.startsWith('mode:')) {
        const nextMode = action.slice(5);
        if (nextMode !== mode) {
          start(nextMode);
          draw(nextMode === 'test' ? '[data-bk-heading]' : `[data-bk="${action}"]`);
        }
      } else if (action.startsWith('species:')) {
        const nextId = action.slice(8);
        if (nextId !== id) {
          id = nextId;
          selected = 0;
          start(mode);
          draw(`[data-bk="${action}"]`);
        }
      } else if (action === 'hint') {
        hintOpen = !hintOpen;
        hintUsed ||= hintOpen;
        draw('[data-bk="hint"]');
      } else if (action === 'next') {
        advance();
      } else if (action === 'restart' || action === 'retry') {
        const review = answers.filter(a => a.chosen !== a.question.correct || a.hint);
        start(mode, action === 'retry' ? review.map(a => a.question.point) : undefined);
        draw('[data-bk-heading]');
      }
    });

    function advance() {
      index++;
      hintOpen = false;
      hintUsed = false;
      firstAnswer = '';
      feedback = '';
      if (index === round.length && mode === 'test') {
        saveBest(answers.filter(a => a.chosen === a.question.correct).length);
      }
      draw('[data-bk-heading]');
    }

    draw();
  }

  window.BioLaborKlassenarbeit = {mount, examSkeletons};
})();

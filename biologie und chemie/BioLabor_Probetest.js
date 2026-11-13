(() => {
  'use strict';

  const {skills, versions, focus: practiceFocus, retry, observations} = window.BioLaborProbetestInhalte;
  const key = 'biolab5-probetest-1';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char =>
    ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[char]);
  let stored = {};
  try {
    const data = JSON.parse(localStorage.getItem(key));
    if (data && typeof data === 'object' && !Array.isArray(data)) stored = data;
  } catch {
    // Die Runde bleibt im Arbeitsspeicher verfügbar.
  }

  function save() {
    try {
      if (window.LernCockpit?.acceptsNativeWrites?.() === false) return;
      localStorage.setItem(key, JSON.stringify(stored));
    } catch {
      // Die aktuelle Runde kann auch ohne Browserspeicher weiterlaufen.
    }
  }

  function button(action, label, secondary = false, value = '') {
    return `<button type="button" class="btn${secondary ? ' secondary' : ''}"
      data-bp-action="${action}" data-bp-value="${value}">${label}</button>`;
  }

  function picture(spec) {
    if (!spec) return '';
    const [type, species, part] = spec;
    if (type === 'bones') return window.BioLaborKlassenarbeit.skeletonQuestion(species, part);
    const {jaws, toothDiagram} = window.BioLaborAnatomie;
    return toothDiagram(species, jaws[species].marks.findIndex(([mark]) => mark === part), false);
  }

  function objectivePoints(question, answer) {
    if (question.rows) return question.rows.filter(([, correct], i) => answer?.[i] === correct).length;
    return Number(answer === question.correct);
  }

  const maxPoints = question => question.rows?.length || 1;

  function examSummary(active) {
    const questions = versions[active.version];
    const objective = questions.filter(q => !q.criteria);
    const max = objective.reduce((sum, q) => sum + maxPoints(q), 0);
    const score = questions.reduce((sum, q, i) => sum + (q.criteria ? 0 : objectivePoints(q, active.answers[i])), 0);
    return {score, max, writingCount: questions.length - objective.length};
  }

  function hasAnswer(question, answer) {
    if (question.criteria) return typeof answer === 'string' && answer.trim().length > 0;
    if (question.rows) return question.rows.every((_, index) => Number.isInteger(answer?.[index]));
    return Number.isInteger(answer);
  }

  function heading(title, message, links = '') {
    return `<header class="bs-heading bp-heading"><h1 tabindex="-1">${title}</h1><p>${message}</p>
      ${links ? '<div class="bs-links">' + links + '</div>' : ''}</header>`;
  }

  function examStart(active) {
    const historyItems = Object.entries(stored.completed || {});
    return heading('Interaktive Probeklassenarbeit',
      'Wähle eine von drei Fassungen. Jede enthält Bildaufgaben, Zuordnungen und zwei kurze Erklärfragen.',
      '<a href="#schulstoff">Zum Schulstoff</a><a href="#print">Arbeiten zum Drucken</a>') +
      `<section class="bs-panel bp-panel"><h2>So läuft die Arbeit ab</h2>
      <p>Du kannst Fragen überspringen, zurückgehen und Antworten ändern. Tipps und Lösungen erscheinen nach der Abgabe. Erklärtexte vergleichst du dann selbst mit den Musterantworten.</p>
      ${active ? `<p class="bp-status">Arbeit ${active.version + 1} ist ${active.phase === 'results' ? 'abgegeben' : 'noch offen'}.</p>
        <div class="button-row">${button('resume', active.phase === 'results' ? 'Letzte Auswertung öffnen' : 'Arbeit fortsetzen')}</div>` : ''}
      <div class="bp-versions">${versions.map((questions, index) => `<article class="bs-card">
        <h3>Arbeit ${index + 1}</h3><p>${questions.length} Aufgaben · ${questions.filter(q => !q.criteria).reduce((sum,q) => sum + maxPoints(q),0)} automatisch prüfbare Punkte</p>
        ${button('start', 'Arbeit ' + (index + 1) + ' starten', true, index)}</article>`).join('')}</div></section>` +
      (historyItems.length ? `<section class="bs-panel bp-panel"><h2>Abgegebene Arbeiten</h2><ul class="bp-answers">
        ${historyItems.map(([version, entry]) => {
          const summary = examSummary(entry);
          return `<li>Arbeit ${Number(version) + 1} · ${summary.score} von ${summary.max} automatisch geprüften Punkten
            <details><summary>Aufgaben und Antworten ansehen</summary>
              ${versions[entry.version].map((question, i) => {
                const answer = entry.answers[i];
                return `<details class="bp-review"><summary>Aufgabe ${i + 1} · ${skills[question.skill][0]}</summary>
                  <p><strong>${question.prompt}</strong></p>
                  ${question.picture ? '<div class="bp-picture">' + picture(question.picture) + '</div>' : ''}
                  ${question.criteria
                    ? '<p><strong>Dein Text:</strong> ' + (answer?.trim() ? escape(answer) : 'Keine Antwort') + '</p><p><strong>Musterantwort:</strong> ' + question.sample + '</p>'
                    : reviewResult(question, answer)}</details>`;
              }).join('')}</details></li>`;
        }).join('')}</ul></section>` : '');
  }

  function optionRows(question, answer) {
    if (question.rows) {
      return '<div class="bp-match">' + question.rows.map(([label], row) =>
        `<label>${label}<select data-bp-row="${row}"><option value="">Bitte auswählen</option>
          ${question.options.map((option,i) => `<option value="${i}"${answer?.[row] === i ? ' selected' : ''}>${option}</option>`).join('')}
        </select></label>`).join('') + '</div>';
    }
    if (question.criteria) {
      return `<label class="bp-writing">Deine Erklärung<textarea data-bp-writing maxlength="2000" rows="5">${escape(answer)}</textarea></label>`;
    }
    return '<div class="bp-choices">' + question.options.map((option, index) => `<label>
      <input type="radio" name="bp-answer" value="${index}"${answer === index ? ' checked' : ''}><span>${option}</span>
      </label>`).join('') + '</div>';
  }

  function pendingText(missing) {
    return (missing ? missing + (missing === 1 ? ' Aufgabe ist' : ' Aufgaben sind') + ' noch offen.' : 'Alle Aufgaben sind beantwortet.') +
      ' Nach der Abgabe erscheinen die Lösungen.';
  }

  function examQuestion(active, confirm) {
    const questions = versions[active.version];
    const index = active.index;
    const question = questions[index];
    const missing = questions.filter((q, i) => !hasAnswer(q, active.answers[i])).length;
    return heading('Probeklassenarbeit ' + (active.version + 1), 'Aufgabe ' + (index + 1) + ' von ' + questions.length) +
      `<section class="bs-panel bp-panel">
        <nav class="bp-jump" aria-label="Zu einer Aufgabe springen">
          ${questions.map((q, i) => `<button type="button" class="btn small secondary" data-bp-action="jump" data-bp-value="${i}"
            ${i === index ? 'aria-current="step"' : ''} aria-label="Aufgabe ${i + 1}${hasAnswer(q, active.answers[i]) ? ', beantwortet' : ', offen'}">
            ${i + 1}<span aria-hidden="true">${hasAnswer(q, active.answers[i]) ? ' ✓' : ''}</span></button>`).join('')}
        </nav>
        <h2 tabindex="-1">${question.prompt}</h2>
        ${question.picture ? '<div class="bp-picture">' + picture(question.picture) + '</div>' : ''}
        ${optionRows(question, active.answers[index])}
        <div class="button-row bp-actions">
          ${index > 0 ? button('jump', '← Zurück', true, index - 1) : ''}
          ${index + 1 < questions.length ? button('jump', 'Weiter →', false, index + 1) : ''}
          ${button('confirm', 'Arbeit abgeben', index + 1 < questions.length)}
          ${button('pause', 'Speichern und pausieren', true)}
        </div>
        ${confirm ? `<div class="bp-note" role="group" aria-label="Abgabe bestätigen">
          <p tabindex="-1" data-bp-pending>${pendingText(missing)}</p>
          <div class="button-row">${button('submit', 'Jetzt abgeben')}${button('cancel', 'Weiter bearbeiten', true)}</div></div>` : ''}
      </section>`;
  }

  function reviewResult(question, answer, active, index) {
    if (question.criteria) {
      const review = active.reviews?.[index] || {};
      return `<p><strong>Dein Text:</strong> ${answer?.trim() ? escape(answer) : 'Keine Antwort'}</p>
        <p><strong>Musterantwort:</strong> ${question.sample}</p>
        <fieldset class="bp-criteria"><legend>Vergleiche deinen Text mit diesen Kriterien</legend>
          ${question.criteria.map((criterion, i) => `<label><input type="checkbox" data-bp-criterion="${index}/${i}"
            ${review.checked?.[i] ? ' checked' : ''}> ${criterion}</label>`).join('')}
        </fieldset>
        <div class="button-row">${button('review', 'Selbstvergleich speichern', true, index)}
          ${review.done ? '<span class="bp-status">Selbstvergleich gespeichert</span>' : ''}</div>`;
    }
    const items = question.rows
      ? question.rows.map(([label, correct], i) => [label, correct, answer?.[i]])
      : [['Antwort', question.correct, answer]];
    return '<ul class="bp-answers">' + items.map(([label, correct, given]) =>
      `<li><strong>${label}:</strong> ${given === correct ? '✓' : '↗'} ${question.options[given] ?? 'Offen'}
        ${given !== correct ? ' · Richtig: ' + question.options[correct] : ''}</li>`).join('') +
      '</ul><p>' + question.why + '</p>';
  }

  function needsPractice(active) {
    const topics = versions[active.version].flatMap((question, index) => {
      const answer = active.answers[index];
      const review = active.reviews?.[index];
      const open = question.criteria
        ? !hasAnswer(question, answer) || (review?.done && question.criteria.some((_, i) => !review.checked?.[i]))
        : objectivePoints(question, answer) < maxPoints(question);
      return open ? [practiceFocus[active.version][index]] : [];
    });
    return [...new Set(topics)];

  }

  function examResults(active) {
    const questions = versions[active.version];
    const {score, max, writingCount} = examSummary(active);
    const compared = Object.values(active.reviews || {}).filter(review => review.done).length;
    const topics = needsPractice(active);
    const links = [...new Set(topics.map(topic => retry[topic][0].skill))];
    return heading('Auswertung · Arbeit ' + (active.version + 1),
      'Automatisch geprüft: ' + score + ' von ' + max + ' Punkten. Erklärtexte verglichen: ' + compared + ' von ' + writingCount + '.') +
      `<section class="bs-panel bp-panel"><h2>Das kannst du wiederholen</h2>
      ${topics.length ? '<div class="bs-links">' + links.map(skill => `<a href="${skills[skill][1]}">${skills[skill][0]}</a>`).join('') + '</div>'
        : '<p>Bei den abgegebenen und ausgewerteten Aufgaben gibt es gerade keinen offenen Übungsschwerpunkt.</p>'}
      <p>Beim Selbstvergleich kannst du abhaken, welche Punkte in deinen Erklärungen vorkommen.</p>
      <div class="button-row">${topics.length ? button('retry', 'Fehler gezielt wiederholen') : ''}
        ${stored.round ? '<a class="btn secondary" href="#probetest/wiederholen">' + (stored.round.finished ? 'Letzte Wiederholung ansehen' : 'Wiederholung fortsetzen') + '</a>' : ''}
        ${button('home', 'Zu den drei Arbeiten', true)}</div>
      </section><section class="bs-panel bp-panel"><h2>Antworten und Lösungen</h2>
      ${questions.map((question, index) => {
        const complete = !question.criteria && objectivePoints(question, active.answers[index]) === maxPoints(question);
        return `<details class="bp-review" data-bp-review="${index}"${complete ? '' : ' open'}><summary>
          Aufgabe ${index + 1} · ${skills[question.skill][0]}${complete ? ' · ✓' : ''}</summary>
          <p><strong>${question.prompt}</strong></p>
          ${question.picture ? '<div class="bp-picture">' + picture(question.picture) + '</div>' : ''}
          ${reviewResult(question, active.answers[index], active, index)}
        </details>`;
      }).join('')}</section>`;
  }

  function practiceRound(round) {
    const question = retry[round.topics[round.index]][round.variant];
    const skill = question.skill;
    const answer = round.answers[round.index];
    const checked = round.checked[round.index] === true;
    const correct = objectivePoints(question, answer) === maxPoints(question);
    return heading('Fehler gezielt wiederholen', 'Aufgabe ' + (round.index + 1) + ' von ' + round.topics.length + ' · ' + skills[skill][0],
      '<a href="#probetest/auswertung">Zur Auswertung</a>') +
      `<section class="bs-panel bp-panel"><h2 tabindex="-1">${question.prompt}</h2>
        ${question.picture ? '<div class="bp-picture">' + picture(question.picture) + '</div>' : ''}
        ${checked ? `<fieldset disabled class="bp-checked">${optionRows(question, answer)}</fieldset>` : optionRows(question, answer)}
        ${checked ? `<div class="bp-note" role="status"><strong>${correct ? '✓ Richtig.' : 'Noch unsicher.'}</strong>${reviewResult(question, answer)}</div>` : ''}
        <div class="button-row bp-actions">
          ${checked ? button('retry-next', round.index + 1 === round.topics.length ? 'Ergebnis anzeigen' : 'Weiter →')
            : button('retry-check', 'Antwort prüfen')}
          <a class="btn secondary" href="${skills[skill][1]}">Passende Übung</a>
        </div><p data-bp-notice role="status"></p>
      </section>`;
  }

  function practiceResults(round) {
    const open = missedTopics(round);
    const links = [...new Set(open.map(topic => retry[topic][round.variant].skill))];
    return heading('Deine Wiederholungsrunde',
      (round.topics.length - open.length) + ' von ' + round.topics.length + ' Aufgaben in einem neuen Beispiel richtig gelöst.',
      '<a href="#probetest/auswertung">Zur Auswertung der Arbeit</a>') +
      `<section class="bs-panel bp-panel"><h2>${open.length ? 'Diese Themen bleiben offen' : 'Alle Themen dieser Runde gelöst'}</h2>
        <div class="bs-links">${links.map(skill => `<a href="${skills[skill][1]}">${skills[skill][0]}</a>`).join('')}</div>
        ${open.length ? '<div class="button-row bp-actions">' + button('retry-again', 'Offene Themen erneut üben') + '</div>' : ''}
      </section>`;
  }

  function missedTopics(round) {
    return round.topics.filter((topic, index) => {
      const question = retry[topic][round.variant];
      return objectivePoints(question, round.answers[index]) < maxPoints(question);
    });
  }

  function mountExam(outer, section, setRoute) {
    const root = document.createElement('div');
    outer.replaceChildren(root);
    let screen = section || 'start';
    let confirm = false;
    let focus;
    const changeScreen = target => {
      screen = target;
      confirm = false;
      const hash = '#probetest' + (target === 'start' ? '' : '/' + target);
      if (location.hash !== hash) history.pushState(null, '', hash);
      setRoute(hash.slice(1));
    };
    function render() {
      const active = stored.exam;
      const round = stored.round;
      const views = {
        start: () => examStart(active),
        arbeit: () => active?.phase === 'work' ? examQuestion(active, confirm) : examStart(active),
        auswertung: () => active?.phase === 'results' ? examResults(active) : examStart(active),
        wiederholen: () => !round?.topics?.length || active?.phase !== 'results'
          ? examStart(active) : round.finished ? practiceResults(round) : practiceRound(round),
      };
      root.innerHTML = '<div class="bs-school bp-root">' + (Object.hasOwn(views, screen) ? views[screen]() : examStart(active)) + '</div>';
      if (focus) {
        const target = root.querySelector(focus);
        target?.focus();
        focus = undefined;
      }
    }

    function open(target) {
      changeScreen(target);
      focus = 'h1';
      render();
    }

    function newRound(topics) {
      stored.round = {topics, answers: {}, checked: {}, index: 0, variant: (stored.round?.variant ?? 1) === 0 ? 1 : 0, finished: false};
      save();
      open('wiederholen');
    }

    render();

    function updateProgress() {
      const {answers, index, version} = stored.exam;
      const questions = versions[version];
      const nav = root.querySelector('[aria-current="step"]');
      const answered = hasAnswer(questions[index], answers[index]);
      nav.setAttribute('aria-label', 'Aufgabe ' + (index + 1) + (answered ? ', beantwortet' : ', offen'));
      nav.querySelector('span').textContent = answered ? ' ✓' : '';
      const pending = root.querySelector('[data-bp-pending]');
      if (pending) pending.textContent = pendingText(questions.filter((q, i) => !hasAnswer(q, answers[i])).length);
    }

    root.addEventListener('input', event => {
      const target = event.target;
      if (screen !== 'arbeit' || !target.matches('[data-bp-writing]')) return;
      stored.exam.answers[stored.exam.index] = target.value;
      save();
      updateProgress();
    });

    root.addEventListener('change', event => {
      const target = event.target;
      const round = screen === 'wiederholen' ? stored.round : null;
      if (screen !== 'arbeit' && !round) return;
      const {answers, index} = round || stored.exam;
      if (round?.checked[index]) return;
      if (target.matches('input[name="bp-answer"]')) answers[index] = Number(target.value);
      else if (target.matches('[data-bp-row]')) {
        answers[index] ||= {};
        if (target.value === '') delete answers[index][target.dataset.bpRow];
        else answers[index][target.dataset.bpRow] = Number(target.value);
      } else return;
      save();
      if (!round) updateProgress();
    });

    root.addEventListener('click', event => {
      const control = event.target.closest('[data-bp-action]');
      if (!control) return;
      const value = Number(control.dataset.bpValue);
      const active = stored.exam;
      const round = stored.round;
      switch (control.dataset.bpAction) {
        case 'start':
          if (active?.phase === 'work' && !window.confirm('Eine Arbeit ist noch offen. Möchtest du den Entwurf durch eine neue Arbeit ersetzen?')) return;
          stored.exam = {version: value, index: 0, answers: {}, reviews: {}, phase: 'work'};
          delete stored.round;
          save();
          open('arbeit');
          break;
        case 'resume': open(active.phase === 'work' ? 'arbeit' : 'auswertung'); break;
        case 'home':
        case 'pause': open('start'); break;
        case 'jump':
          active.index = value;
          confirm = false;
          save();
          focus = '.bp-panel h2';
          render();
          break;
        case 'confirm':
          confirm = true;
          focus = '.bp-note p';
          render();
          break;
        case 'cancel':
          confirm = false;
          focus = '[data-bp-action="confirm"]';
          render();
          break;
        case 'submit':
          active.phase = 'results';
          (stored.completed ||= {})[active.version] = active;
          save();
          open('auswertung');
          break;
        case 'review': {
          const checkboxes = root.querySelectorAll('[data-bp-criterion^="' + value + '/"]');
          active.reviews[value] = {done: true, checked: Array.from(checkboxes, box => box.checked)};
          (stored.completed ||= {})[active.version] = active;
          save();
          // Preserve any other open panels and unfinished self-comparisons.
          const states = [...root.querySelectorAll('.bp-review')].map(panel => panel.open);
          const drafts = [...root.querySelectorAll('[data-bp-criterion]')].map(box => box.checked);
          render();
          root.querySelectorAll('.bp-review').forEach((panel,i) => { panel.open = states[i]; });
          root.querySelectorAll('[data-bp-criterion]').forEach((box,i) => { box.checked = drafts[i]; });
          root.querySelector('[data-bp-action="review"][data-bp-value="' + value + '"]').focus({preventScroll:true});
          break;
        }
        case 'retry': newRound(needsPractice(active)); break;
        case 'retry-again':
          newRound(missedTopics(round));
          break;
        case 'retry-check':
          if (!hasAnswer(retry[round.topics[round.index]][round.variant], round.answers[round.index])) {
            root.querySelector('[data-bp-notice]').textContent = 'Beantworte zuerst die Aufgabe.';
            return;
          }
          round.checked[round.index] = true;
          save();
          focus = '[data-bp-action="retry-next"]';
          render();
          break;
        case 'retry-next':
          if (round.index + 1 === round.topics.length) round.finished = true;
          else round.index += 1;
          save();
          focus = round.finished ? 'h1' : '.bp-panel h2';
          render();
          break;
      }
    });

  }

  const markerLabels = ['Ohren', 'Körperhaltung', 'Rute'];
  const markerPositions = [[63,44],[268,30],[470,38]];

  function mountObservation(root) {
    stored.observation ||= {};
    let index = stored.observation.index ?? 0;
    let focus;
    function render() {
      const item = observations[index];
      const entry = stored.observation[index] || {};
      const markers = entry.markers || [];
      const enough = markers.length >= 2;
      const checked = entry.checked && enough;
      const illustration = window.BioBehaviorLab.figure(item.animal, item.scene, true, false);
      root.innerHTML = '<div class="bs-school bp-root">' +
        heading('Körpersprache beobachten', 'Wähle mindestens zwei Bildmerkmale. Deute die Haltung im Zusammenhang mit der Situation.',
          '<a href="#schulstoff/sinne">Zum Lernlabor für Sinne</a>') +
        `<section class="bs-panel bp-panel"><div class="bp-scene-tabs" role="group" aria-label="Szene auswählen">
          ${observations.map((scene, i) => `<button type="button" class="btn small secondary" data-bo-scene="${i}"
            aria-pressed="${i === index}">Szene ${i+1} · ${scene.label}</button>`).join('')}</div>
          <h2 tabindex="-1">Szene ${index + 1} · ${item.label}</h2><p>${item.context}</p>
          <div class="bp-observation-image">${illustration}
            ${markerPositions.map(([x,y],i) => `<button type="button" data-bo-marker="${i}" aria-label="${markerLabels[i]}"
              aria-pressed="${markers.includes(i)}" style="--bo-x:${x/5.2}%;--bo-y:${y/2.52}%">${i+1}</button>`).join('')}
          </div>
          <p class="bp-status" role="status">${markers.length} von 3 Bildmerkmalen ausgewählt</p>
          ${markers.length ? '<ul class="bp-answers">' + markers.map(i => '<li><b>' + markerLabels[i] + ':</b> ' + item.signals[i] + '</li>').join('') + '</ul>' : ''}
          ${enough ? `<h3>Was bedeutet die Haltung hier wahrscheinlich?</h3>
            <fieldset class="bp-choices"><legend>Wähle eine Deutung</legend>
            ${item.interpretations.map((option,i) => `<label><input type="radio" name="bo-choice" value="${i}"
              ${entry.choice === i ? ' checked' : ''}> <span>${option}</span></label>`).join('')}</fieldset>
            <label class="bp-writing">Begründe mit zwei Beobachtungen<textarea data-bo-writing rows="4" maxlength="1500">${escape(entry.text)}</textarea></label>
            <div class="button-row bp-actions"><button type="button" class="btn" data-bo-check>Deutung prüfen</button></div>
            <p data-bo-notice role="status"></p>
            ${checked ? `<div class="bp-note" role="status"><p><strong>${entry.choice === item.answer ? '✓ Das passt.' : 'Schau noch einmal auf die Situation.'}</strong> ${item.reason}</p>
              <p><strong>Beispiel für eine Begründung:</strong> ${item.sample}</p></div>` : ''}
            ` : ''}
        </section></div>`;
      if (focus) root.querySelector(focus)?.focus({preventScroll: true});
      focus = undefined;
    }

    const container = document.createElement('div');
    root.replaceChildren(container);
    root = container;
    render();

    function update(values) {
      stored.observation[index] = {...stored.observation[index], ...values};
      save();
    }

    root.addEventListener('click', event => {
      const control = event.target.closest('button');
      if (!control) return;
      const entry = stored.observation[index] || {};
      if (control.dataset.boScene !== undefined) {
        index = Number(control.dataset.boScene);
        stored.observation.index = index;
        save();
        focus = '[data-bo-scene="' + index + '"]';
      } else if (control.dataset.boMarker !== undefined) {
        const part = Number(control.dataset.boMarker);
        const markers = new Set(entry.markers || []);
        if (markers.has(part)) markers.delete(part);
        else markers.add(part);
        update({markers: [...markers], checked: false});
        focus = '[data-bo-marker="' + part + '"]';
      } else if (control.hasAttribute('data-bo-check')) {
        if (!Number.isInteger(entry.choice) || !entry.text?.trim()) {
          root.querySelector('[data-bo-notice]').textContent = 'Wähle eine Deutung und schreibe eine kurze Begründung.';
          return;
        }
        update({checked: true});
        focus = '[data-bo-check]';
      } else return;
      render();
    });

    root.addEventListener('change', event => {
      if (!event.target.matches('input[name="bo-choice"]')) return;
      update({choice: Number(event.target.value), checked: false});
      focus = 'input[name="bo-choice"]:checked';
      render();
    });
    root.addEventListener('input', event => {
      if (!event.target.matches('[data-bo-writing]')) return;
      update({text: event.target.value, checked: false});
      root.querySelector('.bp-note')?.remove();
    });
  }

  window.BioLaborProbetest = {mountExam, mountObservation};
})();

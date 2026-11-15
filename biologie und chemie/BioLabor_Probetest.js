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
    const {jaws, toothDiagram, describeMark, markedPicture} = window.BioLaborAnatomie;
    const figure = type === 'bones'
      ? window.BioLaborKlassenarbeit.skeletonQuestion(species, part)
      : toothDiagram(species, jaws[species].marks.findIndex(([mark]) => mark === part), false);
    return markedPicture(figure, describeMark(type, species, part));
  }

  function readQuestion(question) {
    const description = question.picture ? window.BioLaborAnatomie.describeMark(...question.picture) : '';
    return window.BioLaborLernweg.readQuestion(question.prompt, description, question.options,
      question.rows?.map(([label]) => label));
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

  function pastAttempts(version, data = stored) {
    const entries = data.previousAttempts?.[version];
    return Array.isArray(entries) ? entries : [];
  }

  function archiveEntry(version, attempt) {
    const previous = pastAttempts(version - 1);
    if (!attempt || attempt === previous.length + 1) return stored.completed?.[version - 1];
    return previous[attempt - 1];
  }

  function formattedDate(entry) {
    return Number.isFinite(Date.parse(entry.at))
      ? new Intl.DateTimeFormat('de-DE',{dateStyle:'medium',timeStyle:'short'}).format(new Date(entry.at))
      : 'Datum unbekannt';
  }

  function unfinishedRound(followup) {
    return [stored.round, stored.pausedRound].find(round => round &&
      Boolean(round.followup) === followup && !round.finished);
  }

  function examHistory(data = stored) {
    return Object.entries(data.completed || {}).flatMap(([key, latest]) => {
      const version = Number(key);
      if (!versions[version]) return [];
      const previous = pastAttempts(version, data);
      return [...previous, latest].flatMap((entry, index) => {
        if (!entry || entry.version !== version || !entry.answers) return [];
        const archived = index < previous.length;
        const url = '#probetest/archiv/' + (version + 1) + '/' + (index + 1);
        return [{version, entry, number:index+1, archived, url}];
      });
    }).sort((a,b) => (Date.parse(b.entry.at) || 0) - (Date.parse(a.entry.at) || 0));
  }

  const reviewIsSaved = review => review?.done === true && !review.draft;

  function reviewProgress(entry) {
    const questions = versions[entry.version];
    const compared = questions.filter((question, i) => question.criteria &&
      hasAnswer(question, entry.answers[i]) && reviewIsSaved(entry.reviews?.[i])).length;
    const pending = questions.findIndex((question, i) => question.criteria &&
      hasAnswer(question, entry.answers[i]) && !reviewIsSaved(entry.reviews?.[i]));
    return {compared, pending};
  }

  function examStart(active, notice = '') {
    const historyItems = examHistory();
    const check = stored.followup;
    const due = Date.parse(check?.at);
    const followupReady = check && !check.done && Number.isFinite(due) && Date.now() >= due;
    const followupActive = unfinishedRound(true);
    const practiceActive = unfinishedRound(false);
    return heading('Interaktive Probeklassenarbeit',
      'Wähle eine von drei Fassungen. Plane etwa 15–20 Minuten ein. Jede Fassung enthält Bildaufgaben, Zuordnungen und zwei kurze Erklärfragen.',
      '<a href="#schulstoff">Zum Schulstoff</a><a href="#print">Arbeiten zum Drucken</a>') +
      `${notice ? '<p class="bp-note" role="status">' + notice + '</p>' : ''}
      <section class="bs-panel bp-panel"><h2>So läuft die Arbeit ab</h2>
      <p>Du kannst Fragen überspringen, zurückgehen und Antworten ändern. Tipps und Lösungen erscheinen nach der Abgabe. Erklärtexte vergleichst du dann selbst mit den Musterantworten.</p>
      ${active ? `<p class="bp-status">Arbeit ${active.version + 1} ist ${active.phase === 'results' ? 'abgegeben' : 'noch offen'}.</p>
        <div class="button-row">${button('resume', active.phase === 'results' ? 'Letzte Auswertung öffnen' : 'Arbeit fortsetzen')}</div>` : ''}
      ${check && !check.done && Number.isFinite(due) ? '<div class="bp-note"><strong>Kurzer Lerncheck</strong><p>' +
        (followupReady ? 'Prüfe mit neuen Beispielen, was du behalten hast.'
          : 'Der Lerncheck ist ab ' + new Intl.DateTimeFormat('de-DE',{dateStyle:'medium'}).format(new Date(check.at)) + ' verfügbar.') +
        '</p>' + (followupReady ? button('followup',followupActive ? 'Lerncheck fortsetzen' : 'Lerncheck starten') : '') + '</div>' : ''}
      ${practiceActive ? '<div class="button-row">' + button('retry', 'Wiederholung fortsetzen', true) + '</div>' : ''}
      <div class="bp-versions">${versions.map((questions, index) => `<article class="bs-card">
        <h3>Arbeit ${index + 1}</h3><p>${questions.length} Aufgaben · ${questions.filter(q => !q.criteria).reduce((sum,q) => sum + maxPoints(q),0)} automatisch prüfbare Punkte</p>
        ${active?.phase === 'work' && active.version === index ? button('resume', 'Arbeit ' + (index + 1) + ' fortsetzen', true)
          : button('start', 'Arbeit ' + (index + 1) + ' starten', true, index)}</article>`).join('')}</div></section>` +
      (historyItems.length ? `<section class="bs-panel bp-panel"><h2 id="bp-history" tabindex="-1">Abgegebene Arbeiten</h2><ul class="bp-answers">
        ${historyItems.map(({version, entry, number, archived, url}) => {
          const summary = examSummary(entry);
          return `<li>Arbeit ${version + 1} · ${summary.score} von ${summary.max} automatisch geprüften Punkten
            <small>Versuch ${number} · ${formattedDate(entry)}</small>
            <a href="${url}">${archived ? 'Früheren Versuch ' + number + ' zu Arbeit ' + (version + 1) + ' öffnen' : 'Auswertung zu Arbeit ' + (version + 1) + ' öffnen'}</a>
            <details><summary>Aufgaben und Antworten ansehen</summary>${archivedQuestions(entry)}</details></li>`;
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
    return '<fieldset class="bp-choices"><legend class="bl-visually-hidden">Antwortmöglichkeiten</legend>' + question.options.map((option, index) => `<label>
      <input type="radio" name="bp-answer" value="${index}"${answer === index ? ' checked' : ''}><span>${option}</span>
      </label>`).join('') + '</fieldset>';
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
        <div class="bl-task-reading">${readQuestion(question)}</div>
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
      const sample = '<p><strong>Musterantwort:</strong> ' + question.sample + '</p>';
      if (!hasAnswer(question, answer)) {
        return '<p><strong>Dein Text:</strong> Keine Antwort</p>' + sample +
          '<p>Überlege beim Lesen, welche Punkte du in einer eigenen Erklärung nennen würdest.</p>';
      }
      return `<p><strong>Dein Text:</strong> ${escape(answer)}</p>${sample}
        <fieldset class="bp-criteria"><legend>Vergleiche deinen Text mit diesen Kriterien</legend>
          ${question.criteria.map((criterion, i) => `<label><input type="checkbox" data-bp-criterion="${index}/${i}"
            ${(review.draft ?? review.checked)?.[i] ? ' checked' : ''}> ${criterion}</label>`).join('')}
        </fieldset>
        <div class="button-row">${button('review', 'Selbstvergleich speichern', true, index)}
          <span class="bp-status" data-bp-review-status role="status">${review.draft ? 'Auswahl vorgemerkt. Speichere den Selbstvergleich, wenn du fertig bist.'
            : review.done ? 'Selbstvergleich gespeichert' : ''}</span></div>`;
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

  function archive(entry) {
    if (!entry) return examStart(stored.exam, 'Diese Auswertung ist in diesem Profil nicht gespeichert.');
    const {score, max, writingCount} = examSummary(entry);
    const {compared, pending} = reviewProgress(entry);
    return heading('Auswertung · Arbeit ' + (entry.version + 1),
      'Automatisch geprüft: ' + score + ' von ' + max + ' Punkten. Erklärtexte verglichen: ' + compared + ' von ' + writingCount + '.',
      '<a href="#probetest">Zu den Probearbeiten</a>') +
      '<section class="bs-panel bp-panel"><h2>Dein Ergebnis nach Themen</h2>' +
      topicSummary(versions[entry.version], entry.answers) +
      (pending >= 0 ? '<div class="button-row">' + button('jump-review', 'Zum nächsten offenen Selbstvergleich', true, pending) + '</div>' : '') +
      '</section><section class="bs-panel bp-panel"><h2>Aufgaben und Antworten</h2>' +
      '<p>Abgegeben am ' + formattedDate(entry) + '</p>' + archivedQuestions(entry, true) + '</section>';
  }

  function archivedQuestions(entry, reviewEnabled = false) {
    return versions[entry.version].map((question, i) => {
      const answer = entry.answers[i];
      const status = questionStatus(question, answer, entry.reviews?.[i]);
      return `<details class="bp-review"${reviewEnabled ? ' data-bp-review="' + i + '"' : ''}><summary>Aufgabe ${i + 1} · ${skills[question.skill][0]} · ${status}</summary>
        <p><strong>${question.prompt}</strong></p>
        ${question.picture ? '<div class="bp-picture">' + picture(question.picture) + '</div>' : ''}
        ${question.criteria && !reviewEnabled
          ? '<p><strong>Dein Text:</strong> ' + (answer?.trim() ? escape(answer) : 'Keine Antwort') + '</p><p><strong>Musterantwort:</strong> ' + question.sample + '</p>'
          : reviewResult(question, answer, entry, i)}</details>`;
    }).join('');
  }

  function questionStatus(question, answer, review) {
    if (!hasAnswer(question, answer)) return question.rows && Object.keys(answer || {}).length ? 'Teilweise beantwortet' : 'Offen';
    if (question.criteria) return reviewIsSaved(review) ? 'Selbst verglichen' : 'Selbstvergleich offen';
    return objectivePoints(question, answer) === maxPoints(question) ? 'Richtig' : 'Noch üben';
  }

  function topicResults(questions, answers) {
    const groups = {};
    questions.forEach((question, i) => {
      if (question.criteria) return;
      const row = groups[question.skill] ||= {points:0, max:0};
      row.points += objectivePoints(question, answers[i]);
      row.max += maxPoints(question);
    });
    return Object.entries(groups);
  }

  function topicSummary(questions, answers) {
    return '<ul class="bp-topic-results">' + topicResults(questions, answers).map(([skill, row]) =>
      '<li><span>' + skills[skill][0] + '</span><b>' + row.points + ' von ' + row.max + ' Punkten</b></li>').join('') + '</ul>';
  }

  function examResults(active) {
    const questions = versions[active.version];
    const {score, max, writingCount} = examSummary(active);
    const {compared, pending: pendingReview} = reviewProgress(active);
    const topics = needsPractice(active);
    const links = [...new Set(topics.map(topic => retry[topic][0].skill))];
    const practiceActive = unfinishedRound(false);
    return heading('Auswertung · Arbeit ' + (active.version + 1),
      'Automatisch geprüft: ' + score + ' von ' + max + ' Punkten. Erklärtexte verglichen: ' + compared + ' von ' + writingCount + '.') +
      `<section class="bs-panel bp-panel"><h2>Dein Ergebnis nach Themen</h2>
      ${topicSummary(questions, active.answers)}</section>
      <section class="bs-panel bp-panel"><h2>Das kannst du wiederholen</h2>
      ${topics.length ? '<div class="bs-links">' + links.map(skill => `<a href="${skills[skill][1]}">${skills[skill][0]}</a>`).join('') + '</div>'
        : pendingReview >= 0
          ? '<p>Die automatisch geprüften Aufgaben sind richtig. Prüfe jetzt deine Erklärtexte.</p>'
          : '<p>Bei den abgegebenen und ausgewerteten Aufgaben gibt es gerade keinen offenen Übungsschwerpunkt.</p>'}
      <p>Beim Selbstvergleich kannst du abhaken, welche Punkte in deinen Erklärungen vorkommen.</p>
      <div class="button-row">${pendingReview >= 0 ? button('jump-review', 'Zum nächsten offenen Selbstvergleich', true, pendingReview) : ''}
        ${practiceActive ? button('retry', 'Wiederholung fortsetzen', true) : topics.length ? button('retry', 'Fehler gezielt wiederholen') : ''}
        ${stored.round?.finished ? '<a class="btn secondary" href="#probetest/wiederholen">' +
          (stored.round.followup ? 'Letzten Lerncheck ansehen' : 'Letzte Wiederholung ansehen') + '</a>' : ''}
        ${button('home', 'Zu den drei Arbeiten', true)}</div>
      </section><section class="bs-panel bp-panel"><h2>Antworten und Lösungen</h2>
      ${questions.map((question, index) => {
        const status = questionStatus(question, active.answers[index], active.reviews?.[index]);
        const complete = status === 'Richtig';
        return `<details class="bp-review" data-bp-review="${index}"${complete ? '' : ' open'}><summary>
          Aufgabe ${index + 1} · ${skills[question.skill][0]} · ${status}</summary>
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
    return heading(round.followup ? 'Kurzer Lerncheck' : 'Fehler gezielt wiederholen',
      'Aufgabe ' + (round.index + 1) + ' von ' + round.topics.length + ' · ' + skills[skill][0],
      round.followup || stored.exam?.phase !== 'results' ? '<a href="#probetest">Zu den Probearbeiten</a>' : '<a href="#probetest/auswertung">Zur Auswertung</a>') +
      `<section class="bs-panel bp-panel"><h2 tabindex="-1">${question.prompt}</h2>
        <div class="bl-task-reading">${readQuestion(question)}</div>
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
    return heading(round.followup ? 'Ergebnis deines Lernchecks' : 'Deine Wiederholungsrunde',
      (round.topics.length - open.length) + ' von ' + round.topics.length + ' Aufgaben in einem neuen Beispiel richtig gelöst.',
      round.followup || stored.exam?.phase !== 'results' ? '<a href="#probetest">Zu den Probearbeiten</a>' : '<a href="#probetest/auswertung">Zur Auswertung der Arbeit</a>') +
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

  function mountExam(outer, section, setRoute, archiveVersion, archiveAttempt) {
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
      window.speechSynthesis?.cancel();
      const active = stored.exam;
      const round = stored.round;
      const views = {
        start: () => examStart(active),
        arbeit: () => active?.phase === 'work' ? examQuestion(active, confirm) : examStart(active),
        auswertung: () => active?.phase === 'results' ? examResults(active) : examStart(active),
        archiv: () => Number.isInteger(archiveVersion)
          ? archive(archiveEntry(archiveVersion, archiveAttempt))
          : examStart(active, examHistory().length ? '' : 'In diesem Profil wurde noch keine Arbeit abgegeben.'),
        wiederholen: () => !round?.topics?.length
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

    function openRound(topics, followup = false, redirect = false) {
      const current = stored.round;
      const pending = unfinishedRound(followup);
      if (!pending && !topics.length) return;
      if (pending !== current) {
        if (pending === stored.pausedRound) delete stored.pausedRound;
        if (current && !current.finished) stored.pausedRound = current;
      }
      stored.round = pending || {topics, followup, answers: {}, checked: {}, index: 0,
        variant: ((current?.variant ?? -1) + 1) % 3, finished: false};
      save();
      if (redirect) history.replaceState(null, '', '#probetest/wiederholen');
      open('wiederholen');
    }

    if (screen === 'uebungsentwurf' && unfinishedRound(false)) {
      openRound([], false, true);
    } else {
      if (screen === 'archiv' && !Number.isInteger(archiveVersion)) focus = '#bp-history';
      render();
    }

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

    function currentReview() {
      return screen === 'archiv' ? archiveEntry(archiveVersion, archiveAttempt)
        : screen === 'auswertung' ? stored.exam : undefined;
    }

    function saveReview(entry) {
      const isLatest = screen !== 'archiv' || stored.completed?.[entry.version] === entry;
      if (isLatest) (stored.completed ||= {})[entry.version] = entry;
      const active = stored.exam;
      if (isLatest && active?.phase === 'results' && active.version === entry.version && active.at === entry.at) {
        active.reviews = entry.reviews;
      }
      save();
    }

    root.addEventListener('change', event => {
      const target = event.target;
      if (target.matches('[data-bp-criterion]')) {
        const entry = currentReview();
        if (!entry) return;
        const [index] = target.dataset.bpCriterion.split('/');
        const review = (entry.reviews ||= {})[index] ||= {};
        const fields = target.closest('fieldset').querySelectorAll('[data-bp-criterion]');
        review.draft = Array.from(fields, box => box.checked);
        target.closest('.bp-review').querySelector('[data-bp-review-status]').textContent =
          'Auswahl vorgemerkt. Speichere den Selbstvergleich, wenn du fertig bist.';
        saveReview(entry);
        return;
      }
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
      else root.querySelector('[data-bp-notice]').textContent = '';
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
        case 'submit': {
          const previous = stored.completed?.[active.version];
          if (previous) {
            stored.previousAttempts ||= {};
            (stored.previousAttempts[active.version] ||= []).push(previous);
          }
          active.at = new Date().toISOString();
          active.phase = 'results';
          (stored.completed ||= {})[active.version] = active;
          save();
          open('auswertung');
          break;
        }
        case 'review': {
          const checkboxes = root.querySelectorAll('[data-bp-criterion^="' + value + '/"]');
          const entry = currentReview();
          if (!entry || !checkboxes.length) return;
          (entry.reviews ||= {})[value] = {done: true, checked: Array.from(checkboxes, box => box.checked)};
          saveReview(entry);
          const states = [...root.querySelectorAll('.bp-review')].map(panel => panel.open);
          render();
          root.querySelectorAll('.bp-review').forEach((panel,i) => { panel.open = states[i]; });
          root.querySelector('[data-bp-action="review"][data-bp-value="' + value + '"]').focus({preventScroll:true});
          break;
        }
        case 'jump-review': {
          const panel = root.querySelector('[data-bp-review="' + value + '"]');
          if (panel) {
            panel.open = true;
            window.BioLaborLernweg.focus(panel.querySelector('summary'), true);
          }
          break;
        }
        case 'retry':
          openRound(active?.phase === 'results' ? needsPractice(active) : []);
          break;
        case 'followup':
          if (stored.followup?.topics?.length && Date.now() >= Date.parse(stored.followup.at)) {
            const check = stored.followup;
            const prior = stored.checkResult;
            const solved = Date.parse(prior?.at) >= Date.parse(check.at) ? prior.topics : [];
            openRound(check.topics.filter(topic => !solved.includes(topic)), true);
          }
          break;
        case 'retry-again':
          openRound(missedTopics(round), Boolean(round.followup));
          break;
        case 'retry-check':
          if (!hasAnswer(retry[round.topics[round.index]][round.variant], round.answers[round.index])) {
            root.querySelector('[data-bp-notice]').textContent = 'Beantworte zuerst die Aufgabe.';
            const field = [...root.querySelectorAll('[data-bp-row]')].find(select => !select.value)
              || root.querySelector('input[name="bp-answer"]');
            field?.focus();
            return;
          }
          round.checked[round.index] = true;
          save();
          focus = '[data-bp-action="retry-next"]';
          render();
          break;
        case 'retry-next':
          if (round.index + 1 === round.topics.length) {
            round.finished = true;
            const openTopics = missedTopics(round);
            if (round.followup) {
              const check = stored.followup;
              const prior = stored.checkResult;
              const sameCheck = Date.parse(prior?.at) >= Date.parse(check.at);
              const solved = new Set(sameCheck ? prior?.topics : []);
              round.topics.filter(topic => !openTopics.includes(topic)).forEach(topic => solved.add(topic));
              const topics = check.topics.filter(topic => solved.has(topic));
              stored.checkResult = {at:new Date().toISOString(), right:topics.length, total:check.topics.length, topics};
              check.done = topics.length === check.topics.length;
            }
            if (!openTopics.length && !round.followup) {
              if ((!stored.followup || stored.followup.done) && !unfinishedRound(true)) {
                const tomorrow = new Date();
                tomorrow.setHours(24,0,0,0);
                stored.followup = {at:tomorrow.toISOString(), topics:round.topics.slice(0,3), done:false};
              }
            }
          } else round.index += 1;
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
    let index = Number.isInteger(stored.observation.index) && observations[stored.observation.index]
      ? stored.observation.index : 0;
    let focus;
    function render() {
      window.speechSynthesis?.cancel();
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
          <div class="bl-task-reading">${window.BioLaborLernweg.readAloud('Situation vorlesen', item.context)}</div>
          <div class="bp-observation-image">${illustration}
            ${markerPositions.map(([x,y],i) => `<button type="button" data-bo-marker="${i}" aria-label="${markerLabels[i]}"
              aria-pressed="${markers.includes(i)}" style="--bo-x:${x/5.2}%;--bo-y:${y/2.52}%">${i+1}</button>`).join('')}
          </div>
          <div class="bp-observation-text">
            <p>Oder wähle die Merkmale über die Liste.</p>
            <div class="button-row" role="group" aria-label="Merkmale aus der Liste auswählen">
              ${markerLabels.map((label,i) => `<button type="button" class="btn small secondary" data-bo-text-marker="${i}" aria-pressed="${markers.includes(i)}">${label} beschreiben</button>`).join('')}
            </div>
          </div>
          <p class="bp-status" role="status">${markers.length} von 3 Bildmerkmalen ausgewählt</p>
          ${markers.length ? '<ul class="bp-answers">' + markers.map(i => '<li><b>' + markerLabels[i] + ':</b> ' + item.signals[i] + '</li>').join('') + '</ul>' : ''}
          ${markers.length ? window.BioLaborLernweg.readAloud('Merkmale vorlesen', markers.map(i =>
            markerLabels[i] + '. ' + item.signals[i]).join(' ')) : ''}
          ${enough ? `<h3>Was bedeutet die Haltung hier wahrscheinlich?</h3>
            <fieldset class="bp-choices"><legend>Wähle eine Deutung</legend>
            ${item.interpretations.map((option,i) => `<label><input type="radio" name="bo-choice" value="${i}"
              ${entry.choice === i ? ' checked' : ''}> <span>${option}</span></label>`).join('')}</fieldset>
            <label class="bp-writing">Begründe mit zwei Beobachtungen <small>„Ich sehe … und … . In dieser Situation vermute ich deshalb …“</small><textarea data-bo-writing rows="4" maxlength="1500">${escape(entry.text)}</textarea></label>
            <div class="button-row bp-actions"><button type="button" class="btn" data-bo-check>Deutung prüfen</button></div>
            <p data-bo-notice role="status"></p>
            ${checked ? `<div class="bp-note" role="status" tabindex="-1"><p><strong>${entry.choice === item.answer ? '✓ Das passt als Deutung.' : 'Prüfe deine Deutung noch einmal.'}</strong> ${item.reason}</p>
              <p><strong>Beispiel für eine Begründung:</strong> ${item.sample}</p>
              <fieldset class="bp-criteria"><legend>Vergleiche deine Begründung selbst</legend>
                <p>Ob dein Text passt, prüfst du anhand dieser beiden Punkte.</p>
                <label><input type="checkbox" data-bo-review="0" ${entry.review?.[0] ? 'checked' : ''}>
                  Ich habe zwei verschiedene, sichtbare Signale beschrieben.</label>
                <label><input type="checkbox" data-bo-review="1" ${entry.review?.[1] ? 'checked' : ''}>
                  Ich habe erklärt, wie die Signale in dieser Situation zu meiner Deutung passen.</label>
              </fieldset></div>` : ''}
            ` : ''}
        </section></div>`;
      if (focus) root.querySelector(focus)?.focus({preventScroll: focus !== '.bp-note' && focus !== '.bp-panel h2'});
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
        focus = '.bp-panel h2';
      } else if (control.dataset.boMarker !== undefined || control.dataset.boTextMarker !== undefined) {
        const viaList = control.dataset.boTextMarker !== undefined;
        const part = Number(control.dataset.boTextMarker ?? control.dataset.boMarker);
        const markers = new Set(entry.markers || []);
        if (markers.has(part)) markers.delete(part);
        else markers.add(part);
        update({markers: [...markers], checked: false, review: []});
        focus = (viaList ? '[data-bo-text-marker="' : '[data-bo-marker="') + part + '"]';
      } else if (control.hasAttribute('data-bo-check')) {
        if (!Number.isInteger(entry.choice) || !entry.text?.trim()) {
          const missingChoice = !Number.isInteger(entry.choice);
          const notice = root.querySelector('[data-bo-notice]');
          notice.textContent = missingChoice && !entry.text?.trim() ? 'Wähle eine Deutung und schreibe eine kurze Begründung.'
            : missingChoice ? 'Wähle zuerst eine Deutung.' : 'Schreibe zuerst eine kurze Begründung.';
          window.BioLaborLernweg.focus(root.querySelector(missingChoice ? '[name="bo-choice"]' : '[data-bo-writing]'));
          return;
        }
        update({checked: true, at: new Date().toISOString()});
        focus = '.bp-note';
      } else return;
      render();
    });

    root.addEventListener('change', event => {
      if (event.target.matches('[data-bo-review]')) {
        const review = [...(stored.observation[index]?.review || [])];
        review[Number(event.target.dataset.boReview)] = event.target.checked;
        update({review});
        return;
      }
      if (!event.target.matches('input[name="bo-choice"]')) return;
      update({choice: Number(event.target.value), checked: false, review: []});
      root.querySelector('.bp-note')?.remove();
      root.querySelector('[data-bo-notice]').textContent = '';
    });
    root.addEventListener('input', event => {
      if (!event.target.matches('[data-bo-writing]')) return;
      update({text: event.target.value, checked: false, review: []});
      root.querySelector('.bp-note')?.remove();
      root.querySelector('[data-bo-notice]').textContent = '';
    });
  }

  function progress() {
    const entries = examHistory().map(({entry, number, url: archiveUrl}) => {
        const questions = versions[entry.version];
        const topics = needsPractice(entry);
        const practiceSkills = [...new Set(topics.map(topic => retry[topic][0].skill))];
        const strong = [...new Set(questions.filter((q, i) => !q.criteria &&
          objectivePoints(q, entry.answers[i]) === maxPoints(q)).map(q => q.skill))]
          .filter(skill => !practiceSkills.includes(skill)).map(skill => skills[skill][0]);
        const {compared, pending} = reviewProgress(entry);
        const url = archiveUrl;
        const practiceLinks = practiceSkills.map(skill => [
          skills[skill][0], skills[skill][1], topics.filter(topic => retry[topic][0].skill === skill),
        ]);
        const reviewLink = pending >= 0 ? [url, 'Erklärtexte vergleichen'] : null;
        return {version:entry.version, number, url, at:entry.at, ...examSummary(entry), compared, strong,
          practiceLinks, reviewLink};
      });
    const scenes = observations.flatMap((item, i) => {
      const entry = stored.observation?.[i];
      return entry?.checked && entry.markers?.length >= 2 ? [{at:entry.at, right:entry.choice === item.answer}] : [];
    });
    const check = stored.followup;
    const result = stored.checkResult;
    const solvedTopics = Array.isArray(result?.topics) ? result.topics.filter(topic => retry[topic]?.[0]) : [];
    const checkResult = result && {...result, solvedTopics,
      topics:[...new Set(solvedTopics.map(topic => skills[retry[topic][0].skill][0]))]};
    return {entries, last:entries[0], draft:stored.exam?.phase === 'work', practicePending:Boolean(unfinishedRound(false)),
      observations:scenes.length, observationTotal:observations.length,
      observationRight:scenes.filter(scene => scene.right).length, checkResult,
      followupDue:Boolean(check && !check.done && Date.now() >= Date.parse(check.at)),
      observationAt:scenes.map(scene => scene.at).filter(Boolean).sort().at(-1)};
  }

  function comparisonReport(snapshot) {
    let data = stored;
    if (snapshot !== undefined) {
      try { data = JSON.parse(snapshot) || {}; }
      catch { data = {}; }
    }
    const latest = examHistory(data)[0];
    if (!latest) return null;
    const {entry, url} = latest;
    const topics = topicResults(versions[entry.version], entry.answers).map(([id, {points, max}]) => ({
      id, title:skills[id][0], score:points, max,
    }));
    const explanations = versions[entry.version].flatMap((question, index) => {
      if (!question.criteria) return [];
      const review = entry.reviews?.[index];
      return hasAnswer(question, entry.answers[index]) && reviewIsSaved(review) &&
        question.criteria.every((_, i) => review.checked?.[i]) ? [] : [skills[question.skill][0]];
    });
    return {at:entry.at, url, topics, explanations:[...new Set(explanations)]};
  }

  window.BioLaborProbetest = {mountExam, mountObservation, progress, comparisonReport};
})();

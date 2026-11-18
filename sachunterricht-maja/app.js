"use strict";

const main = document.querySelector("main");
const theme = document.querySelector("#theme");
const storageKey = "majas-sachunterricht-v1";
const phasen = ["Entdecken", "Verstehen", "Mitmachen", "Üben", "Überprüfen"];
const figurNamen = { maja: "Maja", stern: "Stern", baerli: "Bärli" };
const stationNachId = Object.fromEntries(stationen.map(station => [station.id, station]));
const bilder = ["regenbrief", "mitternachtsparty", "mondpfuetze", "wunschknopf"];
const pyramidBlocks = [1, 2, 1, 2, 1, 4, 5, 6];
const bildtexte = [
  "Maja und Stern knien draußen nebeneinander auf einer Wiese.",
  "Maja, Stern und Bärli mit Luca im Drachenkostüm bei ihrer Mitternachtsparty.",
  "Maja und Stern schauen sich im Mondlicht eine Pfütze an.",
  "Maja und Stern öffnen zusammen eine runde Dose.",
];
const pyramidenFragen = [
  ["Linsen", 4], ["Vollkornbrot", 5], ["Leitungswasser", 7], ["Naturjoghurt", 3],
  ["Sonnenblumenkerne", 2], ["Möhre", 6], ["Rapsöl", 1], ["Schokolade", 0],
];
const schritteFit = [
  ["👟", "Bewegen", "Maja fährt Rad oder spielt Fangen. Ihr Herz schlägt dabei schneller."],
  ["💧", "Trinken", "Maja packt eine Flasche Wasser ein und trinkt zwischendurch."],
  ["🌙", "Erholen", "Eine ruhige Pause und Schlaf helfen Maja, sich zu erholen."],
];

let state = { done: {}, drafts: {}, results: {}, last: "", theme: "" };
let storageAvailable = true;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved?.done && saved.drafts && saved.results) state = saved;
} catch {
  storageAvailable = false;
}

let route = [];
let activity = {};
let quiz = {};
let screenId = 0;
let utterance;
const hasSpeech = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
const html = value => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);

function save() {
  if (!storageAvailable) return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    storageAvailable = false;
  }
}

function aktualisiereSterne() {
  const count = stationen.filter(station => state.done[station.id]).length;
  const examStars = pruefungen.filter((_, i) => state.results[i]?.best >= 6).length;
  document.querySelector("#score-number").textContent = count + examStars;
}

function applyTheme() {
  const dark = state.theme ? state.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]').content = dark ? "#192721" : "#faf6ed";
  theme.textContent = dark ? "☀" : "☾";
  theme.setAttribute("aria-label", dark ? "Helles Design einschalten" : "Dunkles Design einschalten");
}

theme.addEventListener("click", () => {
  state.theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme();
  save();
});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

const figur = (key, className = "portrait", label = figurNamen[key]) =>
  `<img class="${className}" src="./assets/${key}.webp" alt="${html(label)}" width="144" height="144">`;

const button = (label, action, option = "", cls = "secondary") =>
  `<button class="${cls}" type="button" data-do="${action}" data-value="${html(option)}">${label}</button>`;

const wrappedTitle = title => title.replace("Ernährungspyramide", "Ernährungs&shy;pyramide")
  .replace("Probeklassenarbeiten", "Probe&shy;klassenarbeiten");
const nav = (label, target, cls = "secondary") => `<a href="#${target}" class="${cls}">${label}</a>`;
const breadcrumb = (label = "Zur Startseite", target = "start") => nav(`← ${label}`, target, "breadcrumb");
const speechButtons = () => hasSpeech
  ? `<div class="speech-controls">${button("▶ Vorlesen", "speak", "1", "subtle-button")}${button("Langsam", "speak", "0.75", "subtle-button")}${button("■ Stopp", "stop", "", "subtle-button")}<span class="speech-status" role="status"></span></div>`
  : "";
const bilddialog = () => `<dialog id="bilddialog" aria-label="Geschichtenbild"><button class="secondary" type="button" data-do="close-image">Schließen</button><img alt=""></dialog>`;

function renderStart() {
  const open = stationen.find(station => station.id === state.last && !state.done[station.id])
    || stationen.find(station => !state.done[station.id]);
  const resume = open ? state.drafts[open.id] || 0 : 0;
  const doneCount = stationen.filter(station => state.done[station.id]).length;
  const stations = stationen.map(station => `
    <a class="station ${station.color}" href="#station/${station.id}/${state.drafts[station.id] || 0}">
      <span class="tile-icon" aria-hidden="true">${station.icon}</span>
      <div><h3>${wrappedTitle(station.title)}</h3><p>${station.short}</p></div>
      <span class="tile-arrow" ${state.done[station.id] ? 'aria-label="Abgeschlossen"' : 'aria-hidden="true"'}>${state.done[station.id] ? "✓" : "→"}</span>
    </a>`).join("");

  return `
    <section class="hero" aria-labelledby="page-title">
      <div class="hero-text">
        <p class="eyebrow">Sachunterricht · Klasse 3</p>
        <h1 id="page-title" tabindex="-1">Was braucht<br>mein <em>Körper?</em></h1>
        <p>Entdecke mit Maja, Stern und Bärli, was dir Energie gibt und wie du ein buntes Frühstück zusammenstellst.</p>
        <div class="hero-actions">
          ${open ? nav(state.drafts[open.id] !== undefined ? "Weiterlernen →" : "Los geht’s →", `station/${open.id}/${resume}`, "primary") : nav("Zur Probeklassenarbeit →", "pruefungen", "primary")}
          ${nav("Probeklassenarbeiten", "pruefungen", "hero-link")}
        </div>
      </div>
      <div class="hero-art">
        <img class="hero-book" src="./assets/mitternachtsparty.webp" width="960" height="640" alt="Maja, Bärli, Stern und Luca sitzen bei der Mitternachtsparty zusammen.">
        <div class="hero-friends">
          ${["maja", "stern", "baerli"].map(key => `<span>${figur(key, "portrait", "")}<small>${figurNamen[key]}</small></span>`).join("")}
        </div>
      </div>
    </section>
    <section class="stations-section" aria-labelledby="stations-title">
      <div class="section-title"><h2 id="stations-title">Deine Lernstationen</h2><p>${doneCount} von ${stationen.length} geschafft</p></div>
      <div class="station-grid">${stations}
        <a class="station test-tile" href="#pruefungen"><span class="tile-icon" aria-hidden="true">✎</span><div><h3>${wrappedTitle("Probeklassenarbeiten")}</h3><p>Fünf Arbeiten mit Lösungen</p></div><span class="tile-arrow" aria-hidden="true">→</span></a>
      </div>
    </section>`;
}

function renderStation() {
  const [, id, stepText = "0"] = route;
  const step = Number(stepText);
  const s = Object.hasOwn(stationNachId, id) ? stationNachId[id] : undefined;
  if (!s || !Number.isInteger(step) || step < 0 || step >= phasen.length) return renderMissing();
  state.drafts[id] = step;
  state.last = id;
  save();
  activity = { index: 0, left: 0, right: 1, amount: 100, breakfast: [] };
  quiz = { index: 0, selected: [], checked: false };
  const stepNav = phasen.map((phase, i) => `<li><a href="#station/${id}/${i}" ${step === i ? 'aria-current="step"' : ""}><span>${i + 1}</span>${phase}</a></li>`).join("");
  let body;
  if (step === 0) {
    body = `<div class="story-lead" data-read><p>${s.scene}</p><p class="think">${s.prompt}</p></div>${speechButtons()}`;
  } else if (step === 1) {
    body = `<div class="fact-grid" data-read>${s.facts.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>${speechButtons()}`;
  } else if (step === 2) {
    body = `<p>${s.task}</p><div id="activity">${renderActivity(s.activity)}</div>`;
  } else {
    body = `<div id="question-area">${renderPractice(s)}</div>`;
  }
  const next = step < 2 ? nav(`${phasen[step + 1]} →`, `station/${id}/${step + 1}`, "primary") : "";
  return `<div class="route">
    ${breadcrumb()}
    <header class="unit-header ${s.color}"><div><p class="eyebrow">Lernstation · ${s.short}</p><h1 id="page-title" tabindex="-1">${s.title}</h1></div>${figur(s.figur)}</header>
    <ol class="step-nav" aria-label="Lernschritte">${stepNav}</ol>
    <section class="panel" aria-labelledby="phase-title">
      <h2 id="phase-title">${phasen[step]}</h2>
      ${body}
      ${next ? `<div class="actions">${next}</div>` : ""}
    </section>
  </div>`;
}

function renderActivity(kind) {
  if (kind === "fit" || kind === "labor") {
    const cards = kind === "fit"
      ? schritteFit.map(([icon, title, text]) => [title, icon, text, ""])
      : naehrstoffe;
    const current = cards[activity.index];
    return `<div class="discovery-grid">${cards.map(([title, icon], index) => button(`<span aria-hidden="true">${icon}</span><strong>${title}</strong>`, "discover", index, `choice-card${activity.index === index ? " active" : ""}`).replace(" data-do=", ` aria-pressed="${activity.index === index}" data-do=`)).join("")}</div>
      <div class="reveal" data-read><h3>${current[0]}</h3><p>${current[2]}</p>${current[3] ? `<p><strong>Beispiele</strong> · ${current[3]}</p>` : ""}</div>${speechButtons()}`;
  }
  if (kind === "ballast") {
    return `<div class="fiber-model ${activity.bound ? "fiber-bound" : ""}" aria-hidden="true">
      <span class="fiber-drop">💧</span><span class="fiber-drop second">💧</span><span class="fiber-center">✦</span>
    </div><div class="reveal" role="status">${activity.bound ? "Wasser wurde gebunden. Manche Ballaststoffe quellen dabei auf." : "Im Modell ist das Wasser noch neben dem Ballaststoff."}</div>
    <div class="actions">${button(activity.bound ? "Noch einmal ↺" : "Wasser binden", "fiber", "", "secondary")}</div>`;
  }
  if (kind === "pyramide") {
    const p = gruppen[activity.index];
    const zeilen = [[0], [1, 2], [3, 4], [5], [6], [7]];
    const food = pyramidenFragen[activity.food || 0];
    return `<div class="legend"><span class="red">Rot · sparsam genießen</span><span class="yellow">Gelb · passende Mengen</span><span class="green">Grün · reichlich</span></div>
      <h3 id="pyramid-question">Wohin gehört ${food[0]}?</h3>
      <p>Tippe auf die passende Gruppe.</p>
      <div class="pyramid" aria-labelledby="pyramid-question">${zeilen.map((row, index) => `<div class="pyramid-row row-${index}">${row.map(i => {
        const g = gruppen[i];
        return button(`<span aria-hidden="true">${g.icon}</span> ${g.name}
          <span class="pyramid-blocks" aria-hidden="true">${"<i></i>".repeat(pyramidBlocks[i])}</span>`,
          "pyramid-pick", i, `pyramid-cell ${g.farbe}${i === activity.index && activity.choice !== undefined ? " active" : ""}`)
          .replace(" data-do=", ` style="--blocks:${pyramidBlocks[i]}" data-do=`);
      }).join("")}</div>`).join("")}</div>
      <div class="reveal" role="status">${activity.choice === undefined ? "" : `<strong>${activity.choice === food[1] ? "Richtig zugeordnet." : "Versuch es noch einmal."}</strong> ${p.name} · ${p.beispiel}`}</div>
      ${activity.choice === food[1] ? `<div class="actions">${button("Nächstes Lebensmittel →", "pyramid-next")}</div>` : ""}`;
  }
  if (kind === "fruehstueck") {
    const count = activity.breakfast.filter(item => item !== undefined).length;
    return `<div class="breakfast-grid">${fruehstueck.map(([group, icon, options], i) => `
      <label class="breakfast-group" for="breakfast-${i}"><span aria-hidden="true">${icon}</span> <strong>${group}</strong>
      <select id="breakfast-${i}" data-change="breakfast" data-value="${i}">
        <option value="">Auswählen …</option>${options.map((item, j) => `<option value="${j}" ${activity.breakfast[i] === j ? "selected" : ""}>${item}</option>`).join("")}
      </select></label>`).join("")}</div>
      <div class="tray" role="status"><strong>Dein Tablett · ${count} von 4 Bausteinen</strong><div>
        ${fruehstueck.map(([name, icon, list], i) => `<span class="tray-slot ${list[activity.breakfast[i]] ? "filled" : ""}"><span aria-hidden="true">${icon}</span> ${list[activity.breakfast[i]] || name}</span>`).join("")}
      </div>${count === 4 ? "<p>Dein Pyramidenfrühstück ist fertig!</p>" : ""}</div>`;
  }
  if (kind === "zucker") {
    const measure = id => `<label for="glass-${id}"><strong>Getränk ${id === "left" ? "1" : "2"}</strong>
      <select id="glass-${id}" data-change="${id}">${getraenke.map((g, i) => `<option value="${i}" ${activity[id] === i ? "selected" : ""}>${g.name}</option>`).join("")}</select></label>`;
    const [left, right] = [getraenke[activity.left], getraenke[activity.right]];
    const graph = drink => {
      const grams = drink.grams * activity.amount / 100;
      return `<div class="drink"><span class="drink-icon" aria-hidden="true">${drink.icon}</span><strong>${drink.name}</strong><small>${grams} g Zucker je ${activity.amount} ml</small>
        <div class="sugar-track" aria-hidden="true"><span class="sugar-fill" style="--fill:${grams * 4}%"></span></div></div>`;
    };
    return `<div class="drink-selects">${measure("left")}${measure("right")}</div>
      <label class="amount" for="amount"><strong>Vergleichsmenge</strong>
        <select id="amount" data-change="amount"><option value="100" ${activity.amount === 100 ? "selected" : ""}>je 100 ml</option><option value="200" ${activity.amount === 200 ? "selected" : ""}>je 200 ml</option></select>
      </label><div class="drink-graph" role="status">${graph(left)}${graph(right)}</div>`;
  }
  const [name, text, prompt] = geschichte[activity.index];
  return `<div class="story-grid"><figure><button class="story-image" data-do="image" type="button" aria-label="Figurenbild aus der Wortwerkstatt vergrößern">
      <img src="./assets/${bilder[activity.index]}.webp" alt="${bildtexte[activity.index]}" width="960" height="640"><span aria-hidden="true">⤢</span></button><figcaption>Bild aus der Wortwerkstatt</figcaption></figure>
      <div class="story-lead" data-read><p class="eyebrow">Szene ${activity.index + 1} von ${geschichte.length}</p><h3>${name}</h3><p>${text}</p><p class="think">${prompt}</p></div>
    </div>${speechButtons()}${bilddialog()}
    <div class="actions">${activity.index > 0 ? button("← Vorige Szene", "story-prev") : ""}
      ${activity.index + 1 < geschichte.length ? button("Nächste Szene →", "story-next") : ""}</div>`;
}

function activityNext(s) {
  return `<div class="actions activity-next">${nav("Weiter zum Üben →", `station/${s.id}/3`, "primary")}</div>`;
}

function questionMarkup(q, selected, legendPrefix = "Aufgabe", locked = false) {
  const multiple = q.correct.length > 1;
  const hint = multiple ? "Wähle alle passenden Antworten." : "Wähle eine Antwort.";
  return `<fieldset class="question"><legend tabindex="-1" data-question-heading><span class="eyebrow question-kicker">${legendPrefix}</span><span data-question-text>${q.text}</span></legend>
    <p class="question-hint" id="question-hint">${hint}</p>
    <div class="answers" aria-describedby="question-hint">${q.options.map((option, i) => {
      const checked = selected.includes(i);
      const status = locked ? (q.correct.includes(i) ? " right" : checked ? " wrong" : "") : "";
      return `<label class="answer${status}"><input type="${multiple ? "checkbox" : "radio"}" name="answer" value="${i}" ${checked ? "checked" : ""} ${locked ? "disabled" : ""}>
      <span>${option}</span>${locked && status ? `<strong class="answer-mark">${status === " right" ? "Richtig" : "Falsch"}</strong>` : ""}</label>`;
    }).join("")}</div></fieldset>`;
}

function istRichtig(q, selected) {
  return selected.length === q.correct.length && q.correct.every(index => selected.includes(index));
}

function renderPractice(station) {
  const check = Number(route[2]) === 4;
  const tasks = check ? [station.check] : station.practice;
  const q = tasks[quiz.index];
  const success = quiz.checked && istRichtig(q, quiz.selected);
  const nextStation = stationen[stationen.indexOf(station) + 1];
  const description = quiz.checked ? `<div class="feedback ${success ? "success" : "retry"}" id="feedback" tabindex="-1" role="status">
    <strong>${success ? (check ? "★ Stern verdient!" : "Richtig!") : "Schau dir die Lösung an."}</strong> <span>${q.why}</span></div>` : "";
  let actions;
  if (!quiz.checked) actions = button("Antwort prüfen", "check", "", "primary");
  else if (check) actions = success
    ? (nextStation ? nav("Nächste Station →", `station/${nextStation.id}/0`, "primary") : nav("Zu den Probeklassenarbeiten →", "pruefungen", "primary"))
    : button("Noch einmal", "retry", "", "primary");
  else actions = quiz.index + 1 < tasks.length
    ? button("Nächste Aufgabe →", "next-question", "", "primary")
    : nav("Wissen überprüfen →", `station/${station.id}/4`, "primary");
  return `${questionMarkup(q, quiz.selected, check ? "Wissenscheck" : `Aufgabe ${quiz.index + 1} von ${tasks.length}`, quiz.checked)}
    ${speechButtons()}${description}<div class="actions">${actions}${check && success ? nav("Zur Übersicht", "start") : ""}</div><p class="message" role="status"></p>`;
}

function renderExamList() {
  return `<div class="route">${breadcrumb()}<header class="unit-header pfirsich"><div><p class="eyebrow">Alle Themen · Klasse 3</p><h1 id="page-title" tabindex="-1">Probeklassenarbeiten</h1></div>${figur("baerli")}</header>
    <div class="panel"><p>Jede Arbeit hat acht Aufgaben. Die Lösungen erscheinen nach der Abgabe. Du kannst zurückblättern und deine Antworten ändern.</p>
    <div class="test-list">${pruefungen.map((exam, i) => `
      <article><span class="test-num" aria-hidden="true">${i + 1}</span><div><h2>${exam.title}</h2><p>${state.results[i] ? `Bisher bestes Ergebnis: ${state.results[i].best} von ${exam.tasks.length}` : "8 Aufgaben"}</p></div>
      <div class="test-actions">${state.results[i] ? nav("Lösungen", `ergebnis/${i + 1}`) : ""}${nav(state.drafts[`exam-${i}`] ? "Fortsetzen →" : "Starten →", `pruefung/${i + 1}`, "primary")}</div></article>`).join("")}</div></div></div>`;
}

function examIndex() {
  return Number(route[1]) - 1;
}

function draftExam(i) {
  const key = `exam-${i}`;
  if (!state.drafts[key]) state.drafts[key] = { index: 0, answers: pruefungen[i].tasks.map(() => []) };
  return state.drafts[key];
}

function renderExam() {
  const i = examIndex();
  const exam = pruefungen[i];
  if (!exam) return renderMissing();
  const draft = draftExam(i);
  const q = exam.tasks[draft.index][1];
  const count = draft.answers.filter(a => a.length).length;
  const taskLinks = exam.tasks.map((_, j) => button(`<span aria-hidden="true">${j + 1}</span>`, "exam-go", j, `jump${j === draft.index ? " current" : ""}${draft.answers[j].length ? " filled" : ""}`)
    .replace(" data-do=", ` aria-label="Aufgabe ${j + 1}, ${draft.answers[j].length ? "beantwortet" : "offen"}" ${j === draft.index ? 'aria-current="step"' : ""} data-do=`)).join("");
  return `<div class="route exam-route">${breadcrumb("Alle Probeklassenarbeiten", "pruefungen")}
    <header class="unit-header pfirsich"><div><p class="eyebrow">Probeklassenarbeit ${i + 1}</p><h1 id="page-title" tabindex="-1">${exam.title}</h1></div></header>
    <section class="panel"><div class="exam-progress"><p role="status">${count} von ${exam.tasks.length} beantwortet</p><div class="jump-list" aria-label="Aufgabe auswählen">${taskLinks}</div></div>
    ${questionMarkup(q, draft.answers[draft.index], `Aufgabe ${draft.index + 1} von ${exam.tasks.length}`)}
    ${speechButtons()}<div class="actions">
    ${draft.index > 0 ? button("← Zurück", "exam-go", draft.index - 1) : ""}
    ${draft.index + 1 < exam.tasks.length ? button("Weiter →", "exam-go", draft.index + 1, "primary") : button("Arbeit abgeben", "submit-exam", "", "primary")}
    </div><p class="message" role="status"></p></section></div>`;
}

function answerText(question, indexes) {
  return indexes.map(i => question.options[i]).join(" · ");
}

function renderResult() {
  const i = examIndex();
  const exam = pruefungen[i];
  const result = state.results[i];
  if (!exam || !result) return renderMissing();
  const review = exam.tasks.map(([id, q], j) => {
    const picked = result.answers[j];
    const correct = istRichtig(q, picked);
    return `<li class="review-row ${correct ? "success" : "retry"}"><h3>${j + 1}. ${q.text}</h3>
      <p><strong>${correct ? "✓ Richtig" : "Deine Antwort"}</strong> · ${answerText(q, picked)}</p>
      ${correct ? "" : `<p><strong>Lösung</strong> · ${answerText(q, q.correct)}</p>`}
      <p>${q.why}</p>${correct ? "" : nav(`${stationNachId[id].title} üben →`, `station/${id}/3`, "breadcrumb")}</li>`;
  }).join("");
  return `<div class="route">${breadcrumb("Alle Probeklassenarbeiten", "pruefungen")}
    <header class="unit-header salbei"><div><p class="eyebrow">Dein Ergebnis · ${exam.title}</p><h1 id="page-title" tabindex="-1">${result.score} von ${exam.tasks.length} richtig</h1>
    <p>${result.score >= 6 ? "★ Einen Stern für diese Arbeit verdient!" : "Unten findest du die Lösungen und passende Übungen."}</p></div>${figur("stern")}</header>
    <section class="panel"><h2>Lösungen</h2><ol class="review-list">${review}</ol><div class="actions">${button("Lösungen drucken", "print")}${nav("Weitere Arbeiten →", "pruefungen", "primary")}</div></section></div>`;
}

function renderProgress() {
  const doneCount = stationen.filter(s => state.done[s.id]).length;
  const attemptCount = pruefungen.filter((_, i) => state.results[i]).length;
  return `<div class="route">${breadcrumb()}<header class="unit-header sand"><div><p class="eyebrow">Sterne und Ergebnisse</p><h1 id="page-title" tabindex="-1">Mein Lernstand</h1></div>${figur("baerli")}</header>
    <section class="panel"><h2>${doneCount} von ${stationen.length} Stationen geschafft</h2><progress value="${doneCount}" max="${stationen.length}" aria-label="Abgeschlossene Lernstationen"></progress>
    <p>${attemptCount} von ${pruefungen.length} Probeklassenarbeiten abgegeben</p>
    <ul class="progress-list">${stationen.map(s => `<li><span>${s.title}</span>${nav(state.done[s.id] ? "★ Wiederholen" : state.drafts[s.id] === undefined ? "Starten" : "Weiterlernen", `station/${s.id}/${state.done[s.id] ? 0 : state.drafts[s.id] || 0}`)}</li>`).join("")}</ul>
    ${doneCount === stationen.length ? `<div class="actions">${nav("Urkunde ansehen", "urkunde", "primary")}</div>` : ""}
    <p class="muted">${storageAvailable ? "Dein Lernstand wird in diesem Browser gespeichert." : "Dieser Browser kann den Lernstand gerade nur bis zum Schließen der Seite merken."}</p></section></div>`;
}

function renderCertificate() {
  if (!stationen.every(s => state.done[s.id])) return renderProgress();
  return `<div class="route">${breadcrumb("Zum Lernstand", "fortschritt")}<section class="panel certificate">
    <p class="certificate-stars" aria-hidden="true">★ ★ ★</p><h1 id="page-title" tabindex="-1">Urkunde</h1>
    <p>Du hast alle sieben Lernstationen zum Thema Ernährung geschafft.</p>
    <label for="certificate-name">Name (freiwillig)</label>
    <input id="certificate-name" type="text" maxlength="60" autocomplete="off" placeholder="Dein Name">
    <p>Gut gemacht, sagen Maja, Stern und Bärli!</p>
    <div class="actions">${button("Urkunde drucken", "print", "", "primary")}</div></section></div>`;
}

function renderInfo() {
  return `<div class="route">${breadcrumb()}<header class="unit-header salbei"><div><p class="eyebrow">Sachunterricht · Klasse 3</p><h1 id="page-title" tabindex="-1">Über die Lernwelt</h1></div>${figur("maja")}</header>
    <section class="panel"><h2>So kannst du lernen</h2><p>Entdecke ein Thema, probiere etwas aus und übe in deinem Tempo. Beim Wissenscheck gibt es einen Stern. In den Probeklassenarbeiten gibt es je einen Stern ab sechs richtigen Aufgaben. Bei Mehrfachauswahl gibt es einen Punkt, wenn alle passenden Antworten ausgewählt sind.</p>
    <h2>Für Erwachsene</h2><p>Die acht Gruppen und 22 Kästchen orientieren sich an der Ernährungspyramide auf Majas Arbeitsblatt und am Modell des Bundeszentrums für Ernährung. Die App verwendet die Ampelfarben als Orientierung und das Vier-Bausteine-Modell aus dem Unterricht. Die Zuckermengen sind erfundene, gerundete Beispiele. Bei der Geschichte dienen die Originalbilder als Figurenillustrationen.</p>
    <ul><li><a href="https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich">Bundeszentrum für Ernährung · Die acht Lebensmittelgruppen</a></li>
    <li><a href="https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/">Deutsche Gesellschaft für Ernährung · Ballaststoffe</a></li>
    <li><a href="../majas-wortwerkstatt/">Majas Wortwerkstatt · Originalillustrationen</a></li></ul>
    <p>Die App braucht kein Konto. Lernstände und Testantworten bleiben im Browser. Vorlesen nutzt die deutsche Stimme des Geräts, wenn eine verfügbar ist.</p></section></div>`;
}

function renderMissing() {
  return `<div class="route">${breadcrumb()}<section class="panel"><h1 id="page-title" tabindex="-1">Hier ist keine Lernstation</h1><p>Auf der Startseite findest du alle Themen.</p>${nav("Zur Startseite", "start", "primary")}</section></div>`;
}

function stopSpeech() {
  if (hasSpeech) speechSynthesis.cancel();
  utterance = undefined;
  const status = main.querySelector(".speech-status");
  if (status) status.textContent = "";
}

function render(focus = true) {
  stopSpeech();
  const requested = location.hash.slice(1);
  route = requested && requested !== "inhalt" ? requested.split("/") : ["start"];
  const screens = { start: renderStart, station: renderStation, pruefungen: renderExamList, pruefung: renderExam, ergebnis: renderResult,
    fortschritt: renderProgress, urkunde: renderCertificate, infos: renderInfo };
  const renderScreen = Object.hasOwn(screens, route[0]) ? screens[route[0]] : renderMissing;
  main.innerHTML = renderScreen();
  const activityNode = main.querySelector("#activity");
  if (activityNode) activityNode.insertAdjacentHTML("afterend", activityNext(stationNachId[route[1]]));
  const title = main.querySelector("h1");
  document.title = route[0] === "start" ? "Maja, Stern & Bärli – Sachunterrichtswelt" : `${title.textContent} · Majas Sachunterrichtswelt`;
  aktualisiereSterne();
  screenId++;
  if (focus) {
    window.scrollTo(0, 0);
    title.focus({ preventScroll: true });
  }
}

function refreshActivity(focusId, actionButton) {
  const node = main.querySelector("#activity");
  const mark = actionButton?.dataset;
  const previous = node.getBoundingClientRect().top;
  stopSpeech();
  node.innerHTML = renderActivity(stationNachId[route[1]].activity);
  window.scrollBy(0, node.getBoundingClientRect().top - previous);
  const target = focusId ? document.getElementById(focusId) : mark && [...node.querySelectorAll("[data-do]")].find(item => item.dataset.do === mark.do && item.dataset.value === mark.value);
  if (target) target.focus({ preventScroll: true });
  else if (mark) {
    const heading = node.querySelector("h3, button, select, .reveal");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }
}

function redoPractice(focusSelector) {
  stopSpeech();
  main.querySelector("#question-area").innerHTML = renderPractice(stationNachId[route[1]]);
  main.querySelector(focusSelector)?.focus();
}

function read(rate) {
  const content = main.querySelector("[data-read]");
  const q = main.querySelector(".question");
  const toRead = content ? content.textContent.trim()
    : q ? [q.querySelector("[data-question-text]").textContent, ...[...q.querySelectorAll(".answer span")].map(node => node.textContent)].join(". ")
    : "";
  if (!toRead || !hasSpeech) return;
  stopSpeech();
  const currentScreen = screenId;
  const spoken = new SpeechSynthesisUtterance(toRead);
  spoken.lang = "de-DE";
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.toLowerCase() === "de-de" && v.localService)
    || voices.find(v => v.lang.toLowerCase().startsWith("de") && v.localService)
    || voices.find(v => v.lang.toLowerCase().startsWith("de"));
  if (voice) spoken.voice = voice;
  spoken.rate = rate;
  function status(value) {
    if (screenId === currentScreen && utterance === spoken) {
      const node = main.querySelector(".speech-status");
      if (node) node.textContent = value;
    }
  }
  spoken.onstart = () => status("Wird vorgelesen …");
  spoken.onend = () => status("");
  spoken.onerror = () => status("Vorlesen ist auf diesem Gerät gerade nicht verfügbar.");
  utterance = spoken;
  speechSynthesis.speak(spoken);
}

function submitExam() {
  const i = examIndex();
  const exam = pruefungen[i];
  const draft = draftExam(i);
  const firstOpen = draft.answers.findIndex(answer => answer.length === 0);
  if (firstOpen !== -1) {
    draft.index = firstOpen;
    save();
    render(false);
    main.querySelector(".message").textContent = "Diese Aufgabe fehlt noch. Wähle eine Antwort aus.";
    main.querySelector("[data-question-heading]").focus();
    return;
  }
  const score = exam.tasks.filter(([, q], j) => istRichtig(q, draft.answers[j])).length;
  state.results[i] = { score, best: Math.max(state.results[i]?.best || 0, score), answers: draft.answers };
  delete state.drafts[`exam-${i}`];
  save();
  location.hash = `ergebnis/${i + 1}`;
}

main.addEventListener("click", event => {
  const target = event.target.closest("button[data-do]");
  if (!target) return;
  const action = target.dataset.do;
  const value = target.dataset.value;
  if (action === "speak") return read(Number(value));
  if (action === "stop") return stopSpeech();
  if (action === "print") return window.print();
  if (action === "image") {
    const dialog = document.querySelector("#bilddialog");
    const image = target.querySelector("img");
    dialog.querySelector("img").src = image.src;
    dialog.querySelector("img").alt = image.alt;
    dialog.showModal();
    return;
  }
  if (action === "close-image") return document.querySelector("#bilddialog").close();
  if (action === "exam-go") {
    draftExam(examIndex()).index = Number(value);
    save();
    render(false);
    main.querySelector("[data-question-heading]").focus();
    return;
  }
  if (action === "submit-exam") return submitExam();
  if (action === "check") {
    if (!quiz.selected.length) {
      main.querySelector(".message").textContent = "Wähle erst eine Antwort aus.";
      return;
    }
    quiz.checked = true;
    const station = stationNachId[route[1]];
    if (Number(route[2]) === 4 && istRichtig(station.check, quiz.selected)) {
      state.done[station.id] = true;
      state.drafts[station.id] = 0;
      aktualisiereSterne();
      save();
    }
    redoPractice("#feedback");
    return;
  }
  if (action === "retry" || action === "next-question") {
    quiz = { index: quiz.index + (action === "next-question" ? 1 : 0), selected: [], checked: false };
    redoPractice("[data-question-heading]");
    return;
  }
  if (action === "discover") activity.index = Number(value);
  if (action === "fiber") activity.bound = !activity.bound;
  if (action === "pyramid-pick") {
    activity.index = Number(value);
    activity.choice = activity.index;
  }
  if (action === "pyramid-next") {
    activity.food = ((activity.food || 0) + 1) % pyramidenFragen.length;
    activity.choice = undefined;
    refreshActivity("pyramid-question");
    main.querySelector("#pyramid-question").tabIndex = -1;
    main.querySelector("#pyramid-question").focus({ preventScroll: true });
    return;
  }
  if (action === "story-prev") activity.index--;
  if (action === "story-next") activity.index++;
  refreshActivity("", target);
});

main.addEventListener("change", event => {
  const target = event.target;
  if (target.name === "answer") {
    const selected = [...main.querySelectorAll('input[name="answer"]:checked')].map(input => Number(input.value));
    if (route[0] === "pruefung") {
      const draft = draftExam(examIndex());
      draft.answers[draft.index] = selected;
      const button = main.querySelector(".jump.current");
      button.classList.toggle("filled", selected.length > 0);
      button.setAttribute("aria-label", `Aufgabe ${draft.index + 1}, ${selected.length ? "beantwortet" : "offen"}`);
      main.querySelector(".exam-progress p").textContent = `${draft.answers.filter(a => a.length).length} von ${draft.answers.length} beantwortet`;
      save();
    } else {
      quiz.selected = selected;
    }
    const message = main.querySelector(".message");
    if (message) message.textContent = "";
    return;
  }
  if (target.dataset.change === "breakfast") activity.breakfast[Number(target.dataset.value)] = target.value === "" ? undefined : Number(target.value);
  else if (["left", "right", "amount"].includes(target.dataset.change)) activity[target.dataset.change] = Number(target.value);
  else return;
  refreshActivity(target.id);
});

document.querySelector(".skip").addEventListener("click", event => {
  event.preventDefault();
  main.focus();
});
window.addEventListener("hashchange", () => render());
window.addEventListener("pagehide", stopSpeech);
applyTheme();
render(false);

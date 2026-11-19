"use strict";

const main = document.querySelector("main");
const theme = document.querySelector("#theme");
const storageKey = "majas-sachunterricht-v1";
const phasen = ["Entdecken", "Verstehen", "Mitmachen", "Üben", "Überprüfen"];
const figurNamen = { maja: "Maja", stern: "Stern", baerli: "Bärli" };
const stationNachId = Object.fromEntries(stationen.map(station => [station.id, station]));
const bilder = ["picknick-start", "picknick-pause", "picknick-detektiv", "picknick-wiese"];
const pyramidBlocks = [1, 2, 1, 2, 1, 4, 5, 6];
const bildtexte = [
  "Maja baut einen kleinen Parcours unter einem Apfelbaum. Stern und Bärli sehen zu.",
  "Maja, Stern und Bärli machen an einer Gartenbank eine Trinkpause.",
  "Stern betrachtet eine Flasche Apfelschorle und einen Karton Apfelsaft auf einem Holztisch.",
  "Maja, Stern und Bärli sitzen auf einer Picknickdecke. Vor ihnen stehen Wasser, Möhren, Vollkornbrot und Käse.",
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

let state = standardState();
let storageAvailable = true;
let recoveryText = "";
try {
  const raw = localStorage.getItem(storageKey);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      state = normalizeState(parsed);
      if (!isRecord(parsed.done) || !isRecord(parsed.drafts) || !isRecord(parsed.results) || Object.keys(parsed.results || {}).some(key => !state.results[key] || JSON.stringify(parsed.results[key].answers) !== JSON.stringify(state.results[key].answers))) recoveryText = raw;
    } catch {
      recoveryText = raw;
      try {
        const backup = localStorage.getItem(storageKey + "-vorher");
        if (backup) state = normalizeState(JSON.parse(backup));
      } catch {}
    }
    if (recoveryText) localStorage.setItem(storageKey + "-rettung", recoveryText);
  }
  recoveryText ||= localStorage.getItem(storageKey + "-rettung") || "";
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
  if (synchronizingState) return;
  if (!storageAvailable) return;
  try {
    const previous = localStorage.getItem(storageKey);
    if (previous) {
      try {
        normalizeState(JSON.parse(previous));
        localStorage.setItem(storageKey + "-vorher", previous);
      } catch {
        localStorage.setItem(storageKey + "-rettung", previous);
      }
    }
    state.schema = datenVersion;
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
          ${open ? nav(state.drafts[open.id] !== undefined ? `Weiterlernen · ${wrappedTitle(open.title)} →` : "Los geht’s →", `station/${open.id}/${resume}`, "primary") : nav("Zur Probeklassenarbeit →", "pruefungen", "primary")}
          ${open ? nav("Probeklassenarbeiten", "pruefungen", "hero-link") : nav("Mein Lernstand", "fortschritt", "hero-link")}
        </div>
      </div>
      <div class="hero-art">
        <img class="hero-book" src="./assets/picknick-wiese.webp" width="960" height="640" alt="Maja, Bärli und Stern teilen ein Picknick unter einem Apfelbaum.">
        <div class="hero-friends">
          ${["maja", "stern", "baerli"].map(key => `<span>${figur(key, "portrait", "")}<small>${figurNamen[key]}</small></span>`).join("")}
        </div>
      </div>
    </section>
    <nav class="learning-tools" aria-label="Weitere Lernangebote">${nav("Spiele und Bildkarten", "lernspiele", "primary")}${nav("Kurze Lernrunde", "kurzrunde")}${nav("Gemeinsam lernen", "eltern")}</nav>
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
  quiz = { index: step === 4 ? state.checkNext[id] ?? 0 : 0, selected: [], checked: false };
  const stepNav = phasen.map((phase, i) => `<li><a href="#station/${id}/${i}" ${step === i ? 'aria-current="step"' : ""}><span>${i + 1}</span>${phase}</a></li>`).join("");
  let body;
  if (step === 0) {
    body = `<div class="story-lead" data-read><p>${s.scene}</p><p class="think">${s.prompt}</p></div>${speechButtons()}`;
  } else if (step === 1) {
    body = `<div class="fact-grid" data-read>${s.facts.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>${speechButtons()}`;
  } else if (step === 2) {
    const cycle = id === "labor" && route[3] === "kreislauf";
    const matching = id === "labor" && route[3] === "zuordnen";
    const labLinks = id === "labor" ? `<nav class="lab-links" aria-label="Übungen im Nährstofflabor">
      <a class="secondary" href="#station/labor/2" ${cycle || matching ? "" : 'aria-current="page"'}>Nährstoffkarten</a>
      <a class="secondary" href="#station/labor/2/kreislauf" ${cycle ? 'aria-current="page"' : ""}>Energiekreislauf</a>
      <a class="secondary" href="#station/labor/2/zuordnen" ${matching ? 'aria-current="page"' : ""}>Körperaufgaben zuordnen</a>
    </nav>` : "";
    body = `${labLinks}${cycle || matching ? "" : `<p>${s.task}</p>`}<div id="activity">${renderActivity(s.activity)}</div>`;
  } else {
    body = `<div id="question-area">${renderPractice(s)}</div>`;
  }
  const next = step < 2 ? nav(`${phasen[step + 1]} →`, `station/${id}/${step + 1}`, "primary") : "";
  return `<div class="route">
    ${breadcrumb()}
    <header class="unit-header ${s.color}"><div><p class="eyebrow">Lernstation · ${s.short}</p><h1 id="page-title" tabindex="-1">${s.title}</h1></div>${figur(s.figur)}</header>
    <p class="learning-goal">${lernziele[id]}</p><div class="station-tools">${nav("Drei Übungsstufen", `niveau/${id}/1`)}${nav("Sterns Auftrag", `entdecken/${id}`)}${nav("Arbeitsblatt", `arbeitsblatt/${id}`)}</div>
    <ol class="step-nav" aria-label="Lernschritte">${stepNav}</ol>
    <section class="panel" aria-labelledby="phase-title">
      <h2 id="phase-title">${phasen[step]}</h2>
      ${body}
      ${next ? `<div class="actions">${next}</div>` : ""}
    </section>
  </div>`;
}

function renderActivity(kind) {
  if (kind === "labor" && route[3] === "zuordnen") return renderBodyMatching();
  if (kind === "labor" && route[3] === "kreislauf") return renderEnergyCycle();
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
  return `<div class="story-grid"><figure><button class="story-image" data-do="image" type="button" aria-label="Geschichtenbild vergrößern">
      <img src="./assets/${bilder[activity.index]}.webp" alt="${bildtexte[activity.index]}" width="960" height="640"><span aria-hidden="true">⤢</span></button>
      ${activity.index === 2 ? `<figcaption class="story-labels">
        <span><strong>Apfelschorle</strong>4 g Zucker je 100 ml</span>
        <span><strong>Apfelsaft</strong>10 g Zucker je 100 ml</span>
      </figcaption>` : ""}</figure>
      <div class="story-lead" data-read><p class="eyebrow">Szene ${activity.index + 1} von ${geschichte.length}</p><h3>${name}</h3><p>${text}</p><p class="think">${prompt}</p></div>
    </div>${speechButtons()}${bilddialog()}
    <div class="actions">${activity.index > 0 ? button("← Vorige Szene", "story-prev") : ""}
      ${activity.index + 1 < geschichte.length ? button("Nächste Szene →", "story-next") : ""}</div>`;
}

function currentEnergyCycle() {
  return activity.energyCycle ??= { answers: [null, null, null], active: 0, checked: false, status: "" };
}

function renderEnergyCycle() {
  const cycle = currentEnergyCycle();
  const solved = cycle.checked && cycle.answers.every((answer, index) => answer === index);
  const slots = energieKreislauf.map((step, index) => {
    const fixed = step.gap === undefined;
    let contents;
    if (fixed) {
      contents = `<div class="cycle-node"><span aria-hidden="true">${step.icon}</span><strong>${step.title}</strong>${step.note ? `<small>${step.note}</small>` : ""}</div>`;
    } else {
      const answer = cycle.answers[step.gap];
      const status = cycle.checked ? (answer === step.gap ? " success" : " retry") : "";
      contents = `<button id="cycle-gap-${step.gap}" class="cycle-node cycle-gap${status}" type="button" data-do="cycle-gap" data-value="${step.gap}"
        aria-pressed="${cycle.active === step.gap}" ${solved ? "disabled" : ""}>
        <small>Lücke ${step.gap + 1}${cycle.checked ? (answer === step.gap ? " · ✓" : " · ↺") : ""}</small>
        <strong>${energieSaetze[answer] || "Satz wählen"}</strong>
      </button>`;
    }
    return `<li class="cycle-step cycle-step-${index}" style="--delay:${index * .65}s">${contents}</li>`;
  }).join("");
  const options = [2, 0, 1].map(index => `<button id="cycle-answer-${index}" class="secondary" type="button" data-do="cycle-answer" data-value="${index}">${energieSaetze[index]}</button>`).join("");
  return `<h3>Was mein Körper braucht</h3>
    <p>Ergänze die drei Lücken wie auf dem Arbeitsblatt. Tippe auf eine Lücke und wähle den passenden Satz.</p>
    <div id="energy-board" class="cycle-board">
      <div class="cycle-decoration" aria-hidden="true">
        <span class="cycle-hub">⚡</span>
        ${Array.from({ length: 6 }, (_, index) => `<span class="cycle-arrow cycle-arrow-${index}">➜</span>`).join("")}
      </div>
      <ol aria-label="Ablauf im Uhrzeigersinn" class="cycle-steps">${slots}</ol>
    </div>
    ${solved ? "" : `<fieldset class="cycle-choices"><legend>Satz für Lücke ${cycle.active + 1}</legend>
      <div>${options}</div></fieldset>`}
    <p id="cycle-status" class="message${cycle.checked ? " feedback " + (solved ? "success" : "retry") : ""}" tabindex="-1" role="status">${cycle.status}</p>
    <div class="actions">
      ${solved ? button("Ablauf abspielen", "cycle-play", "", "primary") : '<button id="cycle-check" type="button" class="primary" data-do="cycle-check">Zuordnung prüfen</button>'}
      ${button("Neu starten", "cycle-reset")}
    </div>
    ${solved ? `<div class="fact-grid cycle-facts" data-read>
      <article><h3>Woher kommt die Energie?</h3><p>Der Kreis zeigt ein Beispiel. Dein Körper braucht beim Spielen und auch in Ruhe Energie. Er gewinnt sie aus Kohlenhydraten und anderen Nährstoffen. Wasser hilft dem Körper zum Beispiel, seine Temperatur zu regeln.</p></article>
      <article><h3>Was passiert mit überschüssiger Energie?</h3><p>Wenn dein Körper über längere Zeit mehr Energie aus dem Essen bekommt, als er verbraucht, kann er einen Teil davon als Fett speichern. Das Arbeitsblatt nennt den Energieverbrauch „Verbrennung“.</p></article>
    </div>${speechButtons()}` : ""}`;
}

function handleEnergyCycle(action, value) {
  const cycle = currentEnergyCycle();
  const answerButton = index => `cycle-answer-${index}`;
  let focus;
  if (action === "cycle-play") {
    const board = document.querySelector("#energy-board");
    board.classList.remove("playing");
    void board.offsetWidth;
    board.classList.add("playing");
    return;
  }
  if (action === "cycle-reset") {
    delete activity.energyCycle;
    focus = "cycle-gap-0";
  } else if (action === "cycle-gap") {
    cycle.active = value;
    focus = answerButton(2);
  } else if (action === "cycle-answer") {
    const previous = cycle.answers.indexOf(value);
    if (previous !== -1) cycle.answers[previous] = cycle.answers[cycle.active];
    cycle.answers[cycle.active] = value;
    cycle.checked = false;
    cycle.status = "";
    const empty = cycle.answers.indexOf(null);
    if (empty >= 0) cycle.active = empty;
    focus = empty >= 0 ? answerButton([2, 0, 1].find(index => !cycle.answers.includes(index))) : "cycle-check";
  } else if (action === "cycle-check") {
    const empty = cycle.answers.indexOf(null);
    cycle.checked = empty === -1;
    if (empty >= 0) cycle.active = empty;
    cycle.status = empty >= 0 ? "Fülle erst alle drei Lücken aus."
      : cycle.answers.every((answer, index) => answer === index) ? "Alle drei Sätze sind richtig zugeordnet!"
      : "Schau dir die Lücken mit dem Pfeil ↺ noch einmal an.";
    focus = "cycle-status";
  }
  refreshActivity(focus);
  document.getElementById(focus)?.scrollIntoView({ block: "nearest" });
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

function assessmentTasks(station, check) {
  return check ? [station.check, ...nachfragen[station.id]] : station.practice;
}

function renderPractice(station) {
  const check = Number(route[2]) === 4;
  const tasks = assessmentTasks(station, check);
  const q = tasks[quiz.index];
  const success = quiz.checked && istRichtig(q, quiz.selected);
  const nextStation = stationen[stationen.indexOf(station) + 1];
  const description = quiz.checked ? `<div class="feedback ${success ? "success" : "retry"}" id="feedback" tabindex="-1" role="status">
    <strong>${success ? (check ? "★ Stern verdient!" : "Richtig!") : "Schau dir die Lösung an."}</strong> <span>${q.why}</span></div>` : "";
  let actions;
  if (!quiz.checked) actions = button("Antwort prüfen", "check", "", "primary");
  else if (check) actions = success
    ? (nextStation ? nav("Nächste Station →", `station/${nextStation.id}/0`, "primary") : nav("Zu den Probeklassenarbeiten →", "pruefungen", "primary"))
    : `${button("Ähnliche Aufgabe →", "retry", "", "primary")}${nav("Erklärung ansehen", `station/${station.id}/1`)}`;
  else actions = quiz.index + 1 < tasks.length
    ? button("Nächste Aufgabe →", "next-question", "", "primary")
    : nav("Wissen überprüfen →", `station/${station.id}/4`, "primary");
  const hintText = [
    `Denk an dein Lernziel: ${lernziele[station.id]}`,
    `Ein Beispiel aus der Station: ${station.facts[1][1]}`,
    q.why,
  ];
  const hint = !quiz.checked ? `<div class="hint-box">${button("Hinweis in kleinen Schritten", "hint")}
    ${quiz.hint ? `<p class="reveal" role="status">${hintText[Math.min(2, quiz.hint - 1)]}</p>` : ""}</div>` : "";
  return `${questionMarkup(q, quiz.selected, check ? "Wissenscheck" : `Aufgabe ${quiz.index + 1} von ${tasks.length}`, quiz.checked)}
    ${speechButtons()}${hint}${description}<div class="actions">${actions}${check && success ? nav("Zur Übersicht", "start") : ""}</div><p class="message" role="status"></p>`;
}

function renderExamList() {
  return `<div class="route">${breadcrumb()}<header class="unit-header pfirsich"><div><p class="eyebrow">Alle Themen · Klasse 3</p><h1 id="page-title" tabindex="-1">Probeklassenarbeiten</h1></div>${figur("baerli")}</header>
    <div class="panel"><p>Jede Arbeit hat acht Aufgaben zum Ankreuzen und zwei zum Schreiben. Nach der Abgabe bekommst du Punkte für die Auswahlaufgaben. Deine Schreibantworten vergleichst du mit den Musterlösungen.</p>
    <div class="test-list">${pruefungen.map((exam, i) => `
      <article><span class="test-num" aria-hidden="true">${i + 1}</span><div><h2>${exam.title}</h2><p>${state.results[i] ? `Ankreuzen · Zuletzt ${state.results[i].score} von ${exam.tasks.length}, bisher am besten ${state.results[i].best} von ${exam.tasks.length}` : "10 Aufgaben"}</p></div>
      <div class="test-actions">${state.results[i] ? nav("Lösungen", `ergebnis/${i + 1}`) : ""}${nav(state.drafts[`exam-${i}`] ? "Fortsetzen →" : "Starten →", `pruefung/${i + 1}`, "primary")}</div></article>`).join("")}</div></div></div>`;
}

function examIndex() {
  return Number(route[1]) - 1;
}

function draftExam(i) {
  const key = `exam-${i}`;
  if (!state.drafts[key]) state.drafts[key] = { index: 0, answers: pruefungen[i].tasks.map(() => []) };
  const draft = state.drafts[key];
  draft.written ??= schriftaufgaben[i].map(() => ({ text: "", paper: false }));
  return draft;
}

function examAnswered(draft) {
  return [...draft.answers.map(answer => answer.length > 0), ...draft.written.map(answer => answer.paper || answer.text.trim().length > 0)];
}

function writtenMarkup(task, answer, position, total) {
  return `<div class="question written-question">
    <h2 tabindex="-1" data-question-heading><span class="eyebrow question-kicker">Schreibaufgabe · ${position} von ${total}</span><span data-question-text>${task.text}</span></h2>
    <label for="written-answer">Deine Antwort</label>
    <textarea id="written-answer" rows="5" maxlength="1200" ${answer.paper ? "disabled" : ""}>
${html(answer.text)}</textarea>
    <label class="paper-option"><input type="checkbox" id="written-paper" ${answer.paper ? "checked" : ""}> Ich habe im Heft geantwortet.</label>
  </div>`;
}

function renderExam() {
  const i = examIndex();
  const exam = pruefungen[i];
  if (!exam) return renderMissing();
  const draft = draftExam(i);
  const answered = examAnswered(draft);
  const count = answered.filter(Boolean).length;
  const writtenIndex = draft.index - exam.tasks.length;
  const taskLinks = answered.map((filled, j) => button(`<span aria-hidden="true">${j + 1}</span>`, "exam-go", j, `jump${j === draft.index ? " current" : ""}${filled ? " filled" : ""}`)
    .replace(" data-do=", ` aria-label="Aufgabe ${j + 1}, ${filled ? "beantwortet" : "offen"}" ${j === draft.index ? 'aria-current="step"' : ""} data-do=`)).join("");
  return `<div class="route exam-route">${breadcrumb("Alle Probeklassenarbeiten", "pruefungen")}
    <header class="unit-header pfirsich"><div><p class="eyebrow">Probeklassenarbeit ${i + 1}</p><h1 id="page-title" tabindex="-1">${exam.title}</h1></div></header>
    <section class="panel"><div class="exam-progress"><p role="status">${count} von ${answered.length} beantwortet</p><div class="jump-list" aria-label="Aufgabe auswählen">${taskLinks}</div></div>
    ${writtenIndex < 0 ? questionMarkup(exam.tasks[draft.index][1], draft.answers[draft.index], `Aufgabe ${draft.index + 1} von ${answered.length}`)
      : writtenMarkup(schriftaufgaben[i][writtenIndex], draft.written[writtenIndex], draft.index + 1, answered.length)}
    ${speechButtons()}<div class="actions">
    ${draft.index > 0 ? button("← Zurück", "exam-go", draft.index - 1) : ""}
    ${draft.index + 1 < answered.length ? button("Weiter →", "exam-go", draft.index + 1, "primary") : button("Arbeit abgeben", "submit-exam", "", "primary")}
    </div><p class="message" role="status"></p></section></div>`;
}

function answerText(question, indexes) {
  return indexes.map(i => question.options[i]).join(" · ");
}

function renderWrittenSolutions(i, result) {
  if (!result.written) return '<p class="muted">Zu deiner früheren Abgabe sind die acht Auswahlantworten gespeichert.</p>';
  const offset = pruefungen[i].tasks.length;
  return `<section class="written-solutions"><h2>Schreibaufgaben vergleichen</h2>
    <p>Lies die Musterlösung und prüfe die Punkte darunter. Deine Antwort darf anders klingen.</p>
    <ol class="review-list" start="${offset + 1}">${schriftaufgaben[i].map((task, j) => `
      <li class="review-row written-review"><h3>${offset + j + 1}. ${task.text}</h3>
        <p class="written-response"><strong>Deine Antwort</strong> · ${result.written[j].paper ? "Im Heft geantwortet" : html(result.written[j].text)}</p>
        <p><strong>Musterlösung</strong> · ${task.beispiel}</p>
        <div class="criteria-list">${task.kriterien.map((line, k) => {
          const key = i + "-" + j + "-" + k;
          return `<label class="paper-option"><input type="checkbox" data-criterion="${key}" ${state.criteria[key] ? "checked" : ""}> ${line}</label>`;
        }).join("")}</div>
      </li>`).join("")}</ol></section>`;
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
    <header class="unit-header salbei"><div><p class="eyebrow">Auswahlaufgaben · ${exam.title}</p><h1 id="page-title" tabindex="-1">${result.score} von ${exam.tasks.length} richtig</h1>
    <p>${result.score >= 6 ? "★ Einen Stern für diese Arbeit verdient!" : "Unten findest du die Lösungen und passende Übungen."}</p></div>${figur("stern")}</header>
    <section class="panel"><h2>Lösungen zum Ankreuzen</h2><ol class="review-list">${review}</ol>${renderWrittenSolutions(i, result)}<div class="actions">${button("Lösungen drucken", "print")}${nav("Zum Lernstand →", "fortschritt")}${nav("Weitere Arbeiten →", "pruefungen", "primary")}</div></section></div>`;
}

function learningNotes() {
  const notes = {};
  pruefungen.forEach((exam, i) => {
    const result = state.results[i];
    if (!result) return;
    const at = result.at ?? 0;
    const counts = {};
    exam.tasks.forEach(([id, q], j) => {
      const count = counts[id] ??= { correct: 0, total: 0 };
      count.total++;
      if (istRichtig(q, result.answers[j])) count.correct++;
    });
    for (const [id, count] of Object.entries(counts)) {
      if (notes[id] && notes[id].at > at) continue;
      notes[id] = {
        at, retry: count.correct < count.total,
        text: `Probearbeit · ${count.correct} von ${count.total} richtig`,
      };
    }
  });
  for (const [id, note] of Object.entries(state.practiceNotes)) {
    if (notes[id] && notes[id].at > note.at) continue;
    const source = note.check ? "Wissenscheck" : "Letzte Übungsaufgabe";
    notes[id] = { at: note.at, retry: !note.correct, text: `${source} · ${note.correct ? "richtig" : "noch einmal üben"}` };
  }
  return notes;
}

function renderProgress() {
  const doneCount = stationen.filter(s => state.done[s.id]).length;
  const attemptCount = pruefungen.filter((_, i) => state.results[i]).length;
  const notes = learningNotes();
  const retry = stationen.filter(s => notes[s.id]?.retry).sort((a, b) => notes[b.id].at - notes[a.id].at)[0];
  const next = stationen.find(s => s.id === state.last && !state.done[s.id]) || stationen.find(s => !state.done[s.id]);
  const examDone = attemptCount === pruefungen.length;
  const suggestion = retry ? nav(`${wrappedTitle(retry.title)} üben →`, `station/${retry.id}/3`, "primary")
    : next ? nav(`Weiterlernen · ${wrappedTitle(next.title)} →`, `station/${next.id}/${state.drafts[next.id] ?? 0}`, "primary")
    : nav(examDone ? "Ergebnisse ansehen →" : "Probearbeit wählen →", "pruefungen", "primary");
  return `<div class="route">${breadcrumb()}<header class="unit-header sand"><div><p class="eyebrow">Sterne und Ergebnisse</p><h1 id="page-title" tabindex="-1">Mein Lernstand</h1></div>${figur("baerli")}</header>
    <section class="panel"><h2>${doneCount} von ${stationen.length} Stationen geschafft</h2><progress value="${doneCount}" max="${stationen.length}" aria-label="Abgeschlossene Lernstationen"></progress>
    <p>${attemptCount} von ${pruefungen.length} Probeklassenarbeiten abgegeben</p>
    <div class="next-step"><h3>Dein nächster Schritt</h3>${retry ? `<p>${wrappedTitle(retry.title)} hat dir zuletzt noch Schwierigkeiten gemacht.</p>` : ""}${suggestion}</div>
    <ul class="progress-list">${stationen.map(s => {
      const note = notes[s.id];
      const nextStep = note?.retry ? 3 : state.done[s.id] ? 0 : state.drafts[s.id] ?? 0;
      const label = note?.retry ? "Üben" : state.done[s.id] ? "★ Wiederholen" : state.drafts[s.id] === undefined ? "Starten" : "Weiterlernen";
      return `<li><div><strong>${wrappedTitle(s.title)}</strong><small>${note?.text || (state.done[s.id] ? "Stationsstern verdient" : "Noch keine Auswertung")}</small></div>${nav(label, `station/${s.id}/${nextStep}`)}</li>`;
    }).join("")}</ul>
    <div class="actions">${attemptCount ? nav("Ergebnisse und Lösungen", "pruefungen") : ""}${doneCount === stationen.length ? nav("Urkunde ansehen", "urkunde", "primary") : ""}</div>
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
    <section class="panel"><h2>So kannst du lernen</h2><p>Entdecke ein Thema, probiere etwas aus und übe in deinem Tempo. Beim Wissenscheck gibt es einen Stern. In den Probeklassenarbeiten gibt es je einen Stern ab sechs richtigen Auswahlaufgaben. Schreibantworten vergleichst du selbst mit der Musterlösung. Bei Mehrfachauswahl gibt es einen Punkt, wenn alle passenden Antworten ausgewählt sind.</p>
    <h2>Für Erwachsene</h2><p>Die acht Gruppen und 22 Kästchen orientieren sich an der Ernährungspyramide auf Majas Arbeitsblatt und am Modell des Bundeszentrums für Ernährung. Die App verwendet die Ampelfarben als Orientierung und das Vier-Bausteine-Modell aus dem Unterricht. Die Zuckermengen sind erfundene, gerundete Beispiele.</p>
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
    fortschritt: renderProgress, urkunde: renderCertificate, infos: renderInfo,
    lernspiele: renderGames, bildkarten: renderCards, "fruehstueck-frei": renderFreeBreakfast,
    baerli: renderBaerli, kurzrunde: renderShortRound, entdecken: renderDiscover, niveau: renderLevel,
    eltern: renderParents, einstellungen: renderSettings, arbeitsblatt: renderWorksheet, papierloesung: renderWorksheet };
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
  const voice = voices.find(v => v.voiceURI === state.preferences.voice)
    || voices.find(v => v.lang.toLowerCase() === "de-de" && v.localService)
    || voices.find(v => v.lang.toLowerCase().startsWith("de") && v.localService)
    || voices.find(v => v.lang.toLowerCase().startsWith("de"));
  if (voice) spoken.voice = voice;
  spoken.rate = rate === 1 ? state.preferences.rate : rate;
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
  const firstOpen = examAnswered(draft).indexOf(false);
  if (firstOpen !== -1) {
    draft.index = firstOpen;
    save();
    render(false);
    main.querySelector(".message").textContent = firstOpen < exam.tasks.length ? "Diese Aufgabe fehlt noch. Wähle eine Antwort aus."
      : "Diese Schreibaufgabe fehlt noch. Tippe deine Antwort ein oder kreuze an, dass du im Heft geantwortet hast.";
    main.querySelector("[data-question-heading]").focus();
    return;
  }
  const score = exam.tasks.filter(([, q], j) => istRichtig(q, draft.answers[j])).length;
  state.results[i] = { score, best: Math.max(state.results[i]?.best || 0, score), answers: draft.answers, written: draft.written, at: Date.now() };
  delete state.drafts[`exam-${i}`];
  for (let task = 0; task < 2; task++) for (let criterion = 0; criterion < 2; criterion++) {
    delete state.criteria[i + "-" + task + "-" + criterion];
  }
  save();
  location.hash = `ergebnis/${i + 1}`;
}

main.addEventListener("click", event => {
  const target = event.target.closest("button[data-do]");
  if (!target) return;
  const action = target.dataset.do;
  const value = target.dataset.value;
  if (action === "hint") {
    quiz.hint = Math.min(3, (quiz.hint || 0) + 1);
    redoPractice(".hint-box button");
    return;
  }
  if (action === "speak") return read(Number(value));
  if (action === "stop") return stopSpeech();
  if (action === "print") return window.print();
  if (action === "body-check" || action === "body-reset") {
    if (action === "body-reset") delete activity.bodyMatching;
    else {
      activity.bodyMatching.checked = true;
      activity.bodyMatching.answers = [...main.querySelectorAll("[data-body-match]")].map(select => select.value);
    }
    refreshActivity(action === "body-reset" ? "body-match-0" : "body-status");
    return;
  }
  if (action.startsWith("cycle-")) return handleEnergyCycle(action, Number(value));
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
    const check = Number(route[2]) === 4;
    const tasks = assessmentTasks(station, check);
    const correct = istRichtig(tasks[quiz.index], quiz.selected);
    state.practiceNotes[station.id] = { at: Date.now(), correct, check };
    recordReview(station.id, correct);
    if (check) {
      state.checkNext[station.id] = correct ? 0 : (quiz.index + 1) % tasks.length;
      if (correct) {
        state.done[station.id] = true;
        state.drafts[station.id] = 0;
        aktualisiereSterne();
      }
    }
    save();
    redoPractice("#feedback");
    return;
  }
  if (action === "retry" || action === "next-question") {
    const index = action === "retry" ? state.checkNext[route[1]] : quiz.index + 1;
    quiz = { index, selected: [], checked: false };
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

function updateExamProgress(draft) {
  const answered = examAnswered(draft);
  const filled = answered[draft.index];
  const button = main.querySelector(".jump.current");
  button.classList.toggle("filled", filled);
  button.setAttribute("aria-label", `Aufgabe ${draft.index + 1}, ${filled ? "beantwortet" : "offen"}`);
  const status = main.querySelector(".exam-progress p");
  const summary = `${answered.filter(Boolean).length} von ${answered.length} beantwortet`;
  if (status.textContent !== summary) status.textContent = summary;
  main.querySelector(".message").textContent = "";
  save();
}

main.addEventListener("input", event => {
  if (event.target.id !== "written-answer") return;
  const i = examIndex();
  const draft = draftExam(i);
  draft.written[draft.index - pruefungen[i].tasks.length].text = event.target.value;
  updateExamProgress(draft);
});

main.addEventListener("change", event => {
  const target = event.target;
  if (target.hasAttribute("data-body-match")) {
    activity.bodyMatching.answers[Number(target.dataset.bodyMatch)] = target.value;
    activity.bodyMatching.checked = false;
    refreshActivity(target.id);
    return;
  }
  if (target.id === "written-paper") {
    const i = examIndex();
    const draft = draftExam(i);
    draft.written[draft.index - pruefungen[i].tasks.length].paper = target.checked;
    main.querySelector("#written-answer").disabled = target.checked;
    updateExamProgress(draft);
    return;
  }
  if (target.name === "answer" && !["kurzrunde", "niveau"].includes(route[0])) {
    const selected = [...main.querySelectorAll('input[name="answer"]:checked')].map(input => Number(input.value));
    if (route[0] === "pruefung") {
      const draft = draftExam(examIndex());
      draft.answers[draft.index] = selected;
      updateExamProgress(draft);
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
applyPreferences();
render(false);
if (recoveryText) {
  const banner = document.getElementById("storage-banner");
  banner.hidden = false;
}
initOffline();

function renderBodyMatching() {
  const exercise = activity.bodyMatching ??= { answers: koerperZuordnung.map(() => ""), checked: false };
  const choices = ["Eiweiß", "Flüssigkeit", "Kohlenhydrate", "Vitamine", "Ballaststoffe", "Fett", "Mineralstoffe"];
  const solved = exercise.checked && koerperZuordnung.every((task, i) => exercise.answers[i] === task.stoff);
  const letters = koerperZuordnung.map((task, i) => exercise.checked && exercise.answers[i] === task.stoff ? task.buchstabe : "·");
  return `<h3>Was mein Körper braucht</h3>
    <p>Ordne jeder Körperaufgabe den passenden Stoff zu. Die richtigen Zuordnungen ergeben ein Lösungswort.</p>
    <ol class="body-matching">${koerperZuordnung.map((task, i) => {
      const correct = exercise.answers[i] === task.stoff;
      return `<li class="${exercise.checked ? correct ? "success" : "retry" : ""}">
        <label for="body-match-${i}"><strong>${i + 1}. ${task.aufgabe}</strong></label>
        <select id="body-match-${i}" data-body-match="${i}">
          <option value="">Stoff auswählen …</option>${choices.map(choice => `<option value="${choice}" ${exercise.answers[i] === choice ? "selected" : ""}>${choice}</option>`).join("")}
        </select>
        ${exercise.checked ? `<p>${correct ? "✓ Richtig." : "↺ Schau noch einmal."} ${correct ? task.grund : ""}</p>` : ""}
      </li>`;
    }).join("")}</ol>
    <div id="body-status" role="status" tabindex="-1" class="reveal">
      <strong>Lösungswort</strong>
      <span class="body-word" aria-label="${solved ? "KALORIE" : "Lösungswort noch unvollständig"}">${letters.join(" ")}</span>
      ${exercise.checked ? `<p>${solved ? "Alle sieben Zuordnungen stimmen!" : "Ergänze oder verbessere die markierten Zuordnungen."}</p>` : ""}
    </div>
    <div class="actions">${button("Zuordnung prüfen", "body-check", "", "primary")}${button("Neu starten", "body-reset")}</div>
    ${solved ? `<div class="reveal" data-read><h3>Das bedeutet Kalorie</h3>
      <p>Eine Kalorie ist eine Einheit für Energie. Auf Lebensmittelpackungen steht häufig Kilokalorie, abgekürzt kcal. Eine Kilokalorie sind 1.000 Kalorien.</p>
      <p>Auf dem Arbeitsblatt gehören Knochen und Zähne zu den Mineralstoffen. Haare bestehen vor allem aus dem Eiweiß Keratin. Vitamine unterstützen die Körperabwehr.</p>
      </div>${speechButtons()}` : ""}`;
}

"use strict";

const appVersion = "2026-11-19.4";
const datenVersion = 2;
const foodCards = [
  { name: "Wasser", group: 7, breakfast: 0, key: "wasser" },
  { name: "Apfel", group: 6, breakfast: 1, key: "apfel" },
  { name: "Möhren", group: 6, breakfast: 1, key: "moehren" },
  { name: "Vollkornbrot", group: 5, breakfast: 2, key: "brot" },
  { name: "Naturjoghurt", group: 3, breakfast: 3, key: "joghurt" },
  { name: "Käse", group: 3, breakfast: 3, key: "kaese" },
  { name: "Haferflocken", group: 5, breakfast: 2, key: "hafer" },
  { name: "Linsen", group: 4, breakfast: -1, key: "linsen" },
  { name: "Schokolade", group: 0, breakfast: -1, key: "schokolade" },
];

const lernziele = {
  fit: "Ich kann einen aktiven Tag mit Bewegung, Essen, Trinken und Erholung planen.",
  labor: "Ich kann Kohlenhydrate, Eiweiß, Fett, Vitamine, Mineralstoffe und Wasser ihren Aufgaben zuordnen.",
  ballast: "Ich kann Ballaststoffquellen nennen und ihre Hilfe für die Verdauung erklären.",
  pyramide: "Ich kann Lebensmittel zuordnen und die drei Ampelfarben erklären.",
  fruehstueck: "Ich kann die vier Frühstücksbausteine mit passenden Lebensmitteln füllen.",
  zucker: "Ich kann Zuckerangaben für gleiche Getränkemengen vergleichen.",
  geschichte: "Ich kann mein Wissen nutzen und die Entscheidungen beim Picknick begründen.",
};

const alltagsauftraege = {
  fit: ["Plane eine Spielpause.", "Schreibe zwei Dinge auf, die du für eine aktive Pause mitnehmen oder einplanen möchtest.", "Zum Beispiel Wasser, ein Spiel und Zeit zum Ausruhen."],
  labor: ["Werde Nährstoffforscher.", "Suche auf einer Lebensmittelpackung die Wörter Eiweiß, Kohlenhydrate oder Fett. Schreibe ein Wort und das Lebensmittel auf.", "Zum Beispiel: Eiweiß steht auf dem Naturjoghurt. Es ist ein Baustoff."],
  ballast: ["Finde Vollkorn.", "Schau mit einem Erwachsenen auf eine Brot- oder Nudelpackung. Findest du das Wort Vollkorn? Was hast du entdeckt?", "Zum Beispiel: Auf der Packung steht Vollkornnudeln. Sie können Ballaststoffe liefern."],
  pyramide: ["Sortiere euren Einkauf.", "Wähle drei Lebensmittel und schreibe zu jedem die Gruppe aus der Pyramide.", "Zum Beispiel: Möhre – Obst und Gemüse. Brot – Getreide und Beilagen. Käse – Milchprodukte."],
  fruehstueck: ["Schau auf dein Frühstück.", "Welche der vier Bausteine findest du heute? Was könnte noch dazukommen?", "Zum Beispiel: Brot und Käse sind da. Gurke und Wasser ergänzen Gemüse und Getränk."],
  zucker: ["Vergleiche zwei Etiketten.", "Suche mit einem Erwachsenen auf zwei Getränken die Angabe „davon Zucker je 100 ml“. Schreibe beide Werte auf und vergleiche.", "Vergleiche dieselbe Menge. Beispielwerte: 3 g sind weniger als 8 g je 100 ml."],
  geschichte: ["Erzähle dein Picknick.", "Was würdest du für Maja, Stern und Bärli mitnehmen? Begründe eine Auswahl.", "Zum Beispiel Wasser, weil die Freunde beim Spielen Durst bekommen können."],
};

const gespraechsimpulse = {
  fit: [["Wie könntest du nach dem Spielen zur Ruhe kommen?", "Eine Trinkpause, ruhiges Sitzen oder Lesen passen."], ["Was gehört zu deinem aktiven Nachmittag?", "Bewegung, abwechslungsreiches Essen, Wasser und Erholung."]],
  labor: [["Warum braucht dein Körper beim Lesen Energie?", "Herz, Atmung und Gehirn arbeiten weiter."], ["Welcher Stoff ist ein Baustoff für deinen Körper?", "Eiweiß dient unter anderem als Baustoff für Muskeln."]],
  ballast: [["Wo findest du Ballaststoffe in unserer Küche?", "Zum Beispiel in Vollkorn, Gemüse, Obst oder Linsen."], ["Warum passen Wasser und Ballaststoffe zusammen?", "Manche Ballaststoffe binden Wasser und unterstützen die Verdauung."]],
  pyramide: [["Wo gehört Milch in die Pyramide?", "Zu Milch und Milchprodukten."], ["Was bedeuten die Farben?", "Grün reichlich, Gelb passende Mengen, Rot sparsam genießen."]],
  fruehstueck: [["Wie würdest du unser Frühstück ergänzen?", "Prüfen, welche der vier Bausteine bereits vorhanden sind."], ["Was könntest du gegen den Apfel tauschen?", "Zum Beispiel eine Möhre, Birne oder Gurke für denselben Baustein."]],
  zucker: [["Was vergleichen wir auf den Getränken?", "Die Zuckerangabe für dieselbe Menge, zum Beispiel je 100 ml."], ["Ist der Zucker in Saft in der Zeile „davon Zucker“ enthalten?", "Ja, dort steht der gesamte Zucker, auch aus den Früchten."]],
  geschichte: [["Warum passt Wasser zum Picknick?", "Es ist ein guter Durstlöscher."], ["Was könntest du am Picknick ändern?", "Ein Lebensmittel durch ein anderes aus derselben Gruppe ersetzen und begründen."]],
};

const baerliFaelle = [
  { id: "pyramide", food: 0, text: "Bärli stellt Milch ganz unten zu den Getränken.", frage: "Welche Gruppe passt für Milch?", options: ["Getränke", "Milch und Milchprodukte", "Extras"], correct: 1, hints: ["Milch liefert unter anderem Eiweiß und Calcium.", "Naturjoghurt und Käse gehören in dieselbe Gruppe wie Milch.", "Milch gehört zu den Milchprodukten."], why: "Milch gehört im Pyramidenmodell zu den Milchprodukten. Wasser und ungesüßter Tee stehen bei den Durstlöschern.", picture: false },
  { id: "fruehstueck", food: 1, text: "Bärli packt Apfel, Gurke, Möhre und Birne ein. „Vier Dinge, also vier Frühstücksbausteine!“", frage: "Welche Bausteine fehlen?", options: ["Nur Obst und Gemüse", "Getränk, Brot oder Getreide und Milchprodukt", "Es fehlt keiner"], correct: 1, hints: ["Die Zahl der Lebensmittel ist ein anderer Hinweis als die Zahl der Gruppen.", "Apfel und Möhre stehen im selben Frühstücksbaustein.", "Es fehlen Getränk, Brot oder Getreide und Milchprodukt."], why: "Alle vier Dinge sind Obst oder Gemüse. Drei andere Bausteine fehlen." },
  { id: "zucker", food: 0, text: "Bärli vergleicht Zucker je 100 ml mit Zucker je 500 ml.", frage: "Wie kann er fair vergleichen?", options: ["Bei beiden je 100 ml ablesen", "Nur auf die Flaschenhöhe schauen", "Die größere Zahl nehmen"], correct: 0, hints: ["Achte auf die Menge neben der Zuckerzahl.", "Zwei gleich große Gläser lassen sich besser vergleichen.", "Vergleiche bei beiden je 100 ml."], why: "Ein fairer Vergleich bezieht sich auf dieselbe Menge." },
  { id: "labor", food: 3, text: "Bärli meint, sein Körper brauche beim Lesen keine Energie.", frage: "Wie erklärst du ihm den Fehler?", options: ["Energie braucht man nur beim Sport", "Herz und Gehirn arbeiten auch beim Lesen", "Ein Buch liefert dem Körper Energie"], correct: 1, hints: ["Was macht dein Herz, während du still sitzt?", "Auch im Schlaf atmest du weiter.", "Herz, Atmung und Gehirn brauchen auch in Ruhe Energie."], why: "Organe arbeiten auch in Ruhe und brauchen Energie." },
  { id: "ballast", food: 7, text: "Bärli sucht Ballaststoffe und greift nur zu Käse.", frage: "Welche Ergänzung liefert Ballaststoffe?", options: ["Noch mehr Käse", "Ein Glas Milch", "Eine Portion Linsen"], correct: 2, hints: ["Ballaststoffe stecken in pflanzlichen Lebensmitteln.", "Auch Vollkorn und Gemüse sind typische Quellen.", "Linsen sind eine Ballaststoffquelle."], why: "Linsen sind Hülsenfrüchte und enthalten Ballaststoffe." },
  { id: "fit", food: 0, text: "Bärli möchte den ganzen Nachmittag rennen und jede Pause auslassen.", frage: "Wie verbesserst du seinen Plan?", options: ["Pausen und Wasser einplanen", "Die Trinkflasche zu Hause lassen", "Auch abends jede Ruhepause auslassen"], correct: 0, hints: ["Was brauchst du, wenn du durstig wirst?", "Ruhe kann nach Anstrengung helfen.", "Plane Trink- und Erholungspausen ein."], why: "Wasser und Erholung gehören zu einem aktiven Tag." },
];

function standardState() {
  return { schema: datenVersion, done: {}, drafts: {}, results: {}, last: "", theme: "", checkNext: {}, practiceNotes: {}, preferences: { voice: "", rate: 1, size: 100 }, journal: {}, criteria: {}, review: {} };
}

const isRecord = value => value !== null && typeof value === "object" && !Array.isArray(value);
function cleanSelections(value, task) {
  return Array.isArray(value) ? [...new Set(value.filter(i => Number.isInteger(i) && i >= 0 && i < task.options.length))] : [];
}
function cleanWritten(value) {
  return [0, 1].map(i => ({ text: typeof value?.[i]?.text === "string" ? value[i].text.slice(0, 1200) : "", paper: value?.[i]?.paper === true }));
}
function normalizeState(raw) {
  if (!isRecord(raw)) throw new Error("Die Datei enthält keinen Lernstand.");
  if (raw.schema > datenVersion) throw new Error("Dieser Lernstand stammt aus einer neueren App-Version. Aktualisiere zuerst die App.");
  const out = standardState();
  for (const s of stationen) {
    if (raw.done?.[s.id] === true) out.done[s.id] = true;
    const step = raw.drafts?.[s.id];
    if (Number.isInteger(step) && step >= 0 && step < 5) out.drafts[s.id] = step;
    const next = raw.checkNext?.[s.id];
    if (Number.isInteger(next) && next >= 0 && next < 3) out.checkNext[s.id] = next;
    const note = raw.practiceNotes?.[s.id];
    if (isRecord(note) && typeof note.correct === "boolean") out.practiceNotes[s.id] = { at: Number.isFinite(note.at) ? note.at : 0, correct: note.correct, check: note.check === true };
    const text = raw.journal?.[s.id];
    if (typeof text === "string") out.journal[s.id] = text.slice(0, 1200);
    const review = raw.review?.[s.id];
    if (isRecord(review)) out.review[s.id] = { due: Number.isFinite(review.due) ? review.due : 0, streak: Math.max(0, Math.min(3, Number.isInteger(review.streak) ? review.streak : 0)), variant: Math.max(0, Number.isInteger(review.variant) ? review.variant % 3 : 0) };
  }
  for (const [i, exam] of pruefungen.entries()) {
    const draft = raw.drafts?.["exam-" + i];
    if (isRecord(draft)) out.drafts["exam-" + i] = {
      index: Number.isInteger(draft.index) ? Math.max(0, Math.min(9, draft.index)) : 0,
      answers: exam.tasks.map(([, task], j) => cleanSelections(draft.answers?.[j], task)),
      written: cleanWritten(draft.written),
    };
    const result = raw.results?.[i];
    if (isRecord(result) && Array.isArray(result.answers) && result.answers.length === 8) {
      const answers = exam.tasks.map(([, task], j) => cleanSelections(result.answers[j], task));
      const score = exam.tasks.filter(([, task], j) => task.correct.length === answers[j].length && task.correct.every(v => answers[j].includes(v))).length;
      out.results[i] = { answers, score, best: Math.max(score, Number.isInteger(result.best) ? Math.min(8, Math.max(0, result.best)) : score), at: Number.isFinite(result.at) ? result.at : 0 };
      if (Array.isArray(result.written)) out.results[i].written = cleanWritten(result.written);
    }
    for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) {
      const key = i + "-" + j + "-" + k;
      if (raw.criteria?.[key] === true) out.criteria[key] = true;
    }
  }
  out.last = stationen.some(s => s.id === raw.last) ? raw.last : "";
  out.theme = ["dark", "light"].includes(raw.theme) ? raw.theme : "";
  if (isRecord(raw.preferences)) out.preferences = {
    voice: typeof raw.preferences.voice === "string" ? raw.preferences.voice.slice(0, 300) : "",
    rate: [0.75, 1, 1.15].includes(raw.preferences.rate) ? raw.preferences.rate : 1,
    size: [100, 115, 130].includes(raw.preferences.size) ? raw.preferences.size : 100,
  };
  return out;
}

let extra = {};
let synchronizingState = false;
function foodPicture(index, cls = "") {
  const food = foodCards[index];
  return `<img class="food-picture ${cls}" src="./assets/essen-${food.key}.webp" alt="${food.name}" width="240" height="240" loading="lazy">`;
}
function extraButton(text, action, value = "", cls = "secondary") {
  return `<button type="button" class="${cls}" data-extra="${action}" data-value="${html(value)}">${text}</button>`;
}
function extraShell(title, body, figure = "baerli") {
  return `<div class="route">${breadcrumb()}<header class="unit-header salbei"><div><h1 tabindex="-1">${title}</h1></div>${figur(figure)}</header><section class="panel">${body}</section></div>`;
}

function renderGames() {
  extra = {};
  return extraShell("Entdecken und ausprobieren", `<div class="offer-grid">
    ${[
      ["Bärli hat sich vertan", "Finde einen Fehler und erkläre die Verbesserung.", "baerli"],
      ["Lebensmittel-Bildkarten", "Erkenne Lebensmittel und ordne die Gruppe zu.", "bildkarten"],
      ["Freie Frühstücksküche", "Wähle selbst aus dem gemeinsamen Vorrat.", "fruehstueck-frei"],
      ["Fünf-Minuten-Lernrunde", "Drei kurze Aufgaben mit einem klaren Abschluss.", "kurzrunde"],
      ["Sterns Entdeckeraufträge", "Beobachte Lebensmittel in deinem Alltag.", "entdecken"],
    ].map(([title, desc, target]) => `<a class="station sand" href="#${target}"><div><h2>${title}</h2><p>${desc}</p></div></a>`).join("")}
  </div>`);
}

function renderCards() {
  extra = { card: 0, picked: null };
  return extraShell("Lebensmittel-Bildkarten", `<p>Tippe auf eine Karte. Wähle anschließend ihre Gruppe.</p><div id="extra-area">${cardsArea()}</div>`);
}
function cardsArea() {
  const food = foodCards[extra.card];
  return `<div class="food-shelf">${foodCards.map((item, i) => `<button type="button" class="food-card" data-extra="card" data-value="${i}" aria-pressed="${extra.card === i}">${foodPicture(i)}<strong>${item.name}</strong></button>`).join("")}</div>
    <h2>${food.name} zuordnen</h2><div class="group-buttons">${gruppen.map((g, i) => extraButton(g.name, "card-group", i)).join("")}</div>
    <p role="status" class="reveal">${extra.picked === null ? "Welche Gruppe passt?" : extra.picked === food.group ? `✓ Richtig. Zuordnung richtig. Gruppe: ${gruppen[food.group].name}. Beispiele aus dieser Gruppe: ${gruppen[food.group].beispiel}.` : "↺ Diese Gruppe passt hier noch nicht. Versuche eine andere."}</p>`;
}

function renderFreeBreakfast() {
  extra = { selected: [], checked: false };
  return extraShell("Freie Frühstücksküche", `<p>Stelle ein Frühstück aus vier Lebensmitteln zusammen. Jeder der vier Bausteine soll einmal vorkommen.</p><div id="extra-area">${breakfastArea()}</div>`, "maja");
}
function breakfastArea() {
  const selected = extra.selected.map(i => foodCards[i]);
  const names = ["Getränk", "Obst oder Gemüse", "Brot oder Getreide", "Milchprodukt"];
  const missing = names.filter((_, i) => !selected.some(food => food.breakfast === i));
  const solved = selected.length === 4 && missing.length === 0;
  return `<div class="food-shelf">${foodCards.map((food, i) => `<button type="button" class="food-card" data-extra="breakfast-food" data-value="${i}" aria-pressed="${extra.selected.includes(i)}">${foodPicture(i)}<strong>${food.name}</strong></button>`).join("")}</div>
    <div class="tray"><h2>Dein Frühstück</h2><p>${selected.length ? selected.map(food => food.name).join(" · ") : "Dein Tablett ist noch leer."}</p></div>
    <div class="actions">${extraButton("Frühstück prüfen", "breakfast-check", "", "primary")}${extraButton("Neu zusammenstellen", "breakfast-reset")}</div>
    ${extra.checked ? `<div class="reveal" role="status">${solved ? "✓ Alle vier Bausteine sind dabei! Erkläre jemandem, welches Lebensmittel zu welchem Baustein gehört." : `↺ ${missing.length ? "Diese Bausteine fehlen noch: " + missing.join(", ") + "." : "Alle Bausteine sind dabei."} Wähle genau vier Lebensmittel, eines für jeden Baustein.`}
      ${selected.some(food => food.breakfast < 0) ? "<p>Linsen passen zu vielen Mahlzeiten, gehören aber zu Hülsenfrüchten. Schokolade zählt zu den Extras. Für diese Übung brauchst du die vier Frühstücksbausteine aus dem Unterricht.</p>" : ""}</div>` : ""}`;
}

function renderBaerli() {
  extra = { index: 0, picked: null, checked: false, hint: 0, explanation: "", rationale: false };
  return extraShell("Bärli hat sich vertan", `<div id="extra-area">${baerliArea()}</div>`);
}
function baerliArea() {
  const task = baerliFaelle[extra.index];
  const correct = extra.picked === task.correct;
  const picture = task.picture === false ? figur("baerli", "case-portrait") : foodPicture(task.food, "case-food");
  return `<div data-read><p class="eyebrow">Fall ${extra.index + 1} von ${baerliFaelle.length}</p><div class="case-lead">${picture}<p>${task.text}</p></div><h2>${task.frage}</h2></div>
    <div class="answers">${task.options.map((option, i) => `<button class="answer" type="button" data-extra="baerli-pick" data-value="${i}" aria-pressed="${extra.picked === i}" ${extra.checked ? "disabled" : ""}>${option}</button>`).join("")}</div>
    ${extra.checked ? `<div class="feedback ${correct ? "success" : "retry"}" role="status">${correct ? "✓ Richtig verbessert. " : "↺ Schau dir die Erklärung an. "}${task.why}</div>
      <label for="reason">Erkläre Bärli die Verbesserung in deinen Worten.</label><textarea id="reason" data-jot="baerli" rows="3" maxlength="600">${html(extra.explanation)}</textarea>
      <details><summary>Mit einer Erklärung vergleichen</summary><p>${task.why}</p></details>
      <label class="paper-option"><input type="checkbox" data-extra-check="rationale" ${extra.rationale ? "checked" : ""}> Ich habe meine Erklärung verglichen.</label>
      ${extraButton(extra.index + 1 < baerliFaelle.length ? "Nächster Fall →" : "Noch einmal starten", "baerli-next")}` : `<div class="actions">${extraButton("Verbesserung prüfen", "baerli-check", "", "primary")}${extraButton("Hinweis", "baerli-hint")}</div>`}
    ${extra.hint ? `<p class="reveal" role="status">${task.hints[Math.min(2, extra.hint - 1)]}</p>` : ""}
    ${speechButtons()}<p class="message" role="status"></p>`;
}

function recordReview(id, correct) {
  const previous = state.review[id] || { streak: 0, variant: 0 };
  const streak = correct ? Math.min(3, previous.streak + 1) : 0;
  state.review[id] = { streak, variant: (previous.variant + 1) % 3, due: Date.now() + (correct ? [1, 3, 7][streak - 1] : 0) * 86400000 };
}
function reviewQueue() {
  const notes = learningNotes();
  return [...stationen].sort((a, b) => {
    const priority = s => notes[s.id]?.retry ? 0 : (state.review[s.id]?.due || 0) <= Date.now() ? 1 : 2;
    return priority(a) - priority(b) || (state.review[a.id]?.due || 0) - (state.review[b.id]?.due || 0);
  }).slice(0, 3).map(s => {
    const variant = state.review[s.id]?.variant ?? 0;
    return { id: s.id, q: variant === 0 ? nachfragen[s.id][0] : variant === 1 ? nachfragen[s.id][1] : s.practice[1] };
  });
}
function renderShortRound() {
  extra = { queue: reviewQueue(), index: 0, picked: [], checked: false, results: [] };
  return extraShell("Deine kurze Lernrunde", `<p>Drei Aufgaben für ungefähr fünf Minuten. Du kannst dir so viel Zeit nehmen, wie du brauchst.</p><div id="extra-area">${roundArea()}</div>`);
}
function roundArea() {
  if (extra.index === extra.queue.length) return `<div class="round-finish"><h2>Lernrunde geschafft!</h2><p>${extra.results.filter(Boolean).length} von 3 Aufgaben richtig.</p>
    <p>Gönn dir eine Pause. Deine nächste Runde nutzt neue Beispiele und berücksichtigt deine Ergebnisse.</p>${nav("Zum Lernstand", "fortschritt", "primary")}</div>`;
  const { q } = extra.queue[extra.index];
  return `${questionMarkup(q, extra.picked, "Aufgabe " + (extra.index + 1) + " von 3", extra.checked)}
    ${extra.checked ? `<p role="status" class="reveal">${istRichtig(q, extra.picked) ? "✓ Richtig. " : "↺ Hier kannst du noch üben. "}${q.why}</p>${extraButton("Weiter →", "round-next", "", "primary")}`
      : extraButton("Antwort prüfen", "round-check", "", "primary")}
    ${speechButtons()}<p role="status" class="message"></p>`;
}

function renderDiscover() {
  const id = Object.hasOwn(stationNachId, route[1]) ? route[1] : "fit";
  const [title, instruction, sample] = alltagsauftraege[id];
  return extraShell("Sterns Entdeckeraufträge", `<label for="discover-topic">Thema</label><select id="discover-topic">${stationen.map(s => `<option value="${s.id}" ${id === s.id ? "selected" : ""}>${s.title}</option>`).join("")}</select>
    <div class="reveal" data-read><h2>${title}</h2><p>${instruction}</p></div>${speechButtons()}
    <label for="journal">Meine Entdeckung</label><textarea id="journal" data-topic="${id}" rows="4" maxlength="1200">
${html(state.journal[id] || "")}</textarea>
    <p class="save-status" role="status"></p><details><summary>Ein Beispiel ansehen</summary><p>${sample}</p></details>
    ${nav("Zum Thema lernen →", `station/${id}/0`)}`, "stern");
}

function renderLevel() {
  const id = Object.hasOwn(stationNachId, route[1]) ? route[1] : "fit";
  const level = ["1", "2", "3"].includes(route[2]) ? Number(route[2]) : 1;
  const s = stationNachId[id];
  extra = { id, level, picked: [], checked: false, answer: "" };
  return extraShell(s.title + " üben", `<p class="learning-goal">${lernziele[id]}</p><nav class="lab-links" aria-label="Schwierigkeit">${["Zuordnen", "Erklären", "Anwenden"].map((name, i) => `<a class="secondary" href="#niveau/${id}/${i + 1}" ${level === i + 1 ? 'aria-current="page"' : ""}>${i + 1}. ${name}</a>`).join("")}</nav><div id="extra-area">${levelArea()}</div>`);
}
function levelArea() {
  const s = stationNachId[extra.id];
  if (extra.level === 1) {
    const q = s.practice[0];
    return `${questionMarkup(q, extra.picked, "Zuordnen", extra.checked)}
      ${extra.checked ? `<p class="reveal" role="status">${istRichtig(q, extra.picked) ? "✓ Richtig. " : "↺ Schau noch einmal. "}${q.why}</p>${nav("Erklären üben →", `niveau/${s.id}/2`, "primary")}` : extraButton("Antwort prüfen", "level-check", "", "primary")}
      ${speechButtons()}<p class="message" role="status"></p>`;
  }
  const [instruction, sample] = extra.level === 2
    ? [`Erkläre in deinen Worten: ${s.facts[0][0]}. Was hast du dazu gelernt?`, s.facts[0][1]]
    : [alltagsauftraege[s.id][1], alltagsauftraege[s.id][2]];
  return `<div data-read><h2>${extra.level === 2 ? "Erklären" : "Auf einen neuen Fall anwenden"}</h2><p>${instruction}</p></div>${speechButtons()}
    <label for="level-answer">Deine Antwort</label><textarea id="level-answer" rows="4" maxlength="1200" data-jot="answer">${html(extra.answer)}</textarea>
    <details><summary>Antwortbeispiel und Prüfpunkte</summary><p>${sample}</p>
    <label class="paper-option"><input type="checkbox"> Meine Antwort passt zur Frage.</label><label class="paper-option"><input type="checkbox"> Ich nenne einen Grund oder ein Beispiel.</label></details>
    <div class="actions">${extra.level === 2 ? nav("Anwenden üben →", `niveau/${s.id}/3`, "primary") : nav("Zur Station →", `station/${s.id}/0`, "primary")}</div>`;
}

function renderParents() {
  const notes = learningNotes();
  return extraShell("Gemeinsam lernen", `<h2>Was zuletzt geklappt hat</h2>
    <p>Diese Übersicht zeigt die letzten Antworten im Browser. Zum gemeinsamen Üben passen die Gesprächsfragen unter jedem Thema.</p>
    <div class="parent-topics">${stationen.map(s => `<article><h3>${s.title}</h3><p>${lernziele[s.id]}</p><p><strong>${notes[s.id]?.text || "Noch keine Auswertung"}</strong></p>
      <p>Aufgabenbeispiel · ${s.practice[0].text}</p>
      ${gespraechsimpulse[s.id].map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}
      <div class="actions">${nav("Passend üben →", `niveau/${s.id}/1`)}${nav("Arbeitsblatt", `arbeitsblatt/${s.id}`)}</div></article>`).join("")}</div>
    <div class="actions">${nav("Lernstand sichern und Einstellungen", "einstellungen")}${nav("Kurze gemeinsame Lernrunde", "kurzrunde", "primary")}</div>`);
}

function renderWorksheet() {
  const s = Object.hasOwn(stationNachId, route[1]) ? stationNachId[route[1]] : stationen[0];
  const solutions = route[0] === "papierloesung";
  return extraShell((solutions ? "Lösungsblatt · " : "Arbeitsblatt · ") + s.title, `<p class="learning-goal">${lernziele[s.id]}</p>
    <div class="print-controls actions">${extraButton("Drucken / als PDF speichern", "print", "", "primary")}${nav(solutions ? "Zum Arbeitsblatt" : "Separates Lösungsblatt", `${solutions ? "arbeitsblatt" : "papierloesung"}/${s.id}`)}</div>
    <div class="worksheet"><p>Name ________________________ Datum ______________</p>
    ${s.practice.map((q, i) => `<section><h2>${i + 1}. ${q.text}</h2><p>${q.correct.length > 1 ? "Mehrere Antworten sind richtig." : "Eine Antwort ist richtig."}</p>
      ${q.options.map((option, n) => `<p>${solutions && q.correct.includes(n) ? "☑" : "☐"} ${option}</p>`).join("")}
      ${solutions ? `<p><strong>Erklärung</strong> · ${q.why}</p>` : ""}</section>`).join("")}
    <section><h2>4. Erkläre mit einem eigenen Beispiel.</h2><p>${alltagsauftraege[s.id][1]}</p>
    ${solutions ? `<p><strong>Beispielantwort</strong> · ${alltagsauftraege[s.id][2]}</p><p>Prüfen, ob die Antwort zur Frage passt und eine passende Begründung oder ein Beispiel enthält.</p>` : '<div class="writing-lines" aria-label="Schreibplatz"></div>'}</section></div>`);
}

function renderSettings() {
  const prefs = state.preferences;
  const voices = hasSpeech ? speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith("de")) : [];
  return extraShell("Einstellungen und Sicherung", `<h2>Lesen und Vorlesen</h2>
    <label for="font-size">Schriftgröße</label><select id="font-size">${[100, 115, 130].map(size => `<option value="${size}" ${prefs.size === size ? "selected" : ""}>${size} %</option>`).join("")}</select>
    <label for="voice">Deutsche Stimme</label><select id="voice" ${hasSpeech ? "" : "disabled"}><option value="">Gerätestimme automatisch wählen</option>${voices.map(v => `<option value="${html(v.voiceURI)}" ${prefs.voice === v.voiceURI ? "selected" : ""}>${html(v.name)}</option>`).join("")}</select>
    <p class="muted">${hasSpeech ? voices.length ? "Verfügbare deutsche Stimmen dieses Geräts." : "Dieses Gerät hat noch keine deutsche Stimme gemeldet. Du kannst die Liste neu laden." : "Vorlesen ist in diesem Browser nicht verfügbar."}</p>
    <label for="rate">Vorlesetempo</label><select id="rate">${[[0.75, "Langsam"], [1, "Normal"], [1.15, "Etwas schneller"]].map(([value, text]) => `<option value="${value}" ${prefs.rate === value ? "selected" : ""}>${text}</option>`).join("")}</select>
    <p data-read>Maja, Stern und Bärli entdecken gemeinsam, was ihr Körper braucht.</p>
    ${speechButtons()}${extraButton("Stimmenliste neu laden", "voices")}
    <h2>Lernstand sichern und übertragen</h2><p>Die Sicherung enthält Sterne, Antworten, Entdeckertexte und Einstellungen. Speichere die Datei, um später auf einem anderen Gerät weiterzulernen.</p>
    <div class="actions">${extraButton("Sicherung herunterladen", "export", "", "primary")}</div>
    <label class="file-label" for="import-state">Sicherung auswählen</label><input id="import-state" type="file" accept=".json,application/json">
    <div id="import-preview" class="reveal" hidden></div><p id="settings-status" role="status"></p>
    ${recoveryText ? `<div class="reveal"><h3>Gespeicherte Daten prüfen</h3><p>Ein gespeicherter Eintrag war unvollständig oder beschädigt. Verwendbare Daten wurden übernommen. Du kannst die ursprünglichen Daten zur Prüfung sichern.</p>${extraButton("Ursprüngliche Daten herunterladen", "recovery")}</div>` : ""}
    <h2>Offline lernen</h2><p id="offline-status" role="status">${offlineStatus}</p>
    <p>Öffne die App einmal mit Internet und warte auf „Offline bereit“. Danach stehen die Lerninhalte und Bilder auch ohne Verbindung zur Verfügung.</p>
    <p class="muted">Version ${appVersion}</p>`);
}

function applyPreferences() {
  document.documentElement.style.fontSize = state.preferences.size + "%";
}

function downloadJSON(data, name) {
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function refreshExtra(focusId = "") {
  const focused = document.activeElement;
  const action = focused?.dataset?.extra;
  const value = focused?.dataset?.value;
  stopSpeech();
  const renderers = { baerli: baerliArea, bildkarten: cardsArea, "fruehstueck-frei": breakfastArea, kurzrunde: roundArea, niveau: levelArea };
  main.querySelector("#extra-area").innerHTML = renderers[route[0]]();
  if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true });
  else {
    const target = [...main.querySelectorAll("[data-extra]")].find(node => node.dataset.extra === action && node.dataset.value === value);
    target?.focus({ preventScroll: true });
  }
}
function extraMessage(text) {
  const node = main.querySelector(".message");
  if (node) node.textContent = text;
}
function handleExtra(action, value) {
  const n = Number(value);
  if (action === "print") return window.print();
  if (action === "voices") return render(false);
  if (action === "export") return downloadJSON(JSON.stringify({ app: "majas-sachunterricht", schema: datenVersion, exported: new Date().toISOString(), state }, null, 2), "Majas-Sachunterricht-Lernstand.json");
  if (action === "recovery") return downloadJSON(recoveryText, "Majas-Sachunterricht-urspruengliche-Daten.json");
  if (action === "import-confirm") {
    if (!extra.imported) return;
    state = extra.imported;
    save();
    applyTheme();
    applyPreferences();
    render(false);
    document.getElementById("settings-status").textContent = "✓ Lernstand übernommen.";
    aktualisiereSterne();
    return;
  }
  if (action === "card") { extra.card = n; extra.picked = null; }
  if (action === "card-group") extra.picked = n;
  if (action === "breakfast-food") {
    extra.selected = extra.selected.includes(n) ? extra.selected.filter(i => i !== n) : [...extra.selected, n];
    extra.checked = false;
  }
  if (action === "breakfast-check") extra.checked = true;
  if (action === "breakfast-reset") { extra.selected = []; extra.checked = false; }
  if (action === "baerli-pick") extra.picked = n;
  if (action === "baerli-hint") extra.hint = Math.min(3, extra.hint + 1);
  if (action === "baerli-check") {
    if (extra.picked === null) return extraMessage("Wähle zuerst eine Verbesserung.");
    extra.checked = true;
    const correct = extra.picked === baerliFaelle[extra.index].correct;
    state.practiceNotes[baerliFaelle[extra.index].id] = { at: Date.now(), correct, check: false };
    recordReview(baerliFaelle[extra.index].id, correct);
    save();
  }
  if (action === "baerli-next") {
    if (!extra.rationale) return extraMessage("Vergleiche erst deine Erklärung und hake das Kästchen ab.");
    extra = { index: (extra.index + 1) % baerliFaelle.length, picked: null, checked: false, hint: 0, explanation: "", rationale: false };
  }
  if (action === "round-check" || action === "level-check") {
    if (!extra.picked.length) return extraMessage("Wähle zuerst eine Antwort.");
    extra.checked = true;
    const { id, q } = action === "round-check" ? extra.queue[extra.index] : { id: extra.id, q: stationNachId[extra.id].practice[0] };
    const correct = istRichtig(q, extra.picked);
    state.practiceNotes[id] = { at: Date.now(), correct, check: false };
    recordReview(id, correct);
    save();
    if (action === "round-check") extra.results.push(correct);
  }
  if (action === "round-next") { extra.index++; extra.checked = false; extra.picked = []; }
  refreshExtra();
  if (["baerli-next", "round-next"].includes(action)) {
    const heading = main.querySelector("#extra-area h2, #extra-area legend");
    if (heading) { heading.tabIndex = -1; heading.focus(); }
  }
}

document.addEventListener("click", event => {
  const b = event.target.closest("button[data-extra]");
  if (b) handleExtra(b.dataset.extra, b.dataset.value);
});
document.addEventListener("input", event => {
  const input = event.target;
  if (input.id === "journal") {
    state.journal[input.dataset.topic] = input.value.slice(0, 1200);
    save();
    main.querySelector(".save-status").textContent = storageAvailable ? "Gespeichert." : "Gerade nur für diese Sitzung gespeichert.";
  }
  if (input.dataset.jot) extra[input.dataset.jot === "baerli" ? "explanation" : "answer"] = input.value;
});
document.addEventListener("change", async event => {
  const input = event.target;
  if (input.id === "discover-topic") { location.hash = "entdecken/" + input.value; return; }
  if (input.dataset.extraCheck === "rationale") extra.rationale = input.checked;
  if (input.name === "answer" && ["kurzrunde", "niveau"].includes(route[0])) {
    extra.picked = [...main.querySelectorAll('input[name="answer"]:checked')].map(item => Number(item.value));
  }
  if (input.hasAttribute("data-criterion")) {
    state.criteria[input.dataset.criterion] = input.checked;
    save();
  }
  if (["font-size", "voice", "rate"].includes(input.id)) {
    if (input.id === "font-size") state.preferences.size = Number(input.value);
    if (input.id === "voice") state.preferences.voice = input.value;
    if (input.id === "rate") state.preferences.rate = Number(input.value);
    save();
    applyPreferences();
    if (hasSpeech) stopSpeech();
  }
  if (input.id === "import-state") {
    const status = document.getElementById("settings-status");
    const preview = document.getElementById("import-preview");
    delete extra.imported;
    preview.hidden = true;
    const file = input.files[0];
    if (!file) return;
    try {
      if (file.size > 2000000) throw new Error("Die Datei ist zu groß. Wähle eine Lernstandsicherung unter 2 MB.");
      const payload = JSON.parse(await file.text());
      if (!isRecord(payload)) throw new Error("Die Datei enthält keinen Lernstand.");
      if (payload.schema > datenVersion) throw new Error("Diese Sicherung stammt aus einer neueren App-Version.");
      const data = payload.app === "majas-sachunterricht" ? payload.state : payload;
      if (!isRecord(data) || !isRecord(data.done) || !isRecord(data.drafts) || !isRecord(data.results)) throw new Error("Bitte wähle eine Sicherung aus Majas Sachunterrichtswelt.");
      extra.imported = normalizeState(data);
      preview.innerHTML = `<p>Die Datei enthält ${Object.keys(extra.imported.done).length} Stationssterne und ${Object.keys(extra.imported.results).length} abgegebene Arbeiten. Beim Übernehmen wird der Lernstand in diesem Browser ersetzt. Sichere ihn vorher, wenn du ihn behalten möchtest.</p>${extraButton("Diesen Lernstand übernehmen", "import-confirm", "", "primary")}`;
      preview.hidden = false;
      status.textContent = "Datei geprüft. Du kannst sie jetzt übernehmen.";
    } catch (error) {
      status.textContent = "Die Sicherung konnte nicht gelesen werden. " + (error instanceof SyntaxError ? "Prüfe, ob es eine JSON-Sicherung ist." : error.message);
    }
  }
});

let offlineStatus = "Offline-Speicherung wird vorbereitet.";
function showOfflineStatus(text) {
  offlineStatus = text;
  const node = document.getElementById("offline-status");
  if (node) node.textContent = text;
}
function initOffline() {
  if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) {
    showOfflineStatus("Offline-Speicherung ist unter dieser Adresse nicht verfügbar.");
    return;
  }
  navigator.serviceWorker.register("./sw.js").then(registration => {
    const showUpdate = () => {
      if (!registration.waiting) return;
      const banner = document.getElementById("update-banner");
      banner.hidden = false;
      document.getElementById("apply-update").onclick = () => registration.waiting?.postMessage("ACTIVATE");
    };
    showUpdate();
    const watchInstallation = () => {
      const worker = registration.installing;
      if (!worker) return;
      worker.addEventListener("statechange", () => {
        if (worker.state === "installed") {
          if (navigator.serviceWorker.controller) showUpdate();
          else showOfflineStatus("✓ Offline bereit. Lerninhalte und Bilder sind auf diesem Gerät gespeichert.");
        }
      });
    };
    watchInstallation();
    registration.addEventListener("updatefound", watchInstallation);
    navigator.serviceWorker.ready.then(() => showOfflineStatus("✓ Offline bereit. Lerninhalte und Bilder sind auf diesem Gerät gespeichert."));
  }).catch(() => showOfflineStatus("Offline-Speicherung hat noch nicht geklappt. Öffne die App erneut mit Internet."));
  let reloading = false;
  let hadController = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController) {
      hadController = true;
      return;
    }
    if (reloading) return;
    reloading = true;
    if (navigator.serviceWorker.controller) location.reload();
  });
}

window.addEventListener("storage", event => {
  if (event.key !== "majas-sachunterricht-v1" || !event.newValue) return;
  try {
    state = normalizeState(JSON.parse(event.newValue));
    applyTheme();
    applyPreferences();
    const focusId = document.activeElement?.id;
    const selection = document.activeElement?.selectionStart;
    synchronizingState = true;
    try { render(false); } finally { synchronizingState = false; }
    const input = focusId && document.getElementById(focusId);
    if (input) {
      input.focus({ preventScroll: true });
      if (typeof selection === "number" && input.setSelectionRange) {
        try { input.setSelectionRange(selection, selection); } catch {}
      }
    }
  } catch {
    // Retain the last valid state if another tab writes an invalid payload.
  }
});
window.addEventListener("load", () => {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.addEventListener("voiceschanged", () => {
    const select = document.getElementById("voice");
    if (!select) return;
    const voices = speechSynthesis.getVoices().filter(voice => voice.lang.toLowerCase().startsWith("de"));
    select.innerHTML = '<option value="">Gerätestimme automatisch wählen</option>' +
      voices.map(voice => `<option value="${html(voice.voiceURI)}" ${voice.voiceURI === state.preferences.voice ? "selected" : ""}>${html(voice.name)}</option>`).join("");
  });
});

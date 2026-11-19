"use strict";

const profilRegisterKey = "majas-sachunterricht-profile";
function profileList() {
  try {
    const raw = JSON.parse(localStorage.getItem(profilRegisterKey) || "[]");
    return [
      { id: "standard", name: "Mein Lernstand" },
      ...(Array.isArray(raw)
        ? raw
            .filter(
              (p) =>
                /^kind-[a-z0-9-]+$/.test(p?.id) && typeof p.name === "string",
            )
            .slice(0, 11)
            .map((p) => ({ id: p.id, name: p.name.slice(0, 32) }))
        : []),
    ];
  } catch {
    return [{ id: "standard", name: "Mein Lernstand" }];
  }
}
function activeProfile() {
  try {
    const id = sessionStorage.getItem(profilRegisterKey) || "standard";
    return profileList().some((p) => p.id === id) ? id : "standard";
  } catch {
    return "standard";
  }
}
function profileStorageKey() {
  return (
    "majas-sachunterricht-v1" +
    (activeProfile() === "standard" ? "" : "-" + activeProfile())
  );
}
function normalizeResearch(raw, out) {
  const source = isRecord(raw.research) ? raw.research : {};
  const cleanText = (value) =>
    typeof value === "string" ? value.slice(0, 1200) : "";
  out.research = {
    notes: Array.isArray(source.notes)
      ? source.notes
          .filter(isRecord)
          .slice(0, 60)
          .map((n) => ({
            text: cleanText(n.text),
            food: Number.isInteger(n.food) && foodCards[n.food] ? n.food : 0,
          }))
      : [],
    comic: [0, 1, 2, 3].map((i) => ({
      scene: Number.isInteger(source.comic?.[i]?.scene)
        ? Math.max(0, Math.min(3, source.comic[i].scene))
        : i,
      text: cleanText(source.comic?.[i]?.text).slice(0, 240),
    })),
    plan: Array.isArray(source.plan)
      ? [
          ...new Set(
            source.plan.filter((id) => stationen.some((s) => s.id === id)),
          ),
        ].slice(0, 3)
      : [],
    history: Array.isArray(source.history)
      ? source.history
          .filter(
            (x) =>
              isRecord(x) &&
              stationen.some((s) => s.id === x.id) &&
              typeof x.correct === "boolean" &&
              Number.isFinite(x.at),
          )
          .slice(-120)
          .map((x) => ({
            id: x.id,
            correct: x.correct,
            at: x.at,
            later: x.later === true,
          }))
      : [],
    start: Array.isArray(source.start)
      ? source.start.slice(0, 3).map((v) => (typeof v === "boolean" ? v : null))
      : [],
    family: ["alle", "vegetarisch", "laktosefrei"].includes(source.family)
      ? source.family
      : "alle",
  };
  for (const [i, result] of Object.entries(out.results)) {
    if (raw.results?.[i]?.partial !== undefined) {
      result.partial = selectionPoints(pruefungen[i], result.answers);
      result.bestPoints = Math.max(
        result.partial,
        Number.isFinite(raw.results[i].bestPoints)
          ? Math.min(8, Math.max(0, raw.results[i].bestPoints))
          : result.best,
      );
    }
  }
}
function researchState() {
  if (!state.research) normalizeResearch({}, state);
  return state.research;
}
function selectionPoints(exam, answers) {
  return (
    Math.round(
      exam.tasks.reduce((sum, [, q], i) => {
        const selected = answers[i] || [];
        const good = selected.filter((n) => q.correct.includes(n)).length;
        const bad = selected.filter((n) => !q.correct.includes(n)).length;
        return sum + Math.max(0, (good - bad) / q.correct.length);
      }, 0) * 100,
    ) / 100
  );
}
function logUnderstanding(id, correct) {
  const r = researchState();
  const previous = r.history.filter((x) => x.id === id).at(-1);
  r.history.push({
    id,
    correct,
    at: Date.now(),
    later: Boolean(previous && Date.now() - previous.at >= 86400000),
  });
  r.history = r.history.slice(-120);
}
function criteriaPoints(exam) {
  return [0, 1].reduce(
    (sum, j) =>
      sum +
      [0, 1].filter((k) => state.criteria[exam + "-" + j + "-" + k]).length,
    0,
  );
}
let lab = {};
function labButton(label, action, value = "") {
  return `<button class="secondary" type="button" data-lab="${action}" data-value="${html(value)}">${label}</button>`;
}
function labShell(title, body, who = "stern") {
  return extraShell(title, `<div id="lab-area">${body}</div>`, who);
}
function renderResearchHub() {
  return labShell(
    "Unsere Forscherwerkstatt",
    `<p>Wähle, was du heute untersuchen oder gestalten möchtest.</p><div class="offer-grid">${[
      ["Unser Picknick planen", "picknick"],
      ["Verpackungen untersuchen", "verpackung"],
      ["Mein Lerncomic", "comic"],
      ["Gemeinsam spielen", "team"],
      ["Mein Forscherheft", "forscherheft"],
      ["Mein Lernstart", "lernstart"],
      ["Gerichte zerlegen", "gerichte"],
      ["Typische Denkfehler", "denkfehler"],
      ["Mein Lernweg", "lernweg"],
      ["Maja erklärt es mir", "erklaeren"],
      ["Familienfrühstück", "familie"],
      ["Fortschrittsbericht", "bericht"],
      ["Kinderprofile", "profile"],
    ]
      .map(([name, target]) => nav(name, target, "station salbei"))
      .join("")}</div>`,
  );
}
function renderPicnic() {
  lab = { picked: [], reason: "", checked: false };
  return labShell("Unser Picknick planen", picnicBody(), "maja");
}
function picnicBody() {
  const selected = lab.picked.map((i) => foodCards[i]);
  const groups = new Set(
    selected.map((f) => f.breakfast).filter((g) => g >= 0),
  );
  return `<p data-read>Maja, Stern und Bärli spielen draußen. Plane ein Picknick mit einem Getränk, Obst oder Gemüse, Brot oder Getreide und einem Milchprodukt. Begründe eine Auswahl.</p>
    <div class="food-shelf">${foodCards.map((f, i) => `<button type="button" class="food-card" data-lab="picnic-food" data-value="${i}" aria-pressed="${lab.picked.includes(i)}">${foodPicture(i)}<strong>${f.name}</strong></button>`).join("")}</div>
    <label for="picnic-reason">Warum passt deine Auswahl zu den Freunden?</label><textarea id="picnic-reason" rows="3" maxlength="1200">${html(lab.reason)}</textarea>
    ${labButton("Mit den Freunden prüfen", "picnic-check")}
    ${lab.checked ? `<div class="reveal" role="status"><p>${groups.size === 4 ? "✓ Alle vier Bausteine sind vertreten." : "Bärli fragt: Welcher der vier Bausteine fehlt noch?"}</p><p>Stern fragt: Welches Getränk löscht unseren Durst?</p><p>Maja fragt: Kannst du ein Lebensmittel gegen ein anderes aus derselben Gruppe tauschen?</p><p>Deine Begründung · ${html(lab.reason) || "Schreibe oder erzähle, warum eine Auswahl passt."}</p></div>` : ""}`;
}
const packungen = [
  {
    name: "Hafer-Müsli",
    ingredients: "Haferflocken (80 %), Rosinen (15 %), Sonnenblumenkerne (5 %)",
    sugar: "12 g",
    unit: "100 g",
  },
  {
    name: "Apfelschorle",
    ingredients: "Wasser (60 %), Apfelsaft (40 %)",
    sugar: "4 g",
    unit: "100 ml",
  },
];
function renderPackaging() {
  lab = { index: 0, mark: "", zoom: false };
  return labShell("Verpackungen untersuchen", packageBody());
}
function packageBody() {
  const p = packungen[lab.index];
  return `<p>Dies sind erfundene Beispielverpackungen. Suche zuerst die Zutatenliste und anschließend die Zuckerangabe.</p>
    <div class="actions">${labButton("Müsli", "package", 0)}${labButton("Schorle", "package", 1)}</div>
    ${labButton(lab.zoom ? "Normale Größe" : "Verpackung vergrößern", "package-zoom")}<div class="package ${lab.zoom ? "package-zoom" : ""}"><h2>${p.name}</h2><button class="package-section" type="button" data-lab="package-mark" data-value="zutaten" aria-pressed="${lab.mark === "zutaten"}"><strong>Zutaten</strong><span>${p.ingredients}</span></button>
    <button class="package-section" type="button" data-lab="package-mark" data-value="naehrwerte" aria-pressed="${lab.mark === "naehrwerte"}"><strong>Auszug aus der Nährwerttabelle · je ${p.unit}</strong><span>davon Zucker · ${p.sugar}</span></button></div>
    <div role="status" class="reveal">${lab.mark === "zutaten" ? "✓ Hier stehen die Zutaten. Sie sind nach ihrem Gewichtsanteil bei der Herstellung geordnet." : lab.mark === "naehrwerte" ? `✓ Hier findest du den gesamten Zucker je ${p.unit}. Auch natürlicher Zucker ist darin enthalten.` : "Tippe auf den Abschnitt, den du untersuchen möchtest."}</div>`;
}
function renderComic() {
  return labShell(
    "Mein Lerncomic",
    `<p>Wähle für jedes Bild eine Szene und schreibe eine Sprechblase. Erkläre zum Beispiel, wie ein Picknick mit vier Bausteinen aussieht.</p>
    <div class="comic-editor">${researchState()
      .comic.map(
        (
          panel,
          i,
        ) => `<article><label for="comic-scene-${i}">Bild ${i + 1}</label><select id="comic-scene-${i}" data-comic-scene="${i}">${["Parcours", "Trinkpause", "Zuckerdetektiv", "Picknick"].map((name, n) => `<option value="${n}" ${panel.scene === n ? "selected" : ""}>${name}</option>`).join("")}</select>
      <img id="comic-image-${i}" src="./assets/${bilder[panel.scene]}.webp" alt="${bildtexte[panel.scene]}" width="960" height="640">
      <label for="comic-text-${i}">Sprechblase ${i + 1}</label><textarea id="comic-text-${i}" data-comic-text="${i}" maxlength="240" rows="3">${html(panel.text)}</textarea><p class="comic-print-text" id="comic-print-${i}">${html(panel.text)}</p></article>`,
      )
      .join("")}</div>
      <p class="save-status" role="status"></p>${labButton("Comic drucken / als PDF speichern", "print")}`,
  );
}
function renderNotebook() {
  return labShell(
    "Mein Forscherheft",
    `<label for="note-food">Bildkarte für deinen Merksatz</label><select id="note-food">${foodCards.map((food, i) => `<option value="${i}">${food.name}</option>`).join("")}</select>
    <label for="note-text">Mein Merksatz</label><textarea id="note-text" maxlength="1200" rows="3"></textarea>${labButton("Merksatz speichern", "note-add")}<p class="message" role="status"></p>
    <div class="notebook">${researchState()
      .notes.map(
        (note, i) =>
          `<article>${foodPicture(note.food)}<p>${html(note.text)}</p>${labButton("Eintrag entfernen", "note-delete", i)}</article>`,
      )
      .join("")}</div>
    ${labButton("Forscherheft drucken / als PDF speichern", "print")}`,
  );
}
function renderTeam() {
  lab = { turn: 0, picked: null, checked: false, answers: [] };
  return labShell("Gemeinsam zum Picknick", teamBody(), "baerli");
}
function teamBody() {
  if (lab.turn === 4)
    return `<h2>Gemeinsam geschafft!</h2><p>Ihr habt euch bei vier Aufgaben abgewechselt und ${lab.answers.filter(Boolean).length} richtig gelöst.</p><img class="team-reward" src="./assets/picknick-wiese.webp" alt="Maja, Stern und Bärli teilen ihr Picknick." width="960" height="640"><p>Wählt zusammen euren liebsten Picknickplatz und erklärt einander eure Auswahl.</p>${labButton("Neue Runde", "team-reset")}`;
  const q = baerliFaelle[lab.turn];
  return `<p class="eyebrow">Kind ${(lab.turn % 2) + 1} ist dran · Aufgabe ${lab.turn + 1} von 4</p><h2>${q.frage}</h2><p>${q.text}</p><div class="answers">${q.options.map((o, i) => `<button class="answer" type="button" data-lab="team-pick" data-value="${i}" aria-pressed="${lab.picked === i}" ${lab.checked ? "disabled" : ""}>${o}</button>`).join("")}</div>
  ${lab.checked ? `<p role="status" class="reveal">${lab.picked === q.correct ? "✓ Richtig." : "↺ Besprecht die Erklärung."} ${q.why}</p>${labButton("An das andere Kind weitergeben", "team-next")}` : labButton("Antwort prüfen", "team-check")}<p class="message" role="status"></p>`;
}
function renderStartCheck() {
  lab = { index: 0, picked: null, answers: [] };
  return labShell("Mein Lernstart", startCheckBody());
}
function startCheckBody() {
  const ids = ["fruehstueck", "pyramide", "zucker"];
  if (lab.index === 3) {
    const missing = ids.filter((_, i) => !lab.answers[i]);
    return `<h2>So kannst du beginnen</h2><p>${missing.length ? "Diese Themen passen zu deinen nächsten Schritten." : "Deine Antworten zeigen schon Vorwissen. Probiere jetzt die Aufgaben zum Anwenden."}</p><div class="actions">${(missing.length ? missing : ids).map((id) => nav(stationNachId[id].title, `niveau/${id}/${missing.length ? 1 : 3}`)).join("")}</div>`;
  }
  const q = stationNachId[ids[lab.index]].check;
  return `<p>Drei kurze Aufgaben helfen dir, einen Einstieg zu finden.</p><h2>${lab.index + 1}. ${q.text}</h2><div class="answers">${q.options.map((o, i) => `<button type="button" class="answer" data-lab="start-pick" data-value="${i}" aria-pressed="${lab.picked === i}">${o}</button>`).join("")}</div>${labButton("Weiter", "start-next")}<p class="message" role="status"></p>`;
}
const gerichte = [
  {
    name: "Belegtes Vollkornbrot",
    parts: [
      ["Vollkornbrot", 5],
      ["Käse", 3],
      ["Gurkenscheiben", 6],
    ],
  },
  {
    name: "Müsli",
    parts: [
      ["Haferflocken", 5],
      ["Naturjoghurt", 3],
      ["Apfelstücke", 6],
    ],
  },
  {
    name: "Selbst belegte Pizza",
    parts: [
      ["Teig aus Mehl", 5],
      ["Tomaten und Paprika", 6],
      ["Käse", 3],
      ["Etwas Olivenöl", 1],
    ],
  },
];
function renderDishes() {
  lab = { dish: 0, answers: [], checked: false };
  return labShell("Gerichte zerlegen", dishBody(), "maja");
}
function dishBody() {
  const dish = gerichte[lab.dish];
  return `<p>Ein Gericht kann Zutaten aus mehreren Gruppen enthalten. Untersuche jede Zutat einzeln.</p><label for="dish">Gericht</label><select id="dish">${gerichte.map((d, i) => `<option value="${i}" ${lab.dish === i ? "selected" : ""}>${d.name}</option>`).join("")}</select>
 <div class="dish-parts">${dish.parts
   .map(
     (
       [name, group],
       i,
     ) => `<label for="dish-${i}"><strong>${name}</strong><select id="dish-${i}" data-dish-part="${i}"><option value="">Gruppe auswählen …</option>${gruppen.map((g, j) => `<option value="${j}" ${lab.answers[i] === j ? "selected" : ""}>${g.name}</option>`).join("")}</select>
 ${lab.checked ? `<span>${lab.answers[i] === group ? "✓ Richtig" : "↺ Passend ist: " + gruppen[group].name}</span>` : ""}</label>`,
   )
   .join(
     "",
   )}</div>${labButton("Zutaten prüfen", "dish-check")}<p role="status" class="message"></p>`;
}
function renderMisconceptions() {
  return labShell(
    "Denkfehler untersuchen",
    `<p>Überlege erst selbst. Öffne danach die Gegenprobe.</p>${[
      [
        "Vier Lebensmittel sind immer vier Frühstücksbausteine.",
        "Apfel, Gurke, Möhre und Birne sind vier Lebensmittel aus demselben Baustein.",
        "fruehstueck",
      ],
      [
        "Milch ist ein Getränk und gehört deshalb ganz unten in die Pyramide.",
        "Im Pyramidenmodell zählt Milch zu den Milchprodukten. Die Gruppen richten sich auch nach ihrer Zusammensetzung.",
        "pyramide",
      ],
      [
        "Ein großer Saftkarton hat immer mehr Zucker je 100 ml als eine kleine Flasche.",
        "Die Packungsgröße verrät die Zuckermenge je 100 ml nicht. Vergleiche die Nährwertangaben.",
        "zucker",
      ],
      [
        "Ein zusammengesetztes Gericht gehört immer nur in eine Gruppe.",
        "Müsli kann Haferflocken, Joghurt und Obst enthalten. Jede Zutat hat ihre eigene Gruppe.",
        "geschichte",
      ],
    ]
      .map(
        ([claim, reason, id]) =>
          `<article class="reveal"><h2>${claim}</h2><details><summary>Gegenprobe und Erklärung</summary><p>${reason}</p>${nav("Dazu üben", `niveau/${id}/3`)}</details></article>`,
      )
      .join("")}`,
  );
}
function renderLearningPath() {
  return labShell(
    "Unser Lernweg",
    `<p>Wählt bis zu drei Stationen in der Reihenfolge, in der ihr lernen möchtet. Die Auswahl wird im Kinderprofil gespeichert.</p><div class="group-buttons">${stationen.map((s) => labButton(s.title, "plan-add", s.id)).join("")}</div>
 <ol class="planned-path">${researchState()
   .plan.map(
     (id, i) =>
       `<li>${nav(stationNachId[id].title, `station/${id}/${state.drafts[id] || 0}`)}${labButton("Entfernen", "plan-remove", i)}</li>`,
   )
   .join("")}</ol><p class="message" role="status"></p>`,
  );
}
function renderExplain() {
  const id = Object.hasOwn(stationNachId, route[1]) ? route[1] : "fruehstueck";
  return labShell(
    "Maja erklärt es mir",
    `<label for="explain-topic">Thema</label><select id="explain-topic">${stationen.map((s) => `<option value="${s.id}" ${id === s.id ? "selected" : ""}>${s.title}</option>`).join("")}</select>
 <p>Das Kind erklärt. Ein Erwachsener hört zu und fragt bei Bedarf nach einem Beispiel.</p>${gespraechsimpulse[id].map(([q, a]) => `<article class="reveal"><h2>${q}</h2><details><summary>Worauf Erwachsene achten können</summary><p>${a}</p><label class="paper-option"><input type="checkbox"> Eine passende Erklärung ist erkennbar.</label><label class="paper-option"><input type="checkbox"> Das Kind nennt ein eigenes Beispiel.</label></details></article>`).join("")}`,
  );
}
function renderFamily() {
  const mode = researchState().family;
  const examples = {
    alle: [
      "Vollkornbrot mit Käse, Gurke und Wasser",
      "Haferflocken mit Naturjoghurt, Apfel und ungesüßtem Tee",
    ],
    vegetarisch: [
      "Vollkornbrot mit Quark, Möhre und Wasser",
      "Haferflocken mit Naturjoghurt, Birne und Tee",
    ],
    laktosefrei: [
      "Vollkornbrot, laktosefreier Naturjoghurt, Gurke und Wasser",
      "Haferflocken, laktosefreie Milch, Apfel und ungesüßter Tee",
    ],
  };
  return labShell(
    "Unser Familienfrühstück",
    `<label for="family-mode">Beispiele auswählen</label><select id="family-mode">${[
      ["alle", "Verschiedene Frühstücke"],
      ["vegetarisch", "Vegetarische Beispiele"],
      ["laktosefrei", "Laktosefreie Beispiele"],
    ]
      .map(
        ([v, t]) =>
          `<option value="${v}" ${v === mode ? "selected" : ""}>${t}</option>`,
      )
      .join("")}</select>
 <p>Die vier Bausteine helfen beim Zusammenstellen. Auch ein kleines Frühstück und ein zweites Frühstück in der Schule können zusammenpassen.</p><ul>${examples[mode].map((text) => `<li>${text}</li>`).join("")}</ul>
 <p>Bei pflanzlichen Alternativen unterscheiden sich die Inhaltsstoffe. Schaut mit einem Erwachsenen zum Beispiel nach Eiweiß und zugesetztem Calcium auf der Packung. Bei Allergien wählt ihr gemeinsam Lebensmittel, die ihr vertragt.</p>${nav("Selbst zusammenstellen", "fruehstueck-frei", "primary")}`,
  );
}
function renderReport() {
  const notes = learningNotes();
  const nextTopic =
    stationen.find((s) => notes[s.id]?.retry) ||
    stationen.find((s) => !state.done[s.id]) ||
    stationen[0];
  return labShell(
    "Fortschrittsbericht",
    `<p>Profil · ${html(profileList().find((p) => p.id === activeProfile())?.name || "Mein Lernstand")}</p>
 <p>Stand · ${new Date().toLocaleDateString("de-DE")}</p><table class="report-table"><thead><tr><th>Thema</th><th>Letzte Beobachtung</th><th>Später überprüft</th></tr></thead><tbody>${stationen
   .map((s) => {
     const later = researchState()
       .history.filter((h) => h.id === s.id && h.later)
       .at(-1);
     return `<tr><th>${s.title}</th><td>${notes[s.id]?.text || "Noch keine Antwort ausgewertet"}</td><td>${later ? (later.correct ? "Gelungen" : "Weiter üben") : "Noch keine spätere Überprüfung"}</td></tr>`;
   })
   .join(
     "",
   )}</tbody></table><h2>Empfohlener nächster Schritt</h2>${nav(nextTopic.title + " üben", "niveau/" + nextTopic.id + "/1")}
 <p>Aufgabenbeispiel · ${stationen.find((s) => notes[s.id]?.retry)?.practice[0].text || stationen[0].practice[0].text}</p>
 <div class="print-controls">${labButton("Bericht drucken / als PDF speichern", "print")}</div>`,
  );
}
function renderProfiles() {
  return labShell(
    "Kinderprofile",
    `<p>Jedes Profil hat eigene Antworten, Sterne, Einstellungen und ein eigenes Forscherheft. Profile werden in diesem Browser gespeichert. Sichere jedes Profil über die Einstellungen.</p>
 <label for="profile-select">Aktives Profil</label><select id="profile-select">${profileList()
   .map(
     (p) =>
       `<option value="${p.id}" ${p.id === activeProfile() ? "selected" : ""}>${html(p.name)}</option>`,
   )
   .join("")}</select>
 <label for="profile-name">Name für ein neues Profil</label><input id="profile-name" maxlength="32" type="text" autocomplete="off">${labButton("Profil anlegen", "profile-add")}<p class="message" role="status"></p>`,
  );
}
let diagnosticErrors = [];
window.addEventListener("error", () => {
  diagnosticErrors.push({ kind: "script", at: new Date().toISOString() });
  diagnosticErrors = diagnosticErrors.slice(-10);
});
window.addEventListener("unhandledrejection", () => {
  diagnosticErrors.push({ kind: "promise", at: new Date().toISOString() });
  diagnosticErrors = diagnosticErrors.slice(-10);
});
function renderDiagnostics() {
  return labShell(
    "Hilfe bei technischen Problemen",
    `<p>Beschreibe bei einer Rückfrage, welchen Bereich du öffnen wolltest. Du kannst zusätzlich diesen technischen Bericht herunterladen.</p>
 <p>Der Bericht enthält App-Version, Browser, Bildschirmgröße, Verbindungsstatus und allgemeine Fehlerarten. Antworten, Namen und Texte aus dem Forscherheft werden ausgelassen.</p>${labButton("Technischen Bericht herunterladen", "diagnostic")}`,
  );
}
function switchProfile(id) {
  if (!profileList().some((p) => p.id === id)) return;
  save();
  releaseExamLock();
  try {
    sessionStorage.setItem(profilRegisterKey, id);
    storageKey = profileStorageKey();
    const raw = localStorage.getItem(storageKey);
    state = raw ? normalizeState(JSON.parse(raw)) : standardState();
    recoveryText = localStorage.getItem(storageKey + "-rettung") || "";
    applyTheme();
    applyPreferences();
    location.hash = "start";
    render();
  } catch {
    extraMessage(
      "Das Profil konnte nicht geöffnet werden. Sichere den aktuellen Lernstand.",
    );
  }
}
function refreshLab(body) {
  const active = document.activeElement?.dataset;
  main.querySelector("#lab-area").innerHTML = body();
  const button = [...main.querySelectorAll("[data-lab]")].find(
    (b) => b.dataset.lab === active?.lab && b.dataset.value === active?.value,
  );
  button?.focus({ preventScroll: true });
}
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lab]");
  if (!button) return;
  const action = button.dataset.lab,
    n = Number(button.dataset.value);
  if (action === "print") return window.print();
  if (action === "profile-add") {
    const name = document.getElementById("profile-name").value.trim();
    if (!name) return extraMessage("Gib einen Namen für das Profil ein.");
    const profiles = profileList();
    if (profiles.length >= 12)
      return extraMessage("Es sind bereits zwölf Profile angelegt.");
    const id = "kind-" + crypto.randomUUID();
    try {
      localStorage.setItem(
        profilRegisterKey,
        JSON.stringify([...profiles.slice(1), { id, name }]),
      );
      switchProfile(id);
    } catch {
      extraMessage("Das Profil konnte nicht gespeichert werden.");
    }
    return;
  }
  if (action === "diagnostic") {
    const report = {
      version: appVersion,
      browser: navigator.userAgent,
      viewport: { width: innerWidth, height: innerHeight },
      online: navigator.onLine,
      storage: storageAvailable,
      serviceWorker: "serviceWorker" in navigator,
      errors: diagnosticErrors,
    };
    return downloadJSON(
      JSON.stringify(report, null, 2),
      "Sachunterricht-Diagnose.json",
    );
  }
  if (action === "note-add") {
    const text = document.getElementById("note-text").value.trim();
    if (!text) return extraMessage("Schreibe zuerst einen Merksatz.");
    if (researchState().notes.length >= 60)
      return extraMessage(
        "Dein Heft hat bereits 60 Einträge. Drucke es aus und entferne bei Bedarf einen Eintrag.",
      );
    researchState().notes.push({
      text,
      food: Number(document.getElementById("note-food").value),
    });
    save();
    return render(false);
  }
  if (action === "note-delete") {
    researchState().notes.splice(n, 1);
    save();
    return render(false);
  }
  if (action === "plan-add") {
    const plan = researchState().plan;
    if (plan.includes(button.dataset.value))
      return extraMessage("Diese Station steht schon im Lernweg.");
    if (plan.length >= 3)
      return extraMessage("Wähle höchstens drei Stationen.");
    plan.push(button.dataset.value);
    save();
    return render(false);
  }
  if (action === "plan-remove") {
    researchState().plan.splice(n, 1);
    save();
    return render(false);
  }
  if (action === "picnic-food") {
    lab.reason = document.getElementById("picnic-reason").value;
    lab.picked = lab.picked.includes(n)
      ? lab.picked.filter((i) => i !== n)
      : [...lab.picked, n];
    lab.checked = false;
    return refreshLab(picnicBody);
  }
  if (action === "picnic-check") {
    lab.reason = document.getElementById("picnic-reason").value;
    lab.checked = true;
    return refreshLab(picnicBody);
  }
  if (action === "package-zoom") {
    lab.zoom = !lab.zoom;
    return refreshLab(packageBody);
  }
  if (action === "package") {
    lab.index = n;
    lab.mark = "";
    return refreshLab(packageBody);
  }
  if (action === "package-mark") {
    lab.mark = button.dataset.value;
    return refreshLab(packageBody);
  }
  if (action === "team-reset") {
    lab = { turn: 0, picked: null, checked: false, answers: [] };
    return refreshLab(teamBody);
  }
  if (action === "team-pick") {
    lab.picked = n;
    return refreshLab(teamBody);
  }
  if (action === "team-check") {
    if (lab.picked === null) return extraMessage("Wähle zuerst eine Antwort.");
    lab.checked = true;
    lab.answers.push(lab.picked === baerliFaelle[lab.turn].correct);
    return refreshLab(teamBody);
  }
  if (action === "team-next") {
    lab.turn++;
    lab.picked = null;
    lab.checked = false;
    return refreshLab(teamBody);
  }
  if (action === "start-pick") {
    lab.picked = n;
    return refreshLab(startCheckBody);
  }
  if (action === "start-next") {
    if (lab.picked === null) return extraMessage("Wähle zuerst eine Antwort.");
    const id = ["fruehstueck", "pyramide", "zucker"][lab.index];
    lab.answers.push(stationNachId[id].check.correct.includes(lab.picked));
    lab.index++;
    lab.picked = null;
    researchState().start = lab.answers;
    save();
    return refreshLab(startCheckBody);
  }
  if (action === "dish-check") {
    lab.checked = true;
    return refreshLab(dishBody);
  }
});
document.addEventListener("input", (event) => {
  const input = event.target;
  if (input.dataset.comicText !== undefined) {
    researchState().comic[Number(input.dataset.comicText)].text = input.value;
    save();
    document.getElementById(
      "comic-print-" + input.dataset.comicText,
    ).textContent = input.value;
    main.querySelector(".save-status").textContent = "Gespeichert.";
  }
});
document.addEventListener("change", (event) => {
  const input = event.target;
  if (input.id === "profile-select") switchProfile(input.value);
  if (input.id === "family-mode") {
    researchState().family = input.value;
    save();
    render(false);
  }
  if (input.id === "explain-topic") location.hash = "erklaeren/" + input.value;
  if (input.dataset.comicScene !== undefined) {
    const i = Number(input.dataset.comicScene),
      scene = Number(input.value);
    researchState().comic[i].scene = scene;
    save();
    const image = document.getElementById("comic-image-" + i);
    image.src = "./assets/" + bilder[scene] + ".webp";
    image.alt = bildtexte[scene];
  }
  if (input.id === "dish") {
    lab.dish = Number(input.value);
    lab.answers = [];
    lab.checked = false;
    refreshLab(dishBody);
  }
  if (input.dataset.dishPart !== undefined) {
    lab.answers[Number(input.dataset.dishPart)] =
      input.value === "" ? null : Number(input.value);
    lab.checked = false;
  }
});

let examLease = null;
let lockRelease = null;
let examLockToken = "";
function releaseExamLock() {
  if (lockRelease) {
    lockRelease();
    lockRelease = null;
  }
  if (examLease) {
    clearInterval(examLease.timer);
    try {
      const lease = JSON.parse(localStorage.getItem(examLease.key) || "null");
      if (lease?.token === examLease.token)
        localStorage.removeItem(examLease.key);
    } catch {}
    examLease = null;
  }
  examLockToken = "";
}
function examControls(enabled) {
  const area = main.querySelector(".exam-route .panel");
  if (!area) return;
  area.querySelectorAll("input,textarea,button").forEach((input) => {
    input.disabled =
      !enabled ||
      (input.id === "written-answer" &&
        main.querySelector("#written-paper")?.checked);
  });
  const notice = document.getElementById("exam-lock-status");
  if (notice)
    notice.innerHTML = enabled
      ? ""
      : "Diese Probearbeit ist in einem anderen Fenster geöffnet. Hier kannst du mitlesen. " +
        labButton("Bearbeitung erneut versuchen", "exam-lock-retry");
}
async function protectExam(useFallback = false) {
  if (route[0] !== "pruefung") {
    releaseExamLock();
    return;
  }
  const token = storageKey + "-exam-" + route[1];
  if (examLockToken === token) {
    examControls(Boolean(lockRelease || examLease));
    return;
  }
  releaseExamLock();
  examLockToken = token;
  examControls(false);
  if (!storageAvailable) {
    lockRelease = () => {};
    examControls(true);
    const status = document.getElementById("exam-lock-status");
    if (status)
      status.textContent =
        "Speicherung und Fensterabgleich sind hier nicht verfügbar. Deine Antworten bleiben während dieser Sitzung erhalten.";
    return;
  }
  if (navigator.locks && !useFallback) {
    navigator.locks
      .request(token, { ifAvailable: true }, async (lock) => {
        if (examLockToken !== token) return;
        if (!lock) {
          examLockToken = "";
          examControls(false);
          return;
        }
        await new Promise((resolve) => {
          lockRelease = resolve;
          examControls(true);
        });
      })
      .catch(() => {
        examLockToken = "";
        protectExam(true);
      });
    return;
  }
  try {
    const now = Date.now(),
      current = JSON.parse(localStorage.getItem(token) || "null");
    if (current?.until > now) {
      examLockToken = "";
      return;
    }
    const owner = crypto.randomUUID();
    localStorage.setItem(
      token,
      JSON.stringify({ token: owner, until: now + 20000 }),
    );
    const check = JSON.parse(localStorage.getItem(token));
    if (check.token !== owner) {
      examLockToken = "";
      return;
    }
    const timer = setInterval(() => {
      try {
        const value = JSON.parse(localStorage.getItem(token) || "null");
        if (value?.token !== owner) {
          releaseExamLock();
          examControls(false);
          return;
        }
        localStorage.setItem(
          token,
          JSON.stringify({ token: owner, until: Date.now() + 20000 }),
        );
      } catch {
        releaseExamLock();
        examControls(false);
      }
    }, 5000);
    examLease = { key: token, token: owner, timer };
    examControls(true);
  } catch {
    examLockToken = "";
    storageAvailable = false;
    protectExam(true);
  }
}
document.addEventListener("click", (event) => {
  if (event.target.closest('[data-lab="exam-lock-retry"]')) protectExam();
});
window.addEventListener("pagehide", releaseExamLock);
function renderEditorial() {
  return labShell(
    "Inhalte und Quellen",
    `<p>Das Verzeichnis ordnet jede Aufgabe einem Lernbereich und einem Schwierigkeitsgrad zu. Ein automatischer Abgleich erkennt nachträglich geänderte Aufgaben.</p><p>Prüfstatus · Redaktionelle Vorlage mit automatischer Strukturprüfung. Eine unabhängige fachliche Freigabe durch eine Lehrkraft ist damit noch offen.</p>
 ${stationen
   .map(
     (s) =>
       `<details><summary>${s.title}</summary><ul>${fragenRegister
         .filter((r) => r.topic === s.id)
         .map(
           (r) =>
             `<li><strong>${r.id}</strong> · Niveau ${r.level}<br>${html(r.question)}<br>Verzeichnisstand ${r.reviewDate}</li>`,
         )
         .join("")}</ul></details>`,
   )
   .join("")}
 <h2>Fachliche Grundlagen</h2><ul>${[...new Set(fragenRegister.flatMap((r) => r.sources))].map((url) => `<li><a href="${url}">${url.includes("ballaststoffe") ? "DGE · Ballaststoffe" : url.includes("wasser") ? "DGE · Wasser" : "BZfE · Ernährungspyramide"}</a></li>`).join("")}</ul>`,
  );
}

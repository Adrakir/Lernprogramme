"use strict";
const ausgabe = "ernaehrung-1";
function examEdition(i, record) {
  const editions = typeof pruefarchiv === "undefined" ? {} : pruefarchiv;
  return (
    editions[record?.edition || ausgabe]?.[i] || {
      ...pruefungen[i],
      written: schriftaufgaben[i],
    }
  );
}
function earnedStars() {
  return (
    stationen.filter((s) => state.done[s.id]).length +
    pruefungen.filter(
      (_, i) =>
        (state.results[i]?.bestPoints ?? state.results[i]?.best ?? 0) >= 6,
    ).length
  );
}
function rewardRoom() {
  const stars = earnedStars(),
    worn = state.equipment || {};
  const entries = Object.entries(ausstattung);
  const gear = entries.filter(
    ([id, p]) => p.slot !== "raum" && worn[p.slot] === id && stars >= p.need,
  );
  const furniture = entries.filter(
    ([id, p]) =>
      p.slot === "raum" && (worn[id] || id === "beanbag") && stars >= p.need,
  );
  const shop = route[1] === "laden",
    clothes = route[1] === "schrank";
  const scene =
    '<div class="bear-dress"><img src="./assets/baerli.webp" alt="Bärli"><svg viewBox="0 0 450 450" aria-hidden="true">' +
    gear.map(([, p]) => p.art).join("") +
    "</svg></div>";
  const items = entries
    .filter(([, p]) => (clothes ? p.slot !== "raum" : p.slot === "raum"))
    .map(([id, p]) => {
      const active =
        p.slot === "raum"
          ? furniture.some(([key]) => key === id)
          : worn[p.slot] === id;
      const art =
        p.slot === "raum"
          ? p.art
          : '<svg viewBox="0 0 450 450" aria-hidden="true"><image href="./assets/baerli.webp" width="450" height="450"/>' +
            p.art +
            "</svg>";
      return (
        '<article class="reward-card">' +
        art +
        "<strong>" +
        p.title +
        "</strong>" +
        (stars < p.need
          ? "<small>Ab " +
            p.need +
            " Sternen · noch " +
            (p.need - stars) +
            "</small>"
          : id === "beanbag"
            ? "<small>Dein Startgeschenk</small>"
            : '<button class="secondary" data-equip="' +
              id +
              '" aria-pressed="' +
              active +
              '">' +
              (active
                ? clothes
                  ? "Ausziehen"
                  : "Einpacken"
                : clothes
                  ? "Anziehen"
                  : "Aufstellen") +
              '<span class="sr-only"> · ' +
              p.title +
              "</span></button>") +
        "</article>"
      );
    })
    .join("");
  return extraShell(
    "Bärlis Forscher&shy;baumhaus",
    '<div class="reward-scene">' +
      scene +
      '<div class="room-items">' +
      furniture
        .map(
          ([, p]) =>
            "<figure>" +
            p.art +
            "<figcaption>" +
            p.title +
            "</figcaption></figure>",
        )
        .join("") +
      "</div></div><p>" +
      (gear.length
        ? "Bärli trägt " + gear.map(([, p]) => p.title).join(", ") + ". "
        : "") +
      "Du hast <strong>" +
      stars +
      ' von 12 Sternen</strong>. Jeder Stationsstern und jede Probearbeit mit mindestens sechs Auswahlpunkten zählt einmal. Freigeschaltete Sachen kannst du beliebig wechseln.</p><div class="actions">' +
      nav("Kleiderschrank", "baumhaus/schrank") +
      nav("💻 Bärli AG Osnabrück", "baumhaus/laden", "primary") +
      nav("Sterne sammeln", "fortschritt") +
      "</div>" +
      (shop || clothes
        ? "<h2>" +
          (shop ? "Baumhaus einrichten" : "Bärli anziehen") +
          '</h2><div class="reward-grid">' +
          items +
          "</div>"
        : ""),
  );
}
const grainParts = [
  [
    "Schale",
    "Die äußeren Schichten schützen das Korn und enthalten viele Ballaststoffe.",
  ],
  [
    "Mehlkörper",
    "Der große innere Teil enthält vor allem Stärke. Sie ist ein Kohlenhydrat.",
  ],
  ["Keimling", "Aus dem Keimling kann eine neue Getreidepflanze wachsen."],
];
function grain() {
  const test = route[1] === "testen";
  return extraShell(
    "Ein Weizenkorn unter der Lupe",
    "<p>" +
      (test
        ? "Ordne den drei Zahlen im Bild die passenden Namen zu."
        : "Wähle eine Zahl. Untersuche das Korn von außen nach innen.") +
      '</p><div class="grain-layout"><svg viewBox="0 0 260 230" role="img" aria-label="Längsschnitt. 1 zeigt auf den dünnen Außenrand, 2 auf die große Mitte und 3 auf den kleinen Teil am unteren Ende."><path data-layer="0" fill="#bf8543" d="M105 214C40 214 29 158 52 101Q79 26 189 12Q215 77 193 134Q163 207 105 214Z"/><path data-layer="1" fill="#f8df9c" d="M98 201Q44 187 64 111Q87 42 182 26Q200 86 180 135Q146 198 98 201Z"/><path data-layer="2" fill="#88a36c" d="M72 193Q66 150 94 139Q112 147 100 181Q93 208 72 193Z"/><g fill="none" stroke="#453a34" stroke-width="2"><path d="M190 47h38"/><path d="M126 100h100"/><path d="M85 174h141"/></g><g font-size="19" fill="currentColor"><text x="232" y="53">1</text><text x="232" y="106">2</text><text x="232" y="180">3</text></g></svg><div>' +
      grainParts
        .map(([name], i) =>
          test
            ? "<label>Teil " +
              (i + 1) +
              ' <select data-grain="' +
              i +
              '"><option value="">Bitte wählen</option>' +
              [2, 0, 1]
                .map(
                  (n) =>
                    '<option value="' +
                    n +
                    '">' +
                    grainParts[n][0] +
                    "</option>",
                )
                .join("") +
              "</select></label>"
            : '<button class="secondary" data-grain-part="' +
              i +
              '">' +
              (i + 1) +
              " · " +
              name +
              "</button>",
        )
        .join("") +
      '</div></div><p role="status" id="grain-note"></p><div class="actions">' +
      (test
        ? '<button class="primary" data-grain-check>Beschriftung prüfen</button>' +
          nav("Noch einmal untersuchen", "korn")
        : nav("Jetzt selbst beschriften", "korn/testen", "primary")) +
      "</div>",
  );
}
const words = [
  [
    "Ballaststoffe",
    "Teile aus pflanzlichen Lebensmitteln, die die Verdauung unterstützen.",
    3,
  ],
  [
    "Kohlenhydrate",
    "Nährstoffe, die Energie liefern. Eine Form davon ist die Stärke im Brot.",
    3,
  ],
  [
    "Eiweiß",
    "Ein Baustoff für deinen Körper. Eiweiß steckt zum Beispiel in Linsen.",
    7,
  ],
  [
    "Mineralstoffe",
    "Dazu gehört Calcium. Dein Körper braucht es für Knochen und Zähne.",
    4,
  ],
  [
    "Vitamine",
    "Sie helfen dem Körper bei vielen Aufgaben. In Möhren steckt eine Vorstufe von Vitamin A.",
    2,
  ],
  [
    "Fett",
    "Fett liefert Energie. Dein Körper kann Energie als Körperfett speichern.",
    5,
  ],
  [
    "Vollkorn",
    "Das ganze Getreidekorn mit seinen äußeren Schichten und dem Keimling.",
    6,
  ],
  [
    "Flüssigkeit",
    "Wasser ist eine Flüssigkeit. Im Blut hilft es, Stoffe durch den Körper zu transportieren.",
    0,
  ],
];
function glossary(text) {
  const matches = words.filter(([word]) =>
    text.toLowerCase().includes(word.toLowerCase()),
  );
  return (
    '<details class="word-help"><summary>Ein Wort nachschlagen</summary>' +
    (matches.length ? matches : words)
      .map(
        ([name, desc, img]) =>
          '<details id="wort-' +
          words.findIndex(([w]) => w === name) +
          '"><summary>' +
          name +
          "</summary>" +
          foodPicture(img) +
          "<p>" +
          desc +
          "</p>" +
          (hasSpeech
            ? '<button class="secondary" data-say="' +
              html(name + ". " + desc) +
              '">Wort und Erklärung anhören</button>'
            : "") +
          "</details>",
      )
      .join("") +
    "</details>"
  );
}
const pictureClues = {
  fit: [
    [0, "Was hilft dir, wenn du beim Spielen Durst bekommst?"],
    [0, "Stell dir eine ruhige Trinkpause auf der Bank vor."],
    [
      3,
      "Brot ist Getreide. Was könntest du aus einer anderen Gruppe dazulegen?",
    ],
    [0, "Zum Spielen gehört auch Zeit für eine Trinkpause."],
    [
      0,
      "Beim Seilspringen kann dir warm werden. Was tut dir in der Pause gut?",
    ],
    [1, "Ein Apfel passt in die Tasche. Was brauchst du bei Durst?"],
  ],
  labor: [
    [7, "Linsen liefern einen Baustoff für Muskeln."],
    [
      4,
      "Joghurt liefert einen Baustoff. Auch manche Hülsenfrüchte enthalten ihn.",
    ],
    [
      4,
      "In Joghurt steckt ein Mineralstoff, der Knochen und Zähne unterstützt.",
    ],
    [3, "Brot liefert Energie. Fühle einmal deinen Puls, während du sitzt."],
    [0, "Auch nachts schlägt dein Herz und du atmest weiter."],
    [
      7,
      "Linsen liefern Eiweiß. Denke an den Unterschied zwischen Baustoff und Energielieferant.",
    ],
  ],
  ballast: [
    [
      6,
      "Vollkornhafer ist pflanzlich. Welche anderen Pflanzenprodukte kennst du?",
    ],
    [
      7,
      "Linsen liefern Ballaststoffe. Verfolge in Gedanken ihren Weg vom Mund in den Bauch.",
    ],
    [0, "Einige Ballaststoffe können Wasser binden."],
    [2, "Möhren liefern Ballaststoffe. Welches Getreideprodukt passt dazu?"],
    [3, "In Vollkornbrot stecken die äußeren Kornschichten."],
    [6, "Vergleiche: Was ist bei Vollkorn vom Getreidekorn erhalten?"],
  ],
  pyramide: [
    [4, "Woraus wird Joghurt hergestellt?"],
    [3, "Brot und Kartoffeln stehen im selben Pyramidenfeld."],
    [
      8,
      "Schokolade ist ein Extra. Welche zweite Auswahl passt in diese Gruppe?",
    ],
    [
      2,
      "Möhren stehen im grünen Bereich. Welche Mengen empfiehlt das Modell dort?",
    ],
    [
      5,
      "Käse und Butter entstehen aus Milch. In der Pyramide zählt Butter zu den Fetten.",
    ],
    [1, "Obst und süße Extras haben verschiedene Plätze."],
  ],
  fruehstueck: [
    [
      4,
      "Joghurt ergänzt Brot und Wasser um einen Baustein. Welche Pflanzengruppe fehlt?",
    ],
    [6, "Hafer wächst auf dem Feld und bildet Körner."],
    [0, "Ein Durstlöscher kann ganz ohne Zucker auskommen."],
    [
      3,
      "Brot deckt nur einen Baustein ab. Suche auch Obst oder Gemüse, Milchprodukt und Getränk.",
    ],
    [4, "Joghurt liefert einen Baustein. Finde drei andere dazu."],
    [3, "Welcher Baustein kommt aus Getreide?"],
  ],
  zucker: [
    [
      0,
      "Denke an zwei gleich volle Gläser. In welchem steckt die größere Zuckerzahl?",
    ],
    [1, "Auch Zucker aus Früchten zählt zum gesamten Zucker."],
    [
      0,
      "Stell zwei gleich große Gläser nebeneinander und addiere ihre Mengen.",
    ],
    [0, "Denke an gleich große Gläser. Auf welche Mengenangabe kommt es an?"],
    [0, "Beide Zahlen gelten für dieselbe Menge. Welche Zahl ist kleiner?"],
    [0, "Zweihundert Milliliter füllen zwei Gläser zu je hundert Millilitern."],
  ],
  geschichte: [
    [2, "Möhren sind Gemüse. Auf welcher Farbstufe liegen sie?"],
    [0, "Wasser wäre ein Getränk. Welche Obst- oder Gemüsezutat passt dazu?"],
    [0, "Eine Trinkpause auf der Bank unterbricht das Rennen."],
    [
      5,
      "Käse steht für einen der vier Bausteine. Ordne auch die anderen drei zu.",
    ],
    [
      1,
      "Ein Apfel steht für Obst oder Gemüse. Welche Gruppen deckt der Rest ab?",
    ],
    [
      2,
      "Möhre und Birne unterscheiden sich. Haben sie im Frühstücksmodell denselben Platz?",
    ],
  ],
};
function pictureClue(station, q) {
  const tasks = [...station.practice, station.check, ...nachfragen[station.id]];
  const [img, caption] = pictureClues[station.id][tasks.indexOf(q)];
  return foodPicture(img, "lesson-picture") + "<span>" + caption + "</span>";
}
function linkedQuestion(question) {
  return question.replace(
    new RegExp(words.map(([w]) => w).join("|"), "gi"),
    (match) => {
      const index = words.findIndex(
        ([w]) => w.toLowerCase() === match.toLowerCase(),
      );
      return (
        '<button type="button" class="word-link" data-open-word="' +
        index +
        '">' +
        match +
        "</button>"
      );
    },
  );
}
function sandwich() {
  return extraShell(
    "Sterns belegtes Brot",
    foodPicture(3, "lesson-picture") +
      '<p>Auf dem Brett liegt Vollkornbrot. Wähle einen Belag und sage voraus, welche Gruppe dazukommt.</p><label>Belag <select id="topping"><option value="5">Käse</option><option value="2">Möhrenstreifen</option><option value="7">Linsenaufstrich aus Linsen und Wasser</option></select></label><label>Meine Vermutung <select id="prediction"><option value="">Gruppe wählen</option>' +
      [3, 4, 6]
        .map(
          (i) => '<option value="' + i + '">' + gruppen[i].name + "</option>",
        )
        .join("") +
      '</select></label><button data-top-check class="primary">Brot belegen und vergleichen</button><div id="sandwich-result" role="status"></div>',
    "stern",
  );
}
const boardTopics = {
  labor: [
    "Bärli isst vor dem Radfahren Brot. Was kann sein Körper aus der Stärke im Brot gewinnen?",
    3,
    "Energie. Stärke gehört zu den Kohlenhydraten.",
    "Was verbraucht auch beim Sitzen Energie?",
    "Wofür speichert der Körper Energie?",
  ],
  ballast: [
    "Welche Teile des Korns sind im Vollkornbrot mitverarbeitet?",
    3,
    "Auch die äußeren Schichten und der Keimling sind dabei.",
    "Wo stecken viele Ballaststoffe?",
    "Wie helfen sie dem Darm?",
  ],
  fruehstueck: [
    "Auf dem Tisch stehen Wasser, Brot und Käse. Was könnte den vierten Baustein ergänzen?",
    1,
    "Zum Beispiel Apfel, Möhre oder Gurke. Sie gehören zu Obst und Gemüse.",
    "Warum passen verschiedene Antworten?",
    "Was könntest du gegen Käse tauschen?",
  ],
};
function classroom() {
  const id = Object.hasOwn(boardTopics, route[1]) ? route[1] : "labor",
    [q, img, answer, a, b] = boardTopics[id];
  return extraShell(
    "Eine Frage für die Klasse",
    '<div class="actions">' +
      Object.keys(boardTopics)
        .map((k) => nav(stationNachId[k].short, "tafel/" + k))
        .join("") +
      "</div>" +
      foodPicture(img, "lesson-picture") +
      "<h2>" +
      q +
      "</h2><details><summary>Lösung und Gespräch öffnen</summary><p>" +
      answer +
      "</p><ol><li>" +
      a +
      "</li><li>" +
      b +
      "</li></ol></details>",
  );
}
function teaching() {
  const sheets = [
    [
      "Was mein Körper braucht",
      "Nährstoffe und Körperaufgaben verbinden",
      "station/labor/2/zuordnen",
      "labor",
    ],
    [
      "Energie im Alltag",
      "Hunger und Sättigung im Modell beschreiben",
      "station/labor/2/kreislauf",
      "labor",
    ],
    [
      "Das Getreidekorn",
      "Schale, Mehlkörper und Keimling erkennen",
      "korn",
      "ballast",
    ],
    [
      "Mein Frühstück",
      "Vier verschiedene Bausteine zusammenstellen",
      "fruehstueck-frei",
      "fruehstueck",
    ],
  ];
  return extraShell(
    "Für den Unterricht",
    sheets
      .map(
        ([title, goal, to, topic]) =>
          "<article><h2>" +
          title +
          "</h2><p>" +
          goal +
          '</p><div class="actions">' +
          nav("Übung öffnen", to) +
          nav("Abschlussfrage zeigen", "tafel/" + topic) +
          "</div></article>",
      )
      .join("") +
      "<h2>Schreibantworten besprechen</h2><p>Warum kann Vollkornbrot der Verdauung helfen?</p>" +
      [
        [
          "„Ich esse Brot.“",
          "Ein Beispiel ist da. Welche Brotsorte meinst du?",
        ],
        [
          "„Im Vollkornbrot sind Ballaststoffe.“",
          "Der Fachbegriff passt. Was bewirken die Ballaststoffe?",
        ],
        [
          "„Vollkornbrot enthält Ballaststoffe. Sie helfen meinem Darm bei der Verdauung.“",
          "Die Antwort verbindet das Lebensmittel, den Nährstoff und seine Aufgabe.",
        ],
      ]
        .map(
          ([a, b]) =>
            "<details><summary>" + a + "</summary><p>" + b + "</p></details>",
        )
        .join("") +
      nav("Antwortmuster im Lernbericht", "bericht"),
  );
}
function kitchen() {
  return extraShell(
    "Vollkorn in unserer Küche",
    '<p><strong>Ihr braucht</strong> zwei Getreideverpackungen mit Zutatenliste, etwa Brot und Nudeln.</p><ol><li>Sucht auf beiden Packungen die Zutatenliste.</li><li>Lest euch die Namen der Getreidezutaten vor. Wo steht das Wort Vollkorn?</li><li>Beschreibt einen Unterschied mit eigenen Worten.</li></ol><details open><summary>Mögliche Beobachtung</summary><p>Auf einer Packung steht „Vollkornweizenmehl“, auf der anderen „Weizenmehl“. Die Farbe allein verrät uns das nicht.</p></details><div class="print-controls">' +
      labButton("Küchenkarte drucken", "print") +
      "</div>",
  );
}
function five() {
  return extraShell(
    "Heute fünf Minuten",
    '<div id="five-step"><p>1 von 3 · Schau genau hin</p>' +
      foodPicture(6, "lesson-picture") +
      "<h2>Was siehst du auf der Bildkarte?</h2>" +
      miniChoices(
        ["Haferflocken", "Linsen"],
        0,
        "Hier siehst du Haferflocken. Sie gehören zum Getreide.",
        "five-next",
      ) +
      "</div>",
  );
}
function miniChoices(options, right, explain, next) {
  return (
    '<div class="actions">' +
    options
      .map(
        (o, i) =>
          '<button class="secondary" data-mini="' +
          (i === right) +
          '" data-reason="' +
          html(explain) +
          '" data-next="' +
          next +
          '">' +
          html(o) +
          "</button>",
      )
      .join("") +
    '</div><div role="status" class="mini-status"></div>'
  );
}
function transfer() {
  const i = Number(route[1]) - 1,
    j = Number(route[2]),
    result = state.results[i],
    old = examEdition(i, result)?.tasks[j];
  if (!old || !result) return renderMissing();
  const [id, q] = old,
    follow = stationNachId[id].practice[j % stationNachId[id].practice.length];
  return extraShell(
    "Noch einmal knacken",
    "<details open><summary>Meine frühere Aufgabe</summary><p>" +
      q.text +
      "</p><p>Du hast gewählt: " +
      answerText(q, result.answers[j]) +
      "</p><p>" +
      q.why +
      "</p></details><h2>Ein anderes Beispiel</h2>" +
      questionMarkup(follow, []) +
      '<button class="primary" data-transfer>Antwort vergleichen</button><p class="mini-status" role="status"></p>' +
      nav("Zurück zu meinen Lösungen", "ergebnis/" + (i + 1)),
  );
}
function observations() {
  const ans = state.bodyEvidence;
  if (!ans?.some(Boolean))
    return "<p>Für diese Zuordnung ist noch kein Versuch gespeichert.</p>";
  const empty = ans.filter((x) => !x).length;
  return (
    "<ul>" +
    koerperZuordnung
      .map(
        (t, i) =>
          "<li>" +
          html(t.aufgabe) +
          " → " +
          (ans[i]
            ? html(ans[i]) +
              (ans[i] === t.stoff ? " ✓" : " · passend wäre " + t.stoff)
            : "offengelassen") +
          (state.bodyHints?.[i]?" · Hinweisstufe "+state.bodyHints[i]+" geöffnet":"") + "</li>",
      )
      .join("") +
    "</ul><p>" +
    (ans[0] === "Fett" && ans[2] === "Kohlenhydrate"
      ? "Im Arbeitsblatt sind Bewegung und Energiereserve vertauscht. Frag nach: Welches Beispiel meint eine Reserve für später? "
      : "") +
    (empty
      ? empty + " offene Zuordnung(en)."
      : "Alle Felder wurden beantwortet.") +
    "</p>"
  );
}
function parentPrompts() {
  return "<details><summary>Wie frage ich bei einer Verwechslung nach?</summary><p>„Brot ist ein Kohlenhydrat.“ → „Brot ist das Lebensmittel. Welchen Nährstoff liefert seine Stärke?“</p><p>„Dunkles Brot ist immer Vollkorn.“ → „Welche Getreidezutat findest du auf der Packung?“</p><p>„Saft hat gar keinen Zucker.“ → „Was steht bei davon Zucker je 100 ml?“</p></details>";
}
function importProfile() {
  if (!extra.imported) return;
  const list = profileList(),
    msg = document.getElementById("settings-status");
  if (list.length >= 12) {
    msg.textContent = "Alle zwölf Profilplätze sind belegt.";
    return;
  }
  const id = "kind-" + crypto.randomUUID(),
    name = extra.importName || "Importierter Lernstand";
  try {
    localStorage.setItem(
      "majas-sachunterricht-v1-" + id,
      JSON.stringify(extra.imported),
    );
    localStorage.setItem(
      profilRegisterKey,
      JSON.stringify([...list.slice(1), { id, name }]),
    );
    switchProfile(id);
    location.hash = "forscherheft";
  } catch {
    msg.textContent = "Das neue Profil konnte nicht gespeichert werden.";
  }
}
function equipmentClick(b) {
  const id = b.dataset.equip,
    p = ausstattung[id];
  if (!p || earnedStars() < p.need || id === "beanbag") return;
  const items = (state.equipment ??= {});
  const slot = p.slot === "raum" ? id : p.slot;
  if (items[slot] === id) delete items[slot];
  else items[slot] = id;
  save();
  render(false);
  main.querySelector('[data-equip="' + id + '"]')?.focus();
}
document.addEventListener("click", (event) => {
  const b = event.target.closest("button");
  if (!b) return;
  if (b.hasAttribute("data-open-word")) {
    const detail = document.getElementById("wort-" + b.dataset.openWord);
    if (detail) {
      detail.closest(".word-help").open = true;
      detail.open = true;
      detail.querySelector("summary").focus();
    }
    return;
  }
  if(b.hasAttribute("data-pizza-check")){
    const selected=[...main.querySelectorAll("[data-pizza]:checked")];
    const why=document.getElementById("pizza-why").value.trim();
    document.getElementById("pizza-note").textContent=!selected.length?"Wähle mindestens einen Belag.":selected.some(el=>el.dataset.pizza==="3")?"Käse gehört zu den Milchprodukten. Welche deiner Zutaten sind Gemüse?":(why?"Deine Auswahl passt. Vergleiche deine Begründung: ":"Deine Auswahl passt. Erkläre mit eigenen Worten. ")+"Tomate, Paprika und Zucchini gehören beim Essen zur Gemüsegruppe. Eine oder mehrere davon passen.";
    return;
  }
  if (b.hasAttribute("data-equip")) return equipmentClick(b);
  if (b.hasAttribute("data-new-import")) return importProfile();
  if (b.hasAttribute("data-grain-part")) {
    const n = Number(b.dataset.grainPart);
    document
      .querySelectorAll("[data-layer]")
      .forEach((el) =>
        el.classList.toggle("grain-selected", el.dataset.layer === String(n)),
      );
    document
      .querySelectorAll("[data-grain-part]")
      .forEach((el) => el.setAttribute("aria-pressed", String(el === b)));
    document.getElementById("grain-note").textContent =
      grainParts[n].join(" · ");
  }
  if (b.hasAttribute("data-grain-check")) {
    const selects = [...main.querySelectorAll("[data-grain]")],
      wrong = selects.filter((s) => s.value !== s.dataset.grain);
    selects.forEach((s) =>
      s.setAttribute("aria-invalid", String(wrong.includes(s))),
    );
    document.getElementById("grain-note").textContent = wrong.length
      ? "Schau noch einmal auf Teil " +
        wrong.map((s) => Number(s.dataset.grain) + 1).join(", ") +
        "."
      : "Richtig beschriftet: Schale, Mehlkörper und Keimling.";
    wrong[0]?.focus();
  }
  if (b.hasAttribute("data-say") && hasSpeech) {
    stopSpeech();
    const u = new SpeechSynthesisUtterance(b.dataset.say);
    u.lang = "de-DE";
    u.rate = state.preferences.rate;
    u.voice =
      speechSynthesis
        .getVoices()
        .find((v) => v.voiceURI === state.preferences.voice) || null;
    speechSynthesis.speak(u);
  }
  if (b.hasAttribute("data-top-check")) {
    const i = Number(document.getElementById("topping").value),
      guess = document.getElementById("prediction").value;
    document.getElementById("sandwich-result").innerHTML =
      guess === ""
        ? "Wähle zuerst deine Vermutung."
        : foodPicture(3, "lesson-picture") +
          foodPicture(i) +
          "<p>" +
          (guess === String(foodCards[i].group)
            ? "Deine Vorhersage stimmt."
            : "Vergleiche mit deiner Vorhersage.") +
          " " +
          foodCards[i].name +
          " ergänzt die Gruppe " +
          gruppen[foodCards[i].group].name +
          ".</p>";
  }
  if (b.hasAttribute("data-transfer")) {
    const i = Number(route[1]) - 1,
      j = Number(route[2]),
      [id] = examEdition(i, state.results[i]).tasks[j],
      list = stationNachId[id].practice,
      q = list[j % list.length];
    const chosen = [...main.querySelectorAll("input[name=answer]:checked")].map(
      (el) => Number(el.value),
    );
    main.querySelector(".mini-status").textContent = !chosen.length
      ? "Wähle eine Antwort."
      : (istRichtig(q, chosen) ? "Richtig. " : "Vergleiche deine Wahl. ") +
        q.why;
  }
  if (b.hasAttribute("data-mini")) {
    main.querySelector(".mini-status").innerHTML =
      (b.dataset.mini === "true" ? "Richtig. " : "Schau noch einmal hin. ") +
      html(b.dataset.reason) +
      ' <button class="primary" data-' +
      b.dataset.next +
      ">Weiter</button>";
    main.querySelector(".mini-status button").focus();
  }
  if (
    b.hasAttribute("data-five-next") ||
    b.hasAttribute("data-five-explain") ||
    b.hasAttribute("data-five-end")
  ) {
    const step = document.getElementById("five-step");
    if (b.hasAttribute("data-five-next"))
      step.innerHTML =
        "<h2>2 von 3 · Ergänze das Müsli</h2><p>Welche Zutat ergänzt die Haferflocken mit Obst?</p>" +
        miniChoices(
          ["Käse", "Apfelstücke", "Wasser"],
          1,
          "Apfelstücke sind Obst.",
          "five-explain",
        );
    else if (b.hasAttribute("data-five-explain"))
      step.innerHTML =
        '<h2>3 von 3 · Erkläre es jemandem</h2><p>Was können die Ballaststoffe aus Vollkornhafer und Apfel in deinem Körper tun? Erkläre es laut.</p><details><summary>Beispiel ansehen</summary><p>Sie unterstützen die Verdauung im Darm.</p></details><button class="primary" data-five-end>Runde beenden</button>';
    else
      step.innerHTML =
        "<h2>Für heute geschafft!</h2><p>Du hast Hafer erkannt, ein Müsli ergänzt und erklärt, wie Ballaststoffe helfen.</p>" +
        nav("Zur Startseite", "start");
    const heading = step.querySelector("h2");
    heading.tabIndex = -1;
    heading.focus();
  }
});

// Notes and the learning path have separate durable records. Updating one never
// overwrites the other, even when two tabs save the older full profile together.
const independentFields = ["notes", "plan"];
let fieldBaseline = {};
function readFieldRecords() {
  const r = researchState();
  for (const key of independentFields) {
    const value = localStorage.getItem(storageKey + "-field-" + key);
    if (value) {
      try {
        const clean = { results: {} };
        normalizeResearch({ research: { [key]: JSON.parse(value) } }, clean);
        r[key] = clean.research[key];
      } catch {}
    }
    fieldBaseline[key] = JSON.stringify(r[key]);
  }
}
function persistFieldChanges(replace) {
  const r = researchState();
  for (const key of independentFields) {
    const value = JSON.stringify(r[key]);
    if (replace || value !== fieldBaseline[key]) {
      localStorage.setItem(storageKey + "-field-" + key, value);
      fieldBaseline[key] = value;
    }
  }
  readFieldRecords();
}

const matchingClues = [
  ["Denke daran, was die Muskeln bei Bewegung brauchen.",3,"Die Stärke im Brot liefert Energie."],
  ["Gesucht ist eine Stoffgruppe. Calcium gehört dazu.",4,"Naturjoghurt liefert Calcium für Knochen und Zähne."],
  ["Was kann der Körper für später aufbewahren?",5,"Käse enthält unter anderem Fett. Auch der Körper kann Energie als Fett speichern."],
  ["Was im Blut hilft, gelöste Stoffe zu befördern?",0,"Wasser ist der größte Bestandteil des Blutplasmas."],
  ["Beim Wachsen braucht der Körper Baustoffe.",7,"Linsen liefern einen Baustoff für Muskeln."],
  ["Verschiedene Stoffe aus Obst und Gemüse helfen der Körperabwehr.",2,"Möhren liefern eine Vorstufe von Vitamin A."],
  ["Denke an die äußeren Schichten eines Getreidekorns.",6,"Vollkornhafer liefert Stoffe, die deinem Darm helfen."]
];
function bodyHint(row,stage){
  const [clue,picture,caption]=matchingClues[row];
  return '<button type="button" class="subtle-button" id="body-hint-'+row+'" data-do="body-hint" data-value="'+row+'" aria-label="Bärlis Hinweis zu Aufgabe '+(row+1)+'">Bärlis Hinweis · '+Math.min(stage+1,3)+'/3</button>'+
    (stage?'<div class="reveal" role="status">'+[clue,foodPicture(picture,"lesson-picture")+'<p>'+caption+'</p>',koerperZuordnung[row].grund][stage-1]+'</div>':'');
}

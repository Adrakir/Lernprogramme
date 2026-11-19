"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");
const root = __dirname;
const context = vm.createContext({
  document: { addEventListener() {} },
  window: { addEventListener() {} },
});
vm.runInContext(
  fs.readFileSync(path.join(root, "stoff.js"), "utf8") +
    "\n" +
    fs.readFileSync(path.join(root, "lernen.js"), "utf8") +
    "\n" +
    fs.readFileSync(path.join(root, "forschen.js"), "utf8") +
    "\nthis.inhalte={stationen,pruefungen,nachfragen,schriftaufgaben,baerliFaelle,alltagsauftraege,gerichte};",
  context,
);
const sources = [
  "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
  "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
  "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken",
];
const records = [];
function add(id, topic, level, q) {
  records.push({
    id,
    topic,
    level,
    question: q.text,
    contentHash: crypto
      .createHash("sha256")
      .update(JSON.stringify(q))
      .digest("hex"),
    sources,
    reviewDate: "2026-11-19",
    reviewStatus: "Redaktionelle Vorlage; automatische Strukturprüfung",
  });
}
const d = context.inhalte;
for (const s of d.stationen) {
  s.practice.forEach((q, i) => add(s.id + "-uebung-" + i, s.id, 1, q));
  add(s.id + "-check", s.id, 2, s.check);
  d.nachfragen[s.id].forEach((q, i) =>
    add(s.id + "-transfer-" + i, s.id, 2, q),
  );
}
d.pruefungen.forEach((exam, i) => {
  exam.tasks.forEach(([topic, q], j) =>
    add("arbeit-" + i + "-" + j, topic, 2, q),
  );
  d.schriftaufgaben[i].forEach((q, j) =>
    add("schreiben-" + i + "-" + j, "uebergreifend", 3, q),
  );
});
d.baerliFaelle.forEach((q, i) =>
  add("baerli-" + i, q.id, 2, {
    text: q.text + " " + q.frage,
    options: q.options,
    correct: [q.correct],
    why: q.why,
  }),
);
Object.entries(d.alltagsauftraege).forEach(([id, task]) =>
  add(id + "-alltag", id, 3, { text: task[1], beispiel: task[2] }),
);
d.gerichte.forEach((dish, i) =>
  add("gericht-" + i, "pyramide", 3, {
    text: "Zerlege " + dish.name + " in seine Zutaten.",
    parts: dish.parts,
  }),
);
const output =
  '"use strict";\n// Mit node redaktion-bauen.cjs aus den Aufgaben erzeugen.\nconst fragenRegister = ' +
  JSON.stringify(records, null, 2) +
  ";\n";
const target = path.join(root, "redaktion.js");
if (process.argv.includes("--check")) {
  if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== output)
    throw Error(
      "Das redaktionelle Verzeichnis ist veraltet. Mit node sachunterricht-maja/redaktion-bauen.cjs aktualisieren.",
    );
  console.log(
    records.length +
      " Aufgaben mit Lernbereich, Niveau, Quellen und Prüfstatus abgeglichen.",
  );
} else fs.writeFileSync(target, output);

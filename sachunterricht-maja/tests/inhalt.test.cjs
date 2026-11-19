"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({
  document: { addEventListener() {} },
  window: { addEventListener() {} },
  console, Date, setTimeout, URL, Blob,
});
vm.runInContext(fs.readFileSync(path.join(root, "stoff.js"), "utf8") + "\n" +
  fs.readFileSync(path.join(root, "lernen.js"), "utf8") + "\n" + fs.readFileSync(path.join(root, "forschen.js"), "utf8") +
  "\nthis.data = {stationen,pruefungen,schriftaufgaben,koerperZuordnung,nachfragen,foodCards,normalizeState,standardState,selectionPoints};", context);
const data = context.data;

test("Alle Aufgaben und Zuordnungen haben gültige Lösungen und Erklärungen", () => {
  const texts = new Set();
  for (const s of data.stationen) {
    const tasks = [...s.practice, s.check, ...data.nachfragen[s.id]];
    for (const q of tasks) {
      assert.ok(q.text && q.why);
      assert.ok(q.correct.length > 0 && q.correct.length < q.options.length);
      assert.equal(new Set(q.correct).size, q.correct.length);
      assert.ok(q.correct.every(i => Number.isInteger(i) && i >= 0 && i < q.options.length));
      assert.ok(!texts.has(q.text), "Doppelte Aufgabe: " + q.text);
      texts.add(q.text);
    }
  }
  assert.equal(data.koerperZuordnung.map(q => q.buchstabe).join(""), "KALORIE");
  data.pruefungen.forEach((exam, i) => {
    assert.equal(exam.tasks.length, 8);
    assert.equal(data.schriftaufgaben[i].length, 2);
    for (const [id, q] of exam.tasks) {
      assert.ok(data.stationen.some(s => s.id === id));
      assert.ok(q.why && q.correct.every(n => q.options[n] !== undefined));
      assert.ok(!texts.has(q.text), "Doppelte Aufgabe: " + q.text);
      texts.add(q.text);
    }
    for (const q of data.schriftaufgaben[i]) assert.ok(q.beispiel && q.kriterien.length === 2);
  });
});

test("Alle Bilder und Offline-Dateien sind lokal vorhanden", () => {
  const sources = ["app.js", "lernen.js", "forschen.js", "stoff.js", "index.html"].map(file => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
  const assets = [...sources.matchAll(/(?:src|href)="\.\/([^"$]+)"/g)].map(match => match[1].split("?")[0]);
  for (const asset of assets) assert.ok(fs.existsSync(path.join(root, asset)), asset);
  for (const food of data.foodCards) assert.ok(fs.existsSync(path.join(root, "assets/essen-" + food.key + ".webp")));
  const worker = fs.readFileSync(path.join(root, "sw.js"), "utf8");
  const manifest = worker.match(/const appFiles = (\[[\s\S]+?\]);/)[1];
  for (const file of JSON.parse(manifest)) assert.ok(fs.existsSync(path.join(root, file.split("?")[0])), file);
  for (const asset of fs.readdirSync(path.join(root, "assets"))) {
    if (asset.endsWith(".webp")) assert.ok(JSON.parse(manifest).includes("./assets/" + asset), asset + " fehlt offline");
  }
});

test("Alte Entwürfe, Sterne und Antworten werden übernommen", () => {
  const legacy = {
    done: { fit: true }, drafts: { "exam-0": { index: 6, answers: data.pruefungen[0].tasks.map(([,q]) => [...q.correct]) }},
    results: { "0": { score: 8, best: 8, answers: data.pruefungen[0].tasks.map(([,q]) => [...q.correct]) }},
    last: "fit", theme: "dark",
  };
  const saved = data.normalizeState(legacy);
  assert.equal(saved.done.fit, true);
  assert.equal(saved.drafts["exam-0"].index, 6);
  assert.equal(saved.drafts["exam-0"].written.length, 2);
  assert.equal(saved.results[0].score, 8);
  assert.equal(saved.theme, "dark");
  assert.equal(saved.schema, 3);
});

test("Beschädigte Teilfelder werden bereinigt und fremde Versionen abgewiesen", () => {
  const bad = { done: { fit: true, unknown: true }, drafts: { fit: 99, "exam-0": { index: 888, answers: [[-3, 99, "1", 0, 0]], written: [{ text: "x".repeat(2000) }] } }, results: { "0": { answers: [] } }, checkNext: { fit: 9 }, preferences: { size: 999, rate: -1 }, criteria: { "__proto__": true } };
  const clean = data.normalizeState(bad);
  assert.equal(clean.done.unknown, undefined);
  assert.equal(clean.drafts.fit, undefined);
  assert.equal(clean.drafts["exam-0"].index, 9);
  assert.equal(clean.drafts["exam-0"].answers[0].length, 1);
  assert.equal(clean.drafts["exam-0"].written[0].text.length, 1200);
  assert.equal(clean.results[0], undefined);
  assert.equal(clean.preferences.size, 100);
  assert.throws(() => data.normalizeState({ schema: 99 }));
  assert.throws(() => data.normalizeState(null));
});

test("Textfarben erreichen auf Lernflächen auch im dunklen Design 4,5:1", () => {
  const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
  function luminance(hex) {
    const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
    return channels.reduce((sum, c, i) => sum + c * [.2126, .7152, .0722][i], 0);
  }
  for (const [, block] of [...css.matchAll(/:root(?:\[data-theme="dark"\])?\s*\{([^}]+)/g)].slice(0, 2)) {
    const colors = Object.fromEntries([...block.matchAll(/--([a-z-]+):\s*(#[a-fA-F0-9]{6})/g)].map(m => [m[1], m[2]]));
    for (const fg of ["ink", "muted"]) for (const bg of ["page", "paper", "hero", "salbei", "sand", "flieder", "pfirsich", "blau", "success", "retry"]) {
      const values = [luminance(colors[fg]), luminance(colors[bg])].sort((a, b) => a - b);
      assert.ok((values[1] + .05) / (values[0] + .05) >= 4.5, fg + " auf " + bg);
    }
  }
});

test("Teilpunkte honorieren richtige Teilantworten und bestrafen wahlloses Ankreuzen", () => {
  const exam={tasks:[["fit",{correct:[0,2],options:["a","b","c","d"]}]]};
  assert.equal(data.selectionPoints(exam,[[0]]),.5);
  assert.equal(data.selectionPoints(exam,[[0,2]]),1);
  assert.equal(data.selectionPoints(exam,[[0,1,2,3]]),0);
  assert.equal(data.selectionPoints(exam,[[1,3]]),0);
});

test("Forscherheft, Comic und Lernweg überstehen Sicherung und Bereinigung", () => {
  const state=data.normalizeState({done:{},drafts:{},results:{},research:{
    notes:[{text:"Mein Merksatz",food:2}],
    comic:[{scene:2,text:"Wir vergleichen die Angaben."}],
    plan:["fit","fit","fremd","zucker","labor","ballast"],
    history:[{id:"zucker",at:123,correct:true,later:true}],
    family:"laktosefrei",
  }});
  assert.equal(state.research.notes[0].text,"Mein Merksatz");
  assert.equal(state.research.comic[0].scene,2);
  assert.deepEqual(Array.from(state.research.plan),["fit","zucker","labor"]);
  assert.equal(state.research.history[0].later,true);
});

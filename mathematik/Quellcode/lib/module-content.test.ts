import {test} from 'node:test';
import assert from 'node:assert/strict';
import {modulInhalte} from './module-content.ts';
import {buildModuleTest} from './module-test.ts';
import {makeProblem, correct, isComplete, type Topic} from './math.ts';
import {areas, taskIds} from './tasks.ts';

const topics: Topic[] = ['data', 'numbers', 'round', 'mental', 'line', 'units', 'stats', 'arithmetic', 'divisibility', 'geometry', 'measure', 'fractions', 'decimals', 'angles', 'symmetry', 'solids'];

test('jedes Modul hat Hilfen und drei geprüfte Vertiefungsaufgaben', () => {
  for (const t of topics) {
    const m = modulInhalte[t];
    assert.ok(m, t);
    assert.ok(m.hilfe.merksaetze.length >= 3, `${t}: Merksätze`);
    assert.ok(m.hilfe.beispiel.schritte.length >= 2, `${t}: Beispiel`);
    assert.ok(m.hilfe.fehler.length >= 2, `${t}: Fehler`);
    assert.ok(m.hilfe.strategie.length >= 2, `${t}: Strategie`);
    assert.equal(m.vertiefung.length, 3, `${t}: Vertiefung`);
    for (const a of m.vertiefung) {
      assert.ok(a.titel && a.aufgabe && a.tipp && a.loesung.length, `${t}: ${a.titel}`);
      if (a.pruefung.kind === 'wahl') {
        assert.ok(a.pruefung.optionen.length >= 2, `${t}: ${a.titel} Optionen`);
        assert.ok(Number.isInteger(a.pruefung.richtig) && a.pruefung.richtig >= 0 && a.pruefung.richtig < a.pruefung.optionen.length, `${t}: ${a.titel} Index`);
        assert.equal(new Set(a.pruefung.optionen).size, a.pruefung.optionen.length, `${t}: ${a.titel} doppelte Optionen`);
      } else {
        assert.ok(a.pruefung.felder.length >= 1);
        for (const f of a.pruefung.felder) assert.ok(Number.isFinite(f.wert) && f.label, `${t}: ${a.titel} Wert`);
      }
    }
  }
});

test('Modultest deckt alle Teilthemen ab und hat 7 + 3 Aufgaben', () => {
  for (const t of topics.filter(x => x !== 'mental')) {
    for (const seed of [1, 42, 9999, 123456]) {
      const items = buildModuleTest(t, seed);
      assert.equal(items.length, 10, t);
      assert.equal(items.filter(i => i.level === 2).length, 7, t);
      assert.deepEqual(items.slice(7).map(i => i.punkte), [2, 2, 2], t);
      const teil = Object.keys(areas[t] ?? {}).filter(k => k !== 'mix' && taskIds(t, k).length);
      if (teil.length <= 10) for (const a of teil) assert.ok(items.some(i => i.area === a), `${t}: Teilthema ${a} fehlt`);
      for (const it of items) {
        const p = makeProblem(t, it.seed, it.level, it.id);
        assert.ok(p.prompt && p.solution.length, `${t}#${it.id}`);
      }
    }
  }
});

test('alle Aufgabengeneratoren liefern gültige Aufgaben', () => {
  const fehler: string[] = [];
  for (const t of topics) {
    const ids = taskIds(t);
    const list = ids.length ? ids : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (const k of list) for (const lv of [1, 2, 3]) for (const seed of [11, 222, 3333, 44444, 555, 6666, 77, 888]) {
      let p;
      try { p = makeProblem(t, seed, lv, k); } catch (e) { fehler.push(`${t}#${k} L${lv} s${seed}: Fehler ${e}`); continue; }
      const s = JSON.stringify(p).replace(/"line":null/, '');
      if (/NaN|undefined|Infinity|null/.test(s)) fehler.push(`${t}#${k} L${lv} s${seed}: NaN/undefined`);
      if (p.type === 'choice') {
        const o = (p.options ?? []).map(String);
        if (!o.includes(String(p.answer))) fehler.push(`${t}#${k} L${lv} s${seed}: Lösung nicht unter den Optionen`);
        if (new Set(o).size !== o.length || o.length < 2) fehler.push(`${t}#${k} L${lv} s${seed}: Optionen ungültig`);
      }
      if (!p.solution.length || !p.hints.length) fehler.push(`${t}#${k} L${lv} s${seed}: Hilfe oder Lösung fehlt`);
    }
  }
  assert.deepEqual(fehler.slice(0, 20), []);
});

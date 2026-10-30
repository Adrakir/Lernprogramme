import {test} from 'node:test';
import assert from 'node:assert/strict';
import {checkTask, checkField, toBase, inUnit, parseInput, fewestCoins, type Answers, type Task, type Field} from './groessen-core.ts';
import {skills, makeTask, makeBereichTest, makeGesamttest, makePractice, grade} from './groessen-tasks.ts';

/** Erzeugt die richtige Schülereingabe für ein Feld. */
function solve(f: Field): Answers[string] {
  if (f.kind === 'size') return inUnit(f.answer, f.bereich, f.unit).replace(/\./g, '');
  if (f.kind === 'number') return String(f.answer).replace('.', ',');
  if (f.kind === 'choice') return f.answer;
  if (f.kind === 'order') return f.order;
  return fewestCoins(f.target);
}
const solveAll = (t: Task) => Object.fromEntries(t.fields.map(f => [f.id, solve(f)])) as Answers;

test('jede Fähigkeit erzeugt auf allen Niveaus lösbare, vollständige Aufgaben', () => {
  for (const s of skills) for (const level of [1, 2, 3] as const) for (let seed = 1; seed <= 150; seed++) {
    const t = makeTask(s.id, seed, level);
    const where = `${s.id}/${level}/${seed}: ${t.prompt}`;
    assert.ok(t.prompt.length > 10, where);
    assert.equal(t.hints.length, 3, where);
    assert.ok(t.solution.length > 0, where);
    assert.ok(!/NaN|undefined|Infinity/.test(JSON.stringify(t)), 'Ungültiger Wert in ' + where + JSON.stringify(t));
    for (const f of t.fields) {
      if (f.kind === 'size') { assert.ok(Number.isInteger(f.answer) && f.answer > 0, where + ' Antwort ' + f.answer); }
      if (f.kind === 'choice') { assert.ok(f.answer >= 0 && f.answer < f.options.length, where); assert.equal(new Set(f.options).size, f.options.length, 'doppelte Option ' + where); }
      if (f.kind === 'order') assert.equal(new Set(f.order).size, f.items.length, where);
      if (f.kind === 'number') assert.ok(Number.isFinite(f.answer) && f.answer >= 0, where + ' ' + f.answer);
      for (const tr of ('traps' in f && f.traps) || []) assert.notEqual(tr.value, (f as any).answer, 'Falle = Lösung in ' + where);
    }
    const r = checkTask(t, solveAll(t));
    assert.ok(r.ok, where + ' ' + JSON.stringify(r.results) + JSON.stringify(solveAll(t)));
    assert.ok(!checkTask(t, {}).ok, 'leere Antwort darf nicht stimmen: ' + where);
  }
});

test('Kommazahlen werden exakt und tolerant gelesen', () => {
  assert.equal(toBase('3,45', 'laenge', 'm'), 3450);
  assert.equal(toBase('3.45', 'laenge', 'm'), 3450);
  assert.equal(toBase('1.250', 'masse', 'g'), 1_250_000);
  assert.equal(toBase('1 250', 'masse', 'g'), 1_250_000);
  assert.equal(toBase('0,07', 'geld', 'eur'), 7);
  assert.equal(toBase('4,50', 'geld', 'eur'), 450);
  assert.equal(toBase('4,5 €', 'geld', 'eur'), 450);
  assert.ok(Number.isNaN(toBase('0,001', 'geld', 'eur')!));
  assert.equal(toBase('abc', 'geld', 'eur'), null);
  assert.equal(parseInput('-3'), null);
  assert.equal(inUnit(305, 'geld', 'eur'), '3,05');
  assert.equal(inUnit(2050, 'laenge', 'm'), '2,05');
  assert.equal(inUnit(12_000_000, 'flaeche', 'cm2'), '120.000');
});

test('typische Fehler bekommen eine passende Rückmeldung', () => {
  const f: Field = {kind: 'size', id: 'a', bereich: 'flaeche', unit: 'dm2', answer: 3e6};
  const m = checkField(f, {a: '30'}).message!;
  assert.match(m, /10-mal zu klein/);
  assert.match(m, /100/);
  const g: Field = {kind: 'size', id: 'a', bereich: 'volumen', unit: 'cm3', answer: 2e6};
  assert.match(checkField(g, {a: '200'}).message!, /1000/);
  const w: Field = {kind: 'wallet', id: 'a', target: 385, fewest: true};
  assert.ok(checkField(w, {a: fewestCoins(385)}).ok);
  assert.match(checkField(w, {a: [100, 100, 100, 50, 20, 10, 5]}).message!, /weniger/);
  assert.match(checkField(w, {a: [200]}).message!, /fehlen/);
});

test('Tests und Übungsrunden sind vollständig und gemischt', () => {
  for (const b of ['laenge', 'masse', 'geld', 'flaeche', 'volumen'] as const) for (let s = 1; s < 30; s++) {
    const t = makeBereichTest(b, s);
    assert.equal(t.length, 12);
    assert.equal(new Set(t.map(x => x.skill)).size, 5);
    assert.equal(makePractice(b, 'mix', 2, s).length, 6);
  }
  const g = makeGesamttest(3);
  assert.equal(g.length, 15);
  assert.equal(new Set(g.map(x => x.bereich)).size, 5);
  assert.equal(grade(90).note, '1');
  assert.equal(grade(49).note, '5');
});

import {content} from './groessen-content.ts';
import {skillById} from './groessen-tasks.ts';
test('Lernpfad-Inhalte passen zu den Fähigkeiten', () => {
  for (const [b, c] of Object.entries(content)) {
    assert.equal(c.stationen.length, 5, b);
    for (const st of c.stationen) {
      assert.ok(skillById[st.skill] && !skillById[st.skill].vertiefung && skillById[st.skill].bereich === b, st.skill);
      for (const f of [st.entdecken, st.begruenden]) {
        assert.ok(f.answer >= 0 && f.answer < f.options.length, st.skill);
        assert.equal(f.explain.length, f.options.length, st.skill);
      }
    }
    assert.ok(skillById[c.vertiefung.skill]?.vertiefung, c.vertiefung.skill);
  }
});

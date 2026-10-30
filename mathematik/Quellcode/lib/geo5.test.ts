import test from 'node:test';
import assert from 'node:assert/strict';
import {foldNet, makeNet, solidFacts, polyFacts, decodeCells} from './geo5.ts';
import {makeProblem} from './math.ts';

const norm = (cells: [number, number][]) => { const r0 = Math.min(...cells.map(c => c[0])), c0 = Math.min(...cells.map(c => c[1])); return cells.map(([r, c]) => [r - r0, c - c0] as [number, number]).map(([r, c]) => r * 10 + c).sort((a, b) => a - b).join(','); };
const variants = (cells: [number, number][]) => { const out: string[] = []; let cur = cells; for (let k = 0; k < 4; k++) { cur = cur.map(([r, c]) => [c, -r] as [number, number]); out.push(norm(cur), norm(cur.map(([r, c]) => [r, -c] as [number, number]))); } return out; };

test('foldNet erkennt bekannte Netze', () => {
  assert.ok(foldNet([[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]]), 'Kreuz');
  assert.equal(foldNet([[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]]), null, '2×3-Block');
  assert.ok(foldNet([[0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [2, 3]]), 'Treppe 2-2-2');
  assert.equal(foldNet([[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4]]), null, 'Fünferreihe');
});

test('es gibt genau 11 Würfelnetze', () => {
  const seen = new Set<string>(), nets = new Set<string>();
  const grow = (cells: [number, number][]) => {
    const key = norm(cells); if (seen.has(key)) return; seen.add(key);
    if (cells.length === 6) { if (foldNet(decodeCells(key.split(',').map(Number)))) nets.add(variants(cells).sort()[0]); return; }
    for (const [r, c] of cells) for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) { const n: [number, number] = [r + dr, c + dc]; if (!cells.some(x => x[0] === n[0] && x[1] === n[1])) grow([...cells, n]); }
  };
  grow([[0, 0]]);
  assert.equal(nets.size, 11);
});

test('foldNet liefert gegenüberliegende Paare', () => {
  const f = foldNet([[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]])!;
  assert.deepEqual([...f].sort(), [0, 1, 2, 3, 4, 5]);
  assert.equal(f[1] ^ 1, f[3], 'B und D liegen gegenüber');
  assert.equal(f[2] ^ 1, f[4], 'C und E liegen gegenüber');
  assert.equal(f[0] ^ 1, f[5], 'A und F liegen gegenüber');
});

test('makeNet hält, was es verspricht', () => {
  let s = 7; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 200; i++) { assert.ok(foldNet(makeNet(r, true))); assert.equal(foldNet(makeNet(r, false)), null); }
});

test('Körperdaten erfüllen den Eulerschen Polyedersatz', () => {
  for (const [n, f] of Object.entries(solidFacts)) if (!['Zylinder', 'Kegel', 'Kugel'].includes(n)) assert.equal(f.ecken + f.flaechen - f.kanten, 2, n);
  for (const [n, f] of Object.entries(polyFacts)) assert.equal(360 % f.dreh, 0, n);
});

test('Winkelaufgaben liefern plausible Ergebnisse', () => {
  for (const k of [0, 3, 4, 5, 6, 7, 8, 9]) for (const lv of [1, 2, 3]) for (let s = 0; s < 40; s++) {
    const p = makeProblem('angles', 500 + s * 13, lv, k);
    if (typeof p.answer === 'number') assert.ok(p.answer > 0 && p.answer < 360, `${p.title}: ${p.answer}`);
  }
});

test('Netz- und Würfelaufgaben sind mit foldNet konsistent', () => {
  for (const lv of [1, 2, 3]) for (let s = 0; s < 60; s++) {
    const p = makeProblem('solids', 900 + s * 17, lv, 2);
    const ok = foldNet(decodeCells(p.shape!.v!)) !== null;
    assert.equal(p.answer, ok ? 'Ja' : 'Nein');
    const d = makeProblem('solids', 300 + s * 11, lv, 4);
    assert.ok(Number(d.answer) >= 1 && Number(d.answer) <= 6);
  }
});

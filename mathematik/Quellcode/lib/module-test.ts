// Zusammenstellung der Modultests: alle Teilthemen, 7 Aufgaben Stufe 2, 3 Knobelaufgaben Stufe 3.
import type {Topic} from './math.ts';
import {areas, taskIds} from './tasks.ts';

export type Item = {id: number; level: number; area: string; seed: number; punkte: number};

function rng(seed: number) {
  let t = seed >>> 0;
  return () => { t += 0x6d2b79f5; let x = Math.imul(t ^ (t >>> 15), 1 | t); x ^= x + Math.imul(x ^ (x >>> 7), 61 | x); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
}

export function buildModuleTest(topic: Topic, seed: number, count = 10): Item[] {
  const r = rng(seed);
  const teil = Object.keys(areas[topic] ?? {}).filter(k => k !== 'mix');
  const areaOf = (id: number) => teil.find(a => taskIds(topic, a).includes(id)) ?? 'mix';
  const chosen: number[] = [];
  const pick = (ids: number[]) => { const free = ids.filter(i => !chosen.includes(i)); if (free.length) chosen.push(free[Math.floor(r() * free.length)]); };
  for (const a of [...teil].sort(() => r() - 0.5)) { if (chosen.length >= count) break; pick(taskIds(topic, a)); }
  const all = taskIds(topic);
  while (chosen.length < Math.min(count, all.length)) pick(all);
  while (chosen.length < count) chosen.push(all[Math.floor(r() * all.length)]);
  const ordered = chosen.sort(() => r() - 0.5);
  return ordered.map((id, j) => {
    const level = j < count - 3 ? 2 : 3;
    return {id, level, area: areaOf(id), seed: seed + j * 7919, punkte: level === 3 ? 2 : 1};
  });
}


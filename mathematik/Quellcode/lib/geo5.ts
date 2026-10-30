// Aufgaben für die Klasse-5-Module Winkel, Symmetrie & Vierecke sowie Körper & Netze
// (Kerncurriculum Niedersachsen 5/6, Lernbereiche "Körper und Figuren" und "Symmetrien").
import type {Problem, Topic} from './math.ts';

// Eigene Kopien von rng und fmt, damit kein Import-Zyklus mit math.ts entsteht (identisch zu math.ts).
function rng(seed: number) { let x = seed >>> 0; return () => { x += 0x6D2B79F5; let t = x; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const fmt = (n: number) => n.toLocaleString('de-DE');

export const geoAreas = {
  angles: {mix: 'Alle Aufgaben', measure: 'Winkel messen & schätzen', lines: 'Winkel an Geraden', sums: 'Winkelsummen & Anwendungen'},
  symmetry: {mix: 'Alle Aufgaben', axis: 'Achsensymmetrie', point: 'Punkt- & Drehsymmetrie', quads: 'Vierecke & Dreiecke'},
  solids: {mix: 'Alle Aufgaben', bodies: 'Körper erkennen', nets: 'Netze & Schrägbilder', build: 'Würfelgebäude & Kanten'},
};
export const geoGroups = {
  angles: {measure: [0, 1, 2], lines: [3, 4, 5], sums: [6, 7, 8, 9]},
  symmetry: {axis: [0, 1, 2, 3], point: [4, 5, 6], quads: [7, 8, 9]},
  solids: {bodies: [0, 1, 8, 9], nets: [2, 3, 4, 5], build: [6, 7]},
};
export type GeoTopic = keyof typeof geoAreas;
export const isGeoTopic = (t: string): t is GeoTopic => t in geoAreas;

/* ---------- Figuren-Daten ---------- */

export type PolyName = 'Quadrat' | 'Rechteck' | 'Raute' | 'Parallelogramm' | 'Drachenviereck' | 'Gleichschenkliges Trapez' | 'Trapez' | 'Gleichseitiges Dreieck' | 'Gleichschenkliges Dreieck' | 'Regelmäßiges Fünfeck' | 'Regelmäßiges Sechseck' | 'Regelmäßiges Achteck' | 'Unregelmäßiges Viereck';
export const polyFacts: Record<PolyName, {achsen: number; punkt: boolean; dreh: number; achsenText: string}> = {
  'Quadrat': {achsen: 4, punkt: true, dreh: 90, achsenText: 'zwei Mittellinien und zwei Diagonalen'},
  'Rechteck': {achsen: 2, punkt: true, dreh: 180, achsenText: 'die beiden Mittellinien; die Diagonalen sind keine Achsen'},
  'Raute': {achsen: 2, punkt: true, dreh: 180, achsenText: 'die beiden Diagonalen'},
  'Parallelogramm': {achsen: 0, punkt: true, dreh: 180, achsenText: 'keine Achse, denn beim Falten passen die Hälften nie genau aufeinander'},
  'Drachenviereck': {achsen: 1, punkt: false, dreh: 360, achsenText: 'die Diagonale durch die beiden Spitzen'},
  'Gleichschenkliges Trapez': {achsen: 1, punkt: false, dreh: 360, achsenText: 'die Mittellinie durch die beiden parallelen Seiten'},
  'Trapez': {achsen: 0, punkt: false, dreh: 360, achsenText: 'keine Achse'},
  'Gleichseitiges Dreieck': {achsen: 3, punkt: false, dreh: 120, achsenText: 'je eine Achse durch jede Ecke und die Mitte der gegenüberliegenden Seite'},
  'Gleichschenkliges Dreieck': {achsen: 1, punkt: false, dreh: 360, achsenText: 'die Achse durch die Spitze und die Mitte der Grundseite'},
  'Regelmäßiges Fünfeck': {achsen: 5, punkt: false, dreh: 72, achsenText: 'fünf Achsen, je eine durch jede Ecke'},
  'Regelmäßiges Sechseck': {achsen: 6, punkt: true, dreh: 60, achsenText: 'drei Achsen durch gegenüberliegende Ecken und drei durch gegenüberliegende Seitenmitten'},
  'Regelmäßiges Achteck': {achsen: 8, punkt: true, dreh: 45, achsenText: 'vier Achsen durch Ecken und vier durch Seitenmitten'},
  'Unregelmäßiges Viereck': {achsen: 0, punkt: false, dreh: 360, achsenText: 'keine Achse'},
};
export const polyNames = Object.keys(polyFacts) as PolyName[];

export type SolidName = 'Würfel' | 'Quader' | 'Dreiecksprisma' | 'Quadratische Pyramide' | 'Dreieckspyramide' | 'Sechseckprisma' | 'Zylinder' | 'Kegel' | 'Kugel';
export const solidFacts: Record<SolidName, {ecken: number; kanten: number; flaechen: number; text: string}> = {
  'Würfel': {ecken: 8, kanten: 12, flaechen: 6, text: '6 gleich große Quadrate als Flächen'},
  'Quader': {ecken: 8, kanten: 12, flaechen: 6, text: '6 Rechtecke; gegenüberliegende Flächen sind gleich groß'},
  'Dreiecksprisma': {ecken: 6, kanten: 9, flaechen: 5, text: '2 gleiche Dreiecke als Grund- und Deckfläche und 3 Rechtecke'},
  'Quadratische Pyramide': {ecken: 5, kanten: 8, flaechen: 5, text: '1 Quadrat als Grundfläche und 4 Dreiecke, die in einer Spitze zusammenlaufen'},
  'Dreieckspyramide': {ecken: 4, kanten: 6, flaechen: 4, text: '4 Dreiecke'},
  'Sechseckprisma': {ecken: 12, kanten: 18, flaechen: 8, text: '2 Sechsecke und 6 Rechtecke'},
  'Zylinder': {ecken: 0, kanten: 2, flaechen: 3, text: '2 Kreise und eine gekrümmte Mantelfläche'},
  'Kegel': {ecken: 0, kanten: 1, flaechen: 2, text: '1 Kreis, eine gekrümmte Mantelfläche und eine Spitze'},
  'Kugel': {ecken: 0, kanten: 0, flaechen: 1, text: 'nur eine gekrümmte Fläche, keine Kanten'},
};

/* ---------- Würfelnetze ---------- */

type V3 = [number, number, number];
const neg = (v: V3): V3 => [-v[0], -v[1], -v[2]];
const key3 = (v: V3) => v.join(',');
/** Faltet ein Netz aus Einheitsquadraten (Zeile, Spalte). Liefert je Feld eine Würfelseite 0–5 oder null, wenn kein Würfelnetz. */
export function foldNet(cells: [number, number][]): number[] | null {
  if (cells.length !== 6) return null;
  const idx = new Map(cells.map((c, i) => [c.join(','), i]));
  if (idx.size !== 6) return null;
  const normal: (V3 | null)[] = cells.map(() => null), dx: V3[] = [], dy: V3[] = [];
  normal[0] = [0, 0, -1]; dx[0] = [1, 0, 0]; dy[0] = [0, 1, 0];
  const queue = [0];
  while (queue.length) {
    const i = queue.shift()!, [r, c] = cells[i], n = normal[i]!;
    const moves: [number, number, () => [V3, V3, V3]][] = [
      [r, c + 1, () => [dx[i], neg(n), dy[i]]],
      [r, c - 1, () => [neg(dx[i]), n, dy[i]]],
      [r + 1, c, () => [dy[i], dx[i], neg(n)]],
      [r - 1, c, () => [neg(dy[i]), dx[i], n]],
    ];
    for (const [rr, cc, f] of moves) {
      const j = idx.get(rr + ',' + cc);
      if (j === undefined || normal[j]) continue;
      const [nn, ndx, ndy] = f();
      normal[j] = nn; dx[j] = ndx; dy[j] = ndy; queue.push(j);
    }
  }
  if (normal.some(v => !v)) return null;
  const order = ['1,0,0', '-1,0,0', '0,1,0', '0,-1,0', '0,0,1', '0,0,-1'];
  const faces = normal.map(v => order.indexOf(key3(v!)));
  return new Set(faces).size === 6 ? faces : null;
}
export const oppositeFace = (f: number) => f ^ 1;

function randomHexomino(r: () => number): [number, number][] {
  const cells: [number, number][] = [[1, 1]];
  while (cells.length < 6) {
    const [br, bc] = cells[Math.floor(r() * cells.length)];
    const d = [[0, 1], [0, -1], [1, 0], [-1, 0]][Math.floor(r() * 4)];
    const nr = br + d[0], nc = bc + d[1];
    if (nr < 0 || nc < 0 || nr > 3 || nc > 4) continue;
    if (!cells.some(([a, b]) => a === nr && b === nc)) cells.push([nr, nc]);
  }
  return cells;
}
export function makeNet(r: () => number, valid: boolean): [number, number][] {
  for (let t = 0; t < 2000; t++) {
    const n = randomHexomino(r);
    if (!!foldNet(n) === valid) return n;
  }
  return valid ? [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]] : [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]];
}
export const encodeCells = (c: [number, number][]) => c.map(([a, b]) => a * 10 + b);
export const decodeCells = (v: number[]): [number, number][] => v.map(x => [Math.floor(x / 10), x % 10]);

/* ---------- Hilfen ---------- */

const angleKind = (w: number) => w < 90 ? 'Spitzer Winkel' : w === 90 ? 'Rechter Winkel' : w < 180 ? 'Stumpfer Winkel' : w === 180 ? 'Gestreckter Winkel' : w < 360 ? 'Überstumpfer Winkel' : 'Vollwinkel';
const einArtikel = (s: SolidName) => ({'Würfel': 'ein Würfel', 'Quader': 'ein Quader', 'Dreiecksprisma': 'ein Dreiecksprisma', 'Quadratische Pyramide': 'eine quadratische Pyramide', 'Dreieckspyramide': 'eine Dreieckspyramide', 'Sechseckprisma': 'ein Sechseckprisma', 'Zylinder': 'ein Zylinder', 'Kegel': 'ein Kegel', 'Kugel': 'eine Kugel'})[s];
const eck = (n: number) => ({3: 'Dreieck', 4: 'Viereck', 5: 'Fünfeck', 6: 'Sechseck', 7: 'Siebeneck', 8: 'Achteck', 9: 'Neuneck', 10: 'Zehneck', 11: 'Elfeck', 12: 'Zwölfeck'} as Record<number, string>)[n] ?? `${n}-Eck`;
const lcFirst = (x: string) => x[0].toLowerCase() + x.slice(1);
const lcName = (x: string) => x.includes(' ') ? lcFirst(x) : x;
const and = (xs: string[]) => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' und ' + xs[xs.length - 1];

export function geoProblem(topic: Topic, seed: number, level: number, index: number): Problem | null {
  if (!isGeoTopic(topic)) return null;
  const r = rng(seed), int = (a: number, b: number) => a + Math.floor(r() * (b - a + 1)), pick = <T,>(a: readonly T[]) => a[int(0, a.length - 1)], k = ((index % 10) + 10) % 10;
  const q = (title: string, prompt: string, answer: number | string, rule: string, step: string, solution: string[], extra: Partial<Problem> = {}): Problem => ({id: `${topic}-${seed}-${k}`, topic, title, prompt, answer, hints: [rule, step], solution, error: title, ...extra});
  const mc = (title: string, prompt: string, answer: string, wrong: string[], rule: string, step: string, solution: string[], extra: Partial<Problem> = {}) => q(title, prompt, answer, rule, step, solution, {...extra, type: 'choice', options: [...new Set([answer, ...wrong])].map(v => ({v, n: r()})).sort((x, y) => x.n - y.n).map(x => x.v)});

  if (topic === 'angles') {
    if (k === 0) {
      const step = level === 1 ? 10 : 5, w = step * int(Math.ceil(15 / step), Math.floor(170 / step)), left = level === 3 && r() < 0.5;
      return q('Winkel ablesen', `Lies die Größe des Winkels am Geodreieck ab.${left ? ' Achtung: Der untere Schenkel zeigt nach links.' : ''}`, w, 'Der Scheitelpunkt liegt in der Mitte des Geodreiecks. Ein Schenkel liegt auf der Nulllinie.', left ? 'Nutze die Skala, die links bei 0° beginnt (innere Skala).' : 'Nutze die Skala, die rechts bei 0° beginnt (äußere Skala).', [`Der Schenkel liegt auf 0° der ${left ? 'inneren' : 'äußeren'} Skala.`, `Der zweite Schenkel zeigt auf ${w}°.`, `${angleKind(w)}: ${w}°.`], {unit: '°', shape: {kind: 'g-protractor', a: w, b: left ? 1 : 0}});
    }
    if (k === 1) {
      const w = 5 * int(3, 34), cands = [w, ...[20, 45, 70, 100, 135, 160, 30, 80, 120, 150].filter(x => Math.abs(x - w) >= 35)];
      const wrong = [...new Set(cands.slice(1))].sort(() => r() - 0.5).slice(0, 3);
      return mc('Winkel schätzen', 'Schätze: Welcher Wert passt am besten zu dem Winkel?', `${w}°`, wrong.map(x => `${x}°`), 'Vergleiche mit einem rechten Winkel (90°) und einem gestreckten Winkel (180°).', 'Ist der Winkel kleiner als 90°, genau 90° oder größer?', [`Der Winkel ist ${w < 90 ? 'kleiner als 90°' : w === 90 ? 'genau 90°' : 'größer als 90°'}.`, `Am besten passt ${w}° (${lcFirst(angleKind(w))}).`], {shape: {kind: 'g-angle', a: w, b: int(0, 3) * 30}});
    }
    if (k === 2) {
      const w = level === 1 ? pick([30, 60, 90, 120, 150, 180]) : pick([15, 75, 90, 105, 165, 180, 200, 250, 290, 330, 360]);
      const all = ['Spitzer Winkel', 'Rechter Winkel', 'Stumpfer Winkel', 'Gestreckter Winkel', 'Überstumpfer Winkel', 'Vollwinkel'];
      const ans = angleKind(w);
      return mc('Winkelarten', `Welche Winkelart hat ein Winkel von ${w}°?`, ans, all.filter(x => x !== ans).sort(() => r() - 0.5).slice(0, 3), 'Spitz: unter 90°. Recht: 90°. Stumpf: zwischen 90° und 180°. Gestreckt: 180°.', 'Überstumpf: zwischen 180° und 360°. Vollwinkel: 360°.', [`${w}° ist ${w < 90 ? 'kleiner als 90°' : w === 90 ? 'genau 90°' : w < 180 ? 'zwischen 90° und 180°' : w === 180 ? 'genau 180°' : w < 360 ? 'zwischen 180° und 360°' : 'genau 360°'}.`, `Also: ${ans}.`], {shape: {kind: 'g-angle', a: Math.min(w, 359), b: 0}});
    }
    if (k === 3 || k === 4) {
      const a = 5 * int(5, 31), rot = int(0, 5) * 10;
      const ask = k === 3 ? pick([1, 3]) : 2;
      const ans = ask === 2 ? a : 180 - a, names = ['α', 'β', 'γ', 'δ'];
      return q(k === 3 ? 'Nebenwinkel' : 'Scheitelwinkel', `Zwei Geraden schneiden sich. α = ${a}°. Wie groß ist ${names[ask]}?`, ans, k === 3 ? 'Nebenwinkel liegen nebeneinander an einer Geraden.' : 'Scheitelwinkel liegen sich am Schnittpunkt gegenüber.', k === 3 ? 'Nebenwinkel ergänzen sich zu 180°.' : 'Scheitelwinkel sind gleich groß.', k === 3 ? [`α und ${names[ask]} sind Nebenwinkel. Zusammen bilden sie einen gestreckten Winkel.`, `${names[ask]} = 180° − ${a}° = ${ans}°.`] : [`α und γ sind Scheitelwinkel.`, `Scheitelwinkel sind gleich groß: γ = ${a}°.`], {unit: '°', shape: {kind: 'g-cross', a, b: rot, c: ask}});
    }
    if (k === 5) {
      const a = 5 * int(7, 28), p = int(0, 3);
      const qpos = level === 1 ? p : level === 2 ? pick([p, (p + 2) % 4]) : int(0, 3);
      const val = (pos: number) => pos % 2 === 0 ? a : 180 - a, ans = val(qpos);
      const shown = val(p);
      const rel = qpos === p ? 'Stufenwinkel' : (qpos + 2) % 4 === p ? 'Wechselwinkel' : 'Nebenwinkel eines Stufenwinkels';
      return q('Winkel an Parallelen', `Die Geraden g und h sind parallel. Der markierte Winkel ist ${shown}° groß. Wie groß ist der Winkel mit dem Fragezeichen?`, ans, 'Eine Gerade schneidet zwei Parallelen. An beiden Schnittpunkten entstehen dieselben Winkel.', 'Gleiche Lage (Stufenwinkel) oder überkreuzte Lage (Wechselwinkel) bedeutet: gleich groß. Sonst ergänzen sich die Winkel zu 180°.', [`An g und h entstehen gleiche Winkelpaare, weil g und h parallel sind.`, rel === 'Nebenwinkel eines Stufenwinkels' ? `Der gesuchte Winkel ist Nebenwinkel des Stufenwinkels: 180° − ${shown}° = ${ans}°.` : `Die Winkel sind ${rel}. ${rel} an Parallelen sind gleich groß: ${ans}°.`], {unit: '°', shape: {kind: 'g-parallel', a, b: p, c: qpos}});
    }
    if (k === 6) {
      const al = 5 * int(5, 16), be = 5 * int(5, Math.min(20, (170 - al) / 5 - 2)), ga = 180 - al - be;
      return q('Winkelsumme im Dreieck', `In einem Dreieck ist α = ${al}° und β = ${be}°. Berechne γ.`, ga, 'Die drei Innenwinkel eines Dreiecks ergeben zusammen 180°.', 'Ziehe die beiden bekannten Winkel von 180° ab.', [`α + β = ${al}° + ${be}° = ${al + be}°.`, `γ = 180° − ${al + be}° = ${ga}°.`, `Probe: ${al}° + ${be}° + ${ga}° = 180°.`], {unit: '°', shape: {kind: 'g-triangle', a: al, b: be}});
    }
    if (k === 7) {
      const th = [int(0, 20), int(75, 110), int(160, 200), int(250, 290)];
      const rx = 1.35, pts = th.map(t => [rx * Math.cos(t * Math.PI / 180), Math.sin(t * Math.PI / 180)]);
      const ang = pts.map((P, i) => { const A = pts[(i + 3) % 4], B = pts[(i + 1) % 4]; const u = [A[0] - P[0], A[1] - P[1]], v = [B[0] - P[0], B[1] - P[1]]; return Math.acos((u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)) * 180 / Math.PI; });
      const given = ang.slice(0, 3).map(x => Math.round(x)), d = 360 - given.reduce((s, x) => s + x, 0);
      return q('Winkelsumme im Viereck', `In einem Viereck sind drei Winkel bekannt: α = ${given[0]}°, β = ${given[1]}°, γ = ${given[2]}°. Berechne δ.`, d, 'Die vier Innenwinkel eines Vierecks ergeben zusammen 360°.', 'Eine Diagonale zerlegt das Viereck in zwei Dreiecke: 2 · 180° = 360°.', [`α + β + γ = ${given[0]}° + ${given[1]}° + ${given[2]}° = ${360 - d}°.`, `δ = 360° − ${360 - d}° = ${d}°.`], {unit: '°', shape: {kind: 'g-quad', a: th[0], b: th[1], c: th[2], d: th[3], v: given}});
    }
    if (k === 8) {
      const h = int(1, 11), m = level === 3 ? pick([0, 30]) : 0, raw = Math.abs(30 * h - 5.5 * m), w = Math.min(raw, 360 - raw);
      return q('Winkel an der Uhr', `Wie groß ist der kleinere Winkel zwischen Stunden- und Minutenzeiger um ${h}:${String(m).padStart(2, '0')} Uhr?`, w, 'Das Zifferblatt ist ein Vollwinkel (360°) mit 12 gleichen Abschnitten.', 'Zwischen zwei Stundenzahlen liegen 360° : 12 = 30°.' + (m ? ' In einer halben Stunde wandert der Stundenzeiger 15° weiter.' : ''), m ? [`Der Minutenzeiger zeigt auf die 6 (180°). Der Stundenzeiger steht in der Mitte zwischen ${h} und ${h + 1}: ${h} · 30° + 15° = ${30 * h + 15}°.`, `Unterschied: ${fmt(raw)}°${raw > 180 ? `; der kleinere Winkel ist 360° − ${fmt(raw)}° = ${fmt(w)}°` : ''}.`] : [`Der Minutenzeiger zeigt auf die 12. Der Stundenzeiger zeigt auf die ${h}.`, `${Math.min(h, 12 - h)} Abschnitte · 30° = ${w}°.`], {unit: '°', decimal: w % 1 !== 0, shape: {kind: 'g-clock', a: h, b: m}});
    }
    {
      const n = level === 1 ? pick([2, 3, 4, 6]) : pick([3, 4, 5, 6, 8, 9, 10, 12]), sel = level === 3 ? int(2, n - 1) : 1, w = 360 / n * sel;
      return q('Winkel im Kreis', sel === 1 ? `Eine Torte wird vom Mittelpunkt aus in ${n} gleich große Stücke geschnitten. Wie groß ist der Winkel eines Stücks?` : `Eine Torte wird in ${n} gleich große Stücke geschnitten. ${sel} Stücke sind gefärbt. Wie groß ist ihr gemeinsamer Winkel?`, w, 'Ein voller Kreis ist ein Vollwinkel: 360°.', `Teile 360° durch ${n}.${sel > 1 ? ` Nimm das Ergebnis dann ${sel}-mal.` : ''}`, [`Ein Stück: 360° : ${n} = ${360 / n}°.`, ...(sel > 1 ? [`${sel} Stücke: ${sel} · ${360 / n}° = ${w}°.`] : [])], {unit: '°', shape: {kind: 'g-sectors', a: n, b: sel}});
    }
  }

  if (topic === 'symmetry') {
    if (k === 0) {
      const pool: PolyName[] = level === 1 ? ['Quadrat', 'Rechteck', 'Gleichschenkliges Dreieck', 'Gleichseitiges Dreieck', 'Drachenviereck'] : ['Quadrat', 'Rechteck', 'Raute', 'Parallelogramm', 'Drachenviereck', 'Gleichschenkliges Trapez', 'Gleichseitiges Dreieck', 'Regelmäßiges Fünfeck', 'Regelmäßiges Sechseck', 'Regelmäßiges Achteck'];
      const f = pick(pool), fa = polyFacts[f];
      return q('Symmetrieachsen zählen', `Wie viele Symmetrieachsen hat diese Figur (${f})?`, fa.achsen, 'Eine Symmetrieachse teilt die Figur in zwei Hälften, die beim Falten genau aufeinanderpassen.', 'Prüfe Linien durch Ecken und durch Seitenmitten.', [`${f}: ${fa.achsenText}.`, `Anzahl: ${fa.achsen}.`], {shape: {kind: 'g-poly', a: polyNames.indexOf(f)}});
    }
    if (k === 1) {
      const groups: [string, string[], string][] = [['Nur eine senkrechte Achse', ['A', 'M', 'T', 'U', 'V', 'W', 'Y'], 'genau eine senkrechte Symmetrieachse'], ['Nur eine waagerechte Achse', ['C', 'D', 'E'], 'genau eine waagerechte Symmetrieachse'], ['Senkrechte und waagerechte Achse', ['H', 'I', 'O', 'X'], 'eine senkrechte und eine waagerechte Symmetrieachse'], ['Keine Symmetrieachse', ['F', 'G', 'J', 'L', 'N', 'P', 'R', 'S', 'Z'], 'keine Symmetrieachse']];
      const g = pick(groups), letter = pick(g[1]);
      return mc('Buchstaben spiegeln', `Welche Symmetrieachsen hat der Großbuchstabe ${letter} in Druckschrift?`, g[0], groups.filter(x => x !== g).map(x => x[0]), 'Stell dir einen Spiegel senkrecht oder waagerecht durch die Mitte vor.', 'Passt die eine Hälfte genau auf die andere?', [`Der Buchstabe ${letter} hat ${g[2]}.`, g[0] === 'Keine Symmetrieachse' ? `Kein Spiegel durch die Mitte bildet den Buchstaben auf sich selbst ab.` : `Die Hälften passen beim Falten an der Achse aufeinander.`], {shape: {kind: 'g-letter', a: letter.charCodeAt(0)}});
    }
    if (k === 2) {
      const type = level === 1 ? 0 : level === 2 ? int(0, 1) : int(0, 2);
      const x = int(1, 8), y = int(1, 8);
      if (type === 2) {
        return q('Spiegeln an der Diagonale', `Spiegle P(${x}|${y}) an der Spiegelachse, die durch (0|0) und (9|9) geht.`, `${y}|${x}`, 'Bei dieser Achse liegt jeder Punkt (a|a) auf der Achse.', 'Beim Spiegeln tauschen x und y die Plätze.', [`Die Verbindungslinie von P und P' steht senkrecht auf der Achse.`, `P'(${y}|${x}).`], {fields: ['x von P\'', 'y von P\''], shape: {kind: 'g-mirror', a: x, b: y, c: 2}});
      }
      const s = int(3, 6), vert = type === 0;
      const xs = vert ? 2 * s - x : x, ys = vert ? y : 2 * s - y;
      if (xs < 0 || ys < 0 || xs > 10 || ys > 10) return geoProblem(topic, seed + 1, level, index);
      return q('Punkt spiegeln', `Spiegle P(${x}|${y}) an der ${vert ? `senkrechten Achse x = ${s}` : `waagerechten Achse y = ${s}`}.`, `${xs}|${ys}`, 'Der Spiegelpunkt hat denselben Abstand zur Achse, liegt aber auf der anderen Seite.', vert ? 'Die y-Koordinate bleibt gleich.' : 'Die x-Koordinate bleibt gleich.', vert ? [`Abstand von P zur Achse: |${x} − ${s}| = ${Math.abs(x - s)}.`, `Auf der anderen Seite: x = ${s} ${x < s ? '+' : '−'} ${Math.abs(x - s)} = ${xs}.`, `P'(${xs}|${ys}).`] : [`Abstand von P zur Achse: |${y} − ${s}| = ${Math.abs(y - s)}.`, `Auf der anderen Seite: y = ${s} ${y < s ? '+' : '−'} ${Math.abs(y - s)} = ${ys}.`, `P'(${xs}|${ys}).`], {fields: ['x von P\'', 'y von P\''], shape: {kind: 'g-mirror', a: x, b: y, c: vert ? 0 : 1, d: s}});
    }
    if (k === 3) {
      const cols = 4, rows = 6, left: number[] = [];
      const target = level === 1 ? int(3, 5) : level === 2 ? int(5, 8) : int(8, 11);
      while (left.length < target) { const c = int(0, cols - 1) , rr = int(0, rows - 1), v = rr * 10 + c; if (!left.includes(v)) left.push(v); }
      const done = left.filter(() => r() < 0.3).slice(0, 3);
      const missing = left.length - done.length;
      return q('Figur ergänzen', 'Links von der roten Achse ist eine Figur gefärbt. Rechts sind schon einige Spiegelkästchen gefärbt. Wie viele Kästchen musst du rechts noch färben, damit die Figur achsensymmetrisch wird?', missing, 'Jedes gefärbte Kästchen links braucht rechts ein Spiegelkästchen mit gleichem Abstand zur Achse.', 'Zähle links alle Kästchen und ziehe die schon gefärbten Spiegelkästchen ab.', [`Links sind ${left.length} Kästchen gefärbt.`, `Rechts sind schon ${done.length} Spiegelkästchen gefärbt.`, `Es fehlen ${left.length} − ${done.length} = ${missing} Kästchen.`], {shape: {kind: 'g-half', a: cols, b: rows, v: left, w: done}});
    }
    if (k === 4) {
      const yes: PolyName[] = ['Parallelogramm', 'Rechteck', 'Raute', 'Quadrat', 'Regelmäßiges Sechseck'];
      const no: PolyName[] = ['Drachenviereck', 'Gleichschenkliges Trapez', 'Gleichseitiges Dreieck', 'Gleichschenkliges Dreieck', 'Trapez', 'Regelmäßiges Fünfeck'];
      if (level >= 2 && r() < 0.5) {
        const lYes = ['H', 'I', 'N', 'O', 'S', 'X', 'Z'], lNo = ['A', 'E', 'F', 'K', 'L', 'T', 'U', 'V', 'W', 'Y'];
        const ans = pick(lYes), wrong = [...lNo].sort(() => r() - 0.5).slice(0, 3);
        return mc('Punktsymmetrische Buchstaben', 'Welcher Großbuchstabe ist punktsymmetrisch?', ans, wrong, 'Eine punktsymmetrische Figur sieht nach einer halben Drehung (180°) um ihren Mittelpunkt genauso aus.', 'Drehe das Heft in Gedanken auf den Kopf.', [`${ans} sieht nach einer Drehung um 180° wieder gleich aus.`, `${and(wrong)} stehen nach der halben Drehung anders da.`]);
      }
      const ans = pick(yes), wrong = [...no].sort(() => r() - 0.5).slice(0, 3);
      return mc('Punktsymmetrie erkennen', 'Welche Figur ist punktsymmetrisch?', ans, wrong, 'Punktsymmetrisch: Nach einer halben Drehung (180°) um den Mittelpunkt liegt die Figur wieder genau auf sich selbst.', 'Bei Vierecken: Sind gegenüberliegende Seiten parallel und gleich lang?', [`${ans}: Gegenüberliegende Ecken liegen gleich weit vom Mittelpunkt entfernt. Nach 180° passt die Figur auf sich selbst.`, `${and(wrong.map(lcName)).replace(/^./, c => c.toUpperCase())} sind nicht punktsymmetrisch.`]);
    }
    if (k === 5) {
      const zx = int(3, 6), zy = int(3, 6), x = int(Math.max(0, 2 * zx - 10), Math.min(10, 2 * zx)), y = int(Math.max(0, 2 * zy - 10), Math.min(10, 2 * zy));
      if (x === zx && y === zy) return geoProblem(topic, seed + 1, level, index);
      const xs = 2 * zx - x, ys = 2 * zy - y;
      return q('Am Punkt spiegeln', `Spiegle P(${x}|${y}) am Punkt Z(${zx}|${zy}).`, `${xs}|${ys}`, 'Bei der Punktspiegelung liegt Z genau in der Mitte zwischen P und P\'.', 'Gehe von P zu Z und denselben Weg noch einmal weiter.', [`Von P nach Z: ${[zx > x ? `${zx - x} nach rechts` : zx < x ? `${x - zx} nach links` : '', zy > y ? `${zy - y} nach oben` : zy < y ? `${y - zy} nach unten` : ''].filter(Boolean).join(' und ')}.`, `Denselben Weg von Z aus weiter: P'(${xs}|${ys}).`], {fields: ['x von P\'', 'y von P\''], shape: {kind: 'g-mirror', a: x, b: y, c: 3, d: zx, e: zy}});
    }
    if (k === 6) {
      const pool: PolyName[] = level === 1 ? ['Quadrat', 'Gleichseitiges Dreieck', 'Rechteck'] : ['Quadrat', 'Gleichseitiges Dreieck', 'Rechteck', 'Regelmäßiges Fünfeck', 'Regelmäßiges Sechseck', 'Regelmäßiges Achteck', 'Raute', 'Parallelogramm'];
      const f = pick(pool), w = polyFacts[f].dreh, n = 360 / w;
      return q('Drehsymmetrie', `Um welchen kleinsten Winkel muss man die Figur (${f}) um ihren Mittelpunkt drehen, damit sie wieder genau auf sich selbst liegt?`, w, 'Bei einer vollen Drehung (360°) liegt jede Figur wieder auf sich selbst.', 'Zähle, wie oft die Figur während einer vollen Drehung auf sich selbst fällt, und teile 360° durch diese Zahl.', [`Die Figur passt bei einer vollen Drehung ${n}-mal auf sich selbst.`, `360° : ${n} = ${w}°.`], {unit: '°', shape: {kind: 'g-poly', a: polyNames.indexOf(f), b: 1}});
    }
    if (k === 7) {
      const props: [string, string][] = [
        ['Vier gleich lange Seiten und vier rechte Winkel', 'Quadrat'],
        ['Gegenüberliegende Seiten sind gleich lang, alle Winkel sind rechte Winkel, benachbarte Seiten sind verschieden lang', 'Rechteck'],
        ['Vier gleich lange Seiten, aber keine rechten Winkel', 'Raute'],
        ['Zwei Paare paralleler Seiten, keine rechten Winkel, benachbarte Seiten verschieden lang', 'Parallelogramm'],
        ['Genau ein Paar paralleler Seiten', 'Trapez'],
        ['Zwei Paare gleich langer benachbarter Seiten; eine Diagonale ist Symmetrieachse', 'Drachenviereck'],
      ];
      const [text, ans] = pick(props);
      const merke: Record<string, string> = {Quadrat: 'Ein Quadrat ist zugleich Rechteck, Raute, Parallelogramm, Trapez und Drachenviereck.', Rechteck: 'Jedes Rechteck ist auch ein Parallelogramm.', Raute: 'Jede Raute ist auch ein Parallelogramm und ein Drachenviereck.', Parallelogramm: 'Jedes Parallelogramm ist auch ein Trapez.', Trapez: 'Ein Trapez braucht nur ein Paar paralleler Seiten.', Drachenviereck: 'Bei einem Drachenviereck stehen die Diagonalen senkrecht aufeinander.'};
      return mc('Vierecke erkennen', `Welches Viereck wird beschrieben? „${text}.“`, ans, props.map(p => p[1]).filter(x => x !== ans).sort(() => r() - 0.5).slice(0, 3), 'Prüfe zuerst: Wie viele Paare paralleler Seiten gibt es?', 'Prüfe dann Seitenlängen und rechte Winkel.', [`Die Beschreibung passt genau ${ans === 'Raute' ? 'zur Raute' : 'zum ' + ans}.`, `Merke: ${merke[ans]}`]);
    }
    if (k === 8) {
      const st: [string, boolean, string][] = [
        ['Jedes Quadrat ist eine Raute.', true, 'Ein Quadrat hat vier gleich lange Seiten wie jede Raute.'],
        ['Jedes Rechteck ist ein Quadrat.', false, 'Ein Rechteck kann verschieden lange Seiten haben, zum Beispiel 6 cm und 3 cm.'],
        ['Jede Raute ist ein Parallelogramm.', true, 'Bei einer Raute sind gegenüberliegende Seiten parallel.'],
        ['Jedes Trapez ist ein Parallelogramm.', false, 'Ein Trapez braucht nur ein Paar paralleler Seiten.'],
        ['Jedes Parallelogramm ist ein Trapez.', true, 'Ein Parallelogramm hat sogar zwei Paare paralleler Seiten, also mindestens eines.'],
        ['Jedes Drachenviereck ist eine Raute.', false, 'Beim Drachen sind nur benachbarte Seiten paarweise gleich lang, nicht alle vier.'],
        ['Jede Raute ist ein Drachenviereck.', true, 'Bei einer Raute sind alle vier Seiten gleich lang, also auch die benachbarten paarweise.'],
        ['Jedes Rechteck ist ein Parallelogramm.', true, 'Beim Rechteck sind gegenüberliegende Seiten parallel.'],
        ['Jedes Quadrat ist ein Rechteck.', true, 'Ein Quadrat hat vier rechte Winkel.'],
        ['Jedes Parallelogramm ist ein Rechteck.', false, 'Ein Parallelogramm muss keine rechten Winkel haben.'],
      ];
      const [s, ok, why] = pick(st);
      return mc('Haus der Vierecke', `Stimmt die Aussage? „${s}“`, ok ? 'Wahr' : 'Falsch', [ok ? 'Falsch' : 'Wahr'], 'Prüfe, ob alle Eigenschaften der zweiten Figur auch bei der ersten gelten.', 'Ein Gegenbeispiel genügt, um eine „Jedes …“-Aussage zu widerlegen.', [`${ok ? 'Wahr' : 'Falsch'}. ${why}`]);
    }
    {
      const mode = level === 1 ? 0 : level === 2 ? int(0, 1) : 1;
      if (mode === 0) {
        const t = int(0, 2), a = int(4, 8);
        const b = a + pick([-3, -2, -1, 1, 2, 3]);
        const sides = t === 0 ? [a, a, a] : t === 1 ? [a, a, b] : [a, a + 1, a + 2];
        const shown = [...sides].sort(() => r() - 0.5);
        const ans = t === 0 ? 'Gleichseitiges Dreieck' : t === 1 ? 'Gleichschenkliges Dreieck' : 'Unregelmäßiges Dreieck';
        return mc('Dreiecke nach Seiten', `Ein Dreieck hat die Seitenlängen ${shown.map(x => x + ' cm').join(', ')}. Welche Dreiecksart ist es?`, ans, ['Gleichseitiges Dreieck', 'Gleichschenkliges Dreieck', 'Unregelmäßiges Dreieck'].filter(x => x !== ans), 'Vergleiche die drei Seitenlängen.', 'Drei gleiche: gleichseitig. Genau zwei gleiche: gleichschenklig. Alle verschieden: unregelmäßig.', [`Seiten ${shown.join(' cm, ')} cm: ${t === 0 ? 'alle drei gleich lang' : t === 1 ? 'genau zwei gleich lang' : 'alle verschieden lang'}.`, `Also: ${ans}.`]);
      }
      const art = int(0, 2);
      let w: number[];
      if (art === 1) { const al = 5 * int(4, 14); w = [90, al, 90 - al]; }
      else if (art === 2) { const big = 5 * int(20, 30), al = 5 * int(3, (180 - big) / 5 - 3); w = [big, al, 180 - big - al]; }
      else { const al = 5 * int(9, 17), be = 5 * int(Math.ceil((95 - al) / 5), 17); w = [al, be, 180 - al - be]; }
      w = w.sort(() => r() - 0.5);
      const max = Math.max(...w), ans = max < 90 ? 'Spitzwinkliges Dreieck' : max === 90 ? 'Rechtwinkliges Dreieck' : 'Stumpfwinkliges Dreieck';
      return mc('Dreiecke nach Winkeln', level === 3 ? `In einem Dreieck sind zwei Winkel ${w[0]}° und ${w[1]}° groß. Welche Dreiecksart ist es?` : `Ein Dreieck hat die Winkel ${w[0]}°, ${w[1]}° und ${w[2]}°. Welche Dreiecksart ist es?`, ans, ['Spitzwinkliges Dreieck', 'Rechtwinkliges Dreieck', 'Stumpfwinkliges Dreieck'].filter(x => x !== ans), 'Entscheidend ist der größte Winkel.', level === 3 ? 'Berechne zuerst den dritten Winkel: 180° minus die beiden anderen.' : 'Unter 90°: spitzwinklig. Genau 90°: rechtwinklig. Über 90°: stumpfwinklig.', [...(level === 3 ? [`Dritter Winkel: 180° − ${w[0]}° − ${w[1]}° = ${w[2]}°.`] : []), `Der größte Winkel ist ${max}°.`, `Also: ${ans}.`]);
    }
  }

  if (topic === 'solids') {
    if (k === 0) {
      const pool: SolidName[] = level === 1 ? ['Würfel', 'Quader', 'Zylinder', 'Kugel', 'Kegel'] : ['Würfel', 'Quader', 'Dreiecksprisma', 'Quadratische Pyramide', 'Dreieckspyramide', 'Zylinder', 'Kegel', 'Kugel'];
      const ans = pick(pool), f = solidFacts[ans];
      const desc = level === 3 && f.ecken > 0 ? `${f.ecken} Ecken, ${f.kanten} Kanten und ${f.flaechen} Flächen; ${f.text}` : f.text;
      return mc('Körper erkennen', `Welcher Körper hat ${desc}?`, ans, pool.filter(x => x !== ans).sort(() => r() - 0.5).slice(0, 3), 'Achte auf die Form der Flächen: Quadrate, Rechtecke, Dreiecke oder Kreise?', 'Prüfe auch: Gibt es eine Spitze oder gekrümmte Flächen?', [`${ans}: ${f.text}.`, f.ecken ? `${f.ecken} Ecken, ${f.kanten} Kanten, ${f.flaechen} Flächen.` : `Keine Ecken; ${f.kanten} ${f.kanten === 1 ? 'Kante' : 'Kanten'}.`]);
    }
    if (k === 1) {
      const pool: SolidName[] = level === 1 ? ['Würfel', 'Quader', 'Dreiecksprisma'] : ['Würfel', 'Quader', 'Dreiecksprisma', 'Quadratische Pyramide', 'Dreieckspyramide', 'Sechseckprisma'];
      const s = pick(pool), f = solidFacts[s], what = pick(['ecken', 'kanten', 'flaechen'] as const), label = what === 'ecken' ? 'Ecken' : what === 'kanten' ? 'Kanten' : 'Flächen';
      return q(`${label} zählen`, `Wie viele ${label} hat ${einArtikel(s)}?`, f[what], what === 'ecken' ? 'Ecken sind die Punkte, an denen Kanten zusammenstoßen.' : what === 'kanten' ? 'Kanten sind die Linien, an denen zwei Flächen zusammenstoßen.' : 'Zähle Grundfläche, Deckfläche und alle Seitenflächen.', 'Zähle systematisch: zuerst unten, dann oben, dann die Seiten.', [`${s}: ${f.ecken} Ecken, ${f.kanten} Kanten, ${f.flaechen} Flächen.`, `Probe mit der Eulerschen Formel: Ecken + Flächen − Kanten = ${f.ecken} + ${f.flaechen} − ${f.kanten} = 2.`], {shape: {kind: 'g-solid', a: Object.keys(solidFacts).indexOf(s)}});
    }
    if (k === 2) {
      const valid = r() < 0.5, cells = makeNet(r, valid);
      return mc('Würfelnetz prüfen', 'Kann man aus diesem Netz einen Würfel falten?', valid ? 'Ja' : 'Nein', [valid ? 'Nein' : 'Ja'], 'Ein Würfelnetz besteht aus 6 Quadraten. Beim Falten darf sich keine Fläche doppelt überdecken und keine fehlen.', 'Wähle ein Quadrat als Boden und klappe die anderen in Gedanken hoch.', valid ? ['Wählt man ein Quadrat als Boden, lassen sich die anderen fünf zu vier Seitenwänden und einem Deckel hochklappen.', 'Keine Fläche überdeckt eine andere: Es ist ein Würfelnetz.'] : ['Beim Falten liegen zwei Quadrate auf derselben Würfelseite.', 'Dafür bleibt eine Würfelseite offen: Es ist kein Würfelnetz.'], {shape: {kind: 'g-net', a: 0, v: encodeCells(cells)}});
    }
    if (k === 3) {
      const cells = makeNet(r, true), faces = foldNet(cells)!, mark = int(0, 5), opp = faces.indexOf(oppositeFace(faces[mark]));
      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
      const lab = cells.map((_, i) => i === mark ? 0 : 1);
      const names = cells.map((_, i) => letters[i]);
      return mc('Gegenüberliegende Flächen', `Das Netz wird zu einem Würfel gefaltet. Welche Fläche liegt dann der Fläche ${names[mark]} gegenüber?`, names[opp], names.filter((_, i) => i !== mark && i !== opp), 'Gegenüberliegende Flächen berühren sich nicht. Im Netz grenzen sie nie aneinander.', 'Liegen drei Quadrate in einer Reihe, sind das erste und das dritte gegenüber.', [`Nach dem Falten liegt ${names[opp]} gegenüber von ${names[mark]}.`, 'Die anderen vier Flächen grenzen an ' + names[mark] + ' und bilden die Seitenwände.'], {shape: {kind: 'g-net', a: 1, v: encodeCells(cells), w: lab}});
    }
    if (k === 4) {
      const cells = makeNet(r, true), faces = foldNet(cells)!;
      const pairs = [[1, 6], [2, 5], [3, 4]].sort(() => r() - 0.5).map(p => r() < 0.5 ? p : [p[1], p[0]]);
      const num = faces.map(f => pairs[f >> 1][f & 1]);
      const ask = int(0, 5), opp = faces.indexOf(oppositeFace(faces[ask]));
      const others = cells.map((_, i) => i).filter(i => i !== ask && i !== opp);
      const extra = pick(others);
      const shown = cells.map((_, i) => i === ask ? -1 : i === opp || i === extra ? num[i] : 0);
      return q('Spielwürfel', 'Bei einem Spielwürfel ergeben gegenüberliegende Augenzahlen zusammen immer 7. Welche Augenzahl gehört auf das Feld mit dem Fragezeichen?', num[ask], 'Gegenüberliegende Augenzahlen ergeben zusammen 7: 1 und 6, 2 und 5, 3 und 4.', 'Finde zuerst heraus, welches Feld nach dem Falten gegenüber vom Fragezeichen liegt.', [`Gegenüber vom Fragezeichen liegt das Feld mit der ${num[opp]}.`, `7 − ${num[opp]} = ${num[ask]}.`], {shape: {kind: 'g-net', a: 2, v: encodeCells(cells), w: shown}});
    }
    if (k === 5) {
      const cube = level === 1, a = 2 * int(2, 5), b = 2 * int(2, 5), c = 2 * int(1, 4);
      if (cube) return q('Schrägbild', `Ein Würfel mit ${a} cm Kantenlänge wird im Schrägbild gezeichnet. Wie lang zeichnest du die Kanten, die nach hinten verlaufen?`, a / 2, 'Im Schrägbild werden die nach hinten laufenden Kanten im Winkel von 45° gezeichnet.', 'Sie werden auf die Hälfte verkürzt.', [`Vordere Fläche in Originalgröße: ${a} cm × ${a} cm.`, `Nach hinten: ${a} cm : 2 = ${a / 2} cm.`], {unit: 'cm', shape: {kind: 'cuboid', a, b: a, c: a}});
      return q('Schrägbild', `Ein Quader ist ${a} cm breit, ${b} cm hoch und ${c * 2} cm tief. Du zeichnest ihn im Schrägbild. Wie lang zeichnest du die Kanten, die nach hinten verlaufen?`, c, 'Breite und Höhe der Vorderfläche zeichnest du in Originalgröße.', 'Die Tiefe wird im 45°-Winkel und auf die Hälfte verkürzt gezeichnet.', [`Vorderfläche: ${a} cm × ${b} cm (Originalgröße).`, `Tiefe: ${c * 2} cm : 2 = ${c} cm, im Winkel von 45°.`], {unit: 'cm', shape: {kind: 'cuboid', a, b: c * 2, c: b}});
    }
    if (k === 6) {
      const cube = level === 1 || r() < 0.3, a = int(2, 9), b = int(2, 9), c = int(2, 9);
      if (cube) return q('Kantenmodell', `Aus Draht soll ein Kantenmodell eines Würfels mit ${a} cm Kantenlänge gebaut werden. Wie viel Draht brauchst du?`, 12 * a, 'Ein Würfel hat 12 gleich lange Kanten.', 'Multipliziere die Kantenlänge mit 12.', [`12 · ${a} cm = ${12 * a} cm.`], {unit: 'cm'});
      return q('Kantenmodell', `Aus Draht soll ein Kantenmodell eines Quaders (${a} cm × ${b} cm × ${c} cm) gebaut werden. Wie viel Draht brauchst du?`, 4 * (a + b + c), 'Ein Quader hat 12 Kanten: je 4 gleich lange Kanten in jeder Richtung.', 'Rechne 4 · Länge + 4 · Breite + 4 · Höhe.', [`4 · ${a} cm + 4 · ${b} cm + 4 · ${c} cm`, `= ${4 * a} cm + ${4 * b} cm + ${4 * c} cm = ${4 * (a + b + c)} cm.`], {unit: 'cm', shape: {kind: 'cuboid', a, b, c}});
    }
    if (k === 7) {
      const rows = level === 1 ? 2 : 3, cols = level === 1 ? 2 : 3, maxH = level === 1 ? 2 : 3;
      const h: number[] = Array.from({length: rows * cols}, () => int(level === 3 ? 0 : 1, maxH));
      if (!h.some(x => x > 0)) h[0] = 1;
      const sum = h.reduce((s, x) => s + x, 0), top = Math.max(...h);
      if (level === 3) {
        const need = top * rows * cols - sum;
        if (need === 0) return geoProblem(topic, seed + 1, level, index);
        return q('Würfelgebäude ergänzen', `Der Bauplan zeigt, wie viele Würfel auf jedem Feld stehen. Wie viele Würfel fehlen, damit ein Quader mit ${rows} · ${cols} Feldern und Höhe ${top} entsteht?`, need, 'Ein vollständiger Quader hat auf jedem Feld gleich viele Würfel.', `Ein Quader braucht ${rows} · ${cols} · ${top} = ${rows * cols * top} Würfel.`, [`Vorhanden: ${h.join(' + ')} = ${sum} Würfel.`, `Quader: ${rows} · ${cols} · ${top} = ${rows * cols * top} Würfel.`, `Es fehlen ${rows * cols * top} − ${sum} = ${need} Würfel.`], {shape: {kind: 'g-building', a: rows, b: cols, v: h}});
      }
      return q('Würfelgebäude', 'Der Bauplan zeigt von oben, wie viele Würfel auf jedem Feld übereinanderstehen. Aus wie vielen Würfeln besteht das Gebäude?', sum, 'Im Bauplan steht auf jedem Feld die Anzahl der Würfel in diesem Turm.', 'Addiere alle Zahlen des Bauplans.', [`${h.join(' + ')} = ${sum} Würfel.`], {shape: {kind: 'g-building', a: rows, b: cols, v: h}});
    }
    if (k === 8) {
      const n = level === 1 ? pick([3, 4]) : int(3, level === 2 ? 8 : 12), prism = r() < 0.5, what = pick(['ecken', 'kanten', 'flaechen'] as const);
      const E = prism ? 2 * n : n + 1, K = prism ? 3 * n : 2 * n, F = prism ? n + 2 : n + 1, ans = what === 'ecken' ? E : what === 'kanten' ? K : F;
      const label = what === 'ecken' ? 'Ecken' : what === 'kanten' ? 'Kanten' : 'Flächen';
      return q(prism ? 'Prismen' : 'Pyramiden', `${prism ? 'Ein Prisma' : 'Eine Pyramide'} hat ein ${eck(n)} als Grundfläche. Wie viele ${label} hat ${prism ? 'das Prisma' : 'die Pyramide'}?`, ans, prism ? 'Ein Prisma hat zwei gleiche Vielecke als Grund- und Deckfläche, verbunden durch Rechtecke.' : 'Eine Pyramide hat ein Vieleck als Grundfläche und eine Spitze; die Seitenflächen sind Dreiecke.', what === 'ecken' ? (prism ? 'Unten und oben je n Ecken.' : 'n Ecken unten und eine Spitze.') : what === 'kanten' ? (prism ? 'n Kanten unten, n oben und n senkrechte.' : 'n Kanten unten und n Kanten zur Spitze.') : (prism ? 'n Rechtecke plus Grund- und Deckfläche.' : 'n Dreiecke plus die Grundfläche.'), [what === 'ecken' ? (prism ? `${n} + ${n} = ${E} Ecken.` : `${n} + 1 = ${E} Ecken.`) : what === 'kanten' ? (prism ? `${n} + ${n} + ${n} = ${K} Kanten.` : `${n} + ${n} = ${K} Kanten.`) : (prism ? `${n} + 2 = ${F} Flächen.` : `${n} + 1 = ${F} Flächen.`), `Probe: Ecken + Flächen − Kanten = ${E} + ${F} − ${K} = 2.`]);
    }
    {
      const items: [string, SolidName][] = [['eine Konservendose', 'Zylinder'], ['eine Schultüte', 'Kegel'], ['ein Fußball', 'Kugel'], ['ein Schuhkarton', 'Quader'], ['ein Spielwürfel', 'Würfel'], ['ein Dachzelt mit dreieckiger Vorderseite', 'Dreiecksprisma'], ['die Cheops-Pyramide in Ägypten', 'Quadratische Pyramide'], ['eine Litfaßsäule', 'Zylinder'], ['ein Zauberwürfel', 'Würfel'], ['eine Eistüte', 'Kegel'], ['ein Ziegelstein', 'Quader']];
      const [thing, ans] = pick(items);
      return mc('Körper in der Umwelt', `Welche Körperform hat ${thing} ungefähr?`, ans, (['Würfel', 'Quader', 'Zylinder', 'Kegel', 'Kugel', 'Dreiecksprisma', 'Quadratische Pyramide'] as SolidName[]).filter(x => x !== ans).sort(() => r() - 0.5).slice(0, 3), 'Stell dir den Gegenstand vor: Welche Flächen hat er? Gibt es eine Spitze?', 'Gekrümmte Flächen: Zylinder, Kegel oder Kugel. Nur ebene Flächen: Würfel, Quader, Prisma oder Pyramide.', [`${thing[0].toUpperCase() + thing.slice(1)}: ${ans}.`, `${einArtikel(ans)[0].toUpperCase()}${einArtikel(ans).slice(1)} hat ${solidFacts[ans].text}.`]);
    }
  }
  return null;
}

// Größen-Werkstatt: Einheiten, exakte Prüfung von Eingaben und Fehlerdiagnose.
// Alle Werte werden intern als ganze Zahlen in der kleinsten Einheit gespeichert
// (mm, mg, ct, mm², mm³). So entstehen keine Rundungsfehler bei Kommazahlen.

export type Bereich = 'laenge' | 'masse' | 'geld' | 'flaeche' | 'volumen';
export type Unit = {id: string; label: string; factor: number; name: string};

export const units: Record<Bereich, Unit[]> = {
  laenge: [
    {id: 'mm', label: 'mm', factor: 1, name: 'Millimeter'},
    {id: 'cm', label: 'cm', factor: 10, name: 'Zentimeter'},
    {id: 'dm', label: 'dm', factor: 100, name: 'Dezimeter'},
    {id: 'm', label: 'm', factor: 1000, name: 'Meter'},
    {id: 'km', label: 'km', factor: 1_000_000, name: 'Kilometer'},
  ],
  masse: [
    {id: 'mg', label: 'mg', factor: 1, name: 'Milligramm'},
    {id: 'g', label: 'g', factor: 1000, name: 'Gramm'},
    {id: 'kg', label: 'kg', factor: 1_000_000, name: 'Kilogramm'},
    {id: 't', label: 't', factor: 1_000_000_000, name: 'Tonne'},
  ],
  geld: [
    {id: 'ct', label: 'ct', factor: 1, name: 'Cent'},
    {id: 'eur', label: '€', factor: 100, name: 'Euro'},
  ],
  flaeche: [
    {id: 'mm2', label: 'mm²', factor: 1, name: 'Quadratmillimeter'},
    {id: 'cm2', label: 'cm²', factor: 100, name: 'Quadratzentimeter'},
    {id: 'dm2', label: 'dm²', factor: 10_000, name: 'Quadratdezimeter'},
    {id: 'm2', label: 'm²', factor: 1_000_000, name: 'Quadratmeter'},
    {id: 'a', label: 'a', factor: 100_000_000, name: 'Ar'},
    {id: 'ha', label: 'ha', factor: 10_000_000_000, name: 'Hektar'},
    {id: 'km2', label: 'km²', factor: 1_000_000_000_000, name: 'Quadratkilometer'},
  ],
  volumen: [
    {id: 'mm3', label: 'mm³', factor: 1, name: 'Kubikmillimeter'},
    {id: 'cm3', label: 'cm³', factor: 1000, name: 'Kubikzentimeter'},
    {id: 'ml', label: 'ml', factor: 1000, name: 'Milliliter'},
    {id: 'dm3', label: 'dm³', factor: 1_000_000, name: 'Kubikdezimeter'},
    {id: 'l', label: 'l', factor: 1_000_000, name: 'Liter'},
    {id: 'm3', label: 'm³', factor: 1_000_000_000, name: 'Kubikmeter'},
  ],
};

/** Die Stufen der Einheitentreppe (ohne Doppelnamen wie ml/cm³). */
export const stairs: Record<Bereich, string[]> = {
  laenge: ['km', 'm', 'dm', 'cm', 'mm'],
  masse: ['t', 'kg', 'g', 'mg'],
  geld: ['eur', 'ct'],
  flaeche: ['km2', 'ha', 'a', 'm2', 'dm2', 'cm2', 'mm2'],
  volumen: ['m3', 'dm3', 'cm3', 'mm3'],
};

export const bereichInfo: Record<Bereich, {title: string; short: string; uz: string; grade: string; color: string}> = {
  laenge: {title: 'Längen', short: 'Längen', uz: 'Meistens 10, zwischen m und km 1000', grade: 'Klasse 5', color: 'blue'},
  masse: {title: 'Gewichte (Masse)', short: 'Gewichte', uz: '1000', grade: 'Klasse 5', color: 'teal'},
  geld: {title: 'Rechnen mit Geld', short: 'Geld', uz: '100', grade: 'Klasse 5', color: 'yellow'},
  flaeche: {title: 'Flächen', short: 'Flächen', uz: '100', grade: 'Klasse 5', color: 'purple'},
  volumen: {title: 'Volumen (Rauminhalt)', short: 'Volumen', uz: '1000', grade: 'Klasse 5/6', color: 'blue'},
};

export function unit(b: Bereich, id: string): Unit {
  const u = units[b].find(x => x.id === id);
  if (!u) throw new Error(`Unbekannte Einheit ${b}/${id}`);
  return u;
}

/** Formatiert eine Zahl deutsch (Tausenderpunkt, Komma). */
export function fmtNum(n: number, maxDecimals = 6): string {
  return n.toLocaleString('de-DE', {maximumFractionDigits: maxDecimals});
}

/** Wert (in kleinster Einheit) in einer Zieleinheit als deutsche Zahl, exakt. */
export function inUnit(base: number, b: Bereich, id: string): string {
  const f = unit(b, id).factor;
  const neg = base < 0;
  const abs = BigInt(Math.abs(base));
  const fb = BigInt(f);
  const whole = abs / fb;
  let rest = abs % fb;
  let decimals = '';
  if (rest > 0n) {
    const digits = String(f).length - 1;
    decimals = rest.toString().padStart(digits, '0').replace(/0+$/, '');
  }
  if (b === 'geld' && id === 'eur') decimals = decimals.padEnd(2, '0');
  const w = Number(whole).toLocaleString('de-DE');
  return (neg ? '−' : '') + w + (decimals ? ',' + decimals : '');
}

/** Größe mit Einheit, z. B. "3,45 m" oder "4,50 €". */
export function size(base: number, b: Bereich, id: string): string {
  return `${inUnit(base, b, id)} ${unit(b, id).label}`;
}

export type Parsed = {mantissa: bigint; scale: number} | null;

/** Liest eine Schülereingabe wie "3,5", "1.250", "1 250" oder "0,75". */
export function parseInput(raw: string): Parsed {
  let s = raw.trim().replace(/\s+/g, '').replace(/[€]/g, '');
  if (!s) return null;
  // Tausenderpunkte (1.250 oder 12.500.000) zulassen, aber "3.5" als Dezimalpunkt deuten.
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, '');
  else if (/^\d+\.\d+$/.test(s) && !s.includes(',')) s = s.replace('.', ',');
  if (!/^\d+(,\d+)?$/.test(s)) return null;
  const [w, d = ''] = s.split(',');
  return {mantissa: BigInt(w + d), scale: d.length};
}

/** Wandelt eine Eingabe in die kleinste Einheit um. null = keine gültige Zahl. */
export function toBase(raw: string, b: Bereich, id: string): number | null {
  const p = parseInput(raw);
  if (!p) return null;
  const f = BigInt(unit(b, id).factor);
  const num = p.mantissa * f;
  const den = 10n ** BigInt(p.scale);
  if (num % den !== 0n) return NaN; // feiner als die kleinste Einheit (z. B. 0,001 ct)
  return Number(num / den);
}

export function plainNumber(raw: string): number | null {
  const p = parseInput(raw);
  if (!p) return null;
  return Number(p.mantissa) / 10 ** p.scale;
}

// ---------- Aufgabenmodell ----------

export type Trap = {value: number; message: string};
export type SizeField = {kind: 'size'; id: string; label?: string; bereich: Bereich; unit: string; answer: number; traps?: Trap[]};
export type NumberField = {kind: 'number'; id: string; label?: string; suffix?: string; answer: number; traps?: Trap[]};
export type ChoiceField = {kind: 'choice'; id: string; label?: string; options: string[]; answer: number; explain?: string[]};
export type OrderField = {kind: 'order'; id: string; label?: string; items: string[]; order: number[]};
export type WalletField = {kind: 'wallet'; id: string; label?: string; target: number; fewest?: boolean};
export type Field = SizeField | NumberField | ChoiceField | OrderField | WalletField;

export type Visual =
  | {type: 'ruler'; start: number; length: number; object: 'stift' | 'nagel' | 'schluessel' | 'radiergummi'}
  | {type: 'balance'; left: {label: string; grams?: number}[]; right: number[]}
  | {type: 'coins'; items: number[]}
  | {type: 'receipt'; lines: [string, number][]; paid?: number}
  | {type: 'grid'; full: [number, number][]; half?: [number, number, 'tl' | 'tr' | 'bl' | 'br'][]; w: number; h: number; second?: [number, number][]}
  | {type: 'rect'; a: string; b: string; ratio: number; label?: string}
  | {type: 'lshape'; dims: {W: number; H: number; cutW: number; cutH: number}; unit: string}
  | {type: 'frame'; W: number; H: number; w: number; h: number; unit: string}
  | {type: 'cuboid'; a: number; b: number; c: number; missing?: number}
  | {type: 'box'; a: string; b: string; c: string}
  | {type: 'jug'; ml: number; max: number; step: number}
  | {type: 'stairs'; bereich: Bereich; from?: string; to?: string}
  | {type: 'map'; cm: number; scale: number};

export type Level = 1 | 2 | 3;
export type Task = {
  id: string;
  bereich: Bereich;
  skill: string;
  level: Level;
  prompt: string;
  visual?: Visual;
  fields: Field[];
  hints: [string, string, string];
  solution: string[];
};

export type Answers = Record<string, string | number[] | number | undefined>;

export function fieldComplete(f: Field, a: Answers): boolean {
  const v = a[f.id];
  if (f.kind === 'choice') return typeof v === 'number';
  if (f.kind === 'order') return Array.isArray(v) && v.length === f.items.length;
  if (f.kind === 'wallet') return Array.isArray(v) && v.length > 0;
  return typeof v === 'string' && v.trim() !== '';
}

const coinValues = [50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
export const euroItems = coinValues;

/** Kleinste Anzahl an Münzen/Scheinen für einen Betrag (Euro-System ist gierig lösbar). */
export function fewestCoins(ct: number): number[] {
  const out: number[] = [];
  let rest = ct;
  for (const c of coinValues) while (rest >= c) { out.push(c); rest -= c; }
  return out;
}

export type FieldResult = {ok: boolean; message?: string};

export function checkField(f: Field, a: Answers): FieldResult {
  const v = a[f.id];
  if (f.kind === 'choice') {
    const ok = v === f.answer;
    return {ok, message: ok ? f.explain?.[f.answer] : (typeof v === 'number' ? f.explain?.[v] : undefined)};
  }
  if (f.kind === 'order') {
    const ok = Array.isArray(v) && v.length === f.order.length && v.every((x, i) => x === f.order[i]);
    return {ok, message: ok ? undefined : 'Vergleiche immer in derselben Einheit. Rechne dazu jede Größe zuerst in die kleinste Einheit um.'};
  }
  if (f.kind === 'wallet') {
    const coins = Array.isArray(v) ? v : [];
    const sum = coins.reduce((s, c) => s + c, 0);
    if (sum !== f.target) {
      const diff = f.target - sum;
      return {ok: false, message: diff > 0 ? `Es fehlen noch ${size(diff, 'geld', diff >= 100 ? 'eur' : 'ct')}.` : `Das sind ${size(-diff, 'geld', -diff >= 100 ? 'eur' : 'ct')} zu viel.`};
    }
    if (f.fewest && coins.length > fewestCoins(f.target).length) {
      return {ok: false, message: `Der Betrag stimmt. Es geht aber mit weniger Stücken: ${fewestCoins(f.target).length} reichen. Beginne mit dem größten Schein oder der größten Münze, die noch passt.`};
    }
    return {ok: true};
  }
  const raw = typeof v === 'string' ? v : '';
  if (f.kind === 'number') {
    const n = plainNumber(raw);
    if (n === null) return {ok: false, message: 'Gib eine Zahl ein, zum Beispiel 12 oder 3,5.'};
    if (Math.abs(n - f.answer) < 1e-9) return {ok: true};
    const trap = f.traps?.find(t => Math.abs(t.value - n) < 1e-9);
    return {ok: false, message: trap?.message};
  }
  const base = toBase(raw, f.bereich, f.unit);
  if (base === null) return {ok: false, message: 'Gib nur die Zahl ein, zum Beispiel 3,5. Die Einheit steht schon daneben.'};
  if (Number.isNaN(base)) return {ok: false, message: 'Deine Zahl hat zu viele Stellen nach dem Komma. Prüfe die Umrechnung noch einmal.'};
  if (base === f.answer) return {ok: true};
  const trap = f.traps?.find(t => t.value === base);
  if (trap) return {ok: false, message: trap.message};
  return {ok: false, message: diagnose(base, f.answer, f.bereich)};
}

/** Erkennt typische Umrechnungsfehler am Verhältnis von Eingabe und Lösung. */
export function diagnose(given: number, correct: number, b: Bereich): string | undefined {
  if (!given || !correct) return undefined;
  const r = given / correct;
  const powers = [10, 100, 1000, 10000, 100000, 1000000];
  const big = powers.find(p => Math.abs(r - p) < 1e-9);
  const small = powers.find(p => Math.abs(r - 1 / p) < 1e-9);
  const uz: Record<Bereich, string> = {
    laenge: 'Bei Längen ist die Umrechnungszahl 10 (zwischen m und km 1000).',
    masse: 'Bei Gewichten ist die Umrechnungszahl 1000.',
    geld: '1 € sind 100 ct.',
    flaeche: 'Bei Flächen ist die Umrechnungszahl 100, weil ein Quadrat in beide Richtungen zehnmal so lang ist.',
    volumen: 'Bei Volumen ist die Umrechnungszahl 1000, weil ein Würfel in drei Richtungen zehnmal so lang ist.',
  };
  if (big) return `Deine Zahl ist ${fmtNum(big)}-mal zu groß. ${uz[b]} Prüfe auch die Richtung: Zur größeren Einheit wird die Maßzahl kleiner.`;
  if (small) return `Deine Zahl ist ${fmtNum(small)}-mal zu klein. ${uz[b]} Prüfe auch die Richtung: Zur kleineren Einheit wird die Maßzahl größer.`;
  if (Math.abs(given - correct) / correct < 0.1) return 'Du bist ganz nah dran. Prüfe die letzte Rechnung oder die Ziffern nach dem Komma.';
  return undefined;
}

export function checkTask(t: Task, a: Answers): {ok: boolean; results: FieldResult[]} {
  const results = t.fields.map(f => checkField(f, a));
  return {ok: results.every(r => r.ok), results};
}

/** Musterantwort, z. B. für die Lösungsanzeige. */
export function answerText(f: Field): string {
  if (f.kind === 'size') return size(f.answer, f.bereich, f.unit);
  if (f.kind === 'number') return fmtNum(f.answer) + (f.suffix ? ' ' + f.suffix : '');
  if (f.kind === 'choice') return f.options[f.answer];
  if (f.kind === 'order') return f.order.map(i => f.items[i]).join(' < ');
  return fewestCoins(f.target).map(c => coinLabel(c)).join(' + ');
}

export function coinLabel(ct: number): string {
  return ct >= 100 ? `${fmtNum(ct / 100)} €` : `${ct} ct`;
}

// ---------- Zufall (reproduzierbar) ----------

export type Rng = {int: (min: number, max: number) => number; pick: <T>(xs: readonly T[]) => T; shuffle: <T>(xs: readonly T[]) => T[]; next: () => number};

export function rng(seed: number): Rng {
  let s = (seed >>> 0) || 1;
  const next = () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
  const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1));
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(next() * xs.length)];
  const shuffle = <T,>(xs: readonly T[]) => {
    const a = [...xs];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  return {int, pick, shuffle, next};
}

/** Mischt Antwortoptionen und merkt sich die richtige Position. */
export function choice(r: Rng, id: string, correct: string, wrong: string[], explainWrong?: Record<string, string>, label?: string): ChoiceField {
  const opts = r.shuffle([correct, ...wrong]);
  return {
    kind: 'choice', id, label, options: opts, answer: opts.indexOf(correct),
    explain: explainWrong ? opts.map(o => explainWrong[o] ?? '') : undefined,
  };
}

/** Sortieraufgabe: items werden gemischt, order gibt aufsteigende Reihenfolge an. */
export function orderField(r: Rng, id: string, items: {label: string; value: number}[], label?: string): OrderField {
  const mixed = r.shuffle(items);
  const order = mixed.map((_, i) => i).sort((x, y) => mixed[x].value - mixed[y].value);
  return {kind: 'order', id, label, items: mixed.map(m => m.label), order};
}

// Aufgabengeneratoren der Größen-Werkstatt. Jede Fähigkeit liefert für drei Niveaus
// (1 Grundlagen, 2 Standard, 3 Knobeln) neue Aufgaben mit drei gestuften Hilfen,
// einer Musterlösung und Hinweisen zu typischen Fehlern.
import {
  type Bereich, type Field, type Level, type Rng, type SizeField, type NumberField, type Task, type Trap, type Visual,
  choice, coinLabel, fewestCoins, fmtNum, inUnit, orderField, rng, size, stairs, unit,
} from './groessen-core.ts';

type Draft = Omit<Task, 'id' | 'bereich' | 'skill' | 'level'>;
export type Skill = {id: string; bereich: Bereich; title: string; goal: string; vertiefung?: boolean; make: (r: Rng, level: Level) => Draft};

// Fallen, die zufällig der richtigen Lösung entsprechen, werden entfernt (z. B. 4 × 4: U = 16 cm, A = 16 cm²).
const clean = (answer: number, traps?: Trap[]) => traps?.filter(t => Math.abs(t.value - answer) > 1e-9);
const sf = (id: string, bereich: Bereich, u: string, answer: number, traps?: Trap[], label?: string): SizeField => ({kind: 'size', id, bereich, unit: u, answer, traps: clean(answer, traps), label});
const nf = (id: string, answer: number, suffix?: string, traps?: Trap[], label?: string): NumberField => ({kind: 'number', id, answer, suffix, traps: clean(answer, traps), label});
const H = (a: string, b: string, c: string): [string, string, string] => [a, b, c];
const euro = (ct: number) => size(ct, 'geld', 'eur');

// ---------- Hilfen zum Umrechnen über die Einheitentreppe ----------
const stairId = (b: Bereich, u: string) => (u === 'ml' ? 'cm3' : u === 'l' ? 'dm3' : u);

function convHelp(b: Bereich, from: string, to: string, base: number) {
  const s = stairs[b];
  const i = s.indexOf(stairId(b, from)), j = s.indexOf(stairId(b, to));
  const down = j > i;
  const ratio = down ? unit(b, from).factor / unit(b, to).factor : unit(b, to).factor / unit(b, from).factor;
  const stepsCount = Math.abs(j - i);
  const value = inUnit(base, b, from);
  if (i === j) return {
    down: true, ratio: 1,
    hints: H(`${unit(b, from).label} und ${unit(b, to).label} stehen auf derselben Stufe der Einheitentreppe.`, `1 ${unit(b, from).label} = 1 ${unit(b, to).label}. Nur der Name ist anders.`, 'Die Maßzahl bleibt gleich.'),
    solution: [`1 ${unit(b, from).label} = 1 ${unit(b, to).label}`, `Also: ${size(base, b, from)} = ${size(base, b, to)}`],
  };
  const steps: string[] = [];
  const [lo, hi] = down ? [i, j] : [j, i];
  for (let k = lo; k < hi; k++) {
    const f = unit(b, s[k]).factor / unit(b, s[k + 1]).factor;
    steps.push(`1 ${unit(b, s[k]).label} = ${fmtNum(f)} ${unit(b, s[k + 1]).label}`);
  }
  return {
    down, ratio,
    hints: H(
      `Suche ${unit(b, from).label} und ${unit(b, to).label} auf der Einheitentreppe. Ist ${unit(b, to).label} die größere oder die kleinere Einheit?`,
      `Von ${unit(b, from).label} nach ${unit(b, to).label} gehst du ${stepsCount === 1 ? 'eine Stufe' : stepsCount + ' Stufen'} ${down ? 'nach unten' : 'nach oben'}. ${down ? 'Kleinere Einheit, also größere Maßzahl: mal' : 'Größere Einheit, also kleinere Maßzahl: geteilt durch'} ${fmtNum(ratio)}.`,
      `Rechne ${value} ${down ? '·' : ':'} ${fmtNum(ratio)}. ${down ? 'Beim Malnehmen mit ' + fmtNum(ratio) + ' rückt das Komma nach rechts.' : 'Beim Teilen durch ' + fmtNum(ratio) + ' rückt das Komma nach links.'}`,
    ),
    solution: [...steps, `${value} ${down ? '·' : ':'} ${fmtNum(ratio)} = ${inUnit(base, b, to)}`, `Also: ${size(base, b, from)} = ${size(base, b, to)}`],
  };
}

function conv(b: Bereich, from: string, to: string, base: number, extra?: Trap[]): Draft {
  const h = convHelp(b, from, to, base);
  return {
    prompt: `Rechne um: ${size(base, b, from)} = ? ${unit(b, to).label}`,
    visual: {type: 'stairs', bereich: b, from: stairId(b, from), to: stairId(b, to)},
    fields: [sf('a', b, to, base, extra)],
    hints: h.hints, solution: h.solution,
  };
}

/** "3 m 25 cm" aus einem Basiswert. */
function mixed(base: number, b: Bereich, big: string, small: string): string {
  const fb = unit(b, big).factor, fs = unit(b, small).factor;
  const w = Math.floor(base / fb), rest = Math.round((base - w * fb) / fs);
  return `${fmtNum(w)} ${unit(b, big).label} ${fmtNum(rest)} ${unit(b, small).label}`;
}

function mixedToDecimal(b: Bereich, big: string, small: string, base: number, wrongBase?: number): Draft {
  const m = mixed(base, b, big, small);
  const traps = wrongBase !== undefined ? [{value: wrongBase, message: `${size(wrongBase, b, big)} sind ${mixed(wrongBase, b, big, small)}. Achte auf die Stellen: ${mixed(base, b, big, small).split(' ').slice(2).join(' ')} gehören weiter hinter das Komma.`}] : undefined;
  const digits = String(unit(b, big).factor / unit(b, small).factor).length - 1;
  return {
    prompt: `Schreibe mit Komma: ${m} = ? ${unit(b, big).label}`,
    fields: [sf('a', b, big, base, traps)],
    hints: H(
      `Vor dem Komma stehen die ganzen ${unit(b, big).name}, dahinter der Rest.`,
      `1 ${unit(b, big).label} = ${fmtNum(unit(b, big).factor / unit(b, small).factor)} ${unit(b, small).label}. Hinter dem Komma brauchst du deshalb ${digits} Stelle${digits > 1 ? 'n' : ''}.`,
      `Fülle mit Nullen auf: ${m.split(' ').slice(2).join(' ')} schreibst du als ${digits} Ziffern hinter dem Komma.`,
    ),
    solution: [`${m}: ganze ${unit(b, big).name} vor das Komma`, `Rest mit ${digits} Stelle${digits > 1 ? 'n' : ''} hinter das Komma`, `${m} = ${size(base, b, big)}`],
  };
}

// ---------- Vorstellung & Stützpunkte ----------
const anchors: Record<Bereich, Record<string, string>> = {
  laenge: {mm: '1 mm ist etwa die Dicke einer Bankkarte', cm: '1 cm ist etwa die Breite deines kleinen Fingers', dm: '1 dm ist etwa die Breite deiner Hand ohne Daumen', m: '1 m ist etwa ein großer Schritt', km: '1 km gehst du in etwa einer Viertelstunde'},
  masse: {mg: 'Ein Reiskorn wiegt etwa 20 mg', g: 'Eine Büroklammer wiegt etwa 1 g', kg: '1 Liter Wasser wiegt 1 kg', t: 'Ein kleines Auto wiegt etwa 1 t'},
  geld: {}, flaeche: {}, volumen: {},
};

function unitChoice(r: Rng, b: Bereich, sentence: string, value: string, correct: string, options: string[]): Draft {
  const fill = (u: string) => sentence.replace('___', `${value} ${unit(b, u).label}`);
  const f = choice(r, 'a', unit(b, correct).label, options.filter(o => o !== correct).map(o => unit(b, o).label),
    Object.fromEntries(options.map(o => [unit(b, o).label, o === correct ? `Richtig. ${anchors[b][o]}.` : `${value} ${unit(b, o).label} passt nicht. ${anchors[b][o]}.`])));
  return {
    prompt: `${sentence.replace('___', value + ' ___')} Welche Einheit passt?`,
    fields: [f],
    hints: H('Stell dir den Gegenstand vor. Ist er kleiner als dein Finger, so groß wie du oder viel größer?', `Nutze Stützpunkte: ${options.map(o => anchors[b][o]).join('; ')}.`, `Probiere jede Einheit aus: Wären ${value} ${unit(b, options[0]).label} realistisch?`),
    solution: [fill(correct), anchors[b][correct] + '.'],
  };
}

function realistic(r: Rng, question: string, correct: string, wrong: string[], why: string): Draft {
  return {
    prompt: `${question} Wähle die realistische Angabe.`,
    fields: [choice(r, 'a', correct, wrong, Object.fromEntries(wrong.map(w => [w, `${w} ist ${why}`])))],
    hints: H('Vergleiche mit etwas, das du gut kennst.', 'Lies jede Angabe laut vor und stell sie dir vor. Welche ist viel zu groß oder viel zu klein?', 'Achte besonders auf die Einheit: Eine falsche Einheit macht aus einer passenden Zahl eine unmögliche Angabe.'),
    solution: [`${correct} ist realistisch.`, `Alle anderen Angaben sind viel zu groß oder viel zu klein.`],
  };
}

// =====================================================================
// LÄNGEN
// =====================================================================
const laenge: Skill[] = [
  {id: 'l-vorstellen', bereich: 'laenge', title: 'Längen vorstellen und schätzen', goal: 'Ich kenne Stützpunkte für mm, cm, dm, m und km und schätze Längen.', make(r, lv) {
    if (lv === 1) {
      const o = r.pick([['Ein Bleistift ist etwa ___ lang.', '17', 'cm'], ['Eine Ameise ist etwa ___ lang.', '4', 'mm'], ['Die Klassenzimmertür ist etwa ___ hoch.', '2', 'm'], ['Ein Fußballfeld ist etwa ___ lang.', '100', 'm'], ['Ein Marathonlauf ist etwa ___ lang.', '42', 'km'], ['Ein Schulheft ist etwa ___ lang.', '30', 'cm'], ['Ein Reiskorn ist etwa ___ lang.', '6', 'mm'], ['Ein Schulbus ist etwa ___ lang.', '12', 'm'], ['Von Bassum nach Bremen sind es etwa ___.', '30', 'km'], ['Eine Büroklammer ist etwa ___ lang.', '3', 'cm']] as const);
      return unitChoice(r, 'laenge', o[0], o[1], o[2], ['mm', 'cm', 'm', 'km']);
    }
    if (lv === 2) {
      const c = r.pick([
        ['Wie groß ist ein Kind in Klasse 5 etwa?', '1,45 m', ['14,5 m', '145 mm', '1,45 km']],
        ['Wie lang ist ein Klassenraum etwa?', '9 m', ['9 cm', '90 m', '9 km']],
        ['Wie dick ist ein dickes Mathebuch etwa?', '2 cm', ['2 mm', '2 dm', '2 m']],
        ['Wie hoch ist ein Wohnhaus mit drei Stockwerken etwa?', '10 m', ['10 dm', '100 m', '1 km']],
        ['Wie lang ist ein Smartphone etwa?', '15 cm', ['15 mm', '15 dm', '1,5 m']],
      ] as const);
      return realistic(r, c[0], c[1], [...c[2]], 'viel zu groß oder viel zu klein.');
    }
    const n = r.pick([20, 25, 30, 40, 50]);
    if (r.next() < 0.5) {
      const base = 600 * n; // 60 cm pro Schritt
      return {
        prompt: `Ein Schritt von Mia ist etwa 60 cm lang. Sie geht mit ${n} Schritten quer über den Schulhof. Wie breit ist der Schulhof ungefähr?`,
        fields: [sf('a', 'laenge', 'm', base, [{value: 60 * n * 1000, message: `${60 * n} ist die Länge in Zentimetern. Rechne noch in Meter um: 100 cm = 1 m.`}])],
        hints: H('Rechne zuerst die Gesamtlänge in Zentimetern aus.', `${n} Schritte zu je 60 cm: ${n} · 60 cm.`, `${n} · 60 cm = ${fmtNum(60 * n)} cm. Wie viele Meter sind das?`),
        solution: [`${n} · 60 cm = ${fmtNum(60 * n)} cm`, `${fmtNum(60 * n)} cm = ${size(base, 'laenge', 'm')}`, `Der Schulhof ist etwa ${size(base, 'laenge', 'm')} breit.`],
      };
    }
    const k = r.pick([6, 8, 10, 12]);
    return {
      prompt: `Deine Handspanne ist etwa 15 cm. Du misst einen Tisch mit ${k} Handspannen. Wie lang ist der Tisch ungefähr?`,
      fields: [sf('a', 'laenge', 'cm', 150 * k)],
      hints: H('Eine Handspanne ist eine Messeinheit, die du immer dabei hast.', `${k} Handspannen zu je 15 cm.`, `${k} · 15 cm = ?`),
      solution: [`${k} · 15 cm = ${fmtNum(15 * k)} cm`, `Der Tisch ist etwa ${fmtNum(15 * k)} cm = ${size(150 * k, 'laenge', 'm')} lang.`],
    };
  }},
  {id: 'l-messen', bereich: 'laenge', title: 'Messen mit dem Lineal', goal: 'Ich lege das Lineal richtig an und lese Zentimeter und Millimeter ab.', make(r, lv) {
    const object = r.pick(['stift', 'nagel', 'schluessel', 'radiergummi'] as const);
    const names = {stift: 'der Stift', nagel: 'der Nagel', schluessel: 'der Schlüssel', radiergummi: 'der Radiergummi'};
    if (lv === 1) {
      const len = r.int(3, 12) * 10;
      return {
        prompt: `Wie lang ist ${names[object]}?`, visual: {type: 'ruler', start: 0, length: len, object},
        fields: [sf('a', 'laenge', 'cm', len)],
        hints: H('Der Gegenstand beginnt genau bei der 0.', 'Die langen Striche mit Zahlen sind Zentimeter.', `Lies ab, bei welcher Zahl der Gegenstand endet.`),
        solution: [`Der Gegenstand beginnt bei 0 und endet bei ${len / 10} cm.`, `Er ist ${len / 10} cm lang.`],
      };
    }
    if (lv === 2) {
      let len = r.int(21, 129); if (len % 10 === 0) len += 3;
      return {
        prompt: `Wie lang ist ${names[object]}? Gib die Länge in Millimetern an.`, visual: {type: 'ruler', start: 0, length: len, object},
        fields: [sf('a', 'laenge', 'mm', len)],
        hints: H('Zähle zuerst die ganzen Zentimeter.', 'Zwischen zwei Zentimeterstrichen liegen 10 kleine Striche. Jeder kleine Abstand ist 1 mm.', `Der Gegenstand ist ${Math.floor(len / 10)} cm und noch ein paar Millimeter lang. 1 cm = 10 mm.`),
        solution: [`Ganze Zentimeter: ${Math.floor(len / 10)} cm = ${Math.floor(len / 10) * 10} mm`, `Dazu ${len % 10} mm`, `Länge: ${len} mm = ${size(len, 'laenge', 'cm')}`],
      };
    }
    const start = r.int(1, 3) * 10;
    let len = r.int(25, 95); if (len % 10 === 0) len += 4;
    return {
      prompt: `Achtung: ${names[object][0].toUpperCase() + names[object].slice(1)} liegt nicht bei 0. Wie lang ist er? Gib die Länge in Zentimetern mit Komma an.`,
      visual: {type: 'ruler', start, length: len, object},
      fields: [sf('a', 'laenge', 'cm', len, [{value: start + len, message: `Du hast nur abgelesen, wo der Gegenstand endet. Er beginnt aber bei ${start / 10} cm. Ziehe den Anfang ab.`}])],
      hints: H('Lies zuerst ab, wo der Gegenstand beginnt, und dann, wo er endet.', `Er beginnt bei ${start / 10} cm.`, `Rechne Ende minus Anfang: ${size(start + len, 'laenge', 'cm')} − ${start / 10} cm.`),
      solution: [`Anfang: ${start / 10} cm, Ende: ${size(start + len, 'laenge', 'cm')}`, `Länge: ${size(start + len, 'laenge', 'cm')} − ${start / 10} cm = ${size(len, 'laenge', 'cm')}`],
    };
  }},
  {id: 'l-umrechnen', bereich: 'laenge', title: 'Längen umrechnen', goal: 'Ich rechne mit der Einheitentreppe zwischen mm, cm, dm, m und km um.', make(r, lv) {
    if (lv === 1) {
      const c = r.pick([['cm', 'mm', 10], ['mm', 'cm', 10], ['dm', 'cm', 100], ['m', 'dm', 1000], ['km', 'm', 1_000_000], ['cm', 'dm', 100]] as const);
      const k = r.int(2, 19);
      const big = unit('laenge', c[0]).factor > unit('laenge', c[1]).factor;
      const base = big ? k * unit('laenge', c[0]).factor : k * unit('laenge', c[1]).factor;
      return conv('laenge', c[0], c[1], base);
    }
    if (lv === 2) {
      const t = r.int(0, 3);
      if (t === 0) return conv('laenge', 'm', 'cm', r.int(2, 15) * 1000);
      if (t === 1) return conv('laenge', 'cm', 'm', r.int(2, 30) * 1000);
      if (t === 2) return conv('laenge', 'm', 'mm', r.int(2, 9) * 1000);
      const base = r.int(2, 9) * 1000 + r.int(11, 95) * 10;
      return {
        prompt: `Rechne um: ${mixed(base, 'laenge', 'm', 'cm')} = ? cm`, visual: {type: 'stairs', bereich: 'laenge', from: 'm', to: 'cm'},
        fields: [sf('a', 'laenge', 'cm', base)],
        hints: H('Rechne die Meter und die Zentimeter einzeln um.', '1 m = 100 cm.', `${Math.floor(base / 1000)} m = ${Math.floor(base / 1000) * 100} cm. Addiere die restlichen Zentimeter.`),
        solution: [`${Math.floor(base / 1000)} m = ${Math.floor(base / 1000) * 100} cm`, `${Math.floor(base / 1000) * 100} cm + ${(base % 1000) / 10} cm = ${base / 10} cm`],
      };
    }
    if (r.next() < 0.5) {
      const w = r.int(1, 3);
      const items = r.shuffle([
        {label: `${w},2 m`, value: w * 1000 + 200}, {label: `${w * 100 + 15} cm`, value: w * 1000 + 150},
        {label: `${fmtNum(w * 1000 + 50)} mm`, value: w * 1000 + 50}, {label: `${w * 10 + 3} dm`, value: w * 1000 + 300},
      ]);
      return {
        prompt: 'Ordne die Längen. Tippe sie von der kürzesten zur längsten an.',
        fields: [orderField(r, 'a', items)],
        hints: H('Verschiedene Einheiten kannst du nicht direkt vergleichen.', 'Rechne alle Längen in Millimeter um.', items.map(i => `${i.label} = ${fmtNum(i.value)} mm`).join('; ')),
        solution: [...items.map(i => `${i.label} = ${fmtNum(i.value)} mm`), 'Dann nach der Größe der Zahl ordnen.'],
      };
    }
    const km = r.int(2, 8);
    const m = km * 1000 + r.pick([-100, -10, 0, 10, 100]);
    const rel = m * 1000 < km * 1_000_000 ? '<' : m * 1000 > km * 1_000_000 ? '>' : '=';
    return {
      prompt: `Vergleiche: ${km} km ☐ ${fmtNum(m)} m`,
      fields: [choice(r, 'a', rel, ['<', '>', '='].filter(x => x !== rel))],
      hints: H('Bringe beide Längen in dieselbe Einheit.', '1 km = 1000 m.', `${km} km = ${fmtNum(km * 1000)} m. Vergleiche mit ${fmtNum(m)} m.`),
      solution: [`${km} km = ${fmtNum(km * 1000)} m`, `${fmtNum(km * 1000)} m ${rel} ${fmtNum(m)} m`],
    };
  }},
  {id: 'l-komma', bereich: 'laenge', title: 'Kommaschreibweise bei Längen', goal: 'Ich schreibe Längen mit Komma und verstehe, was die Stellen bedeuten.', make(r, lv) {
    if (lv === 1) {
      const c = r.pick([['m', 'cm'], ['km', 'm'], ['cm', 'mm'], ['dm', 'cm']] as const);
      const w = r.int(1, 9), d = r.int(1, 9);
      return conv('laenge', c[0], c[1], (w * 10 + d) * unit('laenge', c[0]).factor / 10);
    }
    if (lv === 2) {
      const w = r.int(1, 9);
      if (r.next() < 0.5) { const cm = r.int(1, 9); return mixedToDecimal('laenge', 'm', 'cm', w * 1000 + cm * 10, w * 1000 + cm * 100); }
      if (r.next() < 0.5) return mixedToDecimal('laenge', 'm', 'cm', w * 1000 + r.int(11, 99) * 10);
      return conv('laenge', 'cm', 'm', w * 1000 + r.int(11, 99) * 10);
    }
    const t = r.int(0, 2);
    if (t === 0) { const m = r.int(1, 9) * 10; return mixedToDecimal('laenge', 'km', 'm', 1_000_000 + m * 1000, 1_000_000 + m * 10000); }
    if (t === 1) return conv('laenge', 'km', 'm', r.int(1, 9) * 100_000);
    const base = r.int(2, 9) * 1000 + r.int(1, 9) * 10;
    return {
      prompt: `Zerlege: ${size(base, 'laenge', 'm')} = ? m ? cm`,
      fields: [nf('m', Math.floor(base / 1000), 'm', undefined, 'Meter'), nf('cm', (base % 1000) / 10, 'cm', [{value: (base % 1000) / 100, message: 'Die erste Stelle nach dem Komma steht für Dezimeter, die zweite für Zentimeter. 0,07 m sind 7 cm.'}], 'Zentimeter')],
      hints: H('Vor dem Komma stehen die ganzen Meter.', 'Die zwei Stellen nach dem Komma sind die Zentimeter: 1 m = 100 cm.', `${inUnit(base, 'laenge', 'm')}: Lies die zwei Ziffern nach dem Komma als Zentimeter.`),
      solution: [`Ganze Meter: ${Math.floor(base / 1000)} m`, `Nach dem Komma: ${String((base % 1000) / 10).padStart(2, '0')} → ${(base % 1000) / 10} cm`, `${size(base, 'laenge', 'm')} = ${mixed(base, 'laenge', 'm', 'cm')}`],
    };
  }},
  {id: 'l-rechnen', bereich: 'laenge', title: 'Rechnen mit Längen', goal: 'Ich rechne mit Längen in Sachaufgaben und wandle vorher in eine gemeinsame Einheit um.', make(r, lv) {
    if (lv === 1) {
      const a = r.int(45, 95), b = r.int(35, 85);
      if (r.next() < 0.5) return {
        prompt: `Zwei Regale stehen nebeneinander. Eines ist ${a} cm breit, das andere ${b} cm. Wie breit sind beide zusammen?`,
        fields: [sf('a', 'laenge', 'cm', (a + b) * 10)],
        hints: H('Zusammen bedeutet: addieren.', `Rechne ${a} cm + ${b} cm.`, `${a} + ${b} = ?`),
        solution: [`${a} cm + ${b} cm = ${a + b} cm`, `Beide Regale sind zusammen ${a + b} cm = ${size((a + b) * 10, 'laenge', 'm')} breit.`],
      };
      const x = r.int(140, 165), y = r.int(105, 130);
      return {
        prompt: `Tom ist ${x} cm groß, seine kleine Schwester ${y} cm. Wie viel größer ist Tom?`,
        fields: [sf('a', 'laenge', 'cm', (x - y) * 10)],
        hints: H('„Wie viel größer“ fragt nach dem Unterschied.', 'Unterschied bedeutet: subtrahieren.', `${x} cm − ${y} cm = ?`),
        solution: [`${x} cm − ${y} cm = ${x - y} cm`, `Tom ist ${x - y} cm größer.`],
      };
    }
    if (lv === 2) {
      if (r.next() < 0.5) {
        const m = r.int(1, 3), cm = r.pick([10, 20, 25, 40, 50]), add = r.int(35, 95);
        const base = m * 1000 + cm * 10 + add * 10;
        return {
          prompt: `Ein Brett ist ${m},${String(cm).padStart(2, '0')} m lang. Es wird mit einem zweiten Brett von ${add} cm verlängert. Wie lang sind beide Bretter zusammen?`,
          fields: [sf('a', 'laenge', 'cm', base, [{value: (m * 100 + cm) * 10 + add * 1000, message: 'Du hast Meter und Zentimeter durcheinandergebracht. Rechne zuerst beide Längen in Zentimeter um.'}])],
          hints: H('Die Längen stehen in verschiedenen Einheiten.', `Rechne ${m},${String(cm).padStart(2, '0')} m in Zentimeter um.`, `${m},${String(cm).padStart(2, '0')} m = ${m * 100 + cm} cm. Addiere ${add} cm.`),
          solution: [`${m},${String(cm).padStart(2, '0')} m = ${m * 100 + cm} cm`, `${m * 100 + cm} cm + ${add} cm = ${base / 10} cm`],
        };
      }
      const total = r.int(4, 8), cut = r.int(1, 2) * 1000 + r.int(11, 85) * 10;
      return {
        prompt: `Ein Seil ist ${total} m lang. Paul schneidet ${mixed(cut, 'laenge', 'm', 'cm')} ab. Wie viel Seil bleibt übrig?`,
        fields: [sf('a', 'laenge', 'cm', total * 1000 - cut)],
        hints: H('Übrig bleiben bedeutet: subtrahieren.', 'Rechne beide Längen in Zentimeter um.', `${total} m = ${total * 100} cm und ${mixed(cut, 'laenge', 'm', 'cm')} = ${cut / 10} cm.`),
        solution: [`${total} m = ${total * 100} cm`, `${mixed(cut, 'laenge', 'm', 'cm')} = ${cut / 10} cm`, `${total * 100} cm − ${cut / 10} cm = ${(total * 1000 - cut) / 10} cm`],
      };
    }
    if (r.next() < 0.5) {
      const w = r.pick([800, 1200, 1500, 2500]); // m
      const base = w * 1000 * 2 * 5;
      return {
        prompt: `Leas Schulweg ist ${size(w * 1000, 'laenge', 'km')} lang. Sie geht montags bis freitags hin und zurück. Wie viele Kilometer sind das in einer Woche?`,
        fields: [sf('a', 'laenge', 'km', base, [{value: w * 1000 * 5, message: 'Denk an den Rückweg: Lea geht jeden Tag hin und zurück.'}, {value: w * 1000 * 2, message: 'Das ist nur ein Tag. Gefragt ist die ganze Woche (Montag bis Freitag).'}])],
        hints: H('Wie oft geht Lea den Weg an einem Tag?', 'Hin und zurück = 2-mal pro Tag. Montag bis Freitag = 5 Tage.', `${fmtNum(w)} m · 2 · 5 = ? Rechne am Ende in km um.`),
        solution: [`Pro Tag: ${fmtNum(w)} m · 2 = ${fmtNum(w * 2)} m`, `Pro Woche: ${fmtNum(w * 2)} m · 5 = ${fmtNum(w * 10)} m`, `${fmtNum(w * 10)} m = ${size(base, 'laenge', 'km')}`],
      };
    }
    const roll = r.pick([2, 3, 4]) * 100, piece = r.pick([35, 40, 45, 55, 70]);
    const n = Math.floor(roll / piece), rest = roll - n * piece;
    return {
      prompt: `Eine Rolle Geschenkband ist ${roll / 100} m lang. Für ein Geschenk brauchst du ${piece} cm. Für wie viele Geschenke reicht das Band, und wie viel bleibt übrig?`,
      fields: [nf('n', n, 'Geschenke', [{value: n + 1, message: 'Für das letzte Geschenk reicht das Band nicht mehr ganz.'}], 'Anzahl'), nf('rest', rest, 'cm', undefined, 'Rest')],
      hints: H(`Rechne ${roll / 100} m in Zentimeter um.`, `Wie oft passen ${piece} cm in ${roll} cm? Das ist eine Division mit Rest.`, `${piece} · ${n} = ${piece * n}. Prüfe: Passt noch ein Stück hinein?`),
      solution: [`${roll / 100} m = ${roll} cm`, `${roll} : ${piece} = ${n} Rest ${rest}`, `Das Band reicht für ${n} Geschenke, ${rest} cm bleiben übrig.`],
    };
  }},
  {id: 'l-massstab', bereich: 'laenge', vertiefung: true, title: 'Vertiefung: Maßstab', goal: 'Ich rechne mit dem Maßstab zwischen Plan oder Karte und Wirklichkeit.', make(r, lv) {
    if (lv === 1) {
      const cm = r.int(3, 9);
      return {
        prompt: `Auf einem Bauplan im Maßstab 1 : 100 ist ein Zimmer ${cm} cm lang. Wie lang ist es in Wirklichkeit?`,
        visual: {type: 'map', cm, scale: 100},
        fields: [sf('a', 'laenge', 'm', cm * 1000, [{value: cm * 10, message: 'So lang ist das Zimmer nur auf dem Plan. In Wirklichkeit ist alles 100-mal so lang.'}])],
        hints: H('1 : 100 bedeutet: 1 cm auf dem Plan sind 100 cm in Wirklichkeit.', '100 cm = 1 m. Also gilt: 1 cm auf dem Plan ist 1 m in Wirklichkeit.', `${cm} cm auf dem Plan sind ${cm} · 100 cm.`),
        solution: [`${cm} cm · 100 = ${cm * 100} cm`, `${cm * 100} cm = ${cm} m`],
      };
    }
    if (lv === 2) {
      const cm = r.int(2, 9);
      return {
        prompt: `Auf einer Wanderkarte im Maßstab 1 : 25 000 ist ein Weg ${cm} cm lang. Wie lang ist er in Wirklichkeit?`,
        visual: {type: 'map', cm, scale: 25000},
        fields: [sf('a', 'laenge', 'm', cm * 250_000)],
        hints: H('1 cm auf der Karte sind 25 000 cm in Wirklichkeit.', '25 000 cm = 250 m.', `${cm} · 250 m = ?`),
        solution: ['1 cm ≙ 25 000 cm = 250 m', `${cm} cm ≙ ${cm} · 250 m = ${fmtNum(cm * 250)} m`],
      };
    }
    const km = r.int(1, 5);
    return {
      prompt: `Zwei Dörfer liegen ${km} km auseinander. Wie weit liegen sie auf einer Karte im Maßstab 1 : 50 000 auseinander?`,
      visual: {type: 'map', cm: km * 2, scale: 50000},
      fields: [sf('a', 'laenge', 'cm', km * 2 * 10)],
      hints: H('Rechne zuerst aus, wie viel 1 cm auf der Karte in Wirklichkeit ist.', '50 000 cm = 500 m. Also: 1 cm auf der Karte sind 500 m.', `${km} km = ${fmtNum(km * 1000)} m. Wie oft passen 500 m hinein?`),
      solution: ['1 cm ≙ 50 000 cm = 500 m', `${km} km = ${fmtNum(km * 1000)} m`, `${fmtNum(km * 1000)} m : 500 m = ${km * 2}, also ${km * 2} cm auf der Karte`],
    };
  }},
];

// =====================================================================
// GEWICHTE (MASSE)
// =====================================================================
const masse: Skill[] = [
  {id: 'm-vorstellen', bereich: 'masse', title: 'Gewichte vorstellen und schätzen', goal: 'Ich kenne Stützpunkte für mg, g, kg und t und schätze Gewichte.', make(r, lv) {
    if (lv === 1) {
      const o = r.pick([['Ein Apfel', '150', 'g'], ['Ein gepackter Schulranzen', '5', 'kg'], ['Ein Elefant', '5', 't'], ['Eine Tafel Schokolade', '100', 'g'], ['Ein Fahrrad', '15', 'kg'], ['Ein Brief', '20', 'g'], ['Eine Mücke', '2', 'mg'], ['Ein Erwachsener', '70', 'kg'], ['Ein beladener Lastwagen', '20', 't']] as const);
      return unitChoice(r, 'masse', `${o[0]} wiegt etwa ___.`, o[1], o[2], ['mg', 'g', 'kg', 't']);
    }
    if (lv === 2) {
      const c = r.pick([
        ['Wie schwer ist ein Kind in Klasse 5 etwa?', '35 kg', ['35 g', '350 kg', '3,5 t']],
        ['Wie schwer ist ein Apfel etwa?', '150 g', ['150 kg', '15 mg', '1,5 t']],
        ['Wie schwer ist ein mittelgroßer Hund etwa?', '20 kg', ['20 g', '200 kg', '2 t']],
        ['Wie schwer ist ein Brot etwa?', '1 kg', ['1 g', '10 kg', '1 t']],
        ['Wie schwer ist ein Smartphone etwa?', '200 g', ['2 g', '20 kg', '200 mg']],
      ] as const);
      return realistic(r, c[0], c[1], [...c[2]], 'viel zu schwer oder viel zu leicht.');
    }
    if (r.next() < 0.5) {
      const l = r.int(4, 10), eimer = r.pick([300, 500, 800]);
      const base = l * 1_000_000 + eimer * 1000;
      return {
        prompt: `1 Liter Wasser wiegt 1 kg. Ein leerer Eimer wiegt ${eimer} g. Du füllst ${l} Liter Wasser hinein. Wie schwer ist der volle Eimer?`,
        fields: [sf('a', 'masse', 'kg', base, [{value: l * 1_000_000, message: 'Du hast den Eimer vergessen. Er wiegt auch etwas.'}])],
        hints: H('Rechne aus, wie schwer das Wasser ist.', `${l} l Wasser wiegen ${l} kg. Dazu kommt der Eimer.`, `${eimer} g = ${size(eimer * 1000, 'masse', 'kg')}. Addiere zu ${l} kg.`),
        solution: [`Wasser: ${l} kg`, `Eimer: ${eimer} g = ${size(eimer * 1000, 'masse', 'kg')}`, `Zusammen: ${size(base, 'masse', 'kg')}`],
      };
    }
    const g = r.pick([100, 125, 200, 250]);
    return {
      prompt: `Eine Packung Butter wiegt ${g} g. Wie viele Packungen wiegen zusammen genau 1 kg?`,
      fields: [nf('a', 1000 / g, 'Packungen')],
      hints: H('Rechne 1 kg in Gramm um.', '1 kg = 1000 g.', `Wie oft passen ${g} g in 1000 g?`),
      solution: ['1 kg = 1000 g', `1000 g : ${g} g = ${1000 / g}`],
    };
  }},
  {id: 'm-waage', bereich: 'masse', title: 'Mit der Waage wiegen', goal: 'Ich bestimme Gewichte mit Gewichtsstücken auf einer Balkenwaage.', make(r, lv) {
    const obj = r.pick(['Paket', 'Kürbis', 'Buch', 'Dose']);
    if (lv === 1) {
      const right = r.shuffle([500, 200, 100, 50, 20, 10, 5]).slice(0, r.int(2, 4)).sort((a, b) => b - a);
      const sum = right.reduce((s, x) => s + x, 0);
      return {
        prompt: `Die Waage ist im Gleichgewicht. Wie schwer ist das ${obj}?`, visual: {type: 'balance', left: [{label: obj}], right},
        fields: [sf('a', 'masse', 'g', sum * 1000)],
        hints: H('Im Gleichgewicht sind beide Seiten gleich schwer.', 'Addiere alle Gewichtsstücke auf der rechten Seite.', `${right.map(x => x + ' g').join(' + ')} = ?`),
        solution: [`${right.map(x => x + ' g').join(' + ')} = ${sum} g`, `Das ${obj} wiegt ${sum} g.`],
      };
    }
    if (lv === 2) {
      const right = [r.pick([1000, 2000]), ...r.shuffle([500, 200, 100, 50, 20]).slice(0, r.int(2, 3))].sort((a, b) => b - a);
      const sum = right.reduce((s, x) => s + x, 0);
      return {
        prompt: `Die Waage ist im Gleichgewicht. Wie schwer ist das ${obj}? Gib das Gewicht in Gramm an.`, visual: {type: 'balance', left: [{label: obj}], right},
        fields: [sf('a', 'masse', 'g', sum * 1000)],
        hints: H('Achte auf die Einheiten auf den Gewichtsstücken: kg und g.', '1 kg = 1000 g. Rechne zuerst alle Stücke in Gramm um.', `${right.map(x => (x >= 1000 ? x / 1000 + ' kg' : x + ' g')).join(' + ')} = ${right.map(x => x + ' g').join(' + ')}`),
        solution: [`${right.map(x => x + ' g').join(' + ')} = ${fmtNum(sum)} g`, `Das ${obj} wiegt ${fmtNum(sum)} g = ${size(sum * 1000, 'masse', 'kg')}.`],
      };
    }
    const leftW = r.pick([100, 200, 500]);
    const right = [1000, ...r.shuffle([500, 200, 100, 50]).slice(0, 2)].sort((a, b) => b - a);
    const sum = right.reduce((s, x) => s + x, 0);
    return {
      prompt: `Auf der linken Seite liegen das ${obj} und ein Gewichtsstück von ${leftW} g. Die Waage ist im Gleichgewicht. Wie schwer ist das ${obj}?`,
      visual: {type: 'balance', left: [{label: obj}, {label: leftW + ' g', grams: leftW}], right},
      fields: [sf('a', 'masse', 'g', (sum - leftW) * 1000, [{value: sum * 1000, message: `Links liegt nicht nur das ${obj}, sondern auch noch ${leftW} g. Ziehe dieses Stück ab.`}, {value: (sum + leftW) * 1000, message: `Das ${leftW}-g-Stück liegt auf derselben Seite wie das ${obj}. Du musst es abziehen, nicht addieren.`}])],
      hints: H('Rechts liegt genauso viel wie links.', `Links: ${obj} + ${leftW} g. Rechts: ${right.map(x => (x >= 1000 ? x / 1000 + ' kg' : x + ' g')).join(' + ')}.`, `Rechts sind ${fmtNum(sum)} g. Also: ${obj} + ${leftW} g = ${fmtNum(sum)} g.`),
      solution: [`Rechts: ${fmtNum(sum)} g`, `${obj} + ${leftW} g = ${fmtNum(sum)} g`, `${obj} = ${fmtNum(sum)} g − ${leftW} g = ${fmtNum(sum - leftW)} g`],
    };
  }},
  {id: 'm-umrechnen', bereich: 'masse', title: 'Gewichte umrechnen', goal: 'Ich rechne zwischen mg, g, kg und t mit der Umrechnungszahl 1000 um.', make(r, lv) {
    if (lv === 1) {
      const c = r.pick([['kg', 'g'], ['g', 'kg'], ['t', 'kg'], ['kg', 't'], ['g', 'mg']] as const);
      const k = r.int(2, 15);
      const fa = unit('masse', c[0]).factor, fb = unit('masse', c[1]).factor;
      return conv('masse', c[0], c[1], k * Math.max(fa, fb));
    }
    if (lv === 2) {
      if (r.next() < 0.5) {
        const base = r.int(1, 9) * 1_000_000 + r.int(1, 9) * 100_000 + r.pick([0, 50_000]);
        return {
          prompt: `Rechne um: ${mixed(base, 'masse', 'kg', 'g')} = ? g`,
          fields: [sf('a', 'masse', 'g', base, [{value: Math.floor(base / 1e6) * 1e6 / 1000 + (base % 1e6), message: 'Rechne auch die Kilogramm in Gramm um: 1 kg = 1000 g.'}])],
          hints: H('Rechne Kilogramm und Gramm einzeln um.', '1 kg = 1000 g.', `${Math.floor(base / 1e6)} kg = ${Math.floor(base / 1e6) * 1000} g. Addiere die Gramm.`),
          solution: [`${Math.floor(base / 1e6)} kg = ${fmtNum(Math.floor(base / 1e6) * 1000)} g`, `+ ${(base % 1e6) / 1000} g = ${fmtNum(base / 1000)} g`],
        };
      }
      return r.next() < 0.5 ? conv('masse', 't', 'g', r.int(2, 5) * 1e9) : conv('masse', 'mg', 'g', r.int(2, 30) * 1000 * 1000);
    }
    const items = r.shuffle([
      {label: '1,2 kg', value: 1_200_000}, {label: '1.020 g', value: 1_020_000},
      {label: '1 kg 250 g', value: 1_250_000}, {label: '1.100.000 mg', value: 1_100_000},
    ]);
    return {
      prompt: 'Ordne die Gewichte. Tippe sie vom leichtesten zum schwersten an.',
      fields: [orderField(r, 'a', items)],
      hints: H('Bringe alle Gewichte in dieselbe Einheit.', 'Gramm eignet sich gut: 1 kg = 1000 g, 1000 mg = 1 g.', items.map(i => `${i.label} = ${fmtNum(i.value / 1000)} g`).join('; ')),
      solution: [...items.map(i => `${i.label} = ${fmtNum(i.value / 1000)} g`), 'Dann nach der Größe der Zahl ordnen.'],
    };
  }},
  {id: 'm-komma', bereich: 'masse', title: 'Kommaschreibweise bei Gewichten', goal: 'Ich schreibe Gewichte mit Komma; nach dem Komma stehen bei kg drei Stellen für Gramm.', make(r, lv) {
    if (lv === 1) {
      const c = r.pick([['kg', 'g'], ['t', 'kg']] as const);
      const w = r.int(1, 9), d = r.int(1, 9);
      return conv('masse', c[0], c[1], (w * 10 + d) * unit('masse', c[0]).factor / 10);
    }
    if (lv === 2) {
      const t = r.int(0, 2);
      if (t === 0) { const g = r.pick([250, 500, 750, 400, 600]); return conv('masse', 'g', 'kg', g * 1000); }
      if (t === 1) { const w = r.int(1, 5), g = r.pick([50, 20, 80]); return mixedToDecimal('masse', 'kg', 'g', w * 1e6 + g * 1000, w * 1e6 + g * 10_000); }
      return conv('masse', 'g', 'kg', r.int(1001, 4999) * 1000);
    }
    const w = r.int(2, 6), g = r.int(1, 9);
    if (r.next() < 0.5) return mixedToDecimal('masse', 'kg', 'g', w * 1e6 + g * 1000, w * 1e6 + g * 100_000);
    return conv('masse', 't', 'kg', w * 1e9 + r.int(1, 9) * 1e8 + r.int(1, 9) * 1e7);
  }},
  {id: 'm-rechnen', bereich: 'masse', title: 'Rechnen mit Gewichten', goal: 'Ich löse Sachaufgaben mit Gewichten, auch mit Brutto, Netto und Verpackung.', make(r, lv) {
    if (lv === 1) {
      const items = r.shuffle([['Butter', 250], ['Mehl', 500], ['Zucker', 200], ['Nüsse', 100], ['Schokolade', 150]] as const).slice(0, 3);
      const sum = items.reduce((s, x) => s + x[1], 0);
      return {
        prompt: `Für einen Kuchen brauchst du ${items.map(i => `${i[1]} g ${i[0]}`).join(', ')}. Wie viel Gramm sind das zusammen?`,
        fields: [sf('a', 'masse', 'g', sum * 1000)],
        hints: H('Zusammen bedeutet: addieren.', 'Alle Angaben sind schon in Gramm.', `${items.map(i => i[1]).join(' + ')} = ?`),
        solution: [`${items.map(i => i[1] + ' g').join(' + ')} = ${sum} g`],
      };
    }
    if (lv === 2) {
      if (r.next() < 0.5) {
        const brutto = r.int(15, 45) * 100, tara = r.pick([250, 350, 400, 450]);
        return {
          prompt: `Ein Paket wiegt insgesamt ${size(brutto * 1000, 'masse', 'kg')}. Der Karton allein wiegt ${tara} g. Wie schwer ist der Inhalt?`,
          fields: [sf('a', 'masse', 'g', (brutto - tara) * 1000, [{value: (brutto + tara) * 1000, message: 'Der Karton gehört nicht zum Inhalt. Ziehe sein Gewicht ab.'}])],
          hints: H('Gesamtgewicht = Inhalt + Verpackung.', `Rechne ${size(brutto * 1000, 'masse', 'kg')} in Gramm um.`, `${fmtNum(brutto)} g − ${tara} g = ?`),
          solution: [`${size(brutto * 1000, 'masse', 'kg')} = ${fmtNum(brutto)} g`, `Inhalt: ${fmtNum(brutto)} g − ${tara} g = ${fmtNum(brutto - tara)} g`, 'Fachwörter: Brutto = mit Verpackung, Tara = Verpackung, Netto = Inhalt.'],
        };
      }
      const items = r.shuffle([['Kartoffeln', 2_000_000], ['Mehl', 1_000_000], ['Zucker', 500_000], ['Butter', 250_000], ['Käse', 400_000]] as const).slice(0, 3);
      const sum = items.reduce((s, x) => s + x[1], 0);
      return {
        prompt: `Ben trägt den Einkauf nach Hause: ${items.map(i => `${i[1] >= 1e6 ? i[1] / 1e6 + ' kg' : i[1] / 1000 + ' g'} ${i[0]}`).join(', ')}. Wie schwer ist der Einkauf? Gib das Ergebnis in kg an.`,
        fields: [sf('a', 'masse', 'kg', sum)],
        hints: H('Rechne alles in Gramm um und addiere.', '1 kg = 1000 g.', `${items.map(i => fmtNum(i[1] / 1000) + ' g').join(' + ')} = ${fmtNum(sum / 1000)} g. Wie viel kg sind das?`),
        solution: [`${items.map(i => fmtNum(i[1] / 1000) + ' g').join(' + ')} = ${fmtNum(sum / 1000)} g`, `${fmtNum(sum / 1000)} g = ${size(sum, 'masse', 'kg')}`],
      };
    }
    const n = r.int(6, 9), p = r.pick([70, 75, 80]), box = r.pick([40, 60, 90]), max = 630;
    const total = n * p + box, ok = total <= max;
    return {
      prompt: `Ein Aufzug darf höchstens ${max} kg tragen. ${n} Personen mit je etwa ${p} kg und eine Kiste mit ${box} kg möchten einsteigen. Wie schwer sind alle zusammen, und dürfen alle mitfahren?`,
      fields: [sf('w', 'masse', 'kg', total * 1e6, undefined, 'Gesamtgewicht'), choice(r, 'ok', ok ? 'Ja, alle dürfen mitfahren.' : 'Nein, das ist zu schwer.', [ok ? 'Nein, das ist zu schwer.' : 'Ja, alle dürfen mitfahren.'], undefined, 'Entscheidung')],
      hints: H('Rechne zuerst das Gewicht aller Personen aus.', `${n} · ${p} kg = ${n * p} kg. Dazu kommt die Kiste.`, `${n * p} kg + ${box} kg = ${total} kg. Vergleiche mit ${max} kg.`),
      solution: [`Personen: ${n} · ${p} kg = ${n * p} kg`, `Mit Kiste: ${n * p} kg + ${box} kg = ${total} kg`, ok ? `${total} kg ≤ ${max} kg: Alle dürfen mitfahren.` : `${total} kg > ${max} kg: Das sind ${total - max} kg zu viel.`],
    };
  }},
  {id: 'm-preis', bereich: 'masse', vertiefung: true, title: 'Vertiefung: Gewicht und Preis', goal: 'Ich berechne Preise für andere Mengen und vergleiche Angebote über den Kilopreis.', make(r, lv) {
    if (lv === 1) {
      const kg = r.pick([180, 240, 300, 360, 420]);
      return {
        prompt: `1 kg Äpfel kostet ${euro(kg)}. Wie viel kosten 500 g?`,
        fields: [sf('a', 'geld', 'eur', kg / 2)],
        hints: H('Wie viel ist 500 g im Vergleich zu 1 kg?', '500 g ist die Hälfte von 1 kg.', `Die Hälfte von ${euro(kg)} ist …`),
        solution: ['500 g = die Hälfte von 1 kg', `${euro(kg)} : 2 = ${euro(kg / 2)}`],
      };
    }
    if (lv === 2) {
      const p = r.pick([250, 300, 350, 400]);
      return {
        prompt: `250 g Käse kosten ${euro(p)}. Wie viel kostet 1 kg?`,
        fields: [sf('a', 'geld', 'eur', p * 4)],
        hints: H('Wie oft passen 250 g in 1 kg?', '1 kg = 1000 g = 4 · 250 g.', `${euro(p)} · 4 = ?`),
        solution: ['1 kg = 4 · 250 g', `${euro(p)} · 4 = ${euro(p * 4)}`],
      };
    }
    const small = r.pick([260, 280, 300]), big = r.pick([600, 650, 700, 800]);
    const perKgSmall = small * 2.5; // 400 g
    const cheaper = perKgSmall < big ? '400-g-Packung' : '1-kg-Packung';
    return {
      prompt: `Nudeln: 400 g kosten ${euro(small)}, 1 kg kostet ${euro(big)}. Wie viel kostet 1 kg bei der kleinen Packung? Welche Packung ist pro Kilogramm günstiger?`,
      fields: [sf('kg', 'geld', 'eur', perKgSmall, undefined, 'Kilopreis der 400-g-Packung'), choice(r, 'w', cheaper, [cheaper === '400-g-Packung' ? '1-kg-Packung' : '400-g-Packung'], undefined, 'Günstiger pro kg')],
      hints: H('Vergleiche immer den Preis für dieselbe Menge, zum Beispiel für 1 kg.', '400 g sind 2-mal 200 g. 1 kg sind 5-mal 200 g.', `200 g kosten ${euro(small / 2)}. 1 kg kostet also ${euro(small / 2)} · 5.`),
      solution: [`200 g kosten ${euro(small)} : 2 = ${euro(small / 2)}`, `1 kg kostet ${euro(small / 2)} · 5 = ${euro(perKgSmall)}`, `Vergleich mit ${euro(big)}: Die ${cheaper} ist pro Kilogramm günstiger.`],
    };
  }},
];

// =====================================================================
// GELD
// =====================================================================
const geld: Skill[] = [
  {id: 'g-muenzen', bereich: 'geld', title: 'Münzen und Scheine', goal: 'Ich zähle Geldbeträge und lege Beträge mit möglichst wenigen Münzen und Scheinen.', make(r, lv) {
    if (lv === 1) {
      if (r.next() < 0.5) {
        const items = r.shuffle([50, 20, 20, 10, 5, 2, 1, 50, 10]).slice(0, r.int(4, 6)).sort((a, b) => b - a);
        const sum = items.reduce((s, x) => s + x, 0);
        return {
          prompt: 'Wie viel Geld ist das?', visual: {type: 'coins', items},
          fields: [sf('a', 'geld', 'ct', sum)],
          hints: H('Beginne mit der größten Münze.', 'Zähle weiter: zuerst die großen, dann die kleinen Münzen.', `${items.join(' + ')} = ?`),
          solution: [`${items.map(x => x + ' ct').join(' + ')} = ${sum} ct`, `${sum} ct = ${euro(sum)}`],
        };
      }
      const target = r.int(3, 19) * 5;
      return {
        prompt: `Lege ${target} ct mit Münzen. Tippe die Münzen an.`,
        fields: [{kind: 'wallet', id: 'a', target}],
        hints: H('Nimm zuerst eine große Münze, die noch passt.', 'Zähle mit: Wie viel fehlt noch?', `Zum Beispiel: ${coinFew(target)}.`),
        solution: [`Eine Möglichkeit: ${coinFew(target)} = ${target} ct`],
      };
    }
    if (lv === 2) {
      const items = [r.pick([500, 1000, 2000]), ...r.shuffle([200, 100, 100, 50, 20, 10, 5]).slice(0, r.int(3, 5))].sort((a, b) => b - a);
      const sum = items.reduce((s, x) => s + x, 0);
      return {
        prompt: 'Wie viel Geld ist das? Gib den Betrag in Euro an.', visual: {type: 'coins', items},
        fields: [sf('a', 'geld', 'eur', sum)],
        hints: H('Zähle zuerst die Scheine und Euro-Münzen, dann die Cent-Münzen.', 'Euro vor das Komma, Cent mit zwei Stellen hinter das Komma.', `Euro: ${items.filter(x => x >= 100).map(x => x / 100).join(' + ')}; Cent: ${items.filter(x => x < 100).join(' + ') || '0'}`),
        solution: [`Euro: ${euro(items.filter(x => x >= 100).reduce((s, x) => s + x, 0))}`, `Cent: ${items.filter(x => x < 100).reduce((s, x) => s + x, 0)} ct`, `Zusammen: ${euro(sum)}`],
      };
    }
    const target = r.int(2, 9) * 100 + r.int(1, 19) * 5;
    return {
      prompt: `Lege ${euro(target)} mit möglichst wenigen Münzen und Scheinen.`,
      fields: [{kind: 'wallet', id: 'a', target, fewest: true}],
      hints: H('Nimm immer das größte Stück, das noch in den Restbetrag passt.', `Beginne mit den Euro: ${Math.floor(target / 100)} €.`, `Mit ${fewestCoins(target).length} Stücken geht es.`),
      solution: [`${coinFew(target)} = ${euro(target)}`, `Das sind ${fewestCoins(target).length} Stücke.`],
    };
  }},
  {id: 'g-umrechnen', bereich: 'geld', title: 'Euro und Cent', goal: 'Ich rechne zwischen Euro und Cent um und schreibe Geldbeträge mit zwei Stellen nach dem Komma.', make(r, lv) {
    if (lv === 1) return r.next() < 0.5 ? conv('geld', 'eur', 'ct', r.int(2, 20) * 100) : conv('geld', 'ct', 'eur', r.int(2, 20) * 100);
    if (lv === 2) {
      const t = r.int(0, 2);
      if (t === 0) { const w = r.int(1, 9), c = r.int(1, 9); return conv('geld', 'eur', 'ct', w * 100 + c, [{value: w * 100 + c * 10, message: `${w},${c}0 € wären ${w} € ${c * 10} ct. Bei ${w},0${c} € steht die ${c} an der zweiten Stelle: ${c} ct.`}]); }
      if (t === 1) return conv('geld', 'ct', 'eur', r.int(101, 999));
      const c = r.int(1, 9);
      return conv('geld', 'ct', 'eur', c, [{value: c * 10, message: `0,${c} € sind ${c * 10} ct. ${c} ct schreibst du als 0,0${c} €.`}]);
    }
    const items = r.shuffle([{label: '1,09 €', value: 109}, {label: '110 ct', value: 110}, {label: '1,90 €', value: 190}, {label: '99 ct', value: 99}, {label: '1,01 €', value: 101}]).slice(0, 4);
    return {
      prompt: 'Ordne die Preise. Tippe sie vom günstigsten zum teuersten an.',
      fields: [orderField(r, 'a', items)],
      hints: H('Rechne alle Preise in Cent um.', '1 € = 100 ct. 1,09 € = 109 ct.', items.map(i => `${i.label} = ${i.value} ct`).join('; ')),
      solution: [...items.map(i => `${i.label} = ${i.value} ct`), 'Dann nach der Größe der Zahl ordnen.'],
    };
  }},
  {id: 'g-rechnen', bereich: 'geld', title: 'Einkaufen und addieren', goal: 'Ich addiere und subtrahiere Geldbeträge stellengerecht.', make(r, lv) {
    const shop = [['Heft', 129], ['Bleistift', 85], ['Radiergummi', 60], ['Lineal', 149], ['Füller', 899], ['Kleber', 175], ['Collegeblock', 249], ['Farbkasten', 650], ['Zirkel', 499], ['Anspitzer', 95]] as const;
    if (lv === 1) {
      const items = r.shuffle(shop.filter(x => x[1] % 5 === 0)).slice(0, 3) as unknown as [string, number][];
      const sum = items.reduce((s, x) => s + x[1], 0);
      return {
        prompt: 'Wie viel kostet der Einkauf zusammen?', visual: {type: 'receipt', lines: items},
        fields: [sf('a', 'geld', 'eur', sum)],
        hints: H('Schreibe die Preise stellengerecht untereinander: Komma unter Komma.', 'Du kannst auch alles in Cent rechnen.', `${items.map(i => i[1] + ' ct').join(' + ')} = ?`),
        solution: [`${items.map(i => i[1] + ' ct').join(' + ')} = ${sum} ct`, `${sum} ct = ${euro(sum)}`],
      };
    }
    const items = r.shuffle(shop).slice(0, lv === 2 ? 4 : 3) as unknown as [string, number][];
    const sum = items.reduce((s, x) => s + x[1], 0);
    if (lv === 2) return {
      prompt: 'Wie viel kostet der Einkauf zusammen?', visual: {type: 'receipt', lines: items},
      fields: [sf('a', 'geld', 'eur', sum)],
      hints: H('Komma unter Komma, Cent unter Cent.', 'Addiere zuerst die Cent. 100 ct ergeben 1 € Übertrag.', `In Cent: ${items.map(i => i[1]).join(' + ')} = ?`),
      solution: [`${items.map(i => euro(i[1])).join(' + ')} = ${euro(sum)}`],
    };
    const budget = Math.max(1000, Math.ceil((sum + 1) / 1000) * 1000);
    return {
      prompt: `Lea hat ${euro(budget)}. Sie kauft ${items.map(i => i[0]).join(', ')}. Wie viel Geld bleibt ihr?`, visual: {type: 'receipt', lines: items},
      fields: [sf('a', 'geld', 'eur', budget - sum, [{value: sum, message: 'Das ist der Preis des Einkaufs. Gefragt ist, wie viel Geld Lea übrig behält.'}])],
      hints: H('Rechne zuerst den ganzen Einkauf aus.', `Einkauf: ${euro(sum)}.`, `${euro(budget)} − ${euro(sum)} = ? Tipp: Ergänze von ${euro(sum)} bis ${euro(budget)}.`),
      solution: [`Einkauf: ${items.map(i => euro(i[1])).join(' + ')} = ${euro(sum)}`, `Rest: ${euro(budget)} − ${euro(sum)} = ${euro(budget - sum)}`],
    };
  }},
  {id: 'g-wechselgeld', bereich: 'geld', title: 'Wechselgeld', goal: 'Ich berechne Wechselgeld durch Ergänzen und gebe es mit wenigen Münzen heraus.', make(r, lv) {
    if (lv === 1) {
      const price = r.int(2, 19) * 50; const paid = 1000;
      return {
        prompt: `Du kaufst ein Buch für ${euro(price)} und bezahlst mit einem 10-€-Schein. Wie viel Wechselgeld bekommst du?`,
        visual: {type: 'receipt', lines: [['Buch', price]], paid},
        fields: [sf('a', 'geld', 'eur', paid - price)],
        hints: H('Wechselgeld = bezahlt − Preis.', 'Ergänze vom Preis bis 10 €.', `${euro(price)} + ? = 10,00 €`),
        solution: [`10,00 € − ${euro(price)} = ${euro(paid - price)}`],
      };
    }
    const price = r.int(501, 1899);
    const paid = 2000;
    const target = paid - price;
    const nextTen = Math.ceil(price / 10) * 10, nextE = Math.ceil(price / 100) * 100;
    const steps = [`${euro(price)} → ${euro(nextTen)} (+${nextTen - price} ct)`, `${euro(nextTen)} → ${euro(nextE)} (+${nextE - nextTen} ct)`, `${euro(nextE)} → 20,00 € (+${euro(paid - nextE)})`].filter(s => !s.includes('(+0 ct)'));
    if (lv === 2) return {
      prompt: `Der Einkauf kostet ${euro(price)}. Du bezahlst mit einem 20-€-Schein. Wie viel Wechselgeld bekommst du?`,
      visual: {type: 'receipt', lines: [['Einkauf', price]], paid},
      fields: [sf('a', 'geld', 'eur', target)],
      hints: H('Rechne wie an der Kasse: Ergänze vom Preis bis zum bezahlten Betrag.', 'Ergänze zuerst bis zum nächsten vollen Zehner-Cent-Betrag, dann bis zum vollen Euro, dann bis 20 €.', steps.join('; ')),
      solution: [...steps, `Zusammen: ${euro(target)}`],
    };
    return {
      prompt: `Der Einkauf kostet ${euro(price)}. Du bezahlst mit 20 €. Gib das Wechselgeld mit möglichst wenigen Münzen und Scheinen heraus.`,
      visual: {type: 'receipt', lines: [['Einkauf', price]], paid},
      fields: [{kind: 'wallet', id: 'a', target, fewest: true}],
      hints: H(`Berechne zuerst das Wechselgeld: 20,00 € − ${euro(price)}.`, `Das Wechselgeld beträgt ${euro(target)}.`, 'Nimm immer das größte Stück, das noch passt.'),
      solution: [`Wechselgeld: ${euro(target)}`, `${coinFew(target)}`],
    };
  }},
  {id: 'g-malteilen', bereich: 'geld', title: 'Mal und geteilt mit Geld', goal: 'Ich multipliziere und dividiere Geldbeträge und vergleiche Angebote.', make(r, lv) {
    if (lv === 1) {
      const n = r.int(2, 6), p = r.int(5, 39) * 5;
      return {
        prompt: `Ein Heft kostet ${euro(p)}. Wie viel kosten ${n} Hefte?`,
        fields: [sf('a', 'geld', 'eur', n * p)],
        hints: H('Gleich viele gleiche Preise: Multipliziere.', 'Rechne in Cent, dann ist es einfacher.', `${n} · ${p} ct = ?`),
        solution: [`${n} · ${p} ct = ${n * p} ct`, `${n * p} ct = ${euro(n * p)}`],
      };
    }
    if (lv === 2) {
      const n = r.pick([2, 3, 4, 5]), each = r.int(30, 198) * 5;
      const total = n * each;
      return {
        prompt: `${n} Freunde teilen sich die Kosten für eine Pizza-Bestellung von ${euro(total)} gerecht. Wie viel bezahlt jeder?`,
        fields: [sf('a', 'geld', 'eur', each)],
        hints: H('Gerecht teilen bedeutet: dividieren.', 'Rechne den Betrag in Cent um.', `${total} ct : ${n} = ?`),
        solution: [`${euro(total)} = ${total} ct`, `${total} ct : ${n} = ${each} ct = ${euro(each)}`, `Probe: ${n} · ${euro(each)} = ${euro(total)}`],
      };
    }
    const k = r.pick([4, 6, 8]), single = r.pick([65, 75, 85]), pack = k * single - r.pick([20, 40, 60]);
    return {
      prompt: `Ein Joghurt kostet einzeln ${euro(single)}. Ein ${k}er-Pack kostet ${euro(pack)}. Wie viel sparst du mit dem Pack gegenüber ${k} einzelnen Joghurts?`,
      fields: [sf('a', 'geld', 'eur', k * single - pack, [{value: k * single, message: `Das kosten ${k} einzelne Joghurts. Ziehe noch den Preis des Packs ab.`}])],
      hints: H(`Wie viel kosten ${k} einzelne Joghurts?`, `${k} · ${euro(single)} = ${euro(k * single)}.`, `${euro(k * single)} − ${euro(pack)} = ?`),
      solution: [`${k} einzeln: ${k} · ${euro(single)} = ${euro(k * single)}`, `Ersparnis: ${euro(k * single)} − ${euro(pack)} = ${euro(k * single - pack)}`],
    };
  }},
  {id: 'g-ueberschlag', bereich: 'geld', vertiefung: true, title: 'Vertiefung: Überschlagen und sparen', goal: 'Ich überschlage Einkäufe und plane, wie lange ich sparen muss.', make(r, lv) {
    if (lv === 1 || lv === 2) {
      const prices = Array.from({length: lv === 1 ? 3 : 4}, () => r.int(1, 6) * 100 + r.pick([19, 29, 49, 79, 89, 99]));
      const rounded = prices.map(p => Math.round(p / 100) * 100);
      const est = rounded.reduce((s, x) => s + x, 0), exact = prices.reduce((s, x) => s + x, 0);
      if (lv === 1) {
        const budget = Math.round(est / 100 + r.pick([-1, 1, 2])) * 100;
        const enough = exact <= budget;
        return {
          prompt: `Du hast ${euro(budget)}. Du möchtest Dinge für ${prices.map(euro).join(', ')} kaufen. Überschlage: Reicht dein Geld?`,
          fields: [choice(r, 'a', enough ? 'Ja, das Geld reicht.' : 'Nein, das Geld reicht nicht.', [enough ? 'Nein, das Geld reicht nicht.' : 'Ja, das Geld reicht.'])],
          hints: H('Runde jeden Preis auf ganze Euro.', `Gerundet: ${rounded.map(euro).join(' + ')}.`, `Überschlag: etwa ${euro(est)}. Vergleiche mit ${euro(budget)}. Wenn es knapp ist, rechne genau nach.`),
          solution: [`Überschlag: ${rounded.map(euro).join(' + ')} ≈ ${euro(est)}`, `Genau: ${euro(exact)}`, enough ? `${euro(exact)} ≤ ${euro(budget)}: Das Geld reicht.` : `${euro(exact)} > ${euro(budget)}: Das Geld reicht nicht.`],
        };
      }
      return {
        prompt: `Runde jeden Preis auf ganze Euro und überschlage die Summe: ${prices.map(euro).join(' + ')}`,
        fields: [sf('a', 'geld', 'eur', est, [{value: exact, message: 'Das ist die genaue Summe. Beim Überschlag rundest du zuerst jeden Preis auf ganze Euro.'}])],
        hints: H('Ab 50 ct rundest du auf, darunter ab.', `Gerundet: ${rounded.map(euro).join(', ')}.`, `${rounded.map(x => x / 100).join(' + ')} = ?`),
        solution: [`Gerundet: ${rounded.map(euro).join(' + ')}`, `Überschlag: ${euro(est)}`],
      };
    }
    const save = r.pick([350, 400, 450, 500]), price = r.pick([2999, 3499, 3999, 4499]);
    const weeks = Math.ceil(price / save);
    return {
      prompt: `Ole bekommt ${euro(save)} Taschengeld pro Woche und spart alles. Ein Spiel kostet ${euro(price)}. Nach wie vielen Wochen kann er es kaufen?`,
      fields: [nf('a', weeks, 'Wochen', [{value: weeks - 1, message: `Nach ${weeks - 1} Wochen hat Ole erst ${euro((weeks - 1) * save)}. Das reicht noch nicht.`}])],
      hints: H('Wie viel Geld hat Ole nach 5 Wochen, nach 10 Wochen?', `Probiere: ${weeks - 1} · ${euro(save)} und ${weeks} · ${euro(save)}.`, `${weeks - 1} · ${euro(save)} = ${euro((weeks - 1) * save)}, ${weeks} · ${euro(save)} = ${euro(weeks * save)}.`),
      solution: [`${weeks - 1} Wochen: ${euro((weeks - 1) * save)} < ${euro(price)}`, `${weeks} Wochen: ${euro(weeks * save)} ≥ ${euro(price)}`, `Nach ${weeks} Wochen kann Ole das Spiel kaufen.`],
    };
  }},
];

function coinFew(ct: number) { return fewestCoins(ct).map(coinLabel).join(' + '); }

// =====================================================================
// FLÄCHEN
// =====================================================================
function rectCells(x: number, y: number, w: number, h: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) out.push([x + i, y + j]);
  return out;
}
const uniq = (cells: [number, number][]) => Array.from(new Map(cells.map(c => [c.join(','), c])).values());

const flaeche: Skill[] = [
  {id: 'f-auszaehlen', bereich: 'flaeche', title: 'Flächen auslegen und vergleichen', goal: 'Ich bestimme Flächeninhalte durch Auslegen mit Einheitsquadraten.', make(r, lv) {
    if (lv === 1) {
      const w = r.int(3, 7), h = r.int(2, 5);
      return {
        prompt: 'Jedes Kästchen ist 1 cm² groß. Wie groß ist die Fläche?', visual: {type: 'grid', full: rectCells(1, 1, w, h), w: 9, h: 7},
        fields: [sf('a', 'flaeche', 'cm2', w * h * 100, [{value: 2 * (w + h) * 100, message: 'Du hast den Rand gezählt. Der Flächeninhalt sind alle Kästchen im Inneren.'}])],
        hints: H('Zähle die Kästchen in einer Reihe.', `Eine Reihe hat ${w} Kästchen. Wie viele Reihen gibt es?`, `${h} Reihen mit je ${w} Kästchen: ${h} · ${w}.`),
        solution: [`${h} Reihen · ${w} Kästchen = ${w * h} Kästchen`, `Fläche: ${w * h} cm²`],
      };
    }
    if (lv === 2) {
      const a = rectCells(1, 1, r.int(2, 4), r.int(3, 5)), b = rectCells(1, 1, r.int(5, 7), r.int(1, 2));
      const cells = uniq([...a, ...b]);
      return {
        prompt: 'Jedes Kästchen ist 1 cm² groß. Wie groß ist die Fläche der Figur?', visual: {type: 'grid', full: cells, w: 9, h: 7},
        fields: [sf('a', 'flaeche', 'cm2', cells.length * 100)],
        hints: H('Zerlege die Figur in zwei Rechtecke.', 'Zähle jedes Rechteck einzeln. Zähle kein Kästchen doppelt.', 'Du kannst die Kästchen auch Reihe für Reihe zählen.'),
        solution: [`Die Figur besteht aus ${cells.length} Kästchen.`, `Fläche: ${cells.length} cm²`],
      };
    }
    const w = r.int(3, 5), h = r.int(2, 4);
    const full = rectCells(1, 1, w, h);
    const half: [number, number, 'tl' | 'tr' | 'bl' | 'br'][] = [];
    for (let j = 0; j < h; j++) half.push([1 + w, 1 + j, 'bl']);
    for (let j = 0; j < h; j++) half.push([0, 1 + j, 'br']);
    const area = w * h * 100 + half.length * 50;
    return {
      prompt: 'Jedes Kästchen ist 1 cm² groß. Am Rand gibt es halbe Kästchen. Wie groß ist die Fläche?', visual: {type: 'grid', full, half, w: 9, h: 7},
      fields: [sf('a', 'flaeche', 'cm2', area, [{value: (w * h + half.length) * 100, message: 'Die Dreiecke am Rand sind nur halbe Kästchen. Zwei halbe ergeben ein ganzes.'}])],
      hints: H('Zähle zuerst die ganzen Kästchen.', `Es sind ${w * h} ganze Kästchen. Zähle dann die halben.`, `${half.length} halbe Kästchen ergeben ${half.length / 2} ganze.`),
      solution: [`Ganze Kästchen: ${w * h}`, `Halbe Kästchen: ${half.length} = ${half.length / 2} ganze`, `Fläche: ${w * h + half.length / 2} cm²`],
    };
  }},
  {id: 'f-rechteck', bereich: 'flaeche', title: 'Flächeninhalt von Rechteck und Quadrat', goal: 'Ich berechne Flächeninhalte mit A = a · b und finde fehlende Seiten.', make(r, lv) {
    if (lv === 1) {
      const a = r.int(4, 12), b = r.int(2, a - 1);
      return {
        prompt: `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Berechne den Flächeninhalt.`, visual: {type: 'rect', a: `${a} cm`, b: `${b} cm`, ratio: b / a},
        fields: [sf('a', 'flaeche', 'cm2', a * b * 100, [{value: 2 * (a + b) * 100, message: 'Das ist der Umfang. Für den Flächeninhalt rechnest du Länge mal Breite.'}, {value: (a + b) * 100, message: 'Länge und Breite werden nicht addiert, sondern multipliziert.'}])],
        hints: H('Wie viele Zentimeterquadrate passen in eine Reihe?', `In eine Reihe passen ${a}. Es gibt ${b} Reihen.`, `A = a · b = ${a} cm · ${b} cm`),
        solution: [`A = a · b`, `A = ${a} cm · ${b} cm = ${a * b} cm²`],
      };
    }
    if (lv === 2) {
      if (r.next() < 0.5) {
        const s = r.int(4, 15);
        return {
          prompt: `Ein quadratisches Beet hat die Seitenlänge ${s} m. Wie groß ist seine Fläche?`, visual: {type: 'rect', a: `${s} m`, b: `${s} m`, ratio: 1},
          fields: [sf('a', 'flaeche', 'm2', s * s * 1e6, [{value: 4 * s * 1e6, message: 'Das ist der Umfang des Quadrats. Für die Fläche: Seite mal Seite.'}, {value: 2 * s * 1e6, message: 'Beim Quadrat rechnest du Seite mal Seite, nicht Seite mal 2.'}])],
          hints: H('Ein Quadrat ist ein Rechteck mit gleich langen Seiten.', 'A = a · a.', `${s} m · ${s} m = ?`),
          solution: [`A = a · a = ${s} m · ${s} m = ${s * s} m²`],
        };
      }
      const a = r.int(4, 12), b = r.int(3, 9);
      return {
        prompt: `Ein Rechteck hat den Flächeninhalt ${a * b} cm². Eine Seite ist ${a} cm lang. Wie lang ist die andere Seite?`, visual: {type: 'rect', a: `${a} cm`, b: '? cm', ratio: b / a, label: `${a * b} cm²`},
        fields: [sf('a', 'laenge', 'cm', b * 10)],
        hints: H('A = a · b. Du kennst A und a.', `${a} cm · ? = ${a * b} cm²`, `Rechne ${a * b} : ${a}.`),
        solution: [`${a} · b = ${a * b}`, `b = ${a * b} : ${a} = ${b}`, `Die andere Seite ist ${b} cm lang.`],
      };
    }
    const m = r.int(2, 4), cm = r.pick([20, 30, 40, 50]);
    const area = m * 100 * cm * 100; // in mm²: (m*1000 mm)*(cm*10 mm)
    return {
      prompt: `Ein Tischläufer ist ${m} m lang und ${cm} cm breit. Wie groß ist seine Fläche in cm²?`, visual: {type: 'rect', a: `${m} m`, b: `${cm} cm`, ratio: 0.25},
      fields: [sf('a', 'flaeche', 'cm2', area, [{value: m * cm * 100, message: `Die Seiten stehen in verschiedenen Einheiten. Rechne zuerst ${m} m in Zentimeter um.`}])],
      hints: H('Beide Seiten müssen in derselben Einheit stehen.', `${m} m = ${m * 100} cm.`, `${m * 100} cm · ${cm} cm = ?`),
      solution: [`${m} m = ${m * 100} cm`, `A = ${m * 100} cm · ${cm} cm = ${fmtNum(m * 100 * cm)} cm²`],
    };
  }},
  {id: 'f-umfang', bereich: 'flaeche', title: 'Umfang und Flächeninhalt', goal: 'Ich unterscheide den Umfang (Rand) vom Flächeninhalt (Innen).', make(r, lv) {
    if (lv === 1) {
      const a = r.int(4, 12), b = r.int(2, a - 1);
      return {
        prompt: `Ein rechteckiges Beet ist ${a} m lang und ${b} m breit. Es soll ein Zaun darum. Wie lang wird der Zaun?`, visual: {type: 'rect', a: `${a} m`, b: `${b} m`, ratio: b / a},
        fields: [sf('a', 'laenge', 'm', 2 * (a + b) * 1000, [{value: a * b * 1000, message: 'Du hast Länge mal Breite gerechnet. Das ist der Flächeninhalt. Für den Zaun gehst du einmal um das Beet herum.'}, {value: (a + b) * 1000, message: 'Das sind nur zwei Seiten. Das Rechteck hat vier Seiten.'}])],
        hints: H('Der Zaun läuft einmal ganz um das Beet herum.', 'Ein Rechteck hat zwei lange und zwei kurze Seiten.', `U = ${a} m + ${b} m + ${a} m + ${b} m`),
        solution: [`U = 2 · (a + b)`, `U = 2 · (${a} m + ${b} m) = ${2 * (a + b)} m`],
      };
    }
    if (lv === 2) {
      const a = r.int(5, 12), b = r.int(2, a - 1);
      return {
        prompt: `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Berechne Umfang und Flächeninhalt.`, visual: {type: 'rect', a: `${a} cm`, b: `${b} cm`, ratio: b / a},
        fields: [sf('u', 'laenge', 'cm', 2 * (a + b) * 10, [{value: a * b * 10, message: 'Das ist der Flächeninhalt. Der Umfang ist die Länge des Randes.'}], 'Umfang'), sf('A', 'flaeche', 'cm2', a * b * 100, [{value: 2 * (a + b) * 100, message: 'Das ist der Umfang. Der Flächeninhalt zählt die Quadrate im Inneren.'}], 'Flächeninhalt')],
        hints: H('Umfang: Länge des Randes. Flächeninhalt: Anzahl der Zentimeterquadrate.', 'U = 2 · (a + b), A = a · b.', `U = 2 · (${a} + ${b}) cm, A = ${a} · ${b} cm²`),
        solution: [`U = 2 · (${a} cm + ${b} cm) = ${2 * (a + b)} cm`, `A = ${a} cm · ${b} cm = ${a * b} cm²`],
      };
    }
    if (r.next() < 0.5) {
      const s = r.int(5, 12);
      return {
        prompt: `Ein Quadrat hat den Umfang ${4 * s} cm. Wie groß ist sein Flächeninhalt?`,
        fields: [sf('a', 'flaeche', 'cm2', s * s * 100, [{value: 4 * s * 100, message: 'Das ist der Umfang. Berechne zuerst die Seitenlänge.'}])],
        hints: H('Ein Quadrat hat vier gleich lange Seiten.', `Seitenlänge: ${4 * s} cm : 4 = ${s} cm.`, `A = ${s} cm · ${s} cm`),
        solution: [`a = ${4 * s} cm : 4 = ${s} cm`, `A = ${s} cm · ${s} cm = ${s * s} cm²`],
      };
    }
    const a = r.int(6, 10), b = r.int(2, 5), U = 2 * (a + b);
    return {
      prompt: `Ein Rechteck hat den Umfang ${U} cm. Eine Seite ist ${a} cm lang. Wie lang ist die andere Seite, und wie groß ist der Flächeninhalt?`,
      fields: [sf('b', 'laenge', 'cm', b * 10, [{value: (U - a) * 10, message: `Im Umfang kommt die Seite ${a} cm zweimal vor. Ziehe 2 · ${a} cm ab und teile den Rest durch 2.`}], 'andere Seite'), sf('A', 'flaeche', 'cm2', a * b * 100, undefined, 'Flächeninhalt')],
      hints: H('Im Umfang kommt jede Seite zweimal vor.', `${U} cm − 2 · ${a} cm = ${U - 2 * a} cm. Das sind beide anderen Seiten zusammen.`, `Andere Seite: ${U - 2 * a} cm : 2 = ${b} cm. Dann A = ${a} · ${b}.`),
      solution: [`${U} − 2 · ${a} = ${U - 2 * a}`, `${U - 2 * a} : 2 = ${b}, also b = ${b} cm`, `A = ${a} cm · ${b} cm = ${a * b} cm²`],
    };
  }},
  {id: 'f-einheiten', bereich: 'flaeche', title: 'Flächeneinheiten umrechnen', goal: 'Ich rechne Flächeneinheiten mit der Umrechnungszahl 100 um, auch Ar und Hektar.', make(r, lv) {
    if (lv === 1) {
      const c = r.pick([['m2', 'dm2'], ['dm2', 'cm2'], ['cm2', 'mm2'], ['dm2', 'm2'], ['cm2', 'dm2']] as const);
      const k = r.int(2, 15);
      const fa = unit('flaeche', c[0]).factor, fb = unit('flaeche', c[1]).factor;
      return conv('flaeche', c[0], c[1], k * Math.max(fa, fb), [{value: (fa > fb ? k * fa / 10 : k * fb * 10), message: 'Bei Flächen ist die Umrechnungszahl 100, nicht 10. Ein Quadrat mit 1 dm Seitenlänge enthält 10 · 10 = 100 Quadrate mit 1 cm Seitenlänge.'}]);
    }
    if (lv === 2) {
      const t = r.int(0, 3);
      if (t === 0) return conv('flaeche', 'm2', 'cm2', r.int(2, 9) * 1e6);
      if (t === 1) return conv('flaeche', 'ha', 'a', r.int(2, 9) * 1e10);
      if (t === 2) return conv('flaeche', 'a', 'm2', r.int(2, 30) * 1e8);
      return conv('flaeche', 'm2', 'dm2', (r.int(1, 9) * 10 + r.int(1, 9)) * 1e5);
    }
    if (r.next() < 0.5) return conv('flaeche', 'km2', 'ha', r.int(2, 9) * 1e12);
    const items = r.shuffle([{label: '1 m²', value: 1e6}, {label: '99 dm²', value: 99e4}, {label: '1 a', value: 1e8}, {label: '1.050.000 mm²', value: 105e4}]);
    return {
      prompt: 'Ordne die Flächen. Tippe sie von der kleinsten zur größten an.',
      fields: [orderField(r, 'a', items)],
      hints: H('Bringe alle Flächen in dieselbe Einheit.', 'Rechne zum Beispiel alles in dm² um. 1 m² = 100 dm², 1 a = 100 m².', items.map(i => `${i.label} = ${fmtNum(i.value / 1e4)} dm²`).join('; ')),
      solution: [...items.map(i => `${i.label} = ${fmtNum(i.value / 1e4)} dm²`), 'Dann nach der Größe der Zahl ordnen.'],
    };
  }},
  {id: 'f-zusammengesetzt', bereich: 'flaeche', title: 'Zusammengesetzte Flächen', goal: 'Ich zerlege Figuren in Rechtecke oder ergänze sie und berechne den Flächeninhalt.', make(r, lv) {
    if (lv === 1 || lv === 3) {
      const W = r.int(6, 10), H2 = r.int(5, 8), cutW = r.int(2, W - 3), cutH = r.int(2, H2 - 2);
      const A = W * H2 - cutW * cutH;
      const u = lv === 1 ? 'cm' : 'm';
      const field = lv === 1 ? sf('a', 'flaeche', 'cm2', A * 100, [{value: W * H2 * 100, message: 'Das ist das ganze Rechteck. Die Ecke oben rechts fehlt aber. Ziehe sie ab.'}]) : sf('a', 'flaeche', 'm2', A * 1e6, [{value: W * H2 * 1e6, message: 'Das ist das ganze Rechteck. Die Ecke oben rechts fehlt aber. Ziehe sie ab.'}], 'Fläche');
      const fields: Field[] = [field];
      if (lv === 3) fields.push(nf('p', Math.ceil(A / 3), 'Pakete', [{value: Math.floor(A / 3), message: 'Mit dieser Zahl an Paketen fehlt noch ein Stück Boden. Du musst aufrunden.'}], 'Laminat-Pakete'));
      return {
        prompt: lv === 1 ? 'Berechne den Flächeninhalt der Figur.' : `Ein L-förmiges Zimmer soll Laminat bekommen. Ein Paket reicht für 3 m². Berechne die Fläche und wie viele Pakete du kaufen musst.`,
        visual: {type: 'lshape', dims: {W, H: H2, cutW, cutH}, unit: u},
        fields,
        hints: H('Die Figur ist ein Rechteck, dem eine Ecke fehlt.', `Großes Rechteck: ${W} ${u} · ${H2} ${u}. Fehlende Ecke: ${cutW} ${u} · ${cutH} ${u}.`, `${W * H2} − ${cutW * cutH} = ?${lv === 3 ? ' Teile dann durch 3 und runde auf.' : ''}`),
        solution: [`Großes Rechteck: ${W} · ${H2} = ${W * H2} ${u}²`, `Fehlende Ecke: ${cutW} · ${cutH} = ${cutW * cutH} ${u}²`, `Fläche: ${W * H2} − ${cutW * cutH} = ${A} ${u}²`, ...(lv === 3 ? [`${A} : 3 = ${fmtNum(A / 3, 2)} → ${Math.ceil(A / 3)} Pakete (aufrunden)`] : [])],
      };
    }
    const W = r.int(20, 40), H2 = r.int(15, 30), w = W - 2 * r.int(2, 5), h = H2 - 2 * r.int(2, 5);
    return {
      prompt: `Ein Bilderrahmen ist außen ${W} cm breit und ${H2} cm hoch. Das Bild innen ist ${w} cm breit und ${h} cm hoch. Wie groß ist die Fläche des Rahmens?`,
      visual: {type: 'frame', W, H: H2, w, h, unit: 'cm'},
      fields: [sf('a', 'flaeche', 'cm2', (W * H2 - w * h) * 100, [{value: W * H2 * 100, message: 'Das ist die Fläche mit Bild. Ziehe die Bildfläche ab.'}, {value: w * h * 100, message: 'Das ist die Fläche des Bildes, nicht des Rahmens.'}])],
      hints: H('Rahmen = großes Rechteck − Bild.', `Großes Rechteck: ${W} · ${H2}. Bild: ${w} · ${h}.`, `${W * H2} − ${w * h} = ?`),
      solution: [`Außen: ${W} cm · ${H2} cm = ${W * H2} cm²`, `Bild: ${w} cm · ${h} cm = ${w * h} cm²`, `Rahmen: ${W * H2} − ${w * h} = ${W * H2 - w * h} cm²`],
    };
  }},
  {id: 'f-sachaufgaben', bereich: 'flaeche', vertiefung: true, title: 'Vertiefung: Flächen im Alltag', goal: 'Ich löse mehrschrittige Sachaufgaben zu Rasen, Fliesen und Wänden.', make(r, lv) {
    if (lv === 1) {
      const a = r.int(5, 12), b = r.int(4, 9), g = r.pick([20, 25, 30]);
      return {
        prompt: `Ein Rasen soll neu gesät werden. Er ist ${a} m lang und ${b} m breit. Für 1 m² braucht man ${g} g Samen. Wie viel Samen brauchst du?`,
        fields: [sf('a', 'masse', 'g', a * b * g * 1000)],
        hints: H('Berechne zuerst die Rasenfläche.', `A = ${a} m · ${b} m = ${a * b} m².`, `${a * b} · ${g} g = ?`),
        solution: [`A = ${a} m · ${b} m = ${a * b} m²`, `Samen: ${a * b} · ${g} g = ${fmtNum(a * b * g)} g = ${size(a * b * g * 1000, 'masse', 'kg')}`],
      };
    }
    if (lv === 2) {
      const a = r.int(2, 5), b = r.int(2, 4);
      return {
        prompt: `Ein Badezimmerboden ist ${a} m lang und ${b} m breit. Er wird mit quadratischen Fliesen (50 cm × 50 cm) belegt. Wie viele Fliesen brauchst du?`,
        visual: {type: 'rect', a: `${a} m`, b: `${b} m`, ratio: b / a},
        fields: [nf('a', a * b * 4, 'Fliesen', [{value: a * b * 2, message: 'Auf 1 m Länge passen 2 Fliesen, aber auf 1 m² passen 2 · 2 = 4 Fliesen.'}, {value: a * b, message: 'Eine Fliese ist kleiner als 1 m². Wie viele Fliesen passen auf 1 m²?'}])],
        hints: H('Wie viele Fliesen passen nebeneinander auf 1 m Länge?', `Auf ${a} m passen ${2 * a} Fliesen, auf ${b} m passen ${2 * b} Fliesen.`, `${2 * a} · ${2 * b} = ?`),
        solution: [`Länge: ${a} m = ${a * 100} cm → ${2 * a} Fliesen`, `Breite: ${b} m = ${b * 100} cm → ${2 * b} Fliesen`, `${2 * a} · ${2 * b} = ${4 * a * b} Fliesen`],
      };
    }
    const w = r.pick([5, 6, 7, 8]), h = 3, door = 2, per = r.pick([5, 6, 8]);
    const A = w * h - door, liters = Math.ceil(A / per);
    return {
      prompt: `Eine Wand ist ${w} m breit und ${h} m hoch. Darin ist eine Tür (1 m × 2 m), die nicht gestrichen wird. 1 Liter Farbe reicht für ${per} m². Wie groß ist die Fläche zum Streichen, und wie viele Liter musst du mindestens kaufen (nur ganze Liter)?`,
      fields: [sf('A', 'flaeche', 'm2', A * 1e6, [{value: w * h * 1e6, message: 'Die Tür wird nicht gestrichen. Ziehe ihre Fläche ab.'}], 'Fläche'), nf('l', liters, 'Liter', [{value: Math.floor(A / per), message: 'Damit reicht die Farbe nicht für die ganze Wand. Runde auf.'}], 'Farbe')],
      hints: H('Wand minus Tür.', `${w} m · ${h} m = ${w * h} m², Tür: 2 m².`, `${A} m² : ${per} m² = ${fmtNum(A / per, 2)}. Runde auf ganze Liter auf.`),
      solution: [`Wand: ${w * h} m², Tür: 2 m²`, `Zu streichen: ${A} m²`, `${A} : ${per} = ${fmtNum(A / per, 2)} → ${liters} Liter`],
    };
  }},
];

// =====================================================================
// VOLUMEN
// =====================================================================
const volumen: Skill[] = [
  {id: 'v-wuerfel', bereich: 'volumen', title: 'Rauminhalt mit Würfeln', goal: 'Ich bestimme den Rauminhalt, indem ich Einheitswürfel schichtweise zähle.', make(r, lv) {
    if (lv === 1 || lv === 2) {
      const a = lv === 1 ? r.int(2, 3) : r.int(3, 5), b = lv === 1 ? r.int(1, 3) : r.int(2, 4), c = lv === 1 ? r.int(1, 2) : r.int(2, 4);
      return {
        prompt: `Der Quader ist aus Würfeln mit 1 cm Kantenlänge gebaut. Jeder Würfel hat 1 cm³. Wie groß ist das Volumen?`, visual: {type: 'cuboid', a, b, c},
        fields: [sf('a', 'volumen', 'cm3', a * b * c * 1000)],
        hints: H('Zähle zuerst die Würfel in der untersten Schicht.', `Unterste Schicht: ${a} · ${b} = ${a * b} Würfel. Wie viele Schichten gibt es?`, `${c} Schicht${c > 1 ? 'en' : ''} mit je ${a * b} Würfeln.`),
        solution: [`Eine Schicht: ${a} · ${b} = ${a * b} Würfel`, `${c} Schicht${c > 1 ? 'en' : ''}: ${a * b} · ${c} = ${a * b * c} Würfel`, `V = ${a * b * c} cm³`],
      };
    }
    const a = r.int(3, 4), b = r.int(2, 3), c = r.int(2, 3), missing = r.int(2, a);
    return {
      prompt: 'In der obersten Schicht fehlen Würfel. Wie viele Würfel musst du noch hinzufügen, damit ein vollständiger Quader entsteht?', visual: {type: 'cuboid', a, b, c, missing},
      fields: [nf('a', missing, 'Würfel', [{value: a * b * c - missing, message: 'Das ist die Anzahl der vorhandenen Würfel. Gefragt ist, wie viele fehlen.'}])],
      hints: H('Wie viele Würfel hätte der vollständige Quader?', `Vollständig: ${a} · ${b} · ${c} = ${a * b * c} Würfel.`, 'Schau dir die vorderste Reihe der obersten Schicht an.'),
      solution: [`Vollständiger Quader: ${a * b * c} Würfel`, `Vorhanden: ${a * b * c - missing} Würfel`, `Es fehlen ${missing} Würfel.`],
    };
  }},
  {id: 'v-quader', bereich: 'volumen', title: 'Volumen von Quader und Würfel', goal: 'Ich berechne Volumen mit V = a · b · c und finde fehlende Kanten.', make(r, lv) {
    if (lv === 1) {
      const a = r.int(2, 9), b = r.int(2, 6), c = r.int(2, 5);
      return {
        prompt: `Ein Quader ist ${a} cm lang, ${b} cm breit und ${c} cm hoch. Berechne sein Volumen.`, visual: {type: 'box', a: `${a} cm`, b: `${b} cm`, c: `${c} cm`},
        fields: [sf('a', 'volumen', 'cm3', a * b * c * 1000, [{value: (a + b + c) * 1000, message: 'Die Kanten werden nicht addiert, sondern multipliziert.'}])],
        hints: H('V = Länge · Breite · Höhe.', `Grundfläche: ${a} · ${b} = ${a * b} cm². Wie oft wird sie gestapelt?`, `${a * b} · ${c} = ?`),
        solution: [`V = a · b · c`, `V = ${a} cm · ${b} cm · ${c} cm = ${a * b * c} cm³`],
      };
    }
    if (lv === 2) {
      if (r.next() < 0.5) {
        const s = r.int(2, 10);
        return {
          prompt: `Ein Würfel hat die Kantenlänge ${s} cm. Wie groß ist sein Volumen?`, visual: {type: 'box', a: `${s} cm`, b: `${s} cm`, c: `${s} cm`},
          fields: [sf('a', 'volumen', 'cm3', s ** 3 * 1000, [{value: s * s * 1000, message: 'Das ist nur eine Fläche (a · a). Beim Würfel rechnest du a · a · a.'}, {value: 3 * s * 1000, message: 'Beim Würfel rechnest du a · a · a, nicht 3 · a.'}])],
          hints: H('Beim Würfel sind alle Kanten gleich lang.', 'V = a · a · a.', `${s} · ${s} · ${s} = ?`),
          solution: [`V = ${s} cm · ${s} cm · ${s} cm = ${s ** 3} cm³`],
        };
      }
      const a = r.int(3, 8), b = r.int(2, 5), c = r.int(2, 6);
      return {
        prompt: `Ein Quader hat das Volumen ${a * b * c} cm³. Er ist ${a} cm lang und ${b} cm breit. Wie hoch ist er?`, visual: {type: 'box', a: `${a} cm`, b: `${b} cm`, c: '? cm'},
        fields: [sf('a', 'laenge', 'cm', c * 10)],
        hints: H('V = a · b · c. Du kennst V, a und b.', `Grundfläche: ${a} · ${b} = ${a * b} cm².`, `${a * b * c} : ${a * b} = ?`),
        solution: [`Grundfläche: ${a} · ${b} = ${a * b} cm²`, `Höhe: ${a * b * c} : ${a * b} = ${c} cm`],
      };
    }
    const a = r.pick([1, 2, 3]), b = r.pick([20, 40, 50]), c = r.pick([10, 20, 30]);
    const V = a * 10 * (b / 10) * (c / 10); // dm³
    return {
      prompt: `Eine Kiste ist ${a} m lang, ${b} cm breit und ${c} cm hoch. Wie groß ist ihr Volumen in dm³?`, visual: {type: 'box', a: `${a} m`, b: `${b} cm`, c: `${c} cm`},
      fields: [sf('a', 'volumen', 'dm3', V * 1e6, [{value: a * b * c * 1e6, message: 'Die Kanten stehen in verschiedenen Einheiten. Rechne zuerst alle Kanten in dm um.'}])],
      hints: H('Rechne alle Kanten in Dezimeter um.', `${a} m = ${a * 10} dm, ${b} cm = ${b / 10} dm, ${c} cm = ${c / 10} dm.`, `${a * 10} · ${b / 10} · ${c / 10} = ?`),
      solution: [`${a} m = ${a * 10} dm; ${b} cm = ${b / 10} dm; ${c} cm = ${c / 10} dm`, `V = ${a * 10} dm · ${b / 10} dm · ${c / 10} dm = ${fmtNum(V)} dm³`],
    };
  }},
  {id: 'v-einheiten', bereich: 'volumen', title: 'Volumeneinheiten umrechnen', goal: 'Ich rechne Volumeneinheiten mit der Umrechnungszahl 1000 um.', make(r, lv) {
    if (lv === 1) {
      const c = r.pick([['dm3', 'cm3'], ['m3', 'dm3'], ['cm3', 'mm3'], ['cm3', 'dm3'], ['dm3', 'm3']] as const);
      const k = r.int(2, 15);
      const fa = unit('volumen', c[0]).factor, fb = unit('volumen', c[1]).factor;
      return conv('volumen', c[0], c[1], k * Math.max(fa, fb), [{value: fa > fb ? k * fa / 10 : k * fb * 10, message: 'Bei Volumen ist die Umrechnungszahl 1000, nicht 100. In einen 1-dm-Würfel passen 10 · 10 · 10 = 1000 Zentimeterwürfel.'}, {value: fa > fb ? k * fa / 100 : k * fb * 100, message: 'Die Umrechnungszahl 100 gilt bei Flächen. Bei Volumen ist sie 1000.'}]);
    }
    if (lv === 2) {
      if (r.next() < 0.5) { const w = r.int(1, 9), d = r.int(1, 9); return conv('volumen', 'dm3', 'cm3', (w * 10 + d) * 1e5); }
      return conv('volumen', 'cm3', 'dm3', r.int(1001, 9999) * 1000);
    }
    if (r.next() < 0.5) return conv('volumen', 'm3', 'cm3', r.int(2, 5) * 1e9);
    const items = r.shuffle([{label: '1 dm³', value: 1e6}, {label: '999 cm³', value: 999e3}, {label: '1.100 cm³', value: 11e5}, {label: '0,5 dm³', value: 5e5}]);
    return {
      prompt: 'Ordne die Volumen. Tippe sie vom kleinsten zum größten an.',
      fields: [orderField(r, 'a', items)],
      hints: H('Bringe alle Volumen in dieselbe Einheit.', '1 dm³ = 1000 cm³.', items.map(i => `${i.label} = ${fmtNum(i.value / 1000)} cm³`).join('; ')),
      solution: [...items.map(i => `${i.label} = ${fmtNum(i.value / 1000)} cm³`), 'Dann nach der Größe der Zahl ordnen.'],
    };
  }},
  {id: 'v-liter', bereich: 'volumen', title: 'Liter und Milliliter', goal: 'Ich lese Messbecher ab, rechne zwischen l und ml um und weiß: 1 l = 1 dm³.', make(r, lv) {
    if (lv === 1) {
      const max = r.pick([500, 1000]), step = max === 500 ? 50 : 100;
      const ml = r.int(2, max / step - 1) * step;
      return {
        prompt: 'Wie viel Wasser ist im Messbecher?', visual: {type: 'jug', ml, max, step},
        fields: [sf('a', 'volumen', 'ml', ml * 1000)],
        hints: H('Schau auf die Zahlen am Rand des Bechers.', `Ein Strich bedeutet ${step} ml.`, 'Lies ab, an welchem Strich die Wasseroberfläche steht.'),
        solution: [`Der Wasserstand ist bei ${ml} ml.`, ml >= 1000 ? `${ml} ml = ${size(ml * 1000, 'volumen', 'l')}` : `Das ist weniger als 1 l (1 l = 1000 ml).`],
      };
    }
    if (lv === 2) {
      const t = r.int(0, 2);
      if (t === 0) { const w = r.int(1, 5), d = r.int(1, 9); return conv('volumen', 'l', 'ml', (w * 10 + d) * 1e5); }
      if (t === 1) {
        const bottle = r.pick([1000, 1500, 2000]), glass = r.pick([200, 250]);
        return {
          prompt: `Aus einer ${size(bottle * 1000, 'volumen', 'l')}-Flasche Saft werden Gläser mit je ${glass} ml gefüllt. Wie viele Gläser werden voll?`,
          fields: [nf('a', Math.floor(bottle / glass), 'Gläser')],
          hints: H('Rechne die Flasche in Milliliter um.', `${size(bottle * 1000, 'volumen', 'l')} = ${bottle} ml.`, `${bottle} : ${glass} = ?`),
          solution: [`${size(bottle * 1000, 'volumen', 'l')} = ${bottle} ml`, `${bottle} ml : ${glass} ml = ${fmtNum(bottle / glass)}`, `${Math.floor(bottle / glass)} Gläser werden voll.`],
        };
      }
      return conv('volumen', 'dm3', 'l', r.int(2, 30) * 1e6);
    }
    const a = r.pick([40, 50, 60, 80]), b = r.pick([25, 30, 40]), c = r.pick([30, 40, 50]);
    const cm3 = a * b * c;
    return {
      prompt: `Ein Aquarium ist ${a} cm lang, ${b} cm breit und ${c} cm hoch. Wie viele Liter Wasser passen hinein?`, visual: {type: 'box', a: `${a} cm`, b: `${b} cm`, c: `${c} cm`},
      fields: [sf('a', 'volumen', 'l', cm3 * 1000, [{value: cm3 * 1e6, message: `${fmtNum(cm3)} ist das Volumen in cm³. Rechne noch in Liter um: 1 l = 1 dm³ = 1000 cm³.`}])],
      hints: H('Berechne zuerst das Volumen in cm³.', `V = ${a} · ${b} · ${c} cm³ = ${fmtNum(cm3)} cm³.`, `1 l = 1000 cm³. Rechne ${fmtNum(cm3)} : 1000.`),
      solution: [`V = ${a} cm · ${b} cm · ${c} cm = ${fmtNum(cm3)} cm³`, `${fmtNum(cm3)} cm³ = ${fmtNum(cm3 / 1000)} dm³ = ${fmtNum(cm3 / 1000)} l`],
    };
  }},
  {id: 'v-sachaufgaben', bereich: 'volumen', title: 'Sachaufgaben zum Volumen', goal: 'Ich löse Sachaufgaben zum Füllen und Stapeln mit Quadern.', make(r, lv) {
    if (lv === 1) {
      const a = r.pick([20, 30, 40]), b = r.pick([20, 30]), c = r.pick([10, 20]);
      const n = (a / 10) * (b / 10) * (c / 10);
      return {
        prompt: `Ein Karton ist ${a} cm lang, ${b} cm breit und ${c} cm hoch. Wie viele Würfel mit 10 cm Kantenlänge passen hinein?`, visual: {type: 'box', a: `${a} cm`, b: `${b} cm`, c: `${c} cm`},
        fields: [nf('a', n, 'Würfel', [{value: a * b * c, message: 'Das ist das Volumen in cm³. Ein Würfel ist aber 10 cm lang. Wie viele passen in jede Richtung?'}])],
        hints: H('Wie viele Würfel passen in die Länge?', `Länge: ${a / 10}, Breite: ${b / 10}, Höhe: ${c / 10}.`, `${a / 10} · ${b / 10} · ${c / 10} = ?`),
        solution: [`In die Länge: ${a} : 10 = ${a / 10}`, `In die Breite: ${b} : 10 = ${b / 10}`, `In die Höhe: ${c} : 10 = ${c / 10}`, `${a / 10} · ${b / 10} · ${c / 10} = ${n} Würfel`],
      };
    }
    if (lv === 2) {
      const a = r.pick([2, 3, 4]), b = r.pick([2, 3]), c = r.pick([3, 4, 5]); // dm → Sandkasten in dm
      const V = a * 10 * b * 10 * c; // dm³ with c in dm
      return {
        prompt: `Ein Sandkasten ist ${a} m lang, ${b} m breit und wird ${c} dm hoch mit Sand gefüllt. Wie viel Kubikmeter Sand werden gebraucht?`,
        visual: {type: 'box', a: `${a} m`, b: `${b} m`, c: `${c} dm`},
        fields: [sf('a', 'volumen', 'm3', V * 1e6, [{value: a * b * c * 1e9, message: `Die Höhe steht in Dezimetern. ${c} dm sind ${fmtNum(c / 10)} m.`}])],
        hints: H('Rechne alle Kanten in dieselbe Einheit um, zum Beispiel dm.', `${a} m = ${a * 10} dm, ${b} m = ${b * 10} dm.`, `${a * 10} · ${b * 10} · ${c} = ${fmtNum(V)} dm³. 1 m³ = 1000 dm³.`),
        solution: [`V = ${a * 10} dm · ${b * 10} dm · ${c} dm = ${fmtNum(V)} dm³`, `${fmtNum(V)} dm³ = ${size(V * 1e6, 'volumen', 'm3')}`],
      };
    }
    const a = r.pick([40, 50, 60]), b = r.pick([20, 25, 30, 40]), add = r.pick([2, 4, 5, 6]) * (a * b) / 1000;
    const rise = add * 1000 / (a * b);
    return {
      prompt: `Ein Aquarium hat eine Grundfläche von ${a} cm × ${b} cm. Du gießt ${fmtNum(add)} Liter Wasser hinzu. Um wie viele Zentimeter steigt der Wasserstand?`,
      visual: {type: 'box', a: `${a} cm`, b: `${b} cm`, c: '?'},
      fields: [sf('a', 'laenge', 'cm', rise * 10)],
      hints: H('Das zusätzliche Wasser bildet einen flachen Quader mit derselben Grundfläche.', `${fmtNum(add)} l = ${fmtNum(add * 1000)} cm³. Grundfläche: ${a} · ${b} = ${a * b} cm².`, `Höhe = Volumen : Grundfläche = ${fmtNum(add * 1000)} : ${a * b}.`),
      solution: [`${fmtNum(add)} l = ${fmtNum(add * 1000)} cm³`, `Grundfläche: ${a * b} cm²`, `Anstieg: ${fmtNum(add * 1000)} : ${a * b} = ${fmtNum(rise)} cm`],
    };
  }},
  {id: 'v-oberflaeche', bereich: 'volumen', vertiefung: true, title: 'Vertiefung: Oberfläche und Volumen', goal: 'Ich berechne die Oberfläche von Quadern und unterscheide sie vom Volumen.', make(r, lv) {
    if (lv === 1) {
      const s = r.int(2, 9);
      return {
        prompt: `Ein Würfel hat die Kantenlänge ${s} cm. Wie groß ist seine Oberfläche?`, visual: {type: 'box', a: `${s} cm`, b: `${s} cm`, c: `${s} cm`},
        fields: [sf('a', 'flaeche', 'cm2', 6 * s * s * 100, [{value: s * s * 100, message: 'Das ist nur eine Seitenfläche. Ein Würfel hat 6 gleich große Flächen.'}, {value: s ** 3 * 100, message: 'Das ist die Maßzahl des Volumens. Die Oberfläche ist die Summe aller 6 Seitenflächen.'}])],
        hints: H('Wie viele Flächen hat ein Würfel?', `Jede Fläche ist ein Quadrat mit ${s} cm · ${s} cm = ${s * s} cm².`, `6 · ${s * s} cm² = ?`),
        solution: [`Eine Fläche: ${s} · ${s} = ${s * s} cm²`, `O = 6 · ${s * s} cm² = ${6 * s * s} cm²`],
      };
    }
    const a = r.int(3, 8), b = r.int(2, 6), c = r.int(2, 5);
    const O = 2 * (a * b + a * c + b * c);
    if (lv === 2) return {
      prompt: `Ein Quader ist ${a} cm lang, ${b} cm breit und ${c} cm hoch. Berechne seine Oberfläche.`, visual: {type: 'box', a: `${a} cm`, b: `${b} cm`, c: `${c} cm`},
      fields: [sf('a', 'flaeche', 'cm2', O * 100, [{value: (a * b + a * c + b * c) * 100, message: 'Jede Fläche kommt zweimal vor: oben und unten, vorne und hinten, links und rechts.'}])],
      hints: H('Ein Quader hat 6 Flächen. Je zwei gegenüberliegende sind gleich groß.', `Oben/unten: ${a} · ${b}; vorne/hinten: ${a} · ${c}; links/rechts: ${b} · ${c}.`, `O = 2 · (${a * b} + ${a * c} + ${b * c})`),
      solution: [`O = 2 · (a · b + a · c + b · c)`, `O = 2 · (${a * b} + ${a * c} + ${b * c}) = ${O} cm²`],
    };
    return {
      prompt: `Ein Geschenk hat die Form eines Quaders (${a} cm × ${b} cm × ${c} cm). Berechne Volumen und Oberfläche. Wie viel Geschenkpapier brauchst du mindestens?`, visual: {type: 'box', a: `${a} cm`, b: `${b} cm`, c: `${c} cm`},
      fields: [sf('V', 'volumen', 'cm3', a * b * c * 1000, undefined, 'Volumen'), sf('O', 'flaeche', 'cm2', O * 100, [{value: a * b * c * 100, message: 'Das ist die Maßzahl des Volumens. Für das Papier brauchst du die Oberfläche.'}], 'Oberfläche (Papier)')],
      hints: H('Volumen: Wie viel passt hinein? Oberfläche: Wie viel Papier bedeckt alle Seiten?', `V = ${a} · ${b} · ${c}. O = 2 · (${a * b} + ${a * c} + ${b * c}).`, `V = ${a * b * c} cm³. Rechne O aus.`),
      solution: [`V = ${a} · ${b} · ${c} = ${a * b * c} cm³`, `O = 2 · (${a * b} + ${a * c} + ${b * c}) = ${O} cm²`, `Du brauchst mindestens ${O} cm² Papier.`],
    };
  }},
];

export const skills: Skill[] = [...laenge, ...masse, ...geld, ...flaeche, ...volumen];
export const skillById = Object.fromEntries(skills.map(s => [s.id, s])) as Record<string, Skill>;
export const coreSkills = (b: Bereich) => skills.filter(s => s.bereich === b && !s.vertiefung);
export const deepSkills = (b: Bereich) => skills.filter(s => s.bereich === b && s.vertiefung);

export function makeTask(skillId: string, seed: number, level: Level): Task {
  const s = skillById[skillId];
  if (!s) throw new Error('Unbekannte Fähigkeit ' + skillId);
  const d = s.make(rng(seed * 7919 + level * 104729 + skillId.length * 31), level);
  return {...d, id: `${skillId}-${level}-${seed}`, bereich: s.bereich, skill: s.id, level};
}

/** Übungsrunde: 6 Aufgaben einer Fähigkeit (oder gemischt) auf einem Niveau. */
export function makePractice(b: Bereich, skillId: string | 'mix', level: Level, seed: number, count = 6): Task[] {
  const pool = skillId === 'mix' ? coreSkills(b).map(s => s.id) : [skillId];
  return Array.from({length: count}, (_, i) => makeTask(pool[i % pool.length], seed + i * 13, level));
}

/** Test eines Bereichs: je Fähigkeit eine Standard-Aufgabe und eine Knobelaufgabe, dazu Grundlagen. */
export function makeBereichTest(b: Bereich, seed: number): Task[] {
  const core = coreSkills(b);
  const out: Task[] = [];
  core.forEach((s, i) => out.push(makeTask(s.id, seed + i, 1)));
  core.forEach((s, i) => out.push(makeTask(s.id, seed + 50 + i, 2)));
  out.push(makeTask(core[(seed % core.length + core.length) % core.length].id, seed + 99, 3));
  out.push(makeTask(core[((seed + 2) % core.length + core.length) % core.length].id, seed + 98, 3));
  return out;
}

/** Gesamttest über alle fünf Größenbereiche. */
export function makeGesamttest(seed: number): Task[] {
  const bs: Bereich[] = ['laenge', 'masse', 'geld', 'flaeche', 'volumen'];
  const out: Task[] = [];
  bs.forEach((b, i) => {
    const core = coreSkills(b);
    out.push(makeTask(core[(seed + i) % core.length].id, seed + i, 1));
    out.push(makeTask(core[(seed + i + 2) % core.length].id, seed + 20 + i, 2));
    out.push(makeTask(core[(seed + i + 4) % core.length].id, seed + 40 + i, 3));
  });
  return out;
}

/** Punkte je Aufgabe: Grundlagen 1, Standard 2, Knobeln 3. */
export const points = (t: Task) => t.level;

/** Orientierungsnote (übliche Prozentstaffel, keine amtliche Bewertung). */
export function grade(pct: number): {note: string; text: string} {
  if (pct >= 87.5) return {note: '1', text: 'sehr gut'};
  if (pct >= 75) return {note: '2', text: 'gut'};
  if (pct >= 62.5) return {note: '3', text: 'befriedigend'};
  if (pct >= 50) return {note: '4', text: 'ausreichend'};
  if (pct >= 25) return {note: '5', text: 'mangelhaft'};
  return {note: '6', text: 'ungenügend'};
}

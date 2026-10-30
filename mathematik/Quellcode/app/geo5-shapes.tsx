'use client';
// Zeichnungen für die Module Winkel, Symmetrie & Vierecke sowie Körper & Netze.
import type {ShapeSpec} from '@/lib/curriculum';
import {decodeCells, polyNames, type PolyName} from '@/lib/geo5';

const BLUE = '#355fe4', FILL = '#dfe9ff', RED = '#c4314b', INK = '#24324d', GREEN = '#168575', ORANGE = '#c26a12';
const rad = (d: number) => d * Math.PI / 180;
/** Richtung in Grad (mathematisch, gegen den Uhrzeigersinn) in Bildschirmkoordinaten */
const dir = (x: number, y: number, deg: number, len: number): [number, number] => [x + len * Math.cos(rad(deg)), y - len * Math.sin(rad(deg))];
function arc(x: number, y: number, r: number, from: number, to: number) {
  const n = Math.max(6, Math.ceil(Math.abs(to - from) / 4)), pts: string[] = [];
  for (let i = 0; i <= n; i++) { const [px, py] = dir(x, y, from + (to - from) * i / n, r); pts.push(`${px.toFixed(1)} ${py.toFixed(1)}`); }
  return 'M ' + pts.join(' L ');
}
function sector(x: number, y: number, r: number, from: number, to: number) { return `M ${x} ${y} L ` + arc(x, y, r, from, to).slice(2) + ' Z'; }
const T = ({x, y, children, size = 17, color = INK, anchor = 'middle', weight = 600}: {x: number; y: number; children: React.ReactNode; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number}) =>
  <text x={x} y={y} style={{fontSize: size, fill: color}} textAnchor={anchor} dominantBaseline="middle" fontWeight={weight}>{children}</text>;

function AngleMark({x, y, from, to, label, ask = false, r = 36, lr}: {x: number; y: number; from: number; to: number; label: string; ask?: boolean; r?: number; lr?: number}) {
  const mid = (from + to) / 2, [lx, ly] = dir(x, y, mid, lr ?? r + 24);
  return <g><path d={sector(x, y, r, from, to)} fill={ask ? '#fde3c4' : '#d7e3ff'} stroke={ask ? ORANGE : BLUE} strokeWidth="2"/><T x={lx} y={ly} color={ask ? ORANGE : BLUE} size={16}>{label}</T></g>;
}

export function polyPoints(name: PolyName, cx = 210, cy = 160, R = 110): [number, number][] {
  const reg = (n: number, start: number) => Array.from({length: n}, (_, i) => dir(cx, cy, start + i * 360 / n, R));
  switch (name) {
    case 'Quadrat': return reg(4, 45);
    case 'Rechteck': return [[cx - 140, cy - 70], [cx + 140, cy - 70], [cx + 140, cy + 70], [cx - 140, cy + 70]];
    case 'Raute': return [[cx, cy - 115], [cx + 75, cy], [cx, cy + 115], [cx - 75, cy]];
    case 'Parallelogramm': return [[cx - 100, cy - 70], [cx + 150, cy - 70], [cx + 100, cy + 70], [cx - 150, cy + 70]];
    case 'Drachenviereck': return [[cx, cy - 120], [cx + 85, cy - 45], [cx, cy + 125], [cx - 85, cy - 45]];
    case 'Gleichschenkliges Trapez': return [[cx - 75, cy - 70], [cx + 75, cy - 70], [cx + 150, cy + 70], [cx - 150, cy + 70]];
    case 'Trapez': return [[cx - 110, cy - 70], [cx + 60, cy - 70], [cx + 150, cy + 70], [cx - 150, cy + 70]];
    case 'Gleichseitiges Dreieck': return reg(3, 90).map(([x, y]) => [x, y + 20]);
    case 'Gleichschenkliges Dreieck': return [[cx, cy - 120], [cx + 80, cy + 100], [cx - 80, cy + 100]];
    case 'Regelmäßiges Fünfeck': return reg(5, 90);
    case 'Regelmäßiges Sechseck': return reg(6, 0);
    case 'Regelmäßiges Achteck': return reg(8, 22.5);
    default: return [[cx - 130, cy - 60], [cx + 90, cy - 95], [cx + 140, cy + 80], [cx - 70, cy + 100]];
  }
}

/* Körper in Schrägbild-Darstellung: [x, y, z] mit z = Tiefe */
type Solid3 = {v: [number, number, number][]; e: [number, number][]; hidden: number[]};
const box = (a: number, b: number, c: number): Solid3 => ({v: [[0, 0, 0], [a, 0, 0], [a, b, 0], [0, b, 0], [0, 0, c], [a, 0, c], [a, b, c], [0, b, c]], e: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], hidden: [4]});
const solids3: Record<number, Solid3> = {
  0: box(1.5, 1.5, 1.5),
  1: box(2.4, 1.3, 1.4),
  2: {v: [[0, 0, 0], [2, 0, 0], [1, 1.5, 0], [0, 0, 1.8], [2, 0, 1.8], [1, 1.5, 1.8]], e: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3], [0, 3], [1, 4], [2, 5]], hidden: [3]},
  3: {v: [[0, 0, 0], [2, 0, 0], [2, 0, 2], [0, 0, 2], [1, 2, 1]], e: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4], [2, 4], [3, 4]], hidden: [3]},
  4: {v: [[0, 0, 0], [2.2, 0, 0], [0.9, 0, 1.9], [1, 1.9, 0.6]], e: [[0, 1], [1, 2], [2, 0], [0, 3], [1, 3], [2, 3]], hidden: [2]},
  5: (() => { const v: [number, number, number][] = []; for (const y of [0, 2]) for (let i = 0; i < 6; i++) v.push([1 + Math.cos(rad(i * 60)), y, 1.6 * (1 + Math.sin(rad(i * 60)))]); const e: [number, number][] = []; for (let i = 0; i < 6; i++) { e.push([i, (i + 1) % 6], [6 + i, 6 + (i + 1) % 6], [i, 6 + i]); } return {v, e, hidden: [1, 2]}; })(),
};
function SolidDrawing({i}: {i: number}) {
  if (i === 6) return <g><path d="M140 90v150c0 22 31 38 70 38s70-16 70-38V90" fill="#d8eff4" stroke="#397b89" strokeWidth="3"/><ellipse cx="210" cy="90" rx="70" ry="30" fill="#eefaff" stroke="#397b89" strokeWidth="3"/><path d="M140 240c0-22 31-38 70-38s70 16 70 38" fill="none" stroke="#397b89" strokeWidth="2" strokeDasharray="6 5"/></g>;
  if (i === 7) return <g><path d="M210 40 135 240c0 22 34 38 75 38s75-16 75-38Z" fill="#ffe6d4" stroke="#b66a38" strokeWidth="3"/><path d="M135 240c0-22 34-38 75-38s75 16 75 38" fill="none" stroke="#b66a38" strokeWidth="2" strokeDasharray="6 5"/></g>;
  if (i === 8) return <g><defs><radialGradient id="g5-sphere" cx=".35" cy=".35"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#8c78bd"/></radialGradient></defs><circle cx="210" cy="160" r="110" fill="url(#g5-sphere)" stroke="#685692" strokeWidth="3"/><path d="M100 160c25 30 195 30 220 0" fill="none" stroke="#685692" strokeWidth="2"/><path d="M100 160c25-30 195-30 220 0" fill="none" stroke="#685692" strokeWidth="2" strokeDasharray="6 5"/></g>;
  const s = solids3[i] ?? solids3[0];
  const P = s.v.map(([x, y, z]) => [x + 0.5 * z * Math.SQRT1_2, y + 0.5 * z * Math.SQRT1_2]);
  const xs = P.map(p => p[0]), ys = P.map(p => p[1]), w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys), sc = Math.min(300 / w, 230 / h);
  const X = (p: number[]) => 210 + (p[0] - (Math.min(...xs) + w / 2)) * sc, Y = (p: number[]) => 160 - (p[1] - (Math.min(...ys) + h / 2)) * sc;
  return <g>{s.e.map(([a, b], k) => { const hid = s.hidden.includes(a) || s.hidden.includes(b); return <line key={k} x1={X(P[a])} y1={Y(P[a])} x2={X(P[b])} y2={Y(P[b])} stroke={hid ? '#7d8aa5' : INK} strokeWidth={hid ? 2 : 3} strokeDasharray={hid ? '7 6' : undefined} strokeLinecap="round"/>; })}{P.map((p, k) => <circle key={k} cx={X(p)} cy={Y(p)} r="4.5" fill={s.hidden.includes(k) ? '#7d8aa5' : BLUE}/>)}</g>;
}

export function GeoShape({s}: {s: ShapeSpec}) {
  const label = ({
    'g-protractor': `Winkel am Geodreieck mit zwei Skalen`, 'g-angle': 'Winkel ohne Gradangabe zum Schätzen', 'g-cross': 'Zwei sich schneidende Geraden mit den Winkeln Alpha, Beta, Gamma und Delta',
    'g-parallel': 'Zwei parallele Geraden g und h, die von einer dritten Geraden geschnitten werden', 'g-triangle': 'Dreieck mit markierten Winkeln', 'g-quad': 'Viereck mit markierten Winkeln',
    'g-clock': 'Uhr mit Stunden- und Minutenzeiger', 'g-sectors': 'Kreis in gleich große Stücke geteilt', 'g-poly': 'Ebene Figur', 'g-letter': 'Großbuchstabe', 'g-mirror': 'Koordinatensystem mit Punkt P und Spiegelachse oder Spiegelzentrum',
    'g-half': 'Kästchengitter mit roter Spiegelachse und gefärbten Kästchen', 'g-house': 'Haus der Vierecke', 'g-solid': 'Körper im Schrägbild; verdeckte Kanten gestrichelt', 'g-net': 'Netz aus sechs Quadraten', 'g-building': 'Bauplan und Bild eines Würfelgebäudes',
  } as Record<string, string>)[s.kind] ?? 'Geometrische Figur';
  return <figure className="math-shape geo5-shape"><svg viewBox="0 0 420 320" role="img" aria-label={label}>{body(s)}</svg></figure>;
}

function body(s: ShapeSpec) {
  const b = s.b ?? 0, c = s.c ?? 0;
  if (s.kind === 'g-protractor') {
    const cx = 210, cy = 262, R = 180, left = b === 1, w = s.a, ray2 = left ? 180 - w : w;
    return <g>
      <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy} Z`} fill="#fbf8e9" stroke="#b3a568" strokeWidth="2"/>
      {Array.from({length: 37}, (_, i) => { const d = i * 5, long = d % 10 === 0, [x1, y1] = dir(cx, cy, d, R), [x2, y2] = dir(cx, cy, d, R - (long ? 16 : 9)); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6e6233" strokeWidth={long ? 1.6 : 1}/>; })}
      {Array.from({length: 19}, (_, i) => { const d = i * 10, [x, y] = dir(cx, cy, d, R - 30), [xi, yi] = dir(cx, cy, d, R - 54); return <g key={i}><T x={x} y={y} size={12} color="#3d3a20" weight={700}>{d}</T><T x={xi} y={yi} size={10} color="#8a6d1a" weight={500}>{180 - d}</T></g>; })}
      <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="#6e6233" strokeWidth="1"/>
      <path d={sector(cx, cy, 40, left ? ray2 : 0, left ? 180 : w)} fill="#d7e3ff" stroke={BLUE} strokeWidth="2"/>
      <line x1={cx} y1={cy} x2={left ? cx - R - 15 : cx + R + 15} y2={cy} stroke={BLUE} strokeWidth="4" strokeLinecap="round"/>
      <line x1={cx} y1={cy} x2={dir(cx, cy, ray2, R + 15)[0]} y2={dir(cx, cy, ray2, R + 15)[1]} stroke={BLUE} strokeWidth="4" strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r="5" fill={RED}/>
      <T x={cx} y={cy + 30} size={13} color="#4b5a77" weight={500}>{left ? 'Innere Skala: beginnt links bei 0°' : 'Äußere Skala: beginnt rechts bei 0°'}</T>
    </g>;
  }
  if (s.kind === 'g-angle') {
    const cx = s.a > 180 ? 210 : 150, cy = s.a > 180 ? 160 : 210, rot = s.a > 180 ? 0 : b, w = s.a;
    const [x1, y1] = dir(cx, cy, rot, 170), [x2, y2] = dir(cx, cy, rot + w, 170);
    return <g><path d={sector(cx, cy, 45, rot, rot + w)} fill="#d7e3ff" stroke={BLUE} strokeWidth="2"/><line x1={cx} y1={cy} x2={x1} y2={y1} stroke={INK} strokeWidth="4" strokeLinecap="round"/><line x1={cx} y1={cy} x2={x2} y2={y2} stroke={INK} strokeWidth="4" strokeLinecap="round"/><circle cx={cx} cy={cy} r="5" fill={RED}/></g>;
  }
  if (s.kind === 'g-cross') {
    const cx = 210, cy = 160, a = s.a, rot = b, names = ['α', 'β', 'γ', 'δ'];
    const st = [rot, rot + a, rot + 180, rot + 180 + a], en = [rot + a, rot + 180, rot + 180 + a, rot + 360];
    const l1a = dir(cx, cy, rot, 190), l1b = dir(cx, cy, rot + 180, 190), l2a = dir(cx, cy, rot + a, 190), l2b = dir(cx, cy, rot + a + 180, 190);
    return <g>{st.map((f, i) => (i === 0 || i === c) && <AngleMark key={i} x={cx} y={cy} from={f} to={en[i]} r={i === 0 ? 34 : 44} label={i === 0 ? `α = ${a}°` : `${names[i]} = ?`} ask={i === c}/>)}
      {st.map((f, i) => i !== 0 && i !== c && <g key={'n' + i}><path d={arc(cx, cy, 30, f, en[i])} fill="none" stroke="#8a97b2" strokeWidth="1.5"/><T x={dir(cx, cy, (f + en[i]) / 2, 50)[0]} y={dir(cx, cy, (f + en[i]) / 2, 50)[1]} size={15} color="#5d6b88">{names[i]}</T></g>)}
      <line x1={l1a[0]} y1={l1a[1]} x2={l1b[0]} y2={l1b[1]} stroke={INK} strokeWidth="3"/><line x1={l2a[0]} y1={l2a[1]} x2={l2b[0]} y2={l2b[1]} stroke={INK} strokeWidth="3"/><circle cx={cx} cy={cy} r="4" fill={INK}/></g>;
  }
  if (s.kind === 'g-parallel') {
    const a = s.a, y1 = 105, y2 = 225, off = 60 / Math.tan(rad(a)), x1 = 210 + off, x2 = 210 - off;
    const st = [0, a, 180, 180 + a], en = [a, 180, 180 + a, 360];
    const top = dir(x1, y1, a, 95), bot = dir(x2, y2, a + 180, 95), val = (p: number) => p % 2 === 0 ? a : 180 - a;
    return <g><line x1="20" y1={y1} x2="400" y2={y1} stroke={INK} strokeWidth="3"/><line x1="20" y1={y2} x2="400" y2={y2} stroke={INK} strokeWidth="3"/><T x={395} y={y1 - 16} anchor="end">g</T><T x={395} y={y2 - 16} anchor="end">h</T>
      <line x1={top[0]} y1={top[1]} x2={bot[0]} y2={bot[1]} stroke={INK} strokeWidth="3"/>
      <AngleMark x={x1} y={y1} from={st[b]} to={en[b]} r={30} label={`${val(b)}°`}/>
      <AngleMark x={x2} y={y2} from={st[c]} to={en[c]} r={30} label="?" ask/>
      <T x={30} y={y1 + (y2 - y1) / 2} anchor="start" size={13} color="#4b5a77" weight={500}>g ∥ h</T></g>;
  }
  if (s.kind === 'g-triangle') {
    const al = s.a, be = b, t = Math.sin(rad(be)) / Math.sin(rad(al + be));
    const pts = [[0, 0], [1, 0], [t * Math.cos(rad(al)), t * Math.sin(rad(al))]];
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys), sc = Math.min(330 / w, 210 / h);
    const P = pts.map(([x, y]) => [210 + (x - Math.min(...xs) - w / 2) * sc, 265 - y * sc]);
    const ang = (i: number) => { const [px, py] = P[i], A = P[(i + 1) % 3], B = P[(i + 2) % 3]; const d1 = Math.atan2(py - A[1], A[0] - px) * 180 / Math.PI, d2 = Math.atan2(py - B[1], B[0] - px) * 180 / Math.PI; let f = Math.min(d1, d2), e = Math.max(d1, d2); if (e - f > 180) { [f, e] = [e, f + 360]; } return [f, e]; };
    const labels = c === 1 ? ['α', 'β', 'γ'] : [`α = ${al}°`, `β = ${be}°`, 'γ = ?'];
    return <g><path d={`M ${P.map(p => p.join(' ')).join(' L ')} Z`} fill="#eef3ff" stroke={INK} strokeWidth="3"/>{P.map((p, i) => { const [f, e] = ang(i); return <AngleMark key={i} x={p[0]} y={p[1]} from={f} to={e} r={28} label={labels[i]} ask={c !== 1 && i === 2}/>; })}<T x={P[0][0] - 14} y={P[0][1] + 16}>A</T><T x={P[1][0] + 14} y={P[1][1] + 16}>B</T><T x={P[2][0]} y={P[2][1] - 18}>C</T></g>;
  }
  if (s.kind === 'g-quad') {
    const th = [s.a, b, c, s.d ?? 270], pts = th.map(t => [1.35 * Math.cos(rad(t)), Math.sin(rad(t))]);
    const P = pts.map(([x, y]) => [210 + x * 125, 160 - y * 125]), v = s.v ?? [];
    const names = ['α', 'β', 'γ', 'δ'];
    return <g><path d={`M ${P.map(p => p.join(' ')).join(' L ')} Z`} fill="#eef3ff" stroke={INK} strokeWidth="3"/>{P.map((p, i) => { const A = P[(i + 3) % 4], B = P[(i + 1) % 4]; let d1 = Math.atan2(p[1] - A[1], A[0] - p[0]) * 180 / Math.PI, d2 = Math.atan2(p[1] - B[1], B[0] - p[0]) * 180 / Math.PI; if (d2 < d1) [d1, d2] = [d2, d1]; if (d2 - d1 > 180) [d1, d2] = [d2, d1 + 360]; return <AngleMark key={i} x={p[0]} y={p[1]} from={d1} to={d2} r={26} lr={62} label={i < 3 ? `${names[i]} = ${v[i]}°` : 'δ = ?'} ask={i === 3}/>; })}</g>;
  }
  if (s.kind === 'g-clock') {
    const cx = 210, cy = 160, R = 130, h = s.a, m = b, hd = 90 - (30 * h + 0.5 * m), md = 90 - 6 * m;
    let f = Math.min(hd, md), e = Math.max(hd, md); if (e - f > 180) [f, e] = [e, f + 360];
    const [hx, hy] = dir(cx, cy, hd, 75), [mx, my] = dir(cx, cy, md, 112);
    return <g><circle cx={cx} cy={cy} r={R} fill="#fff" stroke={INK} strokeWidth="4"/><path d={sector(cx, cy, 50, f, e)} fill="#fde3c4" stroke={ORANGE} strokeWidth="1.5"/>{Array.from({length: 60}, (_, i) => { const [x1, y1] = dir(cx, cy, 90 - i * 6, R - 4), [x2, y2] = dir(cx, cy, 90 - i * 6, R - (i % 5 ? 10 : 18)); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={i % 5 ? 1 : 3}/>; })}{Array.from({length: 12}, (_, i) => { const [x, y] = dir(cx, cy, 90 - (i + 1) * 30, R - 36); return <T key={i} x={x} y={y} size={18}>{i + 1}</T>; })}<line x1={cx} y1={cy} x2={hx} y2={hy} stroke={INK} strokeWidth="8" strokeLinecap="round"/><line x1={cx} y1={cy} x2={mx} y2={my} stroke={BLUE} strokeWidth="5" strokeLinecap="round"/><circle cx={cx} cy={cy} r="7" fill={INK}/></g>;
  }
  if (s.kind === 'g-sectors') {
    const n = s.a, sel = b || 1, cx = 210, cy = 160, R = 130;
    return <g>{Array.from({length: n}, (_, i) => <path key={i} d={sector(cx, cy, R, 90 - (i + 1) * 360 / n, 90 - i * 360 / n)} fill={i < sel ? '#f2b8c6' : '#fff4e2'} stroke="#8a4b2a" strokeWidth="2.5"/>)}<circle cx={cx} cy={cy} r="5" fill={INK}/></g>;
  }
  if (s.kind === 'g-poly') {
    const name = polyNames[s.a] ?? 'Quadrat', P = polyPoints(name);
    const cx = P.reduce((t, p) => t + p[0], 0) / P.length, cy = P.reduce((t, p) => t + p[1], 0) / P.length;
    return <g><path d={`M ${P.map(p => p.join(' ')).join(' L ')} Z`} fill="#e5f5f0" stroke={GREEN} strokeWidth="4" strokeLinejoin="round"/>{b === 1 && <><circle cx={cx} cy={cy} r="6" fill={RED}/><T x={cx + 16} y={cy - 14} size={14} color={RED}>M</T></>}</g>;
  }
  if (s.kind === 'g-letter') return <g><rect x="110" y="20" width="200" height="280" rx="14" fill="#f6f8fc" stroke="#d4dceb"/><text x="210" y="170" textAnchor="middle" dominantBaseline="central" style={{fontSize: 230, fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700, fill: BLUE}}>{String.fromCharCode(s.a)}</text></g>;
  if (s.kind === 'g-mirror') {
    const u = 25, ox = 85, oy = 290, X = (x: number) => ox + x * u, Y = (y: number) => oy - y * u, x = s.a, y = b, type = c, d = s.d ?? 5, e = s.e ?? 5;
    return <g>{Array.from({length: 11}, (_, i) => <g key={i}><line x1={X(i)} y1={Y(0)} x2={X(i)} y2={Y(10)} stroke="#e1e7f2"/><line x1={X(0)} y1={Y(i)} x2={X(10)} y2={Y(i)} stroke="#e1e7f2"/><T x={X(i)} y={Y(0) + 14} size={11} weight={500} color="#5d6b88">{i}</T>{i > 0 && <T x={X(0) - 12} y={Y(i)} size={11} weight={500} color="#5d6b88">{i}</T>}</g>)}
      <line x1={X(0)} y1={Y(0)} x2={X(10.4)} y2={Y(0)} stroke={INK} strokeWidth="2"/><line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(10.4)} stroke={INK} strokeWidth="2"/><T x={X(10.6)} y={Y(0)} size={13}>x</T><T x={X(0)} y={Y(10.7)} size={13}>y</T>
      {type === 0 && <line x1={X(d)} y1={Y(-0.2)} x2={X(d)} y2={Y(10.2)} stroke={RED} strokeWidth="3" strokeDasharray="8 5"/>}
      {type === 1 && <line x1={X(-0.2)} y1={Y(d)} x2={X(10.2)} y2={Y(d)} stroke={RED} strokeWidth="3" strokeDasharray="8 5"/>}
      {type === 2 && <line x1={X(0)} y1={Y(0)} x2={X(10)} y2={Y(10)} stroke={RED} strokeWidth="3" strokeDasharray="8 5"/>}
      {type === 3 && <><circle cx={X(d)} cy={Y(e)} r="6" fill={RED}/><T x={X(d) + 14} y={Y(e) - 12} size={14} color={RED}>Z</T></>}
      <circle cx={X(x)} cy={Y(y)} r="6.5" fill={BLUE}/><T x={X(x) + 14} y={Y(y) - 12} size={14} color={BLUE}>P</T></g>;
  }
  if (s.kind === 'g-half') {
    const cols = s.a, rows = b, cell = Math.min(300 / (2 * cols), 260 / rows), ox = 210 - cols * cell, oy = 160 - rows * cell / 2, left = s.v ?? [], done = s.w ?? [];
    const filled = new Set([...left.map(v => `${Math.floor(v / 10)},${v % 10}`), ...done.map(v => `${Math.floor(v / 10)},${2 * cols - 1 - v % 10}`)]);
    return <g>{Array.from({length: rows}, (_, r) => Array.from({length: 2 * cols}, (_, cc) => <rect key={`${r}-${cc}`} x={ox + cc * cell} y={oy + r * cell} width={cell} height={cell} fill={filled.has(`${r},${cc}`) ? (cc < cols ? '#5d82ea' : '#9fb7f4') : '#fff'} stroke="#c3cee3"/>))}<line x1="210" y1={oy - 12} x2="210" y2={oy + rows * cell + 12} stroke={RED} strokeWidth="4"/></g>;
  }
  if (s.kind === 'g-house') {
    const nodes: [string, number, number][] = [['Viereck', 210, 26], ['Trapez', 120, 90], ['Drachenviereck', 310, 120], ['Parallelogramm', 120, 156], ['Gleichschenkliges Trapez', 0, 0], ['Rechteck', 80, 222], ['Raute', 250, 222], ['Quadrat', 165, 290]];
    const links: [number, number][] = [[0, 1], [0, 2], [1, 3], [3, 5], [3, 6], [2, 6], [5, 7], [6, 7]];
    const N = nodes.filter(n => n[1] > 0);
    const at = (i: number) => nodes[i];
    return <g>{links.map(([a, b2], i) => <line key={i} x1={at(a)[1]} y1={at(a)[2]} x2={at(b2)[1]} y2={at(b2)[2]} stroke="#8a97b2" strokeWidth="2"/>)}{N.map(([n, x, y]) => <g key={n}><rect x={x - 70} y={y - 16} width="140" height="32" rx="8" fill="#eef3ff" stroke={BLUE} strokeWidth="2"/><T x={x} y={y} size={14}>{n}</T></g>)}</g>;
  }
  if (s.kind === 'g-solid') return <SolidDrawing i={s.a}/>;
  if (s.kind === 'g-net') {
    const cells = decodeCells(s.v ?? []), w = s.w ?? [], maxR = Math.max(...cells.map(x => x[0])) + 1, maxC = Math.max(...cells.map(x => x[1])) + 1;
    const size = Math.min(70, 360 / maxC, 280 / maxR), ox = 210 - maxC * size / 2, oy = 160 - maxR * size / 2, letters = 'ABCDEF';
    return <g>{cells.map(([r, cc], i) => { const x = ox + cc * size, y = oy + r * size, mark = s.a === 1 && w[i] === 0, ask = s.a === 2 && w[i] === -1; return <g key={i}><rect x={x} y={y} width={size} height={size} fill={mark ? '#fde3c4' : ask ? '#fff4d8' : '#dfe9ff'} stroke={BLUE} strokeWidth="3"/>{s.a === 1 && <T x={x + size / 2} y={y + size / 2} size={size * 0.42} color={mark ? ORANGE : INK} weight={700}>{letters[i]}</T>}{s.a === 2 && w[i] !== 0 && <T x={x + size / 2} y={y + size / 2} size={size * 0.45} color={ask ? ORANGE : INK} weight={700}>{ask ? '?' : w[i]}</T>}</g>; })}</g>;
  }
  if (s.kind === 'g-building') {
    const rows = s.a, cols = b, h = s.v ?? [], cell = 34, px = 30, py = 160 - rows * cell / 2;
    const cubes: [number, number, number][] = [];
    for (let r = 0; r < rows; r++) for (let cc = 0; cc < cols; cc++) for (let z = 0; z < (h[r * cols + cc] ?? 0); z++) cubes.push([r, cc, z]);
    cubes.sort((A, B) => (A[0] + A[1]) - (B[0] + B[1]) || A[2] - B[2] || A[1] - B[1]);
    const sz = 28, ox = 300, oy = 200;
    const iso = (r: number, cc: number, z: number): [number, number] => [ox + (cc - r) * sz * 0.866, oy + (cc + r) * sz * 0.5 - z * sz];
    const cube = ([r, cc, z]: [number, number, number], i: number) => { const [x, y] = iso(r, cc, z); const t = `M ${x} ${y - sz} l ${sz * 0.866} ${sz * 0.5} l ${-sz * 0.866} ${sz * 0.5} l ${-sz * 0.866} ${-sz * 0.5} Z`; const l = `M ${x - sz * 0.866} ${y - sz * 0.5} l ${sz * 0.866} ${sz * 0.5} v ${sz} l ${-sz * 0.866} ${-sz * 0.5} Z`; const rr = `M ${x} ${y} l ${sz * 0.866} ${-sz * 0.5} v ${sz} l ${-sz * 0.866} ${sz * 0.5} Z`; return <g key={i}><path d={t} fill="#f4d67d" stroke="#554619" strokeWidth="1.5"/><path d={l} fill="#b7d7f1" stroke="#243b5a" strokeWidth="1.5"/><path d={rr} fill="#82afd8" stroke="#243b5a" strokeWidth="1.5"/></g>; };
    // Würfel um eine Zeile nach unten versetzen, damit die Spitze sichtbar bleibt
    return <g><T x={px + cols * cell / 2} y={py - 20} size={14}>Bauplan</T>{Array.from({length: rows}, (_, r) => Array.from({length: cols}, (_, cc) => <g key={`${r}-${cc}`}><rect x={px + cc * cell} y={py + r * cell} width={cell} height={cell} fill="#fff" stroke={BLUE} strokeWidth="2"/><T x={px + cc * cell + cell / 2} y={py + r * cell + cell / 2} size={17} weight={700}>{h[r * cols + cc]}</T></g>))}<T x={px + cols * cell / 2} y={py + rows * cell + 16} size={12} weight={500} color="#5d6b88">vorne</T><g transform="translate(0 30)">{cubes.map(cube)}</g></g>;
  }
  return null;
}

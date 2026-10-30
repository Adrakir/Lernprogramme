'use client';
// Größen-Werkstatt: Grafiken (SVG) und interaktive Modelle.
import {useMemo, useState} from 'react';
import {type Bereich, type Visual, stairs, unit, units, inUnit, size, toBase, fmtNum, coinLabel, euroItems, fewestCoins} from '@/lib/groessen-core';
import {content, type Interactive} from '@/lib/groessen-content';

const INK = '#1b2b4a';
const BLUE = '#355fe4';
const TEAL = '#15a29b';
const SOFT = '#eaf0ff';

// ---------------------------------------------------------------------
// Lineal
function Ruler({start, length, object, interactiveLabel}: {start: number; length: number; object: string; interactiveLabel?: string}) {
  const mm = 150, px = 4.4, x0 = 18, W = x0 * 2 + mm * px;
  const colors: Record<string, string> = {stift: '#e0a443', nagel: '#8a96ab', schluessel: '#c9a227', radiergummi: '#e07a8a'};
  const c = colors[object] ?? BLUE;
  const ox = x0 + start * px, ow = length * px;
  return (
    <svg viewBox={`0 0 ${W} 132`} className="gw-svg" role="img" aria-label={interactiveLabel ?? `Lineal von 0 bis 15 cm. Ein Gegenstand liegt am Lineal${start ? ', er beginnt nicht bei 0' : ''}.`}>
      {object === 'stift' && <g><rect x={ox} y={20} width={Math.max(ow - 26, 4)} height={26} fill={c} stroke={INK} strokeWidth={1.5} /><polygon points={`${ox + ow - 26},20 ${ox + ow},33 ${ox + ow - 26},46`} fill="#f3d9a8" stroke={INK} strokeWidth={1.5} /></g>}
      {object === 'nagel' && <g><rect x={ox} y={16} width={8} height={34} fill={c} stroke={INK} strokeWidth={1.5} /><polygon points={`${ox + 8},28 ${ox + ow - 12},28 ${ox + ow},33 ${ox + ow - 12},38 ${ox + 8},38`} fill={c} stroke={INK} strokeWidth={1.5} /></g>}
      {object === 'schluessel' && <g><circle cx={ox + 16} cy={33} r={16} fill={c} stroke={INK} strokeWidth={1.5} /><circle cx={ox + 16} cy={33} r={5} fill="#fff" stroke={INK} /><rect x={ox + 30} y={28} width={Math.max(ow - 30, 2)} height={10} fill={c} stroke={INK} strokeWidth={1.5} /><rect x={ox + ow - 18} y={38} width={6} height={8} fill={c} stroke={INK} /></g>}
      {object === 'radiergummi' && <g><rect x={ox} y={18} width={ow} height={30} rx={4} fill={c} stroke={INK} strokeWidth={1.5} /><rect x={ox} y={18} width={ow * 0.4} height={30} rx={4} fill="#5b7fe8" stroke={INK} strokeWidth={1.5} /></g>}
      {object === 'streifen' && <rect x={ox} y={22} width={ow} height={22} rx={3} fill={TEAL} stroke={INK} strokeWidth={1.5} />}
      <line x1={ox} x2={ox} y1={10} y2={60} stroke={INK} strokeDasharray="3 3" />
      <line x1={ox + ow} x2={ox + ow} y1={10} y2={60} stroke={INK} strokeDasharray="3 3" />
      <rect x={4} y={60} width={W - 8} height={64} rx={6} fill="#fdf7d8" stroke={INK} strokeWidth={1.5} />
      {Array.from({length: mm + 1}, (_, i) => {
        const x = x0 + i * px, big = i % 10 === 0, mid = i % 5 === 0;
        return <g key={i}><line x1={x} x2={x} y1={60} y2={60 + (big ? 24 : mid ? 16 : 10)} stroke={INK} strokeWidth={big ? 1.6 : 1} />{big && <text x={x} y={104} textAnchor="middle" fontSize={15} fill={INK}>{i / 10}</text>}</g>;
      })}
      <text x={W - 14} y={118} textAnchor="end" fontSize={12} fill={INK}>cm</text>
    </svg>
  );
}

// ---------------------------------------------------------------------
// Waage
function Balance({left, right, tilt = 0, onRightClick}: {left: {label: string; grams?: number}[]; right: number[]; tilt?: number; onRightClick?: (i: number) => void}) {
  const ang = Math.max(-12, Math.min(12, tilt));
  const rad = ang * Math.PI / 180, L = 150, cx = 220, cy = 70;
  // ang > 0: linke Seite schwerer, linke Schale tiefer
  const yl = cy + Math.sin(rad) * L, yr = cy - Math.sin(rad) * L;
  const weight = (g: number, x: number, y: number, k: number, click?: () => void) => {
    const w = 22 + Math.min(String(g).length, 4) * 7;
    const el = <g key={k} onClick={click} style={click ? {cursor: 'pointer'} : undefined}><rect x={x - w / 2} y={y - 26} width={w} height={26} rx={4} fill="#b9c3d6" stroke={INK} /><text x={x} y={y - 8} textAnchor="middle" fontSize={12} fill={INK} fontWeight={700}>{g >= 1000 ? `${fmtNum(g / 1000)} kg` : `${g} g`}</text></g>;
    return el;
  };
  const pan = (x: number, y: number) => <g><line x1={x} y1={y} x2={x - 50} y2={y + 60} stroke={INK} /><line x1={x} y1={y} x2={x + 50} y2={y + 60} stroke={INK} /><path d={`M${x - 62} ${y + 60} h124 a62 18 0 0 1 -124 0z`} fill={SOFT} stroke={INK} strokeWidth={1.5} /></g>;
  const row = (n: number) => Array.from({length: n}, (_, i) => (i - (n - 1) / 2) * 40);
  const rOff = row(right.length);
  const lOff = row(left.length);
  return (
    <svg viewBox="0 0 440 210" className="gw-svg" role="img" aria-label={`Balkenwaage. Links: ${left.map(l => l.label).join(', ')}. Rechts: ${right.map(g => g + ' g').join(', ') || 'nichts'}.${ang === 0 ? ' Die Waage ist im Gleichgewicht.' : ''}`}>
      <polygon points={`${cx - 40},200 ${cx + 40},200 ${cx + 8},${cy} ${cx - 8},${cy}`} fill="#d6dcea" stroke={INK} />
      <line x1={cx - L * Math.cos(rad)} y1={yl} x2={cx + L * Math.cos(rad)} y2={yr} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={6} fill={INK} />
      <polygon points={`${cx},${cy - 4} ${cx - 6},${cy - 22} ${cx + 6},${cy - 22}`} fill={ang === 0 ? TEAL : '#a32f40'} />
      {pan(cx - L * Math.cos(rad), yl)}{pan(cx + L * Math.cos(rad), yr)}
      {left.map((o, i) => o.grams ? weight(o.grams, cx - L * Math.cos(rad) + lOff[i], yl + 60, i) :
        <g key={i}><ellipse cx={cx - L * Math.cos(rad) + lOff[i]} cy={yl + 44} rx={22} ry={17} fill="#e0a443" stroke={INK} /><text x={cx - L * Math.cos(rad) + lOff[i]} y={yl + 30} textAnchor="middle" fontSize={11} fill={INK} fontWeight={700} dy={-12}>{o.label}</text></g>)}
      {right.map((g, i) => weight(g, cx + L * Math.cos(rad) + rOff[i] * (right.length > 3 ? 0.75 : 1), yl === yr ? yr + 60 : yr + 60, i, onRightClick ? () => onRightClick(i) : undefined))}
    </svg>
  );
}

// ---------------------------------------------------------------------
// Geld
export function Money({ct, small, onClick, label}: {ct: number; small?: boolean; onClick?: () => void; label?: string}) {
  const note = ct >= 500;
  const noteColors: Record<number, string> = {500: '#b8b8b8', 1000: '#e49a8c', 2000: '#8fb0e0', 5000: '#e8b36a', 10000: '#8ccf9a', 20000: '#e3d06e', 50000: '#c8a3d8'};
  const s = small ? 0.75 : 1;
  const content = note ? (
    <svg viewBox="0 0 96 52" width={96 * s} height={52 * s} aria-hidden="true"><rect x={1} y={1} width={94} height={50} rx={5} fill={noteColors[ct]} stroke={INK} /><rect x={8} y={8} width={30} height={36} rx={3} fill="#ffffff70" /><text x={64} y={33} textAnchor="middle" fontSize={17} fontWeight={800} fill={INK}>{ct / 100} €</text></svg>
  ) : (
    <svg viewBox="0 0 56 56" width={(ct >= 100 ? 56 : ct >= 10 ? 48 : 40) * s} height={(ct >= 100 ? 56 : ct >= 10 ? 48 : 40) * s} aria-hidden="true">
      <circle cx={28} cy={28} r={26} fill={ct >= 100 ? (ct === 200 ? '#c9b25a' : '#d7d9de') : ct >= 10 ? '#e2bf4c' : '#c47a45'} stroke={INK} />
      {ct >= 100 && <circle cx={28} cy={28} r={17} fill={ct === 200 ? '#d7d9de' : '#c9b25a'} stroke={INK} strokeWidth={0.6} />}
      <text x={28} y={33} textAnchor="middle" fontSize={ct >= 100 ? 15 : 14} fontWeight={800} fill={INK}>{ct >= 100 ? ct / 100 + ' €' : ct}</text>
      {ct < 100 && <text x={28} y={45} textAnchor="middle" fontSize={8} fill={INK}>CENT</text>}
    </svg>
  );
  if (onClick) return <button type="button" className="gw-money" onClick={onClick} aria-label={label ?? coinLabel(ct)}>{content}</button>;
  return <span className="gw-money" role="img" aria-label={coinLabel(ct)}>{content}</span>;
}

function Receipt({lines, paid}: {lines: [string, number][]; paid?: number}) {
  return (
    <div className="gw-receipt" role="group" aria-label="Kassenzettel">
      <strong>Kassenzettel</strong>
      {lines.map(([n, p], i) => <div key={i}><span>{n}</span><span>{inUnit(p, 'geld', 'eur')} €</span></div>)}
      <hr />
      {paid !== undefined ? <div><span>Gegeben</span><span>{inUnit(paid, 'geld', 'eur')} €</span></div> : <div><span>Summe</span><span>? €</span></div>}
    </div>
  );
}

// ---------------------------------------------------------------------
// Kästchengitter
function Grid({w, h, full, half = [], second = [], onToggle, cell = 34}: {w: number; h: number; full: [number, number][]; half?: [number, number, string][]; second?: [number, number][]; onToggle?: (x: number, y: number) => void; cell?: number}) {
  const set = new Set(full.map(([x, y]) => `${x},${y}`));
  const set2 = new Set(second.map(([x, y]) => `${x},${y}`));
  const tri = (x: number, y: number, c: string) => {
    const X = x * cell + 2, Y = y * cell + 2, s = cell;
    const p: Record<string, string> = {bl: `${X},${Y} ${X},${Y + s} ${X + s},${Y + s}`, br: `${X + s},${Y} ${X + s},${Y + s} ${X},${Y + s}`, tl: `${X},${Y} ${X + s},${Y} ${X},${Y + s}`, tr: `${X},${Y} ${X + s},${Y} ${X + s},${Y + s}`};
    return p[c];
  };
  return (
    <svg viewBox={`0 0 ${w * cell + 4} ${h * cell + 4}`} className="gw-svg gw-grid" role="img" aria-label={onToggle ? `Kästchengitter mit ${w} mal ${h} Kästchen. ${full.length} Kästchen sind gefärbt.` : `Figur auf Kästchenpapier aus ${full.length} ganzen${half.length ? ' und ' + half.length + ' halben' : ''} Kästchen.`}>
      {Array.from({length: w * h}, (_, i) => {
        const x = i % w, y = Math.floor(i / w), on = set.has(`${x},${y}`), on2 = set2.has(`${x},${y}`);
        return <rect key={i} x={x * cell + 2} y={y * cell + 2} width={cell} height={cell} fill={on ? '#9db4f5' : on2 ? '#9fdcd3' : '#fff'} stroke="#b6c2d9" strokeWidth={1}
          onClick={onToggle ? () => onToggle(x, y) : undefined} style={onToggle ? {cursor: 'pointer'} : undefined} />;
      })}
      {half.map(([x, y, c], i) => <polygon key={i} points={tri(x, y, c)} fill="#9db4f5" stroke={BLUE} strokeWidth={1} />)}
      {full.map(([x, y], i) => <rect key={'o' + i} x={x * cell + 2} y={y * cell + 2} width={cell} height={cell} fill="none" stroke={BLUE} strokeWidth={1.4} pointerEvents="none" />)}
    </svg>
  );
}

// ---------------------------------------------------------------------
// Rechteck, L-Form, Rahmen
function Rect({a, b, ratio, label}: {a: string; b: string; ratio: number; label?: string}) {
  const W = 260, H = Math.max(40, Math.min(200, W * ratio));
  return (
    <svg viewBox={`0 0 ${W + 90} ${H + 60}`} className="gw-svg gw-narrow" role="img" aria-label={`Rechteck mit den Seiten ${a} und ${b}.`}>
      <rect x={30} y={14} width={W} height={H} fill={SOFT} stroke={BLUE} strokeWidth={2.5} />
      {label && <text x={30 + W / 2} y={14 + H / 2 + 6} textAnchor="middle" fontSize={17} fontWeight={700} fill={INK}>{label}</text>}
      <text x={30 + W / 2} y={H + 44} textAnchor="middle" fontSize={16} fill={INK}>{a}</text>
      <text x={W + 40} y={14 + H / 2 + 6} fontSize={16} fill={INK}>{b}</text>
    </svg>
  );
}

function LShape({W, H, cutW, cutH, u}: {W: number; H: number; cutW: number; cutH: number; u: string}) {
  const k = 250 / Math.max(W, H * 1.3), w = W * k, h = H * k, cw = cutW * k, ch = cutH * k, x = 40, y = 20;
  return (
    <svg viewBox={`0 0 ${w + 110} ${h + 64}`} className="gw-svg gw-narrow" role="img" aria-label={`L-förmige Figur: Rechteck ${W} ${u} mal ${H} ${u}, oben rechts fehlt eine Ecke von ${cutW} ${u} mal ${cutH} ${u}.`}>
      <rect x={x + w - cw} y={y} width={cw} height={ch} fill="none" stroke="#8a96ab" strokeDasharray="5 4" />
      <path d={`M${x} ${y} h${w - cw} v${ch} h${cw} v${h - ch} h${-w} z`} fill={SOFT} stroke={BLUE} strokeWidth={2.5} />
      <text x={x + w / 2} y={y + h + 24} textAnchor="middle" fontSize={15} fill={INK}>{W} {u}</text>
      <text x={x - 8} y={y + h / 2} textAnchor="end" fontSize={15} fill={INK}>{H} {u}</text>
      <text x={x + w - cw / 2} y={y - 5} textAnchor="middle" fontSize={13} fill="#526079">{cutW} {u}</text>
      <text x={x + w + 6} y={y + ch / 2 + 5} fontSize={13} fill="#526079">{cutH} {u}</text>
    </svg>
  );
}

function Frame({W, H, w, h, u}: {W: number; H: number; w: number; h: number; u: string}) {
  const k = 240 / Math.max(W, H), X = W * k, Y = H * k, ix = (W - w) / 2 * k, iy = (H - h) / 2 * k;
  return (
    <svg viewBox={`0 0 ${X + 110} ${Y + 60}`} className="gw-svg gw-narrow" role="img" aria-label={`Bilderrahmen: außen ${W} ${u} mal ${H} ${u}, innen ${w} ${u} mal ${h} ${u}.`}>
      <rect x={40} y={14} width={X} height={Y} fill="#e0a443" stroke={INK} strokeWidth={2} />
      <rect x={40 + ix} y={14 + iy} width={w * k} height={h * k} fill="#fff" stroke={INK} strokeWidth={1.5} />
      <text x={40 + X / 2} y={14 + Y / 2 + 5} textAnchor="middle" fontSize={13} fill={INK}>Bild {w} · {h}</text>
      <text x={40 + X / 2} y={Y + 40} textAnchor="middle" fontSize={15} fill={INK}>{W} {u}</text>
      <text x={X + 48} y={14 + Y / 2 + 5} fontSize={15} fill={INK}>{H} {u}</text>
    </svg>
  );
}

// ---------------------------------------------------------------------
// Würfelquader (schräge Ansicht)
function Cuboid({a, b, c, missing = 0}: {a: number; b: number; c: number; missing?: number}) {
  const s = Math.min(40, 220 / (a + b * 0.5 + 0.5), 200 / (c + b * 0.5 + 0.5)), dx = s * 0.5, dy = s * 0.5;
  const W = a * s + b * dx + 20, H = c * s + b * dy + 20;
  const cubes: {x: number; y: number; z: number}[] = [];
  for (let y = b - 1; y >= 0; y--) for (let z = 0; z < c; z++) for (let x = 0; x < a; x++) {
    if (missing && z === c - 1 && y === 0 && x >= a - missing) continue;
    cubes.push({x, y, z});
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="gw-svg gw-narrow" role="img" aria-label={`Quader aus Würfeln: ${a} lang, ${b} tief, ${c} hoch${missing ? `. In der vorderen Reihe der obersten Schicht fehlen Würfel` : ''}.`}>
      {cubes.map(({x, y, z}, i) => {
        const X = 10 + x * s + y * dx, Y = H - 10 - z * s - y * dy - s;
        return <g key={i} stroke={INK} strokeWidth={1} strokeLinejoin="round">
          <polygon points={`${X},${Y} ${X + dx},${Y - dy} ${X + s + dx},${Y - dy} ${X + s},${Y}`} fill="#c9d6fb" />
          <polygon points={`${X + s},${Y} ${X + s + dx},${Y - dy} ${X + s + dx},${Y + s - dy} ${X + s},${Y + s}`} fill="#7f9bec" />
          <rect x={X} y={Y} width={s} height={s} fill="#a8bdf7" />
        </g>;
      })}
    </svg>
  );
}

function Box({a, b, c}: {a: string; b: string; c: string}) {
  return (
    <svg viewBox="0 0 330 210" className="gw-svg gw-narrow" role="img" aria-label={`Quader mit Länge ${a}, Breite ${b} und Höhe ${c}.`}>
      <polygon points="40,70 100,30 290,30 230,70" fill="#c9d6fb" stroke={INK} strokeWidth={1.5} />
      <polygon points="230,70 290,30 290,140 230,180" fill="#7f9bec" stroke={INK} strokeWidth={1.5} />
      <rect x={40} y={70} width={190} height={110} fill="#a8bdf7" stroke={INK} strokeWidth={1.5} />
      <text x={135} y={200} textAnchor="middle" fontSize={15} fill={INK}>{a}</text>
      <text x={268} y={168} fontSize={15} fill={INK}>{b}</text>
      <text x={32} y={130} textAnchor="end" fontSize={15} fill={INK}>{c}</text>
    </svg>
  );
}

// ---------------------------------------------------------------------
// Messbecher
function Jug({ml, max, step}: {ml: number; max: number; step: number}) {
  const top = 20, bottom = 220, h = bottom - top, lvl = bottom - ml / max * h;
  const marks = Array.from({length: Math.round(max / step) + 1}, (_, i) => i * step);
  return (
    <svg viewBox="0 0 260 240" className="gw-svg gw-jug" role="img" aria-label={`Messbecher bis ${max} ml mit Strichen alle ${step} ml. Der Wasserstand ist bei ${ml} ml.`}>
      <rect x={70} y={lvl} width={120} height={bottom - lvl} fill="#9fd3ee" />
      <path d={`M70 ${top - 10} V${bottom} H190 V${top - 10}`} fill="none" stroke={INK} strokeWidth={3} />
      <path d={`M190 60 q40 10 30 70 q-6 30 -30 40`} fill="none" stroke={INK} strokeWidth={3} />
      {marks.map(m => { const y = bottom - m / max * h, big = m % (step * 2) === 0 || marks.length <= 6; return <g key={m}><line x1={70} x2={70 + (big ? 26 : 16)} y1={y} y2={y} stroke={INK} strokeWidth={1.5} />{big && m > 0 && <text x={62} y={y + 5} textAnchor="end" fontSize={13} fill={INK}>{m}</text>}</g>; })}
      <text x={62} y={bottom + 16} textAnchor="end" fontSize={12} fill={INK}>ml</text>
    </svg>
  );
}

// ---------------------------------------------------------------------
// Einheitentreppe
function Stairs({bereich, from, to, onPick}: {bereich: Bereich; from?: string; to?: string; onPick?: (id: string) => void}) {
  const st = stairs[bereich];
  const n = st.length, sw = Math.min(86, 520 / n), sh = 34, W = n * sw + 20, H = n * sh + 70;
  const factorTo = (i: number) => unit(bereich, st[i]).factor / unit(bereich, st[i + 1]).factor;
  const label = (id: string) => bereich === 'volumen' && id === 'dm3' ? 'dm³ = l' : bereich === 'volumen' && id === 'cm3' ? 'cm³ = ml' : unit(bereich, id).label;
  const fi = from ? st.indexOf(from) : -1, ti = to ? st.indexOf(to) : -1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="gw-svg gw-stairs" role="img" aria-label={`Einheitentreppe: ${st.map(id => unit(bereich, id).label).join(', ')}. Nach unten mal, nach oben geteilt durch.`}>
      {st.map((id, i) => {
        const x = 10 + i * sw, y = 20 + i * sh, active = i === fi || i === ti;
        return <g key={id} onClick={onPick ? () => onPick(id) : undefined} style={onPick ? {cursor: 'pointer'} : undefined}>
          <rect x={x} y={y} width={sw - 4} height={H - y - 40} fill={i === fi ? BLUE : i === ti ? TEAL : SOFT} stroke={active ? INK : '#b6c2d9'} strokeWidth={active ? 2 : 1} rx={4} />
          <text x={x + (sw - 4) / 2} y={y + 22} textAnchor="middle" fontSize={label(id).length > 4 ? 12 : 16} fontWeight={800} fill={i === fi || i === ti ? '#fff' : INK}>{label(id)}</text>
          {i < n - 1 && <text x={x + sw + (sw - 4) / 2} y={y + sh - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill="#344560">· {fmtNum(factorTo(i))}</text>}
        </g>;
      })}
      <text x={10} y={H - 14} fontSize={12} fill={INK}>nach unten (kleinere Einheit): mal</text>
      <text x={W - 10} y={14} textAnchor="end" fontSize={12} fill={INK}>nach oben (größere Einheit): geteilt durch</text>
    </svg>
  );
}

// ---------------------------------------------------------------------
// Karte mit Maßstab
function MapVis({cm, scale}: {cm: number; scale: number}) {
  const px = Math.min(36, 300 / cm), L = cm * px;
  return (
    <svg viewBox={`0 0 ${L + 120} 150`} className="gw-svg gw-narrow" role="img" aria-label={`Karte im Maßstab 1 zu ${fmtNum(scale)}. Zwei Orte sind auf der Karte ${cm} cm voneinander entfernt.`}>
      <rect x={4} y={4} width={L + 112} height={142} rx={8} fill="#eef7e8" stroke="#8fb58a" />
      <path d={`M20 120 C ${L / 3} 60, ${L / 2} 140, ${L + 100} 50`} stroke="#9fd3ee" strokeWidth={8} fill="none" />
      <circle cx={60} cy={70} r={7} fill="#a32f40" stroke={INK} /><circle cx={60 + L} cy={70} r={7} fill="#a32f40" stroke={INK} />
      <text x={60} y={56} textAnchor="middle" fontSize={13} fill={INK} fontWeight={700}>A</text><text x={60 + L} y={56} textAnchor="middle" fontSize={13} fill={INK} fontWeight={700}>B</text>
      <line x1={60} x2={60 + L} y1={84} y2={84} stroke={INK} strokeWidth={1.5} markerEnd="url(#gwArr)" markerStart="url(#gwArr)" />
      <text x={60 + L / 2} y={102} textAnchor="middle" fontSize={14} fill={INK}>{cm} cm auf der Karte</text>
      <text x={16} y={136} fontSize={13} fill={INK} fontWeight={700}>Maßstab 1 : {fmtNum(scale)}</text>
      <defs><marker id="gwArr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill={INK} /></marker></defs>
    </svg>
  );
}

// ---------------------------------------------------------------------
export function TaskVisual({v}: {v?: Visual}) {
  if (!v) return null;
  let el: React.ReactNode = null;
  switch (v.type) {
    case 'ruler': el = <Ruler start={v.start} length={v.length} object={v.object} />; break;
    case 'balance': el = <Balance left={v.left} right={v.right} />; break;
    case 'coins': el = <div className="gw-coins" role="group" aria-label={`Geld: ${v.items.map(coinLabel).join(', ')}`}>{v.items.map((c, i) => <Money key={i} ct={c} />)}</div>; break;
    case 'receipt': el = <Receipt lines={v.lines} paid={v.paid} />; break;
    case 'grid': el = <Grid w={v.w} h={v.h} full={v.full} half={v.half} second={v.second} />; break;
    case 'rect': el = <Rect a={v.a} b={v.b} ratio={v.ratio} label={v.label} />; break;
    case 'lshape': el = <LShape {...v.dims} u={v.unit} />; break;
    case 'frame': el = <Frame W={v.W} H={v.H} w={v.w} h={v.h} u={v.unit} />; break;
    case 'cuboid': el = <Cuboid a={v.a} b={v.b} c={v.c} missing={v.missing} />; break;
    case 'box': el = <Box a={v.a} b={v.b} c={v.c} />; break;
    case 'jug': el = <Jug ml={v.ml} max={v.max} step={v.step} />; break;
    case 'stairs': el = <Stairs bereich={v.bereich} from={v.from} to={v.to} />; break;
    case 'map': el = <MapVis cm={v.cm} scale={v.scale} />; break;
  }
  return <figure className={`gw-figure gw-fig-${v.type}`}>{el}</figure>;
}

// =====================================================================
// Interaktive Modelle
export function WalletPicker({value, onChange, max = 50000, idPrefix}: {value: number[]; onChange: (v: number[]) => void; max?: number; idPrefix?: string}) {
  const sum = value.reduce((s, c) => s + c, 0);
  return (
    <div className="gw-wallet">
      <p className="gw-small" id={idPrefix ? idPrefix + '-wl' : undefined}>Tippe Münzen und Scheine an, um sie in die Ablage zu legen. Tippe in der Ablage auf ein Stück, um es zurückzulegen.</p>
      <div className="gw-coins gw-coins-pick" role="group" aria-label="Münzen und Scheine zum Auswählen">
        {euroItems.filter(c => c <= max).map(c => <Money key={c} ct={c} small onClick={() => onChange([...value, c].sort((x, y) => y - x))} label={`${coinLabel(c)} hinzufügen`} />)}
      </div>
      <div className="gw-tray" aria-live="polite">
        <span className="gw-tray-label">Ablage: <b>{inUnit(sum, 'geld', 'eur')} €</b> ({value.length} {value.length === 1 ? 'Stück' : 'Stücke'})</span>
        <div className="gw-coins">{value.map((c, i) => <Money key={i} ct={c} small onClick={() => onChange(value.filter((_, j) => j !== i))} label={`${coinLabel(c)} zurücklegen`} />)}</div>
        {value.length > 0 && <button type="button" className="btn ghost small" onClick={() => onChange([])}>Ablage leeren</button>}
      </div>
    </div>
  );
}

function StairsExplorer({bereich}: {bereich: Bereich}) {
  const st = stairs[bereich];
  const [from, setFrom] = useState(st[Math.min(1, st.length - 1)]);
  const [to, setTo] = useState(st[st.length - 1]);
  const [raw, setRaw] = useState('3');
  const [pickTo, setPickTo] = useState(false);
  const base = toBase(raw, bereich, from);
  const fi = st.indexOf(from), ti = st.indexOf(to);
  const ratio = fi === ti ? 1 : fi < ti ? unit(bereich, from).factor / unit(bereich, to).factor : unit(bereich, to).factor / unit(bereich, from).factor;
  const anchors = content[bereich].merkwissen.stuetzpunkte;
  const anchorFor = (id: string) => anchors.find(([k]) => k === '1 ' + unit(bereich, id).label)?.[1];
  const opts = units[bereich].filter(u => st.includes(u.id));
  return (
    <div className="gw-lab">
      <Stairs bereich={bereich} from={from} to={to} onPick={id => { if (pickTo) setTo(id); else setFrom(id); setPickTo(!pickTo); }} />
      <div className="gw-lab-controls">
        <label>Zahl <input inputMode="decimal" value={raw} onChange={e => setRaw(e.target.value)} /></label>
        <label>von <select value={from} onChange={e => setFrom(e.target.value)}>{opts.map(u => <option key={u.id} value={u.id}>{u.label} ({u.name})</option>)}</select></label>
        <label>nach <select value={to} onChange={e => setTo(e.target.value)}>{opts.map(u => <option key={u.id} value={u.id}>{u.label} ({u.name})</option>)}</select></label>
      </div>
      <p className="gw-lab-result" aria-live="polite">
        {base === null || Number.isNaN(base) ? 'Gib eine Zahl ein, zum Beispiel 3 oder 2,5.' : fi === ti ? `Gleiche Stufe: ${size(base, bereich, from)} = ${size(base, bereich, to)}` :
          <>{fi < ti ? `${Math.abs(ti - fi)} Stufe${Math.abs(ti - fi) > 1 ? 'n' : ''} nach unten: mal ${fmtNum(ratio)}` : `${Math.abs(ti - fi)} Stufe${Math.abs(ti - fi) > 1 ? 'n' : ''} nach oben: geteilt durch ${fmtNum(ratio)}`}<br /><b>{size(base, bereich, from)} = {size(base, bereich, to)}</b></>}
      </p>
      {anchorFor(from) && <p className="gw-small">Stützpunkt für 1 {unit(bereich, from).label}: {anchorFor(from)}.</p>}
    </div>
  );
}

function RulerExplorer() {
  const [len, setLen] = useState(64);
  return (
    <div className="gw-lab">
      <Ruler start={0} length={len} object="streifen" interactiveLabel={`Lineal mit einem Streifen von ${len} mm Länge.`} />
      <label className="gw-slider">Länge des Streifens <input type="range" min={5} max={150} value={len} onChange={e => setLen(Number(e.target.value))} /></label>
      <p className="gw-lab-result" aria-live="polite"><b>{Math.floor(len / 10)} cm {len % 10} mm</b> = {len} mm = {size(len, 'laenge', 'cm')}</p>
    </div>
  );
}

const objects = [{label: 'Apfel', g: 150}, {label: 'Buch', g: 750}, {label: 'Dose', g: 420}, {label: 'Ball', g: 280}, {label: 'Brot', g: 1000}, {label: 'Saft', g: 1250}];
function BalanceExplorer() {
  const [k, setK] = useState(0);
  const [right, setRight] = useState<number[]>([]);
  const o = objects[k % objects.length];
  const sum = right.reduce((s, g) => s + g, 0);
  const diff = o.g - sum;
  return (
    <div className="gw-lab">
      <Balance left={[{label: o.label}]} right={right} tilt={diff === 0 ? 0 : Math.sign(diff) * Math.min(12, 3 + Math.abs(diff) / 60)} onRightClick={i => setRight(right.filter((_, j) => j !== i))} />
      <div className="gw-chips" role="group" aria-label="Gewichtsstücke">
        {[1000, 500, 200, 100, 50, 20, 10].map(g => <button key={g} type="button" className="btn ghost small" onClick={() => right.length < 7 && setRight([...right, g].sort((a, b) => b - a))}>+ {g >= 1000 ? '1 kg' : g + ' g'}</button>)}
      </div>
      <p className="gw-lab-result" aria-live="polite">Rechts: {right.length ? right.map(g => (g >= 1000 ? '1 kg' : g + ' g')).join(' + ') + ' = ' + fmtNum(sum) + ' g' : 'noch nichts'}. {diff === 0 ? <b>Gleichgewicht. {o.label === 'Saft' || o.label === 'Brot' ? 'Das' : 'Der Gegenstand'} wiegt {fmtNum(o.g)} g = {size(o.g * 1000, 'masse', 'kg')}.</b> : diff > 0 ? 'Die linke Seite ist schwerer. Lege mehr auf.' : 'Die rechte Seite ist schwerer. Tippe ein Gewichtsstück an, um es wegzunehmen.'}</p>
      <div className="gw-row"><button type="button" className="btn ghost small" onClick={() => setRight([])}>Waage leeren</button><button type="button" className="btn ghost small" onClick={() => { setK(k + 1); setRight([]); }}>Anderer Gegenstand</button></div>
    </div>
  );
}

const walletGoals = [385, 1240, 2075, 999, 4560];
function WalletExplorer() {
  const [v, setV] = useState<number[]>([]);
  const [g, setG] = useState(0);
  const goal = walletGoals[g % walletGoals.length];
  const sum = v.reduce((s, c) => s + c, 0);
  const best = fewestCoins(goal).length;
  return (
    <div className="gw-lab">
      <p><b>Auftrag:</b> Lege {inUnit(goal, 'geld', 'eur')} € mit möglichst wenigen Münzen und Scheinen.</p>
      <WalletPicker value={v} onChange={setV} max={5000} />
      <p className="gw-lab-result" aria-live="polite">{sum === goal ? (v.length === best ? <b>Genau richtig, und mit der kleinsten möglichen Anzahl ({best} Stücke).</b> : <>Der Betrag stimmt. Es geht aber mit {best} Stücken. Nimm größere Münzen.</>) : sum > goal ? 'Das ist zu viel. Nimm etwas zurück.' : `Es fehlen noch ${inUnit(goal - sum, 'geld', 'eur')} €.`}</p>
      <button type="button" className="btn ghost small" onClick={() => { setG(g + 1); setV([]); }}>Neuer Auftrag</button>
    </div>
  );
}

function RectExplorer() {
  const [a, setA] = useState(6), [b, setB] = useState(3);
  const full = useMemo(() => { const c: [number, number][] = []; for (let y = 0; y < b; y++) for (let x = 0; x < a; x++) c.push([x, y]); return c; }, [a, b]);
  return (
    <div className="gw-lab">
      <Grid w={10} h={6} full={full} cell={28} />
      <div className="gw-lab-controls">
        <label className="gw-slider">Länge a: {a} cm <input type="range" min={1} max={10} value={a} onChange={e => setA(Number(e.target.value))} /></label>
        <label className="gw-slider">Breite b: {b} cm <input type="range" min={1} max={6} value={b} onChange={e => setB(Number(e.target.value))} /></label>
      </div>
      <p className="gw-lab-result" aria-live="polite">Flächeninhalt: A = {a} cm · {b} cm = <b>{a * b} cm²</b><br />Umfang: U = 2 · ({a} cm + {b} cm) = <b>{2 * (a + b)} cm</b></p>
    </div>
  );
}

function GridExplorer() {
  const [cells, setCells] = useState<[number, number][]>([[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [3, 2], [1, 3]]);
  const key = (x: number, y: number) => `${x},${y}`;
  const set = new Set(cells.map(([x, y]) => key(x, y)));
  let edges = 0;
  for (const [x, y] of cells) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!set.has(key(x + dx, y + dy))) edges++;
  return (
    <div className="gw-lab">
      <Grid w={9} h={6} full={cells} cell={32} onToggle={(x, y) => setCells(set.has(key(x, y)) ? cells.filter(([a, b]) => !(a === x && b === y)) : [...cells, [x, y]])} />
      <p className="gw-lab-result" aria-live="polite">Fläche: <b>{cells.length} cm²</b> ({cells.length} Kästchen). Umfang: <b>{edges} cm</b> (Kästchenkanten am Rand).</p>
      <div className="gw-row"><button type="button" className="btn ghost small" onClick={() => setCells([])}>Alles löschen</button></div>
      <p className="gw-small">Tippe auf ein Kästchen, um es zu färben oder wieder zu löschen. Jedes Kästchen hat 1 cm Seitenlänge.</p>
    </div>
  );
}

function CuboidExplorer() {
  const [a, setA] = useState(4), [b, setB] = useState(3), [c, setC] = useState(2);
  const [u, setU] = useState<'cm' | 'dm'>('cm');
  const V = a * b * c;
  return (
    <div className="gw-lab">
      <Cuboid a={a} b={b} c={c} />
      <div className="gw-lab-controls">
        <label className="gw-slider">Länge: {a} {u} <input type="range" min={1} max={6} value={a} onChange={e => setA(Number(e.target.value))} /></label>
        <label className="gw-slider">Breite: {b} {u} <input type="range" min={1} max={5} value={b} onChange={e => setB(Number(e.target.value))} /></label>
        <label className="gw-slider">Höhe: {c} {u} <input type="range" min={1} max={5} value={c} onChange={e => setC(Number(e.target.value))} /></label>
        <label>Einheit <select value={u} onChange={e => setU(e.target.value as 'cm' | 'dm')}><option value="cm">Würfel mit 1 cm Kante</option><option value="dm">Würfel mit 1 dm Kante</option></select></label>
      </div>
      <p className="gw-lab-result" aria-live="polite">Eine Schicht: {a} · {b} = {a * b} Würfel. {c} Schicht{c > 1 ? 'en' : ''}: <b>V = {a} · {b} · {c} = {V} {u}³</b>{u === 'dm' ? ` = ${V} l` : ` = ${V} ml`}</p>
    </div>
  );
}

function JugExplorer() {
  const [ml, setMl] = useState(250);
  return (
    <div className="gw-lab">
      <Jug ml={ml} max={1000} step={100} />
      <label className="gw-slider">Wasser einfüllen <input type="range" min={0} max={1000} step={50} value={ml} onChange={e => setMl(Number(e.target.value))} /></label>
      <p className="gw-lab-result" aria-live="polite"><b>{fmtNum(ml)} ml</b> = {size(ml * 1000, 'volumen', 'l')} = {fmtNum(ml)} cm³{ml === 1000 ? ' = 1 dm³' : ''}</p>
    </div>
  );
}

export function InteractiveModel({kind, bereich}: {kind: Interactive; bereich: Bereich}) {
  switch (kind) {
    case 'stairs': return <StairsExplorer bereich={bereich} />;
    case 'ruler': return <RulerExplorer />;
    case 'balance': return <BalanceExplorer />;
    case 'wallet': return <WalletExplorer />;
    case 'rect': return <RectExplorer />;
    case 'grid': return <GridExplorer />;
    case 'cuboid': return <CuboidExplorer />;
    case 'jug': return <JugExplorer />;
  }
}

export {Stairs};

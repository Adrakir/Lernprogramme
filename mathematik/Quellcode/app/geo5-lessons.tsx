'use client';
// Lernwege und Labore für Winkel, Symmetrie & Vierecke sowie Körper & Netze (Klasse 5/6, KC Niedersachsen).
import {useMemo, useState} from 'react';
import type {Lesson} from './extra-lessons';
import {GeoShape, polyPoints} from './geo5-shapes';
import {SolidGallery} from './curriculum-visuals';
import './geo5.css';
import {encodeCells, foldNet, polyFacts, polyNames, solidFacts, type PolyName, type SolidName} from '@/lib/geo5';

const angleKind = (w: number) => w === 0 ? 'Nullwinkel' : w < 90 ? 'spitzer Winkel' : w === 90 ? 'rechter Winkel' : w < 180 ? 'stumpfer Winkel' : w === 180 ? 'gestreckter Winkel' : w < 360 ? 'überstumpfer Winkel' : 'Vollwinkel';

/* ---------- Winkel ---------- */
function MeasureLab() {
  const [w, setW] = useState(65), [left, setLeft] = useState(false), [guess, setGuess] = useState<string | null>(null);
  const kinds = ['spitzer Winkel', 'rechter Winkel', 'stumpfer Winkel', 'gestreckter Winkel'];
  return <div className="topic-lab"><h3>Winkel messen und benennen</h3>
    <p>Lege die Mitte des Geodreiecks auf den Scheitel. Die Nullkante liegt auf einem Schenkel. Lies die Skala ab, die an diesem Schenkel mit 0° beginnt.</p>
    <label>Winkel öffnen: {w}°<input type="range" min="5" max="180" step="5" value={w} onChange={e => { setW(+e.target.value); setGuess(null); }}/></label>
    <div className="guided-actions"><button className={'btn small ' + (left ? 'ghost' : '')} onClick={() => setLeft(false)} aria-pressed={!left}>Schenkel rechts</button><button className={'btn small ' + (left ? '' : 'ghost')} onClick={() => setLeft(true)} aria-pressed={left}>Schenkel links</button></div>
    <GeoShape s={{kind: 'g-protractor', a: w, b: left ? 1 : 0}}/>
    <p>Welche Winkelart siehst du?</p>
    <div className="mode-pills">{kinds.map(k => <button key={k} className={guess === k ? 'selected' : ''} onClick={() => setGuess(k)}>{k[0].toUpperCase() + k.slice(1)}</button>)}</div>
    {guess && <p className={guess === angleKind(w) ? 'success' : 'hint'} role="status">{guess === angleKind(w) ? `Richtig: ${w}° ist ein ${angleKind(w)}.` : `Noch nicht. Vergleiche mit 90° und 180°: ${w}° ist ein ${angleKind(w)}.`}</p>}
  </div>;
}
function CrossLab() {
  const [a, setA] = useState(55), [show, setShow] = useState(false);
  return <div className="topic-lab"><h3>Zwei Geraden schneiden sich</h3>
    <p>Verändere α. Beobachte, welche Winkel immer gleich groß bleiben und welche zusammen 180° ergeben.</p>
    <label>α = {a}°<input type="range" min="20" max="160" step="5" value={a} onChange={e => setA(+e.target.value)}/></label>
    <GeoShape s={{kind: 'g-cross', a, b: 10, c: 2}}/>
    <button className="btn small ghost" onClick={() => setShow(!show)} aria-expanded={show}>{show ? 'Werte verbergen' : 'Alle Winkel anzeigen'}</button>
    {show && <p className="success" role="status">α = {a}°, β = {180 - a}°, γ = {a}°, δ = {180 - a}°. Scheitelwinkel (α und γ, β und δ) sind gleich groß. Nebenwinkel (z. B. α und β) ergeben zusammen 180°.</p>}
  </div>;
}
function ParallelLab() {
  const [a, setA] = useState(60), [p, setP] = useState(0), [rel, setRel] = useState<'stufen' | 'wechsel'>('stufen');
  const q = rel === 'stufen' ? p : (p + 2) % 4, val = (x: number) => x % 2 === 0 ? a : 180 - a;
  const posName = ['rechts oben', 'links oben', 'links unten', 'rechts unten'];
  return <div className="topic-lab"><h3>Winkel an Parallelen</h3>
    <p>Die Geraden g und h sind parallel. Eine dritte Gerade schneidet beide. Wähle einen Winkel an g und finde seinen Partner an h.</p>
    <label>Schnittwinkel: {a}°<input type="range" min="30" max="150" step="5" value={a} onChange={e => setA(+e.target.value)}/></label>
    <label>Markierter Winkel an g<select value={p} onChange={e => setP(+e.target.value)}>{posName.map((n, i) => <option key={n} value={i}>{n}</option>)}</select></label>
    <div className="mode-pills"><button className={rel === 'stufen' ? 'selected' : ''} onClick={() => setRel('stufen')}>Stufenwinkel</button><button className={rel === 'wechsel' ? 'selected' : ''} onClick={() => setRel('wechsel')}>Wechselwinkel</button></div>
    <GeoShape s={{kind: 'g-parallel', a, b: p, c: q}}/>
    <p className="lab-status" role="status">{rel === 'stufen' ? `Stufenwinkel liegen an beiden Schnittpunkten an derselben Stelle (${posName[p]}). Sie sind gleich groß: ${val(p)}°.` : `Wechselwinkel liegen an den beiden Schnittpunkten über Kreuz (${posName[p]} und ${posName[q]}). Sie sind gleich groß: ${val(p)}°.`}</p>
  </div>;
}
function TriangleLab() {
  const [al, setAl] = useState(50), [be, setBe] = useState(70);
  const b2 = Math.min(be, 170 - al);
  return <div className="topic-lab"><h3>Winkelsumme im Dreieck</h3>
    <p>Verändere zwei Winkel. Der dritte Winkel passt sich an. Was bleibt immer gleich?</p>
    <label>α = {al}°<input type="range" min="20" max="140" step="5" value={al} onChange={e => setAl(+e.target.value)}/></label>
    <label>β = {b2}°<input type="range" min="10" max={170 - al} step="5" value={b2} onChange={e => setBe(+e.target.value)}/></label>
    <GeoShape s={{kind: 'g-triangle', a: al, b: b2, c: 1}}/>
    <p className="success" role="status">α + β + γ = {al}° + {b2}° + {180 - al - b2}° = 180°</p>
    <p className="hint">Probiere es auf Papier: Reiße die drei Ecken eines Dreiecks ab und lege sie aneinander. Sie bilden einen gestreckten Winkel.</p>
  </div>;
}

/* ---------- Symmetrie ---------- */
const patterns = [[1, 2, 3, 11, 13, 21, 22, 23, 31, 41, 51], [3, 12, 13, 21, 22, 23, 30, 31, 32, 33, 42, 52], [0, 1, 11, 12, 22, 23, 33, 43, 42, 52], [2, 3, 13, 22, 23, 32, 33, 40, 41, 42, 43, 53]];
function SymmetryPainter() {
  const [n, setN] = useState(0), [right, setRight] = useState<Set<number>>(new Set()), [checked, setChecked] = useState(false);
  const left = patterns[n], cols = 4, rows = 6, target = new Set(left.map(v => Math.floor(v / 10) * 10 + (2 * cols - 1 - v % 10)));
  const toggle = (k: number) => { const s = new Set(right); s.has(k) ? s.delete(k) : s.add(k); setRight(s); setChecked(false); };
  const wrong = [...right].filter(k => !target.has(k)).length, missing = [...target].filter(k => !right.has(k)).length;
  return <div className="topic-lab"><h3>Spiegelbild ergänzen</h3>
    <p>Die rote Linie ist die Spiegelachse. Färbe rechts die Kästchen so, dass eine achsensymmetrische Figur entsteht. Jedes Kästchen hat rechts denselben Abstand zur Achse wie links.</p>
    <div className="geo5-grid" style={{gridTemplateColumns: `repeat(${2 * cols}, 1fr)`}} role="group" aria-label="Kästchengitter zum Spiegeln">
      {Array.from({length: rows}, (_, r) => Array.from({length: 2 * cols}, (_, c) => { const k = r * 10 + c, isLeft = c < cols, on = isLeft ? left.includes(k) : right.has(k); return isLeft
        ? <div key={k} className={'cell ' + (on ? 'on given' : '')} aria-hidden="true"/>
        : <button key={k} className={(on ? 'on ' : '') + (c === cols ? 'axis' : '')} aria-pressed={on} aria-label={`Zeile ${r + 1}, ${c - cols + 1}. Kästchen rechts der Achse`} onClick={() => toggle(k)}/>; }))}
    </div>
    <div className="guided-actions"><button className="btn small" onClick={() => setChecked(true)}>Prüfen</button><button className="btn small ghost" onClick={() => { setN((n + 1) % patterns.length); setRight(new Set()); setChecked(false); }}>Neue Figur</button></div>
    {checked && <p className={wrong + missing === 0 ? 'success' : 'hint'} role="status">{wrong + missing === 0 ? 'Genau richtig. Die Figur ist achsensymmetrisch.' : `${missing ? `Es fehlen noch ${missing} Kästchen. ` : ''}${wrong ? `${wrong} Kästchen liegen falsch. ` : ''}Zähle für jedes Kästchen die Abstände zur Achse.`}</p>}
  </div>;
}
function MirrorLab() {
  const [x, setX] = useState(2), [y, setY] = useState(3), [t, setT] = useState(0), [show, setShow] = useState(false);
  const d = 5, img: [number, number] = t === 0 ? [2 * d - x, y] : t === 1 ? [x, 2 * d - y] : t === 2 ? [y, x] : [2 * d - x, 2 * d - y];
  const names = ['Achse x = 5 (senkrecht)', 'Achse y = 5 (waagerecht)', 'Achse y = x (schräg)', 'Punkt Z(5|5)'];
  return <div className="topic-lab"><h3>Punkte im Gitter spiegeln</h3>
    <div className="guided-fields"><label>x-Wert von P<select value={x} onChange={e => { setX(+e.target.value); setShow(false); }}>{Array.from({length: 11}, (_, i) => <option key={i}>{i}</option>)}</select></label><label>y-Wert von P<select value={y} onChange={e => { setY(+e.target.value); setShow(false); }}>{Array.from({length: 11}, (_, i) => <option key={i}>{i}</option>)}</select></label><label>Spiegelung<select value={t} onChange={e => { setT(+e.target.value); setShow(false); }}>{names.map((n, i) => <option key={n} value={i}>{n}</option>)}</select></label></div>
    <GeoShape s={{kind: 'g-mirror', a: x, b: y, c: t, d: 5, e: 5}}/>
    <p>Überlege zuerst, wo der Bildpunkt P′ liegt. Dann vergleiche.</p>
    <button className="btn small ghost" onClick={() => setShow(true)}>Bildpunkt anzeigen</button>
    {show && <p className="success" role="status">P′({img[0]}|{img[1]}). {t === 3 ? 'Z ist genau die Mitte zwischen P und P′.' : t === 2 ? 'Bei dieser Achse tauschen x- und y-Wert die Plätze.' : 'P und P′ haben denselben Abstand zur Achse.'}</p>}
  </div>;
}
function RotationLab() {
  const [f, setF] = useState<PolyName>('Quadrat'), [rot, setRot] = useState(0);
  const P = polyPoints(f), cx = P.reduce((t, p) => t + p[0], 0) / P.length, cy = P.reduce((t, p) => t + p[1], 0) / P.length, fit = rot > 0 && rot < 360 && rot % polyFacts[f].dreh === 0;
  const path = `M ${P.map(p => p.join(' ')).join(' L ')} Z`;
  return <div className="topic-lab"><h3>Drehen, bis die Figur wieder passt</h3>
    <label>Figur<select value={f} onChange={e => { setF(e.target.value as PolyName); setRot(0); }}>{polyNames.map(n => <option key={n}>{n}</option>)}</select></label>
    <label>Drehwinkel: {rot}°<input type="range" min="0" max="360" step="15" value={rot} onChange={e => setRot(+e.target.value)}/></label>
    <svg viewBox="0 0 420 320" role="img" aria-label={`${f}, um ${rot} Grad gedreht`}><path d={path} fill="#eef1f6" stroke="#9aa7bf" strokeWidth="3" strokeDasharray="7 5"/><path d={path} fill={fit ? '#cdeee3' : '#dfe9ff'} fillOpacity=".75" stroke={fit ? '#168575' : '#355fe4'} strokeWidth="4" transform={`rotate(${-rot} ${cx} ${cy})`}/><circle cx={cx} cy={cy} r="6" fill="#c4314b"/></svg>
    <p className={fit ? 'success' : 'lab-status'} role="status">{fit ? `Deckungsgleich nach ${rot}°. ${polyFacts[f].dreh < 360 ? `Kleinster Drehwinkel: ${polyFacts[f].dreh}°.` : ''}` : rot === 360 ? 'Nach 360° passt jede Figur. Das zählt nicht als Drehsymmetrie.' : 'Die gedrehte Figur liegt noch nicht genau auf der gestrichelten.'}</p>
  </div>;
}
const quadProps: Record<string, string[]> = {
  'Quadrat': ['4 gleich lange Seiten', '4 rechte Winkel', '2 Paare paralleler Seiten', 'Diagonalen gleich lang und senkrecht'],
  'Rechteck': ['4 rechte Winkel', '2 Paare paralleler Seiten', 'gegenüberliegende Seiten gleich lang', 'Diagonalen gleich lang'],
  'Raute': ['4 gleich lange Seiten', '2 Paare paralleler Seiten', 'Diagonalen senkrecht zueinander'],
  'Parallelogramm': ['2 Paare paralleler Seiten', 'gegenüberliegende Seiten gleich lang', 'gegenüberliegende Winkel gleich groß'],
  'Drachenviereck': ['2 Paare gleich langer Nachbarseiten', 'Diagonalen senkrecht zueinander', 'eine Diagonale ist Symmetrieachse'],
  'Gleichschenkliges Trapez': ['1 Paar paralleler Seiten', 'die beiden Schenkel sind gleich lang', 'eine Symmetrieachse'],
  'Trapez': ['mindestens 1 Paar paralleler Seiten'],
};
function HouseLab() {
  const [f, setF] = useState('Raute');
  return <div className="topic-lab"><h3>Eigenschaften der Vierecke</h3>
    <p>Wähle ein Viereck. Jedes Viereck im Haus erbt alle Eigenschaften der Vierecke, die über ihm stehen und mit ihm verbunden sind.</p>
    <div className="mode-pills">{Object.keys(quadProps).map(n => <button key={n} className={f === n ? 'selected' : ''} onClick={() => setF(n)}>{n}</button>)}</div>
    <GeoShape s={{kind: 'g-poly', a: polyNames.indexOf(f as PolyName)}}/>
    <ul>{quadProps[f].map(p => <li key={p}>{p}</li>)}</ul>
  </div>;
}

/* ---------- Körper & Netze ---------- */
const solidNames = Object.keys(solidFacts) as SolidName[];
function SolidLab() {
  const [i, setI] = useState(0), [show, setShow] = useState(false), n = solidNames[i], f = solidFacts[n];
  return <div className="topic-lab"><h3>Ecken, Kanten und Flächen zählen</h3>
    <label>Körper<select value={i} onChange={e => { setI(+e.target.value); setShow(false); }}>{solidNames.map((s, k) => <option key={s} value={k}>{s}</option>)}</select></label>
    <GeoShape s={{kind: 'g-solid', a: i}}/>
    <p>Gestrichelte Linien sind verdeckte Kanten. Zähle zuerst selbst.</p>
    <button className="btn small ghost" onClick={() => setShow(!show)} aria-expanded={show}>{show ? 'Lösung verbergen' : 'Lösung zeigen'}</button>
    {show && <p className="success" role="status">{n}: {f.ecken} Ecken, {f.kanten} Kanten, {f.flaechen} Flächen. {f.text}.</p>}
  </div>;
}
const pairColors = ['#f4c7c3', '#c9e4c5', '#c7d7f6'];
function NetLab() {
  const R = 4, C = 5, [sel, setSel] = useState<number[]>([]), [checked, setChecked] = useState(false);
  const cells = sel.map(k => [Math.floor(k / 10), k % 10] as [number, number]);
  const faces = useMemo(() => checked && sel.length === 6 ? foldNet(cells) : null, [checked, sel]);
  const toggle = (k: number) => { setChecked(false); setSel(sel.includes(k) ? sel.filter(x => x !== k) : sel.length < 6 ? [...sel, k] : sel); };
  return <div className="topic-lab"><h3>Würfelnetz-Werkstatt</h3>
    <p>Wähle genau sechs Kästchen, die über Kanten zusammenhängen. Prüfe dann, ob sich daraus ein Würfel falten lässt. Gegenüberliegende Flächen bekommen dieselbe Farbe.</p>
    <div className="geo5-grid net" style={{gridTemplateColumns: `repeat(${C}, 1fr)`}} role="group" aria-label="Gitter für ein Würfelnetz">
      {Array.from({length: R}, (_, r) => Array.from({length: C}, (_, c) => { const k = r * 10 + c, idx = sel.indexOf(k), on = idx >= 0; return <button key={k} className={on ? 'on' : ''} style={faces && on ? {background: pairColors[faces[idx] >> 1]} : undefined} aria-pressed={on} aria-label={`Zeile ${r + 1}, Spalte ${c + 1}`} onClick={() => toggle(k)}/>; }))}
    </div>
    <p className="lab-status">{sel.length} von 6 Kästchen gewählt.</p>
    <div className="guided-actions"><button className="btn small" disabled={sel.length !== 6} onClick={() => setChecked(true)}>Falten prüfen</button><button className="btn small ghost" onClick={() => { setSel([]); setChecked(false); }}>Neu beginnen</button><button className="btn small ghost" onClick={() => { setSel(encodeCells([[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]])); setChecked(false); }}>Beispiel laden</button></div>
    {checked && <p className={faces ? 'success' : 'hint'} role="status">{faces ? 'Das ist ein Würfelnetz. Gleiche Farben liegen nach dem Falten gegenüber.' : 'Daraus entsteht kein Würfel: Beim Falten würden sich Flächen überlappen oder es bliebe eine Seite offen. Tipp: Vier Quadrate in einer Reihe bilden einen Ring, oben und unten braucht er je einen Deckel.'}</p>}
  </div>;
}
function ObliqueLab() {
  const [a, setA] = useState(4), [b, setB] = useState(3), [c, setC] = useState(2), u = 32;
  const dx = c * u / 2 * Math.SQRT1_2, dy = dx, ox = Math.round((420 - a * u - dx) / 2), oy = Math.round(160 + (b * u + dy) / 2);
  const F = [[ox, oy], [ox + a * u, oy], [ox + a * u, oy - b * u], [ox, oy - b * u]], B = F.map(([x, y]) => [x + dx, y - dy]);
  const ln = (p: number[], q: number[], hidden = false, k = '') => <line key={k} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={hidden ? '#7d8aa5' : '#24324d'} strokeWidth={hidden ? 2 : 3} strokeDasharray={hidden ? '7 6' : undefined}/>;
  return <div className="topic-lab"><h3>Schrägbild eines Quaders</h3>
    <p>So zeichnest du im Heft: Vorderfläche in wahrer Größe. Tiefe schräg nach hinten im Winkel von 45° und nur halb so lang. Verdeckte Kanten zeichnest du gestrichelt.</p>
    <div className="guided-fields"><label>Länge: {a} cm<input type="range" min="1" max="8" value={a} onChange={e => setA(+e.target.value)}/></label><label>Höhe: {b} cm<input type="range" min="1" max="6" value={b} onChange={e => setB(+e.target.value)}/></label><label>Tiefe: {c} cm<input type="range" min="1" max="6" value={c} onChange={e => setC(+e.target.value)}/></label></div>
    <svg viewBox="0 0 420 320" role="img" aria-label={`Schrägbild eines Quaders mit Länge ${a} cm, Höhe ${b} cm und Tiefe ${c} cm`}>
      {Array.from({length: 27}, (_, i) => <line key={'v' + i} x1={ox + (i - 13) * u / 2} y1="0" x2={ox + (i - 13) * u / 2} y2="320" stroke="#e8edf6"/>)}{Array.from({length: 21}, (_, i) => <line key={'h' + i} x1="0" y1={oy - (i - 1) * u / 2} x2="420" y2={oy - (i - 1) * u / 2} stroke="#e8edf6"/>)}
      <path d={`M ${F.map(p => p.join(' ')).join(' L ')} Z`} fill="#dfe9ff" fillOpacity=".7"/>
      {ln(B[0], B[1], true, 'h1')}{ln(B[0], B[3], true, 'h2')}{ln(F[0], B[0], true, 'h3')}
      {[0, 1, 2, 3].map(i => ln(F[i], F[(i + 1) % 4], false, 'f' + i))}{ln(B[1], B[2], false, 'b1')}{ln(B[2], B[3], false, 'b2')}{ln(F[1], B[1], false, 'd1')}{ln(F[2], B[2], false, 'd2')}{ln(F[3], B[3], false, 'd3')}
    </svg>
    <p className="lab-status" role="status">Die Tiefe von {c} cm wird mit {String(c / 2).replace('.', ',')} cm schräg gezeichnet.</p>
  </div>;
}
function BuildingLab() {
  const rows = 3, cols = 3, [h, setH] = useState([2, 1, 0, 1, 1, 0, 1, 0, 0]);
  const sum = h.reduce((s, x) => s + x, 0);
  return <div className="topic-lab"><h3>Würfelgebäude bauen</h3>
    <p>Tippe auf ein Feld des Bauplans. Jeder Tipp setzt einen Würfel mehr auf dieses Feld (höchstens 4). Danach beginnt das Feld wieder bei 0.</p>
    <div className="geo5-grid plan" style={{gridTemplateColumns: `repeat(${cols}, 1fr)`}} role="group" aria-label="Bauplan zum Antippen">
      {h.map((v, i) => <button key={i} className={v ? 'on' : ''} aria-label={`Feld Zeile ${Math.floor(i / cols) + 1}, Spalte ${i % cols + 1}: ${v} Würfel`} onClick={() => setH(h.map((x, k) => k === i ? (x + 1) % 5 : x))}>{v}</button>)}
    </div>
    <p className="lab-status">Die untere Reihe des Bauplans ist vorne.</p>
    <GeoShape s={{kind: 'g-building', a: rows, b: cols, v: h}}/>
    <p className="success" role="status">Das Gebäude besteht aus {sum} Würfeln. Die Summe aller Zahlen im Bauplan ist die Anzahl der Würfel.</p>
  </div>;
}

export function GeoLab({topic, step}: {topic: 'angles' | 'symmetry' | 'solids'; step: number}) {
  if (topic === 'angles') return [<MeasureLab key="0"/>, <CrossLab key="1"/>, <ParallelLab key="2"/>, <TriangleLab key="3"/>][Math.min(step, 3)];
  if (topic === 'symmetry') return [<SymmetryPainter key="0"/>, <MirrorLab key="1"/>, <RotationLab key="2"/>, <HouseLab key="3"/>][Math.min(step, 3)];
  return [<SolidLab key="0"/>, <NetLab key="1"/>, <ObliqueLab key="2"/>, <BuildingLab key="3"/>][Math.min(step, 3)];
}

export const geoLessons: Record<'angles' | 'symmetry' | 'solids', Lesson[]> = {
  angles: [
    {title: 'Winkel messen mit dem Geodreieck', text: 'Ein Winkel entsteht, wenn zwei Strahlen – die Schenkel – von einem gemeinsamen Punkt, dem Scheitel, ausgehen. Die Größe eines Winkels misst du in Grad. Ein Vollkreis hat 360°, ein rechter Winkel 90°. Beim Messen legst du die Mitte des Geodreiecks genau auf den Scheitel und die Nullkante auf einen Schenkel. Dann liest du an der Skala ab, die an diesem Schenkel mit 0° beginnt. Schätze vorher: Ist der Winkel kleiner oder größer als ein rechter Winkel?', rule: 'Spitz: unter 90°. Recht: 90°. Stumpf: zwischen 90° und 180°. Gestreckt: 180°. Überstumpf: zwischen 180° und 360°. Vollwinkel: 360°.', visual: <GeoShape s={{kind: 'g-protractor', a: 50, b: 0}}/>, example: 'Ein Winkel von 130° ist stumpf. Liest du 50° ab, obwohl der Winkel offensichtlich größer als ein rechter ist, hast du die falsche Skala benutzt.', coach: 'Schätzen schützt vor dem häufigsten Fehler: dem Ablesen an der falschen Skala.'},
    {title: 'Nebenwinkel und Scheitelwinkel', text: 'Wenn sich zwei Geraden schneiden, entstehen vier Winkel. Zwei Winkel, die nebeneinander an derselben Geraden liegen, heißen Nebenwinkel. Zusammen bilden sie einen gestreckten Winkel, also 180°. Zwei Winkel, die sich am Schnittpunkt genau gegenüberliegen, heißen Scheitelwinkel. Sie sind immer gleich groß. Kennst du einen der vier Winkel, kannst du alle anderen berechnen.', rule: 'Nebenwinkel ergeben zusammen 180°. Scheitelwinkel sind gleich groß.', visual: <GeoShape s={{kind: 'g-cross', a: 50, b: 10, c: 1}}/>, example: 'α = 50°. Nebenwinkel β = 180° − 50° = 130°. Scheitelwinkel γ = 50°. δ ist Scheitelwinkel von β, also 130°.', coach: 'Kontrolle: Alle vier Winkel zusammen ergeben 360°.'},
    {title: 'Winkel an Parallelen', text: 'Werden zwei parallele Geraden g und h von einer dritten Geraden geschnitten, entstehen zwei Schnittpunkte mit je vier Winkeln. Weil g und h parallel sind, sehen beide Schnittpunkte genau gleich aus. Stufenwinkel liegen an beiden Schnittpunkten an der gleichen Stelle, zum Beispiel jeweils rechts oben. Wechselwinkel liegen über Kreuz: einer rechts oben, der andere links unten. Stufenwinkel und Wechselwinkel sind an Parallelen gleich groß.', rule: 'An parallelen Geraden gilt: Stufenwinkel sind gleich groß. Wechselwinkel sind gleich groß.', visual: <GeoShape s={{kind: 'g-parallel', a: 60, b: 0, c: 2}}/>, example: 'Rechts oben an g liegt 60°. Links unten an h liegt der Wechselwinkel: auch 60°. Rechts unten an h liegt dann der Nebenwinkel 180° − 60° = 120°.', coach: 'Verschiebe in Gedanken den oberen Schnittpunkt entlang der schrägen Geraden nach unten. Er passt genau auf den unteren.'},
    {title: 'Winkelsumme im Dreieck und Viereck', text: 'In jedem Dreieck ergeben die drei Innenwinkel zusammen 180°. Du kannst das ausprobieren: Reiße die drei Ecken eines Papierdreiecks ab und lege sie aneinander. Sie bilden einen gestreckten Winkel. Jedes Viereck kannst du durch eine Diagonale in zwei Dreiecke zerlegen. Deshalb ist die Winkelsumme im Viereck 2 · 180° = 360°. Nach ihren Winkeln heißen Dreiecke spitzwinklig, rechtwinklig oder stumpfwinklig.', rule: 'Dreieck: α + β + γ = 180°. Viereck: α + β + γ + δ = 360°.', visual: <GeoShape s={{kind: 'g-triangle', a: 50, b: 70}}/>, example: 'α = 50°, β = 70°. γ = 180° − 50° − 70° = 60°. Alle Winkel sind kleiner als 90°: Das Dreieck ist spitzwinklig.', coach: 'Ein Dreieck kann höchstens einen rechten oder stumpfen Winkel haben.'},
  ],
  symmetry: [
    {title: 'Achsensymmetrie erkennen', text: 'Eine Figur ist achsensymmetrisch, wenn du sie so falten kannst, dass beide Hälften genau aufeinanderliegen. Die Faltlinie heißt Symmetrieachse. Manche Figuren haben mehrere Achsen: Ein Rechteck hat zwei, ein Quadrat sogar vier. Viele Buchstaben sind achsensymmetrisch, zum Beispiel A (senkrechte Achse) oder E (waagerechte Achse). Ein Parallelogramm hat keine Symmetrieachse, obwohl es auf den ersten Blick regelmäßig aussieht.', rule: 'Auf beiden Seiten der Achse liegt jeder Punkt gleich weit von der Achse entfernt. Die Verbindungslinie von Punkt und Bildpunkt steht senkrecht auf der Achse.', visual: <GeoShape s={{kind: 'g-half', a: 4, b: 6, v: patterns[0], w: patterns[0]}}/>, example: 'Ein Kästchen liegt 2 Kästchen links von der Achse. Sein Spiegelbild liegt in derselben Zeile 2 Kästchen rechts von der Achse.', coach: 'Prüfe mit einem Spiegel oder durch Falten von Papier.'},
    {title: 'Spiegeln im Gitter', text: 'Im Koordinatensystem kannst du Punkte genau spiegeln. An einer senkrechten Achse bleibt der y-Wert gleich. Der x-Wert ändert sich so, dass der Bildpunkt auf der anderen Seite gleich weit von der Achse entfernt ist. An einer waagerechten Achse bleibt der x-Wert gleich. Bei der Punktspiegelung an einem Zentrum Z gehst du von P durch Z hindurch genauso weit weiter. Z ist dann die Mitte zwischen P und P′.', rule: 'Spiegeln heißt: senkrecht zur Achse gleich weit auf die andere Seite. Bei der Punktspiegelung ist das Zentrum die Mitte zwischen Punkt und Bildpunkt.', visual: <GeoShape s={{kind: 'g-mirror', a: 2, b: 3, c: 0, d: 5, e: 5}}/>, example: 'P(2|3), Achse x = 5: P liegt 3 links von der Achse. P′ liegt 3 rechts davon: P′(8|3).', coach: 'Zähle die Kästchen bis zur Achse und dieselbe Anzahl auf der anderen Seite.'},
    {title: 'Punkt- und Drehsymmetrie', text: 'Eine Figur ist drehsymmetrisch, wenn sie nach einer Drehung um ihren Mittelpunkt um weniger als 360° wieder genau auf sich selbst liegt. Ein Quadrat passt schon nach 90° wieder. Passt eine Figur nach einer halben Drehung um 180° wieder genau auf sich selbst, ist sie punktsymmetrisch: Jeder Punkt hat durch den Mittelpunkt hindurch einen Partnerpunkt in gleicher Entfernung. Rechteck, Raute und Parallelogramm sind punktsymmetrisch, ein Drachenviereck nicht.', rule: 'Kleinster Drehwinkel = 360° : Anzahl der Lagen, in denen die Figur passt. Punktsymmetrisch heißt: Sie passt nach einer halben Drehung.', visual: <GeoShape s={{kind: 'g-poly', a: polyNames.indexOf('Regelmäßiges Sechseck'), b: 1}}/>, example: 'Ein regelmäßiges Sechseck passt in 6 Lagen. Kleinster Drehwinkel: 360° : 6 = 60°. Weil es auch bei 180° passt, ist es punktsymmetrisch.', coach: 'Lege Transparentpapier auf die Figur, pinne den Mittelpunkt fest und drehe.'},
    {title: 'Das Haus der Vierecke', text: 'Vierecke lassen sich nach ihren Eigenschaften ordnen. Ein Trapez hat mindestens ein Paar paralleler Seiten. Ein Parallelogramm hat zwei Paare. Hat ein Parallelogramm vier rechte Winkel, ist es ein Rechteck. Hat es vier gleich lange Seiten, ist es eine Raute. Ein Quadrat ist beides: Rechteck und Raute zugleich. Das Drachenviereck hat zwei Paare gleich langer Nachbarseiten. Auch die Raute ist ein besonderes Drachenviereck.', rule: 'Ein Viereck weiter unten im Haus hat alle Eigenschaften der Vierecke, mit denen es weiter oben verbunden ist. Jedes Quadrat ist ein Rechteck, aber nicht jedes Rechteck ist ein Quadrat.', visual: <GeoShape s={{kind: 'g-house', a: 0}}/>, example: 'Ist jede Raute ein Parallelogramm? Ja: Eine Raute hat zwei Paare paralleler Seiten. Ist jedes Parallelogramm eine Raute? Nein: Die Seiten müssen nicht alle gleich lang sein.', coach: 'Für „Jedes …“-Aussagen genügt ein einziges Gegenbeispiel, um sie zu widerlegen.'},
  ],
  solids: [
    {title: 'Körper erkennen und beschreiben', text: 'Körper sind räumliche Figuren. Du beschreibst sie mit Flächen, Kanten und Ecken. Eine Kante entsteht, wo zwei Flächen zusammenstoßen. Eine Ecke ist ein Punkt, an dem mehrere Kanten zusammentreffen. Prismen haben eine gleiche Grund- und Deckfläche, die durch Rechtecke verbunden sind. Pyramiden haben eine Grundfläche und Dreiecke, die in einer Spitze zusammenlaufen. Zylinder, Kegel und Kugel haben gekrümmte Flächen.', rule: 'Würfel und Quader: 8 Ecken, 12 Kanten, 6 Flächen. Für Körper mit ebenen Flächen gilt: Ecken + Flächen − Kanten = 2.', visual: <SolidGallery/>, example: 'Quadratische Pyramide: 5 Ecken, 8 Kanten, 5 Flächen. Probe: 5 + 5 − 8 = 2.', coach: 'Ein Kantenmodell aus Trinkhalmen und Knete zeigt dir alle Kanten auf einmal.'},
    {title: 'Würfelnetze', text: 'Schneidest du einen Würfel an einigen Kanten auf und klappst ihn flach, entsteht ein Netz aus sechs Quadraten. Es gibt genau 11 verschiedene Würfelnetze. Nicht jede Anordnung aus sechs Quadraten ist ein Netz: Liegen fünf Quadrate in einer Reihe, überlappen sich zwei beim Falten. Bei einem Würfelnetz liegen sich in einer Reihe von drei Quadraten das erste und das dritte später gegenüber.', rule: 'Ein Würfelnetz hat 6 Quadrate. Zwei Flächen, zwischen denen in einer Reihe genau eine Fläche liegt, sind nach dem Falten gegenüber. Bei einem Spielwürfel ergeben gegenüberliegende Augenzahlen 7.', visual: <GeoShape s={{kind: 'g-net', a: 1, v: encodeCells([[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]]), w: [1, 1, 1, 1, 1, 1]}}/>, example: 'Im Kreuz-Netz liegen B, C, D, E in einer Reihe. B und D sind gegenüber, C und E auch. A und F sind Deckel und Boden.', coach: 'Falte Netze aus Karopapier nach. So entwickelt sich dein Raumvorstellungsvermögen.'},
    {title: 'Schrägbilder zeichnen', text: 'Ein Schrägbild zeigt einen Körper räumlich auf dem flachen Papier. Für Quader und Würfel gilt im Heft: Die Vorderfläche zeichnest du in wahrer Größe. Die Kanten, die nach hinten gehen, zeichnest du schräg im Winkel von 45° und nur halb so lang. Auf Kästchenpapier gehst du dafür diagonal durch die Kästchen. Kanten, die man von vorne nicht sehen kann, werden gestrichelt gezeichnet.', rule: 'Vorderfläche in Originalgröße. Tiefe: 45°, halbe Länge. Verdeckte Kanten gestrichelt.', visual: <GeoShape s={{kind: 'g-solid', a: 1}}/>, example: 'Quader 4 cm × 3 cm × 2 cm: Vorderfläche 4 cm breit, 3 cm hoch. Die Tiefe 2 cm zeichnest du als 1 cm lange Schräge.', coach: 'Zeichne zuerst die Vorderfläche, dann die schrägen Kanten, dann die Rückseite.'},
    {title: 'Würfelgebäude und Baupläne', text: 'Ein Bauplan zeigt ein Würfelgebäude von oben. In jedem Feld steht, wie viele Würfel dort übereinander stehen. Die Summe aller Zahlen ist die Anzahl der Würfel. Die größte Zahl gibt die Höhe des Gebäudes an. Bei einem fertigen Bild eines Gebäudes musst du auch an Würfel denken, die hinten oder unten versteckt sind.', rule: 'Anzahl der Würfel = Summe aller Zahlen im Bauplan. Höhe = größte Zahl.', visual: <GeoShape s={{kind: 'g-building', a: 3, b: 3, v: [2, 1, 0, 1, 1, 0, 1, 0, 0]}}/>, example: 'Bauplan 2 1 0 | 1 1 0 | 1 0 0: 2 + 1 + 1 + 1 + 1 = 6 Würfel. Höhe: 2 Würfel.', coach: 'Baue Gebäude mit echten Würfeln nach und zeichne den Bauplan dazu.'},
  ],
};

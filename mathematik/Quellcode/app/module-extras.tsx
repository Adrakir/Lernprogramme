'use client';
// Vertiefung, Modultest und Hilfen für die zwölf Lernmodule.
import {useEffect, useMemo, useState, type ReactNode} from 'react';
import {ArrowLeft, ArrowRight, BookOpen, Check, CircleCheck, CircleHelp, Lightbulb, Printer, RotateCcw, Target, TriangleAlert, Trophy} from 'lucide-react';
import {type Topic, type Problem, parseAnswer, isComplete, correct, makeProblem} from '@/lib/math';
import {areas} from '@/lib/tasks';
import {buildModuleTest} from '@/lib/module-test';
import './module-extras.css';
import {modulInhalte, type Vertiefungsaufgabe} from '@/lib/module-content';
import {grade} from '@/lib/groessen-tasks';

/* ---------- Vertiefung ---------- */

function VertiefungCard({a, nr}: {a: Vertiefungsaufgabe; nr: number}) {
  const felder = a.pruefung.kind === 'zahl' ? a.pruefung.felder : [];
  const [werte, setWerte] = useState<string[]>(felder.map(() => ''));
  const [wahl, setWahl] = useState<number | null>(null);
  const [begruendung, setBegruendung] = useState('');
  const [status, setStatus] = useState<'' | 'ok' | 'falsch' | 'leer'>('');
  const [versuche, setVersuche] = useState(0);
  const [tipp, setTipp] = useState(false);
  const [loesung, setLoesung] = useState(false);

  function pruefen() {
    if (a.pruefung.kind === 'zahl') {
      if (werte.some(w => !w.trim())) { setStatus('leer'); return; }
      const ok = a.pruefung.felder.every((f, i) => {
        const v = parseAnswer(werte[i]);
        return v !== null && Math.abs(v - f.wert) < 1e-9;
      });
      setStatus(ok ? 'ok' : 'falsch');
      if (!ok) setVersuche(versuche + 1);
    } else {
      if (wahl === null) { setStatus('leer'); return; }
      const ok = wahl === a.pruefung.richtig;
      setStatus(ok ? 'ok' : 'falsch');
      if (!ok) setVersuche(versuche + 1);
    }
  }

  const id = `vt-${nr}`;
  return <article className="panel mx-card">
    <div className="mx-card-head"><span className={'mx-badge mx-' + (a.typ === 'Knobeln' ? 'violet' : a.typ === 'Begründen' ? 'blue' : 'green')}>{a.typ}</span><span className="muted">Aufgabe {nr}</span></div>
    <h3>{a.titel}</h3>
    <p className="mx-task">{a.aufgabe}</p>
    <form onSubmit={e => { e.preventDefault(); pruefen(); }}>
      {a.pruefung.kind === 'zahl'
        ? <div className="mx-fields">{a.pruefung.felder.map((f, i) => <label key={i} className="mx-field"><span>{f.label}</span><span className="mx-input-line"><input inputMode="decimal" autoComplete="off" value={werte[i]} disabled={status === 'ok'} aria-label={f.label} onChange={e => { const n = [...werte]; n[i] = e.target.value; setWerte(n); setStatus(''); }}/>{f.einheit && <span className="mx-unit">{f.einheit}</span>}</span></label>)}</div>
        : <fieldset className="mx-choices"><legend className="sr-only">Antwort auswählen</legend>{a.pruefung.optionen.map((o, i) => <label key={i} className={'mx-choice' + (wahl === i ? ' active' : '')}><input type="radio" name={id} checked={wahl === i} disabled={status === 'ok'} onChange={() => { setWahl(i); setStatus(''); }}/><span>{o}</span></label>)}</fieldset>}
      {a.typ === 'Begründen' && <label className="mx-field mx-reason"><span>Meine Begründung (freiwillig, wird nicht bewertet)</span><textarea rows={3} value={begruendung} onChange={e => setBegruendung(e.target.value)} placeholder="Ich weiß das, weil …"/></label>}
      <div className="exercise-actions">
        {status !== 'ok' && <button className="btn" type="submit">Prüfen<Check size={18}/></button>}
        <button type="button" className="btn ghost" onClick={() => setTipp(true)} disabled={tipp}><Lightbulb size={18}/>Tipp</button>
        <button type="button" className="btn ghost" onClick={() => setLoesung(!loesung)}>{loesung ? 'Lösung ausblenden' : 'Musterlösung'}</button>
      </div>
    </form>
    {status && <div role="status" className={'feedback ' + (status === 'ok' ? 'success' : 'hint')}>{status === 'ok' ? <CircleCheck size={22}/> : <CircleHelp size={22}/>}<span>{status === 'ok' ? 'Richtig. Vergleiche deinen Weg mit der Musterlösung.' : status === 'leer' ? 'Trage zuerst eine Antwort ein.' : versuche >= 2 ? 'Noch nicht. Nutze den Tipp oder schau dir die Musterlösung an.' : 'Noch nicht richtig. Prüfe deinen Rechenweg Schritt für Schritt.'}</span></div>}
    {tipp && <div className="mx-tip"><Lightbulb size={18}/><span>{a.tipp}</span></div>}
    {(loesung || status === 'ok') && <div className="solution"><strong>Musterlösung</strong>{a.loesung.map((s, i) => <p key={i}>{s}</p>)}</div>}
  </article>;
}

export function ModulVertiefung({topic, onKnobeln}: {topic: Topic; onKnobeln: () => void}) {
  const inhalt = modulInhalte[topic];
  return <div className="mx-wrap">
    <div className="panel mx-intro"><span className="eyebrow">VERTIEFUNG</span><h2>Weiterdenken, begründen, anwenden.</h2><p>Diese Aufgaben gehen über das Üben hinaus. Nimm dir Zeit, schreibe Zwischenschritte auf und erkläre, warum dein Ergebnis stimmt.</p></div>
    <div className="mx-grid">{inhalt.vertiefung.map((a, i) => <VertiefungCard key={topic + i} a={a} nr={i + 1}/>)}</div>
    <div className="panel mx-more"><div><strong>Du willst mehr?</strong><p>Im Üben-Bereich warten viele Aufgaben auf der Stufe „Knifflig“.</p></div><button className="btn" onClick={onKnobeln}>Mehr Knobelaufgaben<ArrowRight size={18}/></button></div>
  </div>;
}

/* ---------- Hilfen ---------- */

export function ModulHilfen({topic}: {topic: Topic}) {
  const h = modulInhalte[topic].hilfe;
  const [schritt, setSchritt] = useState(0);
  useEffect(() => setSchritt(0), [topic]);
  return <div className="mx-wrap mx-help">
    <section className="panel"><span className="eyebrow">DAS MUSST DU WISSEN</span><h2>Merksätze</h2><ul className="mx-merk">{h.merksaetze.map((m, i) => <li key={i}><Check size={18}/><span>{m}</span></li>)}</ul></section>
    <section className="panel"><span className="eyebrow">BEISPIEL SCHRITT FÜR SCHRITT</span><h2>So gehst du vor</h2><p className="mx-task">{h.beispiel.aufgabe}</p><ol className="mx-steps">{h.beispiel.schritte.slice(0, schritt).map((s, i) => <li key={i}>{s}</li>)}</ol><div className="exercise-actions">{schritt < h.beispiel.schritte.length ? <button className="btn" onClick={() => setSchritt(schritt + 1)}>{schritt === 0 ? 'Ersten Schritt zeigen' : 'Nächster Schritt'}<ArrowRight size={18}/></button> : <span className="mx-done"><CircleCheck size={20}/>Fertig. Versuche jetzt eine ähnliche Aufgabe im Üben-Bereich.</span>}{schritt > 0 && <button className="btn ghost" onClick={() => setSchritt(0)}><RotateCcw size={18}/>Von vorn</button>}{schritt < h.beispiel.schritte.length && <button className="btn ghost" onClick={() => setSchritt(h.beispiel.schritte.length)}>Alle Schritte</button>}</div></section>
    <section className="panel"><span className="eyebrow">TYPISCHE FEHLER</span><h2>Darauf solltest du achten</h2><div className="mx-errors">{h.fehler.map((f, i) => <div key={i} className="mx-error"><p className="mx-bad"><TriangleAlert size={18}/><span>{f.fehler}</span></p><p className="mx-good"><CircleCheck size={18}/><span>{f.richtig}</span></p></div>)}</div></section>
    <section className="panel"><span className="eyebrow">STRATEGIE</span><h2>Wenn du nicht weiterkommst</h2><ol className="mx-strategy">{h.strategie.map((s, i) => <li key={i}>{s}</li>)}</ol><div className="exercise-actions"><a className="btn ghost" href="#glossary"><BookOpen size={18}/>Wissenskarten öffnen</a><button className="btn ghost" onClick={() => window.print()}><Printer size={18}/>Hilfen drucken</button></div></section>
  </div>;
}

/* ---------- Modultest ---------- */

export const MODULTEST_KEY = 'mathe-kompass-modultests-v1';
type TestErgebnis = {punkte: number; max: number; prozent: number; note: string; datum: string};
function loadErgebnisse(): Partial<Record<Topic, TestErgebnis[]>> {
  try { return JSON.parse(localStorage.getItem(MODULTEST_KEY) || '{}') || {}; } catch { return {}; }
}

const zeigen = (s: string) => s.split('|').filter(Boolean).join(' · ') || '–';

export function ModuleTest({topic, renderVisual, renderAnswer, onPractice}: {
  topic: Topic;
  renderVisual: (p: Problem) => ReactNode;
  renderAnswer: (p: Problem, value: string, setValue: (s: string) => void, disabled: boolean) => ReactNode;
  onPractice: (area: string) => void;
}) {
  const [seed, setSeed] = useState<number | null>(null);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [fertig, setFertig] = useState(false);
  const [warnung, setWarnung] = useState(false);
  const [verlauf, setVerlauf] = useState<TestErgebnis[]>([]);
  useEffect(() => { setVerlauf(loadErgebnisse()[topic] ?? []); }, [topic]);

  const items = useMemo(() => seed === null ? [] : buildModuleTest(topic, seed), [topic, seed]);
  const ps = useMemo(() => items.map(it => makeProblem(topic, it.seed, it.level, it.id)), [items, topic]);
  const ok = ps.map((p, j) => !!answers[j] && isComplete(p, answers[j]) && correct(p, answers[j]));
  const max = items.reduce((s, it) => s + it.punkte, 0);
  const punkte = items.reduce((s, it, j) => s + (ok[j] ? it.punkte : 0), 0);
  const offen = ps.filter((p, j) => !answers[j] || !isComplete(p, answers[j])).length;
  const namen = areas[topic] ?? {};

  function start() {
    window.scrollTo({top: 0, behavior: 'instant'});
    setSeed(Date.now() % 10000000); setI(0); setAnswers(Array(10).fill('')); setFertig(false); setWarnung(false);
  }
  function abgeben(trotzdem = false) {
    if (offen && !trotzdem) { setWarnung(true); return; }
    const prozent = Math.round(punkte / max * 100);
    const e: TestErgebnis = {punkte, max, prozent, note: grade(prozent).note, datum: new Date().toISOString()};
    const alle = loadErgebnisse();
    const neu = [...(alle[topic] ?? []), e].slice(-10);
    alle[topic] = neu;
    try { localStorage.setItem(MODULTEST_KEY, JSON.stringify(alle)); } catch { /* Speicher voll oder gesperrt */ }
    setVerlauf(neu); setFertig(true); setWarnung(false);
    window.scrollTo({top: 0, behavior: 'instant'});
  }

  if (seed === null) {
    const letzt = verlauf[verlauf.length - 1];
    return <div className="mx-wrap"><div className="panel mx-intro mx-test-start">
      <span className="eyebrow">MODULTEST</span><h2>Zeig, was du kannst.</h2>
      <p>10 Aufgaben aus allen Teilthemen dieses Moduls. Die Aufgaben 1 bis 7 zählen je 1 Punkt, die Knobelaufgaben 8 bis 10 je 2 Punkte. Im Test gibt es keine Tipps. Am Ende siehst du deine Auswertung mit allen Lösungswegen.</p>
      <div className="mission-facts"><span><Check/>Ohne Zeitlimit</span><span><Check/>Antworten änderbar</span><span><Check/>Jedes Mal neue Aufgaben</span></div>
      {letzt && <p className="mx-last">Letzter Test am {new Date(letzt.datum).toLocaleDateString('de-DE')}: <strong>{letzt.punkte} von {letzt.max} Punkten ({letzt.prozent} %)</strong>{verlauf.length > 1 && <> · bisher bestes Ergebnis: {Math.max(...verlauf.map(v => v.prozent))} %</>}</p>}
      <button className="btn" onClick={start}>Test starten<ArrowRight size={18}/></button>
    </div></div>;
  }

  if (fertig) {
    const prozent = Math.round(punkte / max * 100), g = grade(prozent);
    const teile = [...new Set(items.map(it => it.area))].map(a => {
      const idx = items.map((it, j) => it.area === a ? j : -1).filter(j => j >= 0);
      return {a, name: namen[a] ?? 'Gemischt', richtig: idx.filter(j => ok[j]).length, gesamt: idx.length};
    });
    return <div className="mx-wrap">
      <div className="panel mx-intro"><span className="achievement"><Trophy size={30}/></span><span className="eyebrow">AUSWERTUNG</span><h2>{punkte} von {max} Punkten · {prozent} %</h2><p><strong>Orientierungsnote {g.note}:</strong> {g.text}</p><p className="muted">Die Note dient nur zur Orientierung. Sie ersetzt keine Bewertung durch deine Lehrkraft.</p></div>
      <section className="panel"><h3>Ergebnis nach Teilthemen</h3><div className="mx-areas">{teile.map(t => <div key={t.a} className={'mx-area' + (t.richtig < t.gesamt ? ' weak' : '')}><span>{t.name}</span><strong>{t.richtig} / {t.gesamt}</strong>{t.richtig < t.gesamt && t.a !== 'mix' ? <button className="btn ghost small" onClick={() => onPractice(t.a)}><Target size={16}/>Üben</button> : <Check size={18}/>}</div>)}</div></section>
      <section className="panel"><h3>Deine Aufgaben und die Lösungswege</h3>{ps.map((p, j) => <details key={j} className="mx-review" open={!ok[j]}><summary><span className={ok[j] ? 'mx-ok' : 'mx-no'}>{ok[j] ? <CircleCheck size={18}/> : <CircleHelp size={18}/>}</span>Aufgabe {j + 1}: {p.title} <span className="muted">({ok[j] ? items[j].punkte : 0}/{items[j].punkte} P.)</span></summary><p className="mx-task">{p.prompt}</p>{p.expression && <div className="math-expression">{p.expression}</div>}{renderVisual(p)}<p><strong>Deine Antwort:</strong> {zeigen(answers[j] || '')}</p><div className="solution"><strong>So geht’s</strong>{p.solution.map((s, k) => <p key={k}>{s}</p>)}</div></details>)}</section>
      <div className="exercise-actions"><button className="btn" onClick={start}><RotateCcw size={18}/>Neuen Test schreiben</button><button className="btn ghost" onClick={() => window.print()}><Printer size={18}/>Auswertung drucken</button></div>
    </div>;
  }

  const p = ps[i];
  return <div className="mx-wrap"><section className="panel exercise">
    <div className="between"><span className="eyebrow">TESTAUFGABE {i + 1} VON {ps.length}{items[i].punkte === 2 ? ' · KNOBELAUFGABE (2 PUNKTE)' : ''}</span></div>
    <nav className="mx-nums" aria-label="Testaufgaben">{ps.map((q, j) => <button key={j} type="button" aria-label={`Aufgabe ${j + 1}${answers[j] && isComplete(q, answers[j]) ? ', beantwortet' : ''}`} aria-current={j === i ? 'step' : undefined} className={(j === i ? 'current ' : '') + (answers[j] && isComplete(q, answers[j]) ? 'done' : '')} onClick={() => { setI(j); setWarnung(false); }}>{j + 1}</button>)}</nav>
    <div className="question"><span className="topic-label">{p.title}</span><h2>{p.prompt}</h2>{p.expression && <div className="math-expression">{p.expression}</div>}{renderVisual(p)}</div>
    <form onSubmit={e => { e.preventDefault(); if (i + 1 < ps.length) setI(i + 1); else abgeben(); }}>
      {renderAnswer(p, answers[i] || '', v => { const n = [...answers]; n[i] = v; setAnswers(n); setWarnung(false); }, false)}
      <div className="exercise-actions">
        <button type="button" className="btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}><ArrowLeft size={18}/>Zurück</button>
        {i + 1 < ps.length ? <button className="btn" type="submit">Weiter<ArrowRight size={18}/></button> : <button className="btn" type="submit">Test abgeben<Check size={18}/></button>}
        {i + 1 < ps.length && <button type="button" className="btn ghost" onClick={() => abgeben()}>Test abgeben</button>}
      </div>
    </form>
    {warnung && <div role="alert" className="feedback hint"><CircleHelp size={22}/><span>Noch {offen} {offen === 1 ? 'Aufgabe ist' : 'Aufgaben sind'} offen. Über die Nummern springst du dorthin. <button type="button" className="btn ghost small" onClick={() => abgeben(true)}>Trotzdem abgeben</button></span></div>}
  </section></div>;
}

/* ---------- Gesamten Lernstand sichern und laden ---------- */

const PREFIX = 'mathe-kompass';
type Sicherung = {app: 'MatheKompass'; version: 1; datum: string; daten: Record<string, string>};

export function pruefeSicherung(x: unknown): Sicherung | null {
  if (!x || typeof x !== 'object') return null;
  const s = x as Partial<Sicherung>;
  if (s.app !== 'MatheKompass' || s.version !== 1 || !s.daten || typeof s.daten !== 'object') return null;
  const daten: Record<string, string> = {};
  for (const [k, v] of Object.entries(s.daten)) {
    if (!k.startsWith(PREFIX) || typeof v !== 'string' || k.length > 120) return null;
    daten[k] = v;
  }
  return Object.keys(daten).length ? {app: 'MatheKompass', version: 1, datum: String(s.datum || ''), daten} : null;
}

export function LernstandSicherung() {
  const [meldung, setMeldung] = useState('');
  const [geladen, setGeladen] = useState<Sicherung | null>(null);
  function sichern() {
    const daten: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(PREFIX)) daten[k] = localStorage.getItem(k) ?? ''; }
    const s: Sicherung = {app: 'MatheKompass', version: 1, datum: new Date().toISOString(), daten};
    const url = URL.createObjectURL(new Blob([JSON.stringify(s, null, 1)], {type: 'application/json'}));
    const a = document.createElement('a'); a.href = url; a.download = `MatheKompass-Lernstand-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMeldung(`Gesichert: ${Object.keys(daten).length} Speicherbereiche. Bewahre die Datei gut auf.`);
  }
  function laden(f: File | undefined) {
    if (!f) return;
    if (f.size > 5_000_000) { setMeldung('Die Datei ist zu groß für eine Lernstand-Sicherung.'); return; }
    f.text().then(t => {
      let s: Sicherung | null = null;
      try { s = pruefeSicherung(JSON.parse(t)); } catch { s = null; }
      if (!s) { setMeldung('Diese Datei ist keine gültige MatheKompass-Sicherung.'); setGeladen(null); return; }
      setGeladen(s); setMeldung('');
    });
  }
  function uebernehmen() {
    if (!geladen) return;
    try { for (const [k, v] of Object.entries(geladen.daten)) localStorage.setItem(k, v); } catch { setMeldung('Der Browser konnte die Sicherung nicht speichern.'); return; }
    location.reload();
  }
  return <section className="panel"><h2>Gesamten Lernstand sichern</h2>
    <p className="muted">Der Lernstand liegt nur in diesem Browser. Mit einer Sicherungsdatei kannst du ihn auf ein anderes Gerät mitnehmen oder nach dem Löschen des Browserspeichers wiederherstellen. Gesichert werden alle Bereiche: Module, Tests, Größen-Werkstatt, Lernpfade und Einstellungen.</p>
    <div className="exercise-actions"><button className="btn" onClick={sichern}>Gesamten Lernstand sichern</button><label className="btn ghost">Sicherung laden<input type="file" accept="application/json,.json" className="sr-only" onChange={e => { laden(e.target.files?.[0]); e.target.value = ''; }}/></label></div>
    {geladen && <div role="alert" className="hint">Sicherung vom {geladen.datum ? new Date(geladen.datum).toLocaleString('de-DE') : 'unbekannten Datum'} mit {Object.keys(geladen.daten).length} Speicherbereichen. Beim Laden werden die vorhandenen Daten dieser Bereiche ersetzt.<div className="exercise-actions"><button className="btn" onClick={uebernehmen}>Ja, Sicherung laden</button><button className="btn ghost" onClick={() => setGeladen(null)}>Abbrechen</button></div></div>}
    {meldung && <p role="status" className="muted">{meldung}</p>}
  </section>;
}

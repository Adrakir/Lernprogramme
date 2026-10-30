'use client';
// Größen-Werkstatt: Längen, Gewichte, Geld, Flächen und Volumen
// mit geführtem Lernpfad, Übungen auf drei Niveaus, Vertiefung, Tests und Hilfen.
import {useEffect, useMemo, useRef, useState} from 'react';
import {ArrowLeft, ArrowRight, BookOpen, Check, CircleCheck, CircleHelp, ClipboardCheck, Lightbulb, Printer, RotateCcw, Ruler, Scale, Coins, Square, Box, Target, Trophy, Compass, Sparkles} from 'lucide-react';
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs';
import {type Bereich, type Task, type Field, type Answers, type Level, bereichInfo, unit, checkTask, fieldComplete, answerText, coinLabel, inUnit, fmtNum} from '@/lib/groessen-core';
import {skillById, coreSkills, deepSkills, makeTask, makePractice, makeBereichTest, makeGesamttest, points, grade} from '@/lib/groessen-tasks';
import {content, uzVergleich, type Frage} from '@/lib/groessen-content';
import {TaskVisual, InteractiveModel, WalletPicker, Stairs} from './groessen-visuals';
import {Speak} from './widgets';
import './groessen.css';

export const bereiche: Bereich[] = ['laenge', 'masse', 'geld', 'flaeche', 'volumen'];
export const groessenRoutes = ['groessen', ...bereiche.map(b => 'g-' + b), 'g-test'];
export const groessenTitles: Record<string, string> = {groessen: 'Größen-Werkstatt', 'g-test': 'Größen · Gesamttest', ...Object.fromEntries(bereiche.map(b => ['g-' + b, 'Größen · ' + bereichInfo[b].short]))};
const icons: Record<Bereich, typeof Ruler> = {laenge: Ruler, masse: Scale, geld: Coins, flaeche: Square, volumen: Box};
const levelNames: Record<Level, string> = {1: 'Grundlagen', 2: 'Standard', 3: 'Knobeln'};

// ---------------------------------------------------------------------
// Speicher (eigener Schlüssel, bestehende Lernstände bleiben unberührt)
const STORE = 'mathe-kompass-groessen-v1';
type SkillStat = {tasks: number; solved: number; first: number};
type TestEntry = {scope: Bereich | 'gesamt'; points: number; max: number; date: string};
type Store = {stations: string[]; phases: Record<string, number>; stats: Record<string, SkillStat>; tests: TestEntry[]};
const emptyStore: Store = {stations: [], phases: {}, stats: {}, tests: []};

function useStore() {
  const [s, setS] = useState<Store>(emptyStore);
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) {
        const d = JSON.parse(raw);
        setS({stations: Array.isArray(d.stations) ? d.stations : [], phases: d.phases && typeof d.phases === 'object' ? d.phases : {}, stats: d.stats && typeof d.stats === 'object' ? d.stats : {}, tests: Array.isArray(d.tests) ? d.tests : []});
      }
    } catch { /* Speicher nicht verfügbar */ }
    loaded.current = true;
  }, []);
  useEffect(() => { if (loaded.current) try { localStorage.setItem(STORE, JSON.stringify(s)); } catch { /* ignorieren */ } }, [s]);
  return {
    s,
    stationDone: (skill: string) => setS(p => ({...p, stations: Array.from(new Set([...p.stations, skill]))})),
    setPhase: (skill: string, n: number) => setS(p => ({...p, phases: {...p.phases, [skill]: Math.max(p.phases[skill] ?? 0, n)}})),
    addStat: (skill: string, solved: boolean, first: boolean) => setS(p => {
      const o = p.stats[skill] ?? {tasks: 0, solved: 0, first: 0};
      return {...p, stats: {...p.stats, [skill]: {tasks: o.tasks + 1, solved: o.solved + (solved ? 1 : 0), first: o.first + (first ? 1 : 0)}}};
    }),
    addTest: (t: TestEntry) => setS(p => ({...p, tests: [...p.tests, t].slice(-60)})),
    reset: () => setS(emptyStore),
  };
}
type StoreApi = ReturnType<typeof useStore>;

const newSeed = () => Math.floor(Date.now() % 1_000_000 + Math.random() * 1000);

// ---------------------------------------------------------------------
// Eingabefelder
function FieldInput({f, task, value, onChange, disabled, result}: {f: Field; task: Task; value: Answers[string]; onChange: (v: Answers[string]) => void; disabled?: boolean; result?: {ok: boolean}}) {
  const id = `${task.id}-${f.id}`;
  const cls = result ? (result.ok ? ' gw-ok' : ' gw-bad') : '';
  if (f.kind === 'size' || f.kind === 'number') {
    const u = f.kind === 'size' ? unit(f.bereich, f.unit).label : f.suffix;
    return (
      <div className={'gw-field' + cls}>
        <label htmlFor={id}>{f.label ?? 'Deine Antwort'}</label>
        <div className="gw-input-line">
          <input id={id} inputMode="decimal" autoComplete="off" value={typeof value === 'string' ? value : ''} disabled={disabled} onChange={e => onChange(e.target.value)} placeholder="Zahl" aria-describedby="gw-format" />
          {u && <span className="gw-unit">{u}</span>}
        </div>
      </div>
    );
  }
  if (f.kind === 'choice') {
    return (
      <fieldset className={'gw-choice' + cls}>
        <legend>{f.label ?? 'Wähle die passende Antwort.'}</legend>
        {f.options.map((o, i) => (
          <label key={i} className={value === i ? 'selected' : ''}>
            <input type="radio" name={id} checked={value === i} disabled={disabled} onChange={() => onChange(i)} />
            <span>{o}</span>
          </label>
        ))}
      </fieldset>
    );
  }
  if (f.kind === 'order') {
    const seq = Array.isArray(value) ? value : [];
    return (
      <div className={'gw-order' + cls}>
        <p className="gw-field-label">{f.label ?? 'Tippe die Größen der Reihe nach an: von der kleinsten zur größten.'}</p>
        <div className="gw-order-items">
          {f.items.map((it, i) => {
            const pos = seq.indexOf(i);
            return <button type="button" key={i} disabled={disabled || pos >= 0} className={pos >= 0 ? 'picked' : ''} onClick={() => onChange([...seq, i])} aria-label={pos >= 0 ? `${it}, Platz ${pos + 1}` : `${it} als Nächstes wählen`}>{pos >= 0 && <b>{pos + 1}.</b>} {it}</button>;
          })}
        </div>
        <p className="gw-order-seq" aria-live="polite">Deine Reihenfolge: {seq.length ? seq.map(i => f.items[i]).join(' < ') : 'noch leer'}</p>
        {seq.length > 0 && !disabled && <button type="button" className="btn ghost small" onClick={() => onChange([])}><RotateCcw size={16} />Neu ordnen</button>}
      </div>
    );
  }
  const coins = Array.isArray(value) ? value : [];
  return (
    <div className={'gw-field' + cls}>
      <p className="gw-field-label">{f.label ?? `Lege ${inUnit(f.target, 'geld', 'eur')} €${f.fewest ? ' mit möglichst wenigen Münzen und Scheinen' : ''}.`}</p>
      {disabled ? <p>Gelegt: {coins.map(coinLabel).join(' + ') || 'nichts'}</p> : <WalletPicker value={coins} onChange={v => onChange(v)} idPrefix={id} />}
    </div>
  );
}

function studentText(f: Field, v: Answers[string]): string {
  if (v === undefined || v === '' || (Array.isArray(v) && !v.length)) return 'keine Antwort';
  if (f.kind === 'size') return `${v} ${unit(f.bereich, f.unit).label}`;
  if (f.kind === 'number') return `${v}${f.suffix ? ' ' + f.suffix : ''}`;
  if (f.kind === 'choice') return f.options[v as number];
  if (f.kind === 'order') return (v as number[]).map(i => f.items[i]).join(' < ');
  const c = v as number[];
  return `${c.map(coinLabel).join(' + ')} = ${inUnit(c.reduce((s, x) => s + x, 0), 'geld', 'eur')} €`;
}

const hasTextField = (t: Task) => t.fields.some(f => f.kind === 'size' || f.kind === 'number');

// ---------------------------------------------------------------------
// Eine Übungsaufgabe mit Hilfen, Rückmeldung und Musterlösung
type RunResult = {solved: boolean; first: boolean};
function TaskRunner({task, onDone, nextLabel = 'Nächste Aufgabe'}: {task: Task; onDone: (r: RunResult) => void; nextLabel?: string}) {
  const [a, setA] = useState<Answers>({});
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState(0);
  const [state, setState] = useState<'open' | 'solved' | 'shown'>('open');
  const [msg, setMsg] = useState<string[]>([]);
  const [res, setRes] = useState<{ok: boolean}[] | null>(null);
  const finished = state !== 'open';
  function check() {
    if (finished) return;
    if (!task.fields.every(f => fieldComplete(f, a))) { setMsg(['Bearbeite zuerst alle Teile der Aufgabe.']); return; }
    const r = checkTask(task, a);
    setRes(r.results);
    if (r.ok) {
      setState('solved');
      setMsg([tries || hint ? 'Richtig. Gut weitergedacht.' : 'Richtig. Genau so geht es.', ...r.results.map(x => x.message).filter((m): m is string => !!m && task.fields.some(f => f.kind === 'choice'))]);
    } else {
      setTries(tries + 1);
      const m = r.results.filter(x => !x.ok).map(x => x.message).filter((x): x is string => !!x);
      setMsg(m.length ? m : ['Das stimmt noch nicht. Prüfe deine Rechnung und die Einheit.']);
      if (tries >= 1 && hint === 0) setHint(1);
    }
  }
  function help() {
    if (hint < 3) setHint(hint + 1);
    else { setState('shown'); setMsg(['Schau dir den Lösungsweg in Ruhe an. Bei der nächsten Aufgabe probierst du es selbst.']); }
  }
  return (
    <div className="gw-task">
      <div className="gw-task-head"><span className="gw-level">{levelNames[task.level]}</span><span className="gw-skill">{skillById[task.skill].title}</span><Speak key={task.id} text={task.prompt} /></div>
      <h3 className="gw-prompt">{task.prompt}</h3>
      <TaskVisual v={task.visual} />
      <form onSubmit={e => { e.preventDefault(); check(); }}>
        <div className="gw-fields">{task.fields.map((f, i) => <FieldInput key={f.id} f={f} task={task} value={a[f.id]} disabled={finished} result={res?.[i]} onChange={v => { setA({...a, [f.id]: v}); setRes(null); }} />)}</div>
        {hasTextField(task) && <small id="gw-format" className="gw-small">Kommazahlen mit Komma, zum Beispiel 2,5. Große Zahlen auch mit Punkt, zum Beispiel 1.250.</small>}
        <div className="gw-actions">
          {finished ? <button type="button" className="btn" onClick={() => onDone({solved: state === 'solved', first: state === 'solved' && tries === 0 && hint === 0})}>{nextLabel}<ArrowRight size={18} /></button>
            : <button type="submit" className="btn">Antwort prüfen<Check size={18} /></button>}
          {!finished && <button type="button" className="btn ghost" onClick={help}><Lightbulb size={18} />{hint === 0 ? 'Tipp 1' : hint === 1 ? 'Tipp 2' : hint === 2 ? 'Tipp 3' : 'Lösungsweg zeigen'}</button>}
        </div>
      </form>
      {hint > 0 && <ol className="gw-hints" aria-label="Hilfen">{task.hints.slice(0, hint).map((h, i) => <li key={i}><b>Hilfe {i + 1}:</b> {h}</li>)}</ol>}
      {msg.length > 0 && <div role="status" className={'feedback ' + (state === 'solved' ? 'success' : 'hint')}>{state === 'solved' ? <CircleCheck size={22} /> : <CircleHelp size={22} />}<span>{msg.map((m, i) => <span key={i} className="gw-msg">{m}</span>)}</span></div>}
      {finished && <Solution task={task} />}
    </div>
  );
}

function Solution({task}: {task: Task}) {
  return <div className="gw-solution"><strong>Musterlösung</strong>{task.solution.map((s, i) => <p key={i}>{s}</p>)}<p className="gw-answer">Ergebnis: {task.fields.map(f => (f.label ? f.label + ': ' : '') + answerText(f)).join(' · ')}</p></div>;
}

// ---------------------------------------------------------------------
// Frage ohne Bewertung (Entdecken) oder mit Begründung
function Question({q, mustBeRight, onAnswered}: {q: Frage; mustBeRight?: boolean; onAnswered: () => void}) {
  const [pick, setPick] = useState<number | null>(null);
  const ok = pick === q.answer;
  return (
    <div className="gw-question">
      <fieldset className="gw-choice">
        <legend>{q.question}</legend>
        {q.options.map((o, i) => <label key={i} className={(pick === i ? 'selected ' : '') + (pick !== null && i === q.answer && (ok || !mustBeRight) ? 'right' : '')}><input type="radio" name={q.question} checked={pick === i} onChange={() => { setPick(i); if (i === q.answer || !mustBeRight) onAnswered(); }} /><span>{o}</span></label>)}
      </fieldset>
      {pick !== null && <div role="status" className={'feedback ' + (ok ? 'success' : 'hint')}>{ok ? <CircleCheck size={22} /> : <CircleHelp size={22} />}<span>{q.explain[pick]}{!ok && mustBeRight && ' Versuche es noch einmal.'}{!ok && !mustBeRight && ` Richtig ist: ${q.options[q.answer]}. ${q.explain[q.answer]}`}</span></div>}
    </div>
  );
}

function StepReveal({aufgabe, visual, schritte}: {aufgabe: string; visual?: Task['visual']; schritte: string[]}) {
  const [n, setN] = useState(0);
  return (
    <div className="gw-worked">
      <p className="gw-prompt">{aufgabe}</p>
      <TaskVisual v={visual} />
      <ol className="gw-steps">{schritte.slice(0, n).map((s, i) => <li key={i}>{s}</li>)}</ol>
      {n < schritte.length ? <button type="button" className="btn ghost" onClick={() => setN(n + 1)}>{n === 0 ? 'Ersten Schritt zeigen' : 'Nächsten Schritt zeigen'}<ArrowRight size={18} /></button> : <p className="success"><Check size={18} />Fertig. Überlege: Welcher Schritt war der wichtigste?</p>}
    </div>
  );
}

// ---------------------------------------------------------------------
// Lernpfad
const phaseNames = ['Entdecken', 'Verstehen', 'Gemeinsam lösen', 'Selbst versuchen', 'Begründen'];

function Station({b, idx, store, onNext, onClose}: {b: Bereich; idx: number; store: StoreApi; onNext: () => void; onClose: () => void}) {
  const st = content[b].stationen[idx];
  const [phase, setPhase] = useState(0);
  const [ready, setReady] = useState<boolean[]>([false, true, true, false, false]);
  const [taskIdx, setTaskIdx] = useState(0);
  const seed = useMemo(newSeed, [st.skill]);
  const tasks = useMemo(() => ([1, 2, 3] as Level[]).map(l => makeTask(st.skill, seed + l * 17, l)), [st.skill, seed]);
  const done = store.s.stations.includes(st.skill);
  const top = useRef<HTMLDivElement>(null);
  const goPhase = (p: number) => { setPhase(p); store.setPhase(st.skill, p); top.current?.scrollIntoView({block: 'start'}); };
  const mark = (p: number) => setReady(r => r.map((x, i) => (i === p ? true : x)));
  return (
    <section className="panel gw-station" ref={top} aria-labelledby="gw-station-title">
      <div className="gw-between">
        <button type="button" className="btn ghost small" onClick={onClose}><ArrowLeft size={16} />Alle Stationen</button>
        <span className="eyebrow">STATION {idx + 1} VON 5{done ? ' · ERLEDIGT' : ''}</span>
      </div>
      <h2 id="gw-station-title">{st.title}</h2>
      <p className="gw-goal"><Target size={18} />{skillById[st.skill].goal}</p>
      <nav className="gw-phases" aria-label="Phasen der Station">
        {phaseNames.map((n, i) => <button type="button" key={n} className={(i === phase ? 'active ' : '') + (i < phase ? 'done' : '')} aria-current={i === phase ? 'step' : undefined} onClick={() => goPhase(i)}><span>{i + 1}</span>{n}</button>)}
      </nav>
      <div className="gw-phase">
        {phase === 0 && <><h3>Entdecken</h3><p className="gw-small">Überlege zuerst selbst. Hier gibt es keine Punkte.</p><Question key={st.skill} q={st.entdecken} onAnswered={() => mark(0)} /></>}
        {phase === 1 && <><h3>Verstehen</h3>{st.verstehen.text.map((t, i) => <p key={i}>{t}</p>)}<div className="gw-merksatz"><b>Merksatz</b><p>{st.verstehen.merksatz}</p></div><div className="gw-model"><b>Ausprobieren</b><p className="gw-small">{st.verstehen.interactiveHint}</p><InteractiveModel kind={st.verstehen.interactive} bereich={b} /></div></>}
        {phase === 2 && <><h3>Gemeinsam lösen</h3><StepReveal {...st.beispiel} /></>}
        {phase === 3 && <><h3>Selbst versuchen</h3><p className="gw-small">Drei Aufgaben: Grundlagen, Standard und Knobeln. Hilfen kannst du jederzeit nutzen.</p>
          <div className="gw-mini-progress" aria-label={`Aufgabe ${Math.min(taskIdx + 1, 3)} von 3`}>{tasks.map((_, i) => <span key={i} className={i < taskIdx ? 'done' : i === taskIdx ? 'active' : ''} />)}</div>
          {taskIdx < 3 ? <TaskRunner key={tasks[taskIdx].id} task={tasks[taskIdx]} nextLabel={taskIdx < 2 ? 'Nächste Aufgabe' : 'Abschließen'} onDone={r => { store.addStat(st.skill, r.solved, r.first); if (taskIdx === 2) mark(3); setTaskIdx(taskIdx + 1); }} />
            : <p className="success"><CircleCheck size={20} />Alle drei Aufgaben bearbeitet. Weiter zum Begründen.</p>}</>}
        {phase === 4 && <><h3>Begründen</h3><p className="gw-small">Finde die richtige Begründung. Du kannst es so oft probieren, wie du möchtest.</p><Question key={st.skill + 'b'} q={st.begruenden} mustBeRight onAnswered={() => { mark(4); store.stationDone(st.skill); }} /></>}
      </div>
      <div className="gw-actions gw-phase-nav">
        <button type="button" className="btn ghost" disabled={phase === 0} onClick={() => goPhase(phase - 1)}><ArrowLeft size={18} />Zurück</button>
        {phase < 4 ? <button type="button" className="btn" disabled={!ready[phase]} onClick={() => goPhase(phase + 1)}>Weiter: {phaseNames[phase + 1]}<ArrowRight size={18} /></button>
          : <button type="button" className="btn" disabled={!ready[4]} onClick={onNext}>{idx < 4 ? 'Nächste Station' : 'Lernpfad abschließen'}<ArrowRight size={18} /></button>}
      </div>
      {!ready[phase] && <p className="gw-small gw-center">{phase === 0 ? 'Wähle eine Antwort, dann geht es weiter.' : phase === 3 ? 'Bearbeite die drei Aufgaben, dann geht es weiter.' : 'Finde die richtige Begründung, dann ist die Station geschafft.'}</p>}
    </section>
  );
}

function Lernpfad({b, store, onTab}: {b: Bereich; store: StoreApi; onTab: (t: string) => void}) {
  const c = content[b];
  const [open, setOpen] = useState<number | null>(null);
  const doneCount = c.stationen.filter(s => store.s.stations.includes(s.skill)).length;
  if (open !== null) return <Station key={open} b={b} idx={open} store={store} onClose={() => setOpen(null)} onNext={() => setOpen(open < 4 ? open + 1 : null)} />;
  const nextIdx = c.stationen.findIndex(s => !store.s.stations.includes(s.skill));
  return (
    <div>
      <section className="panel gw-intro">
        <p>{c.intro}</p>
        <div className="gw-progressbar" role="progressbar" aria-valuemin={0} aria-valuemax={5} aria-valuenow={doneCount} aria-label="Stationen geschafft"><span style={{width: doneCount / 5 * 100 + '%'}} /></div>
        <p className="gw-small">{doneCount} von 5 Stationen geschafft. Jede Station hat fünf Phasen: Entdecken, Verstehen, Gemeinsam lösen, Selbst versuchen und Begründen.</p>
        {nextIdx >= 0 ? <button type="button" className="btn" onClick={() => setOpen(nextIdx)}>{doneCount ? 'Weiterlernen' : 'Lernpfad starten'}: {c.stationen[nextIdx].title}<ArrowRight size={18} /></button>
          : <div className="success"><Trophy size={20} /><span>Lernpfad geschafft. Prüfe dein Können im Test oder vertiefe dein Wissen.</span><button type="button" className="btn small" onClick={() => onTab('test')}>Zum Test</button></div>}
      </section>
      <ol className="gw-path">
        {c.stationen.map((s, i) => {
          const done = store.s.stations.includes(s.skill);
          return <li key={s.skill} className={done ? 'done' : i === nextIdx ? 'next' : ''}>
            <button type="button" onClick={() => setOpen(i)}>
              <span className="gw-path-num">{done ? <Check size={18} /> : i + 1}</span>
              <span><strong>{s.title}</strong><small>{skillById[s.skill].goal}</small></span>
              <ArrowRight size={18} />
            </button>
          </li>;
        })}
      </ol>
    </div>
  );
}

// ---------------------------------------------------------------------
// Üben
function Practice({b, store, fixedSkill}: {b: Bereich; store: StoreApi; fixedSkill?: string}) {
  const [skill, setSkill] = useState<string>(fixedSkill ?? 'mix');
  const [level, setLevel] = useState<Level>(fixedSkill ? 1 : 2);
  const [run, setRun] = useState<{tasks: Task[]; i: number; results: RunResult[]} | null>(null);
  const opts = [...(fixedSkill ? [] : [['mix', 'Gemischt: alle Stationen'] as [string, string]]), ...(fixedSkill ? [skillById[fixedSkill]] : [...coreSkills(b), ...deepSkills(b)]).map(s => [s.id, s.title] as [string, string])];
  function start() { setRun({tasks: makePractice(b, skill, level, newSeed()), i: 0, results: []}); }
  if (run && run.i < run.tasks.length) {
    const t = run.tasks[run.i];
    return (
      <section className="panel">
        <div className="gw-between"><span className="eyebrow">AUFGABE {run.i + 1} VON {run.tasks.length} · {levelNames[level].toUpperCase()}</span><button type="button" className="btn ghost small" onClick={() => setRun(null)}>Runde beenden</button></div>
        <div className="gw-mini-progress">{run.tasks.map((_, i) => <span key={i} className={i < run.i ? (run.results[i]?.solved ? 'done' : 'shown') : i === run.i ? 'active' : ''} />)}</div>
        <TaskRunner key={t.id} task={t} nextLabel={run.i + 1 < run.tasks.length ? 'Nächste Aufgabe' : 'Runde auswerten'} onDone={r => { store.addStat(t.skill, r.solved, r.first); setRun({...run, i: run.i + 1, results: [...run.results, r]}); }} />
      </section>
    );
  }
  const solved = run?.results.filter(r => r.solved).length ?? 0, first = run?.results.filter(r => r.first).length ?? 0;
  return (
    <section className="panel gw-practice-setup">
      {run ? <>
        <span className="eyebrow">RUNDE GESCHAFFT</span>
        <h2>{solved} von {run.tasks.length} Aufgaben selbst gelöst.</h2>
        <div className="gw-stats"><div><strong>{first}</strong><span>sofort ohne Hilfe</span></div><div><strong>{solved - first}</strong><span>mit Hilfe oder zweitem Versuch</span></div><div><strong>{run.tasks.length - solved}</strong><span>Lösungsweg angesehen</span></div></div>
        <p>{first >= 5 ? (level < 3 ? `Stark. Probiere jetzt das Niveau „${levelNames[(level + 1) as Level]}“.` : 'Hervorragend. Du kannst den Test versuchen.') : solved >= 4 ? 'Gut. Übe noch eine Runde auf diesem Niveau, bis du ohne Hilfe auskommst.' : level > 1 ? `Wechsle zum Niveau „${levelNames[(level - 1) as Level]}“ oder schau dir die passende Station im Lernpfad noch einmal an.` : 'Schau dir die passende Station im Lernpfad noch einmal an und nutze die Hilfen.'}</p>
        <details className="gw-review-details"><summary>Aufgaben und Musterlösungen ansehen</summary>{run.tasks.map((t, i) => <div key={t.id} className="gw-review-row"><b>{i + 1}. {t.prompt}</b>{t.solution.map((s, k) => <p key={k}>{s}</p>)}</div>)}</details>
      </> : <><span className="eyebrow">ÜBEN</span><h2>Wähle Thema und Niveau.</h2><p>Eine Runde hat 6 Aufgaben mit neuen Zahlen. Zu jeder Aufgabe gibt es drei gestufte Hilfen, gezielte Rückmeldungen zu typischen Fehlern und eine Musterlösung.</p></>}
      <div className="gw-setup">
        <label>Thema<select value={skill} onChange={e => setSkill(e.target.value)} disabled={!!fixedSkill}>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
        <fieldset className="gw-levels"><legend>Niveau</legend>{([1, 2, 3] as Level[]).map(l => <label key={l} className={level === l ? 'selected' : ''}><input type="radio" name={'lvl-' + b + (fixedSkill ?? '')} checked={level === l} onChange={() => setLevel(l)} /><span><b>{levelNames[l]}</b><small>{l === 1 ? 'sicher starten' : l === 2 ? 'wie in der Klassenarbeit' : 'weiterdenken'}</small></span></label>)}</fieldset>
      </div>
      <button type="button" className="btn" onClick={start}>{run ? 'Neue Runde' : 'Runde starten'}<ArrowRight size={18} /></button>
      <SkillTable skills={fixedSkill ? [fixedSkill] : [...coreSkills(b), ...deepSkills(b)].map(s => s.id)} store={store} />
    </section>
  );
}

function SkillTable({skills, store}: {skills: string[]; store: StoreApi}) {
  const rows = skills.filter(s => store.s.stats[s]?.tasks);
  if (!rows.length) return null;
  return (
    <div className="gw-table-wrap"><table className="gw-table"><caption>Dein Übungsstand auf diesem Gerät</caption><thead><tr><th scope="col">Thema</th><th scope="col">Aufgaben</th><th scope="col">gelöst</th><th scope="col">sofort richtig</th></tr></thead>
      <tbody>{rows.map(s => { const x = store.s.stats[s]; return <tr key={s}><th scope="row">{skillById[s].title}</th><td>{x.tasks}</td><td>{x.solved}</td><td>{Math.round(x.first / x.tasks * 100)} %</td></tr>; })}</tbody></table></div>
  );
}

// ---------------------------------------------------------------------
// Vertiefung
function Vertiefung({b, store}: {b: Bereich; store: StoreApi}) {
  const v = content[b].vertiefung;
  return (
    <>
      <section className="panel">
        <span className="eyebrow">VERTIEFUNG</span>
        <h2>{v.title}</h2>
        <p className="gw-goal"><Target size={18} />{skillById[v.skill].goal}</p>
        {v.text.map((t, i) => <p key={i}>{t}</p>)}
        <div className="gw-merksatz"><b>Merksatz</b><p>{v.merksatz}</p></div>
        <h3>Beispiel</h3>
        <StepReveal {...v.beispiel} />
      </section>
      <Practice b={b} store={store} fixedSkill={v.skill} />
    </>
  );
}

// ---------------------------------------------------------------------
// Test
function TestRunner({scope, make, store, onLearn}: {scope: Bereich | 'gesamt'; make: (seed: number) => Task[]; store: StoreApi; onLearn?: (skill: string) => void}) {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [ans, setAns] = useState<Answers[]>([]);
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const [warn, setWarn] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const max = tasks?.reduce((s, t) => s + points(t), 0) ?? 0;
  const results = useMemo(() => (tasks && done ? tasks.map((t, j) => checkTask(t, ans[j] ?? {})) : []), [tasks, ans, done]);
  const got = results.reduce((s, r, j) => s + (r.ok ? points(tasks![j]) : 0), 0);
  const complete = (j: number) => !!tasks && tasks[j].fields.every(f => fieldComplete(f, ans[j] ?? {}));
  function start() { const t = make(newSeed()); setTasks(t); setAns(t.map(() => ({}))); setI(0); setDone(false); setWarn(false); }
  function submit(force = false) {
    if (!tasks) return;
    if (!force && tasks.some((_, j) => !complete(j))) { setWarn(true); return; }
    setDone(true);
    const r = tasks.map((t, j) => checkTask(t, ans[j] ?? {}));
    store.addTest({scope, points: r.reduce((s, x, j) => s + (x.ok ? points(tasks[j]) : 0), 0), max: tasks.reduce((s, t) => s + points(t), 0), date: new Date().toISOString()});
    top.current?.scrollIntoView({block: 'start'});
  }
  const last = store.s.tests.filter(t => t.scope === scope).slice(-3).reverse();
  if (!tasks) return (
    <section className="panel gw-test-start">
      <span className="eyebrow">TEST</span>
      <h2>{scope === 'gesamt' ? 'Gesamttest: alle Größenbereiche' : `Test: ${bereichInfo[scope].title}`}</h2>
      <p>{scope === 'gesamt' ? '15 Aufgaben aus Längen, Gewichten, Geld, Flächen und Volumen.' : '12 Aufgaben zu allen fünf Stationen.'} Ohne Hilfen, ohne Zeitlimit. Grundlagen-Aufgaben zählen 1 Punkt, Standard 2 Punkte, Knobeln 3 Punkte. Am Ende siehst du alle Musterlösungen und Empfehlungen, was du üben kannst.</p>
      <ul className="gw-facts"><li><Check size={16} />jederzeit zurückspringen und Antworten ändern</li><li><Check size={16} />bei jedem Start neue Aufgaben</li><li><Check size={16} />Auswertung mit Orientierungsnote</li></ul>
      <button type="button" className="btn" onClick={start}>Test starten<ArrowRight size={18} /></button>
      {last.length > 0 && <p className="gw-small">Deine letzten Ergebnisse: {last.map(t => `${t.points}/${t.max} Punkte (${new Date(t.date).toLocaleDateString('de-DE')})`).join(' · ')}</p>}
    </section>
  );
  if (done) {
    const pct = max ? got / max * 100 : 0, g = grade(pct);
    const bySkill = new Map<string, {got: number; max: number}>();
    tasks.forEach((t, j) => { const o = bySkill.get(t.skill) ?? {got: 0, max: 0}; o.max += points(t); if (results[j].ok) o.got += points(t); bySkill.set(t.skill, o); });
    const weak = [...bySkill.entries()].filter(([, v]) => v.got < v.max);
    return (
      <div ref={top}>
        <section className="panel gw-result">
          <span className="eyebrow">AUSWERTUNG</span>
          <div className="gw-result-score"><strong>{got} / {max}</strong><span>Punkte · {Math.round(pct)} %</span></div>
          <p>Orientierungsnote: <b>{g.note} ({g.text})</b>. Die Note dient nur zur Orientierung und ersetzt keine Bewertung durch die Lehrkraft.</p>
          <h3>Deine Themen</h3>
          <div className="gw-table-wrap"><table className="gw-table"><thead><tr><th scope="col">Thema</th><th scope="col">Punkte</th><th scope="col">Empfehlung</th></tr></thead>
            <tbody>{[...bySkill.entries()].map(([s, v]) => <tr key={s}><th scope="row">{skillById[s].title}</th><td>{v.got} / {v.max}</td><td>{v.got === v.max ? 'sicher' : v.got === 0 ? <>Station im Lernpfad wiederholen{onLearn && skillById[s].bereich && <> · <button type="button" className="gw-link" onClick={() => onLearn(s)}>öffnen</button></>}</> : 'auf Niveau Standard üben'}</td></tr>)}</tbody></table></div>
          {weak.length === 0 ? <p className="success"><Trophy size={18} />Alles richtig. Versuche die Knobelaufgaben im Üben oder die Vertiefung.</p> : <p className="hint">Tipp: Übe zuerst die Themen mit wenigen Punkten. Die Rückmeldungen beim Üben zeigen dir typische Fehler.</p>}
          <div className="gw-actions"><button type="button" className="btn" onClick={start}>Neuer Test<RotateCcw size={18} /></button><button type="button" className="btn ghost no-print" onClick={() => window.print()}><Printer size={18} />Auswertung drucken</button></div>
        </section>
        <div className="gw-review">
          {tasks.map((t, j) => (
            <article key={t.id} className={'panel gw-review-card ' + (results[j].ok ? 'ok' : 'bad')}>
              <div className="gw-between"><b>Aufgabe {j + 1} · {skillById[t.skill].title}</b><span className={'gw-tag ' + (results[j].ok ? 'ok' : 'bad')}>{results[j].ok ? `${points(t)} von ${points(t)} P.` : `0 von ${points(t)} P.`}</span></div>
              <p>{t.prompt}</p>
              <TaskVisual v={t.visual} />
              {t.fields.map((f, k) => <p key={f.id}>Deine Antwort{f.label ? ` (${f.label})` : ''}: <b>{studentText(f, ans[j]?.[f.id])}</b>{!results[j].results[k].ok && results[j].results[k].message && fieldComplete(f, ans[j] ?? {}) && <span className="gw-why"> {results[j].results[k].message}</span>}</p>)}
              <Solution task={t} />
            </article>
          ))}
        </div>
      </div>
    );
  }
  const t = tasks[i];
  return (
    <section className="panel gw-test" ref={top}>
      <nav className="gw-test-nav" aria-label="Aufgaben im Test">{tasks.map((_, j) => <button type="button" key={j} className={(j === i ? 'active ' : '') + (complete(j) ? 'answered' : '')} aria-current={j === i ? 'step' : undefined} aria-label={`Aufgabe ${j + 1}${complete(j) ? ', beantwortet' : ''}`} onClick={() => { setI(j); setWarn(false); }}>{j + 1}</button>)}</nav>
      <div className="gw-task">
        <div className="gw-task-head"><span className="gw-level">{levelNames[t.level]} · {points(t)} {points(t) === 1 ? 'Punkt' : 'Punkte'}</span><Speak key={t.id} text={t.prompt} /></div>
        <h3 className="gw-prompt">Aufgabe {i + 1}: {t.prompt}</h3>
        <TaskVisual v={t.visual} />
        <div className="gw-fields">{t.fields.map(f => <FieldInput key={f.id} f={f} task={t} value={ans[i]?.[f.id]} onChange={v => setAns(ans.map((x, j) => (j === i ? {...x, [f.id]: v} : x)))} />)}</div>
        {hasTextField(t) && <small id="gw-format" className="gw-small">Kommazahlen mit Komma, zum Beispiel 2,5.</small>}
      </div>
      <div className="gw-actions gw-phase-nav">
        <button type="button" className="btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}><ArrowLeft size={18} />Zurück</button>
        {i < tasks.length - 1 ? <button type="button" className="btn" onClick={() => setI(i + 1)}>Weiter<ArrowRight size={18} /></button> : <button type="button" className="btn" onClick={() => submit()}>Test abgeben<Check size={18} /></button>}
      </div>
      {warn && <div className="hint" role="alert">Noch nicht alle Aufgaben sind beantwortet ({tasks.filter((_, j) => !complete(j)).length} offen). Über die Nummern kannst du zurückspringen. <button type="button" className="btn ghost small" onClick={() => submit(true)}>Trotzdem abgeben</button></div>}
    </section>
  );
}

// ---------------------------------------------------------------------
// Hilfen und Merkwissen
function Hilfen({b}: {b: Bereich}) {
  const m = content[b].merkwissen;
  return (
    <div className="gw-help-grid">
      <section className="panel"><h2>Einheitentreppe</h2><Stairs bereich={b} /><p className="gw-small">Umrechnungszahl: {bereichInfo[b].uz}.</p></section>
      <section className="panel"><h2>Merksätze</h2><ul className="gw-list">{m.merksaetze.map(x => <li key={x}>{x}</li>)}</ul></section>
      <section className="panel"><h2>Stützpunkte</h2><div className="gw-table-wrap"><table className="gw-table"><tbody>{m.stuetzpunkte.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody></table></div></section>
      <section className="panel"><h2>Typische Fehler</h2><ul className="gw-errors">{m.fehler.map(f => <li key={f.fehler}><span className="bad">Falsch: {f.fehler}</span><span className="ok">Richtig: {f.richtig}</span></li>)}</ul></section>
      <section className="panel"><h2>So gehst du bei Sachaufgaben vor</h2><ol className="gw-list">{m.strategie.map(x => <li key={x}>{x}</li>)}</ol></section>
      <section className="panel"><h2>Umrechnungszahlen im Vergleich</h2><UzTable /></section>
    </div>
  );
}

function UzTable() {
  return <div className="gw-table-wrap"><table className="gw-table"><thead><tr><th scope="col">Größe</th><th scope="col">Umrechnungszahl</th><th scope="col">Beispiel</th></tr></thead><tbody>{uzVergleich.map(r => <tr key={r[0]}><th scope="row">{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody></table></div>;
}

// ---------------------------------------------------------------------
// Seiten
function BereichView({b, store, go}: {b: Bereich; store: StoreApi; go: (r: string) => void}) {
  const [tab, setTab] = useState('path');
  const [pathKey, setPathKey] = useState(0);
  const Icon = icons[b];
  const info = bereichInfo[b];
  return (
    <>
      <div className="page-title"><div><span className="eyebrow">GRÖSSEN-WERKSTATT · {info.grade.toUpperCase()}</span><h1>{info.title}</h1><p>{content[b].ziele.join(' · ')}</p></div><span className={'page-module-icon ' + info.color}><Icon size={29} /></span></div>
      <button type="button" className="btn ghost small gw-back" onClick={() => go('groessen')}><ArrowLeft size={16} />Alle Größenbereiche</button>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="learning-tabs gw-tabs">
          <TabsTrigger value="path"><Compass size={17} />Lernpfad</TabsTrigger>
          <TabsTrigger value="practice"><Target size={17} />Üben</TabsTrigger>
          <TabsTrigger value="deep"><Sparkles size={17} />Vertiefung</TabsTrigger>
          <TabsTrigger value="test"><ClipboardCheck size={17} />Test</TabsTrigger>
          <TabsTrigger value="help"><BookOpen size={17} />Hilfen</TabsTrigger>
        </TabsList>
        <TabsContent value="path"><Lernpfad key={pathKey} b={b} store={store} onTab={setTab} /></TabsContent>
        <TabsContent value="practice"><Practice b={b} store={store} /></TabsContent>
        <TabsContent value="deep"><Vertiefung b={b} store={store} /></TabsContent>
        <TabsContent value="test"><TestRunner scope={b} make={seed => makeBereichTest(b, seed)} store={store} onLearn={() => { setPathKey(pathKey + 1); setTab('path'); }} /></TabsContent>
        <TabsContent value="help"><Hilfen b={b} /></TabsContent>
      </Tabs>
    </>
  );
}

function Hub({store, go}: {store: StoreApi; go: (r: string) => void}) {
  return (
    <>
      <div className="page-title"><div><span className="eyebrow">GRÖSSEN-WERKSTATT · KLASSE 5/6</span><h1>Messen, umrechnen, rechnen.</h1><p>Längen, Gewichte, Geld, Flächen und Volumen mit Lernpfad, Übungen, Tests und Hilfen.</p></div><span className="page-module-icon teal"><Ruler size={29} /></span></div>
      <section className="panel gw-hub-intro">
        <h2>So arbeitest du in der Werkstatt</h2>
        <ol className="gw-how"><li><b>Lernpfad</b><span>Fünf Stationen je Bereich: entdecken, verstehen, gemeinsam lösen, selbst versuchen, begründen.</span></li><li><b>Üben</b><span>Runden mit 6 Aufgaben auf drei Niveaus, mit gestuften Hilfen und Musterlösungen.</span></li><li><b>Vertiefung</b><span>Maßstab, Preise vergleichen, Überschlag, Flächen im Alltag, Oberfläche.</span></li><li><b>Test</b><span>Ohne Hilfen, mit Auswertung und Empfehlungen.</span></li></ol>
      </section>
      <div className="gw-hub-grid">
        {bereiche.map(b => {
          const Icon = icons[b], info = bereichInfo[b];
          const done = content[b].stationen.filter(s => store.s.stations.includes(s.skill)).length;
          const last = store.s.tests.filter(t => t.scope === b).slice(-1)[0];
          return (
            <button type="button" key={b} className={'module-card gw-hub-card ' + info.color} onClick={() => go('g-' + b)}>
              <span className="module-icon"><Icon size={26} /></span>
              <h3>{info.title}</h3>
              <p>{content[b].ziele.slice(0, 3).join(' · ')}</p>
              <div className="gw-progressbar" aria-hidden="true"><span style={{width: done / 5 * 100 + '%'}} /></div>
              <div className="card-bottom"><span>{done}/5 Stationen{last ? ` · Test: ${last.points}/${last.max} P.` : ''}</span><ArrowRight size={18} /></div>
            </button>
          );
        })}
        <button type="button" className="module-card gw-hub-card yellow" onClick={() => go('g-test')}>
          <span className="module-icon"><ClipboardCheck size={26} /></span>
          <h3>Gesamttest</h3>
          <p>15 Aufgaben aus allen fünf Bereichen. Ideal vor einer Klassenarbeit.</p>
          <div className="card-bottom"><span>{store.s.tests.filter(t => t.scope === 'gesamt').length} Mal bearbeitet</span><ArrowRight size={18} /></div>
        </button>
      </div>
      <section className="panel"><h2>Umrechnungszahlen im Vergleich</h2><p>Bei Längen geht jede Stufe mal 10, bei Flächen mal 100 (10 · 10) und bei Volumen mal 1000 (10 · 10 · 10).</p><UzTable /></section>
      <section className="panel gw-reset"><h2>Lernstand der Werkstatt</h2><p className="gw-small">{store.s.stations.length} Stationen geschafft · {Object.values(store.s.stats).reduce((s, x) => s + x.tasks, 0)} Übungsaufgaben bearbeitet · {store.s.tests.length} Tests. Der Lernstand wird nur auf diesem Gerät gespeichert.</p>
        <button type="button" className="btn ghost small" onClick={() => { if (window.confirm('Lernstand der Größen-Werkstatt wirklich löschen? Andere Lernstände bleiben erhalten.')) store.reset(); }}><RotateCcw size={16} />Werkstatt-Lernstand zurücksetzen</button></section>
    </>
  );
}

export function GroessenWerkstatt({route, go}: {route: string; go: (r: string) => void}) {
  const store = useStore();
  if (route === 'g-test') return (
    <>
      <div className="page-title"><div><span className="eyebrow">GRÖSSEN-WERKSTATT · GESAMTTEST</span><h1>Alle Größen im Test.</h1><p>Längen · Gewichte · Geld · Flächen · Volumen</p></div><span className="page-module-icon yellow"><ClipboardCheck size={29} /></span></div>
      <button type="button" className="btn ghost small gw-back" onClick={() => go('groessen')}><ArrowLeft size={16} />Alle Größenbereiche</button>
      <TestRunner scope="gesamt" make={makeGesamttest} store={store} onLearn={s => go('g-' + skillById[s].bereich)} />
    </>
  );
  const b = bereiche.find(x => route === 'g-' + x);
  if (b) return <BereichView key={b} b={b} store={store} go={go} />;
  return <Hub store={store} go={go} />;
}


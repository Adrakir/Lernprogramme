'use client';
import {useEffect,useState} from 'react';
import type {Problem,Topic} from '@/lib/math';
import {correct,isComplete} from '@/lib/math';
import {guidedProblem,learningGoals,lessonInquiry,specificFeedback} from '@/lib/guidance';
import {Chart,Tally,PlaceTable} from './widgets';
import {ExtraVisual} from './extended-widgets';
import {Shape,WrittenWork,MarthaGuide} from './curriculum-visuals';
import {TopicLab} from './topic-labs';
import './guided-learning.css';

export function GuidedVisual({p}:{p:Problem}){
 return <>{p.shape&&<Shape shape={p.shape}/ >}{p.work&&<WrittenWork key={p.id} work={p.work}/>}
 {p.type==='tally'&&p.n!==undefined&&<Tally n={p.n}/>}
 {p.type==='place'&&p.n!==undefined&&<PlaceTable n={p.n}/>}
 {p.values&&p.labels&&<Chart values={p.values} labels={p.labels} scale={p.scale??1} unit={p.unit}/>}
 <ExtraVisual p={p}/></>;
}

export function GuidedQuestion({p,assisted=false}:{p:Problem;assisted?:boolean}){
 const [answer,setAnswer]=useState(''),[message,setMessage]=useState(''),[hints,setHints]=useState(0),[shown,setShown]=useState(false),[done,setDone]=useState(false);
 const fields=p.fields??['Ergebnis'];
 function check(){if(!isComplete(p,answer)){setMessage('Fülle zuerst alle Felder aus. Bei Dezimalzahlen bitte das Komma verwenden.');return;}const ok=correct(p,answer);setDone(ok);setMessage(specificFeedback(p,answer));}
 return <section className="guided-question"><h3>{assisted?'Gemeinsam lösen':'Jetzt selbst versuchen'}: {p.title}</h3><p>{p.prompt}</p>{p.expression&&<p className="math-expression">{p.expression}</p>}<GuidedVisual p={p}/>
 <form onSubmit={e=>{e.preventDefault();check();}}>{p.type==='choice'?<fieldset><legend>Wähle deine Antwort</legend>{p.options?.map(v=><label key={v} className="guided-option"><input type="radio" name={p.id} value={v} checked={answer===v} onChange={()=>{setAnswer(v);setDone(false);setMessage('');}}/>{v}</label>)}</fieldset>:<div className="guided-fields">{fields.map((f,i)=><label key={f}>{f}{p.unit?` (${p.unit})`:''}<input aria-label={f} inputMode={p.decimal?'decimal':'numeric'} value={p.fields?(answer.split('|')[i]??''):answer} onChange={e=>{if(p.fields){const values=fields.map((_,j)=>answer.split('|')[j]??'');values[i]=e.target.value;setAnswer(values.join('|'));}else setAnswer(e.target.value);setDone(false);setMessage('');}}/></label>)}</div>}
 <div className="guided-actions"><button className="btn" type="submit">Schritt prüfen</button><button className="btn ghost" type="button" disabled={hints>=p.hints.length||done} onClick={()=>setHints(hints+1)}>Nächste Hilfe</button><button type="button" className="btn ghost" onClick={()=>setShown(true)}>Lösungsweg ansehen</button></div></form>
 {message&&<p role="status" className={done?'feedback success':'feedback hint'}>{message}</p>}{(assisted||hints>0)&&p.hints.slice(0,Math.max(assisted?1:0,hints)).map((h,i)=><p className="hint" key={i}>Marthas Hilfe {i+1}: {h}</p>)}
 {(shown||done)&&<div className="solution"><ol>{p.solution.map((s,i)=><li key={i}>{s}</li>)}</ol><p>{shown?'Mit Musterlösung gearbeitet: Das ist Übung, kein Nachweis für selbstständiges Können.':'Erkläre: Welche Regel hat dir geholfen? Prüfe dein Können anschließend im Tagestraining.'}</p></div>}
 </section>;
}

export function GuidedLesson({topic,step,phase}:{topic:Topic;step:number;phase:number}){
 const inquiry=lessonInquiry(topic,step);
 const [compare,setCompare]=useState(false);
 return <>{phase===0&&<section className="guided-discovery"><h3>Erst vermuten, dann ausprobieren</h3><p>{inquiry.question}</p><label>Meine Vermutung<textarea rows={2} placeholder="Erzähle oder notiere, was du denkst."/></label><button className="btn ghost" onClick={()=>setCompare(true)}>Vermutung vergleichen</button>{compare&&<MarthaGuide message={inquiry.explanation}/>}<p>Beobachte beim Modell: Was ändert sich? Was bleibt gleich?</p><TopicLab topic={topic} step={step}/></section>}
 {phase===2&&<GuidedQuestion key={`${topic}-${step}-together`} p={guidedProblem(topic,step,0)} assisted/>}
 {phase===3&&<GuidedQuestion key={`${topic}-${step}-solo`} p={guidedProblem(topic,step,1)}/>}
 {phase===4&&<section><h3>Erklären und anwenden</h3><p>Erkläre einem anderen Kind die Regel aus diesem Lernschritt. Zeige ein Beispiel und beschreibe einen Fehler, den man dabei vermeiden sollte.</p><label>Meine Begründung<textarea rows={3} placeholder="Ich erkenne … / Ich rechne zuerst … / Ich prüfe mit …"/></label><details><summary>So prüfst du deine Erklärung</summary><ul><li>Ich nenne die passende Regel und erkläre, warum sie hilft.</li><li>Mein Beispiel passt zur Regel und hat richtige Einheiten.</li><li>Ich prüfe das Ergebnis mit einem Bild, einer Umkehraufgabe oder einem Überschlag.</li></ul><p>Offene Begründungen werden nicht automatisch benotet. Vergleiche sie selbst oder besprecht sie im Unterricht.</p></details></section>}</>;
}

export function TeachingTools({topic,step}:{topic:Topic;step:number}){
 const [projector,setProjector]=useState(false),[worksheet,setWorksheet]=useState(false),[solutions,setSolutions]=useState(false);
 return <div className={projector?'teaching-tools projector-on':'teaching-tools'}><div className="guided-actions no-print"><button className="btn ghost" aria-pressed={projector} onClick={()=>setProjector(!projector)}>Unterrichtsansicht: {projector?'an':'aus'}</button><button className="btn ghost" onClick={()=>setWorksheet(!worksheet)}>Arbeitsblatt {worksheet?'schließen':'öffnen'}</button></div>
 {worksheet&&<section className="guided-worksheet"><h2>MatheKompass · Arbeitsblatt</h2><p>{learningGoals[topic].goal}</p><p>Name: ____________________ Datum: ______________</p>{Array.from({length:4},(_,i)=>{const p=guidedProblem(topic,step,i+2);return <article key={p.id}><h3>{i+1}. {p.title}</h3><p>{p.prompt} {p.expression}</p><GuidedVisual p={p}/>{p.type==='choice'&&<ul>{p.options?.map(v=><li key={v}>☐ {v}</li>)}</ul>}<p>Rechenweg und Antwort{p.unit?` (${p.unit})`:''}: __________________________________</p><div className="writing-space"/></article>;})}<article><h3>5. Begründen</h3><p>{lessonInquiry(topic,step).question} Begründe mit einem Beispiel.</p><div className="writing-space"/></article>
 <div className="no-print guided-actions"><label><input type="checkbox" checked={solutions} onChange={e=>setSolutions(e.target.checked)}/>Separates Lösungsblatt hinzufügen</label><button className="btn" onClick={()=>window.print()}>Arbeitsblatt drucken / PDF speichern</button></div>
 {solutions&&<section className="worksheet-solutions"><h2>Lösungen · separat aufbewahren</h2>{Array.from({length:4},(_,i)=>{const p=guidedProblem(topic,step,i+2);return <div key={p.id}><h3>{i+1}. {p.title}</h3><ol>{p.solution.map((s,j)=><li key={j}>{s}</li>)}</ol></div>;})}<h3>5. Musterbegründung</h3><p>{lessonInquiry(topic,step).explanation}</p></section>}</section>}</div>;
}

const ORDER:Topic[]=['data','numbers','round','line','units','stats','arithmetic','divisibility','geometry','measure','fractions','decimals'];
const TITLES:Partial<Record<Topic,string>>={data:'Daten & Diagramme',numbers:'Große Zahlen',round:'Runden & Schätzen',line:'Zahlenstrahl',units:'Größen & Einheiten',stats:'Daten auswerten',arithmetic:'Schriftlich rechnen',divisibility:'Teilbarkeit',geometry:'Geometrie',measure:'Flächen & Körper',fractions:'Brüche',decimals:'Dezimalzahlen'};
type Vorschlag={kind:'start'|'repeat'|'next'|'done';topic:Topic};
export function TodayGuide(){
 const [v,setV]=useState<Vorschlag>({kind:'start',topic:'data'});
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem('mathe-kompass-v1')||'null');const records=Array.isArray(saved?.records)?saved.records:[];const lessons:string[]=Array.isArray(saved?.lessons)?saved.lessons:[];
  const recent=records.slice(-20).findLast((r:{topic?:string;first?:boolean})=>r.first===false&&r.topic&&r.topic in learningGoals);
  if(recent){setV({kind:'repeat',topic:recent.topic});return;}
  const open=ORDER.find(t=>!lessons.includes(t));
  if(!open){setV({kind:'done',topic:'data'});return;}
  setV({kind:records.length||lessons.length?'next':'start',topic:open});
 }catch(error){console.error('MatheKompass: Tagesempfehlung konnte nicht geladen werden.',error);}},[]);
 const name=TITLES[v.topic]??v.topic;
 if(v.kind==='done')return <section className="panel today-guide"><h2>Alle Lernmodule durchgearbeitet</h2><p>Du hast alle Verstehen-Lernwege abgeschlossen. Jetzt festigst du dein Wissen: Schreibe in jedem Modul den Modultest oder nutze die Klassenarbeiten.</p><div className="guided-actions"><a className="btn" href="#learning">Lernstand prüfen und passend üben</a><a className="btn ghost" href="#exams">Klassenarbeiten öffnen</a></div></section>;
 const head=v.kind==='start'?'Willkommen. So startest du':v.kind==='repeat'?'Dein nächster Lernschritt: wiederholen':'Dein nächster Lernschritt';
 const text=v.kind==='start'?<>Beginne mit Modul 01 <strong>{name}</strong>. Dort lernst du Schritt für Schritt, wie man Daten sammelt, zählt und in Diagrammen darstellt. Jedes Modul hat fünf Bereiche: Verstehen, Üben, Vertiefung, Test und Hilfen.</>:v.kind==='repeat'?<>Bei <strong>{name}</strong> warst du zuletzt noch unsicher. Wiederhole den Lernweg oder schau in die Hilfen. Danach geht es leichter.</>:<>Als Nächstes ist <strong>{name}</strong> dran. {learningGoals[v.topic].goal}</>;
 return <section className="panel today-guide"><h2>{head}</h2><p>{text}</p><p>Entdecken → verstehen → gemeinsam lösen → selbst versuchen → begründen. Du bestimmst das Tempo, ohne Zeitdruck.</p><div className="guided-actions"><a className="btn" href={'#'+v.topic}>{v.kind==='start'?'Mit Modul 01 beginnen':'Lernweg öffnen'}</a><a className="btn ghost" href="#learning">Lernstand prüfen und passend üben</a></div><small>{v.kind==='repeat'?'Der Vorschlag greift unsichere Aufgaben auf. ':''}Alle Themen bleiben frei wählbar.</small></section>;
}

import {useState} from 'react';
import {berlinDay} from '@/lib/learning';
import {lernbelege,notieren,familienhilfe,fachZu,faecher,themen,blattaufgabe,type Beleg,type Fach} from '@/lib/lernatelier';
import {plainNumber} from '@/lib/groessen-core';
import {LernstandSicherung} from './module-extras';
function lesen(key:string){try{return JSON.parse(localStorage.getItem(key)??'null');}catch{return null;}}
const planKey='mathe-kompass-familienplan-v1';
type Plan={beginn:string;termin:string;themen:Fach[];erledigt:string[]};
function planLesen():Plan|null{const p=lesen(planKey);return p&&Array.isArray(p.themen)&&p.themen.length&&p.themen.every((f:Fach)=>faecher.includes(f))&&typeof p.termin==='string'&&typeof p.beginn==='string'&&Array.isArray(p.erledigt)?p:null;}
function Tagesplan(){
 const heute=berlinDay(),[plan,planen]=useState(planLesen),[datum,datieren]=useState(plan?.termin??heute),[wahl,waehlen]=useState<Fach[]>(plan?.themen??['zeit','division']),[antwort,setzen]=useState(''),[meld,melden]=useState(''),[bearbeiten,oeffnen]=useState(!plan),[speicher,fehler]=useState('');
 function speichern(p:Plan){planen(p);try{localStorage.setItem(planKey,JSON.stringify(p));}catch{fehler('Der Plan kann auf diesem Gerät nicht dauerhaft gespeichert werden.');}}
 const tag=Math.max(0,Math.round((Date.parse(heute)-Date.parse(plan?.beginn??heute))/86400000));
 const tage=plan?Math.max(1,1+Math.round((Date.parse(plan.termin)-Date.parse(plan.beginn))/86400000)):1;
 const tagesziele=plan?(plan.themen.length<=tage?[plan.themen[tag%plan.themen.length]]:plan.themen.filter((_,i)=>i%tage===tag%tage)):['zeit' as Fach];
 const t=tagesziele.find(f=>!plan?.erledigt.includes(heute+'-'+f))??tagesziele[0],a=blattaufgabe(t,Date.parse(heute)/86400000+tag*7919,tag);
 return <section className="panel"><h2>Bis zur Klassenarbeit üben</h2>{bearbeiten?<><label>Datum der Arbeit<input type="date" value={datum} min={heute} onChange={e=>datieren(e.target.value)}/></label><fieldset><legend>Welche Themen kommen dran?</legend>{faecher.map(f=><label key={f}><span><input type="checkbox" checked={wahl.includes(f)} onChange={e=>waehlen(e.target.checked?[...wahl,f]:wahl.filter(v=>v!==f))}/> {themen[f]}</span></label>)}</fieldset><button className="btn" disabled={!wahl.length||!datum||datum<heute} onClick={()=>{speichern({beginn:heute,termin:datum,themen:wahl,erledigt:[]});oeffnen(false);setzen('');melden('');}}>Tagesplan erstellen</button></>:plan&&<><p>Bis {plan.termin.split('-').reverse().join('.')} · {plan.themen.map(f=>themen[f]).join(', ')}. Die gewählten Themen wechseln sich ab. Heute: {tagesziele.map(f=>themen[f]).join(', ')}.</p>{heute>plan.termin?<p>Die Vorbereitungszeit ist abgeschlossen.</p>:(plan.erledigt.includes(heute)||tagesziele.every(f=>plan.erledigt.includes(heute+'-'+f)))?<p role="status"><strong>Für heute fertig.</strong></p>:<><h3>Heute: {themen[t]}</h3><p>{a.text}</p><label>Ergebnis {a.einheit&&'in '+a.einheit}<input inputMode="numeric" value={antwort} onChange={e=>setzen(e.target.value)}/></label><button className="btn" disabled={!antwort.trim()} onClick={()=>{const ok=plainNumber(antwort)===a.antwort;notieren(themen[t],a.text,ok?(meld?'hilfe':'selbst'):'offen',true);if(ok){speichern({...plan,erledigt:[...plan.erledigt,heute+'-'+t]});melden('');setzen('');}else melden('Prüfe noch einmal: '+familienhilfe[t][0]);}}>Tagesaufgabe prüfen</button>{meld&&<p role="status">{meld}</p>}</>}<button className="btn ghost" onClick={()=>oeffnen(true)}>Plan anpassen</button></>}{speicher&&<p role="status">{speicher}</p>}</section>;
}
export function Familie(){
 const grenze=Date.parse(berlinDay()+'T00:00:00Z')-6*86400000;
 const list=lernbelege().filter(b=>Date.parse(berlinDay(new Date(b.tag))+'T00:00:00Z')>=grenze),bedarf=list.find(b=>b.status!=='selbst'&&!list.slice(0,list.indexOf(b)).some(neu=>neu.ziel===b.ziel&&neu.status==='selbst'));
 const [f,setF]=useState<Fach>(fachZu((bedarf?.ziel??'')+' '+(bedarf?.aufgabe??'')));
 const [frage,uebung,loesung]=familienhilfe[f];
 function beispiel(b:Beleg|undefined){return b?<><b>{b.ziel}</b> · {b.aufgabe}{b.wiederholung?' (Wiederholung)':''}{b.hinweise?' · Hilfe genutzt':b.ersterVersuch&&b.status==='selbst'?' · im ersten Versuch':''}</>:'Hier liegt für die letzten sieben Tage noch kein passender Aufgabenbeleg vor.';}
 return <div className="ad-school"><h1>Gemeinsam zu Hause lernen</h1><section className="panel"><h2>Die letzten sieben Tage</h2><h3>Das klappt selbstständig</h3><p>{beispiel(list.find(b=>b.status==='selbst'))}</p><h3>Hier half ein Hinweis oder ein weiterer Versuch</h3><p>{beispiel(list.find(b=>b.status==='hilfe'))}</p><h3>Das üben wir als Nächstes</h3><p>{bedarf?beispiel(bedarf):list.length?'Wählt eine neue Aufgabe zum zuletzt geübten Thema.':'Nach einer Übungsrunde erscheint hier eine Empfehlung.'}</p></section>
 <section className="panel"><h2>Fünf Minuten gemeinsam üben</h2><label>Thema<select value={f} onChange={e=>setF(e.target.value as Fach)}>{faecher.map(id=><option key={id} value={id}>{themen[id]}</option>)}</select></label><h3>Eine Frage zum Weiterdenken</h3><p>{frage}</p><h3>Im Alltag ausprobieren</h3><p>{uebung}</p><details key={f}><summary>Kontrolllösung</summary><p>{loesung}</p></details></section><Tagesplan/><LernstandSicherung/></div>;
}

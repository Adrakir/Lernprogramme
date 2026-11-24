import {useState} from 'react';
import {raster,type Antworten} from '@/lib/division';
import {plainNumber} from '@/lib/groessen-core';
import {belege,notieren} from '@/lib/lernatelier';
import {Aufgabenfelder} from './divisionsuebungen';

const beispiel=raster(4,0,[2816,4]);
const ziel='Division · Stellenwert im Quotienten';
const zahlen=[2412,2848,3216,2584,3624,3348];

export function Divisionsstand(){
 const eintraege=belege().filter(b=>b.ziel===ziel||b.ziel==='Division · Null im Quotienten').reverse();
 if(!eintraege.length)return null;
 return <section className="panel"><h2>Mein Rechenweg bei der Division</h2><ul>{eintraege.slice(0,6).map((b,i)=><li key={i}>{b.aufgabe} · {b.status==='hilfe'?'mit Hilfe gelöst':b.wiederholung?'neue Aufgabe allein gelöst':'allein gelöst'}</li>)}</ul></section>;
}

export function Divisionstafel(){
 const [schritt,setSchritt]=useState(0);
 const texte=['Beginne mit 28. Wie oft passt die 4 hinein?', '28 : 4 = 7. Rest 0. Welche Ziffer holst du jetzt herunter?', 'Hole die 1 herunter. Wie oft passt 4 in 1?', '1 : 4 ergibt 0 Rest 1. Die 0 besetzt die Zehnerstelle. Welche Ziffer kommt als Nächstes?', 'Hole die 6 herunter. Aus Rest 1 und der 6 wird 16. Wie oft passt 4 hinein?', '16 : 4 = 4. Rest 0. Die Probe lautet 704 · 4 = 2816.'];
 return <details className="panel"><summary>Division an der Tafel aufdecken</summary><div role="status" aria-live="polite" aria-atomic="true"><p style={{fontSize:'2rem'}}>{schritt<2?'28□□':schritt<4?'281□':'2816'} : 4 = {schritt===0?'□□□':schritt<3?'7□□':schritt<5?'70□':'704'}</p><p>{texte[schritt]}</p></div><button className="btn ghost" disabled={!schritt} onClick={()=>setSchritt(schritt-1)}>Schritt zurück</button> <button className="btn" disabled={schritt===5} onClick={()=>setSchritt(schritt+1)}>Nächsten Schritt aufdecken</button></details>;
}
export function Divisionshilfe(){
 const [eingabe,setEingabe]=useState(''),[phase,start]=useState<number|null>(null);
 const [werte,schreiben]=useState<Antworten>({}),[probe,setProbe]=useState(false);
 const [antwort,setAntwort]=useState(''),[meldung,melde]=useState(''),[fertig,ende]=useState(false),[hilfe,hatHilfe]=useState(false);
 const [denkschritt,frage]=useState(false),[nr,wechsel]=useState(0);
 const zahl=zahlen[nr];
 function beginnen(n:number){
   frage(false);
   const vorbereitet:Antworten={};
   for(const schritt of beispiel.schritte.slice(0,n)) for(const feld of schritt.felder)vorbereitet[feld.key]=String(feld.wert);
   schreiben(vorbereitet);start(n);
 }
 function auswerten(){
   const n=plainNumber(eingabe);
   if(n===null||!Number.isInteger(n)){melde('Trage eine ganze Zahl ein oder wähle den gemeinsamen Start.');return;}
   melde('');if(n===704){notieren(ziel,'2816 : 4','selbst');setProbe(true);return;}
   if(n===74){frage(true);return;}
   beginnen(n>=700&&n<710?2:0);
 }
 return <div className="ad-school"><h1>Hilfe beim Dividieren</h1><section className="panel">
 {denkschritt?<><h2 tabIndex={-1} ref={el=>el?.focus()}>Was hast du mit der heruntergeholten 1 gemacht?</h2>
 <p>Erinnere dich an deinen Rechenweg.</p>{[['Ich habe ohne Zehnerziffer weitergerechnet.',1],['Ich habe die Null notiert. Bei 16 : 4 bin ich unsicher.',2],['Ich möchte es von vorn zeigen.',0]].map(([text,n])=><button key={text} className="btn ghost" onClick={()=>beginnen(Number(n))}>{text}</button>)}</>:
 phase===null&&!probe?<><h2>Was bekommst du bei 2816 : 4 heraus?</h2><form onSubmit={e=>{e.preventDefault();auswerten();}}><label>Mein Ergebnis<input inputMode="numeric" value={eingabe} onChange={e=>setEingabe(e.target.value)}/></label><button className="btn" disabled={!eingabe.trim()}>Meinen Rechenweg prüfen</button></form>
 <button className="btn ghost" onClick={()=>{melde('');beginnen(0);}}>Ich weiß nicht, wie ich anfangen soll</button></>:
 !probe&&phase!==null?<><h2>{['Gemeinsam links beginnen','Schau auf die Zehnerstelle','Schau auf die letzte Teilrechnung'][phase]}</h2>
 <p>{['Beginne mit 28. Wie oft passen 4 hinein?','Der erste Schritt ist vorgerechnet. Hole die 1 herunter: Welche Ziffer braucht der Quotient an dieser Stelle?','Die ersten beiden Schritte sind vorgerechnet. Hole die 6 herunter und berechne die letzte Teilzahl.'][phase]}</p>
 <Aufgabenfelder a={beispiel} w={werte} set={(k,v)=>schreiben(w=>({...w,[k]:v}))} test={false} startphase={phase} geschafft={()=>notieren(ziel,'2816 : 4','hilfe',false,false,true)} nachAbschluss={<button className="btn" onClick={()=>setProbe(true)}>Neue Aufgabe allein versuchen</button>}/></>:
 <><h2>{nr===0&&phase===null?'704 stimmt. Probiere eine neue Aufgabe.':'Jetzt selbst versuchen'}</h2><form onSubmit={e=>{
 e.preventDefault();if(fertig)return;
 if(plainNumber(antwort)===zahl/4){
   notieren(ziel,zahl+' : 4',hilfe?'hilfe':'selbst',true,!hilfe,hilfe);ende(true);
   melde('Richtig. Die Probe ist '+zahl/4+' · 4 = '+zahl+'.');
 }else{
   hatHilfe(true);melde('Prüfe die Zehnerstelle. Teile zuerst '+String(zahl).slice(0,2)+' durch 4. Hole dann die '+String(zahl)[2]+' herunter und beachte deinen Rest.');
 }}}>
 <label>{zahl} : 4 = <input key={nr} autoFocus inputMode="numeric" value={antwort} disabled={fertig} onChange={e=>setAntwort(e.target.value)}/></label><button className="btn" disabled={!antwort.trim()||fertig}>Ergebnis prüfen</button></form>
 {fertig&&nr+1<zahlen.length&&<button className="btn" onClick={()=>{wechsel(nr+1);setAntwort('');ende(false);hatHilfe(false);melde('');}}>Weitere Aufgabe versuchen</button>}
 {fertig&&nr+1===zahlen.length&&<p>Alle sechs Aufgaben bearbeitet.</p>}</>}
 <p role="status">{meldung}</p></section><a className="btn ghost" href="#division">Zur Divisionswerkstatt</a> <a className="btn ghost" href="#progress">Meinen Lernstand ansehen</a></div>;
}

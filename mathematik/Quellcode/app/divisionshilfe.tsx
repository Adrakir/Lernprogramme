import {useState} from 'react';
import {raster,type Antworten} from '@/lib/division';
import {plainNumber} from '@/lib/groessen-core';
import {notieren} from '@/lib/lernatelier';
import {Aufgabenfelder} from './divisionsuebungen';

const beispiel=raster(4,0,[2816,4]);
export function Divisionshilfe(){
 const [eingabe,setEingabe]=useState(''),[phase,start]=useState<number|null>(null);
 const [werte,schreiben]=useState<Antworten>({}),[probe,setProbe]=useState(false);
 const [antwort,setAntwort]=useState(''),[meldung,melde]=useState(''),[fertig,ende]=useState(false),[hilfe,hatHilfe]=useState(false);
 function beginnen(n:number){
   const vorbereitet:Antworten={};
   for(const schritt of beispiel.schritte.slice(0,n)) for(const feld of schritt.felder)vorbereitet[feld.key]=String(feld.wert);
   schreiben(vorbereitet);start(n);
 }
 function auswerten(){
   const n=plainNumber(eingabe);
   if(n===null||!Number.isInteger(n)){melde('Trage eine ganze Zahl ein oder wähle den gemeinsamen Start.');return;}
   melde('');if(n===704){setProbe(true);return;}
   beginnen(n===74?1:n>=700&&n<710?2:0);
 }
 return <div className="ad-school"><h1>Hilfe beim Dividieren</h1><section className="panel">
 {phase===null&&!probe?<><h2>Was bekommst du bei 2816 : 4 heraus?</h2><form onSubmit={e=>{e.preventDefault();auswerten();}}><label>Mein Ergebnis<input inputMode="numeric" value={eingabe} onChange={e=>setEingabe(e.target.value)}/></label><button className="btn" disabled={!eingabe.trim()}>Meinen Rechenweg prüfen</button></form>
 <button className="btn ghost" onClick={()=>{melde('');beginnen(0);}}>Ich weiß nicht, wie ich anfangen soll</button></>:
 !probe&&phase!==null?<><h2>{['Gemeinsam links beginnen','Schau auf die Zehnerstelle','Schau auf die letzte Teilrechnung'][phase]}</h2>
 <p>{['Beginne mit 28. Wie oft passen 4 hinein?','Der erste Schritt ist vorgerechnet. Hole die 1 herunter: Welche Ziffer braucht der Quotient an dieser Stelle?','Die ersten beiden Schritte sind vorgerechnet. Hole die 6 herunter und berechne die letzte Teilzahl.'][phase]}</p>
 <Aufgabenfelder a={beispiel} w={werte} set={(k,v)=>schreiben(w=>({...w,[k]:v}))} test={false} startphase={phase} nachAbschluss={<button className="btn" onClick={()=>setProbe(true)}>Neue Aufgabe allein versuchen</button>}/></>:
 <><h2>{phase===null?'704 stimmt. Probiere eine neue Aufgabe.':'Jetzt selbst versuchen'}</h2><form onSubmit={e=>{e.preventDefault();if(fertig)return;const ok=plainNumber(antwort)===603;
 if(ok){notieren('Division · Null im Quotienten','2412 : 4',hilfe?'hilfe':'selbst',true,!hilfe,hilfe);ende(true);}else hatHilfe(true);
 melde(ok?'Richtig. Die Probe ist 603 · 4 = 2412.':'Prüfe jede Quotientenziffer. Nach 24 : 4 kommt die 1 herunter.');}}>
 <label>2412 : 4 = <input inputMode="numeric" value={antwort} disabled={fertig} onChange={e=>setAntwort(e.target.value)}/></label><button className="btn" disabled={!antwort.trim()||fertig}>Ergebnis prüfen</button></form></>}
 <p role="status">{meldung}</p></section><a className="btn ghost" href="#division">Zur Divisionswerkstatt</a></div>;
}

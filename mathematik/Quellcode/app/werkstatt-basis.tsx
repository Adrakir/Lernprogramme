import {useState,type KeyboardEvent} from 'react';
import {standLesen,type Arbeit} from '@/lib/werkstattstand';
import {Speak} from './widgets';
export function AufgabenNavigation({i,n,weiter}:{i:number;n:number;weiter:(j:number)=>void}){return <nav aria-label="Aufgabe auswählen" className="ad-actions">{Array.from({length:n},(_,j)=><button className={'btn small '+(j===i?'':'ghost')} aria-current={j===i?'step':undefined} key={j} onClick={()=>weiter(j)}>{j+1}</button>)}</nav>;}
export function ArbeitAktionen({i,n,weiter,abgeben,hinweis}:{i:number;n:number;weiter:(j:number)=>void;abgeben:()=>void;hinweis:string}){return <><div className="ad-actions">{i>0&&<button className="btn ghost" onClick={()=>weiter(i-1)}>Zurück</button>}{i<n-1?<button className="btn" onClick={()=>weiter(i+1)}>Weiter</button>:<button className="btn" onClick={abgeben}>{hinweis?'Endgültig abgeben':'Arbeit abgeben'}</button>}</div>{hinweis&&<p role="status">{hinweis}</p>}</>;}
export function NaechstesFeld(e:KeyboardEvent<HTMLInputElement>){
 if(e.key!=='Enter')return;const table=e.currentTarget.closest('table');if(!table)return;
 const inputs=Array.from(table.querySelectorAll<HTMLInputElement>('input:not(:disabled)')),i=inputs.indexOf(e.currentTarget);e.preventDefault();
 const next=inputs[i+1]??table.parentElement?.parentElement?.querySelector<HTMLButtonElement>('button.btn:not(:disabled)');next?.focus();next?.scrollIntoView?.({block:'nearest',inline:'nearest'});
}
const begriffe:Record<string,[string,string][]>={
 Addition:[['Summand','Eine Zahl, die du dazuzählst.'],['Übertrag','Zehn Einheiten einer Spalte werden zu einer Einheit links daneben.']],
 Subtraktion:[['Minuend','Die obere Zahl, von der du abziehst.'],['Differenz','Was nach dem Abziehen übrig bleibt.']],
 Multiplikation:[['Faktor','Eine der Zahlen, die du miteinander multiplizierst.'],['Teilprodukt','Das Produkt mit einem einzelnen Stellenwert des zweiten Faktors.']],
 Division:[['Divisor','Die Zahl, durch die du teilst.'],['Quotient','Das Ergebnis der Division. Bei einer Division mit Rest liest du den ganzen Quotienten aus den Ergebnisziffern.']]
};
export function Aufgabenhilfe({fach,frage,zahlen=[],tipp,beiHilfe}:{fach:string;frage:string;zahlen?:number[];tipp?:string;beiHilfe?:()=>void}){
 const [offen,set]=useState(''),[x,y]=zahlen;
 const beispiel:Record<string,string|number|undefined>={Summand:x,Minuend:x,Differenz:x!==undefined&&y!==undefined?x-y:undefined,Faktor:y,Divisor:y,Quotient:x!==undefined&&y?Math.floor(x/y):undefined,Teilprodukt:x!==undefined&&y!==undefined?x*(y%10):undefined,Übertrag:x!==undefined&&y!==undefined?Math.floor(zahlen.reduce((s,n)=>s+n%10,0)/10):undefined};
 return <details className="ad-lab"><summary>Vorlesen und Begriffe</summary><p>Aufgabe <Speak text={frage}/></p>{tipp&&<p onClick={beiHilfe}>Hinweis <Speak text={tipp}/></p>}<div className="ad-actions">{[...begriffe[fach],['Überschlag','Rechne mit passenden runden Zahlen, um die Größenordnung zu prüfen.']].map(([b,d])=><button className="btn ghost small" key={b} aria-pressed={offen===d} onClick={()=>{beiHilfe?.();set(offen===d?'':d)}}>{b}</button>)}</div>{offen&&<p role="status">{offen} {begriffe[fach].filter(([,d])=>offen===d).map(([b])=>beispiel[b]!==undefined?<span key={b}>In dieser Rechnung: <mark>{b} {beispiel[b]}</mark>.</span>:null)}</p>}</details>;
}
export function Kriterien({ziel}:{ziel:string}){
 const k=ziel==='geschichte'?['Ich nenne die gesuchte Größe und ihre Einheit.','Ich erkläre, was das Ergebnis in der Geschichte bedeutet.','Bei einem Rest erkläre ich, was mit ihm passiert, falls einer vorkommt.']:['Ich benenne den gewählten Rechenweg.','Ich erkläre an den Zahlen, warum der Weg passt.','Mein Ergebnis passt zu meinen Zwischenschritten.'];
 return <details><summary>Meine Begründung selbst prüfen</summary>{k.map(v=><label key={v}><span><input type="checkbox"/> {v}</span></label>)}</details>;
}

export function useWerkstattstand<Z extends string>(key:string,gueltig:(s:unknown)=>s is Z){
 const [stand,setStand]=useState(()=>{try{return standLesen(localStorage.getItem(key),gueltig);}catch{return {ziele:[] as Z[],arbeit:undefined as Arbeit|undefined};}});
 const [speicherFehler,fehler]=useState(false);
 function sichern(s:{ziele:Z[];arbeit?:Arbeit}){setStand(s);try{localStorage.setItem(key,JSON.stringify(s));fehler(false);}catch{fehler(true);}}
 return {stand,sichern,speicherFehler};
}
export function offenerVersuch(anzahl:number,hinweis:string,melden:(s:string)=>void){
 if(!anzahl||hinweis)return false;
 melden(anzahl+' Aufgaben sind noch offen oder unvollständig. Du kannst zurückgehen oder jetzt endgültig abgeben.');return true;
}

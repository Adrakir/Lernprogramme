import {useRef,useState} from 'react';
import {plainNumber} from '@/lib/groessen-core';
import {notieren} from '@/lib/lernatelier';

export function Zahl({frage,wert,weg,tipp='Prüfe die gegebenen Zahlen und die gesuchte Größe.',einheit='',lernbeleg,beiRichtig}:{frage:string;wert:number;weg:string;tipp?:string;einheit?:string;lernbeleg?:{ziel:string;aufgabe:string;mitHilfe:boolean};beiRichtig?:()=>void}){
 const [eingabe,set]=useState(''),[meldung,melde]=useState(''),[fertig,ende]=useState(false);
 const versuche=useRef(0);
 return <form onSubmit={e=>{e.preventDefault();if(fertig||plainNumber(eingabe)===null)return;
  versuche.current++;const ok=plainNumber(eingabe)===wert;melde(ok?'Richtig. '+weg:tipp);
  if(ok){ende(true);notieren(lernbeleg?.ziel??'Mathe-Atelier',lernbeleg?.aufgabe??frage,versuche.current===1&&!lernbeleg?.mitHilfe?'selbst':'hilfe',false,versuche.current===1,versuche.current>1||!!lernbeleg?.mitHilfe);beiRichtig?.();}}}>
 <label>{frage} {einheit&&'('+einheit+')'}<input inputMode="decimal" value={eingabe} disabled={fertig} onChange={e=>{set(e.target.value);melde('');}}/></label>
 <button className="btn" disabled={fertig||plainNumber(eingabe)===null}>Antwort prüfen</button><p role="status">{meldung}</p></form>;
}
export function Wahl({frage,optionen,richtig,weg,tipp,weiter}:{frage:string;optionen:string[];richtig:number;weg:string;tipp:string;weiter?:()=>void}){
 const [meldung,melde]=useState(''),[fertig,set]=useState(false);
 return <fieldset><legend>{frage}</legend><div className="ad-actions">{optionen.map((v,i)=><button key={v} className="btn ghost" disabled={fertig} onClick={()=>{const ok=i===richtig;melde(ok?weg:tipp);if(ok){set(true);weiter?.();}}}>{v}</button>)}</div><p role="status">{meldung}</p></fieldset>;
}
export function Begruenden({frage,beispiel}:{frage:string;beispiel:string}){
 const [text,set]=useState('');
 return <><label>{frage}<textarea value={text} onChange={e=>set(e.target.value)}/></label>{text.trim()&&<details><summary>Mit einer Beispielbegründung vergleichen</summary><p>{beispiel}</p></details>}</>;
}
export function Regler({name,min=0,max,wert,set,anzeige}:{name:string;min?:number;max:number;wert:number;set:(n:number)=>void;anzeige?:string}){
 return <label>{name}: {anzeige??wert}<input type="range" min={min} max={max} value={wert} aria-label={name} aria-valuetext={anzeige??String(wert)} onChange={e=>set(+e.target.value)}/></label>;
}

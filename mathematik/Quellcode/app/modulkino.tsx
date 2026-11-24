'use client';
import {useState} from 'react';
import type {Topic} from '@/lib/math';
import {RechenKino,type Rechenart} from './rechenkino';
import {GroessenKino} from './groessenkino';
import './themenkino.css';

const base:Record<string,{titel:string;frage:string;regel:string;fehler:string;max:number;min:number;step:number}> = {
 data:{titel:'Baue dein eigenes Säulendiagramm',frage:'Wie viele Kinder fahren mit dem Rad? Die Säule wächst mit dem eingestellten Wert.',regel:'Bei Säulendiagrammen beginnen die Säulen an der Null. Beachte die Schrittweite.',fehler:'Vergleiche nicht nur die Säulenhöhe, sondern die Zahlenachse.',min:1,max:12,step:1},
 stats:{titel:'Daten vergleichen',frage:'Verändere eine Häufigkeit und beobachte, wie sich das Diagramm verändert.',regel:'Die Gesamtzahl ist die Summe aller Häufigkeiten.',fehler:'Die größte Säule zeigt die häufigste Antwort, nicht automatisch die Hälfte.',min:1,max:12,step:1},
 numbers:{titel:'Ein Zahlenschloss aus Stellenwerten',frage:'Verändere die Hunderter und sieh, welchen Wert jede Ziffer besitzt.',regel:'Eine Ziffer links ist immer zehnmal so viel wert wie die gleiche Ziffer rechts.',fehler:'Die Zahl 423 besteht aus 4 Hundertern, 2 Zehnern und 3 Einern.',min:1,max:9,step:1},
 round:{titel:'Wohin wird gerundet?',frage:'Ziehe die Zahl auf dem Zahlenstrahl und beobachte ihren nächsten Zehner.',regel:'Bei 0 bis 4 wird abgerundet; bei 5 bis 9 wird aufgerundet.',fehler:'Runde direkt auf die verlangte Stelle, nicht mehrmals nacheinander.',min:0,max:100,step:1},
 line:{titel:'Deine Zahl auf dem Zahlenstrahl',frage:'Bewege den Punkt und lies seine Position ab.',regel:'Gleiche Abstände bedeuten gleich große Zahlenschritte.',fehler:'Vergleiche die Zahlen an den Markierungen, bevor du einen Punkt setzt.',min:0,max:100,step:1},
 mental:{titel:'Punkt vor Strich als Bild',frage:'Verändere den Faktor und beachte, welche Rechnung zuerst dran ist.',regel:'Zuerst Multiplikation oder Division, danach Addition oder Subtraktion – außer Klammern verändern die Reihenfolge.',fehler:'18 + 6 · 4 ist nicht (18 + 6) · 4.',min:1,max:9,step:1},
 divisibility:{titel:'Kann man gleich große Dreiergruppen bilden?',frage:'Verschiebe die Anzahl der Punkte. Bleibt beim Aufteilen durch 3 ein Rest?',regel:'Eine Zahl ist durch 3 teilbar, wenn ihre Quersumme durch 3 teilbar ist.',fehler:'Ein Rest von 1 oder 2 bedeutet: nicht ohne Rest durch 3 teilbar.',min:1,max:30,step:1},
 geometry:{titel:'Das Rechteck verändert sich',frage:'Vergrößere die Länge. Was passiert mit dem Umfang und der Fläche?',regel:'Umfang: 2 · Länge + 2 · Breite. Fläche: Länge · Breite.',fehler:'Umfang wird in cm, Fläche in cm² angegeben.',min:2,max:9,step:1},
 angles:{titel:'Drehe einen Winkel',frage:'Öffne den Winkel und beobachte, wann er spitz, recht oder stumpf ist.',regel:'Ein rechter Winkel hat 90°. Spitz: kleiner 90°. Stumpf: größer 90° und kleiner 180°.',fehler:'Die Länge der Schenkel bestimmt nicht die Größe des Winkels.',min:5,max:175,step:5},
 symmetry:{titel:'Spiegle eine Figur',frage:'Verändere den Abstand der Figur von der Spiegelachse. Die Spiegelung wandert gleich weit mit.',regel:'Bildpunkt und Ausgangspunkt liegen gleich weit von der Spiegelachse entfernt.',fehler:'Beim Spiegeln wird nicht gedreht: linke und rechte Seite tauschen ihre Lage.',min:2,max:9,step:1},
 solids:{titel:'Ein Würfel aus Schichten',frage:'Stelle die Kantenlänge ein. Wie viele Kubikzentimeter passen hinein?',regel:'Ein Würfel mit Kantenlänge a hat das Volumen a · a · a.',fehler:'Verdoppelt sich die Kante, verachtfacht sich das Volumen.',min:1,max:5,step:1},
 fractions:{titel:'Brüche als gefärbter Streifen',frage:'Wie viele der acht gleich großen Teile sind markiert?',regel:'Nenner = Anzahl gleich großer Teile. Zähler = markierte Teile.',fehler:'Ein größerer Nenner bedeutet bei gleichem Zähler kleinere Teile.',min:0,max:8,step:1},
 decimals:{titel:'Zehntel werden sichtbar',frage:'Färbe Zehntel und lies die Dezimalzahl.',regel:'1/10 = 0,1. Zehn Zehntel ergeben 1 Ganzes.',fehler:'0,5 bedeutet fünf Zehntel, nicht fünf Hundertstel.',min:0,max:10,step:1},
};
type TopicModel=keyof typeof base;
function isModel(topic:Topic):topic is Topic&TopicModel{return topic in base}
const times=(count:number)=>Array.from({length:count},(_,i)=>i);
function Diagram({topic,v}:{topic:TopicModel;v:number}){
 if(topic==='data'||topic==='stats'){
  let ys=[v,7,4];return <svg viewBox="0 0 410 230" role="img" aria-label={`Diagramm: Rad ${v}, Bus 7, Fuß 4 Kinder`}>
   {times(7).map(i=><g key={i}><line x1="43" x2="387" y1={184-i*24} y2={184-i*24} stroke="#c8d8e8"/><text x="28" y={189-i*24} textAnchor="end" fill="#526e89" fontSize="12">{i*2}</text></g>)}
   {ys.map((n,i)=><g key={i}><rect className="tk-bar-motion" x={88+i*100} y={184-n*12} width="62" height={n*12} fill={['#5d9de2','#70b7a1','#efb36b'][i]} rx="5"/><text x={119+i*100} y={174-n*12} textAnchor="middle" fontWeight="800" fill="#2c4c73" fontSize="17">{n}</text><text x={119+i*100} y="209" textAnchor="middle" fill="#294b70" fontWeight="800" fontSize="16">{['Rad','Bus','Fuß'][i]}</text></g>)}
  </svg>;
 }
 if(topic==='numbers'){
  const n=100*v+23;return <svg viewBox="0 0 410 215" role="img" aria-label={`Zahl ${n}: ${v} Hunderter, 2 Zehner, 3 Einer`}>
  {[['H',v,'#7ab4f4'],['Z',2,'#7bd0b9'],['E',3,'#f1b473']].map(([l,c,color],i)=><g key={i}><rect x={20+i*132} y="25" rx="14" width="116" height="128" fill={color as string}/><text x={78+i*132} y="53" textAnchor="middle" fill="#263e5c" fontSize="20" fontWeight="800">{l}</text><text x={78+i*132} y="105" textAnchor="middle" fill="#263e5c" fontSize="47" fontWeight="900">{c}</text></g>)}
  <text x="205" y="193" fontSize="21" textAnchor="middle" fill="#2f537b" fontWeight="850">{v} · 100 + 2 · 10 + 3 = {n}</text></svg>;
 }
 if(topic==='line'||topic==='round'){
  let px=32+v*3.45;let nearest=Math.round(v/10)*10;return <svg viewBox="0 0 410 193" role="img" aria-label={`Zahlenstrahl: ${v}${topic==='round'?', auf Zehner gerundet '+nearest:''}`}>
   <line x1="32" x2="377" y1="103" y2="103" stroke="#b6c8df" strokeWidth="9" strokeLinecap="round"/><line x1="32" x2={px} y1="103" y2="103" stroke="#4e84d7" strokeWidth="9" strokeLinecap="round"/>
   {times(11).map(i=><g key={i}><line x1={32+i*34.5} x2={32+i*34.5} y1="92" y2="114" stroke="#4c6788" strokeWidth="2"/><text x={32+i*34.5} y="137" textAnchor="middle" fontSize="13" fill="#385677">{i*10}</text></g>)}
   <circle cx={px} cy="103" r="13" fill="#fa886a" stroke="#fff" strokeWidth="4"/><text x={px} y="78" fontSize="24" fontWeight="900" fill="#25517b" textAnchor="middle">{v}</text>
   <text x="205" y="182" textAnchor="middle" fontSize="18" fontWeight="800" fill="#2a5378">{topic==='round'?v+' ≈ '+nearest+' (Zehner)':'Markierte Zahl: '+v}</text>
  </svg>;
 }
 if(topic==='fractions'||topic==='decimals'){
  const n=topic==='fractions'?8:10;return <svg viewBox="0 0 410 160" role="img" aria-label={`${v} von ${n} Teilen markiert`}>
   {times(n).map(i=><rect key={i} x={16+i*(380/n)} y="42" width={377/n} height="70" rx="4" fill={i<v?'#7bc7b4':'#e8eef7'} stroke="#fff" strokeWidth="2"/>)}
   <text x="205" y="26" textAnchor="middle" fontSize="22" fontWeight="800" fill="#2b517b">{v}/{n}{topic==='decimals'?' = '+(v/10).toFixed(1).replace('.',','):''}</text>
   <text x="205" y="145" textAnchor="middle" fontSize="15" fill="#46617e">Jedes Kästchen ist gleich groß.</text></svg>;
 }
 if(topic==='mental'){
  return <svg viewBox="0 0 410 210" role="img" aria-label={`Rechenreihenfolge: zuerst 6 mal ${v}, dann plus 18, Ergebnis ${18+6*v}`}>
   <rect x="19" y="25" width="170" height="90" rx="15" fill="#d6e9fa"/><rect x="223" y="25" width="168" height="90" rx="15" fill="#cfefdc"/>
   <text x="103" y="53" textAnchor="middle" fontSize="15" fontWeight="700" fill="#345477">Erst Punkt</text><text x="103" y="87" textAnchor="middle" fontSize="22" fontWeight="850" fill="#244c76">6 · {v} = {6*v}</text>
   <text x="307" y="53" textAnchor="middle" fontSize="15" fontWeight="700" fill="#345477">Dann Strich</text><text x="307" y="87" textAnchor="middle" fontSize="21" fontWeight="850" fill="#244c76">18 + {6*v}</text>
   <text x="205" y="160" textAnchor="middle" fill="#284c7b" fontSize="24" fontWeight="850">18 + 6 · {v} = {18+6*v}</text>
  </svg>;
 }
 if(topic==='divisibility'){
  return <svg viewBox="0 0 410 220" role="img" aria-label={`${v} Punkte in Dreiergruppen: ${Math.floor(v/3)} vollständige Gruppen und ${v%3} Rest`}>
   {times(v).map(i=><circle key={i} cx={24+(i%10)*40} cy={29+Math.floor(i/10)*39} r="12" fill={i<Math.floor(v/3)*3?'#61b7a6':'#f3a17a'} stroke="#fff" strokeWidth="2"/>)}
   <text x="205" y="191" textAnchor="middle" fill="#2d527b" fontWeight="800" fontSize="18">{v} : 3 = {Math.floor(v/3)} Rest {v%3}</text></svg>;
 }
 if(topic==='geometry'){
  let width=v*34;return <svg viewBox="0 0 410 230" role="img" aria-label={`Rechteck ${v} mal 4 Zentimeter, Umfang ${2*(v+4)} Zentimeter, Fläche ${v*4} Quadratzentimeter`}>
   <rect x={205-width/2} y="47" width={width} height="98" rx="6" fill="#7cc5bb" stroke="#336785" strokeWidth="4"/>
   <text x="205" y="39" textAnchor="middle" fontWeight="800" fill="#315178">{v} cm</text><text x="205" y="96" textAnchor="middle" fontWeight="850" fontSize="25" fill="#1a5169">{v*4} cm²</text>
   <text x="205" y="188" textAnchor="middle" fill="#315178" fontWeight="800">Umfang: {2*(v+4)} cm · Fläche: {v*4} cm²</text>
  </svg>;
 }
 if(topic==='angles'){
  let a=v*Math.PI/180, x=205+127*Math.cos(a),y=160-127*Math.sin(a);return <svg viewBox="0 0 410 230" role="img" aria-label={`Winkel mit ${v} Grad`}>
   <line x1="205" y1="160" x2="364" y2="160" stroke="#416a96" strokeWidth="8" strokeLinecap="round"/>
   <line x1="205" y1="160" x2={x} y2={y} stroke="#ed9079" strokeWidth="8" strokeLinecap="round" className="tk-line-motion"/>
   <circle cx="205" cy="160" r="9" fill="#314e77"/>
   <text x="205" y="38" textAnchor="middle" fontWeight="850" fontSize="26" fill="#2b517a">{v}° · {v<90?'spitz':v===90?'recht':'stumpf'}</text>
   <text x="205" y="205" textAnchor="middle" fontSize="15" fill="#3b597d">Gemeinsamer Scheitelpunkt</text></svg>;
 }
 if(topic==='symmetry'){
  let d=v*17;return <svg viewBox="0 0 410 215" role="img" aria-label="Zwei an einer senkrechten Achse gespiegelte Dreiecke mit gleichem Abstand">
   <line x1="205" x2="205" y1="19" y2="192" stroke="#ed9c58" strokeWidth="4" strokeDasharray="8 8"/>
   <polygon points={`${205-d},68 ${205-d-49},145 ${205-d},145`} fill="#67b8ae" stroke="#35677b" strokeWidth="3"/>
   <polygon points={`${205+d},68 ${205+d+49},145 ${205+d},145`} fill="#9cb0ec" stroke="#35677b" strokeWidth="3"/>
   <line x1={205-d} x2={205+d} y1="145" y2="145" stroke="#bd7487" strokeDasharray="4 5" strokeWidth="3"/>
   <text x="205" y="208" textAnchor="middle" fontSize="15" fontWeight="800" fill="#365a79">Spiegelachse</text></svg>;
 }
 if(topic==='solids'){
  const side=v*24,x=120,y=80;return <svg viewBox="0 0 410 230" role="img" aria-label={`Würfel mit Kantenlänge ${v} und Volumen ${v*v*v} Kubikzentimeter`}>
   <path d={`M ${x} ${y} l ${side*.6} -${side*.34} l ${side} 0 l -${side*.6} ${side*.34} Z`} fill="#a4e0d2" stroke="#3b7797" strokeWidth="2.5"/>
   <path d={`M ${x} ${y} l ${side} 0 l 0 ${side} l -${side} 0 Z`} fill="#75c5c3" stroke="#3b7797" strokeWidth="2.5"/>
   <path d={`M ${x+side} ${y} l ${side*.6} -${side*.34} l 0 ${side} l -${side*.6} ${side*.34} Z`} fill="#588ac0" stroke="#3b7797" strokeWidth="2.5"/>
   <text x="205" y="214" textAnchor="middle" fill="#315678" fontWeight="800">{v}³ = {v*v*v} cm³</text></svg>;
 }
 return null;
}
export function ModulKino({topic}:{topic:Topic}){
 const [rechen,setRechen]=useState<Rechenart>('addition');
 const [value,setValue]=useState(5);
 if(topic==='arithmetic')return <div><div className="tk-operation-pick" role="group" aria-label="Rechenart für die Bilder-Schulung">{([['addition','Plus'],['subtraktion','Minus'],['multiplikation','Mal'],['division','Geteilt']] as [Rechenart,string][]).map(([key,label])=><button key={key} type="button" className="tk-button tk-secondary" aria-pressed={rechen===key} onClick={()=>setRechen(key)}>{label}</button>)}</div><RechenKino fach={rechen}/></div>;
 if(topic==='units')return <GroessenKino bereich="laenge"/>;
 if(topic==='measure')return <GroessenKino bereich="flaeche"/>;
 if(!isModel(topic))return null;
 const info=base[topic];
 const valueClamped=Math.min(info.max,Math.max(info.min,value));
 return <section className="tk-studio tk-module" aria-label={`Interaktives Themenbild: ${topic}`}>
  <header className="tk-studio-head"><div><span className="tk-eyebrow">BILDER-SCHULUNG · LERNEN MIT GRAFIKEN</span><h3>{info.titel}</h3><p>{info.frage}</p></div><span className="tk-head-icon" aria-hidden="true">✧</span></header>
  <div className="tk-size-layout"><div className="tk-image" key={topic}><Diagram topic={topic} v={valueClamped}/></div>
  <div className="tk-explain">
   <label className="tk-range-label" htmlFor={`tk-module-${topic}`}><span>Wert verändern</span><strong>{valueClamped}{topic==='angles'?'°':''}</strong></label>
   <input id={`tk-module-${topic}`} type="range" min={info.min} max={info.max} step={info.step} value={valueClamped} onChange={e=>setValue(Number(e.target.value))}/>
   <p className="tk-live" aria-live="polite">{topic==='data'||topic==='stats'?`Insgesamt ${valueClamped+11} Kinder. Rad: ${valueClamped}, Bus: 7, zu Fuß: 4.`:topic==='numbers'?`Die Hunderterziffer ist ${valueClamped}: ${valueClamped*100+23}.`:topic==='divisibility'?`Durch 3 teilen: ${Math.floor(valueClamped/3)} Gruppen, Rest ${valueClamped%3}.`:topic==='fractions'?`${valueClamped} von 8 gleich großen Teilen markiert.`:topic==='decimals'?`${valueClamped} Zehntel = ${(valueClamped/10).toFixed(1).replace('.',',')}.`:topic==='angles'?`${valueClamped}° ist ein ${valueClamped<90?'spitzer':valueClamped===90?'rechter':'stumpfer'} Winkel.`:topic==='round'?`${valueClamped} auf Zehner gerundet ergibt ${Math.round(valueClamped/10)*10}.`:topic==='line'?`Der Punkt liegt bei ${valueClamped}.`:topic==='geometry'?`Umfang ${2*(valueClamped+4)} cm, Fläche ${valueClamped*4} cm².`:topic==='solids'?`Volumen des Würfels: ${valueClamped**3} cm³.`:topic==='symmetry'?'Beide Bildpunkte haben den gleichen Abstand zur Spiegelachse.':`18 + 6 · ${valueClamped} = ${18+6*valueClamped}.`}</p>
   <p><strong>Merksatz:</strong> {info.regel}</p><details className="tk-hint"><summary>Typischen Fehler ansehen</summary><p>{info.fehler}</p></details>
  </div></div>
 </section>;
}

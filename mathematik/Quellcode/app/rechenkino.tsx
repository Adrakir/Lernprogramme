'use client';
import {useState} from 'react';
import './themenkino.css';

export type Rechenart='addition'|'subtraktion'|'multiplikation'|'division';
type Scene={titel:string;erkl:string;formel:string};
const scenes:Record<Rechenart,{heading:string;intro:string;aufgabe:string;slides:Scene[];fehler:string;regel:string}>={
 addition:{
  heading:'Der Übertrag wird sichtbar',intro:'Wir rechnen 587 + 268. Die Stellenwertfarben helfen dir, Einer, Zehner und Hunderter auseinanderzuhalten.',aufgabe:'587 + 268 = 855',
  slides:[
   {titel:'1. Einer zusammenlegen',erkl:'7 Einer und 8 Einer sind 15 Einer. Zehn Einer bündeln wir zu einem Zehner. 5 Einer bleiben unten stehen.',formel:'7 + 8 = 15  →  5 E, Übertrag 1 Z'},
   {titel:'2. Zehner mit Übertrag',erkl:'8 Zehner plus 6 Zehner plus 1 Zehner Übertrag ergeben 15 Zehner. Wir schreiben 5 Zehner und übertragen 1 Hunderter.',formel:'8 + 6 + 1 = 15  →  5 Z, Übertrag 1 H'},
   {titel:'3. Hunderter addieren',erkl:'5 Hunderter plus 2 Hunderter plus 1 Hunderter Übertrag ergeben 8 Hunderter. Das Ergebnis lautet 855.',formel:'5 + 2 + 1 = 8  →  855'}
  ],
  fehler:'Übertrag vergessen? Markiere den gebündelten Zehner oder Hunderter, bevor du die nächste Spalte rechnest.',
  regel:'Schriftlich addieren: Einer → Zehner → Hunderter. Jeden Übertrag genau einmal mitrechnen.'
 },
 subtraktion:{
  heading:'Entbündeln statt raten',intro:'Wir rechnen 704 − 286. Du siehst, wie aus einem Hunderter zehn Zehner und daraus zehn Einer werden.',aufgabe:'704 − 286 = 418',
  slides:[
   {titel:'1. Einer brauchen Hilfe',erkl:'4 Einer reichen nicht für 6 Einer. Die Zehnerspalte ist leer: Wir tauschen zuerst 1 Hunderter in 10 Zehner. Dann tauschen wir 1 Zehner in 10 Einer. Jetzt haben wir 14 Einer.',formel:'14 − 6 = 8 E'},
   {titel:'2. Zehner abziehen',erkl:'Nach dem Tausch bleiben 9 Zehner übrig. Davon ziehen wir 8 Zehner ab. Ein Zehner bleibt.',formel:'9 − 8 = 1 Z'},
   {titel:'3. Hunderter abziehen',erkl:'Nach dem Entbündeln haben wir 6 Hunderter. Davon ziehen wir 2 Hunderter ab. Es bleiben 4 Hunderter.',formel:'6 − 2 = 4 H  →  418'}
  ],
  fehler:'Bei einer Null in der Zehnerspalte kannst du dort nichts direkt tauschen. Beginne beim nächsten vorhandenen Hunderter.',
  regel:'Beim Entbündeln bleibt der Zahlenwert gleich: 1 H = 10 Z und 1 Z = 10 E.'
 },
 multiplikation:{
  heading:'Teilprodukte als Flächen sehen',intro:'Die Rechnung 24 · 13 wird zu einem Rechteck. Jede Teilfläche ist ein eigenes Teilprodukt.',aufgabe:'24 · 13 = 312',
  slides:[
   {titel:'1. Faktoren zerlegen',erkl:'Wir zerlegen 24 in 20 + 4 und 13 in 10 + 3. So entstehen vier Teilrechtecke.',formel:'(20 + 4) · (10 + 3)'},
   {titel:'2. Vier Teilflächen ausrechnen',erkl:'20 · 10 = 200, 4 · 10 = 40, 20 · 3 = 60 und 4 · 3 = 12. Jede Fläche zählt zum Gesamtprodukt.',formel:'200 + 40 + 60 + 12'},
   {titel:'3. Teilprodukte addieren',erkl:'Alle vier Teilprodukte ergeben zusammen 312. Die Zehnerreihe bei der schriftlichen Multiplikation beginnt eine Stelle weiter links.',formel:'200 + 40 + 60 + 12 = 312'}
  ],
  fehler:'Bei der Zehnerstelle nicht einfach mit 1 multiplizieren: Die 1 bei 13 bedeutet 10. Darum ist 24 · 10 = 240.',
  regel:'Schriftlich multiplizieren: nach Stellenwert zerlegen, Teilprodukte ausrechnen, richtig ausrichten und addieren.'
 },
 division:{
  heading:'Schriftliche Division zum Mitdenken',intro:'Wir teilen 1248 durch 6. Die sechs Gruppen zeigen dir, welche Stellen verteilt werden.',aufgabe:'1248 : 6 = 208',
  slides:[
   {titel:'1. Hunderter verteilen',erkl:'12 Hunderter werden auf 6 Gruppen verteilt. Jede Gruppe bekommt 2 Hunderter. Wir notieren die 2 bei den Hundertern.',formel:'12 H : 6 = 2 H'},
   {titel:'2. Die Zehnerstelle prüfen',erkl:'4 Zehner reichen nicht aus, um jeder der 6 Gruppen einen Zehner zu geben. Deshalb steht im Ergebnis eine 0 an der Zehnerstelle. Wir tauschen die 4 Zehner in 40 Einer.',formel:'4 Z : 6 = 0 Z  →  40 E'},
   {titel:'3. Einer verteilen',erkl:'40 Einer plus 8 Einer ergeben 48 Einer. Jede Gruppe bekommt 8 Einer. Die Probe bestätigt die Rechnung.',formel:'48 E : 6 = 8 E  →  208 · 6 = 1248'}
  ],
  fehler:'Die Null im Ergebnis ist wichtig: 208 und 28 sind verschiedene Zahlen. Prüfe jeden Stellenwert.',
  regel:'Schriftlich dividieren: teilen, multiplizieren, abziehen, nächste Stelle herunterholen – und mit Multiplikation prüfen.'
 }
};
const nrange=(n:number)=>Array.from({length:n},(_,i)=>i);
function PlaceDiagram({fach,step}:{fach:Rechenart;step:number}){
 const subtract=fach==='subtraktion';
 const a=subtract?[7,0,4]:[5,8,7],b=subtract?[2,8,6]:[2,6,8];
 const now=subtract?step===0?[6,9,14]:[6,9,14]:[5,8,7];
 const result=subtract?[4,1,8]:[8,5,5];
 return <div className="tk-place">
  <div className="tk-place-legend"><span>Hunderter</span><span>Zehner</span><span>Einer</span></div>
  <div className="tk-place-grid" role="img" aria-label={`Stellenwerttafel für ${subtract?'704 minus 286':'587 plus 268'}, Bildschritt ${step+1}`}>
    <span className="tk-rowname">1. Zahl</span>{a.map((v,i)=><strong className={'tk-place-value '+(step===2-i?'tk-lit':'')} key={'a'+i}>{v}</strong>)}
    <span className="tk-rowname">{subtract?'−':'+'} 2. Zahl</span>{b.map((v,i)=><strong className="tk-place-value" key={'b'+i}>{v}</strong>)}
    <span className="tk-rowname">Tausch / Übertrag</span>{now.map((v,i)=><span className="tk-place-value tk-small-value" key={'n'+i}>{subtract?(step===0||i>0?(v===14?'14 E':v+' '+['H','Z','E'][i]):'6 H'):(i===0?step>=2?'1 H':'–':i===1?step>=1?'1 Z':'–':'–')}</span>)}
    <span className="tk-rowname">Ergebnis</span>{result.map((v,i)=><strong key={'r'+i} className={'tk-place-value '+(step>=2-i?'tk-visible':'tk-waiting')}>{step>=2-i?v:'?'}</strong>)}
  </div>
  <div className="tk-blocks" aria-hidden="true">{nrange(10).map(i=><span className={i<5?'tk-filled':''} key={i}/>)}</div>
  <p className="tk-visual-caption">{subtract?'Tauschen verändert den Gesamtwert nicht.':'Zehn kleine Kästchen bilden einen größeren Stellenwert.'}</p>
 </div>;
}
function AreaDiagram({step}:{step:number}){
 const rects=[{x:36,y:32,w:220,h:122,n:200,t:'20 · 10',fill:'#63b3ab'},{x:256,y:32,w:72,h:122,n:40,t:'4 · 10',fill:'#6c90dc'},{x:36,y:154,w:220,h:61,n:60,t:'20 · 3',fill:'#ebb36a'},{x:256,y:154,w:72,h:61,n:12,t:'4 · 3',fill:'#e78a99'}];
 return <svg viewBox="0 0 366 247" role="img" aria-label="Rechteckmodell: 24 mal 13 ist 200 plus 40 plus 60 plus 12 gleich 312">
 <text x="154" y="22" textAnchor="middle" className="tk-svg-label">20</text><text x="292" y="22" textAnchor="middle" className="tk-svg-label">4</text>
 <text x="18" y="98" textAnchor="middle" className="tk-svg-label">10</text><text x="18" y="192" textAnchor="middle" className="tk-svg-label">3</text>
 {rects.map((r,i)=><g key={i} className="tk-animated" style={{animationDelay:(i*.09)+'s'}}><rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} opacity={step===0?.63:1} stroke="#2b405c" strokeWidth="2"/><text x={r.x+r.w/2} y={r.y+r.h/2+5} textAnchor="middle" className="tk-area-text">{step===0?r.t:r.n}</text></g>)}
 <text x="182" y="240" textAnchor="middle" className="tk-svg-label">Gesamtfläche = 24 · 13 = 312 Kästchen</text>
 </svg>;
}
function GroupDiagram({step}:{step:number}){
 return <svg viewBox="0 0 540 225" role="img" aria-label="Sechs gleich große Gruppen: je zwei Hunderter und acht Einer, also 208 pro Gruppe">
 {nrange(6).map(i=><g key={i} className="tk-animated" style={{animationDelay:(i*.06)+'s'}}>
  <rect x={12+(i%3)*177} y={17+Math.floor(i/3)*100} width="165" height="84" rx="13" fill="#e5efff" stroke="#7798c7" strokeWidth="2"/>
  <text x={95+(i%3)*177} y={43+Math.floor(i/3)*100} textAnchor="middle" className="tk-svg-label">{i+1}. Gruppe</text>
  <text x={95+(i%3)*177} y={74+Math.floor(i/3)*100} textAnchor="middle" className="tk-group-num">{step===0?'2 H':step===1?'2 H + 0 Z':'208'}</text>
 </g>)}
 </svg>;
}
export function RechenKino({fach}:{fach:Rechenart}){
 const [step,setStep]=useState(0),[details,setDetails]=useState(false);
 const data=scenes[fach],info=data.slides[step],last=data.slides.length-1;
 return <section className="tk-studio" aria-label={`Anschauliche Schulung ${fach}`}>
  <header className="tk-studio-head"><div><span className="tk-eyebrow">BILDER-SCHULUNG · SELBST ERKUNDEN</span><h3>{data.heading}</h3><p>{data.intro}</p></div><span className="tk-head-icon" aria-hidden="true">{fach==='addition'?'＋':fach==='subtraktion'?'−':fach==='multiplikation'?'×':'÷'}</span></header>
  <div className="tk-stage"><div className="tk-image" key={fach+'-'+step}>
   {fach==='addition'||fach==='subtraktion'?<PlaceDiagram fach={fach} step={step}/>:fach==='multiplikation'?<AreaDiagram step={step}/>:<GroupDiagram step={step}/>}
  </div>
  <div className="tk-explain" aria-live="polite"><span className="tk-step-indicator">BILDSCHRITT {step+1} VON {last+1}</span><h4>{info.titel}</h4><p>{info.erkl}</p><div className="tk-equation">{info.formel}</div>
   <div className="tk-controls"><button type="button" className="tk-button tk-secondary" onClick={()=>setStep(x=>Math.max(0,x-1))} disabled={step===0}>← Zurück</button><button type="button" className="tk-button" onClick={()=>setStep(x=>x===last?0:x+1)}>{step===last?'↺ Noch einmal':'Nächster Bildschritt →'}</button></div>
  </div></div>
  <div className="tk-dots" aria-label="Bildschritt wählen">{data.slides.map((v,i)=><button key={i} type="button" aria-label={`Bildschritt ${i+1}: ${v.titel}`} aria-current={i===step?'step':undefined} onClick={()=>setStep(i)}>{i+1}</button>)}</div>
  <details className="tk-hint" open={details} onToggle={e=>setDetails(e.currentTarget.open)}><summary>Typischen Fehler und Merksatz anzeigen</summary><p><strong>Typischer Fehler:</strong> {data.fehler}</p><p><strong>Merksatz:</strong> {data.regel}</p></details>
  <p className="tk-result"><strong>Beispiel:</strong> {data.aufgabe}. Die Bildschritte erklären dieses Beispiel; die folgenden Aufgaben können andere Zahlen enthalten.</p>
 </section>;
}

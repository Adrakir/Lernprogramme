import {uhr} from '@/lib/zeit-tasks';
import {useState} from 'react';
import {Zahl,Wahl,Regler,Begruenden} from './atelier-felder';
import {plainNumber,fmtNum} from '@/lib/groessen-core';

export function Lineal({v}:{v:number}){
 const start=34+v,ende=91+v,[l,setL]=useState(25),[r,setR]=useState(100);
 const x=(mm:number)=>16+(mm-20)*4;
 return <><p>Der Anfang des Lineals ist abgebrochen. Setze beide Messmarken an die Enden des Stifts.</p>
 <svg viewBox="0 0 400 94" role="img" aria-label={'Stift von '+fmtNum(start/10)+' bis '+fmtNum(ende/10)+' cm. Das Lineal beginnt bei 2 cm.'}>
 <path d={`M${x(start)},22 l10,-5 H${x(ende)} v10 H${x(start)+10} Z`} fill="#c77832"/><path d="M13 41l5 5 -5 5 5 5 -5 5 H386 V40 Z" fill="#edd5a5"/>
 {Array.from({length:91},(_,i)=><g key={i}><path d={`M${x(20+i)} 40v${i%10===0?20:i%5===0?13:7}`} stroke="#392d24"/>{i%10===0&&<text x={x(20+i)} y="79" textAnchor="middle" fill="currentColor" fontSize="11">{(20+i)/10}</text>}</g>)}
 {[l,r].map((n,i)=><path key={i} d={`M${x(n)} 9v54`} stroke={i?'#ac441e':'#176f81'} strokeWidth="2"/>)}</svg>
 <Regler name="Linke Messmarke" min={20} max={110} wert={l} set={setL} anzeige={fmtNum(l/10)+' cm'}/><Regler name="Rechte Messmarke" min={20} max={110} wert={r} set={setR} anzeige={fmtNum(r/10)+' cm'}/>
 {l===start&&r===ende?<Zahl frage="Wie lang ist der Stift?" einheit="cm" wert={(ende-start)/10} weg={fmtNum(ende/10)+' − '+fmtNum(start/10)+' = 5,7 cm.'} tipp="Wäre der Stift länger, wenn du ihn auf dem Lineal nach rechts schiebst? Ziehe den Anfangswert vom Endwert ab."/>:<p>Vergleiche jede Marke mit dem zugehörigen Stiftende.</p>}</>;
}
export function Dose({v}:{v:number}){
 const tara=140+v*10,inhalt=710+v*20,[voll,set]=useState(true),[nullpunkt,tariere]=useState(0),[weiter,folge]=useState(false);
 const gewicht=tara+(voll?inhalt:0);
 return <><p>Wie viel wiegt der Inhalt ohne die Dose? Leere die Dose, stelle die Waage auf null und fülle die Dose wieder.</p><div className="atelier-waage"><span>{voll?'Gefüllte Dose':'Leere Dose'}</span><output aria-live="polite">{gewicht-nullpunkt} g</output></div>
 <div className="ad-actions"><button className="btn ghost" onClick={()=>set(!voll)}>{voll?'Dose leeren':'Dose füllen'}</button><button className="btn ghost" onClick={()=>tariere(gewicht)}>Auf null stellen</button><button className="btn ghost" onClick={()=>{tariere(0);set(true);}}>Waage zurücksetzen</button></div>
 <Zahl frage={'Die volle Dose wiegt '+(tara+inhalt)+' g, die leere '+tara+' g. Wie schwer ist der Inhalt?'} wert={inhalt} einheit="g" weg="Die Verpackung wird vom Gesamtgewicht abgezogen." beiRichtig={()=>folge(true)}/>
 {weiter&&<Zahl frage="Eine zweite volle Dose wiegt 940 g, ihr Inhalt 780 g. Was wiegt die Verpackung?" wert={160} einheit="g" weg="940 − 780 = 160 g."/>}</>;
}
export function Fahrplan({minute=58,weg=8,hilfe=1}:{minute?:number;weg?:number;hilfe?:number}){
 const zeit=60-minute+4,anschluss=zeit>=weg?'15:04':'15:19',[offen,set]=useState(false);
 return <><p>Du steigst vom Dorfbus in die Stadtlinie um. Zwischen den Haltestellen gehst du {weg} Minuten.</p><table className="ad-grid"><caption>Fahrplan am Schulzentrum</caption><tbody><tr><th>Dorfbus · Ankunft</th><td>14:{minute}</td></tr><tr><th>Stadtlinie · Abfahrt</th><td>15:04 · 15:19 · 15:34</td></tr></tbody></table>
 {hilfe<3&&<div className="atelier-zeit" aria-label="Zeitleiste">14:{minute} ━━━ {hilfe===1?'15:00 Uhr · volle Stunde':''} ━━━ 15:04</div>}
 {hilfe===1&&<p>Rechne erst bis zur vollen Stunde, dann die vier Minuten danach.</p>}
 <Zahl frage="Wie viel Zeit liegt zwischen Ankunft und erster Abfahrt?" wert={zeit} einheit="min" weg={60-minute+' + 4 = '+zeit+' Minuten.'} beiRichtig={()=>set(true)}/>
 {offen&&<Wahl frage="Welchen Anschluss erreichst du zuerst?" optionen={['15:04','15:19','15:34']} richtig={anschluss==='15:04'?0:1} weg={'Du erreichst die Haltestelle um '+uhr(14*60+minute+weg)+' Uhr. Der erste erreichbare Bus fährt um '+anschluss+' Uhr.'} tipp="Vergleiche deine Gehzeit mit der Zeit bis zur Abfahrt."/>}</>;
}
export function Buch(){
 const [a,setA]=useState(''),[b,setB]=useState(''),[c,setC]=useState(''),[schritt,set]=useState(0);
 const n=(s:string)=>plainNumber(s)??0;
 return <><p>Lege ein echtes Buch und ein Lineal bereit.</p><label>Was schätzt du: Wie breit ist dein Buch in cm?<input inputMode="decimal" disabled={schritt>0} value={a} onChange={e=>setA(e.target.value)}/></label>
 {schritt===0?<button className="btn" disabled={n(a)<=0} onClick={()=>set(1)}>Schätzung festhalten</button>:<><label>Gemessene Breite in cm<input inputMode="decimal" value={b} onChange={e=>setB(e.target.value)}/></label><label>Gemessene Höhe in cm<input inputMode="decimal" value={c} onChange={e=>setC(e.target.value)}/></label>
 {n(b)>0&&<p role="status">Deine Schätzung weicht um {fmtNum(Math.abs(n(b)-n(a))*10)} mm von der Breite ab.</p>}
 {n(b)>0&&n(c)>0&&<Begruenden frage="Lag deine Schätzung näher an der Breite oder an der Höhe?" beispiel={'Abstand zur Breite: '+fmtNum(Math.abs(n(a)-n(b))*10)+' mm. Abstand zur Höhe: '+fmtNum(Math.abs(n(a)-n(c))*10)+' mm. Der kleinere Abstand liegt näher.'}/>}
 <button className="btn ghost" onClick={()=>{set(0);setA('');setB('');setC('');}}>Anderes Buch messen</button></>}</>;
}
export function Band(){
 const karten=['2 m 5 cm','2,05 m','2,5 m'],[wahl,set]=useState<number[]>([]),[meldung,melde]=useState('');
 return <><p>Wähle die beiden Karten mit der gleichen Länge.</p><div className="ad-actions">{karten.map((s,i)=><button className="btn ghost" aria-pressed={wahl.includes(i)} key={s} onClick={()=>{set(wahl.includes(i)?wahl.filter(n=>n!==i):[...wahl,i]);melde('');}}>{s}</button>)}</div><button className="btn" disabled={wahl.length!==2} onClick={()=>melde(wahl.includes(0)&&wahl.includes(1)?'Richtig: 2 m und 5 cm sind 2,05 m.':'Vergleiche die Strecken hinter der Marke bei 2 Metern.')}>Paar prüfen</button>
 {meldung&&<><p role="status">{meldung}</p><div className="atelier-bandpaar">{[205,250].map(n=><div key={n}><b>{n} cm</b><div className="atelier-band"><span style={{width:'76.92%'}}/><i style={{width:((n-200)/260*100)+'%'}}/></div><small>200 cm + {n-200} cm</small></div>)}</div></>}</>;
}

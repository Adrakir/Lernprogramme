'use client';
import {useState} from 'react';
import type {Bereich} from '@/lib/groessen-core';
import './themenkino.css';
const range=(n:number)=>Array.from({length:n},(_,i)=>i);
type Props={bereich:Bereich;station?:string};
const infos:Record<Bereich,{titel:string;intro:string;merke:string;fehler:string}>={
 laenge:{titel:'Miss mit dem beweglichen Lineal',intro:'Vergleiche die markierte Strecke mit den Zentimeterstrichen. Die Markierung lässt sich verschieben.',merke:'1 cm = 10 mm. 100 cm = 1 m.',fehler:'Beginne beim Messen immer am Nullstrich, nicht am Anfang des Lineals.'},
 masse:{titel:'Wie kippt die Waage?',intro:'Links liegen 500 g. Rechts darfst du Gewichte ergänzen. Beobachte die Lage des Waagebalkens.',merke:'1000 g = 1 kg. Waagen vergleichen zwei Massen.',fehler:'Vor dem Vergleichen beide Massen in dieselbe Einheit umwandeln.'},
 zeit:{titel:'Drehe die Uhr weiter',intro:'Wir starten um 12:00 Uhr und zeigen, wie viel Zeit seitdem vergangen ist.',merke:'60 Minuten = 1 Stunde. 90 Minuten = 1 Stunde 30 Minuten.',fehler:'Eine Stunde besteht aus 60 Minuten, nicht aus 100 Minuten.'},
 geld:{titel:'Cent werden Euro',intro:'Eine Geldsumme lässt sich auf verschiedene Arten darstellen. Verschiebe die Summe.',merke:'100 Cent = 1 €. 250 Cent = 2,50 €.',fehler:'Bei Geldbeträgen immer zwei Nachkommastellen schreiben, zum Beispiel 2,50 €.'},
 flaeche:{titel:'Die Fläche wächst mit',intro:'Verändere Breite und Höhe des Rechtecks. Jedes Kästchen ist 1 cm².',merke:'Rechteckfläche = Länge · Breite. Die Einheit ist cm², nicht cm.',fehler:'Fläche misst die Kästchen im Inneren. Umfang misst den Rand.'},
 volumen:{titel:'Vom Würfel zum Volumen',intro:'Stelle die Kantenlänge des Würfels ein. Denke dir den Würfel als Schichten aus 1-cm³-Bausteinen.',merke:'Würfelvolumen = Kantenlänge · Kantenlänge · Kantenlänge. Einheit: cm³.',fehler:'Ein Würfel mit doppelt so langer Kante hat achtmal so viel Volumen.'}
};
function RulerModel({v}:{v:number}){return <svg viewBox="0 0 480 187" role="img" aria-label={`Lineal von 0 bis 30 Zentimeter. Markierte Länge: ${v} Zentimeter`}>
 <rect x="21" y="66" width="438" height="87" rx="11" fill="#ffdf95" stroke="#b88137" strokeWidth="3"/>
 {range(31).map(i=>{const x=34+i*13.6;return <g key={i}><line x1={x} x2={x} y1="67" y2={i%5===0?106:94} stroke="#825329" strokeWidth={i%5===0?2.5:1.5}/>{i%5===0&&<text x={x} y="127" textAnchor="middle" fill="#573e21" fontSize="14" fontWeight="700">{i}</text>}</g>})}
 <line x1="34" x2={34+v*13.6} y1="49" y2="49" stroke="#2964d2" strokeWidth="9" strokeLinecap="round"/>
 <circle cx={34+v*13.6} cy="49" r="13" fill="#f27665" stroke="#fff" strokeWidth="4" className="tk-animated"/>
 <text x="240" y="177" textAnchor="middle" fill="#304d78" fontSize="19" fontWeight="800">{v} cm = {v*10} mm</text>
 </svg>}
function MassModel({v}:{v:number}){let angle=Math.max(-13,Math.min(13,(v-500)/38));return <svg viewBox="0 0 470 230" role="img" aria-label={`Balkenwaage: links 500 Gramm, rechts ${v} Gramm.`}>
 <path d="M205 214 L235 127 L265 214Z" fill="#537397"/><rect x="168" y="212" width="135" height="12" rx="6" fill="#355274"/>
 <g transform={`rotate(${angle} 235 105)`} style={{transition:'transform .45s ease'}}>
 <rect x="78" y="100" width="314" height="11" rx="5" fill="#4975b0"/><circle cx="235" cy="105" r="10" fill="#ffd576"/>
 <line x1="93" x2="93" y1="105" y2="154" stroke="#63758c" strokeWidth="3"/><line x1="377" x2="377" y1="105" y2="154" stroke="#63758c" strokeWidth="3"/>
 <path d="M41 157 Q93 201 145 157Z" fill="#b9dbf6" stroke="#5b7a9c" strokeWidth="3"/><path d="M325 157 Q377 201 429 157Z" fill="#b9dbf6" stroke="#5b7a9c" strokeWidth="3"/>
 <rect x="70" y="126" width="46" height="31" rx="6" fill="#eb997a"/><text x="93" y="146" fontSize="12" fontWeight="800" textAnchor="middle" fill="#4a241c">500 g</text>
 <rect x="348" y="126" width="58" height="31" rx="6" fill="#7bc9a7"/><text x="377" y="146" fontSize="12" fontWeight="800" textAnchor="middle" fill="#164e36">{v} g</text>
 </g>
 <text x="235" y="28" textAnchor="middle" fill="#304d78" fontSize="18" fontWeight="800">{v===500?'Im Gleichgewicht':v>500?'Rechts ist schwerer':'Links ist schwerer'}</text>
 </svg>}
function ClockModel({v}:{v:number}){return <svg viewBox="0 0 470 230" role="img" aria-label={`12 Uhr plus ${v} Minuten ergibt ${12+Math.floor(v/60)} Uhr ${v%60} Minuten`}>
 <circle cx="223" cy="112" r="94" fill="#d4e7f8" stroke="#4975b0" strokeWidth="8"/><circle cx="223" cy="112" r="83" fill="#fff"/>
 {range(12).map(i=>{let a=(i*30-90)*Math.PI/180;return <line key={i} x1={223+Math.cos(a)*70} y1={112+Math.sin(a)*70} x2={223+Math.cos(a)*80} y2={112+Math.sin(a)*80} stroke="#526582" strokeWidth="3" strokeLinecap="round"/>})}
 <g style={{transformOrigin:'223px 112px',transform:`rotate(${v*6}deg)`,transition:'transform .5s ease'}}><line x1="223" y1="112" x2="223" y2="43" stroke="#e37167" strokeWidth="7" strokeLinecap="round"/></g>
 <g style={{transformOrigin:'223px 112px',transform:`rotate(${v/2}deg)`,transition:'transform .5s ease'}}><line x1="223" y1="112" x2="223" y2="64" stroke="#37577f" strokeWidth="10" strokeLinecap="round"/></g><circle cx="223" cy="112" r="8" fill="#e37167"/>
 <text x="223" y="12" textAnchor="middle" fill="#304d78" fontSize="16" fontWeight="700">Start: 12:00 Uhr</text>
 </svg>}
function MoneyModel({v}:{v:number}){const coins=[200,100,50,20,10,5,2,1];let rem=v;const pieces: {value:number;count:number}[]=[];for(const c of coins){const count=Math.floor(rem/c);rem-=count*c;if(count)pieces.push({value:c,count});}
 return <div className="tk-money" role="img" aria-label={`Geldsumme ${v} Cent, entspricht ${(v/100).toFixed(2).replace('.',',')} Euro`}>
 <div className="tk-money-illustration"><span aria-hidden="true">€</span><strong>{(v/100).toFixed(2).replace('.',',')} €</strong></div>
 <div className="tk-coin-row">{pieces.map(c=><span key={c.value} className="tk-coin"><span className="tk-coin-circle">{c.value>=100?c.value/100+' €':c.value+' ct'}</span><small>{c.count}×</small></span>)}</div>
 <p>Eine mögliche Zerlegung in Münzen. Andere Zerlegungen sind ebenfalls möglich.</p>
 </div>}
function AreaModel({w,h}:{w:number;h:number}){return <svg viewBox="0 0 480 250" role="img" aria-label={`Rechteck von ${w} Zentimeter Breite und ${h} Zentimeter Höhe: ${w*h} Quadratzentimeter`}>
 <g transform="translate(34 22)">{range(h).flatMap(y=>range(w).map(x=><rect key={x+'-'+y} x={x*31} y={y*31} width="29" height="29" rx="4" fill={(x+y)%2?'#66aea9':'#8dcfc2'} stroke="#fff" strokeWidth="1"/>))}</g>
 <text x="34" y="242" fontSize="19" fill="#2d5279" fontWeight="800">{w} cm · {h} cm = {w*h} cm²</text>
 </svg>}
function CubeModel({v}:{v:number}){let side=26*v;const x=238,y=113;return <svg viewBox="0 0 480 250" role="img" aria-label={`Würfel, Kantenlänge ${v} Zentimeter, Volumen ${v*v*v} Kubikzentimeter`}>
 <path d={`M ${x} ${y} l ${side*.6} -${side*.35} l ${side} 0 l -${side*.6} ${side*.35} Z`} fill="#9edbd1" stroke="#426c89" strokeWidth="2"/>
 <path d={`M ${x} ${y} l ${side} 0 l 0 ${side} l -${side} 0 Z`} fill="#74b5bc" stroke="#426c89" strokeWidth="2"/>
 <path d={`M ${x+side} ${y} l ${side*.6} -${side*.35} l 0 ${side} l -${side*.6} ${side*.35} Z`} fill="#4b83b4" stroke="#426c89" strokeWidth="2"/>
 <text x="238" y="44" textAnchor="middle" fontSize="22" fill="#294f76" fontWeight="800">{v} · {v} · {v} = {v*v*v} cm³</text>
 <text x="238" y="240" textAnchor="middle" fontSize="17" fill="#294f76">Jede Kante: {v} cm</text>
 </svg>}
export function GroessenKino({bereich,station}:Props){
 const [value,setValue]=useState(bereich==='masse'?500:5),[height,setHeight]=useState(4),[help,setHelp]=useState(false);
 const data=infos[bereich];
 const configs:Record<Bereich,{min:number;max:number;step:number;defaultLabel:string}> = {
  laenge:{min:0,max:30,step:1,defaultLabel:'Strecke in Zentimetern'},
  masse:{min:100,max:900,step:100,defaultLabel:'Gewicht rechts in Gramm'},
  zeit:{min:0,max:180,step:5,defaultLabel:'Vergangene Minuten'},
  geld:{min:0,max:1000,step:10,defaultLabel:'Geldbetrag in Cent'},
  flaeche:{min:1,max:12,step:1,defaultLabel:'Breite in Zentimetern'},
  volumen:{min:1,max:5,step:1,defaultLabel:'Kantenlänge in Zentimetern'},
 };
 const c=configs[bereich];
 const setVal=Math.min(c.max,Math.max(c.min,value));
 const label=bereich==='laenge'?setVal+' cm':bereich==='masse'?setVal+' g':bereich==='zeit'?setVal+' min':bereich==='geld'?(setVal/100).toFixed(2).replace('.',',')+' €':setVal+' cm';
 const explain:Record<Bereich,string>={
 laenge:`${setVal} cm = ${setVal*10} mm = ${(setVal/100).toFixed(2).replace('.',',')} m. Die Strecke beginnt bei 0.`,
 masse:setVal===500?'Beide Seiten wiegen 500 g. Die Waage ist ausgeglichen.':setVal>500?`Rechts liegen ${setVal-500} g mehr als links. Die rechte Waagschale sinkt.`:`Links liegen ${500-setVal} g mehr als rechts. Die linke Waagschale sinkt.`,
 zeit:`${setVal} Minuten sind ${Math.floor(setVal/60)} Stunden und ${setVal%60} Minuten. Die Uhr zeigt jetzt ${12+Math.floor(setVal/60)}:${String(setVal%60).padStart(2,'0')} Uhr.`,
 geld:`${setVal} Cent sind ${(setVal/100).toFixed(2).replace('.',',')} Euro. Jede Münze hat einen festen Wert.`,
 flaeche:`${setVal} cm · ${height} cm = ${setVal*height} cm². Zähle die Kästchen im Rechteck.`,
 volumen:`Ein Würfel hat drei gleich lange Kanten. ${setVal} · ${setVal} · ${setVal} = ${setVal**3} cm³.`
 };
 return <section className="tk-studio tk-size" aria-label={`Anschauliche Schulung: ${bereich}`}>
 <header className="tk-studio-head"><div><span className="tk-eyebrow">ENTDECKER-GRAFIK · DIREKT IM LERNPFAD</span><h3>{data.titel}</h3><p>{data.intro}</p>{station&&<p className="tk-station-context">Station: {station}</p>}</div><span className="tk-head-icon" aria-hidden="true">{({laenge:'↔',masse:'⚖',zeit:'◷',geld:'€',flaeche:'▦',volumen:'▣'} as Record<Bereich,string>)[bereich]}</span></header>
 <div className="tk-size-layout"><div className="tk-image tk-size-graphic">
  {bereich==='laenge'?<RulerModel v={setVal}/>:bereich==='masse'?<MassModel v={setVal}/>:bereich==='zeit'?<ClockModel v={setVal}/>:bereich==='geld'?<MoneyModel v={setVal}/>:bereich==='flaeche'?<AreaModel w={setVal} h={height}/>:<CubeModel v={setVal}/>}
 </div><div className="tk-explain">
 <label className="tk-range-label" htmlFor={`tk-slider-${bereich}`}><span>{c.defaultLabel}</span><strong>{label}</strong></label><input type="range" id={`tk-slider-${bereich}`} min={c.min} max={c.max} step={c.step} value={setVal} onChange={e=>setValue(Number(e.target.value))}/>
 {bereich==='flaeche'&&<><label className="tk-range-label" htmlFor="tk-area-height"><span>Höhe in Zentimetern</span><strong>{height} cm</strong></label><input type="range" id="tk-area-height" min="1" max="6" value={height} onChange={e=>setHeight(Number(e.target.value))}/></>}
 <p className="tk-live" aria-live="polite">{explain[bereich]}</p>
 <button type="button" className="tk-button tk-secondary" onClick={()=>{setValue(bereich==='masse'?500:5);setHeight(4)}}>↺ Noch einmal</button>
 </div></div>
 <div className="tk-hint"><p><strong>Merke:</strong> {data.merke}</p><button className="tk-tip-button" type="button" onClick={()=>setHelp(x=>!x)} aria-expanded={help}>{help?'Fehlerhilfe ausblenden':'Typischen Fehler erklären'}</button>{help&&<p><strong>Achtung:</strong> {data.fehler}</p>}</div>
 <p className="tk-result">Dieses Modell hilft beim Verstehen. Rechne die anschließenden Übungen selbstständig.</p>
 </section>;
}

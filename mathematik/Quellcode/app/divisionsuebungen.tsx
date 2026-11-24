import {useState} from 'react';
import {plainNumber} from '@/lib/groessen-core';
import {rechenweg,punkte,type Aufgabe,type Antworten} from '@/lib/division';

type Props={startphase?:number;a:Aufgabe;w:Antworten;set:(k:string,v:string)=>void;test:boolean;geschafft?:()=>void;nachAbschluss?:React.ReactNode;beiFehler?:()=>void};
function Verteilmodell({a}:{a:Aufgabe}){
 const [runde,setRunde]=useState(0),[n,d]=a.zahlen,max=Math.floor(n/d),rest=n-runde*d;
 const verteilen=a.ziel==='verteilen',sprung=a.ziel==='sprung';
 const gruppen=verteilen?d:runde,proGruppe=verteilen?runde:d;
 const pos=(v:number)=>14+v/n*286;
 return <div className="ad-lab">
 {sprung?<svg viewBox="0 0 316 74" role="img" aria-label={runde+' Sprünge bis '+runde*d}><path d="M14 47H300" stroke="currentColor"/>{Array.from({length:n+1},(_,i)=><path key={i} d={`M${pos(i)} 47v${i%d===0?7:3}`} stroke="currentColor"/>)}{Array.from({length:runde},(_,i)=><path className="div-sprung" key={i} d={`M${pos(i*d)} 45 Q${pos((i+.5)*d)} 1 ${pos((i+1)*d)} 45`} stroke="#176c67" strokeWidth="2.5" fill="none"/>)}<circle cx={pos(runde*d)} cy="45" r="3.5" fill="#a64316"/><text x="10" y="71">0</text><text x="300" y="71" textAnchor="end">{n}</text></svg>:
 <div className="div-gruppen">{Array.from({length:gruppen},(_,i)=><div className="div-gruppe" key={i}><b>{verteilen?'Kind':'Beutel'} {i+1}</b><div>{Array.from({length:proGruppe},(_,j)=><i className="div-stein" key={j}/>)}</div></div>)}</div>}
 <p role="status">{sprung?`Stand: ${runde*d} von ${n}`:`Noch im Vorrat: ${rest} von ${n} Steinen`}</p><div className="ad-actions"><button className="btn ghost" disabled={runde===max} onClick={()=>setRunde(runde+1)}>{sprung?'Einen Sprung machen':verteilen?'Jedem Kind einen Stein geben':'Einen vollen Beutel packen'}</button><button className="btn ghost" disabled={!runde} onClick={()=>setRunde(runde-1)}>Schritt zurück</button></div></div>;
}
function Rechentafel({a,w}:{a:Aufgabe;w:Antworten}){
 const [n,d]=a.zahlen,rows=rechenweg(n,d),breite=String(n).length;
 function zeile(name:string,s:string,end:number){const start=end-s.length+1;return <tr key={name}><th scope="row">{name}</th>{Array.from({length:breite},(_,i)=><td key={i}>{i>=start&&i<=end?s[i-start]:''}</td>)}</tr>;}
 return <div className="ad-scroll"><table className="ad-grid div-tafel"><caption>Deine schriftliche Rechnung</caption><tbody>{zeile('Dividend',String(n),breite-1)}
 <tr><th scope="row">Quotient</th>{Array.from({length:breite},(_,i)=>{const j=rows.findIndex(r=>r.i===i);return <td key={i}>{j<0?'':w['q'+j]||'□'}</td>})}</tr>
 {rows.map((r,j)=><tr key={j}><th scope="row">Schritt {j+1}</th><td colSpan={breite}>{w['t'+j]||'□'} − {w['p'+j]||'□'} = {w['r'+j]||'□'}</td></tr>)}</tbody></table></div>;
}
function Herunterholen({rest,ziffer}:{rest:number;ziffer:number}){
 const [unten,zeige]=useState(false);
 return <div className="ad-lab"><button className="btn ghost" onClick={()=>zeige(!unten)}>{unten?'Modell zurücksetzen':'Herunterholen im Modell zeigen'}</button>
 <p aria-live="polite">{unten?<><b>{rest} · 10 + <span className="div-ziffer">{ziffer}</span> = {rest*10+ziffer}</b> ist die neue Teilzahl.</>:<>Voriger Rest: {rest}. Nächste Ziffer: {ziffer}.</>}</p></div>;
}
export function Aufgabenfelder({a,w,set,test,nachAbschluss,geschafft,beiFehler,startphase=0}:Props){
 const [phase,weiter]=useState(startphase),[meldung,melde]=useState('');
 const schrift=a.ziel==='raster'||a.ziel==='nullstelle',s=a.schritte[phase],fertig=!s,rows=schrift?rechenweg(a.zahlen[0],a.zahlen[1]):[];
 function pruefen(){const falsch=s.felder.find(f=>plainNumber(w[f.key]??'')!==f.wert);if(falsch){beiFehler?.();melde(falsch.label+': '+falsch.hinweis);return;}if(phase+1===a.schritte.length)geschafft?.();weiter(phase+1);melde('');}
 function edit(k:string,v:string){melde('');set(k,v);}
 const karten=w.karten?w.karten.split(',').map(Number):[];
 return <div className="ad-fields"><p className="ad-prompt">{a.frage}</p>
 {schrift&&<><Rechentafel a={a} w={w}/>{!test&&s&&<p aria-live="polite" aria-atomic="true">{phase===0?'Beginne ganz links. Ist die erste Ziffer kleiner als der Divisor, nimm die nächste dazu.':phase<rows.length?`Hole die ${rows[phase].ziffer} herunter und stelle sie rechts neben den Rest ${rows[phase-1].rest}.`:'Alle Ziffern sind verarbeitet. Lies das Ergebnis ab.'}</p>}</>}
 {schrift&&!test&&phase>0&&<div className="ad-actions">{rows.slice(0,phase).map((_,i)=><button key={i} className="btn ghost small" onClick={()=>{weiter(i);melde('Ändere diese Zeile und prüfe sie erneut. Deine weiteren Einträge bleiben erhalten.');}}>Zeile {i+1} bearbeiten</button>)}</div>}
 {schrift&&!test&&phase>0&&phase<rows.length&&<Herunterholen key={phase} rest={rows[phase-1].rest} ziffer={rows[phase].ziffer}/>}
 {a.ziel==='luecke'&&<label>Was gilt für sieben geteilt durch null?<select value={w.nullregel??''} onChange={e=>edit('nullregel',e.target.value)}><option value="">Bitte wählen</option><option>Das Ergebnis ist null.</option><option>Die Rechnung hat kein Ergebnis.</option><option>Das Ergebnis ist sieben.</option></select></label>}
 {['verteilen','packen','sprung'].includes(a.ziel)&&<Verteilmodell a={a}/>}
 {a.ziel==='probe'&&<div className="ad-lab"><div className="ad-actions">{a.zahlen.map(n=><button className="btn ghost" aria-label={'Zahlenkarte '+n} key={n} disabled={karten.includes(n)} onClick={()=>edit('karten',[...karten,n].join(','))}>{n}</button>)}</div><p>{karten[0]??'□'} · {karten[1]??'□'} + {karten[2]??'□'} = {w.a0||'□'}</p><button className="btn ghost" disabled={!karten.length} onClick={()=>edit('karten',karten.slice(0,-1).join(','))}>Letzte Karte zurück</button></div>}
 {(schrift&&!test?(fertig?[]:[s]):a.schritte).map(step=><fieldset className="div-felder" key={step.titel}>{schrift&&<legend>{step.titel}</legend>}{step.felder.map(f=><label key={f.key}>{f.label}<input inputMode="numeric" value={w[f.key]??''} onChange={e=>edit(f.key,e.target.value)}/></label>)}</fieldset>)}
 {schrift&&!test&&(fertig?<p role="status" className="ad-feedback">Alle Rechenschritte stimmen. {a.weg}</p>:<><button className="btn" onClick={pruefen}>Schritt prüfen</button>{meldung&&<p className="ad-feedback" role="status">{meldung}</p>}<details className="ad-lab"><summary>Vielfache des Divisors nachschlagen</summary><p>{Array.from({length:10},(_,i)=>i+' · '+a.zahlen[1]+' = '+i*a.zahlen[1]).join('　|　')}</p></details></>)}
 {schrift&&!test&&fertig&&nachAbschluss}
 {['geschichte','vergleich'].includes(a.ziel)&&<label>{a.ziel==='geschichte'?'Erkläre, was mit dem Rest passiert.':'Welchen Weg wählst du und warum?'}<textarea value={w.text??''} onChange={e=>edit('text',e.target.value)}/></label>}</div>;
}
export function Rueckmeldung({a,w}:{a:Aufgabe;w:Antworten}){const falsch=punkte(a,w).find(p=>!p.ok);return <p role="status" className="ad-feedback">{falsch?'Prüfe '+falsch.name+'. '+a.tipp:'Die prüfbaren Antworten stimmen. '+a.weg}</p>;}

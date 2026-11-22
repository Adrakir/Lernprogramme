import {useState} from 'react';
import {kurz} from '@/lib/addition';
import {plainNumber} from '@/lib/groessen-core';
import {punkte,zeilen,type Aufgabe,type Antworten,type Feld} from '@/lib/multiplikation';
type Props={a:Aufgabe;w:Antworten;set:(k:string,v:string)=>void;test:boolean;beiFehler?:()=>void};

function Eingabe({f,w,set}:{f:Feld}&Pick<Props,'w'|'set'>){
 return <label>{f.label}<input inputMode="numeric" value={w[f.key]??''} onChange={e=>set(f.key,e.target.value)}/></label>;
}
function Punktefeld({a}:{a:Aufgabe}){
 const [aktion,stellen]=useState(0),[h,b]=a.zahlen,gruppe=a.ziel==='gruppen',drehen=a.ziel==='tausch',geteilt=!gruppe&&!drehen&&aktion>0;
 const hoehe=gruppe?aktion:drehen&&aktion?b:h,breite=drehen&&aktion?h:b;
 const seite=Math.max(h,b),beschreibung=`${hoehe} ${hoehe===1?'Reihe':'Reihen'} mit je ${breite} Punkten`;
 return <div className="ad-lab"><svg className="mul-array" viewBox={`0 0 ${(drehen?seite:b)*15+8} ${(drehen?seite:h)*15+8}`} role="img" aria-label={beschreibung}>
 {Array.from({length:hoehe*breite},(_,i)=>{const x=i%breite,y=Math.floor(i/breite);return <circle className="mul-dot" key={drehen?aktion+'-'+i:i} cx={10+x*15} cy={10+y*15} r="5" fill={geteilt&&x>=10?'#a94b19':'#16736e'}/>;})}
 {geteilt&&<path d={`M152 1v${15*h}`} stroke="#243e56" strokeDasharray="3 2"/>}</svg><p aria-live="polite">{beschreibung}{geteilt?` · links 10 Spalten, rechts ${b-10}`:''}</p>
 <div className="ad-actions"><button className="btn ghost" disabled={gruppe&&aktion===h} onClick={()=>stellen(gruppe?aktion+1:1-aktion)}>{gruppe?'Eine Reihe legen':drehen?'Feld drehen':geteilt?'Teilfelder zusammenfügen':'Nach zehn Spalten teilen'}</button>{gruppe&&<button className="btn ghost" disabled={!aktion} onClick={()=>stellen(aktion-1)}>Eine Reihe wegnehmen</button>}</div></div>;
}
function Produkttafel({a,w}:{a:Aufgabe;w:Antworten}){
 const [x,y]=a.zahlen,breite=String(x*y).length,rows=zeilen(x,y);
 function zeile(label:string,s:string){return <tr key={label}><th scope="row">{label}</th>{Array.from({length:breite},(_,col)=><td key={col}>{s.at(col-breite)??' '}</td>)}</tr>;}
 return <div className="ad-scroll"><table className="ad-grid mul-table"><caption>Deine Teilprodukte nach Stellenwert</caption><thead><tr><th>Rechnung</th>{Array.from({length:breite},(_,i)=><th key={i}>{kurz[breite-i-1]}</th>)}</tr></thead><tbody>{rows.map(r=>zeile(kurz[r.stelle]+'-Zeile',w['p'+r.stelle]??''))}{zeile('Produkt',w.produkt??'')}</tbody></table></div>;
}
function Flaechenmodell({a}:{a:Aufgabe}){
 const [sichtbar,zeige]=useState(0),[x,b]=a.zahlen;
 const teile=zeilen(x,b).filter(r=>r.faktor>0).reverse();
 let links=0;
 return <details className="ad-lab"><summary>Teilprodukte als Rechteck erkunden</summary><p>Das Rechteck ist {x} Einheiten hoch und {b} Einheiten breit. Blende die Streifen einzeln ein.</p>
 <svg viewBox="0 0 300 90" role="img" aria-label={'Rechteck mit '+sichtbar+' eingeblendeten Teilflächen'}><rect x="2" y="5" width="294" height="76" fill="white" stroke="currentColor"/>{teile.map((r,i)=>{const left=links,width=294*r.faktor/b;links+=width;return i< sichtbar?<rect className="mul-dot" key={i} x={2+left} y="5" width={width} height="76" stroke="white" fill={['#14736c','#ab501d','#385e92'][i]}/>:null;})}</svg>
 <p aria-live="polite">{teile.slice(0,sichtbar).map(r=>x+' · '+r.faktor+' = '+r.wert).join(' | ')}</p><button className="btn ghost" disabled={sichtbar===teile.length} onClick={()=>zeige(sichtbar+1)}>Nächste Teilfläche zeigen</button> <button className="btn ghost" disabled={!sichtbar} onClick={()=>zeige(0)}>Von vorn</button></details>;
}
export function Aufgabenfelder({a,w,set,test,beiFehler}:Props){
 const [phase,weiter]=useState(0),[meldung,melde]=useState('');
 const schrift=a.ziel==='raster'||a.ziel==='nullstelle',s=a.schritte[phase],fertig=phase>=a.schritte.length;
 function pruefen(){const f=s.felder.find(f=>plainNumber(w[f.key]??'')!==f.wert);if(f){beiFehler?.();melde(f.hinweis);return;}weiter(phase+1);melde('');}
 const karten=w.karten?w.karten.split(',').map(Number):[];
 const edit=(k:string,v:string)=>{melde('');set(k,v);};
 return <div className="ad-fields"><p className="ad-prompt">{a.frage}</p>
 {schrift&&<><p>Multipliziere jede Ziffer des ersten Faktors von rechts nach links. Trage eine Ergebnisziffer und den Übertrag für die nächste Stelle ein.</p><Produkttafel a={a} w={w}/>{!test&&<><Flaechenmodell a={a}/>{phase>0&&<details><summary>Bisherige Rechenschritte ansehen</summary>{a.schritte.slice(0,phase).map(s=><p key={s.titel}><b>{s.titel}</b> · {s.felder.map(f=>f.label+': '+w[f.key]).join(', ')}</p>)}</details>}</>}</>}
 {['gruppen','tausch','zerlegen'].includes(a.ziel)&&<Punktefeld a={a}/>}
 {a.ziel==='probe'&&<div className="ad-lab"><div className="ad-actions">{a.zahlen.map(n=><button key={n} className="btn ghost" disabled={karten.includes(n)} onClick={()=>edit('karten',[...karten,n].join(','))}>{n}</button>)}</div><p>{karten[0]??'□'} : {karten[1]??'□'} = {karten[2]??'□'}</p><button className="btn ghost" disabled={!karten.length} onClick={()=>edit('karten',karten.slice(0,-1).join(','))}>Letzte Karte zurück</button></div>}
 {(schrift&&!test?(fertig?[]:[s]):a.schritte).map(step=><fieldset className="mul-step" key={step.titel}>{schrift&&<legend>{step.titel}</legend>}{step.rechnung&&!test&&<p>Rechne {step.rechnung}.</p>}{step.felder.map(f=><Eingabe key={f.key} f={f} w={w} set={edit}/>)}</fieldset>)}
 {schrift&&!test&&(fertig?<p className="ad-feedback" role="status">Alle Rechenschritte stimmen. {a.weg}</p>:<><button className="btn" onClick={pruefen}>Schritt prüfen</button>{meldung&&<p role="status" className="ad-feedback">{meldung}</p>}</>)}
 {['vergleich','geschichte'].includes(a.ziel)&&<label>{a.ziel==='geschichte'?'Dein Antwortsatz':'Welchen Weg wählst du und warum?'}<textarea value={w.text??''} onChange={e=>edit('text',e.target.value)}/></label>}</div>;
}
export function Rueckmeldung({a,w}:{a:Aufgabe;w:Antworten}){const falsch=punkte(a,w).find(p=>!p.ok);return <p className="ad-feedback" role="status">{falsch?'Prüfe '+falsch.name+'. '+a.tipp:'Die prüfbaren Antworten stimmen. '+a.weg}</p>;}

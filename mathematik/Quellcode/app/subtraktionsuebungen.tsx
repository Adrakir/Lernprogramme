import {useRef,useState} from 'react';
import {liste,punkte,type Aufgabe,type Werte} from '@/lib/subtraktion';
type Props={a:Aufgabe;w:Werte;set:(k:string,v:string)=>void;test:boolean};
export function Aufgabenfelder({a,w,set,test}:Props){
  const [eingabe,schreibe]=useState(''),[info,melde]=useState('');
  const [x,y]=a.zahlen,vor=a.t==='ergaenzen',sprung=vor||a.t==='sprung',schritte=liste(w.spruenge);
  const orte=[vor?x:y];for(const n of schritte)orte.push(orte.at(-1)!+(vor?n:-n));
  const pos=(n:number)=>16+(n-x)/(y-x)*328;
  const karten=liste(w.karten);
  const zeichnung=useRef<string[]|null>(null);
  function zeichne(e:React.PointerEvent<SVGSVGElement>,start:boolean){
    if(!start&&!zeichnung.current)return;
    const svg=e.currentTarget,pt=svg.createSVGPoint(),matrix=svg.getScreenCTM();if(!matrix)return;
    pt.x=e.clientX;pt.y=e.clientY;const ort=pt.matrixTransform(matrix.inverse());
    const strich=Math.round(ort.x)+','+Math.round(ort.y);
    if(start){svg.setPointerCapture(e.pointerId);zeichnung.current=[...(w.skizze??'').split('|').filter(Boolean),strich];}
    else{const lines=zeichnung.current!;lines[lines.length-1]+=' '+strich;}
    set('skizze',zeichnung.current!.join('|'));
  }
  function springen(){const n=Number(eingabe),rest=Math.abs(orte.at(-1)!-(vor?y:x));if(!Number.isInteger(n)||n<=0||n>rest){melde('Wähle eine positive ganze Sprungweite innerhalb der Strecke.');return;}set('spruenge',[...schritte,n].join(','));schreibe('');melde('');}
  return <div className="ad-fields"><p className="ad-prompt">{a.frage}</p>
    {sprung&&<div className="ad-lab"><svg viewBox="0 0 360 82" role="img" aria-label={'Dein Weg: '+orte.join(' → ')}><path d="M16 59H344" stroke="currentColor"/>{Array.from({length:y-x+1},(_,i)=><path key={i} d={`M${pos(x+i)} 59v${(x+i)%10===0?8:3}`} stroke="currentColor"/>)}{orte.slice(1).map((n,i)=><path key={i} className="sub-jump" d={`M${pos(orte[i])} 57 Q${(pos(n)+pos(orte[i]))/2} 1 ${pos(n)} 57`} fill="none" stroke="#107a76" strokeWidth="3"/>)}<circle cx={pos(orte.at(-1)!)} cy="58" r="4" fill="#a84d15"/><text x="16" y="80">{x}</text><text x="344" y="80" textAnchor="end">{y}</text></svg><p aria-live="polite">{orte.join(' → ')}</p><label>Sprungweite<input inputMode="numeric" value={eingabe} onChange={e=>schreibe(e.target.value)}/></label><button className="btn ghost" onClick={springen}>Springen</button> <button disabled={!schritte.length} className="btn ghost" onClick={()=>{set('spruenge',schritte.slice(0,-1).join(','));melde('');}}>Sprung zurücknehmen</button>{info&&<p role="status">{info}</p>}</div>}
    {a.t==='probe'&&<div className="ad-lab"><div className="ad-actions">{a.zahlen.map(n=><button className="btn ghost" disabled={karten.includes(n)} key={n} onClick={()=>set('karten',[...karten,n].join(','))}>{n}</button>)}</div><p>{karten[0]??'□'} + {karten[1]??'□'} = {karten[2]??'□'}</p><button className="btn ghost" disabled={!karten.length} onClick={()=>set('karten',karten.slice(0,-1).join(','))}>Letzte Karte zurück</button></div>}
    {a.t==='geschichte'&&<div className="ad-lab"><button className="btn ghost" onClick={()=>set('balken',w.balken==='ja'?'':'ja')}>{w.balken==='ja'?'Balken ausblenden':'Vergleich mit Balken zeichnen'}</button><p>Zeichne die Mengen mit Finger oder Maus. Mit der Schaltfläche kannst du zwei passende Balken einfügen.</p><svg viewBox="0 0 300 80" className="ad-sketch" aria-label="Zeichenfläche für deinen Mengenvergleich" onPointerDown={e=>zeichne(e,true)} onPointerMove={e=>zeichne(e,false)} onPointerUp={()=>{zeichnung.current=null}} onPointerCancel={()=>{zeichnung.current=null}}>{w.balken==='ja'&&<g><rect x="8" y="6" width="270" height="26" fill="#91d6cf"/><rect x="8" y="44" width={270*y/x} height="26" fill="#f4c480"/><text x="14" y="25">{x} Kinder</text><text x="14" y="63">{y} Kinder</text><path d={`M${8+270*y/x} 57H278`} stroke="currentColor" strokeDasharray="4 3"/></g>}{(w.skizze??'').split('|').filter(Boolean).map((s,i)=><polyline key={i} points={s} stroke="#345889" strokeWidth="2.2" fill="none"/>)}</svg><button className="btn ghost small" disabled={!w.skizze} onClick={()=>set('skizze','')}>Eigene Zeichnung löschen</button><label>Dein Antwortsatz<textarea value={w.satz??''} onChange={e=>set('satz',e.target.value)}/></label></div>}
    {a.t==='ausgleich'&&!test&&<details className="ad-lab"><summary>Hilfsaufgabe sichtbar machen</summary><p>{x} − {y+2} ergibt zwei weniger als {x} − {y}. Gib die zwei wieder zurück.</p></details>}
    {a.felder.map((f,i)=><label key={i}>{f.label}{f.wahl?<select value={w['f'+i]??''} onChange={e=>set('f'+i,e.target.value)}><option value="">Bitte wählen</option>{f.wahl.map(v=><option key={v}>{v}</option>)}</select>:<input inputMode="numeric" value={w['f'+i]??''} onChange={e=>set('f'+i,e.target.value)}/>}</label>)}
    {(a.t==='strategie'||a.t==='vergleich')&&<><label>Mein Rechenweg<select value={w.wahl??''} onChange={e=>set('wahl',e.target.value)}><option value="">Weg wählen</option>{['Ergänzen','Schrittweise abziehen','Schriftlich entbündeln','Hilfsaufgabe'].map(v=><option key={v}>{v}</option>)}</select></label><label>Meine Begründung<textarea value={w.grund??''} onChange={e=>set('grund',e.target.value)}/></label></>}
  </div>;
}
export function bereit(a:Aufgabe,w:Werte){return a.felder.every((_,i)=>w['f'+i]?.trim())&&(a.t!=='probe'||liste(w.karten).length===3)&&(!['sprung','ergaenzen'].includes(a.t)||liste(w.spruenge).length>0)&&(!['vergleich','strategie'].includes(a.t)||Boolean(w.wahl&&w.grund?.trim()))&&(a.t!=='geschichte'||Boolean(w.satz?.trim()));}
export function Rueckmeldung({a,w}:{a:Aufgabe;w:Werte}){const falsch=punkte(a,w).filter(p=>!p.ok);return <p className="ad-feedback" role="status">{falsch.length?'Prüfe noch einmal: '+falsch.map(p=>p.name).join(', ')+'. '+a.tipp:'Die prüfbaren Antworten stimmen. '+a.weg}</p>;}

import {useState} from 'react';
import {rechenweg,rasterpunkte,stellen,kurz,type Werte} from '@/lib/subtraktion';

export function Subtraktionsraster({zahlen,werte:w,schreiben,pruefung=false,beiFehler}:{zahlen:number[];werte:Werte;schreiben:(k:string,v:string)=>void;pruefung?:boolean;beiFehler?:()=>void}){
  const [a,b]=zahlen,cols=rechenweg(a,b),folge=cols.map((_,i)=>cols.length-1-i);
  const [phase,setPhase]=useState(-1),[tausch,setTausch]=useState(0),[modell,setModell]=useState(false),[meldung,setMeldung]=useState('');
  const c=cols[phase],bestand=c&&(tausch?c.tausch[tausch-1]:c.vorher);
  function check(){
    let fehler='';
    if(phase<0){const falsch=rasterpunkte(a,b,w).slice(0,2).find(p=>!p.ok);if(falsch)fehler=falsch.name+'. Beginne rechts bei den Einern. Freie Stellen links bleiben leer.';}
    else if(Number(w['v'+phase])!==c.verfuegbar||!w['v'+phase])fehler='Prüfe die verfügbaren Einheiten oben. Beachte, was die rechte Spalte schon gebraucht hat. Das Tauschmodell zeigt dir die Schritte.';
    else if(Number(w['e'+phase])!==c.rest||!w['e'+phase])fehler=`Die verfügbare Menge stimmt. Rechne jetzt ${c.verfuegbar} − ${c.abzug}.`;
    if(fehler){beiFehler?.();setMeldung(fehler);return;}
    setPhase(phase+1);setTausch(0);setModell(false);setMeldung(phase+1===cols.length?'Alle Spalten stimmen.':phase<0?'Beide Zahlen stehen richtig. Beginne rechts.':'Diese Spalte stimmt. Gehe eine Stelle nach links.');
  }
  function feld(k:string,label:string,aktiv:boolean,len=1){return <input aria-label={label} inputMode="numeric" maxLength={len} value={w[k]??''} disabled={!pruefung&&!aktiv} onChange={e=>{if(/^\d*$/.test(e.target.value)){schreiben(k,e.target.value);setMeldung('');}}}/>;}
  return <div><h3>{a} − {b}</h3><p>{pruefung?'Richte beide Zahlen aus. Trage je Spalte die oben verfügbaren Einheiten nach dem Entbündeln und die Ergebnisziffer ein.':phase<0?'Trage die Zahlen stellenrichtig ein. Die Zahl, von der du abziehst, steht oben.':c?`Bearbeite die ${stellen[phase]}spalte. Wie viele Einheiten hast du oben nach dem Tauschen? Wie viele bleiben nach dem Abziehen?`:'Lies die Differenz von links nach rechts.'}</p>
    <div className="ad-scroll"><table className="ad-grid"><thead><tr><th>Stelle</th>{folge.map(i=><th key={i} className={phase===i?'current':''}>{kurz[i]}</th>)}</tr></thead><tbody>
    {zahlen.map((_,j)=><tr key={j}><th scope="row">{j?'− Zahl 2':'Zahl 1'}</th>{folge.map(i=><td key={i}>{feld('s'+j+'-'+i,'Zahl '+(j+1)+' · '+stellen[i],phase<0)}</td>)}</tr>)}
    {[['v','Verfügbar'],['e','Differenz']].map(([key,label])=><tr className={key==='e'?'ad-result':'ad-carry'} key={key}><th scope="row">{label}</th>{folge.map(i=><td key={i}>{feld(key+i,label+' · '+stellen[i],phase===i,key==='v'?2:1)}</td>)}</tr>)}</tbody></table></div>
    {!pruefung&&phase<cols.length&&<div className="ad-actions"><button className="btn" onClick={check}>{phase<0?'Ausrichtung prüfen':'Spalte prüfen'}</button>{c&&<button className="btn ghost" onClick={()=>setModell(!modell)}>{modell?'Modell schließen':'Tauschmodell öffnen'}</button>}</div>}
    {modell&&c&&<div className="ad-bundle"><p>So ist die obere Zahl für diese Spalte aufgeteilt. Bei jedem Tausch bleibt ihr Wert gleich.</p><div className="sub-places">{folge.map(i=><div key={i}><b>{bestand[i]} {stellen[i]}</b><div key={tausch}>{Array.from({length:bestand[i]},(_,j)=><i className="ad-one" key={j}/>)}</div></div>)}</div>
    {tausch<c.tausch.length?<button className="btn ghost" onClick={()=>setTausch(tausch+1)}>Eine Einheit in zehn kleinere tauschen</button>:<p>{c.tausch.length?'Jetzt reicht die Menge in dieser Spalte.':'Hier reicht die Menge bereits.'}</p>}
    {tausch>0&&<button className="btn ghost small" onClick={()=>setTausch(tausch-1)}>Tausch zurück</button>}</div>}
    {meldung&&<p className="ad-feedback" role="status">{meldung}</p>}{!pruefung&&phase===cols.length&&<strong>{a} − {b} = {a-b}</strong>}</div>;
}

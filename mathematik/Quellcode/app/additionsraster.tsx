import {Rastertasten} from './rastertasten';
import {NaechstesFeld} from './werkstatt-basis';
import {useState} from 'react';
import {ausrichtung,kurz,spalten,stellen,uebertragRichtig,type Werte} from '@/lib/addition';
import {fmtNum} from '@/lib/groessen-core';

type Props={zahlen:number[];werte:Werte;schreiben:(key:string,wert:string)=>void;pruefung?:boolean;nachAbschluss?:React.ReactNode;beiFehler?:()=>void;geschafft?:()=>void};
export function Buendeln({summe,stelle,beiTausch}:{summe:number;stelle:number;beiTausch?:(anzahl:number)=>void}){
  const [gruppen,setGruppen]=useState(0);
  const rest=summe-gruppen*10;
  function tausche(n:number){setGruppen(n);beiTausch?.(n);}
  return <div className="ad-bundle"><p><b>{summe} {stellen[stelle]}</b> liegen in dieser Spalte. Tausche jeweils zehn gegen eine Einheit der nächsten Stelle.</p>
    <div className="ad-trays"><div><small>{stellen[stelle+1]}</small><div>{Array.from({length:gruppen},(_,i)=><i key={i} className="ad-ten"/>)}</div></div>
    <div><small>{stellen[stelle]}</small><div>{Array.from({length:rest},(_,i)=><i key={i} className="ad-one"/>)}</div></div></div>
    <button type="button" className="btn ghost small" disabled={rest<10} onClick={()=>tausche(gruppen+1)}>Zehn bündeln</button>
    <button className="btn ghost small" disabled={!gruppen} onClick={()=>tausche(gruppen-1)}>Bündel zurücktauschen</button>
    <table className="ad-grid"><caption>Vom Material ins Stellenwertraster</caption><thead><tr><th>{stellen[stelle+1]}</th><th>{stellen[stelle]}</th></tr></thead><tbody><tr><td>{gruppen||'–'}</td><td>{rest}</td></tr></tbody></table>
    <p role="status">{gruppen} {stellen[stelle+1]} und {rest} {stellen[stelle]}.</p></div>;
}
export function Additionsraster({zahlen,werte:w,schreiben,pruefung=false,nachAbschluss,beiFehler,geschafft}:Props){
  const cols=spalten(zahlen),breite=cols.length,folge=cols.map((_,j)=>breite-1-j);
  const [phase,setPhase]=useState(-1),[meldung,setMeldung]=useState(''),[modell,setModell]=useState(false);
  const [modellUebertrag,zeigeUebertrag]=useState(0);
  const fertig=phase===breite,c=cols[phase];
  function feld(key:string,label:string,aktiv:boolean){
    return <input placeholder={modell&&modellUebertrag>0&&key==='u'+(phase+1)?String(modellUebertrag):undefined} data-feld={key} onKeyDown={NaechstesFeld} enterKeyHint="next" aria-label={label} inputMode="numeric" autoComplete="off" maxLength={1} value={w[key]??''} disabled={!pruefung&&!aktiv} onChange={e=>{if(/^\d?$/.test(e.target.value)){schreiben(key,e.target.value);setMeldung('')}}}/>;
  }
  function check(){
    if(phase<0){
      const idx=zahlen.findIndex((_,j)=>!ausrichtung(zahlen,w,j));
      if(idx>=0){beiFehler?.();const t=String(zahlen[idx]);setMeldung(`Prüfe Zahl ${idx+1}: Ihre Einerziffer ${t.at(-1)} gehört ganz nach rechts. Lies von dort jede weitere Ziffer; links vor der Zahl bleiben Kästchen leer.`);return;}
      setPhase(0);setMeldung('Alle Summanden stehen richtig. Beginne bei den Einern.');return;
    }
    if(w['e'+phase]!==String(c.ziffer)){beiFehler?.();
      setMeldung(c.eingang&&Number(w['e'+phase])===(c.summe-c.eingang)%10?`Du hast die Ziffern der Summanden zusammengezählt. Aus der rechten Nachbarspalte kommen noch ${c.eingang} ${stellen[phase]} dazu. Prüfe nur diese Spalte.`:`Rechne ${c.ziffern.join(' + ')}${c.eingang?' + '+c.eingang+' aus der Übertragszeile':''}. Welche Ziffer bleibt bei den ${stellen[phase]}n?`);return;
    }
    if(phase+1<breite&&!uebertragRichtig(w,phase+1,cols[phase+1])){beiFehler?.();setMeldung(`Die Ergebnisziffer stimmt. Wie viele ganze Zehnergruppen stecken in ${c.summe}? Trage sie eine Spalte weiter links ein.`);return;}
    setPhase(phase+1);setModell(false);setMeldung(phase+1===breite?'Alle Spalten stimmen.':'Diese Spalte stimmt. Weiter links geht es weiter.');
    if(phase+1===breite)geschafft?.();
  }
  return <div className="ad-grid-work"><h3>{zahlen.map(n=>fmtNum(n)).join(' + ')}</h3>
    <p>{pruefung?'Schreibe Summanden, Überträge und Ergebnis selbst ins Raster.':phase<0?'Schreibe jede Zahl in eine eigene Zeile. Setze die Einer untereinander.':fertig?'Lies deine Summe von links nach rechts.':`Jetzt bei den ${stellen[phase]}n: Welche Ziffer bleibt? Wie viele Gruppen gibst du nach links weiter?`}</p>
    <Rastertasten loeschen={schreiben}><div className="ad-scroll"><table className="ad-grid"><thead><tr><th scope="col">Stelle</th>{folge.map(i=><th key={i} scope="col" className={i===phase?'current':''}>{kurz[i]}</th>)}</tr></thead><tbody>
    {zahlen.map((_,j)=><tr key={j}><th scope="row">{j===0?'Zahl 1':'+ Zahl '+(j+1)}</th>{folge.map(i=><td key={i}>{feld('s'+j+'-'+i,'Zahl '+(j+1)+' · '+stellen[i],phase===-1)}</td>)}</tr>)}
    <tr className="ad-carry"><th scope="row">Übertrag</th>{folge.map(i=><td key={i}>{i>0?feld('u'+i,'Übertrag · '+stellen[i],phase===i-1):'–'}</td>)}</tr>
    <tr className="ad-result"><th scope="row">Summe</th>{folge.map(i=><td className={phase===i?'current':''} key={i}>{feld('e'+i,'Summe · '+stellen[i],phase===i)}</td>)}</tr></tbody></table></div></Rastertasten>
    {!pruefung&&!fertig&&<div className="ad-actions"><button type="button" className="btn" onClick={check}>{phase<0?'Ausrichtung prüfen':'Spalte prüfen'}</button>{c&&phase<breite-1&&<button className="btn ghost" onClick={()=>{zeigeUebertrag(0);setModell(!modell)}}>{modell?'Modell schließen':'Mit Plättchen bündeln'}</button>}</div>}
    {!pruefung&&modell&&c&&<Buendeln key={phase} summe={c.summe} stelle={phase} beiTausch={zeigeUebertrag}/>}
    {meldung&&<p className="ad-feedback" role="status">{meldung}</p>}
    {!pruefung&&fertig&&<p><b>{zahlen.map(n=>fmtNum(n)).join(' + ')} = {fmtNum(zahlen.reduce((s,n)=>s+n,0))}</b></p>}{!pruefung&&fertig&&nachAbschluss}</div>;
}

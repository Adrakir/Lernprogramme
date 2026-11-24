import {useRef, useState} from 'react';
import {Buendeln} from './additionsraster';
import {Punktefeld} from './multiplikationsuebungen';
import {Buendel} from './groessen-modelle';
import {aufgabe} from '@/lib/multiplikation';

const punkte = aufgabe('zerlegen', 0);
const modelle = {uebertrag:'Übertrag zeigen',punkte:'Punktefeld zerlegen',minuten:'Minuten bündeln'} as const;
function Zahlenwahl({label,wert,min,max,set}:{label:string;wert:number;min:number;max:number;set:(v:number)=>void}) {
  return <label>{label}<select aria-label={label} value={wert} onChange={e=>set(Number(e.target.value))}>
    {Array.from({length:max-min+1},(_,i)=>min+i).map(n=><option key={n}>{n}</option>)}
  </select></label>;
}
type Modell = keyof typeof modelle;

export function Tafelmodelle() {
  const startknopf=useRef<HTMLButtonElement|null>(null);
  const aktuell=useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [modell, waehlen] = useState<Modell>('uebertrag');
  const [loesung, zeigen] = useState(false);
  const [runde, zurueck] = useState(0);
  function neu() { zeigen(false); zurueck(n => n + 1); }
  function oeffnen(id: Modell) { waehlen(id); setVergleich(null);neu(); dialog.current?.showModal(); }
  const [links,setLinks]=useState(8),[rechts,setRechts]=useState(5);
  const [reihen,setReihen]=useState(punkte.zahlen[0]),[spalten,setSpalten]=useState(punkte.zahlen[1]);
  const [start,setStart]=useState(59);
  const [vergleich,setVergleich]=useState<{bild:HTMLElement;frage:string}|null>(null);
  function festhalten(){
    if(vergleich){setVergleich(null);return;}
    if(!aktuell.current)return;
    const bild=aktuell.current.cloneNode(true) as HTMLElement;
    bild.querySelectorAll('button,label,input,select,.gt-fine,.gw-lab-controls').forEach(e=>e.remove());
    bild.querySelectorAll('[aria-live],[role="status"]').forEach(e=>{e.removeAttribute('aria-live');e.removeAttribute('role');});
    setVergleich({bild,frage});
  }
  const summe=links+rechts, ende=start+1;
  const titel=modelle[modell];
  const frage=modell==='uebertrag' ? `Brauchen ${links} + ${rechts} Einer einen Übertrag? Wie viele Einer bleiben?` :
    modell==='punkte' ? `Wie kannst du ${reihen} Reihen mit je ${spalten} Punkten in zwei Teilfelder zerlegen?` :
    `Du startest bei ${start} Minuten. Was ändert sich, wenn eine Minute hinzukommt?`;
  const erklaerung=modell==='uebertrag' ? `${links} + ${rechts} = ${summe}. ${summe>=10?'Du bündelst einen Zehner. In der Einerspalte bleibt die '+(summe%10)+'.':'Alle Einer bleiben in der Einerspalte. Es gibt keinen Übertrag.'}` :
    modell==='punkte' ? `${reihen} · ${spalten} = ${reihen} · 10 + ${reihen} · ${spalten-10} = ${reihen*10} + ${reihen*(spalten-10)} = ${reihen*spalten}.` :
    `${start} min + 1 min = ${ende} min. ${Math.floor(ende/60)} h und ${ende%60} min.`;
  function auswahl(label:string,wert:number,min:number,max:number,set:(v:number)=>void) {
    return <Zahlenwahl {...{label,wert,min,max}} set={n=>{set(n);neu();}}/>;
  }
  return <section className="panel"><h2>Modelle für die Tafel</h2>
    <div className="ad-actions">{(Object.keys(modelle) as Modell[]).map(id =>
      <button className="btn ghost" key={id} onClick={e => {startknopf.current=e.currentTarget;oeffnen(id);}}>{modelle[id]}</button>)}</div>
    <dialog className="tafel-dialog" ref={dialog} aria-labelledby="tafel-titel" onClose={()=>{neu();startknopf.current?.focus();}}>
      <div className="tafel-kopf"><h2 id="tafel-titel">{titel}</h2><button className="btn ghost" onClick={() => dialog.current?.close()}>Schließen</button></div>
      <div className="ad-actions">{modell==='uebertrag'?<>{auswahl('Erster Summand',links,0,9,setLinks)}{auswahl('Zweiter Summand',rechts,0,9,setRechts)}</> :
        modell==='punkte'?<>{auswahl('Reihen',reihen,2,9,setReihen)}{auswahl('Spalten',spalten,11,19,setSpalten)}</> :
        auswahl('Start in Minuten',start,0,119,setStart)}</div>
      <p className="tafel-frage">{frage}</p>
      <button className="btn ghost" onClick={festhalten}>{vergleich?'Vergleich schließen':'Beispiel zum Vergleich festhalten'}</button>
      <div className={vergleich?'tafel-vergleich':''}>{vergleich&&<section className="panel"><h3>Erstes Beispiel</h3>
       <p>{vergleich.frage}</p><div ref={node=>{node?.replaceChildren(vergleich.bild);}}/></section>}
      {dialog.current?.open && <div ref={aktuell} key={runde} className="tafel-modell">
        {modell === 'uebertrag' && <Buendeln summe={summe} stelle={0}/>}
        {modell === 'punkte' && <Punktefeld a={{...punkte,zahlen:[reihen,spalten]}}/>}
        {modell === 'minuten' && <Buendel paar={['min','h',60]} startwert={start} tafel/>}
      </div>}</div>
      <div className="ad-actions"><button className="btn" aria-expanded={loesung} onClick={() => zeigen(!loesung)}>{loesung ? 'Ergebnis ausblenden' : 'Ergebnis einblenden'}</button><button className="btn ghost" onClick={neu}>Modell zurücksetzen</button></div>
      {loesung && <p className="tafel-frage" role="status">{erklaerung}</p>}
    </dialog>
  </section>;
}

import {useEffect, useState} from 'react';
import {fmtNum} from '@/lib/groessen-core';
import {zeitZerlegen} from '@/lib/denkaufgaben';
import {Feinschritt} from './groessen-aufbaulabor';
import {uhr} from '@/lib/zeit-tasks';

const paare = {
  laenge: [['mm','cm',10],['cm','dm',10],['cm','m',100],['m','km',1000]],
  masse: [['g','kg',1000],['mg','g',1000],['kg','t',1000]],
  zeit: [['min','h',60],['s','min',60],['h','Tag',24]]
} as const;
type Thema = keyof typeof paare;

// Eine Wiedergabe endet genau am Ziel und wird beim Verlassen des Modells beendet.
function useAnimation(max: number, increment: number, startwert = 0, halt?:number) {
  const [wert, setWert] = useState(startwert);
  const [laeuft, setLaeuft] = useState(false);
  useEffect(() => {
    if (!laeuft) return;
    if (wert >= max) { setLaeuft(false); return; }
    const id = window.setTimeout(() => {
      const naechster=Math.min(max,wert+increment);
      if(halt!==undefined && wert<halt && naechster>=halt){setWert(halt);setLaeuft(false);}else setWert(naechster);
    },75);
    return () => window.clearTimeout(id);
  }, [wert, max, increment, laeuft, halt]);
  function einstellen(n: number) { setLaeuft(false); setWert(n); }
  function starten() { if (wert >= max) setWert(0); setLaeuft(!laeuft); }
  return {wert, einstellen, starten, laeuft};
}

function Steuerung({lauf, max, label, einheit}: {lauf: ReturnType<typeof useAnimation>; max:number; label:string; einheit:string}) {
  return <div className="gw-lab-controls"><label>{label} <input type="range" min={0} max={max} value={lauf.wert} aria-valuetext={lauf.wert+' '+einheit} onChange={e=>lauf.einstellen(Number(e.target.value))}/></label>
    <Feinschritt name={label} wert={lauf.wert} min={0} max={max} set={lauf.einstellen}/>
    <button type="button" className="btn ghost small" onClick={lauf.starten}>{lauf.laeuft?'Pause':'Animation starten'}</button>
    <button type="button" className="btn ghost small" onClick={()=>lauf.einstellen(0)}>Auf null</button></div>;
}

export function Buendel({paar, tafel=false, startwert}: {paar: readonly [string,string,number]; tafel?:boolean; startwert?:number}) {
  const [klein,gross,faktor]=paar;
  const [halt,setHalt]=useState<number|undefined>(tafel?59:undefined);
  const lauf=useAnimation(2*faktor,Math.max(1,Math.floor(faktor/30)), startwert ?? (tafel ? faktor-1 : 0),halt);
  const [ziel, setZiel]=useState(1);
  const [pruefung,setPruefung]=useState<{wert:number; text:string} | null>(null);
  const anteile=[1.5,0.5,1,2];
  const zielwert=anteile[ziel]*faktor;
  return <><p>Ein voller Balken entspricht <b>1 {gross}</b>. Fülle beide Balken und beobachte die Einheitengrenze.</p>
    <div className="gw-bundles">{[0,1].map(i=><div key={i}><span className="gw-bundle-track"><i style={{width:Math.min(100, Math.max(0,(lauf.wert/faktor-i)*100))+'%'}}/></span><small>{i+1} {gross==='Tag' && i===1?'Tage':gross}</small></div>)}</div>
    {tafel ? <p>{lauf.wert} {klein}</p> : <p className="gw-lab-result"><b>{fmtNum(lauf.wert)} {klein}</b> = {klein==='min'&&gross==='h'?zeitZerlegen(lauf.wert).stunden:Math.floor(lauf.wert/faktor)} {gross==='Tag'&&lauf.wert>=2*faktor?'Tage':gross} + {lauf.wert%faktor} {klein}</p>}
    {tafel&&<label>Automatischer Haltepunkt<select value={halt??''} onChange={e=>setHalt(e.target.value===''?undefined:+e.target.value)}><option value="">Ohne Halt</option>{Array.from({length:119},(_,i)=><option key={i} value={i+1}>{i+1} min</option>)}</select></label>}
    <Steuerung lauf={lauf} max={2*faktor} label={'Menge in '+klein} einheit={klein}/>
    {!tafel && <><p><b>Dein Auftrag</b> · Stelle {fmtNum(anteile[ziel])} {gross==='Tag' && anteile[ziel]!==1?'Tage':gross} mit dem Regler ein.</p>
    <div className="gw-row"><button className="btn small" onClick={()=>{lauf.einstellen(lauf.wert);setPruefung({wert:lauf.wert,text:lauf.wert===zielwert?'Richtig! '+zielwert+' '+klein+' entsprechen genau der gesuchten Menge.':lauf.wert<zielwert?'Deine Menge ist noch zu klein.':'Deine Menge ist zu groß.'});}}>Einstellung prüfen</button>
    <button className="btn ghost small" onClick={()=>{lauf.einstellen(0);setPruefung(null);setZiel((ziel+1)%anteile.length);}}>Neuer Auftrag</button></div>
    <p role="status">{pruefung?.wert === lauf.wert && !lauf.laeuft ? pruefung.text : ''}</p></>}</>;
}
export function BuendelModell({thema}: {thema:Thema}) {
  const [index,setIndex]=useState(0);
  return <div className="gw-lab"><label>Einheitenpaar <select value={index} onChange={e=>setIndex(Number(e.target.value))}>{paare[thema].map(([a,b],i)=><option key={a+b} value={i}>{a} → {b}</option>)}</select></label>
    <Buendel key={thema+index} paar={paare[thema][index]}/></div>;
}

export function UhrModell({vorhersage=false}: {vorhersage?:boolean} = {}) {
  const [dauer,setDauer]=useState(25);
  const [marke,setMarke]=useState(0);
  const [start,setStart]=useState(8*60+45);
  const [halt,setHalt]=useState(0);
  const lauf=useAnimation(vorhersage?dauer:120,1,0,halt||undefined);
  const ende=start+lauf.wert;
  return <div className="gw-lab"><label>Startzeit <select value={start} onChange={e=>{lauf.einstellen(0);setStart(Number(e.target.value));}}>{[525,905,1420].map(m=><option value={m} key={m}>{uhr(m)} Uhr</option>)}</select></label>
    {vorhersage&&<><p>Wo steht der Minutenzeiger nach der gewählten Dauer? Setze zuerst deine orange Zielmarke und starte die Uhr.</p><label>Dauer <select value={dauer} onChange={e=>{lauf.einstellen(0);setHalt(0);setDauer(+e.target.value)}}>{[15,25,35,50].map(n=><option key={n} value={n}>{n} Minuten</option>)}</select></label><label>Zielmarke bei Minute <select value={marke} onChange={e=>{lauf.einstellen(0);setMarke(+e.target.value)}}>{Array.from({length:12},(_,i)=><option key={i} value={i*5}>{i*5}</option>)}</select></label></>}
    <svg viewBox="0 0 200 200" className="gw-clock" role="img" aria-label={'Uhr zeigt '+uhr(ende)}><circle cx="100" cy="100" r="94" fill="#f2f7ff" stroke="#26395c" strokeWidth="3"/>
      {Array.from({length:60},(_,i)=><line key={i} x1="100" x2="100" y1="10" y2={i%5===0?20:14} stroke="#385078" strokeWidth={i%5===0?3:1} transform={'rotate('+i*6+' 100 100)'}/>)}
      {[12,3,6,9].map((n,i)=><text key={n} x={100+68*Math.sin(i*Math.PI/2)} y={105-68*Math.cos(i*Math.PI/2)} textAnchor="middle" fill="#15365c" fontWeight="bold">{n}</text>)}
      {vorhersage&&<circle cx="100" cy="14" r="6" fill="#d7781b" stroke="#763b00" transform={'rotate('+marke*6+' 100 100)'}/>}
      <line x1="100" y1="100" x2="100" y2="54" stroke="#233b64" strokeWidth="7" strokeLinecap="round" transform={'rotate('+ende/2+' 100 100)'}/>
      <line x1="100" y1="100" x2="100" y2="30" stroke="#057c77" strokeWidth="4" strokeLinecap="round" transform={'rotate('+ende*6+' 100 100)'}/><circle cx="100" cy="100" r="5" fill="#233b64"/></svg>
    <p className="gw-lab-result">{uhr(start)} Uhr + {lauf.wert} min = <b>{uhr(ende)} Uhr{ende>=1440?' am nächsten Tag':''}</b></p>
    <label>Wiedergabe anhalten nach<select value={halt} onChange={e=>setHalt(+e.target.value)}><option value={0}>Ohne Halt</option>{Array.from({length:vorhersage?dauer:120},(_,i)=><option key={i} value={i+1}>{i+1} min</option>)}</select></label><Steuerung lauf={lauf} max={vorhersage?dauer:120} label="Vergangene Minuten" einheit="min"/>{vorhersage && lauf.wert===dauer && <p role="status">{ende%60===marke?'Deine Vorhersage stimmt.':'Vergleiche deine Marke mit dem langen Zeiger.'} Zielmarke: Minute {marke}. Ergebnis: Minute {ende%60}.</p>}</div>;
}

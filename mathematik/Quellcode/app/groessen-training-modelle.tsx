import {useState} from 'react';
import {fmtNum as f,plainNumber} from '@/lib/groessen-core';
import {uhr} from '@/lib/zeit-tasks';
import type {Bild} from '@/lib/groessen-training';
import {Feinschritt} from './groessen-aufbaulabor';
type Props={bild:Bild;werte:string[];set:(i:number,v:string)=>void;hilfe:boolean;reduziert?:boolean};
const x=(v:number,max:number)=>20+v/max*560;
function Skala({step, tick,reduziert}:{step:number;tick:number;reduziert?:boolean}) {
  const pos=(i:number,r:number)=>[150+r*Math.cos(Math.PI*(1-i/20)),145-r*Math.sin(Math.PI*(1-i/20))];
  const [px,py]=pos(tick,92);
  return <svg className="gt-dial" viewBox="0 0 300 165" role="img" aria-label={`Waage von 0 bis ${20*step} Gramm, 20 gleiche Abstände. Der Zeiger steht am ${tick}. Strich nach null.`}>
    <path d="M 20 145 A 130 130 0 0 1 280 145" fill="#eff6ff" stroke="#405e83"/>
    {Array.from({length:21},(_,i)=>{const [a,b]=pos(i,116),[c,d]=pos(i,i%5?110:102),[tx,ty]=pos(i,87);return <g key={i}><line x1={a} y1={b} x2={c} y2={d} stroke="#263953" strokeWidth="2"/>{i%10===0&&(!reduziert||i===0)&&<text x={tx} y={ty+5} textAnchor="middle">{f(i*step)}</text>}</g>})}
    <line x1="150" y1="145" x2={px} y2={py} stroke="#b44326" strokeWidth="4"/><circle cx="150" cy="145" r="6" fill="#173960"/><text x="150" y="120" textAnchor="middle">g</text></svg>;
}
function Zeitlinie({a,b}:{a:number;b:number}){
  const [pos,setPos]=useState(a+1),[stops,setStops]=useState<number[]>([]);
  const punkte=[a,...stops,b];
  return <><label>Zwischenstopp bei {uhr(pos)} Uhr<input type="range" min={a+1} max={b-1} value={pos} onChange={e=>setPos(+e.target.value)}/></label>
    <Feinschritt name="Zwischenstopp" wert={pos} min={a+1} max={b-1} set={setPos}/>
    <button className="btn ghost small" type="button" disabled={stops.includes(pos)} onClick={()=>setStops([...stops,pos].sort((l,r)=>l-r))}>Stopp setzen</button>
    <div className="gt-time-track">{punkte.map((v,i)=><span key={v} style={{left:(v-a)/(b-a)*100+'%'}} title={uhr(v)}>{i+1}</span>)}</div>
    <p>{punkte.map(uhr).join(' → ')} Uhr</p>{stops.length>0&&<><p>Teilstrecken: {punkte.slice(1).map((v,i)=>(v-punkte[i])+' min').join(' + ')}</p><button type="button" className="btn ghost small" onClick={()=>setStops([])}>Stopps zurücksetzen</button></>}</>;
}
function Regler({name,min=0,max,step=1,value,set}:{name:string;min?:number;max:number;step?:number;value:number;set:(n:number)=>void}){
  return <div><label>{name}<input type="range" min={min} max={max} step={step} value={value} onChange={e=>set(+e.target.value)}/></label><Feinschritt name={name} wert={value} min={min} max={max} schritt={step} set={set}/></div>;
}
export function TrainingsBild({bild,werte,set,hilfe,reduziert}:Props){
  const [wechsel,setWechsel]=useState(false),[zugabe,setZugabe]=useState(0);
  const [a,b]=bild.daten;
  const [ausschnitt,setAusschnitt]=useState(1000);
  const val=(i:number)=>plainNumber(werte[i]??'')??0;
  const svg=(children:React.ReactNode,label:string)=><svg viewBox="0 0 600 110" className="gt-wide" role="img" aria-label={label}>{children}</svg>;
  let modell:React.ReactNode;
  switch(bild.typ){
    case 'lineal':
      modell=<>{svg(<><path d={`M${x(a,120)} 25 h${x(b-a,120)-20-10} l10 6 -10 6 H${x(a,120)}z`} fill="#e0a340" stroke="#283950"/>
        {Array.from({length:121},(_,i)=><g key={i}><path d={`M${x(i,120)} 55v${i%10===0?20:i%5===0?13:7}`} stroke="#354763"/>{i%10===0&&(!reduziert||i===0)&&<text x={x(i,120)} y="96" textAnchor="middle">{i/10}</text>}</g>)}
        {hilfe&&wechsel&&<path key={werte.slice(0,2).join('-')} className="gt-interval" pathLength="1" d={`M${x(val(0)*10,120)} 48 H${x(val(1)*10,120)}`} stroke="#128779" strokeWidth="6"/>}{[0,1].map(i=>werte[i]&&<line key={i} x1={x(val(i)*10,120)} x2={x(val(i)*10,120)} y1="12" y2="76" stroke={i?'#a13e2c':'#087f80'} strokeWidth="2" strokeDasharray="4 3"/>)}</>,`Lineal in mm. Die Enden liegen bei den Millimeterstrichen ${a} und ${b}.`)}
        {hilfe&&<>{[0,1].map(i=><Regler key={i} name={i?'Endmarke (cm)':'Startmarke (cm)'} max={12} step={0.1} value={val(i)} set={v=>set(i,f(v))}/>)}<button className="btn ghost small" type="button" disabled={!werte[0]||!werte[1]} onClick={()=>setWechsel(!wechsel)}>{wechsel?'Messstrecke ausblenden':'Abstand zwischen den Marken zeigen'}</button></>}</>;break;
    case 'skala':modell=<Skala step={a} tick={b} reduziert={reduziert}/>;break;
    case 'strecke':modell=<>{svg(<><path d="M20 55H580" stroke="#286559" strokeWidth="8"/>{[0,100,500,1000].filter(v=>v<=ausschnitt).map(v=><g key={v}><path d={`M${x(v,ausschnitt)} 45v22`} stroke="#183650"/><text x={x(v,ausschnitt)} y="90" textAnchor={v===ausschnitt?'end':v===0?'start':'middle'}>{wechsel?f(v/1000)+' km':v+' m'}</text></g>)}{val(0)<=ausschnitt&&<circle cx={x(val(0),ausschnitt)} cy="54" r="8" fill="#c34923"/>}</>,'Weg von 0 bis 1 km mit umschaltbarer Beschriftung')}
      <label>Kartenausschnitt<select value={ausschnitt} onChange={e=>setAusschnitt(+e.target.value)}><option value={100}>Nahansicht · erste 100 m</option><option value={500}>Erste 500 m</option><option value={1000}>Gesamtstrecke · 1 km</option></select></label>{val(0)>ausschnitt&&<p>Die Wegmarke liegt außerhalb dieses Ausschnitts.</p>}<Regler name="Wegmarke (m)" max={1000} step={10} value={val(0)} set={v=>set(0,String(v))}/><button type="button" className="btn ghost small" onClick={()=>setWechsel(!wechsel)}>{wechsel?'Meterskala':'Kilometerskala'} zeigen</button></>;break;
    case 'stellen':modell=<><Regler name="Meterstreifen legen" max={9} value={val(0)} set={v=>set(0,String(v))}/><Regler name="Zentimeterstücke legen" max={99} value={val(1)} set={v=>set(1,String(v))}/>
      <p>Gelegt: {f(val(0))} m + {f(val(1))} cm</p><div className="gt-compare"><i style={{width:Math.min(100,(val(0)*100+val(1))/10)+'%'}}/></div>
      {hilfe&&werte[2]&&<p>Zum Vergleich: Deine letzte Eingabe entspricht {f(val(2)*(bild.daten[2]?1:100))} cm.<span className="gt-compare second"><i style={{width:Math.min(100,val(2)*(bild.daten[2]?1:100)/10)+'%'}}/></span></p>}</>;break;
    case 'dose':modell=<><div className={'gt-tin '+(wechsel?'open':'')}><i/><span>{wechsel?'Inhalt':'Dose mit Inhalt'}</span></div><button type="button" className="btn ghost small" onClick={()=>setWechsel(!wechsel)}>{wechsel?'Dose zusammensetzen':'Verpackung abnehmen'}</button><p>{wechsel?`Hülle: ${a} g · Inhalt: gesucht`:`Gesamtmasse: ${a+b} g`}</p></>;break;
    case 'ordnen':modell=<>{[0,1,2].map((i)=><Regler key={i} name={'Karte '+(i+1)+' platzieren (g)'} min={a} max={b} step={10} value={werte[i]?val(i):a} set={v=>set(i,String(v))}/>)}{svg(<><path d="M20 75H580" stroke="#28517b" strokeWidth="3"/>{[a,b].map(v=><text key={v} x={x(v-a,b-a)} y="98" textAnchor={v===a?'start':'end'}>{v} g</text>)}{[0,1,2].map(i=>werte[i]&&<g key={i} transform={`translate(${x(val(i)-a,b-a)} ${15+i*17})`}><line x1="0" y1="0" x2="0" y2={60-i*17} stroke="#286559"/><text x="4" y="0">K{i+1}</text></g>)}</>,'Gewichtslinie. Gleiche Werte stehen übereinander.')}</>;break;
    case 'rezept':modell=<><Regler name="Mehl nachfüllen (g)" max={b} step={10} value={zugabe} set={setZugabe}/><progress value={a+zugabe} max={a+b}/><p>Nachgefüllt: {zugabe} g · Waage: {a+zugabe} g. {a+zugabe===b?'Ziel erreicht.':a+zugabe>b?'Über dem Rezeptgewicht.':'Unter dem Rezeptgewicht.'}</p></>;break;
    case 'zeitlinie':modell=<Zeitlinie a={a} b={b}/>;break;
  }
  return <div className="gt-model">{modell}</div>;
}

export function Messauftrag(){
  const [obj,setObj]=useState('Bleistift'),[s,setS]=useState(''),[m,setM]=useState(''),[phase,setPhase]=useState(0);
  const sch=plainNumber(s),ist=plainNumber(m);
  return <section className="panel gt-form"><h2>Erst schätzen, dann messen</h2><label>Gegenstand<select value={obj} onChange={e=>{setObj(e.target.value);setS('');setM('');setPhase(0)}}>{['Bleistift','Heftbreite','Radiergummi'].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Meine Schätzung in cm<input inputMode="decimal" value={s} disabled={phase>0} onChange={e=>setS(e.target.value)}/></label>
    {phase===0?<button className="btn" disabled={!sch} onClick={()=>setPhase(1)}>Schätzung festhalten</button>:<><p>Lege dein Lineal mit der Null an den Rand. Lies die Länge deines Gegenstands ab.</p><label>Gemessen in cm<input inputMode="decimal" value={m} onChange={e=>{setM(e.target.value);setPhase(1)}}/></label><button className="btn" disabled={!ist} onClick={()=>setPhase(2)}>Vergleichen</button>{phase===2&&<p role="status">Deine Schätzung liegt {f(Math.abs(sch!-ist!))} cm {sch===ist?'vom Messwert entfernt. Genau getroffen!':sch!>ist!?'über dem Messwert.':'unter dem Messwert.'}</p>}<button className="btn ghost" onClick={()=>{setS('');setM('');setPhase(0)}}>Erneut schätzen</button></>}</section>;
}

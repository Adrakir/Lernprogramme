import {useRef,useState} from 'react';
import {fmtNum as f} from '@/lib/groessen-core';
import {uhr} from '@/lib/zeit-tasks';
import {fach,richtig,type Aufgabe,type Fach,type Thema} from '@/lib/groessen-training';
import {bereiche,standardPlan,zusammenstellen,zwischenschritt,type Plan} from '@/lib/groessen-auswertung';

export function Feinschritt({name,wert,min,max,schritt=1,set}:{name:string;wert:number;min:number;max:number;schritt?:number;set:(wert:number)=>void}){
  const bewegen=(richtung:number)=>set(Math.min(max,Math.max(min,Math.round((wert+richtung*schritt)*1000)/1000)));
  return <div className="gt-fine"><button type="button" aria-label={name+' verringern'} disabled={wert<=min} onClick={()=>bewegen(-1)}>−</button><output>{f(wert)}</output><button type="button" aria-label={name+' erhöhen'} disabled={wert>=max} onClick={()=>bewegen(1)}>+</button></div>;
}
export function ArbeitPlanen({start}:{start:(ids:Thema[])=>void}){
  const [plan,setPlan]=useState<Plan>(standardPlan);
  const total=bereiche.reduce((s,b)=>s+plan.anzahl[b],0);
  return <details className="gt-plan"><summary>Klassenarbeit selbst zusammenstellen</summary><p>Wähle bis zu zwölf Aufgaben je Bereich. Die Schnellwahl oben startet weiterhin je vier Aufgaben.</p>
    <div className="gt-plan-grid">{bereiche.map((b:Fach)=><label key={b}>{fach[b]}<select value={plan.anzahl[b]} onChange={e=>setPlan({...plan,anzahl:{...plan.anzahl,[b]:+e.target.value}})}>{Array.from({length:13},(_,n)=><option key={n}>{n}</option>)}</select></label>)}</div>
    <fieldset><legend>Zeit-Themen im Aufgabenpool</legend>{([['dezimal','Dezimalstunden'],['mehrtaegig','Mehrtägige Zeitspannen']] as const).map(([k,label])=><label key={k}><input type="checkbox" checked={plan[k]} disabled={!plan.anzahl.zeit} onChange={e=>setPlan({...plan,[k]:e.target.checked})}/> {label}</label>)}</fieldset>
    <button type="button" className="btn" disabled={!total} onClick={()=>start(zusammenstellen(plan,crypto.getRandomValues(new Uint32Array(1))[0]))}>Eigene Arbeit starten · {total} Aufgaben</button></details>;
}
export function Teilhilfe({id,a,antworten,zurueck}:{id:Thema;a:Aufgabe;antworten:string[];zurueck:()=>void}){
  const [wert,setWert]=useState(''),[meldung,setMeldung]=useState('');
  const h=zwischenschritt(id,a,antworten);
  const pruefen=()=>setMeldung(richtig(h.feld,wert)?'richtig':'nochmal');
  return <aside className="gt-repair"><h3>Ein Zwischenschritt</h3><p>{h.frage}</p><label>{h.feld.label}
    {h.feld.optionen?<select value={wert} onChange={e=>{setWert(e.target.value);setMeldung('')}}><option value="">Bitte wählen</option>{h.feld.optionen.map(v=><option key={v}>{v}</option>)}</select>:<input inputMode="decimal" value={wert} onChange={e=>{setWert(e.target.value);setMeldung('')}}/>}</label>
    <div className="gt-buttons"><button type="button" className="btn ghost" disabled={!wert} onClick={pruefen}>Zwischenschritt prüfen</button><button type="button" className="btn" onClick={zurueck}>Hauptaufgabe erneut lösen</button></div>
    {meldung&&<p role="status">{meldung==='richtig'?'Das stimmt. ':'Vergleiche noch einmal. '}{h.erklaerung}</p>}</aside>;
}
export function Stoppversuch(){
  const start=useRef<number|null>(null);
  const [laeuft,setLaeuft]=useState(false),[versuche,setVersuche]=useState<{sek:number;strategie:string}[]>([]),[strategie,setStrategie]=useState('Nach Gefühl');
  function stoppen(){if(start.current===null)return;const sek=(performance.now()-start.current)/1000;start.current=null;setLaeuft(false);setVersuche(v=>[...v,{sek,strategie}]);}
  return <section className="panel"><h2>Triff 30 Sekunden</h2><p>Starte und stoppe, sobald nach deinem Gefühl 30 Sekunden vergangen sind. Die Zeit bleibt während des Versuchs verdeckt.</p>
    <label>Meine Strategie <select value={strategie} disabled={laeuft} onChange={e=>setStrategie(e.target.value)}>{['Nach Gefühl','Gleichmäßig zählen','Einen ruhigen Rhythmus klopfen'].map(v=><option key={v}>{v}</option>)}</select></label>
    <div className="gt-buttons"><button className="btn" onClick={()=>{if(laeuft){stoppen();return;}start.current=performance.now();setLaeuft(true)}}>{laeuft?'Jetzt stoppen':'Versuch starten'}</button></div>
    {!!versuche.length&&<div role="status">{versuche.slice(-2).map((v,j)=><p key={j}>{v.strategie}: <b>{f(v.sek,1)} s</b> · Abweichung {f(Math.abs(30-v.sek),1)} s.</p>)}{versuche.length===1?<p>Probiere eine zweite Strategie aus.</p>:<p>Deine Abweichung ist {Math.abs(30-versuche.at(-1)!.sek)<Math.abs(30-versuche.at(-2)!.sek)?'kleiner als zuvor.':Math.abs(30-versuche.at(-1)!.sek)>Math.abs(30-versuche.at(-2)!.sek)?'größer als zuvor.':'genauso groß wie zuvor.'}</p>}</div>}</section>;
}
export function AufbauBild({modell,loesung=false}:{modell:NonNullable<Aufgabe['modell']>;loesung?:boolean}){
  const [zeige,setZeige]=useState(false),[menge,setMenge]=useState(0);
  const [a,b,c]=modell.werte;
  const toggle=(name:string)=><button type="button" className="btn ghost small" onClick={()=>setZeige(!zeige)}>{zeige?'Zur Ausgangsansicht':name}</button>;
  let inhalt;
  switch(modell.art){
    case 'familie':inhalt=<>{toggle('Maßstreifen vergleichen')}{(zeige||loesung)&&[a,b].map(v=><div key={v}>{f(v/100)} m <span className="gt-strip"><i style={{width:v/Math.max(a,b)*100+'%'}}/></span> {v} cm</div>)}</>;break;
    case 'band':inhalt=<><div className="gt-band">{[b,c,a-b-c].map((v,i)=><span key={i} style={{flexGrow:v}}>{i===2&&!zeige?'?':v+' cm'}</span>)}</div>{toggle('Verdeckung zur Kontrolle öffnen')}</>;break;
    case 'waage':inhalt=<><svg viewBox="0 0 320 108" className="gt-balance" role="img" aria-label="Balkenwaage im Gleichgewicht"><path d="M160 23L142 97h36z" fill="#61848b"/><path d="M57 22h206" stroke="#233d53" strokeWidth="6"/>{[57,263].map(cx=><g key={cx}><path d={`M${cx} 22 l-38 52h76z`} fill="none" stroke="#516a77"/><path d={`M${cx-38} 75 q38 29 76 0z`} fill="#338a85"/></g>)}<path d="M32 69q0-17 10-22l-4-8h14l-3 8q12 6 12 22z" fill="#c08647"/><g className="gt-weights" key={menge}>{Array.from({length:Math.ceil((a-menge)/50)},(_,i)=><rect key={i} x={62+i%3*8} y={65-Math.floor(i/3)*7} width="7" height="7" fill="#375379"/>)}{Array.from({length:Math.ceil((b-menge)/50)},(_,i)=><rect key={i} x={239+i%6*8} y={65-Math.floor(i/6)*7} width="7" height="7" fill="#375379"/>)}</g></svg><div className="gt-pans"><b>Beutel {a-menge>0?' + '+(a-menge)+' g':''}</b><strong>=</strong><b>{b-menge} g</b></div><label>Auf beiden Seiten wegnehmen <select value={menge} onChange={e=>setMenge(+e.target.value)}>{[0,a/2,a].map(v=><option key={v} value={v}>{v} g</option>)}</select></label><p>{menge===a?'Jetzt steht der Beutel allein auf der linken Schale.':'Beide Schalen tragen dieselbe Masse.'}</p></>;break;
    case 'nullpunkt':inhalt=<><div className="gt-pans"><b>Leer · {zeige?0:a} g</b><b>Mit Paket · {zeige?b:b+a} g</b></div>{toggle('Leere Waage nullstellen und neu wiegen')}</>;break;
    case 'uhr':inhalt=<svg role="img" aria-label={`Minutenzeiger auf sechs, Stundenzeiger zwischen ${a} und ${a+1}.`} className="gw-clock" viewBox="0 0 120 120"><circle cx="60" cy="60" r="57" fill="#f6fafb" stroke="#24545c"/>{Array.from({length:12},(_,i)=><text key={i} x={60+45*Math.sin(i*Math.PI/6)} y={64-45*Math.cos(i*Math.PI/6)} textAnchor="middle" fill="#184153">{i||12}</text>)}{[[a*30+b/2,25],[b*6,37]].map(([deg,len],i)=><line key={i} x1="60" y1="60" x2="60" y2={60-len} stroke={i?'#087e78':'#293f5f'} strokeWidth={i?3:5} transform={`rotate(${deg} 60 60)`}/>)}</svg>;break;
    case 'kalender':inhalt=<><div className="gt-days">{[['Freitag',uhr(a)+' → 24:00'],['Samstag','00:00 → 24:00'],['Sonntag','00:00 → '+uhr(b)]].map(([tag,zeit])=><span key={tag}><b>{tag}</b>{zeit}</span>)}</div>{toggle('Teilstrecken aufdecken')}{zeige&&<p>{1440-a} min + 24 h + {b} min</p>}</>;break;
  }
  return <div className="gt-model">{inhalt}</div>;
}

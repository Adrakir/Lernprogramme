import {useState} from 'react';
import {liste,pruefeAufgabe,type Aufgabe,type Werte} from '@/lib/addition';
import {fmtNum} from '@/lib/groessen-core';
type Props={a:Aufgabe;w:Werte;set:(key:string,value:string)=>void;test:boolean};
function Zahlenstrahl({a,w,set}:Props){
  const [eingabe,setEingabe]=useState(''),[fehler,setFehler]=useState('');
  const [start,weg]=a.zahlen,schritte=liste(w.spruenge),punkte=[start];
  for(const s of schritte)punkte.push(punkte.at(-1)!+s);
  const pos=(v:number)=>15+(v-start)/weg*330,stand=punkte.at(-1)!;
  function hin(){
    const n=Number(eingabe);if(!Number.isInteger(n)||n<=0||stand+n>start+weg){setFehler('Wähle einen positiven Sprung, der auf der dargestellten Strecke bleibt.');return;}
    set('spruenge',[...schritte,n].join(','));setEingabe('');setFehler('');
  }
  return <div className="ad-lab"><svg viewBox="0 0 360 85" role="img" aria-label={'Zahlenstrahl: '+punkte.join(', ')}><path d="M15 61H345" stroke="currentColor"/>{Array.from({length:weg+1},(_,i)=><path key={i} d={`M${pos(start+i)} 61v${(start+i)%10===0?8:3}`} stroke="currentColor"/>)}{punkte.slice(1).map((v,i)=><path key={i} d={`M${pos(punkte[i])} 58 Q${(pos(punkte[i])+pos(v))/2} 2 ${pos(v)} 58`} fill="none" stroke="#107a76" strokeWidth="2"/>)}<circle cx={pos(stand)} cy="59" r="4" fill="#a84d15"/><text x="15" y="82">{start}</text><text x="345" y="82" textAnchor="end">{start+weg}</text></svg>
    <p>{punkte.join(' → ')}{schritte.length>0&&' · Sprünge: '+schritte.join(' + ')}</p>
    <label>Nächster Sprung<input inputMode="numeric" value={eingabe} onChange={e=>setEingabe(e.target.value)}/></label><div className="ad-actions"><button className="btn ghost" type="button" disabled={stand===start+weg} onClick={hin}>Springen</button><button className="btn ghost" type="button" disabled={!schritte.length} onClick={()=>{set('spruenge',schritte.slice(0,-1).join(','));setFehler('')}}>Letzten Sprung zurücknehmen</button></div>{fehler&&<p role="status">{fehler}</p>}</div>;
}
function Karten({a,w,set}:Props){
  const paar=a.thema==='paare',key=paar?'paare':'karten',wahl=liste(w[key]);
  const zeigte=paar?[a.zahlen[1],a.zahlen[0],a.zahlen[3],a.zahlen[2]]:a.zahlen;
  return <div className="ad-lab"><div className="ad-actions">{zeigte.map(n=><button type="button" className="btn ghost" key={n} disabled={wahl.includes(n)} onClick={()=>set(key,[...wahl,n].join(','))}>{fmtNum(n)}</button>)}</div>
    <p className="ad-equation">{paar?`(${wahl[0]??'□'} + ${wahl[1]??'□'}) + (${wahl[2]??'□'} + ${wahl[3]??'□'})`:`${wahl[0]??'□'} − ${wahl[1]??'□'} = ${wahl[2]??'□'}`}</p><button type="button" className="btn ghost small" disabled={!wahl.length} onClick={()=>set(key,wahl.slice(0,-1).join(','))}>Letzte Karte zurück</button></div>;
}
function Geschichte({a,w,set}:Props){
  const [aktiv,setAktiv]=useState(false);
  const lines=(w.skizze??'').split('|').filter(Boolean);
  return <div className="ad-lab"><p>Skizziere die Gruppen mit Finger oder Maus. Alternativ kannst du die Balken mit den Tasten einfügen.</p>
    <svg viewBox="0 0 320 96" className="ad-sketch" aria-label="Zeichenfläche für die beiden Gruppen" onPointerDown={e=>{const box=e.currentTarget.getBoundingClientRect();const x=Math.round((e.clientX-box.left)*320/box.width),y=Math.round((e.clientY-box.top)*96/box.height);e.currentTarget.setPointerCapture(e.pointerId);setAktiv(true);set('skizze',[...lines,x+','+y].join('|'));}} onPointerUp={()=>setAktiv(false)} onPointerCancel={()=>setAktiv(false)} onPointerMove={e=>{if(!aktiv||!lines.length)return;const box=e.currentTarget.getBoundingClientRect();const p=Math.round((e.clientX-box.left)*320/box.width)+','+Math.round((e.clientY-box.top)*96/box.height);set('skizze',[...lines.slice(0,-1),lines.at(-1)+' '+p].join('|'));}}>
      {[0,1].map(i=>w['balken'+i]==='ja'&&<g key={i}><rect x={i?166:9} y="28" width={i?88:148} height="35" rx="3" fill={i?'#f9c387':'#a5ded5'}/><text x={i?207:78} y="51" textAnchor="middle">{a.zahlen[i]}</text></g>)}{lines.map((l,i)=><polyline key={i} points={l} stroke="#355789" fill="none" strokeWidth="2.5"/>)}</svg>
    <div className="ad-actions">{[0,1].map(i=><button key={i} type="button" className="btn ghost small" aria-pressed={w['balken'+i]==='ja'} onClick={()=>set('balken'+i,w['balken'+i]==='ja'?'':'ja')}>Gruppe mit {a.zahlen[i]} Kindern</button>)}<button className="btn ghost small" type="button" onClick={()=>set('skizze','')}>Zeichnung leeren</button></div>
    <label>Dein Antwortsatz<textarea value={w.satz??''} onChange={e=>set('satz',e.target.value)}/></label></div>;
}
export function Aufgabenfelder(p:Props){
  const {a,w,set,test}=p,[ausgleich,setAusgleich]=useState(false);
  return <div className="ad-fields"><p className="ad-prompt">{a.frage}</p>
    {a.thema==='sprung'&&<Zahlenstrahl {...p}/>}
    {(a.thema==='paare'||a.thema==='probe')&&<Karten {...p}/>}
    {a.thema==='geschichte'&&<Geschichte {...p}/>}
    {a.thema==='ausgleich'&&!test&&<div className="ad-lab"><div className="ad-blocks"><b>{a.zahlen[0]}</b>{ausgleich&&<><i className="ad-one"/><i className="ad-one"/></>}<span> + {a.zahlen[1]}</span></div><button className="btn ghost small" onClick={()=>setAusgleich(!ausgleich)}>{ausgleich?'Die zwei zusätzlichen Einer wegnehmen':'Zwei Einer zur Hilfsaufgabe dazulegen'}</button></div>}
    {a.thema==='fehler'&&<div className="ad-fault" aria-label="Noras schriftliche Rechnung">{a.zahlen.map((n,i)=><div key={i}>{['','+','='][i]} {n}</div>)}</div>}
    {a.thema==='strategie'&&a.felder.map(f=><label key={f.key}>Mein Weg für {f.label}<select value={w['strategie'+f.key]??''} onChange={e=>set('strategie'+f.key,e.target.value)}><option value="">Weg wählen</option>{['Im Kopf','Mit Zwischenschritten','Im Raster'].map(s=><option key={s}>{s}</option>)}</select></label>)}
    {a.felder.map(f=><label key={f.key}>{f.label}{f.optionen?<select value={w[f.key]??''} onChange={e=>set(f.key,e.target.value)}><option value="">Bitte wählen</option>{f.optionen.map(s=><option key={s}>{s}</option>)}</select>:<input inputMode="numeric" value={w[f.key]??''} onChange={e=>set(f.key,e.target.value)}/>}</label>)}
    {(a.thema==='vergleich'||a.thema==='strategie')&&<label>{a.thema==='vergleich'?'Welchen Weg wählst du für die nächste Rechnung und warum?':'Warum passen deine Wege zu den Zahlen?'}<textarea value={w.grund??''} onChange={e=>set('grund',e.target.value)}/></label>}
  </div>;
}
export function bereit(a:Aufgabe,w:Werte){
  return a.felder.every(f=>Boolean(w[f.key]?.trim()))&&(a.thema!=='probe'||liste(w.karten).length===3)&&(a.thema!=='paare'||liste(w.paare).length===4)&&(a.thema!=='sprung'||liste(w.spruenge).length>0)&&(a.thema!=='strategie'||Boolean(w.strategiea&&w.strategieb&&w.grund?.trim()))&&(a.thema!=='vergleich'||Boolean(w.grund?.trim()))&&(a.thema!=='geschichte'||Boolean(w.satz?.trim()));
}
export function Rueckmeldung({a,w}:{a:Aufgabe;w:Werte}){
  const fehler=pruefeAufgabe(a,w).filter(k=>!k.ok);
  return <div role="status" className="ad-feedback">{fehler.length?<><b>Schau hier noch einmal hin: {fehler.map(k=>k.name).join(', ')}.</b><p>{a.tipp}</p></>:<><b>Die prüfbaren Antworten stimmen.</b><p>{a.weg}</p>{(w.grund||w.satz)&&<p>Vergleiche deine eigene Erklärung mit dem Lösungsweg.</p>}</>}</div>;
}

import {useState} from 'react';
import {ArrowRight,Compass} from 'lucide-react';
import {diagnose,pruefung,ausflug,detektiv,fach,themen,richtig,type Thema,type Fach} from '@/lib/groessen-training';
import {lesen,speichernRunde,verbuchen,type Modus,type Stand} from '@/lib/groessen-training-stand';
import {TrainingsBild,Messauftrag} from './groessen-training-modelle';
import {ArbeitPlanen,AufbauBild,Stoppversuch,Teilhilfe} from './groessen-aufbaulabor';
import {punkte,rundenAufgabe,uebungsziele,zwischenschritt} from '@/lib/groessen-auswertung';
import {fehlerblatt} from '@/lib/groessen-fehlerblatt';
import {UhrModell} from './groessen-modelle';
const namen:Record<Modus,string>={check:'Einstiegscheck',arbeit:'Übungsklassenarbeit',uebung:'Gezielt üben',reise:'Klassenausflug zum See',detektiv:'Fehlerdetektiv',wiederholen:'Meine Wiederholung'};
const alle=Object.keys(themen) as Thema[];
const auf=rundenAufgabe;
function bewertet(r:Stand,i:number){return auf(r,i).felder.every((f,j)=>richtig(f,r.antworten[i][j]??''));}
export function TrainingsStart({go}:{go:(r:string)=>void}){
  const {runde,liste}=lesen();
  const weiter=runde&&!runde.fertig?'Weiter mit '+themen[runde.ids[runde.i]][1]:liste.length?'Weiter mit '+themen[liste[0].id][1]:'Einstiegscheck und Übungsklassenarbeit';
  return <button className="exam-home-link panel" onClick={()=>go('g-training')}><Compass size={25}/><span><strong>{weiter}</strong><small>Längen · Gewichte · Zeit</small></span><ArrowRight size={20}/></button>;
}
export function GroessenTraining({bereich,go}:{bereich?:Fach;go:(s:string)=>void}){
  const [r,setR]=useState<Stand|undefined>(()=>{if(bereich)return;const d=lesen();if(d.runde&&!d.runde.fertig)return d.runde;if(d.liste.length){const ids=d.liste.map(e=>e.id);return {version:2,modus:'wiederholen',ids,seed:Date.now()%2147483647,i:0,antworten:ids.map(()=>[]),hilfe:ids.map(()=>false),umkehr:d.liste.map(e=>e.umkehr),fertig:false};}});
  const [filter,setFilter]=useState<Fach>(bereich??'laenge');
  const [meldung,setMeldung]=useState('');
  const [antwortZeigen,setAntwortZeigen]=useState(false);
  const [labor,setLabor]=useState<'messen'|'uhr'|'stopp'|undefined>();
  const [tipp,setTipp]=useState(false);
  const [reparatur,setReparatur]=useState(false),[modellOffen,setModellOffen]=useState(false);
  function resetUI(){setReparatur(false);setModellOffen(false);setMeldung('');setAntwortZeigen(false);setTipp(false);setLabor(undefined);}
  function save(v:Stand){setR(v);speichernRunde(v);}
  function start(modus:Modus,ids:Thema[]){
    const liste=lesen().liste;
    const seed=crypto.getRandomValues(new Uint32Array(1))[0];
    const umkehr=ids.map((id,i)=>modus==='wiederholen'?liste.find(e=>e.id===id)?.umkehr??false:modus==='uebung'?i%2===1:(id==='regelM'));
    resetUI();save({version:2,modus,ids,seed,i:0,umkehr,antworten:ids.map(()=>[]),hilfe:ids.map(()=>false),fertig:false});
  }
  const gezielt=(id:Thema)=>start('uebung',[id,id,id]);
  function menue(){setR(undefined);resetUI();}
  function wechsel(i:number){if(!r)return;resetUI();save({...r,i});}
  const titel=<div className="page-title"><div><span className="eyebrow">GRÖSSEN-WERKSTATT · KLASSE 5</span><h1>Längen, Gewichte und Zeit</h1></div></div>;
  const gespeichert=lesen();
  if(!r){
    const emp=gespeichert.liste[0]?.id;
    return <>{titel}<button className="btn ghost small" onClick={()=>go('groessen')}>Zur Größen-Werkstatt</button>
      {gespeichert.runde?.fertig&&<button className="btn ghost small" onClick={()=>setR(gespeichert.runde)}>Letzte Auswertung ansehen</button>}
      {gespeichert.runde&&!gespeichert.runde.fertig&&<section className="panel"><h2>Hier warst du</h2><button className="btn" onClick={()=>{resetUI();setR(gespeichert.runde)}}>Weiter mit {themen[gespeichert.runde.ids[gespeichert.runde.i]][1]}</button><p>Beginnst du eine neue Runde, ersetzt sie die angefangene Runde.</p></section>}
      <section className="panel"><h2>Wie möchtest du lernen?</h2><div className="gt-buttons">
      <button className="btn" onClick={()=>start('check',diagnose)}>Einstiegscheck · 6 Aufgaben</button>
      <button className="btn ghost" onClick={()=>start('arbeit',pruefung)}>Klassenarbeit · 12 Aufgaben</button>
      {emp&&<button className="btn ghost" onClick={()=>start('wiederholen',gespeichert.liste.map(x=>x.id))}>Weiter mit {themen[emp][1]} · Wiederholung</button>}</div><ArbeitPlanen start={ids=>start('arbeit',ids)}/></section>
      <section className="panel"><h2>Gezielt üben</h2><div className="gt-buttons">{(Object.keys(fach) as Fach[]).map(b=><button key={b} aria-pressed={filter===b} className={'btn '+(filter===b?'':'ghost')} onClick={()=>{setFilter(b);setLabor(undefined)}}>{fach[b]}</button>)}</div>
      <div className="gt-topics">{alle.filter(id=>themen[id][0]===filter&&!ausflug.includes(id)&&!detektiv.includes(id)).map(id=><button className="btn ghost" key={id} onClick={()=>gezielt(id)}>{themen[id][1]}</button>)}
      {filter==='laenge'&&<button className="btn ghost" onClick={()=>setLabor('messen')}>Schätzen und selbst messen</button>}{filter==='zeit'&&<button className="btn ghost" onClick={()=>setLabor('uhr')}>Den Zeiger vorhersagen</button>}{filter==='zeit'&&<button className="btn ghost" onClick={()=>setLabor('stopp')}>30 Sekunden schätzen</button>}</div>
      {labor==='stopp'&&<Stoppversuch/>}{labor==='messen'&&<Messauftrag/>}{labor==='uhr'&&<UhrModell vorhersage/>}</section>
      <section className="panel"><h2>Anwenden und begründen</h2><div className="gt-buttons"><button className="btn ghost" onClick={()=>start('detektiv',detektiv)}>Fehlerdetektiv · 3 Fälle</button><button className="btn ghost" onClick={()=>start('reise',ausflug)}>Klassenausflug zum See · 3 Aufgaben</button></div></section></>;
  }
  if(r.fertig){
    const gesamt=r.ids.reduce((s,_,j)=>{const p=punkte(r,j);return {erreicht:s.erreicht+p.erreicht,max:s.max+p.max}},{erreicht:0,max:0});
    const offen=r.ids.filter((_,i)=>!bewertet(r,i)||r.hilfe[i]||r.sicherheit?.[i]==='geraten');
    return <>{titel}<section className="panel"><h2>{namen[r.modus]} · Auswertung</h2><p><b>{r.ids.filter((_,i)=>bewertet(r,i)).length} von {r.ids.length} Aufgaben richtig.</b></p><p>{gesamt.erreicht} von {gesamt.max} Teilpunkten. Jedes richtige Antwortfeld zählt einen Punkt.</p>
      {uebungsziele(r).length>0&&<button className="btn ghost" onClick={()=>fehlerblatt(r).save("MatheKompass_Persoenliches_Fehlerblatt.pdf")}>Persönliches Fehlerblatt als PDF</button>}
      {(Object.keys(fach) as Fach[]).map(b=>{const indices=r.ids.map((_,i)=>i).filter(i=>themen[r.ids[i]][0]===b);if(!indices.length)return null;
        const gut=indices.filter(i=>bewertet(r,i)&&!r.hilfe[i]&&r.sicherheit?.[i]!=='geraten'),ueben=indices.filter(i=>!gut.includes(i));
        return <div key={b} className="gt-report"><h3>{fach[b]} · {gut.length} von {indices.length} selbstständig</h3>{gut.length>0&&<p>Selbstständig gelöst: {[...new Set(gut.map(i=>themen[r.ids[i]][1]))].join(', ')}.</p>}{[...new Set(ueben.map(i=>r.ids[i]))].map(id=><button key={id} className="btn ghost small" onClick={()=>gezielt(id)}>Jetzt üben: {themen[id][1]}</button>)}</div>})}
      {!!lesen().liste.length&&<button className="btn" onClick={()=>start('wiederholen',lesen().liste.map(e=>e.id))}>Persönliche Wiederholung starten</button>}
      {!offen.length&&<p>Runde geschafft. Du kannst jetzt weitere Themen wählen.</p>}
      <details><summary>Meine Antworten und Lösungswege</summary>{r.ids.map((id,i)=>{const a=auf(r,i);return <div key={i} className="gt-report"><h3>{i+1}. {themen[id][1]} · {punkte(r,i).erreicht}/{punkte(r,i).max} Punkte</h3><p>{a.frage}</p>{a.felder.map((v,j)=><p key={j}>{v.label}: {r.antworten[i][j]||'offen'} {richtig(v,r.antworten[i][j]??'')?'✓':'· richtig: '+(typeof v.wert==='number'?String(v.wert).replace('.',','):v.wert)}</p>)}<p>{a.weg}</p>{r.sicherheit?.[i]==='sicher'&&!bewertet(r,i)&&<p><b>Zum Vergleichen</b> · {zwischenschritt(id,a,r.antworten[i]).erklaerung}</p>}{r.reflexion?.[i]&&<p>Mein Vergleich: {r.reflexion[i]}</p>}</div>})}</details>
      <button className="btn ghost" onClick={menue}>Zur Trainingsauswahl</button></section></>;
  }
  const i=r.i,id=r.ids[i],a=auf(r,i),werte=r.antworten[i],test=r.modus==='arbeit'||r.modus==='check';
  const stufe=!test&&r.modus==='uebung'?Math.min(i,2):0;
  const lesetext=a.bild?.typ==='skala'?('Die Skala reicht von 0 bis '+(20*a.bild.daten[0])+' g und hat 20 gleiche Abstände. Der Zeiger steht am '+a.bild.daten[1]+'. Strich nach null.'):a.bild?.typ==='lineal'?('Die Enden liegen am '+a.bild.daten[0]+'. und am '+a.bild.daten[1]+'. Millimeterstrich nach null.'):'';
  function notiz(key:'sicherheit'|'reflexion',v:string){if(!r)return;save({...r,[key]:r.ids.map((_,k)=>k===i?v:r[key]?.[k]??'')});}
  function eingabe(j:number,v:string){if(!r)return;const neu=a.felder.map((_,k)=>k===j?v:r.antworten[i][k]??'');save({...r,antworten:r.antworten.map((alt,k)=>k===i?neu:alt)});setMeldung('');setAntwortZeigen(false);}
  function hilfe(){if(!r)return;save({...r,hilfe:r.hilfe.map((v,k)=>v||k===i)});}
  function fertig(){if(!r)return;const v={...r,fertig:true};verbuchen(v,v.ids.map((_,k)=>bewertet(v,k)));resetUI();setR(v);}
  function weiter(){if(!r)return;if(i<r.ids.length-1)wechsel(i+1);else fertig();}
  function pruefen(){if(!r)return;if(!a.felder.every((_,j)=>werte[j]?.trim())){setMeldung('Fülle zuerst alle Antwortfelder aus.');return;}
    if(test){weiter();return;}const ok=bewertet(r,i);if(!ok){hilfe();setReparatur(true);}setAntwortZeigen(true);setMeldung(ok?'Richtig gelöst.':r.sicherheit?.[i]==='sicher'?'Du warst dir sicher. Vergleiche deinen Ansatz mit dem Zwischenschritt.':'Prüfe die markierten Antworten.');}
  return <>{titel}<section className="panel gt-form"><div className="gw-between"><span className="eyebrow">{namen[r.modus]} · {i+1} von {r.ids.length}</span><button className="btn ghost small" onClick={menue}>Pause und Auswahl</button></div>
    <h2>{themen[id][1]}</h2><p>{a.frage}</p>
    {a.tabelle&&<table className="gw-table"><caption>Fahrplan am Umsteigebahnhof</caption><thead><tr>{a.tabelle[0].map(x=><th key={x} scope="col">{x}</th>)}</tr></thead><tbody>{a.tabelle.slice(1).map(row=><tr key={row[0]}>{row.map(x=><td key={x}>{x}</td>)}</tr>)}</tbody></table>}
    {a.modell&&(!test||a.modell.art==='uhr')&&<AufbauBild key={id+i} modell={a.modell} loesung={antwortZeigen}/>}
    {a.bild&&stufe>0&&<div className="gt-stage"><p>{stufe===1?'Versuche es mit weniger Beschriftung.':'Versuche es diesmal nur mit dem Aufgabentext.'} {lesetext&&(stufe===2?lesetext:a.bild.typ==='skala'?'Die Skala endet bei '+(20*a.bild.daten[0])+' g.':'Ein großer Abstand ist 1 cm.')}</p><button className="btn ghost small" onClick={()=>{if(!modellOffen)hilfe();setModellOffen(!modellOffen)}}>{modellOffen?'Lernstufe wiederherstellen':'Vollständiges Modell einblenden'}</button></div>}
    {a.bild&&(stufe<2||modellOffen)&&(!test||['skala','lineal'].includes(a.bild.typ))&&<TrainingsBild reduziert={stufe===1&&!modellOffen} key={r.seed+'-'+i} bild={a.bild} werte={werte} set={eingabe} hilfe={!test}/>}
    <form onSubmit={e=>{e.preventDefault();pruefen()}}>{a.felder.map((v,j)=>{const label=v.label;return <label key={id+j}>{label}{v.optionen?<select value={werte[j]??''} onChange={e=>eingabe(j,e.target.value)}><option value="">Bitte wählen</option>{v.optionen.map(s=><option key={s}>{s}</option>)}</select>:<input inputMode="decimal" value={werte[j]??''} onChange={e=>eingabe(j,e.target.value)} disabled={id.startsWith('regel')&&j===2&&(!werte[0]||!werte[1])}/>}
    {antwortZeigen&&<small>{richtig(v,werte[j]??'')?'✓ Richtig':'Noch einmal prüfen'}</small>}</label>})}
    {id==='wege'&&<label>Welchen Weg kannst du leichter überprüfen und warum? <textarea value={r.reflexion?.[i]??''} onChange={e=>notiz('reflexion',e.target.value)} placeholder="Ich wähle …, weil …"/></label>}
    <label>Wie sicher bist du? (freiwillig)<select value={r.sicherheit?.[i]??''} disabled={antwortZeigen} onChange={e=>notiz('sicherheit',e.target.value)}><option value="">Ohne Einschätzung</option>{['sicher','unsicher','geraten'].map(v=><option key={v}>{v}</option>)}</select></label>
    <div className="gt-buttons">{(!antwortZeigen||!bewertet(r,i))&&<button className="btn" type="submit">{test?(i===r.ids.length-1?'Abgeben und auswerten':'Antwort speichern und weiter'):'Antwort prüfen'}</button>}
    {!test&&!antwortZeigen&&<button className="btn ghost" type="button" onClick={()=>{hilfe();setTipp(true)}}>Tipp</button>}
    {antwortZeigen&&<button className="btn" type="button" onClick={weiter}>{i===r.ids.length-1?'Auswerten':'Nächste Aufgabe'}</button>}
    {test&&i>0&&<button className="btn ghost" type="button" onClick={()=>wechsel(i-1)}>Zurück</button>}</div></form>
    {meldung&&<p role="status">{meldung}</p>}{tipp&&<p><b>Tipp</b> · {a.tipp}</p>}{reparatur&&antwortZeigen&&!bewertet(r,i)&&<Teilhilfe id={id} a={a} antworten={werte} zurueck={()=>{setAntwortZeigen(false);setReparatur(false);setMeldung('Übertrage deinen Zwischenschritt auf die ursprüngliche Aufgabe.');}}/>}{antwortZeigen&&(!reparatur||bewertet(r,i))&&<p><b>Lösungsweg</b> · {a.weg}</p>}</section></>;
}

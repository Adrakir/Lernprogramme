import {useState} from 'react';
import {ArrowLeft,Minus} from 'lucide-react';
import {aufgabe,namen,punkte as pruefeAufgabe,pruefplan,raster as rasterAufgabe,rasterpunkte,stufen,type Thema,type Werte,type Ziel} from '@/lib/subtraktion';
import {subtraktionsheft} from '@/lib/subtraktion-heft';
import {Subtraktionsraster} from './subtraktionsraster';
import {Aufgabenfelder,bereit,Rueckmeldung} from './subtraktionsuebungen';
import './addition.css';
import './subtraktion.css';

type Arbeit={seed:number;index:number;antworten:Werte[];fertig:boolean};
type Verlauf={arbeit?:Arbeit;ziele:Ziel[]};
const key='mathe-kompass-subtraktion-v1';
const gueltig=(s:unknown):s is Ziel=>typeof s==='string'&&(Object.hasOwn(namen,s)||s==='raster'||s==='nullkette');
function lesen():Verlauf{
  try{
    const d=JSON.parse(localStorage.getItem(key)??'{}'),a=d.arbeit;
    const ok=a&&Number.isInteger(a.seed)&&Number.isInteger(a.index)&&a.index>=0&&a.index<8&&typeof a.fertig==='boolean'&&Array.isArray(a.antworten)&&a.antworten.length===8&&a.antworten.every((w:unknown)=>w&&typeof w==='object'&&Object.values(w).every(v=>typeof v==='string'));
    return {arbeit:ok?a:undefined,ziele:Array.isArray(d.ziele)?d.ziele.filter(gueltig):[]};
  }catch{return {ziele:[]};}
}
const neuerSeed=()=>crypto.getRandomValues(new Uint32Array(1))[0]||1;
const abschnitte=[
  {titel:'Rechenwege entdecken',themen:['sprung','ergaenzen','ausgleich','vergleich','strategie']},
  {titel:'Fehler finden und prüfen',themen:['fehler','schaetzen','probe','luecke']},
  {titel:'Mit Subtraktion Sachaufgaben lösen',themen:['geschichte','groessen','kette']}
] as const;
function teil(a:Arbeit,i:number){
  const ziel=pruefplan[i],seed=a.seed+i*7919;
  if(ziel==='raster'||ziel==='nullkette'){
    const zahlen=rasterAufgabe(ziel==='nullkette'?4:2,seed);
    return {ziel,titel:ziel==='nullkette'?'Über mehrere Nullen entbündeln':'Zahlen im Raster ausrichten',zahlen,punkte:rasterpunkte(...zahlen,a.antworten[i])};
  }
  const task=aufgabe(ziel,seed);
  return {ziel,titel:namen[ziel],task,punkte:pruefeAufgabe(task,a.antworten[i])};
}
const anzahl=(k:{ok:boolean}[])=>k.filter(x=>x.ok).length;
export function Subtraktionsschule({go}:{go:(route:string)=>void}){
  const [stand,setStand]=useState(lesen),[seite,setSeite]=useState<'start'|'raster'|'thema'|'arbeit'>('start');
  const [stufe,setStufe]=useState(0),[seed,setSeed]=useState(0),[thema,setThema]=useState<Thema>('sprung'),[w,setW]=useState<Werte>({});
  const [geprueft,setGeprueft]=useState(false),[hinweis,setHinweis]=useState(''),[loesung,setLoesung]=useState(false),[speicherFehler,setSpeicherFehler]=useState(false);
  const [muster,setMuster]=useState(false);
  function sichern(s:Verlauf){setStand(s);try{localStorage.setItem(key,JSON.stringify(s));}catch{setSpeicherFehler(true);}}
  function merken(z:Ziel){if(!stand.ziele.includes(z))sichern({...stand,ziele:[z,...stand.ziele].slice(0,12)});}
  function neu(){setW({});setGeprueft(false);setHinweis('');setLoesung(false);}
  function ueben(t:Ziel){neu();setSeed(0);setMuster(false);if(t==='raster'||t==='nullkette'){setStufe(t==='nullkette'?4:0);setSeite('raster');}else{setThema(t);setSeite('thema');}}
  function startTest(){neu();sichern({...stand,arbeit:{seed:neuerSeed(),index:0,fertig:false,antworten:pruefplan.map(()=>({}))}});setSeite('arbeit');}
  function eingabe(k:string,v:string){setW(prev=>({...prev,[k]:v}));setGeprueft(false);setHinweis('');setLoesung(false);}
  const title=<div className="page-title"><div><span className="eyebrow">MATHEKOMPASS · KLASSE 5</span><h1>Subtraktion verstehen und üben</h1></div><span className="page-module-icon teal"><Minus/></span></div>;
  const nav=<button type="button" className="btn ghost small" onClick={()=>{neu();setSeite('start')}}><ArrowLeft size={16}/>Zur Subtraktionsübersicht</button>;
  const pdf=(ziele:Ziel[])=>subtraktionsheft(ziele,neuerSeed()).save('MatheKompass_Subtraktion_im_Heft.pdf');
  let inhalt;
  if(seite==='start'){
    inhalt=<><section className="panel"><h2>Schriftlich subtrahieren</h2><p>Richte die Zahlen selbst aus. Tausche einen Hunderter in zehn Zehner und bearbeite danach jede Spalte in deinem Tempo.</p>
      <div className="ad-actions"><button className="btn" onClick={()=>{ueben('raster');setMuster(true)}}>Geführt starten · 704 − 286</button><button className="btn ghost" onClick={()=>ueben('raster')}>Rastertraining · sechs Stufen</button></div></section>
      {abschnitte.map(g=><details key={g.titel} className="panel ad-fold"><summary>{g.titel}</summary><div className="ad-links">{g.themen.map(t=><button className="btn ghost" key={t} onClick={()=>ueben(t)}>{namen[t]}</button>)}</div></details>)}
      <section className="panel"><h2>Für die Klassenarbeit</h2><p>Acht Aufgaben mit Kopfrechnen, schriftlicher Subtraktion, Überschlag, Fehleranalyse und Sachrechnen. Du kannst zwischen den Aufgaben wechseln und Antworten bis zur Abgabe ändern.</p>
      <div className="ad-actions">{stand.arbeit?<><button className="btn" onClick={()=>{neu();setSeite('arbeit')}}>{stand.arbeit.fertig?'Letzte Auswertung ansehen':'Probeklassenarbeit fortsetzen'}</button>{stand.arbeit.fertig&&<button className="btn ghost" onClick={startTest}>Neue Probeklassenarbeit</button>}</>:<button className="btn" onClick={startTest}>Probeklassenarbeit starten</button>}
      <button className="btn ghost" onClick={()=>pdf(stand.ziele)}>Drei Nachübungen als PDF</button></div></section><button className="btn ghost" onClick={()=>go('arithmetic')}>Zum Modul Schriftlich rechnen</button></>;
  }else if(seite==='raster'){
    const zahlen=muster?[704,286]:rasterAufgabe(stufe,seed);
    inhalt=<>{nav}<section className="panel"><label>Übungsstufe <select value={muster?'m':String(stufe)} onChange={e=>{neu();setMuster(e.target.value==='m');setStufe(e.target.value==='m'?0:Number(e.target.value));setSeed(0)}}><option value="m">Geführtes Beispiel</option>{stufen.map((s,i)=><option key={s} value={i}>{i+1}. {s}</option>)}</select></label>
      <Subtraktionsraster key={stufe+'-'+seed+'-'+muster} zahlen={zahlen} werte={w} schreiben={eingabe} beiFehler={()=>merken(stufe===4?'nullkette':'raster')}/>
      <div className="ad-actions"><button className="btn ghost" onClick={()=>{neu();setMuster(false);setSeed(neuerSeed())}}>Neue Zahlen</button>{stufe<5&&<button className="btn ghost" onClick={()=>{neu();setMuster(false);setStufe(muster?0:stufe+1);setSeed(0)}}>Nächste Stufe</button>}</div></section></>;
  }else if(seite==='thema'){
    const a=aufgabe(thema,seed);
    inhalt=<>{nav}<section className="panel"><h2>{namen[thema]}</h2><Aufgabenfelder key={thema+seed} a={a} w={w} set={eingabe} test={false}/>
      <div className="ad-actions"><button className="btn" onClick={()=>{if(!bereit(a,w)){setHinweis('Bearbeite zuerst alle Teile der Aufgabe.');return;}setHinweis('');setGeprueft(true);if(pruefeAufgabe(a,w).some(k=>!k.ok))merken(thema);}}>Antwort prüfen</button><button className="btn ghost" onClick={()=>{merken(thema);setHinweis(a.tipp)}}>Tipp</button><button className="btn ghost" onClick={()=>{merken(thema);setLoesung(true)}}>Lösungsweg zeigen</button><button className="btn ghost" onClick={()=>{neu();setSeed(neuerSeed())}}>Neue Aufgabe</button></div>{hinweis&&<p role="status">{hinweis}</p>}{geprueft&&<Rueckmeldung a={a} w={w}/>}{loesung&&<p>{a.weg}</p>}{thema==='groessen'&&<button className="btn ghost small" onClick={()=>go('g-training')}>In der Größen-Werkstatt weiterüben</button>}</section></>;
  }else if(stand.arbeit){
    const a=stand.arbeit,i=a.index,item=teil(a,i);
    const sichernArbeit=(neu:Arbeit)=>sichern({...stand,arbeit:neu});
    const ergebnisse=pruefplan.map((_,j)=>teil(a,j));
    if(a.fertig){
      const punkte=ergebnisse.flatMap(e=>e.punkte),schwach=ergebnisse.filter(e=>anzahl(e.punkte)<e.punkte.length).sort((x,y)=>anzahl(x.punkte)/x.punkte.length-anzahl(y.punkte)/y.punkte.length);
      const ziele=[...new Set([...schwach.map(e=>e.ziel),...stand.ziele])];
      inhalt=<>{nav}<section className="panel"><h2>Deine Auswertung</h2><p><strong>{anzahl(punkte)} von {punkte.length} Teilpunkten</strong> · Jede geprüfte Teilantwort zählt. Eigene Begründungen und Antwortsätze kannst du mit der Musterlösung vergleichen.</p>
      {ergebnisse.map((e,j)=><details key={j} className="ad-review"><summary>{j+1}. {e.titel} · {anzahl(e.punkte)}/{e.punkte.length} Punkte</summary>{e.punkte.map(k=><p key={k.name}>{k.ok?'✓':'○'} {k.name}</p>)}{e.task?<><p>{e.task.weg}</p>{a.antworten[j].grund&&<p>Deine Begründung: {a.antworten[j].grund}</p>}{a.antworten[j].satz&&<p>Dein Satz: {a.antworten[j].satz}</p>}</>:<p>{e.zahlen!.join(' − ')} = {e.zahlen!.reduce((s,n)=>s-n)}. {e.punkte.some(p=>!p.ok&&p.name.startsWith('Ausrichtung'))?'Richte zuerst beide Einer rechts aus.':e.punkte.some(p=>!p.ok&&p.name.startsWith('Verfügbar'))?'Übe das Entbündeln mit dem Tauschmodell.':e.punkte.some(p=>!p.ok)?'Prüfe die Ziffer der ersten abweichenden Spalte von rechts.':'Alle Stellen stimmen.'}</p>}{anzahl(e.punkte)<e.punkte.length&&<button className="btn ghost" onClick={()=>ueben(e.ziel)}>Diesen Bereich üben</button>}</details>)}
      <div className="ad-actions"><button className="btn" onClick={()=>pdf(ziele)}>Persönliches Heftblatt als PDF</button><button className="btn ghost" onClick={startTest}>Neue Arbeit</button></div></section></>;
    }else{
      function weiter(j:number){setHinweis('');sichernArbeit({...a,index:j});}
      function abgeben(){
        const offen=ergebnisse.filter((e,j)=>e.task?!bereit(e.task,a.antworten[j]):!e.zahlen!.every((n,row)=>String(n).split('').every((_,col)=>a.antworten[j]['s'+row+'-'+col]))||!e.zahlen![0].toString().split('').every((_,col)=>a.antworten[j]['v'+col]&&a.antworten[j]['e'+col]));
        if(offen.length&&!hinweis){setHinweis(`${offen.length} Aufgaben sind noch offen oder unvollständig. Du kannst zurückgehen oder jetzt endgültig abgeben.`);return;}
        const schwach=ergebnisse.filter(e=>anzahl(e.punkte)<e.punkte.length).map(e=>e.ziel);
        sichern({arbeit:{...a,fertig:true},ziele:[...new Set([...schwach,...stand.ziele])].slice(0,12)});setHinweis('');
      }
      const edit=(k:string,v:string)=>{sichernArbeit({...a,antworten:a.antworten.map((w,j)=>i===j?{...w,[k]:v}:w)});setHinweis('');};
      inhalt=<>{nav}<section className="panel"><span className="eyebrow">PROBEKLASSENARBEIT · AUFGABE {i+1} VON 8</span><h2>{item.titel}</h2>
      <nav aria-label="Aufgabe auswählen" className="ad-actions">{pruefplan.map((_,j)=><button className={'btn small '+(j===i?'':'ghost')} aria-current={j===i?'step':undefined} key={j} onClick={()=>weiter(j)}>{j+1}</button>)}</nav>
      {item.task?<Aufgabenfelder key={i} a={item.task} w={a.antworten[i]} set={edit} test/>:<Subtraktionsraster key={i} zahlen={item.zahlen!} werte={a.antworten[i]} schreiben={edit} pruefung/>}
      <div className="ad-actions">{i>0&&<button className="btn ghost" onClick={()=>weiter(i-1)}>Zurück</button>}{i<7?<button className="btn" onClick={()=>weiter(i+1)}>Weiter</button>:<button className="btn" onClick={abgeben}>{hinweis?'Endgültig abgeben':'Arbeit abgeben'}</button>}</div>{hinweis&&<p role="status">{hinweis}</p>}</section></>;
    }
  }
  return <div className="ad-school">{title}{speicherFehler&&<p role="status">Der Browser kann deinen Lernstand gerade nicht speichern. Die aktuelle Runde funktioniert weiter.</p>}{inhalt}</div>;
}

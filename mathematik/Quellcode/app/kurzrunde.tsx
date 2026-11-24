import {useState,useEffect} from 'react';
import {blattaufgabe, themen, belege} from '@/lib/lernatelier';
import {plainNumber} from '@/lib/groessen-core';
import {divisionsTipp} from '@/lib/denkaufgaben';
import {berlinDay} from '@/lib/learning';
import {useUebungsversuch,type Versuch} from './uebungsversuch';
import {Speak} from './widgets';

type Rechenart = 'addition' | 'subtraktion' | 'multiplikation' | 'division';
type Status = 'selbst' | 'hilfe' | 'offen';
const rechenarten: Rechenart[] = ['addition', 'subtraktion', 'multiplikation', 'division'];

type Nachstand=Partial<Record<number,Status>>;
type Runde={seed:number;bilanz:Status[];nachuebung:{index:number;seed:number}|null;nachstand:Nachstand;antwort:string;hilfe:boolean;bewertung:Status|null;ersterFehler:string|null;versuch:Versuch;tagesprobe?:boolean};
const statuswerte=['selbst','hilfe','offen'];
function laden(key:string):Runde|null {
  try {
    const r=JSON.parse(localStorage.getItem(key)??'null');
    if(!r||!Number.isInteger(r.seed)||!Array.isArray(r.bilanz)||r.bilanz.length>3||!r.bilanz.every((s:string)=>statuswerte.includes(s))||
       !r.nachstand||typeof r.nachstand!=='object'||typeof r.antwort!=='string'||typeof r.hilfe!=='boolean'||
       !(r.bewertung===null||statuswerte.includes(r.bewertung))||!(r.ersterFehler===null||typeof r.ersterFehler==='string')||
       !r.versuch||typeof r.versuch.aufgabenId!=='string'||!Number.isInteger(r.versuch.versuche)||
       !(r.nachuebung===null||([0,1,2].includes(r.nachuebung?.index)&&Number.isInteger(r.nachuebung.seed)))) return null;
    return r;
  } catch {return null;}
}
export function Kurzrunde({fach}: {fach: Rechenart}) {
  const key='mathe-kompass-kurzrunde-'+fach+'-v1';
  const [alt]=useState(()=>laden(key));
  const [tagesprobe,setTagesprobe]=useState(!!alt?.tagesprobe);
  const [seed, setSeed] = useState<number | null>(alt?.seed??null);
  const [bilanz, setBilanz] = useState<Status[]>(alt?.bilanz??[]);
  const [nachuebung, setNachuebung] = useState<{index:number;seed:number} | null>(alt?.nachuebung??null);
  const [nachstand, setNachstand] = useState<Partial<Record<number, Status>>>(alt?.nachstand??{});
  const [antwort, setAntwort] = useState(alt?.antwort??'');
  const [hilfe, setHilfe] = useState(alt?.hilfe??false);
  const [bewertung, setBewertung] = useState<Status | null>(alt?.bewertung??null);
  const versuch = useUebungsversuch(alt?.versuch);
  const [ersterFehler, setErsterFehler] = useState<string | null>(alt?.ersterFehler??null);
  useEffect(()=>{
    if(seed===null)return;
    try {localStorage.setItem(key,JSON.stringify({seed,bilanz,nachuebung,nachstand,antwort,hilfe,bewertung,ersterFehler,tagesprobe,versuch:versuch.stand.current}));}catch{}
  },[key,seed,bilanz,nachuebung,nachstand,antwort,hilfe,bewertung,ersterFehler,tagesprobe,versuch.stand]);
  function hinweisZeigen() {
    versuch.hinweis();
    setHilfe(true);
  }
  function neueAntwort() {
    versuch.zuruecksetzen();
    setErsterFehler(null);
    setAntwort('');
    setHilfe(false);
    setBewertung(null);
  }
  function starten() {
    setSeed(Math.floor(Math.random() * 1000000));
    setTagesprobe(false);
    setBilanz([]);
    setNachuebung(null);
    setNachstand({});
    neueAntwort();
  }
  const index = nachuebung?.index ?? bilanz.length;
  const ziel = [{addition:'Mit Übertrag addieren', subtraktion:'Über eine Null hinweg entbündeln', multiplikation:'Mit Teilprodukten multiplizieren', division:'Die Null im Quotienten eintragen'}[fach], 'Das Ergebnis auf Zehner runden', 'Eine Sachaufgabe mit '+themen[fach]+' lösen'];
  const namen=['Schriftlich rechnen','Ergebnis runden','Sachaufgabe'];
  const heute=berlinDay();
  const verlauf=belege().filter(b=>b.ziel.startsWith(themen[fach]+' · '));
  const faellig=namen.findIndex(name=>{
    const liste=verlauf.filter(b=>b.ziel===themen[fach]+' · '+name);
    const letzte=liste.at(-1);
    return letzte?.wiederholung && letzte.status==='selbst' && berlinDay(new Date(letzte.tag))<heute &&
      liste.some(b=>b.status!=='selbst') && !liste.some(b=>b.aufgabe.startsWith('Tagesprobe · ') && b.status==='selbst' && b.tag>=letzte.tag);
  });
  function tagesstart(){
    const neu=Math.floor(Math.random()*1000000);
    const gesehen=verlauf.filter(b=>b.ziel===themen[fach]+' · '+namen[faellig]).map(b=>b.aufgabe);
    let nr=neu;
    for(let i=0;i<100&&gesehen.some(text=>text.includes(aufgabe(faellig,nr).text.split('Zeige')[0]));i++)nr+=7919;
    setSeed(seed??neu);setTagesprobe(true);setNachuebung({index:faellig,seed:nr});neueAntwort();
  }
  function aufgabe(i:number, s:number) { return blattaufgabe(i === 2 ? 'sach' : fach,s,rechenarten.indexOf(fach)); }
  const a = aufgabe(index,nachuebung?.seed ?? (seed ?? 0) + index * 7919);
  function nachueben(i:number) {
    const altSeed=(seed ?? 0)+i*7919;
    const alt=aufgabe(i,altSeed);
    let neu=altSeed+7919;
    while(aufgabe(i,neu).antwort===alt.antwort) neu+=7919;
    setNachuebung({index:i,seed:neu});
    neueAntwort();
  }
  function abschliessen(status:Status) {
    if(tagesprobe){setTagesprobe(false);setNachuebung(null);if(bilanz.length===0){setSeed(null);try{localStorage.removeItem(key);}catch{}}}
    else if(nachuebung) {
      setNachstand({...nachstand,[index]:status});
      setNachuebung(null);
    } else setBilanz([...bilanz,status]);
    neueAntwort();
  }
  const zehner = Math.round(a.antwort / 10) * 10;
  const frage = index === 1 ? a.text.replace('Zeige deine Zwischenschritte.', 'Runde dein Ergebnis auf den nächsten Zehner.') : a.text;
  const erwartet = index === 1 ? zehner : a.antwort;
  const weg = index === 1 ? a.weg + ' Auf Zehner gerundet: ' + zehner + '.' : a.weg;
  const [x, y] = a.werte;
  const tipps = {
    addition: `Beginne rechts mit ${x % 10} + ${y % 10}. Welche Ziffer bleibt bei den Einern und was trägst du zu den Zehnern weiter?`,
    subtraktion: `Bei den Einern stehen ${x % 10} und ${y % 10}. Du brauchst einen Zehner. Schau auf die Null in der Zehnerspalte: Von welcher Stelle kannst du zuerst tauschen?`,
    multiplikation: `Zerlege ${y} in ${y - y % 10} und ${y % 10}. Multipliziere beide Teile mit ${x} und addiere die Teilprodukte.`,
    division: `Prüfe die Zehnerstelle im Quotienten. Passt ${y} nach dem Herunterholen keinmal in die nächste Teilzahl? Auch diese Stelle braucht eine Ziffer.`
  };
  const tipp = index === 1 ? 'Rechne zuerst genau. Die Einerstelle entscheidet: Bei 0 bis 4 rundest du ab, bei 5 bis 9 auf.' : index === 2 ? a.weg.split(':')[0] + '. Zeichne die Mengen und rechne noch einmal.' : fach==='division'?divisionsTipp(erwartet,ersterFehler===null?null:plainNumber(ersterFehler),y):tipps[fach];
  function pruefen() {
    if (bewertung || plainNumber(antwort) === null || antwort.trim() === ersterFehler) return;
    const richtig = plainNumber(antwort) === erwartet;
    const status = versuch.pruefen(themen[fach] + ' · ' + ['Schriftlich rechnen', 'Ergebnis runden', 'Sachaufgabe'][index], (tagesprobe?'Tagesprobe · ':'')+frage, richtig, !!nachuebung);
    if (!richtig && ersterFehler === null) {
      setErsterFehler(antwort.trim());
      hinweisZeigen();
    } else if (status) setBewertung(status);
  }
  return <section className="panel"><h2>Kurzrunde mit drei Aufgaben</h2>
    {!nachuebung && (seed===null||bilanz.length===3) && faellig>=0 && <button className="btn ghost" onClick={tagesstart}>Heute noch einmal · {ziel[faellig]}</button>}
    {verlauf.some(b=>b.aufgabe.startsWith('Tagesprobe · '))&&<details><summary>Meine Wiederholungen mit Datum</summary>{verlauf.filter(b=>b.wiederholung).slice(-8).map((b,i)=><p key={i}>{new Date(b.tag).toLocaleDateString('de-DE')} · {b.ziel} · {b.status}</p>)}</details>}
    {seed === null ? <><p>Rechne im Heft, runde ein Ergebnis und löse eine Sachaufgabe.</p><button className="btn" onClick={starten}>Kurzrunde starten</button> <a className="btn ghost" href="#denklabor">Im Denklabor vertiefen</a></> :
      bilanz.length === 3 && !nachuebung ? <div><div role="status"><p>{bilanz.filter(s => s === 'selbst').length} von 3 selbstständig gelöst. Mit Hinweis gelöst: {bilanz.filter(s => s === 'hilfe').length}. Noch üben: {bilanz.filter(s => s === 'offen').length}.</p></div>
        {bilanz.some(s=>s!=='selbst') && <><h3>Deine nächsten Übungsziele</h3><ul>{bilanz.map((status,i)=>status!=='selbst' && <li key={i}><strong>{ziel[i]}</strong><p>{status==='offen'?'In der Kurzrunde noch offen.':'In der Kurzrunde mit Hinweis gelöst.'}</p>
          {nachstand[i] ? <p>Nachübung: {nachstand[i]==='selbst'?'selbstständig gelöst':nachstand[i]==='hilfe'?'mit Hilfe gelöst':'noch offen'}.</p> : <button className="btn ghost" onClick={()=>nachueben(i)}>Eine ähnliche Aufgabe üben · {ziel[i]}</button>}</li>)}</ul></>}
        <button className="btn" onClick={starten}>Neue Kurzrunde</button></div> :
      <><h3>{tagesprobe?'Tagesprobe · '+ziel[index]:nachuebung?'Nachübung · '+ziel[index]:'Aufgabe '+(index+1)+' von 3'}</h3><p>{frage} <Speak text={frage}/></p>
        <form onSubmit={e => {e.preventDefault(); pruefen();}}>
          <label>{index === 1 ? 'Gerundetes Ergebnis' : 'Ergebnis'} {a.einheit && 'in ' + a.einheit}<input inputMode="numeric" value={antwort} disabled={!!bewertung} onChange={e => setAntwort(e.target.value)}/></label>
          {!bewertung && <div className="ad-actions"><button className="btn" disabled={plainNumber(antwort) === null || antwort.trim() === ersterFehler}>{ersterFehler === null ? 'Ergebnis prüfen' : 'Korrektur prüfen'}</button><button type="button" className="btn ghost" onClick={hinweisZeigen}>Hinweis zeigen</button></div>}
        </form>
        {hilfe && !bewertung && <p role="status">{ersterFehler !== null && <b>Versuche es noch einmal. </b>}{tipp} <Speak text={tipp}/></p>}
        {bewertung && <div role="status"><p><b>{bewertung === 'offen' ? 'Vergleiche deinen Rechenweg.' : 'Richtig gerechnet.'}</b> {weg} Ergebnis: {erwartet} {a.einheit}.</p><button className="btn" onClick={() => abschliessen(bewertung)}>{tagesprobe ? 'Tagesprobe abschließen' : nachuebung ? 'Zur Rundenauswertung' : index === 2 ? 'Runde auswerten' : 'Nächste Kurzaufgabe'}</button></div>}
      </>}
  </section>;
}

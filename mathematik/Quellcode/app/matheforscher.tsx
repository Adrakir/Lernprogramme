import {useState} from 'react';
import {berlinDay} from '@/lib/learning';
import {belege,notieren} from '@/lib/lernatelier';
import {plainNumber} from '@/lib/groessen-core';

const themen=['Überschlagen','Rechenwege vergleichen','Einheiten wählen','Messen ohne Null','Über Mitternacht','Rundungsgrenzen','Fehlende Ziffer','Gegenbeispiele'];
const ziel=(i:number)=>'Forscheraufgabe · '+themen[i];
function spaeter(){
 const heute=berlinDay();
 return themen.map((_,i)=>i).filter(i=>{
  const letzter=belege().filter(b=>b.ziel===ziel(i)).at(-1);
  return letzter&&berlinDay(new Date(letzter.tag))<heute;
 });
}
export function ForscherStart(){
 const offen=spaeter();
 return <p><a className="btn ghost" href="#matheforscher">{offen.length?'Zwei-Minuten-Wiederholung ist bereit':'Matheforscher: acht Aufgaben zum Entdecken'}</a></p>;
}
export function ForscherStand(){
 const liste=belege().filter(b=>themen.some((_,i)=>b.ziel===ziel(i))).reverse();
 return liste.length?<section className="panel"><h2>Meine Forscheraufgaben</h2><ul>{liste.slice(0,8).map((b,i)=><li key={i}>{b.aufgabe} · {b.wiederholung?'an einem späteren Tag':'am Übungstag'} {b.status==='selbst'?'selbstständig':'mit Rückmeldung'} gelöst</li>)}</ul></section>:null;
}
export function Fehlerweg(){
 const [s,zeigen]=useState(0);
 const zeilen=['Eine Beispielrechnung: 402 − 178 = 376. Findet den ersten falschen Schritt.',
 'Einer: „8 minus 2 ergibt 6.“ Was hat das Kind hier gemacht?',
 'Hier liegt der erste Fehler: Von 2 Einern sollen 8 abgezogen werden. Tausche 1 Hunderter in 10 Zehner und davon 1 Zehner in 10 Einer.',
 'Einer: 12 − 8 = 4. Zehner: Nach dem Tauschen bleiben 9. Also 9 − 7 = 2.',
 'Hunderter: 3 − 1 = 2. Ergebnis: 224. Probe: 224 + 178 = 402.'];
 return <details className="panel"><summary>Fehlerdetektiv an der Tafel</summary><p>Deckt den erfundenen Rechenweg gemeinsam auf. Wo würdet ihr zum ersten Mal anders rechnen?</p><ol aria-live="polite">{zeilen.slice(0,s+1).map(t=><li key={t}>{t}</li>)}</ol><button className="btn ghost" disabled={!s} onClick={()=>zeigen(s-1)}>Zurück</button> <button className="btn" disabled={s===4} onClick={()=>zeigen(s+1)}>Zeile aufdecken</button></details>;
}
function Skala({start,ende}:{start:number;ende:number}){
 return <svg viewBox="0 0 500 86" role="img" aria-label={'Lineal von 2 bis 10 cm. Der Streifen liegt zwischen '+(start/10).toLocaleString('de')+' und '+(ende/10).toLocaleString('de')+' cm.'} style={{width:'100%',maxWidth:720}}>
 <rect x={(start-20)*5.7+18} y="5" width={(ende-start)*5.7} height="18" rx="4" fill="#187e76"/>
 {Array.from({length:81},(_,i)=><g key={i}><path d={'M'+(18+i*5.7)+' 26v'+(i%10===0?25:i%5===0?18:9)} stroke="currentColor"/>{i%10===0&&<text x={18+i*5.7} y="72" textAnchor="middle" fill="currentColor">{2+i/10}</text>}</g>)}</svg>;
}
function Aufgabe({i,variant,review}:{i:number;variant:number;review:boolean}){
 const [v,set]=useState<Record<string,string>>({}),[meldung,melde]=useState(''),[fertig,ende]=useState(false),[hilfe,hinweis]=useState(false);
 const [weg,zeige]=useState(''),[versatz,schiebe]=useState(0),[grenzen,markiere]=useState([0,200]);
 const alt=variant%2!==0, wert=(k:string)=>v[k]??'', n=(k:string)=>plainNumber(wert(k));
 const edit=(k:string,x:string)=>{set({...v,[k]:x});melde('');};
 const feld=(label:string,k:string,wort=false)=><label>{label}<input value={wert(k)} inputMode={wort?'text':'decimal'} onChange={e=>edit(k,e.target.value)}/></label>;
 const wahl=(label:string,k:string,opts:string[])=><label>{label}<select value={wert(k)} onChange={e=>edit(k,e.target.value)}><option value="">Bitte wählen</option>{opts.map(t=><option key={t}>{t}</option>)}</select></label>;
 const a=alt?602:503,b=alt?399:298, faktor=alt?7:6, nahe=alt?302:398, schaetzung=alt?2100:2400;
 const km=alt?2.4:1.8, start=(alt?27:23)+versatz, laenge=alt?49:55;
 const ab=alt?53:48, an=alt?21:17, rund=alt?2300:1200, minimum=rund-100;
 const summe=alt?753:652, plus=alt?186:185;
 const prompts=[nahe+' · '+faktor,a+' − '+b,'Schulweg: '+km.toLocaleString('de')+' …','Streifen ab '+(alt?'2,7':'2,3')+' cm','23:'+ab+' bis 00:'+an,'Auf '+rund+' runden',(alt?'5':'4')+'□7 + '+plus+' = '+summe,alt?'Gegenbeispiel mit dem Produkt null':'Wird ein Produkt immer größer?'];
 const hinweise=['Runde die erste Zahl auf einen Hunderter und multipliziere.','Ergänze zuerst bis zum nächsten Hunderter. Beide Strategien sind möglich.','Ein Schulweg zwischen zwei Ortsteilen kann mehrere Kilometer lang sein. 1 km entspricht 1.000 m.','Lies beide Enden ab. Ziehe den kleineren Messwert vom größeren ab.','Rechne zuerst bis 24:00 Uhr, danach ab 00:00 Uhr.','Die untere Grenze liegt 50 unter dem Ziel. Die obere endet unmittelbar vor der nächsten Aufrundung.','Prüfe die Einer: Sie ergeben einen Übertrag für die Zehner.','Probiere zu deiner Startzahl einen Faktor von 0 oder 1.'];
 const zahl=n('zahl'), mal=n('mal');
 const kriterium=[wert('grob')===String(schaetzung)&&n('genau')===nahe*faktor,
 n('genau')===a-b&&!!wert('strategie')&&!!wert('grund').trim()&&n('wechsel')===(alt?4:3),
 wert('einheit')==='km'&&n('meter')===Math.round(km*1000)&&!!wert('grund').trim(),
 n('anfang')===start/10&&n('ende')===(start+laenge)/10&&n('lang')===laenge/10,
 n('bis')===60-ab&&n('nach')===an&&n('dauer')===60-ab+an,
 grenzen[0]===50&&grenzen[1]===149,
 n('luecke')===6&&n('uebertrag')===1,
 zahl!==null&&mal!==null&&Number.isSafeInteger(zahl)&&Number.isSafeInteger(mal)&&zahl>0&&mal>=0&&zahl*mal<=zahl&&(!alt||zahl*mal===0)&&wert('regel')==='größer als 1'][i];
 function pruefen(){if(!kriterium){hinweis(true);melde(hinweise[i]);return;}
  ende(true);melde(i===0?'Richtig. Dein Ergebnis liegt nahe bei deinem Überschlag.':i===7?'Dein Gegenbeispiel stimmt. Für eine positive Startzahl macht ein Faktor größer als 1 das Produkt größer.':'Die überprüfbaren Angaben stimmen.');
  notieren(ziel(i),prompts[i],hilfe?'hilfe':'selbst',review,!hilfe,hilfe);
 }
 return <section className="panel"><h2>{themen[i]}</h2><fieldset disabled={fertig} style={{minWidth:0}}><legend>{prompts[i]}</legend>
 {i===0&&<>{wahl('Mein Überschlag','grob',[schaetzung/10,schaetzung,schaetzung*10].map(String))}{wert('grob')&&feld('Jetzt genau ausrechnen','genau')}</>}
 {i===1&&<><p>Vergleiche die beiden Wege.</p>{['Schriftlich abziehen','Ergänzen'].map(x=><button className="btn ghost" key={x} onClick={()=>zeige(x)}>{x}</button>)}<p role="status">{weg==='Ergänzen'?(alt?'399 + 1 + 202 = 602':'298 + 2 + 203 = 503'):weg?(alt?'12 − 9 Einer, 9 − 9 Zehner, 5 − 3 Hunderter.':'13 − 8 Einer, 9 − 9 Zehner, 4 − 2 Hunderter.') :''}</p>{feld('Differenz','genau')}<p>Welchen Weg wählst du bei {alt?'703 − 699':'602 − 599'}?</p>{wahl('Meine Strategie','strategie',['Ergänzen','Schriftlich abziehen'])}{feld('Meine Begründung','grund',true)}{feld('Ergebnis der neuen Aufgabe','wechsel')}</>}
 {i===2&&<><p>Der Weg zwischen zwei Ortsteilen beträgt {km.toLocaleString('de')} …</p>{wahl('Passende Einheit','einheit',['mm','cm','km'])}{feld('Warum passt die Einheit?','grund',true)}{feld('Der Weg in Metern','meter')}</>}
 {i===3&&<><Skala start={start} ende={start+laenge}/><label>Streifen verschieben<input type="range" min="0" max="14" value={versatz} onChange={e=>schiebe(+e.target.value)}/></label>{feld('Anfang in cm','anfang')}{feld('Ende in cm','ende')}{feld('Länge in cm','lang')}</>}
 {i===4&&<><p>Setze den Zwischenstopp auf Mitternacht.</p><label>Minuten vom Start bis zum Zwischenstopp: {wert('bis')||'0'}<input type="range" min="0" max={60-ab+an} value={wert('bis')||0} onChange={e=>edit('bis',e.target.value)}/></label><p>23:{ab} Uhr → {String((23+Math.floor((ab+Number(wert('bis')))/60))%24).padStart(2,'0')}:{String((ab+Number(wert('bis')))%60).padStart(2,'0')} Uhr → 00:{an} Uhr</p>{feld('Minuten nach Mitternacht','nach')}{feld('Gesamte Fahrt in Minuten','dauer')}</>}
 {i===5&&<><p>Welche ganzen Zahlen ergeben beim Runden auf Hunderter {rund}? Markiere beide Grenzen.</p><svg viewBox="0 0 450 55" style={{width:'100%',maxWidth:640}} aria-label="Zahlenstrahl mit beiden markierten Grenzen" role="img"><path d="M25 16H425" stroke="currentColor"/>{[0,50,100,150,200].map(x=><g key={x}><path d={'M'+(25+x*2)+' 13v8'} stroke="currentColor"/><text x={25+x*2} y="44" textAnchor="middle" fill="currentColor">{minimum+x}</text></g>)}{grenzen.map((x,k)=><circle key={k} cx={25+x*2} cy="16" r="6" fill={k?'#be7815':'#207f85'}/>)}</svg>{grenzen.map((x,j)=><label key={j}>{j?'Größte':'Kleinste'} Zahl: {minimum+x}<input type="range" min="0" max="200" value={x} onChange={e=>markiere(grenzen.map((alt,k)=>k===j?+e.target.value:alt))}/></label>)}<details><summary>Nachbarzahlen prüfen</summary>{[grenzen[0]-1,grenzen[0],grenzen[1],grenzen[1]+1].map((x,k)=><p key={k}>{minimum+x} → {Math.round((minimum+x)/100)*100}</p>)}</details></>}
 {i===6&&<>{feld('Fehlende Zehnerziffer','luecke')}{feld('Übertrag von den Einern','uebertrag')}</>}
 {i===7&&<><p>„Beim Multiplizieren wird meine positive Startzahl immer größer.“ Widerlege das mit ganzen Zahlen ab null. {alt?'Finde diesmal ein Produkt, das null ergibt.':''}</p>{feld('Positive Startzahl','zahl')}{feld('Faktor','mal')}{zahl!==null&&mal!==null&&<p>{zahl} · {mal} = {zahl*mal}</p>}{wahl('Wann wird das Produkt bei positiver Startzahl größer? Der Faktor ist …','regel',['gleich 0','gleich 1','größer als 1'])}</>}
 <button className="btn" onClick={pruefen}>Antwort prüfen</button></fieldset><p role="status">{meldung}</p></section>;
}
export function Matheforscher(){
 const [i,waehle]=useState(0),[variante,wechsel]=useState(0),[review,wiederhole]=useState(false);
 const offen=spaeter();
 function beginnen(k:number,sp:boolean){
  waehle(k);wiederhole(sp);
  const letzter=belege().filter(b=>b.ziel===ziel(k)).at(-1);
  const erstes=['398 · 6','503 − 298','Schulweg: 1,8 …','Streifen ab 2,3 cm','23:48 bis 00:17','Auf 1200 runden','4□7 + 185 = 652','Wird ein Produkt immer größer?'];
  wechsel(sp&&letzter?(letzter.aufgabe===erstes[k]?1:0):0);
 }
 return <div className="ad-school"><h1>Matheforscher</h1>{offen.length>0&&<button className="btn" onClick={()=>beginnen(offen[0],true)}>Zwei-Minuten-Wiederholung starten</button>}
 <label>Thema wählen<select value={i} onChange={e=>beginnen(+e.target.value,false)}>{themen.map((t,k)=><option key={t} value={k}>{t}</option>)}</select></label><Aufgabe key={[i,variante,review].join('-')} i={i} variant={variante} review={review}/>
 <button className="btn ghost" onClick={()=>{wiederhole(false);wechsel(variante+1);}}>Weitere Aufgabe zum Thema</button><Fehlerweg/><a href="#progress">Zum Lernstand</a></div>;
}

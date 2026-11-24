import {useState} from 'react';

const tickets = {
 Division:[
  ['Warum braucht 704 bei 2816 : 4 eine Null?', 'Die Erklärung nennt die leere Zehnerstelle und die Teilzahl 1, in die 4 keinmal passt.'],
  ['Wie kannst du zeigen, dass 1248 : 6 mehr als 28 ergibt?', 'Die Erklärung zeigt 208 · 6 = 1248 oder erklärt die Null bei den Zehnern.']],
 Übertrag:[
  ['Warum gibt es bei 8 + 2 einen Übertrag?', 'Zehn Einer werden zu einem Zehner. Bei den Einern bleibt eine Null.'],
  ['Was ändert sich von 8 + 1 zu 8 + 3?', 'Die erste Summe bleibt unter zehn. Die zweite bündelt einen Zehner und lässt einen Einer übrig.']],
 Punktefeld:[
  ['Wie kannst du 6 · 14 an der zehnten Spalte aufteilen?', 'Zwei Teilprodukte: 60 + 24 = 84.'],
  ['Warum bleibt die Punktzahl beim Zerlegen gleich?', 'Jeder Punkt gehört genau einem Teilfeld. Beide Teilprodukte werden addiert.']],
 Zeit:[
  ['Warum dauert die Fahrt von 23:48 bis 00:17 genau 29 Minuten?', 'Bis Mitternacht vergehen 12 Minuten, danach 17.'],
  ['Was passiert eine Minute nach 1 h 59 min?', '60 Minuten werden zur zweiten vollen Stunde gebündelt.']]
} as const;
export function Unterrichtsgespraech(){
 const [thema,setThema]=useState<keyof typeof tickets>('Division'),[version,setVersion]=useState(0),[antwort,setAntwort]=useState(''),[zeile,setZeile]=useState(0),[grund,setGrund]=useState(''),[pruefen,setPruefen]=useState(false);
 const [frage,kriterium]=tickets[thema][version];
 return <><details className="panel"><summary>Exit-Ticket · zwei Minuten</summary>
 <label>Thema<select value={thema} onChange={e=>{setThema(e.target.value as keyof typeof tickets);setAntwort('');}}>{Object.keys(tickets).map(t=><option key={t}>{t}</option>)}</select></label>
 <button className="btn ghost" onClick={()=>{setVersion(1-version);setAntwort('');}}>Variante wechseln</button><h3>Variante {version?'B':'A'}</h3><label>{frage}<textarea value={antwort} onChange={e=>setAntwort(e.target.value)}/></label>
 <details key={frage}><summary>Bewertungskriterium</summary><p>{kriterium}</p></details></details>
 <details className="panel"><summary>Zwei anonyme Heftlösungen besprechen</summary><p>398 + 257. Vergleicht die Wege und markiert die erste Zeile, in der sie auseinandergehen.</p>
 <table className="ad-grid"><thead><tr><th>Zeile</th><th>Heft A</th><th>Heft B</th></tr></thead><tbody>{[['398 + 257','398 + 257'],['400 + 257 = 657','400 + 257 = 657'],['657 − 2','657 + 2'],['655','659']].map(([a,b],i)=><tr key={i}><th><button className="btn ghost" aria-pressed={zeile===i+1} onClick={()=>{setZeile(i+1);setPruefen(false);}}>{i+1}</button></th><td>{a}</td><td>{b}</td></tr>)}</tbody></table>
 <label>Warum ist diese Stelle entscheidend?<textarea value={grund} onChange={e=>{setGrund(e.target.value);setPruefen(false);}}/></label><button className="btn" disabled={!zeile||!grund.trim()} onClick={()=>setPruefen(true)}>Mit der Erklärung vergleichen</button>
 {pruefen&&<p role="status">{zeile===3?'Die markierte Zeile stimmt.':'Vergleiche noch einmal Zeile 3.'} Beim Ersetzen von 398 durch 400 kamen zwei hinzu. Heft A zieht sie wieder ab.</p>}</details></>;
}

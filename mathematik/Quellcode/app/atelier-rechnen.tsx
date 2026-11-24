import {useState} from 'react';
import {Zahl,Regler,Begruenden,Wahl} from './atelier-felder';
import {Buendeln} from './additionsraster';

export function Ueberschlag({v}:{v:number}){
 const x=398+100*v,y=257,wert=x+y,optionen=[wert-500,wert,wert+400];
 const [weg,set]=useState<number[]>([]),[fertig,ende]=useState(false),[meld,melde]=useState('');
 return <><p>{x} + {y}. Streiche durch Überschlagen zwei unmögliche Ergebnisse.</p><div className="ad-actions">{optionen.map(n=><button key={n} className="btn ghost" disabled={fertig} aria-pressed={weg.includes(n)} onClick={()=>{set(weg.includes(n)?weg.filter(w=>w!==n):[...weg,n]);melde('');}}>{weg.includes(n)?<s>{n}</s>:n}</button>)}</div>
 <button className="btn" disabled={fertig||weg.length!==2} onClick={()=>{const ok=!weg.includes(wert);ende(ok);melde(ok?'Dein Überschlag passt.':'Runde beide Zahlen auf Hunderter. Welcher Wert liegt in der Nähe?');}}>Überschlag prüfen</button><p role="status">{meld}</p>
 {fertig&&<><Zahl frage={'Rechne jetzt genau: '+x+' + '+y+'.'} wert={wert} weg={x+' + '+y+' = '+wert+'.'}/><Begruenden frage="Warum konntest du die anderen Werte ausschließen?" beispiel={'Die Summe liegt ungefähr bei '+(700+100*v)+'. Beide gestrichenen Werte liegen mehrere Hundert davon entfernt.'}/></>}</>;
}
export function Ziffern(){
 const [a,setA]=useState(''),[b,setB]=useState(''),[liste,set]=useState<number[]>([]),[meld,melde]=useState('');
 const x=408+10*Number(a),y=703+10*Number(b);
 return <><p>4□8 + 275 = 7□3. Welche Ziffernpaare machen die Rechnung richtig?</p><label>Zehner der ersten Zahl<input inputMode="numeric" maxLength={1} value={a} onChange={e=>{if(/^\d?$/.test(e.target.value))setA(e.target.value);melde('');}}/></label>
 <label>Zehner des Ergebnisses<input inputMode="numeric" maxLength={1} value={b} onChange={e=>{if(/^\d?$/.test(e.target.value))setB(e.target.value);melde('');}}/></label><button className="btn" disabled={!a||!b} onClick={()=>{const ok=x+275===y;melde(ok?(liste.includes(x)?'Dieses Paar hast du bereits gefunden.':'Richtig! Die Einer 8 + 5 geben einen Zehner weiter.'):'Bei den Zehnern rechnest du deine Ziffer + 7 + 1. Prüfe auch den Übertrag zu den Hundertern.');if(ok&&!liste.includes(x))set([...liste,x]);}}>Paar prüfen</button><p role="status">{meld}</p><p>{liste.length} von 8 möglichen Paaren gefunden.</p><ul>{liste.map(n=><li key={n}>{n} + 275 = {n+275}</li>)}</ul></>;
}
export function Gleichgewicht(){
 const [n,set]=useState(55),d=n+20-55;
 return <><p>38 + 17 = □ + 20. Verändere den fehlenden Summanden, bis beide Seiten gleich schwer sind.</p><svg viewBox="0 0 320 95" role="img" aria-label={d===0?'Waage im Gleichgewicht':d>0?'Rechte Seite schwerer':'Linke Seite schwerer'}><path d="M145 85l15-45 15 45z" fill="#396a72"/><g transform={'rotate('+Math.max(-12,Math.min(12,d))+',160,43)'}><path d="M30 43H290" stroke="currentColor" strokeWidth="5"/><circle cx="55" cy="36" r="9" fill="#bf7545"/><circle cx="265" cy="36" r="9" fill="#278075"/></g></svg>
 <Regler name="Fehlender Summand" max={70} wert={n} set={set}/><p aria-live="polite">Links: 55. Rechts: {n} + 20 = {n+20}. {d===0?'Gleichgewicht!':d>0?'Rechts ist schwerer.':'Links ist schwerer.'}</p></>;
}
export function Trick(){
 const [a,setA]=useState(52),[b,setB]=useState(19),[art,setArt]=useState(false);
 const px=(n:number)=>10+3*n;
 return <><p>„Wenn ich beide Zahlen um eins erhöhe, bleibt das Ergebnis gleich.“ Untersuche dieselben Zahlen bei Minus und Plus.</p>
 <Regler name="Erste Zahl" min={40} max={60} wert={a} set={setA}/><Regler name="Zweite Zahl" min={10} max={25} wert={b} set={setB}/>
 <button className="btn ghost" onClick={()=>setArt(!art)}>{art?'Subtraktion untersuchen':'Addition untersuchen'}</button>
 {[0,1].map(i=>{const x=a+i,y=b+i,lo=art?x:y,hi=art?x+y:x;return <div key={i}><p>{x} {art?'+':'−'} {y} = {art?x+y:x-y}</p><svg viewBox="0 0 285 37" role="img" aria-label={'Zahlenstrahl: markierte Strecke von '+lo+' bis '+hi}><path d="M8 13H279" stroke="currentColor"/><path d={`M${px(lo)} 13H${px(hi)}`} stroke="#227975" strokeWidth="6"/>{[lo,hi].map(n=><text key={n} x={px(n)} y="33" fontSize="12" fill="currentColor">{n}</text>)}</svg></div>;})}
 <Wahl frage="Für welche Rechenart gilt die Behauptung immer?" optionen={['Addition','Subtraktion','Für beide']} richtig={1} weg="Bei der Subtraktion bleibt der Abstand zwischen den Zahlen gleich." tipp="Vergleiche beide Ergebnisse vor und nach der Verschiebung."/><Begruenden frage="Erkläre den Unterschied am Zahlenstrahl." beispiel="Bei Minus verschieben sich beide Endpunkte gleich weit. Bei Plus wachsen beide Summanden um eins und die Summe wächst um zwei."/></>;
}
export function Probe(){
 const [fehler,setFehler]=useState(false),ergebnis=fehler?252:225,karten=[String(ergebnis),'278','503','+','='];
 const [gelegt,set]=useState<string[]>([]),[meldung,melde]=useState('');
 return <><p>503 − 278 = {ergebnis}. Lege eine Additionsprobe aus fünf Karten.</p><div className="ad-actions">{karten.map(k=><button className="btn ghost" disabled={gelegt.includes(k)} key={k} onClick={()=>{set([...gelegt,k]);melde('');}}>{k}</button>)}</div><p aria-live="polite">{gelegt.join(' ')||'Noch keine Karte gelegt.'}</p>
 <button className="btn" disabled={gelegt.length!==5} onClick={()=>{const s=gelegt.join(' '),sum=ergebnis+278;const passt=[ergebnis+' + 278 = 503','278 + '+ergebnis+' = 503','503 = 278 + '+ergebnis,'503 = '+ergebnis+' + 278'].includes(s);melde(passt?(sum===503?'Die Probe bestätigt die Rechnung.':'Die Probe entdeckt den Zahlendreher: '+ergebnis+' + 278 = '+sum+' statt 503.'):'Lege die Differenz und den Subtrahenden auf eine Seite und den Minuenden auf die andere.');}}>Probe auswerten</button> <button className="btn ghost" onClick={()=>{set(gelegt.slice(0,-1));melde('');}}>Karte zurück</button><p role="status">{meldung}</p>
 <button className="btn ghost" onClick={()=>{setFehler(!fehler);set([]);melde('');}}>{fehler?'Originalrechnung':'Zahlendreher einbauen'}</button></>;
}
export function Hilfen(){
 const [runde,setRunde]=useState(0),[hilfen,set]=useState([true,true,true]),[vorher,setVorher]=useState(hilfen),[fertig,ende]=useState(false);
 const [startklar,start]=useState(true);
 const x=28+10*(runde%6),y=17,labels=['Stellenwertfarben','Spaltennamen','Plättchen'];
 return <><p>{runde?'Wähle für die nächste Aufgabe selbst, welche Hilfe du noch brauchst.':'Löse die erste Aufgabe mit den drei Hilfen.'}</p>
 {labels.map((s,i)=><label key={s}><input type="checkbox" disabled={startklar||fertig} checked={hilfen[i]} onChange={()=>set(hilfen.map((b,j)=>i===j?!b:b))}/> {s}</label>)}
 {!startklar&&<button className="btn" onClick={()=>start(true)}>Mit diesen Hilfen starten</button>}
 {startklar&&<><table className="ad-grid">{hilfen[1]&&<thead><tr><th>Zehner</th><th>Einer</th></tr></thead>}<tbody>{[x,y].map(n=><tr key={n}>{[Math.floor(n/10),n%10].map((d,i)=><td key={i} style={hilfen[0]?{borderBottom:'4px solid '+(i?'#a45220':'#157070')}:undefined}>{d}</td>)}</tr>)}</tbody></table>
 {hilfen[2]&&<Buendeln key={runde} summe={15} stelle={0}/>}
 <Zahl key={runde} frage={x+' + '+y+' = ?'} wert={x+y} weg="8 + 7 ergibt 15 Einer. Einen Zehner überträgst du." lernbeleg={{ziel:'Addition · Hilfen abbauen',aufgabe:x+' + '+y+' · '+(labels.filter((_,i)=>hilfen[i]).join(', ')||'ohne Hilfen'),mitHilfe:hilfen.some(Boolean)}} beiRichtig={()=>ende(true)}/></>}
 {fertig&&<><p>{labels.filter((_,i)=>vorher[i]&&!hilfen[i]).map(s=>'Heute hast du den Übertrag ohne '+s+' gefunden.').join(' ')}</p><button className="btn" onClick={()=>{setVorher([...hilfen]);ende(false);start(false);setRunde(runde+1);}}>Ähnliche Aufgabe mit weniger Hilfe</button></>}</>;
}

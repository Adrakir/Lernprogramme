import {useState} from 'react';
import {gewichtPruefen, uebertraege} from '@/lib/denkaufgaben';
import {uhr} from '@/lib/zeit-tasks';
import {plainNumber} from '@/lib/groessen-core';

function Zahlenfrage({frage,wert,weg}:{frage:string;wert:number;weg:string}){
  const [antwort,set]=useState(''),[meldung,melde]=useState('');
  return <form onSubmit={e=>{e.preventDefault();melde(plainNumber(antwort)===wert?'Richtig. '+weg:'Prüfe noch einmal, welche Menge gesucht ist.');}}>
    <label>{frage}<input inputMode="numeric" value={antwort} onChange={e=>{set(e.target.value);melde('');}}/></label>
    <button className="btn" disabled={!antwort.trim()}>Prüfen</button><p role="status">{meldung}</p></form>;
}
function Rechenwege(){
  const [weg,set]=useState(''),[wahl,waehle]=useState(''),[grund,schreibe]=useState('');
  return <><p>Wie würdest du 398 + 257 rechnen?</p>{['Schriftlich','Mit 400 rechnen'].map(s=><button key={s} className="btn ghost" onClick={()=>set(s)}>{s}</button>)}
    {weg&&<p role="status">{weg==='Schriftlich'?'Einer: 8 + 7 = 15. Zehner: 9 + 5 + 1 = 15. Hunderter: 3 + 2 + 1 = 6. Ergebnis: 655.':'400 + 257 = 657. Du hast 2 zu viel addiert: 657 − 2 = 655.'}</p>}
    <label>Welchen Weg wählst du bei 599 + 146?<select value={wahl} onChange={e=>waehle(e.target.value)}><option value="">Wähle</option><option>Schriftlich</option><option>Mit 600 rechnen</option></select></label>
    <label>Warum passt dein Weg zu den Zahlen?<textarea value={grund} onChange={e=>schreibe(e.target.value)}/></label>
    {wahl&&grund.trim()&&<details><summary>Mit einem Beispiel vergleichen</summary><p>599 liegt nur 1 unter 600. Deshalb kann ich 600 + 146 − 1 = 745 rechnen. Schriftlich erhalte ich ebenfalls 745.</p></details>}</>;
}
function Mitternacht(){
  const [pos,set]=useState(8);
  return <><p>Ein Zug fährt um 23:48 Uhr ab und kommt am nächsten Tag um 00:17 Uhr an. Wähle einen Zwischenstopp für deine Rechnung.</p>
    <label>Zwischenstopp: {uhr((1428+pos)%1440)} Uhr<input type="range" min={1} max={28} value={pos} onChange={e=>set(+e.target.value)}/></label>
    <div className="zeitstrecken"><span style={{flex:pos}}>{pos}</span><span style={{flex:29-pos}}>{29-pos}</span></div>
    <p>23:48 → {uhr((1428+pos)%1440)} → 00:17 Uhr. Erste Strecke: {pos} min. Zweite Strecke: {29-pos} min.</p>
    <Zahlenfrage frage="Wie viele Minuten dauert die Fahrt insgesamt?" wert={29} weg="Über Mitternacht sind es 12 + 17 = 29 Minuten."/></>;
}
function Masse(){
  const [fall,setFall]=useState(0),[wahl,setWahl]=useState(''),[antwort,set]=useState(''),[meld,melde]=useState('');
  const gram=[1800,1500,1500,999,1000,1001][fall],kg=(gram/1000).toLocaleString('de-DE'),band=gram<1000?'unter 1 kg':gram>2000?'über 2 kg':'1 bis 2 kg';
  return <><p>Ein Paket wiegt {gram.toLocaleString('de-DE')} g. Schätze zuerst die Größenordnung.</p>
    {['unter 1 kg','1 bis 2 kg','über 2 kg'].map(s=><button className="btn ghost" key={s} onClick={()=>setWahl(s)}>{s}</button>)}
    {wahl&&<p role="status">{wahl===band?'Die Größenordnung passt.':'Vergleiche mit 1.000 g und 2.000 g.'}</p>}
    {wahl===band&&<><label>{fall===0?'Gib 1.800 g in Kilogramm an.':fall===2?'Gib '+kg+' kg vollständig in Gramm an.':'Wie schwer ist das Paket? Verwende kg, g oder beide Einheiten.'}<input value={antwort} onChange={e=>{set(e.target.value);melde('');}}/></label>
    <button className="btn" onClick={()=>{const feedback=gewichtPruefen(antwort,gram,fall===2);melde(fall===0&&feedback.startsWith('Richtig')&&!/^\s*\d+(?:[.,]\d+)?\s*kg\s*$/i.test(antwort)?'Die Menge stimmt. Schreibe sie jetzt in Kilogramm.':feedback);}}>Gewicht prüfen</button><p role="status">{meld}</p>{meld.startsWith('Richtig')&&<p>Das entspricht {kg} kg.</p>}</>}
    <button className="btn ghost" onClick={()=>{setFall((fall+1)%6);setWahl('');set('');melde('');}}>Anderes Paket</button></>;
}
function Geschichten({rest}:{rest:boolean}){
  const [i,set]=useState(0),[grund,schreiben]=useState('');
  const fragen=rest?['26 Gäste fahren in Autos mit je 4 Plätzen. Wie viele Autos braucht ihr mindestens?','26 Kinder bilden Viererteams. Wie viele vollständige Teams entstehen?','26 Stifte werden gerecht unter vier Kindern verteilt. Wie viele Stifte bleiben übrig?']:['In vier Kisten sind je sechs Flaschen. Wie viele Flaschen sind es insgesamt?','24 Flaschen werden zu je sechs verpackt. Wie viele Kisten brauchst du?','24 Flaschen sind gleichmäßig auf vier Kisten verteilt. Wie viele sind in jeder Kiste?'];
  const wege=rest?['6 Autos reichen für 24 Gäste. Die zwei übrigen brauchen ein siebtes Auto.','6 · 4 = 24. Zwei Kinder bleiben außerhalb der vollständigen Teams.','Jedes Kind bekommt sechs Stifte. 26 − 24 = 2 bleiben übrig.']:['4 · 6 = 24 Flaschen.','24 : 6 = 4 Kisten.','24 : 4 = 6 Flaschen pro Kiste.'];
  return <><div className="ad-actions">{(rest?['Autos','Teams','Stifte']:['Gesamtmenge','Anzahl der Kisten','Inhalt je Kiste']).map((s,j)=><button className="btn ghost" key={s} aria-pressed={i===j} onClick={()=>{set(j);schreiben('');}}>{s}</button>)}</div>
    {rest&&<label>Was bedeutet der Rest in dieser Geschichte?<textarea value={grund} onChange={e=>schreiben(e.target.value)}/></label>}
    <Zahlenfrage key={i} frage={fragen[i]} wert={(rest?[7,6,2]:[24,4,6])[i]} weg={wege[i]}/></>;
}
function Erfinden(){
  const [a,setA]=useState(''),[b,setB]=useState(''),[meldung,set]=useState('');
  return <><p>Erfinde eine Addition mit genau einem Übertrag.</p>{[[a,setA],[b,setB]].map((_,i)=><label key={i}>{i?'Zweiter':'Erster'} Summand<input inputMode="numeric" maxLength={4} value={i?b:a} onChange={e=>{(i?setB:setA)(e.target.value);set('');}}/></label>)}
    <button className="btn" disabled={![a,b].every(s=>/^\d{1,4}$/.test(s))} onClick={()=>{const stellen=uebertraege(+a,+b);set((stellen.length===1?'Genau ein Übertrag! ':'Anzahl der Überträge: '+stellen.length+'. ')+(stellen.length?'Gebündelt wird bei den '+stellen.join(', ')+'.':'Prüfe, ob eine Spaltensumme mindestens zehn erreicht.'));}}>Meine Aufgabe prüfen</button><p role="status">{meldung}</p></>;
}
export function Denklabor(){
  const teile=[['Zwei Rechenwege vergleichen',<Rechenwege/>],['Zeit über Mitternacht',<Mitternacht/>],['Gewicht schätzen und umrechnen',<Masse/>],['Was bedeutet der Rest?',<Geschichten rest/>],['Welche Größe wird gesucht?',<Geschichten rest={false}/>],['Eine Addition erfinden',<Erfinden/>]] as const;
  return <div className="ad-school"><h1>Mathe-Denklabor</h1><a className="btn ghost" href="#atelier">Weitere Aufgaben im Mathe-Atelier</a>{teile.map(([name,inhalt])=><details className="panel" key={name}><summary>{name}</summary>{inhalt}</details>)}</div>;
}

import {useState} from 'react';
import {Zahl,Wahl,Begruenden} from './atelier-felder';
import {uhr} from '@/lib/zeit-tasks';
import {notieren} from '@/lib/lernatelier';

export function FehlendeInfo(){
 const [frage,set]=useState(false),[dauer,setDauer]=useState(false);
 return <><p>Ein Bus fährt um 8:15 Uhr los. Wann kommt er an?</p><Wahl frage="Was kannst du aus dem Text schließen?" optionen={['Um 8:30 Uhr','Das kann ich noch nicht wissen','Um 9:15 Uhr']} richtig={1} weg="Stelle jetzt die Rückfrage, die dir weiterhilft." tipp="Steht im Text, wie lange der Bus unterwegs ist?" weiter={()=>set(true)}/>
 {frage&&<Wahl frage="Was möchtest du wissen?" optionen={['Wie viele Sitzplätze hat er?','Wie lange fährt er?','Welche Farbe hat er?']} richtig={1} weg="Die Fahrt dauert 47 Minuten." tipp="Welche Angabe kannst du zur Startzeit addieren?" weiter={()=>setDauer(true)}/>}
 {dauer&&<Wahl frage="Wann kommt der Bus an?" optionen={['8:52 Uhr','9:02 Uhr','9:12 Uhr']} richtig={1} weg="45 Minuten bis 9:00 Uhr und zwei weitere Minuten: 9:02 Uhr." tipp="Überlege zuerst, wie lange es bis 9 Uhr dauert."/>}</>;
}
export function Markieren(){
 const [frage,setFrage]=useState(0),[markiert,set]=useState<number[]>([]),[meld,melde]=useState('');
 const angaben=['8:15 Uhr','45 Minuten','6 € pro Kind','24 Kinder'];
 return <><p>Die Klasse fährt um {karte(0)} ab. Sie ist {karte(1)} unterwegs. Im Museum kostet der Eintritt {karte(2)}. Es fahren {karte(3)} mit.</p>
 <h3>{frage?'Was kostet der Eintritt für die Klasse?':'Wann kommt die Klasse an?'}</h3><p>Tippe im Text auf die beiden Angaben, die du brauchst.</p><button className="btn" disabled={!markiert.length} onClick={()=>{const ziel=frage?[2,3]:[0,1];melde(markiert.length===2&&ziel.every(n=>markiert.includes(n))?'Richtig. '+(frage?'24 · 6 € = 144 €.':'8:15 Uhr + 45 Minuten = 9:00 Uhr.'):'Prüfe jede Markierung: Brauchst du diese Angabe für die aktuelle Frage?');}}>Markierung prüfen</button> <button className="btn ghost" onClick={()=>{setFrage(1-frage);set([]);melde('');}}>Frage wechseln</button><p role="status">{meld}</p></>;
 function karte(i:number){return <button className="btn ghost" aria-pressed={markiert.includes(i)} onClick={()=>{set(markiert.includes(i)?markiert.filter(n=>n!==i):[...markiert,i]);melde('');}}>{angaben[i]}</button>;}
}
export function Rechenzettel(){
 const [plan,set]=useState(false),[menge,weiter]=useState(false),[lit,setLit]=useState(false);
 return <><p>24 Kinder bekommen je 250 ml Saft. Eine Flasche enthält 1,5 l. Wie viele Flaschen braucht ihr?</p><Wahl frage="Welche Zwischenfrage hilft zuerst?" optionen={['Wie viel Saft brauchen alle Kinder zusammen?','Wie teuer ist ein Becher?','Wie viele Minuten dauert die Pause?']} richtig={0} weg="Notiere die Gesamtmenge auf deinem Rechenzettel." tipp="Suche eine Menge, die du aus 24 und 250 ml berechnen kannst." weiter={()=>set(true)}/>
 {plan&&<Zahl frage="Zwischenergebnis: gesamte Saftmenge" einheit="ml" wert={6000} weg="24 · 250 ml = 6.000 ml." beiRichtig={()=>weiter(true)}/>}
 {menge&&<Zahl frage="6.000 ml in Litern" einheit="l" wert={6} weg="1.000 ml sind 1 l." beiRichtig={()=>setLit(true)}/>}
 {lit&&<Zahl frage="Wie viele Flaschen zu je 1,5 l enthalten deine 6 l?" wert={4} weg="6 : 1,5 = 4 Flaschen."/>}</>;
}
export function Rueckwaerts(){
 const [preis,set]=useState(false),[probe,setProbe]=useState(false);
 return <><p>Lina hatte 13 €. Nach dem Kauf von drei gleich teuren Heften hat sie 4 € übrig. Beginne beim Endbetrag.</p><Zahl frage="Von den verbliebenen 4 € zurück zu 13 €: Wie viel wurde ausgegeben?" einheit="€" wert={9} weg="4 + 9 = 13." beiRichtig={()=>set(true)}/>
 {preis&&<Zahl frage="Wie teuer war eines der drei Hefte?" einheit="€" wert={3} weg="9 € : 3 = 3 €." beiRichtig={()=>setProbe(true)}/>}
 {probe&&<Zahl frage="Probe vorwärts: 13 € − 3 · 3 €. Wie viel bleibt?" einheit="€" wert={4} weg="Die Rechnung endet wieder beim Restbetrag der Geschichte."/>}</>;
}
export function Wege(){
 const [fuss,setF]=useState(false),[bus,setB]=useState(false),[wahl,set]=useState('');
 const [uhrF,setUF]=useState(''),[uhrB,setUB]=useState(''),[kontrolle,setK]=useState(false);
 const stimmen=uhrF==='15:10'&&uhrB==='15:11';
 return <><p>Du startest um 15:00 Uhr. Zur Halle sind es 750 m. Zu Fuß schaffst du 75 m pro Minute. Auf den Bus wartest du 6 Minuten, dann fährst du 3 Minuten und gehst noch 2 Minuten.</p>
 <Zahl frage="Gehzeit zu Fuß" einheit="min" wert={10} weg="750 : 75 = 10 Minuten." beiRichtig={()=>setF(true)}/>
 <Zahl frage="Gesamtzeit mit Bus" einheit="min" wert={11} weg="6 + 3 + 2 = 11 Minuten." beiRichtig={()=>setB(true)}/>
 {fuss&&bus&&<><label>Ankunft zu Fuß<input type="time" value={uhrF} onChange={e=>{setUF(e.target.value);setK(false);}}/></label><label>Ankunft mit Bus<input type="time" value={uhrB} onChange={e=>{setUB(e.target.value);setK(false);}}/></label><button className="btn" disabled={!uhrF||!uhrB} onClick={()=>setK(true)}>Ankunftszeiten prüfen</button>{kontrolle&&<p role="status">{stimmen?'Beide Ankunftszeiten stimmen.':'Addiere für jeden Weg die benötigte Zeit zur Abfahrt um 15:00 Uhr.'}</p>}</>}
 {kontrolle&&stimmen&&<><label>Welchen Weg würdest du wählen?<select value={wahl} onChange={e=>set(e.target.value)}><option value="">Wähle</option><option>Zu Fuß</option><option>Mit dem Bus</option></select></label>{wahl&&<Begruenden frage="Was spricht für deine Wahl?" beispiel={wahl==='Zu Fuß'?'Du bist eine Minute früher da und brauchst keinen Fahrschein.':'Trotz einer Minute mehr bist du bei Regen kürzer draußen. Deine Entscheidung darf von deinen Gründen abhängen.'}/>}</>}</>;
}
export function Mission(){
 const [route,setRoute]=useState(0),[gewicht,setGewicht]=useState(0),[kisten,setKisten]=useState(0);
 const [phase,setPhase]=useState(0),[meldung,melde]=useState('');
 const [rucksack,setRucksack]=useState(0);
 const ankunft=route===1?8*60+51:8*60+56;
 const frueh=ankunft<=8*60+54;
 const gruppen=frueh?4:3,bedarf=gruppen*2,kapazitaet=10-gewicht;
 function zurueck(i:number){setPhase(i);melde('');}
 return <><p>Plane die Fahrt zum Naturpark. Der Zug fährt um 8:57 Uhr. Die Klasse braucht drei Minuten vom Bahnhofseingang zum Gleis.</p>
 {phase===0&&<><label>Weg zum Bahnhof<select value={route} onChange={e=>{setRoute(+e.target.value);melde('');}}><option value={0}>Wähle</option><option value={1}>Schulbus: 8:32 Uhr + 19 min</option><option value={2}>Zu Fuß: 8:32 Uhr + 24 min</option></select></label>
 {route>0&&<Zahl key={route} frage="Wie viele Minuten nach 8 Uhr erreicht ihr das Gleis?" wert={ankunft%60+3} weg={'Ankunft am Gleis: '+uhr(ankunft+3)+' Uhr.'} beiRichtig={()=>{setPhase(1);melde('');}}/>}</>}
 {phase>=1&&<p>Bahnhof: {uhr(ankunft)} Uhr. {frueh?'Zug erreicht. Im Park trefft ihr vier Gruppen.':'Zug verpasst. Ihr nehmt den nächsten Zug. Im Park sind noch drei Gruppen da.'} <button className="btn ghost" onClick={()=>zurueck(0)}>Weg ändern</button></p>}
 {phase===1&&<><p>In den Materialwagen dürfen 10 kg. Das Grundgepäck wiegt 2 kg. Ein optionales Spielepaket wiegt weitere 2 kg.</p>
 <label>Gepäck auswählen<select value={rucksack} onChange={e=>setRucksack(+e.target.value)}><option value={0}>Nur Grundgepäck</option><option value={1}>Mit Spielepaket</option></select></label>
 <Zahl key={rucksack} frage="Wie viel Gewicht bleibt für Getränke frei?" einheit="kg" wert={8-2*rucksack} weg="Ziehe das gewählte Gepäck vom Limit ab." beiRichtig={()=>{setGewicht(2+2*rucksack);setPhase(2);setKisten(0);}}/></>}
 {phase>=2&&<p>Gepäck: {gewicht} kg. Frei für Getränke: {kapazitaet} kg. <button className="btn ghost" onClick={()=>zurueck(1)}>Gepäck ändern</button></p>}
 {phase===2&&<><p>{gruppen} Gruppen brauchen je zwei volle Getränkeflaschen. Eine volle Flasche wiegt 1 kg.</p>
 <label>Flaschen einpacken<select value={kisten} onChange={e=>{setKisten(+e.target.value);melde('');}}>{Array.from({length:11},(_,i)=><option key={i}>{i}</option>)}</select></label><button className="btn" onClick={()=>{if(kisten>kapazitaet)melde('Das Gewichtslimit ist überschritten. Ändere das Gepäck oder die Flaschenzahl.');else if(kisten<bedarf)melde('Es fehlen '+(bedarf-kisten)+' Flaschen. Jede Gruppe benötigt zwei.');else{setPhase(3);notieren('Klassenfahrt planen',gruppen+' Gruppen mit Getränken versorgen','selbst');}}}>Plan prüfen</button><p role="status">{meldung}</p></>}
 {phase===3&&<p role="status">Der Plan funktioniert. Ihr erreicht den Park, verteilt {bedarf} Flaschen und transportiert insgesamt {gewicht+kisten} kg. {kisten-bedarf} Flaschen bleiben als Reserve.</p>}</>;
}

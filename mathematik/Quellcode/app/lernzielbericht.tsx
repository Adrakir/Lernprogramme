import {notieren} from '@/lib/lernatelier';
import {useState,type ReactNode} from 'react';
import {lernziele,type Kriterium} from '@/lib/lernzielbericht';
export function Lernzielbericht({ergebnisse}:{ergebnisse:{titel:string;punkte:Kriterium[]}[]}){
 const gruppen=lernziele(ergebnisse);
 return <section><h3>Deine Lernziele</h3><ul>{gruppen.map(g=><li key={g.titel}><strong>{g.titel}</strong> · {g.richtig} von {g.gesamt} richtig{g.folge>0&&` · ${g.folge} Teilpunkt(e) für richtiges Weiterrechnen mit eigenen Werten`}</li>)}</ul></section>;
}
export function Einzelprobe({aufbauen,ziel}:{ziel:string;aufbauen:()=>{inhalt:(w:Record<string,string>,set:(k:string,v:string)=>void)=>ReactNode;pruefen:(w:Record<string,string>)=>Kriterium[];bereit:(w:Record<string,string>)=>boolean;loesung:string}}){
 const [aufgabe,start]=useState<ReturnType<typeof aufbauen>|null>(null),[w,setW]=useState<Record<string,string>>({}),[fertig,ende]=useState(false),[hinweis,melden]=useState('');
 if(!aufgabe)return <button className="btn ghost" onClick={()=>start(aufbauen())}>Eine neue Aufgabe ohne Hilfe lösen</button>;
 const korrekt=aufgabe.pruefen(w).every(p=>p.ok&&!p.folge);
 return <section className="panel"><h3>Eine Aufgabe ohne Hilfe</h3>{!fertig?<>{aufgabe.inhalt(w,(k,v)=>{setW(s=>({...s,[k]:v}));melden('');})}<button className="btn" onClick={()=>{if(!aufgabe.bereit(w))melden('Ergänze zuerst alle Antwortfelder.');else {notieren(ziel,aufgabe.loesung,korrekt?'selbst':'offen',true);ende(true);}}}>Selbstständigen Versuch prüfen</button>{hinweis&&<p role="status">{hinweis}</p>}</>:<div role="status"><b>{korrekt?'Die geprüften Rechenschritte hast du selbstständig gelöst.':'Vergleiche deinen Rechenweg mit der Lösung.'}</b><p>{aufgabe.loesung}</p></div>}</section>;
}

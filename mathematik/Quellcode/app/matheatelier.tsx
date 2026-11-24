import {useState} from 'react';
import {Lineal,Dose,Fahrplan,Buch,Band} from './atelier-messen';
import {Ueberschlag,Ziffern,Gleichgewicht,Trick,Probe,Hilfen} from './atelier-rechnen';
import {FehlendeInfo,Markieren,Rechenzettel,Rueckwaerts,Wege,Mission} from './atelier-geschichten';
import {Rueckschau} from './atelier-begleitung';
import {atelierGruppen as gruppen} from '@/lib/atelier-themen';
export function Matheatelier(){
 const params=new URLSearchParams(location.search);
 const alle=gruppen.flatMap(([,items])=>items.map(([id,name])=>({id,name})));
 const [wahl,set]=useState<string>(alle.find(a=>a.id===params.get('aufgabe'))?.id??'');
 function zahl(key:string,min:number,max:number,fallback:number){const raw=params.get(key);const n=raw===null?NaN:Number(raw);return Number.isInteger(n)&&n>=min&&n<=max?n:fallback;}
 const v=zahl('v',0,4,0);
 const inhalt:Record<string,React.ReactNode>={lineal:<Lineal v={v}/>,dose:<Dose v={v}/>,fahrplan:<Fahrplan minute={zahl('minute',54,59,58)} weg={zahl('weg',4,10,8)} hilfe={zahl('hilfe',1,3,1)}/>,buch:<Buch/>,band:<Band/>,ueberschlag:<Ueberschlag v={v}/>,ziffern:<Ziffern/>,waage:<Gleichgewicht/>,trick:<Trick/>,probe:<Probe/>,hilfen:<Hilfen/>,fehlt:<FehlendeInfo/>,markieren:<Markieren/>,zettel:<Rechenzettel/>,rueckwaerts:<Rueckwaerts/>,wege:<Wege/>,mission:<Mission/>};
 return <div className="ad-school atelier"><h1>Mathe-Atelier</h1>{wahl?<section className="panel" key={wahl}><button className="btn ghost" onClick={()=>set('')}>Zur Aufgabenauswahl</button><h2>{alle.find(a=>a.id===wahl)?.name}</h2>{inhalt[wahl]}</section>:<>{gruppen.map(([titel,items])=><section className="panel" key={titel}><h2>{titel}</h2><div className="ad-actions">{items.map(([id,name])=><button key={id} className="btn ghost" onClick={()=>set(id)}>{name}</button>)}</div></section>)}<Rueckschau/></>}</div>;
}

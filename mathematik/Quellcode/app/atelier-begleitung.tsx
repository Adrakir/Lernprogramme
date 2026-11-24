import {useMemo,useState} from 'react';
import qrcode from 'qrcode-generator';
import {lernbelege} from '@/lib/lernatelier';
import {atelierGruppen} from '@/lib/atelier-themen';
import {berlinDay} from '@/lib/learning';

export function Aufgabenlink(){
 const [aufgabe,set]=useState('fahrplan'),[stufe,setStufe]=useState(1),[minute,setMinute]=useState(58),[weg,setWeg]=useState(8),[variante,setV]=useState(0),[meld,melde]=useState('');
 const veraenderlich=['lineal','dose','ueberschlag'].includes(aufgabe);
 const url=new URL('https://adrakir.github.io/Lernprogramme/mathematik/MatheKompass.html');
 url.searchParams.set('aufgabe',aufgabe);
 if(aufgabe==='fahrplan'){url.searchParams.set('minute',String(minute));url.searchParams.set('weg',String(weg));url.searchParams.set('hilfe',String(stufe));}
 else if(veraenderlich) url.searchParams.set('v',String(variante));
 url.hash='atelier';const link=url.href;
 const bild=useMemo(()=>{const qr=qrcode(0,'M');qr.addData(link);qr.make();return qr.createDataURL(5,20);},[link]);
 return <details className="panel"><summary>Unterrichtsaufgabe per Link oder QR-Code</summary>
 <label>Aufgabe<select value={aufgabe} onChange={e=>{set(e.target.value);melde('');}}>{atelierGruppen.map(([gruppe,items])=><optgroup label={gruppe} key={gruppe}>{items.map(([id,name])=><option value={id} key={id}>{name}</option>)}</optgroup>)}</select></label>
 {aufgabe==='fahrplan'?<><label>Busankunft<select value={minute} onChange={e=>setMinute(+e.target.value)}>{[54,55,56,57,58,59].map(n=><option value={n} key={n}>14:{n} Uhr</option>)}</select></label>
 <label>Gehzeit in Minuten<select value={weg} onChange={e=>setWeg(+e.target.value)}>{[4,5,6,7,8,9,10].map(n=><option key={n}>{n}</option>)}</select></label>
 <label>Hilfestufe<select value={stufe} onChange={e=>setStufe(+e.target.value)}><option value={1}>Beschriftete Zeitleiste</option><option value={2}>Nur Start und Ziel</option><option value={3}>Nur Fahrplan</option></select></label></>:veraenderlich&&<label>Zahlen für die Aufgabe<select value={variante} onChange={e=>setV(+e.target.value)}>{[0,1,2,3,4].map(v=><option value={v} key={v}>{aufgabe==='lineal'?((34+v)/10).toLocaleString('de-DE')+' bis '+((91+v)/10).toLocaleString('de-DE')+' cm':aufgabe==='dose'?(850+30*v)+' g voll, '+(140+10*v)+' g leer':(398+100*v)+' + 257'}</option>)}</select></label>}
 <p><a href={link}>Schülerversion öffnen</a></p><img width={220} height={220} src={bild} alt="QR-Code zur gewählten Unterrichtsaufgabe"/><label>Link zum Teilen<input readOnly value={link} onFocus={e=>e.target.select()}/></label>
 <button className="btn ghost" onClick={async()=>{try{await navigator.clipboard.writeText(link);melde('Link kopiert.');}catch{melde('Markiere den Link im Feld und kopiere ihn.');}}}>Link kopieren</button><p role="status">{meld}</p></details>;
}
type Rueckblick={id:string;tag:string;aufgabe:string;ziel:string;frueher:string;heute:string};
const key='mathe-kompass-wochenrueckblick-v1';
function lesen():Rueckblick[]{try{const a=JSON.parse(localStorage.getItem(key)??'[]');return Array.isArray(a)?a.filter(b=>b&&['id','tag','aufgabe','ziel','frueher','heute'].every(k=>typeof b[k]==='string')):[];}catch{return [];}}
export function Rueckschau(){
 const grenze=Date.parse(berlinDay()+'T00:00:00Z')-6*86400000;
 const belege=lernbelege().filter(b=>b.status!=='offen'&&Date.parse(berlinDay(new Date(b.tag))+'T00:00:00Z')>=grenze);
 const [id,setId]=useState(''),[frueher,setF]=useState(''),[heute,setH]=useState(''),[liste,setListe]=useState(lesen),[meld,melde]=useState('');
 const auswahl=belege.find(b=>(b.aufgabenId??b.tag+b.aufgabe)===id);
 function speichern(){if(!auswahl)return;const neu={id,tag:berlinDay(),ziel:auswahl.ziel,aufgabe:auswahl.aufgabe,frueher:frueher.trim(),heute:heute.trim()};
 try{const next=[neu,...lesen().filter(r=>r.id!==id)].slice(0,60);localStorage.setItem(key,JSON.stringify(next));setListe(next);melde('Rückblick gespeichert.');}catch{melde('Speichern auf diesem Gerät ist zurzeit nicht möglich.');}}
 return <details className="panel"><summary>Meine Lernwoche · Rückschau</summary>{belege.length?<><label>Eine gelöste Aufgabe der letzten sieben Tage<select value={id} onChange={e=>{setId(e.target.value);const alt=liste.find(r=>r.id===e.target.value);setF(alt?.frueher??'');setH(alt?.heute??'');melde('');}}><option value="">Aufgabe auswählen</option>{belege.map((b,i)=><option key={i} value={b.aufgabenId??b.tag+b.aufgabe}>{new Date(b.tag).toLocaleDateString('de-DE')} · {b.aufgabe}</option>)}</select></label>
 {auswahl&&<><p>{auswahl.aufgabe}</p><label>Früher war schwierig …<textarea value={frueher} onChange={e=>{setF(e.target.value);melde('');}}/></label><label>Jetzt achte ich auf …<textarea value={heute} onChange={e=>{setH(e.target.value);melde('');}}/></label><button className="btn" disabled={!frueher.trim()||!heute.trim()} onClick={speichern}>Rückblick speichern</button></>}</>:<p>Sobald du eine Aufgabe gelöst hast, kannst du sie hier auswählen.</p>}<p role="status">{meld}</p>
 {liste.map(r=><article key={r.id}><h3>{r.tag.split('-').reverse().join('.')} · {r.ziel}</h3><p>{r.aufgabe}</p><p>Früher war schwierig: {r.frueher}</p><p>Jetzt achte ich auf: {r.heute}</p></article>)}</details>;
}

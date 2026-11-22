import {themen, type Thema} from './groessen-training';
export type Modus='check'|'arbeit'|'uebung'|'reise'|'detektiv'|'wiederholen';
export type Stand={version?:2; sicherheit?:string[]; reflexion?:string[]; modus:Modus; ids:Thema[]; seed:number; i:number; antworten:string[][]; hilfe:boolean[]; umkehr:boolean[]; fertig:boolean};
type Eintrag={id:Thema; umkehr:boolean};
type Daten={runde?:Stand; liste:Eintrag[]};
const key='mathe-kompass-groessen-training-v1';
const istThema=(id:unknown):id is Thema=>typeof id==='string'&&Object.hasOwn(themen,id);
export function lesen():Daten {
  try {
    const d=JSON.parse(localStorage.getItem(key)??'{}');
    const liste=Array.isArray(d.liste)?d.liste.filter((x:Eintrag)=>x&&istThema(x.id)&&typeof x.umkehr==='boolean'):[];
    const v=d.runde;
    if(v&&['check','arbeit','uebung','reise','detektiv','wiederholen'].includes(v.modus)&&Array.isArray(v.ids)&&v.ids.length&&v.ids.every(istThema)&&Number.isInteger(v.i)&&v.i>=0&&v.i<v.ids.length&&Number.isFinite(v.seed)&&Array.isArray(v.antworten)&&v.ids.every((_:unknown,i:number)=>Array.isArray(v.antworten[i])&&v.antworten[i].every((a:unknown)=>typeof a==='string'))&&Array.isArray(v.hilfe)&&Array.isArray(v.umkehr))return {liste,runde:v};
    return {liste};
  }catch{return {liste:[]};}
}
function speichern(d:Daten){try{localStorage.setItem(key,JSON.stringify(d));}catch{/* Private Fenster ohne lokalen Speicher */}}
export function speichernRunde(runde:Stand){speichern({...lesen(),runde});}
export function merken(id:Thema){const d=lesen();if(!d.liste.some(x=>x.id===id))speichern({...d,liste:[...d.liste,{id,umkehr:false}]});}
export function verbuchen(r:Stand,ok:boolean[]){
  const d=lesen();let liste=[...d.liste];
  r.ids.forEach((id,i)=>{
    const alt=liste.find(e=>e.id===id);
    if(!ok[i]||r.hilfe[i]||r.sicherheit?.[i]==='geraten'){if(!alt)liste.push({id,umkehr:false});return;}
    if(r.modus!=='wiederholen'||!alt)return;
    const gegenrichtung=['regelL','regelM','regelZ','stellen'].includes(id);
    if(gegenrichtung&&!r.umkehr[i])liste=liste.map(e=>e.id===id?{id,umkehr:true}:e);
    else liste=liste.filter(e=>e.id!==id);
  });
  speichern({liste,runde:r});
}
export function werkstattHilfe(skill:string){
  const map:Record<string,Thema>={'l-messen':'lineal','z-spanne':'zeitlinie','z-fahrplan':'fahrplan','z-mischen':'regelZ','z-dezimal':'dezimal','z-nacht':'zeitlinie','l-wanderweg':'ausflugL','m-gepaeck':'dose'};
  const id=map[skill]??(skill.startsWith('l-')?'regelL':skill.startsWith('m-')?'regelM':skill.startsWith('z-')?'regelZ':null);
  if(id)merken(id);
}

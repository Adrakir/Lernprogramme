export type Arbeit={seed:number;index:number;antworten:Record<string,string>[];fertig:boolean};
export function standLesen<Z extends string>(raw:string|null,gueltig:(s:unknown)=>s is Z):{arbeit?:Arbeit;ziele:Z[]}{
 try{
  const d=JSON.parse(raw??'{}'),a=d.arbeit;
  const ok=a&&Number.isInteger(a.seed)&&Number.isInteger(a.index)&&a.index>=0&&a.index<8&&typeof a.fertig==='boolean'&&Array.isArray(a.antworten)&&a.antworten.length===8&&a.antworten.every((w:unknown)=>w&&typeof w==='object'&&!Array.isArray(w)&&Object.values(w).every(v=>typeof v==='string'));
  return {arbeit:ok?a:undefined,ziele:Array.isArray(d.ziele)?d.ziele.filter(gueltig):[]};
 }catch{return {ziele:[]};}
}
export function importVorschau(daten:Record<string,string>){
 return Object.entries(daten).map(([k,v])=>{
 const titel=k.replace(/^mathe-kompass-?/,'').replace(/-v\d+$/,'').replaceAll('-',' ')||'Lernreise';
 try{const d=JSON.parse(v);if(d?.arbeit?.antworten?.length===8)return titel+' · '+(d.arbeit.fertig?'ausgewertete Arbeit':'angefangene Arbeit, Aufgabe '+(d.arbeit.index+1)+' von 8');
 if(Array.isArray(d?.records))return titel+' · '+d.records.length+' Aufgabenbelege';
 if(Array.isArray(d))return titel+' · '+d.length+' Einträge';}catch{}
 return titel;
 });
}
export function uebungsgrund(ziel:string,ausgewaehlt:boolean,titel:string){
 const grund:Record<string,string>={nullstelle:'Hier übst du die Null an der richtigen Stelle.',nullkette:'Hier tauschst du über mehrere Nullen hinweg.',raster3:'Hier bündelst du drei Summanden spaltenweise.',raster:'Hier übst du die Zwischenschritte im Stellenwertraster.',probe:'Hier kontrollierst du mit der Umkehrrechnung.',groessen:'Hier rechnest du zuerst in dieselbe Einheit um.',geschichte:'Hier übersetzt du eine Geschichte in eine Rechnung.'};
 return (ausgewaehlt?'Dein Übungsziel: ':'Zum Einstieg: ')+(grund[ziel]??titel+'.');
}

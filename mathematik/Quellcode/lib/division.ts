import {folgepunkt,type Kriterium} from './lernzielbericht.ts';
import {rng,plainNumber} from './groessen-core.ts';
import type {Antworten,Feld,Schritt} from './multiplikation.ts';
export type {Antworten,Feld} from './multiplikation.ts';
export const stufen=['Ohne Zwischenrest','Mit Zwischenrest','Mit Rest am Ende','Mit zweistelligem Divisor','Mit Null im Quotienten','Mit zweistelligem Divisor und Rest'];
export const namen={raster:'Schriftlich dividieren',nullstelle:'Die Null im Quotienten',verteilen:'Gleichmäßig verteilen',packen:'Gleich große Gruppen packen',sprung:'In gleich großen Sprüngen messen',zerlegen:'Den Dividenden geschickt zerlegen',halbieren:'Durch wiederholtes Halbieren teilen',vergleich:'Zwei Rechenwege vergleichen',schaetzen:'Mit einer passenden Nachbarzahl schätzen',fehler:'Den ersten Rechenfehler finden',probe:'Mit Multiplikation und Rest prüfen',luecke:'Die fehlende Zahl finden',geschichte:'Was bedeutet der Rest?',groessen:'Längen, Gewichte und Zeiten aufteilen'} as const;
export type Ziel=keyof typeof namen;
export type Aufgabe={ziel:Ziel;titel:string;frage:string;tipp:string;weg:string;zahlen:number[];schritte:Schritt[]};
export const pruefplan:Ziel[]=['verteilen','raster','nullstelle','vergleich','schaetzen','probe','geschichte','groessen'];
const feld=(key:string,label:string,wert:number,hinweis:string):Feld=>({key,label,wert,hinweis});
export function rechenweg(n:number,d:number){
 if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||n<0||d<=0)throw Error('Erforderlich sind eine natürliche Zahl und ein positiver Divisor.');
 const ziffern=Array.from(String(n),Number),schritte=[];
 let teil=0;
 for(const [i,ziffer] of ziffern.entries()){
  teil=teil*10+ziffer;
  if(schritte.length===0&&teil<d&&i<ziffern.length-1)continue;
  const q=Math.floor(teil/d),produkt=q*d,rest=teil-produkt;
  schritte.push({teil,q,produkt,rest,i,ziffer});
  teil=rest;
 }
 return schritte;
}
export function zahlen(stufe:number,seed:number):[number,number]{
 if(!seed)return ([[84,2],[156,4],[157,4],[936,12],[1248,6],[947,12]] as [number,number][])[stufe];
 const r=rng(seed),d=stufe===3||stufe===5?r.int(12,24):r.int(3,8);
 if(stufe===0){const max=Math.floor(9/d);return [d*(10*r.int(1,max)+r.int(1,max)),d];}
 const q=stufe===4?100*r.int(1,7)+r.int(1,9):stufe===1?10*r.int(1,8)+9:r.int(23,98);
 return [d*q+(stufe===2||stufe===5?r.int(1,d-1):0),d];
}
export function raster(stufe:number,seed:number):Aufgabe{
 const [n,d]=zahlen(stufe,seed),rows=rechenweg(n,d),frage=`${n} : ${d}`;
 const schritte:Schritt[]=rows.map((r,j)=>({titel:'Schritt '+(j+1),felder:[
  feld('t'+j,'Teilzahl',r.teil,j?`Hänge die nächste Ziffer ${r.ziffer} rechts an den vorigen Rest an.`:`Lies von links bis zur ersten Zahl, die mindestens ${d} ist. Ist der ganze Dividend kleiner, beginne mit ihm.`),
  feld('q'+j,'Quotientenziffer',r.q,`Wie oft passt ${d} ganz in ${r.teil}? Passt es keinmal, schreibe an dieser Stelle eine 0.`),
  feld('p'+j,'Abzuziehendes Vielfaches',r.produkt,`Multipliziere deine Quotientenziffer mit ${d}.`),
  feld('r'+j,'Rest',r.rest,`Ziehe das Vielfache von ${r.teil} ab. Der Rest muss kleiner als ${d} sein.`)
 ]}));
 const q=Math.floor(n/d),rest=n%d;
 schritte.push({titel:'Ergebnis lesen',felder:[feld('quotient','Ganzer Quotient',q,'Lies die Quotientenziffern in ihrer Reihenfolge, auch die Null.'),feld('rest','Endrest',rest,'Lies den Rest aus dem letzten Schritt ab.')]});
 return {ziel:stufe===4?'nullstelle':'raster',titel:stufen[stufe],frage,zahlen:[n,d],schritte,tipp:'Teile, multipliziere zurück, ziehe ab und hole die nächste Ziffer herunter.',weg:`${frage} = ${q}${rest?' Rest '+rest:''}. Probe: ${q} · ${d} + ${rest} = ${n}.`};
}
export function aufgabe(ziel:Ziel,seed:number):Aufgabe{
 if(ziel==='raster'||ziel==='nullstelle')return raster(ziel==='raster'?5:4,seed);
 const k=seed?rng(seed).int(1,8):0;
 function make(frage:string,werte:[string,number][],tipp:string,weg:string,zahlen:number[]=[]):Aufgabe{
  return {ziel,titel:namen[ziel],frage,tipp,weg,zahlen,schritte:[{titel:namen[ziel],felder:werte.map(([label,wert],i)=>feld('a'+i,label,wert,tipp))}]};
 }
 switch(ziel){
 case 'verteilen':case 'packen':case 'sprung':{
  const d=3+k%3,q=4+k%4,r=ziel==='verteilen'?0:1,n=q*d+r;
  if(ziel==='verteilen')return make(`Verteile ${n} Steine gleichmäßig auf ${d} Kinder. Jedes Kind erhält in jeder Runde einen Stein.`,[['Steine pro Kind',q],['Übrige Steine',r]],'Zähle die vollständigen Verteilrunden.',`${n} : ${d} = ${q}. Jedes Kind erhält ${q} Steine.`,[n,d]);
  if(ziel==='packen')return make(`Packe ${n} Steine in Beutel zu je ${d} Steinen. Wie viele volle Beutel kannst du packen?`,[['Volle Beutel',q],['Lose Steine',r]],'Bei dieser Aufgabe ist die Größe eines Beutels vorgegeben.',`${q} Beutel enthalten ${q*d} Steine, ${r} Stein bleibt übrig.`,[n,d]);
  return make(`Springe auf dem Zahlenstrahl von 0 in ${d}er-Schritten so weit wie möglich bis ${n}.`,[['Anzahl ganzer Sprünge',q],['Reststrecke',r]],'Der nächste ganze Sprung darf das Ziel nicht überschreiten.',`${q} Sprünge reichen bis ${q*d}. Bis ${n} fehlt noch ${r}.`,[n,d]);}
 case 'zerlegen':{const d=6,a=d*(10+k),b=24;return make(`Zerlege ${a+b} : 6 in ${a} : 6 und 24 : 6. Füge die Teilquotienten zusammen.`,[['Erster Teilquotient',a/d],['Zweiter Teilquotient',4],['Gesamter Quotient',(a+b)/d]],'Beide Teilzahlen werden durch denselben Divisor geteilt.',`(${a} + 24) : 6 = ${a/d} + 4 = ${(a+b)/6}.`);}
 case 'halbieren':{const q=11+k,n=q*8;return make(`Teile ${n} durch 8, indem du dreimal halbierst.`,[['Nach dem ersten Halbieren',4*q],['Nach dem zweiten Halbieren',2*q],['Nach dem dritten Halbieren',q]],'Dreimal durch 2 entspricht einmal durch 2 · 2 · 2.',`${n} : 2 = ${4*q}, dann ${2*q}, zuletzt ${q}.`);}
 case 'vergleich':{const q=19+k,n=q*4;return make(`Für ${n} : 4 halbiert Pia zweimal. Sam startet bei ${(q+1)*4} : 4 und nimmt eine Vierergruppe weg. Vergleiche beide Wege.`,[['Pias erstes Zwischenergebnis',2*q],['Sams Anzahl vor dem Ausgleich',q+1],['Gemeinsames Ergebnis',q]],'Beim Nachbarn sind es vier mehr, also eine ganze Gruppe mehr.',`Pia halbiert auf ${2*q} und dann auf ${q}. Sam rechnet ${q+1} − 1 = ${q}.`);}
 case 'schaetzen':{const q=40+10*k,n=q*6-1;return make(`Für ${n} : 6 suchst du das nächste durch 6 teilbare Vielfache von zehn. Schätze damit, dann teile genau mit Rest.`,[['Passende Nachbarzahl',n+1],['Geschätzter Quotient',q],['Ganzer Quotient',q-1],['Endrest',5]],'Die Zahl direkt nach dem Dividenden ist hier gut teilbar.',`${n+1} : 6 = ${q}. Genau passen ${q-1} Sechsergruppen hinein und 5 bleiben übrig.`);}
 case 'fehler':{const q=102+k%7,d=4,n=q*d;return make(`Noah rechnet ${n} : 4 und schreibt ${q-90}. Er hat die Zehnerziffer im Quotienten ausgelassen. Rekonstruiere seine Rechnung.`,[['Richtige Hunderterziffer',1],['Richtige Zehnerziffer',0],['Vollständiger Quotient',q]],'Ist die nächste Teilzahl kleiner als der Divisor, bleibt der Platz im Ergebnis wichtig.',`Die Zehnerstelle trägt 0. Die Probe bestätigt ${q} · 4 = ${n}.`);}
 case 'probe':{const d=5,q=8+k,n=d*q+2;return make(`Prüfe die Rechnung ${n} : 5 = ${q} Rest 2. Lege Karten für die Probe und ergänze das Ergebnis.`,[['Ergebnis der Probe',n]],'Multipliziere Quotient und Divisor. Addiere dann den Rest.',`${q} · 5 + 2 = ${n}. Der Rest 2 ist kleiner als 5.`,[q,d,2]);}
 case 'luecke':{const d=4+k,q=7;return make(`Ergänze □ : ${d} = 7 und ${q*d} : □ = 7. Berechne danach 0 : ${d}.`,[['Fehlender Dividend',d*q],['Fehlender Divisor',d],['Null geteilt durch den positiven Divisor',0]],'Für die erste Lücke hilft Multiplikation, für die zweite Division.',`${q} · ${d} = ${q*d}, ${q*d} : 7 = ${d}. Bei null Gegenständen erhält jede Gruppe null. 7 : 0 hat kein Ergebnis, denn keine Zahl mal 0 ergibt 7.`);}
 case 'geschichte':{const q=5+k,d=6,n=q*d+2;return make(`${n} Kinder fahren in Kleinbussen mit je 6 Kinderplätzen. In einer anderen Aufgabe werden ${n} Perlen zu Armbändern mit je 6 Perlen verarbeitet. Was bedeutet derselbe Rest?`,[['Benötigte Kleinbusse',q+1],['Vollständige Armbänder',q],['Übrige Perlen',2]],'Auch die letzten zwei Kinder brauchen Plätze. Für ein weiteres Armband reichen zwei Perlen nicht.',`${n} : 6 = ${q} Rest 2. Alle Kinder brauchen ${q+1} Busse. Es entstehen ${q} ganze Armbänder, 2 Perlen bleiben übrig.`);}
 case 'groessen':{const d=4+k,n=d*75,m=d*250,t=d*15;return make(`Ein ${Math.floor(n/100)} m ${n%100} cm langes Band wird in ${d} gleiche Stücke geteilt. ${Math.floor(m/1000)} kg ${m%1000} g Reis werden auf ${d} Beutel verteilt. ${Math.floor(t/60)} h ${t%60} min verteilen sich auf ${d} gleich lange Runden.`,[['Länge je Stück in cm',75],['Masse je Beutel in g',250],['Dauer je Runde in min',15]],'Wandle zuerst in Zentimeter, Gramm oder Minuten um. Teile dann durch die Anzahl.',`${n} cm : ${d} = 75 cm. ${m} g : ${d} = 250 g. ${t} min : ${d} = 15 min.`);}
 }
}
export function punkte(a:Aufgabe,w:Antworten){
 const p:Kriterium[]=a.schritte.flatMap((s,j)=>s.felder.map(f=>{
  const v=plainNumber(w[f.key]??''),q=plainNumber(w['q'+j]??''),t=plainNumber(w['t'+j]??''),produkt=plainNumber(w['p'+j]??'');
  const folge=(f.key==='p'+j&&q!==null&&Number.isInteger(q)&&q>=0&&q<=9&&v===q*a.zahlen[1])||
   (f.key==='r'+j&&t!==null&&produkt!==null&&[t,produkt].every(n=>Number.isSafeInteger(n)&&n>=0)&&v!==null&&v>=0&&v<a.zahlen[1]&&v===t-produkt);
  return folgepunkt(s.titel+' · '+f.label,v===f.wert,folge);
 }));
 if(a.ziel==='luecke')p.push({name:'Division durch null',ok:w.nullregel==='Die Rechnung hat kein Ergebnis.'});
 if(a.ziel==='probe'){const [q,d,r]=a.zahlen;p.push({name:'Probe mit Rest',ok:[`${q},${d},${r}`,`${d},${q},${r}`].includes(w.karten)});}
 return p;
}
export function bereit(a:Aufgabe,w:Antworten){return a.schritte.every(s=>s.felder.every(f=>w[f.key]?.trim()))&&(a.ziel!=='luecke'||Boolean(w.nullregel))&&(a.ziel!=='probe'||w.karten?.split(',').length===3)&&(!['geschichte','vergleich'].includes(a.ziel)||Boolean(w.text?.trim()));}

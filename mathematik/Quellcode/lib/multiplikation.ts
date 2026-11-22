import {rng,plainNumber} from './groessen-core.ts';
import {stellen} from './addition.ts';
export type Antworten=Record<string,string>;
export const stufen=['Einstellig ohne Übertrag','Einstellig mit Übertrag','Mit einem Zehnerfaktor','Mit zwei Teilprodukten','Mit einer Null im zweiten Faktor','Mit drei Teilprodukten'];
export const namen={raster:'Schriftlich multiplizieren',nullstelle:'Die Null im zweiten Faktor',gruppen:'Gleich große Gruppen bilden',tausch:'Das Punktefeld drehen',zerlegen:'Das Rechteck zerlegen',nachbar:'Eine Nachbaraufgabe nutzen',verdoppeln:'Halbieren und verdoppeln',vergleich:'Zwei Rechenwege vergleichen',schaetzen:'Mit Überschlag prüfen',fehler:'Das verrutschte Teilprodukt finden',probe:'Die Divisionsprobe legen',luecke:'Fehlende Faktoren finden',geschichte:'Eine Sachaufgabe modellieren',groessen:'Längen, Gewichte und Zeiten vervielfachen'} as const;
export type Ziel=keyof typeof namen;
export type Feld={key:string;label:string;wert:number;hinweis:string};
export type Schritt={titel:string;rechnung?:string;felder:Feld[]};
export type Aufgabe={ziel:Ziel;titel:string;frage:string;tipp:string;weg:string;zahlen:number[];schritte:Schritt[]};
export const pruefplan:Ziel[]=['zerlegen','raster','nullstelle','vergleich','schaetzen','probe','geschichte','groessen'];
const feld=(key:string,label:string,wert:number,hinweis:string):Feld=>({key,label,wert,hinweis});
export function faktoren(stufe:number,seed:number):[number,number]{
 if(!seed)return ([[23,3],[47,6],[32,40],[24,13],[36,204],[56,123]] as [number,number][])[stufe];
 const r=rng(seed),klein=()=>r.int(1,3),gross=()=>r.int(5,9);
 switch(stufe){
 case 0:return [10*klein()+klein(),klein()];
 case 1:return [10*gross()+gross(),gross()];
 case 2:return [r.int(12,68),10*r.int(2,8)];
 case 3:return [r.int(14,87),10*r.int(1,8)+r.int(2,9)];
 case 4:return [r.int(14,87),100*r.int(1,6)+r.int(2,9)];
 default:return [r.int(24,98),100*r.int(1,6)+10*r.int(1,8)+r.int(2,9)];
 }
}
export function zeilen(a:number,b:number){
 return Array.from(String(b),Number).reverse().map((ziffer,j)=>{
  let eingang=0;
  const spalten=Array.from(String(a),Number).reverse().map((z,i)=>{
   const summe=z*ziffer+eingang;
   const c={z,i,eingang,summe,rest:summe%10,uebertrag:Math.floor(summe/10)};
   eingang=c.uebertrag;return c;
  });
  return {ziffer,stelle:j,faktor:ziffer*10**j,wert:a*ziffer*10**j,spalten};
 });
}
export function raster(stufe:number,seed:number):Aufgabe{
 const [a,b]=faktoren(stufe,seed),reihen=zeilen(a,b),schritte:Schritt[]=[];
 for(const r of reihen){
  const j=r.stelle;
  schritte.push({titel:stellen[j]+' im zweiten Faktor',felder:[feld('f'+j,'Wert der '+stellen[j]+'ziffer',r.faktor,`Die Ziffer ${r.ziffer} steht bei den ${stellen[j]}n. Rechne ${r.ziffer} · ${10**j}.`)]});
  if(r.ziffer)for(const c of r.spalten){
   const rechnung=`${c.z} · ${r.ziffer}${c.eingang?' + '+c.eingang+' Übertrag':''}`;
   schritte.push({titel:`${stellen[j]}zeile · ${stellen[c.i]} des ersten Faktors`,rechnung,felder:[
    feld('z'+j+'-'+c.i,'Ergebnisziffer',c.rest,`Rechne ${rechnung}. Welche Einerziffer hat dein Ergebnis?`),
    feld('u'+j+'-'+c.i,'Übertrag nach links',c.uebertrag,`Wie viele volle Zehner stecken in ${rechnung}? Trage auch einen Übertrag von 0 ein.`)]});
  }
  schritte.push({titel:stellen[j]+'zeile eintragen',felder:[feld('p'+j,`Teilprodukt der ${stellen[j]}zeile`,r.wert,r.ziffer?`Multipliziere ${a} mit dem Stellenwert ${r.faktor}. Berücksichtige den letzten Übertrag und die Position der Zeile.`:'Dieser Faktoranteil ist null. Was ergibt eine Multiplikation mit null?')]});
 }
 schritte.push({titel:'Teilprodukte addieren',felder:[feld('produkt','Gesamtprodukt',a*b,'Addiere die Teilprodukte stellenrichtig.')]});
 return {ziel:stufe===4?'nullstelle':'raster',titel:stufen[stufe],frage:`${a} · ${b}`,zahlen:[a,b],schritte,tipp:'Beginne mit den Einern im zweiten Faktor. Jede weitere Stelle hat den zehnfachen Stellenwert.',weg:reihen.map(r=>`${a} · ${r.faktor} = ${r.wert}`).join('. ')+`. Zusammen: ${a*b}.`};
}
export function aufgabe(ziel:Ziel,seed:number):Aufgabe{
 if(ziel==='raster'||ziel==='nullstelle')return raster(ziel==='raster'?3:4,seed);
 const k=seed?rng(seed).int(1,7):0;
 function make(frage:string,werte:[string,number][],tipp:string,weg:string,zahlen:number[]=[]):Aufgabe{
  return {ziel,titel:namen[ziel],frage,zahlen,tipp,weg,schritte:[{titel:namen[ziel],felder:werte.map(([label,n],i)=>feld('a'+i,label,n,tipp))}]};
 }
 switch(ziel){
 case 'gruppen':case 'tausch':case 'zerlegen':{
  const a=4+k%4,b=ziel==='zerlegen'?13+k:6+k%3;
  if(ziel==='gruppen')return make(`Lege ${a} Reihen mit je ${b} Punkten. Wie viele Punkte kommen mit jeder Reihe dazu?`,[['Zuwachs je Reihe',b],['Punkte insgesamt',a*b]],'Eine Reihe ist eine gleich große Gruppe.',`${a} gleich große Gruppen zu je ${b} ergeben ${a} · ${b} = ${a*b}.`,[a,b]);
  if(ziel==='tausch')return make(`Ein Feld hat ${a} Reihen mit je ${b} Punkten. Drehe es um eine Vierteldrehung.`,[['Reihen nach dem Drehen',b],['Punkte pro neuer Reihe',a],['Anzahl aller Punkte',a*b]],'Aus Spalten werden Reihen.',`${a} · ${b} = ${b} · ${a} = ${a*b}. Die Punkte bleiben dieselben.`,[a,b]);
  return make(`Zerlege ${a} · ${b} nach der zehnten Spalte. Berechne beide Teilflächen und füge sie zusammen.`,[['Punkte im linken Feld',10*a],['Punkte im rechten Feld',(b-10)*a],['Gesamtprodukt',a*b]],'Multipliziere die Zahl der Reihen mit der Breite jedes Teilfelds.',`${a} · (10 + ${b-10}) = ${a*10} + ${(b-10)*a} = ${a*b}.`,[a,b]);}
 case 'nachbar':{const a=19+10*k,b=7;return make(`Nutze ${a+1} · ${b}, um ${a} · ${b} zu rechnen.`,[['Produkt der Hilfsaufgabe',(a+1)*b],['Davon abziehen',b],['Gesuchtes Produkt',a*b]],'Die Hilfsaufgabe zählt eine ganze Gruppe zu viel.',`${a} · 7 = ${a+1} · 7 − 7 = ${a*b}.`);}
 case 'verdoppeln':{const a=14+2*k;return make(`Rechne ${a} · 25. Halbiere den ersten Faktor und verdopple den zweiten.`,[['Erster Faktor danach',a/2],['Zweiter Faktor danach',50],['Produkt',25*a]],'Halb so viele Gruppen mit doppelt so viel Inhalt haben denselben Gesamtwert.',`${a} · 25 = ${a/2} · 50 = ${25*a}.`);}
 case 'vergleich':{const a=6+k;return make(`Zwei Kinder rechnen ${a} · 19. Mia zerlegt 19 in 10 + 9. Ben rechnet zuerst mal 20. Führe beide Wege zu Ende und begründe deine Wahl.`,[['Mias zweites Teilprodukt',9*a],['Bens Produkt vor dem Ausgleich',20*a],['Gemeinsames Ergebnis',19*a]],'Mia addiert zwei Produkte. Ben zieht eine Gruppe ab.',`Mia: ${10*a} + ${9*a} = ${19*a}. Ben: ${20*a} − ${a} = ${19*a}. Beide Wege sind richtig.`);}
 case 'schaetzen':{const a=48+10*k,b=21;return make(`Runde für ${a} · ${b} beide Faktoren auf Zehner und rechne danach genau.`,[['Erster gerundeter Faktor',a+2],['Zweiter gerundeter Faktor',20],['Überschlag',(a+2)*20],['Genaues Produkt',a*b]],'Die Einerziffer entscheidet beim Runden.',`Ungefähr ${a+2} · 20 = ${(a+2)*20}. Genau ${a} · 20 + ${a} = ${a*b}.`);}
 case 'fehler':{const a=24+k;return make(`Tom rechnet ${a} · 13. Seine Einerzeile ergibt ${a*3}, die Zehnerzeile ${a}. Er addiert und erhält ${a*4}. Prüfe seine Zehnerzeile.`,[['Wert der 1 in 13',10],['Korrigierte Zehnerzeile',a*10],['Richtiges Produkt',a*13]],'Die 1 in 13 steht eine Stelle links von den Einern.',`Tom hat mit 1 statt mit 10 multipliziert. ${a*3} + ${a*10} = ${a*13}.`);}
 case 'probe':{const a=12+k,b=4;return make(`Prüfe ${a} · ${b} = ${a*b} durch Division. Lege die Karten in eine passende Reihenfolge.`,[],'Beginne beim Produkt. Dividiere durch einen Faktor.',`${a*b} : ${a} = ${b} oder ${a*b} : ${b} = ${a}.`,[a,b,a*b]);}
 case 'luecke':{const a=8+k;return make(`Fülle die Lücken: □ · 6 = ${6*a} und ${a} · □ = ${9*a}.`,[['Erster fehlender Faktor',a],['Zweiter fehlender Faktor',9]],'Teile das Produkt durch den bekannten Faktor.',`${6*a} : 6 = ${a}. ${9*a} : ${a} = 9.`);}
 case 'geschichte':{const a=6+k,b=12;return make(`Für ein Schulfest stehen ${a} Kisten mit je ${b} Flaschen bereit. Weitere 5 Flaschen stehen einzeln daneben. Wie viele sind es zusammen?`,[['Flaschen in den Kisten',a*b],['Mit den einzelnen Flaschen',a*b+5]],'Nur die gleich großen Gruppen werden multipliziert. Formuliere danach einen Antwortsatz.',`${a} · ${b} + 5 = ${a*b+5}. Für das Fest stehen ${a*b+5} Flaschen bereit.`);}
 case 'groessen':{const n=4+k;return make(`${n} Bänder sind je 75 cm lang. ${n} Pakete wiegen je 250 g. ${n} Trainingsrunden dauern je 15 Minuten. Berechne die drei Gesamtgrößen.`,[['Gesamtlänge in cm',n*75],['Gesamtmasse in g',n*250],['Gesamtdauer in Minuten',n*15],['Davon ganze Stunden',Math.floor(n*15/60)],['Verbleibende Minuten',n*15%60]],'Multipliziere jede Einzelgröße mit der Anzahl. Bündle je 60 Minuten zu einer Stunde.',`${n*75} cm, ${n*250} g und ${n*15} min. Die Dauer entspricht ${Math.floor(n*15/60)} h ${n*15%60} min.`);}
 }
}
export function punkte(a:Aufgabe,w:Antworten){
 const p=a.schritte.flatMap(s=>s.felder.map(f=>({name:s.titel+' · '+f.label,ok:plainNumber(w[f.key]??'')===f.wert})));
 if(a.ziel==='probe'){const [x,y,z]=a.zahlen;p.push({name:'Divisionsprobe',ok:[`${z},${x},${y}`,`${z},${y},${x}`].includes(w.karten)});}
 return p;
}
export function bereit(a:Aufgabe,w:Antworten){return a.schritte.every(s=>s.felder.every(f=>w[f.key]?.trim()))&&(a.ziel!=='probe'||w.karten?.split(',').length===3)&&(!['vergleich','geschichte'].includes(a.ziel)||Boolean(w.text?.trim()));}

import {folgepunkt} from './lernzielbericht.ts';
import {plainNumber,rng} from './groessen-core.ts';
import {stellen,type Werte} from './addition.ts';
export {stellen,kurz,type Werte} from './addition.ts';

export const stufen=['Ohne Entbündeln','Einmal entbündeln','In zwei Spalten entbündeln','Über eine Null hinweg','Über mehrere Nullen hinweg','Unterschiedliche Stellenzahl'];
export function raster(stufe:number,seed:number):[number,number]{
  if(!seed)return ([[875,342],[752,326],[743,568],[704,286],[5002,847],[4106,79]] as [number,number][])[stufe];
  const r=rng(seed),h=r.int(5,9),u=r.int(1,3),v=r.int(6,9),z=r.int(2,4);
  switch(stufe){
    case 0:return [h*100+v*10+v,z*100+z*10+u];
    case 1:return [h*100+v*10+u,z*100+z*10+v];
    case 2:return [h*100+z*10+u,z*100+v*10+v];
    case 3:return [h*100+u,z*100+z*10+v];
    case 4:return [h*1000+u,z*100+z*10+v];
    default:return [h*1000+z*100+u,v*10+v];
  }
}
const ziffern=(n:number)=>Array.from(String(n),Number).reverse();
export function rechenweg(a:number,b:number){
  const oben=ziffern(a),unten=ziffern(b);
  return oben.map((_,i)=>{
    const vorher=oben.slice(),tausch:number[][]=[],abzug=unten[i]??0;
    if(oben[i]<abzug){
      let j=i+1;
      while(j<oben.length&&oben[j]===0)j++;
      if(j===oben.length)throw Error('Das Raster erfordert eine nichtnegative Differenz.');
      for(;j>i;j--){oben[j]--;oben[j-1]+=10;tausch.push(oben.slice());}
    }
    return {vorher,tausch,verfuegbar:oben[i],abzug,rest:oben[i]-abzug};
  });
}
export function rasterpunkte(a:number,b:number,w:Werte){
  const cols=rechenweg(a,b);
  const reihen=[a,b].map((n,j)=>({name:'Ausrichtung · Zahl '+(j+1),ok:cols.every((_,i)=>(w['s'+j+'-'+i]??'')===(String(n).at(-i-1)??''))}));
  return [...reihen,...cols.flatMap((c,i)=>[{name:'Verfügbar · '+stellen[i],ok:plainNumber(w['v'+i]??'')===c.verfuegbar},folgepunkt('Differenz · '+stellen[i],plainNumber(w['e'+i]??'')===c.rest,/^(?:[0-9]|1[0-9])$/.test(w['v'+i]??'')&&/^[0-9]$/.test(w['e'+i]??'')&&Number(w['e'+i])===Number(w['v'+i])-c.abzug)])];
}
export const namen={sprung:'Rückwärts am Zahlenstrahl',ergaenzen:'Vorwärts den Abstand finden',ausgleich:'Mit einer runden Hilfszahl rechnen',vergleich:'Zwei Rechenwege vergleichen',strategie:'Einen passenden Weg wählen',fehler:'Die erste falsche Spalte finden',schaetzen:'Mit Überschlag prüfen',probe:'Die Umkehrprobe legen',luecke:'Die fehlende Zahl finden',geschichte:'Wegnehmen und Vergleichen',groessen:'Längen, Gewichte und Zeitspannen',kette:'Zweimal nacheinander abziehen'} as const;
export type Thema=keyof typeof namen;
export type Ziel=Thema|'raster'|'nullkette';
type Feld={label:string;wert:number|string;wahl?:string[]};
export function aufgabe(t:Thema,seed:number){
  const r=rng(seed||5271),k=seed?r.int(1,8):0;
  const f=(label:string,wert:number|string,wahl?:string[]):Feld=>({label,wert,wahl:wahl?r.shuffle(wahl):undefined});
  const make=(frage:string,felder:Feld[],tipp:string,weg:string,zahlen:number[]=[])=>({t,frage,felder,tipp,weg,zahlen});
  switch(t){
    case 'sprung':case 'ergaenzen':{
      const start=368+k*10,abstand=57+k,ende=start+abstand,vor=t==='ergaenzen';
      return make(vor?`Wie groß ist der Unterschied zwischen ${start} und ${ende}? Ergänze mit eigenen Sprüngen.`:`Rechne ${ende} − ${abstand}. Springe in eigenen Schritten zurück.`,[f(vor?'Gesamter Abstand':'Landepunkt',vor?abstand:start)],'Nutze einen glatten Zehner als Zwischenstopp.',vor?`Von ${start} bis ${start+2} sind es 2, dann noch ${abstand-2}. Der Abstand beträgt ${abstand}.`:`Erst ${ende} − ${Math.floor(abstand/10)*10}, dann noch ${abstand%10} zurück. Du landest bei ${start}.`,[start,ende]);}
    case 'ausgleich':{
      const a=643+10*k,b=198+100*(k%3);
      return make(`Rechne ${a} − ${b}. Runde den Abzug auf ${b+2} auf.`,[f('Ergebnis der Hilfsaufgabe',a-b-2),f('Ausgleich','2 dazuzählen',['2 dazuzählen','2 abziehen']),f('Differenz',a-b)],'Beim größeren Abzug bleibt zunächst zu wenig übrig.',`${a} − ${b+2} = ${a-b-2}. Zwei zurückgeben ergibt ${a-b}.`,[a,b]);}
    case 'vergleich':{
      const a=652+100*k,b=298;
      return make(`Für ${a} − ${b} rechnet Ella erst minus 300 und gibt 2 zurück. Finn ergänzt von 298 bis 300 und dann bis ${a}. Führe beide Wege zu Ende.`,[f('Ellas Zwischenergebnis nach minus 300',a-300),f('Finns zweiter Sprung ab 300',a-300),f('Gemeinsame Differenz',a-b)],'Ella beginnt beim Anfangswert, Finn beim Abzug.',`Ella: ${a} − 300 + 2 = ${a-b}. Finn: 2 + ${a-300} = ${a-b}. Beide erfassen denselben Abstand.`);}
    case 'strategie':{
      const a=702+100*k,b=698+100*k,x=864+k,y=321;
      return make(`Untersuche ${a} − ${b} und ${x} − ${y}. Wähle einen Weg und begründe ihn für eine Rechnung.`,[f('Differenz der ersten Rechnung',4),f('Differenz der zweiten Rechnung',x-y)],'Liegen zwei Zahlen dicht beieinander? Lassen sich die Stellen einzeln abziehen?',`Von ${b} bis ${b+2} und weiter bis ${a} sind es 2 + 2 = 4. Auch ${a} − ${b+2} + 2 = 4. Bei der zweiten Rechnung kannst du zuerst 300, dann 20 und dann 1 abziehen. Ergebnis: ${x-y}.`);}
    case 'fehler':{
      const a=704+100*k,b=286,korrekt=a-b;
      return make(`Lina schreibt ${a} − ${b} = ${korrekt-6}. Prüfe von rechts. Wo weicht ihr Ergebnis zuerst ab?`,[f('Erste falsche Spalte','Einer',['Einer','Zehner','Hunderter']),f('Richtige Differenz',korrekt)],'Prüfe, welche Zahl oben steht. Die Reihenfolge beim Abziehen zählt.',`Lina hat bei den Einern 6 − 4 gerechnet. Entbündle zuerst: 14 − 6 = 8. Richtig ist ${korrekt}.`);}
    case 'schaetzen':{
      const a=842+100*k,b=268;
      return make(`Runde für ${a} − ${b} beide Zahlen auf Hunderter. Rechne danach genau.`,[f('Gerundete erste Zahl',800+100*k),f('Gerundete zweite Zahl',300),f('Überschlag',500+100*k),f('Genaue Differenz',a-b)],'Die Zehnerziffer entscheidet beim Runden auf Hunderter.',`${800+100*k} − 300 = ${500+100*k}. Genau: ${a} − 268 = ${a-b}.`);}
    case 'probe':{
      const a=704+10*k,b=286,d=a-b;
      return make(`Prüfe ${a} − ${b} = ${d} durch Addition. Ordne die drei Karten.`,[],'Was du weggenommen hast und was übrig ist, ergibt zusammen den Anfangswert.',`${d} + ${b} = ${a}. Auch ${b} + ${d} = ${a} stimmt.`,[a,b,d]);}
    case 'luecke':{
      const a=752+100*k,b=326;
      return make(`Ergänze beide Gleichungen: □ − ${b} = ${a-b} und ${a} − □ = ${a-b}. Welche Ziffer gehört in 3□6?`,[f('Fehlender Anfangswert',a),f('Fehlender Abzug',b),f('Verdeckte Zehnerziffer im Abzug',2)],'Beim ersten Kästchen hilft Addition. Beim zweiten kannst du die Differenz vom Anfangswert abziehen.',`${a-b} + ${b} = ${a}. Um den Abzug zu finden: ${a} − ${a-b} = ${b}. Die Zehnerziffer in 326 ist 2.`);}
    case 'geschichte':{
      const a=74+k,b=38+k;
      return make(`Im Bus sitzen ${a} Kinder. An der Schule steigen ${b} aus. In der Turnhalle sind ${a} Kinder, auf dem Sportplatz ${b}. Was bedeutet die Differenz jeweils?`,[f('Im Bus bleiben',a-b),f('In der Halle sind so viele Kinder mehr',a-b),f('Bedeutung im zweiten Beispiel','Unterschied',['Rest nach dem Aussteigen','Unterschied'])],'Zeichne zwei Balken. Vergleiche ihre Enden.',`Beide Rechnungen lauten ${a} − ${b} = ${a-b}. Im Bus bleiben ${a-b} Kinder. In der Halle sind ${a-b} Kinder mehr als auf dem Platz.`,[a,b]);}
    case 'groessen':{
      const m=2+k;
      return make(`Ein Band ist ${m} m 15 cm lang, 48 cm werden abgeschnitten. Ein Paket wiegt ${m} kg 100 g, davon sind 350 g Verpackung. Das Training dauert von 14:45 bis 16:10 Uhr.`,[f('Übriges Band in cm',100*m+15-48),f('Inhalt des Pakets in g',1000*m+100-350),f('Trainingsdauer in Minuten',85)],'Rechne zuerst in dieselbe Einheit um. Eine Stunde hat 60 Minuten.',`${100*m+15} − 48 = ${100*m-33} cm. ${1000*m+100} − 350 = ${1000*m-250} g. Bis 15:00 sind es 15 min, dann 70 min bis 16:10, zusammen 85 min.`);}
    case 'kette':{
      const a=810+100*k,b=247,c=186;
      return make(`Ein Lager hat ${a} Hefte. Erst gehen ${b}, später ${c} Hefte an Klassen. Wie viele bleiben?`,[f('Nach der ersten Ausgabe',a-b),f('Nach beiden Ausgaben',a-b-c),f('Beide Ausgaben zusammen',b+c)],'Ziehe von links nach rechts ab oder fasse die beiden Abzüge zusammen.',`${a} − ${b} = ${a-b}. Dann ${a-b} − ${c} = ${a-b-c}. Zur Kontrolle: ${a} − ${b+c} = ${a-b-c}.`);}
  }
}
export type Aufgabe=ReturnType<typeof aufgabe>;
export const liste=(s?:string)=>s?s.split(',').map(Number):[];
export function punkte(a:Aufgabe,w:Werte){
  const p=a.felder.map((f,i)=>({name:f.label,ok:typeof f.wert==='number'?plainNumber(w['f'+i]??'')===f.wert:w['f'+i]===f.wert}));
  if(a.t==='probe'){const [x,y,z]=a.zahlen,c=liste(w.karten);p.push({name:'Additionsprobe',ok:c.length===3&&c[2]===x&&((c[0]===y&&c[1]===z)||(c[0]===z&&c[1]===y))});}
  if(a.t==='sprung'||a.t==='ergaenzen'){const s=liste(w.spruenge);p.push({name:'Sprungfolge',ok:s.length>0&&s.every(n=>Number.isInteger(n)&&n>0)&&s.reduce((x,y)=>x+y,0)===a.zahlen[1]-a.zahlen[0]});}
  return p;
}
export const pruefplan:Ziel[]=['strategie','raster','nullkette','probe','schaetzen','fehler','geschichte','groessen'];

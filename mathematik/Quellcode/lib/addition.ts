import {folgepunkt,type Kriterium} from './lernzielbericht.ts';
import {fmtNum as fmt,plainNumber,rng} from './groessen-core.ts';

export const stellen=['Einer','Zehner','Hunderter','Tausender','Zehntausender','Hunderttausender'] as const;
export const kurz=['E','Z','H','T','ZT','HT'];
export type Spalte={ziffern:number[];eingang:number;summe:number;ziffer:number;ausgang:number};
export function spalten(zahlen:number[]):Spalte[]{
  const breite=String(zahlen.reduce((s,n)=>s+n,0)).length;
  const liste:Spalte[]=[];
  let eingang=0;
  for(let i=0;i<breite;i++){
    const ziffern=zahlen.map(n=>Math.floor(n/10**i)%10);
    const summe=ziffern.reduce((s,n)=>s+n,eingang),ausgang=Math.floor(summe/10);
    liste.push({ziffern,eingang,summe,ziffer:summe%10,ausgang});eingang=ausgang;
  }
  return liste;
}
export const stufen=['Ohne Übertrag','Ein Übertrag','Mehrere Überträge','Neue Stelle links','Nullen und Leerstellen','Drei Summanden'];
export function rasterAufgabe(stufe:number,seed:number):number[]{
  const beispiele=[[243,125],[247,125],[278,145],[999,1],[4006,78],[278,486,359]];
  if(!seed)return beispiele[stufe].slice();
  const r=rng(seed),n=r.int(1,6);
  switch(stufe){
    case 0:return [n*100+r.int(1,4)*10+r.int(1,4),r.int(1,3)*100+r.int(1,4)*10+r.int(1,4)];
    case 1:return [n*100+r.int(1,3)*10+r.int(6,9),r.int(1,3)*100+r.int(1,4)*10+r.int(5,9)];
    case 2:return [n*100+r.int(6,9)*10+r.int(5,9),r.int(1,3)*100+r.int(4,9)*10+r.int(5,9)];
    case 3:return [10**r.int(2,4)-r.int(1,6),r.int(6,9)];
    case 4:return [n*1000+r.int(2,8),r.int(2,8)*10+r.int(2,8)];
    default:return [n*100+r.int(2,8)*10+r.int(7,9),r.int(1,6)*100+r.int(2,8)*10+r.int(7,9),r.int(1,5)*100+r.int(3,8)*10+r.int(7,9)];
  }
}
export type Werte=Record<string,string>;
export type {Kriterium} from './lernzielbericht.ts';
export function ausrichtung(zahlen:number[],w:Werte,reihe:number){
  const text=String(zahlen[reihe]);
  return spalten(zahlen).every((_,i)=>(w[`s${reihe}-${i}`]??'')===(text[text.length-1-i]??''));
}
export function uebertragRichtig(w:Werte,i:number,c:Spalte){return (w['u'+i]??'')===String(c.eingang)||(!c.eingang&&!w['u'+i]);}
export function rasterPunkte(zahlen:number[],w:Werte):Kriterium[]{
  return [...zahlen.map((_,j)=>({name:'Ausrichtung · Zahl '+(j+1),ok:ausrichtung(zahlen,w,j)})),...spalten(zahlen).flatMap((c,i)=>[
    ...(i?[{name:'Übertrag in die '+stellen[i]+'spalte',ok:uebertragRichtig(w,i,c)&&Boolean(w['u'+i]||w['e'+i])}]:[]),
    folgepunkt('Ergebnis · '+stellen[i],w['e'+i]===String(c.ziffer),i>0&&/^[012]$/.test(w['u'+i]??'')&&w['e'+i]===String((c.summe-c.eingang+Number(w['u'+i]))%10))
  ])];
}

export const namen={
  sprung:'Eigene Sprünge am Zahlenstrahl',ausgleich:'Hilfsaufgabe und Ausgleich',paare:'Geschickt zu Paaren ordnen',vergleich:'Zwei Rechenwege vergleichen',strategie:'Kopf, Zwischenschritte oder Raster?',
  fehler:'Die erste falsche Spalte finden',schaetzen:'Mit Überschlag und Rechnung prüfen',probe:'Die Umkehrprobe bauen',luecke:'Die verdeckte Ziffer finden',
  geschichte:'Zusammenfassen oder Hinzukommen?',groessen:'Längen und Zeiten addieren',nullen:'Nullen und leere Kästchen erklären'
} as const;
export type Thema=keyof typeof namen;
type Feld={key:string;label:string;wert:number|string;optionen?:string[]};
export type Aufgabe={thema:Thema;frage:string;felder:Feld[];weg:string;tipp:string;zahlen:number[]};
export function aufgabe(thema:Thema,seed=0):Aufgabe{
  const r=rng(seed||4129),k=seed?r.int(1,5):0;
  const num=(key:string,label:string,wert:number):Feld=>({key,label,wert});
  const opt=(key:string,label:string,wert:string,andere:string[]):Feld=>({key,label,wert,optionen:r.shuffle([wert,...andere])});
  const baue=(frage:string,felder:Feld[],weg:string,tipp:string,zahlen:number[]=[]):Aufgabe=>({thema,frage,felder,weg,tipp,zahlen});
  switch(thema){
    case 'sprung':{
      const a=368+100*k,b=57+k;
      return baue(`Starte bei ${a}. Addiere ${b} mit eigenen positiven Sprüngen. Du kannst jeden Sprung zurücknehmen.`,[],`Zum nächsten Hunderter sind es 32. Danach bleiben ${b-32}. Du landest bei ${a+b}.`,'Ein runder Zwischenstopp kann helfen.',[a,b]);
    }
    case 'ausgleich':{
      const a=398+100*k,b=257+10*k;
      return baue(`Du möchtest ${a} + ${b} rechnen. Erhöhe den ersten Summanden auf ${a+2}.`,[num('hilfe','Summe der Hilfsaufgabe',a+2+b),opt('weg','So gleiche ich aus','2 abziehen',['2 addieren','nichts ändern']),num('erg','Ursprüngliche Summe',a+b)],`${a+2} + ${b} = ${a+2+b}. Die zwei zusätzlichen Einer wieder wegnehmen: ${a+b}.`,'Welche Zahl wurde für die Hilfsaufgabe größer?',[a,b]);
    }
    case 'paare':{
      const z=[125+k,48-k,75-k,52+k];
      return baue('Tippe jeweils zwei Zahlen an, deren Summe ein voller Hunderter ist. Addiere anschließend die Paarsummen.',[num('erg','Gesamtsumme',300),opt('warum','Warum darfst du so ordnen?','Alle Summanden bleiben genau einmal erhalten.',['Ich darf einen Summanden doppelt verwenden.','Nur benachbarte Summanden zählen.'])],`${z[0]} + ${z[2]} = 200 und ${z[1]} + ${z[3]} = 100. Zusammen 300.`,'Suche Ergänzungen zu 100 und 200.',z);
    }
    case 'vergleich':{
      const a=487+100*k,b=236,target=a+13;
      return baue(`Berechne ${a} + ${b} auf zwei Wegen. Vergleiche sie dann für ${target-2} + ${b}.`,[num('a','Weg A · nach +200',a+200),num('b','Weg A · nach weiteren +30',a+230),num('c','Weg A · nach +6',a+b),num('d','Weg B · runder Hunderter plus 236',target+b),num('e','Weg B · nach dem Ausgleich',a+b)],`Beide Wege ergeben ${a+b}. Bei ${target-2} fehlen zum Hunderter nur zwei Einer.`,'Zerlege 236 oder runde den ersten Summanden auf.');
    }
    case 'strategie':{
      const a=2500+100*k,b=3500-100*k,c=2748+100*k,d=3586;
      return baue('Wähle für jede Rechnung einen passenden Weg. Jeder nachvollziehbare Weg ist möglich.',[num('a',`${fmt(a)} + ${fmt(b)}`,a+b),num('b',`${fmt(c)} + ${fmt(d)}`,c+d)],`Die erste Summe ist ${fmt(a+b)}, die zweite ${fmt(c+d)}. Runde Zahlen erleichtern Kopfrechnen; bei mehreren Überträgen hilft das Raster.`,'Überlege, wie viel du dir bei deinem Weg merken musst.');
    }
    case 'fehler':{
      const a=268+100*k,b=157,typ=seed?r.int(0,2):1;
      const falsch=a+b-[1,10,100][typ],s=stellen[typ];
      return baue(`Nora schreibt ${a} + ${b} = ${falsch}. Prüfe von rechts: Wo weicht ihr Ergebnis zum ersten Mal ab?`,[opt('ort','Erste falsche Ergebnisspalte',s,['Einer','Zehner','Hunderter'].filter(x=>x!==s)),num('erg','Korrigierte Summe',a+b)],`Richtig: ${a} + ${b} = ${a+b}. ${typ===0?'8 + 7 ergibt 15, also 5 Einer.':typ===1?'Bei den Zehnern zählt der übertragene Zehner mit: 6 + 5 + 1 = 12.':'Bei den Hundertern kommt ein Übertrag aus der Zehnerspalte hinzu.'}`,'Vergleiche zuerst die Einer, dann die Zehner.',[a,b,falsch]);
    }
    case 'schaetzen':{
      const a=3978+k*100,b=2146,sum=a+b,ue=6100+k*100;
      return baue(`Schätze ${fmt(a)} + ${fmt(b)}, indem du beide Zahlen auf Hunderter rundest. Prüfe die verbliebenen Vorschläge durch genaues Rechnen.`,[num('ue','Überschlag',ue),opt('aus','Welches Ergebnis ist deutlich zu klein?',String(Math.floor(sum/10)),[String(sum+100),String(sum)]),num('erg','Genaue Summe',sum)],`${fmt(4000+k*100)} + 2.100 = ${fmt(ue)}. Erst genaues Rechnen unterscheidet ${fmt(sum)} von ${fmt(sum+100)}.`,'Ein Überschlag prüft zunächst die Größenordnung.');
    }
    case 'probe':{
      const a=346+100*k,b=278;
      return baue(`Die Rechnung lautet ${a} + ${b} = ${a+b}. Baue eine passende Umkehrprobe mit allen drei Karten.`,[],`Beide Proben stimmen: ${a+b} − ${a} = ${b} und ${a+b} − ${b} = ${a}.`,'Bei der Umkehrprobe beginnst du mit der Summe.',[a,b,a+b]);
    }
    case 'luecke':{
      const digit=seed?r.int(1,8):6,a=407+digit*10,b=286;
      return baue(`4□7 + 286 = ${a+b}. Welche Ziffer ist verdeckt?`,[num('u','Übertrag aus den Einern',1),num('z','Verdeckte Zehnerziffer',digit),num('a','Vollständiger erster Summand',a)],`7 + 6 = 13. Gesucht ist die Ziffer, die mit 8 und dem Übertrag 1 zur Zehnerziffer des Ergebnisses führt. Probe: ${a} + 286 = ${a+b}.`,'Rechne die Einer vor den Zehnern.');
    }
    case 'geschichte':{
      const a=128+10*k,b=76+k;
      return baue(`A: In Bus Rot sitzen ${a} Kinder, in Bus Blau ${b}. Wie viele fahren mit? B: Im Stadion sind ${a} Kinder. Dann kommen ${b} dazu. Wie viele sind jetzt da?`,[opt('bus','Geschichte A','Zusammenfassen',['Hinzukommen']),opt('stadion','Geschichte B','Hinzukommen',['Zusammenfassen']),num('erg','Anzahl in jeder Geschichte',a+b)],`In beiden Fällen gilt ${a} + ${b} = ${a+b}. Im Busbeispiel sind beide Gruppen schon da, im Stadion kommt eine Gruppe später dazu.`,'Achte auf den Unterschied zwischen zwei Gruppen und zwei Zeitpunkten.',[a,b]);
    }
    case 'groessen':{
      const cm=75+k,min=45+k;
      return baue(`Ein Band von 1 m ${cm} cm wird um 85 cm verlängert. Ein Ausflug von 1 h ${min} min dauert 35 min länger. Gib beide Ergebnisse in gemischter Schreibweise an.`,[num('m','Ganze Meter',2),num('cm','Übrige Zentimeter',cm+85-100),num('h','Ganze Stunden',2),num('min','Übrige Minuten',min+35-60)],`${cm+85} cm ergeben 1 m ${cm-15} cm. ${min+35} min ergeben 1 h ${min-25} min. Mit dem ursprünglichen Meter bzw. der Stunde sind es jeweils zwei ganze Einheiten.`,'Bündle 100 Zentimeter zu einem Meter und 60 Minuten zu einer Stunde.');
    }
    case 'nullen':{
      const a=4006+1000*k;
      return baue(`Schreibe ${fmt(a)} + 78 stellenrichtig. Was bedeuten die beiden Nullen? Was geschieht, wenn man beide aus der Zahl streicht?`,[opt('null','Die beiden Nullen zeigen','0 Hunderter und 0 Zehner',['0 Tausender und 0 Einer','Zwei fehlende Summanden']),num('kurz','Zahl nach Streichen der beiden Nullen',(4+k)*10+6),num('erg','Summe mit der ursprünglichen Zahl',a+78)],`Die Nullen halten die Stellen frei. 78 hat keine Hunderter- oder Tausenderziffer. ${fmt(a)} + 78 = ${fmt(a+78)}.`,'Eine Null innerhalb einer Zahl hat eine andere Aufgabe als ein freies Kästchen links.',[a,78]);
    }
  }
}
export function pruefeAufgabe(a:Aufgabe,w:Werte):Kriterium[]{
  const felder=a.felder.map(f=>({name:f.label,ok:typeof f.wert==='number'?plainNumber(w[f.key]??'')===f.wert:w[f.key]===f.wert}));
  if(a.thema==='sprung'){const spruenge=liste(w.spruenge);return [{name:'Sprungweg',ok:spruenge.length>0&&spruenge.every(n=>Number.isInteger(n)&&n>0)&&spruenge.reduce((s,n)=>s+n,0)===a.zahlen[1]}];}
  if(a.thema==='probe'){const [x,y,sum]=a.zahlen,[erst,zweit,dritt]=liste(w.karten);return [{name:'Umkehrprobe',ok:erst===sum&&((zweit===x&&dritt===y)||(zweit===y&&dritt===x))}];}
  if(a.thema==='paare'){const z=liste(w.paare);return [{name:'Passende Paare',ok:z.length===4&&new Set(z).size===4&&[0,2].every(i=>(z[i]+z[i+1])%100===0)&&z.every(n=>a.zahlen.includes(n))},...felder];}
  return felder;
}
export const liste=(s?:string)=>s?s.split(',').map(Number):[];
export const pruefplan=['strategie','raster','raster3','ausgleich','schaetzen','fehler','geschichte','groessen'] as const;
export type Teil=typeof pruefplan[number];

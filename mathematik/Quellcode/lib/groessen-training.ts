import {fmtNum as f, plainNumber, rng} from './groessen-core.ts';
import {uhr} from './zeit-tasks.ts';

import {aufbau,aufbauThemen,istAufbau} from './groessen-aufbau.ts';

export const fach = {laenge:'Längen', masse:'Gewichte', zeit:'Zeit'} as const;
export type Fach = keyof typeof fach;
export const themen = {
  ...aufbauThemen,
  lineal:['laenge','Am versetzten Lineal messen'], strecke:['laenge','Meter und Kilometer'], stellen:['laenge','Meter und Zentimeter zusammensetzen'],
  skala:['masse','Die Skala der Küchenwaage'], dose:['masse','Verpackung und Inhalt'], ordnen:['masse','Gleiche Massen finden'], rezept:['masse','Ein Rezept abwiegen'],
  zeitlinie:['zeit','Zeitspannen mit Zwischenstopps'], dezimal:['zeit','Uhrzeit oder Dauer?'], zurueck:['zeit','Vom Bus rückwärts planen'], fahrplan:['zeit','Den Anschluss wählen'],
  regelL:['laenge','Die Rechenregel für Längen'],regelM:['masse','Die Rechenregel für Gewichte'],regelZ:['zeit','Die Rechenregel für Zeit'],
  fehlerL:['laenge','Fehlerdetektiv · Längen'],fehlerM:['masse','Fehlerdetektiv · Gewichte'],fehlerZ:['zeit','Fehlerdetektiv · Zeit'],
  ausflugL:['laenge','Ausflug · Wanderstrecke'],ausflugM:['masse','Ausflug · Verpflegung'],ausflugZ:['zeit','Ausflug · Rückkehr']
} as const;
export type Thema = keyof typeof themen;
export type Feld = {label:string; wert:string|number; optionen?:string[]};
export type Bild = {typ:'lineal'|'strecke'|'stellen'|'skala'|'dose'|'ordnen'|'rezept'|'zeitlinie'; daten:number[]};
export type Aufgabe = {frage:string; felder:Feld[]; tipp:string; weg:string; tabelle?:string[][]; modell?:{art:'band'|'familie'|'waage'|'nullpunkt'|'uhr'|'kalender';werte:number[]}; bild?:Bild};
const zahl=(label:string,wert:number):Feld=>({label,wert});
const wahl=(label:string,wert:string,optionen:string[]):Feld=>({label,wert,optionen});
export function richtig(feld:Feld, antwort:string) {
  return typeof feld.wert==='number' ? Math.abs((plainNumber(antwort)??NaN)-feld.wert)<1e-8 : antwort===feld.wert;
}
export function aufgabe(id:Thema,seed:number,umkehr=false,variante=0):Aufgabe {
  if(istAufbau(id))return aufbau(id,seed,variante);
  const r=rng(seed), n=r.int(2,8), rest=r.int(1,9), kg=n+rest/100, g=n*1000+rest*10;
  const make=(frage:string,felder:Feld[],tipp:string,weg:string,bild?:Bild)=>({frage,felder,tipp,weg,bild});
  const pick=(label:string,wert:string,others:string[])=>wahl(label,wert,r.shuffle([wert,...others]));
  switch(id){
    case 'regelL':case 'regelM':case 'regelZ': {
      const [gross,klein,faktor]=id==='regelZ'?(r.int(0,1)?['Tage','h',24] as const:['h','min',60] as const):id==='regelM'?['kg','g',1000] as const:['m','cm',100] as const;
      const anzahl=id==='regelM'?n+rest/100:n;
      const kleinwert=id==='regelM'?n*1000+rest*10:n*faktor;
      const a=umkehr?kleinwert:anzahl, b=umkehr?anzahl:kleinwert, op=umkehr?'teilen':'multiplizieren';
      return make(`Rechne ${f(a)} ${umkehr?klein:gross} in ${umkehr?gross:klein} um. Wähle zuerst den Rechenweg.`,[pick('Rechenart',op,[umkehr?'multiplizieren':'teilen']),wahl('Faktor',String(faktor),['10','24','60','100','1000']),zahl('Ergebnis in '+(umkehr?gross:klein),b)],'Überlege zuerst, welche Einheit größer ist.',`Eine große Einheit enthält ${faktor} kleine. ${f(a)} ${umkehr?'÷':'×'} ${faktor} = ${f(b)}.`);
    }
    case 'lineal':{
      const a=r.int(12,38), b=a+r.int(32,69);
      return make('Der Stift liegt versetzt auf dem Lineal. Markiere beide Enden und ermittle seine Länge.',[zahl('Anfang in cm',a/10),zahl('Ende in cm',b/10),zahl('Länge in cm',(b-a)/10)],'Ein kleiner Strich entspricht 1 mm. Ziehe den Anfangswert vom Endwert ab.',`${f(b/10)} − ${f(a/10)} = ${f((b-a)/10)} cm.`,{typ:'lineal',daten:[a,b]});
    }
    case 'strecke':{
      const m=r.pick([100,200,350,500,750,900,1000]);
      return make(`Setze eine Wegmarke bei ${m} m. Wie weit ist das in Kilometern?`,[zahl('Position in m',m),zahl('Strecke in km',m/1000)],'Ein ganzer Kilometer hat 1.000 Meter.',`${m} : 1.000 = ${f(m/1000)} km.`,{typ:'strecke',daten:[m]});
    }
    case 'stellen': return make(umkehr?`Zerlege ${f(n+rest/100)} m in ganze Meter und restliche Zentimeter.`:`Lege ${n} m und ${rest} cm. Schreibe die Länge auch als Dezimalzahl.`,[zahl('Ganze Meter',n),zahl('Übrige Zentimeter',rest),zahl(umkehr?'Gesamtlänge in cm':'Gesamtlänge in m',umkehr?n*100+rest:n+rest/100)],'Hundert Zentimeter ergeben einen Meter. Ein einzelner Zentimeter ist ein Hundertstel Meter.',`${n} m + ${rest} cm = ${n*100+rest} cm = ${f(n+rest/100)} m.`,{typ:'stellen',daten:[n,rest,umkehr?1:0]});
    case 'skala':{
      const step=r.pick([20,25,50,100]),strich=r.pick([2,3,4,6,7,8,9,11,12,13,14,16,17,18]);
      return make('Lies die Küchenwaage ab. Bestimme zuerst den Wert eines Teilstrichs.',[zahl('Gramm je Teilstrich',step),zahl('Anzeige in g',strich*step)],'Zähle die Abstände zwischen zwei beschrifteten Werten.',`${step*10} g : 10 = ${step} g je Teilstrich. Der Zeiger steht bei ${strich} · ${step} = ${strich*step} g.`,{typ:'skala',daten:[step,strich]});
    }
    case 'dose':{
      const tara=r.int(9,17)*10, inhalt=r.int(22,73)*10;
      return make(`Die volle Dose wiegt ${tara+inhalt} g. Das leere Gefäß wiegt ${tara} g. Wie schwer ist der Inhalt?`,[zahl('Inhalt in g',inhalt)],'Die volle Dose enthält zwei Massen: Metall und Inhalt.',`${tara+inhalt} − ${tara} = ${inhalt} g.`,{typ:'dose',daten:[tara,inhalt]});
    }
    case 'ordnen':{
      const klein=g-100;
      return make('Ordne die drei Karten auf der Gewichtslinie ein. Gleiche Massen bekommen denselben Platz.',[zahl(f(kg)+' kg · Position in g',g),zahl(klein+' g · Position in g',klein),zahl(n+' kg '+rest*10+' g · Position in g',g)],'Wandle jede Angabe in Gramm um. Vergleiche danach die Zahlen.',`${f(kg)} kg = ${g} g = ${n} kg ${rest*10} g. ${klein} g liegt 100 g weiter links.`,{typ:'ordnen',daten:[klein-100,g+100]});
    }
    case 'rezept':{
      const ziel=r.pick([500,750,900,1250]),vor=r.int(12,42)*10;
      return make(`Das Rezept verlangt ${f(ziel/1000)} kg Mehl. In der Schüssel liegen ${vor} g. Berechne, wie viel fehlt, und fülle die Menge zur Probe nach.`,[zahl('Es fehlen so viele Gramm',ziel-vor)],'Rechne das Ziel in Gramm um. Ziehe die vorhandene Menge ab.',`${ziel} − ${vor} = ${ziel-vor} g.`,{typ:'rezept',daten:[vor,ziel]});
    }
    case 'zeitlinie':{
      const a=(7+n)*60+r.int(38,55), b=a+r.int(63,99);
      return make(`Wie lange dauert es von ${uhr(a)} bis ${uhr(b)} Uhr? Setze eigene Zwischenstopps auf der Zeitlinie.`,[zahl('Dauer in Minuten',b-a)],'Bis zur nächsten vollen Stunde ist es nur ein kurzer Sprung.',`Bis ${uhr(a-a%60+60)} Uhr: ${60-a%60} min. Danach ${b-(a-a%60+60)} min. Insgesamt ${b-a} min.`,{typ:'zeitlinie',daten:[a,b]});
    }
    case 'dezimal':{
      const m=r.pick([15,30,45]),h=n;
      return make(`„Der Film beginnt um ${uhr(h*60+m)} Uhr.“ „Er dauert ${f(h+m/60)} Stunden.“ Ordne zu. Wie viele Minuten wären dagegen ${h},30 Stunden?`,[pick('Beginn', 'Zeitpunkt',['Dauer']),pick('Filmlänge','Dauer',['Zeitpunkt']),zahl('Minuten für '+h+',30 h',h*60+18)],'0,30 h sind drei Zehntel einer Stunde. Eine Stunde hat 60 Minuten.',`${h},30 h = ${h} h + 0,30 · 60 min = ${h*60+18} min. Ein Doppelpunkt trennt Stunden und Minuten einer Uhrzeit.`);
    }
    case 'zurueck':{
      const bus=(7+n)*60+r.int(5,49),weg=r.int(12,25),puffer=r.int(3,9);
      return make(`Der Bus fährt um ${uhr(bus)} Uhr. Du gehst ${weg} min und möchtest ${puffer} min vorher da sein. Wann musst du los?`,[zahl('Stunde der Startzeit',Math.floor((bus-weg-puffer)/60)),zahl('Minute der Startzeit',(bus-weg-puffer)%60)],'Gehe zuerst die Wartezeit und dann die Gehzeit rückwärts.',`${uhr(bus)} − ${puffer} min = ${uhr(bus-puffer)}. Weitere ${weg} min zurück: ${uhr(bus-puffer-weg)} Uhr.`,{typ:'zeitlinie',daten:[bus-weg-puffer-10,bus]});
    }
    case 'fahrplan':{
      const a=480+n*10,spaet=r.int(3,8),weg=r.int(3,7), kurz=spaet+weg-2, lang=spaet+weg+rest,tausch=r.int(0,1),gut=tausch?'A':'B';
      return {...make(`Dein Zug soll um ${uhr(a)} Uhr ankommen und hat ${spaet} min Verspätung. Zum Bus brauchst du ${weg} min. Lies den Fahrplan. Welchen Bus erreichst du?`,[wahl('Erreichbarer Bus',gut,['A','B']),zahl('Reserve am Bussteig in min',rest),pick('Begründung','Ich vergleiche die Ankunft am Bussteig mit der Abfahrt.',['Ich vergleiche nur die planmäßige Zugankunft mit der Abfahrt.','Der früher abfahrende Bus ist immer erreichbar.'])],'Addiere zur planmäßigen Zugankunft erst die Verspätung, dann den Fußweg.',`Am Bussteig bist du um ${uhr(a+spaet+weg)}. Für Bus ${gut} bleiben ${rest} min.`),tabelle:[['Bus','Abfahrt'],['A',uhr(a+(tausch?lang:kurz))+' Uhr'],['B',uhr(a+(tausch?kurz:lang))+' Uhr']]};
    }
    case 'fehlerL':case 'fehlerM':case 'fehlerZ':{
      const zeit=id==='fehlerZ',masse=id==='fehlerM', basis=zeit?60:masse?1000:100,teil=zeit?15:masse?50:5, einheit=zeit?'h':masse?'kg':'m',klein=zeit?'min':masse?'g':'cm';
      const falsch=zeit?n+0.15:n+0.5;
      const fehler=r.int(0,2), zeichen=['①','②','③'];
      const schritte=[
        [`① Eine ${einheit} enthält ${basis===100?10:100} ${klein}.`,`② Ich möchte ${teil} ${klein} in ${einheit} umrechnen.`,`③ Anschließend addiere ich den Anteil zu ${n} ${einheit}.`],
        [`① Eine ${einheit} enthält ${basis} ${klein}.`,`② Ich multipliziere ${teil} mit ${basis}, um ${einheit} zu erhalten.`,`③ Ich addiere den umgerechneten Anteil zu ${n} ${einheit}.`],
        [`① Ich habe ${n} ${einheit} und ${teil} ${klein}.`,`② Eine ganze große Einheit hat ${basis} kleine.`,`③ Zusammen sind das ${f(falsch)} ${einheit}.`]
      ];
      return make(`Ben rechnet ${n} ${einheit} und ${teil} ${klein} zusammen. ${schritte[fehler].join(' ')} Finde und verbessere den Fehler.`,[wahl('Fehlerhafter Schritt',zeichen[fehler],zeichen),zahl('Richtige Zahl in '+einheit,n+teil/basis),pick('Warum?',`Ich teile ${teil} durch ${basis} und addiere den Anteil.`,['Ich hänge die Ziffern hinter dem Komma an.','Ich multipliziere beide Zahlen miteinander.'])],`Welchen Anteil einer ganzen Einheit bilden ${teil} ${klein}?`,`${teil} : ${basis} = ${f(teil/basis)}. Zusammen sind es ${f(n+teil/basis)} ${einheit}.`);
    }
    case 'ausflugL':return make(`Klassenausflug zum See: Von der Schule bis zum Wald sind es ${n} km, dann noch 750 m. Wie lang ist der Hinweg?`,[zahl('Hinweg in km',n+0.75)],'Wandle 750 m in Kilometer um.',`${n} + 0,75 = ${f(n+0.75)} km.`);
    case 'ausflugM':return make(`Am See teilt ihr Proviant. Eure Kiste enthält ${n} kg Äpfel und vier Beutel mit je 250 g Nüssen. Wie viel Proviant habt ihr?`,[zahl('Proviant in kg',n+1)],'Berechne die Masse aller vier Beutel.',`4 · 250 g = 1 kg. Zusammen ${n+1} kg.`);
    case 'ausflugZ':{
      const start=13*60+rest*5,dauer=55+n*5;
      return make(`Nach dem Picknick geht die Klasse um ${uhr(start)} Uhr los. Der Rückweg dauert ${dauer} Minuten. Wann kommt sie an der Schule an?`,[zahl('Stunde',Math.floor((start+dauer)/60)),zahl('Minute',(start+dauer)%60)],'Ergänze zuerst bis zur vollen Stunde.',`${uhr(start)} Uhr + ${dauer} min = ${uhr(start+dauer)} Uhr.`);
    }
  }
}
export const diagnose:Thema[]=['regelL','lineal','regelM','skala','regelZ','zeitlinie'];
export const pruefung:Thema[]=['lineal','skala','zeitlinie','regelL','regelM','regelZ','stellen','ordnen','dezimal','ausflugL','rezept','fahrplan'];
export const ausflug:Thema[]=['ausflugL','ausflugM','ausflugZ'];
export const detektiv:Thema[]=['fehlerL','fehlerM','fehlerZ'];

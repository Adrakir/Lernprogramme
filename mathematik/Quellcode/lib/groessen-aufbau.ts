import {fmtNum as f,rng} from './groessen-core.ts';
import {uhr} from './zeit-tasks.ts';
import type {Aufgabe,Feld} from './groessen-training';

export const aufbauThemen={
  genau:['laenge','Welche Messgenauigkeit brauche ich?'], familie:['laenge','Längenfamilien bilden'], band:['laenge','Das verdeckte Bandstück'],
  waage:['masse','Das Gleichgewicht erhalten'], plausibel:['masse','Welche Masse ist plausibel?'], nullpunkt:['masse','Den Nullpunkt prüfen'],
  fahrdreieck:['zeit','Start, Ende und Dauer'], tageszeit:['zeit','Halb acht am Morgen oder am Abend?'], kalender:['zeit','Reisen über mehrere Tage'], fahrtafel:['zeit','Den Fahrplan in beide Richtungen lesen'],
  textspur:['laenge','Angaben im Sachtext markieren'], wege:['zeit','Zwei Rechenwege vergleichen']
} as const;
export type AufbauId=keyof typeof aufbauThemen;
export function istAufbau(id:string):id is AufbauId{return Object.hasOwn(aufbauThemen,id);}
export function aufbau(id:AufbauId,seed:number,variante:number):Aufgabe{
  const r=rng(seed),n=r.int(2,7),cm=r.int(2,9);
  const zahl=(label:string,wert:number):Feld=>({label,wert});
  const wahl=(label:string,wert:string,...falsch:string[]):Feld=>({label,wert,optionen:r.shuffle([wert,...falsch])});
  const auf=(frage:string,felder:Feld[],tipp:string,weg:string):Aufgabe=>({frage,felder,tipp,weg});
  switch(id){
    case 'genau':{
      const fall=r.pick([['Buchdeckel','Dicke','mm','Millimeter unterscheiden kleine Dicken.'],['Klassentisch','Länge','cm','Zentimeter reichen zum Anpassen einer Tischdecke.'],['Schulweg','Länge','km','Kilometer mit Nachkommastellen machen längere Wege übersichtlich.']] as const);
      return auf(`Du beschreibst die ${fall[1]} deines Gegenstands: ${fall[0]}. Welche Einheit ist im Alltag praktisch?`,[wahl('Einheit',fall[2],...['mm','cm','km'].filter(u=>u!==fall[2])),wahl('Begründung',fall[3],'Die kleinste Einheit ist bei jeder Messung am besten.','Eine größere Einheit macht jede Messung genauer.')],'Überlege, welche Unterschiede bei diesem Gegenstand wichtig sind.',fall[3]);
    }
    case 'familie':{
      const k=r.int(1,4),target=k*100+cm, cards=r.shuffle([f(k+cm/100)+' m',target+' cm',k+' m '+cm+' cm',k+' m '+cm*10+' cm']);
      return {...auf(`Bilde die Längenfamilie zu ${target} cm. Entscheide für jede Karte und prüfe danach die Maßstreifen.`,cards.map(s=>wahl(s,s===k+' m '+cm*10+' cm'?'andere Länge':'gleiche Länge',s===k+' m '+cm*10+' cm'?'gleiche Länge':'andere Länge')),'Ein Zentimeter ist ein Hundertstel Meter.',`${f(k+cm/100)} m = ${target} cm = ${k} m ${cm} cm. Die übrige Karte entspricht ${k*100+cm*10} cm.`),modell:{art:'familie',werte:[target,k*100+cm*10]}};
    }
    case 'band':{
      const ganz=n*100,rot=r.int(45,78),blau=r.int(28,57),fehl=ganz-rot-blau;
      return {...auf(`Ein ${n} m langes Band hat ein rotes Stück von ${rot} cm und ein blaues von ${blau} cm. Der Rest ist verdeckt.`,[wahl('Ansatz','Gesamtlänge minus beide sichtbaren Stücke','Alle drei Zahlen addieren','Nur das längere Stück abziehen'),zahl('Gesamtlänge in cm',ganz),zahl('Verdeckte Länge in cm',fehl)],'Rechne zuerst die gesamte Bandlänge in Zentimeter um.',`${n} m = ${ganz} cm. ${ganz} − ${rot} − ${blau} = ${fehl} cm.`),modell:{art:'band',werte:[ganz,rot,blau]}};
    }
    case 'waage':{
      const extra=r.pick([100,150,200,250]),rechts=r.int(9,18)*50;
      return {...auf(`Links liegen ein Beutel und ein ${extra}-g-Gewicht. Rechts liegen ${rechts} g. Die Waage ist im Gleichgewicht. Wie schwer ist der Beutel?`,[wahl('Auf beiden Seiten','Dieselbe Masse wegnehmen','Nur rechts Masse wegnehmen','Links noch ein Gewicht hinzufügen'),zahl('Beutel in g',rechts-extra)],'Wenn du links und rechts gleich viel entfernst, bleibt die Waage im Gleichgewicht.',`Entferne auf beiden Seiten ${extra} g. Links bleibt der Beutel. Rechts bleiben ${rechts} − ${extra} = ${rechts-extra} g.`),modell:{art:'waage',werte:[extra,rechts]}};
    }
    case 'plausibel':{
      const gramm=r.int(32,49)*100;
      return auf(`Ein gepackter Schulrucksack trägt die Zahl ${f(gramm)}. Wähle zuerst die plausible Einheit und überprüfe eine falsche Angabe.`,[wahl('Plausible Angabe',f(gramm)+' g',f(gramm)+' mg',f(gramm)+' kg'),zahl('Zum Vergleich: die Milligramm-Angabe in g',gramm/1000),wahl('Mein Vergleich','Ein gepackter Rucksack wiegt mehrere Kilogramm.','Ein gepackter Rucksack wiegt nur wenige Gramm.','Ein gepackter Rucksack wiegt mehrere Tonnen.')],'Vergleiche mit einer vollen 1-Liter-Wasserflasche.',`${f(gramm)} g = ${f(gramm/1000)} kg. ${f(gramm)} mg sind dagegen nur ${f(gramm/1000)} g.`);
    }
    case 'nullpunkt':{
      const offset=r.pick([50,75,100]),gewicht=r.int(8,18)*50;
      return {...auf(`Die leere Waage zeigt ${offset} g an. Mit Paket zeigt sie ${gewicht+offset} g. Bestimme die tatsächliche Masse und kontrolliere durch Nullstellen.`,[wahl('Korrektur','Leere Anzeige abziehen','Leere Anzeige addieren','Volle Anzeige halbieren'),zahl('Paket in g',gewicht)],'Der gleiche Anzeigefehler steckt auch im zweiten Wert.',`${gewicht+offset} − ${offset} = ${gewicht} g.`),modell:{art:'nullpunkt',werte:[offset,gewicht]}};
    }
    case 'fahrdreieck':{
      const start=480+r.int(35,55),dauer=r.int(29,53),ende=start+dauer,fall=variante%3;
      const zeitzahl=(label:string,m:number)=>[zahl(label+' · Stunde',Math.floor(m/60)),zahl(label+' · Minute',m%60)];
      return auf([ `Der Bus startet um ${uhr(start)} Uhr und fährt ${dauer} min. Wann kommt er an?`,`Die Fahrt endet um ${uhr(ende)} Uhr und dauert ${dauer} min. Wann startete sie?`,`Der Bus startet um ${uhr(start)} Uhr und kommt um ${uhr(ende)} Uhr an. Wie lange fährt er?`][fall],fall===2?[zahl('Dauer in min',dauer)]:fall===1?zeitzahl('Start',start):zeitzahl('Ankunft',ende),'Start + Dauer = Ende. Zeichne die bekannte Strecke ein.',`${uhr(start)} Uhr + ${dauer} min = ${uhr(ende)} Uhr. Rückwärts: ${uhr(ende)} Uhr − ${dauer} min = ${uhr(start)} Uhr.`);
    }
    case 'tageszeit':{
      const h=r.int(5,8),frueh=uhr(h*60+30),spaet=uhr((h+12)*60+30);
      return {...auf(`Die Zeiger stehen auf halb ${['eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun'][h]}. Ordne die Digitalzeiten den Szenen zu.`,[wahl('Beim Frühstück',frueh,spaet),wahl('Beim Abendessen',spaet,frueh),wahl('Ohne die Szene fehlt …','die Tageshälfte','der Minutenwert','der Abstand der Zeiger')],'Der kurze Zeiger liegt zwischen zwei Zahlen. Morgens und abends kann das Zifferblatt gleich aussehen.',`${frueh} Uhr morgens und ${spaet} Uhr abends haben dieselbe Zeigerstellung. Die Tageshälfte entscheidet.`),modell:{art:'uhr',werte:[h,30]}};
    }
    case 'kalender':{
      const a=21*60+r.pick([15,30,45,60,90]),b=r.int(5,8)*60+r.pick([0,15,30,45]),gesamt=1440-a+1440+b;
      return {...auf(`Dein Zug startet am Freitag um ${uhr(a)} Uhr und kommt am Sonntag um ${uhr(b)} Uhr an. Zerlege die Reise an den Tagesgrenzen.`,[zahl('Freitag · verbleibende Minuten',1440-a),zahl('Samstag · ganze Stunden',24),zahl('Gesamtdauer · ganze Stunden',Math.floor(gesamt/60)),zahl('Gesamtdauer · Restminuten',gesamt%60)],'Zwischen den beiden Teilstücken liegt ein ganzer Samstag.',`Freitag ${1440-a} min + Samstag 24 h + Sonntag ${Math.floor(b/60)} h ${b%60} min = ${Math.floor(gesamt/60)} h ${gesamt%60} min.`),modell:{art:'kalender',werte:[a,b]}};
    }
    case 'fahrtafel':{
      const a=460+n*3,ab=[a,a+20,a+45],zeit=r.int(12,19),ziel=ab[1]+zeit+4;
      const tabelle=[['Haltestelle','Fahrt A','Fahrt B','Fahrt C'],...['Schule','Markt','Museum'].map((ort,i)=>[ort,...ab.map(t=>uhr(t+[0,6,zeit][i]))])];
      const rueck=variante%2===1;
      return {...auf(rueck?`Du musst spätestens um ${uhr(ziel)} Uhr am Museum sein. Welche ist die letzte passende Fahrt ab Schule?`:'Du steigst am Markt in Fahrt B. Wann kommst du am Museum an?',rueck?[wahl('Fahrt','B','A','C'),wahl('Abfahrt an der Schule',uhr(ab[1]),uhr(ab[0]),uhr(ab[2]))]:[wahl('Ankunft am Museum',uhr(ab[1]+zeit),uhr(ab[1]+6),uhr(ab[2]+zeit))],'Verfolge dieselbe Fahrt in einer Spalte. Suche bei einer Frist zuerst in der Zielzeile.',`Fahrt B: Schule ${uhr(ab[1])}, Markt ${uhr(ab[1]+6)}, Museum ${uhr(ab[1]+zeit)}. Fahrt C erreicht das Museum erst um ${uhr(ab[2]+zeit)}.`),tabelle};
    }
    case 'textspur':{
      const km=n,min=r.int(35,55),kg=r.int(2,4),ziel=variante%2?'Zeit für zwei gleich lange Etappen bei gleichem Tempo':'Länge von zwei gleich langen Etappen';
      const rollen=['gegeben und gebraucht','für diese Frage unwichtig','gesucht'];
      const sort=(label:string,idx:number)=>({label,wert:rollen[idx],optionen:rollen});
      return auf(`Eine Wanderetappe ist ${km} km lang, dauert ${min} min und der Rucksack wiegt ${kg} kg. Gesucht ist die ${ziel}. Ordne die Textstellen zu und rechne.`,[sort(km+' km',variante%2?1:0),sort(min+' min',variante%2?0:1),sort(kg+' kg',1),sort(ziel,2),zahl('Ergebnis in '+(variante%2?'min':'km'),2*(variante%2?min:km))],'Lies zuerst die Frage. Welche Größe kommt im Ergebnis vor?',`Für zwei solche Etappen verdoppelst du ${variante%2?min+' min':km+' km'}. Die Masse brauchst du hierfür nicht.`);
    }
    case 'wege':{
      const a=(11+n)*60+r.int(41,54),b=a+r.int(76,98),volle=(Math.floor(a/60)+1)*60;
      return auf(`Von ${uhr(a)} bis ${uhr(b)} Uhr: Löse dieselbe Aufgabe über die nächste volle Stunde und mit Minuten seit Mitternacht.`,[zahl('Weg A · bis zur vollen Stunde in min',volle-a),zahl('Weg A · danach in min',b-volle),zahl('Weg B · Start in Minuten seit Mitternacht',a),zahl('Weg B · Ende in Minuten seit Mitternacht',b),zahl('Dauer in min',b-a)],'Weg A addiert Zeitabschnitte. Weg B subtrahiert zwei Zeitpunkte in derselben Einheit.',`Weg A: ${volle-a} + ${b-volle} = ${b-a} min. Weg B: ${b} − ${a} = ${b-a} min.`);
    }
  }
}

import {learningKey,skills,type Skill} from './learning.ts';
import {rng} from './groessen-core.ts';
export const themen={addition:'Addition',subtraktion:'Subtraktion',multiplikation:'Multiplikation',division:'Division',zeit:'Zeit',laenge:'Längen',masse:'Gewichte',daten:'Diagramme',geometrie:'Geometrie',sach:'Rechenart wählen'} as const;
export type Fach=keyof typeof themen;
export const faecher=Object.keys(themen) as Fach[];
export type Blattaufgabe={fach:Fach;text:string;antwort:number;einheit:string;weg:string;kriterien:string[];werte:number[];art?:string};
export function blattaufgabe(fach:Fach,seed:number,position:number):Blattaufgabe{
 const r=rng(seed),a=r.int(3,8),b=r.int(3,8),c=r.int(2,5);
 function baue(text:string,antwort:number,einheit:string,weg:string,kriterien:string[],werte:number[]=[],art?:string){return {fach,text,antwort,einheit,weg,kriterien,werte,art};}
 const rechne=(x:number,y:number,op:string,n:number)=>baue(`Rechne schriftlich: ${x} ${op} ${y}. Zeige deine Zwischenschritte.`,n,'',`${x} ${op} ${y} = ${n}.`,['Stellenwert und Zwischenschritte stimmen','Ergebnis stimmt']);
 switch(fach){
 case 'addition':return rechne(100*a+78,100*b+57,'+',100*(a+b)+135);
 case 'subtraktion':return rechne(100*(a+3)+2,100*a+40+b,'−',262-b);
 case 'multiplikation':return rechne(10*a+7,10*c+3,'·',(10*a+7)*(10*c+3));
 case 'division':{const q=100*a+b;return rechne(q*c,c,':',q);}
 case 'zeit':return baue(`Der Bus fährt um ${a+7}:45 Uhr los und kommt um ${a+8}:${10+b} Uhr an. Wie lange fährt er?`,25+b,'min',`15 min bis zur vollen Stunde, danach ${10+b} min. Zusammen ${25+b} min.`,['Volle Stunde als Zwischenstopp','Dauer mit Einheit']);
 case 'laenge':return baue(`Von ${a} m 15 cm Band schneidest du ${40+b} cm ab. Wie lang ist der Rest?`,100*a+15-40-b,'cm',`${100*a+15} cm − ${40+b} cm = ${100*a-25-b} cm.`,['Einheiten vereinheitlicht','Restlänge mit Einheit']);
 case 'masse':return baue(`Ein Paket wiegt ${a} kg 200 g, davon sind ${100+10*b} g Verpackung. Wie viel wiegt der Inhalt?`,1000*a+100-10*b,'g',`${1000*a+200} g − ${100+10*b} g = ${1000*a+100-10*b} g.`,['In Gramm umgerechnet','Inhalt mit Einheit']);
 case 'daten':{const v=[a,b+3,c+1];return baue(`Schulwege: Rad ${v[0]}, Bus ${v[1]}, zu Fuß ${v[2]} Kinder. Zeichne ein Säulendiagramm. Wie viele Kinder nahmen teil?`,v.reduce((s,n)=>s+n),'Kinder',`Addiere die drei Häufigkeiten: ${v.join(' + ')} = ${v.reduce((s,n)=>s+n)}.`,['Achsen und Kategorien beschriftet','Gleichmäßiger Maßstab und passende Säulenhöhen','Gesamtzahl richtig'],v);}
 case 'geometrie':return baue(`Zeichne ein Rechteck mit Seitenlängen ${a} cm und ${b} cm. Beschrifte die Seiten und bestimme den Umfang.`,2*(a+b),'cm',`U = 2 · (${a} + ${b}) = ${2*(a+b)} cm.`,['Rechte Winkel und Seitenlängen','Maßstab und Beschriftung','Umfang mit Einheit'],[a,b]);
 case 'sach':{const art=['Addition','Subtraktion','Multiplikation','Division'][position%4],n=a*b;
 const variante=r.int(0,1);
 const geschichten=[
  [`Im Bus sitzen ${n} Kinder. ${b} steigen ein. Wie viele fahren weiter?`, `Die Klasse sammelt ${n} Bücher. Eine Familie bringt ${b} weitere Bücher. Wie viele sind es jetzt?`],
  [`Ein Regal enthält ${n} Bücher. ${b} werden ausgeliehen. Wie viele bleiben?`, `Am Start stehen ${n} Kinder. ${b} laufen schon los. Wie viele warten noch?`],
  [`In ${a} Kisten liegen jeweils ${b} Bälle. Wie viele sind es zusammen?`, `Jeder von ${a} Tischen braucht ${b} Becher. Wie viele Becher brauchst du?`],
  [`${n} Kinder bilden Gruppen zu je ${b} Kindern. Wie viele Gruppen entstehen?`, `${n} Stifte werden gerecht auf ${b} Kinder verteilt. Wie viele bekommt jedes Kind?`]
 ];
 const i=position%4;
 const einheiten=[['Kinder','Bücher'],['Bücher','Kinder'],['Bälle','Becher'],['Gruppen','Stifte']];
 const wege=[`Zur Anfangsmenge kommt eine zweite Menge hinzu: ${n} + ${b}.`,`Von der Anfangsmenge geht ein Teil weg: ${n} − ${b}.`,`Es gibt ${a} gleich große Mengen mit je ${b} Stück: ${a} · ${b}.`,variante?`Die Gesamtmenge wird gleich verteilt: ${n} : ${b}.`:`Gesucht ist die Anzahl der Gruppen: ${n} : ${b}.`];
 return baue(geschichten[i][variante],[n+b,n-b,n,a][i],einheiten[i][variante],wege[i],['Passende Rechenart gewählt','Wahl aus der Geschichte begründet','Ergebnis mit Einheit'],[],art);}
 }
}
export function zusammenstellen(ziele:Fach[],pflicht:Fach[],umfang:number,seed:number,variante:number){
 if(!ziele.length||pflicht.length>umfang||pflicht.some(f=>!ziele.includes(f)))throw Error('Prüfe Umfang und Pflichtaufgaben.');
 const reihe=[...pflicht,...ziele.filter(f=>!pflicht.includes(f))];
 return Array.from({length:umfang},(_,i)=>blattaufgabe(reihe[i%reihe.length],seed+7919*i+variante*1249,i+seed%4));
}
export type Beleg={tag:string;ziel:string;aufgabe:string;status:'selbst'|'hilfe'|'offen';wiederholung:boolean;ersterVersuch?:boolean;hinweise?:boolean};
export const belegKey='mathe-kompass-lernbelege-v1';
export function belege():Beleg[]{try{const a=JSON.parse(localStorage.getItem(belegKey)??'[]');return Array.isArray(a)?a.filter(b=>b&&typeof b.tag==='string'&&typeof b.aufgabe==='string'&&typeof b.ziel==='string'&&['selbst','hilfe','offen'].includes(b.status)):[];}catch{return [];}}
export function notieren(ziel:string,aufgabe:string,status:Beleg['status'],wiederholung=false,ersterVersuch?:boolean,hinweise?:boolean){try{localStorage.setItem(belegKey,JSON.stringify([...belege(),{tag:new Date().toISOString(),ziel,aufgabe,status,wiederholung,ersterVersuch,hinweise}].slice(-1500)));}catch{}}
export const familienhilfe:Record<Fach,[string,string,string]>={
 zeit:['Wie viele Minuten stecken schon in den ganzen Stunden?','Wie lange ist es von 16:45 bis 17:10 Uhr?','15 + 10 = 25 Minuten.'],
 laenge:['Welche gemeinsame Einheit kannst du verwenden?','Lege ein 20 cm langes und ein 15 cm langes Band hintereinander.','Zusammen sind es 35 cm.'],
 masse:['Wie viele Gramm sind ein Kilogramm?','Auf einer Packung stehen 500 g. Wie schwer sind drei Packungen?','1500 g, also 1 kg 500 g.'],
 addition:['Was kommt aus der Spalte rechts noch dazu?','Lege 28 und 17 Cent zusammen.','28 + 17 = 45 Cent.'],
 subtraktion:['Wo kannst du einen Zehner tauschen?','Du hast 1 Euro und gibst 35 Cent aus.','100 − 35 = 65 Cent.'],
 multiplikation:['Für welchen Stellenwert steht diese Zeile?','Im Eierkarton liegen zwei Reihen zu je fünf Eiern.','2 · 5 = 10 Eier.'],
 division:['Was bedeutet der Rest in dieser Geschichte?','Verteile 14 Stifte auf vier Becher.','Je drei Stifte, zwei bleiben übrig.'],
 daten:['Wie groß ist ein Schritt auf deiner Achse?','Zähle drei Sorten Besteck und zeichne eine Säule je Sorte.','Die Summe der Säulenhöhen muss der Zahl aller gezählten Teile entsprechen.'],
 geometrie:['Welche Strecke führt einmal ganz außen herum?','Miss Länge und Breite eines Buches und berechne seinen Umfang.','Addiere Länge und Breite und verdopple die Summe.'],
 sach:['Was ist gegeben, und was möchtest du wissen?','Zwölf Gäste sitzen an Tischen mit je vier Plätzen. Wie viele Tische braucht ihr?','12 : 4 = 3 Tische.']
};
export function fachZu(text:string):Fach{const s=text.toLowerCase();if(/zeit|minute|stunde/.test(s))return 'zeit';if(/gewich|masse|gramm/.test(s))return 'masse';if(/länge|meter/.test(s))return 'laenge';if(/diagramm|daten/.test(s))return 'daten';if(/geometr|winkel|rechteck/.test(s))return 'geometrie';return faecher.find(f=>s.includes(f))??'sach';}

function lesen(key:string){try{return JSON.parse(localStorage.getItem(key)??'null');}catch{return null;}}
export function lernbelege(){
 const list=belege();
 const main=lesen('mathe-kompass-v1')?.records,lernen=lesen(learningKey)?.records;
 if(Array.isArray(main))for(const r of main){if(typeof r?.prompt==='string'&&typeof r.date==='string')list.push({ersterVersuch:r.attempts===1,hinweise:r.hints>0,tag:r.date,ziel:r.title,aufgabe:r.prompt,status:r.first&&!r.hints?'selbst':r.solved?'hilfe':'offen',wiederholung:false});}
 if(Array.isArray(lernen))for(const r of lernen){if(r?.mode!=='previous'&&Object.hasOwn(skills,r?.skill)&&typeof r.day==='string')list.push({ersterVersuch:r.firstCorrect,hinweise:r.hints>0||r.viewed,tag:r.day+'T12:00:00Z',ziel:skills[r.skill as Skill].name,aufgabe:'Tagestraining · '+skills[r.skill as Skill].name,status:r.solved&&!r.viewed&&r.firstCorrect&&!r.hints?'selbst':r.solved?'hilfe':'offen',wiederholung:false});}
 return list.filter(b=>Number.isFinite(Date.parse(b.tag))).sort((a,b)=>b.tag.localeCompare(a.tag));
}

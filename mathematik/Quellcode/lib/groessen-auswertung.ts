import {aufgabe,fach,richtig,themen,type Aufgabe,type Fach,type Feld,type Thema} from './groessen-training.ts';
import type {Stand} from './groessen-training-stand.ts';
import {fmtNum,rng} from './groessen-core.ts';

export const bereiche=Object.keys(fach) as Fach[];
export type Plan={anzahl:Record<Fach,number>;dezimal:boolean;mehrtaegig:boolean};
export const standardPlan:Plan={anzahl:{laenge:4,masse:4,zeit:4},dezimal:true,mehrtaegig:false};
export function zusammenstellen(plan:Plan,seed:number):Thema[]{
  const zufall=rng(seed);
  const listen=bereiche.map(b=>{
    const pool=(Object.keys(themen) as Thema[]).filter(id=>themen[id][0]===b && (plan.dezimal||id!=='dezimal'&&id!=='fehlerZ') && (plan.mehrtaegig||id!=='kalender'));
    const count=plan.anzahl[b];
    if(!Number.isInteger(count)||count<0||count>12)throw Error('Pro Bereich sind 0 bis 12 Aufgaben möglich.');
    const ids:Thema[]=[];
    // Gewählte Zeit-Schwerpunkte erscheinen auch in kurzen Arbeiten.
    if(b==='zeit'&&plan.mehrtaegig&&count)ids.push('kalender');
    if(b==='zeit'&&plan.dezimal&&count>ids.length)ids.push('dezimal');
    const start=zufall.shuffle(pool.filter(id=>!ids.includes(id)));
    while(ids.length<count)ids.push(...(ids.length+start.length>=count?start.slice(0,count-ids.length):start));
    return ids;
  });
  return Array.from({length:12},(_,i)=>listen.flatMap(l=>l[i]?[l[i]]:[])).flat();
}
export function rundenAufgabe(r:Stand,i:number):Aufgabe{
  const id=r.ids[i],variante=r.version===2?i:0;
  const seed=r.seed+(id==='fahrdreieck'&&r.modus==='uebung'?0:i*7919);
  const a=aufgabe(id,seed,r.umkehr[i],variante);
  if(r.version!==2||r.modus!=='arbeit')return a;
  if(id==='rezept'&&a.bild){
    const [vor,ziel]=a.bild.daten;
    return {...a,felder:[
      {label:'Ansatz',wert:'Zielmasse minus vorhandene Masse',optionen:['Zielmasse plus vorhandene Masse','Zielmasse minus vorhandene Masse','Zielmasse mal vorhandene Masse']},
      {label:'Umrechnung · Zielmasse in g',wert:ziel},
      {label:'Ergebnis · nachzufüllende Menge',wert:ziel-vor},
      {label:'Einheit des Ergebnisses',wert:'g',optionen:['g','kg','mg']}
    ]};
  }
  if(id==='ausflugL'){
    const km=Number(a.felder[0].wert)-0.75;
    return {...a,felder:[{label:'Ansatz',wert:'Teilstrecken addieren',optionen:['Teilstrecken addieren','Teilstrecken multiplizieren','Teilstrecken subtrahieren']},{label:'Umrechnung · 750 m in km',wert:0.75},{label:'Ergebnis · Maßzahl in Kilometern',wert:km+0.75},{label:'Einheit',wert:'km',optionen:['m','km','cm']}]};
  }
  return a;
}
export function punkte(r:Stand,i:number){
  const a=rundenAufgabe(r,i);
  return {erreicht:a.felder.filter((f,j)=>richtig(f,r.antworten[i][j]??'')).length,max:a.felder.length};
}
export function uebungsziele(r:Stand){
  const gesehen=new Set<Thema>();
  return r.ids.map((id,i)=>({id,i,...punkte(r,i)})).filter(x=>x.erreicht<x.max||r.hilfe[x.i]||r.sicherheit?.[x.i]==='geraten')
    .sort((a,b)=>a.erreicht/a.max-b.erreicht/b.max).filter(x=>{if(gesehen.has(x.id))return false;gesehen.add(x.id);return true;}).slice(0,3);
}
export function zwischenschritt(id:Thema,a:Aufgabe,antworten:string[]):{frage:string;feld:Feld;erklaerung:string}{
  const j=a.felder.findIndex((v,i)=>!richtig(v,antworten[i]??''));
  const fehler=a.felder[Math.max(j,0)];
  if(id==='regelM'&&j===2){
    const nachGramm=a.felder[0].wert==='multiplizieren';
    const kg=nachGramm?Number(fehler.wert)/1000:Number(fehler.wert);
    const gramm=Math.round((kg-Math.floor(kg))*1000);
    return {frage:nachGramm?`Betrachte nur den Anteil nach dem Komma. Wie viel sind ${fmtNum(gramm/1000)} kg in Gramm?`:`Wie viele Kilogramm sind die restlichen ${gramm} g?`,feld:{label:nachGramm?'Anteil in g':'Anteil in kg',wert:nachGramm?gramm:gramm/1000},erklaerung:`1 kg enthält 1.000 g. ${fmtNum(gramm/1000)} kg entsprechen ${gramm} g. Addiere jetzt die ganzen Kilogramm in der Zieleinheit.`};
  }
  if(id.startsWith('regel')&&j<2){
    const faktor=Number(a.felder[1].wert),mal=a.felder[0].wert==='multiplizieren';
    return {frage:mal?'Du zerlegst eine große Einheit in kleine Einheiten. Was passiert mit der Anzahl?':'Du bündelst kleine Einheiten zu großen. Was passiert mit der Anzahl?',feld:{label:'Die Anzahl …',wert:mal?'wird größer':'wird kleiner',optionen:['wird größer','wird kleiner']},erklaerung:`Eine große Einheit enthält ${faktor} kleine. Zur kleineren Einheit multiplizierst du mit ${faktor}, zurück teilst du durch ${faktor}.`};
  }
  if(a.bild?.typ==='rezept')return {frage:`Dein Ziel sind ${fmtNum(a.bild.daten[1]/1000)} kg. Wandle zuerst nur das Ziel in Gramm um.`,feld:{label:'Ziel in g',wert:a.bild.daten[1]},erklaerung:`${fmtNum(a.bild.daten[1]/1000)} kg sind ${a.bild.daten[1]} g. Ziehe jetzt die bereits vorhandene Menge ab.`};
  if(a.bild?.typ==='zeitlinie'&&id==='zeitlinie'){const [start]=a.bild.daten;return {frage:'Wie viele Minuten fehlen vom Start bis zur nächsten vollen Stunde?',feld:{label:'Minuten',wert:60-start%60},erklaerung:`Ergänze ${start%60} auf 60. Addiere danach den Weg von der vollen Stunde bis zum Ziel.`};}
  if(a.bild?.typ==='lineal')return {frage:'Wie viele kleine Millimeterabstände ergeben einen Zentimeter?',feld:{label:'Anzahl',wert:10},erklaerung:'Ein Millimeter ist 0,1 cm. Lies beide Enden ab und bilde die Differenz.'};
  if(a.bild?.typ==='skala'){const step=a.bild.daten[0];return {frage:`Zwischen 0 und ${10*step} g liegen zehn Abstände. Wie groß ist einer?`,feld:{label:'Teilstrich in g',wert:step},erklaerung:`Teile ${step*10} g durch zehn. Zähle dann bis zum Zeiger.`};}
  if(a.felder.length>1)return {frage:a.tipp,feld:fehler,erklaerung:`Für „${fehler.label}“ gilt ${typeof fehler.wert==='number'?fmtNum(fehler.wert):fehler.wert}. Prüfe jetzt deinen gesamten Rechenweg.`};
  const bereich=themen[id][0];
  const beispiel={laenge:['Wie viele Zentimeter sind ein halber Meter?',50,'100 cm : 2 = 50 cm.'],masse:['Wie viele Gramm sind ein halbes Kilogramm?',500,'1.000 g : 2 = 500 g.'],zeit:['Wie viele Minuten vergehen von 08:45 bis 09:00 Uhr?',15,'Von Minute 45 bis Minute 60 fehlen 15 Minuten.']} as const;
  const [frage,wert,erklaerung]=beispiel[bereich];
  return {frage,feld:{label:'Deine Antwort',wert},erklaerung:erklaerung+' '+a.tipp};
}

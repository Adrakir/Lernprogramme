import {jsPDF} from 'jspdf';
import {themen,type Aufgabe} from './groessen-training.ts';
import {rundenAufgabe,uebungsziele} from './groessen-auswertung.ts';
import type {Stand} from './groessen-training-stand.ts';
import {fmtNum} from './groessen-core.ts';

const lesbar=(s:string)=>s.replaceAll('①','(1)').replaceAll('②','(2)').replaceAll('③','(3)').replaceAll('→','->').replaceAll('−','-').replaceAll('…','...').replace(/[„“”]/g,'"');
function angaben(a:Aufgabe){
  const text=[a.frage];
  if(a.tabelle)text.push(...a.tabelle.map(row=>row.join('     |     ')));
  if(a.bild?.typ==='skala'){const [s,n]=a.bild.daten;text.push(`Skala: 0 bis ${20*s} g, 20 gleich breite Abstände. Der Zeiger steht am ${n}. Strich nach null.`);}
  if(a.bild?.typ==='lineal'){const [a1,b]=a.bild.daten;text.push(`Lineal: Der Stift reicht vom ${a1}. bis zum ${b}. Millimeterstrich nach null.`);}
  return text.join('\n');
}
export function fehlerblatt(r:Stand){
  const doc=new jsPDF({unit:'mm',format:'a4',compress:true});
  doc.setProperties({title:'MatheKompass – Mein Übungsblatt'});
  let y=28;
  function absatz(s:string,groesse=11,fett=false){
    doc.setFont('helvetica',fett?'bold':'normal');doc.setFontSize(groesse);doc.setTextColor(27,48,67);
    const lines:string[]=doc.splitTextToSize(lesbar(s),172);
    for(const line of lines){if(y>274){doc.addPage();y=25;}doc.text(line,19,y);y+=groesse*0.46;}y+=2;
  }
  function kopf(t:string,unter:string){doc.setFillColor(22,81,88);doc.rect(0,0,210,6,'F');y=23;absatz(t,19,true);absatz(unter,10);}
  const ziele=uebungsziele(r);
  const material=ziele.map(({id,i})=>{
    const alt=rundenAufgabe(r,i);
    let neu=alt;
    for(let k=1;k<=40;k++){neu=rundenAufgabe({...r,seed:r.seed+k*104729},i);if(JSON.stringify(neu)!==JSON.stringify(alt)&&neu.frage!==alt.frage)break;}
    return {id,i,alt,neu};
  });
  if(!material.length){kopf('Alle Aufgaben sicher gelöst','Für diese Runde sind keine Übungsziele offen.');return doc;}
  material.forEach(({id,i,alt,neu},nr)=>{
    if(nr)doc.addPage();kopf('Mein persönliches Übungsblatt',`Lernziel ${nr+1} von ${material.length}  ·  ${themen[id][1]}`);
    absatz('1   Meine Aufgabe',13,true);absatz(angaben(alt));absatz('Meine Antworten',11,true);
    alt.felder.forEach((f,j)=>absatz(f.label+': '+(r.antworten[i][j]||'offen'),10));
    absatz('So geht der Rechenweg',12,true);absatz(alt.weg);
    absatz('2   Jetzt probiere ich es selbst',13,true);absatz(angaben(neu));
    neu.felder.forEach(f=>{absatz(f.label+(f.optionen?' ('+f.optionen.join(' / ')+')':'')+': __________________',10);});
  });
  doc.addPage();kopf('Lösungen zur Nachübung','Vergleiche erst, wenn du die neue Aufgabe selbst gelöst hast.');
  material.forEach(({id,neu},nr)=>{absatz((nr+1)+'   '+themen[id][1],13,true);absatz(neu.weg);neu.felder.forEach(f=>absatz(f.label+': '+(typeof f.wert==='number'?fmtNum(f.wert):f.wert),10));});
  const count=doc.getNumberOfPages();for(let p=1;p<=count;p++){doc.setPage(p);doc.setFontSize(9);doc.setTextColor(65,85,99);doc.text('MatheKompass · Klasse 5',19,288);doc.text(p+' / '+count,191,288,{align:'right'});}
  return doc;
}

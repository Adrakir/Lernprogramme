import {jsPDF} from 'jspdf';
import {aufgabe,raster,zeilen,namen,type Ziel} from './multiplikation.ts';
import {kurz} from './addition.ts';
export function malheft(ziele:Ziel[],seed:number){
 const doc=new jsPDF(),pool:Ziel[]=ziele.length?ziele:['raster','zerlegen','geschichte'];
 const tasks=Array.from({length:3},(_,i)=>{const t=pool[i%pool.length];return t==='raster'?raster([1,3,5][i],seed+i):aufgabe(t,seed+i);});
 const clean=(s:string)=>s.replaceAll('□','[ ]').replaceAll('−','-');
 function text(s:string,y:number,size=11,bold=false){doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);const lines=doc.splitTextToSize(clean(s),176);doc.text(lines,16,y);return y+lines.length*size*.43+2;}
 for(const loesung of [false,true]){
  if(loesung)doc.addPage();text(loesung?'Lösungen und Rechenwege':'Multiplikation im Heft',20,20,true);
  text(loesung?'Prüfe zunächst die Teilprodukte, dann das Ergebnis.':'Name __________________________    Datum _______________',31);
  tasks.forEach((a,i)=>{let y=44+80*i;y=text((i+1)+'. '+namen[a.ziel],y,13,true);y=text(a.frage,y);
   if(loesung)y=text(a.weg,y);
   if(a.ziel==='raster'||a.ziel==='nullstelle'){
    if(!loesung&&i===2){text('Zeichne das Raster selbst. Beschrifte die Teilprodukte und addiere.',y);return;}
    const [x,b]=a.zahlen,reihen=zeilen(x,b),cols=String(x*b).length;doc.setFontSize(9);y+=3;
    if(loesung||i===0)for(let c=0;c<cols;c++)doc.text(kurz[cols-c-1],60+c*9,y);
    for(const [j,row] of [...reihen.map(r=>({label:x+' · '+r.faktor,n:r.wert})),{label:'Produkt',n:x*b}].entries()){
     const top=y+2+j*8;if(loesung||i===0)doc.text(row.label,18,top+5.5);
     for(let c=0;c<cols;c++){doc.rect(58+c*9,top,9,8);if(loesung)doc.text(String(row.n).at(c-cols)??'',60+c*9,top+5.5);}
    }
   }else if(!loesung){
    if(a.ziel==='probe')y=text('Karten: '+a.zahlen.join('   |   ')+'       ____ : ____ = ____',y);
    if(i===0)y=text('Tipp: '+a.tipp,y,10);
    for(const f of a.schritte[0].felder)y=text(f.label+': ____________________',y,10);
    if(['geschichte','vergleich'].includes(a.ziel))text('Mein Satz: __________________________________________',y,10);
   }
  });
 }
 return doc;
}

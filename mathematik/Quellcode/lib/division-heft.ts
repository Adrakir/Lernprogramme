import {jsPDF} from 'jspdf';
import {aufgabe,raster,rechenweg,namen,type Ziel} from './division.ts';
export function divisionsheft(ziele:Ziel[],seed:number){
 const doc=new jsPDF(),pool:Ziel[]=ziele.length?ziele:['raster','nullstelle','geschichte'];
 const tasks=Array.from({length:3},(_,i)=>{const t=pool[i%pool.length];return t==='raster'?raster([1,2,5][i],seed+i):aufgabe(t,seed+i);});
 function text(s:string,y:number,size=11,bold=false){doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);const lines=doc.splitTextToSize(s.replaceAll('□','[ ]').replaceAll('−','-'),176);doc.text(lines,16,y);return y+lines.length*size*.43+2;}
 for(const loesung of [false,true]){
  if(loesung)doc.addPage();text(loesung?'Lösungen und Rechenwege':'Division im Heft',20,20,true);
  text(loesung?'Kontrolliere mit Quotient mal Divisor plus Rest.':'Name ________________________    Datum _______________',31);
  tasks.forEach((a,i)=>{let y=44+81*i;y=text((i+1)+'. '+namen[a.ziel],y,13,true);y=text(a.frage,y);
   if(loesung)y=text(a.weg,y);
   if(a.ziel==='raster'||a.ziel==='nullstelle'){
    if(!loesung&&i===2){text('Lege die Rechnung im Heft an und ergänze die Probe.',y);return;}
    if(!loesung)y=text('Quotient __________   Rest ______',y);
    const [n,d]=a.zahlen,rows=rechenweg(n,d);doc.setFontSize(9);
    const labels=['Teilzahl','Quotientenziffer','Vielfaches','Rest'];
    if(i===0||loesung){labels.forEach((h,j)=>doc.text(h,18+j*38,y+4));y+=6;}
    rows.forEach((row,k)=>[row.teil,row.q,row.produkt,row.rest].forEach((v,j)=>{doc.rect(16+j*38,y+k*7,38,7);if(loesung)doc.text(String(v),18+j*38,y+k*7+5);}));
   }else if(!loesung){
    if(a.ziel==='luecke')y=text('Erkläre auch, was bei 7 : 0 passiert.',y);
    if(a.ziel==='probe')y=text('Zahlenkarten: '+a.zahlen.join(' | ')+'      ____ · ____ + ____ = ____',y);
    if(i===0)y=text('Tipp: '+a.tipp,y,10);
    for(const f of a.schritte[0].felder)y=text(f.label+': ____________________',y,10);
    if(['geschichte','vergleich'].includes(a.ziel))text('Meine Erklärung: _____________________________________',y,10);
   }
  });
 }
 return doc;
}

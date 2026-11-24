import {jsPDF} from 'jspdf';
import type {Blattaufgabe} from './lernatelier.ts';
export function unterrichtsheft(tasks:Blattaufgabe[],name:string,heft=false){
 const doc=new jsPDF(),clean=(s:string)=>s.replaceAll('−','-');
 function absatz(s:string,y:number,size=11,bold=false){doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);const lines=doc.splitTextToSize(clean(s),177);doc.text(lines,16,y);return y+lines.length*size*.46+2;}
 function zeichnung(a:Blattaufgabe,y:number,stufe:number,loesung:boolean){
  const x=27,boden=y+45;doc.setLineWidth(.2);doc.setDrawColor(120);
  if(a.fach==='daten'){
   const max=Math.max(...a.werte),skala=36/max;
   if(stufe<2||loesung){doc.line(x,boden,x+86,boden);doc.line(x,boden,x,y+3);}
   if(!stufe||loesung){doc.setFontSize(8);doc.text('Kinder',x-9,y+1);for(let n=0;n<=max;n++){doc.line(x-1,boden-n*skala,x+1,boden-n*skala);doc.text(String(n),x-3,boden-n*skala+1,{align:'right'});}
    a.werte.forEach((v,i)=>{doc.text(['Rad','Bus','zu Fuß'][i],x+9+25*i,boden+5);if(loesung||i===0)doc.rect(x+8+25*i,boden-v*skala,12,v*skala);});}
   if(stufe===2&&!loesung)doc.rect(16,y,177,53);
  }else{
   const [l,b]=a.werte;
   if(!stufe||loesung){doc.rect(x,y+3,l*5,b*5);doc.setFontSize(9);doc.text(l+' cm',x+l*2.5,y+2);if(loesung)doc.text(b+' cm',x+l*5+2,y+b*2.5);}
   else if(stufe===1){doc.line(x,y+4,x+l*5,y+4);doc.line(x,y+4,x,y+10);}else doc.rect(16,y,177,52);
   doc.setFontSize(9);doc.text('Zeichenmaßstab 1 : 2 (1 cm Länge entspricht 5 mm auf dem Blatt).',16,boden+7);
  }
  doc.setDrawColor(40);
 }
 for(const loesung of [false,true]){
  tasks.forEach((a,i)=>{if(i%2===0){if(i||loesung)doc.addPage();absatz(name+(loesung?' · Erwartungshorizont':''),18,17,true);absatz(loesung?'Je erfülltem Kriterium ein Punkt.':'Name ________________________     Datum ______________',29);}
   let y=43+i%2*121;y=absatz((i+1)+'. '+(heft?['Am Modell arbeiten','Mit weniger Hilfe zeichnen','Im freien Feld zeichnen'][i]:'Aufgabe'),y,12,true);
   y=absatz(a.text,y);
   if(loesung){y=absatz((a.art?a.art+'. ':'')+a.weg+' Ergebnis: '+a.antwort+' '+a.einheit+'.',y);y=absatz(a.kriterien.join(' / ')+' ('+a.kriterien.length+' Punkte)',y,9);}
   if(a.fach==='geometrie'||a.fach==='daten'){zeichnung(a,y+3,heft?i:2,loesung);}
   else if(a.fach==='multiplikation'){
    const [x,b]=a.werte,werte=[x,b,x*(b%10),x*(b-b%10),x*b];
    const titel=['Faktor 1','Faktor 2','Einer-Teilprodukt','Zehner-Teilprodukt','Gesamtprodukt'];
    titel.forEach((label,j)=>{
      doc.setFontSize(9);doc.text(label,16,y+j*8+6);
      for(let k=0;k<6;k++){
        doc.rect(64+k*9,y+j*8,9,8);
        const ziffer=String(werte[j]).at(k-6);
        if(loesung&&ziffer)doc.text(ziffer,68+k*9,y+j*8+6);
      }
    });
   }else if(a.fach==='zeit'){
    const [stunde,minute]=a.werte,marken=[22,22+145*15/(15+minute),167];
    doc.line(22,y+17,167,y+17);
    marken.forEach((x,j)=>{doc.line(x,y+14,x,y+20);if(loesung)doc.text([stunde+':45',(stunde+1)+':00',(stunde+1)+':'+minute][j],x,y+26);});
    if(loesung){doc.text('15 min',26,y+11);doc.text(minute+' min',marken[1]+4,y+11);}
   }else if(!loesung){if(a.art)y=absatz('Meine Rechenart und Begründung:',y,10);for(let k=0;k<4;k++)doc.line(16,y+10+k*10,191,y+10+k*10);}
  });
 }
 return doc;
}

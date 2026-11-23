import {uebungsgrund} from './werkstattstand.ts';
import {jsPDF} from 'jspdf';
import {aufgabe,kurz,namen,raster,rechenweg,type Ziel} from './subtraktion.ts';

export function subtraktionsheft(ziele:Ziel[],seed:number){
  const pdf=new jsPDF(),pool:Ziel[]=ziele.length?ziele:['raster','nullkette','geschichte'];
  pdf.setProperties({title:'MatheKompass · Subtraktion im Heft'});
  const tasks=Array.from({length:3},(_,i)=>{
    const ziel=pool[i%pool.length],s=seed+i*7919;
    if(ziel==='raster'||ziel==='nullkette')return {titel:ziel==='raster'?'Stellenrichtig abziehen':'Über Nullen entbündeln',z:raster(ziel==='nullkette'?4:i+1,s)};
    return {titel:namen[ziel],task:aufgabe(ziel,s)};
  });
  const clean=(s:string)=>s.replaceAll('−','-').replaceAll('□','[ ]');
  function line(s:string,y:number,bold=false,size=11){pdf.setFont('helvetica',bold?'bold':'normal');pdf.setFontSize(size);const lines=pdf.splitTextToSize(clean(s),178);pdf.text(lines,16,y);return y+lines.length*size*.42+2;}
  function grid(z:[number,number],y:number,labels:boolean,solved:boolean){
    const cols=rechenweg(...z),w=9,x=51;
    for(let i=0;i<=cols.length;i++)pdf.line(x+i*w,y,x+i*w,y+4*w);
    for(let j=0;j<=4;j++)pdf.line(x,y+j*w,x+cols.length*w,y+j*w);
    pdf.setFontSize(9);
    if(labels)['Zahl 1','- Zahl 2','Verfügbar','Differenz'].forEach((v,j)=>pdf.text(v,18,y+j*w+6));
    cols.forEach((c,i)=>{const left=x+(cols.length-1-i)*w+2;if(labels)pdf.text(kurz[i],left,y-1);
      if(solved)[String(z[0]).at(-i-1),String(z[1]).at(-i-1),String(c.verfuegbar),String(c.rest)].forEach((v,j)=>{if(v)pdf.text(v,left,y+j*w+6);});});
  }
  for(const loesung of [false,true]){
    if(loesung)pdf.addPage();line(loesung?'Lösungen und Rechenwege':'Subtraktion im Heft',20,true,20);
    line(loesung?'Vergleiche auch deine Zwischenschritte.':'Name ______________________     Datum ______________',31);
    tasks.forEach(({titel,z,task},i)=>{
      let y=43+80*i;y=line((i+1)+'. '+titel,y,true,13);
      if(!loesung)y=line(uebungsgrund(pool[i%pool.length],!!ziele.length,titel),y,false,9);
      if(z){const [a,b]=z;y=line(a+' − '+b+' = '+(loesung?String(a-b):'________'),y);
        if(loesung||i<2){y=line(loesung?'Verfügbar zeigt die obere Menge beim Bearbeiten jeder Spalte.':i===0?'Ordne die Zahlen ein und entbündle von rechts nach links.':'Beschrifte das Raster selbst und rechne.',y);grid(z,y+3,loesung||i===0,loesung);}
        else line('Zeichne dein eigenes Raster im Heft. Prüfe mit Addition.',y);
      }else if(task){
        if(loesung){line(task.weg,y);return;}
        y=line(task.frage,y);
        if(task.t==='probe')y=line('Zahlenkarten: '+task.zahlen.join('  |  ')+'       ____ + ____ = ____',y);
        if(i===0)y=line('Tipp: '+task.tipp,y);
        for(const f of task.felder)y=line(f.label+': ____________________',y,false,10);
        if(['strategie','vergleich','geschichte','sprung','ergaenzen'].includes(task.t))line('Mein Rechenweg oder Antwortsatz: ____________________',y,false,10);
      }
    });
  }
  return pdf;
}

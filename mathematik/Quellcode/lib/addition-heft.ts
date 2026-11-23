import {uebungsgrund} from './werkstattstand.ts';
import {jsPDF} from 'jspdf';
import {aufgabe,kurz,namen,rasterAufgabe,spalten,type Thema} from './addition.ts';
import {fmtNum as f} from './groessen-core.ts';
export type Ziel='raster'|'raster3'|Thema;
export function additionsheft(ziele:Ziel[],seed:number){
  const doc=new jsPDF({unit:'mm',format:'a4'}),rngSeed=seed%1000000;
  doc.setProperties({title:'MatheKompass – Addition im Heft'});
  const pool=ziele.length?ziele:['raster' as const];
  const tasks=Array.from({length:3},(_,i)=>{
    const ziel=pool[i%pool.length];
    const a=ziel==='raster'||ziel==='raster3'?null:aufgabe(ziel,rngSeed+7919*(i+1));
    let zahlen=rasterAufgabe(ziel==='raster3'?5:i+1,rngSeed+101*i);
    if(a){const [x,y]=a.zahlen;switch(a.thema){
      case 'sprung':case 'ausgleich':case 'fehler':case 'probe':case 'nullen':case 'geschichte':zahlen=[x,y];break;
      case 'paare':zahlen=a.zahlen;break;
      case 'groessen':zahlen=[100+Number(a.felder[1].wert)+15,85];break;
      case 'luecke':zahlen=[Number(a.felder[2].wert),286];break;
      case 'schaetzen':zahlen=[Number(a.felder[2].wert)-2146,2146];break;
      case 'vergleich':zahlen=[Number(a.felder[4].wert)-236,236];break;
      case 'strategie':zahlen=[Number(a.felder[1].wert)-3586,3586];break;
    }}
    return {ziel,zahlen,a};
  });
  const sauber=(s:string)=>s.replaceAll('−','-').replaceAll('□','[ ]').replaceAll('→','->').replace(/[„“]/g,'"');
  const text=(s:string,x:number,y:number,size=11,bold=false)=>{doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);doc.setTextColor(27,46,58);doc.text(sauber(s),x,y);};
  function block(s:string,y:number){doc.setFont('helvetica','normal');doc.setFontSize(10);const lines:string[]=doc.splitTextToSize(sauber(s),174);doc.text(lines,18,y);return y+lines.length*4.4+2;}
  function raster(z:number[],y:number,labels:boolean,loesung:boolean){
    const c=spalten(z),size=7.5,x=35,n=c.length,rows=z.length+2;
    if(labels)c.forEach((_,i)=>text(kurz[i],x+(n-i-1)*size+1,y-1,8,true));
    doc.setDrawColor(127,145,151);doc.setLineWidth(.2);
    for(let i=0;i<=n;i++)doc.line(x+i*size,y,x+i*size,y+rows*size);
    for(let j=0;j<=rows;j++)doc.line(x,y+j*size,x+n*size,y+j*size);
    if(labels){text('+',x-5,y+(z.length-1)*size+5,10);text('Übertrag',10,y+z.length*size+5,8);text('Summe',11,y+(z.length+1)*size+5,8);}
    if(loesung)c.forEach((v,i)=>{const xx=x+(n-i-1)*size+2;z.forEach((zahl,j)=>{if(String(zahl).length>i)text(String(v.ziffern[j]),xx,y+j*size+5);});if(v.eingang)text(String(v.eingang),xx,y+z.length*size+5,8,true);text(String(v.ziffer),xx,y+(z.length+1)*size+5,11,true);});
    return y+rows*size+6;
  }
  text('Addition im Heft',18,19,21,true);text('Drei Nachübungen · Name ____________________',18,28);
  let y=39;
  tasks.forEach(({ziel,zahlen,a},i)=>{
    text((i+1)+'. '+(a?namen[a.thema]:ziel==='raster3'?'Drei Summanden':'Stellenrichtig addieren'),18,y,13,true);y+=6;
    y=block(uebungsgrund(ziel,!!ziele.length,a?namen[a.thema]:'Stellenrichtig rechnen'),y);if(a)y=block(a.frage,y);
    y=block((a?.thema==='luecke'?'Ergänze zuerst die Lücke. Überprüfe anschließend schriftlich.':zahlen.map(n=>f(n)).join(' + ')+' = __________')+' '+['Trage die Zahlen in das beschriftete Raster ein.','Ordne die Stellen im leeren Raster selbst zu.','Lege die Rechnung selbst im Heft an.'][i],y);
    if(i<2)y=raster(zahlen,y+4,i===0,false);else{doc.line(18,y+5,187,y+5);y+=12;}y+=4;
  });
  doc.addPage();text('Lösungen und Überträge',18,20,20,true);y=32;
  tasks.forEach(({zahlen,a},i)=>{text((i+1)+'. '+zahlen.map(n=>f(n)).join(' + ')+' = '+f(zahlen.reduce((s,n)=>s+n,0)),18,y,12,true);y+=6;if(a)y=block(a.weg,y);y=raster(zahlen,y+4,true,true)+5;});
  return doc;
}

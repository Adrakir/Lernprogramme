import {rng,roundTo,parseAnswer,fmt} from './math.ts';
import {shuffled} from './tasks.ts';
export const testSections=['Zahlenstrahlen','Große Zahlen runden','Rundungsstellen','Zahlen ordnen','Rundungsgrenzen','Daten und Diagramme'];
export const testSectionPoints=[10,10,6,6,4,28];
export type InteractiveTest=ReturnType<typeof makeInteractiveTest>;
export type TestCheck={id:string;section:number;points:number;correct:boolean;solution:string};
export function makeInteractiveTest(version:number){
 if(!Number.isInteger(version)||version<1||version>20)throw Error('Unbekannter Test');
 const r=rng(version*1319),int=(a:number,b:number)=>a+Math.floor(r()*(b-a+1));
 const start=version<=10?version*200000:623123000+(version-11)*1000000,step=version<=10?(version%2?20000:10000):(version%2?25:50);
 const missing=[2,4,7,9,12,14],given=[0,5,10,15],targets=[2,6,10,13].map(i=>start+400000+i*step);
 const rounds=[{n:673482+(version-1)*17329,place:3},{n:5438761+(version-1)*31987,place:4},{n:74651209+(version-1)*731923,place:5},{n:318749501+(version-1)*1325977,place:6},{n:946283714-(version-1)*5173211,place:7}];
 const places=shuffled([{n:4573821+(version-1)*10000000,place:4,name:'Zehntausender'},{n:68491230+(version-1)*1000000,place:6,name:'Millionen'},{n:927641+(version-1)*10000,place:3,name:'Tausender'}],version*77);
 const sort=shuffled([8405090,8450009,805490,8045900,80450900,8405900].map(n=>n+(version-1)*100),version*31);
 const boundary=1200+(version-1)*300,rankValues=shuffled([19,27,32,36,42,49].map(n=>(n+version-1)*1000),version*17);
 const animals=['Elefant','Giraffe','Nashorn','Zebra','Kamel','Bison'].map((name,i)=>({name,n:rankValues[i]+int(-400,400),rounded:rankValues[i],rank:1+rankValues.filter(n=>n>rankValues[i]).length}));
 const pairs=animals.flatMap((a,i)=>animals.slice(i+1).map(b=>({a:a.name,b:b.name,difference:Math.abs(a.rounded-b.rounded)})));
 return{version,start,step,missing,given,targets,markStart:start+400000,rounds,places,sort,boundary,animals,pairs,points:64};
}
export const roundingNames:Record<number,string>={2:'Hunderter',3:'Tausender',4:'Zehntausender',5:'Hunderttausender',6:'Millionen',7:'Zehnmillionen'};
export function validChartScale(test:InteractiveTest,raw:string){const n=parseAnswer(raw),max=Math.max(...test.animals.map(a=>a.rounded));return n!==null&&n>0&&n*10>=max&&n<=max/2;}
export function testCheckLabel(t:InteractiveTest,id:string){
 if(id.startsWith('line-'))return `Beschriftung bei Teilstrich ${Number(id.slice(5))+1}`;
 if(id.startsWith('mark-'))return `Markierung ${fmt(Number(id.slice(5)))}`;
 if(id.startsWith('round-'))return `Rundung ${String.fromCharCode(97+Number(id.slice(6)))}`;
 if(id.startsWith('place-'))return `Rundungsstelle ${Number(id.slice(6))+1}`;
 if(id.startsWith('sort-'))return `Reihenfolge, Platz ${Number(id.slice(5))+1}`;
 const labels:Record<string,string>={lower:'Kleinste Zahl',upper:'Größte Zahl','scale-v':'Skala des Säulendiagramms','scale-h':'Skala des Balkendiagramms',difference:'Unterschied der Futtermengen',pair:'Tiergruppen mit kleinstem Unterschied'};
 if(labels[id])return labels[id];
 const [prefix,index]=id.split('-'),name=t.animals[Number(index)]?.name||'';
 return ({animal:'Gerundete Menge',rank:'Rang',vertical:'Säule',horizontal:'Balken'} as Record<string,string>)[prefix]+' '+name;
}
export function checkInteractiveTest(t:InteractiveTest,a:Record<string,string>):TestCheck[]{
 const out:TestCheck[]=[];
 const numeric=(id:string,section:number,answer:number,points=1,solution=fmt(answer))=>out.push({id,section,points,correct:parseAnswer(a[id]||'')===answer,solution});
 t.missing.forEach(i=>numeric('line-'+i,0,t.start+i*t.step,1,`Beschriftung bei Teilstrich ${i+1}: ${fmt(t.start+i*t.step)}.`));
 t.targets.forEach(n=>numeric('mark-'+n,0,(n-t.markStart)/t.step,1,`${fmt(n)}: ${(n-t.markStart)/t.step} Abstände rechts vom Anfang.`));
 t.rounds.forEach((q,i)=>numeric('round-'+i,1,roundTo(q.n,q.place),2,`${fmt(q.n)} ≈ ${fmt(roundTo(q.n,q.place))} (auf ${roundingNames[q.place]}).`));
 t.places.forEach((q,i)=>out.push({id:'place-'+i,section:2,points:2,correct:a['place-'+i]===q.name,solution:q.name}));
 const sorted=[...t.sort].sort((a,b)=>a-b),order=(a.order||'').split(',').map(Number);
 sorted.forEach((n,i)=>out.push({id:'sort-'+i,section:3,points:1,correct:order[i]===n,solution:`Platz ${i+1}: ${fmt(n)}`}));
 numeric('lower',4,t.boundary-50,2,`Kleinste Zahl: ${fmt(t.boundary-50)}.`);numeric('upper',4,t.boundary+49,2,`Größte Zahl: ${fmt(t.boundary+49)}.`);
 t.animals.forEach((q,i)=>{numeric('animal-'+i,5,q.rounded,1,`${q.name} gerundet: ${fmt(q.rounded)} kg.`);numeric('rank-'+i,5,q.rank,1,`${q.name}: Rang ${q.rank}.`);for(const [prefix,axis] of [['vertical-','scale-v'],['horizontal-','scale-h']])out.push({id:prefix+i,section:5,points:1,correct:validChartScale(t,a[axis]||'')&&parseAnswer(a[prefix+i]||'')===q.rounded,solution:`${prefix==='vertical-'?'Säule':'Balken'} ${q.name}: ${fmt(q.rounded)} kg mit sinnvoller Skala.`});});
 for(const k of ['scale-v','scale-h'])out.push({id:k,section:5,points:1,correct:validChartScale(t,a[k]||''),solution:`Die Skala braucht zehn gleich große Schritte, deckt den größten Wert ab und nutzt mindestens zwei Schritte. Zum Beispiel ${fmt(Math.ceil(Math.max(...t.animals.map(x=>x.rounded))/10000)*1000)} kg je Schritt.`});
 numeric('difference',5,Math.abs(t.animals[0].rounded-t.animals[3].rounded),1,`Unterschied ${t.animals[0].name} / ${t.animals[3].name}: ${fmt(Math.abs(t.animals[0].rounded-t.animals[3].rounded))} kg.`);
 const pair=t.pairs.find(p=>p.a+' / '+p.b===a.pair),minimum=Math.min(...t.pairs.map(p=>p.difference));
 out.push({id:'pair',section:5,points:1,correct:!!pair&&pair.difference===minimum,solution:t.pairs.filter(p=>p.difference===minimum).map(p=>`${p.a} und ${p.b}: ${fmt(p.difference)} kg Unterschied.`).join(' ')});
 return out;
}

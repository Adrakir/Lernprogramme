import {curriculumProblem,type ShapeSpec} from './curriculum.ts';
import { expandedProblem,shuffled } from './tasks.ts';
export type Topic = 'data'|'numbers'|'round'|'mental'|'line'|'units'|'stats'|'arithmetic'|'divisibility'|'geometry'|'measure'|'fractions'|'decimals';
export type Plot = {values:number[];labels:string[];scale:number;unit:string;horizontal?:boolean;title?:string;maxValue?:number};
export type LineSpec = {start:number;step:number;steps:number;point?:number;hidden?:number[]};
export type Problem = {id:string; topic:Topic; title:string; prompt:string; expression?:string; answer:number|string; hints:string[]; solution:string[]; type?:'choice'|'chart'|'tally'|'place'|'multi'|'build-chart'|'tally-build'|'line-place'; options?:string[]; values?:number[]; labels?:string[]; scale?:number; unit?:string; n?:number; place?:number; error?:string; horizontal?:boolean; chartTitle?:string; charts?:Plot[]; line?:LineSpec; fields?:string[]; raw?:string[]; table?:{headers:string[];rows:(string|number)[][]}; decimal?:boolean; pie?:{labels:string[];values:number[]}; skill?:string;shape?:ShapeSpec;work?:{a:number;b:number;op:string}};
export const fmt=(n:number)=>n.toLocaleString('de-DE');
export const places=['E','Z','H','T','ZT','HT','M','ZM','HM','Mrd'];
export const placeNames=['Einer','Zehner','Hunderter','Tausender','Zehntausender','Hunderttausender','Millionen','Zehnmillionen','Hundertmillionen','Milliarden'];
export const roundTo=(n:number,p:number)=>Math.floor((n+Math.pow(10,p)/2)/Math.pow(10,p))*Math.pow(10,p);
export function parseAnswer(s:string):number|null {
 const t=s.trim(); if(!t)return null;
 if(!/^(?:\d+|\d{1,3}(?:\.\d{3})+|\d{1,3}(?:[ \u00a0\u202f]\d{3})+)$/.test(t))return null;
 const n=Number(t.replace(/[. \u00a0\u202f]/g,''));return Number.isSafeInteger(n)?n:null;
}
export function parseValue(s:string,decimal=false):number|null {if(!decimal)return parseAnswer(s);const parts=s.trim().split(',');if(parts.length>2||parts.length===2&&!/^\d{1,6}$/.test(parts[1]))return null;const whole=parseAnswer(parts[0]);return whole===null?null:whole+(parts[1]?Number('0.'+parts[1]):0);}
export function isComplete(p:Problem,v:string){if(p.type==='choice')return !!p.options?.includes(v);if(p.fields)return v.split('|').length===p.fields.length&&v.split('|').every(s=>parseValue(s,!!p.decimal)!==null);return typeof p.answer==='number'?parseValue(v,!!p.decimal)!==null:!!v;}
export function correct(p:Problem,v:string){if(p.fields){const a=String(p.answer).split('|').map(Number),b=v.split('|').map(s=>parseValue(s,!!p.decimal));return a.length===b.length&&a.every((n,i)=>b[i]!==null&&Math.abs(n-b[i]!)<1e-8);}const n=parseValue(v,!!p.decimal);return typeof p.answer==='number'?n!==null&&Math.abs(n-p.answer)<1e-8:v===p.answer;}
export function rng(seed:number){let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function below1000(n:number):string {
 const ones=['','ein','zwei','drei','vier','fünf','sechs','sieben','acht','neun'];
 const small=['null','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf','dreizehn','vierzehn','fünfzehn','sechzehn','siebzehn','achtzehn','neunzehn'];
 let s='';if(n>=100){s=ones[Math.floor(n/100)]+'hundert';n%=100;}if(!n)return s;
 if(n<20)return s+small[n];const tens=['','','zwanzig','dreißig','vierzig','fünfzig','sechzig','siebzig','achtzig','neunzig'];return s+(n%10?ones[n%10]+'und':'')+tens[Math.floor(n/10)];
}
export function numberWord(n:number):string {
 if(n===0)return 'null';let s='';
 for(const [v,singular,plural] of [[1e15,'eine Billiarde','Billiarden'],[1e12,'eine Billion','Billionen'],[1e9,'eine Milliarde','Milliarden'],[1e6,'eine Million','Millionen']] as [number,string,string][]){const c=Math.floor(n/v);if(c){s+=(s?' ':'')+(c===1?singular:below1000(c)+' '+plural);n%=v;}}
 const t=Math.floor(n/1000);if(t){s+=(s?' ':'')+(t===1?'ein':below1000(t).replace(/eins$/,'ein'))+'tausend';n%=1000;s+=n?below1000(n):'';}else if(n)s+=(s?' ':'')+below1000(n);return s;
}
export const modes:Record<string,string>={mix:'Alles gemischt',add:'Plus & Minus',mul:'Mal & Geteilt',order:'Punkt vor Strich',bracket:'Klammern',smart:'Clever rechnen'};
export function mentalProblem(seed:number,level:number,mode='mix'):Problem{
 const r=rng(seed),int=(a:number,b:number)=>a+Math.floor(r()*(b-a+1));
 let m=mode==='mix'?['add','mul','order','bracket','smart'][int(0,4)]:mode;
 const a=int(2,level===1?9:level===2?15:25),b=int(2,9),c=int(2,9),d=int(2,6);
 let ex='',ans=0,h:string[]=[],sol:string[]=[];let error='Rechenweg';
 if(m==='add'){
  const x=int(level===1?10:100,level===1?75:level===2?800:1800),y=int(11,level===1?24:level===2?99:399),minus=r()<.5;
  const aa=minus?x+y:x;ex=`${fmt(aa)} ${minus?'−':'+'} ${fmt(y)}`;ans=minus?x:x+y;
  const tens=Math.floor(y/10)*10,ones=y%10;const mid=minus?aa-tens:aa+tens;
  h=['Zerlege die zweite Zahl in Zehner und Einer.',`Rechne zuerst ${fmt(aa)} ${minus?'−':'+'} ${fmt(tens)}.`];
  sol=[`${fmt(aa)} ${minus?'−':'+'} ${fmt(tens)} = ${fmt(mid)}`,`${fmt(mid)} ${minus?'−':'+'} ${ones} = ${fmt(ans)}`];
 }else if(m==='mul'){
  const x=level===1?a:level===2?a*10:a*10+int(1,9),div=r()<.5;
  ex=div?`${fmt(x*b)} : ${b}`:`${fmt(x)} · ${b}`;ans=div?x:x*b;
  h=div?['Nutze die Umkehraufgabe: Teilen und Malnehmen gehören zusammen.',`${b} · welche Zahl ergibt ${fmt(x*b)}?`]:['Zerlege den ersten Faktor in einfache Teile.',`${fmt(x)} = ${Math.floor(x/10)*10} + ${x%10}. Multipliziere beide Teile mit ${b}.`];
  sol=div?[`${b} · ${fmt(x)} = ${fmt(x*b)}`,`${fmt(x*b)} : ${b} = ${fmt(x)}`]:[`${Math.floor(x/10)*10} · ${b} + ${x%10} · ${b} = ${Math.floor(x/10)*10*b} + ${x%10*b}`,`${ex} = ${fmt(ans)}`];
 }else if(m==='order'){
  const variant=int(0,level===3?3:2);error='Reihenfolge';
  if(variant===0){ex=`${a} + ${b} · ${c}`;ans=a+b*c;sol=[`${b} · ${c} = ${b*c}`,`${a} + ${b*c} = ${ans}`];h=['Mal und Geteilt rechnest du vor Plus und Minus.',`Beginne mit ${b} · ${c}.`];}
  else if(variant===1){ex=`${a*b} : ${b} + ${c}`;ans=a+c;sol=[`${a*b} : ${b} = ${a}`,`${a} + ${c} = ${ans}`];h=['Die Division kommt vor der Addition.',`Beginne mit ${a*b} : ${b}.`];}
  else if(variant===2){ex=`${a*b} : ${b} · ${c}`;ans=a*c;sol=[`${a*b} : ${b} = ${a}`,`${a} · ${c} = ${ans}`];h=['Mal und Geteilt sind gleichrangig. Rechne von links nach rechts.',`Teile zuerst ${a*b} durch ${b}.`];}
  else {ex=`${a} · ${b} − ${c*d} : ${d}`;ans=a*b-c;if(ans<0)return mentalProblem(seed+1701,level,mode);sol=[`${a} · ${b} = ${a*b}; ${c*d} : ${d} = ${c}`,`${a*b} − ${c} = ${ans}`];h=['Erledige beide Punktrechnungen, bevor du subtrahierst.',`Rechne ${a} · ${b} und ${c*d} : ${d}.`];}
 }else if(m==='bracket'){
  error='Klammern';const variant=int(0,level===3?2:1);
  if(variant===0){ex=`(${a} + ${b}) · ${c}`;ans=(a+b)*c;sol=[`${a} + ${b} = ${a+b}`,`${a+b} · ${c} = ${ans}`];h=['Die Klammer wird zuerst ausgerechnet.',`Berechne zuerst ${a} + ${b}.`];}
  else if(variant===1){ex=`${a} + (${b*c} − ${b}) : ${b}`;ans=a+c-1;sol=[`${b*c} − ${b} = ${b*(c-1)}`,`${b*(c-1)} : ${b} = ${c-1}`,`${a} + ${c-1} = ${ans}`];h=['Zuerst Klammer, dann Punktrechnung, dann Strichrechnung.',`Berechne zuerst ${b*c} − ${b}.`];}
  else{ex=`${d} · (${a} + (${b*c} − ${b}))`;ans=d*(a+b*c-b);sol=[`Innere Klammer: ${b*c} − ${b} = ${b*c-b}`,`Äußere Klammer: ${a} + ${b*c-b} = ${a+b*c-b}`,`${d} · ${a+b*c-b} = ${ans}`];h=['Bei verschachtelten Klammern beginnst du ganz innen.',`Beginne mit (${b*c} − ${b}).`];}
 }else{
  error='Rechenvorteil';const variant=int(0,2);
  if(variant===0){ex=`${a} · 25 · 4`;ans=a*100;sol=['25 · 4 = 100',`${a} · 100 = ${ans}`];h=['Bei lauter Malzeichen darfst du die Faktoren geschickt zusammenfassen.','Welche beiden Faktoren ergeben 100?'];}
  else if(variant===1){ex=`${a*10+b} + ${100-b} + ${c*10}`;ans=a*10+100+c*10;sol=[`${a*10+b} + ${100-b} = ${a*10+100}`,`${a*10+100} + ${c*10} = ${ans}`];h=['Suche Zahlen, die zusammen eine glatte Hunderterzahl ergeben.',`Verbinde zuerst ${a*10+b} und ${100-b}.`];}
  else {ex=`${a} · 99`;ans=a*99;sol=[`${a} · 100 = ${a*100}`,`${a*100} − ${a} = ${ans}`];h=['99 ist um 1 kleiner als 100. Nutze die Nachbaraufgabe.',`Rechne ${a} · 100 und ziehe einmal ${a} ab.`];}
 }
 return{id:`m-${seed}-${level}-${m}`,topic:'mental',title:modes[m],prompt:'Rechne im Kopf.',expression:ex,answer:ans,hints:h,solution:sol,error};
}
export function makeProblem(topic:Topic,seed:number,level=2,index=0):Problem{
 if(topic==='mental')return mentalProblem(seed,level);
 const full=curriculumProblem(topic,seed,level,index);if(full)return full;
 const expanded=expandedProblem(topic,seed,level,index);if(expanded)return expanded;
 const r=rng(seed),int=(a:number,b:number)=>a+Math.floor(r()*(b-a+1));
 const base={id:`${topic}-${seed}`,topic,title:'',prompt:'',answer:0,hints:[] as string[],solution:[] as string[]};
 if(topic==='data'){
  const scale=level===1?1:level===2?2:5,labels=['Fußball','Schwimmen','Klettern'],values=[int(3,7),int(2,8),int(2,7)].map(n=>level===3?n*2:n);
  const k=int(0,2);if(index%4===0){const n=int(6,level===1?12:24);return {...base,title:'Strichlisten lesen',prompt:'Wie viele Stimmen zeigt diese Strichliste?',type:'tally',n,answer:n,hints:['Ein Bündel mit Querstrich zählt als 5.',`Du siehst ${Math.floor(n/5)} Fünferbündel und ${n%5} einzelne Striche.`],solution:[`${Math.floor(n/5)} · 5 + ${n%5} = ${n}`],error:'Fünferbündel'};}
  if(index%4===1)return{...base,title:'Diagramme ablesen',prompt:`Wie viele Kinder wählen ${labels[k]}?`,type:'chart',labels,values,scale,unit:'Kinder',answer:values[k],hints:['Lies zuerst die Schrittweite der Zahlenachse ab.',`Eine Gitterstufe steht für ${scale} ${scale===1?'Kind':'Kinder'}. Folge der Säulenoberkante zur Zahlenachse.`],solution:[`Die Säule für ${labels[k]} endet bei ${values[k]}. Also wählen ${values[k]} Kinder ${labels[k]}.`],error:'Skalierung'};
  if(index%4===2)return{...base,title:'Daten vergleichen',prompt:`Wie viele Kinder wählen Fußball und Schwimmen zusammen?`,type:'chart',labels,values,scale,unit:'Kinder',answer:values[0]+values[1],hints:['Lies die beiden Säulen getrennt ab.','Addiere die Zahl für Fußball und die Zahl für Schwimmen.'],solution:[`${values[0]} + ${values[1]} = ${values[0]+values[1]} Kinder`],error:'Diagramme vergleichen'};
  const low=int(1,5)*scale*2,high=low+scale*2,mid=low+scale;return{...base,title:'Diagramme verstehen',prompt:`Eine Säule endet genau zwischen ${low} und ${high}. Welchen Wert stellt sie dar?`,type:'choice',options:[String(high),String(mid),String(low)],answer:String(mid),hints:['Die Mitte liegt gleich weit von beiden Zahlen entfernt.',`Von ${low} bis ${high} sind es ${scale*2}. Die Hälfte davon ist ${scale}.`],solution:[`${low} + ${scale} = ${mid}. Nicht jede Säule muss genau auf einer Gitterlinie enden.`],error:'Skalierung'};
 }
 if(topic==='numbers'){
  const n=level===1?int(10,99)*100+int(1,9):level===2?int(1,9)*1000000+int(10,99)*1000+int(1,9)*10:int(1,8)*1e9+int(1,999)*1e6+int(1,99)*1000+int(1,9);
  const p=int(0,level===1?3:level===2?6:9),digit=Math.floor(n/10**p)%10;
  if(index%3===0)return{...base,title:'Zahlwörter entschlüsseln',prompt:`Schreibe als Zahl: ${numberWord(n)}.`,answer:n,n,type:'place',hints:['Teile das Zahlwort bei „Milliarden“, „Millionen“ und „tausend“.','Jede Dreiergruppe braucht drei Stellen. Besetze fehlende Stellen mit 0.'],solution:[`${numberWord(n)} = ${fmt(n)}`,`Die Gruppen von rechts: Einer, Tausender, Millionen, Milliarden.`],error:'Stellenwerte / Nullen'};
  if(index%3===1)return{...base,title:'Stellenwerte erkennen',prompt:`Welche Ziffer steht bei ${fmt(n)} an der Stelle „${placeNames[p]}“?`,answer:digit,n,place:p,hints:['Beginne rechts bei den Einern.','Gehe in dieser Reihenfolge nach links: E, Z, H, T, ZT, HT, M, ZM, HM, Mrd.'],solution:[`Die ${placeNames[p]}-Ziffer ist ${digit}. Ihr Wert ist ${fmt(digit*10**p)}.`],error:'Stellenwert'};
  const delta=10**p;return{...base,title:'Zahlen verändern',prompt:`Welche Zahl ist um ${fmt(delta)} größer als ${fmt(n)}?`,answer:n+delta,n,hints:['Achte darauf, welche Stelle sich verändert.',`Addiere ${fmt(delta)}. Falls eine Stelle über 9 wächst, bündelst du 10 zur nächsten Stelle.`],solution:[`${fmt(n)} + ${fmt(delta)} = ${fmt(n+delta)}`],error:'Bündeln'};
 }
 const p=int(1,level===1?2:level===2?4:6),step=10**p,n=int(1,19)*step+int(0,step-1),ans=roundTo(n,p),check=Math.floor(n/(step/10))%10;
 if(index%4===3){const cards=int(2,9)*10,price=int(1,4)*10;return{...base,title:'Sinnvoll schätzen',prompt:`Für einen Ausflug kosten ${cards-1} Eintrittskarten je ${price+1} €. Schätze mit ${cards} Karten und ${price} € pro Karte. Wie hoch ist der Überschlag?`,answer:cards*price,hints:['Ein Überschlag muss nicht exakt sein.','Multipliziere die beiden gerundeten Zahlen.'],solution:[`${cards} · ${price} € = ${fmt(cards*price)} €`,`Genau sind es ${cards-1} · ${price+1} € = ${fmt((cards-1)*(price+1))} €. Der Überschlag prüft die Größenordnung.`],error:'Überschlag'};}
 return{...base,title:'Runden',prompt:`Runde ${fmt(n)} auf ${placeNames[p]}.`,answer:ans,n,place:p,hints:[`Finde die ${placeNames[p]}stelle. Nur die Ziffer direkt rechts daneben entscheidet.`,`Die Prüfziffer ist ${check}. Bei 0–4 rundest du ab, bei 5–9 auf.`],solution:[`Die Prüfziffer ${check} bedeutet: ${check<5?'abrunden':'aufrunden'}.`,`${fmt(n)} ≈ ${fmt(ans)}. Rechts von der Rundungsstelle stehen nur Nullen.`],error:'Rundungsregel'};
}
export function feedback(p:Problem,s:string){
 if(p.fields&&!isComplete(p,s))return 'Fülle jedes Feld mit einer gültigen Zahl aus.';
 if(p.decimal&&parseValue(s,true)===null)return 'Schreibe Dezimalzahlen mit Komma, zum Beispiel 1,5. Tausenderpunkte sind erlaubt.';
 if(p.fields)return p.topic==='data'?'Prüfe jede Kategorie einzeln. Nutze die Daten und beachte die Skala.':'Prüfe jedes Feld einzeln. Achte auf die Reihenfolge der gesuchten Werte und nutze den Tipp.';
 const n=parseValue(s,!!p.decimal);if(n===null&&typeof p.answer==='number')return 'Gib eine ganze Zahl ein. Erlaubt sind zum Beispiel 2403050, 2.403.050 oder 2 403 050.';
 if(p.topic==='round'&&p.place&&n!==null&&n%(10**p.place)!==0)return 'Prüfe die Stellen rechts von der Rundungsstelle: Sie müssen alle 0 sein.';
 if(p.topic==='numbers'&&p.type==='place'&&p.n&&String(n).length<String(p.answer).length)return 'Prüfe, ob eine Null als Platzhalter fehlt. Jede Stelle hat ihren festen Platz.';
 return p.topic==='mental'&&p.error==='Reihenfolge'?'Prüfe die Reihenfolge: Punkt vor Strich. Gleichrangige Rechenarten von links nach rechts.':p.error==='Klammern'?'Beginne in der innersten Klammer. Danach gilt Punkt vor Strich.':'Noch nicht ganz. Prüfe deinen Rechenweg oder lass dir einen Tipp geben.';
}
export function makeTest(version:number):Problem[]{
 const offset=(version-1)*20000,n=140592+offset+(version%3)*3500,rounded=roundTo(n,4),a=6+version,b=3+version;
 const problems:Problem[]=[
 {id:'test-0',topic:'data',title:'1 · Am Parkeingang',prompt:'Wie viele Gäste zeigt die Strichliste?',type:'tally',n:11+version,answer:11+version,hints:[],solution:[`${Math.floor((11+version)/5)} · 5 + ${(11+version)%5} = ${11+version} Gäste`]},
 {id:'test-1',topic:'numbers',title:'2 · Der Kassencode',prompt:`Notiere als Zahl: ${String(n).split('').map((d,i)=>`${d} ${placeNames[5-i]}`).join(', ')}.`,answer:n,hints:[],solution:[`Die Ziffern gehören in die Stellen HT, ZT, T, H, Z, E: ${fmt(n)}.`]},
 {id:'test-2',topic:'round',title:'3 · Für die Zeitung',prompt:`Runde die Tageseinnahmen von ${fmt(n)} € auf Zehntausender.`,answer:rounded,hints:[],solution:[`Die Tausenderziffer ist ${Math.floor(n/1000)%10}. Es wird ${Math.floor(n/1000)%10<5?'ab':'auf'}gerundet: ${fmt(rounded)} €.`]},
 {id:'test-3',topic:'data',title:'4 · Das Abschlussdiagramm',prompt:'Trage den gerundeten Betrag aus Aufgabe 3 als Freitagssäule ein. Du darfst zurückblättern.',answer:rounded,type:'chart',labels:['Mo','Di','Mi','Do','Fr'],values:[100000,120000,90000,110000,0],scale:50000,unit:'Euro',hints:[],solution:[`Die Freitagssäule endet bei ${fmt(rounded)} €. Ein richtig dargestelltes eigenes Ergebnis aus Aufgabe 3 zählt ebenfalls.`]},
 {id:'test-4',topic:'data',title:'5 · Besucher vergleichen',prompt:'Wie viele Gäste mehr fahren Achterbahn als Riesenrad?',type:'chart',values:[60+version*5,45,30],labels:['Achterbahn','Riesenrad','Wasserbahn'],scale:20,unit:'Gäste',answer:15+version*5,hints:[],solution:[`${60+version*5} − 45 = ${15+version*5} Gäste`]},
 {id:'test-5',topic:'mental',title:'6 · Eintrittskarten',prompt:`${b} Kinder zahlen je ${a} €. Dazu kommt ein Parkplan für 4 €. Wie viel ist das insgesamt?`,expression:`${b} · ${a} + 4`,answer:b*a+4,hints:[],solution:[`${b} · ${a} = ${a*b}`,`${a*b} + 4 = ${a*b+4} €`]},
 {id:'test-6',topic:'mental',title:'7 · Gruppenpreis',prompt:`${b} Gruppen kaufen jeweils ${a} normale und 2 zusätzliche Fahrkarten. Wie viele Fahrkarten sind das?`,expression:`${b} · (${a} + 2)`,answer:b*(a+2),hints:[],solution:[`${a} + 2 = ${a+2}`,`${b} · ${a+2} = ${b*(a+2)} Fahrkarten`]},
 {id:'test-7',topic:'round',title:'8 · Genau oder gerundet?',prompt:'Wann brauchst du die genaue Zahl und solltest nicht runden?',type:'choice',options:['Beim Herausgeben von Wechselgeld','Bei einer groben Besucherprognose','Beim Überschlagen der Wochenkosten'],answer:'Beim Herausgeben von Wechselgeld',hints:[],solution:['Beim Bezahlen muss der Geldbetrag genau stimmen. Eine Prognose und ein Überschlag dürfen Näherungen sein.']},
 ...([['data',6],['data',11],['line',version%2],['units',version%2?1:3],['data',14],['data',16]] as [Topic,number][]).map(([topic,kind],i)=>{let p=expandedProblem(topic,version*571+i*397,2,kind)!;
 if(i===0){const names=['Achterbahn','Riesenrad','Wasserbahn','Karussell'];p={...p,labels:names,fields:names,unit:'Gäste',chartTitle:'Fahrgäste am Vormittag',prompt:'Baue aus der Tabelle ein Balkendiagramm zu den Fahrgastzahlen.',table:{headers:['Attraktion','Gäste'],rows:names.map((name,j)=>[name,p.values![j]])},solution:names.map((name,j)=>`${name}: ${p.values![j]} Gäste.`)};}
 if(i===1){const charts=p.charts!.map((c,j)=>({...c,title:`Imbiss ${j===0?'A':'B'}`,labels:['Eis','Saft'],unit:'verkaufte Stück'}));p={...p,charts,unit:'Stück',prompt:'Wie viele Eisbecher mehr verkauft Imbiss B als Imbiss A?',solution:[`Imbiss A: ${charts[0].values[0]}; Imbiss B: ${charts[1].values[0]}. Unterschied: ${p.answer} Eisbecher.`]};}
 if(i===2)p={...p,prompt:'Auf dem Parkplan sind Entfernungen in Metern eingetragen. '+p.prompt,unit:'m'};
 if(i===3)p={...p,prompt:'Für den Parkbericht: '+p.prompt};
 if(i===4)p={...p,prompt:'Dein Diagramm zeigt Fahrgastzahlen. '+p.prompt};
 if(i===5){const answer='Zufällig ausgewählte Gäste an verschiedenen Orten und Zeiten befragen.';p={...p,prompt:'Welche Attraktion ist bei unseren Parkgästen am beliebtesten? Welche Befragung passt am besten?',answer,options:[answer,'Nur die wartenden Gäste an der Achterbahn befragen.','Nur meine Freunde befragen.'].sort((a,b)=>version%2?a.localeCompare(b):b.localeCompare(a)),solution:['Befrage Gäste an verschiedenen Stellen und zu verschiedenen Zeiten. Nur eine Warteschlange zu befragen, würde die Auswahl verzerren. Auch eine Stichprobe ist keine Garantie für ein genaues Ergebnis.']};}
 return {...p,id:'test-'+(i+8),title:`${i+9} · ${p.title}`,hints:[]};})
 ];
 return problems.map(p=>p.type==='choice'?{...p,options:shuffled(p.options!,version*97+Number(p.id.split('-').at(-1)))}:p);
}
export function gradeTest(ps:Problem[],answers:string[]){return ps.map((p,i)=>{const prev=parseAnswer(answers[2]||''),v=parseAnswer(answers[i]||'');const follow=i===3&&prev!==null&&prev>0&&v===prev&&!correct(ps[2],answers[2]);return{ok:correct(p,answers[i]||'')||follow,follow};});}

import {fmt,parseValue,numberWord,roundTo,mentalProblem,rng,type Plot,type LineSpec} from './math.ts';
import {shuffled} from './tasks.ts';
export type ExamPart={id:string;label:string;answer?:number|string;points:number;kind:'number'|'choice'|'text'|'position';choices?:string[];unit?:string;solution:string;rubric?:string[];decimal?:boolean};
export type ExamTask={id:string;title:string;prompt:string;parts:ExamPart[];page:number;raw?:string[];table?:{headers:string[];rows:(string|number)[][]};chart?:Plot;charts?:Plot[];draw?:Plot;line?:LineSpec;lineTarget?:number;tally?:string[];points:number};
export type ExamPaper={version:number;title:string;intro:string;duration:number;tasks:ExamTask[];points:number;automaticPoints:number;manualPoints:number};
export const examThemes=[
 {title:'Das Schulfest',items:['Waffeln','Brezeln','Obst','Kuchen'],unit:'verkaufte Stück',intro:'Ihr plant ein Schulfest. Werte die Daten aus und prüfe die Rechnungen.'},
 {title:'In der Bücherei',items:['Krimi','Comic','Fantasy','Sachbuch'],unit:'Bücher',intro:'Die Schulbücherei plant neue Angebote. Hilf bei der Auswertung und beim Rechnen.'},
 {title:'Der Sporttag',items:['Laufen','Werfen','Springen','Staffel'],unit:'Kinder',intro:'Für den Sporttag werden Anmeldungen und Ergebnisse ausgewertet.'},
 {title:'Ein Tag im Tierpark',items:['Pinguine','Zebras','Affen','Luchse'],unit:'Stimmen',intro:'Eine Klasse besucht den Tierpark. Sie sammelt Daten und plant die Kosten.'},
 {title:'Unsere Projektwoche',items:['Robotik','Theater','Musik','Kunst'],unit:'Kinder',intro:'Die Projektwoche steht bevor. Ordne die Anmeldungen und rechne nach.'},
 {title:'Am Schulkiosk',items:['Äpfel','Birnen','Bananen','Möhren'],unit:'verkaufte Stück',intro:'Der Schulkiosk möchte seine Planung verbessern. Untersuche die Verkaufsdaten.'},
 {title:'Der Wandertag',items:['See','Wald','Burg','Museum'],unit:'Stimmen',intro:'Ihr stimmt über Ziele ab und bereitet einen Wandertag vor.'},
 {title:'Das Spieleturnier',items:['Schach','Dame','Mühle','Quartett'],unit:'Kinder',intro:'Für ein Spieleturnier werden Anmeldungen gezählt und Pläne erstellt.'},
 {title:'Im Schulgarten',items:['Tulpen','Rosen','Astern','Lilien'],unit:'Pflanzen',intro:'Im Schulgarten werden Bestände gezählt und neue Beete geplant.'},
 {title:'Die Freizeitmesse',items:['Lesen','Sport','Basteln','Gaming'],unit:'Stimmen',intro:'Eine Freizeitmesse sammelt Wünsche. Prüfe die Daten und rechne für die Planung.'}
];
export function makeExam(version:number):ExamPaper{
 if(!Number.isInteger(version)||version<1||version>10)throw Error('Unbekannte Klassenarbeit');
 const theme=examThemes[version-1],seed=version*971,r=rng(seed),int=(a:number,b:number)=>a+Math.floor(r()*(b-a+1));
 let serial=0;
 const num=(label:string,answer:number,solution:string,unit?:string,kind:'number'|'position'='number'):ExamPart=>({id:'p'+(++serial),label,answer,points:1,kind,solution,unit});
 const choice=(label:string,answer:string,wrong:string[],solution:string):ExamPart=>({id:'p'+(++serial),label,answer,points:1,kind:'choice',choices:shuffled([...new Set([answer,...wrong])],seed+serial*71),solution});
 const text=(label:string,rubric:string[]):ExamPart=>({id:'p'+(++serial),label,points:rubric.length,kind:'text',solution:rubric.join(' '),rubric});
 const tasks:ExamTask[]=[];
 const add=(page:number,title:string,prompt:string,parts:ExamPart[],extra:Partial<ExamTask>={})=>{tasks.push({id:'q'+(tasks.length+1),title,prompt,parts,page,points:parts.reduce((s,p)=>s+p.points,0),...extra});};
 const cats=theme.items.slice(0,3),counts=[int(5,8),int(4,7),int(5,8)],raw=shuffled(cats.flatMap((c,i)=>Array(counts[i]).fill(c)),seed);
 add(1,'Urliste und Strichliste','Übertrage alle Antworten in eine Strichliste mit Fünferbündeln. Notiere auch die Häufigkeiten. Jede Antwort zählt genau einmal.',cats.map((c,i)=>num(c,counts[i],`${c}: ${Math.floor(counts[i]/5)} Fünferbündel und ${counts[i]%5} einzelne Striche; Häufigkeit ${counts[i]}.`)),{raw,tally:cats});
 const scale=version%3===0?5:2,values=shuffled([3,5,6,8],seed+24).map((v,i)=>v*scale+(version%2&&i===0?1:0)),total=values.reduce((a,b)=>a+b,0),max=Math.max(...values),maxName=theme.items[values.indexOf(max)];
 const chart:Plot={values,labels:theme.items,scale,unit:theme.unit,horizontal:version%2===0,title:theme.title+' · Erhebung 1'};
 add(1,'Ein Diagramm auswerten','Lies das Diagramm genau. Achte auf die Einheit und die Skala.',[
 num(`Wie hoch ist der Wert für ${theme.items[0]}?`,values[0],`${theme.items[0]}: ${values[0]} ${theme.unit}.`,theme.unit),
 num('Wie hoch ist die Gesamtzahl?',total,`${values.join(' + ')} = ${total}.`,theme.unit),
 num(`Wie groß ist der Unterschied zwischen ${theme.items[1]} und ${theme.items[2]}?`,Math.abs(values[1]-values[2]),`${Math.max(values[1],values[2])} − ${Math.min(values[1],values[2])} = ${Math.abs(values[1]-values[2])}.`,theme.unit),
 choice('Welche Kategorie hat den höchsten Wert?',maxName,theme.items.filter(x=>x!==maxName),`${maxName} hat mit ${max} den höchsten Wert.`)
 ],{chart});
 const appropriate=version%2?{s:'Ein Bleistift ist ungefähr 18 … lang.',a:'cm',w:['km','kg']}:{s:'Ein Apfel wiegt ungefähr 180 … .',a:'g',w:['kg','m']},meters=2+version,hours=1+version%3,mins=15+version%3*5;
 add(1,'Größen und Einheiten','Wähle die passende Einheit und rechne um.',[
 choice(appropriate.s,appropriate.a,appropriate.w,appropriate.s.replace('…',appropriate.a)),
 num(`${meters} m = wie viele cm?`,meters*100,`${meters} · 100 = ${meters*100} cm.`,'cm'),
 num(`${hours} h ${mins} min = wie viele Minuten?`,hours*60+mins,`${hours} · 60 + ${mins} = ${hours*60+mins} min.`,'min')
 ]);
 const drawValues=shuffled([6,10,14,18],seed+51).map(n=>n+(version%3)*2),drawMax=Math.ceil(Math.max(...drawValues)/6)*6,drawScale=drawMax/6;
 const draw:Plot={values:drawValues,labels:theme.items,scale:drawScale,maxValue:drawMax,unit:theme.unit,horizontal:!chart.horizontal,title:theme.title+' · Erhebung 2'};
 add(2,'Ein Diagramm erstellen',`Erstelle ein ${draw.horizontal?'Balkendiagramm':'Säulendiagramm'} zur Tabelle. Das Raster hat 6 gleich große Zahlenabstände. Die Zahlenachse soll bei 0 beginnen und bei ${drawMax} enden. Nutze ein Lineal.`,[
 ...theme.items.map((c,i)=>num(c,drawValues[i],`${c}: ${drawValues[i]} ${theme.unit}.`)),
 num('Welche Schrittweite hat die Zahlenachse?',drawScale,`${drawMax} : 6 = ${drawScale}.`),
 text('Gib dem Diagramm einen passenden Titel und beschrifte die Kategorien sowie die Zahlenachse mit der Einheit.',[`1 Punkt: passender Titel, alle Kategorien und die Einheit „${theme.unit}“ sind sinnvoll eingetragen.`])
 ],{draw,table:{headers:['Kategorie',theme.unit],rows:theme.items.map((l,i)=>[l,drawValues[i]])}});
 const a=20+(version%3)*10,b=a+10,plots:Plot[]=[{values:[a,a+5],labels:['Stand A','Stand B'],scale:5,maxValue:60,unit:'verkaufte Hefte',title:'Vormittag'},{values:[b,b+10],labels:['Stand A','Stand B'],scale:10,maxValue:120,unit:'verkaufte Hefte',title:'Nachmittag'}];
 add(2,'Zwei Diagramme vergleichen','Beide Diagramme zeigen verkaufte Hefte. Die gezeichneten Diagramme sind gleich groß.',[
 num('Wie viele Hefte verkauft Stand A am Vormittag?',a,`Vormittag: ${a} Hefte.`),
 num('Wie viele Hefte verkauft Stand A am Nachmittag?',b,`Nachmittag: ${b} Hefte.`),
 text('Warum darfst du die Säulenhöhen hier nicht direkt vergleichen? Begründe mit den Daten.',[
 '1 Punkt: Die Zahlenachsen haben verschiedene Schrittweiten bzw. Höchstwerte.',
 `1 Punkt: Zahlenbeleg, zum Beispiel ${b} Hefte am Nachmittag sind mehr als ${a} am Vormittag, obwohl die Nachmittagssäule niedriger gezeichnet ist.`])
 ],{charts:plots});
 const group=int(2,8),n=group*1000000+int(20,89)*1000+int(1,9)*10,other=n+1000;
 add(3,'Große Zahlen','Beachte die Stellenwerte und die Nullen.',[
 num(`Schreibe als Zahl: ${numberWord(n)}.`,n,`${numberWord(n)} = ${fmt(n)}.`),
 num(`Welche Ziffer steht bei ${fmt(n)} an der Tausenderstelle?`,Math.floor(n/1000)%10,`Die Tausenderziffer ist ${Math.floor(n/1000)%10}.`),
 choice(`Welches Zeichen passt: ${fmt(other)} … ${fmt(n)}?`,'>',['<','='],`${fmt(other)} ist um 1.000 größer.`)
 ]);
 const start=version*1000,step=version%2?100:50,point=start+3*step,target=start+8*step;
 add(3,'Am Zahlenstrahl','Bestimme die Schrittweite und arbeite am Zahlenstrahl.',[
 num('Welche Zahl ist mit A markiert?',point,`${fmt(start)} + 3 · ${step} = ${fmt(point)}.`),
 num('Wie viel zählt ein kleiner Abstand?',step,`(${fmt(start+10*step)} − ${fmt(start)}) : 10 = ${step}.`),
 num(`Markiere die Zahl ${fmt(target)} mit B.`,target,`B liegt acht Abstände rechts von ${fmt(start)}.`,undefined,'position')
 ],{line:{start,step,steps:10,point},lineTarget:target});
 const roundN=12000+version*1000+pickOffset(version);
 add(3,'Runden und Genauigkeit','Runde direkt auf die gefragte Stelle. Verwende keine Zwischenergebnisse aus der anderen Teilaufgabe.',[
 num(`Runde ${fmt(roundN)} auf Hunderter.`,roundTo(roundN,2),`Die Zehnerziffer entscheidet: ${fmt(roundN)} ≈ ${fmt(roundTo(roundN,2))}.`),
 num(`Runde ${fmt(roundN)} auf Tausender.`,roundTo(roundN,3),`Die Hunderterziffer entscheidet: ${fmt(roundN)} ≈ ${fmt(roundTo(roundN,3))}.`),
 choice('Wann brauchst du eine genaue Zahl?','Beim Herausgeben von Wechselgeld',['Bei einer groben Besucherprognose','Beim Überschlagen der Kosten'],'Wechselgeld muss genau stimmen.')
 ]);
 add(4,'Kopfrechnen','Rechne ohne Taschenrechner. Beachte Klammern und Punkt vor Strich.',(['add','mul','order','bracket'] as const).map((mode,i)=>{const p=mentalProblem(seed+i*19,2,mode);return num(p.expression!+' = ?',p.answer as number,p.solution.join(' → '));}));
 const x=8+version,y=2+version%4,z=3+version%3,wrong=(x+y)*z,good=x+y*z;
 add(4,'Einen Rechenfehler erklären',`Luca schreibt: ${x} + ${y} · ${z} = ${x+y} · ${z} = ${wrong}.`,[
 num('Wie lautet das richtige Ergebnis?',good,`${y} · ${z} = ${y*z}; ${x} + ${y*z} = ${good}.`),
 text('Welche Regel hat Luca nicht beachtet?',[`1 Punkt: Multiplikation geht vor Addition (Punkt vor Strich); zuerst ${y} · ${z} rechnen.`])
 ]);
 const people=18+version,price=6+version%4,fee=12+version,totalCost=people*price+fee;
 add(4,'Eine Sachaufgabe lösen',`Für einen Ausflug zahlen ${people} Kinder je ${price} €. Dazu kommt eine einmalige Buchungsgebühr von ${fee} €.`,[
 choice('Welcher Rechenausdruck passt?',`${people} · ${price} + ${fee}`,[`${people} · (${price} + ${fee})`,`${people} + ${price} + ${fee}`],'Der Eintritt wird pro Kind berechnet, die Buchungsgebühr nur einmal.'),
 num('Wie hoch sind die Gesamtkosten?',totalCost,`${people} · ${price} + ${fee} = ${people*price} + ${fee} = ${totalCost} €.`,'€'),
 num(`Wie viel bezahlt jedes Kind, wenn nur die Eintrittskosten von ${people*price} € gleichmäßig verteilt werden?`,price,`${people*price} : ${people} = ${price} €.`,'€')
 ]);
 add(4,'Aussagen kritisch prüfen','Wähle jeweils „richtig“ oder „falsch“.',[
 choice('Bei gleich großen Gitterabständen dürfen die Zahlenabstände auf einer Achse beliebig wechseln.','falsch',['richtig'],'Gleiche Gitterabstände müssen gleich große Zahlenschritte bedeuten.'),
 choice('Eine Befragung nur im Fußballverein beschreibt nicht automatisch die Vorlieben der ganzen Schule.','richtig',['falsch'],'Die Auswahl der Befragten beeinflusst das Ergebnis.')
 ]);
 const points=tasks.reduce((s,t)=>s+t.points,0),manualPoints=tasks.flatMap(t=>t.parts).filter(p=>p.kind==='text').reduce((s,p)=>s+p.points,0);
 return{version,title:theme.title,intro:theme.intro,duration:45,tasks,points,automaticPoints:points-manualPoints,manualPoints};
}
function pickOffset(v:number){return [449,582,950,499,501,249,750,995,149,650][v-1];}
export function examAnswerValid(part:ExamPart,value:string){if(part.kind==='text')return value.trim().length>0;if(part.kind==='choice')return !!part.choices?.includes(value);return parseValue(value,!!part.decimal)!==null;}
export function gradeExam(paper:ExamPaper,answers:Record<string,string>,manual:Record<string,number>={}){
 const rows=paper.tasks.flatMap(t=>t.parts.map(p=>{const raw=answers[p.id]||'',isManual=p.kind==='text',number=typeof p.answer==='number'?parseValue(raw,!!p.decimal):null;const ok=typeof p.answer==='number'?number!==null&&Math.abs(number-p.answer)<1e-8:raw===p.answer;const assessed=isManual&&Number.isInteger(manual[p.id])&&manual[p.id]>=0&&manual[p.id]<=p.points;return{id:p.id,task:t.title,manual:isManual,assessed,points:isManual?(assessed?manual[p.id]:0):ok?p.points:0,max:p.points,ok:!isManual&&ok};}));
 return{rows,automatic:rows.filter(p=>!p.manual).reduce((s,p)=>s+p.points,0),manual:rows.filter(p=>p.manual).reduce((s,p)=>s+p.points,0),pending:rows.filter(p=>p.manual&&!p.assessed).length,total:rows.reduce((s,p)=>s+p.points,0)};
}

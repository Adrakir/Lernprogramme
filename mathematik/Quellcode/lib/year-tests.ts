import {makeProblem,type Problem,type Topic} from './math.ts';
export const testThemes=[{id:'mixed',title:'Gemischt · Grundlagen Klasse 5'},{id:'arithmetic',title:'Schriftliches Rechnen & Sachaufgaben'},{id:'divisibility',title:'Teilbarkeit & Primzahlen'},{id:'geometry',title:'Geometrie & Koordinaten'},{id:'measure',title:'Flächen & Körper'},{id:'angles',title:'Winkel'},{id:'symmetry',title:'Symmetrie & Vierecke'},{id:'solids',title:'Körper & Netze'},{id:'fractions',title:'Brüche · Vertiefung 5/6'},{id:'decimals',title:'Dezimalzahlen · Vertiefung 5/6'},{id:'all',title:'Gemischt · mit Vertiefung 5/6'}];
export function makeYearTest(theme:string,version:number):Problem[]{
 if(!testThemes.some(t=>t.id===theme)||!Number.isInteger(version)||version<1||version>10)throw new Error('Ungültiger Test');
 const mixed:[Topic,number][]=[['data',1],['data',5],['data',11],['numbers',0],['round',0],['line',1],['units',1],['mental',0],['arithmetic',0],['arithmetic',1],['arithmetic',2],['arithmetic',3],['arithmetic',8],['divisibility',0],['divisibility',3],['geometry',4],['geometry',7],['measure',0],['measure',1],['measure',4]];
 const all:[Topic,number][]=[...mixed.slice(0,12),['fractions',0],['fractions',4],['fractions',6],['fractions',8],['decimals',2],['decimals',4],['decimals',7],['stats',2]];
 const specs: [Topic,number][]=theme==='mixed'?mixed:theme==='all'?all:Array.from({length:10},(_,i)=>[theme as Topic,i]);
 return specs.map(([topic,kind],i)=>({...makeProblem(topic,version*17531+i*997+theme.length*61,2,kind),id:`year-${theme}-${version}-${i}`}));
}

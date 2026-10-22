import {checkPrepField,checkPrepChart,type PrepExercise} from './preparation.ts';
import {parseAnswer,fmt} from './math.ts';
export type PrepAttempt={answers:Record<string,string>;hints:number;viewed:boolean;checked:boolean;attempts:number;reflection:string;reviewed:boolean;independent?:boolean;marks?:number[]};
export type SavedCourse={version:number;station:number;index:number;work:Record<string,PrepAttempt>};
export const blankPrepAttempt=():PrepAttempt=>({answers:{},hints:0,viewed:false,checked:false,attempts:0,reflection:'',reviewed:false});
const obj=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const bounded=(n:unknown,min:number,max:number,fallback:number)=>typeof n==='number'&&Number.isInteger(n)&&n>=min&&n<=max?n:fallback;
export function restorePrepCourse(raw:unknown):SavedCourse {
 const s=obj(raw)?raw:{},work:Record<string,PrepAttempt>={};
 if(obj(s.work))for(const [key,value] of Object.entries(s.work)){
  if(!/^(?:[1-9]|10)-s[0-5]-\d+$/.test(key)||!obj(value)||!obj(value.answers))continue;
  const answers=Object.fromEntries(Object.entries(value.answers).filter(([k,v])=>/^[a-z][a-z0-9]*$/.test(k)&&typeof v==='string')) as Record<string,string>;
  work[key]={answers,hints:bounded(value.hints,0,3,0),viewed:value.viewed===true,checked:value.checked===true,attempts:bounded(value.attempts,0,100000,0),reflection:typeof value.reflection==='string'?value.reflection:'',reviewed:value.reviewed===true,independent:typeof value.independent==='boolean'?value.independent:undefined,marks:Array.isArray(value.marks)?value.marks.filter(n=>typeof n==='number'&&Number.isInteger(n)&&n>0&&n<=100):[]};
 }
 return {version:bounded(s.version,1,10,1),station:bounded(s.station,0,5,0),index:bounded(s.index,0,9,0),work};
}
export function changePrepAnswer(a:PrepAttempt,id:string,value:string):PrepAttempt {if(a.answers[id]===value)return a;return {...a,answers:{...a.answers,[id]:value},checked:false,reviewed:false};}
export function formatPrepAnswer(a:PrepAttempt,id:string):PrepAttempt {const n=parseAnswer(a.answers[id]||'');return n===null?a:{...a,answers:{...a.answers,[id]:fmt(n)}};}
export function checkPrepAttempt(e:PrepExercise,a:PrepAttempt):PrepAttempt {const correct=e.fields.every(f=>checkPrepField(f,a.answers[f.id]||''))&&checkPrepChart(e,a.answers);return {...a,checked:true,attempts:a.attempts+1,independent:a.independent===true||correct&&!a.viewed&&a.hints===0};}

// Run: node majas-wortwerkstatt/wolkenwege.test.cjs
// Verify the actual bundled game rules, without a browser or dependencies.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
for(const [i,match]of [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].entries()){
 new vm.Script(match[1],{filename:`index.html script ${i+1}`});
}
const start=html.indexOf('const cloudLevels = ');
const end=html.indexOf('function cloudRead()',start);
if(start<0||end<0)throw new Error('Wolkenwege source not found');
vm.runInNewContext(html.slice(start,end)+`
 function assert(condition,message){if(!condition)throw new Error(message);}
 assert(cloudLevels.length===12,'Expected twelve levels');
 for(const [index,level]of cloudLevels.entries()){
  const rows=level.map;
  assert(rows.every(row=>row.length===rows[0].length),'Ragged board');
  assert(rows.join('').split('M').length===2&&rows.join('').split('B').length===2,'Each board needs one Maja and one Bärli');
  let s=cloudInitial(level),count=0;
  const history=[];
  while(!cloudTogether(s)&&count<200){
   const hint=cloudSolve(level,s);
   assert(hint,'No solution for level '+(index+1));
   const before=JSON.stringify(s);
   const next=cloudStep(level,s,hint.who,hint.d);
   assert(next,'Hint recommends illegal move');
   assert(before===JSON.stringify(s),'Move mutated previous state');
   history.push(before);s=next;count++;
  }
  assert(cloudTogether(s),'Did not finish level '+(index+1));
  assert(history.length>0,'Empty level');
  const restored=JSON.parse(history.pop());
  assert(!cloudTogether(restored)&&cloudSolve(level,restored),'Undo must restore a playable state');
  console.log('Level '+(index+1)+': solved in '+count+' moves');
 }
 assert(cloudStep(cloudLevels[0],cloudInitial(cloudLevels[0]),'m',0)===null,'Cannot walk into sky');
 assert(cloudStep(cloudLevels[3],{m:[0,2],b:[0,4],on:false},'m',1)===null,'Cannot enter closed yellow bridge');
 assert(cloudStep(cloudLevels[7],{m:[0,2],b:[2,1],on:false},'b',1)===null,'Cannot enter closed green bridge');
 assert(cloudStep(cloudLevels[7],{m:[1,2],b:[2,2],on:false},'m',0)===null,'Cannot release occupied green bridge');
 assert(cloudStep({map:['Ms=B']},{m:[0,0],b:[0,2],on:true},'m',1)===null,'Cannot close occupied yellow bridge');
 assert(cloudStep(cloudLevels[0],cloudInitial(cloudLevels[0]),'wrong',1)===null,'Invalid figure');
 assert(cloudStep(cloudLevels[0],cloudInitial(cloudLevels[0]),'m',9)===null,'Invalid direction');
 console.log('All game rules, level solutions, undo states and script syntax passed.');
`,{console});

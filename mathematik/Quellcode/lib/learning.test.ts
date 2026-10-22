import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as L from './learning.ts';
import {checkPrepField} from './preparation.ts';
import {guidedProblem,learningGoals,specificFeedback} from './guidance.ts';
import {correct,type Topic} from './math.ts';

function solvedWork(t:L.LearnTask):L.TaskWork {
 return {...L.blankWork(),answers:Object.fromEntries(t.exercise.fields.map(f=>[f.id,typeof f.answer==='number'?String(f.answer).replace('.',','):f.answer])),confidence:'sure'};
}

test('all 15 skills generate solvable tasks and round-trip with visuals',()=>{
 assert.equal(L.skillIds.length,15);
 for(const skill of L.skillIds)for(let i=0;i<24;i++){
  const t=L.makeSkillTask(skill,913+i*79,i),w=solvedWork(t);
  assert.ok(L.taskCorrect(t,w),`${skill}/${i}: ${JSON.stringify(t.exercise.fields)}`);
  assert.ok(!L.taskCorrect(t,L.blankWork()));
  assert.ok(t.exercise.solution.length>0);
  const state=L.emptyLearning();
  state.runs.sample={id:'sample',day:'2026-10-21',mode:'practice',tasks:[t,L.makeSkillTask(skill,1877+i,i+1)],work:{[t.id]:w},submitted:false};
  const restored=L.restoreLearning(JSON.parse(JSON.stringify(state)));
  assert.ok(restored.runs.sample,`${skill}/${i}: saved run rejected`);
  assert.ok(L.taskCorrect(restored.runs.sample.tasks[0],restored.runs.sample.work[t.id]));
 }
});

test('diagnosis covers all skills; legacy 14-task runs remain readable',()=>{
 const state=L.emptyLearning(),run=L.makeDiagnosis('2026-10-21',1);
 assert.equal(run.tasks.length,30);
 for(const skill of L.skillIds)assert.equal(run.tasks.filter(t=>t.skill===skill).length,2);
 state.runs[run.id]=run;
 assert.equal(L.restoreLearning(state).runs[run.id].tasks.length,30);
 run.tasks=run.tasks.slice(0,14);
 assert.equal(L.restoreLearning(state).runs[run.id].tasks.length,14);
});

test('daily challenges use four different skills across the expanded range',()=>{
 const covered=new Set<L.Skill>();
 for(let day=1;day<=28;day++){
  const r=L.makeDaily('challenge',`2026-10-${String(day).padStart(2,'0')}`,L.emptyLearning());
  assert.equal(r.tasks.length,4);
  assert.equal(new Set(r.tasks.map(t=>t.skill)).size,4);
  r.tasks.forEach(t=>covered.add(t.skill));
 }
 assert.equal(covered.size,15);
 assert.equal(L.makeDaily('mental','2026-10-21',L.emptyLearning()).tasks.length,5);
});

test('viewing a solution cannot earn a task star or secure mastery',()=>{
 const state=L.emptyLearning(),run=L.makePractice('2026-10-21',state,'fractions'),t=run.tasks[0];
 const w={...L.checkWork(t,solvedWork(t)),viewed:true};
 const after=L.finishEvidence(state,run,t,w);
 assert.equal(L.rewardTotal(after),0);
 assert.equal(L.profile(after,'fractions').safe,0);
 assert.equal(after.records[0].firstCorrect,false);
 assert.equal(L.finishEvidence(after,run,t,w).records.length,1);
});

test('previous records from every app topic import once without inventing confidence',()=>{
 const records=Object.keys(learningGoals).map((topic,i)=>({topic,date:`2026-10-21T10:00:${String(i).padStart(2,'0')}Z`,prompt:'Beispiel '+topic,first:true,solved:true,hints:0}));
 const once=L.importPrevious(L.emptyLearning(),{records},null);
 assert.equal(once.records.length,13);
 assert.ok(once.records.every(r=>r.confidence==='unsure'));
 assert.equal(L.importPrevious(once,{records},null).records.length,13);
});

test('all lesson practice variants have complete answers and supported controls',()=>{
 for(const topic of Object.keys(learningGoals) as Topic[])for(let step=0;step<learningGoals[topic].types.length;step++)for(let variant=0;variant<6;variant++){
  const p=guidedProblem(topic,step,variant);
  const answer=typeof p.answer==='number'?String(p.answer).replace('.',','):p.answer;
  assert.ok(correct(p,answer),`${topic}/${step}/${variant}`);
  assert.ok(p.type!=='build-chart'&&p.type!=='tally-build'&&p.type!=='line-place',`unsupported guided input ${p.type}`);
  assert.ok(p.hints.length>0&&p.solution.length>0);
 }
});

test('decimal fields accept comma values and reject invalid notation',()=>{
 const f={id:'x',label:'Ergebnis',kind:'decimal' as const,answer:1.25};
 assert.ok(checkPrepField(f,'1,25'));
 assert.ok(checkPrepField(f,'1,250'));
 assert.ok(!checkPrepField(f,'1.25'));
 assert.ok(!checkPrepField(f,''));
});

test('targeted feedback explains denominator, place-value and area mistakes',()=>{
 const f=guidedProblem('fractions',3,0);
 assert.match(specificFeedback({...f,title:'Brüche addieren',fields:['Zähler','Nenner'],answer:'5|8'},'5|16'),/Nenner addiert/);
 const a=guidedProblem('arithmetic',1,0);
 assert.match(specificFeedback({...a,work:{a:347,b:26,op:'·'}},String(347*(2+6))),/Zehner-Teilprodukt/);
 const m=guidedProblem('measure',0,0);
 assert.match(specificFeedback({...m,unit:'cm',shape:{kind:'rectangle',a:6,b:4}},'24'),/Fläche berechnet/);
});

test('malformed imported visuals are rejected rather than rendered',()=>{
 const state=L.emptyLearning(),run=L.makePractice('2026-10-21',state,'fractions');
 state.runs[run.id]=run;
 const raw=JSON.parse(JSON.stringify(state));
 raw.runs[run.id].tasks[0].exercise.shape={kind:'fraction',a:2,b:1000000};
 assert.equal(Object.keys(L.restoreLearning(raw).runs).length,0);
});

test('legacy imported confidence does not count as independently reported confidence',()=>{
 const state=L.emptyLearning();
 state.records=[{id:'legacy',skill:'fractions',day:'2026-10-21',mode:'previous',firstCorrect:true,solved:true,hints:0,viewed:false,confidence:'sure'}];
 assert.equal(L.profile(state,'fractions').safe,0);
});

test('profiles use chronological evidence and bring older secure topics back for review',()=>{
 const state=L.emptyLearning(),today=L.berlinDay();
 for(let i=0;i<6;i++)for(const skill of L.skillIds)state.records.push({id:skill+i,skill,day:skill==='geometry'?'2020-01-01':today,mode:'practice',firstCorrect:true,solved:true,hints:0,viewed:false,confidence:'sure'});
 assert.equal(L.priorities(state)[0].skill,'geometry');
 state.records.push({id:'late-import',skill:'fractions',day:'2020-01-01',mode:'previous',firstCorrect:false,solved:false,hints:0,viewed:false,confidence:'unsure'});
 assert.equal(L.profile(state,'fractions').safe,6);
});

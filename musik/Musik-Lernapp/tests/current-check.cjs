// Current application integration tests in a DOM fixture; no browser automation.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'..');let assertions=0;
function ok(value,message){assert.ok(value,message);assertions++;}
function boot(url='https://music.example/',saved=[],blocked=false){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e));
 const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url,runScripts:'outside-only',virtualConsole:vc});
 const w=dom.window;w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLMediaElement.prototype.pause=function(){};w.HTMLMediaElement.prototype.play=function(){return Promise.resolve();};w.URL.createObjectURL=()=> 'blob:fixture';w.URL.revokeObjectURL=()=>{};w.requestAnimationFrame=()=>1;w.cancelAnimationFrame=()=>{};w.matchMedia=()=>({matches:false,addEventListener(){}});
 for(const [k,v]of saved)w.localStorage.setItem(k,v);if(blocked)Object.defineProperty(w,'localStorage',{value:{getItem(){throw Error('Storage blocked')},setItem(){throw Error('Storage blocked')},removeItem(){throw Error('Storage blocked')}}});
 const context=dom.getInternalVMContext(),run=code=>vm.runInContext(code,context),doc=w.document;
 for(const el of doc.querySelectorAll('script[src]')){const name=el.getAttribute('src').split('?')[0];vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),context,{filename:name});}
 const click=id=>{const e=doc.getElementById(id);ok(e,'Missing '+id);e.click();};
 return {dom,w,doc,run,click,errors,close:()=>w.close()};
}
const e=boot(),{doc,run,click}=e;
// Die fünf sichtbaren Hauptbereiche müssen mit ihren Lernansichten verknüpft sein.
ok(doc.querySelectorAll('nav.mainNav button').length===5,'Five primary navigation choices');
ok(!!doc.querySelector('script[src^="taktlabor.js"]'),'Taktlabor loaded');
ok(!!doc.querySelector('link[href^="taktlabor.css"]'),'Taktlabor stylesheet loaded');

ok(doc.querySelector('#simpleStudent'),'First visit chooses a role');click('simpleStudent');ok(doc.querySelector('#guideResume'),'Student has next step');
ok(!!doc.querySelector('.cleanHero'),'One featured next step');
ok(doc.querySelectorAll('.cleanAction').length===3,'Three simple alternatives');
ok(!!doc.querySelector('.cleanProgress progress'),'Accessible learning progress');
run("setView('themen')");
ok(doc.querySelectorAll('[data-guide-topic]').length===7,'Seven learning topics visible');
doc.querySelectorAll('[data-guide-topic]')[0].click();
ok(!!doc.querySelector('.cleanFocus'),'Topic recommends next lesson');
ok(!!doc.querySelector('.cleanLessons'),'Every step remains available');
click('guideAllTopics');
ok(doc.querySelectorAll('[data-guide-topic]').length===7,'Topic back navigation');
run("setView('home')");


// Regression: eine kurze Notenzeile darf auf dem iPhone keine falsche Wischanweisung ausgeben.
ok(!run('pathTimeline(["e","e"],4,{sub:2,meter:false})').includes('Breite Notenzeile'),'No scrolling advice when both eighths fit');
ok(run('pathTimeline(["e","e"],4,{sub:2,meter:false})').includes('width:260px'),'Short notation keeps a compact natural width');
run("pathSelect(MUSIC_PATH.findIndex(d=>d.key==='teile'),1)");
ok(!!doc.querySelector('.partsLab #anatomyExample'),'Five visual notation components use contextual examples');
ok(doc.querySelectorAll('[data-anatomy]').length===5,'All five anatomy choices available');
doc.querySelector('[data-anatomy="4"]').click();
ok(doc.querySelector('#anatomyExample').textContent.includes('Punktierte Viertelnote'),'Dot selection shows dotted-note comparison');
ok(doc.querySelector('#anatomyExample').querySelectorAll('svg').length===2,'Dotted note compares two actual notation glyphs');
ok(doc.querySelector('[data-anatomy="4"]').getAttribute('aria-pressed')==='true','Chosen anatomy part accessible to screen readers');
doc.querySelector('[data-anatomy="3"]').click();
ok(doc.querySelector('#anatomyExample').textContent.includes('zwei Achtelnoten'),'Beam selection shows exactly two eighths');
ok(doc.querySelector('#anatomyExample').textContent.includes('musst nicht wischen'),'Beam example says why no swiping is necessary');
run("setView('home')");

run("setView('exerciseHub')");
ok(doc.querySelectorAll('[data-guide-practice]').length===6,'Six exercise topics not all expanded');
ok(!!doc.querySelector('#guideMini'),'Quick practice available');
doc.querySelectorAll('[data-guide-practice]')[2].click();
ok(!!doc.querySelector('#practicePanel'),'Chosen topic has focused exercise');
ok(doc.querySelector('#practicePanel').textContent.includes('Takte'),'Correct topic after selection');
ok(!!doc.querySelector('#tlOpen'),'Taktlabor preserved after topic selection');
click('tlOpen');
ok(run('view')==='taktlabor','Taktlabor reached from exercise area');
ok(!!doc.querySelector('#taktlaborTimeline'),'Time grid visible');
ok(doc.querySelectorAll('nav.mainNav button').length===5,'All five main choices remain visible');
for(let level=1;level<=3;level++){
 const button=doc.querySelector('[data-tl-level="'+level+'"]');
 ok(button,'Level selector '+level);button.click();
 for(let task=0;task<6;task++){
  ok(doc.querySelectorAll('.tlChoices button').length===4,'Four answer choices');
  ok(doc.querySelectorAll('#taktlaborTimeline [data-tl-index]').length>=2,'Timeline elements');
  if(task===0){click('tlHint');ok(!!doc.querySelector('.tlHint'),'Progressive hint available');}
  click('tlSolution');
  ok(!!doc.querySelector('#tlFeedback'),'Worked solution available');
  ok(doc.querySelector('#tlFeedback').textContent.includes('Richtige Antwort'),'Solution explains answer');
  click('tlNext');
 }
}
run("setView('home')");
ok(!!doc.querySelector('#guideResume'),'Return to existing learning path');

const keys=run('MUSIC_PATH.map(d=>d.key)');ok(keys.length===27&&new Set(keys).size===27,'27 unique lessons');
ok(run('guideTopics.flatMap(t=>t.keys).length===MUSIC_PATH.length'),'Topics cover all lessons');ok(run('guideTopics.flatMap(t=>t.keys).every(k=>MUSIC_PATH.some(d=>d.key===k))'),'Topic links valid');
ok(run("notes.map(n=>n.units).join(',')==='16,8,4,2,1'"),'Note durations');ok(run('dotted.every(n=>n.units===val(n.id[0])*1.5)'),'Dotted durations');ok(run('val("barrest",3)===12&&val("barrest",4)===16'),'Whole-measure rest adapts to meter');
for(const book of ['learn','work']){const data=run(`MUSIC_DOCUMENT_CONTENTS.${book}`);ok(fs.existsSync(path.join(root,data.file.split('?')[0])),'PDF exists');for(const g of data.groups)for(const item of g.items){ok(item.page>0&&item.end>=item.page&&item.end<=data.pages,'PDF page in range');if(item.solution)ok(item.solution<=data.pages,'Solution page in range');}}
// All current learning flows including hints, playback callbacks and every answer.
let answers=0;
for(let i=0;i<keys.length;i++){
 run(`pathSelect(${i},0)`);ok(doc.querySelectorAll('.simpleStage').length===1,'One stage status');ok(doc.querySelector('#pathExample'),'Explanation advances');ok(fs.existsSync(path.join(root,doc.querySelector('.pathComic img').getAttribute('src'))),'Lesson illustration exists');
 const d=run('MUSIC_PATH[pathState.index]');ok(d.questions.length===8,'Eight questions');
 for(const q of d.questions){ok(q.options.includes(q.answer)&&new Set(q.options).size===q.options.length,'Valid answer options');for(const id of q.ids||[])ok(id==='?'||run(`!!get(${JSON.stringify(id)})`),'Known notation symbol');}
 click('pathExample');click('pathListen');ok(doc.querySelector('#rhythmAudio').src==='blob:fixture','Audio synthesized');const player=doc.querySelector('#rhythmAudio');player.onplaying?.();player.onended?.();
 for(let j=0;j<3;j++)click('pathExplainNext');ok(run('pathState.stages[pathState.index]===2'),'Guided stage');
 click('pathHelp');ok(doc.querySelectorAll('.pathHints li').length===1,'Progressive hint');
 let q=run('MUSIC_PATH[pathState.index].questions[0]'),index=run('pathOptions').indexOf(q.answer);doc.querySelectorAll('[data-path-answer]')[index].click();answers++;ok(doc.querySelector('#pathFeedback').classList.contains('good'),'Correct guided feedback');click('pathIndependent');
 for(let j=0;j<7;j++){
  q=run(`MUSIC_PATH[pathState.index].questions[${j+1}]`);index=run('pathOptions').indexOf(q.answer);doc.querySelectorAll('[data-path-answer]')[index].click();answers++;ok(doc.querySelector('#pathFeedback').classList.contains('good'),'Correct independent feedback');click('pathSelfNext');
 }
 ok(run('pathState.done[pathState.index]'),'Lesson completion saved');ok(doc.querySelector('#pathApply'),'Transfer action available');
}
ok(answers===216,'216 answers');ok(run('learning.topics.reduce((n,t)=>n+t.count,0)===189'),'189 unique independent answers');
run('pathSelect(0,3)');let before=run('learning.step');doc.querySelector('[data-path-answer]').click();ok(run('learning.step')===before,'Repeating does not double count');
run('pathSelect(0,3);pathState.attempted[0]=false');click('pathTeacherTip');let q=run('MUSIC_PATH[0].questions[1]');doc.querySelectorAll('[data-path-answer]')[run('pathOptions').indexOf(q.answer)].click();ok(run('learning.step')===before,'Assisted answer not counted as independent');
run('pathSelect(0,3);pathState.attempted[0]=false');q=run('MUSIC_PATH[0].questions[1]');doc.querySelectorAll('[data-path-answer]')[run('pathOptions').findIndex(a=>a!==q.answer)].click();ok(doc.querySelector('#pathFeedback').classList.contains('bad'),'Wrong-answer feedback');ok(doc.querySelector('#pathFeedback').textContent.includes(q.why),'Wrong-answer explanation');
// Every exercise entry and direct route remains reachable.
for(const [, ,actions]of run('exerciseGroups'))for(const [id]of actions){run(`openExercise(${JSON.stringify(id)})`);ok(doc.querySelector('#main').textContent.length>50,'Exercise '+id);}
for(const route of run('[...interfaceRoutes]')){run(`setView(${JSON.stringify(route)})`);ok(doc.querySelector('#main').textContent.length>50,'Route '+route);}
// Teacher topics, individual lessons and all PDF targets.
run("guideChooseRole('teacher')");for(const t of run('guideTopics'))for(const key of t.keys){run(`guideTeacherTopic=${JSON.stringify(t.id)};guideTeacherKey=${JSON.stringify(key)};guideTeacherTab='auftrag';setView('home')`);ok(doc.querySelector('#guideAssignment').value.includes('schritt='+key),'Assignment deep link '+key);run("guideTeacherTab='material';render()");ok(doc.querySelectorAll('.simpleMaterials a').length===3,'Three matching PDF links');}
ok(run("MUSIC_PATH.find(d=>d.key==='vierertakt').questions[2].ids.join(',')==='qr,qr,qr,qr'"),'Four quarter rests are pictured as four rests');ok(run("MUSIC_PATH.every(d=>d.questions.every(q=>!/(?:^|[^\\d])(?:1|½) Schläge/.test(q.answer)))"),'Singular beat wording');
// Bank arithmetic, shuffled answers and six perfect check results.
for(let topic=0;topic<6;topic++){const bank=run(`smartBank(${topic})`);ok(bank.length>=10,'Smart bank coverage');for(const q of bank){ok(q.options.includes(q.answer)&&new Set(q.options).size===q.options.length,'Smart bank options');if(q.ids&&Number.isFinite(q.missing))ok(q.ids.reduce((n,id)=>n+run(`val(${JSON.stringify(id)},${q.m})`),0)+(q.missing||0)===q.m*4,'Smart bank total');}}
run("startSmart('check')");for(let i=0;i<12;i++){q=run('smart.round');doc.querySelectorAll('[data-smart-answer]')[q.options.indexOf(q.answer)].click();click('smartNext');}ok(run('smart.correct')===12,'Perfect 12-question check');
const backup=run('exportLearningBackup()');ok(!!run('validateLearningBackup(exportLearningBackup()).summary'),'Backup roundtrip validates');
// The logo must return home without replacing the selected lesson.
run('pathSelect(14,1)');doc.querySelector('.brand').click();ok(run("view==='home'"),'Logo opens home');ok(run('pathState.index')===14,'Logo preserves selected lesson');
// A completed last lesson leads back to an earlier unfinished one.
run('pathState.done[2]=false;pathState.index=26');ok(run('guideResumeIndex()')===2,'Resume wraps to an unfinished lesson');run('pathState.done[2]=true;guideChooseRole("student")');ok(doc.querySelector('#main h1').textContent.includes('geübt'),'All-complete state is clear');click('guideResume');ok(run('view')==='smart','All-complete action starts review');
// Audio fallback is visible even when the dock was minimized.
run("setDockMinimized(true);play(['q'],4)");doc.querySelector('#rhythmAudio').onerror();ok(!doc.querySelector('.audioDock').classList.contains('dockMinimized'),'Audio error restores dock');ok(!doc.querySelector('#audioSettings').hidden,'Audio error exposes native player');
// Isolated rhythmic fragments do not claim to be a full measure in a check.
run("startSmart('review',0);smart.round=smartBank(0).find(q=>q.meter===false&&q.ids&&q.ids.length);renderSmart()");ok(!!doc.querySelector('.pathScore'),'Fragment uses unmetered notation');
// Generated pieces retain exact measure duration for every option combination.
for(const m of [3,4])for(const n of [2,3,4])for(const level of [1,2])for(let variant=0;variant<8;variant++){run(`pieceMeter=${m};pieceLength=${n};pieceLevel=${level};newPiece()`);const bars=run('pieceBars');ok(bars.length===n,'Requested number of measures');for(const bar of bars)ok(bar.reduce((sum,id)=>sum+run(`val('${id}',${m})`),0)===m*4,'Complete generated measure');}
// Every lab task: use the actual prediction/insertion/edit/grade/next handlers.
let labTasks=0;
for(const mode of ['dictation','exchange','repair','dots'])for(const level of [1,2,3]){
 run(`openLab('${mode}');labLevel=${level};labIndex=0;resetLab();renderLab()`);const count=run('currentLabBank().length');
 for(let i=0;i<count;i++){
  const x=run('labQuestion()');if(x.ids)ok(x.ids.reduce((sum,id)=>sum+run(`val('${id}',${x.m})`),0)===x.m*4,'Lab measure total');
  if(mode==='dictation'){click('labHearTarget');for(const id of x.ids)doc.querySelector(`[data-lab-insert="${id}"]`).click();click('labHearOwn');}
  if(mode==='exchange'){const count=x.source.reduce((sum,id)=>sum+run(`val('${id}')`),0)/run(`val('${x.target}')`);doc.querySelector(`[data-lab-predict="${count}"]`).click();for(let k=0;k<count;k++)doc.querySelector('[data-lab-insert]').click();}
  if(mode==='repair'){doc.querySelector(`[data-lab-entry="${x.slot}"]`).click();doc.querySelector(`[data-lab-insert="${x.ids[x.slot]}"]`).click();}
  if(mode==='dots'){const half=run(`val('${x.id}')`)/3;doc.querySelector(`[data-dot-part="${half}"]`).click();}
  click('labCheck');ok(run('labGood'),'Correct lab answer '+mode);let countBefore=run('learning.step');click('labCheck');ok(run('learning.step')===countBefore,'Lab does not double count');labTasks++;click('labNext');
 }
}
ok(labTasks===47,'47 lab tasks');
for(const tab of run('Object.keys(musicGames)')){run(`openGame('${tab}')`);ok(doc.querySelector('#main').textContent.length>100,'Game '+tab);}
ok(!!run('validateGameSessions(exportLearningBackup().data[gameSessionKey])'),'Game state validation');
// Dots should not collide with staff lines in any view.
for(const id of ['hd','qd','ed','wd','hrd','qrd','erd','wrd']){const svg=run(`symbol('${id}')`),m=svg.match(/<circle cx="75" cy="([\d.]+)"/);ok(m&&!([20,35,50,65,80].includes(Number(m[1]))),'Augmentation dot between staff lines '+id);}
// Dotted explanation uses the same quiet lesson layout.
run("dotTab='learn';setView('dotted')");ok(doc.querySelector('.simpleStage'),'Dotted explanation has stage status');ok(doc.querySelector('.simpleLessonMore #pathDotCalc'),'Optional dotted actions are grouped');
// Audio data: real sustained waveform, silence during rests.
run("globalThis.qaWave=makeRhythmWav([{u:8},{u:4,rest:true},{u:4}],4,{silentClick:true,fullDuration:true}).buffer");const wav=new DataView(run('qaWave')),rate=22050,sec=60/80;let max=0;for(let i=Math.ceil(1.5*sec*rate);i<Math.floor(1.85*sec*rate);i++)max=Math.max(max,Math.abs(wav.getInt16(44+i*2,true)));ok(max>1000,'Held note sounds throughout');for(let i=Math.ceil(2*sec*rate);i<Math.floor(3*sec*rate);i++)assert.equal(wav.getInt16(44+i*2,true),0);ok(true,'Rest is silent');
const saved=Array.from({length:e.w.localStorage.length},(_,i)=>{const k=e.w.localStorage.key(i);return [k,e.w.localStorage.getItem(k)];});e.close();
const direct=boot('https://music.example/?schritt=system#lernen',saved);ok(direct.doc.querySelector('#main h1').textContent.includes('Notenlinien'),'Direct lesson link reload');ok(direct.run('guideRole')==='student','Role retained');ok(direct.run('pathState.done.every(Boolean)'),'Completed lessons retained');ok(direct.errors.length===0,'No fixture errors');direct.close();
const blocked=boot('https://music.example/',[],true);blocked.click('simpleStudent');blocked.click('guideResume');ok(blocked.run('view')==='learn','Blocked storage still permits learning');ok(!blocked.run('pathStorage'),'Blocked storage detected');blocked.close();
const corrupt=boot('https://music.example/',[['rhythmuswerkstatt.role.v1','{}']]);ok(!!corrupt.doc.querySelector('#simpleStudent'),'Invalid stored role offers role choice');corrupt.close();
console.log(`PASS: ${assertions} assertions; 27 complete lesson flows, 216 answers, independent/assisted scoring, every route and exercise, 27 teacher assignments, PDF mapping, check, backup, 96 generated pieces, 47 lab tasks, six games, unavailable storage, notation and WAV.`);

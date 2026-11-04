const __browserTypes=require('playwright');
/* Focused browser regression checks for the existing Chemie app.
 * Run: NODE_PATH=/path/to/node_modules node thermal-smoke.cjs /path/to/app.html
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const app=path.resolve(process.argv[2]||path.join(__dirname,'../Chemie_Entdeckerlabor_V7_2.html'));
(async()=>{
 const browser=await __browserTypes[process.env.CHEMIE_BROWSER||'chromium'].launch({headless:true});
 const ctx=await browser.newContext({viewport:{width:1365,height:1000}});
 const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(pathToFileURL(app).href);
 assert.deepEqual(errors,[],'Startup errors');
 assert.match(await p.title(),/Version 8\.0/);
 const originals=['matter','devices','safety','solubility','heating','burner','method','missions','deep','quiz','sheet','v4lab','v4play','v4study','v5academy','chem6'];
 for(const id of originals){await p.locator(`#nav [data-page="${id}"]`).click();assert.equal(await p.locator('#page-'+id).isVisible(),true,'Existing route '+id)}
 await p.locator('#nav [data-page=thermal]').click();
 assert.equal(await p.locator('#page-thermal').isVisible(),true);
 assert.match(await p.locator('#sideProgressText').innerText(),/von 17/);
 // Model, prediction and reset, including stopping playback on navigation.
 await p.locator('input[name=thPrediction][value=wood]').check();
 await p.locator('#thTime').evaluate(e=>{e.value='10';e.dispatchEvent(new Event('input',{bubbles:true}))});
 assert.match(await p.locator('#thPredictionFeedback').innerText(),/noch nicht/);
 assert.match(await p.locator('#thObservation').innerText(),/Metallstäbe/);
 await p.locator('#thReset').click();assert.equal(await p.locator('#thTime').inputValue(),'0');
 await p.locator('#thPlay').click();await p.locator('#nav [data-page=home]').click();
 const paused=await p.locator('#thTime').inputValue();await p.waitForTimeout(800);assert.equal(await p.locator('#thTime').inputValue(),paused);
 await p.locator('#nav [data-page=thermal]').click();
 // The classroom sketch has two wax markers per rod; no made-up readings.
 assert.equal(await p.locator('#thWaxSamples ellipse').count(),4);
 await p.locator('#thNotebookCompare').click();assert.match(await p.locator('#thNotebookObservation').innerText(),/keine nachträglich/);
 await p.locator('#thNotebookTime').evaluate(e=>{e.value='2';e.dispatchEvent(new Event('input',{bubbles:true}))});assert.match(await p.locator('#thNotebookObservation').innerText(),/näheren/);
 await p.locator('#thNotebookReset').click();assert.equal(await p.locator('#thNotebookHeat').getAttribute('opacity'),'0');
 await p.locator('[data-th-protocol=interpretation]').click();assert.match(await p.locator('#thProtocolFeedback').innerText(),/Noch nicht/);
 await p.locator('[data-th-protocol=observation]').click();assert.match(await p.locator('#thProtocolFeedback').innerText(),/Richtig/);
 // Fair comparison planning and six observation/interpretation tasks.
 await p.locator('#thFairSize').selectOption('different');await p.locator('#thFairWax').selectOption('different');await p.locator('#thFairHeat').selectOption('different');
 await p.locator('#thFairCheck').click();assert.match(await p.locator('#thFairFeedback').innerText(),/Überarbeite/);
 for(const id of ['thFairSize','thFairWax','thFairHeat'])await p.locator('#'+id).selectOption('same');
 await p.locator('#thFairCheck').click();assert.match(await p.locator('#thFairFeedback').innerText(),/Gut geplant/);
 for(let i=0;i<6;i++){await p.locator('#thSortTask').getByRole('button',{name:i%2===0?'Beobachtung':'Auswertung',exact:true}).click();await p.locator('#thSortTask').getByRole('button',{name:'Nächste Aussage →',exact:true}).click()}
 assert.match(await p.locator('#thSortProgress').innerText(),/6 von 6 beim ersten/);
 // A wrong answer gives an explanation, can be corrected, and is marked assisted.
 const expected=['Vom wärmeren zum kälteren Bereich','Kupfer','Metall führt Energie schneller von der wärmeren Hand weg','Länge, Dicke, Anfangstemperatur und Erwärmung; gleiche Beobachtungsdauer'];
 await p.locator('#thQuestions article').nth(0).getByRole('button',{name:'Nur von oben nach unten',exact:true}).click();
 assert.match(await p.locator('#thQuestions article').nth(0).locator('[role=status]').innerText(),/Noch nicht/);
 for(let i=0;i<4;i++)await p.locator('#thQuestions article').nth(i).getByRole('button',{name:expected[i],exact:true}).click();
 assert.match(await p.locator('#thProgress').innerText(),/4 von 4|Thema bearbeitet/);
 await p.locator('#thTime').evaluate(e=>{e.value='10';e.dispatchEvent(new Event('input',{bubbles:true}))});
 assert.match(await p.locator('#thProgress').innerText(),/Thema bearbeitet/);
 assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('chemie5-data')).done.thermal),true);
 const events=await p.evaluate(()=>window.LernCockpit.debug().store.profiles.Standard.events);
 assert(events.some(e=>e.id==='chem-thermal-practice-0'&&e.correct&&e.assisted));
 // Note persistence and no loss of pre-existing learner progress on reload.
 await p.locator('[data-note=thermal-observation]').fill('Das zunächst feste Wachs wurde flüssig.');
 await p.reload();await p.locator('#nav [data-page=thermal]').click();
 assert.equal(await p.locator('[data-note=thermal-observation]').inputValue(),'Das zunächst feste Wachs wurde flüssig.');
 assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('chemie5-data')).done.thermal),true);
 // Filtered knowledge test, wrong-answer explanation and route back to this topic.
 await p.locator('#thGoQuiz').click();assert.equal(await p.locator('#quizTopic').inputValue(),'Wärmeleitfähigkeit');
 const total=await p.evaluate(()=>state.quiz.questions.length);assert(total>=8);
 for(let i=0;i<total;i++){
  const answer=await p.evaluate(()=>state.quiz.questions[state.quiz.i].correct);
  const selected=i===0?(answer+1)%4:answer;
  await p.locator(`[data-qopt="${selected}"]`).click();
  assert((await p.locator('#quizFeedback').innerText()).length>25);
  await p.locator('#quizNext').click();
 }
 await p.locator('[data-repeat-topic="Wärmeleitfähigkeit"]').click();assert.equal(await p.locator('#page-thermal').isVisible(),true);
 await p.locator('#nav [data-page=sheet]').click();assert.match(await p.locator('#page-sheet').innerText(),/Wärmeleitfähigkeit/);
 await p.locator('#page-sheet [data-go=thermal]').click();
 fs.mkdirSync('chemie-test-artifacts',{recursive:true});
 await p.screenshot({path:'chemie-test-artifacts/thermal-desktop.png',fullPage:true});
 // Phone width, enlarged text and dark theme must fit without horizontal overflow.
 await p.setViewportSize({width:390,height:844});
 await p.screenshot({path:'chemie-test-artifacts/thermal-mobile.png',fullPage:true});
 for(const classes of ['', 'lc-theme-dark v4dark','lc-theme-dark v4dark lc-font-large']){
  await p.evaluate(c=>document.body.className=c,classes);
  const layout=await p.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert(layout.scroll<=layout.width+1,`Mobile overflow: ${JSON.stringify(layout)}`);
 }
 assert.deepEqual(errors,[],'Browser errors');
 await browser.close();console.log('PASS: original routes, model controls, notebook experiment, feedback, progress, saved notes, quiz, print summary and mobile layout.');
})().catch(e=>{console.error(e);process.exit(1)});


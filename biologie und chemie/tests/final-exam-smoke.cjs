const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const app=path.resolve(process.argv[2]||path.join(__dirname,'../Chemie_Entdeckerlabor_V7_2.html'));
(async()=>{
 const b=await chromium.launch({headless:true});const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(pathToFileURL(app).href+'#abschlusstest');
 assert.equal(await p.locator('#page-finaltest').isVisible(),true);assert.equal(await p.locator('#ceIntro').isVisible(),true);assert.equal(await p.locator('#ceSolutions details').count(),0);assert.match(await p.title(),/7\.7/);
 await p.locator('#ceStart').click();assert.match(await p.locator('#cePosition').innerText(),/Aufgabe 1 von 20/);
 await p.locator('#ceReview').click();assert.match(await p.locator('#ceOverviewText').innerText(),/20 von 20 Aufgaben.*nicht vollständig/);
 await p.locator('#ceSubmit').click();assert.match(await p.locator('#ceScore').innerText(),/^0 \/ 40/);assert.equal(await p.locator('#ceSolutions details').count(),20);assert.equal(await p.locator('#ceTopicResults article').count(),8);
 assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('chemie5-data')||'{}').done?.finaltest||false),false);
 // Partial credit must reflect the two correct fields, not mark the whole task wrong.
 await p.locator('#ceNew').click();await p.locator('#ceNext').click();
 for(const[j,v]of ['0','0','0'].entries())await p.locator(`#ceInputs select[data-ce-part="${j}"]`).selectOption(v);
 await p.locator('#ceReview').click();await p.locator('#ceSubmit').click();assert.match(await p.locator('#ceScore').innerText(),/^2 \/ 40/);
 await p.locator('#ceNew').click();
 const answers=[['1'],['0','1','0'],['2'],['3'],['0','1','2'],['0','1','2'],['0','1'],['2'],['1'],['0'],['0','1'],['100','78'],['3'],['2'],['72','8'],['0','1','2'],['1','0'],['0','1'],['2'],['1']];
 for(let i=0;i<answers.length;i++){
  const parts=p.locator('#ceInputs fieldset');assert.equal(await parts.count(),answers[i].length);
  for(let j=0;j<answers[i].length;j++){
   const part=parts.nth(j),select=part.locator('select'),text=part.locator('input[type=text]');
   if(await select.count())await select.selectOption(answers[i][j]);
   else if(await text.count())await text.fill(answers[i][j]);
   else await part.locator(`input[value="${answers[i][j]}"]`).check();
  }
  if(i===0){
   await p.reload();assert.equal(await p.locator('#ceIntro').isVisible(),true);await p.locator('#ceStart').click();assert.equal(await p.locator('#ceInputs input[value="1"]').isChecked(),true);
  }
  assert.equal(await p.locator('#ceResults').isVisible(),false);
  await p.locator('#ceNext').click();
 }
 assert.equal(await p.locator('#ceOverview').isVisible(),true);assert.match(await p.locator('#ceOverviewText').innerText(),/Alle 20 Aufgaben/);
 await p.locator('#ceSubmit').click();assert.match(await p.locator('#ceScore').innerText(),/^40 \/ 40 Punkte · 100 %/);
 assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('chemie5-data')).done.finaltest),true);
 // Correct solutions show only in the result; topic training retains the submitted score.
 const first=p.locator('#ceSolutions details').first();await first.locator('summary').click();assert.match(await first.innerText(),/Richtige Lösung/);assert.match(await first.innerText(),/Erklärung/);
 await p.locator('#ceTopicResults article').filter({hasText:'Wärmeleitfähigkeit'}).getByRole('button').click();assert.equal(await p.locator('#page-thermal').isVisible(),true);
 await p.locator('#nav [data-page=finaltest]').click();assert.match(await p.locator('#ceScore').innerText(),/^40 \/ 40/);
 await p.reload();assert.equal(await p.locator('#ceResults').isVisible(),true);assert.match(await p.locator('#ceScore').innerText(),/^40 \/ 40/);
 // Returning to other learning pages does not lose the draft or results.
 await p.locator('#nav [data-page=home]').click();await p.getByRole('button',{name:'Abschlusstest zur Klassenarbeit öffnen',exact:true}).click();assert.equal(await p.locator('#page-finaltest').isVisible(),true);
 fs.mkdirSync('chemie-test-artifacts',{recursive:true});await p.screenshot({path:'chemie-test-artifacts/finaltest-results.png',fullPage:true});
 await p.locator('#ceNew').click();await p.setViewportSize({width:390,height:844});
 assert((await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth))<=1,'Mobile overflow');
 await p.locator('#ceNext').click();await p.screenshot({path:'chemie-test-artifacts/finaltest-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);await b.close();console.log('PASS: final exam 20 tasks / 40 points, empty and partial scores, corrected answers, resume, submission, explanations, topic routes and phone layout.');
})().catch(e=>{console.error(e);process.exit(1)});

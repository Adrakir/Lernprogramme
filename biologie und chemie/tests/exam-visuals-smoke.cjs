const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {pathToFileURL}=require('node:url'),{chromium}=require('playwright');
const app=path.resolve(process.argv[2]||path.join(__dirname,'../Chemie_Entdeckerlabor_V7_2.html'));
(async()=>{
 const browser=await chromium.launch({headless:true});const p=await browser.newPage({viewport:{width:1280,height:960}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(pathToFileURL(app).href+'#abschlusstest');assert.match(await p.title(),/Version 7\.8/);
 // Print sheet includes all tasks and diagrams, without answers; no test submission.
 await p.evaluate(()=>window.print=()=>{});await p.locator('#cePrintTasks').click();
 assert.equal(await p.locator('#cePrintDocument article').count(),20);assert((await p.locator('#cePrintDocument svg').count())>=18);
 assert.equal(await p.locator('#cePrintDocument .ce-print-answer').count(),0);
 assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('chemie5-final-exam-v1')).phase),'intro');
 await p.emulateMedia({media:'print'});assert.equal(await p.locator('.app').isVisible(),false);assert.equal(await p.locator('#cePrintDocument').isVisible(),true);
 await p.emulateMedia({media:'screen'});await p.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
 await p.locator('#ceStart').click();assert.equal(await p.locator('#ceFigure svg').count(),1);
 await p.getByRole('button',{name:'Bild vergrößern',exact:true}).click();assert.equal(await p.locator('#ceImageDialog').isVisible(),true);await p.getByRole('button',{name:'Bild schließen',exact:true}).click();
 const jump=async i=>{await p.locator('#ceReview').click();await p.locator('#ceOverviewGrid button').nth(i).click()};
 // Play, pause, seek, reset and navigation stop for the wax/rod model.
 await jump(8);let slider=p.locator('[data-exam-animation=thermal-wax]');assert.equal(await slider.inputValue(),'0');
 await p.getByRole('button',{name:'▶ Animation abspielen',exact:true}).click();await p.waitForTimeout(750);await p.getByRole('button',{name:'⏸ Pause',exact:true}).click();const paused=await slider.inputValue();assert(Number(paused)>0);await p.waitForTimeout(750);assert.equal(await slider.inputValue(),paused);
 await slider.evaluate(e=>{e.value='8';e.dispatchEvent(new Event('input',{bubbles:true}))});assert.equal(await p.locator('#ceFigure ellipse[fill="#e9ac54"]').count(),2);
 await p.getByRole('button',{name:'↺ Zurücksetzen',exact:true}).click();assert.equal(await slider.inputValue(),'0');
 await p.getByRole('button',{name:'▶ Animation abspielen',exact:true}).click();await p.locator('#nav [data-page=home]').click();const n=await slider.inputValue();await p.waitForTimeout(750);assert.equal(await slider.inputValue(),n);
 await p.locator('#nav [data-page=finaltest]').click();
 // Heating curve stays at 100 °C in the boiling region, with bubbles shown.
 await jump(12);slider=p.locator('[data-exam-animation=boiling-plateau]');await slider.evaluate(e=>{e.value='7';e.dispatchEvent(new Event('input',{bubbles:true}))});assert.match(await p.locator('#ceFigure').innerText(),/100 °C/);
 assert.equal(await p.locator('#ceSolutions details').count(),0,'No solutions before submission');
 fs.mkdirSync('chemie-test-artifacts',{recursive:true});await p.screenshot({path:'chemie-test-artifacts/animated-heating.png',fullPage:true});
 // Dissolving preserves every salt model particle, including residual sediment.
 await jump(13);const particles=()=>p.locator('#ceFigure circle[fill="#d39535"]');const count=await particles().count();assert.equal(count,17); // 16 particles + one legend symbol.
 slider=p.locator('[data-exam-animation=solubility-saturation]');await slider.evaluate(e=>{e.value='10';e.dispatchEvent(new Event('input',{bubbles:true}))});assert.equal(await particles().count(),count);
 // Reduced-motion mode is explicitly stepped and creates no playback timer.
 await p.emulateMedia({reducedMotion:'reduce'});await jump(8);slider=p.locator('[data-exam-animation=thermal-wax]');await p.getByRole('button',{name:'Nächster Modellschritt',exact:true}).click();assert.equal(await slider.inputValue(),'1');await p.waitForTimeout(750);assert.equal(await slider.inputValue(),'1');
 await p.setViewportSize({width:390,height:844});assert((await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth))<=1);
 await p.screenshot({path:'chemie-test-artifacts/animated-thermal-phone.png',fullPage:true});
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: illustrated print view, image zoom, three model sequences, play/pause/reset/seek, navigation cleanup, conserved particles and reduced motion.');
})().catch(e=>{console.error(e);process.exit(1)});

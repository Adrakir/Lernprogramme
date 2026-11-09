const __browserTypes=require('playwright');
const assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url'),{chromium}=require('playwright');
const app=path.resolve(process.argv[2]||path.join(__dirname,'../Chemie_Entdeckerlabor_V7_2.html'));
(async()=>{
 const b=await __browserTypes[process.env.CHEMIE_BROWSER||'chromium'].launch({headless:true});const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(pathToFileURL(app).href+'#protokollfehler');assert.equal(await p.locator('#page-protocoltrainer').isVisible(),true);assert.equal(await p.locator('#peCase option').count(),6);
 await p.locator('[data-pe-line="0"]').check();await p.locator('#peCheck').click();assert.match(await p.locator('#peFeedback').innerText(),/1 richtige Aussage/);assert.equal(await p.locator('#peRepairs').isVisible(),false);await p.locator('[data-pe-line="0"]').uncheck();
 const protocolData=await p.evaluate(()=>chemistryErrorProtocols);
 for(let c=0;c<6;c++){
  await p.locator('#peCase').selectOption(String(c));
  for(let i=0;i<protocolData[c].lines.length;i++)if(protocolData[c].lines[i].fix)await p.locator(`[data-pe-line="${i}"]`).check();
  await p.locator('#peCheck').click();assert.equal(await p.locator('#peRepairs').isVisible(),true);
  if(c===0){await p.locator('#peRepairCheck').click();assert.match(await p.locator('#peRepairFeedback').innerText(),/0 von 3/);assert.equal(await p.locator('#peSolution').isVisible(),false)}
  for(let i=0;i<protocolData[c].lines.length;i++)if(protocolData[c].lines[i].fix)await p.locator(`[data-pe-sentence="${i}"]`).selectOption({label:protocolData[c].lines[i].fix});
  await p.locator('#peRepairCheck').click();assert.equal(await p.locator('#peSolution').isVisible(),true);assert.match(await p.locator('#peRepairFeedback').innerText(),/Alle drei/);
  if(c===1){await p.reload();assert.match(await p.locator('#peTotal').innerText(),/2 von 6/)}
 }
 assert.match(await p.locator('#peTotal').innerText(),/6 von 6/);assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('chemie5-data')).done.protocoltrainer),true);
 await p.evaluate(()=>window.print=()=>{});await p.locator('#pePrint').click();assert.equal(await p.locator('#cePrintDocument .pe-print-case').count(),6);assert.match(await p.locator('#cePrintDocument').innerText(),/Meine Verbesserungen/);await p.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
 await p.locator('#pePrintSolutions').click();assert.match(await p.locator('#cePrintDocument').innerText(),/Erklärung:/);await p.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
 await p.goto(pathToFileURL(app).href+'#holz-eisen');await p.locator('#page-thermal').waitFor({state:'visible',timeout:8000});assert.equal(await p.locator('#page-thermal').isVisible(),true);assert.equal(await p.locator('[data-he-gap]').count(),8);
 await p.locator('#heStrong').click();await p.locator('#heTime').evaluate(e=>{e.value='10';e.dispatchEvent(new Event('input',{bubbles:true}))});assert.match(await p.locator('#heObservation').innerText(),/glühend/);
 await p.locator('#heCheck').click();assert.match(await p.locator('#heFeedback').innerText(),/0 von 8/);
 const answers=['wärmeren','kälteren','Eisen','schlechter','verkohlen','glühen','mit geeigneter Messtechnik nach Anleitung','Beobachtung'];
 for(let i=0;i<8;i++)await p.locator(`[data-he-gap="${i}"]`).selectOption(answers[i]);await p.locator('#heCheck').click();assert.match(await p.locator('#heFeedback').innerText(),/8 von 8/);assert.equal(await p.locator('#heSolution').isVisible(),true);
 await p.reload();for(let i=0;i<8;i++)assert.equal(await p.locator(`[data-he-gap="${i}"]`).inputValue(),answers[i]);
 await p.setViewportSize({width:390,height:844});assert((await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth))<=1);await p.locator('#nav [data-page=protocoltrainer]').click();assert((await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth))<=1);
 assert.deepEqual(errors,[]);await b.close();console.log('PASS: six error protocols, false positives, corrections, saved progress, worksheet printing, wood/iron model, eight cloze gaps and mobile layout.');
})().catch(e=>{console.error(e);process.exit(1)});


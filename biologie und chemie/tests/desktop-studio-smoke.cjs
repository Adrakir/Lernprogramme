
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url'),pw=require('playwright');
const app=path.resolve(__dirname,'../Chemie_Entdeckerlabor_V7_2.html'),browserType=process.env.CHEMIE_BROWSER||'chromium';
(async()=>{
 const browser=await pw[browserType].launch({headless:true});
 const p=await browser.newPage({viewport:{width:1440,height:980}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto(pathToFileURL(app).href);
 assert(await p.locator('#chemHeroImage svg').isVisible());
 assert(await p.locator('#chemDemoStage svg').isVisible());
 assert(await p.locator('#chemQuickQuestion').isVisible());
 assert.equal(await p.locator('#chemDirFilters button').count(),4);
 assert.equal(await p.locator('#homeCards .chem-card-art svg').count(),8);
 assert.equal(await p.locator('#chemQuickOptions button').count(),3);
 assert(await p.locator('#luLearn').isVisible());
 await p.locator('#chemDemoRun').click();
 assert.equal(await p.evaluate(()=>ChemistryStudio.previewRunning()),true);
 assert.match(await p.locator('#chemDemoHint').innerText(),/Teilchen/);
 await p.locator('[data-mode=boil]').click();
 assert.equal(await p.evaluate(()=>ChemistryStudio.previewRunning()),false);
 await p.locator('#chemDemoRun').click();
 assert.match(await p.locator('#chemDemoHint').innerText(),/Dampfblasen/);
 await p.locator('[data-mode=flame]').click();
 await p.locator('#chemDemoGo').click();
 assert.equal(await p.locator('#page-burner').isVisible(),true);
 await p.locator('#nav [data-page=home]').click();
 for(const i of [1,0,1,2]){
  await p.locator('#chemQuickOptions [data-answer="'+i+'"]').click();
  assert.equal(await p.locator('#chemQuickNext').isEnabled(),true);
  await p.locator('#chemQuickNext').click();
 }
 assert.match(await p.locator('#chemQuickQuestion').innerText(),/Geschafft/);
 await p.locator('#chemQuickNext').click();
 assert.match(await p.locator('#chemQuickPosition').innerText(),/Frage 1 von 4/);
 await p.locator('[data-chem-group=experiments]').click();
 assert.equal(await p.locator('#homeCards .chem-card-art svg').count(),6);
 await p.locator('#homeCards [data-chem-route=deep]').click();
 assert.equal(await p.locator('#page-deep').isVisible(),true);
 await p.locator('#nav [data-page=home]').click();
 await p.locator('#chemFullQuiz').click();
 assert.equal(await p.locator('#page-quiz').isVisible(),true);
 await p.locator('#nav [data-page=home]').click();
 await p.waitForTimeout(350);await p.screenshot({path:'chemie-test-artifacts/desktop-studio-'+browserType+'.png',fullPage:false});
 assert((await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth))<=1,'Desktop overflow');
 await p.setViewportSize({width:390,height:844});
 assert((await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth))<=1,'Phone overflow');
 assert.deepEqual(errors,[]);
 await browser.close();console.log('PASS '+browserType+': PC hero, actual model interactions, quiz and all laboratory routes');
})().catch(e=>{console.error(e);process.exit(1)});

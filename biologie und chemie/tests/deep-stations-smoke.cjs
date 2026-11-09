const assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url'),browsers=require('playwright');
const engine=process.env.CHEMIE_BROWSER||'chromium';
const app=path.resolve(__dirname,'../Chemie_Entdeckerlabor_V7_2.html');

async function setRange(p,id,value){
 const input=p.locator('#'+id);
 await input.focus();
 await input.press('Home');
 const step=Number(await input.getAttribute('step'))||1;
 for(let i=Number(await input.getAttribute('min'));i<value;i+=step)await input.press('ArrowRight');
 assert.equal(await input.inputValue(),String(value),id+' keyboard value');
}

(async()=>{
 const browser=await browsers[engine].launch({headless:true});
 try{
  for(const viewport of [{width:1366,height:900},{width:390,height:844}]){
   const p=await browser.newPage({viewport}),errors=[];
   p.on('pageerror',e=>errors.push(e.message));
   await p.goto(pathToFileURL(app).href);
   await p.locator('#nav [data-page="deep"]').click();
   assert(await p.locator('#particleTank').isVisible(),'Water, sugar and salt model reachable from navigation');
   await p.locator('#particleSubstance').selectOption('sugar');
   await setRange(p,'particleMass',500);
   assert.equal(await p.locator('#particleDissolved').innerText(),'408 g');
   assert.equal(await p.locator('#particleUndissolved').innerText(),'92 g');
   await p.locator('[data-particle-temp="60"]').click();
   assert.equal(await p.locator('#particleTempVal').innerText(),'60 °C');
   assert.equal(await p.locator('#particleLimit').innerText(),'ca. 574 g');
   assert.equal(await p.locator('#particleUndissolved').innerText(),'0 g');
   await p.locator('[data-particle-temp="40"]').click();
   await p.locator('#particleTemp').focus();
   await p.locator('#particleTemp').press('ArrowRight');
   assert.equal(await p.locator('#particleTempVal').innerText(),'41 °C');
   assert.equal(await p.locator('#particleLimit').innerText(),'ca. 480.9 g');
   assert.equal(await p.locator('[data-particle-temp][aria-pressed="true"]').count(),0);
   await p.locator('#particleTemp').scrollIntoViewIfNeeded();
   const rangeBox=await p.locator('#particleTemp').boundingBox();
   await p.mouse.click(rangeBox.x+rangeBox.width*.75,rangeBox.y+rangeBox.height/2);
   const temp=Number(await p.locator('#particleTemp').inputValue());
   assert(temp>=48&&temp<=52,'Pointer can move temperature to about 50 °C');
   assert.equal(await p.locator('#particleTempVal').innerText(),temp+' °C');
   await p.locator('#particleSubstance').selectOption('salt');
   for(const [temperature,limit] of [[20,72],[40,73],[60,75]]){
    await p.locator('[data-particle-temp="'+temperature+'"]').click();
    assert.equal(await p.locator('#particleLimit').innerText(),'ca. '+limit+' g');
   }
   await p.locator('#particleDemo').click();
   await p.waitForFunction(()=>document.getElementById('particleMass').value==='140');
   assert.equal(await p.locator('#particleUndissolved').innerText(),'65 g');
   await p.locator('#particleReset').click();
   assert.equal(await p.locator('#particleTemp').inputValue(),'20');
   assert.equal(await p.locator('#particleMass').inputValue(),'0');
   await p.locator('[data-deep-q="particles"][data-opt="1"]').click();
   assert.match(await p.locator('#particleFeedback').innerText(),/Waagen/);
   await p.locator('#particleExplanation summary').click();
   assert(await p.locator('#particleExplanation svg').first().isVisible());
   assert.equal(await p.locator('#particleExplanation svg').count(),3);
   assert.match(await p.locator('#particleExplanation').innerText(),/keine Messwerte/);

   await p.locator('[data-lab="boiling"]').click();
   assert.equal(await p.locator('#boilGraph .axis').evaluate(e=>getComputedStyle(e).fill),'none','No black triangle');
   assert.match(await p.locator('#boilInsight').innerText(),/Erwärmung starten/);
   await p.locator('#boilPlay').click();
   await p.waitForFunction(()=>document.getElementById('boilTime').textContent!=='0 min');
   await p.locator('#boilPlay').click();
   const paused=await p.locator('#boilTime').innerText();
   await p.waitForTimeout(500);
   assert.equal(await p.locator('#boilTime').innerText(),paused,'Pause stops heating');
   await p.locator('#boilReset').click();
   for(let i=0;i<8;i++)await p.locator('#boilStep').click();
   assert.equal(await p.locator('#boilRead').innerText(),'60 °C');
   for(let i=0;i<8;i++)await p.locator('#boilStep').click();
   assert.equal(await p.locator('#boilRead').innerText(),'100 °C');
   await p.locator('#boilStep').click();
   assert.equal(await p.locator('#boilRead').innerText(),'100 °C','Normal-power plateau');
   await p.locator('#boilPower').selectOption('10');
   assert.equal(await p.locator('#boilTime').innerText(),'0 min','Power change restarts comparison');
   for(let i=0;i<8;i++)await p.locator('#boilStep').click();
   assert.equal(await p.locator('#boilRead').innerText(),'100 °C','Double power reaches same boiling point sooner');
   await p.locator('#boilStep').click();
   assert.equal(await p.locator('#boilRead').innerText(),'100 °C','Double-power plateau');
   await p.locator('#boilPressure').selectOption('low');
   for(let i=0;i<8;i++)await p.locator('#boilStep').click();
   assert.equal(await p.locator('#boilRead').innerText(),'94 °C');
   await p.locator('[data-deep-q="boiling"][data-opt="1"]').click();
   await p.locator('#boilingExplanation summary').click();
   assert(await p.locator('#boilingExplanation svg').isVisible());
   assert.match(await p.locator('#boilingExplanation').innerText(),/Verdampfen/);

   await p.locator('[data-lab="flames"]').click();
   await setRange(p,'flameAir',50);
   await p.waitForTimeout(300);
   assert.equal(await p.locator('#yellowFlame').evaluate(e=>getComputedStyle(e).opacity),'0.5');
   assert.equal(await p.locator('#blueFlame').evaluate(e=>getComputedStyle(e).opacity),'0.5');
   assert.match(await p.locator('#flameAirVal').innerText(),/50 %/);
   await p.locator('#flameHigh').click();
   await p.waitForTimeout(300);
   assert.equal(await p.locator('#flameAir').inputValue(),'100');
   assert.equal(await p.locator('#yellowFlame').evaluate(e=>getComputedStyle(e).opacity),'0');
   assert.equal(await p.locator('#blueFlame').evaluate(e=>getComputedStyle(e).opacity),'1');
   await p.locator('[data-flame-zone="above"]').click();
   assert.match(await p.locator('#flameInsight').innerText(),/besonders heißer Bereich/);
   await p.locator('#flameLow').click();
   assert.equal(await p.locator('#flameAir').inputValue(),'0');
   assert.equal(await p.locator('#flameLow').getAttribute('aria-pressed'),'true');
   assert.equal(await p.locator('#flamesExplanation svg').count(),3,'Illustrated flame explanation');
   await p.locator('[data-lab="setup"]').click();
   assert.equal(await p.locator('#setupTaskCount').innerText(),'1 / 10');
   await p.locator('[data-setup-opt]',{hasText:'Messzylinder'}).click();
   await p.locator('[data-cyl="100"]').waitFor();
   await p.locator('[data-cyl="100"]').click();
   assert(await p.locator('#setupNext').isDisabled(),'100-ml cylinder is not accepted');
   await p.locator('[data-cyl="250"]').click();
   assert.match(await p.locator('#setupFeedback').innerText(),/250-ml-Messzylinder/);
   for(let step=1;step<10;step++){
    await p.locator('#setupNext').click();
    const n=await p.locator('[data-setup-opt]').count();
    for(let i=0;i<n&&await p.locator('#setupNext').isDisabled();i++)await p.locator(`[data-setup-opt="${i}"]`).click();
    assert(!(await p.locator('#setupNext').isDisabled()),'Mission '+(step+1)+' solvable');
    if(step===8)assert(await p.locator('#setupArt .heat-rods, #setupArt svg').first().isVisible(),'Heat-conduction animation for wax mission');
   }
   await p.locator('#setupNext').click();
   assert.match(await p.locator('#setupTitle').innerText(),/Alle 10 Gerätemissionen/);
   await p.locator('#nav [data-page="solubility"]').click();
   await p.locator('#page-solubility .page-head [data-deep-link="particles"]').click();
   assert(await p.locator('#deep-particles').isVisible(),'Prominent solubility link opens particle model, not previous tab');
   assert.deepEqual(errors,[],'No browser errors');
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),'No horizontal overflow');
   await p.close();
  }
 }finally{await browser.close()}
 console.log('PASS '+engine+': temperature, salt/sugar animation, illustrated explanations, boiling curves and animated air slider');
})().catch(e=>{console.error(e);process.exit(1)});

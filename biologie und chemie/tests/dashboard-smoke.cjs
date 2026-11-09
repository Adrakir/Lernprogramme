
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url'),browsers=require('playwright');
const engine=process.env.CHEMIE_BROWSER||'chromium';
const app=path.resolve(__dirname,'../Chemie_Entdeckerlabor_V7_2.html');
(async()=>{
 const browser=await browsers[engine].launch({headless:true});
 const p=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto(pathToFileURL(app).href);
 assert.equal(await p.locator('#luAllAreas').isVisible(),true,'Old area must be visible without hidden details');
 assert.equal(await p.locator('#chemDirFilters button').count(),5);
 assert.equal(await p.locator('#homeCards .chem-card').count(),8,'Basics are visible on arrival');
 for(const [category,count,route] of [
  ['experiments',6,'v4lab'],['games',2,'v4play'],['tests',6,'finaltest'],['basics',8,'solubility']
 ]){
  await p.locator('[data-chem-group="'+category+'"]').click();
  assert.equal(await p.locator('#homeCards .chem-card').count(),count,category+' tiles');
  assert.equal(await p.locator('[data-chem-group="'+category+'"]').getAttribute('aria-pressed'),'true');
  await p.locator('#homeCards [data-chem-route="'+route+'"]').click();
  assert.equal(await p.locator('#page-'+route).isVisible(),true,route+' reachable');
  assert.equal(await p.locator('main > section.stage:visible').count(),1,'Exclusive navigation');
  await p.locator('#nav [data-page="home"]').click();
 }
 const before=fs.readFileSync(path.join(__dirname,'../Chemie_Entdeckerlabor_V7_1_Geprueft.html'),'utf8');
 const current=fs.readFileSync(app,'utf8');
 const stages=x=>[...x.matchAll(/<section\s+class="stage"[^>]*\sid="page-([^"]+)"/g)].map(y=>y[1]);
 for(const id of stages(before))assert(stages(current).includes(id),'Legacy stage disappeared: '+id);
 assert.equal(await p.evaluate(()=>window.ChemistryDirectory.count()),22);
 await p.setViewportSize({width:1280,height:900});
 await p.locator('[data-chem-group="experiments"]').click();
 assert.equal(await p.locator('#homeCards .chem-card').count(),6);
 assert.deepEqual(errors,[],'Browser JS errors');
 await browser.close();console.log('PASS '+engine+': complete visible directory, all 17 legacy stages and 22 direct entrances');
})().catch(e=>{console.error(e);process.exit(1)});

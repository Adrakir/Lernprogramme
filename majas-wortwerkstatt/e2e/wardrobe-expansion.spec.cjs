'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
const route=hash=>'/majas-wortwerkstatt/#'+hash;
const categories={taschen:'Taschen & Körbe',handlinks:'Linke Pfote',handrechts:'Rechte Pfote'};
test('Bärlis neue Utensilien: alle Fächer und kostenlose Anprobe',async ({page},testInfo)=>{
  await page.goto(route('baerli/schrank/extras'),{waitUntil:'domcontentloaded'});
  for(const [category,label] of Object.entries(categories)){
    await expect(page.locator('a[href="#baerli/schrank/'+category+'"]')).toBeVisible();
    await page.goto(route('baerli/schrank/'+category),{waitUntil:'domcontentloaded'});
    await expect(page.locator('.bw-header h1')).toHaveText(label);
    await expect(page.locator('.bw-figure')).toHaveAttribute('data-preview-id',/^bw26-/);
    await expect(page.locator('.bw-product-copy strong')).toBeVisible();
    const before=await page.evaluate(()=>({
      wallet:localStorage.getItem('majas-wortwerkstatt-sternenbeutel-v1'),
      outfit:localStorage.getItem('majas-wortwerkstatt-baerli-auswahl-v1')
    }));
    await page.locator('[data-bw-move="1"]').click();
    const after=await page.evaluate(()=>({
      wallet:localStorage.getItem('majas-wortwerkstatt-sternenbeutel-v1'),
      outfit:localStorage.getItem('majas-wortwerkstatt-baerli-auswahl-v1')
    }));
    expect(after).toEqual(before);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow,category+' darf nicht horizontal scrollen').toBeLessThanOrEqual(2);
    const folder=path.join(__dirname,'..','qa-wardrobe-shots');
    fs.mkdirSync(folder,{recursive:true});
    await page.locator('.bw-focus').screenshot({
      path:path.join(folder,testInfo.project.name+'-'+category+'.png'),
      animations:'disabled'
    });
    await page.goto(route('baerli/schrank/extras'),{waitUntil:'domcontentloaded'});
  }
});
test('Bärlis Outfit-Ideen: Vorschauen ohne Kauf und direkte Artikellinks',async ({page})=>{
  await page.goto(route('baerli/schrank/outfits'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('.bw-outfit-card')).toHaveCount(4);
  for(const name of ['schule','regen','detektiv','musik']){
    await page.goto(route('baerli/schrank/set-'+name),{waitUntil:'domcontentloaded'});
    await expect(page.locator('.bw-set-items a')).toHaveCount(4);
    await expect(page.locator('.bw-figure')).toHaveAttribute('data-preview-id',/^[a-z0-9,-]+$/);
    await expect(page.locator('.bw-set-explain')).toContainText('keine Sterne');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow,name+' darf nicht horizontal scrollen').toBeLessThanOrEqual(2);
  }
  await page.goto(route('baerli/schrank/set-schule'),{waitUntil:'domcontentloaded'});
  await page.getByRole('link',{name:/Blauer Wolkenhoodie/}).click();
  await expect(page).toHaveURL(/#baerli\/schrank\/pullover\/bw26-wolkenhoodie$/);
  await expect(page.locator('.bw-figure')).toHaveAttribute('data-preview-id','bw26-wolkenhoodie');
});
test('Kauf und Outfit-Anziehen erhält andere Käufe und kostet nur beim Kauf Sterne',async ({page})=>{
  await page.goto(route('baerli/schrank/taschen/bw26-schulrucksack'),{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>{
    const rewards={};
    for(let i=0;i<5;i++)rewards['test-seed:'+i]={amount:2,day:'2026-11-09'};
    localStorage.setItem('majas-wortwerkstatt-sternenbeutel-v1',JSON.stringify({version:1,rewards,purchases:{},migrated:true}));
  });
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('[data-bw-buy="bw26-schulrucksack"]').click();
  await expect(page.locator('[data-bw-equip="bw26-schulrucksack"]')).toBeVisible();
  const afterPurchase=await page.evaluate(()=>JSON.parse(localStorage.getItem('majas-wortwerkstatt-sternenbeutel-v1')));
  expect(afterPurchase.purchases['item:bw26-schulrucksack'].cost).toBe(5);
  await page.goto(route('baerli/schrank/set-schule'),{waitUntil:'domcontentloaded'});
  await page.locator('[data-bw-set="schule"]').click();
  await expect(page.locator('#bw-status')).toContainText('Es wurden keine Sterne ausgegeben');
  const afterSet=await page.evaluate(()=>({
    wallet:JSON.parse(localStorage.getItem('majas-wortwerkstatt-sternenbeutel-v1')),
    outfit:JSON.parse(localStorage.getItem('majas-wortwerkstatt-baerli-auswahl-v1'))
  }));
  expect(afterSet.wallet).toEqual(afterPurchase);
  expect(afterSet.outfit.taschen).toBe('bw26-schulrucksack');
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('.bw-figure')).toBeVisible();
});

test('Regensachen und Weihnachtskleidung: bebilderte Saisonfächer, 39 neue Artikel',async ({page},testInfo)=>{
 await page.goto(route('baerli/schrank/saison'),{waitUntil:'domcontentloaded'});
 await expect(page.locator('.bw-category-grid .bw-category')).toHaveCount(2);
 await expect(page.locator('a[href="#baerli/schrank/regen"]')).toContainText('10 Sachen');
 await expect(page.locator('a[href="#baerli/schrank/weihnachten"]')).toContainText('29 Sachen');
 const sections=[['regen','saison-regenponcho'],['weihnachten','saison-weihnachtsmuetze']];
 const before=await page.evaluate(()=>({
   wallet:localStorage.getItem('majas-wortwerkstatt-sternenbeutel-v1'),
   outfit:localStorage.getItem('majas-wortwerkstatt-baerli-auswahl-v1')
 }));
 for(const [section,first] of sections){
   await page.goto(route('baerli/schrank/'+section),{waitUntil:'domcontentloaded'});
   await expect(page.locator('.bw-figure')).toHaveAttribute('data-preview-id',/^saison-/);
   await expect(page.locator('.bw-figure img')).toBeVisible();
   await page.goto(route('baerli/schrank/'+section+'/'+first),{waitUntil:'domcontentloaded'});
   await expect(page.locator('.bw-figure')).toHaveAttribute('data-preview-id',first);
   await expect(page.locator('.bw-item-picture svg')).toBeVisible();
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   expect(overflow).toBeLessThanOrEqual(2);
   const folder=path.join(__dirname,'..','qa-season-shots');
   fs.mkdirSync(folder,{recursive:true});
   await page.locator('.bw-focus').screenshot({
     path:path.join(folder,testInfo.project.name+'-'+section+'.png'),
     animations:'disabled'
   });
 }
 const after=await page.evaluate(()=>({
   wallet:localStorage.getItem('majas-wortwerkstatt-sternenbeutel-v1'),
   outfit:localStorage.getItem('majas-wortwerkstatt-baerli-auswahl-v1')
 }));
 expect(after).toEqual(before);
});

test('Visuelle Artikelmatrix: alle 39 Saisonartikel und vier Outfitkombinationen',async({page},testInfo)=>{
 test.skip(!testInfo.project.name.includes('desktop'),'umfangreiche Bildkontrolle einmal auf Desktop-Chromium');
 await page.goto(route('baerli/schrank/saison'),{waitUntil:'domcontentloaded'});
 const items=await page.evaluate(()=>window.MajaBaerliSaison.map(({id,season,title})=>({id,season,title})));
 expect(items).toHaveLength(39);
 const folder=path.join(__dirname,'..','qa-all-season-outfits');
 fs.mkdirSync(folder,{recursive:true});
 for(const item of items){
  await page.goto(route('baerli/schrank/'+item.season+'/'+item.id),{waitUntil:'domcontentloaded'});
  await expect(page.locator('.bw-figure')).toHaveAttribute('data-preview-id',item.id);
  await expect(page.locator('.bw-focus img')).toBeVisible();
  const noBroken=await page.locator('.bw-focus img').evaluate(el=>el.complete&&el.naturalWidth>0);
  expect(noBroken,'Bärli-Hintergrund bei '+item.title+' fehlt').toBeTruthy();
  const clip=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(clip,item.id+' verursacht horizontales Scrollen').toBeLessThanOrEqual(2);
  await page.locator('.bw-focus').screenshot({path:path.join(folder,item.id+'.png'),animations:'disabled'});
 }
 for(const set of ['schule','regen','detektiv','musik']){
  await page.goto(route('baerli/schrank/set-'+set),{waitUntil:'domcontentloaded'});
  await expect(page.locator('.bw-set-try .bw-figure')).toBeVisible();
  await page.locator('.bw-set-try').screenshot({path:path.join(folder,'set-'+set+'.png'),animations:'disabled'});
 }
});

'use strict';
const {test,expect}=require('@playwright/test');
const route=hash=>'/majas-wortwerkstatt/'+(hash?'#'+hash:'');
async function load(page,hash){
  await page.goto(route(hash),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#app h1').first()).toBeVisible();
}
test('Vertraute Übersicht mit drei Lernthemen und vier bebilderten Angeboten',async ({page})=>{
  await load(page);
  await expect(page.getByRole('heading',{name:'Fit für den Kombitest'})).toBeVisible();
  await expect(page.locator('.maja-classic-home .maja-quick-topic')).toHaveCount(3);
  await expect(page.locator('.maja-classic-home .maja-quick-option')).toHaveCount(4);
  await expect(page.locator('.maja-classic-home .maja-option-photo img')).toHaveCount(4);
  await expect(page.getByRole('link',{name:/Teste dich/})).toBeVisible();
  await expect(page.getByRole('link',{name:/Alle weiteren Lernthemen/})).toBeVisible();
  await page.getByRole('link',{name:/Mein Lernmodus/}).click();
  await expect(page).toHaveURL(/#lernen$/);
  await expect(page.getByRole('heading',{name:'Was möchtest du üben?'})).toBeVisible();
  await expect(page.locator('.maja-journey-card')).toHaveCount(4);
  await load(page,'abenteuer');
  await expect(page.getByRole('heading',{name:'Was möchtest du entdecken?'})).toBeVisible();
  await expect(page.locator('.maja-journey-card')).toHaveCount(4);
});
test('Hörverstehen: rote Frage, Computerstimme und Tempo bleiben gespeichert',async ({page})=>{
  await load(page,'pruefung/hoeren/ueben/1');
  await expect(page.locator('.prep-question-highlight h2')).toBeVisible();
  await expect(page.locator('[data-prep-option]')).toHaveCount(3);
  await expect(page.locator('#prep-playback-mode')).toBeVisible();
  await page.locator('#prep-playback-mode').selectOption('computer');
  await expect(page.locator('#prep-voice-row')).toBeVisible();
  await page.locator('#prep-playback-speed').selectOption('0.7');
  await expect.poll(()=>page.evaluate(()=>({
    mode:localStorage.getItem('majas-wortwerkstatt-hoer-modus-v1'),
    tempo:localStorage.getItem('majas-wortwerkstatt-hoer-tempo-v1')
  }))).toEqual({mode:'computer',tempo:'0.7'});
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#prep-playback-mode')).toHaveValue('computer');
  await expect(page.locator('#prep-playback-speed')).toHaveValue('0.7');
});
test('Comics, Kleiderschrank und Elternansicht bleiben erreichbar',async ({page})=>{
  await load(page,'comics');
  await expect(page.getByRole('heading',{name:/Comics und Bilderbücher|Alle Comics/})).toBeVisible();
  await load(page,'baerli/schrank');
  await expect(page.getByRole('heading',{name:/Zieh Bärli an|Bärlis Kleiderschrank/})).toBeVisible();
  await load(page,'erwachsene');
  await expect(page.getByRole('heading',{name:/Für Erwachsene/})).toBeVisible();
});
test('Mobile Einstieg ohne horizontalen Überlauf',async ({page},testInfo)=>{
  test.skip(!testInfo.project.name.includes('mobile'),'nur mobile Emulation');
  await load(page);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow,'start page should not need horizontal scrolling').toBeLessThanOrEqual(2);
});

test('Startseiten-Bilder laden und direkte Ziele bleiben verlinkt',async ({page})=>{
  await load(page);
  const pics=page.locator('.maja-classic-home .maja-option-photo img');
  await expect(pics).toHaveCount(4);
  for(let i=0;i<4;i++){
    await expect.poll(()=>pics.nth(i).evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
  }
  for(const hash of ['pruefung/hoeren','endungen','verlaengern','kombitest','comics','spiele','lernberater','baerli/schrank','stationen']){
    await expect(page.locator('.maja-classic-home a[href="#'+hash+'"]')).toHaveCount(1);
  }
});
test('Kleiderschrank trennt Hosen, Brillen und Hüte',async ({page})=>{
  await load(page,'baerli/schrank');
  await page.locator('a[href="#baerli/schrank/hosen"]').first().click();
  await expect(page.locator('.bw-header h1')).toHaveText('Hosen');
  await page.goto(route('baerli/schrank/brillen'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('.bw-header h1')).toHaveText('Brillen');
  await page.goto(route('baerli/schrank/huete'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('.bw-header h1')).toHaveText('Hüte');
});

'use strict';
const {test,expect}=require('@playwright/test');
const route=hash=>'/majas-wortwerkstatt/'+(hash?'#'+hash:'');
async function load(page,hash){
  await page.goto(route(hash),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#app h1').first()).toBeVisible();
}
test('Start → Lernen und Abenteuer: getrennte, sichtbare Modi',async ({page})=>{
  await load(page);
  await expect(page.getByRole('link',{name:/Deutsch lernen/i}).first()).toBeVisible();
  await expect(page.getByRole('link',{name:/Abenteuer erleben/i}).first()).toBeVisible();
  await page.getByRole('link',{name:/Deutsch lernen/i}).first().click();
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
  await expect(page.getByRole('heading',{name:'Alle Comics'})).toBeVisible();
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

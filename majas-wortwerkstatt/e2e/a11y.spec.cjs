'use strict';
/**
 * Automatisches Barrierefreiheits-Audit (Issue #26): Kontrast, ARIA, Namen, Struktur.
 * Ersetzt keine manuelle Prüfung mit echten Geräten oder Screenreadern.
 */
const {test,expect}=require('@playwright/test');
const AxeBuilder=require('@axe-core/playwright').default;
const route=hash=>'/majas-wortwerkstatt/'+(hash?'#'+hash:'');
const PAGES=[
  ['Startseite',''],
  ['Lernmodus','lernen'],
  ['Abenteuermodus','abenteuer'],
  ['Lernberater','lernberater'],
  ['Kleiderschrank','baerli/schrank'],
  ['Hörverstehen üben','pruefung/hoeren/ueben/1'],
  ['Elternansicht','erwachsene'],
  ['Einstellungen','einstellungen']
];
for(const [name,hash] of PAGES){
  test('axe: keine schweren Barrieren auf '+name,async ({page},testInfo)=>{
    test.skip(!testInfo.project.name.includes('desktop'),'ein Viewport genügt für das DOM-Audit');
    await page.goto(route(hash),{waitUntil:'domcontentloaded'});
    await expect(page.locator('#app h1').first()).toBeVisible();
    const results=await new AxeBuilder({page})
      .withTags(['wcag2a','wcag2aa'])
      .analyze();
    const serious=results.violations.filter(v=>['serious','critical'].includes(v.impact));
    const summary=serious.map(v=>v.id+' ('+v.impact+', '+v.nodes.length+' Stellen): '+v.help).join('\n');
    expect(serious,'Schwere axe-Verstöße auf '+name+':\n'+summary).toEqual([]);
  });
}

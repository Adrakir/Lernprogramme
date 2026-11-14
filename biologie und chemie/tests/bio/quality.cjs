const assert = require('node:assert/strict');

module.exports = async function checkQuality(page, home) {
  const open = async hash => {
    await page.goto(home + '#' + hash);
    await page.evaluate(route => {
      if (location.hash !== '#' + route) throw new Error('Unexpected route');
      return new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)));
    }, hash);
  };
  await page.setViewportSize({width:320,height:740});
  await open('home');
  await page.getByRole('button',{name:'Alle Themen', exact:true}).click();
  const directory = page.locator('.bl-directory');
  assert.equal(await directory.evaluate(el => el === document.activeElement),true);
  await directory.getByRole('searchbox').fill('Wirbelsäule');
  assert.ok(await directory.getByRole('link',{name:'Wirbelsäule', exact:true}).isVisible());
  assert.equal(await directory.getByRole('link',{name:'Spiele & Detektive', exact:true}).count(),0);
  await directory.getByRole('link',{name:'Wirbelsäule', exact:true}).press('Enter');
  await page.getByRole('heading',{name:/Wirbelsäule/}).first().waitFor();
  await page.waitForFunction(() => document.activeElement.matches('main h1'));
  assert.ok(await page.getByText('Geführter Lernweg',{exact:true}).isVisible());
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),0);

  for (const route of ['assess','print','print/3']) {
    await open(route);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),0,route);
  }

  await open('glossary');
  await page.locator('#glossaryTopic').selectOption('spine');
  assert.match(await page.locator('#glossaryResults').innerText(), /Bandscheibe/);
  assert.doesNotMatch(await page.locator('#glossaryResults').innerText(), /Knochenmark/);

  await open('schulstoff/haustier');
  await page.getByRole('button',{name:'Rechenbeispiel laden'}).click();
  assert.equal(await page.locator('.bs-table-wrap').evaluate(el => el.scrollWidth - el.clientWidth),0);
  assert.equal(await page.locator('[data-bs-bar-value="0"]').innerText(),'43');

  await open('schulstoff/katze');
  await page.getByRole('button',{name:'Knochen am Bild entdecken'}).click();
  await page.locator('[data-bs-figure="hund"] button[aria-label="Hund 1"]').click();
  await page.locator('[data-bs-species="katze"]').click();
  assert.equal(await page.locator('[data-bs-figure="hund"]').isVisible(),false);
  const active = page.locator('[data-bs-figure="katze"] button[aria-pressed="true"]');
  assert.ok(await active.isVisible());
  assert.ok((await active.boundingBox()).width>=44);
  await page.locator('[data-bl-motion]').selectOption('2');
  assert.match(await page.locator('.bl-motion-compare').innerText(),/Landung|Landen/);

  await page.locator('#lcOpen').click();
  await page.locator('#lcTabs [data-tab="familie"]').click();
  await page.getByRole('heading',{name:'Lernübersicht für zu Hause',exact:true}).waitFor();
  assert.match(await page.locator('.bl-progress').innerText(),/Probearbeit 1[\s\S]*4 von 11/);
  await page.locator('#lcClose').focus();
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(() => !!document.activeElement.closest('#lcModal')),true);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.id),'lcClose');
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => document.activeElement.id),'lcOpen');

  await open('lehrkraft');
  await page.locator('[data-bl-stations]').selectOption('required');
  assert.equal(await page.locator('.bp-station:visible').count(),3);
  assert.equal(await page.getByText('Erfolgskriterium',{exact:true}).filter({visible:true}).count(),3);
  await page.locator('[data-bl-stations]').selectOption('all');
  assert.equal(await page.locator('.bp-station:visible').count(),10);
};

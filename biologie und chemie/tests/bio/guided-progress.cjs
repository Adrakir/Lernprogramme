const assert = require('node:assert/strict');

module.exports = async function checkGuidedProgress(browser, home) {
  const context = await browser.newContext({viewport:{width:390,height:844}, reducedMotion:'reduce'});
  await context.addInitScript(() => {
    if (localStorage.getItem('bio-guided-seeded')) return;
    localStorage.setItem('biolabor-kl5-v1', JSON.stringify({klassenweg:{track:'tiere',step:0}}));
    localStorage.setItem('bio-guided-seeded','1');
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(home + '#klassenweg');
    const step = index => page.locator('[data-bl-path-card="' + index + '"]');
    const status = index => step(index).locator('.bl-step-state').innerText();
    const contextNav = page.locator('.bl-path-context');
    assert.equal(await status(0),'Begonnen');
    assert.equal(await status(1),'Noch offen');
    assert.equal(await status(2),'Noch offen');
    await page.getByRole('link',{name:'Skelett und Bewegung',exact:true}).click();
    assert.equal(await status(0),'Noch offen');
    await page.getByRole('link',{name:'Hund und Katze',exact:true}).click();
    assert.equal(await status(0),'Begonnen');

    await step(0).getByRole('link',{name:'Gebisse verstehen',exact:true}).click();
    await contextNav.getByRole('button',{name:'Schritt als erledigt markieren',exact:true}).click();
    await contextNav.getByRole('button',{name:'Erledigt zurücknehmen',exact:true}).click();
    await contextNav.getByRole('button',{name:'Schritt als erledigt markieren',exact:true}).click();
    await page.reload();
    await contextNav.getByRole('link',{name:'Zurück zum Lernweg',exact:true}).click();
    assert.equal(await status(0),'Erledigt');

    async function showFamily() {
      await page.locator('#lcOpen').click();
      await page.locator('#lcTabs [data-tab="familie"]').click();
    }
    await showFamily();
    assert.match(await page.locator('.bl-today').innerText(),/10 Minuten · Gebiss/);
    await page.locator('#lcClose').click();

    await step(1).getByRole('link',{name:'Gebiss beschriften',exact:true}).click();
    const work = page.locator('#bio-klassenarbeit');
    await work.locator('.bk-modes [data-bk="mode:practice"]').click();
    for (let index = 0; index < 5; index += 1) {
      const correct = await page.evaluate(() => {
        const cx = Number(document.querySelector('#bio-klassenarbeit .bk-start').getAttribute('cx'));
        const {jaws, toothLabels} = window.BioLaborAnatomie;
        return toothLabels[jaws.hund.marks.find(mark => mark[3] === cx)[0]];
      });
      await work.getByRole('button',{name:correct,exact:true}).click();
      await work.locator('[data-bk="next"]').click();
    }
    await work.getByRole('heading',{name:'Deine Beschriftungsrunde',exact:true}).waitFor();
    assert.equal(await contextNav.locator('.bl-step-state').innerText(),'Erledigt');
    await showFamily();
    const today = page.locator('.bl-today');
    assert.match(await today.innerText(),/2 von 3 Schritten erledigt/);
    assert.match(await today.innerText(),/beim ersten Versuch ohne Tipp/);
    assert.match(await today.innerText(),/10 Minuten · Pfote und Zehengang/);
    await page.locator('#lcClose').click();

    await contextNav.getByRole('link',{name:'Zurück zum Lernweg',exact:true}).click();
    assert.equal(await status(1),'Erledigt');
    await step(2).getByRole('link',{name:'Probearbeit drucken',exact:true}).click();
    await contextNav.getByRole('link',{name:'Zurück zum Lernweg',exact:true}).click();
    assert.equal(await status(2),'Noch offen');

    await step(2).getByRole('link',{name:'Probearbeit öffnen',exact:true}).click();
    await page.getByRole('button',{name:'Arbeit 1 starten',exact:true}).click();
    await contextNav.getByRole('link',{name:'Zurück zum Lernweg',exact:true}).click();
    assert.equal(await status(2),'Begonnen');
    await step(2).getByRole('link',{name:'Probearbeit öffnen',exact:true}).click();
    await page.getByRole('button',{name:'Arbeit fortsetzen',exact:true}).click();
    await page.getByRole('radio').first().check();
    await page.getByRole('button',{name:'Arbeit abgeben',exact:true}).click();
    await page.getByRole('button',{name:'Jetzt abgeben',exact:true}).click();
    await page.getByRole('heading',{name:'Auswertung · Arbeit 1',exact:true}).waitFor();
    await contextNav.getByRole('link',{name:'Zurück zum Lernweg',exact:true}).click();
    assert.equal(await status(2),'Erledigt');
    await page.reload();
    assert.match(await page.locator('.bl-path-total').innerText(),/3 von 3/);
    await page.getByRole('link',{name:'Skelett und Bewegung',exact:true}).click();
    assert.equal(await status(2),'Noch offen');
    assert.deepEqual(errors,[]);
  } finally {
    await context.close();
  }
};

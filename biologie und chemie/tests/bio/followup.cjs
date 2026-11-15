const assert = require('node:assert/strict');

module.exports = async function checkFollowup(page, home) {
  await page.goto(home + '#games');
  const tab = id => page.locator('[data-action="gameTab"][data-id="' + id + '"]');
  const prompt = page.locator('#main [data-game-prompt]');
  await tab('joints').click();
  await page.locator('[data-action="bioGamePick"]').first().press('Enter');
  assert.equal(await page.locator('#main .feedback').evaluate(node => node === document.activeElement), true);
  await page.locator('[data-action="bioGameNext"]').press('Enter');
  const question = await prompt.innerText();
  await tab('spine').click();
  await tab('joints').click();
  assert.equal(await prompt.innerText(), question);
  assert.equal(await tab('joints').getAttribute('aria-pressed'), 'true');
  await tab('joints').click();
  assert.equal(await prompt.innerText(), question);

  await tab('tierduell').click();
  for (let i = 0; i < 5; i++) {
    await page.locator('[data-duel="mensch"]').press('Enter');
    await page.locator('[data-duel="next"]').press('Enter');
  }
  assert.match(await prompt.innerText(), /besonders lange Halswirbel.*Blättern/);
  await page.locator('[data-duel="giraffe"]').press('Enter');
  assert.match(await page.locator('#main .feedback').innerText(), /Richtig/);
  await tab('hebelmeister').click();
  await page.locator('[data-lmaster="20"]').press('Enter');
  assert.equal(await page.locator('#main .feedback').evaluate(node => node === document.activeElement), true);

  const animal = new URL('BioLabor_Hund_Katze.html', home).href;
  await page.goto(animal + '#dog/skeleton');
  const jump = page.locator('[data-rig-mode="jump"]');
  const phase = page.locator('#rig-timeline');
  const thrust = page.locator('[data-rig-thrust]');
  await jump.click();
  await phase.fill('23');
  assert.equal(await thrust.count(), 1);
  await phase.fill('60');
  assert.equal(await thrust.count(), 0);
  await jump.click();
  assert.equal(await phase.inputValue(), '60');
  await page.locator('#rig-step').click();
  assert.equal(await phase.inputValue(), '64');
  await phase.fill('100');
  assert.equal(await thrust.count(), 0);
  await page.locator('#rig-step').click();
  assert.equal(await phase.inputValue(), '0');
  await phase.fill('60');
  await page.locator('#rig-zoom').click();
  await page.locator('.ls-reference > summary').click();
  await page.locator('.ls-reference button[data-bone="skull"]').click();
  assert.equal(await phase.inputValue(), '60');
  assert.equal(await page.locator('#rig-zoom').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('#rig-play').getAttribute('aria-pressed'), 'false');

  await page.goto(animal + '#dog/teeth');
  assert.match(await page.locator('#jaw-labor').innerText(), /Oben sind 10 Zähne, unten 11/);
  await page.locator('#jaw-movable').evaluate(group => {group.dataset.retained = 'yes';});
  await page.locator('#jaw-range').fill('58');
  assert.equal(await page.locator('#jaw-movable').getAttribute('data-retained'), 'yes');
  assert.equal(await page.locator('#jaw-value').innerText(), '58 % geschlossen');
  await page.goto(animal + '#dog/motion');
  const caseCard = page.locator('#ft-lab');
  const caseOption = caseCard.locator('[data-ft="select"][data-num="1"]');
  assert.equal(await caseCard.locator('.ft-model').evaluate(details => details.open), false);
  await caseCard.locator('.ft-model summary').click();
  await caseCard.locator('[data-ft="hint"]').click();
  assert.equal(await caseCard.locator('[data-ft="hint"]').getAttribute('aria-expanded'), 'true');
  assert.equal(await caseCard.locator('.ft-model').evaluate(details => details.open), true);
  await caseOption.click();
  await caseCard.locator('[data-ft="check"]').press('Enter');
  assert.equal(await caseCard.locator('.ft-result').evaluate(node => node === document.activeElement), true);
  await page.reload();
  assert.equal(await caseOption.getAttribute('aria-pressed'), 'true');
  assert.match(await caseCard.locator('.ft-result').innerText(), /Antwort passt/);
  await page.emulateMedia({media: 'print'});
  assert.equal(await caseOption.isVisible(), true);
  await page.emulateMedia({media: 'screen'});
  await page.goto(animal + '#dog/compare');
  await caseCard.getByRole('button', {name:'Zum Wissenstest →'}).click();
  await page.waitForURL(url => url.hash === '#dog/quiz');

  await page.goto(animal + '#dog/signals');
  await page.locator('[data-behavior-answer="0"]').click();
  await page.locator('[data-scene="relax"]').click();
  await page.locator('[data-scene="greet"]').click();
  assert.equal(await page.locator('[data-behavior-answer="0"]').getAttribute('aria-pressed'), 'true');
};

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
  const quickTheme = page.getByLabel('Darstellung: Hell oder Dunkel', {exact:true});
  const originalTheme = await quickTheme.inputValue();
  await quickTheme.selectOption('dark');
  await page.waitForFunction(() => getComputedStyle(document.body).backgroundColor==='rgb(16, 27, 35)');
  for (const region of ['body','.topbar','.sidebar','.bs-start','.modulecard']) {
    const background = await page.locator(region).first().evaluate(el => getComputedStyle(el).backgroundColor);
    const channels = background.match(/\d+/g)?.slice(0,3).map(Number);
    assert.ok(channels?.every(channel => channel<90),region+' '+background);
  }
  for (const [route,selector] of [
    ['home','.modulecard h3'],
    ['home','.keynote > b'],
    ['learn/joints','.panel h2'],
    ['learn/spine','#animalCheck'],
    ['bio8','.b8-options button'],
    ['print','.bs-exam-sheet .bs-exam-task > p'],
    ['progress','.badgecard b'],
    ['schulstoff/gebiss','.bm-top h2'],
    ['schulstoff/gebiss','.bm-reading h3']
  ]) {
    await open(route);
    const heading = page.locator(selector).first();
    const ratio = await heading.evaluate(el => {
      const rgb = value => value.match(/[\d.]+/g).map(Number);
      const luminance = channels => channels.slice(0,3).reduce((sum,channel,index) => {
        const value = channel/255;
        const linear = value <= 0.04045 ? value/12.92 : ((value+0.055)/1.055)**2.4;
        return sum+linear*[0.2126,0.7152,0.0722][index];
      },0);
      let surface = el;
      while (surface && rgb(getComputedStyle(surface).backgroundColor)[3]===0) {
        surface = surface.parentElement;
      }
      const ink = luminance(rgb(getComputedStyle(el).color));
      const background = luminance(rgb(getComputedStyle(surface ?? document.body).backgroundColor));
      return (Math.max(ink,background)+0.05)/(Math.min(ink,background)+0.05);
    });
    assert.ok(ratio>=4.5,route+' '+selector+' contrast '+ratio.toFixed(2));
  }
  await open('home');
  await page.reload();
  assert.equal(await quickTheme.inputValue(),'dark');
  await page.locator('#lcOpen').click();
  await page.locator('#lcTabs [data-tab="einstellungen"]').click();
  const cockpitTheme = page.locator('#lcModal select[data-set="theme"]');
  assert.equal(await cockpitTheme.inputValue(),'dark');
  await cockpitTheme.selectOption('contrast');
  await page.locator('#lcClose').click();
  assert.equal(await quickTheme.inputValue(),'contrast');
  await quickTheme.selectOption('system');
  await page.emulateMedia({colorScheme:'dark'});
  await page.locator('body.lc-theme-dark').waitFor();
  await page.emulateMedia({colorScheme:'light'});
  await page.locator('body.lc-theme-dark').waitFor({state:'detached'});
  const nightLink = new URL(home);
  nightLink.searchParams.set('theme','dark');
  nightLink.hash='home';
  await page.goto(nightLink.href);
  assert.equal(await quickTheme.inputValue(),'dark');
  assert.equal(new URL(page.url()).searchParams.has('theme'),false);
  await quickTheme.selectOption(originalTheme);
  const quickThemeBox = await quickTheme.boundingBox();
  assert.ok(quickThemeBox.x+quickThemeBox.width<=320);
  assert.ok(quickThemeBox.height>=44);
  await page.emulateMedia({colorScheme:null});
  await open('practice/skeleton');
  const quiz = page.locator('.quizframe');
  const position = quiz.locator('.quiz-position');
  const choices = quiz.locator('[data-action="answer"]');
  const initialOptions = await choices.allTextContents();
  const initialQuestion = await quiz.locator('.question').innerText();
  const hint = quiz.locator('[data-action="hint"]');
  await hint.press('Enter');
  assert.equal(await hint.evaluate(el => el===document.activeElement),true);
  await choices.first().press('Enter');
  assert.equal(await choices.first().evaluate(el => el===document.activeElement),true);
  await page.reload();
  assert.equal(await quiz.locator('.question').innerText(),initialQuestion);
  assert.deepEqual(await choices.allTextContents(),initialOptions);
  assert.equal(await choices.first().getAttribute('aria-pressed'),'true');
  assert.match(await hint.innerText(),/1\/3/);
  await quiz.locator('[data-action="solution"]').press('Enter');
  assert.equal(await quiz.locator('.feedback').evaluate(el => el===document.activeElement),true);
  const storedAnswerCount = () => page.evaluate(() => JSON.parse(localStorage.getItem('biolabor-kl5-v1')).trainingDrafts.skeleton.answers.length);
  assert.equal(await storedAnswerCount(),1);
  await page.reload();
  assert.ok(await quiz.locator('.feedback').isVisible());
  assert.equal(await storedAnswerCount(),1);
  await quiz.locator('[data-action="nextQuestion"]').press('Enter');
  assert.equal(await position.evaluate(el => el===document.activeElement),true);
  assert.match(await position.innerText(),/Aufgabe 2 von/);
  await quiz.getByRole('button',{name:'Übung verlassen'}).click();
  await page.waitForURL(url => url.hash==='#home');
  await open('practice/spine');
  await quiz.locator('[data-action="hint"]').press('Enter');
  await open('learn/skeleton');
  await page.locator('.tabs button[data-action=tab][data-id=practice]').click();
  await page.getByRole('button',{name:'Übung fortsetzen',exact:true}).click();
  assert.match(await position.innerText(),/Aufgabe 2 von/);
  assert.equal(await storedAnswerCount(),1);
  await page.reload();
  assert.match(await position.innerText(),/Aufgabe 2 von/);

  const releaseLabel = /\b(?:Version\s+\d+|V\d+(?:[._]\d+)?)\b/i;
  for (const route of ['home','bio8','print','lehrkraft']) {
    await open(route);
    assert.doesNotMatch(await page.title(),releaseLabel,route);
    assert.doesNotMatch(await page.locator('body').innerText(),releaseLabel,route);
  }
  await open('learn/skeleton');
  const footNumbers = async () => page.locator('.skeleton-frame').evaluate(frame => {
    const markers = ['fusswurzel','mittelfuss','zehen'].map(id =>
      frame.querySelector(`[data-feature="${id}"] circle`).getBoundingClientRect());
    return {
      width: Math.min(...markers.map(r => r.width)),
      overlap: markers.some((a,i) => markers.slice(i+1).some(b =>
        a.left<b.right && a.right>b.left && a.top<b.bottom && a.bottom>b.top))
    };
  });
  assert.ok((await footNumbers()).width>=24);
  assert.equal((await footNumbers()).overlap,false);
  const views = page.getByRole('group',{name:'Skelettansicht'});
  const headView = views.getByRole('button',{name:'Kopf',exact:true});
  await headView.click();
  assert.equal(await headView.getAttribute('aria-pressed'),'true');
  const skeleton = page.getByRole('group',{name:'Kopfansicht mit Schädel und Unterkiefer.'});
  assert.deepEqual(await skeleton.getByRole('button').evaluateAll(markers => markers.map(marker => marker.dataset.feature)),['schaedel','kiefer']);
  assert.equal(await skeleton.locator('[data-skeleton-overview]:visible').count(),0);
  const jaw = skeleton.getByRole('button',{name:'2: Unterkiefer',exact:true});
  assert.ok((await jaw.boundingBox()).width>=44);
  await jaw.press('Enter');
  assert.match(await page.locator('#diagramInfo').innerText(),/Kauen und Sprechen/);
  const skeletonLabels = page.locator('#main .feature-grid button:visible');
  assert.equal(await skeletonLabels.count(),2);
  for (const [name,features] of [
    ['Brustkorb & Wirbelsäule',['wirbelsaeule','rippen','brustbein','rippenknorpel']],
    ['Arm & Hand',['schluesselbein','schulterblatt','oberarm','elle','speiche','handwurzel','mittelhand','finger']],
    ['Becken',['becken']],
    ['Bein & Fuß',['oberschenkel','kniescheibe','schienbein','wadenbein','fusswurzel','mittelfuss','zehen','gelenkknorpel']]
  ]) {
    const view = views.getByRole('button',{name,exact:true});
    await view.click();
    assert.equal(await view.getAttribute('aria-pressed'),'true',name);
    const figure = page.getByRole('group',{name:name+' am menschlichen Skelett',exact:true});
    const markers = figure.getByRole('button');
    assert.deepEqual(await markers.evaluateAll(elements => elements.map(element => element.dataset.feature)),features,name);
    assert.deepEqual(await skeletonLabels.evaluateAll(elements => elements.map(element => element.dataset.feature)),features,name);
    assert.ok(await figure.evaluate(svg => {
      const crop = svg.viewBox.baseVal;
      return [...svg.querySelectorAll('[data-feature]:not([hidden]) circle')].every(circle => {
        const {cx,cy,r}=circle;
        const x=cx.baseVal.value,y=cy.baseVal.value,radius=r.baseVal.value;
        return x-radius>=crop.x && x+radius<=crop.x+crop.width && y-radius>=crop.y && y+radius<=crop.y+crop.height;
      });
    }),name);
    assert.equal(await page.locator('#diagramInfo').innerText(),'Wähle eine Stelle aus.');
    if(name==='Bein & Fuß')assert.equal((await footNumbers()).overlap,false);
  }
  await views.getByRole('button',{name:'Gesamt',exact:true}).click();
  assert.equal(await skeletonLabels.count(),23);
  assert.equal(await page.locator('#main .illust-frame svg [data-feature]:not([hidden])').count(),23);

  for (const [route,regions] of [
    ['spine',[
      ['hals',['hals'],7],['brust',['brust','wirbelkoerper','rueckenmark','spinalnerv'],15],
      ['lende',['lende','band'],6],['kreuz',['kreuz','steiss'],2]
    ]],
    ['joints',[
      ['nah',['gelenkkopf','gelenkpfanne','knorpel','spalt','schmiere'],5],
      ['umfeld',['kapsel','baender'],2]
    ]]
  ]) {
    await open('learn/'+route);
    const graphic = page.locator('#main .illust-frame svg').first();
    const terms = page.getByRole('group',{name:'Begriffe im Bild'}).getByRole('button');
    const allTerms = await terms.count();
    for (const [region,keys,count] of regions) {
      await page.locator(`[data-diazoom="${region}"]`).click();
      const markers = graphic.getByRole('button');
      assert.equal(await markers.count(),count,region);
      assert.deepEqual(await terms.evaluateAll(nodes => nodes.map(node => node.dataset.feature).sort()),[...keys].sort(),region);
      assert.deepEqual(await graphic.evaluate(svg => {
        const {x,y,width,height}=svg.viewBox.baseVal;
        const visible = el => {
          for (let node=el;node!==svg;node=node.parentElement) {
            if (getComputedStyle(node).display==='none') return false;
          }
          return true;
        };
        return [...svg.querySelectorAll('text,[data-feature]')].filter(visible).flatMap(el => {
          const b=el.getBBox();
          return b.x>=x && b.y>=y && b.x+b.width<=x+width && b.y+b.height<=y+height ? [] : [[el.getAttribute('aria-label')||el.textContent,b.x,b.y,b.width,b.height]];
        });
      }),[],region);
      await terms.first().press('Enter');
      assert.ok(await page.locator('#diagramInfo b').isVisible(),region);
    }
    await page.locator('[data-diazoom="all"]').click();
    assert.equal(await terms.count(),allTerms,route);
  }

  await open('bio8');
  await page.locator('[data-b8="tab"][data-id="atlas"]').first().click();
  const atlas = page.locator('.b8-picture .b9-diagram').first();
  const zoom = page.locator('#b8Zoom');
  await zoom.press('End');
  const atlasTerms = page.locator('.b9-plan [data-b8="part"]');
  for (const id of ['skull','foot']) {
    const term = atlasTerms.and(page.locator(`[data-id="${id}"]`));
    await term.press('Enter');
    assert.equal(await term.evaluate(el => el===document.activeElement),true,id);
    assert.equal(await atlas.locator(`[data-id="${id}"]`).getAttribute('aria-pressed'),'true',id);
    assert.equal(await zoom.inputValue(),'1.8',id);
    assert.ok(await atlas.evaluate(svg => {
      const {x,y,width,height}=svg.viewBox.baseVal;
      return [...svg.querySelectorAll('[tabindex="0"] circle')].every(circle => {
        const b=circle.getBBox();
        return b.x>=x && b.y>=y && b.x+b.width<=x+width && b.y+b.height<=y+height;
      });
    }),id);
  }
  await zoom.press('Home');
  assert.equal(await atlas.getByRole('button').count(),16);
  assert.equal(await atlasTerms.count(),16);
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

  const main = page.locator('#main');
  const skip = page.getByRole('link', {name:'Zum Lerninhalt springen'});
  await skip.focus();
  await skip.press('Enter');
  assert.equal(await main.evaluate(el => el === document.activeElement),true);
  assert.ok(page.url().endsWith('#learn/spine'));
  const menu = page.getByRole('button',{name:'Lernmenü öffnen'});
  await menu.focus();
  await menu.press('Enter');
  assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'),'true');
  await page.waitForFunction(() => document.activeElement.closest('#sidebar') !== null);
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'),'false');
  assert.equal(await menu.evaluate(el => el === document.activeElement),true);
  assert.equal(await page.locator('#sidebar').evaluate(el => el.inert),true);

  const learningSteps = main.getByRole('group',{name:'Lernschritt wählen'});
  await learningSteps.getByRole('button',{name:/Lernwissen/}).press('Enter');
  const selected = learningSteps.getByRole('button',{name:/Lernwissen/,pressed:true});
  assert.equal(await selected.evaluate(el => el === document.activeElement),true);
  await learningSteps.getByRole('button',{name:/Entdecken/}).click();
  assert.equal(await main.getByRole('group',{name:/Wirbelsäule/}).locator('[role="button"]').count()>0,true);

  for (const route of ['assess','print','print/3']) {
    await open(route);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),0,route);
  }

  await open('glossary');
  await page.locator('#glossaryTopic').selectOption('spine');
  assert.match(await page.locator('#glossaryResults').innerText(), /Bandscheibe/);
  assert.doesNotMatch(await page.locator('#glossaryResults').innerText(), /Knochenmark/);
  await page.locator('#glossarySearch').fill('kein Treffer xyz');
  assert.match(await page.locator('#glossaryCount').innerText(), /^0 von/);

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

  await page.evaluate(() => {
    const key = 'biolab5-probetest-1';
    const stored = JSON.parse(localStorage.getItem(key));
    stored.followup = {at:'2020-01-01T00:00:00Z', topics:['schulter'], done:false};
    localStorage.setItem(key, JSON.stringify(stored));
  });
  await open('probetest');
  await page.reload();
  await page.getByRole('button',{name:'Lerncheck starten',exact:true}).click();
  const exercise = page.locator('.bp-root');
  await exercise.getByRole('heading',{name:'Fehler gezielt wiederholen',exact:true}).waitFor();
  assert.ok(await exercise.getByRole('radio',{name:'Schulterblatt'}).isVisible());
  await exercise.getByRole('radio',{name:'Schulterblatt'}).check();
  await exercise.getByRole('button',{name:'Antwort prüfen'}).click();
  await exercise.getByRole('button',{name:'Ergebnis anzeigen'}).click();
  assert.match(await exercise.innerText(),/1 von 1/);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('biolab5-probetest-1')).followup.done),true);

  await page.locator('#lcOpen').click();
  await page.locator('#lcTabs [data-tab="familie"]').click();
  assert.match(await page.locator('.bl-progress').innerText(), /Lerncheck am Folgetag[\s\S]*1 von 1 richtig/);
  await page.locator('#lcClose').click();

  await open('probetest/archiv/1');
  await page.getByRole('heading',{name:'Auswertung · Arbeit 1',exact:true}).waitFor();
  assert.match(await page.locator('.bp-topic-results').innerText(), /Skelett und Knochen[\s\S]*0 von 1 Punkten/);
  await page.getByText('Aufgabe 1 · Skelett und Knochen · Noch üben',{exact:true}).click();
  const archivedPicture = page.locator('.bp-review[open] .bk-image-text');
  await archivedPicture.getByText('Bildbeschreibung',{exact:true}).click();
  assert.match(await archivedPicture.innerText(),/dreieckigen Knochenplatte/);
  const archivedWriting = page.locator('.bp-review').nth(7);
  await archivedWriting.locator('summary').click();
  await archivedWriting.locator('[data-bp-criterion]').first().check();
  await archivedWriting.getByRole('button',{name:'Selbstvergleich speichern',exact:true}).click();
  await page.reload();
  await archivedWriting.locator('summary').click();
  assert.equal(await archivedWriting.locator('[data-bp-criterion]').first().isChecked(),true);

  await open('probetest/arbeit');
  await page.getByRole('button',{name:'Aufgabe 1, offen',exact:true}).click();
  const reader = page.getByRole('button',{name:'Aufgabe vorlesen',exact:true});
  await reader.waitFor();
  await page.evaluate(() => {
    window.__spoken = '';
    const synth = window.speechSynthesis || {getVoices:() => []};
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    synth.speak = utterance => {window.__spoken = utterance.text;};
    synth.cancel = () => {window.__spoken = '';};
    if (!window.speechSynthesis) window.speechSynthesis = synth;
  });
  await reader.click();
  assert.match(await page.evaluate(() => window.__spoken),/Hüftgelenk und Knie.*Antwortmöglichkeiten/);
  await page.getByRole('button',{name:'Vorlesen stoppen',exact:true}).click();
  assert.equal(await page.evaluate(() => window.__spoken),'');
  await page.getByRole('button',{name:'Aufgabe vorlesen',exact:true}).click();
  await page.getByRole('button',{name:'Weiter →',exact:true}).click();
  assert.equal(await page.evaluate(() => window.__spoken),'');
  await page.getByText('Bildbeschreibung',{exact:true}).click();
  assert.match(await page.locator('.bk-image-text').innerText(),/langen, spitzen Zahn/);
  assert.doesNotMatch(await page.locator('.bk-image-text').innerText(),/Eckzahn/);

  await open('koerpersprache');
  await page.getByRole('button',{name:'Szene 1 · Hund',exact:true}).click();
  const ears = page.getByRole('button',{name:'Ohren beschreiben',exact:true});
  await ears.press('Enter');
  assert.equal(await ears.getAttribute('aria-pressed'),'true');
  assert.equal(await ears.evaluate(el => el === document.activeElement),true);
  await page.getByRole('button',{name:'Rute beschreiben',exact:true}).press('Enter');
  assert.match(await page.locator('.bp-status').innerText(),/2 von 3/);
  await page.getByRole('button',{name:'Merkmale vorlesen',exact:true}).click();
  assert.match(await page.evaluate(() => window.__spoken),/Ohren sind beweglich/);

  await open('lehrkraft');
  await page.locator('[data-bl-stations]').selectOption('required');
  assert.equal(await page.locator('.bp-station:visible').count(),3);
  assert.equal(await page.getByText('Erfolgskriterium',{exact:true}).filter({visible:true}).count(),3);
  await page.locator('[data-bl-stations]').selectOption('all');
  assert.equal(await page.locator('.bp-station:visible').count(),10);

  await open('klassenarbeit/gebiss/katze');
  await page.locator('.bk-modes [data-bk="mode:test"]').click();
  await page.locator('.bk-word[data-answer]').first().click();
  const nextPicture = await page.locator('.bk-picture svg').innerHTML();
  const nextChoices = await page.locator('.bk-word[data-answer]').allTextContents();
  await page.reload();
  await page.getByRole('button',{name:'Gebiss-Probetest fortsetzen',exact:true}).click();
  assert.equal(await page.locator('.bk-picture svg').innerHTML(),nextPicture);
  assert.deepEqual(await page.locator('.bk-word[data-answer]').allTextContents(),nextChoices);

  const animal = new URL('BioLabor_Hund_Katze.html',home).href;
  await quickTheme.selectOption('dark');
  await page.goto(animal + '#dog/teeth');
  const animalTheme = page.locator('#theme');
  assert.equal(await animalTheme.getAttribute('aria-pressed'),'true');
  await animalTheme.click();
  await page.reload();
  assert.equal(await animalTheme.getAttribute('aria-pressed'),'false');
  assert.match(await page.locator('.ls-species-note').innerText(),/Welpen.*28.*Zahnwechsel.*erwachsener Hund.*42/);
  for (const [species,upper,lower] of [['dog',10,11],['cat',8,7]]) {
    await page.goto(animal + '#'+species+'/teeth');
    const jaw = page.locator('#jaw-drawing');
    assert.equal(await jaw.locator('g').first().locator('[data-dental]').count(),upper);
    assert.equal(await jaw.locator('#jaw-movable [data-dental]').count(),lower);
    await page.locator('#jaw-range').fill('100');
    assert.equal(await page.locator('#jaw-percent').innerText(),'Maul geschlossen');
    const [upperTooth,lowerTooth] = await jaw.locator('[data-carnassial]').evaluateAll(teeth =>
      teeth.map(tooth => {const {top,bottom} = tooth.getBoundingClientRect(); return {top,bottom};}));
    assert.ok(upperTooth.bottom>lowerTooth.top);
  }
  await page.goto(animal + '#dog/teeth');
  const firstChoice = page.locator('[data-ls="answer"][data-num="0"]');
  const speechRate = page.locator('#ls-rate');
  await speechRate.selectOption('.75');
  await firstChoice.press('Enter');
  assert.equal(await speechRate.inputValue(),'.75');
  assert.equal(await firstChoice.evaluate(el => el === document.activeElement),true);
  await page.locator('[data-ls="next"]').press('Enter');
  await page.reload();
  assert.equal(await page.locator('.ls-card h3').innerText(),'Verstehen');
  assert.equal(await speechRate.inputValue(),'.75');
  assert.match(await page.locator('.ls-card').innerText(),/letzte vordere Backenzahn \(P4\)/);
  await page.locator('[data-ls="mode"][data-mode="task"]').click();
  const pairs = page.locator('[data-ls-select]');
  assert.notDeepEqual(await pairs.first().locator('option:not(:first-child)').allTextContents(),
    ['Abknabbern','Festhalten','Scherenartig schneiden']);
  for (const [index,answer] of ['Festhalten','Abknabbern','Scherenartig schneiden'].entries()) {
    await pairs.nth(index).selectOption(answer);
  }
  await page.locator('[data-ls="check"]').click();
  assert.match(await page.locator('.ls-feedback').innerText(),/Schneidezähne.*ganz vorn.*Fangzähne/);
  await page.locator('[data-ls="taskNext"]').press('Enter');
  await page.locator('[data-ls="check"]').click();
  const solution = page.locator('.ls-order-solution');
  assert.equal(await solution.locator('li:visible').count(),0);
  await solution.locator('summary').click();
  assert.equal(await solution.locator('li:visible').count(),3);
  await page.locator('.ls-orderitem').first().getByRole('button',{name:'Schritt nach unten'}).click();
  const order = await page.locator('.ls-orderitem strong').allTextContents();
  await page.evaluate(() => {
    const synth = window.speechSynthesis || {getVoices:() => []};
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    synth.speak = utterance => {window.__spoken = utterance.text;};
    if (!window.speechSynthesis) window.speechSynthesis = synth;
  });
  await page.locator('[data-ls="read"]').click();
  assert.ok((await page.evaluate(() => window.__spoken)).includes(order.map((step,i) => (i+1)+'. '+step).join(' ')));

  await page.locator('#sections [data-section="quiz"]').click();
  const firstAnswer = page.locator('[data-answer="0"]');
  await firstAnswer.press('Enter');
  assert.equal(await firstAnswer.evaluate(el => el === document.activeElement),true);
  await page.locator('[data-action="check"]').press('Enter');
  assert.equal(await page.locator('.feedback').evaluate(el => el === document.activeElement),true);
  await page.locator('[data-action="next"]').press('Enter');
  const positionInTierQuiz = page.locator('.quiz-head .kicker');
  assert.match(await positionInTierQuiz.innerText(),/FRAGE 2 VON/);
  await page.reload();
  assert.match(await positionInTierQuiz.innerText(),/FRAGE 2 VON/);
  await page.locator('[data-species="cat"]').click();
  assert.match(await positionInTierQuiz.innerText(),/FRAGE 1 VON/);
  await page.locator('[data-species="dog"]').click();
  assert.match(await positionInTierQuiz.innerText(),/FRAGE 2 VON/);
  await page.locator('[data-action="restart"]').press('Enter');
  await page.reload();
  assert.match(await positionInTierQuiz.innerText(),/FRAGE 1 VON/);
  assert.equal(await page.locator('#ft-lab').count(),0);
  assert.equal(await page.locator('#sections [aria-current="page"]').getAttribute('data-section'),'quiz');
  await page.locator('a.skip').press('Enter');
  assert.equal(new URL(page.url()).hash,'#dog/quiz');
  await page.goto(animal+'#%E0%A4%A');
  await page.locator('#content h1').waitFor();
  await page.goto(home+'#%E0%A4%A');
  await page.waitForURL(url => url.hash==='#home');

  await open('home');
  assert.equal(await quickTheme.inputValue(),'light');
  const animalTab = await page.context().newPage();
  try {
    const animalPosition = animalTab.locator('.quiz-head .kicker');
    await animalTab.goto(animal + '#dog/quiz');
    await animalTab.locator('[data-answer="1"]').click();
    await animalTab.locator('[data-action="check"]').click();
    await animalTab.locator('[data-action="next"]').click();
    const profiles = async () => {
      await page.locator('#lcOpen').click();
      await page.locator('#lcTabs [data-tab="profile"]').click();
    };
    const switchProfile = async name => {
      await profiles();
      await page.locator('#lcProfile').selectOption(name);
      await Promise.all([page.waitForEvent('load'),page.getByRole('button',{name:'Profil wechseln',exact:true}).click()]);
    };
    await switchProfile('Testprofil');
    await animalTab.getByText('FRAGE 1 VON 14',{exact:true}).waitFor();
    await profiles();
    const pending = page.waitForEvent('download');
    await page.getByRole('button',{name:'Sicherung als JSON',exact:true}).click();
    const chunks = [];
    for await (const chunk of await (await pending).createReadStream()) chunks.push(chunk);
    const {store} = JSON.parse(Buffer.concat(chunks));
    const key = 'biolab5-tierkunde-2026';
    assert.equal(store.profiles.Testprofil.native[key],undefined);
    assert.equal(JSON.parse(store.profiles.Standard.native[key]).drafts.dog.qi,1);
    assert.ok(store.profiles.Standard.native['biolab5-tierstudio-2026']);
    await page.locator('#lcClose').click();
    await switchProfile('Standard');
    await animalTab.getByText('FRAGE 2 VON 14',{exact:true}).waitFor();
    assert.match(await animalPosition.innerText(),/FRAGE 2 VON/);
  } finally {await animalTab.close();}
  await quickTheme.selectOption(originalTheme);
};

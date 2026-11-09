const assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url'),browsers=require('playwright');
const engine=process.env.CHEMIE_BROWSER||'chromium';
const app=path.resolve(__dirname,'../Chemie_Entdeckerlabor_V7_2.html');
const go=(p,page)=>p.evaluate(pg=>navigate(pg),page);
const setInput=(p,sel,v)=>p.locator(sel).evaluate((e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}))},v);
(async()=>{
 const browser=await browsers[engine].launch({headless:true});const p=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(pathToFileURL(app).href);await p.waitForTimeout(500);

 // Siedetemperatur: Ethanol/Wasser-Vergleich steht direkt unter der Überschrift.
 await go(p,'heating');
 assert.equal(await p.evaluate(()=>document.querySelector('#page-heating .lz-box').nextElementSibling.id),'boilCompare');
 assert.match(await p.locator('#boilCompare').innerText(),/78 °C[\s\S]*100 °C/);
 await setInput(p,'#bcTemp','90');
 assert.match(await p.locator('#bcText').innerText(),/Ethanol siedet/);
 assert.equal(await p.locator('#bcStW').textContent(),'flüssig');
 await setInput(p,'#bcTemp','105');
 assert.match(await p.locator('#bcText').innerText(),/sieden beide/);
 assert.match(await p.locator('#page-heating .sim-layout ~ .notebox').first().innerText(),/Merksatz/);
 await p.locator('#bcShowCurve').click();assert.equal(await p.inputValue('#heatSubstance'),'ethanol');

 // Forscher-Campus Messlabor: Ethanol, eigene Leistung/Druck und eigene Messwerte.
 await p.locator('#bcCampus').click();await p.waitForTimeout(250);
 assert.equal(await p.inputValue('#v4HeatSubst'),'ethanol');assert.match(await p.textContent('#v4BPVal'),/78/);
 await p.selectOption('#v4HeatSubst','water');
 await p.selectOption('#v4Pressure','custom');await setInput(p,'#v4PressureNum','700');
 const bp=parseFloat((await p.textContent('#v4BPVal')).replace(',','.'));assert(bp>88&&bp<92,'Siedepunkt bei 700 hPa: '+bp);
 await p.selectOption('#v4Power','custom');await setInput(p,'#v4PowerNum','300');
 await p.locator('#v4GraphNext').click();await p.locator('#v4GraphSave').click();
 await p.fill('#v4OwnTime','2');await p.fill('#v4OwnTemp','47');await p.locator('#v4OwnAdd').click();
 assert.match(await p.locator('#v4OwnList').innerText(),/2 min: 47 °C/);
 assert.deepEqual(await p.evaluate(()=>[...document.getElementById('v4Substance').options].map(o=>o.value)),['salt','sugar'],'Löse-Experiment behält Salz/Zucker');

 // Teilchenlupe: vier Zoomstufen, unverzerrte Canvas.
 await p.locator('[data-v4tab="micro"]').click();
 for(const z of ['1','2','4','8']){await p.locator(`[data-micro-zoom="${z}"]`).click();assert.equal(await p.locator(`[data-micro-zoom="${z}"]`).getAttribute('aria-pressed'),'true')}
 const ratio=await p.locator('#v4MicroCanvas').evaluate(c=>{const r=c.getBoundingClientRect();return Math.abs(c.width/c.height-r.width/r.height)});assert(ratio<0.02,'Canvas nicht verzerrt: '+ratio);
 assert.match(await p.locator('#v4MicroResult').innerText(),/rot = Sauerstoff/);

 // Laborfehler: 7 gezeichnete Szenen, Lösung erst nach dem Finden.
 const detStage=await p.evaluate(()=>document.querySelector('[data-v4tab="detect"]').closest('.stage').id.replace('page-',''));await go(p,detStage);
 await p.locator('[data-v4tab="detect"]').click();
 assert.equal(await p.locator('#v4SceneSelect option').count(),7);
 assert.equal(await p.locator('#v4SceneBoard .det-card').count(),0);
 for(let i=0;i<4;i++)await p.locator(`#v4SceneBoard [data-hazard="${i}"]`).evaluate(e=>e.dispatchEvent(new MouseEvent('click',{bubbles:true})));
 assert.equal(await p.locator('#v4SceneBoard .det-card').count(),4);assert.match(await p.textContent('#v4SceneCount'),/4 von 4/);

 // Lernpfad Schritt 5: Satzbaukasten und automatische Rückmeldung.
 await p.evaluate(()=>{const k='chemie8-learning-v1',d=JSON.parse(localStorage.getItem(k)||'{}');d.lesson=0;d.step=4;localStorage.setItem(k,JSON.stringify(d))});
 await p.reload();await p.waitForTimeout(400);await go(p,'learningpath');
 const gaps=p.locator('.lu-gap select');assert.equal(await gaps.count(),3);
 await gaps.nth(0).selectOption('1');await p.getByRole('button',{name:'Sätze prüfen'}).click();
 assert.match(await p.locator('.lu-kit-feedback').innerText(),/von 3 Bausteinen/);
 for(let i=0;i<3;i++)await gaps.nth(i).selectOption('0');await p.getByRole('button',{name:'Sätze prüfen'}).click();
 await p.getByRole('button',{name:'Sätze in mein Textfeld übernehmen'}).click();
 assert.equal(await p.locator('.lu-auto li.hit').count(),2);
 assert.equal(await p.locator('#luStage .lu-check input:checked').count(),2);

 // Neue Funktionen: Lernheft-Laborbild, Skizzenlabor, Materialliste, Lerntrainer-Bank, Führerschein-Begründungen
 await go(p,'safety');assert.equal(await p.locator('#page-safety .safety-photo').count(),1,'Lernheft-Bild in Finde 6 Gefahren');
 await p.locator('[data-safety="3"]').click();assert.match(await p.locator('#safetyFeedback').innerText(),/Brennbares|Buch/);
 // GHS-Lernkartei: 9 Symbole, Erklär-Detail, Zuordnungsspiel mit Begründung
 assert.equal(await p.locator('.ghs-card').count(),9,'9 GHS-Piktogramme');
 await p.locator('[data-ghs="ghs06"]').click();assert.match(await p.locator('#ghsDetail').innerText(),/giftig/);
 await p.locator('[data-chip="ghs07"]').click();await p.locator('[data-bottle="0"]').click();assert.match(await p.locator('#ghsGameFeedback').innerText(),/Noch nicht/);
 await p.locator('[data-chip="ghs02"]').click();await p.locator('[data-bottle="0"]').click();assert.match(await p.locator('#ghsGameFeedback').innerText(),/Richtig/);
 assert((await p.evaluate(()=>window.LernCockpitBankChem.length))>=64,'Lerntrainer-Fragenbank erweitert');
 await go(p,'v4study');await p.locator('[data-v4tab="journal"]').click();
 assert.equal(await p.locator('#v4SketchStage').count(),1,'Skizzenlabor vorhanden');
 await p.locator('[data-skpart="brenner"]').click();assert.match(await p.locator('#v4SketchStatus').innerText(),/Gasbrenner/);
 assert((await p.locator('.v4matgrid input').count())>=20,'Materialliste zum Ankreuzen');
 const lic=await p.evaluate(()=>{const s=document.querySelector('[data-v4tab="license"]');return !!s});assert(lic);
 await go(p,'heating');assert.equal(await p.locator('#page-heating a[href="Lernheft_Chemiearbeit.pdf"]').count(),0);
 await go(p,'sheet');assert.equal(await p.locator('#page-sheet a[href="Lernheft_Chemiearbeit.pdf"]').count(),1,'Lernheft-PDF verlinkt');

 // Interaktiv-Extras: Eiskurve, Zustands-Sortierspiel, Sand/Öl
 await go(p,'heating');assert.equal(await p.locator('.ice-panel').count(),1,'Eiskurve vorhanden');
 await p.locator('[data-icezone="1"]').click();assert.match(await p.locator('#iceText').innerText(),/Schmelzen/);
 assert.match(await p.locator('#iceState').innerText(),/schmilzt/);
 await go(p,'matter');
 await p.locator('[data-stitem="0"]').click();await p.locator('[data-stcol="solid"]').click();
 assert.match(await p.locator('#stFeedback').innerText(),/Richtig/);
 await go(p,'solubility');
 await p.locator('[data-solx="sand"]').click();assert.match(await p.locator('#solxText').innerText(),/löst sich nicht/);
 await p.locator('[data-solx="oil"]').click();assert.match(await p.locator('#solxText').innerText(),/schwimmt/);
 await p.locator('[data-solxq="1"]').click();assert.match(await p.locator('#solxQF').innerText(),/gelöst/);

 // Brenner-Bedienfolge mit Fehlerfolgen, Geräte-Handhabung
 await go(p,'burner');
 await p.locator('[data-bseq="gas"]').click();assert.match(await p.locator('#bseqFb').innerText(),/Gefahr/);
 for(const k of ['prep','airclose','spark','gas','airopen'])await p.locator('[data-bseq="'+k+'"]').click();
 assert.match(await p.locator('#bseqFb').innerText(),/Perfekt gestartet/);
 await go(p,'devices');
 await p.locator('[data-device="Pipette"]').click();await p.waitForTimeout(100);
 assert.match(await p.locator('#deviceInfo .dev-handling').innerText(),/Pipettierhilfe/);

 // Lehrkräfte-Bereich: Auswertung, Export, Niveau wirkt im Wissenscheck
 await go(p,'v4study');await p.locator('[data-v4tab="teacher"]').click();
 assert((await p.locator('.teach-table tbody tr').count())>=8,'Auswertungstabelle');
 await p.selectOption('#teachLevel','leicht');
 await go(p,'quiz');assert.equal(await p.locator('#quizLength').inputValue(),'8');
 await p.locator('#quizApply').click();
 const leicht=await p.evaluate(()=>({n:state.quiz.questions.length,maxOpts:Math.max(...state.quiz.questions.map(q=>q.options.length)),ok:state.quiz.questions.every(q=>q.options[q.correct]!==undefined)}));
 assert.equal(leicht.n,8);assert(leicht.maxOpts<=3,'Leicht: max. 3 Optionen');assert(leicht.ok,'Korrekte Antwort erhalten');
 await go(p,'v4study');await p.locator('[data-v4tab="teacher"]').click();await p.selectOption('#teachLevel','normal');

 assert.deepEqual(errors,[]);await browser.close();console.log(`PASS ${engine}: ethanol comparison, custom heating curve, micro zoom, drawn lab scenes and interactive explanation step`);
})().catch(e=>{console.error(e);process.exit(1)});

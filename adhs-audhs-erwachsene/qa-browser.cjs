"use strict";
/* Browser regression checks for the NeuroKompass adult educational site.
 * The tests are not clinical validation or cross-device manual testing.
 * Run: npm install --no-save playwright && npx playwright install chromium && node qa-browser.cjs
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const BASE = __dirname;
const URLS = ["index.html", "uebungstest.html", "visualisieren.html", "falltrainer.html"];
const url = name => pathToFileURL(path.join(BASE, name)).href;
let passed = 0, failed = 0;
async function run(name, fn) {
 try { await fn(); console.log("PASS "+name); passed++; }
 catch (err) { failed++; console.error("FAIL "+name+"\n  "+(err.stack||err)); }
}
async function open(browser, filename, mobile=false) {
 const context = await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:900}, reducedMotion:"reduce",acceptDownloads:true});
 const page = await context.newPage();const errors=[];
 page.on("pageerror", e=>errors.push(e.message));
 await page.goto(url(filename),{waitUntil:"load"});
 return {page,context,errors};
}
async function close(x){await x.context.close()}
async function main(){
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try {
 await run("Hauptseite ohne JS-Fehler, alle 9 Menüpunkte",async()=>{
  const x=await open(browser,"index.html");try{
   assert.equal(x.errors.length,0,x.errors.join(" "));
   assert.equal(await x.page.locator("main > section").count(),9);
   assert.match(await x.page.locator("#home").innerText(),/ADHS und AuDHS/);
  }finally{await close(x)}
 });
 await run("ASRS-6: 4/6 Schwelle und untere Schwelle",async()=>{
  const x=await open(browser,"index.html");const p=x.page;try{
   await p.locator('.nav[data-view="asrs"]').click();
   for(let i=0;i<6;i++){let v=[2,2,2,3,0,0][i];await p.locator('label[for="asrs_'+i+'_'+v+'"]').click();}
   assert.match(await p.locator("#asrsResult").innerText(),/4 von 6 positiv/);
   assert.match(await p.locator("#asrsResult").innerText(),/Screening-Schwelle erreicht/);
   for(let i=0;i<6;i++){let v=[1,1,1,2,2,2][i];await p.locator('label[for="asrs_'+i+'_'+v+'"]').click();}
   assert.match(await p.locator("#asrsResult").innerText(),/0 von 6 positiv/);
   assert.match(await p.locator("#asrsResult").innerText(),/Screening-Schwelle nicht erreicht/);
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });
 await run("18 DSM-5-Lernkriterien: Kindheit, Erwachsen, Vor/Zurück",async()=>{
  const x=await open(browser,"index.html");const p=x.page;try{
   await p.locator('.nav[data-view="criteria"]').click();
   await p.locator('label[for="critA_0_1"]').click();
   await p.locator('label[for="critC_0_1"]').click();
   assert.match(await p.locator("#critProgressText").innerText(),/2\/36/);
   await p.locator("#critNext").click();
   assert.match(await p.locator("#critCurrent").innerText(),/Aufmerksamkeit halten/);
   await p.locator("#critPrev").click();
   assert.match(await p.locator("#critCurrent").innerText(),/Details und Flüchtigkeitsfehler/);
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });
 await run("AQ10: externer Originalwert 6/10 und ungültige Eingabe",async()=>{
  const x=await open(browser,"index.html");const p=x.page;try{
   await p.locator('.nav[data-view="autism"]').click();
   await p.locator('label[for="aut_0_3"]').click();
   await p.locator("#aqScore").fill("6");
   await p.locator("#aqNote").selectOption("yes");
   assert.match(await p.locator("#aqResult").innerText(),/6\/10/);
   await p.locator("#aqScore").fill("11");
   assert.match(await p.locator("#aqResult").innerText(),/0 bis 10/);
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });
 await run("AuDHS: ASRS und Original-AQ10 getrennt",async()=>{
  const x=await open(browser,"index.html");const p=x.page;try{
   await p.locator('.nav[data-view="asrs"]').click();
   for(let i=0;i<6;i++)await p.locator('label[for="asrs_'+i+'_4"]').click();
   await p.locator('.nav[data-view="autism"]').click();
   await p.locator("#aqScore").fill("6");
   await p.locator("#aqNote").selectOption("yes");
   await p.locator('.nav[data-view="audhd"]').click();
   const text=await p.locator("#audhdResult").innerText();
   assert.match(text,/6\/6/);assert.match(text,/6\/10/);assert.match(text,/kein AuDHS-Nachweis/);
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });
 await run("Fallwerkstatt: alle 5 Fälle und Lösung öffnen",async()=>{
  const x=await open(browser,"index.html");const p=x.page;try{
   await p.locator('.nav[data-view="cases"]').click();
   assert.equal(await p.locator("[data-case]").count(),5);
   await p.locator('[data-case="2"]').click();
   assert.match(await p.locator("#caseDetail").innerText(),/Mira/);
   await p.locator("#showSolution").click();
   assert.equal(await p.locator("#caseAnswer").isVisible(),true);
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });
 await run("Hauptseite: JSON-Export, Druckaufruf und Reset",async()=>{
  const x=await open(browser,"index.html");const p=x.page;try{
   await p.addInitScript(()=>{window.__printTest=false;window.print=()=>{window.__printTest=true}});
   await p.reload();
   await p.locator('.nav[data-view="asrs"]').click();
   await p.locator('label[for="asrs_0_2"]').click();
   await p.locator('.nav[data-view="results"]').click();
   const [file]=await Promise.all([p.waitForEvent("download"),p.locator("#exportBtn").click()]);
   const data=JSON.parse(fs.readFileSync(await file.path(),"utf8"));
   assert.equal(data.asrs.antworten[0],2);
   await p.locator("#printBtn").click();
   assert.equal(await p.evaluate(()=>window.__printTest),true);
   p.once("dialog", d=>d.accept());
   await p.locator("#resetBtn").click();
   await p.locator('.nav[data-view="asrs"]').click();
   assert.match(await p.locator("#asrsResult").innerText(),/0 von 6/);
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });
 await run("Übungstest: 41 Angaben, Resultate, JSON-Ausgabe",async()=>{
  const x=await open(browser,"uebungstest.html");const p=x.page;try{
   for(let i=0;i<18;i++){
    await p.locator('label[for="r_adult_'+i+'_3"]').click();
    await p.locator('label[for="r_child_'+i+'_4"]').click();
    await p.locator("#next").click();
   }
   for(let i=0;i<5;i++){
    await p.locator('label[for="r_impact_'+i+'_2"]').click();
    if(i<4)await p.locator("#next").click();
   }
   assert.match(await p.locator("#progressNumber").innerText(),/41 von 41/);
   const res=await p.locator("#report").innerText();
   assert.match(res,/18 von 9|9 von 9/);assert.match(res,/Alle Fragen wurden bearbeitet/);
   const [file]=await Promise.all([p.waitForEvent("download"),p.locator("#export").click()]);
   const data=JSON.parse(fs.readFileSync(await file.path(),"utf8"));
   assert.equal(data.heute.length,18);assert.equal(data.kindheit.length,18);assert.equal(data.lebensbereiche.length,5);
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });
 await run("Übungstest: Demofall und Löschen",async()=>{
  const x=await open(browser,"uebungstest.html");const p=x.page;try{
   p.on("dialog",d=>d.accept());
   await p.locator("#demo").click();
   assert.match(await p.locator("#report").innerText(),/Fiktiver Übungsfall/);
   await p.locator("#clear").click();
   assert.match(await p.locator("#progressNumber").innerText(),/0 von 41/);
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });
 await run("Visuelles Lernstudio: 5 Bilder geladen, 8 Stationen",async()=>{
  const x=await open(browser,"visualisieren.html");const p=x.page;try{
   assert.equal(await p.locator('main > section.card').count(),8);
   assert.equal(await p.locator('img.visual').count(),5);
   const images=p.locator('img.visual');
   for(let i=0;i<5;i++){
    await images.nth(i).scrollIntoViewIfNeeded();
    await p.waitForFunction(index=>{const img=document.querySelectorAll('img.visual')[index];return img.complete&&img.naturalWidth>0},i,{timeout:7000});
   }
   const imageStates=await images.evaluateAll(nodes=>nodes.map(el=>({ok:el.complete&&el.naturalWidth>0,alt:!!el.getAttribute("alt")})));
   assert(imageStates.every(o=>o.ok&&o.alt),JSON.stringify(imageStates));
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });
 await run("Lernstudio: Schalter für Fokus, Plan, Impulse, AuDHS und Quiz",async()=>{
  const x=await open(browser,"visualisieren.html");const p=x.page;try{
   await p.locator("#focusFewer").click();assert.equal(await p.locator("#focusScene").evaluate(el=>el.classList.contains("focus-mode")),true);
   await p.locator("#planNext").click();assert.match(await p.locator("#planExplain").innerText(),/Einstieg erleichtern/);
   await p.locator("#impulseNext").click();assert.match(await p.locator("#impulseInfo").innerText(),/kurze Pause/);
   await p.locator('[data-venn="a"]').click();assert.match(await p.locator("#vennInfo").innerText(),/ADHS als eigener Bereich/);
   await p.locator('[data-chart="b"]').click();assert.equal(await p.locator("#chartAv").innerText(),"7/9");
   await p.locator('[data-opt="1"]').click();assert.match(await p.locator("#quizFeedback").innerText(),/Richtig/);
   await p.locator("#motionBtn").click();assert.equal(await p.locator("#motionBtn").getAttribute("aria-pressed"),"true");
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });

 await run("Übungstest: lokale Sicherung ist freiwillig und nach Ausschalten gelöscht",async()=>{
  const x=await open(browser,"uebungstest.html");const p=x.page;try{
   assert.equal(await p.locator("#saveToggle").getAttribute("aria-pressed"),"false");
   await p.locator('label[for="r_adult_0_3"]').click();
   await p.reload();
   assert.match(await p.locator("#progressNumber").innerText(),/0 von 41/);
   await p.locator("#saveToggle").click();
   await p.locator('label[for="r_adult_0_3"]').click();
   await p.reload();
   assert.match(await p.locator("#progressNumber").innerText(),/1 von 41/);
   assert.equal(await p.locator("#saveToggle").getAttribute("aria-pressed"),"true");
   await p.locator("#saveToggle").click();
   await p.reload();
   assert.match(await p.locator("#progressNumber").innerText(),/0 von 41/);
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });
 await run("Haupt-App: Speicherung aktivieren, ASRS-Antwort wiederherstellen, lokale Kopie entfernen",async()=>{
  const x=await open(browser,"index.html");const p=x.page;try{
   await p.locator("#saveToggle").click();
   await p.locator('.nav[data-view="asrs"]').click();
   await p.locator('label[for="asrs_0_2"]').click();
   await p.reload();
   await p.locator('.nav[data-view="asrs"]').click();
   assert.match(await p.locator("#asrsResult").innerText(),/1 von 6/);
   assert.equal(await p.locator("#saveToggle").getAttribute("aria-pressed"),"true");
   await p.locator("#saveToggle").click();
   await p.reload();
   await p.locator('.nav[data-view="asrs"]').click();
   assert.match(await p.locator("#asrsResult").innerText(),/0 von 6/);
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });
 await run("JSON-Übungstest exportieren, in Haupt-App importieren und getrennt anzeigen",async()=>{
  const x=await open(browser,"uebungstest.html");const p=x.page;try{
   await p.locator('label[for="r_adult_0_3"]').click();
   const [dl]=await Promise.all([p.waitForEvent("download"),p.locator("#export").click()]);
   const buffer=fs.readFileSync(await dl.path());
   await p.goto(url("index.html"));
   await p.locator('.nav[data-view="results"]').click();
   await p.locator("#importPractice").setInputFiles({name:"lerntest.json",mimeType:"application/json",buffer});
   await p.waitForFunction(()=>document.querySelector("#practiceImportStatus").textContent.includes("erfolgreich"));
   assert.match(await p.locator("#practiceReport").innerText(),/Aufmerksamkeit \/ Organisation/);
   assert.match(await p.locator("#practiceReport").innerText(),/1 von 1/);
   await p.locator("#clearPracticeImport").click();
   assert.match(await p.locator("#practiceImportStatus").innerText(),/entfernt/);
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });
 await run("Übungstest: JSON importiert frühere Antworten wieder, ungültige Datei wird abgelehnt",async()=>{
  const x=await open(browser,"uebungstest.html");const p=x.page;try{
   await p.locator('label[for="r_adult_0_3"]').click();
   const [dl]=await Promise.all([p.waitForEvent("download"),p.locator("#export").click()]);
   const buffer=fs.readFileSync(await dl.path());
   p.once("dialog", d=>d.accept());
   await p.locator("#clear").click();
   await p.locator("#importAnswers").setInputFiles({name:"test.json",mimeType:"application/json",buffer});
   await p.waitForFunction(()=>document.querySelector("#importStatus").textContent.includes("importiert"));
   assert.match(await p.locator("#progressNumber").innerText(),/1 von 41/);
   await p.locator("#importAnswers").setInputFiles({name:"invalid.json",mimeType:"application/json",buffer:Buffer.from("{}")});
   await p.waitForFunction(()=>document.querySelector("#importStatus").textContent.includes("Import abgelehnt"));
   assert.match(await p.locator("#progressNumber").innerText(),/1 von 41/);
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });
 await run("Fallwerkstatt Plus: 6 Fälle und 18 didaktische Entscheidungen",async()=>{
  const x=await open(browser,"falltrainer.html");const p=x.page;try{
   assert.equal(await p.locator(".case-tab").count(),6);assert.match(await p.locator("#teacherArea").innerText(),/Beurteilungsraster/);
   const choices=[[1,0,1],[0,1,0],[0,1,0],[1,1,0],[0,0,1],[1,1,1]];
   for(let i=0;i<choices.length;i++){
    await p.locator('[data-case="'+i+'"]').click();
    for(let j=0;j<3;j++){
     await p.locator('[data-choice="'+choices[i][j]+'"]').click();
     assert.match(await p.locator("#feedback").innerText(),/Richtig beurteilt/);
     if(j<2)await p.locator("#next").click();
    }
   }
   assert.match(await p.locator("#answeredTotal").innerText(),/18\/18/);
   assert.equal(await p.locator("#correctTotal").innerText(),"18");
   assert.match(await p.locator("#caseTotal").innerText(),/6\/6/);
   p.once("dialog",d=>d.accept());
   await p.locator("#resetCases").click();
   assert.match(await p.locator("#answeredTotal").innerText(),/0\/18/);
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });

 await run("Haupt-App: JSON-Export und Import erhält ASRS und bestätigten AQ-10-Wert",async()=>{
  const x=await open(browser,"index.html");const p=x.page;try{
   await p.locator('.nav[data-view="asrs"]').click();
   await p.locator('label[for="asrs_0_2"]').click();
   await p.locator('.nav[data-view="autism"]').click();
   await p.locator("#aqScore").fill("7");
   await p.locator("#aqNote").selectOption("yes");
   await p.locator('.nav[data-view="results"]').click();
   const [dl]=await Promise.all([p.waitForEvent("download"),p.locator("#exportBtn").click()]);
   const buffer=fs.readFileSync(await dl.path());
   p.once("dialog",d=>d.accept());
   await p.locator("#resetBtn").click();
   await p.locator('.nav[data-view="results"]').click();
   await p.locator("#importMain").setInputFiles({name:"hauptergebnis.json",mimeType:"application/json",buffer});
   await p.waitForFunction(()=>document.querySelector("#mainImportStatus").textContent.includes("importiert"));
   await p.locator('.nav[data-view="autism"]').click();
   assert.equal(await p.locator("#aqScore").inputValue(),"7");
   assert.equal(await p.locator("#aqNote").inputValue(),"yes");
   await p.locator('.nav[data-view="asrs"]').click();
   assert.match(await p.locator("#asrsResult").innerText(),/1 von 6/);
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });

 await run("Klare Auswertung: unvollständige, positive und getrennte Ergebnisse in Alltagssprache",async()=>{
  const x=await open(browser,"index.html");const p=x.page;try{
   await p.locator('.nav[data-view="results"]').click();
   let text=await p.locator("#resultCards").innerText();
   assert.match(text,/Noch nicht ausgewertet/);
   assert.match(text,/Was bedeutet es nicht/);
   assert.match(text,/Nächster Schritt/);
   await p.locator('.nav[data-view="asrs"]').click();
   for(let i=0;i<6;i++){const v=[2,2,2,3,0,0][i];await p.locator('label[for="asrs_'+i+'_'+v+'"]').click();}
   await p.locator('.nav[data-view="results"]').click();
   text=await p.locator("#resultCards").innerText();
   assert.match(text,/Die Schwelle für eine weitere ADHS-Abklärung ist erreicht/);
   assert.match(text,/4 von 6/);
   assert.match(text,/keine Diagnose/);
   assert.match(text,/keine Wahrscheinlichkeit/);
   await p.locator('.nav[data-view="autism"]').click();
   await p.locator('label[for="aut_0_3"]').click();
   assert.match(await p.locator("#autResult").innerText(),/Das bedeutet nicht/);
   await p.locator('.nav[data-view="audhd"]').click();
   assert.match(await p.locator("#audhdResult").innerText(),/kein AuDHS-Nachweis/);
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });
 await run("41-Fragen-Bogen: Ergebnis erklärt Beispiele, Lebensphasen und Grenzen",async()=>{
  const x=await open(browser,"uebungstest.html");const p=x.page;try{
   let text=await p.locator("#report").innerText();
   assert.match(text,/0 von 41 Fragen/);
   assert.match(text,/noch offen/);
   await p.locator('label[for="r_adult_0_3"]').click();
   await p.locator('label[for="r_child_0_4"]').click();
   text=await p.locator("#report").innerText();
   assert.match(text,/Im Erwachsenenalter wurden 1 von 18 Alltagsthemen/);
   assert.match(text,/Einzelheiten überblicken/);
   assert.match(text,/Kindheit – rückblickend/);
   assert.match(text,/keine Diagnosegrenze/);
   assert.match(text,/Was wäre als Nächstes sinnvoll/);
   assert.deepEqual(x.errors,[]);
  }finally{await close(x)}
 });
 await run("Mobilansicht 390px: keine ungewollte horizontale Seitenüberbreite",async()=>{
  for(const filename of URLS){const x=await open(browser,filename,true);try{
   const dims=await x.page.evaluate(()=>({page:document.documentElement.scrollWidth,window:window.innerWidth}));
   assert(dims.page<=dims.window+2,filename+" "+JSON.stringify(dims));
   assert.deepEqual(x.errors,[],filename+" "+x.errors.join(" "));
  }finally{await close(x)}}
 });
 }finally{await browser.close()}
 console.log("\nBrowser QA: "+passed+" bestanden, "+failed+" fehlgeschlagen.");
 if(failed)process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1});

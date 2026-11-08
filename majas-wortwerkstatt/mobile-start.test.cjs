'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'mobile-start.css'),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
for(const s of scripts)new vm.Script(s);
assert(html.includes('mobile-start.css?v=20261108a'),'mobile stylesheet included');
assert(html.includes("if(page==='lernberater')showLearningAdvisor()"),'advisor route active');
assert(html.includes("else if(page==='comics')showComicHub()"),'comic hub route active');
assert(html.includes("else if(page==='stationen')showStationHub()"),'station catalog separate');
assert(html.includes('function showHome()'),'home route exists');
const home=html.slice(html.indexOf('function showHome(){'),html.indexOf('function showLearningAdvisor(){'));
assert(home.includes('Fit für den Kombitest'),'short home title');
for(const link of ['#pruefung/hoeren','#endungen','#verlaengern','#kombitest','#comics','#spiele','#lernberater','#baerli/schrank','#stationen']){
  assert(home.includes('href="'+link+'"'),'home route accessible: '+link);
}
for(const old of ['maja-voice-panel','daily-stories','hero-art','featuredComics.map','learningHome()','station-grid']){
 assert(!home.includes(old),'large/duplicate home sections removed: '+old);
}
const advisor=html.slice(html.indexOf('function showLearningAdvisor(){'),html.indexOf('function showComicHub(){'));
for(const route of ['#figurenstimmen','#comicstudio/toncheck','#comicstudio','#tagesplan','#fehlertraining','#einstellungen','#lernweg']){
 assert(advisor.includes(route),'advisor provides route '+route);
}
assert(!html.includes('window.MajaRealAudio?.mount(page||'),'no extra audio callout injected into homepage');
assert(!html.includes('Absatz '+ '$'+'{i+1}'),'old numbered paragraph labels removed');
assert(css.includes('grid-template-columns:repeat(3,minmax(0,1fr))'),'three topics on mobile');
assert(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))'),'2x2 short links');
assert(css.includes('@media(max-width:480px)'),'mobile-specific sizing');
assert(css.includes(':focus-visible'),'keyboard focus styles');
console.log('Majas mobile start, learning advisor, comics and station hubs: checks passed.');
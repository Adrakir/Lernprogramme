'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'mobile-start.css'),'utf8');
for(const snippet of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean)){
 new vm.Script(snippet);
}
assert.match(html,/mobile-start\.css\?v=20261109e/,'versioned mobile stylesheet included');
for(const route of ["if(page==='lernen'||page==='abenteuer')showJourneyHub(page)","if(page==='lernberater')showLearningAdvisor()","else if(page==='comics')showComicHub()","else if(page==='stationen')showStationHub()"]){
 assert(html.includes(route),'preserve route: '+route);
}
const home=html.slice(html.indexOf('function showHome(){'),html.indexOf('function showLearningAdvisor(){'));
assert(home.includes('Deutsch lernen')&&home.includes('Abenteuer erleben'),'two separate entry doors');
assert(home.includes('href="#lernen"')&&home.includes('href="#abenteuer"'),'two modes linked');
for(const link of ['#pruefung/hoeren','#endungen','#verlaengern','#pruefung','#comics','#spiele','#lernberater','#baerli/schrank']){
 assert(home.includes("href:'"+link+"'"),'journey route preserved: '+link);
}
assert(home.includes('./baerli/baerli.webp'),'known Bärli illustration reused');
assert(home.includes('maja-journey-grid'),'four choices per mode');
assert(home.includes('aria-label'),'navigation labels');
assert(html.includes("function showBearWardrobe(message='')"),'wardrobe route remains');
assert(html.includes('bear-category-grid'),'category pages implemented');
assert(css.includes('.maja-door-grid')&&css.includes('.maja-journey-grid'),'new visual styles');
assert(css.includes('@media(max-width:620px)'),'mobile-specific layout');
assert(css.includes(':focus-visible'),'keyboard focus');
console.log('PASS: two child-friendly modes, preserved learning/game routes, accessible mobile styles.');

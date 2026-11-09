'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'mobile-start.css'),'utf8');
const wardrobe=fs.readFileSync(path.join(__dirname,'baerli-kleiderschrank.js'),'utf8');
for(const snippet of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean))new vm.Script(snippet);
new vm.Script(wardrobe);
assert.match(html,/mobile-start\.css\?v=20\d{6}[a-z]/,'versioniertes mobiles Stylesheet eingebunden');
assert(css.includes('max-width:360px')&&css.includes('overflow-wrap:normal'),'schmale Handys zeigen Überschriften ohne willkürliche Wortbrüche');
const renderBranch=html.slice(html.lastIndexOf('function render('));
assert.match(renderBranch,/if\(page==='lernen'\|\|page==='abenteuer'\)showJourneyHub\(page\);\s*else if\(page==='lernberater'\)showLearningAdvisor\(\)/,'secondary modes remain working');
const home=html.slice(html.indexOf('function showHome(){'),html.indexOf('function showJourneyHub('));
assert(home.includes('Fit für den Kombitest'),'original overview restored');
for(const link of ['#pruefung/hoeren','#endungen','#verlaengern','#kombitest','#comics','#spiele','#lernberater','#baerli/schrank','#stationen','#lernen','#abenteuer','./bilderbuecher/']){
 assert(home.includes('href="'+link+'"'),'original/secondary route kept: '+link);
}
for(const image of ['leseecke.webp','werkstatt.webp','baerli.webp','kostuemkiste.webp']){
 assert(home.includes('./baerli/'+image),'real picture on home tile: '+image);
}
assert(home.includes('maja-quick-topic-grid')&&home.includes('maja-quick-options'),'three+four tiles');
assert(home.includes('maja-topic-symbol')&&css.includes('.maja-classic-home .maja-quick-topic .maja-topic-symbol'),'large topic pictograms');
assert(css.includes('.maja-option-photo img')&&css.includes('@media(max-width:600px)'),'photo tile and mobile sizing');
assert(!wardrobe.includes('const previousShowHome=showHome'),'wardrobe module no longer overrides current home');
assert(wardrobe.includes("hut:'huete',oberteil:'pullover',hose:'hosen',brille:'brillen'"),'legacy outfit slot mapping');
assert(wardrobe.includes("hose:'hosen',brille:'brillen'"),'old wardrobe URLs mapped');
console.log('PASS: familiar Maja home, illustrated pictograms, all routes and wardrobe compatibility.');

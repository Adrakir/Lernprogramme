'use strict';
/**
 * Fast static guardrails; run with: node majas-wortwerkstatt/experience.test.cjs
 * Real browser / screen reader / audio output are additional, separate QA.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const base=__dirname;
const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
const css=fs.readFileSync(path.join(base,'mobile-start.css'),'utf8');
const plus=fs.readFileSync(path.join(base,'maja-plus.js'),'utf8');
const wardrobeJs=fs.readFileSync(path.join(base,'baerli-kleiderschrank.js'),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
assert(scripts.length>=1,'embedded scripts found');
for(const script of scripts)new vm.Script(script);
for(const route of ['#lernen','#abenteuer','#pruefung/hoeren','#endungen','#verlaengern','#pruefung','#comics','#spiele','#lernberater','#baerli/schrank','#erwachsene','#einstellungen']){
 assert(html.includes(route),'route exists: '+route);
}
for(const id of ['prep-playback-mode','prep-playback-speed','prep-voice-list','prep-play','prep-stop','prep-reading']){
 assert(html.includes('id="'+id+'"'),'hearing control: '+id);
}
for(const option of ['value="recorded"','value="computer"','value="1"','value="0.85"','value="0.7"']){
 assert(html.includes(option),'audio option: '+option);
}
assert(html.includes('majas-wortwerkstatt-hoer-tempo-v1'),'speech prefs in backup prefix');
assert(html.includes('new SpeechSynthesisUtterance'),'computer voice');
assert(html.includes("speechAPI?.cancel()"),'speech cleanup');
assert(html.includes('class="prep-question-highlight"'),'red hearing question');
assert(css.includes('.prep-question-highlight')&&css.includes('#c43c38'),'visible red question');
assert(html.includes('errorTypes.push')&&html.includes('prep-error-guide'),'error-specific practice advice');
assert(html.includes('Mit Bärli lernen')&&html.includes('Abschlusstest'),'guided course and final tests retained');
assert(html.includes('maja-parent-snapshot'),'adult summary');
assert(html.includes('role="img" aria-label="Höchstes Ergebnis'),'parent bars accessible');
assert(plus.includes('plus-export')&&plus.includes('plus-import'),'backup and restoration available');
assert(plus.includes('key.startsWith(SAFE_PREFIX)'),'export prefixes limited to app');
for(const key of ['hut','oberteil','hose','brille','hals','schuhe','spielzeug','schule']){
 assert(html.includes(key+":'"),'wardrobe category: '+key);
}
for(const id of ['muetze','sonnenhut','brille','sonnenbrille','winterpullover','regenjacke','jeans','rotehose','sneaker','stiefel']){
 assert(html.includes("id:'"+id+"'"),'wardrobe item: '+id);
}
assert(wardrobeJs.includes('bw-category-grid')&&wardrobeJs.includes('bw-pagination'),'wardrobe pagination');
assert(!html.includes('bear-category-grid'),'inline duplicate wardrobe UI stays removed');
assert(html.includes("bearOutfitKey='majas-wortwerkstatt-baerli-auswahl-v1'"),'existing outfit save key preserved');
assert(html.includes("starWalletKey='majas-wortwerkstatt-sternenbeutel-v1'"),'existing star save key preserved');
assert(css.includes('@media(max-width:620px)'), 'mobile layout');
for(const doc of ['AGENTS.md','PROJECT_STATE.md','README.md'])assert(fs.existsSync(path.join(base,doc)),'handoff doc: '+doc);

const newWardrobeIds=['abenteuercap','partyhut','forscherbrille','herzbrille','ringelpullover','blauejacke','schlaghose','kordhose','punkteschal','winterschal','lilasneaker','streifenstiefel'];
for(const id of newWardrobeIds)assert(wardrobeJs.includes("id:'"+id+"'"),'new clothing remains available: '+id);
new vm.Script(wardrobeJs);
assert(wardrobeJs.includes('bearFigure(true,item)'),'new clothes can be previewed on Bärli');
assert(wardrobeJs.includes('if(previewItem)equipped.push(previewItem)'),'preview overlay replaces worn slot');
assert(wardrobeJs.includes('bw-category-sample'),'wardrobe categories have images');
assert(wardrobeJs.includes('Anprobe – noch nicht gekauft'),'preview distinguished from purchase');
assert(!wardrobeJs.includes('localStorage.clear('),'wardrobe does not erase saved child data');
console.log('PASS: parseable scripts, learning/adventure, hearing, didactics, parent snapshot, storage, wardrobe, handoff.');

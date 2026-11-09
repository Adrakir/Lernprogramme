'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=__dirname;
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const kino=fs.readFileSync(path.join(root,'comic-kino.js'),'utf8');
const style=fs.readFileSync(path.join(root,'comic-kino.css'),'utf8');

assert(html.includes('comic-kino.js?v=20261109c'),'Comic module loaded');
assert(html.includes('comic-kino.css?v=20261109c'),'Comic styles loaded');
assert(html.includes('window.MajaComicKino?.stop()'),'Speech cleaned up on navigation');
assert(html.includes("mode:'school'"),'School comics use new audio player');
assert(html.includes("mode:'detective'"),'Detective comics use new audio player');
assert(html.includes('Hörtraining in Abschnitten'),'Guided audio section exists');
assert(html.includes('data-cue-index'),'Audio passage replay implemented');
assert(style.includes('touch-action:none'),'Music buttons have pointer touch handling');
assert(style.includes('touch-action:pan-y'),'Kart swipe handling configured');
assert(style.includes('kino-separated'),'Comic balloon layout is switchable');
const school=html.slice(html.indexOf('const schoolComics=['),html.indexOf('const detectiveEpisodes=['));
assert(!school.includes('Frau Winter'),'School teacher name updated');
assert(school.includes('Frau Burger'),'School comics name Frau Burger');
for(const snippet of html.split('<script>').slice(1).map(x=>x.split('</script>')[0]).filter(Boolean))
 new vm.Script(snippet);
new vm.Script(kino);

const sandbox={window:{},document:{querySelector:()=>null},localStorage:{getItem:()=>null,setItem:()=>{}}};
vm.runInNewContext(kino,sandbox);
assert(typeof sandbox.window.MajaComicKino.mount==='function');
assert(typeof sandbox.window.MajaComicKino.stop==='function');
sandbox.window.MajaComicKino.mount({frames:[[{speaker:'Maja',text:'Hallo!'}]]});
sandbox.window.MajaComicKino.stop();
console.log('Comic-Kino: Einbindung, Syntax, Hörtraining und Touch-Kontrollen geprüft.');
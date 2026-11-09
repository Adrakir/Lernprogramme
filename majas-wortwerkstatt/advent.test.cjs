'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=__dirname;
const code=fs.readFileSync(path.join(root,'baerli-advent.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const wardrobe=fs.readFileSync(path.join(root,'baerli-kleiderschrank.js'),'utf8');
const seasons=fs.readFileSync(path.join(root,'baerli-saison.js'),'utf8');
const houseCode=fs.readFileSync(path.join(root,'baerli-baumhaus.js'),'utf8');
new vm.Script(code);
const season={window:{}};vm.runInNewContext(seasons,season);
const availableItems=new Set(season.window.MajaBaerliSaison.map(x=>x.id));
for(const m of wardrobe.matchAll(/id:'([^']+)'/g))availableItems.add(m[1]);
const tree={window:{},localStorage:{getItem:()=>null},Intl,Date,document:{querySelector:()=>({innerHTML:'',querySelectorAll:()=>[]})}};
vm.runInNewContext(houseCode,tree);
const availableFurniture=new Set(tree.window.MajaTreehouse.products.map(p=>p.id));
const games=new Map([['kart',6],['melodie',5],['wolkenwege',12],['hexenpfad',12]]);
const marker='const STORIES=';
const begin=code.indexOf(marker)+marker.length;
const end=code.indexOf(';\nconst esc=',begin);
assert(begin>marker.length&&end>begin,'Adventsgeschichten als Daten vorhanden');
const stories=JSON.parse(code.slice(begin,end));
assert.equal(stories.length,24,'24 verschiedene Türchen');
assert.deepEqual(stories.map(s=>s.day),Array.from({length:24},(_,i)=>i+1));
assert.equal(new Set(stories.map(s=>s.reward.type+':'+s.reward.id)).size,24,'verschiedene Geschenke');
let wardrobeGifts=0,houseGifts=0,gameGifts=0;
for(const story of stories){
 assert(story.title.length>12,'aussagekräftiger Titel an Tag '+story.day);
 assert(story.story.length>250,'eine echte Kurzgeschichte an Tag '+story.day);
 assert(story.quiz.options.length===3,'drei Antworten an Tag '+story.day);
 assert(Number.isInteger(story.quiz.correct)&&story.quiz.correct>=0&&story.quiz.correct<3);
 assert(new Set(story.quiz.options).size===3,'Antworten verschieden an Tag '+story.day);
 assert(story.quiz.why.length>=15,'Erklärung zur Frage');
 const gift=story.reward;
 if(gift.type==='wardrobe'){wardrobeGifts++;assert(availableItems.has(gift.id),'Schrankartikel existiert: '+gift.id);}
 else if(gift.type==='house'){houseGifts++;assert(availableFurniture.has(gift.id),'Baumhausartikel existiert: '+gift.id);}
 else if(gift.type==='game'){
   gameGifts++;
   const [id,level]=gift.id.split(':');
   assert(games.has(id)&&Number(level)>=4&&Number(level)<=games.get(id),'Geschenktes Level erreichbar: '+gift.id);
 }else assert.fail('Unbekannter Geschenktyp: '+gift.type);
}
assert(wardrobeGifts>=7&&houseGifts>=10&&gameGifts===3,'abwechslungsreiche 24 Geschenke');
assert(code.includes("const STORE='majas-wortwerkstatt-advent-v1'"),'Sicherungsdatei erkennt Adventdaten');
assert(code.includes("window.MajaTreehouse?.gift(gift.id)"),'Baumhausgeschenke werden ohne Geld geliefert');
assert(code.includes("current.purchases[key]={cost:0"),'Kleider und Level kostenlos');
assert(code.includes('latest.opened[key]=true'),'Türchen nur einmal speichern');
assert(code.includes('if(!available(n,dateParts()))'),'Keine vorzeitigen Geschenke');
assert(code.includes('window.MajaAdvent={render,read,available,stories:STORIES,deliver}'),'Advent ist nachladbar');
assert(html.includes("else if(page==='advent')window.MajaAdvent?.render(index,part)"),'Router integriert');
assert(html.includes('href="#advent"'),'Startlink integriert');
assert(html.indexOf('src="./baerli-advent.js')>html.indexOf('src="./baerli-kleiderschrank.js'),'Inventar vor Advent');
assert(html.includes('src="./baerli-advent.js?v=20261109a"'),'versionierte Einbindung');
assert(sw.includes("'./baerli-advent.js'")&&sw.includes("'./baerli-advent.css'"),'offline verfügbar');
assert(houseCode.includes("amount===p.price||amount===0"),'Kostenlose Geschenke bleiben nach Neustart gültig');
console.log('PASS: 24 Adventgeschichten, '+wardrobeGifts+' Kleider, '+houseGifts+' Möbel, '+gameGifts+' Minispiel-Level, Dezember-Öffnung, sichere Belohnungen und Backup.');

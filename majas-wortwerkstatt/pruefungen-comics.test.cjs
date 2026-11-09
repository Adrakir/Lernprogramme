'use strict';
/* Fachliche Strukturprüfung; ersetzt weder die Testdurchläufe noch echtes Hören. */
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=__dirname, html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const cinema=fs.readFileSync(path.join(root,'comic-kino.js'),'utf8');
const readBetween=(from,to)=>{
  const first=html.indexOf(from);
  assert(first>=0,'start marker '+from);
  const end=html.indexOf(to,first+from.length);
  assert(end>first,'end marker '+to);
  return html.slice(first,end);
};
const resources=vm.runInNewContext(
 readBetween('const annaStories = [','const annaDayFormatter')+
 readBetween('const prepListen=[','function prepChoice')+
 '({stories:annaStories,hearing:prepListen,nouns:prepNounSets,plurals:prepPluralSets})');
assert.equal(resources.hearing.length,5);
assert.equal(resources.nouns.length,5);
assert.equal(resources.plurals.length,5);
const seen=new Set();
for(let n=0;n<5;n++){
  const [track,rows]=resources.hearing[n], story=resources.stories.find(s=>s.id===track);
  assert(story,'one original story for hearing exam '+(n+1));
  assert(!seen.has(track),'no duplicate exam story');
  seen.add(track);
  assert(fs.statSync(path.join(root,'anna-audio',track+'.mp3')).size>1000,'audio file for '+track);
  assert.equal(rows.length,5,'five questions in exam '+(n+1));
  for(const [prompt,right,wrong1,wrong2,explanation] of rows){
    assert([prompt,right,wrong1,wrong2,explanation].every(x=>typeof x==='string'&&x.trim().length>=2),'complete question data');
    assert.equal(new Set([right,wrong1,wrong2]).size,3,'distinct answer options');
    assert(!/[<>]/.test(prompt+right+wrong1+wrong2),'question has no raw HTML');
  }
  assert.equal(resources.nouns[n].length,5);
  assert.deepEqual(Array.from(resources.nouns[n],x=>x[2]),['ung','heit','keit','schaft','nis']);
  for(const [base,answer,suffix] of resources.nouns[n]){
    assert(answer.toLowerCase().startsWith('die ')||answer.toLowerCase().startsWith('das '),'Nomen has expected article');
    assert(answer.endsWith(suffix),'noun ends in required suffix: '+answer);
    assert(base.length>0,'valid base form');
  }
  assert.equal(resources.plurals[n].length,5);
  for(const [singular,plural,wrong] of resources.plurals[n]){
    assert.notEqual(singular,wrong,'distractor differs from solution');
    assert.notEqual(singular,plural,'plural differs from singular');
    assert(plural.length>0&&wrong.length>0,'nonempty variants');
  }
}
assert(html.includes('Im Abschlusstest ist der Hörtext nicht sichtbar'),'no script spoiler in listening exams');
assert(html.includes("if(readingPanel)readingPanel.ontoggle"),'reading helper handled when absent');
assert(html.includes('if(!audio.paused||audio.ended)'),'press play again restarts recording');
assert.equal(resources.plurals[3][4][2],'Stok','Stock distractor corrected');
const comicData=vm.runInNewContext(
 readBetween('const schoolComics=[','const schoolComicAsset')+
 readBetween('const detectiveEpisodes=[','const detectiveAsset')+
 readBetween('const detectivePlacement=','function detectiveArt(')+
 '({school:schoolComics,detective:detectiveEpisodes,positions:detectivePlacement})');
assert.equal(comicData.school.length,3);
assert.equal(comicData.detective.length,5);
for(const comic of comicData.school){
  assert.equal(comic.panels.length,8,comic.id+' has eight panels');
  assert(fs.statSync(path.join(root,'baerli','comics',comic.id+'.webp')).size>1000);
  for(const panel of comic.panels)assert.equal(panel.length,6,comic.id+' has two speech entries per panel');
}
for(const comic of comicData.detective){
  assert.equal(comic.pages.length,6,comic.id+' has six comic pages');
  assert.equal(comic.panels.length,24,comic.id+' has 24 panels');
  assert.equal(comicData.positions[comic.id].length,24,comic.id+' has placement for each panel');
  assert(fs.statSync(path.join(root,'baerli','tagescomics',comic.id+'.webp')).size>1000);
}
assert(fs.statSync(path.join(root,'baerli','tagescomics','tom-dusche.webp')).size>1000);
assert(cinema.includes('config.separate:narrow'),'mobile bubble default avoids covering faces');
assert(cinema.includes('kino-zoom-art'),'comic artwork can be enlarged');
const css=fs.readFileSync(path.join(root,'comic-kino.css'),'utf8');
assert(css.includes('comic-dialogue::before'),'school-comic speech bubbles have pointers');
console.log('PASS: 5 hearing texts/MP3/25 questions, 5 spelling sets/75 tasks, 3 school and 5 detective comic sheets, display safeguards.');

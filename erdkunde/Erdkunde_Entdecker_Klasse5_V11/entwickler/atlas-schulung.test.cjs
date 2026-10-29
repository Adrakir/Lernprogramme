'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'atlas-schulung.js'),'utf8');
let checks=0;function ok(value,message){assert.ok(value,message);checks++;}function equal(a,b){assert.equal(a,b);checks++;}
function boot(options={}){
 const listeners={},frames=new Map();let frame=0;
 const play={textContent:'Animation abspielen',attrs:{},setAttribute(k,v){this.attrs[k]=v;}};
 const trace={style:{},getTotalLength:()=>620};
 const classes=new Set();const root={id:'at-course-lesson',dataset:{atContext:'lesson'},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)},querySelector:s=>s==='[data-at="play"]'?play:null,querySelectorAll:s=>s==='[data-at-trace]'?[trace]:[]};
 const ctx={window:{},document:{hidden:false,addEventListener:(k,f)=>(listeners[k]??=[]).push(f),getElementById:id=>id===root.id?root:null},localStorage:{getItem:()=>options.saved||null,setItem(){}},matchMedia:()=>({matches:!!options.reduced}),requestAnimationFrame:f=>{frames.set(++frame,f);return frame;},cancelAnimationFrame:id=>frames.delete(id),render(){},renderLesson:()=>'<section class="hero"><h1>Atlas</h1></section><section>Alt</section>',renderLab:()=>'<section>Labor</section>',renderGuide:()=>'<section class="card guide-panel"><h2>Alt</h2></section><footer>Weiter</footer>',g9Story:()=>'<p>Anderer Comic</p>',g9M:()=>ctx.G9_MISSIONS.find(m=>m.id===ctx.g9.id),g9Button:(t,a)=>`<button data-g9="${a}">${t}</button>`,G9_MISSIONS:[{id:'atlasdetektiv',scenes:[[],[],[]],n:3},{id:'anderer',scenes:[],n:0}],G9_QUESTIONS:{atlasdetektiv:[[],[],[]]},g9:{id:'atlasdetektiv',scene:0,phase:'story'},state:{topic:'atlanten',guideStep:0,tab:'learn',lab:'atlas'},progress:{},save(){}};
 vm.createContext(ctx);vm.runInContext(source,ctx);
 const click=action=>{const button={dataset:{at:action},closest:()=>root};const e={target:{closest:s=>s==='[data-at]'?button:null},preventDefault(){},stopPropagation(){}};for(const fn of listeners.click)fn(e);};
 const tick=now=>{const entry=frames.entries().next().value;assert.ok(entry,'Animation muss einen Frame geplant haben');frames.delete(entry[0]);entry[1](now);};
 return {ctx,a:ctx.window.AtlasSchulung,root,play,trace,frames,classes,listeners,click,tick};
}
const b=boot(),a=b.a;
equal(a.examples.length,4);
for(const [id,q,map] of [['prag','NO','Europa'],['lissabon','NW','Europa'],['sanfrancisco','NW','Nordamerika'],['alice','SO','Australien']]){const p=a.examples.find(v=>v.id===id);equal(a.quarterOf(p),q);equal(a.mapFor(p),map);}
equal(a.quarterOf({lat:0,lon:10}),null);equal(a.quarterOf({lat:20,lon:0}),null);
const regionLesson=boot({saved:JSON.stringify({lesson:{step:4}})});ok(regionLesson.a.render('lesson').includes('In welches Erdviertel?'));regionLesson.click('chooseq:NO');regionLesson.click('choosemap:Europa');regionLesson.click('check-region');ok(regionLesson.a.render('lesson').includes('2 von 2 Entscheidungen richtig'));
for(const p of a.examples){
 equal(a.steps(p).length,10);ok(a.steps(p)[5].say.includes('Breitenkreis'));ok(a.steps(p)[6].say.includes('Meridian'));ok(a.steps(p)[8].say.includes(p.name));
 const g=a.geometry(p.bounds);ok(g.X(p.lon)>g.left&&g.X(p.lon)<g.left+g.width);ok(g.Y(p.lat)>g.top&&g.Y(p.lat)<g.top+g.height);
}
ok(a.steps(a.examples[3])[5].say.includes('südlich'));
ok(a.steps(a.examples[1])[6].say.includes('westlich'));
for(const [p,expected] of [[null,'noch keinen Punkt'],[{lat:50,lon:10},'nach Norden'],[{lat:54,lon:6},'nach Süden'],[{lat:52,lon:6},'nach Osten'],[{lat:52,lon:10},'nach Westen'],[{lat:52,lon:8},'Richtig:']])ok(a.pointAdvice(p).includes(expected),'Richtungshinweis: '+expected);
const help=a.render('lesson');ok(help.includes('Hilfe 1: Wie finde ich die Breite?')===false);
const practice=boot({saved:JSON.stringify({lesson:{step:9,checked:true,point:{lat:50,lon:10},first:'longitude',field:'D2'}})}).a.render('lesson');ok(practice.includes('Hilfe 1: Wie finde ich die Breite?'));ok(practice.includes('Hilfe 2: Wie finde ich die Länge?'));ok(practice.includes('Die Breite ist zu weit südlich'));ok(practice.includes('Die Länge ist zu weit östlich'));
const geom=a.geometry([4,16,48,56]),point=a.pointFromXY(geom.X(8),geom.Y(52));equal(point.lat,52);equal(point.lon,8);
for(const p of [[89,65],[711,65],[90,64],[90,351],[NaN,100],[Infinity,100]])equal(a.pointFromXY(...p),null);
for(const p of [{lat:52,lon:8},{lat:51.5,lon:8.5},{lat:52.49,lon:7.51}])ok(a.grade(p,'latitude',' b 3 ').point);
for(const p of [null,{lat:NaN,lon:8},{lat:-52,lon:8},{lat:52,lon:-8},{lat:52.51,lon:8},{lat:52,lon:8.51}])equal(a.grade(p,'latitude','B3').point,false);
ok(a.grade(point,'latitude','b3').first);ok(a.grade(point,'latitude','b3').field);equal(a.grade(point,'longitude','B3').first,false);equal(a.grade(point,'latitude','D2').field,false);
for(const bad of [null,[],true,42,'<script>']){const s=a.clean(bad);equal(s.step,0);equal(s.example,'prag');}
const dirty=a.clean({step:99,example:'unbekannt',point:{lat:100,lon:8},first:'<script>',field:'abcdefghijklmnop'});equal(dirty.step,9);equal(dirty.point,null);equal(dirty.first,'');equal(dirty.field.length,12);
const hostile=boot({saved:JSON.stringify({lesson:{step:9,field:'"><script>'}})}).a.render('lesson');ok(!hostile.includes('value=""><script>'));ok(hostile.includes('&lt;script&gt;'));
ok(b.ctx.renderLesson().includes('at-course-lesson'));b.ctx.state.topic='gradnetz';ok(!b.ctx.renderLesson().includes('at-course-lesson'));b.ctx.state.topic='atlanten';
ok(b.ctx.renderGuide().includes('Gustavs animierte Atlas-Schulung starten'));b.ctx.state.guideStep=1;ok(b.ctx.renderGuide().includes('at-course-guide'));ok(!b.ctx.renderGuide().includes('<h2>Alt</h2>'));b.ctx.state.guideStep=5;ok(!b.ctx.renderGuide().includes('at-course-guide'));
ok(b.ctx.renderLab().includes('at-course-workshop'));b.ctx.state.lab='height';ok(!b.ctx.renderLab().includes('at-course-workshop'));
ok(b.ctx.g9Story().includes('at-course-comic'));equal(b.ctx.G9_MISSIONS[0].scenes.length,10);equal(b.ctx.G9_MISSIONS[0].n,8);equal(b.ctx.G9_QUESTIONS.atlasdetektiv.length,8);b.ctx.g9.id='anderer';equal(b.ctx.g9Story(),'<p>Anderer Comic</p>');
const animation=boot();animation.click('play');equal(animation.play.textContent,'Pause');equal(animation.frames.size,1);animation.tick(0);animation.tick(1300);equal(animation.trace.style.strokeDashoffset,'310');animation.click('play');equal(animation.frames.size,0);equal(animation.play.textContent,'Animation abspielen');equal(animation.trace.style.strokeDashoffset,'310');animation.click('play');animation.tick(2000);equal(animation.trace.style.strokeDashoffset,'310');animation.tick(3300);equal(animation.trace.style.strokeDashoffset,'0');equal(animation.frames.size,0);
animation.click('play');animation.tick(4000);animation.ctx.document.hidden=true;for(const f of animation.listeners.visibilitychange)f();equal(animation.frames.size,0);equal(animation.play.textContent,'Animation abspielen');animation.ctx.document.hidden=false;animation.click('play');animation.ctx.render();equal(animation.frames.size,0);
const quiet=boot({reduced:true});quiet.click('play');equal(quiet.frames.size,0);equal(quiet.trace.style.strokeDashoffset,'0');ok(quiet.a.render('lesson').includes('ruhige Einzelbilder'));
const book=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');ok(book.includes('atlas-schulung.js'));ok(book.includes('function renderCourse'));ok(book.includes("AtlasSchulung?.render('workshop')"));ok(book.includes('Erdkunde_Schulung_Gradnetz_Atlas_Klasse5.pdf'));
console.log(checks+' Prüfungen bestanden: Koordinaten, Richtungen, drei Integrationswege, Praxisbewertung, Pause/Fortsetzen und reduzierte Bewegung.');

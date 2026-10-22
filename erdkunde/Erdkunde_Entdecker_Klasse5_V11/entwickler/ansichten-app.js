/* Korrigierte Darstellungen verwenden in allen älteren Lernstationen dasselbe Modell. */
'use strict';
v7SceneSvg=function(){return geoScene(Number(v7.angle))};
const geoOriginalComicGraphic=g9SceneGraphic;
g9SceneGraphic=function(m){
 if(m.kind!=='building')return geoOriginalComicGraphic(m);
 const angle=g9.phase==='story'?([45,90,0,45][g9.scene]??45):Number(g9.angle);
 return geoScene(angle);
};
const geoOriginalDroneGraphic=g10SceneGraphic;
g10SceneGraphic=function(m){
 if(m.kind!=='camera')return geoOriginalDroneGraphic(m);
 const story=g9.phase==='story';
 return geoDrone(story?(g9.scene===0?'oblique':'top'):g10.camera,story?(g9.scene===2?3:2):g10.altitude);
};
const geoOriginalExperiment=g9Experiment;
g9Experiment=function(m){
 return geoOriginalExperiment(m).replace(/Blickwinkel verändern: (\d+)° \((?:Draufsicht|Seitenansicht|Schrägansicht)\)/,(_,a)=>`Blickwinkel verändern: ${a}° (${Number(a)===90?'Draufsicht':Number(a)===0?'Seitenansicht':'Schrägansicht'})`);
};
v11Roof=function(view='top'){return geoScene(view==='side'?0:90,1,view==='map'||view==='plan')};
labView=function(){
 const mode=state.viewAerial||'top',names={side:'Seitenansicht',oblique:'Schrägansicht',top:'Draufsicht',map:'Kartenskizze'};
 return `<p>Ein Objekt, vier Darstellungen: Haus, Baum und Straße bleiben dieselben.</p><div class="chips">${Object.entries(names).map(([k,n])=>btn(n,'view:'+k,'btn '+(mode===k?'alt':'ghost')+' small')).join('')}</div>${geoScene(mode==='side'?0:mode==='oblique'?45:90,1,mode==='map')}${geoDepth('perspektive')}<h3>Direkter Vergleich: alle vier Ansichten</h3>${geoComparison(1)}<h3>Zweites Objekt: Schrägansicht und passende Draufsicht</h3>${geoComparison(2)}<details class="accordion"><summary>Zusätzlich: echte Diepholzer Karte und Quellen (Internet erforderlich)</summary>${v8ViewLesson()}</details>`;
};
const geoOriginalLesson=renderLesson;
renderLesson=function(){
 let html=geoOriginalLesson();
 if(['perspektive','luftbild','skizzen'].includes(state.topic))html+=`<section class="card"><h2>Dasselbe Objekt vergleichen</h2>${geoComparison(1)}<h3>Objekt 2: L-förmige Schule</h3>${geoComparison(2)}</section>`;
 return html+geoLearningVisual(state.topic)+geoDepth(state.topic);
};
const geoOriginalStart=renderStart;
renderStart=function(){return geoOriginalStart()+`<section class="card"><h2>📖 Bebildertes Lernheft</h2><p>Alle Themen, ausführliche Erklärungen und zusammengehörige Ansichten. Die druckbare HTML-Fassung funktioniert auch ohne PDF-Anzeige.</p><a class="btn" href="lernheft.html">Lernheft öffnen · PDF und Druck</a></section>`};
function geoSelfTest(){
 const results=[];
 const check=(name,ok)=>results.push({name,ok:!!ok});
 for(const a of [0,15,40,45,60,75,90])for(const o of [1,2]){
  const svg=geoScene(a,o);
  check(`Projektion ${o}/${a}°`,svg.includes('<svg')&&!/NaN|Infinity|undefined/.test(svg));
 }
 check('Vier Ansichten desselben Objekts',(geoComparison(1).match(/<svg /g)||[]).length===4);
 check('Zweites Objekt mit Draufsicht',(geoComparison(2).match(/<svg /g)||[]).length===2);
 check('Drohnenwinkel verändern die Geometrie',geoDrone('top',2)!==geoDrone('oblique',2));
 check('Drohnenhöhe verändert die Geometrie',geoDrone('top',1)!==geoDrone('top',3));
 check('Senkrecht ohne Fassaden',!geoDrone('top',2).includes('#f0cba0'));
 check('Schräg mit Fassaden',geoDrone('oblique',2).includes('#f0cba0'));
 check('Alle Quizfragen mit gültiger Lösung',Q.every(q=>Array.isArray(q.opts)&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.opts.length));
 check('16 Lernpfade weiterhin vorhanden',MODULES.length===16);
 return {passed:results.filter(r=>r.ok).length,total:results.length,results};
}
render();

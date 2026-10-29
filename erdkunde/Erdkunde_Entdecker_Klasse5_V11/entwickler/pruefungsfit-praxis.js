/* Praktische Geowerkstatt: ergänzt Prüfungsfit, ohne die vorhandene Klassenarbeit zu ersetzen. */
(function(){
'use strict';
const main=document.getElementById('main');
if(!main)return;
const STORE='erdkunde-pruefungsfit-praxis-v1';
const names=['N','NO','O','SO','S','SW','W','NW'];
const compassTasks=[
 {north:0,target:7,why:'Norden zeigt nach oben. Der See liegt oben links: Nordwest.'},
 {north:6,target:0,why:'Norden zeigt nach links. Rechts davon im Uhrzeigersinn liegt Osten oben.'},
 {north:4,target:2,why:'Norden zeigt nach unten. Der See rechts auf dem Blatt liegt deshalb im Westen.'},
 {north:2,target:3,why:'Norden zeigt nach rechts. Der See rechts unten liegt damit im Nordosten.'},
 {north:0,target:5,why:'Bei Norden oben liegt der See links unten: Südwest.'},
 {north:6,target:3,why:'Norden zeigt nach links. Die Richtung rechts unten ist Südwest.'}
];
const coordTasks=[
 {lat:60,lon:-30},{lat:-30,lon:120},{lat:30,lon:90},
 {lat:-60,lon:-60},{lat:0,lon:0},{lat:30,lon:-120}
];
const entries=[
 {place:'Frankfurt am Main',region:'Hessen',map:'D',cell:'B3'},
 {place:'Frankfurt (Oder)',region:'Brandenburg',map:'F',cell:'C2'},
 {place:'Neustadt (Holstein)',region:'Schleswig-Holstein',map:'A',cell:'D1'},
 {place:'Neustadt an der Weinstraße',region:'Rheinland-Pfalz',map:'E',cell:'A4'},
 {place:'Oldenburg (Oldb)',region:'Niedersachsen',map:'G',cell:'B2'},
 {place:'Oldenburg in Holstein',region:'Schleswig-Holstein',map:'H',cell:'D4'}
];
const atlasTasks=[1,0,3,2,4,5];
const totals={grid:coordTasks.length,compass:compassTasks.length,atlas:atlasTasks.length};
const titles={grid:'Koordinaten am Schnittpunkt setzen',compass:'Nordpfeil und Himmelsrichtungen',atlas:'Atlasregister und Planquadrat'};
let results={};try{results=JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(e){}
let s={view:'home',station:'grid',index:0,score:0,checked:false,hint:false,feedback:'',selected:false,lat:0,lon:0,direction:null,entry:null,cell:null};
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[c]));}
function btn(label,action,cls){return '<button type="button" class="'+(cls||'pf-quiet')+'" data-praxis="'+esc(action)+'">'+esc(label)+'</button>';}
function coord(lat,lon){
 const c=(v,p,n)=>v===0?'0°':Math.abs(v)+'° '+(v>0?p:n);
 return c(lat,'N','S')+' / '+c(lon,'O','W');
}
function gridX(lon){return 360+lon*5/3;}
function gridY(lat){return 210-lat*5/3;}
function gridPicture(){
 let svg='<svg data-praxis-map="grid" viewBox="0 0 720 430" role="img" tabindex="0" aria-label="Gradnetz-Modell. Tippe den Schnittpunkt an oder verwende die Richtungstasten. Längengrade von 180 Grad West bis 180 Grad Ost, Breitengrade von 90 Grad Nord bis 90 Grad Süd." xmlns="http://www.w3.org/2000/svg">';
 svg+='<rect x="60" y="60" width="600" height="300" fill="#f3f8fa" stroke="#274b62" stroke-width="3"/>';
 for(let lon=-180;lon<=180;lon+=30){
  const x=gridX(lon);svg+='<path d="M'+x+' 60V360" stroke="'+(lon===0?'#9b4a7b':'#afcbd7')+'" stroke-width="'+(lon===0?3:1.5)+'"/>';
  if(lon%60===0)svg+='<text x="'+x+'" y="389" text-anchor="middle" font-size="15" fill="#18394b">'+(lon===0?'0°':Math.abs(lon)+'°'+(lon>0?'O':'W'))+'</text>';
 }
 for(let lat=-90;lat<=90;lat+=30){
  const y=gridY(lat);svg+='<path d="M60 '+y+' H660" stroke="'+(lat===0?'#146d9a':'#afcbd7')+'" stroke-width="'+(lat===0?3:1.5)+'"/>';
  svg+='<text x="49" y="'+(y+5)+'" text-anchor="end" font-size="15" fill="#18394b">'+(lat===0?'0°':Math.abs(lat)+'°'+(lat>0?'N':'S'))+'</text>';
 }
 if(s.selected)svg+='<circle cx="'+gridX(s.lon)+'" cy="'+gridY(s.lat)+'" r="12" fill="#d65b21" stroke="#fff" stroke-width="3"/><circle cx="'+gridX(s.lon)+'" cy="'+gridY(s.lat)+'" r="17" fill="none" stroke="#a64116" stroke-width="2"/>';
 if(s.checked){
  const t=coordTasks[s.index],x=gridX(t.lon),y=gridY(t.lat);
  svg+='<path class="praxis-solution" d="M60 '+y+' H'+x+' V360" fill="none" stroke="#13845e" stroke-width="5" stroke-dasharray="8 6"/>';
  svg+='<circle cx="'+x+'" cy="'+y+'" r="10" fill="#13845e" stroke="#fff" stroke-width="3"/>';
 }
 svg+='</svg>';
 return '<figure class="praxis-map">'+svg+'<figcaption>Modell des Gradnetzes ohne Ländergrenzen, nicht flächentreu. Die Punkte liegen auf 30°-Schritten. <b>Orange</b> ist deine Markierung; <b>Grün</b> zeigt nach dem Prüfen die Lösung.</figcaption></figure>';
}
function point(dir,r){const a=(dir*45-90)*Math.PI/180;return [Math.round(360+Math.cos(a)*r),Math.round(207+Math.sin(a)*r)];}
function compassPicture(){
 const t=compassTasks[s.index],n=point(t.north,111),m=point(t.target,113);
 let svg='<svg viewBox="0 0 720 420" role="img" aria-label="Gedrehter Kartenplan. Der rote Nordpfeil zeigt in eine andere Richtung als die Bildschirmoberkante. Der blaue Punkt ist der See." xmlns="http://www.w3.org/2000/svg">';
 svg+='<rect width="720" height="420" rx="16" fill="#f2f7f8"/><circle cx="360" cy="207" r="149" fill="#e4f0e5" stroke="#456877" stroke-width="3"/>';
 for(let i=0;i<8;i++){const a=point(i,145);svg+='<path d="M360 207 L'+a[0]+' '+a[1]+'" stroke="#aabec2" stroke-width="1.5"/>';}
 svg+='<circle cx="360" cy="207" r="18" fill="#735444" stroke="#fff" stroke-width="3"/><text x="360" y="215" text-anchor="middle" fill="white" font-size="22">H</text>';
 svg+='<path d="M360 207 L'+n[0]+' '+n[1]+'" stroke="#bb352c" stroke-width="9" stroke-linecap="round"/><circle cx="'+n[0]+'" cy="'+n[1]+'" r="20" fill="#a52d25"/><text x="'+n[0]+'" y="'+(n[1]+7)+'" text-anchor="middle" font-size="22" font-weight="800" fill="white">N</text>';
 svg+='<circle cx="'+m[0]+'" cy="'+m[1]+'" r="16" fill="#1766a1" stroke="#fff" stroke-width="4"/>';
 svg+='<text x="'+m[0]+'" y="'+(m[1]+37)+'" text-anchor="middle" font-size="17" font-weight="700" fill="#17445c">See</text>';
 svg+='<text x="360" y="401" text-anchor="middle" font-size="17" fill="#274b62">H = Haus · rot = Nordpfeil · blau = See</text></svg>';
 return '<figure class="praxis-map">'+svg+'<figcaption>Eine Karte darf gedreht sein. Richte deine Entscheidung immer nach dem roten Nordpfeil, nicht nach dem Bildschirmrand.</figcaption></figure>';
}
function atlasPicture(){
 let h='<div class="praxis-register" aria-label="Modell eines Atlasregisters"><h3>Register (Modell)</h3><p class="pf-small">Das Register enthält mehrere gleichnamige Orte. Vergleiche deshalb immer Bundesland und Ort.</p><div class="praxis-register-list">';
 entries.forEach((e,i)=>{h+=btn(e.place+' · '+e.region+' · Karte '+e.map+' · '+e.cell,'entry:'+i,s.entry===i?'praxis-active':'pf-quiet');});
 h+='</div></div><h3>Auf der gewählten Karte: Welches Planquadrat?</h3><div class="praxis-plan" role="group" aria-label="Vier mal vier Felder. Buchstabe bezeichnet die Spalte, Zahl die Zeile.">';
 h+='<div aria-hidden="true"></div>';for(const l of 'ABCD')h+='<span class="praxis-axis">'+l+'</span>';
 for(let row=1;row<=4;row++){h+='<span class="praxis-axis">'+row+'</span>';for(const col of 'ABCD'){let val=col+row;h+=btn(val,'cell:'+val,s.cell===val?'praxis-active':'praxis-cell');}}
 return h+'</div><p class="pf-small">Dies ist ein eigens erstelltes Übungsregister – die Seitenzahlen und Kartenverweise eines echten Schulatlas können anders sein.</p>';
}
function task(){
 let h='<div class="pf-top">'+btn('← Praxisübersicht','home')+'<span>Station '+(s.index+1)+' / '+totals[s.station]+'</span></div><h1>'+esc(titles[s.station])+'</h1>';
 h+='<div class="pf-progress" aria-label="Fortschritt"><span style="width:'+Math.round((s.index+1)/totals[s.station]*100)+'%"></span></div>';
 if(s.station==='grid'){
  const t=coordTasks[s.index];h+='<p class="praxis-instruction"><b>Auftrag:</b> Setze den Punkt <strong>'+coord(t.lat,t.lon)+'</strong> ins Gradnetz.</p>';
  h+=gridPicture()+'<p>Deine Markierung: <b>'+esc(s.selected?coord(s.lat,s.lon):'noch keine')+'</b>.</p>';
  if(!s.checked)h+='<div class="praxis-arrows" aria-label="Markierung in 30-Grad-Schritten bewegen">'+btn('← 30° W','move:west')+btn('30° N ↑','move:north')+btn('30° S ↓','move:south')+btn('30° O →','move:east')+'</div>';
 }else if(s.station==='compass'){
  h+='<p class="praxis-instruction"><b>Auftrag:</b> In welcher Himmelsrichtung liegt der See vom Haus aus?</p>'+compassPicture();
  if(!s.checked)h+='<div class="praxis-directions" role="group" aria-label="Himmelsrichtung wählen">'+names.map((name,i)=>btn(name,'answer:'+i,s.direction===i?'praxis-active':'pf-quiet')).join('')+'</div>';
  else h+='<p>Deine Wahl: <b>'+esc(s.direction===null?'keine':names[s.direction])+'</b>.</p>';
 }else{
  const e=entries[atlasTasks[s.index]];
  h+='<p class="praxis-instruction"><b>Auftrag:</b> Finde <strong>'+esc(e.place)+'</strong> in <strong>'+esc(e.region)+'</strong>. Wähle den richtigen Registereintrag und das dazugehörige Planquadrat.</p>';
  h+=atlasPicture()+'<p>Auswahl: <b>'+esc(s.entry===null?'kein Registereintrag':entries[s.entry].place+' – Karte '+entries[s.entry].map)+'</b> · Feld <b>'+esc(s.cell||'offen')+'</b>.</p>';
 }
 if(s.hint&&!s.checked){
  const hints={grid:'Breite zuerst: Vom Äquator (0°) nach Norden (+) oder Süden (−). Danach vom Nullmeridian (0°) nach Osten (+) oder Westen (−).',compass:'Stell dir vor, du drehst das Blatt so, dass der Nordpfeil nach oben zeigt. Wo liegt dann der See?',atlas:'Lies den Ortsnamen und die Region genau. Im Register steht die Karte mit dem Suchfeld; Buchstaben sind Spalten, Zahlen sind Zeilen.'};
  h+='<div class="pf-hint" role="note"><b>Gustavs Tipp:</b> '+esc(hints[s.station])+'</div>';
 }
 if(s.feedback)h+='<div class="praxis-feedback" role="status">'+s.feedback+'</div>';
 if(!s.checked)h+='<div class="pf-controls">'+btn('Gustavs Tipp','hint')+btn('Meine Lösung prüfen','check','pf-main')+'</div>';
 else h+='<div class="pf-controls">'+btn(s.index===totals[s.station]-1?'Ergebnis ansehen':'Nächste Aufgabe →','next','pf-main')+'</div>';
 return h;
}
function home(){
 let h='<div class="pf-top"><button type="button" class="pf-quiet" data-pf="overview">← Prüfungsfit</button><span>Aktives Lernen · Klasse 5</span></div>';
 h+='<h1>🌍 Gustavs Geowerkstatt</h1><p>Hier schaust du nicht nur zu: Du setzt Punkte, orientierst dich auf einer gedrehten Karte und findest selbst Planquadrate. Jede Station hat sechs Aufgaben und erklärt Fehler unmittelbar.</p>';
 h+='<div class="pf-grid">';
 for(const key of ['grid','compass','atlas']){
  const intro={grid:'Koordinaten auf einem Gradnetz selbst markieren – mit Fingertipp oder Richtungstasten.',compass:'Den Nordpfeil lesen, selbst wenn die Karte auf dem Kopf steht.',atlas:'Gleichnamige Orte auseinanderhalten und das richtige Suchfeld finden.'}[key];
  const score=results[key];h+='<article class="pf-tile"><h2>'+esc(titles[key])+'</h2><p>'+esc(intro)+'</p><p class="pf-small">'+(score?'Letzter Durchgang: '+score.score+'/'+score.total+' korrekt':'Noch nicht ausprobiert')+'</p>'+btn('Station üben','start:'+key,'pf-main')+'</article>';
 }
 h+='</div><div class="pf-end"><h2>Danach die komplette Klassenarbeit</h2><p>Die vorhandene interaktive Klassenarbeit mit 18 Aufgaben, Zeichnungen und bebilderten Lösungswegen bleibt erhalten.</p><button type="button" data-pf="classwork" class="pf-main">Zur interaktiven Klassenarbeit</button></div>';
 return h;
}
function summary(){
 let h='<div class="pf-top">'+btn('← Praxisübersicht','home')+'<span>Auswertung</span></div><h1>'+esc(titles[s.station])+' geschafft!</h1>';
 h+='<p class="pf-goal"><b>'+s.score+' von '+totals[s.station]+' Aufgaben</b> richtig. Das ist eine Lernrückmeldung, keine Note.</p>';
 h+='<p>'+(s.score===totals[s.station]?'Sehr gut: Du kannst die Aufgabe jetzt auch im Schulatlas probieren.':'Übe die Station erneut. Lies bei einer falschen Antwort erst die Begründung und probiere es danach ohne Tipp.')+'</p>';
 h+='<div class="pf-controls">'+btn('Noch einmal üben','start:'+s.station,'pf-main')+btn('Andere Station','home')+'<button type="button" class="pf-quiet" data-pf="classwork">Zur Klassenarbeit</button></div>';
 return h;
}
function render(){
 const content=s.view==='home'?home():s.view==='task'?task():summary();
 main.innerHTML='<section id="pf-root" class="pf-panel praxis-root">'+content+'</section>';
 const heading=main.querySelector('h1');if(heading)heading.setAttribute('tabindex','-1');const restore=s.restoreAction&&main.querySelector('[data-praxis="'+s.restoreAction+'"]');if(restore&&typeof restore.focus==='function')restore.focus({preventScroll:true});else if(s.focusHeading&&heading&&typeof heading.focus==='function')heading.focus({preventScroll:true});s.restoreAction=null;s.focusHeading=false;
}
function start(station){
 if(!Object.prototype.hasOwnProperty.call(totals,station))return;
 s={view:'task',station,index:0,score:0,checked:false,hint:false,feedback:'',selected:false,lat:0,lon:0,direction:null,entry:null,cell:null};
 s.focusHeading=true;render();
}
function check(){
 if(s.checked)return;
 let good=false,details='';
 if(s.station==='grid'){
  if(!s.selected){s.feedback='<b>Markiere zuerst einen Schnittpunkt.</b> Tippe ins Gradnetz oder verwende die Richtungstasten.';render();return;}
  const t=coordTasks[s.index];good=s.lat===t.lat&&s.lon===t.lon;
  details='Dein Punkt: <b>'+coord(s.lat,s.lon)+'</b>. Gesucht: <b>'+coord(t.lat,t.lon)+'</b>. Breite wird vom Äquator, Länge vom Nullmeridian gemessen.';
 }else if(s.station==='compass'){
  if(s.direction===null){s.feedback='<b>Wähle zuerst eine Himmelsrichtung.</b>';render();return;}
  const t=compassTasks[s.index],ans=(t.target-t.north+8)%8;good=s.direction===ans;
  details='Richtig: <b>'+names[ans]+'</b>. '+esc(t.why);
 }else{
  if(s.entry===null||s.cell===null){s.feedback='<b>Wähle zuerst Registereintrag und Planquadrat.</b>';render();return;}
  const correct=atlasTasks[s.index],e=entries[correct];good=s.entry===correct&&s.cell===e.cell;
  details='Gesucht ist <b>'+esc(e.place)+' ('+esc(e.region)+')</b>, Karte <b>'+esc(e.map)+'</b>, Feld <b>'+esc(e.cell)+'</b>. Überprüfe Namen, Region und Registerverweis.';
 }
 s.checked=true;if(good)s.score++;
 s.feedback='<strong>'+(good?'✓ Richtig – gut angewendet!':'Noch nicht richtig – so findest du die Lösung:')+'</strong><p>'+details+'</p>';
 render();
}
function next(){
 if(!s.checked)return;
 s.index++;s.checked=false;s.hint=false;s.feedback='';s.selected=false;s.lat=0;s.lon=0;s.direction=null;s.entry=null;s.cell=null;
 if(s.index>=totals[s.station]){
  s.view='summary';results[s.station]={score:s.score,total:totals[s.station]};
  try{localStorage.setItem(STORE,JSON.stringify(results))}catch(e){}
 }
 s.restoreAction=null;s.focusHeading=true;render();
}
document.addEventListener('click',function(e){
 const a=e.target.closest('[data-praxis]');
 if(a){
  e.preventDefault();e.stopPropagation();const cmd=a.dataset.praxis;s.restoreAction=cmd;
  if(cmd==='open'||cmd==='home'){s.view='home';s.restoreAction=null;s.focusHeading=true;render();return;}
  if(cmd.startsWith('start:')){start(cmd.slice(6));return;}
  if(s.view!=='task')return;
  if(cmd==='hint'){s.hint=!s.hint;render();return;}
  if(cmd==='check'){check();return;}
  if(cmd==='next'){next();return;}
  if(s.checked)return;
  if(cmd.startsWith('entry:')){s.entry=Number(cmd.slice(6));render();return;}
  if(cmd.startsWith('cell:')){s.cell=cmd.slice(5);render();return;}
  if(cmd.startsWith('answer:')){s.direction=Number(cmd.slice(7));render();return;}
  if(cmd.startsWith('move:')){
   s.selected=true;
   if(cmd==='move:north')s.lat=Math.min(90,s.lat+30);
   if(cmd==='move:south')s.lat=Math.max(-90,s.lat-30);
   if(cmd==='move:east')s.lon=Math.min(180,s.lon+30);
   if(cmd==='move:west')s.lon=Math.max(-180,s.lon-30);
   render();return;
  }
  return;
 }
 const svg=e.target.closest('[data-praxis-map]');
 if(!svg||s.view!=='task'||s.station!=='grid'||s.checked)return;
 const b=svg.getBoundingClientRect(),ratioX=720/b.width,ratioY=430/b.height;
 const x=(e.clientX-b.left)*ratioX,y=(e.clientY-b.top)*ratioY;
 if(x<60||x>660||y<60||y>360)return;
 s.lon=Math.max(-180,Math.min(180,Math.round((x-360)/50)*30));
 s.lat=Math.max(-90,Math.min(90,Math.round((210-y)/50)*30));
 s.selected=true;render();
});
window.PruefungsPraxis=Object.freeze({coord,entries,coordTasks,compassTasks,atlasTasks,start,check});
})();

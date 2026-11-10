/* BioLabor 5 — Skelettrig: eigenständige progressive Erweiterung, ohne externe Bibliotheken. */
(function(){
'use strict';
const MODES={
 walk:{title:'Gehen',symbol:'🚶',speed:.82,desc:'Die vier Beine treten nacheinander auf. Während eine Pfote trägt, wird die nächste nach vorne geschwungen.',dog:'Beim ruhigen Schritt tragen immer mehrere Pfoten das Gewicht. Schulter und Becken bleiben verhältnismäßig ruhig.',cat:'Die Katze setzt die Pfoten vorsichtig auf; ihre weichen Ballen dämpfen die Schritte.',attention:'Beobachte die vier Pfoten: Nicht alle verlassen gleichzeitig den Boden.'},
 trot:{title:'Traben',symbol:'🐾',speed:1.28,desc:'Diagonal gegenüberliegende Beine bewegen sich ungefähr gemeinsam: vorne rechts mit hinten links, dann die andere Diagonale.',dog:'Viele Hunde nutzen den Trab als gleichmäßige, energiesparende Gangart.',cat:'Auch Katzen können traben. Die Wirbelsäule gleicht die Bewegung aus.',attention:'Vergleiche die vordere und die diagonal gegenüberliegende Hinterpfote.'},
 gallop:{title:'Schnell laufen',symbol:'💨',speed:1.55,desc:'Die Beine werden stärker gebeugt und gestreckt. In schnellen Gangarten wechseln Abstützen und kurze Phasen ohne Bodenkontakt.',dog:'Das Rückgrat bewegt sich mit, aber die Hinterbeine liefern einen großen Teil des Vortriebs.',cat:'Die sehr biegsame Lendenwirbelsäule der Katze beugt und streckt sich beim schnellen Laufen besonders deutlich.',attention:'Achte darauf, wie der Rücken abwechselnd kürzer und länger wird.'},
 jump:{title:'Springen',symbol:'🦘',speed:.68,desc:'Vor dem Sprung werden die Hinterbeine gebeugt. Dann strecken sie sich kraftvoll. Beim Landen bremsen besonders die Vorderbeine.',dog:'Hinterbeine und Rücken arbeiten zusammen. Die Landung muss durch die Gelenke abgefedert werden.',cat:'Die Katze kann den Rücken stark beugen und ihre kräftigen Hinterbeine für einen gezielten Sprung einsetzen.',attention:'Beobachte Absprung, Flugphase und Landung – nicht nur die Pfoten.'},
 sneak:{title:'Anschleichen',symbol:'🔎',speed:.42,desc:'Der Rumpf bleibt tief. Die Beine werden kontrolliert gebeugt; die Pfoten setzen möglichst leise und vorsichtig auf.',dog:'Auch Hunde können sich vorsichtig heranbewegen, etwa beim Beobachten oder bei der Suche.',cat:'Katzen nutzen ihre bewegliche Wirbelsäule und die Ballen für eine tiefe, leise Körperhaltung.',attention:'Sieh dir an, wie die Gelenke stärker gebeugt bleiben.'},
 stretch:{title:'Strecken',symbol:'↔',speed:.35,desc:'Der Rücken wird abwechselnd gebeugt und gestreckt; die Stellung von Vorder- und Hintergliedmaßen verändert sich.',dog:'Der Rücken ist beweglich, bleibt aber gegenüber einer Katze meist weniger ausgeprägt durchgebogen.',cat:'Die Katze kann ihre Wirbelsäule stark krümmen und strecken. Dabei arbeiten die Wirbel nicht wie ein einziger starrer Stab.',attention:'Vergleiche die Wirbelsäule mit einer Kette beweglicher Wirbel.'}
};
const BONE_NAMES={
 skull:'Schädel: schützt das Gehirn; Kiefer und Zähne nehmen Nahrung auf.',
 spine:'Wirbelsäule: trägt, bewegt und schützt das Rückenmark. Besonders die Lende arbeitet bei schnellen Bewegungen mit.',
 ribs:'Brustkorb: Rippen, Brustwirbel und Brustbein schützen Herz und Lunge.',
 shoulder:'Schulterblatt: beweglicher Muskelansatz für die Vordergliedmaße.',
 foreleg:'Vorderbein: Oberarm, Unterarm, Handwurzel und Zehen wirken als Hebel. Die Gelenke federn die Landung.',
 pelvis:'Becken: überträgt Kräfte der Hinterbeine auf den Rumpf.',
 hindleg:'Hinterbein: Hüfte, Knie und Sprunggelenk arbeiten beim Abstoßen zusammen.',
 feet:'Pfoten: Ballen federn Schritte ab; Hund und Katze sind Zehengänger.',
 tail:'Schwanzwirbel: der bewegliche Schwanz unterstützt Balance und Körpersprache.'
};
const profiles={
 dog:{head:200, neck:288, shoulder:364, hip:719, top:217, ribs:13, headScale:1, tailLength:132, bounce:6, spineFlex:7},
 cat:{head:202, neck:283, shoulder:361, hip:700, top:223, ribs:13, headScale:.86, tailLength:159, bounce:5, spineFlex:23}
};
const state={species:'dog',section:'skeleton',mode:'walk',speed:1,playing:false,labels:true,silhouette:false,progress:0,frameId:0,lastTs:0,lastPaint:0,root:null,selected:'spine',zoom:false};
const prefersReduced=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const n=(v)=>Number(v).toFixed(1).replace(/\.0$/,'');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const frac=(v)=>v-Math.floor(v);
const ease=(v)=>v*v*(3-2*v);
function id(name){return document.getElementById(name)}
function drawBone(x1,y1,x2,y2,w=12){
 return '<path d="M'+n(x1)+' '+n(y1)+'L'+n(x2)+' '+n(y2)+'" fill="none" stroke="#816c54" stroke-width="'+(w+3)+'" stroke-linecap="round"/>'+
 '<path d="M'+n(x1)+' '+n(y1)+'L'+n(x2)+' '+n(y2)+'" fill="none" stroke="#f2dfb5" stroke-width="'+w+'" stroke-linecap="round"/>'+
 '<path d="M'+n(x1)+' '+n(y1)+'L'+n(x2)+' '+n(y2)+'" fill="none" stroke="#fff8e6" stroke-width="'+n(Math.max(2,w*.21))+'" opacity=".65" stroke-linecap="round"/>';
}
function joint(x,y,r=9){return '<circle cx="'+n(x)+'" cy="'+n(y)+'" r="'+r+'" fill="#dbc191" stroke="#826b4b" stroke-width="2.7"/><circle cx="'+n(x)+'" cy="'+n(y)+'" r="'+n(r*.35)+'" fill="#fff8e5"/>'}
function wrapBone(k,content,opacity=1){const isSel=state.selected===k;return '<g class="rig-bone'+(isSel?' rig-selected':'')+'" tabindex="0" role="button" data-bone="'+k+'" aria-label="'+k+': '+BONE_NAMES[k].replace(/"/g,'')+'" opacity="'+opacity+'">'+content+'</g>'}
function solveIK(a,b,L1,L2,dir){
 const vx=b.x-a.x,vy=b.y-a.y,d=Math.max(1,Math.hypot(vx,vy)),q=clamp(d,Math.abs(L1-L2)+1,L1+L2-2);
 const ux=vx/d,uy=vy/d,along=(L1*L1-L2*L2+q*q)/(2*q),side=Math.sqrt(Math.max(0,L1*L1-along*along));
 return {x:a.x+ux*along+dir*(-uy)*side,y:a.y+uy*along+dir*ux*side};
}
function legPose(kind,far,root,floor,progress,mode,profile){
 const offsets=mode==='walk'?{FL:0,FR:.50,HL:.75,HR:.25}:
 mode==='trot'?{FL:0,FR:.50,HL:.50,HR:0}:
 mode==='gallop'?{FL:.06,FR:0,HL:.49,HR:.56}:
 mode==='sneak'?{FL:0,FR:.25,HL:.62,HR:.87}:
 {FL:0,FR:0,HL:0,HR:0};
 const code=(kind==='front'?'F':'H')+(far?'R':'L');
 let f=frac(progress+(offsets[code]||0)),stride=mode==='sneak'?45:mode==='walk'?69:mode==='trot'?83:mode==='gallop'?111:61;
 let lift=0,shift=0,bodyLift=0;
 if(mode==='jump'){
   const t=frac(progress);
   bodyLift=t<.20?0:t<.48?ease((t-.20)/.28)*106:t<.72?106:t<.95?106*(1-ease((t-.72)/.23)):0;
   lift=bodyLift*.82 + (t>.26&&t<.88?(kind==='hind'?11:22):0);
   shift=kind==='front'?-16:30;
   if(t<.20){lift=0;shift=kind==='hind'?40:10}
 }else if(mode==='stretch'){
   const e=Math.sin(progress*Math.PI*2),p=kind==='front'?1:-1;
   shift=(p*45)+e*16;lift=kind==='front'?5:0;
 }else{
   const stance=mode==='sneak'?.77:mode==='gallop'?.51:.62;
   if(f<stance){shift=-stride/2+stride*(f/stance);lift=0}
   else{const sw=(f-stance)/(1-stance);shift=stride/2-stride*ease(sw);lift=Math.sin(sw*Math.PI)*(mode==='sneak'?26:mode==='walk'?37:mode==='trot'?50:mode==='gallop'?72:35)}
 }
 const toe={x:root.x+shift+(far?13:-8),y:floor-lift};
 const wrist={x:toe.x+21,y:toe.y-33},hock={x:toe.x+35,y:toe.y-67};
 let joint1,part='',k=kind==='front'?'foreleg':'hindleg';
 if(kind==='front'){
   joint1=solveIK(root,wrist,103,109,-1);
   part=drawBone(root.x,root.y,joint1.x,joint1.y,16)+joint(root.x,root.y,10)+
      drawBone(joint1.x,joint1.y,wrist.x,wrist.y,13)+joint(joint1.x,joint1.y,8)+
      drawBone(wrist.x,wrist.y,toe.x,toe.y,10)+joint(wrist.x,wrist.y,6);
 }else{
   joint1=solveIK(root,hock,106,104,1);
   part=drawBone(root.x,root.y,joint1.x,joint1.y,18)+joint(root.x,root.y,11)+
      drawBone(joint1.x,joint1.y,hock.x,hock.y,14)+joint(joint1.x,joint1.y,9)+
      drawBone(hock.x,hock.y,toe.x,toe.y,10)+joint(hock.x,hock.y,7);
 }
 const paw='<path d="M'+n(toe.x)+' '+n(toe.y)+'q-18 5 -30 2m15 0l-5 5" stroke="#af956c" stroke-width="7" stroke-linecap="round" fill="none"/>'+joint(toe.x,toe.y,5);
 return wrapBone(k,part,far?.42:1)+wrapBone('feet',paw,far?.45:1);
}
function spinePoints(species,phase,mode){
 const p=profiles[species],s=Math.sin(phase*2*Math.PI),c=Math.cos(phase*2*Math.PI),flex=(mode==='gallop'?1:mode==='jump'?.75:mode==='stretch'?1.1:.15);
 const bend=s*p.spineFlex*flex;
 const bob=(mode==='jump'?-(phase<.20?0:phase<.48?ease((phase-.20)/.28)*106:phase<.72?106:phase<.95?106*(1-ease((phase-.72)/.23)):0):mode==='sneak'?7:Math.sin(phase*Math.PI*4)*p.bounce);
 const crouch=(mode==='sneak'?32:mode==='jump'&&phase<.20?22:0);
 const shoulderY=p.top+41+bob+crouch,hipY=p.top+43+bob+crouch+bend*.36;
 return {p,bob,crouch,bend,shoulder:{x:p.shoulder,y:shoulderY},hip:{x:p.hip+bend*.18,y:hipY},chestY:p.top+41+bob+crouch,headX:p.head+(mode==='gallop'?Math.sin(phase*2*Math.PI)*7:0),headY:p.top+2+bob+crouch*.52};
}
function poseScene(){
 const phase=frac(state.progress);
 const m=state.mode,p=profiles[state.species],sp=spinePoints(state.species,phase,m),
 shoulder=sp.shoulder,hip=sp.hip;
 const ground=496;
 const vertebraCount=23;let ribs='',spineNodes='';
 const thorX=shoulder.x+12,lumX=hip.x-16,hipDy=hip.y-45,baseBack=shoulder.y-44;
 function back(x){
   const t=clamp((x-thorX)/(lumX-thorX),0,1);
   return baseBack+(hipDy-baseBack)*t+Math.sin(t*Math.PI)*(sp.bend-3);
 }
 for(let i=0;i<vertebraCount;i++){const x=thorX+i*(lumX-thorX)/(vertebraCount-1),y=back(x);
  spineNodes+='<g transform="translate('+n(x)+' '+n(y)+')"><rect x="-8" y="-7" width="16" height="14" rx="4" fill="#efdfbb" stroke="#9d8762" stroke-width="2"/><path d="M0 -7v-10" stroke="#bb9d72" stroke-width="4" stroke-linecap="round"/></g>';
 }
 for(let i=0;i<p.ribs;i++){
   const x=thorX+13+i*14.4,y=back(x),endX=x+8,endY=y+116-Math.sin(i/(p.ribs-1)*Math.PI)*11;
   ribs+='<path d="M'+n(x)+' '+n(y)+' Q'+n(x+35)+' '+n(y+70)+' '+n(endX)+' '+n(endY)+'" stroke="#9e8661" stroke-width="8" fill="none" stroke-linecap="round"/>'+
   '<path d="M'+n(x)+' '+n(y)+' Q'+n(x+35)+' '+n(y+70)+' '+n(endX)+' '+n(endY)+'" stroke="#eedbb1" stroke-width="5.5" fill="none"/>';
 }
 const ca=state.species==='cat';
 let neck='',skull='',pelvis='',tail='';
 const neckStart={x:shoulder.x-3,y:baseBack+4},neckEnd={x:sp.headX+55,y:sp.headY+21};
 neck=drawBone(neckStart.x,neckStart.y,neckEnd.x,neckEnd.y,12);
 for(let i=1;i<7;i++){let t=i/7;neck+=joint(neckStart.x+(neckEnd.x-neckStart.x)*t,neckStart.y+(neckEnd.y-neckStart.y)*t,5)}
 const ox=sp.headX,oy=sp.headY,s=p.headScale;
 skull='<g transform="translate('+n(ox)+' '+n(oy)+') scale('+s+')">'+
  '<path d="M-33 -21Q-9 -49 24 -30Q60 -9 49 27Q23 48 -12 36Q-35 24 -33 -21Z" fill="#f4e3c2" stroke="#8c795a" stroke-width="4"/>'+
  '<path d="M-14 6Q-39 3 -73 21Q-83 30 -69 39Q-29 45 -8 36" fill="#f4e3c2" stroke="#8c795a" stroke-width="3"/>'+
  '<path d="M-70 37Q-37 62 25 38" fill="none" stroke="#dcc296" stroke-width="9" stroke-linecap="round"/>'+
  '<ellipse cx="4" cy="-3" rx="'+(ca?21:16)+'" ry="'+(ca?22:18)+'" fill="#e6f5ef" stroke="#a58e64" stroke-width="4"/>'+
  '<circle cx="2" cy="-3" r="4" fill="#997f55"/>'+
  (ca?'<path d="M-15 -32L-21 -55L-1 -39" fill="#f0d8a5" stroke="#8c795a" stroke-width="3"/>':'<path d="M-19 -22L-35 -50L-12 -35" fill="#e5c992" stroke="#8c795a" stroke-width="3"/>')+'</g>';
 pelvis='<path d="M'+n(hip.x-42)+' '+n(hip.y-62)+' Q'+n(hip.x+18)+' '+n(hip.y-79)+' '+n(hip.x+34)+' '+n(hip.y-7)+' Q'+n(hip.x+4)+' '+n(hip.y+18)+' '+n(hip.x-19)+' '+n(hip.y-4)+'Z" fill="#ead5aa" stroke="#8b7653" stroke-width="4"/>'+joint(hip.x,hip.y,13);
 const tailStart={x:hip.x+18,y:hip.y-53},wave=(Math.sin(phase*Math.PI*4)*12);
 tail='<path d="M'+n(tailStart.x)+' '+n(tailStart.y)+' Q'+n(tailStart.x+55)+' '+n(tailStart.y-62+wave)+' '+n(tailStart.x+p.tailLength*.59)+' '+n(tailStart.y-47+wave)+' Q'+n(tailStart.x+p.tailLength*.98)+' '+n(tailStart.y-22)+' '+n(tailStart.x+p.tailLength)+' '+n(tailStart.y-85+wave*.6)+'" fill="none" stroke="#a5906d" stroke-width="15" stroke-linecap="round"/>'+
 '<path d="M'+n(tailStart.x)+' '+n(tailStart.y)+' Q'+n(tailStart.x+55)+' '+n(tailStart.y-62+wave)+' '+n(tailStart.x+p.tailLength*.59)+' '+n(tailStart.y-47+wave)+' Q'+n(tailStart.x+p.tailLength*.98)+' '+n(tailStart.y-22)+' '+n(tailStart.x+p.tailLength)+' '+n(tailStart.y-85+wave*.6)+'" fill="none" stroke="#eedab0" stroke-width="10" stroke-linecap="round"/>';
 let ghost='';
 if(state.silhouette){
  ghost='<path d="M'+n(ox-70)+' '+n(oy+11)+'Q'+n(ox-66)+' '+n(oy-50)+' '+n(ox+14)+' '+n(oy-65)+' Q'+n(shoulder.x-50)+' '+n(baseBack-81)+' '+n(shoulder.x+60)+' '+n(baseBack-55)+' Q'+n(hip.x-90)+' '+n(hipDy-64)+' '+n(hip.x+41)+' '+n(hipDy-16)+' L'+n(hip.x+54)+' '+n(hip.y+52)+' Q'+n(shoulder.x+185)+' '+n(shoulder.y+138)+' '+n(shoulder.x-5)+' '+n(shoulder.y+95)+' L'+n(ox-90)+' '+n(oy+55)+'Z" fill="'+(ca?'#b2b4c4':'#abbea5')+'" opacity=".23" stroke="#6f9a8d" stroke-width="4"/>';
 }
 const rear=legPose('hind',true,{x:hip.x+9,y:hip.y},ground,phase,m,p)+legPose('front',true,{x:shoulder.x+18,y:shoulder.y+10},ground,phase,m,p);
 const fore=legPose('front',false,shoulder,ground,phase,m,p);
 const hind=legPose('hind',false,hip,ground,phase,m,p);
 const chest='<path d="M'+n(shoulder.x-27)+' '+n(shoulder.y-17)+'Q'+n(shoulder.x-80)+' '+n(shoulder.y+15)+' '+n(shoulder.x-38)+' '+n(shoulder.y+55)+'L'+n(shoulder.x+29)+' '+n(shoulder.y+32)+'Z" fill="#eddab4" stroke="#8b785b" stroke-width="4"/>';
 const sternum='<path d="M'+n(shoulder.x+7)+' '+n(shoulder.y+75)+'Q'+n(shoulder.x+104)+' '+n(shoulder.y+90)+' '+n(shoulder.x+184)+' '+n(shoulder.y+67)+'" stroke="#d5be91" fill="none" stroke-width="9" stroke-linecap="round"/>';
 const spine=wrapBone('spine',drawBone(neckStart.x,neckStart.y,thorX,baseBack,10)+spineNodes)+wrapBone('spine',neck);
 const highlights=state.labels?'<g class="rig-titles"><rect x="46" y="37" width="194" height="34" rx="13" fill="#fff" fill-opacity=".94"/><text x="61" y="59" fill="#30635b" font-size="17" font-weight="800">'+(ca?'KATZE':'HUND')+' · '+MODES[m].title+'</text>'+
 '<text x="'+n(ox-69)+'" y="'+n(oy-64)+'" class="rig-tiny">Schädel</text><path d="M'+n(ox-47)+' '+n(oy-56)+'l20 13" class="rig-pointer"/>'+
 '<text x="'+n(shoulder.x+75)+'" y="'+n(baseBack-58)+'" class="rig-tiny">Wirbelsäule</text><path d="M'+n(shoulder.x+87)+' '+n(baseBack-48)+'l0 27" class="rig-pointer"/>'+
 '<text x="'+n(shoulder.x+95)+'" y="'+n(shoulder.y+145)+'" class="rig-tiny">Rippen</text><path d="M'+n(shoulder.x+106)+' '+n(shoulder.y+131)+'l-3 -24" class="rig-pointer"/>'+
 '<text x="'+n(hip.x-33)+'" y="'+n(hip.y-110)+'" class="rig-tiny">Becken</text><path d="M'+n(hip.x)+' '+n(hip.y-98)+'l0 36" class="rig-pointer"/>'+
 '<text x="50" y="528" font-size="14" fill="#55756c">Pfeile / Zahlen sind vereinfachte Lernhilfen · Modell, kein Röntgenbild</text></g>':'';
 const shadows='<ellipse cx="'+n(shoulder.x-2)+'" cy="'+(ground+10)+'" rx="115" ry="8" fill="#2f6c60" opacity=".09"/>'+
 '<ellipse cx="'+n(hip.x+8)+'" cy="'+(ground+10)+'" rx="106" ry="8" fill="#2f6c60" opacity=".08"/>';
 return '<rect width="1000" height="560" rx="16" fill="url(#rig-scene-bg)"/>'+
 '<path d="M40 500H962" stroke="#b0cec0" stroke-width="3" stroke-dasharray="10 8"/>'+shadows+
 ghost+rear+
 wrapBone('ribs',ribs+sternum)+
 wrapBone('shoulder',chest)+
 spine+
 wrapBone('pelvis',pelvis)+
 wrapBone('tail',tail)+
 wrapBone('skull',skull)+fore+hind+highlights;
}
function explainMode(){
 const e=id('rig-explain'),mode=MODES[state.mode],n=state.species==='cat'?'Katze':'Hund';
 if(e)e.innerHTML='<strong>🔬 Beobachtung · '+mode.title+'</strong><p>'+mode.desc+'</p><p>'+mode[state.species]+'</p><div class="rig-hint"><b>Forscherauftrag:</b> '+mode.attention+'</div>';
}
function frame(){
 const svg=id('rig-scene');
 if(svg)svg.innerHTML=poseScene();
 const bar=id('rig-timeline'),phase=frac(state.progress);
 if(bar)bar.value=String(Math.round(phase*100));
 const phaseLabel=id('rig-phase');
 if(phaseLabel)phaseLabel.textContent=Math.round(phase*100)+' %';
}
function loop(time){
 state.frameId=0;
 if(!state.playing || !document.getElementById('rig-studio'))return;
 if(state.lastTs)state.progress+=(Math.min(90,time-state.lastTs)/1000)*MODES[state.mode].speed*state.speed;
 state.lastTs=time;
// Auf schwächeren Tablets nicht jeden Bildschirm-Refresh mit 20 kB SVG neu zeichnen.
 if(!state.lastPaint||time-state.lastPaint>=30){frame();state.lastPaint=time}
 state.frameId=requestAnimationFrame(loop);
}
function stop(){if(state.frameId)cancelAnimationFrame(state.frameId);state.frameId=0;state.lastTs=0}
function play(flag){
 state.playing=flag;stop();state.lastPaint=0;
 const b=id('rig-play');if(b){b.textContent=flag?'⏸ Pause':'▶ Abspielen';b.setAttribute('aria-pressed',String(flag))}
 if(flag)state.frameId=requestAnimationFrame(loop);
}
function choose(mode){
 if(!MODES[mode])return;
 state.mode=mode;state.progress=0;
 document.querySelectorAll('[data-rig-mode]').forEach(b=>{
  const active=b.dataset.rigMode===mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));
 });
 explainMode();frame();
}
function attach(){
 const lab=id('rig-studio');if(!lab)return;
 lab.addEventListener('click',e=>{
 const target=e.target.closest('button');if(!target)return;
 if(target.dataset.rigMode){choose(target.dataset.rigMode);if(!state.playing)play(true);return}
 if(target.id==='rig-play'){play(!state.playing);return}
 if(target.id==='rig-reset'){state.progress=0;play(false);frame();return}
 if(target.id==='rig-step'){play(false);state.progress=frac(state.progress+.04166);frame();return}
 if(target.id==='rig-labels'){state.labels=!state.labels;target.setAttribute('aria-pressed',String(state.labels));target.textContent=state.labels?'🏷 Beschriftung an':'🏷 Beschriftung aus';frame();return}
 if(target.id==='rig-overlay'){state.silhouette=!state.silhouette;target.setAttribute('aria-pressed',String(state.silhouette));target.textContent=state.silhouette?'👁 Körperumriss an':'👁 Körperumriss aus';frame();return}
 if(target.id==='rig-zoom'){state.zoom=!state.zoom;lab.classList.toggle('rig-zoomed',state.zoom);target.setAttribute('aria-pressed',String(state.zoom));target.textContent=state.zoom?'🔎 Verkleinern':'🔎 Vergrößern';return}
 });
 lab.addEventListener('input',e=>{
 if(e.target.id==='rig-speed'){state.speed=Number(e.target.value);id('rig-speed-val').textContent=state.speed.toLocaleString('de-DE')+'×';}
 if(e.target.id==='rig-timeline'){state.progress=Number(e.target.value)/100;frame();}
 });
 lab.addEventListener('keydown',e=>{
 const g=e.target.closest('[data-bone]');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();g.click();}
 });
}
function mount(args){
 stop();const main=id('content');if(!main)return;
 state.species=args.animal==='cat'?'cat':'dog';state.section=args.section;state.selected=args.bone||'spine';
 
 state.zoom=false;
 if(!['skeleton','motion'].includes(args.section))return;
 const board=main.querySelector('.bone-board');
 if(!board)return;
 const oldZoom=main.querySelector('[data-action="zoom"]');
 if(oldZoom&&args.section==='skeleton')oldZoom.closest('.actionline').style.display='none';
 const legacy= document.createElement('details');legacy.className='rig-reference';
 legacy.innerHTML='<summary>📄 Vereinfachte Übersichtsgrafik anzeigen</summary>';
 const caption=board.nextElementSibling&&board.nextElementSibling.classList.contains('diagram-caption')?board.nextElementSibling:null;
 board.parentNode.insertBefore(legacy,board);legacy.appendChild(board);
 if(caption)legacy.appendChild(caption);
 if(args.section==='motion'){
  const row=main.querySelector('.mood-options');if(row)row.style.display='none';
 }
 const container=document.createElement('section');container.className='rig-studio';container.id='rig-studio';
 container.setAttribute('aria-label','Animiertes Skelett von '+(state.species==='cat'?'Katze':'Hund'));
 container.innerHTML=
 '<div class="rig-head"><div><span class="rig-eyebrow">INTERAKTIVES BEWEGUNGS-LABOR · '+(state.species==='cat'?'KATZE':'HUND')+'</span><h3>🦴 So bewegt sich das Skelett</h3><p>Sieh dir an, wie Knochen und Gelenke beim Laufen, Springen und Anschleichen zusammenspielen.</p></div><span class="rig-chip">6 Bewegungen</span></div>'+
 '<div class="rig-modes" role="group" aria-label="Bewegungsart auswählen">'+
 Object.entries(MODES).map(([k,m])=>'<button type="button" data-rig-mode="'+k+'" aria-pressed="false">'+m.symbol+' '+m.title+'</button>').join('')+'</div>'+
 '<div class="rig-stage" id="rig-stage" aria-live="off"><svg class="rig-svg" viewBox="0 0 1000 560" role="group" aria-label="Bewegliches schematisches Skelett mit anwählbaren Knochen">'+
 '<defs><linearGradient id="rig-scene-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcf8"/><stop offset=".55" stop-color="#edf6ee"/><stop offset="1" stop-color="#e4f1f1"/></linearGradient></defs><g id="rig-scene"></g></svg></div>'+
 '<div class="rig-transport"><button type="button" id="rig-play" class="rig-primary" aria-pressed="false">▶ Abspielen</button>'+
 '<button type="button" id="rig-step" title="Ein Bild weiter">⏭ Einzelschritt</button>'+
 '<button type="button" id="rig-reset" title="Animation zurücksetzen">↻ Neustart</button>'+
 '<label for="rig-speed">Tempo</label><input type="range" id="rig-speed" min=".5" max="2" step=".25" value="'+state.speed+'" aria-label="Geschwindigkeit der Animation"/><output id="rig-speed-val">'+state.speed.toLocaleString('de-DE')+'×</output></div>'+
 '<div class="rig-scrub"><label for="rig-timeline">Bewegungsschritt</label><input type="range" id="rig-timeline" min="0" max="100" value="0" step="1" aria-label="Animation vor und zurück spulen"/><output id="rig-phase">0 %</output></div>'+
 '<div class="rig-visual-options"><button type="button" id="rig-labels" aria-pressed="'+state.labels+'">🏷 Beschriftung '+(state.labels?'an':'aus')+'</button>'+
 '<button type="button" id="rig-overlay" aria-pressed="'+state.silhouette+'">👁 Körperumriss '+(state.silhouette?'an':'aus')+'</button>'+
 '<button type="button" id="rig-zoom" aria-pressed="false">🔎 Vergrößern</button></div>'+
 '<div id="rig-explain" class="rig-explain" aria-live="polite"></div>'+
// Genau den aktuell angewählten Knochen in Sichtweite der Animation erklären.
 '<div class="rig-selected-bone" aria-live="polite"><span class="rig-selected-symbol">🦴</span><div><strong>Ausgewählter Knochenbereich</strong><p>'+BONE_NAMES[state.selected]+'</p></div></div>'+
 '<div class="rig-note">💡 <strong>Beobachtungsmodell:</strong> Die Zeichnung zeigt vereinfachte Bewegungsabläufe, keine millimetergenaue Anatomie oder reale Röntgenanimation. Zum Knochennamen tippe auf das Skelett oder nutze die beschriftete Knochenliste darunter.</div>';
 legacy.parentNode.insertBefore(container,legacy);
 attach();choose(state.mode);
 play(!prefersReduced());
}
window.BioSkeletonLab={mount,stop,MODES,renderFrame:frame,getState:()=>({species:state.species,mode:state.mode,playing:state.playing,speed:state.speed,progress:state.progress})};
if(['skeleton','motion'].includes((decodeURIComponent(location.hash.slice(1)).split('/')[1]||'skeleton'))){
 const p=decodeURIComponent(location.hash.slice(1)).split('/');
 mount({animal:p[0]==='cat'?'cat':'dog',section:p[1]||'skeleton',bone:'spine',gait:'walk'});
}
})();

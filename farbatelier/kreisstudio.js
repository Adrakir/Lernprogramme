'use strict';

function kreisStudio() {
 const board = document.createElement('article');
 board.className = 'surface kreistafel';
 board.innerHTML = '<h2>Farbkreistafel</h2><div class="tools tafel-tabs" role="group" aria-label="Ansicht auswählen"></div><section class="tafel-inhalt"></section>';
 stage.replaceChildren(board);
 const tabs = board.querySelector('.tafel-tabs');
 const body = board.querySelector('.tafel-inhalt');
 const titles = {aufbau:'Kreis aufbauen',paar:'Gegenfarben verbinden',projektion:'Projizieren'};
 const param = new URLSearchParams(location.hash.split('?')[1]).get('ansicht');
 let mode = Object.hasOwn(titles,param) ? param : 'aufbau';
 let layer = 1, start = null, target = null, count = 0;
 let keyField = 0;
 let teacherColor = 2, showNames = false, showLine = false;

 function button(label, action, parent) {
  const b = document.createElement('button');
  b.type = 'button'; b.textContent = label; b.onclick = action; parent.append(b);
  return b;
 }
 function pointOn(i,radius) {
  return point(radius,-90+i*30);
 }
 function ring({layers=3, letters=false, namesVisible=false, chosen=null, end=null, steps=0}={}) {
  const nameLabels = [];
  const fields = names.map((name,i)=>{
   const visible = order(i)<=layers;
   const a=-105+30*i, b=a+30;
   const d='M '+point(153,a)+' A 153 153 0 0 1 '+point(153,b)+' L '+point(85,b)+' A 85 85 0 0 0 '+point(85,a)+' Z';
   const [x,y]=pointOn(i,122).split(' ');
   const label = letters ? String.fromCharCode(65+i) : order(i);
   if(namesVisible && visible){
    const [lx,ly]=pointOn(i,167).split(' ').map(Number);
    const align=lx>191?'start':lx<169?'end':'middle';
    nameLabels.push('<text x="'+lx+'" y="'+ly+'" dy=".35em" text-anchor="'+align+'" class="tafel-name">'+name+'</text>');
   }
   const interaction = letters ? ' role="button" tabindex="'+(i===keyField?'0':'-1')+'" aria-label="Feld '+label+', '+name+'" aria-pressed="'+(i===chosen||i===end)+'"' : '';
   return '<g data-segment="'+i+'"'+interaction+'><path d="'+d+'" fill="'+(visible?hex[i]:'var(--tint)')+'" stroke="var(--card)" stroke-width="2"/>'+
    (visible&&(letters||mode==='aufbau')?'<circle cx="'+x+'" cy="'+y+'" r="10" fill="#fff"/><text x="'+x+'" y="'+y+'" dy=".35em" text-anchor="middle" fill="#202039" font-size="12" font-weight="700">'+label+'</text>':'')+'</g>';
  }).join('');
  const marks = [];
  if(chosen!==null){
   if(end!==null)marks.push('<line x1="'+pointOn(chosen,87).split(' ')[0]+'" y1="'+pointOn(chosen,87).split(' ')[1]+'" x2="'+pointOn(end,87).split(' ')[0]+'" y2="'+pointOn(end,87).split(' ')[1]+'" stroke="currentColor" stroke-width="3" stroke-dasharray="5 3"/>');
   for(const index of new Set([chosen,end].filter(i=>i!==null))){
    const [x,y]=pointOn(index,122).split(' ');
    marks.push('<circle cx="'+x+'" cy="'+y+'" r="15" stroke="#fff" stroke-width="6" fill="none"/><circle cx="'+x+'" cy="'+y+'" r="15" stroke="#202039" stroke-width="2" fill="none"/>');
   }
   for(let j=1;j<=steps;j++){
    const [x,y]=pointOn((chosen+j)%12,97).split(' ');
    marks.push('<circle cx="'+x+'" cy="'+y+'" r="8" fill="#17192a"/><text x="'+x+'" y="'+y+'" dy=".35em" text-anchor="middle" fill="white" font-size="10">'+j+'</text>');
   }
  }
  const desc = mode==='aufbau'?names.filter((_,i)=>order(i)<=layers).join(', '):mode==='paar'?'Zwölf Felder A bis L, ab Gelb im Uhrzeigersinn.':'Zwölf Farbfelder im Kreis'+(end!==null?' mit Gegenlinie.':'.');
  return '<svg viewBox="'+(namesVisible?'-65 -8 490 380':'17 17 326 326')+'" class="tafel-kreis" role="'+(letters?'group':'img')+'" aria-label="'+desc+'">'+fields+'<g pointer-events="none">'+marks.join('')+nameLabels.join('')+'</g></svg>';
 }
 function build(){
  const steps=[
   ['Grundfarben einsetzen','Gelb, Rot und Blau liegen gleich weit auseinander. Aus diesen Farben baust du Ittens Farbkreis auf.'],
   ['Sekundärfarben ergänzen','Zwischen je zwei Grundfarben erscheint ihre Mischfarbe. Suche Orange zwischen Gelb und Rot.'],
   ['Tertiärfarben ergänzen','In die sechs Lücken kommt jeweils die Mischung aus einer Grundfarbe und ihrer benachbarten Sekundärfarbe.']
  ];
  body.innerHTML='<h3>Wie wächst der Farbkreis?</h3><div class="tafel-grid"><div class="tafel-graphic"></div><div><div class="tools tafel-stufen"></div><label><input type="checkbox" class="tafel-build-names"> Farbnamen am Kreis zeigen</label><p class="tafel-status" role="status"></p><ul class="tafel-liste"></ul></div></div>';
  const controls=body.querySelector('.tafel-stufen');
  const display=body.querySelector('.tafel-graphic');
  function paint(){
   display.innerHTML=ring({layers:layer,namesVisible:body.querySelector('.tafel-build-names').checked});
   Array.from(controls.children).forEach((b,i)=>b.setAttribute('aria-pressed',String(layer===i+1)));
   body.querySelector('.tafel-status').textContent=steps[layer-1][1];
   body.querySelector('.tafel-liste').innerHTML=names.map((name,i)=>order(i)===layer?'<li><i style="background:'+hex[i]+'"></i>'+name+'</li>':'').join('');
  }
  body.querySelector('.tafel-build-names').onchange=paint;
  steps.forEach(([label],i)=>button((i+1)+'. '+label,()=>{layer=i+1;paint()},controls));paint();
 }
 function pair(){
  body.innerHTML='<h3>Welche zwei Felder liegen sich gegenüber?</h3><p>Tippe zwei Farben im Kreis an oder wähle sie in den Listen. Mit den Pfeiltasten wechselst du das Feld. Mit Eingabe oder Leertaste wählst du es aus. Prüfe die Verbindung und zähle im Uhrzeigersinn nach.</p><div class="tafel-grid"><div class="tafel-graphic"></div><div><label>Startfarbe<select id="tafelStart"></select></label><label>Vermutete Gegenfarbe<select id="tafelZiel"></select></label><div class="tools tafel-actions"></div><p class="tafel-status" role="status"></p></div></div>';
  const display=body.querySelector('.tafel-graphic');
  const startSelect=body.querySelector('#tafelStart'),endSelect=body.querySelector('#tafelZiel');
  const actions=body.querySelector('.tafel-actions'),status=body.querySelector('.tafel-status');
  const entries=names.map((name,i)=>String.fromCharCode(65+i)+' · '+name);
  for(const select of [startSelect,endSelect])select.innerHTML='<option value="">Bitte wählen</option>'+options(entries,-1);
  const test=button('Verbindung prüfen',()=>{
   status.textContent=target===opposite(start)?'Genau. '+names[target]+' liegt sechs Schritte von '+names[start]+' entfernt.':'Die Verbindung verläuft nicht durch die Mitte. Zähle von '+names[start]+' aus sechs Felder weiter und versuche es erneut.';
  },actions);
  const walk=button('Ein Feld weiterzählen',()=>{
   count++;
   refresh(count+'. Schritt: '+names[(start+count)%12]+'.'+(count===6?' Du hast die gegenüberliegende Seite erreicht.':''));
  },actions);
  button('Neues Paar',()=>{start=null;target=null;count=0;keyField=0;refresh('Wähle eine neue Startfarbe.');startSelect.focus()},actions);
  function refresh(message){
   display.innerHTML=ring({letters:true,chosen:start,end:target,steps:count});
   startSelect.value=start??'';endSelect.value=target??'';
   endSelect.disabled=start===null;test.disabled=target===null;walk.disabled=start===null||count===6;
   status.textContent=message||'';
  }
  function chooseStart(i){start=i;target=null;count=0;refresh(i===null?'':'Start bei '+names[i]+'. Wähle jetzt das gegenüberliegende Feld.')}
  function chooseTarget(i){
   if(i===start){target=null;refresh('Das ist deine Startfarbe. Wähle für die Gegenfarbe ein anderes Feld.');return}
   target=i;refresh(i===null?'':names[start]+' ist mit '+names[target]+' verbunden.')}
  startSelect.onchange=()=>chooseStart(startSelect.value===''?null:+startSelect.value);
  endSelect.onchange=()=>chooseTarget(endSelect.value===''?null:+endSelect.value);
  function pickField(i){
   keyField=i;
   if(start===null)chooseStart(i);else chooseTarget(i);
  }
  display.onclick=e=>{const slot=e.target.closest('[data-segment]');if(slot)pickField(Number(slot.dataset.segment))};
  display.onkeydown=e=>{
   const slot=e.target.closest('[data-segment]');if(!slot)return;
   const i=Number(slot.dataset.segment);
   const moves={ArrowRight:(i+1)%12,ArrowDown:(i+1)%12,ArrowLeft:(i+11)%12,ArrowUp:(i+11)%12,Home:0,End:11};
   if(Object.hasOwn(moves,e.key)){
    e.preventDefault();slot.setAttribute('tabindex','-1');keyField=moves[e.key];
   }else if(e.key==='Enter'||e.key===' '){
    e.preventDefault();pickField(i);
   }else return;
   const active=display.querySelector('[data-segment="'+keyField+'"]');active.setAttribute('tabindex','0');active.focus();
  };
  refresh();
 }
 function project(){
  body.innerHTML='<h3>Projektion für die Klasse</h3><p>Zeige den Kreis und sammle zuerst Vermutungen. Blende die Namen und die Gegenlinie bei Bedarf einzeln ein.</p><button class="tafel-open">Große Projektion öffnen</button>';
  const trigger=body.querySelector('.tafel-open');
  trigger.onclick=()=>{
   const dlg=document.createElement('dialog');dlg.className='tafel-projection';dlg.setAttribute('aria-label','Farbkreis für die Klasse');
   dlg.innerHTML='<div class="tools tafel-toolbar"><label>Ausgangsfarbe<select>'+options(names,teacherColor)+'</select></label><label><input type="checkbox" data-names> Farbnamen</label><label><input type="checkbox" data-line> Gegenlinie</label><button autofocus>Schließen</button></div><div class="tafel-display"></div>';
   const [list,labels,line,close]=dlg.querySelectorAll('select,input,button');
   labels.checked=showNames;line.checked=showLine;
   function paint(){dlg.querySelector('.tafel-display').innerHTML=ring({chosen:teacherColor,end:showLine?opposite(teacherColor):null,namesVisible:showNames})}
   list.onchange=()=>{teacherColor=+list.value;paint()};labels.onchange=()=>{showNames=labels.checked;paint()};line.onchange=()=>{showLine=line.checked;paint()};
   const leaveProjection=()=>dlg.close();
   window.addEventListener('hashchange',leaveProjection,{once:true});
   close.onclick=leaveProjection;
   dlg.onclose=()=>{window.removeEventListener('hashchange',leaveProjection);dlg.remove();if(trigger.isConnected)trigger.focus()};
   document.body.append(dlg);paint();dlg.showModal();
  };
 }
 function draw(){
  Array.from(tabs.children).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===mode)));
  if(mode==='aufbau')build();
  if(mode==='paar')pair();
  if(mode==='projektion')project();
 }
 Object.entries(titles).forEach(([view,title])=>{const tab=button(title,()=>{
  mode=view;
  const url=new URL(location.href);
  const query=new URLSearchParams(url.hash.split('?')[1]);query.set('ansicht',view);
  url.hash='kreisstudio?'+query.toString();history.replaceState(history.state,'',url);
  draw();
 },tabs);tab.dataset.view=view});draw();
}

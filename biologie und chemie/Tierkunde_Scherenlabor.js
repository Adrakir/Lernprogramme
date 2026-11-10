/* BioLabor 5 – interaktives Reißzahnscheren-Labor; alle Illustrationen eigenständig */
(function(){
'use strict';
const state={animal:'dog',value:35,play:false,id:0,last:0,group:'carnassial'};
const groups={incisor:{name:'Schneidezähne',hint:'Kleine Vorderzähne zum Abknabbern und Aufnehmen kleiner Stücke.'},canine:{name:'Fangzähne',hint:'Lange, spitze Zähne zum Ergreifen und Festhalten.'},premolar:{name:'Vordere Backenzähne',hint:'Spitze und scharfkantige Zahnhöcker zum Zerteilen von Nahrung.'},carnassial:{name:'Reißzahnpaar',hint:'Oben der vierte Prämolar (P4), unten der erste Molar (M1): Ihre Kanten schneiden beim Zubeißen wie eine Schere.'},molar:{name:'Hintere Backenzähne',hint:'Hintere Backenzähne. Hunde besitzen mehr hintere Mahl- und Quetschflächen als Katzen.'}};
const d=document;
const id=s=>d.getElementById(s);
const bg='<defs><linearGradient id="jaw-bone" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#f9ead1"/><stop offset="1" stop-color="#d9bb8c"/></linearGradient><linearGradient id="jaw-enamel" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#fffdf1"/><stop offset="1" stop-color="#e7d8b3"/></linearGradient><pattern id="jaw-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill="#d5e2db"/></pattern></defs>';
function tooth(x,y,w,h,kind,upper,emphasis){
 const sign=upper?1:-1,points='M'+x+' '+y+'l'+(w*.21)+' '+(sign*h*.41)+'l'+(w*.14)+' '+(sign*h*.21)+'l'+(w*.24)+' '+(sign*h*.38)+'l'+(w*.23)+' '+(-sign*h*.32)+'l'+(w*.18)+' '+(-sign*h*.34)+'Z';
 const selected=state.group===kind||state.group==='carnassial'&&emphasis;
 const fill=emphasis?'#f2b070':kind==='canine'?'#f0d9b2':'url(#jaw-enamel)';
 const border=selected?'#d46a32':'#927a58';
 return '<path data-dental="'+kind+'" d="'+points+'" fill="'+fill+'" stroke="'+border+'" stroke-width="'+(selected?4:2.1)+'" stroke-linejoin="round"/>';
}
function teeth(upper){
 let t='';const y=upper?165:278;
 for(let i=0;i<4;i++)t+=tooth(179+i*17,y,15,18,'incisor',upper,false);
 t+=tooth(252,y,29,48,'canine',upper,false);
 for(let i=0;i<3;i++)t+=tooth(318+i*41,y,33,31,'premolar',upper,false);
 t+=tooth(441,y,47,upper?52:47,'carnassial',upper,true);
 if(state.animal==='dog'){
  for(let i=0;i<(upper?2:3);i++)t+=tooth(504+i*34,y,32,28,'molar',upper,false);
 }else t+=tooth(504,y,31,18,'molar',upper,false);
 return t;
}
function picture(){
 const rad=-(1-state.value/100)*16;
 return bg+'<rect x="0" y="0" width="790" height="370" rx="16" fill="#f6faf7"/><rect width="790" height="370" rx="16" fill="url(#jaw-grid)"/>'+
 '<g><path d="M148 114Q150 100 201 100L572 106Q620 110 655 162L655 206Q628 221 583 198L164 189Q141 185 148 114Z" fill="url(#jaw-bone)" stroke="#9c805b" stroke-width="5"/>'+
 '<path d="M171 116Q352 103 556 116" stroke="#fff5e1" stroke-width="9" stroke-linecap="round" fill="none"/>'+
 teeth(true)+'</g>'+
 '<g id="jaw-movable" transform="rotate('+rad+' 635 234)">'+
 '<path d="M147 260Q157 246 192 248L574 248Q604 249 635 234L642 264Q622 301 571 317L204 321Q152 316 147 260Z" fill="url(#jaw-bone)" stroke="#9c805b" stroke-width="5"/>'+
 '<path d="M184 305Q375 312 558 300" stroke="#f5e1bd" stroke-width="11" fill="none" stroke-linecap="round"/>'+teeth(false)+'</g>'+
 '<circle cx="635" cy="234" r="11" fill="#e1c292" stroke="#94774c" stroke-width="4"/>'+
 '<path d="M652 231Q676 187 666 150" fill="none" stroke="#517d71" stroke-width="3" stroke-dasharray="6 6"/>'+
 '<rect x="26" y="26" width="254" height="40" rx="11" fill="#fff" fill-opacity=".95"/>'+
 '<text x="44" y="52" fill="#245a4d" font-weight="850" font-size="20">'+(state.animal==='cat'?'KATZE · 30 ZÄHNE':'HUND · 42 ZÄHNE')+'</text>'+
 '<rect x="454" y="31" width="308" height="52" rx="11" fill="#fff" fill-opacity=".96"/>'+
 '<text x="471" y="51" font-size="15" fill="#215d50" font-weight="850">REISSZAHNSCHERE</text>'+
 '<text x="471" y="70" font-size="15" fill="#55756d">oben P4 + unten M1</text>'+
 '<path d="M505 97L463 159" fill="none" stroke="#d97b36" stroke-width="3" stroke-linecap="round"/>'+
 '<circle cx="462" cy="163" r="6" fill="#d97b36"/>'+
 '<text x="35" y="344" font-size="14" fill="#5e776f">Eigenständige Funktionsskizze · keine maßstabsgetreue Kieferanatomie</text>';
}
function explanation(){
 const e=id('jaw-explain');
 if(e)e.innerHTML='<strong>'+groups[state.group].name+'</strong><p>'+groups[state.group].hint+'</p>'+
 (state.group==='carnassial'?'<p>🦴 Das obere Reißzahnblatt ist ein vorderer Backenzahn. Das untere ist ein hinterer Backenzahn. Sie gleiten gegeneinander – sie mahlen nicht flächig wie die Backenzähne eines Pflanzenfressers.</p>':'');
}
function redraw(){const svg=id('jaw-drawing');if(svg)svg.innerHTML=picture();const meter=id('jaw-percent');if(meter)meter.textContent=state.value<20?'Maul weit geöffnet':state.value<80?'Kiefer schließt':'Maul geschlossen';const range=id('jaw-range');if(range)range.value=state.value}
function tick(ts){
 state.id=0;if(!state.play||!id('jaw-labor'))return;
 if(state.last){state.value=50+45*Math.sin(ts/1000*1.7);redraw()}
 state.last=ts;state.id=requestAnimationFrame(tick);
}
function stop(){if(state.id)cancelAnimationFrame(state.id);state.id=0;state.last=0;state.play=false}
function play(yes){stop();state.play=yes;const btn=id('jaw-play');if(btn){btn.textContent=yes?'⏸ Pausieren':'▶ Kiefer bewegen';btn.setAttribute('aria-pressed',String(yes))}if(yes)state.id=requestAnimationFrame(tick)}
function mount(args){
 stop();if(args.section!=='teeth')return;
 state.animal=args.animal==='cat'?'cat':'dog';
 const parent=id('content'),ref=parent&&parent.querySelector('.ls-reference');if(!parent)return;
 const box=d.createElement('section');box.id='jaw-labor';box.className='jaw-labor';
 box.innerHTML='<div class="jaw-head"><div><small>🦷 ZAHNFORSCHER-LABOR</small><h3>Wie schneiden Reißzähne?</h3><p>Öffne und schließe den Unterkiefer. Beobachte die beiden orangefarbenen, scharfkantigen Backenzähne.</p></div><div class="jaw-formula">'+(state.animal==='cat'?'30':'42')+'<small>bleibende Zähne</small></div></div>'+
 '<svg id="jaw-drawing" viewBox="0 0 790 370" role="img" aria-label="Animierte, schematische Kiefer von '+(state.animal==='cat'?'Katze':'Hund')+' mit hervorgehobenen Reißzähnen"></svg>'+
 '<div class="jaw-toolbar"><button id="jaw-play" type="button" aria-pressed="false">▶ Kiefer bewegen</button><button id="jaw-reset" type="button">↻ Neu starten</button><label for="jaw-range">Maul öffnen/schließen</label><input id="jaw-range" type="range" min="0" max="100" value="35" aria-label="Kieferwinkel steuern"/><output id="jaw-percent">Kiefer schließt</output></div>'+
 '<div class="jaw-select" role="group" aria-label="Zahnart untersuchen">'+Object.entries(groups).map(([k,v])=>'<button type="button" data-jaw="'+k+'" aria-pressed="'+(k===state.group)+'">'+v.name+'</button>').join('')+'</div>'+
 '<div class="jaw-explain" id="jaw-explain"></div>'+
 '<p class="jaw-safety">Modellhinweis: Die Zahnformen und Kieferbewegung sind stark vereinfacht. Wissenschaftliche anatomische Abbildungen: <a href="https://www.merckvetmanual.com/digestive-system/dental-development-and-anatomy/dentition-and-dental-nomenclature-of-animals" target="_blank" rel="noopener noreferrer">Merck Veterinary Manual – Zahnanatomie</a>.</p>';
 parent.insertBefore(box,ref||null);
 box.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.id==='jaw-play')play(!state.play);
 if(b.id==='jaw-reset'){play(false);state.value=35;redraw()}
 if(b.dataset.jaw){state.group=b.dataset.jaw;box.querySelectorAll('[data-jaw]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.jaw===state.group)));explanation();redraw()}
 });
 box.addEventListener('input',e=>{if(e.target.id==='jaw-range'){play(false);state.value=Number(e.target.value);redraw()}});
 redraw();explanation();
}
window.BioDentalLab={mount,stop,render:picture,getState:()=>({animal:state.animal,value:state.value,group:state.group,play:state.play})};
const init=decodeURIComponent(location.hash.slice(1)).split('/');
if((init[1]||'skeleton')==='teeth')mount({animal:init[0]==='cat'?'cat':'dog',section:'teeth'});
})();

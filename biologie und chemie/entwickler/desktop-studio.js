
/* Chemie-Erlebniswelt – Vorschau, Quiz und inhaltlich passende Lernbilder. */
(() => {
 'use strict';
 const get=id=>document.getElementById(id);
 const go=route=>{if(typeof navigate==='function')navigate(route);else document.querySelector('#nav [data-page="'+route+'"]')?.click()};
 const hero=get('chemHeroImage');
 if(!hero)return;
 hero.innerHTML='<svg viewBox="0 0 520 380" focusable="false" aria-hidden="true"><defs><linearGradient id="chemGlass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".8"/><stop offset=".5" stop-color="#d2faff" stop-opacity=".15"/><stop offset="1" stop-color="#a9e8ef" stop-opacity=".55"/></linearGradient><linearGradient id="chemLiquid" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#68e7c9"/><stop offset="1" stop-color="#078f9c"/></linearGradient><radialGradient id="chemGold"><stop stop-color="#ffecb6"/><stop offset="1" stop-color="#f1a74a"/></radialGradient></defs><ellipse cx="277" cy="332" rx="218" ry="29" fill="#091f29" opacity=".38"/><path d="M32 290H510v17H32z" fill="#315867" stroke="#80b3bb" stroke-width="3"/><path d="M66 307v50m408-50v50" stroke="#779ca8" stroke-width="12"/><path d="M50 153h148v10H50" fill="#52818a"/><path d="M74 163v122m99-122v122" stroke="#80b2bc" stroke-width="7"/><rect x="60" y="192" width="105" height="5" fill="#aad8dc"/><g fill="url(#chemGlass)" stroke="#bcf2f4" stroke-width="4"><path d="M246 40h43v16h-7v70l71 129q10 23-12 23H194q-22 0-11-23l71-129V56h-8z"/><path d="M91 162h57v86q0 15-16 15h-24q-17 0-17-15z"/></g><path d="M201 220q35-19 67-3t67 1l22 39q6 13-10 13H197q-14 0-8-13z" fill="url(#chemLiquid)" opacity=".95"/><path d="M96 215h47v32q0 9-14 9h-21q-12 0-12-9z" fill="#ffc977" opacity=".84"/><path d="M97 215h45" stroke="#f5f4d5" stroke-width="3"/><path d="M247 57h41M213 225q48-16 117 0" fill="none" stroke="#e9ffff" stroke-width="4" opacity=".65"/><circle class="chem-hero-bubble" cx="236" cy="236" r="8" fill="#d8fff1" opacity=".7"/><circle class="chem-hero-bubble b2" cx="295" cy="247" r="6" fill="#d8fff1"/><circle class="chem-hero-bubble b3" cx="269" cy="209" r="11" fill="#f7eab0" opacity=".8"/><circle class="chem-hero-bubble b2" cx="308" cy="189" r="5" fill="#e4fff4"/><path d="M394 106v162" stroke="#95bec6" stroke-width="13"/><path d="M370 101h48M374 264h48" stroke="#b7dbe0" stroke-width="8" stroke-linecap="round"/><rect x="386" y="80" width="19" height="50" rx="9" fill="#bacbd3"/><path d="M397 93v27" stroke="#f1fdff" stroke-width="5" stroke-linecap="round"/><path d="M372 285h91" stroke="#294a5e" stroke-width="13" stroke-linecap="round"/><path d="M405 164h48l15 15-15 16h-48" fill="#b3e4ec" stroke="#e4f9fd" stroke-width="3"/><circle cx="447" cy="179" r="10" fill="url(#chemGold)"/><path d="M405 181h-28" stroke="#b9e4eb" stroke-width="8"/><circle cx="413" cy="53" r="24" fill="#70dab9" opacity=".2"/><circle cx="413" cy="53" r="8" fill="#99e6d9"/><circle cx="448" cy="62" r="5" fill="#ffd98f"/><path d="M193 119h30M177 137h46" stroke="#88c3cc" stroke-width="3"/><text x="229" y="352" fill="#b2d3db" font-family="system-ui,sans-serif" font-size="13" letter-spacing="3">CHEMIE · VIRTUELLES LABOR</text></svg>';
 const modes={solute:{route:'solubility',ask:'Was passiert mit den Teilchen, wenn ein löslicher Stoff ins Wasser gelangt?',answer:'In diesem vereinfachten Modell verteilen sich die gelösten Teilchen im Wasser. Im vollständigen Versuch kannst du die Bedingungen selbst verändern.'},boil:{route:'heating',ask:'Was beobachtest du beim Erhitzen von Wasser?',answer:'Im Modell entstehen beim Sieden im Wasser Dampfblasen. Bei normalem Luftdruck liegt die Siedetemperatur von reinem Wasser ungefähr bei 100 °C.'},flame:{route:'burner',ask:'Wie verändert die Luftzufuhr das Bild der Brennerflamme?',answer:'Das Modell wechselt von einer leuchtenden gelben zu einer rauschenden blauen Flamme. Echte Gasbrenner verwendest du nur unter Aufsicht.'}};
 let mode='solute',running=false;
 const choices=get('chemDemoModes'),stage=get('chemDemoStage'),hint=get('chemDemoHint'),run=get('chemDemoRun');
 const water='<defs><linearGradient id="chemDemoWater" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#8edff3"/><stop offset="1" stop-color="#4bafc8"/></linearGradient></defs><path d="M150 43v133q0 23 26 23h166q26 0 26-23V43" fill="#e9fcff" fill-opacity=".45" stroke="#3c8098" stroke-width="7"/><path d="M160 111q40-8 78 0t79 0q24-6 43 0v69q0 12-20 12H177q-17 0-17-12Z" fill="url(#chemDemoWater)"/><path d="M153 45h211" stroke="#96c8d5" stroke-width="5"/>';
 function stageSvg(type) {
  if(type==='solute'){
   let dots='';
   for(let i=0;i<26;i++){
    const x=190+(i%6)*10,y=175+Math.floor(i/6)*3,dx=(i*47%140)-65,dy=-(i*29%82)-5;
    dots+='<circle class="chem-crystal" cx="'+x+'" cy="'+y+'" r="4" fill="#f3f2ee" stroke="#b8a48b" stroke-width=".9"/>';
    dots+='<circle class="chem-swirl" cx="'+x+'" cy="'+y+'" r="3" fill="'+(i%2?'#fdf8db':'#e1b076')+'" style="opacity:0;--dx:'+dx+'px;--dy:'+dy+'px"/>';
   }
   return '<svg viewBox="0 0 520 230" aria-hidden="true"><path d="M90 206H435" stroke="#95adb0" stroke-width="8" stroke-linecap="round"/>'+water+dots+'<path d="M160 110q54-8 97 0t104 0" fill="none" stroke="#dfffff" stroke-width="3"/><text x="24" y="51" font-size="15" font-weight="750" fill="#23546b">Salz</text><path d="m86 54 60 45" stroke="#5b96a4" stroke-width="2"/><text x="399" y="130" font-size="13" fill="#23546b">Wasser</text></svg>';
  }
  if(type==='boil'){
   let bubbles='';
   for(let i=0;i<12;i++){const x=186+(i*41%145),y=169+(i%3)*11;bubbles+='<circle class="chem-bubble" cx="'+x+'" cy="'+y+'" r="'+(3+i%4)+'" fill="#d8faff" stroke="#ffffff" stroke-width="1.6"/>'}
   return '<svg viewBox="0 0 520 230" aria-hidden="true"><path d="M75 204H435" stroke="#95adb0" stroke-width="8" stroke-linecap="round"/>'+water+bubbles+'<path class="chem-heated" d="M210 30q-15-19 0-30m38 30q-15-19 0-30m38 30q-15-19 0-30" stroke="#77b2c6" stroke-width="4" fill="none" style="opacity:0"/><rect x="157" y="201" width="218" height="17" rx="5" fill="#527485"/><path d="M175 218h185" stroke="#263e4c" stroke-width="6"/><rect x="410" y="45" width="19" height="151" rx="9" fill="#d5f0f1" stroke="#5e919f" stroke-width="3"/><rect class="chem-heated" x="415" y="86" width="9" height="104" rx="4" fill="#dd6649" style="opacity:.28"/><circle cx="419" cy="190" r="14" fill="#dd6649"/><text x="391" y="27" font-size="13" fill="#27586d">°C</text></svg>';
  }
  return '<svg viewBox="0 0 520 230" aria-hidden="true"><defs><linearGradient id="chemBlueFlame" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#2771cb"/><stop offset=".65" stop-color="#71dbfc"/><stop offset="1" stop-color="#d0fcff"/></linearGradient><linearGradient id="chemYellowFlame" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#e97a2b"/><stop offset=".6" stop-color="#ffd25f"/><stop offset="1" stop-color="#fff5c5"/></linearGradient></defs><path d="M95 209H429" stroke="#91acb5" stroke-width="8" stroke-linecap="round"/><path d="M238 191v-65h45v65" fill="#a9b8bf" stroke="#375c6e" stroke-width="4"/><rect x="222" y="184" width="77" height="12" rx="4" fill="#5c7a8d"/><path d="M244 126h33" stroke="#183f52" stroke-width="5"/><path d="M240 125Q194 78 255 16Q232 79 284 118Q298 150 262 157Q230 156 240 125Z" fill="url(#chemYellowFlame)" class="chem-crystal"/><path d="M235 154Q211 104 260 24Q309 104 285 154Z" fill="url(#chemBlueFlame)" class="chem-heated" style="opacity:0"/><path d="M247 150Q242 120 261 92Q276 124 274 151Z" fill="#d5faff" class="chem-heated" style="opacity:0"/><text x="53" y="74" font-size="15" font-weight="750" fill="#2a5f72">Flammenmodell</text><path d="m177 77 35 32" stroke="#6b98a5" stroke-width="2"/></svg>';
 }
 function renderMode(){
  running=false;stage.classList.remove('is-running');stage.innerHTML=stageSvg(mode);
  stage.setAttribute('aria-label',{solute:'Modell: Salzteilchen im Wasser',boil:'Modell: Wasser beim Erhitzen',flame:'Modell: leuchtende und rauschende Brennerflamme'}[mode]);
  hint.textContent=modes[mode].ask;run.textContent=mode==='flame'?'Flamme wechseln':'Animation starten';
  for(const b of choices.querySelectorAll('[data-mode]'))b.setAttribute('aria-pressed',String(b.dataset.mode===mode));
 }
 choices.addEventListener('click',event=>{const b=event.target.closest('[data-mode]');if(!b)return;mode=b.dataset.mode;renderMode()});
 run.addEventListener('click',()=>{
  running=!running;stage.classList.toggle('is-running',running);
  hint.textContent=running?modes[mode].answer:modes[mode].ask;
  run.textContent=mode==='flame'?(running?'Gelbe Flamme zeigen':'Blaue Flamme zeigen'):(running?'Modell zurücksetzen':'Animation starten');
 });
 get('chemDemoGo').addEventListener('click',()=>go(modes[mode].route));renderMode();
 const questions=[
  {q:'Eine unbekannte Flüssigkeit wurde im Labor verschüttet. Was machst du?',options:['Selbst aufwischen.','Abstand halten und die Lehrkraft informieren.','An der Flüssigkeit riechen.'],ok:1,why:'Unbekannte Stoffe nicht berühren: Abstand halten und die Lehrkraft informieren.'},
  {q:'Welches Gerät eignet sich besonders zum Abmessen eines Flüssigkeitsvolumens?',options:['Messzylinder','Reagenzglasständer','Tiegelzange'],ok:0,why:'Der Messzylinder hat eine Skala zum Abmessen des Volumens.'},
  {q:'Welche Aussage ist eine Beobachtung und keine Erklärung?',options:['Der Stoff reagiert wegen seiner Zusammensetzung.','Im Gefäß steigen Blasen auf.','Die Temperatur stieg, weil Energie übertragen wurde.'],ok:1,why:'„Blasen steigen auf“ beschreibt etwas unmittelbar Wahrnehmbares – ohne die Ursache zu deuten.'},
  {q:'Was passiert mit den Teilchen eines Stoffes, wenn er sich in Wasser löst?',options:['Alle Teilchen werden zerstört.','Der Stoff verschwindet vollständig.','Seine Teilchen verteilen sich im Wasser.'],ok:2,why:'Gelöste Teilchen sind weiterhin vorhanden und im Wasser verteilt.'}
 ];
 let index=0,score=0,answered=false;
 const pos=get('chemQuickPosition'),points=get('chemQuickScore'),progress=get('chemQuickProgress'),qTitle=get('chemQuickQuestion'),options=get('chemQuickOptions'),feedback=get('chemQuickFeedback'),next=get('chemQuickNext');
 function showQuestion(){
  answered=false;next.disabled=true;feedback.textContent='';
  if(index>=questions.length){
   pos.textContent='Challenge beendet';points.textContent=score+' von '+questions.length+' richtig';progress.style.width='100%';
   qTitle.textContent='Geschafft! '+(score===questions.length?'Alle Antworten stimmen.':'Du kannst die Fragen gleich noch einmal üben.');
   options.replaceChildren();next.textContent='Noch einmal spielen';next.disabled=false;return;
  }
  const q=questions[index];pos.textContent='Frage '+(index+1)+' von '+questions.length;points.textContent=score+' richtig';progress.style.width=(index/questions.length*100)+'%';qTitle.textContent=q.q;next.textContent='Nächste Frage →';
  options.innerHTML=q.options.map((o,i)=>'<button type="button" data-answer="'+i+'">'+o+'</button>').join('');
 }
 options.addEventListener('click',event=>{
  const b=event.target.closest('[data-answer]');if(!b||answered||index>=questions.length)return;
  answered=true;const picked=Number(b.dataset.answer),q=questions[index];
  if(picked===q.ok)score++;
  for(const v of options.querySelectorAll('[data-answer]')){
   const id=Number(v.dataset.answer);v.disabled=true;
   if(id===q.ok)v.classList.add('is-correct');else if(id===picked)v.classList.add('is-wrong');
  }
  feedback.textContent=(picked===q.ok?'Richtig! ':'Noch nicht richtig. ')+q.why;
  points.textContent=score+' richtig';progress.style.width=((index+1)/questions.length*100)+'%';
  next.disabled=false;next.textContent=index===questions.length-1?'Ergebnis ansehen →':'Nächste Frage →';
 });
 next.addEventListener('click',()=>{if(index>=questions.length){index=0;score=0}else if(answered)index++;showQuestion();qTitle.focus({preventScroll:true})});
 get('chemFullQuiz').addEventListener('click',()=>go('quiz'));showQuestion();
 const tileMap={
  matter:'matter',devices:'equipment',safety:'safety',solubility:'solubility',thermal:'thermal',heating:'heating',burner:'burner',method:'notebook',
  missions:'flasks',deep:'particles',v4lab:'equipment',v5academy:'particles',chem6:'flasks',v4study:'notebook',v4play:'detective',
  quiz:'quiz',learningpath:'path',practicehub:'quiz',protocoltrainer:'notebook',probearbeit:'paper',finaltest:'paper',sheet:'notebook'
 };
 function tileSvg(route){
  const variant=tileMap[route]||'flasks',g='g-'+route;
  const parts={
   matter:'<path d="M70 34h46v70q0 20-20 20h-6q-20 0-20-20Z" fill="#e5f8ff" stroke="#5598b0" stroke-width="4"/><path d="M70 81h46v25q0 16-18 16H88q-18 0-18-16Z" fill="#70c9dd"/><path d="M182 95 225 71l43 24v47l-43 24-43-24Z" fill="#edc99c" stroke="#a9824c" stroke-width="4"/><path d="m182 95 43 25 43-25m-43 25v46" fill="none" stroke="#a9824c" stroke-width="3"/><text x="71" y="154" font-size="14" fill="#35657b">Glas</text><text x="195" y="184" font-size="14" fill="#75532a">Holz</text>',
   equipment:'<path d="M50 50h70v88q0 12-13 12H64q-14 0-14-12Z" fill="#d9faff" stroke="#5c9ca8" stroke-width="5"/><path d="M53 99h64v35q0 13-13 13H66q-13 0-13-13Z" fill="#6ec3dc"/><path d="M179 39h51m-40 0v40l-35 61q-7 14 8 14h84q13 0 6-14l-34-61V39" fill="#e9faff" stroke="#5c9ca8" stroke-width="5"/><path d="M173 126h62l15 25h-92Z" fill="#75d3bc"/><path d="M280 55h28v90q0 16-14 16t-14-16Z" fill="#ffefdc" stroke="#92aebb" stroke-width="4"/>',
   safety:'<path d="M54 60q12-11 38-11t38 11v43q-5 18-38 18t-38-18Z" fill="#ecffff" stroke="#3b8599" stroke-width="6"/><path d="M133 60q12-11 38-11t38 11v43q-5 18-38 18t-38-18Z" fill="#ecffff" stroke="#3b8599" stroke-width="6"/><path d="M129 80h6M43 71h11m155 0h20" stroke="#3b8599" stroke-width="7"/><path d="m272 41 42 76h-84Z" fill="#ffcc6b" stroke="#b37b1e" stroke-width="5"/><text x="265" y="105" font-size="38" fill="#72481d" font-weight="800">!</text>',
   solubility:'<path d="M41 48v95q0 17 18 17h63q18 0 18-17V48M37 48h107" fill="#e9fcff" stroke="#4b98aa" stroke-width="5"/><path d="M47 92h87v53q0 9-14 9H59q-12 0-12-9Z" fill="#6ecce3"/><path d="M199 48v95q0 17 18 17h63q18 0 18-17V48M195 48h107" fill="#e9fcff" stroke="#4b98aa" stroke-width="5"/><path d="M205 92h87v53q0 9-14 9h-62q-11 0-11-9Z" fill="#6ecce3"/><g fill="#fff9df"><circle cx="75" cy="128" r="5"/><circle cx="99" cy="112" r="5"/><circle cx="244" cy="115" r="5"/><circle cx="268" cy="130" r="5"/></g>',
   thermal:'<path d="M40 103h269M72 103V66h198v37" stroke="#8eabb4" stroke-width="5" fill="none"/><path d="M63 67h102v15H63Z" fill="#bd8853"/><path d="M177 67h102v15H177Z" fill="#9cb8c1"/><rect x="137" y="115" width="70" height="48" rx="9" fill="#3c6a7e"/><path d="M171 145q-25-25 0-42 23 25 0 42Z" fill="#ffb65c"/><path d="M177 105v-23" stroke="#fbce7f" stroke-width="4"/>',
   heating:'<path d="M91 52v94q0 17 17 17h105q17 0 17-17V52M85 52h151" fill="#d9f4fb" stroke="#6095a4" stroke-width="5"/><path d="M97 108h127v42q0 8-13 8H109q-12 0-12-8Z" fill="#6bc7e5"/><g fill="#e5ffff"><circle cx="126" cy="133" r="8"/><circle cx="173" cy="126" r="6"/><circle cx="191" cy="143" r="8"/></g><rect x="81" y="171" width="163" height="11" rx="4" fill="#647c87"/><path d="M271 55v114" stroke="#dcebea" stroke-width="16" stroke-linecap="round"/><path d="M271 105v64" stroke="#db6750" stroke-width="7"/><circle cx="271" cy="170" r="13" fill="#db6750"/>',
   burner:'<rect x="151" y="147" width="45" height="41" rx="5" fill="#a7b7c0" stroke="#4b697e" stroke-width="4"/><path d="M159 146V112h29v34" fill="#90a8b8" stroke="#4b697e" stroke-width="4"/><path d="M173 125Q126 82 172 29Q172 71 203 101Q220 133 173 145Z" fill="#ffbd51" stroke="#d17f38" stroke-width="4"/><path d="M168 132q-12-25 6-45 23 32 8 49" fill="#fff3bb"/><rect x="127" y="182" width="92" height="9" rx="4" fill="#526f7e"/>',
   notebook:'<rect x="84" y="30" width="189" height="152" rx="10" fill="#f8f7e9" stroke="#91a4ab" stroke-width="5"/><path d="M114 30v153M131 73h114m-114 23h114m-114 23h89m-89 24h111" stroke="#a6c8d3" stroke-width="4"/><path d="m217 47 11 10 16-20" fill="none" stroke="#3ab39c" stroke-width="7" stroke-linecap="round"/>',
   flasks:'<path d="M103 35h54m-11 0v58l49 73q7 12-7 12H72q-15 0-8-12l49-73V35" fill="#e8fbff" stroke="#74a6b1" stroke-width="5"/><path d="M86 139h81l19 32H68Z" fill="#6ec9af"/><path d="M241 60h37m-27 0v60l23 41q5 9-7 9h-62q-12 0-7-9l25-41V60" fill="#e8fbff" stroke="#74a6b1" stroke-width="5"/><path d="M219 143h49l11 25h-71Z" fill="#8ed7ee"/>',
   particles:'<g fill="#59b8c1" stroke="#377b92" stroke-width="3"><circle cx="95" cy="73" r="24"/><circle cx="144" cy="79" r="22"/><circle cx="99" cy="121" r="22"/><circle cx="147" cy="126" r="23"/></g><g fill="#eeaa60" stroke="#bb8455" stroke-width="3"><circle cx="235" cy="48" r="15"/><circle cx="293" cy="90" r="15"/><circle cx="241" cy="142" r="15"/><circle cx="300" cy="156" r="15"/></g><path d="M188 106h27m-11-11 11 11-11 11" stroke="#628c9a" stroke-width="5" fill="none"/>',
   detective:'<rect x="50" y="58" width="179" height="100" rx="10" fill="#e8f4f0" stroke="#729fa9" stroke-width="5"/><path d="M62 85h150m-135 21h90m-90 22h65" stroke="#b0cbd0" stroke-width="6"/><circle cx="234" cy="95" r="39" fill="#d5eef2" fill-opacity=".8" stroke="#376f84" stroke-width="9"/><path d="m263 123 42 40" stroke="#376f84" stroke-width="15" stroke-linecap="round"/><path d="m224 85 10 10 14-18" stroke="#28a68d" stroke-width="6" fill="none"/>',
   quiz:'<rect x="60" y="43" width="235" height="126" rx="14" fill="#fffefa" stroke="#88a5ae" stroke-width="5"/><path d="M85 75h163m-163 30h163m-163 30h110" stroke="#bed5d7" stroke-width="7"/><circle cx="277" cy="75" r="12" fill="#55bba3"/><circle cx="277" cy="105" r="12" fill="#ffcc6b"/><path d="m269 73 6 6 8-12" stroke="#fff" stroke-width="3" fill="none"/>',
   paper:'<rect x="101" y="28" width="154" height="157" rx="8" fill="#fffdf2" stroke="#849ca5" stroke-width="5"/><path d="M126 61h104m-104 20h104m-104 20h90m-90 20h104m-104 20h70" stroke="#aac6ce" stroke-width="5"/><path d="m210 148 10 10 18-21" stroke="#2bac97" fill="none" stroke-width="6" stroke-linecap="round"/>',
   path:'<path d="M57 146Q144 175 163 99T294 42" fill="none" stroke="#6fabb6" stroke-width="11" stroke-linecap="round" stroke-dasharray="12 16"/><circle cx="57" cy="146" r="21" fill="#f8e4b7" stroke="#bd9861" stroke-width="4"/><circle cx="294" cy="42" r="21" fill="#76d4b6" stroke="#43a087" stroke-width="4"/><path d="m282 43 10 10 15-20" fill="none" stroke="#f1fff8" stroke-width="5"/>'
  };
  return '<svg viewBox="0 0 360 190" role="img" aria-label="Illustration zum Lernbereich" focusable="false"><defs><linearGradient id="'+g+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d4edf0"/><stop offset="1" stop-color="#b9d4dd"/></linearGradient></defs><rect width="360" height="190" fill="url(#'+g+')"/><path d="M0 153h360v37H0Z" fill="#adcdd1"/><path d="M30 153h302" stroke="#729fa8" stroke-width="5" stroke-linecap="round"/>'+parts[variant]+'</svg>';
 }
 function upgradeCards(){
  const grid=get('homeCards');if(!grid)return;
  for(const card of grid.querySelectorAll('.chem-card[data-chem-route]')){
   const art=card.querySelector('.chem-card-art');if(art)art.innerHTML=tileSvg(card.dataset.chemRoute);
  }
 }
 get('chemDirFilters')?.addEventListener('click',upgradeCards);
 document.addEventListener('chemistry:navigate',event=>{if(event.detail?.to==='home')upgradeCards()});
 upgradeCards();
 window.ChemistryStudio={previewMode:()=>mode,previewRunning:()=>running,quiz:()=>({index,score,answered}),refreshCards:upgradeCards};
})();

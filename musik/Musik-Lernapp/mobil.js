'use strict';
// Mobile input uses native scrolling; only the dedicated rhythm pads capture instant taps.
function mobileSmall(){return !!window.matchMedia?.('(max-width: 1024px)').matches;}
function mobileStyle(name,value){if(document.body.style.setProperty)document.body.style.setProperty(name,value);else document.body.style[name]=value;}
function syncMobileDock(){const dock=$('.audioDock'),nav=$('nav.mainNav'),height=dock?.getBoundingClientRect?.().height,navHeight=nav?.getBoundingClientRect?.().height;if(Number.isFinite(height)&&height>0)mobileStyle('--dock-height',Math.ceil(height)+'px');if(Number.isFinite(navHeight)&&navHeight>0)mobileStyle('--mobile-nav-height',Math.ceil(navHeight)+'px');}
function mobileTextField(target){const tag=(target?.tagName||target?.tag||'').toLowerCase(),type=target?.type||target?.getAttribute?.('type')||'text';return !!target&&!target.disabled&&!target.readOnly&&target.getAttribute?.('readonly')===null&&(tag==='textarea'||tag==='input'&&['text','number','search','email','tel','url','password'].includes(type));}
function mobileEditing(target=document.activeElement){const editing=mobileSmall()&&mobileTextField(target);document.body.classList.toggle('mobileEditing',editing);return editing;}
// Run synchronously inside a real click. Delayed focus can lose the gesture needed by mobile keyboards.
function mobileOpenKeyboard(field){
 if(!mobileTextField(field))return;
 field.focus();
 mobileEditing(field);
 try{window.navigator?.virtualKeyboard?.show?.();}catch{} // Native focus remains the fallback.
}
function mobileInputControls(){
 $$('#main input,#main textarea').filter(mobileTextField).forEach(field=>{
  if(field.mobileInputBound)return;
  field.mobileInputBound=true;
  if(!field.getAttribute('inputmode'))field.setAttribute('inputmode',field.getAttribute('type')==='number'?'numeric':'text');
  const controls=document.createElement('div');controls.className='mobileInputControls';
  const open=document.createElement('button');open.setAttribute('type','button');open.className='mobileKeyboardOpen';open.textContent='Tastatur öffnen';
  const label=field.closest('label')?.textContent?.trim()||field.getAttribute('aria-label')||'Eingabefeld';
  open.setAttribute('aria-label','Tastatur öffnen: '+label);if(field.id||field.getAttribute('id'))open.setAttribute('aria-controls',field.id||field.getAttribute('id'));
  open.onclick=()=>mobileOpenKeyboard(field);controls.appendChild(open);
  // Keep the helper outside its label: activating a nested button must not retoggle label focus.
  const anchor=field.closest('.schoolSymbolEquation')||field.closest('label')||field;
  if(typeof anchor.after==='function')anchor.after(controls);else (anchor.parentElement||anchor.parent)?.appendChild(controls);
 });
}
function mobilePyramidChoices(){
 const field=$('#pyramidNumber');if(!field||field.mobileNumberChoices)return;field.mobileNumberChoices=true;
 const choices=document.createElement('div');choices.className='mobileNumberChoices';choices.setAttribute('role','group');choices.setAttribute('aria-label','Anzahl ohne Tastatur auswählen');
 choices.innerHTML='<p>Oder tippe deine Anzahl an:</p><div class="row">'+[1,2,4,8,16].map(n=>`<button type="button" data-mobile-number="${n}">${n}</button>`).join('')+'</div>';
 const update=()=>choices.querySelectorAll('[data-mobile-number]').forEach(b=>b.setAttribute('aria-pressed',String(b.getAttribute('data-mobile-number')===field.value)));
 const original=field.oninput;field.oninput=function(e){original?.call(this,e);update();};
 choices.querySelectorAll('[data-mobile-number]').forEach(button=>button.onclick=()=>{field.value=button.getAttribute('data-mobile-number');field.oninput();});update();
 const anchor=$('.schoolSymbolEquation');if(typeof anchor?.after==='function')anchor.after(choices);else (anchor?.parentElement||anchor?.parent)?.appendChild(choices);
}
function mobileLayoutChanged(){syncMobileDock();mobileEditing();refreshMobileScores();}
function mobileBindPad(id){const pad=$('#'+id);if(!pad||pad.mobilePadBound||!window.PointerEvent)return;const original=pad.onclick;if(!original)return;pad.mobilePadBound=true;let pointerClick=false;pad.onpointerdown=e=>{if(e.isPrimary===false||e.button>0)return;pointerClick=true;if(e.cancelable)e.preventDefault();original(e);};pad.onpointerup=()=>setTimeout(()=>{pointerClick=false;},0);pad.onpointercancel=()=>{pointerClick=false;};pad.onclick=e=>{if(e&&e.detail!==0&&pointerClick){pointerClick=false;return;}original(e);};}
let mobileScoreObserver=null;
function mobileScrollControls(scroller){if(scroller.mobileControls)return scroller.mobileControls;const controls=document.createElement('div');controls.className='mobileScrollControls';controls.setAttribute('role','group');controls.setAttribute('aria-label','Notenzeile seitlich verschieben');controls.innerHTML='<button type="button" data-mobile-scroll="left" aria-label="Notenzeile nach links verschieben">← Links</button><span>Notenzeile</span><button type="button" data-mobile-scroll="right" aria-label="Notenzeile nach rechts verschieben">Rechts →</button>';const move=direction=>{const distance=Math.max(160,(scroller.clientWidth||240)*.75),position=Math.max(0,Math.min((scroller.scrollWidth||0)-(scroller.clientWidth||0),(scroller.scrollLeft||0)+direction*distance));if(typeof scroller.scrollTo==='function')scroller.scrollTo({left:position,behavior:'auto'});else scroller.scrollLeft=position;};controls.querySelector('[data-mobile-scroll="left"]').onclick=()=>move(-1);controls.querySelector('[data-mobile-scroll="right"]').onclick=()=>move(1);if(typeof scroller.after==='function')scroller.after(controls);else (scroller.parentElement||scroller.parent)?.appendChild(controls);scroller.mobileControls=controls;return controls;}
function refreshMobileScores(){if(mobileScoreObserver)mobileScoreObserver.disconnect();$$('#main .scoreScroll,#main .pathScore,#main .pyramidScroll,#main .discoverFamilyBoard,#main .valueDiagram').forEach(scroller=>{const controls=mobileScrollControls(scroller),update=()=>{controls.hidden=!(Number.isFinite(scroller.clientWidth)&&scroller.scrollWidth>scroller.clientWidth+2);};update();if(mobileScoreObserver)mobileScoreObserver.observe(scroller);scroller.mobileUpdate=update;});}
function mobileRevealFeedback(){if(!mobileSmall())return;const target=$('#miniNext')||$('#pathFeedback')||$('#smartFeedback')||$('#result')||$('#dotResult')||$('#labResult')||$('#gameQuizNext')||$('#discoverBuildFeedback')||$('#composeFeedback')||$('#pyramidFeedback')||$('#hearingFeedback');if(!target)return;target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.scrollIntoView?.({block:'nearest',behavior:'auto'});}
function enhanceMobile(){syncMobileDock();mobileEditing();mobileInputControls();mobilePyramidChoices();mobileBindPad('tapPad');mobileBindPad('echoPad');refreshMobileScores();for(const selector of ['[data-path-answer]','[data-smart-answer]','[data-answer]','[data-dotanswer]','[data-game-answer]','[data-mini-answer]','[data-card-answer]','#labCheck','#checkBuild','#discoverBuildCheck','#composeCheck','#pyramidCheck'])$$(selector).forEach(button=>{if(button.mobileFeedbackBound||!button.onclick)return;button.mobileFeedbackBound=true;const old=button.onclick;button.onclick=e=>{old(e);mobileRevealFeedback();syncMobileDock();};});}
function mobileWrap(fn){return function(...args){const result=fn.apply(this,args);enhanceMobile();return result;};}
renderDeviceCheck=mobileWrap(renderDeviceCheck);renderHome=mobileWrap(renderHome);renderPath=mobileWrap(renderPath);renderLearn=renderPath;renderSmart=mobileWrap(renderSmart);renderPractice=mobileWrap(renderPractice);renderDotted=mobileWrap(renderDotted);renderLab=mobileWrap(renderLab);renderDiscover=mobileWrap(renderDiscover);renderSchool=mobileWrap(renderSchool);renderVisual=mobileWrap(renderVisual);renderMini=mobileWrap(renderMini);renderCards=mobileWrap(renderCards);renderPersonal=mobileWrap(renderPersonal);renderGames=mobileWrap(renderGames);renderBuilder=mobileWrap(renderBuilder);renderDetective=mobileWrap(renderDetective);renderTap=mobileWrap(renderTap);renderTests=mobileWrap(renderTests);renderExerciseHub=mobileWrap(renderExerciseHub);renderDocuments=mobileWrap(renderDocuments);renderContents=mobileWrap(renderContents);renderBackup=mobileWrap(renderBackup);render=mobileWrap(render);
if(window.ResizeObserver){const dockObserver=new window.ResizeObserver(syncMobileDock);dockObserver.observe($('.audioDock'));dockObserver.observe($('nav.mainNav'));mobileScoreObserver=new window.ResizeObserver(entries=>entries.forEach(entry=>entry.target.mobileUpdate?.()));}
if(window.addEventListener){window.addEventListener('resize',mobileLayoutChanged);window.addEventListener('orientationchange',mobileLayoutChanged);window.visualViewport?.addEventListener('resize',syncMobileDock);}
document.addEventListener('focusin',e=>mobileEditing(e.target));document.addEventListener('focusout',()=>setTimeout(()=>mobileEditing(),0));document.addEventListener('pointerdown',e=>{const menu=$('.headerOptions');if(menu?.open&&!e.target.closest?.('.headerOptions'))menu.open=false;});document.addEventListener('keydown',e=>{if(e.key==='Escape'){const menu=$('.headerOptions');if(menu)menu.open=false;}});
// Keep a previously prepared offline app up to date, without clearing any saved learning data.
if(window.navigator?.serviceWorker?.getRegistration)window.navigator.serviceWorker.getRegistration().then(reg=>reg?.update()).catch(()=>{/* Ohne Netz ist keine Aktualisierung möglich – die gespeicherte Version bleibt nutzbar. */});
enhanceMobile();

'use strict';
(() => {
  const {lessons,finalTitle,finalChecks,finalModel}=window.MF_COURSE_DATA;
  const el=id=>document.getElementById(id);
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const STORAGE='minka-fuji-lehrgang-v1';
  const motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
  const stageNames=['Anschauen','Gemeinsam üben','Selbst anwenden','Festhalten'];
  const planLabels={who:'Wer ist dabei?',when:'Wann spielt deine Geschichte?',where:'Wo beginnt sie?',start:'Was tun die Figuren am Anfang?',clue:'Welcher Hinweis macht neugierig?',resolution:'Wie löst du den Hinweis später auf?'};
  const samplePlan={who:'Minka und Fuji',when:'an einem windigen Herbstnachmittag',where:'im Garten beim Schuppen',start:'Minka sucht ihren Ball; Fuji hilft ihr',clue:'ein leises Kratzen hinter der Tür',resolution:'Ein Igel steckt unter einem Topf. Die beiden befreien ihn.'};
  const freshRecord=q=>({selected:null,values:q.type==='gaps'?q.rows.map(()=>null):[],order:[],hints:0,first:null,solved:false,model:false,message:'',attempts:0});
  const freshLesson=l=>({phase:0,frame:0,records:l.tasks.map(freshRecord),draft:'',remember:false,done:false});
  const fresh=()=>({version:1,current:0,started:false,motion:true,lessons:Object.fromEntries(lessons.map(l=>[l.id,freshLesson(l)])),final:{phase:0,plan:Object.fromEntries(Object.keys(planLabels).map(k=>[k,''])),title:'',draft:'',checks:finalChecks.map(()=>false),done:false}});
  let state=fresh(),storageAvailable=true,saveTimer=null,filmTimer=null;
  const validIndex=(n,length)=>Number.isInteger(n)&&n>=0&&n<length;
  const cleanText=(s,max=12000)=>typeof s==='string'?s.slice(0,max):'';
  function restore(){
    try {
      const raw=localStorage.getItem(STORAGE);if(!raw)return;
      const saved=JSON.parse(raw);if(!saved||saved.version!==1)return;
      state.current=validIndex(saved.current,9)?saved.current:0;state.started=saved.started===true;state.motion=saved.motion!==false;
      lessons.forEach(l=>{
        const from=saved.lessons?.[l.id],to=state.lessons[l.id];if(!from||typeof from!=='object')return;
        to.phase=validIndex(from.phase,4)?from.phase:0;to.frame=validIndex(from.frame,l.frames.length)?from.frame:0;
        to.draft=cleanText(from.draft);to.remember=from.remember===true;
        l.tasks.forEach((q,i)=>{
          const r=from.records?.[i],target=to.records[i];if(!r||typeof r!=='object')return;
          target.selected=q.type==='choice'&&validIndex(r.selected,q.options.length)?r.selected:null;
          if(q.type==='gaps')target.values=q.rows.map((row,j)=>validIndex(r.values?.[j],row.options.length)?r.values[j]:null);
          if(q.type==='arrange'&&Array.isArray(r.order))target.order=[...new Set(r.order.filter(n=>validIndex(n,q.items.length)))];
          target.hints=Number.isInteger(r.hints)?Math.max(0,Math.min(q.hints.length,r.hints)):0;
          target.model=r.model===true;target.solved=r.solved===true&&correct(q,target);
          if(r.first&&typeof r.first.correct==='boolean'&&typeof r.first.helped==='boolean')target.first={correct:r.first.correct,helped:r.first.helped};
          target.attempts=Number.isInteger(r.attempts)?Math.max(0,r.attempts):0;
          if(target.solved)target.message=`Richtig. ${q.explain}`;
        });
        to.done=from.done===true&&to.remember&&to.records.every(addressed);
      });
      const f=saved.final;
      if(f&&typeof f==='object'){
        state.final.phase=validIndex(f.phase,4)?f.phase:0;
        Object.keys(planLabels).forEach(k=>state.final.plan[k]=cleanText(f.plan?.[k],600));
        state.final.title=cleanText(f.title,150);state.final.draft=cleanText(f.draft,20000);
        state.final.checks=finalChecks.map((_,i)=>f.checks?.[i]===true);
        state.final.done=f.done===true&&finalReady();
      }
    } catch {storageAvailable=false;}
  }
  function save(immediate=false){
    clearTimeout(saveTimer);
    const write=()=>{try{localStorage.setItem(STORAGE,JSON.stringify(state));storageAvailable=true;}catch{storageAvailable=false;}storageMessage();};
    if(immediate)write();else saveTimer=setTimeout(write,300);
  }
  function storageMessage(){
    el('course-storage').textContent=storageAvailable?'Lehrgang und Entwürfe werden auf diesem Gerät gespeichert. Keine Übertragung und keine automatische Benotung. Auf einem anderen Gerät beginnt ein eigener Lernstand.':'Dein Browser erlaubt hier kein Speichern. Dein Lernstand bleibt in dieser geöffneten Seite. Sichere eigene Texte als TXT, bevor du sie schließt.';
  }
  const addressed=r=>r.solved||r.model;
  const selectedLesson=()=>lessons[state.current];
  const selectedState=()=>state.lessons[selectedLesson().id];
  const planReady=()=>Object.values(state.final.plan).every(s=>s.trim().length>0);
  function finalReady(){return planReady()&&state.final.draft.trim().length>0&&state.final.checks.every(Boolean);}
  function completeCount(){return lessons.filter(l=>state.lessons[l.id].done).length+Number(state.final.done);}
  function renderDashboard(){
    const count=completeCount(),independent=lessons.filter(l=>{const r=state.lessons[l.id].records[1];return r.first?.correct&&!r.first.helped;}).length;
    el('course-overall').textContent=`${count} von 9 Stationen abgeschlossen · Selbstaufgaben im aktuellen Durchgang: ${independent} von 8 beim ersten Versuch ohne Zusatzhilfe richtig.`;
    el('course-progress').value=count;
    el('course-resume').textContent=state.started?`Weiterlernen: ${state.current===8?'deine Geschichte':lessons[state.current].short}`:'Lehrgang beginnen';
    storageMessage();
    el('course-map').innerHTML=[...lessons.map((l,i)=>({title:l.short,done:state.lessons[l.id].done,index:i})),{title:'Deine Geschichte',done:state.final.done,index:8}].map(x=>`<button type="button" data-course-lesson="${x.index}" ${state.current===x.index?'aria-current="step"':''}><span class="course-station-number ${x.done?'complete':''}" aria-hidden="true">${x.done?'✓':String(x.index+1).padStart(2,'0')}</span><span>${escape(x.title)}<small>${x.done?'Abgeschlossen':x.index===8?'Planen · schreiben · überarbeiten':'Beispiel · üben · anwenden'}</small></span></button>`).join('');
    document.querySelectorAll('[data-course-lesson]').forEach(b=>b.addEventListener('click',()=>openLesson(Number(b.dataset.courseLesson))));
  }
  function pauseFilm(){clearInterval(filmTimer);filmTimer=null;const play=el('course-play');if(play){play.textContent='Animation abspielen';play.setAttribute('aria-pressed','false');}}
  function focusWorkspace(){const heading=el('course-heading');heading?.focus({preventScroll:true});heading?.closest('.course-work-card').scrollIntoView({block:'start',behavior:'auto'});}
  function openLesson(index){pauseFilm();state.current=index;state.started=true;save();render();focusWorkspace();}
  function openPhase(index){pauseFilm();if(state.current===8)state.final.phase=index;else selectedState().phase=index;save();render();focusWorkspace();}
  function render(){
    pauseFilm();renderDashboard();
    if(state.current===8){renderFinal();return;}
    const lesson=selectedLesson(),s=selectedState();
    el('course-workspace').innerHTML=`<article class="panel course-work-card"><div class="course-lesson-heading"><p class="eyebrow">Station ${state.current+1} von 9 · ${lesson.minutes}</p><h2 id="course-heading" tabindex="-1">${escape(lesson.title)}</h2><p>${escape(lesson.goal)}</p></div>${phaseNavigation(stageNames,s.phase)}<div id="course-stage"></div><div id="course-step-actions" class="course-step-actions"></div></article>`;
    bindPhases();
    if(s.phase===0)renderFilm();
    else if(s.phase===1||s.phase===2)renderExercise();
    else renderReflection();
    renderStepActions();
  }
  function phaseNavigation(names,current){return `<nav class="course-phases" aria-label="Lernschritte der Station">${names.map((name,i)=>`<button type="button" data-course-phase="${i}" ${current===i?'aria-current="step"':''}><span>${i+1}</span>${escape(name)}</button>`).join('')}</nav>`;}
  function bindPhases(){document.querySelectorAll('[data-course-phase]').forEach(b=>b.addEventListener('click',()=>openPhase(Number(b.dataset.coursePhase))));}
  function renderFilm(){
    const l=selectedLesson();
    el('course-stage').innerHTML=`<p class="course-stage-label">Erst schauen wir gemeinsam hin.</p><p>${escape(l.intro)}</p><div class="course-demo"><div class="course-visual" id="course-visual" data-effect="${l.effect}"><img src="assets/${l.image}" alt="Minka und Fuji in der Geschichte am Schuppen" width="380" height="380"><div class="course-sound" aria-hidden="true">kratz … kratz …</div><div class="course-lens" aria-hidden="true"></div><div class="course-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><div class="course-floating-signs" aria-hidden="true">„ ? “ ,</div><div class="course-track" aria-hidden="true"><span>🐾</span></div></div><div class="course-film-content"><div id="course-film-window" aria-live="polite"></div><div class="course-frame-dots" role="group" aria-label="Schritt des animierten Beispiels">${l.frames.map((f,i)=>`<button type="button" data-course-frame="${i}" aria-label="${escape(f.label)}">${i+1}</button>`).join('')}</div></div></div><div class="course-film-controls"><button type="button" class="secondary" id="course-frame-prev">Zurück</button><button type="button" class="primary" id="course-play" aria-pressed="false">Animation abspielen</button><button type="button" class="secondary" id="course-frame-next">Weiter im Beispiel</button></div><label class="course-motion-setting"><input type="checkbox" id="course-motion" ${!state.motion||motionQuery.matches?'checked':''}> Bewegung reduzieren · alle Beispiele bleiben schrittweise bedienbar</label><p id="course-motion-note" class="muted"></p><div class="course-rule"><strong>Fujis und Minkas Merksatz</strong><p>${escape(l.rule)}</p></div>`;
    document.querySelectorAll('[data-course-frame]').forEach(b=>b.addEventListener('click',()=>{pauseFilm();setFrame(Number(b.dataset.courseFrame));}));
    el('course-frame-prev').onclick=()=>{pauseFilm();setFrame(selectedState().frame-1);};
    el('course-frame-next').onclick=()=>{pauseFilm();setFrame(selectedState().frame+1);};
    el('course-play').onclick=()=>{
      if(filmTimer){pauseFilm();return;}
      if(!state.motion||motionQuery.matches)return;
      if(selectedState().frame===l.frames.length-1)setFrame(0);
      el('course-play').textContent='Animation pausieren';el('course-play').setAttribute('aria-pressed','true');
      filmTimer=setInterval(()=>{if(selectedState().frame>=l.frames.length-1){pauseFilm();return;}setFrame(selectedState().frame+1);if(selectedState().frame===l.frames.length-1)pauseFilm();},6500);
    };
    el('course-motion').onchange=e=>{state.motion=!e.target.checked;pauseFilm();save();updateMotion();};
    setFrame(selectedState().frame);updateMotion();
  }
  function updateMotion(){
    const reduced=!state.motion||motionQuery.matches;
    el('lehrgang').classList.toggle('course-reduced-motion',reduced);
    if(el('course-play'))el('course-play').disabled=reduced;
    if(el('course-motion-note'))el('course-motion-note').textContent=reduced?'Bewegung ist ausgeschaltet. Nutze die nummerierten Schritte oder „Weiter im Beispiel“.':'Du bestimmst das Tempo: automatisch abspielen, pausieren oder jeden Schritt einzeln wählen.';
    if(el('course-motion')){el('course-motion').checked=reduced;el('course-motion').disabled=motionQuery.matches;}
  }
  function setFrame(index){
    const l=selectedLesson(),s=selectedState();if(!validIndex(index,l.frames.length))return;s.frame=index;
    const f=l.frames[index];
    el('course-film-window').innerHTML=`<p class="eyebrow">${escape(f.label)}</p><p class="course-animated-sentence">${f.text.map(([text,kind])=>`<span class="course-word course-${kind}">${escape(text)}</span>`).join('')}</p><div class="course-explain"><strong>${escape(l.coach)} erklärt</strong><p>${escape(f.note)}</p></div>`;
    el('course-visual').dataset.frame=String(index);
    document.querySelectorAll('[data-course-frame]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.courseFrame)===index)));
    el('course-frame-prev').disabled=index===0;el('course-frame-next').disabled=index===l.frames.length-1;save();
  }
  function correct(q,r){
    if(q.type==='choice')return r.selected===q.answer;
    if(q.type==='gaps')return q.rows.every((row,i)=>r.values[i]===row.answer);
    return q.answer.length===r.order.length&&q.answer.every((v,i)=>r.order[i]===v);
  }
  function filled(q,r){return q.type==='choice'?r.selected!==null:q.type==='gaps'?q.rows.every((_,i)=>r.values[i]!==null):r.order.length===q.items.length;}
  function joinPieces(pieces){return pieces.join(' ').replace(/\s+([,.!?;:])/g,'$1').replace(/„\s+/g,'„').replace(/\s+“/g,'“');}
  function modelAnswer(q){
    if(q.type==='choice')return q.options[q.answer];
    if(q.type==='gaps')return q.rows.map(r=>`${r.label} → ${r.options[r.answer]}`).join('\n');
    return joinPieces(q.answer.map(i=>q.items[i]));
  }
  function renderExercise(){
    const l=selectedLesson(),s=selectedState(),i=s.phase-1,q=l.tasks[i],r=s.records[i];
    let interaction='';
    if(q.type==='choice')interaction=`<div class="choices" role="group" aria-label="Antwort wählen">${q.options.map((option,j)=>`<button type="button" class="choice ${r.solved&&j===q.answer?'correct':''}" data-course-choice="${j}" aria-pressed="${r.selected===j}" ${r.solved?'disabled':''}><span class="letter" aria-hidden="true">${'ABC'[j]}</span>${escape(option)}</button>`).join('')}</div>`;
    if(q.type==='gaps')interaction=`<p class="course-context">${escape(q.context)}</p><div class="course-gap-rows">${q.rows.map((row,j)=>`<label class="course-gap-row ${r.message&&!r.solved&&r.values[j]!==row.answer?'needs-review':''}"><span>${escape(row.label)}</span><select data-course-gap="${j}" ${r.solved?'disabled':''}><option value="">Bitte wählen</option>${row.options.map((option,k)=>`<option value="${k}" ${r.values[j]===k?'selected':''}>${escape(option)}</option>`).join('')}</select></label>`).join('')}</div>`;
    if(q.type==='arrange')interaction=`<p class="muted">Tippe Bausteine unten an. Du kannst sie mit „Letzten zurücknehmen“ wieder aus dem Satz lösen. Ziehen ist nicht nötig.</p><div class="course-built" aria-label="Dein zusammengesetzter Satz" aria-live="polite">${r.order.length?escape(joinPieces(r.order.map(j=>q.items[j]))):'<span>Noch kein Baustein gewählt.</span>'}</div><div class="course-blocks" role="group" aria-label="Satzbausteine">${q.items.map((item,j)=>`<button type="button" class="secondary" data-course-piece="${j}" ${r.order.includes(j)||r.solved?'disabled':''}>${escape(item)}</button>`).join('')}</div><div class="quiz-actions"><button type="button" class="secondary" id="course-undo" ${!r.order.length||r.solved?'disabled':''}>Letzten zurücknehmen</button><button type="button" class="secondary" id="course-clear-pieces" ${!r.order.length||r.solved?'disabled':''}>Satz neu bauen</button></div>`;
    el('course-stage').innerHTML=`<p class="course-stage-label">${i===0?'Wir üben gemeinsam.':'Jetzt wendest du es selbst an.'}</p><div class="course-coach"><img src="assets/guides.webp" alt="" width="90" height="90"><p><strong>${i===0?l.coach:(l.coach==='Minka'?'Fuji':'Minka')}:</strong> ${i===0?'„Lies zuerst die Situation. Die Hinweise helfen dir, deine Entscheidung zu begründen.“':'„Übertrage den Gedanken auf diese neue Aufgabe. Hilfe ist da, wenn du sie brauchst.“'}</p></div><h3 id="course-task-heading">${escape(q.prompt)}</h3>${interaction}<div class="quiz-actions"><button type="button" class="primary" id="course-check" ${!filled(q,r)||r.solved?'disabled':''}>Meine Antwort prüfen</button><button type="button" class="secondary" id="course-hint" ${r.hints>=q.hints.length?'disabled':''}>${r.hints>=q.hints.length?'Alle Hinweise geöffnet':`Hinweis ${r.hints+1} von ${q.hints.length}`}</button></div><div id="course-task-feedback" class="feedback ${r.solved?'good':''}" role="status">${escape(r.message)}</div>${r.hints?`<div class="hint-box">${q.hints.slice(0,r.hints).map((hint,j)=>`<p><strong>Hinweis ${j+1}:</strong> ${escape(hint)}</p>`).join('')}</div>`:''}<details id="course-task-model" ${r.model?'open':''}><summary>Die Lösung gemeinsam durchgehen</summary><div class="course-model-answer">${escape(modelAnswer(q))}</div><p>${escape(q.explain)}</p><p>Du kannst danach weiterlernen. Diese Aufgabe zählt dann als mit Lösung bearbeitet.</p></details><p class="muted">${r.solved?(r.first?.correct&&!r.first.helped?'Im ersten Versuch ohne Zusatzhilfe gelöst.':'Nach Übung oder mit Unterstützung gelöst.'):r.model?'Mit der Musterlösung bearbeitet. Versuche, die Begründung in eigenen Worten zu erklären.':'Du darfst verbessern. Eine falsche Antwort hilft dir zu erkennen, worauf du noch achten solltest.'}</p>`;
    const change=()=>{r.message='';save();el('course-task-feedback').textContent='';el('course-check').disabled=!filled(q,r)||r.solved;};
    document.querySelectorAll('[data-course-choice]').forEach(b=>b.onclick=()=>{r.selected=Number(b.dataset.courseChoice);change();document.querySelectorAll('[data-course-choice]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));});
    document.querySelectorAll('[data-course-gap]').forEach(select=>select.onchange=()=>{r.values[Number(select.dataset.courseGap)]=select.value===''?null:Number(select.value);select.closest('label').classList.remove('needs-review');change();});
    const focusPiece=()=>{(document.querySelector('[data-course-piece]:not(:disabled)')||el('course-check')).focus({preventScroll:true});};
    document.querySelectorAll('[data-course-piece]').forEach(b=>b.onclick=()=>{r.order.push(Number(b.dataset.coursePiece));r.message='';save();renderExercise();renderStepActions();focusPiece();});
    if(el('course-undo'))el('course-undo').onclick=()=>{r.order.pop();r.message='';save();renderExercise();renderStepActions();focusPiece();};
    if(el('course-clear-pieces'))el('course-clear-pieces').onclick=()=>{r.order=[];r.message='';save();renderExercise();renderStepActions();focusPiece();};
    el('course-check').onclick=()=>{
      if(!filled(q,r)||r.solved)return;
      const good=correct(q,r);r.attempts++;
      if(!r.first)r.first={correct:good,helped:r.hints>0||r.model};
      r.solved=good;
      const location=q.type==='gaps'?`Prüfe Baustein ${q.rows.map((row,j)=>r.values[j]===row.answer?null:j+1).filter(x=>x!==null).join(' und ')}. `:'';
      r.message=good?`Richtig. ${q.explain}`:`Noch nicht ganz. ${location}${q.hints[0]} Du kannst deine Antwort verbessern.`;
      save();renderExercise();renderStepActions();renderDashboard();
      const feedback=el('course-task-feedback');feedback.tabIndex=-1;feedback.focus({preventScroll:true});
    };
    el('course-hint').onclick=()=>{r.hints++;save();renderExercise();const target=el('course-hint').disabled?el('course-stage').querySelector('.hint-box'):el('course-hint');if(target!==el('course-hint'))target.tabIndex=-1;target.focus({preventScroll:true});};
    el('course-task-model').addEventListener('toggle',event=>{
      if(event.target.open&&event.target.isConnected){r.model=true;save();renderStepActions();renderDashboard();}
    });
  }
  function renderReflection(){
    const l=selectedLesson(),s=selectedState();
    const self=s.records[1];
    const result=self.first?.correct&&!self.first.helped?'Die Selbstaufgabe hast du im ersten Versuch ohne Zusatzhilfe gelöst.':self.solved?'Die Selbstaufgabe hast du nach Übung oder mit Unterstützung gelöst.':self.model?'Die Selbstaufgabe hast du mit der Musterlösung bearbeitet.':'Die Selbstaufgabe ist noch offen. Gehe zu Schritt 3 und probiere sie aus.';
    el('course-stage').innerHTML=`<p class="course-stage-label">Das nimmst du mit.</p><div class="course-rule"><strong>${escape(l.takeaway)}</strong><p>${escape(result)}</p></div><h3>Deine kleine Schreibprobe</h3><p>${escape(l.transfer)}</p><label class="course-field" for="course-mini-draft">Dein Text zu dieser Station · empfohlen, freiwillig</label><textarea id="course-mini-draft" rows="5" maxlength="12000" placeholder="Wende die Idee in eigenen Sätzen an."></textarea><p class="muted">Hier gibt es keine automatische Bewertung. Vergleiche deinen Text mit dem Ziel der Station und erkläre deine Wortwahl.</p><details><summary>Ein Beispiel zum Vergleichen</summary><p class="course-model-answer">${escape(l.model)}</p></details><label class="course-remember"><input type="checkbox" id="course-remember" ${s.remember?'checked':''}><span>Ich habe beide Aufgaben bearbeitet und kann den Merksatz an einem Beispiel erklären.</span></label><p id="course-completion-note" class="muted"></p><button type="button" class="secondary" id="course-repeat">Aufgaben dieser Station noch einmal üben</button>`;
    el('course-mini-draft').value=s.draft;el('course-mini-draft').oninput=e=>{s.draft=e.target.value;save();};
    el('course-remember').onchange=e=>{s.remember=e.target.checked;if(!s.remember)s.done=false;save();renderStepActions();renderDashboard();};
    el('course-repeat').onclick=()=>{s.records=l.tasks.map(freshRecord);s.remember=false;s.done=false;s.phase=1;save();render();focusWorkspace();};
  }
  function renderStepActions(){
    if(state.current===8)return;
    const s=selectedState(),phase=s.phase;
    const canGo=phase===0||phase<3&&addressed(s.records[phase-1])||phase===3&&s.remember&&s.records.every(addressed);
    el('course-step-actions').innerHTML=`<button type="button" class="secondary" id="course-step-back" ${phase===0?'disabled':''}>Vorheriger Lernschritt</button><button type="button" class="primary" id="course-step-next" ${canGo?'':'disabled'}>${phase===3?(state.current===7?'Zur eigenen Geschichte':'Station abschließen & weiter'):`Weiter: ${stageNames[phase+1]}`}</button>`;
    el('course-step-back').onclick=()=>openPhase(phase-1);
    el('course-step-next').onclick=()=>{if(!canGo)return;if(phase===3){s.done=true;save(true);openLesson(state.current+1);}else openPhase(phase+1);};
    if(el('course-completion-note'))el('course-completion-note').textContent=s.records.every(addressed)?'Dein Haken ist eine Selbsteinschätzung. Geöffnete Lösungen bleiben als Unterstützung erkennbar.':'Bearbeite zuerst die beiden Aufgaben in Schritt 2 und 3. Du kannst sie lösen oder die Musterlösung gemeinsam durchgehen.';
  }
  function updateFinalDone(){state.final.done=false;state.final.checks=finalChecks.map(()=>false);document.querySelectorAll('[data-course-final-check]').forEach(c=>c.checked=false);}
  function finalButtons(){
    const f=state.final,phase=f.phase;
    let allowed=phase===0?planReady():phase===1?f.draft.trim().length>0:phase===2?finalReady():false;
    el('course-final-actions').innerHTML=`<button type="button" class="secondary" id="course-final-back" ${phase===0?'disabled':''}>Vorheriger Schreibschritt</button>${phase<3?`<button type="button" class="primary" id="course-final-next" ${allowed?'':'disabled'}>${['Weiter: deinen Text schreiben','Weiter: deinen Text überarbeiten','Weiter: deine Lesefassung'][phase]}</button>`:''}`;
    el('course-final-back').onclick=()=>openPhase(phase-1);
    if(el('course-final-next'))el('course-final-next').onclick=()=>{if(allowed)openPhase(phase+1);};
  }
  function renderFinal(){
    const f=state.final,phase=f.phase;
    el('course-workspace').innerHTML=`<article class="panel course-work-card"><div class="course-lesson-heading"><p class="eyebrow">Station 9 von 9 · etwa 15–25 Minuten</p><h2 id="course-heading" tabindex="-1">${escape(finalTitle)}</h2><p>Verbinde deine neuen Fähigkeiten: Plane, schreibe, überarbeite und sichere deinen Text.</p></div>${phaseNavigation(['Planen','Schreiben','Überarbeiten','Sichern'],phase)}<div id="course-final-stage"></div><div class="course-step-actions" id="course-final-actions"></div></article>`;
    bindPhases();
    if(phase===0){
      el('course-final-stage').innerHTML=`<p class="course-stage-label">Minka hilft dir beim Planen.</p><div class="course-coach"><img src="assets/guides.webp" alt="" width="90" height="90"><p><strong>Minka:</strong> „Wähle ein kleines Abenteuer mit uns beiden. Notiere zuerst den Anfang und den Hinweis. Die spätere Auflösung planst du getrennt – sie gehört noch nicht in die Einleitung.“</p></div><div class="course-plan-grid">${Object.entries(planLabels).map(([key,label])=>`<label>${escape(label)}<textarea data-course-plan="${key}" rows="2" maxlength="600" placeholder="${escape(samplePlan[key])}"></textarea></label>`).join('')}</div><details><summary>Einen Beispielplan ansehen</summary>${Object.entries(planLabels).map(([key,label])=>`<p><strong>${escape(label)}</strong> ${escape(samplePlan[key])}</p>`).join('')}<p>Du darfst diesen Plan verwenden oder einen eigenen entwickeln.</p></details><p class="muted">Fülle die sechs Planfelder aus. Wir prüfen hier nur, ob etwas eingetragen ist. Inhaltlich überprüfst du deinen Plan selbst mit Minka und Fuji.</p>`;
      document.querySelectorAll('[data-course-plan]').forEach(input=>{const key=input.dataset.coursePlan;input.value=f.plan[key];input.oninput=()=>{f.plan[key]=input.value;updateFinalDone();save();finalButtons();renderDashboard();};});
    }
    if(phase===1||phase===2){
      el('course-final-stage').innerHTML=`<p class="course-stage-label">${phase===1?'Jetzt wächst deine Geschichte.':'Fuji liest mit dir noch einmal genau.'}</p><p>${phase===1?'Schreibe eine Einleitung und eine kurze Fortsetzung mit einem passenden Schluss. Etwa 8–12 Sätze können ein Anfang sein; es gibt keine feste Wortzahl. Erzähle im Präteritum. Wörtliche Rede darf eine passende andere Zeitform haben.':'Lies deinen Text laut. Überarbeite ihn direkt im Textfeld und prüfe dann die Punkte darunter. Setze einen Haken nur, wenn du die passende Stelle in deinem Text zeigen kannst.'}</p><details ${phase===1?'open':''}><summary>Dein Plan liegt neben dir</summary><dl class="course-plan-summary">${Object.entries(planLabels).map(([key,label])=>`<div><dt>${escape(label)}</dt><dd>${escape(f.plan[key]||'Noch offen')}</dd></div>`).join('')}</dl></details><label class="course-field">Titel deiner Geschichte<input type="text" id="course-final-title" maxlength="150" placeholder="Ein Titel, der zu deinem Abenteuer passt"></label><label class="course-field" for="course-final-draft">Deine Geschichte</label><textarea id="course-final-draft" rows="14" maxlength="20000" placeholder="Beginne mit der Ausgangssituation. Dein Hinweis darf neugierig machen."></textarea><p id="course-final-words" class="muted"></p>${phase===1?`<details><summary>Schreibhilfen von Minka und Fuji</summary><ul><li><strong>Anfang:</strong> „An einem …“ verbindet Zeit, Figuren und Ort.</li><li><strong>Schlinge:</strong> Was hören oder entdecken die beiden? Lasse die Ursache erst einmal offen.</li><li><strong>Hauptteil:</strong> Entwickle den Hinweis. Zeige Handlungen, Gedanken und Gefühle.</li><li><strong>Wortwahl:</strong> schleichen · spähen · mustern · flüstern · warnen · rau · dumpf · verwittert</li><li><strong>Schluss:</strong> Löse den Hinweis auf und zeige, wie es den beiden danach geht.</li></ul></details>`:`<div class="writing-checks">${finalChecks.map((check,i)=>`<label><input type="checkbox" data-course-final-check="${i}" ${f.checks[i]?'checked':''}><span>${escape(check)}</span></label>`).join('')}</div><p class="muted">Die Checkliste ist deine Selbsteinschätzung. Sie ist keine automatische Prüfung von Rechtschreibung, Grammatik oder Inhalt.</p>`}<details><summary>Eine vollständige Beispielgeschichte vergleichen</summary><p class="course-model-answer">${escape(finalModel)}</p><p>Deine Geschichte darf anders sein. Vergleiche die Wirkung deiner Formulierungen, nicht nur einzelne Wörter.</p></details>`;
      el('course-final-title').value=f.title;el('course-final-title').oninput=e=>{f.title=e.target.value;f.done=false;save();renderDashboard();};
      const draft=el('course-final-draft');draft.value=f.draft;
      function count(){const n=f.draft.trim()?f.draft.trim().split(/\s+/u).length:0;el('course-final-words').textContent=`${n} ${n===1?'Wort':'Wörter'} · Dein Text wird auf diesem Gerät gesichert, wenn der Browser das erlaubt.`;}
      draft.oninput=()=>{f.draft=draft.value;updateFinalDone();count();save();finalButtons();renderDashboard();};count();
      document.querySelectorAll('[data-course-final-check]').forEach(c=>c.onchange=()=>{f.checks[Number(c.dataset.courseFinalCheck)]=c.checked;f.done=false;save();finalButtons();renderDashboard();});
    }
    if(phase===3){
      const finished=completeCount()===9;
      el('course-final-stage').innerHTML=`<p class="course-stage-label">Deine Geschichte zum Lesen und Aufbewahren.</p><div id="course-reading-copy"><p class="eyebrow">Eine Geschichte von dir · Minka & Fuji</p><h3>${escape(f.title.trim()||'Mein Abenteuer mit Minka und Fuji')}</h3><div class="course-reading-text">${escape(f.draft||'Hier erscheint dein eigener Text. Gehe zum Schreibschritt zurück, um deine Geschichte zu verfassen.')}</div></div><div class="quiz-actions"><button type="button" class="primary" id="course-download" ${f.draft.trim()?'':'disabled'}>Text als TXT sichern</button><button type="button" class="secondary" id="course-print" ${f.draft.trim()?'':'disabled'}>Geschichte drucken</button><button type="button" class="secondary" id="course-final-finish" ${!finalReady()||f.done?'disabled':''}>${f.done?'Schreibprojekt abgeschlossen':'Schreibprojekt abschließen'}</button></div><p id="course-final-feedback" class="feedback" role="status">${f.done?(finished?'Du hast alle neun Stationen bearbeitet. Zeige einer anderen Person an drei Stellen, was du beim Erzählen gelernt hast.':'Dein Schreibprojekt ist abgeschlossen. Im Lernweg siehst du, welche Stationen du noch bearbeiten kannst.'):!finalReady()?'Schließe deinen Plan ab, schreibe deinen Text und überprüfe die acht Punkte, bevor du das Schreibprojekt abschließt.':'Du hast deinen Text selbst geprüft. Du kannst ihn jetzt sichern und dein Schreibprojekt abschließen.'}</p><p class="muted">Die TXT-Datei enthält deinen Text und deinen Plan. Du kannst sie auch außerhalb dieser App aufbewahren. Ein Abschluss bestätigt die bearbeiteten Schritte, keine benotete Leistung.</p>`;
      el('course-download').onclick=download;
      el('course-print').onclick=()=>{document.body.classList.add('course-printing');window.print();};
      el('course-final-finish').onclick=()=>{if(!finalReady())return;f.done=true;save(true);render();};
    }
    finalButtons();
  }
  function download(){
    const f=state.final;
    const content=`${f.title.trim()||'Mein Abenteuer mit Minka und Fuji'}\n\n${f.draft}\n\nMEIN ERZÄHLPLAN\n${Object.entries(planLabels).map(([key,label])=>`${label}\n${f.plan[key]}`).join('\n\n')}\n\nErstellt in der Minka-und-Fuji-Erzählwerkstatt. Selbst überarbeitet; nicht automatisch benotet.\n`;
    const url=URL.createObjectURL(new Blob(['\ufeff',content],{type:'text/plain;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='Meine_Minka_Fuji_Geschichte.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    el('course-save-note').textContent='Die TXT-Datei wurde zum Speichern bereitgestellt. Bewahre sie in deinen Dateien auf.';
  }
  el('course-resume').onclick=()=>{state.started=true;save();render();focusWorkspace();};
  el('course-reset').onclick=()=>{el('course-reset-confirm').hidden=false;el('course-reset-cancel').focus();};
  el('course-reset-cancel').onclick=()=>{el('course-reset-confirm').hidden=true;el('course-reset').focus();};
  el('course-reset-yes').onclick=()=>{pauseFilm();state=fresh();el('course-reset-confirm').hidden=true;save(true);el('course-save-note').textContent='Der Lehrgang wurde auf diesem Gerät neu begonnen.';render();};
  document.addEventListener('learningpagechange',event=>{if(event.detail.id!=='lehrgang'){pauseFilm();document.body.classList.remove('course-printing');}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){pauseFilm();save(true);}});
  window.addEventListener('pagehide',()=>{pauseFilm();save(true);});
  motionQuery.addEventListener('change',()=>{pauseFilm();updateMotion();});
  window.addEventListener('afterprint',()=>document.body.classList.remove('course-printing'));
  restore();render();updateMotion();
  if(location.hash==='#lehrgang')showPage('lehrgang',false);
})();

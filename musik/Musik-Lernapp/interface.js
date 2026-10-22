'use strict';

function showAudioControls(open){const panel=$('#audioSettings'),toggle=$('#audioToggle');if(!panel||!toggle)return;panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Tonfeld schließen':'Ton & Tempo';toggle.setAttribute('aria-label',open?'Ton- und Tempoeinstellungen schließen':'Ton- und Tempoeinstellungen öffnen');if(typeof syncMobileDock==='function')syncMobileDock();}
on('audioToggle',()=>showAudioControls($('#audioSettings').hidden));

function setDockMinimized(min){const dock=$('.audioDock');if(!dock)return;if(min)showAudioControls(false);dock.classList.toggle('dockMinimized',min);const restore=$('#dockRestore');if(restore)restore.hidden=!min;if(typeof syncMobileDock==='function')syncMobileDock();}
on('dockMinimize',()=>{setDockMinimized(true);$('#dockRestore')?.focus();});
on('dockRestore',()=>{setDockMinimized(false);$('#dockMinimize')?.focus();});

let recentRoundView=null;
function homeWelcome(completed,started){
 const profile=window.getRhythmusPersonal?.(),name=profile?.nickname?`, ${escapeText(profile.nickname)}`:'',greeting=started?'Willkommen zurück':'Schön, dass du da bist';
 const motivation=learning.missed.length?'Unsichere Antworten sind kein Problem – sie zeigen dir, was du als Nächstes üben kannst.':completed?`Du hast schon ${completed} ${completed===1?'Lernschritt':'Lernschritte'} ausprobiert. Jeder kleine Schritt zählt!`:started?`Du bist schon mittendrin: ${escapeText(MUSIC_PATH[pathState.index].title)}. Mach in deinem Tempo weiter.`:learning.step?`Du hast schon ${learning.step} ${learning.step===1?'Aufgabe':'Aufgaben'} geübt. Heute reicht ein kleiner nächster Schritt.`:'Lust auf Musik? Ein kleiner Lernschritt dauert ungefähr fünf Minuten. Du kannst jederzeit pausieren.';
 return `<div class="homeWelcome" role="region" aria-label="Begrüßung"><strong>${greeting}${name}!</strong><p>${motivation}</p></div>`;
}
function renderSimpleHome(){
 const current=MUSIC_PATH[pathState.index],completed=pathState.done.filter(Boolean).length,started=learning.step>0||completed>0||pathState.stages.some(stage=>stage>0);
 $('#main').innerHTML=`<div class="fujiHomeTitle"><img src="images/fuji-musiklehrer.webp" width="104" height="104" alt="Fuji, dein Musiklehrer"><div><div class="eyebrow">Dein Musiklehrer Fuji</div>${homeWelcome(completed,started)}<h1>Was möchtest du tun?</h1><p>Ich erkläre dir die Musik. Minka lernt mit uns.</p></div></div>
 <section class="card startLesson"><div><span class="startNumber">1</span><h2>Schritt für Schritt lernen</h2><p>Erklärung lesen, Beispiel hören, dann üben.</p><p class="nextLesson">Dein Platz: <strong>${pathState.index+1}. ${escapeText(current.title)}</strong></p></div><button id="pathResume" class="primary">${pathState.stages[pathState.index]>0||completed?'Hier weiterlernen':'Mit dem Puls beginnen'}</button></section>
 <details class="card firstVisitGuide" ${started?'':'open'}><summary>Neu hier? So lernst du in drei Schritten</summary><ol><li><b>Verstehen:</b> Lies die kurze Erklärung und das Lernziel.</li><li><b>Hören und sehen:</b> Schau dir das Beispiel an; du kannst es anhören.</li><li><b>Selbst probieren:</b> Löse eine Aufgabe mit Hilfe und zwei selbst. Fehler zeigen, was du noch üben kannst – sie sind keine Note.</li></ol><p class="legend">Ein Lernschritt dauert ungefähr 5 Minuten. Du kannst jederzeit pausieren.</p></details>
 <div class="startChoices"><section class="card"><span class="startNumber">2</span><h2>Gezielt üben</h2><p>Wähle dein Thema: Noten, Pausen, Takte oder Rhythmus.</p><button id="homeExercises" class="primary">Übungen auswählen</button></section><section class="card"><span class="startNumber">3</span><h2>In den Heften nachlesen</h2><p>Lernheft mit Erklärungen und Arbeitsheft mit Lösungen.</p><div class="row"><button id="homeDocuments" class="primary">Hefte öffnen</button><button id="homeContents">Inhaltsverzeichnis</button></div></section></div>
 <div class="startProgress"><p><strong>${completed} von ${MUSIC_PATH.length}</strong> Lernschritten geübt.</p><button id="homeProgress">Meinen Fortschritt ansehen</button></div>`;
 on('pathResume',()=>{lesson=current.topic;setView('learn');});on('homeExercises',()=>setView('exerciseHub'));on('homeDocuments',()=>setView('documents'));on('homeContents',()=>showContents());on('homeProgress',()=>setView('progress'));
}
renderHome=renderSimpleHome;
const renderSmartBeforeCheers=renderSmart;
renderSmart=function(){renderSmartBeforeCheers();const profile=window.getRhythmusPersonal?.();if(view==='smart'&&!smart?.round&&profile?.cheers&&!$('#main .learningCheers'))$('#main > section.card > h1')?.insertAdjacentHTML('afterend',smartEncouragement());};
function renderProgress(){
 priorPathHome();$('#main h1').textContent='Mein Lernfortschritt';
 const parentTopic=recommendedTopic(),parentCard=document.createElement('section'),dueQuestions=learning.missed.filter(r=>r.due<=learning.step||r.time<=Date.now()).sort((a,b)=>b.attempts-a.attempts).slice(0,3);parentCard.className='card spaced parentOverview';parentCard.innerHTML=`<div class="eyebrow">Gemeinsam zu Hause</div><h2>Eine einfache Übersicht für Eltern</h2><p>Hier gibt es keine Schulnoten und keinen Vergleich mit anderen. Die Übersicht zeigt nur, was auf diesem Gerät geübt wurde und welcher kleine Schritt als Nächstes helfen kann.</p><p><strong>Vorschlag für heute:</strong> ${topicTitles[parentTopic]}${learning.missed.some(r=>r.topic===parentTopic)?' – dazu gibt es konkrete Fragen zum Wiederholen.':'.'}</p>${dueQuestions.length?`<details><summary>Welche Fragen könnten wir noch einmal üben?</summary><ul>${dueQuestions.map(r=>`<li>${escapeText(topicTitles[r.topic])}: ${escapeText(r.question)}</li>`).join('')}</ul></details>`:''}<div class="tip"><strong>So können Eltern helfen</strong><p>Bitte das Kind, den Rhythmus vorzuspielen oder zu erklären, wie es gerechnet hat. Erst zuhören, dann mit einer Frage unterstützen. Die App speichert hier keine Schulnoten oder Vergleiche.</p></div><div class="row"><button id="parentLearn">Thema gemeinsam ansehen</button><button id="parentPractice" class="primary">Passende Aufgaben üben</button></div>`;$('#main').appendChild(parentCard);on('parentLearn',()=>openTopic(parentTopic));on('parentPractice',()=>startSmart('review',parentTopic));
 const reset=$('#resetYes');if(reset){const old=reset.onclick;reset.onclick=()=>{pathState=pathDefaultState();savePath();old();setView('progress');};}
 const teacherCard=document.createElement('section');teacherCard.className='card spaced teacherExport';teacherCard.innerHTML=`<h2>Für die Lehrkraft</h2><p>Eine kompakte Übersicht zum Mitbringen in den Unterricht. Ein Rufname erscheint nur, wenn du selbst einen gewählt hast. Prüfe die Übersicht, bevor du sie teilst.</p><div class="row"><button id="teacherPrint">Übersicht drucken</button><button id="teacherCsv">Lernstand als CSV-Datei</button></div><p id="teacherExportStatus" class="legend" role="status"></p>`;$('#main').appendChild(teacherCard);on('teacherPrint',printTeacherSummary);on('teacherCsv',downloadTeacherCsv);
}
// Lernstands-Übersicht für Lehrkräfte: Druckseite und CSV-Export.
function teacherSummaryData(){const missed=[...learning.missed].sort((a,b)=>b.attempts-a.attempts);return {date:new Date().toLocaleDateString('de-DE'),name:(typeof personal!=='undefined'&&personal.nickname)||'',done:pathState.done.filter(Boolean).length,total:MUSIC_PATH.length,answers:learning.step,topics:topicTitles.map((t,i)=>({title:t,status:skillStatus(i),count:learning.topics[i].count})),missed,priorities:[...new Set(missed.map(r=>r.topic))].slice(0,4)};}
function printTeacherSummary(){const d=teacherSummaryData(),sheet=$('#printSheet');sheet.innerHTML=`<section class="printPage"><h1>Rhythmuswerkstatt · Lernstands-Übersicht</h1><p>${d.name?'Rufname: '+escapeText(d.name)+' · ':''}Datum: ${d.date}</p><h2>Lernweg</h2><p>${d.done} von ${d.total} Lernschritten geübt · ${d.answers} gewertete Antworten insgesamt</p><h2>Themen</h2><table class="printTable"><thead><tr><th>Thema</th><th>Lernstand</th><th>Antworten</th></tr></thead><tbody>${d.topics.map(t=>`<tr><td>${escapeText(t.title)}</td><td>${escapeText(t.status)}</td><td>${t.count}</td></tr>`).join('')}</tbody></table><h2>Häufige Stolperstellen und nächste Übungen</h2>${d.missed.length?`<ul>${d.missed.slice(0,8).map(r=>`<li>${escapeText(topicTitles[r.topic])}: ${escapeText(r.question)} (${r.attempts} ${r.attempts===1?'Versuch':'Versuche'})</li>`).join('')}</ul>`:'<p>Noch keine konkreten Fehler für die Wiederholung gespeichert.</p>'}<p>${d.priorities.length?'Geeignete nächste Themen: '+d.priorities.map(i=>escapeText(topicTitles[i])).join(', ')+'.':'Bei Bedarf einen kurzen Lerncheck durchführen und daran die nächste Übung auswählen.'}</p><h2>Geübte Lernschritte</h2><p class="printSteps">${MUSIC_PATH.map((s,i)=>(pathState.done[i]?'☑':'☐')+' '+(i+1)+'. '+escapeText(s.title)).join('<br>')}</p><p>Diese Übersicht zeigt Übungsstände, keine Schulnoten. „Schon sicher“ bedeutet: Die letzten Antworten in diesem Thema waren überwiegend richtig.</p></section>`;if(typeof window.print==='function')window.print();else $('#teacherExportStatus').textContent='Drucken ist in diesem Browser nicht verfügbar. Nutze die CSV-Datei.';}
function downloadTeacherCsv(){try{const d=teacherSummaryData();const rows=[['Bereich','Wert'],['Datum',d.date],['Rufname',d.name],['Geübte Lernschritte',`${d.done} von ${d.total}`],['Gewertete Antworten',String(d.answers)],...d.topics.map(t=>['Thema: '+t.title,`${t.status} (${t.count} Antworten)`]),...d.missed.map(r=>['Wiederholungsbedarf: '+topicTitles[r.topic],`${r.question} (${r.attempts} ${r.attempts===1?'Versuch':'Versuche'})`]),['Nächste geeignete Themen',d.priorities.map(i=>topicTitles[i]).join(', ')||'Lerncheck durchführen'],...MUSIC_PATH.map((s,i)=>[`Schritt ${i+1}: ${s.title}`,pathState.done[i]?'geübt':'offen'])];const csv='\ufeff'+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='Rhythmuswerkstatt-Lernstand.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1500);$('#teacherExportStatus').textContent='CSV-Datei wurde zum Speichern bereitgestellt.';}catch(e){$('#teacherExportStatus').textContent='CSV-Export fehlgeschlagen: '+e.message;}}
const exerciseGroups=[
 ['Notenwerte','Ganze, Halbe, Viertel, Achtel und Sechzehntel.',[['notes','Notenwerte üben'],['hear','Rhythmen hören und erkennen']]],
 ['Pausen','Pausenzeichen und Stille im laufenden Takt.',[['rests','Pausenzeichen üben'],['pause','Ton oder Stille im Takt erkennen']]],
 ['Takte','3/4 und 4/4, Lücken und Taktstriche.',[['builder','Eine Taktlücke füllen'],['free','Einen eigenen Takt bauen'],['errors','Taktfehler erkennen'],['bars','Taktstriche setzen']]],
 ['Rhythmus','Sprechen, hören und nachklopfen.',[['words','Brot, Käse und Schokolade'],['taboo','Verbotener Rhythmus'],['tap','Rhythmus nachklopfen'],['pieces','Mehrere Takte spielen']]],
 ['Punktierte Noten','Grundwert plus die Hälfte.',[['dotCalc','Punktierte Werte üben'],['dotBars','Punktierte Takte ergänzen'],['dotHear','Lang und kurz hören']]],
 ['Noten beschriften','Kopf, Hals, Fähnchen, Balken und Punkt.',[['labels','Bestandteile zuordnen']]],
 ['Mein Wissen prüfen','Rückmeldung erhalten oder Tests ausdrucken.',[['check','Lerncheck mit 12 Aufgaben'],['review','Unsichere Themen wiederholen'],['tests','Übungstests und Druckvorlagen']]]
];
function renderExerciseHub(){
 const hasQuiz=quiz&&quiz.mode!=='label'&&quiz.index<quiz.questions.length;const pending=recentRoundView==='practice'&&hasQuiz?'practice':smart?.round?'smart':hasQuiz?'practice':null;
 $('#main').innerHTML=`<div class="eyebrow">Üben</div><h1>Welches Thema möchtest du üben?</h1><p>Tippe auf ein Thema. Darunter findest du die passenden Übungen.</p>${pending?'<section class="card continueRound"><p>Du hast noch eine begonnene Übungsrunde.</p><button id="resumeRound" class="primary">Meine Runde fortsetzen</button></section>':''}<div class="exerciseGroups">${exerciseGroups.map(([title,desc,actions])=>`<details class="card exerciseGroup"><summary><img class="hubPicture" src="images/lesson-${['familie','stille','dreiertakt','woerter','punkt','teile','abschluss'][exerciseGroups.findIndex(g=>g[0]===title)]}.webp" alt="" width="110" height="74" loading="lazy">${title}<span>${desc}</span></summary><div class="exerciseActions">${actions.map(([id,label])=>`<button data-exercise="${id}">${label}</button>`).join('')}</div></details>`).join('')}</div>`;
 on('resumeRound',()=>setView(pending));$$('[data-exercise]').forEach(b=>b.onclick=()=>openExercise(b.dataset.exercise));
}
function openExercise(id){
 if(id==='notes'||id==='rests'){startSmart('review',id==='notes'?0:1);return;}
 if(id==='review'||id==='check'){startSmart(id==='check'?'check':'review');return;}
 if(id==='hear'){quiz=null;setView('practice');startQuiz('hear');return;}
 if(id==='labels'){quiz={mode:'label'};setView('practice');return;}
 if(id==='builder'||id==='free'){stop();editIndex=-1;build=[];fixed=[];task=null;if(id==='builder')newTask();setView('builder');return;}
 if(['pause','errors','bars','taboo'].includes(id)){detectMode=id;if(id==='pause'){pauseTutorial=true;pauseLevel=1;}newDetectiveRound(true);setView('detective');return;}
 if(['dotCalc','dotBars','dotHear'].includes(id)){dotTab={dotCalc:'calc',dotBars:'bars',dotHear:'hear'}[id];startDotRound(true);setView('dotted');return;}
 setView({words:'rhythm',tap:'tap',pieces:'pieces',tests:'tests'}[id]||'exerciseHub');
}
registerView('exerciseHub',()=>renderExerciseHub());registerView('progress',()=>renderProgress());
const interfaceRoutes=new Set(['home','learn','exerciseHub','progress','practice','smart','builder','rhythm','detective','tests','tap','dotted','pieces','documents','contents','device','access','labs','bilder','schultraining','entdecken','personal','games','mini','cards','backup']);
function routeGroup(v){return v==='home'||v==='progress'?'home':v==='learn'?'learn':['documents','contents'].includes(v)?'documents':['device','access','personal','backup'].includes(v)?'home':v==='mini'?'learn':'exerciseHub';}
function routeHash(v){return {home:'start',documents:'hefte',contents:'inhalte',exerciseHub:'uebungen',progress:'fortschritt',learn:'lernen'}[v]||v;}
function viewFromHash(hash){const key=hash.replace(/^#/,'');return {start:'home',hefte:'documents',inhalte:'contents',uebungen:'exerciseHub',fortschritt:'progress',lernen:'learn'}[key]||(interfaceRoutes.has(key)?key:'home');}
let restoringHistory=false;
onViewGuard(v=>interfaceRoutes.has(v)?v:'home');
onBeforeViewChange((previous,v)=>{if(v==='smart'||v==='practice')recentRoundView=v;});
onAfterViewChange((v,previous)=>{
 const changed=previous!==v;
 const selected=routeGroup(v);$$('nav button').forEach(b=>{b.classList.toggle('selected',b.dataset.view===selected);b.setAttribute('aria-current',b.dataset.view===selected?'page':'false');});
 const mobile=$('#mobileView');if(mobile)mobile.value=v;
 const options=$('.headerOptions');if(options)options.open=false;
 if(!restoringHistory&&typeof window.history?.pushState==='function'){const hash='#'+routeHash(v);if(location.hash!==hash)window.history.pushState({musicView:v},'',hash);}
 if(changed&&typeof window.scrollTo==='function')window.scrollTo({top:0,behavior:'auto'});
});
if(typeof window.addEventListener==='function'){
 const restore=()=>{if(location.hash==='#main')return;const next=viewFromHash(location.hash);if(view===next)return;restoringHistory=true;setView(next);restoringHistory=false;};
 window.addEventListener('popstate',restore);window.addEventListener('hashchange',restore);
}
// Touch navigation and mobile selects use their native events.
$$('nav button').forEach(b=>b.onclick=()=>setView(b.dataset.view));
const interfaceMobile=$('#mobileView');if(interfaceMobile){interfaceMobile.onclick=null;interfaceMobile.onchange=()=>setView(interfaceMobile.value);}
const initialInterfaceView=viewFromHash(location.hash);if(initialInterfaceView==='learn')lesson=MUSIC_PATH[pathState.index].topic;if(!['labs','bilder','schultraining','entdecken','personal','games','mini','cards','backup'].includes(initialInterfaceView))setView(initialInterfaceView);

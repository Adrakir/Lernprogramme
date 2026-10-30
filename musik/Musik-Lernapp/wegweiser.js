'use strict';
// Ein gemeinsamer Einstieg ersetzt die nacheinander angehängten Startkarten.
// Die vorhandenen Lernmodule, Spielstände und Speicher-Schlüssel bleiben erhalten.
const guideTopics=[
 {id:'puls',title:'Puls und Tempo',question:'Wie bleibe ich im gleichen Takt?',keys:['puls','tempo'],image:'lesson-puls',practice:'tap'},
 {id:'schrift',title:'Notenaufbau und Notenlinien',question:'Was bedeuten Kopf, Hals und Linien?',keys:['teile','system'],image:'lesson-system',practice:'labels'},
 {id:'werte',title:'Notenwerte',question:'Wie lange klingt eine Note?',keys:['viertel','halbe','ganze','achtel','sechzehntel','familie'],image:'lesson-familie',practice:'notes'},
 {id:'pausen',title:'Pausen und Stille',question:'Wann bleibe ich still, wann spiele ich weiter?',keys:['stille','viertelpause','lange-pausen','kurze-pausen','generalpause'],image:'lesson-stille',practice:'pause'},
 {id:'takte',title:'Takte und Taktstriche',question:'Wie fülle und prüfe ich einen Takt?',keys:['dreiertakt','vierertakt','striche','luecken','fehler'],image:'lesson-dreiertakt',practice:'builder'},
 {id:'rhythmus',title:'Rhythmus sprechen und spielen',question:'Wie verteile ich Töne auf die Schläge?',keys:['woerter','zaehlen','verboten','abschluss'],image:'lesson-woerter',practice:'words'},
 {id:'punkt',title:'Punktierte Noten und Pausen',question:'Was verändert der Punkt rechts am Zeichen?',keys:['punkt','punkt-im-takt','punktierte-achtel'],image:'lesson-punkt',practice:'dotCalc'}
];
let guideTopic=null,guideTeacherTopic='puls',guideTeacherMode=false;
const guideSavedRole=appStorage.read('rhythmuswerkstatt.role.v1');
let guideRole=['student','teacher'].includes(guideSavedRole)?guideSavedRole:null,guideTeacherKey=null,guideTeacherTab='auftrag';
function guideChooseRole(role){guideRole=role;appStorage.write('rhythmuswerkstatt.role.v1',role);setView('home');}
function guideRoleChoice(){
 $('#main').innerHTML=`<div class="simpleWelcome"><div class="eyebrow">Musik · Klasse 5</div><h1>Willkommen in der Rhythmuswerkstatt</h1><p>Wähle deinen Einstieg.</p><div class="simpleRoles"><button id="simpleStudent" class="card"><span class="simpleRoleIcon" aria-hidden="true">♫</span><strong>Ich bin Schüler/in</strong><span>Musik verstehen und Schritt für Schritt üben.</span><b>Zum Lernen →</b></button><button id="simpleTeacher" class="card"><span class="simpleRoleIcon" aria-hidden="true">▤</span><strong>Ich bin Lehrkraft</strong><span>Ein Thema vorbereiten und einen klaren Auftrag geben.</span><b>Zum Unterricht →</b></button></div><p class="legend">Du kannst den Einstieg jederzeit oben wechseln.</p></div>`;
 on('simpleStudent',()=>guideChooseRole('student'));on('simpleTeacher',()=>guideChooseRole('teacher'));
}

const guideIndex=key=>MUSIC_PATH.findIndex(d=>d.key===key);
const guideTopicFor=key=>guideTopics.find(t=>t.keys.includes(key))||guideTopics[0];
function guideBookItem(book,key){return MUSIC_DOCUMENT_CONTENTS[book].groups.flatMap(g=>g.items).find(item=>item.key===key);}
function guidePdf(book,key,label=null){const item=guideBookItem(book,key),data=MUSIC_DOCUMENT_CONTENTS[book];if(!item)return '';return `<a class="documentLink" href="${data.file}#page=${book==='work'?item.end:item.page}" target="_blank" rel="noopener">${label||data.name+' · S. '+(book==='work'?item.end:item.page)}</a>`;}
function guideResumeIndex(){let i=pathState.index;if(pathState.done[i]){let next=pathState.done.findIndex((done,j)=>j>i&&!done);if(next<0)next=pathState.done.findIndex(done=>!done);if(next>=0)i=next;}return i;}
function guideResume(){if(pathState.done.every(Boolean)){startSmart('review');return;}const index=guideResumeIndex();if(index!==pathState.index)pathSelect(index,0);else{lesson=MUSIC_PATH[index].topic;setView('learn');}}
function guideBindActions(){
 $$('[data-guide-view]').forEach(b=>b.onclick=()=>setView(b.dataset.guideView));
 $$('[data-guide-lesson]').forEach(b=>b.onclick=()=>pathSelect(guideIndex(b.dataset.guideLesson),0));
 $$('[data-guide-topic]').forEach(b=>b.onclick=()=>{if(guideRole==='teacher'){guideTeacherTopic=b.dataset.guideTopic;guideTeacherKey=null;setView('home');}else{guideTopic=b.dataset.guideTopic;setView('themen');}});
 $$('[data-guide-exercise]').forEach(b=>b.onclick=()=>openExercise(b.dataset.guideExercise));
 $$('[data-guide-discover]').forEach(b=>b.onclick=()=>openDiscover(b.dataset.guideDiscover));
 $$('[data-guide-visual]').forEach(b=>b.onclick=()=>openVisual(+b.dataset.guideVisual));
 $$('[data-guide-school]').forEach(b=>b.onclick=()=>openSchool(b.dataset.guideSchool));
 on('guideResume',guideResume);on('guideAllTopics',()=>{guideTopic=null;setView('themen');});
 on('guideGames',()=>openGame());on('guideCheck',()=>startSmart('check'));on('guideReview',()=>startSmart('review'));
 on('guideMini',()=>{miniTopic=recommendedTopic();if(coachState.mini?.phase==='finished'){coachState.mini=null;saveCoach();}setView('mini');});
}
function guideHome(){
 if(!guideRole){guideRoleChoice();return;}
 if(guideRole==='teacher'){guideTeacher();return;}
 const i=guideResumeIndex(),d=MUSIC_PATH[i],started=pathState.stages.some(x=>x>0)||pathState.done.some(Boolean),finished=pathState.done.every(Boolean);
 $('#main').innerHTML=`<div class="eyebrow">Für Schüler und Schülerinnen</div><h1>${finished?'Dein Lernweg ist geübt':'Dein nächster Schritt'}</h1><p class="guideLead">${finished?'Du hast alle Lernschritte bearbeitet. Wiederhole jetzt die Themen, bei denen du noch unsicher bist.':'Starte hier. Die Erklärung und die Aufgaben kommen nacheinander.'}</p><section class="card simpleNext"><div><span class="guideTag">${finished?'Alle '+MUSIC_PATH.length+' Lernschritte bearbeitet':'Lernschritt '+(i+1)+' von '+MUSIC_PATH.length}</span><h2>${finished?'Gelerntes festigen':escapeText(d.title)}</h2><p>${finished?'Die Wiederholung wählt Aufgaben passend zu deinem bisherigen Lernstand.':escapeText(d.goal)}</p><button id="guideResume" class="primary">${finished?'Passende Wiederholung starten':started?'Hier weiterlernen':'Jetzt anfangen'} →</button></div><img src="images/fuji-musiklehrer.webp" width="112" height="112" alt="Fuji begleitet dich beim Lernen"></section><div class="simpleAlternative"><p>Deine Lehrkraft hat ein anderes Thema genannt?</p><button id="guideAllTopics">Unterrichtsthema auswählen</button></div><details class="simpleHelp"><summary>Wie funktioniert das Lernen?</summary><ol><li>Lies die Erklärung.</li><li>Höre das Beispiel an.</li><li>Löse eine Aufgabe mit Hilfe.</li><li>Übe anschließend selbst.</li></ol><p>Du musst keine Übungsart auswählen. „Weiter“ führt dich durch den Lernschritt.</p></details>`;
 guideBindActions();
}
function guideAreaHelp(){return `<dl class="guideDefinitions"><div><dt>Lernen</dt><dd>Erklärungen und vorgemachte Beispiele. Beginne hier, wenn etwas neu oder unklar ist.</dd></div><div><dt>Üben</dt><dd>Aufgaben selbst lösen. Tipps und Begründungen helfen dir dabei.</dd></div><div><dt>Prüfen</dt><dd>Deinen Lernstand einschätzen oder einen Übungstest bearbeiten.</dd></div><div><dt>Hefte</dt><dd>Das Lernheft erklärt. Das Aufgabenheft bietet Übungen und Lösungen zum Ausdrucken.</dd></div></dl>`;}
function guideTopicsView(){
 const topic=guideTopics.find(t=>t.id===guideTopic);
 if(!topic){
 $('#main').innerHTML=`<div class="eyebrow">Unterrichtsthemen</div><h1>Welches Thema ist dran?</h1><p>Wähle das Thema aus deinem Unterricht.</p><div class="simpleTopicList">${guideTopics.map((t,i)=>`<button class="simpleTopicButton" data-guide-topic="${t.id}"><span class="simpleNumber">${i+1}</span><span><strong>${t.title}</strong><small>${t.keys.length} Lernschritte</small></span><span aria-hidden="true">→</span></button>`).join('')}</div>`;
 }else{
 $('#main').innerHTML=`<button id="guideAllTopics" class="subtle">← Alle Themen</button><h1 class="spaced">${topic.title}</h1><p>Beginne mit dem ersten Lernschritt oder wähle deinen Arbeitsauftrag.</p><ol class="simpleLessonList">${topic.keys.map((key,j)=>{const i=guideIndex(key),d=MUSIC_PATH[i];return `<li><button data-guide-lesson="${key}"><span class="simpleNumber">${j+1}</span><span><strong>${escapeText(d.title)}</strong><small>${pathState.done[i]?'✓ Geübt':'Erklärung und Aufgaben'}</small></span><span aria-hidden="true">→</span></button></li>`;}).join('')}</ol><details class="card simpleOptional"><summary>Schon verstanden? Zusätzliche Übungen</summary><p>Diese Übung ist eine Ergänzung zum Lernschritt.</p><button data-guide-exercise="${topic.practice}">Übung zu diesem Thema starten</button></details>`;
 }
 guideBindActions();
}
function guideExerciseHub(){
 const groups=exerciseGroups.slice(0,6),keys=['viertel','stille','dreiertakt','woerter','punkt','teile'];
 const round=recentRoundView==='practice'&&quiz&&quiz.mode!=='label'&&quiz.index<quiz.questions.length?'practice':smart?.round?'smart':null;
 $('#main').innerHTML=`<div class="eyebrow">Üben · selbst ausprobieren</div><h1>Was möchtest du üben?</h1><p>Wähle zuerst ein Thema und dann eine Übung. Wenn die Erklärung noch fehlt, nutze „Lernen“.</p>
 ${round?`<section class="card guideContinue"><p>Deine begonnene Übungsrunde ist noch offen.</p><button data-guide-view="${round}" class="primary">Übungsrunde fortsetzen</button></section>`:''}
 <div class="guideExerciseGrid">${groups.map(([title,desc,actions],i)=>`<details class="card guideExerciseGroup"><summary><strong>${title}</strong><span>${desc}</span></summary><div class="guideExerciseLinks">${actions.map(([id,label])=>`<button data-guide-exercise="${id}">${label}</button>`).join('')}<button class="subtle" data-guide-lesson="${keys[i]}">Noch unsicher? Erklärung ansehen</button></div></details>`).join('')}</div>
 <h2 class="guideSectionTitle">Andere Arten zu üben</h2><p class="legend">Diese Angebote sind Ergänzungen. Für den normalen Lernweg brauchst du sie nicht vorher auszuwählen.</p>
 <details class="card guideExtra"><summary>Mit Bildern, Animationen und Bewegung</summary><p>Nutze diese anschaulichen Übungen, wenn du etwas sehen oder nachmachen möchtest.</p><div class="guideExtraGrid"><div><h3>Animationen und Ausprobieren</h3>${Object.entries(discoverTabs).map(([id,label])=>`<button data-guide-discover="${id}">${label.replace(/^\d+ · /,'')}</button>`).join('')}</div><div><h3>Bild-Erklärungen mit Übungen</h3>${visualStations.map((s,i)=>`<button data-guide-visual="${i}">${s.title}</button>`).join('')}</div></div></details>
 <details class="card guideExtra"><summary>Schulaufgaben und eigene Musikstücke</summary><p>Für einen Arbeitsauftrag aus dem Unterricht oder zum Vertiefen.</p><div class="guideExtraLinks"><button data-guide-school="pyramide">Notenwerte mit der Pyramide vergleichen</button><button data-guide-school="split">Punktierte Werte zerlegen</button><button data-guide-school="hear">Gleichmäßige und punktierte Rhythmen hören</button><button data-guide-school="compose">Ein eigenes Rhythmusstück bauen</button><button data-guide-school="plan">Stationenplan und Selbsteinschätzung</button><button id="guideLabs">Weitere Aufgaben in der Musikwerkstatt</button></div></details>
 <details class="card guideExtra"><summary>Musikspiele, kurze Runden und Merkkarten</summary><p>Spiele wiederholen Bekanntes. In einer kleinen Lernrunde gibt es ein Beispiel und drei Aufgaben.</p><div class="row"><button id="guideGames">Sechs Musikspiele auswählen</button><button id="guideMini">Kleine Lernrunde starten</button><button data-guide-view="cards">Meine Merkkarten (${coachState.cards.length})</button></div></details>`;
 guideBindActions();on('guideLabs',()=>openLab('dictation'));
}
function guideChecks(){
 $('#main').innerHTML=`<div class="eyebrow">Prüfen · danach gezielt weiterlernen</div><h1>Was klappt schon?</h1><p>Die Ergebnisse helfen dir beim Üben. Sie sind keine Schulnote.</p><div class="guideChoices guideCheckChoices"><article class="card"><span class="guideTag">12 Aufgaben · alle Themen</span><h2>Lerncheck mit Rückmeldung</h2><p>Beantworte die Fragen. Danach siehst du deine Ergebnisse und passende Empfehlungen.</p><button id="guideCheck" class="primary">Lerncheck starten</button></article><article class="card"><span class="guideTag">8 Aufgaben · 6 Versionen</span><h2>Übungstest wie im Unterricht</h2><p>Bearbeite einen ganzen Test am Bildschirm oder drucke Aufgaben und Lösungen aus.</p><button data-guide-view="tests">Übungstest auswählen</button></article></div><section class="card guideFollowup"><h2>Danach: unsichere Themen üben</h2><p>In der Wiederholung bekommst du Aufgaben passend zu deinem bisherigen Lernstand auf diesem Gerät.</p><div class="row"><button id="guideReview">Passende Wiederholung starten</button><button data-guide-view="progress" class="subtle">Lernfortschritt ansehen</button></div></section>`;
 guideBindActions();
}
function guideLessonUrl(key){const url=new URL(location.href);url.searchParams.set('schritt',key);url.searchParams.delete('pruefstand');url.hash='lernen';return url.href;}
function guideTeacher(){
 guideTeacherMode=true;const t=guideTopics.find(t=>t.id===guideTeacherTopic)||guideTopics[0];
 if(!t.keys.includes(guideTeacherKey))guideTeacherKey=t.keys[0];
 const d=MUSIC_PATH[guideIndex(guideTeacherKey)],learn=guideBookItem('learn',d.key),work=guideBookItem('work',d.key);
 const assignment=`Musikauftrag: ${d.title}\n1. Öffne diesen Link: ${guideLessonUrl(d.key)}\n2. Lies die Erklärung und höre das Beispiel.\n3. Löse die gemeinsame Aufgabe und die ${d.questions.length-1} eigenen Aufgaben.\n4. Erkläre eine Lösung mit eigenen Worten.\nZum Nachlesen: Lernheft S. ${learn?.page||''}.\nAuf Papier üben: Aufgabenheft S. ${work?.end||''}.`;
 let panel='';
 if(guideTeacherTab==='auftrag')panel=`<h2>Arbeitsauftrag geben</h2><p>Der Link öffnet direkt diesen Lernschritt. Die Lernenden werden durch Erklärung, Beispiel und Aufgaben geführt.</p><label for="guideAssignment" class="legend">Auftrag zum Kopieren</label><textarea id="guideAssignment" readonly rows="7">${escapeText(assignment)}</textarea><div class="row"><button id="guideCopy" class="primary">Auftrag mit Link kopieren</button><button data-guide-lesson="${d.key}">Lernschritt ansehen</button></div><p id="guideCopyStatus" class="legend" role="status"></p><details class="simpleHelp"><summary>Vorschlag für den Unterrichtsablauf</summary><ol><li>Gemeinsam einsteigen: Puls klopfen oder ein Zeichen zeigen.</li><li>Den ausgewählten Lernschritt bearbeiten lassen.</li><li>Eine Lösung erklären oder vorspielen lassen.</li></ol></details>`;
 if(guideTeacherTab==='material')panel=`<h2>Material zu diesem Lernschritt</h2><div class="simpleMaterials"><div><strong>Erklärung nachlesen</strong>${guidePdf('learn',d.key)}</div><div><strong>Auf Papier üben</strong>${guidePdf('work',d.key)}</div><div><strong>Antworten kontrollieren</strong>${work?.solution?`<a class="documentLink" href="${MUSIC_DOCUMENT_CONTENTS.work.file}#page=${work.solution}" target="_blank" rel="noopener">Lösungen · S. ${work.solution}</a>`:''}</div></div><details class="simpleHelp"><summary>Zusätzlich am Bildschirm üben</summary><p>Für Lernende, die den Lernschritt bereits bearbeitet haben.</p><button data-guide-exercise="${t.practice}">Passende Übung öffnen</button></details>`;
 if(guideTeacherTab==='kontrolle')panel=`<h2>Lernen sichtbar machen</h2><p>Lassen Sie eine Lösung erklären oder einen Rhythmus vorspielen. Die Rückmeldungen in den Aufgaben helfen beim Besprechen.</p><div class="simpleMaterials"><div><strong>Lernstand dieses Geräts</strong><p>Hier sehen Sie ausschließlich die auf diesem Gerät gespeicherten Übungen.</p><button data-guide-view="progress">Lernstand ansehen und drucken</button></div><div><strong>Lerncheck zu allen Themen</strong><p>Erst einsetzen, wenn die Themen behandelt wurden.</p><button id="guideCheck">Lerncheck starten</button></div><div><strong>Test zum Ausdrucken</strong><p>Aufgaben und Lösungen für eine gemeinsame Lernkontrolle.</p><button data-guide-view="tests">Übungstests öffnen</button></div></div>`;
 $('#main').innerHTML=`<div class="eyebrow">Für Lehrkräfte</div><h1>Unterricht vorbereiten</h1><p>Wählen Sie Thema und Lernschritt. Danach finden Sie den Auftrag und das passende Material.</p><div class="simpleTeacherSelect"><label>1. Thema<select id="guideTeacherTopic" aria-label="1. Thema">${guideTopics.map(x=>`<option value="${x.id}" ${x.id===t.id?'selected':''}>${x.title}</option>`).join('')}</select></label><label>2. Lernschritt<select id="guideTeacherLesson" aria-label="2. Lernschritt">${t.keys.map(k=>`<option value="${k}" ${k===d.key?'selected':''}>${escapeText(MUSIC_PATH[guideIndex(k)].title)}</option>`).join('')}</select></label></div><p class="simpleGoal"><strong>Lernziel:</strong> ${escapeText(d.goal)}</p><div class="simpleTabs" role="group" aria-label="Unterricht vorbereiten">${[['auftrag','Auftrag'],['material','Hefte & Lösungen'],['kontrolle','Lernkontrolle']].map(([id,label])=>`<button data-guide-teacher-tab="${id}" aria-pressed="${guideTeacherTab===id}" class="${guideTeacherTab===id?'selected':''}">${label}</button>`).join('')}</div><section class="card simpleTeacherPanel guideAssignment">${panel}</section>`;
 guideBindActions();$('#guideTeacherTopic').onchange=e=>{guideTeacherTopic=e.target.value;guideTeacherKey=null;render();};$('#guideTeacherLesson').onchange=e=>{guideTeacherKey=e.target.value;render();};
 $$('[data-guide-teacher-tab]').forEach(b=>b.onclick=()=>{guideTeacherTab=b.dataset.guideTeacherTab;render();});
 on('guideCopy',async()=>{const field=$('#guideAssignment');try{await navigator.clipboard.writeText(field.value);$('#guideCopyStatus').textContent='Auftrag und Link sind kopiert.';}catch{field.focus();field.select();$('#guideCopyStatus').textContent='Der Text ist markiert. Wählen Sie „Kopieren“.';}});
}
const guideMeta={home:['Start','home'],themen:['Themen','themen'],learn:['Lernweg','themen'],exerciseHub:['Üben','exerciseHub'],pruefen:['Prüfen','pruefen'],tests:['Übungstest','pruefen'],documents:['Hefte','documents'],contents:['Heftseiten finden','documents'],progress:['Mein Fortschritt','pruefen'],lehrkraft:['Für Lehrkräfte','home'],practice:['Noten und Hörübungen','exerciseHub'],builder:['Einen Takt bauen','exerciseHub'],detective:['Rhythmus-Detektiv','exerciseHub'],dotted:['Punktierte Werte üben','exerciseHub'],rhythm:['Rhythmuswörter','exerciseHub'],tap:['Rhythmus nachklopfen','exerciseHub'],pieces:['Rhythmusstücke','exerciseHub'],bilder:['Mit Bildern verstehen','exerciseHub'],entdecken:['Animationen und Bewegung','exerciseHub'],schultraining:['Schulaufgaben und Stationen','exerciseHub'],labs:['Musikwerkstatt','exerciseHub'],games:['Musikspiele','exerciseHub'],mini:['Kleine Lernrunde','exerciseHub'],cards:['Meine Merkkarten','exerciseHub'],personal:['Meine Einstellungen','home'],access:['Ansicht einstellen','home'],device:['Gerät und Ton prüfen','home'],backup:['Sicherung und Offline','home']};
function guideLocation(){if(view==='dotted'&&dotTab==='learn')return ['Lernweg: Punktierung','themen'];let m=guideMeta[view]||['Üben','exerciseHub'];if(view==='smart')m=smart?.mode==='check'?['Lerncheck','pruefen']:['Passende Wiederholung','exerciseHub'];return m;}
const guideStageHelp=[
 'Lies die Erklärung und den Merksatz. Klicke danach auf „Weiter: Beispiel anhören“.',
 'Höre das Beispiel. Gehe danach Fujis drei Erklärschritte durch. Dann geht es zur gemeinsamen Aufgabe.',
 'Wähle eine Antwort. Bei Bedarf öffnest du nacheinander die Tipps. Lies anschließend Fujis Begründung.',
 'Löse die Aufgaben nacheinander. Nach jeder Antwort siehst du die richtige Lösung und die Begründung.'
];
const guideTaskHelp={builder:'Wähle eine Taktart und setze Noten oder Pausen in die freie Zeit. Mit „Prüfen“ kontrollierst du die Taktlänge.',detective:'Lies zuerst die Spielregel der gewählten Übung. Höre die Folge an und entscheide dann.',tap:'Höre zuerst vollständig zu. Starte danach das Nachklopfen und tippe bei den Tonanfängen.',rhythm:'Baue aus Brot, Käse und Schokolade einen Worttakt. Jedes ganze Wort füllt einen Viertelschlag.',dotted:'Wähle eine Aufgabe zu punktierten Werten. Der Punkt ergänzt die Hälfte des ursprünglichen Werts.',pieces:'Wähle eine kurze Folge, höre sie an und zähle die Schläge mit. Anschließend kannst du eine Taktlücke lösen.',labs:'Lies den Arbeitsauftrag in der Karte. Stelle die Werte ein, löse die Aufgabe und prüfe dein Ergebnis.'};
function guideDecorate(){
 const main=$('#main');if(!main)return;const [name,group]=guideLocation();
 if(!main.querySelector('.guideTrail')&&view!=='home'&&view!=='lehrkraft'){
  const trail=document.createElement('nav');trail.className='guideTrail';trail.setAttribute('aria-label','Dein Standort');
  trail.innerHTML=`<button data-guide-view="home">Start</button><span aria-hidden="true">/</span>${group!=='home'&&view!==group?`<button data-guide-view="${group}">${({themen:'Themen',exerciseHub:'Üben',pruefen:'Prüfen',documents:'Hefte'})[group]}</button><span aria-hidden="true">/</span>`:''}<span aria-current="page">${name}</span>`;
  main.prepend(trail);trail.querySelectorAll('[data-guide-view]').forEach(b=>b.onclick=()=>setView(b.dataset.guideView));
 }
 if(main.querySelector('.pathLesson')&&!main.querySelector('.simpleStage')){
  const stage=pathState.stages[pathState.index],label=['Erklärung lesen','Beispiel anhören','Gemeinsam üben','Selbst üben'][stage];
  const status=document.createElement('p');status.className='simpleStage';status.innerHTML=`<span>Schritt ${stage+1} von 4</span><strong>${label}</strong>`;
  const stages=main.querySelector('.pathStages'),details=document.createElement('details');details.className='simpleStageSwitch';details.innerHTML='<summary>Zu einem anderen Schritt springen</summary>';stages.before(status);stages.before(details);details.append(stages);
  const extra=document.createElement('details');extra.className='simpleOptional simpleLessonMore';extra.innerHTML='<summary>Weitere Möglichkeiten</summary>';
  const switcher=main.querySelector('.pathTopicSwitch'),bottom=main.querySelector('.pathBottom');extra.append(switcher,bottom);
  const d=MUSIC_PATH[pathState.index],paper=document.createElement('div');paper.className='row';paper.innerHTML=guidePdf('learn',d.key)+guidePdf('work',d.key);extra.append(paper,details);main.querySelectorAll(':scope > .speechPanel,:scope > .row.spaced,:scope > .coachFeedback').forEach(e=>extra.append(e));main.append(extra);
 }
 const extra=main.querySelector('.simpleLessonMore');if(extra)main.querySelectorAll(':scope > .row.spaced,:scope > .speechPanel,:scope > .coachFeedback').forEach(e=>extra.append(e));
 if(guideTaskHelp[view]&&!main.querySelector('.pathLesson')&&!main.querySelector('.guideTaskHelp')){const hint=document.createElement('p');hint.className='guideTaskHelp';hint.textContent=guideTaskHelp[view];const heading=main.querySelector('h1');heading?.after(hint);}
 const soundViews=new Set(['learn','practice','smart','builder','detective','dotted','rhythm','tap','pieces','bilder','entdecken','schultraining','labs','games','mini','cards']);
 $('.audioDock').hidden=!soundViews.has(view);
 document.body.dataset.musicView=view;document.body.classList.toggle('simpleLanding',view==='home'&&!guideRole);document.body.classList.toggle('simpleSound',soundViews.has(view));
 if(typeof enhanceMobile==='function')enhanceMobile();
}
function guideSync(){
 const [,locationGroup]=guideLocation(),group=locationGroup==='documents'?'documents':view==='home'||view==='lehrkraft'?'home':locationGroup==='exerciseHub'?'exerciseHub':locationGroup==='pruefen'?'pruefen':'themen';$$('nav.mainNav button').forEach(b=>{const active=b.dataset.view===group;b.classList.toggle('selected',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');if(b.dataset.view==='home')b.textContent=guideRole==='teacher'?'Unterricht':'Start';if(b.dataset.view==='themen')b.textContent='Lernen';});
 const role=$('#guideTeacherOpen');if(role){role.textContent=guideRole==='teacher'?'Lehrkraft · Wechseln':guideRole==='student'?'Schüler/in · Wechseln':'Einstieg wechseln';role.removeAttribute('aria-pressed');}
 const url=new URL(location.href);if(view==='learn')url.searchParams.set('schritt',MUSIC_PATH[pathState.index].key);else url.searchParams.delete('schritt');if(url.href!==location.href)history.replaceState({musicView:view},'',url.href);
}
for(const route of ['themen','pruefen','lehrkraft'])interfaceRoutes.add(route);
registerView('themen',guideTopicsView);registerView('pruefen',guideChecks);registerView('lehrkraft',guideTeacher);
renderHome=guideHome;renderExerciseHub=guideExerciseHub;
onAfterRender(guideDecorate);onAfterViewChange(guideSync);
// Lokale Render-Aufrufe der Lernschritte verwenden dieselbe Orientierung.
const guidePathBefore=renderPath;
renderPath=function(){guidePathBefore();guideDecorate();guideSync();};renderLearn=renderPath;
const guideDottedBefore=renderDotted;renderDotted=function(){guideDottedBefore();guideDecorate();guideSync();};
$$('nav.mainNav button').forEach(b=>b.onclick=()=>{if(b.dataset.view==='themen')guideTopic=null;setView(b.dataset.view);});
$('.brand').onclick=e=>{e.preventDefault();setView('home');};
on('guideTeacherOpen',()=>{guideRole=null;setView('home');});
on('guideHelpOpen',()=>{setView('home');const help=$('.simpleHelp');if(help){help.open=true;help.scrollIntoView({block:'nearest'});}});
on('guideSettings',()=>setView('personal'));on('guideBackup',()=>setView('backup'));
const guideSound=$('#soundTestTop');if(guideSound){const test=guideSound.onclick;guideSound.onclick=()=>{$('.audioDock').hidden=false;test?.();};}
const guideShowAudio=showAudioControls;showAudioControls=function(open){if(open){$('.audioDock').hidden=false;setDockMinimized(false);}guideShowAudio(open);};
const guideInitialKey=new URLSearchParams(location.search).get('schritt'),guideInitialIndex=guideIndex(guideInitialKey);
if(guideInitialIndex>=0)pathSelect(guideInitialIndex,0);
else if(['#themen','#pruefen','#lehrkraft'].includes(initialAppHash))setView(initialAppHash.slice(1));
else{render();guideSync();}
setDockMinimized(true);
on('simpleMoreExercises',()=>setView('exerciseHub'));on('simpleMoreChecks',()=>setView('pruefen'));on('simpleMoreProgress',()=>setView('progress'));

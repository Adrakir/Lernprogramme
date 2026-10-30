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
let guidePracticeTopic=null; // Nur Ansichtszustand, kein Lernstand; bewusst ohne Speicherung.
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
 const i=guideResumeIndex(),d=MUSIC_PATH[i],total=MUSIC_PATH.length;
 const done=pathState.done.filter(Boolean).length;
 const started=pathState.stages.some(x=>x>0)||done>0,finished=done===total;
 $('#main').innerHTML=`
 <div class="eyebrow">Musik · Klasse 5 · mit Fuji &amp; Minka</div>
 <h1>${finished?'Alle Lernschritte geübt':'Was möchtest du heute machen?'}</h1>
 <p class="guideLead">Du brauchst nur eine Sache auszuwählen. Alle Erklärungen, Aufgaben und Lösungen führen dich Schritt für Schritt.</p>
 <section class="card cleanHero" aria-label="Dein nächster Lernschritt">
  <div class="cleanHeroText">
   <span class="guideTag">${finished?'Zeit zum Wiederholen':'Weiterlernen · Schritt '+(i+1)+' von '+total}</span>
   <h2>${finished?'Prima! Wiederhole jetzt in Ruhe.':escapeText(d.title)}</h2>
   <p>${finished?'Du hast alle Lernschritte bearbeitet. Jetzt kannst du dein Wissen festigen.':escapeText(d.goal)}</p>
   <button id="guideResume" class="primary">${finished?'Wiederholung starten':started?'Diesen Lernschritt fortsetzen':'Mit diesem Lernschritt beginnen'} →</button>
  </div><img src="images/fuji-musiklehrer.webp" width="120" height="120" alt="Fuji begleitet dich durch die Musikaufgaben">
 </section>
 <div class="cleanProgress"><div><strong>Dein Lernweg</strong><span>${done} von ${total} Lernschritten bearbeitet</span></div><progress max="${total}" value="${done}" aria-label="Bearbeitete Lernschritte"></progress></div>
 <h2 class="cleanSection">Oder wähle deinen Weg</h2>
 <div class="cleanActions">
  <button class="cleanAction" id="guideAllTopics"><span aria-hidden="true" class="cleanActionIcon">♫</span><span><strong>Ein Thema lernen</strong><small>Noten, Pausen, Taktarten und mehr</small></span><span aria-hidden="true">→</span></button>
  <button class="cleanAction" id="guideMini"><span aria-hidden="true" class="cleanActionIcon">✎</span><span><strong>3 Aufgaben üben</strong><small>Eine kurze Runde mit Tipps und Lösungen</small></span><span aria-hidden="true">→</span></button>
  <button class="cleanAction" data-guide-view="pruefen"><span aria-hidden="true" class="cleanActionIcon">✓</span><span><strong>Wissen prüfen</strong><small>Lerncheck und Übungstests</small></span><span aria-hidden="true">→</span></button>
 </div>
 <details class="cleanDetails simpleHelp"><summary>Wie lerne ich hier am besten?</summary><ol><li>Öffne eine Erklärung und sieh dir das Notenbild an.</li><li>Höre den Rhythmus und zähle laut mit.</li><li>Übe zuerst gemeinsam mit Fuji und danach selbst.</li><li>Sieh dir nach jeder Antwort den Lösungsweg an.</li></ol><p>Im Bereich <strong>Üben</strong> findest du auch Takte zum Bauen und Hörübungen. Unter <strong>Hefte</strong> kannst du die Lernmaterialien öffnen.</p></details>`;
 guideBindActions();
}
function guideAreaHelp(){return `<dl class="guideDefinitions"><div><dt>Lernen</dt><dd>Erklärungen und vorgemachte Beispiele. Beginne hier, wenn etwas neu oder unklar ist.</dd></div><div><dt>Üben</dt><dd>Aufgaben selbst lösen. Tipps und Begründungen helfen dir dabei.</dd></div><div><dt>Prüfen</dt><dd>Deinen Lernstand einschätzen oder einen Übungstest bearbeiten.</dd></div><div><dt>Hefte</dt><dd>Das Lernheft erklärt. Das Aufgabenheft bietet Übungen und Lösungen zum Ausdrucken.</dd></div></dl>`;}
function guideTopicsView(){
 const topic=guideTopics.find(t=>t.id===guideTopic);
 if(!topic){
  $('#main').innerHTML=`<div class="eyebrow">Lernen · Schritt für Schritt</div><h1>Welches Thema lernst du?</h1>
  <p class="guideLead">Wähle ein Thema aus deinem Musikunterricht. Du bekommst eine verständliche Erklärung, ein Hörbeispiel und passende Aufgaben.</p>
  <div class="cleanTopicGrid">${guideTopics.map((t,i)=>{
   const done=t.keys.filter(k=>pathState.done[guideIndex(k)]).length;
   return `<button class="cleanTopic" data-guide-topic="${t.id}"><img src="images/${t.image}.webp" alt="" width="88" height="70" loading="lazy"><span><strong>${i+1}. ${escapeText(t.title)}</strong><small>${done} von ${t.keys.length} Schritten bearbeitet</small></span><span aria-hidden="true">→</span></button>`;
  }).join('')}</div>`;
 }else{
  const next=topic.keys.find(k=>!pathState.done[guideIndex(k)])||topic.keys[0];
  const d=MUSIC_PATH[guideIndex(next)],done=topic.keys.filter(k=>pathState.done[guideIndex(k)]).length;
  $('#main').innerHTML=`<button id="guideAllTopics" class="subtle">← Alle Themen</button><div class="cleanTopicHead"><img src="images/${topic.image}.webp" alt="" width="100" height="86"><div><div class="eyebrow">Thema · ${done} von ${topic.keys.length} Schritten bearbeitet</div><h1>${escapeText(topic.title)}</h1><p>${escapeText(topic.question)}</p></div></div>
  <section class="card cleanFocus"><span class="guideTag">Dein nächster Lernschritt</span><h2>${escapeText(d.title)}</h2><p>${escapeText(d.goal)}</p><button class="primary" data-guide-lesson="${next}">${pathState.done[guideIndex(next)]?'Noch einmal üben':'Erklärung starten'} →</button></section>
  <h2 class="cleanSection">Alle Schritte dieses Themas</h2>
  <ol class="simpleLessonList cleanLessons">${topic.keys.map((key,j)=>{
   const n=guideIndex(key),s=MUSIC_PATH[n];
   return `<li><button data-guide-lesson="${key}"><span class="simpleNumber">${j+1}</span><span><strong>${escapeText(s.title)}</strong><small>${pathState.done[n]?'✓ Bereits bearbeitet':'Erklärung · Hören · Mitmachen · Üben'}</small></span><span aria-hidden="true">→</span></button></li>`;
  }).join('')}</ol><details class="cleanDetails"><summary>Zu diesem Thema zusätzlich üben</summary><p>Wenn du die Erklärung verstanden hast, kannst du dein Wissen selbst ausprobieren.</p><button data-guide-exercise="${topic.practice}">Passende Übung öffnen</button></details>`;
 }
 guideBindActions();
}
function guideExerciseHub(){
 const groups=exerciseGroups.slice(0,6);
 const names=['Notenwerte','Pausen','Takte','Rhythmus','Punktierte Noten','Noten beschriften'];
 const pictures=['familie','stille','dreiertakt','woerter','punkt','teile'];
 const keys=['viertel','stille','dreiertakt','woerter','punkt','teile'];
 const round=recentRoundView==='practice'&&quiz&&quiz.mode!=='label'&&quiz.index<quiz.questions.length?'practice':smart?.round?'smart':null;
 const selected=Number.isInteger(guidePracticeTopic)&&guidePracticeTopic>=0&&guidePracticeTopic<groups.length?guidePracticeTopic:null;
 const group=selected===null?null:groups[selected];
 $('#main').innerHTML=`<div class="eyebrow">Üben · ohne Zeitdruck</div><h1>Hier kannst du Musik üben</h1><p class="guideLead">Beginne mit einer kurzen Übungsrunde oder wähle ein bestimmtes Thema. Du bekommst Tipps und siehst die richtige Lösung.</p>
 ${round?`<section class="card guideContinue"><p>Du hast noch eine begonnene Runde.</p><button class="primary" data-guide-view="${round}">Begonnene Übung fortsetzen →</button></section>`:''}
 <section class="card cleanQuick"><div><span class="guideTag">Schnell starten</span><h2>3 Fragen mit Fuji</h2><p>Eine kleine Übungsrunde zum Aufwärmen. Du brauchst nichts vorzubereiten.</p></div><button id="guideMini" class="primary">3 Fragen üben →</button></section>
 <div class="guideWorkoutAnchor"></div>
 <h2 class="cleanSection">Ein Thema gezielt üben</h2><p>Tippe auf das Thema, das du im Unterricht gerade behandelst.</p>
 <div class="guideExerciseGrid cleanPracticeGrid" role="group" aria-label="Übungsthema wählen">
 ${groups.map((g,i)=>`<button type="button" class="cleanPracticeChoice ${i===selected?'selected':''}" data-guide-practice="${i}" aria-pressed="${i===selected}"><img src="images/lesson-${pictures[i]}.webp" width="66" height="60" alt="" loading="lazy"><span><strong>${names[i]}</strong><small>${g[2].length} Übungsarten</small></span></button>`).join('')}</div>
 ${group?`<section class="card cleanPracticePanel" id="practicePanel"><span class="guideTag">Du übst: ${names[selected]}</span><h3>Starte mit dieser Übung</h3><p>${group[1]}</p><button class="primary" data-guide-exercise="${group[2][0][0]}">${group[2][0][1]} →</button>
 <div class="cleanPracticeExtras">${group[2].length>1?`<details class="cleanDetails"><summary>Andere Übungen zu diesem Thema</summary><div class="cleanChoiceList">${group[2].slice(1).map(([id,label])=>`<button data-guide-exercise="${id}">${label}</button>`).join('')}</div></details>`:''}<button class="subtle" data-guide-lesson="${keys[selected]}">Erklärung noch einmal ansehen</button></div></section>`:'<p class="cleanPrompt" role="status">Wähle oben eines der sechs Themen aus. Anschließend erscheint die passende Übung.</p>'}
 <details class="card cleanLibrary"><summary>Weitere Spiele, Bilder und besondere Übungen</summary><p>Du musst diese Extras nicht benutzen. Sie helfen, wenn du etwas anders ausprobieren möchtest.</p>
 <div class="cleanExtraGroups">
 <details><summary>Mit Bildern und Animationen verstehen</summary><div class="guideExtraGrid"><div>${Object.entries(discoverTabs).map(([id,label])=>`<button data-guide-discover="${id}">${label.replace(/^\d+ · /,'')}</button>`).join('')}</div><div>${visualStations.map((s,i)=>`<button data-guide-visual="${i}">${escapeText(s.title)}</button>`).join('')}</div></div></details>
 <details><summary>Musikstücke und besondere Schulaufgaben</summary><div class="cleanChoiceList"><button data-guide-school="pyramide">Notenwerte vergleichen</button><button data-guide-school="split">Punktierte Werte zerlegen</button><button data-guide-school="hear">Rhythmen vergleichen</button><button data-guide-school="compose">Eigenes Musikstück bauen</button><button data-guide-school="plan">Stationenplan</button><button id="guideLabs">Weitere Aufgaben in der Musikwerkstatt</button></div></details>
 <details><summary>Spiele und Merkkarten</summary><div class="cleanChoiceList"><button id="guideGames">Sechs Musikspiele auswählen</button><button data-guide-view="cards">Meine Merkkarten (${coachState.cards.length})</button></div></details>
 </div></details>`;
 guideBindActions();
 $$('[data-guide-practice]').forEach(b=>b.onclick=()=>{
  guidePracticeTopic=+b.dataset.guidePractice;
  guideExerciseHub();
  $('#practicePanel')?.scrollIntoView?.({block:'nearest'});
 });
 on('guideLabs',()=>openLab('dictation'));
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

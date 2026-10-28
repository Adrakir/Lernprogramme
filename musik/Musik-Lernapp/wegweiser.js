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
const guideIndex=key=>MUSIC_PATH.findIndex(d=>d.key===key);
const guideTopicFor=key=>guideTopics.find(t=>t.keys.includes(key))||guideTopics[0];
function guideBookItem(book,key){return MUSIC_DOCUMENT_CONTENTS[book].groups.flatMap(g=>g.items).find(item=>item.key===key);}
function guidePdf(book,key,label=null){const item=guideBookItem(book,key),data=MUSIC_DOCUMENT_CONTENTS[book];if(!item)return '';return `<a class="documentLink" href="${data.file}#page=${book==='work'?item.end:item.page}" target="_blank" rel="noopener">${label||data.name+' · S. '+(book==='work'?item.end:item.page)}</a>`;}
function guideResumeIndex(){let i=pathState.index;if(pathState.done[i]){const next=pathState.done.findIndex((done,j)=>j>i&&!done);if(next>=0)i=next;}return i;}
function guideResume(){const index=guideResumeIndex();if(index!==pathState.index)pathSelect(index,0);else{lesson=MUSIC_PATH[index].topic;setView('learn');}}
function guideBindActions(){
 $$('[data-guide-view]').forEach(b=>b.onclick=()=>setView(b.dataset.guideView));
 $$('[data-guide-lesson]').forEach(b=>b.onclick=()=>pathSelect(guideIndex(b.dataset.guideLesson),0));
 $$('[data-guide-topic]').forEach(b=>b.onclick=()=>{guideTopic=b.dataset.guideTopic;setView('themen');});
 $$('[data-guide-exercise]').forEach(b=>b.onclick=()=>openExercise(b.dataset.guideExercise));
 $$('[data-guide-discover]').forEach(b=>b.onclick=()=>openDiscover(b.dataset.guideDiscover));
 $$('[data-guide-visual]').forEach(b=>b.onclick=()=>openVisual(+b.dataset.guideVisual));
 $$('[data-guide-school]').forEach(b=>b.onclick=()=>openSchool(b.dataset.guideSchool));
 on('guideResume',guideResume);on('guideAllTopics',()=>{guideTopic=null;setView('themen');});
 on('guideGames',()=>openGame());on('guideCheck',()=>startSmart('check'));on('guideReview',()=>startSmart('review'));
 on('guideMini',()=>{miniTopic=recommendedTopic();if(coachState.mini?.phase==='finished'){coachState.mini=null;saveCoach();}setView('mini');});
}
function guideHome(){
 const i=guideResumeIndex(),d=MUSIC_PATH[i],done=pathState.done.filter(Boolean).length;
 const started=learning.step>0||pathState.stages.some(x=>x>0)||done>0;
 const profile=window.getRhythmusPersonal?.(),name=profile?.nickname?`, ${escapeText(profile.nickname)}`:'';
 $('#main').innerHTML=`<div class="eyebrow">Musik · Klasse 5</div><h1>${started?'Willkommen zurück':'Hier beginnt dein Musiklernen'}${name}.</h1>
 <p class="guideLead">Neu hier? Starte mit dem Lernweg. Fuji erklärt dir jeden Schritt und zeigt dir danach die passende Aufgabe.</p>
 <section class="card guideNext" aria-labelledby="guideNextTitle"><img src="images/fuji-musiklehrer.webp" width="108" height="108" alt="Fuji begleitet dich beim Lernen"><div><span class="guideTag">${started?'Dein nächster Schritt':'Hier anfangen'} · ungefähr 10–15 Minuten</span><h2 id="guideNextTitle">${i+1}. ${escapeText(d.title)}</h2><p>Lesen → Beispiel hören → gemeinsam üben → selbst üben.</p><button id="guideResume" class="primary">${started?'Lernschritt fortsetzen':'Ersten Lernschritt starten'}</button></div></section>
 <div class="guideProgress"><span>${done} von ${MUSIC_PATH.length} Lernschritten bearbeitet</span><button data-guide-view="progress" class="subtle">Meinen Fortschritt ansehen</button></div>
 <h2 class="guideSectionTitle">Du hast schon einen Auftrag?</h2><div class="guideChoices">
 <article class="card"><h3>Ein bestimmtes Thema lernen</h3><p>Zum Beispiel Notenlinien, Pausen oder punktierte Noten.</p><button id="guideAllTopics">Thema auswählen</button></article>
 <article class="card"><h3>Gelerntes üben</h3><p>Du kennst die Erklärung und möchtest selbst Aufgaben lösen.</p><button data-guide-view="exerciseHub">Übung auswählen</button></article>
 <article class="card"><h3>Mein Wissen prüfen</h3><p>Ein Lerncheck zeigt, was schon klappt und was du noch üben kannst.</p><button data-guide-view="pruefen">Zu den Lernchecks</button></article></div>
 <details class="card guideHelp"><summary>Was finde ich wo?</summary>${guideAreaHelp()}<p>Die Leiste oben bleibt immer gleich. Mit „Start“ kommst du jederzeit hierher zurück.</p></details>`;
 guideBindActions();
}
function guideAreaHelp(){return `<dl class="guideDefinitions"><div><dt>Lernen</dt><dd>Erklärungen und vorgemachte Beispiele. Beginne hier, wenn etwas neu oder unklar ist.</dd></div><div><dt>Üben</dt><dd>Aufgaben selbst lösen. Tipps und Begründungen helfen dir dabei.</dd></div><div><dt>Prüfen</dt><dd>Deinen Lernstand einschätzen oder einen Übungstest bearbeiten.</dd></div><div><dt>Hefte</dt><dd>Das Lernheft erklärt. Das Aufgabenheft bietet Übungen und Lösungen zum Ausdrucken.</dd></div></dl>`;}
function guideTopicsView(){
 const topic=guideTopics.find(t=>t.id===guideTopic);
 if(!topic){
  $('#main').innerHTML=`<div class="eyebrow">Lernen · Erklärungen und Beispiele</div><h1>Welches Thema möchtest du verstehen?</h1><p>Wähle dein Unterrichtsthema. Wenn du neu anfängst, führt dich der Lernweg durch alle Themen.</p><div class="guideIntroActions"><button id="guideResume" class="primary">${pathState.stages.some(x=>x>0)?'Meinen Lernweg fortsetzen':'Mit dem Lernweg beginnen'}</button></div><label class="guideSearch">Thema suchen<input id="guideSearch" type="search" placeholder="Zum Beispiel Notenlinien oder Pausen" autocomplete="off"></label><p id="guideSearchStatus" class="legend" role="status"></p><div class="guideTopicGrid">${guideTopics.map(t=>`<article class="card guideTopic" data-guide-search="${escapeText([t.title,t.question,...t.keys.map(k=>MUSIC_PATH[guideIndex(k)].title)].join(' ').toLocaleLowerCase('de'))}"><img src="images/${t.image}.webp" alt="" width="120" height="80"><div><h2>${t.title}</h2><p>${t.question}</p><button data-guide-topic="${t.id}">Thema öffnen</button></div></article>`).join('')}</div>`;
  const input=$('#guideSearch');input.oninput=()=>{let count=0;const q=input.value.trim().toLocaleLowerCase('de');$$('[data-guide-search]').forEach(card=>{card.hidden=!card.dataset.guideSearch.includes(q);if(!card.hidden)count++;});$('#guideSearchStatus').textContent=q?(count?`${count} passende Themen.`:'Kein Treffer. Versuche „Noten“, „Takt“, „Pausen“ oder „Punkt“.'):'';};
 }else{
  $('#main').innerHTML=`<div class="eyebrow">Lernen · Themenauswahl</div><h1>${topic.title}</h1><p>${topic.question} Wähle einen Lernschritt. Du bekommst eine Erklärung, ein Hörbeispiel und Aufgaben mit Rückmeldung.</p><button id="guideAllTopics" class="subtle">Alle Themen anzeigen</button><ol class="guideLessons">${topic.keys.map(key=>{const i=guideIndex(key),d=MUSIC_PATH[i];return `<li class="card"><div><h2>${escapeText(d.title)}</h2><p>${escapeText(d.goal)}</p><span class="legend">${pathState.done[i]?'✓ Bereits bearbeitet':'Noch offen'} · Erklärung und ${d.questions.length} Aufgaben</span></div><div class="guideLessonActions"><button data-guide-lesson="${key}" class="primary">Lernschritt starten</button>${guidePdf('learn',key)}${guidePdf('work',key)}</div></li>`;}).join('')}</ol><section class="card"><h2>Du hast es verstanden?</h2><p>Dann wähle Aufgaben zu diesem Thema.</p><button data-guide-exercise="${topic.practice}">Passende Übung öffnen</button></section>`;
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
 guideTeacherMode=true;const t=guideTopics.find(t=>t.id===guideTeacherTopic)||guideTopics[0],d=MUSIC_PATH[guideIndex(t.keys[0])],learn=guideBookItem('learn',d.key),work=guideBookItem('work',d.key);
 const assignment=`Musikauftrag: ${t.title}\n1. Öffne den Lernschritt „${d.title}“: ${guideLessonUrl(d.key)}\n2. Lies die Erklärung und höre das Beispiel.\n3. Löse die gemeinsame Aufgabe und die ${d.questions.length-1} eigenen Aufgaben. Nutze bei Bedarf einen Tipp.\n4. Erkläre eine Lösung mit eigenen Worten.\nAuf Papier: Lernheft S. ${learn?.page||''}; Aufgabenheft S. ${work?.end||''}; Lösungen S. ${work?.solution||''}.`;
 $('#main').innerHTML=`<div class="eyebrow">Für Lehrkräfte und Begleitpersonen</div><h1>Eine Stunde planen, einen Auftrag geben</h1><p>Wählen Sie ein Thema. Die Übersicht verbindet Lernweg, Übungen und die passenden Heftseiten.</p><label class="guideSearch">Unterrichtsthema<select id="guideTeacherTopic">${guideTopics.map(x=>`<option value="${x.id}" ${x.id===t.id?'selected':''}>${x.title}</option>`).join('')}</select></label>
 <section class="card guideTeacherPlan"><h2>${t.title}: ein möglicher Ablauf</h2><ol class="guideLessonPlan"><li><strong>Verstehen · ca. 10–15 Minuten</strong><p>Lernziel: ${escapeText(d.goal)} Erst erklären und hören lassen, dann die gemeinsame und die eigenen Aufgaben bearbeiten.</p><button data-guide-lesson="${d.key}" class="primary">Diesen Lernschritt öffnen</button></li><li><strong>Anwenden · ca. 10 Minuten</strong><p>Mit einer passenden Übung festigen. Bei Schwierigkeiten zur Erklärung zurückgehen.</p><button data-guide-exercise="${t.practice}">Passende Übung öffnen</button></li><li><strong>Sichern · ca. 5 Minuten</strong><p>Eine Lösung begründen oder den Rhythmus vorspielen lassen. Den Lerncheck mit allen Themen erst nutzen, wenn diese bereits behandelt wurden.</p><button data-guide-view="pruefen">Kontrollmöglichkeiten ansehen</button></li></ol></section>
 <section class="card guideTeacherMaterials"><h2>Passende Papiermaterialien</h2><p>Das Lernheft erklärt den Inhalt. Das Aufgabenheft bietet Übungen; seine Lösungen stehen im hinteren Teil.</p><div class="row">${guidePdf('learn',d.key)}${guidePdf('work',d.key)}${work?.solution?`<a class="documentLink" href="${MUSIC_DOCUMENT_CONTENTS.work.file}#page=${work.solution}" target="_blank" rel="noopener">Lösungen · S. ${work.solution}</a>`:''}</div><details><summary>Weitere Lernschritte zu diesem Thema</summary><ul>${t.keys.map(k=>`<li><button data-guide-lesson="${k}">${escapeText(MUSIC_PATH[guideIndex(k)].title)}</button> ${guidePdf('learn',k)}</li>`).join('')}</ul></details></section>
 <section class="card guideAssignment"><h2>Arbeitsauftrag für die Lernenden</h2><label for="guideAssignment">Diesen Text können Sie kopieren oder vorlesen.</label><textarea id="guideAssignment" readonly rows="8">${escapeText(assignment)}</textarea><button id="guideCopy">Arbeitsauftrag kopieren</button><p id="guideCopyStatus" class="legend" role="status"></p></section>
 <section class="card"><h2>Fortschritt ansehen</h2><p>Die App speichert Übungen auf dem jeweiligen Gerät und im jeweiligen Browser. Diese Ansicht ist keine Klassenverwaltung. Lernende können ihre eigene Lernstandsübersicht ausdrucken.</p><div class="row"><button data-guide-view="progress">Lernstand dieses Geräts ansehen</button><button data-guide-school="plan">Stationenplan für Einzelarbeit öffnen</button></div></section><button id="guideStudentView">Zur Schüler-Startseite</button>`;
 guideBindActions();$('#guideTeacherTopic').onchange=e=>{guideTeacherTopic=e.target.value;render();};
 on('guideCopy',async()=>{const field=$('#guideAssignment');try{await navigator.clipboard.writeText(field.value);$('#guideCopyStatus').textContent='Der Arbeitsauftrag wurde kopiert.';}catch{field.focus();field.select();$('#guideCopyStatus').textContent='Der Text ist markiert. Wähle auf deinem Gerät „Kopieren“.';}});
 on('guideStudentView',()=>{guideTeacherMode=false;setView('home');});
}
const guideMeta={home:['Start','home'],themen:['Lernen','themen'],learn:['Lernweg','themen'],exerciseHub:['Üben','exerciseHub'],pruefen:['Prüfen','pruefen'],tests:['Übungstest','pruefen'],documents:['Hefte','documents'],contents:['Heftseiten finden','documents'],progress:['Mein Fortschritt','pruefen'],lehrkraft:['Für Lehrkräfte','home'],practice:['Noten und Hörübungen','exerciseHub'],builder:['Einen Takt bauen','exerciseHub'],detective:['Rhythmus-Detektiv','exerciseHub'],dotted:['Punktierte Werte üben','exerciseHub'],rhythm:['Rhythmuswörter','exerciseHub'],tap:['Rhythmus nachklopfen','exerciseHub'],pieces:['Rhythmusstücke','exerciseHub'],bilder:['Mit Bildern verstehen','exerciseHub'],entdecken:['Animationen und Bewegung','exerciseHub'],schultraining:['Schulaufgaben und Stationen','exerciseHub'],labs:['Musikwerkstatt','exerciseHub'],games:['Musikspiele','exerciseHub'],mini:['Kleine Lernrunde','exerciseHub'],cards:['Meine Merkkarten','exerciseHub'],personal:['Meine Einstellungen','home'],access:['Ansicht einstellen','home'],device:['Gerät und Ton prüfen','home'],backup:['Sicherung und Offline','home']};
function guideLocation(){let m=guideMeta[view]||['Üben','exerciseHub'];if(view==='smart')m=smart?.mode==='check'?['Lerncheck','pruefen']:['Passende Wiederholung','exerciseHub'];return m;}
const guideStageHelp=[
 'Lies die Erklärung und den Merksatz. Klicke danach auf „Weiter: Beispiel anhören“.',
 'Höre das Beispiel. Gehe danach Fujis drei Erklärschritte durch. Dann geht es zur gemeinsamen Aufgabe.',
 'Wähle eine Antwort. Bei Bedarf öffnest du nacheinander die Tipps. Lies anschließend Fujis Begründung.',
 'Löse die Aufgaben nacheinander. Nach jeder Antwort siehst du die richtige Lösung und die Begründung.'
];
const guideTaskHelp={builder:'Wähle eine Taktart und setze Noten oder Pausen in die freie Zeit. Mit „Prüfen“ kontrollierst du die Taktlänge.',detective:'Lies zuerst die Spielregel der gewählten Übung. Höre die Folge an und entscheide dann.',tap:'Höre zuerst vollständig zu. Starte danach das Nachklopfen und tippe bei den Tonanfängen.',rhythm:'Baue aus Brot, Käse und Schokolade einen Worttakt. Jedes ganze Wort füllt einen Viertelschlag.',dotted:'Wähle eine Aufgabe zu punktierten Werten. Der Punkt ergänzt die Hälfte des ursprünglichen Werts.',pieces:'Wähle eine kurze Folge, höre sie an und zähle die Schläge mit. Anschließend kannst du eine Taktlücke lösen.',labs:'Lies den Arbeitsauftrag in der Karte. Stelle die Werte ein, löse die Aufgabe und prüfe dein Ergebnis.'};
function guideDecorate(){
 const main=$('#main');if(!main)return;const [name,group]=guideLocation();
 if(!main.querySelector('.guideTrail')&&view!=='home'){
  const trail=document.createElement('nav');trail.className='guideTrail';trail.setAttribute('aria-label','Dein Standort');
  trail.innerHTML=`<button data-guide-view="home">Start</button><span aria-hidden="true">/</span>${group!=='home'&&view!==group?`<button data-guide-view="${group}">${({themen:'Lernen',exerciseHub:'Üben',pruefen:'Prüfen',documents:'Hefte'})[group]}</button><span aria-hidden="true">/</span>`:''}<span aria-current="page">${name}</span>`;
  main.prepend(trail);trail.querySelectorAll('[data-guide-view]').forEach(b=>b.onclick=()=>setView(b.dataset.guideView));
 }
 if(view==='learn'&&!main.querySelector('.guideStepHelp')){
  const stage=pathState.stages[pathState.index],hint=document.createElement('div');hint.className='guideStepHelp';hint.innerHTML=`<strong>Jetzt: ${['Erklärung lesen','Beispiel hören und ansehen','Gemeinsam üben','Selbst üben'][stage]}</strong><p>${guideStageHelp[stage]}</p>`;main.querySelector('.pathLesson')?.prepend(hint);
  const d=MUSIC_PATH[pathState.index],paper=document.createElement('details');paper.className='card guidePaper';paper.innerHTML=`<summary>Passende Heftseiten zu diesem Lernschritt</summary><p>Zum Nachlesen oder Ausdrucken:</p><div class="row">${guidePdf('learn',d.key)}${guidePdf('work',d.key)}</div>`;main.appendChild(paper);
 }
 if(guideTaskHelp[view]&&!main.querySelector('.guideTaskHelp')){const hint=document.createElement('p');hint.className='guideTaskHelp';hint.textContent=guideTaskHelp[view];const heading=main.querySelector('h1');heading?.after(hint);}
 const soundViews=new Set(['learn','practice','smart','builder','detective','dotted','rhythm','tap','pieces','bilder','entdecken','schultraining','labs','games','mini','cards']);
 $('.audioDock').hidden=!soundViews.has(view);
 if(typeof enhanceMobile==='function')enhanceMobile();
}
function guideSync(){
 const [,group]=guideLocation();$$('nav.mainNav button').forEach(b=>{const active=b.dataset.view===group;b.classList.toggle('selected',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 const role=$('#guideTeacherOpen');role?.setAttribute('aria-pressed',String(view==='lehrkraft'));
 const url=new URL(location.href);if(view==='learn')url.searchParams.set('schritt',MUSIC_PATH[pathState.index].key);else url.searchParams.delete('schritt');if(url.href!==location.href)history.replaceState({musicView:view},'',url.href);
}
for(const route of ['themen','pruefen','lehrkraft'])interfaceRoutes.add(route);
registerView('themen',guideTopicsView);registerView('pruefen',guideChecks);registerView('lehrkraft',guideTeacher);
renderHome=guideHome;renderExerciseHub=guideExerciseHub;
onAfterRender(guideDecorate);onAfterViewChange(guideSync);
// Lokale Render-Aufrufe der Lernschritte verwenden dieselbe Orientierung.
const guidePathBefore=renderPath;
renderPath=function(){guidePathBefore();guideDecorate();guideSync();};renderLearn=renderPath;
$$('nav.mainNav button').forEach(b=>b.onclick=()=>{if(b.dataset.view==='themen')guideTopic=null;setView(b.dataset.view);});
on('guideTeacherOpen',()=>setView('lehrkraft'));
on('guideHelpOpen',()=>{setView('home');$('.guideHelp').open=true;$('.guideHelp').scrollIntoView({block:'nearest'});});
on('guideSettings',()=>setView('personal'));on('guideBackup',()=>setView('backup'));
const guideSound=$('#soundTestTop');if(guideSound){const test=guideSound.onclick;guideSound.onclick=()=>{$('.audioDock').hidden=false;test?.();};}
const guideShowAudio=showAudioControls;showAudioControls=function(open){if(open)$('.audioDock').hidden=false;guideShowAudio(open);};
const guideInitialKey=new URLSearchParams(location.search).get('schritt'),guideInitialIndex=guideIndex(guideInitialKey);
if(guideInitialIndex>=0)pathSelect(guideInitialIndex,0);
else if(['#themen','#pruefen','#lehrkraft'].includes(initialAppHash))setView(initialAppHash.slice(1));
else{render();guideSync();}

'use strict';
// Themenwahl für Vokabeltraining; Anwendungsaufgaben bleiben auf die Unit bezogen.
const topicSelect=$('#topic');
topicSelect.innerHTML='<option value="all">Alle Themen</option>'+Object.entries(groupNames).map(([key,label])=>`<option value="${key}">${label}</option>`).join('');
const basePool=getPool;
getPool=function(){const words=basePool();return topicSelect.value==='all'?words:words.filter(v=>learningGroup(v)===topicSelect.value)};
const baseGroup=learningGroup;
learningGroup=function(v){const key=wordIdentity(v.en);if(key==='family')return 'family';if(['blazer','tie','uniform','glue stick','student','class teacher','school','class','classroom','book'].includes(key))return 'school';return baseGroup(v)};
progress=function(){const words=getPool(),n=words.filter(v=>(scores[v.id]?.correct||0)>=2).length;$('#progress-label').textContent='Aktuelle Auswahl · Lernfortschritt';$('#progress-count').textContent=`${n} / ${words.length}`;$('#progress').max=Math.max(1,words.length);$('#progress').value=n;};
const modeHelp={learn:'Starte hier: Wort ansehen, Übersetzung aufdecken und ehrlich einschätzen.',write:'Übersetze selbst. Nach einem Fehler bekommst du einen Hinweis und einen zweiten Versuch.',match:'Wähle nacheinander zwei passende Karten. Ziehen ist nicht nötig.',quiz:'Wähle eine Antwort. Du kannst ohne Zeitlimit üben.',sentence:'Tippe die Wortkarten in der richtigen Reihenfolge an.',case:'Übe Groß- und Kleinschreibung mit kurzen Regeln.',check:'Prüfe bis zu zwölf Wörter und erhalte passende Übungsempfehlungen.',use:'Wende die Wörter in Dialogen, Lückensätzen und Hörgeschichten an.'};
const baseReset=reset;
reset=function(){baseReset();$('#mode-help').textContent=modeHelp[mode]||'';topicSelect.disabled=['case','use'].includes(mode)};
topicSelect.addEventListener('change',()=>{reset();showExercise()});
let roundLength=5;
applicationIntro=function(){const units=selectedUnits().map(u=>u==='welcome'?'Welcome':'Unit 1').join(' und ');shell(`<article class="panel"><h2>Englisch im Alltag</h2><p>Übe mit Wörtern aus ${units}. Die Aufgaben beziehen sich auf die ganze Unit. Der Themenfilter gilt hier nicht.</p><label for="round-length">Aufgaben pro Runde</label><select id="round-length"><option value="5">5 Aufgaben · kurze Runde</option><option value="10">10 Aufgaben</option><option value="999">Alle verfügbaren Aufgaben</option></select><div class="learning-menu">${[['dialogue','Kleine Dialoge'],['gap','Lückensätze'],['listen','Hörgeschichten']].map(([kind,label])=>`<button data-learning="application-${kind}">${label}<small>${taskPool(kind).length} verfügbar</small></button>`).join('')}</div><p class="small-text">Eine Hörgeschichte umfasst drei Fragen. Audio nutzt die englische Gerätestimme; alternativ kannst du den Text lesen.</p></article>`);$('#round-length').value=String(roundLength);$('#round-length').onchange=()=>{roundLength=Number($('#round-length').value)}};
const baseStartApplication=startApplication;
startApplication=function(kind){baseStartApplication(kind);application.items=application.items.slice(0,roundLength);renderApplicationTask();showExercise()};
// Keine Vokabelbeherrschung aus einer reinen Grammatiklücke ableiten (z. B. an/an hour).
const baseTaskWord=taskWord;
taskWord=function(task){const v=baseTaskWord(task);if(task.kind==='gap'&&v&&!task.answers.some(answer=>wordIdentity(answer)===wordIdentity(v.en)))return null;return v};
const baseRecommendations=recommendedWords;
recommendedWords=function(){const previous=$('#scope').value,previousTopic=topicSelect.value;try{if(learningReport?.scope)$('#scope').value=learningReport.scope;topicSelect.value='all';return baseRecommendations()}finally{$('#scope').value=previous;topicSelect.value=previousTopic}};
const baseWriteWithRetry=renderWrite;
renderWrite=function(){baseWriteWithRetry();const board=$('#workspace .image-board');if(pool[pos]?.contextImage&&board)board.remove()};
// Native Bildansicht: Escape schließt, Fokus kehrt zum auslösenden Bild zurück.
const imageDialog=$('#image-dialog');let imageOpener=null;
function openLearningImage(img){imageOpener=img;$('#large-image').src=img.src;$('#large-image').alt=img.alt;imageDialog.showModal()}
document.addEventListener('click',e=>{const img=e.target.closest('#workspace img');if(img)openLearningImage(img);if(e.target.closest('[data-close-image]'))imageDialog.close()});
document.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)&&e.target.matches('#workspace img')){e.preventDefault();openLearningImage(e.target)}});
imageDialog.addEventListener('close',()=>imageOpener?.isConnected&&imageOpener.focus());
imageDialog.addEventListener('click',e=>{if(e.target===imageDialog)imageDialog.close()});
const baseShell=shell;
shell=function(html){baseShell(html);document.querySelectorAll('#workspace img').forEach(img=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Lernbild vergrößern')})};
reset();

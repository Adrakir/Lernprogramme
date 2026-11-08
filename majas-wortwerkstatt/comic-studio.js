(function comicStudioModule(){
"use strict";
const SAVE_KEY="majas-wortwerkstatt-comicstudio-2026-v1";
const questions=[
 {skill:"Gefühle erkennen",panel:7,q:"Warum möchte Melody das Heft zunächst nicht öffnen?",options:["Die vielen Aufgaben wirken auf sie überwältigend.","Sie hat das Heft verloren.","Sie kann das Wort Frosch nicht lesen."],answer:0,why:"Melody sagt, dass sie gar nicht weiß, wo sie anfangen soll. Der Berg von Aufgaben macht ihr Angst.",hint:"Denke an ihre Worte: Wo soll ich anfangen?"},
 {skill:"Hilfreiche Strategie",panel:10,q:"Wie hilft Maja, ohne Melody die Lösung vorzusagen?",options:["Sie beantwortet alle Fragen für Melody.","Sie deckt die anderen Aufgaben ab, damit nur die erste sichtbar bleibt.","Sie sagt, dass Hausaufgaben unwichtig sind."],answer:1,why:"Maja macht den ersten Schritt überschaubar. Melody bleibt selbst verantwortlich.",hint:"Maja benutzt ein Blatt Papier als Abdeckung."},
 {skill:"Textstellen finden",panel:13,q:"Wie findet Melody die Antwort zur Frage nach dem Frosch?",options:["Sie rät schnell.","Sie wartet, dass Bärli ihr die Antwort gibt.","Sie sucht die passende Textstelle und liest sie genau."],answer:2,why:"Sie zeigt selbst auf die Textstelle mit dem Hinweis unter einem Blatt.",hint:"Was zeigt Melody mit ihrem Finger?"},
 {skill:"Wörtliche Rede",panel:12,q:"Welcher Satz ist richtig geschrieben?",options:["Maja sagte „Lies die erste Frage.“","Maja sagte: „Lies die erste Frage.“","Maja sagte: Lies die erste Frage."],answer:1,why:"Nach dem Begleitsatz steht ein Doppelpunkt, die Rede steht in Anführungszeichen.",hint:"Prüfe Doppelpunkt, Anführungszeichen und Satzzeichen."},
 {skill:"Passende Verben",panel:14,q:"Welches Verb passt zur Freude über die erste gelöste Aufgabe?",options:["Melody jubelte.","Melody flüsterte traurig.","Melody schluchzte."],answer:0,why:"Jubeln zeigt die Freude über einen Erfolg. Ein genaues Verb macht die Szene lebendig.",hint:"Welches Verb zeigt Begeisterung?"},
 {skill:"Reihenfolge",panel:17,q:"Welche Reihenfolge passt zum Comic?",options:["Erfolg – anfangen – Aufgabe abdecken","Aufgaben abdecken – Textstelle suchen – erste Antwort schreiben","Heft schließen – alle Antworten abschreiben – Seilspringen"],answer:1,why:"Maja vereinfacht die Aufgabe. Melody sucht einen Beleg und schreibt selbst.",hint:"Was passiert zuerst, danach und schließlich?"},
 {skill:"Präteritum",panel:18,q:"Welcher Satz steht im Präteritum?",options:["Melody schreibt die Antwort.","Melody wird die Antwort schreiben.","Melody schrieb die Antwort."],answer:2,why:"Die Vergangenheitsform von schreiben heißt schrieb.",hint:"Erzählungen über vergangene Ereignisse stehen häufig im Präteritum."},
 {skill:"Schlussfolgerung",panel:21,q:"Woran erkennt man, dass Melody nun selbstständiger arbeitet?",options:["Sie lässt die zweite Aufgabe aus.","Sie bearbeitet die nächste Frage allein und kennzeichnet eine schwierige Stelle.","Maja schreibt den Rest in ihr Heft."],answer:1,why:"Melody löst die zweite Aufgabe selbst und markiert die Stelle, bei der sie Hilfe braucht.",hint:"Suche nach einer Handlung, die Melody ohne Majas Hilfe schafft."}
];
const scenes=[4,7,10,12,13,16,20,23];
const steps=[
 ["Einleitung","Wo ist Melody? Wie sieht das Zimmer aus? Wer ist dabei?","Am Nachmittag saß Melody am Küchentisch. ..."],
 ["Problem","Was möchte Melody lieber tun? Was bereitet ihr Sorgen?","Plötzlich ..."],
 ["Schlinge","Welche Frage macht neugierig und führt zum Hauptteil?","Doch da bemerkte sie ..."],
 ["Hauptteil","Was tun Maja und Bärli? Welche Gefühle und Gedanken hat Melody?","Zuerst ... Danach ..."],
 ["Höhepunkt","Welche wichtige Entdeckung macht Melody? Was sagt sie?","Auf einmal ..."],
 ["Schluss","Wie geht die Geschichte zu Ende? Was hat Melody gelernt?","Schließlich ..."]
];
const ec=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function store(){try{const d=JSON.parse(localStorage.getItem(SAVE_KEY)||"{}");return d&&typeof d==="object"&&!Array.isArray(d)?d:{};}catch{return {};}}
function persist(d){try{localStorage.setItem(SAVE_KEY,JSON.stringify(d));return true;}catch{return false;}}
function header(title,sub){
 return `<div class="route">${homeLink()}<div class="unit-head lilac"><span class="icon-box">${icon("book")}</span><div><p class="kicker">Maja, Melody und Bärli · Comicwerkstatt</p><h1 tabindex="-1">${ec(title)}</h1><p>${ec(sub)}</p></div></div>`;
}
function art(panel){
 const episode=detectiveEpisodes.find(x=>x.id==="melody-und-die-hausaufgaben");
 return `<div class="cs-art" role="img" aria-label="${ec(episode.panels[panel][2])}" ${detectiveArt(episode,panel)}></div>`;
}
function lead(){
 app.innerHTML=header("Werde Comic-Regisseurin!","Erst Bilder verstehen, dann selbst Dialoge und Geschichten entwickeln.")+
 `<section class="panel cs-hero"><div><h2>Melody und die Hausaufgaben</h2><div class="cs-real-audio"><strong>🎧 Maja: neue KI-Sprachaufnahme</strong><audio controls preload="none" src="./audio/maja-melody.mp3" aria-label="Maja ermutigt Melody mit ihrer aufgenommenen Stimme"></audio><p>„Melody, wir schaffen das. Erst die erste Frage!“</p></div><p>Maja, Melody und Bärli erleben, wie aus einem riesigen Aufgabenberg kleine Schritte werden. Du lernst dabei Lesestrategien, wörtliche Rede, Gefühle und das Präteritum.</p><div class="actions"><a class="primary" href="#comicstudio/lernen">Geführt lernen</a><a class="secondary" href="#comicstudio/test">Mein Wissen prüfen</a><a class="secondary" href="#comicstudio/schreiben">Eigene Geschichte</a><a class="secondary" href="#comicstudio/sprechblasen">Sprechblasen-Werkstatt</a></div></div>${art(13)}</section>
 <section class="panel"><h2>Meine Comic-Tipps</h2><p>1. Schau zuerst genau auf das Bild. 2. Lies die Sprechblasen. 3. Überlege, wie die Figur sich fühlt. 4. Begründe deine Antwort mit einem Hinweis.</p><div class="actions"><a href="#tagescomic/melody-und-die-hausaufgaben/1" class="secondary">Ganzen Originalcomic lesen</a><a href="#comicstudio/toncheck" class="secondary">Ton testen</a></div></section></div>`;
}
let cleanup=null;
function stop(){cleanup?.();cleanup=null;try{window.speechSynthesis?.cancel();}catch{}}
function showTest(mode){
 const guided=mode==="lernen",qList=questions,save=store(),past=save["quiz:"+mode]||null;
 let n=0,answers=[],shownHint=false,locked=false;
 app.innerHTML=header(guided?"Comic-Detektivtraining":"Comic-Abschlusstest",guided?"Mit Tipps, Erklärungen und ohne Zeitdruck.":"Acht Aufgaben ohne Hilfen. Die Lösungen siehst du erst am Ende.")+
 `<div class="cs-quiz-controls"><div class="cs-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${qList.length}" aria-valuenow="0" aria-label="Bearbeitete Fragen"><span></span></div><p id="cs-counter" aria-live="polite">Aufgabe 1 von ${qList.length}</p></div>
 <section class="panel cs-question" id="cs-quiz"></section><section class="panel" id="cs-result" hidden></section></div>`;
 const area=document.querySelector("#cs-quiz"),result=document.querySelector("#cs-result"),progress=document.querySelector(".cs-progress"),counter=document.querySelector("#cs-counter");
 function finish(){
  area.hidden=true;result.hidden=false;const got=answers.filter(a=>a.correct).length,pct=Math.round(100*got/qList.length);
  const s=store();s["quiz:"+mode]={at:new Date().toISOString(),score:got,answers:answers.map(a=>({selected:a.selected,correct:a.correct}))};persist(s);
  result.innerHTML=`<h2 tabindex="-1">${guided?"Das hast du geübt":"Dein Ergebnis"}</h2><p class="cs-score">${got} von ${qList.length} richtig – ${pct} %</p><p>${pct>=80?"Du hast gut aufgepasst! Jetzt kannst du selbst eine Geschichte schreiben.":"Du weißt schon einiges! Schau dir die Erklärungen an und übe die schwierigen Stellen noch einmal."}</p><div id="cs-fireworks"></div><ol class="cs-review">${answers.map((a,i)=>`<li><strong>${ec(qList[i].q)}</strong><p>${a.correct?"✓ Richtig":"Noch üben"} · Deine Antwort: ${ec(qList[i].options[a.selected])}</p><p>Richtig: ${ec(qList[i].options[qList[i].answer])}</p><p>${ec(qList[i].why)}</p></li>`).join("")}</ol><div class="actions"><a class="primary" href="#comicstudio/lernen">Mit Hilfen wiederholen</a><a class="secondary" href="#comicstudio/schreiben">Meine Geschichte schreiben</a><a class="secondary" href="#comicstudio">Zur Übersicht</a></div>`;
  if(!guided&&pct>=80&&typeof prepFireworks==="function"){cleanup=prepFireworks(document.querySelector("#cs-fireworks"));}
  result.querySelector("h2")?.focus();
 }
 function draw(){
  if(n>=qList.length){finish();return;}
  const q=qList[n];shownHint=false;locked=false;area.hidden=false;
  progress.setAttribute("aria-valuenow",n);progress.firstElementChild.style.width=(n/qList.length*100)+"%";
  counter.textContent=`Aufgabe ${n+1} von ${qList.length}`;
  area.innerHTML=`<div class="cs-question-layout"><div><p class="kicker">${ec(q.skill)}</p><h2>${ec(q.q)}</h2><div class="cs-options">${q.options.map((option,i)=>`<button type="button" class="cs-option" data-answer="${i}">${ec(option)}</button>`).join("")}</div><div class="actions">${guided?'<button type="button" class="secondary" id="cs-hint">Tipp von Bärli</button>':''}</div><p id="cs-feedback" role="status"></p><button type="button" class="primary" id="cs-next" hidden>Weiter</button></div><div class="cs-panel-img">${art(q.panel)}<button class="secondary cs-zoom" type="button">Bild vergrößern</button></div></div>`;
  const feedback=area.querySelector("#cs-feedback"),next=area.querySelector("#cs-next");
  if(guided)area.querySelector("#cs-hint").onclick=()=>{shownHint=true;feedback.textContent=q.hint;};
  area.querySelectorAll("[data-answer]").forEach(btn=>btn.onclick=()=>{
    if(locked)return;locked=true;
    const selected=Number(btn.dataset.answer),correct=selected===q.answer;
    answers.push({selected,correct,usedHint:shownHint});
    for(const choice of area.querySelectorAll("[data-answer]")){
      choice.disabled=true;choice.classList.toggle("cs-right",Number(choice.dataset.answer)===q.answer);
      choice.classList.toggle("cs-wrong",Number(choice.dataset.answer)===selected&&!correct);
    }
    feedback.textContent=guided?(correct?"Richtig! ":"Nicht ganz. ")+q.why:"Antwort gespeichert. Die Auswertung kommt am Ende.";
    next.hidden=false;next.focus();
  });
  next.onclick=()=>{n++;draw();};
  area.querySelector(".cs-zoom").onclick=()=>zoom(area.querySelector(".cs-art"));
 }
 draw();
}
function zoom(el){
 if(!el)return;
 const dialog=document.createElement("dialog");dialog.className="cs-dialog";dialog.innerHTML='<div class="cs-dialog-bar"><strong>Bild vergrößert</strong><button type="button" class="secondary">Schließen</button></div>';
 const copy=el.cloneNode(true);dialog.appendChild(copy);document.body.appendChild(dialog);
 dialog.querySelector("button").onclick=()=>dialog.close();
 dialog.onclose=()=>dialog.remove();
 dialog.onclick=e=>{if(e.target===dialog)dialog.close();};
 try{dialog.showModal();}catch{dialog.setAttribute("open","");}
}
function writing(){
 const saved=store(),story=saved.story||{};
 app.innerHTML=header("Meine eigene Comicgeschichte","Entwickle aus sechs Bausteinen eine spannende Erzählung im Präteritum.")+
 `<section class="panel cs-writing-hero"><h2>Dein Schreibplan</h2><p>Schau die Comicbilder an. Schreibe deine eigene Version. Maja, Melody und Bärli dürfen etwas Neues erleben.</p><p class="subtle">Dein Text wird nur in diesem Browser gespeichert. Du kannst ihn später ausdrucken oder als Textdatei sichern.</p></section>
 ${steps.map(([title,question,example],i)=>`<section class="panel cs-story-step"><div class="cs-step-heading"><h2>${i+1}. ${ec(title)}</h2><span>${i===2?"Neugier wecken":i===4?"Spannung am größten":"Erzählbaustein"}</span></div><p>${ec(question)}</p>${i<4?art(scenes[i]):""}<label class="field" for="cs-story-${i}">Meine Sätze</label><textarea class="answer cs-writing-field" id="cs-story-${i}" rows="4" placeholder="${ec(example)}" data-story-step="${i}">${ec(story[i]||"")}</textarea><details><summary>Schreibhilfe</summary><p>${ec(["Beschreibe Ort, Zeit und Figuren. Beginne neugierig machend.","Nutze Gefühle: unsicher, ratlos, mutlos. Was dachte Melody?","Stelle eine spannende Frage. Verrate noch nicht alles.","Benutze Zuerst, Danach, Plötzlich und abwechslungsreiche Verben.","Zeige, was sich verändert. Wie reagiert Melody?","Schließe die Handlung sinnvoll ab und zeige, was die Figuren gelernt haben."][i])}</p></details></section>`).join("")}
 <section class="panel"><h2>Meine Checkliste</h2><p>Kreuze an, was du in deiner Geschichte geprüft hast.</p><div class="cs-checklist">${["Ich habe eine Einleitung, einen Hauptteil und einen Schluss.","Ich habe eine spannende Schlinge eingebaut.","Ich benutze verschiedene Satzanfänge und passende Verben.","Ich erzähle im Präteritum.","Ich habe Gefühle, Gedanken und wörtliche Rede eingebaut.","Ich habe meine Geschichte noch einmal gelesen und korrigiert."].map((label,i)=>`<label><input type="checkbox" data-review="${i}" ${saved.reviews?.[i]?"checked":""}> ${label}</label>`).join("")}</div><div class="actions"><button class="primary" type="button" id="cs-print">Als Geschichte drucken</button><button class="secondary" type="button" id="cs-export">Textdatei sichern</button><button class="secondary" type="button" id="cs-speak">Meine Geschichte hören</button></div><p id="cs-writing-status" role="status" aria-live="polite"></p></section></div>`;
 const fields=Array.from(app.querySelectorAll("[data-story-step]")),status=app.querySelector("#cs-writing-status");
 function update(){
  const d=store();d.story=Object.fromEntries(fields.map(x=>[x.dataset.storyStep,x.value]));d.reviews=Array.from(app.querySelectorAll("[data-review]")).map(x=>x.checked);persist(d);
  status.textContent="Dein Entwurf ist auf diesem Gerät gespeichert.";
 }
 fields.forEach(f=>f.oninput=update);
 app.querySelectorAll("[data-review]").forEach(f=>f.onchange=update);
 const storyText=()=>steps.map(([name],i)=>fields[i].value.trim()).filter(Boolean).join("\n\n");
 app.querySelector("#cs-print").onclick=()=>{
  const value=storyText();if(!value){status.textContent="Schreibe zuerst einige Sätze.";return;}
  const print=window.open("","_blank");
  if(!print){status.textContent="Bitte erlaube Druckfenster im Browser oder sichere die Textdatei.";return;}
  print.document.write('<!doctype html><html lang="de"><meta charset="utf-8"><title>Meine Comicgeschichte</title><style>body{font:18px/1.65 Georgia,serif;max-width:750px;margin:45px auto;padding:0 24px}h1{font-family:Arial,sans-serif}p{white-space:pre-wrap} @media print{body{margin:12mm auto}}</style><h1>Meine Comicgeschichte</h1><p>'+ec(value)+'</p></html>');
  print.document.close();print.focus();print.print();
 };
 app.querySelector("#cs-export").onclick=()=>{
  const value=storyText();if(!value){status.textContent="Schreibe zuerst einige Sätze.";return;}
  const blob=new Blob(["Meine Comicgeschichte\n\n"+value],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.download="majas-comicgeschichte.txt";a.href=url;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 app.querySelector("#cs-speak").onclick=()=>{
  const value=storyText();if(!value){status.textContent="Schreibe zuerst einige Sätze.";return;}
  if(!window.SpeechSynthesisUtterance||!window.speechSynthesis){status.textContent="Vorlesen ist auf diesem Gerät nicht verfügbar.";return;}
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(value.slice(0,3500));utterance.lang="de-DE";utterance.rate=.87;
  const voices=window.speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith("de"));if(voices.length)utterance.voice=voices[0];
  utterance.onerror=()=>status.textContent="Vorlesen war nicht möglich. Deinen Text kannst du weiterhin lesen und sichern.";
  window.speechSynthesis.speak(utterance);status.textContent="Deine Geschichte wird vorgelesen. Zum Stoppen wechsle den Bereich.";
 };
}
function soundcheck(){
 app.innerHTML=header("Tonprobe vor dem Hörtest","Prüfe die Lautstärke und die Aufnahme, bevor du mit den Hörfragen beginnst.")+
 `<section class="panel"><h2>1. Hörgeschichte ausprobieren</h2><p>Starte die Aufnahme. Benutze Kopfhörer, wenn es um dich herum laut ist. Du kannst das Tempo reduzieren, ohne dass die Geschichte verändert wird.</p><audio id="cs-audio-check" src="./anna-audio/der-kiesel-im-schuh.mp3" preload="metadata" controls></audio><p id="cs-audio-status" role="status">Ton noch nicht gestartet.</p><label for="cs-audio-speed" class="field">Sprechtempo</label><select id="cs-audio-speed"><option value=".85">Langsam</option><option value="1" selected>Normal</option></select></section>
 <section class="panel"><h2>2. Unsere neuen Stimmen ausprobieren</h2><div class="maja-voice-grid"><div><strong>Bärli (5 Sekunden)</strong><audio controls preload="none" src="./audio/baerli-intro.mp3" aria-label="Bärlis Mutmacher"></audio></div><div><strong>Maja (4 Sekunden)</strong><audio controls preload="none" src="./audio/maja-melody.mp3" aria-label="Majas Zuspruch"></audio></div></div><p class="subtle">Diese kurzen MP3-Dateien wurden mit zwei deutschen KI-Stimmen erzeugt und lokal gespeichert. Die längeren Hörgeschichten bleiben unverändert.</p></section><section class="panel"><h2>3. Alles gut verständlich?</h2><div class="actions"><button class="primary" id="cs-heard">Ja, ich höre alles</button><button class="secondary" id="cs-not-heard">Nein, ich brauche Hilfe</button></div><div id="cs-audio-help" class="tip" hidden><p>Prüfe die Lautstärketasten, ob dein Gerät stummgeschaltet ist und ob Kopfhörer verbunden sind. Tippe auf ▶ im Audioplayer. Falls die Datei nicht lädt, kannst du die markierte Lesehilfe benutzen – das zählt nicht als reiner Hörtest.</p></div><div class="actions"><a href="#pruefung/hoeren/gefuehrt/1" class="primary">Geführtes Hörtraining</a><a href="#pruefung/hoeren/test/1" class="secondary">Zum Hör-Abschlusstest</a></div></section></div>`;
 const audio=app.querySelector("#cs-audio-check"),message=app.querySelector("#cs-audio-status");
 app.querySelector("#cs-audio-speed").onchange=e=>audio.playbackRate=Number(e.target.value);
 audio.onplaying=()=>message.textContent="Audio läuft.";
 audio.onended=()=>message.textContent="Audio zu Ende gehört.";
 audio.onerror=()=>message.textContent="Die Audiodatei konnte nicht geladen werden. Prüfe die Verbindung und nutze die Lesehilfe.";
 app.querySelector("#cs-heard").onclick=()=>message.textContent="Gut! Jetzt kannst du den Hörtest starten.";
 app.querySelector("#cs-not-heard").onclick=()=>app.querySelector("#cs-audio-help").hidden=false;
}
function render(page){
 stop();
 if(page==="lernen"||page==="test")showTest(page);
 else if(page==="schreiben")writing();
 else if(page==="toncheck")soundcheck();
 else if(page==="sprechblasen")window.MajaSpeechBubbles?.render();
 else lead();
}
window.MajaComicStudio={render,stop,questions,steps};
})();
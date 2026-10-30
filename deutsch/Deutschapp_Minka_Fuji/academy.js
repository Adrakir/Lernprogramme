'use strict';
/* Ergänzungen im bestehenden Erzählstudio, bewusst ohne Server oder KI-Benotung. */
window.MF_ACADEMY=(()=>{
 const D=window.MF_ACADEMY_DATA,ST='mf-deutsch-akademie-v1';
 if(!D)return null;
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const k0=()=>({diagnostic:{answers:{},submitted:false},repairId:'r01',repairs:{},writerVersions:{},writerSelected:{},diagnosticRuns:0,challenge:0,settings:{font:1,contrast:false,speed:0.88,voice:''}});
 let state=k0(),storeOK=true;
 try{
  const saved=JSON.parse(localStorage.getItem(ST)||'null');
  if(saved&&typeof saved==='object'){
   state={...k0(),...saved,
    diagnostic:{...k0().diagnostic,...(saved.diagnostic||{}),answers:{...(saved.diagnostic?.answers||{})}},
    repairs:saved.repairs&&typeof saved.repairs==='object'?saved.repairs:{},
    writerVersions:saved.writerVersions&&typeof saved.writerVersions==='object'?saved.writerVersions:{},
    writerSelected:saved.writerSelected&&typeof saved.writerSelected==='object'?saved.writerSelected:{},
    settings:{...k0().settings,...(saved.settings||{})}};
  }
 }catch{storeOK=false;}
 const save=()=>{try{localStorage.setItem(ST,JSON.stringify(state));storeOK=true;}catch{storeOK=false;}};
 const rdata=()=>D.repairs.find(x=>x.id===state.repairId)||D.repairs[0];
 const rstate=()=>state.repairs[state.repairId]||(state.repairs[state.repairId]={text:'',hints:0,versions:[],checks:[],revealed:false});
 const words=t=>String(t||'').trim().split(/\s+/).filter(Boolean);
 const skill=id=>D.skills.find(x=>x.id===id)||D.skills[0];
 const counts=()=>D.skills.map(s=>{
  const questions=D.diagnostics.filter(x=>x.skill===s.id);
  return {...s,total:questions.length,correct:questions.filter(q=>state.diagnostic.answers[q.id]===q.right).length};
 });
 const resultTable=()=>{
  const scores=counts(),needs=scores.filter(x=>x.correct<2);
  return '<div class="ac-score"><h3>Deine Orientierung</h3><p>'+scores.reduce((n,x)=>n+x.correct,0)+' von '+D.diagnostics.length+' Antworten passend. <strong>Das ist keine Bewertung deiner Schreibfähigkeit.</strong> Eine gute Erzählung kannst du nur durch eigenes Schreiben zeigen.</p>'+
   '<div class="ac-skills">'+scores.map(x=>'<div class="ac-skill"><strong>'+esc(x.name)+'</strong><progress max="'+x.total+'" value="'+x.correct+'"></progress><span>'+x.correct+' von '+x.total+' erkannt</span><p>'+esc(x.tip)+'</p>'+routeButton('Passend üben',x.target)+'</div>').join('')+'</div>'+
   '<h3>Dein nächster Lernschritt</h3>'+(needs.length?'<p>Starte mit <strong>'+esc(needs[0].name)+'</strong>. Danach übe diese Bereiche:</p><p>'+needs.map(x=>esc(x.name)).join(' · ')+'</p>':'<p>Alle Auswahlaufgaben wurden passend beantwortet. Versuche nun, selbst einen anspruchsvollen Hauptteil zu schreiben oder einen fremden Text zu überarbeiten.</p>')+
   '<div class="ac-controls"><button type="button" class="primary" data-ac-view="repair">Reparaturwerkstatt öffnen</button><button type="button" class="secondary" data-ac-view="writer">Eigene Geschichte schreiben</button></div></div>';
 };
 function routeButton(label,target){return ['writer','lab','exam','repair','coach'].includes(target)?
  '<button type="button" class="secondary" data-ac-view="'+target+'">'+esc(label)+'</button>':
  '<button type="button" class="secondary" data-ac-route="'+target+'">'+esc(label)+'</button>';}
 function coach(){
  const a=state.diagnostic.answers,number=Object.keys(a).filter(k=>Number.isInteger(a[k])).length;
  const completed=state.diagnostic.submitted;
  return '<div class="ac-intro"><p class="eyebrow">Dein persönlicher Schreibcoach</p><h2>Was kannst du schon – und was übst du als Nächstes?</h2><p>Hier beantwortest du zwölf kurze Orientierungsfragen zu sechs Bereichen. Für jede Frage gibt es eine passende Begründung. Danach schlägt Fuji Übungen vor. Das ist kein benoteter Test.</p></div>'+
  '<div class="ac-progress"><strong>'+number+' von '+D.diagnostics.length+' Fragen beantwortet</strong><progress value="'+number+'" max="'+D.diagnostics.length+'"></progress></div>'+
  '<div class="ac-question-list">'+D.diagnostics.map((q,i)=>'<fieldset class="ac-question"><legend><span class="ac-count">'+(i+1)+'</span> '+esc(q.q)+'</legend><p class="ac-skill-label">'+esc(skill(q.skill).name)+'</p>'+
    q.options.map((o,j)=>'<label><input type="radio" name="ac-q-'+q.id+'" value="'+j+'" data-ac-answer="'+q.id+'" '+(a[q.id]===j?'checked':'')+(completed?' disabled':'')+'><span>'+esc(o)+'</span></label>').join('')+
    (completed?'<div class="ac-explain '+(a[q.id]===q.right?'correct':'review')+'"><strong>'+(a[q.id]===q.right?'Passend erkannt':'Noch einmal üben')+'</strong><p>'+esc(q.why)+'</p></div>':'')+'</fieldset>').join('')+'</div>'+
  (!completed?'<button type="button" class="primary" data-ac-submit '+(number<12?'disabled':'')+'>Auswerten und Übungen empfehlen</button><p class="muted">Beantworte alle zwölf Fragen. Deine Auswahl bleibt auf diesem Gerät gespeichert.</p>':
   resultTable()+'<button type="button" class="secondary" data-ac-redo>Neue Diagnose beginnen</button>')+
   '<details class="ac-glossary"><summary>Wichtige Fachwörter kurz erklären</summary><dl>'+D.glossary.map(x=>'<dt>'+esc(x[0])+'</dt><dd>'+esc(x[1])+'</dd>').join('')+'</dl></details>';
 }
 function selfCheck(l){
   const checklist=['Mein Text hat eine klare Ursache und eine nachvollziehbare Folge.','Ich zeige passende Gedanken oder Gefühle und genaue Handlungen.','Die wichtigste Stelle ist anschaulich; Zeitform und Perspektive stimmen.'];
   return '<div class="ac-checks">'+checklist.map((x,i)=>'<label><input type="checkbox" data-ac-self="'+i+'" '+(l.checks?.[i]?'checked':'')+'><span>'+esc(x)+'</span></label>').join('')+'</div>'+
    '<p class="muted" id="ac-self-status">'+(l.checks||[]).filter(Boolean).length+' von 3 Kriterien selbst überprüft. Die App vergibt für deinen freien Text keine Note.</p>';
 }
 const stamp=()=>{try{return new Date().toLocaleString('de-DE')}catch{return 'Gespeicherte Fassung'}};
 function repair(){
  const p=rdata(),r=rstate();r.versions=Array.isArray(r.versions)?r.versions:[];
  return '<div class="ac-intro"><p class="eyebrow">Geschichten-Reparaturwerkstatt</p><h2>Schwache Geschichten besser machen</h2><p>Du findest einen Fehler, holst dir bei Bedarf drei gestufte Hilfen und schreibst dann eine eigene verbesserte Fassung. Mit der Versionslupe kannst du sehen, was du verändert hast.</p></div>'+
    '<div class="ac-repair-switch"><label for="ac-repair-pick"><strong>Geschichte auswählen</strong></label><select id="ac-repair-pick">'+D.repairs.map(x=>'<option value="'+x.id+'" '+(x.id===p.id?'selected':'')+'>'+esc(x.title)+' · Stufe '+x.level+'</option>').join('')+'</select></div>'+
    '<div class="ac-repair-card"><div class="ac-repair-icon" aria-hidden="true">'+p.hero+'</div><div><p class="eyebrow">Stufe '+p.level+' · '+esc(skill(p.skill).name)+'</p><h3>'+esc(p.title)+'</h3><p><strong>Das Problem:</strong> '+esc(p.problem)+'</p></div></div>'+
    '<div class="ac-compare-grid"><section class="panel ac-example-weak"><p class="eyebrow">Vorher – so ist der Text noch schwach</p><p>'+esc(p.weak)+'</p></section>'+
    '<section class="panel"><p class="eyebrow">Deine Aufgabe</p><p>'+esc(p.prompt)+'</p><p><strong>Fuji fragt:</strong> Was genau muss der Leser verstehen oder fühlen?</p></section></div>'+
    '<section class="panel ac-scaffold"><h3>Gemeinsam verbessern</h3><p>Schau zunächst, welche Bausteine nützlich wären. Tippe auf die Karten, um ihren Zweck zu sehen.</p>'+
    '<div class="ac-pieces">'+p.pieces.map((q,i)=>'<button type="button" data-ac-piece="'+i+'" aria-expanded="false"><span>'+esc(q[0])+'</span><small>Erklärung ansehen</small></button>').join('')+'</div><p class="ac-piece-feedback" id="ac-piece-feedback" role="status">Jeder Baustein kann dir beim Überarbeiten helfen. Du darfst auch eigene Formulierungen verwenden.</p>'+
    '<div class="ac-controls"><button type="button" class="secondary" data-ac-hint '+(r.hints>=3?'disabled':'')+'>Nächster Hinweis ('+r.hints+'/3)</button></div>'+
    (r.hints?'<ol class="ac-hints">'+p.steps.slice(0,r.hints).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>':'')+'</section>'+
    '<section class="panel"><h3>Deine verbesserte Fassung</h3><label for="ac-repair-text">Schreibe deine Geschichte mit eigenen Worten. Andere sinnvolle Lösungen sind möglich.</label>'+
    '<textarea id="ac-repair-text" rows="9" maxlength="12000" placeholder="Dein neuer Text …">'+esc(r.text||'')+'</textarea><p id="ac-word-count" class="muted">'+words(r.text).length+' Wörter</p>'+
    '<div class="ac-controls"><button type="button" class="primary" data-ac-save-repair '+(!String(r.text||'').trim()?'disabled':'')+'>Diese Fassung speichern</button>'+
    '<button type="button" class="secondary" data-ac-read="repair">Meinen Text vorlesen</button></div>'+
    '<details class="ac-model"><summary>Erklärte Musterlösung aufklappen</summary><blockquote>'+esc(p.model)+'</blockquote><ol>'+p.steps.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol><p>Vergleiche die Wirkung und den Aufbau, nicht einzelne Wörter. Die Musterlösung ist nur ein Beispiel.</p></details>'+
    '<h3>Schreibkonferenz mit Minka</h3>'+selfCheck(r)+'</section>'+
    versionPanel(r.versions,'repair')+
    '<div class="ac-controls"><button type="button" class="secondary" data-ac-download-repair>Meinen Text als TXT sichern</button>'+routeButton('Weiter: Hauptteil-Werkstatt','hauptteil')+'</div>';
 }
 function versionPanel(arr,type){
  const entries=arr.slice(-7);
  const left=entries.length>=2?entries[entries.length-2]:null,right=entries.length?entries[entries.length-1]:null;
  return '<section class="panel ac-version-panel"><h3>Versionslupe · Vorher und nachher</h3><p>Speichere eine Fassung, ändere den Text und speichere erneut. Deine letzten sieben Versionen bleiben in diesem Browser erhalten. Du entscheidest selbst, ob die Änderungen besser sind.</p>'+
   '<p class="muted">'+arr.length+' gespeicherte Fassungen</p>'+
   (right?'<div class="ac-version-grid"><div><strong>'+(left?'Vorher · '+esc(left.date):'Noch keine zweite Version')+'</strong><p class="ac-version-text">'+(left?esc(left.text):'Bearbeite den Text und speichere die zweite Fassung.')+'</p></div>'+
    '<div><strong>Nachher · '+esc(right.date)+'</strong><p class="ac-version-text">'+esc(right.text)+'</p></div></div>'+
    (left?'<details class="ac-diff"><summary>Geänderte Wörter farbig vergleichen</summary>'+diff(left.text,right.text)+'</details>':''):
    '<p>Es wurde noch keine Version gespeichert.</p>')+
    (type==='writer'?'<div class="ac-controls"><button type="button" class="primary" data-ac-save-writer>Aktuelle Erzählung als Version sichern</button></div>':'')+
    '</section>';
 }
 function diff(oldText,newText){
   const aa=words(oldText).slice(0,260),bb=words(newText).slice(0,260),n=aa.length,m=bb.length;
   // Begrenzter Wortvergleich, lokale Verarbeitung ohne Weitergabe.
   const table=Array.from({length:n+1},()=>new Uint16Array(m+1));
   for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)table[i][j]=aa[i]===bb[j]?1+table[i+1][j+1]:Math.max(table[i+1][j],table[i][j+1]);
   let i=0,j=0,out=[];
   while(i<n||j<m){
     if(i<n&&j<m&&aa[i]===bb[j]){out.push('<span>'+esc(bb[j])+'</span>');i++;j++;}
     else if(j<m&&(i===n||table[i][j+1]>=table[i+1][j])){out.push('<ins>'+esc(bb[j])+'</ins>');j++;}
     else{out.push('<del>'+esc(aa[i])+'</del>');i++;}
   }
   return '<p class="ac-diff-words">'+out.join(' ')+'</p>'+(words(oldText).length>260||words(newText).length>260?'<p class="muted">Für sehr lange Texte werden nur die ersten 260 Wörter im Farbvergleich berücksichtigt. Die vollständigen Fassungen bleiben oben sichtbar.</p>':'');
 }
 function teacher(){
  const s=window.MF_STUDIO_DATA,selected=state.teacherTask||s.exams[0].id,task=s.exams.find(x=>x.id===selected)||s.exams[0];
  return '<div class="ac-intro"><p class="eyebrow">Werkzeuge für Lehrkräfte</p><h2>Unterricht und Klassenarbeit vorbereiten</h2><p>Differenzierte Arbeitsaufträge, Erwartungshorizonte, Schüler- und Lehrermaterial, Beobachtungsbogen und Partner-Schreibkonferenz. Drucken Sie die gewünschten Unterlagen über den Browser als PDF oder Papier aus.</p></div>'+
  '<div class="panel ac-teacher-form"><label for="ac-teacher-task"><strong>Aufgabe wählen</strong></label><select id="ac-teacher-task">'+s.exams.map(x=>'<option value="'+x.id+'" '+(task.id===x.id?'selected':'')+'>'+esc(x.title)+' · '+esc(x.level)+'</option>').join('')+'</select>'+
  '<p class="ac-teacher-intro"><strong>'+esc(task.kind)+'</strong> · '+esc(task.level)+' · Orientierung '+task.minutes+' Minuten</p>'+
  '<p>'+esc(task.task)+'</p>'+
  '<div class="ac-teacher-buttons">'+
   '<button type="button" class="primary" data-ac-print="student">Schüler-Arbeitsblatt / PDF</button>'+
   '<button type="button" class="secondary" data-ac-print="solution">Lehrerblatt mit Erwartungshorizont / PDF</button>'+
   '<button type="button" class="secondary" data-ac-print="rubric">Beobachtungs- und Bewertungsraster / PDF</button>'+
   '<button type="button" class="secondary" data-ac-print="conference">Schreibkonferenzbogen / PDF</button></div>'+
  '<p class="muted">Im Druckdialog „Als PDF speichern“ wählen. Ein druckbarer Aufgabenbogen zeigt keine Musterlösung. Der Erwartungshorizont ist separat.</p></div>'+
  '<div class="ac-teacher-grid"><section class="panel"><h3>Differenzierung</h3><p><strong>Stufe 1:</strong> Bilder in Reihenfolge erzählen, W-Fragen und Erzählplan nutzen.</p><p><strong>Stufe 2:</strong> Eigenständig Gefühle, Gedanken und Hindernisse einbauen.</p><p><strong>Stufe 3:</strong> Erzähltempo steuern, Ursache-Wirkung-Verbindungen und Perspektive bewusst gestalten.</p></section>'+
  '<section class="panel"><h3>Lehrkraft-Hinweise</h3><p>Die Kriterienraster dienen als strukturierte Rückmeldung. Sie ersetzen nicht die fachliche Beurteilung. Alle Geschichten dürfen schlüssige alternative Handlungsverläufe haben. Bei Bildern sollen konkrete Details beobachtet werden, nicht ein einziges vorgegebenes Ende erraten.</p></section></div>'+
  '<section class="panel"><h3>Schreibkonferenz in drei Schritten</h3><ol><li><strong>Das gelingt:</strong> Nenne eine konkrete Textstelle, die Spannung oder Bilder im Kopf erzeugt.</li><li><strong>Hier stolpere ich:</strong> Beschreibe eine unklare Stelle, ohne den Mitschüler abzuwerten.</li><li><strong>Das könntest du probieren:</strong> Formuliere einen umsetzbaren Vorschlag.</li></ol>'+
  routeButton('Zuerst die Textüberarbeitung trainieren','lab')+'</section>';
 }
 function daily(){
  // Eine tägliche Kombination aus vier Aufgaben, ausgehend vom Kalendertag.
  const day=new Date().toLocaleDateString('sv-SE'),salt=[...day].reduce((n,c)=>n*31+c.charCodeAt(0),0)>>>0;
  const start=(salt+state.challenge)%D.repairs.length;
  const picks=Array.from({length:4},(_,i)=>D.repairs[(start+i*3)%D.repairs.length]);
  return '<div class="ac-daily panel"><h3>Vier Mini-Aufgaben des Tages</h3><p>Eine kurze Challenge mit vier verschiedenen Schreibproblemen. Du musst nicht auf Zeit spielen.</p>'+
    picks.map((p,i)=>'<div class="ac-daily-task"><strong>'+(i+1)+'. '+esc(p.title)+'</strong><p>'+esc(p.problem)+'</p><p>Schreibidee: '+esc(p.prompt)+'</p><button type="button" class="secondary" data-ac-open-repair="'+p.id+'">Diese Aufgabe üben</button></div>').join('')+
    '<button type="button" class="secondary" data-ac-new-challenge>Andere vier Aufgaben wählen</button></div>';
 }
 function afterRender(root,view){
  const workspace=root.querySelector('#studio-workspace');if(!workspace)return;
  if(['path','writer','exam','lab','coach','repair','teacher'].includes(view)){
    const tts=document.createElement('section');tts.className='ac-readbar panel';tts.innerHTML=
      '<div><strong>Vorlesen und Ansicht</strong><p class="muted">Die Sprache wird auf deinem Gerät erzeugt. Klang und Stimmen hängen vom Browser ab.</p></div>'+
      '<div class="ac-read-controls"><button type="button" class="secondary" data-ac-read="current">Vorlesen</button><button type="button" class="secondary" data-ac-pause>Pause</button><button type="button" class="secondary" data-ac-resume>Weiter</button><button type="button" class="secondary" data-ac-stop>Stopp</button>'+
      '<label>Tempo<select id="ac-tts-speed">'+[0.75,0.88,1,1.1].map(n=>'<option value="'+n+'" '+(state.settings.speed===n?'selected':'')+'>'+n+'×</option>').join('')+'</select></label>'+
      '<label>Stimme<select id="ac-tts-voice"><option value="">Gerätestimme</option></select></label>'+
      '<label>Textgröße<select id="ac-size"><option value="1" '+(state.settings.font===1?'selected':'')+'>Normal</option><option value="1.13" '+(state.settings.font===1.13?'selected':'')+'>Groß</option><option value="1.24" '+(state.settings.font===1.24?'selected':'')+'>Sehr groß</option></select></label>'+
      '<label class="ac-inline-check"><input type="checkbox" id="ac-contrast" '+(state.settings.contrast?'checked':'')+'>Mehr Kontrast</label></div><p id="ac-tts-status" role="status" aria-live="polite" class="ac-tts-status">Vorlesen startet erst nach Antippen.</p>';
    workspace.appendChild(tts); updateVoices(); updateStyle();
    if(view==='path'){const starter=document.createElement('section');starter.innerHTML=daily();workspace.appendChild(starter);}
    if(view==='writer'){
      const preview=workspace.querySelector('.studio-preview');if(preview){
       const sel=root.querySelector('#studio-picker')?.value||'';
       const v=state.writerVersions[sel]||[];
       const el=document.createElement('div');el.innerHTML=versionPanel(v,'writer');preview.after(el);
      }
    }
  }
 }
 function updateStyle(){
  const studio=document.getElementById('studio');if(!studio)return;
  studio.style.setProperty('--academy-font',String(state.settings.font));
  studio.classList.toggle('academy-contrast',state.settings.contrast===true);
 }
 function currentText(mode){
  const root=document.getElementById('studio-app'),view=root?.querySelector('.studio-tabs .active')?.dataset.studioView;
  if(mode==='repair'||view==='repair')return root.querySelector('#ac-repair-text')?.value||rdata().model;
  if(view==='writer')return [...root.querySelectorAll('[data-studio-part]')].map(x=>x.value).filter(Boolean).join('\n\n')||'Schreibe deine Geschichte, damit sie vorgelesen werden kann.';
  if(view==='exam')return root.querySelector('[data-studio-exam-text]')?.value||root.querySelector('.studio-exam-task')?.textContent||'';
  if(view==='lab')return root.querySelector('[data-studio-lab-revision]')?.value||root.querySelector('.studio-before')?.textContent||'';
  const workspace=root.querySelector('#studio-workspace');
  return (workspace?.innerText||'').slice(0,8500);
 }
 function voices(){return ('speechSynthesis' in window)?window.speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith('de')):[];}
 function updateVoices(){
  const select=document.getElementById('ac-tts-voice');if(!select)return;
  const list=voices();select.innerHTML='<option value="">Gerätestimme</option>'+list.map((v,i)=>'<option value="'+i+'" '+(state.settings.voice===v.name?'selected':'')+'>'+esc(v.name)+'</option>').join('');
 }
 // Kurze Sprechabschnitte vermeiden Browser-Limits bei langen Schülergeschichten.
 let speech={token:0,chunks:[],index:0,paused:false};
 const speechStatus=message=>{const el=document.getElementById('ac-tts-status');if(el)el.textContent=message;};
 function speechParts(text){
   const tokens=String(text||'').replace(/\s+/g,' ').trim().split(/\s+/).filter(Boolean),parts=[];
   let current='';
   for(const word of tokens){
     if(current.length+word.length+1>175&&current){parts.push(current);current='';}
     if(word.length>175){if(current){parts.push(current);current='';}for(let i=0;i<word.length;i+=175)parts.push(word.slice(i,i+175));}
     else current+=(current?' ':'')+word;
   }
   if(current)parts.push(current);
   return parts;
 }
 function readNext(token){
   if(token!==speech.token||speech.paused)return;
   if(speech.index>=speech.chunks.length){speechStatus('Der ganze Text wurde vorgelesen.');return;}
   const chunk=speech.chunks[speech.index];
   const u=new SpeechSynthesisUtterance(chunk);u.lang='de-DE';u.rate=Number(state.settings.speed)||0.88;
   const v=voices().find(x=>x.name===state.settings.voice);if(v)u.voice=v;
   speechStatus('Vorlesen: Abschnitt '+(speech.index+1)+' von '+speech.chunks.length);
   u.onend=()=>{if(token!==speech.token)return;speech.index++;readNext(token);};
   u.onerror=e=>{if(token===speech.token)speechStatus('Die Sprachausgabe wurde unterbrochen. Du kannst den Text erneut vorlesen.');};
   window.speechSynthesis.speak(u);
 }
 function speak(mode){
   if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){speechStatus('Dieser Browser unterstützt keine Sprachausgabe. Bitte nutze die Vorlesefunktion des Geräts.');return;}
   const t=currentText(mode).trim();if(!t){speechStatus('Es ist noch kein Text vorhanden.');return;}
   speech.token++;window.speechSynthesis.cancel();
   speech.chunks=speechParts(t);speech.index=0;speech.paused=false;
   readNext(speech.token);
 }
 function pauseReading(){
   if(!('speechSynthesis' in window)||!speech.chunks.length)return;
   speech.paused=true;
   try{window.speechSynthesis.pause()}catch{}
   speechStatus('Vorlesen pausiert nach Abschnitt '+(speech.index+1)+'.');
 }
 function resumeReading(){
   if(!('speechSynthesis' in window)||!speech.chunks.length)return;
   speech.paused=false;
   if(window.speechSynthesis.paused){try{window.speechSynthesis.resume()}catch{}}
   else if(!window.speechSynthesis.speaking)readNext(speech.token);
   speechStatus('Vorlesen fortgesetzt.');
 }
 const stop=()=>{speech.token++;speech.chunks=[];speech.index=0;speech.paused=false;try{window.speechSynthesis?.cancel()}catch{}speechStatus('Vorlesen beendet.');};
 function ensurePrint(){
   let node=document.getElementById('ac-print-sheet');
   if(!node){node=document.createElement('article');node.id='ac-print-sheet';document.body.appendChild(node);}
   return node;
 }
 function printDoc(which){
  const x=window.MF_STUDIO_DATA,s=x.exams.find(t=>t.id===state.teacherTask)||x.exams[0],node=ensurePrint();
  const rubric=x.rubric;
  const paragraphs='<p><strong>Name:</strong> ____________________________ <strong>Datum:</strong> ______________</p>';
  const head='<header><h1>Deutsch · Erzählungen · Klasse 5</h1><p>'+esc(s.kind)+' · '+esc(s.level)+' · Orientierungszeit '+s.minutes+' Min.</p></header>';
  const panels=s.panels.length?'<div class="ac-print-pictures">'+s.panels.map((p,i)=>'<div><strong>Bild '+(i+1)+': '+esc(p[1])+'</strong><div>'+window.MF_STUDIO_ART.render(s.id,i,p[0])+'</div><p>'+esc(p[2])+'</p></div>').join('')+'</div>':'<p><strong>Reizwörter:</strong> '+s.words.map(esc).join(' · ')+'</p>';
  const lines=Array.from({length:26},()=>'<div class="ac-writing-line"></div>').join('');
  let body='';
  if(which==='student')body=head+paragraphs+'<h2>'+esc(s.title)+'</h2>'+panels+'<p><strong>Aufgabe:</strong> '+esc(s.task)+'</p><p>Denke an Einleitung, Hauptteil mit Höhepunkt und Schluss.</p><p><strong>Deine Überschrift:</strong> ___________________________________________</p>'+lines;
  if(which==='solution')body=head+'<h2>Lehrerblatt und Erwartungshorizont</h2><h3>'+esc(s.title)+'</h3>'+panels+'<p><strong>Aufgabe:</strong> '+esc(s.task)+'</p><h3>Möglicher Handlungsverlauf</h3><ol>'+s.guide.map(guide=>'<li>'+esc(guide)+'</li>').join('')+'</ol><h3>Beurteilungskriterien</h3><ul>'+rubric.map(r=>'<li><strong>'+esc(r.name)+':</strong> '+esc(r.detail)+'</li>').join('')+'</ul><p>Abweichende, schlüssige und sprachlich überzeugende Lösungen sind zulässig. Das Raster ist eine Orientierung, keine automatisch gültige Notenskala.</p>';
  if(which==='rubric')body=head+paragraphs+'<h2>Beobachtungs- und Überarbeitungsbogen</h2><table><thead><tr><th>Kompetenz</th><th>Beobachtung / Textbeleg</th><th>0 / 1 / 2</th></tr></thead><tbody>'+rubric.map(r=>'<tr><td><strong>'+esc(r.name)+'</strong><p>'+esc(r.detail)+'</p></td><td>________________<br>________________</td><td>□ 0<br>□ 1<br>□ 2</td></tr>').join('')+'</tbody></table><p><strong>Gelungen ist:</strong> __________________________________________________</p><p><strong>Mein nächster Lernschritt:</strong> _______________________________________</p><p>0 = noch nicht sichtbar · 1 = teilweise · 2 = gut sichtbar; keine automatisierte Schulnote.</p>';
  if(which==='conference')body=head+paragraphs+'<h2>Schreibkonferenz – Rückmeldung unter Mitschülern</h2><p><strong>Titel der Geschichte:</strong> _______________________________________</p><h3>1. Das gelingt</h3><p>Diese Stelle finde ich besonders gelungen, weil …</p>'+lines.slice(0,lines.indexOf('</div>')+6).repeat(3)+'<h3>2. Hier stolpere ich</h3><p>An dieser Stelle war für mich nicht klar, warum …</p>'+lines.slice(0,lines.indexOf('</div>')+6).repeat(3)+'<h3>3. Das könntest du probieren</h3><p>Mein konkreter Verbesserungsvorschlag: …</p>'+lines.slice(0,lines.indexOf('</div>')+6).repeat(3)+'<p>Erst zuhören und nachfragen, dann selbst entscheiden, welche Änderung dem Text hilft.</p>';
  node.innerHTML=body;document.body.classList.add('ac-printing');try{window.print();}catch{document.body.classList.remove('ac-printing');}
 }
 function click(ev){
  const b=ev.target.closest('button');if(!b||!document.getElementById('studio-app')?.contains(b))return;
  const d=b.dataset;
  if(d.acView){document.querySelector('.studio-tabs [data-studio-view="'+d.acView+'"]')?.click();return;}
  if(d.acRoute){window.showPage?.(d.acRoute);return;}
  if(d.acSubmit!==undefined){if(Object.keys(state.diagnostic.answers).length<12)return;state.diagnostic.submitted=true;state.diagnosticRuns++;save();rerender();return;}
  if(d.acRedo!==undefined){state.diagnostic={answers:{},submitted:false};save();rerender();return;}
  if(d.acHint!==undefined){const r=rstate();r.hints=Math.min(3,(r.hints||0)+1);save();rerender();return;}
  if(d.acPiece!==undefined){const item=rdata().pieces[Number(d.acPiece)];const t=document.getElementById('ac-piece-feedback');if(t&&item)t.textContent='Baustein: '+item[0]+' · Funktion: '+item[1]+'. Schreibe gern eine eigene Variante.';b.setAttribute('aria-expanded','true');return;}
  if(d.acSaveRepair!==undefined){const r=rstate();if(!r.text?.trim())return;const arr=r.versions||[];arr.push({date:stamp(),text:r.text});r.versions=arr.slice(-7);save();rerender();return;}
  if(d.acSaveWriter!==undefined){const root=document.getElementById('studio-app'),sel=root?.querySelector('#studio-picker')?.value||'';
   const text=[...root.querySelectorAll('[data-studio-part]')].map(x=>x.value).filter(Boolean).join('\n\n');
   if(!text.trim()){alert('Schreibe zuerst einen Teil deiner Erzählung.');return;}
   const arr=state.writerVersions[sel]||[];arr.push({date:stamp(),text});state.writerVersions[sel]=arr.slice(-7);save();rerender();return;
  }
  if(d.acOpenRepair){state.repairId=d.acOpenRepair;save();document.querySelector('.studio-tabs [data-studio-view="repair"]')?.click();return;}
  if(d.acNewChallenge!==undefined){state.challenge++;save();rerender();return;}
  if(d.acPrint){printDoc(d.acPrint);return;}
  if(d.acRead){speak(d.acRead);return;}
  if(d.acPause!==undefined){pauseReading();return;}
  if(d.acResume!==undefined){resumeReading();return;}
  if(d.acStop!==undefined){stop();return;}
  if(d.acDownloadRepair!==undefined){
   const r=rstate();const file=new Blob(['\ufeff'+rdata().title+'\n\n'+(r.text||'')],{type:'text/plain;charset=utf-8'});
   const url=URL.createObjectURL(file),a=document.createElement('a');a.href=url;a.download='Meine_Textueberarbeitung.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);return;
  }
 }
 function change(ev){
  const x=ev.target;
  if(x.dataset.acAnswer){state.diagnostic.answers[x.dataset.acAnswer]=Number(x.value);state.diagnostic.submitted=false;save();const b=document.querySelector('[data-ac-submit]');if(b)b.disabled=Object.keys(state.diagnostic.answers).length!==12;const p=document.querySelector('.ac-progress strong');if(p)p.textContent=Object.keys(state.diagnostic.answers).length+' von 12 Fragen beantwortet';const bar=document.querySelector('.ac-progress progress');if(bar)bar.value=Object.keys(state.diagnostic.answers).length;return;}
  if(x.id==='ac-repair-pick'){state.repairId=x.value;save();rerender();return;}
  if(x.id==='ac-teacher-task'){state.teacherTask=x.value;save();rerender();return;}
  if(x.dataset.acSelf!==undefined){const r=rstate();r.checks[Number(x.dataset.acSelf)]=x.checked;save();const label=document.getElementById('ac-self-status');if(label)label.textContent=r.checks.filter(Boolean).length+' von 3 Kriterien selbst überprüft – keine automatische Note.';return;}
  if(x.id==='ac-tts-speed'){state.settings.speed=Number(x.value);save();return;}
  if(x.id==='ac-tts-voice'){state.settings.voice=voices()[Number(x.value)]?.name||'';save();return;}
  if(x.id==='ac-size'){state.settings.font=Number(x.value)||1;save();updateStyle();return;}
  if(x.id==='ac-contrast'){state.settings.contrast=x.checked;save();updateStyle();return;}
 }
 function input(ev){if(ev.target.id!=='ac-repair-text')return;const r=rstate();r.text=ev.target.value.slice(0,12000);r.checks=[];save();const w=document.getElementById('ac-word-count');if(w)w.textContent=words(r.text).length+' Wörter';const b=document.querySelector('[data-ac-save-repair]');if(b)b.disabled=!r.text.trim();const t=document.getElementById('ac-self-status');if(t)t.textContent='Neuer Text: Prüfe die drei Kriterien erneut.';document.querySelectorAll('[data-ac-self]').forEach(x=>x.checked=false);}
 function rerender(){document.querySelector('.studio-tabs .active')?.click();}
 let initialized=false;
 function init(){
  if(initialized)return;initialized=true;
  const root=document.getElementById('studio-app');if(!root)return;
  root.addEventListener('click',click);root.addEventListener('change',change);root.addEventListener('input',input);
  document.addEventListener('learningpagechange',e=>{if(e.detail.id!=='studio')stop();});
  window.addEventListener('pagehide',stop);
  window.addEventListener('afterprint',()=>document.body.classList.remove('ac-printing'));
  if('speechSynthesis' in window)window.speechSynthesis.onvoiceschanged=updateVoices;
 }
 init();
 return Object.freeze({render(view){if(view==='coach')return coach();if(view==='repair')return repair();if(view==='teacher')return teacher();return '';},afterRender,init,stop,diff,openRepairSkill(skillId){const found=D.repairs.find(x=>x.skill===skillId);if(!found)return false;state.repairId=found.id;save();return true;}});
})();
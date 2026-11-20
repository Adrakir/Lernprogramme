'use strict';
function stored(key, fallback) {
  try { return JSON.parse(read(key)) ?? fallback; } catch { return fallback; }
}
function reader(text) {
  if (!('speechSynthesis' in window)) return '';
  return '<span class="read-tools"><button type="button" data-speak="'+encodeURIComponent(text)+'">Vorlesen</button> <button type="button" data-stop aria-label="Vorlesen stoppen">Stopp</button></span>';
}
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-speak],[data-stop]');
  if(!button)return;
  speechSynthesis.cancel();
  if(button.hasAttribute('data-speak')){
    const speech=new SpeechSynthesisUtterance(decodeURIComponent(button.dataset.speak));
    speech.lang='de-DE';speech.rate=read('speechPace')==='langsam'?.72:.9;speechSynthesis.speak(speech);
  }
});
function attachReaders(){
  stage.querySelectorAll('.family-head p,.tile>p:first-of-type,details>p:first-of-type,.surface>p:first-of-type').forEach(p=>{
    if(!p.classList.contains('eyebrow') && !p.dataset.voice && p.textContent.trim()){p.dataset.voice='1';p.insertAdjacentHTML('afterend',reader(p.textContent));}
  });
}
let lineOn=false,namesOn=read('ringNames')==='1',quiet=read('quiet')==='1';
function enhanceWheel(){
  const svg=stage.querySelector('.wheel');
  svg.setAttribute('tabindex','0');svg.setAttribute('role','slider');
  svg.setAttribute('aria-label','Farbkreis, mit Pfeiltasten einen Farbton wählen');
  svg.setAttribute('aria-valuemin','1');svg.setAttribute('aria-valuemax','12');
  svg.setAttribute('aria-valuenow',chosen+1);svg.setAttribute('aria-valuetext',names[chosen]+', '+group(chosen));
  svg.onkeydown=e=>{
    const move={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key];
    if(!move&&!['Home','End'].includes(e.key))return;e.preventDefault();const available=names.map((_,i)=>i).filter(i=>!highlighted||order(i)===highlighted);chooseColor(move?stepColor(move):e.key==='Home'?available[0]:available[available.length-1]);stage.querySelector('.wheel').focus();
  };
  if(lineOn){
    const endpoints=[chosen,opposite(chosen)].map(i=>point(146,-90+i*30).split(' '));
    // Draw beneath the centre label, with a dark backing for legibility.
    by('oppositeLayer').insertAdjacentHTML('beforeend',
      '<g pointer-events="none"><line x1="'+endpoints[0][0]+'" y1="'+endpoints[0][1]+'" x2="'+endpoints[1][0]+'" y2="'+endpoints[1][1]+'" stroke="white" stroke-width="4" stroke-dasharray="6 4"/><rect x="103" y="153" width="154" height="65" rx="18" fill="#151c45"/></g>');
  }
  if(namesOn){
    svg.setAttribute('viewBox','-52 -30 464 420');
    names.forEach((name,i)=>{
      const [x,y]=point(179,-90+30*i).split(' ');
      svg.insertAdjacentHTML('beforeend','<text x="'+x+'" y="'+y+'" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="11" font-weight="650">'+name+'</text>');
    });
  }
  by('pick').insertAdjacentHTML('afterend','<div class="wheel-legend"><button id="toggleLine" aria-pressed="'+lineOn+'">Gegenfarbe zeigen</button><button id="toggleNames" aria-pressed="'+namesOn+'">Farbnamen am Ring</button><button id="toggleQuiet" aria-pressed="'+quiet+'">Ruhige Ansicht</button></div>');
  for(const [id,change] of [
    ['toggleLine',()=>{lineOn=!lineOn}],['toggleNames',()=>{namesOn=!namesOn;save('ringNames',namesOn?'1':'0')}],
    ['toggleQuiet',()=>{quiet=!quiet;save('quiet',quiet?'1':'0')}]
  ])by(id).onclick=()=>{change();wheel();by(id).focus()};
  if(quiet){
    const cards=stage.querySelector('.cards');
    const extra=document.createElement('details');extra.className='surface';extra.innerHTML='<summary>Nachbarn, Gegenfarbe und weitere Erklärungen</summary>';
    cards.after(extra);[...cards.children].slice(1).forEach(el=>extra.append(el));
    while(extra.nextElementSibling) extra.append(extra.nextElementSibling);
    cards.classList.add('single-card');
  }
  stage.insertAdjacentHTML('beforeend','<p class="family-next"><a href="#praxis">Am Farbkreis üben</a></p>');
  attachReaders();
}
function pigmentPreview(first,second,t){
  // Geometric interpolation models attenuation approximately; no measured pigment data.
  const channels=[1,3,5].map(i=>{
    const a=parseInt(first.slice(i,i+2),16), b=parseInt(second.slice(i,i+2),16);
    return Math.round(a**(1-t)*b**t);
  });
  return 'rgb('+channels.join(',')+')';
}
let samples=stored('samples',[]);
if(!Array.isArray(samples))samples=[];
samples=samples.filter(s=>s&&Number.isInteger(s.a)&&names[s.a]&&Number.isInteger(s.b)&&names[s.b]&&Number.isInteger(s.n)&&s.n>=0&&s.n<=100&&/^rgb\([\d, ]+\)$/.test(s.color)).slice(0,3);
if(samples.some(s=>!s.id)){samples=samples.map(s=>({...s,id:s.id||crypto.randomUUID()}));save('samples',JSON.stringify(samples))}
let removedSample=null;
function renderSamples(){
  by('tray').innerHTML=samples.map((s,i)=>'<figure><i style="background:'+s.color+'"></i><figcaption>'+(100-s.n)+' % '+names[s.a]+' · '+s.n+' % '+names[s.b]+'</figcaption><label>Meine Beobachtung<input maxlength="180" data-sample-note="'+i+'"></label><button data-remove="'+i+'" aria-label="Probe '+(i+1)+' entfernen">Entfernen</button></figure>').join('');
  by('tray').querySelectorAll('[data-sample-note]').forEach(el=>{
    const sample=samples[Number(el.dataset.sampleNote)];el.value=sample.note||'';el.setAttribute('aria-label','Meine Beobachtung zu Probe '+(Number(el.dataset.sampleNote)+1)+', '+sampleRecipe(sample));
    el.oninput=()=>{sample.note=el.value;save('samples',JSON.stringify(samples));by('sampleStudio')?.querySelector('.compare-pair')?.dispatchEvent(new Event('sample-note'))};
  });
  by('keep').disabled=samples.length>=3;refreshStudentSamples();
  by('trayMsg').textContent=samples.length===3?'Drei Proben abgelegt. Entferne eine, um Platz zu machen.':samples.length+' von 3 Proben abgelegt.';
  by('tray').querySelectorAll('button').forEach(btn=>btn.onclick=()=>{const index=Number(btn.dataset.remove);removedSample={index,value:samples.splice(index,1)[0]};save('samples',JSON.stringify(samples));renderSamples();by('undoSample').focus()});
  if(removedSample){
   const undo=document.createElement('button');undo.id='undoSample';undo.textContent='Entfernen rückgängig machen';undo.disabled=samples.length>=3;
   undo.onclick=()=>{samples.splice(removedSample.index,0,removedSample.value);removedSample=null;save('samples',JSON.stringify(samples));renderSamples();by('tray').querySelector('button')?.focus()};
   by('trayMsg').append(' ',undo);
  }
}
function noteField(id,key){
  const el=by(id);el.value=read(key)||'';el.oninput=()=>save(key,el.value);
}
function setupLab(a,b){
  const prompt='Was vermutest du, wenn du etwas '+names[b]+' zu '+names[a]+' gibst?';
  by('ratio').closest('article').querySelector('.tools').insertAdjacentHTML('afterend','<details><summary>Vor dem Mischen: meine Vermutung</summary><label>'+prompt+'<input id="prediction" maxlength="200"></label></details>');
  noteField('prediction','prediction'+a+'-'+b);
  by('ratio').insertAdjacentHTML('afterend','<div id="portions"></div>');
  by('sample').insertAdjacentHTML('afterend','<section class="sample-shelf"><button id="keep">Probe ablegen</button><p id="trayMsg" role="status"></p><div id="tray" class="swatch-grid"></div></section>');
  by('keep').onclick=()=>{if(samples.length>=3)return;samples.push({id:crypto.randomUUID(),a,b,n:amount,color:by('sample').style.backgroundColor});save('samples',JSON.stringify(samples));renderSamples()};
  renderSamples();
  stage.querySelector('article').insertAdjacentHTML('beforeend','<details><summary>Vermutung mit dem Ergebnis vergleichen</summary><p id="myPrediction"></p><label>Ich beobachte …<input id="observation" maxlength="240"></label></details>');
  const predictionText=()=>{by('myPrediction').textContent=by('prediction').value||'Du kannst auch ohne Vermutung eine Beobachtung festhalten.'};predictionText();
  by('prediction').addEventListener('input',predictionText);noteField('observation','observation'+a+'-'+b);
  if(mode){
    stage.querySelector('article').insertAdjacentHTML('beforeend','<details><summary>Was passiert mit echten Malfarben?</summary><p>Je nach Pigment und Menge kann die Mischung bräunlich, grau oder sehr dunkel werden. Diese digitalen Vergleichsfelder zeigen mögliche Wirkungen.</p><div class="swatch-grid">'+[['#91704f','Bräunlich'],['#807e79','Graustichig'],['#373843','Sehr dunkel']].map(([c,n])=>'<figure><i style="background:'+c+'"></i><figcaption>'+n+'</figcaption></figure>').join('')+'</div><p><a href="https://danielsmith.com/color-stories/watercolors/janes-black-blue-orange-watercolor/" target="_blank" rel="noopener">Echte aufgestrichene Blau-Orange-Mischung ansehen (Herstellerbeispiel)</a> · <a href="https://www.handprint.com/HP/WCL/tech34.html" target="_blank" rel="noopener">Gemalte Grün-Mischreihen vergleichen (englisch)</a></p><label>Eigene Papierproben vergleichen (bis zu 3 Fotos, nur auf diesem Gerät)<input id="photos" type="file" accept="image/*" multiple></label><div class="swatch-grid" id="localPhotos"></div></details><p class="family-next"><a href="#atelier">Zum Malauftrag „Ein Orange in drei Stufen“</a> · <a href="lernheft.pdf#page=14">Malfelder auf Seite 14</a></p>');
    mountPhotos();
    by('photos').closest('details').insertAdjacentHTML('beforeend','<label>Dein Orange wirkt auf Papier rötlicher als am Bildschirm. Welche Zutat würdest du in einer frischen Probe verändern?<textarea id="realPaint"></textarea></label><details><summary>Versuchsidee vergleichen</summary><p>Beginne mit demselben Gelb und gib weniger Rot dazu. Vergleiche die getrockneten Proben auf demselben Papier. Wie viel Rot brauchst du bei deinen Malfarben?</p></details>');
    noteField('realPaint','realPaint');
  }
  attachReaders();
}
function updateLab(a,b){
  const gcd=(x,y)=>y?gcd(y,x%y):x;
  const d=gcd(100-amount,amount),left=(100-amount)/d,right=amount/d;
  const dots=(n,c)=>n<=10?'<span class="little-paint" style="--paint:'+hex[c]+'">'+'●'.repeat(n)+'</span>':'';
  by('portions').innerHTML='<strong>Gleich große Pinselportionen</strong><br>'+left+' × '+names[a]+' '+dots(left,a)+' + '+right+' × '+names[b]+' '+dots(right,b);
  if(mode&&amount===50)by('observe').textContent='50 : 50 bedeutet gleich große Mengen. Der Regler zeigt eine Annäherung. Im Malkasten kann ein kräftiges Pigment überwiegen; der genaue Mischton hängt von deinen Farben ab.';
}
const digitalTasks=[
 ['Lege drei Orange-Blau-Proben mit 0, 10 und 25 Prozent Blau ab. Beschreibe, welche am kräftigsten wirkt.','komplementaerfarben'],
 ['Vergleiche die nebeneinanderstehenden Farbfelder mit der Mischung darunter. Wo siehst du eine klare Kante?','komplementaerfarben'],
 ['Wähle für denselben Himmel eine warme und eine kühle Farbe. Begründe deine Wirkung.','bildaufgabe'],
 ['Mische im Grundfarbenlabor zuerst Gelb und Rot. Wechsle anschließend zu Orange und Blau und teste den Einfluss der dritten Grundfarbe.','mischlabor']
];
function extendTasks(){
  const main=stage.querySelector('article');
  [...main.children].filter(el=>el.tagName==='DETAILS').forEach((el,i)=>{
    const [instruction,target]=digitalTasks[i];
    el.insertAdjacentHTML('beforeend','<p><b>Ohne Malkasten:</b> '+instruction+' <a href="#'+target+(target==='bildaufgabe'?'':'?auftrag=orange')+'">Digital ausprobieren</a></p>');
  });
  main.insertAdjacentHTML('beforeend','<details><summary>Zu zweit: Rezept vorlesen und mischen</summary><p>Kind A beschreibt die Farben und ihre Mengen. Kind B mischt nach der Beschreibung. Vergleicht das Ergebnis und tauscht für das nächste Rezept die Rollen.</p></details><p><a href="#bildaufgabe">Sternbilder und eigene Himmelsfarben gestalten</a></p>');
  if(sessionStorageSafe('taskLink')==='orange'){main.querySelector('details').open=true;sessionStorageSafe('taskLink','')}
}
function sessionStorageSafe(key,value){try{if(value===undefined)return sessionStorage.getItem(key);sessionStorage.setItem(key,value)}catch{}}
document.addEventListener('click',e=>{
  if(e.target.closest('a[href="#atelier"]')&&location.hash==='#komplementaerfarben')sessionStorageSafe('taskLink','orange');
});
function picture(){
 const swatches=[['#ff902b','Kräftiges Orange'],['#ffcfad','Orange mit Weiß'],['#9e806e','Orange mit Blau']];
 stage.innerHTML='<article class="surface"><h2>Was lässt eine Farbe leuchten?</h2><p>In beiden Bildern hat der Stern dasselbe Gelb. Vergleiche zuerst seine Wirkung an den Kanten.</p><div class="star-pair">'+['#8046a4','#ffb32d'].map((c,i)=>'<figure><svg viewBox="0 0 200 115" role="img" aria-label="Gelber Stern auf '+(i?'Gelb-Orange':'Violett')+'"><rect width="200" height="115" rx="10" fill="'+c+'"/><path fill="#ffda35" d="M100 10 111 43 147 44 118 65 129 99 100 79 71 99 82 65 53 44 89 43Z"/></svg><figcaption>'+(i?'Gelb auf Gelb-Orange':'Gelb auf Violett')+'</figcaption></figure>').join('')+'</div><label>Welcher Stern hebt sich stärker ab? Warum?<input id="starReason" maxlength="300"></label><details><summary>Mit einer Erklärung vergleichen</summary><p>Violett liegt Gelb gegenüber. Der Kontrast lässt den gelben Stern besonders hervortreten. Gelb-Orange ist eine Nachbarfarbe.</p></details><h3>Hell, kräftig oder getrübt?</h3><div class="swatch-grid">'+swatches.map(([c,n])=>'<figure><i style="background:'+c+'"></i><figcaption>'+n+'</figcaption></figure>').join('')+'</div><p>Welche Probe ist am hellsten? Welche ist am buntesten?</p><details><summary>Beobachtung vergleichen</summary><p>Weiß hellt das Orange auf. Das erste Orange wirkt am kräftigsten. Die Zugabe der Gegenfarbe Blau dämpft seine Buntheit.</p></details><h3>Meine beiden Himmel</h3><div class="star-pair">'+[0,1].map(i=>'<label>Himmel '+(i+1)+'<select id="sky'+i+'">'+options(names,Number(read('sky'+i)??(i?8:2)))+'</select><svg viewBox="0 0 200 80" aria-label="Landschaft" role="img"><rect id="skyFill'+i+'" width="200" height="80"/><path d="M0 65 Q55 26 105 63 T200 53 V80 H0Z" fill="#424b52"/></svg></label>').join('')+'</div><label>Mein Himmel wirkt …, weil …<textarea id="skyReason" rows="2" maxlength="400"></textarea></label></article>';
 pictureExtras();noteField('starReason','starReason');noteField('skyReason','skyReason');
 [0,1].forEach(i=>{const el=by('sky'+i);const change=()=>{by('skyFill'+i).setAttribute('fill',hex[+el.value]);save('sky'+i,el.value)};change();el.onchange=change});
}
let guideStep=Number(read('guideStep'));
if(!Number.isInteger(guideStep)||guideStep<0||guideStep>2)guideStep=0;
function guided(){
 const steps=[['Grundfarben finden','Wähle im Kreis „Primärfarben“. Wie heißen die drei hervorgehobenen Farben?','farbkreis'],['Orange mischen','Wähle Gelb und Rot und stelle gleich große Anteile ein. Lege deine Probe ab.','mischlabor'],['Orange trüben','Vergleiche 100 : 0 und 90 : 10 bei Orange und Blau. Beschreibe den Unterschied.','komplementaerfarben']];
 save('guideStep',guideStep);
 const step=steps[guideStep];
 stage.innerHTML='<article class="surface"><p class="eyebrow">DEIN LERNWEG · '+(guideStep+1)+' VON 3</p><h2>'+step[0]+'</h2><p>'+step[1]+'</p><div class="tools"><a class="action-link" id="launchGuide" href="#'+step[2]+'">Schritt ausprobieren</a>'+(guideStep?'<button id="guideBack">Zurück</button>':'')+(guideStep<2?'<button id="advanceGuide">Weiter</button>':'<a href="#praxis">Zum Praxischeck</a>')+'</div></article>';
 if(by('guideBack'))by('guideBack').onclick=()=>{guideStep--;guided();attachReaders()};
 if(by('advanceGuide'))by('advanceGuide').onclick=()=>{guideStep++;guided();attachReaders()};
 by('launchGuide').onclick=()=>{sessionStorageSafe('guiding',String(guideStep));if(guideStep===0)highlighted=0};
}
function guideBanner(){
 if(by('continueGuide'))return;
 const step=sessionStorageSafe('guiding');
 if(!['0','1','2'].includes(step))return;
 if(location.hash!==['#farbkreis','#mischlabor','#komplementaerfarben'][+step]){sessionStorageSafe('guiding','');return}
 stage.insertAdjacentHTML('afterbegin','<aside class="note"><strong>Lernweg · Schritt '+(+step+1)+'</strong> <a id="continueGuide" href="'+(+step===2?'#praxis':'#lernweg')+'">'+(+step===2?'Zum Praxischeck':'Zum nächsten Schritt')+'</a></aside>');
 by('continueGuide').onclick=()=>{guideStep=Math.min(+step+1,2);save('guideStep',guideStep);sessionStorageSafe('guiding','')};
}
function practicalRing(multiple){
 const segments=names.map((name,i)=>{
   const a=-105+i*30,b=a+30,[x,y]=point(126,-90+30*i).split(' ');
   return '<g data-pick="'+i+'"><path fill="'+hex[i]+'" stroke="#172044" stroke-width="3" d="M '+point(163,a)+' A 163 163 0 0 1 '+point(163,b)+' L '+point(76,b)+' A 76 76 0 0 0 '+point(76,a)+'Z"/><circle cx="'+x+'" cy="'+y+'" r="12" fill="white"/><text x="'+x+'" y="'+y+'" dy=".35em" text-anchor="middle" fill="#151c45" font-size="14">'+String.fromCharCode(65+i)+'</text></g>';
 }).join('');
 return '<svg class="practice-ring" viewBox="0 0 360 360" role="img" aria-label="Farbkreis, zwölf Felder im Uhrzeigersinn ab Gelb">'+segments+'</svg><div class="pick-grid">'+names.map((n,i)=>'<label><input name="pickPractice" type="'+(multiple?'checkbox':'radio')+'" value="'+i+'"> '+String.fromCharCode(65+i)+' · '+n+'</label>').join('')+'</div>';
}
const hints=[
 'Denke an die drei Ausgangsfarben im Malkasten.','Grün liegt im Kreis zwischen zwei seiner Ausgangsfarben.',
 'Der erste Teil des Namens verrät, welche Farbe überwiegt.','Suche im Kreis einen Abstand von sechs Feldern.',
 'Überlege, was zwei gegenüberliegende Farben an einer gemeinsamen Kante bewirken.',
 'Suche im Farbkreis die Farbe gegenüber von Rot.','Alle vier Portionen sind gleich groß.',
 'Vergleiche die Färbekraft zweier Farben aus deinem Malkasten.','Welche Farben erinnern dich an die Abendsonne?',
 'Denke daran, was passiert, wenn zu Orange etwas Blau kommt.'
];
const skills=[
 ['Grundfarben benannt',[0],'farbgruppen'],['Grün aus Grundfarben gemischt',[1],'mischlabor'],['Rot-Violett aus Grundfarben erklärt',[2],'farbgruppen'],['Verhältnis 3 zu 1 gedeutet',[6],'mischlabor'],
 ['Gegenfarben und Bildwirkung',[3,4,5,8],'farbkreis'],['Malfarben und Modell',[7,9],'komplementaerfarben']
];
function freshAttempt(){return {index:0,first:[],final:[],retry:null}}
let attempt=stored('attemptV1',null);
function validAttempt(s){return s&&Number.isInteger(s.index)&&s.index>=0&&s.index<=questions.length&&Array.isArray(s.first)&&Array.isArray(s.final)&&[s.first,s.final].every(arr=>arr.length<=questions.length&&arr.every(v=>Number.isInteger(v)&&v>=0&&v<=2))&&s.final.length>=s.index&&s.final.length<=s.index+1&&s.first.length>=s.final.length&&s.first.length<=s.index+1}
let offerResume=validAttempt(attempt)&&attempt.index<questions.length&&(attempt.first.length>0||attempt.index>0);
if(!validAttempt(attempt))attempt=freshAttempt();
function persist(){save('attemptV1',JSON.stringify(attempt))}
function newQuiz(){attempt=freshAttempt();offerResume=false;persist();quiz()}
function quiz(){
 const i=attempt.index;
 if(offerResume){
 stage.innerHTML='<article class="surface"><h2>Wissenscheck fortsetzen?</h2><p>Auf diesem Gerät ist ein Versuch bei Frage '+(i+1)+' von 10 gespeichert.</p><div class="tools"><button class="primary" id="resume">Fortsetzen</button><button id="restart">Neu beginnen</button></div></article>';
 by('resume').onclick=()=>{offerResume=false;quiz()};by('restart').onclick=()=>{if(confirm('Den gespeicherten Quizversuch durch einen neuen ersetzen?'))newQuiz()};return;
 }
 if(i===questions.length){
 const right=j=>attempt.first[j]===questions[j][2],score=questions.filter((q,j)=>right(j)).length;
 const best=Math.max(score,Number(read('best'))||0);save('best',best);
 stage.innerHTML='<article class="surface"><p class="eyebrow">DEINE AUSWERTUNG</p><h2>'+score+' von 10 im ersten Versuch richtig</h2><p>Bestwert auf diesem Gerät: '+best+' von 10.</p>'+quizProgress()+'<div class="skill-results">'+skills.map(([label,indices,link])=>'<p><strong>'+label+'</strong> · '+indices.filter(right).length+' von '+indices.length+' <a href="#'+link+'">Vertiefen</a></p>').join('')+'</div>'+questions.map(([q,c,ok,why],j)=>right(j)?'':'<details><summary>'+q+'</summary><p>'+why+'</p></details>').join('')+'<div class="tools"><button id="again">Noch einmal üben</button><a class="action-link" href="#praxis">Praxischeck starten</a></div></article>';
 by('again').onclick=newQuiz;attachReaders();return;
 }
 const [q,choices,ok,why]=questions[i],done=attempt.final[i]!==undefined;
 stage.innerHTML='<article class="surface"><p class="eyebrow">WISSENSCHECK · FRAGE '+(i+1)+' VON 10</p><h2>'+q+'</h2>'+reader(q+' '+choices.join('. '))+'<div class="choices">'+choices.map((s,n)=>'<button data-choice="'+n+'" '+(done?'disabled':'')+'>'+s+'</button>').join('')+'</div><div role="status" id="feedback"></div><p><a href="#praxis">Praktische Aufgaben am Farbkreis und Mischregler</a></p></article>';
 function solved(){
 stage.querySelectorAll('[data-choice]').forEach(el=>el.disabled=true);
 const result=(attempt.final[i]===ok?'Richtig! ':'Richtig ist: '+choices[ok]+'. ')+why;
 by('feedback').innerHTML='<p class="note">'+result+'</p>'+reader(result)+'<button class="primary" id="next">'+(i===9?'Auswertung ansehen':'Nächste Frage')+'</button>';
 by('next').onclick=()=>{attempt.index++;attempt.retry=null;persist();quiz();stage.querySelector('h2').setAttribute('tabindex','-1');stage.querySelector('h2').focus()};
 }
 function hint(){
 by('feedback').innerHTML='<p class="note">Versuche es noch einmal. '+hints[i]+'</p>'+reader(hints[i])+'<button id="solution">Lösung ansehen</button>';
 by('solution').onclick=()=>{attempt.final[i]=attempt.first[i];attempt.retry=null;persist();solved();by('next').focus()};
 }
 if(done)solved();else if(attempt.retry===i)hint();
 stage.querySelectorAll('[data-choice]').forEach(el=>el.onclick=()=>{
 const choice=Number(el.dataset.choice);
 if(attempt.first[i]===undefined)attempt.first[i]=choice;
 if(choice!==ok&&attempt.retry!==i){attempt.retry=i;persist();hint();return}
 attempt.final[i]=choice;attempt.retry=null;persist();solved();by('next').focus();
 });
}

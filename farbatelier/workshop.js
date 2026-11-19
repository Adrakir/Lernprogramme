'use strict';

const guestToggle=by('guestToggle');
guestToggle.textContent=isGuest()?'Gastdurchgang beenden':'Gastdurchgang starten';
if(isGuest())document.querySelector('.brand').insertAdjacentHTML('afterend','<strong>Gast</strong>');
guestToggle.onclick=()=>{
  if(isGuest()&&!confirm('Gastdurchgang beenden und die Einträge dieses Gastdurchgangs verwerfen?'))return;
  try{
    const ending=isGuest();
    for(const key of Object.keys(sessionStorage))if(key.startsWith('farbatelier.gast.'))sessionStorage.removeItem(key);
    sessionStorage.removeItem('guiding');sessionStorage.removeItem('taskLink');
    if(ending)sessionStorage.removeItem('farbatelier.mode');else sessionStorage.setItem('farbatelier.mode','gast');
    location.reload();
  }catch{guestToggle.textContent='Für einen Gastdurchgang muss der Sitzungsspeicher verfügbar sein.'}
};
let wheelMessage='';
function stepColor(direction){
  let i=chosen;
  do{i=(i+12+direction)%12}while(highlighted&&order(i)!==highlighted);
  return i;
}
function wheelExtras(){
  const picker=by('pick');
  picker.insertAdjacentHTML('beforebegin','<p role="status" class="wheel-feedback"></p>');
  stage.querySelector('.wheel-feedback').textContent=wheelMessage||names[chosen]+' gehört zur Gruppe '+familyNames[order(chosen)]+'.';
  if(highlighted){
    picker.insertAdjacentHTML('afterend','<div class="wheel-legend"><button id="prevFamily">Vorherige Gruppenfarbe</button><button id="nextFamily">Nächste Gruppenfarbe</button></div>');
    for(const [id,dir] of [['prevFamily',-1],['nextFamily',1]])by(id).onclick=()=>{chooseColor(stepColor(dir));by(id).focus()};
  }
  stage.querySelector('.wheelpanel').insertAdjacentHTML('afterend','<div class="tools"><button id="zoomWheel">Farbkreis vergrößern</button></div><details class="surface"><summary>Farbnamen, Gruppen und Gegenfarben als Liste</summary><ul>'+names.map((n,i)=>'<li><b>'+n+'</b> · '+group(i)+' · gegenüber: '+names[opposite(i)]+'</li>').join('')+'</ul></details>');
  by('zoomWheel').onclick=()=>{
    const dlg=document.createElement('dialog');dlg.className='zoom-wheel';
    dlg.innerHTML='<button autofocus>Schließen</button><h2>Farbkreis mit Farbnamen</h2><div class="zoom-scroll"></div>';
    const svg=stage.querySelector('.wheel').cloneNode(true);svg.removeAttribute('tabindex');svg.setAttribute('role','img');svg.setAttribute('aria-label','Farbkreis mit zwölf Farbnamen');svg.setAttribute('viewBox','-52 -30 464 420');svg.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
    if(!namesOn)names.forEach((name,i)=>{const [x,y]=point(179,-90+30*i).split(' ');svg.insertAdjacentHTML('beforeend','<text x="'+x+'" y="'+y+'" fill="white" text-anchor="middle" font-size="11">'+name+'</text>')});
    dlg.querySelector('.zoom-scroll').append(svg);document.body.append(dlg);dlg.querySelector('button').onclick=()=>dlg.close();dlg.onclose=()=>{dlg.remove();by('zoomWheel')?.focus()};dlg.showModal();
  };
}
function quizProgress(){
 const counts=[0,0,0];questions.forEach((q,i)=>{const status=attempt.first[i]===q[2]?0:attempt.final[i]===q[2]?1:2;counts[status]++});
 return '<section class="note"><h3>Dein Lernweg im Quiz</h3>'+['Gleich gewusst','Mit Tipp gelöst','Lösung angesehen'].map((s,i)=>'<p>'+s+': <b>'+counts[i]+'</b></p>').join('')+'</section>';
}
function starters(id,phrases){
 const el=by(id),box=document.createElement('details');box.innerHTML='<summary>Satzanfänge nutzen</summary>';
 for(const phrase of phrases){
   const b=document.createElement('button');b.textContent=phrase+' …';b.onclick=()=>{
     const start=el.selectionStart??el.value.length,end=el.selectionEnd??start;
     const gap=start>0&&!/\s/.test(el.value[start-1])?' ':'';
     const text=gap+phrase+' ';
     if(el.maxLength>=0 && el.value.length-(end-start)+text.length>el.maxLength){el.focus();return}
     el.setRangeText(text,start,end,'end');el.dispatchEvent(new Event('input'));el.focus();
   };box.append(b);
 }
 el.parentElement.after(box);
}
function pictureExtras(){
 foxStudio();
 starters('starReason',['Ich sehe','Der Stern fällt auf, weil']);starters('skyReason',['Mein Himmel wirkt','Ich habe diese Farbe gewählt, weil','Das erkenne ich an']);
 const container=stage.querySelector('article');
 container.insertAdjacentHTML('beforeend','<details class="surface"><summary>Mein eigenes Sternpaar gestalten</summary><p>Halte die Sternfarbe für beide Bilder gleich. Verändere die Hintergründe und suche den stärksten Kontrast.</p><label>Sternfarbe<select id="starColor">'+options(names,Number(read('starColor')??0))+'</select></label><div class="star-pair" id="starStudio"></div><label>Vor welchem Hintergrund fällt der Stern stärker auf? Warum?<textarea id="studioReason"></textarea></label></details><details><summary>Erkläre: Blau neben Orange oder Blau in Orange?</summary><p>Wie lässt Blau das Orange stärker leuchten? Wie trübst du Orange mit Blau?</p><label>Meine Erklärung<textarea id="explainContrast"></textarea></label><details><summary>Musterantwort vergleichen</summary><p>Nebeneinander verstärken Orange und Blau den Kontrast. Rühre ich etwas Blau ins Orange, verliert die Mischung an Buntheit.</p></details></details>');
 noteField('explainContrast','explainContrast');noteField('studioReason','studioReason');
 const drawings=[...stage.querySelectorAll('article > .star-pair:first-of-type svg')];
 for(let i=0;i<2;i++){
   const div=document.createElement('div'),id='starBg'+i;div.innerHTML='<label>Hintergrund '+(i+1)+'<select id="'+id+'">'+options(names,Number(read(id)??(i?1:6)))+'</select></label>';
   const svg=(drawings[i]||stage.querySelector('.star-pair svg')).cloneNode(true);div.append(svg);by('starStudio').append(div);
 }
 function draw(){for(let i=0;i<2;i++){const bg=+by('starBg'+i).value,fg=+by('starColor').value,svg=by('starStudio').querySelectorAll('svg')[i];svg.querySelector('rect').setAttribute('fill',hex[bg]);svg.querySelector('path').setAttribute('fill',hex[fg]);svg.setAttribute('aria-label',names[fg]+' auf '+names[bg]);save('starBg'+i,bg)}save('starColor',by('starColor').value)}
 for(const id of ['starBg0','starBg1','starColor'])by(id).onchange=draw;draw();
}
const photoUrls=[];
function mountPhotos(){
  const input=by('photos'),target=by('localPhotos');
  input.insertAdjacentHTML('beforebegin','<p>Die Fotos bleiben beim Wechsel der Farben sichtbar. Beim Neuladen oder Schließen endet die Fotositzung.</p>');
  function draw(){
   target.replaceChildren();photoUrls.forEach((url,i)=>{const fig=document.createElement('figure'),img=new Image(),b=document.createElement('button');img.src=url;img.alt='Papierprobe '+(i+1);b.textContent='Foto '+(i+1)+' entfernen';b.onclick=()=>{URL.revokeObjectURL(photoUrls.splice(i,1)[0]);draw()};fig.append(img,b);target.append(fig)});input.disabled=photoUrls.length===3;
  }
  input.onchange=()=>{for(const file of input.files){if(file.type.startsWith('image/')&&photoUrls.length<3)photoUrls.push(URL.createObjectURL(file))}input.value='';draw()};draw();
}
function setRatio(n){
 const slider=by('ratio');slider.value=n;slider.dispatchEvent(new Event('input'));
}
const stripState=stored('comparisonStrip',{});
function setupExperiments(a,b){
 by('portions').insertAdjacentHTML('afterend','<details><summary>Mit Pinselportionen mischen</summary><p>Wähle je null bis vier Portionen. Die Prozentanzeige ist bei Dritteln oder Siebteln gerundet.</p><div class="tools">'+[a,b].map((c,i)=>'<label>'+names[c]+'<select id="brush'+i+'">'+options(['0','1','2','3','4'],1)+'</select></label>').join('')+'<button id="brushMix">Portionen mischen</button></div><p id="brushAnswer" role="status"></p></details>');
 by('brushMix').onclick=()=>{const x=+by('brush0').value,y=+by('brush1').value;if(x+y===0){by('brushAnswer').textContent='Wähle mindestens eine Portion.';return}setRatio(Math.round(100*y/(x+y)));by('portions').textContent='Gewähltes Rezept: '+x+' Portion(en) '+names[a]+' + '+y+' Portion(en) '+names[b]+'.';by('brushAnswer').textContent=x+' Portion(en) '+names[a]+' und '+y+' Portion(en) '+names[b]+'.'};
 by('observation').parentElement.insertAdjacentHTML('afterend','<label>Mein nächster Versuch<input id="reflection" maxlength="280"></label>');
 noteField('reflection','reflection'+a+'-'+b);starters('reflection',['Das hatte ich erwartet, weil','Das hat mich überrascht, weil','Als Nächstes ändere ich']);
 if(a===2&&b===8){
   sortExperiment();
   by('sample').insertAdjacentHTML('afterend','<details id="strip"><summary>Versuchsstreifen: Orange in drei Stufen</summary><p>Stelle 0 %, 10 % und 25 % Blau ein. Lege jede passende Probe hier ab.</p><div class="swatch-grid" id="stripCells"></div><button id="stripSave">Auf Versuchsstreifen ablegen</button><p id="stripHint" role="status"></p></details>');
   if(taskPalette)by('strip').open=true;
   by('stripSave').onclick=()=>{if(![0,10,25].includes(amount))return;stripState[amount]=true;save('comparisonStrip',JSON.stringify(stripState));updateStrip(a,b)};
 }
}
function brushRecipe(n,current){
 if(current[0]+current[1]>0&&Math.round(100*current[1]/(current[0]+current[1]))===n)return current;
 for(let total=1;total<=8;total++)for(let y=0;y<=Math.min(4,total);y++){
   const x=total-y;if(x<=4&&Math.round(100*y/total)===n)return [x,y];
 }
 return null;
}
function syncBrush(n){
 const x=by('brush0'),y=by('brush1');
 const recipe=brushRecipe(n,[+x.value,+y.value]);
 if(recipe){x.value=recipe[0];y.value=recipe[1]}
 by('brushAnswer').textContent=recipe?'Diese Portionen entsprechen der Prozentanzeige (gegebenenfalls gerundet).':'Diese Prozentzahl lässt sich mit bis zu vier Portionen je Farbe nicht treffen. Die Auswahl ist ein Vorschlag für dein nächstes Rezept.';
 x.onchange=y.onchange=()=>{by('brushAnswer').textContent='Dein nächstes Rezept. Mit „Portionen mischen“ übernimmst du es.'};
}
function updateStrip(a,b){
 syncBrush(amount);
 if(!by('stripCells'))return;
 by('stripCells').innerHTML=[0,10,25].map((n,i)=>'<figure><i style="background:'+(stripState[n]?pigmentPreview(hex[a],hex[b],n/100):'var(--tint)')+'"></i><figcaption>'+['Reines Orange','Wenig Blau','Mehr Blau'][i]+' · '+n+' % Blau · '+(stripState[n]?'abgelegt':'frei')+'</figcaption></figure>').join('');
 by('stripSave').disabled=![0,10,25].includes(amount)||!!stripState[amount];by('stripHint').textContent=[0,10,25].every(n=>stripState[n])?'Alle drei Proben sind zum Vergleichen bereit.':'Freie Felder sind beschriftet. Die freie Probenablage bleibt separat verfügbar.';
}
const practicalSets=[
 {family:2,base:0,ratio:25,opponent:9},
 {family:1,base:4,ratio:75,opponent:1},
 {family:2,base:8,ratio:25,opponent:5}
];
function freshPractice(round=0){return {round,index:0,done:[false,false,false],errors:[0,0,0],values:[[],50,[]]}}
let run=stored('practiceV2',null);
if(!run||!Number.isInteger(run.index)||!Number.isInteger(run.round)||run.round<0||run.index<0||run.index>2||![run.done,run.values,run.errors].every(a=>Array.isArray(a)&&a.length===3)){
 run=freshPractice();
 run.done=run.done.map((_,i)=>read('practical'+i)==='1');run.index=Math.max(0,run.done.indexOf(false));
}
let resumePractice=run.done.some(Boolean)||run.errors.some(Boolean)||run.values[0].length>0||run.values[1]!==50||run.values[2].length>0;
function keepRun(){save('practiceV2',JSON.stringify(run))}
function practiceHub(){
 const count=run.done.filter(Boolean).length;
 stage.innerHTML='<article class="surface"><h2>'+ (count===3?'Praxisrunde abgeschlossen':'Praxischeck fortsetzen?')+'</h2><p>'+count+' von 3 Aufgaben gelöst.</p><div class="tools">'+(count<3?'<button id="pResume">Fortsetzen</button>':'<button id="pVariant">Neue Variante starten</button>')+'<button id="pReset">Runde neu beginnen</button></div><h3>Gezielt üben</h3><div id="pReview" class="tools"></div></article>';
 function start(index){resumePractice=false;run.index=index;keepRun();practice()}
 if(by('pResume'))by('pResume').onclick=()=>start(run.done[run.index]?run.done.indexOf(false):run.index);
 if(by('pVariant'))by('pVariant').onclick=()=>{run=freshPractice(run.round+1);start(0)};
 by('pReset').onclick=()=>{if(confirm('Diesen Praxisdurchgang von vorn beginnen?')){run=freshPractice(run.round);start(0)}};
 ['Farbgruppe finden','Mischverhältnis einstellen','Gegenfarbe finden'].forEach((s,i)=>{
  const button=document.createElement('button');button.textContent=s+' · '+(run.errors[i]?'noch einmal vertiefen':run.done[i]?'bereits gelöst':'offen');button.onclick=()=>start(i);by('pReview').append(button);
 });
 attachReaders();
}
function practice(){
 if(resumePractice){practiceHub();return}
 const i=run.index,v=practicalSets[run.round%practicalSets.length],a=v.base,b=(a+4)%12;
 const targets=i===0?names.map((_,j)=>j).filter(j=>order(j)===v.family):[opposite(v.opponent)];
 const prompt=['Finde alle drei '+familyNames[v.family]+' im Kreis.',
   'Mische '+(v.ratio===25?'drei Teile '+names[a]+' mit einem Teil '+names[b]:'einen Teil '+names[a]+' mit drei Teilen '+names[b])+'.',
   'Markiere die Gegenfarbe zu '+names[v.opponent]+'.'][i];
 const controls=i===1?'<label for="exerciseRatio">Anteil '+names[b]+'</label><input id="exerciseRatio" class="range" type="range" min="0" max="100"><div class="tools"><button id="minus">1 % weniger</button><output id="exerciseValue"></output><button id="plus">1 % mehr</button></div><div class="sample" id="exerciseSample"></div>':practicalRing(i===0);
 stage.innerHTML='<article class="surface"><p class="eyebrow">PRAXISCHECK · '+(i+1)+' VON 3</p><h2>'+prompt+'</h2>'+reader(prompt)+controls+'<div class="tools"><button id="verify" class="primary">Auswahl prüfen</button><span id="readPick"></span></div><p id="verdict" role="status"></p><div id="practiceNext"></div><details><summary>Rundenübersicht und Wiederholen</summary><button id="pOverview">Zur Übersicht</button></details></article>';
 const picks=[...stage.querySelectorAll('[name="pickPractice"]')];
 function readSelection(){const text=i===1?by('exerciseValue').textContent:picks.filter(el=>el.checked).map(el=>names[+el.value]).join(', ')||'keine Farbe';by('readPick').innerHTML=reader('Deine Auswahl: '+text).replace('>Vorlesen<','>Auswahl vorlesen<')}
 function clear(){by('verdict').textContent='';by('practiceNext').replaceChildren();readSelection();keepRun()}
 if(i===1){
  const slider=by('exerciseRatio');slider.value=run.values[i];
  slider.oninput=()=>{const n=+slider.value;run.values[i]=n;by('exerciseValue').textContent=(100-n)+' % '+names[a]+' + '+n+' % '+names[b];const pos=n/25,k=Math.min(3,Math.floor(pos));by('exerciseSample').style.background=interp(hex[(a+k)%12],hex[(a+k+1)%12],pos-k);clear()};
  for(const [id,step] of [['minus',-1],['plus',1]])by(id).onclick=()=>{slider.value=+slider.value+step;slider.oninput()};
  slider.oninput();
 }else{
  function mark(){picks.forEach((el,j)=>{const circle=stage.querySelector('[data-pick="'+j+'"] circle');circle.setAttribute('stroke',el.checked?'#151c45':'none');circle.setAttribute('stroke-width',5)});run.values[i]=picks.filter(el=>el.checked).map(el=>+el.value);clear()}
  picks.forEach((el,j)=>{el.checked=run.values[i].includes(j);el.onchange=mark;stage.querySelector('[data-pick="'+j+'"]').onclick=()=>el.click()});mark();
 }
 practiceHints(i,v,targets);
 by('pOverview').onclick=()=>{resumePractice=true;practiceHub()};
 by('verify').onclick=()=>{
  const selected=i===1?[]:run.values[i],hit=selected.filter(j=>targets.includes(j)),wrong=selected.filter(j=>!targets.includes(j));
  if(i!==1&&!selected.length){by('verdict').textContent='Wähle zuerst eine Farbe im Kreis oder in der Liste. Danach kannst du deine Auswahl prüfen.';return}
  const correct=i===1?run.values[i]===v.ratio:hit.length===targets.length&&!wrong.length;
  let message='';
  if(correct)message=i===1?'Genau. Deine vier gleich großen Portionen ergeben '+v.ratio+' % '+names[b]+'.':'Richtig: '+targets.map(j=>names[j]).join(', ')+'.';
  else if(i===0){
   message=(hit.length?'Schon gefunden: '+hit.map(j=>names[j]).join(', ')+'. ':'')+(wrong.length?'Überprüfe '+names[wrong[0]]+': Das ist eine '+group(wrong[0])+'. ':'');
   if(hit.length<targets.length){const missing=targets.find(j=>!hit.includes(j));message+=v.family===2?'Welche Farbe entsteht aus '+names[(missing+10)%12]+' und '+names[(missing+2)%12]+'?':'Suche auch die Grundfarbe zwischen '+names[(missing+11)%12]+' und '+names[(missing+1)%12]+'.'}
  }else message=i===1?'Überlege: Wie viel Prozent ist eine von vier Portionen? Nutze die Einzelschritte.':'Diese Auswahl passt noch nicht. Suche auf der anderen Kreishälfte oder öffne einen Hinweis.';
  by('verdict').textContent=message;
  if(!correct && i===1 && run.values[i]===100-v.ratio)by('verdict').textContent='Die beiden Mengen sind vertauscht. Der Regler gibt den Anteil '+names[b]+' an.';
  if(!correct){run.errors[i]++;keepRun();return}
  run.done[i]=true;save('practical'+i,'1');keepRun();
  const next=run.done.indexOf(false);by('practiceNext').innerHTML='<button id="nextPractice">'+(next<0?'Zur Rundenübersicht':'Nächste Aufgabe')+'</button>';
  const reflection=document.createElement('details');
  reflection.innerHTML='<summary>Wie hast du die Aufgabe gelöst?</summary><label>Mein Weg (freiwillig)<select>'+['Bitte wählen','Ich habe die Positionen verglichen.','Ich habe die Portionen gezählt.','Ich habe ausprobiert.','Wir haben darüber gesprochen.'].map((s,j)=>'<option value="'+j+'">'+s+'</option>').join('')+'</select></label>';
  const strategy=reflection.querySelector('select'),key='strategy.'+run.round+'.'+i;strategy.value=read(key)||'0';strategy.onchange=()=>save(key,strategy.value);by('practiceNext').append(reflection);
  by('nextPractice').onclick=()=>{if(next<0){resumePractice=true;practiceHub()}else{run.index=next;keepRun();practice()}};
 };
}

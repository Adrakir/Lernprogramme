'use strict';

function elternFragen(){
 return '<details class="family-questions"><summary>Drei Fragen zum gemeinsamen Entdecken</summary><ol><li><strong>Was vermutest du?</strong> Zeige auf die Farbe, die du erwartest.</li><li><strong>Was hast du verändert?</strong> Beschreibe einen Schritt beim Mischen.</li><li><strong>Woran erkennst du den Unterschied?</strong> Lege die erste und die letzte Probe nebeneinander.</li></ol><p>Eine Frage genügt zum Einstieg. Das Kind darf zeigen, erzählen oder erst einmal ausprobieren.</p></details>';
}

// Numbers stay legible on monochrome printers and correspond to the adjacent names.
function familienKreis(selected=-1, selectable=false){
 const wedges=names.map((name,i)=>{
  const start=-105+30*i, end=start+30;
  const xy=point(126,start+15).split(' ');
  return '<g'+(selectable?' data-family-field="'+i+'"':'')+'><path d="M '+point(158,start)+' A 158 158 0 0 1 '+point(158,end)+' L '+point(81,end)+' A 81 81 0 0 0 '+point(81,start)+' Z" fill="'+hex[i]+'" stroke="#24263a" stroke-width="2"/><circle cx="'+xy[0]+'" cy="'+xy[1]+'" r="'+(selected===i?21:14)+'" fill="white" stroke="#24263a" stroke-width="'+(selected===i?5:1)+'"/><text x="'+xy[0]+'" y="'+xy[1]+'" dy=".35em" text-anchor="middle" font-size="17" fill="#141623">'+(i+1)+'</text></g>';
 });
 return '<svg class="family-wheel" role="img" aria-label="Farbkreis nach Itten. Nummern und Farbnamen stehen in der Legende." viewBox="16 16 328 328">'+wedges.join('')+'</svg>';
}
function familienLegende(){
 return '<ol class="family-legend">'+names.map((name,i)=>'<li><span style="background:'+hex[i]+'"></span>'+name+'</li>').join('')+'</ol>';
}
function familienMerkblatt(){
 return '<h2>Farben mischen und vergleichen</h2><p>Finde einen Farbton im Kreis. Zähle sechs Felder weiter: Dort liegt seine Gegenfarbe.</p><div class="family-print-wheel">'+familienKreis()+familienLegende()+'</div><h3>Drei Startrezepte für den Malkasten</h3><ol><li><b>Orange:</b> Beginne mit Gelb. Rühre nach und nach Rot hinein, bis dein Orange passt.</li><li><b>Gelb-Orange:</b> Probiere drei gleich große Portionen Gelb und eine Portion Rot. Passe die Mengen an deinen Malkasten an.</li><li><b>Gedämpftes Orange:</b> Lege etwas Orange beiseite. Gib in den Rest eine kleine Pinselspitze Blau und vergleiche.</li></ol><h3>Dein Bild</h3><p>Wo möchtest du Orange besonders auffallen lassen? Male in das erste Feld Orange neben einer anderen Farbe und ins zweite Feld die Mischung aus beiden.</p><div class="family-workboxes"><div>Nebeneinander</div><div>Gemischt</div></div><p>Das ist mir aufgefallen: ________________________________________________</p>';
}
function familie(){
 stage.innerHTML='<article class="surface family-home"><p class="eyebrow">ZU HAUSE</p><h2>Gemeinsam Farben entdecken</h2><p>Für eine kurze Runde reichen etwa zehn Minuten. Die Zeitangaben helfen beim Planen. Ihr könnt jederzeit pausieren.</p><section class="family-round" aria-label="Zehn-Minuten-Runde" id="familyRound"></section>'+elternFragen()+
 '<details><summary>Was zeigt der bisherige Praxischeck?</summary><div id="familyProgress"></div><a href="#praxis">Praxischeck öffnen</a></details>'+
 '<details><summary>Ein Versuch mit dem eigenen Malkasten</summary><p>Ihr braucht Deckfarben, einen sauberen Pinsel, Wasser, ein Stück Papier und Platz auf der Palette. Zeichnet drei kleine Felder auf dasselbe Papier.</p><ol><li>Mischt genügend Orange und verteilt es auf drei gleich große Häufchen. Füllt das erste Feld mit eurem reinen Orange.</li><li>Nehmt mit der Pinselspitze ein wenig Blau auf. Mischt es in das zweite Häufchen und malt das zweite Feld.</li><li>Gebt in das dritte Häufchen zwei gleich kleine Spitzen Blau. Malt das dritte Feld und lasst alle drei trocknen.</li></ol><div class="family-strip"><span>Orange</span><span>Wenig Blau dazu</span><span>Mehr Blau dazu</span></div><p>So <em>könnte</em> die Reihe aussehen. Euer Orange kann mit Blau bräunlich, grau oder dunkler werden. Pigment, Wassermenge und Pinselspitze beeinflussen das Ergebnis. Welche eurer drei Proben wirkt am kräftigsten?</p></details>'+
 '<details><summary>Mein Kind hängt beim Verhältnis 3 zu 1 fest</summary><p>Legt vier gleich große Plättchen hin oder nutzt die vier Knöpfe. Jeder steht für eine gleich große Portion. Durch Antippen wechselt eine Portion zwischen Gelb und Rot. Stellt drei Gelb und ein Rot ein.</p><div id="familyTiles" class="family-tiles"></div><p role="status" id="familyCount"></p><p>Wählt im Labor das Paar Gelb und Rot. Welchen Anteil Rot zeigen eure vier Plättchen?</p><a href="#mischlabor?auftrag=plaettchen">Im Grundfarbenlabor nachmischen</a></details>'+
 '<details><summary>Farbkreis und drei Rezepte auf einem Blatt</summary><p>Das Blatt passt im Hochformat auf eine A4-Seite mit normalen Druckrändern. Die Nummern verbinden die Farbfelder mit der Legende, auch im Schwarz-Weiß-Druck.</p><button id="familyPrint">Merkblatt drucken</button><details><summary>Druckvorschau ansehen</summary><article class="family-handout">'+familienMerkblatt()+'</article></details></details>'+
 '<details><summary>Wo bleiben unsere Versuche?</summary><p><b>Persönlicher Lernstand:</b> Einträge bleiben in diesem Browser auf diesem Gerät auch nach dem Schließen des Tabs erhalten, solange seine Website-Daten gespeichert sind. Im privaten Browserfenster kann der Browser sie beim Schließen löschen.</p><p><b>Gastdurchgang:</b> Er hat eigene Einträge für diesen Tab. Beim Beenden des Gastdurchgangs werden diese verworfen. Sichert sie vor dem Beenden oder Schließen über „Als Text herunterladen“ im Lernpass.</p><p><b>Gerätewechsel:</b> Der Schul-iPad-Lernstand wird nicht automatisch auf den Familien-PC übertragen. Nehmt die Textdatei oder einen Ausdruck mit. Damit könnt ihr eure Beobachtungen am anderen Gerät nachlesen.</p><a href="#lernpass">Zum Lernpass und Textdownload</a></details>'+
 '<details><summary>Beim nächsten Mal: mein Rezept wiederfinden</summary><div id="familyRecall"></div></details></article>';
 familienRunde();
 const notes=[
  ['Farbgruppe','Im Praxischeck wurden die gesuchten Farben einer Gruppe ausgewählt.','Nennt eine gefundene Farbe. Ist sie eine Grundfarbe im Modell nach Itten oder entsteht sie beim Mischen?'],
  ['Mengenverhältnis','Im Praxischeck wurde das geforderte Mengenverhältnis eingestellt.','Legt das Rezept mit vier gleich großen Plättchen.'],
  ['Gegenfarbe','Im Praxischeck wurde die passende Gegenfarbe ausgewählt.','Zeigt am Kreis, wie man die Gegenfarbe ohne Ausprobieren findet.']
 ];
 const completed=notes.map((_,i)=>Boolean(run.done[i])||read('practical'+i)==='1');
 by('familyProgress').innerHTML=completed.some(Boolean)?'<ul>'+notes.map(([skill,observed,next],i)=>completed[i]?'<li><b>'+skill+'</b> · '+observed+' '+next+'</li>':'').join('')+'</ul><p>Die App erfasst die richtige Auswahl. Fragt euer Kind, wie es darauf gekommen ist und welche Hilfe es genutzt hat.</p>':'<p>Hier wurde noch keine gelöste Praxisaufgabe gespeichert. Beginnt mit einer Farbe und lasst euch zeigen, wo sie im Kreis liegt.</p>';
 const savedTiles=stored('familyTiles',[]);
 const tileColors=Array.isArray(savedTiles)&&savedTiles.length===4&&savedTiles.every(c=>typeof c==='boolean')?savedTiles:[false,false,false,false];
 function drawTile(i){
  const tile=by('familyTiles').children[i],red=tileColors[i];tile.textContent=red?'Rot':'Gelb';
  tile.style.background=red?hex[4]:hex[0];tile.setAttribute('aria-label','Portion '+(i+1)+': '+tile.textContent+'. Farbe wechseln');
 }
 function count(){
  const r=tileColors.filter(Boolean).length;by('familyCount').textContent=(4-r)+' Gelb und '+r+' Rot. '+(r===1?'Genau. Eine von vier Portionen ist rot. Ein Viertel entspricht 25 %.':'Wie viele Plättchen sollen rot sein?');
 }
 tileColors.forEach((_,i)=>{const btn=document.createElement('button');by('familyTiles').append(btn);drawTile(i);btn.onclick=()=>{tileColors[i]=!tileColors[i];save('familyTiles',JSON.stringify(tileColors));drawTile(i);count()}});count();
 by('familyPrint').onclick=()=>{
  document.querySelector('.print-sheet')?.remove();
  const sheet=document.createElement('article');sheet.className='print-sheet family-handout';sheet.innerHTML=familienMerkblatt();document.body.append(sheet);window.addEventListener('afterprint',()=>sheet.remove(),{once:true});window.print();
 };
 familienRueckblick();
}
function familienRunde(){
 const state=stored('familienrunde',{}), validInt=(n,max)=>Number.isInteger(n)&&n>=0&&n<=max;
 let step=validInt(state?.step,3)?state.step:0;
 let choice=validInt(state?.choice,11)?state.choice:-1;
 let blue=validInt(state?.blue,50)?state.blue:0;
 let note=typeof state?.note==='string'?state.note.slice(0,350):'';
 const box=by('familyRound');
 function keep(){save('familienrunde',JSON.stringify({step,choice,blue,note}))}
 function draw(focus=false){
  const titles=['Im Kreis finden','Orange verändern','Beobachtung erklären','Für heute fertig'];
  box.innerHTML='<p class="eyebrow">'+['2 MINUTEN · SCHRITT 1 VON 3','5 MINUTEN · SCHRITT 2 VON 3','3 MINUTEN · SCHRITT 3 VON 3','ZEHN-MINUTEN-RUNDE'][step]+'</p><h3 tabindex="-1">'+titles[step]+'</h3><div id="familyAction"></div><div class="tools" id="familySteps"></div>';
  const action=by('familyAction');
  if(step===0){
   action.innerHTML='<p>Suche Orange im Kreis. Welche Nummer trägt das Feld? Tippe auf das Farbfeld oder wähle seine Nummer in der Liste.</p><div id="familySearchWheel"></div><label>Meine Feldnummer<select id="familyPick"><option value="">Nummer auswählen</option>'+names.map((_,i)=>'<option value="'+i+'">'+(i+1)+'</option>').join('')+'</select></label><p id="familyPickFeedback" role="status"></p><details><summary>Hilfe mit Farbnamen</summary>'+familienLegende()+'</details>';
   function show(){by('familySearchWheel').innerHTML=familienKreis(choice,true);by('familyPickFeedback').textContent=choice===-1?'':choice===2?'Gefunden! Orange liegt zwischen Gelb-Orange und Rot-Orange.':'Du hast '+names[choice]+' gewählt. Suche zwischen Gelb und Rot, auf halber Strecke.'}
   function selectField(index){
    choice=index;
    by('familyPick').value=choice<0?'':String(choice);
    show();keep();
   }
   by('familySearchWheel').onclick=e=>{
    const field=e.target.closest('[data-family-field]');
    if(field)selectField(Number(field.dataset.familyField));
   };
   by('familyPick').onchange=e=>selectField(e.target.value===''?-1:Number(e.target.value));
   by('familyPick').value=choice<0?'':String(choice);show();
  }else if(step===1){
   action.innerHTML='<p>Bewege den Regler. Vergleiche die Mischung rechts mit dem reinen Orange links. Versuche erst wenig Blau und dann etwas mehr.</p><label>Blauanteil in der Mischung <output id="familyAmount" for="familyBlue"></output><input class="range" type="range" id="familyBlue" min="0" max="50" value="'+blue+'"></label><div class="family-colors"><figure><i style="background:'+hex[2]+'"></i><figcaption>Reines Orange</figcaption></figure><figure><i id="familyMixed"></i><figcaption>Deine Mischung</figcaption></figure></div>';
   function mixSample(){by('familyMixed').style.background=pigmentPreview(hex[2],hex[8],blue/100);by('familyAmount').value=blue+' %';by('familyBlue').setAttribute('aria-valuetext',blue+' Prozent Blau')};by('familyBlue').oninput=e=>{blue=+e.target.value;mixSample();keep()};mixSample();
  }else if(step===2){
   const question=blue===0?'In beiden Feldern siehst du reines Orange. Was erwartest du, wenn ein wenig Blau dazukommt? Du kannst zum Mischen zurückgehen.':'Du hast '+blue+' % Blau eingestellt. Was hat sich gegenüber dem reinen Orange verändert?';
   action.innerHTML='<p>'+question+' Erzähle es jemandem oder schreibe einen Satz.</p><div class="family-colors"><figure><i style="background:'+hex[2]+'"></i><figcaption>Reines Orange</figcaption></figure><figure><i style="background:'+pigmentPreview(hex[2],hex[8],blue/100)+'"></i><figcaption>Dein Farbton</figcaption></figure></div><label>Meine Beobachtung (freiwillig)<textarea id="familyNote" rows="2" maxlength="350"></textarea></label><details><summary>Ein Satzanfang</summary><p>Die rechte Probe wirkt auf mich … Das erkenne ich daran, dass …</p></details>';
   by('familyNote').value=note;by('familyNote').oninput=e=>{note=e.target.value;keep()};
  }else{
   action.innerHTML='<p>Hier endet eure gemeinsame Runde. Beim nächsten Mal könnt ihr die Mischung mit echten Deckfarben ausprobieren.</p>';
   if(note){const p=document.createElement('p');p.textContent='Deine Beobachtung: '+note;action.append(p)}
  }
  const controls=by('familySteps');
  function button(text,fn){const b=document.createElement('button');b.textContent=text;b.onclick=fn;controls.append(b)}
  if(step>0)button('Einen Schritt zurück',()=>{step--;keep();draw(true)});
  if(step<3)button(step===2?'Runde abschließen':'Zum nächsten Schritt',()=>{step++;keep();draw(true)});
  else button('Neue Runde beginnen',()=>{step=0;choice=-1;blue=0;note='';keep();draw(true)});
  if(focus)box.querySelector('h3').focus();
 }
 draw();
}
function familienRueckblick(){
 const container=by('familyRecall');
 const choices=[];
 const add=(list,label)=>list.forEach((s,i)=>choices.push({sample:s,label:label+' · Probe '+(i+1)}));
 add(recordSamples(),'Aktueller Versuch');
 validArchive().forEach((rec,i)=>add(rec.samples,'Archivversuch '+(i+1)+(rec.date?' · '+rec.date:'')));
 if(!choices.length){container.innerHTML='<p>Sobald eine Farbprobe in eurem Lernpass liegt, könnt ihr hier ihr Rezept erraten. Legt dafür eine Probe im Mischlabor ab und kopiert sie im Lernpass in euren Versuch.</p><a href="#lernpass">Lernpass öffnen</a>';return}
 container.innerHTML='<p>Wähle eine ältere Probe. Versuche ihr Rezept zu beschreiben, bevor du nachsiehst. Welche zwei Farben würdest du nehmen? Von welcher mehr?</p><label>Gespeicherte Probe<select id="familyMemory"></select></label><div class="family-colors" id="familyMemoryColor"></div><details id="familyMemoryAnswer"><summary>Rezept vergleichen</summary><p data-voice="1"></p><div class="family-memory-reader"></div></details>';
 const select=by('familyMemory');
 choices.forEach(({label},i)=>select.add(new Option(label,String(i))));
 function draw(){
  const selected=choices[Number(select.value)];by('familyMemoryColor').replaceChildren(sampleFigure(selected.sample,'Gespeicherte Mischung'));
  const answer=by('familyMemoryAnswer');
  const explanation=sampleRecipe(selected.sample)+(selected.sample.note?' · Damalige Beobachtung: '+selected.sample.note:'');
  answer.open=false;answer.querySelector('p').textContent=explanation;
  answer.querySelector('.family-memory-reader').innerHTML=reader(explanation);
 }
 select.onchange=()=>{window.speechSynthesis?.cancel();draw()};draw();
}

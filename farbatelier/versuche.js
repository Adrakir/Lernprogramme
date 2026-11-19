'use strict';
function goalDemo(i){
 const examples=[
 ['Orange liegt zwischen Gelb und Rot. Zu welcher Gruppe gehört es?',dot(0)+' + '+dot(4)+' ergibt '+dot(2)+'. Eine Mischung aus zwei Grundfarben ist eine Sekundärfarbe.'],
 ['Vier gleich große Portionen: Drei sind gelb. Wie viel Rot bleibt?',dot(0)+' '+dot(0)+' '+dot(0)+' '+dot(4)+' · Eine von vier Portionen ist rot. Das sind 25 %.'],
 ['Welche Wirkung erwartest du, wenn du Orange und Blau nebeneinander malst? Und wenn du sie verrührst?',dot(2)+' neben '+dot(8)+': Die Kante fällt auf. Beim Mischen entsteht ein gedämpfter Farbton.'],
 ['Wo vermutest du die Gegenfarbe zu Gelb-Grün? Zeige zuerst auf ein Feld im Farbkreis.',dot(11)+' liegt sechs Felder von '+dot(5)+' entfernt. Rot-Violett ist die Gegenfarbe.']
 ];
 return '<details><summary>Zeig es mir</summary><p>'+examples[i][0]+'</p><details><summary>Meine Idee vergleichen</summary><p>'+examples[i][1]+'</p></details></details>';
}
function sampleSnapshot(list){return list.map(s=>({...s}))}
function bookState(){
 const state=stored('recordBook',null);
 if(state&&typeof state.active==='string'&&Array.isArray(state.archive))return state;
 const old=stored('pass.archive',[]);
 return {active:'first',archive:Array.isArray(old)?old:[]};
}
function hasSample(s){
 return s&&Number.isInteger(s.a)&&names[s.a]&&Number.isInteger(s.b)&&names[s.b]&&Number.isInteger(s.n)&&s.n>=0&&s.n<=100&&typeof s.color==='string'&&/^rgb\([\d, ]+\)$/.test(s.color);
}
function validArchivedRecord(r){
 return r&&typeof r.title==='string'&&typeof r.date==='string'&&Array.isArray(r.goals)&&r.goals.every(x=>typeof x==='string')&&Array.isArray(r.entries)&&r.entries.every(e=>e&&typeof e.label==='string'&&typeof e.value==='string')&&Array.isArray(r.samples)&&r.samples.every(hasSample);
}
function validArchive(){
 return bookState().archive.filter(validArchivedRecord).map((rec,i)=>{
  if(rec.id&&rec.samples.every(s=>s.id))return rec;
  const id=rec.id||'legacy-'+i,list=rec.samples.map((s,j)=>({...s,id:s.id||id+'-probe-'+j}));
  return {...rec,id,samples:list,referenceId:rec.referenceId||list[rec.reference]?.id||''};
 });
}
function recordSamples(){
 const data=stored('pass.samples',[]),list=Array.isArray(data)?data.filter(hasSample):[];
 if(list.some(s=>!s.id)){list.forEach(s=>{s.id=s.id||crypto.randomUUID()});setRecordSamples(list)}
 if(read('pass.referenceId')===null){const index=Number(read('pass.reference')??-1);save('pass.referenceId',list[index]?.id||'')}
 return list;
}
function setRecordSamples(list){save('pass.samples',JSON.stringify(list))}
function sampleFigure(sample,caption){
 const f=document.createElement('figure'),paint=document.createElement('i'),cap=document.createElement('figcaption');
 paint.style.background=sample.color;cap.textContent=caption;f.append(paint,cap);return f;
}
const allFields=()=>[...reportFields,['partner','Partnergespräch'],['nextGoal','Mein nächstes Ziel']];
function currentRecord(){
 return {id:bookState().active,title:read('pass.title')||'',date:read('pass.date')||'',
  goals:learningGoals.map(([label],i)=>label+' – '+by('goal'+i).selectedOptions[0].textContent),
  entries:allFields().map(([id,label])=>({id,label,value:read('pass.'+id)||'',oral:read('pass.oral.'+id)==='1'})),
  samples:sampleSnapshot(recordSamples()),referenceId:read('pass.referenceId')||''};
}
function recordText(rec,withSamples=true){
 const lines=[rec.title||'Mein Farbversuch',rec.date||'', 'Meine Lernziele',...rec.goals];
 rec.entries.forEach(e=>lines.push(e.label+'\n'+([e.value,e.oral?'Mündlich besprochen':''].filter(Boolean).join(' · ')||'________________________________________')));
 if(withSamples)rec.samples.forEach((s,i)=>lines.push((s.id===rec.referenceId?'Referenzprobe · ':'Probe '+(i+1)+' · ')+sampleText(s)));
 return lines.filter(Boolean).join('\n\n');
}
function downloadRecord(rec){
 const a=document.createElement('a'),url=URL.createObjectURL(new Blob([recordText(rec)],{type:'text/plain;charset=utf-8'}));
 a.href=url;a.download=[rec.date,(rec.title||'Mein-Farbversuch').replace(/[^\p{L}\p{N}_-]+/gu,'-')].filter(Boolean).join('_')+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
}
function printRecord(rec){
 document.querySelector('.print-sheet')?.remove();
 const sheet=document.createElement('article');sheet.className='print-sheet';sheet.textContent=recordText(rec,false);
 if(rec.samples.length){
  const grid=document.createElement('div');grid.className='swatch-grid';rec.samples.forEach((s,i)=>grid.append(sampleFigure(s,(s.id===rec.referenceId?'Referenzprobe · ':'')+sampleText(s))));sheet.append(grid);
 }
 document.body.append(sheet);window.addEventListener('afterprint',()=>sheet.remove(),{once:true});window.print();
}
function setupRecord(){
 const header=by('recordHeader');
 header.innerHTML='<label>Versuchstitel (freiwillig, ohne Namen)<input id="passTitle" maxlength="80"></label><label>Versuchsdatum (freiwillig)<input type="date" id="passDate"></label><details><summary>Beispielversuch ansehen</summary><p>Auf drei Felder kommen je vier gleiche Portionen Orange. Papier, Pinsel und Orange bleiben gleich. Nur die Menge Blau ändert sich.</p><div class="swatch-grid" id="modelStrip"></div><p>Welche Probe wirkt für dich am kräftigsten? Nutze darunter eine eigene Frage für deinen Versuch.</p></details>';
 [0,1,2].forEach(n=>by('modelStrip').append(sampleFigure({color:pigmentPreview(hex[2],hex[8],n/(4+n))},'4 Portionen Orange + '+n+' Portionen Blau')));
 noteField('passTitle','pass.title');noteField('passDate','pass.date');
 allFields().forEach(([id,label])=>{
  const box=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=read('pass.oral.'+id)==='1';
  check.setAttribute('aria-label',label+' mündlich besprochen');check.onchange=()=>save('pass.oral.'+id,check.checked?'1':'0');
  box.append(check,' Mündlich besprochen');by(id).parentElement.after(box);
 });
 if(read('pass.samples')===null)setRecordSamples(sampleSnapshot(samples));
 const grid=by('reportSamples');
 grid.insertAdjacentHTML('afterend','<label>Probe aus der Laborablage<select id="importChoice"></select></label><button id="importSample">In diesen Versuch kopieren</button><p id="importStatus" role="status"></p><p><a href="#mischlabor">Weitere Proben im Mischlabor anlegen</a></p>');
 const select=by('importChoice');select.innerHTML=options(samples.map(sampleTextSafe),0);by('importSample').disabled=!samples.length;
 function draw(){
  grid.replaceChildren();const list=recordSamples(),reference=read('pass.referenceId');
  if(!list.length)grid.textContent='Hier kannst du Laborproben mit Rezept und Beobachtung für diesen Versuch sammeln.';
  list.forEach((s,i)=>{
   const f=sampleFigure(s,sampleText(s)),label=document.createElement('label'),radio=document.createElement('input');radio.type='radio';radio.name='reference';radio.checked=s.id===reference;radio.setAttribute('aria-label','Probe '+(i+1)+' als Referenz');radio.onchange=()=>save('pass.referenceId',s.id);label.append(radio,' Referenzprobe');
   const remove=document.createElement('button');remove.textContent='Aus Versuch lösen';remove.onclick=()=>{list.splice(i,1);if(s.id===read('pass.referenceId'))save('pass.referenceId','');setRecordSamples(list);draw();by('importStatus').textContent='Probe aus diesem Versuch gelöst.'};f.append(label,remove);grid.append(f);
  });
 }
 by('importSample').onclick=()=>{const list=recordSamples();list.push({...samples[Number(select.value)],id:crypto.randomUUID()});setRecordSamples(list);draw();by('importStatus').textContent='Rezept und Beobachtung wurden in den Versuch kopiert.'};draw();
 by('copyPass').onclick=()=>{downloadRecord(currentRecord());by('passStatus').textContent='Der Textdownload wurde gestartet.'};by('printPass').onclick=()=>printRecord(currentRecord());
 const area=document.createElement('details');area.innerHTML='<summary>Folgeversuch und frühere Versuche</summary><p>Beim Start wird dein aktuelles Protokoll mit seinen Proben ins Archiv gelegt.</p><label><input type="checkbox" id="inherit"> Frage und gleichbleibende Bedingungen übernehmen</label><button id="follow">Folgeversuch beginnen</button><div id="archive"></div>';by('passStatus').after(area);
 const archive=validArchive();
 if(archive.length!==bookState().archive.length)by('archive').textContent='Ein beschädigter Archiveintrag konnte nicht angezeigt werden. Die übrigen Versuche sind verfügbar.';
 archive.forEach((rec,i)=>{const item=document.createElement('details'),summary=document.createElement('summary'),pre=document.createElement('div');summary.textContent=[rec.title||'Versuch '+(i+1),rec.date].filter(Boolean).join(' · ');pre.className='record-preview';pre.textContent=recordText(rec);const print=document.createElement('button'),dl=document.createElement('button');print.textContent='Versuch drucken';dl.textContent='Text herunterladen';print.onclick=()=>printRecord(rec);dl.onclick=()=>downloadRecord(rec);item.append(summary,pre,dl,print);by('archive').append(item)});
 by('follow').onclick=()=>{
  const rec=currentRecord(),inherit=by('inherit').checked,active=crypto.randomUUID(),book=bookState();
  const draft={samples:'[]',plan:inherit?read('pass.plan')||'':'',same:inherit?read('pass.same')||'':''};
  // Prepare a new, invisible draft. One atomic write publishes its pointer and the archived snapshot.
  for(const [field,value] of Object.entries(draft)){
   const key='draft.'+active+'.'+field;save(key,value);
   if(unsaved.has(storageKey(key))){by('passStatus').textContent='Der Folgeversuch konnte nicht gespeichert werden. Dein aktuelles Protokoll bleibt geöffnet.';return}
  }
  save('recordBook',JSON.stringify({active,archive:[...book.archive,rec]}));
  if(unsaved.has(storageKey('recordBook'))){unsaved.delete(storageKey('recordBook'));by('passStatus').textContent='Der vorige Versuch konnte nicht archiviert werden. Sichere ihn bitte als Text.';return}
  learningPass();attachReaders();by('passTitle').focus();by('passStatus').textContent='Der vorige Versuch liegt im Archiv.';
 };
 partnerExercise(area);
}
function sampleTextSafe(s,i){return 'Probe '+(i+1)+' · '+sampleRecipe(s)}
function partnerExercise(area){
 const panel=document.createElement('details');panel.innerHTML='<summary>Partnerrätsel mit einer Farbprobe</summary><p>Wähle heimlich eine Probe aus deinem Versuch. Öffne das Rätsel und gib das Gerät weiter. Dein Gegenüber darf raten oder sich die Probe beschreiben lassen.</p><label>Probe für das Rätsel<select></select></label><button>Rezept verdecken und Rätsel starten</button>';area.before(panel);
 const select=panel.querySelector('select'),start=panel.querySelector('button');
 panel.ontoggle=()=>{if(panel.open){const list=recordSamples();select.innerHTML=options(list.map(sampleTextSafe),0);start.disabled=!list.length;if(!list.length)select.add(new Option('Zuerst eine Laborprobe übernehmen',''))}};
 start.onclick=()=>{
  const s=recordSamples()[Number(select.value)];if(!s)return;
  const dlg=document.createElement('dialog');dlg.className='partner-dialog';dlg.setAttribute('aria-label','Verdeckte Farbprobe');
  dlg.innerHTML='<h2>Welche Farben stecken darin?</h2><div class="sample" role="img" aria-label="Unbeschriftete Mischprobe"></div><label>Unsere Vermutung (auch mündlich möglich)<input maxlength="180"></label><details><summary>Rezept aufdecken</summary><p></p></details><button>Rätsel schließen</button>';dlg.querySelector('.sample').style.background=s.color;dlg.querySelector('p').textContent=sampleText(s);document.body.append(dlg);dlg.querySelector('button').onclick=()=>dlg.close();dlg.onclose=()=>{dlg.remove();start.focus()};dlg.showModal();
 };
}
function foxStudio(){
 const section=document.createElement('details');section.open=location.hash.endsWith('motiv=fuchs');section.innerHTML='<summary>Zwei Füchse im Herbstlaub</summary><p>Beide Füchse haben genau dieselbe Fellfarbe. Wähle Hintergründe, auf denen einer auffällt und der andere sich versteckt.</p><div class="star-pair"></div><label>Wo fällt der Fuchs auf? Woran erkennst du es?<textarea id="foxReason"></textarea></label><a href="#lernpass">Zurück zum Lernpass</a>';
 stage.querySelector('article').prepend(section);noteField('foxReason','foxReason');
 for(let i=0;i<2;i++){
  const key='foxBg'+i,box=document.createElement('div');
  box.innerHTML='<label>Hintergrund für Fuchs '+(i+1)+'<select>'+options(names,Number(read(key)??(i?3:8)))+'</select></label><svg viewBox="0 0 200 120" role="img"><rect width="200" height="120"/><g fill="#412d26" opacity=".22"><path d="m10 30 16-12-5 18z M155 100l25-12-12 16z M143 18l24 4-12 8z M25 91l12-17 4 15z"/></g><path fill="#ff902b" stroke="#754225" stroke-width="2" d="m54 25 34 18q12-4 24 0l34-18-7 53-39 29-39-29z"/><path fill="#fff1dc" d="m61 77 31 8 8 10 8-10 31-8-39 30z"/><path fill="#322321" d="m93 93 14 0-7 8z"/><g fill="#322321"><circle cx="79" cy="70" r="3"/><circle cx="121" cy="70" r="3"/></g></svg>';
  section.querySelector('.star-pair').append(box);const picker=box.querySelector('select'),svg=box.querySelector('svg');function draw(){const j=+picker.value;svg.querySelector('rect').setAttribute('fill',hex[j]);svg.setAttribute('aria-label','Orangefarbener Fuchs auf '+names[j])}picker.onchange=()=>{draw();save(key,picker.value)};draw();
 }
 if(section.open)section.scrollIntoView({block:'start'});
}
function sortExperiment(){
 const panel=document.createElement('details');panel.innerHTML='<summary>Drei Mischproben nach Blauanteil ordnen</summary><p>Alle Proben enthalten Orange. Beginne mit dem kleinsten Blauanteil. Wähle die Buchstaben für die drei Plätze oder verschiebe die Proben mit den Tasten. Du kannst die Lösung jederzeit aufdecken.</p><div class="swatch-grid"></div><div class="sort-picks"></div><button class="check-order">Reihenfolge prüfen</button><button class="show-order">Rezepte aufdecken</button><p role="status"></p>';
 stage.querySelector('article').append(panel);const values=[25,0,10],order=[0,1,2],letters=['A','B','C'];let revealed=false;
 const grid=panel.querySelector('.swatch-grid'),inputs=panel.querySelector('.sort-picks'),status=panel.querySelector('[role=status]');
 function draw(){
  grid.replaceChildren();inputs.replaceChildren();order.forEach((j,i)=>{
   const n=values[j],f=sampleFigure({color:pigmentPreview(hex[2],hex[8],n/100)},'Probe '+letters[j]+(revealed?' · '+n+' % Blau':''));grid.append(f);
   for(const dir of [-1,1]){const b=document.createElement('button');b.textContent=dir<0?'Früher':'Später';b.setAttribute('aria-label','Probe '+letters[j]+' '+b.textContent);b.disabled=i+dir<0||i+dir>2;b.onclick=()=>move(i,i+dir,i+dir);f.append(b)}
   const label=document.createElement('label');label.textContent='Platz '+(i+1);const select=document.createElement('select');select.innerHTML=options(letters,j);select.onchange=()=>move(i,order.indexOf(+select.value),i);label.append(select);inputs.append(label);
  });
 }
 function move(i,k,focus){[order[i],order[k]]=[order[k],order[i]];status.textContent='';draw();inputs.querySelectorAll('select')[focus].focus()}
 panel.querySelector('.check-order').onclick=()=>{status.textContent=order.every((j,i)=>values[j]===[0,10,25][i])?'Genau. Von links nach rechts nimmt der Blauanteil zu.':'Vergleiche zuerst die beiden äußersten Proben. Welche sieht dem reinen Orange ähnlicher?'};
 panel.querySelector('.show-order').onclick=e=>{revealed=!revealed;draw();e.target.textContent=revealed?'Rezepte wieder verdecken':'Rezepte aufdecken';status.textContent=revealed?'Aufsteigend: B mit 0 %, C mit 10 %, A mit 25 % Blau.':''};draw();
}

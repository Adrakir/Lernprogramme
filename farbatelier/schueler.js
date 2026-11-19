'use strict';
function rememberMix(){
 const key=JSON.stringify({mode,pair,amount});if(read('lastMix')!==key)save('lastMix',key);
}
function refreshResume(){
 const card=by('resumeCard'),last=stored('lastMix',null);
 const colors=last&&(last.mode===0?bases:last.mode===1?comps:[])[last.pair];
 card.hidden=!colors||!Number.isInteger(last.amount)||last.amount<0||last.amount>100;
 if(card.hidden)return;
 const [a,b]=colors;card.replaceChildren();const link=document.createElement('a');link.href='#'+(last.mode?'komplementaerfarben':'mischlabor')+'?fortsetzen';link.textContent='Mit diesem Rezept weiterarbeiten';
 card.append('Deine letzte Mischung: '+(100-last.amount)+' % '+names[a]+' und '+last.amount+' % '+names[b]+'. ',link);
}
function setupStudentLab(a,b){
 const sample=by('sample'),parent=sample.parentElement,station=document.createElement('section');
 station.className='mix-station';station.setAttribute('aria-label','Mischplatz');parent.insertBefore(station,by('ratio').previousElementSibling);
 const label=parent.querySelector('label[for="ratio"]');
 station.append(label,by('ratio'));
 const toggle=document.createElement('button');toggle.id='mixView';toggle.textContent='Farben nebeneinander zeigen';toggle.setAttribute('aria-pressed','false');
 station.append(sample,toggle,by('keep'));
 toggle.onclick=()=>{toggle.setAttribute('aria-pressed',String(toggle.getAttribute('aria-pressed')==='false'));showMixView(a,b)};
 const panel=document.createElement('details');panel.id='sampleStudio';panel.innerHTML='<summary>Proben vergleichen und Atelierblatt gestalten</summary><div class="student-tools"></div>';
 by('tray').after(panel);refreshStudentSamples();
 if(typeof elternFragen==='function')parent.insertAdjacentHTML('beforeend',elternFragen());
}
function showMixView(a,b){
 const btn=by('mixView');if(!btn)return;
 const adjacent=btn.getAttribute('aria-pressed')==='true';
 by('sample').style.backgroundImage=adjacent?'linear-gradient(to right,'+hex[a]+' 50%,'+hex[b]+' 50%)':'none';
 by('result').hidden=adjacent;
 btn.textContent=adjacent?'Mischung zeigen':'Farben nebeneinander zeigen';
 by('sample').setAttribute('aria-label',adjacent?names[a]+' und '+names[b]+' nebeneinander':by('ratioText').textContent);
}
function refreshStudentSamples(){
 const panel=by('sampleStudio');if(!panel)return;
 const box=panel.querySelector('.student-tools');box.replaceChildren();
 const saved=stored('atelierPage',null);
 if(samples.length<2)box.textContent='Lege zwei Proben ab, um sie nebeneinander zu vergleichen.';
 if(samples.length>=2){
  const pair=document.createElement('div');pair.className='compare-pair';const pickers=[];
  const reveal=document.createElement('button');reveal.textContent='Rezepte einblenden';reveal.setAttribute('aria-pressed','false');
  samples.slice(0,2).forEach((_,i)=>{
   const col=document.createElement('div'),label=document.createElement('label'),select=document.createElement('select'),swatch=document.createElement('div');
   label.textContent=i?'Rechte Probe':'Linke Probe';select.innerHTML=options(samples.map((_,j)=>'Probe '+(j+1)),i);
   label.append(select);col.append(label,swatch);pair.append(col);pickers.push({select,swatch});
   select.onchange=()=>{const other=pickers[1-i].select;if(other.value===select.value)other.value=String(samples.findIndex((_,j)=>j!==+select.value));draw()};
  });
  function draw(){pickers.forEach(({select,swatch})=>{const s=samples[+select.value];swatch.replaceChildren(sampleFigure(s,reveal.getAttribute('aria-pressed')==='true'?sampleText(s):'Probe '+(+select.value+1)))})}
  reveal.onclick=()=>{const open=reveal.getAttribute('aria-pressed')==='false';reveal.setAttribute('aria-pressed',String(open));reveal.textContent=open?'Rezepte ausblenden':'Rezepte einblenden';draw()};box.append(pair,reveal);draw();
 }
 const art=document.createElement('section');art.innerHTML='<h3>Mein Atelierblatt</h3><label>Lieblingsprobe<select></select></label><label>Mein Farbname<input maxlength="60"></label><label>Dafür würde ich diese Farbe verwenden<textarea maxlength="300"></textarea></label><div class="swatch-grid"></div><button>Atelierblatt drucken</button>';
 const select=art.querySelector('select'),name=art.querySelector('input'),idea=art.querySelector('textarea'),grid=art.querySelector('.swatch-grid'),print=art.querySelector('button');
 const choices=samples.slice();if(saved?.sample&&hasSample(saved.sample)&&!choices.some(x=>x.id===saved.sample.id))choices.push(saved.sample);
 if(!choices.length){art.replaceChildren();art.textContent='Für dein Atelierblatt brauchst du eine Probe aus dem Mischlabor.';box.append(art);return}
 select.innerHTML=options(choices.map((_,j)=>'Probe '+(j+1)),Math.max(0,choices.findIndex(x=>x.id===saved?.sample?.id)));name.value=saved?.name||'';idea.value=saved?.idea||'';
 function paint(){grid.replaceChildren(sampleFigure(choices[+select.value],name.value||'Meine Lieblingsfarbe'))}
 function keep(){save('atelierPage',JSON.stringify({sample:{...choices[+select.value]},name:name.value,idea:idea.value}));paint()}
 select.onchange=name.oninput=idea.oninput=keep;print.onclick=()=>{keep();const sheet=document.createElement('article');sheet.className='print-sheet';const h=document.createElement('h1'),p=document.createElement('p');h.textContent=name.value||'Mein Atelierblatt';p.textContent=idea.value;sheet.append(h,grid.cloneNode(true),p,document.createTextNode(sampleRecipe(choices[+select.value])));document.body.append(sheet);window.addEventListener('afterprint',()=>sheet.remove(),{once:true});window.print()};paint();box.append(art);
}
function practiceHints(i,v,targets){
 const hints=[
 ['Suche Farben derselben Gruppe.','Überlege, wie die Farben entstehen: '+familyHints[v.family],targets.map(j=>names[j]).join(', ')],
 ['Lege vier gleich große Plättchen bereit.','Eine von vier Portionen entspricht 25 %. Der Regler zeigt die zweite Farbe.','Stelle '+v.ratio+' % ein.'],
 ['Suche auf der anderen Hälfte des Kreises.','Gehe vom Startfeld sechs Farbfelder weiter.','Die Gegenfarbe ist '+names[opposite(v.opponent)]+'.']
 ][i];
 const wrap=document.createElement('div');wrap.innerHTML='<button id="hintLevel">Ersten Hinweis öffnen</button><p role="status"></p>';by('verdict').after(wrap);
 const btn=by('hintLevel');let level=0;btn.onclick=()=>{btn.dataset.used='1';wrap.querySelector('p').textContent=hints[level++];btn.textContent=['','Zweiten Hinweis öffnen','Lösung zeigen','Lösung angezeigt'][level];btn.disabled=level===3};
}

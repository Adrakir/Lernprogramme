'use strict';
const by=id=>document.getElementById(id),stage=by('stage');
const options=(values,i)=>values.map((name,j)=>'<option value="'+j+'" '+(j===i?'selected':'')+'>'+name+'</option>').join('');
function isGuest(){try{return sessionStorage.getItem('farbatelier.mode')==='gast'}catch{return false}}
const unsaved = new Map();
function storageKey(key){
 if(key.startsWith('pass.')&&key!=='pass.archive'){
  const state=stored('recordBook',null);
  if(state?.active&&state.active!=='first')key='draft.'+state.active+'.'+key.slice(5);
 }
 return (isGuest()?'farbatelier.gast.':'farbatelier.')+key}
function read(key){
 const id=storageKey(key);
 if(unsaved.has(id))return unsaved.get(id);
 try{return (isGuest()?sessionStorage:localStorage).getItem(id)}catch{return null}
}
function save(key,value){
 const id=storageKey(key);
 try{(isGuest()?sessionStorage:localStorage).setItem(id,value);unsaved.delete(id)}
 catch{
  unsaved.set(id,String(value));
  if(!by('storageNotice'))document.querySelector('main').insertAdjacentHTML('afterbegin','<p id="storageNotice" role="alert" class="note">Der Browser kann Einträge gerade nur für diese geöffnete Seite behalten. Sichere deinen Versuch vor dem Schließen im <a href="#lernpass">Lernpass als Text</a>.</p>');
 }
}
document.body.classList.toggle('dark',read('theme')==='dark');
function themeState(){by('theme').setAttribute('aria-pressed',String(document.body.classList.contains('dark')))}
themeState();by('theme').onclick=()=>{document.body.classList.toggle('dark');themeState();save('theme',document.body.classList.contains('dark')?'dark':'light')};
let chosen=2;
let highlighted=0;
function chooseColor(i){
 wheelMessage=names[i]+' gehört zur Gruppe '+familyNames[order(i)]+'.';
 chosen=i;
 if(highlighted) highlighted=order(i);
 wheel();
}
function point(r,angle){const a=angle*Math.PI/180;return [180+r*Math.cos(a),180+r*Math.sin(a)].join(' ')}
function wheel(){
 const openPanels=new Set([...stage.querySelectorAll("details[open] > summary")].map(el=>el.textContent));
 const segments=names.map((name,i)=>{
   const a=-105+30*i,b=a+30,active=!highlighted||highlighted===order(i);
   const [x,y]=point(126,-90+30*i).split(' ');
   return `<g opacity="${active?1:0.27}"><path data-color="${i}" fill="${hex[i]}" stroke="#151c45" stroke-width="3" d="M ${point(163,a)} A 163 163 0 0 1 ${point(163,b)} L ${point(88,b)} A 88 88 0 0 0 ${point(88,a)} Z"><title>${name} · ${group(i)}</title></path><g pointer-events="none"><circle cx="${x}" cy="${y}" r="11" fill="#fff" stroke="#182044" stroke-width="${i===chosen?3:0}"/><text x="${x}" y="${y}" dy=".35em" text-anchor="middle" font-size="14" font-weight="700" fill="#182044">${order(i)}</text></g></g>`;
 }).join('');
 const legend=familyNames.map((name,i)=>`<button type="button" data-family="${i}" aria-pressed="${highlighted===i}">${i?i+' · ':''}${name}</button>`).join('');
 const opp=opposite(chosen);
 stage.innerHTML='<div class="wheelpanel"><div><div class="eyebrow">INTERAKTIVER FARBKREIS</div><h2>Der Farbkreis<br>nach Itten</h2><p>Tippe auf einen Farbton oder hebe eine ganze Farbgruppe hervor.</p><div class="wheel-legend" role="group" aria-label="Farbgruppen hervorheben">'+legend+'</div><p class="family-hint">'+familyHints[highlighted]+'</p><select aria-label="Farbe im Farbkreis wählen" id="pick">'+options(names,chosen)+'</select></div><svg class="wheel" viewBox="0 0 360 360" role="img" aria-label="Zwölfteiliger Farbkreis, ausgewählt: '+names[chosen]+'">'+segments+'<g id="oppositeLayer" pointer-events="none"></g><text x="180" y="183" fill="white" text-anchor="middle" font-size="23" font-weight="750">'+names[chosen]+'</text><text x="180" y="206" fill="#cbcde6" text-anchor="middle" font-size="14">'+group(chosen)+'</text></svg></div><figure style="margin:1.2rem 0"><h3>Kreis im Kreis</h3><a href="kreis-im-kreis.svg"><img src="kreis-im-kreis.svg" alt="Drei konzentrische Farbringe. Innen drei Grundfarben, in der Mitte sechs und außen zwölf beschriftete Farbtöne. Bild vergrößern." style="display:block;width:100%;max-width:640px;height:auto;margin:auto"></a><figcaption>Lies von innen nach außen: Orange liegt an der Grenze zwischen Gelb und Rot. Im äußeren Ring findest du auf der gelben Seite Gelb-Orange und auf der roten Seite Rot-Orange.</figcaption></figure><figure style="margin:1.2rem 0"><a href="drei-farbkreise.svg" aria-label="Schaubild mit allen drei Farbkreisen vergrößern"><img src="drei-farbkreise.svg" alt="Ittens Farbkreis im Aufbau: drei Primärfarben, ergänzt auf sechs und schließlich zwölf Farbtöne." style="width:100%;height:auto;display:block"></a><figcaption>Gelb bleibt oben. Im zweiten Kreis liegt Orange zwischen Gelb und Rot. Im dritten kommt zwischen Gelb und Orange noch Gelb-Orange hinzu. Tippe zum Vergrößern auf das Bild.</figcaption></figure><div class="cards"><article class="tile"><div class="eyebrow">MISCHREZEPT</div><h3>'+names[chosen]+'</h3><p>'+(order(chosen)===3?'<b>Nur mit Grundfarben:</b> ':'')+recipes[chosen]+'</p>'+selectedGraphic(chosen)+'</article><article class="tile"><div class="eyebrow">GEGENFARBE</div><h3><b class="sw" style="background:'+hex[opp]+'"></b>'+names[opp]+'</h3><p>Genau sechs Felder entfernt. Nebeneinander können die beiden Farben besonders kräftig wirken.</p></article><article class="tile"><div class="eyebrow">NACHBARFARBEN</div><h3>'+names[(chosen+11)%12]+' und '+names[(chosen+1)%12]+'</h3><p>Sie liegen direkt neben '+names[chosen]+' und bilden sanfte Übergänge.</p></article></div>';
 stage.insertAdjacentHTML('beforeend',familyLessons());
 enhanceWheel();
 wheelExtras();stage.querySelector('.wheelpanel').insertAdjacentHTML('afterend','<p class="family-next"><a href="#kreisstudio">Den Farbkreis aufbauen und Gegenfarben verbinden</a></p>');
 stage.querySelectorAll('details > summary').forEach(el=>{if(openPanels.has(el.textContent))el.parentElement.open=true});
 if(location.hash==="#farbkreis")guideBanner();
 by('pick').onchange=e=>{chooseColor(+e.target.value);by('pick').focus()};
 stage.querySelectorAll('[data-color]').forEach(el=>el.onclick=()=>chooseColor(+el.dataset.color));
 stage.querySelectorAll('[data-family]').forEach(button=>button.onclick=()=>{
   highlighted=Number(button.dataset.family);
   if(highlighted&&order(chosen)!==highlighted) chosen=names.findIndex((_,i)=>order(i)===highlighted);
   wheelMessage=names[chosen]+' gehört zur Gruppe '+familyNames[order(chosen)]+'.';
   wheel();
   stage.querySelector('[data-family="'+highlighted+'"]').focus();
 });
}
let mode=0,pair=0,amount=50;
function interp(a,b,t){return 'rgb('+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t)).join(',')+')'}
const palettes = [{pair:0, amount:50}, {pair:0, amount:0}];
let taskPalette=false;
function showPalette(nextMode){
 if(!taskPalette)palettes[mode] = {pair, amount};
 mode = nextMode;
 taskPalette=location.hash.includes('?auftrag=')||sessionStorageSafe('guiding')===String(nextMode+1);
 ({pair, amount} = taskPalette?{pair:0,amount:0}:palettes[mode]);
 if(location.hash.includes('?fortsetzen')){
  const last=stored('lastMix',null);
  if(last&&last.mode===mode&&Number.isInteger(last.pair)&&(mode?comps:bases)[last.pair]&&Number.isInteger(last.amount)&&last.amount>=0&&last.amount<=100)({pair,amount}=last);
 }
 mix();
}
function mix(){
 const pairs=mode?comps:bases,[a,b]=pairs[pair];
 stage.innerHTML='<article class="surface"><div class="eyebrow">MISCHLABOR</div><h2>'+(mode?'Komplementärfarben mischen':'Grundfarben mischen')+'</h2><p>'+(mode?'Wähle zwei Gegenfarben. Schiebe den Regler und beobachte, wie sich ihr Mischton verändert.':'Mische zwei Grundfarben oder <a href="#komplementaerfarben">probiere Komplementärfarben aus</a>.')+'</p><div class="tools"><label>Farbpaar<select id="pair">'+options(pairs.map(([x,y])=>names[x]+' und '+names[y]),pair)+'</select></label></div><p>Die beiden Farben nebeneinander</p><div class="split labelled"><span style="background:'+hex[a]+'"><b>'+names[a]+'</b></span><span style="background:'+hex[b]+'"><b>'+names[b]+'</b></span></div><label for="ratio"><strong id="ratioText"></strong></label><input class="range" type="range" min="0" max="100" step="1" id="ratio" value="'+amount+'"><div class="sample" id="sample"><strong id="result"></strong></div>'+(mode?'<div class="tools presets" aria-label="Mischverhältnis auswählen">'+[0,10,25,50,75,90,100].map(n=>'<button data-preset="'+n+'">'+(100-n)+' : '+n+'</button>').join('')+'</div>':'')+'<p class="note" id="observe"></p><p>Das Modell zeigt ungefähre Farbtöne. Echte Malfarben haben je nach Pigment eine andere Färbekraft.</p></article>';
 setupLab(a,b);
 setupExperiments(a,b);
 setupStudentLab(a,b);
 function update(){const t=amount/100,stops=mode?[hex[a],hex[b]]:[0,1,2,3,4].map(offset=>hex[(a+offset)%12]);const pos=t*(stops.length-1),k=Math.min(Math.floor(pos),stops.length-2);
 stage.querySelectorAll('[data-preset]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.preset)===amount)));
 by('sample').style.background=mode?pigmentPreview(hex[a],hex[b],t):interp(stops[k],stops[k+1],pos-k);
 by('ratioText').textContent=(100-amount)+' % '+names[a]+' + '+amount+' % '+names[b];
 by('result').textContent=mode?(amount===0?names[a]:amount===100?names[b]:'Mischung aus '+names[a]+' und '+names[b]):names[(a+Math.round(t*4))%12];
 by('observe').textContent=mode?'Vergleiche deine Mischung mit beiden Ausgangsfarben darüber. Welche wirkt am leuchtendsten? Beschreibe, wie sich die Buntheit beim Weiterdrehen verändert.':'Probiere 25 %, 50 % und 75 % aus. Bei 25 % kommen auf drei Portionen der ersten Farbe eine Portion der zweiten.';
 updateLab(a,b);
 if(!mode&&amount%25){const near=Math.round(amount/25),other=amount>25*near?near+1:near-1;by('result').textContent='Überwiegend '+names[(a+near)%12]+', mit einem Stich in Richtung '+names[(a+other)%12];}
 updateStrip(a,b);showMixView(a,b);rememberMix();}
 update();by('ratio').oninput=e=>{amount=+e.target.value;update()};by('pair').onchange=e=>{pair=+e.target.value;mix();by('pair').focus()};stage.querySelectorAll('[data-preset]').forEach(button=>button.onclick=()=>{
   amount=Number(button.dataset.preset);by('ratio').value=amount;update();
 });
 guideBanner();
}
const tasks=[
['Ein Orange in drei Stufen','Mische Gelb mit etwas Rot. Male eine Probe und lege etwas Orange für später beiseite. Gib in den Rest eine Pinselspitze Blau. Male die zweite Probe. Gib noch etwas Blau hinzu und male die dritte.','Vergleiche die erste und dritte Probe. Das Orange verliert an Buntheit und kann bräunlich wirken.'],
['Eine leuchtende Farbkante','Male ein Feld mit deinem übrigen Orange. Lass es trocknen. Setze mit sauberem Pinsel ein blaues Feld direkt daneben. Vergleiche das Farbpaar mit der gemischten Probe.','An der Kante hebt sich Orange kräftig von Blau ab. Das ist der Komplementärkontrast.'],
['Ein warmer und ein kühler Himmel','Male dieselbe kleine Landschaft zweimal. Verwende für den ersten Himmel Gelb, Orange und Rot, für den zweiten Blau und Blau-Grün. Beschreibe die Stimmung.','Der erste Himmel kann an Abendsonne erinnern, der zweite an Kälte. Auch die Nachbarfarben und das Motiv beeinflussen die Wirkung.'],
['Drei Grundfarben auf einer Palette','Mische Rot und Gelb zu Orange. Rühre wenig Blau ein. Vergleiche anschließend Mischungen mit unterschiedlichen Anteilen aller drei Grundfarben.','Es können Braun-, Grau- oder dunkle Töne entstehen. Das genaue Ergebnis hängt von Mengen und Pigmenten ab.']];
function atelier(){stage.innerHTML='<article class="surface"><div class="eyebrow">MIT PINSEL UND PAPIER</div><h2>Deine Malaufträge</h2><p>Du brauchst Gelb, Rot und Blau, Wasser, Pinsel, Papier und eine saubere Palette.</p>'+tasks.map(([title,task,check],i)=>'<details><summary>'+title+'</summary><p>'+task+'</p><details><summary>Beobachtung vergleichen</summary><p>'+check+'</p></details><label><input type="checkbox" data-done="'+i+'" '+(read('done'+i)==='1'?'checked':'')+'> Ausprobiert</label></details>').join('')+'<p class="note">Die passenden Malfelder findest du auf Seite 14 im <a href="lernheft.pdf#page=14">Lernheft zum Ausdrucken</a>.</p></article>';stage.querySelectorAll('[data-done]').forEach(el=>el.onchange=()=>save('done'+el.dataset.done,el.checked?'1':'0'))}
const questions=[
['Welche Grundfarben verwendet Ittens Farbkreis?',['Gelb, Rot und Blau','Orange, Grün und Violett','Rot, Grün und Blau'],0,'Aus Gelb, Rot und Blau werden in diesem Modell die weiteren Farbtöne gemischt.'],
['Wie mischst du Grün?',['Rot und Gelb','Gelb und Blau','Blau und Rot'],1,'Gelb und Blau ergeben Grün. Grün gehört zu den Sekundärfarben.'],
['Wie erhältst du ein Rot-Violett?',['Mehr Blau als Rot','Gelb und Violett zu gleichen Teilen','Mehr Rot als Blau'],2,'Rot-Violett liegt zwischen Rot und Violett. Beginne etwa mit drei Portionen Rot und einer Portion Blau.'],
['Welches Farbpaar liegt im Farbkreis gegenüber?',['Orange und Blau','Grün und Gelb','Violett und Rot'],0,'Orange und Blau sind sechs Felder voneinander entfernt. Sie sind Komplementärfarben.'],
['Wie malst du ein besonders kräftig wirkendes gelbes Sternmotiv?',['Etwas Violett ins Gelb rühren','Das Gelb mit viel Wasser verdünnen','Den gelben Stern auf violetten Grund malen'],2,'Gelb und Violett bilden nebeneinander einen Komplementärkontrast.'],
['Dein Rot soll gedämpfter werden. Was gibst du hinzu?',['Ein wenig Grün','Mehr Rot','Nur Wasser'],0,'Grün ist die Gegenfarbe zu Rot. In kleinen Mengen trübt es den roten Farbton.'],
['Was bedeutet ein Mischverhältnis von 3 zu 1?',['Gleich viel von beiden Farben','Drei gleich große Portionen der ersten und eine der zweiten Farbe','Drei verschiedene Grundfarben'],1,'Ein Viertel der Gesamtmenge stammt von der zweiten Farbe.'],
['Warum sieht dein Mischton anders aus als auf dem Bildschirm?',['Nur bei Dunkelheit stimmen die Farben','Alle Malkästen enthalten exakt dieselben Pigmente','Pigmente und Mischmengen beeinflussen das Ergebnis'],2,'Der Bildschirm zeigt ein vereinfachtes Modell. Im Malkasten kannst du die Mengen anpassen.'],
['Welche Farbgruppe eignet sich für einen eher warmen Sonnenhimmel?',['Blau und Blau-Grün','Gelb, Orange und Rot','Blau und Violett'],1,'Gelb, Orange und Rot erinnern häufig an Feuer oder Sonne. Die Umgebung beeinflusst die Wirkung.'],
['Was kann beim Mischen aller drei Grundfarben entstehen?',['Immer reines Weiß','Immer leuchtendes Gelb','Ein brauner, grauer oder dunkler Ton'],2,'Die Grundfarben können sich gegenseitig dämpfen. Die Anteile entscheiden mit über das Ergebnis.']];
function dot(i){return `<span class="paint-chip"><i style="background:${hex[i]}"></i>${names[i]}</span>`;}
function selectedGraphic(i){
 if(order(i)===1)return `<div class="single-paint">${dot(i)}</div>`;
 return (order(i)===3?'<p><b>Mit fertiger Sekundärfarbe:</b></p>':'')+recipe(mischPartner(i));
}
  function recipe([a,b,c]) {
    return `<div class="paint-recipe">${dot(a)}<span>+</span>${dot(b)}<span>=</span>${dot(c)}</div>`;
  }

function familyLessons() {
  function ring(indices, label) {
    const slices = names.map((name, i) => {
      const start = i * 30 - 105, end = start + 30;
      const color = indices.includes(i) ? hex[i] : 'var(--tint)';
      return `<path fill="${color}" stroke="var(--card)" stroke-width="4" d="M ${point(156,start)} A 156 156 0 0 1 ${point(156,end)} L ${point(97,end)} A 97 97 0 0 0 ${point(97,start)} Z"/>`;
    }).join('');
    return `<svg viewBox="0 0 360 360" role="img" aria-label="${label} im Farbkreis hervorgehoben: ${indices.map(i=>names[i]).join(', ')}">${slices}<text x="180" y="190" text-anchor="middle" fill="var(--ink)" font-size="44" font-weight="750">${indices.length}</text><text x="180" y="223" text-anchor="middle" fill="var(--sub)" font-size="23">Farben</text></svg>`;
  }
  function lesson(title, indices, explanation, graphic) {
    return `<article class="surface family"><div class="family-head">${ring(indices,title)}<div><h3>${title}</h3><p>${explanation}</p></div></div>${graphic}</article>`;
  }
  return `<header class="family-intro"><h2>Die drei Farbgruppen nach Itten</h2><p>Die kleinen Farbkreise zeigen dir, wo jede Gruppe liegt. In den Mischbildern siehst du, welche Farben zusammengehören.</p></header>`
    + lesson('Primärfarben', [0,4,8], 'Gelb, Rot und Blau sind die drei Grundfarben in Ittens Modell. Du beginnst mit diesen Farben aus dem Malkasten. Im Farbkreis liegen sie gleich weit auseinander.', `<div class="primaries">${[0,4,8].map(dot).join('')}</div>`)
    + lesson('Sekundärfarben', [2,6,10], 'Mischst du zwei verschiedene Grundfarben, entsteht eine Farbe zweiter Ordnung. Beginne mit etwa gleich großen Portionen. Im Kreis liegt die Mischfarbe genau zwischen ihren beiden Grundfarben.', farbgruppeMitglieder(2).map(i=>recipe(mischPartner(i))).join(''))
    + lesson('Tertiärfarben', [1,3,5,7,9,11], 'Mische eine Grundfarbe mit der benachbarten Sekundärfarbe. So entstehen die sechs Zwischenfarben im zwölfteiligen Farbkreis. Ihr Name verrät die beiden Nachbarn.', farbgruppeMitglieder(3).map(i=>recipe(mischPartner(i))).join('') + '<p class="note"><strong>Auch direkt aus Grundfarben:</strong> Für Gelb-Orange kannst du mit drei Portionen Gelb und einer Portion Rot beginnen. Für Rot-Orange vertauschst du die Mengen. Je nach Malfarbe brauchst du etwas mehr oder weniger.</p>')
    + '<p class="family-next"><a href="#mischlabor">Mischrezepte im Mischlabor ausprobieren</a></p>';
}

const views={unterricht:()=>unterricht(),familie:()=>familie(),kreisstudio:()=>kreisStudio(),lernpass:()=>learningPass(),farbkreis:wheel,farbgruppen:()=>{stage.innerHTML=familyLessons()},mischlabor:()=>showPalette(0),komplementaerfarben:()=>showPalette(1),atelier:()=>{atelier();extendTasks()},quiz:()=>quiz(),lernweg:()=>guided(),praxis:()=>practice(),bildaufgabe:()=>picture()};
function route(){const key=location.hash.slice(1).split("?")[0],selected=Object.hasOwn(views,key)?key:'farbkreis';document.querySelectorAll('nav a').forEach(a=>{if(a.hash==='#'+selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});document.body.classList.toggle('at-home',selected==='farbkreis');refreshResume();window.speechSynthesis?.cancel();views[selected]();attachReaders();guideBanner()}
window.addEventListener('hashchange',route);

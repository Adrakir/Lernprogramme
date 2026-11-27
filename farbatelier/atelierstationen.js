'use strict';

function atelierElement(parent, tag, text, klasse) {
 const el=document.createElement(tag);
 if(text!==undefined)el.textContent=text;
 if(klasse)el.className=klasse;
 parent.append(el);
 return el;
}
function atelierKnopf(parent,text,action) {
 const b=atelierElement(parent,'button',text);
 b.type='button'; b.onclick=action;
 return b;
}
function atelierWahl(parent,label,werte,wert,change) {
 const feld=atelierElement(parent,'label',label);
 const s=atelierElement(feld,'select');
 werte.forEach(([key,name])=>s.add(new Option(name,key)));
 s.value=String(wert);s.onchange=()=>change(s.value);
 return s;
}
function stationTeilen(parent,nr) {
 const details=atelierElement(parent,'details');
 atelierElement(details,'summary','Station teilen');
 const url='https://adrakir.github.io/Lernprogramme/farbatelier/#farbwerkstatt?thema='+nr;
 const label=atelierElement(details,'label','Direktlink zu „'+werkThemen[nr]+'“');
 const input=atelierElement(label,'input');input.readOnly=true;input.value=url;
 const status=atelierElement(details,'p');status.setAttribute('role','status');
 atelierKnopf(details,'Link kopieren',async()=>{
  try{await navigator.clipboard.writeText(url);status.textContent='Link kopiert.'}
  catch{input.focus();input.select();status.textContent='Der Link ist markiert. Kopiere ihn über das Menü deines Geräts.'}
 });
 const qr=atelierElement(details,'img',undefined,'stations-qr');qr.loading='lazy';qr.src='station-qr/'+nr+'.png';qr.alt='QR-Code zur Station '+werkThemen[nr];
}

function freieFelder(parent,daten,merken) {
 const panel=atelierElement(parent,'details');
 const titel=atelierElement(panel,'summary','Frei legen und zwei Felder tauschen');
 atelierElement(panel,'p','Lege einen Stein auf ein freies Feld. Für einen Tausch tippe zwei belegte Felder an. Prüfe deinen Kreis, wenn du so weit bist.');
 const start=Array(12).fill(null);
 for(const id of daten.gelegt||[])if(Number.isInteger(id)&&id>=0&&id<12)start[id]=id;
 const belegt=Array.isArray(daten.freieFelder)&&daten.freieFelder.length===12?[...daten.freieFelder]:start;
 const label=atelierElement(panel,'label','Freier Farbstein'),wahl=atelierElement(label,'select');
 const kreis=atelierElement(panel,'div',undefined,'legekreis freier-kreis');kreis.setAttribute('role','group');kreis.setAttribute('aria-label','Frei belegbare Felder');
 const status=atelierElement(panel,'p');status.setAttribute('role','status');
 let von=null,initialisiert=Array.isArray(daten.freieFelder);
 titel.addEventListener('click',()=>{
  if(!panel.open&&!initialisiert){
   belegt.fill(null);
   for(const id of daten.gelegt||[])belegt[id]=id;
   zeichne();initialisiert=true;
  }
 });
 function zeichne(){
  const rest=names.map((n,i)=>i).filter(i=>!belegt.includes(i));
  const bisher=wahl.value;wahl.replaceChildren(...rest.map(i=>new Option(names[i],i)));wahl.disabled=!rest.length;
  if(bisher!==''&&rest.includes(Number(bisher)))wahl.value=bisher;
  kreis.replaceChildren();
  belegt.forEach((id,i)=>{
   const b=atelierKnopf(kreis,String(i||12),()=>{
    if(id===null&&von===null){belegt[i]=Number(wahl.value);status.textContent=names[belegt[i]]+' gelegt.'}
    else if(von===null){von=i;status.textContent=names[id]+' gewählt. Tippe das zweite Feld an.'}
    else{[belegt[von],belegt[i]]=[belegt[i],belegt[von]];status.textContent=von===i?'Auswahl aufgehoben.':'Felder neu angeordnet.';von=null}
    merken('freieFelder',belegt);zeichne();kreis.children[i].focus();
   });
   b.style.left=(50+39*Math.sin(i*Math.PI/6))+'%';b.style.top=(50-39*Math.cos(i*Math.PI/6))+'%';
   if(id!==null)b.style.border='6px solid '+hex[id];
   b.setAttribute('aria-label',(i||12)+' Uhr · '+(names[id]||'frei'));b.setAttribute('aria-pressed',String(von===i));
  });
 }
 atelierKnopf(panel,'Meinen Kreis prüfen',()=>{
  const leer=belegt.filter(id=>id===null).length,falsch=belegt.findIndex((id,i)=>id!==null&&id!==i);
  if(falsch>=0){status.textContent='Schau bei '+(falsch||12)+' Uhr nach. Dort liegt '+names[belegt[falsch]]+'. Welche Farbe gehört zwischen '+names[(falsch+11)%12]+' und '+names[(falsch+1)%12]+'?'}
  else status.textContent=leer?'Alle gelegten Steine passen. Noch '+leer+' Felder sind frei.':'Alle zwölf Farben liegen richtig.';
 });
 zeichne();
}

function farbspur(parent){
 const el=document.createElement('section');el.className='farbspur';parent.querySelector('summary').after(el);
 atelierElement(el,'h3','Eine Farbe durch drei Kreise verfolgen');
 atelierElement(el,'p','Tippe auf ein farbiges Feld oder wähle einen Farbton. Die weißen Punkte zeigen den Weg.');
 const select=atelierWahl(el,'Farbton verfolgen',names.map((n,i)=>[i,n]),chosen,v=>zeige(+v));
 const rings=atelierElement(el,'div',undefined,'spurreihe');
 function zeige(i){
  select.value=String(i);rings.replaceChildren();
  const sek=order(i)===1?null:order(i)===2?i:mischPartner(i).slice(0,2).find(n=>order(n)===2);
  const grund=sek===null?[i]:mischPartner(sek).slice(0,2);
  const stufen=[grund,order(i)===3?mischPartner(i).slice(0,2):[i],order(i)===2?[(i+11)%12,i,(i+1)%12]:[i]];
  const titel=['1 · Drei Farben','2 · Sechs Farben','3 · Zwölf Farben'];
  stufen.forEach((feld,index)=>{
   const fig=atelierElement(rings,'figure');atelierElement(fig,'strong',titel[index]);
   const graphic=atelierElement(fig,'div');graphic.innerHTML=farbring(index+1,feld,false,true);
   graphic.querySelectorAll('[data-ton]').forEach(p=>p.onclick=()=>zeige(+p.dataset.ton));
   atelierElement(fig,'figcaption',feld.map(x=>names[x]).join(' · '));
  });
 }
 zeige(chosen);
}
const waldPalette=['#efc78c','#eddfb4','#376f59','#88a751','#547896','#30364e','#725476','#a34f3f','#c58e63','#ef7940'];
const waldFarbnamen=['Apricot','Hellgelb','Waldgrün','Blattgrün','Graublau','Nachtblau','Grauviolett','Ziegelrot','Ocker','Orange'];
function waldRezept(daten,j){
 return (j?[5,6,4,7]:[0,2,8,9]).map((basis,i)=>daten['wald'+j+i]??basis);
}
function waldAtelier(box,daten,merken){
 const grau=atelierKnopf(box,'Graustufen-Lupe',()=>{box.classList.toggle('lupe');grau.setAttribute('aria-pressed',String(box.classList.contains('lupe')))});
 grau.setAttribute('aria-pressed','false');
 const paar=atelierElement(box,'div',undefined,'waldpaar');
 ['Ruhig am Morgen','Unheimlich am Abend'].forEach((titel,j)=>{
  const fig=atelierElement(paar,'figure');
  atelierElement(fig,'figcaption',titel);
  const bild=atelierElement(fig,'div',undefined,'waldgrafik');
  const palette=waldFarbnamen.map((n,i)=>[i,n]);
  const variantKey='variante'+j;
  let entwurf=daten[variantKey],teil=0,bearbeite=entwurf?'variante':'original';
  const edit=atelierElement(fig,'div'),vergleich=atelierElement(fig,'div',undefined,'waldvergleich');
  function original(){return waldRezept(daten,j)}
  function werte(){return bearbeite==='variante'?entwurf:original()}
  function malen(){
   bild.innerHTML=waldbild(werte().map(i=>waldPalette[i]));
   vergleich.replaceChildren();
   if(!entwurf)return;
   for(const [titel,rezept] of [['Original',original()],['Variante',entwurf]]){
    const mini=atelierElement(vergleich,'div');atelierElement(mini,'strong',titel);atelierElement(mini,'div',undefined,'waldgrafik').innerHTML=waldbild(rezept.map(i=>waldPalette[i]));
   }
  }
  function farbe(i,v){
   if(bearbeite==='variante'){entwurf=[...entwurf];entwurf[i]=v;merken(variantKey,entwurf)}
   else merken('wald'+j+i,v);
   malen();desktop[i].value=v;markiere();
  }
  const mobil=atelierElement(edit,'div',undefined,'wald-mobil');
  atelierWahl(mobil,'Bildteil',bildstellen.map((n,i)=>[i,n]),teil,v=>{
   teil=+v;desktop.forEach((s,i)=>s.parentElement.classList.toggle('aktiver-teil',teil===i));markiere();
  });
  const breit=atelierElement(edit,'div',undefined,'wald-breit');
  const desktop=bildstellen.map((n,i)=>atelierWahl(breit,n,palette,werte()[i],v=>farbe(i,+v)));
  desktop[0].parentElement.classList.add('aktiver-teil');
  const chips=atelierElement(edit,'div',undefined,'wald-chips');
  chips.setAttribute('role','group');chips.setAttribute('aria-label','Farbfelder für den gewählten Bildteil');
  const farbfelder=waldFarbnamen.map((name,i)=>{
   const b=atelierKnopf(chips,name,()=>farbe(teil,i));b.style.setProperty('--farbprobe',waldPalette[i]);return b;
  });
  function markiere(){farbfelder.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===werte()[teil])))}
  markiere();
  const werkzeuge=atelierElement(edit,'div');
  function umschalten(v){bearbeite=v;desktop.forEach((s,i)=>s.value=werte()[i]);markiere();malen()}
  function werkzeug(){
   werkzeuge.replaceChildren();
   if(entwurf){atelierWahl(werkzeuge,'Entwurf bearbeiten',[['original','Original'],['variante','Variante']],bearbeite,umschalten)}
   else atelierKnopf(werkzeuge,'Variante ausprobieren',()=>{entwurf=[...original()];merken(variantKey,entwurf);umschalten('variante');werkzeug()});
  }
  malen();werkzeug();
 });
}

function bildkommentar(parent,daten,merken){
 const wald=stored('werkstatt.4',{}),rezept=waldRezept(wald,0);
 const gruppe=atelierElement(parent,'details');gruppe.open=!!daten.kommentare;
 atelierElement(gruppe,'summary','Im eigenen Morgenwald eine Stelle kommentieren');
 const bild=atelierElement(gruppe,'div',undefined,'detektiv-bild');bild.innerHTML=waldbild(rezept.map(i=>waldPalette[i]));
 const notizen={...daten.kommentare};let auswahl=0;
 const label=atelierElement(gruppe,'label'),name=atelierElement(label,'span'),feld=atelierElement(label,'textarea');
 function waehlen(n){
  auswahl=n;name.textContent='Mein Kommentar zu '+bildstellen[n];feld.value=notizen[n]||'';
  buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(n===i)));
 }
 const buttons=[[49,15],[18,43],[58,85],[22,64]].map(([x,y],i)=>{
  const b=atelierKnopf(bild,''+(i+1),()=>{waehlen(i);feld.focus()});b.style.left=x+'%';b.style.top=y+'%';b.setAttribute('aria-label','Kommentar zu '+bildstellen[i]);return b;
 });
 feld.oninput=()=>{notizen[auswahl]=feld.value;merken('kommentare',notizen)};waehlen(0);
}

function neueWerkstation(nr,box,daten,merken,notiz){
 function frage(text){atelierElement(box,'p',text)}
 function regler(parent,label,key,min,max,initial,update){
  const l=atelierElement(parent,'label',label),feld=atelierElement(l,'input');
  feld.type='range';feld.min=min;feld.max=max;feld.value=daten[key]??initial;
  const wert=atelierElement(l,'output',feld.value);
  feld.oninput=()=>{wert.textContent=feld.value;merken(key,+feld.value);update()};
  return feld;
 }
 function probe(parent,titel){
  const fig=atelierElement(parent,'figure');atelierElement(fig,'figcaption',titel);
  return atelierElement(fig,'div',undefined,'mischprobe');
 }
 if(nr===9||nr===10){
  const irrtum=nr===9;
  if(irrtum){
   const figur=atelierElement(box,'div',undefined,'misch-ida');
   figur.innerHTML='<svg viewBox="0 0 120 102" aria-hidden="true"><path fill="#467a77" d="M11 102Q15 65 52 64Q87 63 97 102Z"/><path fill="#e8b086" d="M45 58h19v17Q53 82 45 73Z"/><ellipse fill="#bb674a" cx="54" cy="39" rx="29" ry="31"/><ellipse fill="#f0bd96" cx="55" cy="44" rx="23" ry="25"/><path fill="#935535" d="M27 42Q19 4 52 7Q84 4 82 40Q61 36 52 22Q42 37 27 42Z"/><g fill="#343744"><circle cx="46" cy="44" r="2"/><circle cx="64" cy="44" r="2"/></g><path d="M49 55q7 6 13 -1" fill="none" stroke="#8c493f" stroke-width="2"/><path d="M88 85l13-41" stroke="#935535" stroke-width="4"/><path d="M99 47q-2-11 10-19 1 14-7 20" fill="#f29634"/></svg>';
  }
  frage(irrtum?'Ida behauptet: „Für Gelb-Orange brauche ich mehr Rot als Gelb.“ Prüfe ihre Behauptung. Verändere die Portionen im zweiten Napf.':'Ein Rezept enthält zwei Portionen Gelb und eine Portion Rot. Mische sechs gleich große Portionen im selben Farbton.');
  const reihe=atelierElement(box,'div',undefined,'probenpaar');
  const vorlage=probe(reihe,irrtum?'Idas Mischung · 1 Gelb + 3 Rot':'Original · 2 Gelb + 1 Rot'),eigene=probe(reihe,'Deine Mischung');
  vorlage.style.background=grundMischton(0,irrtum?75:100/3);
  const gelb=regler(box,'Gelbe Portionen','gelb',0,8,irrtum?1:2,male);
  const rot=regler(box,'Rote Portionen','rot',0,8,irrtum?3:1,male);
  const rezept=atelierElement(box,'p'),bilanz=atelierElement(box,'p');bilanz.setAttribute('role','status');
  function male(){
   const g=+gelb.value,r=+rot.value;
   eigene.style.background=g+r?grundMischton(0,100*r/(g+r)):'transparent';
   eigene.textContent=g+r?'':'Leerer Napf';rezept.textContent=g+' Gelb + '+r+' Rot = '+(g+r)+' Portionen';bilanz.textContent='';
  }
  male();atelierKnopf(box,'Mischung prüfen',()=>{
   const g=+gelb.value,r=+rot.value;
   if(irrtum)bilanz.textContent=g>r&&r>0?'Deine Mischung liegt auf der gelben Seite von Orange. Für Gelb-Orange brauchst du in diesem Modell mehr Gelb als Rot.':'Vergleiche mit Idas rötlichem Orange. Nutze beide Farben und erhöhe den Gelbanteil.';
   else bilanz.textContent=g===4&&r===2?'Das passt: Beide Mengen sind verdoppelt. Farbton gleich, Menge doppelt.':g===2*r&&r>0?'Das Verhältnis stimmt. Wie kommst du auf insgesamt sechs Portionen?':'Zähle zuerst die Gesamtmenge. Auf jede rote Portion müssen zwei gelbe kommen.';
  });
  notiz('schluss',irrtum?'Was würdest du Ida mit deinen Proben zeigen?':'Wie hast du die Menge verändert und den Farbton erhalten?');
 }else if(nr===11){
  frage('Dein Orange für einen Kürbis ist zu stumpf geworden. Beginne im zweiten Napf mit frischem Orange. Gib die getrübte Mischung löffelweise hinzu und suche einen noch kräftigen Schattenton.');
  const reihe=atelierElement(box,'div',undefined,'probenpaar');
  const stumpf='#846a55';probe(reihe,'Erster Napf · zu stumpf').style.background=stumpf;
  const neu=probe(reihe,'Zweiter Napf · vier Portionen frisches Orange');
  const menge=regler(box,'Zugabe aus dem ersten Napf in Portionen','zugabe',0,8,0,male);
  const info=atelierElement(box,'p');
  function male(){const n=+menge.value;neu.style.background=interp(hex[2],stumpf,n/(4+n));info.textContent='Dein Rezept: 4 Portionen Orange + '+n+' Portionen getrübte Mischung.'}
  male();notiz('rezept','Bei welcher Zugabe gefällt dir der Schatten? Woran erkennst du ihn?');frage('Probiere dein Rezept mit zwei echten Näpfen. Die Wirkung hängt von deinen Pigmenten ab.');
 }else if(nr===12){
  frage('Das Blau des Plakats und das Orange des Punkts bleiben gleich. Verändere allein die Größe. Wann fällt dir der Punkt auf? Wann beherrscht er das Bild?');
  const poster=atelierElement(box,'div',undefined,'flaechenplakat');
  poster.innerHTML='<svg viewBox="0 0 400 210" role="img" aria-label="Orangefarbener Kreis auf blauem Grund"><rect width="400" height="210" fill="#385eae"/><circle cx="200" cy="105" fill="#ff942c"/></svg>';
  const radius=regler(box,'Radius des Farbflecks','radius',5,102,23,()=>poster.querySelector('circle').setAttribute('r',radius.value));
  poster.querySelector('circle').setAttribute('r',radius.value);notiz('wirkung','Ab welcher Größe ändert sich die Wirkung für dich?');
 }else if(nr===13){
  frage('Zwei Ansichten zeigen dieselben Hügel. In Bild B kannst du nur die Farbe des hintersten Hügels ändern. Vergleiche, in welchem Bild er weiter entfernt wirkt.');
  const paar=atelierElement(box,'div',undefined,'probenpaar');
  function landschaft(parent,titel){
   const fig=atelierElement(parent,'figure');atelierElement(fig,'figcaption',titel);
   const b=atelierElement(fig,'div');b.innerHTML='<svg viewBox="0 0 320 175" role="img" aria-label="Drei gestaffelte Hügel unter hellem Himmel"><rect width="320" height="175" fill="#e6edf0"/><path class="ferne" d="M0 108 Q58 57 99 75 Q163 3 209 43 Q266 69 320 43 V175 H0Z" fill="#42694e"/><path d="M0 103 Q59 91 105 118 Q184 63 246 93 Q276 103 320 80 V175 H0Z" fill="#648669"/><path d="M0 117 Q74 93 140 130 T320 135 V175 H0Z" fill="#33573f"/></svg>';return b.querySelector('.ferne');
  }
  landschaft(paar,'A · Ausgangsbild');const fern=landschaft(paar,'B · Dein Versuch');
  const toene=[['Kräftiges Waldgrün','#42694e'],['Helles Graublau','#b4c6d1'],['Gedämpftes Graugrün','#92a79c'],['Warmes Ocker','#ba8d4a']];
  const s=atelierWahl(box,'Hinterster Hügel in Bild B',toene.map(([n],i)=>[i,n]),daten.huegel??0,v=>{merken('huegel',+v);fern.setAttribute('fill',toene[v][1])});
  fern.setAttribute('fill',toene[s.value][1]);notiz('tiefe','In welchem Bild wirkt der Hügel weiter weg? Beschreibe die Stelle, an der du es siehst.');
 }else if(nr===14){
  plakatTest(box,daten,merken);
 }
}

function plakatTest(box,daten,merken){
 const teile=['Titel','Termin','Ort'],texte=['Schulfest','Freitag · 15 Uhr','Auf dem Schulhof'];
 const farben=[['Tintenblau','#233766'],['Zinnoberrot','#a12624'],['Dunkelgrün','#215944'],['Violett','#643484'],['Braun','#76421e']];
 const auftrag=atelierElement(box,'p','Gestalte das Plakat so, dass der Titel zuerst und der Termin danach auffällt. Gib es dann einem zweiten Kind für den Blicktest.');
 const plakat=atelierElement(box,'div',undefined,'schulfest'),editor=atelierElement(box,'div');
 const start=atelierKnopf(box,'Blicktest starten',()=>beginne());
 const status=atelierElement(box,'p');status.setAttribute('role','status');
 const nochmal=atelierKnopf(box,'Zur Gestaltung',()=>bearbeiten());
 let folge=[],aktiv=false;
 const zeilen=texte.map((text,i)=>{
  const block=atelierKnopf(plakat,text,()=>{
   if(!aktiv||folge.includes(i))return;
   folge.push(i);block.disabled=true;
   if(folge.length===2){aktiv=false;merken('blickfolge',folge);ergebnis(folge)}
   else status.textContent='Tippe jetzt auf das, was dir als Zweites aufgefallen ist.';
  });
  const ton=daten['farbe'+i]??i, groesse=daten['groesse'+i]??[2,1,0][i];
  function stelle(v){block.style.fontSize=['1rem','1.5rem','2.1rem'][v]}
  block.style.color=farben[ton][1];stelle(groesse);
  const feld=atelierElement(editor,'fieldset');atelierElement(feld,'legend',teile[i]);
  atelierWahl(feld,'Schriftfarbe',farben.map(([n],j)=>[j,n]),ton,v=>{block.style.color=farben[v][1];merken('farbe'+i,+v);neu()});
  atelierWahl(feld,'Schriftgröße',[[0,'Klein'],[1,'Mittel'],[2,'Groß']],groesse,v=>{stelle(v);merken('groesse'+i,+v);neu()});
  return block;
 });
 function neu(){merken('blickfolge',[]);status.textContent=''}
 function ergebnis(werte){
  status.textContent='Gesehen: zuerst '+teile[werte[0]]+', dann '+teile[werte[1]]+'. Gestaltungsziel: zuerst Titel, dann Termin.';
  zeilen.forEach(b=>b.disabled=true);
 }
 function bearbeiten(){
  aktiv=false;auftrag.hidden=false;editor.hidden=false;start.hidden=false;nochmal.hidden=true;zeilen.forEach(b=>b.disabled=true);
  if(daten.blickfolge?.length===2)ergebnis(daten.blickfolge);else status.textContent='';
 }
 function beginne(){
  folge=[];aktiv=true;auftrag.hidden=true;editor.hidden=true;start.hidden=true;nochmal.hidden=false;
  zeilen.forEach(b=>b.disabled=false);status.textContent='Zweites Kind: Was hast du zuerst gesehen? Tippe auf diese Stelle im Plakat.';status.tabIndex=-1;status.focus({preventScroll:true});plakat.scrollIntoView({block:'center'});
 }
 bearbeiten();
}

'use strict';
const werkThemen=['Farbdetektiv im Bild','Gleiche Farbe auf zwei Hintergründen','Farbkreis aus dem Gedächtnis','Aufhellen und Trüben','Ein Wald in zwei Stimmungen','Drei Farben für einen Herbstweg','Wasser und Deckweiß','Partnerkritik am Werk','Mischblatt zum Ausdrucken','Idas Orange überprüfen','Ein Rezept verdoppeln','Ein stumpfes Orange retten','Wie groß soll der Farbfleck sein?','Drei Hügel in der Ferne','Schulfestplakat mit Blicktest'];
const bildstellen=['Himmel','Baumkronen','Weg','Blätter'];
const morgen=['#f6ce87','#45765b','#d1a275','#d85c35'];
function waldbild(farben){
 return `<svg viewBox="0 0 400 210" role="img" aria-label="Waldweg unter einem offenen Himmel, Baumkronen auf beiden Seiten und eine Gruppe Blätter am Weg"><rect width="400" height="210" fill="${farben[0]}"/><circle cx="280" cy="43" r="20" fill="#fff0bc"/><path fill="${farben[1]}" d="M0 15Q30 -10 52 36Q76 3 98 52Q133 20 149 72Q176 54 192 104L213 123Q232 74 256 86Q276 39 303 55Q317 13 350 37Q371 -4 400 9V210H0Z"/><path fill="${farben[2]}" d="M203 105Q173 127 208 144Q228 155 124 210H361Q315 174 248 151Q193 133 215 105Z"/><g fill="${farben[3]}"><path d="M88 145q24 -30 44 -18q-8 23 -44 18Zm19 20q20 -19 37 -8q-14 16 -37 8Zm-36 -6q-18 -21 -40 -12q8 19 40 12Z"/></g></svg>`;
}
function farbwerkstatt(){
 const wanted=new URLSearchParams(location.hash.split('?')[1]).get('thema');
 const nr=werkThemen[Number(wanted)]?Number(wanted):0;
 const daten=stored('werkstatt.'+nr,{});
 const merken=(k,v)=>{daten[k]=v;save('werkstatt.'+nr,JSON.stringify(daten));};
 stage.innerHTML='<article class="surface werkstatt"><h2>Farbwerkstatt</h2><label>Station wählen<select id="werkWahl"></select></label><h3 id="werkTitel"></h3><div id="werkInhalt"></div></article>';
 werkThemen.forEach((t,i)=>by('werkWahl').add(new Option(t,String(i))));by('werkWahl').value=String(nr);
 by('werkWahl').onchange=e=>{location.hash='farbwerkstatt?thema='+e.target.value;};
 by('werkTitel').textContent=werkThemen[nr];
 const box=by('werkInhalt');
 function absatz(text){const p=document.createElement('p');p.textContent=text;box.append(p);return p;}
 function notiz(key,label){
  const l=document.createElement('label'),t=document.createElement('textarea');l.append(label,t);t.value=daten[key]||'';t.oninput=()=>merken(key,t.value);box.append(l);
 }
 function wahl(key,label,opts,change){
  const l=document.createElement('label'),s=document.createElement('select');l.append(label,s);
  opts.forEach((v,i)=>s.add(new Option(v,String(i))));s.value=String(daten[key]??0);s.onchange=()=>{merken(key,+s.value);change?.();};box.append(l);return s;
 }
 function hilfe(text){
  const d=document.createElement('details'),t=document.createElement('summary'),p=document.createElement('p');
  t.textContent='Farbhilfe einblenden';p.textContent=text;d.append(t,p);box.append(d);
 }
 const foto=(farben)=>{const div=document.createElement('div');div.innerHTML=waldbild(farben);box.append(div);return div;};
 if(nr===0){
  absatz('Tippe auf zwei Bildstellen. Welche zieht deinen Blick zuerst an? Du kannst deine Auswahl wieder ändern.');
  const motiv=foto(morgen);motiv.className='detektiv-bild';
  const status=absatz('');status.setAttribute('role','status');
  let markiert=Array.isArray(daten.markiert)?daten.markiert:[];
  function aktualisieren(){motiv.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(markiert.includes(i))));
   status.textContent='Markiert: '+(markiert.map(i=>bildstellen[i]).join(' und ')||'noch keine Bildstelle');}
  [[48,15],[18,40],[59,80],[22,69]].forEach(([x,y],i)=>{const b=document.createElement('button');b.textContent=String(i+1);b.setAttribute('aria-label','Bildstelle '+(i+1)+': '+bildstellen[i]);b.style.left=x+'%';b.style.top=y+'%';b.onclick=()=>{
   if(!markiert.includes(i)&&markiert.length===2){status.textContent='Zwei Stellen sind markiert. Tippe eine davon an, um sie auszutauschen.';return;}
   markiert=markiert.includes(i)?markiert.filter(k=>k!==i):[...markiert,i];merken('markiert',markiert);aktualisieren();
  };motiv.append(b);});aktualisieren();hilfe('1 Himmel oben, 2 Baumkronen links, 3 Weg unten, 4 Blätter am linken Wegrand.');
  notiz('blick','Mein Blick fällt zuerst auf …, weil …');
 }else if(nr===1){
  absatz('Sieh dir beide Innenflächen an. Sind ihre Farben gleich? Halte deine Vermutung fest und schiebe die Flächen zur Mitte.');
  notiz('vermutung','Meine Vermutung');box.insertAdjacentHTML('beforeend','<div class="kontrastfeld" aria-label="Zwei orange Flächen auf blauem und gelbem Grund"><i></i><i></i></div><label>Flächen zusammenführen<input type="range" id="naehe" min="0" max="100" value="0"></label><p role="status" id="vergleichInfo"></p>');
  const regler=by('naehe');regler.value=daten.naehe||0;
  function schieben(){const n=+regler.value;box.querySelector('.kontrastfeld').style.setProperty('--mitte',(12+20*n/100)+'%');by('vergleichInfo').textContent=n===100?'Die Innenflächen berühren sich. Beide haben genau dasselbe Orange.':'Abstand verändert: '+n+' von 100.';}
  regler.oninput=()=>{merken('naehe',regler.value);schieben();};schieben();hilfe('Links ist der Hintergrund blau, rechts gelb. Beide Vergleichsflächen liegen waagerecht auf derselben Höhe.');
  absatz('Auf Papier: Schneide zwei Stücke aus demselben orangefarbenen Bogen und lege sie auf zwei verschiedene Hintergründe.');
 }else if(nr===2){
  absatz('Gelb gehört nach oben. Wähle einen Farbstein und tippe seine Position an. Lege zuerst die Grundfarben, dann die Mischfarben und zuletzt die Zwischenfarben.');
  box.insertAdjacentHTML('beforeend','<label>Farbstein<select id="farbstein" aria-label="Farbstein"></select></label><div class="legekreis" role="group" aria-label="Zwölf Positionen wie auf einer Uhr"></div><p id="legeMeldung" role="status"></p>');
  const kreis=box.querySelector('.legekreis'),pick=by('farbstein');let gelegt=Array.isArray(daten.gelegt)?daten.gelegt:[];
  function zeichnen(){
   const rest=names.map((_,i)=>i).filter(i=>!gelegt.includes(i)).sort((a,b)=>order(a)-order(b)||a-b);
   pick.replaceChildren();rest.filter(i=>order(i)===order(rest[0])).forEach(i=>pick.add(new Option(names[i],String(i))));pick.disabled=!rest.length;
   kreis.replaceChildren();names.forEach((name,i)=>{const b=document.createElement('button'),ok=gelegt.includes(i),pos=i||12;
    b.style.left=(50+39*Math.sin(i*Math.PI/6))+'%';b.style.top=(50-39*Math.cos(i*Math.PI/6))+'%';b.textContent=String(pos);b.setAttribute('aria-label',pos+' Uhr'+(ok?' · '+name:''));b.disabled=ok;
    if(ok)b.style.border='5px solid '+hex[i];b.onclick=()=>{if(pick.value!==String(i)){by('legeMeldung').textContent='Prüfe die Nachbarn und versuche es erneut.';return;}
     gelegt=[...gelegt,i];merken('gelegt',gelegt);zeichnen();by('legeMeldung').textContent=gelegt.length===12?'Alle zwölf Farben liegen richtig.':name+' liegt richtig. Wähle den nächsten Farbstein.';if(!pick.disabled)pick.focus();};kreis.append(b);});
  }zeichnen();hilfe('Drehe im Uhrzeigersinn: Gelb liegt bei 12 Uhr, Rot bei 4, Blau bei 8. Orange liegt zwischen Gelb und Rot. Zwischenfarben stehen zwischen den Farben ihres Namens.');
  const reset=document.createElement('button');reset.textContent='Neu legen';reset.onclick=()=>{gelegt=[];merken('gelegt',[]);zeichnen();by('legeMeldung').textContent='Der Kreis ist wieder leer.';};box.append(reset);
  freieFelder(box,daten,merken);
 }else if(nr===3||nr===6){
  const deck=nr===6;
  absatz(deck?'Ziehe auf festem Papier einen dunklen, wasserfesten Strich und lass ihn trocknen. Teile dein Blatt in zwei Felder. Male mit derselben Farbe jeweils quer über den Strich.':'Lege zwei Reihen mit je drei Malfeldern an. Beginne beide mit gleich viel Orange. Halte Papier, Pinsel und Wassermenge gleich.');
  const rezepte=deck?['A · Verdünne deine Malfarbe mit Wasser.','B · Mische die Malfarbe mit Deckweiß.']:['A · Gib von Feld zu Feld etwas mehr Weiß hinzu.','B · Gib von Feld zu Feld eine kleine Portion Blau als Gegenfarbe hinzu.'];
  rezepte.forEach((t,i)=>{absatz(t);notiz('probe'+i,deck?'Wie sichtbar bleibt der Strich nach dem Trocknen?':'Wie verändern sich Helligkeit und Leuchtkraft in Reihe '+('AB'[i])+'?');});
  notiz('vergleich',deck?'Woran erkennst du bei deinen Proben den Unterschied zwischen heller und deckender?':'Welche Probe ist am hellsten, welche wirkt am stumpfsten? Begründe am Blatt.');
  absatz('Für das Malen am Tisch:');box.insertAdjacentHTML('beforeend','<a href="mischblatt.pdf">A4-Mischblatt öffnen</a>');
 }else if(nr===4){
  absatz('Gestalte denselben Wald zweimal. Wähle für jede Bildstelle einen Farbton und vergleiche die Wirkung.');
  waldAtelier(box,daten,merken);notiz('stimmung','An dieser Stelle verändert meine Farbe die Stimmung, weil …');
 }else if(nr===5){
  absatz('Gestalte einen Herbstweg auf Papier. Wähle bis zu drei verschiedene Ausgangsfarben für deine Palette.');
  const gruppe=document.createElement('div');box.append(gruppe);const status=absatz('');status.setAttribute('role','status');let w=Array.isArray(daten.palette)?daten.palette:[];
  function anzeigen(){gruppe.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(w.includes(i))));status.textContent='Meine Palette: '+(w.map(i=>names[i]).join(', ')||'noch leer');}
  names.forEach((name,i)=>{const b=document.createElement('button');b.textContent=name;b.style.borderBottom='5px solid '+hex[i];b.onclick=()=>{if(!w.includes(i)&&w.length===3){status.textContent='Drei Farben sind gewählt. Entferne zuerst eine Farbe.';return;}w=w.includes(i)?w.filter(k=>k!==i):[...w,i];merken('palette',w);anzeigen();};gruppe.append(b);});anzeigen();
  notiz('mischung','Welche weitere Farbe hast du aus deiner Palette gemischt? Wofür hast du sie im Bild verwendet?');
 }else if(nr===7){
  absatz('Legt das Bild zwischen euch. Ein Kind beschreibt es, das andere hört zu und antwortet. Tauscht dann die Rollen.');
  bildkommentar(box,daten,merken);
  notiz('stelle','1. Beschreiben: An welcher Bildstelle siehst du welche Farben?');notiz('wirkung','2. Wirkung: Wohin wandert dein Blick? Was löst das aus?');notiz('frage','3. Nachfragen: Was möchtest du das Kind zu seiner Farbentscheidung fragen?');notiz('antwort','Antwort des Kindes, das gemalt hat');
 }else if(nr===8){
  absatz('Zwei große Felder zum Malen, Platz für die Rezepte und eine Vergleichsfrage. Drucke das Blatt in Schwarz-Weiß auf A4.');box.insertAdjacentHTML('beforeend','<a href="mischblatt.pdf">Mischblatt als PDF öffnen</a>');
 }else{
  neueWerkstation(nr,box,daten,merken,notiz);
 }
 stationTeilen(box,nr);
}

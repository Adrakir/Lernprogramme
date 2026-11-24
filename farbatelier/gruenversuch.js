'use strict';
function gruenversuch(){
 const stand=stored('gruenversuch',{})||{};
 stage.innerHTML=`<article class="surface"><h2>Mein Grün in zwei Versuchen</h2><p>Du brauchst Gelb und Blau, einen Pinsel, Wasser und ein Blatt mit zwei Malfeldern.</p>
 <h3>1. Vorhersagen und digital mischen</h3><label for="gruenPlan">Welches Grün möchtest du für dein Bild mischen? Warum?</label><textarea id="gruenPlan"></textarea>
 <div><button id="gruenStart">Digitalen Mischplatz öffnen</button></div><section id="gruenLabor" hidden>
 <label for="gruenBlau">Anteil Blau im digitalen Versuch</label><input class="range" id="gruenBlau" type="range" min="0" max="100" step="5"><p id="gruenRezept"></p><div class="sample" id="gruenProbe"></div>
 <h3>2. Mit dem Farbkasten ausprobieren</h3><p>Male Feld A mit deiner ersten Mischung. Verwende einen sauberen Pinsel und zähle ungefähr gleich große Pinselportionen.</p>
 <div class="tools"><label>Gelbe Portionen A <input id="gelbA" type="number" min="0" max="20"></label><label>Blaue Portionen A <input id="blauA" type="number" min="0" max="20"></label></div>
 <label>Wie sieht A im Vergleich zur Bildschirmprobe aus?<textarea id="probeA"></textarea></label>
 <h3>3. Gezielt verändern</h3><label>Was änderst du beim zweiten Versuch und warum?<textarea id="aenderung"></textarea></label>
 <p>Male Feld B mit der neuen Mischung. Lass beide Proben trocknen.</p><div class="tools"><label>Gelbe Portionen B <input id="gelbB" type="number" min="0" max="20"></label><label>Blaue Portionen B <input id="blauB" type="number" min="0" max="20"></label></div>
 <label>Welche Wirkung hat B? Welche Probe wählst du für dein Bild?<textarea id="wirkung"></textarea></label><button id="gruenVergleich">Meine Entdeckung zusammenfassen</button><p id="gruenBilanz" role="status"></p>
 <a href="#beobachten">Zum Beobachtungsbogen</a></section></article>`;
 const felder=['gruenPlan','gruenBlau','gelbA','blauA','probeA','aenderung','gelbB','blauB','wirkung'];
 function sichern(){save('gruenversuch',JSON.stringify(stand));}
 function probe(){
  const blau=Number(by('gruenBlau').value);
  by('gruenProbe').style.background=grundMischton(8,100-blau);
  by('gruenRezept').textContent=(100-blau)+' % '+names[0]+' und '+blau+' % '+names[8]+'. Modell nach Itten; echte Pigmente können anders wirken.';
 }
 function startzustand(){by('gruenStart').disabled=!by('gruenPlan').value.trim()||!!stand.offen;by('gruenLabor').hidden=!stand.offen;}
 for(const id of felder){
  const feld=by(id);feld.value=stand[id]??(id==='gruenBlau'?'50':'');
  feld.oninput=()=>{stand[id]=feld.value;stand.bilanz='';by('gruenBilanz').textContent='';sichern();probe();startzustand();};
 }
 by('gruenStart').onclick=()=>{stand.offen=true;sichern();startzustand();by('gruenBlau').focus();};
 by('gruenVergleich').onclick=()=>{
  const mengen=['gelbA','blauA','gelbB','blauB'].map(id=>by(id).value);
  const ok=mengen.every(s=>/^\d+$/.test(s)&&+s<=20)&&(+mengen[0]+ +mengen[1]>0)&&(+mengen[2]+ +mengen[3]>0);
  if(!ok||['gruenPlan','probeA','aenderung','wirkung'].some(id=>!by(id).value.trim())){by('gruenBilanz').textContent='Ergänze deine Beobachtungen und beide Rezepte mit je mindestens einer Pinselportion.';return;}
  stand.bilanz='Mein Ziel: '+stand.gruenPlan+' · A ('+mengen[0]+' Gelb, '+mengen[1]+' Blau): '+stand.probeA+' · Meine Änderung: '+stand.aenderung+' · B ('+mengen[2]+' Gelb, '+mengen[3]+' Blau): '+stand.wirkung;
  sichern();by('gruenBilanz').textContent=stand.bilanz;
 };
 startzustand();probe();by('gruenBilanz').textContent=stand.bilanz||'';
}
function beobachtungsbogen(){
 const titel=['Mein Grün in zwei Versuchen',...tasks.map(t=>t[0])];
 stage.innerHTML='<article class="surface"><h2>Beobachtungsbogen für Malaufträge</h2><label>Malauftrag <select id="bogenAufgabe"></select></label><p id="bogenEntdeckung"></p><p>Entscheidend ist, wie das Kind seine Entscheidung untersucht und erklärt. Auch ein unerwarteter Farbton kann alle Kriterien erfüllen.</p><div id="bogenKriterien"></div><label>Beleg aus dem Bild oder aus dem Gespräch<textarea id="bogenNotiz"></textarea></label><p>Der Bogen bleibt in diesem Browser. Ein Gastdurchgang eignet sich für eine weitere Arbeit am selben Gerät.</p><button id="bogenDruck">Bogen drucken</button></article>';
 const auswahl=by('bogenAufgabe');titel.forEach((t,i)=>auswahl.add(new Option(t,String(i))));
 function laden(){
  const key='malbogen.'+auswahl.value,daten=stored(key,{})||{},box=by('bogenKriterien');
  const bilanz=stored('gruenversuch',{})?.bilanz;
  by('bogenEntdeckung').textContent=auswahl.value==='0'&&bilanz?bilanz:'';
  box.replaceChildren();
  ['Farbwahl begründen','Mischung gezielt verändern','Bildwirkung beschreiben'].forEach((k,i)=>{
    const label=document.createElement('label'),select=document.createElement('select');
    label.append(k+' ',select);for(const t of ['Noch nicht beobachtet','Mit Unterstützung gezeigt','Selbstständig gezeigt'])select.add(new Option(t,t));
    if(daten[i])select.value=daten[i];select.onchange=()=>{daten[i]=select.value;save(key,JSON.stringify(daten));};box.append(label);
  });
  by('bogenNotiz').value=daten.notiz||'';by('bogenNotiz').oninput=e=>{daten.notiz=e.target.value;save(key,JSON.stringify(daten));};
 }
 auswahl.onchange=laden;laden();by('bogenDruck').onclick=()=>window.print();
}

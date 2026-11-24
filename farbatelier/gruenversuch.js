'use strict';
function gruenversuch(){
 const stand=stored('gruenversuch',{})||{};
 stage.innerHTML=`<article class="surface"><h2>Mein Grün in zwei Versuchen</h2><p>Du brauchst Gelb und Blau, einen Pinsel, Wasser und ein Blatt mit zwei Malfeldern.</p>
 <h3>1. Vorhersagen und digital mischen</h3><label for="gruenPlan">Welches Grün möchtest du für dein Bild mischen? Denke zum Beispiel an junges Laub im Sonnenlicht. Warum passt dein Grün dazu?</label><textarea id="gruenPlan"></textarea>
 <div><button id="gruenStart">Digitalen Mischplatz öffnen</button></div><section id="gruenLabor" hidden>
 <label for="gruenBlau">Anteil Blau im digitalen Versuch</label><input class="range" id="gruenBlau" type="range" min="0" max="100" step="5"><p id="gruenRezept"></p><div class="sample" id="gruenProbe"></div>
 <h3>2. Mit dem Farbkasten ausprobieren</h3><p>Male Feld A mit deiner ersten Mischung. Verwende einen sauberen Pinsel und zähle ungefähr gleich große Pinselportionen.</p>
 <div class="tools"><label>Gelbe Portionen A <input id="gelbA" type="number" min="0" max="20"></label><label>Blaue Portionen A <input id="blauA" type="number" min="0" max="20"></label></div>
 <label>Lass A trocknen. Wie wirkt die trockene Probe neben dem Grün auf dem Bildschirm?<textarea id="probeA"></textarea></label>
 <details><summary>Wörter für meinen Vergleich</summary><p>heller · dunkler · gelblicher · bläulicher · leuchtender · stumpfer</p></details>
 <h3>3. Gezielt verändern</h3><label>Was änderst du beim zweiten Versuch und warum?<textarea id="aenderung"></textarea></label>
 <p>Male Feld B mit der neuen Mischung. Lass beide Proben trocknen.</p><div class="tools"><label>Gelbe Portionen B <input id="gelbB" type="number" min="0" max="20"></label><label>Blaue Portionen B <input id="blauB" type="number" min="0" max="20"></label></div>
 <h3>Meine getrockneten Farbproben</h3><div class="gruen-paar"><div><strong>Rezept A</strong><p id="rezeptA"></p></div><div><strong>Rezept B</strong><p id="rezeptB"></p></div></div>
 <label>Ich wähle <select id="wahlProbe"><option value="">Probe wählen</option><option>A</option><option>B</option></select></label>
 <label>… weil diese Probe so auf meinem Bild wirkt:<textarea id="wirkung"></textarea></label><button id="gruenVergleich">Meine Entdeckung zusammenfassen</button><p id="gruenBilanz" role="status"></p>
 <a href="#beobachten">Zum Beobachtungsbogen</a></section></article>`;
 const felder=['gruenPlan','gruenBlau','gelbA','blauA','probeA','aenderung','gelbB','blauB','wahlProbe','wirkung'];
 function sichern(){save('gruenversuch',JSON.stringify(stand));}
 function probe(){
  for(const name of ['A','B']){
   const menge=id=>{const n=by(id+name).value;return (n||'…')+(n==='1'?' Portion':' Portionen');};
   by('rezept'+name).textContent=menge('gelb')+' Gelb + '+menge('blau')+' Blau';
  }
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
  if(!ok||['gruenPlan','probeA','aenderung','wahlProbe','wirkung'].some(id=>!by(id).value.trim())){by('gruenBilanz').textContent='Wähle A oder B, begründe deine Wahl und ergänze beide Rezepte mit je mindestens einer Pinselportion.';return;}
  stand.bilanz='Mein Ziel: '+stand.gruenPlan+' · A ('+mengen[0]+' Gelb, '+mengen[1]+' Blau): '+stand.probeA+' · Meine Änderung: '+stand.aenderung+' · B ('+mengen[2]+' Gelb, '+mengen[3]+' Blau). Ich wähle '+stand.wahlProbe+', weil: '+stand.wirkung;
  sichern();by('gruenBilanz').textContent=stand.bilanz;
 };
 startzustand();probe();by('gruenBilanz').textContent=stand.bilanz||'';
}
function beobachtungsbogen(){
 const titel=['Mein Grün in zwei Versuchen',...tasks.map(t=>t[0])];
 stage.innerHTML='<article class="surface"><h2>Beobachtungsbogen für Malaufträge</h2><label>Malauftrag <select id="bogenAufgabe"></select></label><label>Arbeit <select id="bogenWerk"><option value="">Bild 1</option><option value=".2">Bild 2</option></select></label><p id="bogenEntdeckung"></p><p>Entscheidend ist, wie das Kind seine Entscheidung untersucht und erklärt. Auch ein unerwarteter Farbton kann alle Kriterien erfüllen.</p><div id="bogenKriterien"></div><p id="bogenAuftrag" role="status"></p><label>Beleg aus dem Bild oder aus dem Gespräch<textarea id="bogenNotiz"></textarea></label><p>Der Bogen bleibt in diesem Browser. Für jeden Malauftrag kannst du zwei Bilder getrennt beurteilen.</p><button id="bogenDruck">Bogen drucken</button></article>';
 const auswahl=by('bogenAufgabe');titel.forEach((t,i)=>auswahl.add(new Option(t,String(i))));
 function laden(){
  const key='malbogen.'+auswahl.value+by('bogenWerk').value,daten=stored(key,{})||{},box=by('bogenKriterien');
  const bilanz=stored('gruenversuch',{})?.bilanz;
  by('bogenEntdeckung').textContent=auswahl.value==='0'&&!by('bogenWerk').value&&bilanz?bilanz:'';
  box.replaceChildren();
  function naechsterAuftrag(){
   const auftraege=['Wähle eine Stelle in deinem Bild und erkläre, warum deine Farbe dazu passt.','Verändere nur die Menge einer Farbe. Beschreibe, was sich gegenüber der ersten Probe ändert.','Lege die trockenen Proben nebeneinander. Erkläre mit einem Vergleichswort, wie deine Wahl im Bild wirkt.'];
   const offen=auftraege.findIndex((_,i)=>daten[i]!=='Selbstständig gezeigt');
   by('bogenAuftrag').textContent='Dein nächster Malauftrag: '+(auftraege[offen]||'Übertrage deine Mischung auf ein neues Motiv und begründe, was du dafür anpasst.');
  }
  naechsterAuftrag();
  ['Farbwahl begründen','Mischung gezielt verändern','Bildwirkung beschreiben'].forEach((k,i)=>{
    const label=document.createElement('label'),select=document.createElement('select');
    label.append(k+' ',select);for(const t of ['Noch nicht beobachtet','Mit Unterstützung gezeigt','Selbstständig gezeigt'])select.add(new Option(t,t));
    if(daten[i])select.value=daten[i];select.onchange=()=>{daten[i]=select.value;naechsterAuftrag();save(key,JSON.stringify(daten));};box.append(label);
  });
  by('bogenNotiz').value=daten.notiz||'';by('bogenNotiz').oninput=e=>{daten.notiz=e.target.value;save(key,JSON.stringify(daten));};
 }
 auswahl.onchange=laden;by('bogenWerk').onchange=laden;laden();
 by('bogenDruck').onclick=()=>{
  document.querySelector('.print-sheet')?.remove();
  const sheet=document.createElement('article');sheet.className='print-sheet';
  const zeilen=['Beobachtungsbogen',titel[Number(auswahl.value)]+' · '+by('bogenWerk').selectedOptions[0].textContent,by('bogenEntdeckung').textContent];
  for(const feld of by('bogenKriterien').querySelectorAll('select'))zeilen.push(feld.parentElement.firstChild.textContent.trim()+': '+feld.value);
  zeilen.push(by('bogenAuftrag').textContent,'Beleg aus dem Bild oder aus dem Gespräch',by('bogenNotiz').value);
  sheet.textContent=zeilen.filter(Boolean).join('\n\n');document.body.append(sheet);
  window.addEventListener('afterprint',()=>sheet.remove(),{once:true});window.print();
 };
}

function grueneTafel(){
 stage.innerHTML=`<article class="surface"><h2>Zwei Grünrezepte an der Tafel</h2><p>Welches Rezept ergibt mit unseren Farben das gelblichere Grün? Zeigt per Handzeichen auf A oder B.</p>
 <div class="gruen-paar"><div><h3>Rezept A</h3><p>3 Portionen Gelb<br>1 Portion Blau</p><label>Stimmen für A <input type="number" min="0" step="1" id="stimmenA"></label></div>
 <div><h3>Rezept B</h3><p>1 Portion Gelb<br>3 Portionen Blau</p><label>Stimmen für B <input type="number" min="0" step="1" id="stimmenB"></label></div></div>
 <button id="aufdecken">Mit den Malproben vergleichen</button><p id="tafelErgebnis" role="status"></p><a href="#gruenversuch">Zum eigenen Mischversuch</a></article>`;
 by('aufdecken').onclick=()=>{
  const stimmen=['A','B'].map(x=>by('stimmen'+x));
  for(const feld of stimmen){if(!feld.reportValidity())return;}
  const votum=stimmen.map((feld,i)=>feld.value?'Rezept '+('AB'[i])+': '+feld.value+' Stimmen. ':'').join('');
  by('tafelErgebnis').textContent=votum+'Im Modell wirkt A gelblicher. Haltet beide getrockneten Malproben daneben. Stimmt eure Vorhersage auch mit diesen Farben? Was fällt euch auf?';
 };
}

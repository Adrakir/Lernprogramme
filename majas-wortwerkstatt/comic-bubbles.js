(()=>{'use strict';
const key='majas-wortwerkstatt-sprechblasen-v1';
const entries=[
{panel:4,title:'Der Aufgabenberg',who:'Melody',prompt:'Wie fühlt sich Melody, als sie ihr volles Heft sieht?',example:'Das sind so viele Fragen! Wo soll ich anfangen?',verb:'schaute'},
{panel:7,title:'Maja hört zu',who:'Maja',prompt:'Wie könnte Maja Melody helfen, ohne die Aufgaben selbst zu lösen?',example:'Zeig mir, wo du nicht weiterkommst.',verb:'fragte'},
{panel:10,title:'Ein kleiner Trick',who:'Maja',prompt:'Welche Idee hat Maja, um nur die erste Aufgabe anzusehen?',example:'Wir decken die anderen Fragen kurz ab.',verb:'schob'},
{panel:13,title:'Die richtige Textstelle',who:'Melody',prompt:'Wie merkt Melody, dass sie die Antwort selbst gefunden hat?',example:'Hier steht es! Unter einem Blatt!',verb:'entdeckte'},
{panel:15,title:'Eine Pause',who:'Bärli',prompt:'Welche lustige Bemerkung würde Bärli machen?',example:'Das war ein bärenstarker erster Schritt!',verb:'jubelte'},
{panel:22,title:'Mut zum Nachfragen',who:'Frau Burger',prompt:'Wie könnte Frau Burger auf eine höfliche Frage antworten?',example:'Gute Frage! Lies den letzten Absatz noch einmal.',verb:'erklärte'}
];
const allowed=['Maja','Melody','Bärli','Frau Burger'];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=()=>{try{const r=JSON.parse(localStorage.getItem(key)||'{}');return r&&typeof r==='object'&&!Array.isArray(r)?r:{};}catch{return{}}};
const write=d=>{try{localStorage.setItem(key,JSON.stringify(d));}catch{}};
const get=()=>document.querySelector('#maja-bubble-editor');
function render(){
 const episode=detectiveEpisodes.find(e=>e.id==='melody-und-die-hausaufgaben'),saved=read();
 const body=entries.map((row,i)=>{
  const a=saved[i]||{},speaker=allowed.includes(a.who)?a.who:row.who,part=episode.panels[row.panel];
  return `<article class="maja-bubble-card" data-scene="${i}">
    <p class="kicker">Bild ${i+1} von ${entries.length}</p>
    <h3>${esc(row.title)}</h3>
    <div class="maja-bubble-art" role="img" aria-label="${esc(part[2])}" ${detectiveArt(episode,row.panel)}></div>
    <div class="maja-bubble-preview" aria-live="polite"><strong class="maja-bubble-speaker">${esc(speaker)}</strong><p class="maja-bubble-words">${esc(a.text||'Hier erscheint deine eigene Sprechblase.')}</p></div>
    <label class="field" for="maja-bubble-speaker-${i}">Wer spricht?</label>
    <select id="maja-bubble-speaker-${i}" data-bubble-speaker>${allowed.map(x=>`<option value="${esc(x)}" ${x===speaker?'selected':''}>${esc(x)}</option>`).join('')}</select>
    <label class="field" for="maja-bubble-input-${i}">Was sagt die Figur?</label>
    <textarea id="maja-bubble-input-${i}" data-bubble-text rows="3" maxlength="280" placeholder="${esc(row.example)}">${esc(a.text||'')}</textarea>
    <label class="field" for="maja-narrator-input-${i}">Erzählsatz im Präteritum (freiwillig)</label>
    <input type="text" id="maja-narrator-input-${i}" data-bubble-narration maxlength="300" placeholder="${esc('Maja '+row.verb+' ...')}" value="${esc(a.narration||'')}">
    <details><summary>Bärlis Schreibhilfe</summary><p>${esc(row.prompt)}</p><p>Schreib die direkte Rede in der Sprechblase ohne Anführungszeichen. Für eine Erzählung kann man schreiben: <strong>${esc(speaker)} sagte: „…“</strong>.</p></details>
  </article>`;
 }).join('');
 app.innerHTML=`<div class="route" id="maja-bubble-editor">${homeLink()}
  <div class="unit-head rose"><span class="icon-box">${icon('book')}</span><div>
  <p class="kicker">Majas Comic-Regie · Kreativwerkstatt</p><h1 tabindex="-1">Deine eigenen Sprechblasen</h1>
  <p>Sechs Bilder, viele Ideen. Schreibe neue Dialoge und übe dazu Erzählverben im Präteritum.</p></div></div>
  <section class="panel"><h2>So funktioniert's</h2><p>Schau dir jedes Bild an. Wähle, wer spricht, und schreibe einen passenden Satz. Die Figuren dürfen Gefühle zeigen, Fragen stellen und Witze machen. Du kannst deine Seite drucken.</p>
  <p class="subtle">Die Comiczeichnungen bleiben erhalten. Die neuen Sprechblasen stehen lesbar darunter. Deine Einträge bleiben auf diesem Gerät gespeichert.</p>
  <div class="maja-bubble-audio-grid">
  <div><strong>🐻 Bärlis Begrüßung</strong><audio controls preload="none" src="./audio/baerli-intro.mp3" aria-label="Bärlis feste KI-Sprechstimme"></audio></div>
  <div><strong>👧 Majas Mutmacher für Melody</strong><audio controls preload="none" src="./audio/maja-melody.mp3" aria-label="Majas feste KI-Sprechstimme für Melody"></audio></div></div></section>
  <div class="maja-bubble-grid">${body}</div>
  <section class="panel"><h2>Dein fertiger Comic</h2>
   <p id="maja-bubble-status" role="status">Deine Sprechblasen werden automatisch gespeichert.</p>
   <div class="actions"><button id="maja-bubble-check" class="primary" type="button">Sätze prüfen</button><button id="maja-bubble-print" class="secondary" type="button">Comic drucken</button><button id="maja-bubble-export" class="secondary" type="button">Texte herunterladen</button></div>
   <p class="subtle">Tipp: Beim Erzählen in der Vergangenheit passt zum Beispiel „fragte“, „entdeckte“, „schob“, „jubelte“. In der direkten Rede dürfen Figuren auch in der Gegenwart sprechen.</p>
   <div class="actions"><a href="#comicstudio" class="secondary">Zurück zur Comic-Regie</a><a href="#comicstudio/schreiben" class="secondary">Eine Geschichte aus dem Comic schreiben</a></div>
  </section></div>`;
 const root=get(),cards=[...root.querySelectorAll('[data-scene]')],status=root.querySelector('#maja-bubble-status');
 function save(){
  const d={};cards.forEach((card,i)=>{d[i]={who:card.querySelector('[data-bubble-speaker]').value,text:card.querySelector('[data-bubble-text]').value,narration:card.querySelector('[data-bubble-narration]').value}});
  write(d);return d;
 }
 function update(card){
  const t=card.querySelector('[data-bubble-text]').value;
  card.querySelector('.maja-bubble-speaker').textContent=card.querySelector('[data-bubble-speaker]').value;
  card.querySelector('.maja-bubble-words').textContent=t||'Hier erscheint deine eigene Sprechblase.';
  save();status.textContent='Deine neuen Texte sind auf diesem Gerät gespeichert.';
 }
 cards.forEach(card=>{for(const input of card.querySelectorAll('textarea,input,select'))input.addEventListener('input',()=>update(card));});
 root.querySelector('#maja-bubble-check').onclick=()=>{
   const d=save();const nonempty=Object.values(d).filter(x=>x.text.trim()).length;
   const long=Object.values(d).filter(x=>x.text.trim().length>160).length;
   const narration=Object.values(d).filter(x=>x.narration.trim()).length;
   const punctuation=Object.values(d).filter(x=>x.text.trim()&&!/[.!?…]$/.test(x.text.trim())).length;
   status.textContent=nonempty===0?'Schreibe zuerst mindestens eine Sprechblase.':
   `${nonempty} von ${entries.length} Sprechblasen ausgefüllt, ${narration} Erzählsätze. ${long?'Kürze lange Sprechblasen. ':''}${punctuation?'Prüfe am Satzende die Satzzeichen. ':''}Lies deinen Comic laut vor: Klingt der Dialog natürlich?`;
 };
 root.querySelector('#maja-bubble-print').onclick=()=>window.print();
 root.querySelector('#maja-bubble-export').onclick=()=>{
  const d=save();let text='Majas Comic: Eigene Sprechblasen\n\n';
  entries.forEach((row,i)=>{const a=d[i];text+=`Bild ${i+1}: ${row.title}\n${a.who}: ${a.text||'[noch leer]'}\n${a.narration?'Erzähltext: '+a.narration+'\n':''}\n`;});
  const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='majas-sprechblasen.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
}
window.MajaSpeechBubbles={render,entries};
})();
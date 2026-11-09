(function realAudioModule(){
 "use strict";
 const TRACKS=[
  {id:"baerli",title:"Bärli macht Mut",speaker:"Bärli",duration:"5,3 Sekunden",url:"./audio/figuren/baerli-mut.mp3",text:"Hallo Maja! Ich bin Bärli. Wir üben gemeinsam. Ein Schritt nach dem anderen!",question:"Was rät Bärli Maja?",answers:["Alles auf einmal schaffen.","Schritt für Schritt üben.","Die Aufgabe auslassen."],right:1,explanation:"Bärli sagt: Ein Schritt nach dem anderen. Das hilft, wenn eine Aufgabe zuerst schwer aussieht."},
  {id:"maja",title:"Maja hilft Melody",speaker:"Maja",duration:"3,9 Sekunden",url:"./audio/figuren/maja-melody.mp3",text:"Melody, wir schaffen das. Erst die erste Frage!",question:"Womit sollen die beiden beginnen?",answers:["Mit der ersten Frage.","Mit der letzten Seite.","Mit dem Seilspringen."],right:0,explanation:"Maja hilft Melody, indem sie nur die erste Frage anschaut. So bleibt die Aufgabe übersichtlich."}
 ];
 const KEY="majas-wortwerkstatt-figurenstimmen-2026-v1";
 const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function load(){
  try{const d=JSON.parse(localStorage.getItem(KEY)||"{}");return d&&typeof d==="object"&&!Array.isArray(d)?d:{};}catch{return {};}
 }
 function save(d){try{localStorage.setItem(KEY,JSON.stringify(d));return true;}catch{return false;}}
 function stop(){document.querySelectorAll(".fs-player").forEach(a=>{try{a.pause();a.currentTime=0;}catch{}});}
 function header(title,lead){
  return `<div class="route">${homeLink()}<div class="unit-head sky"><span class="icon-box">${icon("audio")}</span><div><p class="kicker">Majas Wortwerkstatt · echte Figurenstimmen</p><h1 tabindex="-1">${esc(title)}</h1><p>${esc(lead)}</p></div></div>`;
 }
 function player(track,showTask){
  return `<section class="panel fs-card" data-fs-track="${track.id}">
   <div class="fs-heading"><span class="fs-avatar" aria-hidden="true">${track.id==="baerli"?"🐻":"👧"}</span><div><p class="kicker">${esc(track.speaker)} · ${esc(track.duration)}</p><h2>${esc(track.title)}</h2></div></div>
   <audio class="fs-player" controls preload="none" src="${track.url}" aria-label="Originalstimme von ${esc(track.speaker)}"></audio>
   <p class="fs-status" role="status" aria-live="polite">Tippe auf ▶, um die Aufnahme anzuhören.</p>
   <div class="fs-controls"><label>Tempo <select class="fs-rate" aria-label="Tempo für ${esc(track.speaker)}"><option value="0.85">Langsam</option><option value="1" selected>Normal</option><option value="1.1">Etwas schneller</option></select></label></div>
   <details class="fs-script"><summary>Gesprochene Wörter als Lesehilfe</summary><p>${esc(track.text)}</p><p class="subtle">Nutze die Lesehilfe erst nach dem Zuhören, wenn du selbst hören üben möchtest.</p></details>
   ${showTask?`<div class="fs-task"><h3>${esc(track.question)}</h3><div class="fs-options">${track.answers.map((ans,i)=>`<button class="secondary" type="button" data-fs-answer="${i}">${esc(ans)}</button>`).join("")}</div><p class="fs-feedback" role="status" aria-live="polite"></p></div>`:""}
  </section>`;
 }
 function wire(area,task){
  const score=load();
  area.querySelectorAll("[data-fs-track]").forEach(card=>{
   const id=card.dataset.fsTrack,t=TRACKS.find(x=>x.id===id),audio=card.querySelector(".fs-player"),rate=card.querySelector(".fs-rate"),status=card.querySelector(".fs-status");
   rate.onchange=()=>audio.playbackRate=Number(rate.value);
   audio.onplaying=()=>{area.querySelectorAll(".fs-player").forEach(other=>{if(other!==audio)other.pause();});status.textContent="Aufnahme läuft. Hör genau hin!";
   };
   audio.onpause=()=>{if(audio.currentTime>0&&!audio.ended)status.textContent="Aufnahme pausiert.";};
   audio.onended=()=>status.textContent="Die Aufnahme ist zu Ende. Du kannst sie erneut hören.";
   audio.onerror=()=>status.textContent="Die Audiodatei konnte nicht geladen werden. Bitte die Internetverbindung prüfen oder die Lesehilfe nutzen.";
   if(!task)return;
   const feedback=card.querySelector(".fs-feedback"),buttons=card.querySelectorAll("[data-fs-answer]");
   if(score[id]?.correct)feedback.textContent="Diese Hörfrage hast du schon richtig beantwortet. Du darfst sie erneut üben.";
   buttons.forEach(b=>b.onclick=()=>{
    const correct=Number(b.dataset.fsAnswer)===t.right;
    const d=load();d[id]={correct:!!d[id]?.correct||correct,answeredAt:new Date().toISOString()};save(d);
    feedback.textContent=(correct?"Richtig! ":"Noch nicht ganz. ")+t.explanation;
    buttons.forEach(x=>{
     x.classList.toggle("fs-right",Number(x.dataset.fsAnswer)===t.right);
     x.classList.toggle("fs-wrong",x===b&&!correct);
    });
    const count=TRACKS.filter(x=>load()[x.id]?.correct).length,summary=area.querySelector("#fs-score");
    if(summary)summary.textContent=`${count} von 2 Hörfragen mindestens einmal richtig beantwortet.`;
   });
  });
 }
 function show(){
  stop();const d=load(),done=TRACKS.filter(t=>d[t.id]?.correct).length;
  app.innerHTML=header("Bärli und Maja sprechen!","Zwei kurze echte deutsche Tonaufnahmen mit kleinen Hörfragen. Du kannst jederzeit stoppen und erneut hören.")+
    `<section class="panel fs-guide"><h2>So wirst du Hördetektivin</h2><p>Höre zuerst ohne mitzulesen. Achte auf den wichtigsten Satz. Höre bei Bedarf noch einmal und wähle danach die Antwort.</p><p id="fs-score" role="status">${done} von 2 Hörfragen mindestens einmal richtig beantwortet.</p></section>`+
    TRACKS.map(t=>player(t,true)).join("")+
    `<section class="panel"><h2>Noch mehr Hörübungen</h2><p>Die kurzen Figurenstimmen helfen beim Einstieg. Für die Klassenarbeit übst du anschließend mit den längeren Hörgeschichten.</p><div class="actions"><a class="primary" href="#pruefung/hoeren/gefuehrt/1">Zum Hörverständnis</a><a class="secondary" href="#comicstudio">Zur Comic-Regie</a><a class="secondary" href="#start">Zur Startseite</a></div></section></div>`;
  wire(app,true);
 }
 function mount(page,index,part){
  if(!["start","comicstudio","pruefung","tagescomic"].includes(page))return;
  if(page==="pruefung"&&part==="test")return;
  if(page==="comicstudio" && index && !["toncheck"].includes(index))return;
  if(page==="pruefung" && index!=="hoeren")return;
  if(page==="tagescomic"&&index!=="melody-und-die-hausaufgaben")return;
  // Im Hörtest muss zuerst die eigentliche Hörsteuerung sichtbar sein.
  // Die Figurenstimmen bleiben als kurzer, optionaler Link NACH dem Hörbereich.
  if(page==="pruefung"&&index==="hoeren"){
   const player=app.querySelector(".prep-audio");
   if(player&&!app.querySelector(".fs-mini-link")){
    const link=document.createElement("div");
    link.className="actions fs-mini-link";
    link.innerHTML='<a class="secondary" href="#figurenstimmen">🐻 Bärli und Majas kurze Stimmen kennenlernen →</a>';
    player.insertAdjacentElement("afterend",link);
   }
   return;
  }
  const target=page==="start"?app.querySelector(".home-priorities"):app.querySelector(".route>.unit-head");
  if(!target||app.querySelector(".fs-mini"))return;
  const section=document.createElement("section");
  section.className="panel fs-mini";
  section.innerHTML=`<div class="fs-mini-copy"><div><h2>Jetzt mit echten Stimmen!</h2><p>Höre Bärli und Maja in zwei kurzen Aufnahmen. Danach kannst du die Hörfragen ausprobieren.</p></div><a class="primary" href="#figurenstimmen">Figurenstimmen anhören ${icon("arrow")}</a></div>`;
  target.insertAdjacentElement("afterend",section);
 }
 window.MajaRealAudio={show,mount,stop,tracks:TRACKS};
})();
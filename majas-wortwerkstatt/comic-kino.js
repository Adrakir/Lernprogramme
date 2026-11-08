(function comicKino(){
"use strict";
const KEY="majas-wortwerkstatt-comic-kino-v2";
let active=null;
const speakerPitch={"Erzähler":1,"Maja":1.1,"Bärli":0.78,"Melody":1.16,"Frau Burger":0.94,"Fuji":0.87,"Minka":1.22,"Anna":1.05,"Tom":0.96};
const speech=()=>window.speechSynthesis;
const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function read(){
 try{const o=JSON.parse(localStorage.getItem(KEY)||"{}");return o&&typeof o==="object"?o:{};}catch{return {};}
}
function write(o){try{localStorage.setItem(KEY,JSON.stringify(o));}catch{}}
function stop(){
 if(!active)return;
 const prev=active;active=null;prev.token++;
 try{speech()?.cancel();}catch{}
 if(prev.voiceListener&&typeof speech()?.removeEventListener==="function")speech().removeEventListener("voiceschanged",prev.voiceListener);
 if(prev.dialog?.isConnected){if(prev.dialog.open)prev.dialog.close();prev.dialog.remove();}
 prev.wrappers?.forEach(w=>w.classList.remove("kino-current"));
}
function available(){return (speech()?.getVoices?.()||[]).filter(v=>v.lang&&v.lang.toLowerCase().startsWith("de"));}
function mount({frames,mode="detective"}){
 stop();
 const area=document.querySelector(mode==="school"?".comic-panels":".detective-panels");
 if(!area||!Array.isArray(frames)||!frames.length)return;
 const figures=Array.from(area.children).filter(e=>e.tagName.toLowerCase()==="figure");
 if(figures.length!==frames.length)return;
 const config=read();
 const state={token:0,wrappers:[],dialog:null,voiceListener:null};
 active=state;
 const spoken=frames.map(lines=>lines.filter(o=>o&&typeof o.text==="string"&&o.text.trim()));
 const speakers=[...new Set(spoken.flat().map(line=>line.speaker||"Erzähler"))];
 const canSpeak=!!(window.SpeechSynthesisUtterance&&speech()?.speak);
 const controls=document.createElement("section");
 controls.className="panel kino-controls";
 controls.setAttribute("aria-label","Comic-Kino und Vorlesefunktion");
 controls.innerHTML=`<div class="kino-title"><div><h3>Comic-Kino</h3><p>Bilder in Ruhe ansehen und Sprechtexte einzeln oder nacheinander hören.</p></div><span class="kino-tech">Stimmen des Geräts</span></div>
 <div class="actions kino-actions"><button type="button" class="primary" data-kino="all" ${canSpeak?"":"disabled"}>▶ Ganze Seite vorlesen</button><button type="button" class="secondary" data-kino="pause" ${canSpeak?"":"disabled"}>Pause</button><button type="button" class="secondary" data-kino="stop" ${canSpeak?"":"disabled"}>Stopp</button></div>
 <div class="kino-settings"><label for="kino-speed">Vorlesetempo <select id="kino-speed"><option value="0.8">Langsam</option><option value="1">Normal</option><option value="1.15">Etwas schneller</option></select></label><label class="kino-checkbox"><input type="checkbox" id="kino-separate"> Sprechblasen unter dem Bild</label></div>
 <details class="kino-voice-settings"><summary>Stimmen für die Figuren auswählen</summary><p>Die verfügbaren deutschen Stimmen hängen vom Gerät und Browser ab. Wenn nur eine Stimme vorhanden ist, verändern sich stattdessen Tonhöhe und Sprechtempo etwas.</p><div class="kino-voices"></div></details>
 <p class="kino-status" role="status" aria-live="polite">${canSpeak?"Tippe auf „Ganze Seite vorlesen“ oder auf eine einzelne Szene.":"Auf diesem Gerät ist die Vorlesefunktion nicht verfügbar; die Texte können weiterhin gelesen werden."}</p>`;
 area.parentElement.insertBefore(controls,area);
 const get=q=>controls.querySelector(q),status=get(".kino-status");
 const setting= get("#kino-speed");setting.value=["0.8","1","1.15"].includes(String(config.speed))?String(config.speed):"1";
 setting.onchange=()=>{const d=read();d.speed=Number(setting.value);write(d);};
 const separate=get("#kino-separate");
 separate.checked= mode==="detective"?(config.separate!==false):true;
 area.classList.toggle("kino-separated",separate.checked);
 separate.onchange=()=>{area.classList.toggle("kino-separated",separate.checked);const d=read();d.separate=separate.checked;write(d);};
 const list=get(".kino-voices");
 function voiceList(){
  const voices=available(),saved=read().speakers||{};
  list.innerHTML=speakers.map((speaker,i)=>`<label class="kino-role">${escape(speaker)}<select data-speaker="${escape(speaker)}" aria-label="Stimme für ${escape(speaker)}">
    <option value="auto">Automatisch wählen</option>${voices.map((voice,index)=>`<option value="${index}" ${saved[speaker]===voice.voiceURI?"selected":""}>${escape(voice.name)} (${escape(voice.lang)})</option>`).join("")}</select></label>`).join("");
  for(const select of list.querySelectorAll("select[data-speaker]"))select.onchange=()=>{
    const d=read();d.speakers=d.speakers||{};
    const voice=voices[Number(select.value)];if(select.value==="auto"||!voice)delete d.speakers[select.dataset.speaker];
    else d.speakers[select.dataset.speaker]=voice.voiceURI;
    write(d);
  };
 }
 voiceList();
 state.voiceListener=()=>{if(active===state)voiceList();};
 speech()?.addEventListener?.("voiceschanged",state.voiceListener);
 const dialog=document.createElement("dialog");
 dialog.className="kino-dialog";
 dialog.setAttribute("aria-label","Comicbild vergrößert");
 dialog.innerHTML=`<div class="kino-dialog-top"><strong>Comicbild vergrößert</strong><button type="button" class="secondary kino-close">Schließen ×</button></div><div class="kino-zoom-art"></div><p class="kino-zoom-description"></p>`;
 document.body.appendChild(dialog);state.dialog=dialog;
 dialog.querySelector(".kino-close").onclick=()=>dialog.close();
 dialog.onclick=e=>{if(e.target===dialog)dialog.close();};
 const wraps=[];
 figures.forEach((fig,i)=>{
  const wrap=document.createElement("div");wrap.className="kino-panel-wrap";
  fig.parentNode.insertBefore(wrap,fig);wrap.appendChild(fig);
  wrap.insertAdjacentHTML("beforeend",`<div class="kino-panel-actions"><button type="button" class="secondary" data-kino-read="${i}" ${canSpeak?"":"disabled"}>▶ Bild ${i+1} anhören</button><button type="button" class="secondary" data-kino-zoom="${i}">Bild vergrößern</button></div>`);
  wraps.push(wrap);
 });
 state.wrappers=wraps;
 function current(i){
  wraps.forEach((w,index)=>w.classList.toggle("kino-current",index===i));
  if(i>=0&&wraps[i]){
   const w=wraps[i],r=w.getBoundingClientRect();
   if(r.top<0||r.bottom>window.innerHeight)w.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"nearest"});
  }
 }
 function finish(){if(active!==state)return;state.playing=false;current(-1);get('[data-kino="pause"]').textContent="Pause";status.textContent="Diese Comicseite ist zu Ende vorgelesen.";}
 function speakFrom(start,single=false){
  if(!canSpeak)return;
  state.token++;const token=state.token;
  speech().cancel();
  const queue=(single?[spoken[start]]:spoken.slice(start)).flatMap((sentences,i)=>sentences.map(line=>({...line,frame:start+i})));
  state.playing=true;state.paused=false;get('[data-kino="pause"]').textContent="Pause";
  function next(){
   if(active!==state||state.token!==token)return;
   if(!queue.length){finish();return;}
   const item=queue.shift();
   current(item.frame);
   status.textContent="Jetzt spricht: "+(item.speaker||"Erzähler")+".";
   const utterance=new SpeechSynthesisUtterance(item.text);
   utterance.lang="de-DE";
   utterance.rate=Number(setting.value)||1;
   utterance.pitch=speakerPitch[item.speaker]??(1+Math.min(.2,item.frame*.03));
   const options=available(),speaker=item.speaker||"Erzähler",saved=(read().speakers||{})[speaker];
   const voice=options.find(v=>v.voiceURI===saved)||options[speakers.indexOf(speaker)%Math.max(1,options.length)];
   if(voice)utterance.voice=voice;
   utterance.onend=()=>{if(active===state&&state.token===token)window.setTimeout(next,60);};
   utterance.onerror=e=>{
     if(active!==state||state.token!==token||["interrupted","canceled"].includes(e.error))return;
     status.textContent="Die Stimme konnte nicht abgespielt werden. Bitte eine andere Stimme wählen oder den Text lesen.";
     state.playing=false;current(-1);
   };
   try{speech().speak(utterance);}catch{state.playing=false;status.textContent="Das Vorlesen konnte nicht starten. Probiere eine andere Browserstimme.";}
  }
  next();
 }
 get('[data-kino="all"]').onclick=()=>speakFrom(0);
 get('[data-kino="pause"]').onclick=()=>{
  if(!state.playing)return;
  try{
   if(state.paused){speech().resume();state.paused=false;status.textContent="Vorlesen fortgesetzt.";get('[data-kino="pause"]').textContent="Pause";}
   else{speech().pause();state.paused=true;status.textContent="Vorlesen pausiert.";get('[data-kino="pause"]').textContent="Weiter";}
  }catch{status.textContent="Pause ist in diesem Browser nicht verfügbar.";}
 };
 get('[data-kino="stop"]').onclick=()=>{
  state.token++;state.playing=false;state.paused=false;
  try{speech()?.cancel();}catch{}
  current(-1);get('[data-kino="pause"]').textContent="Pause";status.textContent="Vorlesen gestoppt.";
 };
 for(const btn of area.querySelectorAll("[data-kino-read]"))btn.onclick=()=>speakFrom(Number(btn.dataset.kinoRead),true);
 for(const btn of area.querySelectorAll("[data-kino-zoom]"))btn.onclick=()=>{
  const i=Number(btn.dataset.kinoZoom),figure=figures[i],art=figure.querySelector(".comic-art,.detective-art");
  if(!art)return;
  const clone=art.cloneNode(true);clone.removeAttribute("role");clone.removeAttribute("aria-label");
  const target=dialog.querySelector(".kino-zoom-art");target.replaceChildren(clone);
  dialog.querySelector(".kino-zoom-description").textContent=art.getAttribute("aria-label")||"Comicbild "+(i+1);
  if(!dialog.open){try{dialog.showModal();}catch{dialog.setAttribute("open","");}}
 };
}
window.MajaComicKino={mount,stop};
})();
(function majaPlusModule(){
  "use strict";
  const STORE="majas-wortwerkstatt-plus-2026-11";
  const SAFE_PREFIX="majas-wortwerkstatt";
  const defaults={font:"normal",contrast:"normal",motion:"normal",days:{},repaired:{}};
  function read(){
    try{
      const data=JSON.parse(localStorage.getItem(STORE)||"{}");
      return data && typeof data==="object" && !Array.isArray(data) ? {...defaults,...data,days:data.days||{},repaired:data.repaired||{}} : {...defaults};
    }catch{return {...defaults};}
  }
  function save(data){try{localStorage.setItem(STORE,JSON.stringify(data));return true;}catch{return false;}}
  function esc(v){return escapeHtml(String(v??""));}
  function cardTitle(title,description){
    return `<div class="route">${homeLink()}<div class="unit-head mint"><span class="icon-box">★</span><div><p class="kicker">Majas Wortwerkstatt · Neues Lernstudio</p><h1 tabindex="-1">${esc(title)}</h1><p>${esc(description)}</p></div></div>`;
  }
  function dayKey(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
  function mistakes(){
    const sessions=prepRead(),all=new Map();
    for(const [key,session] of Object.entries(sessions)){
      const m=/^(nomen|hoeren):(test|ueben):([1-5])$/.exec(key);
      if(!m||!session?.done||!Array.isArray(session.answers))continue;
      const [,topic,mode,num]=m;
      const questions=prepTasks(topic,mode,Number(num));
      for(let i=0;i<questions.length;i++){
        const q=questions[i],a=session.answers[i];
        if(!a||a.correct)continue;
        const id=topic+":"+q.id;
        if(!all.has(id))all.set(id,{id,topic,q,count:0});
        all.get(id).count++;
      }
    }
    return Array.from(all.values()).sort((a,b)=>b.count-a.count);
  }
  function skillText(skill){
    if(skill==="hoeren")return "Hörverständnis";
    if(skill==="verlaengern")return "Wörter verlängern";
    return "Nomen mit -"+String(skill||"").replace(/^-/,"");
  }
  function skillHelp(q){
    switch(q.skill){
      case "hoeren":return "Höre die Stelle noch einmal. Wer handelt? Was geschieht zuerst, was danach? Begründe die Antwort mit einem Hinweis aus dem Text.";
      case "verlaengern":return "Sage das Wort in der Mehrzahl: ein Berg – viele Berge. Jetzt hörst du das g deutlicher. Prüfe den fraglichen Buchstaben.";
      case "nis":return "Bei -nis musst du den Artikel lernen: das Erlebnis, das Geheimnis, aber die Kenntnis und die Erkenntnis.";
      case "keit":return "Aus vielen Wiewörtern mit -ig oder -lich werden Nomen mit -keit: freundlich → die Freundlichkeit.";
      case "heit":return "Eigenschaft wird zum Nomen: frei → die Freiheit. Nomen schreibst du groß.";
      case "schaft":return "Die Endung -schaft bezeichnet oft eine Gruppe, Beziehung oder Eigenschaft: Freund → die Freundschaft.";
      case "ung":return "Aus einem Verb entsteht häufig ein Nomen auf -ung: retten → die Rettung.";
      default:return "Lies die Aufgabe langsam und prüfe die passende Regel.";
    }
  }
  function showDaily(){
    const data=read(),today=dayKey(),marked=data.days[today]||{};
    const trouble=mistakes().filter(x=>!data.repaired[x.id]);
    const emphasis=trouble.length ? skillText(trouble[0].q.skill) : "Nomen und Hörverständnis";
    const steps=[
      {id:"listen",minutes:3,title:"Hördetektivin",desc:"Höre eine kurze Geschichte und beantworte fünf Fragen.",href:"#pruefung/hoeren/ueben/1"},
      {id:"words",minutes:3,title:"Nomen-Entdeckerin",desc:"Übe Endungen und verlängere Wörter. Nutze bei Bedarf die drei Hilfen.",href:"#pruefung/nomen/ueben/1"},
      {id:"retry",minutes:2,title:"Fehler-Forscherin",desc:"Wiederhole genau die Aufgaben, die früher schwierig waren.",href:"#fehlertraining"},
      {id:"game",minutes:2,title:"Spielpause mit Bärli",desc:"Sammle Nomen beim Go-Kart oder spiele das Wörterabenteuer.",href:"#spiele/kart"}
    ];
    app.innerHTML=cardTitle("Deine 10-Minuten-Mission","Vier kurze Stationen – ohne Zeitdruck und mit deinem eigenen Tempo.")+
      `<section class="panel"><p class="kicker">Heute · ${esc(new Date().toLocaleDateString("de-DE",{day:"numeric",month:"long",year:"numeric"}))}</p><h2>Mein heutiger Schwerpunkt: ${esc(emphasis)}</h2><p>Du entscheidest selbst, wann eine Station geschafft ist. Pausen sind erlaubt.</p><div class="plus-progress" role="progressbar" aria-label="Heutige Stationen" aria-valuemin="0" aria-valuemax="4" aria-valuenow="${steps.filter(s=>marked[s.id]).length}"><span style="width:${25*steps.filter(s=>marked[s.id]).length}%"></span></div><p id="plus-daily-counter">${steps.filter(s=>marked[s.id]).length} von 4 Stationen geschafft</p></section>`+
      steps.map((s,i)=>`<section class="panel plus-step"><div><p class="kicker">Station ${i+1} · ungefähr ${s.minutes} Minuten</p><h2>${esc(s.title)}</h2><p>${esc(s.desc)}</p></div><div class="actions"><a class="primary" href="${s.href}">Üben</a><label class="plus-check"><input type="checkbox" data-plus-step="${s.id}" ${marked[s.id]?"checked":""}> Erledigt</label></div></section>`).join("")+
      `<section class="panel"><h2>Morgen geht es weiter</h2><p>Du kannst jeden Tag neu starten. Deine abgeschlossenen Aufgaben und Sterne bleiben gespeichert.</p><div class="actions"><a class="secondary" href="#pruefung">Klassenarbeiten</a><a class="secondary" href="#einstellungen">Lernstand sichern</a></div></section></div>`;
    for(const cb of app.querySelectorAll("[data-plus-step]"))cb.addEventListener("change",()=>{
      const updated=read();updated.days[today]={...(updated.days[today]||{}),[cb.dataset.plusStep]:cb.checked};save(updated);
      const count=steps.filter(s=>updated.days[today][s.id]).length;
      app.querySelector("#plus-daily-counter").textContent=`${count} von 4 Stationen geschafft`;
      const bar=app.querySelector(".plus-progress");bar.setAttribute("aria-valuenow",count);bar.firstElementChild.style.width=(count*25)+"%";
    });
  }
  function showErrors(filter){
    const data=read(),errors=mistakes(),topic=["nomen","hoeren"].includes(filter)?filter:null,items=errors.filter(x=>!topic||x.topic===topic);
    app.innerHTML=cardTitle("Mein Fehlertrainer","Falsche Antworten aus abgeschlossenen Übungen und Tests werden zu neuen Lernchancen.")+
      `<section class="panel"><h2>Deine Fehlerlupe</h2><p>Gefundene unterschiedliche Übungsaufgaben: <strong>${items.length}</strong>. Bereits erfolgreich nachgeübt: <strong>${items.filter(x=>data.repaired[x.id]).length}</strong>.</p><div class="actions"><a class="secondary" href="#fehlertraining">Alle</a><a class="secondary" href="#fehlertraining/hoeren">Hörverständnis</a><a class="secondary" href="#fehlertraining/nomen">Nomen und Verlängern</a></div></section>`+
      (items.length?items.map((entry,i)=>`<section class="panel plus-error" data-error-id="${esc(entry.id)}"><p class="kicker">Übung ${i+1} · ${esc(skillText(entry.q.skill))} ${data.repaired[entry.id]?"· schon einmal nachgeübt":""}</p><h2>${esc(entry.q.prompt)}</h2>${entry.q.context?`<p class="prep-word">${esc(entry.q.context)}</p>`:""}${entry.topic==="hoeren"?`<audio controls preload="none" src="./anna-audio/${encodeURIComponent(entry.q.track)}.mp3" aria-label="Geschichte erneut anhören"></audio>`:""}<form class="plus-try" data-plus-id="${esc(entry.id)}">${entry.q.type==="choice"?`<fieldset class="plus-fieldset"><legend>Wähle die beste Antwort</legend>${entry.q.options.map((option,j)=>`<label><input type="radio" name="antwort-${i}" value="${esc(option)}"> ${esc(option)}</label>`).join("")}</fieldset>`:`<label for="plus-ans-${i}">Deine neue Antwort</label><input type="text" id="plus-ans-${i}" autocomplete="off" spellcheck="false" required>`}<div class="actions"><button class="primary" type="submit">Prüfen</button><button type="button" class="secondary plus-hint">Tipp anzeigen</button></div></form><div class="plus-hint-text" hidden>${esc(skillHelp(entry.q))}</div><p class="plus-feedback" role="status" aria-live="polite"></p></section>`).join(""):`<section class="panel"><h2>Sehr gut!</h2><p>Zu diesem Bereich sind noch keine falschen Antworten aus abgeschlossenen Übungen oder Tests gespeichert. Du kannst trotzdem weitertrainieren.</p><div class="actions"><a class="primary" href="#pruefung/nomen/ueben/1">Nomen trainieren</a><a class="secondary" href="#pruefung/hoeren/ueben/1">Hören trainieren</a></div></section>`)+`<div class="actions"><a class="secondary" href="#tagesplan">Zur Tagesmission</a><a class="secondary" href="#pruefung">Zu den Abschlusstests</a></div></div>`;
    const lookup=new Map(items.map(x=>[x.id,x]));
    for(const form of app.querySelectorAll("form[data-plus-id]")){
      const item=lookup.get(form.dataset.plusId),panel=form.closest(".plus-error");
      panel.querySelector(".plus-hint").onclick=()=>{panel.querySelector(".plus-hint-text").hidden=false;};
      form.onsubmit=e=>{
        e.preventDefault();
        const chosen=item.q.type==="choice"?form.querySelector("input:checked")?.value:form.querySelector("input[type=text]")?.value;
        const status=panel.querySelector(".plus-feedback");
        if(!chosen?.trim()){status.textContent="Trage zuerst deine Antwort ein.";return;}
        if(prepCorrect(item.q,chosen)){
          const current=read();current.repaired[item.id]=true;save(current);
          status.textContent="Richtig! "+item.q.why+" Du kannst den nächsten Fehler bearbeiten.";
          form.querySelectorAll("input,button").forEach(x=>x.disabled=true);
        }else{
          status.textContent="Noch nicht richtig. "+skillHelp(item.q);
          panel.querySelector(".plus-hint-text").hidden=false;
        }
      };
    }
  }
  function apply(){
    const data=read();const html=document.documentElement;
    html.dataset.majaFont=["normal","gross"].includes(data.font)?data.font:"normal";
    html.dataset.majaContrast=["normal","hoch"].includes(data.contrast)?data.contrast:"normal";
    html.dataset.majaMotion=["normal","weniger"].includes(data.motion)?data.motion:"normal";
  }
  function showSettings(){
    const data=read();
    app.innerHTML=cardTitle("Einstellungen & Datensicherung","Lesbarkeit anpassen und den Lernstand sicher auf ein anderes Gerät übertragen.")+
      `<section class="panel"><h2>Darstellung</h2><p>Die Einstellungen gelten für dieses Gerät.</p><div class="plus-setting"><strong>Schriftgröße</strong><div class="actions"><button class="secondary" data-set="font:normal">Normal</button><button class="secondary" data-set="font:gross">Groß</button></div></div><div class="plus-setting"><strong>Kontrast</strong><div class="actions"><button class="secondary" data-set="contrast:normal">Standard</button><button class="secondary" data-set="contrast:hoch">Hoch</button></div></div><div class="plus-setting"><strong>Animationen</strong><div class="actions"><button class="secondary" data-set="motion:normal">Normal</button><button class="secondary" data-set="motion:weniger">Weniger Bewegung</button></div></div><p id="plus-appearance" class="inline-status" role="status">Aktuell: ${data.font==="gross"?"große":"normale"} Schrift, ${data.contrast==="hoch"?"hoher":"normaler"} Kontrast.</p></section>`+
      `<section class="panel"><h2>Lernstand mitnehmen</h2><p>Die App speichert Ergebnisse lokal im Browser. Mit dieser Datei lassen sich Lernstände und Sterne auf ein anderes Gerät übertragen. Die Datei bleibt bei dir; es findet kein automatischer Upload statt.</p><div class="actions"><button class="primary" id="plus-export" type="button">Lernstand exportieren</button></div><label class="field" for="plus-import">Sicherung auswählen (JSON-Datei)</label><input id="plus-import" type="file" accept=".json,application/json"><button class="secondary" id="plus-restore" type="button">Sicherung einlesen</button><p class="inline-status" id="plus-backup-status" role="status"></p><p class="subtle">Achtung: Beim Einlesen werden vorhandene lokale Lernstände mit gleichen Schlüsseln ersetzt. Vorher wird um Bestätigung gebeten. Audioaufnahmen gehören nicht zur Sicherung.</p></section><div class="actions"><a class="secondary" href="#erwachsene">Zur Lernübersicht</a><a class="secondary" href="#tagesplan">Zum Tagesplan</a></div></div>`;
    for(const button of app.querySelectorAll("[data-set]"))button.onclick=()=>{
      const [key,value]=button.dataset.set.split(":"),next=read();
      next[key]=value;save(next);apply();app.querySelector("#plus-appearance").textContent="Einstellung gespeichert.";
    };
    app.querySelector("#plus-export").onclick=()=>{
      const values={};
      for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key&&key.startsWith(SAFE_PREFIX))values[key]=localStorage.getItem(key);}
      const file={app:"majas-wortwerkstatt",version:1,date:new Date().toISOString(),values};
      const blob=new Blob([JSON.stringify(file,null,2)],{type:"application/json"});
      const url=URL.createObjectURL(blob),a=document.createElement("a");
      a.href=url;a.download="majas-wortwerkstatt-lernstand-"+dayKey()+".json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
      app.querySelector("#plus-backup-status").textContent="Die Sicherungsdatei wurde zum Download bereitgestellt.";
    };
    app.querySelector("#plus-restore").onclick=async()=>{
      const status=app.querySelector("#plus-backup-status"),file=app.querySelector("#plus-import").files[0];
      if(!file){status.textContent="Bitte zuerst eine Sicherungsdatei auswählen.";return;}
      if(file.size>2*1024*1024){status.textContent="Die Datei ist zu groß (maximal 2 MB).";return;}
      try{
        const parsed=JSON.parse(await file.text());
        if(parsed?.app!=="majas-wortwerkstatt"||parsed.version!==1||!parsed.values||typeof parsed.values!=="object"||Array.isArray(parsed.values))throw Error("Ungültige Sicherungsdatei.");
        const entries=Object.entries(parsed.values);
        if(entries.length>200||entries.some(([k,v])=>!k.startsWith(SAFE_PREFIX)||typeof v!=="string"||v.length>1000000))throw Error("Unzulässige Datei-Inhalte.");
        if(!confirm("Bestehende Lernstände mit denselben Schlüsseln werden ersetzt. Sicherung wirklich einlesen?"))return;
        for(const [k,v] of entries)localStorage.setItem(k,v);
        status.textContent="Lernstände eingelesen. Seite wird neu geladen.";
        window.location.reload();
      }catch(e){status.textContent="Einlesen nicht möglich: "+(e.message||"ungültige Datei");}
    };
  }
  window.MajaPlus={showDaily,showErrors,showSettings,mistakes,skillHelp,apply};
  apply();
})();
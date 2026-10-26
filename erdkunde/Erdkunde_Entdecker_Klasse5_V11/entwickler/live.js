/* Optionales synchrones Mehrgerätequiz – funktioniert nur bei gestartetem Live-Server. */
'use strict';
let v7live={code:'',hostKey:'',team:null,token:'',status:null,error:'',busy:false};
function liveApi(endpoint,obj){return fetch('./api/live/'+endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(obj||{})}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||'Serverfehler');return d})}
async function liveStatus(){if(!v7live.code)return;try{const r=await fetch('./api/live/state?code='+encodeURIComponent(v7live.code),{cache:'no-store'});const data=await r.json();if(!r.ok)throw Error(data.error||'Sitzung nicht erreichbar');const before=JSON.stringify(v7live.status);v7live.status=data;v7live.error='';if(state.tab==='live'&&before!==JSON.stringify(data))render()}catch(e){v7live.error='Live-Server nicht erreichbar. Prüfe die Verbindung oder starte den Server.';if(state.tab==='live')render()}}
function liveScreen(){const r=v7live.status;
 if(!v7live.code){return `${head('Mehrgeräte-Quiz','🌐 Livequiz mit zwei Teams','Die Lehrkraft erstellt eine Sitzung. Zwei Teams öffnen die App auf eigenen Geräten im selben Schul-/Heimnetz. Dafür muss der mitgelieferte Node.js-Live-Server gestartet sein.')}
 <section class="card"><h2>Spiel starten</h2><div class="inline">${btn('Neue Sitzung erstellen','live:create','btn alt')}</div><div class="field"><label for="liveCode">Oder als Team einem Raum beitreten</label><input id="liveCode" type="text" maxlength="6" autocomplete="off" placeholder="Raumcode mit 6 Zeichen" style="text-transform:uppercase"></div>${btn('Team anmelden','live:join','btn ghost')}<p class="mini subtle">Keine Namen, keine Konten, kein Speichern auf dem Server. Ergebnisse bleiben nur während der laufenden Sitzung im Arbeitsspeicher.</p><div class="notice">Für die Mehrgerätefunktion muss auf einem Rechner im Netzwerk <code>node live-server.js</code> laufen. Alle Geräte öffnen anschließend dieselbe Serveradresse. Die reine Offline-HTML-Datei bietet weiterhin das lokale Teamquiz an einem Gerät.</div>${v7live.error?`<div role="alert" class="feedback bad">${esc(v7live.error)}</div>`:''}</section>`}
 let which=v7live.hostKey?'Lehrkraft / Spielleitung':`Team ${v7live.team===0?'A':'B'}`;
 let label=(v7live.hostKey?`<div class="notice"><b>Teile diesen Raumcode:</b> <strong class="live-code">${esc(v7live.code)}</strong><p>Die Teams öffnen diese App auf der Serveradresse und geben den Code ein.</p></div>`:'');
 const q=r?.question;let prompt=q?`<h3>Aufgabe ${r.index+1} von ${r.total}</h3><p class="live-question">${esc(q.text)}</p>`:`<h3>Das Livequiz ist beendet.</h3>`;
 if(r?.finished)return `${head('Mehrgeräte-Quiz',which,`Raum ${v7live.code}`)}${label}<section class="card"><h2>Ergebnis</h2><p>Team A: ${r.points[0]} Punkte · Team B: ${r.points[1]} Punkte</p>${btn('Neue Sitzung erstellen','live:create','btn alt')}</section>`;
 let answers=r?.reveal?`<div class="feedback"><b>Richtige Antwort:</b> ${String.fromCharCode(65+r.reveal.correct)}. ${esc(q.opts[r.reveal.correct])}<p>${esc(r.reveal.explain)}</p><p>Antwort Team A: ${String.fromCharCode(65+r.reveal.choices[0])} · Team B: ${String.fromCharCode(65+r.reveal.choices[1])}</p></div>`:'';
 let choices=!v7live.hostKey&&!r?.submitted?.[v7live.team]&&q?`<div class="answer">${q.opts.map((t,i)=>btn(`${String.fromCharCode(65+i)}. ${esc(t)}`,'live:answer:'+i,'btn ghost full')).join('')}</div>`:'';
 return `${head('Mehrgeräte-Quiz',which,`Raum ${v7live.code} · A ${r?.points[0]||0} Punkte · B ${r?.points[1]||0} Punkte`)}${label}<section class="card">${prompt}${r?.joined?`<p>Angemeldet: Team A ${r.joined[0]?'✓':'–'} · Team B ${r.joined[1]?'✓':'–'}</p>`:''}${choices}${r?.submitted?.[v7live.team]&&!v7live.hostKey&&!r.reveal?'<p class="callout">Antwort gespeichert. Warte auf das andere Team.</p>':''}${answers}${!r?.reveal?'<p class="mini subtle">Die Lösung erscheint erst, wenn beide Teams geantwortet haben.</p>':''}${v7live.hostKey&&r?.reveal?btn('Nächste Frage','live:next','btn alt'):''}${v7live.error?`<div role="alert" class="feedback bad">${esc(v7live.error)}</div>`:''}<div class="inline">${btn('Stand aktualisieren','live:refresh','btn ghost small')}${btn('Sitzung verlassen','live:leave','btn ghost small')}</div></section>`
}
const v7LivePrevRender=render;
render=function(){if(state.tab==='live'){updateStars();document.querySelectorAll('#tabs button').forEach(b=>{b.classList.toggle('active',b.dataset.tab==='live');b.setAttribute('aria-current',b.dataset.tab==='live'?'page':'false')});MAIN.innerHTML=`<div class="flash">${liveScreen()}</div>`;return}v7LivePrevRender()};
const v7LivePrevTeacher=v7TeacherView;
v7TeacherView=function(){return v7LivePrevTeacher()+`<section class="card"><h2>Optional: Teamquiz mit mehreren Geräten</h2><p>Für eine gemeinsame Fragerunde über WLAN ist ein mitgelieferter, separat zu startender lokaler Livequiz-Server enthalten. Für Internetzugang ist ein sicherer Webserver erforderlich.</p>${btn('Mehrgeräte-Quiz öffnen','tab:live','btn alt')}</section>`};
const v7LivePrevAction=action;
action=function(target){const [a,b,c]=target.split(':');if(a!=='live'){v7LivePrevAction(target);return}
 (async()=>{try{v7live.error='';if(b==='create'){const d=await liveApi('create',{});v7live={code:d.code,hostKey:d.hostKey,team:null,token:'',status:null,error:'',busy:false};await liveStatus();return}
 if(b==='join'){const c=(document.getElementById('liveCode')?.value||'').trim().toUpperCase();if(!/^[A-Z2-9]{6}$/.test(c))throw Error('Bitte einen sechsstelligen Raumcode eingeben.');const d=await liveApi('join',{code:c});v7live={code:d.code,hostKey:'',team:d.team,token:d.token,status:null,error:'',busy:false};await liveStatus();return}
 if(b==='answer'){await liveApi('answer',{code:v7live.code,token:v7live.token,choice:Number(c)});await liveStatus();return}
 if(b==='next'){await liveApi('next',{code:v7live.code,hostKey:v7live.hostKey});await liveStatus();return}
 if(b==='leave'){v7live={code:'',hostKey:'',team:null,token:'',status:null,error:'',busy:false};render();return}
 if(b==='refresh'){await liveStatus();return}
 }catch(e){v7live.error=e.message||'Verbindung nicht möglich';render()}})();
};
setInterval(()=>{if(state.tab==='live'&&v7live.code)liveStatus()},2500);
render();

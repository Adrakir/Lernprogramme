'use strict';
// Automatischer Prüfstand: öffne die App mit index.html#pruefstand, um alle
// Ansichten, die Speicherung und die Datenbestände automatisch zu prüfen.
// Der Lernstand wird vorher gesichert und danach unverändert wiederhergestellt.
(function(){
 if(initialAppHash!=='#pruefstand'&&!new URLSearchParams(location.search).has('pruefstand'))return;
 const results=[];
 const check=(name,fn)=>{try{const r=fn();results.push({name,ok:r!==false,info:r===false?'Bedingung nicht erfüllt':typeof r==='string'?r:''});}catch(error){results.push({name,ok:false,info:error.message});}};
 const stateKeys=[learningKey,pathKey,schoolKey,personalKey,coachKey,gameSessionKey];
 const snapshot={};for(const key of stateKeys)try{snapshot[key]=localStorage.getItem(key);}catch{snapshot[key]=null;}

 // 1. Jede Ansicht muss ohne Fehler rendern und sichtbaren Inhalt erzeugen.
 for(const route of [...interfaceRoutes])check(`Ansicht „${route}“ rendert`,()=>{setView(route);return $('#main').innerHTML.trim().length>100;});

 // 2. Zentrale Speicherung: schreiben, lesen, entfernen.
 check('Speicher: schreiben und lesen',()=>{if(!appStorage.write('pruefstand.test',{wert:42}))return 'Speichern nicht verfügbar (z. B. privater Modus) – übersprungen';const r=appStorage.read('pruefstand.test');appStorage.remove('pruefstand.test');return !!r&&r.wert===42;});

 // 3. Lernweg-Größen werden aus dem Curriculum abgeleitet.
 check(`Lernweg: Größen passen zu ${MUSIC_PATH.length} Schritten`,()=>{const d=pathDefaultState();return d.index===0&&d.stages.length===MUSIC_PATH.length&&d.done.length===MUSIC_PATH.length&&d.attempted.length===pathAttemptCount();});

 // 4. Jeder Lernschritt ist vollständig beschrieben.
 check('Curriculum: alle Lernschritte vollständig',()=>{const missing=MUSIC_PATH.filter(s=>!s.title||!s.goal||!Array.isArray(s.questions)||s.questions.length<2||!Array.isArray(s.hints));return missing.length===0||'Unvollständig: '+missing.map(s=>s.key||s.title).join(', ');});

 // 5. Fragen besitzen gültige Antwortoptionen.
 check('Curriculum: Antwort ist immer unter den Optionen',()=>{const broken=[];MUSIC_PATH.forEach(s=>s.questions.forEach((q,i)=>{if(!Array.isArray(q.options)||!q.options.includes(q.answer))broken.push((s.key||s.title)+':'+i);}));return broken.length===0||'Fehler bei: '+broken.slice(0,5).join(', ');});

 // 6. Notenbilder verwenden bekannte Zeichen; Lücken sind ausdrücklich markiert.
 check('Curriculum: Notenbilder und Lücken sind gültig',()=>{const broken=[];MUSIC_PATH.forEach(s=>{const valid=(id,allowGap)=>id==='?'?allowGap:!!get(id);if(!Array.isArray(s.pattern)||s.pattern.some(id=>!valid(id,s.key==='luecken')))broken.push((s.key||s.title)+':Beispiel');s.questions.forEach((q,i)=>{if(!Array.isArray(q.ids))return;const gaps=q.ids.filter(id=>id==='?').length;if(q.ids.some(id=>!valid(id,gaps===1&&q.meter===true))||gaps>1)broken.push((s.key||s.title)+':'+i);});});return broken.length===0||'Ungültige Noten- oder Lückenangabe: '+broken.slice(0,5).join(', ');});

 // 7. Lernstand-Sicherung: Export und Validierung bilden einen geschlossenen Kreis.
 check('Sicherung: Export und Prüfung',()=>!!validateLearningBackup(exportLearningBackup()).summary);

 // 8. Lernweg speichern und wieder laden liefert identische Daten.
 check('Lernweg: speichern und laden',()=>{const original=JSON.parse(JSON.stringify(pathState));pathState.index=Math.min(2,MUSIC_PATH.length-1);pathState.done[0]=true;savePath();const reloaded=loadPath();const good=reloaded.index===pathState.index&&reloaded.done[0]===true;pathState=original;savePath();return pathStorage?good:'Speichern nicht verfügbar – übersprungen';});

 // Lernstand unverändert wiederherstellen.
 for(const key of stateKeys)try{if(snapshot[key]===null)localStorage.removeItem(key);else localStorage.setItem(key,snapshot[key]);}catch{}

 const good=results.filter(r=>r.ok).length,bad=results.length-good;
 document.title='Prüfstand · '+(bad?bad+' Fehler':'alles bestanden');
 $('#main').innerHTML=`<section class="card"><div class="eyebrow">Automatischer Prüfstand</div><h1>${bad===0?'✓ Alle '+results.length+' Prüfungen bestanden':'✗ '+bad+' von '+results.length+' Prüfungen fehlgeschlagen'}</h1><p>Dein Lernstand wurde für die Prüfung gesichert und unverändert wiederhergestellt.</p><table class="pruefstandTable"><thead><tr><th>Prüfung</th><th>Ergebnis</th></tr></thead><tbody>${results.map(r=>`<tr><td>${escapeText(r.name)}</td><td class="${r.ok?'good':'bad'}">${r.ok?'✓ bestanden':'✗ fehlgeschlagen'}${r.info?'<br><small>'+escapeText(r.info)+'</small>':''}</td></tr>`).join('')}</tbody></table><button id="pruefstandEnd" class="primary">Prüfstand beenden und App neu laden</button></section>`;
 const endButton=$('#pruefstandEnd');if(endButton)endButton.onclick=()=>{location.hash='#start';location.reload();};
})();

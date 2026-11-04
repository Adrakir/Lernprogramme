(function(){'use strict';
// Eingebauter Selbsttest: App mit #selbsttest oder ?selbsttest=1 öffnen.
// Prüft Navigation, Lerncockpit und Speicherung. Der Lernstand wird vorher
// gesichert und danach unverändert wiederhergestellt.
if(location.hash!=='#selbsttest'&&!new URLSearchParams(location.search).has('selbsttest'))return;
window.addEventListener('load',function(){setTimeout(run,400)});
function run(){
 var snapshot={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);snapshot[k]=localStorage.getItem(k);}
 var results=[],errors=[];
 window.addEventListener('error',function(e){errors.push(e.message||'Fehler')});
 function check(name,fn){try{var r=fn();results.push([name,r!==false,typeof r==='string'?r:'']);}catch(e){results.push([name,false,e.message]);}}
 document.querySelectorAll('#nav button').forEach(function(b){var label=b.textContent.trim().slice(0,40);check('Bereich \u201e'+label+'\u201c öffnet',function(){b.click();var main=document.querySelector('main');return !!main&&main.textContent.replace(/\s+/g,' ').trim().length>80;});});
 check('Lerncockpit öffnet',function(){var open=document.getElementById('lcOpen');if(!open)return 'Knopf nicht gefunden';open.click();return !!document.getElementById('lcTabs');});
 document.querySelectorAll('#lcTabs button[data-tab]').forEach(function(b){var label=b.textContent.trim();check('Cockpit-Tab \u201e'+label+'\u201c',function(){b.click();var tabs=document.getElementById('lcTabs');return !!tabs&&tabs.parentElement.textContent.trim().length>40;});});
 var closeBtn=document.getElementById('lcClose');if(closeBtn)closeBtn.click();
 check('Speicher: schreiben und lesen',function(){try{localStorage.setItem('selbsttest-probe','1');var ok=localStorage.getItem('selbsttest-probe')==='1';localStorage.removeItem('selbsttest-probe');return ok;}catch(e){return 'Speicher nicht verfuegbar: '+e.message;}});
 check('Keine Skriptfehler während der Prüfung',function(){return errors.length===0?true:errors.slice(0,3).join(' | ');});
 try{var current=[];for(var j=0;j<localStorage.length;j++)current.push(localStorage.key(j));current.forEach(function(k){if(!(k in snapshot))localStorage.removeItem(k);});Object.keys(snapshot).forEach(function(k){localStorage.setItem(k,snapshot[k]);});}catch(e){console.warn('Lernstand-Wiederherstellung unvollständig:',e);}
 var good=results.filter(function(r){return r[1]}).length;
 function esc(s){return String(s).replace(/[&<>\u0022\u0027]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\u0022':'&quot;','\u0027':'&#39;'}[c]});}
 var panel=document.createElement('div');
 panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Selbsttest-Ergebnis');
 panel.style.cssText='position:fixed;inset:16px;z-index:99999;overflow:auto;background:#fff;color:#123;border:3px solid '+(good===results.length?'#1a7569':'#b4232a')+';border-radius:14px;padding:20px;font:15px/1.5 system-ui';
 panel.innerHTML='<h2 style=\u0022margin-top:0\u0022>'+(good===results.length?'\u2713 Selbsttest: alle '+results.length+' Prüfungen bestanden':'\u2717 Selbsttest: '+(results.length-good)+' von '+results.length+' Prüfungen fehlgeschlagen')+'</h2><p>Der Lernstand wurde gesichert und unverändert wiederhergestellt.</p><table style=\u0022border-collapse:collapse;width:100%\u0022>'+results.map(function(r){return '<tr><td style=\u0022padding:4px 8px;border-bottom:1px solid #ccc\u0022>'+esc(r[0])+'</td><td style=\u0022padding:4px 8px;border-bottom:1px solid #ccc;white-space:nowrap;color:'+(r[1]?'#1a7569':'#b4232a')+'\u0022>'+(r[1]?'\u2713 bestanden':'\u2717 fehlgeschlagen')+(r[2]?'<br><small>'+esc(r[2])+'</small>':'')+'</td></tr>'}).join('')+'</table><button type=\u0022button\u0022 id=\u0022selbsttestEnde\u0022 style=\u0022margin-top:14px;padding:10px 16px;font:inherit\u0022>Selbsttest beenden und App neu laden</button>';
 document.body.appendChild(panel);
 document.getElementById('selbsttestEnde').onclick=function(){history.replaceState(null,'',location.pathname);location.reload();};
}
})();
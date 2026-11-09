(function(){
'use strict';
// Lehrkräfte-Bereich: Auswertung, Lernstand-Export/Import, Differenzierung (Niveau), Materialübersicht.
const el=id=>document.getElementById(id);
if(!el('v4panel-teacher'))return;
const LVL_KEY='chemie5-niveau';

/* ---- Transfer-Fragen (werden Teil des Wissenschecks; Niveau „schwer" nutzt 20 Fragen) ---- */
if(typeof quizBank!=='undefined'&&!quizBank.some(q=>q.transfer)){quizBank.push(
 {topic:'Gasbrenner',transfer:true,q:'Transfer: Warum zündet man den Brenner nicht mit weit geöffneter Luftzufuhr?',options:['Die Flamme könnte beim Zünden zurückschlagen','Die Flamme würde zu gut sichtbar','Das Gas würde zu kalt'],correct:0,ex:'Mit viel Luft kann die Flamme beim Zünden zurückschlagen. Deshalb startet man mit geschlossener Luftzufuhr und gelber Sicherheitsflamme.'},
 {topic:'Siedetemperatur',transfer:true,q:'Transfer: Warum stehen auf Nudelpackungen im Hochgebirge längere Kochzeiten?',options:['Das Wasser siedet dort schon unter 100 °C und ist kühler','Nudeln sind in den Bergen härter','Der Topf wird dort nicht heiß'],correct:0,ex:'Bei niedrigem Luftdruck siedet Wasser früher, z. B. bei 90 °C. Kühleres Kochwasser gart langsamer – die Nudeln brauchen länger.'},
 {topic:'Wärmeleitfähigkeit',transfer:true,q:'Transfer: Warum fühlt sich die Metallbank im Winter kälter an als die Holzbank daneben?',options:['Metall leitet die Wärme schneller aus deiner Haut ab','Metall ist immer kälter als Holz','Holz erzeugt selbst Wärme'],correct:0,ex:'Beide Bänke sind gleich kalt. Metall leitet die Wärmeenergie aber schneller von deiner Haut weg – darum fühlt es sich kälter an.'},
 {topic:'Löslichkeit',transfer:true,q:'Transfer: Im Meerwasser schmeckt man Salz, sieht es aber nicht. Warum?',options:['Die Salzteilchen sind gelöst und im Wasser verteilt','Das Salz ist verdampft','Salz wird im Wasser durchsichtig fest'],correct:0,ex:'Gelöstes Salz ist in unsichtbar kleine Teilchen zerteilt und im Wasser verteilt – es bleibt vorhanden, wie der Geschmack zeigt.'},
 {topic:'Löslichkeit',transfer:true,q:'Transfer: Wie bekommst du aus Meerwasser das Salz zurück?',options:['Wasser verdunsten lassen – das Salz bleibt zurück','Filtrieren mit Filterpapier','Kräftig umrühren'],correct:0,ex:'Beim Verdunsten entweicht nur das Wasser; die gelösten Salzteilchen bleiben als Kristalle zurück. Filtrieren hält gelöste Teilchen nicht auf.'},
 {topic:'Sicherheit',transfer:true,q:'Transfer: Warum gehört die Jacke an die Garderobe und nicht über den Laborhocker?',options:['Sie kann Feuer fangen und ist eine Stolperfalle','Sie könnte nass werden','Sie verdeckt den Hocker'],correct:0,ex:'Kleidung am Arbeitsplatz kann in Flammen oder Chemikalien geraten und blockiert Flucht- und Laufwege.'},
 {topic:'Stoffe & Körper',transfer:true,q:'Transfer: Eine Schere und ein Nagel sind beide aus Stahl. Was ist hier gleich?',options:['Der Stoff','Der Körper','Die Verwendung'],correct:0,ex:'Beide Körper bestehen aus demselben Stoff Stahl. Körper (Schere, Nagel) und Verwendung sind verschieden.'},
 {topic:'Laborgeräte',transfer:true,q:'Transfer: Du sollst 3-mal genau 25 ml abmessen. Warum lohnt der Messzylinder statt „Augenmaß im Becherglas"?',options:['Nur mit Skala werden alle drei Portionen wirklich gleich','Der Messzylinder ist schneller','Das Becherglas ist verboten'],correct:0,ex:'Für einen fairen Vergleich müssen die Portionen gleich sein. Die feine Skala des Messzylinders macht das Abmessen wiederholbar genau.'}
);}

/* ---- Niveau / Differenzierung ---- */
function getLevel(){try{return localStorage.getItem(LVL_KEY)||'normal'}catch(e){return 'normal'}}
function setLevel(v){try{localStorage.setItem(LVL_KEY,v)}catch(e){}applyLevelUI()}
function applyLevelUI(){const lvl=getLevel();const sel=el('teachLevel');if(sel)sel.value=lvl;
 const len=el('quizLength');if(len)len.value=lvl==='leicht'?'8':lvl==='schwer'?'20':'12';
 const info=el('teachLevelInfo');if(info)info.textContent='Aktuell: '+({leicht:'Leicht – kürzerer Test mit 3 Antwortmöglichkeiten je Frage.',normal:'Normal – Standardtest mit 12 Fragen.',schwer:'Schwer – 20 Fragen, Transfer-Aufgaben eingeschlossen.'}[lvl]);}
if(el('teachLevel'))el('teachLevel').addEventListener('change',()=>setLevel(el('teachLevel').value));
// Wissenscheck an Niveau anpassen: leicht = 3 Optionen, normal/leicht ohne Transfer-Fragen
if(typeof startQuiz==='function'){const orig=startQuiz;window.startQuiz=function(mode){const lvl=getLevel();let removed=[];
 if(lvl!=='schwer'&&mode!=='missed'&&typeof quizBank!=='undefined'){for(let i=quizBank.length-1;i>=0;i--)if(quizBank[i].transfer)removed.unshift(quizBank.splice(i,1)[0])}
 try{orig(mode)}finally{if(removed.length)quizBank.push(...removed)}
 try{if(mode==='missed')return;
 if(lvl==='leicht')state.quiz.questions=state.quiz.questions.map(q=>{if(!q.options||q.options.length<=3)return q;const c={...q,options:[...q.options]};let drop=c.options.length-1;if(drop===c.correct)drop--;c.options.splice(drop,1);if(drop<c.correct)c.correct--;return c});
 if(typeof renderQuiz==='function')renderQuiz()}catch(e){}}}

/* ---- Auswertung ---- */
function readLS(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
function bar(p){return '<div class="bar"><i style="width:'+Math.max(0,Math.min(100,p))+'%"></i></div>'}
function renderReport(){const out=el('teachReport');if(!out)return;const rows=[];
 const core=readLS('chemie5-data')||{};const doneAreas=Object.keys(core.done||{}).filter(k=>core.done[k]).length;
 rows.push(['Bearbeitete Lernbereiche',doneAreas+' von 17',bar(doneAreas/17*100)]);
 const campus=readLS('chemie5-campus-v4')||{};const stats=campus.stats||{};
 const names={matter:'Stoffe und Körper',dissolve:'Löslichkeit',boil:'Siedetemperatur',safety:'Sicherheit',devices:'Laborgeräte',burner:'Gasbrenner'};
 let answered=0;Object.keys(names).forEach(k=>{const s=stats[k]||{right:0,wrong:0},n=s.right+s.wrong;answered+=n;
  rows.push(['Lerntrainer · '+names[k],n?(s.right+' von '+n+' richtig'):'noch nicht geübt',n?bar(s.right/n*100):bar(0)])});
 const lern=readLS('chemie8-learning-v1')||{};const lessons=Object.keys(lern.done||{}).filter(k=>lern.done[k]).length;
 rows.push(['Lernpfad-Kapitel abgeschlossen',lessons+' von 7',bar(lessons/7*100)]);
 const detect=campus.detect||{};const scenes=Object.keys(detect).filter(k=>(detect[k]||[]).length===4).length;
 rows.push(['Laborfehler-Szenen vollständig gelöst',scenes+' von 7',bar(scenes/7*100)]);
 const exam=readLS('chemie5-final-exam-v1')||{};
 rows.push(['Übungsklassenarbeit',exam.phase==='submitted'?'abgegeben und ausgewertet':exam.phase?'in Bearbeitung ('+exam.phase+')':'noch nicht begonnen',bar(exam.phase==='submitted'?100:exam.phase?50:0)]);
 const errs=(core.quizErrors||[]).length;
 rows.push(['Offene Wissenscheck-Fehler zum Nachüben',String(errs),bar(errs?Math.max(10,100-errs*10):100)]);
 out.innerHTML='<table class="teach-table"><thead><tr><th>Bereich</th><th>Stand</th><th>Fortschritt</th></tr></thead><tbody>'+
  rows.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>').join('')+'</tbody></table>'+
  '<p class="v4small">Stand von diesem Gerät/Browser · Lerntrainer-Übungen insgesamt: '+answered+' Antworten. Freitexte sind Selbstkontrolle und werden nicht benotet.</p>'}
if(el('teachReportRefresh'))el('teachReportRefresh').addEventListener('click',renderReport);
if(el('teachReportPrint'))el('teachReportPrint').addEventListener('click',()=>{renderReport();document.body.classList.add('teach-printing');window.print();setTimeout(()=>document.body.classList.remove('teach-printing'),500)});

/* ---- Export / Import ---- */
function teachStatus(t,ok){const s=el('teachSaveStatus');if(s){s.textContent=t;s.style.color=ok===false?'#a3361f':''}}
if(el('teachExport'))el('teachExport').addEventListener('click',()=>{const data={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);data[k]=localStorage.getItem(k)}
 const blob=new Blob([JSON.stringify({app:'chemie-entdeckerlabor',exported:new Date().toISOString(),data},null,1)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='chemie-lernstand-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);
 teachStatus('Sicherungsdatei erstellt. Bewahre sie privat auf (enthält den Lernstand dieses Geräts).',true)});
if(el('teachImport'))el('teachImport').addEventListener('change',ev=>{const f=ev.target.files&&ev.target.files[0];if(!f)return;
 const r=new FileReader();r.onload=()=>{try{const j=JSON.parse(String(r.result));if(!j||j.app!=='chemie-entdeckerlabor'||typeof j.data!=='object')throw new Error('Format');
  Object.entries(j.data).forEach(([k,v])=>{if(typeof v==='string')localStorage.setItem(k,v)});
  teachStatus('Lernstand importiert. Die Seite wird neu geladen …',true);setTimeout(()=>location.reload(),900)}
 catch(e){teachStatus('Diese Datei ist keine gültige Chemie-Lernstandssicherung.',false)}};
 r.readAsText(f);ev.target.value=''});

/* ---- Material-Links ---- */
document.querySelectorAll('[data-teach-go]').forEach(b=>b.addEventListener('click',()=>{if(typeof navigate==='function')navigate(b.dataset.teachGo)}));

applyLevelUI();renderReport();
})();


// Wärmeleitfähigkeit: qualitative comparison, practice and existing progress integration.
(function(){
'use strict';
const el=id=>document.getElementById(id);
const materials=[['Kupfer','gut leitend',1],['Stahl','gut leitend',.65],['Trockenes Holz','schlecht leitend',.08],['Typischer Kunststoff','schlecht leitend',.08]];
let timer=null,observed=false;
const solved=new Set(),assisted=new Set();
const rodSwatch=['<svg viewBox="0 0 26 16" aria-hidden="true"><rect width="26" height="16" rx="4" fill="#c46a35"/><path d="M3 4h20" stroke="#e8a079" stroke-width="2"/></svg>','<svg viewBox="0 0 26 16" aria-hidden="true"><rect width="26" height="16" rx="4" fill="#8a949a"/><path d="M3 4h20" stroke="#d8dee2" stroke-width="2"/></svg>','<svg viewBox="0 0 26 16" aria-hidden="true"><rect width="26" height="16" rx="4" fill="#a77b4b"/><path d="M3 5h20M3 10h14" stroke="#7a5530" stroke-width="1.5"/></svg>','<svg viewBox="0 0 26 16" aria-hidden="true"><rect width="26" height="16" rx="4" fill="#e36a8a"/><circle cx="7" cy="8" r="2" fill="#f7b7c7"/></svg>'];
el('thRods').innerHTML=materials.map((m,i)=>`<div class="th-rod-row"><div class="th-rod-head">${rodSwatch[i]}<b>${m[0]}</b><span>${m[1]}</span></div><div class="th-rod matlook-${i}" id="thRod${i}" aria-hidden="true">${'<span></span>'.repeat(12)}</div></div>`).join('');
function stop(){if(timer!==null)clearInterval(timer);timer=null;el('thPlay').textContent=Number(el('thTime').value)===10?'▶ Erneut abspielen':'▶ Vergleich abspielen';}
function progress(){
 const done=observed&&solved.size===4;
 el('thProgress').textContent=done?'✓ Thema bearbeitet: Du hast den Vergleich beobachtet und alle vier Fragen gelöst. Übe später im Wissenscheck weiter.':`${solved.size} von 4 Fragen gelöst. ${observed?'Vergleich beobachtet.':'Sieh dir den Modellverlauf bis zum Ende an.'}`;
 if(done)complete('thermal');
}
function render(){
 const step=Number(el('thTime').value);
 el('thTimeLabel').textContent=step===0?'Start':step===10?'Vergleich beendet':`Schritt ${step} von 10`;
 el('thTime').setAttribute('aria-valuetext',el('thTimeLabel').textContent);
 materials.forEach((m,i)=>el('thRod'+i).querySelectorAll('span').forEach((cell,j)=>{
  // Deliberately qualitative: no temperatures, elapsed seconds or conductivity values.
  const warmth=step===0?0:Math.min(1,(step/10)*Math.exp(-j/(1+m[2]*9)));
  const cold=[162,215,234],hot=[237,137,63];
  cell.style.backgroundColor=`rgb(${cold.map((v,k)=>Math.round(v+(hot[k]-v)*warmth)).join(',')})`;
 }));
 el('thObservation').textContent=step===0?'Noch nicht erwärmt: Alle Stäbe haben dieselbe Anfangstemperatur. Vermute und starte den Vergleich oder bewege den Regler.':step<5?'Die linken Enden werden erwärmt. Beobachte, wie unterschiedlich sich die Wärme im Modell nach rechts verteilt.':'Die Metallstäbe geben Wärme gut weiter. Bei trockenem Holz und dem gezeigten Kunststoff bleibt die Erwärmung am rechten Ende im Modell deutlich geringer.';
 const choice=document.querySelector('input[name="thPrediction"]:checked');
 el('thPredictionFeedback').textContent=step<10?'Deine Vermutung wird am Ende des Modellverlaufs besprochen.':!choice?'Beobachtet: Metalle leiten Wärme gut. Holz und viele Kunststoffe eignen sich eher zum Wärmedämmen.':choice.value==='metal'?'Deine Vermutung passt: Die Metallstäbe leiten die Wärme hier besser weiter.':'Deine Vermutung passt noch nicht: Die Metallstäbe leiten die Wärme besser weiter als trockenes Holz und der gezeigte Kunststoff. Eine Vermutung darf sich durch Beobachtungen ändern.';
 if(step===10){observed=true;stop();progress();}
}
el('thTime').addEventListener('input',()=>{stop();render()});
el('thPlay').addEventListener('click',()=>{
 if(timer!==null){stop();return}
 if(Number(el('thTime').value)===10)el('thTime').value='0';
 render();el('thPlay').textContent='⏸ Pause';
 timer=setInterval(()=>{if(state.route!=='thermal'||document.hidden){stop();return}el('thTime').value=String(Math.min(10,Number(el('thTime').value)+1));render()},650);
});
el('thReset').addEventListener('click',()=>{stop();el('thTime').value='0';document.querySelectorAll('input[name="thPrediction"]').forEach(r=>r.checked=false);render()});
document.querySelectorAll('input[name="thPrediction"]').forEach(r=>r.addEventListener('change',render));
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
window.ChemistryNavigation.onLeave('thermal',stop);
function practice(){
 solved.clear();assisted.clear();
 el('thQuestions').replaceChildren();
 thermalQuiz.slice(0,4).forEach((q,index)=>{
  const card=document.createElement('article');card.className='th-question';
  const h=document.createElement('h4');h.textContent=`${index+1}. ${q.q}`;card.appendChild(h);
  const choices=document.createElement('div');choices.className='th-answers';
  const feedback=document.createElement('p');feedback.className='feedback';feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');feedback.textContent='Wähle eine Antwort.';
  shuffle(q.options.map((text,i)=>({text,i}))).forEach(({text,i})=>{
   const b=document.createElement('button');b.type='button';b.className='answer';b.textContent=text;
   b.addEventListener('click',()=>{
    if(solved.has(index))return;
    const correct=i===q.correct;
    window.LernCockpit?.record({id:'chem-thermal-practice-'+index,topic:'thermal',correct,assisted:assisted.has(index),mode:'übung',skill:index===2?'erklären':'anwenden'});
    feedback.textContent=(correct?'Richtig! ':'Noch nicht ganz. ')+q.ex;feedback.className='feedback '+(correct?'good':'bad');
    if(correct){solved.add(index);b.classList.add('correct');choices.querySelectorAll('button').forEach(btn=>btn.disabled=true);progress()}
    else{assisted.add(index);b.classList.add('wrong');b.disabled=true}
   });choices.appendChild(b);
  });card.appendChild(choices);card.appendChild(feedback);
  for(const [label,text] of [['Tipp',q.hint],['Lösung mit Erklärung',q.options[q.correct]+'. '+q.ex]]){
   const details=document.createElement('details');details.className='hint';const summary=document.createElement('summary');summary.textContent=label;const p=document.createElement('p');p.textContent=text;details.append(summary,p);details.addEventListener('toggle',()=>{if(details.open)assisted.add(index)});card.appendChild(details);
  }el('thQuestions').appendChild(card);
 });progress();
}
el('thPracticeReset').addEventListener('click',practice);
el('thGoQuiz').addEventListener('click',()=>{navigate('quiz');el('quizTopic').value='Wärmeleitfähigkeit';startQuiz()});
if(Array.isArray(window.LernCockpitBankChem))thermalQuiz.forEach(q=>window.LernCockpitBankChem.push(['thermal',q.q,q.options,q.correct,q.ex]));
function notebookModel(){
 const stage=Number(el('thNotebookTime').value);
 el('thNotebookHeat').setAttribute('opacity',stage?'1':'0');
 el('thNotebookTimeLabel').textContent=['Ausgangszustand','Erwärmung beginnt','Erste Beobachtungsstelle','Zweite Beobachtungsstelle'][stage];
 el('thWaxSamples').querySelectorAll('ellipse').forEach((wax,i)=>{
  const molten=(i===2&&stage>=2)||(i===3&&stage===3);
  wax.setAttribute('fill',molten?'#edb85e':'#fff8d4');wax.setAttribute('ry',molten?'3':'5');
 });
 const texts=[
 'Ausgangsbild: Die Stäbe sind anfangs gleich warm, das Wachs ist fest. Die Teelichter sind nicht angezündet.',
 'Im Modell werden die inneren Stabenden erwärmt. Energie gelangt durch die Stäbe nach außen. Das Wachs ist an allen vier Beobachtungsstellen noch fest.',
 'Modellbeobachtung: Am Metallstab wird das Wachs an der näheren Beobachtungsstelle zuerst flüssig. An den übrigen Stellen ist es im gezeigten Modellabschnitt noch fest.',
 'Modellbeobachtung: Bei beiden Metall-Beobachtungsstellen wird das Wachs flüssig. Am Glasstab bleibt es im gezeigten Vergleichszeitraum noch fest. Das sind Modellzustände, keine nachträglich ergänzten Messdaten zu deinem Heftversuch.'
 ];
 el('thNotebookObservation').textContent=texts[stage];
 el('thNotebookTime').setAttribute('aria-valuetext',el('thNotebookTimeLabel').textContent);
}
el('thNotebookTime').addEventListener('input',notebookModel);
el('thNotebookCompare').addEventListener('click',()=>{el('thNotebookTime').value='3';notebookModel()});
el('thNotebookReset').addEventListener('click',()=>{el('thNotebookTime').value='0';notebookModel()});
el('thFairCheck').addEventListener('click',()=>{
 const ids=['thFairSize','thFairWax','thFairHeat'],values=ids.map(id=>el(id).value);
 if(values.some(v=>!v)){el('thFairFeedback').textContent='Wähle zuerst in allen drei Feldern eine Bedingung.';return}
 const issues=[];
 if(values[0]!=='same')issues.push('Stabmaße: Bei unterschiedlicher Länge und Dicke vergleichst du nicht nur das Material.');
 if(values[1]!=='same')issues.push('Wachs: Bereits flüssiges Wachs kann nicht noch einmal durch Schmelzen das Erwärmen anzeigen. Gleiche Menge und gleicher Anfangszustand sind wichtig.');
 if(values[2]!=='same')issues.push('Erwärmung: Gleiche Bedingungen, Abstände und Beobachtungsdauer sind nötig.');
 el('thFairFeedback').textContent=issues.length?'Überarbeite deinen Plan: '+issues.join(' '):'Gut geplant! Du änderst gezielt das Material und hältst die anderen Bedingungen gleich. So ist der Vergleich aussagekräftiger. Reale Durchführung nur durch bzw. nach Anleitung der Lehrkraft.';
 el('thFairFeedback').className='feedback '+(issues.length?'bad':'good');
 window.LernCockpit?.record({id:'chem-thermal-fair',topic:'thermal',correct:!issues.length,assisted:false,mode:'übung',skill:'anwenden'});
});
const sorting=[
 {text:'Das zunächst feste Wachs wird am Metallstab flüssig.',kind:'observation',why:'Du beschreibst, was du siehst: den veränderten Wachszustand.'},
 {text:'Der verwendete Metallstab leitet Wärme besser als der Glasstab.',kind:'interpretation',why:'Die Wärmeleitfähigkeit ist hier die fachliche Deutung des Vergleichs.'},
 {text:'Am Boden einer Teelichtschale ist eine dunkle Stelle sichtbar.',kind:'observation',why:'Die Farbe lässt sich sehen. Warum sie dunkel ist, ist damit noch nicht erklärt.'},
 {text:'Das Wachs wird flüssig, weil Energie durch den Metallstab zu ihm gelangt.',kind:'interpretation',why:'Das Wort „weil“ verknüpft die Beobachtung mit einer Erklärung.'},
 {text:'Am Glasstab ist in unserer Beobachtungszeit keine dunkle Stelle zu sehen.',kind:'observation',why:'Das ist eine zeitlich begrenzte Beschreibung, keine Aussage, dass Glas immer kalt bleibt.'},
 {text:'Aus der dunklen Stelle allein kann man die Wärmeleitfähigkeit nicht sicher bestimmen.',kind:'interpretation',why:'Du beurteilst, was die Beobachtung fachlich belegen kann und was nicht.'}
];
let sortIndex=0,sortCorrect=0,sortAnswered=false,sortRetry=false;
function drawSort(){
 const root=el('thSortTask');root.replaceChildren();
 if(sortIndex===sorting.length){root.innerHTML='<h4>Alle sechs Aussagen bearbeitet</h4><p>Beobachtungen beschreiben, Auswertungen erklären. Bei deinem Protokoll kannst du diese Trennung jetzt nutzen.</p>';el('thSortProgress').textContent=`${sortCorrect} von 6 beim ersten Versuch richtig. Alle Erklärungen wurden angezeigt.`;return}
 sortAnswered=false;sortRetry=false;const task=sorting[sortIndex];
 const text=document.createElement('p');text.className='th-sort-statement';text.textContent=`${sortIndex+1}/6 · „${task.text}“`;root.appendChild(text);
 const choices=document.createElement('div');choices.className='btn-row';
 const feedback=document.createElement('p');feedback.className='feedback';feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');feedback.textContent='Wähle Beobachtung oder Auswertung.';
 const next=document.createElement('button');next.className='btn primary';next.type='button';next.textContent='Nächste Aussage →';next.disabled=true;
 for(const [kind,label] of [['observation','Beobachtung'],['interpretation','Auswertung']]){
  const b=document.createElement('button');b.className='btn';b.type='button';b.textContent=label;
  b.addEventListener('click',()=>{
   if(sortAnswered)return;const correct=kind===task.kind;
   window.LernCockpit?.record({id:'chem-thermal-sort-'+sortIndex,topic:'thermal',correct,assisted:sortRetry,mode:'übung',skill:'erklären'});
   feedback.textContent=(correct?'Richtig! ':'Noch nicht ganz. ')+task.why;
   feedback.className='feedback '+(correct?'good':'bad');
   if(correct){if(!sortRetry)sortCorrect++;sortAnswered=true;choices.querySelectorAll('button').forEach(btn=>btn.disabled=true);next.disabled=false;el('thSortProgress').textContent=`${sortIndex+1} von 6 Aussagen bearbeitet.`}
   else{sortRetry=true;b.disabled=true}
  });choices.appendChild(b);
 }
 next.addEventListener('click',()=>{sortIndex++;drawSort()});root.append(choices,feedback,next);
}
el('thSortRestart').addEventListener('click',()=>{sortIndex=0;sortCorrect=0;el('thSortProgress').textContent='Noch keine Aussage zugeordnet.';drawSort()});
drawSort();notebookModel();
document.querySelectorAll('[data-th-protocol]').forEach(b=>b.addEventListener('click',()=>{
 const correct=b.dataset.thProtocol==='observation';
 el('thProtocolFeedback').textContent=correct?'Richtig: Dass Wachs flüssig wird, kannst du sehen. Die Erklärung mit der Wärmeleitfähigkeit gehört in die Auswertung.':'Noch nicht: Der Satz beschreibt etwas Sichtbares und ist eine Beobachtung. Warum es geschieht, erklärst du erst in der Auswertung.';
 window.LernCockpit?.record({id:'chem-thermal-protocol',topic:'thermal',correct,assisted:false,mode:'übung',skill:'anwenden'});
}));
render();practice();
const openThermalLink=()=>{if(['#waermeleitfaehigkeit','#holz-eisen'].includes(location.hash)){navigate('thermal');if(location.hash==='#holz-eisen'){document.querySelector('#heTitle')?.closest('details')?.setAttribute('open','');}if(location.hash==='#holz-eisen')setTimeout(()=>document.getElementById('heTitle')?.scrollIntoView({block:'start'}),0)}};
const thExplainBtn=el('thExplainCheck');if(thExplainBtn)thExplainBtn.addEventListener('click',()=>{const t=el('thExplain').value,list=el('thExplainAuto');list.replaceChildren();const add=(cls,txt)=>{const li=document.createElement('li');li.className=cls;li.textContent=txt;list.appendChild(li)};if(t.trim().length<10){add('miss','Schreibe zuerst mindestens einen ganzen Satz.');return}const c1=/(boden|metall)/i.test(t)&&/(gut|schnell|besser)/i.test(t)&&/(leit|weiterg|energie|w(ä|a)rme)/i.test(t);const c2=/(griff|hand)/i.test(t)&&/(schlecht|wenig|kaum|langsam|nicht so gut|isolier|sch(ü|u)tz)/i.test(t);add(c1?'hit':'miss',(c1?'✓ ':'○ ')+'Topfboden: Metall leitet Wärme gut an den Inhalt weiter.'+(c1?'':' – Tipp: Schreibe, dass der Metallboden die Wärme gut/schnell weitergibt.'));add(c2?'hit':'miss',(c2?'✓ ':'○ ')+'Griff: Ein schlechter Wärmeleiter schützt die Hand.'+(c2?'':' – Tipp: Schreibe, dass der Griff die Wärme schlecht leitet und so die Hand schützt.'));add('sum',c1&&c2?'Beide Gedanken gefunden – vergleiche noch mit der Musterlösung!':'Ergänze deine Erklärung und prüfe erneut.')});
window.addEventListener('hashchange',openThermalLink);openThermalLink();
})();


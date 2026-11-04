
(()=>{'use strict';
const root=document.getElementById('visualLearningPath');
if(!root)return;
const styles=document.createElement('style');
styles.textContent=`
.guided-journey{margin-top:16px;padding:clamp(15px,2.5vw,24px);border:2px solid #8bbeb7;border-radius:20px;background:linear-gradient(145deg,#eefaf5,#fff9e9)}
.guided-journey h3{margin:4px 0 8px}.gj-kicker{font-size:.8rem;font-weight:850;letter-spacing:.05em;text-transform:uppercase;color:#286c70}
.gj-progress{height:9px;background:#d8e9e3;border-radius:99px;overflow:hidden;margin:12px 0}.gj-progress i{display:block;width:0;height:100%;background:#16847c;transition:width .25s ease}
.gj-topline{display:flex;justify-content:space-between;gap:10px;align-items:center}.gj-scene{display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,1.1fr);gap:16px;align-items:center}
.gj-art{display:block;width:100%;max-width:480px;margin:auto;background:#fff;border:1px solid #c9dfda;border-radius:15px}
.gj-dialog{padding:13px 15px;border-radius:14px;background:#fff;border-left:5px solid #e4a43e;margin:12px 0;line-height:1.55}
.gj-benno{display:inline-grid;place-items:center;vertical-align:middle;width:52px;height:52px;margin-right:8px;background:#fff4da;border-radius:50%}.gj-benno svg{width:47px;height:47px}
.gj-options{display:grid;gap:8px;margin:12px 0}.gj-options button,.gj-controls button{min-height:46px;text-align:left;padding:10px 13px;border:2px solid #357982;border-radius:11px;background:#fff;color:#174957;font:inherit;font-weight:700;cursor:pointer;touch-action:manipulation}
.gj-options button:hover,.gj-options button[aria-pressed=true],.gj-controls button:hover:not(:disabled){background:#176778;color:#fff}
.gj-options button:focus-visible,.gj-controls button:focus-visible{outline:3px solid #edaa38;outline-offset:3px}
.gj-feedback,.gj-explanation{margin:10px 0;padding:12px 14px;border-radius:12px;background:#fff;border-left:5px solid #e2a444;line-height:1.5}
.gj-feedback.good{background:#e6f6ed;border-color:#17815f}.gj-feedback.try{background:#fff0ed;border-color:#ad5146}
.gj-explanation{background:#eaf7f2;border-color:#16847c}.gj-controls{display:flex;flex-wrap:wrap;gap:9px;margin-top:14px}.gj-controls .gj-primary{background:#117c80;color:#fff}
.gj-controls button:disabled{opacity:.55;cursor:not-allowed}.gj-shortcuts{margin-top:18px;padding-top:14px;border-top:1px solid #c6ded8}.gj-shortcuts h4{margin:0 0 4px}
.gj-shortcut-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.gj-shortcut-list button{min-height:44px;padding:8px 12px;border:1px solid #afc9c6;border-radius:11px;background:#fff;color:#174957;font:inherit;font-weight:700;cursor:pointer}
.gj-shortcut-list button:hover{border-color:#117c80;background:#edf8f5}.gj-shortcut-list button:focus-visible{outline:3px solid #edaa38;outline-offset:3px}
.gj-safety{margin-top:9px;padding:10px 12px;border-radius:11px;background:#fff0ed;color:#702c26;font-weight:650}
@media(max-width:660px){.gj-scene{grid-template-columns:1fr}.gj-art{max-width:440px}.gj-topline{align-items:flex-start;flex-direction:column}}
@media(prefers-reduced-motion:reduce){.guided-journey *,.guided-journey *::before,.guided-journey *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
`;
document.head.appendChild(styles);
root.innerHTML=`
<span class="gj-kicker">Geführte Lernreise · empfohlen</span>
<h3>Mit Benno Schritt für Schritt entdecken</h3>
<p>Erst schauen und vermuten, dann erklärt Benno die Idee. Eine kurze Frage hilft dir beim Merken. Du kannst jederzeit auch direkt zu einem Thema springen.</p>
<section class="guided-journey" aria-labelledby="gjTitle">
  <div class="gj-topline"><span class="gj-kicker" id="gjStep">Schritt 1 von 5</span><span id="gjStatus">Noch nicht abgeschlossen</span></div>
  <div class="gj-progress" role="progressbar" aria-label="Fortschritt der geführten Lernreise" aria-valuemin="0" aria-valuemax="5" aria-valuenow="0"><i id="gjProgress"></i></div>
  <h3 id="gjTitle"></h3>
  <p class="gj-feedback good" id="gjDone" role="status" aria-live="polite" hidden></p>
  <div class="gj-scene"><div id="gjArt"></div><div>
    <div class="gj-dialog"><span class="gj-benno" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="M17 39Q10 16 29 22Q40 1 54 20Q75 5 77 28Q96 22 85 44" fill="#f2a43a" stroke="#9d5b28" stroke-width="3"/><circle cx="51" cy="49" r="31" fill="#ffd29c" stroke="#9d6c45" stroke-width="3"/><path d="M34 47h8m22 0h8" stroke="#493e39" stroke-width="4" stroke-linecap="round"/><path d="M43 63q9 8 18 0" fill="none" stroke="#a84d38" stroke-width="3" stroke-linecap="round"/><path d="M26 78q25-13 50 0l8 19H18Z" fill="#4f99a0" stroke="#27656b" stroke-width="3"/><path d="M43 79l8 8 8-8" fill="#fff" stroke="#27656b" stroke-width="2"/></svg></span><b>Benno fragt:</b> <span id="gjPrompt"></span></div>
    <p><b>Schau genau hin und vermute:</b></p><div class="gj-options" id="gjObserve" role="group" aria-label="Beobachtung oder Vermutung auswählen"></div>
    <p class="gj-feedback" id="gjObserveFeedback" role="status" aria-live="polite">Wähle eine Vermutung. Danach erklärt Benno, worauf es ankommt.</p>
    <button class="gj-reveal" id="gjReveal" type="button" hidden>Benno erklärt →</button>
    <div id="gjAfterReveal" hidden>
      <div class="gj-explanation"><b>Benno erklärt:</b> <span id="gjExplanation"></span></div>
      <p><b>Mini-Check:</b> <span id="gjQuizQuestion"></span></p>
      <div class="gj-options" id="gjQuiz" role="group" aria-label="Antworten zum Mini-Check"></div>
      <p class="gj-feedback" id="gjQuizFeedback" role="status" aria-live="polite">Wähle eine Antwort. Benno erklärt dir auch, warum sie passt.</p>
    </div>
  </div></div>
  <div class="gj-controls"><button type="button" id="gjPrev">← Voriger Schritt</button><button class="gj-primary" type="button" id="gjNext" disabled>Nächster Schritt →</button><button type="button" id="gjRestart">Reise neu beginnen</button></div>
  <div class="gj-safety">Sicherheit: Der Brenner und alle Erhitzungen in dieser Lernreise sind nur virtuelle Modelle. Echte Versuche und Geräte nur mit ausdrücklicher Anleitung und Aufsicht der Lehrkraft.</div>
</section>
<section class="gj-shortcuts" aria-labelledby="gjShortcutsTitle">
  <h4 id="gjShortcutsTitle">Direkt zu einem Thema springen</h4>
  <p class="small muted">Diese Abkürzungen öffnen die bestehenden Lernbereiche und Übungen unabhängig von der Reihenfolge.</p>
  <div class="gj-shortcut-list" role="group" aria-label="Direkte Themen-Abkürzungen">
    <button data-gj-go="matter">Körper &amp; Stoffe</button><button data-gj-go="v4study" data-gj-tab="properties">Stoffeigenschaften</button><button data-gj-go="v5academy" data-gj-tab="particles">Teilchenmodell</button><button data-gj-go="heating">Heizkurve</button><button data-gj-go="burner">Brenner</button><button data-gj-go="safety">Sicherheit</button><button data-gj-go="v5academy" data-gj-tab="symbols">Gefahrensymbole</button>
  </div>
</section>`;
const steps=[
 {title:'Ein Ding und sein Stoff',prompt:'Das Trinkglas ist ein Körper. Was beschreibt das Wort „Glas“?',art:'<svg class="gj-art" viewBox="0 0 500 250" role="img" aria-label="Bild eines Trinkglases mit den Beschriftungen Körper und Stoff"><rect x="22" y="20" width="456" height="210" rx="16" fill="#f7fcfb" stroke="#c9dfda"/><path d="M112 54h126l-16 127q-48 19-95 0Z" fill="#d5f4f4" stroke="#317783" stroke-width="6"/><path d="M123 120h105" stroke="#55abc2" stroke-width="10"/><path d="M261 75h170" stroke="#317783" stroke-width="2"/><text x="278" y="61" font-size="19" font-weight="700" fill="#174957">Körper</text><text x="278" y="91" font-size="17" fill="#174957">Trinkglas</text><path d="M222 145h209" stroke="#c47835" stroke-width="2"/><text x="278" y="137" font-size="19" font-weight="700" fill="#8a4d20">Stoff</text><text x="278" y="167" font-size="17" fill="#174957">Glas</text><text x="45" y="215" font-size="15" fill="#41636b">Was ist es? · Woraus besteht es?</text></svg>',observe:['Das Wort „Glas“ benennt das Material.','„Glas“ ist der Gegenstand selbst.'],obs:0,obsGood:'Genau: Das Trinkglas ist der Körper, Glas der Stoff.',obsTry:'Fast! Ein Trinkglas ist das Ding. Glas ist das Material, aus dem es besteht.',explain:'„Körper“ beantwortet: Was ist das für ein Ding? „Stoff“ beantwortet: Woraus besteht es? Ein Körper kann auch mehrere Stoffe enthalten.',q:'Was ist ein Goldring?',a:['Ein Körper; Gold ist der Stoff.','Ein Stoff; Ring ist das Material.'],c:0,why:'Der Ring ist der Gegenstand (Körper). Gold bezeichnet den Stoff.'},
 {title:'Salz löst sich im Wasser',prompt:'Nach dem Umrühren sieht man die Salzkörner kaum noch. Sind sie verschwunden?',art:'<svg class="gj-art" viewBox="0 0 500 250" role="img" aria-label="Salzteilchen verteilen sich im Wasser zwischen Wasserteilchen"><rect x="24" y="25" width="452" height="200" rx="16" fill="#f7fcfb" stroke="#c9dfda"/><path d="M125 54h120l-12 128q-47 18-95 0Z" fill="#d8f1f4" stroke="#398492" stroke-width="6"/><path d="M132 115h105" stroke="#58afc1" stroke-width="6"/><g fill="#4ca9b6"><circle cx="145" cy="83" r="6"/><circle cx="182" cy="93" r="6"/><circle cx="217" cy="77" r="6"/><circle cx="154" cy="136" r="6"/><circle cx="199" cy="157" r="6"/></g><g fill="#d68b39"><rect x="168" y="113" width="12" height="12" rx="2"/><rect x="210" y="132" width="12" height="12" rx="2"/><rect x="139" y="157" width="12" height="12" rx="2"/><rect x="185" y="76" width="12" height="12" rx="2"/></g><text x="276" y="82" font-size="16" fill="#174957">Wasserteilchen</text><circle cx="261" cy="77" r="6" fill="#4ca9b6"/><text x="276" y="124" font-size="16" fill="#174957">Salzteilchen</text><rect x="255" y="114" width="12" height="12" rx="2" fill="#d68b39"/><text x="275" y="179" font-size="14" fill="#41636b">vereinfachtes Teilchenmodell</text></svg>',observe:['Die Salzteilchen verteilen sich im Wasser.','Das Salz ist weg und gibt es nicht mehr.'],obs:0,obsGood:'Richtig beobachtet: Sichtbar ist es kaum noch, aber es ist weiterhin im Wasser.',obsTry:'Nicht verschwunden: Beim Lösen verteilen sich die Salzteilchen im Wasser.',explain:'Beim Lösen verteilen sich Teilchen des Salzes zwischen den Wasserteilchen. Das Salz ist noch da. Das Bild ist ein vereinfachtes Modell, kein Foto.',q:'Was geschieht mit dem Salz beim Lösen?',a:['Seine Teilchen verteilen sich im Wasser.','Die Teilchen verschwinden vollständig.'],c:0,why:'Lösen bedeutet hier: Salzteilchen verteilen sich in der Flüssigkeit; der Stoff wird nicht vernichtet.'},
 {title:'Wasser erwärmen und sieden',prompt:'Wasser kann schon vor dem Sieden verdunsten. Was passiert beim Sieden zusätzlich?',art:'<svg class="gj-art" viewBox="0 0 500 250" role="img" aria-label="Vereinfachte Heizkurve mit ansteigender Temperatur und Siedeplateau"><rect x="20" y="18" width="460" height="215" rx="16" fill="#f8fcfb" stroke="#c9dfda"/><path d="M72 34v165h370" fill="none" stroke="#345f6b" stroke-width="3"/><path d="M74 183 247 78h151" fill="none" stroke="#20839a" stroke-width="7" stroke-linejoin="round"/><text x="95" y="130" font-size="16" fill="#174957">Erwärmen</text><text x="270" y="59" font-size="16" font-weight="700" fill="#174957">Sieden · Plateau</text><text x="84" y="222" font-size="14" fill="#41636b">Temperatur steigt</text><text x="280" y="222" font-size="14" fill="#41636b">Temperatur etwa konstant</text><path d="M127 170v-17m8 17v-12m8 12v-18" stroke="#49a6ba" stroke-width="3" stroke-linecap="round"/></svg>',observe:['Beim Sieden bilden sich Dampfblasen in der Flüssigkeit.','Verdunstung kann nur genau bei 100 °C beginnen.'],obs:0,obsGood:'Ja: Sieden erkennst du an Dampfblasen, die sich in der Flüssigkeit bilden.',obsTry:'Verdunstung gibt es schon unterhalb des Siedepunkts. Beim Sieden entstehen zusätzlich Dampfblasen in der Flüssigkeit.',explain:'Reines Wasser siedet bei normalem Luftdruck ungefähr bei 100 °C. Während des Siedens bleibt die Temperatur im vereinfachten Modell etwa gleich. Verdunstung kann schon darunter an der Oberfläche stattfinden.',q:'Was passt zum Sieden von Wasser bei normalem Luftdruck?',a:['Es bilden sich Dampfblasen in der Flüssigkeit.','Verdunstung ist vorher unmöglich.'],c:0,why:'Sieden ist nicht dasselbe wie Verdunsten: Beim Sieden entstehen Dampfblasen im Inneren; auch vorher kann Wasser an der Oberfläche verdunsten.'},
 {title:'Die Brennerflamme als Modell',prompt:'Wo liegt im vereinfachten Schulmodell die heißeste Flammenzone?',art:'<svg class="gj-art" viewBox="0 0 500 250" role="img" aria-label="Schematische blaue Brennerflamme mit markierter heißester Zone knapp über dem inneren Kegel"><rect x="18" y="18" width="464" height="214" rx="16" fill="#f8fcfb" stroke="#c9dfda"/><path d="M175 199Q128 108 214 38Q290 116 246 199Z" fill="#55b5e6" stroke="#276fa8" stroke-width="4"/><path d="M192 198Q180 145 214 104Q249 146 235 198Z" fill="#3275bd" stroke="#fff" stroke-width="3"/><circle cx="214" cy="97" r="10" fill="#ffe374" stroke="#815b1e" stroke-width="3"/><path d="M225 97h56" stroke="#345f6b" stroke-width="2"/><text x="289" y="92" font-size="15" font-weight="700" fill="#174957">heißeste Stelle</text><text x="290" y="117" font-size="14" fill="#174957">knapp oberhalb</text><text x="290" y="138" font-size="14" fill="#174957">des inneren Kegels</text><path d="M175 199v22h78v-22" fill="#829ba9" stroke="#476978" stroke-width="4"/><text x="38" y="211" font-size="14" fill="#41636b">Nur eine virtuelle Skizze</text></svg>',observe:['Knapp oberhalb der Spitze des inneren blauen Kegels.','Mitten im dunkleren inneren Kegel.'],obs:0,obsGood:'Richtig: Das vereinfachte Schulmodell markiert die heißeste Zone knapp über der Spitze des inneren Kegels.',obsTry:'Schau auf den gelben Punkt knapp oberhalb der Spitze des inneren Kegels. Das ist die markierte Modellzone.',explain:'Das ist eine vereinfachte Skizze zum Lernen, keine Anleitung zum Bedienen. Die tatsächliche Flamme hängt vom Gerät und seiner Einstellung ab. Brenner nur nach Anleitung der Lehrkraft.',q:'Wozu dient die Zeichnung?',a:['Zum Lernen an einem virtuellen Modell.','Als Auftrag, selbst einen Brenner anzuzünden.'],c:0,why:'Die Abbildung ist ausdrücklich nur ein virtuelles Modell. Ein echter Brenner wird nie selbstständig bedient.'},
 {title:'Sicherheit geht vor',prompt:'Du bemerkst eine verschüttete Flüssigkeit im Labor. Was tust du zuerst?',art:'<svg class="gj-art" viewBox="0 0 500 250" role="img" aria-label="Labor-Sicherheitsbild: Schülerin hält Abstand zu einer verschütteten Flüssigkeit und informiert eine Lehrkraft"><rect x="18" y="18" width="464" height="214" rx="16" fill="#fffaf0" stroke="#e3cf9e"/><path d="M48 166h400" stroke="#829ba9" stroke-width="8"/><path d="M210 162q35-21 73 0" fill="#9bd8e3" stroke="#388c9b" stroke-width="3"/><circle cx="116" cy="82" r="25" fill="#ffd29c" stroke="#9d6c45" stroke-width="3"/><path d="M76 168v-41q40-30 80 0v41" fill="#4f99a0" stroke="#27656b" stroke-width="4"/><path d="M90 64q26-23 51 1" fill="none" stroke="#f2a43a" stroke-width="8"/><path d="M143 126h44" stroke="#b74a3e" stroke-width="3" stroke-dasharray="7 6"/><path d="M337 156v-56m0 10q-29-12-30-35 32-1 30 35m0-12q27-21 40-4-11 25-40 24" fill="#7fc595" stroke="#38734a" stroke-width="3"/><path d="M302 163h70" stroke="#476978" stroke-width="5"/><text x="45" y="211" font-size="15" font-weight="700" fill="#174957">Abstand halten</text><text x="284" y="211" font-size="15" font-weight="700" fill="#174957">Lehrkraft informieren</text></svg>',observe:['Nicht berühren, Abstand halten und sofort die Lehrkraft informieren.','Mit einem Tuch schnell selbst wegwischen.'],obs:0,obsGood:'Genau: Abstand halten, nicht anfassen und der Lehrkraft Bescheid geben.',obsTry:'Bitte nicht selbst reinigen: Stoff und Gefahr sind unbekannt. Informiere sofort die Lehrkraft.',explain:'Im Labor werden Stoffe nicht probiert oder eigenmächtig angefasst. Bei Verschüttetem, Unsicherheit oder einem Problem: stoppen, Abstand halten und sofort die Lehrkraft informieren.',q:'Wer entscheidet, wie die Flüssigkeit sicher beseitigt wird?',a:['Die Lehrkraft.','Ich wische sie selbst weg.'],c:0,why:'Nur die Lehrkraft kann einschätzen, welcher Stoff vorliegt und welche Schutz- und Reinigungsmaßnahmen nötig sind.'}
];
let index=0,observed=false,revealed=false,answered=false;
const $=id=>document.getElementById(id);
const render=()=>{
 const s=steps[index];observed=false;revealed=false;answered=false;
 $('gjStep').textContent=`Schritt ${index+1} von ${steps.length}`;
 $('gjDone').hidden=true;$('gjDone').textContent='';root.querySelector('.gj-scene').hidden=false;
 $('gjTitle').textContent=s.title;$('gjPrompt').textContent=s.prompt;
 $('gjArt').innerHTML=s.art;$('gjObserve').replaceChildren();
 s.observe.forEach((text,i)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',()=>chooseObservation(i));$('gjObserve').appendChild(b)});
 $('gjObserveFeedback').textContent='Wähle eine Vermutung. Danach erklärt Benno, worauf es ankommt.';
 $('gjObserveFeedback').className='gj-feedback';
 $('gjReveal').hidden=true;$('gjAfterReveal').hidden=true;
 $('gjQuiz').replaceChildren();$('gjQuizFeedback').textContent='Wähle eine Antwort. Benno erklärt dir auch, warum sie passt.';$('gjQuizFeedback').className='gj-feedback';
 $('gjNext').disabled=true;$('gjNext').textContent=index===steps.length-1?'Lernreise abschließen':'Nächster Schritt →';
 $('gjPrev').disabled=index===0;
 const bar=$('visualLearningPath').querySelector('[role=progressbar]');bar.setAttribute('aria-valuenow',String(index));$('gjProgress').style.width=`${index/steps.length*100}%`;
 $('gjStatus').textContent=`Schritt ${index+1} von ${steps.length}`;
 $('gjQuizQuestion').textContent=s.q;
 $('gjQuiz').replaceChildren(...s.a.map((text,i)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',()=>answerQuiz(i));return b}));
};
const chooseObservation=choice=>{
 if(observed)return;observed=true;const s=steps[index];
 $('gjObserve').querySelectorAll('button').forEach((b,i)=>{b.disabled=true;b.setAttribute('aria-pressed',String(i===choice));if(i===s.obs)b.classList.add('correct');else if(i===choice)b.classList.add('wrong')});
 const correct=choice===s.obs;$('gjObserveFeedback').textContent=correct?s.obsGood:s.obsTry;
 $('gjObserveFeedback').classList.add(correct?'good':'try');$('gjReveal').hidden=false;$('gjReveal').focus();
};
const reveal=()=>{
 if(!observed||revealed)return;revealed=true;
 $('gjExplanation').textContent=steps[index].explain;$('gjAfterReveal').hidden=false;$('gjReveal').hidden=true;
 $('gjQuizQuestion').textContent=steps[index].q;
 $('gjAfterReveal').scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
};
const answerQuiz=choice=>{
 if(!revealed||answered)return;answered=true;const s=steps[index],correct=choice===s.c;
 $('gjQuiz').querySelectorAll('button').forEach((b,i)=>{b.disabled=true;b.setAttribute('aria-pressed',String(i===choice));if(i===s.c)b.classList.add('correct');else if(i===choice)b.classList.add('wrong')});
 $('gjQuizFeedback').textContent=(correct?'Richtig! ':'Noch nicht ganz. ')+s.why;$('gjQuizFeedback').classList.add(correct?'good':'try');
 $('gjNext').disabled=false;$('gjStatus').textContent=correct?'Mini-Check richtig':'Erklärung gelesen · weiter geht es';
 $('gjNext').focus();
};
const go=page=>{const b=document.querySelector('#nav [data-page="'+page+'"]');if(b)b.click()};
root.addEventListener('click',e=>{
 const shortcut=e.target.closest('[data-gj-go]');
 if(shortcut){const target=shortcut.dataset.gjGo;go(target);if(shortcut.dataset.gjTab)setTimeout(()=>{const tab=document.querySelector('[data-v4tab="'+shortcut.dataset.gjTab+'"],[data-v5tab="'+shortcut.dataset.gjTab+'"]');if(tab)tab.click()},80)}
});
$('gjReveal').addEventListener('click',reveal);
$('gjPrev').addEventListener('click',()=>{if(index>0){index--;render()}});
$('gjNext').addEventListener('click',()=>{if(!answered)return;if(index<steps.length-1){index++;render()}else{$('gjStep').textContent='5 Schritte geschafft';$('gjTitle').textContent='Lernreise geschafft!';$('gjStatus').textContent='Alle fünf Mini-Checks bearbeitet';$('gjDone').textContent='Prima geforscht! Du hast alle fünf Themen angesehen, Benno zugehört und jede Frage beantwortet. Du kannst die Lernreise neu beginnen oder oben direkt zu einem Thema springen.';$('gjDone').hidden=false;root.querySelector('.gj-scene').hidden=true;$('gjPrev').disabled=true;$('gjNext').disabled=true;$('gjNext').textContent='Fertig';$('gjProgress').style.width='100%';$('visualLearningPath').querySelector('[role=progressbar]').setAttribute('aria-valuenow','5')}});
$('gjRestart').addEventListener('click',()=>{index=0;render();$('gjTitle').focus()});
render();
document.querySelectorAll('.chemistry-update-banner').forEach(b=>{b.textContent='Chemie-Entdeckerlabor · Version 7.6 – jetzt mit Wärmeleitfähigkeit: Materialvergleich, Alltag und Übungen. Die Benno-Lernreise und bisherigen Lernbereiche bleiben erhalten.'});
document.title='Chemie-Entdeckerlabor · Klasse 5 · Version 7.6';
})();

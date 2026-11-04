
'use strict';
const $=id=>document.getElementById(id);
const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
const state={done:{},route:'home',deviceFilter:'Alle',matter:{i:0,score:0,answered:false},deviceQ:{i:0,score:0,answered:false,list:[]},safety:new Set(),solute:'salt',amounts:{salt:0,sugar:0},heater:{step:0,timer:null},flame:'yellow',method:{selected:[],q:0,answered:false},quiz:{questions:[],i:0,score:0,answered:false},pairs:{left:null,right:null,matched:new Set()},mission:{index:0,step:0,answered:false},notes:{},quizErrors:[]};
try{const saved=JSON.parse(localStorage.getItem('chemie5-data')||'{}');if(saved.done&&typeof saved.done==='object')state.done=saved.done;if(saved.contrast)document.body.classList.add('high-contrast');if(saved.big)document.body.classList.add('bigtext')}catch(e){console.warn('Gespeicherte Daten konnten nicht gelesen werden:',e)}
function persist(){try{localStorage.setItem('chemie5-data',JSON.stringify({done:state.done,contrast:document.body.classList.contains('high-contrast'),big:document.body.classList.contains('bigtext')}))}catch(e){console.warn('Gespeicherte Daten konnten nicht gelesen werden:',e)}}
function complete(k){if(!state.done[k]){state.done[k]=true;persist();updateProgress()}}
function updateProgress(){const keys=['protocoltrainer','finaltest','thermal','matter','devices','safety','solubility','heating','burner','method','missions','deep','quiz','v4lab','v4play','v4study','v5academy'];let n=keys.filter(k=>state.done[k]).length;const TOTAL_AREAS=17;$('sideProgress').style.width=(n/TOTAL_AREAS*100)+'%';$('sideProgressText').textContent=n+' von '+TOTAL_AREAS+' Bereichen geschafft';$$('[data-done]').forEach(el=>el.textContent=state.done[el.dataset.done]?'✓':'');}
// Central navigation: modules register lifecycle hooks; the router is never replaced.
const chemistryRouteHooks={enter:new Map(),leave:new Map()};
window.ChemistryNavigation={onEnter:(id,fn)=>{const list=chemistryRouteHooks.enter.get(id)||[];list.push(fn);chemistryRouteHooks.enter.set(id,list)},onLeave:(id,fn)=>{const list=chemistryRouteHooks.leave.get(id)||[];list.push(fn);chemistryRouteHooks.leave.set(id,list)},current:()=>state.route};
function navigate(to){
 if(!document.getElementById('page-'+to))to='home';const from=state.route;
 for(const hook of chemistryRouteHooks.leave.get(from)||[])hook(to);
 if(state.heater.timer)stopHeat();if(typeof deepStopTimers==='function')deepStopTimers();
 document.querySelectorAll('main > section.stage').forEach(p=>p.hidden=p.id!=='page-'+to);state.route=to;
 document.querySelectorAll('#nav button[data-page]').forEach(b=>{const active=b.dataset.page===to;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 $('crumb').textContent={home:'DEIN LERNLABOR · KLASSE 5',protocoltrainer:'ÜBEN · PROTOKOLL-FEHLERTRAINER',finaltest:'ABSCHLUSSTEST · DEINE KLASSENARBEITSTHEMEN',thermal:'STOFFEIGENSCHAFTEN · WÄRMELEITFÄHIGKEIT',matter:'MODUL 1 · STOFFE & KÖRPER',devices:'MODUL 2 · LABORGERÄTE',safety:'MODUL 3 · SICHERHEIT',solubility:'MODUL 4 · LÖSLICHKEIT',heating:'MODUL 5 · SIEDETEMPERATUR',burner:'MODUL 6 · GASBRENNER',method:'MODUL 7 · EXPERIMENTE',missions:'MODUL 8 · LABOR-MISSIONEN',deep:'MODUL 9 · FORSCHERLABOR',quiz:'ABSCHLUSSTEST',sheet:'LERNHEFT · ÜBERSICHT',v4lab:'FORSCHUNGSCAMPUS · VIRTUELLES LABOR',v4play:'FORSCHUNGSCAMPUS · SPIELWELT',v4study:'FORSCHUNGSCAMPUS · LERNZENTRALE',v5academy:'CHEMIE · FORSCHERWERKSTATT V5',chem6:'FORSCHUNGSCAMPUS',learningpath:'DEIN LERNPFAD ZUR KLASSENARBEIT',practicehub:'ÜBEN · DEIN NÄCHSTER SCHRITT',reviewpractice:'PERSÖNLICHES NACHTRAINING'}[to]||'CHEMIE · LERNLABOR';
 if('speechSynthesis' in window)speechSynthesis.cancel();$('speakToggle').textContent='🔊 Vorlesen';window.scrollTo({top:0,behavior:'instant'});
 for(const hook of chemistryRouteHooks.enter.get(to)||[])hook(from);
 document.dispatchEvent(new CustomEvent('chemistry:navigate',{detail:{from,to}}));
}
$$('[data-page]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.page)));$$('[data-go]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.go)));
$('contrastToggle').addEventListener('click',()=>{document.body.classList.toggle('high-contrast');persist()});$('sizeToggle').addEventListener('click',()=>{document.body.classList.toggle('bigtext');persist()});$('speakToggle').addEventListener('click',()=>{if(!('speechSynthesis'in window)){alert('Vorlesen wird von diesem Browser nicht unterstützt.');return}if(speechSynthesis.speaking){speechSynthesis.cancel();$('speakToggle').textContent='🔊 Vorlesen';return}const page=$('page-'+state.route);const READ_ALOUD_LIMIT=3700,text=page.innerText.replace(/\s+/g,' ').slice(0,READ_ALOUD_LIMIT);const utter=new SpeechSynthesisUtterance(text);utter.lang='de-DE';utter.rate=Number(window.LernCockpit?.settings()?.rate)||.9;const voiceUri=window.LernCockpit?.settings()?.voice;const chosen=speechSynthesis.getVoices().find(v=>v.voiceURI===voiceUri);if(chosen)utter.voice=chosen;utter.onend=()=>{$('speakToggle').textContent='🔊 Vorlesen'};utter.onerror=()=>{$('speakToggle').textContent='🔊 Vorlesen'};speechSynthesis.speak(utter);$('speakToggle').textContent='⏹ Stopp'});
const topics=[['matter','🧩','Stoffe & Körper','Körper oder Stoff? Sortiere Beispiele und verstehe den Unterschied.'],['devices','🔬','Laborgeräte','Erkenne Reagenzglas, Trichter, Dreifuß und viele andere Geräte.'],['safety','🛡️','Sicher experimentieren','Finde Gefahren in einer interaktiven Laborszene.'],['solubility','🧂','Löslichkeit','Führe ein virtuelles Experiment mit Salz und Zucker durch.'],['thermal','♨️','Wärmeleitfähigkeit','Vergleiche Metall, Holz und Kunststoff und erkläre Beispiele aus dem Alltag.'],['heating','🌡️','Siedetemperatur','Erwärme Wasser virtuell und lese ein Diagramm ab.'],['burner','🔥','Gasbrenner','Vergleiche Flammen und absolviere den Sicherheitscheck.'],['method','📝','Experimente planen','Ordne Versuchsphasen und trenne Beobachtung und Deutung.'],['missions','🧪','Labor-Missionen','Löse drei Forschungsfälle in mehreren Schritten.'],['deep','✨','Forscherlabor mit Animationen','Teilchenkino, Siedelabor, Flammenzonen und Geräte-Missionen.'],['quiz','🏆','Wissenscheck','Wähle Thema und Länge; übe deine Fehler gezielt.']];
$('homeCards').innerHTML=topics.map((t,i)=>`<button type="button" class="card clickable" data-home-topic="${t[0]}" aria-label="${t[2]} öffnen"><span class="card-top"><span class="topic-icon">${t[1]}</span><span class="topic-code">${t[0]==='quiz'?'TEST':`THEMA ${String(i+1).padStart(2,'0')}`}</span></span><span class="card-h3">${t[2]} ${state.done[t[0]]?'✓':''}</span><span class="card-p">${t[3]}</span><span class="card-link">Loslegen →</span></button>`).join('');
$$('[data-home-topic]').forEach(c=>{const f=()=>navigate(c.dataset.homeTopic);c.addEventListener('click',f)});
function feedback(el,ok,txt){el.className='feedback '+(ok===null?'':ok?'good':'bad');el.textContent=txt;}
function makeSvg(inner){return `<svg viewBox="0 0 140 120" role="img" aria-label="Gerätezeichnung"><g fill="none" stroke="#365f72" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`}
const art={
'Becherglas':`<path d="M30 20V96Q30 103 40 103H105Q112 103 112 96V20"/><path d="M30 20H112M37 55h12M37 70h12M37 85h12"/><path d="M36 67H106V97H36" fill="#b5e5ee" stroke="none" opacity=".65"/>`,
'Erlenmeyerkolben':`<path d="M60 12v36L25 102Q22 108 32 108h77q9 0 5-8L79 48V12M57 12h25"/><path d="M41 88h57" stroke="#50adbf"/><path d="M45 90h50l9 14H36Z" fill="#b9e9ed" stroke="none"/>`,
'Reagenzglas':`<path d="M52 10V90Q52 108 70 108Q88 108 88 90V10M52 10h36"/><path d="M56 78h28" stroke="#50adbf"/>`,
'Reagenzglashalter':`<path d="M18 95L84 54L103 29"/><path d="M88 40Q104 20 112 29Q119 38 99 54L83 64M88 40L72 49"/><path d="M19 95l15 5"/>`,
'Reagenzglasständer':`<path d="M20 38h102v17H20zM29 55v47h85V55M26 104h92M34 46h13M56 46h13M78 46h13M100 46h13"/><path d="M39 55v36q0 5 7 5t7-5V55M75 55v36q0 5 7 5t7-5V55" stroke="#94cfdb" stroke-width="2"/>`,
'Tiegelzange':`<path d="M30 10Q50 45 65 63L112 105M110 10Q92 43 75 63L26 105M61 59h19"/><path d="M109 9q9 3 10 11M30 9q-9 3-10 11"/>`,
'Reibschale mit Pistill':`<path d="M23 66H117Q115 106 70 106Q26 106 23 66Z"/><path d="M45 66L99 18Q103 14 111 23L60 75" fill="#d6e7e2"/><path d="M30 99h80"/>`,
'Spatel':`<path d="M71 34V101M71 33Q58 24 62 10h18q5 18-9 23Z"/><path d="M66 103h10"/>`,
'Uhrglas':`<path d="M16 65Q70 95 124 65Q70 43 16 65Z" fill="#d2f0f2"/><path d="M26 63Q70 55 114 63" stroke="#75bfcd" stroke-width="2"/>`,
'Abdampfschale':`<path d="M23 55h94Q110 100 70 104Q30 100 23 55Z"/><path d="M23 55q45-9 94 0" stroke="#84b6c1"/><path d="M111 50l14-10"/>`,
'Trichter':`<path d="M15 19h110L78 75v32H62V75Z"/><path d="M15 19q55-8 110 0"/>`,
'Glasstab':`<path d="M60 107L84 12" stroke-width="7"/><path d="M60 107L84 12" stroke="#acdbe8" stroke-width="3"/>`,
'Messzylinder':`<path d="M58 11V99M87 11V99M49 11h47M48 99h49M40 107h65M59 30h15M59 45h9M59 60h15M59 75h9M59 90h15"/><path d="M63 70h20v27H63Z" fill="#b4e1ec" stroke="none"/>`,
'Dreifuß':`<path d="M26 35h88M30 35l-14 72M110 35l14 72M70 35v72"/><path d="M30 31Q70 12 110 31"/>`,
'Drahtnetz':`<path d="M23 23h94v74H23Z"/><path d="M23 42h94M23 61h94M23 80h94M42 23v74M61 23v74M80 23v74M99 23v74" stroke-width="2"/><circle cx="70" cy="60" r="27" fill="#d5e5e6" opacity=".8" stroke-width="2"/>`,
'Stativ':`<path d="M45 15v91M18 107h85M18 107l14-13h64l9 13M45 38h61M100 28v19M90 28v19"/>`,
'Pipette':`<path d="M68 15v63M68 78l-6 23q6 15 12 0l-6-23"/><path d="M63 15q-14-17 5-17q19 0 5 17" transform="translate(0 12)"/><path d="M65 35h6M65 50h6"/>`,
'Gasbrenner':`<path d="M60 22v67h20V22M55 20h30M45 100h55M35 108h75M81 79h22"/><path d="M66 22q-13-15 3-31q19 12 7 31" stroke="#eca64a"/>`,
'Thermometer':`<path d="M63 14v67q-15 8-9 23q10 20 27 5q14-18-4-29V14q-7-9-14 0Z"/><path d="M70 34v54M70 88q-9 0-9 10q0 11 10 11t10-11q0-9-11-10Z" fill="#e69e81" stroke="#c96751"/><path d="M80 31h9M80 47h9M80 63h9" stroke-width="2"/>`
};
const devices=[
{name:'Reagenzglas',cat:'Glasgeräte',purpose:'Für kleine Mengen von Flüssigkeiten und einfache Stoffuntersuchungen.'},
{name:'Reagenzglashalter',cat:'Hilfsgeräte',purpose:'Hält ein Reagenzglas bei bestimmten Arbeitsvorgängen, z. B. beim Erhitzen unter Aufsicht.'},
{name:'Reagenzglasständer',cat:'Hilfsgeräte',purpose:'Stellt mehrere Reagenzgläser sicher ab.'},
{name:'Becherglas',cat:'Glasgeräte',purpose:'Zum Auffangen, Mischen und gegebenenfalls Erhitzen von Flüssigkeiten; nicht zum exakten Messen.'},
{name:'Erlenmeyerkolben',cat:'Glasgeräte',purpose:'Zum Mischen und Aufbewahren von Flüssigkeiten, der enge Hals verringert Spritzer.'},
{name:'Messzylinder',cat:'Glasgeräte',purpose:'Zum Abmessen des Flüssigkeitsvolumens anhand einer Skala.'},
{name:'Trichter',cat:'Glasgeräte',purpose:'Zum Umfüllen oder mit Filterpapier zum Filtrieren.'},
{name:'Glasstab',cat:'Hilfsgeräte',purpose:'Zum Umrühren von Flüssigkeiten und beim Umfüllen.'},
{name:'Reibschale mit Pistill',cat:'Hilfsgeräte',purpose:'Zum Zerkleinern und Zerreiben fester Stoffe.'},
{name:'Spatel',cat:'Hilfsgeräte',purpose:'Zum Entnehmen kleiner Mengen fester Chemikalien.'},
{name:'Uhrglas',cat:'Glasgeräte',purpose:'Als kleine Ablage für Stoffproben oder Abdeckung eines Becherglases.'},
{name:'Abdampfschale',cat:'Erhitzen',purpose:'Zum vorsichtigen Eindampfen einer Lösung unter Aufsicht.'},
{name:'Tiegelzange',cat:'Erhitzen',purpose:'Zum Greifen heißer Tiegel oder kleiner heißer Gegenstände.'},
{name:'Dreifuß',cat:'Erhitzen',purpose:'Trägt ein Drahtnetz oder geeignetes Gerät über einer Wärmequelle.'},
{name:'Drahtnetz',cat:'Erhitzen',purpose:'Liegt auf dem Dreifuß und hilft, die Wärme zu verteilen.'},
{name:'Stativ',cat:'Hilfsgeräte',purpose:'Hält Versuchsgeräte mit passender Klemme und Muffe fest.'},
{name:'Pipette',cat:'Glasgeräte',purpose:'Zum dosierten Übertragen kleiner Flüssigkeitsmengen; nie mit dem Mund benutzen.'},
{name:'Thermometer',cat:'Hilfsgeräte',purpose:'Misst die Temperatur eines Stoffes oder einer Flüssigkeit.'},
{name:'Gasbrenner',cat:'Erhitzen',purpose:'Zum Erhitzen mit einer Gasflamme; nur nach Freigabe durch die Lehrkraft.'}
];
function iconForMatter(item){let emojis={'Fensterscheibe':'🪟','Glas':'🧪','Goldring':'💍','Gold':'🟡','Regentropfen':'💧','Wasser':'💦','Zeitung':'📰','Papier':'📄','Kaffeetasse':'☕','Porzellan':'🏺','Nagel':'🔩','Eisen':'🔧','Zucker':'🍬','Zuckerwürfel':'⬜','Alufolie':'🪙','Aluminium':'🥫','Zimmer­tür':'🚪','Holz':'🪵','Luft':'🌬️','Luftblase':'🫧','Schneeflocke':'❄️','Baumwolle':'🌱','Kupfer':'🥉','Korkstopfen':'🛢️'};return `<div style="text-align:center;font-size:92px;line-height:1.4">${emojis[item]||'⚗️'}</div>`}
const matterQuestions=[
['Fensterscheibe','Körper','Eine Fensterscheibe ist ein abgegrenzter Gegenstand; sie besteht überwiegend aus Glas.'],['Glas','Stoff','Glas bezeichnet das Material, zum Beispiel einer Fensterscheibe.'],['Goldring','Körper','Der Ring ist ein Gegenstand. Sein Material kann Gold sein.'],['Gold','Stoff','Gold ist ein chemischer Stoff, nämlich ein Metall.'],['Regentropfen','Körper','Ein einzelner Tropfen ist eine abgegrenzte Wasserportion.'],['Wasser','Stoff','Wasser ist der Stoff, aus dem ein Regentropfen besteht.'],['Zeitung','Körper','Die Zeitung ist ein Gegenstand, überwiegend aus Papier.'],['Papier','Stoff','Papier ist das Material, aus dem eine Zeitung bestehen kann.'],['Kaffeetasse','Körper','Die Tasse ist ein Gegenstand, zum Beispiel aus Porzellan.'],['Porzellan','Stoff','Porzellan bezeichnet das Material einer Tasse.'],['Nagel','Körper','Ein Nagel ist ein Gegenstand, der z. B. aus Stahl besteht.'],['Eisen','Stoff','Eisen ist ein metallischer Stoff.'],['Zucker','Stoff','Zucker (Saccharose) ist ein Stoff und kann ganz unterschiedliche Formen annehmen.'],['Zuckerwürfel','Körper','Ein bestimmter Zuckerwürfel ist ein Gegenstand aus Zucker.'],['Alufolie','Körper','Ein bestimmtes Stück Alufolie ist ein Körper; sein Material heißt Aluminium.'],['Aluminium','Stoff','Aluminium ist ein metallischer Stoff.'],['Holz','Stoff','Holz ist ein natürliches Material und enthält mehrere Stoffe.'],['Luft','Stoff','Luft ist ein gasförmiges Stoffgemisch, vor allem aus Stickstoff und Sauerstoff.'],['Luftblase','Körper','Die abgegrenzte Luftportion in einer Blase kann als Körper betrachtet werden.'],['Schneeflocke','Körper','Eine Schneeflocke ist ein kleiner Eiskörper aus gefrorenem Wasser.'],['Baumwolle','Stoff','Baumwolle bezeichnet ein pflanzliches Fasermaterial.'],['Kupfer','Stoff','Kupfer ist ein metallischer Stoff.'],['Korkstopfen','Körper','Ein Korkstopfen ist ein Gegenstand, der aus Korkmaterial besteht.'] ];
let currentMatterList=[];
function shuffle(arr){const copy=[...arr];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
function startMatter(){const uniqueQuestions=[...new Map(matterQuestions.map(q=>[q[0],q])).values()];const bodies=shuffle(uniqueQuestions.filter(q=>q[1]==='Körper')).slice(0,5);const substances=shuffle(uniqueQuestions.filter(q=>q[1]==='Stoff')).slice(0,5);currentMatterList=shuffle([...bodies,...substances]);state.matter={i:0,score:0,answered:false};renderMatter()}
function renderMatter(){const s=state.matter;if(s.i>=currentMatterList.length){$('matterItem').textContent='Super gemacht!';$('matterContext').textContent=`${s.score} von 10 Antworten richtig`;feedback($('matterFeedback'),s.score>=7,`Du hast ${s.score} von 10 Aufgaben richtig gelöst. ${s.score<7?'Übe gern noch einmal.':'Du kennst den Unterschied zwischen Körper und Stoff.'}`);$('matterNext').disabled=true;$$('[data-matter]').forEach(b=>b.disabled=true);$('matterProgress').style.width='100%';$('matterStep').textContent='Fertig!';$('matterGraphic').innerHTML='<div style="font-size:80px">🏆</div>';if(s.score>=7)complete('matter');return}const q=currentMatterList[s.i];$('matterItem').textContent=q[0];$('matterContext').textContent='Klicke die passende Kategorie.';$('matterGraphic').innerHTML=iconForMatter(q[0]);$('matterStep').textContent=`Aufgabe ${s.i+1} von 10`;$('matterScore').textContent=`${s.score} richtig`;$('matterProgress').style.width=(s.i/10*100)+'%';$$('[data-matter]').forEach(b=>{b.disabled=false;b.classList.remove('correct','wrong')});$('matterNext').disabled=true;feedback($('matterFeedback'),null,'Ist das ein Körper oder ein Stoff?');s.answered=false}
$$('[data-matter]').forEach(b=>b.addEventListener('click',()=>{const s=state.matter;if(s.answered||s.i>=10)return;const q=currentMatterList[s.i],ok=b.dataset.matter===q[1];s.answered=true;if(ok)s.score++;b.classList.add(ok?'correct':'wrong');$$('[data-matter]').forEach(el=>{el.disabled=true;if(el.dataset.matter===q[1])el.classList.add('correct')});feedback($('matterFeedback'),ok,(ok?'Richtig! ':'Noch nicht ganz. ')+q[2]);$('matterNext').disabled=false;$('matterScore').textContent=`${s.score} richtig`}));
$('matterNext').addEventListener('click',()=>{state.matter.i++;renderMatter()});$('matterRestart').addEventListener('click',startMatter);
function renderDevices(){const arr=devices.filter(d=>state.deviceFilter==='Alle'||d.cat===state.deviceFilter);$('deviceCount').textContent=arr.length+' Geräte';$('deviceList').innerHTML=arr.map((d)=>`<button class="device" data-device="${d.name}" aria-label="${d.name} ansehen">${makeSvg(art[d.name])}<span class="name">${d.name}</span><span class="kind">${d.cat}</span></button>`).join('');$$('[data-device]').forEach(b=>b.addEventListener('click',()=>{const d=devices.find(x=>x.name===b.dataset.device);$('deviceInfo').innerHTML=makeSvg(art[d.name])+`<div><h3>${d.name}</h3><p style="margin:5px 0">${d.purpose}</p><span class="pill">${d.cat}</span></div>`;$('deviceInfo').classList.add('open')}));}
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{state.deviceFilter=b.dataset.filter;$$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('deviceInfo').classList.remove('open');renderDevices()}));
function showDeviceTab(mode){$('deviceGallery').hidden=mode!=='gallery';$('deviceQuiz').hidden=mode!=='quiz';$('deviceGalleryTab').classList.toggle('active',mode==='gallery');$('deviceQuizTab').classList.toggle('active',mode==='quiz');}
$('deviceGalleryTab').addEventListener('click',()=>showDeviceTab('gallery'));$('deviceQuizTab').addEventListener('click',()=>showDeviceTab('quiz'));
function startDeviceQuiz(){state.deviceQ={i:0,score:0,answered:false,list:shuffle(devices).slice(0,8)};renderDeviceQuiz()}
function renderDeviceQuiz(){let s=state.deviceQ;if(s.i>=8){$('devQuizVisual').innerHTML='<div style="font-size:72px">🎓</div>';$('devQanswers').innerHTML='';feedback($('devQfeedback'),s.score>=6,`Fertig! ${s.score} von 8 richtig. ${s.score>=6?'Du kennst die Laborgeräte!':'Probiere das Bilderquiz erneut.'}`);$('devQnext').disabled=true;$('devQstep').textContent='Quiz beendet';$('devQprogress').style.width='100%';if(s.score>=6)complete('devices');return}const d=s.list[s.i];$('devQuizVisual').innerHTML=makeSvg(art[d.name]);$('devQstep').textContent=`Bild ${s.i+1} von 8`;$('devQscore').textContent=`${s.score} richtig`;$('devQprogress').style.width=(s.i/8*100)+'%';let opts=shuffle([d,...shuffle(devices.filter(x=>x.name!==d.name)).slice(0,3)]);$('devQanswers').innerHTML=opts.map(o=>`<button class="answer" data-device-answer="${o.name}">${o.name}</button>`).join('');$$('[data-device-answer]').forEach(b=>b.addEventListener('click',()=>{if(s.answered)return;s.answered=true;const ok=b.dataset.deviceAnswer===d.name;if(ok)s.score++;b.classList.add(ok?'correct':'wrong');$$('[data-device-answer]').forEach(btn=>{btn.disabled=true;if(btn.dataset.deviceAnswer===d.name)btn.classList.add('correct')});feedback($('devQfeedback'),ok,`${ok?'Richtig!':'Die richtige Antwort ist '+d.name+'.'} ${d.purpose}`);$('devQscore').textContent=`${s.score} richtig`;$('devQnext').disabled=false}));$('devQnext').disabled=true;feedback($('devQfeedback'),null,'Welches Gerät siehst du?');s.answered=false}
$('devQnext').addEventListener('click',()=>{state.deviceQ.i++;renderDeviceQuiz()});$('devQrestart').addEventListener('click',startDeviceQuiz);
const hazards=[
['Keine Schutzbrille','Die Schutzbrille schützt deine Augen vor Spritzern. Trage sie bei Experimenten nach den Vorgaben der Lehrkraft.'],
['Lange Haare hängen offen','Haare zusammenbinden, besonders beim Arbeiten in der Nähe einer Flamme.'],
['Essen im Chemieraum','Im Labor nicht essen, trinken oder Stoffe probieren – Verwechslungs- und Verschluckungsgefahr.'],
['Unbeaufsichtigter Gasbrenner','Einen brennenden Gasbrenner nie unbeaufsichtigt lassen. Nur nach Anweisung benutzen.'],
['Schultasche im Weg','Taschen und andere Stolperfallen gehören an einen sicheren Platz, nicht in den Laufweg.'],
['Flüssigkeit verschüttet','Verschüttete Stoffe sofort der Lehrkraft melden und nur nach Anweisung sicher beseitigen.']
];
function renderSafety(){const arr=[...state.safety].sort((a,b)=>a-b);$('safetyCount').textContent=`${arr.length} von 6`;$('safetyProgress').style.width=(arr.length/6*100)+'%';$$('[data-safety]').forEach(b=>{const has=state.safety.has(+b.dataset.safety);b.classList.toggle('seen',has);b.textContent=has?'✓':'?';b.setAttribute('aria-pressed',String(has))});$('safetyDiscoveries').innerHTML=arr.length?arr.map(i=>`<div class="discovery"><strong>✓ ${hazards[i][0]}</strong><p>${hazards[i][1]}</p></div>`).join(''):'<p class="muted">Hier erscheinen die entdeckten Gefahren und die richtigen Verhaltensweisen.</p>';if(arr.length===6)complete('safety')}
$$('[data-safety]').forEach(b=>b.addEventListener('click',()=>{const i=+b.dataset.safety;if(!state.safety.has(i)){state.safety.add(i);feedback($('safetyFeedback'),true,hazards[i][0]+': '+hazards[i][1]);renderSafety()}else feedback($('safetyFeedback'),null,'Diesen Fehler hast du bereits gefunden. Suche den nächsten.')}));$('safetyReset').addEventListener('click',()=>{state.safety=new Set();feedback($('safetyFeedback'),null,'Suche die sechs Gefahren im Bild.');renderSafety()});
const solCaps={salt:72,sugar:400};
function updateSol(){const s=state.solute,a=state.amounts[s],cap=solCaps[s],dissolved=Math.min(a,cap),sediment=Math.max(0,a-cap);['salt','sugar'].forEach(k=>{const v=state.amounts[k],c=solCaps[k],sed=Math.max(0,v-c);const glass=$(k+'Glass');glass.querySelector('.sediment').style.height=sed>0?(8+Math.min(58,sed/c*105))+'px':'0';glass.querySelector('.grains').style.opacity=sed>0?'.18':'.02';$(k+'Text').textContent=`${v} g zugegeben · ${Math.min(v,c)} g gelöst`});$('solTotal').textContent=a+' g';$('solDissolved').textContent=dissolved+' g';const pct=Math.round(Math.min(100,a/cap*100));$('solProgress').style.width=pct+'%';$('solSaturation').textContent=pct+' % der Löslichkeitsgrenze';$('solResultTitle').textContent=sediment>0?'🔍 Jetzt bleibt ein Bodensatz':'💧 Der Stoff löst sich';$('solResult').textContent=sediment>0?`Von ${a} g ${s==='salt'?'Salz':'Zucker'} können sich im Modell ${cap} g lösen. ${sediment} g bleiben als Bodensatz zurück.`:a>0?`${dissolved} g ${s==='salt'?'Salz':'Zucker'} sind im Modell gelöst. Noch ist kein Bodensatz zu sehen.`:'Wähle einen Stoff aus und gib ihn in das Wasser.';if(state.amounts.salt>solCaps.salt&&state.amounts.sugar>solCaps.sugar)complete('solubility');}
$$('[name="solute"]').forEach(r=>r.addEventListener('change',()=>{state.solute=r.value;updateSol()}));function addSol(mass){let k=state.solute;state.amounts[k]=Math.min(550,state.amounts[k]+mass);const glass=$(k+'Glass');glass.classList.remove('stirring');void glass.offsetWidth;glass.classList.add('stirring');updateSol()}
$('solAdd10').addEventListener('click',()=>addSol(10));$('solAdd25').addEventListener('click',()=>addSol(25));$('solReset').addEventListener('click',()=>{state.amounts={salt:0,sugar:0};updateSol()});
$$('[data-solanswer]').forEach(b=>b.addEventListener('click',()=>{const ok=b.dataset.solanswer==='1';$$('[data-solanswer]').forEach(el=>{el.classList.remove('correct','wrong');if(el.dataset.solanswer==='1')el.classList.add('correct')});if(!ok)b.classList.add('wrong');feedback($('solQuestionFeedback'),ok,ok?'Richtig. Solange weitere Portionen vollständig löslich sind, ist die Löslichkeitsgrenze noch nicht erreicht.':'Das lässt sich aus der Anzahl nicht ablesen. Solange sich Zucker vollständig löst, ist die Lösung nicht gesättigt.');if(ok)complete('solubility')}));
function initHeatChart(){let g='';const y=t=>314-(t/120)*257;const x=s=>75+(s/600)*532;for(let t=0;t<=120;t+=20)g+=`<line x1="75" y1="${y(t)}" x2="610" y2="${y(t)}" class="gridline"/><text x="43" y="${y(t)+4}">${t}</text>`;for(let s=0;s<=600;s+=60)g+=`<line x1="${x(s)}" y1="53" x2="${x(s)}" y2="315" class="gridline"/><text x="${x(s)-10}" y="337">${s}</text>`;g+=`<path class="axis" d="M75 50V315H610"/><text x="300" y="369" font-size="15">Zeit in Sekunden (s)</text><text transform="rotate(-90 18 185)" x="18" y="185" font-size="15">Temperatur (°C)</text>`;$('heatGrid').innerHTML=g}
const heatTemp=step=>Math.min(100,20+Math.min(step,12)*(80/12));
function updateHeat(){let step=state.heater.step,t=Math.round(heatTemp(step)),s=step*30;const x=v=>75+(v/600)*532;const y=v=>314-(v/120)*257;let d='';for(let i=0;i<=step;i++)d+=(i?'L':'M')+x(i*30)+' '+y(heatTemp(i))+' ';$('heatPlot').setAttribute('d',d);$('heatMarker').setAttribute('cx',x(s));$('heatMarker').setAttribute('cy',y(t));$('heatTime').textContent=`Zeit: ${s} s`;$('heatTemp').textContent=`Temperatur: ${t} °C`;$('heatValue').textContent=t+' °C';$('thermoFluid').style.height=(8+t*.76)+'%';$('heatState').textContent=t>=100?'siedend':'flüssig';$('heatBeaker').classList.toggle('boiling',t>=100);$('heatBeaker').classList.toggle('evaporating',t>20);$('heatExplain').textContent=t>=100?'Bei Normaldruck siedet reines Wasser bei etwa 100 °C. Weitere Energie wird zum Verdampfen benötigt; die Temperatur bleibt beim Sieden ungefähr gleich.':t>=70?'Wasser ist heiß geworden. An der Oberfläche verdunstet es auch schon vor dem Siedepunkt.':'Das Wasser ist flüssig. Es verdunstet auch schon bei Temperaturen unter 100 °C an der Oberfläche.';if(step>=20){stopHeat();complete('heating')}}
function heatStep(){state.heater.step=Math.min(20,state.heater.step+1);updateHeat()}
function stopHeat(){if(state.heater.timer){clearInterval(state.heater.timer);state.heater.timer=null}$('heatPlay').textContent='▶ Start'}
$('heatPlay').addEventListener('click',()=>{if(state.heater.timer){stopHeat();return}if(state.heater.step>=20)state.heater.step=0;state.heater.timer=setInterval(heatStep,450);$('heatPlay').textContent='⏸ Pause'});$('heatStep').addEventListener('click',()=>{stopHeat();heatStep()});$('heatReset').addEventListener('click',()=>{stopHeat();state.heater.step=0;updateHeat()});
$$('[data-heatanswer]').forEach(b=>b.addEventListener('click',()=>{const ok=b.dataset.heatanswer==='1';$$('[data-heatanswer]').forEach(x=>{x.classList.remove('correct','wrong');if(x.dataset.heatanswer==='1')x.classList.add('correct')});if(!ok)b.classList.add('wrong');feedback($('heatQuestionFeedback'),ok,ok?'Genau! Verdunstung ist unter üblichen Bedingungen auch deutlich unter 100 °C möglich.':'Nicht ganz. Ein nasses Tuch wird schon bei Raumtemperatur trocken: Wasser verdunstet also bereits unter 100 °C.');if(ok)complete('heating')}));
function updateFlame(){const blue=state.flame==='blue';$('flameYellow').style.opacity=blue?'0':'1';$('flameBlue').style.opacity=blue?'1':'0';$('flameInfo').innerHTML=blue?'<strong>Rauschende, blaue Flamme</strong>Bei größerer Luftzufuhr ist die Flamme blau, kaum leuchtend und heißer. Die heiße Zone liegt knapp oberhalb der Innenkegelspitze.':'<strong>Leuchtende, gelbe Flamme</strong>Bei geringer Luftzufuhr ist sie gelb, gut sichtbar und weniger heiß. Sie kann rußen.';feedback($('flameFeedback'),null,blue?'Wähle eine Flammenzone und vergleiche die Temperaturbereiche.':'Wähle zuerst die blaue, rauschende Flamme, um die Zonen zu untersuchen.')}
$$('[name="flamemode"]').forEach(r=>r.addEventListener('change',()=>{state.flame=r.value;updateFlame()}));
$$('[data-zone]').forEach(b=>b.addEventListener('click',()=>{if(state.flame!=='blue'){feedback($('flameFeedback'),false,'Stelle zuerst die virtuelle Flamme auf blau/rauschend um.');return}const txt={base:'Unten ist die Flamme nicht am heißesten. Die Temperatur unterscheidet sich je nach genauer Messposition.',core:'Im inneren blauen Kegel ist die Temperatur niedriger als im heißen Bereich außerhalb, knapp oberhalb seiner Spitze.',tip:'Richtig! Der besonders heiße Bereich befindet sich knapp oberhalb der Spitze des inneren blauen Kegels.'}[b.dataset.zone];const ok=b.dataset.zone==='tip';feedback($('flameFeedback'),ok,txt);if(ok)complete('burner')}));
$('burnerCheck').addEventListener('click',()=>{const boxes=$$('#burnerChecks input');let ok=boxes.every(x=>x.checked===(x.dataset.safe==='true'));feedback($('burnerCheckFeedback'),ok,ok?'Ausgezeichnet! Alle Sicherheitsregeln sind richtig ausgewählt.': 'Prüfe deine Auswahl: Welche Regeln verhindern Unfälle? Ein brennender Brenner darf nie unbeaufsichtigt sein und heiße Geräte darfst du nicht mit bloßer Hand anfassen.');if(ok)complete('burner')});
const stages=[['Fragestellung und Hypothese','Was vermuten wir und warum?'],['Material und Durchführung','Wie wird der Versuch sicher aufgebaut und durchgeführt?'],['Beobachtung','Was ist tatsächlich zu sehen oder zu messen?'],['Auswertung','Was bedeuten die Ergebnisse?']];
function renderMethodSteps(){$('methodSteps').innerHTML=shuffle(stages.map((x,i)=>i)).filter(i=>!state.method.selected.includes(i)).map(i=>`<button class="chip" data-stage="${i}">${stages[i][0]}</button>`).join('');$('methodSelected').innerHTML=state.method.selected.map((i,n)=>`<div class="step-item"><span class="stepno">${n+1}</span><div><strong>${stages[i][0]}</strong><div class="small muted">${stages[i][1]}</div></div></div>`).join('');$$('[data-stage]').forEach(b=>b.addEventListener('click',()=>{let i=+b.dataset.stage;if(i===state.method.selected.length){state.method.selected.push(i);renderMethodSteps();feedback($('methodFeedback'),true,state.method.selected.length===4?'Gut! Du hast den Ablauf richtig geordnet.':'Richtig, weiter mit Schritt '+(state.method.selected.length+1)+'.');if(state.method.selected.length===4)complete('method')}else feedback($('methodFeedback'),false,`Dieser Schritt kommt noch nicht. Überlege: Was muss man zuerst wissen, bevor man etwas beobachtet?`)}))}
$('methodReset').addEventListener('click',()=>{state.method.selected=[];renderMethodSteps();feedback($('methodFeedback'),null,'Beginne mit der Frage und Vermutung.')});
const methodCases=[
 ['Vor dem Versuch vermute ich: Bei 20 °C lässt sich in 100 ml Wasser mehr Zucker als Kochsalz lösen.','Hypothese','Das ist eine überprüfbare Erwartung. Für einen fairen Vergleich bleiben Wassermenge und Temperatur gleich.'],
 ['Das Thermometer zeigt nach zwei Minuten 45 °C an.','Beobachtung','Der abgelesene Messwert beschreibt direkt, was gemessen wurde.'],
 ['Die Zuckerkristalle sind nach dem Rühren nicht mehr sichtbar.','Beobachtung','Hier wird beschrieben, was tatsächlich zu sehen ist – noch nicht warum es so ist.'],
 ['Ich vermute, dass sich in 100 ml Wasser bei 60 °C mehr Zucker lösen lässt als bei 20 °C.','Hypothese','Die Aussage sagt ein überprüfbares Ergebnis voraus. Die Wassermenge bleibt in beiden Ansätzen gleich.'],
 ['Bei je 100 ml Wasser löste sich bei 60 °C sichtbar mehr Zucker als bei 20 °C.','Beobachtung','Das ist ein protokollierter Vergleich bei gleicher Wassermenge.'],
 ['Die Ergebnisse stützen die Vermutung, dass sich Zucker in warmem Wasser besser löst.','Auswertung','Hier werden Beobachtungen mit der vorherigen Vermutung verglichen.'],
 ['Im Glas bleibt ein weißer Bodensatz sichtbar.','Beobachtung','Das kann man direkt sehen.'],
 ['Die Lösung ist vermutlich gesättigt, weil trotz weiterem Rühren Kristalle am Boden bleiben.','Auswertung','Du deutest den Bodensatz. Die Bedingungen und ausreichende Rührzeit müssen dabei berücksichtigt werden.'],
 ['Der Vergleich ist nicht fair, weil in den beiden Gläsern unterschiedlich viel Wasser war.','Auswertung','Das ist eine begründete Beurteilung des Versuchsaufbaus, keine direkte Beobachtung.']
];
function renderMethodQuestion(){const m=state.method;if(m.q>=methodCases.length){$('methodQuestion').textContent='Du bist ein echter Forscher!';$$('[data-method-answer]').forEach(b=>b.disabled=true);$('methodNext').disabled=true;feedback($('methodAnswerFeedback'),true,'Alle neun Beispiele bearbeitet. Du kannst Vermutungen, Beobachtungen und Auswertungen unterscheiden.');complete('method');return}const q=methodCases[m.q];$('methodQuestion').textContent=q[0];m.answered=false;$$('[data-method-answer]').forEach(b=>{b.disabled=false;b.classList.remove('correct','wrong')});feedback($('methodAnswerFeedback'),null,`Beispiel ${m.q+1} von ${methodCases.length}: Was beschreibt die Aussage?`);$('methodNext').disabled=true}
$$('[data-method-answer]').forEach(b=>b.addEventListener('click',()=>{const m=state.method;if(m.answered)return;const q=methodCases[m.q],ok=b.dataset.methodAnswer===q[1];m.answered=true;b.classList.add(ok?'correct':'wrong');$$('[data-method-answer]').forEach(x=>{x.disabled=true;if(x.dataset.methodAnswer===q[1])x.classList.add('correct')});feedback($('methodAnswerFeedback'),ok,(ok?'Richtig! ':'Die richtige Kategorie ist '+q[1]+'. ')+q[2]);$('methodNext').disabled=false}));$('methodNext').addEventListener('click',()=>{state.method.q++;renderMethodQuestion()});
const thermalQuiz=[
 {
  "topic": "Wärmeleitfähigkeit",
  "q": "In welche Richtung wird Energie bei Wärmeleitung von selbst übertragen?",
  "options": [
   "Vom wärmeren zum kälteren Bereich",
   "Immer vom kälteren zum wärmeren Bereich",
   "Nur von oben nach unten",
   "Es wird dabei keine Energie übertragen"
  ],
  "correct": 0,
  "ex": "Bei einem Temperaturunterschied wird Energie durch Wärmeleitung vom wärmeren zum kälteren Bereich übertragen.",
  "hint": "Vergleiche einen warmen Topfboden mit dem noch kühleren Topfinhalt."
 },
 {
  "topic": "Wärmeleitfähigkeit",
  "q": "Welches Material leitet Wärme im Allgemeinen besonders gut?",
  "options": [
   "Trockenes Holz",
   "Kupfer",
   "Ein typischer Kunststoffgriff",
   "Eine Schicht ruhender Luft"
  ],
  "correct": 1,
  "ex": "Kupfer ist ein Metall und ein guter Wärmeleiter. Trockenes Holz, viele Kunststoffe und ruhende Luft leiten deutlich schlechter.",
  "hint": "Welche Materialgruppe wird häufig für Topfböden verwendet?"
 },
 {
  "topic": "Wärmeleitfähigkeit",
  "q": "Metall und Holz liegen lange im selben Raum und haben beide 20 °C. Warum fühlt sich Metall oft kälter an?",
  "options": [
   "Metall hat dann immer eine niedrigere Temperatur",
   "Holz erzeugt eigene Wärme",
   "Metall führt Energie schneller von der wärmeren Hand weg",
   "Die Hand misst die Temperatur ganz genau"
  ],
  "correct": 2,
  "ex": "Beide haben hier dieselbe Temperatur. Metall leitet Energie schneller von der wärmeren Hand ab. Deshalb ist das Wärmegefühl verschieden.",
  "hint": "Deine Hand ist wärmer als die beiden Gegenstände. Wohin gelangt Energie aus der Hand?"
 },
 {
  "topic": "Wärmeleitfähigkeit",
  "q": "Was hältst du beim fairen Vergleich zweier Materialstäbe gleich?",
  "options": [
   "Nur ihre Farbe",
   "Nur ihren Namen",
   "Alle Eigenschaften außer der Farbe",
   "Länge, Dicke, Anfangstemperatur und Erwärmung; gleiche Beobachtungsdauer"
  ],
  "correct": 3,
  "ex": "Nur das Material soll gezielt verschieden sein. Gleiche Abmessungen, Ausgangsbedingungen und Beobachtungsdauer machen den Vergleich aussagekräftiger.",
  "hint": "Prüfe, ob ein kürzerer oder dickerer Stab den Vergleich verfälschen könnte."
 },
 {
  "topic": "Wärmeleitfähigkeit",
  "q": "Warum werden Topfgriffe oft aus Holz oder dafür geeignetem Kunststoff gefertigt?",
  "options": [
   "Diese Materialien leiten Wärme schlechter als Metall",
   "Diese Materialien bleiben unter allen Bedingungen kalt",
   "Sie sind die besten Wärmeleiter",
   "Sie senken immer den Siedepunkt von Wasser"
  ],
  "correct": 0,
  "ex": "Schlechte Wärmeleiter verringern die Energieübertragung zur Hand. Trotzdem können solche Griffe heiß werden; sie sind keine Garantie gegen Verbrennungen."
 },
 {
  "topic": "Wärmeleitfähigkeit",
  "q": "Was bedeutet „schlechter Wärmeleiter“?",
  "options": [
   "Das Material kann niemals warm werden",
   "Es gibt Wärme unter vergleichbaren Bedingungen schlechter weiter",
   "Es ist immer kälter als Metall",
   "Es lässt keinen elektrischen Strom durch und ist deshalb kalt"
  ],
  "correct": 1,
  "ex": "Wärmedämmende Materialien geben Wärme schlechter weiter. Das bedeutet weder, dass sie immer kalt bleiben, noch, dass gar keine Energie durch sie gelangt."
 },
 {
  "topic": "Wärmeleitfähigkeit",
  "q": "Braucht Wärmeleitung einen angeschlossenen elektrischen Stromkreis?",
  "options": [
   "Ja, immer eine Batterie",
   "Ja, immer eine Steckdose",
   "Nein; für Wärmeleitung ist ein Temperaturunterschied entscheidend",
   "Nein, aber beide Bereiche müssen gleich warm sein"
  ],
  "correct": 2,
  "ex": "Wärmeleitfähigkeit und elektrische Leitfähigkeit sind verschiedene Stoffeigenschaften. Wärme kann ohne angeschlossenen Stromkreis übertragen werden."
 },
 {
  "topic": "Wärmeleitfähigkeit",
  "q": "Wie prüfst du die Temperatur eines möglicherweise heißen Metallstabs sicher?",
  "options": [
   "Mit der bloßen Hand",
   "Kurz mit dem Finger antippen",
   "Mit der Zunge",
   "Mit geeigneter Messtechnik nach Anleitung der Lehrkraft"
  ],
  "correct": 3,
  "ex": "Heiße Materialien niemals durch Anfassen prüfen. Reale Wärmeversuche und Messungen erfolgen nur nach Anleitung und unter Aufsicht der Lehrkraft."
 },
 {
  "topic": "Wärmeleitfähigkeit",
  "q": "Welcher der beiden typischen Stäbe leitet Wärme besser: Metall oder Glas?",
  "options": [
   "Der Metallstab",
   "Der Glasstab immer",
   "Beide grundsätzlich gleich",
   "Das hängt nur von der Farbe ab"
  ],
  "correct": 0,
  "ex": "Typische Metalle leiten Wärme deutlich besser als Glas. Glas ist ein schlechterer Wärmeleiter, kann aber trotzdem heiß werden."
 },
 {
  "topic": "Wärmeleitfähigkeit",
  "q": "Welche Aussage gehört in die Beobachtung eines Wärmeleitversuchs?",
  "options": [
   "Metall leitet die Wärme besser.",
   "Das zunächst feste Wachs wird flüssig.",
   "Energie wird durch das Metall übertragen.",
   "Die Verfärbung beweist eine hohe Wärmeleitfähigkeit."
  ],
  "correct": 1,
  "ex": "Dass Wachs flüssig wird, ist sichtbar. Die Erklärung durch Wärmeleitung gehört zur Auswertung. Eine Verfärbung allein beweist die Wärmeleitfähigkeit nicht."
 },
 {
  "topic": "Wärmeleitfähigkeit",
  "q": "Warum muss das Wachs vor einem Schmelzvergleich an beiden Stäben zunächst fest sein?",
  "options": [
   "Weil festes Wachs immer kalt bleibt",
   "Damit die Metallfarbe besser sichtbar wird",
   "Schon flüssiges Wachs kann erneutes Schmelzen nicht anzeigen",
   "Weil Glas grundsätzlich nicht warm werden kann"
  ],
  "correct": 2,
  "ex": "Um den Beginn des Schmelzens zu vergleichen, braucht man denselben festen Anfangszustand. Bereits flüssiges Wachs belegt allein keine erneute Erwärmung."
 }
];
const quizBank=[...thermalQuiz,
{topic:'Stoffe & Körper',q:'Was ist eine Fensterscheibe?',options:['Ein Körper aus einem Stoff','Ein chemisches Element','Ein Stoff, der überall gleich aussieht','Eine Gasart'],correct:0,ex:'Die Scheibe ist ein Gegenstand (Körper), der überwiegend aus Glas besteht.'},
{topic:'Stoffe & Körper',q:'Welches Beispiel ist ein Stoff?',options:['Goldring','Kaffeetasse','Kupfer','Nagel'],correct:2,ex:'Kupfer ist ein Stoff; Ring, Tasse und Nagel sind Körper.'},
{topic:'Stoffe & Körper',q:'Was ist Luft?',options:['Ein einziges chemisches Element','Ein Gasgemisch','Ein fester Körper','Reines Wasser'],correct:1,ex:'Luft ist ein Stoffgemisch aus vor allem Stickstoff und Sauerstoff.'},
{topic:'Stoffe & Körper',q:'Ein Regentropfen besteht aus ...',options:['Wasser','Glas','Aluminium','Gold'],correct:0,ex:'Ein Tropfen ist ein Körper, Wasser sein Stoff.'},
{topic:'Laborgeräte',q:'Womit misst man ein Flüssigkeitsvolumen?',options:['Messzylinder','Dreifuß','Uhrglas','Tiegelzange'],correct:0,ex:'Der Messzylinder hat eine Skala zum Abmessen des Volumens.'},
{topic:'Laborgeräte',q:'Wozu dient eine Reibschale mit Pistill?',options:['Zum Erhitzen von Gas','Zum Zerreiben fester Stoffe','Zum Messen von Zeit','Zum Ablesen der Temperatur'],correct:1,ex:'Mit dem Pistill werden Feststoffe in der Reibschale zerkleinert.'},
{topic:'Laborgeräte',q:'Wozu dient ein Glasstab?',options:['Zum Rühren','Zum Greifen heißer Tiegel','Zum Temperaturmessen','Zum Tragen des Dreifußes'],correct:0,ex:'Ein Glasstab wird unter anderem zum Umrühren verwendet.'},
{topic:'Laborgeräte',q:'Welche Kombination gehört zu einem einfachen Heizaufbau?',options:['Dreifuß und Drahtnetz','Reibschale und Pistill','Messzylinder und Pipette','Uhrglas und Trichter'],correct:0,ex:'Das Drahtnetz kann auf einem Dreifuß liegen und die Wärme verteilen.'},
{topic:'Sicherheit',q:'Wie führt man eine erlaubte Geruchsprobe durch?',options:['Direkt am Gefäß einatmen','Vorsichtig mit der Hand zufächeln','Stoff probieren','Gefäß unter die Nase stellen'],correct:1,ex:'Nur mit Erlaubnis: Dämpfe vorsichtig zufächeln, nicht direkt einatmen.'},
{topic:'Sicherheit',q:'Was ist bei einem unbeaufsichtigten Brenner richtig?',options:['Einfach weiterarbeiten','Sofort die Lehrkraft verständigen','Mehr Gas aufdrehen','Das Gerät in die Hand nehmen'],correct:1,ex:'Ein Gasbrenner darf nicht unbeaufsichtigt sein. Sofort die Lehrkraft informieren.'},
{topic:'Sicherheit',q:'Wohin mit Schultaschen im Chemieraum?',options:['In den Laufweg','An einen vorgesehenen sicheren Platz','Unter die Flamme','Auf den Experimentiertisch'],correct:1,ex:'Taschen dürfen keine Stolperfallen verursachen.'},
{topic:'Löslichkeit',q:'Welche Stoffmenge löst sich bei ca. 20 °C in 200 ml Wasser ungefähr?',options:['72 g Salz','400 g Salz','5 g Zucker','Nur 17 g Zucker'],correct:0,ex:'Bei etwa 20 °C lösen sich ungefähr 72 g Kochsalz in 200 ml Wasser.'},
{topic:'Löslichkeit',q:'Was bedeutet „gesättigte Lösung“?',options:['Sie muss blau sein','Es kann unter den Bedingungen kein weiterer Stoff gelöst werden','Sie ist besonders warm','Sie enthält gar keinen Stoff'],correct:1,ex:'Wird unter denselben Bedingungen mehr Stoff zugegeben, bleibt ein Rest ungelöst.'},
{topic:'Löslichkeit',q:'Warum sind Löffelspitzen keine exakten Mengenangaben?',options:['Jede Löffelspitze wiegt genau ein Gramm','Die Masse hängt von Löffel, Stoff und Füllung ab','Es darf kein Zucker verwendet werden','Löffel sind zu kalt'],correct:1,ex:'Für vergleichbare Ergebnisse wird die Stoffmenge gewogen.'},
{topic:'Löslichkeit',q:'Was sollte beim Vergleich von Salz und Zucker gleich sein?',options:['Nur die Farbe der Gläser','Wassermenge und Temperatur','Nur der Stoffname','Nichts'],correct:1,ex:'Für einen fairen Vergleich hält man Wasserportion und Temperatur gleich.'},
{topic:'Siedetemperatur',q:'Bei normalem Luftdruck siedet reines Wasser bei ungefähr ...',options:['20 °C','78 °C','100 °C','200 °C'],correct:2,ex:'Der Siedepunkt von Wasser liegt bei Normaldruck bei etwa 100 °C.'},
{topic:'Siedetemperatur',q:'Kann Wasser auch bei 25 °C verdunsten?',options:['Ja','Nein','Nur mit Salz','Nur in einem Reagenzglas'],correct:0,ex:'Verdunstung ist bereits bei Temperaturen unter dem Siedepunkt möglich.'},
{topic:'Siedetemperatur',q:'Auf welcher Achse steht bei einer Heizkurve die Temperatur?',options:['Auf der senkrechten y-Achse','Auf der waagerechten x-Achse','Auf keiner','Immer in einer Tabelle'],correct:0,ex:'Die Zeit liegt auf der x-Achse und die Temperatur auf der y-Achse.'},
{topic:'Siedetemperatur',q:'Warum bleibt die Temperatur beim Sieden ungefähr konstant?',options:['Weil keine Wärme mehr zugeführt wird','Energie wird zum Verdampfen benötigt','Weil das Thermometer defekt sein muss','Weil alles Eis wird'],correct:1,ex:'Die zugeführte Energie wird für den Phasenübergang benötigt.'},
{topic:'Gasbrenner',q:'Welche Flamme ist in der Regel heißer?',options:['Gelbe, leuchtende','Blaue, rauschende','Beide immer gleich heiß','Keine von beiden'],correct:1,ex:'Bei größerer Luftzufuhr entsteht eine meist heißere, rauschende blaue Flamme.'},
{topic:'Gasbrenner',q:'Wo liegt eine besonders heiße Zone der blauen Brennerflamme?',options:['Ganz unten am Brennerfuß','Knapp oberhalb der inneren Kegelspitze','Im dunklen innersten Bereich','Neben dem Brenner'],correct:1,ex:'Eine besonders heiße Zone befindet sich knapp oberhalb der Innenkegelspitze.'},
{topic:'Gasbrenner',q:'Wer darf den Gasbrenner in der Schule freigeben?',options:['Jeder Mitschüler','Die Lehrkraft','Ein Besucher','Niemand'],correct:1,ex:'Experimentieren mit Brenner nur nach Freigabe und unter Aufsicht der Lehrkraft.'},
{topic:'Experimente',q:'Was ist eine Beobachtung?',options:['Ein direkt gemessener oder gesehener Sachverhalt','Eine Vermutung über den Grund','Die abschließende Meinung','Immer ein Diagramm'],correct:0,ex:'Beobachtungen beschreiben Wahrnehmungen und Messungen ohne Deutung.'},
{topic:'Experimente',q:'Welcher Satz ist eine Auswertung?',options:['Ich sehe weißen Bodensatz.','Das Thermometer zeigt 90 °C.','Die Lösung scheint gesättigt zu sein.','Das Glas hat einen Sprung.'],correct:2,ex:'„Scheint gesättigt zu sein“ deutet die Beobachtung.'},

{topic:'Stoffe & Körper',q:'Welche Aussage zu einem Plastikbecher stimmt?',options:['Der Körper ist der Becher, sein Stoff ist Kunststoff.','Kunststoff ist immer ein Metall.','Ein Becher kann nur aus einem Stoff bestehen.','Ein Becher ist kein Körper.'],correct:0,ex:'Ein Körper ist der konkrete Gegenstand; Kunststoff bezeichnet sein Material.'},
{topic:'Stoffe & Körper',q:'Warum kann man einen Stoff oft an Eigenschaften erkennen?',options:['Weil die Größe eines Gegenstands immer gleich bleibt','Weil Stoffe typische Eigenschaften wie Löslichkeit und Schmelztemperatur besitzen','Weil alle Stoffe gleich schwer sind','Weil jede Oberfläche glänzt'],correct:1,ex:'Stoffeigenschaften helfen beim Unterscheiden und Bestimmen von Stoffen.'},
{topic:'Laborgeräte',q:'Welches Gerät ist zum genauen Abmessen von 50 ml Wasser besser geeignet?',options:['Messzylinder','Becherglas mit grober Skala','Dreifuß','Reibschale'],correct:0,ex:'Ein Messzylinder ist für das Abmessen von Flüssigkeitsvolumen ausgelegt.'},
{topic:'Laborgeräte',q:'Wofür benutzt man ein Uhrglas?',options:['Zum Abdecken oder Bereitstellen kleiner Stoffproben','Zum Abwiegen großer Möbel','Zum Stoppen der Zeit','Als Brenneraufsatz'],correct:0,ex:'Ein Uhrglas ist eine flache Glasschale, etwa für kleine Proben.'},
{topic:'Sicherheit',q:'Was tust du, wenn du eine unbekannte Flüssigkeit verschüttest?',options:['Sofort die Lehrkraft informieren','Mit bloßen Händen aufwischen','Aus Neugier probieren','Einfach weiterarbeiten'],correct:0,ex:'Die Lehrkraft entscheidet, wie die Flüssigkeit sicher beseitigt wird.'},
{topic:'Sicherheit',q:'Eine Flasche mit Chemikalien steht offen. Was ist richtig?',options:['Nicht selbst riechen oder probieren; Lehrkraft informieren','Direkt die Nase darüber halten','In eine Trinkflasche umfüllen','In der Klasse herumreichen'],correct:0,ex:'Unbekannte Stoffe werden nicht selbst untersucht. Die Lehrkraft übernimmt.'},
{topic:'Löslichkeit',q:'Bei 20 °C sind 80 g Salz zu 200 ml Wasser gegeben worden. Was ist im Modell zu erwarten?',options:['Ungefähr 8 g bleiben ungelöst.','Alles bleibt immer ungelöst.','Es lösen sich genau 80 g.','Das Wasser gefriert.'],correct:0,ex:'In 200 ml Wasser lösen sich bei etwa 20 °C rund 72 g Kochsalz. Etwa 8 g bleiben zurück.'},
{topic:'Löslichkeit',q:'Was muss bei einem fairen Löslichkeitsvergleich möglichst gleich sein?',options:['Wassermenge und Temperatur','Die Farbe des Löffels','Die Namen der Stoffe','Die Größe der Tafel'],correct:0,ex:'Nur mit kontrollierten Bedingungen lassen sich Stoffe zuverlässig vergleichen.'},
{topic:'Siedetemperatur',q:'Was beschreibt der waagerechte Abschnitt einer idealen Heizkurve beim Sieden?',options:['Die Temperatur bleibt ungefähr gleich.','Das Wasser wird sofort fest.','Das Thermometer misst Sekunden.','Die Energiezufuhr muss stoppen.'],correct:0,ex:'Beim Sieden wird Energie für den Übergang in den gasförmigen Zustand verwendet.'},
{topic:'Siedetemperatur',q:'Ein Temperaturdiagramm erreicht nur 85 °C. Welcher Schluss ist sicher?',options:['Man muss Stoff und Messbedingungen prüfen.','Reines Wasser siedet immer bei 85 °C.','Alle Thermometer sind kaputt.','Der Luftdruck spielt nie eine Rolle.'],correct:0,ex:'Ohne Informationen über Stoff, Druck und Messung darf man den Siedepunkt nicht sicher bestimmen.'},
{topic:'Gasbrenner',q:'Warum sind offene Haare an einer Flamme gefährlich?',options:['Sie können Feuer fangen.','Sie ändern die Temperaturanzeige.','Sie machen das Wasser salzig.','Sie schmelzen das Becherglas sofort.'],correct:0,ex:'Lange Haare müssen beim Arbeiten mit offenen Flammen sicher zusammengebunden sein.'},
{topic:'Gasbrenner',q:'Welche Aussage über die gelbe Brennerflamme ist richtig?',options:['Sie ist gut sichtbar und kann rußen.','Sie ist immer die heißeste Zone.','Sie enthält kein Gas.','Sie ist bei jedem Brenner blau.'],correct:0,ex:'Die gelbe leuchtende Flamme kann durch unvollständigere Verbrennung rußen.'},
{topic:'Experimente',q:'„Das Thermometer zeigt 80 °C an.“ ist ...',options:['eine Beobachtung','eine Hypothese','eine Auswertung','ein Material'],correct:0,ex:'Abgelesene Messwerte werden als Beobachtung notiert.'},
{topic:'Experimente',q:'Was gehört in eine Hypothese?',options:['Eine begründete Vermutung','Nur ein Messwert','Die Unterschrift','Die Reihenfolge der Tische'],correct:0,ex:'Eine Hypothese ist eine Vermutung, die sich mit einem Versuch überprüfen lässt.'},

{topic:'Stoffe & Körper',q:'Welche Angabe beschreibt eine Stoffeigenschaft?',options:['Löslichkeit in Wasser','Position auf dem Tisch','Name der Besitzerin','Anzahl der Hausaufgaben'],correct:0,ex:'Die Löslichkeit ist eine charakteristische Eigenschaft von Stoffen.'},
{topic:'Stoffe & Körper',q:'Welche Aussage über einen Löffel ist richtig?',options:['Er kann aus verschiedenen Stoffen bestehen.','Er besteht immer aus Gold.','Er ist grundsätzlich kein Körper.','Seine Farbe beweist die Zusammensetzung.'],correct:0,ex:'Dasselbe Körpermodell kann aus Metall, Kunststoff oder Holz gefertigt werden.'},
{topic:'Laborgeräte',q:'Du willst ein Gemisch durch Filterpapier trennen. Was brauchst du?',options:['Einen Trichter mit Filterpapier','Nur einen Dreifuß','Eine Schutzbrille als Sieb','Einen Brenner mit Flamme'],correct:0,ex:'Ein Trichter trägt das Filterpapier; Filtrat und Rückstand werden so getrennt.'},
{topic:'Laborgeräte',q:'Wofür dient der Reagenzglasständer?',options:['Zum sicheren Abstellen von Reagenzgläsern','Zum Erhitzen des Klassenzimmers','Zum genauen Wiegen','Zum Ausgießen von Chemikalien auf den Boden'],correct:0,ex:'Der Ständer verhindert, dass Reagenzgläser ungeordnet herumliegen oder umkippen.'},
{topic:'Sicherheit',q:'Wann darfst du eine Geruchsprobe machen?',options:['Nur nach ausdrücklicher Erlaubnis und nach Anweisung','Immer bei unbekannten Flüssigkeiten','Wenn niemand zuschaut','Indem du tief aus der Flasche einatmest'],correct:0,ex:'Geruchsproben sind nicht automatisch sicher; nur die Lehrkraft entscheidet, ob und wie sie erlaubt sind.'},
{topic:'Sicherheit',q:'Was machst du bei einem Unfall im Chemieraum?',options:['Sofort die Lehrkraft verständigen','Erst ein Foto machen','Die Gefahrenstelle verstecken','Den Versuch heimlich wiederholen'],correct:0,ex:'Eine schnelle Meldung ermöglicht geeignete Schutz- und Erste-Hilfe-Maßnahmen.'},
{topic:'Sicherheit',q:'Wie verhältst du dich bei langen Haaren im Experiment?',options:['Sicher zusammenbinden','Vor der Flamme ausschütteln','Über das Gefäß hängen lassen','Mit einem Glasstab aufwickeln'],correct:0,ex:'Zusammengebundene Haare verringern die Gefahr, mit Flammen oder Stoffen in Berührung zu kommen.'},
{topic:'Löslichkeit',q:'Was ist das Lösungsmittel beim Salz-in-Wasser-Versuch?',options:['Wasser','Salz','Der Messzylinder','Das Glas'],correct:0,ex:'Wasser ist hier das Lösungsmittel; das Salz ist der gelöste Stoff.'},
{topic:'Löslichkeit',q:'Warum muss man warten und umrühren, bevor man Sättigung feststellt?',options:['Weil sich ein Stoff nicht immer sofort vollständig löst','Weil jede Lösung blau werden muss','Weil die Löffelzahl sonst kleiner ist','Damit das Glas zerbricht'],correct:0,ex:'Beim Lösen braucht der Vorgang etwas Zeit; ungelöste Reste allein beweisen bei kurzem Warten noch keine Sättigung.'},
{topic:'Siedetemperatur',q:'Was bewirkt der Luftdruck bei der Siedetemperatur?',options:['Bei geringerem Außendruck kann Wasser bei niedrigerer Temperatur sieden.','Er hat nie einen Einfluss.','Wasser siedet immer bei 200 °C.','Er macht Wasser zu Metall.'],correct:0,ex:'Die Siedetemperatur hängt vom Außendruck ab; die 100 °C gelten ungefähr bei Normaldruck.'},
{topic:'Siedetemperatur',q:'Welche Aussage beschreibt Sieden?',options:['Im Inneren bilden sich Dampfblasen.','Nur außen wird das Wasser farbig.','Jedes Wasser wird sofort fest.','Es wird kein Wasserdampf gebildet.'],correct:0,ex:'Beim Sieden bilden sich Dampfblasen innerhalb der Flüssigkeit.'},
{topic:'Gasbrenner',q:'Was machst du, wenn du im Unterricht Gasgeruch bemerkst?',options:['Lehrkraft sofort informieren und Anweisungen folgen','Ein Streichholz entzünden','Den Gasbrenner ausprobieren','Den Geruch ignorieren'],correct:0,ex:'Bei Gasgeruch darf keine Zündquelle betätigt werden; sofort die Lehrkraft verständigen.'},
{topic:'Gasbrenner',q:'Wofür ist beim Gasbrenner die Luftregulierung wichtig?',options:['Sie beeinflusst die Flammenart.','Sie dient als Uhr.','Sie wiegt Chemikalien.','Sie misst die Wassermenge.'],correct:0,ex:'Die Luftzufuhr beeinflusst die Verbrennung und damit die Farbe und Temperatur der Flamme.'},
{topic:'Gasbrenner',q:'Was gilt beim Hantieren mit erwärmten Laborgeräten?',options:['Vorsicht, geeignete Halter und Anweisungen beachten.','Mit der bloßen Hand die Wärme prüfen.','Schnell nach Mitschülern werfen.','Heißes Glas sieht immer rot aus.'],correct:0,ex:'Heißes Glas kann wie kaltes aussehen. Geeignete Hilfsmittel und Aufsicht sind erforderlich.'},
{topic:'Experimente',q:'Was kommt in den Abschnitt „Material“?',options:['Benötigte Geräte und Stoffe','Nur eine Meinung','Die Note im Zeugnis','Eine fertige Schlussfolgerung'],correct:0,ex:'Zur Materialliste gehören die benötigten Geräte und Stoffe.'},
{topic:'Experimente',q:'Was soll eine Skizze vom Versuchsaufbau zeigen?',options:['Anordnung der wichtigen Geräte','Nur die Überschrift','Ein beliebiges Kunstbild','Die Zeugnisnote'],correct:0,ex:'Eine gute Skizze zeigt die wesentlichen Geräte und ihre Anordnung übersichtlich.'},
{topic:'Experimente',q:'Was muss in die Auswertung?',options:['Eine begründete Deutung der Beobachtung','Nur eine Gerätezeichnung','Ein erfundener Messwert','Die Reihenfolge im Stundenplan'],correct:0,ex:'Die Auswertung beantwortet die Fragestellung mit Bezug auf Beobachtungen und Messungen.'},
{topic:'Experimente',q:'Welcher Satz ist eine Hypothese?',options:['Ich vermute, Zucker löst sich besser als Salz.','Ich habe 200 ml gemessen.','Das Glas steht auf dem Tisch.','Es blieb weißer Bodensatz.'],correct:0,ex:'Eine Hypothese ist eine überprüfbare Vermutung; eine Begründung verbessert sie.'},
];
function startQuiz(mode='new'){
 const topic=$('quizTopic').value,desired=Number($('quizLength').value);
 let pool=quizBank.filter(q=>topic==='Alle'||q.topic===topic),selected=[];
 if(mode==='missed'&&state.quizErrors.length){pool=state.quizErrors.slice();}
 if(mode!=='missed'&&topic==='Alle'){
  const byTopic={};pool.forEach(q=>(byTopic[q.topic]??=[]).push(q));
  Object.values(byTopic).forEach(arr=>selected.push(...shuffle(arr).slice(0,1)));
 }
 selected=shuffle([...selected,...shuffle(pool.filter(q=>!selected.includes(q))).slice(0,Math.max(0,desired-selected.length))]);
 if(mode==='missed')selected=shuffle(pool);
 state.quiz={questions:selected,i:0,score:0,answered:false,records:[],mode};$('examPanel').hidden=false;$('quizEnd').hidden=true;renderQuiz();
}
function renderQuiz(){
 const s=state.quiz;if(s.i>=s.questions.length){finishQuiz();return}const q=s.questions[s.i],total=s.questions.length;
 $('quizStep').textContent=`Frage ${s.i+1} von ${total} · ${q.topic}`;$('quizScore').textContent=`${s.score} Punkte`;$('quizProgress').style.width=(s.i/total*100)+'%';
 const displayed=shuffle(q.options.map((op,i)=>({op,i})));$('quizQuestion').textContent=q.q;$('quizOptions').innerHTML=displayed.map((o,position)=>`<button class="answer" data-qopt="${o.i}">${String.fromCharCode(65+position)}) ${o.op}</button>`).join('');
 $$('[data-qopt]').forEach(b=>b.addEventListener('click',()=>{
  if(s.answered)return;const ok=Number(b.dataset.qopt)===q.correct;s.answered=true;
  if(ok)s.score++;s.records.push({q,ok}); window.LernCockpit?.record({id:'chem-quiz-'+q.topic+':'+q.q,topic:({'Stoffe & Körper':'matter','Löslichkeit':'solubility','Wärmeleitfähigkeit':'thermal','Siedetemperatur':'heating','Laborgeräte':'devices','Sicherheit':'safety','Gasbrenner':'burner'})[q.topic]||String(q.topic).toLowerCase(),correct:ok,assisted:false,mode:s.mode||'wissenscheck',skill:'wissen'});
  $$('[data-qopt]').forEach(opt=>{opt.disabled=true;if(Number(opt.dataset.qopt)===q.correct)opt.classList.add('correct');else if(opt===b)opt.classList.add('wrong')});
  feedback($('quizFeedback'),ok,(ok?'Richtig! ':'Noch nicht. ')+q.ex);
  $('quizScore').textContent=`${s.score} Punkte`;$('quizNext').disabled=false;
 }));
 $('quizNext').textContent=s.i===total-1?'Auswertung ansehen →':'Weiter →';$('quizNext').disabled=true;feedback($('quizFeedback'),null,'Welche Antwort ist richtig?');s.answered=false;
}
function finishQuiz(){
 const s=state.quiz,total=s.questions.length,percent=Math.round(s.score/total*100),passed=percent>=75;
 state.quizErrors=s.records.filter(x=>!x.ok).map(x=>x.q);$('quizMistakes').disabled=state.quizErrors.length===0;
 if(passed&&s.mode!=='missed')complete('quiz');$('examPanel').hidden=true;$('quizEnd').hidden=false;
 const topics=[...new Set(s.records.map(x=>x.q.topic))];
 const stats=topics.map(topic=>{let a=s.records.filter(r=>r.q.topic===topic),n=a.filter(r=>r.ok).length,p=Math.round(n/a.length*100);
  return `<article><strong>${topic}: ${n}/${a.length}</strong><div class="bar"><i style="width:${p}%"></i></div><p>${p<75?'Dieses Thema noch einmal üben.':'Bisher gut beantwortet.'}</p><button class="smallbtn" data-repeat-topic="${topic}">Thema üben →</button></article>`}).join('');
 const missed=s.records.filter(x=>!x.ok).map(x=>`<p>• <b>${x.q.topic}:</b> ${x.q.q}<br><span class="muted">${x.q.ex}</span></p>`).join('');
 $('quizEnd').innerHTML=`<div class="completion"><div class="big-emoji">${passed?'🏆':'🌱'}</div><h2>${passed?'Wissenscheck bestanden!':'Hier kannst du weiterlernen'}</h2><div class="end-score">${s.score} / ${total}</div><p>${percent} % richtig · Richtwert 75 % · eine Übung, keine Schulnote</p><h3>Ergebnisse nach Themen</h3><div class="diagnosis">${stats}</div>${missed?`<details class="hint" style="text-align:left"><summary>🔍 Erklärungen zu meinen Fehlern (${s.records.filter(x=>!x.ok).length})</summary>${missed}</details>`:''}<div class="btn-row" style="justify-content:center"><button class="btn primary" id="quizAgain">🔄 Neuer Test</button>${state.quizErrors.length?'<button class="btn" id="quizRetry">🎯 Meine Fehler wiederholen</button>':''}<button class="btn" id="quizToSheet">📖 Lernheft öffnen</button></div></div>`;
 $('quizAgain').addEventListener('click',()=>{startQuiz()});$('quizToSheet').addEventListener('click',()=>navigate('sheet'));
 if($('quizRetry'))$('quizRetry').addEventListener('click',()=>startQuiz('missed'));
 const topicPages={'Stoffe & Körper':'matter','Laborgeräte':'devices','Sicherheit':'safety','Löslichkeit':'solubility','Wärmeleitfähigkeit':'thermal','Siedetemperatur':'heating','Gasbrenner':'burner','Experimente':'method'};
 $$('[data-repeat-topic]').forEach(b=>b.addEventListener('click',()=>navigate(topicPages[b.dataset.repeatTopic])));
}
$('quizApply').addEventListener('click',()=>startQuiz());$('quizMistakes').addEventListener('click',()=>startQuiz('missed'));
$('quizNext').addEventListener('click',()=>{state.quiz.i++;renderQuiz()});$('quizRestart').addEventListener('click',startQuiz);$('printSheet').addEventListener('click',()=>window.print());

// Accessible matching game: tap a body, then the corresponding material.
const bodyMaterials=[['Fensterscheibe','Glas'],['Goldring','Gold'],['Regentropfen','Wasser'],['Zeitung','Papier'],['Eisennagel','Eisen'],['Luftblase','Luft'],['Holztür','Holz'],['Alufolie','Aluminium']];
let pairRightOrder=[],pairLeftOrder=[];
function renderPairs(){
 const st=state.pairs;
 $('pairCount').textContent=`${st.matched.size} / 8 Paare`;
 $('pairsLeft').innerHTML=pairLeftOrder.map(i=>`<button class="pair-choice ${st.left===i?'is-active':''} ${st.matched.has(i)?'is-matched':''}" data-pair-left="${i}" ${st.matched.has(i)?'disabled':''}>${bodyMaterials[i][0]} ${st.matched.has(i)?'✓':''}</button>`).join('');
 $('pairsRight').innerHTML=pairRightOrder.map(i=>`<button class="pair-choice ${st.right===i?'is-active':''} ${st.matched.has(i)?'is-matched':''}" data-pair-right="${i}" ${st.matched.has(i)?'disabled':''}>${bodyMaterials[i][1]} ${st.matched.has(i)?'✓':''}</button>`).join('');
 $$('[data-pair-left]').forEach(b=>b.addEventListener('click',()=>{st.left=+b.dataset.pairLeft;renderPairs();checkPairs()}));
 $$('[data-pair-right]').forEach(b=>b.addEventListener('click',()=>{st.right=+b.dataset.pairRight;renderPairs();checkPairs()}));
}
function checkPairs(){let st=state.pairs;if(st.left===null||st.right===null)return;
 const correct=st.left===st.right;if(correct){st.matched.add(st.left);feedback($('pairFeedback'),true,`${bodyMaterials[st.left][0]} besteht überwiegend aus ${bodyMaterials[st.left][1]}. ${st.matched.size===8?'Alle Paare gefunden!':'Weiter so!'} `);if(st.matched.size===8)complete('matter');}
 else feedback($('pairFeedback'),false,`${bodyMaterials[st.left][0]} passt hier nicht zu ${bodyMaterials[st.right][1]}. Überlege: Aus welchem Material besteht dieser Körper?`);
 st.left=null;st.right=null;renderPairs();
}
function resetPairs(){state.pairs={left:null,right:null,matched:new Set()};pairLeftOrder=shuffle(bodyMaterials.map((x,i)=>i));pairRightOrder=shuffle(bodyMaterials.map((x,i)=>i));renderPairs();feedback($('pairFeedback'),null,'Wähle zunächst einen Körper.');}
$('pairRestart').addEventListener('click',resetPairs);
// Two explicitly illustrative temperature curves, with a scrubber to read values.
const comparisonTemp=(kind,i)=>kind==='A'?Math.min(100,20+i*10):Math.min(85,20+i*8.125);
function initCompare(){const x=i=>64+i*51.5,y=t=>287-t*2.19;let g='';
 for(let t=0;t<=120;t+=20)g+=`<line x1="64" x2="583" y1="${y(t)}" y2="${y(t)}" class="gridline"/><text x="24" y="${y(t)+4}">${t}</text>`;
 for(let i=0;i<=10;i+=2)g+=`<line x1="${x(i)}" x2="${x(i)}" y1="24" y2="287" class="gridline"/><text x="${x(i)-7}" y="309">${i*60}</text>`;
 g+='<path class="axis" d="M64 21 V287 H583"/><text x="227" y="340">Zeit in Sekunden (s)</text><text transform="rotate(-90 15 175)" x="15" y="175">Temperatur (°C)</text><text x="390" y="30">A: 100 °C</text><text x="385" y="50">B: 85 °C</text>';
 $('compareGrid').innerHTML=g;
 ['A','B'].forEach(k=>{$('compare'+k).setAttribute('d',Array.from({length:11},(_,i)=>`${i?'L':'M'}${x(i)} ${y(comparisonTemp(k,i))}`).join(' '))});
 const update=()=>{let i=Number($('compareSeek').value);$('compareTime').textContent=i*60+' Sekunden';['A','B'].forEach(k=>{const t=comparisonTemp(k,i);$('compareMarker'+k).setAttribute('cx',x(i));$('compareMarker'+k).setAttribute('cy',y(t));$('compareValue'+k).textContent=(Math.round(t*10)/10).toLocaleString('de-DE')+' °C'})};
 $('compareSeek').addEventListener('input',update);update();
}
$$('[data-compare]').forEach(b=>b.addEventListener('click',()=>{let ok=b.dataset.compare==='1';$$('[data-compare]').forEach(x=>{x.classList.remove('correct','wrong');if(x.dataset.compare==='1')x.classList.add('correct')});if(!ok)b.classList.add('wrong');feedback($('compareFeedback'),ok,ok?'Richtig! Ohne Stoffangabe, Druck und Messbedingungen ist diese Behauptung nicht belegt.':'Nicht ganz: 100 °C gilt für reines Wasser bei Normaldruck; bei Kurve B sind Stoff und Bedingungen unbekannt.')}));
// A guided virtual lab which teaches observation, apparatus choices and reasoning.
const missions=[
 {title:'Mission 1 · Flüssigkeiten abmessen',art:'🧪 📏',steps:[
 {q:'Du brauchst genau 50 ml Wasser. Welches Gerät wählst du?',options:[['🧪','Messzylinder'],['🥣','Reibschale'],['🔥','Gasbrenner'],['🔍','Uhrglas']],ok:0,ex:'Ein Messzylinder besitzt eine passende Volumenskala.'},
 {q:'Wie liest du den Messzylinder richtig ab?',options:[['👀','Auf Augenhöhe am unteren Meniskus'],['⬆️','Von oben schräg'],['⬇️','Von unten schräg'],['🙈','Die Zahl schätzen']],ok:0,ex:'Bei Wasser liest du den tiefsten Punkt der gekrümmten Oberfläche auf Augenhöhe ab.'},
 {q:'Du hast 50 ml abgelesen. Was gehört ins Protokoll?',options:[['📝','Beobachtung: Volumen 50 ml'],['💭','Vermutung: Das Wasser wird lila'],['🎯','Auswertung ohne Messwert'],['❌','Gar nichts']],ok:0,ex:'Ein Messwert gehört mit seiner Einheit zu den Beobachtungen.'}]},
 {title:'Mission 2 · Was löst sich?',art:'🧂 💧',steps:[
 {q:'Du vergleichst Salz und Zucker. Was hältst du gleich?',options:[['⚖️','Wassermenge und Temperatur'],['🎨','Nur die Glasfarbe'],['📦','Nur die Löffelform'],['🕒','Nur den Wochentag']],ok:0,ex:'Bei einem fairen Vergleich dürfen sich möglichst nur die untersuchten Stoffe unterscheiden.'},
 {q:'Nach der Zugabe bleibt Salz am Boden. Was ist die Beobachtung?',options:[['👀','Weißer Bodensatz bleibt sichtbar'],['🧠','Salz ist immer schlecht'],['🏆','Der Versuch beweist alles'],['🌡️','Es muss 100 °C heiß sein']],ok:0,ex:'Eine Beobachtung beschreibt, was du tatsächlich siehst.'},
 {q:'Was erklärt einen bleibenden Bodensatz nach ausreichend Rühren?',options:[['💧','Die Lösung kann gesättigt sein'],['🧊','Das Wasser ist automatisch gefroren'],['🔥','Das Salz ist verbrannt'],['📏','Das Volumen ist immer 50 ml']],ok:0,ex:'Ist bei unveränderten Bedingungen die Löslichkeitsgrenze erreicht, bleibt weiterer Stoff ungelöst.'}]},
 {title:'Mission 3 · Das rätselhafte Diagramm',art:'📈 🌡️',steps:[
 {q:'Welcher Wert steht bei einer Heizkurve meist auf der x-Achse?',options:[['⏱️','Zeit in Sekunden'],['🌡️','Temperatur in °C'],['🧂','Masse in Gramm'],['💡','Lichtstärke']],ok:0,ex:'Die Zeit liegt in der Regel waagerecht; die Temperatur senkrecht.'},
 {q:'Die Temperatur stagniert beim Sieden. Wohin geht weitere Energie?',options:[['💨','In den Phasenübergang'],['🧊','Sofort ins Gefrieren'],['🔌','Sie verschwindet'],['🎨','In einen Farbwechsel']],ok:0,ex:'Beim Sieden wird Energie benötigt, um flüssiges Wasser in Wasserdampf umzuwandeln.'},
 {q:'Eine Kurve endet bei 85 °C. Was prüfst du zuerst?',options:[['🔎','Stoff, Luftdruck und Messung'],['✅','Wasser siedet immer bei 85 °C'],['❌','Ich ignoriere die Daten'],['🔥','Ich fasse die Flamme an']],ok:0,ex:'Nur unter bekannten Bedingungen kannst du aus einem Plateau auf die Siedetemperatur schließen.'}]}
];
function renderMission(){const st=state.mission;
 if(st.index>=missions.length){$('missionTitle').textContent='Alle drei Labor-Missionen gelöst!';$('missionCounter').textContent='3 von 3 geschafft';$('missionArt').textContent='🏆 🔬';$('missionSteps').innerHTML='';$('missionQuestion').textContent='Du kannst Laborgeräte, Beobachtungen und Schlussfolgerungen sicher unterscheiden.';$('missionChoices').innerHTML='';$('missionNext').disabled=true;feedback($('missionFeedback'),true,'Mission geschafft! Du hast neun Entscheidungen richtig begründet.');complete('missions');return;}
 const m=missions[st.index],task=m.steps[st.step];$('missionTitle').textContent=m.title;$('missionCounter').textContent=`Mission ${st.index+1} von 3`;
 $('missionArt').textContent=m.art;$('missionSteps').innerHTML=m.steps.map((x,i)=>`<span class="${i===st.step?'on':''}">${i<st.step?'✓':`Schritt ${i+1}`}</span>`).join('');
 $('missionQuestion').textContent=task.q;st.answered=false;
 $('missionChoices').innerHTML=task.options.map((op,i)=>`<button data-mission-opt="${i}"><span class="pict">${op[0]}</span><strong>${op[1]}</strong></button>`).join('');
 $$('[data-mission-opt]').forEach(b=>b.addEventListener('click',()=>{const ok=Number(b.dataset.missionOpt)===task.ok;
  if(st.answered)return;if(ok){st.answered=true;$$('[data-mission-opt]').forEach(x=>{x.disabled=true;x.classList.toggle('is-selected',x===b)});$('missionNext').disabled=false;feedback($('missionFeedback'),true,'Richtig! '+task.ex);}else feedback($('missionFeedback'),false,'Überlege noch einmal. Tipp: '+task.ex);
 }));$('missionNext').disabled=true;feedback($('missionFeedback'),null,'Wähle die passende Entscheidung.');
}
$('missionNext').addEventListener('click',()=>{const st=state.mission;st.step++;if(st.step>=3){st.step=0;st.index++}renderMission()});
$('missionRestart').addEventListener('click',()=>{state.mission={index:0,step:0,answered:false};renderMission()});
// Local-only laboratory notebook, with export and required-fields feedback.
const noteKeys=['title','question','hypothesis','materials','procedure','observation','evaluation'];
const noteLabels=['Titel','Fragestellung','Hypothese','Material','Durchführung','Beobachtung','Auswertung'];
function loadNotes(){try{state.notes=JSON.parse(localStorage.getItem('chemie5-notebook')||'{}')}catch(e){state.notes={}}
 $$('[data-note]').forEach(el=>{el.value=state.notes[el.dataset.note]||'';el.addEventListener('input',()=>{state.notes[el.dataset.note]=el.value;try{localStorage.setItem('chemie5-notebook',JSON.stringify(state.notes))}catch(e){console.warn('Lernstand konnte nicht gespeichert werden:',e)}})});}
function setNotes(v){state.notes={...v};$$('[data-note]').forEach(el=>{el.value=state.notes[el.dataset.note]||''});try{localStorage.setItem('chemie5-notebook',JSON.stringify(state.notes))}catch(e){console.warn('Lernstand konnte nicht gespeichert werden:',e)}}
$('noteCheck').addEventListener('click',()=>{let missing=noteKeys.filter(k=>(state.notes[k]||'').trim().length<9);let msg=missing.length?'Diese Felder brauchen noch verständliche Angaben: '+missing.map(k=>noteLabels[noteKeys.indexOf(k)]).join(', ')+'.':'Alle sieben Bereiche sind ausgefüllt. Prüfe jetzt, ob Beobachtung und Auswertung sauber getrennt sind. Die inhaltliche Richtigkeit kann nur eine Person prüfen.';feedback($('noteFeedback'),missing.length===0,msg);if(!missing.length)complete('method')});
$('noteExample').addEventListener('click',()=>{if(noteKeys.some(k=>(state.notes[k]||'').trim())&&!confirm('Dein bisheriges Protokoll wird durch das Beispiel ersetzt. Fortfahren?'))return;
 setNotes({title:'Die Löslichkeit von Kochsalz in Wasser',question:'Wie viel Kochsalz löst sich bei etwa 20 °C in 200 ml Wasser?',hypothesis:'Ich vermute, dass sich nur eine begrenzte Salzmenge löst.',materials:'2 Gläser, Messzylinder, Waage, Rührstab, Kochsalz, Wasser',procedure:'Unter Aufsicht 200 ml Wasser abmessen und Salz in gewogenen Portionen unter Rühren zufügen. Nach jeder Portion die Beobachtung notieren.',observation:'Bei kleinen Portionen war nach dem Rühren kein Salz mehr sichtbar. Nach weiteren Portionen blieb schließlich ein Bodensatz.',evaluation:'Die Salzlösung hat bei dieser Temperatur die Löslichkeitsgrenze erreicht. Die genaue Menge müsste man mit gewogenen Portionen bestimmen.'});feedback($('noteFeedback'),null,'Beispiel eingetragen. Du kannst es jetzt bearbeiten oder als Text speichern.')});
$('noteClear').addEventListener('click',()=>{if(confirm('Alle sieben Protokollfelder leeren?')){setNotes({});feedback($('noteFeedback'),null,'Das Forscherheft ist wieder leer.')}});
$('noteSave').addEventListener('click',()=>{const txt='Chemie – Mein Versuchsprotokoll\n\n'+noteKeys.map((k,i)=>noteLabels[i]+':\n'+(state.notes[k]||'')+'\n').join('\n');const blob=new Blob([txt],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Chemie-Versuchsprotokoll.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);feedback($('noteFeedback'),true,'Die Textdatei wurde zum Speichern vorbereitet.')});
$('mobileHome').addEventListener('click',()=>navigate('home'));
$('mobileNext').addEventListener('click',()=>navigate('learningpath'));

// Chemie-Entdeckerlabor V3: local, dependency-free interactive labs.
const deepDefaults={particles:{exp:false,answered:false},boiling:{exp:false,answered:false},flames:{exp:false,answered:false},setup:{exp:false,answered:false}};
let deepState=JSON.parse(JSON.stringify(deepDefaults));
try{const previous=JSON.parse(localStorage.getItem('chemie5-v3')||'{}');for(const key of Object.keys(deepDefaults)){if(previous[key]){deepState[key].exp=!!previous[key].exp;deepState[key].answered=!!previous[key].answered}}}catch(e){console.warn('Gespeicherte Daten konnten nicht gelesen werden:',e)}
function deepSave(){try{localStorage.setItem('chemie5-v3',JSON.stringify(deepState))}catch(e){console.warn('Lernstand konnte nicht gespeichert werden:',e)}}
function deepMark(k,what){deepState[k][what]=true;deepSave();deepProgress();}
function deepProgress(){const keys=['particles','boiling','flames','setup'];const labels=['Teilchenkino','Siedelabor','Flammenforscher','Labor aufbauen'];const n=keys.filter(k=>deepState[k].exp&&deepState[k].answered).length;
 $('deepBadges').textContent=keys.map(k=>deepState[k].exp&&deepState[k].answered?'✓':'○').join('  ');
 $('deepSummary').textContent=n===4?'🏆 Alle 4 Stationen geschafft! Du kannst deine Erkenntnisse nun im Wissenscheck überprüfen.':`${n} von 4 Stationen abgeschlossen. Für jede Station: Experiment ausprobieren und den Denkauftrag richtig beantworten.`;
 keys.forEach((k,i)=>{const b=document.querySelector(`[data-lab="${k}"]`);if(b)b.textContent=(deepState[k].exp&&deepState[k].answered?'✓ ':'')+['🧬 Teilchenkino','🌡️ Siedelabor','🔥 Flammenforscher','🧰 Labor aufbauen'][i]});
 if(n===4)complete('deep');
}
function deepStopTimers(){clearInterval(particleDemoTimer);particleDemoTimer=null;stopBoiling()}
// Tab keyboard navigation and visual state.
function openDeepTab(name){if(name!=='particles'&&name!=='boiling'&&name!=='flames'&&name!=='setup')name='particles';
 $$('[data-lab]').forEach(b=>{const active=b.dataset.lab===name;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1});
 for(const n of ['particles','boiling','flames','setup'])$('deep-'+n).hidden=n!==name;
 clearInterval(particleDemoTimer);particleDemoTimer=null;stopBoiling();
 if(!$('page-deep').hidden){const tabs=document.querySelector('.deep-tabs');const y=tabs.getBoundingClientRect().top+window.scrollY-12;window.scrollTo({top:Math.max(0,y),behavior:'instant'});}
}
$$('[data-lab]').forEach((button,i,arr)=>{button.addEventListener('click',()=>openDeepTab(button.dataset.lab));button.addEventListener('keydown',ev=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(ev.key))return;ev.preventDefault();const idx=ev.key==='Home'?0:ev.key==='End'?arr.length-1:(i+(ev.key==='ArrowRight'?1:-1)+arr.length)%arr.length;arr[idx].focus();openDeepTab(arr[idx].dataset.lab)})});
$('deepGoTest').addEventListener('click',()=>navigate('quiz'));
const deepAnswers={particles:{correct:1,why:'Genau! Eine Löffelspitze Zucker und eine Löffelspitze Salz können unterschiedliche Massen haben. Entscheidend sind Gramm, Wassermenge und Temperatur.'},boiling:{correct:1,why:'Richtig! Mehr Heizleistung beschleunigt das Erwärmen. Die Siedetemperatur des reinen Wassers hängt vor allem vom äußeren Druck ab, nicht davon, wie stark geheizt wird.'},flames:{correct:1,why:'Richtig! Die besonders heiße Zone befindet sich bei der rauschenden Flamme knapp oberhalb der Spitze des inneren blauen Kegels.'},setup:{correct:1,why:'Genau! Ein Messzylinder hat eine Skala zum genaueren Abmessen von Flüssigkeitsvolumina. Ein Becherglas eignet sich eher zum Mischen.'}};
const deepLabels={particles:'particleFeedback',boiling:'boilingFeedback',flames:'flamesFeedback',setup:'setupQFeedback'};
$$('[data-deep-q]').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.deepQ,a=deepAnswers[key],correct=+button.dataset.opt===a.correct;const parent=button.closest('.deep-choices');
 $$('.answer',parent).forEach(b=>{b.classList.remove('correct','wrong');b.setAttribute('aria-pressed',String(b===button))});button.classList.add(correct?'correct':'wrong');
 if(correct){deepMark(key,'answered');feedback($(deepLabels[key]),true,a.why+(deepState[key].exp?' Station geschafft!':' Probiere nun noch die Simulation aus.'));}
 else feedback($(deepLabels[key]),false,'Noch nicht. '+({particles:'Du kannst Massen nur vergleichen, wenn du sie gemessen hast.',boiling:'Denke an die waagerechte Stelle der Heizkurve.',flames:'Sieh dir zuerst die blaue Flamme mit Innenkegel an.',setup:'Welche Glasware hat eine gut ablesbare Volumenskala?'}[key]));
}));
// A 200 ml water model (200 g at school-level accuracy) using approximate published solubilities.
const particleSaturation={salt:{20:72,40:73,60:75},sugar:{20:408,40:476,60:574}};
let particleDemoTimer=null;
const particleModel={sub:'salt',temp:20,mass:0,stir:false};
function updateParticles(){const p=particleModel,limit=particleSaturation[p.sub][p.temp],dissolved=Math.min(p.mass,limit),solid=Math.max(0,p.mass-limit);
 $('particleDissolved').textContent=dissolved+' g';$('particleUndissolved').textContent=solid+' g';$('particleLimit').textContent='ca. '+limit+' g';$('particleTempVal').textContent=p.temp+' °C';$('particleMassVal').textContent=p.mass+' g';$('particleTemp').value=p.temp;$('particleMass').value=p.mass;
 $('particleFill').style.width=Math.min(100,Math.round(p.mass/limit*100))+'%';$('particlePercent').textContent=Math.round(p.mass/limit*100)+' % der Löslichkeitsgrenze';$('particleTank').classList.toggle('stirring',p.stir);
 $('particleSediment').style.height=(solid===0?0:Math.min(38,5+solid/10))+'px';
 let h='';for(let i=0;i<23;i++){const x=5+((i*37)%91),y=8+((i*23)%79);h+=`<i class="waterparticle" style="left:${x}%;top:${y}%;width:5px;height:5px;--duration:${3+i%4}s;--delay:${-i*.27}s"></i>`}
 const n=Math.min(74,Math.round((dissolved/limit)*63));for(let i=0;i<n;i++){const x=5+((i*43+13)%89),y=8+((i*31+27)%77);h+=`<i style="left:${x}%;top:${y}%;width:6px;height:6px;--duration:${2.5+i%5}s;--delay:${-i*.22}s"></i>`}
 $('particleMotes').innerHTML=h;
 let text=p.mass===0?'Gib einen Stoff hinzu. Die kleinen Punkte stellen gelöste Teilchen vereinfacht dar.':solid>0?`Jetzt liegt ein Bodensatz vor: Ungefähr ${dissolved} g sind gelöst, ${solid} g bleiben ungelöst. Die Lösung ist gesättigt.`:p.mass>=limit?`Sättigung erreicht: Ungefähr ${limit} g lösen sich unter diesen Bedingungen. Jede weitere Portion kann einen Bodensatz bilden.`:`Ungefähr ${dissolved} g sind gelöst. Du kannst die zugegebene Masse noch erhöhen.`;
 if(p.temp>20)text+=' Bei höherer Temperatur steigt die Löslichkeit von Zucker stark, die von Kochsalz nur wenig.';
 if(p.stir)text+=' Rühren beschleunigt das Lösen, verändert aber die maximale Menge im Gleichgewicht nicht.';
 $('particleInsight').textContent=text;
}
function setParticle(k,v){clearInterval(particleDemoTimer);particleDemoTimer=null;particleModel[k]=v;updateParticles();if(particleModel.mass>0)deepMark('particles','exp')}
$('particleSubstance').addEventListener('change',e=>setParticle('sub',e.target.value));$('particleTemp').addEventListener('input',e=>setParticle('temp',+e.target.value));$('particleMass').addEventListener('input',e=>setParticle('mass',+e.target.value));$('particleStir').addEventListener('change',e=>setParticle('stir',e.target.checked));
$('particleDemo').addEventListener('click',()=>{clearInterval(particleDemoTimer);particleModel.mass=0;updateParticles();deepMark('particles','exp');const goal=particleSaturation[particleModel.sub][particleModel.temp]+60;particleDemoTimer=setInterval(()=>{particleModel.mass=Math.min(700,Math.min(goal,particleModel.mass+20));updateParticles();if(particleModel.mass>=goal){clearInterval(particleDemoTimer);particleDemoTimer=null}},115)});
$('particleReset').addEventListener('click',()=>{clearInterval(particleDemoTimer);particleDemoTimer=null;particleModel.sub='salt';particleModel.temp=20;particleModel.mass=0;particleModel.stir=false;$('particleSubstance').value='salt';$('particleStir').checked=false;updateParticles()});
// Pressure-dependent idealized heating model. No real experiment data.
const boil={minute:0,pressure:'normal',power:5,timer:null};const targetBoil=()=>boil.pressure==='normal'?100:94;
function stopBoiling(){if(boil.timer!==null){clearInterval(boil.timer);boil.timer=null}if($('boilPlay'))$('boilPlay').textContent='▶ Start'}
function gridBoil(){let h='';const yy=v=>220-v/110*175,xx=v=>48+v/22*426;for(let t=0;t<=110;t+=20)h+=`<line class="gridline" x1="48" y1="${yy(t)}" x2="476" y2="${yy(t)}"/><text x="14" y="${yy(t)+5}">${t}</text>`;for(let t=0;t<=20;t+=5)h+=`<line class="gridline" x1="${xx(t)}" y1="42" x2="${xx(t)}" y2="220"/><text x="${xx(t)-5}" y="238">${t}</text>`;h+=`<path class="axis" d="M48 37 V220 H476"/><text x="212" y="258">Zeit (min)</text><text x="5" y="21">°C</text>`;$('boilGraphGrid').innerHTML=h}
function updateBoiling(){const plateau=targetBoil(),temp=Math.min(plateau,20+boil.minute*boil.power),isBoiling=temp>=plateau;
 $('boilRead').textContent=temp+' °C';$('boilTime').textContent=boil.minute+' min';$('boilTarget').textContent='ca. '+plateau+' °C';$('boilMode').textContent=isBoiling?'siedend':'flüssig';$('boilMercury').style.height=(Math.min(100,temp/110*100))+'%';$('boilScene').classList.toggle('boiling',isBoiling);
 const xx=m=>48+(m/22)*426, yy=t=>220-t/110*175;let d='';for(let i=0;i<=boil.minute;i++){d+=(i?' L':'M')+xx(i).toFixed(2)+' '+yy(Math.min(plateau,20+i*boil.power)).toFixed(2)}$('boilGraphLine').setAttribute('d',d);$('boilGraphDot').setAttribute('cx',xx(boil.minute));$('boilGraphDot').setAttribute('cy',yy(temp));
 $('boilInsight').textContent=isBoiling?`Das Wasser siedet bei ungefähr ${plateau} °C. Im Modell bleibt die Temperatur beim weiteren Heizen konstant; die zusätzliche Energie wird für den Übergang in Wasserdampf gebraucht.`:`Das Wasser erwärmt sich. An der Oberfläche verdunstet es bereits, auch wenn es noch nicht siedet. ${boil.power===10?'Die hohe Heizleistung macht die Kurve steiler.':''}`;
 if(isBoiling)deepMark('boiling','exp');
}
function stepBoiling(){if(boil.minute>=22){stopBoiling();return}boil.minute++;updateBoiling();if(boil.minute===22)stopBoiling()}
function resetBoiling(){stopBoiling();boil.minute=0;updateBoiling()}
$('boilPlay').addEventListener('click',()=>{if(boil.timer!==null){stopBoiling();return}if(boil.minute===22)boil.minute=0;boil.timer=setInterval(stepBoiling,420);$('boilPlay').textContent='⏸ Pause';updateBoiling()});$('boilStep').addEventListener('click',()=>{stopBoiling();stepBoiling()});$('boilReset').addEventListener('click',resetBoiling);
$('boilPressure').addEventListener('change',e=>{boil.pressure=e.target.value;resetBoiling()});$('boilPower').addEventListener('change',e=>{boil.power=+e.target.value;resetBoiling()});
let bubbleHTML='';for(let i=0;i<25;i++)bubbleHTML+=`<i style="--bx:${5+(i*29%89)}%;--bsize:${5+i%4*3}px;--bspeed:${.8+(i%5)*.27}s;--bd:${-i*.17}s"></i>`;$('boilBubbles').innerHTML=bubbleHTML;
// Flame zone inquiry; no operational ignition instructions.
const deepFlame={blue:false,zone:''};
function updateDeepFlame(){const blue=deepFlame.blue;$('yellowFlame').style.display=blue?'none':'';$('blueFlame').style.display=blue?'':'none';$('flameLow').classList.toggle('primary',!blue);$('flameHigh').classList.toggle('primary',blue);$('flameLow').setAttribute('aria-pressed',String(!blue));$('flameHigh').setAttribute('aria-pressed',String(blue));
 const base=blue?'Blaue, rauschende Flamme: bei größerer Luftzufuhr heißer und weniger gut sichtbar.':'Gelbe, leuchtende Flamme: bei geringer Luftzufuhr gut sichtbar, meist weniger heiß und möglicherweise rußend.';
 const zones={outer:'Im Außenbereich wird der Brennstoff mit Sauerstoff umgesetzt. Die Temperatur ist ortsabhängig.',inner:'Der innere blaue Kegel ist nicht die heißeste Stelle.',above:'Knapp oberhalb der Spitze des inneren Kegels befindet sich ein besonders heißer Bereich.'};
 $('flameInsight').textContent=base+(deepFlame.zone?' '+(blue?zones[deepFlame.zone]:'Untersuche für die Flammenzonen zuerst die blaue Flamme.'):' Tippe auf eine Flammenzone, um sie zu erforschen.');
}
$('flameLow').addEventListener('click',()=>{deepFlame.blue=false;deepFlame.zone='';updateDeepFlame()});$('flameHigh').addEventListener('click',()=>{deepFlame.blue=true;deepFlame.zone='';updateDeepFlame()});$$('[data-flame-zone]').forEach(b=>b.addEventListener('click',()=>{deepFlame.zone=b.dataset.flameZone;updateDeepFlame();if(deepFlame.blue)deepMark('flames','exp')}));
// Lab apparatus choices in a branching set of six logical decisions.
const setupTasks=[
 {title:'1. Wasser abmessen',prompt:'Du sollst für einen Vergleich 200 ml Wasser abmessen. Welches Gerät eignet sich am besten?',opts:['Uhrglas','Messzylinder','Reagenzglashalter'],ok:1,icon:'🧪',name:'Messzylinder',why:'Richtig! Ein Messzylinder hat eine Volumenskala.'},
 {title:'2. Stoffmenge vergleichen',prompt:'Du möchtest dieselbe Masse Kochsalz und Zucker untersuchen. Was benötigst du?',opts:['Waage','Spatel allein','Trichter'],ok:0,icon:'⚖️',name:'Waage',why:'Richtig! Die Masse wird in Gramm gemessen, zum Beispiel mit einer Waage.'},
 {title:'3. Lösung mischen',prompt:'Welches Gefäß eignet sich, um Wasser und Zucker darin zu mischen?',opts:['Becherglas','Drahtnetz','Tiegelzange'],ok:0,icon:'🥛',name:'Becherglas',why:'Richtig! Ein Becherglas eignet sich zum Aufnehmen und Mischen von Flüssigkeiten.'},
 {title:'4. Schonend umrühren',prompt:'Welches Gerät dient üblicherweise dazu, eine Flüssigkeit umzurühren?',opts:['Reagenzglasständer','Glasstab','Dreifuß'],ok:1,icon:'🥄',name:'Glasstab',why:'Genau! Mit einem Glasstab kann man im Labor umrühren.'},
 {title:'5. Erwärmen verstehen',prompt:'Welches Gerätepaar bildet bei einem entsprechenden Schulversuch die Auflage für ein Becherglas über der Wärmequelle?',opts:['Dreifuß und Drahtnetz','Trichter und Uhrglas','Spatel und Messzylinder'],ok:0,icon:'🔬',name:'Dreifuß + Netz',why:'Richtig! Dreifuß und Drahtnetz können als Auflage dienen. Das tatsächliche Erwärmen ist nur unter Aufsicht erlaubt.'},
 {title:'6. Augen schützen',prompt:'Welche Schutzmaßnahme gehört beim vorgesehenen Schulversuch dazu?',opts:['Anleitung ignorieren','Schutzbrille tragen','Über dem Gefäß essen'],ok:1,icon:'🥽',name:'Schutzbrille',why:'Richtig! Eine geeignete Schutzbrille schützt die Augen. Welche weiteren Schutzmaßnahmen nötig sind, entscheidet die Lehrkraft.'}
];
let setupRun={step:0,correct:0,answered:false,icons:[]};
function renderSetup(){const st=setupRun;if(st.step>=setupTasks.length){$('setupTitle').textContent='🏆 Alle 6 Gerätemissionen gelöst';$('setupPrompt').textContent='Du kennst jetzt die wichtigsten Geräte und kannst deine Auswahl begründen.';$('setupChoices').innerHTML='';$('setupTaskCount').textContent='6 / 6';$('setupNext').disabled=true;feedback($('setupFeedback'),true,'Erfolgreich! '+st.correct+' von 6 Geräteentscheidungen richtig gelöst.');deepMark('setup','exp');return}
 const task=setupTasks[st.step];$('setupTitle').textContent=task.title;$('setupPrompt').textContent=task.prompt;$('setupTaskCount').textContent=(st.step+1)+' / 6';$('setupScore').textContent=String(st.correct);$('setupNext').disabled=true;st.answered=false;
 $('setupChoices').innerHTML=task.opts.map((o,i)=>`<button class="answer" data-setup-opt="${i}">${o}</button>`).join('');feedback($('setupFeedback'),null,'Prüfe das Ziel und entscheide dich für das passende Gerät.');
 $$('[data-setup-opt]').forEach(btn=>btn.addEventListener('click',()=>{if(st.answered)return;const idx=+btn.dataset.setupOpt;$$('[data-setup-opt]').forEach(b=>b.classList.remove('wrong','correct'));if(idx!==task.ok){btn.classList.add('wrong');feedback($('setupFeedback'),false,'Noch nicht. '+({0:'Die Aufgabe fragt nach einem Messgerät für Volumen.',1:'Eine Löffelspitze hat keine feste Masse.',2:'Du benötigst ein stabiles Gefäß zum Mischen.',3:'Gesucht ist ein Rührgerät.',4:'Eine Gefäßauflage muss hitzebeständig und stabil sein.',5:'Beim Experimentieren muss man die Augen schützen.'}[st.step]));return}
 btn.classList.add('correct');$$('[data-setup-opt]').forEach(b=>b.disabled=true);st.answered=true;st.correct++;st.icons.push([task.icon,task.name]);$('setupScore').textContent=String(st.correct);$('setupIcons').innerHTML=st.icons.map(x=>`<div class="setup-icon" aria-label="${x[1]}"><span>${x[0]}</span><small>${x[1]}</small></div>`).join('');feedback($('setupFeedback'),true,task.why);$('setupNext').disabled=false;
 }))
}
$('setupNext').addEventListener('click',()=>{if(!setupRun.answered)return;setupRun.step++;renderSetup()});$('setupReset').addEventListener('click',()=>{setupRun={step:0,correct:0,answered:false,icons:[]};$('setupIcons').innerHTML='<span class="setup-ghost">Noch kein Gerät ausgewählt</span>';renderSetup()});
// Initialize the new simulations.
updateParticles();gridBoil();updateBoiling();updateDeepFlame();renderSetup();deepProgress();openDeepTab('particles');

// Ensure test questions and lesson state are available without network access.
resetPairs();initCompare();renderMission();loadNotes();initHeatChart();updateHeat();updateSol();updateFlame();renderDevices();startDeviceQuiz();startMatter();renderSafety();renderMethodSteps();renderMethodQuestion();startQuiz();updateProgress();navigate('home');

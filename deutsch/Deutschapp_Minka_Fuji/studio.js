'use strict';
(() => {
  const data=window.MF_STUDIO_DATA,root=document.getElementById('studio-app');
  if(!data||!root)return;
  const STORE='minka-fuji-studio-v1',TAG=data.tags;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nl=s=>esc(s).replace(/\n/g,'<br>');
  const words=s=>String(s||'').trim()?String(s).trim().split(/\s+/u).length:0;
  const state0=()=>({view:'path',pathDone:{},storyId:data.stories[0].id,stories:{},examId:data.exams[0].id,examMode:'practice',exams:{},labId:data.labs[0].id,labs:{},tag:'handlung',scene:0});
  let state=state0(),canStore=true;
  try{
    const p=JSON.parse(localStorage.getItem(STORE)||'null');
    if(p&&typeof p==='object'){
      state.view=['path','writer','exam','lab'].includes(p.view)?p.view:'path';
      state.pathDone=p.pathDone&&typeof p.pathDone==='object'?p.pathDone:{};
      state.storyId=data.stories.some(s=>s.id===p.storyId)?p.storyId:data.stories[0].id;
      state.stories=p.stories&&typeof p.stories==='object'?p.stories:{};
      state.examId=data.exams.some(s=>s.id===p.examId)?p.examId:data.exams[0].id;
      state.examMode=p.examMode==='simulation'?'simulation':'practice';
      state.exams=p.exams&&typeof p.exams==='object'?p.exams:{};
      state.labId=data.labs.some(s=>s.id===p.labId)?p.labId:data.labs[0].id;
      state.labs=p.labs&&typeof p.labs==='object'?p.labs:{};
      state.tag=TAG[p.tag]?p.tag:'handlung';
      state.scene=Number.isInteger(p.scene)?p.scene:0;
    }
  }catch{canStore=false;}
  function save(){
    try{localStorage.setItem(STORE,JSON.stringify(state));canStore=true;}catch{canStore=false;}
    const info=document.getElementById('studio-store');
    if(info)info.textContent=canStore?'Deine Texte und Markierungen werden nur in diesem Browser gespeichert. Keine Anmeldung, keine automatische Benotung.':'Dein Browser erlaubt hier keine dauerhafte Speicherung. Sichere Texte als TXT.';
  }
  const story=()=>data.stories.find(s=>s.id===state.storyId)||data.stories[0];
  const exam=()=>data.exams.find(s=>s.id===state.examId)||data.exams[0];
  const lab=()=>data.labs.find(s=>s.id===state.labId)||data.labs[0];
  const draft=()=>{
    const id=state.storyId;
    if(!state.stories[id]||typeof state.stories[id]!=='object')state.stories[id]={plan:{},parts:{},checks:[]};
    return state.stories[id];
  };
  const examDraft=()=>{
    const id=state.examId;
    if(!state.exams[id]||typeof state.exams[id]!=='object')state.exams[id]={text:'',title:'',submitted:false,hints:0,ratings:[]};
    return state.exams[id];
  };
  const labDraft=()=>{
    const id=state.labId;
    if(!state.labs[id]||typeof state.labs[id]!=='object')state.labs[id]={marks:{},checked:false,showModel:false,revision:'',checks:[]};
    return state.labs[id];
  };
  const tab=(view,title,icon)=>'<button type="button" class="studio-tab '+(state.view===view?'active':'')+'" data-studio-view="'+view+'" aria-current="'+(state.view===view?'page':'false')+'"><span aria-hidden="true">'+icon+'</span>'+title+'</button>';
  const picker=(items,selected,attr)=>'<select id="studio-picker" aria-label="Schreibanlass wählen">'+items.map(x=>'<option value="'+esc(x.id)+'" '+(selected===x.id?'selected':'')+'>'+esc(x.name||x.title)+'</option>').join('')+'</select>';
  const link=(label,route)=>'<button type="button" class="secondary" data-studio-route="'+route+'">'+esc(label)+'</button>';
  const hintBox=(kind,text)=>'<div class="studio-hint"><strong>'+kind+'</strong><p>'+esc(text)+'</p></div>';
  function countDone(){return data.pathway.filter((_,i)=>state.pathDone[i]).length;}
  function sceneArt(s,idx,active,interactive,themeId){
    const start=interactive?'<button type="button" class="studio-story-panel '+(active?'active':'')+'" data-studio-scene="'+idx+'" aria-pressed="'+active+'">':'<div class="studio-story-panel studio-story-panel-static">';
    return start+'<span class="studio-scene-num">'+(idx+1)+'</span><span class="studio-scene-art" aria-hidden="true">'+(window.MF_STUDIO_ART?window.MF_STUDIO_ART.render(themeId,idx,s[0]):esc(s[0]))+'</span><strong>'+esc(s[1])+'</strong><span>'+esc(s[2])+'</span>'+(interactive?'</button>':'</div>');
  }
  function tensionLine(){
    const current=Math.max(0,Math.min(state.scene,3));
    const dots=[[70,135],[250,110],[430,70],[610,30]];
    return '<div class="studio-tension-graphic"><div><strong>So wächst die Spannung</strong><p>Tippe oben auf eine Szene: Der Punkt wandert auf der Spannungskurve. Im Höhepunkt ist die Entscheidung am wichtigsten.</p></div><svg viewBox="0 0 690 175" role="img" aria-label="Ansteigende Spannung von Szene eins bis zum entscheidenden Moment in Szene vier" xmlns="http://www.w3.org/2000/svg"><path d="M35 155 H670" stroke="#90a8c7" stroke-width="2"/><path d="M70 135 Q170 150 250 110 Q345 105 430 70 Q520 55 610 30" fill="none" stroke="#baf36b" stroke-width="6" stroke-linecap="round"/>'+dots.map((p,i)=>'<circle class="'+(i===current?'studio-curve-active':'')+'" cx="'+p[0]+'" cy="'+p[1]+'" r="'+(i===current?15:10)+'" fill="'+(i===current?'#ffffff':'#203850')+'" stroke="#baf36b" stroke-width="5"/><text x="'+p[0]+'" y="'+(p[1]+33)+'" text-anchor="middle" fill="#ffffff" font-size="19" font-weight="700">'+(i+1)+'</text>').join('')+'</svg><p class="muted">Die Kurve ist ein Modell. Nicht jede Geschichte hat genau diesen Verlauf.</p></div>';
  }
  function storyboard(panels,interactive=false,themeId=''){
    const n=Math.max(0,Math.min(state.scene,panels.length-1));
    return '<div class="studio-storyboard" role="group" aria-label="Bilderfolge in der richtigen Reihenfolge">'+panels.map((s,i)=>sceneArt(s,i,interactive&&n===i,interactive,themeId)).join('')+'</div>'+
     (interactive?'<div class="studio-scene-focus" role="status"><strong>Bild '+(n+1)+': '+esc(panels[n][1])+'</strong><p>'+esc(panels[n][2])+'</p><div class="studio-scene-controls"><button type="button" class="secondary" data-studio-scene="'+Math.max(n-1,0)+'" '+(n===0?'disabled':'')+'>Vorheriges Bild</button><button type="button" class="secondary" data-studio-scene="'+Math.min(n+1,panels.length-1)+'" '+(n===panels.length-1?'disabled':'')+'>Nächstes Bild</button></div></div>':'');
  }
  const checkBox=(label,id,checked)=>'<label class="studio-check"><input type="checkbox" '+id+' '+(checked?'checked':'')+'><span>'+esc(label)+'</span></label>';
  function renderPath(){
    const n=countDone();
    return '<div class="studio-landing"><div class="studio-welcome">'+
      '<p class="eyebrow">Dein persönlicher Lernweg · Klasse 5</p><h2>Von der Idee zur spannenden Erzählung</h2>'+
      '<p>Du musst nicht alles auf einmal können. Minka und Fuji begleiten dich Schritt für Schritt. Deine Geschichten können aber auch von Lina, Sami, Mia oder anderen Figuren handeln.</p>'+
      '<p class="studio-progress-line"><strong>'+n+' von '+data.pathway.length+' Lernschritten selbst abgehakt</strong></p><progress value="'+n+'" max="'+data.pathway.length+'" aria-label="Selbst abgehakte Lernschritte"></progress>'+
      '<p class="muted">Die Häkchen sind deine eigene Lernweg-Planung, kein Kompetenznachweis.</p></div>'+
      '<div class="studio-choices">'+
      '<button type="button" class="studio-choice" data-studio-view="path" data-studio-focus="path"><span aria-hidden="true">🧭</span><strong>Ich möchte es lernen</strong><span>Geführt durch Erklärungen, Comics und Übungen</span></button>'+
      '<button type="button" class="studio-choice" data-studio-view="writer"><span aria-hidden="true">✏️</span><strong>Ich möchte schreiben</strong><span>Verschiedene Figuren und eigene Geschichten</span></button>'+
      '<button type="button" class="studio-choice" data-studio-view="exam"><span aria-hidden="true">🎓</span><strong>Ich übe für die Klassenarbeit</strong><span>Bildgeschichte, Reizwörter und Selbstprüfung</span></button></div>'+
      '<div class="studio-path" id="studio-path-items"><h3>Deine sieben Schritte</h3>'+
      data.pathway.map((step,i)=>'<div class="studio-path-step"><div class="studio-path-num">'+(i+1)+'</div><div class="studio-path-info"><strong>'+esc(step.title)+'</strong><p>'+esc(step.desc)+'</p><div class="studio-path-actions">'+
      (['writer','lab','exam'].includes(step.target)?'<button type="button" class="primary" data-studio-view="'+step.target+'">'+esc(step.action)+'</button>':link(step.action,step.target))+
      '</div></div>'+checkBox('Für mich erledigt','data-studio-path-check="'+i+'"',Boolean(state.pathDone[i]))+'</div>').join('')+'</div>'+
      '<div class="studio-shortcuts"><h3>Noch mehr üben?</h3><p>Die bisherigen acht Lernbereiche bleiben vollständig erhalten.</p>'+
      link('Geführter Lehrgang mit Animationen','lehrgang')+link('Leseverständnis','lesen')+link('Wissen üben','ueben')+
      '<button type="button" class="secondary" data-studio-view="lab">Textlabor starten</button></div></div>';
  }
  const planFields=[
    ['figures','Wer erlebt etwas?','Wer sind die Hauptfiguren?'],
    ['situation','Wo und wann beginnt die Geschichte?','Was ist die Ausgangssituation?'],
    ['clue','Welcher Hinweis macht neugierig?','Was bringt das Abenteuer in Gang?'],
    ['obstacle','Was wird schwierig?','Welches Hindernis müssen die Figuren überwinden?'],
    ['climax','Wann entscheidet sich alles?','Was tun sie am Höhepunkt?'],
    ['ending','Wie klingt die Handlung aus?','Was geschieht danach?']
  ];
  const partFields=[
    ['intro','Einleitung','Stelle Figuren und Ausgangslage vor. Lege einen konkreten Hinweis, aber verrate die Lösung nicht.'],
    ['body','Hauptteil','Verbinde Ereignisse mit Ursachen. Baue Hindernisse, Gedanken, Gefühle und genaue Handlungsschritte ein. Erzähle den Höhepunkt ausführlich.'],
    ['end','Schluss','Zeige Folgen, Erleichterung oder einen Rückbezug zum Anfang. Beginne nicht zufällig ein völlig neues Abenteuer.']
  ];
  const writerChecks=[
    'Die Einleitung gibt Orientierung und macht neugierig.',
    'Der Hauptteil erzählt zusammenhängende Ereignisse statt nur „Dann … dann …“.',
    'Mindestens ein Hindernis und die Reaktion der Figur werden deutlich.',
    'Gedanken, Gefühle und passende Sinneseindrücke sind erkennbar.',
    'Der entscheidende Höhepunkt ist ausführlicher erzählt als Nebensachen.',
    'Der Schluss passt zum Anfang; Zeitform und Perspektive stimmen.',
    'Ich habe Satzanfänge, wörtliche Rede und Zeichensetzung geprüft.'
  ];
  function fullDraft(d){
    const p=d.parts||{};
    return [p.intro,p.body,p.end].map(x=>String(x||'').trim()).filter(Boolean).join('\n\n');
  }
  function renderWriter(){
    const s=story(),d=draft();d.plan=d.plan||{};d.parts=d.parts||{};d.checks=Array.isArray(d.checks)?d.checks:[];
    return '<div class="studio-section-intro"><h2>Die große Schreibwerkstatt</h2><p>Wähle deine Geschichte. Minka und Fuji helfen beim Schreiben, aber die Hauptfiguren wechseln. Du schreibst selbst und erhältst einen klaren Bauplan – keine automatisch erzeugte Note.</p></div>'+
     '<div class="studio-select"><label for="studio-picker"><strong>Wähle deinen Schreibanlass</strong></label>'+picker(data.stories,state.storyId)+'</div>'+
     '<div class="studio-story-title"><span class="studio-story-icon" aria-hidden="true">'+esc(s.icon)+'</span><div><h3>'+esc(s.name)+'</h3><p>'+esc(s.type)+' · '+esc(s.setting)+' · '+esc(s.people)+'</p></div></div>'+
     storyboard(s.panels,true,s.id)+tensionLine()+
     '<details class="studio-help"><summary>Ideen von Fuji: Worauf könntest du achten?</summary><p><strong>Ziel:</strong> '+esc(s.purpose)+'</p><p><strong>Hinweis:</strong> '+esc(s.hint)+'</p><p><strong>Hindernis:</strong> '+esc(s.obstacle)+'</p><ol>'+s.ideas.map(q=>'<li>'+esc(q)+'</li>').join('')+'</ol><p>Du darfst die Geschichte ganz anders lösen – wichtig ist der rote Faden.</p></details>'+
     '<div class="studio-write-grid"><section class="panel"><p class="eyebrow">Schritt 1</p><h3>Dein Erzählplan</h3><p>Stichwörter reichen aus. Du kannst deinen Plan jederzeit ändern.</p>'+
     planFields.map(([key,label,placeholder])=>'<label class="studio-input-label">'+esc(label)+'<input type="text" maxlength="450" data-studio-plan="'+key+'" value="'+esc(d.plan[key]||'')+'" placeholder="'+esc(placeholder)+'"></label>').join('')+
     '<div class="studio-path-actions">'+link('Aufbau mit dem Comic ansehen','entdecken')+link('Höhepunkt am Wal entdecken','spannung')+'</div></section>'+
     '<section class="panel studio-story-writing"><p class="eyebrow">Schritt 2</p><h3>Deine ganze Erzählung</h3>'+
     partFields.map(([key,label,explain])=>'<label class="studio-input-label"><strong>'+esc(label)+'</strong><span class="studio-helptext">'+esc(explain)+'</span><textarea rows="'+(key==='body'?10:5)+'" maxlength="12000" data-studio-part="'+key+'" placeholder="Schreibe deine '+esc(label)+' hier …">'+esc(d.parts[key]||'')+'</textarea></label>').join('')+
     '<p id="studio-writer-words" role="status">'+words(fullDraft(d))+' Wörter · Der Hauptteil sollte in einer spannenden Erzählung genügend Raum bekommen.</p></section></div>'+
     '<section class="panel studio-review"><p class="eyebrow">Schritt 3</p><h3>Mit Fuji überarbeiten</h3>'+
     '<p>Lies deine Erzählung noch einmal und prüfe jede Aussage am eigenen Text. Die Häkchen werden zurückgesetzt, wenn du den Text veränderst.</p>'+
     '<div class="studio-checkgrid">'+writerChecks.map((t,i)=>checkBox(t,'data-studio-writer-check="'+i+'"',d.checks[i]===true)).join('')+'</div>'+
     '<p id="studio-writer-checkinfo" role="status">'+d.checks.filter(Boolean).length+' von '+writerChecks.length+' selbst geprüft · keine automatische Benotung.</p>'+
     '<details><summary>Ein Schreibbeispiel für einen Höhepunkt ansehen</summary><p>„Der Topf schwankte. Minka hielt den Atem an. Würde Fuji ihn noch festhalten können? Da schob Minka einen Holzklotz in den Spalt. Endlich war der Igel frei.“</p><p>Die kleinen Handlungsschritte verlangsamen den Höhepunkt. Gefühle und eine innere Frage zeigen, was auf dem Spiel steht.</p></details>'+
     '<div class="studio-actions"><button type="button" class="primary" data-studio-view="lab">Im Textlabor weiterüben</button><button type="button" class="secondary" data-studio-download="writer">Geschichte als TXT sichern</button><button type="button" class="secondary" data-studio-print="writer">Geschichte drucken</button></div></section>'+
     '<section class="panel studio-preview"><h3>Deine Lesefassung</h3><div id="studio-writer-preview" class="studio-story-reading">'+(fullDraft(d)?nl(fullDraft(d)):'Deine Geschichte erscheint hier, sobald du zu schreiben beginnst.')+'</div></section>';
  }
  function renderExam(){
    const s=exam(),d=examDraft(),sim=state.examMode==='simulation',check=Array.isArray(d.ratings)?d.ratings:[];
    const sum=data.rubric.reduce((a,_,i)=>a+(Number.isInteger(check[i])?check[i]:0),0);
    return '<div class="studio-section-intro"><h2>Klassenarbeiten üben</h2><p>Acht abwechslungsreiche Aufgaben mit Bildern oder Reizwörtern. In der Übung erhältst du Hinweise; in der Probe schreibst du ohne Hilfen. Am Ende bewertest du deine Geschichte anhand nachvollziehbarer Kriterien – nicht automatisch.</p></div>'+
     '<div class="studio-exam-settings"><label for="studio-picker"><strong>Aufgabe auswählen</strong>'+picker(data.exams,state.examId)+'</label><fieldset><legend>So möchtest du üben</legend>'+
     '<label><input type="radio" name="studio-exam-mode" value="practice" '+(!sim?'checked':'')+'> Mit Hilfen üben</label>'+
     '<label><input type="radio" name="studio-exam-mode" value="simulation" '+(sim?'checked':'')+'> Probeklassenarbeit ohne Hilfen</label></fieldset></div>'+
     '<div class="panel studio-exam-paper"><p class="eyebrow">'+esc(s.kind)+' · '+esc(s.level)+' · Orientierungszeit: '+s.minutes+' Minuten</p><h3>'+esc(s.title)+'</h3>'+
     (s.panels.length?storyboard(s.panels,false,s.id):'<div class="studio-wordcards" aria-label="Reizwörter">'+s.words.map(w=>'<span>'+esc(w)+'</span>').join('')+'</div>')+
     '<p class="studio-exam-task"><strong>Dein Arbeitsauftrag:</strong> '+esc(s.task)+'</p>'+
     '<p><strong>Denke daran:</strong> Schreibe eine passende Überschrift und eine zusammenhängende Erzählung mit Einleitung, Hauptteil und Schluss.</p>'+
     (!sim&&!d.submitted?'<div class="studio-actions"><button type="button" class="secondary" data-studio-exam-hint>Hinweis '+(Math.min(d.hints||0,2)+1)+' von 3</button></div>'+
       (d.hints?'<div class="studio-hintlist">'+s.help.slice(0,d.hints).map((v,i)=>hintBox('Hinweis '+(i+1),v)).join('')+'</div>':''):'')+
     '<label class="studio-input-label"><strong>Überschrift</strong><input type="text" maxlength="160" data-studio-exam-title value="'+esc(d.title||'')+'" placeholder="Eine passende Überschrift"></label>'+
     '<label class="studio-input-label"><strong>Deine Erzählung</strong><textarea rows="17" maxlength="20000" data-studio-exam-text placeholder="Hier beginnt deine Erzählung …">'+esc(d.text||'')+'</textarea></label>'+
     '<div class="studio-exam-bottom"><p id="studio-exam-words" role="status">'+words(d.text)+' Wörter · '+(sim?'Probe ohne Hilfen':'Übung mit freiwilligen Hinweisen')+'</p>'+
     '<button type="button" class="primary" data-studio-exam-submit '+(!String(d.text||'').trim()?'disabled':'')+'>'+(d.submitted?'Erneut zur Selbstprüfung abgeben':'Abgeben und selbst prüfen')+'</button></div></div>'+
     (d.submitted?'<section class="panel studio-review" id="studio-exam-review"><h3>Dein Kriterienraster</h3><p>Vergleiche jede Aussage sorgfältig mit deinem Text. Wähle 0 = noch nicht, 1 = teilweise, 2 = gut gelungen. Das ist eine <strong>Selbsteinschätzung</strong>, keine Schulnote.</p>'+
       data.rubric.map((r,i)=>'<div class="studio-rubric-row"><div><strong>'+esc(r.name)+'</strong><p>'+esc(r.detail)+'</p></div><label>Eigene Einschätzung<select data-studio-rating="'+i+'"><option value="">Bitte wählen</option>'+[0,1,2].map(v=>'<option value="'+v+'" '+(check[i]===v?'selected':'')+'>'+v+' – '+['noch nicht','teilweise','gut gelungen'][v]+'</option>').join('')+'</select></label></div>').join('')+
       '<div class="studio-score" role="status" id="studio-score"><strong>'+check.filter(v=>Number.isInteger(v)).length+' von '+data.rubric.length+' Kriterien betrachtet</strong><p>'+sum+' von 12 möglichen Selbsteinschätzungspunkten. Keine automatische Bewertung oder Note.</p>'+
       (check.some(v=>v===0||v===1)?'<p><strong>Weiterüben:</strong> '+data.rubric.filter((r,i)=>check[i]===0||check[i]===1).map(r=>esc(r.name)).join(' · ')+'</p>':'')+'</div>'+
       '<div class="studio-actions"><button type="button" class="secondary" data-studio-view="lab">Textüberarbeitung üben</button>'+link('Hauptteil gezielt üben','hauptteil')+
       '<button type="button" class="secondary" data-studio-download="exam">Arbeit als TXT sichern</button><button type="button" class="secondary" data-studio-print="exam">Arbeit ausdrucken</button></div></section>':
       '<p class="studio-exam-note">Nach der Abgabe wird das Kriterienraster sichtbar. Deine Erzählung bleibt editierbar; Änderungen verlangen eine erneute Selbstprüfung.</p>')+
     '<div class="studio-actions"><button type="button" class="secondary" data-studio-exam-reset>Diese Aufgabe neu beginnen</button></div>';
  }
  function renderLab(){
    const l=lab(),d=labDraft();d.marks=d.marks||{};d.checks=Array.isArray(d.checks)?d.checks:[];
    const selected=state.tag;
    const correct=l.fragments.filter((p,i)=>d.marks[i]===p[1]).length;
    const attempted=l.fragments.filter((p,i)=>TAG[d.marks[i]]).length;
    return '<div class="studio-section-intro"><h2>Das interaktive Textlabor</h2><p>Hier siehst du, wie Gefühle, Gedanken, Handlung und Höhepunkt ineinandergreifen. Markiere Textstellen durch Antippen und verbessere anschließend einen schwachen Text in deinen eigenen Worten.</p></div>'+
      '<div class="studio-select"><label for="studio-picker"><strong>Geschichte auswählen</strong></label>'+picker(data.labs,state.labId)+'</div>'+
      '<div class="studio-lab-head"><h3>'+esc(l.title)+'</h3><p>'+esc(l.scene)+'</p></div>'+
      '<div class="panel"><p class="eyebrow">1 · Text genau anschauen</p><h3>Wähle zuerst eine Farbe</h3>'+
      '<div class="studio-tags" role="group" aria-label="Markierfarbe auswählen">'+Object.entries(TAG).map(([key,label])=>'<button type="button" data-studio-tag="'+key+'" aria-pressed="'+(selected===key)+'" class="studio-tag studio-tag-'+key+' '+(selected===key?'active':'')+'">'+esc(label)+'</button>').join('')+'</div>'+
      '<p class="muted">'+esc(data.tips[selected])+'</p>'+
      '<div class="studio-fragments"><p>Tippe nun nacheinander auf die passenden Sätze. Du kannst jede Markierung ändern.</p>'+
      l.fragments.map((f,i)=>'<button type="button" class="studio-fragment '+(TAG[d.marks[i]]?'marked studio-mark-'+d.marks[i]:'')+'" data-studio-fragment="'+i+'"><span class="studio-fragment-number">'+(i+1)+'</span><span>'+esc(f[0])+'</span><small>'+(TAG[d.marks[i]]?esc(TAG[d.marks[i]]):'Noch nicht markiert')+'</small></button>').join('')+'</div>'+
      '<div class="studio-actions"><button type="button" class="primary" data-studio-lab-check>Markierungen prüfen</button><button type="button" class="secondary" data-studio-lab-clear>Markierungen löschen</button></div>'+
      (d.checked?'<div class="studio-lab-feedback" role="status"><strong>'+correct+' von 4 passend markiert</strong><p>'+(
        correct===4?'Sehr gut: Jede Textstelle wurde passend eingeordnet. Als Nächstes kannst du selbst verbessern.':
        'Prüfe noch einmal diese Stellen: '+l.fragments.map((f,i)=>d.marks[i]===f[1]?null:(i+1)).filter(Boolean).join(', ')+'. Wähle eine andere Farbe oder nutze die Erklärung.'
      )+'</p></div>':'<p class="muted" role="status">'+attempted+' von 4 Textstellen markiert.</p>')+
      '<details '+(d.showModel?'open':'')+' id="studio-lab-explain"><summary>Geführte Lösung und Begründung aufklappen</summary>'+
      '<ol>'+l.fragments.map((f,i)=>'<li><strong>'+esc(TAG[f[1]])+':</strong> '+esc(f[0])+'</li>').join('')+'</ol><p>'+esc(l.explain)+'</p></details></div>'+
      '<section class="panel studio-lab-write"><p class="eyebrow">2 · Jetzt besser formulieren</p><h3>Verbessere die Geschichte</h3>'+
      '<div class="studio-before"><strong>Schwacher Ausgangstext</strong><p>'+esc(l.weak)+'</p></div>'+
      '<p><strong>Dein Auftrag:</strong> '+esc(l.task)+'</p><label class="studio-input-label"><strong>Deine überarbeitete Fassung</strong><textarea rows="7" maxlength="12000" data-studio-lab-revision placeholder="Schreibe die verbesserte Fassung in deinen eigenen Worten …">'+esc(d.revision||'')+'</textarea></label>'+
      '<details><summary>Musterüberarbeitung zum Vergleichen</summary><p>'+esc(l.better)+'</p><p>'+esc(l.explain)+'</p></details>'+
      '<h3>Deine Schreibkonferenz mit Fuji</h3><p>Die Häkchen sind eine eigene Prüfung; ein anderes gut begründetes Ergebnis darf ebenfalls richtig sein.</p>'+
      ['Die Handlung ist in nachvollziehbarer Reihenfolge erzählt.','Meine Formulierungen zeigen mindestens ein Gefühl oder einen Gedanken.','Wichtige Handlungsschritte und der entscheidende Moment sind anschaulich.'].map((label,i)=>checkBox(label,'data-studio-lab-self="'+i+'"',d.checks[i]===true)).join('')+
      '<p id="studio-lab-self-status" role="status">'+d.checks.filter(Boolean).length+' von 3 Kriterien selbst geprüft – keine automatische Benotung.</p>'+
      '<div class="studio-actions"><button type="button" class="secondary" data-studio-view="writer">Eigene Erzählung schreiben</button>'+link('Gefühle und Gedanken üben','hauptteil')+'</div></section>';
  }
  function render(){
    const titles={path:'Dein Lernweg',writer:'Schreiben',exam:'Klassenarbeiten',lab:'Textlabor'};
    root.innerHTML='<div class="studio-app-top"><div><p class="eyebrow">Minka &amp; Fuji · Erzählstudio</p><h1>Deine Erzählwerkstatt</h1><p>Erklärt, geübt und selbst geschrieben – mit verschiedenen Geschichten und Figuren.</p></div><img src="assets/guides.webp" alt="Minka und Fuji begleiten dich als Lernhelfer" width="150" height="150"></div>'+
      '<nav class="studio-tabs" aria-label="Bereiche im Erzählstudio">'+tab('path','Start & Lernweg','🧭')+tab('writer','Schreiben','✏️')+tab('exam','Klassenarbeit','🎓')+tab('lab','Textlabor','🖍️')+'</nav>'+
      '<div id="studio-workspace" aria-label="'+titles[state.view]+'">'+({path:renderPath,writer:renderWriter,exam:renderExam,lab:renderLab}[state.view])()+'</div>'+
      '<p class="studio-storage" id="studio-store" role="status"></p>';
    save();
  }
  function setView(view){if(!['path','writer','exam','lab'].includes(view))return;state.view=view;state.scene=0;render();root.querySelector('#studio-workspace')?.scrollIntoView({block:'start',behavior:'instant'});}
  function safeFile(kind){
    if(kind==='writer'){const s=story(),d=draft();return {name:'Meine_Erzaehlung_Minka_Fuji.txt',text:s.name+'\n\n'+fullDraft(d)+'\n\nMEIN ERZÄHLPLAN\n'+planFields.map(([k,l])=>l+'\n'+(d.plan?.[k]||'')).join('\n\n')+'\n\nEigener Entwurf, keine automatische Benotung.'};}
    const s=exam(),d=examDraft();return {name:'Meine_Deutsch_Uebungsklassenarbeit.txt',text:s.kind+': '+s.title+'\n'+(s.words.length?'Reizwörter: '+s.words.join(', '):s.panels.map((x,i)=>(i+1)+'. '+x[1]+': '+x[2]).join('\n'))+'\n'+s.task+'\n\n'+(d.title||'Meine Geschichte')+'\n\n'+(d.text||'')+'\n\nSELBSTKONTROLLE\n'+data.rubric.map((r,i)=>r.name+': '+(Number.isInteger(d.ratings?.[i])?d.ratings[i]+'/2':'nicht geprüft')).join('\n')+'\n\nKeine automatische Bewertung.'};
  }
  function download(kind){
    const f=safeFile(kind),url=URL.createObjectURL(new Blob(['\ufeff',f.text],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download=f.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function print(kind){
    // Die CSS-Druckansicht blendet alle Navigationsbereiche aus und zeigt nur die aktuelle Schülerarbeit.
    const f=safeFile(kind),b=document.getElementById('studio-print-sheet');
    b.innerHTML='<h1>'+esc(kind==='writer'?story().name:exam().title)+'</h1><div class="studio-print-text">'+nl(f.text)+'</div>';
    document.body.classList.add('studio-printing');window.print();
  }
  root.addEventListener('click',ev=>{
    const b=ev.target.closest('button');if(!b||!root.contains(b))return;
    const ds=b.dataset;
    if(ds.studioView){setView(ds.studioView);if(ds.studioFocus==='path')document.getElementById('studio-path-items')?.scrollIntoView({block:'start'});return;}
    if(ds.studioRoute){showPage(ds.studioRoute);return;}
    if(ds.studioScene!==undefined){state.scene=Number(ds.studioScene);render();return;}
    if(ds.studioTag){state.tag=ds.studioTag;render();return;}
    if(ds.studioFragment!==undefined){const d=labDraft();d.marks[ds.studioFragment]=state.tag;d.checked=false;save();render();return;}
    if(ds.studioLabCheck!==undefined){labDraft().checked=true;render();return;}
    if(ds.studioLabClear!==undefined){labDraft().marks={};labDraft().checked=false;render();return;}
    if(ds.studioExamHint!==undefined){const d=examDraft();d.hints=Math.min(3,(Number(d.hints)||0)+1);render();return;}
    if(ds.studioExamSubmit!==undefined){const d=examDraft();if(!String(d.text||'').trim())return;d.submitted=true;d.ratings=[];render();document.getElementById('studio-exam-review')?.scrollIntoView({block:'start'});return;}
    if(ds.studioExamReset!==undefined){if(!confirm('Die aktuelle Aufgabenbearbeitung einschließlich Text wirklich löschen?'))return;state.exams[state.examId]={text:'',title:'',submitted:false,hints:0,ratings:[]};render();return;}
    if(ds.studioDownload){download(ds.studioDownload);return;}
    if(ds.studioPrint){print(ds.studioPrint);return;}
  });
  root.addEventListener('change',ev=>{
    const el=ev.target,d=el.dataset;
    if(el.id==='studio-picker'){
      if(state.view==='writer')state.storyId=el.value;
      else if(state.view==='exam')state.examId=el.value;
      else if(state.view==='lab')state.labId=el.value;
      state.scene=0;render();return;
    }
    if(el.name==='studio-exam-mode'){state.examMode=el.value==='simulation'?'simulation':'practice';render();return;}
    if(d.studioPathCheck!==undefined){state.pathDone[d.studioPathCheck]=el.checked;render();return;}
    if(d.studioWriterCheck!==undefined){draft().checks[Number(d.studioWriterCheck)]=el.checked;save();const x=root.querySelector('#studio-writer-checkinfo');if(x)x.textContent=draft().checks.filter(Boolean).length+' von '+writerChecks.length+' selbst geprüft · keine automatische Benotung.';return;}
    if(d.studioRating!==undefined){const n=Number(d.studioRating),x=examDraft();x.ratings[n]=el.value===''?null:Number(el.value);render();return;}
    if(d.studioLabSelf!==undefined){const v=labDraft();v.checks[Number(d.studioLabSelf)]=el.checked;save();const info=document.getElementById('studio-lab-self-status');info.textContent=v.checks.filter(Boolean).length+' von 3 Kriterien selbst geprüft – keine automatische Benotung.';return;}
  });
  root.addEventListener('input',ev=>{
    const el=ev.target,d=el.dataset;
    if(d.studioPlan){draft().plan[d.studioPlan]=el.value.slice(0,450);save();return;}
    if(d.studioPart){const x=draft();x.parts[d.studioPart]=el.value.slice(0,12000);x.checks=[];save();root.querySelectorAll('[data-studio-writer-check]').forEach(c=>c.checked=false);
      const n=document.getElementById('studio-writer-words'),preview=document.getElementById('studio-writer-preview'),msg=document.getElementById('studio-writer-checkinfo');
      if(n)n.textContent=words(fullDraft(x))+' Wörter · Der Hauptteil sollte genügend Raum bekommen.';
      if(preview)preview.textContent=fullDraft(x)||'Deine Geschichte erscheint hier, sobald du zu schreiben beginnst.';
      if(msg)msg.textContent='Text geändert: Überprüfung noch offen.';return;}
    if(d.studioExamText!==undefined||d.studioExamTitle!==undefined){
      const x=examDraft();if(d.studioExamText!==undefined)x.text=el.value.slice(0,20000);else x.title=el.value.slice(0,160);
      x.submitted=false;x.ratings=[];save();
      const count=document.getElementById('studio-exam-words');if(count)count.textContent=words(x.text)+' Wörter';
      const submit=root.querySelector('[data-studio-exam-submit]');if(submit)submit.disabled=!String(x.text||'').trim();
      const review=root.querySelector('#studio-exam-review');if(review)review.remove();return;
    }
    if(d.studioLabRevision!==undefined){const x=labDraft();x.revision=el.value.slice(0,12000);x.checks=[];save();root.querySelectorAll('[data-studio-lab-self]').forEach(c=>c.checked=false);
      const msg=document.getElementById('studio-lab-self-status');if(msg)msg.textContent='Text geändert: Prüfe deine Überarbeitung erneut.';}
  });
  document.addEventListener('learningpagechange',e=>{if(e.detail.id!=='studio')document.body.classList.remove('studio-printing');});
  window.addEventListener('afterprint',()=>document.body.classList.remove('studio-printing'));
  window.addEventListener('pagehide',save);
  render();
  if(!location.hash||location.hash==='#studio')showPage('studio',false);
})();
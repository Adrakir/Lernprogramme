'use strict';
/* Erzählwerkstatt Ausbau: explizite Selbstprüfung statt automatischer Bewertung. */
window.MF_UPGRADE=(()=>{
 const D=window.MF_UPGRADE_DATA,R=document.getElementById('studio-app');if(!D||!R)return null;
 const KEY='mf-deutsch-ausbau-v1',BACKUP_KEYS=['minka-fuji-studio-v1','mf-deutsch-akademie-v1','mf-deutsch-textlupe-v1','minka-fuji-lehrgang-v1','minka-fuji-hauptteil-v1',KEY];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const blank=()=>({scene:'leuchtturm',order:['peak','intro','thought','trigger','ending','obstacle','resolution'],notes:{},diagnostic:{},analysis:'',conference:{},planDone:{},voiceIndex:0,teacher:{title:'',focus:['aufbau','spannung'],level:'mittel',minutes:45,scene:'leuchtturm',extra:''},readingText:'',readingAt:-1});
 let S=blank();try{const old=JSON.parse(localStorage.getItem(KEY)||'null');if(old&&typeof old==='object')S={...blank(),...old,notes:old.notes||{},diagnostic:old.diagnostic||{},conference:old.conference||{},planDone:old.planDone||{},teacher:{...blank().teacher,...old.teacher}};}catch{}
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));return true;}catch{return false;}};
 const scene=()=>D.sequences.find(x=>x.id===S.scene)||D.sequences[0];
 const storyState=()=>{try{return JSON.parse(localStorage.getItem('minka-fuji-studio-v1')||'{}');}catch{return {};}};
 const acadState=()=>{try{return JSON.parse(localStorage.getItem('mf-deutsch-akademie-v1')||'{}');}catch{return {};}};
 const loadStoryText=()=>{
   const st=storyState(),id=st.storyId||window.MF_STUDIO_DATA?.stories?.[0]?.id;
   const parts=st.stories?.[id]?.parts||{};
   return [parts.intro,parts.body,parts.end].filter(Boolean).join('\n\n').trim();
 };
 const loadExamText=()=>{
   const st=storyState();return String(st.exams?.[st.examId]?.text||'').trim();
 };
 const skills=()=>window.MF_ACADEMY_DATA?.skills||[];
 const card=id=>D.cards.find(x=>x.id===id);
 const label=title=>'<p class="eyebrow">'+title+'</p>';
 const next=(id)=>R.querySelector('.studio-tabs [data-studio-view="'+id+'"]')?.click();
 function art(st,index){
   const tone={coast:['#d2ecf4','#76bfd4','#efcea2','#52788c'],school:['#d9e6ed','#c5b3a6','#e7c8a0','#536f91'],forest:['#d7e7d2','#7eae8e','#bca68b','#456b61']}[st.theme];
   const [sky,mid,ground,edge]=tone,scene=st.scenes[index],id=st.id;
   const p=(x,y,col='#d7b48f',shirt='#c66e69',flip=false)=>'<g transform="translate('+x+' '+y+') scale('+(flip?'-1':'1')+' 1)"><ellipse cx="0" cy="-36" rx="11" ry="13" fill="'+col+'"/><path d="M-12 -42Q-15 -59 -1 -55Q15 -55 13 -43L6 -48Z" fill="#443a3b"/><path d="M-12 -20Q0 -27 13 -20L15 14L-16 14Z" fill="'+shirt+'" stroke="#46506c" stroke-width="1.5"/><path d="M-8 14L-12 38M8 14L13 38M-12 -11L-28 11M13 -11L26 9" stroke="#455870" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="-4" cy="-36" r="1.3" fill="#28374b"/><circle cx="4" cy="-36" r="1.3" fill="#28374b"/></g>';
   const deco=id==='leuchtturm'?'<path d="M0 126Q90 112 161 126T320 128V178H0Z" fill="#4e93b0"/><path d="M207 126L218 54L249 54L264 126Z" fill="#f2e4cc" stroke="#405f76" stroke-width="4"/><rect x="213" y="46" width="43" height="12" fill="#d3836a"/><path d="M217 46L222 30H248L253 46Z" fill="#476888"/><rect x="226" y="63" width="16" height="20" rx="3" fill="#5d84ab"/><path d="M228 78L180 97M240 78L295 100" stroke="#ffe9a4" stroke-width="8" opacity=".28"/><path d="M40 130Q85 110 108 122T165 120" fill="none" stroke="#f7f1d8" stroke-width="5"/>':
    id==='turnhalle'?'<rect x="0" y="18" width="320" height="129" fill="#d9c6b3"/><path d="M0 38H320M0 80H320M0 128H320" stroke="#9f8e86" stroke-width="3"/><rect x="210" y="32" width="72" height="96" rx="5" fill="#6186a5" stroke="#395973" stroke-width="4"/><rect x="16" y="30" width="65" height="41" fill="#9ccddd" stroke="#f1e7d7" stroke-width="5"/><path d="M0 145H320" stroke="#9c855f" stroke-width="9"/>':
    '<path d="M0 138Q75 122 149 137T320 128V178H0Z" fill="#85a96e"/>'+[35,94,180,251,310].map((x,i)=>'<path d="M'+x+' 130V'+(58-i%2*15)+'" stroke="#6e6559" stroke-width="11"/><path d="M'+(x-30)+' '+(67-i%2*15)+'Q'+x+' '+(2-i%2*15)+' '+(x+30)+' '+(67-i%2*15)+'Z" fill="'+(i%2?'#477b61':'#639673')+'"/>').join('');
   const props={
    path:'<path d="M5 148L75 128L125 148" fill="none" stroke="#e7dfbb" stroke-width="7"/>',
    light:'<path d="M229 60L150 98L160 114L234 79Z" fill="#f9e79a" opacity=".65"/>',
    footprints:'<g fill="#5b6f65">'+[0,1,2,3].map(i=>'<ellipse cx="'+(111+i*22)+'" cy="'+(151-i*5)+'" rx="5" ry="2" transform="rotate(-24 '+(111+i*22)+' '+(151-i*5)+')"/>').join('')+'</g>',
    door:'<rect x="221" y="93" width="28" height="35" rx="2" fill="#9a7055"/><circle cx="242" cy="111" r="2" fill="#f5dc97"/>',
    phone:'<rect x="113" y="96" width="17" height="29" rx="4" fill="#344f70"/><rect x="116" y="100" width="11" height="20" rx="2" fill="#a8cde8"/>',
    help:'<path d="M120 133L129 119L137 133" fill="none" stroke="#eeddb3" stroke-width="5"/>',
    ball:'<circle cx="130" cy="141" r="13" fill="#f0b97b" stroke="#7e6771" stroke-width="3"/><path d="M121 137L138 147M128 129L132 152" stroke="#7e6771" stroke-width="2"/>',
    notes:'<g fill="#343b66"><text x="154" y="70" font-size="30">♫</text><text x="190" y="91" font-size="20">♪</text></g>',
    bag:'<rect x="139" y="125" width="37" height="24" rx="5" fill="#5681a4"/><path d="M147 126Q158 112 169 126" stroke="#344763" fill="none" stroke-width="4"/>',
    speech:'<path d="M165 55H254Q270 55 270 72V88H194L181 103V88H165Z" fill="#f6f6e8" stroke="#66778d" stroke-width="3"/><text x="180" y="78" fill="#28334a" font-size="13">Hallo?</text>',
    teacher:'<path d="M168 135L191 129" stroke="#f0f0dd" stroke-width="5"/>',
    medal:'<circle cx="157" cy="113" r="17" fill="#f3c36d"/><path d="M147 100L141 81L157 90L169 81L167 100" fill="#8c9bc4"/>',
    map:'<path d="M94 119L125 106L150 115L176 108V149L147 153L126 145L97 153Z" fill="#e6d9a5" stroke="#55747a" stroke-width="2"/><path d="M125 107V145M149 115V152" fill="none" stroke="#719b92"/><path d="M120 130L132 139L161 123" fill="none" stroke="#c46f65" stroke-width="4"/>',
    sign:'<path d="M173 91V152" stroke="#735a48" stroke-width="6"/><path d="M146 90L203 85L194 106L149 110Z" fill="#dbc69a" stroke="#715c4f" stroke-width="2"/>',
    cross:'<path d="M156 102L171 120M171 102L156 120" stroke="#db6b5f" stroke-width="7" stroke-linecap="round"/>',
    water:'<path d="M60 144Q90 132 120 144T180 144T260 144" fill="none" stroke="#a0c7d6" stroke-width="8"/>',
    compass:'<circle cx="158" cy="122" r="19" fill="#e5e5da" stroke="#5b7392" stroke-width="3"/><path d="M158 106L164 124L158 136L152 124Z" fill="#d87970"/>',
    bridge:'<path d="M98 139Q162 104 220 139M98 139H220" fill="none" stroke="#a17f5e" stroke-width="10"/><path d="M120 130V153M150 119V153M184 119V153M205 132V153" stroke="#947457" stroke-width="5"/>'
   };
   const bg='<defs><linearGradient id="sky'+id+index+'" x1="0" x2="0" y1="0" y2="1"><stop stop-color="'+sky+'"/><stop offset="1" stop-color="'+mid+'"/></linearGradient></defs><rect width="320" height="180" rx="10" fill="url(#sky'+id+index+')"/>'+
       '<circle cx="55" cy="37" r="22" fill="#fff0c7" opacity=".7"/><path d="M0 152Q90 141 160 153T320 148V180H0" fill="'+ground+'"/>'+deco;
   const light=index===3?'<rect width="320" height="180" fill="#35435b" opacity=".12"/>':'';
   return '<svg viewBox="0 0 320 180" role="img" aria-label="'+esc(scene.title)+': '+esc(scene.action)+'" xmlns="http://www.w3.org/2000/svg">'+bg+light+
      p(66+(index%2)*8,128,index%2?'#d7b592':'#c58e73',id==='turnhalle'?'#649b8b':'#b95c67')+
      p(102+(index%2)*10,136,'#b48368','#dca74f',true)+(props[scene.prop]||'')+
      '<rect x="1.5" y="1.5" width="317" height="177" rx="9" fill="none" stroke="'+edge+'" stroke-width="3"/></svg>';
 }
 const writing=()=>String(S.analysis||'').trim();
 function metrics(raw){
  const text=String(raw||'').trim(),segments=text.split(/(?<=[.!?])\s+/u).filter(Boolean),words=text.match(/\p{L}+(?:[’-]\p{L}+)*/gu)||[];
  const starts=segments.map(s=>(s.match(/^\s*[„"']?[\p{L}]+/u)||[''])[0].toLocaleLowerCase('de'));
  const frequent=Object.entries(starts.reduce((a,v)=>(a[v]=(a[v]||0)+1,a),{})).filter(([k,n])=>k&&n>=3).sort((a,b)=>b[1]-a[1]);
  const then=(text.match(/\bdann\b/giu)||[]).length;
  const vague=(text.match(/\b(ging|gingen|sagte|sagten|schön|toll|machte|machen)\b/giu)||[]);
  const para=text.split(/\n\s*\n/u).filter(x=>x.trim()).length;
  const long=segments.map(x=>(x.match(/\p{L}+/gu)||[]).length).filter(x=>x>28).length;
  const notes=[];
  if(frequent.length)notes.push({id:'start',skill:'sprache',title:'Gleiche Satzanfänge',evidence:'„'+frequent[0][0]+'“ beginnt '+frequent[0][1]+' Sätze.',why:'Wiederholungen wirken manchmal absichtlich; häufig machen wechselnde Satzanfänge den Text lebendiger.',try:'Beginne einen Satz mit einer Zeitangabe oder einem Sinneseindruck.'});
  if(then>=3)notes.push({id:'then',skill:'sprache',title:'Viele „dann“',evidence:'Du nutzt „dann“ '+then+'-mal.',why:'Eine Abfolge wird klarer, wenn man auch Ursachen, Orte oder Gefühle verbindet.',try:'Probiere „In diesem Augenblick“, „Am Tor“ oder „Deshalb“ – nur wo es passt.'});
  if(vague.length>=2)notes.push({id:'verbs',skill:'sprache',title:'Allgemeine Wörter',evidence:'Gefunden: '+[...new Set(vague.map(x=>x.toLowerCase()))].join(', ')+'.',why:'Treffende Verben und konkrete Beobachtungen machen Bilder im Kopf.',try:'Statt „ging“: schlich, stolperte oder eilte – passend zur Figur.'});
  if(para<2&&words.length>=75)notes.push({id:'paragraphs',skill:'schluss',title:'Absätze prüfen',evidence:'Dein Text enthält '+para+' zusammenhängenden Textblock.',why:'Ein Absatz bei Orts-, Zeit- oder Handlungswechseln erleichtert das Lesen.',try:'Prüfe, wo die Einleitung endet und der wichtige Moment beginnt.'});
  if(long>=2)notes.push({id:'length',skill:'sprache',title:'Lange Sätze',evidence:long+' Sätze haben mehr als 28 Wörter.',why:'Lange Sätze können gut sein, aber bei wichtigen Handlungsschritten helfen kurze Pausen.',try:'Teile einen langen Satz in zwei sinnvolle Schritte.'});
  if(words.length>65&&!/[„“"]/.test(text))notes.push({id:'speech',skill:'sprache',title:'Wörtliche Rede erwägen',evidence:'In diesem Text sind keine Anführungszeichen zu sehen.',why:'Nicht jede Geschichte braucht Dialog. Ein Gespräch kann eine Entscheidung jedoch anschaulich machen.',try:'Lass eine Figur an einer passenden Stelle etwas sagen und prüfe die Zeichen.'});
  if(!notes.length&&words.length>=45)notes.push({id:'positive',skill:'schluss',title:'Keine einfachen Wiederholungsmuster erkannt',evidence:'Der Regel-Check hat keine auffällige Häufung gefunden.',why:'Das sagt nichts über Spannung, Logik oder die Qualität der Geschichte.',try:'Prüfe mit der Textlupe, ob deine Geschichte einen vorbereiteten Höhepunkt hat.'});
  return {count:words.length,sentences:segments.length,paras:para,notes,then};
 }
 function panelAnalysis(){
  const m=metrics(writing());
  return '<section id="up-feedback-analysis" class="panel up-analysis"><h3>Schreibcoach: Textmerkmale entdecken</h3><p>Der regelbasierte Coach sucht einfache Muster. Er beurteilt <strong>keine</strong> Handlung, Gefühle oder Rechtschreibung und vergibt keine Note.</p>'+
   '<div class="up-actions"><button type="button" class="secondary" data-up-load="writer">Meine Schreibwerkstatt übernehmen</button><button type="button" class="secondary" data-up-load="exam">Meine Klassenarbeit übernehmen</button><button type="button" class="secondary" data-up-load="sample">Beispieltext einsetzen</button></div>'+
   '<label for="up-analyse-text"><strong>Deinen Text hier untersuchen</strong></label><textarea id="up-analyse-text" rows="9" maxlength="20000" placeholder="Deine Geschichte …">'+esc(S.analysis||'')+'</textarea>'+
   '<p id="up-analyse-count" class="muted">'+m.count+' Wörter · '+m.sentences+' mögliche Sätze · '+m.paras+' Textabschnitte</p>'+
   '<div id="up-analysis-notes">'+noteMarkup(m)+'</div>'+
   '<div class="up-actions"><button type="button" class="secondary" data-up-readsource>Text im Lesetandem vorlesen</button><button type="button" class="primary" data-up-revision>Mit einer Überarbeitung beginnen</button></div></section>';
 }
 function noteMarkup(m){
  return m.count<12?'<p class="up-advice">Schreibe mindestens ein paar zusammenhängende Sätze. Dann werden Hinweise zu wiederkehrenden Mustern angezeigt.</p>':
   '<div class="up-results">'+m.notes.map(n=>'<article class="up-advice"><strong>'+esc(n.title)+'</strong><p>'+esc(n.evidence)+'</p><p><b>Warum?</b> '+esc(n.why)+'</p><p><b>Versuch:</b> '+esc(n.try)+'</p></article>').join('')+'</div>';
 }
 function graphicPicker(){
   const st=scene();return '<div class="up-gallery"><label for="up-scene"><strong>Wähle eine Bildgeschichte</strong></label><select id="up-scene">'+D.sequences.map(x=>'<option value="'+x.id+'" '+(x.id===st.id?'selected':'')+'>'+esc(x.title)+' · '+esc(x.level)+'</option>').join('')+'</select>'+
    '<p><strong>Erzählfrage:</strong> '+esc(st.goal)+'</p><div class="up-scenes">'+st.scenes.map((s,i)=>'<article class="up-scene"><button type="button" class="up-zoom" data-up-zoom="'+i+'" aria-label="Bild '+(i+1)+' vergrößern">'+art(st,i)+'</button><div class="up-scene-caption"><strong>'+(i+1)+'. '+esc(s.title)+'</strong><p>'+esc(s.action)+'</p><small>'+esc(s.detail)+'</small></div></article>').join('')+'</div></div>';
 }
 function builder(){
   const order=S.order||[],st=scene();
   return '<div class="studio-section-intro"><h2>Geschichtenbaukasten und Bilderkino</h2><p>Entdecke die sechsteilige Bilderfolge. Setze danach Handlungskarten in eine Reihenfolge, die du begründen kannst. Nicht jede gute Erzählung muss exakt gleich aufgebaut sein.</p></div>'+
    graphicPicker()+'<section class="panel"><h3>Meine Handlungskarten</h3><p>Verschiebe Karten per Ziehen oder mit den Pfeiltasten. Entscheidend ist, ob Ursache und Wirkung für Leser verständlich sind.</p>'+
    '<ol id="up-card-list" class="up-card-list">'+order.map((id,i)=>{const x=card(id);return '<li draggable="true" data-up-card="'+esc(id)+'"><span class="up-drag" aria-hidden="true">⋮⋮</span><div><strong>'+esc(x.title)+'</strong><p>'+esc(x.question)+'</p></div><div class="up-move"><button type="button" data-up-move="'+i+':-1" '+(i===0?'disabled':'')+' aria-label="'+esc(x.title)+' nach oben">↑</button><button type="button" data-up-move="'+i+':1" '+(i===order.length-1?'disabled':'')+' aria-label="'+esc(x.title)+' nach unten">↓</button></div></li>';}).join('')+'</ol>'+
    '<h3>Die einzelnen Szenen planen</h3><div class="up-notes">'+D.cards.map(x=>'<label><strong>'+esc(x.title)+': '+esc(x.question)+'</strong><textarea data-up-note="'+x.id+'" rows="2" maxlength="900" placeholder="'+esc(x.hint)+'">'+esc(S.notes?.[x.id]||'')+'</textarea></label>').join('')+'</div>'+
    '<div class="up-actions"><button type="button" class="primary" data-up-plancheck>Meinen Plan überprüfen</button><button type="button" class="secondary" data-up-exportplan>Plan als Text speichern</button></div>'+
    '<div id="up-plan-feedback" role="status"></div></section>'+
    '<section class="panel"><h3>Von der Bildgeschichte zur Erzählung</h3><p>Übernimm nicht einfach jede Bildunterschrift. Ergänze Gedanken, Gefühle, einen vorbereiteten Höhepunkt und eigene Formulierungen. Benutze anschließend die Schreibwerkstatt.</p><button type="button" class="primary" data-up-route="writer">Jetzt eine vollständige Erzählung schreiben</button></section>';
 }
 function writingEvaluation(){
  const a=acadState(),answer=a.diagnostic?.answers||{},tests=window.MF_ACADEMY_DATA?.diagnostics||[],rated={};
  for(const q of tests){const v=answer[q.id];if(v===q.right)rated[q.skill]=(rated[q.skill]||0)+1;}
  const rows=skills().map(s=>{const written=D.writingTasks.filter(q=>q.focus===s.id&&S.diagnostic?.[q.id]?.checked);
    const self=written.length?Number(S.diagnostic[written[0].id].rating):-1;
    const theory=rated[s.id]||0;
    const attempted=tests.some(q=>q.skill===s.id&&Number.isInteger(answer[q.id]));
    return {...s,theory,attempted,writing:self,done:!!S.planDone[s.id]};});
  const priority=rows.filter(x=>(x.attempted&&x.theory<2)||(x.writing>=0&&x.writing<2)),rest=rows.filter(x=>!priority.includes(x));
  return {priority,rest,rows};
 }
 function pathway(){
  const e=writingEvaluation();
  return '<section id="up-feedback-path" class="panel up-path"><h3>Dein persönlicher Übungsweg</h3><p>Vorschläge aus den Auswahlaufgaben und deiner freiwilligen Einschätzung kurzer Schreibtexte. Kein automatischer Nachweis und keine Schulnote.</p>'+
    '<div class="up-path-grid">'+[...e.priority,...e.rest].map(x=>'<article class="up-path-card '+(x.done?'up-done':'')+'"><span class="up-priority">'+(e.priority.includes(x)?'Jetzt vertiefen':x.attempted||x.writing>=0?'Danach wiederholen':'Noch nicht geprüft')+'</span><h4>'+esc(x.name)+'</h4><p>Wissen: '+(x.attempted?x.theory+'/2 passende Antworten':'noch nicht geprüft')+(x.writing>=0?' · Schreibprobe selbst eingeschätzt: '+x.writing+'/2':' · noch keine Schreibprobe')+'</p><p>'+esc(x.tip)+'</p><div class="up-actions"><button type="button" class="secondary" data-up-train="'+esc(x.id)+'">Passende Aufgabe</button><label class="up-done-label"><input type="checkbox" data-up-done="'+esc(x.id)+'" '+(x.done?'checked':'')+'> Geübt</label></div></article>').join('')+'</div></section>';
 }
 function writingDiag(){
  return '<section id="up-feedback-writing" class="panel"><h3>Schreibproben statt nur Ankreuzen</h3><p>Schreibe drei kurze selbstständige Texte. Markiere anschließend eine echte Textstelle als Beleg für dein Kriterium. Die Selbsteinschätzung dient nur der Übungsplanung.</p>'+
    D.writingTasks.map(t=>{const r=S.diagnostic[t.id]||{};
      return '<div class="up-writing-prompt"><h4>'+esc(t.title)+'</h4><p>'+esc(t.intro)+'</p><p><strong>Auftrag:</strong> '+esc(t.goal)+'</p>'+
       '<textarea data-up-draft="'+t.id+'" rows="4" maxlength="4500" placeholder="Deine eigene Antwort …">'+esc(r.text||'')+'</textarea>'+
       '<label>Textstelle als Beleg (aus deinem Text abschreiben)<input data-up-evidence="'+t.id+'" value="'+esc(r.evidence||'')+'" maxlength="350" placeholder="Eine genaue Stelle aus deinem Text"></label>'+
       '<label>Meine Einschätzung<select data-up-rating="'+t.id+'"><option value="">Noch nicht einschätzen</option><option value="0" '+(r.rating==='0'?'selected':'')+'>0 – noch nicht gelungen</option><option value="1" '+(r.rating==='1'?'selected':'')+'>1 – teilweise gelungen</option><option value="2" '+(r.rating==='2'?'selected':'')+'>2 – überwiegend gelungen</option></select></label>'+
       '<button type="button" class="secondary" data-up-checkwriting="'+t.id+'">Mit Textbeleg übernehmen</button><p id="up-write-status-'+t.id+'" role="status">'+(r.checked?'Textbeleg hinterlegt. Deine Einschätzung kann für den Übungsweg genutzt werden.':'Noch keine belegte Selbsteinschätzung.')+'</p></div>';}).join('')+'</section>';
 }
 function conference(){
  const t=D.conference;
  return '<section id="up-feedback-conf" class="panel"><h3>Schreibkonferenz: Als Textdetektiv arbeiten</h3><p>Lies die Beispielgeschichte. Markiere durch Antippen eine Stelle. Erkläre, was gelungen ist oder überarbeitet werden sollte.</p>'+
   '<div class="up-conf-text">'+t.comments.map((x,i)=>'<button type="button" class="up-conf-line '+(S.conference.selected===i?'active':'')+'" data-up-conf="'+i+'">'+esc(x.quote)+'</button>').join(' ')+'</div>'+
   (Number.isInteger(S.conference.selected)?(()=>{const e=t.comments[S.conference.selected];return '<div class="up-conf-feedback"><strong>'+esc(e.label)+'</strong><p>'+esc(e.hint)+'</p><label>Mein Verbesserungsvorschlag<textarea data-up-conftext rows="3" maxlength="1200">'+esc(S.conference['text'+S.conference.selected]||'')+'</textarea></label></div>';})():'<p class="muted">Wähle eine Textstelle, um den passenden Hinweis zu entdecken.</p>')+
   '<p>Regel für die Konferenz: Zuerst etwas Gelungenes nennen, dann einen konkreten Verbesserungsvorschlag machen.</p></section>';
 }
 function feedback(){
  return '<div class="studio-section-intro"><h2>Schreibcoach, Diagnose und Übungsplan</h2><p>Erkenne Sprachmuster in deinem Text, belege selbst die Wirkung und übe gezielt an deinen Schwierigkeiten. Es gibt keine vorgetäuschte KI-Korrektur.</p><nav aria-label="Werkzeuge in diesem Bereich" class="up-jump-nav"><button data-up-jump="up-feedback-analysis">Text überprüfen</button><button data-up-jump="up-feedback-writing">Schreibproben</button><button data-up-jump="up-feedback-path">Mein Lernplan</button><button data-up-jump="up-feedback-conf">Schreibkonferenz</button></nav></div>'+
   panelAnalysis()+writingDiag()+pathway()+conference();
 }
 const sentences=text=>{
  const raw=String(text||'').replace(/\r/g,'').trim(),parts=raw.match(/[^.!?\n]+(?:[.!?]+|(?=\n|$))/gu)||[];
  return parts.map(x=>x.trim()).filter(Boolean).slice(0,160);
 };
 let reader={token:0,index:0,lines:[],paused:false};
 function drawReader(){
   const list=sentences(S.readingText);const el=R.querySelector('#up-read-lines');
   if(el)el.innerHTML=list.length?list.map((x,i)=>'<button type="button" class="up-read-line '+(i===reader.index&&reader.lines.length?'playing':'')+'" data-up-sentence="'+i+'" aria-current="'+(i===reader.index&&reader.lines.length?'true':'false')+'">'+esc(x)+'</button>').join(''):'<p>Übernimm eine Geschichte aus der Schreibwerkstatt oder füge Text ein.</p>';
 }
 function stopRead(){reader.token++;reader.lines=[];reader.index=0;reader.paused=false;try{window.speechSynthesis?.cancel();}catch{}const s=R.querySelector('#up-read-status');if(s)s.textContent='Vorlesen angehalten.';drawReader();}
 function readStep(token){
   if(token!==reader.token||reader.paused)return;
   if(reader.index>=reader.lines.length){const s=R.querySelector('#up-read-status');if(s)s.textContent='Alle Sätze vorgelesen.';reader.lines=[];drawReader();return;}
   drawReader();
   const status=R.querySelector('#up-read-status');if(status)status.textContent='Satz '+(reader.index+1)+' von '+reader.lines.length+' wird vorgelesen.';
   if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){if(status)status.textContent='Dieser Browser hat keine Sprachausgabe. Antippen hebt den Satz trotzdem hervor.';return;}
   const u=new SpeechSynthesisUtterance(reader.lines[reader.index]);u.lang='de-DE';u.rate=0.88;
   u.onend=()=>{if(token===reader.token){reader.index++;readStep(token);}};
   u.onerror=()=>{if(token===reader.token&&status)status.textContent='Die Stimme ist nicht verfügbar. Du kannst einzelne Sätze trotzdem auswählen.';};
   try{window.speechSynthesis.speak(u);}catch{}
 }
 function beginRead(index=0){stopRead();reader.lines=sentences(S.readingText);reader.index=index;reader.paused=false;const token=reader.token;readStep(token);}
 function reading(){
   return '<section class="panel up-reading"><h2>Lesetandem: jeden Satz verstehen</h2><p>Lies deine eigene Geschichte oder eine Beispielgeschichte. Beim Vorlesen wird jeweils ein Satz hervorgehoben; tippe auf einen Satz, um ihn einzeln zu hören.</p>'+
    '<div class="up-actions"><button type="button" class="secondary" data-up-loadreading="writer">Geschichte übernehmen</button><button type="button" class="secondary" data-up-loadreading="analysis">Text aus dem Coach übernehmen</button></div>'+
    '<label for="up-reading-text">Text für die Leseansicht</label><textarea id="up-reading-text" rows="5" maxlength="20000">'+esc(S.readingText||'')+'</textarea>'+
    '<div class="up-actions"><button type="button" class="primary" data-up-read="start">Alles vorlesen</button><button type="button" class="secondary" data-up-read="pause">Pause</button><button type="button" class="secondary" data-up-read="resume">Weiter</button><button type="button" class="secondary" data-up-read="stop">Stopp</button></div>'+
    '<p role="status" id="up-read-status">Die Sprache wird auf dem Gerät erzeugt. Stimmen können je nach Browser unterschiedlich klingen.</p>'+
    '<div id="up-read-lines" class="up-read-lines"></div></section>';
 }
 function backup(){
  let counts=0;for(const key of BACKUP_KEYS)try{if(localStorage.getItem(key))counts++;}catch{}
  return '<section class="panel"><h2>Datensicherung und Gerätewechsel</h2><p>Deine Entwürfe liegen lokal auf diesem Gerät. Mit einer JSON-Sicherungsdatei kannst du Lernstände auf ein anderes Gerät übertragen, ohne Anmeldung oder Cloud-Konto.</p>'+
   '<p><strong>'+counts+' von '+BACKUP_KEYS.length+'</strong> Lernspeicher-Bereichen belegt.</p>'+
   '<div class="up-actions"><button type="button" class="primary" data-up-backup>Alle Deutsch-Lernstände als JSON sichern</button><label class="up-import-label">Sicherung importieren<input id="up-import" type="file" accept=".json,application/json"></label></div>'+
   '<p id="up-backup-status" role="status">Ein Import ersetzt die vorhandenen Deutsch-Lernstände nach einer Sicherheitsabfrage. Speichere vorher gegebenenfalls eine eigene Sicherung.</p>'+
   '<p class="muted">Keine automatische Synchronisierung. Die Datei kann persönliche Schülertexte enthalten: nur auf vertrauten Geräten speichern oder weitergeben. Es werden ausschließlich die bekannten Deutsch-App-Speicherbereiche gesichert.</p></section>';
 }
 function portfolio(){
  return '<div class="studio-section-intro"><h2>Mein Schreibportfolio</h2><p>Höre deine Geschichte Satz für Satz, kontrolliere den Lernstand und sichere Entwürfe für einen Gerätewechsel.</p></div>'+reading()+backup();
 }
 function teacherAddon(){
   const t=S.teacher;return '<section class="panel up-teacher"><h3>Eigene Klassenarbeit zusammenstellen</h3><p>Fachliche Schwerpunkte auswählen und Schüler- und Lehrerblätter getrennt erstellen. Der Erwartungshorizont enthält Leitfragen und keine einzig zulässige Mustererzählung.</p>'+
    '<label>Titel der Klassenarbeit<input id="up-teacher-title" maxlength="120" value="'+esc(t.title)+'" placeholder="z. B. Geheimnis am Leuchtturm"></label>'+
    '<div class="up-teacher-options"><label>Bildgeschichte<select id="up-teacher-scene">'+D.sequences.map(s=>'<option value="'+s.id+'" '+(s.id===t.scene?'selected':'')+'>'+esc(s.title)+'</option>').join('')+'</select></label>'+
    '<label>Schwierigkeitsgrad<select id="up-teacher-level">'+['grundlegend','mittel','anspruchsvoll'].map(s=>'<option '+(s===t.level?'selected':'')+'>'+s+'</option>').join('')+'</select></label>'+
    '<label>Orientierungszeit<select id="up-teacher-minutes">'+[30,40,45,50,60].map(n=>'<option value="'+n+'" '+(n===Number(t.minutes)?'selected':'')+'>'+n+' Minuten</option>').join('')+'</select></label></div>'+
    '<fieldset><legend>Kompetenzen dieser Arbeit</legend><div class="up-focus-list">'+D.teacherFocus.map(s=>'<label><input type="checkbox" data-up-focus="'+s.id+'" '+(t.focus.includes(s.id)?'checked':'')+'> '+esc(s.name)+'</label>').join('')+'</div></fieldset>'+
    '<label>Zusätzlicher Arbeitsauftrag<textarea id="up-teacher-extra" rows="2" maxlength="1200" placeholder="z. B. Aus der Ich-Perspektive schreiben">'+esc(t.extra)+'</textarea></label>'+
    '<div class="up-actions"><button type="button" class="primary" data-up-print="student">Eigenes Schülerblatt drucken / PDF</button><button type="button" class="secondary" data-up-print="teacher">Erwartungshorizont drucken / PDF</button></div>'+
    '<p class="muted">Schülerblätter enthalten keine Lösung. Im Druckdialog „Als PDF speichern“ wählen.</p></section>';
 }
 function teacherPrint(mode){
   const st=D.sequences.find(x=>x.id===S.teacher.scene)||D.sequences[0],t=S.teacher,focus=D.teacherFocus.filter(x=>t.focus.includes(x.id));
   let sheet=document.getElementById('ac-print-sheet');if(!sheet){sheet=document.createElement('article');sheet.id='ac-print-sheet';document.body.appendChild(sheet);}
   const head='<header><h1>Deutsch · Erzählungen · Klasse 5</h1><p>Bildgeschichte · Niveau '+esc(t.level)+' · Orientierungszeit '+Number(t.minutes)+' Minuten</p></header>';
   const tasks='<h2>'+esc(t.title||st.title)+'</h2><p>Schreibe eine zusammenhängende, spannende Geschichte zu der Bilderfolge. Die Bildunterschriften sind Hilfen, keine Sätze zum Abschreiben. Finde eine eigene Überschrift und erzähle glaubwürdig.</p>'+
   (t.extra?'<p><strong>Zusatz:</strong> '+esc(t.extra)+'</p>':'')+
   '<div class="ac-print-pictures">'+st.scenes.map((s,i)=>'<div><strong>Bild '+(i+1)+' · '+esc(s.title)+'</strong>'+art(st,i)+'</div>').join('')+'</div>'+
   '<p><strong>Schwerpunkte:</strong> '+focus.map(s=>esc(s.name)).join(' · ')+'</p>';
   sheet.innerHTML=mode==='student'?head+'<p>Name: ______________________________ Datum: ______________</p>'+tasks+'<p>Meine Überschrift: ______________________________________________</p>'+Array.from({length:19},()=>'<div class="ac-writing-line"></div>').join(''):
      head+'<h2>Lehrerblatt und Erwartungshorizont</h2>'+tasks+'<ol>'+st.scenes.map((x,i)=>'<li><strong>'+esc(x.title)+':</strong> '+esc(x.action)+' – '+esc(x.detail)+'.</li>').join('')+'</ol>'+
      '<h3>Beobachtungskriterien</h3><ul>'+focus.map(s=>'<li>'+esc(s.name)+': Passende Textstelle erkennbar und nachvollziehbar gestaltet?</li>').join('')+'</ul>'+
      '<p>Die Bilder erlauben andere schlüssige Lösungen. Schriftliche Rückmeldung statt maschinell berechneter Schulnote.</p>';
   document.body.classList.add('ac-printing');try{window.print();}catch{document.body.classList.remove('ac-printing');}
 }
 function saveFile(filename,body,type){const u=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1200);}
 function downloadBackup(){
   const items={};for(const key of BACKUP_KEYS){try{const val=localStorage.getItem(key);if(val!==null)items[key]=val;}catch{}}
   saveFile('Deutsch_Erzaehlwerkstatt_Lernstand_'+new Date().toLocaleDateString('sv-SE')+'.json',JSON.stringify({type:'MF_DEUTSCH_BACKUP',version:1,created:new Date().toISOString(),items},null,2),'application/json;charset=utf-8');
   const el=R.querySelector('#up-backup-status');if(el)el.textContent='Sicherungsdatei wurde erstellt. Bewahre sie an einem sicheren Ort auf.';
 }
 async function importBackup(file){
   const status=R.querySelector('#up-backup-status');if(!file)return;
   if(file.size>2500000){if(status)status.textContent='Datei zu groß (maximal 2,5 MB).';return;}
   let data;try{data=JSON.parse(await file.text());}catch{if(status)status.textContent='Die Datei ist kein gültiges JSON.';return;}
   if(data.type!=='MF_DEUTSCH_BACKUP'||data.version!==1||!data.items||typeof data.items!=='object'){
    if(status)status.textContent='Kein gültiges Deutsch-App-Sicherungsformat.';return;
   }
   const entries=Object.entries(data.items);
   if(!entries.length||entries.some(([k,v])=>!BACKUP_KEYS.includes(k)||typeof v!=='string'||v.length>1500000)){
    if(status)status.textContent='Sicherungsdatei enthält nicht erlaubte oder ungültige Daten.';return;
   }
   for(const [key,value]of entries)try{const v=JSON.parse(value);if(!v||typeof v!=='object')throw Error('invalid');}catch{if(status)status.textContent='Beschädigter Speicherbereich: '+esc(key);return;}
   if(!confirm('Diese Sicherung ersetzt vorhandene Deutsch-Lernstände in diesem Browser. Vorher lieber eine eigene Sicherung anlegen. Wirklich importieren?')){if(status)status.textContent='Import abgebrochen. Es wurde nichts verändert.';return;}
   const previous={};try{for(const [key,value]of entries){previous[key]=localStorage.getItem(key);localStorage.setItem(key,value);}}
   catch{for(const [key,value]of Object.entries(previous)){try{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);}catch{}}if(status)status.textContent='Speichern nicht möglich. Vorherige Daten wurden soweit möglich wiederhergestellt.';return;}
   window.location.reload();
 }
 function move(index,delta){const a=S.order,nextIndex=index+delta;if(index<0||nextIndex<0||nextIndex>=a.length)return;[a[index],a[nextIndex]]=[a[nextIndex],a[index]];save();renderAgain();}
 const planFeedback=()=>{
  const filled=D.cards.filter(x=>S.notes[x.id]?.trim()).length;
  const goodStart=S.order.indexOf('intro')<S.order.indexOf('peak'),goodEnd=S.order.indexOf('peak')<S.order.indexOf('ending');
  return '<div class="up-plan-result"><strong>'+filled+' von 7 Planungspunkten ausgefüllt</strong><p>'+(goodStart?'Die Ausgangslage steht vor dem Höhepunkt.':'Prüfe, ob der Leser die Figuren bereits vor dem entscheidenden Moment kennenlernt.')+'</p><p>'+(goodEnd?'Der Höhepunkt steht vor dem Schluss.':'Die Lösung und der Schluss sollten normalerweise nach dem wichtigsten Moment kommen.')+'</p><p>Zusätzliche Kontrolle: Ist die Entscheidung aus den vorherigen Hinweisen verständlich? Nicht automatisch bewertbar.</p></div>';
 };
 function render(view){if(view==='builder')return builder();if(view==='feedback')return feedback();if(view==='portfolio')return portfolio();return '';}
 function post(root,view){
 if(view==='teacher')root.querySelector('#studio-workspace')?.insertAdjacentHTML('beforeend',teacherAddon());
 if(view==='path'){
  const area=root.querySelector('#studio-workspace');
  area?.insertAdjacentHTML('afterbegin','<section class="panel up-quickstart"><h2>Neu: Deine nächsten Schreibabenteuer</h2><p>Wähle deinen Einstieg. Die bisherigen acht Lernbereiche bleiben erhalten.</p><div class="up-quick-grid"><button type="button" data-up-route="builder"><strong>🧩 Bildergeschichten bauen</strong><span>Sechs Bilder verstehen und den roten Faden planen</span></button><button type="button" data-up-route="feedback"><strong>🔍 Textcoach und Lernplan</strong><span>Eigene Texte verbessern, Schreibproben und Tipps</span></button><button type="button" data-up-route="portfolio"><strong>📚 Mein Portfolio</strong><span>Satzweise vorlesen, Lernstand sichern und übertragen</span></button></div></section>');
 }
 if(view==='portfolio')drawReader();
}
 const click=e=>{
  const b=e.target.closest('button');if(!b||!R.contains(b))return;const d=b.dataset;
  if(d.upRoute){next(d.upRoute);return;}
  if(d.upJump){R.querySelector('#'+d.upJump)?.scrollIntoView({behavior:'smooth',block:'start'});return;}
  if(d.upMove){const [i,v]=d.upMove.split(':').map(Number);move(i,v);return;}
  if(d.upZoom!==undefined){const st=scene(),i=Number(d.upZoom);let dialog=document.getElementById('up-zoom-dialog');if(!dialog){dialog=document.createElement('dialog');dialog.id='up-zoom-dialog';document.body.appendChild(dialog);}
   dialog.innerHTML='<button type="button" data-up-close>Schließen</button><h2>'+esc(st.scenes[i].title)+'</h2>'+art(st,i)+'<p>'+esc(st.scenes[i].action)+'</p>';
   dialog.querySelector('[data-up-close]').onclick=()=>dialog.close();dialog.showModal();return;}
  if(d.upPlancheck!==undefined){const target=R.querySelector('#up-plan-feedback');if(target)target.innerHTML=planFeedback();return;}
  if(d.upExportplan!==undefined){saveFile('Mein_Geschichtenplan.txt',D.cards.map(x=>x.title+'\n'+(S.notes[x.id]||'')+'\n').join('\n'),'text/plain;charset=utf-8');return;}
  if(d.upLoad){S.analysis=d.upLoad==='writer'?loadStoryText():d.upLoad==='exam'?loadExamText():'Dann ging Tim in den Wald. Dann hörte er etwas. Dann ging er weiter. Dann sah er einen Hund.';save();renderAgain();return;}
  if(d.upRevision!==undefined){const el=R.querySelector('#up-analyse-text');if(el)el.focus();return;}
  if(d.upReadsource!==undefined){S.readingText=S.analysis;save();next('portfolio');return;}
  if(d.upCheckwriting){const t=d.upCheckwriting,r=S.diagnostic[t]||{};const target=R.querySelector('#up-write-status-'+t);
   if(!r.text?.trim()||r.text.trim().length<45){if(target)target.textContent='Schreibe bitte mindestens 45 Zeichen.';return;}
   if(!r.evidence?.trim()||!r.text.includes(r.evidence.trim())){if(target)target.textContent='Dein Textbeleg muss wortwörtlich in deiner Schreibprobe vorkommen.';return;}
   if(!['0','1','2'].includes(r.rating)){if(target)target.textContent='Wähle zuerst deine eigene Einschätzung.';return;}
   r.checked=true;save();renderAgain();return;
  }
  if(d.upConf!==undefined){S.conference.selected=Number(d.upConf);save();renderAgain();return;}
  if(d.upTrain){if(window.MF_ACADEMY?.openRepairSkill(d.upTrain))next('repair');return;}
  if(d.upBackup!==undefined){downloadBackup();return;}
  if(d.upPrint){teacherPrint(d.upPrint);return;}
  if(d.upLoadreading){S.readingText=d.upLoadreading==='writer'?loadStoryText():S.analysis;save();renderAgain();return;}
  if(d.upRead){if(d.upRead==='start')beginRead();else if(d.upRead==='stop')stopRead();else if(d.upRead==='pause'){reader.paused=true;window.speechSynthesis?.pause();const el=R.querySelector('#up-read-status');if(el)el.textContent='Vorlesen pausiert.';}else if(d.upRead==='resume'){reader.paused=false;if(window.speechSynthesis?.paused)window.speechSynthesis.resume();else if(reader.lines.length)readStep(reader.token);}return;}
  if(d.upSentence!==undefined){beginRead(Number(d.upSentence));return;}
 };
 const change=e=>{
  const x=e.target,d=x.dataset;
  if(x.id==='up-scene'){S.scene=x.value;save();renderAgain();}
  if(d.upDone){S.planDone[d.upDone]=x.checked;save();renderAgain();}
  if(d.upRating){const r=S.diagnostic[d.upRating]||(S.diagnostic[d.upRating]={});r.rating=x.value;r.checked=false;save();}
  if(d.upFocus){const id=d.upFocus,arr=S.teacher.focus;S.teacher.focus=x.checked?[...new Set([...arr,id])]:arr.filter(v=>v!==id);save();}
  if(x.id==='up-teacher-scene'){S.teacher.scene=x.value;save();}
  if(x.id==='up-teacher-level'){S.teacher.level=x.value;save();}
  if(x.id==='up-teacher-minutes'){S.teacher.minutes=Number(x.value);save();}
  if(x.id==='up-import'){importBackup(x.files?.[0]);}
 };
 const input=e=>{
  const x=e.target,d=x.dataset;
  if(x.id==='up-analyse-text'){S.analysis=x.value.slice(0,20000);save();const m=metrics(S.analysis);const count=R.querySelector('#up-analyse-count');if(count)count.textContent=m.count+' Wörter · '+m.sentences+' mögliche Sätze · '+m.paras+' Textabschnitte';const out=R.querySelector('#up-analysis-notes');if(out)out.innerHTML=noteMarkup(m);return;}
  if(d.upNote){S.notes[d.upNote]=x.value.slice(0,900);save();return;}
  if(d.upDraft){const r=S.diagnostic[d.upDraft]||(S.diagnostic[d.upDraft]={});r.text=x.value.slice(0,4500);r.checked=false;save();return;}
  if(d.upEvidence){const r=S.diagnostic[d.upEvidence]||(S.diagnostic[d.upEvidence]={});r.evidence=x.value.slice(0,350);r.checked=false;save();return;}
  if(d.upConftext!==undefined){S.conference['text'+S.conference.selected]=x.value;save();return;}
  if(x.id==='up-reading-text'){S.readingText=x.value.slice(0,20000);save();stopRead();drawReader();return;}
  if(x.id==='up-teacher-title'){S.teacher.title=x.value;save();return;}
  if(x.id==='up-teacher-extra'){S.teacher.extra=x.value;save();}
 };
 let dragging=null;
 R.addEventListener('dragstart',e=>{const el=e.target.closest('[data-up-card]');if(!el)return;dragging=el.dataset.upCard;e.dataTransfer?.setData('text/plain',dragging);});
 R.addEventListener('dragover',e=>{if(dragging&&e.target.closest('[data-up-card]'))e.preventDefault();});
 R.addEventListener('drop',e=>{const dest=e.target.closest('[data-up-card]');if(!dest||!dragging)return;e.preventDefault();const a=S.order.indexOf(dragging),b=S.order.indexOf(dest.dataset.upCard);dragging=null;if(a<0||b<0||a===b)return;const id=S.order.splice(a,1)[0];S.order.splice(b,0,id);save();renderAgain();});
 R.addEventListener('dragend',()=>dragging=null);
 R.addEventListener('click',click);R.addEventListener('change',change);R.addEventListener('input',input);
 window.addEventListener('afterprint',()=>document.body.classList.remove('ac-printing'));
 window.addEventListener('pagehide',stopRead);
 function renderAgain(){const active=R.querySelector('.studio-tabs .active');if(active)active.click();}
 return Object.freeze({render,post,metrics,art,stopRead});
})();
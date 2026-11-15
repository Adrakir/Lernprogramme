(function(){
 'use strict';

 const storyTitle='Das Buch, das sich Geschichten wünschte';
 const story=[
  'An einem verregneten Nachmittag kletterten Maja, Bärli und Stern ins Baumhaus. Unter dem blauen Sitzsack lag ein Buch. Maja schlug es auf. Alle Seiten waren leer, bis auf einen Satz: „Erzähl mir etwas, das es noch nie gegeben hat.“',
  'Bärli hielt das Buch ans Fenster. Nichts geschah. Stern legte den Kopf schief. „Was wäre, wenn die Regentropfen heute nach oben fielen?“, fragte er. Da hüpfte ein Tropfen von der Fensterbank hinauf zur Dachrinne. Gleich folgten ihm zwei weitere.',
  'Maja erzählte, dass die Tropfen eine Wolke suchten, die ihren Heimweg vergessen hatte. Bärli malte eine Karte. Als Stern den letzten Satz sprach, fand die Wolke nach Hause. Auf der letzten Buchseite stand nun: „Morgen erzählst du mir weiter.“'
 ];

 const ideas=[
  {
   id:'stern-schluessel',title:'Der Schlüssel ohne Tür',who:'Maja und Stern',where:'Im Baumhaus',what:'Ein winziger goldener Schlüssel',
   twist:'Der Schlüssel passt in keines der Schlösser. Wofür könnte er da sein?',
   model:'Am Nachmittag fand Maja mit Stern im Baumhaus einen winzigen Schlüssel. Plötzlich klapperte eine Nuss in der Möbelkiste. Stern entdeckte darin ein kleines Schloss. Als Maja die Nuss aufschloss, kam ein zusammengefalteter Brief heraus.'
  },
  {
   id:'stern-regenschirm',title:'Der fliegende Regenschirm',who:'Bärli und Stern',where:'Auf dem Schulhof',what:'Ein roter Regenschirm',
   twist:'Der Schirm hebt ab, obwohl es windstill ist. Wohin will er?',
   model:'In der Pause entdeckten Bärli und Stern einen roten Schirm. Auf einmal schwebte er aufs Dach. Stern hörte ein Piepsen unter der Regenrinne. Der Schirm hatte sich über ein Vogelnest gestellt und hielt die Küken trocken.'
  },
  {
   id:'stern-fluesterbuch',title:'Das flüsternde Buch',who:'Maja, Bärli und Stern',where:'In der Bücherei',what:'Ein Buch mit grünen Seiten',
   twist:'Das Buch flüstert einen Namen. Wem gehört er?',
   model:'Kurz vor dem Schließen hörte Stern in der Bücherei ein Flüstern. Ein grünes Buch rief leise „Nele“. Maja fand zwischen den Seiten Neles verlorenes Lesezeichen. Gemeinsam legten die Freunde es an der Ausleihe für Nele bereit.'
  },
  {
   id:'stern-papierboot',title:'Das Boot mit der Nachricht',who:'Maja, Bärli und Stern',where:'Am Teich',what:'Ein blaues Papierboot',
   twist:'Im Boot steckt eine Nachricht, aber der Regen hat ein Wort verwischt. Welches Wort fehlt?',
   model:'Nach dem Regen trieb ein blaues Papierboot im Teich. Maja fischte es vorsichtig heraus. Auf dem Zettel darin stand: „Schau unter die …“. Stern und Bärli suchten unter der Bank. Dort lag ein zweites Boot aus gelbem Papier.'
  }
 ];

 const writingLink=idea=>'#schreibwerkstatt/'+idea.id;
 function entry(){
  return `<a class="stern-entry" href="#stern">
   <img src="./stern/stern.webp" alt="" width="62" height="62" loading="lazy">
   <span><strong>Sterns Geschichtenwerkstatt</strong><small>Hör Stern zu und erfinde eigene Geschichten.</small></span>${icon('arrow')}
  </a>`;
 }

 function writingTask(id){
  const idea=ideas.find(candidate=>candidate.id===id);
  if(!idea)return;
  return {
   id,title:idea.title,goal:'Schreibe mit Stern eine eigene Fantasiegeschichte.',
   plan:idea.who+' · '+idea.where+' · '+idea.what+'. '+idea.twist+' Überlege dir einen Anfang, einen spannenden Hauptteil und ein Ende.',
   words:['An einem Nachmittag','Auf einmal','Vorsichtig','Schließlich'],
   model:idea.model,
   criteria:['Ich erzähle, wer dabei ist und wo die Geschichte spielt.','Im Hauptteil passiert etwas Spannendes.','Am Ende erfahren die Leserinnen und Leser, wie es ausgeht.']
  };
 }

 function show(){
  const saved=ideas.filter(({id})=>{
   const draft=learning.writing[id];
   return draft&&(draft.plan||draft.draft||draft.revised);
  });
  app.innerHTML=`<div class="route stern-route">${homeLink()}
   <header class="stern-hero">
    <img src="./stern/stern.webp" alt="Stern, das cremeweiße Kuschellamm mit Schlappohren und rosa Halsband, liegt vor einem aufgeschlagenen Buch." width="768" height="768">
    <div><p class="kicker">Majas und Bärlis Geschichtenfreund</p>
     <h1 tabindex="-1">Sterns Geschichten<wbr>werkstatt</h1></div>
    <p class="stern-intro">„Hallo, ich bin Stern! Wenn ich etwas Seltsames entdecke, frage ich mich: Was wäre, wenn? So fängt bei mir eine Geschichte an.“</p>
   </header>
   <section class="panel stern-panel" aria-labelledby="stern-story-title">
    <h2 id="stern-story-title">${escapeHtml(storyTitle)}</h2>
    <div class="actions stern-audio">
     <button class="primary" type="button" id="stern-play">${icon('audio')} Vorlesen</button>
     <button class="secondary" type="button" id="stern-stop" disabled>Stopp</button>
     <label for="stern-tempo">Tempo <select id="stern-tempo"><option value="1">Normal</option><option value="0.8">Langsam</option></select></label>
    </div>
    <p class="inline-status" id="stern-audio-status" role="status"></p>
    <details><summary>Geschichte lesen</summary>${story.map(paragraph=>`<p>${escapeHtml(paragraph)}</p>`).join('')}</details>
   </section>
   ${saved.length?`<section class="panel stern-panel"><h2>Meine Geschichten</h2><ul class="stern-drafts">${saved.map(idea=>`<li><a href="${writingLink(idea)}">${escapeHtml(idea.title)} weiterbearbeiten</a></li>`).join('')}</ul></section>`:''}
   <section class="panel stern-panel" aria-labelledby="stern-ideas-title">
    <h2 id="stern-ideas-title">Mit Stern eine Geschichte erfinden</h2>
    <div class="stern-story-idea" id="stern-idea" aria-live="polite"></div>
    <div class="actions"><a class="primary" id="stern-write">Mit dieser Idee schreiben</a><button class="secondary" type="button" id="stern-next-idea">Nächste Idee</button></div>
    <details><summary>Sterns Tipps fürs Erzählen</summary>
     <ol class="stern-tips"><li><strong>Anfang.</strong> Wer ist dabei? Wo und wann beginnt die Geschichte?</li>
     <li><strong>Hauptteil.</strong> Was passiert plötzlich? Wie fühlt sich deine Figur dabei?</li>
     <li><strong>Schluss.</strong> Wie geht es aus? Was hat sich für deine Figur verändert?</li></ol>
    </details>
   </section>
   <a class="secondary" href="#schreibwerkstatt">Zur Schreibwerkstatt</a>
  </div>`;

  let index=0;
  const ideaCard=app.querySelector('#stern-idea');
  const write=app.querySelector('#stern-write');
  function updateIdea(){
   const idea=ideas[index];
   ideaCard.innerHTML=`<p class="kicker">Idee ${index+1} von ${ideas.length}</p>
    <h3>${escapeHtml(idea.title)}</h3>
    <dl><div><dt>Wer?</dt><dd>${escapeHtml(idea.who)}</dd></div>
        <div><dt>Wo?</dt><dd>${escapeHtml(idea.where)}</dd></div>
        <div><dt>Was?</dt><dd>${escapeHtml(idea.what)}</dd></div></dl>
    <p>${escapeHtml(idea.twist)}</p>`;
   write.href=writingLink(idea);
  }
  updateIdea();
  app.querySelector('#stern-next-idea').onclick=()=>{
   index=(index+1)%ideas.length;
   updateIdea();
  };

  const player=window.speechSynthesis;
  const play=app.querySelector('#stern-play');
  const stop=app.querySelector('#stern-stop');
  const tempo=app.querySelector('#stern-tempo');
  const status=app.querySelector('#stern-audio-status');
  let utterance=null;
  function quiet(){
   if(!utterance)return;
   utterance=null;
   player.cancel();
   stop.disabled=true;
  }
  function stopWhenHidden(){
   if(document.hidden&&utterance){
    quiet();
    status.textContent='Das Vorlesen wurde angehalten.';
   }
  }
  document.addEventListener('visibilitychange',stopWhenHidden);
  extraCleanup=()=>{
   quiet();
   document.removeEventListener('visibilitychange',stopWhenHidden);
  };
  play.onclick=()=>{
   if(!player?.speak||!window.SpeechSynthesisUtterance){
    status.textContent='Hier ist keine Vorlesestimme verfügbar. Öffne „Geschichte lesen“.';
    return;
   }
   quiet();
   const german=player.getVoices().filter(voice=>/^de([-_]|$)/i.test(voice.lang));
   const voice=german.find(candidate=>candidate.localService)||german[0];
   const rate=Number(tempo.value);
   stop.disabled=false;
   play.innerHTML=icon('audio')+' Noch mal vorlesen';
   status.textContent='Die Gerätestimme liest vor.';
   function readParagraph(index){
    const speech=new window.SpeechSynthesisUtterance(story[index]);
    speech.lang='de-DE';
    speech.rate=rate;
    if(voice)speech.voice=voice;
    utterance=speech;
    function finished(message){
     utterance=null;
     stop.disabled=true;
     status.textContent=message;
    }
    speech.onend=()=>{
     if(utterance!==speech)return;
     if(index+1<story.length)readParagraph(index+1);
     else finished('Die Geschichte ist zu Ende.');
    };
    speech.onerror=()=>{
     if(utterance===speech)finished('Die Vorlesestimme ist gerade nicht verfügbar. Öffne „Geschichte lesen“.');
    };
    try{player.speak(speech);}catch{speech.onerror();}
   }
   readParagraph(0);
  };
  stop.onclick=()=>{
   quiet();
   status.textContent='Das Vorlesen wurde gestoppt.';
  };
 }

 window.MajaStern={entry,show,writingTask};
})();

(function(){
 'use strict';

 const storyTitle='Das Buch, das sich Geschichten wünschte';
 const story=[
  'An einem verregneten Nachmittag kletterten Maja, Bärli und Stern ins Baumhaus. Unter dem blauen Sitzsack lag ein Buch. Maja schlug es auf. Alle Seiten waren leer, bis auf einen Satz: „Erzähl mir etwas, das es noch nie gegeben hat.“',
  'Bärli hielt das Buch ans Fenster. Nichts geschah. Stern legte den Kopf schief. „Was wäre, wenn die Regentropfen heute nach oben fielen?“, fragte er. Da hüpfte ein Tropfen von der Fensterbank hinauf zur Dachrinne. Gleich folgten ihm zwei weitere.',
  'Maja erzählte, dass die Tropfen eine Wolke suchten, die ihren Heimweg vergessen hatte. Bärli malte eine Karte. Als Stern den letzten Satz sprach, fand die Wolke nach Hause. Auf der letzten Buchseite stand nun: „Morgen erzählst du mir weiter.“'
 ];

 const adventures=[
  {
   id:'regenbrief',title:'Der Brief im Wind',
   teaser:'Ein geheimnisvoller Brief landet nach dem Regen in der Hecke.',
   alt:'Maja und Stern halten einen Briefumschlag mit blauem Siegel im Garten fest.',
   paragraphs:[
    'Maja und Stern gingen hinaus, kaum dass der Regen aufgehört hatte. Da segelte ein heller Briefumschlag über den Gartenweg. Maja griff danach, doch der Wind war schneller. Erst in der Hecke blieb der Brief hängen. Stern legte eine Pfote auf eine Ecke, bis Maja ihn in der Hand hatte.',
    'Auf dem Umschlag stand „Für dich, wenn du mich findest“. Maja brach das blaue Siegel. Innen lag ein Zettel. Jemand hatte einen Baum mit einer Bank darunter gemalt. Neben der Bank stand eine einzige Frage: „Was kann man verschenken, ohne es zu verlieren?“',
    '„Einen Knopf nicht“, sagte Maja. „Den hätte ich danach nicht mehr.“ Stern dachte nach. „Aber eine Geschichte kannst du weitererzählen. Du behältst sie trotzdem.“ Die beiden setzten sich auf die Bank unter dem Apfelbaum. Maja erzählte, wie der Brief über den Garten geflogen war, und Stern erfand, woher der Wind ihn wohl gebracht hatte.',
    'Am Abend legten sie einen neuen Zettel in den Umschlag. „Jetzt bist du dran“, schrieb Maja. Dann klemmte sie den Brief so zwischen zwei Zweige, dass der nächste Wind ihn mitnehmen konnte.'
   ]
  },
  {
   id:'mondpfuetze',title:'Die Pfütze mit dem Mond',
   teaser:'Als Maja nach dem Mond greift, zerfällt er in silberne Stücke.',
   alt:'Maja und Stern beobachten abends den Mond, der sich in einer Pfütze spiegelt.',
   paragraphs:[
    'Als es im Garten schon dämmerte, blieb Stern mitten auf dem Weg stehen. In einer Pfütze lag ein heller, runder Mond. „Der ist heute aber tief gefallen“, flüsterte er. Maja ging in die Hocke und hielt einen Finger dicht über das Wasser.',
    'Ein Tropfen fiel von einem Blatt. Plitsch! Der Mond in der Pfütze zerbrach in lauter silberne Stücke. Stern hielt den Atem an. Maja nahm seine Pfote. „Schau nach oben.“ Über dem Garten hing der Mond, rund und heil. Als das Wasser wieder still war, erschien auch sein Spiegelbild vollständig.',
    'Stern legte den Kopf schief. „Was wäre, wenn die Pfütze ein Fenster in den Himmel wäre?“ Maja stellte sich vor, wie sie hinaufkletterten und sich auf eine Wolke setzten. Stern fand, dass sie für die Rückreise auf jeden Fall zwei Butterbrote bräuchten.',
    'Drinnen malte Maja die Pfütze auf ein Blatt Papier. Stern wollte gerade einen Stern dazumalen, als ihm etwas auffiel. „Hier fehlt noch das Plitsch.“ Maja nahm den Silberstift und zog kleine Kreise um den Mond.'
   ]
  },
  {
   id:'wunschknopf',title:'Der Knopf, der sich etwas wünschte',
   teaser:'Im Baumhaus findet Maja einen blauen Knopf. Stern hat eine Idee, was er einmal werden könnte.',
   alt:'Maja zeigt Stern im Baumhaus einen blauen Knopf aus einer Nähdose.',
   paragraphs:[
    'Im Baumhaus klapperte die alte Nähdose, als Maja sie schüttelte. Zwischen bunten Fäden lag ein großer blauer Knopf. Maja hielt ihn auf der flachen Hand. Stern kam so nah heran, dass seine Nasenspitze den Knopf fast berührte.',
    '„Was wäre, wenn er sich etwas wünschen könnte?“, fragte Stern. „Vielleicht möchte er mal ans Meer“, sagte Maja. Stern schob das kleine Stoffbeutelchen an, das neben der Dose lag. „Der Beutel könnte sein Reisegepäck sein.“',
    'Maja nahm den Stoff und drehte ihn in der Hand. „Oder der Knopf wird selbst das Meer.“ Sie malte kleine Fische auf den Beutel und nähte den blauen Knopf mitten hinein. Stern steuerte mit einem Bleistiftstrich eine winzige Insel bei.',
    'Als die beiden fertig waren, packte Maja einen Stein vom Gartenweg in den Beutel. Stern diktierte einen Satz für den ersten Zettel: „Heute hat ein Knopf ein Meer gefunden.“ Den Zettel legten sie zum Stein. Für die nächste Geschichte war noch viel Platz.'
   ]
  },
  {
   id:'mitternachtsparty',title:'Die Mitternachtsparty mit dem Flüsterdrachen',
   teaser:'Maja, Bärli und Stern feiern in der Deckenhöhle. Luca kommt als kleiner Drache dazu.',
   alt:'Maja mit langem rotblondem Haar feiert mit Bärli, Stern und Luca im grünen Drachenkostüm in einer beleuchteten Deckenhöhle.',
   paragraphs:[
    'Kurz vor Mitternacht kroch Maja in die Deckenhöhle im Wohnzimmer. Ihre langen rotblonden Haare rutschten ihr über die Schulter, als sie den silbernen Papiermond an der Decke befestigte. Bärli hatte eine Krone gefaltet. Stern legte für jeden ein Apfelstück auf den Teller.',
    'Da schob sich eine grüne Schnauze durch den Eingang. Darunter grinste Luca. Er trug sein Drachenkostüm mit den gelben Zacken und dem weichen Schwanz. „Raa!“, rief er. Maja legte einen Finger an die Lippen. „Kannst du auch ganz leise brüllen?“ Luca probierte es. Sein „Raa“ klang jetzt so leise, dass Bärli sich dicht zu ihm beugen musste.',
    'Als die Uhr zwölf zeigte, rutschte der Papiermond vom Deckendach. Bevor er auf den Apfelteller fallen konnte, fing Stern ihn mit beiden Vorderpfoten auf. „Unser Mond braucht einen Drachen, der auf ihn aufpasst“, sagte Maja. Bärli setzte Luca die Papierkrone auf. Luca stellte sich kerzengerade hin und flüsterte sein stolzestes „Raa“.',
    'Dann teilten die vier die Apfelstücke. Stern erzählte von einem Drachen, der mit einem Flüstern einen ganzen Himmel voller Sterne wecken konnte. Luca wollte wissen, wie die Geschichte ausging. Doch noch bevor Stern den letzten Satz gesagt hatte, war der kleine Drache auf seinem Kissen eingeschlafen.'
   ]
  }
 ];

 const adventureLink=adventure=>'#stern/'+adventure.id;
 const adventureImage=adventure=>'./stern/'+adventure.id+'.webp';
 const paragraphsHtml=paragraphs=>paragraphs.map(paragraph=>`<p>${escapeHtml(paragraph)}</p>`).join('');

 function narrationControls(){
  return `<div class="actions stern-audio">
   <button class="primary" type="button" id="stern-play">${icon('audio')} Vorlesen</button>
   <button class="secondary" type="button" id="stern-stop" disabled>Stopp</button>
   <label for="stern-tempo">Tempo <select id="stern-tempo"><option value="1">Normal</option><option value="0.8">Langsam</option></select></label>
  </div><p class="inline-status" id="stern-audio-status" role="status"></p>`;
 }

 function adventureShelf(){
  return `<section class="stern-panel" aria-labelledby="stern-adventures-title">
   <h2 id="stern-adventures-title">Geschichten mit Maja und Stern</h2>
   <ul class="stern-shelf">${adventures.map(adventure=>`<li><a href="${adventureLink(adventure)}">
    <img src="${adventureImage(adventure)}" alt="" width="960" height="640" loading="lazy">
    <span><strong>${escapeHtml(adventure.title)}</strong><small>${escapeHtml(adventure.teaser)}</small></span>
   </a></li>`).join('')}</ul>
  </section>`;
 }

 function showAdventure(index){
  const adventure=adventures[index];
  const previous=adventures[index-1],next=adventures[index+1];
  app.innerHTML=`<div class="route stern-route stern-reading">
   <a class="secondary stern-back" href="#stern">${icon('back')} Zu Sterns Geschichten</a>
   <article class="panel stern-panel">
    <h1 tabindex="-1">${escapeHtml(adventure.title)}</h1>
    <img class="stern-scene" src="${adventureImage(adventure)}" alt="${escapeHtml(adventure.alt)}" width="960" height="640">
    ${narrationControls()}
    <div class="stern-story-text">${paragraphsHtml(adventure.paragraphs)}</div>
   </article>
   <nav class="actions" aria-label="Weitere Geschichten mit Stern">
    ${previous?`<a class="secondary" href="${adventureLink(previous)}">Vorherige Geschichte</a>`:''}
    ${next?`<a class="secondary" href="${adventureLink(next)}">Nächste Geschichte</a>`:''}
   </nav>
  </div>`;
  bindNarration(adventure.paragraphs);
 }

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

 function show(id){
  const adventureIndex=adventures.findIndex(adventure=>adventure.id===id);
  if(adventureIndex!==-1){showAdventure(adventureIndex);return;}
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
   ${adventureShelf()}
   <section class="panel stern-panel" aria-labelledby="stern-story-title">
    <h2 id="stern-story-title">${escapeHtml(storyTitle)}</h2>
    ${narrationControls()}
    <details><summary>Geschichte lesen</summary>${paragraphsHtml(story)}</details>
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
  bindNarration(story);
 }

 function bindNarration(paragraphs){
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
    status.textContent='Hier ist keine Vorlesestimme verfügbar. Du kannst die Geschichte auf dieser Seite lesen.';
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
    const speech=new window.SpeechSynthesisUtterance(paragraphs[index]);
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
     if(index+1<paragraphs.length)readParagraph(index+1);
     else finished('Die Geschichte ist zu Ende.');
    };
    speech.onerror=()=>{
     if(utterance===speech)finished('Die Vorlesestimme ist gerade nicht verfügbar. Du kannst die Geschichte auf dieser Seite lesen.');
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

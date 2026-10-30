'use strict';
/* Zusatzmodule für einen didaktisch begründeten Schreibprozess, Klasse 5. */
window.MF_UPGRADE_DATA=Object.freeze({
 sequences:[
  {id:'leuchtturm',title:'Das Signal am Leuchtturm',level:'mittel',theme:'coast',
   people:'Nele und Sami',setting:'Küste',goal:'Warum blinkt am verlassenen Leuchtturm ein Licht?',
   scenes:[
    {title:'Der Ausflug',action:'Nele und Sami erkunden am Nachmittag den Küstenweg.',detail:'Figuren, Ort und Zeit',prop:'path'},
    {title:'Ein Blinksignal',action:'Durch den Nebel entdecken sie einen Lichtschein am alten Turm.',detail:'Erster Hinweis',prop:'light'},
    {title:'Die frischen Fußspuren',action:'Im feuchten Sand führen Spuren bis zur verschlossenen Tür.',detail:'Hindernis und Vermutung',prop:'footprints'},
    {title:'Das Klopfen',action:'Hinter der Tür klopft jemand dreimal. Nele hält den Atem an.',detail:'Spannung und innere Handlung',prop:'door'},
    {title:'Eine Entscheidung',action:'Die Kinder bleiben draußen und rufen die Hafenaufsicht.',detail:'Höhepunkt: Verantwortung zeigen',prop:'phone'},
    {title:'Die Erklärung',action:'Ein Arbeiter hatte sich ausgesperrt und mit seiner Lampe Hilfe gerufen.',detail:'Logische Auflösung',prop:'help'}
   ]},
  {id:'turnhalle',title:'Das Rätsel der Turnhalle',level:'grundlegend',theme:'school',
   people:'Lina und Ben',setting:'Schule',goal:'Weshalb ertönt nach Schulschluss noch Musik?',
   scenes:[
    {title:'Letztes Training',action:'Lina und Ben verlassen nach dem Training die Sporthalle.',detail:'Ausgangslage',prop:'ball'},
    {title:'Musik aus dem Flur',action:'Hinter der geschlossenen Hallentür erklingt eine Melodie.',detail:'Ungewöhnliches Ereignis',prop:'notes'},
    {title:'Der vergessene Beutel',action:'Neben einer Bank liegt ein Sportbeutel mit einem Namensschild.',detail:'Hinweis',prop:'bag'},
    {title:'Eine Stimme',action:'Die Kinder hören jemanden leise nach seinem Beutel fragen.',detail:'Spannung steigt',prop:'speech'},
    {title:'Die richtige Hilfe',action:'Sie sprechen die Sportlehrerin an, statt allein zurückzugehen.',detail:'Höhepunkt',prop:'teacher'},
    {title:'Alles geklärt',action:'Ein Kind hatte für die Aufführung geübt und den Beutel vergessen.',detail:'Schluss',prop:'medal'}
   ]},
  {id:'waldkarte',title:'Die Karte mit dem roten Kreuz',level:'anspruchsvoll',theme:'forest',
   people:'Mia und Tariq',setting:'Wald',goal:'Wie finden die beiden trotz eines beschädigten Wegweisers zum Treffpunkt?',
   scenes:[
    {title:'Am Waldparkplatz',action:'Mia und Tariq erhalten eine Wanderkarte und starten.',detail:'Ausgangslage',prop:'map'},
    {title:'Ein Wegweiser',action:'Der Wegweiser ist vom Sturm schief gedrückt worden.',detail:'Erstes Problem',prop:'sign'},
    {title:'Eine Abzweigung',action:'Zwei Wege sehen gleich aus. Auf der Karte ist ein rotes Kreuz.',detail:'Hinweis und Unsicherheit',prop:'cross'},
    {title:'Der Bach',action:'Sie hören Wasser, können aber die Brücke nicht sehen.',detail:'Sinne und Zeitdehnung',prop:'water'},
    {title:'Die Kartenprüfung',action:'Die Kinder bleiben auf dem Weg und vergleichen Bach, Kreuz und Karte.',detail:'Höhepunkt: begründete Entscheidung',prop:'compass'},
    {title:'Am Treffpunkt',action:'Sie erreichen die Brücke und erkennen, dass sie richtig gegangen sind.',detail:'Rückbezug und Schluss',prop:'bridge'}
   ]}
 ],
 cards:[
  {id:'intro',title:'Ausgangslage',question:'Wer ist wo und wann unterwegs?',hint:'Führe die Figuren ein, ohne die Auflösung vorwegzunehmen.'},
  {id:'trigger',title:'Auslöser',question:'Welcher ungewöhnliche Hinweis wirft eine Frage auf?',hint:'Die Einleitung darf neugierig machen.'},
  {id:'obstacle',title:'Hindernis',question:'Warum gelingt die Lösung nicht sofort?',hint:'Aus dem Problem entwickelt sich die äußere Handlung.'},
  {id:'thought',title:'Gedanke und Gefühl',question:'Was befürchtet oder hofft die Figur?',hint:'Zeige Reaktionen im Körper und einen passenden Gedanken.'},
  {id:'peak',title:'Höhepunkt',question:'Welche Entscheidung wird jetzt besonders wichtig?',hint:'Erzähle den Moment in kleinen Schritten.'},
  {id:'resolution',title:'Lösung',question:'Welcher vorbereitete Hinweis löst die Frage?',hint:'Nicht alles darf durch Zufall geschehen.'},
  {id:'ending',title:'Schluss',question:'Was ändert sich für die Figuren danach?',hint:'Greife eine Beobachtung vom Anfang wieder auf.'}
 ],
 conference:{
   text:'Nele ging zur Tür. Plötzlich hörte sie ein Klopfen. Nele hatte Angst. Dann machte sie die Tür auf. Dahinter war ein Arbeiter. Ende.',
   comments:[
    {quote:'Nele ging zur Tür.',type:'orientierung',label:'Wo und wann?',hint:'Für die Orientierung fehlt noch, wo Nele ist und weshalb sie sich der Tür nähert.'},
    {quote:'Plötzlich hörte sie ein Klopfen.',type:'spannung',label:'Guter Anlass',hint:'Das Geräusch weckt Neugier. Wie oft klopft es, und was macht Nele danach?'},
    {quote:'Nele hatte Angst.',type:'gefuehle',label:'Gefühl zeigen',hint:'Statt Angst nur zu nennen: Welche Körperreaktion sieht man?'},
    {quote:'Dann machte sie die Tür auf.',type:'hoehepunkt',label:'Zeitdehnung',hint:'Der Höhepunkt passiert zu schnell. Zerlege die Bewegung in mehrere Schritte.'},
    {quote:'Dahinter war ein Arbeiter.',type:'logik',label:'Vorbereitung',hint:'Welcher frühere Hinweis könnte auf die Person hinter der Tür deuten?'},
    {quote:'Ende.',type:'schluss',label:'Folgen zeigen',hint:'Die Rettung braucht einen nachvollziehbaren Ausklang und eine Reaktion.'}
   ]
 },
 writingTasks:[
  {id:'schleuse',title:'Die rätselhafte Schleuse',intro:'Während eines Ausflugs entdeckt eine Gruppe eine verschlossene Schleuse. Ein regelmäßig klingelnder Ton sorgt für Fragen.',goal:'Schreibe eine kurze Einleitung mit Figuren, Ort und Spannungsschlinge.',focus:'aufbau'},
  {id:'kiste',title:'Das Klappern in der Kiste',intro:'Im Geräteraum klappert etwas hinter einem Regal. Auf dem Boden liegen kleine Holzspäne.',goal:'Schreibe einen spannenden Höhepunkt mit Körperreaktion, innerer Frage und drei kleinen Handlungen.',focus:'spannung'},
  {id:'fahrrad',title:'Das verlassene Fahrrad',intro:'Am Rande des Schulhofs steht ein Fahrrad mit einem zerrissenen Zettel. Drei Personen erzählen Verschiedenes.',goal:'Verbinde die Hinweise in fünf bis acht Sätzen zu einer nachvollziehbaren Handlung.',focus:'faden'}
 ],
 teacherFocus:[
  {id:'aufbau',name:'Einleitung und Spannungsschlinge'},
  {id:'faden',name:'Logik und roter Faden'},
  {id:'spannung',name:'Höhepunkt und Erzähltempo'},
  {id:'innen',name:'Gefühle und Gedanken'},
  {id:'sprache',name:'Treffende Verben und wörtliche Rede'},
  {id:'schluss',name:'Schluss und Überarbeitung'}
 ]
});
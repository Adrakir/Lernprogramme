'use strict';

// Bildnummern beziehen sich auf die sechs Illustrationen des Schuppencomics.
const CHALLENGE_IMAGES = {
  1:['scene-1.jpg','Minka und Fuji stehen im Herbstlaub neben dem Holzschuppen.'],
  2:['scene-2.jpg','Minka steht mit den Vorderpfoten an der Holztür, Fuji blickt neben ihr zur Tür.'],
  3:['scene-3.jpg','Minka liegt flach vor der Tür, Fuji steht dicht dahinter. Blätter wirbeln um beide herum.'],
  4:['scene-4.jpg','Die Schuppentür steht einen Spalt offen. Minka und Fuji schauen hinein.'],
  5:['scene-5.jpg','Fuji hält mit ihrer Pfote den gekippten Blumentopf. Ein Igel kommt darunter hervor, neben ihm ist Minka.'],
  6:['scene-6.jpg','Minka und Fuji schauen einem Igel nach, der durch das Herbstlaub läuft.'],
  wal:['whale-integrated.jpg','Der Walrücken steigt vom Kopf zu einem hohen Punkt an und fällt zum Schwanz hin ab.']
};
const CHALLENGE_ADDITIONS = {
  satzanfaenge:[
    ['Mit dem Ort beginnen','Minka und Fuji stehen am Schuppen. Welcher Satz beginnt mit einer Ortsangabe, die zum Bild passt?',['Neben dem Holzschuppen standen Minka und Fuji.','Kurz nach Sonnenuntergang standen Minka und Fuji nebeneinander.','Neugierig standen Minka und Fuji im Garten.','Minka und Fuji standen neben dem Holzschuppen.'],'„Neben dem Holzschuppen“ steht vorn und sagt, wo beide stehen. In der letzten Antwort ist derselbe Ort genannt, steht aber am Ende.',1],
    ['Eine Bewegung genauer erzählen','Welcher Anfang zeigt, wie Minka sich bewegte, als sie unter den Türspalt blicken wollte?',['Vorsichtig duckte sich Minka vor der Tür.','Vor der Tür duckte sich Minka.','In diesem Moment duckte sich Minka.','Minka duckte sich vor der Tür.'],'„Vorsichtig“ zeigt die Art der Bewegung. Die anderen Anfänge nennen den Ort, die Zeit oder die Figur.',3],
    ['Den Anschluss finden','Fuji lauschte. Erst einige Sekunden später klopfte es erneut. Welcher Satzanfang passt?',['Wenig später klopfte es erneut.','Lange vorher klopfte es erneut.','Gleichzeitig klopfte es erneut.','Am Vortag klopfte es erneut.'],'„Wenig später“ ordnet das zweite Klopfen nach dem Lauschen ein. Die anderen Angaben ändern die Reihenfolge oder den Zeitpunkt.']
  ],
  rede:[
    ['Vor der verschlossenen Tür','Minka fragt leise nach dem Geräusch. Welche Schreibweise passt?',['„Hörst du das?“, flüsterte Minka.','„Hörst du das?“ flüsterte Minka.','„Hörst du das“, flüsterte Minka?','„Hörst du das?“, Flüsterte Minka.'],'Das Fragezeichen gehört in die Rede. Hinter dem Anführungszeichen folgt ein Komma und danach der kleingeschriebene Begleitsatz.',2],
    ['Die Rettung im Dialog','Fuji will Minka im entscheidenden Moment warnen. Welcher Satz mit Begleitsatz davor ist richtig?',['Fuji rief: „Der Topf rutscht!“','Fuji rief, „Der Topf rutscht!“','Fuji rief: „Der Topf rutscht“!','Fuji rief „Der Topf rutscht!“'],'Nach „Fuji rief“ kommt ein Doppelpunkt. Das Ausrufezeichen gehört in die wörtliche Rede.',5],
    ['Aussage mit Einschub','Wie setzt du den Begleitsatz in die Aussage „Der Schlüssel liegt im Laub.“ ein?',['„Der Schlüssel“, erklärte Mia, „liegt im Laub.“','„Der Schlüssel“, erklärte Mia „liegt im Laub.“','„Der Schlüssel“ erklärte Mia, „liegt im Laub.“','„Der Schlüssel“, erklärte Mia, „Liegt im Laub.“'],'Vor und nach dem eingeschobenen Begleitsatz steht ein Komma. „liegt“ beginnt klein, weil dieselbe Aussage fortgesetzt wird.']
  ],
  redewendungen:[
    ['Spannung vor der Tür','Minka kann noch nicht erkennen, was hinter der Tür ist. Welche Redewendung passt zu ihrer Anspannung?',['Minka hielt den Atem an.','Minka nahm die Beine in die Hand und lief davon.','Minka war aus dem Schneider, weil alles geklärt war.','Minka sprang vor Freude an die Decke.'],'„Den Atem anhalten“ passt zum angespannten Warten. Auf dem Bild bleibt Minka dicht an der Tür, und das Rätsel ist noch offen.',2],
    ['Der Igel ist sicher','Der befreite Igel läuft davon. Welche Redewendung drückt aus, dass Fuji sich keine Sorgen mehr macht?',['Fuji fiel ein Stein vom Herzen.','Fuji machte sich einen Kopf.','Fuji wurde mulmig zumute.','Fuji bekam kalte Füße.'],'Der „Stein“ steht für die Sorge, die nach dem guten Ausgang von Fuji abfällt. Die anderen Wendungen passen eher zu Unsicherheit.',6],
    ['Mit einem blauen Auge davonkommen','Mia stolperte, fing sich aber ab und blieb unverletzt. „Da bin ich mit einem blauen Auge davongekommen“, sagte sie. Was meint sie?',['Es hätte schlimmer ausgehen können.','Sie hatte sich tatsächlich am Auge verletzt.','Sie wollte den Sturz sofort nachmachen.','Sie wusste nicht mehr, wohin sie gehen wollte.'],'Die Redewendung bedeutet, glimpflich davonzukommen. Mia blieb hier unverletzt, obwohl das Stolpern schlimme Folgen hätte haben können.']
  ],
  gefuehle:[
    ['Unsicherheit zeigen','Minka möchte unter der Tür hindurchsehen und ist unsicher. Welcher Satz zeigt das durch ihr Verhalten?',['Minka duckte sich und zog die Pfote gleich wieder zurück.','Minka war unsicher.','Minka sah ein braunes Brett.','Minka wusste, wo der Schuppen stand.'],'Ducken und Zurückziehen zeigen das Zögern. Der zweite Satz benennt die Unsicherheit lediglich.',3],
    ['Erleichtert zuschauen','Der Igel läuft unverletzt ins Laub. Welche Fortsetzung zeigt Fujis Erleichterung?',['Fuji ließ die Schultern sinken und atmete tief aus.','Fuji spannte alle Muskeln an und wich zurück.','Fuji rannte wütend gegen die Tür.','Fuji zitterte und suchte den Igel weiter.'],'Das Ausatmen und die gelöste Haltung passen zum Ende der Anspannung, nachdem der Igel sicher ist.',6],
    ['Ein Gefühl mit Handlung zeigen','Sami entdeckt seinen verloren geglaubten Ball. Welche Formulierung zeigt seine Freude durch eine Handlung?',['Sami hob den Ball hoch, lachte und winkte Mia zu.','Sami war froh über den Ball.','Der Ball war blau mit weißen Streifen.','Sami hatte gestern einen Ball gesucht.'],'Das Lachen und Winken machen Samis Freude sichtbar. Ein Gefühlswort wie „froh“ nennt sie, ohne sein Verhalten zu zeigen.']
  ],
  spannung:[
    ['Was liegt im Dunkeln?','Welche Fortsetzung macht den Blick in den Schuppen spannend?',['Im Dunkeln schabte etwas über den Boden. Minka konnte noch nicht erkennen, was es war.','Die Gießkanne war grün und stand an ihrem üblichen Platz.','Minka erklärte sofort, dass der Igel unter dem Topf saß.','Minka erinnerte sich daran, wie sie gestern im Garten gesessen hatte.'],'Das Geräusch ist konkret, seine Ursache bleibt unklar. So haben die Leser eine Frage, die sie zum Weiterlesen bringt.',4],
    ['Ein Augenblick wird länger','Wie lässt sich der entscheidende Moment des Bildes spannend erzählen?',['Der Topf glitt ein Stück. Fuji drückte die Pfote fester auf den Rand. Würde der Igel es rechtzeitig schaffen?','Die Rettung gelang. Es war sehr spannend.','Der Topf hatte eine rote Farbe und war aus Ton.','Am nächsten Morgen war der Garten leer.'],'Kleine Handlungen machen das Geschehen nachvollziehbar. Die Frage hält den Ausgang bis zum nächsten Moment offen.',5],
    ['Zeitdruck aufbauen','Welche Fortsetzung steigert die Spannung, während Lina nach ihrem Zettel sucht?',['Der Wind schob den Zettel immer näher an den Gully. Lina musste ihn vorher erreichen.','Der Zettel war aus weißem Papier und viermal gefaltet.','Lina hatte den Zettel am Morgen in ihre Tasche gesteckt.','Am Abend lag der Zettel wieder auf dem Schreibtisch.'],'Der näher rückende Gully schafft Zeitdruck und einen drohenden Verlust. Dadurch wird der nächste Handlungsschritt wichtig.']
  ],
  gegensaetze:[
    ['Draußen und drinnen','Welches Gegensatzpaar passt zum Unterschied zwischen der beleuchteten Türschwelle und dem Inneren des Schuppens?',['hell und dunkel','hoch und tief','laut und leise','nah und fern'],'„Hell“ und „dunkel“ beschreiben den sichtbaren Lichtunterschied zwischen Türschwelle und Schuppeninnerem.',4],
    ['Vor und nach der Rettung','Welche Fassung stellt die beiden Zustände des Igels einander gegenüber?',['Erst saß der Igel fest, dann war er frei.','Erst war der Igel klein, dann war er winzig.','Erst lag dort Laub, dann lag dort ein Blatt.','Erst war das Laub trocken, dann war es knisternd.'],'„Fest sitzen“ und „frei sein“ zeigen den Gegensatz zwischen der Gefahr vorher und dem Zustand im Schlussbild.',6],
    ['Ein Gegensatz beim Tempo','Welcher Satz macht einen Wechsel vom langsamen Gehen zum schnellen Laufen deutlich?',['Zuerst schlenderte Fuji, dann rannte sie.','Zuerst rannte Fuji, dann sprintete sie.','Zuerst ging Fuji geradeaus, dann bog sie ab.','Zuerst ging Fuji leise, dann stapfte sie laut.'],'„Schlenderte“ und „rannte“ stellen langsam und schnell gegenüber. Die letzte Antwort betont vor allem die Lautstärke.']
  ],
  hoehepunkt:[
    ['Die entscheidende Handlung','Was macht dieses Bild zum Höhepunkt der Igelgeschichte?',['Fuji hält den Topf, während sich entscheidet, ob der Igel herauskommt.','Die Figuren lernen sich kennen und gehen zum Schuppen.','Das Klopfen fällt Minka zum ersten Mal auf.','Die beiden sind schon auf dem Heimweg.'],'Das Bild zeigt die Rettung in dem Moment, in dem ihr Erfolg noch auf dem Spiel steht. Darin liegt der Höhepunkt.',5],
    ['Den Höhepunkt am Wal zeigen','Wo wäre im Bild der entscheidende Moment der Geschichte eingezeichnet?',['Oben am höchsten Punkt des Rückens.','Links an der Maulspitze.','Rechts am Ende des Schwanzes.','Unten an der Bauchflosse.'],'Der ansteigende Rücken steht für wachsende Spannung. An seiner höchsten Stelle entscheidet sich, wie das Abenteuer ausgeht.', 'wal'],
    ['Das Papierboot','Samis Papierboot treibt auf ein Gitter zu. Welcher Moment ist der Höhepunkt?',['Sami streckt sich über das Ufer und erwischt das Boot kurz vor dem Gitter.','Sami faltet das Boot am Küchentisch.','Sami setzt das Boot zum ersten Mal ins Wasser.','Sami zeigt das nasse Boot zu Hause.'],'Der Griff entscheidet, ob das Boot gerettet wird. Falten und Start führen zum Problem hin, die Heimkehr folgt danach.']
  ],
  schlingen:[
    ['Ein Rätsel an der Tür','Welche Zeile legt zu diesem Bild eine Schlinge, ohne das Rätsel sofort zu lösen?',['Hinter der Tür kratzte es dreimal. Minka legte den Kopf schief.','Hinter der Tür kratzte der Igel, der unter dem Topf festsaß.','Minka war am Ende erleichtert und ging heim.','Die Tür war aus Holz und hatte einen Rahmen.'],'Das hörbare Kratzen macht neugierig. Die Ursache bleibt offen, sodass sie später aufgegriffen werden kann.',2],
    ['Das Rätsel wird aufgelöst','Am Anfang war ein Scharren im Schuppen zu hören. Welcher Satz erklärt mit diesem Bild, woher es kam?',['Der Igel hatte unter dem Topf mit seinen Krallen über den Boden gescharrt.','Der Topf war orange und aus Ton.','Minka hatte ihren Ball am Zaun gesucht.','Im Garten lagen viele trockene Blätter.'],'Der Igel unter dem Topf erklärt das frühere Geräusch. Die Schlinge wird durch einen konkreten Zusammenhang aufgelöst.',5],
    ['Spur und Auflösung verbinden','Am Anfang entdeckt Mia neben der Kiste feuchte Fußspuren. Welche spätere Stelle greift diesen Hinweis auf?',['Die Spur führte zum Gartentor. Dort sah Mia, wie Sami mit nassen Schuhen vom See zurückkam.','Mia entdeckte im Bücherregal einen bunten Umschlag.','Mia dachte an ein Gedicht, das sie auswendig konnte.','Mia fand eine trockene Feder in der Jacke.'],'Die nassen Schuhe und der Weg vom See erklären die feuchten Fußspuren. Die Lösung knüpft unmittelbar an den Hinweis an.']
  ],
  'erster-satz':[
    ['Die Figuren vorstellen','Welcher erste Satz eröffnet eine Erzählung zu diesem Bild und nennt Figuren, Ort und Zeit?',['An einem Herbstabend standen Minka und Fuji vor dem Holzschuppen im Garten.','Vor dem Schuppen war es.','Jetzt war der Igel endlich frei.','Sie hatten alles schon verstanden.'],'Der Satz nennt beide Figuren, die Herbstzeit und den Schuppen im Garten. So können sich die Leser die Ausgangsszene vorstellen.',1],
    ['Mit einer klaren Ausgangslage starten','Eine neue Erzählung beginnt an dieser halboffenen Tür. Welcher erste Satz führt in die Handlung ein?',['Am Abend blieben Minka und Fuji vor der offenen Schuppentür stehen.','Danach verschwanden sie zufrieden im Laub.','Der Igel war unter dem Topf gewesen, deshalb hatte es gekratzt.','Sie wussten es dort sofort.'],'Der Einstieg benennt die Figuren, den Ort und ihre erste Handlung. Die Auflösung bleibt für später offen.',4],
    ['Den Zweck nennen','Lina geht nach Schulschluss in die Bibliothek, um ein Buch zurückzugeben. Welcher Satz passt als Einstieg?',['Nach Schulschluss ging Lina in die Bibliothek, um ein ausgeliehenes Buch zurückzugeben.','Endlich stellte Lina das gefundene Buch wieder ins Regal.','Dort war sie, und es war sehr aufregend.','Lina würde das Buch in der nächsten Woche zurückbringen.'],'Zeit, Figur, Ort und Ziel stimmen mit dem Schreibanlass überein. Der Satz eröffnet die Handlung, ohne die weitere Geschichte zu verraten.']
  ]
};

// Die richtige Lösung steht im Datensatz zuerst. Das Spiel mischt die Antwortkarten.
const MF_LANGUAGE_CHALLENGE = [
  ['satzanfaenge','Abwechslungsreiche Satzanfänge',[
    ['Ein Ort steht vorn','Welche Fassung beginnt mit dem Ort und hat die richtige Wortstellung?',
      ['Hinter der Scheune fand Minka einen Zettel.','Hinter der Scheune Minka fand einen Zettel.','Minka fand hinter der Scheune einen Zettel.','Hinter der Scheune einen Zettel fand Minka.'],
      '„Hinter der Scheune“ bildet zusammen das erste Satzglied. Das gebeugte Verb „fand“ steht direkt dahinter, danach folgt „Minka“.'],
    ['Dann, dann, dann','„Dann ging Fuji zur Tür. Dann hörte sie ein Klopfen. Dann trat Minka hinzu.“ Welche Fassung variiert die Anfänge und hält die Reihenfolge ein?',
      ['Vorsichtig ging Fuji zur Tür. Dahinter hörte sie ein Klopfen. Kurz darauf trat Minka hinzu.','Kurz darauf trat Minka hinzu. Vorsichtig ging Fuji zur Tür. Dahinter hörte sie ein Klopfen.','Dann ging Fuji zur Tür. Dann hörte sie ein Klopfen. Dann trat Minka hinzu.','Vorsichtig Fuji ging zur Tür. Dahinter hörte sie ein Klopfen. Kurz darauf trat Minka hinzu.'],
      'Die Anfänge zeigen Art und Weise, Ort und Zeitpunkt. Die Reihenfolge bleibt gleich: zur Tür gehen, das Klopfen hören, Minka kommt hinzu.'],
    ['Während oder danach?','Fuji hielt den Deckel fest. Zur selben Zeit tastete Minka nach dem Schlüssel. Welche Fassung zeigt, dass beides gleichzeitig geschah?',
      ['Während Fuji den Deckel festhielt, tastete Minka nach dem Schlüssel.','Nachdem Fuji den Deckel losgelassen hatte, tastete Minka nach dem Schlüssel.','Bevor Fuji den Deckel festhielt, tastete Minka nach dem Schlüssel.','Nachdem Minka nach dem Schlüssel getastet hatte, hielt Fuji den Deckel fest.'],
      '„Während“ verbindet zwei gleichzeitige Handlungen. Das Komma trennt den Nebensatz vom Hauptsatz, der mit „tastete“ beginnt.'],
    ['Eine Reaktion am Anfang','Die Tür schlug unvermittelt zu. Welcher Anfang zeigt Minkas Reaktion auf den Knall?',
      ['Erschrocken fuhr Minka herum.','Vor der Tür fuhr Minka herum.','Einen Tag zuvor fuhr Minka herum.','Mit dem Schlüssel in der Pfote fuhr Minka herum.'],
      '„Erschrocken“ zeigt, wie Minka auf den Knall reagiert. Die anderen Anfänge nennen den Ort, einen früheren Zeitpunkt oder einen Gegenstand.'],
    ['Ein Name schafft Klarheit','Minka und Fuji standen am Fenster. Welche Fortsetzung macht eindeutig, dass Fuji das Fenster öffnete?',
      ['Fuji schob das Fenster auf.','Vorsichtig schob sie das Fenster auf.','Kurz darauf schob sie das Fenster auf.','Mit einer Pfote schob sie das Fenster auf.'],
      'Bei zwei weiblichen Figuren kann „sie“ beide meinen. Der Name „Fuji“ macht klar, wer handelt. Ein Name kann daher der passendste Satzanfang sein.']
  ]],
  ['rede','Wörtliche Rede',[
    ['Der Begleitsatz davor','Wie schreibt man den Satz mit vorangestelltem Begleitsatz richtig?',
      ['Minka fragte: „Hörst du das?“','Minka fragte, „Hörst du das?“','Minka fragte: „Hörst du das“?','Minka fragte „Hörst du das?“'],
      'Nach „Minka fragte“ leitet ein Doppelpunkt die wörtliche Rede ein. Das Fragezeichen gehört zur gesprochenen Frage und steht innerhalb der Anführungszeichen.'],
    ['Die Frage zuerst','Welche Schreibweise ist richtig, wenn der Begleitsatz nach der Frage steht?',
      ['„Kommst du mit?“, fragte Fuji.','„Kommst du mit?“, Fragte Fuji.','„Kommst du mit“, fragte Fuji?','„Kommst du mit?“ fragte Fuji.'],
      'Das Fragezeichen bleibt in der Rede. Nach dem schließenden Anführungszeichen steht ein Komma. „fragte“ beginnt klein, weil der Begleitsatz den Satz fortsetzt.'],
    ['Der Ausruf','Welche Fassung hat die passenden Satzzeichen?',
      ['„Vorsicht!“, rief Minka.','„Vorsicht“!, rief Minka.','„Vorsicht!“, Rief Minka.','„Vorsicht!“, rief Minka!'],
      'Das Ausrufezeichen zeigt, wie die Figur spricht. Es gehört in die Rede. Der nachgestellte Begleitsatz schließt mit einem Punkt.'],
    ['Eine Aussage mit Begleitsatz','Fuji sagt, dass die Kiste leer ist. Welche Fassung stimmt?',
      ['„Die Kiste ist leer“, sagte Fuji.','„Die Kiste ist leer.“, sagte Fuji.','„Die Kiste ist leer,“ sagte Fuji.','„Die Kiste ist leer“ sagte Fuji.'],
      'Der Punkt der gesprochenen Aussage entfällt, wenn ein Begleitsatz folgt. Das Komma steht hinter dem schließenden Anführungszeichen.'],
    ['Die Rede wird unterbrochen','Der gesprochene Satz lautet „Unter dem Steg liegt etwas.“ Welche Schreibweise mit eingeschobenem Begleitsatz stimmt?',
      ['„Unter dem Steg“, flüsterte Fuji, „liegt etwas.“','„Unter dem Steg“ flüsterte Fuji, „liegt etwas.“','„Unter dem Steg“, flüsterte Fuji „liegt etwas.“','„Unter dem Steg“, flüsterte Fuji, „Liegt etwas.“'],
      'Zwei Kommas grenzen „flüsterte Fuji“ ab. „liegt“ beginnt klein, weil nach dem Einschub derselbe gesprochene Satz weitergeht.']
  ]],
  ['redewendungen','Redewendungen',[
    ['Kalte Füße bekommen','Vor dem Auftritt bekam Mia kalte Füße, obwohl der Raum warm war. Was bedeutet die Redewendung hier?',
      ['Mia wurde unsicher und traute sich kaum noch.','Mia stand barfuß auf kalten Fliesen.','Mia wollte sich beeilen, damit sie pünktlich war.','Mia ärgerte sich über ihre Schuhe.'],
      '„Kalte Füße bekommen“ bedeutet hier, kurz vor etwas den Mut zu verlieren. Der warme Raum und der bevorstehende Auftritt sprechen für die übertragene Bedeutung.'],
    ['Ein Stein fällt vom Herzen','Als Fuji den Igel gesund im Laub sah, fiel ihr ein Stein vom Herzen. Wie fühlte sie sich?',
      ['Erleichtert, weil die Sorge vorbei war.','Enttäuscht, weil ihre Suche erfolglos blieb.','Überrascht, weil sie unter dem Laub einen Stein fand.','Ärgerlich, weil sie den Igel nicht finden konnte.'],
      'Der Stein steht bildlich für eine Sorge oder Last. Weil der Igel gesund ist, fühlt sich Fuji erleichtert.'],
    ['Die Ohren spitzen','„Spitz die Ohren!“, flüsterte Minka, als es leise klopfte. Was sollte Fuji tun?',
      ['Besonders aufmerksam hinhören.','So laut wie möglich nach jemandem rufen.','Aufmerksam durch den Türspalt schauen.','Ohne zu zögern die Tür öffnen.'],
      'Wer die Ohren spitzt, hört besonders aufmerksam zu. Das leise Klopfen macht hier das genaue Hinhören wichtig.'],
    ['Etwas unter die Lupe nehmen','Sami nahm die Nachricht unter die Lupe. Er hatte kein Vergrößerungsglas. Was tat er?',
      ['Er untersuchte die Nachricht sehr genau.','Er warf die Nachricht nach einem Blick weg.','Er las die Nachricht aus großer Entfernung.','Er gab die Nachricht ungelesen weiter.'],
      '„Etwas unter die Lupe nehmen“ bedeutet, etwas gründlich zu untersuchen. Dazu braucht Sami kein echtes Vergrößerungsglas.'],
    ['Den Faden verlieren','Mia wurde mitten in ihrer Erzählung unterbrochen. Danach verlor sie den Faden. Was passierte?',
      ['Sie wusste nicht mehr, an welcher Stelle sie weitererzählen sollte.','Sie hatte ihre Geschichte schon vollständig beendet.','Sie konnte sich nur an die Überschrift erinnern.','Sie hatte beim Erzählen einen Wollfaden fallen lassen.'],
      'Der „Faden“ steht für den Zusammenhang der Erzählung. Die Unterbrechung brachte Mia aus dem Ablauf.']
  ]],
  ['gefuehle','Gefühle',[
    ['Angst zeigen','Welche Fassung zeigt Minkas Angst durch eine Körperreaktion?',
      ['Minkas Pfoten zitterten. Sie wich bis zur Wand zurück.','Minka fürchtete sich vor dem Geräusch.','Minka stand neben der hölzernen Tür.','Minka wollte wissen, wer im Schuppen war.'],
      'Zittern und Zurückweichen lassen die Angst sichtbar werden. „Minka fürchtete sich“ benennt das Gefühl direkt, ohne eine körperliche Reaktion zu zeigen.'],
    ['Erleichterung nach dem Fund','Fuji hatte Angst, dass der Igel verletzt war. Welche Fortsetzung zeigt ihre Erleichterung, als er gesund davonlief?',
      ['Fuji atmete tief aus und ließ die Schultern sinken.','Fuji spannte sich an und suchte weiter nach ihm.','Fuji fletschte die Zähne und knurrte.','Fuji stieß sich ab und sprang vor Schreck zurück.'],
      'Das tiefe Ausatmen und die gelöste Haltung passen zur nachlassenden Anspannung. Die anderen Handlungen zeigen fortdauernde Sorge, Ärger oder Schreck.'],
    ['Freude ohne Gefühlswort','Welcher Satz zeigt Toms Freude durch sein Verhalten, nachdem sein Papierboot das Ziel erreicht hat?',
      ['Tom klatschte in die Hände und grinste bis über beide Ohren.','Tom war sehr froh, dass sein Boot das Ziel erreichte.','Tom sah auf die Farbe seines Boots.','Tom zog den Deckel über die Kiste und blickte weg.'],
      'Klatschen und Grinsen machen die Freude beobachtbar. Der zweite Satz nennt sie, zeigt sie aber nicht durch Toms Verhalten.'],
    ['Gedanke oder Gefühl?','Welcher Satz gibt einen Gedanken wieder und passt zu Mias Sorge?',
      ['Was, wenn der Bus ohne mich losfuhr?','Mias Knie zitterten vor Aufregung.','„Warte auf mich!“, rief Mia.','Der Motor lief schon.'],
      'Die Frage verrät, was Mia sich im Stillen vorstellt. Die anderen Sätze zeigen eine Körperreaktion, gesprochene Rede oder eine Beobachtung.'],
    ['Ein Gefühl verändert sich','In welcher Fassung merkt man, wie aus Sorge Erleichterung wird?',
      ['Mia hielt den Atem an. Als die Katze gesund auftauchte, atmete sie tief aus.','Mia freute sich vor dem Fund und lachte danach weiter.','Mia zitterte vor und nach der Nachricht unverändert.','Mia wartete am Tor. Die Katze saß später in der Küche.'],
      'Der angehaltene Atem zeigt zuerst Anspannung. Das Ausatmen nach dem guten Ausgang lässt die Veränderung erkennen.']
  ]],
  ['spannung','Spannende Textstellen',[
    ['Ein Hindernis entsteht','Fuji sucht mit einer Taschenlampe im dunklen Keller. Welche Fortsetzung steigert die Spannung?',
      ['Die Taschenlampe flackerte. Wenn sie ausging, würde Fuji den Ausgang kaum noch finden.','Die Taschenlampe hatte einen silbernen Griff.','Fuji hatte die Taschenlampe am Morgen eingepackt.','Die Taschenlampe lag am Ende wieder auf ihrem Platz.'],
      'Das mögliche Erlöschen macht die Suche schwieriger und setzt Fuji unter Zeitdruck. Angaben zu Farbe, Vorgeschichte oder Aufbewahrung schaffen hier kein Hindernis.'],
    ['Die Ursache offenlassen','Welche Stelle weckt Neugier auf ein Geräusch?',
      ['Dreimal klopfte es unter der Bank. Als Minka näher kam, verstummte es.','Ein loser Haken klopfte unter der Bank. Minka zog ihn fest.','Unter der Bank standen zwei alte Stiefel.','Minka setzte sich auf die Bank und wartete auf Fuji.'],
      'Klopfen und plötzliches Verstummen sind konkrete Hinweise. Ihre Ursache bleibt offen, sodass die Leser weiterwissen möchten.'],
    ['Die letzten Sekunden','Welche Stelle lässt die Leser den gefährlichen Augenblick unmittelbar miterleben?',
      ['Der Topf kippte. Fuji sprang vor und spürte den rauen Rand unter ihrer Pfote. Das Gefäß rutschte weiter.','Fuji fand die Situation sehr spannend und rettete den Topf.','Der Topf war drei Jahre alt und hatte eine rote Farbe.','Nach der Rettung stand der Topf wieder fest auf dem Regal.'],
      'Kurze Handlungsschritte, der Tasteindruck und der noch rutschende Topf machen den Moment greifbar. Das Ergebnis bleibt zunächst offen.'],
    ['Ein Geräusch wird lauter','Welche Fassung lässt ein Geräusch immer bedrohlicher wirken?',
      ['Das Scharren begann leise. Mit jedem Schritt zur Tür wurde es deutlicher, bis das Holz erzitterte.','Das Scharren war vorbei, bevor Minka es bemerkte.','Minka las ein Schild mit der Aufschrift „Tür“.','Minka wusste seit gestern, dass Fuji hinter der Tür wartete.'],
      'Das Geräusch steigert sich vom leisen Scharren bis zum Zittern des Holzes. Die Bewegung zur Tür und die Veränderung des Klangs wirken zusammen.'],
    ['Ein Gedanke macht neugierig','Welche Fortsetzung baut Spannung auf, wenn Mia vor einer verschlossenen Tür steht?',
      ['Unter der Tür wanderte ein Lichtstreifen. Wer bewegte sich da drinnen?','Unter der Tür wanderte Papas Taschenlampenlicht. Mia kannte die Ursache.','Unter der Tür war ein schmaler Spalt. Mia zählte die Bretter der Tür.','Mia erinnerte sich, wie lange die Tür schon braun gestrichen war.'],
      'Der Lichtstreifen liefert einen konkreten Hinweis. Mias Frage hält offen, wer dahintersteckt, und gibt den Lesern einen Grund weiterzulesen.']
  ]],
  ['gegensaetze','Gegensätze',[
    ['Leise und laut','Welches Wort bildet in „Erst war das Klopfen leise“ einen passenden Gegensatz zu „leise“?',
      ['laut','gleichmäßig','kurz','nah'],
      '„Leise“ und „laut“ beschreiben entgegengesetzte Lautstärken. Die anderen Wörter beschreiben Rhythmus, Dauer oder Entfernung.'],
    ['Nah und fern','„Am Anfang hörte Mia das Klirren in der Ferne.“ Welche Fortsetzung bildet einen räumlichen Gegensatz?',
      ['Jetzt hörte sie es ganz nah.','Jetzt hörte sie es viel lauter.','Jetzt hörte sie es zum zweiten Mal.','Jetzt hörte sie es nur ganz kurz.'],
      '„Ganz nah“ ist der räumliche Gegensatz zu „in der Ferne“. Lauter, öfter und kürzer beschreiben andere Eigenschaften.'],
    ['Hell und dunkel','Welche Fassung stellt zwei Orte durch einen Gegensatz anschaulich gegenüber?',
      ['Draußen war es hell. Im Keller war es dunkel.','Draußen war es hell. Am Fenster war es sonnig.','Draußen stand ein Baum. Im Keller stand ein Eimer.','Draußen war es dunkel. Im Keller war es finster.'],
      '„Hell“ und „dunkel“ sind Gegensätze. Sie machen den Wechsel von draußen in den Keller sofort spürbar.'],
    ['Unruhe nach der Stille','Welche Fassung nutzt einen Gegensatz, um den plötzlichen Wechsel der Stimmung zu zeigen?',
      ['Eben war der Hof still. Jetzt schepperte ein Eimer über die Steine.','Erst schepperte der Eimer leise. Dann klapperte eine Dose leise.','Der Hof war breit, und die Einfahrt war gepflastert.','Erst sah Fuji ein Blatt. Danach sah sie ein zweites Blatt.'],
      'Die Stille und das Scheppern stehen einander gegenüber. Dadurch fällt der abrupte Wechsel besonders auf.'],
    ['Mias Haltung','Welches Wort steht in einem passenden Gegensatz zu „mutig“?',
      ['ängstlich','aufmerksam','geduldig','neugierig'],
      '„Mutig“ beschreibt, dass jemand sich trotz Gefahr etwas zutraut. „Ängstlich“ beschreibt eine von Angst geprägte Haltung. Die anderen Wörter können zu beiden Figuren passen.']
  ]],
  ['hoehepunkt','Höhepunkte',[
    ['Die Rettung entscheidet sich','Minka und Fuji hören ein Kratzen, finden einen Igel unter einem Topf und befreien ihn. Wo liegt der Höhepunkt?',
      ['Als der Topf rutscht und sich entscheidet, ob die beiden den Igel rechtzeitig befreien.','Als Minka und Fuji am Nachmittag in den Garten gehen.','Als sie das erste Kratzen hinter der Tür hören.','Als der befreite Igel im Laub verschwindet.'],
      'Am Höhepunkt entscheidet sich der Ausgang des zentralen Problems. Das Kratzen eröffnet das Rätsel, die Rettung entscheidet es, und danach klingt die Geschichte aus.'],
    ['Der rollende Ball','Fuji muss verhindern, dass der Ball unter das Tor rollt. Welcher Moment ist der Höhepunkt?',
      ['Fuji springt vor, streckt die Pfote aus und stoppt den Ball direkt am Tor.','Fuji sieht den Ball in der Mitte des Hofs liegen.','Fuji legt den Ball nach der Rettung in den Korb.','Fuji geht zu Beginn der Geschichte auf den Hof.'],
      'Der Sprung entscheidet, ob der Ball noch erreicht wird. Die anderen Szenen führen zum Problem hin oder folgen nach seiner Lösung.'],
    ['Spannung ist mehr als Lautstärke','Welche Stelle ist der Höhepunkt einer Geschichte über den verlorenen Anhänger?',
      ['Mia schiebt die Stange unter den fast versunkenen Anhänger und zieht ihn gerade noch heraus.','Auf dem Weg klappert ein Laster sehr laut vorbei.','Mia erzählt, wann sie den Anhänger bekommen hat.','Mia zeigt den gefundenen Anhänger zu Hause.'],
      'Der Höhepunkt liegt beim entscheidenden Versuch, den Anhänger zu retten. Der Laster ist laut, ändert aber nichts an der Suche.'],
    ['Ausführlich erzählen','Welche Fassung erzählt den Höhepunkt „Lina rettet ein Foto vor der Pfütze“ anschaulich?',
      ['Das Foto glitt über die Kante. Lina warf sich vor und packte es mit zwei Fingern. Eine Ecke hing schon über der Pfütze.','Lina rettete das Foto. Ende.','Am Morgen hatte Lina das Foto lange betrachtet.','Später legte Lina das Foto auf das Fensterbrett.'],
      'Die erste Fassung verlangsamt den entscheidenden Augenblick. Man sieht nacheinander das Rutschen, Linas Eingreifen und den knappen Abstand zum Wasser.'],
    ['Die Spannungskurve lesen','An welcher Stelle des Spannungswals liegt der Höhepunkt?',
      ['Am höchsten Punkt des Rückens, im Hauptteil.','Am Kopf, noch bevor die Handlung beginnt.','Am Schwanz, nachdem die Spannung abgeklungen ist.','Am ersten Hinweis, sobald ein Rätsel auftaucht.'],
      'Der hohe Rücken steht für die stärkste Spannung. Der Höhepunkt liegt im Hauptteil. Danach fällt die Kurve zum Schluss hin wieder ab.']
  ]],
  ['schlingen','Schlingen legen',[
    ['Ein Hinweis im ersten Absatz','Welcher Satz legt eine Schlinge, also einen Hinweis, der neugierig macht?',
      ['Unter der verschlossenen Tür schimmerte ein roter Streifen.','Unter der Tür leuchtete Papas rote Taschenlampe, die er dort eingeschaltet hatte.','Minka stand am Nachmittag im Garten.','Minka war am Ende froh, wieder zu Hause zu sein.'],
      'Der rote Streifen ist ein konkreter Hinweis. Weil seine Ursache offenbleibt, fragen sich die Leser, woher das Licht kommt.'],
    ['Nicht zu früh verraten','Was sollte die Einleitung zurückhalten, wenn sie ein Klopfen im Schuppen als Schlinge nutzt?',
      ['Die Erklärung, dass ein loser Haken gegen das Holz schlägt.','Den Ort, an dem das Klopfen zu hören ist.','Die Information, wer das Klopfen bemerkt.','Den Hinweis, dass es dreimal klopft.'],
      'Ort, Figur und Geräusch helfen beim Verstehen. Die Ursache ist die Auflösung und bleibt zunächst offen.'],
    ['Die rote Spur wiederaufnehmen','In der Einleitung sieht Fuji eine rote Spur bis zum Tor. Welche spätere Stelle löst genau diese Schlinge auf?',
      ['Am Tor stand ein umgekippter Farbtopf. Die rote Farbe war von dort über die Steine gelaufen.','Am Tor hing ein neues Schloss. Fuji schloss es ab.','Hinter dem Tor lag ein trockener blauer Zettel.','Fuji lief nach Hause und fand dort ihren Ball.'],
      'Der umgekippte Topf erklärt Farbe, Verlauf und Herkunft der Spur. Die anderen Funde haben mit der roten Spur keinen Zusammenhang.'],
    ['Ein Hinweis mit Bedeutung','Mia entdeckt am Anfang eine eingeritzte Sieben auf einem Schlüssel. Welche Fortsetzung macht dieses Detail wichtig?',
      ['Der Schlüssel öffnet genau das Fach, das mit einer Sieben beschriftet ist.','Mia zählt zu Hause sieben Bücher, legt den Schlüssel aber weg.','Mia benutzt einen anderen Schlüssel und vergisst die Sieben.','Mia malt eine Sieben auf ihr Heft, ohne sie mit dem Schlüssel zu verbinden.'],
      'Die wiederkehrende Sieben hilft Mia, das richtige Fach zu erkennen. Ein zufälliges Wiederholen der Zahl allein würde die Bedeutung des Hinweises nicht erklären.'],
    ['Geräusch statt Behauptung','Welcher Satz liefert eine Spur, die man als Schlinge verwenden kann?',
      ['Hinter dem Vorhang rasselte es, obwohl im Flur niemand zu sehen war.','Der Flur war sehr spannend.','Minka war aufgeregt und wollte eine Geschichte erzählen.','Hinter dem Vorhang schüttelte Fuji eine Dose mit Kieseln.'],
      'Das Rasseln ist hörbar, doch die Quelle bleibt verborgen. Die letzte Fassung löst das Rätsel bereits auf, die anderen liefern keinen konkreten Hinweis.']
  ]],
  ['erster-satz','Erster Satz in der Einleitung',[
    ['Wer, wo und wann?','Mia und Sami suchen am Freitag auf dem Schulhof nach einem Ball. Welcher erste Satz führt gut in diese Situation ein?',
      ['Am Freitagnachmittag suchten Mia und Sami auf dem Schulhof ihren Ball.','Mia und Sami fanden ihren Ball unter der Bank und gingen heim.','Auf dem Schulhof lagen viele Steine und Blätter.','Am Freitagnachmittag war irgendetwas passiert.'],
      'Der erste Satz nennt Figuren, Ort, Zeit und Ausgangssituation. Der Fund wird noch nicht vorweggenommen, sodass die Suche als Handlung beginnen kann.'],
    ['Der Anfang vor der Lösung','Welche Fassung passt als erster Satz einer Geschichte über ein rätselhaftes Kratzen im Garten?',
      ['Am Abend gingen Minka und Fuji in den Garten, um ihren Ball zu holen.','Endlich war der Igel gerettet, und alle gingen nach Hause.','Mit letzter Kraft stemmte Fuji den rutschenden Topf hoch.','Der Igel hatte das Kratzen verursacht, das sie vorhin hörten.'],
      'Der erste Satz führt die beiden Figuren in eine verständliche Ausgangssituation. Rettung, Höhepunkt und Erklärung gehören zu späteren Abschnitten dieser Geschichte.'],
    ['Ein Anfang im Präteritum','Welcher Einstieg beginnt eine Schulgeschichte im Präteritum?',
      ['Am Morgen fand Lina auf dem Sportplatz einen Schlüssel.','Am Morgen findet Lina auf dem Sportplatz einen Schlüssel.','Am Morgen hat Lina auf dem Sportplatz einen Schlüssel gefunden.','Am Morgen wird Lina auf dem Sportplatz einen Schlüssel finden.'],
      '„Fand“ ist das Präteritum zu „finden“. Die anderen Formen stehen im Präsens, Perfekt oder Futur und passen daher nicht zur geforderten Erzählzeit.'],
    ['Der erste Satz gibt Orientierung','Welcher erste Satz hilft den Lesern, sich eine Szene am See vorzustellen?',
      ['An einem nebligen Morgen wartete Fuji am alten Steg auf Minka.','Dort wartete jemand schon eine ganze Weile.','Und dann war alles vorbei.','Das hatte sie bestimmt gehört.'],
      'Zeit, Figur und Ort werden konkret. „Dort“, „jemand“, „sie“ und „das“ brauchen dagegen einen Zusammenhang, den die Leser am Anfang noch nicht kennen.'],
    ['Eine Ausgangssituation mit einem Ziel','Lina will nach dem Training ihre Trinkflasche holen. Welcher Satz beginnt passend und lässt Raum für ein späteres Rätsel?',
      ['Nach dem Training ging Lina zur Bank zurück, um ihre Trinkflasche zu holen.','Lina holte ihre Trinkflasche, löste das Rätsel und ging nach Hause.','Lina war da, und das war schon ganz spannend.','Lina zählte später, wie viele Trinkflaschen auf der Bank standen.'],
      'Der Zweck „um ihre Trinkflasche zu holen“ zeigt, warum Lina zur Bank geht. Die Handlung hat einen klaren Anfang, ohne ein späteres Rätsel vorwegzunehmen.']
  ]]
].map(([id,title,rows])=>({
  id,title,questions:[...rows,...CHALLENGE_ADDITIONS[id]].map(([title,text,options,explain,scene])=>({title,text,options,explain,answer:0,category:id,image:CHALLENGE_IMAGES[scene]}))
}));

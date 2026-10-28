'use strict';
(() => {
const root = document.getElementById('language-lesson');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const choice = (title, text, options, answer, explain, hint) => ({title, text, options, answer, explain, hint});
const gap = (title, before, after, options, answer, explain, hint) => ({type:'gap', title, before, after, options, answer, explain, hint});
const topics = [
  {
    id:'schlingen', title:'Schlingen legen', guide:'Minka',
    goal:'Eine Einleitung schreiben, die Orientierung gibt und neugierig macht.',
    explanation:'Eine „Schlinge“ ist hier ein erzählerischer Köder: Ein auffälliger Hinweis weckt eine Frage im Kopf der Leser. Die Antwort bleibt zunächst offen. Du fängst damit ihre Aufmerksamkeit ein. Eine echte Schlinge ist damit nicht gemeint.',
    steps:['Stelle Minka und Fuji, den Ort, die Zeit und ihre Ausgangssituation in wenigen Sätzen vor.', 'Füge einen konkreten Hinweis hinzu: ein Geräusch, eine Spur, einen Gegenstand oder eine merkwürdige Beobachtung.', 'Lass eine passende Frage offen. Erzähle später, woher der Hinweis stammt oder was er bedeutet. Verrate die Lösung noch nicht in der Einleitung.'],
    tip:'Eine passende Schlinge reicht oft. „Es war sehr spannend“ behauptet nur etwas. Ein rätselhaftes Klopfen lässt uns dagegen fragen: Wer ist dort? Eine Einleitung braucht noch keinen Höhepunkt.',
    before:'An einem Herbstnachmittag gingen Minka und Fuji durch den Garten. Es war spannend.',
    after:'An einem Herbstnachmittag suchte Minka mit Fuji ihren roten Ball im Garten. Vor dem alten Schuppen blieb die getigerte Katze stehen. Hinter der verschlossenen Tür kratzte etwas.',
    why:'Figuren, Zeit, Ort und Ballsuche geben Orientierung. Das Kratzen ist die Schlinge: Was steckt dahinter? Fuji hilft Minka bei der Suche; sie selbst spielt nicht gern Ball.',
    bankTitle:'Vier Möglichkeiten für deine Schlinge',
    bank:[['Geräusch','Kratz. Kratz. Aus dem Schuppen drang ein leises Scharren.','Wer oder was verursacht es?'],['Spur','Im feuchten Gras entdeckte Minka winzige Abdrücke.','Wohin führen die Spuren?'],['Gegenstand','Vor Fujis Pfoten lag ein Schlüssel mit einer eingeritzten Zahl.','Wozu gehört er?'],['Beobachtung','Unter dem Steg blitzte etwas auf, obwohl dort niemand stand.','Was hat Minka gesehen?']],
    followup:'Eine mögliche spätere Auflösung: Im Hauptteil entdecken Minka und Fuji einen Igel unter einem Topf. Seine Krallen haben über den Boden gescharrt. Sie befreien ihn. So hat das Kratzen eine Bedeutung für die Handlung.',
    tasks:[
      choice('Welche Einleitung legt eine Schlinge?', 'Minka und Fuji spazieren am See. Welcher Zusatz macht mit einem konkreten Hinweis neugierig?', ['Es war ein schöner Spaziergang.','Unter dem Steg klopfte etwas dreimal gegen das Holz.','Am Ende fanden sie eine lose Planke, die das Klopfen verursachte.'],1,'Das Klopfen weckt eine Frage und verrät die Ursache noch nicht. Die lose Planke erklärt bereits die Lösung.','Suche einen wahrnehmbaren Hinweis, dessen Ursache offen bleibt.'),
      choice('Was fehlt noch?', '„Hinter der Tür kratzte etwas.“ Das ist die ganze Einleitung. Was sollte Minka ergänzen?', ['Die vollständige Rettung des Igels.','Eine Liste aller Verben.','Wer dort ist, wo und wann die Szene spielt und was die Figuren zunächst tun.'],2,'Eine Schlinge ersetzt nicht die Orientierung. Minka könnte mit Fuji an einem Herbstnachmittag im Garten ihren Ball suchen.','Leser sollen sich am Anfang in der Szene zurechtfinden.'),
      choice('Die Schlinge später auflösen', 'In der Einleitung entdeckt Fuji eine nasse Spur im trockenen Schuppen. Welche Fortsetzung greift den Hinweis sinnvoll auf?', ['Minka findet einen undichten Eimer. Von dort führt die Spur zur Tür.','Minka vergisst die Spur. Ein Raumschiff landet ohne Zusammenhang.','Fuji erklärt nur: „Es bleibt für immer spannend.“'],0,'Der undichte Eimer erklärt die nasse Spur. Der Hinweis wird wieder aufgenommen und bekommt eine nachvollziehbare Ursache.','Die Fortsetzung sollte erklären, woher das Wasser stammt.'),
      choice('Die Lösung zurückhalten', 'Welche Fassung lässt am Anfang eine Frage offen?', ['Fuji wusste sofort, dass der Igel das Kratzen verursachte.','Fuji legte den Kopf schief. Warum kratzte es hinter der Tür?','Der befreite Igel war schon im Garten verschwunden.'],1,'Die Frage richtet den Blick auf den Hinweis. Die anderen Sätze verraten die Ursache oder erzählen schon das Ergebnis.','Welche Fassung kennt die Ursache noch nicht?')
    ],
    write:'Schreibe eine Einleitung mit 3–5 Sätzen: Minka und Fuji sind an einem nebligen Morgen am See. Sie wollen am Ufer spazieren. Unter dem Steg entdecken sie einen Hinweis. Lege eine Schlinge und notiere getrennt, wie du sie später auflösen könntest.',
    model:'Am frühen Morgen spazierten Minka und Fuji am See entlang. Dünner Nebel lag über dem Wasser. Gerade wollte Fuji zum Waldweg abbiegen, als unter dem Steg ein rotes Licht aufblinkte. Minka beugte sich vor. Wer hatte dort etwas versteckt?\n\nPlan für später: Das Licht gehört zu einer verlorenen Taschenlampe. Im Hauptteil finden sie heraus, wem sie gehört.',
    checks:['Die Ausgangssituation ist verständlich.','Ein konkreter Hinweis weckt Neugier.','Die Einleitung verrät die Lösung noch nicht.','Mein getrennter Plan greift den Hinweis später wieder auf.']
  },
  {
    id:'gehen', title:'Verben für gehen', guide:'Fuji',
    goal:'Die Bewegung so genau beschreiben, dass Leser sie sich vorstellen können.',
    explanation:'„Gehen“ ist ein allgemeines Verb. Andere Bewegungsverben zeigen Tempo, Stimmung oder die Art der Bewegung. Wähle das Wort nach der Szene. Du musst nicht jedes „gehen“ ersetzen.',
    steps:['Überlege: Bewegt sich die Figur langsam, schnell, vorsichtig oder müde?', 'Wähle ein Verb, dessen Bedeutung dazu passt.', 'Setze es in die Erzählzeit: schleichen → schlich. Prüfe, ob der ganze Satz noch stimmt.'],
    tip:'„Rennen“ und „schleichen“ bedeuten nicht dasselbe. Ein präzises Verb kann einen umständlichen Zusatz ersetzen: „ging sehr leise und vorsichtig“ → „schlich“.',
    before:'Minka ging leise zum Schuppen. Fuji ging müde hinter ihr her.',
    after:'Minka schlich zum Schuppen. Fuji trottete müde hinter ihr her.',
    why:'„Schlich“ zeigt vorsichtige, leise Bewegung. „Trottete“ passt zu Fujis gemächlichem Schritt. Die Verben zeichnen zwei unterschiedliche Bewegungen.',
    bankTitle:'Bewegung · Grundform → Präteritum',
    bank:[['schleichen → schlich','leise und vorsichtig','Minka schlich an der Tür vorbei.'],['trippeln → trippelte','mit kleinen, schnellen Schritten','Minka trippelte über die Steine.'],['trotten → trottete','langsam und gleichmäßig','Fuji trottete hinter Minka her.'],['schlendern → schlenderte','entspannt und ohne Eile','Fuji schlenderte durch den Garten.'],['hasten → hastete','eilig, oft unruhig','Minka hastete zum schützenden Vordach.'],['rennen → rannte','schnell laufen','Minka rannte über die Wiese.'],['stapfen → stapfte','mit schweren, deutlichen Schritten','Fuji stapfte durch den tiefen Schnee.'],['stolpern → stolperte','beim Gehen aus dem Tritt geraten','Minka stolperte über eine Wurzel.'],['humpeln → humpelte','wegen Beschwerden ungleichmäßig gehen','Mit schmerzender Pfote humpelte Fuji heim.']],
    tasks:[
      gap('Leise Pfoten', 'Minka wollte den schlafenden Igel nicht wecken. Sie ', ' an ihm vorbei.', ['stapfte','schlich','polterte'],1,'„Schlich“ passt zum Ziel, sich möglichst leise zu bewegen. Stapfen und Poltern wären hier zu laut.','Wie bewegt man sich, wenn niemand aufwachen soll?'),
      gap('Ohne Eile', 'Fuji genoss die Abendluft. Ohne Eile ', ' sie am Gartenzaun entlang.', ['hastete','stürmte','schlenderte'],2,'„Schlenderte“ beschreibt entspanntes Gehen. Hastiges Bewegen widerspricht „ohne Eile“.','Suche eine entspannte Bewegung.'),
      gap('Im Schnee', 'Der Schnee reichte Fuji bis zum Bauch. Mit schweren Schritten ', ' sie zum Tor.', ['stapfte','schwebte','trippelte'],0,'„Stapfte“ macht die schweren Schritte im tiefen Schnee deutlich.','Welche Bewegung passt zu mühsamen, schweren Schritten?'),
      choice('Im Präteritum erzählen', 'Minka möchte „Sie geht vorsichtig zur Tür“ genauer und im Präteritum schreiben.', ['Sie schleichen vorsichtig zur Tür.','Sie schlich zur Tür.','Sie wird zur Tür schleichen.'],1,'„Schlich“ ist das Präteritum von „schleichen“. Es passt zur einzelnen Figur Minka.','Gestern schlich sie; heute schleicht sie.')
    ],
    write:'Minka und Fuji nähern sich einem verlassenen Gartenhaus. Schreibe drei Sätze im Präteritum. Verwende zwei verschiedene Bewegungsverben und zeige, wie sich ihre Schritte unterscheiden.',
    model:'Minka schlich zum Gartenhaus. Fuji trottete hinter ihr her und schnupperte an der Tür. Als ein Ast knackte, hastete Minka unter die Bank.',
    checks:['Meine Bewegungsverben passen zum Tempo und zur Situation.','Ich verwende mindestens zwei verschiedene Bewegungsverben.','Meine Erzählsätze stehen im Präteritum.']
  },
  {
    id:'sehen', title:'Verben für sehen', guide:'Minka',
    goal:'Zeigen, wie aufmerksam, wie lange oder mit welcher Absicht eine Figur schaut.',
    explanation:'„Sehen“ beschreibt eine Wahrnehmung. Verben wie „spähen“, „mustern“ oder „entdecken“ sagen genauer, was dabei geschieht. Sie sind keine beliebig austauschbaren Wörter.',
    steps:['Kläre: Schaut die Figur kurz, lange, genau, suchend oder heimlich?', 'Wähle ein passendes Verb und gegebenenfalls eine Ergänzung: auf etwas starren, durch einen Spalt spähen.', 'Prüfe die Perspektive: Was kann Minka von ihrem Platz aus tatsächlich sehen?'],
    tip:'„Erblicken“ heißt: etwas sehen oder bemerken. „Beobachten“ dauert meist länger. „Entdecken“ betont, dass etwas zuvor verborgen oder unbekannt war.',
    before:'Minka sah durch den Türspalt. Fuji sah den fremden Schlüssel genau an.',
    after:'Minka spähte durch den Türspalt. Fuji musterte den fremden Schlüssel.',
    why:'Minka versucht durch eine schmale Öffnung etwas zu erkennen. Fuji prüft den Gegenstand genau. Beide tun mehr als bloß „sehen“.',
    bankTitle:'Blicke · Grundform → Präteritum',
    bank:[['spähen → spähte','aufmerksam und suchend schauen','Minka spähte durch den Türspalt.'],['mustern → musterte','prüfend und genau ansehen','Fuji musterte den alten Schlüssel.'],['starren → starrte','lange mit festem Blick ansehen','Minka starrte auf das blinkende Licht.'],['beobachten → beobachtete','über eine gewisse Zeit aufmerksam verfolgen','Fuji beobachtete den Igel.'],['entdecken → entdeckte','etwas bisher Unbemerktes finden','Minka entdeckte eine Spur im Gras.'],['erblicken → erblickte','etwas sehen oder bemerken','Am Ufer erblickte Fuji einen Reiher.'],['blinzeln → blinzelte','die Augen kurz öffnen und schließen','Minka blinzelte im hellen Sonnenlicht.'],['überblicken → überblickte','einen Bereich als Ganzes erfassen','Vom Hügel aus überblickte Fuji den Garten.']],
    tasks:[
      gap('Durch den Spalt', 'Minka versuchte, im dunklen Schuppen etwas zu erkennen. Sie ', ' durch den schmalen Türspalt.', ['übersah','schlief','spähte'],2,'„Spähte“ beschreibt suchendes, aufmerksames Schauen durch den Spalt. „Übersah“ würde hier nicht passen.','Sie versucht aufmerksam hineinzuschauen.'),
      gap('Ganz genau', 'Fuji wollte wissen, ob die Kerben im Schlüssel Zahlen waren. Sie ', ' ihn sorgfältig.', ['musterte','überhörte','vergaß'],0,'„Musterte“ heißt, etwas prüfend und genau anzusehen.','Welches Wort bedeutet „genau prüfen, indem man hinschaut“?'),
      choice('Welche Beobachtung dauert länger?', 'Minka möchte zeigen, dass Fuji eine Weile verfolgt, was der Igel tut.', ['Fuji erblickte den Igel zum ersten Mal.','Fuji beobachtete, wie der Igel langsam unter die Hecke kroch.','Fuji übersah den Igel vollständig.'],1,'„Beobachtete“ zeigt das aufmerksame Verfolgen einer Handlung über eine gewisse Zeit.','Achte auf einen Vorgang, den Fuji mit dem Blick verfolgt.'),
      choice('Das Verb verändert die Aussage', 'Was bedeutet „Minka übersah die kleine Spur“?', ['Sie sah sich die Spur besonders sorgfältig an.','Sie schaute von oben auf die Spur.','Sie bemerkte die Spur nicht.'],2,'In diesem Satz heißt „übersah“, dass Minka die Spur nicht bemerkte. Es ist hier kein Ersatz für „sah“.','Vorsicht: Ähnlich aussehende Wörter können etwas anderes bedeuten.')
    ],
    write:'Unter dem Steg liegt etwas Glänzendes. Schreibe drei Sätze: Minka schaut suchend, Fuji prüft einen Fund und eine der beiden entdeckt ein neues Detail. Wähle passende Verben.',
    model:'Minka spähte zwischen den Brettern hindurch. Neben einem Stein entdeckte sie einen kleinen Anhänger. Fuji musterte die eingeritzten Buchstaben.',
    checks:['Meine Verben zeigen unterschiedliche Arten des Schauens.','Die Figuren können die beschriebenen Dinge von ihrem Standort aus sehen.','Ich verwende passende Ergänzungen und die gleiche Erzählzeit.']
  },
  {
    id:'sagen', title:'Verben für sagen', guide:'Fuji',
    goal:'Mit Redeverben Lautstärke, Absicht oder Stimmung deutlich machen.',
    explanation:'„Sagen“ ist ein neutrales Redeverb und darf vorkommen. „Flüstern“ zeigt eine leise Stimme, „fragen“ eine Absicht und „warnen“ einen Hinweis auf Gefahr. Wähle nach dem Inhalt der Äußerung.',
    steps:['Lies die wörtliche Rede: Fragt, antwortet oder warnt die Figur?', 'Überlege, ob Lautstärke oder Stimmung wichtig sind.', 'Wähle ein treffendes Redeverb. Ergänze Gestik als eigenen Satz, wenn du sie zeigen möchtest.'],
    tip:'„Lächeln“ beschreibt keine Sprechhandlung. Klarer: „Fuji lächelte. ‚Das schaffen wir‘, sagte sie.“ „Sagte“ muss nicht um jeden Preis ersetzt werden.',
    before:'„Sei leise!“, sagte Fuji leise. „Warum?“, sagte Minka.',
    after:'„Sei leise!“, flüsterte Fuji. „Warum?“, fragte Minka.',
    why:'„Flüsterte“ macht den Zusatz „leise“ meist überflüssig. „Fragte“ passt zu Minkas Frage. So werden die Begleitsätze genauer.',
    bankTitle:'Stimmen · Grundform → Präteritum',
    bank:[['flüstern → flüsterte','sehr leise sprechen','„Hörst du das?“, flüsterte Minka.'],['rufen → rief','laut sprechen, damit jemand es hört','„Hier bin ich!“, rief Minka.'],['murmeln → murmelte','leise, oft undeutlich sprechen','„Seltsam“, murmelte Fuji.'],['fragen → fragte','etwas wissen wollen','„Was liegt dort?“, fragte Minka.'],['antworten → antwortete','auf eine Frage reagieren','Fuji antwortete: „Ein Schlüssel.“'],['erklären → erklärte','etwas verständlich machen','„Die Spur führt zum Eimer“, erklärte Fuji.'],['warnen → warnte','auf eine Gefahr aufmerksam machen','„Vorsicht, das Brett ist locker!“, warnte Fuji.'],['jubeln → jubelte','Freude laut ausdrücken','„Wir haben es geschafft!“, jubelte Minka.'],['widersprechen → widersprach','eine andere Auffassung äußern','„Dort war kein Wind“, widersprach Fuji.']],
    tasks:[
      gap('Den Igel nicht erschrecken', '„Sprich ganz leise“, ', ' Fuji mit kaum hörbarer Stimme.', ['brüllte','flüsterte','jubelte'],1,'„Flüsterte“ passt zur kaum hörbaren Stimme. Brüllen und Jubeln wären laut.','Das Redeverb soll die leise Stimme ausdrücken.'),
      gap('Achtung, Gefahr!', '„Vorsicht, der Topf rutscht!“, ', ' Minka.', ['warnte','begrüßte','bedankte sich'],0,'Minka macht auf eine Gefahr aufmerksam. Deshalb passt „warnte“.','Was will Minka mit ihrem Ruf erreichen?'),
      choice('Eine passende Frage', 'Welcher Begleitsatz passt zum Inhalt?', ['„Wo ist die Spur?“, antwortete Minka.','„Wo ist die Spur?“, bedankte sich Minka.','„Wo ist die Spur?“, fragte Minka.'],2,'Minka möchte etwas wissen. Ohne weiteren Gesprächskontext beschreibt „fragte“ diese Äußerung passend.','Das Fragewort „Wo“ zeigt die Absicht.'),
      choice('Nicht unnötig ersetzen', 'Fuji spricht ruhig und ohne besondere Stimmung: „Ich bleibe hier.“ Welche Fassung passt?', ['„Ich bleibe hier“, brüllte Fuji zornig.','„Ich bleibe hier“, sagte Fuji.','„Ich bleibe hier“, jubelte Fuji begeistert.'],1,'Das neutrale „sagte“ passt. Die anderen Fassungen erfinden eine Lautstärke oder Stimmung, die nicht vorgegeben ist.','Ein gutes Redeverb verändert die gemeinte Szene nicht.')
    ],
    write:'Schreibe einen kurzen Dialog zwischen Minka und Fuji: Minka fragt nach einer Spur, Fuji erklärt sie, dann warnt Minka vor einem lockeren Brett. Wähle drei passende Redeverben.',
    model:'„Wohin führt diese Spur?“, fragte Minka. Fuji erklärte: „Sie endet direkt am Steg.“ Minka trat einen Schritt zurück. „Vorsicht, das Brett ist locker!“, warnte sie.',
    checks:['Meine Redeverben passen zum Inhalt der Äußerung.','Ich drücke Lautstärke nur aus, wenn sie zur Szene gehört.','Meine wörtliche Rede hat passende Rede- und Satzzeichen.']
  },
  {
    id:'satzanfaenge', title:'Satzanfänge', guide:'Minka',
    goal:'Sätze abwechslungsreich beginnen und den Ablauf klar verbinden.',
    explanation:'Wenn jeder Satz mit „Dann“ oder „Minka“ beginnt, wirkt ein Text oft eintönig. Beginne auch mit einer Zeit, einem Ort, einem Gefühl oder einem Nebensatz. Der Zusammenhang muss dabei erhalten bleiben.',
    steps:['Unterstreiche die ersten Wörter deiner Sätze. Wiederholt sich ein Anfang auffällig?', 'Wähle eine passende Zeit-, Orts- oder Gefühlsangabe. Du kannst auch einen Als- oder Während-Satz verwenden.', 'Prüfe die Wortstellung: Nach „Vorsichtig“ folgt im Aussagesatz das gebeugte Verb. Trenne einen vorangestellten Nebensatz durch ein Komma ab.'],
    tip:'„Vorsichtig öffnete Fuji die Tür.“ Das Verb steht im Hauptsatz an zweiter Satzgliedstelle. „Als Minka näher kam, öffnete Fuji die Tür.“ Nach dem Nebensatz steht ein Komma; danach folgt das Verb des Hauptsatzes.',
    before:'Dann ging Minka zum Steg. Dann hörte sie ein Knacken. Dann blieb Fuji stehen.',
    after:'Am frühen Morgen schlich Minka zum Steg. Unter ihren Pfoten knackte ein Brett. Sofort blieb Fuji stehen.',
    why:'Zeit, Ort und Reaktion strukturieren die Szene. Verschiedene Anfänge bringen Abwechslung; die Reihenfolge der Ereignisse bleibt nachvollziehbar.',
    bankTitle:'Anfänge nach ihrer Aufgabe',
    bank:[['Zeit','Am frühen Morgen … / Wenig später … / In diesem Augenblick …','Wenig später erreichte Fuji den Steg.'],['Ort','Vor der Tür … / Zwischen den Kisten … / Unter dem Steg …','Zwischen den Kisten raschelte es.'],['Art und Weise','Vorsichtig … / Lautlos … / Mit zitternden Pfoten …','Vorsichtig schob Minka die Tür auf.'],['Gefühl','Erleichtert … / Neugierig … / Voller Sorge …','Neugierig musterte Fuji den Fund.'],['Reaktion','Sofort … / Ohne zu zögern … / Nach kurzem Überlegen …','Sofort wich Minka zurück.'],['Nebensatz','Als …, … / Während …, … / Weil …, …','Während Fuji lauschte, spähte Minka hinein.']],
    tasks:[
      choice('Nach „Vorsichtig“', 'Forme „Fuji öffnete vorsichtig die Tür“ um. Welche Fassung ist richtig?', ['Vorsichtig öffnete Fuji die Tür.','Vorsichtig Fuji öffnete die Tür.','Vorsichtig die Tür Fuji öffnete.'],0,'Nach der vorangestellten Angabe „Vorsichtig“ folgt im Hauptsatz das gebeugte Verb „öffnete“.','Suche die Fassung mit dem Verb direkt nach „Vorsichtig“.'),
      choice('Ein Als-Satz am Anfang', 'Welcher Satz hat das notwendige Komma?', ['Als Minka näher kam Fuji hielt den Topf fest.','Als Minka näher kam, hielt Fuji den Topf fest.','Als, Minka näher kam hielt Fuji den Topf fest.'],1,'Das Komma trennt den vorangestellten Nebensatz „Als Minka näher kam“ vom Hauptsatz. Danach folgt „hielt“.','Wo endet der vollständige Als-Satz?'),
      gap('Den Ablauf erhalten', 'Erst hörte Minka ein Kratzen. ', ' schob Fuji die Tür auf.', ['Am Tag davor','Schon eine Woche vorher','Kurz darauf'],2,'„Kurz darauf“ führt den Ablauf vorwärts. Die anderen Angaben würden einen Rücksprung erzählen.','Die Tür wird nach dem Kratzen geöffnet.'),
      choice('Was bringt Abwechslung?', 'Welche Überarbeitung variiert die Anfänge und erhält den Sinn?', ['Minka sah eine Spur. Minka folgte ihr. Minka fand einen Eimer.','Im Gras entdeckte Minka eine Spur. Neugierig folgte sie ihr. Neben der Tür stand ein undichter Eimer.','Dann Minka eine Spur sah. Dann folgte. Dann Eimer.'],1,'Ortsangabe, Art des Handelns und neue Ortsangabe sorgen für Abwechslung. Die Sätze bleiben vollständig und zusammenhängend.','Abwechslung hilft nur, wenn die Sätze verständlich bleiben.')
    ],
    write:'Überarbeite: „Dann ging Minka zur Tür. Dann hörte sie ein Kratzen. Dann rief sie Fuji. Dann öffnete Fuji die Tür.“ Nutze vier unterschiedliche Anfänge und mindestens einen Als- oder Während-Satz.',
    model:'Vorsichtig schlich Minka zur Tür. Hinter dem Holz kratzte etwas. Sofort rief sie Fuji. Als die Wolfshündin das Geräusch hörte, drückte sie die Tür auf.',
    checks:['Meine Sätze beginnen unterschiedlich.','Die Handlung bleibt in einer sinnvollen Reihenfolge.','Das gebeugte Verb steht im Hauptsatz richtig.','Meinen Nebensatz trenne ich mit einem Komma ab.']
  },
  {
    id:'adjektive', title:'Treffende Adjektive', guide:'Fuji',
    goal:'Einzelheiten und Stimmung mit passenden Adjektiven anschaulich machen.',
    explanation:'Adjektive beschreiben Eigenschaften: ein morsches Brett, ein dumpfes Klopfen, feuchtes Gras. Wähle konkrete Wörter, die zur Szene passen. Mehr Adjektive machen einen Text nicht automatisch besser.',
    steps:['Frage: Welche Eigenschaft ist für die Szene wichtig?', 'Nutze deine Sinne: Wie sieht etwas aus, wie klingt es, wie fühlt es sich an oder wie riecht es?', 'Wähle ein oder zwei treffende Adjektive. Passe die Endung an: der morsche Steg, auf dem morschen Steg.'],
    tip:'„Schön“, „toll“ und „komisch“ bleiben oft ungenau. „Ein dumpfes Klopfen“ beschreibt einen Klang. „Ein bedrohliches Klopfen“ zeigt dagegen, wie die Figur es empfindet.',
    before:'Minka sah einen komischen Steg. Fuji hörte ein komisches Geräusch.',
    after:'Minka musterte den morschen Steg. Fuji hörte ein dumpfes Klopfen unter den feuchten Brettern.',
    why:'„Morsch“ beschreibt den Zustand des Holzes, „dumpf“ den Klang und „feucht“ die Oberfläche. Die Einzelheiten passen zur Szene und können für das Abenteuer wichtig werden.',
    bankTitle:'Wörter für deine Sinne und Gefühle',
    bank:[['Aussehen','verblasst, silbrig, fleckig, schmal, verwittert','Minka entdeckte eine verblasste Zahl.'],['Geräusch','dumpf, schrill, leise, knarrend, gleichmäßig','Fuji hörte ein leises, gleichmäßiges Ticken.'],['Berührung','rau, glatt, feucht, kühl, klebrig','Unter Minkas Pfoten lag das kühle Holz.'],['Geruch','modrig, muffig, würzig, frisch','Im Schuppen hing ein modriger Geruch.'],['Stimmung','unheimlich, friedlich, geheimnisvoll, bedrückend','Die unheimliche Stille ließ Minka zögern.'],['Gefühl oder Haltung','neugierig, erleichtert, besorgt, aufmerksam','Fuji beobachtete Minka mit aufmerksamem Blick.']],
    tasks:[
      gap('Ein Klang wird hörbar', 'Aus der Kiste drang ein ', ' Klopfen, tief und gedämpft.', ['silbriges','dumpfes','klebriges'],1,'„Dumpf“ beschreibt den tiefen, gedämpften Klang. Silbrig ist ein Farbeindruck, klebrig eine fühlbare Eigenschaft.','Welches Wort beschreibt ein Geräusch?'),
      choice('Wenige treffende Wörter', 'Minka möchte deutlich machen, warum das Holz gefährlich ist.', ['Das tolle, schöne, interessante und besondere Brett lag dort.','Das sehr, sehr komische Brett war sehr komisch.','Das morsche Brett gab unter Minkas Pfoten nach.'],2,'„Morsch“ nennt den wichtigen Zustand des Brettes. Die Handlung zeigt die Folge. Viele allgemeine Wertungen helfen hier wenig.','Welche Eigenschaft erklärt, warum das Brett nachgibt?'),
      choice('Die Endung passt', 'Welche Wortgruppe ist richtig?', ['auf dem morschen Steg','auf dem morscher Steg','auf dem morsche Steg'],0,'Nach „auf dem“ passt hier die Form „morschen“: auf dem morschen Steg.','Sprich die Wortgruppe langsam mit Artikel aus.'),
      choice('Wahrnehmung oder Empfindung?', 'Welches Adjektiv zeigt besonders, wie Minka die Situation empfindet?', ['ein feuchtes Brett','eine bedrohliche Stille','eine blaue Kiste'],1,'„Bedrohlich“ zeigt, wie die Stille auf Minka wirkt. Feucht und blau beschreiben unmittelbar wahrnehmbare Eigenschaften.','Welches Wort verrät etwas über Minkas Gefühl?')
    ],
    write:'Beschreibe, wie Minka und Fuji vor einem alten Schuppen stehen. Schreibe 3–4 Sätze mit drei treffenden Adjektiven aus mindestens zwei Sinnesbereichen. Vermeide eine bloße Adjektivliste.',
    model:'Vor Minka ragte die verwitterte Schuppentür auf. Durch einen Spalt drang ein modriger Geruch. Fuji lauschte auf das dumpfe Klopfen im Inneren. Minka legte eine Pfote auf das raue Holz.',
    checks:['Meine Adjektive beschreiben konkrete, passende Eigenschaften.','Ich nutze mindestens zwei Sinnesbereiche.','Meine Adjektivendungen passen zu den Nomen.','Ich habe überflüssige Wiederholungen gestrichen.']
  },
  {
    id:'rede', title:'Wörtliche Rede', guide:'Minka',
    goal:'Dialoge lebendig und mit den passenden Satzzeichen schreiben.',
    explanation:'Wörtliche Rede gibt genau wieder, was eine Figur sagt. In unseren erfundenen Tiergeschichten dürfen Minka und Fuji miteinander sprechen. Der Begleitsatz erklärt, wer spricht und gegebenenfalls wie.',
    steps:['Setze die gesprochenen Wörter in deutsche Anführungszeichen: „…“.', 'Entscheide, wo der Begleitsatz steht: davor, danach oder eingeschoben.', 'Prüfe Doppelpunkt, Kommas und die Schlusszeichen. Beginne bei einem Sprecherwechsel am besten einen neuen Absatz.'],
    tip:'Bei nachgestelltem Begleitsatz entfällt der Punkt der gesprochenen Aussage. Frage- und Ausrufezeichen bleiben vor dem schließenden Anführungszeichen stehen. Das Komma danach brauchst du trotzdem.',
    before:'Minka fragte hast du das gehört Fuji sagte ich sehe nach',
    after:'Minka fragte: „Hast du das gehört?“\n„Ich sehe nach“, antwortete Fuji.',
    why:'Der Doppelpunkt steht nach dem vorangestellten Begleitsatz. Bei Fujis Aussage steht das Komma nach dem schließenden Anführungszeichen. Der abschließende Punkt gehört ans Ende des Begleitsatzes.',
    bankTitle:'Drei Baupläne für Rede und Begleitsatz',
    bank:[['Begleitsatz davor','Begleitsatz: „Rede.“','Fuji erklärte: „Die Tür ist offen.“'],['Begleitsatz danach · Aussage','„Rede“, Begleitsatz.','„Die Tür ist offen“, erklärte Fuji.'],['Begleitsatz danach · Frage','„Rede?“, Begleitsatz.','„Hörst du das?“, fragte Minka.'],['Begleitsatz danach · Ausruf','„Rede!“, Begleitsatz.','„Vorsicht!“, rief Fuji.'],['Begleitsatz eingeschoben','„Erster Teil“, Begleitsatz, „Fortsetzung.“','„Hinter der Tür“, flüsterte Minka, „raschelt etwas.“'],['Die Zeitform darf wechseln','Erzähltext im Präteritum · Rede passend zur Sprechsituation','Fuji lauschte. „Ich höre etwas“, sagte sie.']],
    followup:'Beim eingeschobenen Begleitsatz wird derselbe gesprochene Satz fortgesetzt. Deshalb beginnt „raschelt“ klein. Beginnt nach einem Begleitsatz ein neuer gesprochener Satz, braucht dieser einen Großbuchstaben.',
    tasks:[
      choice('Begleitsatz davor', 'Fuji fragt nach dem Geräusch. Welche Zeichensetzung stimmt?', ['Fuji fragte, „Was war das?“','Fuji fragte: „Was war das?“','Fuji fragte „Was war das“?'],1,'Nach dem vorangestellten Begleitsatz steht ein Doppelpunkt. Das Fragezeichen gehört zur gesprochenen Frage und steht innerhalb der Anführungszeichen.','Begleitsatz davor → Doppelpunkt. Fragezeichen nach „das“, aber vor dem schließenden Redezeichen.'),
      choice('Aussage mit Begleitsatz danach', 'Minka sagt, dass sie eine Spur sieht.', ['„Ich sehe eine Spur.“ sagte Minka.','„Ich sehe eine Spur“, sagte Minka.','„Ich sehe eine Spur,“ sagte Minka.'],1,'Der Punkt der gesprochenen Aussage entfällt. Das Komma steht nach dem schließenden Anführungszeichen; nach Minka folgt der Schlusspunkt.','Wo steht das Komma im Bauplan „Rede“, Begleitsatz.?'),
      choice('Fragezeichen und Komma', 'Welche Fassung ist richtig?', ['„Kommst du mit?“, fragte Minka.','„Kommst du mit“, fragte Minka?','„Kommst du mit?“ fragte Minka.'],0,'Das Fragezeichen bleibt in der Rede. Danach stehen das schließende Anführungszeichen und das Komma. „Fragte“ wird kleingeschrieben.','Bei einer Frage bleibt das Fragezeichen; das Komma zum Begleitsatz kommt dazu.'),
      choice('Begleitsatz eingeschoben', 'Der gesprochene Satz lautet: „Unter dem Steg liegt etwas.“ Welche Fassung ist richtig?', ['„Unter dem Steg“, flüsterte Fuji „liegt etwas.“','„Unter dem Steg“, flüsterte Fuji, „Liegt etwas.“','„Unter dem Steg“, flüsterte Fuji, „liegt etwas.“'],2,'Zwei Kommas grenzen den eingeschobenen Begleitsatz ab. „Liegt“ setzt denselben gesprochenen Satz fort und beginnt deshalb klein.','Du brauchst zwei Kommas. Nach der Unterbrechung geht derselbe Satz weiter.')
    ],
    write:'Schreibe einen Dialog mit vier Äußerungen: Minka fragt, was im Schuppen raschelt. Fuji antwortet, Minka warnt und Fuji beruhigt sie. Verwende einen vorangestellten, einen nachgestellten und einen eingeschobenen Begleitsatz.',
    model:'Minka fragte: „Was raschelt im Schuppen?“\n„Vielleicht ist es ein Igel“, antwortete Fuji.\n„Vorsicht!“, warnte Minka.\n„Wir bleiben hier“, erklärte Fuji, „bis wir sicher sind.“',
    checks:['Alle gesprochenen Wörter stehen in Anführungszeichen.','Ich habe alle drei Stellungen des Begleitsatzes ausprobiert.','Doppelpunkte, Kommas, Frage- und Ausrufezeichen passen zum Bauplan.','Meine Redeverben passen zur Äußerung; der Sprecherwechsel ist klar.']
  }
];

const freshRecord = () => ({selected:null, first:null, solved:false, hint:false, model:false, message:''});
const states = new Map(topics.map(t => [t.id, {index:0, records:t.tasks.map(freshRecord), draft:'', checks:t.checks.map(() => false), feedback:false}]));
let current = topics[0].id;
const state = () => states.get(current);
const topic = () => topics.find(t => t.id === current);
function totals() {
  const records = [...states.values()].flatMap(s => s.records);
  const attempted = records.filter(r => r.first !== null || r.model).length;
  const independent = records.filter(r => r.first?.correct && !r.first.helped).length;
  document.getElementById('language-total').textContent = `${attempted} von ${records.length} Aufgaben bearbeitet · ${independent} beim ersten Versuch ohne Hilfe richtig. Eigene Texte prüfst du mit der Checkliste.`;
}
function renderTopics() {
  document.getElementById('language-topics').innerHTML = topics.map((t,i) => `<button type="button" data-language-topic="${t.id}" aria-pressed="${t.id === current}"><span>${i+1}.</span> ${esc(t.title)}</button>`).join('');
  document.querySelectorAll('[data-language-topic]').forEach(b => b.addEventListener('click', () => {current=b.dataset.languageTopic;render();document.getElementById('language-heading').focus({preventScroll:true});document.getElementById('language-heading').scrollIntoView({block:'start'});}));
}
function render() {
  const t=topic(),s=state();
  renderTopics();totals();
  root.innerHTML = `<article class="panel language-theory"><p class="eyebrow">1 · Verstehen</p><h2 id="language-heading" tabindex="-1">${esc(t.title)}</h2><p class="language-goal"><strong>Dein Ziel:</strong> ${esc(t.goal)}</p><div class="speech"><strong>${esc(t.guide)} erklärt:</strong> ${esc(t.explanation)}</div><h3>So gehst du vor</h3><ol class="language-steps">${t.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><div class="note compact"><strong>${t.guide === 'Minka'?'Fuji':'Minka'} ergänzt:</strong> ${esc(t.tip)}</div></article>
    <article class="panel extras"><p class="eyebrow">2 · Vergleichen</p><h2>Aus wenigen Worten wird eine Szene.</h2><div class="two-col"><div><h3>Vorher</h3><p class="model-text">${esc(t.before)}</p></div><div><h3>Überarbeitet</h3><p class="model-text">${esc(t.after)}</p></div></div><p>${esc(t.why)}</p>${t.followup?`<div class="note">${esc(t.followup)}</div>`:''}<details><summary>${esc(t.bankTitle)}</summary><div class="language-bank">${t.bank.map(([word,meaning,example])=>`<div class="language-word"><h4>${esc(word)}</h4><p>${esc(meaning)}</p><p class="muted">${esc(example)}</p></div>`).join('')}</div></details></article>
    <article class="panel extras" id="language-training"><p class="eyebrow">3 · Üben</p><h2>Mit Minka & Fuji ausprobieren</h2><label class="select-label">Aufgabe auswählen<select id="language-jump">${t.tasks.map((q,i)=>`<option value="${i}" ${i===s.index?'selected':''}>${i+1}. ${esc(q.title)}</option>`).join('')}</select></label><p id="language-score" role="status"></p><div id="language-task"></div></article>
    ${t.id==='rede'?'<article class="panel extras"><h2>Fujis Satzzeichen-Werkstatt</h2><p>Setze die fehlenden Zeichen. Der Satz wird unter deiner Auswahl zusammengesetzt.</p><div id="language-punctuation"></div></article>':''}
    <article class="panel extras language-writing"><p class="eyebrow">4 · Selbst schreiben</p><h2>Dein Text mit Minka & Fuji</h2><p>${esc(t.write)}</p><label for="language-draft">Dein eigener Text zum Thema „${esc(t.title)}“</label><textarea id="language-draft" rows="7" maxlength="12000" placeholder="Probiere hier deine eigenen Formulierungen aus."></textarea><p class="muted" id="language-wordcount"></p><div class="writing-checks">${t.checks.map((c,i)=>`<label><input type="checkbox" data-language-check="${i}" ${s.checks[i]?'checked':''}><span>${esc(c)}</span></label>`).join('')}</div><button type="button" class="primary" id="language-review">Meine Überarbeitungshilfe</button><div id="language-writing-feedback" class="feedback" role="status"></div><details><summary>Mustertext zum Vergleichen</summary><p class="model-text">${esc(t.model)}</p><p>Dies ist eine Möglichkeit. Dein Text darf anders lauten. Prüfe mit der Checkliste, wie du dein Ziel erreicht hast.</p></details><div class="quiz-actions"><button type="button" class="secondary" id="language-to-intro">Zur Einleitung-Schreibwerkstatt</button><button type="button" class="primary" id="language-next-topic">${topics.indexOf(t)===topics.length-1?'Wieder zu den Schlingen':'Nächstes Thema'}</button></div><p class="muted">Deine Texte werden nicht automatisch benotet. Antworten und Entwürfe bleiben während der geöffneten Sitzung erhalten; beim Neuladen werden sie zurückgesetzt.</p></article>`;
  const repeat=document.createElement('button');repeat.type='button';repeat.className='secondary';repeat.id='language-repeat';repeat.textContent='Aufgaben dieses Themas neu üben';
  document.getElementById('language-score').after(repeat);
  repeat.addEventListener('click',()=>{s.records=t.tasks.map(freshRecord);s.index=0;renderTask();});
  renderTask();
  document.getElementById('language-jump').addEventListener('change',e=>{s.index=Number(e.target.value);renderTask();});
  const draft=document.getElementById('language-draft');draft.value=s.draft;
  function wordcount(){const n=s.draft.trim()?s.draft.trim().split(/\s+/u).length:0;document.getElementById('language-wordcount').textContent=`${n} ${n===1?'Wort':'Wörter'} · Dein Entwurf gehört nur zu diesem Thema.`;}
  draft.addEventListener('input',()=>{s.draft=draft.value;s.feedback=false;wordcount();writingFeedback();});wordcount();
  document.querySelectorAll('[data-language-check]').forEach(c=>c.addEventListener('change',()=>{s.checks[Number(c.dataset.languageCheck)]=c.checked;s.feedback=false;writingFeedback();}));
  document.getElementById('language-review').addEventListener('click',()=>{s.feedback=true;writingFeedback();});writingFeedback();
  document.getElementById('language-to-intro').addEventListener('click',()=>showPage('schreiben'));
  document.getElementById('language-next-topic').addEventListener('click',()=>{current=topics[(topics.indexOf(t)+1)%topics.length].id;render();document.getElementById('language-heading').focus();});
  if(t.id==='rede')renderPunctuation();
}
function writingFeedback(){
  const s=state(),t=topic(),box=document.getElementById('language-writing-feedback');box.classList.remove('good');
  if(!s.feedback){box.textContent='';return;}
  if(!s.draft.trim()){box.textContent='Minka: Schreibe zuerst deinen eigenen Text. Die Schrittfolge und der Sprachschatz helfen dir dabei.';return;}
  const missing=t.checks.filter((_,i)=>!s.checks[i]);
  box.classList.toggle('good',missing.length===0);
  box.innerHTML=missing.length?`<strong>Fuji hilft dir beim Überarbeiten:</strong><p>Prüfe diese Punkte in deinem Text und verbessere ihn:</p><ul>${missing.map(c=>`<li>${esc(c)}</li>`).join('')}</ul><p>Vergleiche danach mit dem Mustertext und begründe deine Wortwahl.</p>`:'<strong>Minka:</strong><p>Nach deinen Häkchen hast du alle Ziele berücksichtigt. Lies deinen Text laut vor und zeige einer anderen Person die Stellen, an denen du die Ziele erfüllst. Das ist eine Selbsteinschätzung, keine automatische Bewertung.</p>';
}
function renderTask(focus=false){
  const t=topic(),s=state(),q=t.tasks[s.index],r=s.records[s.index];
  document.getElementById('language-jump').value=String(s.index);
  const completed=s.records.filter(x=>x.first!==null||x.model).length,independent=s.records.filter(x=>x.first?.correct&&!x.first.helped).length;
  document.getElementById('language-score').textContent=`${completed} von ${t.tasks.length} bearbeitet · ${independent} beim ersten Versuch ohne Hilfe richtig`;
  const controls=q.type==='gap'?`<div class="question-text"><label>${esc(q.before)}<select id="language-gap" aria-label="Passendes Verb oder passende Formulierung wählen" ${r.solved?'disabled':''}><option value="">Bitte wählen</option>${q.options.map((o,i)=>`<option value="${i}" ${r.selected===i?'selected':''}>${esc(o)}</option>`).join('')}</select>${esc(q.after)}</label></div>`:`<p class="question-text">${esc(q.text)}</p><div class="choices" role="group" aria-label="Antwortmöglichkeiten">${q.options.map((o,i)=>`<button type="button" class="choice ${r.solved&&i===q.answer?'correct':''}" data-language-answer="${i}" aria-pressed="${r.selected===i}" ${r.solved?'disabled':''}><span class="letter" aria-hidden="true">${'ABC'[i]}</span>${esc(o)}</button>`).join('')}</div>`;
  document.getElementById('language-task').innerHTML=`<h3 id="language-task-title" tabindex="-1">${s.index+1}. ${esc(q.title)}</h3>${controls}<div class="quiz-actions"><button type="button" class="primary" id="language-check" ${r.selected===null||r.solved?'disabled':''}>Antwort prüfen</button><button type="button" class="secondary" id="language-hint" ${r.hint?'disabled':''}>${r.hint?'Hilfe geöffnet':'Hilfe von Minka & Fuji'}</button></div><div id="language-answer-feedback" class="feedback ${r.solved?'good':''}" role="status">${esc(r.message)}</div>${r.hint?`<div class="hint-box">${esc(q.hint)}</div>`:''}<details id="language-solution" ${r.model?'open':''}><summary>Lösung mit Erklärung</summary><p><strong>${esc(q.type==='gap'?q.before+q.options[q.answer]+q.after:q.options[q.answer])}</strong></p><p>${esc(q.explain)}</p></details><div class="quiz-actions"><button type="button" class="secondary" id="language-prev-task" ${s.index===0?'disabled':''}>Vorherige Aufgabe</button><button type="button" class="primary" id="language-next-task" ${s.index===t.tasks.length-1?'disabled':''}>Nächste Aufgabe</button></div>`;
  const selectAnswer=i=>{r.selected=i;r.message='';renderTask();const control=q.type==='gap'?document.getElementById('language-gap'):document.querySelector(`[data-language-answer="${i}"]`);control?.focus({preventScroll:true});};
  document.querySelectorAll('[data-language-answer]').forEach(b=>b.addEventListener('click',()=>selectAnswer(Number(b.dataset.languageAnswer))));
  document.getElementById('language-gap')?.addEventListener('change',e=>selectAnswer(e.target.value===''?null:Number(e.target.value)));
  document.getElementById('language-check').addEventListener('click',()=>{
    if(r.selected===null||r.solved)return;
    const correct=r.selected===q.answer;
    if(r.first===null)r.first={correct,helped:r.hint||r.model};
    r.solved=correct;r.message=correct?`Richtig. ${q.explain}`:`Das passt noch nicht. ${q.hint} Versuche es noch einmal oder öffne die Erklärung.`;
    renderTask();const feedback=document.getElementById('language-answer-feedback');feedback.tabIndex=-1;feedback.focus({preventScroll:true});
  });
  document.getElementById('language-hint').addEventListener('click',()=>{r.hint=true;renderTask();});
  document.getElementById('language-solution').addEventListener('toggle',e=>{if(e.target.open&&e.target.isConnected){r.model=true;totals();document.getElementById('language-score').textContent=`${s.records.filter(x=>x.first!==null||x.model).length} von ${t.tasks.length} bearbeitet · ${s.records.filter(x=>x.first?.correct&&!x.first.helped).length} beim ersten Versuch ohne Hilfe richtig`;}});
  document.getElementById('language-prev-task').addEventListener('click',()=>{s.index--;renderTask(true);});
  document.getElementById('language-next-task').addEventListener('click',()=>{s.index++;renderTask(true);});
  totals();if(focus)document.getElementById('language-task-title').focus();
}

// Separate choices for each punctuation mark make the sentence structure visible.
const punctuation=[
  {label:'Begleitsatz davor',pieces:['Fuji fragte',' ','Hörst du das',''],marks:[':','„','?','“'],options:[[':',',','.'],['„','“'],['?','.','!'],['“','„']],explain:'Nach dem Begleitsatz kommt der Doppelpunkt. Die Rede beginnt mit „ und endet nach dem Fragezeichen mit “.'},
  {label:'Begleitsatz danach',pieces:['','Ich bleibe hier','',' sagte Fuji.'],marks:['„','“',','],options:[['„','“'],['“','.“'],[',',':','']],explain:'Vor dem nachgestellten Begleitsatz entfällt der Punkt der Aussage. Nach dem schließenden Redezeichen steht ein Komma.'},
  {label:'Begleitsatz eingeschoben',pieces:['„Unter dem Steg“',' flüsterte Minka',' „liegt etwas.“'],marks:[',',','],options:[[',',':',''],[',','.','']],explain:'Vor und nach dem eingeschobenen Begleitsatz steht ein Komma. Der gesprochene Satz wird mit „liegt“ kleingeschrieben fortgesetzt.'}
];
const punctuationState=punctuation.map(p=>({values:p.marks.map(()=>''),checked:false,shown:false}));
function renderPunctuation(){
  const box=document.getElementById('language-punctuation');
  box.innerHTML=punctuation.map((p,i)=>`<div class="language-punct-row"><h3>${esc(p.label)}</h3><div class="language-punct-inputs">${p.options.map((opts,j)=>`<label>Zeichen ${j+1}<select data-punct="${i}-${j}"><option value="">Bitte wählen</option>${opts.map((o,k)=>`<option value="${k}" ${punctuationState[i].values[j]===String(k)?'selected':''}>${esc(o||'(kein Zeichen)')}</option>`).join('')}</select></label>`).join('')}</div><p class="model-text" id="punct-preview-${i}"></p><div class="quiz-actions"><button type="button" class="primary" data-punct-check="${i}">Zeichen prüfen</button><button type="button" class="secondary" data-punct-solution="${i}">Lösung erklären</button></div><p class="feedback" role="status" id="punct-feedback-${i}"></p></div>`).join('');
  document.querySelectorAll('[data-punct]').forEach(sel=>sel.addEventListener('change',()=>{const [i,j]=sel.dataset.punct.split('-').map(Number);punctuationState[i].values[j]=sel.value;punctuationState[i].checked=false;punctuationState[i].shown=false;updatePunctuation(i);}));
  document.querySelectorAll('[data-punct-check]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.punctCheck);punctuationState[i].checked=true;updatePunctuation(i);}));
  document.querySelectorAll('[data-punct-solution]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.punctSolution);punctuationState[i].shown=true;updatePunctuation(i);}));
  punctuation.forEach((_,i)=>updatePunctuation(i));
}
function updatePunctuation(i){
  const p=punctuation[i],s=punctuationState[i];
  const assemble=marks=>p.pieces.map((piece,j)=>piece+(marks[j]??'')).join('');
  const chosen=s.values.map((v,j)=>v===''?' […] ':p.options[j][Number(v)]);
  document.getElementById(`punct-preview-${i}`).textContent=assemble(chosen);
  const feedback=document.getElementById(`punct-feedback-${i}`);feedback.classList.remove('good');
  if(s.shown){feedback.textContent=`Lösung: ${assemble(p.marks)} ${p.explain} Probiere die Zeichen danach selbst aus.`;return;}
  if(!s.checked){feedback.textContent='';return;}
  if(s.values.some(v=>v==='')){feedback.textContent='Wähle zuerst an jeder Stelle ein Zeichen.';return;}
  const wrong=chosen.map((v,j)=>v===p.marks[j]?null:j+1).filter(x=>x!==null);
  feedback.classList.toggle('good',wrong.length===0);
  feedback.textContent=wrong.length?`Prüfe Zeichen ${wrong.join(' und ')} noch einmal. Nutze den passenden Bauplan oben.`:`Richtig. ${p.explain}`;
}
render();
})();

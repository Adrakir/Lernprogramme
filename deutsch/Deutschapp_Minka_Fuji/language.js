'use strict';
(() => {
const root = document.getElementById('language-lesson');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const choice = (title, text, options, answer, explain, hint) => ({title, text, options, answer, explain, hint});
const gap = (title, before, after, options, answer, explain, hint) => ({type:'gap', title, before, after, options, answer, explain, hint});
const word = (title, before, after, answer, explain, hint) => ({type:'word', title, before, after, answer, explain, hint});
const verbForms = [
  ['sein', 'bin', 'war', 'Ich ', ' allein im Schuppen.'],
  ['haben', 'habe', 'hatte', 'Ich ', ' eine Taschenlampe dabei.'],
  ['gehen', 'gehe', 'ging', 'Ich ', ' zum Fenster.'],
  ['kommen', 'komme', 'kam', 'Ich ', ' an der Werkbank vorbei.'],
  ['sehen', 'sehe', 'sah', 'Ich ', ' einen Schatten an der Wand.'],
  ['sprechen', 'spreche', 'sprach', 'Ich ', ' ganz leise.'],
  ['laufen', 'laufe', 'lief', 'Ich ', ' zu Fuji zurück.'],
  ['finden', 'finde', 'fand', 'Ich ', ' eine Spur im Staub.'],
  ['nehmen', 'nehme', 'nahm', 'Ich ', ' den Zettel vom Boden.'],
  ['geben', 'gebe', 'gab', 'Ich ', ' Fuji den Zettel.'],
  ['lesen', 'lese', 'las', 'Ich ', ' die Nachricht zweimal.'],
  ['schreiben', 'schreibe', 'schrieb', 'Ich ', ' die Zahl auf.'],
  ['denken', 'denke', 'dachte', 'Ich ', ' an den Schlüssel.'],
  ['wissen', 'weiß', 'wusste', 'Ich ', ' plötzlich, wohin die Spur führte.'],
  ['rufen', 'rufe', 'rief', 'Ich ', ' nach Fuji.'],
  ['schwimmen', 'schwimme', 'schwamm', 'Ich ', ' bis zum Steg.']
];

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
      choice('Was bringt Abwechslung?', 'Welche Überarbeitung variiert die Anfänge und erhält den Sinn?', ['Minka sah eine Spur. Minka folgte ihr. Minka fand einen Eimer.','Im Gras entdeckte Minka eine Spur. Neugierig folgte sie ihr. Neben der Tür stand ein undichter Eimer.','Dann Minka eine Spur sah. Dann folgte. Dann Eimer.'],1,'Ortsangabe, Art des Handelns und neue Ortsangabe sorgen für Abwechslung. Die Sätze bleiben vollständig und zusammenhängend.','Abwechslung hilft nur, wenn die Sätze verständlich bleiben.'),
      gap('Den Ort verraten', 'Fuji hörte das Klopfen aus Richtung des Zauns. ', ' entdeckte sie eine lockere Latte.', ['Einen Tag später','Mit einem lauten Knall','Am Gartentor'],2,'„Am Gartentor“ zeigt, an welcher Stelle am Zaun Fuji die Latte entdeckte.','Die Leser sollen erfahren, wo die Latte war.'),
      choice('Die Reaktion zeigen', 'Die Tür knallte hinter Minka zu. Welcher Anfang zeigt, wie Minka auf den Knall reagierte?', ['Erschrocken fuhr Minka herum.','Am Ende des Gartens stand Minka.','Am Vormittag kehrte Minka zurück.'],0,'„Erschrocken“ zeigt Minkas unmittelbare Reaktion. Die anderen Anfänge nennen Ort oder Zeit.','Achte darauf, wie sich Minka in diesem Moment fühlte.'),
      choice('Zwei Dinge gleichzeitig', 'Fuji lauschte. Zur selben Zeit spähte Minka durch den Spalt. Welcher Satz verbindet beides?', ['Weil Fuji lauschte, spähte Minka durch den Spalt.','Während Fuji lauschte, spähte Minka durch den Spalt.','Nachdem Fuji gelauscht hatte, spähte Minka durch den Spalt.'],1,'„Während“ zeigt, dass beides gleichzeitig geschah. „Weil“ nennt einen Grund, „nachdem“ eine Reihenfolge.','Suche den Anfang, der „zur selben Zeit“ ausdrückt.'),
      choice('Auch ein Name passt', 'Im Satz davor waren Minka und Fuji am Fenster. Welche Fassung macht klar, wer jetzt handelt?', ['Vorsichtig schob sie es auf.','Kurz darauf schob sie es auf.','Fuji schob das Fenster auf.'],2,'Hier schafft der Name Klarheit. Ein abwechslungsreicher Text darf Sätze auch mit einer Figur beginnen.','Bei zwei Figuren kann „sie“ mehrdeutig sein.')
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
      choice('Begleitsatz eingeschoben', 'Der gesprochene Satz lautet: „Unter dem Steg liegt etwas.“ Welche Fassung ist richtig?', ['„Unter dem Steg“, flüsterte Fuji „liegt etwas.“','„Unter dem Steg“, flüsterte Fuji, „Liegt etwas.“','„Unter dem Steg“, flüsterte Fuji, „liegt etwas.“'],2,'Zwei Kommas grenzen den eingeschobenen Begleitsatz ab. „liegt“ setzt denselben gesprochenen Satz fort und beginnt deshalb klein.','Du brauchst zwei Kommas. Nach der Unterbrechung geht derselbe Satz weiter.'),
      choice('Ausruf mit Begleitsatz danach', 'Fuji will Minka in diesem Moment warnen. Welche Fassung stimmt?', ['„Stopp!“, rief Fuji.','„Stopp“, rief Fuji!','„Stopp!“, Rief Fuji.'],0,'Das Ausrufezeichen gehört in die Rede. Danach kommen Anführungszeichen, Komma und der kleingeschriebene Begleitsatz.','Setze das Ausrufezeichen direkt hinter das gerufene Wort.'),
      choice('Wer spricht jetzt?', 'Minka fragt, Fuji antwortet. Wie wird der Wechsel am deutlichsten?', ['Beide Äußerungen haben nur ein gemeinsames Paar Anführungszeichen.','Vor Fujis Antwort beginnt ein neuer Absatz. Beide Äußerungen haben eigene Anführungszeichen.','Fujis Antwort bleibt ohne Anführungszeichen im Erzähltext stehen.'],1,'Mit dem Absatz und den eigenen Anführungszeichen erkennen die Leser den Wechsel leichter.','Markiere jede Äußerung für sich und trenne die beiden Figuren sichtbar.')
    ],
    write:'Schreibe einen Dialog mit vier Äußerungen: Minka fragt, was im Schuppen raschelt. Fuji antwortet, Minka warnt und Fuji beruhigt sie. Verwende einen vorangestellten, einen nachgestellten und einen eingeschobenen Begleitsatz.',
    model:'Minka fragte: „Was raschelt im Schuppen?“\n„Vielleicht ist es ein Igel“, antwortete Fuji.\n„Vorsicht!“, warnte Minka.\n„Wir bleiben hier“, erklärte Fuji, „bis wir sicher sind.“',
    checks:['Alle gesprochenen Wörter stehen in Anführungszeichen.','Ich habe alle drei Stellungen des Begleitsatzes ausprobiert.','Doppelpunkte, Kommas, Frage- und Ausrufezeichen passen zum Bauplan.','Meine Redeverben passen zur Äußerung; der Sprecherwechsel ist klar.']
  },
  {
    id:'praeteritum', title:'Präsens und Präteritum', guide:'Fuji',
    goal:'Verben aus dem Präsens ins Präteritum setzen und die Erzählzeit beibehalten.',
    explanation:'Im Präsens erzählst du, was jetzt geschieht: „Ich sehe eine Spur.“ Im Präteritum erzählst du Vergangenes: „Ich sah eine Spur.“ In Schulgeschichten steht der Erzähltext meistens im Präteritum.',
    steps:['Finde das gebeugte Verb und frage, zu wem es gehört.', 'Setze es ins Präteritum: ich suche → ich suchte, ich sehe → ich sah.', 'Lies den Erzähltext noch einmal. In wörtlicher Rede richtet sich die Zeit nach dem, was die Figur gerade meint.'],
    tip:'Prüfe auch die Person und die Anzahl: „Minka ging“, aber „Minka und Fuji gingen“. In der Tabelle stehen die Formen mit „ich“.',
    before:'Minka geht zum Steg und sieht eine Spur. „Ich sehe Pfotenabdrücke“, flüstert sie.',
    after:'Minka ging zum Steg und sah eine Spur. „Ich sehe Pfotenabdrücke“, flüsterte sie.',
    why:'„Ging“, „sah“ und „flüsterte“ gehören zum Erzähltext. Minka spricht über das, was sie in diesem Moment sieht. In ihrer Rede bleibt deshalb „sehe“ stehen.',
    bankTitle:'Die 16 unregelmäßigen Verben vom Lernplakat',
    verbForms,
    tasks:[
      ...verbForms.map(([verb, present, past, before, after]) => word(
        `Ich-Form von „${verb}“`, before, after, past,
        `Präsens: ich ${present}. Präteritum: ich ${past}.`,
        `Setze den Satz mit „Gestern“ im Kopf in die Vergangenheit. Wenn du die Form noch nicht kennst, schlage „${verb}“ in der Verbtabelle nach.`
      )),
      gap('Ein regelmäßiges Verb', 'Fuji ', ' gestern am Ufer nach der Spur. (suchen)', ['sucht','suchte','suchten'],1,'„Suchte“ ist die Präteritumform zu „Fuji sucht“. Für mehrere Figuren wäre es „suchten“.','Bei „suchen“ hilft dir die Endung -te. Fuji ist eine einzelne Figur.'),
      gap('Zwei Figuren', 'Minka und Fuji ', ' gemeinsam zum Steg. (gehen)', ['geht','ging','gingen'],2,'Bei „Minka und Fuji“ brauchst du die Mehrzahl: „Sie gingen“.','Ersetze „Minka und Fuji“ durch „sie beide“.'),
      choice('Die Erzählzeit beibehalten', 'Welche Fassung steht durchgehend im Präteritum?', ['Fuji lief zum Steg und fand einen Zettel. Minka las ihn vor.','Fuji läuft zum Steg und fand einen Zettel. Minka las ihn vor.','Fuji lief zum Steg und findet einen Zettel. Minka liest ihn vor.'],0,'„Lief“, „fand“ und „las“ sind Präteritumformen.','Achte auf alle drei Verben, auch im letzten Satz.'),
      choice('Erzähltext und Rede unterscheiden', 'Fuji erzählt Minka, was sie in diesem Augenblick hört. Welche Fassung hält den Erzähltext im Präteritum?', ['Fuji lauscht. „Ich höre ein Klopfen“, flüstert sie.','Fuji lauschte. „Ich höre ein Klopfen“, flüsterte sie.','Fuji lauschte. „Ich höre ein Klopfen“, flüstert sie.'],1,'„Lauschte“ und „flüsterte“ gehören zum Erzähltext. „Höre“ steht in der wörtlichen Rede und passt zum Augenblick.','Die Anführungszeichen grenzen die gesprochenen Wörter ab.')
    ],
    write:'Übertrage die Erzählung ins Präteritum. Lass Minka weiterhin sagen, was sie gerade sieht. „Fuji läuft zur Tür. Sie findet eine Spur. Minka kommt zu ihr und flüstert: ‚Ich sehe noch eine!‘“',
    model:'Fuji lief zur Tür. Sie fand eine Spur. Minka kam zu ihr und flüsterte: „Ich sehe noch eine!“ Die Verben im Erzähltext lauten lief, fand, kam und flüsterte. In der wörtlichen Rede bleibt „sehe“ stehen.',
    checks:['Ich habe alle gebeugten Verben im Erzähltext überprüft.','Meine Verben passen zur Person und zur Anzahl der Figuren.','In der Rede habe ich die Zeitform beibehalten, die zur Aussage passt.']
  },
  {
    id:'erzaehlverben', title:'Mehr Verben fürs Erzählen', guide:'Minka',
    goal:'Genauere Verben für Handlung, Geräusche, Wahrnehmung und Gefühle einsetzen.',
    explanation:'Treffende Verben zeigen, was genau passiert. „Das Glas klirrte“ lässt uns das Geräusch hören. „Fuji griff nach dem Seil“ zeigt ihre Bewegung genauer als „Fuji machte etwas mit dem Seil“.',
    steps:['Überlege, was die Figur tut, wie sie reagiert oder was sie bemerkt.', 'Wähle ein Verb, dessen Bedeutung zur Szene passt.', 'Setze es in die Erzählzeit. Bei trennbaren Verben kann ein Teil nach hinten rücken: zusammenzucken → Minka zuckte zusammen.'],
    tip:'Beim Verb „erschrecken“ kommt es auf die Bedeutung an: „Minka erschrak“ beschreibt ihre Reaktion. „Das Klirren erschreckte Minka“ nennt den Auslöser als Satzgegenstand.',
    before:'Fuji machte die Kiste auf. Dann machte es ein Geräusch. Minka hatte auf einmal Angst.',
    after:'Fuji schob den Deckel zur Seite. Eine Flasche kippte um und klirrte. Minka zuckte zusammen.',
    why:'„Schob“ zeigt die Bewegung, „klirrte“ den Klang und „zuckte zusammen“ die körperliche Reaktion. Man kann der Szene auch ohne viele Zusatzwörter folgen.',
    bankTitle:'24 Verben nach ihrer Aufgabe · Grundform und Präteritum',
    bank:[
      ['Sich bewegen','kriechen → kroch\nklettern → kletterte\nspringen → sprang\nfliehen → floh','Minka kroch unter die Bank. Fuji sprang über die Pfütze.'],
      ['Etwas wahrnehmen','lauschen → lauschte\nwittern → witterte\nriechen → roch\nertasten → ertastete','Fuji witterte eine Fährte. Minka ertastete die Kante im Dunkeln.'],
      ['Auf etwas reagieren','zusammenzucken → zuckte zusammen\nerschrecken → erschrak oder erschreckte\nzögern → zögerte\nzittern → zitterte','Minka erschrak. Vor dem morschen Steg zögerte Fuji.'],
      ['Etwas anfassen oder bewegen','greifen → griff\nzerren → zerrte\nschieben → schob\nheben → hob','Fuji griff nach dem Seil. Minka hob den Deckel an.'],
      ['Geräusche beschreiben','knarren → knarrte\nrascheln → raschelte\npoltern → polterte\nklirren → klirrte','Das trockene Laub raschelte. Eine Flasche klirrte.'],
      ['Sprechen oder schweigen','stammeln → stammelte\nkeuchen → keuchte\nschweigen → schwieg\nflehen → flehte','„Warte auf mich!“, keuchte Fuji nach dem Lauf. Minka schwieg und hörte weiter zu.']
    ],
    tasks:[
      gap('Aufmerksam hören','Fuji blieb stehen und ', ' auf das leise Ticken hinter der Wand.',['witterte','lauschte','ertastete'],1,'„Lauschen“ bedeutet, dass Fuji besonders aufmerksam hinhörte. „Wittern“ und „ertasten“ gehören zu anderen Sinnen.','Fuji benutzt ihre Ohren.'),
      gap('Geräusch im Laub','Ein Windstoß fuhr durch die trockenen Blätter. Das Laub ', '.',['raschelte','klirrte','polterte'],0,'Trockene Blätter rascheln. Gläser können klirren, schwere Gegenstände poltern.','Denk an das leichte, trockene Geräusch vieler Blätter.'),
      gap('So reagiert Minka','Als der Deckel mit einem Knall zufiel, ', ' Minka.',['erschreckte','erschrickt','erschrak'],2,'Minka geriet selbst in Schrecken: Sie erschrak. „Erschreckte“ passt etwa in „Der Knall erschreckte Minka“.','Minka bekommt einen Schreck. Sie löst ihn bei niemandem aus.'),
      choice('Mit wenig Luft sprechen','Fuji kommt nach einem schnellen Lauf an. Welches Verb zeigt, dass sie kaum Luft hat?',['„Ich bin da“, schwieg Fuji.','„Ich bin da“, keuchte Fuji.','„Ich bin da“, flehte Fuji.'],1,'„Keuchte“ zeigt, dass Fuji schwer atmete. „Flehte“ wäre eine dringende Bitte.','Woran hörst du, dass Fuji außer Atem ist?'),
      word('greifen im Präteritum','Fuji ', ' nach dem Seil.', 'griff','Aus „Fuji greift“ wird „Fuji griff“.','Bei „greifen“ wird aus ei ein kurzes i.'),
      word('kriechen im Präteritum','Minka ', ' unter die niedrige Bank.', 'kroch','Aus „Minka kriecht“ wird „Minka kroch“.','In der gesuchten Form hörst du statt ie ein o.'),
      word('riechen im Präteritum','Im Schuppen ', ' es nach feuchtem Holz.', 'roch','Aus „Es riecht“ wird „Es roch“.','Die Form klingt am Ende wie „kroch“.'),
      word('zusammenzucken im Präteritum','Beim Knall ', ' Minka zusammen.', 'zuckte','Bei „zusammenzucken“ steht im Aussagesatz „zuckte“ als gebeugtes Verb vorn und „zusammen“ am Ende.','„Zusammen“ steht schon da. Bilde die Vergangenheitsform zu „zucken“.')
    ],
    write:'Verbessere die Szene mit drei treffenden Verben: „Fuji ging zur Kiste. Darin war ein Geräusch. Minka machte die Kiste auf.“ Du kannst zeigen, wie Fuji sich bewegte, was zu hören war oder wie Minka reagierte.',
    model:'Fuji kroch vorsichtig zur Kiste. Drinnen raschelte etwas. Minka griff nach dem Deckel, zögerte kurz und hob ihn dann an.',
    checks:['Meine Verben zeigen genauer, was in der Szene passiert.','Meine Verben stehen im Präteritum.','Die Handlung bleibt gut verständlich.']
  },
  {
    id:'erzaehlaufbau', title:'Aufbau und Spannung', guide:'Minka',
    goal:'Einleitung, Hauptteil und Schluss so verbinden, dass die Geschichte einen roten Faden hat.',
    explanation:'In der Einleitung erfahren die Leser, wer dabei ist, wo und wann die Geschichte beginnt. Im Hauptteil wird das Rätsel größer. Am Höhepunkt fällt die wichtigste Entscheidung oder geschieht das Aufregendste. Der Schluss zeigt, wie alles ausgeht.',
    steps:['Gib Orientierung und lege eine Schlinge, die neugierig macht.', 'Lass eine Schwierigkeit folgen. Erzähle den Höhepunkt ausführlich mit Handlung und Wahrnehmung.', 'Greife den Hinweis spätestens am Schluss auf und runde die Geschichte kurz ab.'],
    tip:'Denk an den Wal vom Lernplakat. Über seinen Rücken steigt die Spannung bis zum Höhepunkt. Zum Schwanz hin klingt das Abenteuer aus.',
    before:'Minka und Fuji gingen zum Schuppen. Sie fanden einen Igel. Dann gingen sie nach Hause.',
    after:'Am Abend suchten Minka und Fuji im Garten ihren Ball. Hinter der Schuppentür kratzte es. Drinnen stand Minka vor einem umgestülpten Blumentopf. Über ihr kippte ein Brett vom Regal. Fuji sprang vor und zog Minka zur Seite. Das Brett schlug neben ihnen auf. Als Minka den Topf anhob, entdeckte sie einen kleinen Igel. Seine Krallen hatten über den Boden gescharrt. Wenig später huschte er ins Laub.',
    why:'Das Kratzen weckt Neugier. Als das Brett kippt, muss Fuji schnell reagieren. Der Igel erklärt das Geräusch, und sein Verschwinden rundet die Geschichte ab.',
    bankTitle:'Die vier Stellen am Erzählwal',
    bank:[['Einleitung','Wer? Wo? Wann? Was geht gerade vor?','Am Abend suchten Minka und Fuji im Garten ihren Ball.'],['Steigerung','Eine Schwierigkeit macht die Situation dringender.','Über Minka rutschte ein Brett bis zur Regalkante.'],['Höhepunkt','Der entscheidende Augenblick bekommt Platz.','Fuji sprang vor und zog Minka zur Seite. Das Brett schlug neben ihnen auf.'],['Schluss','Die offene Frage bekommt eine Antwort.','Der Igel huschte ins Laub. Endlich war der Schuppen still.']],
    tasks:[
      choice('Die Einleitung erkennen','Welche Fassung gibt Orientierung und hält das Rätsel offen?',['Fuji rettete den Igel. Danach war alles wieder ruhig.','Am Freitagabend suchten Minka und Fuji im Garten ihren Ball. Hinter der Schuppentür kratzte es.','Fuji fing den Topf gerade noch mit ihrer Pfote.'],1,'Zeit, Ort, Figuren und Ausgangssituation sind klar. Das Kratzen eröffnet das Rätsel.','Suche den Einstieg, der erklärt, wer wo und wann etwas tut.'),
      choice('Die Spannung steigern','Minka und Fuji hörten ein Kratzen. Welche Fortsetzung macht die Lage dringender?',['Der Topf bewegte sich ruckweise auf die Regalkante zu.','Neben der Tür stand eine blaue Gießkanne.','Minka zählte am nächsten Morgen die Blumentöpfe.'],0,'Der Topf droht zu fallen. Dadurch wollen die Leser wissen, ob Fuji noch rechtzeitig eingreift.','Suche ein Ereignis, das die Figuren zum Handeln drängt.'),
      choice('Den Höhepunkt ausbauen','Fuji muss den Topf auffangen. Welche Fassung erzählt den entscheidenden Moment anschaulich?',['Fuji fing den Topf, und das war spannend.','Fuji dachte lange über die Farbe des Topfes nach.','Der Topf kippte. Fuji stieß sich vom Boden ab und presste die Pfote gegen das raue Tongefäß. Es blieb hängen.'],2,'Die Fassung zerlegt den Moment in kleine Schritte. Die Leser können Fujis Handlung verfolgen.','Suche die Fassung, in der du genau mitbekommst, was Fuji tut.'),
      choice('Die Schlinge im Schluss auflösen','Unter der Tür flackerte rotes Licht. Welcher Schluss greift den Hinweis auf?',['Minka ging nach Hause und dachte über ihr Abendessen nach.','Hinter der Tür lag eine blinkende Fahrradlampe. Fuji schaltete sie aus. Nun war es dunkel.','Auf dem Hof leuchtete der Mond.'],1,'Die blinkende Lampe erklärt das rote Licht. Ihre Entdeckung und das Ausschalten beenden die Szene.','Der Schluss soll beantworten, woher das rote Licht kam.')
    ],
    write:'Plane eine Geschichte mit vier kurzen Abschnitten: Einleitung mit rätselhaftem Geräusch, Steigerung, Höhepunkt und Schluss. Erzähle den Höhepunkt in zwei oder drei Sätzen.',
    model:'Am frühen Abend hörten Minka und Fuji ein Klirren im Garten. Zwischen den Beeten zitterte die alte Gießkanne. Als sie vom Stein rutschte, packte Fuji den Henkel. Minka stemmte sich mit beiden Pfoten gegen den Bauch der Kanne. Drinnen klapperte ein Kiesel, den der Wind hin und her rollte. Fuji stellte die Kanne in den Schuppen. Endlich war Ruhe.',
    checks:['Wer, wo und wann werden am Anfang klar.','Mein Hinweis wird später aufgegriffen.','Der Höhepunkt hat mehr Raum als die Auflösung.','Das Ende ergibt sich aus dem, was vorher passiert.']
  },
  {
    id:'gefuehle', title:'Gedanken, Gefühle und Sinne', guide:'Fuji',
    goal:'Zeigen, was eine Figur denkt, fühlt und in ihrer Umgebung wahrnimmt.',
    explanation:'Gedanken lassen Leser verstehen, was eine Figur befürchtet oder hofft. Körperreaktionen und Sinneseindrücke helfen, die Szene mitzuerleben.',
    steps:['Wähle eine Figur, aus deren Nähe du die Szene erzählst.', 'Gib ihr einen passenden Gedanken oder zeige ihre Gefühle mit einer Reaktion.', 'Beschreibe ein Geräusch, einen Geruch, eine Berührung oder etwas Sichtbares, das in der Szene wichtig ist.'],
    tip:'Ein einzelnes genaues Detail kann reichen: „Unter Minkas Pfoten vibrierte das Holz.“ Ein Vergleich kann helfen, wenn er zum Eindruck passt.',
    before:'Minka hatte Angst. Es war im Schuppen sehr unheimlich.',
    after:'Minkas Pfoten zitterten. Hinter der Tür kratzte es, als schabte jemand mit einer Gabel über Holz. Was saß dort im Dunkeln?',
    why:'Die zitternden Pfoten zeigen das Gefühl. Der Vergleich lässt das Geräusch hörbar werden. Die Frage gibt Minkas Gedanken wieder.',
    bankTitle:'Vier Möglichkeiten, die Szene mitzuerleben',
    bank:[['Körper','zittern, schlucken, den Atem anhalten','Minka hielt den Atem an.'],['Gedanke','Was ist zu befürchten oder zu hoffen?','Ob Fuji das Geräusch auch gehört hatte?'],['Sinne','hören, sehen, riechen, fühlen','Kalte Luft strich über Minkas Nase.'],['Vergleich','Einen Eindruck mit etwas Bekanntem verbinden','Das Licht zuckte wie eine winzige Flamme.']],
    tasks:[
      choice('Angst zeigen','Welche Reaktion lässt die Leser Minkas Angst spüren?',['Minka hatte Angst.','Minka war neben Fuji.','Minkas Pfoten zitterten. Sie wich bis zur Wand zurück.'],2,'Zittern und Zurückweichen machen Minkas Angst an ihrem Körper und Verhalten sichtbar.','Suche nach dem, was Minka tut und was ihr Körper dabei zeigt.'),
      choice('Gedanken erkennen','Fuji steht am Rand eines morschen Stegs. Welche Zeile gibt ihre Sorge als Gedanken wieder?',['Hielt das Brett ihr Gewicht aus?','Der Steg war aus Holz.','„Warte hier!“, rief Fuji.'],0,'Die Frage führt in Fujis Kopf. Der zweite Satz beschreibt etwas, im dritten spricht Fuji laut.','Gesucht ist, was Fuji sich im Stillen fragt.'),
      gap('Einen Sinneseindruck wählen','Als Minka die Tür öffnete, schlug ihr ein ', ' Geruch nach feuchtem Holz entgegen.',['greller','modriger','rauer'],1,'„Modrig“ beschreibt den Geruch von feuchtem, altem Holz. „Grell“ passt zu Licht oder Farbe, „rau“ beschreibt eine Oberfläche.','Welches Wort passt zu etwas, das Minka riecht?'),
      choice('Einen Vergleich nutzen','Minka sieht einen Lichtpunkt, der immer wieder kurz aufblitzt. Welcher Vergleich passt?',['Der Lichtpunkt blitzte wie ein nasser Schwamm.','Der Lichtpunkt blitzte wie das Warnlämpchen an einem Fahrrad.','Der Lichtpunkt blitzte wie eine schwere Kiste.'],1,'Das Warnlämpchen gibt den kurzen, wiederholten Lichteindruck wieder.','Womit kannst du das wiederholte Aufblitzen vergleichen?')
    ],
    write:'Schreibe drei oder vier Sätze über Minka vor der dunklen Schuppentür. Zeige ihr Gefühl mit einer Körperreaktion. Ergänze einen Gedanken und einen passenden Sinneseindruck.',
    model:'Minka hielt den Atem an. Durch die Ritze strich kalte Luft über ihre Pfoten. Drinnen kratzte es zum dritten Mal. Was, wenn dort jemand auf sie wartete?',
    checks:['Eine Körperreaktion macht Minkas Gefühl sichtbar.','Die Leser erfahren, was Minka denkt.','Ein Sinneseindruck passt zu diesem Moment.']
  },
  {
    id:'schreibcheck', title:'Überschrift und Schreib-Check', guide:'Minka',
    goal:'Eine Geschichte mit einem Plan schreiben und Schritt für Schritt überarbeiten.',
    explanation:'Eine passende Überschrift macht neugierig. Beim Überarbeiten prüfst du zuerst Handlung und Absätze, dann die Sprache und am Ende Rechtschreibung und Satzzeichen.',
    steps:['Plane Ausgangssituation, Hinweis, Höhepunkt und Auflösung.', 'Schreibe den Entwurf. Gib wichtigen Handlungsschritten Platz und setze Absätze, wenn ein neuer Abschnitt beginnt.', 'Prüfe roten Faden, Erzählzeit, Satzanfänge und Wortwahl. Lies den Text zum Schluss auf Grammatik, Satzzeichen und Rechtschreibung.'],
    tip:'Lies deinen Text leise vor. An Stellen, an denen du stolperst oder die Handlung unklar wird, lohnt es sich besonders, genauer hinzusehen.',
    before:'Ein Abenteuer\nDann ist Minka beim Schuppen. Dann sah sie eine Spur. Minka ging nach Hause.',
    after:'Die Spur im Staub\nVor dem Schuppen entdeckte Minka eine Spur im Staub. Neugierig folgte sie ihr bis zu einem Topf. Gerade als der Topf kippte, zog Minka die Pfoten zurück. Ein Igel huschte darunter hervor.',
    why:'Die Überschrift greift den Hinweis auf. Die Spur führt zu einer Entdeckung, und die Verben im Erzähltext stehen einheitlich im Präteritum.',
    bankTitle:'Dein Plan für die Überarbeitung',
    bank:[['Überschrift','Passt sie zur Geschichte und macht sie neugierig?','Die Spur im Staub'],['Handlung und Absätze','Kann ich vom ersten Hinweis bis zur Lösung folgen?','Ein neuer Absatz kann den Übergang zur Auflösung zeigen.'],['Sprache','Passen Erzählzeit, Satzanfänge, Verben und Adjektive?','Unter dem Regal entdeckte Minka eine winzige Spur.'],['Letzte Kontrolle','Stimmen Rechtschreibung, Grammatik und Satzzeichen?','„Da ist die Spur!“, rief Fuji.']],
    tasks:[
      choice('Eine passende Überschrift','Minka entdeckt eine Spur im Staub. Erst später merkt sie, dass sie von einem Igel stammt. Welche Überschrift passt und macht neugierig?',['Die Spur im Staub','Der Fußballpokal','Minka findet den Igel und löst das Rätsel'],0,'Die Überschrift nennt einen wichtigen Hinweis und lässt die Lösung offen.','Suche den Titel, der zur Spur passt und die Ursache offenlässt.'),
      choice('Einen Absatz setzen','Nach dem Höhepunkt und der Auflösung folgt ein kurzer Ausklang. Wo hilft ein neuer Absatz?',['Mitten in „Minka hob den Topf an“.','Vor „Wenig später war der Garten wieder still.“','Vor jedem zweiten Wort.'],1,'Ein Absatz vor dem Ausklang macht den Wechsel zum Schluss sichtbar.','Suche die Stelle, an der eine neue Phase beginnt.'),
      choice('Den roten Faden reparieren','Erst hört Fuji ein Klopfen, dann ist das Geräusch ohne Erklärung weg. Was sollte Fuji beim Überarbeiten ergänzen?',['Mehr Adjektive für die Wolken.','Eine Liste von Fujis Lieblingsspeisen.','Was das Klopfen verursachte und wie es aufhörte.'],2,'Der Hinweis braucht eine Auflösung. Dann ergibt das Ende aus der vorherigen Handlung Sinn.','Welche Frage blieb vom Anfang offen?'),
      choice('Den letzten Durchgang machen','Welche Fassung stimmt bei Erzählzeit, Großschreibung und Satzzeichen?',['„Da ist die spur!“, ruft Fuji.','„Da ist die Spur!“, rief Fuji.','„Da ist die Spur!“ rief Fuji.'],1,'„Spur“ ist ein Nomen, „rief“ steht im Präteritum, und nach dem schließenden Anführungszeichen folgt ein Komma.','Achte auf das Nomen, das Redeverb und die Stelle nach den Anführungszeichen.')
    ],
    write:'Überarbeite „Dann kommt Fuji zum Steg. Dann sah sie ein rotes licht. Ich sehe was rief Fuji. Dann geht sie nach Hause.“ Gib der Geschichte eine Überschrift und ergänze eine Auflösung. Prüfe mit der Liste.',
    model:'Das Licht unter dem Steg\n\nAm frühen Abend kam Fuji zum See. Unter dem Steg blinkte ein rotes Licht. „Ich sehe etwas!“, rief sie. Vorsichtig beugte sie sich über die Kante. Das Licht zuckte im Wasser. Fuji streckte die Pfote aus und zog an einer Schlaufe.\n\nWenig später hielt sie eine blinkende Fahrradlampe in der Pfote. Erleichtert trug sie ihren Fund nach Hause.',
    checks:['Meine Überschrift passt und weckt Neugier.','Der rote Faden führt vom Hinweis zur Auflösung.','Meine Absätze zeigen, wo ein neuer Teil beginnt.','Erzählzeit, Satzanfänge und Wörter passen zur Geschichte.','Rechtschreibung, Grammatik und Satzzeichen sind geprüft.']
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
function renderBank(t) {
  if (t.verbForms) {
    return `<table class="language-verb-table"><caption>Alle gebeugten Formen passen zu „ich“.</caption><thead><tr><th scope="col">Grundform</th><th scope="col">Präsens</th><th scope="col">Präteritum</th></tr></thead><tbody>${t.verbForms.map(([verb, present, past]) => `<tr><th scope="row">${esc(verb)}</th><td>${esc(present)}</td><td>${esc(past)}</td></tr>`).join('')}</tbody></table>`;
  }
  return `<div class="language-bank">${t.bank.map(([word,meaning,example])=>`<div class="language-word"><h4>${esc(word)}</h4><p>${esc(meaning)}</p><p class="muted">${esc(example)}</p></div>`).join('')}</div>`;
}
function render() {
  const t=topic(),s=state();
  renderTopics();totals();
  root.innerHTML = `<article class="panel language-theory"><p class="eyebrow">1 · Verstehen</p><h2 id="language-heading" tabindex="-1">${esc(t.title)}</h2><p class="language-goal"><strong>Dein Ziel:</strong> ${esc(t.goal)}</p><div class="speech"><strong>${esc(t.guide)} erklärt:</strong> ${esc(t.explanation)}</div><h3>So gehst du vor</h3><ol class="language-steps">${t.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><div class="note compact"><strong>${t.guide === 'Minka'?'Fuji':'Minka'} ergänzt:</strong> ${esc(t.tip)}</div></article>
    <article class="panel extras"><p class="eyebrow">2 · Vergleichen</p><h2>Was ändert sich im Text?</h2><div class="two-col"><div><h3>Vorher</h3><p class="model-text">${esc(t.before)}</p></div><div><h3>Überarbeitet</h3><p class="model-text">${esc(t.after)}</p></div></div><p>${esc(t.why)}</p>${t.followup?`<div class="note">${esc(t.followup)}</div>`:''}<details><summary>${esc(t.bankTitle)}</summary>${renderBank(t)}</details></article>
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
  let controls;
  let solution;
  if (q.type === 'word') {
    controls=`<p id="language-word-instruction">Schreib nur das fehlende Verb im Präteritum.</p><p class="question-text"><label>${esc(q.before)}<input id="language-word-answer" type="text" maxlength="40" autocomplete="off" autocapitalize="none" spellcheck="false" aria-describedby="language-word-instruction" ${r.solved?'readonly':''}>${esc(q.after)}</label></p>`;
    solution=q.before+q.answer+q.after;
  } else if (q.type === 'gap') {
    controls=`<div class="question-text"><label>${esc(q.before)}<select id="language-gap" aria-label="Passendes Verb oder passende Formulierung wählen" ${r.solved?'disabled':''}><option value="">Bitte wählen</option>${q.options.map((o,i)=>`<option value="${i}" ${r.selected===i?'selected':''}>${esc(o)}</option>`).join('')}</select>${esc(q.after)}</label></div>`;
    solution=q.before+q.options[q.answer]+q.after;
  } else {
    controls=`<p class="question-text">${esc(q.text)}</p><div class="choices" role="group" aria-label="Antwortmöglichkeiten">${q.options.map((o,i)=>`<button type="button" class="choice ${r.solved&&i===q.answer?'correct':''}" data-language-answer="${i}" aria-pressed="${r.selected===i}" ${r.solved?'disabled':''}><span class="letter" aria-hidden="true">${'ABC'[i]}</span>${esc(o)}</button>`).join('')}</div>`;
    solution=q.options[q.answer];
  }
  document.getElementById('language-task').innerHTML=`<h3 id="language-task-title" tabindex="-1">${s.index+1}. ${esc(q.title)}</h3>${controls}<div class="quiz-actions"><button type="button" class="primary" id="language-check" ${r.selected===null||r.solved?'disabled':''}>Antwort prüfen</button><button type="button" class="secondary" id="language-hint" ${r.hint?'disabled':''}>${r.hint?'Hilfe geöffnet':'Hilfe von Minka & Fuji'}</button></div><div id="language-answer-feedback" class="feedback ${r.solved?'good':''}" role="status">${esc(r.message)}</div>${r.hint?`<div class="hint-box">${esc(q.hint)}</div>`:''}<details id="language-solution" ${r.model?'open':''}><summary>Lösung mit Erklärung</summary><p><strong>${esc(solution)}</strong></p><p>${esc(q.explain)}</p></details><div class="quiz-actions"><button type="button" class="secondary" id="language-prev-task" ${s.index===0?'disabled':''}>Vorherige Aufgabe</button><button type="button" class="primary" id="language-next-task" ${s.index===t.tasks.length-1?'disabled':''}>Nächste Aufgabe</button></div>`;
  const checkButton=document.getElementById('language-check');
  const wordInput=document.getElementById('language-word-answer');
  if (wordInput) {
    wordInput.value=r.selected??'';
    wordInput.addEventListener('input',()=>{
      r.selected=wordInput.value.trim() ? wordInput.value : null;
      r.message='';
      checkButton.disabled=r.selected===null;
      document.getElementById('language-answer-feedback').textContent='';
    });
    wordInput.addEventListener('keydown',e=>{
      if(e.key==='Enter'&&!e.isComposing){e.preventDefault();checkButton.click();}
    });
  }
  const selectAnswer=i=>{r.selected=i;r.message='';renderTask();const control=q.type==='gap'?document.getElementById('language-gap'):document.querySelector(`[data-language-answer="${i}"]`);control?.focus({preventScroll:true});};
  document.querySelectorAll('[data-language-answer]').forEach(b=>b.addEventListener('click',()=>selectAnswer(Number(b.dataset.languageAnswer))));
  document.getElementById('language-gap')?.addEventListener('change',e=>selectAnswer(e.target.value===''?null:Number(e.target.value)));
  checkButton.addEventListener('click',()=>{
    if(r.selected===null||r.solved)return;
    const correct=(q.type==='word'?r.selected.trim().toLocaleLowerCase('de'):r.selected)===q.answer;
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
function openLanguageLink(focus=false){
  const id=location.hash.slice(1);
  if(id!=='sprache'&&!states.has(id))return false;
  if(states.has(id))current=id;
  render();
  showPage('sprache',focus);
  return true;
}
if(!openLanguageLink())render();
window.addEventListener('hashchange',()=>openLanguageLink(true));
})();

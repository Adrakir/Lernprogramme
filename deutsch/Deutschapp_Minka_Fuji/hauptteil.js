'use strict';
(() => {
  const q=(text,options,right,why,hint,steps)=>({text,options,right,why,hint,steps});
  const lessons=[
    {
      id:'gefuehle',title:'Gefühle spürbar machen',who:'Minka',image:'scene-3.webp',
      goal:'Gefühle nicht nur benennen, sondern durch Körper, Verhalten und passende Einzelheiten zeigen.',
      weak:'Minka hatte Angst.',strong:'Minkas Herz hämmerte. Sie hielt die Luft an und wich einen Schritt zurück.',
      why:'Herzklopfen und Zurückweichen lassen uns die Angst miterleben, statt sie nur zu behaupten.',
      recipe:['Welches Gefühl passt zur Situation?','Was verändert sich am Körper oder in der Stimme?','Was tut die Figur deswegen?','Nutze ein oder zwei stimmige Signale; nicht jedes Gefühl braucht drei Ausrufezeichen.'],
      tasks:[
        q('Welche Formulierung zeigt Minkas Angst am deutlichsten?',['Minka hatte ein Gefühl.','Minkas Pfoten zitterten, als die Tür knarrte.','Es war sehr aufregend.'],1,'Zitternde Pfoten sind ein sichtbares Zeichen der Angst.','Suche einen Satz, in dem man die Reaktion beobachten kann.','1. Die Tür knarrt. 2. Minka reagiert körperlich. 3. Leser erschließen: Sie ist ängstlich.'),
        q('Fuji ist erleichtert, als der Igel frei ist. Welche Reaktion passt?',['Fuji atmete hörbar aus und ließ die Schultern sinken.','Fuji zählte die Dachziegel.','Fuji war sehr, sehr, sehr erleichtert.'],0,'Ausatmen zeigt die Entspannung nach der Gefahr.','Was geschieht mit einem angespannten Körper, wenn die Gefahr vorbei ist?','1. Gefahr endet. 2. Spannung löst sich. 3. Fuji atmet aus. Das Gefühl wird durch Handlung sichtbar.'),
        q('Minka ist wütend, weil jemand den Ball absichtlich versteckt. Welche Fassung ist stimmig?',['Minka lächelte zufrieden und schlief ein.','Minka fand es wirklich nicht gut.','Minka presste die Lippen zusammen und ballte die Pfoten. „Gib ihn zurück!“, rief sie.'],2,'Körpersprache, Handlung und Rede passen zu ihrer Wut.','Achte darauf, ob Körper und Worte dasselbe Gefühl unterstützen.','1. Ärger hat eine Ursache. 2. Minka reagiert körperlich. 3. Ein kurzer Ausruf verstärkt die Szene.')
      ],
      write:'Schreibe vier Sätze: Minka hört im dunklen Schuppen etwas. Zeige zuerst Unsicherheit, später Erleichterung – ohne die Wörter „ängstlich“ und „erleichtert“ zu benutzen.',
      model:'Minka erstarrte vor der Tür. Ihr Herz pochte, als hinter ihr ein Brett knackte. Fuji schob vorsichtig den Topf zur Seite. Minka atmete auf und schmiegte sich an Fujis Bein.',
      check:['Ich zeige eine körperliche oder sichtbare Reaktion.','Das Gefühl verändert das Verhalten.','Die Reaktionen passen zum Ereignis.']
    },
    {
      id:'gedanken',title:'Gedanken und innere Fragen',who:'Fuji',image:'scene-2.webp',
      goal:'Leser an Überlegungen, Sorgen und Entscheidungen einer Figur teilhaben lassen.',
      weak:'Minka dachte über alles nach.',strong:'Was, wenn dort jemand Hilfe brauchte? Minka musste nachsehen.',
      why:'Die innere Frage erklärt, warum Minka trotz ihrer Angst handelt.',
      recipe:['Was weiß die Figur bereits?','Welche Frage oder Befürchtung hat sie?','Welche Entscheidung entsteht daraus?','Bleibe bei dem Wissen der gewählten Erzählfigur.'],
      tasks:[
        q('Welcher Satz gibt einen Gedanken wieder?',['Minka öffnete die Tür.','Fuji bellte einmal.','Was, wenn die Tür gleich zufiel? Minka hielt den Atem an.'],2,'Die Was-wenn-Frage zeigt Minkas Befürchtung.','Gedanken können als Fragen im Kopf der Figur erscheinen.','1. Minka sieht die Tür. 2. Sie fürchtet ein mögliches Ereignis. 3. Daraus folgt ihre Anspannung.'),
        q('Welche Fortsetzung verbindet Gedanken und Handlung?',['Vielleicht war ein Tier gefangen. Deshalb lauschte Fuji noch genauer.','Es war spät. Danach kam ein völlig anderes Abenteuer.','Fuji dachte nichts, wusste aber plötzlich alles.'],0,'Ein Gedanke führt nachvollziehbar zur nächsten Handlung.','Suche einen Zusammenhang zwischen Vermutung und Tun.','1. Fuji vermutet ein Tier. 2. Deshalb lauscht sie. 3. Die Handlung hat eine Ursache.'),
        q('Erzählperspektive: Minka steht allein vor der Tür. Welcher Gedanke passt zu ihrer Sicht?',['Fuji wusste hinter dem Zaun genau, dass ein Igel wartete.','Hoffentlich war Fuji gleich zurück, dachte Minka und spähte in die Dunkelheit.','Minka kannte bereits jedes Detail im verschlossenen Schuppen.'],1,'Wir bleiben bei dem, was Minka weiß oder hofft.','Was könnte Minka wirklich wissen, während sie allein wartet?','1. Perspektive: Minka. 2. Fuji ist nicht bei ihr. 3. Minkas Hoffnung ist plausibel, fremdes Wissen nicht.')
      ],
      write:'Lass Minka vor der Schuppentür drei Gedanken haben. Einer davon soll sie zu einer Entscheidung bringen.',
      model:'War das wirklich nur der Wind? Vielleicht saß ein verletztes Tier im Schuppen. Minka wollte nicht einfach fortgehen. Sie rief Fuji und zeigte ihr den Türspalt.',
      check:['Die Gedanken passen zum Wissen der Figur.','Eine Überlegung erklärt ihre Entscheidung.','Ich verwechsle Gedanken nicht mit gesprochenen Worten.']
    },
    {
      id:'sinne',title:'Mit den Sinnen erzählen',who:'Minka',image:'scene-4.webp',
      goal:'Passende Geräusche, Gerüche, Licht, Berührung und andere Eindrücke gezielt einsetzen.',
      weak:'Im Schuppen war es unheimlich.',strong:'Holz knarrte unter Fujis Pfoten. Es roch nach nasser Erde, und im Türspalt zitterte ein Lichtstreifen.',
      why:'Die konkreten Sinneseindrücke helfen, die Szene vorzustellen.',
      recipe:['Wo befindet sich die Figur?','Was kann sie dort hören, sehen, riechen oder spüren?','Wähle nur passende Eindrücke.','Verbinde Wahrnehmung mit der folgenden Handlung.'],
      tasks:[
        q('Welcher Satz enthält einen Höreindruck?',['Der Schuppen war alt.','Hinter der Wand scharrte etwas über das Holz.','Minka war mutig.'],1,'Scharren ist ein hörbares Geräusch.','Denke an die Ohren.','1. Sinn: Hören. 2. Geräusch: Scharren. 3. Es verrät einen Hinweis zur Handlung.'),
        q('Welche Beschreibung passt zu einem dunklen feuchten Schuppen?',['Es roch nach feuchtem Holz, während ein Tropfen von der Decke fiel.','Die Sonne blendete auf dem sonnigen Spielplatz.','Sie rochen genau das, was ein Leser sich wünschte.'],0,'Geruch und Geräusch unterstützen den Ort und die Atmosphäre.','Prüfe, welcher Eindruck an diesem Ort möglich ist.','1. Der Schuppen ist feucht. 2. Holzgeruch passt. 3. Der Tropfen ergänzt das Bild.'),
        q('Minka kann durch den winzigen Spalt nicht alles sehen. Welcher Satz erzählt glaubwürdig?',['Sie sah gleichzeitig das ganze Haus und jedes Tier im Garten.','Sie erriet jedes Geräusch sofort.','Minka erkannte nur einen zitternden Schatten; hinter der Tür kratzte etwas.'],2,'Die Wahrnehmung bleibt auf den eingeschränkten Blick begrenzt.','Wie viel kann Minka durch einen kleinen Spalt wirklich sehen?','1. Ort und Blickwinkel begrenzen das Sehen. 2. Der Schatten bleibt unklar. 3. Das Kratzen liefert einen zweiten Sinneseindruck.')
      ],
      write:'Beschreibe den Schuppen mit zwei verschiedenen Sinneseindrücken. Einer davon soll wichtig für die Handlung sein.',
      model:'Aus dem Schuppen drang ein leises Scharren. Die Luft roch nach feuchtem Holz. Minka folgte dem Geräusch bis zur Gießkanne.',
      check:['Ich nutze mindestens zwei passende Sinne.','Die Figur kann diese Eindrücke tatsächlich wahrnehmen.','Mindestens ein Eindruck führt die Handlung weiter.']
    },
    {
      id:'hindernisse',title:'Hindernisse und Entscheidungen',who:'Fuji',image:'scene-3.webp',
      goal:'Aus einem Problem eine Handlung mit Versuchen, Rückschlägen und Entscheidungen entwickeln.',
      weak:'Es gab ein Problem, aber dann war es weg.',strong:'Die Tür klemmte. Fuji stemmte sich dagegen, doch sie rührte sich nicht. Minka suchte nach einer anderen Öffnung.',
      why:'Ein Hindernis verlangt eine Entscheidung; dadurch entsteht Handlung.',
      recipe:['Nenne ein konkretes Ziel.','Lege ein Hindernis auf den Weg.','Zeige einen ersten Versuch und seine Folge.','Lass die Figur darauf reagieren, statt das Problem zufällig verschwinden zu lassen.'],
      tasks:[
        q('Was ist in der Geschichte ein echtes Hindernis?',['Die Tür ist verschlossen, obwohl im Schuppen Hilfe gebraucht wird.','Fuji hat vier Pfoten.','Minka hat einen Namen.'],0,'Die verschlossene Tür steht dem Ziel im Weg.','Ein Hindernis erschwert das Vorhaben der Figuren.','1. Ziel: nachsehen und helfen. 2. Tür verhindert Zutritt. 3. Figuren müssen handeln.'),
        q('Welche Fortsetzung entwickelt das Hindernis weiter?',['Die Tür war zu. Auf einmal war der Igel frei und alles vorbei.','Die Tür klemmte. Fuji drückte dagegen; Minka entdeckte einen Holzkeil.','Die Tür war zu. Drei Tage später war Sommer.'],1,'Ein Versuch und eine neue Idee bringen den Konflikt voran.','Suche Versuch und Reaktion, nicht einen Zeitsprung.','1. Tür klemmt. 2. Fuji versucht zu drücken. 3. Minka sucht einen weiteren Lösungsweg.'),
        q('Was macht die Rettung glaubwürdig spannend?',['Ein Zauberer erscheint ohne Vorbereitung und löst alles.','Die Geschichte erklärt nicht, wie es gelang.','Der Topf rutscht beim Anheben. Minka muss ihn abstützen, während Fuji den Igel schützt.'],2,'Ein konkreter Rückschlag fordert die Figuren bis zum Höhepunkt heraus.','Ist die Lösung durch die Figuren vorbereitet und nachvollziehbar?','1. Ziel: Igel befreien. 2. Rückschlag: Topf rutscht. 3. Zusammenarbeit führt zur Lösung.')
      ],
      write:'Erfinde ein Hindernis auf dem Weg zum Igel. Zeige einen gescheiterten Versuch und eine neue Idee in vier bis fünf Sätzen.',
      model:'Die Schuppentür klemmte. Fuji drückte dagegen, doch das Holz bewegte sich nicht. Minka entdeckte einen Spalt unter dem Fenster. Sie schob einen Riegel zurück. Langsam öffnete sich die Tür.',
      check:['Meine Figuren haben ein verständliches Ziel.','Das Hindernis macht dieses Ziel schwerer.','Die Lösung entsteht durch eine passende Handlung.']
    },
    {
      id:'spannung',title:'Spannung sinnvoll steigern',who:'Minka',image:'scene-3.webp',
      goal:'Neugier, Unsicherheit und neue Schwierigkeiten auf einen entscheidenden Moment hinführen.',
      weak:'Es war spannend. Dann war es noch spannender.',strong:'Hinter der Tür scharrte es. Plötzlich fiel sie ins Schloss. Dann sah Minka einen Schatten, der sich bewegte.',
      why:'Der Hinweis, das Hindernis und die neue Unsicherheit steigern die Spannung.',
      recipe:['Starte mit einer offenen Frage oder einem Ziel.','Steigere die Schwierigkeit sinnvoll.','Gib nach und nach neue Hinweise.','Bewahre den entscheidenden Ausgang für den Höhepunkt auf.'],
      tasks:[
        q('Welche Reihenfolge steigert die Spannung?',['Igel befreit → Ball suchen → Kratzen hören.','Kratzen hören → Tür klemmt → Igel entdecken → Rettung gerät in Gefahr.','Alle gehen heim → ein neues Rätsel beginnt.'],1,'Die Ereignisse führen nachvollziehbar auf den schwierigen Rettungsmoment hin.','Welche Reihenfolge beginnt klein und wird schwieriger?','1. Rätsel. 2. Hindernis. 3. Erkenntnis. 4. Rettung auf der Kippe.'),
        q('Welche Formulierung erzeugt Spannung statt sie nur zu behaupten?',['Das war wirklich super spannend.','Es war sehr spannend und ganz aufregend.','Ein Brett knackte direkt hinter Minka. Sie fuhr herum.'],2,'Geräusch und Reaktion sind konkrete Ereignisse.','Welche Aussage kannst du wie in einem Film sehen oder hören?','1. Knacken weckt Aufmerksamkeit. 2. Reaktion zeigt Überraschung. 3. Leser fragen sich nach der Ursache.'),
        q('Die Spannung soll noch nicht fallen. Welche Fortsetzung ist passend?',['Fuji hob den Topf. Er begann zu rutschen – direkt auf den Igel zu.','Der Igel war längst frei. Alle schliefen zufrieden.','Es war alles gelöst. Ende.'],0,'Eine neue Gefahr hält den Ausgang im entscheidenden Moment offen.','Braucht die Szene noch eine ungelöste Frage?','1. Rettung beginnt. 2. Unerwarteter Rückschlag. 3. Ausgang bleibt bis zum Höhepunkt offen.')
      ],
      write:'Erzähle die Schuppenszene in drei Spannungsstufen: Hinweis → Hindernis → neue Gefahr. Markiere die Stufen in deinem Entwurf gedanklich.',
      model:'Hinter der Tür kratzte etwas. Als Fuji die Klinke drückte, fiel die Tür ins Schloss. Durch den Spalt sah Minka einen Topf wackeln. Wenn er umkippte, konnte das Tier darunter verletzt werden.',
      check:['Jede Stufe ergibt sich aus der vorherigen.','Das Problem wird schrittweise schwieriger.','Ich verrate den Ausgang nicht zu früh.']
    },
    {
      id:'tempo',title:'Den wichtigen Moment verlangsamen',who:'Fuji',image:'scene-5.webp',
      goal:'Am Höhepunkt in kleinen Handlungsschritten erzählen und Unwichtiges zusammenfassen.',
      weak:'Dann retteten sie den Igel.',strong:'Fuji schob die Pfote unter den Topfrand. Das Gefäß kippte. Minka griff nach einem Holzklotz. Würde sie ihn rechtzeitig unterlegen?',
      why:'Die kleinen Schritte lassen Leser die Gefahr und den Entscheidungsaugenblick miterleben.',
      recipe:['Finde den wichtigsten Moment.','Erzähle dort die einzelnen Schritte genauer.','Nutze passende Gedanken, Gefühle oder Geräusche.','Fasse unwichtige Wege oder Wiederholungen kurz zusammen.'],
      tasks:[
        q('Wo sollst du besonders ausführlich erzählen?',['Bei einem unwichtigen langen Weg zum Garten.','Bei jeder Minute des ganzen Tages.','Im Moment, in dem der Topf auf den Igel zu rutschen droht.'],2,'Am Höhepunkt entscheidet sich die Handlung.','Welcher Moment ist für den Ausgang am wichtigsten?','1. Gefahr droht. 2. Entscheidung fällt. 3. Kleine Schritte sind jetzt entscheidend.'),
        q('Welche Version verlangsamt die Rettung sinnvoll?',['Fuji hob den Topf und alles war gut.','Fuji hob den Rand. Der Topf schwankte. Minka schob den Klotz darunter.','Dann, dann, dann, dann war es plötzlich geschafft.'],1,'Drei nachvollziehbare Handlungsschritte machen die Rettung anschaulich.','Wie viele konkrete kleine Aktionen kannst du erkennen?','1. Rand heben. 2. Gefahr: Topf schwankt. 3. Minka stützt ihn.'),
        q('Welche Ergänzung macht die Szene dichter, ohne abzuschweifen?',['Minka hielt die Luft an, während der schwere Topf noch einmal nach unten rutschte.','Minka dachte lange über ihre Lieblingsfarbe nach.','Fuji erzählte die ganze Geschichte ihrer Schulzeit.'],0,'Gefühl und Gefahr bleiben unmittelbar mit der Rettung verbunden.','Bleibt die Ergänzung beim aktuellen Problem?','1. Figur reagiert. 2. Topf rutscht. 3. Ausgang ist noch ungewiss. Das verlangsamt den entscheidenden Augenblick.')
      ],
      write:'Schreibe den Satz „Fuji rettete den Igel“ als fünf kleine, logisch aufeinanderfolgende Handlungsschritte.',
      model:'Fuji legte ihre Pfote unter den Topfrand. Langsam hob sie ihn an. Der Topf wackelte bedrohlich. Minka schob einen Holzklotz in die Öffnung. Erst jetzt konnte der Igel herauskriechen.',
      check:['Ich beschreibe den wichtigsten Moment genauer.','Die Schritte sind logisch und anschaulich.','Unwichtige Nebensachen lenken nicht ab.']
    },
    {
      id:'hoehepunkt',title:'Höhepunkt und Erzählteile',who:'Minka',image:'scene-5.webp',
      goal:'Den entscheidenden Moment erkennen und vom ausklingenden Schluss unterscheiden.',
      weak:'Am Ende der Geschichte war alles spannend.',strong:'Als der Topf abrutschte, stützte Minka ihn ab. Jetzt gelang die Rettung. Danach atmeten beide auf.',
      why:'Das Abstützen löst die entscheidende Frage. Die Erleichterung gehört zum Ausklang.',
      recipe:['Kläre das Ziel der Figuren.','Finde den Moment, der über Erfolg oder Scheitern entscheidet.','Erzähle diesen Moment im Hauptteil ausführlich.','Wechsle erst danach zum Schluss.'],
      tasks:[
        q('Was ist der Höhepunkt der Schuppengeschichte?',['Minka sucht einen Ball.','Minka und Fuji stützen den rutschenden Topf, damit der Igel frei wird.','Minka und Fuji gehen zufrieden heim.'],1,'Hier entscheidet sich, ob die Rettung gelingt.','Wo wird die wichtigste Frage beantwortet?','1. Ziel: Igel retten. 2. Gefahr: Topf rutscht. 3. Die Rettungsaktion entscheidet den Ausgang.'),
        q('Wo gehört dieser Satz hin? „Minka hielt den schwankenden Topf fest, bis der Igel frei war.“',['In den Höhepunkt des Hauptteils.','Ausschließlich in die Einleitung.','Erst in den Ausklang des Schlusses.'],0,'Die entscheidende Rettung gehört zum Hauptteil, nicht zum Schluss.','Entscheidet sich hier gerade die Handlung?','1. Es ist noch eine Gefahr vorhanden. 2. Minka löst sie. 3. Also: Höhepunkt im Hauptteil.'),
        q('Welche Folge zeigt einen klaren Übergang zum Schluss?',['Fuji stützte den Topf. Sofort tauchte ein Drache auf.','Minka suchte weiterhin ohne Ergebnis.','Der Igel kroch heraus. Erleichtert ließen die beiden den Topf sinken und sahen ihm nach.'],2,'Die Gefahr endet; die Reaktion danach lässt die Handlung ausklingen.','Wird die Hauptfrage gelöst und danach Ruhe gezeigt?','1. Rettung gelingt. 2. Anspannung lässt nach. 3. Der Schluss beschreibt die Folgen.')
      ],
      write:'Schreibe drei Sätze zum Höhepunkt und zwei Sätze zum Schluss. Achte auf den Übergang.',
      model:'Fuji hielt den Topf hoch. Er glitt ihr aus der Pfote. Minka schob in letzter Sekunde einen Holzklotz darunter, und der Igel war frei. Beide atmeten erleichtert aus. Schließlich entdeckten sie auch noch Minkas Ball.',
      check:['Der Höhepunkt löst das wichtigste Problem.','Der Höhepunkt steht noch im Hauptteil.','Der Schluss zeigt die Zeit danach.']
    },
    {
      id:'roterfaden',title:'Roter Faden: Ursache und Wirkung',who:'Fuji',image:'scene-4.webp',
      goal:'Handlungen so verbinden, dass Hinweise, Ursachen und Folgen verständlich bleiben.',
      weak:'Minka suchte den Ball. Dann war ein Igel da.',strong:'Weil der Ball hinter den Schuppen gerollt war, suchten Minka und Fuji dort. Dabei hörten sie ein Kratzen.',
      why:'Der Weg zum Schuppen und die Entdeckung hängen miteinander zusammen.',
      recipe:['Frage bei jedem Ereignis: Warum passiert es?','Verbinde Ursache und Folge.','Greife wichtige Hinweise später wieder auf.','Streiche überraschende Zufallslösungen ohne Vorbereitung.'],
      tasks:[
        q('Welche Formulierung zeigt eine Ursache?',['Weil der Ball hinter den Schuppen gerollt war, suchten die beiden dort.','Minka war im Schuppen. Dann war sie fort.','Es geschah alles einfach.'],0,'„Weil“ zeigt den Grund für die Suche am Schuppen.','Welcher Satz beantwortet die Frage „Warum dort?“','1. Ball rollt hinter den Schuppen. 2. Suche führt dorthin. 3. Dort beginnt die Entdeckung.'),
        q('Am Anfang hören die Figuren ein Kratzen. Welche Auflösung passt?',['Niemand spricht jemals wieder vom Geräusch.','Ein Igel scharrte mit den Krallen unter dem Blumentopf.','Ohne Hinweis erscheint ein Ufo als Erklärung.'],1,'Der frühere Hinweis wird plausibel erklärt.','Die Ursache soll zum Geräusch vom Anfang passen.','1. Hinweis: Kratzen. 2. Igel ist gefangen. 3. Seine Krallen verursachen das Geräusch.'),
        q('Welche Reihenfolge bildet einen roten Faden?',['Fuji hilft → ein anderes Haus fliegt weg → Ball taucht magisch auf.','Igel frei → Ball rollt weg → unbekannter Hinweis.','Ball rollt weg → Suche am Schuppen → Kratzen → Igel finden → Igel befreien.'],2,'Jedes Ereignis entsteht aus dem vorherigen oder folgt sinnvoll daraus.','Kannst du zwischen je zwei Schritten ein „deshalb“ denken?','1. Ballsuche führt an den Ort. 2. Geräusch führt zur Entdeckung. 3. Entdeckung führt zur Rettung.')
      ],
      write:'Verbinde fünf Stichpunkte zu einer Handlung: Ball weg – Schuppen – Geräusch – Igel – Rettung. Verwende mindestens einen Ursache-Folge-Ausdruck.',
      model:'Weil Minkas Ball hinter den Schuppen gerollt war, suchte sie dort mit Fuji. Als sie ein Kratzen hörten, öffneten sie die Tür. Unter einem Topf steckte ein Igel. Gemeinsam befreiten sie ihn.',
      check:['Jede wichtige Handlung hat einen nachvollziehbaren Grund.','Ein Hinweis vom Anfang wird später aufgegriffen.','Die Lösung fällt nicht ohne Vorbereitung vom Himmel.']
    },
    {
      id:'perspektive',title:'Ich- und Er-/Sie-Perspektive',who:'Minka',image:'scene-2.webp',
      goal:'Die Erzählperspektive erkennen, durchhalten und fremdes Wissen nicht unbemerkt hineinmischen.',
      weak:'Ich ging zur Tür. Minka wusste nicht weiter. Dann sah ich meinen Schwanz.',strong:'Ich schlich zum Schuppen. Mein Herz klopfte, als ich ein Geräusch hörte.',
      why:'Die Ich-Perspektive bleibt konsequent bei der erlebenden Figur.',
      recipe:['Wähle Ich oder Er/Sie.','Prüfe die passenden Pronomen.','Schreibe Gedanken aus der gewählten Sicht.','Wechsle nur, wenn die Aufgabe das ausdrücklich vorsieht.'],
      tasks:[
        q('Welcher Satz ist in der Ich-Perspektive erzählt?',['Minka hörte ein Knacken.','Ich legte die Pfote auf die kalte Tür.','Fuji half Minka.'],1,'„Ich“ erzählt die Handlung selbst.','Wer spricht über sein eigenes Erlebnis?','1. Erzählerfigur handelt. 2. Pronomen „ich“. 3. Erzählperspektive bleibt bei ihr.'),
        q('Wie wird „Ich hielt den Atem an“ in der Er-/Sie-Perspektive über Minka erzählt?',['Minka hielt den Atem an.','Minka halte ich den Atem an.','Wir Minka hielten den Atem an.'],0,'Minka wird mit ihrem Namen und der passenden Verbform genannt.','Die Hauptfigur heißt jetzt Minka statt „ich“.','1. Ich wird zu Minka. 2. Verb im Präteritum bleibt: hielt. 3. Satz ist grammatisch vollständig.'),
        q('Er-/Sie-Erzählung nah an Minka: Was ist glaubwürdig?',['Minka wusste sicher, dass Fuji hinter dem Haus heimlich lachte, obwohl sie sie nicht sah.','Minka kannte bereits die Zukunft.','Minka fragte sich, ob Fuji sie gehört hatte. Sie konnte die andere Seite des Schuppens nicht sehen.'],2,'Die Erzählung bleibt bei Minkas möglichen Gedanken und Wahrnehmungen.','Welche Information kann Minka selbst wissen?','1. Sichtfigur ist Minka. 2. Fuji ist außer Sicht. 3. Minkas Vermutung ist möglich; sicheres Wissen wäre unpassend.')
      ],
      write:'Schreibe dieselbe kurze Schuppenszene einmal in der Ich-Perspektive (Minka), einmal aus der Er-/Sie-Perspektive.',
      model:'Ich-Erzählung: Ich hörte hinter der Tür ein Kratzen. Vorsichtig spähte ich durch den Spalt.\nEr-/Sie-Erzählung: Minka hörte hinter der Tür ein Kratzen. Vorsichtig spähte sie durch den Spalt.',
      check:['Ich bleibe innerhalb eines Abschnitts bei einer Perspektive.','Die Pronomen und Verbformen stimmen.','Gedanken passen zum Wissen der Perspektivfigur.']
    },
    {
      id:'zeitform',title:'Präteritum und Rückblick',who:'Fuji',image:'scene-1.webp',
      goal:'Schulische Erzählungen in der geforderten Zeitform schreiben und Vorzeitigkeit ausdrücken.',
      weak:'Minka ging zur Tür. Dann hört sie etwas und rannte los.',strong:'Minka ging zur Tür. Dann hörte sie etwas und rannte los.',
      why:'Alle Erzählverben stehen im Präteritum. Ein früheres Ereignis kann im Plusquamperfekt stehen.',
      recipe:['Prüfe die verlangte Zeitform der Aufgabe.','Nutze im Erzähltext meistens einheitlich das Präteritum.','Was vorher geschah, kannst du im Plusquamperfekt ausdrücken.','Wörtliche Rede darf die Zeitform wechseln.'],
      tasks:[
        q('Welche Version bleibt einheitlich im Präteritum?',['Minka hört und ging.','Minka hörte das Kratzen und blieb stehen.','Minka wird das Kratzen gehört haben.'],1,'„Hörte“ und „blieb“ stehen beide im Präteritum.','Prüfe die Verben im Erzähltext.','1. hören → hörte. 2. bleiben → blieb. 3. Beide passen zur vergangenen Erzählhandlung.'),
        q('Der Ball rollte schon vorher hinter den Schuppen. Wie lautet der passende Rückblick?',['Der Ball rollt hinter den Schuppen.','Der Ball wird rollen.','Der Ball war hinter den Schuppen gerollt.'],2,'Das Plusquamperfekt markiert ein Ereignis vor der aktuellen Erzählhandlung.','Denke an „war“ plus Partizip II.','1. Hauptgeschehen: Minka suchte. 2. Davor: Ball gerollt. 3. Plusquamperfekt: war gerollt.'),
        q('Welcher Text verbindet Rückblick und anschließende Handlung korrekt?',['Der Ball war weggerollt. Deshalb suchte Minka hinter dem Schuppen und hörte ein Kratzen.','Der Ball ist weggerollt. Deshalb suchte Minka und hört etwas.','Der Ball wird weggerollt sein und Minka sucht gestern.'],0,'Der frühere Vorgang steht im Plusquamperfekt, das anschließende Geschehen im Präteritum.','Trenne frühere Ursache und spätere Handlung.','1. Vorher: war weggerollt. 2. Danach: suchte. 3. Dann: hörte. Die Abfolge ist klar.')
      ],
      write:'Schreibe drei Sätze im Präteritum zur Suche und einen Satz als Rückblick mit Plusquamperfekt.',
      model:'Der Ball war hinter den Schuppen gerollt. Minka suchte dort nach ihm. Fuji schnupperte am Boden. Da hörten beide ein leises Kratzen.',
      check:['Ich halte die geforderte Zeitform ein.','Für früher Geschehenes nutze ich bei Bedarf das Plusquamperfekt.','Die wörtliche Rede darf natürlich klingen.']
    },
    {
      id:'rede',title:'Wörtliche Rede im Hauptteil',who:'Minka',image:'scene-5.webp',
      goal:'Gespräche gezielt für Entscheidung, Spannung und Gefühle einsetzen und korrekt kennzeichnen.',
      weak:'Minka sagte etwas. Fuji sagte auch etwas. Sie redeten.',strong:'„Vorsicht, der Topf rutscht!“, rief Minka. „Schieb den Klotz darunter!“, antwortete Fuji.',
      why:'Die Figuren handeln durch ihre Worte. Der Dialog treibt die Rettung voran.',
      recipe:['Spricht die Figur, um zu warnen, zu fragen oder zu entscheiden?','Wähle einen treffenden Begleitsatz.','Setze Anführungszeichen, Komma und Frage-/Ausrufezeichen korrekt.','Verwende Dialog gezielt, nicht nach jedem Erzählsatz.'],
      tasks:[
        q('Welcher Dialog bringt die Handlung voran?',['„Wie viele Wolken gibt es wohl?“, fragte Minka mitten in der Rettung.','„Der Topf kippt!“, warnte Fuji. „Ich halte ihn fest!“, rief Minka.','„Hallo“, sagte Fuji. „Hallo“, sagte Minka.'],1,'Warnung und Reaktion gehören direkt zur gefährlichen Situation.','Welches Gespräch hilft den Figuren bei ihrem Problem?','1. Fuji erkennt Gefahr. 2. Sie warnt. 3. Minka reagiert und handelt.'),
        q('Welche Schreibung der nachgestellten Rede ist korrekt?',['„Was war das?“, fragte Minka.','„Was war das.“ fragte Minka.','„Was war das“ fragte Minka?'],0,'Das Fragezeichen bleibt in der Rede; vor dem nachgestellten Begleitsatz steht ein Komma.','Bei einer Frage bleibt das Fragezeichen vor dem schließenden Anführungszeichen.','1. Rede beginnt mit „. 2. Frage endet mit ?. 3. Nach “ folgt ein Komma und „fragte Minka“.'),
        q('Welche Schreibung einer Aussage mit nachgestelltem Begleitsatz ist korrekt?',['„Ich helfe dir.“ sagte Fuji.','„Ich helfe dir“, Sagte Fuji.','„Ich helfe dir“, sagte Fuji.'],2,'Der Punkt der Aussage entfällt vor dem schließenden Anführungszeichen, danach folgt das Komma.','Aussagen mit folgendem Begleitsatz enden nicht mit Punkt innerhalb der Rede.','1. Gesprochene Aussage ohne Schluss-Punkt. 2. Schließendes “. 3. Komma, kleines „sagte“, Punkt am Satzende.')
      ],
      write:'Schreibe einen kurzen Dialog am Höhepunkt: Fuji warnt und Minka reagiert mit einer Handlung. Nutze korrekte Satzzeichen.',
      model:'„Der Topf rutscht!“, rief Fuji. Minka sprang nach vorne. „Ich halte ihn fest!“, antwortete sie und schob den Klotz darunter.',
      check:['Der Dialog passt zur Szene und hilft der Handlung.','Die Begleitsätze sind abwechslungsreich.','Anführungszeichen und Satzzeichen stimmen.']
    },
    {
      id:'schluss',title:'Ausklang und Rückbezug',who:'Fuji',image:'scene-6.webp',
      goal:'Nach dem Höhepunkt Folgen, Gefühle und den Bezug zum Anfang zeigen.',
      weak:'Der Igel war frei. Plötzlich erschien ein Drache. Es ging weiter.',strong:'Der Igel huschte ins Laub. Fuji atmete auf. Neben dem Schuppen lag auch Minkas Ball.',
      why:'Der Schluss klingt aus und greift die Ballsuche aus der Einleitung wieder auf.',
      recipe:['Zeige das Ergebnis des wichtigsten Problems.','Beschreibe eine passende Reaktion danach.','Greife bei Bedarf einen Hinweis vom Anfang auf.','Vermeide im geschlossenen Schluss ein völlig neues Abenteuer.'],
      tasks:[
        q('Welcher Satz gehört in einen ruhigen Schluss?',['Der Topf begann gerade erst zu rutschen.','Minka suchte erst nach dem Geräusch.','Erleichtert sahen beide dem freien Igel nach.'],2,'Die Gefahr ist vorbei, die Figuren reagieren.','Der Schluss setzt nach dem entscheidenden Moment ein.','1. Rettung ist erfolgt. 2. Erleichterung. 3. Die Spannung fällt ab.'),
        q('Welcher Rückbezug passt zur Einleitung mit der Ballsuche?',['Minka entdeckte ihren roten Ball neben dem Schuppen.','Ohne Hinweis erschien ein Zauberer.','Ein unbekannter Drache öffnete eine neue Geschichte.'],0,'Der Ball vom Anfang wird im Schluss wieder wichtig.','Was hatten die Figuren zu Beginn eigentlich gesucht?','1. Einleitung: Ball verloren. 2. Hauptteil: Igel gerettet. 3. Schluss: Ball wiedergefunden.'),
        q('Welche Aussage über das Ende ist korrekt?',['Jeder Schluss muss mit „Ende“ aufhören.','Ein offener Schluss ist möglich, wenn die Aufgabe es erlaubt; ein geschlossener Schluss rundet das zentrale Problem ab.','Jeder Schluss braucht zwingend ein neues Hindernis.'],1,'Nicht alle Geschichten enden gleich; entscheidend ist die Aufgabenstellung.','Muss eine Geschichte immer alles erklären?','1. Geschlossener Schluss: Hauptproblem gelöst. 2. Offener Schluss: bewusst ungeklärte Frage. 3. Vorgaben der Schulaufgabe beachten.')
      ],
      write:'Schreibe einen ruhigen Schluss mit Ergebnis, Gefühl und Rückbezug auf Minkas Ball. Höchstens vier Sätze.',
      model:'Der Igel krabbelte in den Laubhaufen. Minka und Fuji atmeten erleichtert auf. Neben der Schuppentür entdeckten sie endlich auch den roten Ball. Zufrieden gingen sie heim.',
      check:['Der Höhepunkt ist vorbei.','Ergebnis oder Folgen werden deutlich.','Der Schluss passt zur Einleitung und öffnet kein unpassendes neues Abenteuer.']
    },
    {
      id:'ueberarbeiten',title:'Überarbeiten und Klassenarbeit',who:'Minka',image:'scene-6.webp',
      goal:'Eine ganze Erzählung gezielt auf Inhalt, Aufbau, Sprache und Aufgabenbezug prüfen.',
      weak:'Minka war da. Dann passierte etwas. Es war toll.',strong:'Minka stand vor dem Gartenschuppen. Hinter der Tür kratzte etwas. Sie rief Fuji zu Hilfe.',
      why:'Figur, Ort und Ereignisse werden klar; die Handlung bleibt nachvollziehbar.',
      recipe:['Lies zuerst den Arbeitsauftrag: Bilder, Reizwörter, Zeitform und Perspektive.','Prüfe: Einleitung, Entwicklung, Höhepunkt, Schluss und roter Faden.','Verbessere Gefühle, Gedanken, sinnvolle Einzelheiten und genaue Verben.','Kontrolliere Zeitform, wörtliche Rede, Satzzeichen, Großschreibung und Überschrift.'],
      tasks:[
        q('Was solltest du vor einer Bildgeschichte zuerst tun?',['Die Bilder der Reihe nach ansehen und ihre Handlung planen.','Sofort eine beliebige andere Geschichte schreiben.','Die Bilder ignorieren und nur Adjektive sammeln.'],0,'Die Bildfolge bestimmt wichtige Ereignisse der Geschichte.','Welche Vorgaben enthält die Aufgabenstellung?','1. Bildfolge betrachten. 2. Ausgangsproblem und Höhepunkt erkennen. 3. Danach erzählen.'),
        q('Welche Überarbeitung verbessert den roten Faden?',['Minka suchte den Ball. Ein Schloss flog vorbei.','Weil der Ball hinter den Schuppen gerollt war, ging Minka dorthin und hörte ein Kratzen.','Minka war da. Es war irgendwie gut.'],1,'Die Ursache der Suche und der neue Hinweis hängen zusammen.','Warum gehen die Figuren zum Schuppen?','1. Ursache nennen. 2. Ortswechsel erklären. 3. Hinweis für den Hauptteil vorbereiten.'),
        q('Welche Prüffrage passt zur Endkontrolle einer Erzählung?',['Habe ich überall „plötzlich“ und viele Ausrufezeichen verwendet?','Habe ich jeden Satz mit „Dann“ begonnen?','Gibt es einen nachvollziehbaren Höhepunkt, passende Reaktionen und einen ausklingenden Schluss?'],2,'Aufbau und Handlung sind wichtiger als bloße Signalwörter.','Eine Erzählung braucht Aufbau und Zusammenhang.','1. Handlungskette prüfen. 2. Höhepunkt finden. 3. Gefühle und Gedanken gezielt einsetzen. 4. Schluss und Sprache kontrollieren.')
      ],
      write:'Überarbeite eine eigene Geschichte: markiere gedanklich Einleitung, Hauptteil, Höhepunkt und Schluss. Verbessere anschließend drei konkrete Stellen.',
      model:'Vorher: „Minka war da. Dann hörte sie etwas. Sie retteten ein Tier.“\nNachher: „Weil Minkas Ball verschwunden war, suchten sie und Fuji hinter dem Schuppen. Plötzlich kratzte es an der Tür. Ihr Herz pochte. Als der Topf zu rutschen drohte, schob Fuji einen Holzklotz darunter. Der Igel war frei.“',
      check:['Meine Erzählung erfüllt die Vorgaben der Aufgabe.','Handlung, Höhepunkt und Schluss passen zusammen.','Ich habe Sprache und Rechtschreibung überprüft.']
    }
  ];
  const el=id=>document.getElementById(id);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\u0027':'&#39;'}[c]));
  const KEY='minka-fuji-hauptteil-v1';
  const fresh=()=>({topic:0,level:0,answers:{},drafts:{},checks:{}});
  let state=fresh(),canStore=true;
  try {
    const saved=JSON.parse(localStorage.getItem(KEY)||'null');
    if(saved&&typeof saved==='object'&&Number.isInteger(saved.topic)&&saved.topic>=0&&saved.topic<lessons.length){
      state.topic=saved.topic;state.level=Number.isInteger(saved.level)&&saved.level>=0&&saved.level<=2?saved.level:0;
      state.answers=saved.answers&&typeof saved.answers==='object'?saved.answers:{};
      state.drafts=saved.drafts&&typeof saved.drafts==='object'?saved.drafts:{};
      state.checks=saved.checks&&typeof saved.checks==='object'?saved.checks:{};
    }
  }catch{canStore=false;}
  function save(){
    try{localStorage.setItem(KEY,JSON.stringify(state));canStore=true;}
    catch{canStore=false;}
    if(el('body-storage'))el('body-storage').textContent=canStore?'Übungsstand und Schreibtexte werden nur auf diesem Gerät gespeichert. Freie Texte werden nicht automatisch benotet.':'Speichern ist im Browser nicht verfügbar. Deine aktuelle Sitzung funktioniert weiterhin.';
  }
  const key=()=>lessons[state.topic].id+':'+state.level;
  const record=()=>state.answers[key()]||(state.answers[key()]={choice:null,tried:false,solved:false,hint:0,solution:false});
  function progress(){
    const total=lessons.length*3;
    const solved=lessons.reduce((n,l)=>n+[0,1,2].filter(i=>state.answers[l.id+':'+i]?.solved).length,0);
    el('body-progress').max=total;el('body-progress').value=solved;
    el('body-progress-text').textContent=solved+' von '+total+' Aufgaben richtig gelöst · '+lessons.length+' Themen mit je drei Schwierigkeitsstufen';
    el('body-storage').textContent=canStore?'Übungsstand und Schreibtexte werden nur auf diesem Gerät gespeichert. Freie Texte werden nicht automatisch benotet.':'Speichern ist im Browser nicht verfügbar. Deine aktuelle Sitzung funktioniert weiterhin.';
  }
  function renderMap(){
    el('body-map').innerHTML=lessons.map((l,i)=>{
      const n=[0,1,2].filter(k=>state.answers[l.id+':'+k]?.solved).length;
      return '<button type="button" class="body-topic'+(i===state.topic?' active':'')+'" data-body-topic="'+i+'" aria-pressed="'+(i===state.topic)+'"><span>'+String(i+1).padStart(2,'0')+' · '+esc(l.title)+'</span><small>'+n+'/3 Aufgaben</small></button>';
    }).join('');
    el('body-map').querySelectorAll('[data-body-topic]').forEach(b=>b.addEventListener('click',()=>{
      state.topic=Number(b.dataset.bodyTopic);state.level=0;save();render();el('body-current-title').focus({preventScroll:true});
    }));
  }
  function render(){
    renderMap();progress();
    const l=lessons[state.topic],t=l.tasks[state.level],r=record();
    el('body-current-title').textContent=l.title;
    el('body-intro').textContent=l.goal;
    el('body-art').src='assets/'+l.image;
    el('body-art').alt='Eine Szene mit Minka und Fuji zur Erzählgeschichte: '+l.title;
    el('body-coach').textContent=l.who+': „Ein guter Hauptteil zeigt nicht nur, was passiert, sondern auch, warum es für die Figuren wichtig ist.“';
    el('body-before').textContent=l.weak;
    el('body-after').textContent=l.strong;
    el('body-why').textContent=l.why;
    el('body-steps').innerHTML=l.recipe.map((s,i)=>'<li><strong>Schritt '+(i+1)+':</strong> '+esc(s)+'</li>').join('');
    el('body-levels').innerHTML=['1 · Entdecken','2 · Anwenden','3 · Knifflig'].map((s,i)=>'<button type="button" data-body-level="'+i+'" aria-pressed="'+(i===state.level)+'" class="'+(i===state.level?'active':'')+'">'+s+'</button>').join('');
    el('body-levels').querySelectorAll('[data-body-level]').forEach(b=>b.addEventListener('click',()=>{state.level=Number(b.dataset.bodyLevel);save();render();el('body-question').focus({preventScroll:true});}));
    el('body-question').textContent=t.text;
    el('body-options').innerHTML=t.options.map((s,i)=>'<button type="button" data-body-option="'+i+'" aria-pressed="'+(r.choice===i)+'" class="'+(r.choice===i?'active':'')+'">'+String.fromCharCode(65+i)+'. '+esc(s)+'</button>').join('');
    el('body-options').querySelectorAll('[data-body-option]').forEach(b=>b.addEventListener('click',()=>{if(r.solved)return;r.choice=Number(b.dataset.bodyOption);save();renderResponse();}));
    el('body-hint').onclick=()=>{r.hint=Math.min(2,r.hint+1);save();renderResponse();};
    el('body-check').onclick=()=>{if(r.choice===null||r.solved)return;r.tried=true;r.solved=r.choice===t.right;save();render();el('body-response').focus({preventScroll:true});};
    el('body-next').onclick=()=>{if(state.level<2){state.level++;}else{state.topic=(state.topic+1)%lessons.length;state.level=0;}save();render();el('body-current-title').focus({preventScroll:true});};
    el('body-reset-question').onclick=()=>{state.answers[key()]={choice:null,tried:false,solved:false,hint:0,solution:false};save();render();};
    el('body-solution-toggle').onclick=()=>{r.solution=!r.solution;save();renderResponse();};
    renderResponse();
    el('body-write-prompt').textContent=l.write;
    el('body-draft').value=String(state.drafts[l.id]||'').slice(0,12000);
    el('body-draft').oninput=e=>{state.drafts[l.id]=e.target.value.slice(0,12000);state.checks[l.id]=[];save();renderChecks();};
    el('body-model').textContent=l.model;
    el('body-checklist').innerHTML=l.check.map((s,i)=>'<label class="body-checkline"><input type="checkbox" data-body-check="'+i+'"> '+esc(s)+'</label>').join('');
    renderChecks();
    el('body-checklist').querySelectorAll('input').forEach(input=>input.onchange=()=>{
      const a=state.checks[l.id]||[];a[Number(input.dataset.bodyCheck)]=input.checked;state.checks[l.id]=a;save();renderChecks();
    });
  }
  function renderChecks(){
    const l=lessons[state.topic],checks=Array.isArray(state.checks[l.id])?state.checks[l.id]:[];
    el('body-checklist').querySelectorAll('input').forEach((c,i)=>c.checked=checks[i]===true);
    const ok=checks.filter(Boolean).length;
    el('body-write-feedback').textContent=ok+'/'+l.check.length+' selbst überprüft. Diese Häkchen sind deine eigene Kontrolle, keine automatische Textbewertung.';
  }
  function renderResponse(){
    const l=lessons[state.topic],t=l.tasks[state.level],r=record();
    el('body-options').querySelectorAll('[data-body-option]').forEach(b=>{
      const idx=Number(b.dataset.bodyOption);b.setAttribute('aria-pressed',String(r.choice===idx));b.classList.toggle('active',r.choice===idx);
      b.disabled=r.solved;
    });
    el('body-check').disabled=r.choice===null||r.solved;
    el('body-hint').disabled=r.solved||r.hint>=2;
    el('body-hint').textContent=r.hint===0?'Hinweis 1':r.hint===1?'Hinweis 2':'Beide Hinweise genutzt';
    el('body-hint-text').textContent=r.hint===0?'':r.hint===1?t.hint:'Fuji: Vergleiche alle drei Antworten. Welche passt zu den vier Schritten oberhalb? '+t.hint;
    let feedback='';
    if(r.tried&&r.solved)feedback='Richtig. '+t.why;
    else if(r.tried)feedback='Noch nicht richtig. Prüfe die Beispiele und nutze bei Bedarf die Hinweise. Deine Auswahl kannst du verändern und erneut prüfen.';
    el('body-response').textContent=feedback;
    el('body-response').classList.toggle('good',r.solved);
    el('body-solution-toggle').hidden=!r.tried;
    el('body-solution-toggle').textContent=r.solution?'Ausführliche Lösung schließen':'Ausführliche Lösung aufklappen';
    el('body-full-solution').hidden=!(r.tried&&r.solution);
    el('body-full-solution').textContent='Richtige Antwort: '+String.fromCharCode(65+t.right)+' – '+t.options[t.right]+'. '+t.steps;
    el('body-next').disabled=!r.solved&&!r.solution;
    el('body-next').textContent=state.level<2?'Weiter zur nächsten Stufe':'Weiter zum nächsten Thema';
    progress();
  }
  el('body-reset').addEventListener('click',()=>{
    if(!window.confirm('Alle Aufgabenstände und Schreibentwürfe dieser Hauptteil-Werkstatt auf diesem Gerät löschen?'))return;
    state=fresh();save();render();
  });
  document.addEventListener('learningpagechange',e=>{if(e.detail.id==='hauptteil')progress();});
  window.addEventListener('pagehide',save);
  render();
  if(location.hash==='#hauptteil')showPage('hauptteil',false);
})();

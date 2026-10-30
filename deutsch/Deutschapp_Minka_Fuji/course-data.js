'use strict';
// Lehrgangsinhalte sind von Bedienung und Darstellung getrennt.
window.MF_COURSE_DATA = (() => {
  const frame=(label,text,note)=>({label,text,note});
  const select=(prompt,options,answer,explain,hints)=>({type:'choice',prompt,options,answer,explain,hints});
  const gaps=(prompt,context,rows,explain,hints)=>({type:'gaps',prompt,context,rows,explain,hints});
  const arrange=(prompt,items,answer,explain,hints)=>({type:'arrange',prompt,items,answer,explain,hints});
  const row=(label,options,answer)=>({label,options,answer});
  const lessons=[
    {
      id:'orientierung',title:'Ein Anfang, der Orientierung gibt',short:'Den Anfang planen',coach:'Minka',image:'scene-1.webp',effect:'orientation',minutes:'5–7 Minuten',
      goal:'Du verbindest Figuren, Zeit, Ort und Ausgangssituation zu einer verständlichen Einleitung.',
      intro:'Stell dir vor, du öffnest ein Buch. Bevor das Abenteuer richtig beginnt, möchtest du wissen: Wer ist hier? Wo bin ich? Was tun die Figuren? Genau diese Orientierung gibst du deinen Lesern.',
      rule:'Wer? Wann? Wo? Was tun die Figuren am Anfang? Diese Informationen gehören in zusammenhängende Sätze. Die Lösung des Abenteuers bleibt offen.',
      frames:[
        frame('1 · Wer ist dabei?',[['Minka und Fuji','who'],[' waren unterwegs.','plain']],'Die getigerte Katze Minka und die graue Wolfshündin Fuji sind unsere Hauptfiguren.'),
        frame('2 · Wann und wo?',[['An einem Herbstnachmittag','when'],[' waren Minka und Fuji ','plain'],['im Garten','where'],[' unterwegs.','plain']],'Zeit und Ort machen die Szene vorstellbar. Ein genaues Datum brauchst du hier nicht.'),
        frame('3 · Was tun die beiden?',[['An einem Herbstnachmittag','when'],[' suchte ','plain'],['Minka mit Fuji','who'],[' ihren roten Ball ','what'],['im Garten','where'],['.','plain']],'Jetzt kennen wir die Ausgangssituation. Fuji hilft Minka; die Wolfshündin spielt selbst nicht gern Ball.'),
        frame('4 · So fließt der Anfang',[['An einem Herbstnachmittag suchte Minka mit Fuji ihren roten Ball im Garten.','what'],[' Er war beim Spielen neben den Schuppen gerollt.','plain']],'Aus Stichwörtern wird ein flüssiger Einstieg. Zwei Sätze geben hier schon genug Orientierung.')
      ],
      tasks:[
        gaps('Wir finden die vier Bausteine. Ordne die Angaben zu.','Am Freitagmorgen suchte Minka mit Fuji ihren roten Ball im Garten.',[
          row('Minka mit Fuji',['Wo?','Wer?','Wann?','Was tun sie?'],1),row('am Freitagmorgen',['Wer?','Wo?','Wann?','Was tun sie?'],2),row('im Garten',['Wo?','Was tun sie?','Wer?','Wann?'],0),row('den roten Ball suchen',['Wann?','Wer?','Wo?','Was tun sie?'],3)
        ],'Die Figuren beantworten „Wer?“, der Freitagmorgen „Wann?“, der Garten „Wo?“ und die Ballsuche beschreibt die Ausgangssituation.',['Frage bei jeder Angabe: Nennt sie eine Figur, eine Zeit, einen Ort oder eine Handlung?','„Freitagmorgen“ ist eine Zeitangabe. „Suchen“ beschreibt eine Handlung.']),
        select('Jetzt du: Welche Einleitung verbindet die Notizen sinnvoll? Minka und Fuji · See · früher Morgen · am Ufer spazieren.',[
          'Am frühen Morgen spazierten Minka und Fuji am Ufer des Sees entlang.',
          'Wer: Minka und Fuji. Wo: See. Es war toll.',
          'Zum Schluss gingen Minka und Fuji erleichtert nach Hause.'
        ],0,'Die erste Fassung verbindet alle Notizen zu einem vollständigen Satz über die Ausgangssituation. Die zweite bleibt bei Notizen; die dritte erzählt bereits einen Schluss.',['Gesucht ist ein vollständiger Satz über den Anfang der Handlung.','Ort, Zeitpunkt, Figuren und Anfangshandlung müssen zusammenpassen.'])
      ],
      transfer:'Schreibe eine eigene Einleitung in zwei Sätzen: Minka und Fuji sind an einem regnerischen Sonntag auf dem Dachboden. Sie untersuchen alte Kisten.',
      model:'An einem regnerischen Sonntag erkundeten Minka und Fuji den Dachboden. Gemeinsam schauten sie sich die alten Kisten neben der Treppe an.',
      takeaway:'Ich gebe Orientierung und verbinde meine Notizen zu Sätzen.'
    },
    {
      id:'schlinge',title:'Eine Schlinge für die Neugier',short:'Neugier wecken',coach:'Fuji',image:'scene-2.webp',effect:'clue',minutes:'5–7 Minuten',
      goal:'Du setzt einen konkreten Hinweis, lässt eine Frage offen und planst die spätere Auflösung.',
      intro:'Mit „Schlinge“ meinen wir einen erzählerischen Köder: Du fängst die Aufmerksamkeit deiner Leser ein. Sie sollen wissen wollen, was hinter einem merkwürdigen Hinweis steckt.',
      rule:'Orientierung + auffälliger Hinweis + offene Frage. Die Frage muss nicht ausdrücklich als Fragesatz dastehen. Greife den Hinweis später wieder auf.',
      frames:[
        frame('1 · Der ruhige Anfang',[['Minka und Fuji suchten im Garten nach dem Ball.','plain']],'Die Ausgangssituation ist klar. Aber noch gibt es keinen Grund, unbedingt weiterzulesen.'),
        frame('2 · Ein Hinweis taucht auf',[['Minka und Fuji suchten im Garten nach dem Ball. ','plain'],['Hinter der Schuppentür kratzte etwas.','clue']],'Das Kratzen ist konkret und hörbar. Es weckt die Frage: Was ist dort drin?'),
        frame('3 · Die Antwort bleibt offen',[['Kratz. Kratz. ','clue'],['Minka hielt inne. Wer mochte hinter der Tür sein?','question']],'Die Leser wissen noch nicht, woher das Geräusch kommt. „Es war spannend“ allein könnte diese Neugier nicht auslösen.'),
        frame('4 · Später den Faden aufnehmen',[['Später im Hauptteil: ','plain'],['Unter dem Topf steckte ein Igel. Seine Krallen scharrten über das Holz.','answer']],'Jetzt wird der Hinweis erklärt. Die beiden helfen dem Igel. Die Auflösung gehört später in die Geschichte, nicht schon in ihre Einleitung.')
      ],
      tasks:[
        select('Gemeinsam: Minka und Fuji sind am See. Welcher Satz legt eine passende Schlinge?',[
          'Es war wirklich sehr, sehr aufregend.',
          'Unter dem Steg klopfte etwas gegen das Holz.',
          'Sie wussten sofort, dass ein loser Ast gegen den Steg schlug.'
        ],1,'Das Klopfen weckt eine offene Frage. Die erste Antwort behauptet nur Spannung. Die dritte verrät bereits die Ursache.',['Suche etwas, das Minka und Fuji wahrnehmen können.','Ein Geräusch kann eine Frage wecken, solange seine Ursache offenbleibt.']),
        select('Jetzt du: In der Einleitung findet Fuji eine nasse Spur im trockenen Schuppen. Welche Fortsetzung löst diese Schlinge nachvollziehbar auf?',[
          'Minka entdeckte einen undichten Eimer. Von dort zog sich die Wasserspur bis zur Tür.',
          'Die Spur spielte keine Rolle mehr. Plötzlich begann eine andere Geschichte.',
          'Niemand fragte mehr nach der Spur, und alles war einfach vorbei.'
        ],0,'Der undichte Eimer erklärt die nasse Spur. So hängt der Anfang mit der späteren Handlung zusammen. Eine bewusst offene Geschichte wäre möglich; in dieser Übung sollst du den Hinweis aber auflösen.',['Die Fortsetzung muss zur nassen Spur passen.','Frage dich: Woher könnte das Wasser gekommen sein?'])
      ],
      transfer:'Ergänze deine Dachboden-Einleitung um einen auffälligen Hinweis. Notiere getrennt davon eine mögliche spätere Auflösung.',
      model:'Zwischen den Kisten blinkte ein winziges grünes Licht. Fuji blieb stehen. Wer hatte dort etwas eingeschaltet?\nPlan für später: Das Licht gehört zu einem alten, noch eingeschalteten Spielzeug. Minka findet es unter einer Decke.',
      takeaway:'Ich wecke eine Frage und greife meinen Hinweis später wieder auf.'
    },
    {
      id:'bewegung',title:'Wörter setzen Pfoten in Bewegung',short:'Genau bewegen',coach:'Minka',image:'scene-1.webp',effect:'movement',minutes:'5–6 Minuten',
      goal:'Du ersetzt allgemeine Bewegungsverben durch Wörter, die zur Art und zum Tempo der Bewegung passen.',
      intro:'„Minka ging zur Tür“ lässt vieles offen. Schleicht sie, hastet sie oder stolpert sie? Mit einem passenden Verb entsteht im Kopf der Leser eine sichtbare Bewegung.',
      rule:'Wähle nach der Szene, nicht nach der Länge des Wortes. Erzähle im Präteritum: schleichen → schlich, rennen → rannte, trotten → trottete.',
      frames:[
        frame('1 · Noch ungenau',[['Minka ','plain'],['ging','old'],[' zum Schuppen.','plain']],'„Ging“ sagt wenig über ihre Bewegung. Es ist nicht falsch, aber hier können wir genauer werden.'),
        frame('2 · Leise und vorsichtig',[['Minka ','plain'],['schlich','motion'],[' zum Schuppen.','plain']],'Schleichen ist leise und vorsichtig. Beobachte das langsame Pfotensignal unter dem Bild.'),
        frame('3 · Eilig und unruhig',[['Minka ','plain'],['hastete','motion'],[' zum Schuppen.','plain']],'Hasten bedeutet, sich eilig zu bewegen. Jetzt ist das Pfotensignal schneller. Der Sinn des Satzes verändert sich.'),
        frame('4 · Zwei unterschiedliche Bewegungen',[['Minka schlich zur Tür. ','motion'],['Fuji trottete hinter ihr her.','what']],'Minka bewegt sich leise; Fuji geht gemächlich und gleichmäßig. Beide Verben passen zur jeweils gemeinten Bewegung.')
      ],
      tasks:[
        gaps('Gemeinsam: Ergänze die Verben so, dass die Bewegung zu den Angaben passt.','Minka wollte niemanden wecken. Fuji hatte es nicht eilig.',[
          row('Leise und vorsichtig … Minka zur Tür.',['polterte','schlich','stapfte'],1),
          row('Gemächlich … Fuji hinter ihr her.',['trottete','stürmte','raste'],0)
        ],'„Schlich“ macht die leise Bewegung deutlich. „Trottete“ passt zum gleichmäßigen, gemächlichen Schritt. Die anderen Wörter würden eine lautere oder schnellere Bewegung erzählen.',['Markiere die Angaben „leise“ und „nicht eilig“.','Schleichen ist leise. Trotten ist gemächlich.']),
        gaps('Jetzt du: Wähle für zwei neue Situationen passende Verben im Präteritum.','Minka gerät beim Laufen aus dem Tritt. Fuji geht mit schweren Schritten durch tiefen Schnee.',[
          row('Über eine Wurzel … Minka.',['schwebte','schlenderte','stolperte'],2),
          row('Durch den tiefen Schnee … Fuji.',['stapfte','flog','blinzelte'],0)
        ],'Stolpern bedeutet, aus dem Tritt zu geraten. Stapfen beschreibt schwere, deutliche Schritte. Beide ausgewählten Formen stehen im Präteritum.',['Überlege zuerst, welche Bewegung tatsächlich stattfindet.','„Stolpern“ passt zur Wurzel. „Stapfen“ passt zu schweren Schritten.'])
      ],
      transfer:'Beschreibe in zwei Sätzen, wie Minka und Fuji sich unterschiedlich einer geheimnisvollen Kiste nähern. Nutze zwei passende Bewegungsverben.',
      model:'Minka schlich zwischen den Kisten hindurch. Fuji trottete hinter ihr her und blieb vor der grünen Decke stehen.',
      takeaway:'Mein Verb zeigt, wie sich eine Figur bewegt.'
    },
    {
      id:'blicke',title:'Nicht jeder Blick ist gleich',short:'Genau hinsehen',coach:'Fuji',image:'scene-3.webp',effect:'look',minutes:'4–6 Minuten',
      goal:'Du unterscheidest suchendes Schauen, genaues Prüfen und längeres Beobachten.',
      intro:'Leser sollen nicht nur erfahren, dass Minka etwas sieht. Sie können miterleben, wie sie etwas zu erkennen versucht. Dafür brauchen wir genaue Wahrnehmungsverben.',
      rule:'Spähen = suchend und aufmerksam schauen. Mustern = genau und prüfend ansehen. Beobachten = einen Vorgang eine Weile aufmerksam verfolgen.',
      frames:[
        frame('1 · Ein allgemeines Verb',[['Minka ','plain'],['sah','old'],[' durch den Türspalt.','plain']],'Sie nimmt etwas mit den Augen wahr. Aber mit welcher Absicht schaut sie?'),
        frame('2 · Suchend schauen',[['Minka ','plain'],['spähte','look'],[' durch den Türspalt.','plain']],'Sie versucht, im dunklen Schuppen etwas zu erkennen. „Spähte“ macht das suchende Schauen deutlich.'),
        frame('3 · Einen Fund prüfen',[['Fuji ','plain'],['musterte','look'],[' den zerkratzten Schlüssel.','plain']],'Jetzt wird ein Gegenstand genau geprüft. „Musterte“ passt zu diesem prüfenden Blick.'),
        frame('4 · Einen Vorgang verfolgen',[['Minka ','plain'],['beobachtete','look'],[', wie der Igel unter die Hecke kroch.','plain']],'Das Beobachten dauert eine Weile. Minka verfolgt die Bewegung des Igels aufmerksam.')
      ],
      tasks:[
        gaps('Gemeinsam: Welches Verb passt zur Absicht der Figur?','Minka versucht, durch eine Öffnung etwas zu erkennen. Fuji prüft den Fund genau.',[
          row('Durch den schmalen Spalt … Minka.',['spähte','übersah','schlief'],0),
          row('Den Schlüssel … Fuji prüfend.',['überhörte','vergaß','musterte'],2)
        ],'Durch den Spalt schaut Minka suchend: Sie späht. Fuji sieht den Schlüssel genau an: Sie mustert ihn. „Übersehen“ würde hier bedeuten, etwas nicht zu bemerken.',['Suche für jede Figur ihre Absicht.','Suchend schauen → spähen. Prüfend ansehen → mustern.']),
        select('Jetzt du: Welche Fassung zeigt ein längeres, aufmerksames Verfolgen?',[
          'Minka übersah den Igel.',
          'Minka beobachtete, wie der Igel langsam zum Laubhaufen kroch.',
          'Minka erblickte den Igel zum ersten Mal.'
        ],1,'„Beobachtete“ zeigt das Verfolgen eines Vorgangs. „Erblickte“ betont das Bemerken, „übersah“ bedeutet hier gerade, den Igel nicht zu bemerken.',['Gesucht ist ein Blick, der eine Handlung begleitet.','Ein Vorgang dauert: Der Igel kriecht langsam zum Laubhaufen.'])
      ],
      transfer:'Minka und Fuji untersuchen das grüne Licht auf dem Dachboden. Beschreibe einen suchenden und einen prüfenden Blick.',
      model:'Minka spähte unter die Decke. Fuji musterte die kleinen Schalter an dem alten Spielzeug.',
      takeaway:'Ich wähle mein Wahrnehmungsverb nach der Absicht und Dauer des Blicks.'
    },
    {
      id:'stimmen',title:'So klingt die Stimme deiner Figuren',short:'Passend sprechen',coach:'Minka',image:'scene-2.webp',effect:'voice',minutes:'5–6 Minuten',
      goal:'Du wählst Redeverben, die Lautstärke oder Absicht einer Äußerung deutlich machen.',
      intro:'Ein Dialog verrät mehr als Informationen. Minka kann flüstern, Fuji kann erklären oder warnen. Das Redeverb muss aber zu dem passen, was die Figur wirklich sagen will.',
      rule:'Fragen will etwas wissen. Warnen macht auf eine Gefahr aufmerksam. Flüstern beschreibt eine sehr leise Stimme. „Sagen“ darf als neutrales Verb bleiben.',
      frames:[
        frame('1 · Zwei neutrale Begleitsätze',[['„Hörst du das?“, ','plain'],['sagte','old'],[' Minka. „Sei leise!“, ','plain'],['sagte','old'],[' Fuji.','plain']],'Die Rede ist verständlich. Die Begleitsätze können Absicht und Lautstärke aber noch genauer zeigen.'),
        frame('2 · Eine Frage',[['„Hörst du das?“, ','plain'],['fragte','voice'],[' Minka.','plain']],'Minka möchte etwas wissen. Deshalb ist „fragte“ ein treffendes Verb.'),
        frame('3 · Eine leise Stimme',[['„Sei leise!“, ','plain'],['flüsterte','voice'],[' Fuji.','plain']],'Fuji spricht sehr leise. „Flüsterte leise“ ist oft unnötig doppelt.'),
        frame('4 · Die Absicht entscheidet',[['„Vorsicht, der Topf rutscht!“, ','plain'],['warnte','voice'],[' Minka.','plain']],'Minka macht auf eine Gefahr aufmerksam. Ein „jubelte“ würde hier eine ganz andere, unpassende Stimmung erfinden.')
      ],
      tasks:[
        gaps('Gemeinsam: Ordne jedem Satz das passende Redeverb zu.','Achte auf Inhalt und Lautstärke.',[
          row('„Wo liegt der Ball?“, … Minka.',['fragte','bedankte sich','erklärte'],0),
          row('„Psst, der Igel schläft“, … Fuji kaum hörbar.',['brüllte','flüsterte','jubelte'],1),
          row('„Vorsicht, das Brett bricht!“, … Minka.',['begrüßte','jubelte','warnte'],2)
        ],'Die Frage sucht eine Information. Die kaum hörbare Stimme passt zu „flüsterte“. Der Hinweis auf ein brechendes Brett ist eine Warnung.',['Was will die Figur erreichen: etwas wissen, leise bleiben oder auf Gefahr hinweisen?','Frage → fragte. Sehr leise Stimme → flüsterte. Gefahr → warnte.']),
        select('Jetzt du: Fuji sagt ruhig, ohne besondere Stimmung: „Ich bleibe hier.“ Welche Fassung passt?',[
          '„Ich bleibe hier“, brüllte Fuji zornig.',
          '„Ich bleibe hier“, jubelte Fuji begeistert.',
          '„Ich bleibe hier“, sagte Fuji.'
        ],2,'„Sagte“ passt zur neutralen Äußerung. Abwechslung ist sinnvoll, wenn sie den gemeinten Sinn erhält. Zorn und Begeisterung sind hier nicht vorgegeben.',['Erfinde keine Stimmung, die nicht in der Szene steckt.','Ein neutrales Redeverb ist manchmal genau das richtige.'])
      ],
      transfer:'Schreibe einen Dialog aus drei Äußerungen. Minka fragt nach dem grünen Licht, Fuji erklärt ihre Vermutung und Minka bittet leise um Geduld.',
      model:'„Was blinkt denn dort?“, fragte Minka.\n„Vielleicht ist es ein Spielzeug“, erklärte Fuji.\n„Warte kurz“, flüsterte Minka.',
      takeaway:'Mein Redeverb passt zur Absicht und zur Stimme meiner Figur.'
    },
    {
      id:'anfaenge',title:'Sätze bekommen einen eigenen Rhythmus',short:'Satzanfänge variieren',coach:'Fuji',image:'scene-4.webp',effect:'order',minutes:'6–8 Minuten',
      goal:'Du beginnst Sätze unterschiedlich und achtest dabei auf Wortstellung und Kommas.',
      intro:'„Dann … Dann … Dann …“ kann einen Text eintönig machen. Du kannst mit einer Zeit, einem Ort, einem Gefühl oder einem Nebensatz beginnen. Der Ablauf deiner Handlung soll dabei klar bleiben.',
      rule:'Im Aussagesatz steht das gebeugte Verb an zweiter Satzgliedstelle: „Vorsichtig öffnete Fuji die Tür.“ Nach einem vorangestellten Nebensatz steht ein Komma; dann folgt das Verb des Hauptsatzes.',
      frames:[
        frame('1 · Ein Anfang wiederholt sich',[['Dann','old'],[' ging Minka zur Tür. ','plain'],['Dann','old'],[' hörte sie ein Kratzen. ','plain'],['Dann','old'],[' blieb Fuji stehen.','plain']],'Die Reihenfolge ist klar, aber die Anfänge wiederholen sich auffällig.'),
        frame('2 · Ort und Reaktion',[['Vor der Tür','where'],[' hörte Minka ein Kratzen. ','plain'],['Sofort','motion'],[' blieb Fuji stehen.','plain']],'Ort und Reaktion verbinden die Sätze mit der Szene. Du brauchst nicht vor jedem Ereignis „Dann“.'),
        frame('3 · Das Verb bleibt an seinem Platz',[['Vorsichtig','motion'],[' öffnete','verb'],[' Fuji die Tür.','plain']],'„Vorsichtig“ ist das erste Satzglied. „Öffnete“ ist das zweite Satzglied. „Vorsichtig Fuji öffnete …“ wäre hier falsch.'),
        frame('4 · Mit einem Nebensatz beginnen',[['Als Minka näher kam','when'],[',','punct'],[' hielt','verb'],[' Fuji den Topf fest.','plain']],'Der Als-Satz ist abgeschlossen. Das Komma trennt ihn vom Hauptsatz. Danach folgt das gebeugte Verb „hielt“.')
      ],
      tasks:[
        arrange('Gemeinsam: Beginne mit „Vorsichtig“. Tippe die Bausteine in der richtigen Reihenfolge an.',['Fuji','die Tür.','Vorsichtig','öffnete'],[2,3,0,1],'Nach „Vorsichtig“ folgt das gebeugte Verb „öffnete“. Danach nennen wir Fuji und das Objekt „die Tür“.',['Beginne mit der Angabe „Vorsichtig“.','Direkt danach brauchst du „öffnete“.']),
        arrange('Jetzt du: Stelle den Als-Satz an den Anfang und baue den vollständigen Satz. Das Komma gehört bereits zum Nebensatz.',['Fuji','den Topf fest.','Als Minka näher kam,','hielt'],[2,3,0,1],'Der vorangestellte Nebensatz endet mit einem Komma. Danach folgt im Hauptsatz zuerst „hielt“, dann „Fuji den Topf fest“.',['Der vollständige Als-Satz ist der erste Baustein.','Nach dem Komma folgt das gebeugte Verb „hielt“.'])
      ],
      transfer:'Schreibe drei Sätze über Minka und Fuji am Dachbodenfenster. Beginne einmal mit einem Ort, einmal mit einem Gefühl und einmal mit einem Als-Satz.',
      model:'Neben dem Fenster stand eine kleine Holzkiste. Neugierig hob Minka den Deckel an. Als Fuji näher kam, glitzerte etwas zwischen den Tüchern.',
      takeaway:'Ich variiere den Anfang und prüfe danach Verbposition und Kommas.'
    },
    {
      id:'sinne',title:'Wörter, die man fast spüren kann',short:'Mit Adjektiven zeigen',coach:'Minka',image:'scene-4.webp',effect:'senses',minutes:'5–7 Minuten',
      goal:'Du wählst wenige treffende Adjektive und machst damit Sinneseindrücke anschaulich.',
      intro:'„Eine komische Tür und ein komisches Geräusch“ ist noch schwer vorstellbar. Wie fühlt sich das Holz an? Wie klingt das Geräusch? Genau diese Einzelheiten lassen eine Szene lebendig werden.',
      rule:'Wähle Eigenschaften, die für deine Szene wichtig sind. Passe die Endungen an: das raue Holz, auf dem rauen Holz. Viele allgemeine Adjektive ersetzen keine genaue Beobachtung.',
      frames:[
        frame('1 · Noch wenig zu erkennen',[['Vor Minka lag eine ','plain'],['komische','old'],[' Tür. Dahinter war ein ','plain'],['komisches','old'],[' Geräusch.','plain']],'„Komisch“ bewertet, beschreibt aber kaum eine konkrete Eigenschaft.'),
        frame('2 · Die Oberfläche fühlen',[['Minka legte ihre Pfote auf das ','plain'],['raue','sense'],[' Holz.','plain']],'„Rau“ beschreibt eine Oberfläche, die man fühlen kann. Die Endung passt zu „das Holz“.'),
        frame('3 · Den Klang hören',[['Hinter der Tür ertönte ein ','plain'],['dumpfes','sense'],[' Klopfen.','plain']],'„Dumpf“ beschreibt einen tiefen, gedämpften Klang. Die Leser können ihn sich vorstellen.'),
        frame('4 · Wenige passende Einzelheiten',[['Durch die ','plain'],['verwitterte','sense'],[' Tür drang ein ','plain'],['modriger','sense'],[' Geruch. Fuji lauschte auf das ','plain'],['leise','sense'],[' Scharren.','plain']],'Die Eigenschaften passen zu einem alten Schuppen. Jede trägt etwas zur Szene bei. Eine lange Adjektivliste wäre weniger hilfreich.')
      ],
      tasks:[
        gaps('Gemeinsam: Wähle die Adjektive passend zum Sinneseindruck.','Du beschreibst die Oberfläche des Holzes, den Klang und den Geruch im Schuppen.',[
          row('Die Pfote spürt die … Oberfläche.',['schrille','raue','silbrige'],1),
          row('Fuji hört ein … Klopfen.',['klebriges','eckiges','dumpfes'],2),
          row('Im Schuppen hängt ein … Geruch.',['modriger','blauer','spitzer'],0)
        ],'„Rau“ gehört zum Fühlen, „dumpf“ zum Hören und „modrig“ zum Riechen. Die Adjektivendungen passen jeweils zu ihrem Nomen.',['Denke für jede Lücke an den passenden Sinn.','Fühlen: rau. Hören: dumpf. Riechen: modrig.']),
        select('Jetzt du: Welche Fassung nennt eine wichtige Eigenschaft statt vieler allgemeiner Wertungen?',[
          'Das tolle, schöne, besondere und interessante Brett lag vor Minka.',
          'Das sehr komische Brett war wirklich sehr komisch.',
          'Das morsche Brett gab unter Minkas Pfoten nach.'
        ],2,'„Morsch“ erklärt den schlechten Zustand des Holzes. Die Handlung zeigt seine Folge. Die anderen Fassungen enthalten viele Wertungen, aber kaum konkrete Information.',['Welche Eigenschaft hilft, das Ereignis zu verstehen?','Der Zustand des Brettes erklärt, warum es nachgibt.'])
      ],
      transfer:'Beschreibe den Dachboden in drei Sätzen. Nutze je eine passende Eigenschaft zum Sehen, Fühlen und Riechen.',
      model:'Auf der Kiste lag ein verblichenes Tuch. Minka strich mit der Pfote über das raue Holz. In der Ecke hing ein muffiger Geruch.',
      takeaway:'Wenige konkrete Adjektive machen eine Szene anschaulich.'
    },
    {
      id:'dialog',title:'Wörtliche Rede bekommt ihre Zeichen',short:'Dialoge schreiben',coach:'Fuji',image:'scene-5.webp',effect:'talk',minutes:'7–9 Minuten',
      goal:'Du setzt Redezeichen, Doppelpunkt und Komma bei vorangestellten und nachgestellten Begleitsätzen richtig.',
      intro:'In unseren erfundenen Tiergeschichten können Minka und Fuji sprechen. Redezeichen zeigen, welche Wörter genau gesprochen werden. Der Begleitsatz sagt, wer spricht und wie.',
      rule:'Davor: Minka fragte: „Hörst du das?“ Danach: „Hörst du das?“, fragte Minka. Das Fragezeichen bleibt in der Rede; das Komma steht danach. Bei einer Aussage entfällt der Punkt vor dem nachgestellten Begleitsatz.',
      frames:[
        frame('1 · Wer spricht?',[['Minka fragte','voice'],[' Hörst du das','old']],'Noch fehlen die Zeichen, die Begleitsatz und gesprochene Wörter voneinander trennen.'),
        frame('2 · Der Begleitsatz steht davor',[['Minka fragte','voice'],[': „','punct'],['Hörst du das','plain'],['?“','punct']],'Nach dem Begleitsatz steht ein Doppelpunkt. Die Frage steht in Anführungszeichen; das Fragezeichen gehört hinein.'),
        frame('3 · Der Begleitsatz steht danach',[['„','punct'],['Hörst du das','plain'],['?“,','punct'],[' fragte Minka.','voice']],'Das Fragezeichen bleibt vor dem schließenden Redezeichen. Das Komma folgt danach. „Fragte“ wird kleingeschrieben.'),
        frame('4 · Eine Aussage und eine Unterbrechung',[['„Ich sehe nach“, sagte Fuji.','voice'],['\n„Hinter der Tür“, flüsterte Minka, „raschelt etwas.“','punct']],'Bei der Aussage entfällt der Punkt vor dem Begleitsatz. Beim eingeschobenen Begleitsatz brauchst du zwei Kommas. „Raschelt“ setzt denselben gesprochenen Satz fort und beginnt klein.')
      ],
      tasks:[
        gaps('Gemeinsam: Setze die Zeichen bei einem Begleitsatz vor der Rede.','Minka fragte […] […] Hörst du das […] […]',[
          row('Nach „Minka fragte“',[':',',','.'],0),row('Vor „Hörst“',['“','„'],1),row('Nach „das“',['.','!','?'],2),row('Ganz am Ende',['„','“'],1)
        ],'Richtig zusammengesetzt: Minka fragte: „Hörst du das?“ Der Doppelpunkt folgt dem Begleitsatz, das Fragezeichen steht innerhalb der Anführungszeichen.',['Begleitsatz davor: Doppelpunkt, dann die Redezeichen.','Die Frage endet mit einem Fragezeichen und dem schließenden Anführungszeichen.']),
        arrange('Jetzt du: Baue die Frage mit einem nachgestellten Begleitsatz. Tippe auch die Satzzeichen in der richtigen Reihenfolge an.',['fragte Minka.','?','„','Hörst du das','“',','],[2,3,1,4,5,0],'So stimmt es: „Hörst du das?“, fragte Minka. Fragezeichen und schließendes Redezeichen gehören vor das Komma. Der Begleitsatz folgt danach.',['Beginne mit dem öffnenden Redezeichen und den gesprochenen Wörtern.','Nach „das“ folgen ? dann “ dann , und zuletzt der Begleitsatz.'])
      ],
      transfer:'Schreibe zwei Äußerungen zum Dachbodenfund: einmal mit dem Begleitsatz davor, einmal danach. Probiere danach freiwillig einen eingeschobenen Begleitsatz aus.',
      model:'Minka fragte: „Wem gehört dieses Spielzeug?“\n„Das finden wir heraus“, antwortete Fuji.\nZusatz: „Unter der Decke“, erklärte Fuji, „blinkt eine kleine Lampe.“',
      takeaway:'Ich unterscheide die Stellung des Begleitsatzes und prüfe jedes Satzzeichen.'
    }
  ];
  return Object.freeze({lessons,finalTitle:'Deine eigene Geschichte',
    finalChecks:[
      'Meine Einleitung stellt Figuren, Ort, Zeit und Ausgangssituation verständlich vor.',
      'Ein konkreter Hinweis macht neugierig. Seine Ursache wird erst später erklärt.',
      'Mein Hauptteil entwickelt die Handlung: Hindernisse, Ursache und Wirkung, Gedanken, Gefühle und ein Höhepunkt. Der Schluss rundet sie ab.',
      'Bewegungs-, Wahrnehmungs- und Redeverben passen zur Szene.',
      'Meine Satzanfänge sind abwechslungsreich; die Wortstellung stimmt.',
      'Wenige treffende Adjektive und ausgewählte Sinneseindrücke machen wichtige Einzelheiten anschaulich.',
      'Meine wörtliche Rede hat passende Begleitsätze und Satzzeichen.',
      'Zeitform und Erzählperspektive passen; ich habe meinen Text laut gelesen.'
    ],
    finalModel:'Das Kratzen im Schuppen\n\nAn einem windigen Herbstnachmittag suchte Minka mit Fuji ihren roten Ball im Garten. Neben dem alten Schuppen blieb die getigerte Katze stehen. Hinter der verwitterten Tür kratzte etwas.\n\nVorsichtig schlich Minka näher. „Hast du das gehört?“, flüsterte sie. Fuji lauschte und schob die Tür mit der Nase auf. Durch den schmalen Spalt spähte Minka ins Dunkel. Unter einem umgedrehten Blumentopf scharrten winzige Krallen über den Boden.\n\n„Da steckt ein Igel fest!“, rief Minka. Als Fuji den Topfrand anhob, schob Minka einen Holzklotz darunter. Minka hielt den Atem an. Was, wenn der Topf erneut abrutschte? Fuji stemmte ihre Pfote fester dagegen. Dann kroch der Igel durch die Lücke.\n\nErleichtert sahen sie ihm nach. Wenig später fand Minka auch ihren Ball. Fuji legte sich zufrieden unter den Apfelbaum.'
  });
})();

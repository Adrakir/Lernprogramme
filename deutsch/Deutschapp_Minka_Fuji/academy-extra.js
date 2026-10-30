'use strict';
/* Ergänzende Prüfungsvarianten: 20 statt 8, ohne die vorhandenen acht zu verändern. */
(()=>{
const D=window.MF_STUDIO_DATA;if(!D||!Array.isArray(D.exams))return;
const e=(id,kind,title,level,minutes,words,panels,task,guide,help)=>({id,kind,title,level,minutes,words,panels,task,guide,help});
const additional=[
e('reiz-sturm','Reizwortgeschichte','Das unerwartete Unwetter','grundlegend',40,['Schulweg','Wind','Regenschirm','Hilfe'],[],
 'Verfasse eine spannende Erzählung, in der alle Reizwörter eine sinnvolle Rolle spielen. Beschreibe, was die Hauptfigur denkt, als das Wetter umschlägt.',
 ['Einleitung: Auf dem Schulweg gerät die Figur in eine alltägliche Ausgangssituation.','Hauptteil: Der Wind nimmt zu. Der Schirm verursacht eine Schwierigkeit, durch die jemand Hilfe braucht.','Höhepunkt: Die Figur reagiert auf die Gefahr mit einer konkreten, nachvollziehbaren Handlung.','Schluss: Hilfe ist gefunden, und die Figuren berichten oder zeigen, wie sie sich fühlen.'],
 ['Wer ist auf dem Schulweg?','Was passiert mit dem Regenschirm?','Welche Handlung zeigt, dass jemand hilft?']),
e('bild-drachen','Bildergeschichte','Der Drachen auf dem Dach','grundlegend',40,[],[['🪁','Auf der Wiese','Zwei Kinder lassen einen Drachen steigen.'],['💨','Eine Böe','Der Wind wird stärker.'],['🏠','Auf dem Dach','Der Drachen bleibt am Dach hängen.'],['🪜','Ein Plan','Die Kinder überlegen, wen sie um Hilfe bitten können.']],
 'Schreibe aus den vier Bildern eine glaubwürdige Geschichte. Zeige im Hauptteil eine Schwierigkeit und eine sichere Lösung; die Figuren dürfen nicht leichtsinnig auf das Dach steigen.',
 ['Einleitung: Die Kinder spielen mit dem Drachen auf einer Wiese.','Hauptteil: Der Wind löst das Problem aus; der Drachen bleibt unerreichbar hängen.','Höhepunkt: Die Kinder entscheiden, wie sie auf sichere Weise Erwachsene um Hilfe bitten.','Schluss: Der Drachen wird sicher zurückgeholt oder bleibt bis zur Hilfe liegen.'],
 ['Wo spielen die Kinder?','Warum wird aus dem Spiel ein Problem?','Welche sichere Entscheidung treffen sie?']),
e('reiz-fest','Reizwortgeschichte','Das Rätsel beim Schulfest','mittel',45,['Lichterkette','Bühne','Zettel','Überraschung'],[],
 'Erzähle, was während der Vorbereitungen zum Schulfest geschieht. Das Rätsel muss durch einen Hinweis vorbereitet und am Höhepunkt aufgelöst werden.',
 ['Einleitung: Die Figuren bereiten ein Schulfest vor.','Hauptteil: Ein Zettel und eine Lichterkette weisen auf ein ungewöhnliches Problem hin.','Höhepunkt: Die Figuren erkennen den Zusammenhang, entscheiden sich und handeln.','Schluss: Die Überraschung wird verständlich und das Fest kann weitergehen.'],
 ['Was planen die Figuren?','Welchen Zusammenhang gibt es zwischen Zettel und Lichterkette?','Was muss vor dem Auftritt entschieden werden?']),
e('bild-konzert','Bildergeschichte','Der fehlende Notenständer','mittel',45,[],[['🎻','Die Probe','Eine Gruppe übt für einen Auftritt.'],['🎼','Die Lücke','Ein wichtiges Notenblatt fehlt.'],['📝','Der Hinweis','Im Gang liegt ein Zettel.'],['🚪','Vor der Tür','Die Gruppe findet eine Spur zum Musikraum.']],
 'Schreibe eine vollständige Geschichte zu den Bildern. Füge wörtliche Rede und mindestens einen passenden Gedanken ein. Die Lösung muss zur Handlung passen.',
 ['Einleitung: Vor dem Auftritt bereitet sich die Musikgruppe vor.','Hauptteil: Die fehlenden Noten werden entdeckt; ein Zettel weist auf den Weg.','Höhepunkt: Die Gruppe entdeckt das Notenblatt und muss sich entscheiden, wie sie den Auftritt vorbereitet.','Schluss: Der Auftritt findet statt oder wird nachvollziehbar geändert.'],
 ['Warum sind die Noten wichtig?','Wer könnte den Zettel hinterlassen haben?','Was entscheidet die Gruppe?']),
e('reiz-park','Reizwortgeschichte','Im verlassenen Park','mittel',45,['Park','Fußspuren','Taschenlampe','Entscheidung'],[],
 'Schreibe eine Erzählung mit den vier Reizwörtern. Lasse die Figuren vernünftig handeln. Erzeuge Spannung durch Wahrnehmungen statt durch unbegründete Gefahren.',
 ['Einleitung: Ein Park und die Ausgangslage werden eingeführt.','Hauptteil: Fußspuren werden entdeckt; die Taschenlampe hilft beim Beobachten.','Höhepunkt: Die Figuren treffen nach einem Hinweis eine sinnvolle Entscheidung.','Schluss: Sie handeln verantwortungsbewusst und kehren zur Ausgangslage zurück.'],
 ['Warum sind die Figuren noch im Park?','Was zeigen die Spuren tatsächlich?','Was wäre eine sichere Lösung?']),
e('bild-tierheim','Bildergeschichte','Das Kaninchen im Tierheim','grundlegend',40,[],[['🐇','Im Tierheim','Zwei Kinder besuchen ein Kaninchen.'],['🚪','Offene Tür','Eine Käfigtür steht offen.'],['🥕','Eine Spur','Neben dem Käfig liegt eine Karotte.'],['🧺','Rascheln','Im Korb neben dem Regal bewegt sich etwas.']],
 'Erzähle eine Geschichte zu den vier Bildern. Nutze Gefühle und genau beschriebene Handlungen, um den Höhepunkt beim Finden des Kaninchens spannend zu gestalten.',
 ['Einleitung: Die Kinder besuchen das Kaninchen im Tierheim.','Hauptteil: Die Tür steht offen; die Karotte deutet auf einen Weg.','Höhepunkt: Die Kinder entdecken das Kaninchen im Korb und holen eine Betreuungsperson.','Schluss: Das Tier ist wieder sicher, und die Kinder sind erleichtert.'],
 ['Wen besuchen die Kinder?','Warum sind die Karotte und der Korb wichtig?','Wie kann das Kaninchen ruhig gesichert werden?']),
e('reiz-nacht','Reizwortgeschichte','Das Licht in der Nacht','anspruchsvoll',50,['Fenster','Lichtschein','Notiz','Erleichterung'],[],
 'Schreibe eine glaubwürdige Erzählung mit einer Spannungsschlinge, inneren Gedanken und einem genau erzählten Höhepunkt. Vermeide grundlose Zufälle.',
 ['Einleitung: Der ungewöhnliche Lichtschein am Fenster wirft eine Frage auf.','Hauptteil: Die Figur beobachtet Hinweise und entdeckt eine Notiz.','Höhepunkt: Sie versteht den Hinweis und entscheidet sich für eine sinnvolle Handlung.','Schluss: Die Erklärung löst den Konflikt; Erleichterung wird sichtbar.'],
 ['Wessen Fenster ist es?','Was könnte auf der Notiz stehen?','Welche frühere Beobachtung hilft bei der Lösung?']),
e('bild-theater','Bildergeschichte','Der falsche Vorhang','anspruchsvoll',50,[],[['🎭','Vorstellung','Die Kinder proben ein Theaterstück.'],['🎨','Kostüme','Ein Kostüm ist nicht am vorgesehenen Platz.'],['📜','Ein Zettel','Ein Hinweis hängt am Bühnenrand.'],['💡','Im Scheinwerfer','Kurz vor Beginn entdecken sie eine Verwechslung.']],
 'Erfinde zu den Bildern eine Erzählung mit verschiedenen Satzanfängen, passenden Dialogen und einer nachvollziehbaren Wendung kurz vor der Aufführung.',
 ['Einleitung: Die Probe beginnt; die Bühne wird eingeführt.','Hauptteil: Eine Verwechslung wird bemerkt und macht Probleme.','Höhepunkt: Die Figuren entschlüsseln den Hinweis und korrigieren die Verwechslung.','Schluss: Die Aufführung beginnt und das Ergebnis wird gezeigt.'],
 ['Worin besteht die Verwechslung?','Wie lässt sich das durch den Zettel erklären?','Was geschieht wenige Augenblicke vor dem Auftritt?']),
e('reiz-berge','Reizwortgeschichte','Die Spur am Aussichtspunkt','anspruchsvoll',50,['Wanderweg','Nebel','Fernglas','Wegzeichen'],[],
 'Schreibe eine spannende Ich-Erzählung, bei der sich aus den Hinweisen eine nachvollziehbare Entscheidung ergibt. Unterscheide Beobachtungen und Vermutungen.',
 ['Einleitung: Die Ich-Figur beschreibt eine Wanderung zum Aussichtspunkt.','Hauptteil: Nebel und ein schwer erkennbares Wegzeichen erschweren die Orientierung.','Höhepunkt: Durch Beobachtungen mit dem Fernglas und Prüfung der Karte wird eine sinnvolle Entscheidung getroffen.','Schluss: Die Figur findet den sicheren Weg und blickt auf die Entscheidung zurück.'],
 ['Was sehe ich wirklich?','Was vermute ich nur?','Wie hängt der Hinweis mit der Entscheidung zusammen?']),
e('bild-planetarium','Bildergeschichte','Das Geräusch im Planetarium','mittel',45,[],[['🌌','Im Kuppelsaal','Eine Schulklasse sitzt im Planetarium.'],['🔴','Ein Lichtpunkt','Ein rotes Licht erscheint am Gang.'],['🔎','Eine Spur','Neben der Projektionswand liegt ein Hinweis.'],['🎛️','Am Pult','Die Kinder entdecken eine technische Störung.']],
 'Schreibe eine Erzählung, die ein rätselhaftes Geräusch oder Licht verständlich erklärt. Gefühle und Gedanken sollen die Suche begleiten.',
 ['Einleitung: Die Klasse besucht das Planetarium.','Hauptteil: Ein ungewöhnliches Licht führt zu einem Hinweis.','Höhepunkt: Mit einer erwachsenen Aufsicht wird die Ursache am Pult erkannt.','Schluss: Die Vorführung kann wieder beginnen.'],
 ['Warum sind die Kinder im Planetarium?','Was können sie sehen und vermuten?','Wer ist für die Technik verantwortlich?']),
e('reiz-markt','Reizwortgeschichte','Auf dem Herbstmarkt','grundlegend',40,['Marktstand','Apfel','Geldbeutel','ehrlich'],[],
 'Schreibe eine Geschichte zu den vier Reizwörtern. Zeige, wie eine Figur vor einer Entscheidung steht und warum sie so handelt.',
 ['Einleitung: Die Figur besucht einen Herbstmarkt.','Hauptteil: Neben einem Marktstand entdeckt sie einen Geldbeutel.','Höhepunkt: Sie überlegt, was sie tun soll, und trifft eine ehrliche Entscheidung.','Schluss: Die Folgen werden sichtbar.'],
 ['Wem könnte der Geldbeutel gehören?','Wie fühlt sich die Figur bei der Entscheidung?','Wie könnte die Besitzerin gefunden werden?']),
e('bild-museum','Bildergeschichte','Die Spur im Museum','anspruchsvoll',50,[],[['🏛️','Ausstellung','Eine Gruppe besucht eine Ausstellung.'],['🗺️','Alte Karte','In einer Vitrine liegt eine ungewöhnliche Karte.'],['✉️','Ein Brief','Ein Zettel nennt eine andere Raumnummer.'],['🔐','Geschlossene Tür','Die Gruppe sucht die Aufsicht und stellt eine Frage.']],
 'Schreibe eine spannende, logisch aufgebaute Geschichte. Ein früherer Hinweis muss am Höhepunkt wichtig werden. Verwende passende Dialoge und eine einheitliche Zeitform.',
 ['Einleitung: Die Gruppe besucht die Ausstellung.','Hauptteil: Karte und Brief weisen auf einen scheinbaren Widerspruch hin.','Höhepunkt: Die Figuren bringen der Aufsicht ihren Fund; die Raumangabe klärt die Frage.','Schluss: Die Gruppe versteht den Zusammenhang und erinnert sich an den Hinweis.'],
 ['Welche Information macht die Karte besonders?','Warum wurde die andere Raumnummer notiert?','Wie kann die Aufsicht das Rätsel glaubwürdig aufklären?'])
];
const used=new Set(D.exams.map(x=>x.id));
for(const item of additional)if(!used.has(item.id)){D.exams.push(item);used.add(item.id);}
})();
/* Fachlich orientierte Lernziele und Anwendungsaufgaben für Hund und Katze */
(function(){
'use strict';
const data={
 skeleton:{title:'Skelett und Gelenke',icon:'🦴',goal:'Bauteile, Schutzfunktionen und Muskelkraft erklären.',
 steps:[
 ['Entdecken','Betrachte Schädel, Rippen, Wirbelsäule, Vorderbeine und Hinterbeine.','Was schützt der Schädel?',['Das Gehirn','Die Pfoten','Die Ballen'],0,'Schädelknochen umschließen und schützen das Gehirn.'],
 ['Verstehen','Knochen geben Halt. Muskeln ziehen über Sehnen an Knochen; Gelenke ermöglichen Bewegung.','Wer erzeugt die Zugkraft?',['Der Knochen selbst','Die Muskeln','Die Haut'],1,'Muskeln ziehen sich zusammen und bewegen Knochen über Sehnen.'],
 ['Anwenden','Eine bewegliche Wirbelsäule hilft beim Gehen, Laufen und Springen.','Wozu sind Gelenke wichtig?',['Sie verbinden Knochen beweglich','Sie sind immer starr','Sie erzeugen Haut'],0,'Gelenke verbinden Knochen und ermöglichen gerichtete Bewegung.']
 ],
 pairs:[['Schädel','Gehirn schützen'],['Rippen','Brustorgane schützen'],['Wirbelsäule','Rückenmark schützen']],
 seq:['Ein Muskel zieht sich zusammen.','Die Sehne überträgt Zugkraft.','Der Knochen bewegt sich um ein Gelenk.'],
 pairHint:'Ordne die Schutzfunktionen den passenden Knochen zu.'},
 origin:{title:'Entstehung von Haustieren',icon:'🌍',goal:'Domestikation und Zucht unterscheiden.',
 steps:[
 ['Entdecken','Hund und Katze stammen von unterschiedlichen Wildtierlinien ab.','Was ist ein Vorfahr?',['Ein früheres Tier einer Abstammungslinie','Ein neues Haustier','Eine Tierärztin'],0,'Vorfahren sind Teil der Abstammungsgeschichte.'],
 ['Verstehen','Domestikation geschieht über viele Generationen einer Tierpopulation.','Wie lange dauert sie normalerweise?',['Nur einen Tag','Viele Generationen','Nur eine Stunde'],1,'Ein einzelnes zahmes Tier ist noch keine domestizierte Population.'],
 ['Anwenden','Menschen züchteten später Haustiere mit bestimmten Merkmalen.','Was bedeutet Zucht?',['Eigenschaften durch Auswahl fördern','Tiere über Nacht umwandeln','Das Skelett färben'],0,'Bei Zucht werden Tiere mit bestimmten Eigenschaften ausgewählt.']
 ],
 pairs:[['Domestikation','Veränderungen über Generationen'],['Zucht','Merkmale gezielt auswählen'],['Vorfahren','Frühere wildlebende Linien']],
 seq:['Wildlebende Vorfahren existieren.','Manche Tiere kommen Menschen näher.','Über Generationen entsteht Zusammenleben.','Später werden Eigenschaften gezielt gezüchtet.'],
 pairHint:'Domestikation betrifft Generationen, Zucht gezielte Auswahl.'},
 teeth:{title:'Das Gebiss',icon:'🦷',goal:'Zahnarten erkennen und die Funktion der Reißzähne erklären.',
 steps:[
 ['Entdecken','Schneidezähne, Fangzähne und Backenzähne übernehmen verschiedene Aufgaben.','Was machen Fangzähne?',['Festhalten','Atmen','Hören'],0,'Die langen Fangzähne helfen beim Packen und Festhalten.'],
 ['Verstehen','Die obere vierte Prämolare und der untere erste Molar wirken beim Raubtier als Reißzahnschere.','Was macht diese Schere?',['Nahrung zerschneiden','Gras zermahlen','Gerüche erkennen'],0,'Scharfe Kanten gleiten wie eine Schere aneinander vorbei.'],
 ['Anwenden','Zahnform und Ernährung hängen zusammen.','Warum haben Raubtiere scharfe Schneidekanten?',['Zum Zerteilen von Nahrung','Für das Klettern','Um besser zu hören'],0,'Scharfe Kanten sind zum Zerschneiden geeignet.']
 ],
 pairs:[['Schneidezähne','Abknabbern'],['Fangzähne','Festhalten'],['Reißzähne','Scherenartig schneiden']],
 seq:['Das Tier schließt das Maul.','Die Reißzahnkanten gleiten aneinander vorbei.','Die Nahrung wird zerschnitten.'],
 pairHint:'Die Reißzähne sind keine weitere Zahnart, sondern spezialisierte Backenzähne.'},
 hunt:{title:'Jagdverhalten',icon:'🔍',goal:'Jagdphasen beschreiben und Sinnesorgane zuordnen.',
 steps:[
 ['Entdecken','Sinnesorgane helfen, Spuren und Beute zu finden.','Was gehört zur Suche?',['Wahrnehmung','Nur Schlafen','Nur Fellpflege'],0,'Gerüche, Geräusche oder Bewegungen können die Suche leiten.'],
 ['Verstehen','Der Körperbau hilft beim Anschleichen, Verfolgen, Springen oder Festhalten.','Was dämpft Schritte?',['Pfotenballen','Zähne','Ohren'],0,'Weiche Ballen polstern das Auftreten.'],
 ['Anwenden','Jagd ist ein Zusammenspiel von Wahrnehmung, Bewegung und Erfahrung.','Welche Erklärung stimmt?',['Sinnesorgane und Muskeln wirken zusammen','Nur Zähne bewegen das Tier','Jedes Tier jagt identisch'],0,'Jagdabläufe unterscheiden sich je nach Tier und Situation.']
 ],
 pairs:[['Geruchssinn','Spuren erkennen'],['Hörsinn','Geräusche wahrnehmen'],['Hinterbeine','Vortrieb und Absprung']],
 seq:['Beute oder Spur wahrnehmen.','Sich orientieren und nähern.','Gegebenenfalls verfolgen oder lauern.','Aus kurzer Entfernung zugreifen.'],
 pairHint:'Wahrnehmen kommt meistens vor der zielgerichteten Annäherung.'},
 motion:{title:'Fortbewegung',icon:'🐾',goal:'Gelenke, Gangarten, Vortrieb und Landung verstehen.',
 steps:[
 ['Entdecken','Im Trab arbeiten diagonal gegenüberliegende Beine ungefähr zusammen.','Was sind Diagonalbeinpaare?',['Vorne links und hinten rechts','Beide Ohren','Nur beide Vorderbeine'],0,'Beim Trab wechseln diagonale Beinpaare.'],
 ['Verstehen','Hinterbeine liefern beim Absprung Vortrieb; Vorderbeine nehmen bei der Landung Kräfte auf.','Was treibt den Sprung an?',['Kräftige Hinterbeine','Ohren','Das Fell'],0,'Hinterbeinmuskeln strecken die Gelenke kräftig.'],
 ['Anwenden','Die Wirbelsäule kann sich mitbewegen und die Schrittlänge beeinflussen.','Was ermöglicht ihre Beweglichkeit?',['Mehrere bewegliche Wirbel','Nur ein starrer Knochen','Nur Haut'],0,'Wirbelgelenke und Bandscheiben erlauben Bewegung.']
 ],
 pairs:[['Hinterbeine','Abstoßen'],['Vorderbeine','Landung abfedern'],['Gelenke','Knochen beweglich verbinden']],
 seq:['Hinterbeine beugen sich.','Hinterbeine stoßen kraftvoll ab.','Der Körper fliegt kurz.','Vorderbeine bremsen bei der Landung.'],
 pairHint:'Die Animation zeigt die Bewegungen in vereinfachten Phasen.'},
 signals:{title:'Körpersprache',icon:'👀',goal:'Gefühle und Warnsignale vorsichtig deuten, Abstand halten.',
 steps:[
 ['Entdecken','Augen, Ohren, Körperhaltung, Schwanz und Situation gehören zusammen.','Was muss man betrachten?',['Das Gesamtbild','Nur die Schwanzspitze','Nur die Fellfarbe'],0,'Ein einzelnes Signal ist nicht eindeutig.'],
 ['Verstehen','Ein ängstliches Tier kann sich ducken, ausweichen oder erstarren.','Was ist sicher?',['Rückzug ermöglichen','Hinterherlaufen','Schnell anfassen'],0,'Abstand hilft, eine Bedrohung zu vermeiden.'],
 ['Anwenden','Knurren, Fauchen und angespannte Körperhaltung können warnen.','Was bedeutet Schwanzwedeln immer?',['Nicht zwangsläufig Freude','Immer Freude','Immer Hunger'],0,'Die Bedeutung hängt vom Zusammenhang ab.']
 ],
 pairs:[['Tier duckt sich','Abstand lassen'],['Tier wirkt entspannt','Ruhig beobachten'],['Tier droht','Nicht bedrängen']],
 seq:['Haltung und Umgebung beobachten.','Gefahr erkennen und Abstand halten.','Dem Tier einen Rückzugsweg lassen.'],
 pairHint:'Tiere bei Angst, Drohung und Flucht nicht bedrängen.'},
 compare:{title:'Hund und Katze vergleichen',icon:'⚖️',goal:'Gemeinsamkeiten und Unterschiede mit Ursache und Wirkung begründen.',
 steps:[
 ['Entdecken','Beide Tierarten besitzen Schädel, Rippen, Wirbelsäule und vier Gliedmaßen.','Was haben beide gemeinsam?',['Sie sind Zehengänger','Sie haben beide 42 Zähne','Sie stammen direkt von Füchsen ab'],0,'Beide setzen vor allem Zehen und Ballen auf.'],
 ['Verstehen','Katzen haben gewöhnlich 30 bleibende Zähne, Hunde 42. Katzen haben meist einziehbare Krallen.','Welches Merkmal ist katzentypisch?',['Meist einziehbare Krallen','42 Zähne','Keine Wirbel'],0,'Krallen können bei Katzen meist zurückgezogen werden.'],
 ['Anwenden','Eine gute Erklärung enthält ein „weil“ und nennt einen echten Zusammenhang.','Welche Aussage ist eine gute Begründung?',['Die Pfote federt Schritte, weil sie Ballen besitzt','Hunde laufen, weil sie Hunde sind','Katzen sind weich, weil sie ein Wort kennen'],0,'Das Merkmal muss die Funktion erklären.']
 ],
 pairs:[['Hund','42 bleibende Zähne'],['Katze','30 bleibende Zähne'],['Beide','Zehengänger']],
 seq:['Ein Merkmal benennen.','Seine Funktion erklären.','Mit einem weil-Satz begründen.'],
 pairHint:'Finde für jede Aussage den richtigen Träger.'}
};
const extra={
 dog:{origin:'Die Vorfahren der Hunde gehörten zu früheren Wolfspopulationen. Zeitpunkt und Ort der Domestikation werden noch erforscht.',
 teeth:'Der erwachsene Hund hat gewöhnlich 42 bleibende und 28 Milchzähne.',
 hunt:'Viele Hunde können Duftspuren verfolgen. Jagdverhalten unterscheidet sich zwischen Rassen und Individuen.',
 motion:'Viele Hunde können ausdauernd laufen; die genaue Gangart hängt auch von Größe und Körperbau ab.',
 compare:'Hunde besitzen 42 bleibende Zähne und meist nicht einziehbare Krallen.'},
 cat:{origin:'Die Hauskatze stammt hauptsächlich von der afrikanisch-vorderasiatischen Wildkatze ab. Mäuse an Getreidespeichern begünstigten die Nähe zu Menschen.',
 teeth:'Die erwachsene Katze hat gewöhnlich 30 bleibende und 26 Milchzähne.',
 hunt:'Katzen können sich tief anschleichen, lauern und über kurze Strecken schnell springen.',
 motion:'Die biegsame Lendenwirbelsäule hilft Katzen beim Sprinten und Springen.',
 compare:'Katzen besitzen 30 bleibende Zähne und meist einziehbare Krallen.'}
};
function get(animal,section){
 const d=data[section];if(!d)return null;
 return {title:d.title,icon:d.icon,goal:d.goal,steps:d.steps.map(x=>x.slice()),
 pairs:d.pairs.map(x=>x.slice()),sequence:d.seq.slice(),
 pairHint:d.pairHint,detail:extra[animal==='cat'?'cat':'dog'][section]||'Hund und Katze besitzen denselben grundlegenden Skelettbauplan.'};
}
window.BioTierwissen={get,sections:Object.keys(data),selfTest:()=>Object.keys(data).length===7&&get('dog','motion').steps.length===3&&get('cat','teeth').pairs.length===3};
})();

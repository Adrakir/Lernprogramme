(function(){
'use strict';
const KEY='biolab5-tierkunde-2026';
const SPECIES={
 dog:{name:'Hund',emoji:'🐕',latin:'Canis lupus familiaris',teeth:42,milk:28,ancestry:'Grauwolf',story:'Hunde stammen von früheren Wolfspopulationen ab. Über viele Generationen lebten manche Wölfe näher bei Menschen. Aus ihren Nachkommen entwickelten sich Haushunde. Wann und wo genau dies begann, wird weiter erforscht.',fit:'Laufbeine, belastbare Pfoten und ein kräftiger Körper helfen vielen Hunden beim ausdauernden Laufen, Suchen und Verfolgen. Hunderassen unterscheiden sich jedoch stark.',diet:'Hunde können tierische und pflanzliche Nährstoffe verwerten; ihr Gebiss ist trotzdem typisch für ein Raubtier.'},
 cat:{name:'Katze',emoji:'🐈',latin:'Felis catus',teeth:30,milk:26,ancestry:'Afrikanisch-vorderasiatische Wildkatze',story:'Die Vorfahren unserer Hauskatzen waren Wildkatzen der Unterart Felis silvestris lybica. Als Menschen Getreide lagerten, kamen Mäuse. Wildkatzen fanden dort Beute; einige lebten immer näher bei Menschen.',fit:'Eine sehr bewegliche Wirbelsäule, kräftige Hinterbeine, leise Pfoten und ein langer Schwanz helfen Katzen beim Anschleichen, Springen und Balancieren.',diet:'Katzen sind auf tierische Nahrung spezialisiert: Sie sind obligate Fleischfresser.'}
};
const BONES=[
{id:'skull',label:'Schädel & Kiefer',why:'Schützt das Gehirn. Der Kiefer trägt die Zähne. Große Augenhöhlen schaffen Platz für die Augen.',dog:'Der Schädel kann je nach Hunderasse sehr unterschiedlich geformt sein. Der Kiefer trägt kräftige Fang- und Reißzähne.',cat:'Der vergleichsweise kurze Schädel trägt große Augenhöhlen. Kiefer und scharfe Reißzähne sind auf das Zerteilen tierischer Nahrung ausgerichtet.'},
{id:'spine',label:'Wirbelsäule',why:'Viele Wirbel bilden eine bewegliche, tragende Achse und schützen das Rückenmark. Zwischen den beweglichen Wirbeln liegen Bandscheiben.',dog:'Hals-, Brust-, Lenden-, Kreuz- und Schwanzwirbel stützen den Körper und wirken bei der Fortbewegung mit.',cat:'Die besonders bewegliche Lendenwirbelsäule kann sich stark beugen und strecken. So vergrößert die Katze bei Sprüngen und schnellen Läufen ihre Schrittlänge.'},
{id:'ribs',label:'Rippen & Brustkorb',why:'Rippen, Brustwirbel und Brustbein bilden den Brustkorb. Er schützt unter anderem Herz und Lunge und bewegt sich beim Atmen.',dog:'Der Brustkorb bietet Schutz und Platz für Herz und Lunge, die beim Laufen viel Sauerstoff liefern.',cat:'Auch der Katzenbrustkorb schützt die inneren Organe. Seine Rippen lassen die Atembewegungen zu.'},
{id:'shoulder',label:'Schulterblatt',why:'Das Schulterblatt ist Ansatzstelle für viele Muskeln und hilft, die Vorderbeine zu bewegen.',dog:'Die Vordergliedmaßen sind über Muskeln am Rumpf aufgehängt. Eine durchgehende knöcherne Verbindung wie unser Schlüsselbein fehlt.',cat:'Die Katze hat nur ein kleines, nicht mit dem übrigen Skelett gelenkig verbundenes Schlüsselbein. Die bewegliche Schulter hilft beim Klettern und Greifen.'},
{id:'foreleg',label:'Vorderbein',why:'Oberarmknochen, Elle und Speiche sowie Handknochen bilden die Vordergliedmaße. Gelenke und Muskeln ermöglichen Bewegung.',dog:'Die Vorderbeine stützen einen großen Teil des Gewichts und federn die Landung beim Laufen ab.',cat:'Bewegliche Vorderbeine greifen, halten und bremsen bei der Landung. Die Krallen unterstützen das Festhalten.'},
{id:'pelvis',label:'Becken',why:'Das Becken verbindet die Hinterbeine mit dem Rumpf, überträgt Kräfte und schützt Teile der inneren Organe.',dog:'Kräftige Becken- und Hinterbeinmuskeln treiben den Körper vorwärts.',cat:'Das Becken leitet die starke Sprungkraft der Hinterbeine an den Körper weiter.'},
{id:'hindleg',label:'Hinterbein',why:'Oberschenkelknochen, Schien- und Wadenbein, Sprunggelenk und Fußknochen wirken wie ein Hebelsystem.',dog:'Die Hinterbeine erzeugen Vortrieb. Das hoch stehende Sprunggelenk wirkt wie ein Hebel.',cat:'Lange, kräftige Hinterbeine speichern und übertragen Muskelkraft – ideal zum Absprung.'},
{id:'feet',label:'Pfoten & Zehen',why:'Hund und Katze sind Zehengänger. Sie setzen vor allem die Zehenballen auf, nicht die ganze Fußsohle wie wir.',dog:'Krallen sind normalerweise nicht einziehbar. Pfotenballen polstern Schritte und geben Halt.',cat:'Krallen können meist in Hauttaschen zurückgezogen werden. So bleiben sie scharf und die Katze kann beim Anschleichen oft leiser auftreten.'},
{id:'tail',label:'Schwanzwirbel',why:'Der Schwanz enthält viele kleine Wirbel und Muskeln. Er hilft bei Bewegung und Verständigung.',dog:'Die Stellung des Schwanzes gehört zur Körpersprache und kann beim Balancieren helfen.',cat:'Der bewegliche Schwanz unterstützt das Balancieren und vermittelt zusammen mit Ohren und Körperhaltung Gefühle.'}
];
const ATLAS=[
['Schädel','Harte Schädelknochen schützen das Gehirn. Die Augen liegen geschützt in Augenhöhlen.'],
['Unterkiefer','Der bewegliche Unterkiefer trägt die unteren Zähne. Kaumuskeln öffnen und schließen das Maul.'],
['Halswirbel','Gewöhnlich sieben Halswirbel tragen den Kopf. Die ersten beiden Wirbel ermöglichen besonders wichtige Kopfbewegungen.'],
['Brustwirbel','Gewöhnlich 13 Brustwirbel tragen die Rippen und bilden mit ihnen den Brustkorb.'],
['Lendenwirbel','Gewöhnlich sieben Lendenwirbel liegen hinter dem Brustkorb. Starke Rückenmuskeln setzen hier an; besonders Katzen nutzen ihre Beweglichkeit beim Sprinten.'],
['Kreuzbein','Gewöhnlich drei verwachsene Kreuzbeinwirbel verbinden die Wirbelsäule fest mit dem Becken.'],
['Schwanzwirbel','Die Zahl der Schwanzwirbel ist unterschiedlich. Schwanzmuskeln steuern Bewegungen und Körpersprache.'],
['Rippen','Meist 13 Rippenpaare umschließen mit Brustbein und Wirbelsäule den Brustraum. Sie schützen Organe und bewegen sich beim Atmen.'],
['Brustbein','Das Brustbein verbindet viele Rippen an der Körperunterseite und stabilisiert den Brustkorb.'],
['Schulterblatt','Das flache Schulterblatt liegt seitlich am Brustkorb. Daran setzen Muskeln an, die das Vorderbein bewegen.'],
['Oberarmknochen (Humerus)','Verbindet Schultergelenk und Ellenbogengelenk. Er wirkt als Hebel, wenn Muskeln ziehen.'],
['Elle (Ulna)','Ein Unterarmknochen. Ihr oberes Ende bildet den Ellenbogenhöcker, an dem der Streckmuskel ansetzt.'],
['Speiche (Radius)','Der zweite Unterarmknochen. Er überträgt Kräfte vom Ellenbogen zur Vorderpfote.'],
['Handwurzelknochen','Kleine Knochen bilden das Vorderfußwurzelgelenk; beim Tier entspricht es unserem Handgelenk.'],
['Mittelhandknochen','Längere Knochen zwischen Handwurzel und Vorderzehen. Sie übertragen beim Auftreten Kräfte.'],
['Zehenknochen','Gliedern die Zehen. Die letzten Zehenknochen tragen die Krallen aus Horn.'],
['Beckenknochen','Das Becken umfasst unter anderem Darmbein, Sitzbein und Schambein und trägt die Hüftgelenkspfanne.'],
['Oberschenkelknochen (Femur)','Stabiler Knochen zwischen Hüfte und Knie. Starke Muskeln bewegen ihn zum Laufen und Springen.'],
['Kniescheibe (Patella)','Kleiner Knochen in einer Sehne am Knie. Er verbessert die Kraftübertragung des Streckmuskels.'],
['Schienbein (Tibia)','Trägt einen großen Teil der Kraft im Unterschenkel zwischen Knie und Sprunggelenk.'],
['Wadenbein (Fibula)','Dünnerer Knochen neben dem Schienbein. Er trägt zur Stabilisierung und zu Muskelansätzen bei.'],
['Fußwurzel / Sprunggelenk','Das Sprunggelenk liegt beim Tier deutlich oberhalb der Pfote. Sein Fersenhöcker wirkt als Hebel.'],
['Mittelfußknochen','Verbinden Sprunggelenk mit Hinterzehen. Sie verlängern den Fußabschnitt beim Zehengang.']
];
const DENTAL=[
{id:'incisor',label:'Schneidezähne',color:'#7eb6b8',dog:'12 kleine Schneidezähne. Sie knabbern und nehmen kleine Stücke auf.',cat:'12 kleine Schneidezähne. Sie helfen beim Abnagen und bei der Fellpflege.'},
{id:'canine',label:'Fangzähne',color:'#e5a55d',dog:'4 spitze Fangzähne halten Beute oder Gegenstände fest. Sie schneiden nicht wie Scheren.',cat:'4 lange, spitze Fangzähne packen und halten Beute.'},
{id:'premolar',label:'Vordere Backenzähne',color:'#9d8dcf',dog:'16 Prämolaren, darunter scharfkantige Zähne zum Zerteilen.',cat:'10 Prämolaren; viele haben scharfe Schneidekanten.'},
{id:'molar',label:'Hintere Backenzähne',color:'#82a87c',dog:'10 Molaren. Einige helfen stärker beim Zerdrücken; die Reißzähne arbeiten wie eine Schere.',cat:'4 Molaren. Im Vergleich zum Hund gibt es wenig Fläche zum Zermahlen.'}
];
const MOODS={
 relax:{title:'Entspannt',icon:'😊',dog:'Lockere Muskeln, weicher Blick, natürliche Ohrhaltung. Der Schwanz bewegt sich möglicherweise locker.',cat:'Lockere Körperhaltung, ruhiger Blick, normal stehende Ohren, entspannter Schwanz.',notice:'Ein entspanntes Tier wirkt nicht steif. Trotzdem immer fragen, bevor du ein fremdes Tier berührst.',features:['Muskeln: locker','Augen: weich','Schwanz: natürlich']},
 fear:{title:'Angst / Unsicherheit',icon:'😟',dog:'Körper geduckt, Ohren häufig zurückgelegt, Schwanz eventuell eingeklemmt. Manche Hunde gähnen, lecken sich über die Nase oder vermeiden Blickkontakt.',cat:'Körper klein und tief, Ohren seitlich oder nach hinten, große Pupillen. Sie versteckt sich oft oder versucht, Abstand zu bekommen.',notice:'Nicht bedrängen, nicht verfolgen und einen Rückzugsweg freilassen.',features:['Haltung: geduckt','Ohren: oft zurück','Abstand: wird gesucht']},
 threat:{title:'Drohen / Abwehr',icon:'⚠️',dog:'Oft steifer Körper, starrer Blick, möglicherweise Knurren, gefletschte Zähne oder aufgerichtetes Fell. Drohen kann auch aus Angst entstehen.',cat:'Körper steif, Ohren flach, Fell häufig gesträubt, Rücken mitunter gekrümmt, Fauchen oder Knurren.',notice:'Abstand halten. Nicht anfassen oder anstarren; eine erwachsene Person informieren.',features:['Körper: angespannt','Blick: häufig starr','Abstand: dringend nötig']},
 attack:{title:'Angriff / Abwehrbewegung',icon:'🚨',dog:'Der Hund kann nach vorne schnellen, schnappen oder beißen. Vorher können Knurren, Erstarren oder ein gespannter Körper zu sehen sein; manche Tiere reagieren ohne deutlich sichtbare Vorwarnung.',cat:'Die Katze kann mit der Pfote schlagen, kratzen oder beißen, besonders wenn sie sich eingeengt oder bedroht fühlt. Ohren sind häufig seitlich oder angelegt.',notice:'Nicht eingreifen, nicht dazwischenfassen und Abstand gewinnen. Bei einer gefährlichen Situation Erwachsene hinzuziehen.',features:['Bewegung: plötzlich','Muskeln: angespannt','Sicherheit: Abstand']},
 flee:{title:'Flucht',icon:'💨',dog:'Der Hund weicht zurück oder läuft fort. Kopf und Körper können niedrig sein, der Schwanz ist häufig tief.',cat:'Die Katze rennt zu einem Versteck, duckt sich und sucht einen sicheren Fluchtweg.',notice:'Fliehende Tiere nicht verfolgen. Sie brauchen Ruhe und einen sicheren Ort.',features:['Bewegung: weg vom Reiz','Ziel: Sicherheit','Nicht hinterherlaufen']},
 hunt:{title:'Aufmerksam / Jagd',icon:'🔎',dog:'Nase am Boden oder in der Luft, Ohren aufmerksam, Muskeln gespannt. Danach kann der Hund suchen, vorstehen oder verfolgen – je nach Rasse und Situation.',cat:'Blick auf Beute gerichtet, Körper sehr tief, Hinterbeine unter dem Körper; vor dem Sprung wippt manchmal das Hinterteil.',notice:'Jagdspannung bedeutet nicht automatisch Aggression gegen Menschen.',features:['Blick / Nase: konzentriert','Körper: angespannt','Bewegung: gezielt']},
 play:{title:'Spiel',icon:'🎾',dog:'Typisch ist die Spielverbeugung: Vorderkörper tief, Hinterteil hoch. Bewegungen sind oft locker und bogenförmig.',cat:'Seitliche Sprünge, kurze Sprints und vorsichtiges Antippen mit den Pfoten sind möglich. Ohren und Schwanz müssen mitbeobachtet werden.',notice:'Ein Spiel sollte freiwillig sein und Pausen zulassen. Bei Angst oder Drohen beenden.',features:['Bewegung: locker','Wechsel: mit Pausen','Kein Zwang']}
};
const Q=[
{animal:'dog',q:'Von welcher Tiergruppe stammen Haushunde ab?',a:['Von früheren Wolfspopulationen','Von Füchsen','Von Katzen','Von heutigen einzelnen Hunderassen'],c:0,why:'Hunde wurden aus früheren Wolfs-Linien domestiziert. Der genaue Zeitpunkt ist noch Gegenstand der Forschung.',hint:'Denke an ein wildes Tier aus der Familie der Hunde.'},
{animal:'dog',q:'Wie viele bleibende Zähne hat das vollständige Hundegebiss normalerweise?',a:['30','42','32','20'],c:1,why:'Das erwachsene Hundegebiss hat normalerweise 42 Zähne: 12 Schneidezähne, 4 Fangzähne, 16 Prämolaren und 10 Molaren.',hint:'Es sind mehr als bei einer Katze.'},
{animal:'dog',q:'Was ist eine wichtige Aufgabe des Brustkorbs?',a:['Er lässt die Krallen wachsen','Er schützt Herz und Lunge','Er bildet Magensäure','Er lenkt die Augen'],c:1,why:'Rippen und Brustbein schützen die empfindlichen Organe im Brustraum.',hint:'Dort liegen Organe, mit denen wir atmen und Blut bewegen.'},
{animal:'dog',q:'Warum sind die kräftigen Hinterbeine für viele Hunde wichtig?',a:['Sie erzeugen Vortrieb','Sie ersetzen die Zähne','Sie machen Hören möglich','Sie speichern Futter'],c:0,why:'Hinterbeinmuskeln bewegen die Gelenke und schieben den Körper beim Laufen nach vorne.',hint:'Was braucht der Hund, um zu beschleunigen?'},
{animal:'dog',q:'Welche Aussage über die Hundekrallen stimmt meistens?',a:['Sie sind wie bei Katzen vollständig einziehbar','Sie helfen zusammen mit Pfotenballen beim Halt','Sie haben keine Funktion','Sie bestehen aus Knochen'],c:1,why:'Hundekrallen bestehen aus Horn und sind gewöhnlich nicht einziehbar. Sie unterstützen den Halt.',hint:'Denke an den Boden beim schnellen Laufen.'},
{animal:'dog',q:'Ein Hund hat einen steifen Körper, starrt dich an und knurrt. Was ist sinnvoll?',a:['Ihn sofort umarmen','Ruhig Abstand schaffen und ihn nicht bedrängen','Auf ihn zulaufen','Ihn am Schwanz anfassen'],c:1,why:'Das können deutliche Warnsignale sein. Abstand halten schützt Mensch und Tier.',hint:'Welche Reaktion gibt dem Tier Raum?'},
{animal:'dog',q:'Welche Zähne können Nahrung scherenartig zerteilen?',a:['Reißzähne','Nur Schneidezähne','Milchzähne als Gruppe','Keine Zähne'],c:0,why:'Bestimmte obere und untere Backenzähne greifen scherenartig ineinander. Beim Hund sind das besonders der obere vierte Prämolar und der untere erste Molar.',hint:'Der Name klingt nach Reißen.'},
{animal:'dog',q:'Woran erkennst du nicht sicher, dass ein Hund freundlich ist?',a:['An einem einzelnen Schwanzwedeln','An einem insgesamt lockeren Körper','An der entspannten Mimik zusammen mit Bewegungen','An der gesamten Situation'],c:0,why:'Ein wedelnder Schwanz allein beweist keine Freundlichkeit. Immer Haltung, Gesicht, Umgebung und Verhalten zusammen betrachten.',hint:'Ein einzelnes Signal kann täuschen.'},
{animal:'dog',q:'Wie stehen Hunde beim Laufen vor allem auf dem Boden?',a:['Auf der ganzen Fußsohle','Auf Zehen und Ballen','Auf den Knien','Nur auf den Fersen'],c:1,why:'Hunde sind Zehengänger. Was wie ein rückwärts gerichtetes Knie aussieht, ist am Hinterbein das hoch stehende Sprunggelenk.',hint:'Achte auf die Pfoten.'},
{animal:'dog',q:'Was zeigt die Spielverbeugung eines Hundes häufig?',a:['Einladung zum Spiel','Sicher eine schwere Krankheit','Immer Jagd auf Menschen','Dass er schlafen muss'],c:0,why:'Vorderkörper tief und Hinterteil hoch können eine Spielaufforderung sein. Die übrigen Signale bleiben wichtig.',hint:'Dabei ist der Hinterkörper meist oben.'},
{animal:'cat',q:'Welche Wildkatzen-Unterart ist die wichtigste Vorfahrin unserer Hauskatze?',a:['Afrikanisch-vorderasiatische Wildkatze','Tiger','Luchs','Schneeleopard'],c:0,why:'Genetische Befunde führen die Hauskatze auf Felis silvestris lybica zurück.',hint:'Diese Wildkatze lebte in Gebieten früher Landwirtschaft.'},
{animal:'cat',q:'Wie viele bleibende Zähne besitzt ein vollständiges Katzengebiss normalerweise?',a:['42','26','30','36'],c:2,why:'Erwachsene Katzen haben normalerweise 30 Zähne: 12 Schneide-, 4 Fang-, 10 Prämolaren und 4 Molaren.',hint:'Es sind weniger als beim Hund.'},
{animal:'cat',q:'Warum ist die bewegliche Wirbelsäule der Katze nützlich?',a:['Sie macht die Katze schwerer','Sie hilft beim Strecken, Springen und schnellen Laufen','Sie macht Knochen flüssig','Sie ersetzt die Muskulatur'],c:1,why:'Starkes Beugen und Strecken vergrößert die Reichweite des Körpers beim Laufen und Springen.',hint:'Denke an die Bewegung vor dem Absprung.'},
{animal:'cat',q:'Warum kann eine Katze häufig so leise anschleichen?',a:['Ihre Pfotenballen dämpfen Schritte und Krallen können eingezogen werden','Sie hat keine Knochen','Ihre Ohren wiegen nichts','Sie kann nicht springen'],c:0,why:'Weiche Ballen dämpfen Schritte. Eingezogene Krallen kratzen beim normalen Gehen meist nicht über den Boden.',hint:'Denke an Ballen und Krallen.'},
{animal:'cat',q:'Welche Aufgabe hat der Schwanz beim Balancieren?',a:['Er unterstützt das Gleichgewicht','Er ersetzt ein Bein','Er erzeugt Licht','Er enthält die Lunge'],c:0,why:'Die Katze kann ihren beweglichen Schwanz als Gegengewicht und zur Korrektur ihrer Körperlage einsetzen.',hint:'Stell dir eine Katze auf einem schmalen Zaun vor.'},
{animal:'cat',q:'Welche Abfolge passt am besten zur typischen Katzenjagd?',a:['Anschleichen → Lauern → Anspringen','Wegschauen → Einschlafen → Bellen','Erst laut bellen → Treiben im Rudel','Immer stundenlang geradeaus rennen'],c:0,why:'Katzen sind meist anschleichende Lauerjäger und setzen auf kurze, gezielte Sprünge.',hint:'Sie versuchen zuerst möglichst unbemerkt zu bleiben.'},
{animal:'cat',q:'Eine Katze kauert mit flachen Ohren und faucht. Was tust du?',a:['Sie hochheben','Ihr Abstand und einen Rückzug ermöglichen','Sie in die Ecke drängen','Ihr Spielzeug direkt ins Gesicht halten'],c:1,why:'Fauchen und Körperspannung sind Warnsignale. Die Katze braucht Raum, nicht Berührung.',hint:'Eine verängstigte Katze möchte eine Wahl haben.'},
{animal:'cat',q:'Wozu dienen scharfe Reißzähne bei Katzen vor allem?',a:['Zum Zermahlen von Gras','Zum Zerschneiden von Fleisch','Zum Filtern von Wasser','Zum Kauen von Steinen'],c:1,why:'Die aufeinanderpassenden scharfen Zahnkanten schneiden Nahrung in Stücke. Katzen sind obligate Fleischfresser.',hint:'Denke an die natürliche Nahrung.'},
{animal:'cat',q:'Warum kamen Wildkatzen frühen bäuerlichen Siedlungen näher?',a:['Weil gelagerte Vorräte Mäuse anzogen','Weil die Menschen Motoren hatten','Weil es dort keine Nahrung gab','Weil Katzen Gras fressen wollten'],c:0,why:'Getreidevorräte lockten Nagetiere an. Das schuf eine neue Jagdmöglichkeit für Wildkatzen.',hint:'Welches kleine Tier frisst gern Getreide?'},
{animal:'cat',q:'Was ist am Katzen-Schlüsselbein besonders?',a:['Es ist klein und nicht gelenkig mit dem Brustbein verbunden','Es ist größer als der Oberschenkel','Es bildet den Schwanz','Es trägt die Fangzähne'],c:0,why:'Das kleine Schlüsselbein liegt in Muskeln. Die Schulter kann dadurch sehr beweglich bleiben.',hint:'Die Schulter muss beim Klettern und Durchschlüpfen beweglich sein.'},
{animal:'both',q:'Was haben Hund und Katze gemeinsam?',a:['Beide sind Zehengänger','Beide haben genau 42 Zähne','Beide ziehen ihre Krallen stets vollständig ein','Beide stammen direkt vom Löwen ab'],c:0,why:'Beide setzen beim normalen Gehen hauptsächlich Zehen und Ballen auf. Gebiss und Krallen unterscheiden sich.',hint:'Vergleiche, wo die Pfote den Boden berührt.'},
{animal:'both',q:'Warum sind Knochen nicht einfach tote Stäbe?',a:['Sie sind lebendes Gewebe mit Blutversorgung und Umbau','Sie bestehen aus Gummi','Sie bewegen sich ohne Muskeln','Sie sind luftgefüllte Hüllen'],c:0,why:'Knochen werden versorgt, wachsen und können sich reparieren. Zusammen mit Gelenken und Muskeln ermöglichen sie Bewegung.',hint:'Denke an das Heilen eines gebrochenen Knochens.'},
{animal:'both',q:'Was ist für Körpersprache am wichtigsten?',a:['Nur der Schwanz','Ohren, Augen, Körper, Schwanz und Situation zusammen','Nur die Fellfarbe','Nur die Größe des Tieres'],c:1,why:'Einzelne Zeichen können mehrdeutig sein. Erst die Kombination von Haltung, Gesicht, Bewegung und Situation hilft beim Einschätzen.',hint:'Ein Zeichen allein kann täuschen.'},
{animal:'both',q:'Was erklären wir mit dem Wort Angepasstheit?',a:['Ein Körperbau kann eine Lebensweise unterstützen','Alle Tiere haben den gleichen Körperbau','Knochen bestimmen jedes Verhalten allein','Anpassung passiert bewusst in einem Tag'],c:0,why:'Körpermerkmale haben sich über viele Generationen entwickelt und können beim Jagen, Laufen oder Klettern nützlich sein.',hint:'Denke an eine Funktion, für die ein Merkmal hilfreich ist.'}
];
const $=s=>document.querySelector(s);
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let animal='dog',section='skeleton',bone='spine',tooth='canine',mood='relax',gait='walk',quiz=[],qi=0,chosen=null,checked=false,hints=0,score=0,best={dog:0,cat:0};
try{best=Object.assign(best,JSON.parse(localStorage.getItem(KEY)||'{}').best||{})}catch(e){}
const A=()=>SPECIES[animal];
function pageTitle(id,title,subtitle){return '<div class="page-title"><div><span class="kicker">FORSCHERSTATION '+id+' · '+A().name.toUpperCase()+'</span><h2>'+title+'</h2><p>'+subtitle+'</p></div><span class="mini-tag">'+A().emoji+' '+A().name+'</span></div>'}
function card(icon,name,txt){return '<article class="fact"><span class="emoji">'+icon+'</span><h3>'+name+'</h3><p>'+txt+'</p></article>'}
function callout(title,body){return '<div class="callout"><strong>'+title+'</strong><p>'+body+'</p></div>'}
function navLine(next,label){return '<div class="actionline spaced"><button type="button" data-section="'+next+'" class="btn">'+label+' →</button><button type="button" data-section="quiz" class="btn secondary">🧠 Jetzt testen</button></div>'}
function bonePart(id,svg){return '<g class="bone '+(bone===id?'selected':'')+'" data-bone="'+id+'" role="button" tabindex="0" aria-label="'+BONES.find(b=>b.id===id).label+' auswählen">'+svg+'</g>'}
function node(x,y,num){return '<circle class="bone-node" cx="'+x+'" cy="'+y+'" r="12"/><text class="bone-node-text" x="'+x+'" y="'+(y+4)+'">'+num+'</text>'}
function skeletonSvg(){
 const cat=animal==='cat';
 const bg='<defs><pattern id="gridbone" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".9" fill="#c4ddd2"/></pattern><linearGradient id="fur" x2="0" y2="1"><stop stop-color="#e1e8dc" stop-opacity=".62"/><stop offset="1" stop-color="#b7d2c0" stop-opacity=".24"/></linearGradient></defs><rect width="820" height="490" rx="18" fill="url(#gridbone)"/>';
 const silhouette=cat?'<path d="M195 163 Q239 117 313 141 Q422 102 557 145 Q602 149 629 202 Q655 222 679 185 Q724 129 696 107 Q693 105 688 113 Q701 143 671 160 Q648 181 633 168 L621 284 Q592 301 564 287 L263 305 Q235 278 220 243 Q194 239 173 227 L125 226 Q108 222 111 206 L101 190 L112 176 L106 147 L123 136 L153 144 L164 134 Q187 135 195 163Z" fill="url(#fur)" stroke="#aac9b5" stroke-width="3"/>' :'<path d="M209 157 Q259 131 347 138 Q456 128 548 144 Q593 147 619 183 L649 164 Q687 146 708 154 L704 172 L651 202 L628 275 Q577 294 542 278 L254 292 Q234 266 219 230 L144 232 Q113 231 106 217 L72 214 L56 202 L68 185 L108 182 L130 145 L165 137 L183 126 Q207 131 209 157Z" fill="url(#fur)" stroke="#aac9b5" stroke-width="3"/>';
 const skull=cat?'<path class="outline" d="M99 191 L100 148 L119 127 L137 144 L164 138 L179 168 L185 201 L158 223 L117 219Z"/><path class="inner" d="M112 211 L155 220 L165 208"/><circle cx="146" cy="178" r="18" fill="#fafbf3" stroke="#96866a" stroke-width="3"/><path class="inner" d="M99 195L83 201L100 209"/>' :'<path class="outline" d="M122 154L139 125L161 135L195 145L209 172L185 204L154 209L122 199L74 204L59 196L72 183L122 178Z"/><path class="inner" d="M75 204L149 222L186 212"/><circle cx="162" cy="170" r="17" fill="#fafbf3" stroke="#96866a" stroke-width="3"/><path class="inner" d="M136 148L129 127"/>';
 const spine='<path d="M196 169 Q259 142 315 161 Q400 158 483 165 Q539 170 576 176" stroke="#baa77d" stroke-width="13" fill="none"/>'+Array.from({length:24},(_,i)=>{const x=201+i*16,y=i<7?169-(i*2):i<17?155+(i-7)*.45:160+(i-17)*2;return '<path d="M'+x+' '+(y-8)+'l6 8 -5 8" fill="none" stroke="#f7eccf" stroke-width="5"/>'}).join('');
 const ribs='<path d="M324 303 Q393 330 464 302" stroke="#a99a77" stroke-width="6" fill="none"/>'+Array.from({length:8},(_,i)=>{const x=294+i*22;return '<path d="M'+x+' '+(161+i*.5)+' Q'+(x+49)+' 204 '+(x+30)+' '+(285+Math.sin(i/8*Math.PI)*24)+'" fill="none" stroke="#dccba4" stroke-width="8"/><path d="M'+x+' '+(161+i*.5)+' Q'+(x+49)+' 204 '+(x+30)+' '+(285+Math.sin(i/8*Math.PI)*24)+'" fill="none" stroke="#877657" stroke-width="1.6"/>'}).join('');
 const fore='<path d="M271 218 L292 287 L271 342L258 423 M289 296L291 348L275 423" fill="none" stroke="#dacaa3" stroke-width="14"/><circle cx="293" cy="286" r="12" fill="#f2e3c3" stroke="#8b7b5f" stroke-width="3"/><path d="M257 422L241 440L195 440 M275 423L260 439L219 442" fill="none" stroke="#d6c5a0" stroke-width="10"/>';
 const hind='<path d="M563 201L598 274L557 347L589 416L567 439L529 440 M576 347L602 413L588 434" fill="none" stroke="#d6c5a0" stroke-width="15"/><circle cx="598" cy="274" r="13" fill="#f3e4c3" stroke="#8c7c5b" stroke-width="3"/><path d="M529 441L512 443M529 441L516 454M558 441L547 451" stroke="#a89974" stroke-width="5"/>';
 const tail=cat?'<path d="M603 180Q655 159 685 130Q717 99 692 88Q668 80 672 106" stroke="#d7c7a3" stroke-width="13" fill="none"/>' :'<path d="M606 174Q666 165 703 147" stroke="#dacaa3" stroke-width="15" fill="none"/>';
 const pieces=[
 bonePart('tail',tail+node(cat?678:699,cat?95:149,9)),
 bonePart('spine',spine+node(420,143,2)),
 bonePart('ribs',ribs+node(409,252,3)),
 bonePart('skull',skull+node(138,159,1)),
 bonePart('shoulder','<path class="outline" d="M255 163L297 197L281 264L250 224Z"/>'+node(264,197,4)),
 bonePart('foreleg',fore+node(294,326,5)),
 bonePart('pelvis','<path class="outline" d="M530 173Q557 159 585 185L571 234L539 235L530 211Z"/>'+node(552,192,6)),
 bonePart('hindleg',hind+node(578,333,7)),
 bonePart('feet','<path d="M195 441l-16 1m31-2l-16 7m37-7l-12 10M516 439l-15 8m26-7l-13 13" stroke="#d1bd95" stroke-width="11" stroke-linecap="round"/>'+node(241,450,8))
 ].join('');
 return '<svg class="skeleton-svg" viewBox="0 0 820 490" role="img" aria-label="Anklickbares schematisches '+A().name+'skelett mit neun nummerierten Knochenbereichen">'+bg+silhouette+'<path d="M53 455H762" stroke="#bed6cd" stroke-width="2" stroke-dasharray="8 7"/>'+pieces+'<text x="29" y="39" class="bone-label">'+(cat?'KATZE':'HUND')+' · Skelett von der Seite</text><text x="29" y="65" font-size="13" fill="#668379">Vereinfachtes Lernmodell · Klick auf eine Nummer</text><text x="703" y="476" font-size="12" fill="#648378">Nicht maßstabsgetreu</text></svg>'
}
function skeletonPage(){
 const b=BONES.find(x=>x.id===bone);
 return pageTitle('01',animal==='dog'?'Das Skelett des Hundes':'Das Skelett der Katze','Tippe auf die nummerierten Knochen. Erfahre, welche Aufgabe sie haben und warum der Körperbau zur Lebensweise passt.')+
 '<div class="actionline"><button type="button" class="btn secondary" data-action="zoom">🔎 Skelett vergrößern</button></div><div class="bone-board">'+skeletonSvg()+'</div><p class="diagram-caption">Neun anklickbare Knochenbereiche. Die Zeichnung ist ein wissenschaftlich orientiertes, aber vereinfachtes Lernschema – nicht jede einzelne Rippe oder Zehe ist dargestellt.</p>'+
 '<div class="chips" aria-label="Knochen auswählen">'+BONES.map((x,i)=>'<button type="button" data-bone="'+x.id+'" class="chip '+(x.id===bone?'active':'')+'">'+(i+1)+'. '+x.label+'</button>').join('')+'</div>'+
 '<div class="detail" aria-live="polite"><h3>🦴 '+b.label+'</h3><p><b>Was ist das?</b> '+b.why+'</p><p style="margin-top:9px"><b>Warum gerade bei '+A().name+'?</b> '+b[animal]+'</p></div>'+
 callout('Der wichtigste Zusammenhang','Das Skelett gibt Halt, schützt Organe und bildet mit Muskeln und Gelenken ein Bewegungssystem. Die Knochen selbst ziehen nicht – Muskeln bewegen sie über Sehnen.')+
 '<div class="panel white spaced anatomy-atlas"><h3>🔎 Anatomie-Lexikon: 23 Knochen und Bauteile</h3><p class="smallnote">Du kannst jeden Begriff öffnen. So erfährst du mehr als die neun Bereiche der großen Zeichnung zeigen.</p><div class="atlas-grid">'+ATLAS.map((x,i)=>'<details><summary>'+(i+1)+'. '+x[0]+'</summary><p>'+x[1]+'</p></details>').join('')+'</div></div>'+
 callout('Wirbel-Zahlen zum Merken','Hund und Katze besitzen normalerweise 7 Halswirbel, 13 Brustwirbel, 7 Lendenwirbel und 3 verwachsene Kreuzbeinwirbel. Die Zahl der Schwanzwirbel kann variieren.')+
 '<div class="info-cards spaced">'+card('🦴','Gemeinsamer Bauplan','Hund und Katze besitzen wie wir einen Schädel, eine Wirbelsäule, Rippen, zwei Vorder- und zwei Hintergliedmaßen.')+card('🐾','Besonderheit','Beide gehen auf Zehen und Ballen. Die Katze ist besonders beweglich beim Anschleichen und Springen; viele Hunde sind auf längeres Laufen eingestellt.')+'</div>'+
 navLine('origin','Weiter: Woher kommen sie?');
}
function originPage(){
 const dog=animal==='dog';
 return pageTitle('02','Vom Wildtier zum Haustier','Domestikation bedeutet: Über viele Generationen verändert sich eine Tierpopulation im Zusammenleben mit Menschen.')+
 '<div class="two"><section class="panel white"><h3>🌍 So begann die gemeinsame Geschichte</h3><div class="timeline">'+
 (dog?[
 ['🐺','Wölfe als Vorfahren','Die Vorfahren aller Haushunde gehörten zur Wolfs-Linie. Nicht jeder heutige Wolf ist deshalb ein direkter Vorfahr heutiger Hunde.'],
 ['🏕️','Begegnungen mit Menschen','Einige Tiere näherten sich möglicherweise menschlichen Lagerplätzen und fanden dort Nahrung. Über viele Generationen entstand Nähe.'],
 ['🤝','Zusammenleben','Menschen und Hunde profitierten unter anderem von Wachsamkeit, Hilfe bei der Jagd und später weiteren Aufgaben.'],
 ['🐕','Viele Hunderassen','Menschen züchteten Hunde mit verschiedenen Eigenschaften. Dadurch können Körpergröße, Kopfform und Verhalten stark variieren.']
 ]:[
 ['🐈','Wildkatzen als Vorfahren','Die afrikanisch-vorderasiatische Wildkatze (Felis silvestris lybica) ist die wichtigste Stammlinie der Hauskatze.'],
 ['🌾','Ackerbau und Vorräte','Menschen bauten Getreide an und lagerten es. Das zog Mäuse und andere Nagetiere an.'],
 ['🐁','Katzen fanden Beute','Wenig scheue Wildkatzen jagten in Siedlungsnähe. So entwickelte sich allmählich das Zusammenleben.'],
 ['🏠','Vom Jäger zum Mitbewohner','Katzen blieben geschickte Einzeljäger; heute leben viele als Haustiere in der Nähe von Menschen.']
 ]).map((s,i)=>'<div class="fact step"><div class="step-num">'+(i+1)+'</div><div><h3>'+s[0]+' '+s[1]+'</h3><p>'+s[2]+'</p></div></div>').join('')+
 '</div></section><aside class="panel"><div class="big-icon">'+(dog?'🐺 → 🐕':'🐈‍⬛ → 🐈')+'</div><h3>Was bedeutet „Abstammung“?</h3><p>'+A().story+'</p><p><strong>Wissenschaftlich wichtig:</strong> Alte Knochenfunde und Erbgut helfen bei der Erforschung. Einzelheiten der Domestikation werden weiter untersucht.</p></aside></div>'+
 callout('Merksatz','Ein Haustier entsteht nicht, weil ein einzelnes Wildtier plötzlich „zahm“ wird. Domestikation ist ein Prozess über viele Generationen.')+
 navLine('teeth','Weiter: Das Gebiss');
}
function toothSketch(){
 const colors={incisor:'#7eb6b8',canine:'#e5a55d',premolar:'#9d8dcf',molar:'#82a87c'};
 const top='<path d="M65 123Q149 87 287 96L654 105Q688 135 684 155L673 185L74 185Z" fill="#e8cfb1" stroke="#ac8c6f" stroke-width="5"/>';
 const bottom='<path d="M75 238Q158 249 297 254L660 243L678 277Q580 316 302 316Q146 307 70 272Z" fill="#e8cfb1" stroke="#ac8c6f" stroke-width="5"/>';
 const teeth=[];
 const sequence=animal==='dog'?['incisor','incisor','incisor','canine','premolar','premolar','premolar','premolar','molar','molar']:['incisor','incisor','incisor','canine','premolar','premolar','premolar','molar'];
 const start=96,spacing=animal==='dog'?57:72;
 sequence.forEach((k,i)=>{const x=start+i*spacing;
   const size=k==='canine'?51:k==='incisor'?25:k==='molar'?30:40;
   teeth.push('<path d="M'+(x-18)+' 185L'+(x-15)+' '+(185+size)+'L'+x+' '+(195+size*1.13)+'L'+(x+17)+' 185Z" fill="'+colors[k]+'" stroke="#6d776b" stroke-width="2.5" opacity="'+(tooth===k?'1':'.76')+'"/>');
   teeth.push('<path d="M'+(x-18)+' 239L'+(x-14)+' '+(239-size*.63)+'L'+x+' '+(239-size*.86)+'L'+(x+18)+' 239Z" fill="'+colors[k]+'" stroke="#6d776b" stroke-width="2.5" opacity="'+(tooth===k?'1':'.76')+'"/>');
 });
 return '<svg class="tooth-svg" viewBox="0 0 760 360" role="img" aria-label="Schematische Seitenansicht der oberen und unteren Zahnreihe mit farbigen Zahntypen"><rect width="760" height="360" fill="#faf7f0"/><text x="30" y="39" font-size="25" font-weight="850" fill="#395a57">'+A().name+' · Zahntypen</text><text x="30" y="69" font-size="14" fill="#627775">Beispielhafte Seitenansicht, nicht alle '+A().teeth+' Zähne abgebildet</text>'+top+bottom+teeth.join('')+'<text x="65" y="342" font-size="14" fill="#587772">Oben: Oberkiefer · Unten: Unterkiefer · Farben = unterschiedliche Aufgaben</text></svg>'
}
function teethPage(){
 const d=DENTAL.find(x=>x.id===tooth);
 const data=animal==='dog'?['12','4','16','10']:['12','4','10','4'];
 return pageTitle('03',animal==='dog'?'Das Gebiss des Hundes':'Das Gebiss der Katze','Warum haben Raubtiere keine breiten Mahlzähne wie Kühe? Wähle die Zahntypen und erfahre, was sie können.')+
 '<div class="two"><div><div class="bone-board">'+toothSketch()+'</div><p class="diagram-caption">Farbschema einer Seitenansicht. Die genaue Zahnanzahl gilt für das ganze Gebiss, nicht nur für diese Zeichnung.</p><div class="tooth-key">'+DENTAL.map((d,i)=>'<button type="button" data-tooth="'+d.id+'" class="'+(tooth===d.id?'active':'')+'"><span class="dot" style="background:'+d.color+'"></span>'+d.label+'<br><strong>'+data[i]+' Zähne</strong></button>').join('')+'</div><div class="detail"><h3>🦷 '+d.label+'</h3><p>'+d[animal]+'</p></div></div>'+
 '<aside class="panel"><div class="big-icon">🦷</div><h3>Das vollständige bleibende Gebiss</h3><div class="score">'+A().teeth+'</div><p><b>'+A().name+': '+A().teeth+' bleibende Zähne.</b> Das Milchgebiss hat normalerweise '+A().milk+' Zähne.</p><p>'+A().diet+'</p><h3>Was sind Reißzähne?</h3><p>Ein oberer und ein unterer Backenzahn bilden zusammen eine scharfe „Schere“. Sie schneiden Fleisch und anderes Futter in Stücke.</p></aside></div>'+
 '<div class="info-cards spaced">'+card('✂️','Schneiden statt Mahlen','Fangzähne halten fest. Reißzähne schneiden. Der Hund hat außerdem mehr hintere Backenzähne, mit denen er auch Nahrung zerdrücken kann.')+card('🥩','Zusammenhang mit Nahrung','Die Zahnform passt zur ursprünglichen Lebensweise als Raubtier. Pflanzenfresser besitzen dagegen oft große Kauflächen zum Zerreiben faserreicher Nahrung.')+'</div>'+
 callout('Warum sind Hund und Katze verschieden?','Der Hund verwertet auch verschiedene pflanzliche Nahrungsbestandteile. Die Katze ist stärker auf tierische Beute spezialisiert und hat weniger Backenzähne mit Mahlflächen.')+
 navLine('hunt','Weiter: Auf der Jagd');
}
function huntPage(){
 const steps=animal==='dog'?[
 ['👃','Witterung aufnehmen','Gerüche helfen beim Aufspüren. Hunde können auch Spuren am Boden verfolgen.'],
 ['👀','Suchen oder Vorstehen','Manche Hunde suchen großflächig, andere zeigen gefundene Beute durch Erstarren an. Das hängt auch von Zucht und Erfahrung ab.'],
 ['🏃','Verfolgen','Kräftige Beinmuskeln, Herz und Lunge unterstützen Bewegung. Manche Wildhunde und Wölfe können kooperativ jagen.'],
 ['🐾','Packen und Festhalten','Fangzähne können Beute festhalten; Reißzähne schneiden Nahrung. Nicht jeder Haushund jagt tatsächlich.']
 ]:[
 ['👂','Beute bemerken','Sehr gutes Gehör und Sehen helfen, kleine Tiere auch bei wenig Licht zu finden.'],
 ['🤫','Lautlos anschleichen','Die Katze senkt den Körper und setzt die weichen Ballen vorsichtig auf. Krallen sind beim normalen Gehen oft eingezogen.'],
 ['⏳','Lauern','Sie beobachtet und wartet, bis der Abstand klein genug ist.'],
 ['⚡','Kurzer Sprung','Kräftige Hinterbeine treiben sie vorwärts. Die Vorderpfoten und Krallen helfen beim Fangen und Festhalten.']
 ];
 return pageTitle('04','Wie '+(animal==='dog'?'Hunde':'Katzen')+' jagen','Nicht jedes Haustier jagt gleich. Wir betrachten typische angeborene Verhaltensbausteine und den passenden Körperbau.')+
 '<div class="cols">'+steps.map((s,i)=>'<div class="fact"><div class="step-num">'+(i+1)+'</div><div class="big-icon">'+s[0]+'</div><h3>'+s[1]+'</h3><p>'+s[2]+'</p></div>').join('')+'</div>'+
 '<div class="info-cards spaced">'+card('🧠','Verhalten und Sinnesorgane',animal==='dog'?'Die Nase spielt oft eine zentrale Rolle. Auch Hören und Sehen helfen bei der Orientierung.':'Augen, Ohren und Tasthaare helfen dabei, die Bewegung und Entfernung der Beute einzuschätzen.')+
 card('🦴','Körperbau und Jagd',animal==='dog'?'Gliedmaßen, Muskeln, Pfoten und Gebiss unterstützen Suchen, Verfolgen und Festhalten.':'Wirbelsäule, Hinterbeine, Krallen und Reißzähne unterstützen Anschleichen, Springen und Packen.')+'</div>'+
 callout('Wichtig für den Alltag','Ein Hund kann einem Ball hinterherjagen, eine Katze eine Spielmaus anspringen: Solche Spiele nutzen Teile des Jagdverhaltens. Jagdverhalten ist nicht automatisch Angriffslust gegenüber Menschen.')+
 navLine('motion','Weiter: So bewegen sie sich');
}
function gaitSvg(){
 const isCat=animal==='cat',run=gait==='run',jump=gait==='jump',sneak=gait==='sneak';
 const y=jump?104:sneak?185:145;
 const back=isCat&&run?'M280 '+(y+3)+'Q390 '+(y-75)+' 510 '+(y+8):'M280 '+(y+10)+'Q396 '+(y-12)+' 520 '+(y+15);
 const legs=jump?'<path d="M292 '+(y+70)+'L247 '+(y+110)+'L198 '+(y+88)+' M505 '+(y+78)+'L572 '+(y+130)+'L640 '+(y+111)+'" />':
 run?'<path d="M294 '+(y+80)+'L255 '+(y+144)+'L205 '+(y+150)+' M508 '+(y+78)+'L562 '+(y+144)+'L610 '+(y+150)+'" />':
 '<path d="M295 '+(y+78)+'L282 '+(y+144)+'L259 '+(y+170)+' M502 '+(y+80)+'L524 '+(y+146)+'L497 '+(y+170)+'" />';
 const tail=isCat?'M536 '+(y+15)+'Q603 '+(y-45)+' 643 '+(y-13)+'Q665 '+(y+10)+' 649 '+(y+30):'M530 '+(y+10)+'Q617 '+(y-10)+' 658 '+(y-45);
 return '<svg class="gait-svg" viewBox="0 0 760 340" aria-label="Schematische Bewegungsdarstellung: '+A().name+' '+gait+'" role="img"><rect width="760" height="340" fill="#f6faf5"/><path d="M30 302H726" stroke="#b3d7c6" stroke-width="3" stroke-dasharray="7 7"/><path d="'+back+'" stroke="#4b8279" stroke-width="7" fill="none"/><ellipse cx="397" cy="'+(y+58)+'" rx="139" ry="74" fill="#a5cbb6" stroke="#4b8279" stroke-width="4"/><path d="'+tail+'" stroke="#5c9885" stroke-width="19" fill="none" stroke-linecap="round"/><path d="'+legs+'" stroke="#4b8279" stroke-width="23" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="228" cy="'+(y+26)+'" r="'+(isCat?47:52)+'" fill="#a5cbb6" stroke="#4b8279" stroke-width="4"/><path d="M189 '+(y-2)+'L190 '+(y-54)+'L211 '+(y-28)+'L238 '+(y-53)+'L252 '+(y+10)+'" fill="#a5cbb6" stroke="#4b8279" stroke-width="4"/><path d="M189 '+(y+38)+'Q150 '+(y+43)+' 138 '+(y+15)+'" stroke="#4b8279" fill="#a5cbb6" stroke-width="15" stroke-linecap="round"/><circle cx="204" cy="'+(y+20)+'" r="6" fill="#284b46"/><path d="M126 '+(y+10)+'Q130 '+(y+18)+' 143 '+(y+16)+'" stroke="#284b46" fill="none" stroke-width="3"/><path d="M35 '+(y+40)+'h85m-19 -12l19 12l-19 12" stroke="#db9350" stroke-width="5" fill="none"/><text x="40" y="45" font-size="20" font-weight="850" fill="#32655a">'+(jump?'Absprung':run?'Schneller Lauf':sneak?'Anschleichen':'Gehen')+'</text><text x="40" y="75" font-size="14" fill="#577c72">Vereinfachtes Bewegungsmodell</text></svg>'
}
function motionPage(){
 const items=animal==='dog'?[
 ['walk','🚶','Gehen','Auf Zehen und Ballen; bei langsamem Gehen werden die Beine nacheinander gesetzt.'],
 ['run','🏃','Schnell laufen','Muskeln in Vorder- und Hinterbeinen sowie der bewegliche Rücken arbeiten zusammen.'],
 ['sneak','👃','Spur suchen','Kopf und Nase können dicht am Boden sein. Pfotenballen geben Halt.'],
 ['jump','🦘','Springen','Die Hinterbeine stoßen ab; Vorderbeine helfen beim Abfangen der Landung.']
 ]:[
 ['walk','🐾','Leise gehen','Weiche Ballen dämpfen Schritte; meist eingezogene Krallen bleiben geschützt.'],
 ['run','💨','Sprinten','Rücken beugt und streckt sich deutlich, Beine greifen weit aus.'],
 ['sneak','🤫','Anschleichen','Geduckter Körper, vorsichtige Schritte und gespannter Blick auf die Beute.'],
 ['jump','🦘','Springen','Kräftige Hinterbeine stoßen ab, Rücken streckt sich, Vorderpfoten fangen die Landung ab.']
 ];
 return pageTitle('05','Fortbewegung: Knochen als Hebel','Muskeln ziehen an Knochen, Gelenke ermöglichen Bewegung. Wähle eine Bewegungsart – und überlege, welche Knochen und Muskeln dabei gebraucht werden.')+
 '<div class="mood-options">'+items.map(x=>'<button type="button" class="mood-option '+(gait===x[0]?'active':'')+'" data-gait="'+x[0]+'">'+x[1]+' '+x[2]+'</button>').join('')+'</div>'+
 '<div class="two"><div class="bone-board">'+gaitSvg()+'</div><section class="panel"><h3>'+items.find(x=>x[0]===gait)[1]+' '+items.find(x=>x[0]===gait)[2]+'</h3><p>'+items.find(x=>x[0]===gait)[3]+'</p><p><strong>Was bewegt die Knochen?</strong> Muskeln ziehen sich zusammen und übertragen die Kraft über Sehnen. Gelenke geben die Bewegungsrichtung vor.</p></section></div>'+
 '<div class="cols spaced">'+card('🦶','Zehengänger','Hund und Katze setzen vor allem Zehen und Ballen auf. Das scheinbar rückwärts gerichtete Knie am Hinterbein ist das Sprunggelenk.')+
 card('🦴','Wirbelsäule','Sie stützt den Körper und ist beweglich. Besonders bei der Katze hilft die starke Biegsamkeit beim Springen und Sprinten.')+
 card('💪','Muskeln','Die Hinterbeine erzeugen Vortrieb. Vorderbeine stützen, lenken und nehmen beim Landen Kräfte auf.')+'</div>'+
 navLine('signals','Weiter: Körpersprache');
}
function moodSvg(){
 const isCat=animal==='cat',fear=mood==='fear'||mood==='flee',threat=mood==='threat'||mood==='attack',hunt=mood==='hunt',play=mood==='play';
 const y=fear?196:hunt?198:threat&&isCat?147:mood==='attack'?155:171, headY=y-28;
 const tail=threat&&isCat?'M535 '+(y+14)+'Q586 '+(y-75)+' 622 '+(y-8)+'Q631 '+(y+15)+' 650 '+(y-7):
 fear?'M537 '+(y+18)+'Q585 '+(y+74)+' 614 '+(y+92):
 hunt?'M545 '+(y+12)+'Q600 '+(y+32)+' 626 '+(y+13):
 play?'M544 '+(y+13)+'Q608 '+(y-63)+' 650 '+(y-20):
 'M544 '+(y+16)+'Q604 '+(y-10)+' 646 '+(y-38);
 const ears= fear||threat?'<path d="M184 '+(headY-26)+'l-15 31m68 -28l21 30" fill="none" stroke="#497d73" stroke-width="18" stroke-linecap="round"/>':
 '<path d="M185 '+(headY-8)+'l-14 -48l34 31l28 -30l13 52" fill="#98c5aa" stroke="#497d73" stroke-width="5"/>';
 const eyes=threat?'<path d="M194 '+(headY+8)+'h17" stroke="#243b38" stroke-width="5"/>':'<ellipse cx="205" cy="'+(headY+8)+'" rx="'+(fear?8:5)+'" ry="'+(fear?9:5)+'" fill="#243b38"/>';
 const body='<ellipse cx="393" cy="'+(y+39)+'" rx="159" ry="'+(threat&&isCat?71:64)+'" fill="'+(threat?'#bc997b':'#a5cdb4')+'" stroke="#4c8074" stroke-width="5"/>';
 const back=threat&&isCat?'<path d="M269 '+(y+10)+'Q388 '+(y-128)+' 536 '+(y+6)+'" fill="none" stroke="#8e735b" stroke-width="19"/>':'';
 const legs=fear||hunt?'<path d="M301 '+(y+77)+'l-24 33h-44M506 '+(y+75)+'l-11 32h-47" stroke="#4c8074" stroke-width="22" fill="none" stroke-linecap="round"/>':
 play&&animal==='dog'?'<path d="M294 '+(y+68)+'l-70 86h-56M504 '+(y+74)+'l29 89h-24" stroke="#4c8074" stroke-width="21" fill="none" stroke-linecap="round"/>':
 '<path d="M308 '+(y+81)+'l-11 85h-29M498 '+(y+83)+'l18 83h-25" stroke="#4c8074" stroke-width="22" fill="none" stroke-linecap="round"/>';
 return '<svg class="mood-svg" viewBox="0 0 760 370" role="img" aria-label="Lernzeichnung Körpersprache: '+A().name+', '+MOODS[mood].title+'"><rect width="760" height="370" fill="#f5faf6"/><path d="M20 333H735" stroke="#b4d4c7" stroke-width="3" stroke-dasharray="8 7"/><text x="24" y="43" font-size="23" font-weight="850" fill="#3e776c">'+MOODS[mood].title+'</text><path d="'+tail+'" stroke="'+(threat?'#9c795c':'#5f9984')+'" stroke-width="'+(threat&&isCat?24:19)+'" stroke-linecap="round" fill="none"/>'+back+body+legs+'<circle cx="216" cy="'+headY+'" r="53" fill="'+(threat?'#bc997b':'#a5cdb4')+'" stroke="#4c8074" stroke-width="5"/>'+ears+'<path d="M181 '+(headY+23)+'Q141 '+(headY+18)+' 137 '+(headY+35)+'Q143 '+(headY+50)+' 175 '+(headY+46)+'" fill="#a5cdb4" stroke="#4c8074" stroke-width="4"/>'+eyes+'<circle cx="140" cy="'+(headY+32)+'" r="6" fill="#243b38"/>'+(threat?'<path d="M137 '+(headY+44)+'l10 7l9 -7l10 7" fill="none" stroke="#f8faf1" stroke-width="4"/>':'')+'<text x="40" y="352" font-size="13" fill="#618478">Schematisch: Haltung + Situation immer gemeinsam lesen.</text></svg>';
}
function signalsPage(){
 const m=MOODS[mood];
 return pageTitle('06','Körpersprache richtig lesen','Ein Tier zeigt Gefühle und Absichten durch Haltung, Bewegung, Augen, Ohren und Schwanz. Entscheidend ist das Gesamtbild.')+
 '<div class="mood-options">'+Object.entries(MOODS).map(([k,x])=>'<button type="button" data-mood="'+k+'" class="mood-option '+(mood===k?'active':'')+'">'+x.icon+' '+x.title+'</button>').join('')+'</div>'+
 '<div class="two"><div class="bone-board">'+moodSvg()+'</div><div class="panel"><span class="kicker">WAS KÖNNTE DAS TIER ZEIGEN?</span><h3>'+m.icon+' '+m.title+'</h3><p>'+m[animal]+'</p><div class="signal-points">'+m.features.map(f=>'<div class="fact"><strong>'+f+'</strong></div>').join('')+'</div></div></div>'+
 callout('So verhältst du dich sicher',m.notice)+
 '<div class="info-cards">'+card('🔎','Nicht nur auf den Schwanz schauen','Schwanzwedeln bedeutet nicht immer Freundlichkeit. Auch aufgerichtetes Fell oder angelegte Ohren müssen zusammen mit der ganzen Situation betrachtet werden.')+
 card('❤️','Tiere nicht erschrecken','Angst, Drohen und Flucht sind wichtige Signale. Rückzug ermöglichen statt festhalten. Ein Erwachsener hilft bei unsicheren Situationen.')+'</div>'+
 navLine('compare','Weiter: Hund und Katze vergleichen');
}
function comparePage(){
 const rows=[
 ['Abstammung','Frühere Wolfspopulationen','Afrikanisch-vorderasiatische Wildkatze'],
 ['Bleibendes Gebiss','42 Zähne; mehr Mahl- und Quetschflächen','30 Zähne; sehr scharfe Schneidekanten'],
 ['Jagdweise','Je nach Art und Rasse suchen, verfolgen, teils gemeinsam jagen','Meist allein anschleichen, lauern und kurz springen'],
 ['Bewegung','Viele Hunde laufen ausdauernd; Rassen variieren stark','Geschickt beim Klettern, Sprinten und Springen'],
 ['Pfoten/Krallen','Ballen polstern; Krallen meist nicht einziehbar','Ballen polstern; Krallen meist einziehbar'],
 ['Wirbelsäule','Beweglich, stabilisiert und unterstützt die Laufbewegung','Besonders biegsam bei Sprint und Sprung'],
 ['Kommunikation','Ohren, Mimik, Körper, Schwanz, Laute','Ohren, Mimik, Körper, Schwanz, Laute']
 ];
 return pageTitle('07','Gemeinsamkeiten und Unterschiede','Vergleiche beide Tiere. Erkläre immer mit einem „weil“, wie ein Körpermerkmal zu einer Aufgabe passt.')+
 '<div class="panel white"><table class="compare-table"><thead><tr><th>Merkmal</th><th>🐕 Hund</th><th>🐈 Katze</th></tr></thead><tbody>'+rows.map(r=>'<tr><th>'+r[0]+'</th><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>').join('')+'</tbody></table></div>'+
 '<div class="cols spaced">'+card('🦴','Beide Säugetiere','Beide besitzen ein inneres Skelett mit Wirbelsäule, vier Gliedmaßen, Muskeln und Gelenken.')+
 card('🦷','Beide Raubtiere','Beide haben Fang- und Reißzähne – aber unterschiedlich viele hintere Backenzähne.')+
 card('🐾','Beide Zehengänger','Beide gehen auf Ballen und Zehen, nicht wie Menschen auf der ganzen Fußsohle.')+'</div>'+
 callout('Forscherauftrag','Erkläre: „Die Katze hat sehr bewegliche Wirbel, weil …“ oder „Der Hund hat kräftige Hinterbeine, weil …“. Nutze immer einen Zusammenhang zwischen Bau und Funktion.')+
 '<div class="panel spaced"><h3>Fachliche Quellen zum Nachlesen</h3><ul class="list"><li><a href="https://www.merckvetmanual.com/digestive-system/dental-development-and-anatomy/dentition-and-dental-nomenclature-of-animals" target="_blank" rel="noopener">Merck Veterinary Manual – Tiergebisse</a></li><li><a href="https://vet.ucalgary.ca/summercamps/anatomy/monday/small-animal" target="_blank" rel="noopener">University of Calgary – Skelettanatomie</a></li><li><a href="https://www.rspca.org.uk/adviceandwelfare/pets/dogs/behaviour/understanding" target="_blank" rel="noopener">RSPCA – Körpersprache beim Hund</a> und <a href="https://www.rspca.org.uk/adviceandwelfare/pets/cats/behaviour" target="_blank" rel="noopener">bei der Katze</a></li><li><a href="https://www.loc.gov/everyday-mysteries/categories/zoology/item/how-did-cats-become-domesticated/" target="_blank" rel="noopener">Library of Congress – Herkunft der Hauskatze</a></li><li><a href="https://www.si.edu/stories/your-dog-little-wolfy" target="_blank" rel="noopener">Smithsonian – Herkunft des Hundes</a></li></ul></div>'+
 navLine('quiz','Weiter: Wissenstest starten');
}
function resetQuiz(){
 quiz=Q.filter(x=>x.animal===animal||x.animal==='both').sort((a,b)=>Q.indexOf(a)-Q.indexOf(b));
 qi=0;chosen=null;checked=false;hints=0;score=0;
}
function quizPage(){
 if(!quiz.length)resetQuiz();
 if(qi>=quiz.length){
 const pct=Math.round(score/quiz.length*100);
 if(score>best[animal]){best[animal]=score;try{localStorage.setItem(KEY,JSON.stringify({best:best}))}catch(e){}}
 return pageTitle('08','Wissenstest abgeschlossen','Dein Ergebnis wird nur auf diesem Gerät gespeichert.')+
 '<div class="panel white"><span class="kicker">DEIN ERGEBNIS</span><div class="score">'+score+' / '+quiz.length+'</div><h3>'+(pct>=85?'🏆 Tierforscher-Profi!':pct>=60?'🌱 Schon viel verstanden!':'🔍 Nächste Runde wird besser!')+'</h3><p>Du hast '+pct+' % der Fragen richtig beantwortet. '+(pct>=85?'Du kannst Skelett, Gebiss und Verhalten sehr gut erklären.':'Schau dir die Erklärungen noch einmal an und versuche es erneut.')+'</p><p>Dein bisheriges bestes Ergebnis für '+A().name+': '+best[animal]+' von '+quiz.length+'.</p><div class="actionline"><button class="btn" data-action="restart">Erneut üben</button><button class="btn secondary" data-section="skeleton">Skelett wiederholen</button></div></div>';
 }
 const q=quiz[qi],percent=Math.round(qi/quiz.length*100),letters=['A','B','C','D'];
 return pageTitle('08','Wissenstest · '+A().name,'Teste dein Wissen über Knochen, Zähne, Jagd, Bewegung und Körpersprache. Jede Antwort wird erklärt.')+
 '<div class="panel white"><div class="quiz-head"><span class="kicker">FRAGE '+(qi+1)+' VON '+quiz.length+'</span><span class="mini-tag">⭐ '+score+' richtig</span></div><div class="meter" aria-label="'+percent+' Prozent abgeschlossen"><span style="width:'+percent+'%"></span></div><h3 style="font-size:1.25rem">'+escapeHtml(q.q)+'</h3>'+
 '<div class="answers">'+q.a.map((a,i)=>'<button type="button" data-answer="'+i+'" class="answer '+(chosen===i?'chosen ':'')+(checked&&i===q.c?'correct ':checked&&chosen===i?'wrong ':'')+'" '+(checked?'disabled':'')+'><strong>'+letters[i]+'.</strong> '+escapeHtml(a)+'</button>').join('')+'</div>'+
 (hints>0&&!checked?'<div class="callout"><strong>💡 Hinweis '+hints+'</strong><p>'+(hints===1?escapeHtml(q.hint):'Überlege, welche Funktion das Merkmal wirklich erfüllt. Streiche Antworten, die biologisch nicht passen.')+'</p></div>':'')+
 (checked?'<div class="feedback '+(chosen===q.c?'':'bad')+'" role="status"><strong>'+(chosen===q.c?'✓ Richtig!':'↗ Noch nicht richtig.')+'</strong><p><b>Richtige Antwort:</b> '+escapeHtml(q.a[q.c])+'</p><p>'+escapeHtml(q.why)+'</p>'+(chosen!==q.c?'<small>Warum deine Wahl nicht passt: Diese Aussage erfüllt die in der Erklärung beschriebene Funktion nicht.</small>':'')+'</div>':'')+
 '<div class="actionline">'+(!checked?'<button class="btn" data-action="check" '+(chosen===null?'disabled':'')+'>Antwort prüfen</button><button class="btn secondary" data-action="hint" '+(hints>=2?'disabled':'')+'>💡 Hilfe '+hints+'/2</button>':
 '<button class="btn" data-action="next">'+(qi+1===quiz.length?'Ergebnis anzeigen':'Nächste Frage')+' →</button>')+'<button class="btn secondary" data-action="restart">Neu starten</button></div></div>'+
 '<p class="smallnote">Lernen statt Raten: Bei falschen Antworten wird die richtige Begründung angezeigt. Tipps sind zum Lernen gedacht.</p>';
}
function updateControls(){
 document.querySelectorAll('[data-species]').forEach(x=>{x.classList.toggle('active',x.dataset.species===animal);x.setAttribute('aria-pressed',String(x.dataset.species===animal))});
 document.querySelectorAll('#sections [data-section]').forEach(x=>x.classList.toggle('active',x.dataset.section===section));
}
function render(focus){
 updateControls();
 const views={skeleton:skeletonPage,origin:originPage,teeth:teethPage,hunt:huntPage,motion:motionPage,signals:signalsPage,compare:comparePage,quiz:quizPage};
 $('#content').innerHTML=(views[section]||skeletonPage)();
 if(window.BioSkeletonLab)window.BioSkeletonLab.mount({animal,section,bone,gait});
 if(window.BioLernstudio)window.BioLernstudio.mount({animal,section});
 if(window.BioDentalLab)window.BioDentalLab.mount({animal,section});
 if(focus){$('#content').focus({preventScroll:true});scrollTo({top:0,behavior:'instant'});}
}
function toast(txt){const t=$('#toast');t.textContent=txt;t.classList.add('show');clearTimeout(toast.id);toast.id=setTimeout(()=>t.classList.remove('show'),2300)}
function chooseSection(v){section=v;location.hash=animal+'/'+section;render(true)}
function chooseAnimal(v){animal=v;bone='spine';tooth='canine';mood='relax';gait='walk';resetQuiz();location.hash=animal+'/'+section;render(true)}
document.addEventListener('click',function(e){
 const diagramBone=e.target.closest('[data-bone]');
 if(diagramBone&&!diagramBone.matches('button')){bone=diagramBone.dataset.bone;render(false);return}
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.species){chooseAnimal(b.dataset.species);return}
 if(b.dataset.section){chooseSection(b.dataset.section);return}
 if(b.dataset.bone){bone=b.dataset.bone;render(false);return}
 if(b.dataset.tooth){tooth=b.dataset.tooth;render(false);return}
 if(b.dataset.mood){mood=b.dataset.mood;render(false);return}
 if(b.dataset.gait){gait=b.dataset.gait;render(false);return}
 if(b.dataset.answer!==undefined&&!checked){chosen=Number(b.dataset.answer);render(false);return}
 if(b.dataset.action==='zoom'){const frame=document.querySelector('.bone-board');if(frame){frame.classList.toggle('zoomed');b.textContent=frame.classList.contains('zoomed')?'🔎 Wieder verkleinern':'🔎 Skelett vergrößern';}return}
 if(b.dataset.action==='hint'&&!checked){hints=Math.min(2,hints+1);render(false);return}
 if(b.dataset.action==='check'&&chosen!==null&&!checked){checked=true;if(chosen===quiz[qi].c)score++;render(false);return}
 if(b.dataset.action==='next'&&checked){qi++;checked=false;chosen=null;hints=0;render(false);return}
 if(b.dataset.action==='restart'){resetQuiz();render(false);return}
});
$('#content').addEventListener('keydown',function(e){const g=e.target.closest('[data-bone]');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();bone=g.dataset.bone;render(false)}});
$('#theme').addEventListener('click',()=>{document.body.classList.toggle('dark');try{localStorage.setItem(KEY+'-theme',document.body.classList.contains('dark')?'dark':'light')}catch(e){}});
$('#font').addEventListener('click',()=>{const n=Number(document.documentElement.style.getPropertyValue('--scale')||1);document.documentElement.style.setProperty('--scale',String(n>=1.25?1:n+.125));toast('Schriftgröße angepasst')});
$('#speak').addEventListener('click',()=>{if(!('speechSynthesis' in window)){toast('Vorlesen ist in diesem Browser nicht verfügbar.');return}if(speechSynthesis.speaking){speechSynthesis.cancel();toast('Vorlesen beendet');return}const t=new SpeechSynthesisUtterance($('#content').innerText);t.lang='de-DE';t.rate=.89;const v=speechSynthesis.getVoices().find(x=>x.lang.toLowerCase().startsWith('de'));if(v)t.voice=v;speechSynthesis.speak(t);toast('Vorlesen gestartet · erneut tippen zum Stoppen')});
$('#print').addEventListener('click',()=>window.print());
window.addEventListener('hashchange',()=>{const p=decodeURIComponent(location.hash.slice(1)).split('/');if(SPECIES[p[0]]&&['skeleton','origin','teeth','hunt','motion','signals','compare','quiz'].includes(p[1])){animal=p[0];section=p[1];if(section==='quiz')resetQuiz();render(false)}});
try{if(localStorage.getItem(KEY+'-theme')==='dark')document.body.classList.add('dark')}catch(e){}
const initial=decodeURIComponent(location.hash.slice(1)).split('/');
if(SPECIES[initial[0]])animal=initial[0];
if(['skeleton','origin','teeth','hunt','motion','signals','compare','quiz'].includes(initial[1]))section=initial[1];
resetQuiz();render(false);
window.BioTierkundeSelfTest=function(){return BONES.length===9&&DENTAL.length===4&&Q.filter(x=>x.animal==='dog').length>=10&&Q.filter(x=>x.animal==='cat').length>=10&&!!$('#content')&&!!$('.skeleton-svg')||section!=='skeleton'};
})();

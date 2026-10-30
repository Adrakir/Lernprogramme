/* Pruefungsfit Klasse 5: anschaulich – begruendet – geuebt – geprueft.
   Zusatz zum bestehenden Erdkunde-Entdecker, ohne bestehende Lernstaende zu aendern. */
(function(){
'use strict';
const nav=document.getElementById('tabs'),main=document.getElementById('main');
if(!nav||!main)return;
const STORE='erdkunde-pruefungsfit-v1',BLUE='#1766a1',PURPLE='#963574';
const U=[
{id:'linien',title:'Äquator und Nullmeridian',goal:'Du erkennst beide Bezugslinien und begründest ihren Unterschied.',intro:'Zwei Linien mit 0° – aber zwei ganz verschiedene Aufgaben.',steps:[
'Stelle die Erdkugel aufrecht vor dich: Nordpol oben, Südpol unten.',
'Der Äquator ist ein Breitenkreis bei 0° Breite. Er trennt Nord- und Südhalbkugel.',
'Der Nullmeridian verläuft als halber Längenkreis von Pol zu Pol bei 0° Länge. Zusammen mit dem 180°-Meridian grenzt er Ost und West ab.',
'Merke dir nicht nur die Farbe: Frage immer, was gemessen wird – Breite oder Länge.'
],rule:'Äquator = 0° Breite. Nullmeridian = 0° Länge.',mistake:'„Der Nullmeridian teilt allein die Erde in zwei Hälften.“ Nein: Erst mit dem gegenüberliegenden 180°-Meridian bildet er die Grenzlinie.',qs:[
['Welche Linie liegt bei 0° geografischer Breite?',['Äquator','Nullmeridian','Nordpol','180°-Meridian'],0,'Der Äquator ist der Ausgangskreis für die Breitenangabe.'],
['Welche Linie ist der Bezug für geografische Länge?',['Äquator','Nullmeridian','Wendekreis','Nordpol'],1,'Die Länge misst den Winkelabstand östlich oder westlich des Nullmeridians.'],
['Was trennt Nord- und Südhalbkugel?',['Nullmeridian','180°-Meridian','Äquator','Ein beliebiger Meridian'],2,'Der Äquator liegt genau zwischen den Polen bei 0° Breite.'],
['Welche Aussage stimmt?',['Der Äquator führt durch beide Pole.','Alle Breitenkreise sind gleich groß.','Der Nullmeridian führt von Pol zu Pol.','Der Äquator ist ein Längenkreis.'],2,'Meridiane verlaufen von Pol zu Pol; der Äquator liegt quer dazu.'],
['Was bildet zusammen mit dem Nullmeridian die Grenze der Ost- und Westhalbkugel?',['Der 180°-Meridian','Der nördliche Wendekreis','Der Äquator','Der 90°-Breitenkreis'],0,'Nullmeridian und gegenüberliegender 180°-Meridian bilden einen vollständigen Großkreis.'],
['Welche Bezeichnung passt zu 0° Länge?',['Äquator','Greenwich-Meridian','Südpol','Nordhalbkugel'],1,'Der Nullmeridian wird auch Greenwich-Meridian genannt.']
]},
{id:'gradnetz',title:'Breitenkreise und Meridiane',goal:'Du verfolgst die Linien und kannst ihre Wirkung aus zwei Blickrichtungen erklären.',intro:'Ein Gradnetz ist wie ein Suchsystem: Zwei Angaben bestimmen zusammen die Lage.',steps:[
'Schaue zuerst auf Breitenkreise: Sie verlaufen parallel zum Äquator.',
'Von 0° am Äquator steigen die Breitengrade bis 90° N oder 90° S.',
'Meridiane verbinden Nord- und Südpol. Die Länge reicht bis 180° O oder 180° W.',
'Beim Blick auf die Pole erscheinen Breitenkreise als Ringe und Meridiane als Strahlen.'
],rule:'Breite → N/S vom Äquator. Länge → O/W vom Nullmeridian.',mistake:'„Meridiane sind immer senkrechte Striche.“ Nur in vereinfachten Kartendarstellungen. Auf der Kugel sind es Halbkreise.',qs:[
['Welche Linien verlaufen parallel zum Äquator?',['Meridiane','Breitenkreise','Höhenlinien','Kartengrenzen'],1,'Alle Breitenkreise verlaufen parallel zur Äquatorebene.'],
['Was verbindet jeder Meridian?',['Zwei Städte','Nordpol und Südpol','Zwei Punkte am Äquator ohne Pole','Zwei Höhenlinien'],1,'Ein Meridian ist ein halber Großkreis von Pol zu Pol.'],
['Wie weit reichen geografische Breitengrade?',['Bis 360°','Bis 180° N/S','Bis 90° N/S','Bis 60° N/S'],2,'An den Polen endet die Breitenzählung bei 90° N bzw. S.'],
['Wie weit reichen östliche oder westliche Längengrade?',['Bis 180°','Bis 90°','Bis 45°','Bis 500°'],0,'Der Gegenmeridian liegt bei 180° östlicher bzw. westlicher Länge.'],
['Was siehst du von oben auf einen Pol bei Breitenkreisen?',['Ringe','Nur einen Strich','Rechtecke','Zickzacklinien'],0,'Von der Polansicht liegen Breitenkreise ringförmig um den Mittelpunkt.'],
['Was siehst du von oben auf einen Pol bei Meridianen?',['Parallele Kreise','Strahlen, die am Pol zusammentreffen','Nur waagerechte Linien','Keine Linien'],1,'Alle Meridiane treffen sich an den Polen.']
]},
{id:'haelften',title:'Die vier Halbkugeln',goal:'Du unterscheidest Nord, Süd, Ost und West und ihre Grenzlinien.',intro:'Die Erde kann auf zwei verschiedene Arten halbiert werden.',steps:[
'Der Äquator bildet die gemeinsame Grenze der Nord- und Südhalbkugel.',
'Nördlich des Äquators liegt die Nordhalbkugel, südlich davon die Südhalbkugel.',
'Für Ost und West brauchst du den Nullmeridian und den 180°-Meridian als gemeinsame Grenze.',
'Ein Punkt auf einer Grenzlinie gehört nicht eindeutig zu genau einer der beiden angrenzenden Hälften.'
],rule:'Nord/Süd: Grenze Äquator. Ost/West: Grenzen 0° und 180° Länge.',mistake:'„Osthalbkugel heißt rechts auf jedem Bild.“ Das hängt von der Kartenansicht ab; entscheide mit der Längenangabe.',qs:[
['50° N liegt auf welcher Halbkugel?',['Südhalbkugel','Nordhalbkugel','Osthalbkugel allein','Westhalbkugel allein'],1,'N bedeutet nördlich des Äquators. Zusätzlich gibt es eine östliche oder westliche Lage.'],
['20° S liegt wo?',['Nördlich des Äquators','Südlich des Äquators','Auf dem Nordpol','Auf dem Nullmeridian'],1,'S bedeutet südlich des Äquators. Die Angabe beschreibt eine geografische Breite, keine Länge.'],
['Welcher Wert ist eine Westlänge?',['12° N','12° S','12° W','12° Höhe'],2,'W ist westliche Länge, gemessen vom Nullmeridian.'],
['Was grenzt Ost und West voneinander ab?',['Nur der Äquator','Nullmeridian und 180°-Meridian','Nur der Nordpol','Alle Breitenkreise'],1,'Die beiden gegenüberliegenden Meridiane bilden die Trennung.'],
['Was gilt für einen Ort genau auf dem Äquator?',['Er liegt eindeutig nur nördlich.','Er liegt eindeutig nur südlich.','Er liegt auf der Grenze von Nord und Süd.','Er liegt immer bei 180° Länge.'],2,'0° Breite liegt auf dem Äquator; dieser Kreis ist die gemeinsame Grenze beider Halbkugeln.'],
['Was bedeutet 65° O?',['Östlich des Nullmeridians','Oberhalb des Äquators','Östlich des Nordpols','65 km entfernt'],0,'Geografische Länge ist eine Winkelangabe, keine Entfernung in Kilometern.']
]},
{id:'viertel',title:'Nordost-, Nordwest-, Südost- und Südwestviertel',goal:'Du bestimmst ein Erdviertel aus zwei Koordinaten.',intro:'Zwei Entscheidungen ergeben ein Erdviertel – nicht einfach eine zufällige Ecke.',steps:[
'Lies zuerst die Breite: N bedeutet Nord, S bedeutet Süd.',
'Lies dann die Länge: O bedeutet Ost, W bedeutet West.',
'Setze beide Aussagen zusammen: N + W = Nordwestviertel; S + O = Südostviertel.',
'Prüfe Sonderfälle: 0° Breite, 0°/180° Länge oder ein Pol gehören nicht eindeutig zu einem Viertel.'
],rule:'Erst N/S, dann O/W – zwei Buchstaben, ein Erdviertel.',mistake:'„Nordwestviertel liegt auf jeder Weltkarte oben links.“ Das stimmt nur bei einer passenden, nordorientierten Kartendarstellung.',qs:[
['40° N / 10° W liegt im …',['Nordwestviertel','Nordostviertel','Südwestviertel','Südostviertel'],0,'N = nördlich, W = westlich. Zusammen: Nordwestviertel.'],
['23° S / 134° O liegt im …',['Nordostviertel','Südostviertel','Südwestviertel','Nordwestviertel'],1,'S bedeutet südlich des Äquators und O bedeutet östlich des Nullmeridians: Südostviertel.'],
['48° N / 2° O liegt im …',['Südostviertel','Nordwestviertel','Nordostviertel','Südwestviertel'],2,'N bedeutet nördlich des Äquators und O bedeutet östlich des Nullmeridians: Nordostviertel.'],
['15° S / 60° W liegt im …',['Südwestviertel','Nordwestviertel','Nordostviertel','Südostviertel'],0,'S bedeutet südlich des Äquators und W bedeutet westlich des Nullmeridians: Südwestviertel.'],
['0° / 30° O liegt …',['Im Nordostviertel','Auf der Grenze zwischen Nord und Süd','Im Südostviertel','Am Südpol'],1,'0° Breite liegt genau auf dem Äquator.'],
['90° N / 20° O bezeichnet …',['Einen Punkt im Nordostviertel','Den Nordpol; eine eindeutige Länge ist dort nicht sinnvoll','Den Äquator','Das Südwestviertel'],1,'Alle Meridiane treffen sich am Nordpol.']
]},
{id:'koordinaten',title:'Koordinaten und Schnittpunkte',goal:'Du liest Breite vor Länge und findest einen Punkt im Gradnetz.',intro:'Erst die waagerechte Breitenlinie verfolgen, dann den Meridian – am Schnittpunkt liegt der Ort.',steps:[
'Suche die geografische Breite zuerst am Kartenrand: zum Beispiel 52° N.',
'Folge dem passenden Breitenkreis in die Karte. Auf unserem Modell ist er blau.',
'Suche die Länge: zum Beispiel 8° O. Folge dem violetten Meridian.',
'Erst der Schnittpunkt beider Linien bestimmt den Ort. Kontrolliere N/S und O/W.'
],rule:'Koordinaten-Reihenfolge: Breite N/S, Länge O/W.',mistake:'„52° N allein zeigt einen genauen Ort.“ Nein. Viele Orte liegen auf demselben Breitenkreis.',qs:[
['Was liest du bei 52° N / 8° O zuerst?',['8° O','52° N','Die Kartenlegende','Die Höhe'],1,'Immer zuerst die Breite, danach die Länge.'],
['Welcher Wert beschreibt die geografische Länge?',['38° S','60° N','9° W','0° Breite'],2,'Ost und West sind Richtungen der geografischen Länge; Nord und Süd kennzeichnen die Breite.'],
['Wo liegt der gesuchte Punkt?',['Irgendwo auf 52° N','Am Schnittpunkt von 52° N und 8° O','Immer am Nordpol','Im Register'],1,'Ein Ort benötigt in der Regel beide Koordinaten.'],
['Was bedeutet 12° W?',['12 Grad südlich','12 Grad westlich des Nullmeridians','12 Kilometer westlich','12 Grad nördlich'],1,'Länge ist ein Winkel von 0° aus nach Ost oder West.'],
['Welches Koordinatenpaar gehört zu 40° südlicher Breite und 70° östlicher Länge?',['40° S / 70° O','70° O / 40° S','40° N / 70° W','70° S / 40° O'],0,'Die Breite steht zuerst, hier 40° S; dann folgt 70° O.'],
['Welche Angabe ist unvollständig, um einen Ort eindeutig zu bestimmen?',['50° N / 10° O','32° S / 5° W','48° N allein','20° S / 60° O'],2,'Ein einzelner Breitengrad beschreibt einen ganzen Kreis.']
]},
{id:'atlas',title:'Atlasarbeit: Register bis Planquadrat',goal:'Du findest den richtigen Eintrag, Kartenverweis und Ort.',intro:'Ein Registereintrag ist ein Wegweiser – kein geografisches Koordinatenpaar.',steps:[
'Schaue ins alphabetische Register und beachte gleiche Ortsnamen und den Landes- oder Regionszusatz.',
'Lies Kartenverweis und Planquadrat ab. Im Modell: Frankfurt am Main → Karte D, B3.',
'Suche zuerst die Karte D, dann Spalte B und Zeile 3. Am Schnitt liegt das Suchfeld.',
'Schaue innerhalb dieses Feldes nach dem Ortsnamen. Seiten- und Kartenverweise unterscheiden sich je nach Atlasausgabe.'
],rule:'Register → Karte → Planquadrat → Ort; Buchstabe = Spalte, Zahl = Zeile.',mistake:'„B3 sind geografische Koordinaten.“ Nein. Ein Planquadrat ist ein Suchfeld auf einer bestimmten Atlas-Karte.',qs:[
['Was ist bei einem unbekannten Ortsnamen zuerst hilfreich?',['Register','Gradmesser','Maßstabsleiste allein','Windrose allein'],0,'Das Register hilft, den Kartenverweis zu finden.'],
['Was bedeutet B3 im Modell?',['3° Breite','Spalte B und Zeile 3','Seite B3 immer in jedem Atlas','Ein Längengrad'],1,'Planquadrate werden oft durch Buchstaben und Zahlen bezeichnet.'],
['Warum ist die Region bei „Frankfurt“ wichtig?',['Es gibt mehrere Orte mit ähnlichem Namen.','Die Region ändert die Himmelsrichtungen.','Sie ersetzt den Kartenverweis.','Jede Region hat nur eine Karte.'],0,'Frankfurt am Main und Frankfurt (Oder) dürfen nicht verwechselt werden.'],
['Wo suchst du innerhalb einer Karte mit A–D und 1–4 das Feld C2?',['Spalte C, Zeile 2','Spalte B, Zeile 3','Spalte 2, Zeile C','Genau am Äquator'],0,'Zuerst Buchstabe für die Spalte, danach Zahl für die Zeile.'],
['Was gilt für Atlas-Seitenzahlen?',['Sie sind in allen Atlanten gleich.','Sie können je nach Ausgabe anders sein.','Sie sind immer Koordinaten.','Sie stehen nie im Register.'],1,'Karten- und Seitenzahlen hängen vom verwendeten Atlas ab.'],
['Was solltest du tun, wenn ein Ortsname mehrfach vorkommt?',['Eintrag und Region vergleichen','Den ersten blind wählen','Nur die Schriftfarbe anschauen','Immer die Weltkarte nehmen'],0,'Kontrolliere Region, Schreibweise und Kartenverweis.']
]},
{id:'ansichten',title:'Draufsicht und Seitenansicht',goal:'Du erkennst die Blickrichtung und kannst erklären, was man besser sieht.',intro:'Dasselbe Haus sieht von oben und von der Seite verschieden aus.',steps:[
'Bei der Draufsicht blickst du senkrecht von oben. Lage, Straßen und Gebäudegrundrisse sind leichter erkennbar.',
'Bei der Seitenansicht schaust du von der Seite. Höhe, Fenster, Dachform und Hangneigung sind leichter zu erkennen.',
'Wende den Unterschied auf die Erde an: Von einem Pol erkennst du Breitenkreise als Ringe und Meridiane wie Speichen.',
'Prüfe immer die Blickrichtung statt nur die äußere Form eines Bildes.'
],rule:'Von oben: Lage und Grundriss. Von der Seite: Höhe und Form.',mistake:'„Draufsicht ist immer eine Landkarte.“ Auch ein Luftbild kann eine Draufsicht zeigen; eine Karte enthält zusätzlich ausgewählte Zeichen.',qs:[
['Aus welcher Richtung blickt eine Draufsicht?',['Von oben','Von unten','Von der Seite','Immer von Süden'],0,'Draufsicht bedeutet Blick möglichst senkrecht von oben.'],
['Was siehst du in einer Seitenansicht besonders gut?',['Dachflächen von oben','Höhe und Dachform','Planquadrate','Nur Himmelsrichtungen'],1,'Höhen und Formen sind von der Seite besser zu erkennen.'],
['Was zeigt den Straßenverlauf besonders übersichtlich?',['Ein Seitenschnitt durch ein Haus','Eine Draufsicht','Die Tür eines Gebäudes','Nur ein Höhenprofil'],1,'Draufsichten zeigen die Lage von Straßen und Gebäuden.'],
['Wie wirken Meridiane beim Blick direkt auf einen Pol?',['Wie Speichen','Wie parallele Horizontalen','Wie Rechtecke','Unsichtbar'],0,'Die Meridiane laufen am Pol zusammen.'],
['Wie wirken Breitenkreise beim Blick auf einen Pol?',['Wie Speichen','Wie Ringe um den Pol','Wie Treppen','Wie einzelne Dreiecke'],1,'Die Breitenkreise sind konzentrische Kreise in der Polansicht.'],
['Was stimmt für eine Landkarte?',['Sie ist immer ein Foto.','Sie stellt ausgewählte Informationen mit Symbolen dar.','Sie zeigt jedes Auto.','Sie darf keine Legende haben.'],1,'Karten vereinfachen und erklären räumliche Informationen mit Zeichen.']
]},
{id:'karte',title:'Himmelsrichtungen und Karten lesen',goal:'Du orientierst dich auf einer Karte und deutest die Legende.',intro:'Nordpfeil, Legende und Maßstab helfen bei unterschiedlichen Fragen.',steps:[
'Suche den Nordpfeil. Nur wenn Norden oben liegt, ist Osten rechts und Westen links.',
'Für Nebenhimmelsrichtungen verbindest du zwei Richtungen: Nord + West = Nordwest.',
'Die Legende erklärt die Zeichen: In unserem Modell steht Blau für Wasser und Grün für Wald.',
'Prüfe beim Kartenlesen auch Titel und Maßstab. Ein Kartensymbol zeigt nicht automatisch die echte Größe eines Objekts.'
],rule:'Erst Kartenorientierung, dann Legende, dann die eigentliche Frage.',mistake:'„Auf jeder Karte ist Norden oben.“ Nein. Prüfe den Nordpfeil, besonders bei gedrehten Plänen.',qs:[
['Wo liegt Osten auf einer Karte mit Nordpfeil nach oben?',['Links','Rechts','Unten','Immer oben'],1,'Bei nordorientierten Karten liegt Osten rechts.'],
['Welche Nebenhimmelsrichtung liegt zwischen Nord und West?',['Südwest','Nordwest','Nordost','Südost'],1,'Zwischen Norden und Westen liegt die Nebenhimmelsrichtung Nordwest; bei einer nordorientierten Karte ist das oben links.'],
['Was erklärt die Zeichen einer Karte?',['Legende','Nur der Titel','Seitenrand allein','Der Verlag allein'],0,'Die Legende entschlüsselt Farben und Symbole.'],
['Wenn der Nordpfeil nach links zeigt, wo liegt Norden?',['Oben','Unten','Links','Rechts'],2,'Der Nordpfeil zeigt die tatsächliche Nordrichtung der jeweiligen Karte.'],
['Was zeigt der Maßstab?',['Verhältnis zwischen Kartenstrecke und Wirklichkeit','Nur die Himmelsrichtung','Die höchste Temperatur','Anzahl der Orte'],0,'Der Maßstab verbindet Kartenentfernung und reale Strecke.'],
['Warum zeigt eine Karte nicht jedes Hausdetail?',['Karten werden zur Übersicht vereinfacht.','Weil alle Häuser gleich aussehen.','Weil Karten keine Informationen haben.','Weil Farben verboten sind.'],0,'Kartografische Generalisierung wählt für den Zweck wesentliche Informationen aus.']
]}];
function E(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function load(){try{const v=JSON.parse(localStorage.getItem(STORE)||'{}');return v&&typeof v==='object'?v:{}}catch(e){return {}}}
const stored=load(),scores=stored.scores&&typeof stored.scores==='object'?stored.scores:{};
const s={mode:'overview',unit:0,phase:0,step:0,q:0,choice:null,checked:false,hint:false,test:null,version:1};
function persist(){try{localStorage.setItem(STORE,JSON.stringify({scores:scores}))}catch(e){}}
function button(t,act,kind){return '<button type="button" data-pf="'+E(act)+'" class="'+(kind||'')+'">'+E(t)+'</button>';}
function earth(x,y,r,mode,frame){let a='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#d7ecf4" stroke="#315a72" stroke-width="3"/>';
if(mode==='latitude'||mode==='both')for(let k of [-.65,0,.65])a+='<ellipse cx="'+x+'" cy="'+(y+k*r)+'" rx="'+(r*Math.sqrt(1-k*k)).toFixed(1)+'" ry="'+(k===0?10:7)+'" fill="none" stroke="'+(k===0?'#1766a1':'#6b9ab9')+'" stroke-width="'+(k===0&&frame>=2?6:2)+'"/>';
if(mode==='longitude'||mode==='both')for(let k of [-.6,0,.6])a+='<ellipse cx="'+x+'" cy="'+y+'" rx="'+(r*Math.sqrt(1-k*k)).toFixed(1)+'" ry="'+r+'" fill="none" stroke="'+(k===0&&frame>=3?'#963574':'#bc94b0')+'" stroke-width="'+(k===0&&frame>=3?6:2)+'"/>';
a+='<circle cx="'+x+'" cy="'+(y-r)+'" r="4" fill="#16394d"/><circle cx="'+x+'" cy="'+(y+r)+'" r="4" fill="#16394d"/>';return a;}
function art(topic,frame){
let content='',title='Lernmodell: '+topic.title;const txt=(x,y,t,size=18,col='#16394d')=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="'+col+'" font-size="'+size+'" font-weight="700">'+E(t)+'</text>';
if(topic.id==='linien'||topic.id==='gradnetz'){content+=earth(180,205,118,'latitude',frame)+earth(505,205,118,'longitude',frame)+txt(180,365,'Breite (N/S)',21,BLUE)+txt(505,365,'Länge (O/W)',21,PURPLE);if(frame>=2)content+=txt(180,209,'Äquator 0°',17,BLUE);if(frame>=3)content+=txt(505,209,'Nullmeridian 0°',16,PURPLE);}
else if(topic.id==='haelften'){content+='<circle cx="225" cy="210" r="128" fill="#d9ebf6" stroke="#315a72" stroke-width="3"/>';if(frame>=2)content+='<path d="M97 210 A128 128 0 0 1 353 210 Z" fill="#6cb9ed" opacity=".8"/>';content+='<ellipse cx="225" cy="210" rx="128" ry="17" fill="none" stroke="'+BLUE+'" stroke-width="5"/>'+txt(225,65,'N',23)+txt(225,370,'S',23);content+='<circle cx="510" cy="210" r="115" fill="#e4d6ed" stroke="#315a72" stroke-width="3"/>';if(frame>=3)content+='<path d="M510 95 A115 115 0 0 1 510 325 Z" fill="#bc8bce" opacity=".7"/>';content+='<ellipse cx="510" cy="210" rx="30" ry="115" fill="none" stroke="'+PURPLE+'" stroke-width="4"/>'+txt(510,65,'O/W: zwei Grenzmeridiane',17);}
else if(topic.id==='viertel'){content+='<rect x="75" y="72" width="570" height="265" rx="16" fill="#e6f1f5" stroke="#315a72" stroke-width="3"/><path d="M360 72 V337 M75 204 H645" stroke="#194a66" stroke-width="4"/>';let names=['Nordwest','Nordost','Südwest','Südost'];[[215,145],[505,145],[215,280],[505,280]].forEach((p,i)=>content+=txt(p[0],p[1],frame>=2?names[i]:'?',22));content+=txt(360,54,'N',22)+txt(360,375,'S',22)+txt(53,207,'W',21)+txt(671,207,'O',21);if(frame>=3)content+='<circle cx="208" cy="130" r="14" fill="#e7a52e" stroke="#50350c" stroke-width="3"/>'+txt(208,110,'40° N / 10° W',15);}
else if(topic.id==='koordinaten'){content+='<rect x="100" y="64" width="500" height="283" fill="#eaf3f7" stroke="#3a6175" stroke-width="3"/>';for(let i=0;i<=4;i++){let x=100+i*125;content+='<path d="M'+x+' 64 V347" stroke="#b3c2d1"/>'+txt(x,370,i===0?'0°':String(i*5)+'° O',15);}for(let i=0;i<=4;i++){let y=64+i*70.75;content+='<path d="M100 '+y+' H600" stroke="#b3c2d1"/>'+txt(63,y+5,String(60-i*5)+'° N',15);}if(frame>=2)content+='<path d="M100 177.2 H600" stroke="'+BLUE+'" stroke-width="6"/>'+txt(635,180,'52° N',16,BLUE);if(frame>=3)content+='<path d="M300 64 V347" stroke="'+PURPLE+'" stroke-width="6"/>'+txt(300,42,'8° O',17,PURPLE);if(frame>=4)content+='<circle cx="300" cy="177.2" r="12" fill="#ffcd4f" stroke="#513d13" stroke-width="3"/>'+txt(405,209,'Schnittpunkt',19);}
else if(topic.id==='atlas'){content+=txt(345,43,'Modellregister: Frankfurt am Main → Karte D, Feld B3',19);for(let i=0;i<4;i++){content+=txt(209+90*i,79,'ABCD'[i],19);content+=txt(131,130+i*65,String(i+1),19);for(let j=0;j<4;j++)content+='<rect x="'+(165+90*j)+'" y="'+(91+65*i)+'" width="90" height="65" stroke="#7b9ca2" fill="'+(frame>=3&&j===1&&i===2?'#f5cf72':'#e6f0e8')+'"/>';}if(frame>=3)content+=txt(300,256,'B3',23);content+=txt(350,392,'Planquadrat ≠ geografische Koordinate',17);}
else if(topic.id==='ansichten'){content+=txt(190,56,'Draufsicht',23)+txt(510,56,'Seitenansicht',23);content+='<rect x="78" y="95" width="220" height="205" rx="8" fill="#e9f2f1" stroke="#315a72" stroke-width="3"/><path d="M113 130 L263 130 L263 270 L113 270 Z" fill="#edc599" stroke="#315a72" stroke-width="4"/><path d="M113 130 L188 98 L263 130 L188 162 Z" fill="#b96d4a"/><path d="M400 170 L510 100 L620 170 Z" fill="#b96d4a" stroke="#315a72" stroke-width="3"/><rect x="415" y="170" width="190" height="134" fill="#edc599" stroke="#315a72" stroke-width="3"/><rect x="490" y="240" width="42" height="64" fill="#81593e"/><rect x="440" y="195" width="37" height="32" fill="#9dd6ea"/>';if(frame>=3)content+=txt(190,340,'Grundriss & Lage',18)+txt(510,340,'Höhe & Form',18);}
else {content+=txt(360,44,'Nordpfeil und Modell-Legende',20);content+='<circle cx="220" cy="207" r="128" fill="#eaf3f7" stroke="#315a72" stroke-width="3"/><path d="M220 97V317 M109 207H331" stroke="#5f7e91" stroke-width="3"/>';[['N',220,80],['O',350,214],['S',220,344],['W',90,214]].forEach(p=>content+=txt(p[1],p[2],p[0],21));if(frame>=2)content+='<path d="M220 105 L202 218 L220 207 L238 218 Z" fill="#c3573f"/>';content+='<rect x="424" y="108" width="200" height="208" rx="12" fill="#f0f4f5" stroke="#9ab2be"/>'+txt(518,145,'Legende',21);if(frame>=3)content+='<rect x="451" y="168" width="40" height="20" fill="#66a9dd"/>'+txt(558,185,'Wasser',16)+'<rect x="451" y="220" width="40" height="20" fill="#65a87a"/>'+txt(559,237,'Wald',16);}
return '<figure class="pf-figure"><svg viewBox="0 0 720 420" role="img" aria-label="'+E(title)+'" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="420" rx="20" fill="#f7fafc"/>'+content+'</svg><figcaption>Schematische Lernzeichnung, nicht maßstabsgetreu. Bildschritt '+frame+' von 4.</figcaption></figure>';
}
function topic(){return U[s.unit];}
function lesson(){
const t=topic(),q=t.qs[s.q],done=s.phase===3,percent=Math.round((s.q+(done?1:0))/t.qs.length*100);
let h='<section class="pf-panel" id="pf-root"><div class="pf-top">'+button('← Themenübersicht','overview','pf-quiet')+'<span>Lernweg '+(s.unit+1)+' / '+U.length+'</span></div><h1>'+E(t.title)+'</h1><p class="pf-goal">🎯 Lernziel: '+E(t.goal)+'</p>';
if(s.phase===0){h+='<h2>1. Ich sehe und verstehe</h2><p>'+E(t.intro)+'</p>'+art(t,s.step+1)+'<p class="pf-explain"><b>Gustav Globus erklärt:</b> '+E(t.steps[s.step])+'</p><div class="pf-controls">'+button('← Bildschritt zurück','backstep','pf-quiet')+button(s.step===3?'Weiter: Merksatz und Denkfehler':'Nächster Bildschritt →','nextstep','pf-main')+'</div>';}
if(s.phase===1){h+='<h2>2. Ich kann es erklären</h2>'+art(t,4)+'<div class="pf-rule"><strong>Merksatz</strong><p>'+E(t.rule)+'</p></div><div class="pf-trap"><strong>Typischer Denkfehler</strong><p>'+E(t.mistake)+'</p></div><p>Bevor du eine Antwort anklickst: Formuliere den Merksatz in eigenen Worten.</p>'+button('Weiter: selbst üben →','practice','pf-main');}
if(s.phase===2||done){h+='<h2>3. Ich übe selbst</h2><div class="pf-progress" aria-label="Übungsfortschritt"><span style="width:'+percent+'%"></span></div><p>Aufgabe '+(s.q+1)+' von '+t.qs.length+'</p><h3>'+E(q[0])+'</h3><fieldset class="pf-options" '+(s.checked?'disabled':'')+'><legend>Wähle eine Antwort</legend>'+q[1].map((v,i)=>'<label class="'+(s.choice===i?'pf-selected':'')+'"><input type="radio" name="pf-choice" value="'+i+'" '+(s.choice===i?'checked':'')+'>'+E(v)+'</label>').join('')+'</fieldset>';
if(!s.checked){h+='<div class="pf-controls">'+button(s.hint?'Hinweis ist eingeblendet':'Denkanstoß anzeigen','hint','pf-quiet')+button('Antwort prüfen','check','pf-main')+'</div>'+(s.hint?'<p class="pf-hint">Denke an den Merksatz: '+E(t.rule)+'</p>':'');}
else{const ok=s.choice===q[2];h+='<div class="pf-feedback" role="status"><strong>'+(ok?'✓ Richtig begründet':'Noch nicht richtig – daraus lernen wir')+'</strong><p>Deine Antwort: '+E(s.choice==null?'Keine Angabe':q[1][s.choice])+'.</p><p>Richtige Antwort: <b>'+E(q[1][q[2]])+'</b>.</p><p><b>Warum?</b> '+E(q[3])+'</p></div>'+button(s.q===t.qs.length-1?'Lernweg abschließen':'Nächste Aufgabe →','nextq','pf-main');}}
if(s.phase===4){const x=scores[t.id]||{right:0,total:0};h+='<h2>Auswertung dieses Lernwegs</h2><p><strong>'+x.right+' von '+x.total+' Aufgaben</strong> bei diesem Durchgang richtig. Eine Lernhilfe, keine Schulnote.</p><p>Unsicher? Wiederhole die Bildschritte und erkläre die richtige Antwort in eigenen Worten.</p>'+button('Diesen Lernweg wiederholen','restart','pf-quiet')+' '+button('Zum Probe-Test','test','pf-main');}
return h+'</section>';
}
function testing(){
const t=s.test,finished=t.finished,idx=t.index,q=t.items[idx];
let h='<section id="pf-root" class="pf-panel"><div class="pf-top">'+button('← Prüfungsfit-Übersicht','overview','pf-quiet')+'<span>Probe-Klassenarbeit · Variante '+s.version+'</span></div><h1>Prüfungsfit: Probe-Klassenarbeit</h1>';
if(!finished){h+='<p>24 Aufgaben aus allen acht Lernbereichen. <b>Keine Lösungen vor der Abgabe.</b> Du darfst Aufgaben überspringen und später zurückkehren.</p><div class="pf-progress"><span style="width:'+Math.round((idx+1)/t.items.length*100)+'%"></span></div><p>Aufgabe '+(idx+1)+' / '+t.items.length+' · '+E(U[q.u].title)+'</p><h3>'+E(q.data[0])+'</h3><fieldset class="pf-options"><legend>Wähle eine Antwort oder lasse sie offen</legend>'+q.data[1].map((opt,i)=>'<label class="'+(t.answers[idx]===i?'pf-selected':'')+'"><input type="radio" name="pf-test-choice" value="'+i+'" '+(t.answers[idx]===i?'checked':'')+'>'+E(opt)+'</label>').join('')+'</fieldset><div class="pf-controls">'+button('← Vorherige','prevtest','pf-quiet')+button('Weiter →','nexttest','pf-main')+button('Abgeben und auswerten','submit','pf-quiet')+'</div><p class="pf-small">'+t.answers.filter(x=>x!==null).length+' von 24 Antworten eingetragen. Offene Aufgaben werden bei der Abgabe als offen bewertet.</p>';}
else{const pts=t.items.filter((x,i)=>t.answers[i]===x.data[2]).length,wrong=t.items.map((x,i)=>({x,i})).filter(({x,i})=>t.answers[i]!==x.data[2]);
h+='<h2>Deine Auswertung</h2><p><strong>'+pts+' von '+t.items.length+' richtig</strong>. Das ist eine Übungsauswertung, keine Schulnote.</p><p>Sieh dir die Begründungen an und übe die noch unsicheren Lernbereiche erneut.</p>';
if(wrong.length)h+='<div class="pf-review">'+wrong.map(({x,i})=>'<article><h3>Aufgabe '+(i+1)+': '+E(x.data[0])+'</h3><p>Deine Antwort: '+E(t.answers[i]===null?'offen':x.data[1][t.answers[i]])+'</p><p><b>Richtig:</b> '+E(x.data[1][x.data[2]])+'</p><p><b>Begründung:</b> '+E(x.data[3])+'</p>'+button('Diesen Lernbereich wiederholen','unit:'+x.u,'pf-quiet')+'</article>').join('')+'</div>';
else h+='<p>Alle Antworten richtig! Versuche eine neue Variante oder die interaktive Klassenarbeit mit Zeichnungen.</p>';
h+='<div class="pf-controls">'+button('Neue Variante starten','newtest','pf-main')+button('Zur bestehenden Klassenarbeit mit Zeichnungen','classwork','pf-quiet')+'</div>';}
return h+'</section>';
}
function overview(){let h='<section id="pf-root" class="pf-panel"><div class="pf-kicker">Mit Gustav Globus zur Klassenarbeit</div><h1>🎯 Prüfungsfit · Verstehen, üben, anwenden</h1><p>Arbeite in deinem Tempo: erst ein Modell ansehen, dann den Unterschied erklären, danach selbst antworten. Die acht Lernwege bereiten auf die vorhandene interaktive Klassenarbeit vor.</p><div class="pf-grid">'+U.map((t,i)=>{const x=scores[t.id];return '<article class="pf-tile"><div class="pf-number">'+String(i+1).padStart(2,'0')+'</div><h2>'+E(t.title)+'</h2><p>'+E(t.goal)+'</p><p class="pf-small">'+(x?'Letzter Durchgang: '+x.right+'/'+x.total+' richtig':'Noch kein Durchgang gespeichert')+'</p>'+button('Mit Bildern lernen und üben','unit:'+i,'pf-main')+'</article>';}).join('')+'</div><div class="pf-end"><h2>🌍 Geowerkstatt: aktiv statt nur ankreuzen</h2><p>Setze Koordinaten selbst, finde Richtungen auf gedrehten Karten und arbeite mit dem Atlasregister. Drei interaktive Stationen mit je sechs Aufgaben, Tipps und Lösungen.</p><button type="button" data-praxis="open" class="pf-main">Geowerkstatt öffnen</button></div><div class="pf-end"><h2>Probe-Klassenarbeit: 24 Fragen aus acht Themen</h2><p>Wähle eine neue Variante. Es gibt jeweils drei Fragen pro Thema. Die Lösungen werden erst nach bestätigter Abgabe gezeigt.</p>'+button('Probe-Klassenarbeit starten','test','pf-main')+' '+button('Zur vorhandenen 18-Aufgaben-Klassenarbeit','classwork','pf-quiet')+'</div></section>';return h;}
function startUnit(n){s.mode='lesson';s.unit=n;s.phase=0;s.step=0;s.q=0;s.choice=null;s.checked=false;s.hint=false;redraw();}
function startTest(){s.mode='test';let items=[];U.forEach((u,i)=>{for(let k=0;k<3;k++){const ind=(s.version-1+k*2+i)%u.qs.length;items.push({u:i,data:u.qs[ind]});}});items.sort((a,b)=>((a.u*7+s.version)%U.length)-((b.u*7+s.version)%U.length));s.test={items:items,index:0,answers:Array(items.length).fill(null),finished:false};redraw();}
function redraw(focus){if(state.tab!=='pruefung')return;const html=s.mode==='lesson'?lesson():s.mode==='test'?testing():overview();main.innerHTML='<div class="flash">'+html+'</div>';if(focus!==false)main.querySelector('h1')?.setAttribute('tabindex','-1');}
function finishUnit(){s.phase=4;scores[topic().id]={right:s._right||0,total:topic().qs.length};persist();redraw();}
const baseRender=render;
render=function(){baseRender();if(state.tab==='pruefung'){state.view='home';redraw(false);}};
const oldTests=renderTests;renderTests=function(){return '<div class="card"><h2>🎯 Neu: Prüfungsfit mit Gustav</h2><p>Acht bebilderte Lernwege und eine Probe-Klassenarbeit mit 24 Fragen.</p>'+button('Prüfungsfit öffnen','open','pf-main')+'</div>'+oldTests();};
const oldStart=renderStart;renderStart=function(){return '<section class="card"><h2>🎯 Prüfungsfit für die nächste Klassenarbeit</h2><p>Mit anschaulichen Modellen, Schritt-für-Schritt-Erklärungen und zahlreichen Fragen die Grundlagen sicher beherrschen.</p>'+button('Jetzt gezielt lernen','open','pf-main')+'</section>'+oldStart();};
const testsTab=nav.querySelector('[data-tab="tests"]')||document.querySelector?.('#awMoreMain [data-tab="tests"]');if(testsTab)testsTab.insertAdjacentHTML('beforebegin','<button type="button" data-tab="pruefung">🎯 Prüfungsfit</button>');
document.addEventListener('change',function(e){if(!e.target.closest('#pf-root'))return;if(e.target.name==='pf-choice')s.choice=Number(e.target.value);if(e.target.name==='pf-test-choice'&&s.test&&!s.test.finished)s.test.answers[s.test.index]=Number(e.target.value);});
document.addEventListener('click',function(e){const b=e.target.closest('[data-pf]');if(!b)return; e.preventDefault();e.stopPropagation();const a=b.dataset.pf;
if(a==='open'){switchTab('pruefung');s.mode='overview';redraw();return;}
if(a==='overview'){s.mode='overview';redraw();return;}
if(a.startsWith('unit:')){switchTab('pruefung');startUnit(Number(a.split(':')[1]));return;}
if(a==='backstep'){s.step=Math.max(0,s.step-1);redraw();return;}
if(a==='nextstep'){if(s.step<3)s.step++;else s.phase=1;redraw();return;}
if(a==='practice'){s.phase=2;s.q=0;s.choice=null;s.checked=false;s.hint=false;s._right=0;redraw();return;}
if(a==='hint'){s.hint=!s.hint;redraw();return;}
if(a==='check'){if(s.choice===null){const el=main.querySelector('#pf-root h3');if(el)el.insertAdjacentHTML('afterend','<p role="alert">Bitte wähle zuerst eine Antwort.</p>');return;}s.checked=true;if(s.choice===topic().qs[s.q][2])s._right++;redraw();return;}
if(a==='nextq'){if(s.q===topic().qs.length-1)finishUnit();else{s.q++;s.choice=null;s.checked=false;s.hint=false;redraw();}return;}
if(a==='restart'){startUnit(s.unit);return;}
if(a==='test'){s.version=1;startTest();return;}
if(a==='newtest'){s.version=s.version%6+1;startTest();return;}
if(a==='prevtest'){s.test.index=Math.max(0,s.test.index-1);redraw();return;}
if(a==='nexttest'){s.test.index=Math.min(s.test.items.length-1,s.test.index+1);redraw();return;}
if(a==='submit'){if(!s.test.finished&&window.confirm('Jetzt endgültig abgeben? Die Antworten werden danach ausgewertet.')){s.test.finished=true;redraw();}return;}
if(a==='classwork'){switchTab('tests');return;}
});
window.Pruefungsfit=Object.freeze({topics:U,art:art,questionCount:U.reduce((n,u)=>n+u.qs.length,0),startUnit:startUnit,startTest:startTest});
})();
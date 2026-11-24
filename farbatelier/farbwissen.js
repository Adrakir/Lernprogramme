'use strict';
const names=['Gelb','Gelb-Orange','Orange','Rot-Orange','Rot','Rot-Violett','Violett','Blau-Violett','Blau','Blau-Grün','Grün','Gelb-Grün'];
const hex=['#ffda35','#ffb32d','#ff902b','#f76339','#e43950','#af337e','#8046a4','#6454c2','#4068c8','#258f9c','#38975f','#9abb39'];
const recipes=['Grundfarbe im Modell nach Itten.','Mehr Gelb als Rot, zum Beispiel 3 zu 1.','Gelb und Rot, etwa zu gleichen Teilen.','Mehr Rot als Gelb, zum Beispiel 3 zu 1.','Grundfarbe im Modell nach Itten.','Mehr Rot als Blau, zum Beispiel 3 zu 1.','Rot und Blau, etwa zu gleichen Teilen.','Mehr Blau als Rot, zum Beispiel 3 zu 1.','Grundfarbe im Modell nach Itten.','Mehr Blau als Gelb, zum Beispiel 3 zu 1.','Gelb und Blau, etwa zu gleichen Teilen.','Mehr Gelb als Blau, zum Beispiel 3 zu 1.'];
const group=i=>['','Primärfarbe','Sekundärfarbe','Tertiärfarbe'][order(i)];
const familyNames=['Alle Farben','Primärfarben','Sekundärfarben','Tertiärfarben'];
const familyHints=['Wähle eine Farbgruppe. Die Ziffern im Ring zeigen die Ordnung jeder Farbe.','Gelb, Rot und Blau sind die drei Grundfarben im Modell nach Itten.','Zwei Grundfarben ergeben eine Sekundärfarbe. Im Kreis liegt sie zwischen diesen beiden Farben.','Eine Grundfarbe und ihre benachbarte Sekundärfarbe ergeben eine Tertiärfarbe.'];
function order(i){return i%4===0?1:i%2===0?2:3}
const bases=[[0,4],[4,8],[8,0]],comps=[2,4,0,1,3,5].map(i=>[i,opposite(i)]);
function opposite(i){return (i+6)%12}

const farbgruppeMitglieder=n=>names.map((_,i)=>i).filter(i=>order(i)===n);
function mischPartner(i){
 const abstand=order(i)===2?2:1;
 return [(i+12-abstand)%12,(i+abstand)%12,i];
}
const wortlisteFarben=[
 ['Primärfarbe','Eine der drei Grundfarben in Ittens Modell: '+farbgruppeMitglieder(1).map(i=>names[i]).join(', ')+'.'],
 ['Sekundärfarbe','Eine Mischung aus zwei Grundfarben. '+recipes[10]+' So entsteht '+names[10]+'.'],
 ['Tertiärfarbe','Eine Zwischenfarbe im Itten-Kreis, etwa '+names[11]+' zwischen '+names[0]+' und '+names[10]+'.'],
 ['Komplementärfarbe','Die Farbe, die einem Farbton im Kreis genau gegenüberliegt. Zum Beispiel liegt '+names[opposite(2)]+' gegenüber von '+names[2]+'. Gegenfarbe bedeutet dasselbe.']
];

function interp(a,b,t){return 'rgb('+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t)).join(',')+')'}
function grundMischton(start,menge){
 const position=menge/25,schritt=Math.min(3,Math.floor(position));
 return interp(hex[(start+schritt)%12],hex[(start+schritt+1)%12],position-schritt);
}

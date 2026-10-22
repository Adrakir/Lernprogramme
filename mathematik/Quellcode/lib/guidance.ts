import {makeProblem, mentalProblem, correct, feedback, type Problem, type Topic} from './math.ts';

export const learningGoals:Record<Topic,{goal:string;discover:string;explain:string;types:number[]}> = {
 data:{goal:'Ich lese Daten mit passender Einheit und Skala und begründe Vergleiche.',discover:'Warum kann eine höhere Säule trotzdem für weniger Kinder stehen?',explain:'Die Höhe allein reicht nicht: Erst Einheit und Schrittweite prüfen, dann die Werte vergleichen.',types:[0,0,3,8,4,11,13,16]},
 numbers:{goal:'Ich erkläre Stellenwerte, Platzhalter-Nullen und große Zahlen.',discover:'Ist die Ziffer 4 immer vier wert? Vergleiche 4, 40 und 400.',explain:'Die Ziffer bleibt gleich, ihr Wert hängt vom Platz ab: 4 Einer, 4 Zehner oder 4 Hunderter.',types:[0,1,2,0,3]},
 round:{goal:'Ich runde direkt auf die Zielstelle und prüfe den Zweck.',discover:'Für 487 Kinder: 500 Eintrittskarten bestellen oder ungefähr 500 Kinder melden – ist beides dasselbe?',explain:'Für einen Bericht kann eine Näherung passen. Für jedes Kind genau eine Karte braucht man die genaue Anzahl.',types:[3,0,0,2,4]},
 mental:{goal:'Ich nutze Rechenregeln und erkläre einen günstigen Rechenweg.',discover:'Haben 2 + 3 · 4 und (2 + 3) · 4 dasselbe Ergebnis?',explain:'Nein: Ohne Klammer zuerst 3 · 4, also 14; mit Klammer zuerst 2 + 3, also 20.',types:[0,1,2,3]},
 line:{goal:'Ich bestimme Schrittweiten und lese Positionen am Zahlenstrahl.',discover:'Zwischen 100 und 200 liegen fünf Abstände. Ist jeder Abstand 1 wert?',explain:'Nein: Die Differenz 100 wird auf fünf gleiche Abstände verteilt. Jeder Abstand zählt 20.',types:[0,0,2,3]},
 units:{goal:'Ich wähle passende Einheiten und prüfe Umrechnungsfaktoren.',discover:'Wird ein Tisch länger, wenn du seine Länge statt in Metern in Zentimetern angibst?',explain:'Die Länge bleibt gleich. Nur die Einheit wird kleiner und die Maßzahl entsprechend größer.',types:[0,1,3,1]},
 stats:{goal:'Ich unterscheide Anzahl, Anteil und Kennwerte einer Verteilung.',discover:'Sind 12 Radfahrer von 30 Kindern ein größerer Anteil als 10 von 20?',explain:'Nein: 12 von 30 sind 40 %, 10 von 20 sind 50 %. Die größere Anzahl muss nicht der größere Anteil sein.',types:[0,1,2,3,2]},
 arithmetic:{goal:'Ich rechne stellengetreu und prüfe mit der Umkehraufgabe.',discover:'Warum steht das Teilprodukt für die Zehner eine Stelle weiter links?',explain:'Eine Zehnerziffer steht für Zehner: Bei 347 · 26 rechnen wir nicht nur mal 2, sondern mal 20.',types:[0,2,3,6]},
 divisibility:{goal:'Ich unterscheide Teiler und Vielfache und begründe Teilbarkeit.',discover:'Ist jede ungerade Zahl eine Primzahl? Prüfe 9 und 11.',explain:'Nein: 9 hat auch den Teiler 3. 11 hat nur die positiven Teiler 1 und 11.',types:[4,1,3,7]},
 geometry:{goal:'Ich beschreibe Figuren, Winkel, Koordinaten und Spiegelungen.',discover:'Ist jedes Quadrat ein Rechteck? Und gilt auch die Umkehrung?',explain:'Jedes Quadrat hat vier rechte Winkel und ist ein Rechteck. Ein Rechteck braucht aber nicht vier gleich lange Seiten.',types:[0,1,4,6]},
 measure:{goal:'Ich unterscheide Rand, Fläche und Rauminhalt mit Einheiten.',discover:'Kann ein Rechteck bei gleichem Umfang mehr Fläche als ein anderes haben?',explain:'Ja: 6 × 4 und 8 × 2 haben beide 20 cm Umfang, aber 24 cm² beziehungsweise 16 cm² Fläche.',types:[0,3,7,4]},
 fractions:{goal:'Ich deute Brüche als gleich große Teile und begründe Umformungen.',discover:'Darfst du bei verschieden großen Stücken einfach die Stückzahl als Bruch nehmen?',explain:'Nein. Ein Nenner beschreibt gleich große Teile eines Ganzen. Zum Vergleichen müssen auch die Ganzen gleich groß sein.',types:[0,4,3,8]},
 decimals:{goal:'Ich erkläre Zehntel und Hundertstel und rechne stellengetreu.',discover:'Ist 0,7 kleiner als 0,65, weil 7 kleiner als 65 ist?',explain:'Nein: 0,7 = 0,70. 70 Hundertstel sind mehr als 65 Hundertstel.',types:[0,4,6,2]}
};

const inquiries:Record<Topic,[string,string][]>={
 data:[
  ['Wie verhinderst du beim Zählen, dass eine Antwort zweimal vorkommt?','Markiere gezählte Antworten und ordne jede Antwort genau einer passenden Kategorie zu.'],
  ['Warum ist ein Fünferbündel nicht sechs wert?','Der Querstrich ist bereits der fünfte Strich; er kommt zu den vier senkrechten hinzu.'],
  ['Welche Angaben braucht ein Diagramm, damit du seine Werte verstehst?','Titel, Kategorien, Einheit und eine gleichmäßige Skala mit beschriftetem Nullpunkt gehören dazu.'],
  ['Was rechnest du bei „zusammen“, was bei „wie viele mehr“?','Für die Gesamtzahl addierst du. Für den Unterschied ziehst du die kleinere von der größeren Zahl ab.'],
  ['Was ändert sich, wenn Säulen zu Balken werden?','Die Richtung ändert sich, aber Kategorien und Werte bleiben gleich. Lies die Zahlenachse neu.'],
  ['Kann die niedrigere Säule für mehr Kinder stehen?','Ja, wenn die Diagramme verschiedene Skalen haben. Vergleiche die abgelesenen Zahlen, nicht nur die Höhe.'],
  ['Wie beschriftest du sechs gleich große Abstände bis 60?','Mit 0, 10, 20, 30, 40, 50, 60. Jeder Abstand zählt zehn.'],
  ['Was musst du vor einer Umfrage festlegen?','Eine eindeutige Frage, die Befragten und passende Kategorien. So wird jede Antwort sinnvoll erfasst.']
 ],
 numbers:[
  ['Was bleibt gleich, wenn du zehn Einer zu einem Zehner tauschst?','Der Wert bleibt zehn. Nur die Darstellung wechselt von zehn einzelnen Plättchen zu einem Zehnerstreifen.'],
  ['Warum darfst du die Null in 40.203 nicht weglassen?','Sie hält den Tausenderplatz frei. 4.203 wäre eine andere, viel kleinere Zahl.'],
  ['Wie liest du die Gruppen 3 | 420 | 005 | 018?','3 Milliarden, 420 Millionen, 5 Tausend und 18. Die Dreiergruppen halten auch leere Stellen fest.'],
  ['Wie schreibst du zwei Millionen und fünfzig ohne einen Platz zu verlieren?','2 | 000 | 050 ergibt 2.000.050. Jede Gruppe nach der führenden Gruppe hat drei Ziffern.'],
  ['Welche Stelle entscheidet bei 2.403.050 und 2.430.050?','Von links sind 2 und 4 gleich. Die Zehntausenderziffer 0 ist kleiner als 3; darum ist die erste Zahl kleiner.']
 ],
 round:[
  ['Wann wären ungefähr 500 statt genau 487 unpassend?','Wenn du genau eine Eintrittskarte je Kind brauchst. Eine Übersicht über die Schulgröße darf gerundet sein.'],
  ['Warum wird 4.500 auf Tausender zu 5.000?','Die Zahl liegt genau in der Mitte. Beim hier verwendeten Runden wird ab der Mitte aufgerundet.'],
  ['Welche Ziffer entscheidet bei 14.582 auf Tausender?','Die Hunderterziffer 5 steht direkt rechts von der Tausenderstelle. Daher entsteht 15.000.'],
  ['Wie erkennst du, ob 49 · 21 ungefähr 10.000 sein kann?','Der Überschlag 50 · 20 = 1.000 zeigt: 10.000 wäre etwa zehnmal zu groß.'],
  ['Sind „genau 48.000“ und „etwa 48.000“ gleichbedeutend?','Nein. „Etwa“ kennzeichnet eine Näherung, „genau“ behauptet einen exakten Wert.']
 ],
 mental:[
  ['Was unterscheidet 2 + 3 · 4 von (2 + 3) · 4?','Ohne Klammer zuerst 3 · 4: 14. Mit Klammer zuerst 2 + 3: 20.'],
  ['Warum ist 48 : 6 · 2 nicht 4?','Mal und Geteilt sind gleichrangig. Von links: 48 : 6 = 8, dann 8 · 2 = 16.'],
  ['Wo beginnst du bei 3 · (8 + (12 − 4))?','In der innersten Klammer: 12 − 4 = 8. Dann 8 + 8 = 16, zuletzt 3 · 16 = 48.'],
  ['Warum ist 25 · 17 · 4 leicht zu rechnen?','Bei einer reinen Multiplikation darfst du Faktoren umordnen: 25 · 4 · 17 = 100 · 17 = 1.700.']
 ],
 line:[
  ['Sind fünf Teilstriche dasselbe wie fünf Abstände?','Nein. Zwischen fünf aufeinanderfolgenden Teilstrichen liegen nur vier Abstände.'],
  ['Zwischen 100 und 200 liegen zehn Abstände. Wo liegt 140?','Jeder Abstand ist zehn wert. 140 liegt vier Abstände rechts von 100.'],
  ['Ist der Nachfolger von 9.999 immer 10.099, wenn die Zeichnung Hunderterschritte zeigt?','Nein. Der unmittelbare Nachfolger ist immer eins mehr, hier 10.000.'],
  ['Warum ist 270 die Mitte zwischen 240 und 300?','Die Differenz ist 60. Die Hälfte ist 30; von 240 und 300 ist 270 jeweils 30 entfernt.']
 ],
 units:[
  ['Reicht „18“ als Angabe für einen Bleistift?','Nein, die Einheit fehlt. 18 cm ist eine plausible Länge; 18 kg beschreibt eine ganz andere Größe.'],
  ['Wird der Tisch länger, wenn du Meter in Zentimeter umrechnest?','Nein. Die Größe bleibt gleich. 2 m und 200 cm bezeichnen dieselbe Länge.'],
  ['Warum sind 2 h 15 min nicht 215 min?','Stunden haben je 60 Minuten. 2 · 60 + 15 = 135 Minuten.'],
  ['Warum ist 1 dm² nicht 10 cm²?','Das Quadrat ist 10 cm lang und 10 cm breit: 10 · 10 = 100 cm². Beim Würfel sind es drei Richtungen.']
 ],
 stats:[
  ['Sind 12 von 30 ein größerer Anteil als 10 von 20?','Nein: 40 % sind weniger als 50 %. Gruppen unterschiedlicher Größe vergleichst du mit Anteilen.'],
  ['Kannst du aus einem Viertelkreis allein die Anzahl der Kinder bestimmen?','Nein. Er zeigt 25 %. Für die Anzahl brauchst du die Gesamtzahl, zum Beispiel 24 : 4 = 6.'],
  ['Muss der Mittelwert unter den beobachteten Zahlen vorkommen?','Nein. Bei 2, 3, 3 und 8 ist der Mittelwert 4, obwohl niemand den Wert 4 hat.'],
  ['Was verändert der Ausreißer 20 statt 8 bei 2, 3, 3 und 8?','Der Mittelwert steigt von 4 auf 7 und die Spannweite von 6 auf 18. Der Modalwert bleibt 3.'],
  ['Kann derselbe Mittelwert zu verschiedenen Verteilungen gehören?','Ja. 4, 4, 4, 4 und 1, 2, 5, 8 haben beide Mittelwert 4, aber sehr unterschiedliche Streuungen.']
 ],
 arithmetic:[
  ['Warum bleibt 704 beim Entbündeln dieselbe Zahl?','7 Hunderter und 4 Einer werden zu 6 Hundertern, 9 Zehnern und 14 Einern. Beide Darstellungen ergeben 704.'],
  ['Warum steht das Zehner-Teilprodukt eine Stelle weiter links?','Bei 347 · 26 steht die 2 für 20. Deshalb ist dieses Teilprodukt 6.940 und nicht 694.'],
  ['Darfst du die Null im Ergebnis 1.248 : 6 = 208 auslassen?','Nein. 4 Zehner lassen sich nicht auf sechs volle Zehnergruppen verteilen. Die Null hält den Zehnerplatz im Quotienten frei.'],
  ['Warum braucht man für 25 Kinder und Busse mit acht Kinderplätzen vier Busse?','Drei Busse haben nur 24 Kinderplätze. Der Rest bedeutet ein weiteres Fahrzeug, nicht einen Bruchteil eines nutzbaren Busses.']
 ],
 divisibility:[
  ['Was verbindet 3 und 12 in 3 · 4 = 12?','3 ist ein Teiler von 12; 12 ist ein Vielfaches von 3. 12 : 3 hat keinen Rest.'],
  ['Warum reicht bei der Teilbarkeit durch 3 nicht die letzte Ziffer?','Die Regel nutzt die Quersumme aller Ziffern: 234 hat Quersumme 9 und ist durch 3 teilbar.'],
  ['Ist jede ungerade Zahl prim?','Nein. 9 = 3 · 3 ist ungerade, hat aber mehr als zwei positive Teiler.'],
  ['Wie prüfst du die Vermutung „immer plus vier“ bei einer Zahlenfolge?','Berechne jede Differenz zwischen Nachbarn. Eine einzige passende Differenz reicht noch nicht als Prüfung aller vorgegebenen Schritte.']
 ],
 geometry:[
  ['Ist jedes Quadrat auch ein Rechteck?','Ja. Es erfüllt die Rechteckeigenschaft von vier rechten Winkeln. Umgekehrt braucht ein Rechteck keine vier gleich langen Seiten.'],
  ['Wie vermeidest du die falsche Skala beim Winkelmessen?','Schätze erst die Winkelart. Lies dann die Skala, deren 0° auf dem angelegten Schenkel liegt.'],
  ['Warum sind (3|4) und (4|3) nicht derselbe Punkt?','Die erste Zahl bestimmt die waagerechte, die zweite die senkrechte Bewegung vom Ursprung. Vertauschen verändert die Position.'],
  ['Wo liegt das Spiegelbild von (2|3) an x = 5?','Drei Schritte rechts von der Achse, also bei (8|3). Beide Punkte haben dieselbe Höhe und denselben senkrechten Abstand zur Achse.']
 ],
 measure:[
  ['Haben Rechtecke mit gleichem Umfang auch gleiche Fläche?','Nein. 6 × 4 und 8 × 2 haben je 20 cm Umfang, aber 24 cm² und 16 cm² Fläche.'],
  ['Was muss beim Zerlegen einer Fläche vermieden werden?','Lücken und doppelt gezählte Überlappungen. Teile müssen zusammen genau die ursprüngliche Fläche ergeben.'],
  ['Warum braucht ein Würfelnetz sechs Quadrate?','Jedes Quadrat wird zu einer der sechs Außenflächen. Beim Falten dürfen sie sich nicht überdecken.'],
  ['Wie viele Einheitswürfel enthält ein Quader 4 × 3 × 2?','Eine Schicht enthält 4 · 3 = 12 Würfel. Zwei Schichten enthalten 24 Würfel, also 24 cm³ bei Zentimeterkanten.']
 ],
 fractions:[
  ['Wann sind drei markierte Stücke wirklich drei Achtel?','Wenn das Ganze in acht gleich große Stücke geteilt ist und genau drei davon markiert sind.'],
  ['Warum sind 1/2 und 2/4 gleich viel?','Jede Hälfte wird in zwei gleiche Teile zerlegt. Es gibt mehr, aber kleinere Stücke; die markierte Menge bleibt gleich.'],
  ['Warum ist 1/3 größer als 1/5?','Bei gleich großen Ganzen sind Drittel größere Stücke als Fünftel. Ein größerer Nenner bedeutet kleinere Einzelstücke.'],
  ['Warum ist 1/2 + 1/4 nicht 2/6?','Die Stücke sind verschieden groß. Erst 1/2 in 2/4 umteilen, dann die Viertel zählen: 2/4 + 1/4 = 3/4.']
 ],
 decimals:[
  ['Warum ist 0,7 größer als 0,65?','0,7 = 0,70. 70 Hundertstel sind mehr als 65 Hundertstel.'],
  ['Was bedeutet Komma unter Komma?','Gleiche Stellenwerte stehen untereinander: Einer unter Einer, Zehntel unter Zehntel. Ergänzte Nullen rechts ändern den Wert nicht.'],
  ['Warum ist 2,35 · 4 = 9,40?','235 Hundertstel mal vier sind 940 Hundertstel. 940/100 = 9,40.'],
  ['Wie kannst du drei Hefte zu 1,25 € ohne Kommarechnung berechnen?','Rechne in Cent: 125 · 3 = 375 Cent, also 3,75 €.']
 ]
};

export function lessonInquiry(topic:Topic,step:number){
 const pair=inquiries[topic][step%inquiries[topic].length];
 return {question:pair[0],explanation:pair[1]};
}

export function guidedProblem(topic:Topic,step:number,variant:number):Problem {
 const types=learningGoals[topic].types;
 if(topic==='mental')return mentalProblem(7241+step*193+variant*997,1,['order','order','bracket','smart'][step%4]);
 return makeProblem(topic,7241+step*193+variant*997,1,types[step%types.length]);
}

export function specificFeedback(p:Problem,value:string):string {
 if(correct(p,value))return 'Richtig. Vergleiche nun den Rechenweg und begründe einen Schritt.';
 if(p.fields&&p.topic==='fractions'){
  const actual=value.split('|').map(Number),expected=String(p.answer).split('|').map(Number);
  if(actual.length===2&&actual[0]===expected[1]&&actual[1]===expected[0])return 'Zähler und Nenner sind vertauscht. Oben zählt man ausgewählte Teile; unten stehen alle gleich großen Teile.';
  if(p.title==='Brüche addieren'&&actual[1]===2*expected[1])return 'Du hast vermutlich die Nenner addiert. Die Stückgröße bleibt gleich: Addiere nur die Zähler.';
  return 'Prüfe Zähler und Nenner getrennt. Beim Erweitern oder Kürzen verändert derselbe Faktor beide Zahlen.';
 }
 if(p.topic==='measure'&&p.shape?.kind==='rectangle'){
  const a=p.shape.a,b=p.shape.b??1,n=Number(value.replaceAll('.',''));
  if(p.unit==='cm'&&n===a*b)return 'Du hast die Fläche berechnet. Gesucht ist der Rand: Addiere alle vier Seiten. Die Einheit ist cm, nicht cm².';
  if(p.unit==='cm²'&&n===2*(a+b))return 'Du hast den Umfang berechnet. Gesucht sind die Quadrate im Inneren: Länge mal Breite, in cm².';
 }
 if(p.topic==='arithmetic'&&p.work){
  const n=Number(value.replaceAll('.','')),w=p.work;
  if(w.op==='·'&&w.b>=10&&n===w.a*(Math.floor(w.b/10)+w.b%10))return 'Das Zehner-Teilprodukt wurde vermutlich wie Einer behandelt. Die Zehnerziffer bedeutet mal 10; rücke dieses Teilprodukt eine Stelle nach links.';
  return 'Prüfe die Stellen einzeln. Beachte Überträge, Entbündelungen und Nullen im Ergebnis. Nutze anschließend die Umkehraufgabe.';
 }
 const rules:Partial<Record<Topic,string>>={
  divisibility:'Suche einen Teiler ohne Rest. Bei 3 und 9 zählt die Quersumme; ungerade heißt nicht automatisch prim.',
  geometry:'Prüfe die Eigenschaft genau: erst x, dann y; Spiegelpunkte haben gleichen senkrechten Abstand zur Achse. Winkel mit 90° und 180° vergleichen.',
  decimals:'Vergleiche gleiche Stellenwerte. Ergänze rechts Nullen; bei Plus und Minus steht Komma unter Komma.',
  units:'Stelle zuerst dieselbe Einheit her. Prüfe den Faktor: Bei Zeit sind es oft 60, bei Fläche 100 und bei Raum 1.000.',
  stats:'Unterscheide Anzahl und Anteil. Für den Mittelwert addierst du alle Werte und teilst durch ihre Anzahl.'
 };
 return rules[p.topic]??feedback(p,value);
}

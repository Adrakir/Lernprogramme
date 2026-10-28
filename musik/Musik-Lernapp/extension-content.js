'use strict';
// Each lesson keeps its original guided question and gets five transfer questions.
function transferQ(q,answer,wrong,why,ids=null,m=4,sub=1,meter=false){return {q,answer,options:[answer,...wrong],why,ids,m,sub,meter};}
const extraContent={
 puls:[
 ['Du gehst vier gleichmäßige Schritte und klatschst nur einmal. Wie viele Grundschläge sind vergangen?','4',['1','5'],'Die Schritte zeigen den Puls. Ein einzelner Klatscher ändert die vier Schritte nicht.'],
 ['Minka klatscht auf 1 und 4. Was macht der Fuß auf 2 und 3?','Er geht gleichmäßig weiter',['Er bleibt stehen','Er geht doppelt so schnell'],'Auch ohne Klatschen bleibt der Puls regelmäßig.'],
 ['Fuji möchte einen gleichmäßigen Puls. Welche Abstände passen?','Alle Schlagabstände gleich lang',['Erst kurz, dann lang','Bei Stille eine längere Wartezeit'],'Ein Grundschlag dauert bei gleichbleibendem Tempo genauso lange wie der nächste.'],
 ['Wie prüfst du, ob dein Puls gleichmäßig bleibt?','Mit gleichmäßigen Schritten mitgehen',['Nur die Klatscher zählen','Bei jedem Ton schneller werden'],'Die Schritte laufen unabhängig von den Tonanfängen weiter.'],
 ['Nach vier Schritten beginnt eine neue Vierergruppe. Wann kommt ihr erster Schritt?','Im gleichen Abstand wie vorher',['Nach einem zusätzlichen Schritt','Nach einer beliebig langen Pause'],'Eine Gruppengrenze fügt keine Zeit hinzu.']
 ],
 teile:[
 ['Zwei Köpfe sind durch einen Balken verbunden. Wie viele Noten sind es?','2',['1','3'],'Jeder Kopf gehört zu einer Note. Der Balken verbindet sie.', ['e','e'],4,2],
 ['Welche Note hat keinen Notenhals?','Ganze Note',['Halbe Note','Viertelnote'],'Die ganze Note besteht hier aus einem leeren ovalen Kopf ohne Hals.',['w']],
 ['Wo sitzt ein Fähnchen?','Am Notenhals',['Im Notenkopf','Am Taktstrich'],'Das Fähnchen hängt am Hals einer einzelnen kurzen Note.',['e']],
 ['Was ersetzt ein Balken bei verbundenen Achteln?','Die einzelnen Fähnchen',['Die Notenköpfe','Den Taktstrich'],'Köpfe und Hälse bleiben erhalten. Ein Balken ersetzt die Fähnchen.',['e','e'],4,2],
 ['Wo findest du den Verlängerungspunkt?','Rechts neben dem Kopf',['Über dem Kopf','Am Ende des Notenhalses'],'Hier ist der Punkt rechts gemeint. Andere Punktpositionen können andere Bedeutungen haben.',['qd'],4,2]
 ],
 tempo:[
 ['Das Tempo wird schneller. Wie viele Schläge dauert eine halbe Note weiterhin?','2',['1','4'],'Die Schläge werden kürzer, der Wert bleibt zwei Schläge.',['h']],
 ['Fuji verdoppelt das Tempo. Was passiert mit den Schlagabständen?','Sie werden halb so lang',['Sie werden doppelt so lang','Sie bleiben unverändert'],'Schnelleres Tempo bedeutet kürzere Zeitabstände.'],
 ['Bei gleichem Tempo: Wie verhält sich Halbe zu Viertel?','Doppelt so lang',['Gleich lang','Halb so lang'],'Zwei Schläge sind doppelt so viel wie ein Schlag.',['h','q']],
 ['Was ändert eine Tempoänderung?','Die Dauer eines Schlags in Sekunden',['Die Anzahl der Notenköpfe','Eine Note wird zur Pause'],'Die Notation bleibt gleich. Die Ausführung wird schneller oder langsamer.'],
 ['Bei 60 Viertelschlägen pro Minute dauert eine Viertelnote …','1 Sekunde',['2 Sekunden','4 Sekunden'],'60 Sekunden geteilt durch 60 Schläge ergibt eine Sekunde je Schlag.',['q']]
 ],
 generalpause:[
 ['Fuji schweigt, Minka spielt weiter. Ist das eine Generalpause?','Nein, nur Fuji pausiert',['Ja, weil Fuji schweigt','Ja, jede Pause ist eine Generalpause'],'Bei einer Generalpause schweigen alle Stimmen gleichzeitig.'],
 ['Beide haben eine halbe Pause auf 3 und 4. Wie lange schweigen sie gemeinsam?','2 Schläge',['4 Schläge','1 Schlag'],'Jede halbe Pause umfasst zwei Schläge. Gemeinsam wird die Zeit nicht addiert.'],
 ['Zwei Stimmen pausieren gleichzeitig einen Schlag. Wie viel Zeit vergeht?','1 Schlag',['2 Schläge','Kein Schlag'],'Gleichzeitige Stimmen teilen dieselbe Zeit.'],
 ['Was hilft beim gemeinsamen Wiedereinsetzen?','Innerlich im gleichen Puls weiterzählen',['Den Puls während der Pause vergessen','Jeder beginnt zu einer anderen Zeit'],'Die Stille hat eine Dauer. Mit innerlichem Zählen treffen beide den nächsten Einsatz.'],
 ['Was bedeutet die Abkürzung G. P.?','Generalpause',['Ganze punktierte Note','Grundpuls'],'G. P. weist auf gemeinsames Schweigen aller Stimmen hin.']
 ],
 system:[
 ['Wie viele Linien hat ein Notensystem?','5',['4','6'],'Fünf Linien begrenzen vier Zwischenräume.'],
 ['Wie viele Zwischenräume liegen zwischen den fünf Linien?','4',['5','3'],'Zwischen zwei benachbarten Linien liegt ein Zwischenraum.'],
 ['Was bedeutet die untere 4 in 3/4?','Viertelnote ist die Zähleinheit',['Vier Noten müssen im Takt stehen','Vier Notenlinien'],'Die obere 3 nennt die Schlagzahl; die untere 4 bezeichnet Viertel.'],
 ['Muss ein 3/4-Takt genau drei Notenköpfe enthalten?','Nein, entscheidend ist die Dauer',['Ja, immer drei','Nein, immer vier'],'Halbe plus Viertel hat zwei Köpfe, aber drei Schläge.',['h','q'],3,1,true],
 ['Was üben wir in dieser Rhythmuszeile?','Dauern und Startstellen',['Alle Tonhöhen','Die Lautstärke jeder Note'],'Für Melodien braucht man zusätzlich die Tonhöhen und den Notenschlüssel.']
 ],
 striche:[
 ['Welche Zeitdauer hat ein Taktstrich?','Keine zusätzliche Zeit',['1 Schlag','½ Schlag'],'Der Strich trennt Takte; er ist kein Pausenwert.'],
 ['Woran erkennst du den Schlussstrich?','Dünne Linie links, dicke rechts',['Zwei dicke Linien','Ein einzelner dünner Strich'],'Der Schlussstrich zeigt das Ende des Stücks.'],
 ['Was kann ein Doppelstrich markieren?','Die Grenze eines Abschnitts',['Eine Achtelpause','Einen neuen Tonanfang'],'Zwei dünne Linien markieren eine Abschnittsgrenze.'],
 ['Zwei vollständige 3/4-Takte dauern zusammen …','6 Schläge',['7 Schläge','8 Schläge'],'3 + 3 = 6. Der Strich dazwischen fügt nichts hinzu.'],
 ['Wie zählst du über zwei 4/4-Takte hinweg?','1 2 3 4 | 1 2 3 4',['1 2 3 4 | 5 1 2 3 4','1 2 3 | 1 2 3'],'Nach 4 folgt die nächste 1 im gleichbleibenden Puls.']
 ],
 woerter:[
 ['Wie viele Tonanfänge enthält Kä-se?','2',['1','4'],'Zwei Silben stützen zwei gleich lange Achtelnoten.',['e','e'],4,2],
 ['Wie lange dauert Scho-ko-la-de in unserer Vereinbarung?','1 Schlag',['4 Schläge','2 Schläge'],'Vier Sechzehntel teilen einen Viertelschlag.',['s','s','s','s'],4,4],
 ['Brot, Käse, Brot: Wie viele Schläge sind das?','3',['4','5'],'Jede ganze Wortgruppe dauert einen Schlag.'],
 ['Brot, Käse, Brot: Wie viele Tonanfänge sind das?','4',['3','6'],'1 + 2 + 1 = 4 Tonanfänge, aber nur drei Schläge.'],
 ['Käse wird durch Schokolade ersetzt. Was bleibt gleich?','Die Gesamtdauer von einem Schlag',['Die Zahl der Tonanfänge','Die Anzahl der Silben'],'Aus zwei Achteln werden vier Sechzehntel. Der Schlag bleibt gleich lang.']
 ],
 verboten:[
 ['V = Ton, Stille, Ton, Ton. A = Ton, Ton, Stille, Ton. Ist A verboten?','Nein, die Pause liegt anders',['Ja, beide haben eine Pause','Ja, beide dauern vier Schläge'],'Im Spiel ist nur das genaue vereinbarte Muster verboten.'],
 ['Das genaue Muster V wird gespielt. Was folgt?','Ein ganzer stiller Antworttakt',['Nur ein stiller Schlag','V sofort nachklatschen'],'Die Spielregel verlangt beim Merkmuster den ganzen Antworttakt Stille.'],
 ['Kann ein verbotener Rhythmus zeitlich richtig sein?','Ja',['Nein','Nur ohne Pausen'],'Verboten ist eine Spielregel. Ein Taktfehler betrifft dagegen die Zeitwerte.'],
 ['Was vergleichst du beim Merkmuster?','Startstellen, Dauern und Pausen',['Nur die Zahl der Zeichen','Nur die Gesamtdauer'],'Zwei gleich lange Folgen können verschiedene Rhythmen sein.'],
 ['Ein anderes Muster wird vorgespielt. Wann klatschst du es nach?','Im folgenden Antworttakt',['Mitten im Vorspielen','Nur an seiner Pausenstelle'],'Erst zuhören, dann das andere Muster im Antworttakt nachmachen.']
 ]
};
// Note-duration questions use only values that the corresponding lesson has introduced.
const transferBeats=n=>fmt(n)+' '+(n<=1?'Schlag':'Schläge');
const valueKeys={viertel:'q',halbe:'h',ganze:'w',achtel:'e',sechzehntel:'s'};
for(const [key,id] of Object.entries(valueKeys)){
 const n=get(id),plural=sentenceName(n.name).replace(/Note$/,'Noten').replace(/note$/,'noten'),u=val(id)/4,sub=u<1?4:1,name=sentenceName(n.name),dative=name.replace(/^(halbe|ganze) /,'$1n ');
 extraContent[key]=[
 [`Wie lange dauern zwei ${plural} zusammen?`,transferBeats(u*2),[transferBeats(u),transferBeats(u*4)],`Zweimal ${fmt(u)} ergibt ${transferBeats(u*2)}. Zwei Köpfe bedeuten zwei Tonanfänge.`,[id,id],4,sub],
 [`Wie viele Tonanfänge hat eine einzelne ${name}?`,'1',['2','4'],'Ein Kopf bedeutet einen Tonanfang. Die Dauer kann mehrere Schläge umfassen.',[id],4,sub],
 [`Wie viel Zeit dauert eine ${name} plus eine gleich lange Pause?`,transferBeats(u*2),[transferBeats(u),'Keine Zeit'],`Klang und Stille zählen beide mit: ${fmt(u)} + ${fmt(u)} = ${fmt(u*2)}.`,null],
 [`Minka zählt bei einer ${dative} nur die Köpfe. Was muss sie außerdem beachten?`,'Die Dauer des Zeichens',['Die Größe des Druckbildes','Die Farbe des Hintergrunds'],'Tonanfänge und Zeitdauer sind verschiedene Fragen.',[id],4,sub],
 [`Fuji spielt zwei ${plural} nacheinander. Wie viele neue Töne beginnen?`,'2',['1','4'],'Jede der beiden Noten hat einen eigenen Anfang.',[id,id],4,sub]
 ];
}
for(const key of ['familie','stille','viertelpause','lange-pausen','kurze-pausen','dreiertakt','vierertakt','zaehlen','luecken','fehler','punkt','punkt-im-takt','punktierte-achtel','abschluss']){
 const d=MUSIC_PATH.find(x=>x.key===key),dot=d.topic===5||key==='abschluss',pause=d.topic===1;
 if(key==='familie')extraContent[key]=[
 ['Wie viele Viertel dauern so lange wie eine ganze Note?','4',['2','8'],'Viermal ein Schlag ergibt vier Schläge.',['w']],
 ['Wie viele Achtel ersetzen zeitlich eine Viertel?','2',['4','1'],'½ + ½ = 1. Die Dauer bleibt gleich; es gibt zwei Tonanfänge.',['e','e'],4,2],
 ['Wie viele Sechzehntel ergeben eine Achtel?','2',['4','8'],'¼ + ¼ = ½ Schlag.',['s','s'],4,4],
 ['Halbe oder zwei Viertel: Was ist gleich?','Die Gesamtdauer',['Die Zahl der Tonanfänge','Das Notenbild'],'Beide dauern zwei Schläge. Eine Halbe beginnt einmal, zwei Viertel zweimal.'],
 ['Acht Achtel dauern insgesamt …','4 Schläge',['8 Schläge','2 Schläge'],'8 × ½ = 4 Schläge.']
 ];
 else if(pause){const id=key==='lange-pausen'?'hr':key==='kurze-pausen'?'er':'qr',u=val(id)/4;extraContent[key]=[
 [`Wie lange dauert eine ${sentenceName(get(id).name)}?`,`${transferBeats(u)} Stille`,['Keine Zeit',`${transferBeats(u)} Klang`],`Pausen haben eine feste Dauer. Hier ${transferBeats(u)} Stille.`,[id],4,key==='kurze-pausen'?4:1],
 ['Halbe Note oder Viertel plus Viertelpause: Was geschieht auf 2?','Bei der Halben Klang, beim zweiten Muster Stille',['In beiden Fällen ein neuer Ton','In beiden Fällen Stille'],'Die halbe Note hält über 2. Die Viertelpause im anderen Muster schweigt auf 2.'],
 ['Auf eine Viertelpause folgt eine Viertelnote. Wann beginnt ihr Ton?','Nach einem Schlag Stille',['Sofort ohne Wartezeit','Nach zwei Schlägen Stille'],'Die Viertelpause belegt einen Schlag, erst danach folgt der Ton.',['qr','q']],
 ['Womit erkennst du eine Pause beim Hören?','Mit dem weiterlaufenden Puls zwischen Tönen',['An einem besonderen Pausenklang','Pausen lassen sich zeitlich nicht erkennen'],'Die Pause klingt nicht. Mit dem Puls erkennst du ihre Dauer.'],
 ['Viertel, Viertelpause, Halbe: Was geschieht auf 4?','Der Ton von 3 klingt weiter',['Ein neuer Ton beginnt','Eine Pause beginnt'],'Die Halbe beginnt auf 3 und dauert zwei Schläge.',['q','qr','h'],4,1,false]
 ];}
 else if(dot){extraContent[key]=[
 ['Was fügt der Verlängerungspunkt hinzu?','Die Hälfte des Grundwerts',['Immer einen Schlag','Den ganzen Grundwert'],'Bestimme den Wert ohne Punkt und halbiere ihn.'],
 ['Punktierte Halbe: Wie rechnest du?','2 + 1 = 3',['2 + 2 = 4','2 + ½ = 2½'],'Die Hälfte von zwei Schlägen ist ein Schlag.',['hd'],3,1,true],
 ['Punktierte Viertel plus Achtel: Gesamtdauer?','2 Schläge',['1 Schlag','3 Schläge'],'1½ + ½ = 2. Der erste Ton dauert dreimal so lange wie der zweite.',['qd','e'],4,2],
 ['Punktierte Achtel plus Sechzehntel: Wo beginnt der zweite Ton?','Auf a',['Auf e','Auf und'],'Die erste Note belegt 1, e, und. Der zweite Ton beginnt auf a.',['ed','s'],4,4],
 ['Was verändert der Punkt bei einer Pause?','Die Dauer der Stille',['Stille wird zu Klang','Die Anzahl der Stimmen'],'Auch bei Pausen kommt die Hälfte des Grundwerts hinzu.',['qrd'],4,2]
 ];}
 else if(key==='zaehlen'){extraContent[key]=[
 ['Wie zählst du vier Sechzehntel in einem Schlag?','1 e und a',['1 2 3 4','1 und 2 und'],'Vier Teilzeiten innerhalb desselben Viertelschlags.',['s','s','s','s'],4,4],
 ['Zwei Achtel: Wann beginnen die Töne?','Auf 1 und und',['Auf 1 und e','Auf e und a'],'Jede Achtel umfasst zwei Sechzehntel-Teilzeiten.',['e','e'],4,4],
 ['Achtel, Sechzehntel, Sechzehntel: Auf e …','hält der erste Ton weiter',['beginnt der zweite Ton','ist eine Pause'],'Die Achtel hält über e; die nächsten Töne beginnen auf und und a.',['e','s','s'],4,4],
 ['Sechzehntel, Sechzehntel, Achtel: Auf a …','hält die Achtel weiter',['beginnt ein vierter Ton','muss Stille sein'],'Die Achtel beginnt auf und und hält über a.',['s','s','e'],4,4],
 ['Mehr Zählsilben bedeuten automatisch mehr Tonanfänge?','Nein',['Ja','Nur im 4/4-Takt'],'Die Zählsilben unterteilen die Zeit. Eine lange Note kann über mehrere Teilzeiten halten.']
 ];}
 else {const m=key==='dreiertakt'?3:4;extraContent[key]=[
 [`${m}/4: Halbe plus ${m===3?'Viertel':'zwei Viertel'}. Passt die Dauer?`,'Ja',[ 'Nein, zu kurz','Nein, zu lang'],`2 + ${m===3?'1':'1 + 1'} = ${m}.`,m===3?['h','q']:['h','q','q'],m,1,true],
 [`${m}/4: ${m-1} Viertelnoten. Wie viel fehlt?`,'1 Schlag',['2 Schläge','Nichts'],`${m} − ${m-1} = 1. Auch eine Viertelpause könnte die fehlende Zeit füllen.`,Array(m-1).fill('q'),m,1,true],
 [`${m}/4: ${m} Viertelpausen. Ist der Takt vollständig?`,'Ja, die Stille zählt mit',['Nein, Pausen zählen nicht','Nein, jeder Takt braucht einen Ton'],`${m} × 1 = ${m} Schläge Stille.`,Array(m).fill('qr'),m,1,true],
 [`${m}/4: Zwei Halbe${m===4?' und eine Viertel':''}. Was stimmt?`,'1 Schlag zu lang',['Genau passend','1 Schlag zu kurz'],`${m===4?'2 + 2 + 1 = 5':'2 + 2 = 4'}; gebraucht werden ${m} Schläge.`,m===4?['h','h','q']:['h','h'],m,1,true],
 ['Wie überprüfst du eine Taktlücke?','Sollwert minus vorhandene Dauer',['Nur die Größe der Lücke ansehen','Nur Notenköpfe zählen'],'Lies die Taktart. Addiere Noten und Pausen. Ziehe die Summe vom Sollwert ab.']
 ];}
}
for(const d of MUSIC_PATH){const entries=extraContent[d.key];if(!entries||entries.length!==5)throw Error('Missing lesson extension: '+d.key);d.questions.push(...entries.map(a=>transferQ(...a)));}

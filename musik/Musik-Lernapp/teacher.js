'use strict';
const fujiTopicAdvice=[
 ['Notenwerte verstehen','Der Notenwert sagt, wie lange ein Ton dauert. Eine Viertelnote ist hier ein Schlag.',['Schau auf den Kopf: Ist er leer oder ausgefüllt? Hat die Note einen Hals oder Fähnchen?','Vergleiche mit der Viertelnote: Ganze = 4, Halbe = 2, Viertel = 1, Achtel = ½, Sechzehntel = ¼ Schlag.','Zähle Tonanfänge und Dauer getrennt. Eine halbe Note hat einen Tonanfang und klingt zwei Schläge.']],
 ['Pausen verstehen','Eine Pause ist geplante Stille. Du machst keinen Ton, zählst aber gleichmäßig weiter.',['Suche das Pausenzeichen im Notensystem. Es gehört genauso zur Zeit wie eine Note.','Viertelpause = 1, halbe Pause = 2, Achtelpause = ½ und Sechzehntelpause = ¼ Schlag. Die Ganztaktpause füllt den ganzen Takt.','Höre den ganzen Takt: Wo beginnt die Stille, und wann setzt der nächste Ton ein? Eine Generalpause bedeutet, dass alle Stimmen gleichzeitig schweigen.']],
 ['Noten beschriften','Jeder Bestandteil hat einen eigenen Namen. Schau immer auf den Teil, auf den die Linie zeigt.',['Der ovale Teil ist der Notenkopf. Der lange Strich daran ist der Notenhals.','Ein einzelnes kurzes Zeichen hat Fähnchen. Bei verbundenen kurzen Noten werden sie durch Balken ersetzt.','Der Verlängerungspunkt steht rechts neben dem Kopf. Er gehört nicht zum Hals.']],
 ['Takte verstehen','In unseren 3/4- und 4/4-Takten zählt eine Viertelnote als ein Schlag. Noten und Pausen füllen gemeinsam den Takt.',['Lies die obere Zahl: 3/4 verlangt drei Viertelschläge, 4/4 vier Viertelschläge.','Addiere die Dauern aller Noten und Pausen. Eine Pause zählt mit, auch wenn du sie nicht hörst.','Vergleiche mit der Taktangabe. Am Taktstrich kommt kein zusätzlicher Schlag hinzu.']],
 ['Rhythmus verstehen','Der Puls bleibt gleichmäßig. Der Rhythmus verteilt Tonanfänge, lange Klänge und Stille auf diesen Puls.',['Brot dauert einen Schlag. Kä-se teilt denselben Schlag in zwei gleich lange Achtel.','Scho-ko-la-de teilt einen Schlag in vier gleich lange Sechzehntel. Sprich gleichmäßig, ohne das Tempo zu ändern.','Beim verbotenen Rhythmus schweigst du nur beim vereinbarten Muster. Das Spielverbot bedeutet nicht, dass dieser Takt falsch geschrieben ist.']],
 ['Punktierte Werte verstehen','Ein Punkt verlängert die Note oder Pause um die Hälfte ihres ursprünglichen Werts.',['Bestimme zuerst den Wert ohne Punkt. Eine halbe Note dauert zwei Viertelschläge.','Halbiere den Grundwert. Die Hälfte von zwei ist eins.','Addiere: 2 + 1 = 3 Schläge. Eine punktierte halbe Note füllt einen 3/4-Takt. Punktierte Pausen werden genauso berechnet.']]
];
function mountFujiAdvice(topic,custom=null){
 const target=$('#main .card');if(!target)return;
 const advice=custom||fujiTopicAdvice[topic];if(!advice)return;
 const [title,explanation,hints]=advice,panel=document.createElement('details');panel.className='fujiCoach';
 panel.innerHTML=`<summary><img src="images/fuji-musiklehrer.webp" alt="Fuji als Musiklehrer" width="58" height="58"><span><strong>Fuji erklärt: ${escapeText(title)}</strong><small>Erklärung und drei Tipps aufklappen</small></span></summary><div class="fujiCoachBody"><p>${escapeText(explanation)}</p><ol>${hints.map((t,i)=>`<li><strong>Tipp ${i+1}:</strong> ${escapeText(t)}</li>`).join('')}</ol><button data-fuji-topic="${topic}">Fuji, zeig mir das Lernbeispiel</button></div>`;
 target.prepend(panel);$$('[data-fuji-topic]').forEach(b=>b.onclick=()=>openTopic(+b.dataset.fujiTopic));
}
const builderBeforeFuji=renderBuilder;
renderBuilder=function(){builderBeforeFuji();const used=[...fixed,...build].reduce((sum,id)=>sum+val(id,meter),0)/4,missing=meter-used;mountFujiAdvice(3,['Deine Taktlücke',`Dieser ${meter}/4-Takt braucht ${meter} Viertelschläge. Noten und Pausen zählen beide.`,[`Lies die Taktangabe links: Die obere Zahl ist ${meter}.`,`Du hast bisher ${fmt(used)} Schläge eingetragen. ${missing>0?`Es fehlen ${fmt(missing)} ${missing<=1?'Schlag':'Schläge'}.`:missing===0?'Der Takt ist genau gefüllt.':`Es sind ${fmt(-missing)} Schläge zu viel.`}`,missing>0?`Rechne ${meter} − ${fmt(used)} = ${fmt(missing)}. Wähle einen Wert oder mehrere Zeichen mit genau dieser Gesamtdauer.`:'Höre den Takt und zähle gleichmäßig mit. Deine mintfarben markierten Zeichen kannst du zum Ersetzen antippen.']]);};
const smartBeforeFuji=renderSmart;
renderSmart=function(){smartBeforeFuji();if(smart?.round){const q=smart.round,base=fujiTopicAdvice[q.topic];mountFujiAdvice(q.topic,[base[0],base[1],[q.hint||base[2][0],base[2][1],base[2][2]]]);}};
const practiceBeforeFuji=renderPractice;
renderPractice=function(){practiceBeforeFuji();if(quiz&&quiz.mode!=='label'&&quiz.index<quiz.questions.length){const q=quiz.questions[quiz.index];mountFujiAdvice(q.lesson);}};
const labelsBeforeFuji=renderLabels;
renderLabels=function(){labelsBeforeFuji();mountFujiAdvice(2);};
const detectiveBeforeFuji=renderDetective;
renderDetective=function(){detectiveBeforeFuji();mountFujiAdvice(detectMode==='pause'?1:detectMode==='taboo'?4:3);};
const dottedBeforeFuji=renderDotted;
renderDotted=function(){dottedBeforeFuji();if(dotTab!=='learn')mountFujiAdvice(5);};
const wordsBeforeFuji=renderRhythm;
renderRhythm=function(){wordsBeforeFuji();mountFujiAdvice(4);};
const piecesBeforeFuji=renderPieces;
renderPieces=function(){piecesBeforeFuji();mountFujiAdvice(3);};
const tapsBeforeFuji=renderTap;
renderTap=function(){tapsBeforeFuji();mountFujiAdvice(4);};
render();

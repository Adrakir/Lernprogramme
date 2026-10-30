'use strict';
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let activePage = 'entdecken';
function showPage(id, focus = true) {
  if (!['studio','entdecken','spannung','ueben','schreiben','lesen','sprache','lehrgang','hauptteil'].includes(id)) throw new Error('Unbekannter Lernbereich.');
  activePage = id;
  $$('.page').forEach(el => el.hidden = el.id !== id);
  $$('[data-page]').forEach(button => button.dataset.page === id ? button.setAttribute('aria-current','page') : button.removeAttribute('aria-current'));
  document.dispatchEvent(new CustomEvent('learningpagechange', {detail:{id}}));
  if (focus) { $('#main').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'auto'}); }
}
$$('[data-page]').forEach(b => b.addEventListener('click', () => showPage(b.dataset.page)));
$$('[data-go]').forEach(b => b.addEventListener('click', () => showPage(b.dataset.go)));

const scenes = [
  {part:'intro',alt:'Minka und Fuji stehen an einem Herbstnachmittag im Garten neben dem alten Holzschuppen.',text:'An einem windigen Herbstnachmittag suchten die Katze Minka und der Wolfhund Fuji ihren roten Ball im Garten. Er war beim Spielen hinter den alten Holzschuppen gerollt. Gemeinsam liefen die beiden zu dem kleinen Gebäude am Zaun.',speaker:'Minka',dialogue:'„Jetzt weißt du, wer dabei ist, wann und wo die Geschichte spielt und was wir am Anfang tun. Das ist unsere Einleitung!“'},
  {part:'body',alt:'Minka lauscht an der Schuppentür, während Fuji aufmerksam die Ohren aufstellt.',text:'Da drang ein leises Kratzen aus dem Schuppen. Minka blieb stehen. „Hast du das gehört?“, flüsterte sie. Fuji stellte die Ohren auf. Kratz. Kratz. Wer mochte dort drinnen sein?',speaker:'Fuji',dialogue:'„Ein rätselhaftes Geräusch! Der Hauptteil beginnt. Eine Frage bleibt offen und macht neugierig.“'},
  {part:'body',alt:'Der Wind hat die Schuppentür geschlossen. Minka schaut unter der Tür hindurch.',text:'Eine Windböe schlug die halb offene Tür zu. Minka zuckte zusammen. Vorsichtig spähte sie durch den Spalt unter der Tür. Im Dunkeln bewegte sich etwas. Ihr Herz klopfte. „Ich kann nicht erkennen, was es ist“, wisperte sie.',speaker:'Minka',dialogue:'„Ein Hindernis, meine Gedanken und meine Gefühle steigern die Spannung. Noch kennen wir die Lösung nicht.“'},
  {part:'body',alt:'Fuji drückt mit der Nase die Tür auf, und Minka blickt vorsichtig in den dunklen Schuppen.',text:'Fuji schob seine Nase an die Tür. Zentimeter für Zentimeter drückte er sie auf. Es roch nach feuchtem Holz. Hinter einer Gießkanne wackelte ein umgedrehter Blumentopf. Unter seinem Rand steckte ein kleiner Igel fest. „Wir müssen ihm helfen“, sagte Minka leise.',speaker:'Fuji',dialogue:'„Wir entdecken das Problem. Die kleinen Handlungsschritte verzögern den Moment. Können wir den Igel befreien?“'},
  {part:'body',alt:'Fuji hält den Blumentopf vorsichtig mit einer Pfote, während Minka dem kleinen Igel Platz zum Herauskriechen macht.',text:'Fuji hob den Topfrand vorsichtig mit seiner Pfote an. Der Topf rutschte. Minka hielt den Atem an. Würde er wieder auf den Igel fallen? Fuji stemmte die Pfote fester auf den Rand. Minka schob einen kleinen Holzklotz in den Spalt. Einen Augenblick lang geschah nichts. Dann kroch der Igel endlich heraus.',speaker:'Minka',dialogue:'„Das ist der Höhepunkt: Jetzt entscheidet sich, ob die Rettung gelingt. Das Problem wird gelöst. Dieser Moment gehört noch zum Hauptteil.“'},
  {part:'end',alt:'Minka und Fuji schauen erleichtert zu, wie der befreite Igel in den Garten läuft.',text:'Erleichtert sahen Minka und Fuji dem Igel nach, der unter den Laubhaufen im Garten schlüpfte. Ihren Ball fanden sie gleich neben dem Schuppen. „Heute haben wir mehr gefunden als einen Ball“, meinte Fuji. Minka schnurrte. Gemeinsam machten sie sich auf den Heimweg.',speaker:'Fuji',dialogue:'„Das Abenteuer klingt aus. Du erfährst, wie es uns danach geht. Das ist unser Schluss.“'}
];
const partInfo = {
  intro:{title:'Einleitung: Orientierung geben',label:'Einleitung',color:'var(--blue)',html:'<div class="speech"><strong>Minka:</strong> „Am Anfang lernen wir die Figuren und ihre Ausgangssituation kennen.“</div><ul class="check-list"><li><strong>Wer?</strong> Minka und Fuji.</li><li><strong>Wann?</strong> Ein windiger Herbstnachmittag.</li><li><strong>Wo?</strong> Im Garten beim Holzschuppen.</li><li><strong>Ausgangssituation?</strong> Sie suchen ihren Ball.</li></ul><div class="clue"><strong>Woran erkennst du die Einleitung?</strong>Sie führt in die Handlung ein. Das eigentliche Abenteuer hat noch nicht seinen Höhepunkt erreicht. Sie verrät die Lösung nicht.</div>'},
  body:{title:'Hauptteil: das Abenteuer entfalten',label:'Hauptteil',color:'var(--pink)',html:'<div class="speech"><strong>Fuji:</strong> „Im Hauptteil erleben wir Schritt für Schritt, was passiert. Die Spannung wächst bis zum Höhepunkt.“</div><ul class="check-list"><li>Ein Kratzen macht neugierig.</li><li>Die Tür fällt zu: ein Hindernis.</li><li>Wir entdecken den gefangenen Igel.</li><li>Bei der Rettung entscheidet sich alles.</li></ul><div class="clue"><strong>Woran erkennst du den Hauptteil?</strong>Die Handlung entwickelt sich. Gedanken, Gefühle, Sinneseindrücke und wörtliche Rede machen sie lebendig. Der Höhepunkt gehört zum Hauptteil.</div>'},
  end:{title:'Schluss: das Abenteuer ausklingen lassen',label:'Schluss',color:'var(--accent)',html:'<div class="speech"><strong>Minka:</strong> „Am Ende erfahren wir, wie es nach dem Abenteuer weitergeht und wie sich die Figuren fühlen.“</div><ul class="check-list"><li>Der Igel ist frei und läuft davon.</li><li>Minka und Fuji sind erleichtert.</li><li>Sie finden den Ball und kehren heim.</li></ul><div class="clue"><strong>Woran erkennst du den Schluss?</strong>Die Folgen oder das Ergebnis werden deutlich. Die Handlung klingt aus. In einer geschlossenen Schulgeschichte beginnt gewöhnlich kein neues Problem.</div>'}
};
let sceneIndex = 0;
function renderScene(index) {
  if (!Number.isInteger(index) || index < 0 || index >= scenes.length) throw new Error('Unbekanntes Comicbild.');
  sceneIndex = index;
  const scene = scenes[index];
  $('#comic-image').src = `assets/scene-${index+1}.jpg`; $('#comic-image').alt = scene.alt;
  $('#comic-number').textContent = `Bild ${index+1}`;
  $('#comic-narrative').textContent = scene.text;
  $('#comic-dialogue').innerHTML = `<strong>${scene.speaker} erklärt:</strong> ${escapeHTML(scene.dialogue)}`;
  $('#scene-count').textContent = `${index+1} von ${scenes.length}`;
  $('#scene-prev').disabled = index === 0; $('#scene-next').disabled = index === scenes.length-1;
  const info = partInfo[scene.part];
  $$('[data-part]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.part === scene.part)));
  $('#part-title').textContent = info.title; $('#part-explanation').innerHTML = info.html;
  $('.guide-panel').style.borderTopColor = info.color;
  $('#story-text').innerHTML = scenes.map((s,i) => `<p class="${s.part === scene.part ? 'active-'+s.part : ''}"><span class="paragraph-label">Bild ${i+1} · ${partInfo[s.part].label}</span>${escapeHTML(s.text)}</p>`).join('');
}
$$('[data-part]').forEach(b => b.addEventListener('click',()=>renderScene(scenes.findIndex(s=>s.part===b.dataset.part))));
$('#scene-prev').addEventListener('click',()=>renderScene(sceneIndex-1));
$('#scene-next').addEventListener('click',()=>renderScene(sceneIndex+1));
renderScene(0);

const stations = [
  {name:'Einleitung',scene:0,quote:'„Wir suchen unseren Ball im Garten.“',explain:'Die Figuren, der Ort, der Zeitpunkt und die Ausgangssituation werden eingeführt. Die Spannung ist noch gering.'},
  {name:'Erster Hinweis',scene:1,quote:'„Was kratzt im Schuppen?“',explain:'Das rätselhafte Geräusch löst eine offene Frage aus. Das Abenteuer beginnt; die Spannung steigt.'},
  {name:'Steigerung',scene:2,quote:'„Die Tür fällt zu! Was steckt da drin?“',explain:'Ein Hindernis und die Unsicherheit lassen uns mitfiebern. Später entdecken die beiden den Igel. Die Spannung steigt weiter.'},
  {name:'Höhepunkt',scene:4,quote:'„Rutscht der Topf? Schaffen wir die Rettung?“',explain:'Beim Befreien des Igels entscheidet sich das Abenteuer. Die Spannung ist am stärksten, bis die Rettung gelingt. Der Höhepunkt gehört zum Hauptteil.'},
  {name:'Schluss',scene:5,quote:'„Der Igel ist frei. Wir sind erleichtert.“',explain:'Nach der Lösung fällt die Spannung. Die Folgen werden erzählt und die Geschichte klingt aus.'}
];
let stationIndex=0;
function setStation(index){
  if(!Number.isInteger(index)||!stations[index])throw new Error('Unbekannte Station.');
  stationIndex=index; const s=stations[index];
  $$('.wal-point').forEach((dot,i)=>dot.classList.toggle('current',i===index));
  $$('[data-station]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.station)===index)));
  $('#curve-explanation').innerHTML=`<strong>${index+1}. ${s.name}</strong><p>${escapeHTML(s.quote)}</p><p>${escapeHTML(s.explain)}</p><button type="button" id="show-curve-scene" class="secondary">Passendes Comicbild ansehen</button>`;
  $('#show-curve-scene').addEventListener('click',()=>{renderScene(s.scene);showPage('entdecken');});
}
$('#curve-stations').innerHTML=stations.map((s,i)=>`<button type="button" data-station="${i}" aria-pressed="false"><b>${i+1}</b>${s.name}</button>`).join('');
$$('[data-station]').forEach(b=>b.addEventListener('click',()=>setStation(Number(b.dataset.station))));setStation(0);
const curveEvents=[
  'Minka und Fuji kehren nach der Rettung erleichtert heim.',
  'Minka und Fuji suchen ihren Ball im Garten.',
  'Beim Anheben des Topfes entscheidet sich, ob der Igel frei kommt.',
  'Ein leises Kratzen dringt aus dem Schuppen.',
  'Die Tür fällt zu. Minka sieht im Dunkeln eine Bewegung.'
];
const curveAnswers=[1,3,4,2,0];
$('#curve-task').innerHTML=stations.map((s,i)=>`<div class="curve-task-row"><label for="curve-${i}">${i+1}. ${s.name}</label><select id="curve-${i}" aria-describedby="curve-field-${i}"><option value="">Ereignis auswählen</option>${curveEvents.map((event,j)=>`<option value="${j}">${escapeHTML(event)}</option>`).join('')}</select><div class="field-feedback" id="curve-field-${i}"></div></div>`).join('');
$('#curve-solution').innerHTML=stations.map((s,i)=>`<p><strong>${i+1}. ${s.name}:</strong> ${escapeHTML(curveEvents[curveAnswers[i]])}<br>${escapeHTML(s.explain)}</p>`).join('');
$('#check-curve').addEventListener('click',()=>{
  let correct=0,missing=0;
  stations.forEach((s,i)=>{
    const value=$(`#curve-${i}`).value,good=value!==''&&Number(value)===curveAnswers[i];
    correct+=good?1:0;missing+=value===''?1:0;
    $(`#curve-${i}`).setAttribute('aria-invalid',String(!good));
    $(`#curve-field-${i}`).textContent=good?'Passt.':value===''?'Wähle noch ein Ereignis.':`Schau auf die Aufgabe dieser Station: ${s.explain}`;
  });
  $('#curve-feedback').classList.toggle('good',correct===5);
  $('#curve-feedback').textContent=correct===5?'Alle fünf Ereignisse passen. Du hast den Spannungsverlauf erkannt!':`${correct} von 5 passen.${missing?' '+missing+' Zuordnungen fehlen noch.':''} Lies die Hinweise und verbessere deine Zuordnung.`;
});
$$('#curve-task select').forEach(s=>s.addEventListener('change',()=>{$('#curve-feedback').textContent='';s.removeAttribute('aria-invalid');$(`#curve-field-${s.id.split('-')[1]}`).textContent='';}));

const partsChoices=['Einleitung','Hauptteil','Schluss'];
const questions=[
  {id:1,topic:'parts',title:'Welcher Erzählteil ist das?',text:scenes[0].text,choices:partsChoices,answer:0,explain:'Die Figuren Minka und Fuji, der Herbstnachmittag, der Garten und die Ballsuche werden eingeführt. Das gibt Orientierung: die Einleitung.',hints:['Überlege, welche Aufgabe dieser Abschnitt hat.','Wer, wann, wo und die Ausgangssituation werden genannt.','Das eigentliche Abenteuer wird vorbereitet.']},
  {id:2,topic:'parts',title:'Welcher Erzählteil ist das?',text:scenes[1].text,choices:partsChoices,answer:1,explain:'Das rätselhafte Kratzen setzt das Abenteuer in Gang. Die offene Frage steigert die Spannung. Deshalb ist das Hauptteil.',hints:['Hier passiert mehr als die Vorstellung der Figuren.','Ein rätselhaftes Ereignis bringt die Handlung voran.','Spannungssteigerung gehört in den mittleren Erzählteil.']},
  {id:3,topic:'parts',title:'Welcher Erzählteil ist das?',text:scenes[5].text,choices:partsChoices,answer:2,explain:'Der Igel ist gerettet. Die Figuren sind erleichtert, finden den Ball und kehren heim. Die Geschichte klingt aus: der Schluss.',hints:['Ist das Problem noch offen oder schon gelöst?','Dieser Abschnitt zeigt, wie es nach dem Abenteuer weitergeht.','Die Handlung endet ruhig.']},
  {id:4,topic:'parts',title:'Gehört der Höhepunkt zum Schluss?',text:scenes[4].text,choices:['Ja, jeder spannende Moment ist der Schluss.','Nein, der Höhepunkt gehört zum Hauptteil.','Nein, der Höhepunkt gehört zur Einleitung.'],answer:1,explain:'Bei der Rettung entscheidet sich die Handlung. Das ist der Höhepunkt im Hauptteil. Danach folgt das Ausklingen im Schluss.',hints:['Unterscheide den entscheidenden Moment vom Ausklingen.','Jetzt steht das Ergebnis des Abenteuers noch auf dem Spiel.','Die stärkste Spannung gehört in den Hauptteil.']},
  {id:5,topic:'parts',title:'Was ist die Aufgabe des Hauptteils?',text:'Fuji fragt: „Was gehört zwischen den Anfang und das Ende?“',choices:['Nur die Namen und den Ort aufzählen.','Die gesamte Lösung sofort verraten.','Die Handlung entwickeln und bis zum Höhepunkt spannend erzählen.'],answer:2,explain:'Der Hauptteil entwickelt das Abenteuer. Ereignisse, Hindernisse, Gedanken und Gefühle führen zum Höhepunkt.',hints:['Denke an die Bilder 2 bis 5.','Wir hören das Kratzen, entdecken den Igel und helfen ihm.','Der mittlere Teil zeigt den Weg zum entscheidenden Moment.']},
  {id:6,topic:'parts',title:'Kannst du Erzählteile an der Länge erkennen?',text:'Minka sagt: „Der Absatz hat nur einen Satz. Also ist er bestimmt der Schluss!“',choices:['Ja. Ein kurzer Absatz ist immer der Schluss.','Nein. Entscheidend ist seine Aufgabe in der Geschichte.','Ja. Lange Absätze sind immer die Einleitung.'],answer:1,explain:'Die Funktion entscheidet. Auch ein Satz im Hauptteil kann sehr kurz sein: „Der Topf rutschte.“ Kurze Absätze sind nicht automatisch Schlussabsätze.',hints:['Kann ein kurzer Satz auch eine neue Gefahr zeigen?','„Der Topf rutschte.“ ist kurz, steigert aber die Spannung.','Frage, was der Absatz für die Handlung leistet.']},
  {id:7,topic:'intro',title:'Welche Einleitung gibt gute Orientierung?',text:'Minka und Fuji sollen im Garten einen Ball suchen. Welcher Anfang passt?',choices:['Es war spannend. Wir waren dort. Dann ging es los.','Am Herbstnachmittag suchten Minka und Fuji ihren Ball im Garten hinter dem Haus.','Zum Glück hatten wir den Igel gerettet. Zufrieden gingen wir nach Hause.'],answer:1,explain:'Dieser Einstieg nennt Figuren, Zeit, Ort und Ausgangssituation. Der erste ist ungenau. Der letzte klingt bereits wie ein Schluss.',hints:['Suche konkrete Angaben statt „dort“ oder „es“.','Die Leser sollen wissen, wer wo und wann etwas tut.','Die Rettung sollte am Anfang noch nicht verraten werden.']},
  {id:8,topic:'intro',title:'Welche wichtige Angabe fehlt?',text:'„Am Samstag suchten Minka und Fuji ihren roten Ball.“ Was erfahren wir noch nicht?',choices:['Wer dabei ist.','Wann es passiert.','Wo die Suche beginnt.'],answer:2,explain:'Die Figuren und der Samstag sind genannt. Ein Ort fehlt noch, zum Beispiel „im Garten“. Ein wichtiger Ort hilft den Lesern, die Szene zu verstehen.',hints:['Markiere gedanklich die Figuren.','„Am Samstag“ nennt den Zeitpunkt.','Den Schauplatz kannst du dir noch nicht genau vorstellen.']},
  {id:9,topic:'intro',title:'Was verrät am Anfang zu viel?',text:'Welcher Satz nimmt der Schuppengeschichte schon ihre Lösung vorweg?',choices:['Hinter der Tür kratzte etwas.','Es war ein windiger Herbstnachmittag.','Am Ende befreiten Minka und Fuji den Igel unter dem Blumentopf.'],answer:2,explain:'Der dritte Satz verrät den Igel und seine Rettung. Damit nimmt er die Lösung vorweg. Ein rätselhaftes Geräusch darf dagegen neugierig machen.',hints:['Die Einleitung darf eine Frage öffnen.','Das Ergebnis des Abenteuers sollte noch offen bleiben.','Welcher Satz berichtet schon, wie alles ausgeht?']},
  {id:10,topic:'intro',title:'Was bedeutet „Ausgangssituation“?',text:'Fuji fragt: „Was beschreibe ich mit der Ausgangssituation?“',choices:['Was die Figuren am Anfang tun und in welcher Lage sie sind.','Ausschließlich den letzten Satz.','Eine Liste aller Wörter einer Geschichte.'],answer:0,explain:'Die Ausgangssituation ist die Lage am Anfang. Bei Minka und Fuji ist das die Suche nach dem Ball. Aus ihr entwickelt sich das Abenteuer.',hints:['Das Wort „Ausgang“ bedeutet hier: Startpunkt.','Denke an die erste Szene vor dem rätselhaften Kratzen.','Was tun Minka und Fuji zunächst?']},
  {id:11,topic:'intro',title:'Wie verbindest du W-Fragen zu einer Einleitung?',text:'Deine Notizen: Wer: Minka und Fuji. Wann: Dienstagabend. Wo: Garten. Was: Ball suchen.',choices:['Wer: Minka und Fuji. Wann: Dienstag. Wo: Garten. Was: Ball.','Am Dienstagabend suchten Minka und Fuji ihren Ball im Garten.','Minka und Fuji sind dann am Ende glücklich gewesen.'],answer:1,explain:'Der zweite Satz verbindet die Informationen zu einem flüssigen Erzähltext. Stichwörter helfen beim Planen; die fertige Einleitung braucht zusammenhängende Sätze.',hints:['Notizen sind noch keine fertige Erzählung.','Verbinde die Angaben zu einem vollständigen Satz.','Der Satz sollte die Anfangssituation beschreiben.']},
  {id:12,topic:'intro',title:'Welche Zeitform ist das Präteritum?',text:'Für diese Erzählübung sollst du im Präteritum schreiben. Welcher Satz passt?',choices:['Minka sucht den Ball.','Minka wird den Ball suchen.','Minka suchte den Ball.'],answer:2,explain:'„Suchte“ steht im Präteritum. „Sucht“ ist Präsens, „wird suchen“ ist Futur I. Für Schulgeschichten wird oft das Präteritum verlangt; beachte die Aufgabe.',hints:['Präteritum ist eine Vergangenheitsform.','Vergleiche: heute sucht – gestern …','Beim regelmäßigen Verb „suchen“ endet diese Form auf „-te“.']},
  {id:13,topic:'tension',title:'Was sagt die Höhe der Spannungskurve aus?',text:'Minka zeigt auf den höchsten Punkt am Rücken des Spannungskurvenwals.',choices:['Dort ist der Ort der Handlung am höchsten gelegen.','Hier fiebern die Leser am stärksten mit.','Hier müssen die meisten Wörter stehen.'],answer:1,explain:'Die Höhe veranschaulicht die Stärke der Spannung. Der höchste Punkt steht für den Höhepunkt. Die Kurve zeigt weder die Höhe des Schauplatzes noch die Wortzahl.',hints:['Der Wal ist eine Merkhilfe für das Mitfiebern.','Die waagerechte Richtung zeigt den Verlauf der Handlung.','Die senkrechte Höhe zeigt die Stärke der Spannung.']},
  {id:14,topic:'tension',title:'Welcher Satz zeigt ein Gefühl anschaulich?',text:'Minka möchte „Ich hatte Angst“ lebendiger erzählen.',choices:['Es war wirklich sehr, sehr spannend.','Ich hatte Angst, weil ich Angst hatte.','Mein Herz klopfte. Ich wagte kaum zu atmen.'],answer:2,explain:'Herzklopfen und angehaltener Atem machen das Gefühl spürbar. Bloß „spannend“ zu behaupten oder denselben Ausdruck zu wiederholen zeigt wenig.',hints:['Wie merkt die Figur ihre Angst im Körper?','Zeigen wirkt anschaulicher als nur ein Gefühl zu benennen.','Suche den Satz mit einer körperlichen Reaktion.']},
  {id:15,topic:'tension',title:'Welche Fassung verlangsamt den Moment?',text:'Fuji drückt die Tür auf. Welche Fassung lässt uns länger mitfiebern?',choices:['Fuji ging hinein und sah alles.','Fuji legte die Nase an die Tür. Er hielt inne. Dann schob er sie Zentimeter für Zentimeter auf.','Fuji war ein Wolfhund.'],answer:1,explain:'Die Handlung wird in kleine Schritte aufgeteilt. Die Pause verzögert die Entdeckung. So wird ein entscheidender Moment ausführlicher erzählt.',hints:['Welche Fassung zerlegt die Handlung in kleine Schritte?','Ein kurzes Innehalten kann das Ergebnis verzögern.','Achte auf „Zentimeter für Zentimeter“.']},
  {id:16,topic:'tension',title:'Woran erkennst du den Höhepunkt unserer Geschichte?',text:'Welche Szene ist der entscheidende Moment des Abenteuers?',choices:['Beim Anheben des Topfes entscheidet sich, ob die Rettung gelingt.','Die beiden suchen am Anfang ihren Ball.','Nach der Rettung gehen die beiden heim.'],answer:0,explain:'Die Rettung ist der entscheidende Moment. Die Ball-Suche führt ein, der Heimweg lässt die Geschichte ausklingen.',hints:['Wo steht am meisten auf dem Spiel?','Die Entdeckung des Igels führt noch zur eigentlichen Herausforderung.','Der Höhepunkt beantwortet: Gelingt die Rettung?']},
  {id:17,topic:'tension',title:'Welcher Schluss passt zu einer geschlossenen Geschichte?',text:'Der Igel ist gerettet. Wie kann das Abenteuer ruhig ausklingen?',choices:['Plötzlich tauchte ein Drache auf und jagte die beiden.','Die beiden waren erleichtert und sahen dem Igel nach. Dann gingen sie gemeinsam heim.','Am Nachmittag wollten die beiden ihren Ball suchen.'],answer:1,explain:'Erleichterung, der sichere Igel und der Heimweg runden das Abenteuer ab. Ein neuer Drache würde eine neue Handlung anfangen. Die Ballsuche ist eine Ausgangssituation.',hints:['Das Problem ist schon gelöst.','Zeige das Ergebnis und die Gefühle danach.','Für diesen Schluss beginnt kein neues Abenteuer.']},
  {id:18,topic:'tension',title:'Macht „plötzlich“ allein eine Geschichte spannend?',text:'Fuji schreibt: „Plötzlich war es plötzlich spannend.“',choices:['Ja, das Wort reicht immer aus.','Ja, wenn das Wort mindestens dreimal vorkommt.','Nein. Konkrete Ereignisse, offene Fragen und Gefühle lassen uns mitfiebern.'],answer:2,explain:'Spannung entsteht durch die Handlung und ihre Darstellung. Ein unerwartetes Ereignis kann helfen, aber „plötzlich“ ersetzt keine anschauliche Szene.',hints:['Weißt du bei Fujis Satz, was tatsächlich geschieht?','Leser brauchen etwas, das sie sich vorstellen können.','Ein Geräusch und eine offene Frage können mehr bewirken als ein bloßes Signalwort.']}
];
let quizIds=questions.map(q=>q.id),quizIndex=0;
const quizRecords=new Map();
const topicLabels={parts:'Erzählteile erkennen',intro:'Einleitung verstehen',tension:'Spannung und Schluss'};
function record(id){if(!quizRecords.has(id))quizRecords.set(id,{selected:null,first:null,solved:false,hints:0,shown:false,message:''});return quizRecords.get(id);}
function stats(){
  const answered=quizIds.filter(id=>{const r=record(id);return r.first!==null||r.shown;}).length;
  const independent=quizIds.filter(id=>{const r=record(id);return r.first?.correct&&!r.first.helped;}).length;
  const solved=quizIds.filter(id=>record(id).solved).length;
  return {answered,independent,solved,total:quizIds.length};
}
function updateQuizStats(){const s=stats();$('#quiz-position').textContent=quizIndex<quizIds.length?`Aufgabe ${quizIndex+1} von ${s.total}`:'Runde beendet';$('#quiz-score').textContent=`${s.independent} beim ersten Versuch ohne Hilfe richtig`;$('#quiz-progress').max=s.total;$('#quiz-progress').value=s.answered;}
function renderQuiz(focus=false){
  updateQuizStats();
  const card=$('#quiz-card');
  if(quizIndex>=quizIds.length){
    const s=stats();
    const weak=[...new Set(quizIds.filter(id=>{const r=record(id);return !r.first?.correct||r.first.helped;}).map(id=>questions.find(q=>q.id===id).topic))];
    card.innerHTML=`<div class="speech"><strong>Fuji:</strong> „Du hast die Runde geschafft. Schau, was schon sicher klappt und was du weiter üben kannst.“</div><div class="summary-result"><p class="big">${s.independent} / ${s.total}</p><p>Beim ersten Versuch ohne Hilfe richtig.</p><p>${s.solved} Aufgaben hast du selbst richtig beantwortet, auch nach einer Verbesserung. Hilfen und Musterlösungen sind zum Lernen da.</p>${weak.length?`<h3>Dein nächster Lernschritt</h3><p>Wiederhole: ${weak.map(t=>topicLabels[t]).join(', ')}. Schau dir dazu die Erklärungen von Minka und Fuji an.</p>`:'<p>Du hast alle Aufgaben beim ersten Versuch ohne Hilfe richtig beantwortet. Nutze dein Wissen jetzt für eine eigene Einleitung.</p>'}<button type="button" class="primary" id="quiz-write">Zur Schreibwerkstatt</button> <button type="button" class="secondary" id="quiz-repeat">Diese Runde wiederholen</button></div>`;
    $('#quiz-write').addEventListener('click',()=>showPage('schreiben'));$('#quiz-repeat').addEventListener('click',restartQuiz);
  }else{
    const q=questions.find(q=>q.id===quizIds[quizIndex]),r=record(q.id);
    card.innerHTML=`<div class="speech"><strong>${quizIndex%2?'Fuji':'Minka'}:</strong> „Lies genau. Überlege, was der Text für die Geschichte leistet.“</div><p class="eyebrow">${topicLabels[q.topic]}</p><h2 tabindex="-1" id="question-heading">${q.title}</h2><div class="question-text">${escapeHTML(q.text)}</div><div class="choices" role="group" aria-label="Antwortmöglichkeiten">${q.choices.map((choice,i)=>`<button type="button" class="choice ${r.solved&&i===q.answer?'correct':''} ${r.message&&!r.solved&&r.selected===i?'incorrect':''}" data-choice="${i}" aria-pressed="${r.selected===i}" ${r.solved?'disabled':''}><span class="letter" aria-hidden="true">${'ABC'[i]}</span>${escapeHTML(choice)}</button>`).join('')}</div><div id="answer-feedback" class="feedback ${r.solved?'good':''}" role="status">${escapeHTML(r.message)}</div><div class="quiz-actions"><button type="button" id="check-answer" class="primary" ${r.selected===null||r.solved?'disabled':''}>Antwort prüfen</button><button type="button" id="quiz-hint" class="secondary" ${r.hints===3?'disabled':''}>${r.hints===3?'Alle 3 Hilfen geöffnet':`Hilfe ${r.hints+1} von 3`}</button></div>${r.hints?`<div class="hint-box">${q.hints.slice(0,r.hints).map((h,i)=>`<p><strong>Hilfe ${i+1}:</strong> ${escapeHTML(h)}</p>`).join('')}</div>`:''}<details id="quiz-solution" ${r.shown?'open':''}><summary>Musterlösung mit Erklärung</summary><p><strong>${escapeHTML(q.choices[q.answer])}</strong></p><p>${escapeHTML(q.explain)}</p></details><div class="quiz-actions"><button type="button" id="quiz-prev" class="secondary" ${quizIndex===0?'disabled':''}>Vorherige Aufgabe</button><button type="button" id="quiz-next" class="primary" ${!r.solved&&!r.shown?'disabled':''}>${quizIndex===quizIds.length-1?'Rückmeldung ansehen':'Nächste Aufgabe'}</button></div>`;
    $$('[data-choice]').forEach(b=>b.addEventListener('click',()=>{r.selected=Number(b.dataset.choice);r.message='';renderQuiz();$(`[data-choice="${r.selected}"]`).focus({preventScroll:true});}));
    $('#check-answer').addEventListener('click',()=>{
      if(r.selected===null||r.solved)return;
      const good=r.selected===q.answer;
      if(r.first===null)r.first={correct:good,helped:r.hints>0||r.shown};
      r.solved=good;
      r.message=good?`Richtig. ${q.explain}`:'Das passt noch nicht. Überlege, welche Aufgabe der Abschnitt hat. Du kannst eine andere Antwort wählen oder eine Hilfe öffnen.';
      renderQuiz();
      $('#answer-feedback').tabIndex=-1;$('#answer-feedback').focus({preventScroll:true});
    });
    $('#quiz-hint').addEventListener('click',()=>{r.hints=Math.min(3,r.hints+1);renderQuiz();$('.hint-box').tabIndex=-1;$('.hint-box').focus({preventScroll:true});});
    $('#quiz-solution').addEventListener('toggle',e=>{if(e.target.open&&e.target.isConnected){r.shown=true;$('#quiz-next').disabled=false;updateQuizStats();}});
    $('#quiz-prev').addEventListener('click',()=>{quizIndex--;renderQuiz(true);});
    $('#quiz-next').addEventListener('click',()=>{if(r.solved||r.shown){quizIndex++;renderQuiz(true);}});
  }
  if(focus){const h=$('#question-heading');if(h)h.focus({preventScroll:true});else card.scrollIntoView({block:'start'});}
}
function restartQuiz(){quizIds.forEach(id=>quizRecords.delete(id));quizIndex=0;renderQuiz();}
$('#restart-quiz').addEventListener('click',restartQuiz);
$('#quiz-filter').addEventListener('change',()=>{const t=$('#quiz-filter').value;quizIds=questions.filter(q=>t==='all'||q.topic===t).map(q=>q.id);quizIndex=0;renderQuiz();});
renderQuiz();

const writingPrompts={
  school:{description:'Minka und Fuji suchen im Garten nach einem verschwundenen Ball. Ein Geräusch am Schuppen macht sie neugierig. Erfinde einen anderen Verlauf als im Comic.',who:'Minka und Fuji',when:'an einem windigen Herbstnachmittag',where:'im Garten hinter dem Haus',what:'sie suchen ihren roten Ball',model:'An einem windigen Herbstnachmittag suchten Minka und Fuji ihren roten Ball im Garten hinter dem Haus. Beim Spielen war er neben den alten Schuppen gerollt. Als die beiden näher kamen, hörten sie ein leises Rascheln hinter der Tür.',explain:'Die Figuren, die Zeit, der Ort und die Ballsuche werden vorgestellt. Das Rascheln macht neugierig. Wir erfahren noch nicht, was dahintersteckt.'},
  trip:{description:'Minka und Fuji spazieren am See. Unter einem Steg entdecken sie etwas Merkwürdiges. Was könnte daraus für eine Geschichte entstehen?',who:'Minka und Fuji',when:'an einem frühen Sommermorgen',where:'am kleinen See hinter dem Wald',what:'sie spazieren gemeinsam am Ufer entlang',model:'An einem frühen Sommermorgen liefen Minka und Fuji am kleinen See hinter dem Wald entlang. Während Fuji am Ufer schnupperte, sprang Minka auf den niedrigen Steg. Zwischen den Brettern blitzte etwas Goldenes auf.',explain:'Wer, wann, wo und die Anfangshandlung sind klar. Das goldene Blitzen öffnet eine Frage. Die Entdeckung wird noch nicht vollständig erklärt.'},
  key:{description:'Minka und Fuji erkunden mit Erlaubnis den Dachboden. Neben einer Kiste liegt ein alter Schlüssel. Du entscheidest später, zu welchem Rätsel er führt.',who:'Minka und Fuji',when:'an einem regnerischen Sonntagnachmittag',where:'auf dem Dachboden',what:'sie schauen sich die alten Kisten an',model:'An einem regnerischen Sonntagnachmittag durften Minka und Fuji den Dachboden erkunden. Zwischen staubigen Kisten entdeckte Minka einen kleinen Schlüssel. Fuji schnupperte daran. An seinem Ring hing ein Zettel mit einer fast verblassten Zahl.',explain:'Die Ausgangssituation erklärt, warum die beiden dort sind. Der Schlüssel ist ein erster Hinweis. Welches Rätsel er löst, bleibt offen.'}
};
const checklist=[
  {label:'Meine wichtigen Figuren werden vorgestellt.',tip:'Wer ist dabei? Stelle Minka und Fuji oder deine eigenen Figuren vor.'},
  {label:'Der Ort der Handlung wird deutlich.',tip:'Wo beginnt die Geschichte? Nenne einen Ort, den man sich vorstellen kann.'},
  {label:'Der Zeitpunkt wird deutlich, wenn er für meine Geschichte wichtig ist.',tip:'Prüfe, ob ein Zeitpunkt hilft, etwa „an einem Herbstnachmittag“. Nicht jede Geschichte braucht ein genaues Datum.'},
  {label:'Man versteht, was die Figuren am Anfang tun.',tip:'Was ist die Ausgangssituation? Erkläre zum Beispiel, was die Figuren suchen oder vorhaben.'},
  {label:'Ich verrate die Lösung des Abenteuers noch nicht.',tip:'Streiche verratene Lösungen. Ein rätselhaftes Geräusch darf bleiben; wer dahintersteckt, kann noch offen sein.'},
  {label:'Meine Sätze hängen zusammen und meine Zeitform und Perspektive passen.',tip:'Verbinde deine Notizen zu Sätzen. Bleibe bei Ich oder Er/Sie und prüfe die Zeitform deiner Aufgabe.'},
  {label:'Ein erster Hinweis macht neugierig und wird später in meiner Geschichte aufgegriffen.',tip:'Lege eine Spannungsschlinge: ein Geräusch, eine Spur oder eine offene Frage. Verrate die Lösung noch nicht und plane die spätere Auflösung.'},
  {label:'Meine Verben, Satzanfänge und Adjektive passen zur Szene und sind abwechslungsreich.',tip:'Ersetze ungenaue Verben gezielt. Variiere die Satzanfänge und nutze wenige treffende Adjektive. Hilfe findest du unter „Erzählsprache trainieren“.'},
  {label:'Ich habe Satzanfänge, Satzzeichen und die Großschreibung überprüft.',tip:'Lies langsam Satz für Satz. Prüfe Satzanfänge, Nomen und Satzzeichen. Bei wörtlicher Rede brauchst du die passenden Zeichen.'}
];
$('#writing-checks').innerHTML=checklist.map((c,i)=>`<label><input type="checkbox" id="writing-check-${i}"><span>${c.label}</span></label>`).join('');
const promptDrafts=new Map();let currentPrompt='school';
function saveDraft(){promptDrafts.set(currentPrompt,{text:$('#draft').value,plan:['who','when','where','what'].map(k=>$(`#plan-${k}`).value),checks:checklist.map((_,i)=>$(`#writing-check-${i}`).checked)});}
function loadPrompt(id){
  const p=writingPrompts[id];if(!p)throw new Error('Unbekannter Schreibanlass.');currentPrompt=id;
  $('#prompt-description').textContent=p.description;
  const saved=promptDrafts.get(id);
  ['who','when','where','what'].forEach((k,i)=>{$(`#plan-${k}`).value=saved?saved.plan[i]:p[k];});
  $('#draft').value=saved?saved.text:'';
  checklist.forEach((_,i)=>{$(`#writing-check-${i}`).checked=saved?saved.checks[i]:false;});
  $('#writing-model').innerHTML=`<p class="model-text">${escapeHTML(p.model)}</p><p>${escapeHTML(p.explain)}</p><p>Das ist eine mögliche Einleitung. Dein eigener Anfang darf anders sein.</p>`;
  $('#writing-example').open=false;$('#writing-feedback').textContent='';countWords();
}
function countWords(){const t=$('#draft').value.trim();const n=t?t.split(/\s+/u).length:0;$('#word-count').textContent=`${n} ${n===1?'Wort':'Wörter'} · Keine feste Wortzahl: Gib so viel Orientierung wie nötig.`;return n;}
$('#writing-prompt').addEventListener('change',()=>{saveDraft();loadPrompt($('#writing-prompt').value);});
$('#draft').addEventListener('input',()=>{countWords();$('#writing-feedback').textContent='';});
$$('#writing-checks input').forEach(el=>el.addEventListener('change',()=>{$('#writing-feedback').textContent='';}));
$('#writing-feedback-button').addEventListener('click',()=>{
  const box=$('#writing-feedback'),n=countWords();
  if(n===0){box.textContent='Schreibe zuerst eine eigene Einleitung. Nutze dafür deine Ideen auf Minkas Ideenblock.';return;}
  const missing=checklist.filter((_,i)=>!$(`#writing-check-${i}`).checked);
  box.classList.toggle('good',missing.length===0);
  box.innerHTML=missing.length?`<strong>Minkas Überarbeitungshilfe</strong><p>Nach deinen Häkchen solltest du noch Folgendes prüfen:</p><ul>${missing.map(c=>`<li>${c.tip}</li>`).join('')}</ul><p>Verbessere deinen Text und überprüfe dann deine Häkchen erneut.</p>`:'<strong>Fujis Rückmeldung</strong><p>Nach deiner Selbsteinschätzung erfüllt deine Einleitung alle Punkte. Lies sie einer anderen Person vor: Kann sie sich die Ausgangssituation vorstellen? Lass Inhalt und Sprache zusätzlich prüfen.</p>';
});
loadPrompt('school');

// Optionaler Browserstandard: dieselben sichtbaren Lernaktionen für unterstützende Agenten.
const modelContext=document.modelContext;
if(modelContext?.registerTool){
  const lifecycle=new AbortController();
  const tools=[
    {name:'read_learning_state',title:'Lernstand dieser Seite ansehen',description:'Liest den geöffneten Lernbereich, das Comicbild und die Übungsbilanz dieser Sitzung. Liest keinen Schülertext.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){if(input===null||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('Leeres Objekt erwartet.');return {page:activePage,comicScene:sceneIndex+1,curveStation:stationIndex+1,quiz:stats()};}},
    {name:'navigate_learning_section',title:'Lernbereich öffnen',description:'Öffnet einen der neun sichtbaren Lernbereiche, ohne Antworten zu geben oder Texte zu verändern.',inputSchema:{type:'object',properties:{section:{type:'string',enum:['studio','entdecken','spannung','ueben','schreiben','lesen','sprache','lehrgang','hauptteil']}},required:['section'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length!==1||typeof input.section!=='string')throw new Error('section erwartet.');showPage(input.section);return {page:activePage};}}
  ];
  tools.forEach(tool=>{try{Promise.resolve(modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}});
  window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}

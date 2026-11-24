'use strict';
const learningGoals=[
 ['Ich kann zu einer Farbe ihre Farbgruppe nennen.','farbgruppen'],
 ['Ich kann ein Verhältnis von 3 zu 1 mit Pinselportionen erklären.','mischlabor'],
 ['Ich kann erklären, was beim Nebeneinandermalen und beim Mischen passiert.','komplementaerfarben'],
 ['Ich kann die Gegenfarbe im Farbkreis finden.','farbkreis']
];
const wordbook=[
 ...wortlisteFarben,
 ['Farbton','Der Farbton beschreibt, ob eine Farbe zum Beispiel rötlich, bläulich oder grünlich aussieht. Hellrot und Dunkelrot unterscheiden sich in der Helligkeit. Beide haben einen roten Farbton.'],
 ['Buntheit','Wie kräftig oder gedämpft eine Farbe wirkt. Auch Farbsättigung genannt.'],
 ['Helligkeit','Wie hell oder dunkel eine Farbe erscheint. Auch ein dunkles Blau kann kräftig wirken.'],
 ['Pigment','Ein färbender Stoff in deiner Malfarbe. Verschiedene Pigmente können unterschiedlich stark färben.']
];
const reportFields=[
 ['plan','Meine Frage vor dem Versuch'],['change','Das verändere ich'],['same','Das halte ich gleich'],['finding','Das habe ich beobachtet'],['reason','Meine Erklärung']
];
function learningPass(){
 stage.innerHTML=`<article class="surface pass"><p class="eyebrow">LERNPASS</p><h2>Mein Farbversuch</h2><p>Entscheide, was du üben möchtest. Du kannst schreiben, die Fragen mündlich beantworten oder ein Blatt ausdrucken.</p><details><summary>Wo wird mein Versuch gespeichert?</summary><p>Dein persönlicher Lernpass bleibt in diesem Browser auf diesem Gerät. Beim Beenden eines Gastdurchgangs werden seine Einträge gelöscht. Lade vor dem Gerätewechsel oder vor dem Schließen des Gast-Tabs deinen Versuch als Text herunter.</p></details>
 <details open><summary>Meine Lernziele</summary><p>Schätze dich selbst ein. Du kannst deine Einschätzung jederzeit ändern.</p><div id="goals"></div></details>
 <details><summary>Farbsprache nachschlagen</summary><dl>${wordbook.map(([k,v])=>'<dt>'+k+'</dt><dd>'+v+(k==='Farbton'?'<div class="tone-pair"><span style="background:#ffacac;color:#251414">Hellrot</span><span style="background:#801717;color:white">Dunkelrot</span></div>':'')+reader(k+'. '+v)+'</dd>').join('')}</dl></details>
 <details><summary>Ein Mischrezept überprüfen</summary><p>Jona möchte Gelb-Orange mischen. Er nimmt drei Portionen Rot und eine Portion Gelb. Sage voraus, welchem Farbton seine Mischung näher kommt. Wie würdest du sein Rezept ändern?</p><details><summary>Meine Erklärung vergleichen</summary><p>Rot überwiegt. Jonas Mischung geht eher in Richtung Rot-Orange. Für Gelb-Orange beginnt er mit mehr Gelb als Rot. Mit echten Malfarben kann er die Menge anpassen.</p></details></details>
 <details><summary>Gestaltungsauftrag: ein Tier im Herbstlaub</summary><p>Ein kleiner Fuchs soll in einem Bild auffallen und sich im zweiten verstecken. Behalte das Orange seines Fells bei und wähle zwei Hintergründe. Begründe deine Wahl.</p><a href="#bildaufgabe?motiv=fuchs">Zwei Fuchsbilder gestalten</a><details><summary>Eine mögliche Lösung</summary><p>Auf blauem Grund hebt sich Orange deutlich ab. Zwischen orangefarbenen und gelbroten Blättern fügt es sich eher ein. Auch Helligkeit und Muster beeinflussen die Wirkung.</p></details></details>
 <details open><summary>Mein Versuchsprotokoll</summary><p>Wähle eine Frage für deinen Versuch. Halte fest, was du veränderst und was gleich bleibt.</p><div id="recordHeader"></div><div id="reportFields"></div><h3>Meine Farbproben</h3><div class="swatch-grid" id="reportSamples"></div></details>
 <details><summary>Partnergespräch und Rückblick</summary><p>Zeige eine Probe, ohne ihr Rezept zu verraten. Dein Gegenüber vermutet die Ausgangsfarben und begründet die Wahl. Vergleicht mit dem Rezept und tauscht die Rollen.</p><label>Das hat mir mein Gegenüber erklärt<textarea id="partner" rows="2" maxlength="350"></textarea></label><label>Das möchte ich beim nächsten Mal allein schaffen<textarea id="nextGoal" rows="2" maxlength="350"></textarea></label></details>
 <div class="tools"><button id="printPass">Lernpass drucken</button><a id="copyPass" href="#" download>Als Text herunterladen</a></div><p id="passStatus" role="status"></p></article>`;
 learningGoals.forEach(([text,link],i)=>{
   const row=document.createElement('div');row.className='goal-row';
   row.innerHTML='<label>'+text+'<select id="goal'+i+'">'+options(['Noch offen','Ich übe noch','Mit Hilfe','Selbstständig'],Number(read('goal'+i)||0))+'</select></label><a href="#'+link+'">Dazu üben</a>';
   row.insertAdjacentHTML('beforeend',goalDemo(i));by('goals').append(row);by('goal'+i).onchange=e=>save('goal'+i,e.target.value);
 });
 reportFields.forEach(([id,label])=>{const row=document.createElement('label');row.innerHTML=label+'<textarea rows="2" id="'+id+'" maxlength="650"></textarea>';by('reportFields').append(row);noteField(id,'pass.'+id)});
 noteField('partner','pass.partner');noteField('nextGoal','pass.nextGoal');
 setupRecord();
}
function sampleRecipe(s){return (100-s.n)+' % '+names[s.a]+' + '+s.n+' % '+names[s.b]}
function sampleText(s){return sampleRecipe(s)+(s.note?' · '+s.note:'')}
const big=by('largeType');
function setType(){const on=read('largeType')==='1';document.body.classList.toggle('large-type',on);big.setAttribute('aria-pressed',String(on))}
big.onclick=()=>{save('largeType',read('largeType')==='1'?'0':'1');setType()};setType();
document.querySelector('.skip').onclick=e=>{e.preventDefault();const target=stage.hidden?by('startTitle'):stage;target.setAttribute('tabindex','-1');target.focus();target.scrollIntoView()};
const pace=document.createElement('label');pace.innerHTML='Lesetempo <select aria-label="Lesetempo"><option value="normal">Normal</option><option value="langsam">Langsam</option></select>';
if('speechSynthesis' in window){document.querySelector('.class-tools').append(pace);const select=pace.querySelector('select');select.value=read('speechPace')||'normal';select.onchange=()=>save('speechPace',select.value)}
route();

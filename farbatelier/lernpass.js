'use strict';
const learningGoals=[
 ['Ich kann zu einer Farbe ihre Gruppe und Gegenfarbe nennen.','farbkreis'],
 ['Ich kann ein Verhältnis von 3 zu 1 mit Pinselportionen erklären.','mischlabor'],
 ['Ich kann erklären, was beim Nebeneinandermalen und beim Mischen passiert.','komplementaerfarben']
];
const wordbook=[
 ['Primärfarbe','Eine der drei Grundfarben in Ittens Modell: Gelb, Rot oder Blau.'],
 ['Sekundärfarbe','Eine Mischung aus zwei Grundfarben. Aus Gelb und Blau entsteht zum Beispiel Grün.'],
 ['Tertiärfarbe','Eine Zwischenfarbe im Itten-Kreis, etwa Gelb-Grün zwischen Gelb und Grün.'],
 ['Komplementärfarbe','Die Farbe, die einem Farbton im Kreis genau gegenüberliegt. Gegenfarbe bedeutet dasselbe.'],
 ['Farbton','Der Name der Farbe, zum Beispiel Rot oder Blau-Grün.'],
 ['Buntheit','Wie kräftig oder gedämpft eine Farbe wirkt. Auch Farbsättigung genannt.'],
 ['Helligkeit','Wie hell oder dunkel eine Farbe erscheint. Auch ein dunkles Blau kann kräftig wirken.'],
 ['Pigment','Ein färbender Stoff in deiner Malfarbe. Verschiedene Pigmente können unterschiedlich stark färben.']
];
const reportFields=[
 ['plan','Meine Frage vor dem Versuch'],['change','Das verändere ich'],['same','Das halte ich gleich'],['finding','Das habe ich beobachtet'],['reason','Meine Erklärung']
];
function learningPass(){
 stage.innerHTML=`<article class="surface pass"><p class="eyebrow">LERNPASS</p><h2>Mein Farbversuch</h2><p>Entscheide, was du üben möchtest. Du kannst schreiben, die Fragen mündlich beantworten oder ein Blatt ausdrucken.</p>
 <details open><summary>Meine Lernziele</summary><p>Schätze dich selbst ein. Du kannst deine Einschätzung jederzeit ändern.</p><div id="goals"></div></details>
 <details><summary>Farbsprache nachschlagen</summary><dl>${wordbook.map(([k,v])=>'<dt>'+k+'</dt><dd>'+v+'</dd>').join('')}</dl></details>
 <details><summary>Ein Mischrezept überprüfen</summary><p>Jona möchte Gelb-Orange mischen. Er nimmt drei Portionen Rot und eine Portion Gelb. Sage voraus, welchem Farbton seine Mischung näher kommt. Wie würdest du sein Rezept ändern?</p><details><summary>Meine Erklärung vergleichen</summary><p>Rot überwiegt. Jonas Mischung geht eher in Richtung Rot-Orange. Für Gelb-Orange beginnt er mit mehr Gelb als Rot. Mit echten Malfarben kann er die Menge anpassen.</p></details></details>
 <details><summary>Gestaltungsauftrag: ein Tier im Herbstlaub</summary><p>Ein kleiner Fuchs soll in einem Bild auffallen und sich im zweiten verstecken. Behalte das Orange seines Fells bei und wähle zwei Hintergründe. Begründe deine Wahl.</p><a href="#bildaufgabe">Farbwirkung am Bildpaar erproben</a><details><summary>Eine mögliche Lösung</summary><p>Auf blauem Grund hebt sich Orange deutlich ab. Zwischen orangefarbenen und gelbroten Blättern fügt es sich eher ein. Auch Helligkeit und Muster beeinflussen die Wirkung.</p></details></details>
 <details open><summary>Mein Versuchsprotokoll</summary><p>Beispiel: Was passiert, wenn zu derselben Menge Orange immer mehr Blau kommt? Nutze möglichst dieselben Farben, gleich große Portionen und denselben Untergrund.</p><div id="reportFields"></div><h3>Meine Farbproben</h3><div class="swatch-grid" id="reportSamples"></div></details>
 <details><summary>Partnergespräch und Rückblick</summary><p>Zeige eine Probe, ohne ihr Rezept zu verraten. Dein Gegenüber vermutet die Ausgangsfarben und begründet die Wahl. Vergleicht mit dem Rezept und tauscht die Rollen.</p><label>Das hat mir mein Gegenüber erklärt<textarea id="partner" rows="2" maxlength="350"></textarea></label><label>Das möchte ich beim nächsten Mal allein schaffen<textarea id="nextGoal" rows="2" maxlength="350"></textarea></label></details>
 <div class="tools"><button id="printPass">Lernpass drucken</button><button id="copyPass">Als Text herunterladen</button></div><p id="passStatus" role="status"></p></article>`;
 learningGoals.forEach(([text,link],i)=>{
   const row=document.createElement('div');row.className='goal-row';
   row.innerHTML='<label>'+text+'<select id="goal'+i+'">'+options(['Noch offen','Ich übe noch','Mit Hilfe','Selbstständig'],Number(read('goal'+i)||0))+'</select></label><a href="#'+link+'">Dazu üben</a>';
   by('goals').append(row);by('goal'+i).onchange=e=>save('goal'+i,e.target.value);
 });
 reportFields.forEach(([id,label])=>{const row=document.createElement('label');row.innerHTML=label+'<textarea rows="2" id="'+id+'" maxlength="650"></textarea>';by('reportFields').append(row);noteField(id,'pass.'+id)});
 noteField('partner','pass.partner');noteField('nextGoal','pass.nextGoal');
 if(!samples.length)by('reportSamples').innerHTML='<p>Im <a href="#mischlabor">Mischlabor</a> kannst du bis zu drei beschriftete Proben ablegen.</p>';
 samples.forEach(s=>{const f=document.createElement('figure');const paint=document.createElement('i');paint.style.background=s.color;const cap=document.createElement('figcaption');cap.textContent=sampleText(s);f.append(paint,cap);by('reportSamples').append(f)});
 by('copyPass').onclick=()=>{const url=URL.createObjectURL(new Blob([passText()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Mein-Farbversuch.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);by('passStatus').textContent='Der Textdownload wurde gestartet.'};
 by('printPass').onclick=()=>{const sheet=document.createElement('article');sheet.className='print-sheet';sheet.textContent=passText();const colors=by('reportSamples').cloneNode(true);colors.removeAttribute('id');if(samples.length)sheet.append(colors);document.body.append(sheet);window.addEventListener('afterprint',()=>sheet.remove(),{once:true});window.print()};
}
function sampleText(s){return (100-s.n)+' % '+names[s.a]+' + '+s.n+' % '+names[s.b]+(s.note?' · '+s.note:'')}
function passText(){
 const goals=learningGoals.map(([label],i)=>label+' – '+by('goal'+i).selectedOptions[0].textContent);
 const lines=reportFields.concat([['partner','Partnergespräch'],['nextGoal','Mein nächstes Ziel']]).map(([id,label])=>label+'\n'+(by(id).value||'________________________________________'));
 return ['Mein Farbversuch · Farbatelier','Meine Lernziele',...goals,...lines,'Meine Proben',...samples.map(sampleText)].join('\n\n');
}
const big=by('largeType');
function setType(){const on=read('largeType')==='1';document.body.classList.toggle('large-type',on);big.setAttribute('aria-pressed',String(on))}
big.onclick=()=>{save('largeType',read('largeType')==='1'?'0':'1');setType()};setType();
document.querySelector('.skip').onclick=e=>{e.preventDefault();stage.focus();stage.scrollIntoView()};
const pace=document.createElement('label');pace.innerHTML='Lesetempo <select aria-label="Lesetempo"><option value="normal">Normal</option><option value="langsam">Langsam</option></select>';
if('speechSynthesis' in window){document.querySelector('.class-tools').append(pace);const select=pace.querySelector('select');select.value=read('speechPace')||'normal';select.onchange=()=>save('speechPace',select.value)}
route();

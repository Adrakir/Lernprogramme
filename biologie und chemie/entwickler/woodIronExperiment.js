
(function(){
'use strict';
const KEY='chemie5-holz-eisen-v1',el=id=>document.getElementById(id);
let mode='gentle',assisted=false,answers=Array(8).fill('');
const gaps=[
 {before:'Bei Wärmeleitung wird Energie vom ',after:' Bereich weitergegeben.',answer:'wärmeren',words:['kälteren','wärmeren','gleich warmen'],why:'Ein Temperaturunterschied treibt die Energieübertragung an.'},
 {before:'Die Energie gelangt dabei zum ',after:' Bereich.',answer:'kälteren',words:['kälteren','wärmeren','immer oberen'],why:'Ohne zusätzliche Arbeit wird Energie vom wärmeren zum kälteren Bereich übertragen.'},
 {before:'Der Stab aus ',after:' ist ein guter Wärmeleiter.',answer:'Eisen',words:['Holz','Eisen','Luft'],why:'Eisen ist ein Metall und leitet Wärme gut.'},
 {before:'Trockenes Holz leitet Wärme ',after:' als Eisen.',answer:'schlechter',words:['besser','gar nicht','schlechter'],why:'Holz ist ein schlechterer Wärmeleiter; es kann trotzdem heiß werden.'},
 {before:'Bei starkem Erhitzen kann Holz ',after:' oder brennen.',answer:'verkohlen',words:['immer schmelzen','verkohlen','grundsätzlich kalt bleiben'],why:'Holz kann sich beim starken Erhitzen zersetzen und verkohlen; mit Sauerstoff kann es brennen.'},
 {before:'Kompaktes Eisen kann bei ausreichend hoher Temperatur ',after:'.',answer:'glühen',words:['zu Holz werden','immer kalt bleiben','glühen'],why:'Glühen ist die sichtbare Wärmestrahlung eines ausreichend heißen Körpers.'},
 {before:'Die Temperatur eines möglicherweise heißen Stabs prüfe ich ',after:'.',answer:'mit geeigneter Messtechnik nach Anleitung',words:['mit der bloßen Hand','mit geeigneter Messtechnik nach Anleitung','mit der Zunge'],why:'Anfassen kann Verbrennungen verursachen. Verwende geeignete Hilfsmittel unter Aufsicht.'},
 {before:'Den Satz „Das Holz wird an einer Stelle dunkler“ schreibe ich in die ',after:'.',answer:'Beobachtung',words:['Materialliste','Auswertung','Beobachtung'],why:'Die sichtbare Farbveränderung ist eine Beobachtung. Ihre Ursache erklärst du in der Auswertung.'}
];
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(Array.isArray(s?.answers))answers=gaps.map((g,i)=>g.words.includes(s.answers[i])?s.answers[i]:'')}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({answers}))}catch(e){}};
function draw(){const n=Number(el('heTime').value);let body='<g font-size="20" font-weight="800"><text x="36" y="55">Eisenstab</text><text x="36" y="175">Holzstab</text></g>';
 for(let row=0;row<2;row++)for(let j=0;j<13;j++){
  const amount=n/10*Math.exp(-j/(row===0?8:1));let fill=`rgb(${[160,209,225].map((v,k)=>Math.round(v+([232,139,69][k]-v)*amount)).join(',')})`;
  if(mode==='strong'&&n>=7&&j<3)fill=row===0?'#cf603e':'#4c3528';
  body+=`<rect x="${38+j*43}" y="${68+row*120}" width="43" height="29" fill="${fill}" stroke="#4b6c7b" stroke-width="1"/>`;
 }
 body+='<text x="40" y="265" font-size="16">Erwärmtes Ende links</text><text x="333" y="265" font-size="16">Gleiche Länge und Dicke</text>';
 el('heArt').innerHTML=`<svg viewBox="0 0 640 300" role="img" aria-label="Qualitatives Modell von Eisen- und Holzstab beim Erwärmen" style="display:block;width:100%;max-height:310px;background:#eff7f5;border-radius:13px"><g font-family="system-ui" fill="#193440">${body}</g></svg>`;
 el('heTimeLabel').textContent=n===0?'Start':`Schritt ${n} von 10`;
 el('heObservation').textContent=n===0?'Beide Stäbe sind anfangs gleich warm. Wähle einen Modellschritt.':mode==='gentle'?'Im Modell verteilt sich die Erwärmung beim Eisenstab weiter entlang des Stabs. Beim Holzstab bleibt sie stärker in der Nähe des erwärmten Endes.':n<7?'Das Modell zeigt zunächst die Erwärmung. Schiebe den Regler weiter, um mögliche Veränderungen bei stärkerem Erhitzen zu vergleichen.':'Modellbeobachtung: Das Holz wird am stark erhitzten Ende dunkel. Das Eisen wird dort als glühend dargestellt. Mögliche Vorgänge hängen von Temperatur und Bedingungen ab; daraus folgt nicht, dass Eisen unter allen Bedingungen unverändert bleibt.';
}
for(const[id,m]of[['heGentle','gentle'],['heStrong','strong']])el(id).addEventListener('click',()=>{mode=m;el('heGentle').setAttribute('aria-pressed',String(m==='gentle'));el('heStrong').setAttribute('aria-pressed',String(m==='strong'));draw()});
el('heTime').addEventListener('input',draw);el('heStep').addEventListener('click',()=>{el('heTime').value=String(Math.min(10,Number(el('heTime').value)+1));draw()});el('heReset').addEventListener('click',()=>{el('heTime').value='0';draw()});
gaps.forEach((g,i)=>{const row=document.createElement('p');row.className='he-gap';row.append(document.createTextNode(`${i+1}. ${g.before}`));const select=document.createElement('select');select.setAttribute('aria-label','Lücke '+(i+1));select.dataset.heGap=String(i);const blank=document.createElement('option');blank.value='';blank.textContent='…';select.appendChild(blank);g.words.forEach(word=>{const op=document.createElement('option');op.value=word;op.textContent=word;select.appendChild(op)});select.value=answers[i];select.addEventListener('change',()=>{answers[i]=select.value;save()});row.append(select,document.createTextNode(g.after));const status=document.createElement('span');status.id='heGapStatus'+i;status.className='he-gap-status';row.appendChild(status);el('heCloze').appendChild(row)});
el('heCheck').addEventListener('click',()=>{let n=0;gaps.forEach((g,i)=>{const ok=answers[i]===g.answer;if(ok)n++;el('heGapStatus'+i).textContent=ok?' ✓':answers[i]?' Noch nicht passend. '+g.why:' Bitte ausfüllen.';window.LernCockpit?.record({id:'chem-wood-iron-'+i,topic:'thermal',correct:ok,assisted,mode:'übung',skill:'anwenden'})});el('heFeedback').textContent=`${n} von 8 Lücken richtig.`+(n===8?' Prima! Die Musterlösung ist verfügbar.':' Nutze die Erklärungen und versuche es erneut.');el('heSolution').hidden=n!==8;if(n<8)assisted=true;});
el('heHint').addEventListener('click',()=>{assisted=true;el('heHintText').hidden=false;el('heHintText').textContent='Denke an die Richtung der Energieübertragung. Eisen ist ein Metall. Schlechte Wärmeleitung heißt nicht, dass Holz nicht heiß werden kann. Beschreiben und Erklären gehören in verschiedene Protokollabschnitte.'});
el('heClear').addEventListener('click',()=>{answers=Array(8).fill('');assisted=false;document.querySelectorAll('[data-he-gap]').forEach(s=>s.value='');gaps.forEach((g,i)=>el('heGapStatus'+i).textContent='');el('heSolution').hidden=true;el('heFeedback').textContent='Fülle alle acht Lücken aus.';save()});
gaps.forEach(g=>{const p=document.createElement('p');p.textContent=g.before+g.answer+g.after+' '+g.why;el('heSolutionText').appendChild(p)});draw();
})();


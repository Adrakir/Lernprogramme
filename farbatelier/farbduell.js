'use strict';
const app=document.querySelector('#app');
const letters=['A','B','C','D'],colors=['#f2b57e','#a7cfda','#cdb6de','#c1d79a'];
let deck,teams,scores,round,votes,missed,solo,training;
document.body.classList.toggle('dark',read('theme')==='dark');
document.body.classList.toggle('large-type',read('largeType')==='1');
function show(html){
 app.innerHTML=html;
 const title=app.querySelector('h1,h2');title.tabIndex=-1;title.focus({preventScroll:true});window.scrollTo(0,0);
}
function button(id,handler){document.getElementById(id).onclick=handler}
function shuffled(items){
 const copy=[...items];
 for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}
 return copy;
}
function home(){
 show('<section class="hero"><span class="k">Quiz aus dem Mischlabor</span><h1>Farbduell</h1><p>Erkenne Gegenfarben, löse Mischrätsel und sammle Punkte im Atelier.</p></section><section class="panel"><h2>Deine Spielrunde</h2><div class="opts"><label>Spielmodus<select id="mode"><option value="1">Allein spielen</option><option value="2">2 Teams</option><option value="3">3 Teams</option><option value="4">4 Teams</option></select></label><label>Thema<select id="topic"><option>Gemischt</option><option>Farbkreis</option><option>Mischen</option><option>Bildwirkung</option></select></label><label>Rundenlänge<select id="size"></select></label></div><p class="muted" id="hint"></p><button class="go" id="start">Runde starten</button></section>');
 const mode=document.querySelector('#mode'),topic=document.querySelector('#topic'),size=document.querySelector('#size');
 const pool=()=>fragen.filter(f=>topic.value==='Gemischt'||f.topic===topic.value);
 function sizes(){const total=pool().length,prev=Number(size.value)||10;const choices=[5,10,20,40].filter(n=>n<=total);
  if(total<40&&!choices.includes(total))choices.push(total);
  size.replaceChildren(...choices.map(n=>new Option(n+' Fragen',n)));size.value=choices.includes(prev)?prev:choices[0];}
 function hint(){document.querySelector('#hint').textContent=mode.value==='1'?'Spiele in deinem Tempo. Jede richtige Antwort zählt einen Punkt.':'Spielt an einem Bildschirm. Legt euch auf A, B, C oder D fest. Die Spielleitung kann Eingaben bis zur Auflösung berichtigen.'}
 topic.onchange=sizes;mode.onchange=hint;sizes();hint();
 button('start',()=>start(+mode.value,shuffled(pool()).slice(0,+size.value),false));
}
function start(count,items,practice){
 deck=items;training=practice;solo=count===1;teams=Array.from({length:count},(_,i)=>solo?'Du':'Team '+(i+1));
 scores=teams.map(()=>0);missed=[];round=0;newQuestion();
}
function newQuestion(){votes=[];question()}
function revise(){votes.pop();question()}
function question(){
 const item=deck[round],ready=votes.length===teams.length;
 const answers=item.a.map((a,i)=>'<button data-i="'+i+'" aria-label="'+letters[i]+' · '+a+'"><b style="--c:'+colors[i]+'">'+letters[i]+'</b>'+(item.pairs?duellMotiv(item.motif,item.pairs[i]):a)+'</button>').join('');
 show('<section class="panel"><div class="row"><span class="k">'+(training?'Übungsfrage ':'Frage ')+(round+1)+' von '+deck.length+'</span><button class="plain" id="leave">Runde beenden</button></div><progress aria-label="Beantwortete Fragen" value="'+round+'" max="'+deck.length+'"></progress><h2>'+item.q+'</h2>'+
 (ready?'<p>Alle Teams haben gewählt.</p><button class="go" id="reveal">Lösung aufdecken</button>':'<p class="muted">'+(solo?'Wähle deine Antwort.':teams[votes.length]+' · Antwort eintragen')+'</p><div class="answers">'+answers+'</div>'+
 (item.pairs?'<details><summary>Bildbeschreibungen</summary><ol type="A">'+item.a.map(a=>'<li>'+a+'</li>').join('')+'</ol></details>':''))+
 (!solo&&votes.length?'<button class="plain" id="revise">Eingabe von '+teams[votes.length-1]+' berichtigen</button>':'')+'</section>');
 button('leave',()=>{if(confirm('Runde beenden und zur Spielauswahl zurückkehren?'))home()});
 if(!solo&&votes.length)button('revise',revise);
 if(ready){button('reveal',reveal);return}
 app.querySelectorAll('[data-i]').forEach(el=>el.onclick=()=>{votes.push(+el.dataset.i);if(solo)reveal();else question()});
}
function reveal(){
 const item=deck[round],correct=votes.map(v=>v===item.k);
 correct.forEach((ok,i)=>{if(ok)scores[i]++});if(correct.includes(false))missed.push(item);
 show('<section class="panel"><span class="k">Auflösung · Frage '+(round+1)+'</span><h2>'+(solo?(correct[0]?'Richtig!':'Schau noch einmal hin.'):'Das ist die Lösung')+'</h2><p class="summary"><strong>'+letters[item.k]+' · '+item.a[item.k]+'</strong></p><div class="begruendung">'+(item.axis===undefined?'':farbring(3,[item.axis,opposite(item.axis)],true))+'<p>'+item.why+'</p></div>'+teams.map((name,i)=>'<p>'+name+' · Antwort '+letters[votes[i]]+' · '+(correct[i]?'+1 Punkt':'0 Punkte')+' · Gesamt '+scores[i]+'</p>').join('')+'<button class="go" id="next">'+(round+1===deck.length?'Ergebnis ansehen':'Nächste Frage')+'</button></section>');
 button('next',()=>{round++;if(round===deck.length)finish();else newQuestion()});
}
function transfer(){
 const result=[];
 for(const skill of new Set(missed.map(q=>q.skill))){
  const pool=shuffled(fragen.filter(q=>q.skill===skill));
  const candidate=pool.find(q=>!deck.includes(q))||transferfragen.find(q=>q.skill===skill);
  if(candidate)result.push(candidate);
 }
 return result;
}
function finish(){
 const max=Math.max(...scores),winners=teams.filter((_,i)=>scores[i]===max),extra=transfer();
 show('<section class="hero"><span class="k">'+(training?'Übungsrunde':'Rundenergebnis')+'</span><h2>'+(solo?scores[0]+' von '+deck.length+' richtig':winners.length>1?'Gleichstand!':winners[0]+' gewinnt!')+'</h2></section><section class="panel">'+(solo?'':teams.map((name,i)=>'<p><strong>'+name+'</strong> · '+scores[i]+' von '+deck.length+' Punkten</p>').join(''))+(missed.length?'<details><summary>Diese '+missed.length+' Fragen noch einmal ansehen</summary><ol class="review">'+missed.map(item=>'<li>'+item.q+'<span><strong>'+item.a[item.k]+'</strong></span>'+item.why+'</li>').join('')+'</ol></details>':'<p>Alle Fragen richtig beantwortet!</p>')+(extra.length?'<button class="go" id="practice">Ähnliche Aufgaben üben ('+extra.length+')</button> ':'')+'<button id="again">Neue Runde</button></section>');
 if(extra.length)button('practice',()=>start(teams.length,extra,true));button('again',home);
}
home();

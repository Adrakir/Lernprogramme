const app=document.querySelector('#app');
const letters=['A','B','C','D'],colors=['#f2b57e','#a7cfda','#cdb6de','#c1d79a'];
let deck,teams,scores,round,turn,votes,missed,solo;
function show(html){app.innerHTML=html;const title=app.querySelector('h1,h2');title.tabIndex=-1;title.focus({preventScroll:true});window.scrollTo(0,0)}
function button(id,handler){document.getElementById(id).onclick=handler}
function home(){
 show('<section class="hero"><span class="k">Quiz aus dem Mischlabor</span><h1>Farbduell</h1><p>Erkenne Gegenfarben, löse Mischrätsel und sammle Punkte im Atelier.</p></section><section class="panel"><h2>Deine Spielrunde</h2><div class="opts"><label>Spielmodus<select id="mode"><option value="1">Allein spielen</option><option value="2">2 Teams</option><option value="3">3 Teams</option><option value="4">4 Teams</option></select></label><label>Rundenlänge<select id="size"><option>5</option><option selected>10</option><option>20</option><option>40</option></select></label></div><p class="muted" id="hint"></p><button class="go" id="start">Runde starten</button></section>');
 const mode=document.getElementById('mode'), hint=document.getElementById('hint');
 function update(){hint.textContent=mode.value==='1'?'Spiele in deinem Tempo. Jede richtige Antwort zählt einen Punkt.':'Spielt an einem Bildschirm. Alle Teams legen sich auf A, B, C oder D fest. Die Spielleitung trägt die Antworten ein und deckt die Lösung auf.'}
 mode.onchange=update;update();button('start',()=>start(+mode.value,+document.getElementById('size').value))
}
function start(count,size){
 deck=[...fragen];for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}deck=deck.slice(0,size);
 solo=count===1;teams=Array.from({length:count},(_,i)=>solo?'Du':'Team '+(i+1));scores=teams.map(()=>0);missed=[];round=0;newQuestion()
}
function newQuestion(){votes=[];turn=0;question()}
function question(){
 const item=deck[round];
 show('<section class="panel"><div class="row"><span class="k">Frage '+(round+1)+' von '+deck.length+'</span><button class="plain" id="leave">Runde beenden</button></div><progress aria-label="Beantwortete Fragen" value="'+round+'" max="'+deck.length+'"></progress><h2>'+item.q+'</h2><p class="muted">'+(solo?'Wähle deine Antwort.':teams[turn]+' · Antwort eintragen')+'</p><div class="answers">'+item.a.map((a,i)=>'<button data-i="'+i+'"><b style="--c:'+colors[i]+'">'+letters[i]+'</b>'+a+'</button>').join('')+'</div></section>');
 button('leave',()=>{if(confirm('Runde beenden und zur Spielauswahl zurückkehren?'))home()});
 app.querySelectorAll('[data-i]').forEach(el=>el.onclick=()=>{votes.push(+el.dataset.i);turn++;if(turn===teams.length)reveal();else question()})
}
function reveal(){
 const item=deck[round],correct=votes.map(v=>v===item.k);
 correct.forEach((ok,i)=>{if(ok)scores[i]++});if(correct.includes(false))missed.push(item);
 show('<section class="panel"><span class="k">Auflösung · Frage '+(round+1)+'</span><h2>'+(solo?(correct[0]?'Richtig!':'Schau noch einmal hin.'):'Das ist die Lösung')+'</h2><p class="summary"><strong>'+letters[item.k]+' · '+item.a[item.k]+'</strong></p>'+teams.map((name,i)=>'<p>'+name+' · Antwort '+letters[votes[i]]+' · '+(correct[i]?'+1 Punkt':'0 Punkte')+' · Gesamt '+scores[i]+'</p>').join('')+'<button class="go" id="next">'+(round+1===deck.length?'Ergebnis ansehen':'Nächste Frage')+'</button></section>');
 button('next',()=>{round++;if(round===deck.length)finish();else newQuestion()})
}
function finish(){
 const max=Math.max(...scores),winners=teams.filter((_,i)=>scores[i]===max);
 show('<section class="hero"><span class="k">Rundenergebnis</span><h2>'+(solo?scores[0]+' von '+deck.length+' richtig':winners.length>1?'Gleichstand!':winners[0]+' gewinnt!')+'</h2></section><section class="panel">'+(solo?'':teams.map((name,i)=>'<p><strong>'+name+'</strong> · '+scores[i]+' von '+deck.length+' Punkten</p>').join(''))+(missed.length?'<details><summary>Diese '+missed.length+' Fragen noch einmal ansehen</summary><ol class="review">'+missed.map(item=>'<li>'+item.q+'<span><strong>'+item.a[item.k]+'</strong></span></li>').join('')+'</ol></details>':'<p>Alle Fragen richtig beantwortet!</p>')+'<button class="go" id="again">Neue Runde</button></section>');button('again',home)
}
home()

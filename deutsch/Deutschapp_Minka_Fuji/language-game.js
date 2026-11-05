'use strict';

const MF_LANGUAGE_GAME = (() => {
  const dialog=document.getElementById('language-game');
  const title=document.getElementById('language-game-title');
  const body=document.getElementById('language-game-body');
  const ROUND_SIZE=8;
  const SECONDS=45;
  let game=null, timer=null, deadline=0, opener=null;

  function shuffle(values){
    const result=[...values];
    for(let i=result.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [result[i],result[j]]=[result[j],result[i]];
    }
    return result;
  }

  function stopTimer(){
    clearInterval(timer);
    timer=null;
    deadline=0;
  }

  function close(){
    stopTimer();
    if(typeof dialog.close==='function')dialog.close();
    else{
      dialog.removeAttribute('open');
      opener?.focus();
    }
  }

  function setup(){
    body.innerHTML=`<p>Spiele ${ROUND_SIZE} Fragen zu diesem Thema. Jede richtige Antwort bringt einen Punkt. Nach jeder Frage siehst du die Lösung mit Erklärung.</p>
      <label class="language-game-clock-option"><input id="language-game-clock" type="checkbox" ${game.timed?'checked':''}> Mit Timer spielen · ${SECONDS} Sekunden pro Frage</label>
      <button type="button" class="primary" id="language-game-start">Runde starten</button>`;
    const start=body.querySelector('#language-game-start');
    start.onclick=()=>{
      game.timed=body.querySelector('#language-game-clock').checked;
      const recognize=shuffle(game.pool.filter(q=>q.level==='erkennen')).slice(0,ROUND_SIZE/2);
      const used=new Set(recognize.map(q=>q.title));
      const reason=shuffle(game.pool.filter(q=>q.level==='begruenden'&&!used.has(q.title))).slice(0,ROUND_SIZE/2);
      game.items=shuffle([...recognize,...reason]);
      game.index=0;
      game.answers=[];
      question();
    };
    dialog.scrollTop=0;
    start.focus({preventScroll:true});
  }

  function question(){
    stopTimer();
    const q=game.items[game.index];
    const points=game.answers.filter(a=>a.correct).length;
    body.innerHTML=`<div class="language-game-stats"><span>Frage ${game.index+1} von ${game.items.length}</span><span id="language-game-points">${points} ${points===1?'Punkt':'Punkte'}</span>${game.timed?'<span id="language-game-time" aria-label="Verbleibende Zeit"></span>':''}</div>
      <progress aria-label="Bearbeitete Fragen" value="${game.index}" max="${game.items.length}"></progress>
      <h3 id="language-game-question" tabindex="-1">${escapeHTML(q.title)}</h3>
      <p class="language-game-text">${escapeHTML(q.text)}</p>
      <div class="language-game-choices" role="group" aria-label="Antwortmöglichkeiten">${shuffle(q.options.map((_,i)=>i)).map((i,position)=>`<button type="button" data-game-answer="${i}" class="language-game-card" data-game-color="${position}"><span aria-hidden="true">${'ABC'[position]}</span>${escapeHTML(q.options[i])}</button>`).join('')}</div>
      <div id="language-game-feedback" role="status" tabindex="-1"></div>
      <button type="button" class="primary" id="language-game-next" hidden>${game.index===game.items.length-1?'Auswertung ansehen':'Nächste Frage'}</button>`;
    body.querySelectorAll('[data-game-answer]').forEach(button=>button.onclick=()=>{
      answer(deadline&&performance.now()>=deadline?null:Number(button.dataset.gameAnswer));
    });
    body.querySelector('#language-game-next').onclick=()=>{
      game.index++;
      if(game.index===game.items.length)results();
      else question();
    };
    dialog.scrollTop=0;
    body.querySelector('#language-game-question').focus({preventScroll:true});
    if(game.timed){
      deadline=performance.now()+SECONDS*1000;
      const remaining=body.querySelector('#language-game-time');
      const tick=()=>{
        const seconds=Math.max(0,Math.ceil((deadline-performance.now())/1000));
        remaining.textContent=`${seconds} s`;
        if(!seconds)answer(null);
      };
      timer=setInterval(tick,250);
      tick();
    }
  }

  function answer(selected){
    if(game.answers.length>game.index)return;
    stopTimer();
    const q=game.items[game.index];
    const correct=selected===q.answer;
    game.answers.push({selected,correct});
    const points=game.answers.filter(a=>a.correct).length;
    body.querySelector('#language-game-points').textContent=`${points} ${points===1?'Punkt':'Punkte'}`;
    if(selected===null)body.querySelector('#language-game-time').textContent='0 s';
    body.querySelector('progress').value=game.answers.length;
    body.querySelectorAll('[data-game-answer]').forEach(button=>{
      const value=Number(button.dataset.gameAnswer);
      button.disabled=true;
      button.classList.toggle('game-correct',value===q.answer);
      button.classList.toggle('game-wrong',value===selected&&!correct);
    });
    const feedback=body.querySelector('#language-game-feedback');
    feedback.innerHTML=`<strong>${selected===null?'Zeit abgelaufen.':correct?'Richtig! Ein Punkt.':'Das war noch nicht die passende Antwort.'}</strong>
      <p><strong>Lösung</strong> ${escapeHTML(q.options[q.answer])}</p><p>${escapeHTML(q.explain)}</p>`;
    body.querySelector('#language-game-next').hidden=false;
    feedback.focus();
  }

  function results(){
    const points=game.answers.filter(a=>a.correct).length;
    body.innerHTML=`<h3 id="language-game-result" tabindex="-1">${points} von ${game.items.length} Punkten</h3>
      <p>Öffne eine Frage, um deine Antwort mit der Lösung zu vergleichen.</p>
      ${game.items.map((q,i)=>{
        const a=game.answers[i];
        return `<details ${a.correct?'':'open'}><summary>${i+1}. ${escapeHTML(q.title)} · ${a.correct?'richtig':a.selected===null?'Zeit abgelaufen':'noch üben'}</summary>
          <p class="language-game-text">${escapeHTML(q.text)}</p>
          <p><strong>Deine Antwort</strong> ${a.selected===null?'Keine Antwort':escapeHTML(q.options[a.selected])}</p>
          <p><strong>Lösung</strong> ${escapeHTML(q.options[q.answer])}</p><p>${escapeHTML(q.explain)}</p></details>`;
      }).join('')}
      <button type="button" class="primary" id="language-game-again">Noch eine Runde</button>`;
    body.querySelector('#language-game-again').onclick=setup;
    dialog.scrollTop=0;
    body.querySelector('#language-game-result').focus({preventScroll:true});
  }

  document.getElementById('language-game-close').onclick=close;
  dialog.addEventListener('close',()=>{if(!dialog.open){stopTimer();opener?.focus();}});
  dialog.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&typeof dialog.close!=='function')close();
  });

  return {
    open(topic,button){
      stopTimer();
      opener=button;
      game={pool:MF_LANGUAGE_PRACTICE[topic.id],timed:false};
      title.textContent=`Quiz · ${topic.title}`;
      if(typeof dialog.showModal==='function')dialog.showModal();
      else{dialog.classList.add('game-fallback');dialog.setAttribute('open','');}
      setup();
    }
  };
})();

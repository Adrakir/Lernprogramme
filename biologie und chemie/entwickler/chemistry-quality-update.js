
(()=>{
  const $=id=>document.getElementById(id);
  const styles=document.createElement('style');
  styles.textContent=`
    .chemistry-update-banner{margin:12px auto;padding:12px 16px;max-width:1200px;border:1px solid #9bc9c5;border-radius:14px;background:#eaf8f5;color:#174b49;font-weight:700}
    .benno-card{display:grid;grid-template-columns:90px 1fr;gap:14px;align-items:center;margin:16px 0;padding:16px;border:2px solid #9bc9c5;border-radius:18px;background:linear-gradient(120deg,#eefbf4,#fff8df)}
    .benno-card svg{width:86px;height:86px}.benno-card h3{margin:0 0 6px}.benno-card p{margin:5px 0}
    .benno-rules{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px;margin:10px 0 0;padding:0;list-style:none}
    .benno-rules li{padding:9px;border-radius:10px;background:#fff;border:1px solid #c9dfd9}
    .safety-quiz{margin-top:18px}.safety-quiz .quiz-answers{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:9px}
    .safety-quiz .quiz-answers button{min-height:54px;text-align:left}.safety-quiz .quiz-answers button:focus-visible,.burner-parts button:focus-visible{outline:3px solid #176e77;outline-offset:2px}
    .safety-quiz .quiz-answers button.correct{border-color:#208163;background:#e0f7e9}.safety-quiz .quiz-answers button.wrong{border-color:#b85144;background:#fff0ee}
    .burner-parts{margin-top:15px}.burner-parts details{margin:8px 0}.burner-parts ol{padding-left:25px}
    .burner-parts .parts-quiz{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}
    .burner-parts button{min-height:48px}.burner-mark{font-size:13px;font-weight:900;fill:#123f49;stroke:#fff;stroke-width:3px;paint-order:stroke}
    .virtual-burner-svg #virtualSupplyHose{fill:none;stroke:#e0a13a;stroke-width:8;stroke-linecap:round}
    .virtual-burner-svg #virtualGasSource{fill:#fff4d5;stroke:#9b7334;stroke-width:2}
    .virtual-burner-svg .virtual-valve{fill:#d96f53;stroke:#8d3e32;stroke-width:2}
    .virtual-burner-svg .part-dot{fill:#fff;stroke:#15737a;stroke-width:3}
    .virtual-burner-svg .part-number{font-size:11px;font-weight:900;fill:#174b49;text-anchor:middle;dominant-baseline:middle}
    .benno-explanation{margin-top:12px;padding:12px;border-radius:12px;background:#fff8df;border-left:5px solid #e0a13a}
    .v5-ghs-grid button{overflow:hidden}.v5-ghs-grid button svg{width:78px;height:78px;max-width:100%;max-height:78px;object-fit:contain;overflow:visible}
    .c6-illustration{display:flex;flex-direction:column;align-items:center;gap:6px}.c6-flame-heading{align-self:stretch;padding:8px 12px;border-radius:9px;background:#eef6f5;color:#234751;font-size:16px;font-weight:800;text-align:center}
    @media(max-width:560px){.benno-card{grid-template-columns:64px 1fr;padding:12px}.benno-card svg{width:62px;height:62px}.virtual-burner-svg{max-width:100%}.safety-quiz .quiz-answers{grid-template-columns:1fr}}
  `;
  document.head.appendChild(styles);
  document.title='Chemie-Entdeckerlabor · Version 7.3';
  const banner=document.createElement('div');
  banner.className='chemistry-update-banner';
  banner.setAttribute('role','status');
  banner.textContent='Chemie-Entdeckerlabor · Version 7.3 – neu: Ethanol-Heizkurve, Benno-Sicherheitstraining und Brennerteile-Quiz.';
  const main=document.querySelector('main');
  if(main)main.insertBefore(banner,main.firstChild);

  const benno=`<svg viewBox="0 0 100 100" role="img" aria-label="Benno Brenner, ein freundlicher Comic-Lernbegleiter"><path d="M17 39Q10 16 29 22Q40 1 54 20Q75 5 77 28Q96 22 85 44" fill="#f2a43a" stroke="#9d5b28" stroke-width="3"/><circle cx="51" cy="49" r="31" fill="#ffd29c" stroke="#9d6c45" stroke-width="3"/><path d="M34 47h8m22 0h8" stroke="#493e39" stroke-width="4" stroke-linecap="round"/><path d="M43 63q9 8 18 0" fill="none" stroke="#a84d38" stroke-width="3" stroke-linecap="round"/><path d="M26 78q25-13 50 0l8 19H18Z" fill="#4f99a0" stroke="#27656b" stroke-width="3"/><path d="M43 79l8 8 8-8" fill="#fff" stroke="#27656b" stroke-width="2"/></svg>`;
  const safety=$('page-safety');
  if(safety){
    const scene=$('safetyScene');
    if(scene){
      scene.insertAdjacentHTML('beforebegin',`<div class="benno-card">${benno}<div><h3>Benno Brenner: Erst sicher handeln, dann forschen!</h3><p>Im Labor wird nichts probiert oder eigenmächtig bedient. Wenn etwas passiert, informierst du sofort die Lehrkraft.</p><ul class="benno-rules"><li>🥽 Schutzbrille aufsetzen und Kittel schließen.</li><li>💇 Lange Haare zusammenbinden.</li><li>🚫 Nicht essen, trinken oder Chemikalien berühren.</li><li>🔥 Brenner nie allein lassen; nur mit Erlaubnis bedienen.</li><li>🎒 Taschen aus den Laufwegen räumen.</li><li>🧪 Verschüttetes nicht selbst anfassen, sondern melden.</li></ul></div></div>`);
      const hair=scene.querySelector('svg path[d="M380 45q22 10 11 36"]');
      if(hair)hair.setAttribute('d','M380 45q-9-10-24-3');
    }
    const columns=safety.querySelector('.columns');
    if(columns)columns.insertAdjacentHTML('afterend',`<section class="panel safety-quiz" aria-labelledby="safetyQuizTitle"><h3 id="safetyQuizTitle">🎯 Benno fragt nach: Laborregeln üben</h3><p id="safetyQuizStep" aria-live="polite"></p><p id="safetyQuizQuestion"></p><div class="quiz-answers" id="safetyQuizAnswers"></div><div class="feedback" id="safetyQuizFeedback" role="status" aria-live="polite">Wähle die sicherste Handlung.</div><div class="btn-row"><button class="btn" id="safetyQuizRestart" type="button">Quiz neu starten</button></div></section>`);
    const questions=[
      {q:'Du bemerkst kurz vor dem Versuch, dass deine Schutzbrille fehlt. Was tust du?',a:['Brille holen und erst danach beginnen.','Schnell anfangen und besonders vorsichtig sein.','Nur bei gefährlichen Stoffen eine Brille nehmen.'],c:0,e:'Die Schutzbrille gehört vor dem Start zur persönlichen Schutzausrüstung.'},
      {q:'Lange Haare hängen beim Arbeiten offen nach vorn. Was ist richtig?',a:['Haare zusammenbinden, bevor du weiterarbeitest.','Haare mit der Hand aus dem Weg halten.','Nur den Kopf weiter vom Brenner wegdrehen.'],c:0,e:'Zusammengebundene Haare können nicht so leicht in Flamme oder Chemikalien geraten.'},
      {q:'Auf dem Labortisch liegt ein Snack. Wie handelt die Gruppe?',a:['Essen erst nach dem Unterricht am richtigen Ort.','Essen, wenn gerade niemand experimentiert.','Den Snack neben die Geräte legen.'],c:0,e:'Im Labor wird nicht gegessen oder getrunken, damit keine Chemikalien aufgenommen werden.'},
      {q:'Ein Gasbrenner brennt, aber niemand beaufsichtigt ihn. Was machst du?',a:['Die Lehrkraft sofort informieren und Abstand halten.','Den Brenner in die Hand nehmen.','Einfach weiterarbeiten.'],c:0,e:'Ein Brenner darf nie unbeaufsichtigt sein. Die Lehrkraft übernimmt die sichere Reaktion.'},
      {q:'Eine Schultasche steht mitten im Laufweg. Was ist die beste Lösung?',a:['Sie an den vorgesehenen sicheren Platz stellen.','Sie unter den Labortisch schieben.','Sie dort lassen und darübersteigen.'],c:0,e:'Freie Laufwege helfen, Stolpern und das Umstoßen von Geräten zu verhindern.'},
      {q:'Eine Flüssigkeit ist auf dem Tisch verschüttet worden. Was tust du?',a:['Nicht berühren und sofort die Lehrkraft informieren.','Mit bloßen Händen wegwischen.','Mit Papier abdecken und weiterarbeiten.'],c:0,e:'Stoff und Gefahr sind zunächst unbekannt. Die Lehrkraft sagt, wie der Bereich gesichert und gereinigt wird.'}
    ];
    let quizIndex=0,quizScore=0,quizLocked=false;
    const renderQuiz=()=>{
      if(quizIndex>=questions.length){
        $('safetyQuizStep').textContent=`Abgeschlossen: ${quizScore} von ${questions.length} richtig.`;
        $('safetyQuizQuestion').textContent='Gut geübt! Benno erinnert: Im Zweifel stoppen und die Lehrkraft fragen.';
        $('safetyQuizAnswers').replaceChildren();
        $('safetyQuizFeedback').textContent='Du hast alle sechs Gefahren aus der Zeichnung noch einmal bearbeitet.';
        return;
      }
      const item=questions[quizIndex];
      $('safetyQuizStep').textContent=`Frage ${quizIndex+1} von ${questions.length} · ${quizScore} richtig`;
      $('safetyQuizQuestion').textContent=item.q;
      $('safetyQuizFeedback').textContent='Wähle die sicherste Handlung.';
      quizLocked=false;
      const answers=$('safetyQuizAnswers');
      answers.replaceChildren(...item.a.map((answer,index)=>{
        const button=document.createElement('button');
        button.type='button';button.className='answer';button.textContent=answer;
        button.addEventListener('click',()=>{
          if(quizLocked)return;
          quizLocked=true;
          const correct=index===item.c;
          if(correct)quizScore++;
          button.classList.add(correct?'correct':'wrong');
          $('safetyQuizFeedback').textContent=(correct?'Richtig. ':'Noch nicht. ')+item.e;
          const next=document.createElement('button');
          next.type='button';next.className='btn primary';next.textContent=quizIndex===questions.length-1?'Ergebnis ansehen':'Nächste Frage →';
          next.addEventListener('click',()=>{quizIndex++;renderQuiz()},{once:true});
          answers.appendChild(next);
        });
        return button;
      }));
    };
    renderQuiz();
    $('safetyQuizRestart').addEventListener('click',()=>{quizIndex=0;quizScore=0;renderQuiz()});
  }

  const solubility=$('page-solubility');
  if(solubility){
    const result=$('solResult');
    if(result){
      result.insertAdjacentHTML('afterend',`<div class="benno-explanation" id="bennoSolubility" role="status">${benno}<div><b>Benno erklärt:</b> Wähle Salz oder Zucker und beobachte, was auf Teilchenebene passiert.</div></div>`);
      const explanation=$('bennoSolubility');
      explanation.style.display='grid';explanation.style.gridTemplateColumns='58px 1fr';explanation.style.gap='10px';explanation.style.alignItems='center';
      const explain=()=>{
        const selected=document.querySelector('input[name="solute"]:checked');
        const label=selected&&selected.value==='salt'?'Salz':'Zucker';
        const total=parseFloat(($('solTotal')&&$('solTotal').textContent||'0').replace(',','.'))||0;
        const dissolved=parseFloat(($('solDissolved')&&$('solDissolved').textContent||'0').replace(',','.'))||0;
        let reason=label==='Salz'
          ?'Wasserteilchen ziehen die geladenen Natrium- und Chlorid-Ionen aus dem Salzkristall und umgeben sie. Die Ionen verteilen sich zwischen den Wasserteilchen.'
          :'Wasserteilchen können mit den polaren Zuckermolekülen wechselwirken und sie umgeben. Der Zucker verschwindet nicht, sondern verteilt sich als Moleküle im Wasser.';
        if(total>dissolved)reason+=' Die Modell-Löslichkeitsgrenze ist erreicht: Ein Teil bleibt als Bodensatz sichtbar.';
        else if(total>0)reason+=' In diesem Modell ist die zugegebene Menge noch gelöst.';
        explanation.lastElementChild.innerHTML=`<b>Benno erklärt ${label}:</b> ${reason} Temperatur und Stoffmenge beeinflussen den Vergleich.`;
      };
      ['solAdd10','solAdd25','solReset'].forEach(id=>$(id)&&$(id).addEventListener('click',explain));
      document.querySelectorAll('input[name="solute"]').forEach(input=>input.addEventListener('change',explain));
      explain();
    }
  }

  const burnerCard=document.querySelector('.virtual-burner');
  if(burnerCard){
    const svg=burnerCard.querySelector('.virtual-burner-svg');
    if(svg){
      svg.setAttribute('aria-label','Virtuelles Modell mit den markierten Teilen Brennerrohr, Luftregler, Gasschlauch, Brennerfuß und Gasregler');
      svg.insertAdjacentHTML('beforeend',`<path id="virtualSupplyHose" d="M285 190 C267 181 266 157 239 151"/><rect id="virtualGasSource" x="265" y="177" width="25" height="21" rx="4"/><text x="277" y="191" font-size="8" font-weight="800" text-anchor="middle" fill="#684b1e">GAS</text><circle class="virtual-valve" cx="246" cy="151" r="7"/><path d="M246 144V137" stroke="#8d3e32" stroke-width="3"/><circle class="part-dot" cx="148" cy="91" r="9"/><text class="part-number" x="148" y="91">1</text><circle class="part-dot" cx="149" cy="145" r="9"/><text class="part-number" x="149" y="145">2</text><circle class="part-dot" cx="257" cy="161" r="9"/><text class="part-number" x="257" y="161">3</text><circle class="part-dot" cx="148" cy="177" r="9"/><text class="part-number" x="148" y="177">4</text><circle class="part-dot" cx="246" cy="127" r="9"/><text class="part-number" x="246" y="127">5</text>`);
    }
    burnerCard.insertAdjacentHTML('beforeend',`<div class="burner-parts"><h4>🔎 Brennerteile erkennen</h4><details><summary>Beschriftung ansehen</summary><ol><li><b>Brennerrohr</b> – hier strömt das Gas-Luft-Gemisch nach oben.</li><li><b>Luftregler</b> – verändert im Modell die Luftzufuhr.</li><li><b>Gasschlauch und Anschluss</b> – verbinden im Lernmodell den Brenner mit der Gasquelle.</li><li><b>Brennerfuß</b> – sorgt für einen sicheren Stand.</li><li><b>Gasregler</b> – das Ausschalten im Lernmodell schließt die Gaszufuhr.</li></ol></details><div class="panel"><b id="burnerPartsQuestion">Teil 1 von 5: Welches Bauteil ist mit Nummer 1 markiert?</b><div class="parts-quiz" id="burnerPartsAnswers"></div><div class="feedback" id="burnerPartsFeedback" role="status" aria-live="polite">Wähle den passenden Namen.</div><button class="btn" id="burnerPartsRestart" type="button">Quiz neu starten</button></div></div>`);
    const parts=['Brennerrohr','Luftregler','Gasschlauch und Anschluss','Brennerfuß','Gasregler'];
    let partIndex=0,partScore=0,partLocked=false;
    const renderParts=()=>{
      $('burnerPartsQuestion').textContent=partIndex>=parts.length?`Abgeschlossen: ${partScore} von ${parts.length} richtig.`:`Teil ${partIndex+1} von ${parts.length}: Welches Bauteil ist mit Nummer ${partIndex+1} markiert?`;
      $('burnerPartsFeedback').textContent=partIndex>=parts.length?'Alle fünf Teile sind jetzt zugeordnet.':'Wähle den passenden Namen.';
      const answers=$('burnerPartsAnswers');answers.replaceChildren();
      partLocked=false;
      if(partIndex>=parts.length)return;
      parts.forEach((part,index)=>{
        const button=document.createElement('button');button.type='button';button.className='answer';button.textContent=part;
        button.addEventListener('click',()=>{
          if(partLocked)return;partLocked=true;
          const correct=index===partIndex;if(correct)partScore++;
          button.classList.add(correct?'correct':'wrong');
          $('burnerPartsFeedback').textContent=correct?`Richtig: Nummer ${partIndex+1} zeigt ${parts[partIndex]}.`:`Noch nicht. Nummer ${partIndex+1} zeigt ${parts[partIndex]}.`;
          const next=document.createElement('button');next.type='button';next.className='btn primary';next.textContent=partIndex===parts.length-1?'Ergebnis ansehen':'Weiter →';
          next.addEventListener('click',()=>{partIndex++;renderParts()},{once:true});answers.appendChild(next);
        });
        answers.appendChild(button);
      });
    };
    renderParts();
    $('burnerPartsRestart').addEventListener('click',()=>{partIndex=0;partScore=0;renderParts()});
    if($('virtualOff'))$('virtualOff').textContent='4 · Gas schließen & ausschalten';
    const connect=$('virtualConnect');
    if(connect)connect.addEventListener('click',()=>{const hose=$('virtualSupplyHose');if(hose)hose.setAttribute('d','M285 190 C267 181 266 157 224 147')});
  }

  const heating=$('page-heating');
  if(heating){
    const heading=heating.querySelector('#boilCompare')||heating.querySelector('.page-head');
    if(heading)heading.insertAdjacentHTML('afterend',`<div class="panel heat-selector"><label for="heatSubstance"><b>Stoff für die virtuelle Modellkurve:</b></label> <select id="heatSubstance"><option value="water">Wasser</option><option value="ethanol">Ethanol</option></select><p class="muted" id="heatSafetyNote">Die Kurve ist eine Simulation. Ethanol ist leicht entzündlich und wird nicht praktisch erhitzt.</p></div>`);
    const selector=$('heatSubstance');
    const chartTitle=heating.querySelector('.sim-layout .panel h3');
    const rule=heating.querySelector('.sim-layout ~ .notebox')||heating.querySelector('.notebox:not(.alert)');
    const questionButtons=heating.querySelectorAll('#heatQuestion button');
    questionButtons.forEach(button=>button.textContent=button.dataset.heatanswer==='1'?'Nein. Auch unterhalb der Siedetemperatur verdunstet Flüssigkeit an ihrer Oberfläche.':'Ja. Eine Flüssigkeit verdunstet erst beim Sieden.');
    const updateCurve=()=>{
      const ethanol=selector&&selector.value==='ethanol';
      const substance=ethanol?'Ethanol':'Wasser';
      const boiling=ethanol?78.3:100;
      if(chartTitle)chartTitle.textContent=`📈 Heizkurve von ${substance}`;
      const safetyNote=$('heatSafetyNote');
      if(safetyNote)safetyNote.textContent=ethanol?'Nur ein virtuelles Vergleichsmodell: Ethanol siedet bei Normaldruck bei ungefähr 78,3 °C und ist leicht entzündlich. Nicht praktisch erhitzen.':'Virtuelles Modell bei normalem Luftdruck; reines Wasser siedet bei ungefähr 100 °C.';
      if(rule)rule.innerHTML=ethanol?'<strong>Merksatz</strong>Ethanol siedet bei normalem Luftdruck bei etwa <b>78,3 °C</b>. Während des Siedens bleibt die Temperatur im Modell ungefähr konstant. Ethanol verdunstet auch unterhalb dieser Temperatur und ist leicht entzündlich.':'<strong>Merksatz</strong>Wasser <b>verdunstet</b> bereits unter 100 °C an seiner Oberfläche. Beim <b>Sieden</b> bilden sich im Wasser Dampfblasen. Reines Wasser siedet bei normalem Luftdruck (ca. 1013 hPa) bei etwa <b>100 °C</b>. Während des Siedens bleibt die Temperatur bei gleichbleibendem Druck trotz Wärmezufuhr ungefähr konstant.';
      const timeText=$('heatTime')&&$('heatTime').textContent||'0';
      const seconds=parseFloat((timeText.match(/[\d,.]+/)||['0'])[0].replace(',','.'))||0;
      const step=Math.min(20,Math.floor(seconds/30));
      const value=20+(boiling-20)*(Math.min(step,12)/12);
      const temperature=step>=12?boiling:value;
      const display=ethanol?temperature.toFixed(1):String(Math.round(temperature));
      const x=v=>75+(v/600)*532;
      const y=v=>314-(v/120)*257;
      let path='';
      for(let i=0;i<=step;i++){
        const point=20+(boiling-20)*(Math.min(i,12)/12);
        path+=(i?'L':'M')+x(i*30)+' '+y(i>=12?boiling:point)+' ';
      }
      const plot=$('heatPlot'),marker=$('heatMarker');
      if(plot)plot.setAttribute('d',path);
      if(marker){marker.setAttribute('cx',x(seconds));marker.setAttribute('cy',y(temperature))}
      if($('heatTemp'))$('heatTemp').textContent=`Temperatur: ${display} °C`;
      if($('heatValue'))$('heatValue').textContent=`${display} °C`;
      if($('thermoFluid'))$('thermoFluid').style.height=(8+temperature*.76)+'%';
      if($('heatState'))$('heatState').textContent=temperature>=boiling?'siedend':'flüssig';
      if($('heatBeaker')){
        $('heatBeaker').classList.toggle('boiling',temperature>=boiling);
        $('heatBeaker').classList.toggle('evaporating',temperature>20);
      }
      if($('heatExplain')){
        $('heatExplain').textContent=temperature>=boiling?`${substance} siedet im Modell bei ungefähr ${display} °C. Weitere Energie führt zum Verdampfen; die Temperatur bleibt im Siedebereich ungefähr konstant.`:`${substance} ist flüssig und kann schon unterhalb des Siedepunkts an der Oberfläche verdunsten. Der Siedepunkt im Modell liegt bei ungefähr ${boiling} °C.`;
      }
    };
    if(selector){
      selector.addEventListener('change',()=>{
        const reset=$('heatReset');if(reset)reset.click();
        window.setTimeout(updateCurve,0);
      });
      const timeLabel=$('heatTime');
      if(timeLabel)new MutationObserver(updateCurve).observe(timeLabel,{childList:true,subtree:true,characterData:true});
      updateCurve();
    }
  }

  const moveFlameTitle=()=>{
    document.querySelectorAll('.c6-illustration svg[aria-label="Schematisches virtuelles Gasbrenner-Flammenmodell"]').forEach(svg=>{
      if(!svg||svg.dataset.labelMoved==='true')return;
      const label=svg.querySelector('text');
      if(!label)return;
      const title=label.textContent.trim();
      label.remove();
      svg.dataset.labelMoved='true';
      const container=svg.closest('.c6-illustration');
      if(!container)return;
      let heading=container.querySelector('.c6-flame-heading');
      if(!heading){heading=document.createElement('div');heading.className='c6-flame-heading';container.insertBefore(heading,svg)}
      heading.textContent=title;
    });
  };
  moveFlameTitle();
  new MutationObserver(moveFlameTitle).observe(document.body,{childList:true,subtree:true});
})();

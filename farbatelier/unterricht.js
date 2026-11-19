'use strict';

function unterricht(){
  const section=new URLSearchParams(location.hash.split('?')[1]||'').get('teil');
  const page=document.createElement('article');
  page.className='surface unterricht';
  stage.replaceChildren(page);
  page.innerHTML='<p class="eyebrow">KUNST · KLASSE 5</p><h2>Unterrichtswerkstatt</h2><p>Wie kann dasselbe Orange auffallen oder gedämpft wirken? Vom ersten Bildvergleich bis zur eigenen Gestaltung untersuchen wir die Wirkung von Gegenfarben.</p>';
  function panel(id,title){
    const details=document.createElement('details'),summary=document.createElement('summary');
    summary.textContent=title;details.id='uw-'+id;details.open=section===id||(!section&&id==='stunde');
    details.append(summary);page.append(details);return details;
  }
  function button(label,action){
    const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=action;return b;
  }
  function field(parent,key,label){
    const wrapper=document.createElement('label'),el=document.createElement('textarea');
    el.rows=2;el.maxLength=600;el.value=read('unterricht.'+key)||'';wrapper.textContent=label;
    el.oninput=()=>save('unterricht.'+key,el.value);wrapper.append(el);parent.append(wrapper);return el;
  }
  function printNotes(title,lines){
    document.querySelector('.print-sheet')?.remove();
    const sheet=document.createElement('article');sheet.className='print-sheet';
    sheet.textContent=title+'\n\n'+lines.join('\n\n');document.body.append(sheet);
    window.addEventListener('afterprint',()=>sheet.remove(),{once:true});window.print();
  }
  function foxPicture(bg){
    return '<svg viewBox="0 0 200 124" aria-hidden="true"><rect width="200" height="124" rx="8" fill="'+hex[bg]+'"/><path d="m52 20 33 21q15-5 30 0l33-21-9 54-39 34-39-34z" fill="'+hex[2]+'" stroke="#794226" stroke-width="2"/><path d="m61 74 29 9 10 10 10-10 29-9-39 34z" fill="#fff1dc"/><g fill="#41291e"><circle cx="79" cy="68" r="3"/><circle cx="121" cy="68" r="3"/><path d="m93 91 14 0-7 8z"/></g></svg>';
  }
  function projectPair(trigger){
    const dlg=document.createElement('dialog');dlg.className='uw-project';
    dlg.setAttribute('aria-label','Projektion der beiden Fuchsbilder');
    dlg.innerHTML='<h2>Wo fällt der Fuchs stärker auf?</h2><div class="uw-pair">'+[8,3].map((bg,i)=>'<figure>'+foxPicture(bg)+'<figcaption>Bild '+(i+1)+'<span hidden> · Orange auf '+names[bg]+'</span></figcaption></figure>').join('')+'</div>';
    const controls=document.createElement('div');controls.className='tools';
    const labels=button('Farbnamen zeigen',()=>{
      const show=labels.getAttribute('aria-pressed')==='false';labels.setAttribute('aria-pressed',String(show));
      labels.textContent=show?'Farbnamen ausblenden':'Farbnamen zeigen';dlg.querySelectorAll('figcaption span').forEach(s=>s.hidden=!show);
    });labels.setAttribute('aria-pressed','false');
    controls.append(labels,button('Projektion schließen',()=>dlg.close()));dlg.append(controls);
    dlg.onclose=()=>{dlg.remove();trigger.focus()};document.body.append(dlg);dlg.showModal();
  }

  const timeline=panel('stunde','45 Minuten Unterricht mit Deckfarben');
  timeline.insertAdjacentHTML('beforeend','<p>Material pro Paar: Malkasten mit Rot, Gelb und Blau, zwei Pinsel, Wasser, Mischpalette und ein Blatt mit drei Probefeldern. Für den Einstieg genügt ein Gerät für die Klasse.</p>');
  const phases=[
    ['5 Min.','Bildgespräch','Zwei Füchse betrachten. Was hat sich verändert, obwohl das Fell gleich geblieben ist?','#unterricht?teil=projektion','Bildpaar zeigen'],
    ['10 Min.','Farbkreis untersuchen','Die Kinder suchen zu Orange die Gegenfarbe. Wie lässt sich ihre Position beschreiben?','#kreisstudio','Farbkreis erkunden'],
    ['15 Min.','Mit Deckfarben erproben','Orange anmischen und aufteilen. Bei der ersten Probe bleibt es pur. Für die zweite kommt Blau daneben, für die dritte wenig Blau hinein.','#atelier','Malaufträge öffnen'],
    ['10 Min.','Zu zweit vergleichen','Beide zeigen auf die auffälligste Kante und auf die gedämpfte Mischung. Welche Beobachtung stützt die Erklärung?','#lernpass','Beobachtungen festhalten'],
    ['5 Min.','Einzeln abschließen','Jedes Kind beantwortet die beiden Orange-Fragen mündlich oder schriftlich.','#unterricht?teil=abschluss','Abschlusskarte öffnen']
  ];
  const plan=document.createElement('ol');plan.className='uw-timeline';
  for(const [time,title,prompt,url,link] of phases){
    const li=document.createElement('li');li.innerHTML='<strong>'+time+' · '+title+'</strong><p>'+prompt+'</p><a href="'+url+'">'+link+'</a>';plan.append(li);
  }
  timeline.append(plan,button('Stundenablauf drucken',()=>printNotes('Stundenablauf · Farbwirkung',[
    timeline.querySelector('p').textContent,...phases.map(([t,h,p])=>t+' · '+h+'\n'+p)
  ])));

  const entry=panel('einstieg','Einstieg mit drei kurzen Aufgaben');
  entry.insertAdjacentHTML('beforeend','<p>Bearbeite alle drei Stationen. Du kannst jederzeit eine Entscheidung ändern und noch einmal prüfen.</p><label>1. Zu welcher Farbgruppe gehört Grün?<select id="uw-group"><option value="">Gruppe wählen</option><option>Primärfarbe</option><option>Sekundärfarbe</option><option>Tertiärfarbe</option></select></label><fieldset><legend>2. Zeige auf die Gegenfarbe zu Gelb.</legend><div id="uw-ring" class="uw-ring"></div></fieldset><fieldset><legend>3. Stelle drei Portionen Gelb und eine Portion Rot ein.</legend><label>Anteil Rot<input id="uw-ratio" type="range" min="0" max="100" value="50"></label><output id="uw-percent" for="uw-ratio"></output><div class="tools"><button type="button" id="uw-ratio-ok">Diese Mischung wählen</button></div></fieldset><button id="uw-diagnose">Meine Entscheidungen prüfen</button><ul id="uw-findings" role="status"></ul>');
  let pick=null,ratioChosen=false;
  names.forEach((name,i)=>{
    const b=button(name,()=>{pick=i;entry.querySelectorAll('#uw-ring button').forEach((other,j)=>other.setAttribute('aria-pressed',String(i===j)));by('uw-findings').replaceChildren()});
    b.style.setProperty('--pos',i);b.style.setProperty('--dx',Math.sin(i*Math.PI/6));b.style.setProperty('--dy',-Math.cos(i*Math.PI/6));b.style.setProperty('--paint',hex[i]);b.setAttribute('aria-pressed','false');by('uw-ring').append(b);
  });
  function showRatio(){
    const pct=Number(by('uw-ratio').value);
    by('uw-percent').textContent=(100-pct)+' % Gelb und '+pct+' % Rot'+(ratioChosen?' · gewählt':'');by('uw-findings').replaceChildren();
  }
  by('uw-ratio').oninput=()=>{ratioChosen=true;showRatio()};
  by('uw-ratio-ok').onclick=()=>{ratioChosen=true;showRatio()};
  by('uw-group').onchange=()=>by('uw-findings').replaceChildren();showRatio();
  by('uw-diagnose').onclick=()=>{
    const checks=[
      [by('uw-group').value!=='',by('uw-group').value===group(10),'Farbgruppe','Grün lässt sich aus Gelb und Blau mischen.','Zwei Grundfarben ergeben eine Sekundärfarbe.','#farbgruppen'],
      [pick!==null,pick===opposite(0),'Gegenfarbe','Gelb und Violett liegen sich gegenüber.','Zähle von Gelb aus sechs Felder weiter.','#kreisstudio'],
      [ratioChosen,Number(by('uw-ratio').value)===25,'Menge','Eine von vier gleich großen Portionen ergibt 25 % Rot.','Lege vier Plättchen. Wie viele davon stehen für Rot?','#mischlabor']
    ];
    const result=by('uw-findings');result.replaceChildren();
    for(const [answered,ok,topic,why,hint,url] of checks){
      const li=document.createElement('li');li.textContent=topic+' · '+(!answered?'Hier fehlt noch deine Auswahl.':ok?'Das passt. '+why:hint);
      if(answered&&!ok){const a=document.createElement('a');a.href=url;a.textContent='Hier üben';li.append(' ',a)}result.append(li);
    }
  };

  const fox=panel('fuchs','Ein Fuchsauftrag mit drei Hilfestufen');
  fox.insertAdjacentHTML('beforeend','<p>Gestalte zweimal denselben orangefarbenen Fuchs. In einem Bild soll er auffallen, im anderen soll er sich im Laub verstecken.</p><label>Welche Unterstützung möchtest du?<select id="uw-help"><option value="0">Mit zwei Vorschlägen beginnen</option><option value="1">Selbst Hintergründe finden</option><option value="2">Eine eigene Bildidee entwickeln</option></select></label><div id="uw-fox-help" aria-live="polite"></div><p><a href="#bildaufgabe?motiv=fuchs">Meine beiden Fuchsbilder gestalten</a></p>');
  const helps=[
    '<p>Probiere Blau und Rot-Orange als Hintergründe. Auf welchem kannst du den Umriss leichter erkennen? Tausche die beiden Hintergründe zur Kontrolle.</p><div class="uw-pair">'+[8,3].map((i)=>'<figure>'+foxPicture(i)+'<figcaption>'+names[i]+'</figcaption></figure>').join('')+'</div>',
    '<p>Wähle zuerst einen Nachbarn von Orange im Kreis und dann seine Gegenfarbe. Setze beide hinter denselben Fuchs. Begründe deine Wahl anhand der Kanten.</p>',
    '<p>Entwirf zwei Landschaften auf Papier, etwa Waldlichtung und Abendhimmel. Nutze dieselbe Fellfarbe. Variiere Hintergrund, Helligkeit oder Muster bewusst und erkläre, welche Veränderung am meisten bewirkt hat.</p>'
  ];
  function displayHelp(){by('uw-fox-help').innerHTML=helps[Number(by('uw-help').value)]}
  by('uw-help').onchange=displayHelp;displayHelp();

  const misconception=panel('helligkeit','Kann ein dunkleres Rot bunter wirken?');
  misconception.insertAdjacentHTML('beforeend','<p>Vergleiche beide Proben. Helligkeit beschreibt den Eindruck zwischen hell und dunkel. Buntheit beschreibt, wie farbkräftig oder gedämpft eine Farbe wirkt.</p><div class="uw-pair"><figure><div class="uw-color" style="background:#d4acac"></div><figcaption>A · gedämpftes Rosa</figcaption></figure><figure><div class="uw-color" style="background:#a61224"></div><figcaption>B · kräftiges Dunkelrot</figcaption></figure></div><label>Welche Probe ist heller?<select id="uw-light"><option value="">Bitte wählen</option><option>A</option><option>B</option></select></label><label>Welche Probe wirkt farbkräftiger?<select id="uw-vivid"><option value="">Bitte wählen</option><option>A</option><option>B</option></select></label><button id="uw-compare">Beobachtungen prüfen</button><p id="uw-observation" role="status"></p>');
  by('uw-compare').onclick=()=>{
    const a=by('uw-light').value,b=by('uw-vivid').value;
    by('uw-observation').textContent=!a||!b?'Wähle für beide Eigenschaften eine Probe.':a==='A'&&b==='B'?'Genau. A ist heller. B ist dunkler und wirkt zugleich farbkräftiger.':'Vergleiche erst mit weißem Papier und dann mit einem grauen Feld. A liegt näher am hellen Papier. B zeigt den kräftigeren Rotton. Prüfe deine Auswahl noch einmal.';
  };

  const rubric=panel('raster','Praktische Arbeit einschätzen');
  rubric.insertAdjacentHTML('beforeend','<p>Betrachte eine Gestaltung zusammen mit dem Kind. Halte zu jedem Kriterium fest, was am Bild oder in der Erklärung beobachtbar war.</p>');
  const levels=['Noch nicht beobachtet','Mit Unterstützung gezeigt','Selbstständig gezeigt'];
  const criteria=['Die Gegenfarbe passend zur beabsichtigten Wirkung wählen.','Eine Veränderung planvoll durchführen und die übrigen Bedingungen benennen.','Eine Wirkung an einer konkreten Stelle im eigenen Bild erklären.'];
  const selectors=criteria.map((criterion,i)=>{
    const label=document.createElement('label'),select=document.createElement('select');label.textContent=criterion;const key='unterricht.kriterium.'+i;
    levels.forEach(s=>select.add(new Option(s,s)));select.value=read(key)||levels[0];select.onchange=()=>save(key,select.value);label.append(select);rubric.append(label);return select;
  });
  const evidence=field(rubric,'beleg','Beobachtung zum Bild (ohne Namen)');
  rubric.append(button('Beobachtungsbogen drucken',()=>printNotes('Beobachtungsbogen · Praktische Arbeit',[...criteria.map((c,i)=>c+'\n'+selectors[i].value),'Beobachtung\n'+(evidence.value||'_________________________________')])));

  const transfer=panel('transfer','Transferaufgabe mit einem Rettungsring');
  transfer.insertAdjacentHTML('beforeend','<p>Gestalte ein Plakat für einen orangefarbenen Rettungsring. Er soll schon aus der Entfernung auffallen. Probiere mehrere Hintergründe, entscheide dich für einen und begründe deine Wahl.</p><label>Hintergrund auf dem Plakat<select id="uw-rescue-color">'+options(names,0)+'</select></label><svg id="uw-rescue" class="uw-rescue" viewBox="0 0 400 178" role="img"><rect width="400" height="178"/><circle cx="200" cy="89" r="52" stroke="'+hex[2]+'" stroke-width="28" fill="none"/><circle cx="200" cy="89" r="52" stroke="#fff5de" stroke-width="28" fill="none" stroke-dasharray="18 63.68" transform="rotate(10 200 89)"/></svg>');
  const rescue=by('uw-rescue-color'),savedBg=Number(read('unterricht.rettung')??2);
  rescue.value=String(names[savedBg]?savedBg:2);
  function paintPoster(){
    const i=Number(rescue.value),svg=by('uw-rescue');svg.querySelector('rect').setAttribute('fill',hex[i]);
    svg.setAttribute('aria-label','Orangefarbener Rettungsring mit weißen Bändern vor '+names[i]);save('unterricht.rettung',i);
  }
  rescue.onchange=paintPoster;paintPoster();
  field(transfer,'begruendung','Warum fällt der Ring vor deinem gewählten Hintergrund auf? Beschreibe, was du am Rand des Rings beobachtest.');
  transfer.insertAdjacentHTML('beforeend','<details><summary>Zu zweit überprüfen</summary><p>Zeige das Bild aus ein paar Schritten Entfernung. Wo hat dein Gegenüber zuerst hingesehen? Beschreibe einen Grund und ändere bei Bedarf die Hintergrundfarbe.</p></details>');

  const projection=panel('projektion','Bildpaar oder Farbkreis projizieren');
  projection.insertAdjacentHTML('beforeend','<p>Sammle zunächst Vermutungen in der Klasse. Farbnamen lassen sich im Bildpaar einblenden. Im Kreisstudio kannst du auch die Gegenlinie zuschalten.</p><div class="tools"><a href="#kreisstudio?ansicht=projektion">Farbkreis projizieren</a></div>');
  const trigger=button('Fuchspaar projizieren',()=>projectPair(trigger));projection.querySelector('.tools').append(trigger);

  const exit=panel('abschluss','Abschlusskarte mit zwei Orange-Fragen');
  exit.insertAdjacentHTML('beforeend','<p>Erkläre die beiden Wirkungen in eigenen Worten, schriftlich oder mündlich. Vergleiche anschließend mit den Beispielantworten.</p>');
  const exitPrompts=['Wie lässt du Orange neben einer anderen Farbe auffallen?','Wie kannst du dasselbe Orange beim Mischen trüben?'];
  const exitFields=exitPrompts.map((q,i)=>field(exit,'abschluss.'+i,q));
  exit.insertAdjacentHTML('beforeend','<details><summary>Beispielantworten vergleichen</summary><p>1. Ich male Orange neben seine Gegenfarbe Blau. An der gemeinsamen Kante fällt der Unterschied besonders auf.</p><p>2. Ich mische eine kleine Menge Blau in das Orange und vergleiche mit einer reinen Probe. Meine Mischung wirkt gedämpfter. Der genaue Ton hängt von den Malfarben und den Mengen ab.</p></details>');
  exit.append(button('Meine Abschlusskarte drucken',()=>printNotes('Abschlusskarte · Orange und Blau',exitPrompts.map((q,i)=>q+'\n'+(exitFields[i].value||'_________________________________')))));
  if(section){const selected=Array.from(page.querySelectorAll('details[id]')).find(p=>p.id==='uw-'+section);selected?.scrollIntoView({block:'start'})}
}

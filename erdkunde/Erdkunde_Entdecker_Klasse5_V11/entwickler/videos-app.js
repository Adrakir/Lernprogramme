/* Paul und Gustav Globus: sieben echte MP4-Lernfilme in derselben Erdkunde-App. */
(function () {
  'use strict';
  const films = Object.freeze([
    {n:1,title:'Unsere Erde und ihr Aufbau',time:'0:43',info:'Erdkugel, Erdkruste, Erdmantel und Erdkern.',task:'Welche Erdschicht befindet sich direkt unter unseren Füßen?',topics:['geographie','erde'],lab:['world']},
    {n:2,title:'Äquator, Nord- und Südhalbkugel',time:'1:01',info:'Der Äquator liegt auf 0° geografischer Breite.',task:'Liegt Deutschland nördlich oder südlich des Äquators?',topics:['gradnetz','erde'],lab:['coords','world']},
    {n:3,title:'Nullmeridian, Ost- und Westhalbkugel',time:'0:59',info:'Nullmeridian und 180°-Meridian teilen die Erde in Ost und West.',task:'Durch welchen Ort bei London verläuft der Nullmeridian?',topics:['gradnetz','erde'],lab:['coords','world']},
    {n:4,title:'Die vier Erdviertelkugeln',time:'1:20',info:'Nordost, Nordwest, Südost und Südwest – Norden/Süden zuerst.',task:'In welcher Erdviertelkugel liegt Deutschland?',poster:'Gustav_Globus_Folge4_Vorschau.jpg',topics:['gradnetz','erde','himmelsrichtungen'],lab:['coords','world']},
    {n:5,title:'Seitenansicht und Draufsicht',time:'1:29',info:'Dieselbe Erdkugel aus verschiedenen Blickrichtungen, auch am Haus erklärt.',task:'Wo siehst du den Nordpol, wenn du von oben auf den Nordpol schaust?',poster:'Gustav_Globus_Folge5_Vorschau_compare.jpg',topics:['perspektive','luftbild','projektionen'],lab:['view','projection']},
    {n:6,title:'Das Gradnetz und Koordinaten',time:'2:02',info:'Breitenkreise und gekrümmte Meridiane: erst Breite, dann Länge.',task:'Was liest du zuerst ab: 52° N oder 10° O?',poster:'Gustav_Globus_Folge6_Vorschau_Schnittpunkt.jpg',topics:['gradnetz','atlanten'],lab:['coords','atlas']},
    {n:7,title:'Orte im Atlas finden',time:'2:16',info:'Mit ungefähr 52° N und 10° O die Lage von Hannover finden.',task:'Was machst du nach dem Ablesen von 52° nördlicher Breite?',poster:'Gustav_Globus_Folge7_Vorschau_Schnittpunkt.jpg',topics:['atlanten','gradnetz','kartenlesen'],lab:['atlas','coords']}
  ]);
  const root = document.getElementById('tabs');
  const escapeText = x => String(x).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const onlineBase = 'https://adrakir.github.io/Lernprogramme/erdkunde/Erdkunde_Entdecker_Klasse5_V11/filme/videos/';
  const base = location.protocol === 'file:' ? onlineBase : 'filme/videos/';
  const src = n => base + 'folge-' + n + '.mp4';
  const poster = f => f.poster ? base + f.poster : '';
  let active = 1;
  function cardFilm(f) {
    return '<button type="button" class="gv-film ' + (active === f.n ? 'gv-current' : '') +
      '" data-gv-film="' + f.n + '" aria-pressed="' + (active === f.n) + '">' +
      '<span class="gv-film-number">' + f.n + '</span><span class="gv-film-copy"><strong>' +
      escapeText(f.title) + '</strong><small>Folge ' + f.n + ' · ' + f.time + '</small></span>' +
      '<span class="gv-film-arrow" aria-hidden="true">▶</span></button>';
  }
  function player(f, suffix) {
    return '<video class="gv-player" controls playsinline preload="none" ' +
      (f.poster ? 'poster="' + escapeText(poster(f)) + '" ' : '') +
      'aria-label="Film ' + f.n + ': ' + escapeText(f.title) + '" ' +
      'data-gv-player="' + suffix + '"><source src="' + src(f.n) + '" type="video/mp4">' +
      'Dein Browser unterstützt dieses Video nicht.</video>';
  }
  function fullLibrary() {
    const f=films[active-1];
    return '<section class="gv-library" aria-label="Paul und Gustav Globus – Erdkunde-Videothek">' +
      '<div class="section-head"><div class="eyebrow">🎬 Anschauen, verstehen, selbst ausprobieren</div>' +
      '<h1>Paul und Gustav Globus – Lernvideos</h1><p>Sieben kurze Erdkunde-Filme mit Paul, Lehrer Welt und Gustav Globus. ' +
      'Wähle eine Folge, starte sie selbst und beantworte anschließend die Forscherfrage.</p></div>' +
      '<div class="gv-layout"><nav class="gv-list" aria-label="Folge auswählen">' +
      films.map(cardFilm).join('') + '</nav>' +
      '<section class="gv-stage card" aria-live="polite">' +
      '<div class="gv-stage-heading"><span class="pill">Folge ' + f.n + ' von 7</span><span class="gv-time">' + f.time + '</span></div>' +
      '<h2>' + escapeText(f.title) + '</h2><p>' + escapeText(f.info) + '</p>' +
      player(f, 'main') +
      '<div class="gv-observe"><strong>🔎 Pauls Forscherfrage</strong><p>' + escapeText(f.task) + '</p>' +
      '<p class="gv-help">Film bei Bedarf anhalten und die Antwort in eigenen Worten erklären.</p></div>' +
      '<div class="gv-actions"><a class="btn ghost small" href="' + src(f.n) +
      '" download>MP4 herunterladen</a>' +
      (active > 1 ? '<button type="button" class="btn ghost small" data-gv-film="' + (active-1) + '">← Vorherige</button>' : '') +
      (active < 7 ? '<button type="button" class="btn alt small" data-gv-film="' + (active+1) + '">Nächste Folge →</button>' : '') +
      '</div></section></div>' +
      '<div class="gv-notice">Die Videodateien werden bei Bedarf aus GitHub Pages geladen und benötigen Internet. ' +
      'Die Übungen der App funktionieren weiterhin unabhängig davon. Deine bisherigen Lernstände bleiben unverändert.</div>' +
      '</section>';
  }
  const firstForTopic = Object.freeze({
    geographie:1, erde:2, gradnetz:6, atlanten:7, kartenlesen:7,
    perspektive:5, luftbild:5, projektionen:5, himmelsrichtungen:4
  });
  const firstForLab = Object.freeze({coords:6, atlas:7, view:5, projection:5, world:2});
  function inlinePanel(f) {
    return '<section class="gv-suggestion card" aria-label="Passender Erklärfilm">' +
      '<div class="gv-suggestion-top"><div><div class="eyebrow">🎬 Jetzt im passenden Thema</div>' +
      '<h2>Gustav erklärt: ' + escapeText(f.title) + '</h2>' +
      '<p>' + escapeText(f.info) + '</p></div><span class="pill">Film ' + f.n + ' · ' + f.time + '</span></div>' +
      '<details class="gv-expand"><summary>▶ Film hier ansehen</summary>' +
      player(f,'inline') +
      '<p class="gv-help">🔎 Achte auf diese Frage: ' + escapeText(f.task) + '</p></details>' +
      '<div class="gv-actions"><button type="button" class="btn ghost small" data-gv-open="' + f.n + '">' +
      'Zu allen sieben Lernvideos</button></div></section>';
  }
  function starterPanel() {
    return '<section class="gv-starter card"><div class="gv-starter-copy">' +
      '<div class="eyebrow">🎬 Neu: Paul und Gustav Globus</div><h2>Erdkunde sehen und verstehen</h2>' +
      '<p>Sieben kurze Filme zur Erde, zu Erdhalbkugeln, Erdviertelkugeln, Draufsicht, Gradnetz und Atlas. ' +
      'Wähle einen Film und schau ihn direkt in der App an.</p>' +
      '<button type="button" class="btn alt" data-gv-open="1">🎬 Lernvideos starten</button></div>' +
      '<div class="gv-starter-emoji" aria-hidden="true">🌍</div></section>';
  }
  function renderIntoExistingPage() {
    if (state.tab === 'start' && state.view === 'home') {
      const hero=MAIN.querySelector('.flash > .hero');
      if(hero)hero.insertAdjacentHTML('afterend',starterPanel());
      return;
    }
    if(state.view === 'quiz' || state.printSet !== null) return;
    let num = null;
    if (state.view === 'lesson' || state.view === 'guide') num=firstForTopic[state.topic];
    else if (state.tab === 'lab') num=firstForLab[state.lab];
    if (!num) return;
    const host=MAIN.querySelector('.flash');
    if(!host) return;
    const heading=host.querySelector('.section-head, .hero');
    if(heading)heading.insertAdjacentHTML('afterend',inlinePanel(films[num-1]));
    else host.insertAdjacentHTML('afterbegin',inlinePanel(films[num-1]));
  }
  if(root && !root.querySelector('[data-tab="videos"]')) {
    const el=document.createElement('button');
    el.type='button';el.dataset.tab='videos';el.textContent='🎬 Lernvideos';
    const after=root.querySelector('[data-tab="learn"]');
    if(after)after.insertAdjacentElement('afterend',el);else root.appendChild(el);
  }
  const previousRender=render;
  render=function(){
    if(state.tab==='videos' && state.view==='home') {
      updateStars();
      document.documentElement.dataset.theme=progress.theme;
      document.documentElement.dataset.contrast=progress.contrast;
      document.documentElement.style.setProperty('--fontScale',String(progress.font));
      document.querySelectorAll('#tabs button').forEach(b=>{
        const selected=b.dataset.tab==='videos';
        b.classList.toggle('active',selected);
        b.setAttribute('aria-current',selected?'page':'false');
      });
      MAIN.innerHTML='<div class="flash">' + fullLibrary() + '</div>';
      return;
    }
    previousRender();
    renderIntoExistingPage();
  };
  // Die App wertet nur data-action aus: eigene Filmaktionen kollidieren nicht mit Übungen.
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-gv-film], [data-gv-open]');
    if(!button)return;
    const n=Number(button.dataset.gvFilm||button.dataset.gvOpen);
    if(!Number.isInteger(n)||n<1||n>films.length)return;
    event.preventDefault();
    active=n;
    if(button.hasAttribute('data-gv-open')) {
      switchTab('videos');
    } else if(state.tab==='videos') {
      render();
      MAIN.querySelector('.gv-stage')?.scrollIntoView({behavior:'auto',block:'nearest'});
    }
  });
  window.ErdkundeVideos=Object.freeze({
    count:films.length,
    films:films.map(f=>Object.freeze({number:f.n,title:f.title,src:src(f.n),topics:f.topics.slice()})),
    open(n=1){if(!Number.isInteger(n)||n<1||n>7)return;active=n;switchTab('videos');}
  });
  // Für Atlas-Comic oder weitere Lernstationen öffentliches Modul verwenden:
  // window.ErdkundeVideos.open(7)
  render();
})();

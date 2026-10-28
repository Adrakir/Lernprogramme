'use strict';

function renderDocuments(){
 $('#main').innerHTML=`<div class="eyebrow">Minka & Fuji begleiten dich</div>
 <h1>Lernheft & Aufgabenheft</h1>
 <p class="documentIntro">Erst nachlesen und verstehen, dann mit dem Aufgabenheft üben. Beide Hefte sind fachlich und grafisch überarbeitet (27.10.2026) und erklären Notenwerte, Pausen, Rhythmus, Takte, Taktstriche und punktierte Noten.</p>
 <button id="documentsContents" class="primary">Inhaltsverzeichnis · Themen und Seiten finden</button>
 <div class="documentGrid">
  <article class="card documentCard" aria-labelledby="lernheftTitle">
   <img src="images/lernheft-musik-cover.webp" width="460" height="651" alt="Titelbild des Lernhefts mit Minka und Fuji">
   <div class="documentBody"><span class="pill">PDF · 42 Seiten</span><h2 id="lernheftTitle">Das Lernheft</h2>
   <p>34 Themen zum Verstehen und Nachlesen: ausführliche Erklärungen, beschriftete Notenbilder, Merksätze und vollständig erklärte Beispiele.</p>
   <p class="legend">Ein reines Lernheft ohne Aufgaben zum Ausfüllen.</p>
   <div class="documentActions"><a class="documentLink primary" href="documents/lernheft-musik.pdf?v=20261027-hefte32" target="_blank" rel="noopener" aria-label="Lernheft als PDF in einem neuen Tab öffnen">Lernheft öffnen</a><a class="documentLink" href="documents/lernheft-musik.pdf?v=20261027-hefte32" download="Minka_und_Fuji_Musik_Lernheft.pdf">PDF herunterladen</a><button id="learnContents">Inhaltsverzeichnis des Lernhefts</button></div></div>
  </article>
  <article class="card documentCard" aria-labelledby="arbeitsheftTitle">
   <img src="images/arbeitsheft-musik-cover.webp" width="460" height="651" alt="Titelbild des Lerncomics und Aufgabenhefts mit Fuji und Minka">
   <div class="documentBody"><span class="pill">PDF · 71 Seiten</span><h2 id="arbeitsheftTitle">Das Aufgabenheft</h2>
   <p>Der überarbeitete Lerncomic mit 27 Lernschritten und 81 Aufgaben: vorgemachte Beispiele, Übungen in verschiedenen Schwierigkeitsstufen, Tipps und begründete Lösungen.</p>
   <p class="legend">Zum Ausdrucken und Bearbeiten auf Papier.</p>
   <div class="documentActions"><a class="documentLink primary" href="documents/arbeitsheft-musik.pdf?v=20261027-hefte32" target="_blank" rel="noopener" aria-label="Aufgabenheft als PDF in einem neuen Tab öffnen">Aufgabenheft öffnen</a><a class="documentLink" href="documents/arbeitsheft-musik.pdf?v=20261027-hefte32" download="Fuji_und_Minka_Musik_Aufgabenheft.pdf">PDF herunterladen</a><button id="workContents">Inhaltsverzeichnis des Aufgabenhefts</button></div></div>
  </article>
 </div>
 <section class="card documentGuide spaced"><h2>So passen die Hefte zur App</h2><p><strong>1. Verstehen:</strong> Lies im Lernheft die Erklärung und das fertige Beispiel.</p><p><strong>2. Hören:</strong> Nutze den Lernweg der App, um den Rhythmus anzuhören und mitzuzählen.</p><p><strong>3. Festigen:</strong> Bearbeite die passenden Aufgaben im Aufgabenheft. Lies danach die Lösung mit ihrer Begründung.</p><p class="legend">Die PDFs enthalten keine Tonwiedergabe. Klänge und Animationen findest du in der App. Nach dem Herunterladen kannst du beide Hefte auch ohne Internet lesen.</p><button id="documentsLearn" class="primary">Zum Lernweg der App</button></section>`;
 on('documentsLearn',()=>setView('learn'));
 on('documentsContents',()=>showContents());on('learnContents',()=>showContents('learn'));on('workContents',()=>showContents('work'));
}

registerView('documents',()=>renderDocuments());
const homeBeforeDocuments=renderHome;
renderHome=function(){
 homeBeforeDocuments();
 const entry=document.createElement('section');entry.className='card documentWelcome';
 entry.innerHTML='<div><h2>Deine Hefte mit Minka & Fuji</h2><p>Lernheft zum Nachlesen · Aufgabenheft mit Übungen und Lösungen</p></div><div class="documentHomeActions"><button id="homeDocuments" class="primary">Lernheft & Aufgabenheft öffnen</button><button id="homeContents">Inhaltsverzeichnis</button></div>';
 $('#main').prepend(entry);on('homeDocuments',()=>setView('documents'));on('homeContents',()=>showContents());
};
setView(location.hash==='#hefte'?'documents':view);

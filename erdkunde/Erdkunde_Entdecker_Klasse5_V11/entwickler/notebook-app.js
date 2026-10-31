/* Google NotebookLM als externe Erdkunde-Ressource, ohne Inhalte vorzutäuschen. */
(function () {
  'use strict';
  const notebookUrl = 'https://notebook.google.com/notebook/cc98ffba-22b1-4d1b-9326-0c17a86323c0';
  function resourceCard(compact) {
    return '<section class="card erd-notebook" aria-labelledby="erd-notebook-title">' +
      '<div class="erd-notebook-icon" aria-hidden="true">📓</div>' +
      '<div class="erd-notebook-main"><div class="eyebrow">Erdkunde · zusätzliches Material</div>' +
      '<h2 id="erd-notebook-title">Erdkunde-Notebook (Google NotebookLM)</h2>' +
      '<p>Öffne das zu Erdkunde gehörende Notebook in einem neuen Browser-Tab.' +
      (compact ? '' : ' Nutze es ergänzend zu den Lernpfaden, Videos und Übungen dieser App.') + '</p>' +
      '<p class="erd-notebook-note">Hinweis: Das Notebook liegt bei Google. Zum Lesen kann eine Google-Anmeldung oder eine Freigabe nötig sein. Der Link benötigt Internet.</p>' +
      '<a class="btn alt erd-notebook-link" href="' + notebookUrl + '" target="_blank" rel="noopener noreferrer" aria-label="Erdkunde-Notebook bei Google NotebookLM in einem neuen Tab öffnen">📓 Notebook öffnen ↗</a>' +
      '</div></section>';
  }
  const oldRender = render;
  render = function () {
    oldRender();
    if (state.view === 'quiz' || state.printSet !== null) return;
    const host = MAIN.querySelector('.flash');
    if (!host) return;
    if (state.tab === 'start' && state.view === 'home') {
      const anchor = host.querySelector('.gv-starter, .explorer-hero, .hero');
      if (anchor) anchor.insertAdjacentHTML('afterend',resourceCard(false));
      else host.insertAdjacentHTML('afterbegin',resourceCard(false));
      return;
    }
    if (state.tab === 'learn' && state.view === 'home') {
      const anchor = host.querySelector('.section-head');
      if (anchor) anchor.insertAdjacentHTML('afterend',resourceCard(true));
      else host.insertAdjacentHTML('afterbegin',resourceCard(true));
      return;
    }
  };
  window.ErdkundeNotebook = Object.freeze({url:notebookUrl});
  render();
})();

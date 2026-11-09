
/* Chemie 8.1: vollständige, visuell erkennbare Navigation, keine alten Funktionen entfernen. */
(() => {
 'use strict';
 const grid=document.getElementById('homeCards'),filters=document.getElementById('chemDirFilters'),status=document.getElementById('chemDirStatus');
 if(!grid||!filters||!status)return;
 const groups=[
  {id:'all',symbol:'🧭',name:'Alle Bereiche'},
  {id:'basics',symbol:'📘',name:'Grundlagen'},
  {id:'experiments',symbol:'🧪',name:'Experimentieren'},
  {id:'games',symbol:'🎮',name:'Spielen'},
  {id:'tests',symbol:'🎓',name:'Üben & Tests'}
 ];
 // Jede seit Version 7.1 bestehende Hauptseite hat hier weiterhin einen Einstieg.
 const areas=[
  ['matter','basics','Stoffe & Körper','Gegenstände und Materialien mit Bildern unterscheiden.','cube'],
  ['devices','basics','Laborgeräte','Geräte erkennen, benennen und in einem Bilderquiz üben.','flask'],
  ['safety','basics','Labor-Sicherheit','Gefahren in einer Zeichnung entdecken und richtig handeln.','shield'],
  ['solubility','basics','Löslichkeit','Salz und Zucker im virtuellen Wasserglas vergleichen.','water'],
  ['thermal','basics','Wärmeleitfähigkeit','Metall, Holz und Kunststoff im Modell vergleichen.','heat'],
  ['heating','basics','Siedetemperatur','Erwärmen, beobachten und Diagramme verstehen.','thermo'],
  ['burner','basics','Der Gasbrenner','Flammenzonen erkennen und die Sicherheit üben.','fire'],
  ['method','basics','Experimente planen','Vermutung, Durchführung, Beobachtung und Ergebnis.','paper'],
  ['missions','experiments','Labor-Missionen','Forschungsfälle Schritt für Schritt lösen.','flask'],
  ['deep','experiments','Forscherlabor','Teilchenkino, Brenner-Modelle und animierte Versuche.','particles'],
  ['v4lab','experiments','Virtuelles Labor','Geräte und Versuchsanordnungen selbst ausprobieren.','flask'],
  ['v5academy','experiments','Forscherwerkstatt','Teilchenmodelle, Warnzeichen und Schreibaufgaben.','scope'],
  ['chem6','experiments','Forschungscampus','Weitere Werkstätten und interaktive Forschungsstationen.','scope'],
  ['v4study','experiments','Lernzentrale','Eigene Lernziele, Wissen und Fortschritt verfolgen.','book'],
  ['v4play','games','Chemie-Spielwelt','Wissen spielerisch anwenden und Rätsel lösen.','puzzle'],
  ['quiz','games','Wissenscheck','Themenquiz mit Erklärungen und Fehlertraining.','trophy'],
  ['learningpath','tests','Geführter Lernpfad','Sieben kurze Lernfolgen mit Beispielen und Hilfen.','path'],
  ['practicehub','tests','Gezielt üben','Aufgaben passend zum aktuellen Lernstand.','target'],
  ['protocoltrainer','tests','Protokoll-Fehlertrainer','Fehler finden, verbessern und selbst formulieren.','paper'],
  ['probearbeit','tests','Probearbeit','Interaktive Probe mit Lückentext und Druck-PDF.','paper'],
  ['finaltest','tests','Abschlusstest','Klassenarbeit mit Auswertung und Nachtraining.','trophy'],
  ['sheet','tests','Lernheft','Wichtige Regeln und Begriffe nachschlagen.','book']
 ];
 const paths={
  cube:'<path d="M48 13 73 27v29L48 71 23 56V27Z" fill="#ffffffbb"/><path d="m23 27 25 15 25-15M48 42v29" fill="none"/><path d="M83 42h27v27H83z" fill="#ffffffa5"/>',
  flask:'<path d="M44 12h33m-8 0v26l26 33c4 6 1 10-7 10H31c-9 0-11-5-7-11l28-32V12m-9 0h33" fill="#ffffffb3"/><path d="M40 58h40M42 66h36" fill="none"/><circle cx="58" cy="70" r="4" fill="#f6b958" stroke="none"/>',
  shield:'<path d="M64 8 99 20v24c0 21-14 34-35 41C43 78 29 65 29 44V20Z" fill="#ffffffbc"/><path d="M64 26v24m0 11v2" fill="none" stroke-width="6"/>',
  water:'<path d="M33 16v52c0 13 10 16 31 16s31-3 31-16V16M33 16h62M37 55h54" fill="#ffffffa5"/><path d="M38 54q15-7 26 0t26 0" fill="none"/><circle cx="50" cy="66" r="3" fill="#f3b957" stroke="none"/><circle cx="77" cy="73" r="3" fill="#f3b957" stroke="none"/>',
  heat:'<path d="M15 66h98M27 22v45m36-45v45m36-45v45" fill="none" stroke-width="8"/><path d="M22 15q-7-7 0-14m41 14q-7-7 0-14m41 14q-7-7 0-14" fill="none"/><path d="M14 80h100" fill="none"/>',
  thermo:'<rect x="51" y="9" width="25" height="67" rx="12" fill="#ffffffa5"/><path d="M63 18v50" fill="none" stroke-width="6"/><circle cx="63" cy="72" r="13" fill="#e78061"/><path d="M81 24h16m-16 15h12m-12 15h16" fill="none"/>',
  fire:'<path d="M58 8c20 20 3 29 20 39 4-11 4-18 0-23 31 25 26 55-6 61-33 5-51-21-34-49 3 15 16 19 20-28Z" fill="#fff4d1"/><path d="M65 46c12 15 7 25-1 29-13-3-15-13 1-29Z" fill="#efa451"/>',
  paper:'<rect x="33" y="10" width="64" height="72" rx="6" fill="#ffffffbd"/><path d="M47 31h35m-35 12h35m-35 12h27M47 67h20" fill="none"/><path d="m20 45 7 7 12-17" fill="none" stroke-width="5"/>',
  particles:'<circle cx="35" cy="22" r="12" fill="#ffffffc0"/><circle cx="77" cy="20" r="10" fill="#f7d28c"/><circle cx="59" cy="62" r="14" fill="#ffffffc0"/><circle cx="101" cy="63" r="11" fill="#f7d28c"/><path d="M45 27 56 53M70 57 93 62M45 20l22-2" fill="none"/>',
  scope:'<circle cx="56" cy="39" r="21" fill="#ffffffbc"/><path d="m72 55 27 25M28 80h71" fill="none" stroke-width="8"/><circle cx="56" cy="39" r="7" fill="#f0b854"/>',
  book:'<path d="M64 19Q45 10 19 21v55q28-11 45 2 18-13 45-2V21Q84 10 64 19Z" fill="#ffffffc0"/><path d="M64 19v59M28 34q14-5 28 0m-28 12q14-5 28 0m17-12q14-5 28 0" fill="none"/>',
  puzzle:'<path d="M34 20h24c-9 15 14 15 9 0h27v25c-15-8-15 15 0 10v25H69c7-17-16-17-11 0H34V55c16 6 16-16 0-10Z" fill="#ffffffbc"/>',
  trophy:'<path d="M42 15h43v25c0 18-11 27-22 27S42 58 42 40Z" fill="#ffffffbe"/><path d="M42 21H26v15q0 16 19 16m40-31h17v15q0 16-19 16M63 67v13m-20 0h41" fill="none"/>',
  path:'<path d="M26 74q36 0 26-31T96 22" fill="none" stroke-width="8" stroke-dasharray="5 9"/><circle cx="27" cy="74" r="9" fill="#fff"/><path d="m88 12 14 10-14 10" fill="none"/>',
  target:'<circle cx="64" cy="44" r="34" fill="#ffffff9e"/><circle cx="64" cy="44" r="22" fill="none"/><circle cx="64" cy="44" r="10" fill="#f0bd71"/><path d="m96 15-32 29m25-37 10 0 0 10" fill="none"/>'
 };
 const icon=k=>'<svg viewBox="0 0 128 90" aria-hidden="true" focusable="false"><circle cx="64" cy="45" r="37" fill="#ffffff45"/><g stroke="var(--chem-illustration-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3">'+(paths[k]||paths.flask)+'</g></svg>';
 const ready=areas.filter(a=>document.getElementById('page-'+a[0]));
 const counts=Object.fromEntries(groups.map(g=>[g.id,g.id==='all'?ready.length:ready.filter(a=>a[1]===g.id).length]));
 let category=matchMedia('(min-width:701px)').matches?'all':'basics';
 filters.innerHTML=groups.map(g=>'<button type="button" class="chem-dir-filter" data-chem-group="'+g.id+'" aria-pressed="false"><span class="chem-filter-emoji" aria-hidden="true">'+g.symbol+'</span><span><strong>'+g.name+'</strong><small>'+counts[g.id]+' Bereiche</small></span></button>').join('');
 function render(){
  for(const b of filters.querySelectorAll('[data-chem-group]'))b.setAttribute('aria-pressed',String(b.dataset.chemGroup===category));
  const list=ready.filter(a=>category==='all'||a[1]===category);
  status.textContent=list.length+' Bereiche · Tippe auf ein Bild, um direkt zu starten.';
  const done=window.ChemistryLearning?.snapshot()?.done||{};
  grid.innerHTML=list.map(a=>'<button type="button" class="chem-card" data-chem-route="'+a[0]+'" data-chem-category="'+a[1]+'" aria-label="'+a[2]+' öffnen"><span class="chem-card-art">'+icon(a[4])+'</span><span class="chem-card-label">'+groups.find(g=>g.id===a[1]).name+'</span><strong class="chem-card-title">'+a[2]+(done[a[0]]?'<span class="chem-card-check" aria-label="Abgeschlossen">✓</span>':'')+'</strong><span class="chem-card-desc">'+a[3]+'</span><span class="chem-card-action">Öffnen →</span></button>').join('');
 }
 filters.addEventListener('click',event=>{
   const b=event.target.closest('[data-chem-group]');if(!b||!filters.contains(b))return;
   category=b.dataset.chemGroup;render();
   grid.querySelector('.chem-card')?.focus({preventScroll:true});
 });
 grid.addEventListener('click',event=>{
   const b=event.target.closest('[data-chem-route]');if(!b||!grid.contains(b))return;
   if(typeof navigate==='function')navigate(b.dataset.chemRoute);
   else document.querySelector('#nav [data-page="'+b.dataset.chemRoute+'"]')?.click();
 });
 document.addEventListener('chemistry:navigate',event=>{
   if(event.detail?.to==='home')render();
 });
 render();
 window.ChemistryDirectory={routes:()=>areas.map(a=>a[0]),count:()=>ready.length};
})();

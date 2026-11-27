'use strict';
// A fixed orientation keeps all diagrams comparable: yellow is at twelve o'clock.
function farbring(stufe, markiert = [], linie = false, antippbar = false) {
 const punkt = (i, r) => [90 + r*Math.sin(i*Math.PI/6), 90 - r*Math.cos(i*Math.PI/6)];
 const teile = names.map((name,i) => {
  const sichtbar = order(i) <= stufe, aktiv = markiert.includes(i);
  const d = 'M '+punkt(i-.5,76)+' A 76 76 0 0 1 '+punkt(i+.5,76)+' L '+punkt(i+.5,46)+' A 46 46 0 0 0 '+punkt(i-.5,46)+' Z';
  return '<path '+(antippbar && sichtbar ? 'data-ton="'+i+'" ' : '')+'d="'+d+'" fill="'+(sichtbar?hex[i]:'#e2dfd5')+'" stroke="#202b40" stroke-width="1"><title>'+(sichtbar?name:'Freies Feld')+'</title></path>'+
    (aktiv?'<circle cx="'+punkt(i,61)[0]+'" cy="'+punkt(i,61)[1]+'" r="5" fill="white" stroke="#202b40" stroke-width="2" pointer-events="none"/>':'');
 }).join('');
 let achse='';
 if(linie){
  const [a,b]=markiert.map(i=>punkt(i,53));
  achse='<path class="farbachse" d="M '+a+' L '+b+'" fill="none" stroke="#202b40" stroke-width="4" pathLength="1"/>';
 }
 const label=markiert.map(i=>names[i]).join(' und ');
 return '<svg viewBox="0 0 180 180" role="img" aria-label="Farbkreis, markiert: '+label+'">'+teile+achse+'</svg>';
}
function duellMotiv(form, [innen,aussen]) {
 const motiv={
  sun:'<circle cx="80" cy="42" r="22"/>',
  leaf:'<path d="M45 65 Q42 19 112 16 Q108 65 45 65Z"/>',
  fish:'<path d="M38 42 Q66 8 104 36 L126 23 V61 L104 48 Q65 77 38 42Z"/>',
  flower:'<path d="M80 31 C50 -4 40 37 62 43 C31 57 64 82 78 56 C82 88 118 68 97 49 C134 48 119 16 94 32 C100 4 73 3 80 31Z"/>'
 }[form];
 return '<svg class="antwortbild" viewBox="0 0 160 84" aria-hidden="true"><rect width="160" height="84" rx="8" fill="'+hex[aussen]+'"/><g fill="'+hex[innen]+'">'+motiv+'</g></svg>';
}

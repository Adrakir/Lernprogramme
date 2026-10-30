'use strict';
/* Bildlupe und manuelle Textmarkierungen: keine automatische Auswertung eigener Texte. */
window.MF_ACADEMY_TOOLS=(()=>{
  const KEY='mf-deutsch-textlupe-v1',root=document.getElementById('studio-app');
  if(!root)return null;
  const esc=t=>String(t||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let saved={};
  try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch{saved={};}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(saved));}catch{}};
  let currentSelection=null;
  const sid=()=>root.querySelector('#studio-picker')?.value||'';
  const fields=()=>[...root.querySelectorAll('[data-studio-part]')];
  const record=()=>{const id=sid();return saved[id]||(saved[id]=[]);};
  const colors={gedanke:'Gedanken',gefuehl:'Gefühle',handlung:'Handlungen',hoehepunkt:'Höhepunkt',rede:'Wörtliche Rede',sinn:'Sinneseindruck'};
  function shade(text,part){
    const annotations=record().filter(a=>a.part===part&&a.end<=text.length&&text.slice(a.start,a.end)===a.quote).sort((a,b)=>a.start-b.start);
    const out=[];let cursor=0;
    for(const a of annotations){if(a.start<cursor)continue;
      out.push(esc(text.slice(cursor,a.start)));out.push('<mark class="ac-mark-'+a.kind+'" title="'+esc(colors[a.kind])+'">'+esc(a.quote)+'</mark>');cursor=a.end;
    }
    out.push(esc(text.slice(cursor)));return out.join('').replace(/\n/g,'<br>');
  }
  function refreshWriterAnnotations(){
    const target=root.querySelector('#ac-writer-mark-preview');if(!target)return;
    const f=fields();target.innerHTML=f.map(x=>'<article><strong>'+({intro:'Einleitung',body:'Hauptteil',end:'Schluss'}[x.dataset.studioPart]||'Text')+'</strong><p>'+ (x.value?shade(x.value,x.dataset.studioPart):'<em>Noch kein Text</em>')+'</p></article>').join('');
    const num=record().length,targetCount=root.querySelector('#ac-writer-mark-count');if(targetCount)targetCount.textContent=num+' Textstellen markiert (manuell, nicht bewertet)';
  }
  function panel(){
    return '<section class="panel ac-textlens"><h3>Deine Textlupe</h3><p>Markiere Wörter oder Sätze in einem deiner drei Schreibfelder. Tippe dann auf die passende Farbe. Unter dem Text erscheint deine markierte Lesefassung. So kannst du sehen, wo Gedanken, Gefühle, Handlungen, Höhepunkte und Dialoge stehen.</p>'+
     '<div class="ac-markbar">'+Object.entries(colors).map(([k,label])=>'<button type="button" data-ac-mark="'+k+'" class="ac-mark-btn ac-mark-'+k+'">'+esc(label)+'</button>').join('')+'</div>'+
     '<p id="ac-writer-mark-message" role="status">Tipp: Erst im Textfeld markieren, dann die passende Farbe wählen. Die Zuordnung überprüfst du selbst.</p>'+
     '<div class="ac-controls"><button type="button" class="secondary" data-ac-clear-marks>Alle Markierungen löschen</button></div>'+
     '<p id="ac-writer-mark-count" class="muted"></p><div id="ac-writer-mark-preview" class="ac-mark-preview"></div></section>';
  }
  function addPanel(view){
    if(view!=='writer')return;
    const block=root.querySelector('.studio-story-writing');if(!block)return;
    const holder=document.createElement('div');holder.innerHTML=panel();block.after(holder);refreshWriterAnnotations();
  }
  function zoom(token){
    const m=/^([a-z0-9-]+):([0-3])$/.exec(token);if(!m)return;
    const id=m[1],i=Number(m[2]),d=window.MF_STUDIO_DATA;
    const task=[...d.stories,...d.exams].find(x=>x.id===id);
    if(!task||!task.panels?.[i])return;
    const piece=task.panels[i];
    let dialog=document.getElementById('ac-art-zoom');
    if(!dialog){dialog=document.createElement('dialog');dialog.id='ac-art-zoom';document.body.appendChild(dialog);}
    dialog.innerHTML='<div class="ac-art-zoom-inner"><button type="button" data-ac-close-zoom class="secondary">Schließen</button><h2>Bild '+(i+1)+': '+esc(piece[1])+'</h2>'+
     window.MF_STUDIO_ART.render(id,i,piece[0])+'<p>'+esc(piece[2])+'</p><p class="muted">Ein Bild zeigt einen Ausschnitt der Situation. Du darfst eine eigene schlüssige Fortsetzung erfinden.</p></div>';
    if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
    dialog.querySelector('[data-ac-close-zoom]').onclick=()=>dialog.close?dialog.close():dialog.removeAttribute('open');
    dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close?.();},{once:true});
  }
  root.addEventListener('select',e=>{
    const t=e.target;if(!t.matches('[data-studio-part]'))return;
    const start=t.selectionStart,end=t.selectionEnd;
    if(start<end&&end-start<1600)currentSelection={id:sid(),part:t.dataset.studioPart,start,end,quote:t.value.slice(start,end)};
  });
  root.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;const ds=b.dataset;
    if(ds.acZoom){zoom(ds.acZoom);return;}
    if(ds.acClearMarks!==undefined){saved[sid()]=[];save();refreshWriterAnnotations();root.querySelector('#ac-writer-mark-message').textContent='Alle Markierungen wurden gelöscht.';return;}
    if(!ds.acMark)return;
    const sel=currentSelection,info=root.querySelector('#ac-writer-mark-message');
    if(!sel||sel.id!==sid()||!sel.quote){if(info)info.textContent='Markiere zuerst einen Satz oder Wörter in deiner Einleitung, deinem Hauptteil oder deinem Schluss.';return;}
    const field=fields().find(x=>x.dataset.studioPart===sel.part);
    if(!field||field.value.slice(sel.start,sel.end)!==sel.quote){if(info)info.textContent='Die markierte Textstelle hat sich verändert. Markiere sie bitte erneut.';return;}
    const list=record(),conflict=list.some(x=>x.part===sel.part&&sel.start<x.end&&sel.end>x.start);
    if(conflict){if(info)info.textContent='Diese Stelle ist bereits markiert. Wähle eine andere Textstelle oder lösche die bisherigen Markierungen.';return;}
    list.push({...sel,kind:ds.acMark});if(list.length>40)list.shift();
    save();refreshWriterAnnotations();if(info)info.textContent='Textstelle markiert als: '+colors[ds.acMark]+'. Prüfe selbst, ob diese Einordnung zur Wirkung passt.';
    currentSelection=null;
  });
  root.addEventListener('input',e=>{
    if(e.target.matches('[data-studio-part]'))queueMicrotask(refreshWriterAnnotations);
  });
  return Object.freeze({afterRender:addPanel,refreshWriterAnnotations});
})();
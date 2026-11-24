'use strict';
function isGuest(){try{return sessionStorage.getItem('farbatelier.mode')==='gast'}catch{return false}}
const unsaved = new Map();
function storageKey(key){
 if(key.startsWith('pass.')&&key!=='pass.archive'){
  const state=stored('recordBook',null);
  if(state?.active&&state.active!=='first')key='draft.'+state.active+'.'+key.slice(5);
 }
 return (isGuest()?'farbatelier.gast.':'farbatelier.')+key}
function read(key){
 const id=storageKey(key);
 if(unsaved.has(id))return unsaved.get(id);
 try{return (isGuest()?sessionStorage:localStorage).getItem(id)}catch{return null}
}
function save(key,value){
 const id=storageKey(key);
 try{(isGuest()?sessionStorage:localStorage).setItem(id,value);unsaved.delete(id)}
 catch{
  unsaved.set(id,String(value));
  if(!by('storageNotice'))document.querySelector('main').insertAdjacentHTML('afterbegin','<p id="storageNotice" role="alert" class="note">Der Browser kann Einträge gerade nur für diese geöffnete Seite behalten. Sichere deinen Versuch vor dem Schließen im <a href="#lernpass">Lernpass als Text</a>.</p>');
 }
}
function stored(key, fallback) {
  try { return JSON.parse(read(key)) ?? fallback; } catch { return fallback; }
}

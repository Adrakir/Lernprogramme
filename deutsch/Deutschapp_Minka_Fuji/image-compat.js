/* Originalillustrationen bleiben WebP; bei älterem Safari erscheint ihr JPEG-Zwilling. */
(function(){
 'use strict';
 var observed=new WeakSet();
 function fallback(img){
  var original=img.getAttribute('src')||'';
  if(img.getAttribute('data-jpeg-attempt')||!/\.webp(?:$|[?#])/i.test(original))return;
  img.setAttribute('data-jpeg-attempt','1');
  img.setAttribute('src',original.replace(/\.webp(?=$|[?#])/i,'.jpg'));
 }
 function bind(img){
  if(observed.has(img))return;
  observed.add(img);
  img.addEventListener('error',function(){fallback(img);});
  if(img.complete&&img.naturalWidth===0)fallback(img);
 }
 function inspect(root){
  if(!root||root.nodeType!==1)return;
  if(root.tagName==='IMG')bind(root);
  var children=root.querySelectorAll('img');
  for(var i=0;i<children.length;i++)bind(children[i]);
 }
 var observer=new MutationObserver(function(records){
  for(var i=0;i<records.length;i++){
   var record=records[i];
   if(record.type==='attributes'){inspect(record.target);continue;}
   for(var j=0;j<record.addedNodes.length;j++)inspect(record.addedNodes[j]);
  }
 });
 observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){inspect(document.documentElement);},{once:true});
 else inspect(document.documentElement);
 window.addEventListener('load',function(){inspect(document.documentElement);},{once:true});
})();

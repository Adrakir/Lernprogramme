/* Offline-Unterstützung der vorhandenen GitHub-Pages-App. Keine Datenübertragung. */
const CACHE='minka-fuji-deutsch-2026-10-30-upgrade-v1';
const CORE=['./','./index.html','./style.css','./app.js?v=lehrgang1','./reading.js','./language.css','./language.js','./course.css?v=1','./course-data.js?v=1','./course.js?v=1','./hauptteil.css?v=20261030','./hauptteil.js?v=20261030','./studio.css?v=2','./studio-data.js?v=2','./studio-art.js?v=2','./academy.css?v=1','./academy-data.js?v=1','./academy.js?v=2','./studio.js?v=5','./upgrade.css?v=1','./upgrade-data.js?v=1','./upgrade.js?v=1','./academy-extra.js?v=1','./academy-tools.js?v=1','./assets/guides.webp','./assets/scene-1.webp','./assets/scene-2.webp','./assets/scene-3.webp','./assets/scene-4.webp','./assets/scene-5.webp','./assets/scene-6.webp','./assets/whale.webp','./assets/whale-integrated.webp','./icon.svg','./manifest.webmanifest'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>Promise.allSettled(CORE.map(url=>cache.add(url)))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(x=>x.startsWith('minka-fuji-deutsch-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET')return;
 const url=new URL(request.url);if(url.origin!==self.location.origin||!url.pathname.startsWith(new URL('./',self.location).pathname))return;
 if(request.mode==='navigate'){
  event.respondWith(fetch(request).then(response=>{
   if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy)).catch(()=>{});}return response;
  }).catch(()=>caches.match('./index.html').then(response=>response||Response.error())));
  return;
 }
 event.respondWith(caches.match(request).then(cached=>{
   if(cached)return cached;
   return fetch(request).then(response=>{
    if(response.ok&&response.type==='basic'){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{});}return response;
   });
 }));
});
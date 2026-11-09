/* Service Worker für Majas Wortwerkstatt.
 * Update-freundlich: HTML immer zuerst aus dem Netz (Fallback Cache),
 * übrige Dateien aus dem Cache mit Nachladen. Keine Lerndaten im Cache –
 * Lernstände bleiben ausschließlich in localStorage. */
'use strict';
const CACHE='majas-wortwerkstatt-v1';
const CORE=[
  './',
  './index.html',
  './mobile-start.css',
  './maja-plus.css',
  './maja-plus.js',
  './comic-kino.js',
  './comic-kino.css',
  './comic-studio.js',
  './comic-studio.css',
  './comic-bubbles.js',
  './comic-bubbles.css',
  './figurenstimmen.js',
  './figurenstimmen.css',
  './baerli-kleiderschrank.js',
  './baerli-kleiderschrank.css',
  './diktat-audio.js',
  './manifest.webmanifest',
  './baerli/baerli.webp',
  './baerli/leseecke.webp',
  './baerli/werkstatt.webp',
  './baerli/kostuemkiste.webp'
];
self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>Promise.allSettled(CORE.map(url=>cache.add(url))))
      .then(()=>self.skipWaiting())
  );
});
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  const isHtml=request.mode==='navigate'||(request.headers.get('accept')||'').includes('text/html');
  if(isHtml){
    // Netz zuerst, damit neue Versionen sofort ankommen; offline aus dem Cache.
    event.respondWith(
      fetch(request)
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{});
          return response;
        })
        .catch(()=>caches.match(request).then(hit=>hit||caches.match('./index.html')))
    );
    return;
  }
  // Statische Dateien: Cache zuerst, sonst Netz und nachträglich speichern.
  event.respondWith(
    caches.match(request).then(hit=>{
      if(hit)return hit;
      return fetch(request).then(response=>{
        if(response.ok&&(response.type==='basic'||response.type==='default')){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{});
        }
        return response;
      });
    })
  );
});

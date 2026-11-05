/* Offline-Unterstützung der vorhandenen GitHub-Pages-App. Keine Datenübertragung. */
const CACHE='minka-fuji-deutsch-2026-11-05-medien-v13';
const CORE=["./","./index.html","./style.css?v=medien1","./app.js?v=medien1","./reading.js","./language.css?v=medien1","./language-practice.js?v=1","./language.js?v=medien1","./course.css?v=medien1","./course-data.js?v=qa48","./course.js?v=medien1","./hauptteil.css?v=20261030","./hauptteil.js?v=qa48","./studio.css?v=3","./studio-data.js?v=2","./studio-art.js?v=2","./academy.css?v=1","./academy-data.js?v=1","./academy.js?v=3","./studio.js?v=lernplakat1","./upgrade.css?v=2","./upgrade-data.js?v=1","./upgrade.js?v=medien1","./academy-extra.js?v=1","./academy-tools.js?v=1","./assets/guides.webp","./assets/scene-1.webp","./assets/scene-2.webp","./assets/scene-3.webp","./assets/scene-4.webp","./assets/scene-5.webp","./assets/scene-6.webp","./assets/whale.webp","./assets/whale-integrated.webp","./icon.svg","./manifest.webmanifest","./image-compat.js?v=2","./assets/guides.jpg","./assets/scene-1.jpg","./assets/scene-2.jpg","./assets/scene-3.jpg","./assets/scene-4.jpg","./assets/scene-5.jpg","./assets/scene-6.jpg","./assets/whale.jpg","./assets/whale-integrated.jpg","./assets/audio/sprechen.mp3","./assets/audio/fluestern.mp3","./assets/audio/rufen.mp3","./assets/audio/woertliche-rede.mp3"];
self.addEventListener('install',event=>{
 // Eine fehlerhafte Bild-, CSS- oder Scriptdatei darf keine scheinbar fertige
 // Offline-Version aktivieren. Der alte Service Worker bleibt dann erhalten.
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  try{
   await Promise.all(CORE.map(url=>cache.add(url)));
   await self.skipWaiting();
  }catch(error){
   await caches.delete(CACHE);
   throw error;
  }
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(x=>x.startsWith('minka-fuji-deutsch-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
async function audioRange(cached,range){
 const data=await cached.arrayBuffer();
 const match=/^bytes=(\d*)-(\d*)$/i.exec(range);
 const start=match?.[1]?Number(match[1]):Math.max(0,data.byteLength-Number(match?.[2]));
 const end=match?.[1]&&match[2]?Math.min(Number(match[2]),data.byteLength-1):data.byteLength-1;
 if(!match||(!match[1]&&!match[2])||start>end||!Number.isSafeInteger(start))return new Response(null,{status:416,headers:{'Content-Range':`bytes */${data.byteLength}`}});
 return new Response(data.slice(start,end+1),{status:206,headers:{'Content-Type':cached.headers.get('Content-Type')||'audio/mpeg','Accept-Ranges':'bytes','Content-Length':String(end-start+1),'Content-Range':`bytes ${start}-${end}/${data.byteLength}`}});
}
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
   if(cached){
    const range=request.headers.get('Range');
    return range&&url.pathname.includes('/assets/audio/')?audioRange(cached,range):cached;
   }
   return fetch(request).then(response=>{
    if(response.ok&&response.type==='basic'){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{});}return response;
   });
 }));
});

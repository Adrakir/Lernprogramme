"use strict";
const cacheName = "majas-sachunterricht-2026-11-19-2";
const appFiles = [
  "./",
  "./index.html",
  "./style.css?v=6",
  "./stoff.js?v=6",
  "./lernen.js?v=6",
  "./app.js?v=6",
  "./assets/baerli.webp",
  "./assets/essen-apfel.webp",
  "./assets/essen-brot.webp",
  "./assets/essen-hafer.webp",
  "./assets/essen-joghurt.webp",
  "./assets/essen-kaese.webp",
  "./assets/essen-linsen.webp",
  "./assets/essen-moehren.webp",
  "./assets/essen-schokolade.webp",
  "./assets/essen-wasser.webp",
  "./assets/maja.webp",
  "./assets/mitternachtsparty.webp",
  "./assets/mondpfuetze.webp",
  "./assets/picknick-detektiv.webp",
  "./assets/picknick-pause.webp",
  "./assets/picknick-start.webp",
  "./assets/picknick-wiese.webp",
  "./assets/regenbrief.webp",
  "./assets/stern.webp",
  "./assets/wunschknopf.webp"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(appFiles)));
});
self.addEventListener("message", event => {
  if (event.data === "ACTIVATE") self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith("majas-sachunterricht-") && key !== cacheName).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  const scope = new URL(self.registration.scope);
  if (event.request.method !== "GET" || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.open(cacheName).then(cache => cache.match("./index.html"))));
    return;
  }
  const known = appFiles.some(file => new URL(file, scope).pathname === url.pathname);
  if (!known) return;
  event.respondWith(caches.open(cacheName).then(async cache => {
    const cached = await cache.match(event.request, { ignoreSearch: true });
    return cached || fetch(event.request);
  }));
});

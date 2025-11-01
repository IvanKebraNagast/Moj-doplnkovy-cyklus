// sw.js – no-cache režim (appka vždy načíta najnovší kód)

self.addEventListener("install", (event) => {
  self.skipWaiting(); // okamžitá aktivácia
});

self.addEventListener("activate", (event) => {
  // odstráni všetky staré cache
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Fetch – nič sa neukladá do cache, všetko ide online
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});

// sw.js – verzia s anti-cache pre HTML
const CACHE_VERSION = "v10"; // zvyš číslo pri update
const STATIC_CACHE = `doplnkovy-cyklus-${CACHE_VERSION}`;

const STATIC_FILES = [
  "./cyklus.png",
  "./manifest.webmanifest"
];

// Install (uloží len statické súbory, NIE index.html)
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_FILES))
  );
});

// Activate (zmaže staré cache)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch logic:
// ✅ HTML, JS, CSS = vždy z webu (čerstvé)
// ✅ obrázky, ikony = z cache alebo fallback na web
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // HTML/JS/CSS -> no cache, always latest
  if (req.mode === "navigate" || req.headers.get("accept")?.includes("text/html")) {
    return event.respondWith(fetch(req));
  }

  // Assety → cache-first
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});

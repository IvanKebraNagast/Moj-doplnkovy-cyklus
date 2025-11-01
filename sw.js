// sw.js – full control cache version
const CACHE_VERSION = "v14"; // zvýš vždy pri update
const STATIC_CACHE = `doplnkovy-cyklus-${CACHE_VERSION}`;

const STATIC_FILES = [
  "./cyklus.png",
  "./manifest.webmanifest",
  "./apple-touch-icon.png"
];

// INSTALL – uloží len statické assety, NIE index.html, NIE doplnky.json
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_FILES))
  );
  self.skipWaiting();
});

// ACTIVATE – odstráni staré cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// FETCH LOGIC
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = req.url;

  // 1️⃣ doplnky.json → vždy ONLINE, nikdy nekeszovať
  if (url.endsWith("doplnky.json")) {
    return event.respondWith(
      fetch(req, { cache: "no-store" }).catch(() => caches.match(req))
    );
  }

  // 2️⃣ HTML → vždy online + force refresh (iOS fix)
  if (req.mode === "navigate" || req.headers.get("accept"

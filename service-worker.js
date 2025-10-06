/* =========================================================================
   EI-PPI – Service Worker               v1.1
   – Caches only GET requests
   – Skips chrome-extension / dev-tools phantom URLs
   – Provides a tiny offline fallback
   ========================================================================= */

const CACHE   = 'ei-ppi-cache-v1';
const OFFLINE = '/offline.html';   // make this file once

/* ---------- install ---------- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([
        '/', '/index.html',
        '/styles.css?v=20250427_9',
        OFFLINE
      ])
    )
  );
  self.skipWaiting();
});

/* ---------- activate ---------- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ---------- fetch ---------- */
self.addEventListener('fetch', event => {
  const { request } = event;

  /* 1) never touch non-GET (fixes “Method POST is unsupported”) */
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  /* 2) ignore chrome-extension / invalid */
  if (url.protocol === 'chrome-extension:' || url.hostname === 'invalid') return;

  /* 3) same-origin → cache-first */
  if (url.origin === location.origin)
    return event.respondWith(cacheFirstThenUpdate(request));

  /* 4) cross-origin → network-first */
  event.respondWith(networkFirst(request));
});

/* ===== helpers ===== */
async function cacheFirstThenUpdate (req) {
  const cache   = await caches.open(CACHE);
  const cached  = await cache.match(req);

  /* update in the background */
  fetch(req).then(res => res.ok && cache.put(req, res.clone())).catch(()=>{});
  return cached || fetch(req).catch(() => cache.match(OFFLINE));
}

async function networkFirst (req) {
  try {
    const res = await fetch(req);
    if (res.ok) (await caches.open(CACHE)).put(req, res.clone());
    return res;
  } catch {
    const cache = await caches.open(CACHE);
    return (await cache.match(req)) || cache.match(OFFLINE);
  }
}

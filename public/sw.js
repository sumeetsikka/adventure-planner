// Adventure Planner service worker
//
// Strategy (chosen to make "stale deploy" impossible):
//   - Navigations / HTML  : NETWORK-ONLY. The document is never served from
//                           cache, so a new deploy is always picked up on the
//                           next load. (No offline app-shell — acceptable for
//                           a travel planner that needs the network anyway.)
//   - Hashed JS/CSS assets: cache-first. Vite fingerprints these (index-AbC1.js),
//                           so a new build = a new filename = no staleness.
//   - Cross-origin images : stale-while-revalidate (Wikipedia/Loremflickr/Picsum).
//   - /api/*              : network-only.
//
// __BUILD_VERSION__ is replaced at build time so each deploy gets a fresh
// cache bucket and the activate handler purges every older bucket.

const CACHE = 'adventure-planner-__BUILD_VERSION__';
// Cross-origin imagery lives in its own bucket so it (a) survives deploys
// instead of being re-downloaded every build, and (b) can be size-capped
// independently without evicting the hashed JS/CSS in CACHE.
const IMG_CACHE = 'adventure-planner-img';
const IMG_CACHE_MAX = 120;

self.addEventListener('install', () => {
  // Take over as soon as possible — don't wait for old tabs to close.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE && k !== IMG_CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Best-effort LRU trim: Cache API keys() preserves insertion order, so the
// oldest entries are at the front. Keeps the image cache from growing forever.
async function trimCache(cacheName, max) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
  } catch { /* cache trim is best-effort */ }
}

function isHashedAsset(url) {
  // Vite output: /assets/index-A1b2C3d4.js , /assets/Foo-X9y8.css
  return url.pathname.startsWith('/assets/') && /\-[A-Za-z0-9_]{8,}\.(js|css)$/.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1. Navigations / HTML documents — NETWORK ONLY. Never stale.
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req).catch(
        () =>
          new Response(
            '<!doctype html><meta charset="utf-8"><title>Offline</title>' +
            '<body style="background:#FFFFFF;color:#1B1B1B;' +
            'font-family:Inter,system-ui,-apple-system,sans-serif;' +
            'display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center">' +
            '<div><p style="font-size:1.5rem;font-weight:700">You\'re offline.</p>' +
            '<p style="opacity:.55">Reconnect to plan your adventure.</p></div>',
            { headers: { 'Content-Type': 'text/html' }, status: 503 }
          )
      )
    );
    return;
  }

  // 2. API — network only.
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req).catch(
        () => new Response('{"error":"offline"}', { status: 503, headers: { 'Content-Type': 'application/json' } })
      )
    );
    return;
  }

  // 3. Hashed JS/CSS — cache-first (immutable; filename changes per build).
  if (url.origin === self.location.origin && isHashedAsset(url)) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone()).catch(() => {});
        return res;
      })
    );
    return;
  }

  // 4. Cross-origin imagery — stale-while-revalidate, in the capped IMG_CACHE.
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.open(IMG_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const fetchPromise = fetch(req)
          .then((res) => {
            if (res.ok) {
              cache.put(req, res.clone())
                .then(() => trimCache(IMG_CACHE, IMG_CACHE_MAX))
                .catch(() => {});
            }
            return res;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // 5. Everything else same-origin (favicon, manifest) — network, cache fallback.
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});

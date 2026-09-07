const CACHE_NAME = 'Genzelsinitaly2026smart-v9-preflight-20260907';
const ASSETS = [
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('Genzelsinitaly2026smart-') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // HTML/navigation is always network-first with no browser cache.
  if (event.request.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(new Request(event.request, { cache: 'no-store' }))
        .catch(() => new Response(
          '<!doctype html><meta charset="utf-8"><title>Offline</title><body dir="rtl">אין כרגע חיבור לרשת. פתח שוב כשיש חיבור כדי לטעון את הגרסה המעודכנת.</body>',
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        ))
    );
    return;
  }

  // Static assets may be cached.
  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      });
      return cached || network;
    })
  );
});

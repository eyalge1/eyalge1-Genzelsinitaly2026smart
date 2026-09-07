const CACHE_NAME = 'Genzelsinitaly2026smart-SMART-v4-v18-20260907';
const CORE = ['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;event.respondWith(fetch(event.request).then(r=>{const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(event.request,copy));return r;}).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));});

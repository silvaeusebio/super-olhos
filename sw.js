// Guarda tudo para funcionar sem internet na feira
const CACHE = 'super-olhos-v5';
const FILES = ['./', 'index.html', 'manifest.json', 'css/style.css?v=5', 'img/logo.png', 'img/icon.svg',
  'js/art.js?v=5', 'js/core.js?v=5', 'js/wheel.js?v=5',
  'js/games/apanha.js?v=5', 'js/games/memoria.js?v=5', 'js/games/veste.js?v=5', 'js/games/aguia.js?v=5',
  'js/games/protege.js?v=5', 'js/games/cores.js?v=5', 'js/games/diferencas.js?v=5'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // rede primeiro (para receber atualizações), cache se não houver internet
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: false }).then(r => r || caches.match('index.html'))));
});

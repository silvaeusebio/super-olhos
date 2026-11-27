// Guarda tudo para funcionar sem internet na feira
const CACHE = 'super-olhos-v10';
const FILES = ['./', 'index.html', 'manifest.json', 'css/style.css?v=9', 'img/logo.png', 'img/icon.svg',
  'js/art.js?v=7', 'js/core.js?v=7', 'js/wheel.js?v=7',
  'js/games/apanha.js?v=7', 'js/games/memoria.js?v=7', 'js/games/veste.js?v=7', 'js/games/aguia.js?v=7',
  'js/games/protege.js?v=7', 'js/games/cores.js?v=7', 'js/games/diferencas.js?v=7',
  'js/games/torre.js?v=9', 'js/games/quiz.js?v=7', 'js/lib/matter.min.js?v=7'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // rede primeiro (para receber atualizações), cache se não houver internet
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: false }).then(r => r || caches.match('index.html'))));
});

const C = 'inv-v1';
const APIS = ['coingecko', 'awesomeapi', 'bcb.gov.br'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(['./', './painel-investimentos.html'])));
  self.skipWaiting();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const host = new URL(e.request.url).hostname;
  if (APIS.some(a => host.includes(a))) return; // cotações sempre ao vivo
  e.respondWith(
    fetch(e.request)
      .then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; })
      .catch(() => caches.match(e.request))
  );
});

const C = 'inv-v2';
const APIS = ['coingecko', 'awesomeapi', 'bcb.gov.br', 'brapi.dev', 'tradingview'];

self.addEventListener('install', e => {
  // funciona com o arquivo chamado index.html ou painel-investimentos.html
  e.waitUntil(caches.open(C).then(c => Promise.all(['./', './index.html', './painel-investimentos.html'].map(u => c.add(u).catch(() => {})))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))));
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

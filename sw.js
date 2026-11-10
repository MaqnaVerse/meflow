/* MeFlow — service worker (untuk "Install app").
   Halaman pembungkus + ikon disimpan; data sebenar sentiasa dari internet (Google Apps Script).
   Tiada sambungan → offline.html. Tukar VERSION bila fail di sini dikemas kini. */
const VERSION = 'meflow-v2';
const SHELL = ['./', './index.html', './offline.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-192.png', './icons/maskable-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;   // Google: terus ke internet
  if (req.mode === 'navigate') { e.respondWith(fetch(req).catch(() => caches.match('./offline.html'))); return; }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});

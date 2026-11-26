/*
 * MysteryFate service worker: makes the game playable offline.
 * tools/build-site.js stamps VERSION (a content hash) and FILES (every file of the site) at deploy time.
 * Unstamped (local development) it does nothing, so you never see stale files while editing.
 *
 * Strategy: precache everything on install, serve from the cache first, fall back to the network.
 * A new deploy = a new VERSION = a new service worker, which waits until the page says "update now".
 */
const VERSION = '0e8ca6294838';
const FILES = ["./","css/fonts.css","css/style.css","fonts/atkinsonhyperlegible-italic-400.woff2","fonts/atkinsonhyperlegible-normal-400.woff2","fonts/atkinsonhyperlegible-normal-700.woff2","fonts/cinzel-normal-500.woff2","fonts/ibmplexmono-normal-400.woff2","fonts/ibmplexmono-normal-500.woff2","fonts/literata-italic-400.woff2","fonts/literata-normal-400.woff2","icons/apple-touch-icon.png","icons/favicon-32.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","icons/icon.svg","js/app.js","js/audio.js","js/core.js","js/engine.js","js/fx.js","js/map.js","js/scenes.js","js/voice.js","manifest.webmanifest","privacy.html","stories/adventure-dustwater.js","stories/adventure-merrow.js","stories/adventure-whiteout.js","stories/comedy-babysitting.js","stories/comedy-best-person.js","stories/comedy-henchperson.js","stories/comedy-narrator-lying.js","stories/drama-letters-2046.js","stories/drama-second-chances.js","stories/fantasy-cartographers-apprentice.js","stories/fantasy-ember-crown.js","stories/fantasy-villains-apprentice.js","stories/horror-floor13.js","stories/horror-keepers-log.js","stories/horror-the-end.js","stories/mystery-last-passenger.js","stories/mystery-page-47.js","stories/mystery-quiet-street.js","stories/mystery-room-9.js","stories/mystery-two-phones.js","stories/scifi-deja-vu.js","stories/scifi-groundhog-shift.js","stories/scifi-juniper.js","stories/scifi-kepler-deep.js","stories/thriller-dead-drop.js","stories/thriller-deep-shift.js","stories/thriller-midnight-gala.js","stories/thriller-seven-hours.js"];
const CACHE = 'mf-' + VERSION;

self.addEventListener('install', (e) => {
  if (!FILES.length) return;
  // cache: 'reload' skips the HTTP cache so a new version never precaches stale files.
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' })))));
});

self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k.startsWith('mf-') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (!FILES.length || req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok && res.type === 'basic') cache.put(req, res.clone());
      return res;
    } catch (err) {
      if (req.mode === 'navigate') { const page = await cache.match('./'); if (page) return page; }
      throw err;
    }
  })());
});

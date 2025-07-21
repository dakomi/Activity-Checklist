const CACHE_VERSION = 'v1';
const CACHE_NAME = `activity-checklist-${CACHE_VERSION}`;
const ASSETS_TO_CACHE = [
  '/Activity-Checklist/index.html',
  '/Activity-Checklist/manifest.json',
  '/Activity-Checklist/icon-192.png',
  '/Activity-Checklist/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Notification handling
self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(payload.title || 'Weekly Checklist', {
      body: payload.body || 'Check your weekly activities',
      icon: '/Activity-Checklist/icon-192.png',
      vibrate: [200, 100, 200]
    })
  );
});

// Background sync for notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'checklist-notification') {
    event.waitUntil(handleNotificationSync());
  }
});

async function handleNotificationSync() {
  // This would be called when the device comes back online
  // I could implement retry logic here if needed
}

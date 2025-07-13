const CACHE_NAME = 'activity-checklist';
const ASSETS_TO_CACHE = [
  '/pleasant-activity-checklist.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
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
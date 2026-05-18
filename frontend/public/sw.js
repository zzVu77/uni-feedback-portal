const CACHE_NAME = "FeedbackAppCache-v1";

const staticFiles = ["/", "/globals.css"];

const BASE_URL = self.location.origin;

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(staticFiles);
    }),
  );
});

self.addEventListener("fetch", function (event) {
  const url = new URL(event.request.url);

  if (url.origin !== BASE_URL) {
    event.respondWith(
      fetch(event.request)
        .then(function (networkResponse) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(function () {
          return caches.match(event.request);
        }),
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) return response;
      return fetch(event.request);
    }),
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
    }),
  );
});

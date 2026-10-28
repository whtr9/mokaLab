const CACHE_NAME = 'mokalab-cache-v3.2';

// Обязательные локальные файлы модульного проекта
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/aero-theme.css',
  './js/app.js',
  './js/i18n.js',
  './js/data.js',
  './js/state.js',
  './js/ui.js',
  './js/storage.js',
  './js/pwa.js'
];

// Опциональные файлы (иконки и внешние библиотеки)
const OPTIONAL_ASSETS = [
  './icon-192.png',
  './icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap'
];

// 1. Установка (Install): сохраняем базовые файлы в кэш телефона
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(CORE_ASSETS);
      
      for (const url of OPTIONAL_ASSETS) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn('[SW] Пропущено при первичном кэшировании:', url);
        }
      }
    })
  );
  self.skipWaiting();
});

// 2. Активация (Activate): удаляем старые версии кэша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 3. Перехват запросов (Fetch): стратегия Network First
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

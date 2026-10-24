const CACHE_NAME = 'mokalab-cache-v1';

// Обязательные локальные файлы проекта
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Опциональные файлы (иконки и внешние библиотеки)
const OPTIONAL_ASSETS = [
  './icon-192.png',
  './icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap'
];

// 1. Установка (Install): сохраняем базовые файлы в кэш телефона
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Сначала гарантированно кэшируем ядро приложения
      await cache.addAll(CORE_ASSETS);
      
      // Иконки и CDN кэшируем по отдельности, чтобы отсутствие 
      // картинки на этапе разработки не сломало установку воркера
      for (const url of OPTIONAL_ASSETS) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn('[SW] Пропущено при первичном кэшировании:', url);
        }
      }
    })
  );
  // Активируем новый сервис-воркер сразу, не дожидаясь закрытия вкладок
  self.skipWaiting();
});

// 2. Активация (Activate): удаляем старые версии кэша при обновлении сайта
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
  // Берем управление всеми открытыми вкладками MokaLab на себя
  self.clients.claim();
});

// 3. Перехват запросов (Fetch): стратегия Network First (Сначала сеть, если офлайн — из кэша)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Если интернет есть и получен валидный ответ — обновляем копию в кэше
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Если интернета нет — отдаем сохраненную копию из памяти телефона
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Если это переход на страницу, возвращаем закэшированный index.html
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

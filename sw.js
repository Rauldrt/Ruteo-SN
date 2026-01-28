const CACHE_NAME = 'rutafacil-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// 1. Instalación: Guardar archivos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Abriendo caché y guardando recursos...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activación: Limpiar cachés viejas si actualizamos la versión
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
    })
  );
});

// 3. Interceptación: Servir desde caché si no hay internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si está en caché, lo devolvemos
      if (response) {
        return response;
      }
      // Si no, intentamos buscarlo en internet
      return fetch(event.request).catch(() => {
        // Aquí podrías retornar una página de "No hay conexión" personalizada si quisieras
        // Pero para las librerías críticas, si falla el fetch y no está en caché, la app no cargará.
        // El Service Worker asegura que si ya cargó una vez, esté en caché.
      });
    })
  );
});

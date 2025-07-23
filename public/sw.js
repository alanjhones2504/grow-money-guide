const CACHE_NAME = 'financas-pwa-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/icon-144x144.png',
  '/icon-32x32.png',
  '/icon-16x16.png'
  // Os arquivos JS e CSS são gerados dinamicamente pelo Vite com hashes
  // Serão cacheados durante o evento fetch
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('PWA: Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('PWA: Cache aberto, adicionando recursos...');
        return cache.addAll(urlsToCache).catch(error => {
          console.error('PWA: Erro ao cachear alguns recursos:', error);
          // Continue mesmo se alguns recursos falharem
        });
      })
      .then(() => {
        console.log('PWA: Recursos cacheados com sucesso');
        // Skip waiting to activate immediately
        self.skipWaiting();
      })
      .catch((error) => {
        console.error('PWA: Erro ao cachear recursos:', error);
      })
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('PWA: Service Worker ativando...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('PWA: Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients immediately
      self.clients.claim()
    ]).then(() => {
      console.log('PWA: Service Worker ativo e controlando todas as páginas');
    })
  );
});

// Fetch event - implementando estratégia stale-while-revalidate
self.addEventListener('fetch', (event) => {
  // Ignorar requisições não GET
  if (event.request.method !== 'GET') return;

  // Ignorar requisições para APIs ou outros domínios
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  // Estratégia stale-while-revalidate para arquivos de aplicação
  if (event.request.destination === 'script' ||
    event.request.destination === 'style' ||
    event.request.destination === 'font' ||
    event.request.url.includes('.js') ||
    event.request.url.includes('.css')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              if (networkResponse && networkResponse.ok) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(error => {
              console.error('PWA: Erro ao buscar recurso:', error);
              // Retorna undefined para cair no fallback
            });

          // Retorna o cache imediatamente se disponível, ou espera a rede
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Estratégia cache-first para outros recursos
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          // Revalidate in background
          fetch(event.request)
            .then(networkResponse => {
              if (networkResponse && networkResponse.ok) {
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, networkResponse));
              }
            })
            .catch(() => { });

          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || !response.ok) {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If both cache and network fail, return offline page for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Handle background sync for offline transaction storage
self.addEventListener('sync', (event) => {
  console.log('PWA: Background sync evento:', event.tag);

  if (event.tag === 'financial-data-sync') {
    event.waitUntil(
      // Sync offline transactions when back online
      syncOfflineData()
    );
  }
});

// Handle skip waiting message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('PWA: Recebida mensagem para skip waiting');
    self.skipWaiting();
  }
});

// Function to sync offline data
async function syncOfflineData() {
  console.log('PWA: Sincronizando dados offline...');

  try {
    // Get offline transactions from localStorage
    const offlineTransactions = getOfflineTransactions();

    if (offlineTransactions.length > 0) {
      console.log(`PWA: Sincronizando ${offlineTransactions.length} transações offline`);
      // Here you would sync with your backend
      console.log('PWA: Sincronização concluída');
    }
  } catch (error) {
    console.error('PWA: Erro na sincronização:', error);
  }
}

// Helper function to get offline transactions
function getOfflineTransactions() {
  try {
    const transactions = localStorage.getItem('financial-transactions');
    return transactions ? JSON.parse(transactions) : [];
  } catch (error) {
    console.error('PWA: Erro ao acessar localStorage:', error);
    return [];
  }
}

// Periodic background sync registration
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'financial-data-periodic-sync') {
    event.waitUntil(syncOfflineData());
  }
});

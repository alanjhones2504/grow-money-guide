const CACHE_NAME = 'financas-pwa-v2';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('PWA: Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('PWA: Cache aberto, adicionando recursos...');
        return cache.addAll(urlsToCache.filter(url => url !== '/static/js/bundle.js' && url !== '/static/css/main.css'));
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

// Fetch event - serve from cache when offline with fallback strategies
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          console.log('PWA: Servindo do cache:', event.request.url);
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
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

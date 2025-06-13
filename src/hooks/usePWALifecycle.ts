
import { useEffect, useState } from 'react';

interface PWALifecycleState {
  isInstalled: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  installing: boolean;
  registration: ServiceWorkerRegistration | null;
}

export const usePWALifecycle = () => {
  const [state, setState] = useState<PWALifecycleState>({
    isInstalled: false,
    isOnline: navigator.onLine,
    updateAvailable: false,
    installing: false,
    registration: null
  });

  useEffect(() => {
    // Check if app is installed
    const checkInstalled = () => {
      const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                            (window.navigator as any).standalone === true;
      setState(prev => ({ ...prev, isInstalled: isAppInstalled }));
    };

    // Register service worker and handle lifecycle events
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          setState(prev => ({ ...prev, registration }));

          // Check for updates on initial registration
          if (registration.waiting) {
            setState(prev => ({ ...prev, updateAvailable: true }));
          }

          // Listen for new service worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              setState(prev => ({ ...prev, installing: true }));
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setState(prev => ({ 
                    ...prev, 
                    updateAvailable: true, 
                    installing: false 
                  }));
                }
              });
            }
          });

          console.log('PWA: Service Worker registrado com sucesso');
        } catch (error) {
          console.error('PWA: Erro ao registrar Service Worker:', error);
        }
      }
    };

    // Handle online/offline status
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    // Handle app installation
    const handleAppInstalled = () => {
      checkInstalled();
      console.log('PWA: App instalado com sucesso!');
    };

    // Initialize
    checkInstalled();
    registerServiceWorker();

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check for updates periodically
    const updateCheckInterval = setInterval(() => {
      if (state.registration) {
        state.registration.update();
      }
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(updateCheckInterval);
    };
  }, []);

  const updateApp = () => {
    if (state.registration?.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const clearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('PWA: Cache limpo com sucesso');
    }
  };

  return {
    ...state,
    updateApp,
    clearCache
  };
};

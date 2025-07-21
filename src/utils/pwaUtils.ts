import { registerSW } from 'virtual:pwa-register';
import { useState, useEffect } from 'react';

// Type for the update function returned by registerSW
type UpdateSWFn = (reloadPage?: boolean) => Promise<void>;

// Interface for the PWA update status
interface PWAStatus {
  needRefresh: boolean;
  updateServiceWorker: UpdateSWFn | null;
}

/**
 * Hook to use the PWA update functionality
 * @returns Object containing the update status and functions
 */
export const usePWA = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSW, setUpdateSW] = useState<UpdateSWFn | null>(null);

  useEffect(() => {
    // Register the service worker with auto update enabled
    const updateSWFn = registerSW({
      onNeedRefresh() {
        // New content is available, show update notification
        setNeedRefresh(true);
      },
      onOfflineReady() {
        // App is ready to work offline
        console.log('App is ready for offline use');
      },
      onRegistered(registration) {
        // SW has been registered
        console.log('Service Worker registered:', registration);
      },
      onRegisterError(error) {
        console.error('Service Worker registration error:', error);
      },
    });

    setUpdateSW(() => updateSWFn);

    return () => {
      // Cleanup if needed
    };
  }, []);

  /**
   * Update the service worker and reload the page
   */
  const updateApp = async () => {
    if (updateSW) {
      await updateSW(true);
    }
  };

  /**
   * Close the update notification without updating
   */
  const closeUpdateNotification = () => {
    setNeedRefresh(false);
  };

  return {
    needRefresh,
    updateApp,
    closeUpdateNotification,
  };
};

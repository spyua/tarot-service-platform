import React from 'react';
import { usePWA } from '@/utils/pwaUtils';

/**
 * Component to display a notification when a new version of the app is available
 */
const PWAUpdateNotification: React.FC = () => {
  const { needRefresh, updateApp, closeUpdateNotification } = usePWA();

  if (!needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-primary-200 dark:border-primary-700 flex flex-col sm:flex-row items-center justify-between">
      <div className="flex items-center mb-3 sm:mb-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-primary-600 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-gray-800 dark:text-gray-200">
          有新版本可用，請更新以獲得最新功能和改進。
        </span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={closeUpdateNotification}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          稍後
        </button>
        <button
          onClick={updateApp}
          className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          立即更新
        </button>
      </div>
    </div>
  );
};

export default PWAUpdateNotification;

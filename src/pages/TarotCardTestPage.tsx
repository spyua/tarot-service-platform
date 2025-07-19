import React, { useState } from 'react';
import { TarotCardDemo } from '../components/cards';

const TarotCardTestPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading completion
  setTimeout(() => {
    setIsLoading(false);
  }, 1500);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-purple-900/80 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-serif text-purple-900">載入塔羅牌資料中...</h2>
            <p className="text-gray-600 mt-2">準備開始您的神秘之旅</p>
          </div>
        </div>
      )}
      
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-serif text-purple-900 mb-3">塔羅牌視覺組件</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            這個頁面展示了塔羅牌應用程式的視覺組件，包括牌面顯示、牌堆、抽牌區域和詳細資訊顯示。
            您可以嘗試不同的佈局和功能來體驗完整的塔羅牌視覺系統。
          </p>
        </header>
        
        <TarotCardDemo />
        
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>塔羅占卜網頁應用程式 © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default TarotCardTestPage;
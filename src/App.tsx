import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            塔羅占卜
          </h1>
          <p className="text-lg text-gray-600 font-secondary">
            探索內心的智慧，發現生命的指引
          </p>
        </header>
        
        <main className="max-w-4xl mx-auto">
          <div className="card p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">歡迎來到塔羅世界</h2>
            <p className="text-gray-600 mb-6">
              專案基礎架構已建立完成。接下來將逐步實現各項功能。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="btn-primary">
                無視論抽牌
              </button>
              <button className="btn-secondary">
                每日抽牌
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
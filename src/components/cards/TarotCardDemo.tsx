import React, { useState, useEffect } from 'react';
import { TarotCard, TarotDeck, DrawingArea, CardDetails, CardImagePreloader } from './index';
import { DrawnCard, TarotCard as TarotCardType } from '../../types';

// Import tarot card data
import tarotData from '../../data/tarotCards.json';
import interpretationFrameworks from '../../data/interpretationFrameworks';

interface TarotCardDemoProps {
  className?: string;
}

/**
 * Demo component to showcase all tarot card visual components
 * Demonstrates the full functionality of the tarot card system
 */
const TarotCardDemo: React.FC<TarotCardDemoProps> = ({ className = '' }) => {
  // State for demo
  const [selectedCard, setSelectedCard] = useState<DrawnCard | null>(null);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [layout, setLayout] = useState<'line' | 'arc' | 'cross' | 'grid' | 'fan' | 'star'>('line');
  const [cardCount, setCardCount] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showPositionLabels, setShowPositionLabels] = useState(true);
  const [showInterpretation, setShowInterpretation] = useState(true);
  const [cardSize, setCardSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [loadingProgress, setLoadingProgress] = useState({ loaded: 0, total: 0 });
  
  // Get all cards from the tarot data
  const allCards: TarotCardType[] = [
    ...tarotData.majorArcana,
    ...tarotData.minorArcana.cups,
    ...tarotData.minorArcana.wands,
    ...tarotData.minorArcana.swords,
    ...tarotData.minorArcana.pentacles,
  ];

  // Function to draw random cards
  const drawRandomCards = () => {
    setIsShuffling(true);
    setSelectedCard(null);
    
    // Simulate shuffling
    setTimeout(() => {
      setIsShuffling(false);
      setIsDrawing(true);
      setDrawnCards([]);
      
      // Simulate drawing delay
      setTimeout(() => {
        const shuffled = [...allCards].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, cardCount);
        
        // Create drawn cards with position meanings from interpretation framework
        const framework = interpretationFrameworks[cardCount];
        const newDrawnCards: DrawnCard[] = selected.map((card, index) => ({
          card,
          position: index + 1,
          isReversed: Math.random() < 0.3, // 30% chance of reversed
          positionMeaning: framework?.positions[index]?.description || `Position ${index + 1}`,
        }));
        
        setDrawnCards(newDrawnCards);
        setIsDrawing(false);
      }, 1000);
    }, 1500);
  };

  // Handle card click
  const handleCardClick = (card: DrawnCard) => {
    setSelectedCard(card);
  };

  // Handle image loading progress
  const handleLoadingProgress = (loaded: number, total: number) => {
    setLoadingProgress({ loaded, total });
  };

  // Draw initial cards on mount
  useEffect(() => {
    drawRandomCards();
  }, []);

  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-2xl font-serif text-purple-900 mb-6 text-center">塔羅牌視覺組件展示</h2>
      
      {/* Card preloader */}
      <CardImagePreloader 
        cards={allCards}
        priority={drawnCards.map(dc => dc.card.id)}
        onProgress={handleLoadingProgress}
        batchSize={10}
        showIndicator={true}
      >
        {/* Loading status can be accessed here */}
        {loadingProgress.total > 0 && loadingProgress.loaded < loadingProgress.total && (
          <div className="text-center text-sm text-gray-500 mb-4">
            載入圖片中: {loadingProgress.loaded}/{loadingProgress.total}
          </div>
        )}
      </CardImagePreloader>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">卡片數量</label>
          <select 
            className="border rounded px-2 py-1"
            value={cardCount}
            onChange={(e) => setCardCount(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">佈局</label>
          <select 
            className="border rounded px-2 py-1"
            value={layout}
            onChange={(e) => setLayout(e.target.value as any)}
          >
            <option value="line">直線</option>
            <option value="arc">弧形</option>
            <option value="fan">扇形</option>
            <option value="cross">十字</option>
            <option value="star">星形</option>
            <option value="grid">網格</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">卡片大小</label>
          <select 
            className="border rounded px-2 py-1"
            value={cardSize}
            onChange={(e) => setCardSize(e.target.value as any)}
          >
            <option value="sm">小</option>
            <option value="md">中</option>
            <option value="lg">大</option>
            <option value="xl">特大</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button 
            className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 disabled:opacity-50"
            onClick={drawRandomCards}
            disabled={isDrawing || isShuffling}
          >
            {isShuffling ? '洗牌中...' : isDrawing ? '抽牌中...' : '重新抽牌'}
          </button>
        </div>
      </div>
      
      {/* Display options */}
      <div className="flex flex-wrap gap-6 justify-center mb-6">
        <label className="flex items-center">
          <input 
            type="checkbox" 
            checked={showPositionLabels} 
            onChange={(e) => setShowPositionLabels(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-600">顯示位置標籤</span>
        </label>
        
        <label className="flex items-center">
          <input 
            type="checkbox" 
            checked={showInterpretation} 
            onChange={(e) => setShowInterpretation(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-600">顯示解讀框架</span>
        </label>
      </div>
      
      {/* Card deck */}
      <div className="flex justify-center mb-8">
        <TarotDeck 
          cardCount={78 - drawnCards.length} 
          onClick={drawRandomCards}
          disabled={isDrawing}
          isShuffling={isShuffling}
          size="md"
        />
      </div>
      
      {/* Drawing area */}
      <div className="mb-8 h-96 border border-gray-200 rounded-lg bg-gradient-to-b from-purple-50 to-white">
        <DrawingArea 
          drawnCards={drawnCards}
          layout={layout}
          maxCards={cardCount}
          onCardClick={handleCardClick}
          cardSize={cardSize}
          showPositionLabels={showPositionLabels}
          isAnimating={isDrawing}
          interpretationFramework={interpretationFrameworks[cardCount]}
          showInterpretation={showInterpretation}
        />
      </div>
      
      {/* Selected card details */}
      {selectedCard && (
        <div className="max-w-2xl mx-auto mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-serif text-purple-900 mb-4">卡片詳情</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex justify-center">
              <TarotCard drawnCard={selectedCard} size="lg" />
            </div>
            <div className="md:w-2/3">
              <CardDetails drawnCard={selectedCard} showFullDetails />
            </div>
          </div>
        </div>
      )}
      
      {/* Card examples */}
      <div className="mt-12 bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-serif text-purple-900 mb-4">卡片樣式展示</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {/* Regular card */}
          <div className="flex flex-col items-center">
            <h4 className="text-sm text-gray-600 mb-2">正位牌</h4>
            <TarotCard card={allCards[0]} size="sm" />
          </div>
          
          {/* Reversed card */}
          <div className="flex flex-col items-center">
            <h4 className="text-sm text-gray-600 mb-2">逆位牌</h4>
            <TarotCard 
              drawnCard={{
                card: allCards[1],
                position: 1,
                isReversed: true
              }} 
              size="sm" 
            />
          </div>
          
          {/* Card back */}
          <div className="flex flex-col items-center">
            <h4 className="text-sm text-gray-600 mb-2">牌背</h4>
            <TarotCard showBack size="sm" />
          </div>
          
          {/* Flip animation */}
          <div className="flex flex-col items-center">
            <h4 className="text-sm text-gray-600 mb-2">翻牌動畫</h4>
            <TarotCard 
              card={allCards[2]} 
              size="sm" 
              flipAnimation={true} 
              showBack={Math.floor(Date.now() / 1000) % 2 === 0} 
            />
          </div>
          
          {/* Loading state */}
          <div className="flex flex-col items-center">
            <h4 className="text-sm text-gray-600 mb-2">載入中</h4>
            <div className="w-24 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          </div>
          
          {/* Error state */}
          <div className="flex flex-col items-center">
            <h4 className="text-sm text-gray-600 mb-2">錯誤狀態</h4>
            <div className="w-24 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <span className="block text-xl">⚠️</span>
                <span className="text-xs">載入失敗</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card sizes */}
      <div className="mt-12 bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-serif text-purple-900 mb-4">卡片尺寸展示</h3>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex flex-col items-center">
            <h4 className="text-sm text-gray-600 mb-2">小 (sm)</h4>
            <TarotCard card={allCards[3]} size="sm" />
          </div>
          
          <div className="flex flex-col items-center">
            <h4 className="text-sm text-gray-600 mb-2">中 (md)</h4>
            <TarotCard card={allCards[3]} size="md" />
          </div>
          
          <div className="flex flex-col items-center">
            <h4 className="text-sm text-gray-600 mb-2">大 (lg)</h4>
            <TarotCard card={allCards[3]} size="lg" />
          </div>
          
          <div className="flex flex-col items-center">
            <h4 className="text-sm text-gray-600 mb-2">特大 (xl)</h4>
            <TarotCard card={allCards[3]} size="xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarotCardDemo;
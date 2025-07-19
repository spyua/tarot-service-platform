import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TarotDeck from '../../components/cards/TarotDeck';
import DrawingArea from '../../components/cards/DrawingArea';
import CardDetails from '../../components/cards/CardDetails';
import { DrawnCard, InterpretationFramework, Language } from '../../types';
import { tarotDeck } from '../../services/TarotDeck';
import { useAnimation } from '../../components/animations/AnimationContext';

/**
 * 無視論抽牌頁面
 * 實現需求1：無視論抽牌系統
 */
const FreeReading: React.FC = () => {
  // 狀態管理
  const [cardCount, setCardCount] = useState<number>(3); // 預設3張牌
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<DrawnCard | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [interpretation, setInterpretation] = useState<string>('');
  const [interpretationFramework, setInterpretationFramework] = useState<InterpretationFramework | null>(null);
  const [showInterpretation, setShowInterpretation] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('zh-TW');
  const [showFrameworkInfo, setShowFrameworkInfo] = useState<boolean>(false);
  
  // 動畫控制
  const { animationsEnabled } = useAnimation();
  
  // 當卡片數量變化時，更新解讀框架
  useEffect(() => {
    const framework = tarotDeck.getInterpretationFramework(cardCount);
    setInterpretationFramework(framework);
  }, [cardCount]);  
  
  // 處理抽牌
  const handleDrawCards = () => {
    // 如果已經在抽牌中，則不執行
    if (isDrawing || isShuffling) return;
    
    // 開始洗牌動畫
    setIsShuffling(true);
    
    // 洗牌動畫結束後開始抽牌
    setTimeout(() => {
      setIsShuffling(false);
      setIsDrawing(true);
      
      // 重置已選擇的牌
      setSelectedCard(null);
      setShowInterpretation(false);
      
      // 抽取指定數量的牌
      const cards = tarotDeck.drawCards({
        cardCount,
        allowReversed: true,
        reversedProbability: 0.3,
      });
      
      // 生成占卜結果
      const result = tarotDeck.generateReadingResult(cards, 'free');
      
      // 更新狀態
      setDrawnCards(cards);
      setInterpretation(result.interpretation);
      
      // 抽牌動畫結束後顯示解讀
      setTimeout(() => {
        setIsDrawing(false);
        setShowInterpretation(true);
      }, animationsEnabled ? 1000 + cards.length * 200 : 500);
    }, animationsEnabled ? 1500 : 500);
  };
  
  // 處理重新抽牌
  const handleRedraw = () => {
    // 重置狀態
    setDrawnCards([]);
    setSelectedCard(null);
    setInterpretation('');
    setShowInterpretation(false);
    
    // 重置已使用的牌
    tarotDeck.resetUsedCards();
  };
  
  // 處理卡片點擊
  const handleCardClick = (card: DrawnCard) => {
    setSelectedCard(card === selectedCard ? null : card);
  };
  
  // 處理語言切換
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };  
  
  // 渲染卡片數量選擇器
  const renderCardCountSelector = () => {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-primary mb-4 text-center">
          {language === 'zh-TW' ? '選擇抽牌數量' : 'Select Number of Cards'}
        </h2>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((count) => (
            <motion.button
              key={count}
              onClick={() => setCardCount(count)}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-lg font-medium transition-all
                ${cardCount === count 
                  ? 'bg-purple-600 text-white shadow-lg scale-110' 
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                }`}
              disabled={isDrawing || isShuffling}
              whileHover={!isDrawing && !isShuffling ? { scale: 1.05 } : {}}
              whileTap={!isDrawing && !isShuffling ? { scale: 0.95 } : {}}
            >
              {count}
            </motion.button>
          ))}
        </div>
        
        {interpretationFramework && (
          <motion.div 
            className="text-center mt-6 bg-purple-50 p-4 rounded-lg border border-purple-100 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-purple-800 font-medium">
                {language === 'zh-TW' ? '牌陣：' : 'Spread: '}
                {interpretationFramework.name}
              </span>
              <button 
                onClick={() => setShowFrameworkInfo(!showFrameworkInfo)}
                className="text-purple-600 hover:text-purple-800 text-sm"
                aria-label={showFrameworkInfo ? '隱藏詳情' : '顯示詳情'}
              >
                {showFrameworkInfo ? '▲' : '▼'}
              </button>
            </div>
            
            {showFrameworkInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {interpretationFramework.description && (
                  <p className="text-sm text-purple-700 mb-3">
                    {interpretationFramework.description}
                  </p>
                )}
                
                <div className="text-left">
                  <h3 className="text-sm font-medium text-purple-800 mb-2">
                    {language === 'zh-TW' ? '位置含義：' : 'Position Meanings:'}
                  </h3>
                  <ul className="text-xs text-purple-700 space-y-1.5">
                    {interpretationFramework.positions.map((position, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-purple-200 text-purple-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">
                          {index + 1}
                        </span>
                        <div>
                          <span className="font-medium">{position.name}</span>
                          {position.description && (
                            <span className="block text-purple-600">{position.description}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    );
  };
  
  // 渲染抽牌區域
  const renderDrawingArea = () => {
    // 根據牌數選擇適合的佈局
    let layout: 'line' | 'arc' | 'cross' | 'grid' | 'fan' | 'star' = 'line';
    
    if (cardCount === 1) {
      layout = 'line';
    } else if (cardCount === 2) {
      layout = 'line';
    } else if (cardCount === 3) {
      layout = 'arc';
    } else if (cardCount === 4) {
      layout = 'cross'; // 改用十字佈局更適合4張牌
    } else if (cardCount === 5) {
      layout = 'star';
    } else if (cardCount === 6) {
      layout = 'arc';
    } else if (cardCount >= 7) {
      layout = 'fan';
    }    
 
   return (
      <div className="relative min-h-[400px] md:min-h-[500px] mb-8">
        <DrawingArea
          drawnCards={drawnCards}
          layout={layout}
          maxCards={cardCount}
          onCardClick={handleCardClick}
          cardSize="md"
          showPositionLabels={true}
          isAnimating={isDrawing}
          interpretationFramework={interpretationFramework}
          showInterpretation={true}
        />
        
        {/* 抽牌按鈕和牌堆 */}
        {drawnCards.length === 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <TarotDeck
                onClick={handleDrawCards}
                disabled={isDrawing || isShuffling}
                isShuffling={isShuffling}
                size="lg"
                className="mx-auto"
              />
            </motion.div>
            <motion.p 
              className="text-center mt-4 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {language === 'zh-TW' ? '點擊牌堆開始抽牌' : 'Click the deck to draw cards'}
            </motion.p>
          </div>
        )}
      </div>
    );
  };
  
  // 渲染解讀結果
  const renderInterpretation = () => {
    if (!showInterpretation || !interpretation) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-xl font-primary mb-4 text-center">
          {language === 'zh-TW' ? '塔羅解讀' : 'Tarot Reading'}
        </h2>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="whitespace-pre-line text-gray-700 leading-relaxed">
            {interpretation.split('\n\n').map((paragraph, index) => (
              <p key={index} className={index > 0 ? 'mt-4' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }; 
 
  // 渲染選中卡片的詳細資訊
  const renderSelectedCardDetails = () => {
    if (!selectedCard) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-xl font-primary mb-4 text-center">
          {language === 'zh-TW' ? '卡片詳情' : 'Card Details'}
        </h2>
        <CardDetails
          drawnCard={selectedCard}
          language={language}
          showFullDetails={true}
          onLanguageChange={handleLanguageChange}
        />
      </motion.div>
    );
  };
  
  // 渲染操作按鈕
  const renderActionButtons = () => {
    if (drawnCards.length === 0) return null;
    
    return (
      <div className="flex justify-center gap-4 mb-8">
        <motion.button
          onClick={handleRedraw}
          className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-md"
          disabled={isDrawing || isShuffling}
          whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.95 }}
        >
          {language === 'zh-TW' ? '重新抽牌' : 'Draw Again'}
        </motion.button>
        
        {selectedCard && (
          <motion.button
            onClick={() => setSelectedCard(null)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {language === 'zh-TW' ? '關閉卡片詳情' : 'Close Card Details'}
          </motion.button>
        )}
      </div>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6 text-center font-primary">
        {language === 'zh-TW' ? '無視論抽牌' : 'Free Tarot Reading'}
      </h1>
      
      <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
        {language === 'zh-TW' 
          ? '選擇想要抽取的牌數（1-9張），然後點擊牌堆開始抽牌。每個位置都有特定的含義，點擊卡片可查看詳細解釋。' 
          : 'Choose how many cards you want to draw (1-9), then click the deck to start. Each position has a specific meaning. Click on a card to see detailed interpretation.'}
      </p>      

      {/* 卡片數量選擇器 */}
      <AnimatePresence mode="wait">
        {drawnCards.length === 0 && (
          <motion.div
            key="card-selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCardCountSelector()}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 抽牌區域 */}
      {renderDrawingArea()}
      
      {/* 操作按鈕 */}
      {renderActionButtons()}
      
      {/* 選中卡片的詳細資訊 */}
      <AnimatePresence>
        {selectedCard && renderSelectedCardDetails()}
      </AnimatePresence>
      
      {/* 解讀結果 */}
      {renderInterpretation()}
      
      {/* 返回選擇按鈕 - 當已經抽牌時顯示 */}
      {drawnCards.length > 0 && (
        <div className="text-center mt-12 mb-4">
          <motion.button
            onClick={handleRedraw}
            className="text-purple-600 hover:text-purple-800 text-sm flex items-center mx-auto"
            whileHover={{ x: -3 }}
          >
            <span className="mr-1">←</span>
            {language === 'zh-TW' ? '返回選擇牌數' : 'Back to card selection'}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default FreeReading;
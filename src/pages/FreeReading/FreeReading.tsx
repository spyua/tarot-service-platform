import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { DrawnCard, ReadingResult } from '../../types';
import { storageService } from '../../services/StorageService';
import { v4 as uuidv4 } from 'uuid';
import Button from '../../components/common/Button';
import ShareButton from '../../components/common/ShareButton';

/**
 * 無視論抽牌頁面
 * 簡單直接的抽牌方式：選擇張數 -> 抽牌 -> 展示結果
 */
const FreeReading: React.FC = () => {
  const { t } = useLanguage();
  
  // 狀態管理
  const [cardCount, setCardCount] = useState<number>(3);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<DrawnCard | null>(null);
  const [currentReading, setCurrentReading] = useState<ReadingResult | null>(null);

  // 模擬塔羅牌資料（實際應該從服務獲取）
  const mockTarotCards = [
    { id: '0', name: '愚者', nameEn: 'The Fool', suit: 'major' as const, number: 0, image: '/cards/fool.jpg' },
    { id: '1', name: '魔術師', nameEn: 'The Magician', suit: 'major' as const, number: 1, image: '/cards/magician.jpg' },
    { id: '2', name: '女祭司', nameEn: 'The High Priestess', suit: 'major' as const, number: 2, image: '/cards/high-priestess.jpg' },
    { id: '3', name: '皇后', nameEn: 'The Empress', suit: 'major' as const, number: 3, image: '/cards/empress.jpg' },
    { id: '4', name: '皇帝', nameEn: 'The Emperor', suit: 'major' as const, number: 4, image: '/cards/emperor.jpg' },
    { id: '5', name: '教皇', nameEn: 'The Hierophant', suit: 'major' as const, number: 5, image: '/cards/hierophant.jpg' },
    { id: '6', name: '戀人', nameEn: 'The Lovers', suit: 'major' as const, number: 6, image: '/cards/lovers.jpg' },
    { id: '7', name: '戰車', nameEn: 'The Chariot', suit: 'major' as const, number: 7, image: '/cards/chariot.jpg' },
    { id: '8', name: '力量', nameEn: 'Strength', suit: 'major' as const, number: 8, image: '/cards/strength.jpg' },
  ];

  // 處理抽牌
  const handleDrawCards = () => {
    setIsDrawing(true);
    
    // 模擬抽牌過程
    setTimeout(() => {
      const cards: DrawnCard[] = [];
      const usedCards = new Set<string>();
      
      for (let i = 0; i < cardCount; i++) {
        let randomCard;
        do {
          randomCard = mockTarotCards[Math.floor(Math.random() * mockTarotCards.length)];
        } while (usedCards.has(randomCard.id));
        
        usedCards.add(randomCard.id);
        const isReversed = Math.random() < 0.3; // 30% 機率逆位
        
        cards.push({
          card: {
            ...randomCard,
            meanings: {
              upright: {
                keywords: ['正面能量', '積極'],
                keywordsEn: ['Positive Energy', 'Active'],
                description: `${randomCard.name}正位代表積極的能量和正面的發展。`,
                descriptionEn: `${randomCard.nameEn} upright represents positive energy and favorable development.`,
                love: '愛情方面帶來正面的影響',
                loveEn: 'Brings positive influence in love',
                career: '事業發展順利',
                careerEn: 'Career development goes smoothly',
                health: '身體狀況良好',
                healthEn: 'Good physical condition',
                spiritual: '靈性成長',
                spiritualEn: 'Spiritual growth'
              },
              reversed: {
                keywords: ['阻礙', '挑戰'],
                keywordsEn: ['Obstacles', 'Challenges'],
                description: `${randomCard.name}逆位提醒您注意潛在的挑戰和需要克服的障礙。`,
                descriptionEn: `${randomCard.nameEn} reversed reminds you of potential challenges and obstacles to overcome.`,
                love: '感情中需要更多溝通',
                loveEn: 'Need more communication in relationships',
                career: '工作上遇到阻礙',
                careerEn: 'Encountering obstacles at work',
                health: '注意身體健康',
                healthEn: 'Pay attention to health',
                spiritual: '內在反思',
                spiritualEn: 'Inner reflection'
              }
            }
          },
          position: i + 1,
          isReversed
        });
      }
      
      setDrawnCards(cards);
      setIsDrawing(false);
      
      // 保存占卜結果
      const readingResult: ReadingResult = {
        id: uuidv4(),
        timestamp: Date.now(),
        type: 'free',
        cards: cards,
        interpretation: generateInterpretation(cards)
      };
      
      setCurrentReading(readingResult);
      storageService.saveReading(readingResult);
    }, 2000);
  };

  // 生成解讀
  const generateInterpretation = (cards: DrawnCard[]): string => {
    const interpretations = cards.map((drawnCard, index) => {
      const { card, isReversed } = drawnCard;
      const meaning = isReversed ? card.meanings.reversed : card.meanings.upright;
      const position = index + 1;
      
      return `第${position}張牌：${card.name}${isReversed ? '（逆位）' : '（正位）'}\n${meaning.description}`;
    });
    
    return interpretations.join('\n\n') + '\n\n整體建議：根據您抽到的牌面，建議您保持開放的心態，相信內在的智慧指引。';
  };

  // 重新抽牌
  const handleRedraw = () => {
    setDrawnCards([]);
    setSelectedCard(null);
    setCurrentReading(null);
  };

  // 處理卡片點擊
  const handleCardClick = (card: DrawnCard) => {
    setSelectedCard(card === selectedCard ? null : card);
  };

  // 渲染卡片數量選擇器
  const renderCardCountSelector = () => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
        選擇抽牌數量
      </h2>
      <div className="flex flex-wrap justify-center gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((count) => (
          <button
            key={count}
            onClick={() => setCardCount(count)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium transition-all ${
              cardCount === count 
                ? 'bg-primary-600 text-white shadow-lg scale-110' 
                : 'bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 hover:bg-primary-200 dark:hover:bg-primary-700'
            }`}
            disabled={isDrawing}
          >
            {count}
          </button>
        ))}
      </div>
    </div>
  );

  // 渲染抽牌按鈕
  const renderDrawButton = () => (
    <div className="text-center mb-8">
      <Button
        onClick={handleDrawCards}
        disabled={isDrawing}
        loading={isDrawing}
        size="lg"
        className="px-12 py-4 text-lg"
      >
        {isDrawing ? '抽牌中...' : `抽取 ${cardCount} 張牌`}
      </Button>
    </div>
  );

  // 渲染抽牌結果
  const renderCards = () => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
        您的抽牌結果
      </h2>
      
      {/* 線性排列顯示牌面 */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {drawnCards.map((drawnCard, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-48 cursor-pointer transition-all hover:shadow-xl ${
              selectedCard === drawnCard ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => handleCardClick(drawnCard)}
          >
            <div className="text-center">
              <div className={`w-32 h-48 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mx-auto mb-3 flex items-center justify-center transform ${
                drawnCard.isReversed ? 'rotate-180' : ''
              }`}>
                <span className="text-white font-bold text-sm">
                  {drawnCard.card.name}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {drawnCard.card.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {drawnCard.isReversed ? '逆位' : '正位'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                點擊查看詳情
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 整體解讀 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          整體解讀
        </h3>
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {generateInterpretation(drawnCards)}
        </div>
      </div>

      {/* 分享和重新抽牌按鈕 */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {currentReading && (
          <ShareButton 
            reading={currentReading} 
            className="w-full sm:w-auto"
          />
        )}
        <Button onClick={handleRedraw} variant="outline" className="px-8 py-3 w-full sm:w-auto">
          重新抽牌
        </Button>
      </div>
    </div>
  );

  // 渲染選中卡片的詳細資訊
  const renderSelectedCardDetails = () => {
    if (!selectedCard) return null;
    
    const { card, isReversed } = selectedCard;
    const meaning = isReversed ? card.meanings.reversed : card.meanings.upright;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            {card.name} {isReversed ? '（逆位）' : '（正位）'}
          </h3>
          <button
            onClick={() => setSelectedCard(null)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">關鍵字</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {meaning.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
            
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">基本含義</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{meaning.description}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">愛情</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{meaning.love}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">事業</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{meaning.career}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">健康</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{meaning.health}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">靈性</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{meaning.spiritual}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            無視論抽牌
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            選擇想要抽取的牌數（1-9張），直接抽牌並查看結果。點擊牌面可查看詳細解釋。
          </p>
        </motion.div>

        {drawnCards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {renderCardCountSelector()}
            {renderDrawButton()}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {renderCards()}
          </motion.div>
        )}

        <AnimatePresence>
          {selectedCard && renderSelectedCardDetails()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FreeReading;
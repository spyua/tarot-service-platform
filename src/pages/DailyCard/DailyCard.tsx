import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDailyCard } from '../../hooks/useDailyCard';
import TarotDeck from '../../components/cards/TarotDeck';
import CardDetails from '../../components/cards/CardDetails';
import ShareButton from '../../components/common/ShareButton';
import { Language, ReadingResult } from '../../types';
import { pageTransition } from '../../utils/animations';

/**
 * 每日抽牌頁面
 * 實現需求2：每日抽牌功能
 */
export default function DailyCard() {
  // 使用每日抽牌 Hook
  const {
    todayCard,
    hasDrawnToday,
    dailyStreak,
    isLoading,
    error,
    drawTodayCard,
    getDailyHistory,
  } = useDailyCard();

  // 狀態管理
  const [language, setLanguage] = useState<Language>('zh-TW');
  const [activeTab, setActiveTab] = useState<'physical' | 'emotional' | 'spiritual'>('physical');
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // 處理抽牌
  const handleDrawCard = async () => {
    if (isLoading || isDrawing) return;

    setIsDrawing(true);
    await drawTodayCard();
    
    // 模擬抽牌動畫時間
    setTimeout(() => {
      setIsDrawing(false);
    }, 1500);
  };

  // 處理語言切換
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  // 將每日抽牌記錄轉換為 ReadingResult 格式以供分享
  const convertToReadingResult = (): ReadingResult | null => {
    if (!todayCard) return null;

    const interpretation = `今日指導：${todayCard.card.card.name}${todayCard.card.isReversed ? '（逆位）' : '（正位）'}\n\n` +
      `身體健康：${todayCard.aspects.physical}\n\n` +
      `心理情緒：${todayCard.aspects.emotional}\n\n` +
      `靈性成長：${todayCard.aspects.spiritual}`;

    return {
      id: `daily_${todayCard.date}`,
      timestamp: new Date(todayCard.date).getTime(),
      type: 'daily',
      cards: [todayCard.card],
      interpretation,
      aspects: todayCard.aspects
    };
  };

  // 渲染抽牌區域
  const renderDrawArea = () => {
    if (hasDrawnToday && todayCard) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative mb-6">
            <CardDetails
              drawnCard={todayCard.card}
              language={language}
              showFullDetails={false}
              onLanguageChange={handleLanguageChange}
            />
          </div>
          
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-primary mb-4 text-center">
                {language === 'zh-TW' ? '今日指導' : 'Today\'s Guidance'}
              </h2>
              
              <div className="flex border-b mb-4">
                <button
                  className={`flex-1 py-2 px-4 text-center ${
                    activeTab === 'physical'
                      ? 'border-b-2 border-purple-600 text-purple-600 font-medium'
                      : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('physical')}
                >
                  {language === 'zh-TW' ? '身體健康' : 'Physical'}
                </button>
                <button
                  className={`flex-1 py-2 px-4 text-center ${
                    activeTab === 'emotional'
                      ? 'border-b-2 border-purple-600 text-purple-600 font-medium'
                      : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('emotional')}
                >
                  {language === 'zh-TW' ? '心理情緒' : 'Emotional'}
                </button>
                <button
                  className={`flex-1 py-2 px-4 text-center ${
                    activeTab === 'spiritual'
                      ? 'border-b-2 border-purple-600 text-purple-600 font-medium'
                      : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('spiritual')}
                >
                  {language === 'zh-TW' ? '靈性成長' : 'Spiritual'}
                </button>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-700 whitespace-pre-line"
                >
                  {activeTab === 'physical' && todayCard.aspects.physical}
                  {activeTab === 'emotional' && todayCard.aspects.emotional}
                  {activeTab === 'spiritual' && todayCard.aspects.spiritual}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* 分享按鈕 */}
            <div className="flex justify-center mt-6">
              {(() => {
                const readingResult = convertToReadingResult();
                return readingResult ? (
                  <ShareButton 
                    reading={readingResult} 
                    className="w-full sm:w-auto"
                  />
                ) : null;
              })()}
            </div>
          </div>
        </motion.div>
      );
    } else {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-6"
          >
            <TarotDeck
              onClick={handleDrawCard}
              disabled={isLoading || isDrawing}
              isShuffling={isDrawing}
              size="lg"
            />
          </motion.div>
          
          <motion.p
            className="text-center mt-4 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {language === 'zh-TW' ? '點擊牌堆抽取今日指導牌' : 'Click the deck to draw today\'s card'}
          </motion.p>
        </motion.div>
      );
    }
  };

  // 渲染歷史記錄
  const renderHistory = () => {
    if (!showHistory) return null;
    
    const history = getDailyHistory(7); // 獲取最近7天的記錄
    
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="w-full max-w-2xl mx-auto mt-8 overflow-hidden"
      >
        <h2 className="text-xl font-primary mb-4">
          {language === 'zh-TW' ? '最近抽牌記錄' : 'Recent Card History'}
        </h2>
        
        {history.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm">
                    <th className="py-3 px-4 text-left">{language === 'zh-TW' ? '日期' : 'Date'}</th>
                    <th className="py-3 px-4 text-left">{language === 'zh-TW' ? '牌名' : 'Card'}</th>
                    <th className="py-3 px-4 text-left">{language === 'zh-TW' ? '正/逆位' : 'Position'}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record, index) => (
                    <tr key={record.date} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-3 px-4 text-gray-700">{record.date}</td>
                      <td className="py-3 px-4 text-gray-700">{record.card.card.name}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {record.card.isReversed 
                          ? (language === 'zh-TW' ? '逆位' : 'Reversed') 
                          : (language === 'zh-TW' ? '正位' : 'Upright')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
            {language === 'zh-TW' ? '尚無抽牌記錄' : 'No card history yet'}
          </div>
        )}
      </motion.div>
    );
  };

  // 渲染連續抽牌天數
  const renderStreak = () => {
    if (dailyStreak <= 0) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 text-center"
      >
        <div className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
          <span className="font-medium">
            {language === 'zh-TW' 
              ? `連續抽牌：${dailyStreak}天` 
              : `Daily streak: ${dailyStreak} day${dailyStreak > 1 ? 's' : ''}`}
          </span>
        </div>
      </motion.div>
    );
  };

  // 渲染錯誤訊息
  const renderError = () => {
    if (!error) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 max-w-2xl mx-auto"
      >
        <p className="font-medium">{error.message}</p>
      </motion.div>
    );
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 py-8"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 font-primary">
          {language === 'zh-TW' ? '每日抽牌' : 'Daily Card'}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {language === 'zh-TW' 
            ? '每天抽取一張指導牌，獲得身體健康、心理情緒和靈性成長三個面向的指引。' 
            : 'Draw one guidance card each day for insights on physical health, emotional well-being, and spiritual growth.'}
        </p>
      </div>
      
      {renderError()}
      
      {/* 抽牌區域 */}
      <div className="flex justify-center mb-8">
        {renderDrawArea()}
      </div>
      
      {/* 連續抽牌天數 */}
      {renderStreak()}
      
      {/* 歷史記錄切換按鈕 */}
      <div className="text-center mt-8">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-purple-600 hover:text-purple-800 flex items-center mx-auto"
        >
          <span className="mr-1">{showHistory ? '' : ''}</span>
          {language === 'zh-TW' 
            ? (showHistory ? '隱藏歷史記錄' : '查看歷史記錄') 
            : (showHistory ? 'Hide history' : 'View history')}
        </button>
      </div>
      
      {/* 歷史記錄 */}
      <AnimatePresence>
        {showHistory && renderHistory()}
      </AnimatePresence>
    </motion.div>
  );
}

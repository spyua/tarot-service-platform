import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DrawnCard, Language, TarotSuit } from '../../types';
import { useAnimation } from '../animations/AnimationContext';
import { cardDetailsVariants } from '../animations/cardAnimations';

interface CardDetailsProps {
  drawnCard: DrawnCard;
  language?: Language;
  showFullDetails?: boolean;
  className?: string;
  onLanguageChange?: (language: Language) => void;
}

/**
 * CardDetails component displays detailed information about a tarot card
 * Features:
 * - Displays card name, suit, and number
 * - Shows position meaning if available
 * - Lists keywords for the card
 * - Provides detailed meaning in different aspects (love, career, health, spiritual)
 * - Supports language switching between Chinese and English
 * - Expandable/collapsible detailed information
 */
const CardDetails: React.FC<CardDetailsProps> = ({
  drawnCard,
  language = 'zh-TW',
  showFullDetails: initialShowFullDetails = false,
  className = '',
  onLanguageChange,
}) => {
  // State for expanded details
  const [showFullDetails, setShowFullDetails] = useState(initialShowFullDetails);
  
  const { card, isReversed, positionMeaning } = drawnCard;
  const isEnglish = language === 'en';
  
  // Get the appropriate meanings based on orientation
  const meanings = isReversed ? card.meanings.reversed : card.meanings.upright;
  
  // Get keywords based on language
  const keywords = isEnglish ? meanings.keywordsEn : meanings.keywords;
  
  // Get description based on language
  const description = isEnglish ? meanings.descriptionEn : meanings.description;
  
  // Get aspect meanings based on language
  const love = isEnglish ? meanings.loveEn : meanings.love;
  const career = isEnglish ? meanings.careerEn : meanings.career;
  const health = isEnglish ? meanings.healthEn : meanings.health;
  const spiritual = isEnglish ? meanings.spiritualEn : meanings.spiritual;
  
  // Toggle full details
  const toggleFullDetails = () => {
    setShowFullDetails(prev => !prev);
  };
  
  // Handle language change
  const handleLanguageChange = () => {
    if (onLanguageChange) {
      onLanguageChange(isEnglish ? 'zh-TW' : 'en');
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      {/* Card header with language toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="text-xl font-serif text-purple-900">
            {isEnglish ? card.nameEn : card.name}
            {isReversed && (
              <span className="text-red-500 ml-2 inline-flex items-center">
                <span className="mr-1">↻</span>
                {isEnglish ? '(Reversed)' : '(逆位)'}
              </span>
            )}
          </h3>
        </div>
        
        {/* Language toggle */}
        <button 
          onClick={handleLanguageChange}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
        >
          {isEnglish ? '中文' : 'English'}
        </button>
      </div>
      
      {/* Card info bar */}
      <div className="flex items-center justify-between mb-4 bg-gray-50 p-2 rounded-md">
        {/* Card number and suit */}
        <div className="text-sm text-gray-600 flex items-center">
          <span className={`inline-block w-5 h-5 rounded-full mr-2 ${getSuitColor(card.suit)}`}></span>
          <span>
            {card.suit === 'major' 
              ? (isEnglish ? 'Major Arcana' : '大阿卡納') 
              : (isEnglish ? card.suit.charAt(0).toUpperCase() + card.suit.slice(1) : getSuitName(card.suit))}
            {' '}
            {card.number}
          </span>
        </div>
        
        {/* Card ID */}
        <div className="text-xs text-gray-400">
          ID: {card.id}
        </div>
      </div>
      
      {/* Position meaning if available */}
      {positionMeaning && (
        <div className="mb-4 bg-purple-50 p-3 rounded-md border-l-4 border-purple-300">
          <div className="font-medium text-purple-800">
            {isEnglish ? 'Position Meaning:' : '位置含義：'}
          </div>
          <p className="text-sm text-purple-700 mt-1">{positionMeaning}</p>
        </div>
      )}
      
      {/* Keywords */}
      <div className="mb-4">
        <div className="font-medium text-gray-700 flex items-center">
          <span className="mr-2">{isEnglish ? 'Keywords:' : '關鍵字：'}</span>
          <div className="h-px flex-grow bg-gray-200"></div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {keywords.map((keyword, index) => (
            <span 
              key={index} 
              className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
      
      {/* General description */}
      <div className="mb-4">
        <div className="font-medium text-gray-700 flex items-center">
          <span className="mr-2">{isEnglish ? 'Meaning:' : '含義：'}</span>
          <div className="h-px flex-grow bg-gray-200"></div>
        </div>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{description}</p>
      </div>
      
      {/* Detailed aspects with animation */}
      <AnimatePresence>
        {showFullDetails && (
          <motion.div 
            className="mt-6 space-y-4 overflow-hidden"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={cardDetailsVariants}
          >
            <motion.div 
              className="border-t pt-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="font-medium text-pink-700 flex items-center">
                <span className="mr-2">❤️ {isEnglish ? 'Love & Relationships:' : '愛情關係：'}</span>
                <div className="h-px flex-grow bg-pink-100"></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{love}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="font-medium text-blue-700 flex items-center">
                <span className="mr-2">💼 {isEnglish ? 'Career & Finance:' : '事業財務：'}</span>
                <div className="h-px flex-grow bg-blue-100"></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{career}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="font-medium text-green-700 flex items-center">
                <span className="mr-2">🌿 {isEnglish ? 'Health & Wellbeing:' : '健康福祉：'}</span>
                <div className="h-px flex-grow bg-green-100"></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{health}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="font-medium text-purple-700 flex items-center">
                <span className="mr-2">✨ {isEnglish ? 'Spiritual Growth:' : '靈性成長：'}</span>
                <div className="h-px flex-grow bg-purple-100"></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{spiritual}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Show more/less button */}
      <button 
        className="mt-4 text-sm text-purple-600 hover:text-purple-800 flex items-center transition-colors"
        onClick={toggleFullDetails}
      >
        {showFullDetails ? (
          <>
            <span className="mr-1">▲</span>
            {isEnglish ? 'Show less' : '收起詳情'}
          </>
        ) : (
          <>
            <span className="mr-1">▼</span>
            {isEnglish ? 'Show more details' : '顯示更多詳情'}
          </>
        )}
      </button>
    </div>
  );
};

// Helper function to get Chinese suit names
function getSuitName(suit: string): string {
  switch (suit) {
    case 'cups': return '聖杯';
    case 'wands': return '權杖';
    case 'swords': return '寶劍';
    case 'pentacles': return '錢幣';
    default: return suit;
  }
}

// Helper function to get suit colors
function getSuitColor(suit: TarotSuit): string {
  switch (suit) {
    case 'major': return 'bg-purple-600';
    case 'cups': return 'bg-blue-500';
    case 'wands': return 'bg-red-500';
    case 'swords': return 'bg-yellow-500';
    case 'pentacles': return 'bg-green-500';
  }
}

export default CardDetails;
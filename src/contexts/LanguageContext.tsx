import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define supported languages
export type Language = 'zh-TW' | 'en';

// Language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'zh-TW',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Translation data
const translations: Record<Language, Record<string, string>> = {
  'zh-TW': {
    // Navigation
    'nav.home': '首頁',
    'nav.freeReading': '無視論抽牌',
    'nav.dailyCard': '每日抽牌',
    'nav.history': '歷史記錄',
    'nav.settings': '設定',
    
    // Home page
    'home.title': '塔羅占卜',
    'home.subtitle': '探索內心的智慧，發現生命的指引。透過古老的塔羅牌藝術，為你的人生旅程點亮明燈。',
    'home.feature.freeReading.title': '無視論抽牌',
    'home.feature.freeReading.description': '自由選擇抽牌數量，獲得靈活的指導',
    'home.feature.dailyCard.title': '每日抽牌',
    'home.feature.dailyCard.description': '每天一張指導牌，陪伴你的成長之路',
    'home.feature.history.title': '歷史記錄',
    'home.feature.history.description': '回顧過往占卜，追蹤心靈成長軌跡',
    'home.quickStart.title': '開始你的塔羅之旅',
    'home.quickStart.subtitle': '選擇一個功能開始探索，或者先了解塔羅占卜的基本知識',
    'home.quickStart.startReading': '立即開始占卜',
    'home.quickStart.dailyFortune': '今日運勢',
    
    // Tarot Introduction
    'home.tarotIntro.title': '塔羅牌介紹',
    'home.tarotIntro.description1': '塔羅牌是一種古老的占卜工具，通過78張牌面的象徵意義，幫助人們探索內心世界、理解當前處境，並為未來提供指引。',
    'home.tarotIntro.description2': '無視論抽牌讓你自由選擇抽取1-9張牌，根據你的需求獲得靈活的指導。每張牌都有其獨特的含義，而牌與牌之間的關係則構成了更深層次的解讀。',
    'home.tarotIntro.cta': '立即體驗',
    
    // Daily Card
    'home.dailyCard.title': '每日指引',
    'home.dailyCard.description1': '每日抽牌功能為你提供日常生活的指引，每天抽取一張塔羅牌，從身體健康、心理情緒和靈性成長三個面向為你解讀當日能量。',
    'home.dailyCard.description2': '持續記錄每日抽牌結果，還能幫助你發現生命中的週期性模式和成長軌跡，讓塔羅牌成為你日常生活的精神夥伴。',
    'home.dailyCard.cta': '查看今日運勢',
    
    // Footer
    'footer.description': '探索內心的智慧，發現生命的指引。透過古老的塔羅牌藝術，為你的人生旅程點亮明燈。',
    'footer.features': '功能',
    'footer.resources': '資源',
    'footer.tarotIntro': '塔羅牌介紹',
    'footer.faq': '常見問題',
    'footer.copyright': '© {year} 塔羅占卜. 保留所有權利。',
    
    // Language
    'language.zh-TW': '繁體中文',
    'language.en': 'English',
  },
  'en': {
    // Navigation
    'nav.home': 'Home',
    'nav.freeReading': 'Free Reading',
    'nav.dailyCard': 'Daily Card',
    'nav.history': 'History',
    'nav.settings': 'Settings',
    
    // Home page
    'home.title': 'Tarot Reading',
    'home.subtitle': 'Explore inner wisdom and discover life guidance through the ancient art of tarot cards, illuminating your life journey.',
    'home.feature.freeReading.title': 'Free Reading',
    'home.feature.freeReading.description': 'Choose any number of cards for flexible guidance',
    'home.feature.dailyCard.title': 'Daily Card',
    'home.feature.dailyCard.description': 'One guidance card each day to accompany your growth',
    'home.feature.history.title': 'History',
    'home.feature.history.description': 'Review past readings and track your spiritual growth',
    'home.quickStart.title': 'Begin Your Tarot Journey',
    'home.quickStart.subtitle': 'Choose a feature to explore, or learn about the basics of tarot reading',
    'home.quickStart.startReading': 'Start Reading Now',
    'home.quickStart.dailyFortune': 'Today\'s Fortune',
    
    // Tarot Introduction
    'home.tarotIntro.title': 'Tarot Introduction',
    'home.tarotIntro.description1': 'Tarot is an ancient divination tool that uses 78 cards with symbolic meanings to help people explore their inner world, understand their current situation, and provide guidance for the future.',
    'home.tarotIntro.description2': 'Free reading allows you to choose 1-9 cards for flexible guidance based on your needs. Each card has its unique meaning, and the relationship between cards creates deeper interpretations.',
    'home.tarotIntro.cta': 'Try Now',
    
    // Daily Card
    'home.dailyCard.title': 'Daily Guidance',
    'home.dailyCard.description1': 'The daily card feature provides guidance for your daily life by drawing one tarot card each day, interpreting the day\'s energy from physical health, emotional state, and spiritual growth perspectives.',
    'home.dailyCard.description2': 'Continuously recording your daily card results helps you discover cyclical patterns and growth trajectories in your life, making tarot cards your spiritual companion in daily life.',
    'home.dailyCard.cta': 'See Today\'s Fortune',
    
    // Footer
    'footer.description': 'Explore inner wisdom and discover life guidance through the ancient art of tarot cards, illuminating your life journey.',
    'footer.features': 'Features',
    'footer.resources': 'Resources',
    'footer.tarotIntro': 'Tarot Introduction',
    'footer.faq': 'FAQ',
    'footer.copyright': '© {year} Tarot Reading. All rights reserved.',
    
    // Language
    'language.zh-TW': '繁體中文',
    'language.en': 'English',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize language from localStorage or default to zh-TW
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('tarot-language');
    return (savedLanguage === 'zh-TW' || savedLanguage === 'en') 
      ? savedLanguage 
      : 'zh-TW';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('tarot-language', language);
    document.documentElement.lang = language;
  }, [language]);

  // Set language function
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);
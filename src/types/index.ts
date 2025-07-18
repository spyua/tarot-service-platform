// 塔羅牌相關型別定義

/**
 * 塔羅牌花色類型
 */
export type TarotSuit = 'major' | 'cups' | 'wands' | 'swords' | 'pentacles';

/**
 * 語言類型
 */
export type Language = 'zh-TW' | 'en';

/**
 * 主題類型
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * 占卜類型
 */
export type ReadingType = 'free' | 'daily';

/**
 * 塔羅牌含義結構（支援雙語）
 */
export interface TarotMeanings {
  upright: {
    keywords: string[];
    keywordsEn: string[];
    description: string;
    descriptionEn: string;
    love: string;
    loveEn: string;
    career: string;
    careerEn: string;
    health: string;
    healthEn: string;
    spiritual: string;
    spiritualEn: string;
  };
  reversed: {
    keywords: string[];
    keywordsEn: string[];
    description: string;
    descriptionEn: string;
    love: string;
    loveEn: string;
    career: string;
    careerEn: string;
    health: string;
    healthEn: string;
    spiritual: string;
    spiritualEn: string;
  };
}

/**
 * 塔羅牌基本資料結構
 */
export interface TarotCard {
  id: string;
  name: string;
  nameEn: string;
  suit: TarotSuit;
  number: number;
  image: string;
  meanings: TarotMeanings;
}

/**
 * 抽到的塔羅牌（包含位置和正逆位資訊）
 */
export interface DrawnCard {
  card: TarotCard;
  position: number;
  isReversed: boolean;
  positionMeaning?: string;
}

/**
 * 每日抽牌的三面向分析
 */
export interface DailyAspects {
  physical: string;
  emotional: string;
  spiritual: string;
}

/**
 * 占卜結果
 */
export interface ReadingResult {
  id: string;
  timestamp: number;
  type: ReadingType;
  cards: DrawnCard[];
  interpretation: string;
  aspects?: DailyAspects;
}

/**
 * 每日抽牌記錄
 */
export interface DailyCardRecord {
  date: string; // YYYY-MM-DD 格式
  card: DrawnCard;
  aspects: DailyAspects;
}

/**
 * 使用者偏好設定
 */
export interface UserPreferences {
  language: Language;
  theme: Theme;
  animations: boolean;
  notifications: boolean;
}

/**
 * 本地存儲資料結構
 */
export interface LocalStorageData {
  readings: ReadingResult[];
  dailyCards: DailyCardRecord[];
  userPreferences: UserPreferences;
  lastCleanup: number;
}

/**
 * 牌陣位置定義
 */
export interface CardPosition {
  name: string;
  description: string;
}

/**
 * 解讀框架定義
 */
export interface InterpretationFramework {
  name: string;
  description?: string;
  positions: CardPosition[];
}

/**
 * 所有解讀框架的集合
 */
export interface InterpretationFrameworks {
  [cardCount: number]: InterpretationFramework;
}

/**
 * 塔羅牌資料庫資訊
 */
export interface TarotDatabaseInfo {
  totalCards: number;
  majorArcana: number;
  minorArcana: number;
  languages: Language[];
  version: string;
}

/**
 * 塔羅牌資料庫結構
 */
export interface TarotDatabase {
  info: TarotDatabaseInfo;
  majorArcana: TarotCard[];
  minorArcana: {
    cups: TarotCard[];
    wands: TarotCard[];
    swords: TarotCard[];
    pentacles: TarotCard[];
  };
}

/**
 * 抽牌選項
 */
export interface DrawOptions {
  cardCount: number;
  allowReversed: boolean;
  reversedProbability: number;
}

/**
 * 錯誤類型
 */
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

/**
 * 載入狀態
 */
export interface LoadingState {
  isLoading: boolean;
  error?: AppError | null;
}

/**
 * 分享選項
 */
export interface ShareOptions {
  includeInterpretation: boolean;
  includeImage: boolean;
  platform?: 'facebook' | 'twitter' | 'instagram' | 'line';
}

/**
 * 統計資料
 */
export interface AnalyticsData {
  totalReadings: number;
  dailyCardStreak: number;
  favoriteCards: string[];
  mostDrawnSuit: TarotSuit;
  averageCardsPerReading: number;
}

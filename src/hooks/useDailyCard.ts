import { useState, useEffect, useCallback } from 'react';
import {
  DailyCardRecord,
  DailyAspects,
  LoadingState,
} from '../types';
import { dailyCardService } from '../services';

/**
 * 每日抽牌功能的自定義 Hook
 */
export function useDailyCard() {
  const [todayCard, setTodayCard] = useState<DailyCardRecord | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });
  const [hasDrawnToday, setHasDrawnToday] = useState<boolean>(false);
  const [dailyStreak, setDailyStreak] = useState<number>(0);

  /**
   * 檢查今日是否已抽牌並載入資料
   */
  const checkTodayCard = useCallback(async () => {
    try {
      setLoadingState({ isLoading: true, error: null });

      const hasTodayCard = dailyCardService.hasTodayCard();
      setHasDrawnToday(hasTodayCard);

      if (hasTodayCard) {
        const card = dailyCardService.getTodayCard();
        setTodayCard(card || null);
      } else {
        setTodayCard(null);
      }

      // 獲取連續抽牌天數
      const streak = dailyCardService.getDailyStreak();
      setDailyStreak(streak);

      setLoadingState({ isLoading: false, error: null });
    } catch (error) {
      console.error('檢查今日抽牌狀態失敗:', error);
      setLoadingState({
        isLoading: false,
        error: {
          code: 'CHECK_DAILY_CARD_ERROR',
          message: '檢查今日抽牌狀態失敗',
          details: error,
        },
      });
    }
  }, []);

  /**
   * 抽取今日指導牌
   */
  const drawTodayCard = useCallback(async (): Promise<DailyCardRecord | null> => {
    try {
      setLoadingState({ isLoading: true, error: null });

      // 檢查是否已抽過牌
      if (hasDrawnToday) {
        const existingCard = dailyCardService.getTodayCard();
        setLoadingState({ isLoading: false, error: null });
        return existingCard || null;
      }

      // 抽取新牌
      const newCard = dailyCardService.drawTodayCard();
      setTodayCard(newCard);
      setHasDrawnToday(true);

      // 更新連續抽牌天數
      const streak = dailyCardService.getDailyStreak();
      setDailyStreak(streak);

      setLoadingState({ isLoading: false, error: null });
      return newCard;
    } catch (error) {
      console.error('抽取今日指導牌失敗:', error);
      setLoadingState({
        isLoading: false,
        error: {
          code: 'DRAW_DAILY_CARD_ERROR',
          message: '抽取今日指導牌失敗',
          details: error,
        },
      });
      return null;
    }
  }, [hasDrawnToday]);

  /**
   * 獲取每日抽牌歷史記錄
   */
  const getDailyHistory = useCallback((limit?: number) => {
    try {
      return dailyCardService.getDailyCardHistory(limit);
    } catch (error) {
      console.error('獲取每日抽牌歷史失敗:', error);
      return [];
    }
  }, []);

  /**
   * 分析週期性運勢趨勢
   */
  const analyzeTrends = useCallback((days?: number) => {
    try {
      return dailyCardService.analyzeTrends(days);
    } catch (error) {
      console.error('分析運勢趨勢失敗:', error);
      return {
        period: '分析失敗',
        dominantSuit: '無資料',
        reversedPercentage: 0,
        majorArcanaCount: 0,
        trendSummary: '趨勢分析失敗',
        recommendations: [],
      };
    }
  }, []);

  /**
   * 重置錯誤狀態
   */
  const clearError = useCallback(() => {
    setLoadingState(prev => ({ ...prev, error: null }));
  }, []);

  // 組件掛載時檢查今日抽牌狀態
  useEffect(() => {
    checkTodayCard();
  }, [checkTodayCard]);

  return {
    // 狀態
    todayCard,
    hasDrawnToday,
    dailyStreak,
    isLoading: loadingState.isLoading,
    error: loadingState.error,

    // 方法
    drawTodayCard,
    checkTodayCard,
    getDailyHistory,
    analyzeTrends,
    clearError,
  };
}

/**
 * 每日抽牌歷史管理的自定義 Hook
 */
export function useDailyCardHistory(initialLimit: number = 30) {
  const [history, setHistory] = useState<DailyCardRecord[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });

  /**
   * 載入歷史記錄
   */
  const loadHistory = useCallback(async (limit: number = initialLimit) => {
    try {
      setLoadingState({ isLoading: true, error: null });
      
      const records = dailyCardService.getDailyCardHistory(limit);
      setHistory(records);
      
      setLoadingState({ isLoading: false, error: null });
    } catch (error) {
      console.error('載入每日抽牌歷史失敗:', error);
      setLoadingState({
        isLoading: false,
        error: {
          code: 'LOAD_HISTORY_ERROR',
          message: '載入歷史記錄失敗',
          details: error,
        },
      });
    }
  }, [initialLimit]);

  /**
   * 重新整理歷史記錄
   */
  const refreshHistory = useCallback(() => {
    loadHistory();
  }, [loadHistory]);

  /**
   * 根據日期範圍篩選記錄
   */
  const filterByDateRange = useCallback((startDate: Date, endDate: Date) => {
    const filtered = history.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });
    return filtered;
  }, [history]);

  /**
   * 根據花色篩選記錄
   */
  const filterBySuit = useCallback((suit: string) => {
    const filtered = history.filter(record => record.card.card.suit === suit);
    return filtered;
  }, [history]);

  /**
   * 根據正逆位篩選記錄
   */
  const filterByReversed = useCallback((isReversed: boolean) => {
    const filtered = history.filter(record => record.card.isReversed === isReversed);
    return filtered;
  }, [history]);

  // 組件掛載時載入歷史記錄
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    // 狀態
    history,
    isLoading: loadingState.isLoading,
    error: loadingState.error,

    // 方法
    loadHistory,
    refreshHistory,
    filterByDateRange,
    filterBySuit,
    filterByReversed,
  };
}

/**
 * 運勢趨勢分析的自定義 Hook
 */
export function useTrendAnalysis(defaultDays: number = 7) {
  const [trendData, setTrendData] = useState<{
    period: string;
    dominantSuit: string;
    reversedPercentage: number;
    majorArcanaCount: number;
    trendSummary: string;
    recommendations: string[];
  } | null>(null);
  
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });

  /**
   * 分析指定天數的趨勢
   */
  const analyzeTrends = useCallback(async (days: number = defaultDays) => {
    try {
      setLoadingState({ isLoading: true, error: null });
      
      const analysis = dailyCardService.analyzeTrends(days);
      setTrendData(analysis);
      
      setLoadingState({ isLoading: false, error: null });
      return analysis;
    } catch (error) {
      console.error('趨勢分析失敗:', error);
      setLoadingState({
        isLoading: false,
        error: {
          code: 'TREND_ANALYSIS_ERROR',
          message: '趨勢分析失敗',
          details: error,
        },
      });
      return null;
    }
  }, [defaultDays]);

  /**
   * 比較不同時期的趨勢
   */
  const compareTrends = useCallback(async (period1: number, period2: number) => {
    try {
      const trend1 = dailyCardService.analyzeTrends(period1);
      const trend2 = dailyCardService.analyzeTrends(period2);
      
      return {
        current: trend1,
        previous: trend2,
        comparison: {
          suitChanged: trend1.dominantSuit !== trend2.dominantSuit,
          reversedTrend: trend1.reversedPercentage - trend2.reversedPercentage,
          majorArcanaChange: trend1.majorArcanaCount - trend2.majorArcanaCount,
        },
      };
    } catch (error) {
      console.error('趨勢比較失敗:', error);
      return null;
    }
  }, []);

  // 組件掛載時進行初始分析
  useEffect(() => {
    analyzeTrends();
  }, [analyzeTrends]);

  return {
    // 狀態
    trendData,
    isLoading: loadingState.isLoading,
    error: loadingState.error,

    // 方法
    analyzeTrends,
    compareTrends,
  };
}
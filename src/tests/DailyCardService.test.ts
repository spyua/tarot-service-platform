import { describe, test, expect, beforeEach, vi } from 'vitest';
import { dailyCardService } from '../services/DailyCardService';
import { storageService } from '../services/StorageService';

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

// Mock global objects
global.localStorage = localStorageMock;

describe('DailyCardService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Initialize storage service
    storageService.clearAllData();
  });

  test('Should draw a daily card', () => {
    const dailyCard = dailyCardService.drawTodayCard();
    
    // Check if the card was drawn successfully
    expect(dailyCard).toBeDefined();
    expect(dailyCard.card).toBeDefined();
    expect(dailyCard.aspects).toBeDefined();
    expect(dailyCard.aspects.physical).toBeDefined();
    expect(dailyCard.aspects.emotional).toBeDefined();
    expect(dailyCard.aspects.spiritual).toBeDefined();
    
    // Check if the card was saved
    expect(dailyCardService.hasTodayCard()).toBe(true);
    
    // Check if getting today's card returns the same card
    const retrievedCard = dailyCardService.getTodayCard();
    expect(retrievedCard).toEqual(dailyCard);
  });

  test('Should not draw a new card if one already exists for today', () => {
    // Draw a card first
    const firstCard = dailyCardService.drawTodayCard();
    
    // Try to draw another card
    const secondCard = dailyCardService.drawTodayCard();
    
    // Should return the same card
    expect(secondCard).toEqual(firstCard);
  });

  test('Should analyze trends with no data', () => {
    const trends = dailyCardService.analyzeTrends();
    
    // Should return default values when no data
    expect(trends.dominantSuit).toBe('無資料');
    expect(trends.trendSummary).toBe('尚無足夠資料進行趨勢分析');
  });

  test('Should analyze trends with data', () => {
    // Draw a card for today
    dailyCardService.drawTodayCard();
    
    // Mock some past cards
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    // Manually add past cards to storage
    // This is just for testing - in real app, cards would be drawn on different days
    const mockPastCards = [
      {
        date: storageService.formatDate(yesterday),
        card: dailyCardService.drawTodayCard().card,
        aspects: dailyCardService.drawTodayCard().aspects,
      },
      {
        date: storageService.formatDate(twoDaysAgo),
        card: dailyCardService.drawTodayCard().card,
        aspects: dailyCardService.drawTodayCard().aspects,
      },
    ];
    
    // Add mock cards to storage
    mockPastCards.forEach(card => {
      storageService.saveDailyCard(card);
    });
    
    // Now analyze trends
    const trends = dailyCardService.analyzeTrends();
    
    // Should have actual data now
    expect(trends.dominantSuit).not.toBe('無資料');
    expect(trends.trendSummary).not.toBe('尚無足夠資料進行趨勢分析');
    expect(trends.aspectTrends.physical).not.toBe('尚無資料');
    expect(trends.aspectTrends.emotional).not.toBe('尚無資料');
    expect(trends.aspectTrends.spiritual).not.toBe('尚無資料');
  });

  test('Should compare trend periods', () => {
    // Draw cards for multiple days
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const mockCard = {
        date: storageService.formatDate(date),
        card: dailyCardService.drawTodayCard().card,
        aspects: dailyCardService.drawTodayCard().aspects,
      };
      storageService.saveDailyCard(mockCard);
    }
    
    // Compare 7-day periods
    const comparison = dailyCardService.compareTrendPeriods(7, 7);
    
    // Should have actual data
    expect(comparison.summary).not.toBe('尚無足夠資料進行趨勢比較分析');
    expect(comparison.currentPeriod).toBe('最近7天');
    expect(comparison.previousPeriod).toBe('前7天');
  });

  test('Should get monthly trends', () => {
    // Draw cards for multiple days
    for (let i = 0; i < 40; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const mockCard = {
        date: storageService.formatDate(date),
        card: dailyCardService.drawTodayCard().card,
        aspects: dailyCardService.drawTodayCard().aspects,
      };
      storageService.saveDailyCard(mockCard);
    }
    
    // Get monthly trends
    const monthlyTrends = dailyCardService.getMonthlyTrends();
    
    // Should have data for both months
    expect(monthlyTrends.currentMonth.analysis.trendSummary).not.toBe('尚無足夠資料進行趨勢分析');
    expect(monthlyTrends.previousMonth.analysis.trendSummary).not.toBe('尚無足夠資料進行趨勢分析');
    expect(monthlyTrends.comparison.summary).not.toBe('尚無足夠資料進行趨勢比較分析');
  });

  test('Should export daily card history', () => {
    // Draw cards for multiple days
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const mockCard = {
        date: storageService.formatDate(date),
        card: dailyCardService.drawTodayCard().card,
        aspects: dailyCardService.drawTodayCard().aspects,
      };
      storageService.saveDailyCard(mockCard);
    }
    
    // Export as JSON
    const jsonExport = dailyCardService.exportDailyCardHistory('json', 5);
    expect(jsonExport).toBeDefined();
    expect(JSON.parse(jsonExport).length).toBe(5);
    
    // Export as text
    const textExport = dailyCardService.exportDailyCardHistory('text', 5);
    expect(textExport).toBeDefined();
    expect(textExport.startsWith('每日塔羅牌歷史記錄')).toBe(true);
  });
});
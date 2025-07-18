import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService } from '../services/StorageService';
import { ReadingResult, DailyCardRecord, UserPreferences } from '../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Mock global localStorage
vi.stubGlobal('localStorage', localStorageMock);

describe('StorageService', () => {
  let storageService: StorageService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    // Create a new instance for each test
    storageService = new StorageService();
  });

  it('should initialize with default data', () => {
    const data = storageService.getData();
    expect(data).not.toBeNull();
    expect(data?.readings).toEqual([]);
    expect(data?.dailyCards).toEqual([]);
    expect(data?.userPreferences).toEqual({
      language: 'zh-TW',
      theme: 'light',
      animations: true,
      notifications: true,
    });
    expect(data?.lastCleanup).toBeDefined();
  });

  it('should save and retrieve reading results', () => {
    const mockReading: ReadingResult = {
      id: 'test-id',
      timestamp: Date.now(),
      type: 'free',
      cards: [
        {
          card: {
            id: 'major_00',
            name: '愚者',
            nameEn: 'The Fool',
            suit: 'major',
            number: 0,
            image: '/images/cards/major_00.jpg',
            meanings: {
              upright: {
                keywords: ['新開始', '冒險'],
                keywordsEn: ['new beginning', 'adventure'],
                description: '描述',
                descriptionEn: 'Description',
                love: '愛情',
                loveEn: 'Love',
                career: '事業',
                careerEn: 'Career',
                health: '健康',
                healthEn: 'Health',
                spiritual: '靈性',
                spiritualEn: 'Spiritual',
              },
              reversed: {
                keywords: ['魯莽', '風險'],
                keywordsEn: ['reckless', 'risk'],
                description: '逆位描述',
                descriptionEn: 'Reversed description',
                love: '逆位愛情',
                loveEn: 'Reversed love',
                career: '逆位事業',
                careerEn: 'Reversed career',
                health: '逆位健康',
                healthEn: 'Reversed health',
                spiritual: '逆位靈性',
                spiritualEn: 'Reversed spiritual',
              },
            },
          },
          position: 1,
          isReversed: false,
        },
      ],
      interpretation: '解釋文字',
    };

    // Save reading
    storageService.saveReading(mockReading);

    // Retrieve all readings
    const readings = storageService.getAllReadings();
    expect(readings).toHaveLength(1);
    expect(readings[0].id).toBe('test-id');

    // Retrieve by ID
    const reading = storageService.getReadingById('test-id');
    expect(reading).toBeDefined();
    expect(reading?.id).toBe('test-id');

    // Delete reading
    const deleted = storageService.deleteReading('test-id');
    expect(deleted).toBe(true);
    expect(storageService.getAllReadings()).toHaveLength(0);
  });

  it('should manage daily card records', () => {
    const today = storageService.formatDate(new Date());
    const mockDailyCard: DailyCardRecord = {
      date: today,
      card: {
        card: {
          id: 'major_01',
          name: '魔術師',
          nameEn: 'The Magician',
          suit: 'major',
          number: 1,
          image: '/images/cards/major_01.jpg',
          meanings: {
            upright: {
              keywords: ['創造力', '技能'],
              keywordsEn: ['creativity', 'skill'],
              description: '描述',
              descriptionEn: 'Description',
              love: '愛情',
              loveEn: 'Love',
              career: '事業',
              careerEn: 'Career',
              health: '健康',
              healthEn: 'Health',
              spiritual: '靈性',
              spiritualEn: 'Spiritual',
            },
            reversed: {
              keywords: ['操控', '欺騙'],
              keywordsEn: ['manipulation', 'deception'],
              description: '逆位描述',
              descriptionEn: 'Reversed description',
              love: '逆位愛情',
              loveEn: 'Reversed love',
              career: '逆位事業',
              careerEn: 'Reversed career',
              health: '逆位健康',
              healthEn: 'Reversed health',
              spiritual: '逆位靈性',
              spiritualEn: 'Reversed spiritual',
            },
          },
        },
        position: 1,
        isReversed: false,
      },
      aspects: {
        physical: '身體健康良好',
        emotional: '情緒穩定',
        spiritual: '靈性成長',
      },
    };

    // Save daily card
    storageService.saveDailyCard(mockDailyCard);

    // Check if today has card
    expect(storageService.hasTodayCard()).toBe(true);

    // Get today's card
    const dailyCard = storageService.getDailyCard(today);
    expect(dailyCard).toBeDefined();
    expect(dailyCard?.date).toBe(today);

    // Get all daily cards
    const allDailyCards = storageService.getAllDailyCards();
    expect(allDailyCards).toHaveLength(1);
  });

  it('should manage user preferences', () => {
    const mockPreferences: UserPreferences = {
      language: 'en',
      theme: 'dark',
      animations: false,
      notifications: false,
    };

    // Save preferences
    storageService.saveUserPreferences(mockPreferences);

    // Get preferences
    const preferences = storageService.getUserPreferences();
    expect(preferences).toEqual(mockPreferences);
  });

  it('should handle data export and import', () => {
    // Save some data first
    const mockPreferences: UserPreferences = {
      language: 'en',
      theme: 'dark',
      animations: false,
      notifications: false,
    };
    storageService.saveUserPreferences(mockPreferences);

    // Export data
    const exportedData = storageService.exportData();
    expect(exportedData).toBeTruthy();

    // Clear data
    storageService.clearAllData();
    expect(storageService.getUserPreferences().language).toBe('zh-TW');

    // Import data
    const imported = storageService.importData(exportedData);
    expect(imported).toBe(true);
    expect(storageService.getUserPreferences().language).toBe('en');
  });

  it('should clean up old records', () => {
    // Mock Date.now to return a specific timestamp
    const now = Date.now();
    const thirtyOneDaysAgo = now - 31 * 24 * 60 * 60 * 1000;

    // Create a spy on Date.now
    const dateNowSpy = vi.spyOn(Date, 'now');
    dateNowSpy.mockReturnValue(now);

    // Add an old reading
    const oldReading: ReadingResult = {
      id: 'old-reading',
      timestamp: thirtyOneDaysAgo,
      type: 'free',
      cards: [],
      interpretation: '',
    };

    // Add a new reading
    const newReading: ReadingResult = {
      id: 'new-reading',
      timestamp: now,
      type: 'free',
      cards: [],
      interpretation: '',
    };

    storageService.saveReading(oldReading);
    storageService.saveReading(newReading);

    // Force cleanup by setting lastCleanup to a week ago
    const data = storageService.getData();
    if (data) {
      data.lastCleanup = now - 8 * 24 * 60 * 60 * 1000;
      localStorageMock.setItem('tarot_app_data', JSON.stringify(data));
    }

    // Create a new instance to trigger cleanup
    storageService = new StorageService();

    // Check that old reading was removed
    const readings = storageService.getAllReadings();
    expect(readings).toHaveLength(1);
    expect(readings[0].id).toBe('new-reading');

    // Restore the original Date.now
    dateNowSpy.mockRestore();
  });

  it('should handle storage full error', () => {
    // Mock setItem to throw QuotaExceededError
    const setItemSpy = vi.spyOn(localStorageMock, 'setItem');
    setItemSpy.mockImplementationOnce(() => {
      const error = new DOMException(
        'QuotaExceededError',
        'QuotaExceededError'
      );
      throw error;
    });

    // Add many readings to trigger the error
    for (let i = 0; i < 20; i++) {
      const reading: ReadingResult = {
        id: `reading-${i}`,
        timestamp: Date.now(),
        type: 'free',
        cards: [],
        interpretation: '',
      };
      storageService.saveReading(reading);
    }

    // The service should handle the error without crashing
    expect(setItemSpy).toHaveBeenCalled();
  });
});

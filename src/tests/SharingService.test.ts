import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SharingService } from '../services/SharingService';
import { PrivacyManager } from '../services/PrivacyManager';
import { ReadingResult, ShareOptions } from '../types';
import * as imageUtils from '../utils/imageUtils';

// Mock the imageUtils module
vi.mock('../utils/imageUtils', () => ({
  generateShareImage: vi.fn().mockResolvedValue('mock-image-url'),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock navigator.clipboard
Object.defineProperty(window, 'navigator', {
  value: {
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  },
  writable: true,
});

// Mock window.open
Object.defineProperty(window, 'open', {
  value: vi.fn().mockReturnValue({}),
  writable: true,
});

describe('SharingService', () => {
  let sharingService: SharingService;
  let privacyManager: PrivacyManager;

  beforeEach(() => {
    vi.clearAllMocks();
    privacyManager = new PrivacyManager();
    sharingService = new SharingService(privacyManager);

    // Mock privacy settings to allow sharing
    vi.spyOn(privacyManager, 'canShare').mockReturnValue(true);
    vi.spyOn(privacyManager, 'canShareCardNames').mockReturnValue(true);
    vi.spyOn(privacyManager, 'canShareInterpretation').mockReturnValue(true);
    vi.spyOn(privacyManager, 'canShareQuestion').mockReturnValue(true);
  });

  describe('generateShareContent', () => {
    it('should generate share content with all options enabled', async () => {
      // Create mock reading result
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
              meanings: {} as any,
            },
            position: 1,
            isReversed: false,
          },
        ],
        interpretation: '這是一個測試解讀',
        question: '這是一個測試問題',
      };

      // Create share options
      const shareOptions: ShareOptions = {
        platform: 'facebook',
        includeImage: true,
        includeInterpretation: true,
        includeQuestion: true,
      };

      // Generate share content
      const shareContent = await sharingService.generateShareContent(
        mockReading,
        shareOptions
      );

      // Verify the result
      expect(shareContent).not.toBeNull();
      expect(shareContent?.text).toContain('我的塔羅占卜結果');
      expect(shareContent?.text).toContain('愚者');
      expect(shareContent?.text).toContain('這是一個測試問題');
      expect(shareContent?.text).toContain('這是一個測試解讀');
      expect(shareContent?.imageUrl).toBe('mock-image-url');

      // Verify generateShareImage was called
      expect(imageUtils.generateShareImage).toHaveBeenCalledWith(
        mockReading.cards,
        '我的塔羅占卜結果'
      );
    });

    it('should respect privacy settings', async () => {
      // Mock privacy settings to disallow sharing interpretation and question
      vi.spyOn(privacyManager, 'canShareInterpretation').mockReturnValue(false);
      vi.spyOn(privacyManager, 'canShareQuestion').mockReturnValue(false);

      // Create mock reading result
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
              meanings: {} as any,
            },
            position: 1,
            isReversed: false,
          },
        ],
        interpretation: '這是一個測試解讀',
        question: '這是一個測試問題',
      };

      // Create share options
      const shareOptions: ShareOptions = {
        platform: 'facebook',
        includeImage: true,
        includeInterpretation: true,
        includeQuestion: true,
      };

      // Generate share content
      const shareContent = await sharingService.generateShareContent(
        mockReading,
        shareOptions
      );

      // Verify the result
      expect(shareContent).not.toBeNull();
      expect(shareContent?.text).toContain('我的塔羅占卜結果');
      expect(shareContent?.text).toContain('愚者');
      expect(shareContent?.text).not.toContain('這是一個測試問題');
      expect(shareContent?.text).not.toContain('這是一個測試解讀');
    });

    it('should return null if sharing is disabled', async () => {
      // Mock privacy settings to disallow sharing
      vi.spyOn(privacyManager, 'canShare').mockReturnValue(false);

      // Create mock reading result
      const mockReading: ReadingResult = {
        id: 'test-id',
        timestamp: Date.now(),
        type: 'free',
        cards: [],
        interpretation: '',
      };

      // Create share options
      const shareOptions: ShareOptions = {
        platform: 'facebook',
        includeImage: true,
        includeInterpretation: true,
        includeQuestion: true,
      };

      // Generate share content
      const shareContent = await sharingService.generateShareContent(
        mockReading,
        shareOptions
      );

      // Verify the result
      expect(shareContent).toBeNull();
    });
  });

  describe('share', () => {
    it('should share to Facebook', async () => {
      const shareContent = {
        text: '測試分享內容',
        url: 'https://example.com',
      };

      const result = await sharingService.share('facebook', shareContent);

      expect(result).toBe(true);
      expect(window.open).toHaveBeenCalled();
    });

    it('should share to Twitter', async () => {
      const shareContent = {
        text: '測試分享內容',
        url: 'https://example.com',
      };

      const result = await sharingService.share('twitter', shareContent);

      expect(result).toBe(true);
      expect(window.open).toHaveBeenCalled();
    });

    it('should copy to clipboard', async () => {
      const shareContent = {
        text: '測試分享內容',
        url: 'https://example.com',
      };

      const result = await sharingService.share('copy', shareContent);

      expect(result).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        '測試分享內容'
      );
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateShareImage } from '../utils/imageUtils';
import { DrawnCard, TarotCard } from '../types';

// Mock the canvas and image functionality
const mockCanvas = {
  getContext: vi.fn(),
  width: 0,
  height: 0,
  toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mockImageData'),
};

const mockContext = {
  fillStyle: '',
  fillRect: vi.fn(),
  createLinearGradient: vi.fn().mockReturnValue({
    addColorStop: vi.fn(),
  }),
  font: '',
  textAlign: '',
  fillText: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  drawImage: vi.fn(),
};

const mockImage = {
  onload: null as any,
  onerror: null as any,
  src: '',
  crossOrigin: '',
};

// Mock document.createElement
vi.spyOn(document, 'createElement').mockImplementation(tag => {
  if (tag === 'canvas') {
    return mockCanvas as any;
  }
  if (tag === 'img') {
    return { ...mockImage } as any;
  }
  return {} as any;
});

// Mock canvas context
mockCanvas.getContext.mockReturnValue(mockContext);

describe('imageUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateShareImage', () => {
    it('should generate a share image', async () => {
      // Create mock tarot cards
      const mockTarotCard: TarotCard = {
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
            description: '愚者代表新的開始',
            descriptionEn: 'The Fool represents new beginnings',
            love: '愛情方面的解釋',
            loveEn: 'Love interpretation',
            career: '事業方面的解釋',
            careerEn: 'Career interpretation',
            health: '健康方面的解釋',
            healthEn: 'Health interpretation',
            spiritual: '靈性方面的解釋',
            spiritualEn: 'Spiritual interpretation',
          },
          reversed: {
            keywords: ['魯莽', '缺乏計劃'],
            keywordsEn: ['recklessness', 'lack of planning'],
            description: '逆位的愚者警告不要過於衝動',
            descriptionEn: 'The reversed Fool warns against impulsiveness',
            love: '愛情方面的解釋（逆位）',
            loveEn: 'Love interpretation (reversed)',
            career: '事業方面的解釋（逆位）',
            careerEn: 'Career interpretation (reversed)',
            health: '健康方面的解釋（逆位）',
            healthEn: 'Health interpretation (reversed)',
            spiritual: '靈性方面的解釋（逆位）',
            spiritualEn: 'Spiritual interpretation (reversed)',
          },
        },
      };

      const mockDrawnCards: DrawnCard[] = [
        {
          card: mockTarotCard,
          position: 1,
          isReversed: false,
          positionMeaning: '過去',
        },
        {
          card: mockTarotCard,
          position: 2,
          isReversed: true,
          positionMeaning: '現在',
        },
      ];

      // Mock the image loading process
      global.Image = class {
        onload: () => void = () => {};
        onerror: () => void = () => {};
        src: string = '';
        crossOrigin: string = '';

        constructor() {
          setTimeout(() => this.onload(), 10);
        }
      } as any;

      // Call the function
      const result = await generateShareImage(
        mockDrawnCards,
        '我的塔羅占卜結果'
      );

      // Verify the result
      expect(result).toBe('data:image/png;base64,mockImageData');

      // Verify canvas was created and configured
      expect(document.createElement).toHaveBeenCalledWith('canvas');
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');

      // Verify drawing operations
      expect(mockContext.fillRect).toHaveBeenCalled();
      expect(mockContext.fillText).toHaveBeenCalled();
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
    });

    it('should handle errors during image generation', async () => {
      // Mock canvas toDataURL to throw an error
      mockCanvas.toDataURL.mockImplementationOnce(() => {
        throw new Error('Canvas error');
      });

      const mockTarotCard: TarotCard = {
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
            description: '愚者代表新的開始',
            descriptionEn: 'The Fool represents new beginnings',
            love: '愛情方面的解釋',
            loveEn: 'Love interpretation',
            career: '事業方面的解釋',
            careerEn: 'Career interpretation',
            health: '健康方面的解釋',
            healthEn: 'Health interpretation',
            spiritual: '靈性方面的解釋',
            spiritualEn: 'Spiritual interpretation',
          },
          reversed: {
            keywords: ['魯莽', '缺乏計劃'],
            keywordsEn: ['recklessness', 'lack of planning'],
            description: '逆位的愚者警告不要過於衝動',
            descriptionEn: 'The reversed Fool warns against impulsiveness',
            love: '愛情方面的解釋（逆位）',
            loveEn: 'Love interpretation (reversed)',
            career: '事業方面的解釋（逆位）',
            careerEn: 'Career interpretation (reversed)',
            health: '健康方面的解釋（逆位）',
            healthEn: 'Health interpretation (reversed)',
            spiritual: '靈性方面的解釋（逆位）',
            spiritualEn: 'Spiritual interpretation (reversed)',
          },
        },
      };

      const mockDrawnCards: DrawnCard[] = [
        {
          card: mockTarotCard,
          position: 1,
          isReversed: false,
        },
      ];

      // Mock the image loading process
      global.Image = class {
        onload: () => void = () => {};
        onerror: () => void = () => {};
        src: string = '';
        crossOrigin: string = '';

        constructor() {
          setTimeout(() => this.onload(), 10);
        }
      } as any;

      // Expect the function to throw an error
      await expect(generateShareImage(mockDrawnCards, '測試')).rejects.toThrow(
        '生成分享圖片失敗'
      );
    });
  });
});

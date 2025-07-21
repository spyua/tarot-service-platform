import { DrawnCard } from '../types';

/**
 * 圖片格式類型
 */
export type ImageFormat = 'webp' | 'jpg' | 'png' | 'avif';

/**
 * 圖片尺寸類型
 */
export type ImageSize = 'small' | 'medium' | 'large' | 'original';

/**
 * 圖片尺寸配置
 */
export const IMAGE_SIZES = {
  small: 300,
  medium: 600,
  large: 1000,
  original: 2000,
};

/**
 * 圖片快取管理器
 */
class ImageCache {
  private static instance: ImageCache;
  private cache: Map<string, HTMLImageElement> = new Map();
  private inProgress: Map<string, Promise<HTMLImageElement>> = new Map();
  private maxSize: number = 100; // 最大快取數量

  private constructor() {}

  /**
   * 獲取單例實例
   */
  public static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache();
    }
    return ImageCache.instance;
  }

  /**
   * 設置最大快取數量
   */
  public setMaxSize(size: number): void {
    this.maxSize = size;
    this.cleanup();
  }

  /**
   * 從快取中獲取圖片
   */
  public get(src: string): HTMLImageElement | undefined {
    return this.cache.get(src);
  }

  /**
   * 檢查圖片是否在快取中
   */
  public has(src: string): boolean {
    return this.cache.has(src);
  }

  /**
   * 將圖片添加到快取
   */
  public set(src: string, img: HTMLImageElement): void {
    this.cache.set(src, img);
    this.cleanup();
  }

  /**
   * 清理超出大小的快取
   */
  private cleanup(): void {
    if (this.cache.size <= this.maxSize) return;

    // 移除最舊的項目
    const keysToDelete = Array.from(this.cache.keys()).slice(
      0,
      this.cache.size - this.maxSize
    );
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * 預載入圖片並加入快取
   */
  public preload(
    src: string,
    options?: { priority?: boolean; retries?: number }
  ): Promise<HTMLImageElement> {
    const { priority = false, retries = 2 } = options || {};

    // 如果已經在快取中，直接返回
    if (this.cache.has(src)) {
      return Promise.resolve(this.cache.get(src)!);
    }

    // 如果正在載入中，返回進行中的 Promise
    if (this.inProgress.has(src)) {
      return this.inProgress.get(src)!;
    }

    // 創建新的載入 Promise
    const loadPromise = this.loadImage(src, retries);

    // 如果是高優先級，不存儲進行中的 Promise
    if (!priority) {
      this.inProgress.set(src, loadPromise);
    }

    // 完成後從進行中列表移除
    loadPromise
      .then(img => {
        this.cache.set(src, img);
        this.inProgress.delete(src);
        return img;
      })
      .catch(() => {
        this.inProgress.delete(src);
      });

    return loadPromise;
  }

  /**
   * 載入圖片
   */
  private loadImage(
    src: string,
    retries: number = 2
  ): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // 允許跨域圖片

      img.onload = () => resolve(img);

      img.onerror = () => {
        if (retries > 0) {
          // 添加隨機參數避免快取
          const retrySrc = `${src}${src.includes('?') ? '&' : '?'}retry=${Date.now()}`;
          this.loadImage(retrySrc, retries - 1)
            .then(resolve)
            .catch(reject);
        } else {
          reject(new Error(`無法載入圖片: ${src}`));
        }
      };

      img.src = src;
    });
  }

  /**
   * 清除快取
   */
  public clear(): void {
    this.cache.clear();
    this.inProgress.clear();
  }
}

/**
 * 獲取圖片快取實例
 */
export const getImageCache = (): ImageCache => {
  return ImageCache.getInstance();
};

/**
 * 載入圖片
 */
export const loadImage = (
  src: string,
  options?: { priority?: boolean; retries?: number }
): Promise<HTMLImageElement> => {
  return ImageCache.getInstance().preload(src, options);
};

/**
 * 檢測瀏覽器是否支援特定圖片格式
 */
export const supportsImageFormat = (format: ImageFormat): boolean => {
  const formats: Record<ImageFormat, string> = {
    webp: 'image/webp',
    avif: 'image/avif',
    jpg: 'image/jpeg',
    png: 'image/png',
  };

  // 檢查是否在瀏覽器環境
  if (typeof document === 'undefined') return false;

  // 創建一個測試元素
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  // Test WebP support by creating a data URL
  if (format === 'webp') {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // Test AVIF support (limited browser support)
  if (format === 'avif') {
    try {
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    } catch {
      return false;
    }
  }

  // JPG and PNG are universally supported
  return true;
};

/**
 * 獲取最佳圖片格式
 */
export const getBestImageFormat = (): ImageFormat => {
  if (supportsImageFormat('avif')) return 'avif';
  if (supportsImageFormat('webp')) return 'webp';
  return 'jpg';
};

/**
 * 生成響應式圖片路徑
 */
export const getResponsiveImagePath = (
  src: string,
  size: ImageSize = 'original',
  format?: ImageFormat
): string => {
  // 如果沒有指定格式，使用最佳格式
  const bestFormat = format || getBestImageFormat();

  // 解析原始路徑
  const lastDotIndex = src.lastIndexOf('.');
  if (lastDotIndex === -1) return src;

  const basePath = src.substring(0, lastDotIndex);

  // 如果是原始尺寸，只轉換格式
  if (size === 'original') {
    return `${basePath}.${bestFormat}`;
  }

  // 返回指定尺寸和格式的路徑
  return `${basePath}-${size}.${bestFormat}`;
};

/**
 * 生成 srcset 屬性
 */
export const generateSrcSet = (src: string, format?: ImageFormat): string => {
  const bestFormat = format || getBestImageFormat();

  // 解析原始路徑
  const lastDotIndex = src.lastIndexOf('.');
  if (lastDotIndex === -1) return src;

  const basePath = src.substring(0, lastDotIndex);

  // 生成不同尺寸的 srcset
  return [
    `${basePath}-small.${bestFormat} ${IMAGE_SIZES.small}w`,
    `${basePath}-medium.${bestFormat} ${IMAGE_SIZES.medium}w`,
    `${basePath}-large.${bestFormat} ${IMAGE_SIZES.large}w`,
    `${basePath}.${bestFormat} ${IMAGE_SIZES.original}w`,
  ].join(', ');
};

/**
 * 預載入多個圖片
 */
export const preloadImages = (
  srcs: string[],
  options?: {
    onProgress?: (loaded: number, total: number) => void;
    batchSize?: number;
    priority?: string[];
  }
): Promise<void> => {
  const { onProgress, batchSize = 5, priority = [] } = options || {};
  const imageCache = getImageCache();

  // 按優先級排序
  const sortedSrcs = [...srcs].sort((a, b) => {
    const aIndex = priority.indexOf(a);
    const bIndex = priority.indexOf(b);

    if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
    if (aIndex >= 0) return -1;
    if (bIndex >= 0) return 1;
    return 0;
  });

  let loadedCount = 0;
  const total = sortedSrcs.length;

  // 批次載入圖片
  const loadBatch = async (startIndex: number): Promise<void> => {
    const batch = sortedSrcs.slice(startIndex, startIndex + batchSize);
    if (batch.length === 0) return;

    await Promise.all(
      batch.map(src =>
        imageCache
          .preload(src)
          .then(() => {
            loadedCount++;
            onProgress?.(loadedCount, total);
          })
          .catch(() => {
            loadedCount++;
            onProgress?.(loadedCount, total);
          })
      )
    );

    if (startIndex + batchSize < total) {
      // 小延遲避免瀏覽器過載
      await new Promise(resolve => setTimeout(resolve, 100));
      return loadBatch(startIndex + batchSize);
    }
  };

  return loadBatch(0);
};

/**
 * 生成分享圖片
 * 使用 HTML5 Canvas 創建塔羅牌分享圖片
 */
export const generateShareImage = async (
  cards: DrawnCard[],
  title: string = '我的塔羅占卜結果'
): Promise<string> => {
  // 創建 canvas 元素
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('無法創建 Canvas 上下文');
  }

  // 設定 canvas 尺寸
  const width = 1200;
  const height = 630; // 適合社交媒體分享的尺寸
  canvas.width = width;
  canvas.height = height;

  // 繪製背景
  ctx.fillStyle = '#1a1a2e'; // 深藍色背景
  ctx.fillRect(0, 0, width, height);

  // 添加漸變效果
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)'); // 紫色
  gradient.addColorStop(1, 'rgba(245, 158, 11, 0.3)'); // 金色
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 添加標題
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Noto Serif TC", serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, 100);

  // 添加日期
  const date = new Date();
  const dateStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  ctx.font = '24px "Inter", sans-serif';
  ctx.fillText(dateStr, width / 2, 150);

  // 繪製卡牌
  await drawCards(ctx, cards, width, height);

  // 添加水印
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '20px "Inter", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('塔羅占卜網頁應用程式', width - 40, height - 30);

  // 轉換為圖片 URL
  try {
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('生成分享圖片失敗:', error);
    throw new Error('生成分享圖片失敗');
  }
};

/**
 * 繪製卡牌到 Canvas
 */
const drawCards = async (
  ctx: CanvasRenderingContext2D,
  cards: DrawnCard[],
  canvasWidth: number,
  canvasHeight: number
): Promise<void> => {
  // 根據卡牌數量計算佈局
  const cardWidth = 180;
  const cardHeight = 320;
  const padding = 20;
  const startY = 200;

  // 計算卡牌的總寬度
  const totalCardsWidth =
    cards.length * cardWidth + (cards.length - 1) * padding;

  // 計算起始 X 座標，使卡牌居中
  let startX = (canvasWidth - totalCardsWidth) / 2;

  // 載入並繪製每張卡牌
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const x = startX + i * (cardWidth + padding);
    const y = startY;

    // 載入卡牌圖片
    try {
      // 使用優化後的圖片載入函數
      const image = await loadImage(card.card.image, { priority: true });

      // 保存當前繪圖狀態
      ctx.save();

      // 如果是逆位，旋轉 180 度
      if (card.isReversed) {
        ctx.translate(x + cardWidth / 2, y + cardHeight / 2);
        ctx.rotate(Math.PI);
        ctx.translate(-(x + cardWidth / 2), -(y + cardHeight / 2));
      }

      // 繪製卡牌圖片
      ctx.drawImage(image, x, y, cardWidth, cardHeight);

      // 恢復繪圖狀態
      ctx.restore();

      // 繪製卡牌名稱
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Noto Serif TC", serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${card.card.name}${card.isReversed ? ' (逆位)' : ''}`,
        x + cardWidth / 2,
        y + cardHeight + 30
      );
    } catch (error) {
      console.error(`載入卡牌圖片失敗: ${card.card.id}`, error);

      // 繪製佔位符
      ctx.fillStyle = '#333333';
      ctx.fillRect(x, y, cardWidth, cardHeight);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(card.card.name, x + cardWidth / 2, y + cardHeight / 2);
    }
  }
};

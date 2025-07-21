import { DrawnCard } from '../types';

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
      const image = await loadImage(card.card.image);

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

/**
 * 載入圖片
 */
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // 允許跨域圖片
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`無法載入圖片: ${src}`));
    img.src = src;
  });
};

import { ReadingResult, ShareOptions, ShareContent, SharePlatform } from '../types';
import { PrivacyManager } from './PrivacyManager';

/**
 * 社群分享服務
 * 負責處理各種社交媒體平台的分享功能
 */
export class SharingService {
  private privacyManager: PrivacyManager;

  constructor(privacyManager: PrivacyManager) {
    this.privacyManager = privacyManager;
  }

  /**
   * 生成分享內容
   */
  public generateShareContent(reading: ReadingResult, options: ShareOptions): ShareContent | null {
    // 檢查是否允許分享
    if (!this.privacyManager.canShare()) {
      return null;
    }

    const { cards, interpretation } = reading;
    
    // 基本分享文字
    let text = '我的塔羅占卜結果：\n';
    
    // 根據隱私設定添加牌名
    if (options.includeImage && this.privacyManager.canShareCardNames()) {
      const cardNames = cards.map(c => 
        `${c.card.name}${c.isReversed ? '(逆位)' : ''}`
      ).join('、');
      text += `抽到的牌：${cardNames}\n`;
    }
    
    // 根據隱私設定和選項添加解讀
    if (options.includeInterpretation && this.privacyManager.canShareInterpretation()) {
      text += `解讀：${this.truncateText(interpretation, 100)}\n`;
    }
    
    // 添加應用程式連結和標籤
    text += '\n透過塔羅占卜網頁應用程式獲取您的占卜 #塔羅占卜 #TarotReading';
    
    return {
      text,
      imageUrl: options.includeImage ? this.generateShareImageUrl(cards) : undefined,
      url: window.location.origin
    };
  }

  /**
   * 執行分享到指定平台
   */
  public async share(platform: SharePlatform, content: ShareContent): Promise<boolean> {
    try {
      switch (platform) {
        case 'facebook':
          return await this.shareToFacebook(content);
        case 'twitter':
          return await this.shareToTwitter(content);
        case 'line':
          return await this.shareToLine(content);
        case 'instagram':
          return await this.shareToInstagram(content);
        case 'copy':
          return await this.copyToClipboard(content.text);
        default:
          return false;
      }
    } catch (error) {
      console.error(`分享到 ${platform} 失敗:`, error);
      return false;
    }
  }

  /**
   * 分享到 Facebook
   */
  private async shareToFacebook(content: ShareContent): Promise<boolean> {
    const url = encodeURIComponent(content.url || window.location.href);
    const text = encodeURIComponent(content.text);
    
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
    
    return this.openShareWindow(shareUrl, 'Facebook');
  }

  /**
   * 分享到 Twitter
   */
  private async shareToTwitter(content: ShareContent): Promise<boolean> {
    const text = encodeURIComponent(content.text);
    const url = encodeURIComponent(content.url || window.location.href);
    
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    
    return this.openShareWindow(shareUrl, 'Twitter');
  }

  /**
   * 分享到 LINE
   */
  private async shareToLine(content: ShareContent): Promise<boolean> {
    const text = encodeURIComponent(`${content.text}\n${content.url || window.location.href}`);
    
    const shareUrl = `https://social-plugins.line.me/lineit/share?url=${text}`;
    
    return this.openShareWindow(shareUrl, 'LINE');
  }

  /**
   * 分享到 Instagram（實際上是複製文字，因為 Instagram 不支援直接分享）
   */
  private async shareToInstagram(content: ShareContent): Promise<boolean> {
    // Instagram 不支援直接分享文字，所以複製到剪貼簿
    const success = await this.copyToClipboard(content.text);
    
    if (success) {
      // 可以顯示提示訊息告訴用戶已複製到剪貼簿
      alert('內容已複製到剪貼簿！請前往 Instagram 應用程式貼上分享。');
    }
    
    return success;
  }

  /**
   * 複製到剪貼簿
   */
  private async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // 使用現代 Clipboard API
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // 降級方案：使用傳統方法
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        return success;
      }
    } catch (error) {
      console.error('複製到剪貼簿失敗:', error);
      return false;
    }
  }

  /**
   * 開啟分享視窗
   */
  private openShareWindow(url: string, platform: string): boolean {
    try {
      const width = 600;
      const height = 400;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      
      const features = `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`;
      
      const shareWindow = window.open(url, `share_${platform}`, features);
      
      return shareWindow !== null;
    } catch (error) {
      console.error(`開啟 ${platform} 分享視窗失敗:`, error);
      return false;
    }
  }

  /**
   * 截斷文字到指定長度
   */
  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  /**
   * 生成分享圖片 URL（簡化版本）
   */
  private generateShareImageUrl(cards: any[]): string {
    // 這裡可以實作生成分享圖片的邏輯
    // 目前返回一個佔位符 URL
    const cardIds = cards.map(c => `${c.card.id},${c.isReversed ? 1 : 0}`).join('-');
    return `/api/generate-share-image?cards=${cardIds}`;
  }

  /**
   * 檢查平台是否可用
   */
  public isPlatformAvailable(platform: SharePlatform): boolean {
    switch (platform) {
      case 'copy':
        return true; // 複製功能總是可用
      case 'facebook':
      case 'twitter':
      case 'line':
        return true; // 這些平台通過 URL 分享，總是可用
      case 'instagram':
        return true; // 通過複製文字的方式支援
      default:
        return false;
    }
  }

  /**
   * 獲取平台顯示名稱
   */
  public getPlatformDisplayName(platform: SharePlatform): string {
    const names: Record<SharePlatform, string> = {
      facebook: 'Facebook',
      twitter: 'Twitter',
      instagram: 'Instagram',
      line: 'LINE',
      copy: '複製連結'
    };
    
    return names[platform] || platform;
  }

  /**
   * 獲取平台圖示類名（假設使用 Font Awesome 或類似圖示庫）
   */
  public getPlatformIcon(platform: SharePlatform): string {
    const icons: Record<SharePlatform, string> = {
      facebook: 'fab fa-facebook-f',
      twitter: 'fab fa-twitter',
      instagram: 'fab fa-instagram',
      line: 'fab fa-line',
      copy: 'fas fa-copy'
    };
    
    return icons[platform] || 'fas fa-share';
  }
}

// 創建單例實例
export const sharingService = new SharingService(new PrivacyManager());
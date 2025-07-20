import { PrivacySettings } from '../types';

/**
 * 隱私管理服務
 * 負責管理用戶的隱私設定和分享權限
 */
export class PrivacyManager {
  private readonly PRIVACY_STORAGE_KEY = 'tarot_privacy_settings';
  
  // 預設隱私設定
  private readonly defaultSettings: PrivacySettings = {
    allowSharing: true,
    shareCardNames: true,
    shareInterpretation: false,
    shareQuestion: false,
    anonymousAnalytics: true,
  };

  private settings: PrivacySettings;

  constructor() {
    this.settings = this.loadSettings();
  }

  /**
   * 載入用戶隱私設定
   */
  private loadSettings(): PrivacySettings {
    try {
      const stored = localStorage.getItem(this.PRIVACY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<PrivacySettings>;
        return { ...this.defaultSettings, ...parsed };
      }
    } catch (error) {
      console.error('載入隱私設定失敗:', error);
    }
    
    return { ...this.defaultSettings };
  }

  /**
   * 保存用戶隱私設定
   */
  public saveSettings(settings: Partial<PrivacySettings>): void {
    this.settings = { ...this.settings, ...settings };
    
    try {
      localStorage.setItem(this.PRIVACY_STORAGE_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('保存隱私設定失敗:', error);
    }
  }

  /**
   * 獲取當前隱私設定
   */
  public getSettings(): PrivacySettings {
    return { ...this.settings };
  }

  /**
   * 檢查是否允許分享
   */
  public canShare(): boolean {
    return this.settings.allowSharing;
  }

  /**
   * 檢查是否允許分享特定內容類型
   */
  public canShareContent(contentType: keyof Omit<PrivacySettings, 'allowSharing' | 'anonymousAnalytics'>): boolean {
    if (!this.settings.allowSharing) {
      return false;
    }
    
    return this.settings[contentType];
  }

  /**
   * 檢查是否允許分享牌名
   */
  public canShareCardNames(): boolean {
    return this.canShareContent('shareCardNames');
  }

  /**
   * 檢查是否允許分享解讀內容
   */
  public canShareInterpretation(): boolean {
    return this.canShareContent('shareInterpretation');
  }

  /**
   * 檢查是否允許分享問題
   */
  public canShareQuestion(): boolean {
    return this.canShareContent('shareQuestion');
  }

  /**
   * 檢查是否允許匿名分析追蹤
   */
  public canTrackAnalytics(): boolean {
    return this.settings.anonymousAnalytics;
  }

  /**
   * 重置為預設設定
   */
  public resetToDefaults(): void {
    this.settings = { ...this.defaultSettings };
    this.saveSettings(this.settings);
  }

  /**
   * 完全禁用分享功能
   */
  public disableAllSharing(): void {
    this.saveSettings({
      allowSharing: false,
      shareCardNames: false,
      shareInterpretation: false,
      shareQuestion: false,
    });
  }

  /**
   * 啟用基本分享功能（僅牌名）
   */
  public enableBasicSharing(): void {
    this.saveSettings({
      allowSharing: true,
      shareCardNames: true,
      shareInterpretation: false,
      shareQuestion: false,
    });
  }

  /**
   * 啟用完整分享功能
   */
  public enableFullSharing(): void {
    this.saveSettings({
      allowSharing: true,
      shareCardNames: true,
      shareInterpretation: true,
      shareQuestion: true,
    });
  }
}

// 創建單例實例
export const privacyManager = new PrivacyManager();
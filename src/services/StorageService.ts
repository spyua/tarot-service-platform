import {
  LocalStorageData,
  ReadingResult,
  DailyCardRecord,
  UserPreferences,
} from '../types';

/**
 * 本地存儲服務類別
 * 負責管理 localStorage 中的資料存取
 */
export class StorageService {
  // 存儲鍵名
  private readonly STORAGE_KEY = 'tarot_app_data';

  // 最大記錄數量限制
  private readonly MAX_READINGS = 100;

  // 清理間隔（7天，以毫秒為單位）
  private readonly CLEANUP_INTERVAL = 7 * 24 * 60 * 60 * 1000;

  // 記錄保留時間（30天，以毫秒為單位）
  private readonly RECORD_RETENTION = 30 * 24 * 60 * 60 * 1000;

  /**
   * 初始化存儲服務
   * 如果本地存儲中沒有資料，則創建初始資料結構
   */
  constructor() {
    // 檢查是否需要初始化資料
    if (!this.getData()) {
      this.initializeData();
    }

    // 執行自動清理
    this.cleanup();
  }

  /**
   * 初始化本地存儲資料
   */
  private initializeData(): void {
    const initialData: LocalStorageData = {
      readings: [],
      dailyCards: [],
      userPreferences: {
        language: 'zh-TW',
        theme: 'light',
        animations: true,
        notifications: true,
      },
      lastCleanup: Date.now(),
    };

    this.setData(initialData);
  }

  /**
   * 從本地存儲獲取資料
   * @returns 本地存儲資料或 null
   */
  public getData(): LocalStorageData | null {
    try {
      const dataString = localStorage.getItem(this.STORAGE_KEY);
      if (!dataString) return null;

      return JSON.parse(dataString) as LocalStorageData;
    } catch (error) {
      console.error('讀取本地存儲資料失敗:', error);
      return null;
    }
  }

  /**
   * 將資料保存到本地存儲
   * @param data 要保存的資料
   */
  private setData(data: LocalStorageData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('保存資料到本地存儲失敗:', error);

      // 如果是存儲空間不足錯誤，嘗試清理舊資料
      if (
        error instanceof DOMException &&
        error.name === 'QuotaExceededError'
      ) {
        this.handleStorageFullError();
      }
    }
  }

  /**
   * 處理存儲空間不足錯誤
   */
  private handleStorageFullError(): void {
    const data = this.getData();
    if (!data) return;

    // 減少保留的記錄數量
    if (data.readings.length > 10) {
      data.readings = data.readings.slice(
        0,
        Math.floor(data.readings.length / 2)
      );

      // 更新最後清理時間
      data.lastCleanup = Date.now();

      try {
        this.setData(data);
      } catch (error) {
        console.error('即使清理後仍無法保存資料:', error);
      }
    }
  }

  /**
   * 保存占卜結果
   * @param reading 占卜結果
   */
  public saveReading(reading: ReadingResult): void {
    const data = this.getData();
    if (!data) return;

    // 將新記錄添加到列表開頭
    data.readings.unshift(reading);

    // 限制記錄數量
    if (data.readings.length > this.MAX_READINGS) {
      data.readings = data.readings.slice(0, this.MAX_READINGS);
    }

    this.setData(data);
  }

  /**
   * 獲取所有占卜記錄
   * @returns 占卜記錄陣列
   */
  public getAllReadings(): ReadingResult[] {
    const data = this.getData();
    return data?.readings || [];
  }

  /**
   * 根據 ID 獲取占卜記錄
   * @param id 占卜記錄 ID
   * @returns 占卜記錄或 undefined
   */
  public getReadingById(id: string): ReadingResult | undefined {
    const data = this.getData();
    return data?.readings.find(reading => reading.id === id);
  }

  /**
   * 刪除占卜記錄
   * @param id 要刪除的記錄 ID
   * @returns 是否刪除成功
   */
  public deleteReading(id: string): boolean {
    const data = this.getData();
    if (!data) return false;

    const initialLength = data.readings.length;
    data.readings = data.readings.filter(reading => reading.id !== id);

    // 檢查是否有記錄被刪除
    if (data.readings.length === initialLength) {
      return false;
    }

    this.setData(data);
    return true;
  }

  /**
   * 保存每日抽牌記錄
   * @param dailyCard 每日抽牌記錄
   */
  public saveDailyCard(dailyCard: DailyCardRecord): void {
    const data = this.getData();
    if (!data) return;

    // 檢查是否已有當日記錄
    const existingIndex = data.dailyCards.findIndex(
      record => record.date === dailyCard.date
    );

    if (existingIndex >= 0) {
      // 更新現有記錄
      data.dailyCards[existingIndex] = dailyCard;
    } else {
      // 添加新記錄
      data.dailyCards.unshift(dailyCard);
    }

    this.setData(data);
  }

  /**
   * 獲取指定日期的每日抽牌記錄
   * @param date 日期字符串 (YYYY-MM-DD)
   * @returns 每日抽牌記錄或 undefined
   */
  public getDailyCard(date: string): DailyCardRecord | undefined {
    const data = this.getData();
    return data?.dailyCards.find(record => record.date === date);
  }

  /**
   * 獲取所有每日抽牌記錄
   * @returns 每日抽牌記錄陣列
   */
  public getAllDailyCards(): DailyCardRecord[] {
    const data = this.getData();
    return data?.dailyCards || [];
  }

  /**
   * 檢查今日是否已抽牌
   * @returns 是否已抽牌
   */
  public hasTodayCard(): boolean {
    const today = this.formatDate(new Date());
    return !!this.getDailyCard(today);
  }

  /**
   * 格式化日期為 YYYY-MM-DD 字符串
   * @param date 日期對象
   * @returns 格式化的日期字符串
   */
  public formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 保存使用者偏好設定
   * @param preferences 使用者偏好設定
   */
  public saveUserPreferences(preferences: UserPreferences): void {
    const data = this.getData();
    if (!data) return;

    data.userPreferences = preferences;
    this.setData(data);
  }

  /**
   * 獲取使用者偏好設定
   * @returns 使用者偏好設定
   */
  public getUserPreferences(): UserPreferences {
    const data = this.getData();
    if (!data || !data.userPreferences) {
      // 返回默認設定
      return {
        language: 'zh-TW',
        theme: 'light',
        animations: true,
        notifications: true,
      };
    }

    return data.userPreferences;
  }

  /**
   * 清理舊資料
   * 定期執行以保持存儲空間
   */
  public cleanup(): void {
    const data = this.getData();
    if (!data) return;

    const now = Date.now();

    // 檢查是否需要執行清理
    if (now - data.lastCleanup < this.CLEANUP_INTERVAL) {
      return;
    }

    // 清理超過保留期限的占卜記錄
    const cutoffTime = now - this.RECORD_RETENTION;
    data.readings = data.readings.filter(
      reading => reading.timestamp > cutoffTime
    );

    // 限制每日抽牌記錄數量（保留最近90天）
    if (data.dailyCards.length > 90) {
      data.dailyCards = data.dailyCards.slice(0, 90);
    }

    // 更新最後清理時間
    data.lastCleanup = now;

    this.setData(data);
  }

  /**
   * 匯出所有資料
   * @returns 資料字符串
   */
  public exportData(): string {
    const data = this.getData();
    if (!data) return '';

    return JSON.stringify(data);
  }

  /**
   * 匯入資料
   * @param jsonString JSON 字符串
   * @returns 是否匯入成功
   */
  public importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString) as LocalStorageData;

      // 驗證資料結構
      if (!data.readings || !data.dailyCards || !data.userPreferences) {
        return false;
      }

      this.setData(data);
      return true;
    } catch (error) {
      console.error('匯入資料失敗:', error);
      return false;
    }
  }

  /**
   * 清除所有資料
   */
  public clearAllData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.initializeData();
  }
}

// 創建單例實例
export const storageService = new StorageService();

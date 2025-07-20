import { LocalStorageData } from '../types';
import { storageService } from './StorageService';

/**
 * 資料管理服務
 * 處理資料的匯出、匯入和清除功能
 */
export class DataManagementService {
  /**
   * 匯出所有使用者資料
   * @returns Promise<string> JSON 格式的資料字串
   */
  public async exportAllData(): Promise<string> {
    try {
      const data = storageService.getData();
      if (!data) {
        throw new Error('無法獲取資料');
      }

      // 添加匯出時間戳記和版本資訊
      const exportData = {
        ...data,
        exportInfo: {
          timestamp: Date.now(),
          version: '1.0.0',
          type: 'full_backup'
        }
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('匯出資料失敗:', error);
      throw new Error('匯出資料失敗');
    }
  }

  /**
   * 匯出特定類型的資料
   * @param dataType 資料類型
   * @returns Promise<string> JSON 格式的資料字串
   */
  public async exportData(dataType: 'readings' | 'dailyCards' | 'preferences'): Promise<string> {
    try {
      const data = storageService.getData();
      if (!data) {
        throw new Error('無法獲取資料');
      }

      const exportData = {
        [dataType]: data[dataType],
        exportInfo: {
          timestamp: Date.now(),
          version: '1.0.0',
          type: dataType
        }
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error(`匯出 ${dataType} 資料失敗:`, error);
      throw new Error(`匯出 ${dataType} 資料失敗`);
    }
  }

  /**
   * 下載資料為檔案
   * @param data 資料字串
   * @param filename 檔案名稱
   */
  public downloadAsFile(data: string, filename: string): void {
    try {
      const blob = new Blob([data], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // 清理
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('下載檔案失敗:', error);
      throw new Error('下載檔案失敗');
    }
  }

  /**
   * 從檔案匯入資料
   * @param file 檔案物件
   * @returns Promise<boolean> 是否匯入成功
   */
  public async importFromFile(file: File): Promise<boolean> {
    try {
      const text = await this.readFileAsText(file);
      return this.importFromJson(text);
    } catch (error) {
      console.error('從檔案匯入資料失敗:', error);
      return false;
    }
  }

  /**
   * 從 JSON 字串匯入資料
   * @param jsonString JSON 字串
   * @returns boolean 是否匯入成功
   */
  public importFromJson(jsonString: string): boolean {
    try {
      const importedData = JSON.parse(jsonString);
      
      // 驗證資料結構
      if (!this.validateImportData(importedData)) {
        throw new Error('資料格式不正確');
      }

      // 移除匯出資訊
      const { exportInfo, ...cleanData } = importedData;
      
      // 合併資料
      const currentData = storageService.getData();
      if (!currentData) {
        throw new Error('無法獲取當前資料');
      }

      const mergedData = this.mergeData(currentData, cleanData);
      
      // 儲存合併後的資料
      storageService.setData(mergedData);
      
      return true;
    } catch (error) {
      console.error('匯入 JSON 資料失敗:', error);
      return false;
    }
  }

  /**
   * 讀取檔案內容為文字
   * @param file 檔案物件
   * @returns Promise<string> 檔案內容
   */
  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('無法讀取檔案內容'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('讀取檔案失敗'));
      };
      
      reader.readAsText(file, 'utf-8');
    });
  }

  /**
   * 驗證匯入的資料結構
   * @param data 要驗證的資料
   * @returns boolean 是否有效
   */
  private validateImportData(data: any): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    // 檢查必要的資料結構
    const hasValidReadings = !data.readings || Array.isArray(data.readings);
    const hasValidDailyCards = !data.dailyCards || Array.isArray(data.dailyCards);
    const hasValidPreferences = !data.userPreferences || typeof data.userPreferences === 'object';

    return hasValidReadings && hasValidDailyCards && hasValidPreferences;
  }

  /**
   * 合併現有資料和匯入資料
   * @param currentData 現有資料
   * @param importedData 匯入資料
   * @returns LocalStorageData 合併後的資料
   */
  private mergeData(currentData: LocalStorageData, importedData: Partial<LocalStorageData>): LocalStorageData {
    const result = { ...currentData };

    // 合併占卜記錄，避免重複
    if (importedData.readings && Array.isArray(importedData.readings)) {
      const existingIds = new Set(currentData.readings.map(r => r.id));
      const newReadings = importedData.readings.filter(r => !existingIds.has(r.id));
      result.readings = [...newReadings, ...currentData.readings];
    }

    // 合併每日抽牌記錄，避免重複
    if (importedData.dailyCards && Array.isArray(importedData.dailyCards)) {
      const existingDates = new Set(currentData.dailyCards.map(d => d.date));
      const newDailyCards = importedData.dailyCards.filter(d => !existingDates.has(d.date));
      result.dailyCards = [...newDailyCards, ...currentData.dailyCards];
    }

    // 合併使用者偏好設定（匯入的設定會覆蓋現有設定）
    if (importedData.userPreferences) {
      result.userPreferences = {
        ...currentData.userPreferences,
        ...importedData.userPreferences
      };
    }

    return result;
  }

  /**
   * 清除所有資料
   * @returns Promise<boolean> 是否清除成功
   */
  public async clearAllData(): Promise<boolean> {
    try {
      storageService.clearAllData();
      return true;
    } catch (error) {
      console.error('清除資料失敗:', error);
      return false;
    }
  }

  /**
   * 清除特定類型的資料
   * @param dataType 要清除的資料類型
   * @returns Promise<boolean> 是否清除成功
   */
  public async clearData(dataType: 'readings' | 'dailyCards'): Promise<boolean> {
    try {
      const data = storageService.getData();
      if (!data) {
        return false;
      }

      if (dataType === 'readings') {
        data.readings = [];
      } else if (dataType === 'dailyCards') {
        data.dailyCards = [];
      }

      storageService.setData(data);
      return true;
    } catch (error) {
      console.error(`清除 ${dataType} 資料失敗:`, error);
      return false;
    }
  }

  /**
   * 獲取資料統計資訊
   * @returns 資料統計
   */
  public getDataStatistics() {
    const data = storageService.getData();
    if (!data) {
      return {
        totalReadings: 0,
        totalDailyCards: 0,
        oldestReading: null,
        newestReading: null,
        storageSize: 0
      };
    }

    const readings = data.readings || [];
    const dailyCards = data.dailyCards || [];

    // 計算存儲大小（估算）
    const dataString = JSON.stringify(data);
    const storageSize = new Blob([dataString]).size;

    return {
      totalReadings: readings.length,
      totalDailyCards: dailyCards.length,
      oldestReading: readings.length > 0 ? new Date(Math.min(...readings.map(r => r.timestamp))) : null,
      newestReading: readings.length > 0 ? new Date(Math.max(...readings.map(r => r.timestamp))) : null,
      storageSize: Math.round(storageSize / 1024) // KB
    };
  }
}

// 創建單例實例
export const dataManagementService = new DataManagementService();
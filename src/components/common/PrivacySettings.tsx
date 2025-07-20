import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PrivacySettings as PrivacySettingsType } from '../../types';
import { privacyManager } from '../../services/PrivacyManager';
import Switch from './Switch';
import Button from './Button';

interface PrivacySettingsProps {
  className?: string;
}

/**
 * 隱私設定組件
 * 提供完整的隱私設定管理介面
 */
const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  className = ''
}) => {
  const [settings, setSettings] = useState<PrivacySettingsType>(
    privacyManager.getSettings()
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 載入設定
  useEffect(() => {
    setSettings(privacyManager.getSettings());
  }, []);

  // 處理設定變更
  const handleSettingChange = (key: keyof PrivacySettingsType, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    
    // 如果禁用分享，自動禁用所有分享相關選項
    if (key === 'allowSharing' && !value) {
      newSettings.shareCardNames = false;
      newSettings.shareInterpretation = false;
      newSettings.shareQuestion = false;
    }
    
    setSettings(newSettings);
    setHasChanges(true);
  };

  // 保存設定
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      privacyManager.saveSettings(settings);
      setHasChanges(false);
      
      // 顯示成功訊息
      alert('隱私設定已保存！');
    } catch (error) {
      console.error('保存隱私設定失敗:', error);
      alert('保存設定失敗，請稍後再試。');
    } finally {
      setIsSaving(false);
    }
  };

  // 重置為預設設定
  const handleReset = () => {
    if (confirm('確定要重置為預設設定嗎？')) {
      privacyManager.resetToDefaults();
      setSettings(privacyManager.getSettings());
      setHasChanges(true);
    }
  };

  // 快速設定選項
  const handleQuickSetting = (type: 'disable' | 'basic' | 'full') => {
    switch (type) {
      case 'disable':
        privacyManager.disableAllSharing();
        break;
      case 'basic':
        privacyManager.enableBasicSharing();
        break;
      case 'full':
        privacyManager.enableFullSharing();
        break;
    }
    
    setSettings(privacyManager.getSettings());
    setHasChanges(false);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          隱私設定
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          管理您的分享偏好和隱私保護選項
        </p>
      </div>

      {/* 快速設定選項 */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          快速設定
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            onClick={() => handleQuickSetting('disable')}
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
          >
            <div className="text-2xl mb-2">🔒</div>
            <div className="text-sm font-medium">完全私密</div>
            <div className="text-xs text-gray-500 mt-1">禁用所有分享</div>
          </Button>
          
          <Button
            onClick={() => handleQuickSetting('basic')}
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
          >
            <div className="text-2xl mb-2">🔓</div>
            <div className="text-sm font-medium">基本分享</div>
            <div className="text-xs text-gray-500 mt-1">僅分享牌名</div>
          </Button>
          
          <Button
            onClick={() => handleQuickSetting('full')}
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
          >
            <div className="text-2xl mb-2">📤</div>
            <div className="text-sm font-medium">完整分享</div>
            <div className="text-xs text-gray-500 mt-1">分享所有內容</div>
          </Button>
        </div>
      </div>

      {/* 詳細設定 */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">
          詳細設定
        </h3>

        {/* 總開關 */}
        <div className="border-b border-gray-200 dark:border-gray-600 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-base font-medium text-gray-700 dark:text-gray-300">
                允許分享功能
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                啟用或完全禁用所有分享功能。禁用後，分享按鈕將不會顯示。
              </p>
            </div>
            <Switch
              checked={settings.allowSharing}
              onChange={(checked) => handleSettingChange('allowSharing', checked)}
            />
          </div>
        </div>

        {/* 分享內容選項 */}
        <motion.div
          initial={false}
          animate={{
            opacity: settings.allowSharing ? 1 : 0.5,
            height: settings.allowSharing ? 'auto' : 'auto'
          }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <label className="text-base font-medium text-gray-700 dark:text-gray-300">
                分享牌名
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                在分享內容中包含您抽到的塔羅牌名稱和正逆位資訊
              </p>
            </div>
            <Switch
              checked={settings.shareCardNames}
              onChange={(checked) => handleSettingChange('shareCardNames', checked)}
              disabled={!settings.allowSharing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-base font-medium text-gray-700 dark:text-gray-300">
                分享解讀內容
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                在分享內容中包含占卜的解讀和建議內容
              </p>
            </div>
            <Switch
              checked={settings.shareInterpretation}
              onChange={(checked) => handleSettingChange('shareInterpretation', checked)}
              disabled={!settings.allowSharing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-base font-medium text-gray-700 dark:text-gray-300">
                分享問題
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                在分享內容中包含您的占卜問題（如果有的話）
              </p>
            </div>
            <Switch
              checked={settings.shareQuestion}
              onChange={(checked) => handleSettingChange('shareQuestion', checked)}
              disabled={!settings.allowSharing}
            />
          </div>
        </motion.div>

        {/* 分析追蹤 */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-base font-medium text-gray-700 dark:text-gray-300">
                匿名使用分析
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                允許收集匿名使用統計以改善應用程式體驗。不會收集個人識別資訊。
              </p>
            </div>
            <Switch
              checked={settings.anonymousAnalytics}
              onChange={(checked) => handleSettingChange('anonymousAnalytics', checked)}
            />
          </div>
        </div>
      </div>

      {/* 隱私說明 */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          🛡️ 隱私保護承諾
        </h4>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <li>• 所有占卜資料僅存儲在您的設備本地，不會上傳到伺服器</li>
          <li>• 分享功能完全由您控制，可隨時啟用或禁用</li>
          <li>• 匿名分析不包含任何個人識別資訊或占卜內容</li>
          <li>• 您可以隨時清除所有本地資料</li>
        </ul>
      </div>

      {/* 操作按鈕 */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          loading={isSaving}
          className="flex-1"
        >
          {isSaving ? '保存中...' : '保存設定'}
        </Button>
        
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1"
        >
          重置為預設
        </Button>
      </div>

      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
        >
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ 您有未保存的變更，請點擊「保存設定」以應用變更。
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PrivacySettings;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReadingResult,
  SharePlatform,
  ShareOptions,
  PrivacySettings,
} from '../../types';
import { sharingService } from '../../services/SharingService';
import { privacyManager } from '../../services/PrivacyManager';
import SharePreview from './SharePreview';
import Modal from './Modal';
import Button from './Button';
import Switch from './Switch';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  reading: ReadingResult;
}

/**
 * 分享選項模態框
 * 提供詳細的分享選項和隱私設定
 */
const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  reading,
}) => {
  const [shareOptions, setShareOptions] = useState<
    Omit<ShareOptions, 'platform'>
  >({
    includeImage: false,
    includeInterpretation: false,
    includeQuestion: false,
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(
    privacyManager.getSettings()
  );

  const [isSharing, setIsSharing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] =
    useState<SharePlatform | null>(null);

  // 可用的分享平台
  const platforms: SharePlatform[] = [
    'facebook',
    'twitter',
    'line',
    'instagram',
    'copy',
  ];

  // 載入設定
  useEffect(() => {
    if (isOpen) {
      setPrivacySettings(privacyManager.getSettings());
    }
  }, [isOpen]);

  // 處理隱私設定變更
  const handlePrivacySettingChange = (
    key: keyof PrivacySettings,
    value: boolean
  ) => {
    const newSettings = { ...privacySettings, [key]: value };
    setPrivacySettings(newSettings);
    privacyManager.saveSettings({ [key]: value });
  };

  // 處理分享選項變更
  const handleShareOptionChange = (
    key: keyof Omit<ShareOptions, 'platform'>,
    value: boolean
  ) => {
    setShareOptions(prev => ({ ...prev, [key]: value }));
  };

  // 執行分享
  const handleShare = async (platform: SharePlatform) => {
    setIsSharing(true);
    setSelectedPlatform(platform);

    try {
      const fullShareOptions: ShareOptions = {
        ...shareOptions,
        platform,
      };

      const shareContent = await sharingService.generateShareContent(
        reading,
        fullShareOptions
      );

      if (!shareContent) {
        alert('無法生成分享內容，請檢查隱私設定。');
        return;
      }

      const success = await sharingService.share(platform, shareContent);

      if (success) {
        if (platform === 'copy') {
          alert('內容已複製到剪貼簿！');
        } else {
          // 對於其他平台，分享視窗已經開啟
        }
        onClose();
      } else {
        alert(
          `分享到 ${sharingService.getPlatformDisplayName(platform)} 失敗，請稍後再試。`
        );
      }
    } catch (error) {
      console.error('分享失敗:', error);
      alert('分享失敗，請稍後再試。');
    } finally {
      setIsSharing(false);
      setSelectedPlatform(null);
    }
  };

  // 渲染平台按鈕
  const renderPlatformButton = (platform: SharePlatform) => {
    const isLoading = isSharing && selectedPlatform === platform;
    const isDisabled =
      isSharing || !sharingService.isPlatformAvailable(platform);

    return (
      <Button
        key={platform}
        onClick={() => handleShare(platform)}
        disabled={isDisabled}
        loading={isLoading}
        variant="outline"
        className="flex items-center justify-center gap-2 p-4 h-auto"
      >
        <div className="text-center">
          <div className="text-2xl mb-1">{getPlatformEmoji(platform)}</div>
          <div className="text-sm font-medium">
            {sharingService.getPlatformDisplayName(platform)}
          </div>
        </div>
      </Button>
    );
  };

  // 獲取平台表情符號
  const getPlatformEmoji = (platform: SharePlatform): string => {
    const emojis: Record<SharePlatform, string> = {
      facebook: '📘',
      twitter: '🐦',
      instagram: '📷',
      line: '💬',
      copy: '📋',
    };
    return emojis[platform] || '📤';
  };

  // 檢查是否可以分享特定內容
  const canShareContent = (
    contentType: keyof Omit<
      PrivacySettings,
      'allowSharing' | 'anonymousAnalytics'
    >
  ): boolean => {
    return privacySettings.allowSharing && privacySettings[contentType];
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="分享占卜結果">
      <div className="space-y-6">
        {/* 隱私設定區域 */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            隱私設定
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  允許分享
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  啟用或禁用所有分享功能
                </p>
              </div>
              <Switch
                checked={privacySettings.allowSharing}
                onChange={checked =>
                  handlePrivacySettingChange('allowSharing', checked)
                }
              />
            </div>

            <AnimatePresence>
              {privacySettings.allowSharing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        分享牌名
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        在分享內容中包含抽到的牌名
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.shareCardNames}
                      onChange={checked =>
                        handlePrivacySettingChange('shareCardNames', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        分享解讀內容
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        在分享內容中包含占卜解讀
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.shareInterpretation}
                      onChange={checked =>
                        handlePrivacySettingChange(
                          'shareInterpretation',
                          checked
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        分享問題
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        在分享內容中包含占卜問題（如有）
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.shareQuestion}
                      onChange={checked =>
                        handlePrivacySettingChange('shareQuestion', checked)
                      }
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 分享選項區域 */}
        {privacySettings.allowSharing && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              分享選項
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    包含圖片
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    生成並包含分享圖片
                  </p>
                </div>
                <Switch
                  checked={shareOptions.includeImage}
                  onChange={checked =>
                    handleShareOptionChange('includeImage', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    包含解讀
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    在分享文字中包含占卜解讀
                  </p>
                </div>
                <Switch
                  checked={
                    shareOptions.includeInterpretation &&
                    canShareContent('shareInterpretation')
                  }
                  onChange={checked =>
                    handleShareOptionChange('includeInterpretation', checked)
                  }
                  disabled={!canShareContent('shareInterpretation')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    包含問題
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    在分享文字中包含占卜問題
                  </p>
                </div>
                <Switch
                  checked={
                    shareOptions.includeQuestion &&
                    canShareContent('shareQuestion')
                  }
                  onChange={checked =>
                    handleShareOptionChange('includeQuestion', checked)
                  }
                  disabled={!canShareContent('shareQuestion')}
                />
              </div>
            </div>
          </div>
        )}

        {/* 分享預覽 */}
        {privacySettings.allowSharing && (
          <SharePreview reading={reading} shareOptions={shareOptions} />
        )}

        {/* 分享平台選擇 */}
        {privacySettings.allowSharing && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              選擇分享平台
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {platforms.map(renderPlatformButton)}
            </div>
          </div>
        )}

        {/* 如果分享被禁用的提示 */}
        {!privacySettings.allowSharing && (
          <div className="text-center py-8">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              <p className="text-lg font-medium">分享功能已禁用</p>
              <p className="text-sm mt-2">
                請啟用「允許分享」選項以使用分享功能
              </p>
            </div>
          </div>
        )}

        {/* 底部按鈕 */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <Button variant="outline" onClick={onClose}>
            關閉
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;

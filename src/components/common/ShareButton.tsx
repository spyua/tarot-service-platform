import React, { useState } from 'react';
import { ReadingResult } from '../../types';
import { sharingService } from '../../services/SharingService';
import { privacyManager } from '../../services/PrivacyManager';
import Button from './Button';
import ShareModal from './ShareModal';

interface ShareButtonProps {
  reading: ReadingResult;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 分享按鈕組件
 * 提供快速分享和詳細分享選項
 */
const ShareButton: React.FC<ShareButtonProps> = ({
  reading,
  className = '',
  variant = 'outline',
  size = 'md',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // 檢查是否允許分享
  const canShare = privacyManager.canShare();

  // 快速分享到剪貼簿
  const handleQuickShare = async () => {
    if (!canShare) {
      alert('分享功能已被禁用。請在設定中啟用分享功能。');
      return;
    }

    setIsSharing(true);

    try {
      const shareContent = await sharingService.generateShareContent(reading, {
        platform: 'copy',
        includeImage: false,
        includeInterpretation: false,
        includeQuestion: false,
      });

      if (shareContent) {
        const success = await sharingService.share('copy', shareContent);
        if (success) {
          alert('占卜結果已複製到剪貼簿！');
        } else {
          alert('複製失敗，請稍後再試。');
        }
      } else {
        alert('無法生成分享內容，請檢查隱私設定。');
      }
    } catch (error) {
      console.error('快速分享失敗:', error);
      alert('分享失敗，請稍後再試。');
    } finally {
      setIsSharing(false);
    }
  };

  // 開啟詳細分享選項
  const handleDetailedShare = () => {
    if (!canShare) {
      alert('分享功能已被禁用。請在設定中啟用分享功能。');
      return;
    }

    setIsModalOpen(true);
  };

  // 如果不允許分享，不顯示按鈕
  if (!canShare) {
    return null;
  }

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* 快速分享按鈕 */}
        <Button
          onClick={handleQuickShare}
          variant={variant}
          size={size}
          loading={isSharing}
          disabled={isSharing}
          className="flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
          {isSharing ? '複製中...' : '快速分享'}
        </Button>

        {/* 詳細分享選項按鈕 */}
        <Button
          onClick={handleDetailedShare}
          variant="outline"
          size={size}
          className="flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
          更多選項
        </Button>
      </div>

      {/* 分享選項模態框 */}
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reading={reading}
      />
    </>
  );
};

export default ShareButton;

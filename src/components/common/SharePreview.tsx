import React, { useState, useEffect } from 'react';
import { ReadingResult, ShareOptions } from '../../types';
import { sharingService } from '../../services/SharingService';

interface SharePreviewProps {
  reading: ReadingResult;
  shareOptions: Omit<ShareOptions, 'platform'>;
}

/**
 * 分享預覽組件
 * 顯示分享內容的預覽，包括圖片和文字
 */
const SharePreview: React.FC<SharePreviewProps> = ({
  reading,
  shareOptions,
}) => {
  const [previewText, setPreviewText] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 生成預覽內容
  useEffect(() => {
    const generatePreview = async () => {
      setIsLoading(true);
      try {
        // 使用 copy 作為臨時平台類型
        const fullOptions = {
          ...shareOptions,
          platform: 'copy' as const,
        };

        const shareContent = await sharingService.generateShareContent(
          reading,
          fullOptions
        );

        if (shareContent) {
          setPreviewText(shareContent.text);
          setPreviewImage(shareContent.imageUrl || null);
        }
      } catch (error) {
        console.error('生成預覽失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generatePreview();
  }, [reading, shareOptions]);

  return (
    <div className="mt-6 border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700">
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          預覽
        </h4>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 圖片預覽 */}
            {shareOptions.includeImage && previewImage && (
              <div className="relative">
                <img
                  src={previewImage}
                  alt="分享預覽"
                  className="w-full h-auto rounded-md shadow-sm"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  預覽圖片
                </div>
              </div>
            )}

            {/* 文字預覽 */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                {previewText}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharePreview;

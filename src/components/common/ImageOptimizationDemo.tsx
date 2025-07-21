import React from 'react';
import { ResponsiveImage } from './index';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import {
  getBestImageFormat,
  supportsImageFormat,
} from '../../utils/imageUtils';

/**
 * Demo component to showcase the image optimization system
 * This component demonstrates:
 * - Responsive images with different sizes
 * - WebP format support with fallbacks
 * - Lazy loading
 * - Error handling
 */
const ImageOptimizationDemo: React.FC = () => {
  // Sample tarot card images for demonstration
  const sampleImages = [
    '/images/cards/major_00.jpg', // The Fool
    '/images/cards/major_01.jpg', // The Magician
    '/images/cards/major_02.jpg', // The High Priestess
  ];

  // Detect browser support for image formats
  const bestFormat = getBestImageFormat();
  const supportsWebP = supportsImageFormat('webp');
  const supportsAVIF = supportsImageFormat('avif');

  return (
    <Card className="max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle>圖片優化系統演示</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Browser support information */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800 mb-2">瀏覽器支援資訊</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                最佳圖片格式: <span className="font-mono">{bestFormat}</span>
              </li>
              <li>
                WebP 支援:{' '}
                <span className="font-mono">
                  {supportsWebP ? '✓ 支援' : '✗ 不支援'}
                </span>
              </li>
              <li>
                AVIF 支援:{' '}
                <span className="font-mono">
                  {supportsAVIF ? '✓ 支援' : '✗ 不支援'}
                </span>
              </li>
            </ul>
          </div>

          {/* Responsive image sizes */}
          <div>
            <h3 className="font-medium mb-2">響應式圖片尺寸</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">小尺寸 (300px)</p>
                <ResponsiveImage
                  src={sampleImages[0]}
                  alt="小尺寸塔羅牌"
                  className="w-full h-auto rounded-lg"
                  width={300}
                  height={450}
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">中尺寸 (600px)</p>
                <ResponsiveImage
                  src={sampleImages[1]}
                  alt="中尺寸塔羅牌"
                  className="w-full h-auto rounded-lg"
                  width={600}
                  height={900}
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">大尺寸 (1000px)</p>
                <ResponsiveImage
                  src={sampleImages[2]}
                  alt="大尺寸塔羅牌"
                  className="w-full h-auto rounded-lg"
                  width={1000}
                  height={1500}
                />
              </div>
            </div>
          </div>

          {/* Lazy loading demo */}
          <div>
            <h3 className="font-medium mb-2">懶加載演示</h3>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    懶加載圖片 #{index + 1} - 滾動查看
                  </p>
                  <ResponsiveImage
                    src={sampleImages[index % sampleImages.length]}
                    alt={`懶加載演示 ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                    loading="lazy"
                    width={600}
                    height={900}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Error handling demo */}
          <div>
            <h3 className="font-medium mb-2">錯誤處理演示</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">無效圖片路徑</p>
                <ResponsiveImage
                  src="/images/cards/non_existent_image.jpg"
                  alt="不存在的圖片"
                  className="w-full h-auto rounded-lg"
                  width={300}
                  height={450}
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  帶備用圖片的錯誤處理
                </p>
                <ResponsiveImage
                  src="/images/cards/another_non_existent.jpg"
                  alt="帶備用的不存在圖片"
                  className="w-full h-auto rounded-lg"
                  fallbackSrc="/assets/images/card-placeholder.svg"
                  width={300}
                  height={450}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageOptimizationDemo;

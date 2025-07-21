import React from 'react';
import { ResponsiveImage } from '../components/common';
import { getBestImageFormat, supportsImageFormat } from '../utils/imageUtils';

const ImageOptimizationDemo: React.FC = () => {
  // Detect browser support for image formats
  const bestFormat = getBestImageFormat();
  const supportsWebP = supportsImageFormat('webp');
  const supportsAVIF = supportsImageFormat('avif');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">圖片優化系統演示</h1>

      <div className="bg-purple-50 p-4 rounded-lg mb-6">
        <h2 className="font-medium text-purple-800 mb-2">瀏覽器支援資訊</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-medium mb-2">原始圖片</h2>
          <img
            src="/images/cards/sample_card.svg"
            alt="原始塔羅牌圖片"
            className="w-full h-auto rounded-lg border border-gray-200"
          />
          <p className="text-sm text-gray-600 mt-2">
            使用標準 &lt;img&gt; 標籤，不支援響應式尺寸和格式
          </p>
        </div>

        <div>
          <h2 className="font-medium mb-2">優化圖片 (WebP + 響應式)</h2>
          <ResponsiveImage
            src="/images/cards/sample_card.svg"
            alt="優化後的塔羅牌圖片"
            className="w-full h-auto rounded-lg border border-gray-200"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <p className="text-sm text-gray-600 mt-2">
            使用 ResponsiveImage 組件，支援 WebP 格式和響應式尺寸
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-medium mb-4">不同尺寸演示</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-1">小尺寸 (300px)</h3>
            <ResponsiveImage
              src="/images/cards/sample_card.svg"
              alt="小尺寸塔羅牌"
              className="w-full h-auto rounded-lg border border-gray-200"
              width={300}
              height={500}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">中尺寸 (600px)</h3>
            <ResponsiveImage
              src="/images/cards/sample_card.svg"
              alt="中尺寸塔羅牌"
              className="w-full h-auto rounded-lg border border-gray-200"
              width={600}
              height={1000}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">大尺寸 (1000px)</h3>
            <ResponsiveImage
              src="/images/cards/sample_card.svg"
              alt="大尺寸塔羅牌"
              className="w-full h-auto rounded-lg border border-gray-200"
              width={1000}
              height={1667}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-medium mb-4">錯誤處理演示</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-1">不存在的圖片</h3>
            <ResponsiveImage
              src="/images/cards/non_existent_image.jpg"
              alt="不存在的圖片"
              className="w-full h-auto rounded-lg border border-gray-200"
              width={300}
              height={500}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">帶備用圖片的錯誤處理</h3>
            <ResponsiveImage
              src="/images/cards/another_non_existent.jpg"
              alt="帶備用的不存在圖片"
              className="w-full h-auto rounded-lg border border-gray-200"
              fallbackSrc="/assets/images/card-placeholder.svg"
              width={300}
              height={500}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-medium mb-4">懶加載演示</h2>
        <p className="text-sm text-gray-600 mb-4">
          滾動查看下方圖片，它們會在進入視口時才加載
        </p>
        <div className="space-y-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">
                懶加載圖片 #{index + 1}
              </h3>
              <ResponsiveImage
                src="/images/cards/sample_card.svg"
                alt={`懶加載演示 ${index + 1}`}
                className="w-full h-auto rounded-lg border border-gray-200"
                loading="lazy"
                width={600}
                height={1000}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageOptimizationDemo;

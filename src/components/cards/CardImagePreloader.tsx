import React, { useEffect, useState } from 'react';
import { TarotCard } from '../../types';
import {
  getImageCache,
  preloadImages,
  getBestImageFormat,
  getResponsiveImagePath,
  ImageFormat,
} from '../../utils/imageUtils';

interface CardImagePreloaderProps {
  cards: TarotCard[];
  priority?: string[];
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
  children?: React.ReactNode;
  batchSize?: number;
  showIndicator?: boolean;
  preloadSizes?: ('small' | 'medium' | 'large' | 'original')[];
  preloadFormats?: ImageFormat[];
}

/**
 * CardImagePreloader handles preloading of tarot card images
 * Enhanced with WebP support and multi-size preloading
 * Features:
 * - Priority loading for visible cards
 * - Batch loading to prevent overwhelming the browser
 * - WebP format support with fallbacks
 * - Multiple image sizes for responsive loading
 * - Error handling with retry mechanism
 * - Visual loading indicator
 */
const CardImagePreloader: React.FC<CardImagePreloaderProps> = ({
  cards,
  priority = [],
  onProgress,
  onComplete,
  children,
  batchSize = 5,
  showIndicator = true,
  preloadSizes = ['medium'],
  preloadFormats,
}) => {
  const [loaded, setLoaded] = useState(0);
  const [failed] = useState(0);
  const [total, setTotal] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const imageCache = getImageCache();

  useEffect(() => {
    if (!cards || cards.length === 0) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    // Sort cards to load priority cards first
    const sortedCards = [...cards].sort((a, b) => {
      const aIndex = priority.indexOf(a.id);
      const bIndex = priority.indexOf(b.id);

      if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
      if (aIndex >= 0) return -1;
      if (bIndex >= 0) return 1;
      return 0;
    });

    // Determine which formats to preload
    const formats = preloadFormats || [getBestImageFormat()];

    // Create a list of all image URLs to preload
    const imagesToPreload: string[] = [];

    sortedCards.forEach(card => {
      // For each card, preload each size and format combination
      preloadSizes.forEach(size => {
        formats.forEach(format => {
          const imagePath = getResponsiveImagePath(card.image, size, format);
          imagesToPreload.push(imagePath);
        });
      });
    });

    setTotal(imagesToPreload.length);

    // Create priority list for preloading
    const priorityImages: string[] = [];
    priority.forEach(cardId => {
      const card = sortedCards.find(c => c.id === cardId);
      if (card) {
        // Add all sizes and formats for priority cards
        preloadSizes.forEach(size => {
          formats.forEach(format => {
            priorityImages.push(
              getResponsiveImagePath(card.image, size, format)
            );
          });
        });
      }
    });

    // Start preloading
    preloadImages(imagesToPreload, {
      onProgress: (loaded, total) => {
        setLoaded(loaded);
        onProgress?.(loaded, total);
      },
      batchSize,
      priority: priorityImages,
    })
      .then(() => {
        setIsComplete(true);
        onComplete?.();
      })
      .catch(error => {
        console.error('Image preloading error:', error);
        setIsComplete(true);
        onComplete?.();
      });
  }, [
    cards,
    priority,
    batchSize,
    onProgress,
    onComplete,
    preloadSizes,
    preloadFormats,
  ]);

  // Calculate progress percentage
  const progressPercentage = total > 0 ? Math.round((loaded / total) * 100) : 0;

  // Get a preloaded image if available
  const getPreloadedImage = (src: string): HTMLImageElement | undefined => {
    return imageCache.get(src);
  };

  return (
    <>
      {/* Optional loading indicator */}
      {showIndicator && !isComplete && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-50 flex items-center">
          <div className="w-20 h-2 bg-gray-200 rounded-full mr-3">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-600">
            {loaded}/{total} 圖片
            {failed > 0 && (
              <span className="text-red-500 ml-1">({failed} 失敗)</span>
            )}
          </div>
        </div>
      )}

      {/* Render children without cloning to avoid prop issues */}
      {children}
    </>
  );
};

export default CardImagePreloader;

import React, { useEffect, useState, useCallback } from 'react';
import { TarotCard } from '../../types';

interface CardImagePreloaderProps {
  cards: TarotCard[];
  priority?: string[];
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
  children?: React.ReactNode;
  batchSize?: number;
  showIndicator?: boolean;
}

/**
 * CardImagePreloader handles preloading of tarot card images
 * It can be used to preload images in the background or show loading progress
 * Features:
 * - Priority loading for visible cards
 * - Batch loading to prevent overwhelming the browser
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
}) => {
  const [loaded, setLoaded] = useState(0);
  const [failed, setFailed] = useState(0);
  const [total, setTotal] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [imageCache, setImageCache] = useState<Map<string, HTMLImageElement>>(new Map());

  // Function to preload a single image with retry
  const preloadImage = useCallback((src: string, retries = 2): Promise<void> => {
    return new Promise((resolve) => {
      // If already cached, resolve immediately
      if (imageCache.has(src)) {
        resolve();
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        setImageCache(prev => new Map(prev).set(src, img));
        resolve();
      };
      
      img.onerror = () => {
        if (retries > 0) {
          // Retry loading with a delay
          setTimeout(() => {
            preloadImage(src, retries - 1).then(resolve);
          }, 1000);
        } else {
          // Give up after retries
          console.warn(`Failed to load image: ${src}`);
          setFailed(prev => prev + 1);
          resolve();
        }
      };
      
      // Add a cache buster for retries
      img.src = src;
    });
  }, [imageCache]);

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

    setTotal(sortedCards.length);
    let loadedCount = 0;

    // Preload images in batches
    const preloadBatch = async (startIndex: number) => {
      const batch = sortedCards.slice(startIndex, startIndex + batchSize);
      if (batch.length === 0) {
        setIsComplete(true);
        onComplete?.();
        return;
      }

      // Load batch in parallel
      await Promise.all(batch.map(card => 
        preloadImage(card.image)
          .then(() => {
            loadedCount++;
            setLoaded(loadedCount);
            onProgress?.(loadedCount, sortedCards.length);
          })
      ));

      // Load next batch
      if (startIndex + batchSize < sortedCards.length) {
        // Small delay between batches to prevent overwhelming the browser
        setTimeout(() => preloadBatch(startIndex + batchSize), 100);
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    };

    // Start preloading
    preloadBatch(0);

    // Cleanup function
    return () => {
      // Nothing specific to clean up
    };
  }, [cards, priority, batchSize, onProgress, onComplete, preloadImage]);

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
            {failed > 0 && <span className="text-red-500 ml-1">({failed} 失敗)</span>}
          </div>
        </div>
      )}
      
      {/* Expose the context to children */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            imageCache: getPreloadedImage,
            preloadStatus: { loaded, total, isComplete }
          });
        }
        return child;
      })}
    </>
  );
};

export default CardImagePreloader;
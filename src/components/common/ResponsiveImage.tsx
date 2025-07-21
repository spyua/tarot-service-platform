import React, { useState, useEffect } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  placeholderColor?: string;
}

/**
 * ResponsiveImage component that supports:
 * - WebP format with fallback
 * - Multiple image sizes
 * - Lazy loading
 * - Error handling
 * - Placeholder during loading
 */
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes = '100vw',
  className = '',
  width,
  height,
  loading = 'lazy',
  onLoad,
  onError,
  fallbackSrc,
  placeholderColor = '#f3f4f6',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Generate srcset for different sizes
  const generateSrcSet = (imageSrc: string, format?: string): string => {
    // Extract base path and extension
    const lastDotIndex = imageSrc.lastIndexOf('.');
    if (lastDotIndex === -1) return imageSrc;

    const basePath = imageSrc.substring(0, lastDotIndex);
    const extension = format || imageSrc.substring(lastDotIndex + 1);

    // Generate srcset with different sizes
    return [
      `${basePath}-small.${extension} 300w`,
      `${basePath}-medium.${extension} 600w`,
      `${basePath}.${extension} 1000w`,
    ].join(', ');
  };

  // Convert image path to WebP format
  const getWebPPath = (imageSrc: string): string => {
    const lastDotIndex = imageSrc.lastIndexOf('.');
    if (lastDotIndex === -1) return `${imageSrc}.webp`;
    return `${imageSrc.substring(0, lastDotIndex)}.webp`;
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Use fallback image if provided and original has error
  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: placeholderColor,
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
      }}
    >
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse w-full h-full bg-gray-200"></div>
        </div>
      )}

      {/* Actual image with picture element for WebP support */}
      <picture>
        {/* WebP source */}
        <source
          srcSet={generateSrcSet(imageSrc, 'webp')}
          type="image/webp"
          sizes={sizes}
        />

        {/* Original format fallback */}
        <source srcSet={generateSrcSet(imageSrc)} sizes={sizes} />

        {/* Fallback img element */}
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          width={width}
          height={height}
        />
      </picture>

      {/* Error state */}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500 text-center p-2">
            <span className="block text-2xl">⚠️</span>
            <span className="text-xs">圖片載入失敗</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveImage;

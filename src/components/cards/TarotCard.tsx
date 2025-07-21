import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotCard as TarotCardType, DrawnCard } from '../../types';
import {
  cardDrawVariants,
  cardFlipVariants,
} from '../animations/cardAnimations';
import { useAnimation } from '../animations/AnimationContext';
import ResponsiveImage from '../common/ResponsiveImage';

interface TarotCardProps {
  card?: TarotCardType;
  drawnCard?: DrawnCard;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBack?: boolean;
  onClick?: () => void;
  className?: string;
  animationDelay?: number;
  flipAnimation?: boolean;
  animationType?: 'draw' | 'flip' | 'hover' | 'none';
  imageCache?: (src: string) => HTMLImageElement | undefined;
  preloadStatus?: { loaded: number; total: number; isComplete: boolean };
}

/**
 * TarotCard component displays a single tarot card with proper styling for upright/reversed
 * Enhanced with responsive image support and WebP format
 */
const TarotCard: React.FC<TarotCardProps> = ({
  card,
  drawnCard,
  size = 'md',
  showBack = false,
  onClick,
  className = '',
  animationDelay = 0,
  flipAnimation = false,
  imageCache,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFlipped, setIsFlipped] = useState(showBack);

  // Use either the card from drawnCard or the direct card prop
  const cardData = drawnCard?.card || card;
  const isReversed = drawnCard?.isReversed || false;

  // Effect to handle flip animation when showBack changes
  useEffect(() => {
    if (flipAnimation) {
      setIsFlipped(showBack);
    } else {
      // If no animation, just set the state directly
      setIsFlipped(showBack);
    }
  }, [showBack, flipAnimation]);

  // Check if image is already cached
  useEffect(() => {
    if (cardData && imageCache) {
      const cachedImage = imageCache(cardData.image);
      if (cachedImage) {
        setImageLoaded(true);
      }
    }
  }, [cardData, imageCache]);

  if (!cardData && !showBack) {
    return null;
  }

  // Size classes mapping
  const sizeClasses = {
    sm: 'w-24 h-40',
    md: 'w-32 h-56',
    lg: 'w-40 h-72',
    xl: 'w-48 h-80',
  };

  // Get size dimensions
  const getSizeDimensions = () => {
    const dimensions = {
      sm: { width: 96, height: 160 },
      md: { width: 128, height: 224 },
      lg: { width: 160, height: 288 },
      xl: { width: 192, height: 320 },
    };
    return dimensions[size];
  };

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Handle image load success
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Card back design
  const renderCardBack = () => (
    <div
      className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br from-purple-900 to-purple-700 flex items-center justify-center shadow-lg ${className}`}
      onClick={onClick}
    >
      <div className="w-4/5 h-4/5 border-2 border-amber-300 rounded-lg flex items-center justify-center bg-purple-800 bg-opacity-50">
        <div className="text-amber-300 text-2xl font-serif relative">
          <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-3xl">
            ✨
          </span>
          塔羅
          <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-3xl">
            ✨
          </span>
        </div>
      </div>
    </div>
  );

  // Card front with image
  const renderCardFront = () => {
    if (!cardData) return null;

    const { width, height } = getSizeDimensions();
    const imageSizes = `(max-width: 640px) 300px, (max-width: 1024px) 600px, 1000px`;

    return (
      <div
        className={`
          ${sizeClasses[size]} 
          rounded-lg 
          overflow-hidden 
          shadow-lg 
          relative 
          transition-transform 
          duration-500 
          ${isReversed ? 'rotate-180' : ''} 
          ${className}
          hover:shadow-xl
        `}
        onClick={onClick}
        style={{
          transitionDelay: `${animationDelay}ms`,
          transform: isReversed ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        {/* Responsive card image with WebP support */}
        <ResponsiveImage
          src={cardData.image}
          alt={`${cardData.name} (${cardData.nameEn})`}
          className="w-full h-full"
          sizes={imageSizes}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
          fallbackSrc="/assets/images/card-placeholder.jpg"
          width={width}
          height={height}
        />

        {/* Card name overlay at bottom */}
        {imageLoaded && !imageError && (
          <div
            className={`
            absolute bottom-0 left-0 right-0 
            bg-gradient-to-t from-black/70 to-transparent 
            text-white p-2 text-center
            ${isReversed ? 'rotate-180' : ''}
          `}
          >
            <div className="text-sm font-serif">{cardData.name}</div>
            <div className="text-xs opacity-80">{cardData.nameEn}</div>
          </div>
        )}

        {/* Reversed indicator */}
        {isReversed && imageLoaded && !imageError && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full rotate-180 font-medium">
            逆位
          </div>
        )}

        {/* Card suit and number indicator */}
        {imageLoaded && !imageError && (
          <div
            className={`
            absolute top-2 right-2
            bg-purple-600/80 text-white text-xs px-2 py-0.5 rounded-full
            ${isReversed ? 'rotate-180' : ''}
          `}
          >
            {cardData.suit === 'major' ? 'Major' : cardData.suit}{' '}
            {cardData.number}
          </div>
        )}
      </div>
    );
  };

  // Get animation context
  const { animationsEnabled, getAnimationDuration } = useAnimation();

  // Flip card animation container with Framer Motion
  if (flipAnimation) {
    return (
      <div
        className={`${sizeClasses[size]} perspective-1000 relative cursor-pointer ${className}`}
        onClick={onClick}
      >
        <AnimatePresence mode="wait">
          <motion.div
            className="relative w-full h-full transform-style-3d"
            initial={false}
            animate={isFlipped ? 'back' : 'front'}
            variants={cardFlipVariants}
            transition={{
              duration: getAnimationDuration(0.6),
              ease: 'easeInOut',
            }}
          >
            <motion.div
              className="absolute w-full h-full backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {renderCardFront()}
            </motion.div>
            <motion.div
              className="absolute w-full h-full backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              {renderCardBack()}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Card draw animation with Framer Motion
  if (animationsEnabled && animationDelay > 0) {
    return (
      <motion.div
        initial="initial"
        animate="reveal"
        variants={cardDrawVariants}
        transition={{
          duration: getAnimationDuration(0.6),
          delay: getAnimationDuration(animationDelay / 1000),
        }}
        whileHover="hover"
        whileTap="tap"
      >
        {showBack ? renderCardBack() : renderCardFront()}
      </motion.div>
    );
  }

  // Regular rendering without animation
  return showBack ? renderCardBack() : renderCardFront();
};

export default TarotCard;

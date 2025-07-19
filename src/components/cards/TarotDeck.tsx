import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TarotCard from './TarotCard';
import { useAnimation } from '../animations/AnimationContext';
import { cardShuffleVariants } from '../animations/cardAnimations';

interface TarotDeckProps {
  cardCount?: number;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isShuffling?: boolean;
  onShuffleComplete?: () => void;
}

/**
 * TarotDeck component displays a stack of cards representing the tarot deck
 * Features:
 * - Visual representation of the deck with stacked cards
 * - Card count indicator
 * - Shuffling animation
 * - Interactive hover effects
 */
const TarotDeck: React.FC<TarotDeckProps> = ({
  cardCount = 78,
  onClick,
  disabled = false,
  className = '',
  size = 'md',
  isShuffling = false,
  onShuffleComplete,
}) => {
  // State for hover and animation effects
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate how many cards to show in the stack visual (max 7)
  const visibleStackCount = Math.min(7, cardCount);
  
  // Size classes for the deck container
  const sizeClasses = {
    sm: 'w-28 h-44',
    md: 'w-36 h-60',
    lg: 'w-44 h-76',
  };
  
  // Size prop for individual cards
  const cardSize = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
  } as const;
  
  // Handle click with disabled check
  const handleClick = () => {
    if (!disabled && !isShuffling && onClick) {
      onClick();
    }
  };
  
  // Handle shuffle animation end
  const handleShuffleEnd = () => {
    if (onShuffleComplete) {
      onShuffleComplete();
    }
  };

  return (
    <div 
      className={`relative ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${isShuffling ? 'pointer-events-none' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-disabled={disabled || isShuffling}
      aria-label={`塔羅牌堆，剩餘 ${cardCount} 張牌`}
    >
      {/* Stack of cards in the background */}
      {Array.from({ length: visibleStackCount }).map((_, index) => {
        const { animationsEnabled, getAnimationDuration } = useAnimation();
        
        // Base offset for stacking effect
        const baseOffsetX = index * 2;
        const baseOffsetY = index * 2;
        
        return (
          <motion.div 
            key={`stack-${index}`}
            className="absolute"
            initial={false}
            animate={isShuffling && animationsEnabled ? "shuffle" : "rest"}
            variants={cardShuffleVariants}
            custom={index}
            whileHover={!disabled && !isShuffling && animationsEnabled ? { y: -3 } : {}}
            style={{
              top: `${baseOffsetY}px`,
              left: `${baseOffsetX}px`,
              zIndex: index,
            }}
            transition={{ 
              duration: getAnimationDuration(0.3),
              delay: getAnimationDuration(index * 0.05)
            }}
            onAnimationComplete={() => {
              if (isShuffling && index === 0) {
                handleShuffleEnd();
              }
            }}
          >
            <TarotCard 
              showBack 
              size={cardSize[size]} 
              className={isShuffling ? 'shadow-xl' : ''}
            />
          </motion.div>
        );
      })}
      
      {/* Card count indicator */}
      <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-md">
        {cardCount}
      </div>
      
      {/* Hover effect */}
      {!disabled && !isShuffling && (
        <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
      )}
      
      {/* Shuffling indicator */}
      {isShuffling && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-purple-900/80 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            洗牌中...
          </div>
        </div>
      )}
      
      {/* Draw instruction */}
      {!disabled && !isShuffling && isHovered && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-700/90 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
          點擊抽牌
        </div>
      )}
    </div>
  );
};

export default TarotDeck;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DrawnCard, InterpretationFramework } from '../../types';
import TarotCard from './TarotCard';
import { useAnimation } from '../animations/AnimationContext';

interface DrawingAreaProps {
  drawnCards: DrawnCard[];
  layout?: 'line' | 'arc' | 'cross' | 'grid' | 'fan' | 'star';
  maxCards?: number;
  onCardClick?: (card: DrawnCard, index: number) => void;
  className?: string;
  cardSize?: 'sm' | 'md' | 'lg' | 'xl';
  showPositionLabels?: boolean;
  isAnimating?: boolean;
  interpretationFramework?: InterpretationFramework | null;
  showInterpretation?: boolean;
}

/**
 * DrawingArea component displays drawn tarot cards in various layouts
 * Supports multiple layout options and position labels
 */
const DrawingArea: React.FC<DrawingAreaProps> = ({
  drawnCards = [],
  layout = 'line',
  maxCards = 9,
  onCardClick,
  className = '',
  cardSize = 'md',
  showPositionLabels = false,
  isAnimating = false,
  interpretationFramework,
  showInterpretation = false,
}) => {
  // State for animation
  const [isVisible, setIsVisible] = useState(!isAnimating);
  const [isDrawComplete, setIsDrawComplete] = useState(false);
  
  // Ensure we don't exceed the maximum number of cards
  const cards = drawnCards.slice(0, maxCards);
  
  // Handle animation timing
  useEffect(() => {
    if (isAnimating) {
      setIsVisible(false);
      
      // Show cards with a delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300);
      
      // Mark drawing as complete after all animations
      const completeTimer = setTimeout(() => {
        setIsDrawComplete(true);
      }, 300 + cards.length * 200);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    } else {
      setIsVisible(true);
      setIsDrawComplete(true);
    }
  }, [isAnimating, cards.length]);
  
  // Get position meaning from interpretation framework
  const getPositionMeaning = (index: number): string | undefined => {
    if (!interpretationFramework || !interpretationFramework.positions) return undefined;
    return interpretationFramework.positions[index]?.name;
  };
  
  // Calculate positions based on layout
  const getCardStyle = (index: number, total: number) => {
    switch (layout) {
      case 'arc':
        // Arc layout - cards in a curved arrangement
        const arcRadius = total <= 3 ? 150 : total <= 5 ? 200 : 250;
        const arcAngle = Math.min(120, (total - 1) * 15); // Max 120 degrees
        const startAngle = 90 - arcAngle / 2;
        const angle = startAngle + (index * arcAngle) / (total - 1 || 1);
        const radian = (angle * Math.PI) / 180;
        
        return {
          position: 'absolute' as const,
          left: `calc(50% + ${arcRadius * Math.cos(radian)}px)`,
          top: `calc(50% - ${arcRadius * Math.sin(radian)}px)`,
          transform: 'translate(-50%, -50%)',
          zIndex: index,
          transitionDelay: isAnimating ? `${index * 200}ms` : '0ms',
        };
      
      case 'fan':
        // Fan layout - cards in a hand-like fan arrangement
        const fanAngle = Math.min(60, (total - 1) * 8); // Max 60 degrees
        const fanStartAngle = 90 - fanAngle / 2;
        const fanCardAngle = fanStartAngle + (index * fanAngle) / (total - 1 || 1);
        const fanOffset = index * 20; // Horizontal offset between cards
        
        return {
          position: 'absolute' as const,
          left: `calc(50% - ${(total - 1) * 10}px + ${fanOffset}px)`,
          bottom: '10%',
          transform: `translateX(-50%) rotate(${fanCardAngle - 90}deg)`,
          transformOrigin: 'bottom center',
          zIndex: index,
          transitionDelay: isAnimating ? `${index * 150}ms` : '0ms',
        };
        
      case 'cross':
        // Celtic cross layout with improved positioning
        const crossPositions = [
          { left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }, // Center
          { left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(90deg)', zIndex: 2 }, // Crossing
          { left: '50%', top: '15%', transform: 'translate(-50%, -50%)', zIndex: 0 }, // Above (crowns)
          { left: '50%', top: '85%', transform: 'translate(-50%, -50%)', zIndex: 0 }, // Below (foundation)
          { left: '25%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }, // Left (past)
          { left: '75%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }, // Right (future)
          { left: '80%', top: '20%', transform: 'translate(-50%, -50%)', zIndex: 0 }, // Position 7
          { left: '80%', top: '40%', transform: 'translate(-50%, -50%)', zIndex: 0 }, // Position 8
          { left: '80%', top: '60%', transform: 'translate(-50%, -50%)', zIndex: 0 }, // Position 9
          { left: '80%', top: '80%', transform: 'translate(-50%, -50%)', zIndex: 0 }, // Position 10
        ];
        
        return {
          position: 'absolute' as const,
          ...(crossPositions[index] || crossPositions[0]),
          transitionDelay: isAnimating ? `${index * 200}ms` : '0ms',
        };
      
      case 'star':
        // Star layout - cards in a star pattern
        const starPoints = 5;
        const starRadius = 180;
        const starAngle = (index * (360 / starPoints) * Math.PI) / 180;
        
        // If we have more cards than star points, place them in inner circle
        const innerRadius = starRadius * 0.5;
        const isInnerCircle = index >= starPoints;
        const actualIndex = isInnerCircle ? index - starPoints : index;
        const actualAngle = (actualIndex * (360 / Math.min(total - starPoints, starPoints)) * Math.PI) / 180;
        const actualRadius = isInnerCircle ? innerRadius : starRadius;
        
        return {
          position: 'absolute' as const,
          left: `calc(50% + ${actualRadius * Math.cos(actualAngle)}px)`,
          top: `calc(50% + ${actualRadius * Math.sin(actualAngle)}px)`,
          transform: 'translate(-50%, -50%)',
          zIndex: isInnerCircle ? 0 : 1,
          transitionDelay: isAnimating ? `${index * 150}ms` : '0ms',
        };
        
      case 'grid':
        // Grid layout - cards in a grid pattern
        const cols = Math.ceil(Math.sqrt(total));
        const row = Math.floor(index / cols);
        const col = index % cols;
        
        return {
          position: 'relative' as const,
          margin: '10px',
          transitionDelay: isAnimating ? `${index * 150}ms` : '0ms',
        };
        
      case 'line':
      default:
        // Line layout - cards in a horizontal line with improved spacing
        const cardWidth = cardSize === 'sm' ? 24 : cardSize === 'md' ? 32 : cardSize === 'lg' ? 40 : 48;
        const overlap = total <= 3 ? 0 : total <= 5 ? cardWidth * 0.2 : cardWidth * 0.3;
        const effectiveWidth = cardWidth - overlap;
        const totalWidth = effectiveWidth * (total - 1) + cardWidth;
        const left = `calc(50% - ${totalWidth / 2}px + ${index * effectiveWidth}px)`;
        
        return {
          position: 'absolute' as const,
          left,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: index,
          transitionDelay: isAnimating ? `${index * 150}ms` : '0ms',
        };
    }
  };

  return (
    <div 
      className={`relative w-full ${
        layout === 'grid' ? 'flex flex-wrap justify-center' : 'h-96'
      } ${className}`}
    >
      <AnimatePresence>
        {cards.map((drawnCard, index) => {
          const positionName = getPositionMeaning(index);
          const { animationsEnabled, getAnimationDuration } = useAnimation();
          
          return (
            <motion.div 
              key={`${drawnCard.card.id}-${index}`}
              style={getCardStyle(index, cards.length)}
              initial={isAnimating && animationsEnabled ? { opacity: 0, scale: 0.8, y: 20 } : false}
              animate={{ 
                opacity: isVisible ? 1 : 0, 
                scale: isVisible ? 1 : 0.8,
                y: isVisible ? 0 : 20
              }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ 
                duration: getAnimationDuration(0.5),
                delay: isAnimating ? getAnimationDuration(index * 0.15) : 0,
                ease: "easeOut"
              }}
            >
              <TarotCard
                drawnCard={drawnCard}
                size={cardSize}
                onClick={() => onCardClick?.(drawnCard, index)}
                animationDelay={isAnimating ? index * 150 : 0}
                flipAnimation={isAnimating && isDrawComplete}
              />
              
              {/* Position label */}
              {showPositionLabels && (
                <motion.div 
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: getAnimationDuration((index * 0.15) + 0.3),
                    duration: getAnimationDuration(0.3)
                  }}
                >
                  <span className="bg-purple-700 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                    {index + 1}{positionName ? `: ${positionName}` : ''}
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {/* Empty state */}
      {cards.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">🔮</div>
            <p>準備好抽牌了嗎？</p>
          </div>
        </div>
      )}
      
      {/* Interpretation framework name */}
      {showInterpretation && interpretationFramework && cards.length > 0 && (
        <div className="absolute top-0 left-0 right-0 text-center">
          <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
            {interpretationFramework.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default DrawingArea;
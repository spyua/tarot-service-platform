import React from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { useAnimation } from './AnimationContext';
import { cardDrawVariants, cardFlipVariants } from './cardAnimations';

interface AnimatedCardProps extends MotionProps {
  children: React.ReactNode;
  isFlipped?: boolean;
  animationType?: 'draw' | 'flip' | 'hover' | 'none';
  animationDelay?: number;
  className?: string;
  onClick?: () => void;
  custom?: any;
}

/**
 * AnimatedCard component wraps card components with Framer Motion animations
 * Supports different animation types and respects user animation preferences
 */
const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  isFlipped = false,
  animationType = 'none',
  animationDelay = 0,
  className = '',
  onClick,
  custom,
  ...motionProps
}) => {
  const { animationsEnabled, getAnimationDuration } = useAnimation();
  
  // If animations are disabled, render without motion
  if (!animationsEnabled) {
    return (
      <div 
        className={className}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
  
  // Select animation variants based on type
  const getVariants = () => {
    switch (animationType) {
      case 'draw': return cardDrawVariants;
      case 'flip': return cardFlipVariants;
      case 'hover': return {
        initial: {},
        animate: {},
        whileHover: { scale: 1.05, y: -5 },
        whileTap: { scale: 0.98 }
      };
      default: return {};
    }
  };
  
  // Get animation state based on type and props
  const getAnimationState = () => {
    if (animationType === 'flip') {
      return isFlipped ? 'back' : 'front';
    }
    return 'animate';
  };
  
  // Apply custom transition delay
  const getTransition = () => {
    if (animationDelay > 0) {
      return {
        delay: getAnimationDuration(animationDelay / 1000)
      };
    }
    return {};
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={`perspective-1000 ${className}`}
        initial={animationType !== 'none' ? 'initial' : undefined}
        animate={getAnimationState()}
        variants={getVariants()}
        custom={custom}
        onClick={onClick}
        transition={getTransition()}
        {...motionProps}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedCard;
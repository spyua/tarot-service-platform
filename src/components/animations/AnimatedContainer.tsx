import React from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { useAnimation } from './AnimationContext';
import { 
  pageTransitionVariants, 
  fadeTransitionVariants,
  slideTransitionVariants,
  scaleTransitionVariants,
  mysticalTransitionVariants
} from './pageTransitions';

type TransitionType = 'page' | 'fade' | 'slide' | 'scale' | 'mystical' | 'none';
type SlideDirection = 'left' | 'right' | 'up' | 'down';

interface AnimatedContainerProps extends MotionProps {
  children: React.ReactNode;
  transitionType?: TransitionType;
  slideDirection?: SlideDirection;
  className?: string;
  layoutId?: string;
  staggerChildren?: boolean;
  staggerDelay?: number;
}

/**
 * AnimatedContainer component wraps content with page transition animations
 * Supports different transition types and respects user animation preferences
 */
const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  transitionType = 'page',
  slideDirection = 'right',
  className = '',
  layoutId,
  staggerChildren = false,
  staggerDelay = 0.1,
  ...motionProps
}) => {
  const { animationsEnabled, getAnimationDuration } = useAnimation();
  
  // If animations are disabled, render without motion
  if (!animationsEnabled || transitionType === 'none') {
    return <div className={className}>{children}</div>;
  }
  
  // Select transition variants based on type
  const getVariants = () => {
    switch (transitionType) {
      case 'fade': return fadeTransitionVariants;
      case 'slide': return slideTransitionVariants;
      case 'scale': return scaleTransitionVariants;
      case 'mystical': return mysticalTransitionVariants;
      case 'page':
      default: return pageTransitionVariants;
    }
  };
  
  // Adjust transition settings for staggered children
  const getTransition = () => {
    if (staggerChildren) {
      return {
        staggerChildren: getAnimationDuration(staggerDelay),
        delayChildren: getAnimationDuration(0.1)
      };
    }
    return {};
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={getVariants()}
        layoutId={layoutId}
        custom={transitionType === 'slide' ? slideDirection : undefined}
        transition={getTransition()}
        {...motionProps}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedContainer;
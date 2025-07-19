import { Variants } from 'framer-motion';

// Standard page transition variants
export const pageTransitionVariants: Variants = {
  initial: { 
    opacity: 0,
    y: 20
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

// Fade transition variants
export const fadeTransitionVariants: Variants = {
  initial: { 
    opacity: 0 
  },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Slide transition variants
export const slideTransitionVariants: Variants = {
  initial: (custom: "left" | "right" | "up" | "down" = "right") => {
    const directions = {
      left: { x: -50, y: 0 },
      right: { x: 50, y: 0 },
      up: { x: 0, y: -50 },
      down: { x: 0, y: 50 }
    };
    return {
      opacity: 0,
      ...directions[custom]
    };
  },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: (custom: "left" | "right" | "up" | "down" = "left") => {
    const directions = {
      left: { x: -50, y: 0 },
      right: { x: 50, y: 0 },
      up: { x: 0, y: -50 },
      down: { x: 0, y: 50 }
    };
    return {
      opacity: 0,
      ...directions[custom],
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    };
  }
};

// Scale transition variants
export const scaleTransitionVariants: Variants = {
  initial: { 
    opacity: 0,
    scale: 0.9
  },
  animate: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Mystical transition with glow effect
export const mysticalTransitionVariants: Variants = {
  initial: { 
    opacity: 0,
    scale: 0.95,
    filter: "blur(8px) brightness(1.2)"
  },
  animate: { 
    opacity: 1,
    scale: 1,
    filter: "blur(0px) brightness(1)",
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    scale: 1.02,
    filter: "blur(8px) brightness(1.2)",
    transition: {
      duration: 0.5,
      ease: "easeIn"
    }
  }
};
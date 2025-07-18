import { Variants, Transition } from 'framer-motion';

// Common animation variants for consistent motion design
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export const slideInFromRight: Variants = {
  initial: {
    x: '100%',
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: '-100%',
    opacity: 0,
  },
};

// Tarot card specific animations
export const cardFlip: Variants = {
  initial: {
    rotateY: 0,
    scale: 1,
  },
  flip: {
    rotateY: 180,
    scale: 1.05,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
  reveal: {
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      delay: 0.2,
    },
  },
};

export const cardDraw: Variants = {
  initial: {
    scale: 1,
    y: 0,
    rotateZ: 0,
  },
  hover: {
    scale: 1.05,
    y: -10,
    rotateZ: 2,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  draw: {
    scale: 1.2,
    y: -50,
    rotateZ: 5,
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
    },
  },
};

export const deckShuffle: Variants = {
  initial: {
    rotateZ: 0,
    x: 0,
  },
  shuffle: {
    rotateZ: [0, -2, 2, -1, 1, 0],
    x: [0, -5, 5, -3, 3, 0],
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
    },
  },
};

// Page transition animations
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

// Common transition configurations
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const easeTransition: Transition = {
  duration: 0.3,
  ease: 'easeInOut',
};

export const slowTransition: Transition = {
  duration: 0.6,
  ease: 'easeInOut',
};

// Stagger animation for multiple elements
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

// Loading spinner animation
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Modal animations
export const modalBackdrop: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export const modalContent: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.2,
    },
  },
};

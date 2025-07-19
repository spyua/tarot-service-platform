import { Variants } from 'framer-motion';

// Card draw animation variants
export const cardDrawVariants: Variants = {
  initial: { 
    scale: 0.95, 
    opacity: 0,
    y: 20,
    rotateY: 0,
    z: 0 
  },
  draw: {
    scale: 1.05,
    opacity: 1,
    y: 0,
    rotateY: 180,
    z: 50,
    transition: {
      duration: 0.8,
      ease: "easeInOut"
    }
  },
  reveal: {
    scale: 1,
    opacity: 1,
    y: 0,
    rotateY: 0,
    z: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.2
    }
  },
  hover: {
    scale: 1.05,
    y: -5,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.3
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

// Card flip animation variants
export const cardFlipVariants: Variants = {
  front: {
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  },
  back: {
    rotateY: 180,
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

// Card shuffle animation variants
export const cardShuffleVariants: Variants = {
  initial: {
    x: 0,
    y: 0,
    rotate: 0
  },
  shuffle: (custom: number) => ({
    x: Math.sin(custom * 0.5) * 10,
    y: Math.cos(custom * 0.5) * 5,
    rotate: Math.sin(custom * 0.8) * 5,
    transition: {
      repeat: 3,
      repeatType: "mirror" as const,
      duration: 0.5,
      ease: "easeInOut"
    }
  }),
  rest: {
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Card spread animation variants
export const cardSpreadVariants: Variants = {
  initial: {
    x: 0,
    opacity: 0,
    scale: 0.8
  },
  animate: (custom: number) => ({
    x: custom,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: custom * 0.01,
      ease: "easeOut"
    }
  }),
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3
    }
  }
};

// Card details expand animation
export const cardDetailsVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};
import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeInUp } from '@/utils/animations';

interface AnimatedContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
}

/**
 * A reusable animated container component using Framer Motion
 * Demonstrates proper integration of Framer Motion with TypeScript
 */
export default function AnimatedContainer({
  children,
  className = '',
  ...motionProps
}: AnimatedContainerProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

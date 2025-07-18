import React from 'react';
import { motion } from 'framer-motion';

type LoadingSize = 'sm' | 'md' | 'lg';
type LoadingVariant = 'spinner' | 'dots' | 'pulse';

interface LoadingSpinnerProps {
  size?: LoadingSize;
  variant?: LoadingVariant;
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  className = ''
}) => {
  // Size styles
  const sizeStyles = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const containerSizeStyles = {
    sm: 'min-h-[100px]',
    md: 'min-h-[200px]',
    lg: 'min-h-[300px]'
  };

  // Spinner variant
  const SpinnerVariant = () => (
    <motion.div
      className={`${sizeStyles[size]} border-4 border-primary-200 border-t-primary-600 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );

  // Dots variant
  const DotsVariant = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} bg-primary-600 rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  );

  // Pulse variant
  const PulseVariant = () => (
    <motion.div
      className={`${sizeStyles[size]} bg-primary-600 rounded-full`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  const renderVariant = () => {
    switch (variant) {
      case 'dots':
        return <DotsVariant />;
      case 'pulse':
        return <PulseVariant />;
      default:
        return <SpinnerVariant />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerSizeStyles[size]} ${className}`}>
      {renderVariant()}
      {text && (
        <motion.p
          className="mt-4 text-sm text-gray-600 font-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
import React, { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

// Card variants
type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'rounded-xl transition-all duration-200';

    // Variant styles
    const variantStyles = {
      default: 'bg-white border border-gray-200 shadow-sm',
      elevated: 'bg-white shadow-lg border border-gray-100',
      outlined: 'bg-white border-2 border-primary-200 shadow-none',
      glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg'
    };

    // Padding styles
    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    };

    // Hover styles
    const hoverStyles = hoverable 
      ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' 
      : '';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}`.trim();

    const MotionCard = motion.div;

    return (
      <MotionCard
        ref={ref}
        className={combinedClassName}
        whileHover={hoverable ? { y: -4, scale: 1.02 } : undefined}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        {...(props as any)}
      >
        {children}
      </MotionCard>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components for better composition
export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => (
  <div className={`border-b border-gray-200 pb-3 mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => (
  <h3 className={`text-lg font-semibold text-gray-900 font-primary ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => (
  <p className={`text-sm text-gray-600 font-secondary ${className}`}>
    {children}
  </p>
);

export const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => (
  <div className={`${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => (
  <div className={`border-t border-gray-200 pt-3 mt-4 ${className}`}>
    {children}
  </div>
);

export default Card;
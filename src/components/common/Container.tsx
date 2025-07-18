import React, { HTMLAttributes, forwardRef } from 'react';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

interface ContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  size?: ContainerSize;
  centered?: boolean;
  padding?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'lg', centered = true, padding = true, className = '', children, ...props }, ref) => {
    // Base styles
    const baseStyles = 'w-full';

    // Size styles
    const sizeStyles = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      '2xl': 'max-w-7xl',
      full: 'max-w-full'
    };

    // Centering styles
    const centerStyles = centered ? 'mx-auto' : '';

    // Padding styles
    const paddingStyles = padding ? 'px-4 sm:px-6 lg:px-8' : '';

    const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${centerStyles} ${paddingStyles} ${className}`.trim();

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export default Container;
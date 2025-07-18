import React, { HTMLAttributes, forwardRef } from 'react';

// Grid container props
interface GridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    xs?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  };
  className?: string;
  children: React.ReactNode;
}

// Grid item props
interface GridItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  responsive?: {
    xs?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  };
  className?: string;
  children: React.ReactNode;
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 12, gap = 'md', responsive, className = '', children, ...props }, ref) => {
    // Base grid styles
    const baseStyles = 'grid';

    // Gap styles
    const gapStyles = {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8'
    };

    // Column styles
    const colStyles = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      12: 'grid-cols-12'
    };

    // Responsive styles
    const responsiveStyles = responsive ? Object.entries(responsive)
      .map(([breakpoint, cols]) => {
        const prefix = breakpoint === 'xs' ? '' : `${breakpoint}:`;
        return `${prefix}${colStyles[cols]}`;
      })
      .join(' ') : '';

    const combinedClassName = `${baseStyles} ${colStyles[cols]} ${gapStyles[gap]} ${responsiveStyles} ${className}`.trim();

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  ({ span = 1, responsive, className = '', children, ...props }, ref) => {
    // Span styles
    const spanStyles = {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6',
      12: 'col-span-12'
    };

    // Responsive styles
    const responsiveStyles = responsive ? Object.entries(responsive)
      .map(([breakpoint, span]) => {
        const prefix = breakpoint === 'xs' ? '' : `${breakpoint}:`;
        return `${prefix}${spanStyles[span]}`;
      })
      .join(' ') : '';

    const combinedClassName = `${spanStyles[span]} ${responsiveStyles} ${className}`.trim();

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';
GridItem.displayName = 'GridItem';

export { Grid, GridItem };
export default Grid;
'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type ContainerWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Predefined maximum width of the container
   * @default 'xl'
   */
  maxWidth?: ContainerWidth;
  
  /**
   * Custom maximum width of the container (overrides maxWidth)
   */
  customMaxWidth?: string;
  
  /**
   * Whether to center the container horizontally
   * @default true
   */
  center?: boolean;
  
  /**
   * Whether to apply horizontal padding
   * @default true
   */
  padding?: boolean;
  
  /**
   * Whether to apply responsive padding based on screen size
   * @default true
   */
  responsivePadding?: boolean;
  
  /**
   * Additional classes to apply to the container
   */
  className?: string;
  
  /**
   * Content of the container
   */
  children: React.ReactNode;
}

/**
 * Container component for consistent layout and spacing
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(({
  maxWidth = 'xl',
  customMaxWidth,
  center = true,
  padding = true,
  responsivePadding = true,
  className,
  children,
  ...props
}, ref) => {
  
  // Define max-width classes based on the maxWidth prop
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };
  
  // Define padding classes
  const paddingClasses = padding
    ? responsivePadding
      ? 'px-4 sm:px-6 md:px-8'
      : 'px-4'
    : '';
  
  // Combine all classes
  const containerClasses = cn(
    // If custom max-width is provided, use it, otherwise use the predefined class
    customMaxWidth ? '' : maxWidthClasses[maxWidth],
    // Center the container horizontally if specified
    center ? 'mx-auto' : '',
    // Apply padding if specified
    paddingClasses,
    // Include any custom classes
    className
  );
  
  return (
    <div 
      ref={ref}
      className={containerClasses}
      style={customMaxWidth ? { maxWidth: customMaxWidth } : undefined}
      {...props}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container';

export default Container;


'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'solid' | 'outline' | 'soft';
export type BadgeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The variant of the badge
   * @default 'solid'
   */
  variant?: BadgeVariant;
  
  /**
   * The color of the badge
   * @default 'primary'
   */
  color?: BadgeColor;
  
  /**
   * The size of the badge
   * @default 'md'
   */
  size?: BadgeSize;
  
  /**
   * Icon to display before the badge text
   */
  icon?: React.ReactNode;
  
  /**
   * Whether the badge is dismissible
   * @default false
   */
  dismissible?: boolean;
  
  /**
   * Function to call when dismiss button is clicked
   */
  onDismiss?: () => void;
  
  /**
   * Whether to show a dot indicator
   * @default false
   */
  dot?: boolean;
  
  /**
   * A numeric value for counter badges
   */
  count?: number;
  
  /**
   * Maximum count to display before showing "+"
   * @default 99
   */
  maxCount?: number;
  
  /**
   * If provided, the badge will render as a link
   */
  href?: string;
  
  /**
   * Whether the badge should be rounded
   * @default true
   */
  rounded?: boolean;
  
  /**
   * Whether to use a full rounded pill style
   * @default false
   */
  pill?: boolean;
  
  /**
   * Additional classes to apply to the badge
   */
  className?: string;
  
  /**
   * Badge content
   */
  children?: React.ReactNode;
}

/**
 * Badge component for displaying status indicators, counts, or tags
 */
export const Badge = forwardRef<HTMLDivElement, BadgeProps>(({
  variant = 'solid',
  color = 'primary',
  size = 'md',
  icon,
  dismissible = false,
  onDismiss,
  dot = false,
  count,
  maxCount = 99,
  href,
  rounded = true,
  pill = false,
  className,
  children,
  ...props
}, ref) => {
  // Base badge classes
  const baseClasses = 'inline-flex items-center justify-center';
  
  // Variant specific classes
  const variantClasses = {
    solid: {
      primary: 'bg-primary-500 text-white',
      secondary: 'bg-secondary-500 text-white',
      success: 'bg-success text-white',
      warning: 'bg-warning text-white',
      error: 'bg-error text-white',
      gray: 'bg-gray-600 text-white',
    },
    outline: {
      primary: 'border border-primary-500 text-primary-500',
      secondary: 'border border-secondary-500 text-secondary-500',
      success: 'border border-success text-success',
      warning: 'border border-warning text-warning',
      error: 'border border-error text-error',
      gray: 'border border-gray-600 text-gray-600',
    },
    soft: {
      primary: 'bg-primary-100 text-primary-800',
      secondary: 'bg-secondary-100 text-secondary-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-amber-100 text-amber-800',
      error: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800',
    },
  };
  
  // Size specific classes
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-2.5',
    lg: 'text-base py-1.5 px-3',
  };
  
  // Shape classes
  const shapeClasses = pill 
    ? 'rounded-full' 
    : (rounded ? 'rounded-md' : '');
  
  // Counter badge formats the display of count
  const displayCount = count !== undefined 
    ? (count > maxCount ? `${maxCount}+` : count.toString()) 
    : null;
  
  // Dot indicator style
  const dotClass = dot ? 'pr-2' : '';
  
  // Combine all classes
  const badgeClasses = cn(
    baseClasses,
    variantClasses[variant][color],
    sizeClasses[size],
    shapeClasses,
    dotClass,
    href && 'hover:opacity-90 cursor-pointer',
    className
  );
  
  // Dismiss button
  const DismissButton = () => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onDismiss?.();
      }}
      className="ml-1 -mr-1 h-4 w-4 rounded-full text-white/80 hover:text-white focus:outline-none"
      aria-label="Dismiss"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-3 w-3"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
  
  // Badge content
  const badgeContent = (
    <>
      {dot && (
        <span className={cn(
          'h-2 w-2 rounded-full mr-1.5',
      variant === 'outline' || variant === 'soft' 
        ? color === 'primary' ? 'bg-primary-500' :
          color === 'secondary' ? 'bg-secondary-500' :
          color === 'success' ? 'bg-success' :
          color === 'warning' ? 'bg-warning' :
          color === 'error' ? 'bg-error' : 'bg-gray-500'
        : 'bg-white'
        )} />
      )}
      {icon && <span className="mr-1.5">{icon}</span>}
      {displayCount !== null ? displayCount : children}
      {dismissible && <DismissButton />}
    </>
  );
  
  // If href is provided, render as a link
  if (href) {
    return (
      <Link
        href={href}
        className={badgeClasses}
        {...props as any}
      >
        {badgeContent}
      </Link>
    );
  }
  
  // Otherwise render as a div
  return (
    <div ref={ref} className={badgeClasses} {...props}>
      {badgeContent}
    </div>
  );
});

Badge.displayName = 'Badge';

export default Badge;


'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * The size of the button
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * Whether the button should take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Icon to display before the button text
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icon to display after the button text
   */
  rightIcon?: React.ReactNode;
  
  /**
   * If provided, the button will render as an anchor element
   */
  href?: string;
  
  /**
   * Additional classes to apply to the button
   */
  className?: string;
  
  /**
   * Whether the link should be opened in a new tab
   * @default false
   */
  openInNewTab?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  href,
  className,
  children,
  disabled,
  openInNewTab = false,
  ...props
}, ref) => {
  // Base button classes
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    link: 'bg-transparent underline-offset-4 hover:underline text-primary-500 p-0 h-auto',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };
  
  // Full width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClasses,
    className
  );
  
  // Loading indicator
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
  
  // Render as link if href is provided
  if (href) {
    return (
      <Link
        href={href}
        className={buttonClasses}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {isLoading && <LoadingSpinner />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </Link>
    );
  }
  
  // Otherwise render as button
  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;


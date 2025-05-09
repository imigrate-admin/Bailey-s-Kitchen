"use client"

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * Whether the button should take full width
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Icon to display at the start of the button
   */
  startIcon?: React.ReactNode;
  
  /**
   * Icon to display at the end of the button
   */
  endIcon?: React.ReactNode;
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * URL to navigate to when the button is clicked (turns the button into a link)
   */
  href?: string;
  
  /**
   * Whether the link should open in a new tab
   * @default false
   */
  openInNewTab?: boolean;
}

/**
 * Button component that can be rendered as a button or a link
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  startIcon,
  endIcon,
  isLoading = false,
  href,
  openInNewTab,
  className,
  disabled,
  children,
  ...props
}, ref) => {
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    outline: 'bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    link: 'bg-transparent text-primary-500 hover:text-primary-600 hover:underline p-0 h-auto',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };
  
  // Common classes
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
    'disabled:opacity-50 disabled:pointer-events-none',
    variant !== 'link' && sizeClasses[size],
    variantClasses[variant],
    fullWidth && 'w-full',
    isLoading && 'opacity-70 pointer-events-none',
    className
  );
  
  // Loading spinner
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
  
  // Button content
  const ButtonContent = () => (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {!isLoading && endIcon && <span className="ml-2">{endIcon}</span>}
    </>
  );
  
  // Render as link if href is provided
  if (href) {
    return (
      <Link
        href={href}
        className={baseClasses}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
      >
        <ButtonContent />
      </Link>
    );
  }
  
  // Render as button otherwise
  return (
    <button
      ref={ref}
      className={baseClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      <ButtonContent />
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

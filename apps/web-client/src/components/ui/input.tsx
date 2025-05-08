'use client';

import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input size variant
   * @default 'md'
   */
  size?: InputSize;
  
  /**
   * Whether input is in an error state
   * @default false
   */
  error?: boolean;
  
  /**
   * Error message to display
   */
  errorMessage?: string;
  
  /**
   * Label text for the input
   */
  label?: string;
  
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  
  /**
   * Whether the input is in a loading state
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Icon or element to display on the left side of the input
   */
  leftAddon?: React.ReactNode;
  
  /**
   * Icon or element to display on the right side of the input
   */
  rightAddon?: React.ReactNode;
  
  /**
   * Whether the input should take the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Additional classes for the input wrapper
   */
  wrapperClassName?: string;
  
  /**
   * Additional classes for the input element
   */
  inputClassName?: string;
  
  /**
   * Id for the input and label
   */
  id?: string;
  
  /**
   * Whether to show a toggle button for password input
   * @default true for password type
   */
  showPasswordToggle?: boolean;
}

/**
 * Input component for text entry
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  size = 'md',
  error = false,
  errorMessage,
  label,
  helperText,
  isLoading = false,
  leftAddon,
  rightAddon,
  fullWidth = false,
  wrapperClassName,
  inputClassName,
  id: propId,
  className,
  disabled,
  type = 'text',
  showPasswordToggle,
  ...props
}, ref) => {
  // Generate an ID if not provided
  const id = propId || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const shouldShowPasswordToggle = showPasswordToggle !== undefined ? showPasswordToggle : isPassword;
  
  // Size classes
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-5 text-lg',
  };
  
  // Base input classes
  const inputClasses = cn(
    'flex-grow bg-white border rounded-md transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100',
    error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-300',
    leftAddon ? 'rounded-l-none' : '',
    rightAddon || (isPassword && shouldShowPasswordToggle) ? 'rounded-r-none' : '',
    sizeClasses[size],
    inputClassName
  );
  
  // Wrapper classes
  const wrapperClasses = cn(
    'relative',
    fullWidth ? 'w-full' : '',
    wrapperClassName
  );
  
  // Loading spinner
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4 text-gray-500"
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
  
  // Password toggle button
  const PasswordToggle = () => (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="px-3 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
      tabIndex={-1}
    >
      {showPassword ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  );
  
  return (
    <div className={wrapperClasses}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      {/* Input group */}
      <div className="flex relative">
        {/* Left addon */}
        {leftAddon && (
          <div className={cn(
            'inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md',
            error ? 'border-red-500' : '',
            disabled ? 'opacity-50 bg-gray-100' : '',
            sizeClasses[size].replace(/px-\d+/, ''),
          )}>
            {leftAddon}
          </div>
        )}
        
        {/* Input element */}
        <input
          ref={ref}
          id={id}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={cn(inputClasses, className)}
          disabled={disabled || isLoading}
          {...props}
        />
        
        {/* Right addon or password toggle */}
        {(rightAddon || isLoading || (isPassword && shouldShowPasswordToggle)) && (
          <div className={cn(
            'inline-flex items-center border border-l-0 border-gray-300 rounded-r-md',
            error ? 'border-red-500' : '',
            disabled ? 'opacity-50 bg-gray-100' : '',
            rightAddon ? 'px-3 bg-gray-50 text-gray-500' : 'bg-white',
            sizeClasses[size].replace(/px-\d+/, ''),
          )}>
            {isLoading ? <LoadingSpinner /> : rightAddon}
            {isPassword && shouldShowPasswordToggle && <PasswordToggle />}
          </div>
        )}
      </div>
      
      {/* Helper text or error message */}
      {(helperText || errorMessage) && (
        <div className={cn(
          'text-xs mt-1',
          error ? 'text-red-500' : 'text-gray-500'
        )}>
          {error ? errorMessage : helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;


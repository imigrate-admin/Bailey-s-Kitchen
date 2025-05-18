import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  /**
   * Array of options for the select
   */
  options: SelectOption[];
  
  /**
   * Error state
   */
  error?: boolean;
  
  /**
   * Error message
   */
  errorMessage?: string;
  
  /**
   * Helper text
   */
  helperText?: string;
  
  /**
   * Label text
   */
  label?: string;
  
  /**
   * Whether the select is in a loading state
   */
  isLoading?: boolean;
  
  /**
   * Whether the select should take up the full width of its container
   */
  fullWidth?: boolean;
  
  /**
   * Additional classes for the wrapper element
   */
  wrapperClassName?: string;
  
  /**
   * Callback when value changes
   */
  onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  options,
  error,
  errorMessage,
  helperText,
  label,
  isLoading,
  fullWidth,
  wrapperClassName,
  disabled,
  onChange,
  ...props
}, ref) => {
  // Base classes for the select
  const selectClasses = cn(
    'block rounded-md border transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100',
    error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
      : 'border-gray-300',
    'h-10 px-3 text-base',
    className
  );

  // Wrapper classes
  const wrapperClasses = cn(
    'space-y-2',
    fullWidth && 'w-full',
    wrapperClassName
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={wrapperClasses}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Select */}
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          disabled={disabled || isLoading}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-50/50 flex items-center justify-center rounded-md">
            <svg
              className="animate-spin h-5 w-5 text-primary"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Helper text or error message */}
      {(helperText || errorMessage) && (
        <p className={cn(
          'text-sm',
          error ? 'text-red-600' : 'text-gray-500'
        )}>
          {error ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select'; 
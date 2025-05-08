'use client';

import React, { forwardRef, ReactElement, ComponentType } from 'react';
import { 
  useForm, 
  UseFormReturn, 
  SubmitHandler, 
  FieldValues,
  UseFormProps,
  FieldPath,
  FieldError,
  Controller,
  Path,
  ControllerRenderProps,
  ControllerFieldState,
  ControllerProps
} from 'react-hook-form';
import { cn } from '@/lib/utils';

/* --- Form Component --- */
export interface FormProps<TFormValues extends FieldValues> extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /**
   * Form methods from useForm hook
   */
  form?: UseFormReturn<TFormValues>;
  
  /**
   * Form submission handler
   */
  onSubmit?: SubmitHandler<TFormValues>;
  
  /**
   * Whether the form is in a loading state
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Whether to disable all form inputs when loading
   * @default true
   */
  disableWhileLoading?: boolean;
  
  /**
   * General form error message
   */
  formError?: string;
  
  /**
   * Children components
   */
  children: React.ReactNode;
  
  /**
   * Form layout
   * @default 'stacked'
   */
  layout?: 'stacked' | 'inline';
  
  /**
   * Additional classes for the form
   */
  className?: string;
}

function Form<TFormValues extends FieldValues>({
  form,
  onSubmit,
  isLoading = false,
  disableWhileLoading = true,
  formError,
  children,
  layout = 'stacked',
  className,
  ...props
}: FormProps<TFormValues>) {
  // Compute classes
  const formClasses = cn(
    'space-y-6',
    layout === 'inline' && 'flex items-end gap-4 space-y-0',
    className
  );
  
  return (
    <form
      onSubmit={form ? form.handleSubmit(onSubmit || (() => {})) : undefined}
      className={formClasses}
      {...props}
    >
      {/* Form error message */}
      {formError && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{formError}</span>
        </div>
      )}
      
      {/* Form content */}
      <fieldset disabled={isLoading && disableWhileLoading} className="space-y-6">
        {children}
      </fieldset>
    </form>
  );
}

/* --- Form Field Component --- */
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Form field label
   */
  label?: string;
  
  /**
   * Form field name (used for error display)
   */
  name?: string;
  
  /**
   * Error message to display
   */
  error?: string | FieldError;
  
  /**
   * Helper text to display
   */
  helperText?: string;
  
  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;
  
  /**
   * Field layout
   * @default 'stacked'
   */
  layout?: 'stacked' | 'horizontal';
  
  /**
   * Children components
   */
  children: React.ReactNode;
  
  /**
   * Additional classes for the field
   */
  className?: string;
}

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(({
  label,
  name,
  error,
  helperText,
  required = false,
  layout = 'stacked',
  children,
  className,
  ...props
}, ref) => {
  // Generate ID if not provided
  const id = name ? `field-${name}` : undefined;
  
  // Get error message string
  const errorMessage = typeof error === 'object' ? error.message : error;
  
  // Compute classes
  const fieldClasses = cn(
    layout === 'horizontal' ? 'sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start' : 'space-y-2',
    className
  );
  
  return (
    <div ref={ref} className={fieldClasses} {...props}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={id} 
          className={cn(
            'block text-sm font-medium text-gray-700',
            required && 'required',
            layout === 'horizontal' && 'sm:mt-2'
          )}
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {/* Field content */}
      <div className={layout === 'horizontal' ? 'sm:col-span-2' : ''}>
        {children}
        
        {/* Error message or helper text */}
        {(errorMessage || helperText) && (
          <p className={cn(
            'mt-1 text-xs',
            errorMessage ? 'text-red-500' : 'text-gray-500'
          )}>
            {errorMessage || helperText}
          </p>
        )}
      </div>
    </div>
  );
});

FormField.displayName = 'FormField';

/* --- Form Section Component --- */
export interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Section title
   */
  title?: string;
  
  /**
   * Section description
   */
  description?: string;
  
  /**
   * Whether to show a divider above this section
   * @default false
   */
  divider?: boolean;
  
  /**
   * Children components
   */
  children: React.ReactNode;
  
  /**
   * Additional classes for the section
   */
  className?: string;
}

const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(({
  title,
  description,
  divider = false,
  children,
  className,
  ...props
}, ref) => {
  return (
    <div 
      ref={ref} 
      className={cn(
        'space-y-6',
        divider && 'border-t border-gray-200 pt-6',
        className
      )}
      {...props}
    >
      {/* Section header */}
      {(title || description) && (
        <div className="space-y-1 mb-4">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      )}
      
      {/* Section content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
});

FormSection.displayName = 'FormSection';

/* --- Form Actions Component --- */
export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to show a divider above the actions
   * @default true
   */
  divider?: boolean;
  
  /**
   * Whether the form is in a loading state
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Children components (usually buttons)
   */
  children: React.ReactNode;
  
  /**
   * Alignment of the actions
   * @default 'right'
   */
  align?: 'left' | 'center' | 'right' | 'between';
  
  /**
   * Additional classes for the actions
   */
  className?: string;
}

const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(({
  divider = true,
  isLoading = false,
  children,
  align = 'right',
  className,
  ...props
}, ref) => {
  // Compute alignment classes
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-wrap',
        alignmentClasses[align],
        divider && 'border-t border-gray-200 pt-5 mt-6',
        className
      )}
      {...props}
    >
      {/* If form is loading, show a spinner */}
      {isLoading && (
        <div className="flex items-center pr-4">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary"
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
          <span className="text-gray-500 text-sm">Processing...</span>
        </div>
      )}
      
      {/* Actions (buttons) */}
      <div className="flex gap-3">
        {children}
      </div>
    </div>
  );
});

FormActions.displayName = 'FormActions';

/* --- Form Controller Component (for React Hook Form integration) --- */
export interface FormControlProps<
  TFormValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFormValues> = FieldPath<TFormValues>
> {
  /**
   * Field name in the form values object
   */
  name: TName;
  
  /**
   * Form methods from useForm hook
   */
  form: UseFormReturn<TFormValues>;
  
  /**
   * Children component (usually an input)
   */
  children: ReactElement;
  
  /**
   * Custom render function
   */
  render?: (props: {
    field: ControllerRenderProps<TFormValues, TName>;
    fieldState: ControllerFieldState;
  }) => ReactElement;
}

function FormControl<
  TFormValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFormValues> = FieldPath<TFormValues>
>({
  name,
  form,
  children,
  render,
}: FormControlProps<TFormValues, TName>) {
  // Use type assertion to bypass JSX limitations with generic components
  const ControllerComponent = Controller as ComponentType<ControllerProps<TFormValues, TName>>;
  
  return (
    <ControllerComponent
      name={name}
      control={form.control}
      render={({ field, fieldState }) => 
        render ? 
          render({ field, fieldState }) : 
          React.cloneElement(children, {
            ...field,
            error: fieldState.invalid,
            errorMessage: fieldState.error?.message,
          })
      }
    />
  );
}

/* --- Export all form components --- */
export {
  useForm,
  Form,
  FormField,
  FormSection,
  FormActions,
  FormControl,
};


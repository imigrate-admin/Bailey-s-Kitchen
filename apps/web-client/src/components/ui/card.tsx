'use client';

import React, { forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export type CardVariant = 'default' | 'interactive' | 'outlined';
export type CardShadow = 'none' | 'sm' | 'md' | 'lg';

// Define interfaces for card subcomponents
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  children: React.ReactNode;
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children: React.ReactNode;
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  src: string;
  alt: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  position?: 'top' | 'bottom' | 'center';
  fill?: boolean;
  width?: number;
  height?: number;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card variant determines the visual style
   * @default 'default'
   */
  variant?: CardVariant;
  
  /**
   * Shadow size to apply to the card
   * @default 'sm'
   */
  shadow?: CardShadow;
  
  /**
   * Whether the card is in a loading state
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Whether the card should take the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Padding size to apply to the card
   * @default 'default'
   */
  padding?: 'none' | 'sm' | 'default' | 'lg';
  
  /**
   * If provided, the entire card will be clickable and navigate to this URL
   */
  href?: string;
  
  /**
   * Custom border radius
   * @default 'default'
   */
  borderRadius?: 'none' | 'sm' | 'default' | 'lg' | 'full';
  
  /**
   * Whether the card should have a border
   * @default depends on variant
   */
  hasBorder?: boolean;
  
  /**
   * Additional classes to apply to the card
   */
  className?: string;
  
  /**
   * React children
   */
  children: React.ReactNode;
}

// Define the CardComponent type with all subcomponents
type CardComponent = ForwardRefExoticComponent<CardProps & RefAttributes<HTMLDivElement>> & {
  Header: ForwardRefExoticComponent<CardHeaderProps & RefAttributes<HTMLDivElement>>;
  Title: ForwardRefExoticComponent<CardTitleProps & RefAttributes<HTMLHeadingElement>>;
  Description: ForwardRefExoticComponent<CardDescriptionProps & RefAttributes<HTMLParagraphElement>>;
  Body: ForwardRefExoticComponent<CardBodyProps & RefAttributes<HTMLDivElement>>;
  Footer: ForwardRefExoticComponent<CardFooterProps & RefAttributes<HTMLDivElement>>;
  Media: ForwardRefExoticComponent<CardMediaProps & RefAttributes<HTMLDivElement>>;
};

/**
 * Card component for displaying content in a contained area
 */
const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  shadow = 'sm',
  isLoading = false,
  fullWidth = false,
  padding = 'default',
  href,
  borderRadius = 'default',
  hasBorder,
  className,
  children,
  ...props
}, ref) => {
  // Determine if border should be shown based on variant if not explicitly set
  const shouldHaveBorder = hasBorder !== undefined ? hasBorder : variant === 'outlined';

  // Base card classes
  const baseClasses = cn(
    'bg-white overflow-hidden',
    fullWidth ? 'w-full' : '',
    {
      // Border radius classes
      'rounded-none': borderRadius === 'none',
      'rounded-sm': borderRadius === 'sm',
      'rounded-lg': borderRadius === 'default',
      'rounded-xl': borderRadius === 'lg',
      'rounded-full': borderRadius === 'full',
      
      // Border classes
      'border border-gray-200': shouldHaveBorder,
      
      // Shadow classes
      'shadow-none': shadow === 'none',
      'shadow-sm': shadow === 'sm',
      'shadow-md': shadow === 'md',
      'shadow-lg': shadow === 'lg',
      
      // Padding classes
      'p-0': padding === 'none',
      'p-3': padding === 'sm',
      'p-5': padding === 'default',
      'p-6': padding === 'lg',
      
      // Interactive variant
      'transition-all duration-200 hover:shadow-md': variant === 'interactive',
      
      // Loading state
      'animate-pulse': isLoading
    },
    className
  );
  
  // If card has href, wrap in Link
  if (href) {
    return (
      <Link href={href} className={cn(baseClasses, 'block')}>
        <div ref={ref} {...props}>
          {isLoading ? <CardSkeleton /> : children}
        </div>
      </Link>
    );
  }
  
  return (
    <div ref={ref} className={baseClasses} {...props}>
      {isLoading ? <CardSkeleton /> : children}
    </div>
  );
});

Card.displayName = 'Card';

// Card Header Component
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div 
      ref={ref}
      className={cn('mb-4', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

// Card Title Component
const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({
  as: Tag = 'h3',
  className,
  children,
  ...props
}, ref) => {
  return (
    <Tag 
      ref={ref}
      className={cn('text-lg font-semibold', className)}
      {...props}
    >
      {children}
    </Tag>
  );
});

CardTitle.displayName = 'CardTitle';

// Card Description Component
const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <p 
      ref={ref}
      className={cn('text-sm text-gray-500', className)}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

// Card Body Component
const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div 
      ref={ref}
      className={cn('', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardBody.displayName = 'CardBody';

// Card Footer Component
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div 
      ref={ref}
      className={cn('mt-4 pt-4 border-t border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

// Card Media Component
const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(({
  className,
  src,
  alt,
  aspectRatio = '16:9',
  position = 'center',
  fill = false,
  width,
  height,
  ...props
}, ref) => {
  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    'auto': '',
  };
  
  return (
    <div 
      ref={ref}
      className={cn(
        'relative overflow-hidden', 
        aspectRatio !== 'auto' && aspectRatioClasses[aspectRatio],
        className
      )}
      {...props}
    >
      <Image 
        src={src} 
        alt={alt} 
        fill={fill}
        width={!fill ? width || 500 : undefined}
        height={!fill ? height || 500 : undefined}
        className={cn(
          'object-cover w-full h-full',
          position === 'top' && 'object-top',
          position === 'bottom' && 'object-bottom',
          position === 'center' && 'object-center',
        )}
      />
    </div>
  );
});

CardMedia.displayName = 'CardMedia';

// Card Skeleton (for loading state)
const CardSkeleton = () => {
  return (
    <div className="space-y-3">
      <div className="h-40 bg-gray-200 rounded-md"></div>
      <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded-md"></div>
      <div className="h-3 bg-gray-200 rounded-md"></div>
      <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
    </div>
  );
};

// Attach child components to Card using type assertion
(Card as CardComponent).Header = CardHeader;
(Card as CardComponent).Title = CardTitle;
(Card as CardComponent).Description = CardDescription;
(Card as CardComponent).Body = CardBody;
(Card as CardComponent).Footer = CardFooter;
(Card as CardComponent).Media = CardMedia;

// Create a Card with components attached
const CardWithComponents = Card as CardComponent;

// Export components only - types/interfaces are already exported above
export {
  CardWithComponents as Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
  CardMedia
};


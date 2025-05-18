import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date into human readable string
 */
export function formatDate(
  date: Date | string | null | undefined, 
  format: string = 'medium', 
  locale: string = 'en-US'
): string {
  if (!date) return 'N/A';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    
    const options: Intl.DateTimeFormatOptions = {
      medium: {
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      },
      short: {
        month: 'numeric', 
        day: 'numeric'
      },
      full: {
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    }[format] as Intl.DateTimeFormatOptions;
    
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format currency value
 */
export function formatCurrency(
  amount: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a random ID
 */
export function generateId(length: number = 6): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Truncate a string to a specified length with ellipsis
 */
export function truncateString(str: string, length: number = 50): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

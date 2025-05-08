import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names and applies Tailwind's merge strategy
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency value
 */
export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format date into human readable string
 */
export function formatDate(date: Date | string, locale: string = 'en-US'): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Generate a random ID
 */
export function generateId(length: number = 6): string {
  return Math.random().toString(36).substring(2, 2 + length);
}


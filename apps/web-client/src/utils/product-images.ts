import { PetCategory } from '@/types/product';

/**
 * Maps product categories to their respective default images
 * @param category The product category
 * @returns The path to the category-specific image
 */
export const getCategoryImage = (category?: string): string => {
  const baseUrl = '/images/products/categories/';
  
  switch (category?.toLowerCase()) {
    case PetCategory.DOG:
      return `${baseUrl}dog-food.jpg`;
    case PetCategory.CAT:
      return `${baseUrl}cat-food.jpg`;
    case PetCategory.BIRD:
    case PetCategory.FISH:
    case PetCategory.SMALL_ANIMAL:
    default:
      return `${baseUrl}default.jpg`;
  }
};

/**
 * Formats image URLs to ensure they have proper leading slash
 * @param url The image URL
 * @returns Properly formatted image URL
 */
export const formatImageUrl = (url?: string): string => {
  if (!url) return '/images/products/categories/default.jpg';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return url.startsWith('/') ? url : `/${url}`;
};

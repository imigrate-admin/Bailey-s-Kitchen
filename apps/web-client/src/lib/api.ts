import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { PetCategory, Product } from '@/types/product';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates if a string is a valid UUID
 * @param id The string to validate
 * @returns True if the string is a valid UUID
 */
const isValidUUID = (id: string): boolean => {
  return UUID_REGEX.test(id);
};

interface ApiErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

const getApiUrl = () => {
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  if (!NEXT_PUBLIC_API_URL) {
    return 'http://localhost:5003/api/v1';
  }
  
  if (NEXT_PUBLIC_API_URL.includes('localhost') && typeof window === 'undefined') {
    return NEXT_PUBLIC_API_URL.replace('http://localhost', 'http://api');
  }
  
  return NEXT_PUBLIC_API_URL;
};

const API_URL = getApiUrl();

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      if (status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
      }
      
      throw new APIError(
        errorData?.message || 'An error occurred',
        status,
        errorData?.code || 'API_ERROR'
      );
    } else if (error.request) {
      throw new APIError(
        'No response received from server',
        0,
        'NETWORK_ERROR'
      );
    } else {
      throw new APIError(
        error.message || 'Request failed',
        0,
        'REQUEST_ERROR'
      );
    }
  }
);

const normalizeImageUrl = (url?: string): string => {
  if (!url) return '/images/product-placeholder.jpg';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return url.startsWith('/') ? url : `/${url}`;
};

const mapCategory = (category: string): PetCategory => {
  return category.toUpperCase() as PetCategory;
};

/**
 * Normalizes a product object ensuring proper typing and format
 * Validates that the product ID is a valid UUID
 * @param product Raw product data from API
 * @returns Normalized product with proper types
 */
const normalizeProduct = (product: any): Product => {
  // Validate the product ID is a valid UUID
  if (!product.id || !isValidUUID(product.id)) {
    console.warn(`Invalid product ID: ${product.id}`);
    // Generate a fallback ID for display purposes
    // This helps prevent rendering errors but flags the item as problematic
    product.id = `invalid-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    product._hasInvalidId = true;
  }

  return {
    ...product,
    category: mapCategory(product.category),
    price: Number(product.price),
    stock: product.stock || 0,
    image: normalizeImageUrl(product.image || product.imageUrl)
  };
};

/**
 * Extracts products from API response and normalizes them
 * Filters out products with invalid IDs to prevent rendering errors
 * @param response API response containing product data
 * @returns Array of normalized products
 */
const extractProducts = (response: any): Product[] => {
  let normalizedProducts: Product[] = [];
  
  if (Array.isArray(response)) {
    normalizedProducts = response.map(normalizeProduct);
  } else if (response.data) {
    normalizedProducts = Array.isArray(response.data) 
      ? response.data.map(normalizeProduct)
      : [normalizeProduct(response.data)];
  }
  
  // Filter out products with invalid IDs to prevent further errors
  const validProducts = normalizedProducts.filter(product => !product._hasInvalidId);
  
  // Log warning if any products were filtered out
  const filteredCount = normalizedProducts.length - validProducts.length;
  if (filteredCount > 0) {
    console.warn(`Filtered out ${filteredCount} products with invalid IDs`);
  }
  
  return validProducts;
};

const getApiCategory = (category?: PetCategory): string | undefined => {
  if (!category) return undefined;
  return category.toUpperCase();
};

export const productApi = {
  async getProducts(category?: PetCategory) {
    try {
      // Always use the main products endpoint with category as a query parameter
      const { data } = await api.get('/products', {
        params: category ? { category: getApiCategory(category) } : undefined
      });
      return extractProducts(data);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to fetch products', 500, 'UNKNOWN_ERROR');
    }
  },

  async getProduct(id: string) {
    try {
      // Validate UUID before making the API call
      if (!isValidUUID(id)) {
        throw new APIError('Invalid product ID format', 400, 'INVALID_UUID');
      }
      
      const { data } = await api.get(`/products/${id}`);
      return normalizeProduct(data);
    } catch (error: any) {
      console.error('Error fetching product:', error);
      if (error instanceof APIError && error.status === 404) {
        throw new APIError('Product not found', 404, 'PRODUCT_NOT_FOUND');
      }
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to fetch product', 500, 'UNKNOWN_ERROR');
    }
  },

  async searchProducts(query: string, category?: PetCategory) {
    try {
      const { data } = await api.get('/products/search', {
        params: { 
          q: query,
          ...(category && { category: getApiCategory(category) })
        }
      });
      return extractProducts(data);
    } catch (error: any) {
      console.error('Error searching products:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to search products', 500, 'UNKNOWN_ERROR');
    }
  }
};

export { api };
export default api;

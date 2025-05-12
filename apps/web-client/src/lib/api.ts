import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

/**
 * Generic API error class
 */
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

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      
      // Handle unauthorized errors
      if (status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
      }
      
      throw new APIError(
        error.response.data?.message || 'An error occurred',
        status,
        error.response.data?.code || 'API_ERROR'
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

/**
 * Product API functions
 */
export const productApi = {
  /**
   * Get all products, optionally filtered by category
   */
  async getProducts(category?: 'DOG' | 'CAT') {
    try {
      const { data } = await api.get('/products', {
        params: category ? { category } : undefined
      });
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to fetch products', 500, 'UNKNOWN_ERROR');
    }
  },

  /**

  /**
   * Get a single product by ID
   */
  async getProduct(id: string) {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      if (error instanceof APIError && error.status === 404) {
        throw new APIError('Product not found', 404, 'PRODUCT_NOT_FOUND');
      }
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to fetch product', 500, 'UNKNOWN_ERROR');
    }
  },

  /**
   * Search products
   */
  async searchProducts(query: string) {
    try {
      const { data } = await api.get('/products/search', {
        params: { q: query }
      });
      return data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to search products', 500, 'UNKNOWN_ERROR');
    }
  }
};

export { api };
export default api;


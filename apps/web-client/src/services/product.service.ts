import { apiRequest } from '../lib/api';
import { ApiResponse, Product } from '../types';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ProductFilters {
  category?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface CreateProductData {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  tags: string[];
  inStock: boolean;
}

/**
 * Product service for product-related operations
 */
export const productService = {
  /**
   * Get all products with pagination and filtering
   */
  async getProducts(filters: ProductFilters = {}): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return apiRequest<ApiResponse<PaginatedResponse<Product>>>({
      method: 'GET',
      url: '/products',
      params: {
        ...filters,
        tags: filters.tags?.join(','),
      },
    });
  },

  /**
   * Search products by keyword
   */
  async searchProducts(query: string, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return apiRequest<ApiResponse<PaginatedResponse<Product>>>({
      method: 'GET',
      url: '/products/search',
      params: {
        query,
        page,
        limit,
      },
    });
  },

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return apiRequest<ApiResponse<Product>>({
      method: 'GET',
      url: `/products/${id}`,
    });
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return apiRequest<ApiResponse<PaginatedResponse<Product>>>({
      method: 'GET',
      url: '/products',
      params: {
        category,
        page,
        limit,
      },
    });
  },

  /**
   * Get products by tag
   */
  async getProductsByTag(tag: string, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return apiRequest<ApiResponse<PaginatedResponse<Product>>>({
      method: 'GET',
      url: '/products',
      params: {
        tags: tag,
        page,
        limit,
      },
    });
  },

  /**
   * Create a new product (admin only)
   */
  async createProduct(data: CreateProductData): Promise<ApiResponse<Product>> {
    return apiRequest<ApiResponse<Product>>({
      method: 'POST',
      url: '/products',
      data,
    });
  },

  /**
   * Update an existing product (admin only)
   */
  async updateProduct(id: string, data: Partial<CreateProductData>): Promise<ApiResponse<Product>> {
    return apiRequest<ApiResponse<Product>>({
      method: 'PUT',
      url: `/products/${id}`,
      data,
    });
  },

  /**
   * Delete a product (admin only)
   */
  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    return apiRequest<ApiResponse<null>>({
      method: 'DELETE',
      url: `/products/${id}`,
    });
  },

  /**
   * Get available product categories
   */
  async getCategories(): Promise<ApiResponse<string[]>> {
    return apiRequest<ApiResponse<string[]>>({
      method: 'GET',
      url: '/products/categories',
    });
  },

  /**
   * Get popular tags
   */
  async getTags(): Promise<ApiResponse<string[]>> {
    return apiRequest<ApiResponse<string[]>>({
      method: 'GET',
      url: '/products/tags',
    });
  },
};


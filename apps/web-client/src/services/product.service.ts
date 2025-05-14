import api, { APIError } from '../lib/api';
import { ApiResponse } from '../types';
import { Product } from '../types/product';

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
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    try {
      const { data } = await api.get<ApiResponse<PaginatedResponse<Product>>>('/products', {
        params: {
          ...filters,
          tags: filters.tags?.join(','),
        },
      });

      // Ensure price is a number for all products
      const products = data.data.data.map((product) => ({
        ...product,
        price: Number(product.price), // Convert price to a number
        stock: product.stock || 0, // Ensure stock property is always present
      })) as Product[];

      return {
        ...data.data,
        data: products,
      };
    } catch (error: any) {
      console.error('Error fetching products:', error);
      throw error instanceof APIError
        ? error
        : new APIError('Failed to fetch products', 500, 'PRODUCT_ERROR');
    }
  },

  /**
   * Search products by keyword
   */
  async searchProducts(query: string, page = 1, limit = 20): Promise<PaginatedResponse<Product>> {
    try {
      const { data } = await api.get<ApiResponse<PaginatedResponse<Product>>>('/products/search', {
        params: {
          query,
          page,
          limit,
        },
      });

      // Ensure price is a number for all products
      const products = data.data.data.map((product) => ({
        ...product,
        price: Number(product.price), // Convert price to a number
        stock: product.stock || 0, // Ensure stock property is always present
      })) as Product[];

      return {
        ...data.data,
        data: products,
      };
    } catch (error: any) {
      console.error('Error searching products:', error);
      throw error instanceof APIError
        ? error
        : new APIError('Failed to search products', 500, 'PRODUCT_ERROR');
    }
  },

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product> {
    try {
      const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);

      // Ensure price is a number
      return {
        ...data.data,
        price: Number(data.data.price), // Convert price to a number
        stock: data.data.stock || 0, // Ensure stock property is always present
      } as Product;
    } catch (error: any) {
      console.error('Error fetching product:', error);
      throw error instanceof APIError
        ? error
        : new APIError('Failed to fetch product', 500, 'PRODUCT_ERROR');
    }
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string, page = 1, limit = 20): Promise<PaginatedResponse<Product>> {
    try {
      const { data } = await api.get<ApiResponse<PaginatedResponse<Product>>>('/products', {
        params: {
          category,
          page,
          limit,
        },
      });

      // Ensure price is a number for all products
      const products = data.data.data.map((product) => ({
        ...product,
        price: Number(product.price), // Convert price to a number
        stock: product.stock || 0, // Ensure stock property is always present
      })) as Product[];

      return {
        ...data.data,
        data: products,
      };
    } catch (error: any) {
      console.error('Error fetching products by category:', error);
      throw error instanceof APIError
        ? error
        : new APIError('Failed to fetch products by category', 500, 'PRODUCT_ERROR');
    }
  },

  /**
   * Create a new product (admin only)
   */
  async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      const { data } = await api.post<ApiResponse<Product>>('/products', productData);
      return data.data;
    } catch (error: any) {
      console.error('Error creating product:', error);
      throw error instanceof APIError
        ? error
        : new APIError('Failed to create product', 500, 'PRODUCT_ERROR');
    }
  },

  /**
   * Update an existing product (admin only)
   */
  async updateProduct(id: string, productData: Partial<CreateProductData>): Promise<Product> {
    try {
      const { data } = await api.put<ApiResponse<Product>>(`/products/${id}`, productData);
      return data.data;
    } catch (error: any) {
      console.error('Error updating product:', error);
      throw error instanceof APIError
        ? error
        : new APIError('Failed to update product', 500, 'PRODUCT_ERROR');
    }
  },

  /**
   * Delete a product (admin only)
   */
  async deleteProduct(id: string): Promise<null> {
    try {
      const { data } = await api.delete<ApiResponse<null>>(`/products/${id}`);
      return data.data;
    } catch (error: any) {
      console.error('Error deleting product:', error);
      throw error instanceof APIError
        ? error
        : new APIError('Failed to delete product', 500, 'PRODUCT_ERROR');
    }
  },

  /**
   * Get available product categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const { data } = await api.get<ApiResponse<string[]>>('/products/categories');
      return data.data;
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      throw error instanceof APIError
        ? error
        : new APIError('Failed to fetch categories', 500, 'PRODUCT_ERROR');
    }
  },

  /**
   * Get popular tags
   */
  async getTags(): Promise<string[]> {
    try {
      const { data } = await api.get<ApiResponse<string[]>>('/products/tags');
      return data.data;
    } catch (error: any) {
      console.error('Error fetching tags:', error);
      throw error instanceof APIError
        ? error
        : new APIError('Failed to fetch tags', 500, 'PRODUCT_ERROR');
    }
  },
};
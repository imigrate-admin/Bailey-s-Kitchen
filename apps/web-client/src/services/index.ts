/**
 * Bailey's Kitchen API Services
 * 
 * This file exports all service modules for interacting with the backend API.
 * Services handle data fetching, state management, and API communication.
 * 
 * @module services
 */

import { userService } from './user.service';
import { productService } from './product.service';
import { cartService } from './cart.service';
import { orderService } from './order.service';

// Export all services
export {
  userService,
  productService,
  cartService,
  orderService
};

/**
 * Common interface for paginated responses from the API
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Usage Examples:
 * 
 * User Authentication:
 * ```tsx
 * import { userService } from '@/services';
 * 
 * // Login
 * const login = async () => {
 *   try {
 *     const response = await userService.login({ 
 *       email: 'user@example.com', 
 *       password: 'password' 
 *     });
 *     if (response.success) {
 *       // Handle successful login
 *     }
 *   } catch (error) {
 *     // Handle error
 *   }
 * };
 * ```
 * 
 * Product Listing:
 * ```tsx
 * import { productService } from '@/services';
 * 
 * // Get products with filters
 * const getProducts = async () => {
 *   try {
 *     const response = await productService.getProducts({
 *       category: 'desserts',
 *       page: 1,
 *       limit: 10
 *     });
 *     if (response.success) {
 *       // Handle products
 *     }
 *   } catch (error) {
 *     // Handle error
 *   }
 * };
 * ```
 * 
 * Cart Management:
 * ```tsx
 * import { cartService } from '@/services';
 * 
 * // Add item to cart
 * const addToCart = async (productId: string, quantity: number) => {
 *   try {
 *     const response = await cartService.addItem({ productId, quantity });
 *     if (response.success) {
 *       // Handle updated cart
 *     }
 *   } catch (error) {
 *     // Handle error
 *   }
 * };
 * ```
 * 
 * Order Processing:
 * ```tsx
 * import { orderService } from '@/services';
 * 
 * // Create order
 * const checkout = async () => {
 *   try {
 *     const response = await orderService.createOrder({
 *       shippingAddress: {
 *         address: '123 Main St',
 *         city: 'Anytown',
 *         state: 'CA',
 *         postalCode: '12345',
 *         country: 'US'
 *       },
 *       paymentMethod: 'credit_card'
 *     });
 *     if (response.success) {
 *       // Handle order creation
 *     }
 *   } catch (error) {
 *     // Handle error
 *   }
 * };
 * ```
 */

// Default export for easier importing
export default {
  user: userService,
  product: productService,
  cart: cartService,
  order: orderService
};

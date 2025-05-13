import api, { APIError } from '../lib/api';
import { ApiResponse, Cart, CartItem, Product } from '../types';

interface AddItemData {
  productId: string;
  quantity: number;
}

interface UpdateItemData {
  quantity: number;
}

/**
 * Cart service for shopping cart operations
 */
export const cartService = {
  /**
   * Get current user's cart
   */
  async getCart(): Promise<Cart> {
    try {
      const { data } = await api.get<ApiResponse<Cart>>('/cart');
      return data.data;
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to fetch cart', 500, 'CART_ERROR');
    }
  },

  /**
   * Create a new cart (usually done automatically by the API)
   */
  async createCart(): Promise<Cart> {
    try {
      const { data } = await api.post<ApiResponse<Cart>>('/cart');
      return data.data;
    } catch (error: any) {
      console.error('Error creating cart:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to create cart', 500, 'CART_ERROR');
    }
  },

  /**
   * Add an item to the cart
   */
  async addItem(itemData: AddItemData): Promise<Cart> {
    try {
      const { data } = await api.post<ApiResponse<Cart>>('/cart/items', itemData);
      return data.data;
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to add item to cart', 500, 'CART_ERROR');
    }
  },

  /**
   * Update a cart item quantity
   */
  async updateItem(productId: string, itemData: UpdateItemData): Promise<Cart> {
    try {
      const { data } = await api.put<ApiResponse<Cart>>(`/cart/items/${productId}`, itemData);
      return data.data;
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to update cart item', 500, 'CART_ERROR');
    }
  },

  /**
   * Remove an item from the cart
   */
  async removeItem(productId: string): Promise<Cart> {
    try {
      const { data } = await api.delete<ApiResponse<Cart>>(`/cart/items/${productId}`);
      return data.data;
    } catch (error: any) {
      console.error('Error removing item from cart:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to remove item from cart', 500, 'CART_ERROR');
    }
  },

  /**
   * Clear all items from the cart
   */
  async clearCart(): Promise<Cart> {
    try {
      const { data } = await api.delete<ApiResponse<Cart>>('/cart/items');
      return data.data;
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to clear cart', 500, 'CART_ERROR');
    }
  },

  /**
   * Get cart summary (totals, item count)
   */
  async getCartSummary(): Promise<{ totalItems: number; subtotal: number }> {
    try {
      const { data } = await api.get<ApiResponse<{ totalItems: number; subtotal: number }>>('/cart/summary');
      return data.data;
    } catch (error: any) {
      console.error('Error fetching cart summary:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to fetch cart summary', 500, 'CART_ERROR');
    }
  },

  /**
   * Save cart for later (for guest users converting to registered users)
   */
  async saveCart(): Promise<Cart> {
    try {
      const { data } = await api.post<ApiResponse<Cart>>('/cart/save');
      return data.data;
    } catch (error: any) {
      console.error('Error saving cart:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to save cart', 500, 'CART_ERROR');
    }
  },

  /**
   * Merge guest cart with user cart (after login)
   */
  async mergeCart(guestCartItems: CartItem[]): Promise<Cart> {
    try {
      const { data } = await api.post<ApiResponse<Cart>>('/cart/merge', { 
        items: guestCartItems 
      });
      return data.data;
    } catch (error: any) {
      console.error('Error merging cart:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to merge cart', 500, 'CART_ERROR');
    }
  },

  /**
   * Local cart management for guest users
   */
  getLocalCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    const storedCart = localStorage.getItem('guest_cart');
    return storedCart ? JSON.parse(storedCart) : [];
  },

  saveLocalCart(items: CartItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('guest_cart', JSON.stringify(items));
  },

  addItemToLocalCart(product: Product, quantity: number): CartItem[] {
    const cart = this.getLocalCart();
    const existingItemIndex = cart.findIndex(item => item.productId === product.id);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        quantity,
        product,
      });
    }

    this.saveLocalCart(cart);
    return cart;
  },

  updateLocalCartItem(productId: string, quantity: number): CartItem[] {
    const cart = this.getLocalCart();
    const existingItemIndex = cart.findIndex(item => item.productId === productId);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity = quantity;
      this.saveLocalCart(cart);
    }

    return cart;
  },

  removeItemFromLocalCart(productId: string): CartItem[] {
    let cart = this.getLocalCart();
    cart = cart.filter(item => item.productId !== productId);
    this.saveLocalCart(cart);
    return cart;
  },

  clearLocalCart(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('guest_cart');
  },

  getLocalCartSummary(): { totalItems: number; subtotal: number } {
    const cart = this.getLocalCart();
    return {
      totalItems: cart.reduce((total, item) => total + item.quantity, 0),
      subtotal: cart.reduce((total, item) => total + (item.product.price * item.quantity), 0),
    };
  },
};


import { apiRequest } from '../lib/api';
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
  async getCart(): Promise<ApiResponse<Cart>> {
    return apiRequest<ApiResponse<Cart>>({
      method: 'GET',
      url: '/cart',
    });
  },

  /**
   * Create a new cart (usually done automatically by the API)
   */
  async createCart(): Promise<ApiResponse<Cart>> {
    return apiRequest<ApiResponse<Cart>>({
      method: 'POST',
      url: '/cart',
    });
  },

  /**
   * Add an item to the cart
   */
  async addItem(data: AddItemData): Promise<ApiResponse<Cart>> {
    return apiRequest<ApiResponse<Cart>>({
      method: 'POST',
      url: '/cart/items',
      data,
    });
  },

  /**
   * Update a cart item quantity
   */
  async updateItem(productId: string, data: UpdateItemData): Promise<ApiResponse<Cart>> {
    return apiRequest<ApiResponse<Cart>>({
      method: 'PUT',
      url: `/cart/items/${productId}`,
      data,
    });
  },

  /**
   * Remove an item from the cart
   */
  async removeItem(productId: string): Promise<ApiResponse<Cart>> {
    return apiRequest<ApiResponse<Cart>>({
      method: 'DELETE',
      url: `/cart/items/${productId}`,
    });
  },

  /**
   * Clear all items from the cart
   */
  async clearCart(): Promise<ApiResponse<Cart>> {
    return apiRequest<ApiResponse<Cart>>({
      method: 'DELETE',
      url: '/cart/items',
    });
  },

  /**
   * Get cart summary (totals, item count)
   */
  async getCartSummary(): Promise<ApiResponse<{ totalItems: number; subtotal: number }>> {
    return apiRequest<ApiResponse<{ totalItems: number; subtotal: number }>>({
      method: 'GET',
      url: '/cart/summary',
    });
  },

  /**
   * Save cart for later (for guest users converting to registered users)
   */
  async saveCart(): Promise<ApiResponse<Cart>> {
    return apiRequest<ApiResponse<Cart>>({
      method: 'POST',
      url: '/cart/save',
    });
  },

  /**
   * Merge guest cart with user cart (after login)
   */
  async mergeCart(guestCartItems: CartItem[]): Promise<ApiResponse<Cart>> {
    return apiRequest<ApiResponse<Cart>>({
      method: 'POST',
      url: '/cart/merge',
      data: { items: guestCartItems },
    });
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


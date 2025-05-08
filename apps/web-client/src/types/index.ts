// Core domain types

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  tags: string[];
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  payment: {
    method: 'credit_card' | 'paypal' | 'other';
    transactionId?: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
  };
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}


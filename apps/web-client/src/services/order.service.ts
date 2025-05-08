import { apiRequest } from '../lib/api';
import { ApiResponse, Order } from '../types';

interface CreateOrderData {
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'credit_card' | 'paypal' | 'other';
  notes?: string;
}

interface OrderStatusUpdate {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaymentInitiationResponse {
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
}

/**
 * Order service for order management
 */
export const orderService = {
  /**
   * Create a new order from the current cart
   */
  async createOrder(data: CreateOrderData): Promise<ApiResponse<Order>> {
    return apiRequest<ApiResponse<Order>>({
      method: 'POST',
      url: '/orders',
      data,
    });
  },

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    return apiRequest<ApiResponse<Order>>({
      method: 'GET',
      url: `/orders/${id}`,
    });
  },

  /**
   * Get all orders for the current user
   */
  async getOrders(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Order>>> {
    return apiRequest<ApiResponse<PaginatedResponse<Order>>>({
      method: 'GET',
      url: '/orders',
      params: { page, limit },
    });
  },

  /**
   * Update order status (admin only)
   */
  async updateOrderStatus(id: string, data: OrderStatusUpdate): Promise<ApiResponse<Order>> {
    return apiRequest<ApiResponse<Order>>({
      method: 'PATCH',
      url: `/orders/${id}/status`,
      data,
    });
  },

  /**
   * Cancel an order (if still in pending or processing status)
   */
  async cancelOrder(id: string, reason?: string): Promise<ApiResponse<Order>> {
    return apiRequest<ApiResponse<Order>>({
      method: 'POST',
      url: `/orders/${id}/cancel`,
      data: { reason },
    });
  },

  /**
   * Initiate payment process for an order
   */
  async initiatePayment(orderId: string): Promise<ApiResponse<PaymentInitiationResponse>> {
    return apiRequest<ApiResponse<PaymentInitiationResponse>>({
      method: 'POST',
      url: `/orders/${orderId}/payment`,
    });
  },

  /**
   * Complete payment for an order
   */
  async completePayment(orderId: string, paymentIntentId: string): Promise<ApiResponse<Order>> {
    return apiRequest<ApiResponse<Order>>({
      method: 'POST',
      url: `/orders/${orderId}/payment/complete`,
      data: { paymentIntentId },
    });
  },

  /**
   * Update shipping address for an order (if not shipped yet)
   */
  async updateShippingAddress(
    orderId: string,
    shippingAddress: CreateOrderData['shippingAddress']
  ): Promise<ApiResponse<Order>> {
    return apiRequest<ApiResponse<Order>>({
      method: 'PATCH',
      url: `/orders/${orderId}/shipping-address`,
      data: { shippingAddress },
    });
  },

  /**
   * Track order shipment
   */
  async trackOrder(orderId: string): Promise<ApiResponse<{ trackingId: string; carrier: string; status: string; estimatedDelivery: string }>> {
    return apiRequest<ApiResponse<{ trackingId: string; carrier: string; status: string; estimatedDelivery: string }>>({
      method: 'GET',
      url: `/orders/${orderId}/tracking`,
    });
  },

  /**
   * Get order statistics (admin only)
   */
  async getOrderStatistics(): Promise<ApiResponse<{ totalOrders: number; totalRevenue: number; averageOrderValue: number }>> {
    return apiRequest<ApiResponse<{ totalOrders: number; totalRevenue: number; averageOrderValue: number }>>({
      method: 'GET',
      url: '/orders/statistics',
    });
  },
};


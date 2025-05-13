import api, { APIError } from '../lib/api';
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
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const { data } = await api.post<ApiResponse<Order>>('/orders', orderData);
      return data.data;
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to create order', 500, 'ORDER_ERROR');
    }
  },

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order> {
    try {
      const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`);
      return data.data;
    } catch (error: any) {
      console.error('Error fetching order:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to fetch order', 500, 'ORDER_ERROR');
    }
  },

  /**
   * Get all orders for the current user
   */
  async getOrders(page = 1, limit = 10): Promise<PaginatedResponse<Order>> {
    try {
      const { data } = await api.get<ApiResponse<PaginatedResponse<Order>>>('/orders', {
        params: { page, limit }
      });
      return data.data;
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to fetch orders', 500, 'ORDER_ERROR');
    }
  },

  /**
   * Update order status (admin only)
   */
  async updateOrderStatus(id: string, statusData: OrderStatusUpdate): Promise<Order> {
    try {
      const { data } = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, statusData);
      return data.data;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to update order status', 500, 'ORDER_ERROR');
    }
  },

  /**
   * Cancel an order (if still in pending or processing status)
   */
  async cancelOrder(id: string, reason?: string): Promise<Order> {
    try {
      const { data } = await api.post<ApiResponse<Order>>(`/orders/${id}/cancel`, { reason });
      return data.data;
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to cancel order', 500, 'ORDER_ERROR');
    }
  },

  /**
   * Initiate payment process for an order
   */
  async initiatePayment(orderId: string): Promise<PaymentInitiationResponse> {
    try {
      const { data } = await api.post<ApiResponse<PaymentInitiationResponse>>(`/orders/${orderId}/payment`);
      return data.data;
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to initiate payment', 500, 'PAYMENT_ERROR');
    }
  },

  /**
   * Complete payment for an order
   */
  async completePayment(orderId: string, paymentIntentId: string): Promise<Order> {
    try {
      const { data } = await api.post<ApiResponse<Order>>(`/orders/${orderId}/payment/complete`, { 
        paymentIntentId 
      });
      return data.data;
    } catch (error: any) {
      console.error('Error completing payment:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to complete payment', 500, 'PAYMENT_ERROR');
    }
  },

  /**
   * Update shipping address for an order (if not shipped yet)
   */
  async updateShippingAddress(
    orderId: string,
    shippingAddress: CreateOrderData['shippingAddress']
  ): Promise<Order> {
    try {
      const { data } = await api.patch<ApiResponse<Order>>(`/orders/${orderId}/shipping-address`, {
        shippingAddress
      });
      return data.data;
    } catch (error: any) {
      console.error('Error updating shipping address:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to update shipping address', 500, 'ORDER_ERROR');
    }
  },

  /**
   * Track order shipment
   */
  async trackOrder(orderId: string): Promise<{ trackingId: string; carrier: string; status: string; estimatedDelivery: string }> {
    try {
      const { data } = await api.get<ApiResponse<{ 
        trackingId: string; 
        carrier: string; 
        status: string; 
        estimatedDelivery: string 
      }>>(`/orders/${orderId}/tracking`);
      return data.data;
    } catch (error: any) {
      console.error('Error tracking order:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to track order', 500, 'ORDER_ERROR');
    }
  },

  /**
   * Get order statistics (admin only)
   */
  async getOrderStatistics(): Promise<{ totalOrders: number; totalRevenue: number; averageOrderValue: number }> {
    try {
      const { data } = await api.get<ApiResponse<{ 
        totalOrders: number; 
        totalRevenue: number; 
        averageOrderValue: number 
      }>>('/orders/statistics');
      return data.data;
    } catch (error: any) {
      console.error('Error fetching order statistics:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to fetch order statistics', 500, 'ORDER_ERROR');
    }
  },
};


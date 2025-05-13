import api, { APIError } from '../lib/api';
import { ApiResponse, User } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

/**
 * User service for authentication and user management
 */
export const userService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
      
      // Store token in localStorage if available
      if (data.data.token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.data.token);
      }
      
      return data.data;
    } catch (error: any) {
      console.error('Error during login:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError(
            error.response?.data?.message || 'Login failed',
            error.response?.status || 500,
            error.response?.data?.code || 'AUTH_ERROR'
          );
    }
  },

  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<User> {
    try {
      const { data } = await api.post<ApiResponse<User>>('/auth/register', userData);
      return data.data;
    } catch (error: any) {
      console.error('Error during registration:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError(
            error.response?.data?.message || 'Registration failed',
            error.response?.status || 500,
            error.response?.data?.code || 'AUTH_ERROR'
          );
    }
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await api.post<ApiResponse<null>>('/auth/logout');
      
      // Remove token from localStorage if available
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    } catch (error: any) {
      console.error('Error during logout:', error);
      // Still remove token from localStorage even if API call fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      
      throw error instanceof APIError 
        ? error 
        : new APIError('Logout failed', 500, 'AUTH_ERROR');
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const { data } = await api.get<ApiResponse<User>>('/users/me');
      return data.data;
    } catch (error: any) {
      console.error('Error fetching current user:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to fetch user profile', 500, 'USER_ERROR');
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const { data } = await api.put<ApiResponse<User>>('/users/me', userData);
      return data.data;
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to update profile', 500, 'USER_ERROR');
    }
  },

  /**
   * Get user by ID (admin only)
   */
  async getUserById(id: string): Promise<User> {
    try {
      const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
      return data.data;
    } catch (error: any) {
      console.error('Error fetching user by ID:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to fetch user', 500, 'USER_ERROR');
    }
  },

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const { data } = await api.get<ApiResponse<User[]>>('/users');
      return data.data;
    } catch (error: any) {
      console.error('Error fetching all users:', error);
      throw error instanceof APIError 
        ? error 
        : new APIError('Failed to fetch users', 500, 'USER_ERROR');
    }
  },
  
  /**
   * Check if user is authenticated by checking for presence of token
   */
  isAuthenticated(): boolean {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return false;
    }
    
    // Check for token in localStorage
    const token = localStorage.getItem('auth_token');
    return !!token;
  },
};

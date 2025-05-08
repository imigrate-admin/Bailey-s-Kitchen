import { apiRequest } from '../lib/api';
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
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    return apiRequest<ApiResponse<LoginResponse>>({
      method: 'POST',
      url: '/auth/login',
      data: credentials,
    });
  },

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<ApiResponse<User>> {
    return apiRequest<ApiResponse<User>>({
      method: 'POST',
      url: '/auth/register',
      data,
    });
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<ApiResponse<null>> {
    return apiRequest<ApiResponse<null>>({
      method: 'POST',
      url: '/auth/logout',
    });
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiRequest<ApiResponse<User>>({
      method: 'GET',
      url: '/users/me',
    });
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiRequest<ApiResponse<User>>({
      method: 'PUT',
      url: '/users/me',
      data,
    });
  },

  /**
   * Get user by ID (admin only)
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiRequest<ApiResponse<User>>({
      method: 'GET',
      url: `/users/${id}`,
    });
  },

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return apiRequest<ApiResponse<User[]>>({
      method: 'GET',
      url: '/users',
    });
  },
};


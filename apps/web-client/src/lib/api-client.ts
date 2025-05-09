import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';

// Create a base axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds
});

// Request interceptor to add authentication token to requests
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const session = await getSession();

      // Add auth token to headers if available
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Try to refresh token logic could be added here
      
      // If refresh fails or not implemented, sign out the user
      await signOut({ redirect: true, callbackUrl: '/login' });
    }
    
    return Promise.reject(error);
  }
);

// API endpoints wrapper for authentication
export const authApi = {
  login: (email: string, password: string) => 
    apiClient.post('/auth/login', { email, password }),
  
  register: (firstName: string, lastName: string, email: string, password: string) => 
    apiClient.post('/auth/register', { firstName, lastName, email, password }),
  
  getProfile: () => 
    apiClient.get('/auth/me'),
};

export default apiClient;


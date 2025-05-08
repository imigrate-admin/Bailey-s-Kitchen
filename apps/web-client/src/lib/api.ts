import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if we're in a browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Transform successful responses if needed
    return response;
  },
  (error: AxiosError) => {
    // Handle response errors
    if (error.response) {
      // The request was made and the server responded with an error status
      const status = error.response.status;
      
      // Handle unauthorized errors (401)
      if (status === 401) {
        // Clear auth token if we're in a browser
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          // You might want to redirect to login or dispatch a logout action
        }
      }
      
      // Log error in development
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error Response:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Utility for making requests with proper typing
async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { api, apiRequest };
export default api;


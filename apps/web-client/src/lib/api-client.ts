import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';

/**
 * Determine if the code is running in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Configure the baseURL based on execution context
 * - Browser: Use relative URL path to work with Next.js rewrites
 * - Server: Use the full API URL from environment for Docker container communication
 */
const getBaseUrl = () => {
  // For browser-side requests, use relative path which Next.js will rewrite
  if (isBrowser) {
    return '/api/v1';
  }
  
  // For server-side requests, use the full URL from environment variables
  return process.env.NEXT_PUBLIC_API_URL;
};

/**
 * Define routes that don't require authentication
 * Use path patterns without the base URL
 */
const publicRoutes = [
  // Public product listings
  '/products',
  '/products/search',
  
  // Authentication endpoints
  '/auth/login',
  '/auth/register',
  
  // Static content
  '/categories',
  '/featured',
  '/health',
];

/**
 * Check if a given URL path is a public route that doesn't require authentication
 */
const isPublicRoute = (url: string): boolean => {
  // Clean the URL to handle both absolute and relative paths
  const path = url.replace(/^(https?:\/\/[^/]+)?\/api\/v1/, '');
  
  // Check if the path matches any public route
  return publicRoutes.some(route => {
    // Exact match
    if (route === path) return true;
    // Parametric routes (e.g., /products/123)
    if (route.includes('/:') && path.startsWith(route.split('/:')[0])) return true;
    // Wildcard routes (e.g., /products*)
    if (route.endsWith('*') && path.startsWith(route.slice(0, -1))) return true;
    
    return false;
  });
};

// Create a base axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds
});

// Request interceptor to add authentication token to requests
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Check if the request is to a protected route requiring authentication
      const url = config.url || '';
      const requiresAuth = !isPublicRoute(url);
      
      // Only fetch auth session for protected routes
      if (requiresAuth) {
        const session = await getSession();

        // Add auth token to headers if available
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        } else {
          // Handle case where authentication is required but no session exists
          console.warn(`Attempting to access protected route ${url} without authentication`);
          // We'll still send the request - the server will return 401 if needed
        }
      }
      
      // Add debug information if enabled
      if (process.env.NEXT_PUBLIC_DEBUG_API === 'true') {
        console.debug(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, { 
          environment: isBrowser ? 'browser' : 'server',
          requiresAuth,
          headers: config.headers
        });
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
    const url = originalRequest?.url || '';
    const isPublic = isPublicRoute(url);
    
    // Handle 401 Unauthorized errors differently for public vs protected routes
    if (error.response?.status === 401) {
      // For protected routes, we should handle auth issues
      if (!isPublic) {
        // Try to refresh token logic could be added here
        
        // If refresh fails or not implemented, sign out the user
        // Only redirect for browser environments
        if (isBrowser) {
          await signOut({ redirect: true, callbackUrl: '/login' });
        } else {
          // In server context, just reject without redirect
          console.error('Authentication error in server context');
        }
      } else {
        // For public routes that return 401, just pass through the error
        console.warn(`Received 401 for public route: ${url}`);
      }
    }
    
    // Log errors in development and when debug is enabled
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG_API === 'true') {
      console.error('API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        isPublicRoute: isPublic,
        environment: isBrowser ? 'browser' : 'server',
        message: error.message,
        data: error.response?.data
      });
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

// API endpoints wrapper for products
export const productApi = {
  getProducts: () => 
    apiClient.get('/products'),
    
  getProduct: (id: string) => 
    apiClient.get(`/products/${id}`),
    
  searchProducts: (query: string) => 
    apiClient.get(`/products/search?q=${encodeURIComponent(query)}`),
};

export default apiClient;
// Add a debug endpoint to check configuration
if (process.env.NODE_ENV === 'development') {
  apiClient.getConfig = () => ({
    baseURL: apiClient.defaults.baseURL,
    isBrowser,
    publicApiUrl: process.env.NEXT_PUBLIC_API_URL,
    publicRoutes
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Optimized for Docker deployments
  images: {
    domains: ['localhost', 'baileys-kitchen-api', 'api', 'via.placeholder.com'], // Include Docker service names
    // Configured to work in a Docker container with proper hostnames
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'baileys-kitchen.example.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.baileys-kitchen.com',
        port: '',
        pathname: '/products/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/baileys-kitchen-assets/**',
      }
    ],
  },
  env: {
    // Make environment variables available to the browser
    // IMPORTANT: For browser-side requests, always use localhost regardless of environment
    NEXT_PUBLIC_API_URL: 'http://localhost:5003/api/v1',
    // Include a flag to help debug API connection issues
    NEXT_PUBLIC_DEBUG_API: process.env.NEXT_PUBLIC_DEBUG_API || 'false',
  },

  // Add API rewrites for development
  async rewrites() {
    // Server-side API URL comes from environment variables (Docker service name)
    // For local development outside of Docker, fallback to localhost
    const serverApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003/api/v1';
    
    // Browser-side API requests always go to localhost
    const browserApiUrl = 'http://localhost:5003/api/v1';
    
    // Use the correct base URL for rewrites
    const baseApiUrl = browserApiUrl.replace('/api/v1', '');
    
    if (process.env.NODE_ENV === 'development') {
      return [
        // Handle NextAuth internal routes - do not rewrite these
        {
          source: '/api/auth/callback/:path*',
          destination: '/api/auth/callback/:path*',
        },
        {
          source: '/api/auth/signin',
          destination: '/api/auth/signin',
        },
        {
          source: '/api/auth/signout',
          destination: '/api/auth/signout',
        },
        {
          source: '/api/auth/session',
          destination: '/api/auth/session',
        },
        {
          source: '/api/auth/_log',
          destination: '/api/auth/_log',
        },
        {
          source: '/api/auth/error',
          destination: '/api/auth/error',
        },
        {
          source: '/api/auth/providers',
          destination: '/api/auth/providers',
        },
        // Direct backend auth API calls - rewrite to include /api/v1
        {
          source: '/api/auth/login',
          destination: `${baseApiUrl}/api/v1/auth/login`,
        },
        {
          source: '/api/auth/register',
          destination: `${baseApiUrl}/api/v1/auth/register`,
        },
        // Public product endpoints that don't require authentication
        {
          source: '/api/v1/products/:path*',
          destination: `${baseApiUrl}/api/v1/products/:path*`,
        },
        
        // Health check endpoint
        {
          source: '/api/v1/health',
          destination: `${baseApiUrl}/api/v1/health`,
        },
        
        // Categories endpoint
        {
          source: '/api/v1/categories',
          destination: `${baseApiUrl}/api/v1/categories`,
        },
        
        // Public auth endpoints
        {
          source: '/api/v1/auth/login',
          destination: `${baseApiUrl}/api/v1/auth/login`,
        },
        {
          source: '/api/v1/auth/register',
          destination: `${baseApiUrl}/api/v1/auth/register`,
        },
        
        // All other API routes - always use localhost for browser requests
        {
          source: '/api/v1/:path*',
          destination: `${baseApiUrl}/api/v1/:path*`,
        },
        // Legacy API route handling
        {
          source: '/api/:path*',
          destination: `${baseApiUrl}/api/v1/:path*`,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;


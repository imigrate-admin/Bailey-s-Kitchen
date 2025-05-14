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
    // Make environment variable available to the browser
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1',
  },
  // Add API rewrites for development
  async rewrites() {
    // Determine API URL based on environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
    const baseApiUrl = apiUrl.replace('/api/v1', '');
    
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
        // Handle all other API routes
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


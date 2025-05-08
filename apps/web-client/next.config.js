/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Optimized for Docker deployments
  images: {
    domains: ['localhost', 'baileys-kitchen-api', 'api'], // Include Docker service names
    // Configured to work in a Docker container with proper hostnames
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'baileys-kitchen.example.com',
        port: '',
        pathname: '/**',
      },
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
        {
          source: '/api/:path*',
          destination: `${baseApiUrl}/api/:path*`, // Proxy to API server
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;


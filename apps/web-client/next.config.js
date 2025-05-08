/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Optimized for Docker deployments
  images: {
    domains: ['localhost'], // Add image domains as needed
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
  // Add API rewrites for development
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3001/api/:path*', // Proxy to local API Gateway
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;


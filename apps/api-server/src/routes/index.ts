import { Router, Request, Response } from 'express';
import http from 'http';
import healthRoutes from './health.routes';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import dotenv from 'dotenv';

// Define custom error interface
interface ServiceError extends Error {
  code?: string;
}

// Load environment variables if not already loaded
if (!process.env.CORS_ORIGIN) {
  dotenv.config();
}

const router = Router();

// Register all routes
router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

// Product service configuration
const PRODUCT_SERVICE_HOST = 'product-service'; // Service name from docker-compose.yml
const PRODUCT_SERVICE_PORT = 5003;
const PRODUCT_SERVICE_PATH = '/api/v1/products';
const REQUEST_TIMEOUT = 10000; // 10 seconds timeout for requests

// Parse CORS origins from environment variable for error responses
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(origin => origin.trim());

// Simple proxy middleware for product service
router.all('/products*', (req: Request, res: Response) => {
  console.log(`Proxying request to products service: ${req.method} ${req.url}`);
  
  // Build the target URL
  const targetPath = req.url.replace(/^\/products/, PRODUCT_SERVICE_PATH);
  
  // Create options for the proxy request
  const options = {
    host: PRODUCT_SERVICE_HOST,
    port: PRODUCT_SERVICE_PORT,
    path: targetPath,
    method: req.method,
    headers: { ...req.headers },
    timeout: REQUEST_TIMEOUT
  };
  
  // Delete host header to avoid conflicts
  delete options.headers.host;
  
  // Create the proxy request
  const proxyReq = http.request(options, (proxyRes) => {
    // Set status code and headers from the proxied response
    res.status(proxyRes.statusCode || 500);
    for (const [key, value] of Object.entries(proxyRes.headers)) {
      if (value) res.setHeader(key, value);
    }
    
    // Stream the response body back to the client
    proxyRes.pipe(res);
  });
  
  // Set a timeout handler
  proxyReq.setTimeout(REQUEST_TIMEOUT, () => {
    proxyReq.destroy();
    console.error('Proxy request timed out after', REQUEST_TIMEOUT, 'ms');
  });

  // Error handling
  proxyReq.on('error', (error: ServiceError) => {
    console.error('Proxy error:', error);
    
    // Send error response if response hasn't been sent yet
    if (!res.headersSent) {
      // Get origin from request headers for CORS
      const origin = req.headers.origin;
      
      // Set appropriate CORS headers if origin is allowed
      if (origin && corsOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Vary', 'Origin');
      }
      
      // Set appropriate status code based on error
      const statusCode = error.code === 'ECONNREFUSED' ? 503 : 500;
      
      res.status(statusCode).json({
        error: 'Product Service Unavailable',
        message: 'The product service is currently unavailable. Please try again later.',
        statusCode: statusCode,
        code: error.code || 'UNKNOWN_ERROR'
      });
    }
  });
  
  // Send the request body if it exists
  if (req.body && Object.keys(req.body).length > 0) {
    proxyReq.write(JSON.stringify(req.body));
  }
  
  // End the request
  proxyReq.end();
});

export default router;

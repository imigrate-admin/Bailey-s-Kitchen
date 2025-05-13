import { Router, Request, Response } from 'express';
import http from 'http';
import healthRoutes from './health.routes';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';

const router = Router();

// Register all routes
router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

// Product service configuration
const PRODUCT_SERVICE_HOST = 'product-service';
const PRODUCT_SERVICE_PORT = 5003;
const PRODUCT_SERVICE_PATH = '/api/v1/products';

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
    headers: { ...req.headers }
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
  
  // Error handling
  proxyReq.on('error', (error) => {
    console.error('Proxy error:', error);
    
    // Send error response if response hasn't been sent yet
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Product Service Unavailable',
        message: 'The product service is currently unavailable. Please try again later.',
        statusCode: 500
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

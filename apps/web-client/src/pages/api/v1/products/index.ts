import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

/**
 * Determine if code is running in development mode
 */
const isDev = process.env.NODE_ENV === 'development';

/**
 * Get the API URL based on environment
 * - In browser: Direct communication with the API service isn't possible
 * - On server: Use the Docker service name for internal network communication
 */
const getApiUrl = (): string => {
  // Server-side should use Docker service name
  return process.env.NEXT_PUBLIC_API_URL || 'http://api:5001/api/v1';
};

/**
 * Handler for /api/v1/products
 * This bypasses Next.js authentication to provide public access to products data
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Log incoming requests in development
  if (isDev) {
    console.debug('Products API Route:', {
      method: req.method,
      url: req.url,
      query: req.query,
      time: new Date().toISOString(),
    });
  }

  // Only allow GET requests for security
  if (req.method !== 'GET' && req.method !== 'OPTIONS') {
    return res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  // Allow preflight requests for CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  try {
    // Forward the request to the API service
    const apiUrl = `${getApiUrl()}/products`;
    
    // Include any query parameters
    const queryString = new URLSearchParams(req.query as Record<string, string>).toString();
    const fullUrl = queryString ? `${apiUrl}?${queryString}` : apiUrl;
    
    if (isDev) {
      console.debug('Forwarding to:', { fullUrl });
    }

    // Make the request
    const response = await axios.get(fullUrl, {
      headers: {
        // Forward relevant headers
        'Content-Type': 'application/json',
        'Accept': req.headers.accept || 'application/json',
        // Don't forward cookies or authentication
      },
      timeout: 10000, // 10 second timeout
    });

    // Set CORS headers to allow browser access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 'public, max-age=60'); // Cache for 60 seconds

    // Forward status and data
    res.status(response.status).json(response.data);
  } catch (error) {
    // Log error details in development
    if (isDev) {
      if (axios.isAxiosError(error)) {
        console.error('Products API Error:', {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
      } else {
        console.error('Products API Error:', error);
      }
    }

    // Set CORS headers even for errors
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // If we have an Axios error with response data
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json({
        error: 'API Error',
        message: error.message,
        statusCode: error.response.status,
        data: error.response.data,
      });
    }

    // Generic error handler
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}

// Disable automatic authentication for this route
export const config = {
  api: {
    bodyParser: true,
    externalResolver: true, // Mark as externally resolved
  },
};


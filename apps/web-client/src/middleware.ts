import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// List of paths that are accessible to the public (no auth required)
const publicPaths = [
  '/',              // Root path is explicitly public
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth',
  '/api/auth/_log', // Explicitly allow NextAuth debug logging endpoint
  '/products',      // Public product listing
  '/api/products',  // Public product API routes
  '/categories',    // Public category browsing
  '/api/categories', // Public category API routes
];

// List of paths that should only be accessible to unauthenticated users
const authOnlyPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

/**
 * Check if a path is public (no auth required)
 */
const isPublicPath = (path: string): boolean => {
  // Add logging to help diagnose path issues
  console.log('Middleware - Checking path access:', { 
    path, 
    isRoot: path === '/',
    isAuthPath: path.startsWith('/api/auth/'),
    isProductPath: path.startsWith('/products') || path.startsWith('/api/products'),
    isCategoryPath: path.startsWith('/categories') || path.startsWith('/api/categories'),
  });
  
  return publicPaths.some(publicPath => 
    path === publicPath || 
    path.startsWith(`${publicPath}/`) ||
    path.startsWith('/api/auth/') || // Auth API routes are public
    path.startsWith('/products/') || // Individual product pages are public
    path.startsWith('/api/products/') || // Product API endpoints are public
    path.startsWith('/categories/') || // Category pages are public
    path.startsWith('/api/categories/') // Category API endpoints are public
  );
};

/**
 * Check if a path should only be accessible to unauthenticated users
 */
const isAuthOnlyPath = (path: string): boolean => {
  return authOnlyPaths.some(authPath => 
    path === authPath || path.startsWith(`${authPath}/`)
  );
};

/**
 * Middleware function that runs before each request
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Log each request that hits the middleware
  console.log('Middleware - Processing request:', {
    pathname,
    method: request.method,
    url: request.url,
    time: new Date().toISOString(),
  });
  
  // Get auth token from session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  const isAuthenticated = !!token;
  
  // Log authentication status
  console.log('Middleware - Auth status:', { 
    isAuthenticated, 
    hasToken: !!token, 
    userId: token?.sub || 'none',
  });
  
  // Redirect authenticated users away from login/register pages
  if (isAuthenticated && isAuthOnlyPath(pathname)) {
    console.log('Middleware - Redirecting authenticated user from auth page to home');
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }
  
  // Redirect unauthenticated users to login page if they try to access protected routes
  if (!isAuthenticated && !isPublicPath(pathname)) {
    console.log('Middleware - Redirecting unauthenticated user to login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }
  
  // Allow access to public routes and protected routes for authenticated users
  console.log('Middleware - Request allowed to proceed');
  
  // Continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (e.g. robots.txt)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\\.svg$).*)',
  ],
};


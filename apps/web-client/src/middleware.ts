import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// List of paths that are accessible to the public (no auth required)
const publicPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth',
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
  return publicPaths.some(publicPath => 
    path === publicPath || 
    path.startsWith(`${publicPath}/`) ||
    path === '/' || // Homepage is public
    path.startsWith('/api/auth/') // Auth API routes are public
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
  
  // Get auth token from session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  const isAuthenticated = !!token;
  
  // Redirect authenticated users away from login/register pages
  if (isAuthenticated && isAuthOnlyPath(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Redirect unauthenticated users to login page if they try to access protected routes
  if (!isAuthenticated && !isPublicPath(pathname)) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
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


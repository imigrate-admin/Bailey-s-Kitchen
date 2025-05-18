import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Map of legacy URLs to their new filtered URLs
const CATEGORY_REDIRECTS: Record<string, string> = {
  '/products/dogs': '/products?category=DOG',
  '/products/cats': '/products?category=CAT',
};

export function middleware(request: NextRequest) {
  // Check if the current path needs to be redirected
  const redirectUrl = CATEGORY_REDIRECTS[request.nextUrl.pathname];
  if (redirectUrl) {
    // Create a new URL with the same base as the request
    const newUrl = new URL(redirectUrl, request.url);
    // 308 status code indicates a permanent redirect
    return NextResponse.redirect(newUrl, { status: 308 });
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/products/dogs', '/products/cats'],
}; 
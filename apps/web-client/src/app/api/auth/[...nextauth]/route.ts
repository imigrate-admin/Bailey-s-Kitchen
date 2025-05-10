import NextAuth from 'next-auth';
import { authOptions } from '../auth.config';

// Initialize NextAuth with proper typing and configuration
const handler = NextAuth(authOptions);

// Export the handlers with explicit Next.js route handlers
export const GET = handler;
export const POST = handler;

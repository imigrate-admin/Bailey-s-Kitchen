import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/auth.config';
import { Session, UserProfile } from '@/types/auth';

/**
 * Get the user's session on the server side
 */
export async function getServerSideSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return null;
  }
  
  return {
    user: session.user as UserProfile,
    accessToken: session.accessToken as string,
    isLoggedIn: true,
    expires: session.expires as string,
  };
}

/**
 * Get the user data from a session
 */
export function getUserFromSession(session: Session | null): UserProfile | null {
  if (!session || !session.user) return null;
  return session.user;
}

/**
 * Check if a user is authenticated based on their session
 */
export function isAuthenticated(session: Session | null): boolean {
  return !!session?.accessToken && !!session?.user;
}

/**
 * Get the access token from a session
 */
export function getAccessToken(session: Session | null): string | null {
  return session?.accessToken || null;
}


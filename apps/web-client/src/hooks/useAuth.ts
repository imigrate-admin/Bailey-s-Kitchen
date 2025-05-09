'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Session, UserProfile, LoginRequest, RegisterRequest } from '@/types/auth';
import { authApi } from '@/lib/api-client';

/**
 * Custom hook for authentication state management
 */
export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert NextAuth session to our custom Session type
  const userSession: Session | null = session ? {
    user: session.user as UserProfile,
    accessToken: session.accessToken as string,
    isLoggedIn: !!session.accessToken,
    expires: session.expires,
  } : null;

  // Check if user is authenticated
  const isAuthenticated = status === 'authenticated';
  
  // Login with credentials
  const login = async ({ email, password }: LoginRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        setError(result.error);
        return false;
      }
      
      return true;
    } catch (err) {
      setError('An unexpected error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Register new user
  const register = async ({ firstName, lastName, email, password }: RegisterRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.register(firstName, lastName, email, password);
      
      if (response.status === 201 || response.status === 200) {
        // Auto login after successful registration
        return await login({ email, password });
      }
      
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout user
  const logout = async (callbackUrl = '/') => {
    await signOut({ redirect: true, callbackUrl });
  };
  
  // Get current user profile
  const getProfile = async (): Promise<UserProfile | null> => {
    if (!isAuthenticated) return null;
    
    try {
      const response = await authApi.getProfile();
      return response.data;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      return null;
    }
  };

  return {
    user: userSession?.user || null,
    session: userSession,
    isAuthenticated,
    isLoading: status === 'loading' || loading,
    error,
    login,
    register,
    logout,
    getProfile,
  };
}

export default useAuth;


import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthTokens } from '@/types/auth';

// Determine the correct API URL based on the environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// Helper function to determine if code is running server-side
const isServerSide = () => typeof window === 'undefined';

// Helper function to get the API URL - using the same URL for both client and server
// This works because of Docker port mapping
const getApiUrl = () => API_URL;

// For debugging purposes, log the API URL configuration
console.log('Auth Configuration:', {
  API_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  IS_SERVER: isServerSide(),
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NODE_ENV: process.env.NODE_ENV
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" },
        firstName: { label: "First Name", type: "text" }, // Added for registration
        lastName: { label: "Last Name", type: "text" }, // Added for registration
        isRegister: { label: "Is Register", type: "text" } // To differentiate between login and register
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          // Determine if this is a registration request
          const isRegister = credentials.isRegister === 'true';
          const apiUrl = getApiUrl();
          
          console.log(`Auth request details:`, {
            apiUrl,
            endpoint: isRegister ? `${apiUrl}/auth/register` : `${apiUrl}/auth/login`,
            hasCredentials: !!credentials,
            isRegister,
            isServerSide: isServerSide(),
            email: credentials.email ? `${credentials.email.substring(0, 3)}...` : 'not provided',
            timestamp: new Date().toISOString()
          });
          
          let response;
          
          if (isRegister) {
            // Handle registration
            if (!credentials.firstName || !credentials.lastName) {
              throw new Error('First name and last name are required for registration');
            }

            response = await fetch(`${apiUrl}/auth/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                firstName: credentials.firstName,
                lastName: credentials.lastName,
              }),
            });
          } else {
            // Handle login
            response = await fetch(`${apiUrl}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            });
          }
          
          // Handle errors from API
          if (!response.ok) {
            const error = await response.json();
            // Extract the error message from the API response
            const errorMessage = error.error || error.message || 'Authentication failed';
            throw new Error(errorMessage);
          }
          
          // Parse the response
          const data = await response.json();
          
          // Log the successful response structure (without sensitive data)
          console.log('Auth API response structure:', {
            hasAccessToken: !!data.accessToken,
            hasUserObject: !!data.user,
            userId: data.user?.id,
            userEmail: data.user?.email ? `${data.user.email.substring(0, 3)}...` : 'not available',
            status: data.status || 'no status provided',
          });
          
          // Check if response has the expected structure
          if (!data.accessToken || !data.user || !data.user.id) {
            console.error('Unexpected API response structure:', data);
            throw new Error('Received invalid data from authentication server');
          }
          
          // Return the user data in the format NextAuth expects
          return {
            id: data.user.id,
            email: data.user.email,
            name: `${data.user.firstName} ${data.user.lastName}`, // Combine firstName and lastName for NextAuth's name field
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            accessToken: data.accessToken,
          };
        } catch (error: any) {
          // Log detailed error information
          console.error('Auth error details:', {
            message: error.message,
            stack: error.stack,
            context: isServerSide() ? 'server-side' : 'client-side',
            apiUrl: API_URL,
            credentials: credentials ? { email: credentials.email, hasPassword: !!credentials.password } : 'No credentials',
          });
          
          // Enhance error message with network connectivity details if it's a fetch error
          if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error(`Network error connecting to authentication server: ${error.message}`);
          }
          
          // Return error message to display to the user
          if (error.message) {
            throw new Error(error.message);
          } else {
            throw new Error('Authentication failed. Please check your credentials and try again.');
          }
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Log JWT callback
      console.log('JWT Callback:', {
        trigger,
        hasUser: !!user,
        hasToken: !!token,
        userId: user?.id || token?.id || 'none',
        timestamp: new Date().toISOString()
      });

      if (user) {
        // First time jwt callback is run, user is available
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.accessToken = user.accessToken;
        
        console.log('JWT Token updated with user data', {
          userId: token.id,
          hasAccessToken: !!token.accessToken
        });
      }
      return token;
    },
    async session({ session, token, trigger }) {
      // Log session callback
      console.log('Session Callback:', {
        trigger,
        hasToken: !!token,
        hasSession: !!session,
        userId: token?.id || 'none',
        timestamp: new Date().toISOString()
      });

      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          name: token.name as string,
        };
        session.accessToken = token.accessToken as string;
        session.isLoggedIn = !!token.accessToken;
        
        console.log('Session updated with token data', {
          userId: session.user.id,
          isLoggedIn: session.isLoggedIn
        });
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Log the redirect attempt
      console.log('Redirect callback triggered:', {
        url,
        baseUrl
      });
      
      // After successful login or registration, always redirect to the home page
      if (url.includes('/api/auth/signin') || url.includes('/login') || url.includes('/register')) {
        console.log(`Auth action detected, redirecting to home page: ${baseUrl}/`);
        return `${baseUrl}/`;
      }
      
      // For callback URLs with callbackUrl parameter
      const callbackParam = new URL(url, baseUrl).searchParams.get('callbackUrl');
      if (callbackParam) {
        const decodedCallback = decodeURIComponent(callbackParam);
        
        // Validate the callback URL is safe
        if (decodedCallback.startsWith(baseUrl) || decodedCallback.startsWith('/')) {
          return decodedCallback.startsWith('/') 
            ? `${baseUrl}${decodedCallback}`
            : decodedCallback;
        }
      }
      
      // Standard URL handling
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      
      // Default fallback to home page
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || 'a-very-secret-key-that-should-be-in-env',
  debug: process.env.NODE_ENV === 'development',
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', {
        userId: user.id,
        isNewUser,
        provider: account?.provider
      });
    },
    async signOut({ token, session }) {
      console.log('User signed out');
    },
    async createUser({ user }) {
      console.log('New user created:', { userId: user.id });
    },
    async linkAccount({ user, account, profile }) {
      console.log('Account linked:', {
        userId: user.id,
        provider: account.provider
      });
    },
    async session({ session, token }) {
      console.log('Session updated:', { userId: session.user?.id });
    }
  },
  logger: {
    error(code, ...message) {
      console.error('NextAuth error:', { code, message });
    },
    warn(code, ...message) {
      console.warn('NextAuth warning:', { code, message });
    },
    debug(code, ...message) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('NextAuth debug:', { code, message });
      }
    },
  },
};

import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthTokens } from '@/types/auth';

// Define server-side API URL explicitly for Docker networking
const SERVER_API_URL = 'http://api:5001/api/v1';
// Use NEXT_PUBLIC_API_URL for client-side requests
const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL;

// For debugging purposes, log the environment variables related to API URLs
console.log('Auth Configuration:', {
  SERVER_API_URL,
  CLIENT_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
});

// Helper function to determine if code is running server-side
const isServerSide = () => typeof window === 'undefined';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" }
      },
      async authorize(credentials) {
        try {
          // Determine which API URL to use based on execution environment
          const apiUrl = isServerSide() ? SERVER_API_URL : CLIENT_API_URL;
          
          // Log detailed authentication request information
          console.log(`Auth request details:`, {
            apiUrl,
            environment: isServerSide() ? 'server-side' : 'client-side',
            endpoint: `${apiUrl}/auth/login`,
            hasCredentials: !!credentials,
            email: credentials?.email ? `${credentials.email.substring(0, 3)}...` : 'not provided',
            timestamp: new Date().toISOString()
          });
          
          // Make a request to the backend API
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });
          
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
            apiUrl: isServerSide() ? SERVER_API_URL : CLIENT_API_URL,
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
      // Log the redirect attempt with detailed information
      console.log('Redirect callback triggered:', {
        url,
        baseUrl,
        isRelative: url.startsWith('/'),
        isBaseUrl: url.startsWith(baseUrl),
        containsAuthSignin: url.includes('/api/auth/signin'),
        containsLogin: url.includes('/login')
      });
      
      // After successful login, always redirect to the home page
      if (url.includes('/api/auth/signin') || url.includes('/login')) {
        console.log(`Login detected, redirecting to home page: ${baseUrl}/`);
        return `${baseUrl}/`;
      }
      
      // For callback URLs that include callbackUrl parameter, extract and redirect to it
      const callbackParam = new URL(url, baseUrl).searchParams.get('callbackUrl');
      if (callbackParam) {
        try {
          const decodedCallback = decodeURIComponent(callbackParam);
          console.log(`Found callbackUrl param: ${decodedCallback}`);
          
          // Validate the callback URL is safe
          if (decodedCallback.startsWith(baseUrl) || decodedCallback.startsWith('/')) {
            const finalUrl = decodedCallback.startsWith('/') 
              ? `${baseUrl}${decodedCallback}`
              : decodedCallback;
            console.log(`Redirecting to decoded callback: ${finalUrl}`);
            return finalUrl;
          }
        } catch (error) {
          console.error('Error processing callback URL:', error);
        }
      }
      
      // Default NextAuth behavior
      if (url.startsWith(baseUrl)) {
        console.log(`Redirecting to URL with baseUrl: ${url}`);
        return url;
      }
      
      if (url.startsWith('/')) {
        const redirectUrl = `${baseUrl}${url}`;
        console.log(`Redirecting to relative URL: ${redirectUrl}`);
        return redirectUrl;
      }
      
      // Default fallback: redirect to home page
      console.log(`Redirecting to default home page: ${baseUrl}/`);
      return `${baseUrl}/`;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || 'a-very-secret-key-that-should-be-in-env',
  debug: process.env.NODE_ENV === 'development',
};

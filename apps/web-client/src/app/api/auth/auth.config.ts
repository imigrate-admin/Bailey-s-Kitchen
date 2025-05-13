import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthTokens } from '@/types/auth';

// IMMEDIATE DEBUG LOG: File loading verification
console.log('🔄 AUTH CONFIG: Loading auth configuration file');

// Generate a unique ID for correlation tracking
const generateCorrelationId = () => `auth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// Global correlation ID for the current file load
const CONFIG_CORRELATION_ID = generateCorrelationId();

// Determine the correct API URL based on the environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// Helper function to determine if code is running server-side
const isServerSide = () => typeof window === 'undefined';

// Helper function to get the appropriate URL for different contexts
const getApiUrl = () => {
  const url = API_URL;
  console.log(`🔗 AUTH URL [${CONFIG_CORRELATION_ID}]: Resolved API URL: ${url} (${isServerSide() ? 'server-side' : 'client-side'})`);
  return url;
};

// Helper to get browser-safe auth endpoints that will be correctly rewritten
const getAuthEndpoint = (path: string) => {
  if (!isServerSide()) {
    return `/api/auth/${path}`;
  }
  return `${API_URL}/auth/${path}`;
};

// Network status check function
const checkNetworkStatus = async (url: string): Promise<{ ok: boolean; message: string }> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return { ok: response.ok, message: `Status: ${response.status} ${response.statusText}` };
  } catch (error: any) {
    return { ok: false, message: `Network error: ${error.name} - ${error.message}` };
  }
};

// Initial configuration log
console.log(`🛠️ AUTH CONFIG [${CONFIG_CORRELATION_ID}]:`, {
  API_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  IS_SERVER: isServerSide(),
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '***[MASKED]***' : 'NOT SET',
  NODE_ENV: process.env.NODE_ENV,
  runtime: isServerSide() ? 'server' : 'client',
  timestamp: new Date().toISOString()
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" },
        firstName: { label: "First Name", type: "text" },
        lastName: { label: "Last Name", type: "text" },
        isRegister: { label: "Is Register", type: "text" }
      },
      async authorize(credentials) {
        const correlationId = generateCorrelationId();
        console.log(`🔑 AUTH START [${correlationId}]: Authorization attempt initiated`);

        try {
          if (!credentials?.email || !credentials?.password) {
            console.error(`❌ AUTH ERROR [${correlationId}]: Missing credentials`);
            throw new Error('Email and password are required');
          }

          const isRegister = credentials.isRegister === 'true';
          const authPath = isRegister ? 'register' : 'login';
          const endpoint = getAuthEndpoint(authPath);

          console.log(`🔍 AUTH REQUEST [${correlationId}]:`, {
            endpoint,
            isRegister,
            email: credentials.email ? `${credentials.email.substring(0, 3)}...` : 'not provided',
            timestamp: new Date().toISOString(),
            userAgent: isServerSide() ? 'server-side' : window.navigator.userAgent
          });

          const healthCheckUrl = isServerSide() ? `${API_URL}/health` : '/api/health';
          const networkStatus = await checkNetworkStatus(healthCheckUrl);
          console.log(`🔄 AUTH NETWORK [${correlationId}]: Status - ${networkStatus.ok ? '✅ Connected' : '❌ Failed'}, ${networkStatus.message}`);

          if (!networkStatus.ok) {
            throw new Error(`Unable to connect to authentication server. Please try again later. (${networkStatus.message})`);
          }

          let response;
          const requestBody = isRegister
            ? {
                email: credentials.email,
                password: credentials.password,
                firstName: credentials.firstName,
                lastName: credentials.lastName,
              }
            : {
                email: credentials.email,
                password: credentials.password,
              };

          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Correlation-ID': correlationId
            },
            body: JSON.stringify(requestBody),
          });

          if (!response.ok) {
            let errorData;
            try {
              errorData = await response.json();
            } catch {
              const rawText = await response.text();
              throw new Error(`Authentication failed: ${rawText}`);
            }
            throw new Error(errorData.error || errorData.message || `Authentication failed`);
          }

          const data = await response.json();
          if (!data.accessToken || !data.user?.id) {
            throw new Error('Received invalid data from authentication server');
          }

          return {
            id: data.user.id,
            email: data.user.email,
            name: `${data.user.firstName} ${data.user.lastName}`,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            accessToken: data.accessToken,
          };
        } catch (error: any) {
          console.error(`❌ AUTH ERROR [${correlationId}]:`, {
            message: error.message,
            stack: error.stack,
            credentials: credentials ? { email: credentials.email, hasPassword: !!credentials.password } : 'No credentials',
          });
          throw new Error(error.message || 'Authentication failed. Please try again.');
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
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
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes('/api/auth/signin') || url.includes('/login') || url.includes('/register')) {
        return `${baseUrl}/`;
      }

      const callbackParam = new URL(url, baseUrl).searchParams.get('callbackUrl');
      if (callbackParam) {
        const decoded = decodeURIComponent(callbackParam);
        if (decoded.startsWith(baseUrl) || decoded.startsWith('/')) {
          return decoded.startsWith('/') ? `${baseUrl}${decoded}` : decoded;
        }
      }

      return url.startsWith(baseUrl) ? url : `${baseUrl}/`;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || 'a-very-secret-key-that-should-be-in-env',
  debug: process.env.NODE_ENV === 'development',
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log('User signed in:', {
        userId: user.id,
        isNewUser,
        provider: account?.provider
      });
    },
    async signOut() {
      console.log('User signed out');
    },
    async createUser({ user }) {
      console.log('New user created:', { userId: user.id });
    },
    async linkAccount({ user, account }) {
      console.log('Account linked:', {
        userId: user.id,
        provider: account.provider
      });
    },
    async session({ session }) {
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
      console.debug('NextAuth debug:', { code, message });
    },
  },
};

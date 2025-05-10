import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthTokens } from '@/types/auth';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" }
      },
      async authorize(credentials) {
        try {
          // Make a request to the backend API
          // NEXT_PUBLIC_API_URL already includes /api/v1, so don't add it again
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
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
          console.error('Auth error:', error);
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
    async jwt({ token, user }) {
      if (user) {
        // First time jwt callback is run, user is available
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
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || 'a-very-secret-key-that-should-be-in-env',
  debug: process.env.NODE_ENV === 'development',
};

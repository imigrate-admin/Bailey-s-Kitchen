/**
 * Authentication-related type definitions
 */

// User profile information
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
}

// Authentication token response from backend
export interface AuthTokens {
  accessToken: string;
  user: UserProfile;
}

// Login request data
export interface LoginRequest {
  email: string;
  password: string;
}

// Register request data
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Session data structure used throughout the app
export interface Session {
  user: UserProfile;
  accessToken: string;
  isLoggedIn: boolean;
  expires: string;
}


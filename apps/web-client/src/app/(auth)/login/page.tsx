import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Bailey\'s Kitchen account',
};

export default function LoginPage() {
  return (
    <div>
      <div className="text-center p-6 bg-gray-50 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
        <p className="mt-1 text-gray-600">Welcome back to Bailey's Kitchen</p>
      </div>
      
      <LoginForm />
      
      <div className="px-6 py-4 bg-gray-50 border-t text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link 
            href="/register" 
            className="text-primary-500 font-medium hover:text-primary-600"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}


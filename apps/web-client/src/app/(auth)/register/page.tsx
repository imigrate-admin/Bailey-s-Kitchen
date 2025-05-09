import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new Bailey\'s Kitchen account',
};

export default function RegisterPage() {
  return (
    <div>
      <div className="text-center p-6 bg-gray-50 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-1 text-gray-600">Join Bailey's Kitchen today</p>
      </div>
      
      <RegisterForm />
      
      <div className="px-6 py-3 text-center text-xs text-gray-500">
        <p>
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-primary-500 hover:text-primary-600 underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary-500 hover:text-primary-600 underline">
            Privacy Policy
          </Link>
        </p>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link 
            href="/login" 
            className="text-primary-500 font-medium hover:text-primary-600"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}


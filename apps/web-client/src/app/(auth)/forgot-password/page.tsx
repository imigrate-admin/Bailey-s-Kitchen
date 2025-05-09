import React from 'react';
import { Metadata } from 'next';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your Bailey\'s Kitchen account password',
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="text-center p-6 bg-gray-50 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
        <p className="mt-1 text-gray-600">Recover access to your account</p>
      </div>
      
      <ForgotPasswordForm />
    </div>
  );
}


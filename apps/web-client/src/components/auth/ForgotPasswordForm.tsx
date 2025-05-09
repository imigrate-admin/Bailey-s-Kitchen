'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormField, 
  FormControl, 
  FormActions 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api-client';

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setFormError(null);
    setIsSuccess(false);

    try {
      // This will need to be implemented in the backend
      // await apiClient.post('/auth/forgot-password', data);
      
      // For now, we'll just simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setFormError(error.response?.data?.message || 'Failed to send password reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8 px-6">
        <div className="mb-4 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Check your email</h3>
        <p className="text-gray-600 mb-6">
          If an account exists with the email you provided, we've sent instructions to reset your password.
        </p>
        <Button variant="primary" href="/login">
          Return to Login
        </Button>
      </div>
    );
  }

  return (
    <Form 
      form={form} 
      onSubmit={onSubmit} 
      isLoading={isLoading}
      formError={formError || undefined}
      className="px-6 py-8"
    >
      <p className="text-gray-600 mb-6">
        Enter the email address associated with your account and we'll send you a link to reset your password.
      </p>

      <FormField label="Email Address" required>
        <FormControl name="email" form={form}>
          <Input
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            fullWidth
          />
        </FormControl>
      </FormField>

      <FormActions align="center" divider={false} className="mt-6">
        <Button variant="primary" type="submit" fullWidth isLoading={isLoading}>
          Send Reset Link
        </Button>
      </FormActions>
      
      <div className="mt-4 text-center">
        <Button variant="link" href="/login" size="sm">
          Back to Login
        </Button>
      </div>
    </Form>
  );
}

export default ForgotPasswordForm;


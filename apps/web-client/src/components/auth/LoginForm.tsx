'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
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
import { useAuth } from '@/hooks/useAuth';

// Form validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
});

type LoginFormValues = z.infer<typeof loginSchema>;

export interface LoginFormProps {
  onSuccess?: () => void;
  redirectUrl?: string;
}

export function LoginForm({ onSuccess, redirectUrl = '/' }: LoginFormProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, router, redirectUrl]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn('credentials', {
        ...data,
        isRegister: 'false', // Explicitly set to false for login
        redirect: false,
        callbackUrl: redirectUrl
      });

      if (result?.error) {
        setError(result.error);
        return false;
      }

      if (result?.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(redirectUrl);
        }
        return true;
      }

      return false;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form 
      form={form} 
      onSubmit={onSubmit} 
      isLoading={isLoading}
      formError={error || undefined}
      className="px-6 py-8"
    >
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

      <FormField label="Password" required>
        <FormControl name="password" form={form}>
          <Input
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            fullWidth
          />
        </FormControl>
      </FormField>

      <div className="flex justify-end mt-2 mb-6">
        <Button variant="link" href="/forgot-password" size="sm">
          Forgot password?
        </Button>
      </div>

      <FormActions align="center" divider={false}>
        <Button variant="primary" type="submit" fullWidth isLoading={isLoading}>
          Sign In
        </Button>
      </FormActions>
    </Form>
  );
}

export default LoginForm;


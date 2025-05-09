'use client';

import React, { useEffect } from 'react';
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
import { useAuth } from '@/hooks/useAuth';

// Form validation schema
const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name cannot exceed 50 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(50, { message: 'Last name cannot exceed 50 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'Please confirm your password' })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export interface RegisterFormProps {
  onSuccess?: () => void;
  redirectUrl?: string;
}

export function RegisterForm({ onSuccess, redirectUrl = '/login' }: RegisterFormProps) {
  const router = useRouter();
  const { register, isLoading, error, isAuthenticated } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: RegisterFormValues) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registrationData } = data;
    
    const success = await register(registrationData);
    
    if (success) {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectUrl);
      }
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
      <FormField label="First Name" required>
        <FormControl name="firstName" form={form}>
          <Input
            type="text"
            placeholder="Enter your first name"
            autoComplete="given-name"
            fullWidth
          />
        </FormControl>
      </FormField>

      <FormField label="Last Name" required>
        <FormControl name="lastName" form={form}>
          <Input
            type="text"
            placeholder="Enter your last name"
            autoComplete="family-name"
            fullWidth
          />
        </FormControl>
      </FormField>

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
            placeholder="Create a password"
            autoComplete="new-password"
            fullWidth
          />
        </FormControl>
      </FormField>

      <FormField label="Confirm Password" required>
        <FormControl name="confirmPassword" form={form}>
          <Input
            type="password"
            placeholder="Confirm your password"
            autoComplete="new-password"
            fullWidth
          />
        </FormControl>
      </FormField>

      <FormActions align="center" divider={false}>
        <Button variant="primary" type="submit" fullWidth isLoading={isLoading}>
          Create Account
        </Button>
      </FormActions>
    </Form>
  );
}

export default RegisterForm;


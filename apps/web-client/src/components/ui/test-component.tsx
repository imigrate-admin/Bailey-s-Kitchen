'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Import our UI components
import { Button } from './button';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter, CardMedia } from './card';
import { Container } from './container';
import { Input } from './input';
import { Badge } from './badge';
import { 
  Form, 
  FormField, 
  FormSection, 
  FormActions, 
  FormControl,
  useForm
} from './form';

// Define validation schema using zod
const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  petType: z.string().min(1, { message: 'Please select a pet type' }),
  notes: z.string().optional(),
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

// Sample product data
const sampleProducts = [
  {
    id: 1,
    name: 'Fresh Chicken Feast',
    description: 'Premium chicken with vegetables and brown rice.',
    price: 29.99,
    category: 'dog',
    status: 'In Stock',
  },
  {
    id: 2,
    name: 'Ocean Delight',
    description: 'Wild-caught salmon with sweet potatoes and herbs.',
    price: 34.99,
    category: 'cat',
    status: 'Low Stock',
  },
  {
    id: 3,
    name: 'Tender Turkey',
    description: 'Lean turkey with quinoa and garden vegetables.',
    price: 31.99,
    category: 'dog',
    status: 'Out of Stock',
  },
];

// Status badge renderer with appropriate colors
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'In Stock':
      return <Badge color="success" variant="soft">{status}</Badge>;
    case 'Low Stock':
      return <Badge color="warning" variant="soft">{status}</Badge>;
    case 'Out of Stock':
      return <Badge color="error" variant="soft">{status}</Badge>;
    default:
      return <Badge color="gray" variant="soft">{status}</Badge>;
  }
};

export const TestComponent = () => {
  // Set up form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      petType: '',
      notes: '',
    },
  });

  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();
  const [formSuccess, setFormSuccess] = useState(false);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setFormError(undefined);
    setFormSuccess(false);
    
    // Simulate API call
    try {
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', data);
      setFormSuccess(true);
    } catch (error) {
      setFormError('An error occurred while submitting the form. Please try again.');
      console.error('Form error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" className="py-12">
      <h1 className="text-3xl font-bold mb-8">UI Components Test</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Pet Registration</CardTitle>
              <CardDescription>Register your pet to get personalized meal plans</CardDescription>
            </CardHeader>
            <CardBody>
              <Form form={form} onSubmit={onSubmit} isLoading={isLoading} formError={formError}>
                <FormSection title="Owner Information">
                  <FormControl name="fullName" form={form}>
                    <Input label="Full Name" placeholder="Enter your full name" />
                  </FormControl>
                  
                  <FormControl name="email" form={form}>
                    <Input 
                      label="Email" 
                      type="email" 
                      placeholder="Enter your email" 
                      leftAddon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      }
                    />
                  </FormControl>
                  
                  <FormControl name="password" form={form}>
                    <Input 
                      label="Password" 
                      type="password" 
                      placeholder="Create a password" 
                      showPasswordToggle 
                    />
                  </FormControl>
                </FormSection>
                
                <FormSection title="Pet Information" divider>
                  <FormControl name="petType" form={form}>
                    <Input 
                      label="Pet Type" 
                      placeholder="Dog, Cat, etc." 
                    />
                  </FormControl>
                  
                  <FormControl name="notes" form={form}>
                    <Input 
                      label="Additional Notes" 
                      placeholder="Any special dietary requirements?"
                      helperText="Optional: Include any special needs or preferences"
                    />
                  </FormControl>
                </FormSection>
                
                <FormActions isLoading={isLoading}>
                  <Button type="button" variant="outline">Cancel</Button>
                  <Button type="submit" isLoading={isLoading}>Register Pet</Button>
                </FormActions>
              </Form>
              
              {formSuccess && (
                <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-md">
                  <p>Registration successful! You'll receive meal plan recommendations soon.</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
        
        {/* Right Column - Cards and Components */}
        <div className="lg:col-span-2">
          {/* Badge Examples */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Badge Examples</CardTitle>
              <CardDescription>Various badge styles and variants</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-4">
                <Badge variant="solid" color="primary">New</Badge>
                <Badge variant="outline" color="secondary">Featured</Badge>
                <Badge variant="soft" color="success">In Stock</Badge>
                <Badge variant="soft" color="warning">Low Stock</Badge>
                <Badge variant="soft" color="error">Out of Stock</Badge>
                <Badge variant="solid" color="primary" count={5}>Notifications</Badge>
                <Badge variant="solid" color="gray" pill>Default</Badge>
                <Badge 
                  variant="solid" 
                  color="primary" 
                  dismissible 
                  onDismiss={() => console.log('Badge dismissed')}
                >
                  Dismissible
                </Badge>
                <Badge 
                  variant="outline" 
                  color="primary" 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  }
                >
                  With Icon
                </Badge>
                <Badge variant="solid" color="primary" count={125} maxCount={99}>Count</Badge>
                <Badge variant="soft" color="gray" dot>With Dot</Badge>
                <Badge variant="solid" color="secondary" href="#">Clickable</Badge>
              </div>
            </CardBody>
          </Card>
          
          {/* Button Examples */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Button Examples</CardTitle>
              <CardDescription>Various button styles and variants</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button isLoading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button 
                    leftIcon={
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    }
                  >
                    With Icon
                  </Button>
                  <Button fullWidth className="mt-2">Full Width</Button>
                </div>
              </div>
            </CardBody>
          </Card>
          
          {/* Product Cards */}
          <h2 className="text-xl font-semibold mb-4">Sample Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleProducts.map((product) => (
              <Card key={product.id} variant="interactive">
                <CardBody>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-sm text-gray-500">For {product.category === 'dog' ? 'Dogs' : 'Cats'}</p>
                      </div>
                      <StatusBadge status={product.status} />
                    </div>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <p className="font-bold text-primary">${product.price.toFixed(2)}</p>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button 
                    fullWidth 
                    disabled={product.status === 'Out of Stock'}
                  >
                    {product.status === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TestComponent;


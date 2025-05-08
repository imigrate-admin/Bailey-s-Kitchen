/**
 * UI Component Library for Bailey's Kitchen
 * 
 * This file exports all UI components and their types for use throughout the application.
 * Components are organized by category and follow consistent patterns.
 */

// Button
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './button';

// Card and related components
export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardBody, 
  CardFooter, 
  CardMedia,
  type CardProps,
  type CardVariant,
  type CardShadow
} from './card';

// Container
export { Container, type ContainerProps, type ContainerWidth } from './container';

// Input
export { Input, type InputProps, type InputSize } from './input';

// Badge
export { Badge, type BadgeProps, type BadgeVariant, type BadgeColor, type BadgeSize } from './badge';

// Form and related components
export { 
  Form,
  FormField,
  FormSection,
  FormActions,
  FormControl,
  useForm,
  type FormProps,
  type FormFieldProps,
  type FormSectionProps,
  type FormActionsProps,
  type FormControlProps
} from './form';

// Test component (for development only)
export { TestComponent } from './test-component';


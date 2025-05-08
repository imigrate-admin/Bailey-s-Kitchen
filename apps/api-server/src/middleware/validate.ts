import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppError } from './error-handler';

/**
 * Middleware for DTO validation using class-validator
 */
export function validateDto<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Transform plain request body object to class instance
      const dtoObj = plainToInstance(dtoClass, req.body);
      
      // Validate the object using class-validator
      const errors: ValidationError[] = await validate(dtoObj, { 
        whitelist: true, 
        forbidNonWhitelisted: true 
      });
      
      if (errors.length > 0) {
        // Format validation errors for the response
        const formattedErrors = formatValidationErrors(errors);
        
        return next(new AppError(
          'Validation failed',
          400,
          formattedErrors
        ));
      }
      
      // Update request body with validated and transformed object
      req.body = dtoObj;
      next();
    } catch (error) {
      next(new AppError(
        'Validation error',
        400,
        error instanceof Error ? error.message : 'Unknown validation error'
      ));
    }
  };
}

/**
 * Format validation errors into a more readable object
 */
function formatValidationErrors(errors: ValidationError[]): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};
  
  errors.forEach(error => {
    const property = error.property;
    const constraints = error.constraints;
    
    if (constraints) {
      formattedErrors[property] = Object.values(constraints);
    }
    
    // Handle nested validation errors
    if (error.children && error.children.length > 0) {
      const childErrors = formatValidationErrors(error.children);
      
      Object.keys(childErrors).forEach(key => {
        const nestedKey = `${property}.${key}`;
        formattedErrors[nestedKey] = childErrors[key];
      });
    }
  });
  
  return formattedErrors;
}

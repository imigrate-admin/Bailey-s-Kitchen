import { body } from 'express-validator';

export const createPostSchema = [
  body('title').isString().trim().notEmpty().withMessage('Title is required'),
  body('content').isString().trim().notEmpty().withMessage('Content is required'),
  body('excerpt').isString().trim().notEmpty().withMessage('Excerpt is required'),
  body('featuredImage').optional().isURL().withMessage('Featured image must be a valid URL'),
  body('category').isString().trim().notEmpty().withMessage('Category is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean')
];

export const updatePostSchema = [
  body('title').optional().isString().trim().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().isString().trim().notEmpty().withMessage('Content cannot be empty'),
  body('excerpt').optional().isString().trim().notEmpty().withMessage('Excerpt cannot be empty'),
  body('featuredImage').optional().isURL().withMessage('Featured image must be a valid URL'),
  body('category').optional().isString().trim().notEmpty().withMessage('Category cannot be empty'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean')
]; 
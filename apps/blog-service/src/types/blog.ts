import { BlogCategory } from '@prisma/client';

export interface CreateBlogPostDto {
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: BlogCategory;
  authorId: string;
  tags: string[];
  isPublished?: boolean;
}

export interface UpdateBlogPostDto {
  title?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  category?: BlogCategory;
  tags?: string[];
  isPublished?: boolean;
}

export interface CreateCommentDto {
  content: string;
  authorId: string;
  postId: string;
}

export interface BlogPostFilters {
  category?: BlogCategory;
  authorId?: string;
  tag?: string;
  isPublished?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 
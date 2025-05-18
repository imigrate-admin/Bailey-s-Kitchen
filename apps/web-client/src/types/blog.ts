export enum BlogCategory {
  HEALTH = 'HEALTH',
  NUTRITION = 'NUTRITION',
  TRAINING = 'TRAINING',
  LIFESTYLE = 'LIFESTYLE',
  GROOMING = 'GROOMING',
  BEHAVIOR = 'BEHAVIOR'
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: BlogCategory;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  likes: number;
  isPublished: boolean;
}

export interface BlogComment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
} 
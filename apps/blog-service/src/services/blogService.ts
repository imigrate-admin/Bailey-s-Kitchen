import { PrismaClient } from '@prisma/client';
import type { BlogPost, Prisma } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

export interface BlogPostFilters {
  category?: Prisma.BlogPostCreateInput['category'];
  page?: number;
  limit?: number;
  status?: 'draft' | 'published' | 'archived';
}

export class BlogService {
  async getPosts(filters: BlogPostFilters) {
    console.log('Getting posts with filters:', filters);
    const { category, page = 1, limit = 10, status = 'published' } = filters;
    const skip = (page - 1) * limit;

    const where = {
      ...(category && { category }),
      ...(status && { status })
    };

    console.log('Constructed where clause:', where);

    try {
      const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }),
        prisma.blogPost.count({ where })
      ]);

      console.log('Retrieved posts:', posts);
      console.log('Total count:', total);

      return {
        posts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error in getPosts:', error);
      throw error;
    }
  }

  async getPostBySlug(slug: string) {
    return prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });
  }

  async createPost(data: Omit<Prisma.BlogPostCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'likes'>) {
    const slug = slugify(data.title, { lower: true });
    return prisma.blogPost.create({
      data: {
        ...data,
        slug
      }
    });
  }

  async updatePost(id: string, data: Partial<Omit<Prisma.BlogPostUpdateInput, 'id' | 'createdAt' | 'updatedAt'>>) {
    if (data.title && typeof data.title === 'string') {
      data.slug = slugify(data.title, { lower: true });
    }
    return prisma.blogPost.update({
      where: { id },
      data
    });
  }

  async deletePost(id: string) {
    await prisma.blogPost.delete({
      where: { id }
    });
  }

  async getComments(postId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { postId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.comment.count({
        where: { postId }
      })
    ]);

    return {
      comments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async createComment(postId: string, content: string, authorId: string) {
    return prisma.comment.create({
      data: {
        content,
        postId,
        authorId
      }
    });
  }

  async deleteComment(postId: string, commentId: string) {
    await prisma.comment.delete({
      where: {
        id: commentId,
        postId
      }
    });
  }

  async likePost(id: string) {
    return prisma.blogPost.update({
      where: { id },
      data: {
        likes: {
          increment: 1
        }
      }
    });
  }
} 
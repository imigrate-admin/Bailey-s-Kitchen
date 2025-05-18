import { Router, Request, Response } from 'express';
import { body, query, param } from 'express-validator';
import { BlogCategory } from '@prisma/client';
import { validateRequest } from '../middleware/validateRequest';
import { BlogService, BlogPostFilters } from '../services/blogService';
import { createPostSchema, updatePostSchema } from '../schemas/blogSchemas';

const router = Router();
const blogService = new BlogService();

// Get all published posts with optional filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('Received request with query:', req.query);
    const { 
      category, 
      page = '1', 
      limit = '10', 
      status = 'published' 
    } = req.query;

    console.log('Extracted query parameters:', { category, page, limit, status });

    const filters: BlogPostFilters = {
      category: category as BlogCategory,
      page: Number(page),
      limit: Number(limit),
      status: status as 'draft' | 'published' | 'archived'
    };

    console.log('Applying filters:', filters);
    const posts = await blogService.getPosts(filters);
    console.log('Retrieved posts:', posts);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// Get a single post by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const post = await blogService.getPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

// Create a new post (protected route)
router.post('/', validateRequest(createPostSchema), async (req: Request, res: Response) => {
  try {
    const post = await blogService.createPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// Update a post (protected route)
router.put('/:id', validateRequest(updatePostSchema), async (req: Request, res: Response) => {
  try {
    const post = await blogService.updatePost(req.params.id, req.body);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to update post' });
    }
  }
});

// Delete a post (protected route)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await blogService.deletePost(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to delete post' });
    }
  }
});

// Get comments for a post
router.get('/:postId/comments', async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const comments = await blogService.getComments(
      req.params.postId,
      Number(page),
      Number(limit)
    );
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

// Create a comment on a post
router.post('/:postId/comments', async (req: Request, res: Response) => {
  try {
    // TODO: Get authorId from authenticated user
    const authorId = req.body.authorId || 'anonymous';
    const comment = await blogService.createComment(
      req.params.postId,
      req.body.content,
      authorId
    );
    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to create comment' });
    }
  }
});

// Delete a comment
router.delete('/:postId/comments/:commentId', async (req: Request, res: Response) => {
  try {
    await blogService.deleteComment(req.params.postId, req.params.commentId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to delete comment' });
    }
  }
});

// Like a post
router.post('/:id/like', async (req: Request, res: Response) => {
  try {
    const post = await blogService.likePost(req.params.id);
    res.json(post);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to like post' });
    }
  }
});

export default router; 
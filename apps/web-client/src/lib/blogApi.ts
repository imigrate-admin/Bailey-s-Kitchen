import { api } from './api';
import { API_CONFIG } from '@/config/api';
import { BlogPost, BlogComment, BlogCategory } from '@/types/blog';

const blogApi = {
  // Public endpoints
  async getPublishedPosts(category?: BlogCategory, page = 1, limit = 10) {
    try {
      const { data } = await api.get(`${API_CONFIG.BLOG_SERVICE_URL}`, {
        params: { category, page, limit, status: 'published' }
      });
      return data;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  async getPostBySlug(slug: string) {
    try {
      const { data } = await api.get(`${API_CONFIG.BLOG_SERVICE_URL}/${slug}`);
      return data as BlogPost;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  },

  async getComments(postId: string, page = 1, limit = 10) {
    try {
      const { data } = await api.get(`${API_CONFIG.BLOG_SERVICE_URL}/${postId}/comments`, {
        params: { page, limit }
      });
      return data as { comments: BlogComment[], total: number };
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Admin endpoints
  async createPost(post: Partial<BlogPost>) {
    try {
      const { data } = await api.post(`${API_CONFIG.BLOG_SERVICE_URL}`, post);
      return data as BlogPost;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  async updatePost(id: string, post: Partial<BlogPost>) {
    try {
      const { data } = await api.put(`${API_CONFIG.BLOG_SERVICE_URL}/${id}`, post);
      return data as BlogPost;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },

  async deletePost(id: string) {
    try {
      await api.delete(`${API_CONFIG.BLOG_SERVICE_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  },

  async createComment(postId: string, content: string) {
    try {
      const { data } = await api.post(`${API_CONFIG.BLOG_SERVICE_URL}/${postId}/comments`, { content });
      return data as BlogComment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  async deleteComment(postId: string, commentId: string) {
    try {
      await api.delete(`${API_CONFIG.BLOG_SERVICE_URL}/${postId}/comments/${commentId}`);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  async likePost(id: string) {
    try {
      const { data } = await api.post(`${API_CONFIG.BLOG_SERVICE_URL}/${id}/like`);
      return data as BlogPost;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  async likeComment(postId: string, commentId: string) {
    try {
      const { data } = await api.post(`${API_CONFIG.BLOG_SERVICE_URL}/${postId}/comments/${commentId}/like`);
      return data as BlogComment;
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  }
};

export { blogApi }; 
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { BlogPost, BlogCategory } from '@/types/blog';
import { blogApi } from '@/lib/blogApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

// Dynamic import of the rich text editor to avoid SSR issues
const Editor = dynamic(() => import('@/components/ui/editor'), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />,
});

export default function BlogEditor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    category: BlogCategory.HEALTH,
    tags: [],
    isPublished: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const newPost = await blogApi.createPost({
        ...post,
        slug: post.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
      });
      
      router.push(`/blog/${newPost.slug}`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    setPost(prev => ({ ...prev, tags }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">
              Create New Blog Post
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label="Title"
                  value={post.title}
                  onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                  required
                  fullWidth
                />

                <Input
                  label="Excerpt"
                  value={post.excerpt}
                  onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  required
                  fullWidth
                  helperText="A brief summary of the post (shown in listings)"
                />

                <Select
                  label="Category"
                  value={post.category}
                  onChange={(value) => setPost(prev => ({ ...prev, category: value as BlogCategory }))}
                  options={Object.values(BlogCategory).map(category => ({
                    value: category,
                    label: category.charAt(0) + category.slice(1).toLowerCase(),
                  }))}
                  required
                />

                <Input
                  label="Tags"
                  value={post.tags?.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="Enter tags separated by commas"
                  helperText="Example: nutrition, health tips, dog care"
                  fullWidth
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <Editor
                    value={post.content}
                    onChange={(content) => setPost(prev => ({ ...prev, content }))}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={post.isPublished}
                    onChange={(e) => setPost(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="isPublished" className="text-sm text-gray-700">
                    Publish immediately
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={loading}
                  disabled={loading}
                >
                  {post.isPublished ? 'Publish Post' : 'Save Draft'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 
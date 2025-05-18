'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BlogPost, BlogCategory } from '@/types/blog';
import { blogApi } from '@/lib/blogApi';
import { BlogCard } from '@/components/blog/BlogCard';

const CATEGORIES = [
  { id: '', label: 'All Posts' },
  { id: BlogCategory.HEALTH, label: 'Health & Wellness' },
  { id: BlogCategory.NUTRITION, label: 'Nutrition' },
  { id: BlogCategory.TRAINING, label: 'Training Tips' },
  { id: BlogCategory.LIFESTYLE, label: 'Lifestyle' },
  { id: BlogCategory.GROOMING, label: 'Grooming' },
  { id: BlogCategory.BEHAVIOR, label: 'Behavior' },
];

export function BlogListing() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | ''>(
    (searchParams?.get('category') as BlogCategory) || ''
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await blogApi.getPublishedPosts(
          selectedCategory || undefined
        );
        setPosts(data.posts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as BlogCategory)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-pulse"
            >
              <div className="h-48 bg-gray-200" />
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-8 bg-gray-200 rounded" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Blog Posts Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* No Posts Message */}
      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No posts found
          </h3>
          <p className="text-gray-600">
            {selectedCategory
              ? `No posts available in the ${selectedCategory} category yet.`
              : 'No blog posts available at the moment.'}
          </p>
        </div>
      )}
    </div>
  );
} 
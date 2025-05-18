'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/lib/utils';
import { useMemo } from 'react';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = useMemo(() => formatDate(post.publishedAt), [post.publishedAt]);
  const avatarSrc = post.author?.avatar || '/images/default-avatar.png';
  const authorName = post.author?.name || 'Anonymous';

  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-sm font-medium bg-primary/90 text-white rounded-full">
              {post.category}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-2">
              <Image
                src={avatarSrc}
                alt={authorName}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{authorName}</span>
            </div>
            <span>•</span>
            <time dateTime={post.publishedAt}>{formattedDate}</time>
            <span>•</span>
            <span>{post.readTime} min read</span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
            {post.title}
          </h3>
          
          <p className="text-gray-600 line-clamp-3 mb-4">
            {post.excerpt}
          </p>
          
          <div className="flex items-center gap-3">
            {post.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
} 
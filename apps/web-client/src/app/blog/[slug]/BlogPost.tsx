'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BlogPost as BlogPostType } from '@/types/blog';
import { formatDate } from '@/lib/utils';
import { Comments } from './Comments';

interface BlogPostProps {
  post: BlogPostType;
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container-custom">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-4">
                <Link
                  href={`/blog?category=${post.category}`}
                  className="px-3 py-1 text-sm font-medium bg-primary/90 text-white rounded-full hover:bg-primary transition-colors"
                >
                  {post.category}
                </Link>
                <time dateTime={post.publishedAt} className="text-white/80">
                  {formatDate(post.publishedAt)}
                </time>
                <span className="text-white/80">{post.readTime} min read</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-4">
                <Image
                  src={post.author.avatar || '/images/default-avatar.png'}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  <div className="text-sm text-white/80">Author</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {/* Tags */}
            <div className="flex items-center gap-3 not-prose mb-8">
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            
            {/* Article Content */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            
            {/* Author Bio */}
            <div className="not-prose mt-12 p-6 bg-gray-50 rounded-2xl">
              <div className="flex items-start gap-4">
                <Image
                  src={post.author.avatar || '/images/default-avatar.png'}
                  alt={post.author.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    About {post.author.name}
                  </h3>
                  <p className="text-gray-600">
                    Expert in pet nutrition and care, sharing insights to help pet parents
                    make informed decisions for their furry friends' well-being.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <Comments postId={post.id} />
          </div>
        </div>
      </div>
    </article>
  );
} 
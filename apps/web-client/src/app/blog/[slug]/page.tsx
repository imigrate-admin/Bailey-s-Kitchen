import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPost } from './BlogPost';
import { blogApi } from '@/lib/blogApi';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await blogApi.getPostBySlug(params.slug);
    
    return {
      title: `${post.title} | Bailey's Kitchen Blog`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: [post.featuredImage],
        type: 'article',
        authors: [post.author.name],
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
      },
    };
  } catch (error) {
    return {
      title: 'Blog Post Not Found | Bailey\'s Kitchen',
      description: 'The requested blog post could not be found.',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const post = await blogApi.getPostBySlug(params.slug);
    
    if (!post.isPublished) {
      notFound();
    }
    
    return <BlogPost post={post} />;
  } catch (error) {
    notFound();
  }
} 
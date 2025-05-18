import { Metadata } from 'next';
import { BlogListing } from './BlogListing';

export const metadata: Metadata = {
  title: 'Paws & Tales - Pet Care Blog | Bailey\'s Kitchen',
  description: 'Discover expert tips, tricks, and advice for keeping your pets healthy and happy. Read our blog for the latest in pet care, nutrition, and lifestyle.',
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-transparent pt-16 pb-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Paws & Tales
            </h1>
            <p className="text-xl text-gray-600">
              Expert tips and insights for your pet's health, happiness, and well-being.
              Discover the latest in pet care, nutrition, and lifestyle.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Listing */}
      <section className="py-12">
        <div className="container-custom">
          <BlogListing />
        </div>
      </section>
    </main>
  );
} 
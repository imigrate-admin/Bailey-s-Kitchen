import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Product, PetCategory } from '@/types/product';
import { productApi } from '@/lib/api';
import { ProductListingClient } from '@/components/products/ProductListingClient';

// Static metadata for products listing page
export const metadata: Metadata = {
  title: 'Pet Food Products | Premium Food for Dogs and Cats',
  description: 'Browse our selection of premium, healthy pet food products for dogs and cats. Nutritious meals delivered to your doorstep.',
  openGraph: {
    title: 'Premium Pet Food Products | Bailey\'s Kitchen',
    description: 'Discover our range of carefully crafted pet food for your furry friends',
    images: [
      {
        url: '/images/products-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Bailey\'s Kitchen Pet Food Products',
      }
    ],
    type: 'website',
  },
};

async function getProducts(category?: string) {
  try {
    // Validate the category is a valid PetCategory type
    let validCategory: PetCategory | undefined;
    
    if (category === 'DOG' || category === 'CAT') {
      validCategory = category;
    }
    
    const products = validCategory 
      ? await productApi.getProducts(validCategory)
      : await productApi.getProducts();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = searchParams.category as string | undefined;
  let errorMessage: string | null = null;
  
  try {
    // Fetch initial products on the server for SEO and initial render
    const products = await getProducts(category);
    
    return (
      <Container>
        <div className="space-y-6 py-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Premium Pet Food</h1>
            <p className="text-gray-600">
              Browse our selection of nutritious meals for your furry friends
            </p>
          </div>
          
          {/* Pass the server-fetched products and category to the client component */}
          <ProductListingClient 
            initialProducts={products} 
            initialCategory={category} 
          />
        </div>
      </Container>
    );
  } catch (error) {
    console.error('Error in server component:', error);
    errorMessage = error instanceof Error ? error.message : 'Failed to load products';
    
    return (
      <Container>
        <div className="space-y-6 py-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Premium Pet Food</h1>
            <p className="text-gray-600">
              Browse our selection of nutritious meals for your furry friends
            </p>
          </div>
          
          {/* Handle server errors gracefully */}
          <div className="rounded-lg bg-red-50 p-6 text-center my-12">
            <h2 className="text-xl font-semibold text-red-800 mb-3">
              Something went wrong
            </h2>
            <p className="text-red-600 mb-4">
              {errorMessage || 'Failed to load products. Please try again later.'}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Container>
    );
  }
}

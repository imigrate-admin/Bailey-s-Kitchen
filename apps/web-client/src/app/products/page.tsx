import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { ProductCategoryFilter } from '@/components/products/ProductCategoryFilter';
import { Product } from '@/types/product';
import { productApi } from '@/lib/api';

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
    const products = category 
      ? await productApi.getProducts(category)
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
        
        <ProductCategoryFilter initialCategory={category} />
        
        <div className="mt-8">
          <ProductCategoryFilter.Products initialProducts={products} />
        </div>
      </div>
    </Container>
  );
}

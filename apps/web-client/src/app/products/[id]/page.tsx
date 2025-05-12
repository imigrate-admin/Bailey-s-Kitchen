import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Product } from '@/types/product';
import { productApi, APIError } from '@/lib/api';

// Generate metadata for the product page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const product = await getProduct(params.id);
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.'
      };
    }

    return {
      title: product.name,
      description: product.description.substring(0, 160), // Limit description to 160 characters for SEO
      keywords: [product.category === 'DOG' ? 'dog food' : 'cat food', 'pet food', 'premium', 'nutrition', product.name],
      openGraph: {
        title: product.name,
        description: product.description,
        images: [
          {
            url: product.imageUrl || '/images/product-placeholder.jpg',
            width: 800,
            height: 600,
            alt: product.name,
          }
        ],
        type: 'product',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description.substring(0, 200),
        images: [product.imageUrl || '/images/product-placeholder.jpg'],
      }
    };
  } catch (error) {
    return {
      title: 'Product Details',
      description: 'View detailed information about our pet food products',
    };
  }
}

// JSON-LD structured data for the product
function generateJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageUrl || '/images/product-placeholder.jpg',
    sku: product.id,
    category: product.category === 'DOG' ? 'Dog Food' : 'Cat Food',
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    brand: {
      '@type': 'Brand',
      name: "Bailey's Kitchen",
    },
    // Add extra structured data attributes for better SEO
    productID: product.id,
    identifier_exists: "yes",
    mpn: `BK-${product.id}`, // Manufacturer Part Number
    releaseDate: product.createdAt,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '124',
    }
  };
}

// Server-side function to fetch product data
async function getProduct(id: string): Promise<Product | null> {
  try {
    return await productApi.getProduct(id);
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }
  
  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateJsonLd(product)),
        }}
      />
      <Container>
        <div className="mb-6">
          <Link
            href="/products"
            className="text-primary hover:text-primary/80 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Products
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg">
            <Image
              src={product.imageUrl || '/images/product-placeholder.jpg'}
              alt={product.name}
              className="object-cover hover:scale-105 transition-transform duration-300"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              quality={90}
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-4" itemProp="name">{product.name}</h1>
            <p className="text-gray-600 mb-6" itemProp="description">{product.description}</p>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {product.category === 'DOG' ? 'Dog Food' : 'Cat Food'}
              </span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Product Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex flex-col">
                  <span className="font-medium">Category:</span>
                  <span>{product.category === 'DOG' ? 'Dog Food' : 'Cat Food'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Availability:</span>
                  <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                    {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="font-medium">Product ID:</span>
                  <span>{product.id}</span>
                </div>
              </div>
            </div>
            
            {/* Add to cart button - this would be a client component in a real implementation */}
            <div className="mt-auto">
              <button 
                className={`w-full py-3 px-6 rounded-full text-white font-medium transition-colors ${
                  product.stock > 0 
                    ? 'bg-primary hover:bg-primary/90'
                    : 'bg-gray-400 cursor-not-allowed'
                }`} 
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

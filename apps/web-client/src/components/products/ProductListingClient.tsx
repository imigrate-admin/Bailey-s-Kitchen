'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product, PetCategory } from '@/types/product';
import { ProductList } from '@/components/products/ProductList';
import { productApi, APIError } from '@/lib/api';

// Define the category filter type (including 'ALL' option)
type CategoryFilter = PetCategory | 'ALL';

// Props for category button component
interface CategoryButtonProps {
  category: CategoryFilter;
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

// Category button component for filtering
function CategoryButton({ category, selected, onClick, children }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full transition-colors ${
        selected
          ? 'bg-primary text-white'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
      }`}
      disabled={selected}
    >
      {children}
    </button>
  );
}

// Props for the ProductListingClient component
interface ProductListingClientProps {
  initialProducts: Product[];
  initialCategory?: string;
}

// Main component that combines category filtering and product listing
export function ProductListingClient({ 
  initialProducts,
  initialCategory 
}: ProductListingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for products, loading, errors, and selected category
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(
    (initialCategory as CategoryFilter) || 'ALL'
  );

  // Update URL when category changes
  const handleCategoryChange = (category: CategoryFilter) => {
    setSelectedCategory(category);
    
    // Update URL search params
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'ALL') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    
    // Update the URL without reloading the page
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Only pass valid pet category to the API call
        // If 'ALL' or null/undefined, don't pass a category filter
        let validCategory: PetCategory | undefined = undefined;
        
        if (selectedCategory === 'DOG' || selectedCategory === 'CAT') {
          validCategory = selectedCategory;
        }
        
        // Only fetch if we're not using the initial products with ALL category
        // or if we have a specific category selected
        if (selectedCategory !== 'ALL' || initialProducts.length === 0) {
          const data = await productApi.getProducts(validCategory);
          setProducts(data);
        } else if (initialProducts.length > 0 && selectedCategory === 'ALL') {
          // Use initial products when no category filter is applied
          setProducts(initialProducts);
        }
      } catch (err) {
        console.error('Error loading products:', err);
        setError(
          err instanceof APIError
            ? err.message
            : 'Failed to load products. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, initialProducts]);

  // Function to retry fetching products
  const handleRetry = () => {
    // Reset error state and re-trigger the effect
    setError(null);
    setLoading(true);
    // The useEffect will handle the fetch
  };

  return (
    <div className="space-y-8">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-4 pt-2">
        <CategoryButton
          category="ALL"
          selected={selectedCategory === 'ALL'}
          onClick={() => handleCategoryChange('ALL')}
        >
          All Products
        </CategoryButton>
        <CategoryButton
          category="DOG"
          selected={selectedCategory === 'DOG'}
          onClick={() => handleCategoryChange('DOG')}
        >
          Dog Food
        </CategoryButton>
        <CategoryButton
          category="CAT"
          selected={selectedCategory === 'CAT'}
          onClick={() => handleCategoryChange('CAT')}
        >
          Cat Food
        </CategoryButton>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-center my-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            {error}
          </h2>
          <p className="text-red-600 mb-4">
            Please try again or contact support if the problem persists.
          </p>
          <button 
            onClick={handleRetry} 
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Product List with loading state */}
      {!error && (
        <div className="mt-6">
          <ProductList products={products} loading={loading} />
          
          {/* Empty state when no products are found */}
          {!loading && products.length === 0 && !error && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">
                Try selecting a different category or check back later.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


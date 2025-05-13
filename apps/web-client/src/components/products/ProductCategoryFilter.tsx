'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product, PetCategory } from '@/types/product';
import { ProductList } from '@/components/products/ProductList';
import { productApi, APIError } from '@/lib/api';

type CategoryFilter = PetCategory | 'ALL';

interface CategoryButtonProps {
  category: CategoryFilter;
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

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

interface ProductCategoryFilterProps {
  initialCategory?: string;
}

export function ProductCategoryFilter({ initialCategory }: ProductCategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(
    initialCategory as CategoryFilter || 'ALL'
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

  return (
    <div className="flex flex-wrap gap-4 pb-4">
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
  );
}

interface ProductsProps {
  initialProducts: Product[];
}

// Client component for product list with filtering
function Products({ initialProducts }: ProductsProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') as CategoryFilter | null;
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products when category changes in URL
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Only pass valid pet category to the API call
        // If 'ALL' or null/undefined, don't pass a category filter
        let validCategory: PetCategory | undefined = undefined;
        
        if (categoryParam === 'DOG' || categoryParam === 'CAT') {
          validCategory = categoryParam;
        }
        
        const data = await productApi.getProducts(validCategory);
        setProducts(data);
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

    // Only fetch if we're filtering by category or we don't have initial products
    if (categoryParam || initialProducts.length === 0) {
      fetchProducts();
    } else if (!categoryParam) {
      // Reset to initial products when no category filter
      setProducts(initialProducts);
    }
  }, [categoryParam, initialProducts]);

  return (
    <>
      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-center mb-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            {error}
          </h2>
          <p className="text-red-600">
            Please try refreshing the page or contact support if the problem persists.
          </p>
        </div>
      )}

      {/* Product List */}
      {!error && (
        <ProductList products={products} loading={loading} />
      )}
    </>
  );
}

// Attach the Products component to the main component
ProductCategoryFilter.Products = Products;


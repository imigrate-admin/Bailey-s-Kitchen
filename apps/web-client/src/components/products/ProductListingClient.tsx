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
  icon?: React.ReactNode;
}

function CategoryButton({ category, selected, onClick, children, icon }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-full transition-colors flex items-center gap-2 ${
        selected
          ? 'bg-primary text-white shadow-md'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:shadow'
      }`}
      disabled={selected}
      aria-label={`Filter by ${children}`}
      role="tab"
      aria-selected={selected}
    >
      {icon}
      <span className="font-medium">{children}</span>
    </button>
  );
}

interface ProductListingClientProps {
  initialProducts: Product[];
  initialCategory?: string;
}

export function ProductListingClient({ 
  initialProducts,
  initialCategory 
}: ProductListingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(
    (initialCategory?.toUpperCase() as CategoryFilter) || 'ALL'
  );

  const handleCategoryChange = (category: CategoryFilter) => {
    setSelectedCategory(category);
    
    // Create a new URLSearchParams object with current params
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (category === 'ALL') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const searchQuery = searchParams?.get('q');
        const categoryParam = selectedCategory === 'ALL' ? undefined : selectedCategory;
        
        let data: Product[];
        if (searchQuery) {
          // If there's a search query, use searchProducts
          data = await productApi.searchProducts(searchQuery, categoryParam);
        } else {
          // Otherwise, use regular getProducts
          data = await productApi.getProducts(categoryParam);
        }
        
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

    fetchProducts();
  }, [selectedCategory, searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <CategoryButton
          category="ALL"
          selected={selectedCategory === 'ALL'}
          onClick={() => handleCategoryChange('ALL')}
        >
          All Products
        </CategoryButton>
        <CategoryButton
          category={PetCategory.DOG}
          selected={selectedCategory === PetCategory.DOG}
          onClick={() => handleCategoryChange(PetCategory.DOG)}
        >
          Dog Food
        </CategoryButton>
        <CategoryButton
          category={PetCategory.CAT}
          selected={selectedCategory === PetCategory.CAT}
          onClick={() => handleCategoryChange(PetCategory.CAT)}
        >
          Cat Food
        </CategoryButton>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            {error}
          </h2>
          <p className="text-red-600">
            Please try refreshing the page or contact support if the problem persists.
          </p>
        </div>
      ) : (
        <ProductList products={products} loading={loading} />
      )}
    </div>
  );
}

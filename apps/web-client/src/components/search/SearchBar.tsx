'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { productApi } from '@/lib/api';
import { Product, PetCategory } from '@/types/product';
import { MagnifyingGlassIcon as MagnifyingGlassIconOutline } from '@heroicons/react/24/outline';
import { XMarkIcon as XMarkIconSolid, ChevronDownIcon as ChevronDownIconSolid } from '@heroicons/react/24/solid';

// Available categories for filtering matching PetCategory enum
const CATEGORIES = [
  { id: '', name: 'All Categories' },
  { id: PetCategory.DOG, name: 'Dog Food' },
  { id: PetCategory.CAT, name: 'Cat Food' },
];

const SearchBar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(searchParams?.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams?.get('category') || '');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<boolean>(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
      
      if (
        categoryDropdownRef.current && 
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim().length === 0) return;
    
    setIsLoading(true);
    
    try {
      const data = await productApi.searchProducts(
        searchQuery,
        selectedCategory ? selectedCategory as PetCategory : undefined
      );
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Construct the search URL with query parameters
      const params = new URLSearchParams();
      params.append('q', searchQuery);
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      
      router.push(`/products?${params.toString()}`);
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    searchInputRef.current?.focus();
  };

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategoryDropdown(false);
  };

  const selectedCategoryName = CATEGORIES.find(cat => cat.id === selectedCategory)?.name || 'All Categories';

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex items-center">
        {/* Category Filter Button */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center h-10 px-3 text-sm bg-gray-100 border border-r-0 border-gray-300 rounded-l-md whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <span className="max-w-[120px] truncate">{selectedCategoryName}</span>
            <ChevronDownIconSolid className="w-4 h-4 ml-1" />
          </button>
          
          {/* Category Dropdown */}
          {showCategoryDropdown && (
            <div 
              ref={categoryDropdownRef}
              className="absolute z-50 w-48 mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
            >
              <ul className="py-1">
                {CATEGORIES.map((category) => (
                  <li 
                    key={category.id} 
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                      selectedCategory === category.id ? 'bg-emerald-50 text-emerald-800' : ''
                    }`}
                    onClick={() => selectCategory(category.id)}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full h-10 pl-4 pr-10 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIconSolid className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
          >
            <MagnifyingGlassIconOutline className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-auto"
        >
          <ul className="py-1">
            {searchResults.map((product) => (
              <li
                key={product.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  router.push(`/products/${product.id}`);
                  setShowResults(false);
                }}
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchBar;


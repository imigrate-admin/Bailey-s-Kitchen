'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { productService } from '@/services/product.service';
import { Product } from '@/types/product';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

// Available categories for filtering
const CATEGORIES = [
  { id: '', name: 'All Categories' },
  { id: 'breakfast', name: 'Breakfast' },
  { id: 'lunch', name: 'Lunch' },
  { id: 'dinner', name: 'Dinner' },
  { id: 'snacks', name: 'Snacks' },
  { id: 'desserts', name: 'Desserts' },
];

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<boolean>(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
      // Use the product service to search products
      // searchProducts expects (query, page, limit) parameters
      const response = await productService.searchProducts(
        selectedCategory ? `${searchQuery} category:${selectedCategory}` : searchQuery
      );
      
      if (response && response.data) {
        setSearchResults(response.data);
        setShowResults(true);
      }
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
      const queryParams = new URLSearchParams();
      queryParams.append('q', searchQuery);
      
      if (selectedCategory) {
        queryParams.append('category', selectedCategory);
      }
      
      router.push(`/products?${queryParams.toString()}`);
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
            <ChevronDownIcon className="w-4 h-4 ml-1" />
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
        <div className="relative flex-grow">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim().length > 2 && setShowResults(true)}
            placeholder="Search for products..."
            className="w-full h-10 pl-10 pr-10 text-sm border border-gray-300 rounded-md sm:rounded-l-none sm:rounded-r-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </div>
          
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-10 flex items-center pr-3"
            >
              <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
          
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-white rounded-r-md bg-emerald-600 hover:bg-emerald-700"
          >
            <span className="sr-only">Search</span>
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
      
      {/* Search Results Dropdown */}
      {showResults && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto"
        >
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="w-5 h-5 border-t-2 border-b-2 border-emerald-600 rounded-full animate-spin"></div>
              <span className="ml-2 text-sm text-gray-600">Searching...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <ul className="py-1">
              {searchResults.map((product) => (
                <li key={product.id}>
                  <Link 
                    href={`/products/${product.id}`}
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                    onClick={() => setShowResults(false)}
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-md mr-3 overflow-hidden">
                      {product.imageUrl ? (
                        <Image 
                          src={product.imageUrl} 
                          alt={product.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                          <MagnifyingGlassIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-sm font-semibold text-emerald-700">
                      ${product.price.toFixed(2)}
                    </div>
                  </Link>
                </li>
              ))}
              <li className="border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50"
                >
                  See all results
                </button>
              </li>
            </ul>
          ) : searchQuery.trim().length > 2 ? (
            <div className="p-4 text-sm text-center text-gray-500">
              No products found. Try a different search term.
            </div>
          ) : (
            <div className="p-4 text-sm text-center text-gray-500">
              Type at least 3 characters to search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;


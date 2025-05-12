'use client';

import { PetCategory } from '@/types/product';

interface CategoryFilterProps {
  selectedCategory?: PetCategory | 'ALL';
  onCategoryChange: (category: PetCategory | 'ALL') => void;
}

export function CategoryFilter({ selectedCategory = 'ALL', onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-4 mb-8">
      <button
        onClick={() => onCategoryChange('ALL')}
        className={`px-4 py-2 rounded-full ${
          selectedCategory === 'ALL'
            ? 'bg-primary text-white'
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        All Products
      </button>
      <button
        onClick={() => onCategoryChange('DOG')}
        className={`px-4 py-2 rounded-full ${
          selectedCategory === 'DOG'
            ? 'bg-primary text-white'
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        Dog Food
      </button>
      <button
        onClick={() => onCategoryChange('CAT')}
        className={`px-4 py-2 rounded-full ${
          selectedCategory === 'CAT'
            ? 'bg-primary text-white'
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        Cat Food
      </button>
    </div>
  );
}


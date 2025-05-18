export enum PetCategory {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  FISH = 'FISH',
  SMALL_ANIMAL = 'SMALL_ANIMAL'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: PetCategory;
  image?: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  _hasInvalidId?: boolean;
}

export interface ProductFilters {
  category?: PetCategory;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

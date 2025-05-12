export type PetCategory = 'DOG' | 'CAT';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: PetCategory;
  imageUrl?: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}


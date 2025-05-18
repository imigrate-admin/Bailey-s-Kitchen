'use client';

import { Card } from '@/components/ui/card';
import { Product } from '@/types/product';
import { getCategoryImage, formatImageUrl } from '@/utils/product-images';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Create microdata attributes for better SEO
  const productSchemaProps = {
    itemScope: true,
    itemType: 'https://schema.org/Product',
  };

  const availability = product.stock > 0 
    ? 'https://schema.org/InStock' 
    : 'https://schema.org/OutOfStock';

  // Ensure price is a valid number
  const price = typeof product.price === 'number' ? product.price : 0;

  // Get the appropriate image based on product category or custom image
  const productImage = product.image 
    ? formatImageUrl(product.image)
    : getCategoryImage(product.category);

  return (
    <Card variant="interactive" className="h-full" {...productSchemaProps}>
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square">
          <Image
            src={productImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <Card.Body className="p-4">
          <Card.Title 
            className="text-lg font-semibold line-clamp-1"
            itemProp="name"
          >
            {product.name}
          </Card.Title>
          <Card.Description 
            className="text-sm text-gray-500 mt-1 line-clamp-2"
            itemProp="description"
          >
            {product.description}
          </Card.Description>
          <div className="mt-4 flex items-center justify-between">
            <span 
              className="text-lg font-bold"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <meta itemProp="priceCurrency" content="USD" />
              <span itemProp="price" content={price.toString()}>
                ${price.toFixed(2)}
              </span>
              <meta itemProp="availability" content={availability} />
            </span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {product.category}
            </span>
          </div>
          {product.stock <= 0 && (
            <div className="mt-2 text-sm text-red-500">Out of Stock</div>
          )}
          <meta itemProp="image" content={productImage} />
          <meta itemProp="sku" content={product.id} />
          <meta itemProp="brand" content="Bailey's Kitchen" />
        </Card.Body>
      </Link>
    </Card>
  );
}

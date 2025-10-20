'use client';

import { useSetAtom } from 'jotai';
import { addToCartAtom, addToastAtom } from '@/app/store/atoms';
import type { ProductListItem } from '@/app/types';

/**
 * AddToCartButton Component
 * 
 * Example usage of Jotai write-only atoms.
 * Shows how to:
 * - Add items to cart
 * - Display toast notifications
 * - Handle user interactions with global state
 */

interface AddToCartButtonProps {
  product: ProductListItem;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addToCart = useSetAtom(addToCartAtom);
  const addToast = useSetAtom(addToastAtom);
  
  const handleAddToCart = () => {
    // Add to cart
    addToCart({
      productId: product.slug, // Using slug as ID
      slug: product.slug,
      name: product.name,
      price: parseFloat(product.regularPrice || '0'),
      image: product.image?.sourceUrl,
    });
    
    // Show success notification
    addToast({
      message: `${product.name} added to cart!`,
      type: 'success',
      duration: 3000,
    });
  };
  
  return (
    <button
      onClick={handleAddToCart}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
    >
      Add to Cart
    </button>
  );
}


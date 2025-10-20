'use client';

import { useAtomValue } from 'jotai';
import { cartItemsAtom, cartCountAtom } from '@/app/store/atoms';

/**
 * SimpleCartDisplay Component
 * 
 * Minimal example showing the two core cart atoms:
 * 1. cartItemsAtom - array of product objects
 * 2. cartCountAtom - total item count
 */
export default function SimpleCartDisplay() {
  // 1. cartItems - Array of product objects
  const cartItems = useAtomValue(cartItemsAtom);
  
  // 2. totalItemCount - Number of items in cart
  const totalItemCount = useAtomValue(cartCountAtom);
  
  return (
    <div className="p-4 bg-gray-100 rounded">
      {/* Display item count */}
      <h3 className="font-bold mb-2">
        Cart: {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
      </h3>
      
      {/* Display cart items array */}
      <div className="space-y-2">
        {cartItems.map((product) => (
          <div key={product.productId} className="text-sm">
            {product.name} (×{product.quantity}) - ${product.price.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}


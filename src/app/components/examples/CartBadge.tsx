'use client';

import { useAtomValue } from 'jotai';
import { cartCountAtom } from '@/app/store/atoms';

/**
 * CartBadge Component
 * 
 * Example usage of Jotai atoms.
 * Displays the number of items in the cart.
 * Automatically updates when cart state changes.
 */
export default function CartBadge() {
  const cartCount = useAtomValue(cartCountAtom);
  
  if (cartCount === 0) {
    return null;
  }
  
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
      {cartCount}
    </span>
  );
}


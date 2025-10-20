'use client';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  cartItemsAtom,
  cartCountAtom,
  cartTotalAtom,
  addToCartAtom,
  removeFromCartAtom,
  updateQuantityAtom,
  clearCartAtom,
  type CartItem,
} from '@/app/store/atoms';

/**
 * useCart Hook
 * 
 * Custom hook that provides easy access to cart state and operations.
 * This is the primary interface for interacting with the shopping cart.
 * 
 * @returns Cart state and methods
 * 
 * @example
 * ```tsx
 * function ProductPage() {
 *   const { addItemToCart, cartCount, items } = useCart();
 *   
 *   const handleAddToCart = () => {
 *     addItemToCart({
 *       productId: product.slug,
 *       slug: product.slug,
 *       name: product.name,
 *       price: parseFloat(product.regularPrice || '0'),
 *       image: product.image?.sourceUrl,
 *     });
 *   };
 *   
 *   return <button onClick={handleAddToCart}>Add to Cart ({cartCount})</button>;
 * }
 * ```
 */
export function useCart() {
  // Read cart state
  const items = useAtomValue(cartItemsAtom);
  const cartCount = useAtomValue(cartCountAtom);
  const cartTotal = useAtomValue(cartTotalAtom);
  
  // Write actions
  const addToCart = useSetAtom(addToCartAtom);
  const removeFromCart = useSetAtom(removeFromCartAtom);
  const updateQuantity = useSetAtom(updateQuantityAtom);
  const clearCart = useSetAtom(clearCartAtom);

  /**
   * Add an item to the cart
   * If item already exists, increments quantity
   * If item is new, adds with quantity 1
   */
  const addItemToCart = (item: Omit<CartItem, 'quantity'>) => {
    addToCart(item);
  };

  /**
   * Remove an item from the cart by productId
   */
  const removeItemFromCart = (productId: string) => {
    removeFromCart(productId);
  };

  /**
   * Update the quantity of a cart item
   * If quantity is 0 or less, removes the item
   */
  const updateItemQuantity = (productId: string, quantity: number) => {
    updateQuantity({ productId, quantity });
  };

  /**
   * Clear all items from the cart
   */
  const clearAllItems = () => {
    clearCart();
  };

  /**
   * Check if a product is in the cart
   */
  const isInCart = (productId: string): boolean => {
    return items.some((item) => item.productId === productId);
  };

  /**
   * Get a specific item from the cart
   */
  const getCartItem = (productId: string): CartItem | undefined => {
    return items.find((item) => item.productId === productId);
  };

  /**
   * Get the quantity of a specific item in the cart
   */
  const getItemQuantity = (productId: string): number => {
    const item = items.find((item) => item.productId === productId);
    return item?.quantity || 0;
  };

  return {
    // State
    items,
    cartCount,
    cartTotal,
    isEmpty: items.length === 0,
    
    // Actions
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearAllItems,
    
    // Utility methods
    isInCart,
    getCartItem,
    getItemQuantity,
  };
}

export default useCart;


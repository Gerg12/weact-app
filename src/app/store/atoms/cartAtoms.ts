import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

/**
 * Cart State Atoms
 * 
 * These atoms manage shopping cart state across the application.
 * Using atomWithStorage persists cart data to localStorage.
 */

// Define cart item type
export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

// Cart items atom - persisted to localStorage
export const cartItemsAtom = atomWithStorage<CartItem[]>('cart-items', []);

// Derived atom: total number of items in cart
export const cartCountAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((total, item) => total + item.quantity, 0);
});

// Derived atom: cart total price
export const cartTotalAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
});

// Write-only atom: add item to cart
export const addToCartAtom = atom(
  null,
  (get, set, newItem: Omit<CartItem, 'quantity'>) => {
    const currentItems = get(cartItemsAtom);
    const existingItemIndex = currentItems.findIndex(
      (item) => item.productId === newItem.productId
    );

    if (existingItemIndex >= 0) {
      // Item already in cart, increase quantity
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += 1;
      set(cartItemsAtom, updatedItems);
    } else {
      // New item, add to cart
      set(cartItemsAtom, [...currentItems, { ...newItem, quantity: 1 }]);
    }
  }
);

// Write-only atom: remove item from cart
export const removeFromCartAtom = atom(
  null,
  (get, set, productId: string) => {
    const currentItems = get(cartItemsAtom);
    set(
      cartItemsAtom,
      currentItems.filter((item) => item.productId !== productId)
    );
  }
);

// Write-only atom: update item quantity
export const updateQuantityAtom = atom(
  null,
  (get, set, { productId, quantity }: { productId: string; quantity: number }) => {
    const currentItems = get(cartItemsAtom);
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      set(removeFromCartAtom, productId);
    } else {
      const updatedItems = currentItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      set(cartItemsAtom, updatedItems);
    }
  }
);

// Write-only atom: clear cart
export const clearCartAtom = atom(null, (get, set) => {
  set(cartItemsAtom, []);
});


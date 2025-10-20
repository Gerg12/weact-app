import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

/**
 * Wishlist State Atoms
 * 
 * Manages user's wishlist/favorites across the application.
 * Persisted to localStorage for convenience.
 */

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  price?: number;
  image?: string | null;
  addedAt: string; // ISO date string
}

// Wishlist items atom - persisted to localStorage
export const wishlistItemsAtom = atomWithStorage<WishlistItem[]>('wishlist-items', []);

// Derived atom: wishlist count
export const wishlistCountAtom = atom((get) => {
  return get(wishlistItemsAtom).length;
});

// Derived atom: check if product is in wishlist
export const isInWishlistAtom = atom(
  (get) => (productId: string) => {
    const items = get(wishlistItemsAtom);
    return items.some((item) => item.productId === productId);
  }
);

// Write-only atom: toggle wishlist item
export const toggleWishlistAtom = atom(
  null,
  (get, set, item: Omit<WishlistItem, 'addedAt'>) => {
    const currentItems = get(wishlistItemsAtom);
    const existingItemIndex = currentItems.findIndex(
      (i) => i.productId === item.productId
    );

    if (existingItemIndex >= 0) {
      // Remove from wishlist
      set(
        wishlistItemsAtom,
        currentItems.filter((i) => i.productId !== item.productId)
      );
    } else {
      // Add to wishlist
      set(wishlistItemsAtom, [
        ...currentItems,
        { ...item, addedAt: new Date().toISOString() },
      ]);
    }
  }
);

// Write-only atom: remove from wishlist
export const removeFromWishlistAtom = atom(
  null,
  (get, set, productId: string) => {
    const currentItems = get(wishlistItemsAtom);
    set(
      wishlistItemsAtom,
      currentItems.filter((item) => item.productId !== productId)
    );
  }
);

// Write-only atom: clear wishlist
export const clearWishlistAtom = atom(null, (get, set) => {
  set(wishlistItemsAtom, []);
});


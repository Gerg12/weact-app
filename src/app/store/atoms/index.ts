/**
 * Central export point for all Jotai atoms
 * 
 * Import atoms from this file throughout your app:
 * import { cartItemsAtom, addToCartAtom } from '@/store/atoms';
 */

// Cart atoms
export {
  cartItemsAtom,
  cartCountAtom,
  cartTotalAtom,
  addToCartAtom,
  removeFromCartAtom,
  updateQuantityAtom,
  clearCartAtom,
  type CartItem,
} from './cartAtoms';

// Wishlist atoms
export {
  wishlistItemsAtom,
  wishlistCountAtom,
  isInWishlistAtom,
  toggleWishlistAtom,
  removeFromWishlistAtom,
  clearWishlistAtom,
  type WishlistItem,
} from './wishlistAtoms';

// UI atoms
export {
  isCartOpenAtom,
  isMobileMenuOpenAtom,
  isSearchOpenAtom,
  isLoadingAtom,
  toastsAtom,
  addToastAtom,
  removeToastAtom,
  productFiltersAtom,
  type Toast,
  type ProductFilters,
} from './uiAtoms';


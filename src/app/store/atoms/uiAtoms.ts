import { atom } from 'jotai';

/**
 * UI State Atoms
 * 
 * Manages UI-related state like modals, sidebars, loading states, etc.
 * These are session-only (not persisted).
 */

// Cart sidebar visibility
export const isCartOpenAtom = atom(false);

// Mobile menu visibility
export const isMobileMenuOpenAtom = atom(false);

// Search modal visibility
export const isSearchOpenAtom = atom(false);

// Global loading state
export const isLoadingAtom = atom(false);

// Toast/notification state
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export const toastsAtom = atom<Toast[]>([]);

// Write-only atom: add toast
export const addToastAtom = atom(
  null,
  (get, set, toast: Omit<Toast, 'id'>) => {
    const newToast: Toast = {
      ...toast,
      id: `toast-${Date.now()}-${Math.random()}`,
      duration: toast.duration || 3000,
    };
    set(toastsAtom, [...get(toastsAtom), newToast]);

    // Auto-remove after duration
    if (newToast.duration) {
      setTimeout(() => {
        set(removeToastAtom, newToast.id);
      }, newToast.duration);
    }
  }
);

// Write-only atom: remove toast
export const removeToastAtom = atom(null, (get, set, toastId: string) => {
  set(
    toastsAtom,
    get(toastsAtom).filter((t) => t.id !== toastId)
  );
});

// Product filters state (for product listing page)
export interface ProductFilters {
  searchQuery: string;
  priceRange: [number, number] | null;
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'newest';
}

export const productFiltersAtom = atom<ProductFilters>({
  searchQuery: '',
  priceRange: null,
  sortBy: 'newest',
});


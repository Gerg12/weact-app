# State Management with Jotai

This directory contains all Jotai atoms for global state management in the application.

## 📁 Directory Structure

```
store/
├── atoms/
│   ├── index.ts          # Central export point
│   ├── cartAtoms.ts      # Shopping cart state
│   ├── wishlistAtoms.ts  # Wishlist/favorites state
│   └── uiAtoms.ts        # UI state (modals, toasts, etc.)
└── README.md             # This file
```

## 🚀 Quick Start

### Installation

```bash
npm install jotai
```

### Basic Usage

```tsx
'use client';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { cartItemsAtom, cartCountAtom, addToCartAtom } from '@/store/atoms';

function ProductCard({ product }) {
  // Read and write
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  
  // Read-only (better performance)
  const cartCount = useAtomValue(cartCountAtom);
  
  // Write-only (best for actions)
  const addToCart = useSetAtom(addToCartAtom);
  
  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: parseFloat(product.regularPrice || '0'),
      image: product.image?.sourceUrl,
    });
  };
  
  return (
    <button onClick={handleAddToCart}>
      Add to Cart ({cartCount})
    </button>
  );
}
```

## 📚 Available Atoms

### Cart Atoms (`cartAtoms.ts`)

#### Read Atoms
- `cartItemsAtom` - Array of cart items (persisted to localStorage)
- `cartCountAtom` - Total number of items in cart (derived)
- `cartTotalAtom` - Total price of all items (derived)

#### Write Atoms
- `addToCartAtom` - Add item to cart
- `removeFromCartAtom` - Remove item from cart
- `updateQuantityAtom` - Update item quantity
- `clearCartAtom` - Clear entire cart

**Example:**
```tsx
'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { cartCountAtom, addToCartAtom } from '@/store/atoms';

export default function AddToCartButton({ product }) {
  const cartCount = useAtomValue(cartCountAtom);
  const addToCart = useSetAtom(addToCartAtom);
  
  return (
    <button onClick={() => addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: parseFloat(product.regularPrice || '0'),
    })}>
      Add to Cart ({cartCount} items)
    </button>
  );
}
```

### Wishlist Atoms (`wishlistAtoms.ts`)

#### Read Atoms
- `wishlistItemsAtom` - Array of wishlist items (persisted)
- `wishlistCountAtom` - Total number of wishlist items
- `isInWishlistAtom` - Function to check if product is in wishlist

#### Write Atoms
- `toggleWishlistAtom` - Add/remove item from wishlist
- `removeFromWishlistAtom` - Remove specific item
- `clearWishlistAtom` - Clear entire wishlist

**Example:**
```tsx
'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { isInWishlistAtom, toggleWishlistAtom } from '@/store/atoms';

export default function WishlistButton({ product }) {
  const isInWishlist = useAtomValue(isInWishlistAtom);
  const toggleWishlist = useSetAtom(toggleWishlistAtom);
  
  const inList = isInWishlist(product.id);
  
  return (
    <button onClick={() => toggleWishlist({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: parseFloat(product.regularPrice || '0'),
      image: product.image?.sourceUrl,
    })}>
      {inList ? '❤️' : '🤍'} {inList ? 'In Wishlist' : 'Add to Wishlist'}
    </button>
  );
}
```

### UI Atoms (`uiAtoms.ts`)

#### Modal/Sidebar State
- `isCartOpenAtom` - Cart sidebar visibility
- `isMobileMenuOpenAtom` - Mobile menu visibility
- `isSearchOpenAtom` - Search modal visibility
- `isLoadingAtom` - Global loading state

#### Toast Notifications
- `toastsAtom` - Array of active toasts
- `addToastAtom` - Show a toast notification
- `removeToastAtom` - Dismiss a toast

**Example:**
```tsx
'use client';

import { useSetAtom } from 'jotai';
import { addToastAtom, isCartOpenAtom } from '@/store/atoms';

export default function AddToCartButton() {
  const addToast = useSetAtom(addToastAtom);
  const setCartOpen = useSetAtom(isCartOpenAtom);
  
  const handleClick = () => {
    // Show success toast
    addToast({
      message: 'Product added to cart!',
      type: 'success',
      duration: 3000,
    });
    
    // Open cart sidebar
    setCartOpen(true);
  };
  
  return <button onClick={handleClick}>Add to Cart</button>;
}
```

#### Product Filters
- `productFiltersAtom` - Search, price range, and sort options

**Example:**
```tsx
'use client';

import { useAtom } from 'jotai';
import { productFiltersAtom } from '@/store/atoms';

export default function ProductFilters() {
  const [filters, setFilters] = useAtom(productFiltersAtom);
  
  return (
    <input
      type="text"
      value={filters.searchQuery}
      onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
      placeholder="Search products..."
    />
  );
}
```

## 🎯 Best Practices

### 1. Use the Right Hook

```tsx
// ❌ Avoid - causes unnecessary re-renders
const [count, setCount] = useAtom(cartCountAtom);

// ✅ Better - only re-renders when value changes
const count = useAtomValue(cartCountAtom);

// ✅ Best - no re-renders, just the setter function
const setCount = useSetAtom(someWriteAtom);
```

### 2. Client Components Only

Atoms can only be used in Client Components:

```tsx
'use client'; // ← Required!

import { useAtomValue } from 'jotai';
import { cartCountAtom } from '@/store/atoms';

export default function CartBadge() {
  const count = useAtomValue(cartCountAtom);
  return <span>{count}</span>;
}
```

### 3. Persist Important Data

Use `atomWithStorage` for data that should survive page refreshes:

```tsx
import { atomWithStorage } from 'jotai/utils';

// ✅ Cart persists across sessions
export const cartItemsAtom = atomWithStorage('cart-items', []);

// ❌ UI state doesn't need persistence
export const isModalOpenAtom = atom(false);
```

### 4. Derive State When Possible

Create derived atoms instead of duplicating state:

```tsx
// ✅ Good - derived from cart items
export const cartCountAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((total, item) => total + item.quantity, 0);
});

// ❌ Bad - separate state that could get out of sync
export const cartCountAtom = atom(0);
```

## 🔄 Common Patterns

### Pattern 1: Shopping Cart

```tsx
'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { 
  cartItemsAtom, 
  cartTotalAtom, 
  removeFromCartAtom,
  updateQuantityAtom 
} from '@/store/atoms';

export default function CartSidebar() {
  const items = useAtomValue(cartItemsAtom);
  const total = useAtomValue(cartTotalAtom);
  const removeItem = useSetAtom(removeFromCartAtom);
  const updateQuantity = useSetAtom(updateQuantityAtom);
  
  return (
    <div>
      <h2>Cart ({items.length} items)</h2>
      {items.map((item) => (
        <div key={item.productId}>
          <h3>{item.name}</h3>
          <input 
            type="number" 
            value={item.quantity}
            onChange={(e) => updateQuantity({
              productId: item.productId,
              quantity: parseInt(e.target.value)
            })}
          />
          <button onClick={() => removeItem(item.productId)}>Remove</button>
        </div>
      ))}
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}
```

### Pattern 2: Toast Notifications

```tsx
'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { toastsAtom, removeToastAtom } from '@/store/atoms';

export default function ToastContainer() {
  const toasts = useAtomValue(toastsAtom);
  const removeToast = useSetAtom(removeToastAtom);
  
  return (
    <div className="fixed top-4 right-4 space-y-2">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className={`p-4 rounded shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`}
        >
          {toast.message}
          <button onClick={() => removeToast(toast.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}
```

### Pattern 3: Modal State

```tsx
'use client';

import { useAtom } from 'jotai';
import { isCartOpenAtom } from '@/store/atoms';

export default function CartModal() {
  const [isOpen, setIsOpen] = useAtom(isCartOpenAtom);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal">
      <button onClick={() => setIsOpen(false)}>Close</button>
      {/* Cart contents */}
    </div>
  );
}
```

## 🧪 Testing

Atoms are easy to test:

```tsx
import { renderHook, act } from '@testing-library/react';
import { useAtom } from 'jotai';
import { cartItemsAtom, addToCartAtom } from './cartAtoms';

test('add to cart', () => {
  const { result } = renderHook(() => ({
    items: useAtom(cartItemsAtom),
    add: useSetAtom(addToCartAtom),
  }));
  
  act(() => {
    result.current.add({
      productId: '1',
      slug: 'test',
      name: 'Test Product',
      price: 10,
    });
  });
  
  expect(result.current.items[0]).toHaveLength(1);
});
```

## 📖 Resources

- [Jotai Documentation](https://jotai.org/)
- [Jotai with Next.js](https://jotai.org/docs/guides/nextjs)
- [Jotai Utils](https://jotai.org/docs/utilities/storage)


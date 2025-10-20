# Cart State Structure - Quick Reference

## 📦 Core Cart Atoms (Already Defined)

### 1. `cartItemsAtom` - Array of Product Objects

**Location:** `src/app/store/atoms/cartAtoms.ts` (line 22)

```typescript
export const cartItemsAtom = atomWithStorage<CartItem[]>('cart-items', []);
```

**Type Definition:**
```typescript
interface CartItem {
  productId: string;      // Unique ID
  slug: string;           // URL slug
  name: string;           // Product name
  price: number;          // Price per item
  quantity: number;       // Quantity in cart
  image?: string | null;  // Optional image URL
}
```

**Usage:**
```typescript
import { useAtomValue } from 'jotai';
import { cartItemsAtom } from '@/store/atoms';

function MyComponent() {
  const cartItems = useAtomValue(cartItemsAtom);
  
  return <div>{cartItems.length} items</div>;
}
```

---

### 2. `cartCountAtom` - Total Item Count

**Location:** `src/app/store/atoms/cartAtoms.ts` (line 25)

```typescript
export const cartCountAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((total, item) => total + item.quantity, 0);
});
```

**Features:**
- Automatically calculated from `cartItemsAtom`
- Returns total quantity across all items
- Always in sync (derived state)

**Usage:**
```typescript
import { useAtomValue } from 'jotai';
import { cartCountAtom } from '@/store/atoms';

function CartBadge() {
  const totalItemCount = useAtomValue(cartCountAtom);
  
  return <span>Cart ({totalItemCount})</span>;
}
```

---

## 🎯 Complete Example

```typescript
'use client';

import { useAtomValue } from 'jotai';
import { cartItemsAtom, cartCountAtom } from '@/store/atoms';

export default function Cart() {
  // Get array of cart items
  const cartItems = useAtomValue(cartItemsAtom);
  
  // Get total item count
  const totalItemCount = useAtomValue(cartCountAtom);
  
  return (
    <div>
      <h2>Cart ({totalItemCount} items)</h2>
      
      {cartItems.map((item) => (
        <div key={item.productId}>
          <h3>{item.name}</h3>
          <p>Quantity: {item.quantity}</p>
          <p>Price: ${item.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔄 How They Work Together

```
┌─────────────────────────────────┐
│     cartItemsAtom (Source)      │
│                                 │
│  [                              │
│    { productId: "1", qty: 2 }, │
│    { productId: "2", qty: 1 }  │
│  ]                              │
└─────────────────────────────────┘
              ↓
    Automatically Derived
              ↓
┌─────────────────────────────────┐
│    cartCountAtom (Derived)      │
│                                 │
│            3                    │
│       (2 + 1 = 3)              │
└─────────────────────────────────┘
```

---

## 📝 State Management Flow

1. **User adds product** → `addToCartAtom` updates `cartItemsAtom`
2. **cartItemsAtom changes** → Triggers re-render in components watching it
3. **cartCountAtom automatically updates** → Because it derives from `cartItemsAtom`
4. **Components using cartCountAtom re-render** → Showing new count
5. **State persists to localStorage** → Survives page refresh

---

## ✅ What You Have

| Requirement | Status | Location |
|------------|--------|----------|
| cartItems (array of products) | ✅ Created | `cartItemsAtom` in `cartAtoms.ts:22` |
| totalItemCount | ✅ Created | `cartCountAtom` in `cartAtoms.ts:25` |
| localStorage persistence | ✅ Included | Uses `atomWithStorage` |
| Add to cart function | ✅ Created | `addToCartAtom` in `cartAtoms.ts:37` |
| Remove from cart | ✅ Created | `removeFromCartAtom` in `cartAtoms.ts:58` |
| Update quantity | ✅ Created | `updateQuantityAtom` in `cartAtoms.ts:70` |
| Clear cart | ✅ Created | `clearCartAtom` in `cartAtoms.ts:88` |
| Total price | ✅ Bonus | `cartTotalAtom` in `cartAtoms.ts:31` |

---

## 🚀 Next Steps

1. **Install Jotai** (if not already):
   ```bash
   npm install jotai
   ```

2. **Import and use in your components**:
   ```typescript
   import { useAtomValue, useSetAtom } from 'jotai';
   import { cartItemsAtom, cartCountAtom, addToCartAtom } from '@/store/atoms';
   ```

3. **See working examples**:
   - `src/app/components/examples/SimpleCartDisplay.tsx`
   - `src/app/components/examples/CartExample.tsx`
   - `src/app/components/examples/AddToCartButton.tsx`

---

## 📚 Full Documentation

For complete documentation, see: `src/app/store/README.md`


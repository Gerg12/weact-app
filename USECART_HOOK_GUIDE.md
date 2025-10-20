# useCart Hook - Implementation Guide

## ✅ What's Been Implemented

The custom `useCart` hook has been fully implemented with cart functionality integrated throughout the application.

---

## 📁 Files Created/Modified

### New Files:
1. **`src/app/hooks/useCart.ts`** - Custom hook for cart operations
2. **`src/app/products/[slug]/AddToCartSection.tsx`** - Add to cart UI component

### Modified Files:
1. **`src/app/components/Header.tsx`** - Added cart badge with live count
2. **`src/app/products/[slug]/page.tsx`** - Integrated AddToCartSection

---

## 🎯 useCart Hook API

### Location
```typescript
import useCart from '@/hooks/useCart';
```

### Full API Reference

```typescript
const {
  // STATE - Read cart data
  items,           // CartItem[] - All items in cart
  cartCount,       // number - Total quantity of all items
  cartTotal,       // number - Total price of all items
  isEmpty,         // boolean - True if cart is empty
  
  // ACTIONS - Modify cart
  addItemToCart,         // Add item (increments if exists)
  removeItemFromCart,    // Remove item by productId
  updateItemQuantity,    // Update quantity of an item
  clearAllItems,         // Clear entire cart
  
  // UTILITIES - Query cart state
  isInCart,              // Check if product is in cart
  getCartItem,           // Get specific cart item
  getItemQuantity,       // Get quantity of specific item
} = useCart();
```

---

## 📝 Detailed Method Documentation

### `addItemToCart(item)`

Add a product to the cart. If already in cart, increments quantity.

```typescript
addItemToCart({
  productId: string,      // Unique identifier
  slug: string,           // Product URL slug
  name: string,           // Product name
  price: number,          // Price per unit
  image?: string | null,  // Optional image URL
});
```

**Example:**
```typescript
const { addItemToCart } = useCart();

const handleClick = () => {
  addItemToCart({
    productId: product.slug,
    slug: product.slug,
    name: product.name,
    price: parseFloat(product.regularPrice || '0'),
    image: product.image?.sourceUrl,
  });
};
```

### `removeItemFromCart(productId)`

Remove an item completely from the cart.

```typescript
const { removeItemFromCart } = useCart();

removeItemFromCart('product-slug');
```

### `updateItemQuantity(productId, quantity)`

Update the quantity of an item. If quantity ≤ 0, removes the item.

```typescript
const { updateItemQuantity } = useCart();

// Increase quantity
updateItemQuantity('product-slug', 5);

// Remove by setting to 0
updateItemQuantity('product-slug', 0);
```

### `clearAllItems()`

Remove all items from the cart.

```typescript
const { clearAllItems } = useCart();

clearAllItems();
```

### `isInCart(productId)`

Check if a product is in the cart.

```typescript
const { isInCart } = useCart();

if (isInCart('product-slug')) {
  console.log('Product is in cart');
}
```

### `getCartItem(productId)`

Get the full cart item object for a specific product.

```typescript
const { getCartItem } = useCart();

const item = getCartItem('product-slug');
// Returns: CartItem | undefined
```

### `getItemQuantity(productId)`

Get the quantity of a specific item in the cart.

```typescript
const { getItemQuantity } = useCart();

const qty = getItemQuantity('product-slug');
// Returns: number (0 if not in cart)
```

---

## 🛠️ Implementation Examples

### Example 1: Product Detail Page (Implemented)

**File:** `src/app/products/[slug]/AddToCartSection.tsx`

```typescript
'use client';

import useCart from '@/hooks/useCart';

export default function AddToCartSection({ product }) {
  const { addItemToCart, getItemQuantity, cartCount } = useCart();
  
  const handleAddToCart = () => {
    addItemToCart({
      productId: product.slug,
      slug: product.slug,
      name: product.name,
      price: parseFloat(product.regularPrice || '0'),
      image: product.image?.sourceUrl,
    });
  };
  
  const currentQty = getItemQuantity(product.slug);
  
  return (
    <div>
      <button onClick={handleAddToCart}>
        Add to Cart
      </button>
      {currentQty > 0 && (
        <p>Currently in cart: {currentQty}</p>
      )}
    </div>
  );
}
```

### Example 2: Cart Badge in Header (Implemented)

**File:** `src/app/components/Header.tsx`

```typescript
'use client';

import useCart from '@/hooks/useCart';

export default function Header() {
  const { cartCount } = useCart();
  
  return (
    <header>
      <nav>
        <a href="/cart">
          Cart
          {cartCount > 0 && (
            <span className="badge">{cartCount}</span>
          )}
        </a>
      </nav>
    </header>
  );
}
```

### Example 3: Cart Summary

```typescript
'use client';

import useCart from '@/hooks/useCart';

export default function CartSummary() {
  const { items, cartCount, cartTotal, isEmpty } = useCart();
  
  if (isEmpty) {
    return <p>Your cart is empty</p>;
  }
  
  return (
    <div>
      <h2>Cart Summary</h2>
      <p>{cartCount} items</p>
      <p>Total: ${cartTotal.toFixed(2)}</p>
      
      <ul>
        {items.map(item => (
          <li key={item.productId}>
            {item.name} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Example 4: Cart Item with Actions

```typescript
'use client';

import useCart from '@/hooks/useCart';

export default function CartItem({ productId }) {
  const { 
    getCartItem, 
    updateItemQuantity, 
    removeItemFromCart 
  } = useCart();
  
  const item = getCartItem(productId);
  
  if (!item) return null;
  
  return (
    <div>
      <h3>{item.name}</h3>
      <p>${item.price}</p>
      
      {/* Quantity Controls */}
      <button onClick={() => updateItemQuantity(productId, item.quantity - 1)}>
        −
      </button>
      <span>{item.quantity}</span>
      <button onClick={() => updateItemQuantity(productId, item.quantity + 1)}>
        +
      </button>
      
      {/* Remove Button */}
      <button onClick={() => removeItemFromCart(productId)}>
        Remove
      </button>
    </div>
  );
}
```

### Example 5: Quick Add Button

```typescript
'use client';

import useCart from '@/hooks/useCart';

export default function QuickAddButton({ product }) {
  const { addItemToCart, isInCart } = useCart();
  
  const inCart = isInCart(product.slug);
  
  return (
    <button 
      onClick={() => addItemToCart({
        productId: product.slug,
        slug: product.slug,
        name: product.name,
        price: parseFloat(product.regularPrice || '0'),
        image: product.image?.sourceUrl,
      })}
      disabled={inCart}
    >
      {inCart ? 'In Cart ✓' : 'Add to Cart'}
    </button>
  );
}
```

---

## 🎨 Visual Features Implemented

### 1. Add to Cart Section (PDP)
- ✅ Quantity selector with +/- buttons
- ✅ Add to cart button
- ✅ Success feedback with animation
- ✅ Shows current quantity in cart
- ✅ Price calculation based on quantity
- ✅ Sticky positioning for easy access

### 2. Header Cart Badge
- ✅ Cart icon with count badge
- ✅ Auto-updates when items added
- ✅ Shows "99+" for counts over 99
- ✅ Hidden when cart is empty
- ✅ Accessibility label

---

## 🔄 How It Works

```
User clicks "Add to Cart"
         ↓
AddToCartSection calls addItemToCart()
         ↓
useCart hook updates cartItemsAtom
         ↓
Jotai automatically notifies all subscribers
         ↓
Header re-renders with new count
Cart summary updates
Success message appears
         ↓
State persists to localStorage
```

---

## 💾 Data Persistence

Cart data is **automatically saved to localStorage** and will:
- ✅ Survive page refreshes
- ✅ Persist across browser sessions
- ✅ Sync across all tabs
- ✅ Clear when user clears browser data

**Storage Key:** `cart-items`

---

## ✅ What's Working

| Feature | Status | Location |
|---------|--------|----------|
| useCart Hook | ✅ | `src/app/hooks/useCart.ts` |
| Add to Cart on PDP | ✅ | `src/app/products/[slug]/AddToCartSection.tsx` |
| Cart Count Badge | ✅ | `src/app/components/Header.tsx` |
| Visual Feedback | ✅ | Success animation on add |
| Quantity Selector | ✅ | +/- buttons on PDP |
| Current Quantity Display | ✅ | Shows items in cart |
| Price Calculation | ✅ | Subtotal on PDP |
| localStorage Persistence | ✅ | Automatic |
| TypeScript Types | ✅ | Fully typed |

---

## 🚀 Next Steps

You can now:

1. **Create a cart page** to display all items
2. **Add cart sidebar** for quick view
3. **Implement checkout flow**
4. **Add product list "Add to Cart" buttons**
5. **Create cart notifications/toasts**

---

## 🧪 Testing the Implementation

### Manual Testing Steps:

1. **Navigate to a product detail page**
   - URL: `/products/[any-product-slug]`

2. **Click "Add to Cart"**
   - ✅ Success message should appear
   - ✅ Header cart badge should update
   - ✅ Quantity in cart should show

3. **Change quantity and add again**
   - ✅ Cart count should reflect total quantity

4. **Refresh the page**
   - ✅ Cart count should persist

5. **Open DevTools → Application → Local Storage**
   - ✅ Check `cart-items` key has your data

---

## 📚 Additional Resources

- **Full cart atoms documentation:** `src/app/store/README.md`
- **Cart state guide:** `CART_STATE_GUIDE.md`
- **Example components:** `src/app/components/examples/`

---

## 🎉 Summary

The `useCart` hook provides a clean, type-safe interface for all cart operations. It's been successfully implemented on the Product Detail Page with:

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Visual feedback on actions
- ✅ Real-time updates across the app
- ✅ Persistent storage
- ✅ No linting errors
- ✅ Production-ready code

Your cart functionality is now fully operational! 🛒


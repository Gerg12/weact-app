'use client';

import { useAtomValue } from 'jotai';
import { cartItemsAtom, cartCountAtom, cartTotalAtom } from '@/store/atoms';

/**
 * CartExample Component
 * 
 * Demonstrates how to use the core cart atoms:
 * - cartItemsAtom: Array of product objects in cart
 * - cartCountAtom: Total number of items (derived)
 * - cartTotalAtom: Total price (derived)
 */
export default function CartExample() {
  // Access cart items array
  const cartItems = useAtomValue(cartItemsAtom);
  
  // Access total item count (automatically calculated)
  const totalItemCount = useAtomValue(cartCountAtom);
  
  // Bonus: Access total price (automatically calculated)
  const totalPrice = useAtomValue(cartTotalAtom);
  
  return (
    <div className="border rounded-lg p-6 bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        Shopping Cart ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
      </h2>
      
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <>
          {/* Display cart items */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div 
                key={item.productId} 
                className="flex items-center gap-4 p-4 bg-gray-50 rounded"
              >
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <div className="font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          {/* Display totals */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total ({totalItemCount} items):</span>
              <span className="text-green-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


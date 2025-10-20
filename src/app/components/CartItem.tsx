'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/app/store/atoms';

/**
 * CartItem Component
 * 
 * Displays a single cart item with:
 * - Product image and details
 * - Quantity controls (increment/decrement)
 * - Remove button
 * - Price calculations
 * 
 * @param item - The cart item to display
 * @param onUpdateQuantity - Callback to update item quantity
 * @param onRemove - Callback to remove item from cart
 */
interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const itemTotal = item.price * item.quantity;

  const handleIncrement = () => {
    onUpdateQuantity(item.productId, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.quantity - 1);
    } else {
      // If quantity is 1, decrementing will remove the item
      onRemove(item.productId);
    }
  };

  const handleRemove = () => {
    onRemove(item.productId);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="flex-shrink-0 w-24 h-24 relative bg-gray-100 rounded-md overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-grow">
        <Link 
          href={`/products/${item.slug}`}
          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
        >
          {item.name}
        </Link>
        <p className="text-sm text-gray-600 mt-1">
          ${item.price.toFixed(2)} each
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={handleDecrement}
            className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-700 font-semibold"
            aria-label="Decrease quantity"
          >
            {item.quantity === 1 ? (
              // Show trash icon when quantity is 1
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            ) : (
              '-'
            )}
          </button>
          
          <span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">
            {item.quantity}
          </span>
          
          <button
            onClick={handleIncrement}
            className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-700 font-semibold"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Item Total & Remove */}
      <div className="flex flex-col items-end gap-2 min-w-[120px]">
        <p className="text-xl font-bold text-gray-900">
          ${itemTotal.toFixed(2)}
        </p>
        <button
          onClick={handleRemove}
          className="text-sm text-red-600 hover:text-red-800 hover:underline font-medium transition-colors"
          aria-label={`Remove ${item.name} from cart`}
        >
          Remove
        </button>
      </div>
    </div>
  );
}


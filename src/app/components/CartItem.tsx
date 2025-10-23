'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/app/store/atoms';

/**
 * CartItem Component
 * 
 * Accessible cart item display with full keyboard support
 * 
 * Accessibility Features:
 * - Semantic <button> elements for all actions
 * - Descriptive aria-labels for screen readers
 * - Focus-visible styles
 * - Clear visual feedback for actions
 * - Proper heading hierarchy
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
    <article 
      className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
      aria-labelledby={`cart-item-${item.productId}`}
    >
      {/* Product Image */}
      <div className="flex-shrink-0 w-24 h-24 relative bg-gray-100 rounded-md overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={`${item.name} product image`}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400" aria-label="No image available">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-grow">
        <h3 id={`cart-item-${item.productId}`} className="text-lg font-semibold text-gray-900 mb-1">
          <Link 
            href={`/products/${item.slug}`}
            className="hover:text-blue-600 focus:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-colors"
          >
            {item.name}
          </Link>
        </h3>
        <p className="text-sm text-gray-600">
          <span className="sr-only">Price per item: </span>
          ${item.price.toFixed(2)} each
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3">
        <div 
          className="flex items-center border border-gray-300 rounded-lg"
          role="group"
          aria-label="Quantity control"
        >
          <button
            type="button"
            onClick={handleDecrement}
            className="px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 transition-colors text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-l-lg"
            aria-label={item.quantity === 1 ? `Remove ${item.name} from cart` : `Decrease quantity of ${item.name}, current quantity is ${item.quantity}`}
          >
            {item.quantity === 1 ? (
              // Show trash icon when quantity is 1
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            ) : (
              '−'
            )}
          </button>
          
          <span 
            className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center bg-gray-50"
            aria-label={`Quantity: ${item.quantity}`}
            role="status"
          >
            {item.quantity}
          </span>
          
          <button
            type="button"
            onClick={handleIncrement}
            className="px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 transition-colors text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-r-lg"
            aria-label={`Increase quantity of ${item.name}, current quantity is ${item.quantity}`}
          >
            +
          </button>
        </div>
      </div>

      {/* Item Total & Remove */}
      <div className="flex flex-col items-end gap-2 min-w-[120px]">
        <p 
          className="text-xl font-bold text-gray-900"
          aria-label={`Item total: $${itemTotal.toFixed(2)}`}
        >
          ${itemTotal.toFixed(2)}
        </p>
        <button
          type="button"
          onClick={handleRemove}
          className="text-sm text-red-600 hover:text-red-800 focus:text-red-800 hover:underline focus:underline font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-1"
          aria-label={`Remove ${item.name} from cart`}
        >
          Remove
        </button>
      </div>
    </article>
  );
}


'use client';

import Link from 'next/link';
import useCart from '@/app/hooks/useCart';
import CartItem from '@/app/components/CartItem';

/**
 * Cart Page Component
 * 
 * Full shopping cart page displaying:
 * - All cart items with quantity controls
 * - Cart summary with subtotal, shipping, tax, and grand total
 * - Empty cart state
 * - Continue shopping and checkout actions
 */
export default function CartPage() {
  const { items, cartTotal, isEmpty, updateItemQuantity, removeItemFromCart, clearAllItems } = useCart();

  // Calculate summary values
  const subtotal = cartTotal;
  const shipping = subtotal > 0 ? 10.00 : 0; // $10 flat rate shipping (placeholder)
  const tax = subtotal * 0.08; // 8% tax (placeholder)
  const grandTotal = subtotal + shipping + tax;

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-50 rounded-lg p-12 border-2 border-gray-200">
            {/* Empty Cart Icon */}
            <svg 
              className="w-24 h-24 mx-auto text-gray-400 mb-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            
            <Link 
              href="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
        <Link 
          href="/products"
          className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
        >
          ← Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Cart Items ({items.length})
            </h2>
            <button
              onClick={clearAllItems}
              className="text-sm text-red-600 hover:text-red-800 hover:underline font-medium"
            >
              Clear Cart
            </button>
          </div>

          {/* Cart Items List */}
          <div className="space-y-4">
            {items.map((item) => {
              return (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={updateItemQuantity}
                  onRemove={removeItemFromCart}
                />
              );
            })}
          </div>
        </div>

        {/* Cart Summary Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            {/* Summary Details */}
            <div className="space-y-4 mb-6">
              {/* Subtotal */}
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span className="font-semibold">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <p className="text-xs text-gray-500 -mt-2">
                {shipping > 0 ? 'Flat rate shipping' : 'Free shipping on empty cart'}
              </p>

              {/* Tax */}
              <div className="flex justify-between text-gray-700">
                <span>Estimated Tax (8%):</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 -mt-2">
                Tax calculated at checkout
              </p>

              {/* Divider */}
              <div className="border-t border-gray-300 pt-4">
                {/* Grand Total */}
                <div className="flex justify-between text-gray-900">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl mb-3"
              onClick={() => alert('Checkout functionality coming soon!')}
            >
              Proceed to Checkout
            </button>

            {/* Additional Info */}
            <div className="text-center text-xs text-gray-500">
              <p>Secure checkout powered by Stripe</p>
            </div>

            {/* Promo Code Section (Optional) */}
            <div className="mt-6 pt-6 border-t border-gray-300">
              <h3 className="font-semibold text-gray-900 mb-3">Have a promo code?</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
                  Apply
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-gray-300 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free returns within 30 days
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Secure payment processing
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Fast shipping available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


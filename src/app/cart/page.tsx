'use client';

import { useState } from 'react';
import Link from 'next/link';
import useCart from '@/app/hooks/useCart';
import CartItem from '@/app/components/CartItem';
import type { CheckoutRequest, CheckoutResponse } from '@/app/types';

/**
 * Cart Page Component
 * 
 * Full shopping cart page displaying:
 * - All cart items with quantity controls
 * - Cart summary with subtotal, shipping, tax, and grand total
 * - Empty cart state
 * - Continue shopping and checkout actions
 * - Integrated checkout with payment API
 */
export default function CartPage() {
  const { items, cartTotal, isEmpty, updateItemQuantity, removeItemFromCart, clearAllItems } = useCart();

  // Checkout state management
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Calculate summary values
  const subtotal = cartTotal;
  const shipping = subtotal > 0 ? 10.00 : 0; // $10 flat rate shipping (placeholder)
  const tax = subtotal * 0.08; // 8% tax (placeholder)
  const grandTotal = subtotal + shipping + tax;

  /**
   * Handle Checkout Process
   * 
   * This function prepares cart data and sends it to the /api/checkout endpoint
   * along with a payment token (which would come from Stripe.js in production)
   */
  const handleCheckout = async () => {
    // Reset error state
    setCheckoutError(null);
    
    // Validate customer info
    if (!customerEmail || !customerName) {
      setCheckoutError('Please enter your email and name');
      setShowCustomerForm(true);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      setCheckoutError('Please enter a valid email address');
      return;
    }

    setIsProcessing(true);
    setCheckoutError(null);

    try {
      /**
       * PAYMENT TOKEN GENERATION (PLACEHOLDER)
       * 
       * In a production environment with Stripe.js, you would:
       * 
       * 1. Load Stripe.js on the client:
       *    const stripe = await loadStripe('pk_test_...');
       * 
       * 2. Create card element for user to enter card details:
       *    const cardElement = elements.create('card');
       *    cardElement.mount('#card-element');
       * 
       * 3. Create payment token when user submits:
       *    const { token, error } = await stripe.createToken(cardElement);
       * 
       * 4. Use token.id as paymentToken below
       * 
       * For now, we use a mock token for testing the API integration
       */
      const mockPaymentToken = `tok_mock_${Date.now()}`;
      
      // Prepare checkout request data
      const checkoutData: CheckoutRequest = {
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        tax,
        shipping,
        total: grandTotal,
        customer: {
          email: customerEmail,
          name: customerName,
        },
        paymentToken: mockPaymentToken, // In production: use real token from Stripe.js
      };

      console.log('Sending checkout request:', {
        itemCount: checkoutData.items.length,
        total: checkoutData.total,
        customer: checkoutData.customer.email,
      });

      // Send checkout request to API route
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      const result: CheckoutResponse = await response.json();

      if (result.success) {
        console.log('✅ Checkout successful!', result);
        setCheckoutSuccess(true);
        
        // Clear the cart after successful checkout
        setTimeout(() => {
          clearAllItems();
          setCustomerEmail('');
          setCustomerName('');
          setShowCustomerForm(false);
        }, 2000);
        
        // In production, redirect to order confirmation page:
        // router.push(`/order-confirmation/${result.orderId}`);
        
      } else {
        // Payment failed
        setCheckoutError(result.message || 'Payment failed. Please try again.');
        console.error('❌ Checkout failed:', result.error);
      }

    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError('Network error. Please check your connection and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Show customer info form
   */
  const initiateCheckout = () => {
    setShowCustomerForm(true);
    setCheckoutError(null);
  };

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

            {/* Customer Info Form */}
            {showCustomerForm && !checkoutSuccess && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isProcessing}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    💳 Demo Mode: No real payment will be charged. Click checkout to test the API integration.
                  </p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {checkoutSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold">Payment Successful!</span>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  Your order has been processed. Check the console for details.
                </p>
              </div>
            )}

            {/* Error Message */}
            {checkoutError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Error</span>
                </div>
                <p className="text-sm text-red-700 mt-2">{checkoutError}</p>
              </div>
            )}

            {/* Checkout Button */}
            {!showCustomerForm && !checkoutSuccess ? (
              <button
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl mb-3"
                onClick={initiateCheckout}
                disabled={isProcessing}
              >
                Proceed to Checkout
              </button>
            ) : !checkoutSuccess ? (
              <button
                className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl mb-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Complete Checkout (Demo)'
                )}
              </button>
            ) : null}

            {/* Additional Info */}
            <div className="text-center text-xs text-gray-500">
              <p>Secure checkout powered by Stripe (Demo)</p>
              <p className="mt-1 text-gray-400">No real payment processing in demo mode</p>
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


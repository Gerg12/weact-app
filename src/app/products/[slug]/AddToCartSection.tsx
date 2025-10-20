'use client';

import { useState } from 'react';
import useCart from '@/app/hooks/useCart';
import type { Product } from '@/app/types';

/**
 * AddToCartSection Component
 * 
 * Client component that handles adding products to cart.
 * Uses the useCart hook to interact with global cart state.
 * Provides visual feedback when items are added.
 */

interface AddToCartSectionProps {
  product: Product;
}

export default function AddToCartSection({ product }: AddToCartSectionProps) {
  const { addItemToCart, getItemQuantity, cartCount } = useCart();
  const [showFeedback, setShowFeedback] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Get current quantity in cart
  const currentQuantityInCart = getItemQuantity(product.slug);

  // Get product price (handle both SimpleProduct and VariableProduct)
  const getProductPrice = (): number => {
    if (product.__typename === 'SimpleProduct') {
      return parseFloat(product.regularPrice || '0');
    }
    // For variable products, use the first variation's price or 0
    if (product.__typename === 'VariableProduct' && product.variations?.nodes?.[0]) {
      return parseFloat(product.variations.nodes[0].regularPrice || '0');
    }
    return 0;
  };

  const handleAddToCart = () => {
    // Add item to cart
    for (let i = 0; i < quantity; i++) {
      addItemToCart({
        productId: product.slug,
        slug: product.slug,
        name: product.name,
        price: getProductPrice(),
        image: product.image?.sourceUrl,
      });
    }

    // Show success feedback
    setShowFeedback(true);
    
    // Hide feedback after 3 seconds
    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);

    // Reset quantity to 1
    setQuantity(1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Add to Cart</h2>
      
      {/* Quantity Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantity
        </label>
        <div className="flex items-center space-x-3">
          <button
            onClick={decreaseQuantity}
            className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-xl font-bold"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val >= 1) setQuantity(val);
            }}
            className="w-20 h-10 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={increaseQuantity}
            className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-xl font-bold"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-md hover:shadow-lg"
      >
        Add {quantity > 1 ? `${quantity} Items` : 'to Cart'}
      </button>

      {/* Success Feedback */}
      {showFeedback && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Added to cart successfully!
              </p>
              <p className="text-sm text-green-700 mt-1">
                Your cart now has {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current cart info */}
      {currentQuantityInCart > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <p>
            Currently in cart: <span className="font-semibold">{currentQuantityInCart}</span>
          </p>
        </div>
      )}

      {/* Price Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center text-lg">
          <span className="font-medium">Subtotal:</span>
          <span className="font-bold text-green-600">
            ${(getProductPrice() * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}


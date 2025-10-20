'use client';

import Link from 'next/link';
import useCart from '@/app/hooks/useCart';

/**
 * Header Component
 * 
 * Site-wide header with navigation and real-time cart summary
 * Includes:
 * - Site logo/title
 * - Main navigation links
 * - Shopping cart summary with live item count and total price
 * - Responsive design with hover effects
 * 
 * Uses the useCart hook to display:
 * - Real-time total item count (cartCount)
 * - Real-time cart total price (cartTotal)
 */
export default function Header() {
  const { cartCount, cartTotal } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <Link 
              href="/" 
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Headless Store
            </Link>
          </div>

          {/* Main Navigation */}
          <nav aria-label="Main navigation">
            <ul className="flex items-center space-x-6">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  href="/test-graphql" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  GraphQL Test
                </Link>
              </li>
              
              {/* Cart Summary */}
              <li>
                <Link 
                  href="#" 
                  className="relative group"
                  aria-label={`Shopping cart with ${cartCount} items totaling $${cartTotal.toFixed(2)}`}
                >
                  <div className="flex items-center gap-3 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-blue-600 transition-all duration-200 bg-white hover:bg-blue-50">
                    {/* Cart Icon with Badge */}
                    <div className="relative">
                      <svg 
                        className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                        />
                      </svg>
                      
                      {/* Item Count Badge */}
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      )}
                    </div>
                    
                    {/* Cart Summary Text */}
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-500 leading-tight">
                        {cartCount === 0 ? 'Empty' : `${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}


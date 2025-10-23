import Link from 'next/link';
import type { ProductListItem } from '../types';

/**
 * ProductCard Component
 * 
 * Accessible reusable card for displaying product information
 * 
 * Accessibility Features:
 * - Semantic <article> for each product
 * - Proper heading hierarchy with <h2>
 * - Semantic <dl>/<dt>/<dd> for product attributes
 * - Focus-visible styles for keyboard navigation
 * - Descriptive aria-labels
 * - Next.js Link for client-side navigation
 * 
 * @param product - ProductListItem object containing product data
 */

interface ProductCardProps {
  product: ProductListItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Format price for display
  const formatPrice = (price: string | null) => {
    if (!price || price === 'null' || price === '') {
      return 'Price not set';
    }
    try {
      const numPrice = parseFloat(price);
      return isNaN(numPrice) ? 'Price not set' : `$${numPrice.toFixed(2)}`;
    } catch {
      return 'Price not set';
    }
  };

  const formattedPrice = formatPrice(product.regularPrice);

  return (
    <article 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
      data-product-type={product.__typename}
    >
      <div className="p-6">
        <header className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {product.name}
          </h2>
        </header>
        
        <div className="space-y-3 mb-4">
          {product.sku && (
            <dl className="text-sm">
              <dt className="sr-only">Product SKU</dt>
              <dd className="text-gray-600">
                <span className="font-medium">SKU:</span> {product.sku}
              </dd>
            </dl>
          )}
          
          <div className="text-2xl font-bold text-blue-600" aria-label={`Price: ${formattedPrice}`}>
            {formattedPrice}
          </div>
          
          {product.__typename && (
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              <span className="sr-only">Product type:</span>
              {product.__typename.replace('Product', '')}
            </div>
          )}
        </div>
        
        <footer>
          <Link 
            href={`/products/${product.slug}`} 
            className="inline-block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-label={`View details for ${product.name}, priced at ${formattedPrice}`}
          >
            View Details
          </Link>
        </footer>
      </div>
    </article>
  );
}


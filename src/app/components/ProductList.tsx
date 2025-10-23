import { ReactNode } from 'react';
import Link from 'next/link';
import ProductImage from './ProductImage';
import type { ProductListItem } from '../types';

/**
 * ProductList Component
 * 
 * Accessible compound component pattern for displaying products
 * 
 * Accessibility Features:
 * - Semantic <ul>/<li> structure
 * - Proper ARIA labels
 * - Focus-visible styles for keyboard navigation
 * - Screen reader friendly product information
 * 
 * Example usage:
 * <ProductList>
 *   {products.map(product => (
 *     <ProductList.Card key={product.slug} product={product} />
 *   ))}
 * </ProductList>
 */

interface ProductListProps {
  children: ReactNode;
}

interface ProductListCardProps {
  product: ProductListItem;
}

/**
 * Parent ProductList component
 * Provides the container structure for the product list
 */
function ProductList({ children }: ProductListProps) {
  return (
    <section aria-labelledby="products-heading">
      <h2 id="products-heading" className="sr-only">
        Products
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none m-0 p-0">
        {children}
      </ul>
    </section>
  );
}

/**
 * ProductList.Card subcomponent
 * Renders an individual product card within the list
 */
function ProductListCard({ product }: ProductListCardProps) {
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
    <li 
      data-product-slug={product.slug} 
      className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
    >
      <article data-product-type={product.__typename}>
        {/* Product Image */}
        <div className="relative w-full h-64 bg-gray-100">
          <ProductImage
            src={product.image?.sourceUrl}
            alt={product.image?.altText || `${product.name} product image`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        <div className="p-4">
          <header className="mb-3">
            <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
          </header>
          
          <div className="space-y-2">
            {product.sku && (
              <dl className="text-sm text-gray-600">
                <dt className="inline font-medium">SKU: </dt>
                <dd className="inline">{product.sku}</dd>
              </dl>
            )}
            
            <div className="text-2xl font-bold text-green-600" aria-label={`Price: ${formattedPrice}`}>
              <data value={product.regularPrice || '0'}>{formattedPrice}</data>
            </div>
            
            {product.__typename && (
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                <span className="sr-only">Product type: </span>
                {product.__typename.replace('Product', '')}
              </div>
            )}
          </div>
          
          <footer className="mt-4">
            <Link 
              href={`/products/${product.slug}`} 
              aria-label={`View details for ${product.name}, priced at ${formattedPrice}`}
              className="inline-block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              View Details
            </Link>
          </footer>
        </div>
      </article>
    </li>
  );
}

// Attach the Card subcomponent to the parent ProductList
ProductList.Card = ProductListCard;

export default ProductList;


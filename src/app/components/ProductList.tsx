import { ReactNode } from 'react';
import Image from 'next/image';
import type { ProductListItem } from '../types';

/**
 * ProductList Component
 * 
 * A compound component pattern for displaying a list of products.
 * Use ProductList as the parent container and ProductList.Card for individual items.
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
    <section aria-label="Product list">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <li data-product-slug={product.slug} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <article data-product-type={product.__typename}>
        {/* Product Image */}
        <div className="relative w-full h-64 bg-gray-200">
          {product.image?.sourceUrl ? (
            <Image
              src={product.image.sourceUrl}
              alt={product.image.altText || product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <header className="mb-3">
            <h3 className="text-xl font-bold">{product.name}</h3>
          </header>
          
          <div className="space-y-2">
            {product.sku && (
              <dl className="text-sm text-gray-600">
                <dt className="inline">SKU: </dt>
                <dd className="inline">{product.sku}</dd>
              </dl>
            )}
            
            <div className="text-2xl font-bold text-green-600">
              <data value={product.regularPrice || '0'}>{formattedPrice}</data>
            </div>
            
            {product.__typename && (
              <div className="text-xs text-gray-500">
                <small>Type: {product.__typename}</small>
              </div>
            )}
          </div>
          
          <footer className="mt-4">
            <a 
              href={`/products/${product.slug}`} 
              aria-label={`View details for ${product.name}`}
              className="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              View Details
            </a>
          </footer>
        </div>
      </article>
    </li>
  );
}

// Attach the Card subcomponent to the parent ProductList
ProductList.Card = ProductListCard;

export default ProductList;


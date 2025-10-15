import { ReactNode } from 'react';
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
      <ul>
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
  const formattedPrice = product.regularPrice 
    ? `$${parseFloat(product.regularPrice).toFixed(2)}` 
    : 'Price not available';

  return (
    <li data-product-slug={product.slug}>
      <article data-product-type={product.__typename}>
        <header>
          <h3>{product.name}</h3>
        </header>
        
        <div>
          {product.sku && (
            <dl>
              <dt>SKU</dt>
              <dd>{product.sku}</dd>
            </dl>
          )}
          
          <div>
            <data value={product.regularPrice || '0'}>{formattedPrice}</data>
          </div>
          
          {product.__typename && (
            <div>
              <small>Type: {product.__typename}</small>
            </div>
          )}
        </div>
        
        <footer>
          <a href={`/products/${product.slug}`} aria-label={`View details for ${product.name}`}>
            View Details
          </a>
        </footer>
      </article>
    </li>
  );
}

// Attach the Card subcomponent to the parent ProductList
ProductList.Card = ProductListCard;

export default ProductList;


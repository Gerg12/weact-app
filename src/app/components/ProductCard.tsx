import type { ProductListItem } from '../types';

/**
 * ProductCard Component
 * 
 * A reusable card component for displaying individual product information.
 * Accepts a ProductListItem and renders it with semantic HTML.
 * 
 * @param product - ProductListItem object containing product data
 */

interface ProductCardProps {
  product: ProductListItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Format price for display
  const formattedPrice = product.regularPrice 
    ? `$${parseFloat(product.regularPrice).toFixed(2)}` 
    : 'Price not available';

  return (
    <article data-product-type={product.__typename}>
      <header>
        <h2>{product.name}</h2>
      </header>
      
      <div>
        {product.sku && (
          <dl>
            <dt>SKU</dt>
            <dd>{product.sku}</dd>
          </dl>
        )}
        
        <div>
          <span>{formattedPrice}</span>
        </div>
        
        {product.__typename && (
          <div>
            <span>Type: {product.__typename}</span>
          </div>
        )}
      </div>
      
      <footer>
        <a href={`/products/${product.slug}`} aria-label={`View details for ${product.name}`}>
          View Details
        </a>
      </footer>
    </article>
  );
}


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


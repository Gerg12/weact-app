# Product Type Definitions

This directory contains TypeScript type definitions for WooCommerce products retrieved via GraphQL.

## Available Types

### Core Product Types

#### `ProductListItem`
Minimal product data used in product listing pages.

```typescript
interface ProductListItem {
  slug: string;
  name: string;
  sku: string | null;
  regularPrice?: string | null;
  __typename?: 'SimpleProduct' | 'VariableProduct';
}
```

**Usage:**
```typescript
import type { ProductListItem } from '@/app/types';

const products: ProductListItem[] = await getProducts();
```

#### `ProductVariation`
Represents a variation of a variable product (e.g., different sizes, colors).

```typescript
interface ProductVariation {
  name: string;
  sku: string | null;
  regularPrice: string | null;
  attributes?: {
    nodes: AttributeNode[];
  };
}
```

**Usage:**
```typescript
import type { ProductVariation } from '@/app/types';

const variation: ProductVariation = {
  name: "Blue - Large",
  sku: "TSHIRT-BLU-L",
  regularPrice: "29.99",
  attributes: {
    nodes: [
      { name: "Color", value: "Blue" },
      { name: "Size", value: "Large" }
    ]
  }
};
```

### Extended Product Types

#### `SimpleProduct`
A product without variations.

```typescript
interface SimpleProduct extends BaseProduct {
  __typename: 'SimpleProduct';
  regularPrice: string | null;
  onSale: boolean | null;
}
```

#### `VariableProduct`
A product with multiple variations.

```typescript
interface VariableProduct extends BaseProduct {
  __typename: 'VariableProduct';
  regularPrice: string | null;
  variations: {
    nodes: ProductVariation[];
  } | null;
}
```

#### `Product`
Union type that can be either SimpleProduct or VariableProduct.

```typescript
type Product = SimpleProduct | VariableProduct;
```

**Usage with Type Guards:**
```typescript
import type { Product } from '@/app/types';

function displayProduct(product: Product) {
  if (product.__typename === 'VariableProduct') {
    // TypeScript knows this is a VariableProduct
    console.log(`Variations: ${product.variations?.nodes.length}`);
  } else {
    // TypeScript knows this is a SimpleProduct
    console.log(`On Sale: ${product.onSale}`);
  }
}
```

### Supporting Types

#### `ProductImage`
```typescript
interface ProductImage {
  sourceUrl: string;
  altText: string | null;
}
```

#### `AttributeNode`
```typescript
interface AttributeNode {
  name: string;
  value: string | null;
}
```

### GraphQL Response Types

#### `ProductListResponse`
Response type for product list queries.

```typescript
interface ProductListResponse {
  products: {
    nodes: ProductListItem[];
  };
}
```

#### `VariableProductResponse`
Response type for variable product queries.

```typescript
interface VariableProductResponse {
  products: {
    nodes: VariableProduct[];
  };
}
```

#### `SingleProductResponse`
Response type for single product queries.

```typescript
interface SingleProductResponse {
  product: Product | null;
}
```

## Examples

### Fetching and Displaying Products

```typescript
import { getProducts } from '@/app/lib/data-fetching';
import type { ProductListItem } from '@/app/types';

export default async function ProductList() {
  const products: ProductListItem[] = await getProducts();
  
  return (
    <ul>
      {products.map((product) => (
        <li key={product.slug}>
          <h2>{product.name}</h2>
          <p>SKU: {product.sku}</p>
          <p>Price: ${product.regularPrice}</p>
        </li>
      ))}
    </ul>
  );
}
```

### Working with Variable Products

```typescript
import type { VariableProduct, ProductVariation } from '@/app/types';

function VariableProductDisplay({ product }: { product: VariableProduct }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <h2>Available Variations:</h2>
      <ul>
        {product.variations?.nodes.map((variation: ProductVariation) => (
          <li key={variation.sku}>
            {variation.name} - ${variation.regularPrice}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Importing Types

All types are exported from the main index file:

```typescript
// Import individual types
import type { ProductListItem, ProductVariation } from '@/app/types';

// Or import multiple types
import type { 
  ProductListItem, 
  ProductVariation,
  SimpleProduct,
  VariableProduct 
} from '@/app/types';
```

## GraphQL Queries

These types correspond to the following GraphQL queries:

### Product List Query
```graphql
query ProductListQuery {
  products {
    nodes {
      slug
      name
      sku
      ... on SimpleProduct {
        regularPrice(format: RAW)
      }
      ... on VariableProduct {
        regularPrice(format: RAW)
      }
    }
  }
}
```

### Variable Product Query
```graphql
query VariableProductQuery {
  products(where: { type: VARIABLE }) {
    nodes {
      __typename 
      name
      sku
      ... on VariableProduct {
        slug
        variations {
          nodes {
            name
            sku
            regularPrice(format: RAW)
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
      }
    }
  }
}
```


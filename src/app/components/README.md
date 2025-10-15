# Component Library

This directory contains reusable React components for the headless storefront application.

## Product Components

### ProductCard

A standalone component for displaying individual product information.

**Props:**
- `product: ProductListItem` - Product data to display

**Usage:**
```tsx
import ProductCard from '@/app/components/ProductCard';
import type { ProductListItem } from '@/app/types';

const product: ProductListItem = {
  slug: 'sample-product',
  name: 'Sample Product',
  sku: 'SKU-001',
  regularPrice: '29.99',
  __typename: 'SimpleProduct'
};

<ProductCard product={product} />
```

### ProductList (Compound Component)

A compound component pattern for displaying lists of products. The parent `ProductList` provides the container structure, while `ProductList.Card` renders individual items.

**Compound Components:**
- `ProductList` - Parent container (wraps all cards)
- `ProductList.Card` - Individual product card

**Props (ProductList):**
- `children: ReactNode` - Child components (typically ProductList.Card items)

**Props (ProductList.Card):**
- `product: ProductListItem` - Product data to display

**Usage:**
```tsx
import ProductList from '@/app/components/ProductList';
import type { ProductListItem } from '@/app/types';

const products: ProductListItem[] = [
  { slug: 'product-1', name: 'Product 1', sku: 'SKU-001', regularPrice: '29.99' },
  { slug: 'product-2', name: 'Product 2', sku: 'SKU-002', regularPrice: '39.99' },
];

<ProductList>
  {products.map((product) => (
    <ProductList.Card key={product.slug} product={product} />
  ))}
</ProductList>
```

**Why Use Compound Components?**

The compound component pattern provides several benefits:
1. **Better API** - More intuitive and flexible component composition
2. **Shared Context** - Parent and child components can share state/context
3. **Flexible Composition** - Mix and match subcomponents as needed
4. **Better Semantics** - Clear parent-child relationship in JSX

## Semantic HTML Structure

All product components use semantic HTML for accessibility and SEO:

- `<article>` - Represents a self-contained composition (the product)
- `<header>` - Contains the product heading
- `<h2>` or `<h3>` - Product name (heading level depends on context)
- `<dl>`, `<dt>`, `<dd>` - Definition list for product metadata (SKU)
- `<data>` - Represents machine-readable data (price)
- `<footer>` - Contains actions/links related to the product
- `<a>` with `aria-label` - Accessible link to product details

## Component Structure

```
ProductList (Container)
└── <section aria-label="Product list">
    └── <ul>
        └── ProductList.Card (Item)
            └── <li data-product-slug="...">
                └── <article data-product-type="...">
                    ├── <header>
                    │   └── <h3>Product Name</h3>
                    ├── <div> (Product Details)
                    │   ├── <dl> (SKU)
                    │   ├── <div> (Price with <data> element)
                    │   └── <div> (Product Type)
                    └── <footer>
                        └── <a> (View Details Link)
```

## Type Safety

All components are fully typed using TypeScript interfaces from `/types`:

```typescript
import type { ProductListItem } from '@/app/types';
```

This ensures:
- Type checking at compile time
- IntelliSense/autocomplete in your IDE
- Self-documenting code
- Fewer runtime errors

## Future Enhancements

When adding styling:
- Use Tailwind CSS classes (already configured)
- Maintain semantic HTML structure
- Ensure accessibility (ARIA labels, keyboard navigation)
- Add responsive design for mobile devices
- Consider adding product images
- Add hover states and animations


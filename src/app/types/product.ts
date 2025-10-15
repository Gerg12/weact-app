/**
 * Product Type Definitions
 * Based on WooCommerce GraphQL schema
 */

/**
 * Product Image type
 */
export interface ProductImage {
  sourceUrl: string;
  altText: string | null;
}

/**
 * Product Attribute Node
 */
export interface AttributeNode {
  name: string;
  value: string | null;
}

/**
 * Product Variation
 * Represents a variation of a variable product (e.g., different sizes, colors)
 */
export interface ProductVariation {
  name: string;
  sku: string | null;
  regularPrice: string | null;
  attributes?: {
    nodes: AttributeNode[];
  };
}

/**
 * Product List Item
 * Minimal product data used in product listing pages
 */
export interface ProductListItem {
  slug: string;
  name: string;
  sku: string | null;
  regularPrice?: string | null;
  __typename?: 'SimpleProduct' | 'VariableProduct';
}

/**
 * Base Product Interface
 * Common fields shared by all product types
 */
export interface BaseProduct {
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  image: ProductImage | null;
}

/**
 * Simple Product
 * A product without variations
 */
export interface SimpleProduct extends BaseProduct {
  __typename: 'SimpleProduct';
  regularPrice: string | null;
  onSale: boolean | null;
}

/**
 * Variable Product
 * A product with multiple variations (e.g., different sizes, colors)
 */
export interface VariableProduct extends BaseProduct {
  __typename: 'VariableProduct';
  regularPrice: string | null;
  variations: {
    nodes: ProductVariation[];
  } | null;
}

/**
 * Product Union Type
 * Can be either a SimpleProduct or VariableProduct
 */
export type Product = SimpleProduct | VariableProduct;

/**
 * GraphQL Response Types
 */
export interface ProductListResponse {
  products: {
    nodes: ProductListItem[];
  };
}

export interface VariableProductResponse {
  products: {
    nodes: VariableProduct[];
  };
}

export interface SingleProductResponse {
  product: Product | null;
}


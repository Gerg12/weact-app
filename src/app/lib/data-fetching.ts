import { gql } from '@apollo/client';
import client from './apollo-client';
import type { ProductListItem, ProductListResponse, Product, SingleProductResponse } from '../types';

// Define the GraphQL query - Basic Product Query from Day 4
const PRODUCT_LIST_QUERY = gql`
  query ProductListQuery {
    products {
      nodes {
        slug
        name
        sku
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          regularPrice(format: RAW)
        }
        ... on VariableProduct {
          regularPrice(format: RAW)
        }
      }
    }
  }
`;

/**
 * Fetches all products from the WooCommerce store
 * This function runs on the server and can be used in Server Components
 * @returns Promise containing array of products or throws an error
 */
export async function getProducts(): Promise<ProductListItem[]> {
  try {
    const { data, error } = await client.query<ProductListResponse>({
      query: PRODUCT_LIST_QUERY,
      // Disable cache for server-side requests to ensure fresh data
      fetchPolicy: 'no-cache',
    });

    if (error) {
      console.error('GraphQL Error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('404')) {
        throw new Error('GraphQL endpoint not found. Please check your WORDPRESS_API_URL configuration.');
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to GraphQL server. Please ensure your WordPress site is running and accessible.');
      } else {
        throw new Error(`Failed to fetch products: ${error.message}`);
      }
    }

    if (!data?.products?.nodes) {
      return [];
    }

    return data.products.nodes;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// GraphQL query for single product by slug
const SINGLE_PRODUCT_QUERY = gql`
  query SingleProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      name
      description
      image {
        sourceUrl
        altText
      }
      ... on SimpleProduct {
        regularPrice(format: RAW)
        onSale
      }
      ... on VariableProduct {
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
`;

/**
 * Fetches a single product by slug from the WooCommerce store
 * This function runs on the server and can be used in Server Components
 * @param slug - Product slug to fetch
 * @returns Promise containing product data or throws an error
 */
export async function getSingleProduct(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await client.query<SingleProductResponse>({
      query: SINGLE_PRODUCT_QUERY,
      variables: { slug },
      fetchPolicy: 'no-cache',
    });

    if (error) {
      console.error('GraphQL Error:', error);
      throw new Error(`Failed to fetch product: ${error.message}`);
    }

    return data.product;
  } catch (error) {
    console.error('Error fetching single product:', error);
    throw error;
  }
}


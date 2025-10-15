import { gql } from '@apollo/client';
import client from './apollo-client';
import type { ProductListItem, ProductListResponse } from '../types';

// Define the GraphQL query - Basic Product Query from Day 4
const PRODUCT_LIST_QUERY = gql`
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


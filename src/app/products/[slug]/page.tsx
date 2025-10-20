import { gql } from '@apollo/client';
import ProductImage from '../../components/ProductImage';
import client from '../../lib/apollo-client';
import { getSingleProduct } from '../../lib/data-fetching';
import type { Product, SingleProductResponse } from '../../types';

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

// GraphQL query for all product slugs (used in generateStaticParams)
const ALL_PRODUCT_SLUGS_QUERY = gql`
  query AllProductSlugs {
    products {
      nodes {
        slug
      }
    }
  }
`;

// Configure ISR - revalidate every 60 seconds
export const revalidate = 60;

/**
 * Generate static params for all product pages
 * This function runs at build time to pre-render all product pages
 */
export async function generateStaticParams() {
  try {
    const { data } = await client.query({
      query: ALL_PRODUCT_SLUGS_QUERY,
      fetchPolicy: 'no-cache',
    });

    if (!data?.products?.nodes) {
      return [];
    }

    return data.products.nodes.map((product: { slug: string }) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Note: getSingleProduct function is imported from data-fetching.ts

/**
 * Dynamic Product Page Component
 * 
 * This page displays full product details including:
 * - Product name, description, and image
 * - Price information
 * - Product variations (if applicable)
 * 
 * Uses ISR (Incremental Static Regeneration) for optimal performance
 */
export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  let product: Product | null = null;
  let error: Error | null = null;

  // Await params before using (required in Next.js 15+)
  const { slug } = await params;

  // Fetch product data
  try {
    product = await getSingleProduct(slug);
  } catch (err) {
    error = err instanceof Error ? err : new Error('Unknown error occurred');
  }

  // Handle error state
  if (error) {
    return (
      <main className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-red-600">Error Loading Product</h1>
        <p className="text-gray-700">
          {error.message}
        </p>
      </main>
    );
  }

  // Handle product not found
  if (!product) {
    return (
      <main className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Product Not Found</h1>
        <p className="text-gray-700">
          The product you're looking for doesn't exist.
        </p>
      </main>
    );
  }

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

  return (
    <main className="container mx-auto p-8">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          {product.sku && (
            <p className="text-gray-600">SKU: {product.sku}</p>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative w-full h-96 lg:h-[600px] rounded-lg overflow-hidden shadow-lg">
            <ProductImage
              src={product.image?.sourceUrl}
              alt={product.image?.altText || product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Product Details */}
          <div>
            {/* Product Description */}
            {product.description && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Simple Product Details */}
            {product.__typename === 'SimpleProduct' && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Pricing</h2>
                <div className="text-3xl font-bold text-green-600">
                  {formatPrice(product.regularPrice)}
                </div>
                {product.onSale && (
                  <span className="inline-block bg-red-100 text-red-800 text-sm px-2 py-1 rounded mt-2">
                    On Sale
                  </span>
                )}
              </div>
            )}

            {/* Variable Product Details */}
            {product.__typename === 'VariableProduct' && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Available Variations</h2>
                {product.variations?.nodes && product.variations.nodes.length > 0 ? (
                  <div className="space-y-4">
                    {product.variations.nodes.map((variation, index) => (
                      <div key={variation.sku || index} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-2">{variation.name}</h3>
                        <div className="flex justify-between items-center">
                          <div>
                            {variation.sku && (
                              <p className="text-sm text-gray-600">SKU: {variation.sku}</p>
                            )}
                            {variation.attributes?.nodes && variation.attributes.nodes.length > 0 && (
                              <div className="mt-2">
                                {variation.attributes.nodes.map((attr, attrIndex) => (
                                  <span 
                                    key={attrIndex}
                                    className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2"
                                  >
                                    {attr.name}: {attr.value}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-xl font-bold text-green-600">
                            {formatPrice(variation.regularPrice)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No variations available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}

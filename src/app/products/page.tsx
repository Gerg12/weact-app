import { getProducts } from '../lib/data-fetching';
import ProductList from '../components/ProductList';

/**
 * Product List Page (Server Component)
 * 
 * This page fetches products from the WooCommerce GraphQL API on the server
 * and renders them using the compound component pattern:
 * - ProductList (parent container)
 * - ProductList.Card (individual product items)
 */

export default async function ProductListPage() {
  let products;
  let error;

  // Fetch data on the server using the helper function
  try {
    products = await getProducts();
  } catch (err) {
    error = err;
  }

  // Handle error state
  if (error) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8 text-red-600">Error Loading Products</h1>
        <p className="text-gray-700">
          {error instanceof Error ? error.message : 'An unknown error occurred'}
        </p>
      </main>
    );
  }

  // Handle no products state
  if (!products || products.length === 0) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        <p className="text-gray-700">No products found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <header>
        <h1 className="text-3xl font-bold mb-6">Product List</h1>
        <p className="text-gray-600 mb-8">
          Showing {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
      </header>
      
      {/* Compound component pattern: ProductList with ProductList.Card */}
      <ProductList>
        {products.map((product) => (
          <ProductList.Card key={product.slug} product={product} />
        ))}
      </ProductList>
    </main>
  );
}


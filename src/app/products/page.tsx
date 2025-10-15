import { getProducts } from '../lib/data-fetching';

// Server Component - runs entirely on the server
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
      <h1 className="text-3xl font-bold mb-6">Product List</h1>
      
      <ul className="space-y-4">
        {/* Map over the returned product data and display names and prices */}
        {products.map((product) => (
          <li key={product.slug} className="border-b pb-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">{product.name}</span>
              <span className="text-lg">
                Price: {product.regularPrice ? `$${parseFloat(product.regularPrice).toFixed(2)}` : 'null'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}


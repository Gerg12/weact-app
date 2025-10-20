import Link from 'next/link';

/**
 * Header Component
 * 
 * Site-wide header with navigation
 * Includes:
 * - Site logo/title
 * - Main navigation links
 * - Responsive design
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <Link 
              href="/" 
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Headless Store
            </Link>
          </div>

          {/* Main Navigation */}
          <nav aria-label="Main navigation">
            <ul className="flex items-center space-x-6">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  href="/test-graphql" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  GraphQL Test
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}


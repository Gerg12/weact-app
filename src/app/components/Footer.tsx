import Link from 'next/link';

/**
 * Footer Component
 * 
 * Site-wide footer with links and information
 * Includes:
 * - Quick navigation links
 * - Social/contact information
 * - Copyright notice
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Headless Store</h3>
            <p className="text-sm leading-relaxed">
              A modern headless WordPress storefront built with Next.js and WooCommerce GraphQL API.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-sm hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className="text-sm hover:text-white transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  href="/test-graphql" 
                  className="text-sm hover:text-white transition-colors"
                >
                  GraphQL Test
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact/Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>Built with Next.js 15</li>
              <li>Powered by WooCommerce</li>
              <li>GraphQL API Integration</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            &copy; {currentYear} Headless Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


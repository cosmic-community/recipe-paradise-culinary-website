import Link from 'next/link'
import { ChefHat } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold mb-4">
              <ChefHat className="h-8 w-8 text-primary-500" />
              Recipe Paradise
            </Link>
            <p className="text-gray-400 max-w-md">
              Discover amazing recipes from talented chefs around the world. 
              From quick breakfast ideas to elegant dinner parties, we have something for every occasion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/breakfast" className="text-gray-400 hover:text-white transition-colors">
                  Breakfast
                </Link>
              </li>
              <li>
                <Link href="/categories/appetizers" className="text-gray-400 hover:text-white transition-colors">
                  Appetizers
                </Link>
              </li>
              <li>
                <Link href="/categories/desserts" className="text-gray-400 hover:text-white transition-colors">
                  Desserts
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400">
                  Our Chefs
                </span>
              </li>
              <li>
                <span className="text-gray-400">
                  Recipe Collection
                </span>
              </li>
              <li>
                <span className="text-gray-400">
                  Cooking Tips
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} Recipe Paradise. Built with Cosmic headless CMS.
          </p>
        </div>
      </div>
    </footer>
  )
}
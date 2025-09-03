import Link from 'next/link'
import { ChefHat, Github, Twitter, Instagram, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <ChefHat className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">Recipe Paradise</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Discover amazing recipes from talented chefs around the world. 
              Create, share, and enjoy culinary masterpieces.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="text-gray-400 hover:text-white transition-colors">
                  All Recipes
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/chefs" className="text-gray-400 hover:text-white transition-colors">
                  Meet Our Chefs
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
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

          {/* Social & Contact */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:hello@recipeparadise.com" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Have questions? Get in touch with us at{' '}
              <a href="mailto:hello@recipeparadise.com" className="text-primary-400 hover:text-primary-300">
                hello@recipeparadise.com
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Recipe Paradise. Built with{' '}
            <a
              href="https://cosmicjs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              Cosmic CMS
            </a>
            {' '}and Next.js.
          </p>
        </div>
      </div>
    </footer>
  )
}
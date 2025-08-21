import Link from 'next/link'
import { ChefHat } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
          >
            <ChefHat className="h-8 w-8 text-primary-500" />
            Recipe Paradise
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Recipes
            </Link>
            <Link 
              href="/categories/breakfast" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Breakfast
            </Link>
            <Link 
              href="/categories/appetizers" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Appetizers
            </Link>
            <Link 
              href="/categories/desserts" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Desserts
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
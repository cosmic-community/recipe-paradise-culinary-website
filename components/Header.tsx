'use client'

import Link from 'next/link'
import { ChefHat, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
            onClick={closeMobileMenu}
          >
            <ChefHat className="h-8 w-8 text-primary-500" />
            Recipe Paradise
          </Link>

          {/* Desktop Navigation */}
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
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-900 p-2"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="px-2 pt-2 pb-4 space-y-1">
              <Link 
                href="/" 
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                Recipes
              </Link>
              <Link 
                href="/categories/breakfast" 
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                Breakfast
              </Link>
              <Link 
                href="/categories/appetizers" 
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                Appetizers
              </Link>
              <Link 
                href="/categories/desserts" 
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                Desserts
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
import Link from 'next/link'
import { ChefHat } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <ChefHat className="h-16 w-16 text-primary-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Recipe Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the recipe you're looking for. 
          It might have been moved or deleted.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        >
          Browse All Recipes
        </Link>
      </div>
    </div>
  )
}
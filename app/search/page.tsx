'use client'

import { useState, useEffect } from 'react'
import { getAllCategories } from '@/lib/recipes'
import { Recipe, Category } from '@/types'
import RecipeCard from '@/components/RecipeCard'
import { Search, Filter, X, ChefHat } from 'lucide-react'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getAllCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }

    loadCategories()
  }, [])

  // Perform search
  const performSearch = async () => {
    if (!searchQuery.trim() && !selectedCategory) {
      setRecipes([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()
      if (searchQuery.trim()) {
        searchParams.append('q', searchQuery.trim())
      }
      if (selectedCategory) {
        searchParams.append('category', selectedCategory)
      }

      const response = await fetch(`/api/search?${searchParams.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Search failed')
      }

      setRecipes(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
      setError('Failed to search recipes. Please try again.')
      setRecipes([])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search on query change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch()
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedCategory])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setRecipes([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Search Recipes
          </h1>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for recipes, ingredients, or cooking methods..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filters
              {(selectedCategory) && (
                <span className="ml-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                  1
                </span>
              )}
            </button>

            {(searchQuery || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((c: Category) => (
                    <option key={c.id} value={c.slug}>
                      {c.metadata?.name || c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div>
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600">Searching recipes...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Results */}
          {!isLoading && !error && (
            <>
              {/* Results Count */}
              {(searchQuery || selectedCategory) && (
                <div className="mb-6">
                  <p className="text-gray-600">
                    Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
                    {searchQuery && ` for "${searchQuery}"`}
                    {selectedCategory && ` in ${categories.find(c => c.slug === selectedCategory)?.metadata?.name}`}
                  </p>
                </div>
              )}

              {/* Recipe Results */}
              {recipes.length === 0 && (searchQuery || selectedCategory) ? (
                <div className="text-center py-12">
                  <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No recipes found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or filters to find more recipes.
                  </p>
                </div>
              ) : recipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map((recipe: Recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              ) : !searchQuery && !selectedCategory ? (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Start searching
                  </h3>
                  <p className="text-gray-600">
                    Enter a search term or select filters to find recipes.
                  </p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
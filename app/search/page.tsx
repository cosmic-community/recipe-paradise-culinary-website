import { searchRecipes } from '@/lib/search'
import { getCategories } from '@/lib/recipes'
import SearchBar from '@/components/SearchBar'
import RecipeCard from '@/components/RecipeCard'
import { Search as SearchIcon } from 'lucide-react'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    difficulty?: string
    sort?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const { q: query, category, difficulty, sort } = params

  const [searchResults, categories] = await Promise.all([
    searchRecipes({
      query: query || '',
      category: category || '',
      difficulty: difficulty || '',
      sortBy: sort || 'newest'
    }),
    getCategories()
  ])

  const hasSearchQuery = query && query.trim().length > 0
  const hasFilters = category || difficulty || (sort && sort !== 'newest')
  const totalResults = searchResults.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <SearchIcon className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Search Recipes</h1>
          </div>
          
          {/* Search Bar */}
          <SearchBar categories={categories} className="max-w-2xl" />
        </div>

        {/* Search Results Header */}
        <div className="mb-8">
          {hasSearchQuery || hasFilters ? (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {totalResults === 0 ? 'No recipes found' : 
                     totalResults === 1 ? '1 recipe found' : 
                     `${totalResults} recipes found`}
                  </h2>
                  {hasSearchQuery && (
                    <p className="text-gray-600 mt-1">
                      Search results for "<span className="font-medium">{query}</span>"
                    </p>
                  )}
                </div>
                
                {/* Active Filters Display */}
                {hasFilters && (
                  <div className="flex flex-wrap gap-2">
                    {category && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                        Category: {categories.find(c => c.slug === category)?.metadata?.name || category}
                      </span>
                    )}
                    {difficulty && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Difficulty: {difficulty}
                      </span>
                    )}
                    {sort && sort !== 'newest' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Sort: {sort === 'name' ? 'A-Z' : 
                               sort === 'cook_time' ? 'Cook Time' : 
                               sort === 'difficulty' ? 'Difficulty' : 
                               sort === 'oldest' ? 'Oldest' : sort}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Discover Your Next Favorite Recipe
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Use the search bar above to find recipes by name, ingredients, or cooking method. 
                Apply filters to narrow down your results.
              </p>
            </div>
          )}
        </div>

        {/* Search Results Grid */}
        {totalResults > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

        {/* No Results Message */}
        {totalResults === 0 && (hasSearchQuery || hasFilters) && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No recipes found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Try broader search terms</p>
              <p>• Check your spelling</p>
              <p>• Remove some filters</p>
              <p>• Browse all recipes instead</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const { q: query } = params

  if (query) {
    return {
      title: `Search Results for "${query}" | Recipe Paradise`,
      description: `Find delicious recipes matching "${query}" on Recipe Paradise.`
    }
  }

  return {
    title: 'Search Recipes | Recipe Paradise',
    description: 'Search through our collection of amazing recipes by name, ingredients, or cooking method.'
  }
}
import { getAllRecipes, getAllCategories } from '@/lib/recipes'
import { Recipe, Category } from '@/types'
import Hero from '@/components/Hero'
import RecipeCard from '@/components/RecipeCard'
import CategoryFilter from '@/components/CategoryFilter'
import { ChefHat } from 'lucide-react'

export default async function HomePage() {
  const [recipes, categories] = await Promise.all([
    getAllRecipes(),
    getAllCategories()
  ])

  // Get featured recipes (first 6)
  const featuredRecipes = recipes.slice(0, 6)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Categories Section */}
        {categories.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Explore by Category
              </h2>
              <p className="text-lg text-gray-600">
                Discover recipes organized by your favorite food categories
              </p>
            </div>
            <CategoryFilter categories={categories} />
          </div>
        )}

        {/* Featured Recipes Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Recipes
            </h2>
            <p className="text-lg text-gray-600">
              Hand-picked recipes that our community loves
            </p>
          </div>

          {featuredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No recipes available yet
              </h3>
              <p className="text-gray-600">
                We're working on adding delicious recipes. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRecipes.map((recipe: Recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>

        {/* All Recipes Section */}
        {recipes.length > 6 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                All Recipes
              </h2>
              <p className="text-lg text-gray-600">
                Browse our complete collection of {recipes.length} recipes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.slice(6).map((recipe: Recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Generate metadata for SEO
export const metadata = {
  title: 'Recipe Paradise - Discover Amazing Recipes',
  description: 'Explore a world of culinary delights with our collection of carefully curated recipes from talented chefs around the globe.',
}
import { getRecipes, getCategories } from '@/lib/recipes'
import RecipeCard from '@/components/RecipeCard'
import CategoryFilter from '@/components/CategoryFilter'
import Hero from '@/components/Hero'
import { Recipe } from '@/types'

export default async function Home() {
  const recipes = await getRecipes()
  const categories = await getCategories()

  // Get featured recipe (first one)
  const featuredRecipe = recipes[0] || null

  return (
    <div className="min-h-screen bg-gray-50">
      {featuredRecipe && <Hero recipe={featuredRecipe} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Amazing Recipes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of delicious recipes from talented chefs around the world. 
            Filter by category to find exactly what you're craving.
          </p>
        </div>

        {/* Category Filter */}
        <CategoryFilter categories={categories} />

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {recipes.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No recipes found
            </h3>
            <p className="text-gray-600">
              Check back soon for delicious new recipes!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
import { getRecipes } from '@/lib/recipes'
import Hero from '@/components/Hero'
import RecipeCard from '@/components/RecipeCard'
import { Recipe } from '@/types'

export default async function HomePage() {
  const recipes = await getRecipes({ limit: 8 })
  
  // Get the featured recipe (first recipe) for the hero
  const featuredRecipe = recipes[0]
  
  // Get remaining recipes for the grid
  const otherRecipes = recipes.slice(1, 7)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {featuredRecipe && <Hero recipe={featuredRecipe} />}

      {/* Featured Recipes Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Recipes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked collection of delicious recipes from talented chefs around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                showAuthor={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Cooking?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Explore our complete collection of recipes and find your next favorite dish
          </p>
          <a
            href="/recipes"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-primary-600 bg-white hover:bg-gray-50 transition-colors"
          >
            Browse All Recipes
          </a>
        </div>
      </section>
    </div>
  )
}
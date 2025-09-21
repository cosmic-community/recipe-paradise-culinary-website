import { cosmic, hasStatus } from '@/lib/cosmic'
import { Recipe, Category, Author } from '@/types'
import RecipeCard from '@/components/RecipeCard'
import CategoryFilter from '@/components/CategoryFilter'
import Hero from '@/components/Hero'
import { ChefHat, Clock, Users } from 'lucide-react'

async function getRecipes(): Promise<Recipe[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'recipes' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    const recipes = response.objects as Recipe[]
    
    // Sort by creation date (newest first)
    return recipes.sort((a, b) => {
      const dateA = new Date(a.created_at || '').getTime()
      const dateB = new Date(b.created_at || '').getTime()
      return dateB - dateA
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching recipes:', error)
    return []
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.objects as Category[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching categories:', error)
    return []
  }
}

async function getFeaturedChefs(): Promise<Author[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'authors' })
      .props(['id', 'title', 'slug', 'metadata'])
      .limit(3)
    
    return response.objects as Author[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching chefs:', error)
    return []
  }
}

export default async function HomePage() {
  // Fetch all data in parallel
  const [recipes, categories, featuredChefs] = await Promise.all([
    getRecipes(),
    getCategories(),
    getFeaturedChefs()
  ])

  // Get featured recipes (first 6)
  const featuredRecipes = recipes.slice(0, 6)
  
  // Get recent recipes (next 6)
  const recentRecipes = recipes.slice(6, 12)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Featured Recipes Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Recipes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and delicious recipes, handpicked by our community
            </p>
          </div>

          {featuredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes yet</h3>
              <p className="text-gray-600">Check back later for delicious recipes!</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
              <p className="text-xl text-gray-600">
                Find the perfect recipe for any occasion
              </p>
            </div>

            <CategoryFilter categories={categories} />
          </div>
        </section>
      )}

      {/* Featured Chefs Section */}
      {featuredChefs.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Chefs</h2>
              <p className="text-xl text-gray-600">
                Learn from the best culinary experts
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredChefs.map((chef) => (
                <div key={chef.id} className="bg-white rounded-lg shadow-sm p-6 text-center">
                  {chef.metadata?.profile_photo?.imgix_url ? (
                    <img
                      src={`${chef.metadata.profile_photo.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
                      alt={chef.metadata?.name || chef.title}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <ChefHat className="h-8 w-8 text-primary-600" />
                    </div>
                  )}
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {chef.metadata?.name || chef.title}
                  </h3>
                  
                  {chef.metadata?.specialty_cuisine && (
                    <p className="text-primary-600 font-medium mb-3">
                      {chef.metadata.specialty_cuisine} Cuisine
                    </p>
                  )}
                  
                  {chef.metadata?.bio && (
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {chef.metadata.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Recipes Section */}
      {recentRecipes.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Recipes</h2>
              <p className="text-xl text-gray-600">
                Fresh culinary inspiration added regularly
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <ChefHat className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{recipes.length}</h3>
              <p className="text-gray-600">Delicious Recipes</p>
            </div>
            
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">15</h3>
              <p className="text-gray-600">Average Cook Time (min)</p>
            </div>
            
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{featuredChefs.length}</h3>
              <p className="text-gray-600">Expert Chefs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
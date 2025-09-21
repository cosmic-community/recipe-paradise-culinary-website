// app/categories/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getCategory, getRecipesByCategory, getAllCategories } from '@/lib/recipes'
import { Category, Recipe } from '@/types'
import RecipeCard from '@/components/RecipeCard'
import { Utensils } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: PageProps) {
  // In Next.js 15+, params is a Promise and must be awaited
  const { slug } = await params
  
  const [category, recipes, allCategories] = await Promise.all([
    getCategory(slug),
    getRecipesByCategory(slug),
    getAllCategories()
  ])
  
  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {category.metadata?.name || category.title}
            </h1>
            {category.metadata?.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {category.metadata.description}
              </p>
            )}
          </div>
        </div>

        {/* Other Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse Other Categories</h2>
          <div className="flex flex-wrap gap-2">
            {allCategories
              .filter((cat: Category) => cat.id !== category.id)
              .map((cat: Category) => (
                <a
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                >
                  {cat.metadata?.name || cat.title}
                </a>
              ))
            }
          </div>
        </div>

        {/* Recipes Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {category.metadata?.name || category.title} Recipes
            </h2>
            <span className="text-gray-600">
              {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
            </span>
          </div>

          {recipes.length === 0 ? (
            <div className="text-center py-12">
              <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No recipes in this category yet
              </h3>
              <p className="text-gray-600">
                We're working on adding delicious {category.metadata?.name?.toLowerCase()} recipes. 
                Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe: Recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const category = await getCategory(slug)
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested recipe category could not be found.'
    }
  }

  return {
    title: `${category.metadata?.name || category.title} Recipes - Recipe Paradise`,
    description: category.metadata?.description || `Discover delicious ${category.metadata?.name?.toLowerCase()} recipes`,
  }
}
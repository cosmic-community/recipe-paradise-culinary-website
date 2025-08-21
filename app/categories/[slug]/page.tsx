// app/categories/[slug]/page.tsx
import { getRecipesByCategory, getCategories } from '@/lib/recipes'
import { notFound } from 'next/navigation'
import RecipeCard from '@/components/RecipeCard'
import { Category } from '@/types'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const categories = await getCategories()
  const category = categories.find(cat => cat.slug === slug)

  if (!category) {
    notFound()
  }

  const recipes = await getRecipesByCategory(category.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {category.metadata?.name || category.title}
          </h1>
          {category.metadata?.description && (
            <p className="text-lg text-gray-600 max-w-3xl">
              {category.metadata.description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No recipes found in this category
            </h3>
            <p className="text-gray-600">
              Check back soon for delicious new {category.metadata?.name || category.title} recipes!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const categories = await getCategories()
  const category = categories.find(cat => cat.slug === slug)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.metadata?.name || category.title} Recipes | Recipe Paradise`,
    description: category.metadata?.description || `Discover delicious ${category.metadata?.name || category.title} recipes.`,
  }
}
// app/recipes/[slug]/page.tsx
import { getRecipe } from '@/lib/recipes'
import { getCommentsByRecipe, getRatingSummary } from '@/lib/comments'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AuthorCard from '@/components/AuthorCard'
import CommentSection from '@/components/CommentSection'
import StarRating from '@/components/StarRating'
import { Clock, Users, ChefHat } from 'lucide-react'
import { Recipe } from '@/types'

interface RecipePageProps {
  params: Promise<{ slug: string }>
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params
  const recipe = await getRecipe(slug)

  if (!recipe) {
    notFound()
  }

  // Fetch comments and ratings for this recipe
  const [comments, ratingSummary] = await Promise.all([
    getCommentsByRecipe(recipe.id),
    getRatingSummary(recipe.id)
  ])

  const totalTime = (recipe.metadata?.prep_time || 0) + (recipe.metadata?.cook_time || 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        {recipe.metadata?.featured_image && (
          <img 
            src={`${recipe.metadata.featured_image.imgix_url}?w=1600&h=600&fit=crop&auto=format,compress`}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {recipe.metadata?.recipe_name || recipe.title}
            </h1>
            {recipe.metadata?.description && (
              <p className="text-xl text-gray-200 max-w-2xl mb-4">
                {recipe.metadata.description}
              </p>
            )}
            
            {/* Rating Display */}
            {ratingSummary.totalRatings > 0 && (
              <div className="flex items-center gap-3">
                <StarRating 
                  rating={ratingSummary.averageRating}
                  size="md"
                  showCount={true}
                  count={ratingSummary.totalRatings}
                  className="text-white"
                />
                <span className="text-gray-200">
                  {ratingSummary.averageRating.toFixed(1)} out of 5
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recipe Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recipe.metadata?.prep_time && (
                  <div className="text-center">
                    <Clock className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Prep Time</p>
                    <p className="font-semibold">{recipe.metadata.prep_time} min</p>
                  </div>
                )}
                {recipe.metadata?.cook_time && (
                  <div className="text-center">
                    <ChefHat className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Cook Time</p>
                    <p className="font-semibold">{recipe.metadata.cook_time} min</p>
                  </div>
                )}
                {totalTime > 0 && (
                  <div className="text-center">
                    <Clock className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Total Time</p>
                    <p className="font-semibold">{totalTime} min</p>
                  </div>
                )}
                {recipe.metadata?.servings && (
                  <div className="text-center">
                    <Users className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Servings</p>
                    <p className="font-semibold">{recipe.metadata.servings}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            {recipe.metadata?.ingredients && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
                <div 
                  className="recipe-content"
                  dangerouslySetInnerHTML={{ __html: recipe.metadata.ingredients }} 
                />
              </div>
            )}

            {/* Instructions */}
            {recipe.metadata?.instructions && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
                <div 
                  className="recipe-content"
                  dangerouslySetInnerHTML={{ __html: recipe.metadata.instructions }} 
                />
              </div>
            )}

            {/* Comments Section */}
            <CommentSection 
              recipeId={recipe.id}
              initialComments={comments}
              initialRatingSummary={ratingSummary}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Category & Difficulty */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              {recipe.metadata?.category && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                  <Link 
                    href={`/categories/${recipe.metadata.category.slug}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors"
                  >
                    {recipe.metadata.category.metadata?.name || recipe.metadata.category.title}
                  </Link>
                </div>
              )}
              
              {recipe.metadata?.difficulty_level && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Difficulty</h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {recipe.metadata.difficulty_level.value}
                  </span>
                </div>
              )}
            </div>

            {/* Author Card */}
            {recipe.metadata?.author && (
              <AuthorCard author={recipe.metadata.author} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: RecipePageProps) {
  const { slug } = await params
  const recipe = await getRecipe(slug)

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
    }
  }

  return {
    title: `${recipe.metadata?.recipe_name || recipe.title} | Recipe Paradise`,
    description: recipe.metadata?.description || `Delicious ${recipe.title} recipe with step-by-step instructions.`,
  }
}
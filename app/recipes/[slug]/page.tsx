// app/recipes/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { cosmic, hasStatus } from '@/lib/cosmic'
import { Recipe, Comment, RatingSummary } from '@/types'
import { getCommentsByRecipe, getRatingSummary } from '@/lib/comments'
import CommentSection from '@/components/CommentSection'
import { Clock, Users, ChefHat, Star } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getRecipe(slug: string): Promise<Recipe | null> {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'recipes',
        slug: slug
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)

    return response.object as Recipe
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    console.error('Error fetching recipe:', error)
    throw new Error('Failed to fetch recipe')
  }
}

export default async function RecipePage({ params }: PageProps) {
  // In Next.js 15+, params is a Promise and must be awaited
  const { slug } = await params
  
  const recipe = await getRecipe(slug)
  
  if (!recipe) {
    notFound()
  }

  // Fetch comments and ratings in parallel
  const [comments, ratingSummary] = await Promise.all([
    getCommentsByRecipe(recipe.id).catch(() => []),
    getRatingSummary(recipe.id).catch(() => ({
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }))
  ])

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recipe Image */}
            <div className="relative aspect-video lg:aspect-square">
              {recipe.metadata?.featured_image?.imgix_url ? (
                <img
                  src={`${recipe.metadata.featured_image.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`}
                  alt={recipe.metadata?.recipe_name || recipe.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <ChefHat className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Recipe Info */}
            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {recipe.metadata?.recipe_name || recipe.title}
                </h1>
                
                {recipe.metadata?.description && (
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {recipe.metadata.description}
                  </p>
                )}

                {/* Rating Summary */}
                {ratingSummary.totalRatings > 0 && (
                  <div className="flex items-center gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {renderStars(Math.round(ratingSummary.averageRating))}
                      <span className="font-semibold text-lg">
                        {ratingSummary.averageRating.toFixed(1)}
                      </span>
                      <span className="text-gray-600">
                        ({ratingSummary.totalRatings} review{ratingSummary.totalRatings !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Recipe Meta Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                {recipe.metadata?.prep_time && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Prep Time</div>
                      <div className="font-semibold">{formatTime(recipe.metadata.prep_time)}</div>
                    </div>
                  </div>
                )}

                {recipe.metadata?.cook_time !== undefined && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <ChefHat className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Cook Time</div>
                      <div className="font-semibold">
                        {recipe.metadata.cook_time === 0 ? 'No cooking' : formatTime(recipe.metadata.cook_time)}
                      </div>
                    </div>
                  </div>
                )}

                {recipe.metadata?.servings && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Servings</div>
                      <div className="font-semibold">{recipe.metadata.servings}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap gap-4">
                {recipe.metadata?.difficulty_level?.value && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {recipe.metadata.difficulty_level.value}
                  </div>
                )}

                {recipe.metadata?.category?.metadata?.name && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    {recipe.metadata.category.metadata.name}
                  </div>
                )}
              </div>

              {/* Author Info */}
              {recipe.metadata?.author && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {recipe.metadata.author.metadata?.profile_photo?.imgix_url ? (
                      <img
                        src={`${recipe.metadata.author.metadata.profile_photo.imgix_url}?w=100&h=100&fit=crop&auto=format,compress`}
                        alt={recipe.metadata.author.metadata?.name || 'Chef'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <ChefHat className="h-6 w-6 text-primary-600" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">
                        {recipe.metadata.author.metadata?.name || recipe.metadata.author.title}
                      </div>
                      {recipe.metadata.author.metadata?.specialty_cuisine && (
                        <div className="text-sm text-gray-600">
                          {recipe.metadata.author.metadata.specialty_cuisine} Cuisine
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h2>
              {recipe.metadata?.ingredients ? (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: recipe.metadata.ingredients }}
                />
              ) : (
                <p className="text-gray-500">No ingredients listed.</p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
              {recipe.metadata?.instructions ? (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: recipe.metadata.instructions }}
                />
              ) : (
                <p className="text-gray-500">No instructions provided.</p>
              )}
            </div>

            {/* Comments Section */}
            <CommentSection
              recipeId={recipe.id}
              initialComments={comments}
              initialRatingSummary={ratingSummary}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const recipe = await getRecipe(slug)
  
  if (!recipe) {
    return {
      title: 'Recipe Not Found',
      description: 'The requested recipe could not be found.'
    }
  }

  return {
    title: recipe.metadata?.recipe_name || recipe.title,
    description: recipe.metadata?.description || `Learn how to make ${recipe.title}`,
  }
}
// app/authors/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getAuthor, getRecipesByAuthor } from '@/lib/recipes'
import { Recipe, Author } from '@/types'
import RecipeCard from '@/components/RecipeCard'
import { ChefHat, Clock, Users } from 'lucide-react'
import SocialLinks from '@/components/SocialLinks'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function AuthorPage({ params }: PageProps) {
  // In Next.js 15+, params is a Promise and must be awaited
  const { slug } = await params
  
  const [author, recipes] = await Promise.all([
    getAuthor(slug),
    getRecipesByAuthor(slug)
  ])
  
  if (!author) {
    notFound()
  }

  const formatRecipeTime = (recipe: Recipe) => {
    const prepTime = recipe.metadata?.prep_time || 0
    const cookTime = recipe.metadata?.cook_time || 0
    const totalTime = prepTime + cookTime
    
    if (totalTime < 60) {
      return `${totalTime} min`
    }
    const hours = Math.floor(totalTime / 60)
    const minutes = totalTime % 60
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Author Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Author Image */}
            <div className="flex-shrink-0">
              {author.metadata?.profile_photo?.imgix_url ? (
                <img
                  src={`${author.metadata.profile_photo.imgix_url}?w=400&h=400&fit=crop&auto=format,compress`}
                  alt={author.metadata?.name || author.title}
                  className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 md:w-48 md:h-48 bg-primary-100 rounded-full flex items-center justify-center">
                  <ChefHat className="h-16 w-16 md:h-24 md:w-24 text-primary-600" />
                </div>
              )}
            </div>

            {/* Author Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {author.metadata?.name || author.title}
              </h1>
              
              {author.metadata?.specialty_cuisine && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 mb-4">
                  {author.metadata.specialty_cuisine} Cuisine Specialist
                </div>
              )}
              
              {author.metadata?.bio && (
                <p className="text-gray-600 leading-relaxed mb-6">
                  {author.metadata.bio}
                </p>
              )}

              {/* Social Links */}
              <SocialLinks
                instagram={author.metadata?.instagram}
                twitter={author.metadata?.twitter}
                youtube={author.metadata?.youtube}
                website={author.metadata?.website}
              />
            </div>
          </div>
        </div>

        {/* Recipes Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Recipes by {author.metadata?.name || author.title}
            </h2>
            <span className="text-gray-600">
              {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
            </span>
          </div>

          {recipes.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No recipes yet
              </h3>
              <p className="text-gray-600">
                This chef hasn't published any recipes yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe: Recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe}
                  showAuthor={false}
                />
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
  const author = await getAuthor(slug)
  
  if (!author) {
    return {
      title: 'Chef Not Found',
      description: 'The requested chef profile could not be found.'
    }
  }

  return {
    title: `${author.metadata?.name || author.title} - Recipe Paradise`,
    description: author.metadata?.bio || `Discover delicious recipes by ${author.metadata?.name || author.title}`,
  }
}
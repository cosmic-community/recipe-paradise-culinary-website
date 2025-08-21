// app/authors/[slug]/page.tsx
import { getAuthor, getRecipes } from '@/lib/recipes'
import { notFound } from 'next/navigation'
import RecipeCard from '@/components/RecipeCard'
import SocialLinks from '@/components/SocialLinks'
import { Author } from '@/types'

interface AuthorPageProps {
  params: Promise<{ slug: string }>
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params
  const author = await getAuthor(slug)

  if (!author) {
    notFound()
  }

  // Get all recipes and filter by this author
  const allRecipes = await getRecipes()
  const authorRecipes = allRecipes.filter(recipe => 
    recipe.metadata?.author?.id === author.id
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Author Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {author.metadata?.profile_photo && (
              <img 
                src={`${author.metadata.profile_photo.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
                alt={author.metadata?.name || author.title}
                className="w-32 h-32 rounded-full object-cover"
              />
            )}
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {author.metadata?.name || author.title}
              </h1>
              {author.metadata?.specialty_cuisine && (
                <p className="text-lg font-medium text-primary-600 mb-4">
                  {author.metadata.specialty_cuisine} Cuisine Specialist
                </p>
              )}
              {author.metadata?.bio && (
                <p className="text-gray-600 max-w-2xl mb-6">
                  {author.metadata.bio}
                </p>
              )}
              <SocialLinks author={author} />
            </div>
          </div>
        </div>
      </div>

      {/* Recipes by Author */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Recipes by {author.metadata?.name || author.title}
        </h2>

        {authorRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authorRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No recipes found
            </h3>
            <p className="text-gray-600">
              {author.metadata?.name || author.title} hasn't published any recipes yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: AuthorPageProps) {
  const { slug } = await params
  const author = await getAuthor(slug)

  if (!author) {
    return {
      title: 'Author Not Found',
    }
  }

  return {
    title: `${author.metadata?.name || author.title} | Recipe Paradise`,
    description: author.metadata?.bio || `Discover recipes by ${author.metadata?.name || author.title}.`,
  }
}
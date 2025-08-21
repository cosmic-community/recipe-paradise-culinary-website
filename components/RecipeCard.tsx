import Link from 'next/link'
import { Recipe } from '@/types'
import { Clock, Users, ChefHat } from 'lucide-react'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = (recipe.metadata?.prep_time || 0) + (recipe.metadata?.cook_time || 0)

  return (
    <Link 
      href={`/recipes/${recipe.slug}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Recipe Image */}
      <div className="aspect-w-16 aspect-h-12 bg-gray-200">
        {recipe.metadata?.featured_image ? (
          <img 
            src={`${recipe.metadata.featured_image.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
            alt={recipe.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <ChefHat className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* Recipe Content */}
      <div className="p-6">
        <div className="mb-3">
          {recipe.metadata?.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {recipe.metadata.category.metadata?.name || recipe.metadata.category.title}
            </span>
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {recipe.metadata?.recipe_name || recipe.title}
        </h3>

        {recipe.metadata?.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {recipe.metadata.description}
          </p>
        )}

        {/* Recipe Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            {totalTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{totalTime}m</span>
              </div>
            )}
            {recipe.metadata?.servings && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.metadata.servings}</span>
              </div>
            )}
          </div>
          
          {recipe.metadata?.difficulty_level && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {recipe.metadata.difficulty_level.value}
            </span>
          )}
        </div>

        {/* Author */}
        {recipe.metadata?.author && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {recipe.metadata.author.metadata?.profile_photo && (
                <img 
                  src={`${recipe.metadata.author.metadata.profile_photo.imgix_url}?w=60&h=60&fit=crop&auto=format,compress`}
                  alt={recipe.metadata.author.metadata?.name || recipe.metadata.author.title}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <span className="text-sm text-gray-600">
                by {recipe.metadata.author.metadata?.name || recipe.metadata.author.title}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
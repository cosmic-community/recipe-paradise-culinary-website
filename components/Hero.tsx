import Link from 'next/link'
import { Recipe } from '@/types'
import { Clock, Users } from 'lucide-react'

interface HeroProps {
  recipe: Recipe
}

export default function Hero({ recipe }: HeroProps) {
  const totalTime = (recipe.metadata?.prep_time || 0) + (recipe.metadata?.cook_time || 0)

  return (
    <div className="relative h-96 md:h-[500px] bg-gray-900 overflow-hidden">
      {recipe.metadata?.featured_image && (
        <img 
          src={`${recipe.metadata.featured_image.imgix_url}?w=1600&h=1000&fit=crop&auto=format,compress`}
          alt={recipe.title}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-white max-w-2xl">
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-500 text-white">
              Featured Recipe
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {recipe.metadata?.recipe_name || recipe.title}
          </h1>
          
          {recipe.metadata?.description && (
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              {recipe.metadata.description}
            </p>
          )}

          <div className="flex items-center gap-6 mb-8">
            {totalTime > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">{totalTime} minutes</span>
              </div>
            )}
            {recipe.metadata?.servings && (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">{recipe.metadata.servings} servings</span>
              </div>
            )}
            {recipe.metadata?.difficulty_level && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                {recipe.metadata.difficulty_level.value}
              </span>
            )}
          </div>

          <Link
            href={`/recipes/${recipe.slug}`}
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  )
}
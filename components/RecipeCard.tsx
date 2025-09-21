import Link from 'next/link'
import { Recipe } from '@/types'
import { Clock, Users, ChefHat } from 'lucide-react'
import StarRating from './StarRating'

export interface RecipeCardProps {
  recipe: Recipe;
  showAuthor?: boolean;
}

export default function RecipeCard({ recipe, showAuthor = true }: RecipeCardProps) {
  const {
    slug,
    title,
    metadata: {
      description,
      featured_image,
      prep_time,
      cook_time,
      servings,
      difficulty_level,
      author,
      category
    }
  } = recipe

  const totalTime = (prep_time || 0) + (cook_time || 0)

  return (
    <Link href={`/recipes/${slug}`} className="group block">
      <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* Recipe Image */}
        <div className="aspect-video overflow-hidden">
          <img
            src={`${featured_image?.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            width={800}
            height={450}
          />
        </div>

        {/* Recipe Content */}
        <div className="p-6">
          {/* Category Badge */}
          {category && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1 text-xs font-medium text-primary-700 bg-primary-100 rounded-full">
                {category.metadata?.name || category.title}
              </span>
            </div>
          )}

          {/* Recipe Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {description}
            </p>
          )}

          {/* Recipe Meta */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {totalTime > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{totalTime} min</span>
                </div>
              )}
              
              {servings && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{servings}</span>
                </div>
              )}

              {difficulty_level?.value && (
                <div className="flex items-center gap-1">
                  <ChefHat className="h-4 w-4" />
                  <span>{difficulty_level.value}</span>
                </div>
              )}
            </div>

            {/* Star Rating Placeholder */}
            <StarRating rating={0} showCount={false} size="sm" />
          </div>

          {/* Author */}
          {showAuthor && author && (
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={`${author.metadata?.profile_photo?.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                  alt={author.metadata?.name || author.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={32}
                  height={32}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {author.metadata?.name || author.title}
                </p>
                {author.metadata?.specialty_cuisine && (
                  <p className="text-xs text-gray-500 truncate">
                    {author.metadata.specialty_cuisine} Cuisine
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
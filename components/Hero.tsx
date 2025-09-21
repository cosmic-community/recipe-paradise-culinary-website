import { Recipe } from '@/types'
import { Clock, Users, ChefHat } from 'lucide-react'
import StarRating from './StarRating'

export interface HeroProps {
  recipe: Recipe;
}

export default function Hero({ recipe }: HeroProps) {
  const {
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
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={`${featured_image?.imgix_url}?w=1920&h=800&fit=crop&auto=format,compress`}
          alt={title}
          className="w-full h-full object-cover opacity-20"
          width={1920}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-800/80 to-primary-600/80"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          {/* Category Badge */}
          {category && (
            <div className="mb-4">
              <span className="inline-block px-4 py-2 text-sm font-medium text-white bg-white/20 rounded-full backdrop-blur-sm">
                {category.metadata?.name || category.title}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {description}
            </p>
          )}

          {/* Recipe Meta */}
          <div className="flex flex-wrap items-center gap-6 mb-8">
            {totalTime > 0 && (
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="h-5 w-5" />
                <span className="font-medium">{totalTime} minutes</span>
              </div>
            )}
            
            {servings && (
              <div className="flex items-center gap-2 text-white/90">
                <Users className="h-5 w-5" />
                <span className="font-medium">Serves {servings}</span>
              </div>
            )}

            {difficulty_level?.value && (
              <div className="flex items-center gap-2 text-white/90">
                <ChefHat className="h-5 w-5" />
                <span className="font-medium">{difficulty_level.value}</span>
              </div>
            )}

            {/* Star Rating */}
            <StarRating rating={0} showCount={false} size="md" theme="light" />
          </div>

          {/* Author */}
          {author && (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={`${author.metadata?.profile_photo?.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                  alt={author.metadata?.name || author.title}
                  className="w-full h-full object-cover"
                  width={48}
                  height={48}
                />
              </div>
              <div>
                <p className="text-white font-medium">
                  By {author.metadata?.name || author.title}
                </p>
                {author.metadata?.specialty_cuisine && (
                  <p className="text-white/70 text-sm">
                    {author.metadata.specialty_cuisine} Cuisine Specialist
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
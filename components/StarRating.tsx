import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  count?: number
  className?: string
}

export default function StarRating({ 
  rating, 
  maxStars = 5, 
  size = 'sm',
  showCount = false,
  count = 0,
  className = ''
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: maxStars }, (_, index) => {
          const starValue = index + 1
          const isFilled = starValue <= rating
          const isPartiallyFilled = starValue - 0.5 <= rating && starValue > rating

          return (
            <Star
              key={index}
              className={`${sizeClasses[size]} ${
                isFilled || isPartiallyFilled
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          )
        })}
      </div>
      
      {showCount && count > 0 && (
        <span className="text-sm text-gray-600 ml-1">
          ({count})
        </span>
      )}
    </div>
  )
}
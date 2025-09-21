import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  showCount?: boolean
  count?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function StarRating({ 
  rating, 
  showCount = true, 
  count = 0, 
  size = 'sm',
  className = ''
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      
      {showCount && count > 0 && (
        <span className="text-sm text-gray-600">
          ({count})
        </span>
      )}
    </div>
  )
}
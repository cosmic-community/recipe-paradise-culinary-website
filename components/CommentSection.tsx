'use client'

import { useState, useEffect } from 'react'
import { Comment, RatingSummary } from '@/types'
import { Star, MessageCircle, User } from 'lucide-react'
import CommentForm from './CommentForm'

interface CommentSectionProps {
  recipeId: string
  initialComments: Comment[]
  initialRatingSummary: RatingSummary
}

export default function CommentSection({ 
  recipeId, 
  initialComments, 
  initialRatingSummary 
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [ratingSummary, setRatingSummary] = useState<RatingSummary>(initialRatingSummary)
  const [showCommentForm, setShowCommentForm] = useState(false)

  const handleCommentSubmitted = async () => {
    // Refresh comments and ratings after new comment is submitted
    try {
      const [commentsResponse, ratingsResponse] = await Promise.all([
        fetch(`/api/comments/${recipeId}`),
        fetch(`/api/ratings/${recipeId}`)
      ])

      if (commentsResponse.ok && ratingsResponse.ok) {
        const newComments = await commentsResponse.json()
        const newRatingSummary = await ratingsResponse.json()
        
        setComments(newComments)
        setRatingSummary(newRatingSummary)
      }
    } catch (error) {
      console.error('Failed to refresh comments:', error)
    }
    
    setShowCommentForm(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    }
    
    return (
      <div className="flex items-center gap-1">
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
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Reviews & Comments</h2>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">{comments.length}</span>
          </div>
        </div>
        
        <button
          onClick={() => setShowCommentForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        >
          Write Review
        </button>
      </div>

      {/* Rating Summary */}
      {ratingSummary.totalRatings > 0 && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-gray-900">
                {ratingSummary.averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(ratingSummary.averageRating), 'md')}
              <span className="text-gray-600">
                ({ratingSummary.totalRatings} review{ratingSummary.totalRatings !== 1 ? 's' : ''})
              </span>
            </div>
          </div>
          
          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3 text-sm">
                <span className="w-3">{rating}</span>
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{
                      width: `${ratingSummary.totalRatings > 0 
                        ? (ratingSummary.ratingDistribution[rating as keyof typeof ratingSummary.ratingDistribution] / ratingSummary.totalRatings) * 100 
                        : 0}%`
                    }}
                  />
                </div>
                <span className="text-gray-500 text-xs min-w-6">
                  {ratingSummary.ratingDistribution[rating as keyof typeof ratingSummary.ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comment Form Modal */}
      {showCommentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <CommentForm
              recipeId={recipeId}
              onSuccess={handleCommentSubmitted}
              onCancel={() => setShowCommentForm(false)}
            />
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">Be the first to review this recipe!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {comment.metadata?.user_name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                    
                    {comment.metadata?.rating && comment.metadata.rating > 0 && (
                      <div className="flex items-center gap-1">
                        {renderStars(comment.metadata.rating)}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {comment.metadata?.comment_text}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
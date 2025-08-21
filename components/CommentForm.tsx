'use client'

import { useState } from 'react'
import { CommentFormData } from '@/types'
import { Star, X } from 'lucide-react'

interface CommentFormProps {
  recipeId: string
  onSuccess: () => void
  onCancel: () => void
}

export default function CommentForm({ recipeId, onSuccess, onCancel }: CommentFormProps) {
  const [formData, setFormData] = useState<CommentFormData>({
    user_name: '',
    user_email: '',
    comment_text: '',
    rating: undefined,
    recipe_id: recipeId
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit comment')
      }

      onSuccess()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  const renderStarRating = () => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleRatingClick(star)}
          className={`p-1 rounded transition-colors ${
            formData.rating !== undefined && star <= formData.rating 
              ? 'text-yellow-400' 
              : 'text-gray-300 hover:text-yellow-200'
          }`}
        >
          <Star 
            className={`h-6 w-6 ${
              formData.rating !== undefined && star <= formData.rating ? 'fill-yellow-400' : ''
            }`} 
          />
        </button>
      ))}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="user_name"
              required
              value={formData.user_name}
              onChange={(e) => setFormData(prev => ({ ...prev, user_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="user_email"
              required
              value={formData.user_email}
              onChange={(e) => setFormData(prev => ({ ...prev, user_email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating (optional)
          </label>
          {renderStarRating()}
          {formData.rating !== undefined && formData.rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              You rated this recipe {formData.rating} out of 5 stars
            </p>
          )}
        </div>

        <div>
          <label htmlFor="comment_text" className="block text-sm font-medium text-gray-700 mb-1">
            Your Review *
          </label>
          <textarea
            id="comment_text"
            required
            rows={4}
            value={formData.comment_text}
            onChange={(e) => setFormData(prev => ({ ...prev, comment_text: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="Share your thoughts about this recipe..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Your review will be published after moderation. We respect your privacy and will not display your email address.
      </p>
    </form>
  )
}
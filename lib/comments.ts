import { cosmic, hasStatus } from './cosmic'
import { Comment, CommentFormData, RatingSummary } from '@/types'

export async function getCommentsByRecipe(recipeId: string): Promise<Comment[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'comments',
        'metadata.recipe': recipeId,
        'metadata.status': 'approved'
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
    
    const comments = response.objects as Comment[]
    
    // Sort by creation date (newest first)
    return comments.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch comments')
  }
}

export async function getRatingSummary(recipeId: string): Promise<RatingSummary> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'comments',
        'metadata.recipe': recipeId,
        'metadata.status': 'approved'
      })
      .props(['metadata'])
    
    const comments = response.objects as Comment[]
    const ratingsOnly = comments
      .filter(comment => comment.metadata?.rating && comment.metadata.rating > 0)
      .map(comment => comment.metadata!.rating!)
    
    if (ratingsOnly.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0
        }
      }
    }
    
    const averageRating = ratingsOnly.reduce((sum, rating) => sum + rating, 0) / ratingsOnly.length
    
    const ratingDistribution = {
      5: ratingsOnly.filter(r => r === 5).length,
      4: ratingsOnly.filter(r => r === 4).length,
      3: ratingsOnly.filter(r => r === 3).length,
      2: ratingsOnly.filter(r => r === 2).length,
      1: ratingsOnly.filter(r => r === 1).length,
    }
    
    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings: ratingsOnly.length,
      ratingDistribution
    }
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0
        }
      }
    }
    throw new Error('Failed to fetch rating summary')
  }
}

export async function createComment(commentData: CommentFormData): Promise<Comment> {
  try {
    const response = await cosmic.objects.insertOne({
      title: `Comment by ${commentData.user_name}`,
      type: 'comments',
      metadata: {
        recipe: commentData.recipe_id,
        user_name: commentData.user_name,
        user_email: commentData.user_email,
        comment_text: commentData.comment_text,
        rating: commentData.rating || null,
        status: 'pending' // All comments start as pending for moderation
      }
    })
    
    return response.object as Comment
  } catch (error) {
    throw new Error('Failed to create comment')
  }
}
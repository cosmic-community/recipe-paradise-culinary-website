import { cosmic, hasStatus } from './cosmic'
import { Comment, CommentFormData, RatingSummary } from '@/types'

export async function getCommentsByRecipe(recipeId: string): Promise<Comment[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'comments',
        'metadata.recipe': recipeId,
        'metadata.status': 'Approved'
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
    console.error('Error fetching comments:', error)
    throw new Error('Failed to fetch comments')
  }
}

export async function getRatingSummary(recipeId: string): Promise<RatingSummary> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'comments',
        'metadata.recipe': recipeId,
        'metadata.status': 'Approved'
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
    console.error('Error fetching rating summary:', error)
    throw new Error('Failed to fetch rating summary')
  }
}

export async function createComment(commentData: CommentFormData): Promise<Comment> {
  try {
    // Create the comment with proper Cosmic structure
    const commentPayload = {
      title: `Comment by ${commentData.user_name}`,
      type: 'comments',
      metadata: {
        recipe: commentData.recipe_id, // This should be the recipe object ID
        user_name: commentData.user_name,
        user_email: commentData.user_email,
        comment_text: commentData.comment_text,
        rating: commentData.rating || null,
        status: 'Pending' // Use proper capitalization as defined in content model
      }
    }

    console.log('Creating comment with payload:', commentPayload)
    
    const response = await cosmic.objects.insertOne(commentPayload)
    
    if (!response.object) {
      throw new Error('No comment object returned from Cosmic')
    }
    
    return response.object as Comment
  } catch (error) {
    console.error('Cosmic comment creation error:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to create comment: ${error.message}`)
    }
    throw new Error('Failed to create comment')
  }
}
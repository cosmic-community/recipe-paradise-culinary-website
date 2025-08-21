import { NextRequest, NextResponse } from 'next/server'
import { createComment } from '@/lib/comments'
import { CommentFormData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CommentFormData

    // Basic validation
    if (!body.user_name?.trim() || !body.user_email?.trim() || !body.comment_text?.trim() || !body.recipe_id) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.user_email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate rating if provided
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { message: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const comment = await createComment(body)

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
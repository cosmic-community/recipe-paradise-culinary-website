// app/api/comments/[recipeId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCommentsByRecipe } from '@/lib/comments'

interface RouteParams {
  params: Promise<{
    recipeId: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { recipeId } = await params

    if (!recipeId) {
      return NextResponse.json(
        { message: 'Recipe ID is required' },
        { status: 400 }
      )
    }

    const comments = await getCommentsByRecipe(recipeId)
    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
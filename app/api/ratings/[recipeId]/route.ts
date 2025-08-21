import { NextRequest, NextResponse } from 'next/server'
import { getRatingSummary } from '@/lib/comments'

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

    const ratingSummary = await getRatingSummary(recipeId)
    return NextResponse.json(ratingSummary)
  } catch (error) {
    console.error('Error fetching rating summary:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
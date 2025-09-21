import { NextRequest, NextResponse } from 'next/server'
import { searchRecipes } from '@/lib/search'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const sortBy = searchParams.get('sort') || 'newest'
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : undefined

    // Validate sortBy parameter
    const validSortOptions = ['newest', 'oldest', 'name', 'cook_time', 'difficulty']
    const sortOption = validSortOptions.includes(sortBy) ? sortBy as any : 'newest'

    const results = await searchRecipes({
      query,
      category,
      difficulty,
      sortBy: sortOption,
      limit
    })

    return NextResponse.json({
      results,
      total: results.length,
      query: query || null,
      filters: {
        category: category || null,
        difficulty: difficulty || null,
        sortBy: sortOption
      }
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { 
        message: 'Internal server error',
        results: [],
        total: 0
      },
      { status: 500 }
    )
  }
}
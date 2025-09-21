import { NextRequest, NextResponse } from 'next/server'
import { getSearchSuggestions } from '@/lib/search'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : 5

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const suggestions = await getSearchSuggestions(query, limit)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Search suggestions API error:', error)
    return NextResponse.json(
      { message: 'Internal server error', suggestions: [] },
      { status: 500 }
    )
  }
}
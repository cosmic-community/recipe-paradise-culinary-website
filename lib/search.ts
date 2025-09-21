import { cosmic, hasStatus } from './cosmic'
import { Recipe, Category } from '@/types'

export interface SearchOptions {
  query?: string
  category?: string
  difficulty?: string
  sortBy?: 'newest' | 'oldest' | 'name' | 'cook_time' | 'difficulty'
  limit?: number
}

export async function searchRecipes(options: SearchOptions): Promise<Recipe[]> {
  try {
    const { query, category, difficulty, sortBy = 'newest', limit } = options

    // Build the search query object
    const searchQuery: Record<string, any> = {
      type: 'recipes'
    }

    // Add category filter if specified
    if (category && category.trim()) {
      // First, find the category by slug to get its ID
      try {
        const categoryResponse = await cosmic.objects
          .findOne({ type: 'categories', slug: category })
        
        if (categoryResponse.object) {
          searchQuery['metadata.category'] = categoryResponse.object.id
        }
      } catch (error) {
        // If category not found, continue without category filter
        console.warn(`Category "${category}" not found`)
      }
    }

    // Add difficulty filter if specified
    if (difficulty && difficulty.trim()) {
      searchQuery['metadata.difficulty_level.value'] = difficulty
    }

    // Fetch recipes with filters applied
    const response = await cosmic.objects
      .find(searchQuery)
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)

    let recipes = response.objects as Recipe[]

    // Apply text search filter if query is provided
    if (query && query.trim()) {
      const searchTerm = query.toLowerCase().trim()
      recipes = recipes.filter(recipe => {
        // Search in recipe name/title
        const recipeName = (recipe.metadata?.recipe_name || recipe.title || '').toLowerCase()
        if (recipeName.includes(searchTerm)) return true

        // Search in description
        const description = (recipe.metadata?.description || '').toLowerCase()
        if (description.includes(searchTerm)) return true

        // Search in ingredients (HTML content)
        const ingredients = (recipe.metadata?.ingredients || '').toLowerCase()
        if (ingredients.includes(searchTerm)) return true

        // Search in instructions (HTML content)
        const instructions = (recipe.metadata?.instructions || '').toLowerCase()
        if (instructions.includes(searchTerm)) return true

        // Search in category name
        if (recipe.metadata?.category) {
          const categoryName = (recipe.metadata.category.metadata?.name || recipe.metadata.category.title || '').toLowerCase()
          if (categoryName.includes(searchTerm)) return true
        }

        // Search in author name
        if (recipe.metadata?.author) {
          const authorName = (recipe.metadata.author.metadata?.name || recipe.metadata.author.title || '').toLowerCase()
          if (authorName.includes(searchTerm)) return true
        }

        return false
      })
    }

    // Apply sorting
    recipes = sortRecipes(recipes, sortBy)

    // Apply limit if specified
    if (limit && limit > 0) {
      recipes = recipes.slice(0, limit)
    }

    return recipes
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error searching recipes:', error)
    throw new Error('Failed to search recipes')
  }
}

function sortRecipes(recipes: Recipe[], sortBy: SearchOptions['sortBy']): Recipe[] {
  const sortedRecipes = [...recipes]

  switch (sortBy) {
    case 'oldest':
      return sortedRecipes.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        return dateA - dateB
      })

    case 'name':
      return sortedRecipes.sort((a, b) => {
        const nameA = (a.metadata?.recipe_name || a.title || '').toLowerCase()
        const nameB = (b.metadata?.recipe_name || b.title || '').toLowerCase()
        return nameA.localeCompare(nameB)
      })

    case 'cook_time':
      return sortedRecipes.sort((a, b) => {
        const timeA = (a.metadata?.cook_time || 0) + (a.metadata?.prep_time || 0)
        const timeB = (b.metadata?.cook_time || 0) + (b.metadata?.prep_time || 0)
        return timeA - timeB
      })

    case 'difficulty':
      return sortedRecipes.sort((a, b) => {
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 }
        const diffA = difficultyOrder[a.metadata?.difficulty_level?.value as keyof typeof difficultyOrder] || 99
        const diffB = difficultyOrder[b.metadata?.difficulty_level?.value as keyof typeof difficultyOrder] || 99
        return diffA - diffB
      })

    case 'newest':
    default:
      return sortedRecipes.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        return dateB - dateA
      })
  }
}

export async function getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  try {
    const searchTerm = query.toLowerCase().trim()
    const response = await cosmic.objects
      .find({ type: 'recipes' })
      .props(['title', 'metadata'])
      .depth(1)

    const recipes = response.objects as Recipe[]
    const suggestions = new Set<string>()

    recipes.forEach(recipe => {
      // Add recipe names that match
      const recipeName = recipe.metadata?.recipe_name || recipe.title || ''
      if (recipeName.toLowerCase().includes(searchTerm)) {
        suggestions.add(recipeName)
      }

      // Add category names that match
      if (recipe.metadata?.category) {
        const categoryName = recipe.metadata.category.metadata?.name || recipe.metadata.category.title || ''
        if (categoryName.toLowerCase().includes(searchTerm)) {
          suggestions.add(categoryName)
        }
      }

      // Add author names that match
      if (recipe.metadata?.author) {
        const authorName = recipe.metadata.author.metadata?.name || recipe.metadata.author.title || ''
        if (authorName.toLowerCase().includes(searchTerm)) {
          suggestions.add(authorName)
        }
      }

      // Stop collecting if we have enough suggestions
      if (suggestions.size >= limit * 2) {
        return
      }
    })

    return Array.from(suggestions).slice(0, limit)
  } catch (error) {
    console.error('Error getting search suggestions:', error)
    return []
  }
}
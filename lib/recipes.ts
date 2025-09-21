import { cosmic, hasStatus } from './cosmic'
import { Recipe, CosmicResponse, Category, Author } from '@/types'

export async function getAllRecipes(limit?: number, skip?: number): Promise<CosmicResponse<Recipe>> {
  try {
    const query = cosmic.objects
      .find({ type: 'recipes' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)

    if (limit) query.limit(limit)
    if (skip) query.skip(skip)

    const response = await query
    
    return {
      objects: response.objects as Recipe[],
      total: response.total || 0,
      limit: limit || 10,
      skip: skip || 0
    }
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return { objects: [], total: 0, limit: limit || 10, skip: skip || 0 }
    }
    console.error('Error fetching recipes:', error)
    throw new Error('Failed to fetch recipes')
  }
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'recipes',
        slug: slug
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)

    return response.object as Recipe
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    console.error('Error fetching recipe by slug:', error)
    throw new Error('Failed to fetch recipe')
  }
}

export async function getRecipesByCategory(categoryId: string, limit?: number): Promise<Recipe[]> {
  try {
    const query = cosmic.objects
      .find({ 
        type: 'recipes',
        'metadata.category': categoryId
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)

    if (limit) query.limit(limit)

    const response = await query
    return response.objects as Recipe[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching recipes by category:', error)
    throw new Error('Failed to fetch recipes by category')
  }
}

export async function getRecipesByAuthor(authorId: string, limit?: number): Promise<Recipe[]> {
  try {
    const query = cosmic.objects
      .find({ 
        type: 'recipes',
        'metadata.author': authorId
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)

    if (limit) query.limit(limit)

    const response = await query
    return response.objects as Recipe[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching recipes by author:', error)
    throw new Error('Failed to fetch recipes by author')
  }
}

export async function getFeaturedRecipes(limit: number = 6): Promise<Recipe[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'recipes' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .limit(limit)

    const recipes = response.objects as Recipe[]
    
    // Sort by creation date (newest first) as a basic "featured" algorithm
    return recipes.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching featured recipes:', error)
    throw new Error('Failed to fetch featured recipes')
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata'])

    return response.objects as Category[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
}

export async function getAllAuthors(): Promise<Author[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'authors' })
      .props(['id', 'title', 'slug', 'metadata'])

    return response.objects as Author[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching authors:', error)
    throw new Error('Failed to fetch authors')
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'categories',
        slug: slug
      })
      .props(['id', 'title', 'slug', 'metadata'])

    return response.object as Category
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    console.error('Error fetching category by slug:', error)
    throw new Error('Failed to fetch category')
  }
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'authors',
        slug: slug
      })
      .props(['id', 'title', 'slug', 'metadata'])

    return response.object as Author
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    console.error('Error fetching author by slug:', error)
    throw new Error('Failed to fetch author')
  }
}
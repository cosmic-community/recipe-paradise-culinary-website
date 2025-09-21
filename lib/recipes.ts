import { cosmic, hasStatus } from './cosmic'
import { Recipe, Category, Author } from '@/types'

export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'recipes' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
    
    const recipes = response.objects as Recipe[]
    
    // Sort by creation date (newest first)
    return recipes.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching recipes:', error)
    throw new Error('Failed to fetch recipes')
  }
}

export async function getRecipes(): Promise<Recipe[]> {
  return getAllRecipes()
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

export async function getCategories(): Promise<Category[]> {
  return getAllCategories()
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

export async function getAuthor(slug: string): Promise<Author | null> {
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
    console.error('Error fetching author:', error)
    throw new Error('Failed to fetch author')
  }
}

export async function getRecipesByCategory(categorySlug: string): Promise<Recipe[]> {
  try {
    // First get the category to get its ID
    const categoryResponse = await cosmic.objects
      .findOne({
        type: 'categories',
        slug: categorySlug
      })
      .props(['id'])
    
    const category = categoryResponse.object as Category
    
    if (!category) {
      return []
    }
    
    // Then find recipes that have this category
    const response = await cosmic.objects
      .find({
        type: 'recipes',
        'metadata.category': category.id
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
    
    const recipes = response.objects as Recipe[]
    
    // Sort by creation date (newest first)
    return recipes.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching recipes by category:', error)
    throw new Error('Failed to fetch recipes by category')
  }
}

export async function getRecipesByAuthor(authorSlug: string): Promise<Recipe[]> {
  try {
    // First get the author to get its ID
    const authorResponse = await cosmic.objects
      .findOne({
        type: 'authors',
        slug: authorSlug
      })
      .props(['id'])
    
    const author = authorResponse.object as Author
    
    if (!author) {
      return []
    }
    
    // Then find recipes that have this author
    const response = await cosmic.objects
      .find({
        type: 'recipes',
        'metadata.author': author.id
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
    
    const recipes = response.objects as Recipe[]
    
    // Sort by creation date (newest first)
    return recipes.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching recipes by author:', error)
    throw new Error('Failed to fetch recipes by author')
  }
}

export async function getRecipe(slug: string): Promise<Recipe | null> {
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
    console.error('Error fetching recipe:', error)
    throw new Error('Failed to fetch recipe')
  }
}

export async function getCategory(slug: string): Promise<Category | null> {
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
    console.error('Error fetching category:', error)
    throw new Error('Failed to fetch category')
  }
}
// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Recipe interface
export interface Recipe extends CosmicObject {
  type: 'recipes';
  metadata: {
    recipe_name?: string;
    description?: string;
    featured_image?: {
      url: string;
      imgix_url: string;
    };
    ingredients?: string;
    instructions?: string;
    prep_time?: number;
    cook_time?: number;
    servings?: number;
    difficulty_level?: {
      key: string;
      value: string;
    };
    category?: Category;
    author?: Author;
  };
}

// Category interface
export interface Category extends CosmicObject {
  type: 'categories';
  metadata: {
    name?: string;
    description?: string;
  };
}

// Author interface
export interface Author extends CosmicObject {
  type: 'authors';
  metadata: {
    name?: string;
    bio?: string;
    profile_photo?: {
      url: string;
      imgix_url: string;
    };
    specialty_cuisine?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
}

// Type literals for select-dropdown values
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip?: number;
}

// Utility types
export type RecipeWithRelations = Recipe & {
  metadata: Recipe['metadata'] & {
    category: Category;
    author: Author;
  };
};
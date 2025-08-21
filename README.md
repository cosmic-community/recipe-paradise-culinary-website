# Recipe Paradise - Culinary Website

A beautiful, modern cooking website built with Next.js 15 that showcases delicious recipes from talented chefs. Features recipe discovery, chef profiles, category filtering, and detailed cooking instructions.

![App Preview](https://imgix.cosmicjs.com/58afc790-7943-11f0-a051-23c10f41277a-photo-1499636136210-6f4ee915583e-1755199060454.jpg?w=1200&h=300&fit=crop&auto=format,compress)

## ✨ Features

- **Recipe Collection**: Browse curated recipes with beautiful imagery and detailed information
- **Chef Profiles**: Discover talented chefs with their specialties and social media connections  
- **Category Navigation**: Filter recipes by Breakfast, Appetizers, Desserts, and more
- **Detailed Recipe Pages**: Complete ingredients, instructions, prep/cook times, and difficulty levels
- **Responsive Design**: Perfect experience across desktop, tablet, and mobile devices
- **Social Integration**: Connect with chefs through Instagram, Twitter, YouTube, and personal websites
- **Modern UI**: Clean, food-focused design with optimized imagery
- **SEO Optimized**: Built for search engine visibility and social sharing

## Clone this Bucket and Code Repository

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Bucket and Code Repository](https://img.shields.io/badge/Clone%20this%20Bucket-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](http://localhost:3040/projects/new?clone_bucket=689e35be28031fe3849acec2&clone_repository=68a794300ad7a37495ba1893)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Add social media links to authors"

### Code Generation Prompt  

> Build a Next.js website that uses my existing objects in this bucket

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Cosmic** - Headless CMS for content management
- **React** - UI library for building components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account with bucket access

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd recipe-paradise
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

4. **Run the development server**
   ```bash
   bun run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Cosmic SDK Examples

### Fetching Recipes with Related Content
```typescript
import { cosmic } from '@/lib/cosmic'

// Get recipes with category and author information
export async function getRecipes() {
  try {
    const response = await cosmic.objects
      .find({ type: 'recipes' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Recipe[]
  } catch (error) {
    if (error.status === 404) return []
    throw error
  }
}

// Get single recipe with all details
export async function getRecipe(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'recipes', slug })
      .depth(1)
    
    return response.object as Recipe
  } catch (error) {
    if (error.status === 404) return null
    throw error
  }
}
```

### Category and Author Queries
```typescript
// Get all categories
export async function getCategories() {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.objects as Category[]
  } catch (error) {
    if (error.status === 404) return []
    throw error
  }
}

// Get recipes by category
export async function getRecipesByCategory(categoryId: string) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'recipes',
        'metadata.category': categoryId 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Recipe[]
  } catch (error) {
    if (error.status === 404) return []
    throw error
  }
}
```

## 🎨 Cosmic CMS Integration

This application leverages three main content types in your Cosmic bucket:

### Recipes Content Type
- **Recipe Name**: The display name of the recipe
- **Description**: Brief description of the dish
- **Featured Image**: Hero image for the recipe
- **Ingredients**: HTML formatted ingredient list  
- **Instructions**: Step-by-step cooking instructions
- **Prep Time**: Preparation time in minutes
- **Cook Time**: Cooking time in minutes
- **Servings**: Number of servings the recipe makes
- **Difficulty Level**: Easy, Medium, or Hard
- **Category**: Connected to Categories content type
- **Author**: Connected to Authors content type

### Categories Content Type
- **Name**: Category name (Breakfast, Appetizers, etc.)
- **Description**: Category description

### Authors Content Type  
- **Name**: Chef's display name
- **Bio**: Chef's biography and background
- **Profile Photo**: Professional headshot
- **Specialty Cuisine**: Chef's cuisine specialty
- **Instagram**: Instagram profile URL
- **Twitter/X**: Twitter profile URL  
- **YouTube**: YouTube channel URL
- **Website**: Personal website or blog URL

The application uses the Cosmic SDK with depth queries to efficiently fetch related content in a single request, ensuring optimal performance.

## 🚀 Deployment Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify
1. Push your code to GitHub
2. Connect your repository to Netlify  
3. Add environment variables in Netlify dashboard
4. Deploy automatically

### Other Platforms
This Next.js application can be deployed to any platform that supports Node.js applications.

## 🌟 Key Features Explained

### Recipe Discovery
Browse through a beautiful collection of recipes with high-quality images, descriptions, and key details like prep time and difficulty level.

### Chef Profiles  
Each recipe is connected to its chef author, featuring their bio, specialty cuisine, and social media links for community connection.

### Smart Filtering
Organize recipes by categories to quickly find what you're looking for, whether it's a quick breakfast or an elegant dessert.

### Responsive Design
The entire application is built mobile-first with Tailwind CSS, ensuring a perfect experience on any device.

---

Built with ❤️ using [Cosmic](https://www.cosmicjs.com) headless CMS
<!-- README_END -->
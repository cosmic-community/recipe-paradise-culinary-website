'use client'

import { Category } from '@/types'
import Link from 'next/link'

interface CategoryFilterProps {
  categories: Category[]
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          All Recipes
        </Link>
        
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            {category.metadata?.name || category.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
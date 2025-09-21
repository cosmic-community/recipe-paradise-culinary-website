import Link from 'next/link'
import { Author } from '@/types'
import { ChefHat } from 'lucide-react'
import SocialLinks from './SocialLinks'

interface AuthorCardProps {
  author: Author
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <Link href={`/authors/${author.slug}`} className="block">
        <div className="flex items-start gap-4">
          {/* Author Photo */}
          <div className="flex-shrink-0">
            {author.metadata?.profile_photo?.imgix_url ? (
              <img
                src={`${author.metadata.profile_photo.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
                alt={author.metadata?.name || author.title}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-primary-600" />
              </div>
            )}
          </div>

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {author.metadata?.name || author.title}
            </h3>
            
            {author.metadata?.specialty_cuisine && (
              <p className="text-primary-600 font-medium mb-2">
                {author.metadata.specialty_cuisine} Cuisine
              </p>
            )}

            {author.metadata?.bio && (
              <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                {author.metadata.bio}
              </p>
            )}

            {/* Social Links */}
            <SocialLinks author={author} size="sm" />
          </div>
        </div>
      </Link>
    </div>
  )
}
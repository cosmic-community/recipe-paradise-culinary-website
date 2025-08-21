import Link from 'next/link'
import { Author } from '@/types'
import SocialLinks from './SocialLinks'

interface AuthorCardProps {
  author: Author
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Chef</h3>
      
      <div className="flex items-start gap-4 mb-4">
        {author.metadata?.profile_photo && (
          <img 
            src={`${author.metadata.profile_photo.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
            alt={author.metadata?.name || author.title}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div>
          <Link 
            href={`/authors/${author.slug}`}
            className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
          >
            {author.metadata?.name || author.title}
          </Link>
          {author.metadata?.specialty_cuisine && (
            <p className="text-sm font-medium text-primary-600">
              {author.metadata.specialty_cuisine} Cuisine
            </p>
          )}
        </div>
      </div>

      {author.metadata?.bio && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {author.metadata.bio}
        </p>
      )}

      <div className="flex items-center justify-between">
        <Link 
          href={`/authors/${author.slug}`}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          View Profile
        </Link>
        <SocialLinks author={author} size="sm" />
      </div>
    </div>
  )
}
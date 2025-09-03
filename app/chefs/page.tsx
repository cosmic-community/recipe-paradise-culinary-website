import { cosmic, hasStatus } from '@/lib/cosmic'
import { Author } from '@/types'
import Link from 'next/link'
import { ChefHat, Globe, Instagram, Twitter, Youtube } from 'lucide-react'

async function getAuthors(): Promise<Author[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'authors' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return response.objects as Author[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching authors:', error)
    throw new Error('Failed to fetch authors')
  }
}

export default async function ChefsPage() {
  const authors = await getAuthors()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ChefHat className="h-16 w-16 text-primary-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Chefs
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the talented culinary artists behind our delicious recipes. Each chef brings their unique background, 
              expertise, and passion for cooking to create extraordinary dishes that inspire home cooks around the world.
            </p>
          </div>
        </div>
      </div>

      {/* Chefs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {authors.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No chefs to display</h3>
            <p className="text-gray-600">Check back soon for chef profiles and their amazing recipes!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authors.map((author) => (
              <div key={author.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Chef Photo */}
                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                  {author.metadata?.profile_photo ? (
                    <img
                      src={`${author.metadata.profile_photo.imgix_url}?w=600&h=450&fit=crop&auto=format,compress`}
                      alt={author.metadata?.name || author.title}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-primary-100 flex items-center justify-center">
                      <ChefHat className="h-16 w-16 text-primary-400" />
                    </div>
                  )}
                </div>

                {/* Chef Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {author.metadata?.name || author.title}
                      </h3>
                      {author.metadata?.specialty_cuisine && (
                        <p className="text-primary-600 font-medium">
                          {author.metadata.specialty_cuisine} Cuisine Specialist
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {author.metadata?.bio && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
                      {author.metadata.bio}
                    </p>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center gap-3 mb-4">
                    {author.metadata?.website && (
                      <a
                        href={author.metadata.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 rounded-full hover:bg-primary-100 hover:text-primary-600 transition-colors"
                        title="Website"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                    {author.metadata?.instagram && (
                      <a
                        href={`https://instagram.com/${author.metadata.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 rounded-full hover:bg-primary-100 hover:text-primary-600 transition-colors"
                        title="Instagram"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                    {author.metadata?.twitter && (
                      <a
                        href={`https://twitter.com/${author.metadata.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 rounded-full hover:bg-primary-100 hover:text-primary-600 transition-colors"
                        title="Twitter"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {author.metadata?.youtube && (
                      <a
                        href={`https://youtube.com/${author.metadata.youtube}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 rounded-full hover:bg-primary-100 hover:text-primary-600 transition-colors"
                        title="YouTube"
                      >
                        <Youtube className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  {/* View Profile Button */}
                  <Link
                    href={`/authors/${author.slug}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                  >
                    View Recipes & Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata() {
  return {
    title: 'Meet Our Chefs | Recipe Paradise',
    description: 'Discover the talented culinary artists behind our delicious recipes. Learn about their backgrounds, specialties, and cooking philosophies.',
  }
}
import { Instagram, Twitter, Youtube, Globe } from 'lucide-react'
import { Author } from '@/types'

interface SocialLinksProps {
  author: Author
  size?: 'sm' | 'md' | 'lg'
}

export default function SocialLinks({ author, size = 'md' }: SocialLinksProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  }

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  }

  const socialLinks = [
    {
      platform: 'Instagram',
      url: author.metadata?.instagram || undefined,
      icon: Instagram,
      color: 'hover:text-pink-600'
    },
    {
      platform: 'Twitter', 
      url: author.metadata?.twitter || undefined,
      icon: Twitter,
      color: 'hover:text-blue-500'
    },
    {
      platform: 'YouTube',
      url: author.metadata?.youtube || undefined,
      icon: Youtube,
      color: 'hover:text-red-600'
    },
    {
      platform: 'Website',
      url: author.metadata?.website || undefined,
      icon: Globe,
      color: 'hover:text-green-600'
    }
  ].filter(link => link.url) // Only show links that have URLs

  if (socialLinks.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      {socialLinks.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-gray-400 ${link.color} transition-colors ${buttonSizeClasses[size]} rounded-full hover:bg-gray-100`}
          aria-label={`Follow on ${link.platform}`}
        >
          <link.icon className={sizeClasses[size]} />
        </a>
      ))}
    </div>
  )
}
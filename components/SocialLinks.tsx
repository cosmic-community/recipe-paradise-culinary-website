import { Author } from '@/types'
import { Instagram, Twitter, Youtube, Globe } from 'lucide-react'

interface SocialLinksProps {
  author: Author
  size?: 'sm' | 'md' | 'lg'
}

export default function SocialLinks({ author, size = 'md' }: SocialLinksProps) {
  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
  const containerClass = size === 'sm' ? 'gap-2' : 'gap-3'

  const socialLinks = [
    {
      url: author.metadata?.instagram,
      icon: Instagram,
      label: 'Instagram'
    },
    {
      url: author.metadata?.twitter,
      icon: Twitter,
      label: 'Twitter/X'
    },
    {
      url: author.metadata?.youtube,
      icon: Youtube,
      label: 'YouTube'
    },
    {
      url: author.metadata?.website,
      icon: Globe,
      label: 'Website'
    }
  ]

  const validLinks = socialLinks.filter(link => link.url && link.url.trim() !== '')

  if (validLinks.length === 0) {
    return null
  }

  return (
    <div className={`flex items-center ${containerClass}`}>
      {validLinks.map((link) => {
        const Icon = link.icon
        return (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-primary-600 transition-colors"
            aria-label={link.label}
          >
            <Icon className={iconSize} />
          </a>
        )
      })}
    </div>
  )
}
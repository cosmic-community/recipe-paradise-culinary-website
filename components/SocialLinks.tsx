import { ExternalLink, Instagram, Twitter, Youtube, Globe } from 'lucide-react'

export interface SocialLinksProps {
  instagram?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  website?: string | null;
}

export default function SocialLinks({ instagram, twitter, youtube, website }: SocialLinksProps) {
  const links = [
    { href: instagram, icon: Instagram, label: 'Instagram', color: 'text-pink-600' },
    { href: twitter, icon: Twitter, label: 'Twitter', color: 'text-blue-500' },
    { href: youtube, icon: Youtube, label: 'YouTube', color: 'text-red-600' },
    { href: website, icon: Globe, label: 'Website', color: 'text-gray-600' },
  ].filter(link => link.href)

  if (links.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      {links.map(({ href, icon: Icon, label, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${color} hover:opacity-70 transition-opacity`}
          aria-label={`Visit ${label}`}
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
      <ExternalLink className="h-4 w-4 text-gray-400" />
    </div>
  )
}
import { cn } from "@/lib/utils"
import { Typography } from "./typography"

interface FooterProps {
  brand: string
  description?: string
  links?: Array<{
    label: string
    href: string
  }>
  socialLinks?: Array<{
    label: string
    href: string
  }>
  copyright?: string
  className?: string
}

export function Footer({ 
  brand, 
  description, 
  links = [], 
  socialLinks = [],
  copyright,
  className 
}: FooterProps) {
  return (
    <footer className={cn("bg-muted/50 py-12", className)}>
      <div className="max-w-6xl mx-auto text-center px-6">
        <Typography variant="h3" className="mb-4">
          {brand}
        </Typography>
        
        {description && (
          <Typography variant="muted" className="mb-6">
            {description}
          </Typography>
        )}
        
        {(links.length > 0 || socialLinks.length > 0) && (
          <div className="flex justify-center space-x-6 mb-6">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            {socialLinks.map((link, index) => (
              <a
                key={`social-${index}`}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
        
        {copyright && (
          <Typography variant="small" className="text-muted-foreground">
            {copyright}
          </Typography>
        )}
      </div>
    </footer>
  )
}

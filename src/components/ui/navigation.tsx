import { cn } from "@/lib/utils"
import { Button } from "./button"

interface NavigationProps {
  brand: string
  brandHref?: string
  links?: Array<{
    label: string
    href: string
  }>
  actions?: Array<{
    label: string
    href?: string
    onClick?: () => void
    variant?: "default" | "outline" | "ghost"
  }>
  className?: string
}

export function Navigation({ 
  brand, 
  brandHref = "/", 
  links = [], 
  actions = [],
  className 
}: NavigationProps) {
  return (
    <nav className={cn("flex justify-between items-center p-6", className)}>
      <div className="text-2xl font-bold">
        {brandHref ? (
          <a href={brandHref} className="hover:opacity-80 transition-opacity">
            {brand}
          </a>
        ) : (
          brand
        )}
      </div>
      
      {links.length > 0 && (
        <div className="hidden md:flex space-x-6">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      
      {actions.length > 0 && (
        <div className="flex items-center space-x-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "default"}
              onClick={action.onClick}
              asChild={!!action.href}
            >
              {action.href ? (
                <a href={action.href}>{action.label}</a>
              ) : (
                action.label
              )}
            </Button>
          ))}
        </div>
      )}
    </nav>
  )
}

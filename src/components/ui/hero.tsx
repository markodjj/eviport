import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Typography } from "./typography"

interface HeroProps {
  title: string
  subtitle?: string
  description: string
  primaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  secondaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

export function Hero({ 
  title, 
  subtitle, 
  description, 
  primaryAction, 
  secondaryAction,
  className 
}: HeroProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center", className)}>
      {subtitle && (
        <Typography variant="lead" className="mb-4">
          {subtitle}
        </Typography>
      )}
      
      <Typography variant="h1" className="mb-6">
        {title}
      </Typography>
      
      <Typography variant="p" className="mb-8 max-w-3xl text-lg">
        {description}
      </Typography>
      
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-4">
          {primaryAction && (
            <Button 
              size="lg" 
              className="text-lg font-semibold px-8 py-4"
              onClick={primaryAction.onClick}
              asChild={!!primaryAction.href}
            >
              {primaryAction.href ? (
                <a href={primaryAction.href}>{primaryAction.label}</a>
              ) : (
                primaryAction.label
              )}
            </Button>
          )}
          
          {secondaryAction && (
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg font-semibold px-8 py-4"
              onClick={secondaryAction.onClick}
              asChild={!!secondaryAction.href}
            >
              {secondaryAction.href ? (
                <a href={secondaryAction.href}>{secondaryAction.label}</a>
              ) : (
                secondaryAction.label
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

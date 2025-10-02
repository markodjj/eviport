import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"

interface FeatureCardProps {
  icon?: React.ReactNode
  title: string
  description: string
  className?: string
}

export function FeatureCard({ 
  icon, 
  title, 
  description, 
  className 
}: FeatureCardProps) {
  return (
    <Card className={cn("text-center", className)}>
      <CardHeader>
        {icon && (
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            {icon}
          </div>
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

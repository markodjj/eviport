import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg" | "xl"
  background?: "default" | "muted" | "accent" | "blue" | "blueLight"
}

const paddingClasses = {
  none: "",
  sm: "py-8",
  md: "py-16",
  lg: "py-20", 
  xl: "py-24"
}

const backgroundClasses = {
  default: "",
  muted: "bg-muted/50",
  accent: "bg-accent/50",
  blue: "bg-blue-50 dark:bg-blue-900/20",
  blueLight: "bg-blue-100 dark:bg-blue-800/30"
}

export function Section({ 
  children, 
  className, 
  padding = "md",
  background = "default"
}: SectionProps) {
  return (
    <section className={cn(
      paddingClasses[padding],
      backgroundClasses[background],
      className
    )}>
      {children}
    </section>
  )
}

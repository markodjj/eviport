import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import React from "react"

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight",
      h6: "scroll-m-20 text-base font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "p",
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: keyof React.JSX.IntrinsicElements
}

export function Typography({ 
  className, 
  variant, 
  children, 
  ...props 
}: TypographyProps) {
  const elementClass = cn(typographyVariants({ variant, className }))
  
  // Render different elements based on variant
  switch (variant) {
    case "h1":
      return <h1 className={elementClass} {...props}>{children}</h1>
    case "h2":
      return <h2 className={elementClass} {...props}>{children}</h2>
    case "h3":
      return <h3 className={elementClass} {...props}>{children}</h3>
    case "h4":
      return <h4 className={elementClass} {...props}>{children}</h4>
    case "h5":
      return <h5 className={elementClass} {...props}>{children}</h5>
    case "h6":
      return <h6 className={elementClass} {...props}>{children}</h6>
    case "blockquote":
      return <blockquote className={elementClass} {...props}>{children}</blockquote>
    case "code":
      return <code className={elementClass} {...props}>{children}</code>
    default:
      return <p className={elementClass} {...props}>{children}</p>
  }
}

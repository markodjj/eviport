# EviPort UI Kit

A comprehensive component library built on top of shadcn/ui for consistent styling across the entire project.

## 🎨 Components

### Layout Components
- **Container** - Responsive container with size variants
- **Section** - Section wrapper with padding and background options
- **Navigation** - Header navigation with brand, links, and actions
- **Footer** - Footer with brand, links, and social media

### Content Components
- **Typography** - Consistent text styling with semantic variants
- **Hero** - Hero section with title, description, and actions
- **FeatureCard** - Card component for showcasing features

### Base Components (from shadcn/ui)
- **Button** - Interactive button with multiple variants
- **Card** - Content container with header, content, footer
- **Input** - Form input field
- **Badge** - Small status or category indicator
- **Avatar** - User profile image component
- **Separator** - Visual divider between content

## 🚀 Usage

```tsx
import { 
  Navigation, 
  Hero, 
  Section, 
  Container, 
  FeatureCard, 
  Footer,
  Typography,
  Button,
  Card
} from "@/components/ui"

export default function Page() {
  return (
    <div>
      <Navigation
        brand="My App"
        links={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" }
        ]}
        actions={[
          { label: "Sign In", href: "/login" }
        ]}
      />
      
      <Section padding="xl">
        <Container>
          <Hero
            title="Welcome to My App"
            description="A modern web application"
            primaryAction={{
              label: "Get Started",
              href: "/signup"
            }}
          />
        </Container>
      </Section>
    </div>
  )
}
```

## 🎯 Benefits

- **Consistent Design** - All components follow the same design system
- **Type Safety** - Full TypeScript support with proper prop types
- **Accessibility** - Built-in accessibility features
- **Responsive** - Mobile-first responsive design
- **Customizable** - Easy to extend and customize
- **Performance** - Optimized for performance with tree-shaking

## 🔧 Customization

All components accept a `className` prop for additional styling:

```tsx
<Button className="w-full bg-custom-color">
  Custom Button
</Button>
```

## 📱 Responsive Design

Components are built with mobile-first approach and include responsive variants:

- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)
- `xl:` - Extra large screens (1280px+)

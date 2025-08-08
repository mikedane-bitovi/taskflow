# Design System Domain Analysis

## Overview
The design system is built on a foundation of Tailwind CSS utility classes with Radix UI primitives, implementing semantic color tokens, consistent typography, and component variants through class composition.

## Color System

### Semantic Color Tokens
The application uses semantic color naming that maps to CSS custom properties:

```css
/* From app/globals.css pattern */
:root {
  --background: /* light mode background */
  --foreground: /* light mode text */
  --muted-foreground: /* secondary text */
  --primary: /* primary brand color */
  --secondary: /* secondary colors */
  --destructive: /* error/danger colors */
  --border: /* border colors */
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode variants */
  }
}
```

### Color Usage in Components
Colors are applied through Tailwind utility classes:

```tsx
// From components/task-overview.tsx
<p className="text-sm text-muted-foreground">
  Assigned to {task.assignee?.name || "Unassigned"}
</p>

// From components/sidebar.tsx
className={cn(
  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
  pathname === item.href && "bg-background text-primary",
)}
```

### Component Color Variants
Components implement color variants through standardized mappings:

```tsx
// From components/task-overview.tsx
const priorityVariant: Record<string, "default" | "secondary" | "destructive"> = {
  Low: "secondary",
  Medium: "default",
  High: "destructive",
}

<Badge variant={priorityVariant[task.priority || "Medium"]}>{task.priority}</Badge>
```

## Typography System

### Font Integration
Custom fonts are integrated through Next.js font optimization:

```tsx
// From lib/fonts.ts
import { Poppins } from "next/font/google"

export const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"]
})
```

### Font Usage in Components
Fonts are applied selectively to components:

```tsx
// From components/kanban-board.tsx
import { poppins } from "@/lib/fonts"

// Applied in component render
className={`${poppins.className} text-lg font-semibold`}
```

### Typography Hierarchy
Typography follows consistent size and weight patterns:

```tsx
// Heading styles
<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
<CardTitle className="text-sm font-medium">Total Tasks</CardTitle>

// Body text styles
<p className="text-sm font-medium leading-none">{task.name}</p>
<p className="text-xs text-muted-foreground">All tasks in the system</p>
```

## Spacing and Layout

### Consistent Spacing Scale
The application uses Tailwind's spacing scale consistently:

```tsx
// From components/sidebar.tsx
<div className="space-y-4 py-4">
  <div className="px-3 py-2">
    <div className="flex items-center mb-6">
      <div className="space-y-1">
```

### Layout Patterns
Common layout patterns are implemented through utility classes:

```tsx
// Flex layouts
<div className="flex items-center justify-between">
<div className="flex items-center space-x-1">

// Grid layouts  
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
```

## Component Variants

### Class Variance Authority
Components use class-variance-authority for variant management:

```tsx
// From components/ui/button.tsx pattern (inferred)
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## Design Tokens

### Border Radius
Consistent border radius application:

```tsx
// Cards and containers
<Card className="..."> // Uses rounded-lg by default
<Avatar className="... rounded-full">
<Button className="... rounded-md">
```

### Shadows and Elevation
Subtle elevation through Tailwind shadows:

```tsx
// From analytics page
<div className="bg-card-background p-6 rounded-lg shadow border">
```

## Responsive Design

### Breakpoint Usage
Responsive design through Tailwind breakpoint prefixes:

```tsx
// From dashboard layout
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
<div className="col-span-4 lg:col-span-3">
```

### Mobile-First Approach
Styles are applied mobile-first with progressive enhancement:

```tsx
// Base styles apply to mobile, then enhanced for larger screens
<div className="space-y-4 p-4 md:p-8 pt-6">
```

## Icon System

### Lucide React Integration
Consistent icon usage through Lucide React:

```tsx
// From components/sidebar.tsx
import { LayoutDashboard, CheckSquare, Kanban, Users, Settings, BarChart3 } from "lucide-react"

// Icon sizing consistency
<CheckSquare className="h-6 w-6 mr-2 text-primary" />
<Icon className="h-4 w-4" />
```

## Accessibility Integration

### Focus States
Focus management through Tailwind utilities:

```tsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

### Color Contrast
Semantic colors ensure proper contrast ratios:
- `text-muted-foreground` for secondary text
- `text-destructive` for error states
- `bg-background` and `text-foreground` for primary content

## Animation and Transitions

### Transition Classes
Subtle transitions for interactive elements:

```tsx
// From sidebar navigation
className="transition-all hover:text-primary"

// From charts
<Tooltip
  cursor={{ fill: "transparent" }}
  contentStyle={{
    backgroundColor: "#072427",
    borderColor: "hsl(var(--border))",
  }}
/>
```

This design system domain provides a cohesive visual language through semantic tokens, consistent spacing, and component variants while maintaining accessibility and responsive design principles.

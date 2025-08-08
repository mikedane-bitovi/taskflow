# UI Domain Analysis

## Overview
The UI domain follows a strict component composition pattern built on Radix UI primitives with Tailwind CSS for styling. Components are organized into two distinct layers: business logic components and reusable UI primitives.

## Component Architecture

### Component Structure
The project uses a two-tier component organization:

1. **Business Logic Components** (`/components/*.tsx`) - Domain-specific components
2. **UI Primitives** (`/components/ui/*.tsx`) - Reusable, generic components

### Radix UI Foundation
All interactive components are built on Radix UI primitives:

```tsx
// Example from components/ui/avatar.tsx
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
```

### Styling Patterns

#### Utility Function for Classes
All components use the `cn()` utility function for conditional class application:

```tsx
// From lib/utils.ts
export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(" ");
}
```

#### Component Styling Example
```tsx
// From components/ui/button.tsx pattern
className={cn(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  className
)}
```

### Icon System
Consistent use of Lucide React for all icons:

```tsx
// Example from components/sidebar.tsx
import { LayoutDashboard, CheckSquare, Kanban, Users, Settings, BarChart3 } from "lucide-react"
```

## Design System Implementation

### Color System
The application uses semantic color naming with CSS custom properties:
- `text-primary` - Primary text color
- `text-muted-foreground` - Secondary text
- `bg-background` - Primary background
- `border` - Border colors

### Typography
Custom font integration through Next.js font optimization:

```tsx
// From lib/fonts.ts
import { Poppins } from "next/font/google"

export const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"]
})
```

### Component Variants
Components support variants through class composition:

```tsx
// From components/ui/badge.tsx pattern
const priorityVariant: Record<string, "default" | "secondary" | "destructive"> = {
  Low: "secondary",
  Medium: "default", 
  High: "destructive",
}
```

## Client-Side Patterns

### Client Component Directive
Components that need interactivity use the "use client" directive:

```tsx
"use client"

import { useState, useTransition } from "react"
```

### State Management in UI
UI components use React hooks for local state:

```tsx
// From components/kanban-board.tsx
const [columns, setColumns] = useState(initialData)
const [isPending, startTransition] = useTransition()
```

## Accessibility Patterns
All components inherit accessibility from Radix UI primitives, ensuring:
- Proper ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader compatibility

## Animation and Transitions
UI components include subtle transitions using Tailwind CSS transition utilities:

```tsx
className="transition-all hover:text-primary"
```

This domain enforces consistency through Radix UI primitives, centralized styling utilities, and semantic design tokens.

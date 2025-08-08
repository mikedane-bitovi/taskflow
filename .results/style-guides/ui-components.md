# UI Components Style Guide

## Unique Conventions

### Radix UI Foundation Pattern
All UI components are built as wrappers around Radix UI primitives with forwardRef:

```tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

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
Avatar.displayName = AvatarPrimitive.Root.displayName
```

### Class Utility Integration
All components use the `cn()` utility for class composition:

```tsx
import { cn } from "@/lib/utils"

className={cn(
  "base-classes-here",
  className  // Allow className override
)}
```

### Component Export Pattern
Components are exported with displayName for debugging:

```tsx
Avatar.displayName = AvatarPrimitive.Root.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

### Custom Component Extensions
Some components include custom extensions beyond Radix primitives:

```tsx
// Custom AvatarName component for name-based avatars
const AvatarName = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
    name: string;
  }
>(({ className, name, ...props }, ref) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium",
        className
      )}
      {...props}
    >
      {initials}
    </AvatarPrimitive.Fallback>
  );
});
AvatarName.displayName = "AvatarName";
```

### Accessibility Preservation
Components maintain Radix UI accessibility features without modification:
- Proper ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader compatibility

### Styling Base Classes
Components include comprehensive base styling:

```tsx
className={cn(
  // Comprehensive base classes for layout, typography, interaction states
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  className
)}
```

### Variant Support
Components are designed to support variants through className composition:

```tsx
// Base component provides foundation, variants applied through className
<Button className="variant-specific-classes" />
<Badge variant="destructive" />
```

### Consistent Sizing
Components use consistent sizing patterns:
- Icons: `h-4 w-4` for standard, `h-6 w-6` for larger
- Avatars: `h-9 w-9` for cards, `h-8 w-8` for dropdowns
- Buttons: Standard height `h-10`, icon buttons `h-10 w-10`

### TypeScript Integration
Components use TypeScript with Radix primitive types:

```tsx
React.ComponentPropsWithoutRef<typeof RadixPrimitive.Component>
React.ElementRef<typeof RadixPrimitive.Component>
```

### Design Token Integration
Components use semantic design tokens through Tailwind:
- `bg-background` / `text-foreground` for theming
- `text-muted-foreground` for secondary text  
- `border` for consistent borders
- `ring-ring` for focus states

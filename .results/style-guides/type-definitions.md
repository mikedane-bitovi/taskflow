# Type Definitions Style Guide

## Unique Conventions

### Prisma Integration Pattern
Type definitions extend Prisma-generated types rather than defining custom interfaces:

```tsx
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

// Extension pattern for additional properties
type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};
```

### Kanban-Specific Types
Domain-specific types use literal unions for type safety:

```tsx
export type KanbanColumn = {
  id: "todo" | "in_progress" | "review" | "done"
  title: string
  tasks: TaskWithProfile[]
}

export type KanbanData = {
  [key in "todo" | "in_progress" | "review" | "done"]: KanbanColumn
}
```

### Type Extension Strategy
Types extend base Prisma types with additional computed or related properties:

```tsx
// Picking specific fields from related models
type Task = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};
```

### Utility Type Usage
Types leverage TypeScript utility types for specific data shapes:

```tsx
// Using Pick to select specific fields
assignee?: Pick<User, "name"> | null;
```

### Import Organization
Type imports are organized with specific patterns:

```tsx
// Prisma types first
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

// Custom type definitions follow
type CustomType = PrismaTask & {
  // extensions
};
```

### Literal Union Types
Status and enum-like values use literal unions:

```tsx
// Instead of generic strings, use specific literals
type Status = "todo" | "in_progress" | "review" | "done"
type Priority = "low" | "medium" | "high"
```

### Conditional Nullability
Types handle nullable relationships explicitly:

```tsx
// Explicit null handling for optional relationships
assignee?: Pick<User, "name"> | null;
```

### Named Export Pattern
Types use named exports for better tree-shaking:

```tsx
export type KanbanColumn = {
  // definition
}

export type KanbanData = {
  // definition  
}
```

### File Organization
Type definitions are centralized in `/lib/types.ts` for shared types, with feature-specific types defined inline when needed.

### Naming Conventions
- Base Prisma types: Use `as` aliasing (`Task as PrismaTask`)
- Extended types: Descriptive names indicating purpose (`TaskWithProfile`)
- Domain types: Feature-specific naming (`KanbanColumn`, `KanbanData`)

### Generic Avoidance
Types avoid complex generics in favor of explicit, concrete type definitions for better readability and maintainability.

# React Components Style Guide

## Unique Conventions

### Business Logic Component Structure
Components are organized as feature-specific modules with consistent patterns:

```tsx
// Import pattern - UI components first, then business logic
import { Avatar, AvatarName } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Type definitions with Prisma integration
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type Task = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};
```

### Client Component Directive Usage
Client components use explicit "use client" directive with specific import ordering:

```tsx
"use client"

// React hooks after directive
import { useState, useTransition } from "react"
// External libraries
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
// Internal UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
```

### Props Interface Pattern
Components use destructured props with type annotations:

```tsx
export function TaskOverview({ tasks }: { tasks: Task[] | null }) {
  // Implementation
}

export function KanbanBoard({ initialData }: { initialData: KanbanData }) {
  // Implementation  
}
```

### Conditional Rendering Convention
Null checks use specific pattern with fallback messages:

```tsx
{tasks && tasks.length > 0 ? (
  tasks.map((task) => (
    // Task rendering
  ))
) : (
  <p className="text-sm text-muted-foreground">No recent tasks.</p>
)}
```

### Server Action Integration
Components integrate with Server Actions using useTransition:

```tsx
const [isPending, startTransition] = useTransition()

// Server action with optimistic updates
startTransition(async () => {
  await updateTaskStatus(draggableId, finishColId)
})
```

### State Management Pattern
Local state follows specific hook usage patterns:

```tsx
const [columns, setColumns] = useState(initialData)
const [isPending, startTransition] = useTransition()
const [optimisticTasks, addOptimisticTask] = useOptimistic(
  initialTasks,
  (state, updatedTask: TaskWithProfile) => {
    return state.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    )
  }
)
```

### Icon Integration Pattern
Icons use Lucide React with consistent sizing:

```tsx
import { Plus, Clock, Edit, Trash2 } from "lucide-react"

// Standard icon sizing
<Clock className="h-4 w-4" />
<CheckSquare className="h-6 w-6 mr-2 text-primary" />
```

### Variant Mapping Convention
Components use object mapping for variants:

```tsx
const priorityVariant: Record<string, "default" | "secondary" | "destructive"> = {
  Low: "secondary",
  Medium: "default",
  High: "destructive",
}

<Badge variant={priorityVariant[task.priority || "Medium"]}>{task.priority}</Badge>
```

### Component Composition Pattern
Components compose UI primitives with business logic:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Component Title</CardTitle>
    <CardDescription>Component description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Business logic rendering */}
  </CardContent>
</Card>
```

### Data Transformation Pattern
Components handle data transformation locally:

```tsx
// Helper functions within components
const getInitials = (name: string | null | undefined) => {
  if (!name) return "??"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}
```

### Loading State Integration
Components integrate loading states with disabled UI elements:

```tsx
<Button variant="ghost" size="icon" className="h-8 w-8" disabled={isPending}>
  <MoreHorizontal className="h-4 w-4" />
</Button>
```

# React Pages Style Guide

## Unique Conventions

### Next.js App Router Structure
Pages follow strict Next.js App Router conventions with specific organizational patterns unique to this project:

```tsx
// app/(dashboard)/page.tsx - Dashboard route group pattern
export default async function IndexPage() {
  // Server Component by default with async data fetching
}

// app/login/page.tsx - Authentication pages outside route groups
export default function LoginPage() {
  // Client components for form interaction
}
```

### Server Component First Architecture
All pages are Server Components by default, with explicit client directive only when needed:

```tsx
// Server Component pattern (default)
export default async function TasksPage() {
    const { tasks, error } = await getAllTasks();
    // Direct database access in page components
}

// Client Component pattern (explicit)
"use client"
export default function LoginPage() {
    // Interactive form handling
}
```

### Authentication Integration Pattern
Dashboard pages include authentication checks through layout hierarchy rather than individual page guards:

```tsx
// Pages rely on layout authentication - no individual auth checks
export default async function AnalyticsPage() {
    // Assumes user is authenticated via (dashboard) layout
}
```

### Parallel Data Fetching Pattern
Complex pages use Promise.all for efficient data fetching:

```tsx
const [
    totalTasks,
    completedTasks,
    openTasks,
    totalUsers,
    recentTasks
] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { status: "done" } }),
    prisma.task.count({ where: { status: "in_progress" } }),
    prisma.user.count(),
    prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { assignee: true, creator: true },
    }),
]);
```

### Error Handling Convention
Page-level error handling follows a consistent pattern:

```tsx
const { tasks, error } = await getAllTasks();
if (error) {
    console.error("Error fetching data:", error)
    return <p className="p-8">Could not load data. Please try again later.</p>
}
```

### Layout Structure Pattern
All dashboard pages follow a consistent layout structure:

```tsx
<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
    <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Page Title</h2>
        {/* Optional action buttons */}
    </div>
    
    {/* Page content */}
</div>
```

### Suspense Integration
Pages use React Suspense for loading states:

```tsx
<Suspense fallback={<div>Loading tasks...</div>}>
    <TaskList initialTasks={tasks || []} />
</Suspense>
```

### Export Conventions
Page exports follow Next.js conventions with specific revalidation settings:

```tsx
export const revalidate = 0  // For dynamic data pages

export default async function PageName() {
    // Implementation
}
```

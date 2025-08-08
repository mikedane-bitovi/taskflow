# Routing Domain Analysis

## Overview
The routing domain uses Next.js App Router with file-based routing, organized around a protected dashboard structure with nested layouts for authentication flow.

## App Router Structure

### File-Based Routing
The application follows Next.js App Router conventions:

```
app/
├── layout.tsx              # Root layout
├── login/
│   ├── page.tsx            # Login page  
│   └── actions.ts          # Authentication actions
├── signup/
│   ├── page.tsx            # Signup page
│   └── actions.ts          # Signup actions
└── (dashboard)/            # Route group
    ├── layout.tsx          # Dashboard layout with auth guard
    ├── page.tsx            # Dashboard home
    ├── tasks/
    │   ├── page.tsx        # Tasks listing
    │   ├── new/
    │   │   └── page.tsx    # New task form
    │   └── actions.ts      # Task-related actions
    ├── board/
    │   └── page.tsx        # Kanban board
    ├── team/
    │   └── page.tsx        # Team management
    └── analytics/
        └── page.tsx        # Analytics dashboard
```

### Route Groups
Protected routes are organized under the `(dashboard)` route group:

```tsx
// app/(dashboard)/layout.tsx
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">{children}</main>
        </div>
    );
}
```

## Authentication Flow

### Layout-Based Auth Guard
The dashboard layout enforces authentication:

```tsx
// From app/(dashboard)/layout.tsx
const user = await getCurrentUser();
if (!user) redirect("/login");
```

### Navigation Guard
The sidebar component handles route-aware navigation:

```tsx
// From components/sidebar.tsx
const pathname = usePathname()

return (
  <Link
    key={item.href}
    href={item.href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
      pathname === item.href && "bg-background text-primary",
    )}
  >
```

### Redirect Patterns
Authentication redirects use Next.js `redirect()` function:

```tsx
import { redirect } from "next/navigation";

if (!user) redirect("/login");
```

## Server Components Pattern

### Default Server Components
All pages are Server Components by default:

```tsx
// app/(dashboard)/page.tsx
export default async function IndexPage() {
  const prisma = new PrismaClient();
  // Server-side data fetching
  const [totalTasks, completedTasks, openTasks, totalUsers, recentTasks] = await Promise.all([
    // Database queries
  ]);
}
```

### Client Component Usage
Client components are explicitly marked and used only when needed:

```tsx
// components/kanban-board.tsx
"use client"

import { useState, useTransition } from "react"
```

## Navigation Structure

### Sidebar Navigation
Navigation is centralized in the sidebar component:

```tsx
// From components/sidebar.tsx
const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks", 
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Board",
    href: "/board", 
    icon: Kanban,
  },
  {
    title: "Team",
    href: "/team",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
]
```

### Active Route Indication
The sidebar shows active routes using pathname comparison:

```tsx
pathname === item.href && "bg-background text-primary"
```

## Page Organization Patterns

### Nested Layouts
The application uses nested layouts for different sections:

1. **Root Layout** (`app/layout.tsx`) - Global styles and metadata
2. **Dashboard Layout** (`app/(dashboard)/layout.tsx`) - Authentication + sidebar

### Parallel Route Organization
Tasks feature demonstrates nested route organization:
- `/tasks` - Task listing
- `/tasks/new` - New task creation form
- Task actions are co-located in the same directory

## Data Fetching Patterns

### Server-Side Data Fetching
Pages fetch data on the server using async functions:

```tsx
export default async function TasksPage() {
    const { tasks, error } = await getAllTasks();
    // Render with server data
}
```

### Revalidation
Server Actions trigger revalidation when data changes:

```tsx
// From app/(dashboard)/tasks/actions.ts
revalidatePath("/tasks");
```

This routing domain enforces a clear separation between public and protected routes, server-first data fetching, and consistent navigation patterns.

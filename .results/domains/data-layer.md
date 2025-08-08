# Data Layer Domain Analysis

## Overview
The data layer is built entirely on Prisma ORM with SQLite database, using Next.js Server Actions for mutations and type-safe database operations throughout.

## Database Architecture

### Prisma Schema
The database schema defines the core entities:

```prisma
// From prisma/schema.prisma
model User {
  id            Int @id @default(autoincrement())
  email         String @unique
  password      String
  name          String
  sessions      Session[]
  createdTasks  Task[] @relation("CreatedTasks")
  assignedTasks Task[] @relation("AssignedTasks")
}

model Session {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}

model Task {
  id          Int      @id @default(autoincrement())
  name        String
  description String
  priority    String
  status      String
  dueDate     DateTime?
  assigneeId  Int?
  assignee    User?    @relation("AssignedTasks", fields: [assigneeId], references: [id])
  creatorId   Int
  creator     User     @relation("CreatedTasks", fields: [creatorId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Generated Client Configuration
Prisma client is generated to a custom location:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"
}
```

## Server Actions Pattern

### Data Mutations
All data modifications use Next.js Server Actions:

```tsx
// From app/(dashboard)/tasks/actions.ts
"use server";

import { getCurrentUser } from "@/app/login/actions";
import { PrismaClient } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createTask(formData: FormData) {
    const name = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const status = formData.get("status") as string;
    const dueDate = formData.get("dueDate") as string;
    const assigneeIdRaw = formData.get("assigneeId") as string;
    const assigneeId = assigneeIdRaw ? parseInt(assigneeIdRaw, 10) : null;

    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated.", success: false, message: "Not authenticated." };

    const creatorId = user.id;

    if (!name) return { error: "Title is required.", success: false, message: "Title is required." };

    try {
        await prisma.task.create({
            data: {
                name,
                description,
                priority,
                status,
                dueDate: dueDate ? parseDateString(dueDate) : null,
                assigneeId,
                creatorId,
            },
        });

        revalidatePath("/tasks");
        return { success: true, message: "Task created successfully." };
    } catch (error) {
        console.error("Error creating task:", error);
        return { error: "Failed to create task.", success: false, message: "Failed to create task." };
    }
}
```

### Query Patterns
Data fetching uses Prisma queries in Server Components:

```tsx
// From app/(dashboard)/page.tsx
export default async function IndexPage() {
  const prisma = new PrismaClient();

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
      include: {
        assignee: true,
        creator: true,
      },
    }),
  ]);
}
```

## Type Safety

### Generated Types
All database operations use Prisma-generated types:

```tsx
// From lib/types.ts
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};
```

### Type Extensions
Domain types extend Prisma types for specific use cases:

```tsx
// From components/task-overview.tsx
type Task = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};
```

## Authentication Integration

### User Context in Data Operations
Server Actions include authentication checks:

```tsx
const user = await getCurrentUser();
if (!user) return { error: "Not authenticated." };
```

### Session Management
Authentication uses database-stored sessions:

```tsx
// From app/login/actions.ts
const sessionToken = randomBytes(32).toString("hex");
await prisma.session.create({
    data: {
        token: sessionToken,
        userId: user.id,
    },
});
```

## Error Handling

### Consistent Error Patterns
Database operations include standardized error handling:

```tsx
try {
    // Database operation
    return { success: true, message: "Operation successful." };
} catch (error) {
    console.error("Error:", error);
    return { error: "Operation failed.", success: false, message: "Operation failed." };
}
```

## Data Validation

### Server-Side Validation
Form data is validated in Server Actions:

```tsx
const name = formData.get("title") as string;
if (!name) return { error: "Title is required.", success: false, message: "Title is required." };
```

## Database Utilities

### Date Handling
Custom date utilities for consistent date handling:

```tsx
// From lib/date-utils.ts
export function parseDateString(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day, 12, 0, 0) // month is 0-indexed, set to noon
}
```

## Revalidation Strategy

### Cache Invalidation
Server Actions trigger revalidation for affected routes:

```tsx
revalidatePath("/tasks");
revalidatePath("/board");
```

This data layer domain ensures type safety, consistent error handling, and server-first data operations while maintaining authentication context throughout all database interactions.

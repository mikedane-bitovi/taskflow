# State Management Domain Analysis

## Overview
The state management domain follows a server-first approach using React hooks for client state, Server Actions for server state mutations, and optimistic updates for immediate UI feedback.

## Client-Side State Management

### React Hooks Pattern
Components use standard React hooks for local state:

```tsx
// From components/kanban-board.tsx
"use client"

export function KanbanBoard({ initialData }: { initialData: KanbanData }) {
  const [columns, setColumns] = useState(initialData)
  const [isPending, startTransition] = useTransition()

  const onDragEnd = (result: DropResult) => {
    // Optimistic UI update
    if (startColId === finishColId) {
      startTasks.splice(destination.index, 0, movedTask)
      const newCol = { ...startCol, tasks: startTasks }
      setColumns({ ...columns, [startColId]: newCol })
    } else {
      const finishTasks = Array.from(finishCol.tasks)
      finishTasks.splice(destination.index, 0, movedTask)
      
      setColumns({
        ...columns,
        [startColId]: { ...startCol, tasks: startTasks },
        [finishColId]: { ...finishCol, tasks: finishTasks }
      })
    }

    // Server sync with transition
    startTransition(async () => {
      await updateTaskStatus(draggableId, finishColId)
    })
  }
}
```

### Form State Management
Forms use controlled components with local state:

```tsx
// From app/login/page.tsx
export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [state, formAction] = useActionState(loginAction, initialState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
    };
}
```

## Server State Management

### Server Actions for Mutations
All data mutations use Next.js Server Actions:

```tsx
// From app/(dashboard)/tasks/actions.ts
"use server";

export async function createTask(formData: FormData) {
    const name = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const status = formData.get("status") as string;
    const dueDate = formData.get("dueDate") as string;
    const assigneeIdRaw = formData.get("assigneeId") as string;
    const assigneeId = assigneeIdRaw ? parseInt(assigneeIdRaw, 10) : null;

    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated." };

    try {
        await prisma.task.create({
            data: {
                name,
                description,
                priority,
                status,
                dueDate: dueDate ? parseDateString(dueDate) : null,
                assigneeId,
                creatorId: user.id,
            },
        });

        revalidatePath("/tasks");
        return { success: true, message: "Task created successfully." };
    } catch (error) {
        return { error: "Failed to create task." };
    }
}
```

### Server-Side Data Fetching
Pages fetch data on the server and pass as props:

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
      include: { assignee: true, creator: true },
    }),
  ]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <TaskOverview tasks={recentTasks} />
    </div>
  );
}
```

## Optimistic Updates

### useOptimistic Hook Usage
Components use optimistic updates for immediate feedback:

```tsx
// From components/task-list.tsx
"use client"

export function TaskList({ initialTasks }: { initialTasks: TaskWithProfile[]; }) {
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    initialTasks,
    (state, updatedTask: TaskWithProfile) => {
      return state.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    }
  )

  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (taskId: number, newStatus: string) => {
    const task = optimisticTasks.find(t => t.id === taskId)
    if (task) {
      // Optimistic update
      addOptimisticTask({ ...task, status: newStatus })
      
      // Server sync
      startTransition(async () => {
        await updateTaskStatus(taskId, newStatus)
      })
    }
  }
}
```

### useTransition for Loading States
Transitions provide loading states during server operations:

```tsx
const [isPending, startTransition] = useTransition()

// Usage in UI
<Button variant="ghost" size="icon" className="h-8 w-8" disabled={isPending}>
  <MoreHorizontal className="h-4 w-4" />
</Button>
```

## Form State Patterns

### useActionState Hook
Forms use `useActionState` for server action integration:

```tsx
// From app/login/page.tsx
const [state, formAction] = useActionState(loginAction, initialState);

async function loginAction(state: any, formData: FormData) {
    const result = await login(formData);
    if (result.success) {
        redirect("/");
    }
    return { error: result.error || "Login failed" };
}
```

### FormData Handling
Server Actions receive form data as FormData objects:

```tsx
export async function createTask(formData: FormData) {
    const name = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    // ... other fields
}
```

## Cache Management

### Revalidation Strategy
Server Actions trigger cache revalidation:

```tsx
// After successful mutation
revalidatePath("/tasks");
revalidatePath("/board");
revalidatePath("/");
```

### Client-Side Cache Updates
No client-side cache management - relies on server revalidation:

```tsx
// No React Query, SWR, or similar caching libraries
// State is always fetched fresh from server on navigation
```

## Data Flow Patterns

### Server-to-Client Data Flow
1. Server Components fetch data from database
2. Data is passed as props to Client Components
3. Client Components manage local UI state
4. User actions trigger Server Actions
5. Server Actions update database and revalidate cache

### Client State Synchronization
Client state is synchronized with server through:
- Optimistic updates for immediate feedback
- Server Actions for persistence
- Path revalidation for cache invalidation

## Error State Management

### Server Action Error Handling
Server Actions return standardized error objects:

```tsx
try {
    // Operation
    return { success: true, message: "Success" };
} catch (error) {
    return { error: "Operation failed", success: false };
}
```

### Client Error Display
Client components handle error states from server actions:

```tsx
{state.error && (
    <div className="text-red-500 text-sm text-center">{state.error}</div>
)}
```

This state management domain emphasizes server-first state with optimistic client updates, avoiding complex client-side state management libraries in favor of React's built-in primitives and Next.js Server Actions.

# Drag and Drop Domain Analysis

## Overview
The drag and drop domain is implemented exclusively using @hello-pangea/dnd library, providing Kanban board functionality with optimistic updates and server synchronization for task status changes.

## Library Implementation

### @hello-pangea/dnd Integration
All drag and drop functionality uses @hello-pangea/dnd:

```tsx
// From components/kanban-board.tsx
"use client"

import { useState, useTransition } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

export function KanbanBoard({ initialData }: { initialData: KanbanData }) {
  const [columns, setColumns] = useState(initialData)
  const [isPending, startTransition] = useTransition()

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result

    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    // Handle drag operation
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.values(columns).map((column) => (
          <div key={column.id} className="flex flex-col">
            <h3 className="font-semibold text-lg mb-4 px-3">{column.title}</h3>
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "flex-1 space-y-3 p-3 rounded-lg min-h-[400px] transition-colors",
                    snapshot.isDraggingOver ? "bg-muted/50" : "bg-muted/20"
                  )}
                >
                  {/* Draggable items */}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
```

## Kanban Board Structure

### Column Organization
Kanban columns are organized with predefined status types:

```tsx
// From app/(dashboard)/board/page.tsx
const initialColumns: KanbanData = {
    todo: { id: "todo", title: "To Do", tasks: [] },
    in_progress: { id: "in_progress", title: "In Progress", tasks: [] },
    review: { id: "review", title: "Review", tasks: [] },
    done: { id: "done", title: "Done", tasks: [] },
}

// Tasks are distributed to columns based on status
tasks?.forEach((task) => {
    if (task.status && task.status in initialColumns) {
        initialColumns[task.status as keyof KanbanData].tasks.push(task)
    }
})
```

### Data Structure
Kanban data follows a specific type structure:

```tsx
// From lib/types.ts
export type KanbanColumn = {
  id: "todo" | "in_progress" | "review" | "done"
  title: string
  tasks: TaskWithProfile[]
}

export type KanbanData = {
  [key in "todo" | "in_progress" | "review" | "done"]: KanbanColumn
}
```

## Drag Operation Handling

### Optimistic Updates
Drag operations immediately update the UI optimistically:

```tsx
const onDragEnd = (result: DropResult) => {
  const { source, destination, draggableId } = result

  if (!destination) return
  if (source.droppableId === destination.droppableId && source.index === destination.index) return

  const startColId = source.droppableId as keyof KanbanData
  const finishColId = destination.droppableId as keyof KanbanData

  const startCol = columns[startColId]
  const finishCol = columns[finishColId]

  const startTasks = Array.from(startCol.tasks)
  const [movedTask] = startTasks.splice(source.index, 1)

  // Same column reorder
  if (startColId === finishColId) {
    startTasks.splice(destination.index, 0, movedTask)
    const newCol = { ...startCol, tasks: startTasks }
    setColumns({ ...columns, [startColId]: newCol })
  } else {
    // Cross-column move
    const finishTasks = Array.from(finishCol.tasks)
    finishTasks.splice(destination.index, 0, movedTask)
    
    setColumns({
      ...columns,
      [startColId]: { ...startCol, tasks: startTasks },
      [finishColId]: { ...finishCol, tasks: finishTasks }
    })
  }

  // Server synchronization
  startTransition(async () => {
    await updateTaskStatus(draggableId, finishColId)
  })
}
```

## Draggable Task Cards

### Task Card Implementation
Each task is rendered as a draggable card:

```tsx
// From components/kanban-board.tsx
{column.tasks.map((task, index) => (
  <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
    {(provided, snapshot) => (
      <Card
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={cn(
          "cursor-move transition-shadow",
          snapshot.isDragging ? "shadow-lg rotate-2" : "shadow-sm"
        )}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-sm leading-5">{task.name}</h4>
              <Badge
                variant={
                  task.priority === "High"
                    ? "destructive"
                    : task.priority === "Medium"
                    ? "default"
                    : "secondary"
                }
                className="ml-2"
              >
                {task.priority}
              </Badge>
            </div>

            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarName name={task.assignee?.name || "Unassigned"} />
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {task.assignee?.name || "Unassigned"}
                </span>
              </div>

              {task.dueDate && (
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">
                    {formatDateForDisplay(task.dueDate)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )}
  </Draggable>
))}
```

## Visual Feedback

### Drag State Styling
Visual feedback during drag operations:

```tsx
// Column highlighting during drag over
className={cn(
  "flex-1 space-y-3 p-3 rounded-lg min-h-[400px] transition-colors",
  snapshot.isDraggingOver ? "bg-muted/50" : "bg-muted/20"
)}

// Card styling during drag
className={cn(
  "cursor-move transition-shadow",
  snapshot.isDragging ? "shadow-lg rotate-2" : "shadow-sm"
)}
```

### Loading States
Loading states during server synchronization:

```tsx
const [isPending, startTransition] = useTransition()

// Visual indication of pending server update
// (Typically shown through disabled states or loading spinners)
```

## Server Synchronization

### Status Update Action
Drag operations sync to server via Server Actions:

```tsx
// From app/(dashboard)/tasks/actions.ts
export async function updateTaskStatus(taskId: string, newStatus: string) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated." };

    try {
        await prisma.task.update({
            where: { id: parseInt(taskId) },
            data: { status: newStatus },
        });

        revalidatePath("/board");
        revalidatePath("/tasks");
        return { success: true };
    } catch (error) {
        console.error("Error updating task status:", error);
        return { error: "Failed to update task status." };
    }
}
```

### Error Handling
If server sync fails, the UI could revert (though this isn't explicitly implemented in the current code):

```tsx
// Potential error handling pattern
startTransition(async () => {
  const result = await updateTaskStatus(draggableId, finishColId)
  if (result.error) {
    // Could revert optimistic update here
    console.error("Failed to update task:", result.error)
  }
})
```

## Integration with Design System

### Consistent Styling
Drag and drop components use the same design system:
- Card components for task containers
- Badge components for priority indicators
- Avatar components for assignee display
- Consistent spacing and typography

### Responsive Behavior
Board layout is responsive:

```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
```

This drag and drop domain provides smooth, visually appealing task management through optimistic updates, consistent visual feedback, and seamless server synchronization while maintaining design system consistency.

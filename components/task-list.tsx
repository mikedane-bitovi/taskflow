"use client"

import { useOptimistic, useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock } from "lucide-react"
import { deleteTask, updateTaskStatus } from "@/app/(dashboard)/tasks/actions"
import { formatDateForDisplay } from "@/lib/date-utils"
import { TaskActions } from "./task-actions"
import { poppins } from "@/lib/fonts"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

export function TaskList({ initialTasks }: { initialTasks: TaskWithProfile[]; }) {
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    initialTasks,
    (state, { action, task }: { action: "delete" | "toggle"; task: TaskWithProfile | { id: number } }) => {
      if (action === "delete") {
        return state.filter((t) => t.id !== task.id)
      }
      if (action === "toggle") {
        return state.map((t) => (t.id === task.id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t))
      }
      return state
    },
  )
  const [isPending, startTransition] = useTransition()

  const handleDelete = async (taskId: number) => {
    startTransition(async () => {
      setOptimisticTasks({ action: "delete", task: { id: taskId } })
      await deleteTask(taskId)
    })
  }

  const handleToggle = async (task: TaskWithProfile) => {
    startTransition(async () => {
      setOptimisticTasks({ action: "toggle", task })
      await updateTaskStatus(task.id, task.status === "done" ? "todo" : "done")
    })
  }

  const getInitials = (name: string | null) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-4">
      {optimisticTasks.map((task) => (
        <Card key={task.id} className={task.status === "done" ? "bg-muted/50" : ""}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <Checkbox
                  checked={task.status === "done"}
                  onCheckedChange={() => handleToggle(task)}
                  className="mt-1 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3
                      className={`font-semibold ${poppins.className} ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.name}
                    </h3>
                    <Badge variant="outline" className="text-xs text-foreground-muted">
                      TASK-{task.id}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-7 w-7 border-2 border-border">
                        <AvatarFallback className="text-xs font-medium">{getInitials(task.assignee?.name || null)}</AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">{task.assignee?.name || "Unassigned"}</span>
                    </div>
                    <Badge className="capitalize">
                      {task.status.replace("_", " ")}
                    </Badge>
                    <Badge className="capitalize">
                      {task.priority}
                    </Badge>

                    {task.dueDate && (
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatDateForDisplay(task.dueDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <TaskActions
                task={task}
                onDelete={handleDelete}
                onToggleStatus={handleToggle}
                showToggleStatus={false} // Already handled by checkbox
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

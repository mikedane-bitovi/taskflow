"use client"

import { useTransition, useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { deleteTask, updateTaskStatus } from "@/app/(dashboard)/tasks/actions"
import { EditTaskForm } from "./edit-task-form"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface TaskActionsProps {
  task: TaskWithProfile;
  onDelete?: (taskId: number) => void;
  onToggleStatus?: (task: TaskWithProfile) => void;
  onEditComplete?: () => void;
  showToggleStatus?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

export function TaskActions({ 
  task, 
  onDelete,
  onToggleStatus,
  onEditComplete,
  showToggleStatus = true,
  showEdit = true,
  showDelete = true
}: TaskActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [openDialog, setOpenDialog] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)

  const handleDelete = async () => {
    startTransition(async () => {
      if (onDelete) {
        onDelete(task.id)
      } else {
        await deleteTask(task.id)
      }
    })
  }

  const handleToggleStatus = async () => {
    startTransition(async () => {
      if (onToggleStatus) {
        onToggleStatus(task)
      } else {
        const newStatus = task.status === "done" ? "todo" : "done"
        await updateTaskStatus(task.id, newStatus)
      }
    })
  }

  const handleEditClick = () => {
    setOpenDropdown(false)
    setOpenDialog(true)
  }

  const handleEditComplete = () => {
    setOpenDialog(false)
    if (onEditComplete) {
      onEditComplete()
    }
  }

  // Only show dropdown if there are actions to show
  const hasActions = showEdit || showDelete
  if (!hasActions && !showToggleStatus) {
    return null
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <div className="flex items-center gap-2">
        {showToggleStatus && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleStatus}
            disabled={isPending}
            className="text-xs"
          >
            {task.status === "done" ? "Mark Todo" : "Mark Done"}
          </Button>
        )}
        
        {hasActions && (
          <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isPending}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {showEdit && (
                <DialogTrigger asChild>
                  <DropdownMenuItem 
                    onSelect={(e) => {
                      e.preventDefault()
                      handleEditClick()
                    }} 
                    className="cursor-pointer hover:bg-background-light"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                </DialogTrigger>
              )}
              
              {showDelete && (
                <DropdownMenuItem 
                  className="text-primary cursor-pointer hover:bg-background-light" 
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {showEdit && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <EditTaskForm task={task} onFinish={handleEditComplete} />
        </DialogContent>
      )}
    </Dialog>
  )
}
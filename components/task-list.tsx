"use client"

import { useOptimistic, useTransition, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Clock, Edit, Trash2, Search } from "lucide-react"
import { deleteTask, updateTaskStatus } from "@/app/(dashboard)/tasks/actions"
import { formatDateForDisplay } from "@/lib/date-utils"
import { EditTaskForm } from "./edit-task-form"
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
  const [, startTransition] = useTransition()
  const [openDialogs, setOpenDialogs] = useState<Record<number, boolean>>({})
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({})
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

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

  const handleCloseDialog = (taskId: number) => {
    setOpenDialogs(prev => ({ ...prev, [taskId]: false }))
  }

  const handleEditClick = (taskId: number) => {
    setOpenDropdowns(prev => ({ ...prev, [taskId]: false }))
    setOpenDialogs(prev => ({ ...prev, [taskId]: true }))
  }

  const getInitials = (name: string | null) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Filter tasks based on search term and filter criteria
  const filteredTasks = optimisticTasks.filter(task => {
    // Search term filter (search in name and description)
    const matchesSearch = searchTerm === "" || 
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Priority filter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    
    // Status filter
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    
    return matchesSearch && matchesPriority && matchesStatus
  })

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-card">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="min-w-[140px]">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[140px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {optimisticTasks.length === 0 ? "No tasks found." : "No tasks match your search criteria."}
        </div>
      ) : (
        filteredTasks.map((task) => (
        <Dialog key={task.id} open={openDialogs[task.id]} onOpenChange={(open) =>
          setOpenDialogs(prev => ({ ...prev, [task.id]: open }))
        }>
          <Card className={task.status === "done" ? "bg-muted/50" : ""}>
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
                      <Badge

                        className="capitalize"
                      >
                        {task.status.replace("_", " ")}
                      </Badge>
                      <Badge
                        className="capitalize"
                      >
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
                <DropdownMenu open={openDropdowns[task.id]} onOpenChange={(open) =>
                  setOpenDropdowns(prev => ({ ...prev, [task.id]: open }))
                }>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => {
                        e.preventDefault()
                        handleEditClick(task.id)
                      }} className="cursor-pointer hover:bg-background-light">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem className="text-primary cursor-pointer hover:bg-background-light" onClick={() => handleDelete(task.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <EditTaskForm task={task} onFinish={() => handleCloseDialog(task.id)} />
          </DialogContent>
        </Dialog>
        ))
      )}
    </div>
  )
}

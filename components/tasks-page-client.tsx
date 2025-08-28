"use client"

import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilter } from "@/components/task-search-filter"
import { poppins } from "@/lib/fonts"
import { searchTasks } from "@/app/(dashboard)/tasks/actions"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
}

interface TasksPageClientProps {
  initialTasks: TaskWithProfile[]
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  const [tasks, setTasks] = useState<TaskWithProfile[]>(initialTasks)
  const [isPending, startTransition] = useTransition()

  const handleSearch = async (query: string, status: string, priority: string) => {
    startTransition(async () => {
      const { tasks: filteredTasks, error } = await searchTasks(
        query || undefined,
        status === 'all' ? undefined : status,
        priority === 'all' ? undefined : priority
      )
      
      if (!error && filteredTasks) {
        setTasks(filteredTasks)
      }
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold tracking-tight ${poppins.className}`}>Tasks</h2>
        <Link href="/tasks/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      <TaskSearchFilter onSearch={handleSearch} isLoading={isPending} />

      <div className="space-y-4">
        {isPending ? (
          <div>Loading tasks...</div>
        ) : (
          <TaskList initialTasks={tasks} />
        )}
      </div>
    </div>
  )
}
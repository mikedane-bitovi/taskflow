"use client"

import { useState, useCallback } from "react"
import { TaskSearchFilter } from "@/components/task-search-filter"
import { TaskList } from "@/components/task-list"
import { searchAndFilterTasks } from "./actions"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface TasksPageClientProps {
  initialTasks: TaskWithProfile[];
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [isLoading, setIsLoading] = useState(false)
  const [currentSearch, setCurrentSearch] = useState("")
  const [currentPriorityFilter, setCurrentPriorityFilter] = useState("all")
  const [currentStatusFilter, setCurrentStatusFilter] = useState("all")

  const fetchFilteredTasks = useCallback(async (
    search: string,
    priority: string,
    status: string
  ) => {
    setIsLoading(true)
    try {
      const { tasks: filteredTasks, error } = await searchAndFilterTasks(
        search || undefined,
        priority === "all" ? undefined : priority,
        status === "all" ? undefined : status
      )
      
      if (error) {
        console.error("Error filtering tasks:", error)
      } else {
        setTasks(filteredTasks || [])
      }
    } catch (err) {
      console.error("Error filtering tasks:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSearchChange = useCallback((search: string) => {
    setCurrentSearch(search)
    fetchFilteredTasks(search, currentPriorityFilter, currentStatusFilter)
  }, [currentPriorityFilter, currentStatusFilter, fetchFilteredTasks])

  const handlePriorityFilterChange = useCallback((priority: string) => {
    setCurrentPriorityFilter(priority)
    fetchFilteredTasks(currentSearch, priority, currentStatusFilter)
  }, [currentSearch, currentStatusFilter, fetchFilteredTasks])

  const handleStatusFilterChange = useCallback((status: string) => {
    setCurrentStatusFilter(status)
    fetchFilteredTasks(currentSearch, currentPriorityFilter, status)
  }, [currentSearch, currentPriorityFilter, fetchFilteredTasks])

  return (
    <>
      <TaskSearchFilter
        onSearchChange={handleSearchChange}
        onPriorityFilterChange={handlePriorityFilterChange}
        onStatusFilterChange={handleStatusFilterChange}
      />
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div>Loading tasks...</div>
        </div>
      ) : (
        <TaskList initialTasks={tasks} />
      )}
    </>
  )
}
"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"
import { TaskList } from "@/components/task-list"
import { Checkbox } from "@/components/ui/checkbox"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface TaskFilters {
  status: {
    todo: boolean;
    in_progress: boolean;
    review: boolean;
    done: boolean;
  };
  priority: {
    high: boolean;
    medium: boolean;
    low: boolean;
  };
}

export function TasksWithSearchAndFilter({ initialTasks }: { initialTasks: TaskWithProfile[] }) {
  const [searchText, setSearchText] = useState("")
  const [filters, setFilters] = useState<TaskFilters>({
    status: {
      todo: true,
      in_progress: true,
      review: true,
      done: true,
    },
    priority: {
      high: true,
      medium: true,
      low: true,
    },
  })

  const filteredTasks = useMemo(() => {
    return initialTasks.filter((task) => {
      // Search filter - check if search text matches task name or description
      const matchesSearch = searchText === "" || 
        task.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchText.toLowerCase()))

      // Status filter
      const matchesStatus = filters.status[task.status as keyof typeof filters.status]

      // Priority filter
      const matchesPriority = filters.priority[task.priority.toLowerCase() as keyof typeof filters.priority]

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [initialTasks, searchText, filters])

  const handleClearSearch = () => {
    setSearchText("")
  }

  const handleFilterChange = (type: 'status' | 'priority', key: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: checked,
      },
    }))
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchText && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="p-2">
              <h4 className="font-medium mb-2">Status</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="status-todo"
                    checked={filters.status.todo}
                    onCheckedChange={(checked) => handleFilterChange('status', 'todo', checked as boolean)}
                  />
                  <label htmlFor="status-todo" className="text-sm cursor-pointer">Todo</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="status-in_progress"
                    checked={filters.status.in_progress}
                    onCheckedChange={(checked) => handleFilterChange('status', 'in_progress', checked as boolean)}
                  />
                  <label htmlFor="status-in_progress" className="text-sm cursor-pointer">In Progress</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="status-review"
                    checked={filters.status.review}
                    onCheckedChange={(checked) => handleFilterChange('status', 'review', checked as boolean)}
                  />
                  <label htmlFor="status-review" className="text-sm cursor-pointer">Review</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="status-done"
                    checked={filters.status.done}
                    onCheckedChange={(checked) => handleFilterChange('status', 'done', checked as boolean)}
                  />
                  <label htmlFor="status-done" className="text-sm cursor-pointer">Done</label>
                </div>
              </div>

              <DropdownMenuSeparator className="my-3" />

              <h4 className="font-medium mb-2">Priority</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="priority-high"
                    checked={filters.priority.high}
                    onCheckedChange={(checked) => handleFilterChange('priority', 'high', checked as boolean)}
                  />
                  <label htmlFor="priority-high" className="text-sm cursor-pointer">High</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="priority-medium"
                    checked={filters.priority.medium}
                    onCheckedChange={(checked) => handleFilterChange('priority', 'medium', checked as boolean)}
                  />
                  <label htmlFor="priority-medium" className="text-sm cursor-pointer">Medium</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="priority-low"
                    checked={filters.priority.low}
                    onCheckedChange={(checked) => handleFilterChange('priority', 'low', checked as boolean)}
                  />
                  <label htmlFor="priority-low" className="text-sm cursor-pointer">Low</label>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task List or No Results Message */}
      {filteredTasks.length > 0 ? (
        <TaskList initialTasks={filteredTasks} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No tasks match the current search and filter criteria.</p>
          <p className="text-muted-foreground text-sm mt-2">Try adjusting your search terms or filter settings.</p>
        </div>
      )}
    </div>
  )
}
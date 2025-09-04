"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface TaskSearchFilterProps {
  onSearchChange: (search: string) => void
  onPriorityFilterChange: (priority: string) => void
  onStatusFilterChange: (status: string) => void
}

export function TaskSearchFilter({ 
  onSearchChange, 
  onPriorityFilterChange, 
  onStatusFilterChange 
}: TaskSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, onSearchChange])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {/* Priority Filter */}
      <div className="min-w-[140px]">
        <Select onValueChange={onPriorityFilterChange} defaultValue="all">
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
      
      {/* Status Filter */}
      <div className="min-w-[140px]">
        <Select onValueChange={onStatusFilterChange} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
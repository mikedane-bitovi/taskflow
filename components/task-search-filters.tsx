"use client"

import { useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function TaskSearchFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const formRef = useRef<HTMLFormElement>(null)

    const search = searchParams.get("search") || ""
    const priority = searchParams.get("priority") || "all"
    const status = searchParams.get("status") || "all"

    const updateSearchParams = (key: string, value: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        
        if (value === "" || value === "all") {
            current.delete(key)
        } else {
            current.set(key, value)
        }

        const search = current.toString()
        const query = search ? `?${search}` : ""
        router.push(`/tasks${query}`)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSearchParams("search", e.target.value)
    }

    const handlePriorityChange = (value: string) => {
        updateSearchParams("priority", value)
    }

    const handleStatusChange = (value: string) => {
        updateSearchParams("status", value)
    }

    return (
        <form ref={formRef} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search tasks by name or description..."
                    defaultValue={search}
                    onChange={handleSearchChange}
                    className="pl-10"
                    name="search"
                />
            </div>
            <div className="flex gap-2">
                <Select defaultValue={priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                </Select>
                <Select defaultValue={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="todo">Todo</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </form>
    )
}
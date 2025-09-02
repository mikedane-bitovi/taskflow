"use client"

import { Suspense, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, X } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { poppins } from "@/lib/fonts"

import { getAllTasks, searchTasks } from "@/app/(dashboard)/tasks/actions"
import { Prisma } from "@/app/generated/prisma"

// Use the Task type from Prisma
type Task = Prisma.TaskGetPayload<{
  include: {
    assignee: {
      select: {
        id: true;
        name: true;
        email: true;
        password: true;
      };
    };
    creator: {
      select: {
        id: true;
        name: true;
        email: true;
        password: true;
      };
    };
  };
}>;

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load initial tasks
    useEffect(() => {
        async function loadTasks() {
            setLoading(true);
            const { tasks, error } = await getAllTasks();
            if (error) {
                setError(error);
            } else {
                setTasks(tasks || []);
            }
            setLoading(false);
        }
        loadTasks();
    }, []);

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim()) {
                setLoading(true);
                const { tasks, error } = await searchTasks(searchQuery);
                if (error) {
                    setError(error);
                } else {
                    setTasks(tasks || []);
                    setError(null);
                }
                setLoading(false);
            } else {
                // If search is cleared, reload all tasks
                setLoading(true);
                const { tasks, error } = await getAllTasks();
                if (error) {
                    setError(error);
                } else {
                    setTasks(tasks || []);
                    setError(null);
                }
                setLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const clearSearch = () => {
        setSearchQuery("");
    };

    if (error) {
        return <p className="p-8">Could not load data. Please try again later.</p>
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

            {/* Search Bar */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks by title or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-8"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-6 w-6 p-0"
                            onClick={clearSearch}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
                {searchQuery && (
                    <div className="text-sm text-muted-foreground">
                        {loading ? "Searching..." : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} found`}
                    </div>
                )}
            </div>

            <Suspense fallback={<div>Loading tasks...</div>}>
                <TaskList initialTasks={tasks} loading={loading} />
            </Suspense>
        </div>
    )
}

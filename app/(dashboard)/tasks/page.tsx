import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilters } from "@/components/task-search-filters"
import { poppins } from "@/lib/fonts"

import { getAllTasks } from "@/app/(dashboard)/tasks/actions"

export const revalidate = 0


export default async function TasksPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; priority?: string; status?: string }>
}) {
    const params = await searchParams;
    const search = params?.search || "";
    const priority = params?.priority || "all";
    const status = params?.status || "all";

    const { tasks, error } = await getAllTasks(search, priority, status);
    if (error) {
        console.error("Error fetching data:", error)
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

            {/* Search and Filter Section */}
            <TaskSearchFilters />

            <Suspense fallback={<div>Loading tasks...</div>}>
                <TaskList initialTasks={tasks || []} />
            </Suspense>
        </div>
    )
}

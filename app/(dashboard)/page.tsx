import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, List, Clock } from "lucide-react"
import { PrismaClient } from "@/app/generated/prisma";
import { DashboardCharts } from "@/components/dashboard-charts";
import { TaskOverview } from "@/components/task-overview";
import { poppins } from "@/lib/fonts";
// import { DashboardCharts } from "../../components/dashboard-charts";
// import { TaskOverview } from "../../components/task-overview";

export default async function IndexPage() {
  const prisma = new PrismaClient();


  // Other dashboard data
  const [
    totalTasks,
    completedTasks,
    openTasks,
    totalUsers,
    recentTasks
  ] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { status: "done" } }),
    prisma.task.count({ where: { status: "in_progress" } }),
    prisma.user.count(),
    prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        assignee: true,
        creator: true,
      },
    }),
  ]);

  // Fetch all tasks for stats
  const allTasks = await prisma.task.findMany({
    select: {
      id: true,
      status: true,
      createdAt: true,
    },
  });

  // Group tasks by month (YYYY-MM)
  const statsMap = new Map();
  for (const task of allTasks) {
    const createdMonth = task.createdAt.toISOString().slice(0, 7); // 'YYYY-MM'
    if (!statsMap.has(createdMonth)) {
      statsMap.set(createdMonth, { month: createdMonth, total: 0, completed: 0 });
    }
    statsMap.get(createdMonth).total++;
    if (task.status === "done") {
      statsMap.get(createdMonth).completed++;
    }
  }
  // Convert to sorted array
  const taskStats = Array.from(statsMap.values()).sort((a, b) => a.month.localeCompare(b.month));




  return (
    <div className="p-8">
      <h2 className={`text-3xl font-bold tracking-tight ${poppins.className}`}>Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <List className="h-4 w-4 text-foreground-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks ?? 0}</div>
            <p className="text-xs text-foreground-muted">All tasks in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-foreground-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks ?? 0}</div>
            <p className="text-xs text-foreground-muted">
              {totalTasks ? `${Math.round((completedTasks! / totalTasks!) * 100)}% completed` : "0% completed"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <Clock className="h-4 w-4 text-foreground-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTasks}</div>
            <p className="text-xs text-foreground-muted">Tasks currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-foreground-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers ?? 0}</div>
            <p className="text-xs text-foreground-muted">Active users on the platform</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <DashboardCharts data={taskStats} />
        </div>
        <div className="col-span-4 lg:col-span-3">
          <TaskOverview tasks={recentTasks} />
        </div>
      </div>

    </div>
  );
}

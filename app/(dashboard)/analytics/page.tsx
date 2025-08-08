"use client"

import { getAllTasks } from "@/app/(dashboard)/tasks/actions";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { List, CheckCircle2, PercentCircle, Users2, CheckCircle } from "lucide-react";
import { poppins } from "@/lib/fonts";

export default function AnalyticsPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const result = await getAllTasks();
                if (result.error) {
                    setError(result.error);
                } else {
                    setTasks(result.tasks);
                }
            } catch (err) {
                setError('Failed to fetch tasks');
            } finally {
                setLoading(false);
            }
        }

        fetchTasks();
    }, []);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-8">
                <h1 className={`text-2xl font-bold mb-4 ${poppins.className}`}>Analytics</h1>
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto py-8">
                <h1 className={`text-2xl font-bold mb-4 ${poppins.className}`}>Analytics</h1>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    // Process data for charts
    const statusData = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const priorityData = tasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const assigneeData = tasks.reduce((acc, task) => {
        const assigneeName = task.assignee?.name || 'Unassigned';
        acc[assigneeName] = (acc[assigneeName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const creatorData = tasks.reduce((acc, task) => {
        const creatorName = task.creator?.name || 'Unknown';
        acc[creatorName] = (acc[creatorName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Convert to chart-friendly format
    const statusChartData = Object.entries(statusData).map(([status, count]) => ({
        name: status,
        value: count,
    }));

    const priorityChartData = Object.entries(priorityData).map(([priority, count]) => ({
        name: priority,
        count: count,
    }));

    const assigneeChartData = Object.entries(assigneeData).map(([assignee, count]) => ({
        name: assignee.length > 15 ? assignee.substring(0, 15) + '...' : assignee,
        tasks: count,
    }));

    const creatorChartData = Object.entries(creatorData).map(([creator, count]) => ({
        name: creator.length > 15 ? creator.substring(0, 15) + '...' : creator,
        created: count,
    }));

    // Colors for pie chart
    const COLORS = ['#BCECEF', '#4BBEC5', '#00848B', '#F5532C', '#8dd1e1', '#d084d0'];

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status?.toLowerCase() === 'done' || task.status?.toLowerCase() === 'completed').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className="max-w-7xl p-8 space-y-8">
            <h1 className={`text-3xl font-bold mb-6 ${poppins.className}`}>Analytics</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-foreground-muted" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedTasks ?? 0}</div>
                        <p className="text-xs text-foreground-muted">Tasks marked as done</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <PercentCircle className="h-4 w-4 text-foreground-muted" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completionRate ?? 0}%</div>
                        <p className="text-xs text-foreground-muted">% of tasks completed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users2 className="h-4 w-4 text-foreground-muted" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Object.keys(assigneeData).length ?? 0}</div>
                        <p className="text-xs text-foreground-muted">Users assigned to tasks</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Task Status Distribution - Pie Chart */}
                <div className="bg-card-background p-6 rounded-lg shadow border">
                    <h2 className={`text-xl font-semibold mb-4 ${poppins.className}`}>Task Status Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusChartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#F5532C"
                                dataKey="value"
                                label={({ name, value, percent }) => `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`}
                            >
                                {statusChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip cursor={{ fill: "transparent" }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Priority Distribution - Bar Chart */}
                <div className="bg-card-background p-6 rounded-lg shadow border">
                    <h2 className={`text-xl font-semibold mb-4 ${poppins.className}`}>Tasks by Priority</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={priorityChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip cursor={{ fill: "transparent" }} />
                            <Bar dataKey="count" fill="#4BBEC5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Tasks by Assignee - Bar Chart */}
                <div className="bg-card-background p-6 rounded-lg shadow border">
                    <h2 className={`text-xl font-semibold mb-4 ${poppins.className}`}>Tasks by Assignee</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={assigneeChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="#888888" />
                            <YAxis />
                            <Tooltip cursor={{ fill: "transparent" }} />
                            <Bar dataKey="tasks" fill="#4BBEC5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Tasks Created by User - Bar Chart */}
                <div className="bg-card-background p-6 rounded-lg shadow border">
                    <h2 className={`text-xl font-semibold mb-4 ${poppins.className}`}>Tasks Created by User</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={creatorChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip cursor={{ fill: "transparent" }} />
                            <Bar dataKey="created" fill="#F5532C" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>


        </div>
    );
}

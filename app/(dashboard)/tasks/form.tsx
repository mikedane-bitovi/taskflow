"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { createTask } from "./actions";
import { getAllUsers } from "@/app/login/actions";
import { formatDateForInput } from "@/lib/date-utils";
import type { Task } from "@/app/generated/prisma";

const initialState = { error: null as string | null, success: false };

type TaskFormProps = {
    task?: Partial<Task>;
    onSubmit?: (formData: FormData) => Promise<{ error: string | null; success: boolean }>;
};

export default function TaskForm({ task, onSubmit }: TaskFormProps) {
    const [title, setTitle] = useState(task?.name || "");
    const [description, setDescription] = useState(task?.description || "");
    const [priority, setPriority] = useState(task?.priority || "medium");
    const [status, setStatus] = useState(task?.status || "todo");
    const [dueDate, setDueDate] = useState(task?.dueDate ? formatDateForInput(task.dueDate) : "");
    const [assigneeId, setAssigneeId] = useState(task?.assigneeId ? String(task.assigneeId) : "");
    const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
    const [state, formAction] = useActionState(async (_state: typeof initialState, formData: FormData) => {
        if (onSubmit) {
            const result = await onSubmit(formData);
            return result ?? initialState;
        } else {
            const result = await createTask(formData);
            return {
                error: result?.error ?? null,
                success: !!result && !result.error,
            };
        }
    }, initialState);

    useEffect(() => {
        (async () => {
            const users = await getAllUsers();
            setUsers(users);
        })();
    }, []);

    useEffect(() => {
        if (task) {
            setTitle(task.name || "");
            setDescription(task.description || "");
            setPriority(task.priority || "medium");
            setStatus(task.status || "todo");
            setDueDate(task.dueDate ? formatDateForInput(task.dueDate) : "");
            setAssigneeId(task.assigneeId ? String(task.assigneeId) : "");
        }
    }, [task]);

    return (
        <form className="space-y-4" action={formAction}>

            <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                    className="w-full border rounded px-2 py-1"
                    type="text"
                    name="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                    className="w-full border rounded px-2 py-1"
                    name="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Priority</label>
                <select
                    className="w-full border rounded px-2 py-1"
                    name="priority"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                    className="w-full border rounded px-2 py-1"
                    name="status"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                </select>
            </div>
            <div>
                <label className="block mb-1 font-medium">Assignee</label>
                <select
                    className="w-full border rounded px-2 py-1"
                    name="assigneeId"
                    value={assigneeId}
                    onChange={e => setAssigneeId(e.target.value)}
                >
                    <option value="">Unassigned</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block mb-1 font-medium">Due Date</label>
                <input
                    className="w-full border rounded px-2 py-1"
                    type="date"
                    name="dueDate"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                {task ? "Update Task" : "Create Task"}
            </button>
            {state && state.error && <div className="text-red-500 mt-2">{state.error}</div>}
            {state && state.success && (
                <div className="text-green-600 mt-2">
                    {task ? "Task updated!" : "Task created!"}
                </div>
            )}
        </form>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListTodo,
  Loader2,
  Search,
} from "lucide-react";

import { getMyTasks, getTaskById } from "@/services/task.service";
import { showErrorToast } from "@/lib/toast";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import TaskDetailsDialog, {
  TaskDetailsData,
} from "@/components/projects/taskDetails/task-details-dialog";

type TaskStatus = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  name: string;
  key: string;
};

type Sprint = {
  id: string;
  name: string;
  status: string;
  startDate?: string | null;
  endDate?: string | null;
};

type Task = {
  id: string;
  key: string;
  title: string;
  description?: string | null;
  type?: string;
  priority?: string;
  dueDate?: string | null;

  project: Project;
  status: TaskStatus;

  sprint?: Sprint | null;

  _count?: {
    comments: number;
    attachments: number;
    checklists: number;
  };
};

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskDetailsData | null>(
    null,
  );

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);

      const data = await getMyTasks();

      setTasks(data || []);
    } catch (error) {
      console.error("Failed to fetch assigned tasks:", error);
      showErrorToast("Failed to load assigned tasks");
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const value = search.toLowerCase();

    return (
      task.title?.toLowerCase().includes(value) ||
      task.key?.toLowerCase().includes(value) ||
      task.project?.name?.toLowerCase().includes(value) ||
      task.project?.key?.toLowerCase().includes(value)
    );
  });

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => {
    const status = task.status?.name?.toLowerCase() || "";

    return status.includes("done") || status.includes("complete");
  }).length;

  const inProgressTasks = tasks.filter((task) => {
    const status = task.status?.name?.toLowerCase() || "";

    return status.includes("progress");
  }).length;

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;

    const status = task.status?.name?.toLowerCase() || "";

    const completed = status.includes("done") || status.includes("complete");

    return new Date(task.dueDate) < new Date() && !completed;
  }).length;

  const formatDate = (date?: string | null) => {
    if (!date) return "No due date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPriorityVariant = (
    priority?: string,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (priority?.toUpperCase()) {
      case "HIGHEST":
      case "HIGH":
        return "destructive";

      case "MEDIUM":
        return "default";

      case "LOW":
      case "LOWEST":
        return "secondary";

      default:
        return "outline";
    }
  };

  const handleTaskClick = async (taskId: string) => {
    try {
      const res = await getTaskById(taskId);

      setSelectedTask(res.task);
      setTaskDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch task details:", error);
      showErrorToast("Failed to load task details");
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>

        <p className="mt-2 text-muted-foreground">
          View and manage all tasks assigned to you across your projects.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search tasks or projects..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Tasks
              </p>

              <p className="mt-2 text-2xl font-bold">{totalTasks}</p>
            </div>

            <ListTodo className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                In Progress
              </p>

              <p className="mt-2 text-2xl font-bold">{inProgressTasks}</p>
            </div>

            <Clock3 className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed
              </p>

              <p className="mt-2 text-2xl font-bold">{completedTasks}</p>
            </div>

            <CheckCircle2 className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Overdue
              </p>

              <p className="mt-2 text-2xl font-bold">{overdueTasks}</p>
            </div>

            <CalendarDays className="h-5 w-5 text-destructive" />
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="flex h-64 flex-col items-center justify-center text-center">
            <ListTodo className="mb-4 h-10 w-10 text-muted-foreground" />

            <h3 className="text-lg font-semibold">No tasks found</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {tasks.length === 0
                ? "You don't have any tasks assigned to you."
                : "Try changing your search."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => handleTaskClick(task.id)}
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-primary">
                        {task.key}
                      </span>

                      <Badge variant="outline">{task.project?.key}</Badge>
                    </div>

                    <h2 className="truncate text-lg font-semibold">
                      {task.title}
                    </h2>

                    {task.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    )}

                    <p className="mt-3 text-sm text-muted-foreground">
                      Project:{" "}
                      <span className="font-medium text-foreground">
                        {task.project?.name}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <Badge variant="outline">
                      {task.status?.name || "Unknown"}
                    </Badge>

                    <Badge variant={getPriorityVariant(task.priority)}>
                      {task.priority || "MEDIUM"}
                    </Badge>

                    {task.sprint && (
                      <Badge variant="secondary">{task.sprint.name}</Badge>
                    )}

                    {task.dueDate && (
                      <Badge variant="outline">
                        <CalendarDays className="mr-1 h-3 w-3" />
                        {formatDate(task.dueDate)}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-4 border-t pt-4 text-xs text-muted-foreground">
                  <span>Comments: {task._count?.comments ?? 0}</span>

                  <span>Attachments: {task._count?.attachments ?? 0}</span>

                  <span>Checklists: {task._count?.checklists ?? 0}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredTasks.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </p>
      )}
      <TaskDetailsDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={selectedTask}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import TaskDetailsDialog, {
  TaskDetailsData,
} from "@/components/projects/taskDetails/task-details-dialog";

import { showErrorToast } from "@/lib/toast";
import { useAppSelector } from "@/redux/hooks";
import { getTasksByProject } from "@/services/task.service";

interface TaskListItem {
  id: string;
  key: string;
  title: string;
  description?: string | null;

  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";

  status: {
    id: string;
    name: string;
    color: string;
  };

  assignee?: {
    id: string;
    name: string;
    avatar?: string | null;
  } | null;

  dueDate?: string | null;

  labels?: {
    id: string;
    name: string;
    color: string;
  }[];
}

interface TasksResponse {
  success: boolean;
  tasks: TaskListItem[];
}

interface TasksPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function TasksPage({ params }: TasksPageProps) {
  const project = useAppSelector((state) => state.project.currentProject);

  const [projectId, setProjectId] = useState<string | null>(
    project?.id ?? null,
  );

  const [tasks, setTasks] = useState<TaskListItem[]>([]);

  const [selectedTask, setSelectedTask] = useState<TaskDetailsData | null>(
    null,
  );

  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!projectId) return;

    fetchTasks();
  }, [projectId]);

  async function fetchTasks() {
    try {
      setLoading(true);

      const response = await getTasksByProject(projectId!);

      setTasks(response.tasks);
    } catch (error: any) {
      console.error("Failed to fetch tasks:", error);

      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load tasks",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleTaskClick(task: TaskListItem) {
    /*
     * For now we convert the list task into the
     * TaskDetailsData structure.
     *
     * Later you should call:
     *
     * GET /tasks/:taskId
     *
     * to get comments, attachments, checklist
     * and activity.
     */

    const details: TaskDetailsData = {
      id: task.id,

      key: task.key,

      title: task.title,

      description: task.description,

      priority: task.priority,

      status: task.status,

      assignee: task.assignee,

      dueDate: task.dueDate,

      labels: task.labels ?? [],

      comments: [],

      attachments: [],

      checklists: [],

      activities: [],
    };

    setSelectedTask(details);

    setTaskDetailsOpen(true);
  }

  /*
   * ------------------------------------------------
   * Search
   * ------------------------------------------------
   */

  const filteredTasks = tasks.filter((task) => {
    const value = search.trim().toLowerCase();

    if (!value) return true;

    return (
      task.title.toLowerCase().includes(value) ||
      task.key.toLowerCase().includes(value)
    );
  });

  /*
   * ------------------------------------------------
   * Loading
   * ------------------------------------------------
   */

  if (loading && tasks.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">Tasks</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage and track tasks for this project.
          </p>
        </div>

        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tasks..."
            className="pl-9"
          />
        </div>

        <Badge variant="secondary">{filteredTasks.length} tasks</Badge>
      </div>

      {/* Task list */}
      {/* Task list */}
      {filteredTasks.length > 0 ? (
        <div className="w-full">
          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-xl border lg:block">
            <div className="grid grid-cols-[90px_minmax(200px,1fr)_150px_160px_120px] border-b bg-muted/40 px-4 py-3 text-xs font-medium text-muted-foreground">
              <div>Key</div>
              <div>Task</div>
              <div>Status</div>
              <div>Assignee</div>
              <div>Priority</div>
            </div>

            <div className="divide-y">
              {filteredTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => handleTaskClick(task)}
                  className="grid w-full grid-cols-[90px_minmax(200px,1fr)_150px_160px_120px] items-center px-4 py-4 text-left transition-colors hover:bg-muted/40"
                >
                  {/* Key */}
                  <div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {task.key}
                    </span>
                  </div>

                  {/* Task */}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{task.title}</p>

                    {task.description && (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: task.status.color,
                      }}
                    />

                    <span className="truncate text-sm">{task.status.name}</span>
                  </div>

                  {/* Assignee */}
                  <div className="truncate text-sm text-muted-foreground">
                    {task.assignee?.name || "Unassigned"}
                  </div>

                  {/* Priority */}
                  <div>
                    <PriorityBadge priority={task.priority} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile */}
          <div className="space-y-3 lg:hidden">
            {filteredTasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => handleTaskClick(task)}
                className="w-full rounded-xl border bg-background p-4 text-left shadow-sm transition-colors hover:bg-muted/40"
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1">
                      <span className="font-mono text-xs text-muted-foreground">
                        {task.key}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 text-sm font-semibold">
                      {task.title}
                    </h3>
                  </div>

                  <PriorityBadge priority={task.priority} />
                </div>

                {/* Description */}
                {task.description && (
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {task.description}
                  </p>
                )}

                {/* Bottom information */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: task.status.color,
                      }}
                    />

                    <span className="text-xs font-medium">
                      {task.status.name}
                    </span>
                  </div>

                  {/* Assignee */}
                  <span className="text-xs text-muted-foreground">
                    {task.assignee?.name || "Unassigned"}
                  </span>
                </div>

                {/* Labels */}
                {task.labels && task.labels.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {task.labels.map((label) => (
                      <span
                        key={label.id}
                        className="rounded-md px-2 py-1 text-[11px] font-medium"
                        style={{
                          backgroundColor: `${label.color}20`,
                          color: label.color,
                        }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center sm:p-12">
          <p className="text-sm font-medium">No tasks found</p>

          <p className="mt-1 text-sm text-muted-foreground">
            {search
              ? "Try changing your search."
              : "Create your first task for this project."}
          </p>
        </div>
      )}

      {/* Task details */}
      <TaskDetailsDialog
        open={taskDetailsOpen}
        onOpenChange={setTaskDetailsOpen}
        task={selectedTask}
      />
    </div>
  );
}

/*
 * ------------------------------------------------
 * Priority Badge
 * ------------------------------------------------
 */

function PriorityBadge({ priority }: { priority: TaskListItem["priority"] }) {
  const config = {
    LOW: {
      label: "Low",
      className: "bg-emerald-500/10 text-emerald-600",
    },

    MEDIUM: {
      label: "Medium",
      className: "bg-amber-500/10 text-amber-600",
    },

    HIGH: {
      label: "High",
      className: "bg-orange-500/10 text-orange-600",
    },

    URGENT: {
      label: "Urgent",
      className: "bg-red-500/10 text-red-600",
    },
  };

  const item = config[priority];

  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${item.className}`}
    >
      {item.label}
    </span>
  );
}

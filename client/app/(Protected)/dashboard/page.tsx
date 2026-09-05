"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
  Loader2,
  Target,
  Users,
  CalendarDays,
  CircleDot,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  Cell,
} from "recharts";

import { getUserDashboard } from "@/services/user.service";
import { useAppSelector } from "@/redux/hooks";

type DashboardData = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
  };

  statistics: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    overdueTasks: number;
    totalProjects: number;
    taskProgress: number;
  };

  taskStatus: {
    id: string;
    name: string;
    color?: string | null;
    count: number;
  }[];

  taskPriority: {
    priority: string;
    count: number;
  }[];

  productivity: {
    date: string;
    completed: number;
  }[];

  recentTasks: Task[];

  overdueTasks: Task[];

  projects: Project[];

  activeSprints: Sprint[];

  recentActivities: ActivityItem[];
};

type Task = {
  id: string;
  key: string;
  title: string;
  priority: string;
  dueDate?: string | null;
  updatedAt: string;
  projectId: string;

  status?: {
    id: string;
    name: string;
    color?: string | null;
  } | null;

  project?: {
    id: string;
    name: string;
    key: string;
    slug: string;
  } | null;

  sprint?: {
    id: string;
    name: string;
    status: string;
  } | null;
};

type Project = {
  id: string;
  name: string;
  key: string;
  slug: string;
  icon?: string | null;
  color?: string | null;

  role?: {
    id: string;
    name: string;
  };

  totalTasks: number;
  completedTasks: number;
  progress: number;
};

type Sprint = {
  id: string;
  name: string;
  goal?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: string;
  projectId: string;

  project?: {
    id: string;
    name: string;
    key: string;
    slug: string;
  };

  _count?: {
    tasks: number;
  };
};

type ActivityItem = {
  id: string;
  type: string;
  metadata?: Record<string, any> | null;
  createdAt: string;

  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
  };

  project?: {
    id: string;
    name: string;
    key: string;
    slug: string;
  };
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getUserDashboard();

        setDashboard(response?.data || null);
      } catch (error: any) {
        console.error("Dashboard error:", error);

        setError(error?.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const productivityData = useMemo(() => {
    if (!dashboard?.productivity) return [];

    return dashboard.productivity.map((item) => ({
      ...item,
      day: new Date(item.date).toLocaleDateString("en-US", {
        weekday: "short",
      }),
    }));
  }, [dashboard]);

  function getPriorityColor(priority: string) {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "#ef4444";

      case "high":
        return "#f97316";

      case "medium":
        return "#eab308";

      case "low":
        return "#22c55e";

      default:
        return "#64748b";
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />

          <h2 className="text-lg font-semibold">Unable to load dashboard</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {error || "No dashboard data found."}
          </p>
        </div>
      </div>
    );
  }

  const {
    user,
    statistics,
    taskStatus,
    taskPriority,
    recentTasks,
    overdueTasks,
    projects,
    activeSprints,
    recentActivities,
  } = dashboard;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Welcome back, {user.firstName} 👋
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Here&apos;s what&apos;s happening with your work today.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.firstName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <span className="font-semibold">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </span>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold">
                {user.firstName} {user.lastName}
              </p>

              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Tasks"
            value={statistics.totalTasks}
            description="Assigned to you"
            icon={<ListTodo className="h-5 w-5" />}
          />

          <StatCard
            title="Completed"
            value={statistics.completedTasks}
            description={`${statistics.taskProgress}% completion`}
            icon={<CheckCircle2 className="h-5 w-5" />}
          />

          <StatCard
            title="In Progress"
            value={statistics.inProgressTasks}
            description="Currently working"
            icon={<Clock3 className="h-5 w-5" />}
          />

          <StatCard
            title="Overdue"
            value={statistics.overdueTasks}
            description="Need your attention"
            icon={<AlertCircle className="h-5 w-5" />}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Todo Tasks"
            value={statistics.todoTasks}
            description="Waiting to start"
            icon={<CircleDot className="h-5 w-5" />}
          />

          <StatCard
            title="My Projects"
            value={statistics.totalProjects}
            description="Projects you're involved in"
            icon={<FolderKanban className="h-5 w-5" />}
          />

          <StatCard
            title="Task Progress"
            value={`${statistics.taskProgress}%`}
            description="Overall completion"
            icon={<Target className="h-5 w-5" />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border bg-background p-5 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Task Progress</h2>

                <p className="text-sm text-muted-foreground">
                  Your overall task completion
                </p>
              </div>

              <span className="text-2xl font-bold">
                {statistics.taskProgress}%
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${statistics.taskProgress}%`,
                }}
              />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <ProgressItem label="Todo" value={statistics.todoTasks} />

              <ProgressItem
                label="In Progress"
                value={statistics.inProgressTasks}
              />

              <ProgressItem
                label="Completed"
                value={statistics.completedTasks}
              />
            </div>
          </section>

          <section className="rounded-xl border bg-background p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="font-semibold">Productivity</h2>

              <p className="text-sm text-muted-foreground">
                Tasks completed over the last 7 days
              </p>
            </div>

            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis dataKey="day" tickLine={false} axisLine={false} />

                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="completed"
                    strokeWidth={2}
                    fillOpacity={0.15}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border bg-background p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="font-semibold">Task Status</h2>

              <p className="text-sm text-muted-foreground">
                Distribution of your tasks by status
              </p>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={taskStatus}
                  layout="vertical"
                  margin={{
                    left: 20,
                    right: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                  <XAxis type="number" allowDecimals={false} />

                  <YAxis type="category" dataKey="name" width={100} />

                  <Tooltip />

                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {taskStatus.map((status) => (
                      <Cell key={status.id} fill={status.color || "#64748b"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-xl border bg-background p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="font-semibold">Task Priority</h2>

              <p className="text-sm text-muted-foreground">
                Tasks grouped by priority
              </p>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskPriority}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis dataKey="priority" tickLine={false} axisLine={false} />

                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip />

                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {taskPriority.map((item) => (
                      <Cell
                        key={item.priority}
                        fill={getPriorityColor(item.priority)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-xl border bg-background shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="font-semibold">My Recent Tasks</h2>

                <p className="text-sm text-muted-foreground">
                  Recently updated tasks assigned to you
                </p>
              </div>

              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="divide-y">
              {recentTasks.length === 0 ? (
                <EmptyState message="No tasks assigned to you." />
              ) : (
                recentTasks.map((task) => <TaskRow key={task.id} task={task} />)
              )}
            </div>
          </section>

          <section className="rounded-xl border bg-background shadow-sm">
            <div className="border-b p-5">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />

                <h2 className="font-semibold">Overdue Tasks</h2>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Tasks requiring immediate attention
              </p>
            </div>

            <div className="divide-y">
              {overdueTasks.length === 0 ? (
                <EmptyState message="No overdue tasks 🎉" />
              ) : (
                overdueTasks.slice(0, 6).map((task) => (
                  <div key={task.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">
                          {task.key}
                        </p>

                        <p className="mt-1 truncate text-sm font-medium">
                          {task.title}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {task.project?.name}
                        </p>
                      </div>

                      <PriorityBadge priority={task.priority} />
                    </div>

                    {task.dueDate && (
                      <p className="mt-3 text-xs text-red-500">
                        Due {formatDate(task.dueDate)}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="rounded-xl border bg-background shadow-sm">
          <div className="border-b p-5">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5" />

              <div>
                <h2 className="font-semibold">My Projects</h2>

                <p className="text-sm text-muted-foreground">
                  Your project workload and progress
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.length === 0 ? (
              <div className="md:col-span-2 xl:col-span-3">
                <EmptyState message="You are not part of any projects." />
              </div>
            ) : (
              projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border bg-background shadow-sm">
          <div className="border-b p-5">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />

              <div>
                <h2 className="font-semibold">Active Sprints</h2>

                <p className="text-sm text-muted-foreground">
                  Sprints currently in progress
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            {activeSprints.length === 0 ? (
              <div className="md:col-span-2 xl:col-span-3">
                <EmptyState message="No active sprints." />
              </div>
            ) : (
              activeSprints.map((sprint) => (
                <SprintCard key={sprint.id} sprint={sprint} />
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border bg-background shadow-sm">
          <div className="border-b p-5">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />

              <div>
                <h2 className="font-semibold">Recent Activity</h2>

                <p className="text-sm text-muted-foreground">
                  Your latest project activity
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y">
            {recentActivities.length === 0 ? (
              <EmptyState message="No recent activity." />
            ) : (
              recentActivities.map((activity) => (
                <ActivityRow key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-background p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <p className="mt-2 text-3xl font-bold">{value}</p>

          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ProgressItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function TaskRow({ task }: { task: Task }) {
  return (
    <div className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/40">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <ListTodo className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {task.key}
          </span>

          <StatusBadge status={task.status} />
        </div>

        <p className="mt-1 truncate text-sm font-medium">{task.title}</p>

        <p className="mt-1 truncate text-xs text-muted-foreground">
          {task.project?.name || "No project"}
        </p>
      </div>

      <div className="hidden sm:block">
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="hidden text-right md:block">
        {task.dueDate ? (
          <>
            <p className="text-xs text-muted-foreground">Due</p>

            <p className="text-xs font-medium">{formatDate(task.dueDate)}</p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">No due date</p>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-xl border p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-semibold">
            {project.icon || project.key?.slice(0, 2)}
          </div>

          <div>
            <h3 className="font-semibold">{project.name}</h3>

            <p className="text-xs text-muted-foreground">{project.key}</p>
          </div>
        </div>

        <span className="text-sm font-semibold">{project.progress}%</span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{
            width: `${project.progress}%`,
          }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {project.completedTasks} / {project.totalTasks} completed
        </span>

        {project.role && <span>{project.role.name}</span>}
      </div>
    </div>
  );
}

function SprintCard({ sprint }: { sprint: Sprint }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{sprint.name}</h3>

          <p className="mt-1 text-xs text-muted-foreground">
            {sprint.project?.name}
          </p>
        </div>

        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
          Active
        </span>
      </div>

      {sprint.goal && (
        <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
          {sprint.goal}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{sprint._count?.tasks || 0} tasks</span>

        {sprint.endDate && <span>Ends {formatDate(sprint.endDate)}</span>}
      </div>
    </div>
  );
}

function ActivityRow({ activity }: { activity: ActivityItem }) {
  return (
    <div className="flex items-start gap-4 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
        <Activity className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm">{getActivityMessage(activity)}</p>

        {activity.project && (
          <p className="mt-1 text-xs text-muted-foreground">
            {activity.project.name}
          </p>
        )}
      </div>

      <span className="shrink-0 text-xs text-muted-foreground">
        {formatRelativeTime(activity.createdAt)}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status?: Task["status"] }) {
  if (!status) return null;

  return (
    <span
      className="rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{
        backgroundColor: status.color ? `${status.color}20` : undefined,
        color: status.color || undefined,
      }}
    >
      {status.name}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const normalized = priority?.toLowerCase();

  let className = "rounded-full px-2 py-1 text-[11px] font-medium";

  if (normalized === "urgent") {
    className += " bg-red-100 text-red-700";
  } else if (normalized === "high") {
    className += " bg-orange-100 text-orange-700";
  } else if (normalized === "medium") {
    className += " bg-yellow-100 text-yellow-700";
  } else {
    className += " bg-muted text-muted-foreground";
  }

  return <span className={className}>{priority}</span>;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center p-6 text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function getActivityMessage(activity: ActivityItem) {
  const metadata = activity.metadata || {};

  const { user } = useAppSelector((state) => state.auth);

  if(!user)return;

  const actor = activity.user?.id && activity.user?.id !== user.id
    ? `${activity.user.firstName} ${activity.user.lastName || ""}`.trim()
    : "You";

  switch (activity.type) {
    case "PROJECT_CREATED":
      return `${actor} created project ${metadata.projectName || ""}`;

    case "PROJECT_UPDATED":
      return `${actor} updated the project`;

    case "TASK_CREATED":
      return `${actor} created task ${
        metadata.taskTitle || metadata.taskKey || ""
      }`;

    case "TASK_UPDATED":
      return `${actor} updated task ${
        metadata.taskTitle || metadata.taskKey || ""
      }`;

    case "TASK_COMPLETED":
      return `${actor} completed task ${
        metadata.taskTitle || metadata.taskKey || ""
      }`;

    case "TASK_ASSIGNED":
      return `${actor} assigned task ${
        metadata.taskTitle || metadata.taskKey || ""
      }`;

    case "TASK_STATUS_CHANGED":
      return `${actor} changed ${
        metadata.taskTitle || metadata.taskKey || "a task"
      } from ${metadata.fromStatus || "previous status"} to ${
        metadata.toStatus || "new status"
      }`;

    case "TASK_ADDED_TO_SPRINT":
      return `${actor} added ${
        metadata.taskTitle || metadata.taskKey || "a task"
      } to sprint ${metadata.sprintName || ""}`;

    case "TASK_REMOVED_FROM_SPRINT":
      return `${actor} removed ${
        metadata.taskTitle || metadata.taskKey || "a task"
      } from sprint ${metadata.sprintName || ""}`;

    case "SPRINT_CREATED":
      return `${actor} created sprint ${metadata.sprintName || ""}`;

    case "SPRINT_STARTED":
      return `${actor} started sprint ${metadata.sprintName || ""}`;

    case "SPRINT_COMPLETED":
      return `${actor} completed sprint ${metadata.sprintName || ""}`;

    case "MEMBER_ADDED":
      return `${actor} added ${
        metadata.memberName || "a member"
      } to the project`;

    case "MEMBER_REMOVED":
      return `${actor} removed ${
        metadata.memberName || "a member"
      } from the project`;

    case "MEMBER_ROLE_UPDATED":
      return `${actor} changed ${
        metadata.memberName || "a member"
      }'s role from ${metadata.oldRole || "previous role"} to ${
        metadata.newRole || "new role"
      }`;

    case "FILE_UPLOADED":
      return `${actor} uploaded a file`;

    case "FILE_DELETED":
      return `${actor} deleted a file`;

    default:
      return `${actor} performed ${activity.type
        ?.toLowerCase()
        .replaceAll("_", " ")}`;
  }
}

function formatDate(date?: string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(date: string) {
  const now = Date.now();
  const time = new Date(date).getTime();

  const diff = Math.max(0, now - time);

  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) return "just now";

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return formatDate(date);
}

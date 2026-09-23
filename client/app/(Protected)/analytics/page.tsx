"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
  TrendingUp,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { showErrorToast } from "@/lib/toast";
import { getUserAnalytics } from "@/services/user.service";

type TaskStatus = {
  name: string;
  count: number;
  color?: string;
};

type TaskPriority = {
  name: string;
  count: number;
};

type Productivity = {
  date: string;
  completed: number;
  updated: number;
};

type ProjectAnalytics = {
  id: string;
  name: string;
  taskCount: number;
  completedTasks: number;
  progress: number;
};

type RecentActivity = {
  id: string;
  projectId: string;
  type: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
};

type AnalyticsData = {
  statistics: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    overdueTasks: number;
    taskProgress: number;
  };

  taskStatus: TaskStatus[];

  taskPriority: TaskPriority[];

  productivity: Productivity[];

  projects: ProjectAnalytics[];

  recentActivities: RecentActivity[];
};

const priorityColors: Record<string, string> = {
  URGENT: "#ef4444",
  HIGH: "#f97316",
  MEDIUM: "#eab308",
  LOW: "#22c55e",
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const response = await getUserAnalytics();

        if (response?.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        showErrorToast("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const completionRate = useMemo(() => {
    if (!data?.statistics.totalTasks) {
      return 0;
    }

    return Math.round(
      (data.statistics.completedTasks / data.statistics.totalTasks) * 100,
    );
  }, [data]);

  const projectChartData = useMemo(() => {
    if (!data?.projects) {
      return [];
    }

    return data.projects.map((project) => ({
      name:
        project.name.length > 15
          ? `${project.name.slice(0, 15)}...`
          : project.name,
      tasks: project.taskCount,
      completed: project.completedTasks,
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-sm text-muted-foreground">
          No analytics data available.
        </div>
      </div>
    );
  }

  const { statistics } = data;

  return (
    <div className="space-y-6 p-6">
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />

          <h1 className="text-2xl font-semibold">Analytics</h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Track your productivity, tasks, and overall work performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={statistics.totalTasks}
          icon={<ListTodo className="h-5 w-5" />}
        />

        <StatCard
          title="Completed"
          value={statistics.completedTasks}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />

        <StatCard
          title="In Progress"
          value={statistics.inProgressTasks}
          icon={<Clock3 className="h-5 w-5" />}
        />

        <StatCard
          title="Overdue"
          value={statistics.overdueTasks}
          icon={<AlertCircle className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Task Completion</h2>

            <p className="text-sm text-muted-foreground">
              Your overall task completion rate
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative h-40 w-40 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-muted"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  className="text-primary"
                  strokeDasharray={`${completionRate * 2.513} 251.3`}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{completionRate}%</span>

                <span className="text-xs text-muted-foreground">Completed</span>
              </div>
            </div>

            <div className="space-y-4">
              <AnalyticsValue
                label="Completed"
                value={statistics.completedTasks}
              />

              <AnalyticsValue
                label="In Progress"
                value={statistics.inProgressTasks}
              />

              <AnalyticsValue label="To Do" value={statistics.todoTasks} />

              <AnalyticsValue label="Overdue" value={statistics.overdueTasks} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Tasks by Status</h2>

            <p className="text-sm text-muted-foreground">
              Distribution of your assigned tasks
            </p>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.taskStatus}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis dataKey="name" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar dataKey="count" name="Tasks" radius={[6, 6, 0, 0]}>
                  {data.taskStatus.map((status, index) => (
                    <Cell
                      key={`status-${index}`}
                      fill={status.color || "#64748b"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />

            <h2 className="text-lg font-semibold">Productivity</h2>
          </div>

          <p className="text-sm text-muted-foreground">
            Your task activity over the last 7 days
          </p>
        </div>

        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.productivity}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis dataKey="date" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="completed"
                name="Completed"
                stroke="currentColor"
                strokeWidth={2}
                dot={{ r: 4 }}
              />

              <Line
                type="monotone"
                dataKey="updated"
                name="Updated"
                stroke="currentColor"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Tasks by Priority</h2>

            <p className="text-sm text-muted-foreground">
              Distribution of your task priorities
            </p>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.taskPriority}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={55}
                  paddingAngle={3}
                  label
                >
                  {data.taskPriority.map((priority, index) => (
                    <Cell
                      key={`priority-${index}`}
                      fill={
                        priorityColors[priority.name.toUpperCase()] || "#64748b"
                      }
                    />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />

              <h2 className="text-lg font-semibold">Tasks by Project</h2>
            </div>

            <p className="text-sm text-muted-foreground">
              Your workload across projects
            </p>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectChartData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 20,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  className="stroke-muted"
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{
                    fill: "currentColor",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{
                    fill: "currentColor",
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                  labelStyle={{
                    color: "hsl(var(--foreground))",
                  }}
                  itemStyle={{
                    color: "hsl(var(--foreground))",
                  }}
                />

                <Legend />

                <Bar
                  dataKey="tasks"
                  name="Total Tasks"
                  fill="hsl(var(--primary))"
                  radius={[0, 6, 6, 0]}
                  activeBar={false}
                />

                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#22c55e"
                  radius={[0, 6, 6, 0]}
                  activeBar={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Project Progress</h2>

          <p className="text-sm text-muted-foreground">
            Your progress across projects
          </p>
        </div>

        <div className="space-y-5">
          {data.projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No projects available.
            </p>
          ) : (
            data.projects.map((project) => (
              <div key={project.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{project.name}</p>

                    <p className="text-xs text-muted-foreground">
                      {project.completedTasks} of {project.taskCount} tasks
                      completed
                    </p>
                  </div>

                  <span className="text-sm font-semibold">
                    {project.progress}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${Math.min(Math.max(project.progress, 0), 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Activity Summary</h2>

          <p className="text-sm text-muted-foreground">
            Your recent activity across projects
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActivityCard
            label="Recent Activities"
            value={data.recentActivities.length}
          />

          <ActivityCard label="Completion Rate" value={`${completionRate}%`} />

          <ActivityCard label="Active Projects" value={data.projects.length} />

          <ActivityCard label="Total Tasks" value={statistics.totalTasks} />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>

        <div className="rounded-lg bg-muted p-2">{icon}</div>
      </div>

      <p className="mt-4 text-3xl font-bold">{value}</p>
    </div>
  );
}

function AnalyticsValue({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex min-w-[140px] items-center justify-between gap-6">
      <span className="text-sm text-muted-foreground">{label}</span>

      <span className="font-semibold">{value}</span>
    </div>
  );
}

function ActivityCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}

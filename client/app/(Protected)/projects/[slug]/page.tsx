"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
  Loader2,
  Target,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useAppSelector } from "@/redux/hooks";
import { showErrorToast } from "@/lib/toast";
import { getProjectOverview } from "@/services/project-overview.service";

type Project = {
  id: string;
  name: string;
  key: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  type?: string | null;
  visibility?: string | null;
  features?: string[];
  startDate?: string | null;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type Statistics = {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueTasks: number;
  taskProgress: number;
  totalMembers: number;
  totalSprints: number;
  activeSprints: number;
  plannedSprints: number;
  completedSprints: number;
};

type TaskStatus = {
  id: string;
  name: string;
  color?: string | null;
  count: number;
};

type TaskPriority = {
  priority: string;
  count: number;
};

type Sprint = {
  id: string;
  name: string;
  goal?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: string;
  createdAt?: string;
  _count?: {
    tasks: number;
  };
};

type Member = {
  id: string;
  userId: string;
  role?: {
    id: string;
    name: string;
    color?: string | null;
  } | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
  } | null;
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
  } | null;
};

type OverviewData = {
  project: Project;
  statistics: Statistics;
  taskStatus: TaskStatus[];
  taskPriority: TaskPriority[];
  sprints: {
    active: Sprint[];
    planned: Sprint[];
    completed: Sprint[];
    all: Sprint[];
  };
  members: Member[];
  recentActivities: ActivityItem[];
};

export default function ProjectOverviewPage() {
  const project = useAppSelector(
    (state) => state.project.currentProject
  );

  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  const projectId = project?.id;

  const loadOverview = async () => {
    if (!projectId) return;

    try {
      setLoading(true);

      const response = await getProjectOverview(projectId);

      setOverview(response.data);
    } catch (error) {
      console.error("Failed to load project overview:", error);
      showErrorToast("Failed to load project overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadOverview();
    }
  }, [projectId]);

  const formatDate = (date?: string | null) => {
    if (!date) return "Not set";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPriorityLabel = (priority: string) => {
    return priority
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getActivityMessage = (activity: ActivityItem) => {
    const metadata = activity.metadata || {};

    const taskTitle = metadata.taskTitle;
    const taskKey = metadata.taskKey;
    const sprintName = metadata.sprintName;

    switch (activity.type) {
      case "PROJECT_CREATED":
        return (
          <>
            created project{" "}
            <span className="font-medium">
              {metadata.projectName || "a project"}
            </span>
          </>
        );

      case "TASK_CREATED":
        return (
          <>
            created task{" "}
            <span className="font-medium">
              {taskTitle || taskKey || "a task"}
            </span>
          </>
        );

      case "TASK_STATUS_CHANGED":
        return (
          <>
            changed{" "}
            <span className="font-medium">
              {taskTitle || taskKey || "a task"}
            </span>{" "}
            from{" "}
            <span className="font-medium">
              {metadata.fromStatus || "previous status"}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {metadata.toStatus || "new status"}
            </span>
          </>
        );

      case "TASK_ADDED_TO_SPRINT":
        return (
          <>
            added{" "}
            <span className="font-medium">
              {taskTitle || taskKey || "a task"}
            </span>{" "}
            to sprint{" "}
            <span className="font-medium">
              {sprintName || "a sprint"}
            </span>
          </>
        );

      case "TASK_REMOVED_FROM_SPRINT":
        return (
          <>
            removed{" "}
            <span className="font-medium">
              {taskTitle || taskKey || "a task"}
            </span>{" "}
            from sprint{" "}
            <span className="font-medium">
              {sprintName || "a sprint"}
            </span>
          </>
        );

      case "SPRINT_CREATED":
        return (
          <>
            created sprint{" "}
            <span className="font-medium">
              {sprintName || "a sprint"}
            </span>
          </>
        );

      case "SPRINT_STARTED":
        return (
          <>
            started sprint{" "}
            <span className="font-medium">
              {sprintName || "a sprint"}
            </span>
          </>
        );

      case "SPRINT_COMPLETED":
        return (
          <>
            completed sprint{" "}
            <span className="font-medium">
              {sprintName || "a sprint"}
            </span>
          </>
        );

      case "FILE_UPLOADED":
        return (
          <>
            uploaded a file{" "}
            <span className="font-medium">
              {metadata.fileName || "file"}
            </span>
          </>
        );

      case "MEMBER_ADDED":
        return (
          <>
            added{" "}
            <span className="font-medium">
              {metadata.memberName || "a member"}
            </span>{" "}
            to the project
          </>
        );

      case "MEMBER_REMOVED":
        return (
          <>
            removed{" "}
            <span className="font-medium">
              {metadata.memberName || "a member"}
            </span>{" "}
            from the project
          </>
        );

      case "MEMBER_ROLE_UPDATED":
        return (
          <>
            changed{" "}
            <span className="font-medium">
              {metadata.memberName || "a member"}
            </span>
            's role from{" "}
            <span className="font-medium">
              {metadata.oldRole || "previous role"}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {metadata.newRole || "new role"}
            </span>
          </>
        );

      default:
        return (
          <>
            performed{" "}
            <span className="font-medium">
              {activity.type
                .replaceAll("_", " ")
                .toLowerCase()}
            </span>
          </>
        );
    }
  };

  const activeSprint = overview?.sprints.active?.[0];

  const activeSprintProgress = useMemo(() => {
    if (!activeSprint || !overview) return 0;

    const sprintTasks = overview.taskStatus.reduce(
      (total, status) => total + status.count,
      0
    );

    if (!sprintTasks) return 0;

    return overview.statistics.taskProgress;
  }, [activeSprint, overview]);

  if (!project || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading project overview...
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="p-6">
        <div className="rounded-lg border p-10 text-center text-muted-foreground">
          Unable to load project overview.
        </div>
      </div>
    );
  }

  const {
    statistics,
    taskStatus,
    taskPriority,
    members,
    recentActivities,
    sprints,
  } = overview;

  const maxStatusCount = Math.max(
    ...taskStatus.map((status) => status.count),
    1
  );

  const maxPriorityCount = Math.max(
    ...taskPriority.map((item) => item.count),
    1
  );

  return (
    <div className="space-y-6 p-6">
      {/* Project Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white"
                style={{
                  backgroundColor:
                    overview.project.color || "#2563EB",
                }}
              >
                {overview.project.icon ? (
                  <img
                    src={overview.project.icon}
                    alt={overview.project.name}
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  overview.project.key.slice(0, 2)
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold">
                    {overview.project.name}
                  </h1>

                  <Badge variant="secondary">
                    {overview.project.key}
                  </Badge>

                  {overview.project.type && (
                    <Badge variant="outline">
                      {overview.project.type}
                    </Badge>
                  )}
                </div>

                <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                  {overview.project.description ||
                    "No project description available."}
                </p>
              </div>
            </div>

            <Badge variant="outline">
              {overview.project.visibility || "PRIVATE"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Tasks
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {statistics.totalTasks}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-3">
                <ListTodo className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Completed
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {statistics.completedTasks}
                </p>
              </div>

              <div className="rounded-lg bg-green-500/10 p-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  In Progress
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {statistics.inProgressTasks}
                </p>
              </div>

              <div className="rounded-lg bg-blue-500/10 p-3">
                <Clock3 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Overdue
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {statistics.overdueTasks}
                </p>
              </div>

              <div className="rounded-lg bg-red-500/10 p-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress + Sprint */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Task Progress
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold">
                  {statistics.taskProgress}%
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {statistics.completedTasks} of{" "}
                  {statistics.totalTasks} tasks completed
                </p>
              </div>

              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${statistics.taskProgress}%`,
                }}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-semibold">
                  {statistics.todoTasks}
                </p>
                <p className="text-xs text-muted-foreground">
                  Todo
                </p>
              </div>

              <div>
                <p className="text-lg font-semibold">
                  {statistics.inProgressTasks}
                </p>
                <p className="text-xs text-muted-foreground">
                  In Progress
                </p>
              </div>

              <div>
                <p className="text-lg font-semibold">
                  {statistics.completedTasks}
                </p>
                <p className="text-xs text-muted-foreground">
                  Done
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5" />
              Active Sprint
            </CardTitle>
          </CardHeader>

          <CardContent>
            {activeSprint ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {activeSprint.name}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {activeSprint.goal ||
                        "No sprint goal provided."}
                    </p>
                  </div>

                  <Badge>ACTIVE</Badge>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Sprint progress
                    </span>

                    <span className="font-medium">
                      {activeSprintProgress}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${activeSprintProgress}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Tasks
                    </p>
                    <p className="mt-1 font-semibold">
                      {activeSprint._count?.tasks || 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Start
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {formatDate(activeSprint.startDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      End
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {formatDate(activeSprint.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center">
                <FolderKanban className="mx-auto h-10 w-10 text-muted-foreground/50" />

                <p className="mt-3 font-medium">
                  No active sprint
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Start a sprint to see its progress here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Task Status */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
          </CardHeader>

          <CardContent>
            {taskStatus.length > 0 ? (
              <div className="space-y-5">
                {taskStatus.map((status) => (
                  <div key={status.id}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor:
                              status.color || "#64748B",
                          }}
                        />

                        <span className="text-sm font-medium">
                          {status.name}
                        </span>
                      </div>

                      <span className="text-sm text-muted-foreground">
                        {status.count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${
                            (status.count / maxStatusCount) * 100
                          }%`,
                          backgroundColor:
                            status.color || "#64748B",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No task status data available.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
          </CardHeader>

          <CardContent>
            {taskPriority.length > 0 ? (
              <div className="space-y-5">
                {taskPriority.map((item) => (
                  <div key={item.priority}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {getPriorityLabel(item.priority)}
                      </span>

                      <span className="text-sm text-muted-foreground">
                        {item.count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${
                            (item.count / maxPriorityCount) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No priority data available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sprint Statistics + Team */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sprint Overview</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold">
                  {statistics.activeSprints}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Active
                </p>
              </div>

              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold">
                  {statistics.plannedSprints}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Planned
                </p>
              </div>

              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold">
                  {statistics.completedSprints}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Completed
                </p>
              </div>
            </div>

            {sprints.all.length > 0 && (
              <div className="mt-5 space-y-3">
                {sprints.all.slice(0, 4).map((sprint) => (
                  <div
                    key={sprint.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {sprint.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {sprint._count?.tasks || 0} tasks
                      </p>
                    </div>

                    <Badge variant="outline">
                      {sprint.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
            </CardTitle>
          </CardHeader>

          <CardContent>
            {members.length > 0 ? (
              <div className="space-y-3">
                {members.slice(0, 6).map((member) => {
                  const fullName =
                    `${member.user?.firstName || ""} ${
                      member.user?.lastName || ""
                    }`.trim() || "Unknown user";

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        {member.user?.avatar ? (
                          <img
                            src={member.user.avatar}
                            alt={fullName}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                            {fullName
                              .split(" ")
                              .map((name) => name[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-medium">
                            {fullName}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {member.role?.name || "Member"}
                          </p>
                        </div>
                      </div>

                      {member.role?.name && (
                        <Badge variant="outline">
                          {member.role.name}
                        </Badge>
                      )}
                    </div>
                  );
                })}

                {members.length > 6 && (
                  <p className="pt-2 text-center text-xs text-muted-foreground">
                    +{members.length - 6} more members
                  </p>
                )}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No project members found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>

        <CardContent>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const userName =
                  `${activity.user?.firstName || ""} ${
                    activity.user?.lastName || ""
                  }`.trim() || "Someone";

                return (
                  <div
                    key={activity.id}
                    className="flex gap-3 border-b pb-4 last:border-0 last:pb-0"
                  >
                    {activity.user?.avatar ? (
                      <img
                        src={activity.user.avatar}
                        alt={userName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {userName
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        <span className="font-medium">
                          {userName}
                        </span>{" "}
                        {getActivityMessage(activity)}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(
                          activity.createdAt
                        ).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No recent activity.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Project Details
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">
                Project Key
              </p>
              <p className="mt-1 font-medium">
                {overview.project.key}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Project Type
              </p>
              <p className="mt-1 font-medium">
                {overview.project.type || "Not set"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Visibility
              </p>
              <p className="mt-1 font-medium">
                {overview.project.visibility || "Not set"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Team Members
              </p>
              <p className="mt-1 font-medium">
                {statistics.totalMembers}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Start Date
              </p>
              <p className="mt-1 font-medium">
                {formatDate(overview.project.startDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                End Date
              </p>
              <p className="mt-1 font-medium">
                {formatDate(overview.project.endDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Total Sprints
              </p>
              <p className="mt-1 font-medium">
                {statistics.totalSprints}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Created
              </p>
              <p className="mt-1 font-medium">
                {formatDate(overview.project.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
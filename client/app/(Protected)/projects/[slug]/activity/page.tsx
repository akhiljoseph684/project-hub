"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  FileText,
  ListTodo,
  Loader2,
  PlayCircle,
  Plus,
  UserCog,
  UserMinus,
  UserPlus,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useAppSelector } from "@/redux/hooks";
import { showErrorToast } from "@/lib/toast";

import { getProjectActivities } from "@/services/project-activity.service";

interface ActivityUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}

interface ActivityItem {
  id: string;
  projectId: string;
  userId: string;
  type: string;
  metadata?: Record<string, any> | null;
  createdAt: string;
  user: ActivityUser;
}

export default function ProjectActivityPage() {
  const project = useAppSelector((state) => state.project.currentProject);

  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const [loading, setLoading] = useState(true);

  const projectId = project?.id;

  useEffect(() => {
    if (!projectId) return;

    fetchActivities();
  }, [projectId]);

  const fetchActivities = async () => {
    if (!projectId) return;

    try {
      setLoading(true);

      const response = await getProjectActivities(projectId);

      setActivities(response.activities || []);
    } catch (error) {
      console.error("Failed to fetch project activities:", error);

      showErrorToast("Failed to load project activity");
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (user?: ActivityUser) => {
    if (!user) return "Unknown user";

    return `${user.firstName} ${user.lastName}`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "PROJECT_CREATED":
        return <Plus className="h-4 w-4" />;

      case "TASK_CREATED":
        return <Plus className="h-4 w-4" />;

      case "TASK_STATUS_CHANGED":
        return <ListTodo className="h-4 w-4" />;

      case "TASK_ADDED_TO_SPRINT":
        return <CalendarDays className="h-4 w-4" />;

      case "TASK_REMOVED_FROM_SPRINT":
        return <CalendarDays className="h-4 w-4" />;

      case "SPRINT_CREATED":
        return <CalendarDays className="h-4 w-4" />;

      case "SPRINT_STARTED":
        return <PlayCircle className="h-4 w-4" />;

      case "SPRINT_COMPLETED":
        return <CheckCircle2 className="h-4 w-4" />;

      case "FILE_UPLOADED":
        return <FileText className="h-4 w-4" />;

      case "MEMBER_ADDED":
        return <UserPlus className="h-4 w-4" />;

      case "MEMBER_REMOVED":
        return <UserMinus className="h-4 w-4" />;

      case "MEMBER_ROLE_UPDATED":
        return <UserCog className="h-4 w-4" />;

      default:
        return <CircleDot className="h-4 w-4" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    const metadata = activity.metadata || {};

    const taskKey = metadata.taskKey || metadata.key;
    const taskTitle = metadata.taskTitle || metadata.title;
    const fromStatus = metadata.fromStatus || "";
    const toStatus = metadata.toStatus || "";
    const sprintName = metadata.sprintName || metadata.name;

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
            changed task{" "}
            <span className="font-medium">
              {taskTitle || taskKey || "a task"}
            </span>{" "}
            status from <span className="font-medium">{fromStatus}</span> to{" "}
            <span className="font-medium">{toStatus}</span>
          </>
        );

      case "TASK_ADDED_TO_SPRINT":
        return (
          <>
            added task{" "}
            <span className="font-medium">
              {taskTitle || taskKey || "a task"}
            </span>{" "}
            to sprint{" "}
            <span className="font-medium">{sprintName || "a sprint"}</span>
          </>
        );

      case "TASK_REMOVED_FROM_SPRINT":
        return (
          <>
            removed task{" "}
            <span className="font-medium">
              {taskTitle || taskKey || "a task"}
            </span>{" "}
            from sprint{" "}
            <span className="font-medium">{sprintName || "a sprint"}</span>
          </>
        );

      case "SPRINT_CREATED":
        return (
          <>
            created sprint{" "}
            <span className="font-medium">{sprintName || "a sprint"}</span>
          </>
        );

      case "SPRINT_STARTED":
        return (
          <>
            started sprint{" "}
            <span className="font-medium">{sprintName || "a sprint"}</span>
          </>
        );

      case "SPRINT_COMPLETED":
        return (
          <>
            completed sprint{" "}
            <span className="font-medium">{sprintName || "a sprint"}</span>
          </>
        );

      case "FILE_UPLOADED":
        return (
          <>
            uploaded a file{" "}
            <span className="font-medium">{metadata.fileName || "file"}</span>
          </>
        );

      case "MEMBER_ADDED":
        return (
          <>
            added{" "}
            <span className="font-medium">
              {metadata.memberName || "a new member"}
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
              {activity.type.replaceAll("_", " ").toLowerCase()}
            </span>
          </>
        );
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeDate = (date: string) => {
    const activityDate = new Date(date);
    const now = new Date();

    const difference = now.getTime() - activityDate.getTime();

    const minutes = Math.floor(difference / (1000 * 60));

    if (minutes < 1) {
      return "Just now";
    }

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
  };

  if (!project) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted">
            <Activity className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold">Project Activity</h1>

            <p className="text-sm text-muted-foreground">
              Recent activity in{" "}
              <span className="font-medium text-foreground">
                {project.name}
              </span>
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />

                <p className="text-sm text-muted-foreground">
                  Loading activity...
                </p>
              </div>
            </div>
          ) : activities.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <Activity className="mb-4 h-10 w-10 text-muted-foreground" />

              <h2 className="text-lg font-semibold">No activity yet</h2>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Activity from this project will appear here when tasks, sprints,
                files, or members are updated.
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute bottom-0 left-[19px] top-0 w-px bg-border" />

              <div className="space-y-7">
                {activities.map((activity) => (
                  <div key={activity.id} className="relative flex gap-4">
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background">
                      {getActivityIcon(activity.type)}
                    </div>

                    <div className="min-w-0 flex-1 pb-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="text-sm leading-6">
                          <span className="font-medium">
                            {getUserName(activity.user)}
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {getActivityText(activity)}
                          </span>
                        </div>

                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatRelativeDate(activity.createdAt)}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {activity.type.replaceAll("_", " ")}
                        </Badge>

                        <span className="text-xs text-muted-foreground">
                          {formatDate(activity.createdAt)} at{" "}
                          {formatTime(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

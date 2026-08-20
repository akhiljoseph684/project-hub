"use client";

import {
  Activity,
  CheckCircle2,
  Circle,
  FilePlus2,
  MessageSquare,
  Pencil,
  UserPlus,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface TaskActivityUser {
  id: string;
  name: string;
  avatar?: string | null;
}

export interface TaskActivityItem {
  id: string;
  type:
    | "CREATED"
    | "STATUS_CHANGED"
    | "PRIORITY_CHANGED"
    | "ASSIGNED"
    | "UNASSIGNED"
    | "COMMENTED"
    | "ATTACHMENT_ADDED"
    | "UPDATED"
    | "CHECKLIST_COMPLETED";

  message: string;
  createdAt: string;

  user?: TaskActivityUser | null;
}

interface TaskActivityProps {
  activities: TaskActivityItem[];
}

export default function TaskActivity({ activities }: TaskActivityProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-muted-foreground" />

        <h3 className="text-sm font-semibold">Activity</h3>

        {activities.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {activities.length}
          </span>
        )}
      </div>

      <Separator />

      {activities.length > 0 ? (
        <div className="space-y-5">
          {activities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              isLast={index === activities.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <Activity className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />

          <p className="text-sm font-medium">No activity yet</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Changes to this task will appear here.
          </p>
        </div>
      )}
    </section>
  );
}

interface ActivityItemProps {
  activity: TaskActivityItem;
  isLast: boolean;
}

function ActivityItem({ activity, isLast }: ActivityItemProps) {
  return (
    <div className="relative flex gap-3">
      {!isLast && (
        <div className="absolute left-[15px] top-8 bottom-[-20px] w-px bg-border" />
      )}

      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
        <ActivityIcon type={activity.type} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          {activity.user && (
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarImage
                src={activity.user.avatar ?? undefined}
                alt={activity.user.name}
              />

              <AvatarFallback className="text-[10px]">
                {getInitials(activity.user.name)}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="min-w-0">
            <p className="text-sm leading-5">
              {activity.user && (
                <span className="font-medium">{activity.user.name} </span>
              )}

              <span className="text-muted-foreground">{activity.message}</span>
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {formatActivityDate(activity.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityIcon({ type }: { type: TaskActivityItem["type"] }) {
  switch (type) {
    case "CREATED":
      return <Circle className="h-3.5 w-3.5 text-emerald-500" />;

    case "STATUS_CHANGED":
      return <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />;

    case "PRIORITY_CHANGED":
      return <Pencil className="h-3.5 w-3.5 text-amber-500" />;

    case "ASSIGNED":
      return <UserPlus className="h-3.5 w-3.5 text-purple-500" />;

    case "UNASSIGNED":
      return <UserRound className="h-3.5 w-3.5 text-muted-foreground" />;

    case "COMMENTED":
      return <MessageSquare className="h-3.5 w-3.5 text-blue-500" />;

    case "ATTACHMENT_ADDED":
      return <FilePlus2 className="h-3.5 w-3.5 text-cyan-500" />;

    case "CHECKLIST_COMPLETED":
      return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;

    case "UPDATED":
    default:
      return <Pencil className="h-3.5 w-3.5 text-muted-foreground" />;
  }
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatActivityDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

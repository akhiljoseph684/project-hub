"use client";

import { CalendarDays, User, Flag, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { TaskDetailsData } from "./task-details-dialog";

interface TaskDetailsProps {
  task: TaskDetailsData;
}

const priorityConfig = {
  LOW: {
    label: "Low",
    className: "text-emerald-500",
  },
  MEDIUM: {
    label: "Medium",
    className: "text-amber-500",
  },
  HIGH: {
    label: "High",
    className: "text-orange-500",
  },
  URGENT: {
    label: "Urgent",
    className: "text-red-500",
  },
};

export default function TaskDetails({ task }: TaskDetailsProps) {
  const priority = priorityConfig[task.priority];

  return (
    <section className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Description</h3>

        {task.description ? (
          <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {task.description}
          </p>
        ) : (
          <p className="text-sm italic text-muted-foreground">
            No description added.
          </p>
        )}
      </div>

      <Separator />

      <div>
        <h3 className="mb-4 text-sm font-semibold">Task Information</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <span
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: task.status.color,
                }}
              />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Status</p>

              <p className="text-sm font-medium">{task.status.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Flag className={`h-4 w-4 ${priority.className}`} />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Priority</p>

              <p className="text-sm font-medium">{priority.label}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Assignee</p>

              <p className="truncate text-sm font-medium">
                {task.assignee?.name || "Unassigned"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Due Date</p>

              <p className="text-sm font-medium">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No due date"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />

          <h3 className="text-sm font-semibold">Labels</h3>
        </div>

        {task.labels && task.labels.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {task.labels.map((label) => (
              <Badge
                key={label.id}
                variant="secondary"
                style={{
                  backgroundColor: `${label.color}20`,
                  color: label.color,
                  borderColor: `${label.color}40`,
                }}
              >
                {label.name}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-muted-foreground">
            No labels added.
          </p>
        )}
      </div>
    </section>
  );
}

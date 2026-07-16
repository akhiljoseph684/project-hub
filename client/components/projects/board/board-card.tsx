"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Flag,
} from "lucide-react";

export interface BoardTask {
  id: string;
  key: string;
  title: string;
  description?: string;

  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";

  labels?: {
    id: string;
    name: string;
    color: string;
  }[];

  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };

  dueDate?: string;

  commentsCount?: number;
  attachmentsCount?: number;

  checklist?: {
    completed: number;
    total: number;
  };

  onClick?: () => void;
}

interface BoardCardProps {
  task: BoardTask;
}

const priorityColor = {
  LOW: "text-emerald-500",
  MEDIUM: "text-amber-500",
  HIGH: "text-orange-500",
  URGENT: "text-red-500",
};

export default function BoardCard({ task }: BoardCardProps) {
  return (
    <Card
      onClick={task.onClick}
      className="group cursor-pointer rounded-xl border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <Badge variant="outline" className="font-mono text-xs">
          {task.key}
        </Badge>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Flag className={cn("h-4 w-4", priorityColor[task.priority])} />
            </TooltipTrigger>

            <TooltipContent>{task.priority} Priority</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <h3 className="line-clamp-2 text-sm font-semibold leading-6">
        {task.title}
      </h3>

      {task.description && (
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {task.description}
        </p>
      )}

      {task.labels && task.labels.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
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
      )}

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-3 text-muted-foreground">
          {task.commentsCount ? (
            <div className="flex items-center gap-1 text-xs">
              <MessageSquare className="h-4 w-4" />
              {task.commentsCount}
            </div>
          ) : null}

          {task.attachmentsCount ? (
            <div className="flex items-center gap-1 text-xs">
              <Paperclip className="h-4 w-4" />
              {task.attachmentsCount}
            </div>
          ) : null}

          {task.checklist && (
            <div className="flex items-center gap-1 text-xs">
              <CheckSquare className="h-4 w-4" />
              {task.checklist.completed}/{task.checklist.total}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}

          {task.assignee && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={task.assignee.avatar} />

                    <AvatarFallback>
                      {task.assignee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>

                <TooltipContent>{task.assignee.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </Card>
  );
}

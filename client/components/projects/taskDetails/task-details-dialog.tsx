"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";

import TaskDetails from "./task-details";
import TaskComments from "./task-comments";
import TaskAttachments from "./task-attachments";
import TaskChecklist from "./task-checklist";

export interface TaskDetailsData {
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

  comments?: {
    id: string;
    content: string;
    createdAt: string;

    user: {
      id: string;
      name: string;
      avatar?: string | null;
    };
  }[];

  attachments?: {
    id: string;
    fileName: string;
    fileUrl: string;
    mimeType?: string | null;
    size?: number | null;

    uploadedBy: {
      id: string;
      name: string;
      avatar?: string | null;
    };

    createdAt: string;
  }[];

  checklists?: {
    id: string;
    title: string;
    isCompleted: boolean;
    position: number;
  }[];
}

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskDetailsData | null;
}

export default function TaskDetailsDialog({
  open,
  onOpenChange,
  task,
}: TaskDetailsDialogProps) {
  if (!task) return null;
  console.log(task)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
    flex
    h-[90vh]
    w-[calc(100%-1rem)]
    max-w-4xl
    flex-col
    gap-0
    overflow-hidden
    p-0

    sm:w-[calc(100%-2rem)]

    lg:max-w-6xl
    xl:max-w-7xl
  "
      >
        <DialogHeader
          className="
            shrink-0
            border-b
            px-4
            py-4
            sm:px-6
            sm:py-5
          "
        >
          <DialogTitle
            className="
              flex
              min-w-0
              items-center
              gap-2
              sm:gap-3
            "
          >
            <span
              className="
                shrink-0
                font-mono
                text-xs
                text-muted-foreground
                sm:text-sm
              "
            >
              {task.key}
            </span>

            <span className="truncate text-base sm:text-lg">{task.title}</span>
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm">
            View and manage task details, checklist, attachments and comments.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div
              className="
                w-full
                space-y-8
                p-4
                sm:p-6
              "
            >
              <TaskDetails task={task} />

              <TaskChecklist
                taskId={task.id}
                checklists={task.checklists ?? []}
              />

              <TaskAttachments
                taskId={task.id}
                attachments={task.attachments ?? []}
              />

              <TaskComments taskId={task.id} comments={task.comments ?? []} />
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

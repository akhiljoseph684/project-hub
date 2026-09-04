"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { removeTaskFromSprint } from "@/services/task.service";

import type { Sprint } from "@/services/sprint.service";

interface ShowSprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  sprint: Sprint | null;

  loading?: boolean;
  processing?: boolean;

  projectId: string;

  onStartSprint: (sprintId: string) => void;
  onCompleteSprint: (sprintId: string) => void;

  onTaskRemoved: () => void;
}

export default function ShowSprintDialog({
  open,
  onOpenChange,
  sprint,
  loading = false,
  processing = false,
  projectId,
  onStartSprint,
  onCompleteSprint,
  onTaskRemoved,
}: ShowSprintDialogProps) {
  if (!sprint) return null;

  const handleRemoveTask = async (taskId: string) => {
    try {
      await removeTaskFromSprint(projectId, taskId);

      onTaskRemoved();
    } catch (error) {
      console.error("Failed to remove task from sprint:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-1rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{sprint.name}</DialogTitle>

          <DialogDescription>
            View and manage sprint details and tasks.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Loading sprint details...
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Status</p>

                <p className="mt-1 text-sm font-medium">{sprint.status}</p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Tasks</p>

                <p className="mt-1 text-sm font-medium">
                  {sprint.tasks?.length ?? sprint._count?.tasks ?? 0}
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Start Date</p>

                <p className="mt-1 text-sm font-medium">
                  {sprint.startDate
                    ? new Date(sprint.startDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">End Date</p>

                <p className="mt-1 text-sm font-medium">
                  {sprint.endDate
                    ? new Date(sprint.endDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
            </div>

            {sprint.goal && (
              <div className="mt-5">
                <p className="mb-1 text-sm font-semibold">Sprint Goal</p>

                <p className="text-sm text-muted-foreground">{sprint.goal}</p>
              </div>
            )}

            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Sprint Tasks</h3>

                <span className="text-xs text-muted-foreground">
                  {sprint.tasks?.length ?? 0} tasks
                </span>
              </div>

              {sprint.tasks && sprint.tasks.length > 0 ? (
                <div className="space-y-2">
                  {sprint.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <span className="text-xs font-medium text-muted-foreground">
                        {task.key}
                      </span>

                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {task.title}
                      </span>

                      {task.status && (
                        <span className="rounded-full bg-muted px-2 py-1 text-xs">
                          {task.status.name}
                        </span>
                      )}

                      {task.priority && (
                        <span className="hidden text-xs text-muted-foreground sm:block">
                          {task.priority}
                        </span>
                      )}

                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={processing}
                        onClick={() => handleRemoveTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No tasks in this sprint.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              {sprint.status === "PLANNED" && (
                <Button
                  type="button"
                  onClick={() => onStartSprint(sprint.id)}
                  disabled={processing}
                >
                  {processing ? "Starting..." : "Start Sprint"}
                </Button>
              )}

              {sprint.status === "ACTIVE" && (
                <Button
                  type="button"
                  onClick={() => onCompleteSprint(sprint.id)}
                  disabled={processing}
                >
                  {processing ? "Completing..." : "Complete Sprint"}
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={processing}
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

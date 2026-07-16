"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import TaskForm from "./task-form";

interface ProjectStatus {
  id: string;
  name: string;
  color: string;
}

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role?: string;
}

interface ProjectLabel {
  id: string;
  name: string;
  color: string;
}

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  projectId: string;

  statuses: ProjectStatus[];

  members: ProjectMember[];

  labels: ProjectLabel[];

  defaultStatusId?: string;

  onSuccess?: () => void;
}

export default function CreateTaskDialog({
  open,
  onOpenChange,
  projectId,
  statuses,
  members,
  labels,
  defaultStatusId,
  onSuccess,
}: CreateTaskDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>

          <DialogDescription>
            Create a new task for this project.
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          projectId={projectId}
          statuses={statuses}
          members={members}
          labels={labels}
          defaultStatusId={defaultStatusId}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

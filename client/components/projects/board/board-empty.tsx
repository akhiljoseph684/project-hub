"use client";

import { Button } from "@/components/ui/button";
import { FolderKanban, Plus } from "lucide-react";

interface BoardEmptyProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onCreateTask?: () => void;
}

export default function BoardEmpty({
  title = "No tasks found",
  description = "This board doesn't have any tasks yet. Create your first task to start collaborating with your team.",
  buttonText = "Create Task",
  onCreateTask,
}: BoardEmptyProps) {
  return (
    <div className="flex min-h-[500px] w-full items-center justify-center rounded-xl border border-dashed bg-muted/20 p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <FolderKanban className="h-10 w-10 text-primary" />
        </div>

        <h2 className="mt-6 text-2xl font-semibold tracking-tight">{title}</h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        <Button className="mt-8" size="lg" onClick={onCreateTask}>
          <Plus className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

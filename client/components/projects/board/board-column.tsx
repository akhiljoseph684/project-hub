"use client";

import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface BoardColumnProps {
  id: string;
  title: string;
  color?: string;
  taskCount?: number;
  children: ReactNode;

  onCreateTask?: () => void;
}

export default function BoardColumn({
  id,
  title,
  color = "#3B82F6",
  taskCount = 0,
  children,
  onCreateTask,
}: BoardColumnProps) {
  return (
    <div
      id={id}
      className="flex h-full min-w-[320px] max-w-[320px] flex-col rounded-xl border bg-muted/30"
    >
      <div className="sticky top-0 z-10 rounded-t-xl border-b bg-background/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: color,
              }}
            />

            <h3 className="font-semibold">{title}</h3>

            <Badge variant="secondary">{taskCount}</Badge>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={onCreateTask}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div
          className={cn(
            "flex min-h-[500px] flex-col gap-3 p-3",
            taskCount === 0 &&
              "items-center justify-center"
          )}
        >
          {taskCount > 0 ? (
            children
          ) : (
            <EmptyColumn />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function EmptyColumn() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Plus className="h-6 w-6 text-muted-foreground" />
      </div>

      <h4 className="font-medium">No Tasks</h4>

      <p className="mt-1 text-sm text-muted-foreground">
        Drag a task here
        <br />
        or create a new one.
      </p>
    </div>
  );
}
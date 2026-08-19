"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DroppableColumnProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export default function DroppableColumn({
  id,
  children,
  className,
}: DroppableColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-full transition-colors duration-200",
        isOver && "rounded-xl bg-primary/5",
        className,
      )}
    >
      {children}
    </div>
  );
}

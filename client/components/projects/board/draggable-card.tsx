"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import BoardCard, { BoardTask } from "./board-card";

interface DraggableCardProps {
  task: BoardTask;
  columnId: string;
}

export default function DraggableCard({ task, columnId }: DraggableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,

    data: {
      type: "task",
      task,
      columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 9999 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none select-none"
    >
      <BoardCard task={task} />
    </div>
  );
}

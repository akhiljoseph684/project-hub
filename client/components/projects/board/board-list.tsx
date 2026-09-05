"use client";

import {
  DndContext,
  closestCorners,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import BoardColumn from "./board-column";
import DraggableCard from "./draggable-card";
import { BoardTask } from "./board-card";
import { updateTaskStatus } from "@/services/task.service";
import { showErrorToast } from "@/lib/toast";

export interface BoardColumnData {
  id: string;
  title: string;
  color: string;
  tasks: BoardTask[];
}

interface BoardListProps {
  projectId: string;

  columns: BoardColumnData[];

  setColumns: React.Dispatch<React.SetStateAction<BoardColumnData[]>>;

  onTaskClick?: (task: BoardTask) => void;

  onCreateTask?: (columnId: string) => void;

  onCreateStatus?: () => void;

  onDeleteStatus?: (status: any) => void;
}

export default function BoardList({
  projectId,
  columns,
  setColumns,
  onTaskClick,
  onCreateTask,
  onCreateStatus,
  onDeleteStatus,
}: BoardListProps) {
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 500,
        tolerance: 8,
      },
    }),

    useSensor(KeyboardSensor),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);

    const targetColumn = columns.find((column) =>
      column.tasks.some((task) => task.id === taskId),
    );

    if (!targetColumn) return;

    const newStatusId = targetColumn.id;

    try {
      await updateTaskStatus(projectId, taskId, newStatusId);
    } catch (error: any) {
      console.error("Failed to update task status:", error);

      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update task status",
      );
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeColumnId = active.data.current?.columnId;

    const overColumnId = over.data.current?.columnId ?? over.id;

    if (!activeColumnId) return;

    if (activeColumnId === overColumnId) return;

    setColumns((prev) => {
      const updated = structuredClone(prev);

      const source = updated.find((column) => column.id === activeColumnId);

      const target = updated.find((column) => column.id === overColumnId);

      if (!source || !target) {
        return prev;
      }

      const index = source.tasks.findIndex((task) => task.id === active.id);

      if (index === -1) {
        return prev;
      }

      const [task] = source.tasks.splice(index, 1);

      target.tasks.push(task);

      return updated;
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto overflow-y-hidden">
        <div className="flex h-full gap-5 pb-4">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              taskCount={column.tasks.length}
              onCreateTask={() => onCreateTask?.(column.id)}
              onDeleteStatus={onDeleteStatus}
            >
              <SortableContext
                items={column.tasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {column.tasks.map((task) => (
                    <DraggableCard
                      key={task.id}
                      task={{
                        ...task,
                        onClick: () => onTaskClick?.(task),
                      }}
                      columnId={column.id}
                    />
                  ))}
                </div>
              </SortableContext>
            </BoardColumn>
          ))}

          <Button
            type="button"
            variant="outline"
            className="min-w-[180px] shrink-0"
            onClick={() => {
              onCreateStatus?.();
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Status
          </Button>
        </div>
      </div>
    </DndContext>
  );
}

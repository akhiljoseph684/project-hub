"use client";

import BoardColumn from "./board-column";
import BoardCard, { BoardTask } from "./board-card";

export interface BoardColumnData {
  id: string;
  title: string;
  color: string;
  tasks: BoardTask[];
}

interface BoardListProps {
  columns: BoardColumnData[];

  onTaskClick?: (task: BoardTask) => void;

  onCreateTask?: (columnId: string) => void;
}

export default function BoardList({
  columns,
  onTaskClick,
  onCreateTask,
}: BoardListProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex h-full gap-5 pb-4">
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            taskCount={column.tasks.length}
            onCreateTask={() => onCreateTask?.(column.id)}
          >
            {column.tasks.map((task) => (
              <BoardCard
                key={task.id}
                task={{
                  ...task,
                  onClick: () => onTaskClick?.(task),
                }}
              />
            ))}
          </BoardColumn>
        ))}
      </div>
    </div>
  );
}

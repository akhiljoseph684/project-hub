"use client";

import { CalendarDays, GanttChartSquare, LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type BoardView = "board" | "list" | "calendar" | "timeline";

interface BoardViewSwitcherProps {
  value: BoardView;
  onChange: (view: BoardView) => void;
}

const views = [
  {
    value: "board",
    label: "Board",
    icon: LayoutGrid,
  },
  {
    value: "list",
    label: "List",
    icon: List,
  },
  {
    value: "calendar",
    label: "Calendar",
    icon: CalendarDays,
  },
  {
    value: "timeline",
    label: "Timeline",
    icon: GanttChartSquare,
  },
] as const;

export default function BoardViewSwitcher({
  value,
  onChange,
}: BoardViewSwitcherProps) {
  return (
    <div className="inline-flex items-center rounded-lg border bg-background p-1">
      {views.map((view) => {
        const Icon = view.icon;

        return (
          <Button
            key={view.value}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(view.value)}
            className={cn(
              "gap-2 rounded-md transition-all",
              value === view.value &&
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            )}
          >
            <Icon className="h-4 w-4" />

            <span className="hidden md:inline">{view.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

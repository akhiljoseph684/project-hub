"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  CalendarDays,
  GanttChartSquare,
  RotateCcw,
  Plus,
} from "lucide-react";

interface BoardToolbarProps {
  search?: string;
  onSearchChange?: (value: string) => void;

  sprint?: string;
  onSprintChange?: (value: string) => void;

  assignee?: string;
  onAssigneeChange?: (value: string) => void;

  priority?: string;
  onPriorityChange?: (value: string) => void;

  view?: "board" | "list" | "calendar" | "timeline";
  onViewChange?: (value: "board" | "list" | "calendar" | "timeline") => void;

  onResetFilters?: () => void;
  onCreateTask?: () => void;
}

export default function BoardToolbar({
  search = "",
  onSearchChange,
  sprint = "all",
  onSprintChange,
  assignee = "all",
  onAssigneeChange,
  priority = "all",
  onPriorityChange,
  view = "board",
  onViewChange,
  onResetFilters,
  onCreateTask,
}: BoardToolbarProps) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-3 lg:flex-row">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search tasks..."
              className="pl-10"
            />
          </div>

          <Separator orientation="vertical" className="hidden h-9 lg:block" />

          <Select value={assignee} onValueChange={onAssigneeChange}>
            <SelectTrigger className="w-full lg:w-[170px]">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="me">Assigned to Me</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priority} onValueChange={onPriorityChange}>
            <SelectTrigger className="w-full lg:w-[170px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onResetFilters}
            title="Reset Filters"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>

          <Button onClick={onCreateTask}>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Filter, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  id: string;
  name: string;
}

export interface BoardFiltersValue {
  status: string;
  assignee: string;
  priority: string;
  label: string;
}

interface BoardFiltersProps {
  value: BoardFiltersValue;

  statuses: Option[];
  members: Option[];
  labels: Option[];

  onChange: (filters: BoardFiltersValue) => void;

  onReset?: () => void;
}

export default function BoardFilters({
  value,
  statuses,
  members,
  labels,
  onChange,
  onReset,
}: BoardFiltersProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[340px]">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Filters</h4>

            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>


          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>

            <Select
              value={value.status}
              onValueChange={(status) =>
                onChange({
                  ...value,
                  status,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>

                {statuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          <div className="space-y-2">
            <label className="text-sm font-medium">Assignee</label>

            <Select
              value={value.assignee}
              onValueChange={(assignee) =>
                onChange({
                  ...value,
                  assignee,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Everyone" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Everyone</SelectItem>

                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>

            <Select
              value={value.priority}
              onValueChange={(priority) =>
                onChange({
                  ...value,
                  priority,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>

                <SelectItem value="LOW">Low</SelectItem>

                <SelectItem value="MEDIUM">Medium</SelectItem>

                <SelectItem value="HIGH">High</SelectItem>

                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>


          <div className="space-y-2">
            <label className="text-sm font-medium">Label</label>

            <Select
              value={value.label}
              onValueChange={(label) =>
                onChange({
                  ...value,
                  label,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Labels" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Labels</SelectItem>

                {labels.map((label) => (
                  <SelectItem key={label.id} value={label.id}>
                    {label.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

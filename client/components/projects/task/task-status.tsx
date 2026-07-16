"use client";

import { UseFormReturn } from "react-hook-form";
import { Circle } from "lucide-react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

import { CreateTaskInput } from "@/lib/validations/task";

interface ProjectStatus {
  id: string;
  name: string;
  color: string;
}

interface TaskStatusProps {
  form: UseFormReturn<CreateTaskInput>;
  statuses: ProjectStatus[];
  loading?: boolean;
}

export default function TaskStatus({
  form,
  statuses,
  loading = false,
}: TaskStatusProps) {
  return (
    <FormField
      control={form.control}
      name="statusId"
      render={({ field }) => {
        const currentStatus = statuses.find(
          (status) => status.id === field.value,
        );

        return (
          <FormItem>
            <FormLabel>Status</FormLabel>

            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={loading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status">
                    {currentStatus && (
                      <div className="flex items-center gap-2">
                        <Circle
                          className="h-3 w-3 fill-current"
                          style={{
                            color: currentStatus.color,
                          }}
                        />

                        <span>{currentStatus.name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {statuses.length > 0 ? (
                  statuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      <div className="flex items-center gap-3">
                        <Circle
                          className="h-3 w-3 fill-current"
                          style={{
                            color: status.color,
                          }}
                        />

                        <span>{status.name}</span>

                        <Badge variant="secondary" className="ml-auto">
                          Workflow
                        </Badge>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    No workflow statuses found.
                  </div>
                )}
              </SelectContent>
            </Select>

            <FormDescription>
              Choose the initial workflow status for this task.
            </FormDescription>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

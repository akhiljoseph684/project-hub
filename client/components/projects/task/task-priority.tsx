"use client";

import { UseFormReturn } from "react-hook-form";
import { Flag } from "lucide-react";

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

interface TaskPriorityProps {
  form: UseFormReturn<CreateTaskInput>;
}

const priorities = [
  {
    value: "LOW",
    label: "Low",
    color: "bg-emerald-500",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    color: "bg-amber-500",
  },
  {
    value: "HIGH",
    label: "High",
    color: "bg-orange-500",
  },
  {
    value: "URGENT",
    label: "Urgent",
    color: "bg-red-500",
  },
] as const;

export default function TaskPriority({ form }: TaskPriorityProps) {
  return (
    <FormField
      control={form.control}
      name="priority"
      render={({ field }) => {
        const current = priorities.find(
          (priority) => priority.value === field.value,
        );

        return (
          <FormItem>
            <FormLabel>Priority</FormLabel>

            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority">
                    {current && (
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${current.color}`}
                        />

                        <span>{current.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${priority.color}`}
                      />

                      <span>{priority.label}</span>

                      <Badge variant="secondary" className="ml-auto">
                        <Flag className="mr-1 h-3 w-3" />
                        {priority.value}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormDescription>
              Set the urgency level of this task.
            </FormDescription>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

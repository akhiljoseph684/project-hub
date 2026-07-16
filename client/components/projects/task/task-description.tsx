"use client";

import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { CreateTaskInput } from "@/lib/validations/task";

interface TaskDescriptionProps {
  form: UseFormReturn<CreateTaskInput>;
}

export default function TaskDescription({ form }: TaskDescriptionProps) {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>

          <FormControl>
            <Textarea
              {...field}
              value={field.value ?? ""}
              placeholder="Describe the task, requirements, acceptance criteria, or any additional details..."
              rows={8}
              className="min-h-[180px] resize-y"
            />
          </FormControl>

          <FormDescription>
            Add all the information your team needs to complete this task.
          </FormDescription>

          <div className="flex items-center justify-between">
            <FormMessage />

            <span className="text-xs text-muted-foreground">
              {field.value?.length ?? 0}/5000
            </span>
          </div>
        </FormItem>
      )}
    />
  );
}

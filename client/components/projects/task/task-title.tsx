"use client";

import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { CreateTaskInput } from "@/lib/validations/task";

interface TaskTitleProps {
  form: UseFormReturn<CreateTaskInput>;
}

export default function TaskTitle({ form }: TaskTitleProps) {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Task Title
            <span className="ml-1 text-destructive">*</span>
          </FormLabel>

          <FormControl>
            <Input
              {...field}
              placeholder="Enter task title..."
              autoComplete="off"
              maxLength={120}
            />
          </FormControl>

          <p className="text-xs text-muted-foreground">
            Give your task a short and descriptive title.
          </p>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

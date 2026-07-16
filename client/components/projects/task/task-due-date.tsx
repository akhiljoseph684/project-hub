"use client";

import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";
import { CreateTaskInput } from "@/lib/validations/task";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TaskDueDateProps {
  form: UseFormReturn<CreateTaskInput>;
}

export default function TaskDueDate({ form }: TaskDueDateProps) {
  return (
    <FormField
      control={form.control}
      name="dueDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Due Date</FormLabel>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />

                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Select due date</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => field.onChange(date)}
                />
              </PopoverContent>
            </Popover>

            {field.value && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => field.onChange(undefined)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <FormDescription>
            Set a deadline for completing this task.
          </FormDescription>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

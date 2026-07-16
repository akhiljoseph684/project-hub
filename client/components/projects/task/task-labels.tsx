"use client";

import { UseFormReturn } from "react-hook-form";
import { Check, Tag } from "lucide-react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { CreateTaskInput } from "@/lib/validations/task";

interface ProjectLabel {
  id: string;
  name: string;
  color: string;
}

interface TaskLabelsProps {
  form: UseFormReturn<CreateTaskInput>;
  labels: ProjectLabel[];
  loading?: boolean;
}

export default function TaskLabels({
  form,
  labels,
  loading = false,
}: TaskLabelsProps) {
  return (
    <FormField
      control={form.control}
      name="labels"
      render={({ field }) => {
        const selectedLabels = labels.filter((label) =>
          field.value?.includes(label.id),
        );

        const toggleLabel = (labelId: string) => {
          const current = field.value || [];

          if (current.includes(labelId)) {
            field.onChange(current.filter((id) => id !== labelId));
          } else {
            field.onChange([...current, labelId]);
          }
        };

        return (
          <FormItem className="flex flex-col">
            <FormLabel>Labels</FormLabel>

            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    className="min-h-11 justify-start"
                  >
                    <Tag className="mr-2 h-4 w-4" />

                    {selectedLabels.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedLabels.map((label) => (
                          <Badge
                            key={label.id}
                            variant="secondary"
                            style={{
                              backgroundColor: `${label.color}20`,
                              color: label.color,
                              borderColor: `${label.color}40`,
                            }}
                          >
                            {label.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        Select labels
                      </span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>

              <PopoverContent className="w-[320px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search labels..." />

                  <CommandList>
                    <CommandEmpty>No labels found.</CommandEmpty>

                    <CommandGroup>
                      {labels.map((label) => {
                        const selected = field.value?.includes(label.id);

                        return (
                          <CommandItem
                            key={label.id}
                            value={label.name}
                            onSelect={() => toggleLabel(label.id)}
                          >
                            <span
                              className="mr-3 h-3 w-3 rounded-full"
                              style={{
                                backgroundColor: label.color,
                              }}
                            />

                            <span className="flex-1">{label.name}</span>

                            <Check
                              className={cn(
                                "h-4 w-4",
                                selected ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {selectedLabels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedLabels.map((label) => (
                  <Badge
                    key={label.id}
                    variant="secondary"
                    style={{
                      backgroundColor: `${label.color}20`,
                      color: label.color,
                      borderColor: `${label.color}40`,
                    }}
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>
            )}

            <FormDescription>
              Add one or more labels to help categorize this task.
            </FormDescription>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

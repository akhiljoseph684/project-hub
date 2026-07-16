"use client";

import { UseFormReturn } from "react-hook-form";
import { Check, User2 } from "lucide-react";

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

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import { CreateTaskInput } from "@/lib/validations/task";

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role?: string;
}

interface TaskAssigneeProps {
  form: UseFormReturn<CreateTaskInput>;
  members: ProjectMember[];
  loading?: boolean;
}

export default function TaskAssignee({
  form,
  members,
  loading = false,
}: TaskAssigneeProps) {
  return (
    <FormField
      control={form.control}
      name="assigneeId"
      render={({ field }) => {
        const selectedMember = members.find(
          (member) => member.id === field.value,
        );

        return (
          <FormItem className="flex flex-col">
            <FormLabel>Assignee</FormLabel>

            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    className={cn(
                      "justify-start",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {selectedMember ? (
                      <>
                        <Avatar className="mr-3 h-7 w-7">
                          <AvatarImage src={selectedMember.avatar ?? ""} />
                          <AvatarFallback>
                            {selectedMember.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col items-start">
                          <span>{selectedMember.name}</span>

                          <span className="text-xs text-muted-foreground">
                            {selectedMember.email}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <User2 className="mr-2 h-4 w-4" />
                        Select Assignee
                      </>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>

              <PopoverContent className="w-[340px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search members..." />

                  <CommandList>
                    <CommandEmpty>No member found.</CommandEmpty>

                    <CommandGroup>
                      {members.map((member) => (
                        <CommandItem
                          key={member.id}
                          value={`${member.name} ${member.email}`}
                          onSelect={() => field.onChange(member.id)}
                        >
                          <Avatar className="mr-3 h-8 w-8">
                            <AvatarImage src={member.avatar ?? ""} />

                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex flex-1 flex-col">
                            <span className="font-medium">{member.name}</span>

                            <span className="text-xs text-muted-foreground">
                              {member.email}
                            </span>
                          </div>

                          <Check
                            className={cn(
                              "h-4 w-4",
                              member.id === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <FormDescription>
              Select the project member responsible for this task.
            </FormDescription>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

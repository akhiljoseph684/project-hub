"use client";

import { UseFormReturn } from "react-hook-form";
import {
  LayoutDashboard,
  CheckSquare,
  GitBranch,
  ListTodo,
  Flag,
  CalendarDays,
  FolderOpen,
  Clock3,
} from "lucide-react";

import { CreateProjectInput } from "@/lib/validations/project";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";

interface Props {
  form: UseFormReturn<CreateProjectInput>;
}

const FEATURES = [
  {
    id: "BOARD",
    title: "Board View",
    description: "Kanban board for task management.",
    icon: LayoutDashboard,
    required: true,
  },
  {
    id: "TASKS",
    title: "Task Management",
    description: "Create and assign tasks.",
    icon: CheckSquare,
    required: true,
  },
  {
    id: "SPRINTS",
    title: "Sprint Planning",
    description: "Plan agile sprints.",
    icon: GitBranch,
    required: false,
  },
  {
    id: "BACKLOG",
    title: "Backlog",
    description: "Manage product backlog.",
    icon: ListTodo,
    required: false,
  },
  {
    id: "MILESTONES",
    title: "Milestones",
    description: "Track important goals.",
    icon: Flag,
    required: false,
  },
  {
    id: "CALENDAR",
    title: "Calendar",
    description: "Calendar view.",
    icon: CalendarDays,
    required: false,
  },
  {
    id: "FILES",
    title: "File Attachments",
    description: "Upload project files.",
    icon: FolderOpen,
    required: false,
  },
  {
    id: "TIME_TRACKING",
    title: "Time Tracking",
    description: "Track working hours.",
    icon: Clock3,
    required: false,
  },
] as const;

export default function ProjectFeatures({ form }: Props) {
  const projectType = form.watch("type");
  const selectedFeatures = form.watch("features");
  useEffect(() => {
    if (projectType === "KANBAN") {
      const features = form
        .getValues("features")
        .filter((feature) => feature !== "SPRINTS" && feature !== "BACKLOG");

      form.setValue("features", features, {
        shouldValidate: true,
      });
    }
  }, [projectType, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Features</CardTitle>

        <CardDescription>Enable the modules your team needs.</CardDescription>
      </CardHeader>

      <CardContent>
        <FormField
          control={form.control}
          name="features"
          render={() => (
            <FormItem>
              <FormLabel>Features</FormLabel>

              <div className="grid gap-4 md:grid-cols-2">
                {FEATURES.map((feature) => {
                  const Icon = feature.icon;

                  const isDisabled =
                    feature.required ||
                    (projectType === "KANBAN" &&
                      (feature.id === "SPRINTS" || feature.id === "BACKLOG"));

                  const checked =
                    !(
                      projectType === "KANBAN" &&
                      (feature.id === "SPRINTS" || feature.id === "BACKLOG")
                    ) && selectedFeatures.includes(feature.id as any);

                  return (
                    <div
                      key={feature.id}
                      className={`rounded-xl border p-4 transition ${
                        checked ? "border-primary bg-primary/5" : ""
                      } ${isDisabled ? "opacity-80" : ""}`}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={checked}
                          disabled={isDisabled}
                          onCheckedChange={(value) => {
                            if (feature.required) return;

                            if (
                              projectType === "KANBAN" &&
                              (feature.id === "SPRINTS" ||
                                feature.id === "BACKLOG")
                            )
                              return;

                            const current = form.getValues("features");

                            if (value) {
                              form.setValue("features", [
                                ...current,
                                feature.id as any,
                              ]);
                            } else {
                              form.setValue(
                                "features",
                                current.filter((item) => item !== feature.id),
                              );
                            }
                          }}
                        />

                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <Icon className="h-5 w-5 text-primary" />

                            <h4 className="font-medium">{feature.title}</h4>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>

                          {feature.required && (
                            <span className="mt-2 inline-block text-xs font-medium text-primary">
                              Required
                            </span>
                          )}

                          {projectType === "KANBAN" &&
                            (feature.id === "SPRINTS" ||
                              feature.id === "BACKLOG") && (
                              <span className="mt-2 inline-block text-xs text-muted-foreground">
                                Scrum Only
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

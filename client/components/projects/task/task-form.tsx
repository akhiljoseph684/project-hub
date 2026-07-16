"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import TaskTitle from "./task-title";
import TaskDescription from "./task-description";
import TaskStatus from "./task-status";
import TaskPriority from "./task-priority";
import TaskAssignee from "./task-assignee";
import TaskLabels from "./task-labels";
import TaskDueDate from "./task-due-date";

import { createTaskSchema, CreateTaskInput } from "@/lib/validations/task";

interface ProjectStatus {
  id: string;
  name: string;
  color: string;
}

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role?: string;
}

interface ProjectLabel {
  id: string;
  name: string;
  color: string;
}

interface TaskFormProps {
  projectId: string;

  statuses: ProjectStatus[];

  members: ProjectMember[];

  labels: ProjectLabel[];

  defaultStatusId?: string;

  onSuccess?: () => void;

  onCancel?: () => void;
}

export default function TaskForm({
  projectId,
  statuses,
  members,
  labels,
  defaultStatusId,
  onSuccess,
  onCancel,
}: TaskFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<
    z.input<typeof createTaskSchema>,
    any,
    z.output<typeof createTaskSchema>
  >({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      projectId,
      title: "",
      description: "",
      statusId: defaultStatusId ?? statuses[0]?.id ?? "",
      priority: "MEDIUM",
      assigneeId: "",
      labels: [],
      dueDate: undefined,
    },
  });

  async function onSubmit(values: CreateTaskInput) {
    try {
      setLoading(true);

      console.log(values);
    
      // const res = await createTask(values);
    
      // showSuccessToast(res.message);
    
      // onSuccess?.();

      onSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TaskTitle form={form} />

        <TaskDescription form={form} />

        <div className="grid gap-6 md:grid-cols-2">
          <TaskStatus form={form} statuses={statuses} />

          <TaskPriority form={form} />
        </div>

        <TaskAssignee form={form} members={members} />

        <TaskLabels form={form} labels={labels} />

        <TaskDueDate form={form} />

        <div className="flex justify-end gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

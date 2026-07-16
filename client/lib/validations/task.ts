import { z } from "zod";

export const createTaskSchema = z.object({
  projectId: z.string(),
  title: z.string().min(3),
  description: z.string().optional(),
  statusId: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  assigneeId: z.string().optional(),
  labels: z.array(z.string()),
  dueDate: z.date().optional(),
});

export type CreateTaskInput = z.input<typeof createTaskSchema>;
export type CreateTaskOutput = z.output<typeof createTaskSchema>;

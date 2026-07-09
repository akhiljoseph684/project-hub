import { z } from "zod";

export const projectTypeEnum = z.enum(["SCRUM", "KANBAN"]);

export const projectVisibilityEnum = z.enum(["PRIVATE", "PUBLIC"]);

export const projectRoleEnum = z.enum(["ADMIN", "MEMBER", "VIEWER"]);

export const projectFeatureEnum = z.enum([
  "BOARD",
  "TASKS",
  "SPRINTS",
  "BACKLOG",
  "MILESTONES",
  "CALENDAR",
  "FILES",
  "TIME_TRACKING",
]);

export const projectMemberSchema = z.object({
  userId: z.string().min(1, "User is required."),

  role: projectRoleEnum,
});

export const createProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Project name must be at least 3 characters.")
      .max(60, "Project name cannot exceed 60 characters."),

    key: z
      .string()
      .trim()
      .min(2, "Project key must be at least 2 characters.")
      .max(6, "Project key cannot exceed 6 characters.")
      .regex(/^[A-Z]+$/, "Project key must contain only uppercase letters."),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters.")
      .optional()
      .or(z.literal("")),

    type: projectTypeEnum,

    visibility: projectVisibilityEnum,

    color: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Invalid color value."),

    icon: z.instanceof(File).optional().nullable(),

    startDate: z.date({
      error: "Start date is required.",
    }),

    endDate: z.date().optional(),

    features: z
      .array(projectFeatureEnum)
      .min(2, "At least Board and Tasks are required."),

    members: z.array(projectMemberSchema),
  })
  .superRefine((data, ctx) => {
    if (data.endDate && data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date cannot be before the start date.",
      });
    }

    const ids = data.members.map((member) => member.userId);

    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

    if (duplicates.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["members"],
        message: "Duplicate members are not allowed.",
      });
    }

    if (data.type === "KANBAN") {
      if (
        data.features.includes("SPRINTS") ||
        data.features.includes("BACKLOG")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["features"],
          message:
            "Sprint Planning and Backlog are only available for Scrum projects.",
        });
      }
    }

    if (!data.features.includes("BOARD") || !data.features.includes("TASKS")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["features"],
        message: "Board View and Task Management are mandatory.",
      });
    }
  });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export type ProjectMemberInput = z.infer<typeof projectMemberSchema>;

export const updateProjectSchema = createProjectSchema.extend({
  slug: z.string(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

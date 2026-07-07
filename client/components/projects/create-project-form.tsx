"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createProjectSchema,
  CreateProjectInput,
} from "@/lib/validations/project";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import ProjectInformation from "./project-information";
import ProjectWorkflow from "./project-workflow";
import ProjectVisibility from "./project-visibility";
import ProjectAppearance from "./project-appearance";
import ProjectTimeline from "./project-timeline";
import ProjectFeatures from "./project-features";
import ProjectMembers from "./project-members";
import ProjectSummary from "./project-summary";
import { createProject } from "@/services/project.service";
import { useRouter } from "next/navigation";

export default function CreateProjectForm() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),

    defaultValues: {
      name: "",
      key: "",
      description: "",

      type: "SCRUM",

      visibility: "PRIVATE",

      color: "#2563EB",

      icon: null,

      startDate: new Date(),

      endDate: undefined,

      features: ["BOARD", "TASKS", "SPRINTS", "BACKLOG", "MILESTONES"],

      members: [],
    },

    mode: "onChange",
  });

  async function onSubmit(values: CreateProjectInput) {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("key", values.key);
      formData.append("description", values.description ?? "");
      formData.append("type", values.type);
      formData.append("visibility", values.visibility);
      formData.append("color", values.color);

      if (values.icon) {
        formData.append("icon", values.icon);
      }

      formData.append("startDate", values.startDate.toISOString());

      if (values.endDate) {
        formData.append("endDate", values.endDate.toISOString());
      }

      values.features.forEach((feature) => {
        formData.append("features", feature);
      });

      values.members.forEach((member) => {
        formData.append("members", JSON.stringify(member));
      });

      console.log(formData)
      await createProject(formData);

      router.push("/projects");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_360px]"
      >
        <div className="min-w-0 space-y-8 lg:col-span-2 overflow-y-auto">
          <ProjectInformation form={form} />

          <ProjectWorkflow form={form} />

          <ProjectVisibility form={form} />

          <ProjectAppearance form={form} />

          <ProjectTimeline form={form} />

          <ProjectFeatures form={form} />

          {/* <ProjectMembers form={form} /> */}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="sticky top-24 space-y-6">
            <ProjectSummary form={form} />

            <div className="rounded-xl border bg-card p-6">
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating Project..." : "Create Project"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => form.reset()}
                >
                  Reset Form
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </Form>
  );
}

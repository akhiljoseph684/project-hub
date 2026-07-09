"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import SettingsGeneral from "@/components/projects/settings/settings-general";
import SettingsFeatures from "@/components/projects/settings/settings-features";
import SettingsRoles from "@/components/projects/settings/settings-roles";
import DangerZone from "@/components/projects/settings/danger-zone";

import {
  updateProjectSchema,
  UpdateProjectInput,
} from "@/lib/validations/project";

export default function ProjectSettingsPage() {
  const [tab, setTab] = useState("general");

  const form = useForm<UpdateProjectInput>({
    resolver: zodResolver(updateProjectSchema),

    defaultValues: {
      name: "Project Hub",
      key: "PH",
      slug: "project-hub",
      description:
        "A modern project management platform inspired by Jira and Linear.",

      type: "SCRUM",
      visibility: "PRIVATE",

      startDate: new Date(),
      endDate: undefined,
    },
  });

  const onSubmit = async (values: UpdateProjectInput) => {
    console.log(values);

    // await updateProject(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Project Settings
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your project's configuration, features,
            roles, and permissions.
          </p>
        </div>

        <Tabs
          value={tab}
          onValueChange={setTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="general">
              General
            </TabsTrigger>

            <TabsTrigger value="features">
              Features
            </TabsTrigger>

            <TabsTrigger value="roles">
              Roles & Permissions
            </TabsTrigger>

            <TabsTrigger value="danger">
              Danger Zone
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <SettingsGeneral form={form} />
          </TabsContent>

          <TabsContent value="features">
            <SettingsFeatures />
          </TabsContent>

          <TabsContent value="roles">
            <SettingsRoles />
          </TabsContent>

          <TabsContent value="danger">
            <DangerZone />
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
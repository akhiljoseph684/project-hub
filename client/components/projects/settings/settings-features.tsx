"use client";

import {
  Activity,
  Calendar,
  CheckSquare,
  Flag,
  Folder,
  KanbanSquare,
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import FeatureToggle, { ProjectFeature } from "./feature-toggle";

const features: ProjectFeature[] = [
  {
    key: "OVERVIEW",
    name: "Overview",
    description: "Project dashboard with statistics and recent activity.",
    icon: LayoutDashboard,
    enabled: true,
    required: true,
  },
  {
    key: "BOARD",
    name: "Board",
    description: "Kanban board for managing tasks.",
    icon: KanbanSquare,
    enabled: true,
    required: true,
  },
  {
    key: "BACKLOG",
    name: "Backlog",
    description: "Manage and prioritize pending work.",
    icon: ListTodo,
    enabled: true,
    scrumOnly: true,
  },
  {
    key: "SPRINTS",
    name: "Sprint",
    description: "Sprint planning and tracking.",
    icon: Flag,
    enabled: true,
    scrumOnly: true,
  },
  {
    key: "TASKS",
    name: "Tasks",
    description: "Create and manage project tasks.",
    icon: CheckSquare,
    enabled: true,
    required: true,
  },
  {
    key: "MEMBERS",
    name: "Members",
    description: "Invite and manage project members.",
    icon: Users,
    enabled: true,
    required: true,
  },
  {
    key: "FILES",
    name: "Files",
    description: "Upload and organize project files.",
    icon: Folder,
    enabled: false,
  },
  {
    key: "CALENDAR",
    name: "Calendar",
    description: "Track deadlines and milestones.",
    icon: Calendar,
    enabled: false,
  },
  {
    key: "ACTIVITY",
    name: "Activity",
    description: "View recent project activity.",
    icon: Activity,
    enabled: true,
    required: true,
  },
  {
    key: "SETTINGS",
    name: "Settings",
    description: "Configure project settings.",
    icon: Settings,
    enabled: true,
    required: true,
  },
];

export default function SettingsFeatures() {
  const handleToggle = (key: string, enabled: boolean) => {
    console.log(key, enabled);

  };

  return (
    <Card className="p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Project Features</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Enable or disable modules available in this project. Required features
          cannot be disabled.
        </p>
      </div>

      <div className="space-y-4">
        {features.map((feature) => (
          <FeatureToggle
            key={feature.key}
            feature={feature}
            onChange={handleToggle}
          />
        ))}
      </div>
    </Card>
  );
}

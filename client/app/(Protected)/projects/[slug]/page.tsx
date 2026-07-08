"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  KanbanSquare,
  ListTodo,
  Flag,
  CheckSquare,
  Users,
  Folder,
  Calendar,
  Activity,
  Settings,
} from "lucide-react";

const project = {
  id: "1",
  name: "Project Hub",
  key: "PH",
  description:
    "A modern project management platform inspired by Jira and Linear.",
  type: "SCRUM",
};

const features = [
  {
    name: "Overview",
    href: `/dashboard/projects/${project.id}`,
    icon: LayoutDashboard,
  },
  {
    name: "Board",
    href: `/dashboard/projects/${project.id}/board`,
    icon: KanbanSquare,
  },
  {
    name: "Backlog",
    href: `/dashboard/projects/${project.id}/backlog`,
    icon: ListTodo,
    scrumOnly: true,
  },
  {
    name: "Sprint",
    href: `/dashboard/projects/${project.id}/sprints`,
    icon: Flag,
    scrumOnly: true,
  },
  {
    name: "Tasks",
    href: `/dashboard/projects/${project.id}/tasks`,
    icon: CheckSquare,
  },
  {
    name: "Members",
    href: `/dashboard/projects/${project.id}/members`,
    icon: Users,
  },
  {
    name: "Files",
    href: `/dashboard/projects/${project.id}/files`,
    icon: Folder,
  },
  {
    name: "Calendar",
    href: `/dashboard/projects/${project.id}/calendar`,
    icon: Calendar,
  },
  {
    name: "Activity",
    href: `/dashboard/projects/${project.id}/activity`,
    icon: Activity,
  },
  {
    name: "Settings",
    href: `/dashboard/projects/${project.id}/settings`,
    icon: Settings,
  },
];

export default function ProjectPage() {

  return (
    <div className="space-y-6">overwiew
    </div>
  );
}

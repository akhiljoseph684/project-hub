"use client";

import {
  Activity,
  Calendar,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Flag,
  Folder,
  KanbanSquare,
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ReactNode, useRef } from "react";

interface Props {
  children: ReactNode;
}

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
import { usePathname } from "next/navigation";

export default function ProjectLayout({ children }: Props) {
  const { slug } = useParams();
  const navRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!navRef.current) return;

    navRef.current.scrollBy({
      left: direction === "left" ? -250 : 250,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                {project.key}
              </div>

              <div>
                <h1 className="text-2xl font-bold">{project.name}</h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border px-3 py-2 text-sm font-medium">
            {project.type}
          </div>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border bg-background p-2 shadow transition hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border bg-background p-2 shadow transition hover:bg-muted"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div
          ref={navRef}
          className="overflow-x-auto navbar-scroll rounded-xl border bg-card scrollbar-hide"
        >
          <nav className="flex min-w-max items-center">
            {features
              .filter((item) => !item.scrumOnly || project.type === "SCRUM")
              .map((item) => {
                const Icon = item.icon;

                const href =
                  item.name === "Overview"
                    ? `/projects/${slug}`
                    : `/projects/${slug}/${item.name.toLowerCase()}`;

                return (
                  <Link
                    key={item.name}
                    href={href}
                    className="
                    relative
                    flex
                    shrink-0
                    items-center
                    gap-2
                    whitespace-nowrap
                    border-b-2
                    border-transparent
                    px-5
                    py-4
                    text-sm
                    font-medium
                    text-muted-foreground
                    transition-all
                    duration-200
                    hover:border-primary
                    hover:bg-muted/50
                    hover:text-foreground
                  "
                  >
                    <Icon className="h-4 w-4" />

                    <span>{item.name}</span>
                  </Link>
                );
              })}
          </nav>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-10">{children}</div>
    </div>
  );
}

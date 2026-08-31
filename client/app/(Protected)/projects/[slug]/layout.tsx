"use client";

import {
  Activity,
  Calendar,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Flag,
  Folder,
  FolderKanban,
  KanbanSquare,
  LayoutDashboard,
  ListTodo,
  Loader2,
  Settings,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";

interface Props {
  children: ReactNode;
}

const features = [
  {
    name: "Overview",
    feature: null,
    icon: LayoutDashboard,
  },
  {
    name: "Board",
    feature: "BOARD",
    icon: KanbanSquare,
  },
  {
    name: "Backlog",
    feature: "BACKLOG",
    icon: ListTodo,
  },
  {
    name: "Sprint",
    feature: "SPRINTS",
    icon: Flag,
  },
  {
    name: "Tasks",
    feature: "TASKS",
    icon: CheckSquare,
  },
  {
    name: "Members",
    feature: null,
    icon: Users,
  },
  {
    name: "Files",
    feature: "FILES",
    icon: Folder,
  },
  {
    name: "Calendar",
    feature: "CALENDAR",
    icon: Calendar,
  },
  {
    name: "Activity",
    feature: null,
    icon: Activity,
  },
  {
    name: "Settings",
    feature: null,
    icon: Settings,
  },
] as const;
import { usePathname } from "next/navigation";
import { getProjectBySlug } from "@/services/project.service";
import { showErrorToast } from "@/lib/toast";
import { setCurrentProject } from "@/redux/slices/projectSlice";
import { useDispatch } from "react-redux";

export interface ProjectRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface CurrentUser {
  role: ProjectRole;
}

export interface ProjectOwner {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

export type ProjectType = "SCRUM" | "KANBAN";

export type ProjectVisibility = "PRIVATE" | "PUBLIC";

export type ProjectFeature =
  | "BOARD"
  | "TASKS"
  | "SPRINTS"
  | "BACKLOG"
  | "MILESTONES"
  | "CALENDAR"
  | "TIME_TRACKING"
  | "FILES";

export interface Project {
  id: string;
  name: string;
  key: string;
  slug: string;
  description: string;
  color: string;
  icon: string | null;

  type: ProjectType;
  visibility: ProjectVisibility;

  startDate: string;
  endDate: string | null;
  createdAt: string;

  features: ProjectFeature[];

  membersCount: number;

  owner: ProjectOwner;
  currentUser: CurrentUser;
}

export default function ProjectLayout({ children }: Props) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  const navRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch()

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      let res = await getProjectBySlug(slug as string);
      dispatch(setCurrentProject(res.project));
      setProject(res.project);
    } catch (error: any) {
      showErrorToast(error.message || "Something Went Wrong");
    } finally {
      setLoading(false);
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (!navRef.current) return;

    navRef.current.scrollBy({
      left: direction === "left" ? -250 : 250,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-primary/10"
                style={{
                  backgroundColor: project?.color
                    ? `${project.color}20`
                    : undefined,
                }}
              >
                {project?.icon ? (
                  <img
                    src={project.icon}
                    alt={project.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FolderKanban
                    className="h-7 w-7"
                    style={{
                      color: project?.color,
                    }}
                  />
                )}
              </div>

              <div>
                <h1 className="text-2xl font-bold">{project?.name}</h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  {project?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border px-3 py-2 text-sm font-medium">
            {project?.type === "KANBAN" ? "Kanban" : "Scrum"}
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
              .filter(
                (item) =>
                  item.feature === null ||
                  project?.features?.includes(item.feature),
              )
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
                    className="relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-5 py-4 text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-primary hover:bg-muted/50 hover:text-foreground"
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

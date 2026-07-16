"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Users,
  Share2,
  Settings,
  Star,
  ChevronDown,
  Filter,
  ArrowUpDown,
  LayoutGrid,
} from "lucide-react";

interface BoardHeaderProps {
  project: {
    id: string;
    name: string;
    key: string;
    slug: string;
    visibility: "PUBLIC" | "PRIVATE";
    color?: string;
  };
  taskCount?: number;
  memberCount?: number;
}

export default function BoardHeader({
  project,
  taskCount = 0,
  memberCount = 0,
}: BoardHeaderProps) {
  return (
    <div className="space-y-6 border-b bg-background px-6 py-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/project/${project.slug}`}>{project.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Board</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold text-white"
            style={{
              backgroundColor: project.color || "#2563EB",
            }}
          >
            {project.key.charAt(0)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{project.name}</h1>

              <Badge variant="secondary">{project.key}</Badge>

              <Badge
                variant={
                  project.visibility === "PUBLIC" ? "default" : "outline"
                }
              >
                {project.visibility}
              </Badge>
            </div>

            <div className="mt-1 flex flex-wrap gap-5 text-sm text-muted-foreground">
              <span>{taskCount} Tasks</span>
              <span>{memberCount} Members</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon">
            <Star className="h-4 w-4" />
          </Button>

          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Members
          </Button>

          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>

          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full xl:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input placeholder="Search tasks..." className="pl-10" />
        </div>

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sprint
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>Current Sprint</DropdownMenuItem>
              <DropdownMenuItem>Backlog</DropdownMenuItem>
              <DropdownMenuItem>All Tasks</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>

          <Button variant="outline">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Board
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>Board</DropdownMenuItem>
              <DropdownMenuItem>List</DropdownMenuItem>
              <DropdownMenuItem>Calendar</DropdownMenuItem>
              <DropdownMenuItem>Timeline</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

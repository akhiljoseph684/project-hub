import Link from "next/link";
import { ArrowRight, Lock, Users, Calendar, FolderKanban } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { format } from "date-fns";

interface ProjectCardProps {
  project: any;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  console.log(project);
  return (
    <Card className="group transition-all hover:shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div
            className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-primary/10"
            style={{
              backgroundColor: project.color ? `${project.color}20` : undefined,
            }}
          >
            {project.icon ? (
              <img
                src={project.icon}
                alt={project.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <FolderKanban
                className="h-7 w-7"
                style={{
                  color: project.color,
                }}
              />
            )}
          </div>

          <Badge>{project.role.name}</Badge>
        </div>

        <div>
          <h3 className="text-lg font-semibold">{project.name}</h3>

          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{project.type}</Badge>

          <Badge variant="outline">
            <Lock className="mr-1 h-3 w-3" />
            {project.visibility}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {`${project.membersCount} ${project.membersCount > 1 ? "Members" : "Member"}`}
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {project.startDate
              ? format(new Date(project.startDate), "MMM d, yyyy")
              : "Not Started"}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link
          href={`/projects/${project.slug}`}
          className="flex w-full items-center justify-between rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-muted"
        >
          Open Project
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}

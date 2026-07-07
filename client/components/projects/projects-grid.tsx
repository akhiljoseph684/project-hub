import ProjectCard from "./project-card";

interface ProjectsGridProps {
  projects: any[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

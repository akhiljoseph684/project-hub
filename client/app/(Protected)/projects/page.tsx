"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, Plus, Search } from "lucide-react";

import { getProjects } from "@/services/project.service";
import { showErrorToast } from "@/lib/toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import ProjectsGrid from "@/components/projects/projects-grid";
import ProjectsPagination from "@/components/projects/project-pagination";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProjectsPage() {
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<any>(null);

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchProjects();
  }, [page, debouncedSearch]);

  async function fetchProjects() {
    try {
      setLoading(true);

      const res = await getProjects(page, 12, debouncedSearch);

      console.log(res);
      setData(res);
    } catch (error: any) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Projects</h1>

          <p className="mt-2 text-muted-foreground">
            Manage and access every project you're involved in.
          </p>
        </div>

        <Link href="/projects/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search projects..."
          className="pl-10"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <ProjectsGrid projects={data?.projects || []} />

          <ProjectsPagination
            pagination={data?.pagination}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

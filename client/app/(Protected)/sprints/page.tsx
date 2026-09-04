"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Search,
  ListTodo,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  getMySprints,
  getSprintById,
  startSprint,
  completeSprint,
  type Sprint,
} from "@/services/sprint.service";

import { showErrorToast } from "@/lib/toast";

import ShowSprintDialog from "@/components/projects/sprint/show-sprint-dialog";

export default function MySprintsPage() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);

  const [showSprintDialog, setShowSprintDialog] = useState(false);

  const [loadingSprint, setLoadingSprint] = useState(false);

  const [processingSprint, setProcessingSprint] = useState(false);

  useEffect(() => {
    fetchMySprints();
  }, []);

  const fetchMySprints = async () => {
    try {
      setLoading(true);

      const data = await getMySprints();

      setSprints(data || []);
    } catch (error) {
      console.error("Failed to fetch my sprints:", error);

      showErrorToast("Failed to load sprints");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSprint = async (sprintId: string) => {
    try {
      setLoadingSprint(true);
      setShowSprintDialog(true);
      setSelectedSprint(null);

      const response = await getSprintById(sprintId);

      setSelectedSprint(response.data);
    } catch (error) {
      console.error("Failed to load sprint details:", error);

      showErrorToast("Failed to load sprint details");

      setShowSprintDialog(false);
      setSelectedSprint(null);
    } finally {
      setLoadingSprint(false);
    }
  };

  const handleCloseSprint = () => {
    setShowSprintDialog(false);
    setSelectedSprint(null);
  };

  const handleStartSprint = async (sprintId: string) => {
    try {
      setProcessingSprint(true);

      await startSprint(sprintId);

      await fetchMySprints();

      if (selectedSprint && selectedSprint.id === sprintId) {
        const response = await getSprintById(sprintId);

        setSelectedSprint(response.data);
      }
    } catch (error) {
      console.error("Failed to start sprint:", error);

      showErrorToast("Failed to start sprint");
    } finally {
      setProcessingSprint(false);
    }
  };

  const handleCompleteSprint = async (sprintId: string) => {
    try {
      setProcessingSprint(true);

      await completeSprint(sprintId);

      await fetchMySprints();

      if (selectedSprint && selectedSprint.id === sprintId) {
        const response = await getSprintById(sprintId);

        setSelectedSprint(response.data);
      }
    } catch (error) {
      console.error("Failed to complete sprint:", error);

      showErrorToast("Failed to complete sprint");
    } finally {
      setProcessingSprint(false);
    }
  };

  const filteredSprints = sprints.filter((sprint) => {
    const value = search.toLowerCase();

    return (
      sprint.name?.toLowerCase().includes(value) ||
      sprint.project?.name?.toLowerCase().includes(value) ||
      sprint.project?.key?.toLowerCase().includes(value)
    );
  });

  const totalSprints = sprints.length;

  const activeSprints = sprints.filter(
    (sprint) => sprint.status === "ACTIVE",
  ).length;

  const plannedSprints = sprints.filter(
    (sprint) => sprint.status === "PLANNED",
  ).length;

  const completedSprints = sprints.filter(
    (sprint) => sprint.status === "COMPLETED",
  ).length;

  const formatDate = (date?: string | null) => {
    if (!date) return "Not set";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusVariant = (
    status: string,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "ACTIVE":
        return "default";

      case "COMPLETED":
        return "secondary";

      case "PLANNED":
        return "outline";

      default:
        return "outline";
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Sprints</h1>

        <p className="mt-2 text-muted-foreground">
          View all sprints from the projects you're involved in.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search sprints or projects..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Sprints
              </p>

              <p className="mt-2 text-2xl font-bold">{totalSprints}</p>
            </div>

            <ListTodo className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active
              </p>

              <p className="mt-2 text-2xl font-bold">{activeSprints}</p>
            </div>

            <Clock3 className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Planned
              </p>

              <p className="mt-2 text-2xl font-bold">{plannedSprints}</p>
            </div>

            <CalendarDays className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed
              </p>

              <p className="mt-2 text-2xl font-bold">{completedSprints}</p>
            </div>

            <CheckCircle2 className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : filteredSprints.length === 0 ? (
        <Card>
          <CardContent className="flex h-64 flex-col items-center justify-center text-center">
            <ListTodo className="mb-4 h-10 w-10 text-muted-foreground" />

            <h3 className="text-lg font-semibold">No sprints found</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {sprints.length === 0
                ? "There are no sprints available for your projects."
                : "Try changing your search."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSprints.map((sprint) => (
            <Card
              key={sprint.id}
              onClick={() => handleOpenSprint(sprint.id)}
              className="cursor-pointer transition-colors hover:bg-muted/50"
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold">{sprint.name}</h2>

                      <Badge variant="outline">{sprint.project?.key}</Badge>

                      <Badge variant={getStatusVariant(sprint.status)}>
                        {sprint.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Project:{" "}
                      <span className="font-medium text-foreground">
                        {sprint.project?.name}
                      </span>
                    </p>

                    {sprint.goal && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {sprint.goal}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        Start: {formatDate(sprint.startDate)}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        End: {formatDate(sprint.endDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="secondary">
                      {sprint.tasks?.length ?? sprint._count?.tasks ?? 0}{" "}
                      {(sprint.tasks?.length ?? sprint._count?.tasks ?? 0) === 1
                        ? "Task"
                        : "Tasks"}
                    </Badge>
                  </div>
                </div>

                {sprint.tasks && sprint.tasks.length > 0 && (
                  <div className="mt-5 border-t pt-5">
                    <p className="mb-3 text-sm font-medium">Sprint Tasks</p>

                    <div className="space-y-2">
                      {sprint.tasks.slice(0, 5).map((task) => (
                        <div
                          key={task.id}
                          className="flex flex-col gap-2 rounded-lg border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-primary">
                                {task.key}
                              </span>

                              <span className="truncate text-sm font-medium">
                                {task.title}
                              </span>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            {task.status && (
                              <Badge variant="outline">
                                {task.status.name}
                              </Badge>
                            )}

                            {task.priority && (
                              <Badge variant="secondary">{task.priority}</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {sprint.tasks.length > 5 && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        +{sprint.tasks.length - 5} more tasks
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredSprints.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredSprints.length} of {sprints.length} sprints
        </p>
      )}

      <ShowSprintDialog
        open={showSprintDialog}
        onOpenChange={(open) => {
          setShowSprintDialog(open);

          if (!open) {
            handleCloseSprint();
          }
        }}
        sprint={selectedSprint}
        loading={loadingSprint}
        processing={processingSprint}
        projectId={selectedSprint?.project?.id ?? ""}
        onStartSprint={handleStartSprint}
        onCompleteSprint={handleCompleteSprint}
        onTaskRemoved={() => {
          if (selectedSprint) {
            handleOpenSprint(selectedSprint.id);
          }
        }}
      />
    </div>
  );
}

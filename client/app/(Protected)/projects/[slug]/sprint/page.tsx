"use client";

import { useEffect, useState } from "react";

import {
  getProjectSprints,
  getSprintById,
  createSprint,
  type Sprint,
  completeSprint,
  startSprint,
} from "@/services/sprint.service";

import { showErrorToast } from "@/lib/toast";
import { useAppSelector } from "@/redux/hooks";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeTaskFromSprint } from "@/services/task.service";

export default function SprintPage() {
  const project = useAppSelector((state) => state.project.currentProject);

  if(!project)return;

  const projectId = project?.id;

  const [sprints, setSprints] = useState<Sprint[]>([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);

  const [showSprintDialog, setShowSprintDialog] = useState(false);

  const [loadingSprint, setLoadingSprint] = useState(false);

  const [processingSprint, setProcessingSprint] = useState(false);

  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadSprints = async () => {
    if (!projectId) return;

    try {
      setLoading(true);

      const response = await getProjectSprints(projectId);

      setSprints(response.data || []);
    } catch (error) {
      console.error("Failed to load sprints:", error);

      showErrorToast("Failed to load sprints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadSprints();
    }
  }, [projectId]);

  const handleCreateSprint = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!projectId) {
      showErrorToast("Project not found");
      return;
    }

    if (!name.trim()) {
      showErrorToast("Sprint name is required");
      return;
    }

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      showErrorToast("End date must be after start date");
      return;
    }

    try {
      setCreating(true);

      await createSprint(projectId, {
        name: name.trim(),
        goal: goal.trim() || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      // Reset form
      setName("");
      setGoal("");
      setStartDate("");
      setEndDate("");

      setShowCreateForm(false);

      await loadSprints();
    } catch (error) {
      console.error("Failed to create sprint:", error);

      showErrorToast("Failed to create sprint");
    } finally {
      setCreating(false);
    }
  };

  const handleOpenSprint = async (sprintId: string) => {
    try {
      setLoadingSprint(true);
      setShowSprintDialog(true);

      const response = await getSprintById(sprintId);

      setSelectedSprint(response.data);
    } catch (error) {
      console.error("Failed to load sprint details:", error);

      showErrorToast("Failed to load sprint details");

      setShowSprintDialog(false);
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

      await loadSprints();

      // Refresh currently opened sprint
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

      await loadSprints();

      // Refresh currently opened sprint
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

  if (!project) {
    return (
      <div className="p-6">
        <div className="py-10 text-center text-muted-foreground">
          Loading project...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Sprints</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Plan and manage your Scrum sprints.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Create Sprint
        </button>
      </div>

      {showCreateForm && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Create Sprint</h2>

          <form onSubmit={handleCreateSprint} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Sprint Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sprint 1"
                className="w-full rounded-md border bg-background px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Sprint Goal
              </label>

              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What do you want to achieve in this sprint?"
                className="w-full rounded-md border bg-background px-3 py-2"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  End Date
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                disabled={creating}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creating}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Sprint"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && (
        <div className="py-10 text-center text-muted-foreground">
          Loading sprints...
        </div>
      )}

      {!loading && sprints.length === 0 && (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <h2 className="text-lg font-medium">No sprints yet</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create your first sprint to start planning your Scrum project.
          </p>
        </div>
      )}

      {!loading && sprints.length > 0 && (
        <div className="space-y-4">
          {sprints.map((sprint) => (
            <div
              key={sprint.id}
              onClick={() => handleOpenSprint(sprint.id)}
              className="cursor-pointer rounded-lg border bg-card p-5 transition hover:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{sprint.name}</h2>

                  {sprint.goal && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {sprint.goal}
                    </p>
                  )}
                </div>

                <span
                  className={`rounded-full bg-muted px-3 py-1 text-xs font-medium ${sprint.status === "PLANNED" ? "text-blue-500" : sprint.status === "ACTIVE" ? "text-indigo-600" : "text-emerald-600"}`}
                >
                  {sprint.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span>Tasks: {sprint._count?.tasks ?? 0}</span>

                {sprint.startDate && (
                  <span>
                    Start: {new Date(sprint.startDate).toLocaleDateString()}
                  </span>
                )}

                {sprint.endDate && (
                  <span>
                    End: {new Date(sprint.endDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showSprintDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleCloseSprint}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {loadingSprint && (
              <div className="py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  Loading sprint details...
                </p>
              </div>
            )}

            {!loadingSprint && selectedSprint && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedSprint.name}
                    </h2>

                    {selectedSprint.goal && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {selectedSprint.goal}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseSprint}
                    className="rounded-md px-2 py-1 text-lg text-muted-foreground hover:bg-muted"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Status</p>

                    <p className="mt-1 text-sm font-medium">
                      {selectedSprint.status}
                    </p>
                  </div>

                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Tasks</p>

                    <p className="mt-1 text-sm font-medium">
                      {selectedSprint.tasks?.length ??
                        selectedSprint._count?.tasks ??
                        0}
                    </p>
                  </div>

                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Start Date</p>

                    <p className="mt-1 text-sm font-medium">
                      {selectedSprint.startDate
                        ? new Date(
                            selectedSprint.startDate,
                          ).toLocaleDateString()
                        : "Not set"}
                    </p>
                  </div>

                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">End Date</p>

                    <p className="mt-1 text-sm font-medium">
                      {selectedSprint.endDate
                        ? new Date(selectedSprint.endDate).toLocaleDateString()
                        : "Not set"}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Sprint Tasks</h3>

                    <span className="text-xs text-muted-foreground">
                      {selectedSprint.tasks?.length ?? 0} tasks
                    </span>
                  </div>

                  {selectedSprint.tasks && selectedSprint.tasks.length > 0 ? (
                    <div className="space-y-2">
                      {selectedSprint.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 rounded-lg border p-3"
                        >
                          <span className="text-xs font-medium text-muted-foreground">
                            {task.key}
                          </span>

                          <span className="flex-1 text-sm font-medium">
                            {task.title}
                          </span>

                          {task.status && (
                            <span className="rounded-full bg-muted px-2 py-1 text-xs">
                              {task.status.name}
                            </span>
                          )}

                          {task.priority && (
                            <span className="text-xs text-muted-foreground">
                              {task.priority}
                            </span>
                          )}

                          {task.priority && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={async () => {
                                await removeTaskFromSprint(projectId, task.id)
                                handleOpenSprint(selectedSprint.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        No tasks in this sprint.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  {selectedSprint.status === "PLANNED" && (
                    <button
                      type="button"
                      onClick={() => handleStartSprint(selectedSprint.id)}
                      disabled={processingSprint}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                    >
                      {processingSprint ? "Starting..." : "Start Sprint"}
                    </button>
                  )}

                  {selectedSprint.status === "ACTIVE" && (
                    <button
                      type="button"
                      onClick={() => handleCompleteSprint(selectedSprint.id)}
                      disabled={processingSprint}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                    >
                      {processingSprint ? "Completing..." : "Complete Sprint"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleCloseSprint}
                    disabled={processingSprint}
                    className="rounded-md border px-4 py-2 text-sm"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

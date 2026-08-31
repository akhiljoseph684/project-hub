"use client";

import { useEffect, useState } from "react";

import { assignTaskToSprint } from "@/services/task.service";

import { getProjectSprints, type Sprint } from "@/services/sprint.service";

interface AddToSprintDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  taskIds: string[];
  onSuccess?: () => void;
}

export default function AddToSprintDialog({
  open,
  onClose,
  projectId,
  taskIds,
  onSuccess,
}: AddToSprintDialogProps) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!open || !projectId) return;

    const loadSprints = async () => {
      try {
        setFetching(true);

        const response = await getProjectSprints(projectId);

        const availableSprints = (response.data || []).filter(
          (sprint: Sprint) => sprint.status !== "COMPLETED",
        );

        setSprints(availableSprints);
      } catch (error) {
        console.error("Failed to load sprints:", error);
      } finally {
        setFetching(false);
      }
    };

    loadSprints();
  }, [open, projectId]);

  const handleAddToSprint = async () => {
    if (!selectedSprintId || taskIds.length === 0) {
      return;
    }

    try {
      setLoading(true);

      await Promise.all(
        taskIds.map((taskId) =>
          assignTaskToSprint(projectId, taskId, selectedSprintId),
        ),
      );

      onSuccess?.();

      onClose();
    } catch (error) {
      console.error("Failed to add tasks to sprint:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Add to Sprint</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Select a sprint for {taskIds.length} selected task
            {taskIds.length !== 1 ? "s" : ""}.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sprint</label>

          {fetching ? (
            <div className="rounded-md border px-3 py-2 text-sm text-muted-foreground">
              Loading sprints...
            </div>
          ) : sprints.length === 0 ? (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              No available sprints.
              <br />
              Create a sprint first.
            </div>
          ) : (
            <select
              value={selectedSprintId}
              onChange={(e) => setSelectedSprintId(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="">Select a sprint</option>

              {sprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.name} ({sprint.status})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAddToSprint}
            disabled={
              loading || fetching || !selectedSprintId || taskIds.length === 0
            }
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add to Sprint"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import {
  getProjectSprints,
  type Sprint,
} from "@/services/sprint.service";

import {
  assignTaskToSprint,
  getBacklogTasks,
} from "@/services/task.service";
import { useAppSelector } from "@/redux/hooks";

interface TaskStatus {
  id: string;
  name: string;
}

interface Task {
  id: string;
  key: string;
  title: string;
  description?: string | null;
  priority?: string;
  type?: string;
  status?: TaskStatus;
  assignee?: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatar?: string | null;
  } | null;
}

export default function BacklogPage() {

  const project = useAppSelector((state) => state.project.currentProject);

  if(!project)return;

  const projectId = project.id

  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);

  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState("");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const loadBacklog = async () => {
    try {
      setLoading(true);

      const res = await getBacklogTasks(projectId);

      setTasks(res.tasks || res.data || []);
    } catch (error) {
      console.error("Failed to load backlog:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSprints = async () => {
    try {
      const response = await getProjectSprints(projectId);

      const availableSprints = (response.data || []).filter(
        (sprint: Sprint) => sprint.status !== "COMPLETED"
      );

      setSprints(availableSprints);
    } catch (error) {
      console.error("Failed to load sprints:", error);
    }
  };

  useEffect(() => {
    if (!projectId) return;

    loadBacklog();
    loadSprints();
  }, [projectId]);

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskIds((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId]
    );
  };

  const allSelected =
    tasks.length > 0 &&
    selectedTaskIds.length === tasks.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(tasks.map((task) => task.id));
    }
  };

  const handleAddToSprint = async () => {
    if (!selectedSprintId || selectedTaskIds.length === 0) {
      return;
    }

    try {
      setAdding(true);

      await Promise.all(
        selectedTaskIds.map((taskId) =>
          assignTaskToSprint(
            projectId,
            taskId,
            selectedSprintId
          )
        )
      );

      setSelectedTaskIds([]);
      setSelectedSprintId("");

      await loadBacklog();
    } catch (error) {
      console.error(
        "Failed to add tasks to sprint:",
        error
      );
    } finally {
      setAdding(false);
    }
  };

  const selectedCount = selectedTaskIds.length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Backlog
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage product backlog and assign tasks to sprints.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              disabled={tasks.length === 0}
            />

            Select all
          </label>

          {selectedCount > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedCount} task
              {selectedCount !== 1 ? "s" : ""} selected
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={selectedSprintId}
            onChange={(e) =>
              setSelectedSprintId(e.target.value)
            }
            disabled={
              selectedCount === 0 ||
              sprints.length === 0 ||
              adding
            }
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">
              Select Sprint
            </option>

            {sprints.map((sprint) => (
              <option
                key={sprint.id}
                value={sprint.id}
              >
                {sprint.name}
                {sprint.status === "ACTIVE"
                  ? " (Active)"
                  : ""}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAddToSprint}
            disabled={
              selectedCount === 0 ||
              !selectedSprintId ||
              adding
            }
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {adding
              ? "Adding..."
              : "Add to Sprint"}
          </button>
        </div>
      </div>

      {!loading && sprints.length === 0 && (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No available sprints.
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Create a sprint before assigning backlog tasks.
          </p>
        </div>
      )}

      {loading && (
        <div className="rounded-lg border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Loading backlog...
          </p>
        </div>
      )}

      {!loading && tasks.length === 0 && (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <h2 className="text-lg font-medium">
            Backlog is empty
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            There are no unassigned tasks in the backlog.
          </p>
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div className="overflow-hidden rounded-lg border">
          <div className="divide-y">
            {tasks.map((task) => {
              const selected =
                selectedTaskIds.includes(task.id);

              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 p-4 transition ${
                    selected
                      ? "bg-muted/50"
                      : "bg-background"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() =>
                      handleTaskSelect(task.id)
                    }
                  />

                  <div className="w-24 shrink-0">
                    <span className="text-sm font-medium">
                      {task.key}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {task.type && (
                    <span className="hidden rounded-md bg-muted px-2 py-1 text-xs md:inline-block">
                      {task.type}
                    </span>
                  )}

                  {task.priority && (
                    <span className="hidden text-xs text-muted-foreground sm:inline-block">
                      {task.priority}
                    </span>
                  )}

                  {task.status && (
                    <span className="rounded-full bg-muted px-2 py-1 text-xs">
                      {task.status.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Check, ListChecks, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import {
  createChecklist,
  deleteChecklist,
  getChecklists,
  updateChecklist,
} from "@/services/task-checklist.service";

import { showErrorToast, showSuccessToast } from "@/lib/toast";

interface ChecklistItem {
  id: string;
  taskId?: string;
  title: string;
  isCompleted: boolean;
  position: number;
  createdAt?: string;
  updatedAt?: string;
}

interface TaskChecklistProps {
  taskId: string;
  checklists?: ChecklistItem[];
}

export default function TaskChecklist({
  taskId,
  checklists = [],
}: TaskChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(checklists);

  const [newItem, setNewItem] = useState("");
  const [adding, setAdding] = useState(false);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchChecklists = async () => {
    try {
      setLoading(true);

      const response = await getChecklists(taskId);

      if (response?.success) {
        setItems(response.data || []);
      }
    } catch (error: any) {
      console.error("Failed to fetch checklists:", error);

      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch checklists",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!taskId) return;

    fetchChecklists();
  }, [taskId]);

  const handleToggle = async (item: ChecklistItem) => {
    try {
      const response = await updateChecklist(item.id);

      if (response?.success) {
        setItems((prev) =>
          prev.map((currentItem) =>
            currentItem.id === item.id
              ? {
                  ...currentItem,
                  isCompleted: response.data.isCompleted,
                }
              : currentItem,
          ),
        );
      }
    } catch (error: any) {
      console.error("Failed to update checklist:", error);

      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update checklist",
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteChecklist(id);

      if (response?.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));

        showSuccessToast("Checklist deleted successfully");
      }
    } catch (error: any) {
      console.error("Failed to delete checklist:", error);

      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete checklist",
      );
    }
  };

  const handleAdd = async () => {
    const title = newItem.trim();

    if (!title || creating) return;

    try {
      setCreating(true);

      const response = await createChecklist(taskId, {
        title,
        position: items.length,
      });

      if (response?.success) {
        setItems((prev) => [...prev, response.data]);

        setNewItem("");
        setAdding(false);

        showSuccessToast("Checklist added successfully");
      }
    } catch (error: any) {
      console.error("Failed to create checklist:", error);

      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create checklist",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd();
    }

    if (event.key === "Escape") {
      setNewItem("");
      setAdding(false);
    }
  };

  const completedCount = items.filter((item) => item.isCompleted).length;

  const totalCount = items.length;

  const progress =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-muted-foreground" />

          <h3 className="text-sm font-semibold">Checklist</h3>

          {totalCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {completedCount}/{totalCount}
            </span>
          )}
        </div>

        {!adding && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setAdding(true)}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add item
          </Button>
        )}
      </div>

      {loading ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">Loading checklist...</p>
        </div>
      ) : (
        <>
          {totalCount > 0 && (
            <div className="space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                {progress}% completed
              </p>
            </div>
          )}

          <Separator />

          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-muted/40"
                >
                  <Checkbox
                    checked={item.isCompleted}
                    onCheckedChange={() => handleToggle(item)}
                  />

                  <div className="min-w-0 flex-1">
                    <p
                      className={
                        item.isCompleted
                          ? "text-sm text-muted-foreground line-through"
                          : "text-sm"
                      }
                    >
                      {item.title}
                    </p>
                  </div>

                  {item.isCompleted && (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <ListChecks className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />

              <p className="text-sm font-medium">No checklist items</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Break this task into smaller steps.
              </p>
            </div>
          )}
        </>
      )}

      {adding && (
        <div className="rounded-lg border bg-muted/30 p-3">
          <Input
            autoFocus
            value={newItem}
            disabled={creating}
            onChange={(event) => setNewItem(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done?"
          />

          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={creating}
              onClick={() => {
                setNewItem("");
                setAdding(false);
              }}
            >
              Cancel
            </Button>
            
            <Button
              type="button"
              size="sm"
              disabled={!newItem.trim() || creating}
              onClick={handleAdd}
            >
              <Plus className="mr-1.5 h-4 w-4" />

              {creating ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

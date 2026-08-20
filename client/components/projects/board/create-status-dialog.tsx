"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createProjectStatus } from "@/services/status.service";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

interface CreateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  projectId: string;

  onSuccess?: (status: {
    id: string;
    projectId: string;
    name: string;
    color: string;
    position: number;
    createdAt: string;
    updatedAt: string;
  }) => void;
}

const DEFAULT_COLOR = "#3B82F6";

export default function CreateStatusDialog({
  open,
  onOpenChange,
  projectId,
  onSuccess,
}: CreateStatusDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [loading, setLoading] = useState(false);

  function handleOpenChange(value: boolean) {
    if (loading) return;

    onOpenChange(value);

    if (!value) {
      setName("");
      setColor(DEFAULT_COLOR);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      showErrorToast("Status name is required");
      return;
    }

    if (trimmedName.length < 2) {
      showErrorToast("Status name must be at least 2 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await createProjectStatus(projectId, {
        name: trimmedName,
        color,
      });

      showSuccessToast(response.message || "Status created successfully");

      onSuccess?.(response.status);

      setName("");
      setColor(DEFAULT_COLOR);

      onOpenChange(false);
    } catch (error: any) {
      console.error("Create status error:", error);

      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create status",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Status</DialogTitle>

          <DialogDescription>
            Add a new status column to your project board.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="status-name">Status Name</Label>

            <Input
              id="status-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Testing"
              maxLength={50}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-color">Status Color</Label>

            <div className="flex items-center gap-3">
              <input
                id="status-color"
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                disabled={loading}
                className="h-10 w-12 cursor-pointer rounded-md border bg-background p-1"
              />

              <Input
                value={color}
                onChange={(event) => setColor(event.target.value)}
                placeholder="#3B82F6"
                maxLength={7}
                disabled={loading}
              />
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="mb-3 text-xs font-medium text-muted-foreground">
              Preview
            </p>

            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: color,
                }}
              />

              <span className="font-medium">
                {name.trim() || "Status Name"}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

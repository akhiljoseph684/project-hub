"use client";

import { useState } from "react";
import { z } from "zod";

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

import { ProjectLabel } from "./labels-table";

const createLabelSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Label name is required")
    .max(50, "Label name must be less than 50 characters"),

  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Enter a valid HEX color"),
});

interface CreateLabelDialogProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  projectId: string;

  onCreate: (label: ProjectLabel) => void;
}

export default function CreateLabelDialog({
  open,
  onOpenChange,
  projectId,
  onCreate,
}: CreateLabelDialogProps) {
  const [name, setName] = useState("");

  const [color, setColor] = useState("#3B82F6");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setError("");

    const result = createLabelSchema.safeParse({
      name,
      color,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid label");
      return;
    }

    try {
      setLoading(true);

      const newLabel: ProjectLabel = {
        id: crypto.randomUUID(),
        name: result.data.name,
        color: result.data.color,
        taskCount: 0,
      };

      onCreate(newLabel);

      setName("");
      setColor("#3B82F6");

      onOpenChange(false);
    } catch (error) {
      console.error(error);
      setError("Failed to create label");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setName("");
      setColor("#3B82F6");
      setError("");
    }

    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Label</DialogTitle>

          <DialogDescription>
            Create a label that can be assigned to tasks in this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="label-name">Label Name</Label>

            <Input
              id="label-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Frontend"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="label-color">Label Color</Label>

            <div className="flex items-center gap-3">
              <Input
                id="label-color"
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="h-10 w-14 cursor-pointer p-1"
              />

              <Input
                value={color}
                onChange={(event) => setColor(event.target.value)}
                placeholder="#3B82F6"
                className="font-mono"
              />
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Preview
            </p>

            <div
              className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium"
              style={{
                color,
                borderColor: `${color}60`,
                backgroundColor: `${color}15`,
              }}
            >
              <span
                className="mr-2 h-2 w-2 rounded-full"
                style={{
                  backgroundColor: color,
                }}
              />

              {name || "Label name"}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
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

          <Button type="button" disabled={loading} onClick={handleCreate}>
            {loading ? "Creating..." : "Create Label"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

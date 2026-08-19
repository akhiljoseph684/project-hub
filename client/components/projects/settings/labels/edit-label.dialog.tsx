"use client";

import { useEffect, useState } from "react";
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

const editLabelSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Label name is required")
    .max(50, "Label name must be less than 50 characters"),

  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Enter a valid HEX color"),
});

interface EditLabelDialogProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  label: ProjectLabel | null;

  onSave: (label: ProjectLabel) => void;
}

export default function EditLabelDialog({
  open,
  onOpenChange,
  label,
  onSave,
}: EditLabelDialogProps) {
  const [name, setName] = useState("");

  const [color, setColor] = useState("#3B82F6");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (label) {
      setName(label.name);
      setColor(label.color);
    }
  }, [label]);

  const handleSave = async () => {
    if (!label) return;

    setError("");

    const result = editLabelSchema.safeParse({
      name,
      color,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid label");
      return;
    }

    try {
      setLoading(true);

      const updatedLabel: ProjectLabel = {
        ...label,
        name: result.data.name,
        color: result.data.color,
      };

      onSave(updatedLabel);

      onOpenChange(false);
    } catch (error) {
      console.error(error);
      setError("Failed to update label");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Label</DialogTitle>

          <DialogDescription>
            Update the name or color of this project label.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-label-name">Label Name</Label>

            <Input
              id="edit-label-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Frontend"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-label-color">Label Color</Label>

            <div className="flex items-center gap-3">
              <Input
                id="edit-label-color"
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
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={loading || !label}
            onClick={handleSave}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

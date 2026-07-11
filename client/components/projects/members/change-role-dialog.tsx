"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import RoleSelect from "./role-select";
import { ProjectMember } from "./member-actions";

interface ChangeRoleDialogProps {
  open: boolean;

  member: ProjectMember | null;

  loading?: boolean;

  onClose: () => void;

  onSave: (roleId: string) => Promise<void>;
}

export default function ChangeRoleDialog({
  open,
  member,
  loading = false,
  onClose,
  onSave,
}: ChangeRoleDialogProps) {
  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    if (member) {
      setRoleId(member.role.id);
    } else {
      setRoleId("");
    }
  }, [member]);

  async function handleSave() {
    if (!roleId) return;

    await onSave(roleId);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Change Member Role</DialogTitle>

          <DialogDescription>
            Update the project role for this member.
          </DialogDescription>
        </DialogHeader>

        {member && (
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">
                {member.user.firstName} {member.user.lastName}
              </h3>

              <p className="text-sm text-muted-foreground">
                {member.user.email}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Current Role:{" "}
                <span className="font-medium text-foreground">
                  {member.role.name}
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <Label>Project Role</Label>

              <RoleSelect value={roleId} onChange={setRoleId} />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            disabled={loading || !roleId || roleId === member?.role.id}
            onClick={handleSave}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

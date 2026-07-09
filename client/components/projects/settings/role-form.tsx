"use client";

import { useEffect, useRef, useState } from "react";

import { Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import PermissionGroup from "./permission-group";
import { ProjectRole } from "./settings-roles";

interface RoleFormProps {
  mode: "create" | "edit";

  role: ProjectRole | null;

  onSave: (role: ProjectRole) => void;

  onCancel: () => void;
}

const permissionGroups = [
  {
    title: "Project",
    permissions: [
      {
        key: "project.view",
        label: "View Project",
      },
      {
        key: "project.update",
        label: "Update Project",
      },
      {
        key: "project.delete",
        label: "Delete Project",
      },
    ],
  },

  {
    title: "Tasks",
    permissions: [
      {
        key: "task.create",
        label: "Create Task",
      },
      {
        key: "task.update",
        label: "Update Task",
      },
      {
        key: "task.delete",
        label: "Delete Task",
      },
      {
        key: "task.assign",
        label: "Assign Task",
      },
      {
        key: "task.comment",
        label: "Comment Task",
      },
    ],
  },

  {
    title: "Members",
    permissions: [
      {
        key: "member.invite",
        label: "Invite Members",
      },
      {
        key: "member.remove",
        label: "Remove Members",
      },
      {
        key: "member.updateRole",
        label: "Update Member Role",
      },
    ],
  },

  {
    title: "Roles",
    permissions: [
      {
        key: "role.create",
        label: "Create Roles",
      },
      {
        key: "role.update",
        label: "Update Roles",
      },
      {
        key: "role.delete",
        label: "Delete Roles",
      },
    ],
  },
];

export default function RoleForm({
  mode,
  role,
  onSave,
  onCancel,
}: RoleFormProps) {
  const [form, setForm] = useState<ProjectRole>({
    id: "",
    name: "",
    description: "",
    color: "#2563eb",
    isSystem: false,
    permissions: {},
  });

  const formRef = useRef<HTMLDivElement>(null);

  function scrollToForm() {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  useEffect(() => {
    if (mode === "edit" && role) {
      setForm({
        id: role.id,
        name: role.name ?? "",
        description: role.description ?? "",
        color: role.color ?? "#2563eb",
        isSystem: role.isSystem,
        permissions: role.permissions ?? {},
      });
    }

    if (mode === "create") {
      setForm({
        id: "",
        name: "",
        description: "",
        color: "#2563eb",
        isSystem: false,
        permissions: {},
      });
    }
  }, [mode, role]);

  function updatePermission(key: string, checked: boolean) {
    setForm((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: checked,
      },
    }));
  }

  return (
    <Card className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Create Role" : "Edit Role"}
          </h2>

          <p className="text-sm text-muted-foreground">
            Configure project role permissions.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Role Name</label>

          <Input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            placeholder="Developer"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Description</label>

          <Textarea
            rows={4}
            value={form.description || ""}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            placeholder="Role description"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Role Color</label>

          <Input
            type="color"
            className="h-12 w-28"
            value={form.color}
            onChange={(e) =>
              setForm({
                ...form,
                color: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-6">
          {permissionGroups.map((group) => (
            <PermissionGroup
              key={group.title}
              title={group.title}
              permissions={group.permissions}
              values={form.permissions}
              onChange={updatePermission}
            />
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>

          <Button onClick={() => onSave(form)}>
            <Save className="mr-2 h-4 w-4" />

            {mode === "create" ? "Create Role" : "Save Changes"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

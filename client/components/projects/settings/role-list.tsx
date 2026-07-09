"use client";

import { Pencil, Plus, Shield, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { ProjectRole } from "./settings-roles";

interface RoleListProps {
  roles: ProjectRole[];

  selectedRole: ProjectRole | null;

  onSelect: (role: ProjectRole) => void;

  onCreate: () => void;

  onEdit: (role: ProjectRole) => void;

  onDelete: (role: ProjectRole) => void;
}

export default function RoleList({
  roles,
  selectedRole,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
}: RoleListProps) {
  return (
    <Card className="h-fit">

      <div className="flex items-center justify-between border-b p-5">
        <div>
          <h2 className="font-semibold">Project Roles</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage project roles and permissions.
          </p>
        </div>

        <Button size="icon" onClick={onCreate}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>


      <div className="space-y-2 p-4">
        {roles.map((role) => {
          const selected = selectedRole?.id === role.id;

          return (
            <div
              key={role.id}
              onClick={() => onSelect(role)}
              className={`group cursor-pointer rounded-lg border p-4 transition-all ${
                selected ? "border-primary bg-primary/5" : "hover:bg-muted"
              }`}
            >
              <div className="flex items-start justify-between">

                <div className="flex gap-3">
                  <div
                    className="mt-1 h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: role.color,
                    }}
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{role.name}</h3>

                      {role.isSystem && (
                        <Badge variant="secondary" className="gap-1">
                          <Shield className="h-3 w-3" />
                          System
                        </Badge>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                </div>


                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();

                      onEdit(role);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {!role.isSystem && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();

                        onDelete(role);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {roles.length === 0 && (
          <div className="rounded-lg border border-dashed py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No roles created yet.
            </p>

            <Button className="mt-4" onClick={onCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

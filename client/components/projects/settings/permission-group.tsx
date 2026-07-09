"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export interface Permission {
  key: string;
  label: string;
}

interface PermissionGroupProps {
  title: string;
  permissions: Permission[];

  values: Record<string, boolean>;

  onChange: (
    key: string,
    checked: boolean
  ) => void;
}

export default function PermissionGroup({
  title,
  permissions,
  values,
  onChange,
}: PermissionGroupProps) {
  const allSelected = permissions.every(
    (permission) => values[permission.key]
  );

  function toggleAll() {
    permissions.forEach((permission) => {
      onChange(permission.key, !allSelected);
    });
  }

  return (
    <div className="rounded-xl border">

      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h3 className="font-semibold">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground">
            Configure {title.toLowerCase()} permissions.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAll}
        >
          {allSelected
            ? "Clear All"
            : "Select All"}
        </Button>
      </div>


      <div className="grid gap-3 p-5 md:grid-cols-2">
        {permissions.map((permission) => (
          <div
            key={permission.key}
            className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-muted/50"
          >
            <div>
              <Label className="cursor-pointer text-sm font-medium">
                {permission.label}
              </Label>

              <p className="mt-1 text-xs text-muted-foreground">
                {permission.key}
              </p>
            </div>

            <Checkbox
              checked={values[permission.key] ?? false}
              onCheckedChange={(checked) =>
                onChange(
                  permission.key,
                  checked === true
                )
              }
            />
          </div>
        ))}
      </div>

      <Separator />
    </div>
  );
}
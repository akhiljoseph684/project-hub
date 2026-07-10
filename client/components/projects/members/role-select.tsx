"use client";

import { useEffect, useState } from "react";
import { Loader2, Shield } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getProjectRoles } from "@/services/project.service";
import { useAppSelector } from "@/redux/hooks";
import { showErrorToast } from "@/lib/toast";

interface ProjectRole {
  id: string;
  name: string;
  description: string;
  color?: string;
  isSystem: boolean;
}

interface RoleSelectProps {
  value: string;

  onChange: (value: string) => void;
}

export default function RoleSelect({ value, onChange }: RoleSelectProps) {
  const project = useAppSelector((state) => state.project.currentProject);

  const [roles, setRoles] = useState<ProjectRole[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, [project?.id]);

  async function fetchRoles() {
    try {
      if (!project?.id) return;

      setLoading(true);

      const res = await getProjectRoles(project.id);

      setRoles(res.roles);
    } catch (error: any) {
      showErrorToast(error.message || "Failed to load roles.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Project Role</label>

      <Select value={value} onValueChange={onChange} disabled={loading}>
        <SelectTrigger>
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>

        <SelectContent>
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: role.color || "#2563eb",
                    }}
                  />

                  <span>{role.name}</span>

                  {role.isSystem && (
                    <Shield className="ml-1 h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {value && (
        <p className="text-xs text-muted-foreground">
          {roles.find((role) => role.id === value)?.description}
        </p>
      )}
    </div>
  );
}

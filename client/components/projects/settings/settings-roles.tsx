"use client";

import { useEffect, useRef, useState } from "react";

import RoleList from "./role-list";
import RoleForm from "./role-form";
import {
  createProjectRole,
  deleteProjectRole,
  getProjectRoles,
  updateProjectRole,
} from "@/services/project.service";
import { useAppSelector } from "@/redux/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import DeleteRoleDialog from "./delete-role-dialog";

export interface ProjectRole {
  id: string;
  name: string;
  description: string;
  color: string;
  isSystem: boolean;
  permissions: Record<string, boolean>;
}


export default function SettingsRoles() {
  const [roles, setRoles] = useState<ProjectRole[]>([]);

  const [mode, setMode] = useState<"create" | "edit">("edit");

  const [selectedRole, setSelectedRole] = useState<ProjectRole | null>(
    roles[0],
  );

  const [deleteRole, setDeleteRole] = useState<ProjectRole | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const project = useAppSelector((state) => state.project.currentProject);
  console.log(project);

  useEffect(() => {
    fetchRoles();
  }, [project?.id]);

  async function fetchRoles() {
    try {
      if (!project?.id) return;
      const res = await getProjectRoles(project?.id);
      setRoles(res.roles);
    } catch (error: any) {
      showErrorToast(error.message);
    }
  }

  const scrollToForm = () => {
    if (!formRef.current) return;

    const y =
      formRef.current.getBoundingClientRect().top + window.pageYOffset - 70;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  function handleCreateRole() {
    setMode("create");

    requestAnimationFrame(() => {
      scrollToForm();
    });

    setSelectedRole(null);
  }

  function handleEditRole(role: ProjectRole) {
    setMode("edit");
    requestAnimationFrame(() => {
      scrollToForm();
    });

    setSelectedRole(role);
  }

  async function handleDeleteRole(role: ProjectRole) {
    try {
      await deleteProjectRole(role.id);

      await fetchRoles();

      setSelectedRole(null);

      setMode("create");
    } catch (error: any) {
      showErrorToast(error.message);
    }
  }

  async function handleSave(newRole: ProjectRole) {
    if (!project?.id) return;
    if (mode === "create") {
      try {
        let { role } = await createProjectRole(project?.id, newRole);
        setRoles((prev) => {
          return [
            ...prev,
            {
              id: role?.id,
              name: role.name,
              description: role.description,
              color: role.color,
              isSystem: false,
              permissions: role.permissions,
            },
          ];
        });
        showSuccessToast("Role Created Successfully");
      } catch (error: any) {
        showErrorToast(error.message || "Something Went Wrong");
      }
    } else {
      try {
        let { role } = await updateProjectRole(newRole.id, newRole);
        await fetchRoles();
        showSuccessToast("Role Updated Successfully");
      } catch (error: any) {
        showErrorToast(error.message || "Something Went Wrong");
      }
    }

    requestAnimationFrame(() => {
      scrollToForm();
    });

    setMode("create");
    setSelectedRole(newRole);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <RoleList
        roles={roles}
        selectedRole={selectedRole}
        onSelect={handleEditRole}
        onCreate={handleCreateRole}
        onEdit={handleEditRole}
        onDelete={(role) => {
          setDeleteRole(role);
        }}
      />

      <div ref={formRef}>
        <RoleForm
          mode={mode}
          role={selectedRole}
          onCancel={() => {
            setMode("edit");

            setSelectedRole(roles[0]);
          }}
          onSave={handleSave}
        />
      </div>

      <DeleteRoleDialog
        open={!!deleteRole}
        roleName={deleteRole?.name ?? ""}
        memberCount={0}
        loading={deleteLoading}
        onClose={() => {
          setDeleteRole(null);
        }}
        onDelete={async () => {
          if (!deleteRole) return;

          setDeleteLoading(true);

          try {
            await handleDeleteRole(deleteRole);
          } finally {
            setDeleteLoading(false);
            setDeleteRole(null);
          }
        }}
      />
    </div>
  );
}

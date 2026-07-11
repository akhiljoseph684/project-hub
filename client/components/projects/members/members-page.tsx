"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useAppSelector } from "@/redux/hooks";

import {
  createProjectInvitation,
  getProjectMembers,
  removeProjectMember,
  updateProjectMemberRole,
} from "@/services/project.service";

import { showErrorToast, showSuccessToast } from "@/lib/toast";

import MembersTable from "./members-table";
import InviteMemberDialog from "./invite-member-dialog";
import ChangeRoleDialog from "./change-role-dialog";
import RemoveMemberDialog from "./remove-member-dialog";

import { ProjectMember } from "./member-actions";

export default function MembersPage() {
  const project = useAppSelector(
    (state) => state.project.currentProject,
  );

  const [search, setSearch] = useState("");

  const [inviteOpen, setInviteOpen] = useState(false);

  const [members, setMembers] = useState<ProjectMember[]>([]);

  const [loading, setLoading] = useState(false);

  const [changeRoleOpen, setChangeRoleOpen] = useState(false);

  const [selectedMember, setSelectedMember] =
    useState<ProjectMember | null>(null);

  const [removeOpen, setRemoveOpen] = useState(false);

  const [removeLoading, setRemoveLoading] =
    useState(false);

  useEffect(() => {
    if (project?.id) {
      fetchMembers();
    }
  }, [project?.id]);

  async function fetchMembers() {
    try {
      if (!project?.id) return;

      setLoading(true);

      const res = await getProjectMembers(project.id);

      setMembers(res.members);
    } catch (error: any) {
      showErrorToast(
        error.message || "Failed to load members.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite(
    userId: string,
    roleId: string,
  ) {
    try {
      if (!project?.id) return;

      await createProjectInvitation(project.id, {
        userId,
        roleId,
      });

      showSuccessToast("Invitation sent successfully.");

      setInviteOpen(false);
    } catch (error: any) {
      showErrorToast(
        error.message || "Failed to send invitation.",
      );
    }
  }

  async function handleChangeRole(roleId: string) {
    try {
      if (!project?.id || !selectedMember) return;

      await updateProjectMemberRole(
        project.id,
        selectedMember.id,
        {
          roleId,
        },
      );

      showSuccessToast(
        "Member role updated successfully.",
      );

      await fetchMembers();

      setChangeRoleOpen(false);

      setSelectedMember(null);
    } catch (error: any) {
      showErrorToast(
        error.message || "Failed to update role.",
      );
    }
  }

  async function handleRemove(memberId: string) {
    try {
      if (!project?.id) return;

      await removeProjectMember(
        project.id,
        memberId,
      );

      showSuccessToast(
        "Member removed successfully.",
      );

      await fetchMembers();
    } catch (error: any) {
      showErrorToast(
        error.message || "Failed to remove member.",
      );
    }
  }

  return (
  <div className="space-y-6">

    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold">
          Project Members
        </h1>

        <p className="mt-2 text-muted-foreground">
          Invite members, assign project roles, and manage access.
        </p>
      </div>

      <Button onClick={() => setInviteOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Invite Member
      </Button>
    </div>


    <Card className="p-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search project members..."
          className="pl-10"
        />
      </div>
    </Card>


    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />

          <h2 className="font-semibold">
            Project Members
          </h2>
        </div>

        <span className="text-sm text-muted-foreground">
          {members.length} Members
        </span>
      </div>

      <MembersTable
        members={members}
        search={search}
        onChangeRole={(member) => {
          setSelectedMember(member);
          setChangeRoleOpen(true);
        }}
        onRemove={(member) => {
          setSelectedMember(member);
          setRemoveOpen(true);
        }}
      />
    </Card>


    <InviteMemberDialog
      open={inviteOpen}
      onClose={() => setInviteOpen(false)}
      onInvite={handleInvite}
    />


    <ChangeRoleDialog
      open={changeRoleOpen}
      member={selectedMember}
      onClose={() => {
        setChangeRoleOpen(false);
        setSelectedMember(null);
      }}
      onSave={handleChangeRole}
    />


    <RemoveMemberDialog
      open={removeOpen}
      member={selectedMember}
      loading={removeLoading}
      onClose={() => {
        setRemoveOpen(false);
        setSelectedMember(null);
      }}
      onRemove={async () => {
        if (!selectedMember) return;

        setRemoveLoading(true);

        try {
          await handleRemove(selectedMember.id);
        } finally {
          setRemoveLoading(false);
          setRemoveOpen(false);
          setSelectedMember(null);
        }
      }}
    />
  </div>
);
}
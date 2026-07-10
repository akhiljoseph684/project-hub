"use client";

import { useState } from "react";
import { Plus, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import MembersTable from "./members-table";
import InviteMemberDialog from "./invite-member-dialog";
// import RecommendedMembers from "./recommended-members";

export default function MembersPage() {
  const [search, setSearch] = useState("");

  const [inviteOpen, setInviteOpen] = useState(false);

  const handleInvite = async (userId: string, roleId: string) => {
    console.log({
      userId,
      roleId,
    });

    setInviteOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Members</h1>

          <p className="mt-2 text-muted-foreground">
            Invite members, assign project roles, and manage access.
          </p>
        </div>

        <Button onClick={() => setInviteOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Search */}

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

      {/* Recommended Members */}

      {/* <RecommendedMembers /> */}

      {/* Members */}

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />

            <h2 className="font-semibold">Project Members</h2>
          </div>

          <span className="text-sm text-muted-foreground">0 Members</span>
        </div>

        <MembersTable search={search} />
      </Card>

      {/* Invite Dialog */}

      <InviteMemberDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  );
}

"use client";

import { UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyMembersProps {
  onInvite: () => void;
}

export default function EmptyMembers({ onInvite }: EmptyMembersProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Users className="h-8 w-8 text-muted-foreground" />
      </div>

      <h2 className="text-xl font-semibold">No Members Yet</h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Invite teammates to collaborate on this project. Assign project roles to
        control permissions and access.
      </p>

      <Button className="mt-6" onClick={onInvite}>
        <UserPlus className="mr-2 h-4 w-4" />
        Invite First Member
      </Button>
    </div>
  );
}

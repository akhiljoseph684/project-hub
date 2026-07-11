"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, UserPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import RoleSelect from "./role-select";
import UserSearch, { SearchUser } from "./user-search";

interface InviteMemberDialogProps {
  open: boolean;

  loading?: boolean;

  onClose: () => void;

  onInvite: (userId: string, roleId: string) => Promise<void>;
}

export default function InviteMemberDialog({
  open,
  loading = false,
  onClose,
  onInvite,
}: InviteMemberDialogProps) {
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);

  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    if (!open) {
      setSearch("");
      setSelectedUser(null);
      setRoleId("");
    }
  }, [open]);

  async function handleInvite() {
    if (!selectedUser || !roleId) return;

    await onInvite(selectedUser.id, roleId);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>

          <DialogDescription>
            Search for a user, assign a project role and send an invitation to
            join this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">

          <div className="space-y-2">
            <label className="text-sm font-medium">Search User</label>

            <UserSearch
              search={search}
              selectedUser={selectedUser}
              setSearch={setSearch}
              onSelect={setSelectedUser}
            />
          </div>


          {selectedUser && (
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={selectedUser.avatar} />

                  <AvatarFallback>
                    {selectedUser.firstName[0]}
                    {selectedUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="font-medium">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>
          )}


          <RoleSelect value={roleId} onChange={setRoleId} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            disabled={!selectedUser || !roleId || loading}
            onClick={handleInvite}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Send Invitation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

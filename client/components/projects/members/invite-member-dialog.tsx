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
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import RoleSelect from "./role-select";
import UserSearch from "./user-search";

interface InviteMemberDialogProps {
  open: boolean;
  loading?: boolean;

  onClose: () => void;

  onInvite: (userId: string, roleId: string) => Promise<void>;
}

export interface SearchUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>

          <DialogDescription>
            Search for a user and assign a project role.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}

          <div className="space-y-2">
            <label className="text-sm font-medium">Search User</label>

            <div className="relative">
              <Search className="absolute left-3 top-1.5 h-4 w-4 text-muted-foreground" />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                placeholder="Search name or email..."
              />
            </div>

            <UserSearch
              search={search}
              selectedUser={selectedUser}
              onSelect={setSelectedUser}
              setSearch={setSearch}
            />
          </div>

          {/* Selected */}

          {selectedUser && (
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar} />

                  <AvatarFallback>
                    {selectedUser.firstName[0]}
                    {selectedUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h4 className="font-medium">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Role */}

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
                Inviting...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

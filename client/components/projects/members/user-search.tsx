"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { searchUsers } from "@/services/project.service";
import { showErrorToast } from "@/lib/toast";
import UserAvatar from "@/components/user-avatar";
import { useAppSelector } from "@/redux/hooks";
import { Input } from "@/components/ui/input";

export interface SearchUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

interface UserSearchProps {
  search: string;

  selectedUser: SearchUser | null;

  onSelect: (user: SearchUser) => void;

  setSearch: any;
}

export default function UserSearch({
  search,
  selectedUser,
  onSelect,
  setSearch,
}: UserSearchProps) {
  const [users, setUsers] = useState<SearchUser[]>([]);

  const [loading, setLoading] = useState(false);

  const onlineUsers = useAppSelector((state) => state.socket.onlineUsers);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  async function fetchUsers() {
    try {
      if (!search.trim()) {
        setUsers([]);
        return;
      }

      setLoading(true);

      const res = await searchUsers(search);

      setUsers(res.users);
    } catch (error: any) {
      showErrorToast(error.message || "Failed to search users.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(user: any) {
    onSelect(user);
    setSearch("");
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="pl-10"
        />
      </div>

      {!search.trim() ? null : (
        <div className="max-h-72 overflow-y-auto rounded-xl border">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-muted-foreground">
              <Search className="mb-2 h-5 w-5" />
              <p>No users found.</p>
            </div>
          ) : (
            users.map((user) => {
              const active = selectedUser?.id === user.id;

              return (
                <button
                  key={user.id}
                  onClick={() => handleSelect(user)}
                  className={`flex w-full items-center gap-3 border-b p-4 text-left transition hover:bg-muted ${
                    active ? "bg-primary/5" : ""
                  }`}
                >
                  <UserAvatar
                    avatar={user.avatar}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    isOnline={!!onlineUsers[user.id]}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>

                    <p className="truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>

                  {active && <User className="h-4 w-4 text-primary" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

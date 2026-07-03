"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Search, UserPlus, Trash2, Users } from "lucide-react";

import { CreateProjectInput } from "@/lib/validations/project";
import { useDebounce } from "@/hooks/useDebounce";
import { searchUsers } from "@/services/project.service";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { FormField, FormItem, FormLabel } from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { showErrorToast } from "@/lib/toast";
import UserAvatar from "../user-avatar";
import { useAppSelector } from "@/redux/hooks";

interface Props {
  form: UseFormReturn<CreateProjectInput>;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string | null;
  isOnline: boolean;
}

export default function ProjectMembers({ form }: Props) {
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState<User[]>([]);

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const [loadingUsers, setLoadingUsers] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const onlineUsers = useAppSelector((state) => state.socket.onlineUsers);

  const members = form.watch("members");

  useEffect(() => {
    async function fetchUsers() {
      if (debouncedSearch.trim().length < 1) {
        setUsers([]);
        return;
      }

      try {
        setLoadingUsers(true);

        const res = await searchUsers(debouncedSearch);


        const availableUsers = res.users.filter(
          (user: User) => !members.some((member) => member.userId === user.id),
        );

        setUsers(availableUsers);
      } catch (error: any) {
        showErrorToast(error.message);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    }

    fetchUsers();
  }, [debouncedSearch, members]);

  function addMember(user: User) {
    form.setValue("members", [
      ...members,
      {
        userId: user.id,
        role: "MEMBER",
      },
    ]);

    setSelectedUsers((prev) => [...prev, user]);

    setSearch("");
    setUsers([]);
  }

  function removeMember(id: string) {
    form.setValue(
      "members",
      members.filter((member) => member.userId !== id),
    );

    setSelectedUsers((prev) => prev.filter((user) => user.id !== id));
  }

  function updateRole(id: string, role: "ADMIN" | "MEMBER" | "VIEWER") {
    form.setValue(
      "members",
      members.map((member) =>
        member.userId === id
          ? {
              ...member,
              role,
            }
          : member,
      ),
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Members</CardTitle>

        <CardDescription>
          Search users and invite them to your project.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="members"
          render={() => (
            <FormItem>
              <FormLabel>Search User</FormLabel>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="h-11 pl-10"
                />
              </div>

              {loadingUsers && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Searching users...
                </p>
              )}

              {search.length >= 2 && users.length > 0 && (
                <div className="mt-3 rounded-xl border">
                  {users.map((user) => {
                    const fullName =
                      `${user.firstName} ${user.lastName}`.trim();

                    return (
                      <div
                        key={user.id}
                        onClick={() => addMember(user)}
                        className="flex items-center justify-between gap-3 border-b px-4 py-3 transition hover:bg-muted/50 last:border-b-0"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <UserAvatar
                            avatar={user?.avatar}
                            firstName={user?.firstName}
                            lastName={user?.lastName}
                            isOnline={!!onlineUsers[user.id]}
                          />

                          <div className="min-w-0">
                            <p className="truncate font-medium">{fullName}</p>

                            <p className="truncate text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <Button size="sm" type="button" className="shrink-0">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}

              {search.length >= 2 && !loadingUsers && users.length === 0 && (
                <div className="mt-3 rounded-lg border border-dashed p-6 text-center">
                  <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

                  <p className="font-medium">No users found</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Try searching with a different email or name.
                  </p>
                </div>
              )}
            </FormItem>
          )}
        />
        {members.length > 0 ? (
          <div className="overflow-hidden rounded-xl border">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[80px] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {members.map((member) => {
                  const user = selectedUsers.find(
                    (u) => u.id === member.userId,
                  );

                  if (!user) return null;

                  const fullName = `${user.firstName} ${user.lastName}`.trim();

                  return (
                    <TableRow key={member.userId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            avatar={user?.avatar}
                            firstName={user?.firstName}
                            lastName={user?.lastName}
                            isOnline={!!onlineUsers[user.id]}
                          />

                          <span className="font-medium">{fullName}</span>
                        </div>
                      </TableCell>

                      <TableCell>{user.email}</TableCell>

                      <TableCell>
                        <Select
                          value={member.role}
                          onValueChange={(value) =>
                            updateRole(
                              member.userId,
                              value as "ADMIN" | "MEMBER" | "VIEWER",
                            )
                          }
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>

                            <SelectItem value="MEMBER">Member</SelectItem>

                            <SelectItem value="VIEWER">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMember(member.userId)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />

            <h3 className="text-lg font-semibold">No Members Added</h3>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Search for users above and invite them to collaborate on this
              project.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

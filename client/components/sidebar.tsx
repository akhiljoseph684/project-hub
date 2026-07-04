"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Users,
  Rocket,
  BarChart3,
  CreditCard,
  LogOut,
  User,
} from "lucide-react";

import logo from "../public/project_hub_logo_with_name.png";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { logoutUser } from "@/services/auth.service";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { showErrorToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { socket } from "@/lib/socket";
import UserAvatar from "./user-avatar";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: ListTodo,
  },
  {
    label: "Teams",
    href: "/teams",
    icon: Users,
  },
  {
    label: "Sprints",
    href: "/sprints",
    icon: Rocket,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
];

interface DashboardSidebarProps {
  closeSidebar?: () => void;
}

export default function DashboardSidebar({
  closeSidebar,
}: DashboardSidebarProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logoutUser();

      dispatch(logout());
      socket.disconnect();

      router.push("/login");
    } catch (error) {
      showErrorToast("Logout Failed");
    }
  };

  return (
    <aside className="flex h-full w-full flex-col border-r bg-background md:h-screen md:w-72">
      <div className="border-b p-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <img
            src={logo.src}
            alt="Logo"
            className="h-auto w-28 sm:w-32 md:w-36 lg:w-40"
          />
        </Link>
      </div>

      <div className="flex-1 sidebar-scroll overflow-y-auto p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeSidebar}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                <Icon className="h-5 w-5" />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {user?.plan?.slug !== "businness" && (
          <div className="mt-8 rounded-xl border bg-muted/40 p-4">
            <p className="text-sm font-semibold">{user?.plan?.name} Plan</p>

            <p className="mt-2 text-xs text-muted-foreground">
              Upgrade to unlock unlimited projects, advanced analytics and team
              collaboration.
            </p>

            <Link
              href="/billing"
              onClick={closeSidebar}
              className="mt-3 inline-block text-sm font-medium text-primary"
            >
              Upgrade Plan →
            </Link>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Theme</span>

          <ThemeToggle />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted">
              <UserAvatar
                avatar={user?.avatar}
                firstName={user?.firstName}
                lastName={user?.lastName}
                isOnline={true}
              />

              <div className="flex-1 text-left">
                <p className="text-sm font-medium">
                  {user?.firstName + " " + user?.lastName}
                </p>

                <p className="text-xs text-muted-foreground">
                  {user?.plan?.name} Plan
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <Link href="/profile">
              <DropdownMenuItem onClick={closeSidebar}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
            </Link>

            <Link href="/billing">
              <DropdownMenuItem onClick={closeSidebar}>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

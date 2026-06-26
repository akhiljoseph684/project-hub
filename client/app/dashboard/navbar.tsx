"use client";

import { Bell, Menu, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import DashboardSidebar from "./sidebar";
import { useState } from "react";

export default function DashboardNavbar() {
  
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">

        <div className="flex items-center gap-4">

          

<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild>
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
    >
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>

  <SheetContent side="left" className="w-72 p-0">
    <DashboardSidebar closeSidebar={() => setOpen(false)} />
  </SheetContent>
</Sheet>

          <div>
            <h1 className="text-base font-semibold md:text-lg">
              My Workspace
            </h1>

            <p className="hidden text-sm text-muted-foreground sm:block">
              Organization Workspace
            </p>
          </div>
        </div>


        <div className="hidden flex-1 justify-center px-8 lg:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search projects, tasks..."
              className="h-10 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>


        <div className="flex items-center gap-2 md:gap-4">

          <Button
            size="icon"
            className="sm:hidden"
          >
            <Plus className="h-4 w-4" />
          </Button>


          <Button className="hidden sm:flex">
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>


          <Button
            variant="outline"
            size="icon"
          >
            <Bell className="h-4 w-4" />
          </Button>


          <div className="flex items-center gap-3 border-l pl-3 md:pl-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                AJ
              </AvatarFallback>
            </Avatar>

            <div className="hidden md:block">
              <p className="text-sm font-medium">
                Akhil
              </p>

              <p className="text-xs text-muted-foreground">
                Admin
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
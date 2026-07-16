"use client";

import { useState } from "react";

import BoardHeader from "@/components/projects/board/board-header";
import BoardToolbar from "@/components/projects/board/board-toolbar";
import BoardList, { BoardColumnData } from "@/components/projects/board/board-list";
import BoardEmpty from "@/components/projects/board/board-empty";
import CreateTaskDialog from "@/components/projects/task/create-task-dialog";

export default function BoardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const project = {
    id: "1",
    name: "ProjectHub",
    key: "PH",
    slug: "projecthub",
    visibility: "PRIVATE" as const,
    color: "#2563EB",
  };

  const statuses = [
    {
      id: "todo",
      name: "Todo",
      color: "#3B82F6",
    },
    {
      id: "progress",
      name: "In Progress",
      color: "#F59E0B",
    },
    {
      id: "done",
      name: "Done",
      color: "#22C55E",
    },
  ];

  const members = [
    {
      id: "1",
      name: "Akhil Joseph",
      email: "akhil@gmail.com",
    },
  ];

  const labels = [
    {
      id: "1",
      name: "Frontend",
      color: "#3B82F6",
    },
  ];

  const columns = [
    {
      id: "todo",
      title: "To Do",
      color: "#3B82F6",
      tasks: [
        {
          id: "1",
          key: "PH-1",
          title: "Design Login Page",
          description: "Create responsive login and register pages.",
          priority: "HIGH",
          dueDate: "2026-07-25",

          assignee: {
            id: "1",
            name: "Akhil Joseph",
          },

          labels: [
            {
              id: "1",
              name: "Frontend",
              color: "#3B82F6",
            },
          ],

          commentsCount: 4,
          attachmentsCount: 2,

          checklist: {
            completed: 2,
            total: 5,
          },
        },

        {
          id: "2",
          key: "PH-2",
          title: "Create Authentication API",
          description: "Implement login, register and refresh token endpoints.",
          priority: "URGENT",

          assignee: {
            id: "2",
            name: "John Doe",
          },

          labels: [
            {
              id: "2",
              name: "Backend",
              color: "#22C55E",
            },
          ],

          commentsCount: 3,
          attachmentsCount: 1,

          checklist: {
            completed: 5,
            total: 8,
          },
        },
      ],
    },

    {
      id: "progress",
      title: "In Progress",
      color: "#F59E0B",
      tasks: [
        {
          id: "3",
          key: "PH-3",
          title: "Project Settings Page",
          description: "Complete roles & permissions section.",
          priority: "MEDIUM",

          assignee: {
            id: "1",
            name: "Akhil Joseph",
          },

          labels: [
            {
              id: "3",
              name: "Feature",
              color: "#A855F7",
            },
          ],

          commentsCount: 1,
          attachmentsCount: 0,

          checklist: {
            completed: 3,
            total: 6,
          },
        },
      ],
    },

    {
      id: "review",
      title: "Review",
      color: "#8B5CF6",
      tasks: [
        {
          id: "4",
          key: "PH-4",
          title: "Dashboard UI",
          description: "Waiting for code review.",
          priority: "LOW",

          assignee: {
            id: "2",
            name: "John Doe",
          },

          labels: [
            {
              id: "4",
              name: "UI",
              color: "#EC4899",
            },
          ],

          commentsCount: 7,
          attachmentsCount: 0,

          checklist: {
            completed: 6,
            total: 6,
          },
        },
      ],
    },

    {
      id: "done",
      title: "Done",
      color: "#22C55E",
      tasks: [
        {
          id: "5",
          key: "PH-5",
          title: "Create Project Module",
          description: "Project creation completed successfully.",
          priority: "MEDIUM",

          assignee: {
            id: "1",
            name: "Akhil Joseph",
          },

          labels: [
            {
              id: "5",
              name: "Completed",
              color: "#10B981",
            },
          ],

          commentsCount: 12,
          attachmentsCount: 3,

          checklist: {
            completed: 10,
            total: 10,
          },
        },
      ],
    },
    ] satisfies BoardColumnData[];

  return (
    <div className="space-y-6">

      <BoardToolbar
        search=""
        sprint="all"
        assignee="all"
        priority="all"
        view="board"
        onSearchChange={() => {}}
        onSprintChange={() => {}}
        onAssigneeChange={() => {}}
        onPriorityChange={() => {}}
        onViewChange={() => {}}
        onResetFilters={() => {}}
        onCreateTask={() => setDialogOpen(true)}
      />

      {columns.length === 0 ? (
        <BoardEmpty onCreateTask={() => setDialogOpen(true)} />
      ) : (
        <BoardList
          columns={columns}
          onTaskClick={(task) => console.log(task)}
          onCreateTask={(columnId) => console.log("Create task in:", columnId)}
        />
      )}

      <CreateTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectId={project.id}
        statuses={statuses}
        members={members}
        labels={labels}
        defaultStatusId={statuses[0].id}
        onSuccess={() => {
          console.log("Task Created");
        }}
      />
    </div>
  );
}

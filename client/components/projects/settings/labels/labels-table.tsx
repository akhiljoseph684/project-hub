"use client";

import { MoreHorizontal, Pencil, Trash2, Tags } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface ProjectLabel {
  id: string;
  name: string;
  color: string;
  taskCount?: number;
}

interface LabelsTableProps {
  labels: ProjectLabel[];

  onEdit: (label: ProjectLabel) => void;

  onDelete: (labelId: string) => void;
}

export default function LabelsTable({
  labels,
  onEdit,
  onDelete,
}: LabelsTableProps) {
  if (labels.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Tags className="h-6 w-6 text-muted-foreground" />
        </div>

        <h3 className="font-semibold">No labels found</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Create a label or change your search.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Label</TableHead>
            <TableHead>Color</TableHead>
            <TableHead className="w-[70px]" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {labels.map((label) => (
            <TableRow key={label.id}>
              <TableCell>
                <Badge
                  variant="outline"
                  style={{
                    color: label.color,
                    borderColor: `${label.color}60`,
                    backgroundColor: `${label.color}15`,
                  }}
                >
                  <span
                    className="mr-2 h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: label.color,
                    }}
                  />

                  {label.name}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <span
                    className="h-6 w-6 rounded-md border"
                    style={{
                      backgroundColor: label.color,
                    }}
                  />

                  <span className="font-mono text-xs text-muted-foreground">
                    {label.color}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEdit(label)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(label.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
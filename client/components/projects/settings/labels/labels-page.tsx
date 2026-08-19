"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Tags } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import LabelsTable, { ProjectLabel } from "./labels-table";
import CreateLabelDialog from "./create-label-dialog";
import EditLabelDialog from "./edit-label.dialog";
import { deleteLabel, getProjectLabels, updateLabel, createLabel } from "@/services/label.service";
import { showErrorToast } from "@/lib/toast";

interface LabelsPageProps {
  projectId: string;
}

const initialLabels: ProjectLabel[] = [
  {
    id: "1",
    name: "Frontend",
    color: "#3B82F6",
    taskCount: 8,
  },
  {
    id: "2",
    name: "Backend",
    color: "#22C55E",
    taskCount: 12,
  },
  {
    id: "3",
    name: "Bug",
    color: "#EF4444",
    taskCount: 5,
  },
  {
    id: "4",
    name: "Feature",
    color: "#A855F7",
    taskCount: 7,
  },
];

export default function LabelsPage({ projectId }: LabelsPageProps) {
  const [labels, setLabels] = useState([]);

  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [selectedLabel, setSelectedLabel] = useState<ProjectLabel | null>(null);

  const fetchLabels = async () =>{
    try {
        const res = await getProjectLabels(projectId);
        console.log(res)
        setLabels(res.labels)
    } catch (error: any) {
        showErrorToast(error.message)
    }
  }

  useEffect(() => {
    fetchLabels()
  },[projectId])

  const handleCreateLabel = async (label: ProjectLabel) => {
    await createLabel(projectId, label)
    fetchLabels();
  };

  const handleEditLabel = async (updatedLabel: ProjectLabel) => {
    await updateLabel(updatedLabel.id, updatedLabel)
    fetchLabels();
  };

  const handleDeleteLabel = async (labelId: string) => {
    await deleteLabel(labelId)
    fetchLabels();
  };

  const handleEdit = (label: ProjectLabel) => {
    setSelectedLabel(label);
    setEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Tags className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">Labels</h1>

              <p className="text-sm text-muted-foreground">
                Create and manage labels for tasks in this project.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Label
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Project Labels</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Labels help organize and categorize your tasks.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search labels..."
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <LabelsTable
            labels={labels}
            onEdit={handleEdit}
            onDelete={handleDeleteLabel}
          />
        </CardContent>
      </Card>

      <CreateLabelDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        projectId={projectId}
        onCreate={handleCreateLabel}
      />

      <EditLabelDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        label={selectedLabel}
        onSave={handleEditLabel}
      />
    </div>
  );
}

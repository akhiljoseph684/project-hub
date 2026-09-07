"use client";

import { useEffect, useState } from "react";
import {
  File,
  FileImage,
  FileText,
  FileArchive,
  FileVideo,
  FileAudio,
  Download,
  Trash2,
  FolderOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useAppSelector } from "@/redux/hooks";

import {
  deleteProjectFile,
  getProjectFiles,
} from "@/services/project-file.service";

import { showErrorToast, showSuccessToast } from "@/lib/toast";

interface ProjectFile {
  id: string;
  taskId: string;
  uploadedById: string;

  fileName: string;
  fileUrl: string;
  storageKey?: string | null;
  mimeType?: string | null;
  size?: number | null;

  createdAt: string;

  uploadedBy: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
  };

  task: {
    id: string;
    key: string;
    title: string;
  };
}

export default function ProjectFilesPage() {
  const project = useAppSelector((state) => state.project.currentProject);

  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchFiles = async () => {
    if (!project?.id) return;

    try {
      setLoading(true);

      const response = await getProjectFiles(project.id);

      if (response?.success) {
        setFiles(response.data || []);
      }
    } catch (error: any) {
      console.error("Failed to fetch project files:", error);

      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch project files",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!project?.id) return;

    fetchFiles();
  }, [project?.id]);

  const handleDelete = async (fileId: string) => {
    try {
      setDeletingId(fileId);

      const response = await deleteProjectFile(fileId);

      if (response?.success) {
        setFiles((prev) => prev.filter((file) => file.id !== fileId));

        showSuccessToast("File deleted successfully");
      }
    } catch (error: any) {
      console.error("Failed to delete project file:", error);

      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete file",
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-xl font-semibold">Files</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Files attached to tasks in this project.
          </p>
        </div>

        <Separator />

        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Files</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Files attached to tasks in this project.
          </p>
        </div>

        {files.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {files.length} {files.length === 1 ? "file" : "files"}
          </span>
        )}
      </div>

      <Separator />

      {files.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <FolderOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

          <h2 className="text-sm font-semibold">No files yet</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Files attached to project tasks will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              deleting={deletingId === file.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FileCardProps {
  file: ProjectFile;
  deleting: boolean;
  onDelete: (fileId: string) => void;
}

function FileCard({ file, deleting, onDelete }: FileCardProps) {
  const uploaderName =
    `${file.uploadedBy.firstName} ${file.uploadedBy.lastName}`.trim();

  return (
    <div className="group overflow-hidden rounded-lg border bg-background transition-shadow hover:shadow-sm">
      <div className="flex h-36 items-center justify-center bg-muted/30">
        <FileIcon
          mimeType={file.mimeType}
          className="h-12 w-12 text-muted-foreground"
        />
      </div>

      <div className="space-y-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium" title={file.fileName}>
            {file.fileName}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
        </div>

        <div className="rounded-md bg-muted/50 px-2.5 py-2">
          <p className="text-xs font-medium">{file.task.key}</p>

          <p
            className="truncate text-xs text-muted-foreground"
            title={file.task.title}
          >
            {file.task.title}
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          Uploaded by {uploaderName || "Unknown"}
        </p>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
              <Download className="mr-1.5 h-4 w-4" />
              Open
            </a>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={deleting}
            onClick={() => onDelete(file.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function FileIcon({
  mimeType,
  className,
}: {
  mimeType?: string | null;
  className?: string;
}) {
  if (mimeType?.startsWith("image/")) {
    return <FileImage className={className} />;
  }

  if (mimeType?.startsWith("video/")) {
    return <FileVideo className={className} />;
  }

  if (mimeType?.startsWith("audio/")) {
    return <FileAudio className={className} />;
  }

  if (
    mimeType === "application/pdf" ||
    mimeType?.includes("text") ||
    mimeType?.includes("document")
  ) {
    return <FileText className={className} />;
  }

  if (
    mimeType?.includes("zip") ||
    mimeType?.includes("rar") ||
    mimeType?.includes("compressed")
  ) {
    return <FileArchive className={className} />;
  }

  return <File className={className} />;
}

function formatFileSize(size?: number | null) {
  if (!size) return "Unknown size";

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

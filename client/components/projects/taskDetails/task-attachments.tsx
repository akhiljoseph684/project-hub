"use client";

import { useRef, useState } from "react";
import {
  Download,
  File,
  FileImage,
  FileText,
  Loader2,
  Paperclip,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { deleteTaskAttachment, uploadTaskAttachment } from "@/services/task.service";

interface TaskAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType?: string | null;
  size?: number | null;

  uploadedBy: {
    id: string;
    name: string;
    avatar?: string | null;
  };

  createdAt: string;
}

interface TaskAttachmentsProps {
  taskId: string;
  attachments: TaskAttachment[];
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function TaskAttachments({
  taskId,
  attachments,
}: TaskAttachmentsProps) {
  const [items, setItems] = useState<TaskAttachment[]>(attachments);

  const [uploading, setUploading] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    event.target.value = "";

    if (file.size > MAX_FILE_SIZE) {
      showErrorToast("File size must be less than 10 MB.");

      return;
    }

    try {
      setUploading(true);

      const response = await uploadTaskAttachment(taskId, file);

      setItems((prev) => [...prev, response.attachment]);

      console.log("Upload attachment:", taskId, file);

      showSuccessToast("File selected successfully.");
    } catch (error: any) {
      console.error("Upload attachment error:", error);

      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload attachment.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(attachment: TaskAttachment) {
    try {
      setDeletingId(attachment.id);

      await deleteTaskAttachment(
         attachment.id,
       );

      setItems((prev) => prev.filter((item) => item.id !== attachment.id));

      showSuccessToast("Attachment deleted successfully.");
    } catch (error: any) {
      console.error("Delete attachment error:", error);

      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete attachment.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  function handleDownload(attachment: TaskAttachment) {
    window.open(attachment.fileUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="h-4 w-4 text-muted-foreground" />

          <h3 className="text-sm font-semibold">Attachments</h3>

          {items.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {items.length}
            </span>
          )}
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleUploadClick}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Plus className="mr-1.5 h-4 w-4" />
                Add attachment
              </>
            )}
          </Button>
        </div>
      </div>

      <Separator />

      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((attachment) => (
            <AttachmentItem
              key={attachment.id}
              attachment={attachment}
              deleting={deletingId === attachment.id}
              onDownload={() => handleDownload(attachment)}
              onDelete={() => handleDelete(attachment)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Paperclip className="h-5 w-5 text-muted-foreground" />
          </div>

          <p className="text-sm font-medium">No attachments</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Upload files related to this task.
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={handleUploadClick}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload file
          </Button>
        </div>
      )}
    </section>
  );
}

interface AttachmentItemProps {
  attachment: TaskAttachment;
  deleting: boolean;
  onDownload: () => void;
  onDelete: () => void;
}

function AttachmentItem({
  attachment,
  deleting,
  onDownload,
  onDelete,
}: AttachmentItemProps) {
  return (
    <div className="group flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-muted/40">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        <AttachmentIcon mimeType={attachment.mimeType} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium" title={attachment.fileName}>
          {attachment.fileName}
        </p>

        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {attachment.size != null && (
            <>
              <span>{formatFileSize(attachment.size)}</span>

              <span>•</span>
            </>
          )}

          <span>{attachment.uploadedBy.name}</span>

          <span>•</span>

          <span>{formatDate(attachment.createdAt)}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onDownload}
          title="Download"
        >
          <Download className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onDelete}
          disabled={deleting}
          title="Delete"
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 text-destructive" />
          )}
        </Button>
      </div>
    </div>
  );
}

function AttachmentIcon({ mimeType }: { mimeType?: string | null }) {
  if (mimeType?.startsWith("image/")) {
    return <FileImage className="h-5 w-5 text-blue-500" />;
  }

  if (mimeType === "application/pdf" || mimeType?.includes("text")) {
    return <FileText className="h-5 w-5 text-red-500" />;
  }

  return <File className="h-5 w-5 text-muted-foreground" />;
}

function formatFileSize(size: number) {
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

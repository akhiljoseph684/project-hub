"use client";

import { useState } from "react";
import { Check, Plus, Trash2, ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface ChecklistItem {
  id: string;
  title: string;
  isCompleted: boolean;
  position: number;
}

interface TaskChecklistProps {
  taskId: string;
  checklists: ChecklistItem[];
}

export default function TaskChecklist({
  taskId,
  checklists,
}: TaskChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(checklists);

  const [newItem, setNewItem] = useState("");
  const [adding, setAdding] = useState(false);

  function handleToggle(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isCompleted: !item.isCompleted,
            }
          : item,
      ),
    );

    
    // updateChecklist(id, {
    //   isCompleted: !item.isCompleted,
    // });
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));

    // DELETE /checklists/:checklistId
  }

  function handleAdd() {
    const title = newItem.trim();

    if (!title) return;

    const item: ChecklistItem = {
      id: `temp-${Date.now()}`,
      title,
      isCompleted: false,
      position: items.length,
    };

    setItems((prev) => [...prev, item]);

    setNewItem("");
    setAdding(false);

    //
    // createChecklist(taskId, {
    //   title,
    //   position: items.length,
    // });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd();
    }

    if (event.key === "Escape") {
      setNewItem("");
      setAdding(false);
    }
  }

  const completedCount = items.filter((item) => item.isCompleted).length;

  const totalCount = items.length;

  const progress =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-muted-foreground" />

          <h3 className="text-sm font-semibold">Checklist</h3>

          {totalCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {completedCount}/{totalCount}
            </span>
          )}
        </div>

        {!adding && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setAdding(true)}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add item
          </Button>
        )}
      </div>

      {totalCount > 0 && (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="text-xs text-muted-foreground">{progress}% completed</p>
        </div>
      )}

      <Separator />

      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-muted/40"
            >
              <Checkbox
                checked={item.isCompleted}
                onCheckedChange={() => handleToggle(item.id)}
              />

              <div className="min-w-0 flex-1">
                <p
                  className={
                    item.isCompleted
                      ? "text-sm text-muted-foreground line-through"
                      : "text-sm"
                  }
                >
                  {item.title}
                </p>
              </div>

              {item.isCompleted && (
                <Check className="h-4 w-4 text-emerald-500" />
              )}

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <ListChecks className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />

          <p className="text-sm font-medium">No checklist items</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Break this task into smaller steps.
          </p>
        </div>
      )}

      {adding && (
        <div className="rounded-lg border bg-muted/30 p-3">
          <Input
            autoFocus
            value={newItem}
            onChange={(event) => setNewItem(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done?"
          />

          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setNewItem("");
                setAdding(false);
              }}
            >
              Cancel
            </Button>

            <Button
              type="button"
              size="sm"
              disabled={!newItem.trim()}
              onClick={handleAdd}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

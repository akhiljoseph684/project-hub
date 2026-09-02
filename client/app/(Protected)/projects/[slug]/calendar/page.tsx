"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getProjectCalendar,
  type ProjectCalendar,
  type CalendarTask,
  type CalendarSprint,
} from "@/services/calendar.service";

import { showErrorToast } from "@/lib/toast";
import { useAppSelector } from "@/redux/hooks";

type CalendarEventType =
  | "TASK"
  | "SPRINT_START"
  | "SPRINT_END"
  | "PROJECT_START"
  | "PROJECT_END";

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: CalendarEventType;
  task?: CalendarTask;
  sprint?: CalendarSprint;
  legend: string
}

const getDateKey = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const isSameDay = (a: Date, b: Date) => {
  return getDateKey(a) === getDateKey(b);
};

const formatMonthYear = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const getMonthDays = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDay = firstDay.getDay();

  const days: Date[] = [];

  for (let i = startDay - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }

  const remaining = 42 - days.length;

  for (let day = 1; day <= remaining; day++) {
    days.push(new Date(year, month + 1, day));
  }

  return days;
};

export default function CalendarPage() {
  const project = useAppSelector((state) => state.project.currentProject);

  if (!project) return;

  const projectId = project?.id;

  const [calendar, setCalendar] = useState<ProjectCalendar | null>(null);

  const [loading, setLoading] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  const loadCalendar = async () => {
    if (!projectId) return;

    try {
      setLoading(true);

      const data = await getProjectCalendar(projectId);

      setCalendar(data);
    } catch (error) {
      console.error("Failed to load calendar:", error);

      showErrorToast("Failed to load project calendar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadCalendar();
    }
  }, [projectId]);

  const events = useMemo<CalendarEvent[]>(() => {
    if (!calendar) return [];

    const result: CalendarEvent[] = [];

    if (calendar.project.startDate) {
      result.push({
        id: `project-start-${calendar.project.id}`,
        date: new Date(calendar.project.startDate),
        title: "Project Start",
        type: "PROJECT_START",
        legend: "📅"
      });
    }

    if (calendar.project.endDate) {
      result.push({
        id: `project-end-${calendar.project.id}`,
        date: new Date(calendar.project.endDate),
        title: "Project End",
        type: "PROJECT_END",
        legend: "📅"
      });
    }

    calendar.tasks.forEach((task) => {
      if (!task.dueDate) return;

      result.push({
        id: `task-${task.id}`,
        date: new Date(task.dueDate),
        title: `${task.key} - ${task.title}`,
        type: "TASK",
        task,
        legend: "📌"
      });
    });

    calendar.sprints.forEach((sprint) => {
      if (sprint.startDate) {
        result.push({
          id: `sprint-start-${sprint.id}`,
          date: new Date(sprint.startDate),
          title: `${sprint.name} starts`,
          type: "SPRINT_START",
          sprint,
          legend: "🚀"
        });
      }

      if (sprint.endDate) {
        result.push({
          id: `sprint-end-${sprint.id}`,
          date: new Date(sprint.endDate),
          title: `${sprint.name} ends`,
          type: "SPRINT_END",
          sprint,
          legend: "🏁"
        });
      }
    });

    return result;
  }, [calendar]);

  const days = useMemo(() => getMonthDays(currentMonth), [currentMonth]);

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.date, day));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
    );
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  if (!project) {
    return (
      <div className="p-6">
        <div className="py-10 text-center text-muted-foreground">
          Loading project...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Calendar</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View project tasks, sprints and important dates.
          </p>
        </div>

        <button
          type="button"
          onClick={goToToday}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Today
        </button>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b p-4">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            ←
          </button>

          <h2 className="text-lg font-semibold">
            {formatMonthYear(currentMonth)}
          </h2>

          <button
            type="button"
            onClick={goToNextMonth}
            className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            →
          </button>
        </div>

        {loading && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Loading calendar...
          </div>
        )}

        {!loading && (
          <div>

            <div className="grid grid-cols-7 border-b">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="border-r p-3 text-center text-xs font-medium text-muted-foreground last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {days.map((day, index) => {
                const dayEvents = getEventsForDay(day);

                const isCurrentMonth =
                  day.getMonth() === currentMonth.getMonth();

                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={`${getDateKey(day)}-${index}`}
                    className={`min-h-[120px] border-b border-r p-2 ${
                      !isCurrentMonth ? "bg-muted/20 text-muted-foreground" : ""
                    }`}
                  >
                    <div className="mb-2 flex justify-end">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                          isToday ? "bg-primary text-primary-foreground" : ""
                        }`}
                      >
                        {day.getDate()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {dayEvents.slice(0, 4).map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => setSelectedEvent(event)}
                          className="w-full truncate rounded-md bg-muted px-2 py-1 text-left text-xs hover:bg-muted/70"
                        >
                          {event.legend + " " + event.title}
                        </button>
                      ))}

                      {dayEvents.length > 4 && (
                        <p className="px-2 text-xs text-muted-foreground">
                          +{dayEvents.length - 4} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span>📌 Task due date</span>

        <span>🚀 Sprint start</span>

        <span>🏁 Sprint end</span>

        <span>📅 Project dates</span>
      </div>

      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  {selectedEvent.type.replace("_", " ")}
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {selectedEvent.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="rounded-md px-2 py-1 text-lg text-muted-foreground hover:bg-muted"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 rounded-lg border p-4">
              <p className="text-xs text-muted-foreground">Date</p>

              <p className="mt-1 text-sm font-medium">
                {selectedEvent.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Task Details */}

            {selectedEvent.task && (
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Task</p>

                  <p className="text-sm font-medium">
                    {selectedEvent.task.key}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Status</p>

                  <p className="text-sm">{selectedEvent.task.status?.name}</p>
                </div>

                {selectedEvent.task.priority && (
                  <div>
                    <p className="text-xs text-muted-foreground">Priority</p>

                    <p className="text-sm">{selectedEvent.task.priority}</p>
                  </div>
                )}

                {selectedEvent.task.sprint && (
                  <div>
                    <p className="text-xs text-muted-foreground">Sprint</p>

                    <p className="text-sm">{selectedEvent.task.sprint.name}</p>
                  </div>
                )}
              </div>
            )}

            {/* Sprint Details */}

            {selectedEvent.sprint && (
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Sprint</p>

                  <p className="text-sm font-medium">
                    {selectedEvent.sprint.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Status</p>

                  <p className="text-sm">{selectedEvent.sprint.status}</p>
                </div>

                {selectedEvent.sprint.goal && (
                  <div>
                    <p className="text-xs text-muted-foreground">Goal</p>

                    <p className="text-sm">{selectedEvent.sprint.goal}</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

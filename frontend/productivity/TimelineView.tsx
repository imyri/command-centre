"use client";

import { useEffect, useMemo, useState } from "react";

import { api } from "@/services/api/client";

type Task = {
  id: string;
  title: string;
  status: string;
  priority: number;
  created_at: string | null;
  updated_at: string | null;
};

function safeDate(v: string | null) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function TimelineView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<Task[]>("/productivity/tasks")
      .then((d) => {
        if (!cancelled) setTasks(d);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "tasks_fetch_failed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ordered = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const au = safeDate(a.updated_at)?.getTime() ?? 0;
      const bu = safeDate(b.updated_at)?.getTime() ?? 0;
      return bu - au;
    });
  }, [tasks]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-200">Tasks — Timeline</div>
        <div className="text-xs text-zinc-500">/productivity/tasks</div>
      </div>

      {error ? <div className="mt-3 text-sm text-red-400">{error}</div> : null}

      <div className="mt-3 space-y-2">
        {ordered.length === 0 ? (
          <div className="text-sm text-zinc-500">No tasks yet.</div>
        ) : (
          ordered.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg bg-zinc-900/40 px-3 py-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{t.title}</div>
                <div className="mt-1 text-xs text-zinc-600">{t.status}</div>
              </div>
              <div className="text-right text-xs text-zinc-500">
                <div>p{t.priority}</div>
                <div className="mt-1">{safeDate(t.updated_at)?.toLocaleString() ?? "—"}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


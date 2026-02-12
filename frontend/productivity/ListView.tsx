"use client";

import { useEffect, useMemo, useState } from "react";

import { api } from "@/services/api/client";

type Task = {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: number;
  created_at: string | null;
  updated_at: string | null;
};

export function ListView() {
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
    return [...tasks].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }, [tasks]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-200">Tasks — List</div>
        <div className="text-xs text-zinc-500">/productivity/tasks</div>
      </div>

      {error ? <div className="mt-3 text-sm text-red-400">{error}</div> : null}

      <div className="mt-3 space-y-2">
        {ordered.length === 0 ? (
          <div className="text-sm text-zinc-500">No tasks yet.</div>
        ) : (
          ordered.map((t) => (
            <div key={t.id} className="rounded-lg bg-zinc-900/40 px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium">{t.title}</div>
                <div className="text-xs text-zinc-400">
                  {t.status} • p{t.priority}
                </div>
              </div>
              {t.description ? <div className="mt-1 text-xs text-zinc-500">{t.description}</div> : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}


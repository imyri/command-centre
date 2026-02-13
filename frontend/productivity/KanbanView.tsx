"use client";

import { useEffect, useMemo, useState } from "react";

import { api } from "@/services/api/client";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: number;
};

const COLUMNS: Array<{ key: string; label: string }> = [
  { key: "todo", label: "Todo" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" }
];

export function KanbanView() {
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

  const grouped = useMemo(() => {
    const m = new Map<string, Task[]>();
    for (const c of COLUMNS) m.set(c.key, []);
    for (const t of tasks) (m.get(t.status) ?? m.get("todo")!).push(t);
    for (const [k, v] of m.entries()) m.set(k, v.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)));
    return m;
  }, [tasks]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-200">Tasks — Kanban</div>
        <div className="text-xs text-zinc-500">/productivity/tasks</div>
      </div>

      {error ? <div className="mt-3 text-sm text-red-400">{error}</div> : null}

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        {COLUMNS.map((c) => (
          <div key={c.key} className="rounded-lg border border-zinc-800 bg-zinc-950/20 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{c.label}</div>
            <div className="mt-2 space-y-2">
              {(grouped.get(c.key) ?? []).length === 0 ? (
                <div className="text-sm text-zinc-600">—</div>
              ) : (
                (grouped.get(c.key) ?? []).map((t) => (
                  <div key={t.id} className="rounded-lg bg-zinc-900/40 px-3 py-2">
                    <div className="text-sm font-medium">{t.title}</div>
                    {t.description ? <div className="mt-1 text-xs text-zinc-500">{t.description}</div> : null}
                    <div className="mt-2 text-[11px] text-zinc-600">p{t.priority}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


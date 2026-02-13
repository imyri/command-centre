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

  // New function to handle deletion
  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation(); // Stop the click from triggering other things
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      // 1. Tell Backend to delete
      await api.delete(`/productivity/tasks/${id}`);
      
      // 2. Remove from Frontend immediately (so it feels fast)
      setTasks((current) => current.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  }

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
            <div key={t.id} className="group relative rounded-lg bg-zinc-900/40 px-3 py-2 transition-colors hover:bg-zinc-900/60">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-zinc-200">{t.title}</div>
                  <div className="text-xs text-zinc-500">
                    {t.status} • p{t.priority}
                  </div>
                  {t.description ? <div className="mt-1 text-xs text-zinc-500 line-clamp-1">{t.description}</div> : null}
                </div>

                {/* The Delete Button (Only visible on hover) */}
                <button
                  onClick={(e) => handleDelete(t.id, e)}
                  className="hidden rounded p-1 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 group-hover:block"
                  title="Delete Task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
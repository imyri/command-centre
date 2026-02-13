"use client";

import { useMemo, useState } from "react";
import { api } from "@/services/api/client";

import { KanbanView } from "@/productivity/KanbanView";
import { ListView } from "@/productivity/ListView";
import { TimelineView } from "@/productivity/TimelineView";

type ViewKey = "list" | "kanban" | "timeline";

export function ProductivityWidget() {
  const [view, setView] = useState<ViewKey>("list");
  
  // This key is our "Refresher". When we change it, the views reload their data!
  const [refreshKey, setRefreshKey] = useState(0);

  // States for the "Create New Task" popup
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Function to create the task
  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault(); // Stop page from refreshing
    if (!newTaskTitle.trim()) return;

    setIsSaving(true);
    try {
      await api.post("/productivity/tasks", {
        title: newTaskTitle,
        status: "todo",
        priority: 0
      });

      // 1. Close modal
      setIsModalOpen(false);
      setNewTaskTitle("");
      
      // 2. Trigger the list to reload by changing the key
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to create task", err);
      alert("Failed to create task. Check console.");
    } finally {
      setIsSaving(false);
    }
  }

  // We pass 'key={refreshKey}' to the views. 
  // Whenever refreshKey changes, React re-mounts the component, fetching fresh data.
  const content = useMemo(() => {
    switch (view) {
      case "kanban":
        return <KanbanView key={refreshKey} />;
      case "timeline":
        return <TimelineView key={refreshKey} />;
      case "list":
      default:
        return <ListView key={refreshKey} />;
    }
  }, [view, refreshKey]);

  return (
    <>
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-zinc-200">Productivity</div>
            
            {/* The New "Create Task" Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-500"
              title="Create New Task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <ViewButton active={view === "list"} onClick={() => setView("list")}>
              List
            </ViewButton>
            <ViewButton active={view === "kanban"} onClick={() => setView("kanban")}>
              Kanban
            </ViewButton>
            <ViewButton active={view === "timeline"} onClick={() => setView("timeline")}>
              Timeline
            </ViewButton>
          </div>
        </div>

        <div className="mt-4">{content}</div>
      </div>

      {/* The Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-zinc-100">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="mt-4">
              <label className="mb-2 block text-xs text-zinc-400">Task Title</label>
              <input
                autoFocus
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Finish the report..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
              />
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !newTaskTitle.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function ViewButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
        active ? "border-zinc-600 bg-zinc-900/60 text-zinc-100" : "border-zinc-800 bg-zinc-950/30 text-zinc-400 hover:text-zinc-200"
      ].join(" ")}
    >
      {children}
    </button>
  );
}